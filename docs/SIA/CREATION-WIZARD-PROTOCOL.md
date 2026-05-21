---
id: SIA.CREATION-WIZARD-PROTOCOL
name: CREATION-WIZARD-PROTOCOL
description: "The mandatory question set and wizard protocol for creating any CSPS artifact"
type: doc
protection_level: sacred
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "0.1"
session: S050
core_spines: [GVRN, ARCH]
context_question: "What questions must be answered before any CSPS artifact is created, and what defines a well-formed wizard?"
context_quote: "Create nothing without answering the seven questions."
---

# Creation Wizard Protocol

> **Sacred file.** The creation protocol defines how the entire platform is built.
> Changes require explicit Governor authorization.

---

## The Seven Questions (answer before ANY creation)

These questions must be answered before creating any CSPS artifact.
If the answer to any question is NO or UNKNOWN, enter wizard mode (see §2).

```
Q1: Does this already exist?
    → Search existing CSPS artifacts, templates, and external sources first.
    → B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK applies.
    → If it exists: extend it, not recreate it.

Q2: What is the architectural foundation this depends on?
    → Is that foundation established, ratified, and stable?
    → If NO: design session first. Do not proceed.

Q3: Which Core Spine owns this artifact?
    → Primary spine + secondary spines from META-01-CORE-SPINES.md
    → If UNKNOWN: classify before creating.

Q4: Does a template exist for this artifact type?
    → Check template-registry.md before creating.
    → If YES: fork the template. Do not start from scratch.
    → If NO: is a template warranted? (K=0 justification required)

Q5: What is this artifact's protection level?
    → draft | active | protected | sacred
    → Sacred: requires Governor explicit authorization
    → Protected: requires session ratification

Q6: What are the downstream connections?
    → What other artifacts reference or depend on this one?
    → What pipelines does this feed?
    → Nothing stands alone.

Q7: What is the consent model?
    → Can this be created autonomously (reversible, mechanical, no-cross-actor)?
    → Or does it require Governor ratification first?
```

---

## When to Enter Wizard Mode

Enter wizard mode when ANY question returns NO or UNKNOWN.
Wizard mode means: DESIGN before CREATION.

Wizard mode does NOT mean: ask more questions and then proceed anyway.
Wizard mode means: the missing answer IS the thing that must be designed.

---

## The Wizard Structure (for any CSPS wizard)

Every CSPS wizard has exactly these sections:

```markdown
## WIZARD: [Name]

### What it is
[One clear sentence. Not what it does — what it IS.]

### When it is relevant (triggers)
[Specific conditions that invoke this wizard. Not general descriptions.]

### How to use it (protocol)
[Step by step. Numbered. Each step has a clear output.]

### Mini Core Spine
[Primary spine. Why this spine owns this wizard.]

### Universal requirements (always apply)
[What is true for every instance of this wizard, without exception.]

### Instance-specific modifications
[What varies per use case. Explicit parameters.]
```

---

## Wizard Registry (current wizards)

| Wizard | Trigger | Core Spine |
|---|---|---|
| Node Creation Wizard | Any new CSPS artifact | ARCH + GVRN |
| Session Type Wizard | Session open, type unclear | GVRN |
| Template Fork Wizard | Creating from existing template | ARCH |
| Sacred File Modification Wizard | Attempting to write a sacred file | GVRN |
| [Creation Wizard Protocol itself] | When the Q7 questions can't be answered | GVRN |

---

## The Consensus Principle

No CSPS artifact is saved without reaching consensus. This is not workflow — it is governance.

> **Definition of consensus in CSPS:** Governor ratification + AI verification + pnpm verify exit_code=0.

For low-risk items (draft protection, reversible, no-cross-actor): the AI executes and reports. Consensus is implicit.
For protected items: session ratification required before committing.
For sacred items: explicit Governor authorization + ZF verification cycle.

**Double-verification triggers** (like Google's "Are you sure?"):
- Deleting any artifact
- Modifying a protected or sacred file
- Creating a new Core Spine or principle
- Changing protection_level to sacred

---

*CSPS — Creation Wizard Protocol | S050 | Protection: sacred*
