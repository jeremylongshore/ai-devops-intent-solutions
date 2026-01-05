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

- [x] **MCP Server** - Native Claude/Cursor integration
- [x] **CLI Tool** - Command-line interface
- [ ] **AI Interview Engine** - Adaptive questioning
- [ ] **Deep Integrations** - GitHub, Linear, Jira, Notion
- [ ] **Chat Bot Support** - Slack, Discord doc generation
- [ ] **Custom Templates** - YAML-based template builder
- [ ] **Multi-Model Support** - Claude, GPT-4, Gemini

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
