/**
 * Built-in Plugins
 * Export all official built-in plugins
 */

export { markdownFormatter } from './markdown-formatter.js';
export { htmlFormatter } from './html-formatter.js';
export { qualityValidator } from './quality-validator.js';

import { markdownFormatter } from './markdown-formatter.js';
import { htmlFormatter } from './html-formatter.js';
import { qualityValidator } from './quality-validator.js';
import type { Plugin } from '../types.js';

/**
 * All built-in plugins
 */
export const BUILTIN_PLUGINS: Plugin[] = [
  markdownFormatter,
  htmlFormatter,
  qualityValidator,
];

/**
 * Get built-in plugin by ID
 */
export function getBuiltinPlugin(id: string): Plugin | undefined {
  return BUILTIN_PLUGINS.find(p => p.meta.id === id);
}

/**
 * Get all built-in plugin IDs
 */
export function getBuiltinPluginIds(): string[] {
  return BUILTIN_PLUGINS.map(p => p.meta.id);
}
