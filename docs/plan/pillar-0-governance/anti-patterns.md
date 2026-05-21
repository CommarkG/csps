---
id: csps.governance.anti-patterns
name: anti-patterns
description: "CSPS registered anti-patterns — failure modes that have been formally named, described, and have mechanical prevention. A new anti-pattern is registered when the same class of failure recurs twice (K=2). AP-001 is the founding entry."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
batch: BATCH-A
template_depth: L2
parent_template: governed-artifact-frontmatter
diataxis_type: reference
csps_core_reminder: [B_EXISTS_NOT_EQUALS_ACTIVE, B_STRUCTURAL_PREVENTION_DISCIPLINE, AP-001]
---

# CSPS Anti-Pattern Register

> Anti-patterns are failure modes that have been observed, named, and mechanically prevented.
> They are the negative complement to behavioral contracts: where a B_* contract says
> "always do X," an AP-NNN entry says "this class of mistake must never happen again."

---

## AP-001 — EXISTS ≠ ACTIVE

**Name:** The Existence-Equals-Activation Assumption
**First observed:** S046 Opus-4 Turn 15 — identified as the root cause underlying all governance gaps
**Scope:** S3 (Scope-3: permanent prevention required)

**The false assumption:**
> A governance artifact that exists somewhere in the CSPS repository is actively consulted
> by AI at runtime.

**The truth:**
Written artifacts are inert unless activated by exactly one of four mechanisms:
1. **T1 hook injection** — the content appears in hook output at the trigger event
2. **T2 validator execution** — the content is checked at commit time
3. **Session-open injection** — the content is delivered via session-open.sh
4. **DNA always_include** — the content is bundled into every AI context via dna-registry.yaml

A principle in principles.yaml (65 entries, NOT always_include) is **not active** unless
loaded explicitly. A behavioral contract in behavioral-contracts.md is **not active** unless
the session-open injects it. The existence of PRACE (M-27) in memory does NOT mean it is
consulted at every turn.

**Why this matters:**
This is the satisfaction point that allows governance gaps to persist across sessions.
AI and humans both assume governance works because artifacts exist. Sessions pass with
governance nominally "present" and actually absent.

**Diagnostic question:**
"Is this concept being enforced right now, in this session, by a hook or validator
that has already fired?" If no → it is not active, regardless of where it is written.

**Prevention (T1+T2+T3):**
- T1: session-open.sh injects this anti-pattern by reference in every AI context
- T2: validate-activation-coverage.mjs (S047 item) — checks that every B_* contract
  has at least one active enforcement mechanism (T1, T2, or DNA always_include)
- T3: This register is an always_include DNA component

**Related:** B_EXISTS_NOT_EQUALS_ACTIVE (behavioral contract, to be registered)
**Replaces false assumption in:** principles.yaml governance notes, PRACE philosophy,
  all session-open injection design discussions

---

## AP-002 — SAMPLE-TO-CORE CONTAMINATION

**Name:** Specific Example Embedded in Universal Pattern
**First observed:** S047/S048 — app-specific content (product names, demographics, personas) found in CSPS CORE files (universal-logic-framework/, csps-context.md, csps-platform-batches.yaml)
**Scope:** S3

**The pattern:**
When using a specific example to illustrate a universal concept, AI embeds the specific example INTO the universal artifact rather than referencing it from an app-specific directory.

**The rule:**
- Examples live in: `docs/plan/apps/[app-slug]/` or `docs/plan/_intake/`
- Universal patterns live in: `docs/plan/universal-logic-framework/` or `tools/config/`

These directories **MUST NEVER** contain: specific product names, market segment labels (e.g., "construction contractors"), specific demographic labels (e.g., "ADHD professionals"), or app-specific data passed off as universal examples.

**Why this matters:**
CSPS CORE must be vocabulary-agnostic and universal. When specific examples contaminate the core, every new AI instance that reads the core inherits a false assumption that CSPS is designed for a specific market. This is the opposite of what the core is for.

**Prevention (T1+T2+T3):**
- T1: none yet (S048 item)
- T2: validate-core-purity.mjs (S048) — scans universal framework files for proper nouns in example positions, demographic labels, product candidate names
- T3: This anti-pattern in anti-patterns.md (always_include: true)

**Related:** AP-001 (EXISTS≠ACTIVE), B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK

---

## AP-003 — CREATION WITHOUT MULTI-SCHEMA REGISTRATION

**Name:** Artifact Created in One Schema, Missing N-1 Others
**First observed:** S047/S048 — domain-tree + universal-framework pages launched without registration in page-data.js PAGES schema. Breadcrumbs fell back to path labels.
**Scope:** S3

**The pattern:**
Every artifact type in CSPS requires registration in multiple schemas simultaneously. Creating it in one schema without completing the others produces structural incompleteness — broken navigation, audit failures, and governance drift.

**Each artifact type's registration requirements:**
- `platform_page`: HTML links × page-data.js PAGES (K=2 → BLOCKING)
- `validator`: verify.mjs × audit-runner.md
- `hook`: settings.json × verify-hooks-functional.sh
- `skill`: template-registry.md × session-open.sh
- `behavioral_contract`: behavioral-contracts.md × audit-runner.md × AGENTS.md (3 schemas)
- `plan_item`: unified-plan.yaml × csps-platform-batches.yaml mapping

**The rule:**
`tools/config/artifact-schema-registry.yaml` (S048 build) is the single source for all schemas per artifact type. The T1 gate reads it and emits the full registration checklist at creation time.

**Prevention (T1+T2+T3):**
- T1: `pre-tool-use-schema-registration-gate.sh` — BLOCKING for platform_page (K=2), ADVISORY for others. Reads artifact-schema-registry.yaml, emits full checklist.
- T2: `validate-page-schema-consistency.mjs` (already LIVE, 85e307d)
- T3: This anti-patterns.md entry (always_include: true)

**Related:** AP-001 (EXISTS≠ACTIVE), AP-002 (sample-to-core), B_FIVE_SURFACE_ENGRAVING

---

## AP-004 — BINARY OPTION COLLAPSE

**Name:** The False Binary — collapsing a spectrum into an either/or
**First observed:** S049 — model routing decision (Sonnet-default vs Opus-default)
**Scope:** S3 (Scope-3: structural prevention required)

**What happened:** Governor presented a two-option situation: workspace defaults to Sonnet (cost-efficient) vs. workspace defaults to Opus (advisory quality). AI removed the Sonnet lock entirely (→ Opus default for all tabs) rather than finding the optimal composition: *Sonnet as workspace default + Opus manually selected per advisory tab only.*

**The failure pattern:**
```
Input:    "Option A or Option B?"
AI does:  Pick one → implement it fully
Should:   Ask "what's the optimal composition?" → find the gradient solution
```

**Class of failures this covers:**
- Any "lock vs unlock" decision where partial/conditional is the right answer
- Any "always vs never" rule where "only when X" is better
- Any "A model vs B model" where "A default + B manual" is the architecture
- Any infrastructure decision where context-sensitive routing beats a global setting

**Training default being overridden:** AI defaults to resolving ambiguity with a clean binary. Clean is not always right.

**Satisfaction point being prevented:** "I chose one option cleanly — the user will appreciate decisiveness." Wrong. A decisive wrong answer is worse than a nuanced correct one.

**The correct model routing architecture (ratified S049):**
```
workspace default (settings.json):  claude-sonnet-4-6[1m]  — cost-efficient builder, all new tabs
Opus advisory tab:                   Governor manually selects Opus in picker for that tab
Haiku (if used):                     Governor manually selects Haiku for fast/simple tasks
```
Rule: The workspace lock is a DEFAULT, not a prohibition. Per-tab manual override always works.
The MODEL IDENTITY CHECK (session-open.sh) makes the active model visible at session start.

**Prevention (T1+T2+T3):**
- T1: `user-prompt-submit-ai-profiler.sh` — CAQ MODE fires on 2+ diagnostic types. Scope-3 analysis required before acting. Binary collapse = Scope-1 thinking on a Scope-3 problem.
- T2: (pending) `validate-consolidation-debt.mjs` — checks canonical-concepts-registry.yaml for SSoT violations that often emerge from binary collapses (e.g., "removed the model line" creates a new undocumented default)
- T3: This anti-patterns.md entry + session-open MODEL IDENTITY CHECK block

**Related:** AP-001 (EXISTS≠ACTIVE), B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS, CAQ Framework (Rule 15)

<!-- @core-seed: BEHAVIOR_PATTERN_REGISTER | plan: anti-patterns (docs/plan/pillar-0-governance/anti-patterns.md) | grows-to: formal register of AI behavior patterns with triggers + satisfaction points (currently in discipline matrix — needs dedicated register format) | target: S052 -->
<!-- planted_by: S047 -->
<!-- pmi_gate: DOG-FOOD-AUDIT -->
<!-- deprecated: false | missed_target: S048 | rescheduled: S052 | reason: target missed 3 sessions; still valid but deprioritized; moved to S052 intake -->
<!-- S050 review: seed is valid (behavior patterns register is needed) but low urgency vs shard + activation coverage work. Keeping alive, rescheduling to S052. -->
