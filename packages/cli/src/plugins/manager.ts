/**
 * Plugin Manager
 * Handles plugin loading, registration, and lifecycle management
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import type {
  Plugin,
  PluginEntry,
  PluginEvent,
  PluginContext,
  PluginLogger,
  PluginRegistryConfig,
  PluginType,
  FormatterPlugin,
  ValidatorPlugin,
  ProcessorPlugin,
  IntegrationPlugin,
  HookPlugin,
  TemplateProviderPlugin,
  HookEventData,
} from './types.js';
import { DEFAULT_PLUGIN_CONFIG } from './types.js';

/**
 * Plugin Manager
 */
export class PluginManager {
  private plugins: Map<string, PluginEntry> = new Map();
  private config: PluginRegistryConfig;
  private context: PluginContext | null = null;
  private hooks: Map<PluginEvent, HookPlugin[]> = new Map();

  constructor(config: Partial<PluginRegistryConfig> = {}) {
    this.config = { ...DEFAULT_PLUGIN_CONFIG, ...config };
  }

  /**
   * Initialize the plugin manager
   */
  async init(context: PluginContext): Promise<void> {
    this.context = context;

    // Load built-in plugins
    if (this.config.enableBuiltin) {
      await this.loadBuiltinPlugins();
    }

    // Auto-discover plugins
    if (this.config.autoDiscover) {
      await this.discoverPlugins();
    }

    // Initialize all loaded plugins
    for (const [id, entry] of this.plugins) {
      if (entry.enabled && entry.plugin.init) {
        try {
          await entry.plugin.init(this.context);
          context.logger.debug(`Plugin initialized: ${id}`);
        } catch (error) {
          context.logger.error(`Failed to initialize plugin ${id}`, error);
          entry.enabled = false;
        }
      }
    }
  }

  /**
   * Destroy the plugin manager
   */
  async destroy(): Promise<void> {
    for (const [id, entry] of this.plugins) {
      if (entry.enabled && entry.plugin.destroy) {
        try {
          await entry.plugin.destroy();
        } catch (error) {
          this.context?.logger.error(`Failed to destroy plugin ${id}`, error);
        }
      }
    }
    this.plugins.clear();
    this.hooks.clear();
  }

  /**
   * Register a plugin
   */
  register(plugin: Plugin, config: Record<string, unknown> = {}): void {
    const entry: PluginEntry = {
      plugin,
      enabled: true,
      config,
      loadedAt: new Date(),
    };

    this.plugins.set(plugin.meta.id, entry);

    // Register hooks
    if (plugin.meta.type === 'hook' && plugin.meta.events) {
      for (const event of plugin.meta.events) {
        if (!this.hooks.has(event)) {
          this.hooks.set(event, []);
        }
        this.hooks.get(event)!.push(plugin as HookPlugin);
      }
    }

    this.context?.logger.info(`Plugin registered: ${plugin.meta.id}`);
  }

  /**
   * Unregister a plugin
   */
  async unregister(id: string): Promise<boolean> {
    const entry = this.plugins.get(id);
    if (!entry) return false;

    // Destroy if initialized
    if (entry.plugin.destroy) {
      await entry.plugin.destroy();
    }

    // Remove from hooks
    if (entry.plugin.meta.type === 'hook' && entry.plugin.meta.events) {
      for (const event of entry.plugin.meta.events) {
        const hooks = this.hooks.get(event);
        if (hooks) {
          const index = hooks.findIndex(h => h.meta.id === id);
          if (index !== -1) hooks.splice(index, 1);
        }
      }
    }

    this.plugins.delete(id);
    this.context?.logger.info(`Plugin unregistered: ${id}`);
    return true;
  }

  /**
   * Enable a plugin
   */
  async enable(id: string): Promise<boolean> {
    const entry = this.plugins.get(id);
    if (!entry) return false;

    entry.enabled = true;
    if (entry.plugin.init && this.context) {
      await entry.plugin.init(this.context);
    }
    return true;
  }

  /**
   * Disable a plugin
   */
  async disable(id: string): Promise<boolean> {
    const entry = this.plugins.get(id);
    if (!entry) return false;

    if (entry.plugin.destroy) {
      await entry.plugin.destroy();
    }
    entry.enabled = false;
    return true;
  }

  /**
   * Get a plugin by ID
   */
  get<T extends Plugin>(id: string): T | undefined {
    const entry = this.plugins.get(id);
    return entry?.enabled ? (entry.plugin as T) : undefined;
  }

  /**
   * Get all plugins of a specific type
   */
  getByType<T extends Plugin>(type: PluginType): T[] {
    const result: T[] = [];
    for (const entry of this.plugins.values()) {
      if (entry.enabled && entry.plugin.meta.type === type) {
        result.push(entry.plugin as T);
      }
    }
    return result;
  }

  /**
   * Get all formatters
   */
  getFormatters(): FormatterPlugin[] {
    return this.getByType<FormatterPlugin>('formatter');
  }

  /**
   * Get all validators
   */
  getValidators(): ValidatorPlugin[] {
    return this.getByType<ValidatorPlugin>('validator');
  }

  /**
   * Get all processors
   */
  getProcessors(): ProcessorPlugin[] {
    return this.getByType<ProcessorPlugin>('processor');
  }

  /**
   * Get all integrations
   */
  getIntegrations(): IntegrationPlugin[] {
    return this.getByType<IntegrationPlugin>('integration');
  }

  /**
   * Get all template providers
   */
  getTemplateProviders(): TemplateProviderPlugin[] {
    return this.getByType<TemplateProviderPlugin>('template');
  }

  /**
   * Get formatter by extension
   */
  getFormatterByExtension(ext: string): FormatterPlugin | undefined {
    const formatters = this.getFormatters();
    return formatters.find(f => f.getExtension() === ext);
  }

  /**
   * Get integration by name
   */
  getIntegration(name: string): IntegrationPlugin | undefined {
    const integrations = this.getIntegrations();
    return integrations.find(i => i.meta.id === name || i.meta.name.toLowerCase() === name.toLowerCase());
  }

  /**
   * Execute hooks for an event
   */
  async executeHooks(event: PluginEvent, data: HookEventData): Promise<HookEventData> {
    const hooks = this.hooks.get(event) || [];
    let result = data;

    for (const hook of hooks) {
      try {
        result = await hook.onEvent(event, result);
      } catch (error) {
        this.context?.logger.error(`Hook error in ${hook.meta.id} for event ${event}`, error);
        if (event === 'onError') {
          // Don't re-throw errors from error handlers
          continue;
        }
        throw error;
      }
    }

    return result;
  }

  /**
   * List all registered plugins
   */
  list(): Array<{ id: string; name: string; type: PluginType; enabled: boolean; version: string }> {
    const result = [];
    for (const [id, entry] of this.plugins) {
      result.push({
        id,
        name: entry.plugin.meta.name,
        type: entry.plugin.meta.type,
        enabled: entry.enabled,
        version: entry.plugin.meta.version,
      });
    }
    return result;
  }

  /**
   * Check if a plugin is registered
   */
  has(id: string): boolean {
    return this.plugins.has(id);
  }

  /**
   * Check if a plugin is enabled
   */
  isEnabled(id: string): boolean {
    const entry = this.plugins.get(id);
    return entry?.enabled ?? false;
  }

  /**
   * Load built-in plugins
   */
  private async loadBuiltinPlugins(): Promise<void> {
    // Register built-in plugins
    // These would be imported from ./builtin/
    this.context?.logger.debug('Loading built-in plugins');
  }

  /**
   * Discover plugins in the plugin directory
   */
  private async discoverPlugins(): Promise<void> {
    const pluginDir = join(this.context?.projectPath || '.', this.config.pluginDir);

    if (!existsSync(pluginDir)) {
      this.context?.logger.debug(`Plugin directory not found: ${pluginDir}`);
      return;
    }

    const entries = readdirSync(pluginDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        await this.loadPlugin(join(pluginDir, entry.name));
      } else if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) {
        await this.loadPlugin(join(pluginDir, entry.name));
      }
    }
  }

  /**
   * Load a plugin from a path
   */
  private async loadPlugin(path: string): Promise<void> {
    try {
      // Try to load package.json for plugin metadata
      const pkgPath = join(path, 'package.json');
      if (existsSync(pkgPath)) {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
        if (pkg.intent?.plugin) {
          const entryPoint = join(path, pkg.main || 'index.js');
          const module = await import(entryPoint);
          const plugin = module.default || module;
          if (this.isValidPlugin(plugin)) {
            this.register(plugin, pkg.intent.config || {});
          }
        }
      } else {
        // Direct JS file
        const module = await import(path);
        const plugin = module.default || module;
        if (this.isValidPlugin(plugin)) {
          this.register(plugin);
        }
      }
    } catch (error) {
      this.context?.logger.error(`Failed to load plugin from ${path}`, error);
    }
  }

  /**
   * Validate plugin structure
   */
  private isValidPlugin(obj: unknown): obj is Plugin {
    if (!obj || typeof obj !== 'object') return false;
    const plugin = obj as Plugin;
    return (
      plugin.meta !== undefined &&
      typeof plugin.meta.id === 'string' &&
      typeof plugin.meta.name === 'string' &&
      typeof plugin.meta.version === 'string' &&
      typeof plugin.meta.type === 'string'
    );
  }
}

/**
 * Create a plugin manager instance
 */
export function createPluginManager(config?: Partial<PluginRegistryConfig>): PluginManager {
  return new PluginManager(config);
}

/**
 * Create a basic plugin logger
 */
export function createPluginLogger(prefix: string): PluginLogger {
  return {
    debug: (message, data) => {
      if (process.env.DEBUG) {
        console.debug(`[${prefix}] ${message}`, data ?? '');
      }
    },
    info: (message, data) => {
      console.info(`[${prefix}] ${message}`, data ?? '');
    },
    warn: (message, data) => {
      console.warn(`[${prefix}] ${message}`, data ?? '');
    },
    error: (message, data) => {
      console.error(`[${prefix}] ${message}`, data ?? '');
    },
  };
}
