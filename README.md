# Intent Blueprint Docs

*Enterprise-grade AI documentation generator*

[![npm version](https://img.shields.io/npm/v/@intentsolutions/blueprint)](https://www.npmjs.com/package/@intentsolutions/blueprint)
[![CI](https://github.com/intent-solutions-io/intent-blueprint-docs/actions/workflows/ci.yml/badge.svg)](https://github.com/intent-solutions-io/intent-blueprint-docs/actions/workflows/ci.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-purple.svg)](https://modelcontextprotocol.io)

Transform project ideas into 22 professional documents in minutes. Works with Claude, Cursor, VS Code, and any MCP-compatible tool.

## Installation

```bash
# Install CLI globally
npm install -g @intentsolutions/blueprint

# Or use directly with npx
npx @intentsolutions/blueprint init
```

## Quick Start

### CLI Usage

```bash
# Interactive project setup
blueprint init

# Generate with options
blueprint generate -n "My Project" -d "A cool app" -s standard -a business

# AI-guided interview mode
blueprint interview

# List available templates
blueprint list
```

### MCP Server (Claude/Cursor)

Add to your Claude or Cursor MCP config:

```json
{
  "mcpServers": {
    "blueprint": {
      "command": "npx",
      "args": ["@intentsolutions/blueprint-mcp"]
    }
  }
}
```

**Available MCP Tools:**
- `blueprint_generate` - Generate docs from project description
- `blueprint_interview` - Start AI-guided intake session
- `blueprint_list_templates` - Show available templates
- `blueprint_customize` - Customize a single template
- `blueprint_export` - Export to GitHub/Linear/Jira/Notion

### IDE Integration

**VS Code / Cursor / Windsurf:**
- Install the MCP server (see above)
- Use MCP tools directly in chat
- Preview generated docs inline

**Google Antigravity:**
- MCP server auto-discovery
- Gemini 3 agent integration
- Parallel doc generation via manager view

**Amp (Sourcegraph):**
- VS Code extension compatible
- Thread-based doc generation sessions
- Subagent support for complex tasks

## Documentation Scopes

| Scope | Documents | Best For |
|-------|-----------|----------|
| **MVP** | 4 docs | Quick starts, prototypes |
| **Standard** | 12 docs | Most projects |
| **Comprehensive** | 22 docs | Enterprise, compliance |

## Template Marketplace

Install curated template packs for your industry or framework:

```bash
# Search for packs
blueprint pack search fintech

# Install a pack
blueprint pack install blueprint-fintech

# List installed packs
blueprint pack list

# Show featured packs
blueprint pack featured
```

### Available Template Packs

| Category | Packs | Description |
|----------|-------|-------------|
| **Verticals** | `blueprint-fintech`, `blueprint-healthtech`, `blueprint-saas` | Industry-specific templates |
| **Compliance** | `blueprint-soc2`, `blueprint-hipaa`, `blueprint-gdpr` | Regulatory documentation |
| **Frameworks** | `blueprint-nextjs`, `blueprint-fastapi`, `blueprint-rails` | Framework-optimized templates |

### Vertical Packs

- **FinTech** - Payment processing, KYC/AML, PCI-DSS compliance
- **HealthTech** - HIPAA compliance, FHIR integration, PHI handling
- **SaaS** - Multi-tenancy, subscription billing, onboarding flows

### Compliance Packs

- **SOC 2** - Trust services criteria, control mapping, audit prep
- **HIPAA** - Privacy/Security rules, BAA templates, risk assessment
- **GDPR** - Data subject rights, DPIA, privacy notices

### Framework Packs

- **Next.js** - App Router, API routes, deployment patterns
- **FastAPI** - Async patterns, OpenAPI specs, testing strategies
- **Rails** - Hotwire, Devise auth, RSpec testing

## Template Categories

### Product & Strategy (5 docs)
- PRD, Market Research, Competitor Analysis, User Personas, Project Brief

### Technical Architecture (4 docs)
- ADRs, System Architecture, Frontend Spec, Operational Readiness

### User Experience (3 docs)
- User Stories, User Journeys, Acceptance Criteria

### Development Workflow (5 docs)
- Task Generation, Task Processing, Risk Register, Brainstorming, Metrics

### Quality Assurance (5 docs)
- Test Plan, QA Gates, Release Plan, Post-Mortem, Usability Testing

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| `@intentsolutions/blueprint` | CLI tool | [![npm](https://img.shields.io/npm/v/@intentsolutions/blueprint)](https://www.npmjs.com/package/@intentsolutions/blueprint) |
| `@intentsolutions/blueprint-mcp` | MCP server | [![npm](https://img.shields.io/npm/v/@intentsolutions/blueprint-mcp)](https://www.npmjs.com/package/@intentsolutions/blueprint-mcp) |
| `@intentsolutions/blueprint-core` | Core engine | [![npm](https://img.shields.io/npm/v/@intentsolutions/blueprint-core)](https://www.npmjs.com/package/@intentsolutions/blueprint-core) |

## Plugin System

Extend Blueprint with custom plugins:

```typescript
import { createPluginManager } from '@intentsolutions/blueprint';

const manager = createPluginManager();

// Register a custom formatter
manager.register({
  name: 'my-formatter',
  version: '1.0.0',
  type: 'formatter',
  format: async (content, options) => {
    // Transform content
    return { content: transformedContent, format: 'custom' };
  }
});
```

### Plugin Types

| Type | Purpose | Example |
|------|---------|---------|
| **Formatter** | Output transformation | Markdown, HTML, PDF |
| **Validator** | Content quality checks | Completeness, style |
| **Processor** | Pre/post processing | Variable injection |
| **Integration** | External services | Slack, email |
| **Hook** | Lifecycle events | Before/after generation |

### Built-in Plugins

- `markdown-formatter` - Clean Markdown output
- `html-formatter` - HTML with styling
- `quality-validator` - Content quality rules

## Analytics Dashboard

Track usage and optimize your documentation workflow:

```bash
# View analytics dashboard
blueprint analytics

# Template usage stats
blueprint analytics templates

# Pack installation stats
blueprint analytics packs

# Export data
blueprint analytics export --format=csv
```

### Metrics Tracked

- Generation counts by template
- Popular templates and packs
- Session duration and patterns
- Error rates and types

## Configuration

Create `.blueprintrc.json` in your project root:

```json
{
  "defaultScope": "standard",
  "defaultAudience": "business",
  "outputDir": "./docs",
  "templateOverrides": {}
}
```

## Programmatic Usage

```typescript
import {
  generateAllDocuments,
  writeDocuments,
  listTemplates
} from '@intentsolutions/blueprint-core';

// Generate documents
const docs = generateAllDocuments({
  projectName: 'My Project',
  projectDescription: 'A revolutionary app',
  scope: 'standard',
  audience: 'business'
});

// Write to disk
writeDocuments(docs, './docs/my-project');

// List available templates
const templates = listTemplates();
```

## Roadmap

- [x] **Phase 1: MCP Server** - Native Claude/Cursor integration
- [x] **Phase 2: AI Interview Engine** - Adaptive questioning with project detection
- [x] **Phase 3: Deep Integrations** - GitHub, Linear, Jira, Notion export
- [x] **Phase 4: Enterprise Features** - Custom templates, REST API, webhooks, multi-model
- [x] **Phase 5: Ecosystem** - Template marketplace, plugins, analytics
- [ ] **Coming Soon** - Web UI, team collaboration, Slack/Discord bots

## Development

```bash
# Clone and setup
git clone https://github.com/intent-solutions-io/intent-blueprint-docs.git
cd intent-blueprint-docs
npm install
npm run build

# Development mode
npm run dev
```

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Apache 2.0 - See [LICENSE](LICENSE)

---

**By [Intent Solutions](https://intentsolutions.io)**

[![GitHub stars](https://img.shields.io/github/stars/intent-solutions-io/intent-blueprint-docs?style=social)](https://github.com/intent-solutions-io/intent-blueprint-docs/stargazers)
