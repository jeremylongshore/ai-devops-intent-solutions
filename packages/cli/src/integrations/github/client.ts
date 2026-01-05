/**
 * GitHub API Client
 * Handles all GitHub API interactions using Octokit
 */

import { Octokit } from '@octokit/rest';
import type {
  GitHubConfig,
  GitHubLabel,
  GitHubMilestone,
  GitHubIssue,
  ExportResult,
  ExportOptions,
  TaskBreakdown,
  ReleasePhase,
} from './types.js';
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  STANDARD_LABELS,
} from './types.js';

export class GitHubClient {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor(config: GitHubConfig) {
    this.octokit = new Octokit({
      auth: config.token,
      baseUrl: config.baseUrl,
    });
    this.owner = config.owner;
    this.repo = config.repo;
  }

  /**
   * Verify connection and permissions
   */
  async verify(): Promise<{ valid: boolean; error?: string }> {
    try {
      const { data } = await this.octokit.repos.get({
        owner: this.owner,
        repo: this.repo,
      });

      if (!data.permissions?.push) {
        return { valid: false, error: 'No push access to repository' };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Create or update labels
   */
  async ensureLabels(labels: GitHubLabel[]): Promise<{ created: number; updated: number }> {
    let created = 0;
    let updated = 0;

    for (const label of labels) {
      try {
        await this.octokit.issues.createLabel({
          owner: this.owner,
          repo: this.repo,
          name: label.name,
          color: label.color,
          description: label.description,
        });
        created++;
      } catch (error: unknown) {
        // Label might already exist, try to update
        if ((error as { status?: number }).status === 422) {
          try {
            await this.octokit.issues.updateLabel({
              owner: this.owner,
              repo: this.repo,
              name: label.name,
              color: label.color,
              description: label.description,
            });
            updated++;
          } catch {
            // Ignore update errors
          }
        }
      }
    }

    return { created, updated };
  }

  /**
   * Create a milestone
   */
  async createMilestone(milestone: GitHubMilestone): Promise<number | null> {
    try {
      const { data } = await this.octokit.issues.createMilestone({
        owner: this.owner,
        repo: this.repo,
        title: milestone.title,
        description: milestone.description,
        due_on: milestone.dueOn,
        state: milestone.state || 'open',
      });
      return data.number;
    } catch (error: unknown) {
      // Milestone might already exist
      if ((error as { status?: number }).status === 422) {
        const existing = await this.findMilestone(milestone.title);
        return existing;
      }
      return null;
    }
  }

  /**
   * Find milestone by title
   */
  async findMilestone(title: string): Promise<number | null> {
    try {
      const { data } = await this.octokit.issues.listMilestones({
        owner: this.owner,
        repo: this.repo,
        state: 'all',
      });

      const milestone = data.find((m) => m.title === title);
      return milestone?.number || null;
    } catch {
      return null;
    }
  }

  /**
   * Create an issue
   */
  async createIssue(issue: GitHubIssue): Promise<{ number: number; url: string } | null> {
    try {
      const { data } = await this.octokit.issues.create({
        owner: this.owner,
        repo: this.repo,
        title: issue.title,
        body: issue.body,
        labels: issue.labels,
        milestone: issue.milestone,
        assignees: issue.assignees,
      });
      return { number: data.number, url: data.html_url };
    } catch {
      return null;
    }
  }

  /**
   * Create multiple issues from task breakdown
   */
  async createIssuesFromTasks(
    tasks: TaskBreakdown[],
    options: { milestoneId?: number; labelPrefix?: string } = {}
  ): Promise<Array<{ number: number; url: string; title: string }>> {
    const results: Array<{ number: number; url: string; title: string }> = [];

    for (const task of tasks) {
      const labels = ['blueprint', 'task'];

      // Add priority label
      if (task.priority && PRIORITY_LABELS[task.priority]) {
        labels.push(PRIORITY_LABELS[task.priority].name);
      }

      // Add category label
      if (task.category && CATEGORY_LABELS[task.category]) {
        labels.push(CATEGORY_LABELS[task.category].name);
      }

      // Add prefix if specified
      if (options.labelPrefix) {
        labels.push(`${options.labelPrefix}:task`);
      }

      const body = this.formatTaskBody(task);

      const result = await this.createIssue({
        title: task.title,
        body,
        labels,
        milestone: options.milestoneId,
      });

      if (result) {
        results.push({ ...result, title: task.title });
      }
    }

    return results;
  }

  /**
   * Format task body for GitHub issue
   */
  private formatTaskBody(task: TaskBreakdown): string {
    const lines: string[] = [];

    lines.push('## Description');
    lines.push(task.description);
    lines.push('');

    if (task.estimatedHours) {
      lines.push(`**Estimated Time:** ${task.estimatedHours} hours`);
      lines.push('');
    }

    if (task.dependencies && task.dependencies.length > 0) {
      lines.push('## Dependencies');
      for (const dep of task.dependencies) {
        lines.push(`- [ ] ${dep}`);
      }
      lines.push('');
    }

    if (task.acceptanceCriteria && task.acceptanceCriteria.length > 0) {
      lines.push('## Acceptance Criteria');
      for (const ac of task.acceptanceCriteria) {
        lines.push(`- [ ] ${ac}`);
      }
      lines.push('');
    }

    lines.push('---');
    lines.push('*Generated by [Intent Blueprint](https://github.com/intent-solutions-io/intent-blueprint-docs)*');

    return lines.join('\n');
  }

  /**
   * Create milestones from release phases
   */
  async createMilestonesFromPhases(
    phases: ReleasePhase[]
  ): Promise<Array<{ number: number; title: string }>> {
    const results: Array<{ number: number; title: string }> = [];

    for (const phase of phases) {
      const milestoneId = await this.createMilestone({
        title: phase.name,
        description: phase.description,
        dueOn: phase.endDate,
      });

      if (milestoneId) {
        results.push({ number: milestoneId, title: phase.name });
      }
    }

    return results;
  }

  /**
   * Create PR templates
   */
  async createPRTemplates(templates: Array<{ name: string; content: string }>): Promise<number> {
    let created = 0;

    for (const template of templates) {
      try {
        const path = template.name === 'default'
          ? '.github/PULL_REQUEST_TEMPLATE.md'
          : `.github/PULL_REQUEST_TEMPLATE/${template.name}.md`;

        // Check if file exists
        let sha: string | undefined;
        try {
          const { data } = await this.octokit.repos.getContent({
            owner: this.owner,
            repo: this.repo,
            path,
          });
          if ('sha' in data) {
            sha = data.sha;
          }
        } catch {
          // File doesn't exist, that's fine
        }

        await this.octokit.repos.createOrUpdateFileContents({
          owner: this.owner,
          repo: this.repo,
          path,
          message: `docs: add ${template.name} PR template (Intent Blueprint)`,
          content: Buffer.from(template.content).toString('base64'),
          sha,
        });

        created++;
      } catch {
        // Ignore errors for individual templates
      }
    }

    return created;
  }

  /**
   * Get repository info
   */
  async getRepoInfo(): Promise<{ name: string; url: string; defaultBranch: string } | null> {
    try {
      const { data } = await this.octokit.repos.get({
        owner: this.owner,
        repo: this.repo,
      });

      return {
        name: data.full_name,
        url: data.html_url,
        defaultBranch: data.default_branch,
      };
    } catch {
      return null;
    }
  }
}
