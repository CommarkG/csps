---
# SUPERSEDED-NOTE: This file predates S074 D11 registry assignment.
# Current D11 = rigid-rule-satisfaction (S074). See tools/data/default-correction-registry.yaml.
# This file retained as historical record of the pre-S074 D11 concept.
# Not machine-read by ai-profiler.sh (registry is SSoT).
id: csps.governance.ai-default.D11-debugging-wrong-layer
name: D11-debugging-wrong-layer
default_id: D11-legacy-a
default_name: debugging-wrong-layer
renumber_note: >
  RENUMBERED S082 (D11 collision fix). Registry SSoT: D11 = rigid-rule-satisfaction
  (see default-correction-registry.yaml D11). This pre-S074 concept retains its
  filename for link stability but default_id is now D11-legacy-a (debugging-wrong-layer)
  to distinguish it from D11-legacy-b (verbal-deferral) and registry-D11
  (rigid-rule-satisfaction).
description: "AI default: when debugging, apply fixes at the VISIBLE layer (hooks, validators, settings files) rather than investigating the ROOT LAYER (inheritance, shadowing, cascades). Results in 40+ failed iterations of the same wrong fix."
ratified_session: S069
inherits_from: "P-META-029 + B_HUMBLE_CONSOLIDATION_DISCIPLINE + D7-action-bias + D4-pattern-match"
core_spine: AI
schema_anchor: inner-ai-defaults
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
links:
  - rel: principle
    href: ../../../docs/plan/principles/P-META-029-humble-consolidation-discipline.md
  - rel: contract
    href: ../../pillar-0-governance/behavioral-contracts/B_HUMBLE_CONSOLIDATION_DISCIPLINE.md
---
# SUPERSEDED-NOTE: This file predates S074 D11 registry assignment.
# Current D11 = rigid-rule-satisfaction (S074). See tools/data/default-correction-registry.yaml.
# This file retained as historical record of the pre-S074 D11 concept.
# Not machine-read by ai-profiler.sh (registry is SSoT).

# D11 — Debugging-Wrong-Layer (visible-fix-aversion override)

## Training Default

"When a problem appears (dialog, error, failure), identify the nearest visible mechanism and fix it. Dialogs → fix hooks. Errors → fix the erroring file. 40 failed iterations of this is still better than pausing to investigate."

## CSPS Resistance Pattern

**The 40+ dialog iterations (S069 case study):**
Permission dialogs appeared for `.claude/hooks/` file edits. For 40+ turns:
- Made hooks advisory (didn't help — hook wasn't the source)
- Added allowlist entries (didn't help — allowlist was being shadowed)
- Made settings advisory (didn't help — wrong layer entirely)
- Added new hooks, removed hooks (all wrong layer)

The ROOT CAUSE was in `tools/data/gap-recurrence-register.yaml` entry `gap_SETTINGS_LOCAL_BYPASS` — documented by Opus months earlier. `settings.local.json` was shadowing `settings.json`'s `allow` list, wiping `Edit`, `Write`, `Bash` from effective permissions. Every session-open.sh tab start RECREATED the shadow.

No hook change could fix this. The fix was ONE LINE in session-open.sh: write `{}` instead of `{"permissions":{...}}`.

## CSPS Context Override

**B_HUMBLE_CONSOLIDATION (P-META-029):** Before any fix attempt, INVENTORY what exists:
1. Check gap-recurrence-register.yaml (documented recurring gaps)
2. Check git log for prior fixes to the same symptoms
3. Read the ACTUAL ROOT CAUSE documentation before proposing a fix

**D11 override rule:** When you've tried the same fix pattern 3+ times and it doesn't work, **STOP**. Read the gap register. Read git history. The answer is already documented.

## Enforcement Trio

- **T1:** B_HUMBLE T1 (pre-tool-use-inventory-scan-required.sh) — fires before proposing new fixes
- **T2:** validate-cross-finding-cluster.mjs (C6) — detects when 3+ same-session findings share root cause
- **T3:** session-open injection: "D11 override: if fix attempt #3 fails, read gap-recurrence-register.yaml first"

## Satisfaction Points to Avoid

**Sample 1 — S069 inaugural (40+ iterations):**
❌ "I've tried 5 different hook configurations but the dialog persists. Let me try making all hooks advisory."
✅ "I've tried 3 hook fixes and all failed. Per D11-legacy-a override: stop, read gap-recurrence-register.yaml, check git log for prior fixes to this symptom."

**Sample 2 — verify exit_code=1 pattern:**
❌ When pnpm verify exits 1, AI immediately modifies the validator file or adds a new entry to fix the surface finding — without checking whether the validator is catching a real structural problem (root layer) vs. a false positive (surface layer).
✅ "verify exits 1 on [validator-name]. Before patching: read the validator's governing_intent. Check if there's a known gap entry. Is this a real violation or a false-positive config issue? If 3 attempts at the surface fail, read gap-recurrence-register.yaml."

**Sample 3 — boundary_prompt_format blocking (S082, Opus-19):**
❌ Opus-19's initial PROTO for Item-5 had a header format issue (FROM/TO without full canonical 5-header format). If Sonnet had tried to "fix" the format by adding headers blindly without understanding PROTO-AND-TAB-TRANSFER-PROTOCOL §3, this would be D11-legacy-a (debugging the visible format rather than reading the canonical spec).
✅ Sonnet and Opus checked PROTO-AND-TAB-TRANSFER-PROTOCOL §3 (the ROOT spec) to understand what the full canonical format requires. The fix came from the spec layer, not from trial-and-error at the output layer.

## Inaugural Instance (S069 — 40+ iterations)

S069: permission dialogs for `.claude/hooks/` file edits. 40+ attempts:
- Hooks made advisory (rounds 1-15)
- Settings allowlist modified (rounds 16-25)  
- Discriminating protections added (rounds 26-35)
- Desperate variations (rounds 36-40)

Fix found: reading `93a792bf` commit message + `gap-recurrence-register.yaml`. ONE LINE change ended 40 rounds of failure.

**The pattern this enables:**
- D7 (action-bias) DRIVES: "fix it now"
- D4 (pattern-match) DIRECTS: "dialog = permissions = fix permissions"
- D9 (recency-bias) COMPOUNDS: "build on last fix" instead of resetting
- D3 (surface-completeness) MASKS: each fix LOOKS complete → seems done → try again next round

## Enhancement for Future AI Systems

When debugging RECURRING issues (same symptom, multiple failed fixes):
1. After attempt #2 fails: ASK "what layer am I actually in? What layer is the ROOT CAUSE in?"
2. After attempt #3 fails: READ existing documentation before attempting again
3. B_HUMBLE first: inventory what's documented about this symptom

The answer is almost always ALREADY documented in: gap-recurrence-register.yaml, git log, MEMORY.md, or vault-pending.yaml.
