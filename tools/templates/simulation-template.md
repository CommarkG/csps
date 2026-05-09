---
id: csps.tools.templates.simulation
name: simulation-template
description: >
  CSPS Simulation Protocol template. A simulation is a structured walkthrough of
  a user journey or input flow BEFORE implementation. The connection to ZF:
  simulation-ZF = simulation finds 0 gaps. Only when simulation-ZF is achieved
  should implementation begin. This IS the Gradual Execution Protocol applied to
  knowledge architecture validation. Humble approach: we might be wrong.
  Iterate until ZF. Then build.
version: 1.0
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: tools_templates_meta
owner: group:finky
template_id: simulation-template
template_version: 1.0
applicability_trigger: >
  Before any new domain schema, user journey feature, or multi-domain capability
  is built. Required when plan has council_required: true or domain_path is new.
tags:
  - domain:governance
  - type:template
  - audience:ai-agent
  - maturity:stable
session: S021
links:
  - { rel: research-registry, href: ../config/research-registry.yaml }
  - { rel: three-axis, href: ../../docs/plan/_handoff/VAULT/three-axis-orchestration-S021.md }
  - { rel: haiku-spawn, href: ./haiku-spawn-template.md }
---

# CSPS Simulation Protocol Template

> **What a simulation is in CSPS:**
> A structured walkthrough of a scenario using existing knowledge (research registry,
> domain schemas, behavioral contracts) to predict outcomes, identify gaps, and validate
> assumptions — BEFORE writing a single line of implementation code.
>
> **The connection to ZF:**
> Simulation-ZF = simulation finds 0 gaps. Just as code-ZF requires passing all validators,
> simulation-ZF requires all scenario inputs to have complete handling. You don't build
> until simulation-ZF is achieved.
>
> **Who runs simulations:**
> - Opus: designs scenarios, reviews results, proposes remediation
> - Haiku: runs pattern-matching scans for gap detection at scale
> - Sonnet: implements fixes after simulation-ZF

---

## §1 — Simulation Header

```yaml
# Fill in for each simulation
simulation_id: "SIM-S[NNN]-[SLUG]"
scenario: "[one-line description of what's being simulated]"
coordinate: "(who=[persona], what=[domain_path], how=[interaction_pattern])"
session: S[NNN]
date: YYYY-MM-DD
status: running | zf-achieved | gaps-found | remediated
simulation_zf: false  # becomes true when 0 gaps found
```

---

## §2 — Research Check (Mandatory First Step)

Before running the simulation, check the research registry:
```
1. Query tools/config/research-registry.yaml for this topic/domain
2. List relevant research found:
   - RESEARCH-XXX: [what was found]
   - RESEARCH-XXX: [what was found]
3. Gaps in research (areas not yet researched):
   - [topic] → commission research, add to registry, then continue
```

**The rule:** Never simulate a domain without first checking if it's been researched.
Research findings ARE simulation inputs — without them, the simulation is operating in the dark.

---

## §3 — The CCAT Gate (5 Ws Before Simulation Begins)

```
WHO   → [primary persona acting in this simulation]
WHAT  → [domain_path this scenario touches]
WHEN  → [maturity stage: seed/draft/proven/battle-tested/canonical]
WHERE → [layer: builder / user / both / platform-only]
WHY   → [one sentence of user value this scenario tests]
```

If any answer is "don't know" → stop. The simulation premise is not ready.

---

## §4 — Scenario Definition

```
GIVEN:  [initial state — what exists before this scenario runs]
WHEN:   [the specific input or action being simulated]
THEN:   [expected behavior — what SHOULD happen]
```

---

## §5 — Step-by-Step Trace

For each step in the scenario, answer:

| Step | Actor | Action | System Response | Gap Found? |
|------|-------|--------|-----------------|------------|
| 1    | [who] | [does what] | [what should happen] | Yes/No |
| 2    | [who] | [does what] | [what should happen] | Yes/No |
| ... | ... | ... | ... | ... |

For each "Gap Found: Yes" — document:
```
GAP [N]:
  Step: [which step]
  What's missing: [specific thing that doesn't exist]
  Severity: CRITICAL (blocks user entirely) | IMPORTANT (degrades experience) | ADVISORY
  Remediation: [what needs to be built]
  Owner: governor | opus | sonnet | haiku
  Connects to backlog: UPDATE-[NNN] (if existing) or NEW
```

---

## §6 — Simulation-ZF Assessment

```
Total gaps found: [N]
CRITICAL gaps: [N]
IMPORTANT gaps: [N]
ADVISORY gaps: [N]

Simulation-ZF: YES (all 0 CRITICAL gaps) / NO ([N] CRITICAL gaps block progress)

If NO → Remediation plan before next simulation run:
  [ordered list of what must be built before re-simulating]

If YES → Cleared for Stage 1 implementation (1-3 real cases)
```

---

## §7 — Haiku Scan Integration

For pattern-detectable gaps, spawn a Haiku scout:
```
Task: Scan [directory] for [pattern from haiku-pattern-library.yaml]
Relevant patterns: [list pattern IDs]
Expected return: haiku_scout_return with pattern_flags
```

Haiku scan results feed into the gap table above. Haiku finds what's PRESENT (or absent).
Simulation determines whether what's present is SUFFICIENT.

---

## §8 — Research Registry Update

After simulation completes:
```
1. Did this simulation produce new knowledge? → Add to research-registry.yaml
2. Did it confirm existing research? → Update confidence level
3. Did it contradict existing research? → Mark old entry as superseded, add new entry
```

The simulation IS research. Its findings belong in the registry.

---

## §9 — Inheritance: How This Reaches Sonnet and Haiku

**Opus designs** the simulation scenario (§2-§4).
**Haiku runs** pattern-matching scans for gap detection (§7).
**Sonnet implements** remediations and runs next simulation cycle (§5-§6).
**Governor reviews** simulation-ZF assessment and authorizes Stage 1 build (§6).

**The cycle:**
```
Opus → designs scenario
Haiku → scans for gaps
Sonnet → fixes gaps
Opus → re-simulates
...repeat until...
Simulation-ZF achieved → Sonnet begins Stage 1 (1-3 real cases)
Stage 1 ZF → Full implementation begins
```

This IS the Gradual Execution Protocol: ratification ≠ proven. Simulation-ZF is Stage 1.

---

## §10 — Template Example (Filled In)

```yaml
simulation_id: "SIM-S021-HEALTH-DOMAIN"
scenario: "User activates health tracking for their personal account"
coordinate: "(who=solo_user, what=personal.health.physical, how=consume)"
session: S021
status: gaps-found
simulation_zf: false

research_check:
  - RESEARCH-004: GDPR applies from moment EU data is processed
  - RESEARCH-002: health domain = HIPAA-adjacent compliance required
  research_gaps:
    - "HIPAA compliance requirements for non-US health apps" → commission RESEARCH-008

ccat:
  who: solo_user (personal health tracker)
  what: personal.health.physical (sleep, exercise, nutrition)
  when: seed (domain not yet built)
  where: user (end-user facing)
  why: "Users who track sleep see correlation with productivity — no other app can surface this cross-domain insight"

gaps_found:
  - GAP-1: personal.health.zmodel doesn't exist (CRITICAL — blocks everything)
  - GAP-2: No HIPAA-adjacent compliance profile (CRITICAL — legal liability)
  - GAP-3: No health data deletion path (CRITICAL — GDPR Article 17)
  - GAP-4: No WisdomHub for aggregated health insights (IMPORTANT)
  - GAP-5: No HE/RTL health UI patterns (ADVISORY for IL market)

simulation_zf: false (3 CRITICAL gaps)

remediation_before_next_run:
  1. Build libs/policies/slices/personal/health.zmodel (Sonnet)
  2. Create hipaa-adjacent compliance profile (Opus design + Sonnet implement)
  3. Ensure libs/gdpr.ts covers health fields (Sonnet — UPDATE-005 in backlog)
```

---

*The simulation is the honest test. Simulation-ZF is the gate. Only then do we build.*
*S021 | Part of the CSPS humble iterative ZF approach*
