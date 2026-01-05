/**
 * Intent Blueprint
 * Enterprise documentation generator - CLI, MCP Server, and programmatic API
 *
 * @packageDocumentation
 */

// Core exports for programmatic use
export {
  listTemplates,
  generateDocument,
  generateAllDocuments,
  writeDocuments,
  getTemplatesForScope,
  compileTemplate,
  getTemplatesDir,
  Handlebars,
  SCOPES,
  AUDIENCES,
  type TemplateContext,
  type GeneratedDocument,
  type TemplateInfo,
} from './core/index.js';

// Interview engine exports
export {
  InterviewEngine,
  quickInterview,
  detectContext,
  analyzeGaps,
  analyzeDescription,
  calculateComplexity,
  generateSummary,
  QUESTION_GROUPS,
  getActiveQuestions,
  getNextQuestion,
  getProgress,
  type InterviewState,
  type InterviewAnswers,
  type InterviewResult,
  type Question,
  type DetectedContext,
  type GapAnalysis,
  type ProjectType,
  type Complexity,
  type Audience,
  type Scope,
  type QuestionGroup,
} from './interview/index.js';

// MCP server export
export { startMcpServer } from './mcp/index.js';

// GitHub integration exports
export {
  GitHubClient,
  GitHubExporter,
  exportToGitHub,
  generateDocGenAction,
  generatePRSyncAction,
  generateAllActions,
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  STANDARD_LABELS,
  type GitHubConfig,
  type GitHubLabel,
  type GitHubMilestone,
  type GitHubIssue,
  type GitHubPRTemplate,
  type TaskBreakdown,
  type ReleasePhase,
  type ExportResult,
  type ExportOptions,
  type ActionConfig,
} from './integrations/github/index.js';
