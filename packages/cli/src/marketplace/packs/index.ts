/**
 * Built-in Template Packs
 * Export all official template packs
 */

// Vertical-specific packs
export { FINTECH_TEMPLATES } from './fintech.js';
export { HEALTHTECH_TEMPLATES } from './healthtech.js';
export { SAAS_TEMPLATES } from './saas.js';

// Compliance packs
export { SOC2_TEMPLATES } from './soc2.js';
export { HIPAA_TEMPLATES } from './hipaa.js';
export { GDPR_TEMPLATES } from './gdpr.js';

// Framework packs
export { NEXTJS_TEMPLATES } from './nextjs.js';
export { FASTAPI_TEMPLATES } from './fastapi.js';
export { RAILS_TEMPLATES } from './rails.js';

import { FINTECH_TEMPLATES } from './fintech.js';
import { HEALTHTECH_TEMPLATES } from './healthtech.js';
import { SAAS_TEMPLATES } from './saas.js';
import { SOC2_TEMPLATES } from './soc2.js';
import { HIPAA_TEMPLATES } from './hipaa.js';
import { GDPR_TEMPLATES } from './gdpr.js';
import { NEXTJS_TEMPLATES } from './nextjs.js';
import { FASTAPI_TEMPLATES } from './fastapi.js';
import { RAILS_TEMPLATES } from './rails.js';
import type { CustomTemplate } from '../../enterprise/templates/types.js';

/**
 * All built-in templates grouped by category
 */
export const BUILTIN_TEMPLATE_PACKS = {
  // Verticals
  fintech: FINTECH_TEMPLATES,
  healthtech: HEALTHTECH_TEMPLATES,
  saas: SAAS_TEMPLATES,
  // Compliance
  soc2: SOC2_TEMPLATES,
  hipaa: HIPAA_TEMPLATES,
  gdpr: GDPR_TEMPLATES,
  // Frameworks
  nextjs: NEXTJS_TEMPLATES,
  fastapi: FASTAPI_TEMPLATES,
  rails: RAILS_TEMPLATES,
};

/**
 * All built-in templates as a flat array
 */
export const BUILTIN_TEMPLATES: CustomTemplate[] = [
  // Verticals
  ...FINTECH_TEMPLATES,
  ...HEALTHTECH_TEMPLATES,
  ...SAAS_TEMPLATES,
  // Compliance
  ...SOC2_TEMPLATES,
  ...HIPAA_TEMPLATES,
  ...GDPR_TEMPLATES,
  // Frameworks
  ...NEXTJS_TEMPLATES,
  ...FASTAPI_TEMPLATES,
  ...RAILS_TEMPLATES,
];

/**
 * Pack metadata for registry
 */
export const PACK_METADATA = {
  // Verticals
  'blueprint-fintech': {
    name: 'FinTech Blueprint',
    description: 'Templates for financial technology products with regulatory compliance',
    category: 'vertical',
    templates: FINTECH_TEMPLATES.map(t => t.meta.id),
    tags: ['fintech', 'payments', 'banking', 'compliance'],
  },
  'blueprint-healthtech': {
    name: 'HealthTech Blueprint',
    description: 'Templates for healthcare technology with HIPAA considerations',
    category: 'vertical',
    templates: HEALTHTECH_TEMPLATES.map(t => t.meta.id),
    tags: ['healthtech', 'healthcare', 'hipaa', 'fhir'],
  },
  'blueprint-saas': {
    name: 'SaaS Blueprint',
    description: 'Templates for SaaS products with multi-tenancy and subscription models',
    category: 'vertical',
    templates: SAAS_TEMPLATES.map(t => t.meta.id),
    tags: ['saas', 'b2b', 'subscription', 'multitenancy'],
  },
  // Compliance
  'blueprint-soc2': {
    name: 'SOC 2 Compliance',
    description: 'Templates for SOC 2 Type I and II compliance documentation',
    category: 'compliance',
    templates: SOC2_TEMPLATES.map(t => t.meta.id),
    tags: ['soc2', 'compliance', 'security', 'audit'],
  },
  'blueprint-hipaa': {
    name: 'HIPAA Compliance',
    description: 'Templates for HIPAA compliance and healthcare security',
    category: 'compliance',
    templates: HIPAA_TEMPLATES.map(t => t.meta.id),
    tags: ['hipaa', 'healthcare', 'phi', 'compliance'],
  },
  'blueprint-gdpr': {
    name: 'GDPR Compliance',
    description: 'Templates for GDPR compliance and data protection',
    category: 'compliance',
    templates: GDPR_TEMPLATES.map(t => t.meta.id),
    tags: ['gdpr', 'privacy', 'eu', 'data-protection'],
  },
  // Frameworks
  'blueprint-nextjs': {
    name: 'Next.js Blueprint',
    description: 'Templates optimized for Next.js applications with App Router',
    category: 'framework',
    templates: NEXTJS_TEMPLATES.map(t => t.meta.id),
    tags: ['nextjs', 'react', 'typescript', 'frontend'],
  },
  'blueprint-fastapi': {
    name: 'FastAPI Blueprint',
    description: 'Templates optimized for FastAPI/Python API applications',
    category: 'framework',
    templates: FASTAPI_TEMPLATES.map(t => t.meta.id),
    tags: ['fastapi', 'python', 'api', 'async'],
  },
  'blueprint-rails': {
    name: 'Rails Blueprint',
    description: 'Templates optimized for Ruby on Rails applications',
    category: 'framework',
    templates: RAILS_TEMPLATES.map(t => t.meta.id),
    tags: ['rails', 'ruby', 'hotwire', 'api'],
  },
};

/**
 * Get templates by pack ID
 */
export function getPackTemplates(packId: string): CustomTemplate[] {
  switch (packId) {
    // Verticals
    case 'blueprint-fintech':
      return FINTECH_TEMPLATES;
    case 'blueprint-healthtech':
      return HEALTHTECH_TEMPLATES;
    case 'blueprint-saas':
      return SAAS_TEMPLATES;
    // Compliance
    case 'blueprint-soc2':
      return SOC2_TEMPLATES;
    case 'blueprint-hipaa':
      return HIPAA_TEMPLATES;
    case 'blueprint-gdpr':
      return GDPR_TEMPLATES;
    // Frameworks
    case 'blueprint-nextjs':
      return NEXTJS_TEMPLATES;
    case 'blueprint-fastapi':
      return FASTAPI_TEMPLATES;
    case 'blueprint-rails':
      return RAILS_TEMPLATES;
    default:
      return [];
  }
}

/**
 * Get all available pack IDs
 */
export function getAvailablePackIds(): string[] {
  return Object.keys(PACK_METADATA);
}

/**
 * Get pack metadata by ID
 */
export function getPackMetadata(packId: string) {
  return PACK_METADATA[packId as keyof typeof PACK_METADATA];
}

/**
 * Get packs by category
 */
export function getPacksByCategory(category: 'vertical' | 'compliance' | 'framework') {
  return Object.entries(PACK_METADATA)
    .filter(([_, meta]) => meta.category === category)
    .map(([id, meta]) => ({ id, ...meta }));
}

/**
 * Search templates by tag
 */
export function searchTemplatesByTag(tag: string): CustomTemplate[] {
  return BUILTIN_TEMPLATES.filter(t => t.meta.tags?.includes(tag));
}

/**
 * Get template by ID
 */
export function getTemplateById(templateId: string): CustomTemplate | undefined {
  return BUILTIN_TEMPLATES.find(t => t.meta.id === templateId);
}

/**
 * Get total template count
 */
export function getTemplateCount(): number {
  return BUILTIN_TEMPLATES.length;
}

/**
 * Get pack count
 */
export function getPackCount(): number {
  return Object.keys(PACK_METADATA).length;
}
