/**
 * HIPAA Compliance Template Pack
 * Templates for HIPAA compliance documentation
 */

import type { CustomTemplate } from '../../enterprise/templates/types.js';

export const HIPAA_TEMPLATES: CustomTemplate[] = [
  {
    meta: {
      id: 'hipaa-policies',
      name: 'HIPAA Security Policies',
      description: 'Comprehensive HIPAA security and privacy policies',
      version: '1.0.0',
      category: 'compliance',
      scope: 'enterprise',
      author: 'Intent Solutions',
      tags: ['hipaa', 'healthcare', 'compliance', 'policies'],
    },
    variables: [
      { name: 'organizationName', label: 'Organization Name', type: 'string', required: true },
      { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
      { name: 'privacyOfficer', label: 'Privacy Officer', type: 'string', required: true },
      { name: 'securityOfficer', label: 'Security Officer', type: 'string', required: true },
      { name: 'organizationType', label: 'Organization Type', type: 'select', options: [
        { label: 'Covered Entity (Provider)', value: 'provider' },
        { label: 'Covered Entity (Health Plan)', value: 'plan' },
        { label: 'Business Associate', value: 'ba' },
        { label: 'Hybrid Entity', value: 'hybrid' },
      ]},
    ],
    sections: [
      {
        id: 'header',
        title: 'Document Control',
        order: 1,
        content: `# {{organizationName}} HIPAA Policies

**Privacy Officer:** {{privacyOfficer}}
**Security Officer:** {{securityOfficer}}
**Effective Date:** {{effectiveDate}}
**Organization Type:** {{organizationType}}

## Policy Statement
{{organizationName}} is committed to protecting the privacy and security of Protected Health Information (PHI) in compliance with the Health Insurance Portability and Accountability Act (HIPAA).

## Scope
These policies apply to all workforce members, business associates, and any individual or entity with access to PHI.`,
      },
      {
        id: 'privacy-rule',
        title: 'Privacy Rule Policies',
        order: 2,
        content: `## Privacy Rule Compliance

### Notice of Privacy Practices (NPP)
- NPP distributed to patients at first service
- Posted in facilities and on website
- Updated as required by law
- Acknowledgment documented

### Minimum Necessary Standard
- Access limited to minimum PHI needed
- Role-based access definitions
- Routine disclosures pre-defined
- Non-routine requests individually reviewed

### Patient Rights

#### Right to Access
- Patients may request access to their PHI
- Response within 30 days (one 30-day extension)
- Reasonable cost-based fees permitted
- Designated record set defined

#### Right to Amendment
- Patients may request amendments
- Response within 60 days
- Denial reasons documented
- Amendment appended to record

#### Right to Accounting of Disclosures
- Six-year disclosure history
- Excludes treatment, payment, operations
- Response within 60 days

#### Right to Request Restrictions
- Patients may request restrictions
- Not required to agree (except self-pay)
- Agreed restrictions honored

### Authorization Requirements
- Valid authorization elements defined
- Marketing authorization requirements
- Research authorization requirements
- Revocation procedures`,
      },
      {
        id: 'security-rule',
        title: 'Security Rule Policies',
        order: 3,
        content: `## Security Rule Compliance

### Administrative Safeguards

#### Security Management Process
- Risk analysis conducted annually
- Risk management plan maintained
- Sanction policy enforced
- Information system activity reviewed

#### Workforce Security
- Authorization procedures
- Workforce clearance
- Termination procedures
- Access establishment and modification

#### Information Access Management
- Access authorization policies
- Access establishment policies
- Access modification policies

#### Security Awareness Training
- Security reminders
- Protection from malware
- Login monitoring
- Password management

#### Security Incident Procedures
- Response procedures
- Reporting requirements
- Documentation requirements

#### Contingency Planning
- Data backup plan
- Disaster recovery plan
- Emergency mode operations
- Testing and revision

#### Evaluation
- Periodic technical and non-technical evaluation
- Response to environmental/operational changes

### Physical Safeguards

#### Facility Access Controls
- Contingency operations
- Facility security plan
- Access control procedures
- Maintenance records

#### Workstation Security
- Workstation use policies
- Physical safeguards for workstations

#### Device and Media Controls
- Disposal procedures
- Media re-use
- Accountability
- Data backup and storage

### Technical Safeguards

#### Access Control
- Unique user identification
- Emergency access procedures
- Automatic logoff
- Encryption and decryption

#### Audit Controls
- Hardware, software, procedural mechanisms
- Activity examination procedures

#### Integrity Controls
- Mechanisms to authenticate ePHI
- Transmission integrity controls

#### Transmission Security
- Integrity controls
- Encryption requirements`,
      },
      {
        id: 'breach',
        title: 'Breach Notification',
        order: 4,
        content: `## Breach Notification Policy

### Definition of Breach
Unauthorized acquisition, access, use, or disclosure of PHI that compromises security or privacy, unless:
- Unintentional by authorized workforce member
- Inadvertent between authorized persons
- Information cannot be retained

### Risk Assessment
Four factors to assess:
1. Nature and extent of PHI involved
2. Unauthorized person who used/received PHI
3. Whether PHI was actually acquired or viewed
4. Extent to which risk was mitigated

### Individual Notification
- Without unreasonable delay
- No later than 60 days from discovery
- Written notice (first-class mail)
- Include: description, types of info, steps to protect, what entity is doing, contact

### Media Notification
- If breach affects 500+ residents of state
- Prominent media outlets
- Without unreasonable delay

### HHS Notification
- 500+ individuals: within 60 days
- Fewer than 500: annual log submission
- Via HHS web portal

### Documentation
- Risk assessment results
- Notification decisions
- All breach notifications sent
- Maintained for 6 years`,
      },
      {
        id: 'business-associates',
        title: 'Business Associate Management',
        order: 5,
        content: `## Business Associate Agreements

### BAA Requirements
All business associates must execute a BAA that includes:
- Permitted uses and disclosures
- Safeguard requirements
- Agent and subcontractor requirements
- Individual rights provisions
- Termination provisions
- Breach notification obligations

### Due Diligence
- Security assessment before engagement
- Annual security questionnaire
- SOC 2 or equivalent certification
- Insurance requirements

### Monitoring
- Annual BAA review
- Security compliance verification
- Incident response coordination
- Termination procedures

### Subcontractor Flow-down
- Same requirements for subcontractors
- Written agreements required
- Covered entity notification`,
      },
      {
        id: 'training',
        title: 'Training Requirements',
        order: 6,
        content: `## HIPAA Training Program

### Initial Training
- All workforce members before PHI access
- Privacy and security policies
- Patient rights
- Reporting procedures

### Annual Refresher
- Privacy rule updates
- Security awareness
- Breach examples and prevention
- Role-specific training

### Role-Specific Training
| Role | Additional Training |
|------|---------------------|
| IT Staff | Technical security, access management |
| Clinical Staff | PHI handling, minimum necessary |
| Administrative | Authorization, patient rights |
| Management | Sanctions, incident response |

### Documentation
- Training completion records
- Training materials versions
- Assessment results
- Maintained for 6 years`,
      },
    ],
  },
  {
    meta: {
      id: 'hipaa-risk-assessment',
      name: 'HIPAA Risk Assessment',
      description: 'Risk assessment template for HIPAA Security Rule compliance',
      version: '1.0.0',
      category: 'compliance',
      scope: 'standard',
      author: 'Intent Solutions',
      tags: ['hipaa', 'risk', 'security', 'assessment'],
    },
    variables: [
      { name: 'organizationName', label: 'Organization Name', type: 'string', required: true },
      { name: 'assessmentDate', label: 'Assessment Date', type: 'date', required: true },
      { name: 'assessor', label: 'Assessor', type: 'string', required: true },
    ],
    sections: [
      {
        id: 'overview',
        title: 'Assessment Overview',
        order: 1,
        content: `# {{organizationName}} HIPAA Risk Assessment

**Assessment Date:** {{assessmentDate}}
**Assessor:** {{assessor}}

## Purpose
This risk assessment identifies potential risks and vulnerabilities to the confidentiality, integrity, and availability of ePHI as required by 45 CFR 164.308(a)(1)(ii)(A).

## Scope
- All systems that create, receive, maintain, or transmit ePHI
- Administrative, physical, and technical safeguards
- Workforce members with ePHI access`,
      },
      {
        id: 'inventory',
        title: 'Asset Inventory',
        order: 2,
        content: `## ePHI Asset Inventory

### Systems Containing ePHI
| System | ePHI Types | Location | Owner |
|--------|------------|----------|-------|
| | | | |
| | | | |

### Data Flows
Document how ePHI flows through the organization:
1. Collection points
2. Storage locations
3. Transmission methods
4. Disposal procedures

### Access Points
- Internal access methods
- Remote access methods
- Third-party access
- Patient access (portal)`,
      },
      {
        id: 'threats',
        title: 'Threat Identification',
        order: 3,
        content: `## Threat Analysis

### Natural Threats
| Threat | Likelihood | Systems Affected |
|--------|------------|------------------|
| Fire | | |
| Flood | | |
| Power outage | | |
| Natural disaster | | |

### Human Threats (Intentional)
| Threat | Likelihood | Systems Affected |
|--------|------------|------------------|
| External hacker | | |
| Malicious insider | | |
| Social engineering | | |
| Ransomware | | |

### Human Threats (Unintentional)
| Threat | Likelihood | Systems Affected |
|--------|------------|------------------|
| Accidental disclosure | | |
| Lost/stolen device | | |
| Misconfiguration | | |
| User error | | |

### Technical Threats
| Threat | Likelihood | Systems Affected |
|--------|------------|------------------|
| Software vulnerability | | |
| System failure | | |
| Network outage | | |
| Data corruption | | |`,
      },
      {
        id: 'vulnerabilities',
        title: 'Vulnerability Assessment',
        order: 4,
        content: `## Vulnerability Assessment

### Administrative Vulnerabilities
- [ ] Lack of security policies
- [ ] Inadequate training
- [ ] No incident response plan
- [ ] Insufficient BAA management
- [ ] Lack of risk management

### Physical Vulnerabilities
- [ ] Inadequate facility security
- [ ] Uncontrolled visitor access
- [ ] Insufficient workstation security
- [ ] Improper disposal procedures

### Technical Vulnerabilities
- [ ] Weak access controls
- [ ] No encryption
- [ ] Missing audit logs
- [ ] Unpatched systems
- [ ] Weak authentication`,
      },
      {
        id: 'risk-matrix',
        title: 'Risk Matrix',
        order: 5,
        content: `## Risk Analysis Matrix

### Risk Calculation
**Risk = Likelihood × Impact**

### Likelihood Scale
| Level | Description |
|-------|-------------|
| 1 - Low | Unlikely to occur |
| 2 - Medium | May occur occasionally |
| 3 - High | Likely to occur |

### Impact Scale
| Level | Description |
|-------|-------------|
| 1 - Low | Minimal impact |
| 2 - Medium | Moderate impact |
| 3 - High | Severe impact |

### Risk Register
| Risk | Likelihood | Impact | Risk Score | Mitigation |
|------|------------|--------|------------|------------|
| | | | | |
| | | | | |

### Risk Prioritization
- **High (7-9):** Immediate action required
- **Medium (4-6):** Planned remediation
- **Low (1-3):** Accept or monitor`,
      },
      {
        id: 'remediation',
        title: 'Remediation Plan',
        order: 6,
        content: `## Risk Remediation Plan

### High Priority Items
| Risk | Remediation | Owner | Target Date | Status |
|------|-------------|-------|-------------|--------|
| | | | | |

### Medium Priority Items
| Risk | Remediation | Owner | Target Date | Status |
|------|-------------|-------|-------------|--------|
| | | | | |

### Accepted Risks
| Risk | Justification | Approved By | Review Date |
|------|---------------|-------------|-------------|
| | | | |

### Timeline
- High priority: 30 days
- Medium priority: 90 days
- Low priority: 180 days`,
      },
    ],
  },
];

export default HIPAA_TEMPLATES;
