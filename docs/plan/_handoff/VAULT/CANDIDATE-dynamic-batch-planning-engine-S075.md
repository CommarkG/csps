---
id: csps.handoff.vault.candidate-dynamic-batch-planning-engine
name: CANDIDATE-dynamic-batch-planning-engine
description: "Governor S075 idea (VAULTED, not interrupting the active plan): an engine for the OPTIMAL way to implement batches — contextual not rigid. Tight oversight on sensitive parts (reduce-then-Governor-overview), long uninterrupted runs for technical/low-risk parts. Research dynamic batch planning (how it's defined + made to work), present best option."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: sandbox
next_review_at: "2026-07-01"
core_spine: OPER
core_spines: [OPER, GVRN]
schema_anchor: vault_files
session: S075
dpr_rating: 3
dpr_meaning: "interrupt-at-boundary — process after the active plan (PART 3 migration + B1-B5 queue), NOT now. Governor may elevate to DPR-4/5 to pull it forward."
status: research-pending
links:
  - { rel: routed-via, href: ../../../.csps/threshold/intake-log.yaml }
  - { rel: cadence-precedent, href: "memory:feedback_multibatch_longrun_cadence" }
tags: [domain:operations, domain:governance, type:reference, audience:ai-agent, maturity:draft]
---

# CANDIDATE — Dynamic Batch-Planning Engine (vaulted S075, DPR-3)

## Why vaulted, not built now
This is NEW SCOPE raised mid-active-plan (PART 3 migration gated on Governor's local run + B1-B5 queue). DPR rule:
only a Governor DPR-4/5 interrupts an active plan; this is DPR-3 (interrupt-at-boundary) → process after the active
plan, OR Governor elevates. Honest note: the native default (D1 eager-helpfulness / D7 action-bias / new-over-active)
would have dived into research immediately — vaulting is the antidote firing, demonstrated live for the Governor's test.

## The Governor's intent (verbatim-grounded)
"An engine for the optimal way of implementing batches — not rigidly, always with context. Sensitive parts: reduce
to a tight point, then I overview what it does (I like that). But sometimes a long run without stops for technical
things is the better option. Research dynamic batch planning — how people define it and make it work — present the best."

## What exists already (go-over-what-exists — to anchor the research, not duplicate)
- feedback_multibatch_longrun_cadence: "Opus issues whole-plan PROTOs; Sonnet runs through; R-class stops only." +
  per-batch ACK = nominal stop.
- The current linear OPIA model (one batch → verify → accept → next) = the OPPOSITE end (max oversight, max stops).
- DPR (1-5) + R-class stop triggers + SPI batch-sizing already exist. The engine would make batch-granularity
  CONTEXTUAL (risk-tiered), not a fixed mode.

## Research questions (when processed)
1. How is "dynamic batch planning" defined in the field (CI/CD batch sizing · Kanban WIP limits · risk-based
   change batching · batch-size economics from Reinertsen's product-dev flow · trunk-based "batch of one" vs batched
   releases · DORA change-batch findings)?
2. The core design fork: a RISK-TIER classifier per batch → high-risk/irreversible (DB, deploy, external state,
   governance core) = tight OPIA gate + Governor overview; low-risk/reversible/technical (validators, docs, refactors)
   = long uninterrupted run, single SEAL. The engine assigns the mode per-batch from context, not globally.
3. How to make the long-run-without-stops SAFE: the L2 recurring re-test + the verify-before-concur floor
   (HARDWIRE-008) are the safety net that LETS a long run skip per-batch human gates.

## Recommended processing slot
After PART 3 SEAL + the B1-B5 queue (or as its own ratified workstream if the Governor DPR-elevates). Research →
sandbox spec → council ratify → build (extend the existing cadence + DPR + R-class machinery; mint nothing parallel).
