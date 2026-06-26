---
id: csps.handoff.opus-S089-consolidated-plan
name: OPUS-S089-CONSOLIDATED-PLAN
description: >
  The consolidated, reasoned S089 plan for App-Comparison + Sharing-Synergy + Humble Engine + Adjusting Layer.
  Built from: design-v2 (north-star §0, baseline §9, council §10, core-seeds §11), the platform synthesis
  report, the 7-stream master plan, the 4-member external council (4/4), and the 3 MindMePA PE/orchestrator
  feedbacks. Includes a DECISION LEDGER preserving rejected options + full reasoning (mature starting point —
  do NOT re-research). Universal core values (reused) + specifics (per domain); minimal-now / full-later.
version: "1.0"
session: S089
owner: group:finky
authored_by: OPUS-25
core_spine: GVRN
schema_anchor: handoff_files
diataxis_type: how-to
lifecycle: production
lifecycle_state: active
status: active
precedent_checked: true
links:
  - { rel: design, href: ./OPUS-S089-DESIGN-v2-ADJUSTING-LAYER-HUMBLE-ENGINE.md }
  - { rel: report, href: ./OPUS-S089-PLATFORM-SYNTHESIS-REPORT.md }
  - { rel: master-plan, href: ./OPUS-S089-SYNERGY-UX-REPORT-MASTER-PLAN.md }
  - { rel: parks, href: ../../../tools/data/park-register.yaml }
---

# OPUS S089 — Consolidated Plan (App-Comparison + Sharing-Synergy + Humble Engine + Adjusting Layer)

> SSoT for the S089 program after the full council (4/4) + Governor ratifications. Built BY composing
> existing platform tools (§0 north star). Universal tools documented in full (reused many times); specifics
> only to the depth their single use needs. **Decision Ledger (§4) preserves rejected options + reasoning so
> future work starts mature — no re-research.**

## 1. North star (governing)
The platform builds itself with its own tools: `Threshold → Humble Engine (CIE+PE) → Journey → Tagging-core →
Validators/IZFC/seal → Adjusting Layer`. Every stream is built by composing universal tools; recursive dogfood
(the comparison engine, once built, becomes a tool the platform reuses). Ref design-v2 §0.

## 2. Universal core vs specific
- **Universal (reused):** Threshold · Adjusting Layer (ACL inward + Published-Language outward) · Humble Engine
  + CIE + PE triangle · Tagging-core/schema-registry/canonical-concepts (vocabulary) · Journey core · Validators
  /verify/IZFC/two-party-seal · UX/UI DNA · B_CHALLENGE_ON_MERIT.
- **Specific (one domain):** app-comparison schema · synergy dashboard surface · bundling slot-dialogue · domain
  enums + domain validators.
- **Rule:** build specific only by composing universal (§0).

## 3. Decided architecture (post-council 4/4 + Governor ratifications)
- **Adjusting Layer = Anti-Corruption Layer (inward, admission-control) + Published-Language (outward, presenter).**
  Inward pipeline: `Quarantine → Normalize(Translator) → CIE-compare(similarity) → Humble-decision → PE-rank →
  Gate{commit | needs-review | reject-with-reason} → Provenance-log`. Throttle ingestion (DLQ/rate-limit).
- **Humble Engine** (internal create-vs-enhance governance, **BLOCK** posture) and **Synergy Dashboard**
  (external app discovery, **WARN** posture) are **DECOUPLED services** that **share the CIE + comparison core**.
  *(Governor RATIFIED decouple 2026-06-26; supersedes the original "one engine".)*
- **Significance threshold (load-bearing):** CIE returns numeric similarity → config thresholds **≥85 enhance /
  50–84 present-PCR / <50 create**; **low-confidence → default enhance/consolidate, never auto-create**; CIE
  snapshot per call; exit-condition (timeout→do-nothing); PE effort = TCO; semantic-distance + hashing guard.
- **Dispatcher:** pure fn over `(spine,scope,intent,trust_level,confidence,…)`; precedence trust>scope>intent>
  spine; versioned table; **hierarchical wildcard fallback + "needs-review" valid output**.
- **App entity:** schema.org `SoftwareApplication` core + CSPS ext (EvidenceDoc[**PROV-O**], UserNeed,
  trust_level, ComparisonResult[own table], Bundle) + SHACL-style shapes + evidence-lifecycle + conflict-model.
- **Bundling:** hard-constraints-first filter → MCDA weighted (minimax-regret/Choquet under uncertainty) →
  coverage-matrix + provenance-per-slot. (v2.)
- **Velocity is first-class:** gate only significant creations; SWIFT the rest (bureaucracy = failure mode, Grok).
- Core-seeds: design-v2 §11 (CS-A…CS-G). Opus plants; Sonnet builds.

## 4. DECISION LEDGER — chosen + REJECTED-with-reasoning (mature starting point; do NOT re-research)
| Decision | CHOSEN | REJECTED (+ why) | Source / vote |
|---|---|---|---|
| App entity model | **Merge**: schema.org core + CSPS ext | schema.org-only (no provenance/trust/requirement); CSPS-native-only (no interop, isolated ontology, high integration cost) | council 4/4 |
| Provenance model | **PROV-O** for claim/evidence + SPDX for software identity | SPDX-only (covers software identity/licensing, NOT "which doc substantiates a claim"); custom homemade model (no interop) | Opus pushback vs Claude #1; GPT/Gemini concur |
| Adjusting Layer shape | **ACL inward (admission-control) + Published-Language outward (presenter)** | Bidirectional automation membrane [my original] (outward automation is a rendering concern, not reasoning); full runtime quarantine proxy (over-engineered) | council 4/4 overruled Opus |
| Engine ↔ Dashboard | **Decoupled services sharing CIE + comparison core** (BLOCK internal / WARN external) | One coupled engine [Governor original] (couples governance + UI; change to thresholds breaks dashboard) | council 3/4; **Governor RATIFIED**. Minority: Grok ("powers it elegantly") — overruled: coupling risk > reuse convenience |
| Significance gate | **Numeric CIE similarity + config thresholds; default enhance on low confidence** | AI-judgment threshold (not auditable/consistent; oscillates across sessions/operators) | council 4/4 |
| Dispatcher on ambiguity | **"needs-review" / wildcard fallback (valid deterministic output)** | Forced best-guess-create (non-deterministic; pollutes core with duplicates) | council 4/4 |
| Priority↔Orchestrator (MindMePA, cross-project wisdom) | **Layered: PE universal scorer consumed at explicit junctions** | Merge PE into orchestrator (breaks single-responsibility); event-sourced priority projections (read-latency scales with history) | MindMePA 3/3 |
| Bundling scoring | **Hard-constraints-first filter, THEN MCDA weighted** | Mixed hard+soft scoring (surfaces constraint-violating bundles ranked high — trust-breaking) | council 4/4 |
| Outward automation in v1 | **Cut — presenter/template only** | Automatic bidirectional wisdom translation in v1 (premature; inward-first proves value) | council 4/4 |
| Challenge-on-merit enforcement | **Structural detection (banned filler, missing-PCR) + presence everywhere** | Rigid agreement-policing validator (can't tell merit-agreement from sycophancy; forces contrarianism) | Opus PCR on Governor directive |

## 5. App-Comparison + Sharing-Synergy — population (from THIS tab; reasoning preserved)
Content seeded from the work already done (no new deep dive): comparison schema (§3 + report Part B: 10 canonical
dimensions, chunk-tagging taxonomy, MCDA/slot-filling), all **bound to tagging-core** (no duplicate vocabulary),
provenance-linked per comparison cell (demonstrated-truth). The Decision Ledger (§4) is the dashboard's "why we
built it this way + what we rejected" reference — carried INTO the dashboard's own docs/help so the rationale
lives with the feature.

## 6. Minimal-now / full-later sequence (PE)
1. **S2 — UX/UI principles page** (minimal; pure composition of UX/UI DNA; proves the self-build loop). *(your "what about the UI?" → UI first-class.)*
2. **CS-F — confirm/build versioned vocabulary registry** (foundation; council says build-first).
3. **S3 — Synergy dashboard v1** (upload-once → tag/route[schema-bound] → compare → download). WARN posture.
4. **S4 — Humble Engine** (internal create-vs-enhance; BLOCK posture; CS-B). Decoupled; shares CIE.
5. **S7 — Help & support wiring**; **S5 — dispatch items**; bundling-dialogue = v2.
Each stream: built from core-seeds · FSE + block-test · two-party seal · schema-binding · page-completeness · IZFC.

## 7. Authorized / ratified (2026-06-26)
- ✅ Decouple engine↔dashboard (Governor ratified).
- ✅ "Approve all suggested" → **HARDWIRE batch for B_CHALLENGE_ON_MERIT enforcers AUTHORIZED** (validator +
  2 prompt-injections + block-tests) — build-ready, next build phase.
- ✅ Consolidated plan = this doc (SSoT).

## 8. UNIVERSAL mechanism — B_DECISION_LEDGER (generalize §4 to every build)
The §4 Decision Ledger is the FIRST INSTANCE of a now-constitutional universal mechanism:
**[B_DECISION_LEDGER](../pillar-0-governance/behavioral-contracts/B_DECISION_LEDGER.md)** — every consequential
decision, in **platform self-build AND SaaS/app solution builds**, records chosen + rejected-options-with-
reasoning + minority views, so research is captured once and **never re-run**.
- It is the **CIE's memory of rejected options** → the fuel that lets the Humble Engine consolidate-over-create
  (you can't avoid recreating what you didn't record). Ledger → CIE → Humble Engine → fewer re-dives.
- Wired into the universal tools: plan-creation-protocol (every plan has a Ledger section) · Humble Engine
  core-seed CS-B (auto-emits ledger entries) · CIE (ingests → blocks re-research) · validate-decision-ledger
  (structural check, HARDWIRE-queued with block-test, batched with validate-challenge-on-merit).
- **Self-build + solution-build parity:** when CSPS generates a SaaS/app, that solution inherits its own ledger
  so its builders/tenants start mature too — the platform's reasoning-preservation DNA propagates into what it builds.
