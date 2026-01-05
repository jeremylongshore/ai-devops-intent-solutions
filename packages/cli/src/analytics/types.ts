/**
 * Analytics Types
 * Type definitions for usage metrics and analytics
 */

/**
 * Event types for tracking
 */
export type EventType =
  | 'template_generated'
  | 'template_viewed'
  | 'template_customized'
  | 'pack_installed'
  | 'pack_uninstalled'
  | 'export_completed'
  | 'validation_run'
  | 'interview_started'
  | 'interview_completed'
  | 'session_started'
  | 'session_ended'
  | 'error_occurred';

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  id: string;
  type: EventType;
  timestamp: string;
  sessionId: string;
  userId?: string;
  data: Record<string, unknown>;
  metadata?: EventMetadata;
}

/**
 * Event metadata
 */
export interface EventMetadata {
  version: string;
  platform: string;
  nodeVersion: string;
  cliVersion: string;
  environment?: string;
}

/**
 * Template usage statistics
 */
export interface TemplateStats {
  templateId: string;
  templateName: string;
  totalGenerations: number;
  uniqueUsers: number;
  avgCompletionTime: number;
  lastUsed: string;
  popularVariables: Array<{
    name: string;
    count: number;
  }>;
  commonOutputFormats: Array<{
    format: string;
    count: number;
  }>;
}

/**
 * Pack usage statistics
 */
export interface PackStats {
  packId: string;
  packName: string;
  totalInstalls: number;
  activeInstalls: number;
  uninstalls: number;
  rating?: number;
  lastUpdated: string;
}

/**
 * Session statistics
 */
export interface SessionStats {
  sessionId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  eventsCount: number;
  templatesGenerated: number;
  errors: number;
}

/**
 * Usage summary
 */
export interface UsageSummary {
  period: {
    start: string;
    end: string;
  };
  totals: {
    sessions: number;
    generations: number;
    exports: number;
    errors: number;
  };
  topTemplates: Array<{
    id: string;
    name: string;
    count: number;
  }>;
  topPacks: Array<{
    id: string;
    name: string;
    count: number;
  }>;
  dailyActivity: Array<{
    date: string;
    generations: number;
    sessions: number;
  }>;
}

/**
 * Team analytics (for team features)
 */
export interface TeamAnalytics {
  teamId: string;
  period: {
    start: string;
    end: string;
  };
  members: Array<{
    userId: string;
    name: string;
    generations: number;
    lastActive: string;
  }>;
  productivity: {
    avgGenerationsPerDay: number;
    avgSessionDuration: number;
    peakHours: number[];
  };
  templates: {
    mostUsed: string[];
    recentlyAdded: string[];
    customCreated: number;
  };
}

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  enabled: boolean;
  storageDir: string;
  retentionDays: number;
  anonymize: boolean;
  trackErrors: boolean;
  trackUsage: boolean;
  excludeTemplates?: string[];
}

/**
 * Default analytics configuration
 */
export const DEFAULT_ANALYTICS_CONFIG: AnalyticsConfig = {
  enabled: true,
  storageDir: '.intent/analytics',
  retentionDays: 90,
  anonymize: true,
  trackErrors: true,
  trackUsage: true,
};

/**
 * Dashboard view options
 */
export interface DashboardOptions {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all';
  format: 'table' | 'json' | 'csv';
  detailed?: boolean;
  teamId?: string;
}

/**
 * Dashboard data
 */
export interface DashboardData {
  summary: UsageSummary;
  templateStats: TemplateStats[];
  packStats: PackStats[];
  recentSessions: SessionStats[];
  errors?: Array<{
    type: string;
    count: number;
    lastOccurred: string;
  }>;
}
