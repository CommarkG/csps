---
id: vault.concepts.CORE-SIGNAL-FINDER
name: CORE-SIGNAL-FINDER
description: "Expert agent/skill that extracts the universal core principle from specific improvements — the essence finder that turns fixes into moats"
type: vault_concept
protection_level: active
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "0.1"
session: S051
core_spines: [AI, GVRN, ARCH]
core_spine: AI
schema_anchor: vault_files
impl_status: swift-implemented
links:
  - ai-conception.B_SIMULATION_COMPARISON
  - ai-conception.B_AI_BEHAVIOR_IN_PLANS
  - vault.concepts.DEVELOPMENT-APPROACH-SPECTRUM
context_question: "What is the universal principle hidden inside this specific improvement, and is it already in CSPS?"
context_quote: "The moat is not the fix. The moat is extracting the principle that prevents the entire class of similar issues."
inherits_from: "Platform Genome §10 Gap Recurrence Register"
---

# Core Signal Finder

## Name Ratified

Name ratified: **Core Signal Finder** (S052, OPUS-7 Turn 4)

## What It Is

An expert agent/skill that goes over improvements, corrections, vault entries, and session outputs and asks ONE question:

> "What is the ESSENCE of this improvement — the universal principle that, if applied everywhere, prevents this entire class of issues?"

## The 5-Step Process

**Step 1 — SCAN:** Go over session content, vault entries, commit messages, corrections.

**Step 2 — EXTRACT essence:**
For each improvement, find the core signal:
- NOT "we added a B_ZF_TERMINATION_DISCIPLINE vault entry"
- YES "verification must iterate until zero is confirmed, not until verification was attempted"

**Step 3 — TEST universality:**
"Does this essence apply beyond this specific case?"
If yes → universal principle candidate.

**Step 4 — CHECK existence:**
Is this essence already in CSPS principles or vault?
- EXISTS + IMPLEMENTED → note and close
- EXISTS + NOT IMPLEMENTED → escalate as enforcement gap
- DOESN'T EXIST → propose as new principle

**Step 5 — PROPOSE or ESCALATE:**
Output: proposed principle name + definition + where to implement

## Why This Is a Moat

Most platforms learn reactively: failure occurs → fix is applied → similar failure occurs later.

CSPS with Core Signal Finder: failure occurs → fix applied → ESSENCE extracted → universal principle formalized → entire class of similar failures prevented.

The compounding effect: each extracted principle makes the next failure class less likely. Over 50+ sessions, the platform develops deep immunity to known failure classes.

## Examples from S051

| Specific Fix | Core Signal | Universal Principle | Status in CSPS |
|---|---|---|---|
| B_FALSE_ASSUMPTION_CHECK | "Context completeness is measured from the receiver's perspective" | Zero Context Assumption | EXISTS (B_ZCA) — partial T3 only |
| MDPE formula adds blast_radius | "Single-dimension scoring misses multiplicative foundation effects" | Holistic priority scoring | DOESN'T EXIST — new principle needed |
| Tab transition protocol (Opus first) | "Degradation is asymmetric — the most-context-loaded component degrades fastest" | Resource-aware transition sequencing | DOESN'T EXIST — new principle needed |

## Integration Points

- **After every session close:** Core Signal Finder runs over the session
- **Before plan ratification:** Core Signal Finder checks the plan for new core signals
- **After every B_* contract creation:** Core Signal Finder extracts the universal signal and checks if a broader principle is needed
- **In the Learning Loop (PIE sub-engine):** Core Signal Finder is the synthesis step after pattern extraction

## How to Use Now (Before Automation)

During ARCH-SESSION (Opus): manually apply the 5-step process to the session's improvements.
Output: a `core_signal:` field in relevant vault entries.
This builds the signal registry over time, enabling automation later.

---

*Core Signal Finder | Vault concept | S051-S052 | Name ratified OPUS-7 Turn 4*
