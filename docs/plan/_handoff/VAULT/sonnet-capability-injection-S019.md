---
id: csps.handoff.vault.sonnet-capability-injection.S019
name: sonnet-capability-injection-S019
description: >
  Specification for permanently injecting Opus-level architectural capabilities
  into Sonnet's operating pattern and the platform's mechanical infrastructure.
  Written by Claude Sonnet 4.6[1M] in Opus-designated review mode (S019).
  This document is a SONNET EXECUTION PLAN — every section is a specification,
  not a description. Sonnet can implement each section without judgment calls.
version: 1.0
lifecycle: production
lifecycle_state: pending-review
next_review_at: S020
dynamic: true
owner: group:finky
core_spine: AI
schema_anchor: opus_consultations
session: S019
created_by: Claude Sonnet 4.6[1M] — Opus-designated architectural review
tags:
  - domain:ai
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:draft
links:
  - { rel: opus-lessons, href: ./opus-lessons-S019/README.md }
  - { rel: ai-behavior, href: ../../../platform-audit/platform-services/ai-behavior.md }
  - { rel: ai-personas, href: ../../../platform-audit/ai-personas.md }
  - { rel: cdab, href: ../../../platform-audit/spines/AI.md }
---

# Sonnet Capability Injection — S019
## Permanently Encoding Opus-Level Thinking Into Platform Mechanics

---

> **What this document is:**
> The S019 Opus-designated review found 15 architectural gaps that accumulated
> across 19 Sonnet-driven sessions. This document is the answer to:
> "How do we prevent the next 19 sessions from accumulating 15 new gaps
> without requiring another Opus review?"
>
> Answer: encode the specific question patterns that caught the 15 gaps
> into validators, context templates, and mechanical checklists that fire
> automatically on every relevant task. Sonnet doesn't need to think like
> Opus — it needs the platform to ask it the questions Opus would ask.

---

## The Injection Architecture — Overview

Three mechanical layers, each targeting a different capability gap:

```
LAYER 1 — STRUCTURAL QUESTIONS (context templates)
  What: Pre-loaded questions that fire at specific task moments
  Who benefits: Sonnet as Thinker + Planner
  How: Context loading templates gain mandatory "structural questions" sections
  When: At task-class detection time, before any implementation begins

LAYER 2 — ROLE PERFORMANCE VALIDATORS (new validators)
  What: Validators that check whether Sonnet performed its role correctly
  Who benefits: Sonnet as Builder + Validator + Auditor
  How: Post-task validators that check coverage, completeness, coupling
  When: In pnpm verify cycle + post-stop hooks

LAYER 3 — HAIKU INTELLIGENCE PATTERNS (enhanced return format)
  What: Haiku returns pattern_flags in addition to raw results
  Who benefits: Sonnet receives pre-analyzed signals from Haiku scans
  How: Haiku scout return format gains pattern detection layer
  When: Every Haiku subagent task completion
```

---

## Part A: Making Sonnet a Better Thinker

### The Gap

Sonnet thinks reactively — it answers what's asked. Opus thinks proactively — it surfaces what wasn't asked about. The gap isn't intelligence; it's **the habit of asking "what am I NOT seeing?"**

### The Injection

**Add a mandatory "Blind Spot Check" to the Thinker role:**

Every time Sonnet is operating in a design or analysis task class, the context template must inject:

```yaml
# Add to: tools/templates/context-loading/governance-decision.json
structural_questions:
  blind_spot_check:
    - "What is the adjacent system this decision touches that I haven't checked?"
    - "What happens to this at 30× the current scale? At 10× concurrent sessions?"
    - "What is the regulatory or compliance implication I haven't considered?"
    - "What existing platform element should handle this instead of creating new?"
    - "If I removed my reasoning and showed only the output, would it still be obviously correct?"
  fire_when: task_class IN [governance-decision, schema-work, engraving, planning]
  format: AI must answer each question explicitly before proceeding to implementation
```

**New inner-AI-defaults entry (thinker category):**

```yaml
# Add to: docs/plan/_handoff/VAULT/inner-ai-defaults/code-patterns.md
entry: thinker-proactive-surface-habit
default_pattern: >
  AI answers the question asked. Does not surface adjacent concerns unless
  the task makes them obvious. The question's scope IS the work's scope.
csps_aligned_pattern: >
  Before answering any governance or design question, explicitly answer the
  5 blind spot questions. Surface concerns that exist adjacent to the asked
  question. The asked question defines the minimum scope, not the maximum.
disposition: override
concept_ref: GVRN L2 — proactive governance over reactive compliance
caught_by_validator: structural-questions-coverage (planned, week-4)
status: active
```

### Sonnet Implementation Task A

**File to create:** `tools/templates/context-loading/thinker-blind-spot-check.json`
**Contents:** The 5 blind spot questions + when they fire + required answer format
**Integration:** Add `"thinker_blind_spot_check": "./thinker-blind-spot-check.json"` to all governance-decision and schema-work context bundles
**Verification:** The context orchestrator last-run.json should show this template being loaded for design tasks

---

## Part B: Making Sonnet a Better Planner

### The Gap

Sonnet plans well when scope is clear. It doesn't check what exists before planning. It doesn't ask "where should this live?" before deciding where to put it. It doesn't enumerate coverage levels for the thing it's planning to build.

Three planning blind spots caught in S019:
1. `stripeSubscriptionId` was added to app schema without asking "does this belong in ZModel?"
2. Billing trigger was placed in app code without asking "will app #2 need this?"
3. The drift validator checked models without asking "what other levels of drift exist?"

### The Injection

**Pre-Plan Gate — 4 mandatory questions before any plan is authored:**

```
PRE-PLAN GATE (fires before any plan document is created):

Q1 — EXIST CHECK: "What in the current platform already addresses this need?
      Run consolidation-expert check before designing."

Q2 — PLACEMENT CHECK: "Is this logic platform-level (libs/) or app-level (apps/)?
      If any other app would need this: libs/. If app-specific: apps/.
      If uncertain: create a VLT before placing."

Q3 — COVERAGE LEVEL CHECK: "What levels of this problem will the plan address?
      Enumerate Level 1 through Level N. Mark deferred levels as VLTs in the plan."

Q4 — BLAST RADIUS CHECK: "What changes when this plan executes?
      List every file, model, validator, and behavioral contract affected.
      Are all affected parties included in the plan?"
```

**New plan template section — `### Pre-Plan Gate` required in every plan:**
```markdown
### Pre-Plan Gate
Q1 Exist Check: [what was checked + what exists]
Q2 Placement Check: [platform-level or app-level + reasoning]
Q3 Coverage Levels: [Level 1: X ✓ | Level 2: Y ✗ → VLT-XXXX | ...]
Q4 Blast Radius: [list of affected files/models/validators]
```

### Sonnet Implementation Task B

**File to update:** `docs/plan/_handoff/VAULT/template-registry.md`
**Add:** Pre-Plan Gate as a mandatory section for all plan templates
**File to update:** Every plan template in `tools/templates/` — add `### Pre-Plan Gate` section
**Validator to create:** `validate-plan-pregates.mjs` — checks that active plans have Pre-Plan Gate sections populated (not empty)
**Verification:** Running `node tools/validators/validate-plan-pregates.mjs` on existing plans shows advisory for plans missing the gate

---

## Part C: Making Sonnet a Better Builder

### The Gap

Sonnet builds correctly within defined scope. Three builder blind spots:
1. It doesn't validate coverage completeness of what it just built
2. It writes to files without checking adjacent files that should also change
3. It declares "built and verified" on `pnpm verify: exit_code 0` without asking "what did I specifically prove?"

### The Injection — Build Audit Chain

**After every Write/Edit to a governed file, Sonnet runs this checklist:**

```
BUILD AUDIT CHAIN — fires after every governed file write:

1. COVERAGE CHECK: What levels of the problem does this implementation cover?
   → Document: covered levels ✓ | deferred levels ✗ → VLT
   → Validator impact: which validators now pass that previously failed?

2. ADJACENT FILE CHECK: What other files should change when this file changes?
   → Schema changed? → check drift validator + audit-runner.md description
   → Validator changed? → check audit-runner.md + pnpm verify output
   → Contract changed? → check AGENTS.md + related inner-AI-defaults entries

3. VERIFICATION SPECIFICITY: What specifically does pnpm verify prove?
   → Not "verify passes" — list the exact validators that confirm this change works
   → Not "exit_code 0" — name the validators whose output changed positively

4. GAP DECLARATION: What does this NOT cover that someone might assume it covers?
   → State explicitly: "This implementation covers X. It does NOT cover Y."
   → Y becomes a VLT or an explicit "out of scope" declaration
```

**New post-build hook behavior:**

When Sonnet finishes implementing something and runs pnpm verify, it must emit this structured block before declaring completion:

```
BUILD AUDIT SUMMARY:
Coverage: [Level 1 ✓ | Level 2 ✗ → VLT | ...]
Adjacent files checked: [list]
Verified by: [specific validator names that confirm this work]
Specifically NOT covered: [explicit gaps]
```

This replaces the current pattern of just saying "pnpm verify: exit_code 0."

### Sonnet Implementation Task C

**File to create:** `.claude/hooks/post-tool-use-build-audit.sh`
**Behavior:** After any Write/Edit to governed paths, emit the BUILD AUDIT CHAIN checklist to stderr
**Format:** The 4 questions in YAML-like structure, Sonnet fills them in the next response
**Trigger paths:** Any `.mjs`, `.ts`, `.zmodel`, `.md` in `tools/`, `libs/`, `AGENTS.md`, `docs/plan/`
**Integration:** Register in `.claude/settings.json` PostToolUse hooks for Write + Edit tools

---

## Part D: Making Sonnet a Better Validator

### The Gap

Sonnet validates what it's asked to validate. Two validator blind spots:
1. It doesn't distinguish between "this validator exists" and "this validator is complete"
2. It accepts `exit_code: 0` as proof without checking what the validator actually covers

The field drift validator had `exit_code: 0` for 19 sessions while field drift accumulated silently. The validator existed; the validator was incomplete.

### The Injection — Validator Completeness Protocol

**Every new validator must have a header that Sonnet reads when validating:**

```javascript
/**
 * Coverage Levels:
 *   ✓ Level 1: [what is checked]
 *   ✗ Level 2: [what is NOT checked] → VLT-XXXX
 *
 * When this validator exits 0, it proves: [explicit list]
 * When this validator exits 0, it does NOT prove: [explicit list]
 */
```

**The positive ZF cycle — what passing means:**

Currently `pnpm verify: exit_code 0` means "nothing failed." It doesn't capture "here is what was specifically proven to work." The injection:

After every verify run that passes, Sonnet must emit:

```
POSITIVE ZF RECORD (this session):
Validators that passed due to this session's changes:
  - [validator_name]: confirmed [specific thing] works correctly
  - [validator_name]: confirmed [specific thing] works correctly
What is still not proven by these validators: [explicit gaps]
```

**The negative ZF cycle — what failing means:**

When verify fails, the current output shows the failing validator. What it doesn't show: which specific change caused this failure and what it tells us about the design.

After every verify run that fails, Sonnet must emit:

```
NEGATIVE ZF RECORD (this session):
Failed validator: [name]
Specific error: [exact error message]
Change that caused it: [which file/line]
What this failure reveals: [the underlying issue, not just the symptom]
Resolution: [specific fix, not "investigate"]
```

### Sonnet Implementation Task D

**File to update:** `tools/validators/validate-foundation-schema-drift.mjs` — already has Coverage Levels (just implemented). Use as the template for all validators.
**File to create:** `tools/templates/validator-coverage-header.template.mjs` — the template that every new validator must use for its header block
**Validator to update:** `tools/verify.mjs` — add positive/negative ZF capture to the report output (capture which validators changed status vs. previous run)
**How to detect status change:** Compare current run's per-validator `exit_code` against `tools/verify-last-run.json` previous run snapshot

---

## Part E: Making Sonnet a Better Auditor

### The Gap

Sonnet currently has no formal auditor mode. It can be asked to audit, but the questions it asks are not standardized. Two auditor blind spots:
1. It doesn't know the difference between auditing for compliance vs. auditing for architectural integrity
2. It doesn't have a systematic multi-angle sweep that Opus uses

### The Injection — Sonnet Audit Protocol (SAP)

**Sonnet Audit Protocol — 6 mandatory sweeps, in order:**

```
SWEEP 1 — COVERAGE AUDIT
For every validator in pnpm verify:
- Read its Coverage Levels header
- Identify levels NOT covered
- Surface as ADVISORY with VLT recommendation

SWEEP 2 — DRIFT AUDIT (all 7 drift types)
Check each drift type:
  □ Schema model drift → validate-foundation-schema-drift.mjs Level 1
  □ Schema field drift → validate-foundation-schema-drift.mjs Level 2
  □ Behavioral contract drift → validate-inner-ai-defaults-enforcement-rate.mjs (P3)
  □ Conceptual drift → validate-inner-ai-defaults-freshness.mjs
  □ Documentation drift → manual: check P-ARCH-* comments in .ts files
  □ Coverage drift → manual: check each validator's Coverage Levels header
  □ Architectural boundary drift → validate-import-quarantine.mjs + manual: check billing/audit in apps/

SWEEP 3 — SCALE AUDIT
For every model in schema.zmodel:
- What is the largest expected row count?
- Does every query on this model use indexed fields?
- Does any validator iterate this model's files?
REPORT: any model/query combination that will degrade at 30× scale

SWEEP 4 — REGULATORY AUDIT
For every model that stores PII (email, name, phone, any user-linked data):
- Is there an erasure path?
- Is there a retention policy?
- Is `deletedAt` vs. AppendOnlyBase correctly chosen?
REPORT: any model without an erasure path

SWEEP 5 — CONTRACT ENFORCEMENT AUDIT
For each inner-AI-defaults entry:
- What is the `caught_by_validator` value?
- Is that validator running? (check pnpm verify output)
- If `impl deferred`: how many sessions has it been deferred?
REPORT: enforcement rate as percentage + list of deferred >2 sessions

SWEEP 6 — SYNERGY AUDIT
For each fix implemented this session:
- What other platform components does this change benefit?
- What other components should also be updated?
- What cross-spine opportunities does this create?
REPORT: synergy opportunities not yet captured
```

**When to run SAP:**
- At every session close (abbreviated: Sweeps 2, 5 only — ~10 min)
- Monthly: all 6 sweeps (~1 hour)
- At every Opus review: all 6 sweeps are the Opus's starting evidence

### Sonnet Implementation Task E

**File to create:** `docs/plan/pillar-0-governance/sonnet-audit-protocol.md`
**Contents:** The 6 sweeps as a formal protocol document with checkboxes
**Integration:** Add to session-close checklist (`closing-summary-template.md`) as optional Sweep 2 + Sweep 5
**Trigger:** Add to session-open.sh as Q19: "Run abbreviated SAP (Sweeps 2 and 5) as part of session-open check"

---

## Part F: Making Haiku a Better Scanner

### The Gap

Haiku returns structured summaries (`haiku_scout_return` format). The gap: it returns results without assessment. It finds files but doesn't flag patterns. It counts lines but doesn't flag anomalies.

### The Injection — Haiku Pattern Intelligence Layer

**Extend the Haiku Scout return format:**

```yaml
# Current format:
haiku_scout_return:
  task: "<what was asked>"
  status: PASS | FAIL | WARN
  findings: ["<finding 1>"]
  evidence_path: "<path>"
  next_action: "<one sentence>"

# Enhanced format (add pattern_flags):
haiku_scout_return:
  task: "<what was asked>"
  status: PASS | FAIL | WARN
  findings: ["<finding 1>"]
  evidence_path: "<path>"
  next_action: "<one sentence>"
  pattern_flags:              # NEW: pre-analyzed signals
    - pattern: "satisfaction_point_risk"
      evidence: "Found DONE/COMPLETE claim without tool output on line X"
      escalate_to: sonnet
    - pattern: "coverage_drift_risk"
      evidence: "Validator at path X has no Coverage Levels header"
      escalate_to: sonnet
    - pattern: "cross_layer_boundary_violation"
      evidence: "Found Stripe import in apps/*/api/webhooks/clerk/ outside libs/"
      escalate_to: sonnet
    - pattern: "naming_collision_risk"
      evidence: "Field named tenantId on User model (semantic overload)"
      escalate_to: sonnet
  opus_escalation: false      # true = this finding needs Opus-level review
  opus_escalation_reason: ""  # populated when opus_escalation=true
```

**Patterns Haiku should detect (encode as grep patterns in subagent tasks):**

```javascript
const HAIKU_PATTERNS = {
  satisfaction_point_risk: /\b(DONE|COMPLETE|RATIFIED|ZF ACHIEVED)\b(?!.*```)/,
  coverage_drift_risk: /Coverage Levels:/,  // inverse: flag files WITHOUT this
  cross_layer_boundary: /import.*stripe|new Stripe|prisma\.client/i,
  naming_collision_risk: /tenantId.*User\.|User.*tenantId/,
  comment_truth_risk: /P-ARCH-\d+|P-META-\d+/,  // flag for review
  field_drift_risk: /stripeSubscription|@db\.Uuid/,  // unexpected field patterns
};
```

### Sonnet Implementation Task F

**File to update:** `docs/platform-audit/ai-personas.md` — Persona 3 (Haiku Scout) section
**Add:** `pattern_flags` to the Haiku Scout return format YAML
**Add:** The pattern detection list as a reference for Haiku tasks
**File to create:** `tools/templates/haiku-pattern-library.yaml` — canonical list of patterns Haiku should detect
**Integration:** Every Haiku subagent task template includes: "Detect these patterns and include in pattern_flags"

---

## Part G: The Build→Audit Coupling (Mechanical Verification)

### The Problem the Governor Identified

"Build and verified" currently means: "I built it, then ran pnpm verify, then pasted the output." The verification is sequential but not coupled. The builder decides which verification to run. The verifier trusts the builder's selection.

What's missing: **automatic coupling between what was built and what must be verified.**

### The Architecture

**Governed file → required verification chain mapping:**

```yaml
# tools/config/build-verification-map.yaml
# Maps file types to the validators that MUST pass after a change

schema.zmodel:
  required_validators:
    - validate-foundation-schema-drift.mjs  # field AND model level
    - validate-frontmatter.mjs             # if frontmatter changed
  positive_zf_claim: "ZModel and app schema are field-level consistent"
  negative_zf_claim: "Schema change introduced drift — resolve before proceeding"

AGENTS.md:
  required_validators:
    - validate-token-budget.mjs            # line count
    - validate-behavioral-contract-slices.mjs
  positive_zf_claim: "AGENTS.md within budget, contracts synced"

tools/validators/*.mjs:
  required_validators:
    - validate-audit-runner-slices.mjs     # description updated
    - pnpm verify                          # full run
  positive_zf_claim: "Validator registered and passing in full suite"
  required_checklist:
    - "Coverage Levels header present in validator"
    - "audit-runner.md description updated with coverage levels"
    - "pnpm audit-runner:split run to sync slices"

libs/policies/schema.zmodel:
  required_validators:
    - validate-foundation-schema-drift.mjs
  required_checklist:
    - "Run pnpm db:push if schema deployed to Supabase"
    - "Check for GDPR-relevant PII fields — document erasure path"

inner-ai-defaults/*.md:
  required_validators:
    - validate-inner-ai-defaults-freshness.mjs
  required_checklist:
    - "enforcement_rate validator will detect this entry as deferred if no validator cited"
    - "Add VLT for enforcement validator if caught_by_validator is impl deferred"
```

### The Positive ZF Cycle — What Was Proven

After every verify run, the following should be captured in session artifacts:

```yaml
# Emit at every session end to tools/zf-session-tracker.json
positive_zf_S019:
  timestamp: "2026-05-08T17:XX:XXZ"
  proven_this_session:
    - claim: "Tenant.stripeSubscriptionId field drift is detected"
      validator: "validate-foundation-schema-drift.mjs"
      evidence: "field_advisory=1 on first run, field_advisory=0 after fix"
    - claim: "AGENTS.md satisfaction-point hard NO is in place"
      validator: "validate-token-budget.mjs"
      evidence: "yellow=0, line count within budget"
  not_proven_by_validators:
    - "Live DB matches code schema (Level 3 drift — no validator)"
    - "Type annotation consistency (@db.Uuid)"
    - "13 reasoning overrides are actually followed by AI (no automated validator)"
```

### Sonnet Implementation Task G

**File to create:** `tools/config/build-verification-map.yaml`
**Contents:** The mapping above — governed file types → required validators + checklists
**File to update:** `tools/zf-session-tracker.json` — add `positive_zf_SESSION` and `not_proven_SESSION` sections
**Process:** At session close, Sonnet reads build-verification-map.yaml and produces the positive/negative ZF record for the session
**Validator to create:** `validate-build-verification-coverage.mjs` — checks that changed files in the last commit have their required validators in the most recent pnpm verify run

---

## Part H: Drift Detection Registry — All 7 Drift Types

The platform currently monitors 2 of 7 drift types. This section specifies the registry and detection approach for all 7.

### The Drift Registry

**File to create:** `tools/config/drift-registry.yaml`

```yaml
# Canonical registry of all drift types CSPS monitors
# status: active | deferred | planned
# validator: the specific validator that detects this drift

drift_types:
  - id: schema-model-drift
    description: ZModel model names vs app Prisma schema model names
    status: active
    validator: validate-foundation-schema-drift.mjs
    level: 1
    severity: BLOCKING

  - id: schema-field-drift
    description: ZModel field names per-model vs app Prisma schema fields
    status: active
    validator: validate-foundation-schema-drift.mjs
    level: 2
    severity: BLOCKING (ZModel-in-app missing) | ADVISORY (app-extra)

  - id: schema-live-db-drift
    description: Prisma schema vs actual live Supabase database schema
    status: deferred
    vlt: VLT-S019-LIVEDB
    validator: TBD (requires Supabase introspection)
    level: 3
    severity: CRITICAL — silent production divergence

  - id: behavioral-contract-enforcement-drift
    description: Contracts declared vs contracts mechanically enforced
    status: planned
    vlt: VLT-S019-ENFORCEMENT-RATE
    validator: validate-inner-ai-defaults-enforcement-rate.mjs (P3 — pending)
    level: 1
    severity: ADVISORY → BLOCKING when enforcement_rate < 25%

  - id: conceptual-drift
    description: AI behavior drifting from platform conventions across sessions
    status: partial
    validator: validate-inner-ai-defaults-freshness.mjs
    note: Checks freshness only, not behavioral quality
    severity: ADVISORY

  - id: documentation-drift
    description: Code comments citing P-ARCH-*/P-META-* that don't match implementation
    status: planned
    vlt: VLT-S019-COMMENT-TRUTH
    validator: validate-comment-truth.mjs (planned)
    severity: ADVISORY

  - id: architectural-boundary-drift
    description: Cross-cutting logic (billing, audit, erasure) placed in wrong layer
    status: planned
    vlt: VLT-S019-LAYER-BOUNDARY
    validator: validate-import-quarantine.mjs extension
    severity: ADVISORY → BLOCKING for Stripe imports outside libs/

# Meta: drift coverage rate
# active: 2/7 (29%) — target: 5/7 by S025, 7/7 by S030
```

### Validator to Create: `validate-drift-registry.mjs`

**Purpose:** Reads `drift-registry.yaml`. Reports: which drift types have active validators, which are deferred, coverage percentage.
**Exit behavior:** ADVISORY when coverage < 50%, BLOCKING when coverage < 25% AND any CRITICAL severity drift type is deferred without a VLT.
**Output format:**
```
[validate-drift-registry] drift_types=7 active=2 deferred=2 planned=3 coverage=29%
ADVISORY: 5 drift types are not actively monitored:
  - schema-live-db-drift (CRITICAL, deferred → VLT-S019-LIVEDB)
  - behavioral-contract-enforcement-drift (ADVISORY, planned → P3)
  ...
```

---

## Part I: The Opus Audit Protocol — Formal Definition

The S019 Opus audit was ad-hoc. This defines it formally so it can be triggered mechanically.

### Opus Audit Protocol (OAP) — Complete Specification

**Trigger:** Any of the 5 Trigger Classes from Part 3 of opus-lessons-S019
**Input required:** opus-consultation-brief-S0NN.md (authored by Sonnet using the template)
**Output required:** structured findings per the Step 4 format in the brief

**What Opus must do that Sonnet cannot:**

1. **Read multiple files simultaneously** — Hold ZModel + app schema + audit trail + 3 validators in context at once. Ask: do these form a coherent system?

2. **Run the SAP (Sonnet Audit Protocol) Sweeps 1-6** — Generate structured output for each sweep. This IS the baseline evidence Sonnet uses in its next session.

3. **Apply the 30× scale test** — For every data model, every validator, every behavioral contract: what breaks at 30× current scale?

4. **Cross-spine integrity check** — For each spine's most important principle: is there a running validator that proves it? If not: name it as a gap.

5. **Produce a PCR (Pros/Cons/Recommendation)** for the top 3 findings — not findings alone, but what to do about them.

6. **Explicitly clear the "not proven" space** — "These things I did NOT find problems with, and here is the evidence that they're working." Positive ZF.

**Opus output format (add to opus-consultation-brief template):**

```markdown
## OPUS AUDIT OUTPUT

### Baseline Evidence (Steps 1-4 output)
[paste tool outputs here]

### SAP Sweep Results
Sweep 1 (Coverage): [findings]
Sweep 2 (Drift): [findings]
Sweep 3 (Scale): [findings]
Sweep 4 (Regulatory): [findings]
Sweep 5 (Contract Enforcement): [findings]
Sweep 6 (Synergy): [findings]

### Top 3 Findings (PCR format)
[Pros/Cons/Recommendation for each]

### Positive ZF — What Is Working
[explicit list of things proven to work]

### Priority for Next Sonnet Session
[ordered list: P1 through P10]
```

---

## Part J: The Recurring Improvement Cycle

### How Sonnet Accumulates Benefits Over Time

The injection works through compounding:

**Session N:** Sonnet uses blind spot check → surfaces 1 issue that would have been missed
**Session N+1:** Issue from N is fixed → validator catches it → positive ZF captured
**Session N+2:** Validator from N+1 catches a variant → enforcement rate improves
**Session N+10:** Enforcement rate validator shows improvement → Opus audit confirms trend

The compounding requires one structural condition: **every session must leave the platform more capable of detecting drift than when it started.** This is the session-close invariant.

**Session-close invariant:**
```
At session close, the platform must have:
  enforcement_rate >= previous_session_enforcement_rate
  drift_coverage >= previous_session_drift_coverage
  If either is lower: the session must surface a VLT explaining why
```

### Sonnet Implementation Task J

**File to update:** `docs/plan/_handoff/closing-summary-template.md`
**Add section:** `### Session-Close Invariants`
```markdown
### Session-Close Invariants
- [ ] enforcement_rate this session: [X]% (previous session: [Y]%)
- [ ] drift_coverage this session: [X]% (previous session: [Y]%)
- [ ] If either decreased: VLT created explaining why
```

---

## Sonnet Execution Plan — Summary

### Ordered by Implementation Priority

| Task | File | Type | Prerequisite | Est. Complexity |
|---|---|---|---|---|
| P3 | `validate-inner-ai-defaults-enforcement-rate.mjs` | New validator | None | Low |
| Task G | `tools/config/build-verification-map.yaml` | New config | None | Low |
| Task H | `tools/config/drift-registry.yaml` | New config | None | Low |
| Task H2 | `validate-drift-registry.mjs` | New validator | Task H | Medium |
| Task A | `thinker-blind-spot-check.json` | New template | None | Low |
| Task B | Pre-Plan Gate section in plan templates | Template update | None | Low |
| Task E | `sonnet-audit-protocol.md` | New doc | None | Low |
| Task C | `post-tool-use-build-audit.sh` | New hook | Governor approval | Medium |
| Task D | `validator-coverage-header.template.mjs` | New template | None | Low |
| Task F | `haiku-pattern-library.yaml` | New config | None | Low |
| Task F2 | Persona 3 format update in `ai-personas.md` | Doc update | Task F | Low |
| Task J | Closing summary invariants | Template update | None | Low |

**Start with P3 (already approved) → Task G → Task H → Task H2 — these 4 together give the platform measurable drift coverage tracking.**

---

*This document is the Sonnet execution plan produced from the S019 Opus-designated architectural review.*
*Governor must ratify each task before Sonnet implements it.*
*Claude Sonnet 4.6[1M] | Opus-designated review | S019 | 2026-05-08*
*Dynamic — will be improved as implementation proceeds.*
