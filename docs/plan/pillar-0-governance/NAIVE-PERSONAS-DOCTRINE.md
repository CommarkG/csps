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
vault_pending: vlt-S073-naive-personas-doctrine
retrieve_when: "Governor ratifies → Sonnet builds the persona engine (3 core archetypes + 6 parameter axes + tools/scripts/persona-engine.mjs) + threshold wiring + first audit pass. **Disposition (per Governor S072 Turn 4 completion-discipline call): VAULT for S073 absorption window. NOT in S072 active queue.** S072 stays focused on CIP build + boundary-prompt validator + queued doctrine ratifications."
research_tagged: true
research_vault_ref: "docs/plan/_handoff/VAULT/research/S072-naive-personas-research.md"
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

## 3 · v2 architecture — Core-Spine application (Governor S072 Turn 4 refinement)

**v1 problem (cruel-critic to self):** 11 hardcoded personas violates Core-Spine precedence + balance-expert (governance growing faster than validation) + Cooper §6.4 *Persona Pruning* (static libraries scale poorly).

**v2 architecture (research-grounded — see `research_vault_ref`):**
```
L1 — CORE ARCHETYPES (sealed · 3 · expansion requires Governor ratify)
   naive-end-user-core | naive-developer-core | naive-plan-audit-core

L2 — PARAMETER AXES (sealed · 6 · map directly to AI-PROFILING D1-D13 registry)
   jargon_tolerance   (low/med/high)        ← maps D6 cleverness, D3 surface-completeness
   attention_span     (2min / 10min / 30min) ← maps D7 action-bias
   domain_familiarity (none / basic / deep)  ← maps D4 pattern-match
   frustration_threshold (low / med / high)  ← maps D10 cooperative-disagreement-aversion
   mental_model_template (transactional / exploratory / evaluative) ← maps D5 single-pass
   trust_baseline     (low / med / high)     ← maps D2 authority-pleasing

L3 — TUNED INSTANCES (tunable · generated on demand · vaulted if useful · K≥3 invocations)
   naive-anxious-evaluator  = end-user-core + (jargon=low, attention=2min, trust=low,  frustration=low)
   naive-junior-developer   = developer-core + (jargon=med, attention=10min, domain=basic, trust=med)
   naive-time-pressed-mid-dev = developer-core + (jargon=high, attention=10min, frustration=high)
   … expandable per evidence-driven promotion
```

**The engine** — `tools/scripts/persona-engine.mjs` (queued L1 build):
- Input: `{archetype: L1, axes: L2 tuning}` + artifact reference
- Process: load archetype profile + apply axes overrides → produce simulation prompt → run LLM in persona mode → return `{findings[], abandonment_risk, blocking_jargon[], confusion_points[]}`
- Output: same shape as existing 8 expert personas — plugs into Facet E `selectPersonas()` with no parallel machinery.

**Core-Spine precedence applied:** L1 archetypes are GVRN-sealed; L2 axes are VALD-sealed; L3 instances are ARCH-tunable; engine implementation is OPER. Adheres to GVRN>VALD>ARCH>AI>OPER precedence (P-ARCH-028).

## 3.5 · Existing CSPS abilities supporting this (no parallel machinery)

| Existing ability | How naive personas use it |
|---|---|
| Facet E `selectPersonas()` (M4) | Engine-output personas plug in as additional pool members |
| Threshold M6 (active) + 14-class router | New 15th class `naive_audit_request` (expansion per cornerstone) routes to engine |
| AI-PROFILING D1-D13 registry (M5 partial) | **Direct mapping** — D-defaults ARE the L2 parameter axes; no new axis taxonomy invented |
| `communication-schema.yaml audience_hierarchy[]` (6 tiers) | Each tier seeds an archetype tuning preset (Governor / core-dev / external-dev / account-owner-admin / team-leader / end-user) |
| `vocabulary.md §Dev↔User Glossary` (10 entries) | Jargon-tolerance axis consults glossary for evidence |
| `ai-behavior-signals.jsonl` (M5 stream) | Engine emits invocation events; aggregator detects which archetypes/axes fire productively → L3 promotion candidates |
| PLATFORM-OBSERVATION pipeline (L1-L5 queued) | Naive findings flow through OBSERVE→AGGREGATE→...→MEASURE-AGAIN like all other audit signals |
| CIP RIPPLE-QC (S072 P1, building) | Every PROPOSED-CHANGE to a user-facing artifact gets naive persona as one ripple-direction |
| Weekly-persona-trigger-audit (M4 active) | Extended to count engine invocations + axes-tuning patterns |

**Net:** 9 existing abilities support the doctrine. ZERO new infrastructure beyond the engine itself.

## 4 · Situations of activation (the mapping)

The threshold (M6) routes to the engine when ANY of these fire:
1. **Artifact has `audience_tier:`** including a user-tier value (end-user / account-owner-admin / team-leader) — engine seeds archetype from tier.
2. **Ratification gate fires** for a user-facing artifact (CIP RIPPLE-QC stage extension) — engine runs as one ripple direction.
3. **Weekly-audit detects high-jargon-density** artifact (jargon count > sample threshold per vocabulary.md) — engine flags + runs.
4. **Governor explicitly invokes** via the /platform/personas page (manual audit replay).
5. **Doctrine/plan-part lacks rationale-presence** (per `naive-future-maintainer` mapping) — engine flags during plan-coverage validator pass.

## 4.5 · The validate-improve-expand loop

```
ITER 1 (post-ratify): 3 cores + engine + 6 axes built (advisory). Opt-in invocation on Pillar 7 (user journey) + Pillar 8 (developer journey) only.
   ↓
ITER 2: signal accumulates in ai-behavior-signals.jsonl — which archetypes fire most, which axes-tunings produce actionable findings.
   ↓
ITER 3 (K≥3 evidence): recurring tuning patterns get vaulted as named L3 instances (e.g., 'anxious-evaluator' becomes a registered profile after firing K≥3× productively).
   ↓
ITER 4 (CIE/PE measure-again): tunings that produce findings → fix → measure-drop in next cycle get PROMOTED from advisory to required-invocation for matching artifacts.
   ↓
ITER N: expansion is evidence-driven — new tunings emerge from real signal, not from theoretical taxonomy growth.
```

Failure mode prevented: PERSONA-EXPLOSION-WITHOUT-EVIDENCE (Cooper §6.4 cited in research vault).

## 3 · DEPRECATED v1 enumeration (kept below for traceability — superseded by §3 v2 architecture)

> **Note:** the 11-persona hardcoded list below is the v1 design. v2 (§3 above) generates these as L3 instances via the engine. The list below is preserved for traceability of which tunings the v1 thinking surfaced; v2 implementation produces them on demand.

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

## 6 · Build PE order (v2 architecture · POST-RATIFY · DEFERRED to S073 per Governor S072 Turn 4 completion-discipline call)

L1 (~1h) — Author 3 .claude/skills/naive-{end-user,developer,plan-audit}-core/SKILL.md files (CORE archetypes only) + tools/scripts/persona-engine.mjs (takes archetype + axes → produces persona profile + simulation prompt).

L2 (~30min) — Extend `tools/scripts/threshold-router.mjs` selectPersonas() to invoke the engine when input_class = `naive_audit_request`. Wire as 15th class (expansion per cornerstone).

L3 (~1h) — First audit pass: engine invoked on 3 existing CSPS artifacts (vocabulary.md §Dev↔User Glossary · /platform/communication dashboard · CORE-SEEDS-PLAN-PARTS.md). Findings → vault-pending → review.

L4 (~30min) — Extend weekly-persona-trigger-audit.mjs to also count engine invocations + axes-tuning patterns. PLATFORM-OBSERVATION L1-L5 absorption: naive findings flow through OBSERVE→...→MEASURE-AGAIN like all other audit signals.

L5 (variable) — Apply first-audit-pass findings to journey-completion (Pillar 7 frictionless onboarding + Pillar 8 developer's journey).

L6 (~1h) — `/platform/personas` page (see §10 below).

Total ~3.5-4.5h. **Disposition: S073 absorption window** (not S072) per Governor completion-discipline directive — S072 stays focused on CIP + boundary-prompt validator + queued doctrine ratifications.

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

## 10 · Front-end spec — `/platform/personas` page

Per the Vercel-mirror rule (M3 scope: ratifiable + user-facing artifact). The persona registry IS ratifiable governance state — therefore mirrored.

### Layout (3-panel)

**Panel A — L1 ARCHETYPES (sealed)**
- 3 cards: naive-end-user-core / naive-developer-core / naive-plan-audit-core
- Each card shows: name · profile summary · invocation count · last-fired timestamp · linked-artifacts audited
- Governor-only action: propose-new-archetype (governed-path → PR → ratify)

**Panel B — L2 AXES (sealed)**
- 6 axis sliders shown read-only (visible state, not editable on page): jargon_tolerance / attention_span / domain_familiarity / frustration_threshold / mental_model_template / trust_baseline
- Each axis links to its AI-PROFILING D-default mapping (so the source-of-truth is visible)
- Governor-only action: propose-new-axis (high bar — adds dimension to the engine's parameter space)

**Panel C — L3 INSTANCES (tunable)**
- Table of vaulted tuned instances: name · archetype · axis-tuning summary · K-count · findings-actionable rate · status (advisory|promoted)
- Per-instance action: replay-audit (re-runs the engine simulation on the bound artifact + emits findings to PLATFORM-OBSERVATION OBSERVE stream)
- Governor action: promote-instance (advisory → required-for-matching-artifacts)
- Engine action: propose-new-instance (when K≥3 evidence of recurring axes-tuning, surfaces to Governor for review)

### Cross-links

- /platform/communication — naive personas surface confusion signals on the comms-schema audience tiers
- /platform/ai-profile (S072 P3 queued) — D-default firings per tier ARE the persona axis tunings; bidirectional cross-link
- /platform/canonical-register (S072 P2 queued) — persona engine is itself a canonical (CSR row)
- /platform/observation (S072 P5 queued) — naive findings render as one observation class

### Drift metrics (visible)

- archetype-tuning-drift: how often each archetype gets axes-tuned vs runs as-default
- finding-actionable-rate: per-archetype, per-instance — drives promotion decisions
- coverage-gap: which artifacts have audience_tier but no naive-audit history

### SSR + governed write-back

- Read-only on Vercel (per S070 M3 pattern)
- Edits travel ratification pipeline (no live writes)
- Governed-path download → PR → Governor ratify → re-render

## 11 · Research attestation (NEW — Governor S072 Turn 4 mandatory)

`research_tagged: true` + `research_vault_ref: docs/plan/_handoff/VAULT/research/S072-naive-personas-research.md`

The vaulted research file contains: 5 patterns synthesized (Cooper personas · PersonaGPT · Wizard-of-Oz · multi-agent debate · agent role-play) + critical research finding (static libraries scale poorly per Cooper §6.4 → parameter-driven engine is the consensus modern pattern) + 5 sources cited.

**Mandatory engraving queued** (vlt-S073-research-attestation-discipline): every doctrine in `docs/plan/pillar-0-governance/*.md` must declare `research_tagged: <bool>` + `research_vault_ref: <path>|null` + (if null) `research_basis: native-design`. Validator `validate-doctrine-research-attestation.mjs` enforces.

— OPUS-14 (S072 Turn 4 · authored 2026-05-30 · v2 architecture · core-spine applied · research vaulted · S073 disposition · vault-for-S073 per completion-discipline)
