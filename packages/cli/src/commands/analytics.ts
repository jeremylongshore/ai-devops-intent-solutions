/**
 * Analytics CLI Commands
 * Commands for viewing usage analytics and reports
 */

import { getAnalytics } from '../analytics/index.js';
import type { DashboardOptions } from '../analytics/types.js';

/**
 * Show analytics dashboard
 */
export async function showDashboard(options: DashboardOptions = { period: 'month', format: 'table' }): Promise<void> {
  const analytics = getAnalytics();
  const output = await analytics.renderDashboard(options);
  console.log(output);
}

/**
 * Show template statistics
 */
export async function showTemplateStats(options: DashboardOptions = { period: 'month', format: 'table' }): Promise<void> {
  const analytics = getAnalytics();
  const data = await analytics.getDashboardData(options);

  console.log('\n╭─────────────────────────────────────────────────────────────────╮');
  console.log('│                     TEMPLATE STATISTICS                         │');
  console.log('╰─────────────────────────────────────────────────────────────────╯\n');

  if (data.templateStats.length === 0) {
    console.log('  No template usage data available.\n');
    console.log('  Generate some documents to see statistics!\n');
    return;
  }

  console.log('  Template'.padEnd(35) + 'Uses'.padStart(8) + 'Users'.padStart(8) + 'Avg Time'.padStart(10));
  console.log('  ' + '─'.repeat(61));

  for (const stat of data.templateStats) {
    const avgTime = stat.avgCompletionTime > 0 ? `${Math.round(stat.avgCompletionTime / 1000)}s` : '-';
    console.log(
      `  ${stat.templateName.substring(0, 33).padEnd(33)}` +
      `${stat.totalGenerations.toString().padStart(8)}` +
      `${stat.uniqueUsers.toString().padStart(8)}` +
      `${avgTime.padStart(10)}`
    );
  }

  console.log('');
  console.log(`  Total: ${data.templateStats.reduce((sum, t) => sum + t.totalGenerations, 0)} generations\n`);
}

/**
 * Show pack statistics
 */
export async function showPackStats(options: DashboardOptions = { period: 'month', format: 'table' }): Promise<void> {
  const analytics = getAnalytics();
  const data = await analytics.getDashboardData(options);

  console.log('\n╭─────────────────────────────────────────────────────────────────╮');
  console.log('│                       PACK STATISTICS                           │');
  console.log('╰─────────────────────────────────────────────────────────────────╯\n');

  if (data.packStats.length === 0) {
    console.log('  No pack usage data available.\n');
    return;
  }

  console.log('  Pack'.padEnd(35) + 'Installs'.padStart(10) + 'Active'.padStart(8) + 'Removed'.padStart(10));
  console.log('  ' + '─'.repeat(63));

  for (const stat of data.packStats) {
    console.log(
      `  ${stat.packName.substring(0, 33).padEnd(33)}` +
      `${stat.totalInstalls.toString().padStart(10)}` +
      `${stat.activeInstalls.toString().padStart(8)}` +
      `${stat.uninstalls.toString().padStart(10)}`
    );
  }

  console.log('');
}

/**
 * Show error report
 */
export async function showErrorReport(options: DashboardOptions = { period: 'month', format: 'table' }): Promise<void> {
  const analytics = getAnalytics();
  const data = await analytics.getDashboardData(options);

  console.log('\n╭─────────────────────────────────────────────────────────────────╮');
  console.log('│                        ERROR REPORT                             │');
  console.log('╰─────────────────────────────────────────────────────────────────╯\n');

  if (!data.errors || data.errors.length === 0) {
    console.log('  ✓ No errors recorded in this period!\n');
    return;
  }

  console.log(`  Total errors: ${data.summary.totals.errors}\n`);

  console.log('  Error Type'.padEnd(40) + 'Count'.padStart(8) + 'Last Occurred'.padStart(20));
  console.log('  ' + '─'.repeat(68));

  for (const error of data.errors) {
    console.log(
      `  ${error.type.substring(0, 38).padEnd(38)}` +
      `${error.count.toString().padStart(8)}` +
      `${error.lastOccurred.split('T')[0].padStart(20)}`
    );
  }

  console.log('');
}

/**
 * Show activity over time
 */
export async function showActivityChart(options: DashboardOptions = { period: 'week', format: 'table' }): Promise<void> {
  const analytics = getAnalytics();
  const data = await analytics.getDashboardData(options);

  console.log('\n╭─────────────────────────────────────────────────────────────────╮');
  console.log('│                      ACTIVITY CHART                             │');
  console.log('╰─────────────────────────────────────────────────────────────────╯\n');

  if (data.summary.dailyActivity.length === 0) {
    console.log('  No activity data available.\n');
    return;
  }

  // Find max for scaling
  const maxGenerations = Math.max(...data.summary.dailyActivity.map(d => d.generations), 1);
  const barWidth = 40;

  console.log('  Date       │ Generations');
  console.log('  ───────────┼' + '─'.repeat(45));

  for (const day of data.summary.dailyActivity) {
    const barLength = Math.round((day.generations / maxGenerations) * barWidth);
    const bar = '█'.repeat(barLength) + '░'.repeat(barWidth - barLength);
    console.log(`  ${day.date} │ ${bar} ${day.generations}`);
  }

  console.log('');
  console.log(`  Peak: ${maxGenerations} generations │ Total: ${data.summary.totals.generations}\n`);
}

/**
 * Export analytics data
 */
export async function exportAnalytics(format: 'json' | 'csv', outputPath?: string): Promise<void> {
  const analytics = getAnalytics();
  const output = await analytics.renderDashboard({ period: 'all', format });

  if (outputPath) {
    const fs = await import('fs');
    fs.writeFileSync(outputPath, output);
    console.log(`\n  Analytics exported to: ${outputPath}\n`);
  } else {
    console.log(output);
  }
}

/**
 * Clean up old analytics data
 */
export async function cleanupAnalytics(): Promise<void> {
  const analytics = getAnalytics();
  const removed = analytics.cleanup();
  console.log(`\n  Cleaned up ${removed} old analytics file(s).\n`);
}

/**
 * Main analytics command handler
 */
export async function handleAnalyticsCommand(args: string[]): Promise<void> {
  const [subcommand, ...rest] = args;

  // Parse common options
  const period = (rest.find(a => a.startsWith('--period='))?.split('=')[1] || 'month') as DashboardOptions['period'];
  const format = (rest.find(a => a.startsWith('--format='))?.split('=')[1] || 'table') as DashboardOptions['format'];
  const options: DashboardOptions = { period, format };

  switch (subcommand) {
    case 'dashboard':
    case undefined:
      await showDashboard(options);
      break;

    case 'templates':
      await showTemplateStats(options);
      break;

    case 'packs':
      await showPackStats(options);
      break;

    case 'errors':
      await showErrorReport(options);
      break;

    case 'activity':
      await showActivityChart(options);
      break;

    case 'export':
      const exportFormat = (rest[0] === 'csv' ? 'csv' : 'json') as 'json' | 'csv';
      const outputPath = rest.find(a => a.startsWith('--output='))?.split('=')[1];
      await exportAnalytics(exportFormat, outputPath);
      break;

    case 'cleanup':
      await cleanupAnalytics();
      break;

    default:
      console.log(`
╭─────────────────────────────────────────────────────────────────╮
│                    ANALYTICS COMMANDS                           │
╰─────────────────────────────────────────────────────────────────╯

  blueprint analytics                 Show analytics dashboard
  blueprint analytics dashboard       Show full dashboard
  blueprint analytics templates       Show template usage stats
  blueprint analytics packs           Show pack installation stats
  blueprint analytics errors          Show error report
  blueprint analytics activity        Show activity chart
  blueprint analytics export [format] Export analytics data
  blueprint analytics cleanup         Remove old analytics data

Options:
  --period=<period>   Time period (day, week, month, quarter, year, all)
  --format=<format>   Output format (table, json, csv)
  --output=<path>     Output file path for export

Examples:
  blueprint analytics --period=week
  blueprint analytics templates --period=month
  blueprint analytics export json --output=./analytics.json
`);
  }
}
