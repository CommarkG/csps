---
id: csps.know-how.error-patterns.ep-006
name: code-quality-blind-spot
description: Language-level bugs (ESM require, wrong return types, undefined variables) in newly authored tools not caught until the tool is exercised
severity: HIGH
first_seen: S011
recurrence_count: 1
source_sessions: [S011]
applies_to: [validator-authoring, tool-authoring]
prevention_checklist_item: "Every new .mjs file must: (1) pass node --check, (2) pass TypeScript compiler if applicable, (3) be smoke-tested with a real invocation before committing."
root_cause: |
  pe-compute.mjs used `const { statSync } = require ? undefined : null` which is
  broken in ESM context (require is undefined; code always falls into catch block;
  mtime-based cache invalidation never worked). The tool was committed and wired
  into verify without the cache path being exercised in tests.
symptoms: |
  - Tool appears to work but silently fails on edge cases
  - mjs_syntax_check passes but runtime behavior is wrong
  - Cache never hits; performance optimization never materializes
fix: |
  Import statSync from 'node:fs' directly. Use proper ESM imports.
  For cache: add mtime_ms to cache write AND read paths, test both.
mechanical_prevention: |
  mjs_syntax_check (ACTIVE in pnpm verify) — catches syntax errors but not logic bugs.
  BEHAVIORAL: every new .mjs smoke-test with actual inputs before committing.
  CHECKLIST item in pre-plan-close.md: "Run smoke test on every new .mjs file."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: know_how_error_patterns
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
---

# EP-006 — Code Quality Blind Spot

**Pattern:** ESM/language bugs in newly authored tools committed without being smoke-tested with real inputs.

**Why it happens:** The AI focuses on whether the code "looks correct" and passes syntax checks. Runtime behavior on edge cases (cache hits, async flows, ESM restrictions) is not systematically tested.

**Prevention checklist item:**
> For every new .mjs file: (1) `node --check <file>` PASS, (2) `node <file> --help` or minimal invocation with real args PASS, (3) exercise at least one non-trivial code path. No .mjs commits without step 2.
