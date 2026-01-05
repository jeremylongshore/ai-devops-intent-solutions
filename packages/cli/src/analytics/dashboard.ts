/**
 * Analytics Dashboard
 * Generates usage reports and visualizations
 */

import type {
  AnalyticsEvent,
  UsageSummary,
  TemplateStats,
  PackStats,
  SessionStats,
  DashboardOptions,
  DashboardData,
} from './types.js';
import { AnalyticsCollector } from './collector.js';

/**
 * Analytics Dashboard
 */
export class AnalyticsDashboard {
  private collector: AnalyticsCollector;

  constructor(collector: AnalyticsCollector) {
    this.collector = collector;
  }

  /**
   * Get dashboard data
   */
  async getData(options: DashboardOptions = { period: 'month', format: 'table' }): Promise<DashboardData> {
    const days = this.periodToDays(options.period);
    const events = this.collector.loadEvents(days);

    return {
      summary: this.calculateSummary(events, options.period),
      templateStats: this.calculateTemplateStats(events),
      packStats: this.calculatePackStats(events),
      recentSessions: this.calculateSessionStats(events),
      errors: this.calculateErrorStats(events),
    };
  }

  /**
   * Convert period to days
   */
  private periodToDays(period: string): number {
    switch (period) {
      case 'day': return 1;
      case 'week': return 7;
      case 'month': return 30;
      case 'quarter': return 90;
      case 'year': return 365;
      case 'all': return 3650;
      default: return 30;
    }
  }

  /**
   * Calculate usage summary
   */
  private calculateSummary(events: AnalyticsEvent[], period: string): UsageSummary {
    const days = this.periodToDays(period);
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const end = new Date();

    // Count totals
    const sessions = new Set(events.map(e => e.sessionId)).size;
    const generations = events.filter(e => e.type === 'template_generated').length;
    const exports = events.filter(e => e.type === 'export_completed').length;
    const errors = events.filter(e => e.type === 'error_occurred').length;

    // Top templates
    const templateCounts = new Map<string, { id: string; name: string; count: number }>();
    for (const event of events.filter(e => e.type === 'template_generated')) {
      const id = event.data.templateId as string;
      const existing = templateCounts.get(id) || { id, name: id, count: 0 };
      existing.count++;
      templateCounts.set(id, existing);
    }
    const topTemplates = Array.from(templateCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top packs
    const packCounts = new Map<string, { id: string; name: string; count: number }>();
    for (const event of events.filter(e => e.type === 'pack_installed')) {
      const id = event.data.packId as string;
      const existing = packCounts.get(id) || { id, name: id, count: 0 };
      existing.count++;
      packCounts.set(id, existing);
    }
    const topPacks = Array.from(packCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Daily activity
    const dailyActivity = new Map<string, { date: string; generations: number; sessions: Set<string> }>();
    for (const event of events) {
      const date = event.timestamp.split('T')[0];
      const existing = dailyActivity.get(date) || { date, generations: 0, sessions: new Set() };
      if (event.type === 'template_generated') {
        existing.generations++;
      }
      existing.sessions.add(event.sessionId);
      dailyActivity.set(date, existing);
    }
    const dailyActivityArray = Array.from(dailyActivity.values())
      .map(d => ({ date: d.date, generations: d.generations, sessions: d.sessions.size }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      totals: { sessions, generations, exports, errors },
      topTemplates,
      topPacks,
      dailyActivity: dailyActivityArray,
    };
  }

  /**
   * Calculate template statistics
   */
  private calculateTemplateStats(events: AnalyticsEvent[]): TemplateStats[] {
    const templateMap = new Map<string, {
      templateId: string;
      generations: number;
      users: Set<string>;
      durations: number[];
      variables: Map<string, number>;
      formats: Map<string, number>;
      lastUsed: string;
    }>();

    for (const event of events.filter(e => e.type === 'template_generated')) {
      const id = event.data.templateId as string;
      const existing = templateMap.get(id) || {
        templateId: id,
        generations: 0,
        users: new Set<string>(),
        durations: [] as number[],
        variables: new Map<string, number>(),
        formats: new Map<string, number>(),
        lastUsed: event.timestamp,
      };

      existing.generations++;
      if (event.userId) existing.users.add(event.userId);
      if (event.data.duration) existing.durations.push(event.data.duration as number);
      if (event.data.format) {
        const format = event.data.format as string;
        existing.formats.set(format, (existing.formats.get(format) || 0) + 1);
      }
      if (event.timestamp > existing.lastUsed) {
        existing.lastUsed = event.timestamp;
      }

      templateMap.set(id, existing);
    }

    return Array.from(templateMap.values()).map(t => ({
      templateId: t.templateId,
      templateName: t.templateId, // Would be resolved from template registry
      totalGenerations: t.generations,
      uniqueUsers: t.users.size,
      avgCompletionTime: t.durations.length > 0
        ? t.durations.reduce((a, b) => a + b, 0) / t.durations.length
        : 0,
      lastUsed: t.lastUsed,
      popularVariables: Array.from(t.variables.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      commonOutputFormats: Array.from(t.formats.entries())
        .map(([format, count]) => ({ format, count }))
        .sort((a, b) => b.count - a.count),
    })).sort((a, b) => b.totalGenerations - a.totalGenerations);
  }

  /**
   * Calculate pack statistics
   */
  private calculatePackStats(events: AnalyticsEvent[]): PackStats[] {
    const packMap = new Map<string, {
      packId: string;
      installs: number;
      uninstalls: number;
      lastUpdated: string;
    }>();

    for (const event of events) {
      if (event.type === 'pack_installed' || event.type === 'pack_uninstalled') {
        const id = event.data.packId as string;
        const existing = packMap.get(id) || {
          packId: id,
          installs: 0,
          uninstalls: 0,
          lastUpdated: event.timestamp,
        };

        if (event.type === 'pack_installed') {
          existing.installs++;
        } else {
          existing.uninstalls++;
        }
        if (event.timestamp > existing.lastUpdated) {
          existing.lastUpdated = event.timestamp;
        }

        packMap.set(id, existing);
      }
    }

    return Array.from(packMap.values()).map(p => ({
      packId: p.packId,
      packName: p.packId, // Would be resolved from pack registry
      totalInstalls: p.installs,
      activeInstalls: p.installs - p.uninstalls,
      uninstalls: p.uninstalls,
      lastUpdated: p.lastUpdated,
    })).sort((a, b) => b.totalInstalls - a.totalInstalls);
  }

  /**
   * Calculate session statistics
   */
  private calculateSessionStats(events: AnalyticsEvent[]): SessionStats[] {
    const sessionMap = new Map<string, {
      sessionId: string;
      events: AnalyticsEvent[];
      startTime: string;
      endTime?: string;
    }>();

    for (const event of events) {
      const existing = sessionMap.get(event.sessionId) || {
        sessionId: event.sessionId,
        events: [],
        startTime: event.timestamp,
      };

      existing.events.push(event);
      if (event.timestamp < existing.startTime) {
        existing.startTime = event.timestamp;
      }
      if (event.type === 'session_ended') {
        existing.endTime = event.timestamp;
      }

      sessionMap.set(event.sessionId, existing);
    }

    return Array.from(sessionMap.values())
      .map(s => ({
        sessionId: s.sessionId,
        startTime: s.startTime,
        endTime: s.endTime,
        duration: s.endTime
          ? new Date(s.endTime).getTime() - new Date(s.startTime).getTime()
          : undefined,
        eventsCount: s.events.length,
        templatesGenerated: s.events.filter(e => e.type === 'template_generated').length,
        errors: s.events.filter(e => e.type === 'error_occurred').length,
      }))
      .sort((a, b) => b.startTime.localeCompare(a.startTime))
      .slice(0, 10);
  }

  /**
   * Calculate error statistics
   */
  private calculateErrorStats(events: AnalyticsEvent[]): Array<{ type: string; count: number; lastOccurred: string }> {
    const errorMap = new Map<string, { type: string; count: number; lastOccurred: string }>();

    for (const event of events.filter(e => e.type === 'error_occurred')) {
      const type = event.data.errorType as string;
      const existing = errorMap.get(type) || { type, count: 0, lastOccurred: event.timestamp };
      existing.count++;
      if (event.timestamp > existing.lastOccurred) {
        existing.lastOccurred = event.timestamp;
      }
      errorMap.set(type, existing);
    }

    return Array.from(errorMap.values()).sort((a, b) => b.count - a.count);
  }

  /**
   * Format dashboard data as table
   */
  formatAsTable(data: DashboardData): string {
    const lines: string[] = [];

    // Header
    lines.push('═══════════════════════════════════════════════════════════════════');
    lines.push('                     INTENT BLUEPRINT ANALYTICS                     ');
    lines.push('═══════════════════════════════════════════════════════════════════');
    lines.push('');

    // Summary
    lines.push('USAGE SUMMARY');
    lines.push('─────────────────────────────────────────────────────────────────────');
    lines.push(`Period: ${data.summary.period.start.split('T')[0]} to ${data.summary.period.end.split('T')[0]}`);
    lines.push('');
    lines.push(`  Sessions:    ${data.summary.totals.sessions.toString().padStart(8)}`);
    lines.push(`  Generations: ${data.summary.totals.generations.toString().padStart(8)}`);
    lines.push(`  Exports:     ${data.summary.totals.exports.toString().padStart(8)}`);
    lines.push(`  Errors:      ${data.summary.totals.errors.toString().padStart(8)}`);
    lines.push('');

    // Top Templates
    if (data.summary.topTemplates.length > 0) {
      lines.push('TOP TEMPLATES');
      lines.push('─────────────────────────────────────────────────────────────────────');
      for (const t of data.summary.topTemplates) {
        lines.push(`  ${t.name.padEnd(40)} ${t.count.toString().padStart(5)} uses`);
      }
      lines.push('');
    }

    // Top Packs
    if (data.summary.topPacks.length > 0) {
      lines.push('TOP PACKS');
      lines.push('─────────────────────────────────────────────────────────────────────');
      for (const p of data.summary.topPacks) {
        lines.push(`  ${p.name.padEnd(40)} ${p.count.toString().padStart(5)} installs`);
      }
      lines.push('');
    }

    // Recent Sessions
    if (data.recentSessions.length > 0) {
      lines.push('RECENT SESSIONS');
      lines.push('─────────────────────────────────────────────────────────────────────');
      for (const s of data.recentSessions.slice(0, 5)) {
        const duration = s.duration ? `${Math.round(s.duration / 1000 / 60)}m` : 'active';
        lines.push(`  ${s.startTime.split('T')[0]} ${duration.padStart(8)} │ ${s.templatesGenerated} templates, ${s.errors} errors`);
      }
      lines.push('');
    }

    // Errors
    if (data.errors && data.errors.length > 0) {
      lines.push('ERROR SUMMARY');
      lines.push('─────────────────────────────────────────────────────────────────────');
      for (const e of data.errors.slice(0, 5)) {
        lines.push(`  ${e.type.padEnd(30)} ${e.count.toString().padStart(5)}x │ Last: ${e.lastOccurred.split('T')[0]}`);
      }
      lines.push('');
    }

    lines.push('═══════════════════════════════════════════════════════════════════');

    return lines.join('\n');
  }

  /**
   * Format dashboard data as JSON
   */
  formatAsJson(data: DashboardData): string {
    return JSON.stringify(data, null, 2);
  }

  /**
   * Format dashboard data as CSV
   */
  formatAsCsv(data: DashboardData): string {
    const lines: string[] = [];

    // Summary section
    lines.push('Section,Metric,Value');
    lines.push(`Summary,Sessions,${data.summary.totals.sessions}`);
    lines.push(`Summary,Generations,${data.summary.totals.generations}`);
    lines.push(`Summary,Exports,${data.summary.totals.exports}`);
    lines.push(`Summary,Errors,${data.summary.totals.errors}`);
    lines.push('');

    // Templates section
    lines.push('Template ID,Template Name,Generations,Unique Users,Avg Time,Last Used');
    for (const t of data.templateStats) {
      lines.push(`${t.templateId},${t.templateName},${t.totalGenerations},${t.uniqueUsers},${t.avgCompletionTime.toFixed(0)},${t.lastUsed}`);
    }
    lines.push('');

    // Packs section
    lines.push('Pack ID,Pack Name,Installs,Active,Uninstalls');
    for (const p of data.packStats) {
      lines.push(`${p.packId},${p.packName},${p.totalInstalls},${p.activeInstalls},${p.uninstalls}`);
    }

    return lines.join('\n');
  }

  /**
   * Render dashboard
   */
  async render(options: DashboardOptions = { period: 'month', format: 'table' }): Promise<string> {
    const data = await this.getData(options);

    switch (options.format) {
      case 'json':
        return this.formatAsJson(data);
      case 'csv':
        return this.formatAsCsv(data);
      default:
        return this.formatAsTable(data);
    }
  }
}

/**
 * Create an analytics dashboard instance
 */
export function createAnalyticsDashboard(collector: AnalyticsCollector): AnalyticsDashboard {
  return new AnalyticsDashboard(collector);
}
