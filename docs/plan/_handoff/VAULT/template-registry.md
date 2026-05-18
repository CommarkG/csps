---
id: csps.handoff.vault.template-registry
name: template-registry
description: Single source of truth for all CSPS templates — the discovery mechanism mandated by P-META-015 (Universal Template-First). Every commitment-layer artifact-type AND every recurring AI output type (code shape / prose voice / reasoning structure / tool sequencing / commit messages) has a registered template here with applicability triggers + validator slug + escape hatch (`template_status: novel-pending-pattern-evaluation` with K=2 promotion to template if pattern recurs). Authoring discipline: register the entry FIRST (atomic per FSE amendment); template file may be authored later. Entries without a template file get `implementation_status: registered-pending-author`.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: registry-canonical
template_status: novel-pending-pattern-evaluation
core_spines: [GVRN, ARCH, AI, VALD]
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: governs, href: ../../pillar-0-governance/csps-core-manifest.md }
  - { rel: composes-with, href: ../../pillar-3-platform-services/template-governance.md }
  - { rel: schema, href: ../../../../tools/templates/ }
session: S006
domain_path: platform
scope_level: S1
---

# Template Registry

> **Per P-META-015 (Universal Template-First):** every commitment-layer output AI produces — persisted artifacts, code, prose patterns, decision frames, reasoning structures, tooling discipline — passes through a template-discovery gate. This file is that gate's index.
>
> **Per humble-batching (S005 turn 19):** templates are added INCREMENTALLY as patterns recur ≥K=2 times. Premature template authoring locks in immature shapes; missing templates create drift. The registry holds slots; population is gradual.

## How to add a template entry

1. Identify recurring pattern (≥2 instances OR clear-pattern from CSP precedent)
2. Add row to appropriate section table below with: `id` / `applicability_trigger` / `validator_slug` / `template_file_path` / `implementation_status`
3. Register validator slug ATOMICALLY in [audit-runner.md](../../pillar-0-governance/audit-runner.md) (per FSE amendment S005 turn 18)
4. Author template file at `template_file_path` when ready (or set `implementation_status: registered-pending-author`)
5. Set `template_status: novel-pending-pattern-evaluation` on the FIRST instance using a new template; promote to `stable` after K=2 successful uses

## Registry sections

Templates organized by output category per inner-AI-defaults registry alignment.

### §1 Persisted artifact templates (.md / .yaml)

| Template ID | Applicability trigger | Validator | File path | Implementation status |
|---|---|---|---|---|
| `domain-card` | Any platform element needing self-description for human + AI readers simultaneously (spine, platform-service, future app domain, future external element) | `template-compliance` (validate-template-compliance.mjs — S018 seed, enforcement_stage: planned, week-4) | [`tools/templates/domain-card.template.md`](../../../../tools/templates/domain-card.template.md) | **LIVE (S018 — authored; 10 instances in docs/platform-audit/spines/ + platform-services/; schema_version: 1.0; propagation mechanism: template_version field in each artifact + freshness validator detects drift on schema_version bump)** |
| `mini-tree-intro` | Any domain split into intro+index+sub-files (>300 lines AND ≥3 sections) | `mini-tree-intro-required` (week-4) | [`tools/templates/mini-tree-intro.template.md`](../../../../tools/templates/mini-tree-intro.template.md) | **LIVE (S018 — authored; enforcement_stage: planned; dual-gate threshold: >300 lines AND ≥3 distinct semantic sections)** |
| `gradual-build-plan` | Multi-session topic entering platform | `gradual-build-plan-coverage` | [`tools/templates/gradual-build-plan.template.md`](../../../../tools/templates/gradual-build-plan.template.md) | **LIVE (S006 L1.4 — authored)** |
| `b-star-contract` | New B_* behavioral contract | `b-star-contract-format` | [`tools/templates/b-star-contract.template.md`](../../../../tools/templates/b-star-contract.template.md) | **LIVE (S006 L3 — authored)** |
| `memory-entry` | New memory file in `~/.claude/projects/.../memory/` | `memory-entry-format` + `memory-entry-3-block-structure` + `memory-index-completeness` | [`tools/templates/memory-entry.template.md`](../../../../tools/templates/memory-entry.template.md) | **LIVE (S006 L3 — authored)** |
| `audit-row` | New audit registered in audit-runner.md or audit-hub.md | `audit-row-format` + `audit-row-backing-principle-cross-reference-required` + `audit-row-cadence-severity-closed-enum` | [`tools/templates/audit-row.template.md`](../../../../tools/templates/audit-row.template.md) | **LIVE (S006 L3 — authored)** |
| `chat-jump-prompt` | Cross-chat handshake at session boundary (per B_MUV) | `chat-jump-prompt-identity-banner-present` + `session-receipt-signature-format` + `chat-jump-prompt-8-mandatory-sections` + `alignment-questions-section-required-on-high-stakes` | [`tools/templates/chat-jump-prompt.template.md`](../../../../tools/templates/chat-jump-prompt.template.md) | **LIVE (S006 L3 — authored; absorbs S006 turn 4 Option C identity-confirmation as 2 validators atomic per FSE)** |
| `skill-aap` | New SKILL.md at ANY CSPS skill location (packages/skills/ + .claude/skills/ + libs/agents/ week-6+) | `agent-alignment-coverage` + `skill-location-coverage-completeness` | [`tools/templates/skill.template.md`](../../../../tools/templates/skill.template.md) | **LIVE (S007 §24++ post-close addendum — authored; closes wildcard-at-write-time gap; embeds full AAP scaffolding per B_AGENT_ALIGNMENT_PROTOCOL)** |
| `closing-summary` | Session-close closing-summary | `closing-summary-checklist-completeness` | [closing-summary-template.md](./closing-summary-template.md) | LIVE (canonical; pre-existing) |
| `sonnet-report` | Every Sonnet→Opus report written to `tools/council/sonnet-turn.md` — mid-session or at close | `sonnet-report` (validate-communication-protocol.mjs Rule 1 check) | [`tools/templates/sonnet-report.template.md`](../../../../tools/templates/sonnet-report.template.md) | **LIVE (S042 — authored; Rule 1+3+10+12 from communication-protocol-shared.md baked in; YOU ARE/I AM/SITUATION/TASK block + commit SHA + numbered questions mandatory; template_grade: A)** |
| `handoff` | Session→session handoff document | `handoff-zone-structure-present` | (extracted from handoff-S005-to-S006.md pattern) | registered-pending-author **template_grade: A (Opus Turn 15 S026)** — governs all session handoffs; constitutional. Author template file before S028. |
| `adr` | Architecture Decision Record | `adr-madr-format` | (per [ADR-0023](../../adr/0023-hybrid-frontmatter-schema-universal-core-plus-per-file-type.md) MADR) | LIVE |
| `pillar-leaf-architectural-manifest` | Pillar-0 architectural manifest declarations (e.g., csps-core-manifest, csps-build-dna) | (none yet — K=2 pending) | (TBD) | novel-pending-pattern-evaluation |
| `l1-core-sealed-doctrine` | Sealed L1 core doctrine for a Core Spine — `.claude/core-spines/L1_CORE_<SPINE>.md` (5 instances S006 L2c; one per GVRN/ARCH/AI/OPER/VALD) | `L1-do-not-expand-violation` (registered atomic; impl week-4) | (template extracted from S006 L2c instances after K=2 — currently 5 instances all use same shape; pattern is stable) | novel-pending-pattern-evaluation (5 instances S006; K=2 reached but template-extraction deferred to dedicated L4 work) |
| `pillar-leaf` | Standard pillar leaf (Diataxis-typed) | `frontmatter_validate` (universal-required) | (per ADR-0023) | LIVE |
| `topic-plan` | Multi-session topic-plan instance | `topic-plan-required-sections-present` | (extracted from `s006-governance-foundation.md` after K=2) | novel-pending-pattern-evaluation |
| `governor-prompt-entry` | Governor prompt log entry | `governor-prompt-entry-format` | (extracted from governor-prompts/README.md schema) | registered-pending-author |
| `element-review` | Platform element deep-review | `element-review-required-sections` | `_handoff/VAULT/element-reviews/README.md` (template embedded) | registered-pending-author (L1.5) |
| `topic-plan-attestation` | Per-level exit attestation block | `attestation-signature-format` | (embedded in gradual-build-plan template) | registered-pending-author |
| `governed-artifact-frontmatter` | ANY new governed artifact (.md) — pillar leaves / vault files / topic-plans / element-reviews / canonical leaves; specialized templates EXTEND this base | `depth_marker_creation_gate` + `frontmatter_validate` + `frontmatter-closed-enum-drift-prevention` + `corespine-layer-compliance` + `nothing-stands-alone-audit` + `placeholder-staleness-detection` + `template-citation-on-creation` | [`tools/templates/governed-artifact-frontmatter.template.md`](../../../../tools/templates/governed-artifact-frontmatter.template.md) | **LIVE (S009 L1.2 — authored)** — per EXT-20260505-004-B mechanical creation gate; pre-includes depth fields (S009 L1.1) + closed-enum compliance + AAP extension hooks |

### §2 Code-output templates (TypeScript / SQL / config)

| Template ID | Applicability trigger | Validator | File path | Implementation status |
|---|---|---|---|---|
| `slice-contract` | New slice in apps/<name>/slices/ | `slice-contract-90-percent` | (per P-ARCH-006) | LIVE (week-3 generator ships) |
| `zmodel-foundation` | New foundation slice ZModel | `zmodel-rls-required` + `tenant-id-ubiquity` | `libs/policies/foundation/<entity>.zmodel` | registered-pending-author (foundation-slice topic) |
| `audit-trigger-DDL` | New auditable table | `audit-trigger-coverage` | `libs/policies/audit-triggers.sql` (extends existing) | LIVE (pre-existing skeleton) |
| `result-type-error-handling` | Function returning fallible operation | `csps-eslint-no-bare-throw` | `templates/code/result-type.ts` | registered-pending-author |
| `zod-schema-with-glossary-id` | New Zod schema | `glossary-id-citation` + Vale dict | `templates/code/zod-glossary.ts` | registered-pending-author |
| `validator-script` | New `tools/validators/validate-*.mjs` | (validator-of-validators) | (extracted from existing 5 validator scripts) | LIVE |
| `nx-page-template` | New `app/(routes)/.../page.tsx` | per [ADR-0004](../../adr/0004-template-only-page-creation.md) — 22-template catalog | [template-governance.md](../../pillar-3-platform-services/template-governance.md) | LIVE (pre-existing) |

### §3 Prose-output templates

| Template ID | Applicability trigger | Validator | File path | Implementation status |
|---|---|---|---|---|
| `top-expert-colleague-voice` | AI chat reply (any) | `prose-voice-attestation` (sampling) | `templates/prose/top-expert-colleague.md` | registered-pending-author |
| `pcr-decision-frame` | Multi-option decision presented in chat | `decision-frame-citation` | `templates/decisions/pcr.md` | LIVE (canonical via B_PCR_FOR_DECISIONS) |
| `priority-engine-decision-frame` | Layer-placement decision OR depth-choice | `priority-engine-inputs-complete` | `templates/decisions/priority-engine.md` | registered-pending-author (L1.4 — extracted from priority-engine.schema.yaml) |
| `pe-alignment-deflection` | Human input misaligned with PE top-priority | `pe-alignment-guardian-coverage` | `templates/prose/pe-alignment-deflection.md` | registered-pending-author (NEW per CSP S317 absorption) |
| `comment-discipline` | Code comment | `comment-only-where-why-non-obvious` | `templates/code/comment-discipline.md` | registered-pending-author |
| `commit-message-csps` | Git commit message | `commit-message-format` | `templates/commits/csps-commit.md` | registered-pending-author |

### §4 Reasoning/tooling templates

| Template ID | Applicability trigger | Validator | File path | Implementation status |
|---|---|---|---|---|
| `rzf-cycle` | Any DONE/CLOSED/RATIFIED claim | (P-META-006 enforcers) | `templates/reasoning/rzf.md` | registered-pending-author |
| `cec-walk` | Any new principle/contract/leaf ratification | (P-META-006 CEC enforcers) | `templates/reasoning/cec.md` | registered-pending-author |
| `fse-engraving` | New B_* contract or principle | (P-META-007 FSE enforcers) | `templates/reasoning/fse.md` | registered-pending-author |
| `4-condition-gate` | Decision whether to execute autonomously | (P-OP-002 enforcers) | `templates/reasoning/4-condition-gate.md` | registered-pending-author |
| `parallel-when-independent` | Multi-tool call planning | `tool-sequencing-discipline` (sampling) | `templates/tooling/parallel-when-independent.md` | registered-pending-author |
| `class-b-agent-spawn-preamble` | Sub-agent spawn (Class B: Explore/Plan/general-purpose/claude-code-guide/statusline-setup) | `agent-alignment-coverage` + `subagent-spawn-preamble-required` | [`tools/templates/class-b-agent-spawn-preamble.template.md`](../../../../tools/templates/class-b-agent-spawn-preamble.template.md) | **LIVE (S010 Phase 6 6a+6b+6d — T2.0 scaffold + T2.1 ZF cycle + T2.2 validator full-pass + T2.3 file scan; depth-discipline fields declared per S009 L1.1; extends governed-artifact-frontmatter.template.md S009 L1.2)** |
| `chat-transfer-protocol` | AI-to-AI task transfer across any chat boundary (S013+) | `chat-transfer-protocol-completeness` | [`tools/templates/chat-transfer-protocol.template.md`](../../../../tools/templates/chat-transfer-protocol.template.md) | **LIVE (S012 — authored; zero-drift design: DECLARE FIRST + required-output per step + exact completion format + BLOCKED path; replaces ad-hoc cross-chat handoffs S006–S012)** |

### §5 Agent/persona templates

| Template ID | Applicability trigger | Validator | File path | Implementation status |
|---|---|---|---|---|
| `skill-md-aap` | New SKILL.md (Class A) | `aap_frontmatter_coverage` | (extracted from existing 7 SKILL.md aligned in S005) | LIVE |
| `mastra-base-agent` | New Mastra agent (Class C) | `agent-alignment-coverage` | (week-6 build) | registered-pending-author |
| `persona-system-prompt` | New persona | per [P-ARCH-013](../../pillar-0-governance/architecture-principles.md#L249) | (week-7 build) | registered-pending-author |

### §6 Context-loading templates (Phase 9 S011 — CCA Layer 4 activation)

Per token-optimization.md §9.10 Phase 9. Each JSON file specifies which artifacts + MCP queries to load for a given task class. Goal: replace full-monolith reads with targeted slice loads (~200-1800 tokens vs 50K-85K).

| Template ID | Task class | Model tier | File path | Estimated L1 token cost |
|---|---|---|---|---|
| `context-loading-session-open` | Session startup (S<NNN> open, §17 receipt) | Sonnet | [`tools/templates/context-loading/session-open.json`](../../../../tools/templates/context-loading/session-open.json) | ~2,500 |
| `context-loading-engraving` | FSE 5-surface atomic engraving | Opus | [`tools/templates/context-loading/engraving.json`](../../../../tools/templates/context-loading/engraving.json) | ~1,800 |
| `context-loading-qc-validation` | ZF/RZF cycle + pnpm verify | Sonnet | [`tools/templates/context-loading/qc-validation.json`](../../../../tools/templates/context-loading/qc-validation.json) | ~800 |
| `context-loading-session-close` | Handoff + HPFA + closing-summary | Sonnet | [`tools/templates/context-loading/session-close.json`](../../../../tools/templates/context-loading/session-close.json) | ~1,200 |
| `context-loading-pcr` | PCR decision rendering | Sonnet | [`tools/templates/context-loading/pcr.json`](../../../../tools/templates/context-loading/pcr.json) | ~300 |
| `context-loading-mcp-query` | Principle/contract lookup via principles-mcp | Haiku | [`tools/templates/context-loading/mcp-query.json`](../../../../tools/templates/context-loading/mcp-query.json) | ~200 |
| `context-loading-agent-spawn` | Class B subagent spawn with AAP preamble | Haiku | [`tools/templates/context-loading/agent-spawn.json`](../../../../tools/templates/context-loading/agent-spawn.json) | ~600 |
| `context-loading-frontmatter-authoring` | New governed artifact + frontmatter | Sonnet | [`tools/templates/context-loading/frontmatter-authoring.json`](../../../../tools/templates/context-loading/frontmatter-authoring.json) | ~1,000 |

**Phase 9 remaining (S012):** bundling orchestrator (`tools/pe-compute.mjs`) + `user-prompt-submit-context-orchestrator.sh` hook (task-class detection) + `validate-token-budget.mjs` 5-mode (Phase 10).

---

## Escape hatch — `template_status: novel-pending-pattern-evaluation`

When AI encounters a genuinely novel artifact-type for which no template exists:

1. Author the artifact freeform
2. Add `template_status: novel-pending-pattern-evaluation` to its frontmatter
3. Log the new pattern in `_handoff/VAULT/inner-ai-defaults/continuous-drift-log.md`
4. After K=2 instances of the same novel pattern: promote to template (add registry entry + author template file + amend prior instances to cite the new template)

**This escape hatch is itself audited** — `novel-pending-pattern-evaluation-staleness` audit fires when an entry sits at `novel-pending` for >5 sessions without K=2 evaluation.

---

## Validators (registered atomically per FSE amendment)

| Slug | Pipeline | Status |
|---|---|---|
| `template-citation-on-creation` | Pipeline 10 csps-alignment | registered (impl deferred) |
| `template-registry-coverage` | Pipeline 10 | registered (impl deferred) |
| `novel-pending-pattern-evaluation-staleness` | Pipeline 10 | registered (impl deferred) |
| `chat-jump-prompt-identity-banner-present` | Pipeline 10 | registered (impl deferred) — absorbs identity-confirmation Option C |
| `session-receipt-signature-format` | Pipeline 10 | registered (impl deferred) — absorbs identity-confirmation Option C reader-side |
| `pe-alignment-guardian-coverage` | Pipeline 10 | registered (impl deferred) — NEW per CSP S317 absorption |
| `chat-transfer-protocol-completeness` | Pipeline 10 | registered (impl deferred) — NEW S012: cross-chat task transfers must use zero-drift template |

---

## Maintenance discipline

- **K=2 promotion rule:** novel-pending entries promote to stable templates after 2 successful uses
- **Cadence:** registry reviewed at every closing summary §10.0g (inner-default leak report)
- **Drift detection:** `template-registry-coverage` audit runs weekly comparing registry entries vs in-platform artifact citations
- **Authority:** template registry entries are L2 governance (PCR + ADR-amendment for major changes; PR-comment for minor)

**Registry signature:** `S006-AI-template-registry-2026-05-04T15:15:00Z`
