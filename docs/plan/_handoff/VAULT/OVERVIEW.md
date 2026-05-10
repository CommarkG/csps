---
id: csps.handoff.vault.overview
name: OVERVIEW
description: CSPS platform overview — the canonical entry-point for understanding platform state. Single file; BLUF-formatted; self-contained; clickable GitHub URLs to canonical sources. Always-current (per naming-policy Rule 1; version tracked in frontmatter). Read in ~3 minutes for full picture. Token-optimal by design — tables over prose, lazy-loaded references, audience-routing matrix. Renamed from quick-context-S006-L1.md (S006 turn 24) → quick-context.md (turn 24 partial fix) → OVERVIEW.md (turn 25 full fix per industry-standard vocabulary rule). Industry-standard "OVERVIEW" replaces invented "quick-context" term.
version: 3.1
last_update_session: S011
last_update_turn: S011-24pp-close
last_update: S011-CLOSE-PHASE9-ADDENDUM
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: registry-canonical
template_status: novel-pending-pattern-evaluation
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, OPER, VALD]
schema_anchor: quick_context_entry_point
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: handoff, href: ../HANDOFF-S010-to-S011.md }
  - { rel: closed-topic-plan, href: ./topic-plans/s006-governance-foundation.md }
  - { rel: core-manifest, href: ../../pillar-0-governance/csps-core-manifest.md }
  - { rel: master-plan, href: ../../../../MASTER_PLAN.md }
session: S006
generated_at: 2026-05-05T15:44:00Z
domain_path: platform
---

# CSPS Overview

> **Canonical entry-point for the platform.** Read this in ~3 minutes for the full picture. Always-current — filename stable across sessions per [naming-policy.md](../../pillar-0-governance/naming-policy.md). Version + last-update tracked in frontmatter.
>
> **Latest update (S011-close + §24++ Phase 9 addendum):** S011 delivered Phase 8 COMPLETE (principles-mcp slice-reading; ~200 tokens/principle vs 85K monolith; CCA Layer 4 activated) + Phase 9 COMPLETE (validate-token-budget.mjs 5-mode + pe-compute.mjs PE.read_budget + schema-index.md 24 rows + validate-corespine-depth-markers + 8 context-loading templates + 5 L1_CORE backfilled). pnpm verify: 11 active validators PASS. S012 PRIMARY = Phase 10 activation.

## (S008-S010 Platform-Acceleration Arc — CURRENT STATE)

**S008 (CSP DNA Absorption + Foundation Leaves):**

| Surface | S007 close | S008 close | Δ |
|---|---|---|---|
| Principles validated | 53 | 53 | 0 |
| B_* contracts | 27 | 27 | 0 (disciplines engraved at leaf level; no new B_* rows) |
| New canonical leaves | — | **+3** | plan-creation-protocol.md + context-loss-pains.md + csps-platform-dna.md |
| EXT IDs cataloged | 0 | **11 (55 sub-IDs)** | CSP DNA absorption — 5 CSP files + edge-case note |
| Memory entries | 42 | **48** | +6 (weekly-audit + diff-protect + plan-protocol + depth + consolidation + savings) |
| Hook stubs | 2 | **5** | +3 (depth-marker-gate + consolidation-pass + savings-ssot-coverage) |
| pnpm verify | exit 0 | exit 0 | stable |

**S009 (Foundation-First Batch — L1.1→L1.6):**

| Surface | S008 close | S009 close | Δ |
|---|---|---|---|
| Principles validated | 53 | 53 | 0 (B_SAVINGS_AND_SSOT_UNIFIED extends P-META-009; no new row) |
| B_* contracts | 27 | **29** | +2 (B_CONSOLIDATION_PASS + B_SAVINGS_AND_SSOT_UNIFIED) |
| LIVE templates | 8 | **8** | +1 governed-artifact-frontmatter (counted S009; 8 total pre-S010) |
| New canonical leaves | — | **+2** | depth-discipline.md + model-routing-dashboard.md |
| Audit registry slugs | ~146+ | **~155+** | +9 (4 depth-discipline + 2 B_CONSOLIDATION_PASS + 2 B_SAVINGS_AND_SSOT_UNIFIED + 1) |
| PCR decisions ratified | — | **4** | Q1=A Q2=B Q3=A Q4=B (Step 0) |
| Memory entries | 48 | **52** | +4 |
| pnpm verify | exit 0 | exit 0 | stable |

**S010 (Platform-Acceleration — Phase 6 + Phase 7 ALL 4 + Lever 1):**

| Surface | S009 close | S010 close | Δ |
|---|---|---|---|
| Principles validated | 53 | **53** | 0 |
| B_* contracts | 29 | **29** | 0 (B_AAP 7→9 = extension; not new B_*) |
| LIVE templates | 8 | **9** | +1 class-b-agent-spawn-preamble.template.md |
| Slice files | 0 | **130** | +130 (53 principles + 39 contracts + 28 audit-runner + 10 ai-behavior-spine) |
| Sync validators (active) | 0 | **4** | principle + contract + audit-runner + ai-behavior-spine slices |
| Registered audit slugs | ~155+ | **~163+** | +6 (4 slice-sync + model-routing-profile-consistency + aap-9-field-coverage) |
| settings.json hooks | 0 | **15 LIVE** | 12/12 stubs promoted + 3 active; all verified UserPromptSubmit |
| Model-routing profiles | 0 | **3** | development-balanced DEFAULT / quality-first / cost-optimized |
| Session default model | manual | **Sonnet[1m]** | Lever 1 — settings.json "model" field |
| Split generators | 0 | **4** | split-principles + split-behavioral-contracts + split-audit-runner + split-ai-behavior-spine |
| Memory entries | 52 | **53** | +1 (feedback_aap_9_field_extension.md) |
| Commits S010 | — | **7** | Phase 6 + Lever1/dashboard + Phase 7 ×4 |
| pnpm verify | exit 0 | **exit 0** | stable; all 9 active validators PASS |

**Aggregate S008-S010 (3 sessions, 2026-05-05):**
- Platform went from monolith-loading to slice-loading architecture in ONE session arc
- Every future AI session loads only the slice(s) it needs (130 files → O(1) context cost vs O(N))
- 15 hooks LIVE — every chat auto-validates governance at UserPromptSubmit + PostStop
- model-routing-dashboard.md + Lever 1 = Governor-level controls on AI session cost

**Verify state at S010 close:** pnpm verify exit_code 0; 9 active cycles PASS; ZF achieved. Commit [371bcdc](https://github.com/CommarkG/csps/commit/371bcdc) — S010 CLOSE.

---

## (S007 Token-Optimization Phases 1-4 Close — context for prior state)

**S007 close metrics (Δ vs S006 close):**

| Surface | S006 close | S007 close | Δ |
|---|---|---|---|
| Principles validated | 53 | 53 | 0 (P-META-009 EXTENDED via subsection; no new principle) |
| B_* contracts | 26 | **27** | +1 (B_TOKEN_BUDGET) |
| AGENTS.md hard NOs | 48+ | **50+** | +2 |
| AGENTS.md size (lines/words) | 206 / 6001 | **143 / 1377** | -30.6% lines / -77% words |
| Audit registry slugs | ~140+ | **~146+** | +6 (5 token-budget + 1 closed-enum-drift-prevention) |
| Topic-plans active | 0 | **1** (token-optimization Phases 1-4 done; Phase 5 next) | +1 |
| Element-reviews | 1 | **2** (+token-optimization-S007) | +1 |
| `.claude/skills/` SKILL.md (Claude Code auto-load) | 0 | **9** | NEW |
| Tools (measurement) | 0 | **1** (`tools/measure-token-cost.mjs`) | NEW |
| Scenario JSONs | 0 | **8** | NEW |
| `.claudeignore` | absent | **present** | NEW |
| Hook stubs | 0 | **2** | NEW |
| Memory entries | 40 | **42** | +2 |
| Pillar-0 leaves | csps-core-manifest + naming-policy + token-optimization | **+ frontmatter-closed-enums** | +1 |
| First measured savings | n/a | **5.7% aggregate** (565K → 532K tokens) | empirical baseline anchored |
| Commits this session | 14 (S006) | **6** (S007: 5 phases + close) | (per-session) |

## (S006 Governance-Foundation Close — context for prior state)

> **Read this file (~3 min) for full platform picture.** All references clickable GitHub URLs. Self-contained.

---

## What CSPS is (BLUF — 30 seconds)

**Core Sights Platform Solutions (CSPS)** is a meta-platform for building 30 multi-tenant SaaS apps from a shared customer-kit + slice-based architecture. AI-native: every artifact passes governance gates (5/5 surface engraving, zero-findings discipline, audit-runner validators). Built solo + AI-pair-programmed via Claude Code; runtime is Vercel + Cloudflare hybrid + Supabase backend. Repo: [github.com/CommarkG/csps](https://github.com/CommarkG/csps).

**Cardinal directives (S005 + S006):**
- *"What is not mechanically enforced is just a temp fix."* (S005 turn 23)
- *"The Core is the universal fundamental undebatable things of each core spine."* (S006 turn 7)
- *"Enhance the system constantly; never settle for low standards + manual recovery."* (S006 turn 8)
- *"I trust you to do all in optimal way as a top expert focused on building in optimal order so all you do will be supporting the next steps."* (S006 turn 10)

---

## Architecture in 3 layers

### 1. CORE — 5 Core Spines (universal undebatable; precedence: GVRN > VALD > ARCH > AI > OPER)

| Spine | Domain | CORE rules |
|---|---|---|
| **GVRN** | Governance | Principles registry / 5/5 FSE / atomic validator registration / ZF cycle / MUV / Governor Prompts / HPFA / 4 CCA Quality Gates |
| **ARCH** | Architecture | Slice contract / ZModel + RLS + tenant_id ubiquity / monorepo + Nx + Hygen / template-first / customer-kit primitives |
| **AI** | AI Systems | Mastra BaseAgent / AAP 9-check / CCA 4 QGs / persona prompts / CSPS-alignment-over-inner-defaults / PE_ALIGNMENT_GUARDIAN |
| **OPER** | Operations | Build-order / Vercel+Cloudflare hybrid / observability / dependency mgmt / Governor Prompts / HPFA / Zero-Laptop-Dependency |
| **VALD** | Validation | ZF discipline / audit-runner / `pnpm verify` orchestrator / RZF + CEC + HPFA / validate-before-assume |

**3-layer doctrine model (S006 close):**
- **L0 root:** [csps-core-manifest.md](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-0-governance/csps-core-manifest.md) — children=[GVRN, ARCH, AI, OPER, VALD]; ADR amendment
- **L1 sealed × 5:** [.claude/core-spines/L1_CORE_*.md](https://github.com/CommarkG/csps/tree/main/.claude/core-spines) — sealed text + do_not_expand; CC-equivalent amendment
- **L2 domain × 16:** L2_DOMAIN_*.md (3-4 per spine; normal review)
- **L3 instances × 5:** L3_INSTANCES_*.md (per-session edit; populator script week-4)

### 2. PILLARS — 7 domain-organized navigation surfaces (orthogonal to spines)

| Pillar | Primary spine | Secondary |
|---|---|---|
| [pillar-0-governance](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-0-governance/README.md) | GVRN | VALD |
| [pillar-1-architecture-and-stack](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-1-architecture-and-stack/README.md) | ARCH | GVRN |
| [pillar-2-data-and-schema](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-2-data-and-schema/README.md) | ARCH | GVRN, VALD |
| [pillar-3-platform-services](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-3-platform-services/README.md) | ARCH | OPER |
| [pillar-4-developer-experience](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-4-developer-experience/README.md) | OPER | GVRN, VALD |
| [pillar-5-ai-systems](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-5-ai-systems/README.md) | AI | GVRN, OPER |
| [pillar-6-operations-and-delivery](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-6-operations-and-delivery/README.md) | OPER | VALD, GVRN |

### 3. SCHEMA — single source of truth

- Principle registry: [packages/principles/principles.yaml](https://github.com/CommarkG/csps/blob/main/packages/principles/principles.yaml) (53 principles validated 0 findings) + [53 slice files](https://github.com/CommarkG/csps/tree/main/packages/principles/principles/) (P-XXX-NNN.yaml — load only what you need)
- Audit registry: [audit-runner.md](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-0-governance/audit-runner.md) (~163+ audits) + [28 pipeline slices](https://github.com/CommarkG/csps/tree/main/docs/plan/pillar-0-governance/audit-runner/)
- Audit-hub orchestration: [audit-hub.md](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-0-governance/audit-hub.md) (10 pipelines; Pipeline 10 = csps-alignment)
- Behavioral contracts: [behavioral-contracts.md](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-0-governance/behavioral-contracts.md) (29 B_* contracts) + [39 slice files](https://github.com/CommarkG/csps/tree/main/docs/plan/pillar-0-governance/behavioral-contracts/) (B_NAME.md — load only what you need)
- AI behavior spine: [ai-behavior-spine.md](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-0-governance/ai-behavior-spine.md) + [10 section slices](https://github.com/CommarkG/csps/tree/main/docs/plan/pillar-0-governance/ai-behavior-spine/)
- Frontmatter schema: [ADR-0023](https://github.com/CommarkG/csps/blob/main/docs/adr/0023-hybrid-frontmatter-schema-universal-core-plus-per-file-type.md)
- Template registry: [template-registry.md](https://github.com/CommarkG/csps/blob/main/docs/plan/_handoff/VAULT/template-registry.md) (9 LIVE templates)
- Model-routing dashboard: [model-routing-dashboard.md](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-0-governance/model-routing-dashboard.md) (3 configuration profiles; §10 developer-controls)
- Inner-AI-defaults registry: [inner-ai-defaults/](https://github.com/CommarkG/csps/tree/main/docs/plan/_handoff/VAULT/inner-ai-defaults) (5 categories + continuous-drift-log)

---

## S006 governance-foundation topic-plan — CLOSED

**Topic:** [s006-governance-foundation.md](https://github.com/CommarkG/csps/blob/main/docs/plan/_handoff/VAULT/topic-plans/s006-governance-foundation.md) (depth-5; CLOSED 2026-05-04T21:00:00Z)

**Disciplines engraved 5/5 atomic per FSE:**

| # | Discipline | Spine | FSE Status |
|---|---|---|---|
| 1 | P-META-015 / B_TEMPLATE_FIRST_CREATION | GVRN | 5/5 atomic; 3/5 active-mechanical |
| 2 | P-META-016 / B_GRADUAL_BUILD_BY_FOUNDATIONS | OPER | 5/5 atomic; 3/5 active-mechanical |
| 3 | P-META-017 / B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS | AI | 5/5 atomic; 3/5 active-mechanical |
| 4 | P-META-018 / B_PE_ALIGNMENT_GUARDIAN | AI | 5/5 atomic; 3/5 active-mechanical (CONSTITUTIONAL) |
| 5 | P-META-019 / B_STRUCTURAL_PREVENTION_DISCIPLINE | GVRN | 5/5 atomic; 3/5 active-mechanical |
| 6 | P-ARCH-028 / B_CORE_SPINE_DISCIPLINE | ARCH | 5/5 atomic + L1_CORE × 5 + L2_DOMAIN × 16 + L3_INSTANCES × 5 |
| 7 | P-OPER-001 / B_ZERO_LAPTOP_DEPENDENCY | OPER | 5/5 atomic; 3/5 active-mechanical |

**S006 close metrics:**

| Metric | S005 close | S006 close | Δ |
|---|---|---|---|
| Principles validated | 45 | **52** | +7 |
| Core Spines (NEW concept) | 0 (implicit) | **5 explicit + 3-layer doctrine** | NEW |
| ADRs | 24 | 24 | 0 (ADR-0025 candidate queued) |
| B_* contracts | 18 | **25** | +7 |
| AGENTS.md hard NOs | 36+ | **48+** | +12 |
| Audit registry slugs | ~129 | **~140+** (+27 new in Pipeline 10) | +27 |
| Audit-hub pipelines | 9 | **10** (+csps-alignment) | +1 |
| Active-mechanical `pnpm verify` cycles | 5 | 5 | 0 |
| Template registry entries | 0 | **30+** | NEW |
| LIVE templates authored | 0 | **5** (gradual-build-plan + chat-jump-prompt + b-star-contract + memory-entry + audit-row) | NEW |
| Topic-plans | 0 | **2** (governance-foundation CLOSED + zero-laptop-dependency-setup OPEN) | NEW |
| Element-reviews | 0 | **1** (csps-core-spines-S006) | NEW |
| Sealed L1_CORE files | 0 | **5** | NEW |
| L2_DOMAIN files | 0 | **16** | NEW |
| L3_INSTANCES files | 0 | **5** | NEW |
| Memory entries | 28 | **38** (+10 disciplines + meta) | +10 |

**Verify state at close:** `pnpm verify` exit_code 0; 5 active-mechanical cycles all PASS; ZF achieved.

---

## All S006 commits

| Commit | Scope |
|---|---|
| [eb4c958](https://github.com/CommarkG/csps/commit/eb4c958) | L1 partial — Core Spines manifest + template registry + inner-AI-defaults skeleton + PE schema |
| [51c0354](https://github.com/CommarkG/csps/commit/51c0354) | L1 close — governance-foundation L1 complete + zero-laptop-dependency sibling + Q-2 tweak |
| [3fb0758](https://github.com/CommarkG/csps/commit/3fb0758) | CSP Core Spine guide absorption + first element-review |
| [309ac94](https://github.com/CommarkG/csps/commit/309ac94) | L2a — 7 new principles to YAML registry (52 validated 0 findings) |
| [22591d4](https://github.com/CommarkG/csps/commit/22591d4) | L2b — 7 contracts + 12 AGENTS NOs + 7 spine rows + 27 audits atomic per FSE |
| [41b64f2](https://github.com/CommarkG/csps/commit/41b64f2) | L2c — 5 sealed L1_CORE doctrine files (closes 5/5 FSE for all 7 disciplines) |
| [63faaf5](https://github.com/CommarkG/csps/commit/63faaf5) | L3 — audit-hub Pipeline 10 + 4 highest-leverage templates LIVE |
| [1106876](https://github.com/CommarkG/csps/commit/1106876) | L4 — 16 L2_DOMAIN + 5 L3_INSTANCES (3-layer doctrine model COMPLETE) |
| (this commit) | L4b + L5 + governance-foundation CLOSURE attestation |

---

## How to use this file (audience-routing)

| Audience | Read order |
|---|---|
| **New AI session opening cold** | This file → [HANDOFF-S010-to-S011.md](https://github.com/CommarkG/csps/blob/main/docs/plan/_handoff/HANDOFF-S010-to-S011.md) §0 → [closing-summary-S010.md](https://github.com/CommarkG/csps/blob/main/docs/plan/_handoff/VAULT/closing-summary-S010.md) §10.0 state delta → proceed with S011 work |
| **New human contributor** | This file → [csps-core-manifest.md](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-0-governance/csps-core-manifest.md) → pillar READMEs of interest |
| **Auditor / vendor-risk reviewer** | This file → [audit-hub.md](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-0-governance/audit-hub.md) → [csps-core-manifest.md](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-0-governance/csps-core-manifest.md) §"Mechanical enforcement" |
| **Returning developer** | This file → [closed topic-plan](https://github.com/CommarkG/csps/blob/main/docs/plan/_handoff/VAULT/topic-plans/s006-governance-foundation.md) §11 + carry-forwards-to-S007 |

---

## What's next (S011+)

**S011 PRIMARY carry-forwards (per HANDOFF-S010-to-S011):**

1. **Phase 8 — principles-mcp upgrade** (S011 PRIMARY): upgrade `packages/principles-mcp/src/index.ts` from skeleton to slice-reading + 4 query methods (`principles.get` / `principles.list` / `principles.find_by_enforcer_layer` / `principles.find_by_spine`). Exit: build PASS + per-query token cost <5K.
2. **Deep sanity QC + alignment checks + local fixes** (GP-S010-07 cardinal): full platform scan — frontmatter, B_* contract alignment, dead-reference detection, AAP coverage. Fix findings inline.
3. **CEC walk** — extract S010 essence → propagate across AI behavior + model-routing + agent alignment.
4. **OVERVIEW.md** — this update ✅ (K1_S010-1 resolved).
5. **16 SKILL.md AAP 9-field backfill** — principle_compliance + consolidation_cross_refs (Phase 1 OPTIONAL; S011 S.L.A.).
6. **CronCreate weekly-tag-status-deep-audit** — pending since S008 turn 8.
7. **Phase 9** (S011 if context / S012): context-loading templates × 8 + `validate-token-budget.mjs`.
8. **Phase 10** (S012/S013): continuous validation engine — depends on Phase 9.
9. **Foundation slices week-2** — User / Tenant / AuditEvent (parallel candidate; S011 or S012).
10. **ADR-0025 CNST/GVRN split** — multi-session arc; blocked on ADR ratification.
11. **Week-4 audit-runner ship** — ~163+ deferred validators; build-order week-4.

**Hard rules from S010 (NEW — all S011+ sessions must respect):**
- Never load behavioral-contracts.md monolith when only 1 B_* needed — use slice `behavioral-contracts/B_NAME.md`
- Never load principles.yaml monolith when only 1 principle needed — use `principles/principles/P-XXX-NNN.yaml`
- Never edit slice files directly — edit monolith + run `pnpm <source>:split`
- New SKILL.md must use 9-field AAP shape (csps_aligned + 6 existing + principle_compliance + consolidation_cross_refs)

---

## Token-optimization rationale

This file is the **token-optimal entry point** for any AI/human consuming CSPS state at governance-foundation close. Achieved by:

1. **Single-file fetch** — no chained references needed for "what is CSPS now"
2. **BLUF format** — answer first, structure second, details linked
3. **Tables over prose** — structured info compressed
4. **Clickable GitHub URLs** — readers fetch only what they need
5. **Diataxis-typed reference** — predictable shape for repeat readers
6. **CSPS-DNA-aligned:**
   - Frontmatter (id / lifecycle / core_spines / schema_anchor / template_used)
   - Core Spines explicit (vs implicit)
   - No-narration (BLUF; no "let me explain...")
   - PCR not needed (this is reference, not decision)
   - No sycophancy
7. **Audience-routing** — read-order matrix per consumer type
8. **All commits cross-linked** — full provenance chain visible

For absolute-shortest-context: read just §"What CSPS is" (30 seconds) + §"S006 close metrics" → know enough to ask informed questions.

**Target read time: 3 minutes. Word count: ~1,800. Information density: ~18× a typical handoff §A.**

---

**Quick-context signature:** `S011-AI-quick-context-2026-05-05T15:44:00Z-platform-acceleration-arc-close`
