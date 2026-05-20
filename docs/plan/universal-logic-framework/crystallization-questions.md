---
id: csps.plan.universal-logic-framework.crystallization-questions
name: Universal Logic Engine — Crystallization Questions
description: "Structured set of questions for crystallizing the Universal Combinatorial
  Logic Engine for any specific implementation. Organized by the 6 use-case pillars.
  Implementers answer these before building — not after."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: apps_planning
batch: BATCH-B
session: S047
---

# Crystallization Questions
## Universal Combinatorial Logic Engine

> **Purpose:** These questions transform an abstract framework into a specific,
> buildable implementation. Answer all questions before writing code.
> Questions with **[BLOCKER]** cannot be left unanswered — they determine
> fundamental architecture choices that cannot be changed after implementation begins.

---

## SECTION A — THE CORE ENGINE DEFINITION

### A.1 — Identity Questions [BLOCKER]

1. What is the primary use case this implementation serves? (One sentence, maximum.)

2. What are the 3 types of items this engine will prioritize? (Be specific — not "tasks" but "delivery commitments" or "engineering tickets" or "client calls.")

3. What is the unit of GRAVITY in this domain?
   - In construction: a blocked permit stops 6 downstream activities
   - In software: a blocked dependency stops 4 engineers
   - In personal productivity: a missed medication affects the entire day
   *Name your gravity unit before building the matrix.*

4. What is the unit of VELOCITY in this domain?
   - Some domains measure velocity in hours (construction deadlines)
   - Some in weeks (strategic planning cycles)
   - Some in seconds (live trading)
   *If you cannot define velocity precisely, the engine cannot compute it.*

5. What does "irreversible loss" mean in this specific domain?
   - This is the highest-gravity event the engine must prevent above all else.
   - Everything else is optimization. This is survival.

---

### A.2 — Dependency Matrix Questions [BLOCKER]

6. List 5 items from your domain. For each pair, ask: "If Item A is delayed by 24 hours, does it directly impact Item B?" Build the first 5×5 matrix by hand before building software.

7. Are any dependencies in your domain cross-domain? (e.g., a financial constraint blocking an operational decision?)
   - If yes: name the two domains and describe one specific cross-domain dependency.
   - This is the hardest dependency to model — naming it is the first step.

8. What is the highest-connectivity node in your domain? (The item that, if removed, would most impact other items.)
   - This is your first critical path node.
   - Your engine's gravity computation must identify this correctly to be trusted.

---

### A.3 — Output Questions [BLOCKER]

9. Who receives the engine's recommendations?
   - The user themselves (internal)
   - A team member (internal → internal)
   - An external party (client, supplier, family)
   *Different recipients require different communication calibration.*

10. What is "Conclusion A (Aggressive)" in your domain?
    - Not "more features" — what specific optimization for speed/scale means in your context.

11. What is "Conclusion B (Defensive)" in your domain?
    - Not "less risk" — what specific optimization for loss prevention means in your context.

12. What would make a user change their decision after reading the reasoning trace?
    - Name a specific scenario. If you cannot name one, the reasoning trace is not adding value.

---

> **REMINDER — IMPLEMENTER:**
> *Adapt all questions to your vocabulary. The questions probe the
> mathematical structure of your domain. They are implementation-neutral.*

---

## SECTION B — DATA ABSORPTION AND UX

### B.1 — Input Channel Questions

13. What is the user's cognitive state when they need to input data?
    - Driving? In a meeting? Under deadline pressure?
    - This determines your primary input channel.
    - High cognitive load → voice is the only viable primary channel.
    - Low cognitive load → structured forms become viable as secondary.

14. What are the 3 most common "dump formats" your users actually use today?
    - (WhatsApp voice notes? Phone calls to self? Sticky notes? Calendar blocks?)
    - Your engine must accept all of these natively, or users will not switch.

15. What constitutes the "Cognitive Wall" in your domain?
    - The specific point at which manual entry becomes more effort than the benefit it provides.
    - If you cannot name this precisely, your UX will accidentally wall out your best users.

16. What is the "60-second first value" moment?
    - What can the engine show a brand-new user within 60 seconds that they could not see before?
    - If you cannot name a specific thing, the engine has a retention problem from day 1.

---

### B.2 — Trust Questions [BLOCKER]

17. What is Rung 0 (observation only) in your domain?
    - The absolute minimum the user must share to see any value.
    - This must not require account connection, API keys, or permission grants.

18. What proof of value unlocks Rung 1?
    - Describe exactly what the user sees that makes them willing to connect one external data source.

19. What is the user's biggest fear about giving this engine access to their data?
    - Name it explicitly. If you don't know, find out before building — it will be the reason people churn.

20. What behavior would prove to a skeptic that the engine is not making assumptions?
    - Describe a specific moment where the engine says "I don't know" instead of guessing.
    - If you cannot describe this moment, the anti-guessing policy is not implemented.

---

### B.3 — Behavioral Verification Questions

21. Name one stated preference common in your user base that is frequently contradicted by actual behavior.
    - (e.g., "I want to be proactive" but users always react; "I want to review in the morning" but users review at night.)
    - The engine should detect and surface this divergence — but only after N observations.

22. What is your N threshold for behavioral pattern detection?
    - Too low: false positives, users feel surveilled
    - Too high: slow adaptation, users notice the engine isn't learning
    - Name a specific number and justify it for your domain.

23. What is the verification loop message?
    - The exact phrasing the engine uses when surfacing a behavior-statement divergence.
    - It must be non-accusatory, data-referenced, and user-controlled.
    - Draft the message before building the detection system.

---

> **REMINDER — IMPLEMENTER:**
> *These questions probe the psychological assumptions in your design.
> Answering them before building prevents the most expensive redesigns —
> the ones caused by user adoption failure, not technical failure.*

---

## SECTION C — TEMPLATE ARCHITECTURE

### C.1 — Template Definition Questions

24. What is the first template this engine should ship with?
    - Not "the best template for power users" — the template that the median new user needs.
    - Describe its weight configuration in plain language.

25. What makes two use cases "template-compatible"?
    - Name the criteria for when a template from Domain A can be reused in Domain B.
    - If you cannot name these criteria, your template library will accumulate instead of generalizing.

26. How does a user know when to inherit a template vs. configure from scratch?
    - Describe the suggestion moment: when does the engine propose a template?
    - What data does the engine need to make a confident suggestion?

27. What is a template violation?
    - Name a specific configuration choice that is disallowed by your Universal Core template.
    - This is the boundary between "customization" and "breaking the engine."

---

### C.2 — Council Questions

28. For which decisions in your domain does a single optimization axis produce an insufficient answer?
    - Name 3 specific decisions where "maximize X" produces an answer that clearly ignores Y and Z.
    - These are your council triggers.

29. What are the 4 lenses your domain needs on its council?
    - Not "Analyst / Strategist / etc." — the specific perspectives your domain requires.
    - For construction: Finance / Timeline / Labor / Regulation
    - For personal productivity: Capacity / Relationships / Energy / Goals
    - Name yours.

30. What does "reasoning trace" mean in your domain?
    - Not "show the math" — describe what a non-technical user would read in the trace and understand.
    - If a non-technical user cannot understand the trace, the trace is not useful.

---

> **REMINDER — IMPLEMENTER:**
> *Template and council design is where domain expertise must override generic
> framework defaults. These questions are the hardest because they require
> deep domain knowledge. Do not shortcut them. An incorrect template
> structure propagates errors across every instance that inherits from it.*

---

## SECTION D — THE PRIVATE/BUSINESS SILO

### D.1 — Silo Architecture Questions [BLOCKER]

31. In your domain, what is "private" data?
    - Name specific data types, not categories.
    - (e.g., "Health appointments, family conflicts, personal finances" — not "personal things.")

32. In your domain, what is "business" data?
    - Name specific data types.

33. Is there any data that exists in both silos?
    - If yes: how does the engine handle it when the user switches context?
    - If you cannot answer this, your silo boundary is ambiguous.

34. What UI element makes the active silo permanently visible?
    - Not a setting buried in preferences. A visible, always-on indicator.
    - Describe it in one sentence.

35. What happens when a business-context action requires private-context data?
    - (e.g., scheduling a business meeting that conflicts with a private medical appointment)
    - The engine must handle this without crossing the silo.
    - Describe the exact behavior.

---

## SECTION E — COMMUNICATION CALIBRATION

### E.1 — Sensitivity Questions

36. In your domain, what is Level 1 communication? (Clinical / Logical)
    - Give an example sentence.

37. In your domain, what is Level 4 communication? (High Empathy)
    - Give an example sentence.

38. Name a specific recipient where Level 1 is appropriate and Level 4 is not.

39. Name a specific recipient where Level 4 is appropriate and Level 1 is not.

40. What triggers escalation from Level 1 to Level 4 in your domain?
    - Not "emotional situations" — name specific data signals that should trigger tone escalation.

41. What is "Level 4 Urgency" in your domain?
    - The active interruption. The phone call. The emergency alert.
    - When should the engine cross this threshold?
    - Name the specific condition that justifies interrupting a human with maximum urgency.

---

> **REMINDER — IMPLEMENTER:**
> *Communication calibration is not a UX polish — it is a core trust mechanism.
> Getting the tone wrong on a single high-stakes message can destroy the trust
> the entire engine has built. Calibration questions are as important as
> the mathematical questions.*

---

## SECTION F — THE SIX PILLARS (USE-CASE SPECIFIC)

### F.1 — General Prioritization

42. What is the "irreversible loss" threshold in your domain?
    - Below this threshold: deferral is acceptable
    - Above this threshold: immediate action required regardless of competing priorities
    - Name it as a specific, measurable condition.

43. What is the "urgency decay function"?
    - Does urgency increase linearly over time, exponentially, or in step functions?
    - (Deadline-driven = step function. Compounding interest = exponential. Most tasks = linear.)
    - Your velocity axis computation depends on this.

---

### F.2 — Deep Multi-Discipline Prioritization

44. Name the two most important disciplines that currently operate in silos in your domain.
    - These are the domains that have the most cross-domain connectivity but least cross-domain communication.
    - (In construction: Finance and Field Operations. In software: Business Strategy and Engineering.)

45. What is the translation layer?
    - When Finance says "cash flow risk" and Field Operations says "material delay," how does the engine translate between them?
    - Name the shared language.

---

### F.3 — Task Management (Living Flows)

46. What is the trigger for a task to automatically reprioritize?
    - Not "when I remember to review" — what external signal should cause the engine to reorder the queue?
    - (New dependent task added? Deadline crossed? Connected task completed?)

47. What is "done" in your domain?
    - Name the specific completion criteria that move an item from active to archived.
    - In complex domains, "done" is not binary — describe your done states.

---

### F.4 — Data Extraction and Analysis

48. What does "noise" look like in your input stream?
    - Give 3 specific examples of input that contains real signal but appears to be noise.
    - (e.g., "That thing with the supplier" appears to be vague noise but actually refers to a critical relationship.)

49. What is the minimum viable chunk?
    - The smallest unit of input that contains enough information to be actionable.
    - If a chunk is smaller than this, route it to STATE 2.

---

### F.5 — Coding (Natural Language → Structured Logic)

50. What is your schema anchor?
    - The structured format that every natural language input must eventually resolve to.
    - (e.g., "Every voice note must become: [action verb] + [object] + [deadline] + [dependency].")
    - If you cannot state the target schema, the conversion has no destination.

---

### F.6 — Core Councils

51. What is a decision in your domain where the right answer genuinely depends on which expert you ask?
    - Name a specific decision. Not a category — a specific scenario.
    - This is your first council trigger.

52. What makes a council conclusion "actionable"?
    - In some domains, "Conclusion B is recommended" is sufficient.
    - In others, the user needs the reasoning trace to trust the conclusion.
    - Describe what your users need to act on a council output.

---

> **REMINDER — IMPLEMENTER:**
> *You have reached the end of the crystallization questions. A complete set
> of answers to these questions is the specification for Phase 1 of your
> implementation. Do not begin building until the [BLOCKER] questions in
> Sections A and D have definitive answers. All other questions can be
> answered iteratively — but A and D determine your architecture.*

---

*Document version: 1.0 | Session: S047*
*Master blueprint: see master-blueprint.md in this directory.*
*CSPS mapping: see csps-mapping.md in this directory.*
