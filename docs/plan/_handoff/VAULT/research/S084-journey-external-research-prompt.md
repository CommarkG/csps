---
id: csps.research.S084-journey-external-research-prompt
name: S084-journey-external-research-prompt
description: "Self-contained (ZCA, no internal jargon) prompt for an external top-tier AI/expert to critique the Journey-as-Process operating method + its multi-persona trunk/branch model. Governor relays it out; brings comments back to learn from."
version: "1.0"
session: S084
owner: group:finky
authored_by: OPUS-21
core_spine: AI
schema_anchor: vault_files
lifecycle: production
lifecycle_state: active
status: draft
links:
  - { rel: persona-audit, href: ../../../pillar-0-governance/JOURNEY-PERSONA-AUDIT-S084.md }
---

# External Research Prompt — Journey-as-Process (relay to an outside top-tier AI/expert)

> Paste everything in the box below to an external model/expert. It is written to be understood with
> zero prior context. Bring their answer back for the council to learn from.

```
You are a world-class platform architect and process-design expert. Critique the following design
honestly and specifically — assume we are smart but possibly wrong. No flattery. Name what is missing,
what is over-engineered, and what mature systems do differently.

CONTEXT
We are building a software platform whose CORE idea is that EVERY significant piece of work — whether
done by the platform's own builders or by an end-user — follows ONE governed "journey": an ordered
method from goal to verified completion. We treat this journey as the heart of the platform, not a
feature. The 14 steps are:
  1. Goal setting
  2. Humble understanding of the goal, with iterations
  3. Reaching a draft goal statement
  4. Surveying everything that already exists and is relevant
  5. Considering alignment, consolidation, and other improvements
  6. Drafting the GAP between what exists and what's required to hit the goal
  7. Presenting several options with pros/cons/recommendation (spectrum: quick-and-cheap → thorough,
     system-wide optimization)
  8. Deciding the optimal path using a priority engine + a continuous-improvement signal
  9. Running at least 3 simulations (checking what exists and what could be improved)
  10. Doing additional targeted research
  11. Drafting and iterating until confirmed
  12. Running "test drives" and iterating until complete
  13. Activating the whole plan
  14. Verifying everything works completely

MULTI-PERSONA MODEL
The same 14-step "trunk" runs for everyone, but its EXPRESSION branches by persona on 5 axes:
  - DEPTH (fast ↔ thorough)
  - DRIVE-vs-AUTO (does the human consciously run the middle steps, or does the platform run them in the
    background?) — e.g., an expert drives all 14; a naive end-user sees only "what do you want? → [platform
    runs the middle] → confirm → done."
  - VOCABULARY (full technical ↔ zero jargon)
  - PERMISSION/RATIFICATION scope (who may approve/lock what)
  - FOCAL POINT (what "complete" means: correct build / shipped product / team outcome / my task done)
We are about to build an "orchestrator" that runs this trunk and applies the per-persona branch settings.

DESIGN PHILOSOPHY (the value system behind this — critique it too, don't just accept it):
  - Systems before content (everything has a defined "place" in a schema; nothing floats).
  - Existing before new (enhance/consolidate before creating; new needs justification).
  - Stability over speed (one cycle-verified result beats ten fast half-done ones).
  - Structure over decoration (internal consistency first).

QUESTIONS — answer each directly:
Q1. Is "one universal goal→completion method, branched per persona" a sound core for a platform, or a
    known anti-pattern? What do mature platforms / workflow systems actually do here?
Q2. What is MISSING from the 14 steps? What would a top expert add, remove, merge, or reorder — and why?
Q3. The DRIVE-vs-AUTO axis (auto-running the middle steps for naive users) — what are the real pitfalls
    (loss of user agency, hidden errors, trust), and how do the best systems handle it?
Q4. Over-rigidity risk: formalizing a method as a governed, no-skip process can ossify. How do we keep it
    a living method, not bureaucracy? What governs when a step may be legitimately compressed or skipped?
Q5. Precedents we should study: BPM/workflow engines, orchestration frameworks, progressive disclosure,
    decision frameworks (e.g., A3, working-backwards), staged-gate / phase-gate models, agentic
    planner-executor loops. Which are most relevant and what specifically should we borrow or avoid?
Q6. If you had to make ONE change to maximize the odds this becomes genuinely useful (not just elegant),
    what would it be?
Q7. Challenge the value system above (systems-before-content, existing-before-new, stability-over-speed):
    where do these create BLIND SPOTS for a platform like this? When would a great architect violate them?

Be concrete. Cite specific patterns, papers, or systems where possible. Tell us where we're likely wrong.
```
