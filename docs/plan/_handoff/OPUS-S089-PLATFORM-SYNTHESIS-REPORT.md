---
id: csps.handoff.opus-S089-platform-synthesis-report
name: OPUS-S089-PLATFORM-SYNTHESIS-REPORT
description: >
  Comprehensive Opus synthesis report (S089). 16-aspect current-state→gap→recommendation→wiring,
  grounded in a read-only platform inventory; plus the canonical "External Apps Sharing Synergy"
  comparison schema + tagging taxonomy + AI bundling orchestrator design, grounded in external
  industry research (schema.org SoftwareApplication, Gartner/G2/LeanIX dimensions, RAG chunk-tagging,
  MCDA + slot-filling dialogue). Foundation for the S089 build streams.
version: "1.0"
session: S089
owner: group:finky
authored_by: OPUS-25
core_spine: GVRN
schema_anchor: handoff_files
diataxis_type: explanation
lifecycle: production
lifecycle_state: active
status: active
precedent_checked: true
links:
  - { rel: plan, href: ./OPUS-S089-SYNERGY-UX-REPORT-MASTER-PLAN.md }
  - { rel: ux-dna, href: ../pillar-0-governance/behavioral-contracts/B_UX_UI_DISCIPLINE.md }
  - { rel: tagging-core, href: ../pillar-0-governance/TAGGING-CORE-INDEX.md }
  - { rel: schema-registry, href: ../pillar-0-governance/schema-registry.md }
---

# OPUS S089 — Platform Synthesis Report

> Grounded, not invented: Part A current-state cites real inventory paths; Part B is industry research
> mapped onto CSPS's existing tagging-core (no duplicate vocabulary). Two open items the inventory could
> NOT find — **comparison-humble-engine** and **help-&-support** — are new builds, not enhancements.

---

## PART A — 16-aspect synthesis (current → gap → recommendation → wiring)

| # | Aspect | Current state (path) | Gap | Recommendation → wiring |
|---|---|---|---|---|
| 1 | **Token efficiency** | `B_TOKEN_BUDGET.md` v3 — 10 rules, T1 hook + T2 + T3 | spawn context-budget line not auto-enforced on all Agent() calls | Add the `CONTEXT-BUDGET:` line to spawn template gate (already hooked) → wire to agent-alignment |
| 2 | **Architecture** | 5 spines GVRN>VALD>ARCH>AI>OPER; 7 pillars; `JOURNEY-CORE-SPINE` sealed | new features (synergy) need a spine home | Synergy = ARCH data-domain + GVRN tagging; register under schema-registry |
| 3 | **UX** | `B_UX_UI_DISCIPLINE.md` — 5 constitutional laws + `validate-ux-audit.mjs` | no standalone UX-principles **page** | Build page that *renders* the 5 laws live; inherits the contract (single source) |
| 4 | **UI** | `platform/zero-friction` + design-intelligence pages; sacred `styles.css`/`nav.js` | UI principles not surfaced as rankable list | UX page shows laws + per-law ranking adjustment (separate-dispatch) |
| 5 | **Developer journeys** | `DEVELOPER-JOURNEY-SPEC.md` (DRAFT) + `platform/developer-journey` page | DRAFT unratified (S084) | Ratify; synergy dashboard is a developer-journey entry point |
| 6 | **Customer journeys** | `USER-JOURNEY-SPEC.md` (DRAFT) + `platform/user-journey` page | DRAFT unratified | Ratify; bundling-orchestrator dialogue = a user-journey |
| 7 | **Goal definitions** | `B_INTENT_CRYSTALLIZATION.md` + `ESSENCE-EXTRACTION-DEFAULT.md` | — | `UserNeed` entity (Part B) = a crystallized goal; reuse intent model |
| 8 | **Accountability** | `platform/accountability` page + CIE authority gate | — | Every comparison cell provenance-linked (demonstrated-truth) |
| 9 | **Monetization** | `cost-economics.md` STUB v0.1 + `stripe-clerk-wiring.md` | tiers vocab not consolidated | Synergy/export features = tier-gated entitlements |
| 10 | **Integrations** | `external-integrations/*` (now incl. rotation runbook) + `libs/integrations/*` | — | Synergy ingest = a new "integration source" class |
| 11 | **Tiers & permissions** | distributed (policies lib + stripe-clerk); **no explicit 5-actor doc** | consolidation gap | Author the 5-actor tier model (PARK-S084-011 already queued) |
| 12 | **How-it-connects** | spine precedence + schema-registry anchors | cross-feature map missing | Part C below = the wiring map |
| 13 | **Optimal wiring & freshness** | content-hash freshness (CS7) + registry `verified_at` | — | Synergy `EvidenceDoc.freshness` + trust hierarchy (Part B) |
| 14 | **QC / enforcement / IZFC** | `audit-runner.md` (41 validators) + `verify.mjs` + ZF protocol | new features need validators | Each build adds T1/T2 + block-test (FSE); synergy adds `validate-tag-binding` |
| 15 | **AI behaviour** | inner-ai-defaults registry (D1–D10) + drift log | — | Orchestrator must resist D1 eager-helpfulness (humble = options not insistence) |
| 16 | **AI personas** | `ai-personas.md` (7) + council turns | — | Bundling orchestrator = a persona with slot-filling contract |

---

## PART B — "External Apps Sharing Synergy" — canonical schema (research-grounded)

### B.1 Comparison entity model (adopt schema.org `SoftwareApplication` as the App root)
- **App** ← schema.org SoftwareApplication: `app_id, name, vendor, category, sub_category, suite, deployment_models[], lifecycle_status`
- **Capability** — `name, dimension, maturity` → App has-many (dimension ∈ the 10 below)
- **PricingTier** — `name, price, billing_unit, free_trial, included[], limits` (schema.org AggregateOffer)
- **Integration** — `target_system, type{API/SSO/native/webhook}, depth`
- **ComplianceCert** — `standard{SOC2/GDPR/ISO27001}, status, evidence_ref`
- **SecurityControl** — `type{MFA/RBAC/audit-trail/encryption}, present`
- **EvidenceDoc** (the ingested source) — `doc_id, source_name, doc_type, trust_level, freshness, access_level` → **substantiates** every Capability/Pricing/Cert claim
- **Review** — trScore-style weighted (recency × representativeness × depth)
- **UserNeed** — `dimension, requirement, type{hard-constraint|weighted}, weight, target` (= a crystallized goal, aspect 7)
- **ComparisonResult** — `app, need, match_score, satisfied, explanation, source_refs[]`
- **Bundle** — `app_ids[], total_fit, total_cost, coverage_map, rationale`

One-line relations: **EvidenceDoc → tags → Capability/Pricing/Cert (of App); UserNeed → scored-against → App → ComparisonResult → assembled-into → Bundle.**

### B.2 The 10 canonical comparison dimensions
capabilities/features · pricing & tiers · integrations · security/compliance · UX/usability · support/vendor · performance · data-model/ownership · deployment · market-signals (ratings/segment/vision).

### B.3 Chunk-tagging taxonomy (tag at ingestion, not after)
`source_id` · `source_name/vendor` · `doc_type{datasheet,pricing,API-docs,security-whitepaper,review,RFP,contract,marketing}` · `content_topic`(=dimension) · `trust_level{vendor-official>3rd-party>blog>user}` · `freshness` · `format` · `access_level{public,tenant-private,restricted}` · `tag_provenance{manual,algorithmic,LLM}` · `confidence` · `section/page` · `keywords[]`.

### B.4 ⚠️ SCHEMA-BINDING MANDATE (your no-duplicate-vocabulary requirement)
**None of the above ships as inline strings.** Every entity, dimension, doc_type, content_topic, and
trust_level MUST register in CSPS's existing backbone before use:
- enums → `tools/config/tagging-core-enums.yaml`
- concepts → `tools/config/canonical-concepts-registry.yaml`
- anchors → `schema-registry.md` (+ zmodel entity if persisted)
- index → `TAGGING-CORE-INDEX.md`
A new `validate-tag-binding.mjs` BLOCKS any synergy tag whose value isn't in the registry. This is how
ingested external vocabulary maps onto platform vocabulary instead of forking it.

### B.5 AI bundling orchestrator (humble, dialogue-driven)
- **Slot-filling dialogue + DST**: each `UserNeed` = a slot; ask only missing/under-specified slots; **stop when required slots filled** (completeness gate = CSPS IZFC + "ask only what improves, ≤2 Qs").
- **Hard-constraint vs weighted**: must-have = knockout filter; nice-to-have = MCDA weight (SAW/TOPSIS).
- **Two-stage**: candidate-match (filter) → rank (score) → **ranked bundles with per-item explanation + coverage map**.
- **Humble output**: present default + variety with rationale; never insist (D1 eager-helpfulness + ideas-not-insistence DNA). Show inferred weights back for confirmation (editable-understanding UX law).
- **Provenance**: every ComparisonResult cell carries `source_refs[]` → traceable to the EvidenceDoc chunk (demonstrated-truth; external content = claim-until-reproduced).

---

## PART C — How it all connects (wiring map)
```
Upload-once  →  Ingest+chunk  →  Tag (B.3, bound to tagging-core B.4)  →  EvidenceDoc
      ↓                                                                        ↓
  download options  ← Synergy Dashboard ← ComparisonResult ← scored-against ← App model (B.1)
                              ↑                    ↑
                     Bundling Orchestrator ← UserNeed (slot-filling B.5)
                              ↓
                     Help & Support (links UX principles + journeys + this report)
```
- **Schema** is the spine: tagging-core enums = the shared vocabulary across ingest, compare, bundle.
- **UX-DNA** wraps every surface (5 laws + validate-ux-audit).
- **Accountability/provenance** threads every cell back to source.
- **Tiers** gate export + advanced bundling.
- **QC**: each stream ships T1/T2 + block-test (FSE) + page-completeness.

---

## PART D — Build-accordingly (sequence in the master plan)
PE path: **report(this) → UX page → synergy dashboard → humble engine+orchestrator → help wiring → dispatch-items.**
Hard constraints: schema-binding (B.4) · UX-DNA inheritance · humble attitude · page-completeness · two-party seal.

## PART E — Open ratification (Governor)
- **Q1** Sequence: confirm §D, or pull UX page ahead.
- **Q2** "Comparison humble engine" = new build aligned to humble DNA (none found)? confirm.
- **Q3** Synergy v1 = upload-once + tag + compare + download; bundling-orchestrator dialogue = v2? confirm.
- **Q4** Adopt schema.org `SoftwareApplication` as the App root entity (vs a from-scratch model)?
