---
id: ai-conception.B_TAB_TRANSITION_PROTOCOL
name: B-TAB-TRANSITION-PROTOCOL
description: "AI conception pattern: Opus closes first when degraded, Sonnet continues mid-work, new Opus opens with HANDOFF + Sonnet's completion report"
type: conception_pattern
protection_level: sacred
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "1.0"
session: S051
core_spines: [GVRN, AI]
core_spine: GVRN
schema_anchor: vault_files
impl_status: swift-implemented
links:
  - ai-conception.B_VAULT_FIRST_ATTITUDE
  - ai-conception.B_HUMBLE_FIRST_STEP
context_question: "When context is degrading, which tab closes first and why does sequence matter?"
context_quote: "The new Opus that starts with HANDOFF + Sonnet's completed work makes better decisions than the one that starts with only the HANDOFF."
---

# B_TAB_TRANSITION_PROTOCOL

## The Core Logic

When context window approaches limit (~30% remaining), tabs must transition.
The SEQUENCE of transition matters as much as the transition itself.

**Wrong sequence (both at once):**
Both close → both start fresh → new Opus starts without knowing what new Sonnet just built.
New Opus makes architectural decisions on incomplete information.

**Correct sequence:**
1. Opus closes first → writes HANDOFF
2. Sonnet continues current PROTO to completion (don't interrupt mid-work)
3. New Opus opens with: HANDOFF from old Opus + Sonnet's completion report
4. New Opus makes architectural decisions with richest possible context
5. Sonnet gets a new tab only when its current PROTO closes naturally

## Why Opus Closes First

Opus accumulates more architectural context per turn than Sonnet. After 40+ turns, Opus's architectural decisions are degraded (context pressure, compressed early decisions). Sonnet starts fresh per PROTO — its context is always fresh relative to its current task.

Therefore: Opus degrades first. Opus closes first.

## The Notification Requirement

Every session-open should display:
- Current turn count (from zf-session-tracker.json)
- Estimated context remaining (based on session length heuristic)
- If turns > 40: "ADVISORY: Context quality degrading. Consider HANDOFF after current task."
- If turns > 60: "WARNING: Strong quality degradation. HANDOFF recommended NOW."

## The False Assumption Check for Tab Transitions

Before writing the HANDOFF, Opus must ask:
1. "What architectural decisions did I make this session that are NOT yet in git?"
2. "What does the new Opus instance need to know that it cannot infer from the HANDOFF?"
3. "What is Sonnet currently building? Will the new Opus know this?"

These three questions prevent the most common tab transition failures.

## Canonical Implementation

The ALIGNMENT QUESTIONS section in every HANDOFF must include:
- Q1: "What is the tab transition protocol, and why does Opus close before Sonnet?"
  Answer: [this file, summarized in one sentence]
- At least one question about what Sonnet is currently building

## Session Evidence

S051 Governor direction: "I want to open new tabs for Opus and Sonnet [...] Opus degrades first (more context accumulated, higher risk from degradation) [...] Sonnet continues mid-work [...] New Opus opens with HANDOFF + Sonnet completion report."

---

*AI Conception Vault entry 9 | S051 | Protection: sacred*
