/**
 * Analytics Module
 * Usage metrics collection and reporting
 */

export * from './types.js';
export * from './collector.js';
export * from './dashboard.js';

import { AnalyticsCollector, createAnalyticsCollector } from './collector.js';
import { AnalyticsDashboard, createAnalyticsDashboard } from './dashboard.js';
import type { AnalyticsConfig, DashboardOptions, DashboardData } from './types.js';

/**
 * Analytics facade
 */
export class Analytics {
  private collector: AnalyticsCollector;
  private dashboard: AnalyticsDashboard;

  constructor(config?: Partial<AnalyticsConfig>) {
    this.collector = createAnalyticsCollector(config);
    this.dashboard = createAnalyticsDashboard(this.collector);
  }

  /**
   * Get the collector for tracking events
   */
  getCollector(): AnalyticsCollector {
    return this.collector;
  }

  /**
   * Get the dashboard for viewing reports
   */
  getDashboard(): AnalyticsDashboard {
    return this.dashboard;
  }

  /**
   * Track a template generation
   */
  trackGeneration(templateId: string, variables: string[], format: string, duration: number): void {
    this.collector.trackTemplateGenerated(templateId, variables, format, duration);
  }

  /**
   * Track a pack installation
   */
  trackInstall(packId: string, version: string): void {
    this.collector.trackPackInstalled(packId, version);
  }

  /**
   * Track an export
   */
  trackExport(destination: string, format: string, success: boolean): void {
    this.collector.trackExportCompleted(destination, format, success);
  }

  /**
   * Track an error
   */
  trackError(type: string, message: string, context?: Record<string, unknown>): void {
    this.collector.trackError(type, message, context);
  }

  /**
   * Render the analytics dashboard
   */
  async renderDashboard(options?: DashboardOptions): Promise<string> {
    return this.dashboard.render(options);
  }

  /**
   * Get dashboard data
   */
  async getDashboardData(options?: DashboardOptions): Promise<DashboardData> {
    return this.dashboard.getData(options);
  }

  /**
   * Flush analytics data to storage
   */
  flush(): void {
    this.collector.flush();
  }

  /**
   * End the session and save data
   */
  endSession(): void {
    this.collector.endSession();
  }

  /**
   * Clean up old analytics data
   */
  cleanup(): number {
    return this.collector.cleanup();
  }
}

/**
 * Create an analytics instance
 */
export function createAnalytics(config?: Partial<AnalyticsConfig>): Analytics {
  return new Analytics(config);
}

/**
 * Singleton instance for global access
 */
let globalAnalytics: Analytics | null = null;

/**
 * Get or create the global analytics instance
 */
export function getAnalytics(config?: Partial<AnalyticsConfig>): Analytics {
  if (!globalAnalytics) {
    globalAnalytics = createAnalytics(config);
  }
  return globalAnalytics;
}

/**
 * Reset the global analytics instance
 */
export function resetAnalytics(): void {
  if (globalAnalytics) {
    globalAnalytics.flush();
    globalAnalytics = null;
  }
}
