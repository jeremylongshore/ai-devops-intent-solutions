/**
 * Template Marketplace Types
 * Community templates, packs, and registry
 */

/**
 * Template pack categories
 */
export type PackCategory =
  | 'vertical'      // Industry-specific (FinTech, HealthTech, etc.)
  | 'compliance'    // Regulatory (SOC2, HIPAA, GDPR)
  | 'framework'     // Tech stack (Next.js, FastAPI, Rails)
  | 'methodology'   // Process (Agile, Lean, SAFe)
  | 'community';    // User-contributed

/**
 * Template pack metadata
 */
export interface TemplatePack {
  /** Unique pack ID */
  id: string;
  /** Display name */
  name: string;
  /** Pack description */
  description: string;
  /** Pack version */
  version: string;
  /** Author information */
  author: {
    name: string;
    email?: string;
    url?: string;
  };
  /** Pack category */
  category: PackCategory;
  /** Industry/vertical (for vertical packs) */
  vertical?: string;
  /** Framework (for framework packs) */
  framework?: string;
  /** Compliance standard (for compliance packs) */
  compliance?: string;
  /** Template IDs included in pack */
  templates: string[];
  /** Dependencies on other packs */
  dependencies?: string[];
  /** Tags for discovery */
  tags: string[];
  /** License */
  license: string;
  /** Repository URL */
  repository?: string;
  /** Homepage URL */
  homepage?: string;
  /** Download count */
  downloads?: number;
  /** Star/rating count */
  stars?: number;
  /** Created date */
  createdAt: string;
  /** Updated date */
  updatedAt: string;
}

/**
 * Registry entry for a template pack
 */
export interface RegistryEntry {
  /** Pack metadata */
  pack: TemplatePack;
  /** Download URL */
  downloadUrl: string;
  /** Checksum for verification */
  checksum: string;
  /** Size in bytes */
  size: number;
  /** Whether pack is verified/official */
  verified: boolean;
  /** Whether pack is featured */
  featured: boolean;
}

/**
 * Registry index
 */
export interface RegistryIndex {
  /** Registry version */
  version: string;
  /** Last updated timestamp */
  updatedAt: string;
  /** All available packs */
  packs: RegistryEntry[];
}

/**
 * Installed pack record
 */
export interface InstalledPack {
  /** Pack ID */
  id: string;
  /** Installed version */
  version: string;
  /** Installation path */
  path: string;
  /** Installation date */
  installedAt: string;
  /** Whether updates are available */
  updateAvailable?: boolean;
  /** Latest available version */
  latestVersion?: string;
}

/**
 * Search filters
 */
export interface SearchFilters {
  /** Search query */
  query?: string;
  /** Filter by category */
  category?: PackCategory;
  /** Filter by vertical */
  vertical?: string;
  /** Filter by framework */
  framework?: string;
  /** Filter by compliance */
  compliance?: string;
  /** Filter by tags */
  tags?: string[];
  /** Filter by author */
  author?: string;
  /** Only show verified packs */
  verified?: boolean;
  /** Only show featured packs */
  featured?: boolean;
  /** Sort by */
  sortBy?: 'downloads' | 'stars' | 'updated' | 'name';
  /** Sort direction */
  sortDir?: 'asc' | 'desc';
  /** Page number */
  page?: number;
  /** Page size */
  pageSize?: number;
}

/**
 * Search results
 */
export interface SearchResults {
  /** Matching packs */
  packs: RegistryEntry[];
  /** Total matching count */
  total: number;
  /** Current page */
  page: number;
  /** Page size */
  pageSize: number;
}

/**
 * Pack installation options
 */
export interface InstallOptions {
  /** Install path */
  path?: string;
  /** Force reinstall */
  force?: boolean;
  /** Skip dependency check */
  skipDeps?: boolean;
  /** Specific version to install */
  version?: string;
}

/**
 * Pack installation result
 */
export interface InstallResult {
  /** Whether installation succeeded */
  success: boolean;
  /** Installed pack info */
  pack?: InstalledPack;
  /** Dependencies installed */
  dependencies?: InstalledPack[];
  /** Error message if failed */
  error?: string;
}

/**
 * Marketplace configuration
 */
export interface MarketplaceConfig {
  /** Registry URL */
  registryUrl: string;
  /** Local cache directory */
  cacheDir: string;
  /** Installation directory */
  installDir: string;
  /** Auto-update check */
  autoUpdate: boolean;
  /** Update check interval (hours) */
  updateInterval: number;
}

/**
 * Default marketplace configuration
 */
export const DEFAULT_MARKETPLACE_CONFIG: MarketplaceConfig = {
  registryUrl: 'https://registry.intentsolutions.io/v1',
  cacheDir: '.blueprint/cache',
  installDir: '.blueprint/packs',
  autoUpdate: true,
  updateInterval: 24,
};

/**
 * Built-in verticals
 */
export const VERTICALS = [
  'fintech',
  'healthtech',
  'edtech',
  'ecommerce',
  'saas',
  'marketplace',
  'enterprise',
  'gaming',
  'media',
  'iot',
] as const;

/**
 * Built-in compliance standards
 */
export const COMPLIANCE_STANDARDS = [
  'soc2',
  'hipaa',
  'gdpr',
  'pci-dss',
  'iso27001',
  'fedramp',
  'ccpa',
  'sox',
] as const;

/**
 * Built-in frameworks
 */
export const FRAMEWORKS = [
  'nextjs',
  'react',
  'vue',
  'angular',
  'fastapi',
  'django',
  'rails',
  'express',
  'nestjs',
  'spring',
  'laravel',
  'flutter',
  'react-native',
] as const;
