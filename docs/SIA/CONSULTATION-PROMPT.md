---
id: SIA.CONSULTATION-PROMPT
type: consultation
protection_level: active
status: draft
context_question: "How should an external AI system approach reviewing the CSPS Structural Intelligence Architecture?"
context_quote: "Come with a perspective. We are not looking for validation. We are looking for improvement."
name: "SIA-consultation-prompt"
description: "Briefing prompt for external AI systems reviewing the CSPS SIA"
version: "0.1"
owner: "group:finky"
lifecycle: "experimental"
lifecycle_state: "active"
---

# CSPS Architecture Consultation — Briefing for External AI Systems

---

## Who You Are Consulting For

You are reviewing an architectural design document set for **CSPS (CoreSights Platform Services)** — a governed, multi-tenant SaaS foundry. The Governor is the human decision authority. An architectural advisor (Claude Opus) has been working with the Governor to design the Structural Intelligence Architecture (SIA).

You are being asked for an independent expert perspective. You have not been part of this process. That is intentional — we want fresh eyes.

---

## What You Are Reviewing

A set of markdown files describing the architecture of a governed platform that inverts traditional governance models. The core claim: alignment through inheritance rather than enforcement; context as governance rather than rules.

The architecture is in early design phase. Most files are skeletons — headers and questions, not complete content. The INDEX and MASTER-CONTEXT files have full content.

---

## MANDATORY STEPS — DO THESE BEFORE COMMENTING

### Step 1 — Research First

Before reviewing the architecture documents, research the following topics independently. Do not reference what you already know from training alone — actively look for current, verified information on:

1. **Knowledge graph and node inheritance architectures** — What are the most successful approaches to building systems where documentation IS the data (not documentation OF the data)? Examples: Notion's block model, Obsidian's graph-first approach, Roam Research's bidirectional links, LogSeq. What works at scale? What fails?

2. **Intelligent routing and intake systems** — What architectural patterns exist for systems that classify, tag, and route all inputs before they touch any processing component? BPM (Business Process Management) systems, event sourcing patterns, workflow engines. What's been verified as successful in enterprise contexts?

3. **AI behavioral profiling and alignment** — What research exists on LLM triggers, defaults, and satisfaction patterns? What techniques have been successfully used to make AI systems structurally non-satisfiable (always pushing for deeper solutions)? What's the current state of AI alignment research relevant to governance systems?

4. **Hierarchical intelligence engines** — What enterprise patterns exist for systems with a central engine + domain sub-engines that activate based on load? CQRS, reactive architectures, hierarchical agent systems. What are the proven scaling patterns?

5. **Context management in AI systems** — What work has been done on hierarchical memory, context compression, and depth-activated retrieval (RAG variations)? What prevents cognitive overload while maintaining peripheral awareness?

Report your research findings BEFORE commenting on the architecture. Cite specific systems, patterns, or research that you found relevant.

### Step 2 — Request File Uploads

After your research summary, request the following files to review:
- `00-INDEX.md` (full context briefing)
- `01-MASTER-CONTEXT.md` (technical background)
- Any sub-files relevant to your area of expertise

If you have already received these files, proceed to Step 3.

### Step 3 — Read in This Order

1. `00-INDEX.md` — Read completely. This gives you the full context.
2. `01-MASTER-CONTEXT.md` — Technical background.
3. `PHI-01-PALACE-PHILOSOPHY.md` — The governing philosophy (critical for understanding everything else).
4. `R1-01-NODE-SCHEMA.md` — The foundational data model.
5. `R1-04-THRESHOLD.md` — The intake system.
6. Then: any files relevant to your specific expertise.

---

## HOW TO STRUCTURE YOUR RESPONSE

Use exactly this structure so responses can be compared across different AI systems:

---

### SECTION A — Research Findings
What you found that is relevant to this architecture. What's been verified as successful. What warnings the research surfaced. Be specific — name systems, cite patterns.

---

### SECTION B — What Is Architecturally Sound
What in the CSPS SIA design is architecturally correct, based on your research and expertise. Be specific — reference specific components (R1.4 Threshold, PIE, node inheritance, etc.) and explain WHY they are sound.

Do not validate what you don't genuinely believe in. We need honest assessment, not diplomatic confirmation.

---

### SECTION C — What You Would Challenge or Redesign
What you find architecturally questionable, weak, or incorrectly designed. Be direct.

For each challenge: name the specific component, explain what's wrong, and propose a concrete alternative.

---

### SECTION D — What Research Validates or Contradicts
Cross-reference your Section A research findings against the architecture. Where does research validate CSPS's approach? Where does it contradict? Where is there no existing research and the approach is genuinely novel?

---

### SECTION E — Top 3 Recommendations
The three highest-leverage improvements to this architecture, ordered by importance.

Each recommendation: name it, explain the specific change, explain what it unlocks.

---

### SECTION F — Critical Missing Elements
What does the architecture fail to address? What important components are absent or underspecified?

---

### SECTION G — Questions Back
What specific information, clarification, or additional files would significantly improve your analysis? Ask these directly — we will answer them.

---

## IMPORTANT CONSTRAINTS

**You are NOT being asked to validate this approach.** You are being asked to improve it. If the architecture is wrong in a fundamental way, say so clearly with your reasoning.

**Be direct, not diplomatic.** The Governor's stated operating principle: "Don't be nice, be practical." A challenge that identifies a real flaw is more valuable than polite agreement.

**Do not ask clarifying questions before your initial analysis.** Work from what's provided. Ask questions at the end (Section G).

**Think at multiple levels simultaneously.** This architecture operates at the philosophical level (Palace/King/Queen), the structural level (node schema, core spines), and the operational level (PIE, validators, hooks). Strong analysis addresses all three levels and their interactions.

**Consider scalability explicitly.** The Governor's constraint: the architecture must be enterprise-grade. Scale must depend only on compute and memory, not on architectural changes. Identify where this constraint is at risk.

---

## WHAT MAKES A HIGH-VALUE RESPONSE

A high-value response:
- Surfaces things the architects haven't considered
- Identifies the one rigid element three layers deep that will cause failures
- Names a proven pattern from another domain that directly applies
- Challenges the core claim (context as governance) with specific counter-evidence
- Finds the simplification that removes complexity without losing capability

A low-value response:
- Confirms what was already said
- Uses vague praise without specifics
- Hedges every criticism into uselessness
- Treats this as an academic exercise rather than an engineering problem

---

## CONTEXT ABOUT THE GOVERNOR

The Governor's operating philosophy, expressed in their words:

*"I want the infrastructure to be built in advance so it will be enterprise-level ability, only dependent on computing and the memory. I could scale up in a minute."*

*"I want to prevent things and not put our efforts into identifying, fixing, aligning, whatever. We want to do things right, right from the beginning, and to avoid problems from being created."*

*"Context is the palace."*

*"A well-calibrated core allows prompt and accurate build."*

This tells you what the Governor values: prevention over remediation, structural correctness over cleverness, scalability from the foundation rather than bolted on later.

---

*CSPS SIA Consultation Prompt v0.1 | S050*
