/**
 * Marketplace CLI Commands
 * Commands for managing template packs and marketplace
 */

import { createMarketplace } from '../marketplace/index.js';
import type { SearchFilters } from '../marketplace/types.js';

/**
 * Search marketplace for template packs
 */
export async function searchPacks(query?: string, options: {
  category?: string;
  tags?: string[];
  limit?: number;
} = {}): Promise<void> {
  const marketplace = createMarketplace();

  const filters: SearchFilters = {
    query,
    category: options.category as SearchFilters['category'],
    tags: options.tags,
    pageSize: options.limit || 20,
  };

  const results = await marketplace.search(filters);

  console.log('\n╭─────────────────────────────────────────────────────────────────╮');
  console.log('│                    TEMPLATE PACK MARKETPLACE                    │');
  console.log('╰─────────────────────────────────────────────────────────────────╯\n');

  if (results.packs.length === 0) {
    console.log('  No packs found matching your search criteria.\n');
    return;
  }

  console.log(`  Found ${results.total} packs (showing ${results.packs.length}):\n`);

  for (const entry of results.packs) {
    const pack = entry.pack;
    const stars = pack.stars ? `★ ${pack.stars}` : '';
    const downloads = pack.downloads ? `↓ ${pack.downloads}` : '';
    const featured = entry.featured ? '⭐ Featured' : '';

    console.log(`  ┌─ ${pack.name} v${pack.version}`);
    console.log(`  │  ${pack.description}`);
    console.log(`  │  Category: ${pack.category} │ Tags: ${pack.tags.join(', ')}`);
    if (stars || downloads || featured) {
      console.log(`  │  ${[stars, downloads, featured].filter(Boolean).join(' │ ')}`);
    }
    console.log(`  └─ Install: blueprint pack install ${pack.id}\n`);
  }
}

/**
 * List installed packs
 */
export async function listInstalledPacks(): Promise<void> {
  const marketplace = createMarketplace();
  const installed = marketplace.listInstalled();

  console.log('\n╭─────────────────────────────────────────────────────────────────╮');
  console.log('│                       INSTALLED PACKS                          │');
  console.log('╰─────────────────────────────────────────────────────────────────╯\n');

  if (installed.length === 0) {
    console.log('  No packs installed.\n');
    console.log('  Run `blueprint pack search` to find packs to install.\n');
    return;
  }

  console.log(`  ${installed.length} pack(s) installed:\n`);

  for (const pack of installed) {
    const update = pack.updateAvailable ? ` (update available: ${pack.latestVersion})` : '';
    console.log(`  • ${pack.id} v${pack.version}${update}`);
    console.log(`    Installed: ${new Date(pack.installedAt).toLocaleDateString()}`);
    console.log(`    Path: ${pack.path}\n`);
  }
}

/**
 * Install a pack
 */
export async function installPack(packId: string, options: {
  version?: string;
  force?: boolean;
} = {}): Promise<void> {
  const marketplace = createMarketplace();

  console.log(`\n  Installing pack: ${packId}...`);

  const result = await marketplace.install(packId, {
    version: options.version,
    force: options.force,
  });

  if (result.success) {
    console.log(`  ✓ Pack installed successfully!`);
    if (result.pack) {
      console.log(`    Version: ${result.pack.version}`);
      console.log(`    Path: ${result.pack.path}`);
    }
    if (result.dependencies && result.dependencies.length > 0) {
      console.log(`    Dependencies installed: ${result.dependencies.map(d => d.id).join(', ')}`);
    }
  } else {
    console.error(`  ✗ Installation failed: ${result.error}`);
  }
  console.log('');
}

/**
 * Uninstall a pack
 */
export async function uninstallPack(packId: string): Promise<void> {
  const marketplace = createMarketplace();

  console.log(`\n  Uninstalling pack: ${packId}...`);

  const result = await marketplace.uninstall(packId);

  if (result.success) {
    console.log(`  ✓ Pack uninstalled successfully!\n`);
  } else {
    console.error(`  ✗ Uninstall failed: ${result.error}\n`);
  }
}

/**
 * Update packs
 */
export async function updatePacks(packId?: string): Promise<void> {
  const marketplace = createMarketplace();

  if (packId) {
    console.log(`\n  Updating pack: ${packId}...`);
    const result = await marketplace.update(packId);
    if (result.success) {
      console.log(`  ✓ Pack updated to v${result.pack?.version}\n`);
    } else {
      console.error(`  ✗ Update failed: ${result.error}\n`);
    }
  } else {
    console.log('\n  Checking for updates...');
    const updates = await marketplace.checkUpdates();

    if (updates.size === 0) {
      console.log('  All packs are up to date.\n');
      return;
    }

    console.log(`  ${updates.size} update(s) available:\n`);
    for (const [id, version] of updates) {
      console.log(`    • ${id} → v${version}`);
    }

    console.log('\n  Updating all packs...');
    const results = await marketplace.updateAll();

    let success = 0;
    let failed = 0;
    for (const [id, result] of results) {
      if (result.success) {
        success++;
      } else {
        failed++;
        console.error(`  ✗ Failed to update ${id}: ${result.error}`);
      }
    }

    console.log(`\n  Update complete: ${success} succeeded, ${failed} failed.\n`);
  }
}

/**
 * Show featured packs
 */
export async function showFeaturedPacks(): Promise<void> {
  const marketplace = createMarketplace();
  const featured = await marketplace.getFeatured();

  console.log('\n╭─────────────────────────────────────────────────────────────────╮');
  console.log('│                      ⭐ FEATURED PACKS                          │');
  console.log('╰─────────────────────────────────────────────────────────────────╯\n');

  if (featured.length === 0) {
    console.log('  No featured packs available.\n');
    return;
  }

  for (const entry of featured) {
    const pack = entry.pack;
    console.log(`  ┌─ ${pack.name}`);
    console.log(`  │  ${pack.description}`);
    console.log(`  │  Category: ${pack.category} │ Templates: ${pack.templates.length}`);
    console.log(`  └─ Install: blueprint pack install ${pack.id}\n`);
  }
}

/**
 * Show popular packs
 */
export async function showPopularPacks(limit: number = 10): Promise<void> {
  const marketplace = createMarketplace();
  const popular = await marketplace.getPopular(limit);

  console.log('\n╭─────────────────────────────────────────────────────────────────╮');
  console.log('│                      📊 POPULAR PACKS                           │');
  console.log('╰─────────────────────────────────────────────────────────────────╯\n');

  if (popular.length === 0) {
    console.log('  No popular packs available.\n');
    return;
  }

  for (let i = 0; i < popular.length; i++) {
    const entry = popular[i];
    const pack = entry.pack;
    const downloads = pack.downloads || 0;
    console.log(`  ${(i + 1).toString().padStart(2)}. ${pack.name} (${downloads.toLocaleString()} downloads)`);
    console.log(`      ${pack.description.substring(0, 60)}...`);
    console.log(`      Install: blueprint pack install ${pack.id}\n`);
  }
}

/**
 * Show pack details
 */
export async function showPackDetails(packId: string): Promise<void> {
  const marketplace = createMarketplace();
  const registry = marketplace.getRegistry();
  const entry = await registry.getPack(packId);

  if (!entry) {
    console.error(`\n  Pack not found: ${packId}\n`);
    return;
  }

  const pack = entry.pack;

  console.log('\n╭─────────────────────────────────────────────────────────────────╮');
  console.log(`│  ${pack.name.padEnd(59)} │`);
  console.log('╰─────────────────────────────────────────────────────────────────╯\n');

  console.log(`  ${pack.description}\n`);

  console.log('  Details');
  console.log('  ─────────────────────────────────────────────────────────────────');
  console.log(`  ID:           ${pack.id}`);
  console.log(`  Version:      ${pack.version}`);
  console.log(`  Author:       ${pack.author.name}`);
  console.log(`  Category:     ${pack.category}`);
  console.log(`  License:      ${pack.license}`);
  console.log(`  Templates:    ${pack.templates.length}`);
  console.log(`  Tags:         ${pack.tags.join(', ')}`);
  console.log('');

  if (pack.stars || pack.downloads) {
    console.log('  Statistics');
    console.log('  ─────────────────────────────────────────────────────────────────');
    if (pack.stars) console.log(`  Stars:        ${pack.stars}`);
    if (pack.downloads) console.log(`  Downloads:    ${pack.downloads.toLocaleString()}`);
    console.log('');
  }

  console.log('  Templates');
  console.log('  ─────────────────────────────────────────────────────────────────');
  for (const templateId of pack.templates) {
    console.log(`  • ${templateId}`);
  }
  console.log('');

  if (pack.dependencies && pack.dependencies.length > 0) {
    console.log('  Dependencies');
    console.log('  ─────────────────────────────────────────────────────────────────');
    for (const dep of pack.dependencies) {
      console.log(`  • ${dep}`);
    }
    console.log('');
  }

  console.log(`  Install: blueprint pack install ${pack.id}\n`);
}

/**
 * List available built-in templates
 */
export async function listBuiltinTemplates(category?: string): Promise<void> {
  const marketplace = createMarketplace();
  let templates = marketplace.getBuiltinTemplates();

  if (category) {
    templates = templates.filter(t => t.meta.category === category);
  }

  console.log('\n╭─────────────────────────────────────────────────────────────────╮');
  console.log('│                     BUILT-IN TEMPLATES                          │');
  console.log('╰─────────────────────────────────────────────────────────────────╯\n');

  if (templates.length === 0) {
    console.log('  No templates found.\n');
    return;
  }

  // Group by category
  const byCategory = new Map<string, typeof templates>();
  for (const t of templates) {
    const cat = t.meta.category;
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(t);
  }

  for (const [cat, catTemplates] of byCategory) {
    console.log(`  ${cat.toUpperCase()}`);
    console.log('  ' + '─'.repeat(65));
    for (const t of catTemplates) {
      console.log(`  • ${t.meta.id}`);
      console.log(`    ${t.meta.name}`);
      console.log(`    ${t.meta.description}`);
      console.log(`    Tags: ${(t.meta.tags || []).join(', ')}\n`);
    }
    console.log('');
  }

  console.log(`  Total: ${templates.length} templates\n`);
}

/**
 * Main marketplace command handler
 */
export async function handleMarketplaceCommand(args: string[]): Promise<void> {
  const [subcommand, ...rest] = args;

  switch (subcommand) {
    case 'search':
      await searchPacks(rest[0], {
        category: rest.find(a => a.startsWith('--category='))?.split('=')[1],
        tags: rest.filter(a => a.startsWith('--tag=')).map(a => a.split('=')[1]),
      });
      break;

    case 'list':
      if (rest[0] === '--builtin') {
        await listBuiltinTemplates(rest[1]);
      } else {
        await listInstalledPacks();
      }
      break;

    case 'install':
      if (!rest[0]) {
        console.error('\n  Usage: blueprint pack install <pack-id>\n');
        return;
      }
      await installPack(rest[0], {
        version: rest.find(a => a.startsWith('--version='))?.split('=')[1],
        force: rest.includes('--force'),
      });
      break;

    case 'uninstall':
      if (!rest[0]) {
        console.error('\n  Usage: blueprint pack uninstall <pack-id>\n');
        return;
      }
      await uninstallPack(rest[0]);
      break;

    case 'update':
      await updatePacks(rest[0]);
      break;

    case 'featured':
      await showFeaturedPacks();
      break;

    case 'popular':
      await showPopularPacks(parseInt(rest[0]) || 10);
      break;

    case 'info':
      if (!rest[0]) {
        console.error('\n  Usage: blueprint pack info <pack-id>\n');
        return;
      }
      await showPackDetails(rest[0]);
      break;

    default:
      console.log(`
╭─────────────────────────────────────────────────────────────────╮
│                   MARKETPLACE COMMANDS                          │
╰─────────────────────────────────────────────────────────────────╯

  blueprint pack search [query]       Search for template packs
  blueprint pack list                 List installed packs
  blueprint pack list --builtin       List built-in templates
  blueprint pack install <pack-id>    Install a pack
  blueprint pack uninstall <pack-id>  Uninstall a pack
  blueprint pack update [pack-id]     Update pack(s)
  blueprint pack featured             Show featured packs
  blueprint pack popular              Show popular packs
  blueprint pack info <pack-id>       Show pack details

Options:
  --category=<cat>    Filter by category
  --tag=<tag>         Filter by tag (can use multiple)
  --version=<ver>     Install specific version
  --force             Force reinstall

Examples:
  blueprint pack search fintech
  blueprint pack install blueprint-fintech
  blueprint pack info blueprint-soc2
`);
  }
}
