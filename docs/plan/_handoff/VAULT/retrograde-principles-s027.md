---
id: csps.handoff.vault.retrograde-principles-s027
name: retrograde-principles-s027
description: >
  If we knew then what we know now — principles extracted retrograde from S027 session
  that would have permanently prevented recurring platform problems. Each principle
  includes: what it prevents, where it belongs in CSPS, its PE score, and how to
  make it mechanically active. ZF-verified against current platform state.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, VALD, OPER]
schema_anchor: opus_consultations
diataxis_type: explanation
session: S027
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:draft
links:
  - { rel: opus-srof, href: ./opus-srof-schema-and-spines-review.md }
  - { rel: csps-platform-dna, href: ../pillar-0-governance/csps-platform-dna.md }
  - { rel: virtual-opus-audit, href: ../pillar-0-governance/virtual-opus-audit.md }
---

# Retrograde Principles — S027 Session Extraction

> **Governing question:** If we knew all we know now, what principles could we have
> defined that would permanently prevent the recurring problems found this session?
> ZF cycle run: pnpm verify exit_code=0 ✅ | DNA count corrected 13→17 ✅

---

## Pattern recognition from this session

Seven recurring problem classes were discovered this session. Each has produced failures
across multiple sessions. Each has a principle that would prevent it if ratified:

```
Problem A: Deferred-forever ("week-4" items never ship)
Problem B: Count drift (description says N, content has M)
Problem C: Decorative fields (field exists, resolves to nothing)
Problem D: Manually maintained indexes (become stale; generators never built)
Problem E: Architecture declared before implemented (CORE principle with no evidence)
Problem F: Multi-topic prompts lost (Threshold classifies shape, not content)
Problem G: Quick creation without checking what exists (B_CONSOLIDATION_PASS bypassed)
```

Each produced real platform damage this session. Each has a PE-scored principle below.

---

## The 7 Retrograde Principles

---

### RP-001 — WEEK-4 IS A COMMITMENT, NOT A METAPHOR
**What it prevents:** Deferred-forever anti-pattern — items registered atomic, never built.
**Problem class:** A
**Evidence of failure:** `instance-registry-populator.mjs` deferred since S006 (21 sessions).
`canonical-home-field-declaration-coverage` deferred since S009 (18 sessions).
`nothing-stands-alone` orphans assigned to S012 backfill — still 43 orphans at S027.

**The principle:**
Every artifact tagged `week-4` or `deferred` MUST declare: `deferred_target_session: S<NNN>`.
When that session passes without implementation, the artifact's `enforcement_stage` auto-escalates
to `OVERDUE` and appears in pnpm health as a ❌ (not ⚠️). The AI CANNOT claim pnpm health
is clean while OVERDUE items exist. After 3 sessions: escalates to Opus for review.

**Where it belongs:** P-META-??? (new principle) + `validate-deferred-target-session.mjs`
**Placement in CSPS:**
- `GVRN L2 AMENDMENT_DISCIPLINE` domain (commitments must close)
- `frontmatter-closed-enums.md` → add `deferred_target_session:` field
- `pnpm health` QH-??? question: "All deferred validators have target sessions?"
- B_STRUCTURAL_PREVENTION_DISCIPLINE already covers this conceptually — but has no mechanical trigger

**PE: 75** | **Spine: GVRN** | **Requires:** Opus constitutional review (modifies enforcement_stage enum)

---

### RP-002 — BODY COUNT MUST MATCH FRONTMATTER COUNT
**What it prevents:** Count drift — description says "13 elements," file has 17.
**Problem class:** B
**Evidence of failure (ZF-confirmed):** `csps-platform-dna.md` had 4 different counts
(13/15/16/17) simultaneously. Fixed S027 but the structural cause remains.

**The principle:**
Any frontmatter field that declares a count (e.g., `description: "17 DNA elements"`,
`total_count: 57`, `validators: 88`) MUST be mechanically verified against the actual
body count. A validator scans description + named count fields, extracts numbers, compares
to actual item counts (table rows, list items, YAML entries). Drift = BLOCKING.

**Where it belongs:** `validate-frontmatter-count-consistency.mjs`
Add to `validate-frontmatter.mjs` as a new check module. Runs PR + per-session.

**Specific counts to check:**
- `csps-platform-dna.md`: "17 DNA elements" → count `§1` table rows
- `principles.yaml`: `total_count: N` → count actual entries
- `behavioral-contracts.md`: count contracts in description vs. actual sections
- `audit-runner.md`: slug count in description vs. table rows
- `enforcement-coverage.md`: "N live validators" → count ✅ entries

**PE: 70** | **Spine: VALD** | **Requires:** Sonnet implementation (no constitutional change)

---

### RP-003 — FIELDS THAT DON'T RESOLVE ARE DECORATION
**What it prevents:** Decorative fields — `schema_anchor:` exists but resolves to nothing.
**Problem class:** C
**Evidence of failure:** 43 artifacts use `schema_anchor: pillar_0_governance_leaves` —
a label that connects to no schema table, no TypeScript type, no canonical file.
`schema_anchor:` is required by governance but enforced by nothing. It connects to nothing.

**The principle:**
Every governance field that claims connectivity MUST have a resolver. `schema_anchor: X`
is only valid if `X` appears in `schema-registry.md` (to-be-built) as a known anchor.
Unknown anchors = ORPHAN. The validator checks the registry, not just field presence.
Pattern: **"If the field doesn't resolve, it doesn't govern."**

**Extension to other fields:**
- `core_spine: ARCH` → resolves to `.claude/core-spines/L1_CORE_ARCH.md` (currently working)
- `schema_anchor: X` → should resolve to schema-registry.md entry (currently: no resolver)
- `template_used: Y` → resolves to `tools/templates/Y.template.md` (partially working)
- `parent_l1_doctrine: Z` → resolves to L1 file (working)

**Where it belongs:** Upgrade `validate-nothing-stands-alone.mjs` to check resolution,
not just presence. Depends on `schema-registry.md` existing.

**PE: 72** | **Spine: ARCH** | **Requires:** schema-registry.md first (Proposal A-1 in opus-srof)

---

### RP-004 — INDEX ARTIFACTS ARE GENERATED, NEVER MAINTAINED
**What it prevents:** Stale manually-maintained indexes — L3 instance registries frozen at S006.
**Problem class:** D
**Evidence of failure:** All 5 L3 files say "auto-populated by populator (deferred week-4)."
`tools/scripts/` has zero populator script. L3 lists ~5-10 artifacts per spine; actual
corpus has 93+. Every navigation from L2 down to L3 lands in 2026-S006 context.

**The principle:**
Any artifact whose content is derived from scanning other artifacts MUST be auto-generated.
**Manual maintenance of derived content = guaranteed staleness.** The file should say:
`generated: true` in frontmatter. If the generator doesn't exist, the file's heading
should declare `⚠️ PARTIAL/STALE — generator not built`. Never claim auto-populated when manual.

**Corollary:** The audit-runner.md → audit-runner/ slice architecture is a positive
example of this principle working: the split is generated by `split-audit-runner.mjs`.
L3 should work the same way.

**Where it belongs:** RP-004 = operational principle for CSPS → P-OPER-??? (new)
**Placement:** `OPER L2 WORKFLOW_INTEGRITY` domain + `generated: true` frontmatter field
**Mechanical:** Pre-tool-use hook: if `generated: true` in frontmatter, BLOCK manual edits;
run generator instead.

**PE: 78** | **Spine: OPER** | **This is the L3 populator problem directly** | constitutional-adjacent

---

### RP-005 — CORE PRINCIPLES REQUIRE IMPLEMENTATION PROOF BEFORE SEALING
**What it prevents:** Architecture declared before built — "ZModel as schema SSoT" in ARCH CORE
with no canonical database package.
**Problem class:** E
**Evidence of failure:** `csps-core-manifest.md` L1 ARCH CORE: "ZModel as schema source of truth."
`packages/database/` doesn't exist as a ZModel package. The principle is sealed and undebatable.
The implementation doesn't exist.

**The principle:**
L1 sealing requires TWO conditions: (1) ratification by Governor, AND (2) proof of at least
one live mechanical enforcer. A principle that has no validator checking its implementation
is aspirational, not sealed. The amendment protocol should include: `implementation_evidence:
validate-X.mjs or manual-evidence: <link>` required before SEALED status.

**Special case for foundational architecture:** "ZModel as SSoT" was declared in S006
when the platform was 0 apps. Now at 1 app (Budget Planner), the principle needs
re-validation: is this still the right commitment? The sealing should come AFTER the
first app proves the principle works in practice.

**Where it belongs:** Amendment to `csps-core-manifest.md` §amendment-protocol (L1 level).
Requires Opus constitutional ratification. The amendment says: add `implementation_evidence:`
to L1 sealing checklist.

**PE: 80** | **Spine: GVRN + ARCH** | **Requires:** Opus (constitutional, modifies L1 sealing protocol)

---

### RP-006 — MULTI-TOPIC PROMPTS MUST BE DECOMPOSED BEFORE ACTING
**What it prevents:** Threshold classifying by shape (upload/URL/length) not content.
Multi-topic prompts treated as "Standard chat" → no routing, no vaulting, no crystallization.
**Problem class:** F
**Evidence of failure:** This session's Governor prompt had 7 distinct concerns. Intake hook
said "Standard chat." No concern was routed to raw-thoughts-queue automatically.
SP-003 comprehensive-response detector was built this session — but it detects the AI's
response; it doesn't help sort the input.

**The principle:**
Every prompt entering the system is implicitly multiple topics until proven otherwise.
The Threshold Step 0 should count: how many distinct action verbs + distinct noun-targets
appear in the prompt? If >2 topics: surface a routing table before the first tool call.
The routing table has: concern + spine + disposition (act/vault/escalate).

**The structural insight:** The problem is not AI failure — it's missing pipeline.
The intake hook fires once and classifies the whole prompt. What's needed is a
"concern extractor" that runs before CONCEPT_LOAD and outputs the multi-topic manifest.

**Where it belongs:** P-META-024 (new — Multi-Topic Intake Decomposition)
**Placement:** Threshold Step 0 (before crystallization) + new hook `UserPromptSubmit`
concern-extractor. Composes with validate-crystallization-bypass.mjs.

**Implementation approach:**
- Not a regex scanner (too brittle)
- AI self-declares: "I see N concerns in this prompt: [list]. Routing: [table]."
- This declaration is checkable by a new validator: does the response include a routing
  table when the prompt contains >2 action verbs?

**PE: 68** | **Spine: GVRN + AI** | **Requires:** Opus design review before implementation

---

### RP-007 — CONSOLIDATION CHECK IS MECHANICAL, NOT BEHAVIORAL
**What it prevents:** Quick creation without checking what exists (B_CONSOLIDATION_PASS bypassed).
**Problem class:** G
**Evidence of failure (self-caught):** This session created 4 validators without checking
whether `validate-universal-alignment.mjs` already covered the same ground as
`validate-dna-evidence.mjs`. Found they check different things — but only after the fact.
The behavioral contract B_CONSOLIDATION_PASS exists but fires on AI cooperation only.

**The principle:**
Before any `Write` to `tools/validators/`, `docs/plan/pillar-0-governance/*.md`,
`packages/principles/*.yaml`, or `.claude/core-spines/`: a pre-tool-use hook runs
a similarity check against existing artifacts. The check asks:
- Does a file with a similar name already exist?
- Does a governance slug matching this concept already appear in audit-runner.md?
- Does a principle or contract with similar trigger vocabulary exist in principles.yaml/behavioral-contracts.md?

If YES to any: surface the existing artifact and require explicit "creating-despite-existing: because <reason>" in the Write frontmatter.

**Where it belongs:** Upgrade `pre-tool-use-frontmatter-enum-check.sh` to include a
quick overlap check. Or new `pre-tool-use-consolidation-gate.sh`.

**PE: 65** | **Spine: GVRN** | **Requires:** Sonnet implementation (protected path — needs Governor diff-before-write approval)

---

## How These 7 Principles Map to Improvement Areas

| Improvement area | Principle(s) | Key mechanism |
|---|---|---|
| **Planning** | RP-001 (week-4 target sessions), RP-005 (proof before sealing) | Every deferred item has a target; CORE principles require evidence |
| **Implementing** | RP-004 (generators not manual), RP-005 (proof required) | Index artifacts are generated; L1 sealing includes implementation check |
| **Documenting** | RP-002 (count consistency), RP-003 (resolution required) | Counts verified mechanically; fields that don't resolve don't govern |
| **Validating** | RP-002 (count validator), RP-003 (resolver validator), RP-007 (pre-creation check) | Three new validators or validator upgrades |
| **Harvesting/Extracting** | RP-006 (multi-topic decomposition), RP-004 (generated indexes) | Concerns extracted before acting; L3 auto-harvested from corpus |
| **Vault efficiency** | RP-006 (routing table = vault clarity), RP-001 (OVERDUE tracking) | Every input routes explicitly; deferred items age visibly |

---

## Division of Work: Opus vs. Sonnet

### Opus must decide (constitutional):
1. **RP-005:** Is L1 sealing protocol amendable to require `implementation_evidence:` before sealing?
2. **RP-004:** Is `generated: true` enforcement a constitutional change to the artifact model?
3. **RP-006:** Design of multi-topic intake decomposition — is P-META-024 the right spine, or is it an extension of P-META-023?
4. **schema-registry.md architecture** (from opus-srof Part A) — ZModel vs. per-app schema decision
5. **5 missing L2 domains** (from opus-srof Part B) — add or not?

### Sonnet can implement without Opus:
1. `validate-frontmatter-count-consistency.mjs` (RP-002) — no constitutional change
2. Upgrade `validate-nothing-stands-alone.mjs` to check resolution (RP-003) — after schema-registry.md exists
3. `instance-registry-populator.mjs` (RP-004/B-1) — mechanical, no governance change
4. `schema-registry.md` (RP-003/A-1) — documentation, no constitutional change
5. DNA count fix (done S027 ✅) — was a typo/drift, not a governance question
6. Fix dead links (PE=40, ongoing) — purely mechanical

---

## Pending Questions That Block Completion

These are specific unresolved questions that prevent high-PE items from moving forward.
Each is a blocker; removing it unlocks work.

**Q1 — Where is the ZModel schema? (blocks PE=78 Gate 3 + PE=72 schema-registry)**
`packages/database/` doesn't exist as a ZModel package. Budget Planner must have a schema
somewhere. Without knowing the canonical location, we cannot build schema-registry.md or
validate ARCH CORE's "ZModel as SSoT" commitment.
**Who answers:** Governor (tell us where the schema is, or confirm ARCH CORE needs amending)

**Q2 — Is Budget Planner Gate 3 dependent on schema-registry.md? (blocks PE=78)**
Gate 3 validates: tenant isolation, auth, GDPR erasure. Does it require schema governance
to be complete first, or is it independent? If independent, Gate 3 can proceed now.
**Who answers:** Governor (operational decision)

**Q3 — Should L3 instance populator run at pnpm verify or as a separate command? (blocks B-1)**
If the populator runs at pnpm verify (every session close), it adds scan time but keeps L3
current. If it runs separately (`pnpm instances:refresh`), L3 stays stale between explicit runs.
The answer determines the architecture of the script.
**Who answers:** Sonnet proposes, Governor approves.

**Q4 — What is the taxonomy of schema_anchor values? (blocks A-1)**
`pillar_0_governance_leaves` — is this a schema table? A category? A namespace?
Building schema-registry.md requires knowing what the 43 existing anchors SHOULD map to.
Should schema_anchor map to: (a) ZModel entity, (b) governance document section, (c) TypeScript type?
Can one anchor serve multiple purposes?
**Who answers:** Opus (architectural decision per opus-srof Part A Q2)

**Q5 — Are the 5 missing L2 domains (SCHEMA_GOVERNANCE etc.) additions or redesigns? (blocks B-2)**
Adding 5 L2 domains without Opus review risks over-governing. If they're additions, they
need PCR. If any redesigns an existing domain, they're constitutional.
**Who answers:** Opus (per opus-srof Part B Q11)

**Q6 — Is RP-006 (multi-topic decomposition) a new principle or an extension of P-META-023?**
P-META-023 covers threshold intake. Multi-topic decomposition is related but different —
it's about decomposing compound prompts, not just crystallizing intent.
**Who answers:** Opus (design decision, per opus-srof review)

**Q7 — Should `deferred_target_session:` be a closed enum or a free-form session reference? (blocks RP-001)**
If free-form (S028, S029...), it's simple to add but can't be machine-checked for freshness.
If closed enum tied to current session, it's checkable but requires the validator to know
the current session number.
**Who answers:** Sonnet can decide — propose `deferred_target_session: S028` pattern,
validate with `validate-deferred-target-session.mjs`.

---

## ZF Cycle Results for This Session

All work verified against pnpm verify exit_code=0:

| Artifact | ZF status | Finding |
|---|---|---|
| validate-comprehensive-response.mjs | ✅ 0 advisories | Raw-thoughts-queue has 3 entries (active) |
| validate-diataxis-type.mjs | ✅ 0 blocking | 69 artifacts classified |
| validate-bottleneck-patterns.mjs | ✅ advisory only | 8 N+1 patterns (live architectural gap) |
| validate-dna-evidence.mjs | ✅ 0 advisories | 17/17 elements evidenced |
| csps-platform-dna.md (count fix) | ✅ ZF FIXED | 4 different counts → unified to 17 |
| opus-srof-schema-and-spines-review.md | ✅ created | Needs Opus review (not ZF on content) |
| pnpm verify overall | ✅ exit_code=0 | 92 validators, 0 blocking |

**One ZF gap found and fixed this turn:** DNA element count contradiction (13/15/16/17 → unified to 17 across all 7 locations in csps-platform-dna.md).

---

## Enhancement to the Opus SROF Document

The following should be added to `opus-srof-schema-and-spines-review.md`:

**§D — Retrograde Principles for Prevention:**
The 7 RP principles above, especially RP-005 (L1 sealing requires implementation proof),
should be included in the Opus review request. Specifically, Opus should weigh:
- Is adding `implementation_evidence:` to the L1 sealing checklist a constitutional change?
- Do RP-001 through RP-004 already exist implicitly in some L2 domain, or are they genuinely new?

**§E — Completion Path:**
The platform's path to completion depends on three Opus decisions (Q4, Q5, Q6 above).
Each blocks high-PE Sonnet work. Opus should resolve these in a single review turn,
not incrementally.

---

## The Compound Insight

All 7 problems share one root: **the gap between declaration and implementation is not
tracked as debt.** When CSPS declares something (a principle, a field, a validator, an
index), it enters the governance record. But there is no systematic tracker of
"declared but not yet real." The platform knows what was declared. It doesn't know
what fraction of declarations are implemented.

This is the meta-principle:

> **P-META-??? — Declaration Completeness Discipline:**
> Every governance declaration creates a completion obligation. The platform must track
> the ratio of declarations to implementations, surface this ratio visibly (pnpm health),
> and block new declarations when the existing implementation debt is too high.
> "Governance debt" = sum of all declared-but-not-implemented items.
> High governance debt = structural instability risk.

This meta-principle governs all 7 RP items. It would replace the current model of
"register atomic, implement week-4, forget" with "declare → track → implement →
close the loop."

**Governance debt current estimate:**
- week-4 deferred items: ~30+ (in audit-runner.md alone)
- STUB validators: 10 (verify-hooks-functional output)
- Orphan artifacts: 43
- L3 stale indexes: 5 (since S006)
- Total governance debt: ~88 items declared, not implemented

88 items ÷ 92 active validators = governance debt ratio of ~95%. For every implemented
item, there's ~1 declared-but-not-implemented item. This ratio is unsustainable at 30 apps.
