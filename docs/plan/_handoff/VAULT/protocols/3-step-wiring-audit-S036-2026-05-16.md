---
id: csps.protocols.3-step-wiring-audit-s036
name: 3-step-wiring-audit-s036
description: "3-Step Wiring Audit Protocol for S036 — audit libs/ exports, OPUS-2 triage, implement fixes"
version: 1.0.0
owner: group:finky
lifecycle: experimental
lifecycle_state: active
protocol_name: "3-Step Wiring Audit Protocol"
protocol_id: PROTO-001
session: S036
date: 2026-05-16
current_step: 1
total_steps: 3
status: active
steps:
  - step: 1
    owner: sonnet
    mode: simultaneous-with-step-2
    status: pending
    description: "Audit all libs/ exports — grep apps/ imports — present WIRED/ORPHAN table"
    gate: "OPUS-2 must receive findings table and respond with triage before Step 3 starts"
  - step: 2
    owner: opus-2
    mode: simultaneous-with-step-1
    status: in-progress
    description: "Create bootstrap PI-001, PI-002, PI-003 files while Sonnet audits"
    gate: null
  - step: 3
    owner: sonnet
    mode: sequential-after-step-1-and-opus2-triage
    status: blocked-on-gate
    description: "Implement triage decisions + add P-ARCH-031 + create topic-plan + run wiring validator"
    gate: "OPUS-2 triage decisions required (per item: WIRE NOW / DEFER / DEPRECATE)"
referenced_turns:
  - "opus-turn.md Turn 62 (Completion Seal, 10 orphans identified)"
  - "opus-turn.md Turn 64 (Step 1 directive text)"
  - "opus-turn.md Turn 65 (multi-step format definition)"
  - "opus-turn.md Turn 66 (protocol file format, paste-target UX)"
---

# 3-Step Wiring Audit Protocol (PROTO-001)

## Current Status: Step 1 Pending

## Step 1 Paste Target (Sonnet)

```
[PROTOCOL: PROTO-001 | STEP: 1 of 3 | MODE: simultaneous-with-OPUS-2 Step 2]
Sonnet, this is Opus. Read tools/council/opus-turn.md Turn 64 §6 Step 1 — AUDIT ONLY, zero implementation: read every index.ts in libs/components/src/ and libs/integrations/*/ — list every exported symbol; for each, grep apps/*/src/ for any import — report WIRED / PARTIALLY WIRED / ORPHAN; for each orphan, check if wiring_deferred_until: comment exists in source file; present findings as a structured table: Symbol | File | Wired? | Import location | Notes. DO NOT create, edit, or commit any file.
```

## Step 2 (OPUS-2 — simultaneous with Step 1)

OPUS-2 creates PI-001 through PI-003 bootstrap YAML files while Sonnet audits.

## Step 3 Paste Target (Sonnet — provided after OPUS-2 triage)

Will be written here after OPUS-2 reviews Step 1 findings.

## Completion Criteria

- [ ] Step 1: Sonnet's findings table received by OPUS-2
- [ ] Step 2: PI-001, PI-002, PI-003 files created by OPUS-2
- [ ] GATE: OPUS-2 triage decisions written per orphan
- [ ] Step 3: All wiring done + P-ARCH-031 in principles.yaml + validate-wiring-completeness.mjs built + pnpm verify exit_code=0
