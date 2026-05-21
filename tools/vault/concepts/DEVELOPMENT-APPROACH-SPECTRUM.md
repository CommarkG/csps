---
id: vault.concepts.DEVELOPMENT-APPROACH-SPECTRUM
name: DEVELOPMENT-APPROACH-SPECTRUM
description: "The spectrum of development approaches from classic to CSPS-foundational — both valid, each optimal in different contexts"
type: vault_concept
protection_level: active
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "0.1"
session: S050
core_spines: [ARCH, GVRN]
core_spine: ARCH
schema_anchor: vault_files
impl_status: swift-implemented
links:
  - ai-conception.B_POLARITY_AS_COMPLEMENT
  - SIA.META-04-PLANNING-METHODOLOGY
context_question: "What development approach is right for a given task, and how do classic and CSPS-foundational approaches complement each other?"
context_quote: "Systems that jump to quick fixes spend 2000% more time on iterations at scale. The foundation is not overhead — it is the multiplier."
---

# Development Approach Spectrum

> Both approaches exist in CSPS. Neither is universally better.
> Polarity-as-complement: they define the space between them.

---

## The Classic Approach
*(What most AI systems recommend when asked "how to build things")*

1. Requirements gathering — what needs to be built?
2. Architecture design — how will it be structured?
3. Detailed planning — sequence and dependencies
4. Implementation — build it
5. Testing — verify it works
6. Deployment — ship it

**Optimal for:** well-defined, bounded scope; small system; team familiar with domain; acceptable to rebuild from scratch if requirements change.

**Maps to CSPS session type:** EXEC-SESSION (execute a pre-existing plan)

**Risk at scale:** each step assumes the previous step's decisions were correct. Errors compound. At the 30th app, if the architecture from step 2 had a crack, the cost to fix it is 2000% of what it would have been at the start.

---

## The CSPS Foundational Approach
*(What we are doing)*

1. **BRAINSTORM** — open exploration, no commitments
2. **STRUCTURE** — notebook with mini tree, consistent naming
3. **SALT** — plant core seeds for consensus items (makes them persistent before anything else)
4. **RESEARCH** — external validation before building
5. **ITERATE** — revise based on findings
6. **RATIFY** — Governor approves
7. **PILOT** — one test node before full rollout
8. **GENERALIZE** — after pilot validates the protocol

**Optimal for:** complex systems with compounding consequences; foundational platform elements; multi-app scale where every decision is inherited; high cost of late-course corrections.

**Maps to CSPS session type:** ARCH-SESSION leading to EXEC-SESSION

**Why this isn't a compromise:** the planning stages are not overhead — they are the mechanism by which the implementation becomes fast and reliable. A ratified design turns every EXEC-SESSION into a table-clearing exercise: Sonnet executes, reports done. The investment is in the quality of what Sonnet receives.

---

## The Hybrid (Mixed)

Most work falls here: some design + some execution. The MIXED-SESSION.

The key variable: at what point does an open design question require an ARCH-SESSION pause?
The answer: when the architectural unknown has cascading implications. If it affects one file: proceed in MIXED. If it affects the inheritance chain of future apps: pause and design.

---

## The Neuronal Grid Principle

Both approaches produce artifacts. The CSPS approach additionally produces CONNECTION — every artifact is linked to related concepts in the vault. The classic approach produces a list of files. The CSPS approach produces a network.

At small scale: the difference is invisible.
At large scale: the network is what makes search, reuse, and inheritance possible without human navigation.

---

## CSPS Offering to Developers

When a developer builds on CSPS, they choose their approach for their specific delta.
The platform's foundational layer (Threshold, PIE, profiles, bundles) is built CSPS-style.
The developer's domain-specific logic can use either approach.
The platform doesn't impose its approach on every decision — it ensures the foundation is solid.

This IS polarity-as-complement: classic speed + CSPS depth = the optimal combination for each layer.

---

*Development approach spectrum | Vault concept | S050*
