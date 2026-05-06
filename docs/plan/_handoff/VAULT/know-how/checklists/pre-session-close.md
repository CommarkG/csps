---
id: csps.know-how.checklists.pre-session-close
name: pre-session-close-checklist
description: Mandatory gate before session close §17 attestation. Extends protocols.md §10 with know-how-derived items. Every item is an observed gap from real sessions.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: know_how_checklists
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
---

# Pre-Session-Close Checklist

> Complete BEFORE §17 attestation. Combines protocols.md §10 with know-how improvements.

## Standard protocol gates (protocols.md §10)

- [ ] `pnpm verify --skip-install` exit_code 0 — paste structured output into §10.0
- [ ] §10.0j enhancement-proposals scanned — K=2 recurring → mandatory engraving NOW
- [ ] §10.13b catches engraved (every observed gap has a persistent artifact)
- [ ] HPFA 9 checks complete
- [ ] governor-prompts log up to date

## Know-how additions (EP-derived)

### Stale artifact check (→ EP-001)
- [ ] Run `node tools/validators/validate-session-artifact-sync.mjs` — must exit 0
- [ ] If any Phase N was completed this session: HANDOFF §B4 + closing-summary + chat-jump all updated

### Orphan plan check (→ EP-002)
- [ ] Run `node tools/validators/validate-topic-plan-progress.mjs` — must exit 0
- [ ] No active topic-plans with expired arcs unless §11 attestation is present

### Registration completeness (→ EP-003)
- [ ] Run `node tools/validators/validate-audit-slug-coverage.mjs` — 0 orphans
- [ ] Every new validator this session: slug registered in audit-runner.md

### Catch-to-pattern completeness (→ EP-015 + EP-016 — CRITICAL)
- [ ] Run `node tools/validators/validate-catch-completeness.mjs` — 0 unmatched catches
- [ ] Every problem identified this session has produced: EP-NNN entry + §KH DON'T item + AGENTS.md hard NO (if AI behavior) + validator stub
- [ ] ANY chat transfer prepared this session used `tools/templates/chat-transfer-protocol.template.md` (EP-016 prevention)
- [ ] No problem was "fixed locally and skipped pattern extraction" — check §10.13b list vs EP count

**This is the hardest checklist item** — EP-015 (satisfaction point) fires here. AI fixes the instance and forgets the pattern. Mechanical proof: `node tools/validators/validate-catch-completeness.mjs` must exit clean.

### Post-close addendum discipline (→ EP-004)
- [ ] If any work was done after prior §17 attestation: §24++ addendum section in closing-summary
- [ ] All post-close prompts have GP-S<NNN>-<NN> entries

### Governor prompt coverage (→ EP-007)
- [ ] Count user turns this session (substantive prompts)
- [ ] Count GP entries in governor-prompts/S<NNN>.md
- [ ] GP count ≥ substantive prompt count

### Code quality gate (→ EP-006)
- [ ] Every new .mjs authored this session: smoke-tested with real invocation
- [ ] No require() in ESM .mjs files
- [ ] TypeScript compiles: pnpm -r typecheck exit_code 0

### Know-how extraction (learning loop)
- [ ] §10.0j enhancement-proposals: classify each into EP-NNN category or create new EP
- [ ] If new EP created: add to know-how/error-patterns/EP-NNN.md
- [ ] If EP-NNN is K=2 (second occurrence): promote to B_* contract or P-META amendment

## Evidence block
```
session_close_know_how_gate:
  ran_at: <iso>
  stale_artifact_sync: PASS (exit 0)
  orphan_plan_check: PASS (exit 0)  
  audit_slug_coverage: PASS (0 orphans)
  gov_prompts_coverage: <N> prompts / <N> GP entries
  new_eps_created: <N>
  k2_promotions: <N>
```
