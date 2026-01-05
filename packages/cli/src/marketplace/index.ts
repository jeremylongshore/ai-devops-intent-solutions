/**
 * Template Marketplace
 * Central hub for discovering, installing, and managing template packs
 */

export * from './types.js';
export * from './registry.js';
export * from './manager.js';
export * from './packs/index.js';

import { MarketplaceRegistry } from './registry.js';
import { PackManager, createPackManager } from './manager.js';
import type { MarketplaceConfig, SearchFilters, SearchResults } from './types.js';
import { BUILTIN_TEMPLATES, getPackTemplates, getAvailablePackIds } from './packs/index.js';

/**
 * Marketplace facade for simplified access
 */
export class Marketplace {
  private registry: MarketplaceRegistry;
  private manager: PackManager;

  constructor(config?: Partial<MarketplaceConfig>) {
    this.manager = createPackManager(config);
    this.registry = this.manager.getRegistry();
  }

  /**
   * Search for template packs
   */
  async search(filters?: SearchFilters): Promise<SearchResults> {
    return this.registry.search(filters);
  }

  /**
   * Get featured packs
   */
  async getFeatured() {
    return this.registry.getFeatured();
  }

  /**
   * Get popular packs
   */
  async getPopular(limit?: number) {
    return this.registry.getPopular(limit);
  }

  /**
   * Install a pack
   */
  async install(packId: string, options?: { force?: boolean; version?: string }) {
    return this.manager.install(packId, options);
  }

  /**
   * Uninstall a pack
   */
  async uninstall(packId: string) {
    return this.manager.uninstall(packId);
  }

  /**
   * Update a pack
   */
  async update(packId: string) {
    return this.manager.update(packId);
  }

  /**
   * Update all packs
   */
  async updateAll() {
    return this.manager.updateAll();
  }

  /**
   * Check for updates
   */
  async checkUpdates() {
    return this.manager.checkUpdates();
  }

  /**
   * List installed packs
   */
  listInstalled() {
    return this.manager.list();
  }

  /**
   * Get built-in templates
   */
  getBuiltinTemplates() {
    return BUILTIN_TEMPLATES;
  }

  /**
   * Get templates from a specific pack
   */
  getPackTemplates(packId: string) {
    return getPackTemplates(packId);
  }

  /**
   * Get all available built-in pack IDs
   */
  getAvailablePackIds() {
    return getAvailablePackIds();
  }

  /**
   * Get the underlying registry
   */
  getRegistry() {
    return this.registry;
  }

  /**
   * Get the underlying manager
   */
  getManager() {
    return this.manager;
  }
}

/**
 * Create a marketplace instance
 */
export function createMarketplace(config?: Partial<MarketplaceConfig>): Marketplace {
  return new Marketplace(config);
}
