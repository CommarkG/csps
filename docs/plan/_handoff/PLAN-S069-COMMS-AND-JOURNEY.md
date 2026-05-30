---
id: csps.handoff.PLAN-S069-COMMS-AND-JOURNEY
name: PLAN-S069-COMMS-AND-JOURNEY
description: >
  Consolidated S069 plan (Governor-ratified). Holds the ratified designs of S069:
  the Communication Schema (situations x handling + AI→Human audience hierarchy),
  the system-wide Journey Doctrine, the milestone-run execution tier, PREVENTION→threshold,
  and the Change-Impact Pipeline (CIP). This is the single saved plan, ZF-iterated twice.
  Build mode: milestone-run. Communication is treated as the platform's most crucial core
  element — word choice / intent / nuance determine intent↔outcome fidelity vs drift.
type: governance
diataxis_type: reference
protection_level: protected
status: ratified
impl_status: planned
core_spine: GVRN
core_spines: [GVRN, AI, OPER, VALD]
schema_anchor: handoff_files
version: "1.0"
session: S069
owner: group:finky
authored_by: OPUS-13
lifecycle: production
lifecycle_state: active
ns_quality: [core-first, synergetic, core-maximal]
ns_path: "this → GVRN spine → North Star (communication-as-core)"
context_question: "Before any S069 build: is it one of the ratified designs here, and does it pass STAGE→RIPPLE-QC→NET-IMPACT→TERMINAL (CIP) so it helps the whole, not one part?"
context_quote: "The quality of communication — word choice, intent, nuance — determines whether pipelines deliver the intent or drift. — Governor S069"
inherits_from: "communication-protocol-shared.md (RULE 0-15) + B_ZCA + B_BOUNDARY_ALIGNMENT_PROTOCOL + B_MUTUAL_UNDERSTANDING_VALIDATION + B_CONTEXTUAL_LOCALITY + ai-behavior-spine (D1-D13) + INHERITANCE-MODEL + MASTER-RE-GATE-PLAN-S068"
links:
  - { rel: comms-protocol, href: ../../../tools/council/communication-protocol-shared.md }
  - { rel: ai-behavior-spine, href: ../pillar-0-governance/ai-behavior-spine.md }
  - { rel: master-plan, href: MASTER-RE-GATE-PLAN-S068.md }
  - { rel: opus-directives, href: ../../../tools/council/opus-turn.md }
---

# PLAN-S069 — Communication (Core) + Journey Doctrine

> **Governor-ratified S069.** Communication is the platform's most crucial core element: it is the layer where intent becomes outcome or becomes drift. The primary communicator is an AI whose training defaults distort communication — so the Communication Schema must wire to the AI-behavior spine. This plan is the single saved, twice-ZF-iterated record of S069's ratified designs.

## RATIFIED DESIGNS (S069)

| # | Design | Status | Home |
|---|---|---|---|
| 1 | **Communication Schema** (situations × handling + audience hierarchy) | ratified → build | pillar-0-governance/communication-spine/ |
| 2 | **Journey Doctrine** (system-wide; 9 sections + 4 comms demos) | ratified → build | pillar-0-governance/JOURNEY-DOCTRINE.md |
| 3 | **milestone-run** execution tier (Opus front-loads; Sonnet runs long; audit+report at milestones) | ratified | proto gate_tier |
| 4 | **PREVENTION → threshold** (prevention insights routed to the S067 prevention-class register) | ratified | extends validate-prevention-class-required |
| 5 | **Change-Impact Pipeline (CIP)** (STAGE→RIPPLE-QC→NET-IMPACT→THRESHOLD→TERMINAL) | ratified → deferred behind PART 2 | change-impact-staging.yaml |

## THE COMMUNICATION SCHEMA — situation taxonomy

Each situation maps to a handling spec: `{parties, interaction_pattern, context_depth, format_template, ack_loop, tone, terminal_condition, defaults_countered[], contracts_applied[]}`.

| Situation | Interaction | Key handling | Defaults countered |
|---|---|---|---|
| AI→AI council | turn-taking | full context+reasoning · file-ACK · colleague tone · CHECKPOINT terminal | D2, D10 |
| **AI→Human (audience hierarchy — see below)** | req/resp | tier-specific | D2, D3, D6 |
| Human→AI directive | req/resp | threshold-classify + CAQ detect · intent-crystallize | D7 |
| AI→External agent | req/resp | ZCA + RETURN-ONLY contract | D1, D3 |
| Tab/Session handoff | async | Zone A/B + MUV + M-43 · alignment-confirm | D5, D13 |
| System→User (app UX) | varied | journey framing · progressive disclosure · voice profile | — |
| Validator/Hook→AI | event | fix-in-the-message · advisory vs block | D11 |
| Step→Step (journey) | sequence | just-in-time context · visible progress | D7 |

## AI→HUMAN AUDIENCE HIERARCHY (Governor S069 expansion)

A hierarchy — each tier inherits "be clear, ZCA, no-jargon-beyond-tier" from the tier below it in technical depth, and adds its own decision rights. Mirrors the multi-tenant model (Tenant → admin → team-leader → user).

| Tier | Role / authority | Tech depth | Decision rights | Tone | Jargon policy | Defaults to counter |
|---|---|---|---|---|---|---|
| **Governor** (Yariv) | supreme ratifier of the platform | full | ratifies everything | direct colleague, push-back | platform-internal OK | D2 (authority-pleasing), D3/D6 (verbosity) |
| **Core developer** [ours / internal] | builds the platform itself | full technical | implements ratified specs | precise, file:line | full platform jargon | D5 (single-pass), D11 (wrong-layer) |
| **External developer** | builds apps ON the platform | technical, not platform-internal | configures/extends within contracts | clear, contract-level | API/extension terms only — HIDE internals | D3 (leaking internals as "complete") |
| **External account owner / admin** | owns a tenant; users, billing, security | low technical | tenant config, user mgmt, billing | outcome + security focused, business language | no code; admin-action terms | D6 (cleverness over clarity) |
| **Team leader** | manages a team within a tenant | low–medium | team/role mgmt, delegation | delegation + progress focused | role/workflow terms | D3 (over-detail) |
| **End-point user** [under team leader, or sole user] | uses the app to do a job | none assumed | their own task/data | plain, encouraging, forgiving | ZERO jargon; in-context help | D7 (assume they want options not the task done) |

**Hierarchy law:** the AI must KNOW its audience tier before composing (the threshold classifies it), and the handling is EXPLICIT per tier (config-hierarchy: never assume a lower tier inherits a higher tier's jargon tolerance — silent over-jargon is the drift). This governs BOTH governance-comms AND the 30 products' System→User comms (end-user tier).

## RESEARCH — advanced-systems patterns adopted
typed message contracts (gRPC/protobuf) → per-situation format templates · delivery guarantees (ACK/NACK) → ack-loop (MUV) · SRE severity/audience routing → criticality-at-ingress + audience tiers · interaction patterns (pub/sub / req-resp / streaming) → interaction_pattern field · RACI + escalation ladders + register-matching → who-needs-which + tone per tier · conversation state machines → RULE 0 Turn Token. **CSPS-unique 7th layer: default-counter wiring** (each situation/tier declares the AI defaults it must suppress + activation language).

## DASHBOARD (full editor — "the works")
`/platform/communication` renders the schema and is FULLY editable + human-ratifiable, edits write back to canonical files (core-connected):
- edit **definitions** (each situation/tier handling spec)
- edit **order** + **hierarchies** (reorder situations; manage the audience hierarchy tree)
- **upload / download** (import/export the schema as YAML)
- **see what's built** (live state: which situations/contracts are active vs draft)
- **see templates** (the per-situation format templates)

## BUILD SEQUENCE (milestone-run)
M1 core home + `communication-schema.yaml` (situations + audience hierarchy) + consolidate scattered B_* comms contracts under it + coverage validator (status: draft until ratify).
M2 AI-behavior wiring (each situation/tier → ai-behavior-spine defaults + activation language).
M3 playground dashboard `/platform/communication` (full editor above) → deploy.
M4 Journey Doctrine engrave + dev-journey Vercel page (editable) + rebuild steps per doctrine.
Each milestone: Milestone Audit + ZF + Milestone Report with PREVENTION insights (named class + evidence).

## ZF ITERATION 1 (gaps)
- Found: AI→Human was a single row — INSUFFICIENT; the Governor's 6-tier audience hierarchy added (Governor / core-dev / external-dev / account-owner-admin / team-leader / end-user), each with explicit handling (no inherited jargon assumption).
- Found: dashboard was "render + edit" — INSUFFICIENT vs "the works"; added order/hierarchy editing + upload/download + see-built + templates.
- Found: the schema must govern PRODUCT comms too (System→User = end-user tier), not just governance comms — added the cross-link.
- Found: PART 2 ratification still pending; CIP correctly deferred behind it; this plan does not unblock PART 2 (separate gate).

## ZF ITERATION 2 (re-examine iteration-1 areas + 0 new)
- Re-examined the audience hierarchy: confirmed 6 tiers map to the multi-tenant model (Tenant→admin→team-leader→user) + 2 dev tiers (ours/external) + Governor; the "hierarchy law" (explicit per-tier, threshold classifies audience, config-hierarchy no-silent-inherit) closes the over-jargon drift.
- Re-examined the dashboard editor scope: definition/order/hierarchies/upload/download/see-built/templates all enumerated; write-back-to-canonical keeps single-source (no parallel copy).
- Re-examined the design index (5 ratified): all extend existing infra (communication-protocol-shared, B_* contracts, ai-behavior-spine, threshold, prevention-class register) — 0 net-new parallel machinery; milestone-run is the build mode.
- 0 new findings. **Status: ZF ACHIEVED (twice-iterated).**

---

# ADDENDUM (Governor-ratified S069) — Cornerstone + 6 Facets + Journey Architecture + Ratification Pipeline

> All numbers below are **samples/tunable, not caps** (per the cornerstone). Definitions are written to allow expansion + scale.

## CORNERSTONE PRINCIPLE (proposed P-META — to register)
**"Context-Refined Communication is the Primary Prevention Tool."** However deep an insight, if communicated rigidly or without context, the intent never delivers the exact result aimed for. Every instruction/number/rule/definition is wrapped in interpretable context; samples are marked as samples; thresholds marked tunable; definitions written to allow expansion, never silent caps. Sits above the comms-schema (the *why*) and IS a prevention class. Cross-referenced FROM comms-schema + prevention-class register (bidirectional).

## 6 FACETS (applications of the cornerstone)
- **A. Rigidity review** — a rigidity CHECK (not a wholly new persona — consolidated into existing personas) + thin `validate-context-wrapped-numbers` (advisory-first; context-allowlist so it isn't itself rigid). Flags numbers/rules not wrapped/sample-marked.
- **B. Vercel mirror** — plan rule: every **ratifiable / user-facing** element (scoped — NOT every internal file, to avoid mirror-spam) has a playground mirror. Wired into element-creation gate + ratification INSPECT step.
- **C. Dev↔User vocabulary** — shared glossary EXTENDS `vocabulary.md` (one source; dev-term ↔ user-term ↔ canonical meaning). L1 journey-core references it.
- **D. Tier scale-language** — tier/permission defs written to allow expansion; sample counts marked sample; no hard caps. Enforced by Facet A.
- **E. Persona evolvement** — existing personas gain review points (rigidity, scale, vocabulary, context-wrapping) + a **trigger criterion** wired to the threshold INVOKE path (tight criteria + fast-path cheap inputs, per bottleneck) + a weekly audit "did criteria fire when they should?" Self-evolve loop deferred to a later band (per balance).
- **F. CIE + PE triggers** — CIE = continuous measurement at each milestone/journey-step; PE = priority/sequence at each plan-fork; both added to the recurring weekly audit + milestone-run reporting.

## JOURNEY ARCHITECTURE (ratified)
Journey = **L1 shared-core** (Journey Doctrine + universal skeleton + the comms-schema tier model — one source) → **L2 branches** (developer / user — add-only deltas; identified so far, expandable) → **L3 tier-instances** (the comms-schema tiers — current set, a sample of the model). Inheritance law: branches ADD, never CONTRADICT L1. Guardrail law: a step must match the participant's permission tier (no orphan steps). Build order (PE): L1 core → end-user branch (highest reach) → developer branch → tiers.

## RATIFICATION PIPELINE (ratified — consolidated, reused for every artifact)
`INSPECT (dashboard) → RIPPLE-QC (CIP: net-positive vs prior plans) → RATIFY (status draft→ratified via governed-path commit, SACRED token if sacred) → PROPAGATE (activate dependents) → TERMINAL (ratified | rejected | superseded — no perpetual-draft)`.

**INSPECT step includes (S071 M3 Facet B wire):**
- If artifact is ratifiable + user-facing (per `vercel-mirror-rule.md`): verify `/platform/<slug>` mirror exists and renders correctly before proceeding.
- If no mirror is required (internal infra per vercel-mirror-rule.md §2): skip dashboard check, proceed.
- Format: `INSPECT — /platform/<slug> renders correctly → proceed to RIPPLE-QC`

## PERSONA ITERATION — to real zero findings

### Cycle 1 (findings → fixes)
- **cruel-critic:** building 6 facets at once during the slowdown = governance faster than validation. → FIX: sequence + advisory-first + prove each before the next. Rigidity validator could itself be rigid → context-allowlist + advisory.
- **consolidation-expert:** a new "rigidity-critic" persona would duplicate cruel-critic / internal-deep-review. → FIX: rigidity is a CHECK folded into existing personas + a thin validator, not a new persona. Vocabulary EXTENDS vocabulary.md.
- **balance-expert:** complexity spike. → FIX: defer the persona self-evolve loop to a later band; build principle + rigidity-check + vocabulary first.
- **ux-expert:** "mirror every element" → mirror-spam. → FIX: scope to ratifiable/user-facing elements.
- **bottleneck-expert:** persona-auto-invoke on broad criteria = cost explosion. → FIX: tight criteria + threshold fast-path for cheap inputs.
- **synergy-master:** ensure the cornerstone is referenced bidirectionally (comms-schema + prevention-register). → FIX: added to the principle spec.
- **scale + rigidity (dogfood):** plan had bare sample numbers. → FIX: all counts marked sample/tunable; defs allow expansion.

### Cycle 2 (re-examine Cycle-1 areas — 0 new)
- Re-examined cruel-critic fix: facets now sequenced + advisory-first; rigidity validator advisory + allowlisted. ✓
- Re-examined consolidation fix: rigidity = check-in-existing-personas + thin validator (no new persona); vocabulary extends vocabulary.md (one source). ✓
- Re-examined balance fix: self-evolve loop deferred; build order = principle → rigidity-check → vocabulary first. ✓
- Re-examined ux fix: Vercel-mirror scoped to ratifiable/user-facing (no spam). ✓
- Re-examined bottleneck fix: persona criteria tight + fast-path cheap inputs. ✓
- Re-examined synergy fix: bidirectional cross-ref present. ✓
- Re-examined scale/rigidity fix: all numbers marked sample/tunable; expansion-allowing defs. ✓
- **0 new findings. Status: ZF ACHIEVED (persona-iterated to real zero per persona).**

