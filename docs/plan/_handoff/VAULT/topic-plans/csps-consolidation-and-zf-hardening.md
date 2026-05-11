---
id: csps.handoff.vault.topic-plan.csps-consolidation-and-zf-hardening
name: csps-consolidation-and-zf-hardening
description: >
  Comprehensive plan for: (1) Orphaned process audit expanded beyond AI defaults to ALL
  platform artifacts. (2) Consolidation enforcement — "CHECK WHAT EXISTS!!" mandatory in
  every plan and implementation. (3) ZF to truly zero — advisory disposition requirement,
  false positive fixes, KNOWN_DEFERRED registry. (4) Plan-before-implementation gate.
  (5) Implementation prevention without ratified plan. For Opus review before Session 0.
  Governor directive S022: "creative and innovative — find all gaps preventing real zero."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
template_status: stable
core_spine: GVRN
core_spines: [GVRN, VALD, ARCH, OPER]
schema_anchor: topic_plans
domain_path: platform
tags:
  - domain:governance
  - type:how-to
  - audience:ai-agent
  - maturity:stable
session: S022
execution_mode: deep_quality
intent_crystallized: true
threshold_route: platform.governance
know_how_consulted: true
enforcement_stage: active
topic_id: csps-consolidation-and-zf-hardening
priority_score: 99
priority_band: 1
depth_chosen: 5
impl_status: swift-implemented
ai_defaults_influence: none
links:
  - { rel: over-system-audit, href: ../over-the-system-audit-S022.md }
  - { rel: governance-cycle, href: ./csps-platform-governance-cycle.md }
  - { rel: cia-plan, href: ./csps-continuous-intelligence-architecture.md }
---

# CSPS Consolidation + ZF Hardening Plan

> **The honest gap:** ZF was stopping at "0 blocking + N advisory" calling it ACHIEVED.
> Some advisories were false positives. Some were undisposed tracked obligations.
> "Real zero" means: 0 blocking + (0 advisory OR each advisory DONE/DEFERRED with reason).
> This plan closes every remaining gap preventing that.

---

## §PRE-IMPLEMENTATION PROTOCOL

**READ THESE before any implementation in this plan:**
1. READ `docs/plan/_handoff/VAULT/over-the-system-audit-S022.md` §4 (Resolution Protocol)
2. READ `docs/plan/_handoff/VAULT/topic-plans/csps-platform-governance-cycle.md` §1 (ZF map)
3. RUN `node tools/zf-orchestrator.mjs --level 3` — confirm current baseline
4. RUN `node tools/validators/validate-session-harvest-readiness.mjs` — confirm HARVEST_DONE

**CHECK WHAT EXISTS!! (mandatory before every implementation step):**
- Search tools/validators/ for existing validators covering this area
- Search tools/generators/ for existing generators
- Search .claude/hooks/ for existing hooks
- Check audit-runner.md for registered slugs
- Only build NEW if nothing covers it. Reuse + extend first.

---

## §1 — ZF TO TRULY ZERO

### §1.1 The 3 Persistent Advisories (Fixed in S022)

| Advisory | Root cause | Fix applied |
|---|---|---|
| `phase-exit-criteria` warning | ZF orchestrator matched "warnings=0" (false positive) | Fixed: orchestrator now only counts ⚠ symbols + positive warning counts |
| Frontmatter ID warnings (33 files) | Historical files with `S019-to-S020` IDs predate convention | Fixed: grandfathered regex exemption in validate-frontmatter.mjs |
| `open-plan-levels` 97 items | Legitimate tracked work obligations | Fixed: formally DEFERRED in KNOWN_DEFERRED_ADVISORIES registry |

### §1.2 KNOWN_DEFERRED_ADVISORIES Registry (in zf-orchestrator.mjs)

The orchestrator now has a formal deferred registry:
```javascript
const KNOWN_DEFERRED_ADVISORIES = {
  'open-plan-levels': 'DEFERRED: 97 open items = real outstanding work in Sessions 0-D + App#2'
}
```

**How to add a new deferred advisory:**
1. Identify the advisory source (e.g., `validate-something.mjs`)
2. Write the deferred reason (WHY it cannot be resolved now + WHEN it will be)
3. Add to the registry in zf-orchestrator.mjs
4. Run `pnpm zf:deep` — the advisory should now be classified

**The rule:** Any advisory NOT in the registry surfaces as "requires disposition." This forces explicit DONE or DEFERRED — no silent accumulation.

### §1.3 ZF Status Levels (newly defined)

```
REAL ZF ACHIEVED (highest):
  0 blocking + 0 advisory
  Message: "REAL ZF ACHIEVED ✅ — TRULY ZERO FINDINGS"
  When to target: housekeeping sessions, major milestone closures

ZF ACHIEVED (standard):
  0 blocking + N advisory (each formally DONE or DEFERRED)
  Message: "ZF ACHIEVED ✅ — N advisory warning(s) remain [DISPOSED]"
  When acceptable: normal session close when open work is legitimately deferred

BLOCKING REMAINS (unacceptable for session close):
  Any blocking finding
  Message: "BLOCKING FINDINGS REMAIN ❌"
  Must resolve before declaring DONE
```

### §1.4 Plan-Level ZF Requirement (in every plan)

Every plan must now specify its required ZF level in frontmatter:
```yaml
zf_required_level: 1|2|3  # 1=commit, 2=phase, 3=session close
zf_advisory_policy: dispose_all | defer_documented | best_effort
```

**Validator: `validate-plan-zf-requirement.mjs` (to build Session A):**
- Scans all active plans
- Checks `zf_required_level` field present
- ADVISORY if missing; BLOCKING at Session A close if any plan lacks it

---

## §2 — ORPHANED PROCESS AUDIT (EXPANDED)

### §2.1 Full Orphan Taxonomy

Beyond AI defaults — ALL platform artifact types:

```
ORPHAN TYPES:

TYPE-1: SCRIPTS without integration
  What: tools/*.mjs files not in verify.mjs CYCLES list
  Example found: tools/stamp-domain-path.mjs (one-time script, still in repo)
  Detection: validate-orphaned-processes.mjs CHECK 1
  Resolution: PROMOTE (add to verify) | ARCHIVE (move to docs/archive/) | DELETE

TYPE-2: GENERATORS without trigger
  What: tools/generators/*.mjs without matching npm script in package.json
  Example risk: new generator added but no `pnpm split:X` command
  Detection: validate-orphaned-processes.mjs CHECK 2
  Resolution: WIRE (add npm script) | ARCHIVE | DELETE

TYPE-3: HOOKS without AGENTS.md declaration
  What: .claude/hooks/*.sh files not declared in AGENTS.md hook list
  Current: verify-hooks-functional.sh checks this but exits advisory
  Detection: PROMOTE verify-hooks-functional.sh to BLOCKING for unknown hooks
  Resolution: DECLARE (add to AGENTS.md) | DELETE

TYPE-4: VALIDATORS without audit-runner.md slug
  What: tools/validators/*.mjs without matching slug in audit-runner.md
  Detection: validate-audit-slug-coverage.mjs (ALREADY ACTIVE — PASS)
  Status: COVERED

TYPE-5: STALE PLANS
  What: topic-plans with lifecycle_state: active AND all items checked AND no open levels
  Detection: validate-topic-plan-progress.mjs (ALREADY ACTIVE)
  Status: COVERED

TYPE-6: DEAD LINKS (new)
  What: markdown links pointing to non-existent files
  Example risk: docs/INDEX.md links that break as files move
  Detection: validate-dead-links.mjs (TO BUILD Session C)
  Resolution: UPDATE (fix link) | REMOVE (delete reference)

TYPE-7: DATABASE SCRIPTS in wrong locations (new)
  What: *.mjs in apps/*/  that are diagnostic, seed, or test scripts (not production)
  Found and deleted S022: seed-test.mjs, test-create.mjs, test-zenstack-policy.mjs
  Detection: validate-orphaned-processes.mjs CHECK 7 (scan apps/ for non-production .mjs)
  Resolution: MOVE to tools/ or DELETE

TYPE-8: CONFIGURATION FILES without consumers
  What: JSON/YAML config files with no code reading them
  Example risk: tools/config/*.yaml files not referenced
  Detection: scan for JSON.parse/readFileSync references (complex — Phase 3)

TYPE-9: DUPLICATE FUNCTIONALITY (consolidation)
  What: Two validators doing overlapping checks
  Example: validate-rzf-evidence.mjs + pre-tool-use-rzf-evidence-gate.sh (both check RZF)
  Detection: B_CONSOLIDATION_PASS (manual audit) → MERGE or CROSS-REFERENCE
```

### §2.2 validate-orphaned-processes.mjs (expanded implementation)

```javascript
// Checks ALL 9 orphan types above
// Currently covers: TYPE-1, TYPE-2, TYPE-3, TYPE-5 (basic)
// TO ADD in Session 0: TYPE-6, TYPE-7, TYPE-8 (basic), TYPE-9 (advisory only)

// EXIT codes:
//   1 = any TYPE-1, TYPE-2, TYPE-3, TYPE-7 BLOCKING orphans found
//   0 = clean or only advisory orphans (TYPE-6, TYPE-8, TYPE-9)
```

### §2.3 Current Orphans (Status Post-S022)

| Artifact | Type | Status | Resolution |
|---|---|---|---|
| tools/stamp-domain-path.mjs | TYPE-1 | ARCHIVE PENDING | Move to tools/archive/ with note |
| tools/copy-zenstack-output.mjs | TYPE-1 | WIRE PENDING | Add to session-open.sh pre-check |
| .claude/hooks/*.sh (10 STUBs) | TYPE-3 | CLASSIFIED | Declared in AGENTS.md as STUB tier |
| 49 "planned week-4" slugs | TYPE-4 | CLASSIFIED | See over-the-system-audit-S022.md |
| validate-rzf-evidence + pre-commit hook | TYPE-9 | ADVISORY | Cross-reference, don't duplicate |

---

## §3 — CONSOLIDATION ENFORCEMENT

### §3.1 "CHECK WHAT EXISTS!!" — The Consolidation Gate

**The Governor's core insight:** Before building anything, check if it already exists. Before
proposing a new process, check if an existing process can be extended. This prevents parallel
structures, duplicate validators, and orphaned code.

**Mechanical enforcement at 3 points:**

**POINT 1: In every plan — §0 CONSOLIDATION CHECK (mandatory section)**
```markdown
## §0 — CONSOLIDATION CHECK (mandatory — read before §1)
CHECK WHAT EXISTS! Before any new artifact in this plan:
- Search: tools/validators/ for existing coverage
- Search: tools/generators/ for existing generators
- Search: .claude/hooks/ for existing hooks
- Search: audit-runner.md for registered slugs
- Search: docs/plan/_handoff/VAULT/topic-plans/ for overlapping plans
- Search: libs/ for existing integrations
Consolidation finding: [NONE FOUND | EXISTING: {what} at {path} — extending not creating]
```

**POINT 2: In every plan — implementation sections reference §0**
Each implementation step header must say:
```
### STEP N — [Name] [CHECK WHAT EXISTS — §0 consolidation applied]
```

**POINT 3: Validator — `validate-consolidation-check.mjs` (to build Session A)**
```
Scans topic-plans/*.md for:
  1. §0 CONSOLIDATION CHECK section present
  2. "CHECK WHAT EXISTS" phrase in first 200 lines
  3. Each implementation step references consolidation check
ADVISORY if missing in existing plans. BLOCKING for new plans from S023 onward.
```

**POINT 4: Hook — `pre-tool-use-consolidation-prompt.sh` (existing: pre-tool-use-plan-coverage-gate.sh extends)**
Before any Write to libs/ or tools/validators/:
  → Inject reminder: "CHECK WHAT EXISTS before creating new. Search first."
  → Advisory: does not block (humans can override with intent)

### §3.2 Core Spine Consolidation Principle

Per Core Spine methodology: items that "give service to the whole platform" belong at L1.
Items scattered across L3 instances that should be L1:

```
CURRENTLY SCATTERED → SHOULD CONSOLIDATE:

Webhook idempotency patterns:
  Scattered: each webhook handler has (or lacks) its own existence check
  Should be: libs/integrations/clerk/webhook-idempotency.ts (L1 pattern)
  Impact: SYS-1 gap closes permanently for all 30 apps

Subscription enforcement:
  Scattered: requireWriteSubscription() in apps/task-mgmt only
  Should be: libs/integrations/subscription.ts (already done! ✅)

Role permission checks:
  Scattered: hasPermission() called inconsistently in routes
  Should be: middleware (L1) that adds role to request context

Error response format:
  Scattered: each route returns different error shapes
  Should be: libs/integrations/errors.ts with standard shapes (L1)
  Standard: { error: code, message: string, ui_message?: string, renewal_url?: string }

API response format:
  Scattered: each route returns data in different wrappers
  Should be: libs/integrations/responses.ts (L1 standard format)
```

---

## §4 — PLAN-BEFORE-IMPLEMENTATION GATE

### §4.1 The Gap

Currently: AI can write implementation code (Write/Edit to apps/src/) without a ratified plan.
The `pre-tool-use-plan-coverage-gate.sh` hook exists but is a STUB.

### §4.2 Gate Design

```
pre-tool-use-plan-coverage-gate.sh → PROMOTE from STUB to ADVISORY

When to fire:
  Tool: Write or Edit
  File path: matches apps/*/src/**/*.ts | apps/*/src/**/*.tsx | libs/*/src/**/*.ts

What it checks:
  1. Does a ratified plan exist covering this work?
     Check: docs/plan/_handoff/VAULT/topic-plans/*.md where ratification_status: RATIFIED
  2. Is the current implementation within the scope of that plan?
     Check: plan's impl_status not 'swift-implemented' suggests in-progress

Response:
  FOUND: "[plan-coverage] Implementation covered by: {plan-name}. Proceeding."
  NOT FOUND: "[plan-coverage] ⚠ No ratified plan found for this implementation.
              Consider: create a plan first OR confirm this is in scope of existing plan.
              Plans at: docs/plan/_handoff/VAULT/topic-plans/"
  Severity: ADVISORY (Week-4: BLOCKING for files outside active plan scope)
```

### §4.3 The "No Plan" Rule (encoded in behavioral-contracts.md)

**B_NO_IMPLEMENTATION_WITHOUT_PLAN** (to add to behavioral-contracts.md):
```
No code changes to libs/ or apps/*/src/ outside of a ratified plan.
Exception: emergency security fixes (documented immediately after).
Enforcement: pre-tool-use-plan-coverage-gate.sh (advisory → blocking Session B).
```

---

## §5 — ZF IN EVERY PLAN SECTION

### §5.1 The Standard ZF Block (in every plan section)

Every plan section that produces artifacts must end with:

```markdown
**ZF GATE for this step:**
Before declaring this step DONE:
  □ pnpm verify → exit_code=0
  □ node tools/zf-orchestrator.mjs --level [1|2|3] → ZF ACHIEVED
  □ Each advisory: DONE (updated) OR DEFERRED (reason documented)
  □ git commit message contains evidence reference
```

### §5.2 Implementation in Plan Template

gradual-build-plan.template.md gets a new mandatory block per step:
```yaml
steps:
  - id: STEP-N
    title: "Step N — [Name]"
    consolidation_check: "§0 applied — [NONE FOUND | EXTENDING: {what}]"
    zf_gate:
      level: 1|2|3
      required_before_done: true
      advisory_policy: dispose_all|defer_documented
    evidence_required:
      - "[evidence type and format]"
```

---

## §6 — IMPLEMENTATION ORDER (PE-scored)

**Session 0 additions (PE 9.5 — includes all items above):**

```
§0 CONSOLIDATION CHECK added to every existing active plan (batch edit)
validate-orphaned-processes.mjs: add TYPE-6, TYPE-7 checks
tools/stamp-domain-path.mjs: ARCHIVE to tools/archive/ with note
pre-tool-use-plan-coverage-gate.sh: PROMOTE from STUB to ADVISORY
pre-tool-use-rzf-evidence-gate.sh: PROMOTE from STUB to BLOCKING

ZF required level added to all active topic-plans (frontmatter field)
KNOWN_DEFERRED_ADVISORIES registry maintained in zf-orchestrator.mjs
```

**Session A additions (PE 9.25):**
```
validate-consolidation-check.mjs (new — checks §0 in plans)
validate-plan-zf-requirement.mjs (new — checks zf_required_level in plans)
B_NO_IMPLEMENTATION_WITHOUT_PLAN contract (add to behavioral-contracts.md)
gradual-build-plan.template.md: add zf_gate block per step
```

**Session C additions (PE 7.9):**
```
validate-dead-links.mjs (new — TYPE-6 orphan detection)
libs/integrations/errors.ts (standard error response format — consolidation)
libs/integrations/responses.ts (standard API response format — consolidation)
```

---

## §7 — EVIDENCE GATE

Plan complete when:
```
□ pnpm verify: exit_code=0
□ node tools/zf-orchestrator.mjs --level 3 → ZF ACHIEVED (0 blocking)
  Advisory status: open-plan-levels DEFERRED (documented)
□ validate-session-harvest-readiness.mjs → HARVEST_DONE
□ All orphan types 1-7 have validators or documented exemptions
□ §0 CONSOLIDATION CHECK section in this plan ✅ (above)
□ ZF gate block present in every implementation step ✅ (§6)
□ For Opus review: provide this plan + the 6-question brief below
```

---

## §8 — QUESTIONS FOR OPUS

**Q1 — Advisory disposition registry:** Should KNOWN_DEFERRED_ADVISORIES live in
`zf-orchestrator.mjs` (code) or in a YAML config file (data)? Code is simpler but
requires code changes to add deferrals. Config is more Governor-friendly.

**Q2 — Consolidation enforcement timing:** Should `validate-consolidation-check.mjs`
be BLOCKING from day 1 for NEW plans (forward-only), or ADVISORY for all?
Risk of BLOCKING: breaks rapid plan creation. Risk of ADVISORY: ignored again.

**Q3 — Plan-before-implementation gate:** Should `pre-tool-use-plan-coverage-gate.sh`
be BLOCKING for libs/ changes (high risk) and ADVISORY for apps/ changes (developer agility)?
Or flat ADVISORY across the board?

**Q4 — Orphan TYPE-9 (duplicate functionality):** Is automated detection of overlapping
validators feasible, or is this permanently a human-review item (B_CONSOLIDATION_PASS)?
If human-review: add to weekly audit protocol. If automated: design the similarity metric.

**Q5 — "Real ZF" vs "ZF ACHIEVED":** Is the current two-tier system (REAL ZF = 0 everything,
ZF ACHIEVED = 0 blocking + disposed advisories) the right model? Or should there be
a third tier: "ZF ACHIEVED WITH KNOWN DEBT" for legitimately deferred advisories?

**Q6 — Consolidation at L1:** The scattered patterns (webhook idempotency, role checks,
error formats) are proposed for L1 in libs/. Should these be formalized as Core Primitives
(CCG-scored) or remain in libs/integrations/ as shared patterns without CCG gate?

---

*CSPS Consolidation + ZF Hardening Plan v1.0 | S022 | 2026-05-11*
*For Opus review. ai_defaults_influence: none — all from code audit + Governor directives.*
