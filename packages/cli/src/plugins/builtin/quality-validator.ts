/**
 * Quality Validator Plugin
 * Built-in validator for document quality checks
 */

import type {
  ValidatorPlugin,
  ValidatorOptions,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  PluginContext,
} from '../types.js';

/**
 * Validation rules
 */
interface ValidationRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning';
  check: (content: string, lines: string[]) => Array<{
    message: string;
    line?: number;
    suggestion?: string;
  }>;
}

/**
 * Built-in validation rules
 */
const RULES: ValidationRule[] = [
  {
    id: 'no-empty-sections',
    name: 'No Empty Sections',
    description: 'Check for sections with no content',
    severity: 'warning',
    check: (_content, lines) => {
      const issues: Array<{ message: string; line?: number; suggestion?: string }> = [];
      let lastHeadingLine = -1;
      let lastHeadingText = '';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('#')) {
          if (lastHeadingLine !== -1 && lastHeadingLine === i - 1) {
            issues.push({
              message: `Empty section: "${lastHeadingText}"`,
              line: lastHeadingLine + 1,
              suggestion: 'Add content to this section or remove it',
            });
          }
          lastHeadingLine = i;
          lastHeadingText = line.replace(/^#+\s*/, '');
        } else if (line.length > 0) {
          lastHeadingLine = -1;
        }
      }
      return issues;
    },
  },
  {
    id: 'consistent-heading-hierarchy',
    name: 'Consistent Heading Hierarchy',
    description: 'Check for proper heading level progression',
    severity: 'warning',
    check: (_content, lines) => {
      const issues: Array<{ message: string; line?: number; suggestion?: string }> = [];
      let lastLevel = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const match = line.match(/^(#{1,6})\s/);
        if (match) {
          const level = match[1].length;
          if (lastLevel > 0 && level > lastLevel + 1) {
            issues.push({
              message: `Skipped heading level: jumped from h${lastLevel} to h${level}`,
              line: i + 1,
              suggestion: `Use h${lastLevel + 1} instead`,
            });
          }
          lastLevel = level;
        }
      }
      return issues;
    },
  },
  {
    id: 'no-duplicate-headings',
    name: 'No Duplicate Headings',
    description: 'Check for duplicate heading text',
    severity: 'warning',
    check: (_content, lines) => {
      const issues: Array<{ message: string; line?: number; suggestion?: string }> = [];
      const headings = new Map<string, number>();

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const match = line.match(/^#+\s+(.+)$/);
        if (match) {
          const heading = match[1].toLowerCase();
          if (headings.has(heading)) {
            issues.push({
              message: `Duplicate heading: "${match[1]}"`,
              line: i + 1,
              suggestion: `First occurrence on line ${headings.get(heading)! + 1}`,
            });
          } else {
            headings.set(heading, i);
          }
        }
      }
      return issues;
    },
  },
  {
    id: 'minimum-content-length',
    name: 'Minimum Content Length',
    description: 'Check for sufficient content',
    severity: 'warning',
    check: (content) => {
      const issues: Array<{ message: string; suggestion?: string }> = [];
      const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;

      if (wordCount < 100) {
        issues.push({
          message: `Document is very short (${wordCount} words)`,
          suggestion: 'Consider adding more detail to make the document more useful',
        });
      }
      return issues;
    },
  },
  {
    id: 'no-todo-markers',
    name: 'No TODO Markers',
    description: 'Check for incomplete TODO markers',
    severity: 'warning',
    check: (_content, lines) => {
      const issues: Array<{ message: string; line?: number; suggestion?: string }> = [];
      const todoPatterns = [/\[TODO\]/i, /\[TBD\]/i, /\[FIXME\]/i, /\[XXX\]/i];

      for (let i = 0; i < lines.length; i++) {
        for (const pattern of todoPatterns) {
          if (pattern.test(lines[i])) {
            issues.push({
              message: `Incomplete marker found: ${lines[i].match(pattern)?.[0]}`,
              line: i + 1,
              suggestion: 'Complete or remove this marker before finalizing',
            });
          }
        }
      }
      return issues;
    },
  },
  {
    id: 'no-broken-links',
    name: 'No Broken Internal Links',
    description: 'Check for broken internal anchor links',
    severity: 'error',
    check: (content, lines) => {
      const issues: Array<{ message: string; line?: number }> = [];

      // Collect all heading anchors
      const anchors = new Set<string>();
      for (const line of lines) {
        const match = line.match(/^#+\s+(.+)$/);
        if (match) {
          const anchor = match[1]
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
          anchors.add(anchor);
        }
      }

      // Check internal links
      const linkPattern = /\[([^\]]+)\]\(#([^)]+)\)/g;
      let match;
      while ((match = linkPattern.exec(content)) !== null) {
        const anchor = match[2];
        if (!anchors.has(anchor)) {
          const lineNum = content.substring(0, match.index).split('\n').length;
          issues.push({
            message: `Broken internal link: #${anchor}`,
            line: lineNum,
          });
        }
      }
      return issues;
    },
  },
  {
    id: 'consistent-list-markers',
    name: 'Consistent List Markers',
    description: 'Check for consistent list marker usage',
    severity: 'warning',
    check: (_content, lines) => {
      const issues: Array<{ message: string; line?: number; suggestion?: string }> = [];
      let listMarker: string | null = null;
      let listStart = -1;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(/^(\s*)([-*+])\s/);
        if (match) {
          const indent = match[1].length;
          const marker = match[2];
          if (indent === 0) {
            if (listMarker === null) {
              listMarker = marker;
              listStart = i;
            } else if (marker !== listMarker) {
              issues.push({
                message: `Inconsistent list marker: "${marker}" (expected "${listMarker}")`,
                line: i + 1,
                suggestion: `Use "${listMarker}" to match list starting on line ${listStart + 1}`,
              });
            }
          }
        } else if (line.trim() === '') {
          listMarker = null;
          listStart = -1;
        }
      }
      return issues;
    },
  },
  {
    id: 'table-formatting',
    name: 'Table Formatting',
    description: 'Check for properly formatted tables',
    severity: 'error',
    check: (_content, lines) => {
      const issues: Array<{ message: string; line?: number }> = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('|') && !line.trim().startsWith('|')) {
          // Might be a table row not starting with |
          if (line.match(/\|.*\|/)) {
            issues.push({
              message: 'Table row should start with |',
              line: i + 1,
            });
          }
        }

        // Check for header separator
        if (line.match(/^\|[-:| ]+\|$/)) {
          // Check previous line for header
          if (i === 0 || !lines[i - 1].includes('|')) {
            issues.push({
              message: 'Table separator without header row',
              line: i + 1,
            });
          }
        }
      }
      return issues;
    },
  },
];

/**
 * Calculate quality score
 */
function calculateScore(content: string, errors: number, warnings: number): number {
  // Base score
  let score = 100;

  // Deduct for errors (more severe)
  score -= errors * 10;

  // Deduct for warnings (less severe)
  score -= warnings * 3;

  // Bonus for good practices
  const lines = content.split('\n');
  const hasTitle = lines.some(l => l.startsWith('# '));
  const hasSections = lines.filter(l => l.startsWith('## ')).length >= 2;
  const hasLists = lines.some(l => l.match(/^[-*+]\s/));
  const hasCodeBlocks = content.includes('```');

  if (hasTitle) score += 5;
  if (hasSections) score += 5;
  if (hasLists) score += 3;
  if (hasCodeBlocks) score += 2;

  // Clamp to 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Quality validator plugin
 */
export const qualityValidator: ValidatorPlugin = {
  meta: {
    id: 'intent-quality-validator',
    name: 'Quality Validator',
    description: 'Validate document quality and structure',
    version: '1.0.0',
    author: { name: 'Intent Solutions' },
    type: 'validator',
    tags: ['quality', 'validation', 'builtin'],
    config: {
      type: 'object',
      properties: {
        minScore: {
          type: 'number',
          description: 'Minimum quality score to pass (0-100)',
          default: 70,
        },
        enabledRules: {
          type: 'array',
          description: 'List of enabled rule IDs (empty = all)',
          items: { type: 'string' },
        },
        disabledRules: {
          type: 'array',
          description: 'List of disabled rule IDs',
          items: { type: 'string' },
        },
      },
    },
  },

  async init(_context: PluginContext): Promise<void> {
    // No initialization needed
  },

  async validate(content: string, options?: ValidatorOptions): Promise<ValidationResult> {
    const lines = content.split('\n');
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Determine which rules to run
    const enabledRules = options?.rules || [];
    const ignoredRules = options?.ignore || [];

    const rulesToRun = RULES.filter(rule => {
      // If specific rules requested, only run those
      if (enabledRules.length > 0 && !enabledRules.includes(rule.id)) {
        return false;
      }
      // Skip ignored rules
      if (ignoredRules.includes(rule.id)) {
        return false;
      }
      return true;
    });

    // Run each rule
    for (const rule of rulesToRun) {
      const issues = rule.check(content, lines);

      for (const issue of issues) {
        if (rule.severity === 'error') {
          errors.push({
            rule: rule.id,
            message: issue.message,
            line: issue.line,
            severity: 'error',
          });
        } else {
          warnings.push({
            rule: rule.id,
            message: issue.message,
            line: issue.line,
            severity: 'warning',
            suggestion: issue.suggestion,
          });
        }
      }
    }

    // Calculate score
    const score = calculateScore(content, errors.length, warnings.length);

    // Determine if valid (in strict mode, warnings also fail)
    const valid = options?.strict
      ? errors.length === 0 && warnings.length === 0
      : errors.length === 0;

    return {
      valid,
      errors,
      warnings,
      score,
    };
  },
};

export default qualityValidator;
