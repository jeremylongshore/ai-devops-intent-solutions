/**
 * Slack Bot for Intent Blueprint Docs
 *
 * Usage:
 * - /blueprint <project-name> - Generate docs with interactive modal
 * - @Blueprint generate <name> <description> - Direct generation
 */

import { App, LogLevel } from '@slack/bolt';
import { DocGenerator } from '../shared/generator.js';
import { DocDelivery } from '../shared/delivery.js';

export interface SlackBotConfig {
  token: string;
  signingSecret: string;
  appToken?: string; // For socket mode
  smtp?: {
    host: string;
    port: number;
    auth: { user: string; pass: string };
  };
}

export class SlackBot {
  private app: App;
  private generator: DocGenerator;
  private delivery: DocDelivery;

  constructor(config: SlackBotConfig) {
    this.app = new App({
      token: config.token,
      signingSecret: config.signingSecret,
      socketMode: !!config.appToken,
      appToken: config.appToken,
      logLevel: LogLevel.INFO,
    });

    this.generator = new DocGenerator();
    this.delivery = new DocDelivery({ smtp: config.smtp });

    this.registerCommands();
    this.registerActions();
  }

  private registerCommands(): void {
    // Slash command: /blueprint
    this.app.command('/blueprint', async ({ command, ack, client }) => {
      await ack();

      await client.views.open({
        trigger_id: command.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'generate_docs',
          title: { type: 'plain_text', text: 'Generate Docs' },
          submit: { type: 'plain_text', text: 'Generate' },
          blocks: [
            {
              type: 'input',
              block_id: 'project_name',
              element: {
                type: 'plain_text_input',
                action_id: 'input',
                placeholder: { type: 'plain_text', text: 'My Awesome Project' },
              },
              label: { type: 'plain_text', text: 'Project Name' },
            },
            {
              type: 'input',
              block_id: 'project_description',
              element: {
                type: 'plain_text_input',
                action_id: 'input',
                multiline: true,
                placeholder: { type: 'plain_text', text: 'Describe your project...' },
              },
              label: { type: 'plain_text', text: 'Description' },
            },
            {
              type: 'input',
              block_id: 'scope',
              element: {
                type: 'static_select',
                action_id: 'select',
                initial_option: {
                  text: { type: 'plain_text', text: 'Standard (12 docs)' },
                  value: 'standard',
                },
                options: [
                  { text: { type: 'plain_text', text: 'MVP (4 docs)' }, value: 'mvp' },
                  { text: { type: 'plain_text', text: 'Standard (12 docs)' }, value: 'standard' },
                  { text: { type: 'plain_text', text: 'Comprehensive (22 docs)' }, value: 'comprehensive' },
                ],
              },
              label: { type: 'plain_text', text: 'Documentation Scope' },
            },
            {
              type: 'input',
              block_id: 'email',
              optional: true,
              element: {
                type: 'plain_text_input',
                action_id: 'input',
                placeholder: { type: 'plain_text', text: 'your@email.com (optional)' },
              },
              label: { type: 'plain_text', text: 'Email (for delivery)' },
            },
          ],
        },
      });
    });
  }

  private registerActions(): void {
    // Modal submission handler
    this.app.view('generate_docs', async ({ ack, view, client, body }) => {
      await ack();

      const values = view.state.values;
      const projectName = values.project_name.input.value!;
      const projectDescription = values.project_description.input.value!;
      const scope = values.scope.select.selected_option!.value as 'mvp' | 'standard' | 'comprehensive';
      const email = values.email?.input?.value;
      const userId = body.user.id;

      // Notify user that generation is starting
      await client.chat.postMessage({
        channel: userId,
        text: `Generating documentation for "${projectName}"...`,
      });

      try {
        // Generate docs
        const result = await this.generator.generate({
          projectName,
          projectDescription,
          scope,
        });

        // Upload to user's DM
        await client.files.uploadV2({
          channel_id: userId,
          file: this.delivery.getZipBuffer(result.zipPath),
          filename: `${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-docs.zip`,
          title: `${projectName} Documentation`,
          initial_comment: `Here's your documentation package for "${projectName}"!\n\n` +
            `- ${result.files.length} documents generated\n` +
            `- Scope: ${scope}\n\n` +
            `Extract the ZIP to view all markdown files.`,
        });

        // Email if requested
        if (email) {
          const emailResult = await this.delivery.sendEmail(email, projectName, result.zipPath);
          if (emailResult.success) {
            await client.chat.postMessage({
              channel: userId,
              text: `Docs also sent to ${email}`,
            });
          }
        }

        // Cleanup
        this.generator.cleanup(result.outputDir, result.zipPath);

      } catch (error) {
        await client.chat.postMessage({
          channel: userId,
          text: `Error generating docs: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    });
  }

  async start(port: number = 3000): Promise<void> {
    await this.app.start(port);
    console.log(`Slack bot running on port ${port}`);
  }
}

// CLI runner
if (import.meta.url === `file://${process.argv[1]}`) {
  const bot = new SlackBot({
    token: process.env.SLACK_BOT_TOKEN!,
    signingSecret: process.env.SLACK_SIGNING_SECRET!,
    appToken: process.env.SLACK_APP_TOKEN,
  });
  bot.start(Number(process.env.PORT) || 3000);
}
