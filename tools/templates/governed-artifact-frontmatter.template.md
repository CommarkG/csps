---
id: csps.tools.templates.governed-artifact-frontmatter
name: governed-artifact-frontmatter-template
description: Canonical frontmatter template for any new governed artifact authored in CSPS (.md primarily; pillar leaves / vault files / topic-plans / element-reviews / canonical leaves / audit registry entries). Pre-includes all required frontmatter fields per ADR-0023 + 4 depth fields per depth-discipline.md (S009 L1.1) + AAP fields if Class A skill + context-loss prevention checklist + closed-enum compliance per frontmatter-closed-enums.md. TBD-S<NNN> placeholders allowed pre-stabilization per EXT-20260505-004-B Step 1; validator forces backfill within 5 sessions. Composes with B_TEMPLATE_FIRST_CREATION (P-META-015) — every governed artifact MUST be authored from a registered template.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: meta-template
template_status: novel-pending-pattern-evaluation
core_spine: ARCH
core_spines: [ARCH, GVRN, AI, VALD]
schema_anchor: tools_templates_meta
template_id: governed-artifact-frontmatter
template_version: 1.0
applicability_trigger: |
  Authoring ANY new governed artifact in CSPS — pillar-0-governance leaf,
  pillar-1-6 leaf, _handoff/VAULT/* file, topic-plan instance, element-review,
  audit-runner.md or audit-hub.md row, NEW canonical leaf. SKILL.md uses
  separate skill.template.md (also extends this base via composition).
validators_atomic:
  - depth_marker_creation_gate
  - frontmatter_validate
  - frontmatter-closed-enum-drift-prevention
  - corespine-layer-compliance
  - nothing-stands-alone-audit
  - placeholder-staleness-detection
escape_hatch: |
  Continuous-drift-log entries follow append-only format (NOT this template).
  ADR files use MADR template per ADR-0023 (composes with this base via
  shared closed-enums but adds MADR-specific sections).
tags:
  - domain:governance
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
session: S009
file_depth_markers:
  l1_lines: "1-80"
  l2_lines: "81-180"
  l3_lines: "181-end"
  read_protocol: "L1 = required-fields scaffold + 5-step creation flow. L2 = per-field detail + closed-enums cross-ref. L3 = AAP extension + composition + references."
links:
  - { rel: parent, href: ./ }
  - { rel: depth-discipline, href: ../../docs/plan/pillar-0-governance/depth-discipline.md }
  - { rel: closed-enums, href: ../../docs/plan/pillar-0-governance/frontmatter-closed-enums.md }
  - { rel: csps-dna, href: ../../docs/plan/pillar-0-governance/csps-platform-dna.md }
  - { rel: plan-creation-protocol, href: ../../docs/plan/pillar-0-governance/plan-creation-protocol.md }
  - { rel: source-extract, href: ../../docs/plan/_intake/contexts/governance/depth-discipline/EXT-20260505-004-B-mechanical-creation-discipline-with-placeholders.md }
  - { rel: registry, href: ../../docs/plan/_handoff/VAULT/template-registry.md }
---

# Governed-Artifact Frontmatter Template

> **Per S009 L1.2 + EXT-20260505-004-B 5-step mechanical-creation discipline.** Every new governed artifact starts from this template. Pre-includes depth-discipline fields (S009 L1.1) so Phase 6+ spawn templates inherit the field semantics first-time (D5 continuity-bias prevention). TBD-S<NNN> placeholders allowed pre-stabilization; validator forces backfill within 5 sessions.

## §1 — When to use this template

Author from this template when creating ANY new governed artifact:

- Pillar leaves at `docs/plan/pillar-<N>-<name>/<slug>.md`
- VAULT files at `docs/plan/_handoff/VAULT/<slug>.md`
- Topic-plan instances at `docs/plan/_handoff/VAULT/topic-plans/<topic-id>.md` (extends with topic-plan-specific fields)
- Element-review files at `docs/plan/_handoff/VAULT/element-reviews/<element-id>-S<NNN>.md`
- Canonical leaves (NEW pillar-0 / pillar-1 leaves declaring SSoT for a discipline)

**Skip when:** ADR files (use MADR template per ADR-0023); SKILL.md (use [skill.template.md](./skill.template.md) which extends this); continuous-drift-log entries (append-only format); generated files (codegen output not author-created).

## §2 — The required-fields scaffold (copy + fill)

```yaml
---
# === REQUIRED top-level fields (per ADR-0023) ===
id: csps.<area>.<slug>                          # dotted-lowercase; pattern csps.<area>.<slug>
name: <kebab-case-slug>                         # matches filename
description: |                                  # one-paragraph; ≤200 chars sentence case
  <What this artifact does + when AI should consult>
version: 1.0                                    # semver-ish; bump on revisions
owner: group:finky                              # typically group:finky
lifecycle: production                           # closed enum: experimental | beta | production | deprecated
lifecycle_state: active                         # closed enum: active | pending-review | pending-protocol | promoted | resolved | deprecated | validated | closed (see frontmatter-closed-enums.md)

# === REQUIRED governance fields (per P-ARCH-028 + nothing-stands-alone-audit) ===
core_spine: <GVRN | ARCH | AI | OPER | VALD>    # singular primary spine
core_spines: [<GVRN, ARCH, AI, OPER, VALD>]     # plural; primary first
schema_anchor: <pillar_<N>_<name>_leaves | vault_files | topic_plans | element_reviews | etc.>
template_used: <pillar-leaf | meta-template | gradual-build-plan | etc.>
template_status: <stable | novel-pending-pattern-evaluation>

# === REQUIRED tag dimensions (closed enums per frontmatter-closed-enums.md) ===
tags:
  - domain:<governance | architecture | ai | data | ops | etc.>
  - type:<reference | how-to | tutorial | explanation | feature | schema | doc | etc.>
  - audience:<developer | ai-agent | admin | etc.>
  - maturity:<draft | stable | deprecated>      # NOT lifecycle_state (K=2 catch S006/S007)

# === REQUIRED Diataxis classification ===
diataxis_type: <reference | how-to | tutorial | explanation>

# === REQUIRED session provenance ===
session: S<NNN>                                  # session created (e.g., S009)

# === REQUIRED depth fields (per depth-discipline.md S009 L1.1) ===
# Required if file projected >300 lines; placeholder TBD-S<NNN> allowed pre-stabilization
file_depth_markers:
  l1_lines: "TBD-S<NNN>"                         # range, e.g., "1-80"
  l2_lines: "TBD-S<NNN>"                         # range, e.g., "81-200"
  l3_lines: "TBD-S<NNN>"                         # range, e.g., "201-end"
  read_protocol: "TBD-S<NNN>"                    # one-line scoping rule per L1/L2/L3
depth_levels_invoked: [L1]                       # subset of {L1, L2, L3}; declares which DNA depths participate
depth_tier_authored: l1_essence                  # closed enum: l1_essence | l2_detail | l3_deep_dive

# === REQUIRED context-loss-prevention block (per plan-creation-protocol.md Step 4) ===
# Required for plans + closing-summaries + handoffs; OPTIONAL for pure reference leaves
context_loss_prevention:
  consulted: docs/plan/pillar-0-governance/context-loss-pains.md
  applies_to_this_plan:
    - PAIN-<ID>: "<how mitigated>"
  not_applicable:
    - PAIN-<ID>: "<reason>"

# === REQUIRED links ===
links:
  - { rel: parent, href: ./README.md }
  - { rel: <relation>, href: <path> }            # cross-references to related artifacts

# === OPTIONAL — Topic-plan-specific (only at _handoff/VAULT/topic-plans/<topic-id>.md) ===
# topic_id: <topic-slug>
# priority_score: <0-10>
# priority_band: <1 | 2 | 3 | 4>
# multi_session_arc: [S<NNN>, ...]
# depth_chosen: <3 | 4 | 5>                      # ONLY here per depth-discipline.md disambiguation rule
# depth_rationale: |
#   <one-paragraph why this depth>
# backtrack_register: [...]

# === OPTIONAL — Class A SKILL.md AAP fields (use skill.template.md instead) ===
# csps_aligned: true
# aap_version: 1.0
# agent_class: A
# acknowledged_contracts: [B_AI_PROFESSIONAL_VOICE, B_VALIDATE_BEFORE_ASSUME, ...]
# respects_quality_gates: [QG1, QG2, QG3, QG4]
# output_contract: <description>
# trust_tier: <internal_csps | external_partner | community_skill>

# === OPTIONAL — Consolidation-pass exemption (per B_CONSOLIDATION_PASS) ===
# consolidation_exempt: true
# consolidation_exempt_reason: "<glossary-restatement | safety-critical-redundancy | batch-boundary-cite>"

# === OPTIONAL — Vault connections (per vault-methodology.md + B_VAULT_DISCIPLINE) ===
# Every governed artifact SHOULD have vault_pending even if empty.
# vault_pending entries = items FROM this artifact that couldn't be fully processed now.
# vault_pending: []   # empty = nothing vaulted from this artifact (acceptable)
# vault_pending:
#   - id: VLT-S<NNN>-NNN          # e.g. VLT-S011-001
#     type: question | decision | external | observation | success
#     content: "<what is vaulted>"
#     context_ref: <path#section>  # where to find the reasoning context
#     session_added: S<NNN>
#     retrieve_when: "<trigger condition>"
#     principle_ref: P-XXX-NNN    # OPTIONAL: related principle

# === OPTIONAL — Question register (per vault-methodology.md §4) ===
# Typed open questions generated by or blocking this artifact.
# question_register: []  # empty = no open questions
# question_register:
#   - type: research | design | implementation | validation | external
#     question: "<the question text>"
#     routed_to: SWIFT_EXECUTE | COUNCIL_REVIEW | VAULT_DEFER
#     resolved: false           # true once answered
#     answer_ref: <path-or-commit-sha>  # where it was resolved (if resolved)
---

# <Title — kebab-case → Title Case>

> <BLUF — one-sentence purpose statement; cite source / engraving / S<NNN> turn provenance>

## §1 — <Section title>
...
```

## §3 — Placeholder discipline (TBD-S<NNN> pattern)

Per EXT-20260505-004-B §6: pre-stabilization, REAL depth markers would be wrong. Placeholders signal *"depth discipline acknowledged; values pending stabilization."*

**Lifecycle:**

1. **At creation:** `file_depth_markers.l1_lines: "TBD-S009"` (current session number)
2. **At first refactor / reassessment:** placeholder MUST be replaced with real value (e.g., `"1-80"`)
3. **Validator catches stale placeholders:** `placeholder-staleness-detection` (weekly; warn) flags TBD-S<NNN> entries age >5 sessions
4. **Forced backfill:** validator escalates to error after 10 sessions; PR-blocking

**Acceptable placeholder forms:**
- `"TBD-S<NNN>"` — current session pending stabilization
- `"TBD-S<NNN>-element-review"` — pending element-review of this artifact
- `"TBD-S<NNN>-PCR-pending"` — pending PCR ratification of placeholder values

**Unacceptable:**
- Empty string `""` — silent skip
- `null` / `~` — YAML missing-value
- `"???"` / `"FIXME"` — non-canonical placeholder format (validator rejects)
- Removed field entirely — `frontmatter_validate` flags missing-required

## §4 — Composition with existing CSPS templates

This template is the **base scaffold**; specialized templates extend it:

| Specialized template | Extends with |
|---|---|
| [`gradual-build-plan.template.md`](./gradual-build-plan.template.md) | `topic_id` + `depth_chosen ∈ {3,4,5}` + per-layer ZF gate + priority engine inputs + backtrack-register |
| [`b-star-contract.template.md`](./b-star-contract.template.md) | Canonical wording + counterweight + source + anti-patterns + 5-mechanical-surfaces table |
| [`memory-entry.template.md`](./memory-entry.template.md) | Simplified frontmatter (name + description + type only) — `feedback_<slug>.md` lives outside repo |
| [`audit-row.template.md`](./audit-row.template.md) | Audit-runner.md row format (slug + cadence + severity + 1-line description + cross-ref) |
| [`chat-jump-prompt.template.md`](./chat-jump-prompt.template.md) | 8 mandatory sections + identity banner + receipt signature format |
| [`skill.template.md`](./skill.template.md) | Class A AAP frontmatter (full csps_aligned + agent_class + acknowledged_contracts + respects_quality_gates + output_contract + trust_tier) |

## §5 — Validators (atomic per FSE; week-4 active)

| Slug | What it checks | Status |
|---|---|---|
| `depth_marker_creation_gate` | Files >300 lines have `file_depth_markers` (TBD allowed) | S009 L1.1 atomic; week-4 |
| `frontmatter_validate` | Required fields present + closed-enum compliance | LIVE |
| `frontmatter-closed-enum-drift-prevention` | Pre-write consultation evidence | S007 turn 5 atomic; week-4 |
| `corespine-layer-compliance` | `core_spine:` ∈ canonical 5-set | S006 atomic; week-4 |
| `nothing-stands-alone-audit` | `core_spine:` + `schema_anchor:` REQUIRED | S006 atomic; week-4 |
| `placeholder-staleness-detection` | TBD-S<NNN> entries age >5 sessions backfilled | S009 L1.1 atomic; week-4 |
| `template-citation-on-creation` | `template_used:` field references registered template | S006 atomic; week-4 |

## §6 — References

- [depth-discipline.md](../../docs/plan/pillar-0-governance/depth-discipline.md) — 5 CSPS depth semantics canonical home (S009 L1.1)
- [frontmatter-closed-enums.md](../../docs/plan/pillar-0-governance/frontmatter-closed-enums.md) — closed-enum reference (S007 turn 5)
- [csps-platform-dna.md](../../docs/plan/pillar-0-governance/csps-platform-dna.md) — 13 DNA elements (this template implements DNA gate Step 2)
- [plan-creation-protocol.md](../../docs/plan/pillar-0-governance/plan-creation-protocol.md) — Step 3 template selection consults this template
- [template-registry.md](../../docs/plan/_handoff/VAULT/template-registry.md) — registry entry for this template
- [EXT-20260505-004-B](../../docs/plan/_intake/contexts/governance/depth-discipline/EXT-20260505-004-B-mechanical-creation-discipline-with-placeholders.md) — source extract (5-step creation gate + placeholders)
- [B_TEMPLATE_FIRST_CREATION](../../docs/plan/pillar-0-governance/behavioral-contracts.md) — P-META-015 backing principle

**Template signature:** `S009-AI-governed-artifact-frontmatter-v1.0-2026-05-05`
