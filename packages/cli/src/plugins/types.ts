/**
 * Plugin System Types
 * Type definitions for the plugin architecture
 */

/**
 * Plugin categories
 */
export type PluginType =
  | 'formatter'      // Output formatters (markdown, HTML, PDF)
  | 'validator'      // Content validators
  | 'processor'      // Post-processors
  | 'integration'    // External service integrations
  | 'template'       // Custom template providers
  | 'hook';          // Lifecycle hooks

/**
 * Plugin lifecycle events
 */
export type PluginEvent =
  | 'beforeGenerate'
  | 'afterGenerate'
  | 'beforeValidate'
  | 'afterValidate'
  | 'beforeExport'
  | 'afterExport'
  | 'onError';

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  author: {
    name: string;
    email?: string;
    url?: string;
  };
  type: PluginType;
  events?: PluginEvent[];
  dependencies?: string[];
  config?: PluginConfigSchema;
  tags?: string[];
  license?: string;
  repository?: string;
}

/**
 * Plugin configuration schema
 */
export interface PluginConfigSchema {
  type: 'object';
  properties: Record<string, {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    description?: string;
    default?: unknown;
    required?: boolean;
    enum?: unknown[];
    items?: { type: string };
  }>;
  required?: string[];
}

/**
 * Plugin context passed to plugin methods
 */
export interface PluginContext {
  projectPath: string;
  outputPath: string;
  config: Record<string, unknown>;
  logger: PluginLogger;
  services: {
    templates: TemplateService;
    storage: StorageService;
    http: HttpService;
  };
}

/**
 * Plugin logger interface
 */
export interface PluginLogger {
  debug(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  error(message: string, data?: unknown): void;
}

/**
 * Template service interface
 */
export interface TemplateService {
  render(template: string, variables: Record<string, unknown>): Promise<string>;
  compile(template: string): CompiledTemplate;
}

/**
 * Compiled template interface
 */
export interface CompiledTemplate {
  render(variables: Record<string, unknown>): string;
}

/**
 * Storage service interface
 */
export interface StorageService {
  read(path: string): Promise<string>;
  write(path: string, content: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  list(pattern: string): Promise<string[]>;
}

/**
 * HTTP service interface
 */
export interface HttpService {
  get<T>(url: string, options?: HttpOptions): Promise<T>;
  post<T>(url: string, body: unknown, options?: HttpOptions): Promise<T>;
  put<T>(url: string, body: unknown, options?: HttpOptions): Promise<T>;
  delete<T>(url: string, options?: HttpOptions): Promise<T>;
}

/**
 * HTTP request options
 */
export interface HttpOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

/**
 * Base plugin interface
 */
export interface Plugin {
  meta: PluginMetadata;
  init?(context: PluginContext): Promise<void>;
  destroy?(): Promise<void>;
}

/**
 * Formatter plugin interface
 */
export interface FormatterPlugin extends Plugin {
  meta: PluginMetadata & { type: 'formatter' };
  format(content: string, options?: FormatterOptions): Promise<string>;
  getExtension(): string;
  getMimeType(): string;
}

/**
 * Formatter options
 */
export interface FormatterOptions {
  title?: string;
  styles?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Validator plugin interface
 */
export interface ValidatorPlugin extends Plugin {
  meta: PluginMetadata & { type: 'validator' };
  validate(content: string, options?: ValidatorOptions): Promise<ValidationResult>;
}

/**
 * Validator options
 */
export interface ValidatorOptions {
  strict?: boolean;
  rules?: string[];
  ignore?: string[];
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score?: number;
}

/**
 * Validation error
 */
export interface ValidationError {
  rule: string;
  message: string;
  line?: number;
  column?: number;
  severity: 'error';
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  rule: string;
  message: string;
  line?: number;
  column?: number;
  severity: 'warning';
  suggestion?: string;
}

/**
 * Processor plugin interface
 */
export interface ProcessorPlugin extends Plugin {
  meta: PluginMetadata & { type: 'processor' };
  process(content: string, options?: ProcessorOptions): Promise<string>;
}

/**
 * Processor options
 */
export interface ProcessorOptions {
  mode?: 'enhance' | 'transform' | 'filter';
  params?: Record<string, unknown>;
}

/**
 * Integration plugin interface
 */
export interface IntegrationPlugin extends Plugin {
  meta: PluginMetadata & { type: 'integration' };
  connect(credentials: IntegrationCredentials): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  export(content: string, destination: IntegrationDestination): Promise<IntegrationResult>;
  import?(source: IntegrationSource): Promise<string>;
}

/**
 * Integration credentials
 */
export interface IntegrationCredentials {
  apiKey?: string;
  token?: string;
  username?: string;
  password?: string;
  oauth?: {
    clientId: string;
    clientSecret: string;
    accessToken?: string;
    refreshToken?: string;
  };
}

/**
 * Integration destination
 */
export interface IntegrationDestination {
  type: string;
  id?: string;
  path?: string;
  options?: Record<string, unknown>;
}

/**
 * Integration source
 */
export interface IntegrationSource {
  type: string;
  id?: string;
  path?: string;
  query?: Record<string, unknown>;
}

/**
 * Integration result
 */
export interface IntegrationResult {
  success: boolean;
  id?: string;
  url?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Hook plugin interface
 */
export interface HookPlugin extends Plugin {
  meta: PluginMetadata & { type: 'hook'; events: PluginEvent[] };
  onEvent(event: PluginEvent, data: HookEventData): Promise<HookEventData>;
}

/**
 * Hook event data
 */
export interface HookEventData {
  content?: string;
  template?: string;
  variables?: Record<string, unknown>;
  output?: string;
  error?: Error;
  [key: string]: unknown;
}

/**
 * Template provider plugin interface
 */
export interface TemplateProviderPlugin extends Plugin {
  meta: PluginMetadata & { type: 'template' };
  getTemplates(): Promise<TemplateInfo[]>;
  getTemplate(id: string): Promise<TemplateContent>;
}

/**
 * Template info
 */
export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
}

/**
 * Template content
 */
export interface TemplateContent {
  id: string;
  content: string;
  variables: TemplateVariable[];
  sections: TemplateSection[];
}

/**
 * Template variable
 */
export interface TemplateVariable {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  default?: unknown;
}

/**
 * Template section
 */
export interface TemplateSection {
  id: string;
  title: string;
  content: string;
}

/**
 * Plugin registration entry
 */
export interface PluginEntry {
  plugin: Plugin;
  enabled: boolean;
  config: Record<string, unknown>;
  loadedAt: Date;
}

/**
 * Plugin registry configuration
 */
export interface PluginRegistryConfig {
  pluginDir: string;
  autoDiscover: boolean;
  enableBuiltin: boolean;
}

/**
 * Default plugin registry configuration
 */
export const DEFAULT_PLUGIN_CONFIG: PluginRegistryConfig = {
  pluginDir: '.intent/plugins',
  autoDiscover: true,
  enableBuiltin: true,
};
