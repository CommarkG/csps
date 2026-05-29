---
id: csps.governance.one-source-of-doctrine
name: ONE-SOURCE-OF-DOCTRINE
description: >
  Canonical "latest version" (S071) of the CSPS One-Source-Of (consolidation) doctrine.
  Consolidates the scattered consolidation surface (consolidation-expert skill + B_CONSOLIDATION_PASS
  + P-META-029 humble-consolidation + validate-nothing-stands-alone + the lived S069-S070-S071
  "one source of …" patterns) into ONE doctrine with FOUR creation-time prevention points and
  explicit wiring to CIE (measure duplication drift) + PE (prioritize consolidation work) +
  Threshold (route "create" inputs through a consolidation check FIRST). Goal: scatter is
  PREVENTED at creation, not cleaned up after. Numbers are sample/tunable per P-META-028.
  status: draft pending Governor ratification.
type: governance
diataxis_type: reference
protection_level: protected
status: draft
impl_status: architecture-pending
vault_pending: vlt-S071-one-source-doctrine
retrieve_when: "Governor ratifies → Sonnet authorized to wire the canonical register + creation gate + CIE/PE/threshold integrations milestone-run"
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, OPER, VALD]
schema_anchor: pillar_0_governance_leaves
version: "1.0"
session: S071
owner: group:finky
authored_by: OPUS-15
lifecycle: production
lifecycle_state: active
ns_quality: [core-first, synergetic, core-maximal]
ns_path: "this → GVRN spine → North Star (one source of every concept)"
context_question: "Before creating anything new: does a canonical source already exist for this concept? If yes, EXTEND. If no, declare the parent it inherits from + register this as the new canonical."
context_quote: "Multi-surface consolidation is the core of this platform. — Governor S069"
inherits_from: "P-META-029 humble-consolidation-discipline + B_CONSOLIDATION_PASS + validate-nothing-stands-alone + INHERITANCE-MODEL (no orphans) + P-META-028 cornerstone (context-refined communication)"
links:
  - { rel: principle, href: ../principles/P-META-029-humble-consolidation-discipline.md }
  - { rel: contract, href: ./behavioral-contracts/B_CONSOLIDATION_PASS.md }
  - { rel: orphan-validator, href: ../../../tools/validators/validate-nothing-stands-alone.mjs }
  - { rel: skill, href: ../../../.claude/skills/consolidation-expert/SKILL.md }
  - { rel: inheritance-model, href: ./INHERITANCE-MODEL.md }
  - { rel: threshold-router, href: ../../../tools/scripts/threshold-router.mjs }
---

# One-Source-Of · Doctrine · Latest (S071)

> **One sentence:** Every concept on the platform has exactly ONE canonical source; everything else references it; **creation** of a new concept is gated by a canonical-search check, so scatter is prevented at the moment of birth — not chased afterwards.

## 1 · Why this is the platform's core
The Governor named multi-surface consolidation as the core. Empirically: every recurring "EXISTS≠ACTIVE" or "described-not-built" pattern this session traced to **the same concept living in N places with no canonical owner.** RZF + CIP + the comms-schema + the journey architecture all rely on the same shape — one canonical, many references. This doctrine names that shape and makes it enforceable at *creation*.

## 2 · The law (single rule)
**Every concept has exactly ONE canonical source. Every other surface that touches the concept is a REFERENCE, not a copy.** A creation is permitted only when (a) no existing canonical covers it, **or** (b) the new artifact declares the canonical it extends (inheritance, ADD-not-CONTRADICT).

## 3 · The Canonical Surface Register (CSR)
A single registry `tools/data/canonical-source-register.yaml` lists every "one source of X." Each row:
```
- concept: <short name>
  canonical_path: <one file or one record id>
  consumers: [<files/skills/dashboards that reference it>]
  inherits_from: <parent concept or top-level>
  owner_session: S<NNN>
  status: ratified | draft
```
Examples drawn from S069-S071 (sample set — expandable):
| Concept | Canonical | Consumers (sample) |
|---|---|---|
| Audience tiers | `communication-schema.yaml` `audience_hierarchy[]` | journey branches · product UX · prevention-class register |
| Journey doctrine | `JOURNEY-DOCTRINE.md` (system-wide) | dev-journey · user-journey · onboarding · handoff |
| Core seeds (plan parts) | `CORE-SEEDS-PLAN-PARTS.md` | handoffs · per-tab bootstraps |
| Comms protocol | `communication-protocol-shared.md` (RULE 0–15) | council · directives · UX micro-copy |
| Vocabulary | `vocabulary.md` (+ acronyms quick-ref) | every artifact that names a term |
| Principles | `packages/principles/principles.yaml` | every governance enforcement |
| RZF discipline | `RZF-LATEST.md` (+ `zero-findings-discipline.md` long-form) | every DONE claim |
| AI profiling → comms | `AI-PROFILING-TO-COMMUNICATION-FEEDBACK.md` | activation_language[] · weekly audit |
| Inheritance model | `INHERITANCE-MODEL.md` | every new artifact's `inherits_from` |

The register itself **is the one source of "one sources."** A new canonical must be registered the same commit it's created.

## 4 · The FOUR creation-time prevention points (the wiring)
Scatter is prevented at four atomic places — each closes one gap.

### P1 · THRESHOLD invokes consolidation-expert on every "create-new" input
Inputs classified as `creation-request` (proto/validator/hook/doc/schema) route through **INVOKE: consolidation-expert** before any Write tool fires. The expert returns one of: `existing_canonical: <path>` (return EXTEND instructions) · `no_canonical_found` (proceed + require register entry) · `ambiguous` (escalate Governor). Wires into `tools/scripts/threshold-router.mjs` as a new class.

### P2 · CREATION GATE (pre-tool-use hook) on Write
`.claude/hooks/pre-tool-use-canonical-search-gate.sh` — before any Write of a doc/validator/hook/schema, query the CSR for `concept ≈ <intent>`; if a canonical exists, advise extend. Advisory now, BLOCK after PVA (per the existing advisory→blocking pattern).

### P3 · SCHEMA (NodeFile) — `inherits_from` mandatory
The existing NODEFILE-CONTRACT already requires `inherits_from`. Extend `validate-nothing-stands-alone.mjs` to **resolve the named parent against the CSR** — declared-but-absent parents are flagged (closes the existing GAP A I diagnosed in S068).

### P4 · WEEKLY AUDIT (CIE measures the drift)
`tools/scripts/weekly-consolidation-audit.mjs` — clusters near-duplicate definitions across the canonical surface; emits a drift metric (sample: count of concepts with > 1 candidate source + per-concept fragmentation score). Findings route to PE for scoring.

## 5 · Wiring to CIE + PE + Threshold (so it isn't left hanging)
- **Threshold (P1 above):** `creation-request` is a new input class; consolidation-expert is the mandatory INVOKE before Write. Ties to the PART 2 classification table (which already has a `place` + `criticality` for every class).
- **CIE (continuous):** the weekly audit (P4) emits a `consolidation_drift` metric per cycle; the metric is a first-class signal in `ai-behavior-signals.jsonl` (`signal_class: consolidation_drift`).
- **PE (priority):** drift events are scored by PE (`urgency × impact / SPI`); top-K (sample K=3 per week — tunable) become consolidation work items proposed to Governor for the next session's plan.
- **Ratification pipeline (S069 ADDENDUM):** changes to the CSR (adding/promoting/retiring a canonical) travel the governed path — never raw edits.
- **AI-profiling (artifact 2):** if D1 humble-consolidation fires K≥3× for a given tier without an override, the system tags the responsible artifact and routes to consolidation review (closes the AI-default ↔ doctrine loop).

## 6 · Expert improvements (proposed; sample counts — tunable)
- **I1 · CSR-first creation script.** `tools/scripts/new-artifact.mjs <concept>` — queries the CSR + the consolidation-expert; refuses to scaffold a new file when a canonical already exists; on creation, **auto-registers** the new canonical in the CSR (atomic — same commit, enforced by a pre-commit hook).
- **I2 · Concept fingerprinting.** A lightweight semantic hash of new artifact titles/headings compared against existing canonical concepts so "almost-the-same-with-different-name" gets caught (sample: edit distance + headword overlap; tunable thresholds).
- **I3 · Per-canonical health score.** Each CSR row carries a `health` (last-modified · consumer-count · drift-score · ratified-status). Dashboards surface weakest canonicals first → PE picks them up.
- **I4 · One-source-of-tiers law.** Make the audience-tier set in `communication-schema.yaml` the ratified canonical for *every* tiered surface (RBAC roles in apps, journey branches, dashboard audience selectors). Cross-link from each consumer.
- **I5 · `/platform/canonical-register` dashboard.** Per the Vercel-mirror rule: render the CSR + drift + pending-consolidation work; Governor inspects, ratifies new canonicals from there. Closes the loop visibly.

## 7 · How it composes with the rest of S069-S071
- **Cornerstone (P-META-028):** context-refined communication is *why*; one-source-of is *how the platform stays interpretable* — fewer surfaces drifting = less rigid-number / leaky-jargon failure.
- **Inheritance Model:** "no orphans" is the existing law; this doctrine adds *"no duplicate canonicals."*
- **Comms-schema audience hierarchy:** already the canonical for tiers — promote it explicitly via the CSR.
- **CIP:** every proposed change is checked against the CSR in the RIPPLE-QC step (one of the directions: consolidation-expert).
- **RZF (artifact 1):** scatter-creating commits get caught via the post-edit verify trigger + the consolidation-drift signal.

## 8 · Status & gates
- Design status: **draft pending Governor ratification**.
- Build order on ratify (PE-recommended): CSR file + register loader (I1 helper) → threshold INVOKE wiring (P1) → CREATION GATE hook (P2) → extend `validate-nothing-stands-alone` for parent-existence (P3) → weekly audit (P4) + dashboard (I5).
- All under milestone-run; no parallel machinery.

— OPUS-15 (S071) · authored 2026-05-29
