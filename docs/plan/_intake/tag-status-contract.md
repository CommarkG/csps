---
id: csps.intake.tag-status-contract
name: external-input-tag-status-contract
description: The mechanical contract for tags AND dynamic statuses on every external-input extraction. Closed-enum tags from frontmatter-standard.md, propagation rules (input → sub-extractions → leaf-level notes), state machines for both lifecycle_state (P-META-004 stewardship) and pipeline_state (P-META-005 learning-loop), transition rules, and the audits that catch silent bypasses. Pre-runtime, the manual-protocol.md enforces; post-runtime, validators + Postgres triggers + audits enforce mechanically.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - observability
  - security
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: protocol, href: ./manual-protocol.md }
  - { rel: contexts, href: ./contexts/README.md }
  - { rel: frontmatter-standard, href: ../pillar-1-architecture-and-stack/frontmatter-standard.md }
  - { rel: stewardship, href: ../pillar-0-governance/stewardship-protocol.md }
  - { rel: learning-loop, href: ../pillar-0-governance/learning-loop.md }
domain_path: platform
scope_level: S1
---

# Tag + Status Contract — mechanical

> **Tags must be closed-enum + audited. Statuses must transition through a state machine with required `state_transitioned_at` per move. No silent bypasses.**

## What this contract holds

The mechanical rules for tags and dynamic statuses on every external-input extraction:
- **Tags** — closed enums (no synonyms allowed); inheritance from input → sub-extractions; per-context leaf inheritance; conflict resolution.
- **Statuses** — two distinct state machines (`lifecycle_state` per P-META-004, `pipeline_state` per P-META-005); allowed transitions; transition-audit trail; SLA-per-state.
- **Audits** — what fails the build / what blocks the PR / what blocks the closing summary.

Pre-runtime: the AI enforces this manually per `manual-protocol.md`. Post-runtime: validators + Postgres triggers + audit-runner enforce mechanically.

## Tags (the static metadata)

### The closed-enum dimensions (per `frontmatter-standard.md`)

| Dimension | Allowed values | Sourced from |
|---|---|---|
| `app:` | One of registered app slugs | `apps/*/app.json` |
| `domain:` | billing, persona, bookings, auth, admin, ai, infra, shared, crisis, audit, governance, architecture, data, dx, ops, planning | `tools/catalog/dimensions.ts` |
| `type:` | feature, ui, data-access, util, schema, doc, skill, agent, bundle, template, reference, tutorial, how-to, explanation | same |
| `tier:` | free, pro, business, enterprise, internal | same |
| `audience:` | end-user, admin, developer, ai-agent | same |
| `maturity:` | draft, review, stable, frozen, deprecated | same |
| `lifecycle:` (Backstage product-stage) | experimental, beta, production, deprecated | same |
| `lifecycle_state:` (CSPS stewardship-state) | active, pending-review, pending-protocol, promoted, resolved, deprecated | `principles.yaml#P-META-004.config.lifecycle_states` |
| `pipeline_state:` (CSPS learning-loop) | observed, triaged, routed, fixing, validated, closed | `principles.yaml#P-META-005.config.pipeline_states` |
| `confidence_band:` (extraction confidence band) | auto-accept, human-review, discard | `principles.yaml#P-META-005.config.ai_confidence_thresholds` |
| `risk:` | low, medium, high | `_intake/source-types.md` |
| `trust_tier:` | tenant_authored, tenant_invited_party, tenant_url_paste, public_web_fetch, external_ai_export | `_intake/external-inputs-plan.md` |
| `source_type:` | (28 values) | `_intake/source-types.md` enum |

### Tag-propagation rules (input → extractions)

When an input arrives:

1. **Input-level tags** are determined by the AI during step 3 of `manual-protocol.md`. They include:
   - `source_type` (deterministic from file extension / URL / paste shape)
   - `risk` + `trust_tier` (deterministic from source-type rules)
   - `audience` (always at minimum `audience:developer` + `audience:ai-agent` for content reaching CSPS)
   - Any explicit user tags ("this is about billing" → `domain:billing`)

2. **Inheritable tags** auto-propagate to every sub-extraction:
   - `source_type` (always inherited; immutable)
   - `risk` (always inherited; immutable)
   - `trust_tier` (always inherited; immutable)
   - `audience` (inherited; sub-extractions may ADD audiences but not REMOVE)
   - `parent_input_id` (always set)

3. **Per-leaf inherited tags** auto-propagate from the leaf folder's domain context:
   - When a section is routed to `governance/reuse-first-principle/`, it inherits `domain:governance` automatically
   - When routed to `data-schema/audit-triggers/`, inherits `domain:data` + `domain:audit`
   - The leaf folder's pillar README declares its inheritable tags; the per-leaf README adds leaf-specific tags

4. **Conflict resolution** (when explicit and inherited tags conflict):
   - Explicit beats inherited (per Bit's variants pattern + per `frontmatter-standard.md` "explicit overrides win")
   - But inherited tags can NEVER be silently dropped — if the AI explicitly removes an inherited tag, it must record `removed_inherited_tag: <tag>` with reason in the extraction note's metadata

5. **Closed-enum violation**:
   - Tag using a non-enum value → audit `tag-closed-enum-violation` (PR-blocking, error severity)
   - Pre-runtime: AGENTS.md hard NO + manual-protocol step 5.5 verify

### Tag-related audits (planned, week 4)

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `tag-closed-enum-violation` | PR | error | Every tag value resolves to the dimension's closed enum |
| `tag-propagation-coverage` | PR | warn | Every sub-extraction's inheritable tags match parent input's |
| `tag-context-mismatch` | PR | warn | Extraction routed to `governance/X/` carries `domain:governance` (or has explicit override with reason) |
| `tag-removed-without-reason` | PR | error | If inherited tag was dropped, `removed_inherited_tag` field present with reason |
| `tag-canonical-phrasing-drift` | PR | error | The 6 operating principles (in 4 places) byte-match — prevents principle-dilution |

## Statuses (the dynamic states)

Two **distinct, orthogonal** state machines apply to every extraction. They serve different purposes and must NEVER be conflated.

### State Machine A — `lifecycle_state` (P-META-004 Stewardship)

**Purpose:** stewardship state of the artifact itself (does it have an active recurring trigger?).

**States + allowed transitions:**

```
pending-protocol  →  active           (protocol now exists for this artifact class)
                  →  deprecated       (rejected; this kind of input should not be saved)

pending-review    →  active           (human reviewer accepted)
                  →  promoted         (promoted to canonical artifact, e.g., into a leaf doc)
                  →  deprecated       (rejected)

active            →  pending-review   (re-review triggered)
                  →  promoted
                  →  resolved         (the work it represents is closed)
                  →  deprecated

promoted          →  active           (demoted)
                  →  deprecated

resolved          →  deprecated       (eventually retired)

deprecated        →  (terminal)
```

**SLA per state** (from `principles.yaml#P-META-004.config`):
- `pending-review`: 14 days SLA → audit `stale-pending-review` flags
- `pending-protocol`: 30 days SLA → audit `stale-pending-protocol` flags (severity error — implies missing process)
- `active`: 90 days inactivity → audit `active-stale` flags
- `_legacy/` items: 90 days from `next_review_at`

**Required field on every transition:**
- `state_transitioned_at` (ISO timestamp, auto-updated)
- `next_review_at` (required when state ≠ `active`)

### State Machine B — `pipeline_state` (P-META-005 Learning Loop)

**Purpose:** position in the closed-loop improvement pipeline (has the input been processed, routed, fixed, validated, closed?).

**States + allowed transitions:**

```
observed   →  triaged    (AI/human triaged the input)
           →  closed     (auto-discard, below confidence)

triaged    →  routed     (assigned to a domain-owner / leaf doc / ADR)
           →  closed     (duplicate / dismissed with reason)

routed     →  fixing     (work began on the downstream artifact)
           →  closed     (won't-fix with stated reason)

fixing     →  validated  (downstream artifact updated + verified)
           →  closed     (abandoned; rare, requires reason)

validated  →  closed     (recurrence-check passed)
           →  fixing     (re-opened; validation failed)

closed     →  observed   (re-opened by recurrence-check trigger only)
```

**SLA per state** (from `principles.yaml#P-META-005.config`):
- `observed`: P0 1h, P1 4h, P2 24h, P3 72h SLA → audit `unresolved-observation-stale`
- `triaged`: 48h to route SLA
- `fixing`: P1 30d, P2 90d, P3 180d → audit `fix-without-validation`
- `validated`: 30d (critical) or 90d (default) recurrence-check → audit `validation-without-recurrence-check`

**Required field on every transition:**
- `state_transitioned_at` (ISO timestamp, auto-updated)
- For `closed`: `closed_reason` (one of: fixed | duplicate | wont-fix | auto-discard | abandoned)
- For `routed`: `routed_to` (slug of downstream artifact)
- For `validated`: `recurrence_check_at` (when next recurrence check fires)

### Why two state machines, not one

These are orthogonal. An extraction can simultaneously be:
- `lifecycle_state: active` (load-bearing, will keep being referenced) AND
- `pipeline_state: closed` (the work it triggered is done)

OR:
- `lifecycle_state: pending-review` (awaiting human re-look) AND
- `pipeline_state: routed` (already handed off to a downstream owner who is working on it)

Conflating them would be a category error. They live in separate frontmatter fields, get separate audits, and have separate SLAs.

### Status-related audits (planned, week 4)

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `silent-state-bypass` | PR | error | Any state field changed without `state_transitioned_at` updated → drift signal; immediate fail |
| `state-transition-illegal` | PR | error | Transition not in the allowed-transitions table fails (e.g., `closed → triaged` without going through `observed` first) |
| `state-without-required-field` | PR | error | `closed` without `closed_reason`; `routed` without `routed_to`; `validated` without `recurrence_check_at` |
| `pending-too-long` | PR + nightly | warn → error | Items past their state's SLA escalate severity over time (warn at 1× SLA, error at 2× SLA, critical at 3× SLA) |
| `recurrence-check-due` | weekly | warn | `validated` items whose `recurrence_check_at` has arrived without action |
| `meta-state-machine-drift` | PR | error | The state machine declared in `principles.yaml` matches the implementation in code/markdown |

## The transition-audit trail (mechanical record)

Every state transition adds a row to `extractions-ledger.md`. The chain of rows for one EXT-ID is the audit trail. Pre-runtime: append-only markdown. Post-runtime: append-only `public.learning_loop_item_state_transition` table.

Example chain for `EXT-20260502-001-A`:

| Row | EXT-ID | timestamp | lifecycle_state | pipeline_state | reason / next_action |
|---|---|---|---|---|---|
| 1 | EXT-20260502-001-A | 2026-05-02T11:30Z | pending-review | observed | initial receipt |
| 2 | EXT-20260502-001-A | 2026-05-02T11:35Z | pending-review | triaged | extracted; routed_to=stripe-clerk-wiring |
| 3 | EXT-20260502-001-A | 2026-05-02T11:40Z | pending-review | routed | assigned to billing domain |
| 4 | EXT-20260503T09:00Z | active | fixing | reviewed by user; promoted to active |
| 5 | EXT-20260510T14:00Z | active | validated | leaf doc updated; PR merged |
| 6 | EXT-20260808T14:00Z | active | closed | recurrence-check passed; closed_reason=fixed |

This chain is the proof that the extraction wasn't silently dropped. Every state change has its row. The `silent-state-bypass` audit verifies row presence.

## Tag inheritance × status transition — combined

When a sub-extraction undergoes a state transition, tag rules apply too:

1. **Inheritable tags survive** transitions (a closed item still carries its `source_type`, `risk`, `trust_tier`).
2. **`maturity:` tag advances** with state:
   - `pipeline_state: observed` → `maturity: draft`
   - `pipeline_state: triaged` → `maturity: review`
   - `pipeline_state: validated` → `maturity: stable`
   - `pipeline_state: closed` (terminal) → `maturity: stable` or `maturity: frozen` based on closed_reason
3. **`lifecycle:` tag advances** independently with `lifecycle_state` (orthogonal axes):
   - `lifecycle_state: active` doesn't change `lifecycle:`
   - `lifecycle_state: deprecated` triggers `lifecycle: deprecated`
4. **The conjunction is auditable**: a row with `pipeline_state: closed` AND `maturity: draft` is a contradiction → audit `tag-status-mismatch` (warn).

## P-META-006 Zero-Findings Discipline integration (added S002 turn 10)

Per `pillar-0-governance/zero-findings-discipline.md`, two additional fields are CONDITIONALLY required on every extraction note's frontmatter:

| Field | When required | Format |
|---|---|---|
| `evidence_block_ref:` | `lifecycle_state ∈ {validated, closed}` | path to RZF evidence-block file |
| `cec_walk_trail_ref:` | when artifact is a NEW principle / leaf / ADR / behavioral contract | path to CEC walk-trail file |

The `rzf-coverage` audit (PR-blocking, error severity) fails if `evidence_block_ref` is missing on terminal-state artifacts. The `cec-walk-trail-completeness` audit (PR-blocking, warn severity) fails if `cec_walk_trail_ref` is missing on ratification artifacts.

**Anti-bypass:** the AGENTS.md hard NO bans declaring DONE/COMPLETE/RATIFIED/VALIDATED/CLOSED without the evidence block. Pre-runtime, AI must include the evidence block in the closing summary or in the artifact frontmatter directly (the file path can be a placeholder until runtime ships).

## `descriptors[]` open folksonomy lane (added S003 §3.5.a)

Complementing the closed-enum tag dimensions above, the `descriptors[]` field carries open free-form kebab-case strings (per `frontmatter-standard.md` §descriptors). Inheritance rules:

- **Soft inheritance** — sub-extractions may freely add or remove descriptors (no `removed_inherited_descriptor` requirement; the hard contract belongs to closed-enum tags only)
- **Promotion path** — descriptors with ≥5 occurrences across catalog within 90 days surface as candidates for closed-dimension promotion (per quarterly review)
- **Audit `descriptor-shadow-tag`** (PR-blocking, warn) — flags descriptors that conflict with or duplicate closed-enum values

The descriptors lane is the calibrated answer to "what about emergent vocabulary that hasn't earned a PR yet?" — it goes here without bypassing the closed-enum discipline of `tags[]`.

## Explicit transition validators (added S003 §3.5.c)

Beyond `state-without-required-field` (already audited above), the following transition-validator audits enforce per-direction integrity:

| Slug | Cadence | Severity | What it checks |
|---|---|---|---|
| `transition-validator-pipeline-routed-without-routed-to` | PR | error | `pipeline_state: routed` row WITHOUT `routed_to` field is rejected |
| `transition-validator-pipeline-validated-without-recurrence-check-at` | PR | error | `pipeline_state: validated` row WITHOUT `recurrence_check_at` is rejected |
| `transition-validator-pipeline-closed-without-closed-reason` | PR | error | `pipeline_state: closed` row WITHOUT `closed_reason ∈ {fixed, duplicate, wont-fix, auto-discard, abandoned}` is rejected |
| `transition-validator-lifecycle-pending-protocol-without-protocol-spec` | PR | warn | `lifecycle_state: pending-protocol` row WITHOUT a referenced protocol-design doc surfaces for review |
| `transition-validator-lifecycle-promoted-without-target-leaf` | PR | error | `lifecycle_state: promoted` row WITHOUT `promoted_to_leaf` field (the canonical-artifact destination) is rejected |
| `transition-validator-lifecycle-deprecated-without-superseded-by` | PR | warn | `lifecycle_state: deprecated` row should declare `superseded_by` (warn-only because some deprecations are pure-retirement with no successor) |
| `transition-validator-rzf-on-closed` | PR | error | `pipeline_state: closed` row WITHOUT `evidence_block_ref` (per P-META-006) is rejected |
| `transition-validator-cec-on-promoted` | PR | warn | `lifecycle_state: promoted` row WITHOUT `cec_walk_trail_ref` is rejected if the promotion target is principle/leaf/ADR/contract |
| `transition-validator-backward-without-reason` | PR | error | Any backward transition (e.g., `validated → fixing`) WITHOUT `backward_transition_reason` is rejected |
| `transition-validator-illegal-jump` | PR | error | A skip transition not in the allowed-transitions table is rejected (e.g., `observed → validated` without going through `triaged → routed → fixing`) |

These validators **complement** `state-without-required-field` (which is the catch-all field-presence audit) by adding **per-transition-type semantic checks** the catch-all cannot enforce.

Pre-runtime: AI invokes these mentally per transition; documents in extractions-ledger row. Post-runtime: validators fire automatically in the `learning_loop_item_state_transition` insert path.

## How AGENTS.md hard NOs cover this pre-runtime

Three NOs combine to make this mechanical even before the runtime ships:

1. **No artifact without `lifecycle_state`** (P-META-004) — caught at file save.
2. **No upload without manual-protocol** (P-META-005) — caught at user paste / upload.
3. **No closing without surfacing every EXT-ID** — caught at closing summary; user sees what's missing.

Plus the AI's compliance with this contract is itself the mechanical layer until the validators ship. Saved as `feedback_intake_discipline.md` memory if violated repeatedly (the user's pattern: corrections become memory entries; this protocol's non-compliance triggers same).
