---
id: csps.handoff.opus-tab-transfer-s076
name: OPUS-TAB-TRANSFER-S076
description: >
  OPUS-16 → OPUS-17 director tab-transfer (mid-S076). Self-contained: a fresh Opus director tab resumes cold
  from this without re-absorbing session history (per agent-decoupling Design-Goal-6: orient from wired state).
  Active: dim-3 agent-decoupling build (spec RATIFIED, Phases A-E). Parallel: PART 3 migration (Governor). Then dim 4.
version: 1.0
session: S076
owner: group:finky
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, VALD]
schema_anchor: vault_files
lifecycle: production
lifecycle_state: active
layer: scaffold
disposable_if: arrangement_changes
links:
  - { rel: dim3-spec, href: VAULT/SANDBOX-agent-decoupling-spec-S076.md }
  - { rel: dim3-source, href: VAULT/AGENT-DECOUPLING-ARCHITECTURE-S075.md }
  - { rel: dim4, href: VAULT/MULTI-TENANT-SCALE-READINESS-S075.md }
  - { rel: prior-handoff, href: HANDOFF-S075-to-S076.md }
  - { rel: scorecard, href: HANDOFF-S075-to-S076.md }
---

# OPUS-16 → OPUS-17 — director tab-transfer (S076)

## WHO/NOW (orient from the WIRED SYSTEM, not this narrative — Design-Goal-6)
You are OPUS-17, architectural DIRECTOR (Sonnet builds; you direct + independently verify). Linear council.
Cold-start: M-43 → `node tools/verify.mjs --skip-install` (expect exit_code=0) → read `tools/council/opus-turn.md`
TOP (current PROTO) + `tools/council/sonnet-turn.md` TOP (Sonnet's latest). That + this file = full context. HEAD ≈ (latest main).

## ZONE A — State
verify exit_code=0 · 78 hooks · default-registry 19 entries (D1-D19) · S075 SEALED (f371923c) · S076 active.
Council mode LINEAR: Sonnet builds one batch (or long-run), you re-derive + OPIA before authorizing next.
VERIFY-BEFORE-CONCUR (HARDWIRE-008): every OPIA verdict cites a THIS-TURN tool re-run. Re-run IS the proof.

## ZONE B — FOUNDATION SCORECARD (foundation = ALL 4; B-queue was only dim 1)
1 Governance/AI-collaboration — ✅ SEALED (S075 B1-B5).
2 PART 3 product schema — ◐ migration PENDING Governor local DB run (5 steps; corrected C1/C2/C3; commit 88f296a5).
  When Governor pastes the 2 DENIED outputs → independently verify (enhanced client, RLS active) → SEAL.
3 Agent-decoupling (DPR-4) — ◑ IN BUILD: spec RATIFIED, Phases A-E (PROTO-S076-DIM3-BUILD on opus-turn.md).
4 Multi-tenant scale-readiness (DPR-3) — ◯ research-pending (after dim 3).
Apps come ONLY after all four. A crooked core multiplies ×30.

## ZONE C — dim-3 active build (what you're verifying)
Spec: VAULT/SANDBOX-agent-decoupling-spec-S076.md (4 surfaces: layer-split / agent-deletion-test / generalize-floors
/ executor-contract + 3 scenarios). RATIFIED with Q1-Q5 answers:
  Q1 floor=CI/executor-contract (c); council=amplifier above. Q2 council-address→role-id (scaffold). Q3 promote
  nominal-rzf-detector ADVISORY→BLOCKING AFTER a clean window (not immediately; cry-wolf de-risk). Q4 D15+D18=SYSTEM,
  D16/D17/D19=SCAFFOLD (line: how-any-executor-behaves=system; director-builder-relationship=scaffold). Q5 generalize
  COMMENTS-BEFORE-CODE to ≥4-file/consequential batch.
Phases: A classify (layer: field) → B generalize floors off roles → C agent-deletion-test (keystone) → D executor-
contract validator → E council-address role-check. dim 3 SEALED when deletion-test PASS + verify=0. Long-run, R-class stops only.

## ZONE D — Open / Carry-Forward
| Item | Owner | Next |
|---|---|---|
| dim 3 Phases A-E | Sonnet build / Opus OPIA | verify each phase block-test; SEAL on deletion-test PASS |
| PART 3 migration (dim 2) | Governor (local DB) | runs 5 steps → Opus verifies 2 DENIED → SEAL |
| dim 4 scale-readiness | Opus directs after dim 3 | connection-pool contract, per-tenant quota, RLS perf, N×M load test |
| Orphan hooks (20) | Opus R-class | audit-zero-event-hooks.mjs --verbose |
| Pattern A-F death_date=S078 | Governor | confirm blast-radius by S077 |
| Significance Engine (sandbox) | council ratify | SIGNIFICANCE-ENGINE-SANDBOX-S075.md |
| dynamic-batch-planning (DPR-3) | vaulted | CANDIDATE-dynamic-batch-planning-engine-S075.md |

## DISCIPLINES INHERITED
verify-before-concur (D14/HARDWIRE-008) · go-over-what-exists (D12 + ECA; configs live in tools/config not tools/data —
my repeated miss) · reasoned-adoption (P-META-031: override = reasoning+reframe+cited-SP) · no new director/role
defaults until the layer-split (dim 3) lands · HARDWIRE 4-layer · cry-wolf fix (post-stop-verify keys on exit_code) ·
the recurring concurrency transient (~K=6: surface loud, clean at HEAD — don't panic, re-derive).

## ALIGNMENT QUESTIONS (for fresh OPUS-17)
Q1 verify exit_code=0 this turn? (re-run, cite). Q2 latest Sonnet phase SEAL on opus-turn/sonnet-turn TOP?
Q3 has Governor run PART 3 migration (DENIED outputs pasted)? Q4 which is next: continue dim-3 phase OPIA · PART-3 SEAL · dim-4 open.

— OPUS-16 · S076 · 2026-06-01 · I have 120K but Governor directed a fresh Opus tab; this is the clean boundary (dim-3 spec ratified, build queued).
