---
id: csps.adr.0023-hybrid-frontmatter-schema-universal-core-plus-per-file-type
title: ADR-0023 — Hybrid frontmatter schema (universal-required-core + per-file-type extensions)
status: accepted
date: 2026-05-04
deciders: group:finky
tags: [domain:governance, type:explanation, audience:developer, audience:ai-agent, maturity:stable]
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-1-architecture-and-stack/frontmatter-standard.md }
  - { rel: prior-adr, href: ./0014-adopt-madr-for-adr-format.md }
  - { rel: source-finding, href: ../plan/_handoff/VAULT/gaps-and-duplications-S005.md }
---

# ADR-0023 — Hybrid frontmatter schema (universal-required-core + per-file-type extensions)

## Context and problem statement

S005 §C3.4 Step C surfaced the gap when the frontmatter validator (`tools/validators/validate-frontmatter.mjs`) ran first-time on existing content: 145 errors initially, dropping to 53 after exempts, then 34 after additional exempts. **The errors revealed schema divergence:**

- **ADRs** use MADR format (id + title + status + date + deciders + tags) per ADR-0014. Universal CSPS schema requires id + name + description + version + owner. ADRs lack `name + description + version + owner` because MADR semantics map `title` → name + status → lifecycle-equivalent + date → version-equivalent.

- **SKILL.md files** use agentskills.io spec extended with CSPS dimensions (description + capability fields like `allowed_tools` / `allowed_subagents` / `sensitive_data_access`). Universal schema fields don't all apply; agentskills.io is the cross-vendor interop standard with Anthropic ecosystem.

- **AGENTS.md files** use agents.md cross-vendor spec — no frontmatter (it's the contract document, not a CSPS-indexed artifact). Per-package cascade pattern.

The skeleton-tier validator exempted these via path globs. **The decision required:** unify all to universal CSPS, formalize per-file-type schemas, or hybrid.

## Considered options

| # | Option | Pros | Cons |
|---|---|---|---|
| A | Unify to universal CSPS frontmatter (retrofit ADR + SKILL.md + AGENTS.md to add name/description/version/owner) | Single schema to validate; simpler validator | Breaks MADR conventions (status/date/deciders semantics lost as auxiliary fields); breaks agentskills.io interop (cross-vendor Anthropic ecosystem); breaks agents.md spec (cross-vendor Codex/Cursor/Windsurf); forces noise; ADR-0014 effectively superseded |
| B | Per-file-type schemas formalized in validator (universal default + MADR for ADRs + agentskills.io for SKILL.md + agents.md exempt for AGENTS.md) | Each schema appropriate to purpose; honors interop fully | Multiple schemas to maintain; risk of inconsistency in validator code; loses universal indexing minimum |
| **C** | **Hybrid: universal-required-core for ALL artifacts (id + lifecycle + lifecycle_state + tags) + per-file-type extensions on top (universal default schema + MADR augment for ADRs + agentskills.io augment for SKILL.md + agents.md skips frontmatter entirely)** | Same calibrated-middle pattern CSPS already uses (closed-tags + open-descriptors); minimum schema enforced everywhere for catalog/indexing/retrieval; per-file-type semantics preserved for interop | Slightly more complex than A; less flexibility than B for fully cross-vendor types |

## Decision outcome

**Chosen: Option C — Hybrid universal-required-core + per-file-type extensions.**

**Reasoning:** The load-bearing factor is **pattern consistency with existing CSPS schema discipline**. CSPS already uses the closed-tags-with-open-descriptors pattern (per [pillar-1/frontmatter-standard.md §`descriptors[]`](../plan/pillar-1-architecture-and-stack/frontmatter-standard.md)) — closed dimensions for indexing, open extensibility on top. Applying this same pattern recursively to frontmatter schemas is the natural shape. The hybrid:

1. **Universal-required-core** — every artifact (regardless of type) declares: `id + lifecycle + lifecycle_state + tags`. This is the catalog-indexing minimum that powers `catalog:search`, `principles://reuse-check`, frontmatter audits, governance scoring.

2. **Per-file-type extensions** — per artifact type, an additional schema is layered on top:
   - **`.md` (default)**: universal-core + `name + description + version + owner + crosscutting + diataxis_type + links + enhances|created-new-because`
   - **ADRs (`docs/adr/NNNN-*.md`)**: universal-core + `title + status + date + deciders + (optional: consulted, informed)` per MADR
   - **SKILL.md (`packages/skills/*/SKILL.md`)**: universal-core + `description + allowed_tools + allowed_subagents + allowed_outbound_hosts + allowed_db_operations + sensitive_data_access + backed_by_principle + generated_by` per agentskills.io
   - **AGENTS.md** (any directory): NO frontmatter (per agents.md cross-vendor spec) — exempt from validator at path-pattern level
   - **Snapshot/historical files** (HANDOFF-S*-to-S*.md / qc-audit-results-S*.md / validation-pass-S*.md / chat-jump-prompt-* / blockers-S*.md / gaps-and-duplications-S*.md / VAULT/insights.md / `_legacy/`): universal-core only (snapshot semantics; auxiliary fields not enforced)
   - **Auto-generated transient outputs** (tools/verify-last-run.md / tools/bootstrap-readiness.md): exempt entirely

**What would flip the recommendation:** if cross-vendor interop becomes more important than internal indexing (e.g., shipping CSPS skills to Anthropic Claude Plugin Marketplace; Cursor team imports CSPS AGENTS.md), Option B would dominate — pure per-file-type with no universal core. Current priority is internal coherence; C stands.

## Consequences

**Validator changes (week-2 + week-4 implementation; this ADR commits the design):**

`tools/validators/validate-frontmatter.mjs` evolves from skeleton-tier (current: shallow YAML parser + universal-core-only check + path-glob exempts) to:

1. **File-type detection by path pattern** (e.g., `docs/adr/NNNN-*.md` → `adr`; `packages/skills/*/SKILL.md` → `skill`; default → `md`)
2. **Universal-core schema enforced for all non-exempt types** (id + lifecycle + lifecycle_state + tags)
3. **Per-file-type schema layered on top** (additional required fields per type)
4. **Exempt list shrinks** as ADR + SKILL.md retrofits complete with universal-core fields

**Retrofits required (carry-forward to S006+):**

- **22 ADRs** — currently lack universal-core `id + lifecycle + lifecycle_state` (have `id` only via title-line pattern). Add via codegen-fresh check: every ADR adds `lifecycle: production + lifecycle_state: active` plus `tags`. Effort: ~20 min mechanical batch via codegen.
- **5 SKILL.md files** — already declare `lifecycle + lifecycle_state` per agentskills.io extension; need verification that `id + tags` are populated. Effort: ~10 min audit.
- **`validate-frontmatter.mjs` — week-2 evolution to multi-schema**. Effort: ~1-2 hr.

**Audit additions (registered atomically per FSE amendment):**

- `frontmatter-per-file-type-schema-coverage` (PR-blocking error; week-4): for each artifact, validates against the appropriate per-file-type schema after universal-core check passes.
- `frontmatter-universal-core-completeness` (PR-blocking error; planned week-2 codegen): every non-exempt artifact has all 4 universal-core fields.

**Forward-prevention:**

- New artifacts created S006+ declare universal-core + appropriate per-file-type extension at creation time (per generator templates updated week-3)
- Schema split is now formalized; no more skeleton-tier ad-hoc exempts

## Enforcement

- `pillar-1/frontmatter-standard.md` updated with hybrid spec (carry-forward to S006 §C3.6 — text update accompanies validator implementation)
- `tools/validators/validate-frontmatter.mjs` ratchets to multi-schema (week-2)
- `audit-runner.md` registers 2 new audits atomically per FSE amendment
- `principles.yaml` cross-references this ADR from frontmatter-standard enforcer set

## Sources

- `docs/plan/_handoff/VAULT/gaps-and-duplications-S005.md` §C3.1 secondary finding (skeleton-tier validator surfaced 34 errors revealing schema split)
- `docs/plan/pillar-1-architecture-and-stack/frontmatter-standard.md` (universal CSPS spec)
- `docs/adr/0014-adopt-madr-for-adr-format.md` (MADR adoption — preserved as auxiliary on top of universal core)
- [agents.md spec](https://agents.md/) (cross-vendor; no-frontmatter convention)
- [agentskills.io spec](https://agentskills.io/) (Anthropic ecosystem)
- ADR-0011 pillar architecture (closed-tags + open-descriptors pattern reused recursively)
