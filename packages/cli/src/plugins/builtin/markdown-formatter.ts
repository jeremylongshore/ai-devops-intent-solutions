/**
 * Markdown Formatter Plugin
 * Built-in formatter for Markdown output
 */

import type { FormatterPlugin, FormatterOptions, PluginContext } from '../types.js';

/**
 * Markdown formatter plugin
 */
export const markdownFormatter: FormatterPlugin = {
  meta: {
    id: 'intent-markdown-formatter',
    name: 'Markdown Formatter',
    description: 'Format output as clean Markdown with optional enhancements',
    version: '1.0.0',
    author: { name: 'Intent Solutions' },
    type: 'formatter',
    tags: ['markdown', 'format', 'builtin'],
    config: {
      type: 'object',
      properties: {
        addTableOfContents: {
          type: 'boolean',
          description: 'Add table of contents at the beginning',
          default: true,
        },
        headingStyle: {
          type: 'string',
          description: 'Heading style (atx or setext)',
          default: 'atx',
          enum: ['atx', 'setext'],
        },
        listIndent: {
          type: 'number',
          description: 'List indentation spaces',
          default: 2,
        },
        wrapWidth: {
          type: 'number',
          description: 'Line wrap width (0 for no wrap)',
          default: 0,
        },
      },
    },
  },

  async init(_context: PluginContext): Promise<void> {
    // No initialization needed
  },

  async format(content: string, options?: FormatterOptions): Promise<string> {
    let result = content;

    // Add frontmatter if metadata provided
    if (options?.metadata && Object.keys(options.metadata).length > 0) {
      const frontmatter = [
        '---',
        ...Object.entries(options.metadata).map(([key, value]) => `${key}: ${JSON.stringify(value)}`),
        '---',
        '',
      ].join('\n');
      result = frontmatter + result;
    }

    // Add title if provided
    if (options?.title && !result.startsWith('#')) {
      result = `# ${options.title}\n\n${result}`;
    }

    // Normalize line endings
    result = result.replace(/\r\n/g, '\n');

    // Ensure single trailing newline
    result = result.trimEnd() + '\n';

    return result;
  },

  getExtension(): string {
    return 'md';
  },

  getMimeType(): string {
    return 'text/markdown';
  },
};

export default markdownFormatter;
