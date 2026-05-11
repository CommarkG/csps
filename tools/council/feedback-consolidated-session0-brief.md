# CONSOLIDATED SONNET BRIEF — Sessions 0-A Implementation
## Source: Opus Feedback Files 1 (Core Primitives) + 2 (Consolidation + ZF Hardening)
## Written by: OPUS-1 | For: Sonnet Builder tab | S022 | 2026-05-11

---

> **How to use this file:** This is your complete implementation brief for Sessions 0 and A.
> Read top to bottom. Do not skip evidence gates. Paste every verification output.

---

## §0 — CURRENT STATE (Verify Before Starting)

```bash
pnpm verify          # Must exit_code=0
node tools/zf-orchestrator.mjs --level 3  # Confirm current baseline
git log --oneline -3  # Confirm last commit
```

---

## §1 — RATIFIED DECISIONS FROM OPUS REVIEW

### From Core Primitives Feedback (File 1)

| Item | Decision |
|---|---|
| Phase 0 proceed | CCG gate + registry + DNA Element 14 documentation — APPROVED |
| Calendar Phase 1 | Gregorian-only interface. NO multi-calendar, NO RecurrenceRule, NO holidays |
| Notification Phase 1 | Thin wrapper around Resend/Postmark. idempotencyKey field required |
| CCG formula | Revised: Prevalence 35%, Cost 35%, Stability 30% |
| File Storage | Re-scored → DEVELOPER LAYER (not CORE). Use Supabase Storage in libs/integrations/ |
| GDPR × Notifications | eraseUser() MUST be extended to cover notification logs before Phase 1 |
| ADR template | Must exist BEFORE writing CalendarEngine/Notification ADRs |

### From Consolidation + ZF Hardening Feedback (File 2)

| Item | Decision |
|---|---|
| KNOWN_DEFERRED format | YAML config at `tools/config/known-deferred-advisories.yaml` (not code) |
| Consolidation enforcement | BLOCKING for S023+ new plans. ADVISORY for existing plans (grace) |
| Plan-before-implementation gate | BLOCKING for libs/**. ADVISORY for apps/**. O(1) cache required |
| TYPE-9 orphan detection | Human-review permanently. Add to weekly audit. |
| ZF tiers | Keep TWO tiers. No "WITH KNOWN DEBT" third tier |
| Scattered patterns | libs/integrations/ as shared conventions. NOT CCG Core Primitives |
| Error format | { error, message, details? } — remove renewal_url from L1 |
| API response wrapper | RECOMMENDATION only in CSPS_DEVELOPER_GUIDE.md. Do not enforce via validator |

---

## §SESSION-0 — CRITICAL ITEMS ONLY

**Scope:** Governance machinery cleanup. ZERO new code in apps/. ZERO new primitives.
**Rule:** Session 0 must be completable in 1 session. Do not add scope.

### STEP 0-1: Create KNOWN_DEFERRED YAML

Create `tools/config/known-deferred-advisories.yaml`:
```yaml
# CSPS Known Deferred Advisories Registry
# Add entries here when an advisory cannot be resolved now.
# MANDATORY: review_by_session must be a future session.
# When review_by_session passes: orchestrator surfaces as OVERDUE_REVIEW.

known_deferred:
  - id: open-plan-levels
    reason: "97 open items = real outstanding work in Sessions 0-D + App#2 planning"
    review_by_session: S025
    owner: governor
    deferred_at: S022
```

Update `tools/zf-orchestrator.mjs` to read this file:
```javascript
import { readFileSync } from 'fs';
import { parse } from 'yaml';  // or use JSON.parse if no yaml parser available

const DEFERRED_CONFIG_PATH = resolve('tools/config/known-deferred-advisories.yaml');
const KNOWN_DEFERRED = existsSync(DEFERRED_CONFIG_PATH)
  ? parse(readFileSync(DEFERRED_CONFIG_PATH, 'utf8')).known_deferred
  : [];
```

Add comment in `tools/verify.mjs` near the `zf_orchestrator` entry:
```javascript
// known-deferred-advisories.yaml consumed by zf-orchestrator at runtime (not a verify cycle)
// Path: tools/config/known-deferred-advisories.yaml
```
This prevents the config file becoming a TYPE-8 orphan (config without documented consumer).

### STEP 0-2: Orphan cleanup

```bash
# TYPE-1 orphan: stamp-domain-path.mjs
mkdir -p tools/archive
mv tools/stamp-domain-path.mjs tools/archive/stamp-domain-path.mjs
# Add comment in archive file: "# One-time script from S022. Archived not deleted for reference."

# TYPE-7 orphans in apps/ (diagnostic scripts — already deleted in S022, confirm)
ls apps/task-mgmt/*.mjs 2>&1  # Should show: no such files
```

For `tools/copy-zenstack-output.mjs` (TYPE-1, needs WIRING not archiving):
Add to `session-open.sh` as an optional pre-check comment:
```bash
# ZenStack path workaround (if ZenStack bypass detected): node tools/copy-zenstack-output.mjs
# Only needed when STEP 3a (generate from apps/task-mgmt/) fails
```

### STEP 0-3: Promote pre-tool-use-rzf-evidence-gate.sh to ADVISORY

**Before promoting:** specify exactly what pattern the hook looks for.

Read current `.claude/hooks/pre-tool-use-rzf-evidence-gate.sh`. Confirm it exists as STUB.

The hook spec (what it checks):
```bash
# When: Write or Edit tool call
# Checks: does the session have recent RZF evidence?
# Pattern to look for: "## RZF VERIFICATION" in the last 5 turns
# If found: allow (green path)
# If not found AND Write target is libs/** or docs/plan/**/*.md: 
#   → ADVISORY warning: "No RZF section found in recent output. Add ## RZF VERIFICATION before closing."
# NOT BLOCKING yet (week-4 → blocking after K=2)
```

Update the hook from STUB to this ADVISORY logic. Per diff-before-write discipline:
present the change in chat and wait for Governor confirmation before editing .claude/hooks/*.

### STEP 0-4: Promote pre-tool-use-plan-coverage-gate.sh to ADVISORY

**Spec for ADVISORY behavior:**
```bash
# Fires on: Write or Edit to libs/**/*.ts or apps/*/src/**/*.ts
# Checks: is there a ratified plan (lifecycle_state: active) covering this work?
# Cache plan list in-memory for the session (not re-read per invocation)
# For libs/**:
#   → If no plan found: "⚠ [plan-coverage] No active plan found for libs/ change.
#      Plans at: docs/plan/_handoff/VAULT/topic-plans/
#      Advisory — proceed with intent noted."
# For apps/**:
#   → ADVISORY always (developer agility preserved)
# NOT BLOCKING for either path (week-4 after plan scope audit)
```

Present diff + wait for Governor confirmation before editing .claude/hooks/*.

### STEP 0-5: Batch add §0 CONSOLIDATION CHECK to existing active plans via script

DO NOT manually edit 13 plan files. Write a script:

```javascript
// tools/generators/add-consolidation-section.mjs
// Scans all docs/plan/_handoff/VAULT/topic-plans/*.md with lifecycle_state: active
// If file does NOT contain "## §0 — CONSOLIDATION CHECK":
//   Prepend section after frontmatter (after the first ---...--- block)
//   Section content:
//   ## §0 — CONSOLIDATION CHECK
//   CHECK WHAT EXISTS before any implementation step in this plan.
//   Search: tools/validators/ | tools/generators/ | .claude/hooks/ | audit-runner.md | topic-plans/
//   Consolidation finding: [update when implementing each step]
```

Run: `node tools/generators/add-consolidation-section.mjs`
Then: `pnpm verify` — must pass.

### STEP 0-6: Add ZF status levels to zf-orchestrator.mjs

In the orchestrator output, update the status messages to match the three defined states:

```javascript
// When truly zero:
"REAL ZF ACHIEVED ✅ — TRULY ZERO FINDINGS"

// When 0 blocking + all advisories disposed:
"ZF ACHIEVED ✅ — {N} advisory warning(s) remain [DISPOSED]"

// When blocking remains:
"BLOCKING FINDINGS REMAIN ❌ — {N} blocking finding(s)"
```

### STEP 0-7: Add CCG Phase 0 artifacts (Core Primitives — NO implementation)

Create `docs/plan/pillar-0-governance/core-primitives-registry.md`:
```markdown
---
id: csps.pillar-0.core-primitives-registry
name: core-primitives-registry
description: Registry of CSPS Core Primitives — functional capabilities sealed at L1 that all apps inherit.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: pillar_0_governance_leaves
domain_path: platform
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - maturity:stable
---

# CSPS Core Primitives Registry

| ID | Primitive | L1 Location | CCG Score | Status |
|----|-----------|-------------|-----------|--------|
| CP-001 | Calendar & Time | libs/core/calendar/ | 9.25 | PROPOSED (Opus: Gregorian-only Phase 1) |
| CP-002 | Notifications | libs/core/notifications/ | 8.75 | PROPOSED (Opus: thin wrapper, GDPR gap) |
```

Create `tools/templates/adr.template.md`:
```markdown
# ADR-[NNN]: [Title]
**Date:** [YYYY-MM-DD]
**Status:** PROPOSED | ACCEPTED | DEPRECATED | SUPERSEDED
**Deciders:** Governor + [relevant roles]

## Context
[What is the issue motivating this decision?]

## Decision
[What is the change being made?]

## Interface (if applicable)
[Exact TypeScript interface / schema / protocol being sealed]

## Consequences
**Positive:** [what this enables]
**Negative:** [what this constrains]
**Mitigation:** [how constraints are managed]

## Alternatives considered
[Other options evaluated and why they were not chosen]

## Enforcement
[How this is mechanically enforced: validator / hook / contract]
```

Update `docs/plan/pillar-0-governance/csps-platform-dna.md` §1 — add Element 14:
```
| 14 | Domain Primitives (sealed L1 functional capabilities) |
|    | libs/core/ directory + core-primitives-registry.md |
|    | validate-core-primitive-usage.mjs (TO BUILD Phase 1) |
```

Update `docs/plan/pillar-0-governance/plan-creation-protocol.md` Step 2 — add CCG:
```
Step 2 DNA Gate — check: does this plan propose a new functional capability?
  If yes: compute CCG score (formula in core-primitives-architecture.md §4.2, revised weights)
  CCG ≥ 7.0 → register in core-primitives-registry.md as PROPOSED → VLT required
  CCG 4.0-6.9 → libs/integrations/ as shared pattern, no CCG gate
  CCG < 4.0 → app layer, no registration needed
```

### STEP 0-8: Shared patterns from consolidation (libs/integrations/ only)

Create `libs/integrations/errors.ts`:
```typescript
// CSPS standard error response shape — L1 convention (not Core Primitive)
// Apps may extend via their own error types
export interface CspsError {
  error: string          // machine-readable code (e.g., 'subscription_inactive')
  message: string        // developer-facing description
  details?: Record<string, unknown>  // app-specific extensions
}

export function createError(error: string, message: string, details?: Record<string, unknown>): CspsError {
  return { error, message, ...(details ? { details } : {}) };
}
```

Create `libs/integrations/webhook-idempotency.ts`:
```typescript
// Prevents duplicate webhook processing when Stripe/Clerk retries delivery
// Usage: call isProcessed(key) before handling; call markProcessed(key) after

import type { PrismaClient } from '@prisma/client';

export async function isProcessed(webhookKey: string, db: PrismaClient): Promise<boolean> {
  // Store in a simple key-value table or check existing tables for this event
  // For now: use AuditEvent as the idempotency store
  const existing = await db.auditEvent.findFirst({
    where: { action: `webhook.processed.${webhookKey}` },
  });
  return !!existing;
}

export async function markProcessed(
  webhookKey: string,
  tenantId: string,
  db: PrismaClient
): Promise<void> {
  await db.auditEvent.create({
    data: {
      action: `webhook.processed.${webhookKey}`,
      actorId: 'system',
      resourceType: 'Webhook',
      resourceId: webhookKey,
      tenantId,
      data: {},
    },
  });
}
```

Export from `libs/integrations/index.ts`:
```typescript
export { createError } from './errors';
export { isProcessed, markProcessed } from './webhook-idempotency';
```

### STEP 0-9: Session 0 verification

```bash
pnpm verify
```
PASTE output. Must be exit_code=0.

```bash
node tools/zf-orchestrator.mjs --level 3
```
PASTE output. Must show ZF ACHIEVED (open-plan-levels DEFERRED in YAML).

Evidence gates:
```
[S0-E1] known-deferred-advisories.yaml: exists, open-plan-levels entry with review_by_session
[S0-E2] tools/stamp-domain-path.mjs: moved to tools/archive/
[S0-E3] core-primitives-registry.md: exists with CP-001 and CP-002 as PROPOSED
[S0-E4] adr.template.md: exists at tools/templates/adr.template.md
[S0-E5] plan-creation-protocol.md: Step 2 updated with CCG assessment
[S0-E6] csps-platform-dna.md: Element 14 added
[S0-E7] libs/integrations/errors.ts: exists, exports createError
[S0-E8] libs/integrations/webhook-idempotency.ts: exists, exports isProcessed + markProcessed
[S0-E9] add-consolidation-section.mjs ran successfully, §0 section in all active plans
[S0-E10] pnpm verify: exit_code=0 [PASTE]
```

---

## §SESSION-A — VALIDATORS + CONTRACT (After Session 0 complete + complexity check)

**Gate:** Before starting Session A, run the complexity score check.
If score > 23 (approaching YELLOW): implement only the first 2 items. Defer the rest.

### STEP A-1: validate-consolidation-check.mjs

```javascript
// Scans all topic-plans/*.md
// BLOCKING for plans with session: S023 or later missing §0 section
// ADVISORY for plans with session: S022 or earlier
// Check for: "## §0 — CONSOLIDATION CHECK" (header, not the phrase)
```

Wire to `pnpm verify` + `audit-runner.md` slug: `consolidation-check-coverage`.

### STEP A-2: validate-plan-zf-requirement.mjs

```javascript
// Scans active topic-plans/*.md
// ADVISORY if zf_required_level field missing (encourage adoption)
// Log: which plans have it, which don't
```

Wire to `pnpm verify` + `audit-runner.md` slug: `plan-zf-requirement-coverage`.

### STEP A-3: B_NO_IMPLEMENTATION_WITHOUT_PLAN contract

Add to `docs/plan/pillar-0-governance/behavioral-contracts.md`:
```
## B_NO_IMPLEMENTATION_WITHOUT_PLAN

**Canonical:** No code changes to libs/ or apps/*/src/ outside of a ratified plan
(lifecycle_state: active in topic-plans/). Exception: emergency security fixes (documented
immediately after in a post-hoc plan entry).

**Counterweight:** plan-coverage-gate is ADVISORY — developer judgment applies for obvious
in-scope changes. BLOCKING promoted at Session B after plan scope audit complete.

**Mechanical:** pre-tool-use-plan-coverage-gate.sh (ADVISORY→BLOCKING Session B)
```

### STEP A-4: Session A verification

```bash
pnpm verify        # exit_code=0
pnpm audit-runner:split  # sync slices
```

Evidence:
```
[SA-E1] validate-consolidation-check.mjs: runs, BLOCKING for S023+ plans without §0
[SA-E2] validate-plan-zf-requirement.mjs: runs, advisory list produced
[SA-E3] behavioral-contracts.md: B_NO_IMPLEMENTATION_WITHOUT_PLAN entry added
[SA-E4] pnpm verify: exit_code=0 [PASTE]
```

---

## §PENDING — Core Primitives Phase 1 (Session D or later)

**Do NOT implement until these conditions are met (from Opus File 1):**

1. CCG formula updated in core-primitives-architecture.md (Stability 30%)
2. ADR template exists (DONE in Session 0)
3. CalendarEngine ADR written + ratified (Gregorian-only, withConfig pattern)
4. NotificationService ADR written + ratified (idempotencyKey, GDPR hook in interface)
5. GDPR erasure extended to notification logs (design, not implementation)

**What Phase 1 implementation looks like (after all 5 conditions met):**
- `libs/core/calendar/interface.ts` — Gregorian-only CalendarEngine interface
- `libs/core/calendar/index.ts` — implementation wrapping date-fns (or Temporal when available)
- `libs/core/notifications/interface.ts` — NotificationService wrapping Resend
- Tenant schema: `tenantCalendarConfig Json?` field added (requires pnpm db:push)
- apps/task-mgmt migrated to `@csps/core/calendar` for due dates

---

## §FLEXIBILITY MAP

| When feedback arrives | Edit this file | Change |
|---|---|---|
| "Add a new deferred advisory" | `tools/config/known-deferred-advisories.yaml` | Add entry with review_by_session |
| "Change CCG threshold" | `core-primitives-architecture.md §4.2` | Update formula weights |
| "Add new Core Primitive" | `core-primitives-registry.md` | Add row as PROPOSED |
| "Consolidation hook too noisy" | `.claude/hooks/pre-tool-use-consolidation-prompt.sh` | Adjust trigger conditions |
| "Plan gate false positive" | `.claude/hooks/pre-tool-use-plan-coverage-gate.sh` | Widen cache pattern |

---

## §VERIFICATION CHECKLIST

After each session:
```
□ pnpm verify: exit_code=0 — PASTED
□ All evidence blocks — PASTED
□ Complexity score checked (target: stay GREEN < 25)
□ No scope added beyond this brief
□ git commit + git push
```

---

*Consolidated Sonnet Brief — Sessions 0-A*
*Sources: Opus Feedback File 1 (Core Primitives) + File 2 (Consolidation + ZF Hardening)*
*Governance decisions: CONDITIONAL SEAL on both plans per Opus Core Council review*
*All Opus conditions must be met before Phase 1 (Core Primitives) begins*
*OPUS-1 | S022 | 2026-05-11*
