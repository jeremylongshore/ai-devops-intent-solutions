/**
 * FinTech Template Pack
 * Templates for financial technology products
 */

import type { CustomTemplate } from '../../enterprise/templates/types.js';

export const FINTECH_TEMPLATES: CustomTemplate[] = [
  {
    meta: {
      id: 'fintech-prd',
      name: 'FinTech Product Requirements',
      description: 'PRD template for financial technology products with regulatory considerations',
      version: '1.0.0',
      category: 'product',
      scope: 'comprehensive',
      author: 'Intent Solutions',
      audience: 'enterprise',
      tags: ['fintech', 'prd', 'requirements', 'compliance'],
    },
    variables: [
      { name: 'productName', label: 'Product Name', type: 'string', required: true },
      { name: 'productType', label: 'Product Type', type: 'select', required: true, options: [
        { label: 'Payment Processing', value: 'payments' },
        { label: 'Lending Platform', value: 'lending' },
        { label: 'Investment Platform', value: 'investment' },
        { label: 'Banking Services', value: 'banking' },
        { label: 'Insurance Tech', value: 'insurtech' },
        { label: 'Cryptocurrency/DeFi', value: 'crypto' },
      ]},
      { name: 'targetMarket', label: 'Target Market', type: 'select', options: [
        { label: 'B2B (Business)', value: 'b2b' },
        { label: 'B2C (Consumer)', value: 'b2c' },
        { label: 'B2B2C (Platform)', value: 'b2b2c' },
      ]},
      { name: 'regions', label: 'Operating Regions', type: 'multiselect', options: [
        { label: 'United States', value: 'us' },
        { label: 'European Union', value: 'eu' },
        { label: 'United Kingdom', value: 'uk' },
        { label: 'Asia Pacific', value: 'apac' },
        { label: 'Latin America', value: 'latam' },
      ]},
      { name: 'handlesPII', label: 'Handles Personal Data', type: 'boolean', default: true },
      { name: 'handlesPayments', label: 'Processes Payments', type: 'boolean', default: false },
      { name: 'requiresKYC', label: 'Requires KYC/AML', type: 'boolean', default: false },
    ],
    sections: [
      {
        id: 'overview',
        title: 'Product Overview',
        order: 1,
        content: `## {{productName}}

**Product Type:** {{productType}}
**Target Market:** {{targetMarket}}

### Executive Summary
[Describe the product vision, target users, and key value proposition]

### Business Objectives
- Primary business goal
- Revenue model
- Key success metrics
- Timeline to market`,
      },
      {
        id: 'regulatory',
        title: 'Regulatory Compliance',
        order: 2,
        content: `## Regulatory Requirements

### Applicable Regulations
{{#each regions}}
#### {{this}} Regulations
- List applicable financial regulations
- Licensing requirements
- Reporting obligations
{{/each}}

{{#if handlesPayments}}
### Payment Processing Compliance
- PCI-DSS Level: [Specify level]
- Payment processor partnerships
- Settlement requirements
- Chargeback handling
{{/if}}

{{#if requiresKYC}}
### KYC/AML Requirements
- Customer identification program (CIP)
- Know Your Customer (KYC) procedures
- Anti-Money Laundering (AML) monitoring
- Suspicious Activity Reporting (SAR)
- OFAC sanctions screening
{{/if}}

### Data Privacy
{{#if handlesPII}}
- GDPR compliance (if EU)
- CCPA compliance (if US/CA)
- Data retention policies
- Right to deletion procedures
{{/if}}`,
      },
      {
        id: 'security',
        title: 'Security Requirements',
        order: 3,
        content: `## Security Architecture

### Authentication & Authorization
- Multi-factor authentication (MFA)
- Session management
- Role-based access control (RBAC)
- API authentication (OAuth 2.0)

### Data Security
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Key management strategy
- Data masking for PII

### Infrastructure Security
- Network segmentation
- WAF configuration
- DDoS protection
- Intrusion detection

### Audit & Monitoring
- Audit logging requirements
- Real-time alerting
- Compliance monitoring
- Penetration testing schedule`,
      },
      {
        id: 'features',
        title: 'Feature Requirements',
        order: 4,
        content: `## Core Features

### User Management
- [ ] User registration with identity verification
- [ ] Account management
- [ ] Profile settings
- [ ] Notification preferences

{{#if handlesPayments}}
### Payment Features
- [ ] Payment initiation
- [ ] Transaction history
- [ ] Receipt generation
- [ ] Refund processing
- [ ] Recurring payments
{{/if}}

### Reporting & Analytics
- [ ] Transaction reports
- [ ] Compliance reports
- [ ] User activity dashboard
- [ ] Export functionality`,
      },
      {
        id: 'integration',
        title: 'Integrations',
        order: 5,
        content: `## Third-Party Integrations

### Required Integrations
| Partner | Purpose | Priority |
|---------|---------|----------|
| Identity Provider | KYC verification | P0 |
| Payment Processor | Transaction processing | P0 |
| Banking Partner | Account services | P1 |
| Fraud Detection | Risk management | P1 |
| Analytics | Business intelligence | P2 |

### API Requirements
- REST API versioning strategy
- Webhook support for events
- Rate limiting policies
- SDK requirements`,
      },
      {
        id: 'risk',
        title: 'Risk Assessment',
        order: 6,
        content: `## Risk Management

### Operational Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Regulatory changes | High | Medium | Compliance monitoring |
| Security breach | Critical | Low | Security controls |
| Vendor dependency | Medium | Medium | Multi-vendor strategy |
| Fraud | High | Medium | Fraud detection system |

### Compliance Risks
- Licensing delays
- Regulatory audits
- Cross-border requirements

### Technical Risks
- System availability (99.99% SLA)
- Data integrity
- Scalability challenges`,
      },
    ],
  },
  {
    meta: {
      id: 'fintech-security',
      name: 'FinTech Security Architecture',
      description: 'Security architecture document for financial applications',
      version: '1.0.0',
      category: 'technical',
      scope: 'comprehensive',
      author: 'Intent Solutions',
      audience: 'enterprise',
      tags: ['fintech', 'security', 'architecture'],
    },
    variables: [
      { name: 'systemName', label: 'System Name', type: 'string', required: true },
      { name: 'securityLevel', label: 'Security Classification', type: 'select', options: [
        { label: 'Standard', value: 'standard' },
        { label: 'High', value: 'high' },
        { label: 'Critical', value: 'critical' },
      ]},
    ],
    sections: [
      {
        id: 'overview',
        title: 'Security Overview',
        order: 1,
        content: `## {{systemName}} Security Architecture

**Security Classification:** {{securityLevel}}

### Security Principles
1. Defense in depth
2. Least privilege access
3. Zero trust architecture
4. Fail secure defaults
5. Security by design`,
      },
      {
        id: 'identity',
        title: 'Identity & Access Management',
        order: 2,
        content: `## IAM Architecture

### Authentication
- Primary: OAuth 2.0 + OpenID Connect
- MFA: TOTP/WebAuthn/SMS
- Session: JWT with refresh tokens
- Biometric: Device-based (mobile)

### Authorization
- RBAC with hierarchical roles
- Attribute-based access control (ABAC)
- API scopes and permissions
- Resource-level permissions`,
      },
      {
        id: 'encryption',
        title: 'Cryptography',
        order: 3,
        content: `## Cryptographic Standards

### Data at Rest
- Algorithm: AES-256-GCM
- Key derivation: PBKDF2/Argon2
- Key storage: HSM/KMS

### Data in Transit
- Protocol: TLS 1.3
- Certificate: RSA-2048 or ECDSA P-256
- Perfect forward secrecy: Required

### Key Management
- Rotation schedule: 90 days
- Key escrow: Dual control
- Backup: Encrypted, geographically distributed`,
      },
    ],
  },
  {
    meta: {
      id: 'payment-integration',
      name: 'Payment Integration Spec',
      description: 'Technical specification for payment processor integration',
      version: '1.0.0',
      category: 'technical',
      scope: 'standard',
      author: 'Intent Solutions',
      tags: ['fintech', 'payments', 'integration', 'stripe', 'api'],
    },
    variables: [
      { name: 'projectName', label: 'Project Name', type: 'string', required: true },
      { name: 'processor', label: 'Payment Processor', type: 'select', options: [
        { label: 'Stripe', value: 'stripe' },
        { label: 'Adyen', value: 'adyen' },
        { label: 'Square', value: 'square' },
        { label: 'PayPal/Braintree', value: 'paypal' },
        { label: 'Plaid', value: 'plaid' },
      ]},
      { name: 'paymentMethods', label: 'Payment Methods', type: 'multiselect', options: [
        { label: 'Credit/Debit Cards', value: 'cards' },
        { label: 'ACH/Bank Transfer', value: 'ach' },
        { label: 'Digital Wallets', value: 'wallets' },
        { label: 'BNPL', value: 'bnpl' },
        { label: 'Cryptocurrency', value: 'crypto' },
      ]},
    ],
    sections: [
      {
        id: 'overview',
        title: 'Integration Overview',
        order: 1,
        content: `## {{projectName}} - Payment Integration

**Processor:** {{processor}}
**Payment Methods:** {{join paymentMethods ", "}}

### Scope
This document defines the technical integration with {{processor}} for processing payments.`,
      },
      {
        id: 'flow',
        title: 'Payment Flow',
        order: 2,
        content: `## Payment Flow

### Standard Payment Flow
1. Customer initiates payment
2. Create payment intent (server-side)
3. Collect payment details (client-side)
4. Confirm payment
5. Handle webhook for result
6. Update order status

### Error Handling
- Declined payments
- Insufficient funds
- Fraud detection triggers
- Network errors`,
      },
      {
        id: 'security',
        title: 'Security Requirements',
        order: 3,
        content: `## PCI-DSS Compliance

### Scope Reduction
- Use hosted payment fields
- Never log card numbers
- Tokenize for storage
- Use webhook signatures

### API Security
- Use restricted API keys
- Implement idempotency keys
- Validate webhook signatures
- Use TLS 1.2+ only`,
      },
    ],
  },
];

export default FINTECH_TEMPLATES;
