---
id: csps.tools.templates.new-tab-stress-test
name: new-tab-stress-test
description: "Critic-expert stress-test framework. Every HANDOFF/RELAY destined for a new tab MUST be reviewed through 6 layers of 'Are you sure that...?' questions before relay. Formalized S066 per Governor directive: 'be suspicious and formalize a set of Are you sure that...? questions covering content, context, nuances, intents, ripples, alignment to CSPS.'"
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
session: S066
authored_by: Opus-10
date: 2026-05-27
inherits_from: "B_INHERITANCE_POLICY + B_ZCA + B_MUTUAL_UNDERSTANDING_VALIDATION + FINDING-OPUS10-1 absorb-and-wait"
context_question: "Before relaying to a new tab — have ALL 6 layers of stress-test questions been answered with concrete evidence, not assumption?"
links:
  - rel: parent-finding
    href: ../data/improvement-register.yaml#DRAFT-S066-NEW-TAB-STRESS-TEST-FRAMEWORK
  - rel: governor-directive
    href: ../council/sonnet-turn.md
---

# New-Tab Stress-Test Framework

> **Mandatory before any HANDOFF / RELAY / paste-target reaches a new tab.**
>
> The new tab starts with ZERO assumptions. Every assumption you carry forward
> from current context is a failure mode if wrong. This framework forces
> per-assumption verification across 6 layers.
>
> Formalized: **S066 per Governor critic-expert directive.**
> Discipline: **be suspicious**. Default-no-trust on each layer until evidence answers it.

---

## How to use

For every HANDOFF or RELAY block destined for a new tab:

1. Walk all 6 layers in order
2. For each question: answer YES with concrete evidence (file:line / commit SHA / paragraph reference) OR NO with explicit "this assumption breaks the relay"
3. Closing-summary §X carries forward any NO answers as risks for the receiving tab
4. If 3+ NO answers: HOLD the relay, fix the gaps, re-stress-test

The cost of running this template is ~5 minutes. The cost of NOT running it is the entire absorb-and-wait + drift + misinterpretation chain that PROTO-AND-TAB-TRANSFER-PROTOCOL was built to prevent.

---

## Layer 1 — CONTENT

The actual artifacts being relayed.

- [ ] Are you sure the PROTO file contains the actual core seed TEXT, not just directive description?
- [ ] Are you sure every claim in the HANDOFF has a file:line reference OR commit SHA?
- [ ] Are you sure no chat-only content is referenced as if it persisted to disk?
- [ ] Are you sure all required frontmatter fields are present on every new file (id / name / version / owner / lifecycle / lifecycle_state / core_spine / schema_anchor / inherits_from per M-40)?
- [ ] Are you sure the HANDOFF passes validate-handoff-completeness.mjs?
- [ ] Are you sure verify exit_code=0 was confirmed THIS-HEAD (not memory of earlier run)?

---

## Layer 2 — CONTEXT

The situational awareness the new tab needs.

- [ ] Are you sure the new tab knows the current session number (not assumed from old state)?
- [ ] Are you sure session-state.json mandate is updated to current session before relay?
- [ ] Are you sure verify exit_code in HANDOFF Zone A is THIS-HEAD evidence, not memory?
- [ ] Are you sure the new tab has full access to prior conversation's reasoning chain via inherits_from chains?
- [ ] Are you sure the new tab won't open with stale session-state.json mandate?
- [ ] Are you sure recent Governor directives are surfaced in HANDOFF Zone B priorities?

---

## Layer 3 — NUANCES

Distinctions the new tab might miss.

- [ ] Are you sure the new tab understands "draft-awaiting-governor-approval" vs "approved" status difference?
- [ ] Are you sure the new tab will read gate-tier (auto-execute / check-in / full-advance per B_REVERSIBILITY_GATED_REVIEW) before acting?
- [ ] Are you sure the new tab won't conflate DRAFT with DONE or COMPLETE?
- [ ] Are you sure the new tab knows the distinction between PROTO file, RELAY block, and HANDOFF?
- [ ] Are you sure the new tab understands which findings are FILED-AS-K=1 vs FILED-AS-INPUT vs FILED-AS-DRAFT?
- [ ] Are you sure subtle changes (e.g., schema v1.0 → v1.1) are explicitly noted, not assumed?

---

## Layer 4 — INTENTS

Why this work matters.

- [ ] Are you sure the new tab understands WHY this work, not just WHAT?
- [ ] Are you sure the connection between immediate task and broader platform goal is explicit?
- [ ] Are you sure the new tab won't pattern-match to a similar-but-different task from training defaults?
- [ ] Are you sure the original Governor directive that triggered this work is cited in HANDOFF?
- [ ] Are you sure the strategic framing (e.g., "this is measurement-honesty correction" not "this is a bugfix") is preserved?
- [ ] Are you sure the new tab knows which work to NOT do (Governor-postponed / out-of-scope / deferred)?

---

## Layer 5 — RIPPLES

Downstream effects.

- [ ] Are you sure the new tab will surface downstream effects on dependent artifacts?
- [ ] Are you sure the new tab knows which cross-references need same-commit updates?
- [ ] Are you sure the new tab understands K-pipeline escalation if this work surfaces a recurring pattern?
- [ ] Are you sure the new tab will check inheritance graph for descendants before modifying a parent?
- [ ] Are you sure the new tab will propagate changes to flow-activity-monitor.yaml if new flow elements are added?
- [ ] Are you sure the new tab won't accidentally trigger recurrence of resolved gaps (e.g., re-introducing gap_DONE_CLAIM behavior)?

---

## Layer 6 — CSPS ALIGNMENT

Platform-specific discipline.

- [ ] Are you sure the new tab will apply M-40 inheritance discipline (declare inherits_from on new artifacts)?
- [ ] Are you sure the new tab knows B_REVERSIBILITY_GATED_REVIEW gate-tier mapping (auto-execute / check-in / full-advance)?
- [ ] Are you sure the new tab will run multi-lens ZF per S066 Q1 ratification (3-lens default + 6-CAI at SEAL)?
- [ ] Are you sure the new tab will emit SHAPE block per S066 Q2 ratification (pre-onset shape-check)?
- [ ] Are you sure the new tab will route through threshold per S066 Q3 ratification (tiered substantive/conversational)?
- [ ] Are you sure the new tab will respect ALL pre-commit gates (claim-validator-gate / describe-without-implement / bstar-engraving-gate / shape-check / core-seed-mandatory)?
- [ ] Are you sure the new tab will run CAI 6-dimension audit at SEAL moments per CAI-DEFINITION.md?
- [ ] Are you sure the new tab will file findings in improvement-register/gap-recurrence-register, NOT chat-only?

---

## How NO answers are handled

Any NO answer means the relay is NOT READY. Three resolution paths:

1. **FIX before relay** — add the missing evidence/field/section, re-stress-test
2. **Carry forward as known risk** — explicitly add to closing-summary §X with mitigation plan
3. **Block the relay** — if 3+ NO answers, do NOT proceed; surface the gap to Governor

Never relay with silent assumptions. Silent assumption is the failure mode this framework prevents.

---

## Aggregate stress-test output

Every HANDOFF must include a closing block:

```yaml
stress_test_S<NNN>:
  layer_1_content: <count_yes>/<count_total>
  layer_2_context: <count_yes>/<count_total>
  layer_3_nuances: <count_yes>/<count_total>
  layer_4_intents: <count_yes>/<count_total>
  layer_5_ripples: <count_yes>/<count_total>
  layer_6_csps_alignment: <count_yes>/<count_total>
  no_answers_carried_forward:
    - layer: <N>
      question: <text>
      mitigation: <what the new tab should do about this>
  ready_for_relay: true | false
```

ready_for_relay: false → HOLD, fix, re-stress-test.

---

## Behavioral test (per DRAFT-S066-NEW-TAB-STRESS-TEST-FRAMEWORK)

```bash
# tools/tests/behavioral/new-tab-stress-test-test.sh
# INPUT A: HANDOFF missing answers to 3+ stress-test questions → expect exit=1 (flag)
# INPUT B: HANDOFF with all 6 layers explicitly addressed → expect exit=0 (pass)
# INPUT C: HANDOFF claims "all clear" without per-layer evidence → expect exit=1 (flag false-clear)
```

---

## Why this framework permanently

CSPS sessions S062-S066 surfaced repeated failure modes that ALL trace to "new tab made false assumption":
- FINDING-OPUS10-1 (absorb-and-wait) — false assumption about how startup blocks get processed
- FINDING-OPUS10-3 (frontmatter debt) — false assumption that prior commit's frontmatter was complete
- FINDING-OPUS10-6 (PROTO relay format) — false assumption Sonnet would interpret without paste-ready relay
- gap_DONE_CLAIM K=4 — false assumption verify ran when claim was made
- engrave-and-violate pattern — false assumption that engraved discipline auto-applies to next response

This framework converts each historical failure into a defensive question. The 6 layers cover the structural classes. As new failure modes surface, add questions to the appropriate layer.

---

*Authored S066 | Opus-10 | Governor directive: "FORMALIZE ALL OF THIS NOW TO BE PERMANENT"*
