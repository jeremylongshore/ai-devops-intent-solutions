/**
 * Jira API Client
 * REST client for Jira Cloud API
 */

import type {
  JiraConfig,
  JiraProject,
  JiraIssueType,
  JiraPriority,
  JiraBoard,
  JiraSprint,
  JiraComponent,
  JiraVersion,
  JiraIssue,
  JiraUser,
  CreateIssueInput,
  CreateSprintInput,
  CreateVersionInput,
} from './types.js';

export class JiraClient {
  private baseUrl: string;
  private auth: string;
  private projectKey: string;

  constructor(config: JiraConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.auth = Buffer.from(`${config.email}:${config.apiToken}`).toString('base64');
    this.projectKey = config.projectKey;
  }

  /**
   * Make an API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Basic ${this.auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage = `Jira API error: ${response.status} ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorBody);
        if (errorJson.errorMessages) {
          errorMessage += ` - ${errorJson.errorMessages.join(', ')}`;
        }
        if (errorJson.errors) {
          errorMessage += ` - ${Object.values(errorJson.errors).join(', ')}`;
        }
      } catch {
        if (errorBody) errorMessage += ` - ${errorBody}`;
      }
      throw new Error(errorMessage);
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) return {} as T;

    return JSON.parse(text) as T;
  }

  /**
   * Verify credentials and get current user
   */
  async verify(): Promise<JiraUser> {
    return this.request<JiraUser>('/rest/api/3/myself');
  }

  /**
   * Get project details
   */
  async getProject(projectKey?: string): Promise<JiraProject> {
    const key = projectKey || this.projectKey;
    return this.request<JiraProject>(`/rest/api/3/project/${key}`);
  }

  /**
   * List all projects
   */
  async listProjects(): Promise<JiraProject[]> {
    const response = await this.request<{ values: JiraProject[] }>('/rest/api/3/project/search');
    return response.values;
  }

  /**
   * Get issue types for project
   */
  async getIssueTypes(projectKey?: string): Promise<JiraIssueType[]> {
    const key = projectKey || this.projectKey;
    const project = await this.request<{ issueTypes: JiraIssueType[] }>(
      `/rest/api/3/project/${key}`
    );
    return project.issueTypes;
  }

  /**
   * Get available priorities
   */
  async getPriorities(): Promise<JiraPriority[]> {
    return this.request<JiraPriority[]>('/rest/api/3/priority');
  }

  /**
   * Get boards for project (Agile API)
   */
  async getBoards(projectKey?: string): Promise<JiraBoard[]> {
    const key = projectKey || this.projectKey;
    const response = await this.request<{ values: JiraBoard[] }>(
      `/rest/agile/1.0/board?projectKeyOrId=${key}`
    );
    return response.values;
  }

  /**
   * Get sprints for a board
   */
  async getSprints(boardId: number, state?: 'future' | 'active' | 'closed'): Promise<JiraSprint[]> {
    let endpoint = `/rest/agile/1.0/board/${boardId}/sprint`;
    if (state) endpoint += `?state=${state}`;
    const response = await this.request<{ values: JiraSprint[] }>(endpoint);
    return response.values;
  }

  /**
   * Create a sprint
   */
  async createSprint(input: CreateSprintInput): Promise<JiraSprint> {
    return this.request<JiraSprint>('/rest/agile/1.0/sprint', {
      method: 'POST',
      body: JSON.stringify({
        name: input.name,
        originBoardId: input.boardId,
        startDate: input.startDate,
        endDate: input.endDate,
        goal: input.goal,
      }),
    });
  }

  /**
   * Get components for project
   */
  async getComponents(projectKey?: string): Promise<JiraComponent[]> {
    const key = projectKey || this.projectKey;
    return this.request<JiraComponent[]>(`/rest/api/3/project/${key}/components`);
  }

  /**
   * Create a component
   */
  async createComponent(name: string, description?: string, projectKey?: string): Promise<JiraComponent> {
    const key = projectKey || this.projectKey;
    return this.request<JiraComponent>('/rest/api/3/component', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        project: key,
      }),
    });
  }

  /**
   * Ensure components exist, create if missing
   */
  async ensureComponents(components: string[], projectKey?: string): Promise<JiraComponent[]> {
    const existing = await this.getComponents(projectKey);
    const result: JiraComponent[] = [];

    for (const name of components) {
      const found = existing.find(c => c.name.toLowerCase() === name.toLowerCase());
      if (found) {
        result.push(found);
      } else {
        const created = await this.createComponent(name, undefined, projectKey);
        result.push(created);
      }
    }

    return result;
  }

  /**
   * Get versions for project
   */
  async getVersions(projectKey?: string): Promise<JiraVersion[]> {
    const key = projectKey || this.projectKey;
    return this.request<JiraVersion[]>(`/rest/api/3/project/${key}/versions`);
  }

  /**
   * Create a version (release)
   */
  async createVersion(input: CreateVersionInput): Promise<JiraVersion> {
    return this.request<JiraVersion>('/rest/api/3/version', {
      method: 'POST',
      body: JSON.stringify({
        name: input.name,
        project: input.projectKey || this.projectKey,
        description: input.description,
        releaseDate: input.releaseDate,
        released: input.released || false,
      }),
    });
  }

  /**
   * Create an issue
   */
  async createIssue(input: CreateIssueInput): Promise<JiraIssue> {
    const issueTypes = await this.getIssueTypes(input.projectKey);
    const issueType = issueTypes.find(t =>
      t.name.toLowerCase() === input.issueType.toLowerCase()
    );

    if (!issueType) {
      throw new Error(`Issue type "${input.issueType}" not found in project. Available: ${issueTypes.map(t => t.name).join(', ')}`);
    }

    // Build the issue fields
    const fields: Record<string, unknown> = {
      project: { key: input.projectKey || this.projectKey },
      summary: input.summary,
      issuetype: { id: issueType.id },
    };

    // Add description in Atlassian Document Format (ADF)
    if (input.description) {
      fields.description = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: input.description,
              },
            ],
          },
        ],
      };
    }

    // Add parent for subtasks
    if (input.parentKey) {
      fields.parent = { key: input.parentKey };
    }

    // Add priority
    if (input.priority) {
      const priorities = await this.getPriorities();
      const priority = priorities.find(p =>
        p.name.toLowerCase() === input.priority!.toLowerCase()
      );
      if (priority) {
        fields.priority = { id: priority.id };
      }
    }

    // Add labels
    if (input.labels && input.labels.length > 0) {
      fields.labels = input.labels;
    }

    // Add components
    if (input.components && input.components.length > 0) {
      const projectComponents = await this.getComponents(input.projectKey);
      const componentIds = input.components
        .map(name => projectComponents.find(c => c.name.toLowerCase() === name.toLowerCase()))
        .filter((c): c is JiraComponent => !!c)
        .map(c => ({ id: c.id }));
      if (componentIds.length > 0) {
        fields.components = componentIds;
      }
    }

    // Add fix versions
    if (input.fixVersions && input.fixVersions.length > 0) {
      const versions = await this.getVersions(input.projectKey);
      const versionIds = input.fixVersions
        .map(name => versions.find(v => v.name.toLowerCase() === name.toLowerCase()))
        .filter((v): v is JiraVersion => !!v)
        .map(v => ({ id: v.id }));
      if (versionIds.length > 0) {
        fields.fixVersions = versionIds;
      }
    }

    // Add custom fields
    if (input.customFields) {
      Object.assign(fields, input.customFields);
    }

    const response = await this.request<{ id: string; key: string; self: string }>(
      '/rest/api/3/issue',
      {
        method: 'POST',
        body: JSON.stringify({ fields }),
      }
    );

    // Fetch the created issue to get full details
    return this.getIssue(response.key);
  }

  /**
   * Get an issue by key
   */
  async getIssue(issueKey: string): Promise<JiraIssue> {
    return this.request<JiraIssue>(`/rest/api/3/issue/${issueKey}`);
  }

  /**
   * Add issue to sprint
   */
  async addToSprint(sprintId: number, issueKeys: string[]): Promise<void> {
    await this.request(`/rest/agile/1.0/sprint/${sprintId}/issue`, {
      method: 'POST',
      body: JSON.stringify({ issues: issueKeys }),
    });
  }

  /**
   * Link an issue to an epic
   */
  async linkToEpic(issueKey: string, epicKey: string): Promise<void> {
    // In Jira Cloud, epic linking is done via the parent field for next-gen projects
    // or via the Epic Link custom field for classic projects
    // First, try to update the parent field (next-gen)
    try {
      await this.request(`/rest/api/3/issue/${issueKey}`, {
        method: 'PUT',
        body: JSON.stringify({
          fields: {
            parent: { key: epicKey },
          },
        }),
      });
    } catch {
      // If that fails, try the Epic Link approach (classic projects)
      // Epic Link field ID varies by instance, commonly customfield_10014
      try {
        await this.request(`/rest/api/3/issue/${issueKey}`, {
          method: 'PUT',
          body: JSON.stringify({
            fields: {
              customfield_10014: epicKey,
            },
          }),
        });
      } catch {
        // Ignore epic linking errors - not all project types support it
      }
    }
  }

  /**
   * Create multiple issues with hierarchy
   */
  async createIssuesWithHierarchy(
    tasks: Array<{
      summary: string;
      description?: string;
      issueType: 'Epic' | 'Story' | 'Task' | 'Sub-task' | 'Bug';
      priority?: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest';
      labels?: string[];
      subtasks?: Array<{
        summary: string;
        description?: string;
        priority?: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest';
      }>;
    }>,
    options: {
      epicKey?: string;
      sprintId?: number;
      labels?: string[];
    } = {}
  ): Promise<JiraIssue[]> {
    const issues: JiraIssue[] = [];

    for (const task of tasks) {
      // Combine task-specific labels with global labels
      const labels = [...(options.labels || []), ...(task.labels || [])];

      const issue = await this.createIssue({
        summary: task.summary,
        description: task.description,
        issueType: task.issueType,
        projectKey: this.projectKey,
        priority: task.priority,
        labels: labels.length > 0 ? labels : undefined,
      });
      issues.push(issue);

      // Link to epic if provided
      if (options.epicKey && task.issueType !== 'Epic') {
        await this.linkToEpic(issue.key, options.epicKey);
      }

      // Add to sprint if provided
      if (options.sprintId) {
        await this.addToSprint(options.sprintId, [issue.key]);
      }

      // Create subtasks
      if (task.subtasks && task.subtasks.length > 0) {
        for (const subtask of task.subtasks) {
          const subIssue = await this.createIssue({
            summary: subtask.summary,
            description: subtask.description,
            issueType: 'Sub-task',
            projectKey: this.projectKey,
            parentKey: issue.key,
            priority: subtask.priority,
            labels: labels.length > 0 ? labels : undefined,
          });
          issues.push(subIssue);
        }
      }
    }

    return issues;
  }
}
