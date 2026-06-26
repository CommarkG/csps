---
id: csps.handoff.opus-S089-synergy-ux-report-master-plan
name: OPUS-S089-SYNERGY-UX-REPORT-MASTER-PLAN
description: >
  Decomposition + PE-ranked plan for the S089 mega-directive: UX/UI principles enhancement + page,
  "External Apps Sharing Synergy" dashboard (ingest/tag/route/compare, schema-bound), comparison
  humble engine + AI bundling orchestrator, the comprehensive Opus report (16 aspects + app-comparison
  research), and wiring it all to help & support. Grounded in a read-only platform inventory (S089).
version: "0.1"
session: S089
owner: group:finky
authored_by: OPUS-25
core_spine: GVRN
schema_anchor: handoff_files
diataxis_type: how-to
lifecycle: production
lifecycle_state: active
status: draft-awaiting-ratification
precedent_checked: true
links:
  - { rel: ux-dna, href: ../pillar-0-governance/behavioral-contracts/B_UX_UI_DISCIPLINE.md }
  - { rel: tagging-core, href: ../pillar-0-governance/TAGGING-CORE-INDEX.md }
  - { rel: schema-registry, href: ../pillar-0-governance/schema-registry.md }
  - { rel: parks, href: ../../../tools/data/park-register.yaml }
---

# OPUS S089 — Synergy + UX + Report Master Plan

> Status: DRAFT — awaiting Governor ratification of SEQUENCE. "Approve" (S089) covers the concepts;
> this plan crystallizes the build order (no-wild-implementation: approve authorizes ONE thing at a time).

## 0. Grounding (read-only inventory, S089) — extend, don't duplicate
| Need | Already exists → extend | Gap (new build) |
|---|---|---|
| UX/UI principles | `B_UX_UI_DISCIPLINE.md` (5 laws) + `validate-ux-audit.mjs` + `platform/zero-friction` page | a dedicated **UX-Principles page** (with ranking adjustment) |
| Schema / vocabulary | `TAGGING-CORE-INDEX.md`, `tagging-core-enums.yaml`, `canonical-concepts-registry.yaml`, `schema-registry.md`, `libs/vocabulary-service` | synergy content **bound to** these (no new vocab) |
| Comparison humble engine | *not found* (humble-consolidation DNA exists) | **new build**, aligned to humble/ideas-not-insistence DNA |
| Help & support | *not found* | **new build** |
| Tiers & permissions | distributed (policies lib + stripe-clerk) — no explicit 5-class doc | consolidate the 5-actor model |
| Journeys | `DEVELOPER-JOURNEY-SPEC` + `USER-JOURNEY-SPEC` (DRAFT) + `JOURNEY-CORE-SPINE` (sealed) | ratify drafts |

## 1. Decomposition — the 7 streams (P-META-024 routing)
- **S1 — Credential-rotation close** ✅ DONE this turn (live-verified; `.env.local` stale = local-only, non-blocking).
- **S2 — UX/UI principles**: enhance `B_UX_UI_DISCIPLINE` + build a UX-Principles **page** (+ ranking adjustment, separate-dispatch) + present link.
- **S3 — External Apps Sharing Synergy dashboard**: ingest external app/solution docs → **upload-once** → **route + tag** every content chunk (and tag internal parts) → bound to **tagging-core** schema (no duplicate vocab) → **download options** for everything.
- **S4 — Comparison Humble Engine + AI Bundling Orchestrator**: compare apps/options with multiple **output options**; orchestrator **dialogues** with the user to elicit needs and **bundle exact outputs to user definitions** ("help the user define what's best for them"). Humble = present default+variety, never insist.
- **S5 — Separate dispatch (Governor-flagged)**: UX-Principles page **ranking adjustment** · **pipeline-completion notifications** · **export as AI-optimized MD**.
- **S6 — Comprehensive Opus Report**: the 16 aspects below + deep app-comparison-schema research → "build accordingly." (External research agent running.)
- **S7 — Wire it all into Help & Support**: a help/support surface that links UX principles, synergy dashboard, journeys, and the report.

## 2. The S6 report — 16 aspects (outline to fill once research lands)
Token efficiency · Architecture · UX · UI · Developer journeys · Customer journeys · Goal definitions ·
Accountability · Monetization · Integrations · Tiers & permissions · How-it-all-connects · Optimal-wiring
& freshness · QC/Enforcement/Sanity-checks/IZFC · AI behaviour · AI personas. Each = current-state (cite
path) → gap → recommendation → wiring. Plus: **canonical app-comparison schema** (from external research)
→ informs S3/S4 build.

## 3. PE-ranked sequence (urgency × impact ÷ effort)
| # | Unit | u | i | e | PE | Owner |
|---|---|---|---|---|---|---|
| 1 | **S6 report + app-comparison research** (grounds S3/S4/S7) | 5 | 5 | 3 | **8.3** | Opus (research delegated) |
| 2 | **S2 UX principles enhance + page + link** (self-contained, DNA, you want the link) | 4 | 4 | 2 | **8** | Opus seed → Sonnet |
| 3 | **S3 Synergy dashboard** (schema-bound ingest/tag/route/compare/download) | 4 | 5 | 5 | **4** | Opus seed → Sonnet |
| 4 | **S4 Humble engine + bundling orchestrator** (builds on S3 data) | 4 | 5 | 5 | **4** | Opus seed → Sonnet |
| 5 | **S7 Help & support wiring** (after S2–S4 exist) | 3 | 4 | 2 | **6** | Sonnet |
| 6 | **S5 separate-dispatch items** (ranking/notifications/export) | 2 | 3 | 2 | **3** | Sonnet |

**Recommended path:** `S6 (report+research) → S2 (UX page) → S3 (synergy) → S4 (engine) → S7 (help) → S5`.
Rationale: the report + comparison-schema research must precede S3/S4 or we'd hard-code a schema we'd
rewrite; S2 is small, high-value, and you explicitly want the page link, so it runs alongside.

## 4. Hard constraints (carry into every build)
- **Schema binding**: S3/S4 content tags MUST resolve through `tagging-core-enums.yaml` +
  `canonical-concepts-registry.yaml` (schema-registry anchors). New vocabulary requires a registry entry,
  not an inline string. (B_NO_INVENTION_WITHOUT_PRECEDENT + no-duplicate-vocabulary.)
- **UX-DNA inheritance**: every new surface inherits the 5 `B_UX_UI_DISCIPLINE` laws + passes `validate-ux-audit`.
- **Humble attitude**: the engine presents default + variety, never insists (ideas-not-insistence DNA).
- **Page-completeness**: nav-registered + loading/error/empty + renders 200 + manifest-verified (M-47).
- **Role split**: Opus seeds/plans; Sonnet builds full FSE + block-tests; two-party seal.

## 5. Open ratification questions (Governor)
- **Q1** Sequence: accept §3 path, or pull S2 (UX page) ahead of the report?
- **Q2** "Comparison humble engine" — confirm it's a **new build** (none found) aligned to humble DNA, or point me to where it lives.
- **Q3** Synergy dashboard scope v1: ingest + tag + compare + download — is **upload-once → auto-route/tag** the v1 core, with bundling-orchestrator dialogue as v2?
