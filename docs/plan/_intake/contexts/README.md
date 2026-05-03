---
id: csps.intake.contexts
name: external-input-contexts-root
description: The fan-out destination tree for external-input extractions. Mirrors the CSPS schema EXACTLY — trunk + 7 pillars + 40 leaf-level sub-folders + cross-cutting + raw-uncategorized. Each extracted insight lands in 1..N leaf-level folders (pub/sub fan-out). Pre-runtime: lazy-created markdown sub-folders with extraction-notes. Post-runtime: pub/sub topics on Cloudflare Queues with subscribers per-leaf.
version: 1.1
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
links:
  - { rel: parent, href: ../README.md }
  - { rel: protocol, href: ../manual-protocol.md }
  - { rel: ledger, href: ../extractions-ledger.md }
  - { rel: tags-status, href: ../tag-status-contract.md }
  - { rel: proactive-completion, href: ../proactive-completion.md }
  - { rel: walkthrough, href: ../walkthrough-example.md }
---

# External-Input Contexts (the fan-out destination tree)

> **The gate doesn't presume to know who cares; subscribers self-select. AND — they self-select at the level of granularity that matches CSPS's schema, not at coarse pillar level.**

## What this directory holds

The fan-out destination tree mirrors the CSPS schema **exactly**. Every leaf doc in the schema has a corresponding context folder; every extraction-note lands in the most-specific matching folder.

This was clarified in S002 turn 4 after the user noted: *"The drop zone for input is built exactly like the Schema? same pillars and other 'tree' structure?"* The answer "pillar-level yes, leaf-level no" was insufficient. v1.1 of this doc + lazy-created leaf folders + multi-section sub-IDs (in `manual-protocol.md`) close the gap.

## The full tree (mirrors schema; lazy-created)

```
_intake/contexts/
├── README.md                                    ← this file (the tree definition)
├── trunk/                                       ← MASTER_PLAN-level cross-cutting
│   └── README.md
│
├── governance/                                  ← Pillar 0 (10 leaves)
│   ├── README.md
│   ├── architecture-principles/                 ← per-leaf folder; lazy-created
│   ├── audit-runner/
│   ├── adr-process/
│   ├── learning-loop/
│   ├── mechanical-enforcement/
│   ├── operating-principles/
│   ├── planning-playground/
│   ├── reuse-first-principle/
│   ├── rule-registry/
│   └── stewardship-protocol/
│
├── architecture/                                ← Pillar 1 (9 leaves)
│   ├── README.md
│   ├── complexity-contract/
│   ├── frontmatter-standard/
│   ├── module-folder-pattern/
│   ├── naming-protocol/
│   ├── repo-layout/
│   ├── slice-contract/
│   ├── tech-stack/
│   ├── vocabulary/
│   └── vocabulary-as-code/
│
├── data-schema/                                 ← Pillar 2 (4 leaves)
│   ├── README.md
│   ├── app-schema-contract/
│   ├── audit-triggers/
│   ├── foundation-zmodel/
│   └── starter-slices/
│
├── platform-services/                           ← Pillar 3 (5 leaves planned)
│   ├── README.md
│   ├── catalog-bundle-system/
│   ├── customer-kit/
│   ├── sandboxed-skill-governance/
│   ├── stripe-clerk-wiring/
│   └── template-governance/
│
├── developer-experience/                        ← Pillar 4 (4 leaves planned)
│   ├── README.md
│   ├── ai-behavior-instructions/
│   ├── generators/
│   ├── skill-ingestion-contract/
│   └── skills-package/
│
├── ai-systems/                                  ← Pillar 5 (3 leaves planned)
│   ├── README.md
│   ├── crisis-escalation/
│   ├── mastra-setup/
│   └── persona-composition/
│
├── operations/                                  ← Pillar 6 (5 leaves planned)
│   ├── README.md
│   ├── bootstrap-script/
│   ├── build-order/
│   ├── dashboards/
│   ├── graduation-pipeline/
│   └── open-frontiers/
│
├── intake/                                      ← The intake plane itself (recursive)
│   ├── README.md
│   ├── external-inputs-plan/
│   ├── manual-protocol/
│   └── source-types/
│
├── cross-cutting/                               ← Content spanning ≥3 leaves OR ≥2 pillars
│   └── README.md
│
└── raw-uncategorized/                           ← Default destination for unclassifiable content; NEVER default-to-discard
    └── README.md
```

**Total leaf-level destinations:** 40 leaves + trunk + 4 intake-internal = 45 specific destinations. Plus cross-cutting + raw-uncategorized fallbacks = 47 total.

## Routing rules (declared, MECHANICALLY enforced via manual-protocol.md step 5)

### Single-section input (input is one logical unit)

Routes to **one OR more** leaf folders based on relevance. Examples:
- A snippet about "DRY principle" → `governance/reuse-first-principle/`
- A discussion of "Postgres schema-per-app" → `data-schema/app-schema-contract/`
- A snippet that's both about reuse AND audits → both `governance/reuse-first-principle/` AND `governance/audit-runner/` (fan-out at leaf level)

### Multi-section input (input has distinct sections targeting different leaves)

Each section is a sub-extraction with **sub-ID**: `EXT-YYYYMMDD-NNN-A`, `EXT-YYYYMMDD-NNN-B`, etc. Each sub-ID lands in its own leaf folder.

Example: a treasure document with 3 sections — pricing, persona tone, audit pattern:
- `EXT-20260502-001-A` → `platform-services/stripe-clerk-wiring/EXT-20260502-001-A-pricing-section.md`
- `EXT-20260502-001-B` → `ai-systems/persona-composition/EXT-20260502-001-B-persona-tone-section.md`
- `EXT-20260502-001-C` → `data-schema/audit-triggers/EXT-20260502-001-C-audit-pattern-section.md`

The parent `EXT-20260502-001` ledger entry tracks the multi-section composition; each sub-ID has its own ledger row + own status. See `manual-protocol.md` step 5b.

### Cross-cutting routing (≥3 leaves OR ≥2 pillars)

If a single section ripples across ≥3 leaves OR ≥2 pillars, it goes in `cross-cutting/` AS WELL AS each of the leaf folders. This is the "ripple to all relevant domains" guarantee from the user directive.

The `cross-cutting/` folder serves as the index; it contains the canonical extraction-note. The leaf folders contain references to the cross-cutting note.

### Raw-uncategorized (default, never default-to-discard)

If the AI cannot confidently route a section to any specific context (confidence < 0.75 on classification), the section lands in `raw-uncategorized/` with `lifecycle_state: pending-review` + `next_action: classify`. The fresh-chat protocol (per `protocols.md` §11 + manual-protocol.md step 7) surfaces these for the user to resolve in the next session.

This is the **anti-discard** mechanism. P-META-005 design principle 4: *"Capture in flow, surface on demand."*

## Pillar-level folders — README contents

Each pillar-level folder's README:
- Lists the leaves inside (so the AI knows the taxonomy when routing)
- Describes which kinds of content land in this pillar (so classification is principled)
- Links to the actual leaf docs in `pillar-N-<name>/<leaf>.md` (so the routing decision is verifiable)
- Specifies the SLA + cadence for this pillar's extractions (some pillars have tighter SLAs — e.g., `governance/learning-loop/` has same-day SLA because it's the meta-loop; `operations/open-frontiers/` has 30-day SLA because it's exploratory)

## How a leaf-level folder is structured (when it exists)

Filename pattern: `EXT-YYYYMMDD-NNN[-X]-<short-slug>.md`

Frontmatter (per `tag-status-contract.md`):
```yaml
---
extraction_id: EXT-20260502-001-A
parent_input_id: EXT-20260502-001
source_type: URL_PDF                            # closed enum from source-types.md
section_label: pricing-section                  # for multi-section parents
confidence: 0.92
confidence_band: auto-accept                    # auto-accept | human-review | discard
lifecycle_state: pending-review                 # P-META-004 stewardship state
pipeline_state: triaged                         # P-META-005 learning-loop state
next_review_at: 2026-08-01
recurrence_check_at: 2026-08-01                 # 90 days for default tier
routed_to: docs/plan/pillar-3-platform-services/stripe-clerk-wiring.md
risk: medium
trust_tier: tenant_url_paste
tags:                                           # closed enum from frontmatter-standard.md
  - domain:billing
  - type:reference
  - audience:developer
  - tier:business
  - maturity:draft
inherited_from_input:                           # tag inheritance (P-META-004 + tag-status-contract.md)
  - tags: [audience:developer, audience:ai-agent]
  - trust_tier: tenant_url_paste
  - source_type: URL_PDF
sla_due:                                        # P-META-005 SLAs
  triaged_to_routed: 2026-05-04T12:00:00Z      # 48h
  fixing_complete: 2026-08-01                  # 90d for P2
---
```

Body: 1–3 sentences of the extracted insight + verbatim source quote(s) where available + recommended downstream action + any open questions tied back to OQ-IDs in the open-questions-ledger.

## Migration to runtime (planned, week 4–6)

When the pub/sub bus + LearningLoopItem table ship:

1. Each leaf-level context maps to a Cloudflare Queues topic: `csps.context.<pillar>.<leaf>`.
2. Domain-owner subscribers register topic filters at the **leaf** level (not pillar level — too coarse).
3. Existing `<context>/<leaf>/*.md` notes migrate via `tools/intake/migrate-context-notes.ts` into `public.learning_loop_item` rows preserving `parent_input_id`, `section_label`, `routed_to`, all tags, and current state.
4. Cross-cutting notes migrate into a special "fan-out aggregator" subscriber pattern that re-publishes to multiple leaf topics.

## Cross-references

- [../manual-protocol.md](../manual-protocol.md) — step 5 (single-section) + step 5b (multi-section)
- [../tag-status-contract.md](../tag-status-contract.md) — tag closed enums + propagation rules + state machines + audits
- [../proactive-completion.md](../proactive-completion.md) — the closure forcing functions
- [../walkthrough-example.md](../walkthrough-example.md) — proof-of-pipeline worked example
- [../extractions-ledger.md](../extractions-ledger.md) — running ledger
- [../../pillar-0-governance/learning-loop.md](../../pillar-0-governance/learning-loop.md) — the principle
