---
id: csps.protos.PROTO-S068-PART-1-SUBSTRATE-RECONCILIATION
name: PROTO-S068-PART-1-SUBSTRATE-RECONCILIATION
description: "S068 re-gate PART 1 of 8. Substrate reconciliation: fix pillar-1 duplicate (pillar-1-product → pillar-7-product), author NODEFILE-CONTRACT + SPINE-PILLAR-MAP, generalize pending-plan-items → pending-nodes, install NodeFile compliance validator (ADVISORY) + hook. Precondition for PART 2 (Threshold Complete). No app work."
type: proto
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S068
authored_by: Opus-12
date: 2026-05-28
core_spine: GVRN
core_spines: [GVRN, ARCH, VALD]
schema_anchor: protos
plan_item_id: "MASTER-RE-GATE-PLAN-S068 PART 1 (Governor ratified S068 'All ratifies')"
core_seed_present: true
gate_tier: full-advance
inherits_from: "MASTER-RE-GATE-PLAN-S068 + Governor uploads [[00-INDEX]] + Core Spines L1/L2/L3 doctrine + frontmatter standard (M-40 inherits_from) + PLATFORM-GENOME (M-29) + pending-plan-items.yaml + P-ARCH-028 core-spine-discipline + B_CONSOLIDATION_PASS"
links:
  - rel: master-plan
    href: ../_handoff/MASTER-RE-GATE-PLAN-S068.md
  - rel: governor-uploads
    href: ../_handoff/VAULT/governor-uploads/S068/00-INDEX.md
  - rel: next-part
    href: PROTO-S068-PART-2-THRESHOLD-COMPLETE.md
context_question: "Before any other re-gate PART begins: is the substrate consistent? Pillar numbering unique? Routing axis canonical? NodeFile contract defined? Pending-nodes register exists?"
---

# PROTO-S068-PART-1-SUBSTRATE-RECONCILIATION

**STATUS: ACTIVE** | Session S068 | Sonnet-13 builds | Opus-12 reviews per STEP (check-in tier)
**Gate tier:** full-advance (substrate — everything else depends on it)
**Part:** 1 of 8 in [MASTER-RE-GATE-PLAN-S068](../_handoff/MASTER-RE-GATE-PLAN-S068.md)

---

## CORE SEED — the architectural anchor

The platform has the RIGHT substrate pieces (Core Spines L1/L2/L3, frontmatter standard, PLATFORM-GENOME index, pending-plan-items) but they are INCONSISTENT: two pillar-1 directories collide, two routing vocabularies coexist (5 Core Spines vs 8 Pillars) without a canonical map, and the frontmatter standard answers only 6 of the 8 NodeFile self-identification questions. Before the Threshold can route "anything to a place," the places must be consistently named, numbered, and contracted.

This PART engraves the structural floor: **one routing axis (Core Spines), one consistent pillar numbering, one NodeFile contract every artifact answers to, one pending-nodes register for unmatched artifacts.** Everything downstream (Threshold, Product Schema, Governance Constitution, Question Placement, Templates, Onboarding, Developer Journey) stands on this floor.

**Reuse-before-create (humble-consolidation):** 0 net-new concepts. Every piece EXTENDS an existing artifact — frontmatter gains fields, pending-plan-items generalizes to pending-nodes, Core Spines doctrine gets a numbering scheme. Nothing is rebuilt.

---

## 5-PERSONA PRE-PROTO REVIEW (Q9 ratified)

**cruel-critic:** "Retrofitting NodeFile fields onto 647 files while verify recovers from iter-11 is reckless. SCOPE to ~30 files (CORE + L1/L2 + pillar headers) per Q4; validator ADVISORY not BLOCKING until PVA proves it catches drift. Pillar-1 rename touches inbound references — grep ALL of them before mv, or you'll orphan links." → Applied: STEP 2 grep-first; validator ADVISORY; retrofit scoped to ~30 files.

**balance-expert:** "1 new validator + 1 new hook + 8 new frontmatter fields = density spike. Justify each. The 8 fields: 6 already exist as frontmatter (id/type/core_spine/inherits_from/links/context_question map to 6 of 8 questions). Only 2-3 truly new. Don't add 8; add the minimal delta." → Applied: STEP 3 adds only the delta fields (services_offered_to / cie_connection / pe_connection / unique_addition / mini_tree_ref / vault_ref / internal_parts / depth) — and marks which map to existing.

**bottleneck-expert:** "If validate-nodefile-compliance scans 647 files every verify run, that's a per-commit cost. Cache by file-hash; only re-scan changed files." → Applied: STEP 4 validator uses changed-file detection + hash cache.

**consolidation-expert:** "pending-plan-items.yaml ALREADY is a pending register. pending-nodes is a SUPERSET. Generalize the schema in-place; migrate existing entries; do not run two parallel registers." → Applied: STEP 5 generalizes, migrates, single register.

**schema-expert:** "NodeFile contract is a META-schema (frontmatter), not a DB schema. Keep it out of libs/policies — it governs .md artifacts, not DB rows. The Product/Threshold DB entities come in PART 2-3. Don't conflate." → Applied: NODEFILE-CONTRACT.md is a governance doc, not a .zmodel.

**Synthesis (Opus-12):** All 5 converge — scope down to ~30-file retrofit, validator ADVISORY + cached, generalize don't duplicate pending register, grep-before-rename, keep NodeFile contract as frontmatter-meta not DB. PROTO STEPs below reflect this.

---

## STEP 0 — Design completeness (Opus-12, this file)

**DONE WHEN:**
- [x] PROTO authored with Core Seed + DONE WHEN + ZF gate
- [x] 5-persona pre-review embedded
- [x] All artifacts map to existing-vs-new (humble-consolidation)
- [ ] Governor ratifies PROTO → Sonnet begins STEP 1

## STEP 1 — Pillar-1 Duplicate Fix

**Owner:** Sonnet-13 | **Tier:** check-in
**Reuse:** existing `docs/plan/pillar-*` structure.
**DONE WHEN:**
- [ ] `grep -rn "pillar-1-product"` across repo → enumerate ALL inbound references FIRST
- [ ] `git mv docs/plan/pillar-1-product docs/plan/pillar-7-product`
- [ ] Update every inbound reference found in grep (frontmatter links, doc cross-refs, validators)
- [ ] validate-nothing-stands-alone (or equivalent) passes — no orphaned links
- [ ] CHECKPOINT in sonnet-turn.md with commit SHA + grep-count before/after

## STEP 2 — SPINE-PILLAR-MAP.md

**Owner:** Opus-12 (design) + Sonnet-13 (author) | **Tier:** check-in
**Reuse:** Core Spines L1/L2/L3 (.claude/core-spines/) + 8 pillars.
**DONE WHEN:**
- [ ] `docs/plan/pillar-0-governance/SPINE-PILLAR-MAP.md` authored
- [ ] Declares: 5 Core Spines (GVRN/ARCH/AI/OPER/VALD) = ROUTING AXIS; 8 Pillars = CONTENT GROUPINGS
- [ ] Maps each pillar → its primary spine (e.g. pillar-0-governance → GVRN, pillar-2-data-and-schema → ARCH)
- [ ] Cites P-ARCH-028 precedence (GVRN > VALD > ARCH > AI > OPER)
- [ ] CHECKPOINT in sonnet-turn.md

## STEP 3 — NODEFILE-CONTRACT.md

**Owner:** Opus-12 (design) + Sonnet-13 (author) | **Tier:** full-advance
**Reuse:** existing frontmatter standard (6 of 8 questions already answered).
**DONE WHEN:**
- [ ] `docs/plan/pillar-0-governance/NODEFILE-CONTRACT.md` authored
- [ ] Maps 8 self-identification questions → frontmatter fields (6 existing + delta)
- [ ] Delta fields defined: services_offered_to / cie_connection / pe_connection / unique_addition / mini_tree_ref / vault_ref / internal_parts / depth
- [ ] Dewey numbering spec: `<SPINE>.<NN>.<ARTIFACT>.<PART>` (Q5)
- [ ] Vault-attachment: lazy-instantiate spec (Q6)
- [ ] internal_parts taxonomy: id / kind / status / tags / content
- [ ] CHECKPOINT in sonnet-turn.md

## STEP 4 — validate-nodefile-compliance.mjs + hook

**Owner:** Sonnet-13 | **Tier:** full-advance
**Reuse:** existing validator pattern + verify.mjs cycle registration.
**DONE WHEN:**
- [ ] `tools/validators/validate-nodefile-compliance.mjs` — ADVISORY mode (per cruel-critic + Q4)
- [ ] Uses changed-file detection + hash cache (per bottleneck-expert)
- [ ] Scoped to CORE + L1/L2 + pillar headers (~30 files) in S068; instances S069+
- [ ] `.claude/hooks/pre-tool-use-nodefile-required.sh` installed
- [ ] verify-hooks-functional DECLARED_HOOKS updated 67 → 68
- [ ] Registered in verify.mjs pipeline
- [ ] Behavioral test `tools/tests/behavioral/nodefile-contract-test.sh`: (A) compliant→pass / (B) missing-delta→advisory / (C) S069-blocking-sim→fail. 3/3.
- [ ] CHECKPOINT in sonnet-turn.md

## STEP 5 — pending-nodes register

**Owner:** Sonnet-13 | **Tier:** check-in
**Reuse:** GENERALIZE existing pending-plan-items.yaml (per consolidation-expert).
**DONE WHEN:**
- [ ] `tools/data/pending-nodes.yaml` created — superset schema of pending-plan-items
- [ ] Existing pending-plan-items entries migrated (currently drafts: [])
- [ ] Schema: id / detected_at / incoming_artifact_ref / detection_reason / process_triggered / state / resolution_node_id
- [ ] Opus-review-queue integration (Q7): stale >7 days → weekly cron escalates
- [ ] CHECKPOINT in sonnet-turn.md

## STEP 6 — PART 1 SEAL

**Owner:** Sonnet-13 + Opus-12 | **Tier:** full-advance
**DONE WHEN:**
- [ ] All STEP 1-5 CHECKPOINTs present in sonnet-turn.md
- [ ] verify --strict exit_code=0 THIS-HEAD
- [ ] Opus-12 OPIA 15-point audit passes
- [ ] MASTER-RE-GATE-PLAN-S068 PART 1 checkbox marked SEALED
- [ ] git push origin main

---

## DONE WHEN (whole PART)

PART 1 is DONE WHEN all 6 STEPs above pass their per-STEP DONE-WHEN, AND:
- Pillar numbering is unique (no pillar-1 collision)
- SPINE-PILLAR-MAP + NODEFILE-CONTRACT ratified and on origin/main
- validate-nodefile-compliance ADVISORY-active + cached + scoped to ~30 files
- pending-nodes register live (generalized, not parallel)
- verify --strict exit_code=0
- Opus-12 OPIA audit SEALED

---

## ZF gate

Sonnet-13 emits ZF Cycles after EACH STEP CHECKPOINT in [sonnet-turn.md](../../../tools/council/sonnet-turn.md):
- Cycle 1: names files touched + grep-counts (STEP 1) + validator/test exit codes
- Cycle 2: re-checks Cycle 1 areas + 0 new findings (if non-zero, add Cycle 3)
- Status: ZF ACHIEVED only when latest cycle returns 0 new

Opus-12 runs 15-point OPIA per [opia-checklist.md](../../../tools/council/opia-checklist.md) before PART 1 SEAL and before authorizing PART 2.

---

## NEXT PART

On PART 1 SEAL → [PROTO-S068-PART-2-THRESHOLD-COMPLETE](PROTO-S068-PART-2-THRESHOLD-COMPLETE.md) (Condition #1, first priority). Opus-12 authors it after PART 1 substrate lands.
