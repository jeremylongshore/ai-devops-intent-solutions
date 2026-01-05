/**
 * Linear API Client
 * GraphQL client for Linear API
 */

import type {
  LinearConfig,
  LinearTeam,
  LinearProject,
  LinearCycle,
  LinearLabel,
  LinearIssue,
  LinearWorkflowState,
  CreateIssueInput,
  CreateProjectInput,
  CreateCycleInput,
} from './types.js';

const LINEAR_API_URL = 'https://api.linear.app/graphql';

export class LinearClient {
  private apiKey: string;
  private teamId: string;

  constructor(config: LinearConfig) {
    this.apiKey = config.apiKey;
    this.teamId = config.teamId;
  }

  /**
   * Execute a GraphQL query
   */
  private async query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const response = await fetch(LINEAR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.apiKey,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Linear API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json() as { data?: T; errors?: Array<{ message: string }> };

    if (result.errors) {
      throw new Error(`Linear GraphQL error: ${result.errors[0].message}`);
    }

    return result.data as T;
  }

  /**
   * Verify API key and get user info
   */
  async verify(): Promise<{ id: string; name: string; email: string }> {
    const data = await this.query<{ viewer: { id: string; name: string; email: string } }>(`
      query {
        viewer {
          id
          name
          email
        }
      }
    `);
    return data.viewer;
  }

  /**
   * Get team by ID
   */
  async getTeam(teamId?: string): Promise<LinearTeam> {
    const id = teamId || this.teamId;
    const data = await this.query<{ team: LinearTeam }>(`
      query GetTeam($id: String!) {
        team(id: $id) {
          id
          name
          key
        }
      }
    `, { id });
    return data.team;
  }

  /**
   * List all teams
   */
  async listTeams(): Promise<LinearTeam[]> {
    const data = await this.query<{ teams: { nodes: LinearTeam[] } }>(`
      query {
        teams {
          nodes {
            id
            name
            key
          }
        }
      }
    `);
    return data.teams.nodes;
  }

  /**
   * Get workflow states for a team
   */
  async getWorkflowStates(teamId?: string): Promise<LinearWorkflowState[]> {
    const id = teamId || this.teamId;
    const data = await this.query<{ team: { states: { nodes: LinearWorkflowState[] } } }>(`
      query GetStates($id: String!) {
        team(id: $id) {
          states {
            nodes {
              id
              name
              type
            }
          }
        }
      }
    `, { id });
    return data.team.states.nodes.map(s => ({ ...s, teamId: id }));
  }

  /**
   * Get backlog state for a team
   */
  async getBacklogState(teamId?: string): Promise<LinearWorkflowState | undefined> {
    const states = await this.getWorkflowStates(teamId);
    return states.find(s => s.type === 'backlog');
  }

  /**
   * Get labels for a team
   */
  async getLabels(teamId?: string): Promise<LinearLabel[]> {
    const id = teamId || this.teamId;
    const data = await this.query<{ team: { labels: { nodes: LinearLabel[] } } }>(`
      query GetLabels($id: String!) {
        team(id: $id) {
          labels {
            nodes {
              id
              name
              color
            }
          }
        }
      }
    `, { id });
    return data.team.labels.nodes.map(l => ({ ...l, teamId: id }));
  }

  /**
   * Create a label
   */
  async createLabel(name: string, color: string, teamId?: string): Promise<LinearLabel> {
    const id = teamId || this.teamId;
    const data = await this.query<{ issueLabelCreate: { issueLabel: LinearLabel; success: boolean } }>(`
      mutation CreateLabel($name: String!, $color: String!, $teamId: String!) {
        issueLabelCreate(input: { name: $name, color: $color, teamId: $teamId }) {
          success
          issueLabel {
            id
            name
            color
          }
        }
      }
    `, { name, color, teamId: id });

    if (!data.issueLabelCreate.success) {
      throw new Error(`Failed to create label: ${name}`);
    }

    return { ...data.issueLabelCreate.issueLabel, teamId: id };
  }

  /**
   * Ensure labels exist, create if missing
   */
  async ensureLabels(labels: Array<{ name: string; color: string }>, teamId?: string): Promise<LinearLabel[]> {
    const existingLabels = await this.getLabels(teamId);
    const result: LinearLabel[] = [];

    for (const label of labels) {
      const existing = existingLabels.find(l => l.name.toLowerCase() === label.name.toLowerCase());
      if (existing) {
        result.push(existing);
      } else {
        const created = await this.createLabel(label.name, label.color, teamId);
        result.push(created);
      }
    }

    return result;
  }

  /**
   * Create a project
   */
  async createProject(input: CreateProjectInput): Promise<LinearProject> {
    const data = await this.query<{ projectCreate: { project: LinearProject; success: boolean } }>(`
      mutation CreateProject($name: String!, $description: String, $teamIds: [String!]!, $state: String) {
        projectCreate(input: { name: $name, description: $description, teamIds: $teamIds, state: $state }) {
          success
          project {
            id
            name
            description
            state
          }
        }
      }
    `, {
      name: input.name,
      description: input.description,
      teamIds: input.teamIds.length > 0 ? input.teamIds : [this.teamId],
      state: input.state || 'planned',
    });

    if (!data.projectCreate.success) {
      throw new Error(`Failed to create project: ${input.name}`);
    }

    return {
      ...data.projectCreate.project,
      teamIds: input.teamIds.length > 0 ? input.teamIds : [this.teamId],
    };
  }

  /**
   * List projects for a team
   */
  async listProjects(teamId?: string): Promise<LinearProject[]> {
    const id = teamId || this.teamId;
    const data = await this.query<{ team: { projects: { nodes: Array<{ id: string; name: string; description?: string; state: string }> } } }>(`
      query GetProjects($id: String!) {
        team(id: $id) {
          projects {
            nodes {
              id
              name
              description
              state
            }
          }
        }
      }
    `, { id });
    return data.team.projects.nodes.map(p => ({ ...p, teamIds: [id] }));
  }

  /**
   * Create a cycle
   */
  async createCycle(input: CreateCycleInput): Promise<LinearCycle> {
    const data = await this.query<{ cycleCreate: { cycle: LinearCycle; success: boolean } }>(`
      mutation CreateCycle($teamId: String!, $name: String, $startsAt: DateTime!, $endsAt: DateTime!, $description: String) {
        cycleCreate(input: { teamId: $teamId, name: $name, startsAt: $startsAt, endsAt: $endsAt, description: $description }) {
          success
          cycle {
            id
            number
            name
            startsAt
            endsAt
          }
        }
      }
    `, {
      teamId: input.teamId || this.teamId,
      name: input.name,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      description: input.description,
    });

    if (!data.cycleCreate.success) {
      throw new Error(`Failed to create cycle: ${input.name}`);
    }

    return {
      ...data.cycleCreate.cycle,
      teamId: input.teamId || this.teamId,
    };
  }

  /**
   * List cycles for a team
   */
  async listCycles(teamId?: string): Promise<LinearCycle[]> {
    const id = teamId || this.teamId;
    const data = await this.query<{ team: { cycles: { nodes: Array<{ id: string; number: number; name?: string; startsAt: string; endsAt: string }> } } }>(`
      query GetCycles($id: String!) {
        team(id: $id) {
          cycles {
            nodes {
              id
              number
              name
              startsAt
              endsAt
            }
          }
        }
      }
    `, { id });
    return data.team.cycles.nodes.map(c => ({ ...c, teamId: id }));
  }

  /**
   * Create an issue
   */
  async createIssue(input: CreateIssueInput): Promise<LinearIssue> {
    const data = await this.query<{ issueCreate: { issue: LinearIssue; success: boolean } }>(`
      mutation CreateIssue(
        $title: String!,
        $description: String,
        $teamId: String!,
        $projectId: String,
        $cycleId: String,
        $priority: Int,
        $estimate: Int,
        $labelIds: [String!],
        $stateId: String,
        $parentId: String
      ) {
        issueCreate(input: {
          title: $title,
          description: $description,
          teamId: $teamId,
          projectId: $projectId,
          cycleId: $cycleId,
          priority: $priority,
          estimate: $estimate,
          labelIds: $labelIds,
          stateId: $stateId,
          parentId: $parentId
        }) {
          success
          issue {
            id
            identifier
            title
            description
            priority
            estimate
            url
            state {
              id
              name
            }
            labels {
              nodes {
                id
                name
                color
              }
            }
            project {
              id
              name
            }
            cycle {
              id
              number
              name
            }
          }
        }
      }
    `, {
      title: input.title,
      description: input.description,
      teamId: input.teamId || this.teamId,
      projectId: input.projectId,
      cycleId: input.cycleId,
      priority: input.priority,
      estimate: input.estimate,
      labelIds: input.labelIds,
      stateId: input.stateId,
      parentId: input.parentId,
    });

    if (!data.issueCreate.success) {
      throw new Error(`Failed to create issue: ${input.title}`);
    }

    const issue = data.issueCreate.issue;
    return {
      ...issue,
      labels: (issue.labels as unknown as { nodes: LinearLabel[] }).nodes || [],
    };
  }

  /**
   * Create multiple issues from a task breakdown
   */
  async createIssuesFromTasks(
    tasks: Array<{
      title: string;
      description?: string;
      priority?: number;
      estimate?: number;
      labels?: string[];
      subtasks?: Array<{ title: string; description?: string; priority?: number; estimate?: number }>;
    }>,
    options: {
      projectId?: string;
      cycleId?: string;
      labelIds?: string[];
    } = {}
  ): Promise<LinearIssue[]> {
    const issues: LinearIssue[] = [];
    const backlogState = await this.getBacklogState();

    for (const task of tasks) {
      // Combine task-specific labels with global labels
      const taskLabelIds = [...(options.labelIds || [])];

      const issue = await this.createIssue({
        title: task.title,
        description: task.description,
        teamId: this.teamId,
        projectId: options.projectId,
        cycleId: options.cycleId,
        priority: task.priority,
        estimate: task.estimate,
        labelIds: taskLabelIds.length > 0 ? taskLabelIds : undefined,
        stateId: backlogState?.id,
      });
      issues.push(issue);

      // Create subtasks
      if (task.subtasks && task.subtasks.length > 0) {
        for (const subtask of task.subtasks) {
          const subIssue = await this.createIssue({
            title: subtask.title,
            description: subtask.description,
            teamId: this.teamId,
            projectId: options.projectId,
            cycleId: options.cycleId,
            priority: subtask.priority,
            estimate: subtask.estimate,
            parentId: issue.id,
            stateId: backlogState?.id,
          });
          issues.push(subIssue);
        }
      }
    }

    return issues;
  }
}
