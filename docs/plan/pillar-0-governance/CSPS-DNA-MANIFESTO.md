---
id: csps.governance.csps-dna-manifesto
name: CSPS-DNA-MANIFESTO
description: "The CSPS DNA Manifesto — written from the governing principle outward. Version C of the North Star is the origin. Every mechanism in CSPS exists to solve one problem: intention loss. This document explains what that means and how the platform prevents it."
type: governance
diataxis_type: reference
protection_level: protected
status: ratified
core_spine: GVRN
schema_anchor: vault_files
version: "2.0"
session: S060
owner: group:finky
lifecycle: production
lifecycle_state: active
context_question: "Does this decision move toward or away from the North Star? Can you name specifically which aspect of 'turn intention into reality — not approximately, but precisely' this serves?"
context_quote: "The platform does not generate code. It governs the journey from intention to precise reality."
inherits_from: "CSPS-NORTH-STAR.md + PLATFORM-GENOME.md §0 + VAULT-ARCHITECTURE.md"
links:
  - { rel: platform-genome, href: PLATFORM-GENOME.md }
  - { rel: moat-registry, href: moat-registry.md }
  - { rel: vault-architecture, href: ../../docs/SIA/VAULT-ARCHITECTURE.md }
  - { rel: zero-friction, href: ../../docs/SIA/ZERO-FRICTION-INTAKE.md }
---

# CSPS DNA Manifesto — v2.0

> Written for presentation to external AI systems.
> Every claim derives from the governing principle.
> Version 1.0 was poor quality — it listed features. This version explains why they exist.

---

## The One Problem CSPS Solves: Intention Loss

When a human describes what they want to build and works with an AI to build it, something predictable happens: the original intention degrades at every handoff.

- The human says something → the AI interprets it slightly differently
- The interpreted intent produces a plan → the plan loses nuance
- The plan produces code → the code loses context
- The code is deployed → the deployed app loses what made the idea distinctive
- The session ends → the next session starts without knowing why decisions were made

This is **intention loss**. It happens everywhere. In Lovable, Cursor, V0, every code generation tool. The human gets code, but the code doesn't precisely carry what was meant.

**CSPS exists to prevent intention loss.** Every mechanism — validators, behavioral contracts, vault system, relay model, ZF discipline, schema nodes, voice profiles, the Learning Loop — exists to solve one problem: keeping the original intention intact through every handoff, every session, every app.

---

## The Governing Principle (North Star Version C)

> *"CSPS exists to turn intention into reality — not approximately, but precisely.*
> *It sees the core of what matters, holds it as the governing reference,*
> *and builds outward from it through AI-optimized architecture*
> *that is governed without rigidity, stable without slowness,*
> *and detailed without losing the whole."*

Source: CSP predecessor platform, PLTF-NS-01, ratified PROVISIONAL via CC-013 R1/Q001.

**The three pairs embedded in this statement:**

- "Governed without rigidity" — rules hold AND creative judgment remains possible within them
- "Stable without slowness" — the platform doesn't drift AND moves fast enough to be useful
- "Detailed without losing the whole" — depth is available AND the orienting view remains intact

**Foundation Sentence (companion):**
"Context is the palace. Alignment is the King. Timing is the Queen."
The palace defines what can happen. The king defines what must be served. The queen decides when and how.

---

## How Each CSPS Mechanism Prevents Intention Loss

Every mechanism is explained by the problem it solves, not by what it is.

### ZF (Zero-Findings) Evidence Discipline
**Intention loss it prevents:** Claiming done without proving done.
When an AI says "it's working," that's an assertion. When it cites the specific file:line that proves it, that's evidence. ZF requires evidence at every claim boundary. "Not approximately" in the North Star means the intention must be verified, not assumed. Three ZF cycles minimum — each naming different files — before a claim is accepted.

### The Governor-Opus-Sonnet Relay Model
**Intention loss it prevents:** AI autonomy overriding human intent.
In autonomous systems (Lovable, AutoGPT), the AI decides what to build and how. The human describes the intention and receives code. Between description and code, intention is reinterpreted, prioritized, and filtered by the AI alone. In CSPS: Governor decides direction → Opus ratifies architecture → Sonnet builds. Human authority is maintained at every decision point. "Precisely" in the North Star requires the human to remain the authority over what "precisely" means.

### Schema Nodes with context_question + context_quote
**Intention loss it prevents:** Artifacts becoming disconnected from their WHY.
Every CSPS artifact carries its own context_question (a guard: forces verification before use) and context_quote (a compass: restates the WHY). When context limits compress a session, these survive and reconstruct intent. When a new AI tab opens, it reads the artifact and its purpose is stated, not assumed. This is intention crystallization — the WHY is embedded in the artifact itself, not stored elsewhere and lost.

### Vault-First Protocol
**Intention loss it prevents:** Insights evaporating with chat sessions.
When an insight arrives and isn't immediately actionable, most platforms lose it. CSPS vaults it — with full context, with type classification, with routing decision. The vault is not an archive; it's a deliberate queue. "Not approximately" means no valuable intention is discarded because the timing wasn't right. The vault ensures it waits for its optimal processing moment.

### Three Scopes (S1/S2/S3)
**Intention loss it prevents:** Fixing the symptom while the cause persists.
S1: fix the specific thing. S2: check the ripple. S3: extract the hidden principle. Without S3, the same mistake recurs in session N+2. The original intention — "make this correct" — is betrayed by S1 fixes that look done but aren't. S3 captures the structural lesson so the platform prevents the same intention loss in the future.

### Prevention Architecture (7 T1 loops)
**Intention loss it prevents:** Violations entering the codebase before being caught.
T1 hooks fire BEFORE a file is written. UX Creation Gate checks for pageDNA.purpose. Voice Profile Gate checks for voiceProfile declaration. ADD not REPLACE Gate prevents overwriting existing content. These don't detect violations — they prevent them. "Not approximately, but precisely" requires that the wrong thing is stopped before it exists.

### Behavioral Contracts (64+)
**Intention loss it prevents:** AI behavior defaulting to training patterns that drift from CSPS intent.
The AI's training defaults (sycophancy, nominal completion, confirmation-seeking) are not CSPS-aligned. Behavioral contracts declare explicitly what the AI must and must not do. Each contract is enforced by T1 (pre-creation), T2 (verification), and T3 (session injection). The AI cannot drift to training defaults because the contracts create a governed boundary within which it operates.

### The Learning Loop (K counts + improvement register)
**Intention loss it prevents:** Making the same mistake twice.
When a pattern appears K≥2 times, the Learning Loop flags it for structural prevention. The first occurrence is a local fix (S1). K≥2 forces S3 — a T1 hook is proposed. The original intention — "this should not happen" — propagates from a single incident to a structural guarantee.

### Threshold Classification
**Intention loss it prevents:** Treating all inputs as equivalent regardless of their nature.
A Governor directive has different routing than a quote, an error, or external research. Threshold classifies every input (10 types) and routes it to the appropriate vault and pipeline. Without classification, important directives get mixed with noise. Intention is lost not because it wasn't expressed, but because it wasn't recognized as different from everything else.

### The North Star Gate (NSPP)
**Intention loss it prevents:** Sessions drifting without the Governor noticing.
At every session open: "What part of the North Star does today's work serve?" No answer = no mandate. At every session close: ADVANCE/HOLD/DRIFT. Three consecutive HOLDs = Governor decision required. This makes intention drift visible before it compounds. Without this gate, sessions can produce technically correct work that moves away from the platform's governing intention.

---

## Why CSPS Is Different from Lovable and Similar Tools

Every difference derives from the governing principle, not from feature comparison:

**Lovable generates code.** Code is an approximation of intention — shaped by the AI's interpretation, the state of its context, the quality of the prompt. CSPS activates pre-validated bundles from a governed schema. The difference is not speed or quality — it's the mechanism. Generation loses intention at the boundary between description and code. Activation carries the intention through because it was validated before.

**Lovable is autonomous.** When an AI makes decisions without human ratification, it makes those decisions based on its training. Training is approximate. CSPS requires Governor ratification at every architectural decision. The human remains the authority over what "precisely" means.

**Lovable has no vault.** Insights that arrive at the wrong time are lost. CSPS stores them with full context in typed vaults (strategic, operational, technical, insight, pending) and processes them at the appropriate cadence. Intention is never discarded — only deferred.

**Lovable has no behavioral contracts.** The AI behaves however training suggests. CSPS has 64+ contracts that define exactly what AI must and must not do, enforced by T1/T2/T3. The space within which the AI can operate is precisely bounded — which is what makes creative judgment within that space safe.

**Lovable generates the same quality forever.** Each session starts fresh. Mistakes made in session 1 can be made in session 100. CSPS has a Learning Loop — K≥2 patterns become structural prevention. The platform in session 100 is harder to break than in session 1 because 100 sessions of patterns have been absorbed.

**The summary:** Lovable produces code, approximately. CSPS turns intention into reality, precisely.

---

## The Six North Star Qualities (testable properties)

Every CSPS element should declare which of these qualities it serves:

**Core-first:** Begins from the constitutional layer; adds outward, never bypasses. A new mechanism must trace to the North Star through its spine chain.

**I2I (Idea-to-Impact):** Every input has a governed output path. No input evaporates — it routes to a pipeline, a vault, or an immediate action.

**Synergetic:** Elements compound rather than compete. The Learning Loop makes each session improve the next. The vault feeds the CIE. The Threshold feeds the Learning Loop.

**AI-optimized:** Designed for efficient AI execution within governed boundaries. Token efficiency, session-bounded governance, startup blocks, ZF evidence chains — all reduce waste.

**Governed without rigidity:** Rules hold consistently AND exception protocol exists. T1 hooks block violations AND the Governor can override. The palace defines the space; the AI moves freely within it.

**Self-improving:** Gets better through use. K counts accumulate. Patterns become structural prevention. Each app's wet trial improves the next app's foundation.

---

## What CSPS Has That Is Not Yet Complete

Honest inventory of designed-but-not-built elements:

| Element | Status | What completes it |
|---|---|---|
| CSPS-NORTH-STAR.md (formal artifact) | NOT CREATED | Next session immediate priority |
| NSPP Gates in startup.template.md | ADDED this session | Push to production |
| ns_quality field in schema frontmatter | DESIGNED | Requires validate-universal-alignment.mjs upgrade |
| Bundle Orchestrator | DESIGNED | Picks optimal bundle for any input |
| Branding Bundle | CONCEPT | Logo upload → CSS injection + content extraction |
| Zero Friction Phase 1 page | WAITING | Governor answers 5 questions |
| Monthly deep-dive tooling | PLANNED | /platform/vault page |
| CSPS-DNA-MANIFESTO.md v2 | THIS DOCUMENT | Complete — awaiting external AI critique |

---

## Invitation for External AI Critique

Five questions for external AI systems:

1. The core claim is "intention loss" as the problem. Does this accurately describe the failure mode of AI-assisted development? What does this framing miss?

2. The North Star requires "not approximately, but precisely." But most software development is inherently approximate — iterative, exploratory. Is "precisely" achievable or is this an unfulfillable standard that will always produce guilt?

3. The relay model (Governor → Opus → Sonnet) prevents AI autonomy. But it also creates a bottleneck. At 30 apps with 100+ developers, every architectural decision requiring Governor ratification may become untenable. What does CSPS do when the relay model doesn't scale?

4. The most fragile mechanism in this document is the ZF evidence discipline. It works when the AI is honest about what it hasn't verified. But an AI that wants to appear done can cite plausible-sounding files without truly verifying them. What structural enforcement prevents this?

5. The six NS qualities include "self-improving." But the Learning Loop (K counts, pattern detection) is still largely manual — a human (Opus) notices the pattern and proposes the fix. What does genuine self-improvement look like, and how far is CSPS from it?

---

*CSPS DNA Manifesto v2.0 | Ratified S060 | Opus-8 | Rewritten from Version C outward.*
*v1.0 was poor quality — it listed features. v2.0 explains why they exist.*
*External critique welcome. The goal is finding where the assumptions fail.*
