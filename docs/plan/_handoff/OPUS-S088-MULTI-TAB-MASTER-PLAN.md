---
id: csps.handoff.opus-S088-multi-tab-master-plan
name: OPUS-S088-MULTI-TAB-MASTER-PLAN
description: >
  Consolidated multi-session / multi-tab execution plan (S088). Every open track from this session
  + the prevention moat + the DNA-Guardian + the parked backlog, ordered into batches with explicit
  Opus / Sonnet / Haiku roles and tab assignments. SSoT for WHAT-NEXT; authoritative source of
  individual parks remains tools/data/park-register.yaml and findings = gap-recurrence-register.yaml.
version: "1.0"
session: S088
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
  - { rel: law, href: ../pillar-0-governance/SHIPPABLE-GREEN-PROTOCOL.md }
  - { rel: dna-guardian, href: ../../../.claude/agents/dna-guardian.md }
  - { rel: parks, href: ../../../tools/data/park-register.yaml }
  - { rel: findings, href: ../../../tools/data/gap-recurrence-register.yaml }
---

# Opus S088 Multi-Tab Master Plan — ordered tracks, explicit roles

## STANDING ROLES
- **Opus** (director): plan/decompose into core-seeds, ratify, **counter-sign every SEAL only after independent reproduction** (incl. live render via WebFetch/Playwright). Sensitive plan text + core-seeds.
- **Sonnet** (builder): full FSE build (T1 hook + T2 validator + T3 + ratified-standards entry) + a BLOCK-TEST per item proving it FAILS on a planted defect. Sets BUILD-COMPLETE; never SEAL.
- **Haiku** (scout, QUARANTINE until aligned): restricted-tools + pointers-only mechanical breadth scans; **output spot-checked before use** (returned false data S088). Never decides/synthesizes/edits.

## HARD GATE (Governor-only, blocks Track C)
**PARK-009 — 2026-06-27:** rotate Supabase password + `prisma db push`. Unblocks PARK-043 journey orchestrator (B5/B6). No AI action possible; surfaces in both tabs.

## TRACK A — PREVENTION MOAT (active completion; what we started) — Sonnet primary
Source: SHIPPABLE-GREEN-PROTOCOL.md + PROTO-S088-SHIPPABLE-GREEN-BUILD. Batches in optimal order:
- **A1 (do first) — make self-learning act-forcing:** validate-prevention-coverage BLOCKS on per-finding k≥3 OR overdue (not just aggregate≥25); fix doc/code threshold mismatch. + clear imp_TRANSIENT_STOP_HOOK_K3 (k=3, CRLF false-positive) + add .gitattributes for line-ending normalization.
- **A2 — build-reality gates:** CS1 `next build` in verify+CI · CS2 submodule-deliverable gate · CS3 deploy-root self-containment (fix confirmed spine/enums fallback).
- **A3 — seal + production-truth:** CS5 two-party-seal · CS6 http-smoke render+provenance BLOCKING + Playwright wiring · CS8 why http-smoke didn't catch the 404 (AP-001).
- **A4 — determinism + scout + cadence:** CS7 content-hash freshness (replaces mtime cascade) · CS9 scout-output verification contract · CS4 stage-before-verify wrapper.
- Each CS → ratified-standards.yaml entry (Pipeline A). Block-tests also drain gap_VALIDATOR_BEHAVIORAL_TEST_COVERAGE (80% of 241 validators lack tests).

## TRACK B — DNA-GUARDIAN — Opus design, Sonnet build (after A2)
- **DONE (swift kernel S088):** dna-guardian agent + external-capability-alignment.yaml registry + claude_agent anchor. playwright/haiku-scout/otosan-wp = QUARANTINE.
- **DEEP DIVE → PARK-S088-DNA-GUARDIAN:** validate-external-capability-alignment.mjs (ADVISORY→BLOCKING); automated vocabulary/principle translation layer; migration-hardening research (keep platform core unpolluted); review every QUARANTINE capability → ALIGNED. Low-blast items first.

## TRACK C — POST-DB (blocked on PARK-009) — Sonnet
PARK-043 journey orchestrator (B5/B6) · orchestrator persistence + pipelines + core-spines (Phase 2) · dev/external branch build (Phase 3) · System 5 tiers & permissions (Phase 4).

## TRACK D — PARKED BACKLOG (drain via findings-actuator; authoritative = park-register.yaml)
Highest-k first: imp_TRANSIENT_STOP_HOOK_K3 (k3, in A1) · gap_SESSION_INJECTION_COMPRESSION (k2) · gap_INSTRUCTION_INTEGRITY (k2, → CQS T1/T2) · PARK-048 consolidate-vs-dedicated DNA · PARK-053 circular model-orchestration · PARK-S088-001 Comm-Harvest+Council moat · STT/voice · Daily/Weekly/Monthly improvement loop. PCR research PARK-S088-002 (WordPress multisite) / PARK-S088-003 (social MCP) = research-parked.

## TAB ASSIGNMENT (parallel-safe)
- **Tab 1 (this — Opus):** ratify, counter-sign SEALs, plan/decompose, DNA-Guardian design.
- **Tab 2 (Sonnet):** Track A in batch order (A1→A4), then Track B deep build.
- **Haiku:** spawned bounded by whichever tab needs a scan; output always verified.

## PE-RANKED EXECUTION QUEUE (S088 close → Phase 2) — optimized plan
> Built on the verified S088-close state (Track A SEALED; HEAD post-f1a57101; all enhancements parked).
> PE = urgency × impact ÷ effort (each 1–5; higher PE = do first). Absorbs Sonnet's final close-summary delta.

**TIER 1 — IMMEDIATE / GATING**
| Unit | u | i | e | PE | Owner |
|---|---|---|---|---|---|
| **PARK-009 db-push** (rotate pw → `?pgbouncer=true` → `prisma db push` → verify) — 2026-06-27 | 5 | 5 | 1 | **25** | Governor-only |
*Unblocks everything in Phase 2. Nothing else proceeds in parallel with higher value.*

**TIER 2 — GOVERNANCE-DEBT + HYGIENE (one focused session, post-db — the "accumulate-don't-resolve" cleanup cluster)**
| Unit | u | i | e | PE | Owner |
|---|---|---|---|---|---|
| Debris gitignore `*-last-run.json` (tree_hash-excluded already → safe) | 3 | 3 | 1 | **9** | Sonnet |
| `validate-floater-escalation.mjs` (overdue floater BLOCKS — mirrors prevention-coverage k≥3) | 4 | 4 | 2 | **8** | Sonnet |
| 26-floater batch terminal decisions (RATIFY/SUPERSEDE/ARCHIVE; ~30 min, likely most SUPERSEDED) | 4 | 4 | 2 | **8** | Governor |
| MEMORY.md cluster-consolidation (over-budget; before/after counts, no DNA loss) | 3 | 4 | 3 | **4** | Opus (fresh budget) |
*These four are the SAME class (defer-without-resolution) → run them as ONE session. Highest ROI: low-med effort, clears 20+ sessions of debt + restores recall.*

**TIER 3 — PHASE 2 BUILD (post-db)**
| Unit | u | i | e | PE | Owner |
|---|---|---|---|---|---|
| Journey orchestrator PARK-043 (B5/B6) — the Phase-2 headline | 4 | 5 | 4 | **5** | Sonnet |
| One-tab loop-engine PILOT (one gate): loop-contract (ERC-003) + per-cycle WAL (ERC-004) + deterministic orchestrator (ERC-007) | 3 | 5 | 4 | **3.75** | Opus seed → Sonnet |
*Loop pilot is GATED on PARK-039 (Haiku activation) — confirm Haiku spawns reliably FIRST, else it degrades to Sonnet-only (cost collapse, per council).*

**TIER 4 — GATED / LATER**
Haiku-audit-battery + Daily/Weekly/Monthly improvement loop (needs PARK-039 + db) · council-failed-to-ask 5-gap cluster (fold into loop-engine design) · multi-tenant isolation (Phase 4 — also triggers S049/S050 cutover) · explorations ClarityFlow/WordPress/social-MCP/CSP-UX-audit (trigger-gated) · UX-version-history.

**PE SEQUENCING RECOMMENDATION (the optimized path):**
`db-push (T1) → governance-debt+hygiene session (T2, one focused pass) → Phase-2 build (T3) → gated/later (T4)`.
Debt-first: do NOT start T3 before T2 (20+ sessions of floater debt + over-budget memory degrade every later decision). Confirm PARK-039 (Haiku) before scheduling the loop pilot. Multi-tenant + S049/S050 stay deferred to Phase 4 by ratified decision.
