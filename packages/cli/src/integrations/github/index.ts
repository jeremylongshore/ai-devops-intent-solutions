/**
 * GitHub Integration
 * Export Blueprint documents to GitHub (issues, milestones, PR templates)
 */

export { GitHubClient } from './client.js';
export { GitHubExporter, exportToGitHub } from './exporter.js';
export {
  generateDocGenAction,
  generatePRSyncAction,
  generateAllActions,
  type ActionConfig,
} from './action.js';
export type {
  GitHubConfig,
  GitHubLabel,
  GitHubMilestone,
  GitHubIssue,
  GitHubPRTemplate,
  TaskBreakdown,
  ReleasePhase,
  ExportResult,
  ExportOptions,
} from './types.js';
export {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  STANDARD_LABELS,
} from './types.js';
