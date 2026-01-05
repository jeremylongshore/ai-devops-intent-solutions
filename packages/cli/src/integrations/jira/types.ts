/**
 * Jira Integration Types
 * Types for Jira REST API integration
 */

export interface JiraConfig {
  /** Jira instance URL (e.g., https://your-domain.atlassian.net) */
  baseUrl: string;
  /** User email for authentication */
  email: string;
  /** API token (from https://id.atlassian.com/manage-profile/security/api-tokens) */
  apiToken: string;
  /** Project key (e.g., PROJ) */
  projectKey: string;
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  style: 'classic' | 'next-gen';
}

export interface JiraIssueType {
  id: string;
  name: string;
  description?: string;
  subtask: boolean;
  hierarchyLevel: number;
}

export interface JiraPriority {
  id: string;
  name: string;
  iconUrl?: string;
}

export interface JiraStatus {
  id: string;
  name: string;
  statusCategory: {
    id: number;
    key: string;
    name: string;
  };
}

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress?: string;
  active: boolean;
}

export interface JiraSprint {
  id: number;
  name: string;
  state: 'future' | 'active' | 'closed';
  startDate?: string;
  endDate?: string;
  boardId: number;
  goal?: string;
}

export interface JiraBoard {
  id: number;
  name: string;
  type: 'scrum' | 'kanban';
  projectKey: string;
}

export interface JiraComponent {
  id: string;
  name: string;
  description?: string;
  projectKey: string;
}

export interface JiraVersion {
  id: string;
  name: string;
  description?: string;
  released: boolean;
  releaseDate?: string;
  projectKey: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  self: string;
  fields: {
    summary: string;
    description?: string;
    issuetype: JiraIssueType;
    priority?: JiraPriority;
    status: JiraStatus;
    project: { id: string; key: string; name: string };
    parent?: { id: string; key: string };
    subtasks?: JiraIssue[];
    components?: JiraComponent[];
    labels?: string[];
    fixVersions?: JiraVersion[];
    sprint?: JiraSprint;
    storyPoints?: number;
    [key: string]: unknown;
  };
}

export interface CreateIssueInput {
  summary: string;
  description?: string;
  issueType: 'Epic' | 'Story' | 'Task' | 'Sub-task' | 'Bug';
  projectKey: string;
  parentKey?: string;
  priority?: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest';
  labels?: string[];
  components?: string[];
  fixVersions?: string[];
  sprintId?: number;
  storyPoints?: number;
  epicLink?: string;
  customFields?: Record<string, unknown>;
}

export interface CreateSprintInput {
  name: string;
  boardId: number;
  startDate?: string;
  endDate?: string;
  goal?: string;
}

export interface CreateVersionInput {
  name: string;
  projectKey: string;
  description?: string;
  releaseDate?: string;
  released?: boolean;
}

export interface JiraTaskBreakdown {
  epic?: {
    summary: string;
    description?: string;
  };
  stories: JiraStoryItem[];
}

export interface JiraStoryItem {
  summary: string;
  description?: string;
  priority?: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest';
  storyPoints?: number;
  labels?: string[];
  tasks?: JiraTaskItem[];
}

export interface JiraTaskItem {
  summary: string;
  description?: string;
  priority?: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest';
}

export interface JiraExportResult {
  epics: JiraIssue[];
  stories: JiraIssue[];
  tasks: JiraIssue[];
  sprints: JiraSprint[];
  versions: JiraVersion[];
  components: JiraComponent[];
  errors: string[];
}

export interface JiraExportOptions {
  /** Create an Epic for the project */
  createEpic?: boolean;
  /** Epic name (if creating) */
  epicName?: string;
  /** Create sprints from release phases */
  createSprints?: boolean;
  /** Board ID for sprint creation */
  boardId?: number;
  /** Create versions from release phases */
  createVersions?: boolean;
  /** Sync components from document categories */
  syncComponents?: boolean;
  /** Add labels to issues */
  addLabels?: boolean;
  /** Dry run - preview without creating */
  dryRun?: boolean;
}

/**
 * Priority mapping between Blueprint and Jira
 */
export const PRIORITY_MAP: Record<string, string> = {
  urgent: 'Highest',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'Lowest',
};

/**
 * Standard labels for Blueprint documents
 */
export const STANDARD_LABELS: string[] = [
  'blueprint',
  'prd',
  'technical-spec',
  'architecture',
  'api-design',
  'security',
  'infrastructure',
  'testing',
  'documentation',
];

/**
 * Category to component mapping
 */
export const CATEGORY_COMPONENTS: Record<string, string> = {
  feature: 'Features',
  bug: 'Bug Fixes',
  'tech-debt': 'Technical Debt',
  research: 'Research',
  design: 'Design',
  devops: 'DevOps',
  security: 'Security',
  testing: 'Testing',
};
