---
id: csps.council.opus-invariant-plan-S043
name: opus-invariant-plan-S043
description: "6-persona gap analysis + CSPS Invariant system design. The word is INVARIANT. One source: invariant-registry.yaml. Prevention lifecycle: identify→trigger→save→permanent. S043/S044 build plan."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: council_state
session: S043
---

# CSPS Invariant System — Design Plan

## THE WORD: INVARIANT

An invariant is a platform behavior that holds true regardless of:
- Which AI model runs
- Which chat or session is active
- How long since last activity
- What the AI's training default wants to do

## THE FIVE ENFORCEMENTS OF AN INVARIANT

T1 (before AI acts) + T2 (before code merges) + T3 (before session starts)
+ DNA block (survives model/chat/session) + Core seed (survives cold start)

= CSPS INVARIANT (all five required)

---

## 6-PERSONA GAP SUMMARY

### Consolidation: ONE SOURCE MISSING
`invariant-registry.yaml` — does not exist. Every invariant is scattered.

### Balance: 24 decorative hooks
33 hooks exit-0-only. Only 9 have blocking. Skills=STUB. Agent=ADVISORY.

### Domain: Inheritance broken at all three events
CREATE: DNA block required but inherits_from not mandatory
CHANGE: inheritance-propagator not built (OPEN-059)
DELETE: ZERO guard — silent orphan, no detection

### UX: Chat jump, Opus/Sonnet, Agents, Skills all have gaps
Chat jump: HANDOFF blocks but doesn't verify hooks are active in new context
Opus/Sonnet: validate-directive-compliance.mjs missing (did Sonnet execute what Opus directed?)
Agents: Advisory UNDERSTANDING BLOCK, not mandatory
Skills: STUB (36+ sessions, never promoted)

### Cruel Critic: Planning is NOT an invariant
When PROTO-031 Step 2 was skipped, ZERO mechanical enforcement caught it.
Only Opus manual review caught it. The planning process itself has no invariant gate.

### Synergy: ONE FILE changes everything
`tools/config/invariant-registry.yaml` — maps every invariant to its full T1+T2+T3 stack.
One validator reads it. Any gap in the stack = audit alert.

---

## INVARIANT REGISTRY SCHEMA

```yaml
# tools/config/invariant-registry.yaml
# Every CSPS invariant: what it is, how it's enforced, what breaks it

invariants:

  - id: INV-001
    name: plan-before-implement
    description: "No code without a ratified plan in unified-plan.yaml"
    enforcement:
      t1: pre-tool-use-plan-coverage-gate.sh  # PRODUCTION
      t2: validate-no-implementation-without-plan.mjs  # PRODUCTION
      t3: session-open injection + PRACE block
    training_default: "Implement immediately when asked or approved"
    satisfaction_point: "Code is written and committed"
    prace_override: "Check unified-plan.yaml for item with status=ratified first"
    cold_start_anchor: "unified-plan.yaml item with status=ratified"
    inheritance:
      parent: P-META-026
      enforces_on: all implementation actions
    delete_guard: false  # P-META-026 is constitutional, cannot be deleted
    violation_response: validate-no-implementation-without-plan.mjs BLOCKS commit

  - id: INV-002
    name: handoff-completeness
    description: "Session cannot close without Zone A + Zone B + ALIGNMENT QUESTIONS"
    enforcement:
      t1: post-stop-session-close-gate.sh  # PRODUCTION
      t2: validate-handoff-completeness.mjs  # BLOCKING
      t3: session-open B_INHERITANCE_POLICY injection
    training_default: "End session when work seems done"
    satisfaction_point: "Summary is written, session feels complete"
    prace_override: "Write HANDOFF with Zone A/B/ALIGNMENT QUESTIONS or verify will block"
    cold_start_anchor: "HANDOFF-S[NNN]-to-S[NNN+1].md in git"
    inheritance:
      parent: B_INHERITANCE_POLICY
      enforces_on: every session close
    delete_guard: true  # cannot delete HANDOFF files without verification

  - id: INV-003
    name: rzf-before-directive
    description: "Every Sonnet directive must have ## RZF VERIFICATION before ## SONNET DIRECTIVE"
    enforcement:
      t1: none  # missing — gap
      t2: validate-directive-has-rzf.mjs  # BLOCKING
      t3: session-open injection "Every response to Opus MUST start..."
    training_default: "Write directive when asked, skip verification"
    satisfaction_point: "Directive is written and looks complete"
    prace_override: "Run ZF cycles with tool calls before any ## SONNET DIRECTIVE section"
    cold_start_anchor: "sonnet-report.template.md in git"
    inheritance:
      parent: B_RZF + communication-protocol-shared.md Rule 9
      enforces_on: all Opus turns with directives
    gap: "T1 missing — no hook fires if ## SONNET DIRECTIVE appears without ## RZF VERIFICATION"

  - id: INV-004
    name: agent-understanding-block
    description: "Every Agent() call must include UNDERSTANDING BLOCK in the prompt"
    enforcement:
      t1: pre-tool-use-agent-alignment.sh  # ADVISORY — GAP
      t2: none  # missing
      t3: session-open injection
    training_default: "Spawn agent with task, skip boundary context"
    satisfaction_point: "Agent receives task description"
    prace_override: "Agent prompt must start: BOUNDARY CROSSING — Type B / I understand / I will produce / This serves"
    cold_start_anchor: "AGENTS.md hard NO: never spawn agent without UNDERSTANDING BLOCK"
    gap: "T1=advisory only; T2=missing. Agents are wildcards."
    upgrade_path: "Promote pre-tool-use-agent-alignment.sh to BLOCKING (K=2 overdue)"

  - id: INV-005
    name: dna-block-on-creation
    description: "Every new platform artifact must have a DNA block as first content"
    enforcement:
      t1: pre-tool-use-check-existing.sh  # ADVISORY — partial
      t2: validate-page-dna.mjs  # ADVISORY — for playground
      t3: session-open PRACE block + CAQ injection
    training_default: "Create artifact with content, skip governance header"
    satisfaction_point: "File exists and contains the intended content"
    prace_override: "Add @csps-dna / inherits_from / governing_principle as FIRST content"
    cold_start_anchor: "@csps-dna annotation in file + core seed planted"
    gap: "T1 advisory only; inherits_from not mandatory; T2 advisory"
    upgrade_path: "OPEN-060 (pmi-gate field) + make inherits_from required at creation"
```

---

## PREVENTION LIFECYCLE (Formal Protocol)

```
IDENTIFICATION:
  T1 fires → logs to violation_log in invariant-registry.yaml
  [S3] from findings-categorizer → routes to threshold
  Overdue core seed → validate-core-seeds ADVISORY alert
  Missing DNA → validate-page-dna ADVISORY alert

TRIGGER:
  Any [S3] finding → auto-generate CAQ
  CAQ logged to unified-plan.yaml item's caq_answers
  If no plan item exists: create OPEN-NNN with PRACE template

SAVE (survives everything):
  OPEN-NNN in unified-plan.yaml (git-committed)
  Core seed planted in violation file (survives cold start)
  Invariant-registry.yaml violation_count++ (persistent counter)

PERMANENT SOLUTION:
  FSE checklist applied: T5+T4+T3+T2+T1 all declared
  Hook promoted from advisory → blocking (K=2 rule)
  Invariant entry updated: gap closed, t1/t2 now present
```

---

## INHERITANCE COMPLETENESS (Three Events)

### ON DELETE:
pre-commit-delete-guard.sh (TO BUILD):
  Check staged deletions against inheritance-registry.yaml
  If file is a registered parent → BLOCK with message:
  "DELETION BLOCKED: [file] is parent of [N children]. Delete children first or update inheritance."

### ON CHANGE:
inheritance-propagator.mjs (OPEN-059, S041):
  When parent's version field changes → generate child audit report
  Human confirms propagation before allowing commit

### ON CREATE:
pre-tool-use-check-existing.sh (EXISTS — advisory, limited):
  Upgrade to: require inherits_from in DNA block for new files
  Add to invariant-registry.yaml: creates violation if no DNA block

---

## COLLABORATION INVARIANTS

### Chat Jumps:
HANDOFF → BLOCKING (existing) ✅
NEW: validate-hooks-context.sh — verifies settings.json hooks are active in new workspace

### Opus/Sonnet:
validate-directive-has-rzf.mjs BLOCKING ✅
NEW: validate-directive-compliance.mjs — checks if Sonnet's commit matches Opus's directive SHA

### Agents:
pre-tool-use-agent-alignment.sh ADVISORY → UPGRADE TO BLOCKING (PROTO-034 Step 4)

### Skills:
pre-tool-use-skill-aap-required.sh STUB → advisory (PROTO-034 Step 5)

---

## BUILD PLAN (PROTO-034 for Sonnet)

Step 1: tools/config/invariant-registry.yaml (5 invariants, schema above)
Step 2: pre-commit-delete-guard.sh (checks parent deletion)
Step 3: validate-invariant-coverage.mjs (checks T1+T2+T3 per invariant)
Step 4: Upgrade agent alignment hook → BLOCKING
Step 5: Upgrade skill-aap hook → advisory (first step out of STUB)

*Opus Invariant Plan v1.0 | S043 | 2026-05-19*
