---
id: csps.council.sonnet-prompt-S041-alignment
name: sonnet-prompt-S041-alignment
description: "Sonnet directive for S041 Sprint 1 — aligning HOW WE PLAN + HOW WE IMPLEMENT + HOW WE CHECK. Prevention-first. Threshold connection. Self-contained. No navigation required."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: council_state
session: S041
---

# Sonnet Directive — S041 Sprint 1

## COPY BELOW THIS LINE

---

```
[PROTOCOL: PROTO-022 | STEP: 1 of 5 | MODE: sequential]

YOU ARE: Sonnet, the builder in Claude Code VS Code tab.
I AM: Yariv Fink (Governor). Opus has completed S040 architectural alignment.
THIS IS THE SITUATION: CSPS S041. verify exit_code=0. Commit: 0fc57a3.
  Opus found 3 major misalignments: HOW WE PLAN / HOW WE IMPLEMENT / HOW WE CHECK
  are not connected to threshold, DNA, or Core Scopes. Prevention focus missing.
YOUR TASK: Execute 5 steps in order. Report commit SHA after each step.

─────────────────────────────────────────────────────────────────────────────
STEP 1 — P-META-027 (PRACE) in principles.yaml
─────────────────────────────────────────────────────────────────────────────

Read packages/principles/principles.yaml.
Find the last P-META-* entry. Add P-META-027 immediately after it:

  - id: P-META-027
    name: PRACE-enforcement-philosophy
    description: >
      Permanent Recurring AI Contextual Enforcement — every governance rule must be designed
      understanding: (1) training default being overridden, (2) satisfaction point being prevented,
      (3) full reasoning with context (not just the instruction), and (4) T1+T2+T3 mechanical enforcement.
      Rule text = 0% complete. T1+T2+T3 wired = 100% complete.
    category: meta
    spine: GVRN
    l_level: L1
    ratified_at: 2026-05-18
    ratified_by: yariv
    session: S040
    enforcement:
      t1: user-prompt-submit-ai-profiler.sh (enforcement mode)
      t2: validate-rule-has-enforcement.mjs
      t3: session-open.sh PRACE block
    cross_references: [P-META-019, B_PRACE, M-27]
    composes_with: [P-META-006, P-META-009, P-META-019, P-META-021]

Run pnpm principles:split (if available) or pnpm contracts:split after adding.
Verify: grep "P-META-027" packages/principles/principles.yaml → must find it.

─────────────────────────────────────────────────────────────────────────────
STEP 2 — Prevention Analysis section in gradual-build-plan.template.md
─────────────────────────────────────────────────────────────────────────────

Read tools/templates/gradual-build-plan.template.md.
Find the existing sections (Foundation Layer, etc.). 
Add a new mandatory section "## Prevention Analysis" BEFORE "## Foundation Layer":

## Prevention Analysis (Core Scopes — MANDATORY)

> Reference: docs/plan/pillar-0-governance/core-scopes.md
> Core Spines governing this plan: [declare which L1/L2 spines govern this work]
> Training default being overridden: [name the AI default this plan fights]

### Scope-1 Risks (Immediate — what could go wrong this session)
- Risk: [specific risk]
- If triggered: [immediate fix path]

### Scope-2 Ripples (Connected elements — what else changes when this plan executes)
- Connected to: [list artifacts, files, validators that are affected]
- Ripple check: before commit, confirm all connected elements are consistent

### Scope-3 Prevention (Permanent — what structural fix prevents this class of problem)
- Class of problem: [name the category, not the instance]
- Training default: [which DEFAULT-R* or DEFAULT-ME-* from profile-registry.yaml]
- T1/T2/T3 needed: [hook / validator / session injection to install]

Also add this line to the plan header section:
  threshold_submitted: false  # set to true when plan submitted to threshold for assessment

─────────────────────────────────────────────────────────────────────────────
STEP 3 — Threshold connection in fse-creation-template.md
─────────────────────────────────────────────────────────────────────────────

Read docs/plan/pillar-0-governance/fse-creation-template.md.
Find the "When to use this template" section.
Add after the section list:

## Threshold Gate (Required for Scope-3 findings)

When creating a new governance rule that is a Scope-3 prevention response:
1. Fill the PRACE template (training default + satisfaction point + T1/T2/T3)
2. Submit to threshold: the threshold-intake-protocol.md assesses if this is a new pattern or recurring
3. Threshold verdict determines: OPEN-NNN (new pattern) vs UPGRADE (strengthen existing rule)

Reference: docs/plan/pillar-0-governance/threshold-intake-protocol.md
Reference: docs/plan/pillar-0-governance/core-scopes.md (Scope-3 definition)

─────────────────────────────────────────────────────────────────────────────
STEP 4 — Core Scopes [S1]/[S2]/[S3] tags in open items format
─────────────────────────────────────────────────────────────────────────────

Read tools/council/opus-open-items.md.
Update the header comment (around line 13) to add scope tagging guidance:

Change:
  Updated: 2026-05-16 S037-B | Every turn: check this before writing anything new.
To:
  Updated: 2026-05-18 S041 | Every turn: check this before writing anything new.
  Scope tags: [S1]=fix now (same session) | [S2]=ripple check needed | [S3]=PRACE analysis required

Update the OPEN items table header to add Scope column:
| ID | Item | Announced | Status | Scope | Blocks | PI Ref |

Add [S3] to the most critical pending prevention items:
OPEN-039, OPEN-046, OPEN-047, OPEN-048 → tag as [S3] (require PRACE analysis)
OPEN-040, OPEN-041, OPEN-042, OPEN-043, OPEN-044 → tag as [S2] (ripple check needed)
Others marked pending → [S1] (can fix in one session)

─────────────────────────────────────────────────────────────────────────────
STEP 5 — post-stop-pcr-check.sh upgrade from STUB to advisory
─────────────────────────────────────────────────────────────────────────────

Read .claude/hooks/post-stop-pcr-check.sh.
Replace its content with a real implementation:

#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-pcr-check
# @csps-name post-stop-pcr-check
# @csps-description PostStop hook — scans last response for multi-option decisions
#   without PCR (Pros/Cons/Recommendation) blocks. Advisory: B_PCR_FOR_DECISIONS.
#   Promoted from STUB to ADVISORY in S041 Sprint 1 (PRACE Scope-3 fix).
# @csps-version 2.0.0
# PRACE: Training default = present options without PCR structure.
#        Satisfaction point = "I gave the user options to choose from."
#        CSPS override = every multi-option presentation needs Pros/Cons/Recommendation.

set -euo pipefail

TRANSCRIPT="${CLAUDE_TRANSCRIPT_PATH:-}"
if [ -z "$TRANSCRIPT" ] || [ ! -f "$TRANSCRIPT" ]; then
  echo "[pcr-check] no transcript path — skipping"
  exit 0
fi

# Read last assistant message
LAST_MSG=$(tail -c 5000 "$TRANSCRIPT" 2>/dev/null || echo "")

# Check for multi-option patterns WITHOUT PCR structure
HAS_OPTIONS=false
HAS_PCR=false

if echo "$LAST_MSG" | grep -Eqi '\b(Option [A-Z]|option [0-9]|should we|which approach|PCR|A vs B|alternative[s])\b'; then
  HAS_OPTIONS=true
fi

if echo "$LAST_MSG" | grep -Eqi '(Pros:|Cons:|Recommendation:|**Pros|**Cons|## Pros|## Cons)'; then
  HAS_PCR=true
fi

if [ "$HAS_OPTIONS" = "true" ] && [ "$HAS_PCR" = "false" ]; then
  echo "[pcr-check] ADVISORY: multi-option response detected without PCR structure"
  echo "[pcr-check] B_PCR_FOR_DECISIONS requires Pros/Cons/Recommendation for non-trivial decisions"
  echo "[pcr-check] Add PCR before presenting options to Governor"
fi

exit 0

─────────────────────────────────────────────────────────────────────────────
VERIFICATION (after all 5 steps)
─────────────────────────────────────────────────────────────────────────────

Run: node tools/verify.mjs → exit_code must be 0

COMMIT: "feat: S041 Sprint 1 — PRACE P-META-027 + prevention alignment + Core Scopes tagging"
PUSH: git push origin main

REPORT BACK:
  - New commit SHA
  - Last 5 lines of verify output
  - Confirmation that P-META-027 is findable in principles.yaml
  - Count of lines in gradual-build-plan.template.md (should be larger after Prevention Analysis)

─────────────────────────────────────────────────────────────────────────────

CONTEXT (read this — do not navigate):

The alignment plan is at: tools/council/multi-session-plan-S041-alignment.md

Three critical misalignments this Sprint 1 addresses:
1. HOW WE PLAN: no prevention analysis required (fixed by Step 2)
2. HOW WE IMPLEMENT: no threshold connection in FSE template (fixed by Step 3)
3. HOW WE CHECK: findings have no structured routing (future Sprint 2 — findings-categorizer.mjs)

Prevention is now a named main issue in CSPS. Every plan, every implementation,
every audit output must go through the three Core Scopes before closing.

pnpm dna:bundle --target=new-ai-tab outputs the full CSPS context if needed.
```
