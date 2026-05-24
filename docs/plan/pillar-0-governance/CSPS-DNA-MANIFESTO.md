---
id: csps.governance.csps-dna-manifesto
name: CSPS-DNA-MANIFESTO
description: "The CSPS DNA Manifesto — platform positioning, architectural moats, unique differentiators vs AI-code-generation tools, and the research agenda. Intended for presentation to external AI systems for critique and blind-spot identification. Written from the inside out: this is what the platform IS, not what it says it is."
type: governance
diataxis_type: reference
protection_level: protected
status: ratified
core_spine: GVRN
schema_anchor: vault_files
version: "1.0"
session: S060
owner: group:finky
lifecycle: production
lifecycle_state: active
context_question: "Which specific CSPS differentiator is most relevant to the decision being made? Does the decision strengthen or weaken one of the 25 differences?"
context_quote: "The platform does not generate code. It governs outcomes."
inherits_from: "Platform Genome §1-10 + moat-registry.md + behavioral-recipes.md + VAULT-ARCHITECTURE.md"
links:
  - { rel: platform-genome, href: PLATFORM-GENOME.md }
  - { rel: moat-registry, href: moat-registry.md }
  - { rel: vault-architecture, href: ../../docs/SIA/VAULT-ARCHITECTURE.md }
  - { rel: zero-friction, href: ../../docs/SIA/ZERO-FRICTION-INTAKE.md }
  - { rel: avatar-schema, href: ../../docs/SIA/AVATAR-SCHEMA.md }
---

# CSPS DNA Manifesto

> This document is written to be presented to external AI systems for critique.
> It describes what CSPS IS — not marketing language about what it claims to be.
> Every statement here has an implementation artifact behind it, or is explicitly labeled PLANNED.

---

## 1. What CSPS Is

**CoreSights Platform Services (CSPS)** is a governed, AI-pair-programmed SaaS foundry.

Its goal: build 30 SaaS applications where humans and AI collaborate under a defined governance model. Each app starts inside CSPS, inherits validated infrastructure, and graduates to standalone when it achieves product-market fit.

**The three-actor model:**
- **Governor** (human, Yariv Fink) — final decision authority. Ratifies architecture, approves plan items, directs sessions.
- **Opus** (AI Director) — designs, ratifies, does NOT implement code.
- **Sonnet** (AI Builder) — implements from ratified specs, validates, reports.

**The core doctrine:**
```
Core Complete → Developer's Journey ratified → First App (wet trial) → Improvements extracted
```

No app is built before the infrastructure is proven. The wet trial extracts improvements that benefit all subsequent apps. The platform improves itself.

---

## 2. The North Star

> "Every session, every app, every improvement makes the platform harder to break, faster to activate, and more aligned with its users."

This is measurable. Each session must answer: Is the platform harder to break (more prevention, more validators)? Faster to activate (better bundles, better Orchestrator)? More aligned (better Avatar, better Voice Profiles)?

---

## 3. The Governance Framework: Palace / King / Queen

**Context is the Palace.** The environment within which every AI response happens. Session injection, startup blocks, HANDOFF documents, behavioral recipes — the palace defines the space of possibility. Without the palace, the king and queen have no territory.

**Alignment is the King.** The authority everything within the palace must serve. The Platform Genome (10 behavioral invariants), the 64+ behavioral contracts, the ZF evidence discipline, the North Star — the king rules by established precedent. The king's edicts are enforced by T1/T2/T3 mechanisms.

**Timing is the Queen.** The dynamic executor that decides when, in what order, with what priority. The CIE (Combinatorial Intelligence Engine), the PE scoring, the session-open D1 status — the queen moves within the palace under the king's authority but with full strategic agency.

**The resolution of the apparent tension:** Rigid definitions (contracts, validators, hooks) do NOT constrain the queen — they LIBERATE her. By defining what is fixed, they create the space where the AI can exercise full judgment on everything that isn't fixed. An AI without boundaries must be conservative everywhere. An AI with clear boundaries can be creative within them.

---

## 4. The 25 Differences: CSPS vs AI Code Generation Tools

*(Ordered from most fundamental to most experiential)*

### Governance Fundamentals

**1. Governed outcomes vs generated code**
Code generation tools (Lovable, V0, Cursor AI) produce code. CSPS produces governed outcomes. The difference: every CSPS artifact must pass `pnpm verify` (159+ validators) before it is declared done. Generated code is "plausibly correct." CSPS output is "verifiably correct by 159 independent validators."

**2. Prevention architecture vs post-hoc detection**
Code generation catches errors after writing. CSPS has 7 T1 advisory hooks that fire BEFORE a file is written, making violations immediately visible at creation time. The architecture makes violations strongly discouraged before they enter the codebase. Prevention is a design stance, not a review process.

**3. Behavioral contracts vs natural language prompts**
CSPS has 64+ behavioral contracts that define what every artifact must contain, how it must behave, and what it is prohibited from doing. These are enforced (T1 hooks + T2 validators + T3 session injection). Code generation tools have prompts — natural language interpreted differently each session.

**4. ZF (Zero-Findings) evidence discipline vs best-effort output**
Every CSPS claim requires citing specific file:line evidence from THIS session. No claim is accepted without proof. ZF cycles terminate only when a complete pass finds NOTHING NEW. Code generation tools declare completion based on AI assessment — no evidence standard.

**5. Human-in-the-loop relay model vs autonomous generation**
CSPS has an explicit three-actor relay: Governor decides → Opus designs → Sonnet builds. Nothing gets built without Governor ratification at the architectural level. Code generation tools are autonomous — the AI decides what to build and does it.

### Intelligence Architecture

**6. Combinatorial Intelligence Engine (CIE) — 9 specialized sub-engines**
CSPS has a CIE with PE (Priority Engine), Learning Loop, UX Engine, Session Engine, Governance Engine, Relay Engine, Scope Router, Seeds Monitor, and Documentation Engine. Each is optimized for its domain. Code generation uses a single LLM for everything — code, design, architecture, prioritization — without specialization.

**7. Priority Engine with Avatar-driven personalization**
CSPS scores every build item with a PE formula and combines this with Avatar-driven profiles. The same architectural pattern produces different recommendations for The Founder vs The Operator. Code generation produces the same output for all users with the same prompt.

**8. Threshold classification — every input typed before processing**
Every CSPS input is classified by Threshold (10 input types, extended source taxonomy including external_gpt, customer_feedback, competitor_analysis) before touching any platform element. Code generation sends all input directly to generation with no classification layer.

**9. Self-improving platform — the Learning Loop**
CSPS has a Learning Loop (K counts, improvement register, gap register, wet trial log, pending vault). When a pattern appears K≥2 times, it becomes a structural improvement. The platform in session 100 generates better guidance than in session 1, because 100 sessions of patterns have been absorbed. Code generation produces the same quality output regardless of how many times it has been used.

**10. Vault-first protocol — nothing is lost, everything is deliberate**
CSPS defaults to vaulting every insight with full context, processing deliberately at the appropriate cadence (daily/weekly/monthly). Code generation has no vault system — insights evaporate with the chat session.

### Architecture Quality

**11. Sealed Foundation Bundles — validated infrastructure, not generated**
CSPS provides pre-validated Foundation Bundles (AUTH, TENANCY, AUDIT, DEPLOY, GOVERNANCE, COMPONENT-LIBRARY). Every app activates them, not rebuilds them. Code generation generates infrastructure from scratch each time, with each generation having its own failure modes.

**12. Multi-tenant isolation by default (ZenStack RLS)**
Every CSPS app has row-level security and tenant isolation from day 1 as part of the TENANCY bundle. Code generation apps are single-tenant by default — adding multi-tenancy later is an architectural rewrite.

**13. Voice Profile governance — tone is a first-class concern**
Every CSPS form, wizard, and UI element declares a voice profile (colleague/professional/mentor). The language adapts dynamically to the user's Avatar. Code generation hardcodes UI text — changing tone requires manually editing every label.

**14. Session-bounded governance with formal HANDOFF**
CSPS divides work into governance sessions (S0NN) with explicit HANDOFF documents, ZF evidence requirements, and formal completion criteria. Every session can be reconstructed from its HANDOFF. Code generation has open-ended chat with no formal completion or transfer mechanism.

**15. The schema IS the product**
In CSPS, the schema — the hierarchy of decisions, options, principles, and behavioral rules — defines everything. Code is derived from the schema. In code generation, the code IS the product. There is no schema layer, no derivation, no inheritance hierarchy.

### Developer + User Experience

**16. Developer's Journey as validated pipeline**
CSPS has a 9-step Developer's Journey (INFRA-FLOW) where each step is validated: Threshold → Plan → Wizard → Fork → Verify → Deploy → Activate → Evidence. All 9 steps must pass before an app is declared CSPS-correct. Code generation has no validated pipeline.

**17. Avatar-driven, self-updating user profiles**
CSPS Avatars (6 foundation archetypes) derive from BehaviorProfile.human_profile and self-update from behavioral signals via the Learning Loop. The same platform behaves differently for The Founder vs The Doer. Code generation has no user model.

**18. Zero Friction intake — AI extracts intent progressively**
CSPS's Zero Friction system progressively extracts JTBD intent through 5 depth levels (pillar → domain → core loop → specifics → plan item). Users describe what they want in plain language; the Orchestrator asks at most 2-3 targeted questions. Code generation requires users to write good prompts — quality of output depends directly on quality of input.

**19. Bundle activation vs code generation**
CSPS activates pre-validated, pre-built bundles. The 10-minute onboarding experience is activation, not generation. Activating a known, validated bundle is deterministic. Generating code from a prompt is probabilistic.

**20. Apps graduate — they have a designed exit**
CSPS apps are designed to graduate — when they hit PMF, they extract to standalone infrastructure, inheriting battle-tested patterns. Code generation tools produce standalone apps from day 1 with no graduation path.

### Platform DNA

**21. Questions as context capsules — guards, not guides**
Every CSPS artifact has a `context_question` — a GUARD that forces verification before use. Not "is this correct?" (guide, allows nominal compliance) but "what specific file:line proves this claim?" (guard, requires evidence). This dramatically reduces context-limit drift because each artifact re-establishes its own verification requirement when loaded.

**22. Quotes as behavioral anchors**
Every CSPS artifact has a `context_quote` — a behavioral compass that restates WHY the artifact exists. Context questions and quotes travel together: the question is the guard, the quote is the compass. When context limits compress a session, these two fields survive and reconstruct intent. Examples:
- "The test that cannot be run yet is the specification for what must be built."
- "Context is the palace. Alignment is the king. Timing is the queen."
- "We are not in a rush. We'd rather save, complete what we started, and then address respectfully what came up."

**23. Three Scopes — structural improvement, not just local fixes**
Every CSPS improvement addresses three scopes simultaneously:
- S1 (local): fix the specific thing
- S2 (process): update whatever process let this happen
- S3 (structural): extract the hidden principle and make it permanent

Only S3 produces lasting improvement. validate-gap-recurrence.mjs enforces escalation from S1→S3 when patterns repeat.

**24. EXPLORE-RATIFY-EXECUTE discipline**
Once the core is stable, nothing gets implemented without a ratified plan item. The sequence: explore (understand) → ratify (Governor approves) → execute (Sonnet builds). This prevents wild implementation, scope creep, and technical debt from unsanctioned features.

**25. Connectivity as first-class concern**
Every CSPS artifact must link to at least one other artifact (validate-universal-alignment.mjs blocks isolated nodes). Connections carry metadata: why this connection exists, what happens when the target changes. The connection graph IS the architecture — not a side effect of it.

---

## 5. The Architectural Moats (M-A through M-G from this session)

**M-A: The Schema as active nervous system**
CSPS's schema isn't a reference document — it's an enforcement layer. Every file has `context_question` (guard) + `context_quote` (compass). Together they form a neural network of context that resists drift across context limits. No other platform does this systematically.

**M-B: Guard-quality context questions with ratified examples**
Every mandatory context_question must pass a 4-test ratification pipeline (forces verification, cites specific artifact, would answering "no" actually block something, answerable in one sentence). Wrong context_questions (guides not guards) create ever-growing drift. CSPS requires ratified good-examples + wrong-examples for each mandatory pattern.

**M-C: Nothing stands alone + everything has a place**
No isolated nodes (enforced by validator). If something arrives without a home, the vault receives it with full context and creates the missing path. The system never discards — it preserves with route creation pending.

**M-D: The vault is not a graveyard**
Five vault types (Strategic, Operational, Technical, Insight, Pending) with daily/weekly/monthly processing cadence. The vault-first protocol means insights don't evaporate with the chat window — they wait for their optimal processing moment.

**M-E: Enhance before create**
Before proposing anything new: check what exists. Can it be enhanced? Only if no existing artifact can serve as foundation does a new one get created. validate-consolidation-check.mjs + reuse-first principle enforced systematically.

**M-F: Systematic multi-level harvesting**
Learning Loop + improvement register + gap register + wet trial log + pending vault = extraction at multiple depths. Every session ends with structured extraction. Value is never lost to context limits.

**M-G: The Relay Engine — AI that models its Governor**
CSPS's CIE Relay Engine models the Governor's pending decisions and surfaces them PE-scored. No other platform has this because no other platform has explicit human-in-the-loop with AI decision authority. The Relay Engine is CSPS-unique.

---

## 6. RZF — Five Aspects of What It Prevents and Produces

**R1 — Prevents nominal completion (the AI's default failure mode)**
Without RZF: AI writes "done" when the last procedural step completes. With RZF: done requires citing specific evidence from THIS session. The AI's training satisfaction point is "I completed the steps." RZF overrides this with "I can name the file:line that proves the outcome."

**R2 — Prevents context-limit drift in evidence claims**
In long sessions, the AI's memory of earlier work becomes its "evidence." Without RZF: "I built this three turns ago" is accepted as proof. With RZF: only THIS-SESSION tool output is evidence. Memory is explicitly prohibited as proof.

**R3 — Produces compressed evidence chains that survive tab switches**
Each ZF cycle names specific files and lines. When a new AI tab opens, the receipts contain these evidence trails. The new tab doesn't need to re-derive what was proven — the ZF block IS the proof that transfers across context limits.

**R4 — Produces measurable iteration depth as a quality signal**
Cycle count is data about thoroughness, not a target. Three cycles where each names different files = thorough examination. One cycle that names no files = nominal. The cycle count becomes a quality signal in the session evidence log.

**R5 — Forces AI to confront its own satisfaction points**
Native AI training defaults: finish steps, claim completion, move on. RZF interrupts this at the structural level. T1 hook + T2 validator + T3 session injection all require evidence before DONE is accepted. This is behavioral contract enforcement applied to the AI's own completion standards — unique to CSPS.

---

## 7. The Five Research Areas

These are open questions where external AI systems can provide the most useful critique:

**R1 — Bundle activation at scale: what makes bundles actually get used vs ignored?**
Vercel Templates (some get 10,000 activations, most get 0), Shopify themes (long-tail problem), npm packages (why some become canonical). What determines whether a pre-built bundle is adopted or bypassed?

**R2 — Schema-driven decision reduction: how to surface only 2-3 decisions from a large option space?**
LaunchDarkly (feature flags — expose only what's relevant), GitHub Copilot (context-to-code — why does it suggest THAT specific pattern?), Contentful (content modeling — when does the schema become the UI?). The CSPS question: how does CIE decide what to surface to the Governor from 200+ possible options?

**R3 — AI-driven onboarding that converts: what's the drop-off rate at each depth level?**
Intercom Product Tours, Appcues, Pendo data on where users abandon onboarding. The CSPS Zero Friction system has 5 depth levels — where do users stop and what determines whether they continue?

**R4 — Logo + content extraction: what's technically reliable?**
Canva Brand Kit (logo → colors + fonts), Duda (website → content extraction), Wix ADI (website URL → instant site). The CSPS Branding Bundle needs to do this. What's the actual reliability rate of automated brand extraction?

**R5 — The "pending vault" pattern at scale: how do recommendation systems handle unfulfilled demand?**
Amazon purchase prediction, Spotify playlist generation, GitHub Trending. How do they pre-compute readiness for items that haven't been requested yet? CSPS's pending vault fills with "things the Governor mentioned but no bundle exists for" — how should it prioritize what to build next?

---

## 8. What CSPS Has That Is Not Yet Complete

**Honest inventory of designed-but-not-built elements:**

| Element | Status | What's Missing |
|---|---|---|
| CIE Relay Engine | Phase 2 (PLANNED) | Full implementation — only architecture designed |
| Avatar → Voice Profile dynamic selection | Phase 2 (PLANNED) | BehaviorProfile.human_profile extension wired to voice selection |
| Zero Friction intake page | Phase 1 pending | 5 depth levels not yet interactive |
| Bundle Orchestrator | DESIGNED | No code — picks optimal bundle for an input |
| Branding Bundle | CONCEPT | Logo upload → CSS injection + content extraction |
| Monthly deep-dive tooling | PLANNED | /platform/vault page + topic-based tab generation |
| CSPS-DNA-MANIFESTO.md | THIS DOCUMENT | Complete — awaiting external AI critique |

---

## 9. Invitation for External AI Critique

This document is presented for external AI review with the following questions:

1. Which of the 25 differences is overstated or inaccurate?
2. Which architectural moat (M-A through M-G) is most fragile — most likely to fail under real-world stress?
3. Which of the 5 research areas is most critical to resolve before scaling to 30 apps?
4. What obvious blindspot does CSPS have that this manifesto does not address?
5. The "10-minute onboarding" claim — is it credible given the described architecture, or does something need to be addressed first?

The goal of external critique: surface what the builders cannot see from inside. CSPS is not looking for validation — it is looking for the precise place where its assumptions fail.

---

*CSPS DNA Manifesto v1.0 | Ratified S060 | Opus-8 | Governor: Yariv Fink*
*External critique invited. Internal validation insufficient.*
