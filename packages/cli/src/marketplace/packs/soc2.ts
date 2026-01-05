/**
 * SOC 2 Compliance Template Pack
 * Templates for SOC 2 Type I and II compliance documentation
 */

import type { CustomTemplate } from '../../enterprise/templates/types.js';

export const SOC2_TEMPLATES: CustomTemplate[] = [
  {
    meta: {
      id: 'soc2-policies',
      name: 'SOC 2 Security Policies',
      description: 'Comprehensive security policies aligned with SOC 2 Trust Services Criteria',
      version: '1.0.0',
      category: 'compliance',
      scope: 'enterprise',
      author: 'Intent Solutions',
      audience: 'enterprise',
      tags: ['soc2', 'compliance', 'security', 'policies'],
    },
    variables: [
      { name: 'companyName', label: 'Company Name', type: 'string', required: true },
      { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
      { name: 'securityOfficer', label: 'Security Officer', type: 'string', required: true },
      { name: 'trustCriteria', label: 'Trust Services Criteria', type: 'multiselect', options: [
        { label: 'Security (CC)', value: 'security' },
        { label: 'Availability (A)', value: 'availability' },
        { label: 'Processing Integrity (PI)', value: 'processing' },
        { label: 'Confidentiality (C)', value: 'confidentiality' },
        { label: 'Privacy (P)', value: 'privacy' },
      ], default: ['security'] },
    ],
    sections: [
      {
        id: 'header',
        title: 'Document Control',
        order: 1,
        content: `# {{companyName}} Security Policies

**Document Owner:** {{securityOfficer}}
**Effective Date:** {{effectiveDate}}
**Classification:** Internal Use Only

## Document History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | {{effectiveDate}} | {{securityOfficer}} | Initial release |

## Approval
This policy has been approved by {{companyName}} leadership and applies to all employees, contractors, and third parties.`,
      },
      {
        id: 'information-security',
        title: 'Information Security Policy',
        order: 2,
        content: `## Information Security Policy

### Purpose
This policy establishes the framework for protecting {{companyName}}'s information assets and ensuring compliance with SOC 2 Trust Services Criteria.

### Scope
This policy applies to:
- All employees and contractors
- All information systems and data
- All business processes

### Policy Statements

#### 1. Asset Management
- All information assets shall be inventoried
- Asset owners shall be assigned and documented
- Assets shall be classified by sensitivity
- Acceptable use shall be defined

#### 2. Access Control
- Access shall be granted on a need-to-know basis
- Unique user IDs shall be assigned
- Strong authentication shall be enforced
- Access shall be reviewed quarterly

#### 3. Cryptography
- Encryption shall be used for sensitive data
- Key management procedures shall be followed
- Approved algorithms only (AES-256, RSA-2048+)

#### 4. Physical Security
- Facilities shall be physically secured
- Visitor access shall be controlled
- Equipment shall be protected`,
      },
      {
        id: 'access-control',
        title: 'Access Control Policy',
        order: 3,
        content: `## Access Control Policy

### User Access Management

#### Account Provisioning
1. Access requests must be submitted via ticketing system
2. Manager approval required for all access
3. Access granted based on role requirements
4. Provisioning completed within 24 hours

#### Authentication Requirements
| System Type | MFA Required | Password Policy |
|-------------|--------------|-----------------|
| Production | Yes | 14+ chars, complexity |
| Corporate | Yes | 12+ chars, complexity |
| Development | Yes | 12+ chars, complexity |

#### Access Reviews
- Quarterly access certification
- Immediate revocation upon termination
- Annual role-based access review
- Privileged access monthly review

### Privileged Access
- Just-in-time access for administrative functions
- Session recording for privileged actions
- Separate accounts for admin activities
- Approval workflow for privileged access`,
      },
      {
        id: 'change-management',
        title: 'Change Management Policy',
        order: 4,
        content: `## Change Management Policy

### Change Categories
| Category | Approval | Testing | Rollback Plan |
|----------|----------|---------|---------------|
| Emergency | 2 approvers | Post-change | Required |
| Standard | CAB | Pre-change | Required |
| Normal | 1 approver | Pre-change | Required |

### Change Process
1. **Request** - Submit change request with business justification
2. **Review** - Technical and security review
3. **Approve** - Appropriate approval based on category
4. **Test** - Validate in non-production environment
5. **Implement** - Execute during approved window
6. **Verify** - Post-implementation verification
7. **Close** - Document and close change ticket

### Documentation Requirements
- Business justification
- Technical implementation plan
- Rollback procedure
- Test results
- Post-implementation review`,
      },
      {
        id: 'incident-response',
        title: 'Incident Response Policy',
        order: 5,
        content: `## Incident Response Policy

### Incident Classification
| Severity | Response Time | Escalation |
|----------|---------------|------------|
| Critical | 15 minutes | Immediate |
| High | 1 hour | 2 hours |
| Medium | 4 hours | 8 hours |
| Low | 24 hours | 48 hours |

### Response Phases

#### 1. Detection & Analysis
- Monitor security alerts
- Triage and classify incident
- Determine scope and impact
- Preserve evidence

#### 2. Containment
- Short-term containment
- System isolation if needed
- Evidence preservation
- Communication initiation

#### 3. Eradication & Recovery
- Remove threat
- Restore systems
- Verify integrity
- Monitor for recurrence

#### 4. Post-Incident
- Lessons learned meeting
- Update procedures
- Documentation
- Report to stakeholders`,
      },
      {
        id: 'vendor-management',
        title: 'Vendor Management Policy',
        order: 6,
        content: `## Vendor Management Policy

### Vendor Assessment
All vendors with access to systems or data must complete:
- Security questionnaire
- SOC 2 report review (or equivalent)
- Contract review
- Ongoing monitoring

### Vendor Requirements
| Data Access | Requirements |
|-------------|--------------|
| Sensitive | SOC 2 Type II, encryption, audit rights |
| Confidential | SOC 2, encryption |
| Internal | Security questionnaire |

### Ongoing Monitoring
- Annual security assessment
- SOC 2 report review
- Performance review
- Incident notification review`,
      },
    ],
  },
  {
    meta: {
      id: 'soc2-controls',
      name: 'SOC 2 Controls Matrix',
      description: 'Control mapping to SOC 2 Trust Services Criteria',
      version: '1.0.0',
      category: 'compliance',
      scope: 'enterprise',
      author: 'Intent Solutions',
      tags: ['soc2', 'controls', 'compliance'],
    },
    variables: [
      { name: 'companyName', label: 'Company Name', type: 'string', required: true },
      { name: 'auditPeriod', label: 'Audit Period', type: 'string', required: true },
    ],
    sections: [
      {
        id: 'overview',
        title: 'Controls Overview',
        order: 1,
        content: `# {{companyName}} SOC 2 Controls Matrix

**Audit Period:** {{auditPeriod}}

## Control Categories
This matrix maps {{companyName}}'s controls to SOC 2 Trust Services Criteria.`,
      },
      {
        id: 'cc1',
        title: 'CC1 - Control Environment',
        order: 2,
        content: `## CC1: Control Environment

| Criteria | Control | Evidence | Owner |
|----------|---------|----------|-------|
| CC1.1 | Code of conduct distributed annually | Signed acknowledgments | HR |
| CC1.2 | Board oversight meetings quarterly | Meeting minutes | Legal |
| CC1.3 | Organizational structure documented | Org chart | HR |
| CC1.4 | HR policies documented | Policy documents | HR |
| CC1.5 | Roles and responsibilities defined | Job descriptions | HR |`,
      },
      {
        id: 'cc2',
        title: 'CC2 - Communication',
        order: 3,
        content: `## CC2: Communication and Information

| Criteria | Control | Evidence | Owner |
|----------|---------|----------|-------|
| CC2.1 | Information security policy | Policy document | Security |
| CC2.2 | Security awareness training | Training records | Security |
| CC2.3 | External communication procedures | Communication policy | Legal |`,
      },
      {
        id: 'cc3',
        title: 'CC3 - Risk Assessment',
        order: 4,
        content: `## CC3: Risk Assessment

| Criteria | Control | Evidence | Owner |
|----------|---------|----------|-------|
| CC3.1 | Annual risk assessment | Risk register | Security |
| CC3.2 | Risk treatment plans | Treatment documentation | Security |
| CC3.3 | Change risk assessment | Change tickets | IT |
| CC3.4 | Fraud risk assessment | Fraud risk analysis | Finance |`,
      },
      {
        id: 'cc5',
        title: 'CC5 - Control Activities',
        order: 5,
        content: `## CC5: Control Activities

| Criteria | Control | Evidence | Owner |
|----------|---------|----------|-------|
| CC5.1 | Control selection based on risk | Risk-control mapping | Security |
| CC5.2 | Technology controls implemented | Technical controls doc | IT |
| CC5.3 | Policies deployed | Policy portal | Security |`,
      },
      {
        id: 'cc6',
        title: 'CC6 - Logical & Physical Access',
        order: 6,
        content: `## CC6: Logical and Physical Access Controls

| Criteria | Control | Evidence | Owner |
|----------|---------|----------|-------|
| CC6.1 | Logical access controls | Access management system | IT |
| CC6.2 | Access provisioning process | Provisioning tickets | IT |
| CC6.3 | Access revocation process | Termination checklist | HR/IT |
| CC6.4 | Physical access controls | Badge system | Facilities |
| CC6.5 | Physical security monitoring | Camera footage | Facilities |
| CC6.6 | Encryption implemented | Encryption standards | Security |
| CC6.7 | Data transmission protection | TLS configuration | IT |
| CC6.8 | Malware protection | Endpoint protection | IT |`,
      },
      {
        id: 'cc7',
        title: 'CC7 - System Operations',
        order: 7,
        content: `## CC7: System Operations

| Criteria | Control | Evidence | Owner |
|----------|---------|----------|-------|
| CC7.1 | Vulnerability management | Vulnerability scans | Security |
| CC7.2 | Security monitoring | SIEM alerts | Security |
| CC7.3 | Incident response | Incident tickets | Security |
| CC7.4 | Incident analysis | Post-mortems | Security |
| CC7.5 | Incident recovery | Recovery procedures | IT |`,
      },
      {
        id: 'cc8',
        title: 'CC8 - Change Management',
        order: 8,
        content: `## CC8: Change Management

| Criteria | Control | Evidence | Owner |
|----------|---------|----------|-------|
| CC8.1 | Change management policy | Policy document | IT |
| CC8.2 | Change testing | Test results | IT |
| CC8.3 | Change approval | Approval records | IT |`,
      },
      {
        id: 'cc9',
        title: 'CC9 - Risk Mitigation',
        order: 9,
        content: `## CC9: Risk Mitigation

| Criteria | Control | Evidence | Owner |
|----------|---------|----------|-------|
| CC9.1 | Risk mitigation activities | Risk treatment plans | Security |
| CC9.2 | Vendor risk management | Vendor assessments | Security |`,
      },
    ],
  },
  {
    meta: {
      id: 'soc2-audit-prep',
      name: 'SOC 2 Audit Preparation',
      description: 'Audit preparation checklist and timeline',
      version: '1.0.0',
      category: 'compliance',
      scope: 'standard',
      author: 'Intent Solutions',
      tags: ['soc2', 'audit', 'preparation'],
    },
    variables: [
      { name: 'companyName', label: 'Company Name', type: 'string', required: true },
      { name: 'auditType', label: 'Audit Type', type: 'select', options: [
        { label: 'Type I (Point in Time)', value: 'type1' },
        { label: 'Type II (Period of Time)', value: 'type2' },
      ]},
      { name: 'auditDate', label: 'Audit Start Date', type: 'date' },
      { name: 'auditor', label: 'Audit Firm', type: 'string' },
    ],
    sections: [
      {
        id: 'overview',
        title: 'Audit Overview',
        order: 1,
        content: `# {{companyName}} SOC 2 {{auditType}} Audit Preparation

**Audit Firm:** {{auditor}}
**Audit Start:** {{auditDate}}

## Objective
Prepare {{companyName}} for successful SOC 2 {{auditType}} audit examination.`,
      },
      {
        id: 'timeline',
        title: 'Preparation Timeline',
        order: 2,
        content: `## Audit Preparation Timeline

### 12 Weeks Before
- [ ] Confirm audit scope and criteria
- [ ] Assign internal audit team
- [ ] Review previous findings (if applicable)
- [ ] Update control documentation

### 8 Weeks Before
- [ ] Conduct internal control testing
- [ ] Address identified gaps
- [ ] Prepare evidence repository
- [ ] Brief control owners

### 4 Weeks Before
- [ ] Complete evidence gathering
- [ ] Conduct mock interviews
- [ ] Finalize system descriptions
- [ ] Review with auditor

### 1 Week Before
- [ ] Freeze evidence collection
- [ ] Prepare war room
- [ ] Confirm schedules
- [ ] Brief executive team`,
      },
      {
        id: 'evidence',
        title: 'Evidence Checklist',
        order: 3,
        content: `## Evidence Collection Checklist

### Governance
- [ ] Organization chart
- [ ] Board meeting minutes
- [ ] Risk assessments
- [ ] Policy documents

### Human Resources
- [ ] Background check records
- [ ] Training completion records
- [ ] Employee handbook
- [ ] Termination checklists

### Access Control
- [ ] User access listings
- [ ] Access review evidence
- [ ] MFA configuration
- [ ] Privileged access logs

### Change Management
- [ ] Change tickets (sample)
- [ ] Approval evidence
- [ ] Test results
- [ ] Deployment logs

### Security Operations
- [ ] Vulnerability scan reports
- [ ] Penetration test results
- [ ] Incident tickets
- [ ] Security monitoring alerts`,
      },
    ],
  },
];

export default SOC2_TEMPLATES;
