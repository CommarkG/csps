---
id: csps.pillar-0-governance.frontmatter-closed-enums
name: frontmatter-closed-enums
description: Canonical reference for all closed-enum frontmatter fields used across CSPS artifacts. Single point-of-truth for AI-pre-write consultation per B_STRUCTURAL_PREVENTION_DISCIPLINE K=2 promotion (S007 turn 5 — closed-enum drift fired K=2 across S006 lifecycle_state:draft + S007 maturity:active). Mirrors closed-enum constants in tools/validators/validate-frontmatter.mjs which remains canonical for runtime enforcement; this doc is the cognitive-layer pre-write reference.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: stable
core_spine: GVRN
core_spines: [GVRN, ARCH, VALD]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S007
links:
  - { rel: parent, href: ./README.md }
  - { rel: validator-source, href: ../../../tools/validators/validate-frontmatter.mjs }
  - { rel: principle, href: ../../../packages/principles/principles.yaml }
  - { rel: contract, href: ./behavioral-contracts.md }
  - { rel: triggered-by-K2-promotion, href: ./behavioral-contracts.md }
domain_path: platform
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# Frontmatter Closed Enums — Canonical Reference

> **Pre-write reference for AI authoring CSPS frontmatter.** Source of truth: [`tools/validators/validate-frontmatter.mjs`](../../../tools/validators/validate-frontmatter.mjs) `CLOSED_DIMENSIONS` + `LIFECYCLE_VALUES` + `LIFECYCLE_STATE_VALUES` constants. This doc mirrors those constants for cognitive-layer consultation BEFORE Write/Edit; the validator remains canonical for PR-blocking enforcement.

> **Engraved S007 turn 5** as Surface 1 of the K=2 closed-enum drift structural fix per B_STRUCTURAL_PREVENTION_DISCIPLINE Q-2 promotion. K=1 fired S006 §10.0j #1 (`lifecycle_state: draft` drift); K=2 fired S007 turn 2 (`maturity: active` drift). The structural fix is **pre-write visibility** — AI consults this doc OR the validator constants BEFORE authoring frontmatter.

## Top-level required fields

| Field | Required? | Type | Notes |
|---|---|---|---|
| `id` | yes | dotted-lowercase string | per ADR-0023 schema; pattern `csps.<area>.<slug>` |
| `name` | yes | kebab-case string | matches filename per B_NAMING_POLICY |
| `description` | yes | string | one-paragraph description |
| `version` | yes | semver-ish | track revisions |
| `owner` | yes | `group:<name>` | typically `group:finky` |
| `lifecycle` | yes | closed enum | see below |
| `lifecycle_state` | yes | closed enum | see below |

## Top-level closed enums

### `lifecycle:` — production-readiness tier

```yaml
lifecycle: experimental | beta | production | deprecated
```

| Value | Meaning |
|---|---|
| `experimental` | Skeleton / unproven / week-1-3 |
| `beta` | Functional but not GA-ready |
| `production` | GA-ready; stable interface |
| `deprecated` | Replaced; do not extend |

### `lifecycle_state:` — current state in lifecycle workflow

```yaml
lifecycle_state: active | pending-review | pending-protocol | promoted | resolved | deprecated | validated | closed
```

| Value | Meaning | Terminal? |
|---|---|---|
| `active` | In use; current state | no |
| `pending-review` | Awaiting review | no |
| `pending-protocol` | Awaiting protocol step | no |
| `promoted` | Lifted to next tier | no |
| `resolved` | Issue resolved; no further action | no |
| `deprecated` | Superseded; do not extend | no |
| `validated` | Frozen point-in-time record | **YES** |
| `closed` | Closed permanently | **YES** |

**Note:** `draft` is NOT in this enum (S006 §10.0j K=1 catch). Authors confused with maturity tag — `draft` lives there.

## Tag closed dimensions

Tags follow the pattern `<dimension>:<value>`. Each dimension has a closed enum:

### `domain:` — content domain

```yaml
- domain: billing | persona | bookings | auth | admin | ai | infra | shared | crisis | audit | governance | architecture | data | dx | ops | planning | ui | platform
```

### `type:` — artifact type

```yaml
- type: feature | ui | data-access | util | schema | doc | skill | agent | bundle | template | reference | tutorial | how-to | explanation
```

### `tier:` — customer/access tier

```yaml
- tier: free | pro | business | enterprise | internal
```

### `audience:` — target audience

```yaml
- audience: end-user | admin | developer | ai-agent
```

### `maturity:` — artifact maturity (Diataxis-adjacent)

```yaml
- maturity: draft | review | stable | frozen | deprecated
```

**Note:** `active` is NOT in this enum (S007 turn 2 K=2 catch). Authors confused with `lifecycle_state:active` — `active` lives at top-level lifecycle_state, NOT in maturity tag.

## `cdp_status:` — Core Dynamic Plan unified lifecycle state *(S018 CDP — new)*

**Optional field.** When present: replaces the scattered lifecycle state tracking (lifecycle_state + impl_status + enforcement_stage conceptually unified). Applied to CDP elements — major platform artifacts that participate in the full governance lifecycle.

```yaml
cdp_status: raw | pipeline-intake | pending-ratification | ratified | implementing | implemented | zf-achieved | measured | sealed
```

| Value | Meaning | ZF required? |
|---|---|---|
| `raw` | Unprocessed — just arrived as an INPUT | No |
| `pipeline-intake` | Threshold classified it, staged for review | No |
| `pending-ratification` | Governor review complete, decision pending | No |
| `ratified` | Governor ratified, canonical home assigned | No |
| `implementing` | Active work in progress | No |
| `implemented` | Work done, ZF validation pending | No |
| `zf-achieved` | **Last ZF run = ZERO BLOCKING FINDINGS (INST-VALD-001)** | ✅ Yes — last run at zero |
| `measured` | KPIs tracked, impact assessed | No |
| `sealed` | Closed permanently, evidence block present | ✅ Yes — evidence_block_ref required |

**The ZF precision (mandatory):** `zf-achieved` status REQUIRES that the last validator run produced "STATUS: ZF ACHIEVED ✅ — 0 blocking findings remain." No other output qualifies. This is not a declaration — it is a verified state.

---

## `enforcement_stage:` — enforcement lifecycle for governance artifacts *(S018 — new)*

**Optional field.** Applies to: validators, hooks, behavioral contracts, topic plans describing enforcement work. Tracks the progression of an enforcement surface from declaration to active production.

```yaml
enforcement_stage: stub | planned | week-4 | active
```

| Value | Meaning | Cost | Consumer |
|---|---|---|---|
| `stub` | Shell exists, exits 0 always, zero enforcement cost | None | verify-hooks-functional.sh |
| `planned` | Designed + documented, not yet built | None | (cognitive only) |
| `week-4` | Registered in audit-runner, ships in week-4 build batch | Low | build-order.md |
| `active` | Enforcing in production — exits 1 on violation | Full | pnpm verify + ZF |
| `human-judgment` | Explicitly non-mechanical (Tier 3) — AI self-assessment only; no validator possible | None (by design) | Never blocks — human review only |

**Key discipline (ratified S018):** Schema field ships WITH its consuming validator, not before.
**`human-judgment` discipline:** Every rule labeled `human-judgment` must have a SELF-ASSESSMENT QUESTION the AI asks before proceeding. It cannot be counted in ZF cycles. It is not "planned" — it is permanently non-mechanical by honest declaration. Better than pretending it's "planned" when no validator can ever be built. `enforcement_stage: active` requires an active consumer. `enforcement_stage: stub|planned|week-4` is valid without a consumer — it declares the intent.

**Consuming validator:** `validate-enforcement-stage-progression.mjs` (week-4) — checks that artifacts marked `enforcement_stage: active` have a corresponding passing validator in `pnpm verify`.

---

## `diataxis_type:` — Diátaxis documentation type *(S027 — mandatory for pillar-0-governance)*

**Mandatory for all `docs/plan/pillar-0-governance/*.md` files** (enforced by `validate-diataxis-type.mjs`). Based on the [Diátaxis framework](https://diataxis.fr/) — the 4-quadrant documentation taxonomy used by Canonical, Python, Cloudflare.

```yaml
diataxis_type: tutorial | how-to | reference | explanation
```

| Value | Orientation | Serves | Examples in CSPS |
|---|---|---|---|
| `tutorial` | Learning | Beginners following steps | (rare in governance docs) |
| `how-to` | Task | Practitioners achieving goals | adr-process, sandbox-ratification-policy, question-protocol, gradual-execution-protocol |
| `reference` | Information | Practitioners looking up facts | behavioral-contracts, frontmatter-closed-enums, platform-health-questions, vocabulary |
| `explanation` | Understanding | Anyone building mental models | concept-first-governance, cognitive-context-architecture, csps-layer-separation, reuse-first-principle |

**Key decision guide:**
- "I need to DO something" → `how-to`
- "I need to LOOK UP something" → `reference`
- "I need to UNDERSTAND something" → `explanation`
- "I need to LEARN from scratch" → `tutorial`

**Consuming validator:** `validate-diataxis-type.mjs` — BLOCKING if missing, ADVISORY if invalid value. PE=67 S027 mandate.

---

## Common drift patterns (K=2 catalog)

| Wrong | Right | Why drift |
|---|---|---|
| `lifecycle_state: draft` | `lifecycle_state: active` + `tags: [maturity:draft]` | Confused state with maturity (S006 §10.0j #1) |
| `maturity:active` (in tags) | `maturity:draft` (or stable / review / frozen / deprecated) | `active` is lifecycle_state value, not maturity (S007 turn 2) |
| `audience:end_user` | `audience:end-user` | underscore vs hyphen |
| `type:test` | `type:feature` (with test sub-folder convention) | `test` not in type enum |
| `domain:tooling` | `domain:dx` (developer-experience) | `tooling` not in domain enum |
| `tier:standard` | `tier:pro` (or business) | `standard` not in tier enum |
| `inherits_from: template` (as enum value) | `inherits_from: docs/plan/_handoff/VAULT/templates/gradual-build-plan.template.md` (resolved path) | `inherits_from` is FREE-FORM path, NOT a closed enum — SROF-013 Q2 |

## Free-form fields (not closed enums)

These fields appear in CSPS frontmatter but are **NOT** closed enums. Do not validate them against a fixed set of values.

| Field | Type | Example | Note |
|---|---|---|---|
| `inherits_from` | free-form resolved-path string | `docs/plan/_handoff/VAULT/templates/gradual-build-plan.template.md` | Resolved path to the template/parent artifact this artifact inherits from. Any valid file path is correct. No enum. (SROF-013 Q2, S040) |
| `description` | free-form string | any text | Human-readable description; no enum constraint |
| `ratified_by` | free-form string | `Governor S040` or `yariv` | No enum; records who ratified |
| `links` | free-form list | `[{rel: parent, href: ./README.md}]` | YAML list; rel values are informational not enum-constrained |

## Where these enums live (atomic single-source-of-truth)

| Surface | Path | Authority |
|---|---|---|
| **Validator (canonical)** | [`tools/validators/validate-frontmatter.mjs`](../../../tools/validators/validate-frontmatter.mjs) | Runtime PR-blocking enforcement; values may evolve, validator is source-of-truth |
| **Cognitive reference** | this file | AI pre-write consultation; mirrors validator |
| **Templates** | [tools/templates/*.template.md](../../../tools/templates) | Cite enum value in inline comments |
| **AGENTS.md** | [`AGENTS.md`](../../../AGENTS.md) | Cross-references this doc + B_STRUCTURAL_PREVENTION |
| **Memory** | `feedback_frontmatter_closed_enum_drift.md` | AI per-session memory layer |

## impl_status — implementation quality state machine (NEW S011 §24++++++)

Per S011 user directive: every implementation artifact declares its quality state.

| Value | Meaning | Next state |
|---|---|---|
| `swift-implemented` | Built rapidly; not yet audited | `audit-1-complete` |
| `audit-1-complete` | First audit PASS; no new EP patterns | `sealed-zf` or `architecture-pending` |
| `sealed-zf` | ZF cycle complete; RZF evidence present | `recurring-audit-pending` |
| `recurring-audit-pending` | Registered for weekly/monthly re-validation | `sealed-zf` (after clean re-audit) |
| `architecture-pending` | Needs deep arch review before sealing | `audit-1-complete` |
| `deprecated` | Superseded; terminal | — |


## stage: — simplified lifecycle state *(STATUS-CONSOLIDATION S049)*

**Replaces:** `lifecycle_state:` (2-session parallel transition; hard cutover S050)

```
stage: intake | planning | active | archived
```

| Value | Meaning |
|---|---|
| `intake` | Captured, not yet assessed |
| `planning` | Being designed / ratified |
| `active` | In use / enforcing |
| `archived` | Superseded or terminal |

**Transition:** During S049 both `stage:` and `lifecycle_state:` are valid. In S050, all artifacts backfill to `stage:` and `lifecycle_state:` is removed.

---

## quality_state: — artifact quality level *(STATUS-CONSOLIDATION S049)*

**Replaces:** `impl_status:` (2-session parallel transition; hard cutover S050)

```
quality_state: draft | validated | activated | certified
```

| Value | Meaning | Protection level |
|---|---|---|
| `draft` | Being designed — freely mutable | none |
| `validated` | Implemented + validators pass (`pnpm verify` exit_code=0) | none |
| `activated` | Live in production, measuring intent-vs-results correlation; requires `activation_exit` conditions defined at creation; changes require ratification | `protected` |
| `certified` | Intent and results proven to align; cannot be modified without Governor authorization | `sacred` |

**Implemented ≠ Sealed.** `validated` = done. `activated` = live + measuring. `certified` = proven + sealed.
An artifact must pass through `activated` before it can reach `certified`. Skipping `activated` is not permitted.

---

## How to add / amend an enum value

1. **Edit `validate-frontmatter.mjs`** `CLOSED_DIMENSIONS` / `LIFECYCLE_*` constants
2. **Edit this doc** to mirror the change
3. **Run `pnpm verify`** to confirm 0 errors with new enum
4. **Cross-link in commit message** to the rationale
5. **Atomic commit** — never split validator change from doc-mirror change

## Mechanical surfaces (K=2 closed-enum drift structural fix; engraved S007 turn 5)

| Surface | Artifact | Status |
|---|---|---|
| Schema | this file | active |
| Validator (atomic registration) | `frontmatter-closed-enum-drift-prevention` registered in [audit-runner.md](./audit-runner.md) Meta + Pipeline 1 governance; impl week-4 (existing `frontmatter_validate` already detects post-write; new audit angle is pre-write coverage) | registered atomic; impl deferred |
| Hook | [`.claude/hooks/pre-tool-use-frontmatter-enum-check.sh`](../../../.claude/hooks/pre-tool-use-frontmatter-enum-check.sh) | stub authored S007; week-4 active enforcement |
| Memory | `feedback_frontmatter_closed_enum_drift.md` + MEMORY.md index entry | active |
| Contract | [behavioral-contracts.md § B_STRUCTURAL_PREVENTION_DISCIPLINE — K=2 closed-enum drift subsection](./behavioral-contracts.md) + AGENTS.md hard NO sub-bullet update + ai-behavior-spine.md row update | active |

## K-promotion trail (provenance)

- **K=1 — S006 §10.0j enhancement-proposal #1** (commit [`1b779f6`](https://github.com/CommarkG/csps/commit/1b779f6) governance-foundation closure): `lifecycle_state: draft` authored on a topic-plan; validator caught at PR-time. Structural fix proposed: "Embed closed-enum reference inline in template-registry entries". K=1 deferred to "if recurs S007+ promote to engraving".
- **K=2 — S007 turn 2** (commit [`357478b`](https://github.com/CommarkG/csps/commit/357478b)): `maturity:active` authored on token-optimization topic-plan; validator caught at post-author verify. Same anti-pattern (AI guessing closed-enum value); different field. **K=2 → PROMOTE TO ENGRAVING per B_STRUCTURAL_PREVENTION_DISCIPLINE.**
- **K=2 engraving — S007 turn 5** (this commit): structural fix executed. 5/5 atomic per FSE. Going forward: AI consults this doc OR validator constants BEFORE authoring frontmatter; validator catches as backstop; hook (week-4) blocks pre-write.

---

**Frontmatter-closed-enums signature:** `S007-AI-frontmatter-closed-enums-2026-05-04T19:15:00Z`

---

## S022 VLT-Ratified Fields *(Governor ratified S021-05-09)*

These fields are OPTIONAL — when present, must be in closed enum. When absent, no error.
All are validated by `validate-frontmatter.mjs` (updated S022).

### `domain_path:` — ontological position in 3-tier domain taxonomy *(VLT-S022-DOMAIN-PATH)*

```yaml
domain_path: "business"              # Tier 1 only
domain_path: "personal.health"       # Tier 1.Tier 2
domain_path: "business.finance.tax"  # Tier 1.Tier 2.Tier 3
```

**Tier 1 closed enum (ratified):**
```
business | personal | social | knowledge | platform | crosscut
```

| Value | Meaning |
|---|---|
| `business` | Professional and organizational activities |
| `personal` | Individual life management and growth |
| `social` | Community, relationships, connection |
| `knowledge` | Learning, research, and accumulated wisdom |
| `platform` | CSPS infrastructure and governance (internal) |
| `crosscut` | Cross-domain concerns (accountability, goals, decisions, reflection) |

**Tier 2/3:** Defined in `docs/plan/pillar-0-governance/domain-taxonomy.md` (to be created in Schema Phase A).

---

### `wisdom_class:` — how this artifact contributes to the WisdomVault *(VLT-S022-WISDOM-CLASS)*

```yaml
wisdom_class: insight | reference | workflow | tool | benchmark | story | null
```

| Value | Meaning |
|---|---|
| `insight` | A discovered pattern or principle |
| `reference` | Template, standard, or benchmark |
| `workflow` | A process or procedure |
| `tool` | A usable instrument or helper |
| `benchmark` | A measurement standard or comparison point |
| `story` | Anonymized case study or experience pattern |
| `null` | Default — not wisdom-vault-relevant |

---

### `persona_target:` — who this artifact primarily serves *(VLT-S022-PERSONA-TARGET)*

**4 of 7 values ratified. 3 deferred pending real user data.**

```yaml
# RATIFIED (use now):
persona_target: solo_user | business_admin | business_member | developer

# DEFERRED (wait for real user signal before using):
# persona_target: family_admin | family_member | community_leader
```

---

### `developer_surface:` — how developers access this capability *(S021 completion circle)*

```yaml
developer_surface: api-route | lib-export | mcp-query | sdk | documented | none
```

---

### `completion_circle:` — progress through the full closed circle *(S021)*

```yaml
completion_circle: schema | schema+logic | schema+logic+dev | schema+logic+dev+user | full
```

Full closed circle = schema + logic + developer_surface + user_value + wisdom_harvested.

---

### `builder_surface:` — who consumes this element *(S021 three-axis orchestration)*

```yaml
builder_surface: builder | user | both | platform-only
```

---

### `schema_code:` — machine-routing code for orchestrator *(S021 naming convention)*

```yaml
schema_code: "ARCH-SCHM-S022"   # spine-type-session
schema_code: "GVRN-PLAN-S021"
schema_code: "EXT-LOVB-S021"    # external input from Lovable
```

Format: `[SPINE]-[TYPE]-S[NNN]`
Spine codes: ARCH | GVRN | AI | VALD | OPER | PLAT | EXT
Type codes: SCHM | PLAN | VAL | HOOK | DOC | CONF | SIM

---

*S022 amendment | Governor ratified VLTs: VLT-S022-DOMAIN-PATH, VLT-S022-WISDOM-CLASS, VLT-S022-PERSONA-TARGET*

---

## S023 INTENT CRYSTALLIZATION + ROUTING + UX FIELDS

### `intent_crystallized:` — was intent validated before work began?

```yaml
intent_crystallized: true | false | partial
```

| Value | Meaning |
|---|---|
| `true` | Open question asked → AI clarification → template matched → Governor confirmed |
| `partial` | Clarification done but not via full wizard flow |
| `false` | Work began without intent crystallization (requires justification) |

**Mandatory for:** any plan with implementation scope. Default: `false` until crystallized.

---

### `threshold_route:` — which verified wizard template was matched

```yaml
threshold_route: developer.new-entity | developer.new-page | developer.api-integration |
                 business.billing | business.permissions | ux.onboarding-flow |
                 platform.governance | personal.tracking | personal.finance |
                 knowledge.documentation | none
```

**Mandatory for:** all topic-plans and implementation plans. `none` = explicitly exempt with reason.

---

### `jtbd_outcome:` — the job-to-be-done outcome statement

```yaml
jtbd_outcome: "string — what success looks like in the user's world (not the system's)"
```

Examples:
- `"A developer can set up App #2 in under 30 minutes without asking for help"`
- `"A business user can invite a team member without leaving the app"`
- `"Any user can erase their account and PII in one click"`

**Mandatory for:** UX/UI artifacts, wizard templates, protocol designs.

---

### `ux_principle:` — primary UX design principle governing this artifact

```yaml
ux_principle: jtbd-outcome-first | progressive-disclosure | mobile-first |
              one-decision-per-screen | example-driven | wizard-of-oz-validated | none
```

| Value | Meaning |
|---|---|
| `jtbd-outcome-first` | Screen communicates outcome, not action |
| `progressive-disclosure` | Shows only what's needed — reveals complexity on demand |
| `mobile-first` | Designed for smallest screen, scaled up |
| `one-decision-per-screen` | Each screen resolves exactly one ambiguity |
| `example-driven` | Users recognize their situation from examples, not labels |
| `wizard-of-oz-validated` | Manually simulated 3+ times before building |

---

---

## S025 I→VI DISCIPLINE FIELDS (P-META-022 + P-META-023)

### `failure_signal:` — what would tell us this initiative failed (P-META-023 M3)

TYPE: string
REQUIRED: Yes, for topic-plans with session: S023+ and execution_mode: deep_quality
RULE: Must be human-authored or human-confirmed. AI never drafts this.
      Describes the concrete observable state that means failure — even if the feature is "built."
EMPTY: Omit field or set to "EXEMPTED: [reason]"
EXAMPLE:
  `failure_signal: "Foundation code was changed to support this app (platform not foundry-ready)."`
  `failure_signal: "User can access another tenant's transaction data."`

---

### `question_register:` — list of questions asked during intake + their answers (P-META-023 context preservation)

TYPE: list of objects
REQUIRED: Advisory for S025+ plans. Phase 2 (S026): BLOCKING for S025+ deep_quality plans.
SCHEMA: Each entry has: id / type / question / asked_at / answer / confirmed
TYPES: C (crystallization) | A (alignment) | G (gap) | R (ripple) | B (boundary) | Z (completion) | P (priority) | X (context-preservation)
MINIMUM: 3 entries (at least Q1c/goal + M1/done + M3/failure questions answered)
EXAMPLE:
  ```yaml
  question_register:
    - id: Q001
      type: C
      question: "What specific problem are we solving?"
      asked_at: "S024 turn 3"
      answer: "Building a Budget Planner to prove Gate 3 Foundry Ready"
      confirmed: true
    - id: Q002
      type: Z
      question: "What validator output proves this is done THIS session?"
      asked_at: "S024 turn 4"
      answer: "pnpm verify exit_code=0 + budget-planner slice passing"
      confirmed: true
  ```
WHY: The question_register IS the context preservation mechanism. It survives session close,
context compression, and model changes. Future sessions recover context from the questions+answers
without needing the Governor to re-explain. North Star function: can any question in this register
be answered by the current implementation?

---

### `goal_statement:` — human-authored goal (P-META-022 Q2c)

TYPE: string
REQUIRED: Yes, for topic-plans with session: S023+ and execution_mode: deep_quality
RULE: Must be human-authored or human-confirmed restatement. NEVER AI-drafted.
      Governor's exact words preferred. AI restatement confirmed by human is acceptable.
      If AI generates the goal_statement and human says "yes" — that is NOT crystallization.
EMPTY: Omit field (triggers advisory via validate-intent-crystallized.mjs) or "EXEMPTED: [reason]"
EXAMPLE:
  `goal_statement: "Ship a Budget Planner that helps users see where their money goes"`

---

### `done_criteria:` — measurable completion signals (P-META-022 Q3c / ZF-4)

TYPE: list of strings
REQUIRED: Yes, same conditions as goal_statement
RULE: Each item must be observable or measurable. "Success" is not a criterion.
MINIMUM: 1 item. Items must be checkable by a person who wasn't in the session.
EXAMPLE:
  ```yaml
  done_criteria:
    - "pnpm verify exit_code=0 with budget-planner slice validators passing"
    - "User can log a transaction and see updated balance without page refresh"
    - "Tenant A cannot see Tenant B's transactions (adversarial test passes)"
  ```

---

### `failure_signal:` — what failure looks like even if the feature appears built (P-META-023 M3)

TYPE: string
REQUIRED: Advisory for S025+ plans. NEVER AI-authored.
RULE: Describes the observable state that means failure — even if pnpm verify passes.
EXAMPLE:
  `failure_signal: "Foundation code was modified to support this app (platform not foundry-ready)."`

---

### `threshold_intake_level:` — intake depth routing for this plan

```yaml
threshold_intake_level: light | medium | deep
```

| Value | When | Who participates | Research |
|---|---|---|---|
| `light` | Known domain, continuation, bug fix, Governor provides all 3 items upfront | Human + AI | None |
| `medium` | New domain, new initiative, unfamiliar integration | Human + AI + targeted search | 2-4 sources |
| `deep` | Architectural decision, new platform primitive, constitutional change | Human + AI + Opus + external | Full synthesis |

**Mandatory for:** all topic-plans from S025+. Default: `medium` if unspecified.

---

### `threshold_participants:` — who participated in the intake process

```yaml
threshold_participants: [human, ai]
threshold_participants: [human, ai, opus]
threshold_participants: [human, ai, opus, external-gpt]
```

| Participant | Meaning |
|---|---|
| `human` | Governor/developer provided freestyle input |
| `ai` | Sonnet conducted 9-step coaching protocol |
| `opus` | Opus Core Council reviewed (Level 3 deep) |
| `external-<name>` | External AI advisor consulted (e.g. external-gpt, external-gemini) |
| `persona-<id>` | Internal persona consulted (future) |

---

### `depth_tier:` — Core Spine layer classification for non-plan artifacts (P-ARCH-028)

```yaml
depth_tier: L1 | L2 | L3
```

| Value | Meaning | Examples |
|---|---|---|
| `L1` | Sealed foundation — universal core, never contradicted by deeper elements | Foundation entities (User/Tenant), sealed principles, core contracts |
| `L2` | Domain layer — spine-specific domain doctrine | Pillar governance docs, platform-level validators, behavioral contracts |
| `L3` | Instance layer — specific implementations, applications, sessions | Topic plans, app-specific code, session artifacts |

**Rule:** L3 instances reference L2 domain files. L2 domain files reference L1 sealed anchors. Nothing at L3 contradicts L1. Enforced by validate-corespine-depth-markers.mjs (for depth marker files) and validate-spine-hierarchy.mjs (S027, planned).

**Mandatory for:** governance artifacts in `docs/plan/pillar-0-governance/` from S025+. Advisory for other locations.

---

### `scope_level:` — Unified Scope Model (USM) — artifact universality scope *(S028 — pending ADR-0027 ratification)*

> **Status:** ADVISORY until ADR-0027 consolidates 4 fragmented level systems.
> **Maps from:** DNA Element 13 (LAYER: CSP_CORE / SOLUTION_<X> / MIXED) → scope_level
> **Diagnostic:** S028 Zero-Laptop incident — B_ZERO_LAPTOP_DEPENDENCY is S0 (constitutional);
> the training default that overrode it was S2 (app-specific). No field existed to surface this conflict.

```yaml
scope_level: S0 | S1 | S2 | S3 | S4 | S5
```

| Value | Name | Applies to | Examples | Amendment |
|---|---|---|---|---|
| `S0` | Constitutional | Entire platform, all apps, all users, forever | B_ZERO_LAPTOP, tenant isolation, audit trail, sealed L1 spine principles | ADR + Opus + Governor |
| `S1` | Platform-wide | All apps built on CSPS, not all contexts | libs/policies/, libs/integrations/, shared auth pattern, API conventions | PCR + Governor |
| `S2` | App-scope | One specific SaaS app | apps/budget-planner/, budget categories, app-specific schema | Within-app PCR |
| `S3` | Tenant-scope | One customer organization within an app | Tenant config, billing tier, custom domain, RLS scope | Admin API call |
| `S4` | User-scope | One person within a tenant | Notification prefs, display settings, GDPR personal data | User-facing API |
| `S5` | Session-scope | One request/interaction | JWT claims, rate limits, real-time context | Next request |

**Violation rule:** A lower-scope implementation CANNOT override a higher-scope principle.
- S2 dev workflow (pnpm dev) cannot override S0 principle (B_ZERO_LAPTOP_DEPENDENCY) ← S028 incident
- S3 tenant config cannot override S1 platform security policy

**Replaces (pending ADR-0027):**
- DNA Element 13 LAYER field (CSP_CORE = S0/S1; SOLUTION_<X> = S2; MIXED = spans)
- Platform Layer Boundaries L0/L1/L2 (L0 = S0-S1; L1 = S2; L2 = S3)
- Spine Outward L1-L5 layers in csps-core-manifest.md

**Validator (to build, PE=78):** `validate-scope-level.mjs` — checks file placement matches declared scope_level; BLOCKING for S2 artifacts in libs/ (S1 territory).

---

### `pe_context:` — which PE variant governs this item (S025 moat-first PE)

```yaml
pe_context: platform | customer | user
```

| Value | Applies to | What it adjusts |
|---|---|---|
| `platform` | Governance, validators, hooks, contracts, principles, platform services | B weight highest (0.35) — blast across all 30+ future apps |
| `customer` | App template, libs/, developer docs, API design, developer onboarding | I weight higher (0.20) — customer churn if blocked |
| `user` | App pages, Threshold Wizard variants, UX flows, error messages | I weight highest (0.25) — users abandon immediately |

**Why this matters:** A platform governance item and a user-facing UX item have different urgency profiles. The pe_context adjusts weights so items are correctly prioritized within their context.

---

### `moat_score:` — competitive moat contribution (S025 moat-first PE)

```yaml
moat_score: 0-10
```

| Value | Name | Meaning |
|---|---|---|
| 10 | constitutional_moat | Seals a platform-wide guarantee no competitor has |
| 8 | compounding_moat | Each improvement makes the advantage harder to close |
| 6 | structural_moat | Built into DNA — not a feature, a property |
| 4 | differentiation_moat | Meaningfully better than alternatives |
| 2 | marginal_moat | Slight advantage, quickly replicable |
| 0 | no_moat | No competitive advantage contribution |

**PE impact:** `final_PE = base_PE + (moat_score * 0.5)` — maximum bonus: +5 points.
**When to set:** Any item that contributes to platform competitive advantage. Omit (defaults to 0) for routine maintenance.

---

### `template_grade:` — ratification grade for templates (RATIFIED Opus Turn 9)

> **STATUS: RATIFIED** — Opus Turn 9 S025 approved this grade system.
> See: `tools/council/opus-turn.md` Turn 9 Topic 1.

```yaml
template_grade: A | B | C | D
```

| Grade | Layer | `template_status` target | Ratification required | When used |
|---|---|---|---|---|
| `A` | L1 | `sealed` | Full council: research_ref + external AI + Opus L2 + Governor + ZF Level 3 | Templates governing ALL platform apps (gradual-build-plan, governed-artifact-frontmatter, closing-summary) |
| `B` | L2 | `standard` | Targeted research + Governor + ZF Level 2 | Templates reused across 2+ apps (topic-plan, adr.template) |
| `C` | L3 | `provisional` | Governor confirms + ZF Level 1 | App-specific templates, edge functions (app UI components, customer-specific) |
| `D` | L3 | `experimental` | None (K=1 first use; K=2 promotes to C) | Novel patterns under evaluation |

**Grade A requirement:** `research_ref:` field REQUIRED in frontmatter — points to external consultation document. Validator: `validate-template-grade.mjs` (to build S026).

**Opus Turn 9 retroactive grades (full list to be confirmed Turn 10):**
- `gradual-build-plan.template.md` → **A** (governs all platform plans)
- `governed-artifact-frontmatter.template.md` → **A** (governs all artifacts)
- `closing-summary-template.md` → **A** (governs all session closes)
- `HANDOFF template` → **A**
- `adr.template.md` → **B**
- App-specific UI templates → **C**

**Corresponds to Core Spine doctrine:** deeper = more thorough ratification. L1 = full council. L3 = Governor only.

---

### `template_status:` — lifecycle status for templates (EXPANDED Opus Turn 9)

> Replaces previous `novel-pending-pattern-evaluation | stable` two-value enum.

```yaml
template_status: experimental | draft | provisional | standard | sealed
```

| Value | Grade | Meaning |
|---|---|---|
| `experimental` | D | K=1, no review — novel pattern under first evaluation |
| `draft` | any | Active development, any grade |
| `provisional` | C | Governor confirmed + ZF Level 1 — app-specific use |
| `standard` | B | Research + Governor + ZF Level 2 — platform-wide use |
| `sealed` | A | Full council + ZF Level 3 + FSE 5/5 — constitutional template |

**Migration:** `novel-pending-pattern-evaluation` → `experimental`; `stable` → `standard` or `sealed` (by grade assignment, Turn 10).

**Validator:** `validate-template-grade.mjs` (to build S026) — checks Grade A templates have `research_ref:` field.

---

### `target_participant:` — who this element serves (DNA Element 17 — PACP)

```yaml
target_participant: governor.primary | developer.platform | developer.app | developer.api |
                    user.solo | user.team.member | user.team.admin | user.enterprise | user.trial |
                    ai.sonnet | ai.opus | ai.haiku | ai.agent | ai.external |
                    mixed | n/a
```

| Value | Category | Who |
|---|---|---|
| `governor.primary` | Human Governor | Platform architect (Yariv) — maximum context, full protocol |
| `developer.platform` | Human Developer | Building the CSPS platform itself |
| `developer.app` | Human Developer | Building apps ON CSPS using template + libs |
| `developer.api` | Human Developer | Consuming CSPS app APIs externally |
| `user.solo` | Human End User | Individual app user (personal domain) |
| `user.team.member` | Human End User | Team member — role-scoped permissions |
| `user.team.admin` | Human End User | Team admin — tenant configuration |
| `user.enterprise` | Human End User | Enterprise user with compliance requirements |
| `user.trial` | Human End User | Trial/guest user — simplified onboarding |
| `ai.sonnet` | Platform AI | Sonnet builder — implementation AI |
| `ai.opus` | Platform AI | Opus advisor — constitutional scope |
| `ai.haiku` | Platform AI | Haiku subagent — ephemeral task execution |
| `ai.agent` | Platform AI | Mastra or third-party agents |
| `ai.external` | External AI | GPT/Gemini/Claude AI advisors — VAULT_DEFER always |
| `mixed` | Multiple | Element serves multiple participant types |
| `n/a` | Infrastructure | No direct participant interaction (build tools, migrations) |

**Canonical reference:** [participant-protocol.md](./participant-protocol.md)
**Validator:** `validate-participant-declared.mjs` (advisory Phase 1; BLOCKING S026 for new elements)
**When to declare:** Every new governance artifact, API endpoint, UI page, validator, plan.

---

### `needs_opus_review:` — flag for Opus consultation (Opus Turn 9 ratified)

```yaml
needs_opus_review: true | false
opus_review_type: architectural | express | trend
```

**Set `needs_opus_review: true` when any of:**
- New P-META-* or P-ARCH-* principle authored
- Template Grade A created or modified
- PE > 90 AND item NOT in opus-advisory-arc-S023.md assignments
- Virtual Opus Audit (5 questions) returns any "I don't know"
- Implementation contradicts or extends Opus-ratified element
- depth_chosen: 5 (constitutional scope)

**`opus_review_type` values:**
| Value | Opus involvement | Format |
|---|---|---|
| `architectural` | Full Opus Turn (L2/L3) | Standard opus-turn.md format |
| `express` | 5-line EXPRESS block | `## EXPRESS — [topic]` in opus-turn.md |
| `trend` | Multi-session drift check | Opus reads last 3 HANDOFFs for drift patterns |

**Validator:** `validate-opus-review-flagging.mjs` (to build S026) — checks HANDOFFs with new principles, Grade A templates, or depth-5 work have `needs_opus_review: true`.

**In HANDOFF frontmatter:** Only add when true. Omit (or set false) for routine sessions.

---

*S025 amendment | Governor directive: "PE must be connected to everything — complete holistic view."*
*P-META-023 operational fields — threshold-intake-protocol.md is the canonical SSoT.*
*Opus Turn 9: template_grade + template_status + needs_opus_review + opus_review_type ratified.*

---

## `stage:` — Unified lifecycle state (STATUS-CONSOLIDATION Phase 1 — S047)

**Optional.** Transition period: both `lifecycle_state` AND `stage` accepted until S050.

```yaml
stage: draft | planning | ratified | implementing | swift-implemented | mini-council-reviewed | full-council-reviewed | sealed | deprecated | archived
```

## `quality_state:` — Implementation quality state (STATUS-CONSOLIDATION Phase 1 — S047)

**Optional.** Replaces `impl_status`. Same meaning, clearer name.

```yaml
quality_state: not-built | swift-implemented | audit-complete | sealed-zf | recurring-audit
```

**S050 cutover:** both fields replace lifecycle_state + cdp_status + impl_status. validate-frontmatter.mjs accepts both during transition.

*S047 STATUS-CONSOLIDATION Phase 1.*
