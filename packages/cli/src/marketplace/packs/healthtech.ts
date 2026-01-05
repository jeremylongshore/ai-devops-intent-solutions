/**
 * HealthTech Template Pack
 * Templates for healthcare technology products with HIPAA considerations
 */

import type { CustomTemplate } from '../../enterprise/templates/types.js';

export const HEALTHTECH_TEMPLATES: CustomTemplate[] = [
  {
    meta: {
      id: 'healthtech-prd',
      name: 'HealthTech Product Requirements',
      description: 'PRD template for healthcare technology with regulatory compliance',
      version: '1.0.0',
      category: 'product',
      scope: 'comprehensive',
      author: 'Intent Solutions',
      audience: 'enterprise',
      tags: ['healthtech', 'hipaa', 'healthcare', 'prd'],
    },
    variables: [
      { name: 'productName', label: 'Product Name', type: 'string', required: true },
      { name: 'productType', label: 'Product Type', type: 'select', required: true, options: [
        { label: 'Electronic Health Records (EHR)', value: 'ehr' },
        { label: 'Telehealth Platform', value: 'telehealth' },
        { label: 'Patient Portal', value: 'portal' },
        { label: 'Clinical Decision Support', value: 'cds' },
        { label: 'Remote Patient Monitoring', value: 'rpm' },
        { label: 'Medical Device Software', value: 'device' },
        { label: 'Healthcare Analytics', value: 'analytics' },
        { label: 'Practice Management', value: 'practice' },
      ]},
      { name: 'targetUsers', label: 'Target Users', type: 'multiselect', options: [
        { label: 'Patients', value: 'patients' },
        { label: 'Physicians', value: 'physicians' },
        { label: 'Nurses', value: 'nurses' },
        { label: 'Administrators', value: 'admins' },
        { label: 'Care Coordinators', value: 'coordinators' },
        { label: 'Payers/Insurers', value: 'payers' },
      ]},
      { name: 'handlesPHI', label: 'Handles Protected Health Information (PHI)', type: 'boolean', default: true },
      { name: 'fdaRegulated', label: 'FDA Regulated (SaMD)', type: 'boolean', default: false },
      { name: 'interoperability', label: 'Interoperability Standards', type: 'multiselect', options: [
        { label: 'HL7 FHIR', value: 'fhir' },
        { label: 'HL7 v2', value: 'hl7v2' },
        { label: 'DICOM', value: 'dicom' },
        { label: 'C-CDA', value: 'ccda' },
        { label: 'X12 EDI', value: 'x12' },
      ]},
    ],
    sections: [
      {
        id: 'overview',
        title: 'Product Overview',
        order: 1,
        content: `## {{productName}}

**Product Type:** {{productType}}
**Target Users:** {{join targetUsers ", "}}

### Executive Summary
[Describe the healthcare problem being solved and the product vision]

### Clinical Value Proposition
- Patient outcomes improvement
- Clinical workflow efficiency
- Care coordination benefits
- Cost reduction potential`,
      },
      {
        id: 'regulatory',
        title: 'Regulatory Compliance',
        order: 2,
        content: `## Regulatory Requirements

{{#if handlesPHI}}
### HIPAA Compliance
This product handles Protected Health Information (PHI) and must comply with:

#### Privacy Rule
- Minimum necessary standard
- Patient access rights
- Authorization requirements
- Notice of Privacy Practices

#### Security Rule
- Administrative safeguards
- Physical safeguards
- Technical safeguards
- Documentation requirements

#### Breach Notification Rule
- Breach detection procedures
- Notification timelines (60 days)
- HHS reporting requirements
{{/if}}

{{#if fdaRegulated}}
### FDA Software as Medical Device (SaMD)
- Software classification level
- Quality Management System (QMS)
- Design controls per 21 CFR Part 820
- 510(k) or De Novo pathway
- Post-market surveillance
{{/if}}

### State Regulations
- State privacy laws
- Telehealth licensing (if applicable)
- Controlled substance prescribing (if applicable)`,
      },
      {
        id: 'security',
        title: 'Security Architecture',
        order: 3,
        content: `## Security Requirements

### Access Control
- Role-based access control (RBAC)
- Multi-factor authentication
- Session timeout (15 minutes)
- Emergency access ("break glass")

### Data Protection
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- PHI de-identification
- Audit logging

### Infrastructure
- HIPAA-eligible cloud services
- BAA requirements
- Network segmentation
- Intrusion detection

### Audit Requirements
- Access logging
- Modification tracking
- Download/export logging
- Retention (6 years minimum)`,
      },
      {
        id: 'interop',
        title: 'Interoperability',
        order: 4,
        condition: { variable: 'interoperability', operator: 'exists' },
        content: `## Interoperability Standards

{{#each interoperability}}
{{#if (equals this "fhir")}}
### HL7 FHIR
- FHIR R4 compliance
- SMART on FHIR authorization
- US Core profiles
- Bulk data export
{{/if}}
{{#if (equals this "hl7v2")}}
### HL7 v2.x
- ADT messages (patient demographics)
- ORM/ORU (orders/results)
- MDM (documents)
- Message parsing/validation
{{/if}}
{{#if (equals this "dicom")}}
### DICOM
- Image storage (SOP classes)
- Query/Retrieve
- Worklist management
- WADO-RS web access
{{/if}}
{{#if (equals this "ccda")}}
### C-CDA Documents
- Continuity of Care Document (CCD)
- Discharge Summary
- Progress Notes
- Care Plan
{{/if}}
{{/each}}

### API Requirements
- ONC certification (if applicable)
- Patient access API
- Provider directory API
- Payer integration`,
      },
      {
        id: 'clinical',
        title: 'Clinical Features',
        order: 5,
        content: `## Clinical Requirements

### Core Clinical Functions
{{#if (equals productType "ehr")}}
- Patient demographics
- Problem list management
- Medication management
- Allergy documentation
- Clinical notes
- Order entry (CPOE)
- Results review
{{/if}}

{{#if (equals productType "telehealth")}}
- Video consultation
- Secure messaging
- Virtual waiting room
- Screen sharing
- E-prescribing integration
- Visit documentation
{{/if}}

{{#if (equals productType "rpm")}}
- Device data collection
- Vital signs monitoring
- Alert thresholds
- Care team notifications
- Patient engagement
- Trending/analytics
{{/if}}

### Clinical Decision Support
- Drug-drug interaction checking
- Allergy alerts
- Clinical guidelines
- Risk scoring
- Care gap identification`,
      },
    ],
  },
  {
    meta: {
      id: 'healthtech-security',
      name: 'Healthcare Security Architecture',
      description: 'Security architecture for HIPAA-compliant healthcare systems',
      version: '1.0.0',
      category: 'technical',
      scope: 'comprehensive',
      author: 'Intent Solutions',
      tags: ['healthtech', 'hipaa', 'security'],
    },
    variables: [
      { name: 'systemName', label: 'System Name', type: 'string', required: true },
      { name: 'cloudProvider', label: 'Cloud Provider', type: 'select', options: [
        { label: 'AWS (HIPAA eligible)', value: 'aws' },
        { label: 'Azure (HIPAA compliant)', value: 'azure' },
        { label: 'Google Cloud (HIPAA eligible)', value: 'gcp' },
        { label: 'On-premises', value: 'onprem' },
      ]},
    ],
    sections: [
      {
        id: 'overview',
        title: 'Security Overview',
        order: 1,
        content: `# {{systemName}} Security Architecture

**Cloud Provider:** {{cloudProvider}}

## HIPAA Security Rule Compliance

### Administrative Safeguards
1. Security management process
2. Assigned security responsibility
3. Workforce security
4. Information access management
5. Security awareness training
6. Security incident procedures
7. Contingency plan
8. Evaluation

### Physical Safeguards
1. Facility access controls
2. Workstation use policies
3. Workstation security
4. Device and media controls

### Technical Safeguards
1. Access control
2. Audit controls
3. Integrity controls
4. Transmission security`,
      },
      {
        id: 'access',
        title: 'Access Control',
        order: 2,
        content: `## Access Control Implementation

### Authentication
- Username/password with complexity requirements
- Multi-factor authentication (MFA) required
- Biometric options for mobile
- Single sign-on (SSO) with SAML/OIDC

### Authorization
\`\`\`
Role Hierarchy:
├── System Admin (full access)
├── Practice Admin (practice-level)
├── Physician (patient panel)
├── Nurse (assigned patients)
├── Billing (financial data)
└── Patient (own records)
\`\`\`

### Session Management
- Automatic timeout: 15 minutes
- Re-authentication for sensitive actions
- Concurrent session limits
- Session invalidation on logout

### Emergency Access
- Break-glass procedure
- Documented justification required
- Automatic audit and review
- Time-limited access`,
      },
      {
        id: 'encryption',
        title: 'Data Protection',
        order: 3,
        content: `## Encryption Standards

### Data at Rest
- AES-256 encryption
- Key management via {{cloudProvider}} KMS
- Automatic key rotation (annual)
- Database-level encryption

### Data in Transit
- TLS 1.3 required
- Certificate pinning for mobile
- HSTS enabled
- Perfect forward secrecy

### PHI Handling
- Minimum necessary principle
- De-identification (Safe Harbor/Expert)
- Tokenization for analytics
- Secure deletion procedures`,
      },
      {
        id: 'audit',
        title: 'Audit Controls',
        order: 4,
        content: `## Audit Logging

### Required Log Events
| Event Type | Data Captured |
|------------|---------------|
| Login/Logout | User, timestamp, IP, device |
| PHI Access | User, patient, data type, action |
| PHI Modification | User, before/after, reason |
| Export/Download | User, data scope, format |
| Admin Actions | User, action, target |

### Log Retention
- Minimum: 6 years (HIPAA)
- Recommended: 10 years
- Immutable storage
- Encrypted at rest

### Monitoring
- Real-time alerting
- Anomaly detection
- Pattern analysis
- Regular review process`,
      },
    ],
  },
  {
    meta: {
      id: 'healthtech-fhir',
      name: 'FHIR Integration Specification',
      description: 'Technical specification for HL7 FHIR API integration',
      version: '1.0.0',
      category: 'technical',
      scope: 'standard',
      author: 'Intent Solutions',
      tags: ['healthtech', 'fhir', 'hl7', 'api'],
    },
    variables: [
      { name: 'projectName', label: 'Project Name', type: 'string', required: true },
      { name: 'fhirVersion', label: 'FHIR Version', type: 'select', options: [
        { label: 'R4 (4.0.1)', value: 'r4' },
        { label: 'R5 (5.0.0)', value: 'r5' },
        { label: 'STU3 (3.0.2)', value: 'stu3' },
      ], default: 'r4' },
      { name: 'certification', label: 'ONC Certification', type: 'boolean', default: false },
    ],
    sections: [
      {
        id: 'overview',
        title: 'FHIR Overview',
        order: 1,
        content: `# {{projectName}} FHIR Integration

**FHIR Version:** {{fhirVersion}}
{{#if certification}}**ONC Certified:** Yes{{/if}}

## Supported Resources
| Resource | Create | Read | Update | Delete | Search |
|----------|--------|------|--------|--------|--------|
| Patient | Yes | Yes | Yes | No | Yes |
| Practitioner | Yes | Yes | Yes | No | Yes |
| Encounter | Yes | Yes | Yes | No | Yes |
| Condition | Yes | Yes | Yes | No | Yes |
| Observation | Yes | Yes | No | No | Yes |
| MedicationRequest | Yes | Yes | Yes | No | Yes |
| AllergyIntolerance | Yes | Yes | Yes | No | Yes |`,
      },
      {
        id: 'auth',
        title: 'SMART on FHIR',
        order: 2,
        content: `## SMART on FHIR Authorization

### Supported Flows
- Standalone launch
- EHR launch
- Backend services

### Scopes
\`\`\`
patient/*.read        # Read all patient data
patient/Observation.* # Full Observation access
user/*.read           # Read data user can access
launch/patient        # Receive patient context
launch/encounter      # Receive encounter context
offline_access        # Refresh tokens
\`\`\`

### Token Endpoint
\`\`\`http
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code={code}
&redirect_uri={redirect}
&client_id={client_id}
\`\`\``,
      },
      {
        id: 'profiles',
        title: 'US Core Profiles',
        order: 3,
        condition: { variable: 'certification', operator: 'equals', value: true },
        content: `## US Core Profile Compliance

### Required Profiles
- US Core Patient
- US Core Practitioner
- US Core Organization
- US Core Encounter
- US Core Condition
- US Core Observation (Vitals, Labs, Social History)
- US Core Medication
- US Core AllergyIntolerance
- US Core Procedure
- US Core Immunization

### Must Support Elements
All elements marked "must support" in US Core must be:
- Populated when data is available
- Returned in responses
- Searchable where applicable`,
      },
    ],
  },
];

export default HEALTHTECH_TEMPLATES;
