---
id: csps.template.mini-tree-intro
name: mini-tree-intro
description: Template for the intro+index file of a mini-tree split. The intro+index is the canonical entry point for a domain that has been split into sub-files. It provides context, purpose, links to all sub-files, and the audit trail. Sub-files can be stubs (frontmatter + description + ≥1 link).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_status: stable
core_spine: GVRN
schema_anchor: templates
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
mini_tree_root: true
links:
  - { rel: pattern, href: ../../docs/plan/pillar-0-governance/mini-trees-pattern.md }
  - { rel: validator, href: ../validators/validate-file-complexity.mjs }
---

# [Domain Name] — Overview

> [One sentence: what this domain covers and why it exists as a mini-tree]

## What this covers

[2-3 sentences of context. Why was this split? What is the coherent domain?]

## Sub-files

| File | Covers | Status |
|---|---|---|
| [sub-file-1.md](./sub-file-1.md) | [one sentence] | draft/active |
| [sub-file-2.md](./sub-file-2.md) | [one sentence] | draft/active |

## Status and audit trail

- **Last reviewed:** [date]
- **Split rationale:** exceeds dual-gate threshold (>300 lines AND ≥3 distinct semantic sections)
- **Session created:** S[NNN]

## How to use this tree

1. Read this intro for context and orientation
2. Navigate to the specific sub-file for detailed content
3. Sub-files are self-contained but cross-reference this intro

---

*Template: mini-tree-intro.template.md — per platform-core-alignment.md L2*
*Dual-gate threshold: >300 lines AND ≥3 distinct semantic sections*
*Stub sub-files: frontmatter + description + ≥1 link (satisfies nothing-stands-alone)*
