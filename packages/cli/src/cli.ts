#!/usr/bin/env node
/**
 * Intent Blueprint CLI
 * Generate enterprise documentation from the command line
 */

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import {
  listTemplates,
  generateAllDocuments,
  writeDocuments,
  getTemplatesForScope,
  type TemplateContext,
  SCOPES,
  AUDIENCES,
} from './core/index.js';

const program = new Command();

program
  .name('blueprint')
  .description('Intent Blueprint - Enterprise AI Documentation Generator')
  .version('2.5.0');

// Init command
program
  .command('init')
  .description('Initialize Intent Blueprint in your project')
  .action(async () => {
    console.log(chalk.blue('\n🚀 Intent Blueprint - Project Initialization\n'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        validate: (input: string) => input.length > 0 || 'Project name is required',
      },
      {
        type: 'input',
        name: 'projectDescription',
        message: 'Brief project description:',
        validate: (input: string) => input.length > 0 || 'Description is required',
      },
      {
        type: 'list',
        name: 'scope',
        message: 'Documentation scope:',
        choices: [
          { name: 'MVP (4 essential docs)', value: 'mvp' },
          { name: 'Standard (12 core docs)', value: 'standard' },
          { name: 'Comprehensive (22 docs)', value: 'comprehensive' },
        ],
        default: 'standard',
      },
      {
        type: 'list',
        name: 'audience',
        message: 'Target audience:',
        choices: [
          { name: 'Startup (lean, fast)', value: 'startup' },
          { name: 'Business (balanced)', value: 'business' },
          { name: 'Enterprise (thorough)', value: 'enterprise' },
        ],
        default: 'business',
      },
    ]);

    const spinner = ora('Generating documentation...').start();

    try {
      const context: TemplateContext = {
        projectName: answers.projectName,
        projectDescription: answers.projectDescription,
        scope: answers.scope,
        audience: answers.audience,
      };

      const docs = generateAllDocuments(context);
      const outputDir = `./docs/${answers.projectName.toLowerCase().replace(/\s+/g, '-')}`;
      const files = writeDocuments(docs, outputDir);

      spinner.succeed(chalk.green(`Generated ${docs.length} documents!`));
      console.log(chalk.dim(`\nOutput: ${outputDir}`));
      console.log(chalk.dim(`Files: ${files.length}`));
    } catch (error) {
      spinner.fail(chalk.red('Failed to generate documentation'));
      console.error(error);
      process.exit(1);
    }
  });

// Generate command
program
  .command('generate')
  .description('Generate documentation with options')
  .option('-n, --name <name>', 'Project name')
  .option('-d, --description <desc>', 'Project description')
  .option('-s, --scope <scope>', 'Scope: mvp, standard, comprehensive', 'standard')
  .option('-a, --audience <audience>', 'Audience: startup, business, enterprise', 'business')
  .option('-o, --output <dir>', 'Output directory')
  .action(async (options) => {
    let projectName = options.name;
    let projectDescription = options.description;

    if (!projectName || !projectDescription) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Project name:',
          when: !projectName,
          validate: (input: string) => input.length > 0 || 'Required',
        },
        {
          type: 'input',
          name: 'projectDescription',
          message: 'Project description:',
          when: !projectDescription,
          validate: (input: string) => input.length > 0 || 'Required',
        },
      ]);
      projectName = projectName || answers.projectName;
      projectDescription = projectDescription || answers.projectDescription;
    }

    const spinner = ora('Generating documentation...').start();

    try {
      const context: TemplateContext = {
        projectName,
        projectDescription,
        scope: options.scope as 'mvp' | 'standard' | 'comprehensive',
        audience: options.audience as 'startup' | 'business' | 'enterprise',
      };

      const docs = generateAllDocuments(context);
      const outputDir = options.output || `./docs/${projectName.toLowerCase().replace(/\s+/g, '-')}`;
      const files = writeDocuments(docs, outputDir);

      spinner.succeed(chalk.green(`Generated ${docs.length} documents!`));
      console.log(chalk.dim(`\nOutput: ${outputDir}`));
    } catch (error) {
      spinner.fail(chalk.red('Generation failed'));
      console.error(error);
      process.exit(1);
    }
  });

// Interview command - Adaptive AI-guided interview
program
  .command('interview')
  .description('Adaptive AI-guided documentation interview with smart detection')
  .option('-q, --quick', 'Quick mode - just name and description')
  .action(async (options) => {
    console.log(chalk.blue('\n🎤 Intent Blueprint - Adaptive Interview\n'));
    console.log(chalk.dim('Answer questions to generate tailored documentation.'));
    console.log(chalk.dim('Questions adapt based on your answers.\n'));

    const { InterviewEngine } = await import('./interview/index.js');
    const engine = new InterviewEngine();

    if (options.quick) {
      // Quick mode - just essentials
      const basicAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: chalk.cyan('Project name:'),
          validate: (input: string) => input.length > 0 || 'Required',
        },
        {
          type: 'editor',
          name: 'projectDescription',
          message: chalk.cyan('Describe your project (opens editor):'),
        },
      ]);

      engine.setAnswers(basicAnswers);
    } else {
      // Full adaptive interview
      const groups = engine.getQuestionGroups();

      for (const group of groups) {
        if (!group.isActive || group.questions.length === 0) continue;

        console.log(chalk.yellow(`\n━━━ ${group.name} ━━━`));
        console.log(chalk.dim(group.description + '\n'));

        for (const question of group.questions) {
          // Skip if already answered or condition not met
          const state = engine.getState();
          if (state.answers[question.id] !== undefined) continue;

          const promptConfig: Record<string, unknown> = {
            name: 'answer',
            message: chalk.cyan(question.text),
          };

          if (question.hint) {
            promptConfig.message += chalk.dim(` (${question.hint})`);
          }

          switch (question.type) {
            case 'text':
              promptConfig.type = 'input';
              if (question.default) promptConfig.default = question.default;
              break;
            case 'editor':
              promptConfig.type = 'editor';
              break;
            case 'select':
              promptConfig.type = 'list';
              promptConfig.choices = question.options || [];
              break;
            case 'multiselect':
              promptConfig.type = 'checkbox';
              promptConfig.choices = question.options || [];
              break;
            case 'confirm':
              promptConfig.type = 'confirm';
              promptConfig.default = question.default ?? false;
              break;
            case 'number':
              promptConfig.type = 'number';
              if (question.default) promptConfig.default = question.default;
              break;
          }

          try {
            const { answer } = await inquirer.prompt([promptConfig]);
            engine.answer(question.id, answer);
          } catch {
            // User cancelled
            break;
          }
        }
      }
    }

    // Complete interview and show results
    const result = engine.complete();

    console.log(chalk.green('\n✅ Interview complete!\n'));

    // Show detected context
    console.log(chalk.yellow('━━━ Analysis ━━━'));
    console.log(`  Project Type: ${chalk.cyan(result.detected.projectType)}`);
    console.log(`  Complexity: ${chalk.cyan(result.detected.complexity)}`);
    console.log(`  Suggested Scope: ${chalk.cyan(result.detected.suggestedScope)}`);
    console.log(`  Confidence: ${chalk.cyan(result.detected.confidence + '%')}`);

    if (result.detected.detectedTechnologies.length > 0) {
      console.log(`  Technologies: ${chalk.cyan(result.detected.detectedTechnologies.join(', '))}`);
    }

    // Show gap analysis
    if (result.gaps.missingRecommended.length > 0) {
      console.log(chalk.yellow('\n━━━ Recommendations ━━━'));
      for (const missing of result.gaps.missingRecommended) {
        console.log(`  ${chalk.dim('•')} Consider adding: ${missing}`);
      }
    }

    if (result.gaps.suggestions.length > 0) {
      for (const suggestion of result.gaps.suggestions) {
        console.log(`  ${chalk.dim('•')} ${suggestion}`);
      }
    }

    // Confirm generation
    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: '\nGenerate documentation now?',
        default: true,
      },
    ]);

    if (proceed) {
      const spinner = ora('Generating documentation...').start();

      try {
        const context = engine.toTemplateContext();
        const docs = generateAllDocuments(context);
        const outputDir = `./docs/${context.projectName.toLowerCase().replace(/\s+/g, '-')}`;
        const files = writeDocuments(docs, outputDir);

        spinner.succeed(chalk.green(`Generated ${docs.length} documents!`));
        console.log(chalk.dim(`\nOutput: ${outputDir}`));
        console.log(chalk.dim(`Files: ${files.length}`));

        // Show what was generated
        console.log(chalk.yellow('\n━━━ Documents Generated ━━━'));
        for (const doc of docs) {
          console.log(`  ${chalk.dim('•')} ${doc.name} (${doc.category})`);
        }
      } catch (error) {
        spinner.fail(chalk.red('Generation failed'));
        console.error(error);
        process.exit(1);
      }
    }
  });

// List command
program
  .command('list')
  .description('List available templates')
  .option('-s, --scope <scope>', 'Filter by scope: mvp, standard, comprehensive')
  .action((options) => {
    console.log(chalk.blue('\n📚 Available Templates\n'));

    const templates = options.scope ? getTemplatesForScope(options.scope) : listTemplates();

    const grouped = templates.reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = [];
      acc[t.category].push(t);
      return acc;
    }, {} as Record<string, typeof templates>);

    for (const [category, temps] of Object.entries(grouped)) {
      console.log(chalk.yellow(`\n${category}`));
      for (const t of temps) {
        console.log(`  ${chalk.cyan(t.id.padEnd(25))} ${t.name}`);
      }
    }

    console.log(chalk.dim(`\nTotal: ${templates.length} templates`));
  });

// Export command - GitHub, Linear, and Jira integration
program
  .command('export <target>')
  .description('Export to GitHub, Linear, or Jira (issues, milestones, sprints)')
  .option('-p, --project <name>', 'Project name')
  .option('-d, --docs <dir>', 'Generated docs directory')
  .option('-t, --token <token>', 'API token (or use GITHUB_TOKEN / LINEAR_API_KEY / JIRA_API_TOKEN env)')
  .option('-o, --owner <owner>', 'Repository owner (GitHub)')
  .option('-r, --repo <repo>', 'Repository name (GitHub)')
  .option('--team <id>', 'Linear team ID')
  .option('--base-url <url>', 'Jira instance URL (e.g., https://your-domain.atlassian.net)')
  .option('--email <email>', 'Jira user email')
  .option('--project-key <key>', 'Jira project key')
  .option('--dry-run', 'Preview what would be exported without making changes')
  .option('--no-issues', 'Skip creating issues')
  .option('--no-milestones', 'Skip creating milestones/cycles/sprints')
  .option('--no-labels', 'Skip creating labels/components')
  .option('--no-pr-templates', 'Skip creating PR templates (GitHub only)')
  .option('--create-project', 'Create a new project in Linear')
  .option('--create-epic', 'Create an Epic in Jira')
  .option('--create-versions', 'Create versions/releases in Jira')
  .action(async (target, options) => {
    if (target !== 'github' && target !== 'linear' && target !== 'jira') {
      console.log(chalk.yellow(`\n⚠️  Export to ${target} not supported.\n`));
      console.log(chalk.dim('Currently supported: github, linear, jira'));
      return;
    }

    // Handle Linear export
    if (target === 'linear') {
      await handleLinearExport(options);
      return;
    }

    // Handle Jira export
    if (target === 'jira') {
      await handleJiraExport(options);
      return;
    }

    console.log(chalk.blue('\n🚀 Intent Blueprint - GitHub Export\n'));

    const { GitHubExporter } = await import('./integrations/github/index.js');

    // Get GitHub config
    const token = options.token || process.env.GITHUB_TOKEN;
    if (!token) {
      console.log(chalk.red('Error: GitHub token required'));
      console.log(chalk.dim('Use --token or set GITHUB_TOKEN environment variable'));
      process.exit(1);
    }

    let owner = options.owner;
    let repo = options.repo;

    // Try to detect from git remote if not specified
    if (!owner || !repo) {
      try {
        const { execSync } = await import('child_process');
        const remote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
        const match = remote.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
        if (match) {
          owner = owner || match[1];
          repo = repo || match[2];
        }
      } catch {
        // Ignore
      }
    }

    if (!owner || !repo) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'owner',
          message: 'Repository owner:',
          when: !owner,
          validate: (input: string) => input.length > 0 || 'Required',
        },
        {
          type: 'input',
          name: 'repo',
          message: 'Repository name:',
          when: !repo,
          validate: (input: string) => input.length > 0 || 'Required',
        },
      ]);
      owner = owner || answers.owner;
      repo = repo || answers.repo;
    }

    // Read generated docs
    const docsDir = options.docs || './docs';
    const { readdirSync, readFileSync, existsSync } = await import('fs');
    const { join } = await import('path');

    if (!existsSync(docsDir)) {
      console.log(chalk.red(`Error: Docs directory not found: ${docsDir}`));
      console.log(chalk.dim('Generate docs first with: blueprint generate'));
      process.exit(1);
    }

    // Find project folder
    const projects = readdirSync(docsDir).filter((f) => {
      const path = join(docsDir, f);
      return existsSync(path) && readdirSync(path).some((f) => f.endsWith('.md'));
    });

    if (projects.length === 0) {
      console.log(chalk.red('Error: No documentation projects found'));
      process.exit(1);
    }

    let projectDir = projects[0];
    if (projects.length > 1 && !options.project) {
      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'project',
          message: 'Select project:',
          choices: projects,
        },
      ]);
      projectDir = answer.project;
    } else if (options.project) {
      projectDir = options.project;
    }

    const projectPath = join(docsDir, projectDir);
    const files = readdirSync(projectPath).filter((f) => f.endsWith('.md'));

    const documents = files.map((f) => ({
      name: f.replace('.md', '').replace(/-/g, ' '),
      filename: f,
      content: readFileSync(join(projectPath, f), 'utf-8'),
      category: 'Generated',
    }));

    console.log(`Found ${documents.length} documents in ${projectDir}\n`);

    const exporter = new GitHubExporter(
      { token, owner, repo },
      {
        createIssues: options.issues !== false,
        createMilestones: options.milestones !== false,
        createLabels: options.labels !== false,
        createPRTemplates: options.prTemplates !== false,
        dryRun: options.dryRun,
      }
    );

    if (options.dryRun) {
      console.log(chalk.yellow('Dry run - showing what would be created:\n'));
      const preview = await exporter.preview(documents, {
        projectName: projectDir,
        projectDescription: '',
        scope: 'standard',
        audience: 'business',
      });

      console.log(chalk.cyan('Labels:'), preview.labels.length);
      console.log(chalk.cyan('Tasks:'), preview.tasks.length);
      console.log(chalk.cyan('Milestones:'), preview.phases.length);
      console.log(chalk.cyan('PR Templates:'), preview.prTemplates.join(', '));
      return;
    }

    const spinner = ora('Exporting to GitHub...').start();

    try {
      const result = await exporter.export(documents, {
        projectName: projectDir,
        projectDescription: '',
        scope: 'standard',
        audience: 'business',
      });

      if (result.success) {
        spinner.succeed(chalk.green('Export complete!'));
        console.log(`\n  Labels created: ${result.created.labels}`);
        console.log(`  Issues created: ${result.created.issues}`);
        console.log(`  Milestones created: ${result.created.milestones}`);
        console.log(`  PR templates created: ${result.created.prTemplates}`);

        if (result.urls.length > 0) {
          console.log(chalk.cyan('\nCreated issues:'));
          for (const url of result.urls.slice(0, 5)) {
            console.log(`  ${url}`);
          }
          if (result.urls.length > 5) {
            console.log(chalk.dim(`  ... and ${result.urls.length - 5} more`));
          }
        }
      } else {
        spinner.fail(chalk.red('Export failed'));
        for (const error of result.errors) {
          console.log(chalk.red(`  ${error}`));
        }
      }
    } catch (error) {
      spinner.fail(chalk.red('Export failed'));
      console.error(error);
      process.exit(1);
    }
  });

// GitHub Action command
program
  .command('github-action')
  .description('Generate GitHub Action workflow for doc automation')
  .option('-p, --project <name>', 'Project name', 'My Project')
  .option('-s, --scope <scope>', 'Documentation scope', 'standard')
  .option('-o, --output <dir>', 'Output directory', '.github/workflows')
  .action(async (options) => {
    console.log(chalk.blue('\n📋 Generating GitHub Action workflow...\n'));

    const { generateAllActions } = await import('./integrations/github/index.js');
    const { mkdirSync, writeFileSync, existsSync } = await import('fs');
    const { join } = await import('path');

    const actions = generateAllActions({
      projectName: options.project,
      scope: options.scope,
      audience: 'business',
      onPush: true,
      createIssues: true,
    });

    if (!existsSync(options.output)) {
      mkdirSync(options.output, { recursive: true });
    }

    for (const [filename, content] of Object.entries(actions)) {
      const path = join(options.output, filename);
      writeFileSync(path, content);
      console.log(chalk.green(`Created: ${path}`));
    }

    console.log(chalk.dim('\nCommit these files to enable automated documentation.'));
  });

// Sync command (placeholder)
program
  .command('sync')
  .description('Bi-directional sync with project management tools')
  .action(() => {
    console.log(chalk.yellow('\n⚠️  Sync feature coming soon!\n'));
  });

/**
 * Handle Linear export
 */
async function handleLinearExport(options: Record<string, unknown>) {
  console.log(chalk.blue('\n📋 Intent Blueprint - Linear Export\n'));

  const { LinearExporter } = await import('./integrations/linear/index.js');

  // Get Linear API key
  const apiKey = (options.token as string) || process.env.LINEAR_API_KEY;
  if (!apiKey) {
    console.log(chalk.red('Error: Linear API key required'));
    console.log(chalk.dim('Use --token or set LINEAR_API_KEY environment variable'));
    console.log(chalk.dim('Get your API key from: https://linear.app/settings/api'));
    process.exit(1);
  }

  // Get team ID
  let teamId = options.team as string;
  if (!teamId) {
    // Try to list teams and let user select
    console.log(chalk.dim('No team specified. Fetching available teams...\n'));

    const { LinearClient } = await import('./integrations/linear/index.js');
    const tempClient = new LinearClient({ apiKey, teamId: '' });

    try {
      const teams = await tempClient.listTeams();

      if (teams.length === 0) {
        console.log(chalk.red('Error: No teams found in your Linear workspace'));
        process.exit(1);
      }

      if (teams.length === 1) {
        teamId = teams[0].id;
        console.log(chalk.dim(`Using team: ${teams[0].name} (${teams[0].key})\n`));
      } else {
        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'team',
            message: 'Select team:',
            choices: teams.map((t) => ({ name: `${t.name} (${t.key})`, value: t.id })),
          },
        ]);
        teamId = answer.team;
      }
    } catch (error) {
      console.log(chalk.red('Error: Could not fetch teams. Check your API key.'));
      console.error(error);
      process.exit(1);
    }
  }

  // Read generated docs
  const docsDir = (options.docs as string) || './docs';
  const { readdirSync, readFileSync, existsSync } = await import('fs');
  const { join } = await import('path');

  if (!existsSync(docsDir)) {
    console.log(chalk.red(`Error: Docs directory not found: ${docsDir}`));
    console.log(chalk.dim('Generate docs first with: blueprint generate'));
    process.exit(1);
  }

  // Find project folder
  const projects = readdirSync(docsDir).filter((f) => {
    const path = join(docsDir, f);
    return existsSync(path) && readdirSync(path).some((file) => file.endsWith('.md'));
  });

  if (projects.length === 0) {
    console.log(chalk.red('Error: No documentation projects found'));
    process.exit(1);
  }

  let projectDir = projects[0];
  if (projects.length > 1 && !options.project) {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'project',
        message: 'Select project:',
        choices: projects,
      },
    ]);
    projectDir = answer.project;
  } else if (options.project) {
    projectDir = options.project as string;
  }

  const projectPath = join(docsDir, projectDir);
  const files = readdirSync(projectPath).filter((f) => f.endsWith('.md'));

  const documents = files.map((f) => ({
    name: f.replace('.md', '').replace(/-/g, ' '),
    content: readFileSync(join(projectPath, f), 'utf-8'),
  }));

  console.log(`Found ${documents.length} documents in ${projectDir}\n`);

  const exporter = new LinearExporter({ apiKey, teamId });

  if (options.dryRun) {
    console.log(chalk.yellow('Dry run - showing what would be created:\n'));
    const preview = await exporter.preview(documents, {
      createProject: options.createProject as boolean,
      projectName: projectDir,
      createCycles: options.milestones !== false,
      syncLabels: options.labels !== false,
      dryRun: true,
    });

    console.log(chalk.cyan('Labels:'), preview.labels.length);
    if (preview.project) {
      console.log(chalk.cyan('Project:'), preview.project.name);
    }
    console.log(chalk.cyan('Cycles:'), preview.cycles.length);
    console.log(chalk.cyan('Issues:'), preview.issues.length);

    if (preview.issues.length > 0) {
      console.log(chalk.dim('\nSample issues:'));
      for (const issue of preview.issues.slice(0, 5)) {
        console.log(`  ${chalk.dim('•')} ${issue.title}`);
      }
      if (preview.issues.length > 5) {
        console.log(chalk.dim(`  ... and ${preview.issues.length - 5} more`));
      }
    }
    return;
  }

  const spinner = ora('Exporting to Linear...').start();

  try {
    const result = await exporter.export(documents, {
      createProject: options.createProject as boolean,
      projectName: projectDir,
      createCycles: options.milestones !== false,
      syncLabels: options.labels !== false,
      dryRun: false,
    });

    if (result.errors.length === 0) {
      spinner.succeed(chalk.green('Export complete!'));
      console.log(`\n  Labels synced: ${result.labels.length}`);
      if (result.project) {
        console.log(`  Project created: ${result.project.name}`);
      }
      console.log(`  Cycles created: ${result.cycles.length}`);
      console.log(`  Issues created: ${result.issues.length}`);

      if (result.issues.length > 0) {
        console.log(chalk.cyan('\nCreated issues:'));
        for (const issue of result.issues.slice(0, 5)) {
          console.log(`  ${issue.identifier}: ${issue.title}`);
          if (issue.url !== '#') {
            console.log(chalk.dim(`    ${issue.url}`));
          }
        }
        if (result.issues.length > 5) {
          console.log(chalk.dim(`  ... and ${result.issues.length - 5} more`));
        }
      }
    } else {
      spinner.fail(chalk.red('Export completed with errors'));
      console.log(`\n  Issues created: ${result.issues.length}`);
      console.log(chalk.red('\nErrors:'));
      for (const error of result.errors) {
        console.log(chalk.red(`  ${error}`));
      }
    }
  } catch (error) {
    spinner.fail(chalk.red('Export failed'));
    console.error(error);
    process.exit(1);
  }
}

/**
 * Handle Jira export
 */
async function handleJiraExport(options: Record<string, unknown>) {
  console.log(chalk.blue('\n🎫 Intent Blueprint - Jira Export\n'));

  const { JiraExporter, JiraClient } = await import('./integrations/jira/index.js');

  // Get Jira config
  const apiToken = (options.token as string) || process.env.JIRA_API_TOKEN;
  let baseUrl = options.baseUrl as string;
  let email = options.email as string;
  let projectKey = options.projectKey as string;

  if (!apiToken) {
    console.log(chalk.red('Error: Jira API token required'));
    console.log(chalk.dim('Use --token or set JIRA_API_TOKEN environment variable'));
    console.log(chalk.dim('Get your API token from: https://id.atlassian.com/manage-profile/security/api-tokens'));
    process.exit(1);
  }

  // Prompt for missing Jira config
  if (!baseUrl || !email || !projectKey) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'baseUrl',
        message: 'Jira instance URL (e.g., https://your-domain.atlassian.net):',
        when: !baseUrl,
        validate: (input: string) => input.startsWith('http') || 'Must be a valid URL',
      },
      {
        type: 'input',
        name: 'email',
        message: 'Your Jira email:',
        when: !email,
        validate: (input: string) => input.includes('@') || 'Must be a valid email',
      },
      {
        type: 'input',
        name: 'projectKey',
        message: 'Jira project key (e.g., PROJ):',
        when: !projectKey,
        validate: (input: string) => input.length > 0 || 'Required',
      },
    ]);
    baseUrl = baseUrl || answers.baseUrl;
    email = email || answers.email;
    projectKey = projectKey || answers.projectKey;
  }

  // Verify connection
  try {
    const tempClient = new JiraClient({ baseUrl, email, apiToken, projectKey });
    const user = await tempClient.verify();
    console.log(chalk.dim(`Connected as: ${user.displayName}\n`));
  } catch (error) {
    console.log(chalk.red('Error: Could not connect to Jira. Check your credentials.'));
    console.error(error);
    process.exit(1);
  }

  // Read generated docs
  const docsDir = (options.docs as string) || './docs';
  const { readdirSync, readFileSync, existsSync } = await import('fs');
  const { join } = await import('path');

  if (!existsSync(docsDir)) {
    console.log(chalk.red(`Error: Docs directory not found: ${docsDir}`));
    console.log(chalk.dim('Generate docs first with: blueprint generate'));
    process.exit(1);
  }

  // Find project folder
  const projects = readdirSync(docsDir).filter((f) => {
    const path = join(docsDir, f);
    return existsSync(path) && readdirSync(path).some((file) => file.endsWith('.md'));
  });

  if (projects.length === 0) {
    console.log(chalk.red('Error: No documentation projects found'));
    process.exit(1);
  }

  let projectDir = projects[0];
  if (projects.length > 1 && !options.project) {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'project',
        message: 'Select project:',
        choices: projects,
      },
    ]);
    projectDir = answer.project;
  } else if (options.project) {
    projectDir = options.project as string;
  }

  const projectPath = join(docsDir, projectDir);
  const files = readdirSync(projectPath).filter((f) => f.endsWith('.md'));

  const documents = files.map((f) => ({
    name: f.replace('.md', '').replace(/-/g, ' '),
    content: readFileSync(join(projectPath, f), 'utf-8'),
  }));

  console.log(`Found ${documents.length} documents in ${projectDir}\n`);

  const exporter = new JiraExporter({ baseUrl, email, apiToken, projectKey });

  if (options.dryRun) {
    console.log(chalk.yellow('Dry run - showing what would be created:\n'));
    const preview = await exporter.preview(documents, {
      createEpic: options.createEpic as boolean,
      epicName: projectDir,
      createSprints: options.milestones !== false,
      createVersions: options.createVersions as boolean,
      syncComponents: options.labels !== false,
      addLabels: options.labels !== false,
      dryRun: true,
    });

    console.log(chalk.cyan('Components:'), preview.components.length);
    if (preview.epics.length > 0) {
      console.log(chalk.cyan('Epic:'), preview.epics[0].fields.summary);
    }
    if (preview.versions.length > 0) {
      console.log(chalk.cyan('Versions:'), preview.versions.map(v => v.name).join(', '));
    }
    console.log(chalk.cyan('Sprints:'), preview.sprints.length);
    console.log(chalk.cyan('Stories:'), preview.stories.length);
    console.log(chalk.cyan('Sub-tasks:'), preview.tasks.length);

    if (preview.stories.length > 0) {
      console.log(chalk.dim('\nSample stories:'));
      for (const story of preview.stories.slice(0, 5)) {
        console.log(`  ${chalk.dim('•')} ${story.fields.summary}`);
      }
      if (preview.stories.length > 5) {
        console.log(chalk.dim(`  ... and ${preview.stories.length - 5} more`));
      }
    }
    return;
  }

  const spinner = ora('Exporting to Jira...').start();

  try {
    const result = await exporter.export(documents, {
      createEpic: options.createEpic as boolean,
      epicName: projectDir,
      createSprints: options.milestones !== false,
      createVersions: options.createVersions as boolean,
      syncComponents: options.labels !== false,
      addLabels: options.labels !== false,
      dryRun: false,
    });

    if (result.errors.length === 0) {
      spinner.succeed(chalk.green('Export complete!'));
      console.log(`\n  Components synced: ${result.components.length}`);
      if (result.epics.length > 0) {
        console.log(`  Epic created: ${result.epics[0].key}`);
      }
      console.log(`  Versions created: ${result.versions.length}`);
      console.log(`  Sprints created: ${result.sprints.length}`);
      console.log(`  Stories created: ${result.stories.length}`);
      console.log(`  Sub-tasks created: ${result.tasks.length}`);

      if (result.stories.length > 0) {
        console.log(chalk.cyan('\nCreated stories:'));
        for (const story of result.stories.slice(0, 5)) {
          console.log(`  ${story.key}: ${story.fields.summary}`);
          console.log(chalk.dim(`    ${baseUrl}/browse/${story.key}`));
        }
        if (result.stories.length > 5) {
          console.log(chalk.dim(`  ... and ${result.stories.length - 5} more`));
        }
      }
    } else {
      spinner.fail(chalk.red('Export completed with errors'));
      console.log(`\n  Stories created: ${result.stories.length}`);
      console.log(chalk.red('\nErrors:'));
      for (const error of result.errors) {
        console.log(chalk.red(`  ${error}`));
      }
    }
  } catch (error) {
    spinner.fail(chalk.red('Export failed'));
    console.error(error);
    process.exit(1);
  }
}

program.parse();
