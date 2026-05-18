---
id: csps.council.multi-session-plan-S041-alignment
name: multi-session-plan-S041-alignment
description: "S041 multi-session plan: aligning HOW WE PLAN + HOW WE IMPLEMENT + HOW WE CHECK to the full CSPS DNA — schema, core spines, threshold, AI behavior, audits, permanence enforcement. Prevention-first."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: council_state
session: S041
---

# Multi-Session Plan S041 — Full Alignment
## HOW WE PLAN + HOW WE IMPLEMENT + HOW WE CHECK

> Governor directive S040: "I want you to see that these two major things are totally
> aligned to the platform and DNA and schema and core spines and optimized by themselves
> and working optimally with all audits and verifications and AI behavior and have perfect
> consolidations and 'one source of...' and all elements and transitions have the full
> pack of permanence enforcements."

---

## §1 — DIAGNOSIS: What's Misaligned Now

### HOW WE PLAN
**Exists:** `plan-creation-protocol.md` (references threshold ✅), `gradual-build-plan.template.md`, `core-scopes.md`
**Missing:**
- Core Scopes Prevention Analysis section NOT in gradual-build-plan.template.md ❌
- No DNA block standard required in plans ❌
- No core spine declaration required in plans ❌
- No inheritance check: "does this plan reference a parent plan?" ❌
- Threshold is referenced but NOT receiving plan output for assessment ❌

### HOW WE IMPLEMENT
**Exists:** `communication-protocol-shared.md` (11 rules + PRACE), `fse-creation-template.md`, `PROTOCOL.md`
**Missing:**
- fse-creation-template.md has NO threshold connection ❌
- No Core Scopes ripple check (Scope-2) required before commit ❌
- No DNA block required on new files at implementation time ❌ (OPEN-049: pre-tool-use-dna-block-check.sh not built)
- Threshold does NOT receive implementation output for validation assessment ❌
- "Does this implementation have a ratified plan?" check is advisory only ❌

### HOW WE CHECK (AUDITS + VALIDATION)
**Exists:** `verify.mjs` (130 validators), `audit-runner.md`, `audit-hub.md`
**Missing:** ← THIS IS THE MOST CRITICAL GAP
- `verify.mjs` findings have NO structured route to threshold ❌
- Findings are reported as text output, not fed into an assessment pipeline ❌
- Core Scopes (S1/S2/S3) NOT applied to validator output ❌
- Threshold is NOT receiving findings for "assessment and processing" (Governor: "finding things is only partial") ❌
- No "findings → threshold → Core Scopes routing" pipeline exists ❌

### THRESHOLD ITSELF
**Exists:** `threshold-gate-v2.md`, `threshold-intake-protocol.md`, `human-intent-crystallization.md`
**What awaits completion:**
- OPEN-023: PI-026 Developer onboarding via threshold (dogfood) — Habit Tracker should use it ❌
- Threshold should be the single intake for: user input, AI findings, validator output, audit results ❌
- "Developer dashboard schema" mentioned in threshold-gate-v2.md — not built ❌
- Threshold → Core Scopes routing bridge: findings from audits assessed by threshold → routed to S1/S2/S3 ❌
- Threshold is DISCONNECTED from HOW WE CHECK: validators fire, threshold doesn't see results ❌

---

## §2 — THE ALIGNMENT ARCHITECTURE

### One Source → All Three "How We" Documents

```
ONE SOURCE: docs/plan/pillar-0-governance/csps-way-of-working.md (TO BUILD)
  ├── HOW WE PLAN: plan-creation-protocol.md + gradual-build-plan.template.md
  │   ├── Required: DNA block in plan header
  │   ├── Required: Core Spines declared (which L1/L2/L3 spines govern this plan)
  │   ├── Required: Prevention Analysis (Scope-1/2/3 risks)
  │   └── Required: Threshold intake — plan is submitted to threshold before implementation
  │
  ├── HOW WE IMPLEMENT: fse-creation-template.md + communication-protocol-shared.md
  │   ├── Required: Parent plan referenced (no implementation without plan)
  │   ├── Required: Scope-2 ripple check before commit
  │   ├── Required: DNA block (@csps-dna) as first content of new files
  │   └── Required: Implementation output routes to threshold for quality gate
  │
  └── HOW WE CHECK: verify.mjs + audit-runner.md
      ├── Required: Findings categorized as S1/S2/S3 in output
      ├── Required: S3 findings trigger PRACE analysis template
      ├── Required: Findings route to threshold-intake-protocol.md for assessment
      └── Required: Threshold produces "assessment verdict" (route S1 now / S2 next session / S3 structural)
```

### The Missing Pipeline: FINDINGS → THRESHOLD → CORE SCOPES

```
verify.mjs runs → produces structured findings
          ↓
findings-router.mjs (TO BUILD) reads findings
          ↓
For each finding:
  classify → S1 (BLOCKING, fix now) | S2 (ADVISORY, ripple needed) | S3 (DEFERRED, prevention needed)
          ↓
threshold-intake-protocol.md receives S3 findings for "assessment and processing"
  (threshold is the gate for: is this a pattern? what's the AI behavior causing it? what's the permanent fix?)
          ↓
Threshold produces: OPEN-NNN with PRACE analysis template filled
```

---

## §3 — SESSIONS AND PRIORITIES (PE-scored)

### S041 Sprint 1 (first 2 hours) — Foundation alignment

| Item | What | PE | Where |
|---|---|---|---|
| S41-A | Add Prevention Analysis section to `gradual-build-plan.template.md` | 85 | HOW WE PLAN |
| S41-B | Add threshold connection to `fse-creation-template.md` | 80 | HOW WE IMPLEMENT |
| S41-C | Core Scopes [S1]/[S2]/[S3] tags in `opus-open-items.md` format | 75 | HOW WE CHECK |
| S41-D | P-META-027 (PRACE) in principles.yaml | 85 | All three |
| S41-E | `post-stop-pcr-check.sh` — promote from STUB to advisory | 70 | HOW WE CHECK |

### S041 Sprint 2 (2-4 hours) — Pipeline building

| Item | What | PE | Where |
|---|---|---|---|
| S41-F | `tools/config/inheritance-registry.yaml` — csps-pack tree | 80 | HOW WE IMPLEMENT |
| S41-G | `pre-tool-use-dna-block-check.sh` — T1 DNA block enforcement | 80 | HOW WE IMPLEMENT |
| S41-H | `findings-categorizer.mjs` — tags verify output as S1/S2/S3 | 75 | HOW WE CHECK |
| S41-I | Connect `findings-categorizer.mjs` to post-stop-pnpm-verify.sh | 70 | HOW WE CHECK |
| S41-J | Threshold connection in `core-scopes.md` (findings → threshold for S3) | 75 | All three |

### S041 Sprint 3 (next session) — Threshold completion

| Item | What | PE | Where |
|---|---|---|---|
| S41-K | `csps-way-of-working.md` — ONE canonical source for all three "how we" | 90 | All three |
| S41-L | Developer dashboard schema (threshold-gate-v2.md) — build it | 70 | Threshold |
| S41-M | PI-026 dogfood: Habit Tracker uses threshold wizard | 75 | Threshold |
| S41-N | `findings-router.mjs` — routes findings to threshold for assessment | 80 | HOW WE CHECK → Threshold |
| S41-O | `validate-plan-has-prevention.mjs` — T2: plans must have Prevention Analysis | 75 | HOW WE PLAN |

### S042 — DNA + Core Spines alignment

| Item | What | PE | Where |
|---|---|---|---|
| S42-A | DNA blocks in all `docs/plan/pillar-0-governance/*.md` files | 75 | DNA alignment |
| S42-B | Core Spine declarations in all plan templates | 70 | Core Spines alignment |
| S42-C | `validate-plan-spine-alignment.mjs` — T2: plans must declare governing spine | 70 | Schema alignment |
| S42-D | `inheritance-propagator.mjs` — full implementation | 80 | One source alignment |

---

## §4 — THRESHOLD: WHAT AWAITS COMPLETION

The threshold should receive ALL findings from HOW WE CHECK and act as the single assessment gate:

```
Currently connected to threshold:
  ✅ Plan creation (plan-creation-protocol.md references threshold-intake-protocol.md)
  ✅ User onboarding (OnboardingWizard at account-setup)

NOT yet connected to threshold:
  ❌ Validator findings (verify.mjs output)
  ❌ Audit results (audit-runner findings)
  ❌ Core Scopes S3 findings (need threshold for PRACE analysis)
  ❌ Implementation quality gate (fse-creation-template.md)
  ❌ Session findings (HANDOFF doesn't route to threshold)
```

**Threshold completion items (priority order):**
1. Route S3 findings from verify.mjs to threshold via `findings-router.mjs` (S41-N)
2. Add threshold connection to `fse-creation-template.md` (S41-B)
3. Build developer dashboard schema (S41-L)
4. Dogfood with Habit Tracker (S41-M)
5. Connect session HANDOFF Zone A findings to threshold intake (S42+)

---

## §5 — PERMANENCE ENFORCEMENT FOR EACH "HOW WE"

### HOW WE PLAN — Permanence Stack

| Layer | Mechanism | Status |
|---|---|---|
| T1 | pre-tool-use-plan-coverage-gate.sh (PRODUCTION) | ✅ ACTIVE |
| T2 | validate-implementation-gate.mjs (checks plan before build) | ✅ ACTIVE |
| T2 | validate-plan-has-prevention.mjs (Prevention Analysis required) | ❌ TO BUILD S41-O |
| T3 | session-open.sh PRACE block + plan mandate injection | ✅ ACTIVE |
| T4 | plan-creation-protocol.md + gradual-build-plan.template.md | ✅ EXIST (need Prevention Analysis) |
| T5 | AGENTS.md: Never implement without ratified plan | ✅ ACTIVE |

**Gap:** No T2 validator that checks if plans have Prevention Analysis section.

### HOW WE IMPLEMENT — Permanence Stack

| Layer | Mechanism | Status |
|---|---|---|
| T1 | pre-tool-use-claude-dir-guard.sh (PRODUCTION) | ✅ ACTIVE |
| T1 | pre-tool-use-plan-coverage-gate.sh (PRODUCTION) | ✅ ACTIVE |
| T1 | pre-tool-use-dna-block-check.sh | ❌ TO BUILD S41-G |
| T2 | validate-wiring-completeness.mjs | ✅ ACTIVE |
| T2 | validate-inheritance-chain.mjs | ❌ TO BUILD Sprint 2 |
| T3 | communication-protocol-shared.md (11 rules) | ✅ ACTIVE |
| T4 | fse-creation-template.md (5-surface FSE checklist) | ✅ EXIST (missing threshold link) |
| T5 | AGENTS.md: B_NO_WILD_IMPLEMENTATION + B_PRACE | ✅ ACTIVE |

**Gap:** DNA block check (T1) and inheritance chain (T2) not yet built.

### HOW WE CHECK — Permanence Stack

| Layer | Mechanism | Status |
|---|---|---|
| T1 | post-stop-pnpm-verify.sh (PRODUCTION) | ✅ ACTIVE |
| T2 | 130 validators in verify.mjs | ✅ ACTIVE (many advisory) |
| T2 | findings-categorizer.mjs (S1/S2/S3 tagging) | ❌ TO BUILD S41-H |
| T2 | findings-router.mjs (→ threshold) | ❌ TO BUILD S41-N |
| T3 | audit-runner.md (pipeline spec) | ✅ ACTIVE |
| T4 | audit-hub.md (orchestration) | ✅ ACTIVE |
| T5 | AGENTS.md: B_PRACE enforcement check | ✅ ACTIVE |

**Gap:** Findings don't route anywhere structured. Threshold is disconnected from audit output.

---

## §6 — ONE SOURCE FOR EACH "HOW WE"

**Current state: 3 separate areas, no unified source.**

**Target state:**
```
docs/plan/pillar-0-governance/csps-way-of-working.md (ONE SOURCE — S41-K)
  Canonical reference for all three "how we" approaches.
  When this file changes: plan templates update, FSE template updates, verify routing updates.
  
  Sections:
    § HOW WE PLAN — canonical process
    § HOW WE IMPLEMENT — canonical process
    § HOW WE CHECK — canonical process
    § The Pipeline — how findings route from check → threshold → Core Scopes
    § PRACE Application — which training default each step overrides
```

Until `csps-way-of-working.md` is built, the three "how we" documents remain parallel (drift risk).
`csps-way-of-working.md` is the highest-leverage single item in this plan (PE=90).

---

## §7 — ALIGNMENT QUESTIONS FOR OPUS TURN 97

Q1: Should `csps-way-of-working.md` be built before the other S41 items, or after Sprint 1/2 are done (so it aggregates proven content rather than aspirational)?

Q2: The threshold currently receives plan input but NOT audit findings. Should it receive ALL findings (every S3), or only S3 findings that represent new patterns (not recurring known issues)?

Q3: Core Spines precedence (GVRN > VALD > ARCH > AI > OPER): which spine governs HOW WE PLAN, HOW WE IMPLEMENT, and HOW WE CHECK? Are they all GVRN, or does each have its primary spine?

---

*Plan v1.0 | S041 | Opus architectural decision | 2026-05-18*
*Verification: node tools/verify.mjs → exit_code=0 before any S41 implementation*
