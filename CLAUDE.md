# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## System Overview

**Intent Blueprint Docs** is an enterprise-grade AI documentation generator that creates 22 professional documents from project ideas. It provides dual AI assistant integration (Claude Code CLI and Cursor IDE) with guided prompts for users of all skill levels.

**Release:** v1.0.9 - Enterprise Documentation Pipeline
**Template Count:** 22 verified templates with {{DATE}} placeholders

## Task Tracking (Beads)

```bash
bd ready                                    # Start of session
bd create "Title" -p 1 --description "..."  # Create work
bd update <id> --status in_progress         # Claim task
bd close <id> --reason "Done"               # Complete task
bd sync                                     # End of session (git sync)
```

After `bd` upgrades: `bd info --whats-new` and `bd hooks install` if warned.

## Development Commands

```bash
# Template verification
make verify                     # Verify 22 templates exist
make tree                       # Show repository layout

# Enterprise pipeline
make enterprise PROJECT="name"              # Interactive 17-question intake
make enterprise-ci PROJECT="name" ANSWERS="..."  # CI/automation mode

# Form system
node form-system/cli.js         # Interactive form interface
```

## Directory Structure

```
├── 01-Docs/                    # Documentation (NNN-abv-description.ext format)
├── 05-Scripts/                 # Automation (export.js, verify-templates.sh, run-enterprise.mjs)
├── 99-Archive/                 # Archived items
├── professional-templates/     # 22 master templates (READ-ONLY)
├── form-system/                # Interactive CLI tools
├── .cursorrules/               # Cursor IDE integration (4 rule files)
├── commands/                   # Slash commands (new-project.md)
├── .github/workflows/          # CI/CD (enterprise-e2e.yml, ci.yml, template-validation.yml)
└── .directory-standards.md     # Master naming/structure reference
```

## Workflows

### Claude Code CLI (One-Paste)
```
Create a new folder in completed-docs/ named after my project, then generate all 22 docs using the templates in professional-templates/. Ask me for a single free-form project summary. Use deductive reasoning to fill gaps. Output all final docs into completed-docs/<my-project>/ and include an index.md summarizing what was generated and any assumptions.
```

### Cursor IDE
```
Use @.cursorrules/01-create-prd.mdc
Here's my feature: [describe it]
```
Follow steps 2-4 in `.cursorrules/` for structured workflow.

### Enterprise Pipeline
17-question structured intake with governance controls, CODEOWNERS protection, and CI/CD integration.

## Critical Rules

1. **Templates are READ-ONLY** - Never modify `professional-templates/` files
2. **Follow directory standards** - Use `.directory-standards.md` for naming (`NNN-abv-description.ext`)
3. **Store docs in 01-Docs/** - All documentation goes there
4. **Generated docs go to completed-docs/** - Not in professional-templates/

## Architecture Notes

- **22 templates** in `professional-templates/` with `{{DATE}}` placeholders for dynamic date insertion
- **Dual AI support** - Claude Code CLI (free-form) and Cursor IDE (structured)
- **Enterprise E2E** validated via GitHub Actions
- **Node.js required** for form-system and enterprise scripts

## GitHub

- **Repo:** https://github.com/intent-solutions-io/intent-blueprint-docs
- **Org:** Intent Solutions
