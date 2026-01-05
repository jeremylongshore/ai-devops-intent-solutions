/**
 * Template Pack Manager
 * Install, update, and manage template packs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { createHash } from 'crypto';
import type {
  InstalledPack,
  InstallOptions,
  InstallResult,
  MarketplaceConfig,
  TemplatePack,
} from './types.js';
import { DEFAULT_MARKETPLACE_CONFIG } from './types.js';
import { MarketplaceRegistry } from './registry.js';

const MANIFEST_FILE = 'manifest.json';
const INSTALLED_FILE = 'installed.json';

export class PackManager {
  private config: MarketplaceConfig;
  private registry: MarketplaceRegistry;
  private installedPath: string;
  private installed: Map<string, InstalledPack> = new Map();

  constructor(config: Partial<MarketplaceConfig> = {}) {
    this.config = { ...DEFAULT_MARKETPLACE_CONFIG, ...config };
    this.registry = new MarketplaceRegistry(this.config);
    this.installedPath = join(this.config.installDir, INSTALLED_FILE);
    this.loadInstalled();
  }

  /**
   * Load installed packs from disk
   */
  private loadInstalled(): void {
    if (!existsSync(this.installedPath)) return;

    try {
      const content = readFileSync(this.installedPath, 'utf-8');
      const data = JSON.parse(content) as InstalledPack[];
      for (const pack of data) {
        this.installed.set(pack.id, pack);
      }
    } catch {
      // Ignore load errors
    }
  }

  /**
   * Save installed packs to disk
   */
  private saveInstalled(): void {
    const dir = dirname(this.installedPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const data = Array.from(this.installed.values());
    writeFileSync(this.installedPath, JSON.stringify(data, null, 2));
  }

  /**
   * Install a pack
   */
  async install(id: string, options: InstallOptions = {}): Promise<InstallResult> {
    try {
      // Check if already installed
      const existing = this.installed.get(id);
      if (existing && !options.force) {
        return {
          success: false,
          error: `Pack ${id} is already installed (v${existing.version}). Use --force to reinstall.`,
        };
      }

      // Get pack info
      const entry = await this.registry.getPack(id);
      if (!entry) {
        return {
          success: false,
          error: `Pack not found: ${id}`,
        };
      }

      const pack = entry.pack;
      const version = options.version || pack.version;

      // Install dependencies first
      const installedDeps: InstalledPack[] = [];
      if (!options.skipDeps && pack.dependencies) {
        for (const depId of pack.dependencies) {
          if (!this.installed.has(depId)) {
            const depResult = await this.install(depId, { skipDeps: false });
            if (!depResult.success) {
              return {
                success: false,
                error: `Failed to install dependency ${depId}: ${depResult.error}`,
              };
            }
            if (depResult.pack) {
              installedDeps.push(depResult.pack);
            }
          }
        }
      }

      // Download pack
      const buffer = await this.registry.downloadPack(id, version);

      // Extract to install directory
      const installPath = options.path || join(this.config.installDir, id);
      await this.extractPack(buffer, installPath);

      // Record installation
      const installedPack: InstalledPack = {
        id,
        version,
        path: installPath,
        installedAt: new Date().toISOString(),
      };

      this.installed.set(id, installedPack);
      this.saveInstalled();

      return {
        success: true,
        pack: installedPack,
        dependencies: installedDeps.length > 0 ? installedDeps : undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Installation failed',
      };
    }
  }

  /**
   * Uninstall a pack
   */
  async uninstall(id: string): Promise<{ success: boolean; error?: string }> {
    const pack = this.installed.get(id);
    if (!pack) {
      return { success: false, error: `Pack not installed: ${id}` };
    }

    try {
      // Remove files
      if (existsSync(pack.path)) {
        rmSync(pack.path, { recursive: true, force: true });
      }

      // Update installed list
      this.installed.delete(id);
      this.saveInstalled();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Uninstall failed',
      };
    }
  }

  /**
   * Update a pack
   */
  async update(id: string): Promise<InstallResult> {
    const existing = this.installed.get(id);
    if (!existing) {
      return { success: false, error: `Pack not installed: ${id}` };
    }

    // Check for updates
    const entry = await this.registry.getPack(id);
    if (!entry) {
      return { success: false, error: `Pack not found in registry: ${id}` };
    }

    if (entry.pack.version === existing.version) {
      return { success: true, pack: existing };
    }

    // Reinstall with latest version
    return this.install(id, { force: true });
  }

  /**
   * Update all installed packs
   */
  async updateAll(): Promise<Map<string, InstallResult>> {
    const results = new Map<string, InstallResult>();

    for (const [id] of this.installed) {
      results.set(id, await this.update(id));
    }

    return results;
  }

  /**
   * Check for updates
   */
  async checkUpdates(): Promise<Map<string, string>> {
    const updates = new Map<string, string>();

    for (const [id, pack] of this.installed) {
      const entry = await this.registry.getPack(id);
      if (entry && entry.pack.version !== pack.version) {
        updates.set(id, entry.pack.version);
        pack.updateAvailable = true;
        pack.latestVersion = entry.pack.version;
      }
    }

    if (updates.size > 0) {
      this.saveInstalled();
    }

    return updates;
  }

  /**
   * List installed packs
   */
  list(): InstalledPack[] {
    return Array.from(this.installed.values());
  }

  /**
   * Get an installed pack
   */
  get(id: string): InstalledPack | undefined {
    return this.installed.get(id);
  }

  /**
   * Check if a pack is installed
   */
  isInstalled(id: string): boolean {
    return this.installed.has(id);
  }

  /**
   * Get templates from an installed pack
   */
  getPackTemplates(id: string): string[] {
    const pack = this.installed.get(id);
    if (!pack) return [];

    const manifestPath = join(pack.path, MANIFEST_FILE);
    if (!existsSync(manifestPath)) return [];

    try {
      const content = readFileSync(manifestPath, 'utf-8');
      const manifest = JSON.parse(content) as TemplatePack;
      return manifest.templates;
    } catch {
      return [];
    }
  }

  /**
   * Get all templates from all installed packs
   */
  getAllTemplates(): Array<{ packId: string; templateId: string; path: string }> {
    const templates: Array<{ packId: string; templateId: string; path: string }> = [];

    for (const [packId, pack] of this.installed) {
      const templatesDir = join(pack.path, 'templates');
      if (!existsSync(templatesDir)) continue;

      const files = readdirSync(templatesDir);
      for (const file of files) {
        if (file.endsWith('.yaml') || file.endsWith('.yml')) {
          templates.push({
            packId,
            templateId: file.replace(/\.ya?ml$/, ''),
            path: join(templatesDir, file),
          });
        }
      }
    }

    return templates;
  }

  /**
   * Extract pack from buffer
   */
  private async extractPack(buffer: Buffer, destPath: string): Promise<void> {
    // Create destination directory
    if (!existsSync(destPath)) {
      mkdirSync(destPath, { recursive: true });
    }

    // For now, assume pack is a JSON manifest + templates
    // In production, this would extract from tar.gz
    try {
      // Try to parse as JSON (simple format for built-in packs)
      const content = buffer.toString('utf-8');
      const data = JSON.parse(content);

      // Write manifest
      writeFileSync(
        join(destPath, MANIFEST_FILE),
        JSON.stringify(data.manifest || data, null, 2)
      );

      // Write templates
      if (data.templates) {
        const templatesDir = join(destPath, 'templates');
        mkdirSync(templatesDir, { recursive: true });

        for (const [name, template] of Object.entries(data.templates)) {
          writeFileSync(
            join(templatesDir, `${name}.yaml`),
            typeof template === 'string' ? template : JSON.stringify(template, null, 2)
          );
        }
      }
    } catch {
      // If not JSON, write raw buffer (for tar.gz in future)
      writeFileSync(join(destPath, 'pack.tar.gz'), buffer);
    }
  }

  /**
   * Get the registry instance
   */
  getRegistry(): MarketplaceRegistry {
    return this.registry;
  }
}

/**
 * Create a pack manager instance
 */
export function createPackManager(config?: Partial<MarketplaceConfig>): PackManager {
  return new PackManager(config);
}
