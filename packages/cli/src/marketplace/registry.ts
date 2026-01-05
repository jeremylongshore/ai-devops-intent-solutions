/**
 * Template Marketplace Registry
 * Fetch, search, and manage template packs from remote registry
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { createHash } from 'crypto';
import type {
  RegistryIndex,
  RegistryEntry,
  SearchFilters,
  SearchResults,
  MarketplaceConfig,
} from './types.js';
import { DEFAULT_MARKETPLACE_CONFIG } from './types.js';

export class MarketplaceRegistry {
  private config: MarketplaceConfig;
  private index: RegistryIndex | null = null;
  private indexPath: string;

  constructor(config: Partial<MarketplaceConfig> = {}) {
    this.config = { ...DEFAULT_MARKETPLACE_CONFIG, ...config };
    this.indexPath = join(this.config.cacheDir, 'registry-index.json');
  }

  /**
   * Fetch latest registry index from remote
   */
  async fetchIndex(): Promise<RegistryIndex> {
    try {
      const response = await fetch(`${this.config.registryUrl}/index.json`);

      if (!response.ok) {
        throw new Error(`Registry fetch failed: ${response.status}`);
      }

      const index = await response.json() as RegistryIndex;
      this.index = index;

      // Cache locally
      this.cacheIndex(index);

      return index;
    } catch (error) {
      // Fall back to cached index
      const cached = this.loadCachedIndex();
      if (cached) {
        this.index = cached;
        return cached;
      }

      // Fall back to built-in index
      return this.getBuiltInIndex();
    }
  }

  /**
   * Get current index (fetch if not loaded)
   */
  async getIndex(): Promise<RegistryIndex> {
    if (this.index) return this.index;
    return this.fetchIndex();
  }

  /**
   * Search for packs
   */
  async search(filters: SearchFilters = {}): Promise<SearchResults> {
    const index = await this.getIndex();
    let packs = [...index.packs];

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      packs = packs.filter(p =>
        p.pack.name.toLowerCase().includes(query) ||
        p.pack.description.toLowerCase().includes(query) ||
        p.pack.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    if (filters.category) {
      packs = packs.filter(p => p.pack.category === filters.category);
    }

    if (filters.vertical) {
      packs = packs.filter(p => p.pack.vertical === filters.vertical);
    }

    if (filters.framework) {
      packs = packs.filter(p => p.pack.framework === filters.framework);
    }

    if (filters.compliance) {
      packs = packs.filter(p => p.pack.compliance === filters.compliance);
    }

    if (filters.tags && filters.tags.length > 0) {
      packs = packs.filter(p =>
        filters.tags!.some(t => p.pack.tags.includes(t))
      );
    }

    if (filters.author) {
      packs = packs.filter(p =>
        p.pack.author.name.toLowerCase().includes(filters.author!.toLowerCase())
      );
    }

    if (filters.verified) {
      packs = packs.filter(p => p.verified);
    }

    if (filters.featured) {
      packs = packs.filter(p => p.featured);
    }

    // Sort
    const sortBy = filters.sortBy || 'downloads';
    const sortDir = filters.sortDir || 'desc';
    const multiplier = sortDir === 'desc' ? -1 : 1;

    packs.sort((a, b) => {
      switch (sortBy) {
        case 'downloads':
          return ((a.pack.downloads || 0) - (b.pack.downloads || 0)) * multiplier;
        case 'stars':
          return ((a.pack.stars || 0) - (b.pack.stars || 0)) * multiplier;
        case 'updated':
          return (new Date(a.pack.updatedAt).getTime() - new Date(b.pack.updatedAt).getTime()) * multiplier;
        case 'name':
          return a.pack.name.localeCompare(b.pack.name) * multiplier;
        default:
          return 0;
      }
    });

    // Paginate
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const start = (page - 1) * pageSize;
    const paginated = packs.slice(start, start + pageSize);

    return {
      packs: paginated,
      total: packs.length,
      page,
      pageSize,
    };
  }

  /**
   * Get a specific pack by ID
   */
  async getPack(id: string): Promise<RegistryEntry | null> {
    const index = await this.getIndex();
    return index.packs.find(p => p.pack.id === id) || null;
  }

  /**
   * Get featured packs
   */
  async getFeatured(limit: number = 5): Promise<RegistryEntry[]> {
    const index = await this.getIndex();
    return index.packs
      .filter(p => p.featured)
      .slice(0, limit);
  }

  /**
   * Get popular packs
   */
  async getPopular(limit: number = 10): Promise<RegistryEntry[]> {
    const index = await this.getIndex();
    return [...index.packs]
      .sort((a, b) => (b.pack.downloads || 0) - (a.pack.downloads || 0))
      .slice(0, limit);
  }

  /**
   * Get packs by category
   */
  async getByCategory(category: string, limit?: number): Promise<RegistryEntry[]> {
    const index = await this.getIndex();
    const filtered = index.packs.filter(p => p.pack.category === category);
    return limit ? filtered.slice(0, limit) : filtered;
  }

  /**
   * Get packs by vertical
   */
  async getByVertical(vertical: string): Promise<RegistryEntry[]> {
    const index = await this.getIndex();
    return index.packs.filter(p => p.pack.vertical === vertical);
  }

  /**
   * Get packs by framework
   */
  async getByFramework(framework: string): Promise<RegistryEntry[]> {
    const index = await this.getIndex();
    return index.packs.filter(p => p.pack.framework === framework);
  }

  /**
   * Get packs by compliance standard
   */
  async getByCompliance(compliance: string): Promise<RegistryEntry[]> {
    const index = await this.getIndex();
    return index.packs.filter(p => p.pack.compliance === compliance);
  }

  /**
   * Download a pack
   */
  async downloadPack(id: string, version?: string): Promise<Buffer> {
    const pack = await this.getPack(id);
    if (!pack) {
      throw new Error(`Pack not found: ${id}`);
    }

    const url = version
      ? pack.downloadUrl.replace(pack.pack.version, version)
      : pack.downloadUrl;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // Verify checksum
    const hash = createHash('sha256').update(buffer).digest('hex');
    if (hash !== pack.checksum) {
      throw new Error('Checksum verification failed');
    }

    return buffer;
  }

  /**
   * Cache index locally
   */
  private cacheIndex(index: RegistryIndex): void {
    const dir = dirname(this.indexPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(this.indexPath, JSON.stringify(index, null, 2));
  }

  /**
   * Load cached index
   */
  private loadCachedIndex(): RegistryIndex | null {
    if (!existsSync(this.indexPath)) return null;

    try {
      const content = readFileSync(this.indexPath, 'utf-8');
      return JSON.parse(content) as RegistryIndex;
    } catch {
      return null;
    }
  }

  /**
   * Get built-in index with official packs
   */
  private getBuiltInIndex(): RegistryIndex {
    return {
      version: '1.0.0',
      updatedAt: new Date().toISOString(),
      packs: this.getBuiltInPacks(),
    };
  }

  /**
   * Built-in official packs
   */
  private getBuiltInPacks(): RegistryEntry[] {
    const now = new Date().toISOString();

    return [
      // Vertical packs
      {
        pack: {
          id: 'blueprint-fintech',
          name: 'FinTech Template Pack',
          description: 'Templates for financial technology products including regulatory compliance, security, and payment processing',
          version: '1.0.0',
          author: { name: 'Intent Solutions', email: 'templates@intentsolutions.io' },
          category: 'vertical',
          vertical: 'fintech',
          templates: ['fintech-prd', 'fintech-security', 'fintech-compliance', 'payment-integration'],
          tags: ['fintech', 'payments', 'banking', 'compliance', 'pci'],
          license: 'Apache-2.0',
          downloads: 1250,
          stars: 45,
          createdAt: now,
          updatedAt: now,
        },
        downloadUrl: 'https://registry.intentsolutions.io/packs/blueprint-fintech-1.0.0.tar.gz',
        checksum: 'sha256:placeholder',
        size: 45000,
        verified: true,
        featured: true,
      },
      {
        pack: {
          id: 'blueprint-healthtech',
          name: 'HealthTech Template Pack',
          description: 'HIPAA-compliant templates for healthcare applications including patient data, telehealth, and medical devices',
          version: '1.0.0',
          author: { name: 'Intent Solutions', email: 'templates@intentsolutions.io' },
          category: 'vertical',
          vertical: 'healthtech',
          templates: ['healthtech-prd', 'hipaa-compliance', 'patient-data', 'telehealth-integration'],
          tags: ['healthtech', 'hipaa', 'healthcare', 'medical', 'telehealth'],
          license: 'Apache-2.0',
          downloads: 890,
          stars: 38,
          createdAt: now,
          updatedAt: now,
        },
        downloadUrl: 'https://registry.intentsolutions.io/packs/blueprint-healthtech-1.0.0.tar.gz',
        checksum: 'sha256:placeholder',
        size: 52000,
        verified: true,
        featured: true,
      },
      {
        pack: {
          id: 'blueprint-saas',
          name: 'SaaS Template Pack',
          description: 'Templates for SaaS products including multi-tenancy, subscription billing, and user management',
          version: '1.0.0',
          author: { name: 'Intent Solutions', email: 'templates@intentsolutions.io' },
          category: 'vertical',
          vertical: 'saas',
          templates: ['saas-prd', 'multi-tenancy', 'subscription-billing', 'user-management'],
          tags: ['saas', 'subscription', 'multi-tenant', 'billing', 'b2b'],
          license: 'Apache-2.0',
          downloads: 2100,
          stars: 67,
          createdAt: now,
          updatedAt: now,
        },
        downloadUrl: 'https://registry.intentsolutions.io/packs/blueprint-saas-1.0.0.tar.gz',
        checksum: 'sha256:placeholder',
        size: 38000,
        verified: true,
        featured: true,
      },

      // Compliance packs
      {
        pack: {
          id: 'blueprint-soc2',
          name: 'SOC 2 Compliance Pack',
          description: 'SOC 2 Type I and II compliance documentation templates with controls mapping',
          version: '1.0.0',
          author: { name: 'Intent Solutions', email: 'templates@intentsolutions.io' },
          category: 'compliance',
          compliance: 'soc2',
          templates: ['soc2-policies', 'soc2-controls', 'soc2-audit-prep', 'soc2-evidence'],
          tags: ['soc2', 'compliance', 'audit', 'security', 'trust'],
          license: 'Apache-2.0',
          downloads: 1560,
          stars: 52,
          createdAt: now,
          updatedAt: now,
        },
        downloadUrl: 'https://registry.intentsolutions.io/packs/blueprint-soc2-1.0.0.tar.gz',
        checksum: 'sha256:placeholder',
        size: 68000,
        verified: true,
        featured: true,
      },
      {
        pack: {
          id: 'blueprint-hipaa',
          name: 'HIPAA Compliance Pack',
          description: 'HIPAA compliance documentation including privacy, security, and breach notification',
          version: '1.0.0',
          author: { name: 'Intent Solutions', email: 'templates@intentsolutions.io' },
          category: 'compliance',
          compliance: 'hipaa',
          templates: ['hipaa-policies', 'hipaa-security', 'hipaa-privacy', 'baa-template'],
          tags: ['hipaa', 'compliance', 'healthcare', 'privacy', 'security'],
          license: 'Apache-2.0',
          downloads: 780,
          stars: 34,
          createdAt: now,
          updatedAt: now,
        },
        downloadUrl: 'https://registry.intentsolutions.io/packs/blueprint-hipaa-1.0.0.tar.gz',
        checksum: 'sha256:placeholder',
        size: 72000,
        verified: true,
        featured: false,
      },
      {
        pack: {
          id: 'blueprint-gdpr',
          name: 'GDPR Compliance Pack',
          description: 'GDPR compliance templates including DPIAs, consent management, and data subject rights',
          version: '1.0.0',
          author: { name: 'Intent Solutions', email: 'templates@intentsolutions.io' },
          category: 'compliance',
          compliance: 'gdpr',
          templates: ['gdpr-policies', 'dpia-template', 'consent-management', 'dsr-procedures'],
          tags: ['gdpr', 'compliance', 'privacy', 'eu', 'data-protection'],
          license: 'Apache-2.0',
          downloads: 1340,
          stars: 48,
          createdAt: now,
          updatedAt: now,
        },
        downloadUrl: 'https://registry.intentsolutions.io/packs/blueprint-gdpr-1.0.0.tar.gz',
        checksum: 'sha256:placeholder',
        size: 58000,
        verified: true,
        featured: true,
      },

      // Framework packs
      {
        pack: {
          id: 'blueprint-nextjs',
          name: 'Next.js Template Pack',
          description: 'Templates optimized for Next.js applications including App Router, API routes, and deployment',
          version: '1.0.0',
          author: { name: 'Intent Solutions', email: 'templates@intentsolutions.io' },
          category: 'framework',
          framework: 'nextjs',
          templates: ['nextjs-prd', 'nextjs-architecture', 'nextjs-deployment', 'nextjs-testing'],
          tags: ['nextjs', 'react', 'vercel', 'frontend', 'fullstack'],
          license: 'Apache-2.0',
          downloads: 3200,
          stars: 89,
          createdAt: now,
          updatedAt: now,
        },
        downloadUrl: 'https://registry.intentsolutions.io/packs/blueprint-nextjs-1.0.0.tar.gz',
        checksum: 'sha256:placeholder',
        size: 42000,
        verified: true,
        featured: true,
      },
      {
        pack: {
          id: 'blueprint-fastapi',
          name: 'FastAPI Template Pack',
          description: 'Templates for FastAPI backends including async patterns, OpenAPI specs, and testing',
          version: '1.0.0',
          author: { name: 'Intent Solutions', email: 'templates@intentsolutions.io' },
          category: 'framework',
          framework: 'fastapi',
          templates: ['fastapi-prd', 'fastapi-architecture', 'openapi-spec', 'fastapi-testing'],
          tags: ['fastapi', 'python', 'api', 'async', 'backend'],
          license: 'Apache-2.0',
          downloads: 1890,
          stars: 62,
          createdAt: now,
          updatedAt: now,
        },
        downloadUrl: 'https://registry.intentsolutions.io/packs/blueprint-fastapi-1.0.0.tar.gz',
        checksum: 'sha256:placeholder',
        size: 36000,
        verified: true,
        featured: true,
      },
      {
        pack: {
          id: 'blueprint-rails',
          name: 'Ruby on Rails Template Pack',
          description: 'Templates for Rails applications including REST APIs, background jobs, and deployment',
          version: '1.0.0',
          author: { name: 'Intent Solutions', email: 'templates@intentsolutions.io' },
          category: 'framework',
          framework: 'rails',
          templates: ['rails-prd', 'rails-architecture', 'rails-api', 'rails-deployment'],
          tags: ['rails', 'ruby', 'api', 'backend', 'mvc'],
          license: 'Apache-2.0',
          downloads: 1120,
          stars: 41,
          createdAt: now,
          updatedAt: now,
        },
        downloadUrl: 'https://registry.intentsolutions.io/packs/blueprint-rails-1.0.0.tar.gz',
        checksum: 'sha256:placeholder',
        size: 34000,
        verified: true,
        featured: false,
      },
    ];
  }
}

/**
 * Create a marketplace registry instance
 */
export function createMarketplaceRegistry(config?: Partial<MarketplaceConfig>): MarketplaceRegistry {
  return new MarketplaceRegistry(config);
}
