---
id: csps.governance.naive-personas-doctrine
name: NAIVE-PERSONAS-DOCTRINE
description: >
  Canonical "naive persona" simulation doctrine (S072 draft) authored by OPUS-14 per Governor S072 directive.
  Closes the EXPERT-PERSONA-AUDIT-BIAS gap: every CSPS persona to date (cruel-critic, consolidation-expert,
  bottleneck-expert, balance-expert, schema-expert, ux-expert, synergy-master, vocabulary-canon — 8 active per M4)
  audits from above (domain expert critiquing rigor). NONE simulate from below (naive user accomplishing
  a task). Native AI (Opus/Sonnet/Claude Code's runtime) is itself an expert-tier reviewer — its journey
  audits inherit senior-architect bias by construction. Fix: a sample set of 11 NAIVE personas (5 user · 4
  developer · 2 plan-audit) — expandable per P-META-028 cornerstone — used in planning, implementation audit,
  front-end flow review, and journey completion. Composes with Facet E selectPersonas() + threshold
  INVOKE + PLATFORM-OBSERVATION pipeline + AI-PROFILING D-default exposure. status: draft pending Governor ratification.
type: governance
diataxis_type: reference
protection_level: protected
status: draft
impl_status: architecture-pending
vault_pending: vlt-S072-naive-personas-doctrine
retrieve_when: "Governor ratifies → Sonnet builds 11 .claude/skills/naive-* persona files + threshold wiring + first audit pass on dev-journey + user-journey"
core_spine: AI
core_spines: [AI, GVRN, OPER]
schema_anchor: pillar_0_governance_leaves
version: "1.0"
session: S072
owner: group:finky
authored_by: OPUS-14
lifecycle: production
lifecycle_state: active
ns_quality: [core-first, synergetic]
ns_path: "this → AI spine → North Star (audits see the journey as the audience does, not as the architect does)"
context_question: "Before auditing this journey/plan/UI: am I (the native AI reviewer) about to surface only expert-tier findings? Have I invoked at least one naive persona whose attention span / jargon tolerance / mental model matches the actual target audience?"
context_quote: "The architect always thinks the doorway is wide enough. — Governor S072 Turn 3 (paraphrased): 'you go over a journey and you are absorbed with your native AI persona — neither are the typical end user.'"
inherits_from: "M4 selectPersonas() Facet E + 8 existing expert personas in .claude/skills/ + B_AGENT_ALIGNMENT_PROTOCOL + ux-expert skill (closest existing analog, but still expert-tier) + AI-PROFILING-TO-COMMUNICATION-FEEDBACK (D6/D3/D7 defaults are exactly what naive personas expose) + PLATFORM-OBSERVATION (findings flow through the same OBSERVE→AGGREGATE→...→IMPLEMENT pipeline)"
links:
  - { rel: existing-personas, href: ../../../.claude/skills/ }
  - { rel: ux-expert-closest-analog, href: ../../../.claude/skills/ux-expert/SKILL.md }
  - { rel: selectpersonas-mechanism, href: ../../../tools/scripts/threshold-router.mjs }
  - { rel: weekly-audit, href: ../../../tools/scripts/weekly-persona-trigger-audit.mjs }
  - { rel: ai-profiling, href: ./AI-PROFILING-TO-COMMUNICATION-FEEDBACK.md }
  - { rel: platform-observation, href: ./PLATFORM-OBSERVATION-DOCTRINE.md }
  - { rel: developer-journey, href: ../pillar-4-developer-experience/developer-journey/01-developer-threshold.md }
---

# Naive Personas Doctrine · Draft (S072)

> **One sentence:** Every journey/plan/UI audit invokes at least one naive persona (sample-set: 5 user · 4 developer · 2 plan-audit) whose attention span, jargon tolerance, and mental model match the actual target audience — not the architect's. The native AI reviewer (Opus/Sonnet) is by construction an expert-tier persona; without naive simulation, audits surface expert-tier findings only.

## 1 · Why this exists (the failure mode named — EXPERT-PERSONA-AUDIT-BIAS)
- **The existing 8 personas** (cruel-critic · consolidation-expert · bottleneck-expert · balance-expert · schema-expert · ux-expert · synergy-master · vocabulary-canon) all critique from architectural altitude. ux-expert is closest to user-side but still applies expert UX heuristics, not user-tier simulation.
- **The native AI reviewer** (Claude Code's Opus/Sonnet runtime) reads 100-line YAML frontmatter naturally, parses `governing_principle: P-META-028` without context loss, has unlimited patience for `audience_hierarchy[]` nested structures. **The actual end user has none of those.**
- **Lived test:** name one current CSPS artifact where the architect (me) saw "clear" while the target audience would see "confusing." The vocabulary.md §Dev↔User Glossary uses the word "canonical" — fine for a developer, opaque for a small-business team-leader. The /platform/communication dashboard renders "8 situations × 6 audience tiers" — fine for governance-savvy readers, intimidating to a first-time evaluator. The 14-class threshold table reads as elegant taxonomy to me; to a naive evaluator it reads as "I don't know how I'd ever fit into this."

## 2 · Research grounding (how AI platforms use persona-agents for naive testing)

| Pattern | Where it comes from | What it does |
|---|---|---|
| **Persona-conditioned LLM simulation** | Cooper personas (1990s HCI) + GPT-based persona research (PersonaGPT, 2023) | LLM adopts persona profile (age/role/tolerance/goals) → walks through artifact → reports confusion points |
| **Wizard-of-Oz with LLM stand-ins** | Classic UX testing + Anthropic Constitutional AI self-critique | LLM acts as the user; system response is what real user sees. Gap between persona's expectation and system's actual = finding. |
| **Multi-agent debate / red-team** | Du et al. 2023, Anthropic Sleeper Agents red-team | N personas argue different positions → consensus failures = real UX gaps |
| **Per-tier evaluation** | LMSYS Chatbot Arena, OpenAI evals framework | Same prompt evaluated by personas at different sophistication levels — reveals whose-experience-degrades-where |
| **Agent role-play** | LangChain agents · CrewAI · AutoGen | Each agent has explicit role/persona; tasks routed by persona match |

**CSPS-native equivalent:** the existing 8 expert personas + Facet E `selectPersonas()` + threshold INVOKE = already the M4 mechanism. **Add naive personas to that registry; they invoke through the same routing path. No parallel machinery.**

## 3 · The naive persona set (sample — expandable per P-META-028)

### USER-tier naive personas (5)

| Persona slug | Profile | Audit triggers | Confusion signals |
|---|---|---|---|
| `naive-first-time-user` | Never seen the platform; 2-minute attention span before frustration; expects ZERO jargon; mental model is "I want to do X" | First-time landing page · onboarding flow · feature-discovery surfaces | "I don't know what this does" · "where do I start?" · scans for the primary action and clicks the brightest button regardless of correctness |
| `naive-anxious-evaluator` | Testing whether to buy/trust; ACTIVELY looking for reasons to abandon; needs trust signals (security, real-user counts, clear pricing) within 3 clicks | Marketing pages · pricing · security/trust pages · auth flow | "Is this real?" · "Can I trust this with my data?" · abandons at any ambiguity or unexplained-jargon |
| `naive-task-focused-user` | Knows exactly the task; does NOT care about features/architecture; rages at any detour | Multi-step flows · forms · checkout-style sequences | "Why are you asking me this?" · "Just let me do the thing" · abandons at unnecessary fields, wizard steps, or feature-tours |
| `naive-mobile-on-the-go` | Small screen; distracted; network may fail mid-action; only sees what's above the fold on a 6" phone | Every page (mobile rendering) · forms · critical-path flows | "Where is the button?" · "This is broken" (when actually just below fold) · abandons on >1 network failure |
| `naive-return-user-2-weeks-later` | Used the platform once 2 weeks ago; forgot half the model; needs context recovery at every step | Dashboard · recurring flows · "where was I?" surfaces | "Wait, what does this mean again?" · "How did I do this last time?" · abandons if context-recovery requires reading docs |

### DEVELOPER-tier naive personas (4)

| Persona slug | Profile | Audit triggers | Confusion signals |
|---|---|---|---|
| `naive-junior-developer` | 3 months experience; knows JS/TS basics; does NOT know multi-tenant, RLS, audit events, RBAC nuance | Code examples · API docs · onboarding-for-devs · architecture diagrams | "What does tenant_id mean?" · "Why do I need RLS?" · gets lost when CSPS jargon is undefined |
| `naive-integration-focused-external-dev` | Wants to use the CSPS API to build their own thing; does NOT want to understand internals; will abandon if forced to learn CSPS-specific abstractions | API reference · webhook docs · auth/auth flow · OpenAPI specs | "I just want to POST data" · "Why do I need to know this?" · abandons when API docs assume internal-architecture context |
| `naive-time-pressed-mid-dev` | 2 hours to evaluate whether CSPS solves their problem; needs a "hello world" running in <30 min or moves on to a competitor | Getting-started guide · README · first-run experience · sample apps | "I can't get this to run" · "Where's the quickstart?" · abandons at >2 setup errors |
| `naive-security-conscious-dev` | Wants to see security boundaries before investing; needs auth/authz/data-isolation docs in <3 clicks | Security docs · auth flow · RLS documentation · audit-event explanations · data-residency claims | "Where is the security model documented?" · "How is data isolated?" · abandons if security claims aren't backed by specific mechanisms |

### PLAN-AUDIT naive personas (2)

| Persona slug | Profile | Audit triggers | Confusion signals |
|---|---|---|---|
| `naive-non-technical-stakeholder` | Reading a plan to understand if it solves a business problem; gets lost in technical detail | Plan documents · proto files · ratification artifacts | "What does this actually deliver?" · "How much will this cost / how long will it take?" · abandons at any unexplained acronym (RZF, CIP, ZF, OPIA, etc.) |
| `naive-future-maintainer-6-months-later` | Inherits the system in 6 months; needs to understand WHY decisions were made; rages when "obvious" decisions aren't documented | All architectural decisions · CORE-SEEDS · plan-parts · sealed protos | "Why was this decided?" · "Where's the rationale?" · abandons if rationale requires excavating multiple turns of opus-turn.md |

## 4 · The mechanism (composition with existing infra — NO parallel machinery)

```
INPUT (artifact: page/plan/journey/UI)
  ↓
THRESHOLD ROUTING (M6 active) classifies input → input_class includes new "naive_audit_request"
  ↓
selectPersonas(classification) (M4 Facet E) routes to BOTH expert personas + relevant naive personas
  ↓
NAIVE PERSONA SIMULATION (new — .claude/skills/naive-*/SKILL.md)
  Each persona has: profile · simulate(artifact) method · confusion_signals[] · success_criteria[]
  Returns: {findings: [confusion_points], abandonment_risk: low|med|high, blocking_jargon: [terms]}
  ↓
FINDINGS → PLATFORM-OBSERVATION pipeline (when L1-L5 lands S072)
  → OBSERVE → AGGREGATE → CLASSIFY (BLOCKING/ADVISORY/DEFERRABLE) → ROUTE → STAGE → RATIFY → IMPLEMENT → MEASURE-AGAIN
  ↓
AI-PROFILING (M5 OBSERVE+AGGREGATE active) — naive-persona findings are first-class signals
  D6 cleverness, D3 surface-completeness, D7 action-bias → naive personas EXPOSE these as UX failures
  ↓
ratified findings → fold into journey/plan/UI before ship
```

## 5 · How this completes the developer's + user journeys

Per Governor's directive ("let formalize that and complete the developer's and user journeys"), the naive personas are not just an audit add-on — they're the **finishing tool** for the journeys started in S070-S072:

### Developer's Journey (the 9-step INFRA-FLOW pillar 8 design)
Each of the 9 steps gets a **naive-junior-developer + naive-time-pressed-mid-dev + naive-security-conscious-dev** walkthrough. Findings shape:
- Which jargon needs glossary entries (vocabulary.md §Dev↔User extension)
- Which steps need a "before you start" / "what does X mean" sidebar
- Where the journey breaks for someone NOT in the CSPS-architect mindset

### User's Journey (Pillar 7 frictionless onboarding)
Each onboarding screen gets **naive-first-time-user + naive-anxious-evaluator + naive-task-focused-user** walkthrough. Findings shape:
- Primary action visibility (above fold for mobile-on-the-go)
- Trust signals placement (anxious-evaluator)
- Detour removal (task-focused-user rages at wizards)
- Context-recovery on return (return-user-2-weeks-later)

### Plans + protos
Before any Governor ratification gate fires, **naive-non-technical-stakeholder + naive-future-maintainer** walk the plan. Findings:
- Acronym density audit (RZF, CIP, ZF, OPIA, P-META-NNN, etc. — define-on-first-use)
- Rationale presence audit (WHY this design, not just WHAT)
- Business-impact statement (so non-technical stakeholders can buy into the plan)

## 6 · Build PE order (post-ratification, S072 work)

L1 (~1h) — Author 11 .claude/skills/naive-* SKILL.md files using existing persona-skill template (trigger_criteria + simulate method spec). PE rationale: foundational; everything depends on the persona registry existing.

L2 (~30min) — Extend `tools/scripts/threshold-router.mjs` selectPersonas() to route by content-type (journey/plan/UI) to naive personas in addition to expert. Wire `naive_audit_request` as input_class.

L3 (~1h) — First audit pass: invoke `naive-junior-developer` + `naive-first-time-user` + `naive-non-technical-stakeholder` against existing CSPS artifacts (vocabulary.md §Dev↔User Glossary · /platform/communication dashboard · CORE-SEEDS-PLAN-PARTS.md). Findings → vault-pending → review.

L4 (~30min) — Extend weekly-persona-trigger-audit.mjs to also count naive-persona invocations. PLATFORM-OBSERVATION L1-L5 absorption: naive findings are first-class data through the OBSERVE→...→IMPLEMENT pipeline.

L5 (variable) — Apply the first-audit-pass findings to journey-completion (Pillar 7 + Pillar 8).

Total ~3-4h spread across S072 alongside other doctrine work.

## 7 · Discipline + composition

- **No parallel machinery.** Every layer extends existing (Facet E persona registry, threshold INVOKE, weekly audit, PLATFORM-OBSERVATION, AI-PROFILING).
- **Sample sets are tunable** per P-META-028 cornerstone (5 user + 4 dev + 2 plan = 11 current — expandable).
- **Composes with vocabulary.md §Dev↔User Glossary** — naive-persona confusion signals feed glossary additions.
- **Composes with AI-PROFILING ADJUST stage** (when Q2 ratifies S072 P3) — naive-persona findings → D-default firings exposed → activation_language updates per tier.
- **Composes with CIP RIPPLE-QC stage** — every "PROPOSED-CHANGE" to a user-facing artifact routes through at least one naive persona as a ripple-direction.

## 8 · Status & gates

- Design status: **draft pending Governor ratification.**
- Queue: S072 absorption alongside CIP + ONE-SOURCE-OF + AI-PROFILING + PLATFORM-OBSERVATION + naive-personas.
- S072 impact: ZERO if not ratified this session; ~3-4h build if ratified.
- Vault entry: `vlt-S072-naive-personas-doctrine`.

## 9 · Cruel-critic self-check (applied to this doctrine)

- **Risk:** Adding 11 personas (sample) is governance-growing-faster-than-validation (balance-expert finding). **Mitigation:** advisory-first invocation; promote to mandatory only after L3 first audit pass produces actionable findings.
- **Risk:** Naive personas could LLM-hallucinate findings (they're personas not real users). **Mitigation:** L3 first audit-pass findings reviewed by Governor before any UI change; persona simulations are signal not authority.
- **Risk:** Persona-explosion (every new audience tier gets a persona). **Mitigation:** sample set fixed at 11 for v1; expansion requires Governor ratification + new vlt entry (controlled growth).
- **Risk:** "Audited by naive persona" becomes a satisfaction point (PSP — RZF-LATEST v1.1 §3.C). **Mitigation:** every Milestone Report that cites naive-persona audit must also cite measure-again evidence (CIE/PE) showing the finding was acted on.

— OPUS-14 (S072 · authored 2026-05-30 · ratification + S072 build queued)
