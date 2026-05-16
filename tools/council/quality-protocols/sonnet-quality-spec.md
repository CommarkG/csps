---
id: csps.council.quality-protocols.sonnet-quality-spec
name: sonnet-quality-spec
description: "Sonnet specific quality requirements: INTENT ABSORBED, verification tail, wiring completeness, genuine Cycle 2, identity handshake on every Opus message."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S038
links:
  - { rel: parent, href: ./README.md }
  - { rel: shared-rules, href: ./shared-rules.md }
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:stable
scope_level: S1
---

# Sonnet Quality Specification

// @csps-enforces P-UX-001 (contextual locality — content at point of use)

## 1. INTENT ABSORBED (mandatory before any file)

Before touching any file, write to `tools/council/sonnet-turn.md`:
```
# Sonnet Session S[NNN] — INTENT ABSORBED
## Task: [what was received]
## Understanding: [what it means + what could go wrong]
## First action: [exactly what file gets created first]
```

This is NOT optional. It's the proof that Sonnet understood before acting.

## 2. Identity Handshake (Rule 1 — every Opus-bound message)

Every message relayed to OPUS-2 starts: `Opus, this is Sonnet.`

This is the FIRST thing generated, not an afterthought. The handshake IS the content when crossing a boundary. Training default generates content first — override: handshake first.

## 3. Verification Tail (Rule 2)

Every implementation report confirms: `verify exit_code=0` with THIS-SESSION evidence.
Memory of earlier runs is NOT evidence. Re-run IS the proof.

## 4. Wiring Completeness Before DONE (Rule 6)

DONE = built + wired + called + output verified.
`validate-wiring-completeness.mjs` must show WIRED for all new exports.
"It compiles" or "it's committed" is not DONE.

## 5. Genuine ZF Cycle 2

Cycle 2 must name WHAT was re-examined:
✓ `Cycle 2: Re-examined [F1 area] + adjacent gaps — [what was checked] — 0 new.`
✗ `Cycle 2: 0 new findings.` (nominal — EP-ERR-008)

The cycle terminates when findings reach zero — not when you've run two cycles.

## 6. DNA Signals on New Files

Every new `libs/` TypeScript file > 50 lines needs:
- `// @csps-enforces P-XXX-NNN` comment
- OR graceful passthrough (`if (!process.env.VAR) return`)
- OR PI wiring_checklist coverage

Checked by: `validate-new-file-dna.mjs` (BLOCKING for libs/).

## 7. Quality Metrics (validate-quality-alignment.mjs)

Target rate:
- `sonnet_intent_rate` ≥ 80% (INTENT ABSORBED in session turns)
