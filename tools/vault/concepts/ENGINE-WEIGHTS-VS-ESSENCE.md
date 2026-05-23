---
id: vault.concepts.ENGINE-WEIGHTS-VS-ESSENCE
name: ENGINE-WEIGHTS-VS-ESSENCE
description: "Architectural decision: change engine weights+activation vs. change engine essence for different use cases. Answer: weights+activation is sufficient; changing essence is anti-pattern."
type: vault_concept
protection_level: active
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "0.1"
session: S050
core_spines: [ARCH, AI]
core_spine: ARCH
schema_anchor: vault_files
impl_status: swift-implemented
links:
  - vault.concepts.COMBINATORIAL-ENGINE-RAW
  - vault.concepts.COMBINATORIAL-ENGINE-ARCHITECTURE-V1
  - SIA.R1-08-TEMPLATE-BUNDLE-SYSTEM
context_question: "When adapting the Combinatorial Engine for different use cases (scientific project vs. community children's event), should you change the engine's essence or just adjust weights and activate/deactivate parameters?"
context_quote: "The weights are the use case. The engine is the infrastructure. F=ma doesn't change for a sports car vs. a bicycle."
inherits_from: "Platform Genome §5 Platform Architecture"
---

# Engine Weights vs. Essence — The Design Decision

## The Question

When adapting the Combinatorial Engine for a scientific project vs. a community children's event vs. a logistics operation:
- Do you change the engine's mathematical core (essence)?
- Or do you only change the weights and activate/deactivate parameters?

## The Answer

**Change weights + activate/deactivate. Never change the engine's essence for use-case variation.**

## Why

The engine is a relationship evaluator. It computes dependency strength between variables using a consistent mathematical model. The LOGIC of that evaluation doesn't change based on what variables it's evaluating.

What changes per use case:
1. **Which variables (dimensions) are active** — a children's event doesn't need the "financial velocity" vector; a scientific project needs the "methodology rigor" vector
2. **What each variable weighs** — a scientific project weights rigor over speed; a logistics operation weights speed over rigor
3. **Which templates bundle these configurations** — saved, tested presets that reproduce correct behavior for this context

This is P-ARCH-COMPLETE-DEFAULT applied to the engine:
- All parameters exist in the engine core
- Selective activation creates the use case
- Templates capture the configuration

## The Physics Analogy

F=ma. You don't redesign this equation for a bicycle vs. a sports car. You plug in different mass and acceleration values. The formula is the infrastructure; the values are the use case.

Similarly, the Dependency Strength grading formula (Isolated→Linked→Dependent→Synergetic) doesn't change. What changes is WHICH things are being graded against which.

## When Would You Change the Essence?

Only in two cases:
1. The **relationship model** fundamentally changes — e.g., the engine stops evaluating dependency strength and starts doing something categorically different
2. The **output model** fundamentally changes — e.g., stops producing 3 conclusions (Aggressive/Defensive/Balanced) and produces something categorically different

Neither of these changes with use case. Both require explicit architectural decisions, not configuration.

## The Dashboard for Developers and Admins

The weights-and-activation model enables a professional developer dashboard:

```
COMBINATORIAL ENGINE CONFIGURATION DASHBOARD

Template: [Scientific Research Project ▼]
─────────────────────────────────────────────
Active Parameters:
  ✓ Methodology Rigor         Weight: [████░░░░░░] 0.8
  ✓ Temporal Urgency          Weight: [████████░░] 0.6  
  ✓ Resource Constraints      Weight: [██████░░░░] 0.5
  ✗ Financial Velocity        [INACTIVE — not relevant]
  ✗ Client Reputation         [INACTIVE — internal project]
─────────────────────────────────────────────
Conclusion Mode:
  ○ Aggressive/Conservative/Balanced (default)
  ● Conservative-Rigorous/Exploratory/Balanced (scientific preset)
─────────────────────────────────────────────
[Save as Template]  [Test with Sample Data]  [Deploy]
```

This dashboard lets developers define what the engine cares about for each context. The engine runs identically underneath.

## Template Registry Integration

Each use-case template:
- Belongs to a Bundle (like other CSPS bundles)
- Has: `activation_map[]`, `weight_config{}`, `conclusion_mode`
- Is version-controlled (changes are tracked, rollback possible)
- Can be tested in the A/B Testing Hub before deployment

A "Scientific Project" bundle activates the right parameters with the right weights. A "Community Children's Event" bundle activates different parameters. Same engine, different configurations.

## Research Questions (for later)

1. What is the minimum parameter set that serves most use cases? (The universal default)
2. How does the system detect when a saved template is no longer optimal? (Template drift)
3. Can the engine self-suggest weight adjustments based on observed outcomes? (Template evolution)

---

*Engine Weights vs. Essence | Vault concept | S050 | Research needed on Q1-Q3*
