/**
 * Plugin System
 * Extensible plugin architecture for custom integrations
 */

export * from './types.js';
export * from './manager.js';
export * from './builtin/index.js';

import { PluginManager, createPluginManager, createPluginLogger } from './manager.js';
import { BUILTIN_PLUGINS } from './builtin/index.js';
import type {
  Plugin,
  PluginContext,
  PluginRegistryConfig,
  FormatterPlugin,
  ValidatorPlugin,
  ProcessorPlugin,
  IntegrationPlugin,
  HookPlugin,
  TemplateProviderPlugin,
} from './types.js';

/**
 * Plugin system facade
 */
export class PluginSystem {
  private manager: PluginManager;
  private initialized = false;

  constructor(config?: Partial<PluginRegistryConfig>) {
    this.manager = createPluginManager(config);
  }

  /**
   * Initialize the plugin system
   */
  async init(projectPath: string, outputPath: string): Promise<void> {
    if (this.initialized) return;

    const context: PluginContext = {
      projectPath,
      outputPath,
      config: {},
      logger: createPluginLogger('plugins'),
      services: {
        templates: {
          render: async (template, variables) => {
            // Simple variable substitution
            let result = template;
            for (const [key, value] of Object.entries(variables)) {
              result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
            }
            return result;
          },
          compile: (template) => ({
            render: (variables) => {
              let result = template;
              for (const [key, value] of Object.entries(variables)) {
                result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
              }
              return result;
            },
          }),
        },
        storage: {
          read: async () => '',
          write: async () => {},
          exists: async () => false,
          list: async () => [],
        },
        http: {
          get: async () => ({}) as never,
          post: async () => ({}) as never,
          put: async () => ({}) as never,
          delete: async () => ({}) as never,
        },
      },
    };

    // Register built-in plugins
    for (const plugin of BUILTIN_PLUGINS) {
      this.manager.register(plugin);
    }

    await this.manager.init(context);
    this.initialized = true;
  }

  /**
   * Destroy the plugin system
   */
  async destroy(): Promise<void> {
    await this.manager.destroy();
    this.initialized = false;
  }

  /**
   * Register a plugin
   */
  register(plugin: Plugin, config?: Record<string, unknown>): void {
    this.manager.register(plugin, config);
  }

  /**
   * Unregister a plugin
   */
  async unregister(id: string): Promise<boolean> {
    return this.manager.unregister(id);
  }

  /**
   * Get a plugin by ID
   */
  get<T extends Plugin>(id: string): T | undefined {
    return this.manager.get<T>(id);
  }

  /**
   * Get all formatters
   */
  getFormatters(): FormatterPlugin[] {
    return this.manager.getFormatters();
  }

  /**
   * Get all validators
   */
  getValidators(): ValidatorPlugin[] {
    return this.manager.getValidators();
  }

  /**
   * Get all processors
   */
  getProcessors(): ProcessorPlugin[] {
    return this.manager.getProcessors();
  }

  /**
   * Get all integrations
   */
  getIntegrations(): IntegrationPlugin[] {
    return this.manager.getIntegrations();
  }

  /**
   * Get formatter by extension
   */
  getFormatter(ext: string): FormatterPlugin | undefined {
    return this.manager.getFormatterByExtension(ext);
  }

  /**
   * Get integration by name
   */
  getIntegration(name: string): IntegrationPlugin | undefined {
    return this.manager.getIntegration(name);
  }

  /**
   * Format content using a formatter
   */
  async format(content: string, format: string, options?: Record<string, unknown>): Promise<string> {
    const formatter = this.manager.getFormatterByExtension(format);
    if (!formatter) {
      throw new Error(`No formatter found for format: ${format}`);
    }
    return formatter.format(content, options);
  }

  /**
   * Validate content using all validators
   */
  async validate(content: string, options?: Record<string, unknown>): Promise<{
    valid: boolean;
    results: Array<{ validator: string; result: unknown }>;
  }> {
    const validators = this.manager.getValidators();
    const results = [];
    let allValid = true;

    for (const validator of validators) {
      const result = await validator.validate(content, options);
      results.push({ validator: validator.meta.id, result });
      if (!result.valid) allValid = false;
    }

    return { valid: allValid, results };
  }

  /**
   * Process content through all processors
   */
  async process(content: string, options?: Record<string, unknown>): Promise<string> {
    let result = content;
    const processors = this.manager.getProcessors();

    for (const processor of processors) {
      result = await processor.process(result, options);
    }

    return result;
  }

  /**
   * List all registered plugins
   */
  list(): Array<{ id: string; name: string; type: string; enabled: boolean; version: string }> {
    return this.manager.list();
  }

  /**
   * Get the underlying manager
   */
  getManager(): PluginManager {
    return this.manager;
  }
}

/**
 * Create a plugin system instance
 */
export function createPluginSystem(config?: Partial<PluginRegistryConfig>): PluginSystem {
  return new PluginSystem(config);
}
