---
id: ai-conception.B_AI_BEHAVIOR_IN_PLANS
name: B-AI-BEHAVIOR-IN-PLANS
description: "AI conception pattern: every plan must include mandatory AI behavior analysis before ratification — defaults, triggers, satisfaction points, and instruction guidance"
type: conception_pattern
protection_level: sacred
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "1.0"
session: S051
core_spines: [AI, GVRN, ARCH]
core_spine: AI
schema_anchor: vault_files
impl_status: swift-implemented
links:
  - ai-conception.B_PE_GATEKEEPER_MANDATE
  - ai-conception.B_ARCHITECTURE_REDIRECT_AWARENESS
  - vault.concepts.MDPE-FORMULA
context_question: "Before ratifying any plan, what AI defaults and triggers must be explicitly identified and accounted for in the plan's instructions?"
context_quote: "A plan that doesn't name its AI risks is a plan that lets AI freestyle on the hardest parts."
inherits_from: "Platform Genome §1 Behavioral Contracts"
---

# B_AI_BEHAVIOR_IN_PLANS

## The Problem

Plans are written assuming the AI executing them will follow instructions correctly. But AI systems have:
- Defaults that activate under specific conditions (context pressure, ambiguous instructions)
- Triggers that cause premature satisfaction points ("PMI=5/5" declared without evidence)
- Satisfaction points that fire too early ("I answered the question" vs. "I answered correctly with evidence")

Plans that don't name these risks produce "governance theater" — artifacts that look correct but aren't.

## The Mandatory Section

Every plan item that reaches ratification MUST include an `ai_behavior_analysis:` section with:

```yaml
ai_behavior_analysis:
  relevant_defaults:
    - name: "[specific default]"
      trigger: "[what activates it]"
      risk: "[what goes wrong]"
      prevention: "[how instructions are written to prevent it]"
  
  satisfaction_points_to_prevent:
    - "[what the AI will consider 'done' prematurely]"
    - "[what must be verified after this point]"
  
  instruction_guidance:
    - "[how instructions for this plan should be written]"
    - "[what evidence requirements to include]"
    - "[what anti-slippage checks at each phase boundary]"
```

## BEFORE/AFTER Example (Simulation Pattern)

**BEFORE — Plan without AI behavior analysis:**
```
Step 3: Write the 7-section planning wizard.
Verification: pnpm verify exit_code=0
```
What happens: AI writes placeholder text for Section 5. Declares PMI=5/5. Section 5 has no real UX decisions.

**AFTER — Plan with AI behavior analysis:**
```
Step 3: Write the 7-section planning wizard.

ai_behavior_analysis:
  relevant_defaults:
    - name: "Premature PMI declaration"
      trigger: "AI counts 7 sections with content"
      risk: "Declares PMI=5/5 without checking evidence quality per section"
      prevention: "Each section requires a specific artifact citation. §5 must include 5 named homepage variants with UX rationale."
  
  satisfaction_points_to_prevent:
    - "AI considers 'section has content' as evidence of completion"
    - "After prevention: only specific, cited artifacts count as evidence"

Verification: 
  - pnpm verify exit_code=0
  - §5 specifically: 5 homepage variants named with UX rationale OR audit block explaining what's missing
```

What changes: The slippage prevention is IN the plan, not assumed. The AI cannot declare §5 complete without the named evidence.

## Application to Engines (Priority)

The Governor named engines as the top priority for AI behavior refinement. The PE engine specifically:

**BEFORE (rigid PE):**
```
PE_score = urgency × impact / SPI_estimate
```
No AI behavior consideration. AI satisfies by producing a number.

**AFTER (MDPE-aware PE):**
```
PE_score = MDPE(urgency, impact, SPI, blast_radius, future_enablement, readiness, simplicity_bonus)
ai_behavior_analysis:
  - "AI will compute the number and stop. Prevention: require qualitative justification for each dimension."
  - "AI will not surface blast_radius without explicit prompting. Prevention: make blast_radius a mandatory field."
```

## Plan Ratification Gate

A plan cannot move from `planning → ratified` without the `ai_behavior_analysis:` section present and having at least:
- 2 relevant_defaults identified
- 1 instruction_guidance entry that references the AI Behavioral Profile (R1.6)

This is a VALIDATOR requirement, not an honor-system requirement.

## Session Evidence

S051 Governor: "What if we mandatorily make every plan include specific analysis done by an expert agent or skill? Writing down in detail what are the AI defaults and triggers and satisfaction points that are relevant to the plan [...] to take them into consideration [...] not letting it for the AI to free style."

---

*AI Conception Vault entry 10 | S051 | Protection: sacred*
