/**
 * Discord Bot for Intent Blueprint Docs
 *
 * Commands:
 * - /blueprint <name> <description> [scope] - Generate documentation
 * - /blueprint-help - Show usage information
 */

import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  AttachmentBuilder,
  EmbedBuilder,
  type Interaction,
} from 'discord.js';
import { DocGenerator } from '../shared/generator.js';
import { DocDelivery } from '../shared/delivery.js';

export interface DiscordBotConfig {
  token: string;
  clientId: string;
  guildId?: string; // For development
  smtp?: {
    host: string;
    port: number;
    auth: { user: string; pass: string };
  };
}

export class DiscordBot {
  private client: Client;
  private generator: DocGenerator;
  private delivery: DocDelivery;
  private config: DiscordBotConfig;

  constructor(config: DiscordBotConfig) {
    this.config = config;
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds],
    });
    this.generator = new DocGenerator();
    this.delivery = new DocDelivery({ smtp: config.smtp });

    this.registerEventHandlers();
  }

  private registerEventHandlers(): void {
    this.client.on('ready', () => {
      console.log(`Discord bot logged in as ${this.client.user?.tag}`);
    });

    this.client.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      await this.handleCommand(interaction);
    });
  }

  private async handleCommand(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'blueprint') {
      await this.handleGenerate(interaction);
    } else if (commandName === 'blueprint-help') {
      await this.handleHelp(interaction);
    }
  }

  private async handleGenerate(interaction: any): Promise<void> {
    const projectName = interaction.options.getString('name', true);
    const projectDescription = interaction.options.getString('description', true);
    const scope = interaction.options.getString('scope') || 'standard';
    const email = interaction.options.getString('email');

    await interaction.deferReply();

    try {
      // Generate docs
      const result = await this.generator.generate({
        projectName,
        projectDescription,
        scope: scope as 'mvp' | 'standard' | 'comprehensive',
      });

      const stats = this.delivery.getFileStats(result.zipPath);

      // Create embed
      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle(`Documentation Generated`)
        .setDescription(`Your docs for **${projectName}** are ready!`)
        .addFields(
          { name: 'Documents', value: `${result.files.length} files`, inline: true },
          { name: 'Scope', value: scope, inline: true },
          { name: 'Size', value: stats.size, inline: true }
        )
        .setFooter({ text: 'Intent Blueprint Docs' })
        .setTimestamp();

      // Create attachment
      const attachment = new AttachmentBuilder(result.zipPath, {
        name: `${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-docs.zip`,
        description: `Documentation for ${projectName}`,
      });

      await interaction.editReply({
        embeds: [embed],
        files: [attachment],
      });

      // Email if requested
      if (email) {
        const emailResult = await this.delivery.sendEmail(email, projectName, result.zipPath);
        if (emailResult.success) {
          await interaction.followUp({
            content: `Docs also sent to ${email}`,
            ephemeral: true,
          });
        }
      }

      // Cleanup
      this.generator.cleanup(result.outputDir, result.zipPath);

    } catch (error) {
      await interaction.editReply({
        content: `Error generating docs: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }

  private async handleHelp(interaction: any): Promise<void> {
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Intent Blueprint Docs')
      .setDescription('Generate professional documentation for your projects')
      .addFields(
        {
          name: '/blueprint',
          value: 'Generate documentation\n`/blueprint name:"My Project" description:"A cool app" scope:standard`',
        },
        {
          name: 'Scopes',
          value: '- **mvp**: 4 essential docs\n- **standard**: 12 core docs\n- **comprehensive**: 22 complete docs',
        },
        {
          name: 'Optional',
          value: 'Add `email:your@email.com` to receive docs via email',
        }
      )
      .setFooter({ text: 'https://github.com/intent-solutions-io/intent-blueprint-docs' });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  async registerCommands(): Promise<void> {
    const commands = [
      new SlashCommandBuilder()
        .setName('blueprint')
        .setDescription('Generate project documentation')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Project name')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('description')
            .setDescription('Project description')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('scope')
            .setDescription('Documentation scope')
            .addChoices(
              { name: 'MVP (4 docs)', value: 'mvp' },
              { name: 'Standard (12 docs)', value: 'standard' },
              { name: 'Comprehensive (22 docs)', value: 'comprehensive' }
            )
        )
        .addStringOption(option =>
          option
            .setName('email')
            .setDescription('Email address for delivery (optional)')
        ),
      new SlashCommandBuilder()
        .setName('blueprint-help')
        .setDescription('Show Intent Blueprint help'),
    ];

    const rest = new REST().setToken(this.config.token);

    try {
      console.log('Registering Discord slash commands...');

      if (this.config.guildId) {
        // Development: guild-specific commands (instant)
        await rest.put(
          Routes.applicationGuildCommands(this.config.clientId, this.config.guildId),
          { body: commands.map(cmd => cmd.toJSON()) }
        );
      } else {
        // Production: global commands (may take up to 1 hour)
        await rest.put(
          Routes.applicationCommands(this.config.clientId),
          { body: commands.map(cmd => cmd.toJSON()) }
        );
      }

      console.log('Commands registered successfully');
    } catch (error) {
      console.error('Failed to register commands:', error);
    }
  }

  async start(): Promise<void> {
    await this.registerCommands();
    await this.client.login(this.config.token);
  }
}

// CLI runner
if (import.meta.url === `file://${process.argv[1]}`) {
  const bot = new DiscordBot({
    token: process.env.DISCORD_TOKEN!,
    clientId: process.env.DISCORD_CLIENT_ID!,
    guildId: process.env.DISCORD_GUILD_ID,
  });
  bot.start();
}
