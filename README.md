# Intent Blueprint Docs

*Last Updated: January 2026*

[![Enterprise E2E](https://github.com/intent-solutions-io/intent-blueprint-docs/actions/workflows/enterprise-e2e.yml/badge.svg)](https://github.com/intent-solutions-io/intent-blueprint-docs/actions/workflows/enterprise-e2e.yml)
[![CI](https://github.com/intent-solutions-io/intent-blueprint-docs/actions/workflows/ci.yml/badge.svg)](https://github.com/intent-solutions-io/intent-blueprint-docs/actions/workflows/ci.yml)
[![Template Validation](https://github.com/intent-solutions-io/intent-blueprint-docs/actions/workflows/template-validation.yml/badge.svg)](https://github.com/intent-solutions-io/intent-blueprint-docs/actions/workflows/template-validation.yml)
[![Release](https://img.shields.io/github/v/release/intent-solutions-io/intent-blueprint-docs?display_name=tag)](https://github.com/intent-solutions-io/intent-blueprint-docs/releases)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Issues](https://img.shields.io/github/issues/intent-solutions-io/intent-blueprint-docs)](https://github.com/intent-solutions-io/intent-blueprint-docs/issues)
[![PRs](https://img.shields.io/github/issues-pr/intent-solutions-io/intent-blueprint-docs)](https://github.com/intent-solutions-io/intent-blueprint-docs/pulls)
[![Last Commit](https://img.shields.io/github/last-commit/intent-solutions-io/intent-blueprint-docs)](https://github.com/intent-solutions-io/intent-blueprint-docs/commits/main)
[![Template Count](https://img.shields.io/badge/Templates-22-green.svg)](professional-templates/)
[![Contributors](https://img.shields.io/github/contributors/intent-solutions-io/intent-blueprint-docs)](https://github.com/intent-solutions-io/intent-blueprint-docs/graphs/contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/intent-solutions-io/intent-blueprint-docs?style=social)](https://github.com/intent-solutions-io/intent-blueprint-docs/stargazers)

**Enterprise-grade AI documentation generator.** Transform project ideas into 22 professional documents in minutes. Works with Claude Code CLI and Cursor IDE with zero setup required.

## Quick Start

### Claude One-Paste Quickstart
For Claude Code users. Zero setup required.

1. Open Claude Code and paste the contents of **CLAUDE_ONE_PASTE.md**
2. Type `/new-project` and answer 3 questions
3. Documentation generates under `completed-docs/<project-name>/`

### /new-project Command
**Intelligent conversation-based documentation generator for Claude Code users.**

#### Setup (One-time)
```bash
cp commands/new-project.md ~/.claude/commands/
```

#### Usage
1. **In any Claude Code conversation**, type: `/new-project`
2. **Answer 3 questions:**
   - **Starting Point:** `greenfield` (new project) or `brownfield` (existing project)
   - **Audience:** `startup`, `business`, or `enterprise`
   - **Scope:** `mvp` (4 docs), `standard` (12 docs), or `comprehensive` (22 docs)
3. **Claude automatically generates** the appropriate documentation set
4. **Files created** in `completed-docs/<your-project-name>/` with index and metadata

#### What You Get
- **MVP (4 docs):** PRD, Tasks, Project Brief, Brainstorming
- **Standard (12 docs):** Core product, technical, and UX documentation
- **Comprehensive (22 docs):** Complete enterprise documentation suite

### Cursor IDE Quickstart
For Cursor IDE users. Structured workflow integration.

1. Copy `.cursorrules/new-project.mdc` to your project's `.cursorrules/` directory
2. Use command: `@new-project "my-app" mvp`
3. Documentation generates under `completed-docs/`

### Enterprise Pipeline
For organizations requiring structured intake and governance.

```bash
make enterprise PROJECT="my-project"                    # Interactive 17-question intake
make enterprise-ci PROJECT="my-project" ANSWERS="..."   # CI/automation with fixture data
```

**Enterprise Features:**
- **17-question structured intake** with multi-input modes (interactive, file, stdin)
- **Automated header injection** with project metadata and cross-references
- **CI/CD integration** via GitHub Actions workflow
- **Governance controls** with CODEOWNERS and PR templates

### Manual Setup
```bash
git clone https://github.com/intent-solutions-io/intent-blueprint-docs.git
cd intent-blueprint-docs
make verify  # Confirms all 22 templates are ready
```

## Features

| Feature | Intent Blueprint | Traditional Tools | Manual Documentation |
|---------|------------------|-------------------|---------------------|
| **Speed** | 22 docs in minutes | Hours per document | Days/weeks |
| **AI Integration** | Claude + Cursor native | Limited AI support | No AI assistance |
| **Enterprise Quality** | Professional templates | Basic formats | Inconsistent quality |
| **Setup Complexity** | Zero dependencies | Docker/complex setup | N/A |
| **Template Coverage** | 22 comprehensive docs | 5-10 basic templates | Start from scratch |
| **Workflow Options** | 4 methods | 1-2 basic options | Start from scratch |

## Documentation Suite (22 Templates)

### Product & Strategy (5 docs)
- **PRD** - Product Requirements Document
- **Market Research** - Competitive analysis & market sizing
- **Competitor Analysis** - SWOT analysis & positioning
- **User Personas** - Target audience profiling
- **Project Brief** - Executive summary & charter

### Technical Architecture (4 docs)
- **Architecture Decision Records (ADR)** - Technical decisions & rationale
- **System Architecture** - Technical design & infrastructure
- **Frontend Specification** - UI/UX technical requirements
- **Operational Readiness** - Production deployment checklist

### User Experience (3 docs)
- **User Stories** - Feature requirements from user perspective
- **User Journeys** - End-to-end user experience mapping
- **Acceptance Criteria** - Definition of done for features

### Development Workflow (5 docs)
- **Task Generation** - Implementation breakdown
- **Task Processing** - Development workflow management
- **Risk Register** - Risk identification & mitigation
- **Brainstorming** - Ideation & concept development
- **Metrics Dashboard** - KPI tracking & analytics

### Quality Assurance (5 docs)
- **Test Plan** - Comprehensive testing strategy
- **QA Gates** - Quality checkpoints & criteria
- **Release Plan** - Deployment strategy & rollout
- **Post-Mortem** - Issue analysis & lessons learned
- **Usability Testing** - User testing protocols & playbooks

## Use Cases

- **Startup Teams** - Rapid documentation without sacrificing quality
- **Enterprise Organizations** - Standardize documentation across teams
- **Solo Developers** - Professional docs without enterprise overhead
- **Product Managers** - Comprehensive requirements gathering
- **UX Teams** - User research and journey documentation
- **DevOps Teams** - Operational readiness and deployment planning

## Directory Structure

```
intent-blueprint-docs/
├── 01-Docs/                     # All documentation (NNN-abv-description.ext format)
├── 05-Scripts/                  # Automation scripts
├── 99-Archive/                  # Archived items
├── professional-templates/      # 22 master templates (read-only)
├── .cursorrules/                # Cursor IDE integration workflows
├── commands/                    # Slash commands
├── form-system/                 # Interactive form interface
├── .github/workflows/           # CI/CD workflows
├── .directory-standards.md      # MASTER directory standards reference
├── README.md                    # This file
├── CLAUDE.md                    # AI assistant guidance
├── CHANGELOG.md                 # Version history
└── LICENSE                      # Apache 2.0 License
```

## Key Features

### AI Questioning
Asks targeted follow-up questions to extract information needed for comprehensive documentation.

### Dynamic Date Management
All templates include `{{DATE}}` placeholders for automatic timestamp insertion.

### Dual AI Workflow
- **Claude Code CLI**: Free-form input with AI deductive reasoning
- **Cursor IDE**: Structured workflows with guided prompts

### Enterprise Integration
- No vendor lock-in
- Works with existing development workflows
- Scales from solo projects to enterprise teams

## Verification & Quality

```bash
make verify      # Verify all 22 templates exist
make tree        # Show complete repository structure
```

## Optional Audits

[![Accessibility](https://github.com/intent-solutions-io/intent-blueprint-docs/actions/workflows/accessibility.yml/badge.svg)](https://github.com/intent-solutions-io/intent-blueprint-docs/actions/workflows/accessibility.yml)
[![Performance](https://github.com/intent-solutions-io/intent-blueprint-docs/actions/workflows/performance.yml/badge.svg)](https://github.com/intent-solutions-io/intent-blueprint-docs/actions/workflows/performance.yml)

Advisory-only workflows that do not block PRs.

## Governance (Enterprise)

- Enterprise-critical paths require review via [CODEOWNERS](.github/CODEOWNERS)
- All changes must pass **Enterprise E2E** workflow before merge
- Branch protection enforces linear history and conversation resolution

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

- Report issues and bugs
- Suggest new template types
- Submit documentation improvements
- Propose feature enhancements

## Roadmap

- [ ] **MCP Server** - Native Claude/Cursor tool integration
- [ ] **VS Code Extension** - Native IDE integration
- [ ] **Team Collaboration** - Multi-user project documentation
- [ ] **Custom Template Builder** - Create your own template sets
- [ ] **API Integration** - Programmatic documentation generation

## Support & Contact

- **Issues**: [GitHub Issues](https://github.com/intent-solutions-io/intent-blueprint-docs/issues)
- **Discussions**: [GitHub Discussions](https://github.com/intent-solutions-io/intent-blueprint-docs/discussions)
- **Email**: [jeremy@intentsolutions.io](mailto:jeremy@intentsolutions.io)

---

[![GitHub stars](https://img.shields.io/github/stars/intent-solutions-io/intent-blueprint-docs?style=social&label=Star)](https://github.com/intent-solutions-io/intent-blueprint-docs/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/intent-solutions-io/intent-blueprint-docs?style=social&label=Fork)](https://github.com/intent-solutions-io/intent-blueprint-docs/network/members)

**By [Intent Solutions](https://intentsolutions.io)**
