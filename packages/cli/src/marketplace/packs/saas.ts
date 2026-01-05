/**
 * SaaS Template Pack
 * Templates for Software-as-a-Service products
 */

import type { CustomTemplate } from '../../enterprise/templates/types.js';

export const SAAS_TEMPLATES: CustomTemplate[] = [
  {
    meta: {
      id: 'saas-prd',
      name: 'SaaS Product Requirements',
      description: 'PRD template for SaaS products with subscription and multi-tenancy',
      version: '1.0.0',
      category: 'product',
      scope: 'comprehensive',
      author: 'Intent Solutions',
      tags: ['saas', 'prd', 'subscription', 'b2b'],
    },
    variables: [
      { name: 'productName', label: 'Product Name', type: 'string', required: true },
      { name: 'productDescription', label: 'Description', type: 'text', required: true },
      { name: 'targetMarket', label: 'Target Market', type: 'select', options: [
        { label: 'SMB (Small-Medium Business)', value: 'smb' },
        { label: 'Mid-Market', value: 'midmarket' },
        { label: 'Enterprise', value: 'enterprise' },
        { label: 'PLG (Product-Led Growth)', value: 'plg' },
      ]},
      { name: 'pricingModel', label: 'Pricing Model', type: 'select', options: [
        { label: 'Per Seat', value: 'seat' },
        { label: 'Usage-Based', value: 'usage' },
        { label: 'Flat Rate', value: 'flat' },
        { label: 'Tiered', value: 'tiered' },
        { label: 'Freemium', value: 'freemium' },
      ]},
      { name: 'features', label: 'Key Features', type: 'multiselect', options: [
        { label: 'Multi-tenancy', value: 'multitenancy' },
        { label: 'Team Collaboration', value: 'teams' },
        { label: 'API Access', value: 'api' },
        { label: 'Integrations', value: 'integrations' },
        { label: 'White-labeling', value: 'whitelabel' },
        { label: 'Single Sign-On (SSO)', value: 'sso' },
        { label: 'Analytics Dashboard', value: 'analytics' },
        { label: 'Webhooks', value: 'webhooks' },
      ]},
      { name: 'compliance', label: 'Compliance Requirements', type: 'multiselect', options: [
        { label: 'SOC 2', value: 'soc2' },
        { label: 'GDPR', value: 'gdpr' },
        { label: 'HIPAA', value: 'hipaa' },
        { label: 'ISO 27001', value: 'iso27001' },
      ]},
    ],
    sections: [
      {
        id: 'overview',
        title: 'Product Overview',
        order: 1,
        content: `# {{productName}}

## Overview
{{productDescription}}

### Target Market
**Primary:** {{targetMarket}}

### Business Model
**Pricing:** {{pricingModel}}

### Key Metrics
| Metric | Definition | Target |
|--------|------------|--------|
| MRR | Monthly Recurring Revenue | |
| ARR | Annual Recurring Revenue | |
| CAC | Customer Acquisition Cost | |
| LTV | Customer Lifetime Value | |
| Churn | Monthly customer churn rate | < 5% |
| NRR | Net Revenue Retention | > 100% |`,
      },
      {
        id: 'pricing',
        title: 'Pricing Strategy',
        order: 2,
        content: `## Pricing Tiers

### Tier Structure
| Tier | Target | Price | Features |
|------|--------|-------|----------|
| Free/Trial | Evaluation | $0 | Limited features, 14-day trial |
| Starter | {{#if (equals targetMarket "smb")}}Small teams{{else}}Individual users{{/if}} | $X/mo | Core features |
| Professional | Growing teams | $Y/mo | Advanced features |
| Enterprise | Large organizations | Custom | All features + dedicated support |

{{#if (equals pricingModel "seat")}}
### Per-Seat Pricing
- Starter: Up to 5 seats
- Professional: Up to 50 seats
- Enterprise: Unlimited seats
{{/if}}

{{#if (equals pricingModel "usage")}}
### Usage-Based Pricing
| Resource | Free Tier | Starter | Professional | Enterprise |
|----------|-----------|---------|--------------|------------|
| API Calls | 1,000/mo | 10,000/mo | 100,000/mo | Unlimited |
| Storage | 1 GB | 10 GB | 100 GB | Unlimited |
| Users | 3 | 10 | 50 | Unlimited |
{{/if}}

### Add-ons
- Priority support
- Custom integrations
- Dedicated infrastructure
- SLA guarantee`,
      },
      {
        id: 'multitenancy',
        title: 'Multi-tenancy Architecture',
        order: 3,
        condition: { variable: 'features', operator: 'contains', value: 'multitenancy' },
        content: `## Multi-tenancy Design

### Isolation Model
- **Database:** Shared database, separate schemas
- **Application:** Shared application, tenant context
- **Infrastructure:** Shared clusters, namespace isolation

### Tenant Hierarchy
\`\`\`
Organization (Billing Entity)
├── Workspaces (Logical Separation)
│   ├── Teams
│   │   └── Members
│   └── Projects
└── Settings (Org-wide)
\`\`\`

### Data Isolation
- Row-level security (RLS)
- Tenant ID in all queries
- Cross-tenant access prevention
- Audit logging per tenant

### Customization
- Custom domains
- Branding/theming
- Feature flags per tenant
- Custom workflows`,
      },
      {
        id: 'teams',
        title: 'Team Features',
        order: 4,
        condition: { variable: 'features', operator: 'contains', value: 'teams' },
        content: `## Team Collaboration

### Role-Based Access Control
| Role | Permissions |
|------|-------------|
| Owner | Full access, billing, delete org |
| Admin | Manage users, settings, integrations |
| Manager | Manage team members, projects |
| Member | Standard access |
| Viewer | Read-only access |
| Guest | Limited, invited access |

### Team Features
- Invite by email/link
- Role assignment
- Team-based permissions
- Activity feed
- @mentions
- Comments/discussions

### Workspace Management
- Create/archive workspaces
- Move resources between workspaces
- Workspace-level settings
- Access inheritance`,
      },
      {
        id: 'sso',
        title: 'Single Sign-On',
        order: 5,
        condition: { variable: 'features', operator: 'contains', value: 'sso' },
        content: `## SSO Integration

### Supported Providers
- SAML 2.0 (Okta, OneLogin, Azure AD)
- OIDC (Google, Auth0)
- LDAP/Active Directory

### SSO Features
- Just-in-time (JIT) provisioning
- SCIM directory sync
- Domain-based auto-enrollment
- SSO enforcement (disable password)

### Implementation
\`\`\`typescript
// SSO Configuration
{
  provider: 'saml',
  entityId: 'https://app.example.com/saml',
  ssoUrl: 'https://idp.customer.com/sso',
  certificate: '...',
  attributeMapping: {
    email: 'user.email',
    firstName: 'user.firstName',
    lastName: 'user.lastName',
  }
}
\`\`\``,
      },
      {
        id: 'api',
        title: 'API Platform',
        order: 6,
        condition: { variable: 'features', operator: 'contains', value: 'api' },
        content: `## API Platform

### REST API
- OpenAPI 3.0 specification
- Versioned endpoints (v1, v2)
- JSON:API format
- Pagination, filtering, sorting

### Authentication
- API keys (per user/service)
- OAuth 2.0 access tokens
- JWT for stateless auth
- Rate limiting per key

### Rate Limits
| Tier | Requests/min | Burst |
|------|--------------|-------|
| Free | 60 | 10 |
| Starter | 300 | 50 |
| Professional | 1,000 | 100 |
| Enterprise | Custom | Custom |

### SDK Support
- JavaScript/TypeScript
- Python
- Ruby
- Go
- PHP`,
      },
      {
        id: 'compliance',
        title: 'Compliance',
        order: 7,
        content: `## Compliance Requirements

{{#each compliance}}
{{#if (equals this "soc2")}}
### SOC 2 Type II
- Annual audit
- Trust services criteria
- Continuous monitoring
{{/if}}
{{#if (equals this "gdpr")}}
### GDPR
- Data Processing Agreement (DPA)
- Right to access/deletion
- Data portability
- Privacy by design
{{/if}}
{{#if (equals this "hipaa")}}
### HIPAA
- Business Associate Agreement (BAA)
- PHI encryption
- Access controls
- Audit logging
{{/if}}
{{#if (equals this "iso27001")}}
### ISO 27001
- Information security management
- Risk assessment
- Control implementation
{{/if}}
{{/each}}

### Security Certifications
- [ ] SOC 2 Type II report
- [ ] Penetration test (annual)
- [ ] Vulnerability scanning (continuous)
- [ ] Security questionnaire ready`,
      },
    ],
  },
  {
    meta: {
      id: 'saas-architecture',
      name: 'SaaS Technical Architecture',
      description: 'Technical architecture for scalable SaaS applications',
      version: '1.0.0',
      category: 'technical',
      scope: 'comprehensive',
      author: 'Intent Solutions',
      tags: ['saas', 'architecture', 'scalability'],
    },
    variables: [
      { name: 'systemName', label: 'System Name', type: 'string', required: true },
      { name: 'scale', label: 'Expected Scale', type: 'select', options: [
        { label: 'Startup (< 1K users)', value: 'startup' },
        { label: 'Growth (1K-100K users)', value: 'growth' },
        { label: 'Scale (100K+ users)', value: 'scale' },
      ]},
      { name: 'cloudProvider', label: 'Cloud Provider', type: 'select', options: [
        { label: 'AWS', value: 'aws' },
        { label: 'Google Cloud', value: 'gcp' },
        { label: 'Azure', value: 'azure' },
      ]},
    ],
    sections: [
      {
        id: 'overview',
        title: 'Architecture Overview',
        order: 1,
        content: `# {{systemName}} Architecture

**Scale:** {{scale}}
**Cloud:** {{cloudProvider}}

## Architecture Principles
1. **Multi-tenancy by design** - Tenant isolation at every layer
2. **Horizontal scalability** - Scale out, not up
3. **Event-driven** - Async processing for resilience
4. **API-first** - All functionality via APIs
5. **Observable** - Metrics, logs, traces everywhere`,
      },
      {
        id: 'infrastructure',
        title: 'Infrastructure',
        order: 2,
        content: `## Infrastructure Architecture

### Compute
{{#if (equals cloudProvider "aws")}}
- EKS for container orchestration
- Fargate for serverless containers
- Lambda for event processing
{{/if}}
{{#if (equals cloudProvider "gcp")}}
- GKE for container orchestration
- Cloud Run for serverless
- Cloud Functions for events
{{/if}}
{{#if (equals cloudProvider "azure")}}
- AKS for container orchestration
- Container Apps for serverless
- Azure Functions for events
{{/if}}

### Database
- Primary: PostgreSQL (RDS/Cloud SQL/Azure DB)
- Cache: Redis (ElastiCache/Memorystore/Azure Cache)
- Search: Elasticsearch/OpenSearch
- Queue: SQS/Pub-Sub/Service Bus

### Storage
- Object storage for files
- CDN for static assets
- Encrypted at rest`,
      },
      {
        id: 'data',
        title: 'Data Architecture',
        order: 3,
        content: `## Data Architecture

### Multi-tenant Data Model
\`\`\`sql
-- Every table includes tenant_id
CREATE TABLE resources (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  -- other columns
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
CREATE POLICY tenant_isolation ON resources
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
\`\`\`

### Data Partitioning Strategy
| Scale | Strategy |
|-------|----------|
| Startup | Shared database, shared schema |
| Growth | Shared database, schema per tenant |
| Scale | Database per tenant (large accounts) |

### Caching Strategy
- Application cache (Redis)
- Query cache (database level)
- CDN cache (static assets)
- API response cache`,
      },
      {
        id: 'scalability',
        title: 'Scalability',
        order: 4,
        content: `## Scalability Design

### Horizontal Scaling
- Stateless application servers
- Load balancer distribution
- Auto-scaling policies
- Queue-based load leveling

### Performance Targets
| Metric | Target |
|--------|--------|
| API response time (p50) | < 100ms |
| API response time (p99) | < 500ms |
| Availability | 99.9% |
| Time to recovery | < 15 min |

### Capacity Planning
- Monitor resource utilization
- Scale triggers at 70% utilization
- Pre-scale for known events
- Chaos engineering for validation`,
      },
    ],
  },
  {
    meta: {
      id: 'saas-onboarding',
      name: 'SaaS Onboarding Flow',
      description: 'User onboarding and activation flow specification',
      version: '1.0.0',
      category: 'product',
      scope: 'standard',
      author: 'Intent Solutions',
      tags: ['saas', 'onboarding', 'activation', 'ux'],
    },
    variables: [
      { name: 'productName', label: 'Product Name', type: 'string', required: true },
      { name: 'activationMetric', label: 'Activation Metric', type: 'string', required: true },
    ],
    sections: [
      {
        id: 'overview',
        title: 'Onboarding Overview',
        order: 1,
        content: `# {{productName}} Onboarding

## Activation Definition
A user is considered "activated" when they: **{{activationMetric}}**

## Onboarding Goals
1. Guide users to activation as quickly as possible
2. Demonstrate core value proposition
3. Collect necessary information progressively
4. Reduce friction and drop-off`,
      },
      {
        id: 'flow',
        title: 'Onboarding Flow',
        order: 2,
        content: `## Onboarding Steps

### Step 1: Sign Up
- Email + password OR social auth
- Minimal fields (just email initially)
- Email verification (non-blocking)

### Step 2: Welcome & Context
- Welcome message
- Quick survey (optional): role, company size, use case
- Personalize experience based on answers

### Step 3: Initial Setup
- Create first workspace/project
- Invite team members (optional, defer if solo)
- Connect integrations (optional)

### Step 4: Quick Win
- Guided tutorial to core action
- Pre-populated sample data
- Celebrate completion

### Step 5: Ongoing Education
- Contextual tooltips
- Feature announcements
- Weekly tips email`,
      },
      {
        id: 'metrics',
        title: 'Onboarding Metrics',
        order: 3,
        content: `## Key Metrics

### Funnel Metrics
| Stage | Definition | Target |
|-------|------------|--------|
| Signup | Created account | 100% |
| Verified | Email verified | > 80% |
| Setup | Completed setup | > 60% |
| Activated | {{activationMetric}} | > 40% |
| Retained | Active after 7 days | > 30% |

### Time Metrics
- Time to signup: < 2 minutes
- Time to first value: < 10 minutes
- Time to activation: < 24 hours

### Quality Metrics
- Onboarding completion rate
- Support tickets during onboarding
- NPS at end of onboarding`,
      },
    ],
  },
];

export default SAAS_TEMPLATES;
