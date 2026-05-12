---
id: csps.handoff.vault.opus-srof-schema-spines-review
name: opus-srof-schema-and-spines-review
description: >
  Comprehensive architectural review for Opus — Part A: Schema as platform reference
  (intention vs. reality). Part B: Core Spines L1/L2/L3 graduation audit.
  Prepared by Sonnet S027 under Governor directive. Each part ends with 15 expert questions.
  PE-scored consolidation proposals enclosed. Sonnet judgment where applicable.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, VALD]
schema_anchor: opus_consultations
diataxis_type: reference
session: S027
tags:
  - domain:governance
  - domain:architecture
  - type:reference
  - audience:ai-agent
  - maturity:draft
links:
  - { rel: sonnet-report, href: ../../council/sonnet-turn.md }
  - { rel: virtual-opus-audit, href: ../pillar-0-governance/virtual-opus-audit.md }
  - { rel: core-manifest, href: ../pillar-0-governance/csps-core-manifest.md }
  - { rel: platform-dna, href: ../pillar-0-governance/csps-platform-dna.md }
  - { rel: core-spines-dir, href: ../../../.claude/core-spines/ }
---

# Opus SROF Review — Schema & Core Spines Architecture
## Prepared by Sonnet S027 | Governor Directive | Not yet Opus-reviewed

> **For Opus:** This document was prepared after a Governor directive asking for a deep
> architectural review before implementation. Two questions are in scope:
> (1) Is "schema as main point of reference" a realized intention or aspirational?
> (2) Is the L1/L2/L3 Core Spine graduation complete, stable, and scalable?
>
> Sonnet consulted the Virtual Opus Audit patterns (patterns 1-9) while writing.
> **Sonnet's PE judgment is included.** Opus should validate or override.
> Each section ends with 15 expert questions Sonnet cannot answer alone.

---

## PART A — The Schema as Platform Reference

### A.1 — What Was Intended

The Governor's vision, as stated in `csps-core-manifest.md` and across governance files:

> *"ZModel as the schema source of truth"* — line 142 of csps-core-manifest.md
> *"canonical home is a SCHEMA field where possible"* — audit-runner slug `canonical-home-field-declaration-coverage`
> *"every governed artifact declares: `schema_anchor: <table-id>`"* — csps-core-manifest.md §frontmatter-convention

The intention was that the **schema** — specifically the database schema (ZModel) and the frontmatter schema — would serve as the primary organizing reference for the entire platform. Every artifact would declare which schema table it belongs to (`schema_anchor:`). Every piece of documentation would be anchored to a schema node. Schema = navigational backbone.

Concretely:
- Platform artifacts → frontmatter with `schema_anchor:` → navigate to schema table → understand the artifact's domain
- Database entities (ZModel) → the ground truth for what data the platform manages
- `packages/schemas/` → TypeScript type exports shared across apps
- `tools/templates/priority-engine.schema.yaml` → PE schema governs priority computation

This was an ambitious vision: schema as the single reference that everything points into.

---

### A.2 — What Was Actually Built (Evidence-Based)

**Good news — frontmatter schema is the best-implemented layer:**

`validate-frontmatter.mjs` enforces closed-enum fields across all governed artifacts. `frontmatter-closed-enums.md` is the cognitive reference. The `schema_anchor:` field is declared as REQUIRED in frontmatter convention. **This layer works.**

However, the *full schema-as-reference vision* has four distinct meanings in the codebase, and they have been conflated:

| Schema type | Location | Status |
|---|---|---|
| **A: Database schema** (ZModel / Prisma) | `packages/database/schema.zmodel` | **NOT FOUND** — `packages/database/` doesn't exist as a package |
| **B: Frontmatter schema** (closed enums) | `validate-frontmatter.mjs` + `frontmatter-closed-enums.md` | ✅ Active — 92 validators include this |
| **C: Connectivity field** (`schema_anchor:`) | Frontmatter of every governed artifact | ⚠️ Partial — 43 of 93 checked artifacts are orphans (no `core_spine` + `schema_anchor`) |
| **D: Platform schemas** (TypeScript/YAML) | `packages/schemas/` (intake-event.ts) + `tools/templates/priority-engine.schema.yaml` | ⚠️ Sparse — only 2 files; most tool schemas are ad-hoc inline |

**Critical gap — the database schema is missing from where it should be:**

`csps-core-manifest.md` declares "ZModel as the schema source of truth" as a CORE (universal, undebatable) principle of the ARCH spine. But `packages/database/` contains only: `catalog`, `glossary`, `principles`, `principles-mcp`, `schemas`, `skills` — **no ZModel file**. The Budget Planner app at `apps/budget-planner/` likely has its own schema but it's not in the declared canonical location.

This means the most fundamental architectural commitment — ZModel as schema SSoT — has no canonical home.

---

### A.3 — The Orphan Problem: 43 Artifacts After 27 Sessions

`validate-nothing-stands-alone.mjs` runs on every `pnpm verify` and reports:

```
[validate-nothing-stands-alone] governed_checked=93 orphans=43
→ Advisory: backfill core_spine + schema_anchor on these artifacts in S012
→ Track in architecture-pending vault: 43 artifacts need connectivity
```

S012 was many sessions ago. The orphan count has not moved. This reveals a structural problem: the validator fires as **advisory**, backfill was assigned to a future session, and that session never completed it. The exit_code=0 means pnpm verify passes despite 43 orphans.

**Why it hasn't been fixed:**
- The validator is advisory (not blocking)
- There is no session with "fix 43 orphans" as a high-PE mandate
- Each session adds new artifacts that start connected, so the % improves, but the absolute count stays high

**The deeper problem the orphans reveal:**
The `schema_anchor:` field was defined to mean "which schema governs this artifact." But the schema anchor VALUES are almost meaningless right now:
- 43 artifacts use `pillar_0_governance_leaves` (a tag, not a schema reference)
- 2 use `platform_governance`
- 1 uses `schema_index`

None of these point to an actual schema **table** or schema **type definition**. `pillar_0_governance_leaves` doesn't resolve to anything machine-readable. The connectivity field exists as frontmatter but doesn't connect to anything real.

---

### A.4 — The Canonical-Home Problem

63 references to "canonical home" across `pillar-0-governance`. Each artifact declares its own canonical status inline. **There is no index of canonical homes.**

The audit slug `canonical-home-field-declaration-coverage` would enforce "canonical home is a SCHEMA field where possible" — but it has been week-4 deferred since S009. It was never built.

Without this validator, two artifacts can simultaneously claim to be the canonical home for the same concept. Example found: `csps-platform-dna.md §1` declares Element 3 (SCHEMA) has two homes: `frontmatter-closed-enums.md` AND `tag-status-contract.md`.

The intention was: **schema_anchor resolves to a schema record, and that schema record IS the canonical home**. The execution was: `schema_anchor:` is a string label with no resolution mechanism.

---

### A.5 — What Is vs. What Should Be

| Intended state | Actual state | Gap |
|---|---|---|
| ZModel as database SSoT, all entities declared | No canonical ZModel location; apps have local schemas | HIGH — foundational ARCH CORE commitment unmet |
| `schema_anchor:` points to a schema table | `schema_anchor:` is a string label with no resolution | HIGH — connectivity field is decorative, not functional |
| 0 orphan artifacts (connected = governed) | 43 orphans after 27 sessions (advisory, never fixed) | MEDIUM — validator fires but doesn't block |
| Canonical homes indexed in one place | 63 scattered canonical claims, no index | MEDIUM — B_CONSOLIDATION_PASS can't check |
| `canonical-home-field-declaration-coverage` validator | Week-4 deferred since S009 (never built) | MEDIUM — key enforcement gap |
| `packages/schemas/` = TypeScript types for all platform data | Only `intake-event.ts` exists | LOW — only one type defined |
| Schema as navigation backbone for all artifacts | Schema as frontmatter decoration | HIGH — vision not achieved |

---

### A.6 — Sonnet's Consolidation Proposals (PE-scored)

**Proposal A-1 (PE=75):** Establish a real `schema-registry.md` — a single governed artifact that defines all valid `schema_anchor:` values, what each resolves to (documentation file, ZModel entity, or TypeScript type), and which artifacts reference each anchor. This replaces 63 scattered canonical claims with one navigable index. `validate-nothing-stands-alone.mjs` upgraded to check anchor resolution.

**Proposal A-2 (PE=70):** Decide the database schema canonical location — either `packages/database/schema.zmodel` (as declared in csps-core-manifest) or `apps/*/schema/` per-app. This is a constitutional ARCH decision requiring Opus ratification. Without resolution, the ARCH CORE's most important commitment is unenforceable.

**Proposal A-3 (PE=60):** Build `canonical-home-field-declaration-coverage` validator (week-4 deferred since S009). This is the mechanical gate that enforces "schema is canonical home." Without it, B_CONSOLIDATION_PASS relies entirely on AI cooperation.

**Proposal A-4 (PE=55):** Promote `nothing-stands-alone` from advisory to blocking for NEW artifacts (ratchet pattern — don't require fixing 43 existing; prevent new ones). Current weekly growth rate of new unconnected artifacts is unknown but likely non-zero.

**Sonnet judgment (Pattern 5 — Hybrid):** The database schema decision (A-2) cannot be Sonnet's alone. It touches the ARCH CORE (L1 sealed). Opus must decide: is "ZModel as schema source of truth" still the right commitment given the platform is evolving toward multi-app architecture where each app might own its schema?

---

### A.7 — 15 Expert Questions (Schema)

1. Is "ZModel as the schema source of truth" still the right ARCH CORE commitment when moving to 30 apps with potentially different data models? Should L1 say "each app owns its schema, platform provides the schema pattern" instead?

2. What does `schema_anchor: pillar_0_governance_leaves` actually resolve to? Is it a schema node, a category tag, or just a label? If it's just a label, what would a real anchor look like?

3. Should `schema_anchor:` reference (a) a ZModel entity, (b) a TypeScript type, (c) a documentation section, or (d) all three depending on artifact type? Is there a protocol for each?

4. 43 orphans have persisted for ~15 sessions. Is the advisory classification wrong — should this be blocking for new artifacts while pre-existing orphans stay advisory? Or is there a systemic reason the backfill keeps getting deprioritized?

5. Should `packages/schemas/` be the TypeScript type layer that all apps import, making it the schema SSoT at the code level (not ZModel)? ZModel generates Prisma; Prisma generates types; but `packages/schemas/` could re-export curated types for cross-app use.

6. The `canonical-home-field-declaration-coverage` validator has been deferred since S009 (many sessions). What specifically made it hard to implement? Is there a design problem in the concept itself?

7. When two artifacts both claim to be the canonical home for the same concept (like Element 3 SCHEMA having two homes), which one wins? Is there a tiebreaker protocol?

8. If `schema-registry.md` is created as the index of canonical homes, should it be machine-readable (YAML) or human-readable (markdown table)? What consumes it — validators, AI CONCEPT_LOAD, or both?

9. The platform has no database schema in `packages/database/`. Does the Budget Planner's schema live in `apps/budget-planner/prisma/` or somewhere else? Where is the actual ZModel file right now?

10. Should `schema_anchor:` be typed against the schema registry (validated enum), or is free-text acceptable with a resolver? The current implementation is free-text with no resolver — this is the root of the orphan problem.

11. The `packages/schemas/` TypeScript layer currently has only one file (`intake-event.ts`). Is this the right home for cross-app shared types (like `TenantId`, `UserId`, `AuditEvent`)? Who added intake-event.ts and why only that one?

12. Should the schema-as-reference vision be narrowed to "frontmatter schema governs governance artifacts" and "ZModel governs data entities" with no attempt to unify them? The current vision spans both, creating conflation.

13. How should cross-spine artifacts (artifacts that span GVRN + ARCH + VALD) declare their `schema_anchor:`? Should they have one anchor or multiple?

14. The virtual-opus-audit.md has no pattern specifically about "schema as reference." Should this be added as Pattern 10? What would that pattern say?

15. If every artifact has a `schema_anchor:` and every schema anchor resolves to a schema node, and every schema node has a validator — does this create a directed graph of dependencies? Is that the intended architecture, and if so, who owns that graph?

---

## PART B — Core Spines: L1/L2/L3 Graduation Audit

### B.1 — What Was Designed (The Full Model)

The Core Spine model has a **layered universality** architecture:

```
L0: csps-core-manifest.md
    ↓ (declares spines exist + sets CORE for each)
L1: 5 sealed files (L1_CORE_{SPINE}.md) — ~50 lines each
    Universal, undebatable; amendment = ADR + ratification
    "Sealed prose only — every word load-bearing"
    ↓
L2: 16 domain files (L2_DOMAIN_{SPINE}_{DOMAIN}.md) — ~58 lines each
    Operational decomposition; normal PCR review
    Each has: parent_l1_doctrine + domain scope + validators + composition
    ↓
L3: 5 instance files (L3_INSTANCES_{SPINE}.md) — ~60 lines each
    Registry of artifacts declaring that spine as primary
    Should be auto-populated by scanner script (never built)
    ↓
(csps-core-manifest.md also defines L4/L5 outward layers not represented in files)
```

**The outward universality principle (Governor's intent):**
- L1 is universal to everything below it
- L2 is "universal within its domain" — it applies to all instances
- L3 is specific instances that instantiate L2 principles
- Each level is universal to the level directly below it
- Moving outward = increasing specificity + decreasing universality

**The 5-spine structure:**

| Spine | Governs | L2 Domains | CORE summary |
|---|---|---|---|
| GVRN | Self-governance, authority, ratification | 3 (DECISION_RIGHTS, ACCOUNTABILITY, AMENDMENT) | Who decides what, by what authority |
| ARCH | Data, code, schema, structure | 4 (COMPOSITION, LAYER_SEPARATION, STRUCTURAL_INTEGRITY, TRACEABILITY) | How the system is built |
| AI | AI behavior, inner-defaults, alignment | 3 (ALIGNMENT_PROTOCOL, COGNITIVE_CONTEXT, INNER_DEFAULTS_OVERRIDE) | How AI acts within the platform |
| OPER | Operations, pace, workflow | 3 (PACE_DISCIPLINE, REALITY_GROUNDING, WORKFLOW_INTEGRITY) | How work is executed |
| VALD | Validation, evidence, ZF discipline | 3 (COVERAGE_DISCIPLINE, EVIDENCE_SPECIFICITY, RESULT_DRIVEN_VERIFICATION) | How correctness is proven |

---

### B.2 — What Was Actually Built (Evidence-Based)

**`validate-corespine-depth-markers.mjs` output:**
```
checked=26 l1_core=5/5 l2_domain=16 l3_instances=5 errors=0 warnings=0
```

All 26 files exist. All 5 L1 files pass the sealed-doctrine check. The structural skeleton is intact.

**What works well:**

1. **L1 files are genuinely sealed** — each has `sealed_text_only: true`, `do_not_expand:` constraints, and an amendment protocol. The L1 for GVRN is exemplary: 6 paragraphs, no examples, no cross-references, pure principle. L1 is the best-executed layer.

2. **L2 files have proper structure** — each has `parent_l1_doctrine:` link, `domain:` declaration, operational governance surfaces, per-domain validators, and a composition section. The L2_DOMAIN_GVRN_DECISION_RIGHTS_CLARITY file demonstrates the intended depth.

3. **The 16 L2 files cover all 5 spines** with consistent domain naming (spine_domain convention) and consistent depth (~58 lines).

4. **L0 (csps-core-manifest.md)** is substantial — it defines CORE for each spine and describes the outward layer model (L1→L5 for GVRN; similar for others).

---

### B.3 — What Is Incomplete or Broken

**Gap 1 (Critical): L3 instance registries are manually maintained and stale.**

All 5 L3 files say:
> "Auto-populated by `tools/scripts/instance-registry-populator.mjs` scanning corpus for `core_spine: X` declarations (script implementation deferred week-4)."

`tools/scripts/` contains only `process-learning-loop.mjs`. **The populator was never built.**

L3 is supposed to be the live index of every artifact that belongs to each spine. Without the populator, L3 reflects manually-added entries from S006 — now many sessions out of date. The platform has grown from ~30 governed artifacts to 93+, but L3 still lists ~5-10 per spine from S006.

**What this means:** The Core Spine model's bottom layer is frozen in time. Any Opus turn that reads L3 to understand "what exists in the GVRN spine?" will see a fraction of reality. The navigation promised by the model doesn't work for L3.

**Gap 2 (Significant): The L4/L5 outward layers in csps-core-manifest don't have corresponding files.**

`csps-core-manifest.md` describes 5 outward layers for each spine:
- L1 Per-pillar AI-behavior rules (AGENTS.md cascade)
- L2 Per-skill AAP frontmatter
- L3 Per-feature template selection
- L4 Per-app governance overlays
- L5 Per-customer-tier gating

But `.claude/core-spines/` only has files for L1, L2, L3. L4 and L5 don't exist as files. The model describes a 5-layer outward architecture; the implementation has 3 layers.

This matters because: as we build 30 apps, L4 (per-app governance overlays) will be needed. There's no defined home for app-specific spine modifications. Each app will either (a) declare inline ad-hoc rules (no canonical location) or (b) wait for L4 to be defined.

**Gap 3 (Significant): Precedence is declared but not enforced.**

`B_CORE_SPINE_DISCIPLINE` declares: **GVRN > VALD > ARCH > AI > OPER** (higher = wins conflicts). This means if VALD says "must verify before claiming done" and OPER says "skip verification for speed," VALD wins.

But there is no `spine-precedence-conflict-detector` running. The validator is registered (`spine-precedence-conflict-detector` in B_CORE_SPINE_DISCIPLINE description) but week-4 deferred. Conflicts between spines are currently resolved by AI judgment.

**Gap 4 (Moderate): `core_spine:` (singular) vs `core_spines:` (plural) confusion.**

`csps-core-manifest.md §frontmatter-convention` says:
- `core_spine:` singular = REQUIRED (primary owner)
- `core_spines:` plural = optional (cross-cutting list)

Backward compatibility note: "existing CSPS artifacts with only `core_spines:` plural are grandfathered until L4 sweep."

The L4 sweep never happened. Many artifacts still have only `core_spines:` plural without the singular `core_spine:`. The validator `corespine_layer_compliance` checks "core_spine: value ∈ canonical 5-set" but may not flag artifacts missing the singular field entirely.

**Gap 5 (Important): L2 domain files don't reference their L3 instances.**

L2 files have `parent_l1_doctrine:` (up-link to L1). L3 files have `parent_l1_doctrine:` (also up-link to L1). But L2 files have **no down-link to L3**. The hierarchy is: L1 ← L2 ← L3 (each points up, nothing points down).

This means navigation is unidirectional. You can trace from L3 "up" to L2 to L1. But you cannot start at L2 and navigate "down" to see all L3 instances in that domain. L3 should be the live answer to "what are all instances of L2_DOMAIN_GVRN_DECISION_RIGHTS_CLARITY?" — but without the populator, L3 is static and the L2→L3 navigation doesn't work.

**Gap 6 (Important): The graduation principle isn't formally stated anywhere as a testable rule.**

The Governor articulated it clearly: "L1 is universal, L2 is universal within its domain, L3 is specific; moving outward = more specific but still universal toward the next level." This principle is beautiful and important. But it's not written anywhere as a governance rule that validators can check.

What would violate the graduation principle?
- A validator in L3 that contradicts an L1 sealed principle (L3 contradicts L1)
- An L2 domain that adds a CORE-level undebatable principle (L2 expanding into L1 territory)
- An L3 instance that applies to ALL contexts, not just its domain (instance claiming universality)

`validate-spine-hierarchy.mjs` was registered in the master plan (PE=67 for S028) to catch "L3 instances cannot contradict L1 sealed definitions." But it doesn't yet exist.

---

### B.4 — The Graduation Completeness Map

| Spine | L1 | L2 domains (count) | L2 quality | L3 (stale?) | L4/L5 |
|---|---|---|---|---|---|
| GVRN | ✅ Sealed | 3 ✅ | Good — has validators, composition | Stale (S006) | ❌ Not defined |
| ARCH | ✅ Sealed | 4 ✅ | Good — TRACEABILITY domain is excellent | Stale (S006) | ❌ Not defined |
| AI | ✅ Sealed | 3 ✅ | Good — COGNITIVE_CONTEXT maps to P-META-009 | Stale (S006) | ❌ Not defined |
| OPER | ✅ Sealed | 3 ✅ | PACE_DISCIPLINE is strong; REALITY_GROUNDING needs work | Stale (S006) | ❌ Not defined |
| VALD | ✅ Sealed | 3 ✅ | EVIDENCE_SPECIFICITY is the strongest L2 file | Stale (S006) | ❌ Not defined |

**L2 missing domains (Sonnet's assessment):**
- GVRN: no domain for PRINCIPLE_REGISTRY (principles.yaml is GVRN-owned but no L2 governs it)
- ARCH: no domain for SCHEMA_GOVERNANCE (ZModel + schema_anchor + schema registry — the whole schema problem lives here)
- AI: no domain for BEHAVIORAL_ENFORCEMENT (how B_* contracts are enforced — the enforcement-coverage.md is AI-owned but no L2 domain)
- VALD: no domain for CONTINUOUS_MONITORING (health dashboard, per-session vs. per-PR vs. per-week cadence)
- OPER: no domain for ZERO_LAPTOP_DEPENDENCY (P-OPER-001 exists but no L2 domain for operational environment)

---

### B.5 — Sonnet's Consolidation Proposals (PE-scored)

**Proposal B-1 (PE=78, constitutional): Build `instance-registry-populator.mjs`.**
This is the single highest-value item for the spine model. Every other spine problem is secondary. The script is straightforward: scan corpus for `core_spine:` declarations, group by spine and L2 domain, write L3 files. ~60 lines of Node.js. Unblocks the entire L3 layer.

**Proposal B-2 (PE=72): Add L2 domain for ARCH-SCHEMA_GOVERNANCE.**
The schema problems in Part A have no L2 home. Creating `L2_DOMAIN_ARCH_SCHEMA_GOVERNANCE.md` gives the schema-as-reference vision a canonical domain, a set of validators, and a composition note. Connects to: ZModel SSoT, schema_anchor resolution, canonical-home index.

**Proposal B-3 (PE=67): Build `validate-spine-hierarchy.mjs`** (already in master plan PE=67 for S028).
Checks that L3 instances don't contradict L1 sealed definitions. This is the mechanical enforcement of the graduation principle. Without it, the graduation is governance aspiration, not structural guarantee.

**Proposal B-4 (PE=60): Define L4 schema for per-app governance overlays.**
As apps are built, L4 will be needed. Defining L4 now as a governance artifact type (with frontmatter template) prevents ad-hoc per-app rules that bypass the spine model. L4 = "inherits L1-L3, overrides OPER spine only for specific operational contexts within this app."

**Proposal B-5 (PE=55): Add down-links from L2 to L3** — L2 files should declare `l3_instances_file: ./L3_INSTANCES_{SPINE}.md` so navigation works both directions. Simple frontmatter addition.

**Proposal B-6 (PE=50): Write the graduation principle as a formal testable rule** in a new `docs/plan/pillar-0-governance/spine-graduation-principle.md`. State explicitly: what validates universality at each level, what constitutes a violation, how to test whether a new artifact is at the right level. This is L1-adjacent governance (GVRN CORE), so it needs Governor ratification.

**Sonnet judgment (Pattern 6 — Constitutional):** Proposals B-1 and B-2 are non-constitutional — they don't touch L1 content. Proposals B-3 and B-6 are constitutional-adjacent — B-3 validates L1 content; B-6 defines what L1 means. Both require Governor ratification before Sonnet implements.

---

### B.6 — 15 Expert Questions (Core Spines)

1. The instance-registry-populator.mjs was planned in S006 and is still not built after 21 sessions. What specifically blocked it — complexity, priority, or something else? Is there a simpler approach (a one-shot scan script, not a recurring validator) that would produce the same result faster?

2. L3 instance registries are currently hand-curated lists from S006. They contain maybe 5-10 entries per spine while the actual corpus has 93+ governed artifacts. When Opus reads L3 to understand what belongs to the ARCH spine, is the stale data harmful enough to warrant an emergency one-shot scan today?

3. `csps-core-manifest.md` defines L4/L5 outward layers (per-app, per-customer-tier) but no L4/L5 files exist. When the Budget Planner needs app-specific governance, where does it declare it? Is the answer "inline in the app" or "wait for L4 to be formally defined"?

4. The graduation principle (L1 universal → L5 specific; each level universal to the one below) — is this principle itself at L1 level (GVRN CORE, undebatable) or at L2 level (GVRN domain, amendable)? Currently it's implied by the file structure but not declared as a principle anywhere.

5. The ARCH spine has 4 L2 domains but no domain for SCHEMA_GOVERNANCE. ZModel, schema_anchor, canonical homes — all ARCH concerns — are scattered across pillar-0-governance without a L2 domain anchor. Should SCHEMA_GOVERNANCE be a 5th ARCH L2 domain?

6. `spine-precedence-conflict-detector` is deferred. Can Sonnet give an example of a real conflict that would fire? Is there currently a live conflict in the platform where two spines are giving contradictory instructions and no one has noticed?

7. The 43 orphan artifacts have `core_spine:` missing or `schema_anchor:` missing. Is there a pattern to which artifacts are orphans? Are they all from a specific session range, a specific type, or a specific pillar? Knowing the pattern would make the backfill targeted rather than exhaustive.

8. L2 files have composition notes (how they interact with other L2 domains). Are there any L2 compositions that are wrong or missing? For example: does AI-COGNITIVE_CONTEXT correctly reference ARCH-TRACEABILITY as the mechanism for QG3 (re-read edited files)?

9. The 5-layer outward model in csps-core-manifest differs by spine. GVRN describes governance overlays; ARCH describes code patterns; AI describes behavior composition. Are these parallel enough that a single L4 template works for all spines, or does each spine need its own L4 structure?

10. L1 files are ~50 lines each. Is 50 lines the right constraint? Could some L1 principles be under-specified at 50 lines (missing a nuance that would matter at 30 apps) or over-specified (encoding something that might need to change)?

11. There are currently 16 L2 domain files. The Sonnet analysis suggests 5 missing domains (PRINCIPLE_REGISTRY, SCHEMA_GOVERNANCE, BEHAVIORAL_ENFORCEMENT, CONTINUOUS_MONITORING, ZERO_LAPTOP_DEPENDENCY). Does Opus agree with this list? What is the risk of adding 5 L2 domains — is there a risk of over-governing?

12. The graduation principle says L3 instances cannot contradict L1. But L3 instances CAN be more specific than L1. What's the test for "this is more specific" vs "this contradicts"? Is there a formal protocol for adjudicating this?

13. When a new principle (P-META-*, P-ARCH-*) is created, it should belong to an L2 domain of an appropriate spine. But `principles.yaml` doesn't declare `core_spine:` per principle — principles are just YAML entries. Should each principle entry have `spine:` and `l2_domain:` fields, linking back to the spine model?

14. The AI spine has no L2 domain for BEHAVIORAL_ENFORCEMENT. This means the enforcement-coverage.md, the behavioral detectors (SP-001..007), and the Drive Don't Fight architecture are all AI-owned but have no L2 home. Is this a real gap or is AI-INNER_DEFAULTS_OVERRIDE domain sufficient to cover enforcement?

15. The platform's quality promise is "1 bedrock → 30 apps." Does the Core Spine model scale to 30 apps? Specifically: at 30 apps, each with L4 governance overlays, will the precedence rule (GVRN > VALD > ARCH > AI > OPER) still resolve conflicts unambiguously, or will L4 overrides create edge cases the model wasn't designed for?

---

## PART C — The Connection: Schema Anchors to Spine Domains

### C.1 — The Missing Link

The schema_anchor field and the Core Spine model were designed to work together:
- `core_spine:` says which spine OWNS this artifact
- `schema_anchor:` says which SCHEMA TABLE the artifact's data belongs to

But the two systems evolved independently:
- L3 instance files list artifacts by spine (GVRN/ARCH etc.) but don't use `schema_anchor:` values
- `schema_anchor:` values (`pillar_0_governance_leaves`, `platform_governance`) don't correspond to L2 domain names
- There is no mapping: "L2 domain X → schema anchor values Y1, Y2, Y3"

**The intended connection:** An artifact's `core_spine: GVRN` + `schema_anchor: governance_decisions` should put it in the GVRN spine under a specific schema table. The L3 populator should scan for this combination and place the artifact correctly. Without the mapping and the populator, the two fields are parallel metadata that never compose.

### C.2 — Consolidation Opportunity

The single biggest compound improvement:

```
1. Define schema-registry.md (Part A proposal A-1)
   → maps schema_anchor values to: spine, L2 domain, canonical home file

2. Build instance-registry-populator.mjs (Part B proposal B-1)
   → scans corpus for core_spine: + schema_anchor:
   → uses schema-registry.md to place in correct L2 domain
   → writes L3 files automatically

Result: schema_anchor + core_spine COMPOSE to auto-populate L3
Both fields become meaningful instead of decorative
43 orphan problem → detectable + fixable automatically
Canonical homes become navigable via schema-registry.md
```

This is the compound return: two deferred items (schema registry + L3 populator) combine into one architectural fix that makes the schema-as-reference vision real.

---

## Sonnet → Opus: What I Need From This Review

**Sonnet's judgment on what to build first, before Opus responds:**

PE ordering for the compound fix:
- A-1 + B-1 combined: PE=82 (builds schema-registry + populator in one session, unlocks both Part A and Part B)
- B-3 (validate-spine-hierarchy): PE=67 (already in master plan S028)
- A-2 (database schema canonical location): PE=70 (constitutional ARCH CORE, needs Opus decision)
- B-2 (ARCH-SCHEMA_GOVERNANCE L2 domain): PE=65 (depends on A-2 decision)

**The three decisions Sonnet cannot make without Opus:**

1. **Is ZModel still the database schema SSoT?** — The ARCH CORE says yes. But `packages/database/` doesn't exist as a package. Either the ARCH CORE needs amendment, or the implementation needs to catch up. Both require Opus ratification.

2. **Should graduation principle be L1 GVRN CORE?** — If yes, it's unchangeable without ADR. If no, it can be amended. This is a constitutional scope question (Virtual Opus Audit Pattern 6).

3. **5 missing L2 domains — add or don't?** — Adding 5 L2 domains expands the model significantly. Is there a risk of over-governing? Opus has Pattern 1 ("add only when real") — do real use cases exist for these 5 domains right now?

---

**SROF request number:** SROF-008 (pending Governor approval to send)
**Git state at preparation:** commits a4fd49b, 84f6a6a, 6a26b64, f4f1cc9 (all S027)
**Validators at preparation:** 92 active | pnpm verify exit_code=0 | 79% health
