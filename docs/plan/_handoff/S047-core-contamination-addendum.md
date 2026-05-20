---
id: csps.handoff.S047-addendum
name: HANDOFF-S047-S048-addendum
description: "S047 post-close addendum. Core contamination removed at 1786502. AP-002 registered. Supersedes contamination state from 4ef1d38."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
session: S047
---

# S047 Addendum — Core Contamination Fix

Committed AFTER S047 HANDOFF (4ef1d38) at commit 1786502 (by Governor/Opus).
PROTO-045 addendum committed by Sonnet at 1e668f8 + b8d0715 + [this commit].

## What Was Fixed

App-specific content was found in CORE files during S047/S048 audit (OPUS-4 Turn 36):
- `csps-mapping.md`: "construction contractors and ADHD professionals" → removed
- `master-blueprint.md`: "personal ADHD productivity system" → made generic
- `csps-platform-batches.yaml`: `habit-tracker-app` in governs list → removed
- `csps-context.md`: specific app names in state description → made generic

**4-scan ZF achieved** at 1786502. grep for contractor/adhd/habit-tracker in core files = ZERO FINDINGS.

## New Anti-Pattern Registered

**AP-002 (SAMPLE-TO-CORE CONTAMINATION)** registered in anti-patterns.md:
- Examples live in `docs/plan/apps/[app-slug]/` only
- Universal patterns live in `docs/plan/universal-logic-framework/` or `tools/config/`
- AGENTS.md hard NO added
- T2 validate-core-purity.mjs (S048 build item)

## New Seed Moved

BEHAVIOR_PATTERN_REGISTER seed moved from anti-patterns.md (HTML comment → invisible to validator) to csps-platform-batches.yaml (YAML comment → validator detects it). validated: plants_by_present=5 pmi_gate_valid=5 CLEAN.

## S048 Opens Clean

Core purity restored. P-ARCH-COMPLETE-DEFAULT now correctly means "complete AND universal" — universal = no specific examples embedded in core. APP-001 content correctly lives in docs/plan/apps/APP-001-voice-sorting/.

pnpm verify: exit_code=0 confirmed after all PROTO-045 commits.
