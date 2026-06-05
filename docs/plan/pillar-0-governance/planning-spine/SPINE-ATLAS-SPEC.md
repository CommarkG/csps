---
id: csps.governance.planning-spine.spine-atlas-spec
name: SPINE-ATLAS-SPEC
description: "Specification for the Spine Atlas — the generated, always-current canonical map of every platform node. SUBSTRATE artifact. Tooling implementation BLOCKED on A2-cycles-audit (verify-cycles at hard_limit)."
version: "0.1-draft"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
status: draft
authored_by: Sonnet S080
authored_at: "2026-06-05"
tooling_blocked_on: A2-cycles-audit
tooling_blocked_reason: "validate-cycle-count at hard_limit 200; Atlas validator needs EXTENDED tier slot freed by A2"
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - maturity:draft
links:
  - { rel: planning-spine, href: PLANNING-SPINE.md }
  - { rel: platform-inventory-scan, href: ../../../../tools/scripts/platform-inventory-scan.mjs }
  - { rel: existing-seed-canonical-concepts, href: ../../../../tools/config/canonical-concepts-registry.yaml }
  - { rel: existing-seed-platform-genome, href: ../PLATFORM-GENOME.md }
  - { rel: a2-cycles-audit, href: ../../../../docs/plan/_handoff/HANDOFF-S079-to-S080.md }
---

# Spine Atlas — Specification

> **⚠️ TOOLING BLOCKED:** Implementation requires A2-cycles-audit to free an EXTENDED-tier validator slot.
> This file is the **design spec** only. No tooling built here.

---

## What the Spine Atlas Is

The Spine Atlas is the single, generated, always-current canonical map of every CSPS node:
every file, page, doc, validator, principle, register, and hook — organized by spine (GVRN/ARCH/AI/OPER/VALD),
each with: canonical home, aliases, purpose, status, and creation session.

**Generated, never maintained.** The Atlas is produced by scanning the repo. Human edits to the Atlas itself are blocked. If the Atlas diverges from the filesystem, the scanner is wrong — fix the scanner.

---

## Why It's Needed

CSPS currently has ~25 partial, overlapping, separately-maintained maps:
- `tools/config/canonical-concepts-registry.yaml`
- `tools/config/core-spine-registry.yaml`
- `tools/config/dna-registry.yaml`
- `tools/config/inheritance-registry.yaml`
- `docs/INDEX.md`, `COUNCIL-INDEX.md`, `PLATFORM-GENOME.md`
- 7 registers in `tools/data/`
- `tools/scripts/platform-inventory-scan.mjs` (partial scanner)
- ... and more

None is complete. None is canonical. ADR-0025 already ratified "index artifacts generated never maintained" — the Atlas is the execution of that principle at master scale. The 25 become views of the one.

---

## Atlas Node Schema (draft)

```yaml
- id: <csps.qualified.id>
  preferred_label: <canonical name>
  alt_labels: [<alias-1>, <alias-2>]  # all known alternative names
  deprecated_labels: [<former-name>]  # old names that must redirect
  spine: GVRN | ARCH | AI | OPER | VALD
  layer: L0 | L1 | L2 | L3
  type: principle | contract | validator | hook | route | doc | register | script | template
  canonical_home: <relative path from repo root>
  purpose: <one-line description>
  status: active | stub | advisory | deprecated | greenfield
  created_session: S<NNN>
  composes_with: [<id>, ...]
  supersedes: [<id>, ...]   # for deprecated/renamed nodes
```

---

## Generation Mechanics (design, not built)

**Two modes (per Expert 2 board analysis):**

1. **Incremental** (pre-commit hook): scan only the changed file's directory subtree, update affected Atlas entries. Sub-second. Fires on every commit.

2. **Full regen** (weekly / on demand): full filesystem scan via `platform-inventory-scan.mjs` extended to Atlas schema. Source of truth for the incremental mode's cache.

**Validator** (EXTENDED tier — needs A2 to free slot):
`validate-spine-atlas-currency.mjs`
- Asserts: every node in the Atlas resolves to a real file
- Asserts: every governance node file has an Atlas entry
- Exits 1 (blocking) on either failure

---

## Seeds (what to absorb, not copy)

The Atlas absorbs these existing registries by making them **generated views**:

| Existing registry | What it contributes |
|------------------|--------------------| 
| `canonical-concepts-registry.yaml` | preferred_label + alt_labels + purpose |
| `core-spine-registry.yaml` | spine classification + layer |
| `PLATFORM-GENOME.md` | DNA inheritance + composes_with |
| `platform-inventory-scan.mjs` | the scan engine itself |

These files are NOT deleted. They become outputs of Atlas generation queries, not separate hand-maintained files.

---

## Creation-Gate (design, not built)

When the Atlas is live: `pre-tool-use-check-existing.sh` upgrades from advisory to blocking for governance nodes, powered by Atlas O(1) query. Scope: hard-block on new principles/contracts/validators. Advisory on UI routes and app code. See Expert 4 board analysis for gate severity rationale.

---
*DRAFT v0.1 — tooling BLOCKED on A2-cycles-audit | Sonnet S080 | 2026-06-05*
