---
id: csps.pillar-0-governance.sandbox-ratification-policy
name: sandbox-ratification-policy
description: >
  CSPS Platform Policy — No implementation without a ratified, simulated sandbox spec.
  The complete development lifecycle: DRAFT → SANDBOX → SIMULATED → RATIFIED → IMPLEMENTING → DONE.
  Three mandatory gates before any code is written. Governor directive S023.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, VALD, ARCH]
schema_anchor: pillar_0_governance_leaves
domain_path: platform
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
session: S023
impl_status: swift-implemented
intent_crystallized: true
threshold_route: platform.governance
ux_principle: none
links:
  - { rel: parent, href: ./README.md }
  - { rel: sandbox-dir, href: ../../_sandbox/ }
  - { rel: routing-config, href: ../../../libs/config/routing.config.ts }
  - { rel: contract, href: ./behavioral-contracts.md }
---

# CSPS Sandbox Ratification Policy

> **The rule:** Code is never written from a verbal description, a chat discussion,
> or an AI proposal. Code is written from a ratified sandbox spec that has been verified
> in simulation. Nothing else is acceptable.

---

## §1 — The Development Lifecycle

Every new feature, change, validator, wizard, protocol, or UX element follows this sequence:

```
STAGE 0: DRAFT
  What: Initial idea expressed — can be vague, verbal, exploratory
  Where: Chat discussion, notes, rough sketches
  Gate: NONE — ideas are free
  Duration: Until "this sounds right, let's spec it"

STAGE 1: SANDBOX
  What: Full written spec — every screen, every question, every step, every word
  Where: docs/plan/_sandbox/[name]-v[N].md
  frontmatter: lifecycle_state: sandbox
  Gate: AI writes spec → Governor reads it
  Rule: The sandbox is the ONLY place iteration happens
        Chat says "change X" → AI updates sandbox → Governor reads again
  Duration: As many versions as needed (v1, v2, v3...)

STAGE 2: SIMULATED
  What: The spec is verified by running through it with real scenarios
  Where: Simulation evidence documented in sandbox file §SIMULATION
  frontmatter: lifecycle_state: simulated + simulation_status: pass|fail
  Gate: Simulation must PASS before ratification can happen
  Simulation types by artifact:
    UX/UI wizard: Wizard-of-Oz (3+ manual runs with realistic users)
    Validators: Run against sample data (pass cases + fail cases)
    Protocols: Narrative walkthrough (3 scenarios, document deviations)
    API routes: curl/test run in development environment
    AI wizards: Simulate conversation (AI plays user, AI plays system)
  Rule: If simulation fails → back to SANDBOX, fix spec, re-simulate
  Duration: Until simulation_status: pass

STAGE 3: RATIFIED
  What: Governor explicitly declares the spec ready to implement
  Where: In chat: "implement this" or "ratified" or explicit approval
  frontmatter: lifecycle_state: ratified + ratified_by: governor + ratified_at: [date]
  Gate: GOVERNOR DECISION — no automation can ratify
  Rule: Only the Governor can move to RATIFIED. AI cannot self-ratify.
  Duration: Single moment — Governor says the word

STAGE 4: IMPLEMENTING
  What: Sonnet implements EXACTLY what is in the ratified sandbox
  Where: Code + validators + hooks (the actual platform artifacts)
  frontmatter: lifecycle_state: implementing
  Rule: Implementation must match the sandbox spec with zero deviation.
        If deviation is needed → STOP → create a new sandbox version → re-ratify
  Duration: One implementation session

STAGE 5: DONE
  What: Implementation verified (pnpm verify + ZF deep)
  frontmatter: lifecycle_state: implemented
  Rule: Cannot declare DONE without ZF ACHIEVED + evidence pasted
  Duration: Same session as IMPLEMENTING
```

---

## §2 — The Sandbox File Format

Every sandbox file lives at `docs/plan/_sandbox/[name]-v[N].md`.

```markdown
---
id: csps.sandbox.[name].v[N]
name: [name]-v[N]
description: Sandbox spec for [what this designs]. Version [N].
version: [N]
owner: group:finky
lifecycle: production
lifecycle_state: sandbox  # → simulated → ratified → implemented
simulation_status: pending  # → pass | fail
ratified_by: ~
ratified_at: ~
sandbox_for: [what artifact this specifies]
threshold_route: [which wizard template]
intent_crystallized: true
---

## §CONTEXT
What this is designing and why it matters.
The JTBD outcome: "When this is implemented, [who] can [do what]."

## §SPEC
[Full detailed specification — every screen, every word, every step]

## §SCENARIOS
[3+ realistic scenarios used for simulation]

## §SIMULATION
[Filled in during Stage 2]
  Scenario 1: [what happened vs. what was expected]
  Scenario 2: [deviations found]
  Scenario 3: [pass/fail per step]
  simulation_status: pass | fail
  simulation_notes: [what needed changing]

## §RATIFICATION
[Filled in during Stage 3]
  Governor: [approval statement]
  Date: [date]
  Conditions: [any conditions on implementation]
```

---

## §3 — What Counts as Simulation

Simulation is NOT reading the spec and saying "looks good." Simulation is EXECUTING the spec against a real scenario and documenting what happened.

| Artifact type | Simulation method | Minimum |
|---|---|---|
| UX/UI wizard | Wizard-of-Oz: human plays system, Governor plays user | 3 runs |
| Validator | Run against: (a) should-pass sample, (b) should-fail sample | 2 runs |
| Protocol | Narrative walkthrough: describe executing each step in a specific scenario | 3 scenarios |
| API route | curl/test in dev environment, paste response | 1 run each endpoint |
| AI conversation | AI plays user, AI plays system — document divergences | 3 scenarios |
| Plan design | Walk through plan steps as if implementing — find gaps | 1 full walkthrough |

**Simulation fails when:**
- A step produces an unexpected result
- A user question cannot be answered by the spec
- A scenario exposes a missing case
- The spec is ambiguous when executed

**Simulation passes when:**
- All 3+ scenarios produce the intended outcome
- No unexpected deviations
- All "what if" questions are answered by the spec

---

## §4 — The Non-Negotiable Rules

**Rule 1: Sandbox before spec discussion ends**
Discussion about a feature is not a spec. When a discussion reaches "we should do X," the NEXT action is: AI creates sandbox v1. Not implementation.

**Rule 2: Simulation before ratification**
The Governor cannot ratify an unsimulated spec. Even if it looks perfect, simulation is required. "It looks right" is not simulation.

**Rule 3: One implementation from one ratified spec**
If something needs to change during implementation, STOP. Create a new sandbox version. Re-simulate if needed. Re-ratify. Then continue.

**Rule 4: The sandbox is public**
The sandbox file is the single source of truth. All discussion happens in reference to the sandbox. "Change X" means "change X in the sandbox file."

**Rule 5: Version number is sacred**
Never overwrite a version. Sandbox v1 stays as-is when v2 is created. The history of ratification decisions is preserved.

---

## §5 — Enforcement

**Validator:** `validate-simulation-before-implementation.mjs`
- Scans active implementation plans (`lifecycle_state: implementing | implemented`)
- Checks corresponding sandbox file exists with `simulation_status: pass`
- ADVISORY if no sandbox file found (grace for pre-policy work)
- BLOCKING from S024 onward for new implementations

**Hook:** `pre-tool-use-sandbox-gate.sh`
- Fires when Write/Edit targets `apps/*/src/` or `libs/`
- Checks: is there an active sandbox spec covering this?
- ADVISORY if no → "Implementation without ratified sandbox detected"

**Lifecycle validator:** `validate-sandbox-lifecycle.mjs`
- Scans `docs/plan/_sandbox/*.md`
- Flags specs that jumped from sandbox → implemented without simulated stage
- ADVISORY on lifecycle violations

---

## §6 — Why This Is a Moat

Most teams build from conversations, Slack messages, or verbal agreements. When implementation doesn't match the mental model, rework follows. CSPS platforms build from ratified, simulated specs. This means:

- **Zero drift** between what was approved and what was built
- **Preserved history** — every version of every spec is in the repository
- **Onboarding efficiency** — new sessions read the sandbox, not the chat history
- **Upgrade path** — when a spec needs changing, create v2, re-simulate, re-ratify
- **Trust** — Governor knows exactly what will be built before a line of code is written

---

*Sandbox Ratification Policy v1.0 | S023 | 2026-05-11*
*Governor directive: "implement only from a ratified plan after verifying all in a real simulation status"*
*This policy is constitutional: changing it requires an ADR.*
