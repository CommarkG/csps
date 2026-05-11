# OPUS CORE COUNCIL FEEDBACK — Core Primitives Architecture
## Plan reviewed: docs/plan/_handoff/VAULT/topic-plans/csps-core-primitives-architecture.md
## Council type: CORE (depth-5, constitutional — DNA Element 14)
## Written by: OPUS-1 | S022 | 2026-05-11

---

> This file is Feedback File 1 of 3. Awaiting Sonnet's second document before
> consolidated implementation plan is produced.

---

## ORCHESTRATOR DECISION

```
Council type: CORE (depth_chosen: 5, constitutional DNA change)
Members invoked: ALL SIX
Sequence: Security → SaaS Architect → Platform Developer → Reliability → Balance → Opus
Opus audit: MANDATORY
```

---

## SECURITY REVIEWER

**Finding: ADVISORY (one gap requires resolution before Phase 1)**

**Q1 — Tenant data isolation through CalendarEngine?**
CalendarEngine.forTenant(tenantId) reads TenantCalendarConfig from the Tenant table.
This config contains timezone, working days, and holidays — not PII, low sensitivity.
ZenStack policies on Tenant already gate tenant-to-tenant access. Isolation: ADEQUATE.

**Q2 — Notification idempotency (GAP):**
NotificationService.send() has no idempotency key in the interface.
Duplicate webhook delivery → duplicate notification sent to user. At scale this is real.
Fix: add `idempotencyKey?: string` to the send() options. Caller generates; service deduplicates.

```typescript
send(opts: {
  ...
  idempotencyKey?: string  // ADD THIS — prevents duplicate delivery
}): Promise<{ notificationId: string }>
```

**Q3 — GDPR interaction with NotificationService (CRITICAL GAP):**
NotificationService.send() stores logs containing: recipient email, notification body, template variables.
The GDPR eraseUser() function (Session 3) covers User.email, User.displayName, TaskComment.body.
It does NOT cover notification logs. Any sent notification mentioning the user by name or email
is PII that must be erasable.

Before NotificationService Phase 1 ratification: GDPR erasure must be extended:
```
eraseUser() step N+1: anonymize NotificationLog rows where recipientId = userId
  → recipient_email: '[deleted]'
  → variables: strip any variable containing the user's name or email
  → body: '[deleted]' (or hash if archival integrity needed)
```

This is not optional. An EU user requesting erasure after receiving notifications — their
notification history must be erasable. Build the GDPR extension BEFORE or CONCURRENT with Phase 1.

**Q4 — Enforcement bypass:**
`validate-ccg-declared.mjs` catches static imports. It does NOT catch:
- Dynamic imports: `const { CalendarEngine } = await import('date-fns')`
- Server-side in API routes that don't import directly but call a helper

Advisory finding: accept at ADVISORY severity. Dynamic import bypass is detectable at runtime
(rare in TypeScript); helper bypass is caught by code review.

**Security verdict: ADVISORY (not BLOCKING) — idempotency key needed, GDPR interaction required before Phase 1.**

---

## SAAS ARCHITECT

**Finding: ADVISORY (timing concerns, one formula correction)**

**Q1 — Calendar × Billing interaction (unaddressed gap):**
Subscription billing dates are timezone-sensitive. "Monthly renewal on the 15th" means the 15th
at midnight UTC, which could be the 14th in New York or the 16th in Tokyo. The CalendarEngine
covers app-facing dates but does NOT cover billing-calendar integration.

This is acceptable for Phase 1 because billing is handled by Stripe (UTC-based). But if CSPS
ever offers fixed-date billing (vs. anniversary billing), this gap matters. Flag as VLT for Phase 2.

**Q2 — Notification × Subscription gating (design question):**
If a tenant's subscription is CANCELLED, should their users still receive notifications?
Current design: NotificationService has no subscription awareness. Each call site must check.
Better design: NotificationService.send() accepts `skipIfCancelled?: boolean`.
This centralizes the policy instead of scattering subscription checks across the codebase.
Add to L1 interface design before sealing.

**Q3 — CCG scoring on speculative app count:**
CCG scores use "% of 30 planned apps." But CSPS has 1 app. Calendar at 90% of 30 apps = 27 apps.
In reality: 90% of 1 app = 1 app. The scores are projections, not evidence.
This is Sonnet's Q5 — I strongly agree. Scores are valid for PLANNING but not for SEALING.

Rule: no L1 seal until 2+ apps demonstrate the pattern (minimum evidence base for the Rule of Three).
CCG can exist as a routing gate (Phase 0) without any L1 being sealed.

**Q4 — File Storage scoring of 7.5 is too high:**
File Storage scores 7.5 → CORE. But S3/Supabase Storage/R2 APIs are nearly identical (upload, download, delete, presigned URL). The abstraction value is LOW — you're not hiding meaningful complexity; you're just wrapping a commodity API. What matters: standardize on ONE provider (Supabase Storage, already used), not wrap all providers behind an interface.

Recommendation: File Storage → DEVELOPER LAYER (4.0-6.9 range). Reduce CCG score to 5.0.
Standardize on Supabase Storage in libs/integrations/storage.ts (simple, no abstraction needed).

**SaaS verdict: ADVISORY — address notification subscription gating + GDPR in L1 interface. Adjust File Storage CCG score.**

---

## PLATFORM DEVELOPER

**Finding: ADVISORY (developer experience gaps)**

**Q1 — CalendarEngine.forTenant() performance:**
Every API route rendering tasks with due dates calls CalendarEngine.forTenant(tenantId).
This is a DB read on every call if not cached. At 1,000 task renders per minute → 1,000 DB reads/min
just for calendar config (which rarely changes).

Recommendation: cache tenant calendar config in memory (with invalidation on tenant update).
The L1 interface should return a cached instance:
```typescript
// Not every call goes to DB:
const cal = await CalendarEngine.forTenant(tenantId, { cache: 'memory', ttl: 300 })
```
Or: load TenantCalendarConfig once per request in middleware and pass to CalendarEngine:
```typescript
const cal = CalendarEngine.withConfig(req.tenant.calendarConfig)
```
The second pattern (config passed in) is simpler and more testable. Recommend this for L1.

**Q2 — @csps/core tsconfig path alias (missing):**
`import { CalendarEngine } from '@csps/core/calendar'` requires `@csps/core` in tsconfig paths.
This is the same issue that was IMMEDIATE-1 in the Sonnet brief for @csps/config.
Must be added to ALL apps' tsconfig.json — this is a non-trivial migration step.

Add to IMMEDIATE tasks for Phase 1:
```json
"@csps/core/*": ["../../libs/core/*"]
```

**Q3 — Multi-calendar UI components not addressed:**
The L1 interface supports multi-calendar display, but UI components (date pickers, calendar views)
must also be calendar-system-aware. A Gregorian date picker cannot display a Hebrew date.
This is NOT in scope for Phase 1 (Phase 1 is backend interface only) but should be flagged:
the UI component library will need calendar-aware variants before apps can USE multi-calendar display.

**Q4 — App inheritance is implicit:**
When App #2 developer starts: do they know they must use CalendarEngine?
The answer is in CSPS_DEVELOPER_GUIDE.md (to be built in Session D) and in validate-ccg-declared.mjs.
But until both exist, App #2 devs will import date-fns directly (because that's what they know).
The import ban must land BEFORE App #2 starts building, not after.

**Platform developer verdict: ADVISORY — add caching strategy to L1 interface. tsconfig alias required. Multi-calendar UI is Phase 2+.**

---

## RELIABILITY ENGINEER

**Finding: ADVISORY (critical runtime concerns)**

**Q1 — Holiday data is time-sensitive (maintenance gap):**
Holiday databases change annually (government decisions, new holidays, country changes).
The IANA timezone database updates 2-4 times per year. The current design treats holidays
as static (CalendarDate[] or 'auto'). 'auto' from what source? Updated how often?

Options ranked:
- A: Bundle holiday data and release updates with CSPS → maintenance burden
- B: Call a holiday API at runtime → external dependency, latency
- C: Use a well-maintained npm package (date-holidays, @date-io/*) → update via pnpm update
- D: Accept Gregorian-only for Phase 1 (no holiday awareness) → simplest, fewest surprises

Recommendation: **Option D for Phase 1** (Gregorian, no holiday awareness). Add holiday awareness
in Phase 2 after researching the update mechanism. Avoid baking in a maintenance pattern
before understanding the cost.

**Q2 — DST handling in workingDaysBetween() (unspecified):**
If start and end span a Daylight Saving Time transition, does workingDaysBetween() count
wall-clock days or calendar days? A "working day" that is only 23 hours long vs. 25 hours
affects scheduling precision. The interface does not specify this behavior.

Must be specified in the L1 interface documentation before sealing. Not optional — different
implementations will make different choices, producing bugs that are very hard to debug.

**Q3 — RecurrenceRule can produce infinite arrays (safety concern):**
`createRecurrence(rule: RecurrenceRule): Date[]` — if the rule is "every day forever" with no
end date, this returns an infinite array. The calling code must set a max_count.

Fix: remove unbounded createRecurrence(). Replace with a paginated interface:
```typescript
// Instead of:
createRecurrence(rule: RecurrenceRule): Date[]

// Use:
getNextOccurrences(rule: RecurrenceRule, after: Date, count: number): Date[]  // max 1000
nextOccurrence(rule: RecurrenceRule, after: Date): Date
```

**Q4 — NotificationService.sendBatch() is underspecified:**
At 10,000 recipients, send rate limits, retry logic, and queue management matter significantly.
The current L1 interface has `sendBatch(opts: SendBatchOptions): Promise<BatchResult>` but
`SendBatchOptions` and `BatchResult` are not defined in the plan.

For Phase 1: limit sendBatch() to max 100 recipients (documented constraint). Anything larger
must go through a queueing system that doesn't exist yet.

**Reliability verdict: ADVISORY — specify DST handling, cap RecurrenceRule, defer holiday awareness to Phase 2, cap sendBatch to 100 for Phase 1.**

---

## BALANCE EXPERT

**Finding: ADVISORY (genuine moat, but premature sealing risk)**

**Moat vs. overhead classification:**

| Component | Classification | Reasoning |
|---|---|---|
| CalendarEngine L1 interface | MOAT | Every future app gets multi-calendar free |
| NotificationService L1 interface | MOAT | Consistent notification behavior across 30 apps |
| CCG routing gate | OVERHEAD → MOAT | Pure governance now; becomes a moat when 30 apps validate it |
| validate-ccg-declared.mjs | OVERHEAD | Enforcement mechanism, no user value |
| validate-core-primitive-usage.mjs | OVERHEAD | Same |
| core-primitives-registry.md | OVERHEAD → documentation | Valuable reference, low maintenance cost |

**Complexity delta:**
```
Current complexity score: 18.2 (GREEN < 25)
Adding:
  +2 validators (ccg-declared + core-primitive-usage)
  +1 DNA element documentation
  +CCG assessment in every plan
  +2 ADRs per Phase 1 primitive
Estimated new score: 18.2 + ~3.5 = ~21.7 (GREEN but approaching caution zone)
```

Verdict on timing: the CCG GATE (Phase 0) adds ~1 point of complexity. Acceptable.
The SEALED L1 interfaces (Phase 1) add the other ~2.5 points. Acceptable if earned by evidence.

**The Rule of Three applied:** Seal an interface only when 3 different use cases show the SAME need.
- CalendarEngine: task-mgmt (due dates), any date-involving app, any date-formatted display = 3 use cases in 1 app. VALID for Phase 1.
- NotificationService: email confirmation, task assignment, membership invitation = 3 use cases in 1 app. VALID for Phase 1.

The balance is ACCEPTABLE for Phase 1 Calendar + Notification if interfaces are Gregorian-first (simpler).

**Balance verdict: ADVISORY — CCG Phase 0 has good moat/overhead ratio. Phase 1 acceptable with simplified interfaces (Gregorian-first, cap at 100 batch).**

---

## OPUS FINAL AUDIT

### 5 Mental Models Applied

**1. Cross-File Lens — does this form a coherent system?**

The plan connects to 9+ system surfaces:
- schema.zmodel: Tenant.tenantCalendarConfig field (JSON)
- tsconfig.json: @csps/core path alias (missing from plan)
- plan-creation-protocol.md: Step 2 CCG assessment
- csps-platform-dna.md: Element 14 addition
- AGENTS.md: new banned imports (date-fns, nodemailer, etc.)
- core-primitives-registry.md: new file (to create)
- ADR files: 2 needed (one per Phase 1 primitive)
- libs/core/ directory structure: new
- GDPR eraseUser(): must be extended (not mentioned in plan)

**Missing connection found:** The plan does not confirm whether CSPS has an ADR template.
Before writing the CalendarEngine ADR, the ADR format must exist. Check: does `docs/plan/` have
an ADR template? If not, create `tools/templates/adr.template.md` in Phase 0.

**Missing connection found:** CalendarEngine.withConfig(config) (recommended caching pattern)
takes `TenantCalendarConfig` as input. This config comes from the Tenant DB record. The chain:
`getEnhancedDb() → tenant.tenantCalendarConfig → CalendarEngine.withConfig(config)` must be
explicit in the plan. Currently implied, not specified.

**2. Time Projection (30 apps, 10,000 tenants)**

At 30 apps with 10,000 tenants each calling CalendarEngine per request:
- Holiday database updates: annual manually? Unscalable. Phase 2 requires automated source.
- Calendar config in every request: caching is not optional at this scale, it's necessary.
- RecurrenceRule unbounded arrays: at 30 apps, one developer mistake creates an OOM condition.

The interface designed for 1 app may fail silently under load at 10 apps.
**The most load-sensitive decisions must be right in Phase 0, not fixed in Phase 3.**

**3. Coverage Enumeration — what is NOT proven**

The plan does NOT prove:
- Hebrew calendar conversion accuracy (lunar calendar arithmetic is non-trivial)
- Ethiopian/Persian/Julian calendar accuracy (even smaller market, even less test coverage)
- Historical date handling (what is Jan 1, 1900 in Hebrew calendar? Edge cases exist)
- The CalendarEngine can be tested without a running DB (testability of the interface)
- Holiday databases are legally usable (some require licenses)
- TEMPORAL API (JavaScript TC39 proposal) migration path when it standardizes

**4. Self-Referential — does this governance obey its own rules?**

The plan proposes CCG as a mandatory gate for all new feature proposals.
**Does the plan itself have a CCG assessment?** No. The plan DESCRIBES the CCG but doesn't
score itself through it. This is a self-referential gap — the plan that proposes governance
must comply with that governance at the time of proposal.

Before Phase 0 ratification: add `ccg_assessment` to plan frontmatter:
```yaml
ccg_assessment:
  prevalence: 10       # Every new feature proposal goes through CCG
  cost_of_not_sharing: 6
  interface_stability: 5
  ccg_score: 7.35
  classification: core
  rationale: "CCG itself is a core governance mechanism applicable to all 30 apps"
```

**5. Moat Measurement — compound or consume?**

- CalendarEngine sealed L1: COMPOUNDS (every future app inherits multi-calendar)
- CCG gate: OVERHEAD (consumes governance attention) → CONVERTS to MOAT when all 30 apps are correctly routed
- The moat is real. The timing is the only question.

**Answers to Sonnet's §10 Questions:**

| Q# | Position | Recommendation |
|---|---|---|
| Q1 (CCG weights) | Stability weight is too low | Revise: Prevalence 35%, Cost 35%, Stability 30% |
| Q2 (Library abstraction) | Mixed — Calendar: YES. File Storage: NO | Abstract Calendar (complex). Standardize on Supabase Storage (commodity). |
| Q3 (Calendar complexity) | Phase 1 = Gregorian-only | Seal narrow interface. Design for extensibility. Multi-calendar = Phase 2. |
| Q4 (Notification scope) | Thin wrapper is correct | Wrap Resend or Postmark. Don't build delivery infrastructure. |
| Q5 (30-app question) | Agree — premature to SEAL, not premature to ROUTE | CCG Phase 0 proceeds. L1 sealing requires 2+ apps. |
| Q6 (Enforcement timing) | ADVISORY until 2+ primitives SEALED | Never BLOCKING in Phase 0. Start ADVISORY on Phase 1 commit. |

**New question Sonnet did not ask (Q7 — critical):**

**Q7 — GDPR × NotificationService:** Notification logs are PII. Before NotificationService is
ratified for Phase 1, the GDPR erasure path for notification history must be designed.
The eraseUser() function MUST be extended to cover notification logs. This is not a nice-to-have
— it is a legal requirement under GDPR Article 17. Design it in the interface from day 1.

---

## OPUS VERDICT

**CONDITIONAL SEAL for Phase 0.**
Phase 1 ratification requires all 5 conditions below.

**Phase 0 — PROCEED (CCG gate + registry + DNA Element 14 documentation):**

Nothing in Phase 0 requires sealing. CCG as a routing gate is pure governance overhead with
high future moat value. DNA Element 14 documentation is documentation. These can proceed.

**Phase 1 — CONDITIONAL on resolving these 5 items:**

```
CONDITION 1: Revise CCG formula
  Prevalence: 35% (was 40%)
  Cost: 35% (unchanged)
  Stability: 30% (was 25%)
  Re-score all primitives with revised formula.
  File Storage re-scores as DEVELOPER LAYER (not CORE).

CONDITION 2: Calendar Phase 1 = Gregorian-only + extensibility design
  Phase 1 interface: remove multi-calendar types from CalendarDate
  Design the interface with a 'gregorian' default but extension point:
    CalendarSystemId = 'gregorian' // Phase 1
    // Phase 2 will extend to: 'gregorian' | 'hebrew' | 'hijri' | ...
  Holiday awareness: defer to Phase 2 (use 'none' as only valid option in Phase 1)
  Remove: RecurrenceRule (defer to Phase 2)

CONDITION 3: NotificationService L1 must include
  idempotencyKey?: string in send() options
  sendBatch(): max 100 recipients (documented)
  GDPR hook: erasureNotifications(userId) method or design note on eraseUser() extension

CONDITION 4: CalendarEngine interface must specify
  caching strategy (recommend: withConfig(config) pattern — config passed in, not DB-fetched)
  DST handling in workingDaysBetween() (document the behavior explicitly)
  Testability: can CalendarEngine be used in unit tests without a DB connection?

CONDITION 5: ADR template must exist before ADRs are written
  Check: does docs/plan/ or tools/templates/ have an adr.template.md?
  If not: create it in Phase 0 (before writing CalendarEngine ADR)
```

**Seal language (when Conditions 1-5 are met):**

```yaml
ratification_status: SEALED
sealed_by: "OPUS-1 Sonnet 4.6[1M] 2026-05-11"
sealed_session: S022
council_type: core
seal_conditions_met: false  # changes to true when Conditions 1-5 addressed
```

---

## RZF VERIFICATION
Cycles run: 3 | Gaps surfaced: 3 | Critical gaps: 1 (GDPR × Notifications)
Cycle 1: What did this review miss?
  Findings: 3 — (a) ADR template existence unverified,
  (b) CalendarEngine DB access path unspecified,
  (c) @csps/core tsconfig alias not mentioned in plan
Cycle 2: All three addressed above? Yes — in Platform Developer section and Cross-File Lens.
  Findings: 1 — Did I check if GDPR erasure gap is in all 6 member reviews? Security found it.
  Balance Expert didn't explicitly flag it but Security + Opus did. Coverage complete.
Cycle 3: 0 new findings.
Status: ZF ACHIEVED

---

*OPUS Core Council Feedback — Core Primitives Architecture*
*Feedback File 1 of 3 — awaiting Sonnet's second document*
*Verdict: CONDITIONAL SEAL (Phase 0 proceeds; Phase 1 blocked on 5 conditions)*
*OPUS-1 | S022 | 2026-05-11*
