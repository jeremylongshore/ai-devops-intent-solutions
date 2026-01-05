/**
 * GDPR Compliance Template Pack
 * Templates for GDPR compliance documentation
 */

import type { CustomTemplate } from '../../enterprise/templates/types.js';

export const GDPR_TEMPLATES: CustomTemplate[] = [
  {
    meta: {
      id: 'gdpr-policies',
      name: 'GDPR Data Protection Policies',
      description: 'Comprehensive GDPR compliance policies and procedures',
      version: '1.0.0',
      category: 'compliance',
      scope: 'enterprise',
      author: 'Intent Solutions',
      tags: ['gdpr', 'privacy', 'eu', 'compliance'],
    },
    variables: [
      { name: 'companyName', label: 'Company Name', type: 'string', required: true },
      { name: 'dpoName', label: 'Data Protection Officer', type: 'string', required: true },
      { name: 'dpoEmail', label: 'DPO Email', type: 'string', required: true },
      { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
      { name: 'entityType', label: 'Entity Type', type: 'select', options: [
        { label: 'Controller', value: 'controller' },
        { label: 'Processor', value: 'processor' },
        { label: 'Joint Controller', value: 'joint' },
      ]},
      { name: 'lawfulBases', label: 'Primary Lawful Bases', type: 'multiselect', options: [
        { label: 'Consent', value: 'consent' },
        { label: 'Contract', value: 'contract' },
        { label: 'Legal Obligation', value: 'legal' },
        { label: 'Vital Interests', value: 'vital' },
        { label: 'Public Interest', value: 'public' },
        { label: 'Legitimate Interests', value: 'legitimate' },
      ]},
    ],
    sections: [
      {
        id: 'header',
        title: 'Policy Overview',
        order: 1,
        content: `# {{companyName}} Data Protection Policy

**Data Protection Officer:** {{dpoName}} ({{dpoEmail}})
**Effective Date:** {{effectiveDate}}
**Entity Type:** {{entityType}}

## Policy Statement
{{companyName}} is committed to protecting the personal data of individuals in accordance with the General Data Protection Regulation (EU) 2016/679 (GDPR).

## Scope
This policy applies to all processing of personal data by {{companyName}}, whether as a data {{entityType}}.

## GDPR Principles
All processing must adhere to:
1. **Lawfulness, fairness, transparency** - Process legally and openly
2. **Purpose limitation** - Collect for specified, explicit purposes
3. **Data minimization** - Adequate, relevant, limited to necessary
4. **Accuracy** - Keep data accurate and up to date
5. **Storage limitation** - Retain only as long as necessary
6. **Integrity and confidentiality** - Ensure security
7. **Accountability** - Demonstrate compliance`,
      },
      {
        id: 'lawful-basis',
        title: 'Lawful Basis for Processing',
        order: 2,
        content: `## Lawful Basis Documentation

### Primary Lawful Bases Used
{{#each lawfulBases}}
{{#if (equals this "consent")}}
#### Consent (Article 6(1)(a))
- Consent must be freely given, specific, informed, unambiguous
- Clear affirmative action required
- Withdrawal as easy as giving consent
- Record of consent maintained
- Not suitable where power imbalance exists
{{/if}}
{{#if (equals this "contract")}}
#### Contract (Article 6(1)(b))
- Processing necessary for contract performance
- Processing necessary to enter into contract
- Cannot be used for additional services
{{/if}}
{{#if (equals this "legal")}}
#### Legal Obligation (Article 6(1)(c))
- Clear legal requirement identified
- Processing necessary (not just helpful)
- Documented legal basis reference
{{/if}}
{{#if (equals this "legitimate")}}
#### Legitimate Interests (Article 6(1)(f))
- Legitimate Interest Assessment (LIA) required
- Balance against data subject rights
- Not available for public authorities
- Document the assessment

**LIA Template:**
1. Purpose test: What is the legitimate interest?
2. Necessity test: Is processing necessary?
3. Balancing test: Do rights override the interest?
{{/if}}
{{/each}}

### Special Category Data (Article 9)
Processing of special category data requires:
- Explicit consent, OR
- Employment/social security law, OR
- Vital interests, OR
- Legitimate activities (nonprofits), OR
- Manifestly public data, OR
- Legal claims, OR
- Substantial public interest, OR
- Healthcare purposes, OR
- Public health, OR
- Archiving/research`,
      },
      {
        id: 'data-subject-rights',
        title: 'Data Subject Rights',
        order: 3,
        content: `## Data Subject Rights Procedures

### Right to be Informed (Articles 13-14)
**At collection:**
- Controller identity and contact
- DPO contact details
- Purposes and lawful basis
- Legitimate interests (if applicable)
- Recipients/categories of recipients
- International transfer safeguards
- Retention period
- All data subject rights
- Right to withdraw consent
- Right to lodge complaint
- Source of data (if not from subject)
- Automated decision-making details

### Right of Access (Article 15)
**Response time:** 1 month (extendable by 2 months)
**Must provide:**
- Confirmation of processing
- Copy of personal data
- Supplementary information (as above)
**Format:** Commonly used electronic format
**Cost:** Free (reasonable fee for excessive requests)

### Right to Rectification (Article 16)
**Response time:** 1 month
**Process:**
- Verify identity
- Make corrections
- Notify recipients
- Inform data subject of recipients

### Right to Erasure (Article 17)
**Response time:** 1 month
**Applies when:**
- Data no longer necessary
- Consent withdrawn
- Subject objects (no overriding grounds)
- Unlawful processing
- Legal obligation to erase
- Child's data (online services)

**Exceptions:**
- Freedom of expression
- Legal obligation
- Public health
- Archiving/research
- Legal claims

### Right to Restriction (Article 18)
**Applies when:**
- Accuracy contested
- Processing unlawful (erasure opposed)
- No longer needed (legal claims)
- Pending objection verification

### Right to Portability (Article 20)
**Applies when:**
- Consent or contract basis
- Automated processing
**Format:** Structured, commonly used, machine-readable

### Right to Object (Article 21)
**Legitimate interests/public task:**
- Must stop unless compelling grounds
**Direct marketing:**
- Must always stop immediately
**Research:**
- May continue if public interest`,
      },
      {
        id: 'dpia',
        title: 'Data Protection Impact Assessment',
        order: 4,
        content: `## DPIA Requirements (Article 35)

### When Required
- Systematic and extensive profiling with significant effects
- Large scale special category data
- Systematic monitoring of public areas
- New technologies with high risk
- Prevents data subjects exercising rights
- Cross-border data combination
- Vulnerable data subjects

### DPIA Process
1. **Describe processing**
   - Nature, scope, context, purposes
   - Assets involved
   - Data flows

2. **Assess necessity & proportionality**
   - Purpose specification
   - Lawful basis justification
   - Data minimization
   - Storage limitation
   - Subject rights

3. **Identify and assess risks**
   - Physical, material, non-material harm
   - Likelihood and severity
   - Risk to rights and freedoms

4. **Identify mitigations**
   - Measures to address risks
   - Demonstrate compliance
   - Residual risk assessment

5. **Sign off and review**
   - DPO consultation
   - Controller approval
   - Regular review schedule

### Supervisory Authority Consultation
If residual high risk cannot be mitigated:
- Prior consultation required
- 8-week response period
- Extendable by 6 weeks`,
      },
      {
        id: 'breach',
        title: 'Data Breach Response',
        order: 5,
        content: `## Personal Data Breach Procedures (Articles 33-34)

### Breach Definition
Breach of security leading to accidental or unlawful:
- Destruction
- Loss
- Alteration
- Unauthorized disclosure
- Unauthorized access

### Detection and Assessment
1. Identify the breach
2. Contain the breach
3. Assess risk to individuals
4. Determine notification requirements

### Supervisory Authority Notification
**When:** Within 72 hours of awareness
**Unless:** Unlikely to result in risk to rights

**Must include:**
- Nature of breach (categories, numbers)
- DPO contact
- Likely consequences
- Mitigation measures

### Data Subject Notification
**When:** High risk to rights and freedoms
**Without undue delay**

**Must include:**
- Nature of breach (clear, plain language)
- DPO contact
- Likely consequences
- Mitigation measures

**Exceptions:**
- Encryption/unintelligible data
- Subsequent measures eliminated risk
- Disproportionate effort (public communication)

### Documentation
All breaches must be documented:
- Facts of breach
- Effects
- Remedial action
- Notification decisions and justifications`,
      },
      {
        id: 'international',
        title: 'International Transfers',
        order: 6,
        content: `## International Data Transfers

### Transfer Mechanisms

#### Adequacy Decisions (Article 45)
Countries with adequate protection:
- EU member states
- EEA countries
- Adequacy decision countries

#### Standard Contractual Clauses (Article 46)
- Use EU Commission approved clauses
- Supplementary measures may be required
- Transfer Impact Assessment (TIA) needed

#### Binding Corporate Rules (Article 47)
- Group of companies
- Supervisory authority approval
- Enforceable commitments

#### Derogations (Article 49)
- Explicit consent (informed of risks)
- Contract performance
- Public interest
- Legal claims
- Vital interests
- Public registers

### Transfer Impact Assessment
1. Identify transfer and mechanism
2. Assess third country law
3. Identify supplementary measures
4. Procedural steps for measures
5. Re-evaluate at intervals`,
      },
    ],
  },
  {
    meta: {
      id: 'gdpr-ropa',
      name: 'Records of Processing Activities',
      description: 'ROPA template as required under Article 30',
      version: '1.0.0',
      category: 'compliance',
      scope: 'standard',
      author: 'Intent Solutions',
      tags: ['gdpr', 'ropa', 'documentation'],
    },
    variables: [
      { name: 'companyName', label: 'Company Name', type: 'string', required: true },
      { name: 'entityType', label: 'Entity Type', type: 'select', options: [
        { label: 'Controller', value: 'controller' },
        { label: 'Processor', value: 'processor' },
      ]},
    ],
    sections: [
      {
        id: 'overview',
        title: 'ROPA Overview',
        order: 1,
        content: `# {{companyName}} Records of Processing Activities

**Entity Type:** {{entityType}}
**Last Updated:** [Date]

## Purpose
This document maintains records of processing activities as required by Article 30 of the GDPR.`,
      },
      {
        id: 'controller-records',
        title: 'Controller Records',
        order: 2,
        condition: { variable: 'entityType', operator: 'equals', value: 'controller' },
        content: `## Controller Processing Records

### Processing Activity Register

| Field | Description |
|-------|-------------|
| **Activity Name** | |
| **Purpose(s)** | |
| **Lawful Basis** | |
| **Data Subject Categories** | |
| **Personal Data Categories** | |
| **Special Category Data** | |
| **Recipients** | |
| **International Transfers** | |
| **Retention Period** | |
| **Security Measures** | |
| **DPIA Required** | |
| **DPIA Completed** | |

### Example Entry
\`\`\`
Activity: Customer Account Management
Purpose: Manage customer accounts, provide services, billing
Lawful Basis: Contract (Article 6(1)(b))
Data Subjects: Customers
Data Categories: Name, email, phone, address, payment details
Special Category: None
Recipients: Payment processor, email service provider
Transfers: USA (SCCs in place)
Retention: Account lifetime + 7 years (tax requirements)
Security: Encryption, access controls, audit logging
DPIA Required: No
\`\`\``,
      },
      {
        id: 'processor-records',
        title: 'Processor Records',
        order: 3,
        condition: { variable: 'entityType', operator: 'equals', value: 'processor' },
        content: `## Processor Processing Records

### Processing Activity Register

| Field | Description |
|-------|-------------|
| **Controller Name** | |
| **Controller Contact** | |
| **Processing Categories** | |
| **International Transfers** | |
| **Security Measures** | |
| **Sub-processors** | |

### Example Entry
\`\`\`
Controller: Example Corp
Contact: privacy@example.com
Processing: Email delivery on behalf of controller
Transfers: None (EU processing only)
Security: Encryption, access controls, SOC 2
Sub-processors: AWS (Frankfurt), SendGrid (Dublin)
\`\`\``,
      },
    ],
  },
  {
    meta: {
      id: 'gdpr-privacy-notice',
      name: 'GDPR Privacy Notice',
      description: 'Privacy notice template compliant with GDPR Articles 13-14',
      version: '1.0.0',
      category: 'compliance',
      scope: 'standard',
      author: 'Intent Solutions',
      tags: ['gdpr', 'privacy', 'notice', 'transparency'],
    },
    variables: [
      { name: 'companyName', label: 'Company Name', type: 'string', required: true },
      { name: 'companyAddress', label: 'Company Address', type: 'text', required: true },
      { name: 'dpoEmail', label: 'DPO/Privacy Email', type: 'string', required: true },
      { name: 'websiteUrl', label: 'Website URL', type: 'string', required: true },
      { name: 'supervisoryAuthority', label: 'Supervisory Authority', type: 'string' },
    ],
    sections: [
      {
        id: 'intro',
        title: 'Introduction',
        order: 1,
        content: `# Privacy Notice

**Last Updated:** [Date]

## Who We Are
**{{companyName}}**
{{companyAddress}}

**Website:** {{websiteUrl}}
**Privacy Contact:** {{dpoEmail}}

This privacy notice explains how we collect, use, and protect your personal data when you use our services.`,
      },
      {
        id: 'collection',
        title: 'Information We Collect',
        order: 2,
        content: `## Information We Collect

### Information You Provide
- Account information (name, email, password)
- Profile information (photo, preferences)
- Communications (support requests, feedback)
- Payment information (processed by our payment provider)

### Information Collected Automatically
- Device information (browser, operating system)
- Usage data (pages visited, features used)
- Log data (IP address, timestamps)
- Cookies and similar technologies

### Information from Third Parties
- Social login providers (if you choose to connect)
- Business partners (where you have consented)`,
      },
      {
        id: 'purposes',
        title: 'How We Use Your Information',
        order: 3,
        content: `## How We Use Your Information

| Purpose | Lawful Basis |
|---------|--------------|
| Provide our services | Contract |
| Create and manage your account | Contract |
| Process payments | Contract |
| Send service communications | Contract |
| Respond to your requests | Legitimate interests |
| Improve our services | Legitimate interests |
| Send marketing (with consent) | Consent |
| Comply with legal obligations | Legal obligation |
| Protect against fraud | Legitimate interests |`,
      },
      {
        id: 'sharing',
        title: 'Sharing Your Information',
        order: 4,
        content: `## Who We Share Your Information With

### Service Providers
We use trusted service providers who process data on our behalf:
- Cloud hosting providers
- Payment processors
- Email service providers
- Analytics providers
- Customer support tools

All processors are bound by data processing agreements.

### Legal Requirements
We may disclose data when required by law or to:
- Comply with legal process
- Protect our rights
- Prevent harm
- Respond to government requests

### Business Transfers
In the event of a merger, acquisition, or sale, your data may be transferred to the new entity.`,
      },
      {
        id: 'rights',
        title: 'Your Rights',
        order: 5,
        content: `## Your Rights

Under GDPR, you have the following rights:

| Right | Description |
|-------|-------------|
| **Access** | Request a copy of your personal data |
| **Rectification** | Correct inaccurate or incomplete data |
| **Erasure** | Request deletion of your data |
| **Restriction** | Limit how we use your data |
| **Portability** | Receive your data in a portable format |
| **Object** | Object to certain processing |
| **Withdraw Consent** | Withdraw previously given consent |

### Exercising Your Rights
Contact us at: {{dpoEmail}}

We will respond within 30 days.

### Complaints
{{#if supervisoryAuthority}}
You have the right to lodge a complaint with {{supervisoryAuthority}}.
{{else}}
You have the right to lodge a complaint with your local data protection authority.
{{/if}}`,
      },
      {
        id: 'retention',
        title: 'Data Retention',
        order: 6,
        content: `## How Long We Keep Your Data

| Data Type | Retention Period |
|-----------|------------------|
| Account data | Account lifetime + 30 days |
| Transaction records | 7 years (legal requirement) |
| Communications | 3 years |
| Marketing preferences | Until withdrawal |
| Analytics data | 26 months |

When data is no longer needed, we securely delete or anonymize it.`,
      },
      {
        id: 'security',
        title: 'Security',
        order: 7,
        content: `## How We Protect Your Data

We implement appropriate technical and organizational measures:
- Encryption in transit (TLS) and at rest
- Access controls and authentication
- Regular security assessments
- Employee training
- Incident response procedures

No method of transmission over the internet is 100% secure. Please protect your account credentials.`,
      },
      {
        id: 'cookies',
        title: 'Cookies',
        order: 8,
        content: `## Cookies and Tracking

### Essential Cookies
Required for the website to function. Cannot be disabled.

### Analytics Cookies
Help us understand how visitors use our website.

### Marketing Cookies
Used to deliver relevant advertisements.

### Managing Cookies
You can manage cookie preferences through our cookie banner or your browser settings.

For more details, see our [Cookie Policy].`,
      },
      {
        id: 'contact',
        title: 'Contact Us',
        order: 9,
        content: `## Contact Us

For privacy-related questions or to exercise your rights:

**Email:** {{dpoEmail}}
**Address:** {{companyAddress}}

### Updates to This Notice
We may update this privacy notice. We will notify you of significant changes via email or website notice.`,
      },
    ],
  },
];

export default GDPR_TEMPLATES;
