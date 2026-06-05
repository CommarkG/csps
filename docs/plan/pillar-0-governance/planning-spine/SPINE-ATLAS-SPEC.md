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

When the Atlas is live: `pre-tool-use-check-existing.sh` upgrades from advisory to blocking for governance nodes, powered by Atlas O(1) query.

### Sensitive-Places Map — 6 Ranked Promotion Chokepoints

A "promotion event" is the instant something moves from idea → persisted (a Write to a new node, draft → ratified). This is the ONLY moment consolidation is cheap — before a duplicate grows dependents. The 6 chokepoints, ranked by (harm × current-gate-weakness):

| Rank | Promotion chokepoint | Why sensitive | Gate severity | Current gap |
|------|---------------------|---------------|---------------|-------------|
| **1** | **New PRINCIPLE / CONTRACT / VALIDATOR** | Duplicate = active enforcement harm; a duplicate validator runs wrong governance; a duplicate principle creates contradictory injunctions | **HARD-BLOCK** — Atlas query required before Write is permitted; no creation without confirmed non-existence | `pre-tool-use-bstar-trio-gate.sh` checks T1/T2/T3 but NOT "does a sibling/parent exist?" — this is the primary gap |
| **2** | **New REGISTER / INDEX** | Meta-scatter: the cure scattered into 25 partial indexes; a new register is the 26th | **HARD-BLOCK** — register creation requires Atlas entry + fold-into-existing check | No gate currently; new registers created freely |
| **3** | **New FILE / PAGE Write** (highest volume) | 6 journey routes born here; a new page duplicating an existing page is waste at the highest-frequency point | **ADVISORY → BLOCKING by PE** — advisory now; escalate to blocking as Atlas matures | `pre-tool-use-check-existing.sh` + `pre-tool-use-inventory-scan-required.sh` = advisory (exit 0 confirmed) |
| **4** | **New PLAN / SPEC per topic** | Planning scatter; a new plan for a topic that already has a ratified plan creates a forked governance record | **ADVISORY → BLOCKING by PE** | `pre-tool-use-plan-coverage-gate.sh` exists but is not an Atlas-powered consolidation check |
| **5** | **RATIFICATION (draft → ratified)** | Nothing checks "does this supersede an existing ratified node?" at the moment of ratification — the most consequential promotion event | **ADVISORY → BLOCKING by PE** | No gate at the ratification moment specifically |
| **6** | **NAMING (D8 amplifier)** | Differently-named duplicates evade ALL checks 1–5 (journey/journeys/journey-trunk); D8 training default generates novel names | **ALIAS SCHEMA** — the Atlas's `alt_labels` + `deprecated_labels` fields are the structural answer; an Atlas query must search aliases, not just canonical names | Currently no alias resolution; grep-archaeology is alias-blind |

### Gate Severity Rationale

**Ranks 1–2 = HARD-BLOCK:** A duplicate principle or register is an active governance harm — it runs wrong rules or creates a contradictory index. The cost of a false positive (blocking a genuinely new principle) is one IZFC-gate sweep to prove distinctness. Acceptable. The cost of a missed duplicate is sessions of compounding damage.

**Ranks 3–5 = ADVISORY → BLOCKING by PE:** Advisory now because the Atlas doesn't exist yet and false positives at these ranks would create unacceptable friction. Escalate to blocking as Atlas-confidence grows (PE-scored by query precision / false-positive rate). Never jump to blocking without measuring.

**Rank 6 = ALIAS SCHEMA (structural, not a gate):** A gate can't solve naming evasion — if the Atlas doesn't know that "journeys" and "journey-trunk" are aliases for "journey," the gate fires on both and passes both. The alias schema `alt_labels[]` is the structural fix. The gate relies on the Atlas having good aliases; the Atlas gets its aliases from the creation event ("creating X; this concept is also known as Y, Z").

### Implementation Order

1. **Atlas alias schema** (rank 6 structural fix — prerequisite for all gates)
2. **Rank 1 hard-block** (principle/contract/validator) — highest harm, tightest scope
3. **Rank 2 hard-block** (register/index) — second-highest harm
4. **Ranks 3–5 advisory** (file/plan/ratification) — ship with Atlas; escalate to blocking per PE

All implementation: BLOCKED on A2-cycles-audit (EXTENDED validator slot required).

---
*DRAFT v0.1 — Sensitive-Places Map folded in per PROTO-CONSOLIDATE-SELF (Opus-18 S080)*
*tooling BLOCKED on A2-cycles-audit | Sonnet S080 | 2026-06-05*
