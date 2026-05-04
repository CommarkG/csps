---
id: csps.packages.glossary
name: glossary
description: Single source of truth for CSPS vocabulary (canonical terms + aliases + reject list). Codegens Vale prose dict + ESLint id-denylist + Payload select options + ZModel @@meta. Per P-ARCH-004 + P-ARCH-016 + ADR-0013 (rename cool names to industry-standard).
version: 0.0.1
owner: group:finky
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
links:
  - { rel: parent, href: ../README.md }
  - { rel: spec, href: ../../docs/plan/pillar-1-architecture-and-stack/vocabulary.md }
created-new-because: |
  Per P-ARCH-004 + P-ARCH-016: vocabulary needs a single source-of-truth file that codegens
  downstream artifacts (Vale dict, ESLint denylist, Payload options, ZModel @@meta). glossary.yaml
  is that file; codegen lands week-2.
---

# @csps/glossary

Canonical CSPS vocabulary. Codegen pipeline emits Vale + ESLint + Payload + ZModel artifacts from this single source.

## Skeleton tier

Seed `glossary.yaml` ships with 12 canonical terms covering platform / app / slice / module-folder / persona / agent / skill / bundle / customer-kit / template / graduation / tier. Week-2 codegen emits downstream.

## Audit composition

- `vale-prose` (PR; warn): linter against this dict's reject list
- `eslint-naming` (PR; error): id-denylist from this dict
- `db-column-vs-glossary` (PR; error): every DB column resolves to a canonical term
- `glossary-codegen-fresh` (PR; error): regenerated artifacts must match committed
