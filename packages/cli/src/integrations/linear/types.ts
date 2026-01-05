/**
 * Linear Integration Types
 * Types for Linear API integration
 */

export interface LinearConfig {
  /** Linear API key */
  apiKey: string;
  /** Team ID to create issues in */
  teamId: string;
  /** Optional project ID */
  projectId?: string;
}

export interface LinearTeam {
  id: string;
  name: string;
  key: string;
}

export interface LinearProject {
  id: string;
  name: string;
  description?: string;
  state: string;
  teamIds: string[];
}

export interface LinearCycle {
  id: string;
  number: number;
  name?: string;
  startsAt: string;
  endsAt: string;
  teamId: string;
}

export interface LinearLabel {
  id: string;
  name: string;
  color: string;
  teamId?: string;
}

export interface LinearIssue {
  id: string;
  identifier: string;
  title: string;
  description?: string;
  priority: number;
  estimate?: number;
  state: {
    id: string;
    name: string;
  };
  labels: LinearLabel[];
  project?: LinearProject;
  cycle?: LinearCycle;
  url: string;
}

export interface LinearWorkflowState {
  id: string;
  name: string;
  type: 'backlog' | 'unstarted' | 'started' | 'completed' | 'canceled';
  teamId: string;
}

export interface CreateIssueInput {
  title: string;
  description?: string;
  teamId: string;
  projectId?: string;
  cycleId?: string;
  priority?: number;
  estimate?: number;
  labelIds?: string[];
  stateId?: string;
  parentId?: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  teamIds: string[];
  state?: 'planned' | 'started' | 'paused' | 'completed' | 'canceled';
}

export interface CreateCycleInput {
  name?: string;
  teamId: string;
  startsAt: string;
  endsAt: string;
  description?: string;
}

export interface LinearTaskBreakdown {
  phase: string;
  tasks: LinearTaskItem[];
  cycleWeeks?: number;
}

export interface LinearTaskItem {
  title: string;
  description?: string;
  priority: 'urgent' | 'high' | 'medium' | 'low' | 'none';
  estimate?: number;
  labels?: string[];
  subtasks?: LinearTaskItem[];
}

export interface LinearExportResult {
  project?: LinearProject;
  cycles: LinearCycle[];
  issues: LinearIssue[];
  labels: LinearLabel[];
  errors: string[];
}

export interface LinearExportOptions {
  /** Create a new project for the PRD */
  createProject?: boolean;
  /** Project name (if creating) */
  projectName?: string;
  /** Create cycles from release phases */
  createCycles?: boolean;
  /** Sync labels from document categories */
  syncLabels?: boolean;
  /** Dry run - preview without creating */
  dryRun?: boolean;
}

/**
 * Priority mapping between Blueprint and Linear
 * Linear: 0 = No priority, 1 = Urgent, 2 = High, 3 = Medium, 4 = Low
 */
export const PRIORITY_MAP: Record<string, number> = {
  urgent: 1,
  high: 2,
  medium: 3,
  low: 4,
  none: 0,
};

/**
 * Standard labels for Blueprint documents
 */
export const STANDARD_LABELS: Array<{ name: string; color: string }> = [
  { name: 'prd', color: '#6B5B95' },
  { name: 'technical-spec', color: '#88B04B' },
  { name: 'architecture', color: '#F7CAC9' },
  { name: 'api-design', color: '#92A8D1' },
  { name: 'security', color: '#DD4124' },
  { name: 'infrastructure', color: '#45B8AC' },
  { name: 'testing', color: '#EFC050' },
  { name: 'documentation', color: '#5B5EA6' },
];

/**
 * Category labels for task organization
 */
export const CATEGORY_LABELS: Array<{ name: string; color: string }> = [
  { name: 'feature', color: '#0052CC' },
  { name: 'bug', color: '#DE350B' },
  { name: 'tech-debt', color: '#FF8B00' },
  { name: 'research', color: '#6554C0' },
  { name: 'design', color: '#00B8D9' },
  { name: 'devops', color: '#36B37E' },
];
