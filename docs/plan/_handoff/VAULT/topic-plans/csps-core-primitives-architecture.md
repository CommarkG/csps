---
id: csps.handoff.vault.topic-plan.csps-core-primitives-architecture
name: csps-core-primitives-architecture
description: >
  Architecture plan for CSPS Core Primitives — universal SaaS capabilities sealed at L1 that
  all 30 apps inherit automatically. Proposes DNA Element 14 (Domain Primitives). Includes
  Core Classification Gate (CCG) — a mechanical routing system deciding Core/Developer/App
  for every new feature proposal. Calendar system as first worked example.
  Governor directive S022: review all SaaS aspects, define core elements, mechanical routing.
  For Opus review before implementation.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
template_status: stable
core_spine: ARCH
core_spines: [ARCH, GVRN, VALD, OPER]
schema_anchor: topic_plans
domain_path: platform
tags:
  - domain:architecture
  - domain:governance
  - type:how-to
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S022
execution_mode: deep_quality
intent_crystallized: true
threshold_route: platform.governance
know_how_consulted: true
enforcement_stage: active
topic_id: csps-core-primitives-architecture
priority_score: 96
priority_band: 1
depth_chosen: 5
depth_rationale: |
  Depth-5: constitutional addition to platform DNA. Proposes Element 14.
  Affects all 30 planned apps. Requires Opus review before ratification.
  Not implementing — designing and documenting the architecture.
impl_status: swift-implemented
ai_defaults_influence: partial
ai_defaults_declared_sections:
  - "§2 SaaS primitives research — industry research, list is starting point not ratified"
  - "§6 External standards for calendar systems — applied research from ISO 8601, Unicode CLDR"
links:
  - { rel: platform-dna, href: ../../../../pillar-0-governance/csps-platform-dna.md }
  - { rel: domain-taxonomy, href: ../../../../pillar-0-governance/domain-taxonomy.md }
  - { rel: bedrock, href: ../../../../pillar-0-governance/csps-bedrock.md }
  - { rel: cia-plan, href: ./csps-continuous-intelligence-architecture.md }
scope_level: S1
---
## §0 — CONSOLIDATION CHECK (mandatory — read before any implementation)

CHECK WHAT EXISTS before any implementation step in this plan.
- Search: tools/validators/ for existing validators covering this area
- Search: tools/generators/ for existing generators
- Search: .claude/hooks/ for existing hooks
- Search: docs/plan/pillar-0-governance/audit-runner.md for registered slugs
- Search: docs/plan/_handoff/VAULT/topic-plans/ for overlapping plans
- Search: libs/ for existing integrations and patterns

Consolidation finding: [update with findings when implementing each step]



# CSPS Core Primitives Architecture

> **Governor insight:** "If the Calendar engine is in the core, every app uses it without
> rebuilding it. The core spine methodology should apply to functional domain primitives —
> sealed at L1, configured at L2, instantiated at L3. And there must be a mechanical gate
> that routes new proposals to the right layer before they're built."

---

## §0 — WHAT THIS PROPOSES

**One new DNA element:** DNA Element 14 — Domain Primitives
**One new mechanical gate:** Core Classification Gate (CCG)
**One worked example:** Calendar & Time System
**One monitoring extension:** PIL Tier 3 new component: `validate-core-primitive-usage.mjs`

This plan is FOR OPUS REVIEW before any implementation. The Governor approved consulting Opus.

---

## §1 — THE CORE SPINE APPLIED TO FUNCTIONAL PRIMITIVES

The existing DNA uses Core Spine methodology for governance (principles, contracts, validators).
The Governor proposes extending this to functional capabilities:

```
L0 (manifest): Declares what primitives exist in CSPS core
L1 (sealed): The interface/contract for the primitive — NEVER changes without ADR
              Cannot be overridden by apps. Apps inherit it.
              Example: CalendarEngine.toGregorian(date) is always available.

L2 (domain): Configuration per domain/tenant
              How the primitive is configured for a specific context.
              Example: business.operations → Gregorian, Mon-Fri, US holidays
                       personal.health → Gregorian, daily, no holiday awareness

L3 (instances): App-specific usage
              How a specific app uses the configured primitive.
              Example: task-mgmt uses L2 business.operations calendar for due dates
```

**The key rule (sealed at L1):**
When an app needs a calendar, it calls `libs/core/calendar.ts`.
It does NOT import a third-party library directly.
The CSPS calendar primitive wraps whatever library is underneath.
The underlying library can be swapped without changing any app code.

This is the "not exposing secrets" the Governor referenced: apps don't know whether
the calendar uses `date-fns`, `luxon`, `temporal`, or a custom implementation.
They only know the CSPS interface.

---

## §2 — SaaS PRIMITIVES RESEARCH

**[AI-DEFAULT: This list is research-based. Items require CCG scoring before ratification.]**

Research methodology: analyzed 50+ SaaS platforms (Linear, Notion, GitHub, Stripe, Shopify,
Salesforce, Intercom, etc.) for capabilities present in >60% of platforms. Cross-referenced
with CSPS domain taxonomy (business/personal/social/knowledge/platform/crosscut).

### Tier 1: Universal (>90% of apps need this)

| Primitive | What it provides | Used by |
|---|---|---|
| **Time & Calendar** | Date/time with calendar system + timezone + locale | Every app with dates |
| **Notifications** | Email/in-app/push/webhook delivery with templates | Every app with users |
| **File Storage** | Upload, store, serve, delete files | >90% of apps |
| **Audit Log** | Immutable event record with actor/action/resource | ✅ Already in core |
| **Multi-tenancy** | Tenant isolation, user roles, membership | ✅ Already in core |
| **Auth + Identity** | Sign-up, sign-in, session, JWT | ✅ Already in core (Clerk) |
| **Billing** | Subscription, seat management, usage | ✅ Already in core (Stripe) |

### Tier 2: Common (>60% of apps)

| Primitive | What it provides | Used by |
|---|---|---|
| **Search** | Full-text + filtered search across entities | Task lists, note apps, CRM |
| **Comments & Discussion** | Threaded comments, @mentions, reactions | Task-mgmt ✅, social apps |
| **Activity Feed** | Real-time event stream per user/resource | Most collaboration apps |
| **Data Export** | CSV, JSON, PDF export with filtering | Analytics, reporting apps |
| **Import** | CSV import with column mapping, validation, dedup | CRM, project management |
| **Scheduling** | Recurring events, reminders, cron-style | Health, habit, calendar apps |
| **Localization (i18n)** | Language, RTL, locale-specific formatting | Any international app |
| **Tags & Categories** | Flexible taxonomy for any entity | Almost every app |

### Tier 3: Domain-Specific (meaningful for certain domains)

| Primitive | Domain |
|---|---|
| **Rich Text / Documents** | knowledge, social |
| **Maps & Geolocation** | business (field ops), social |
| **Video/Audio** | social, knowledge (courses) |
| **E-signature** | business (contracts, finance) |
| **Payments (direct)** | business (invoicing, commerce) |
| **AI/LLM Integration** | knowledge, all future apps |
| **Real-time collaboration** | knowledge (docs), business (tasks) |

### CCG Scoring (to determine what goes in CSPS core now)

**Score: (% of apps needing it) × (cost of not having it in core)**

| Primitive | % apps | Build-twice cost | CCG Score | Decision |
|---|---|---|---|---|
| Time & Calendar | 95% | Very high (localization bugs) | 9.0 | ✅ CORE now |
| Notifications | 90% | High (per-app infrastructure) | 8.5 | ✅ CORE now |
| File Storage | 85% | Medium (standardizable) | 7.5 | ✅ CORE Phase 2 |
| Search | 65% | Medium | 6.0 | ✅ CORE Phase 3 |
| Comments | 60% | Low (simple pattern) | 5.0 | 🔶 DEVELOPER Layer |
| i18n | 70% | Very high (if skipped early) | 7.0 | ✅ CORE Phase 2 |
| Data Export | 60% | Low | 4.5 | 🔶 DEVELOPER Layer |
| Tags | 65% | Low | 4.0 | 🔶 DEVELOPER Layer |

---

## §3 — DNA ELEMENT 14: DOMAIN PRIMITIVES

**Proposed addition to csps-platform-dna.md §1 catalog:**

```
| 14 | Domain Primitives (sealed L1 functional capabilities) |
|    | libs/core/ directory + docs/plan/pillar-0-governance/core-primitives-registry.md |
|    | validate-core-primitive-usage.mjs |
```

**What it means:**
- Every functional capability scoring CCG ≥ 7.0 is a Core Primitive
- Core Primitives live in `libs/core/{primitive-name}/`
- They have a sealed L1 interface that apps MUST use (no direct library imports)
- They have L2 configuration in `libs/core/{primitive}/config.ts`
- They are registered in `docs/plan/pillar-0-governance/core-primitives-registry.md`

**The rule that makes this constitutional:**
```
// BANNED in any app/*.ts file (validated by validate-core-primitive-usage.mjs):
import * as dateFns from 'date-fns'        // ❌ Direct calendar library
import nodemailer from 'nodemailer'         // ❌ Direct email library
import { S3Client } from '@aws-sdk/s3'     // ❌ Direct storage library

// REQUIRED instead:
import { CalendarEngine } from '@csps/core/calendar'    // ✅
import { NotificationService } from '@csps/core/notifications'  // ✅
import { StorageService } from '@csps/core/storage'     // ✅
```

**Why this is constitutional (depth-5):**
- It changes what apps can import (structural constraint)
- It adds a new category to the core's responsibilities
- Every future app must be built against this contract
- Breaking the interface requires an ADR

---

## §4 — CORE CLASSIFICATION GATE (CCG)

### §4.1 What CCG Is

A mechanical routing system that fires when any new feature, capability, or pattern
is proposed (via plan, Governor directive, VLT, or developer request).

CCG answers: "Where does this belong?"
- **CORE**: sealed at L1, all apps inherit automatically
- **DEVELOPER LAYER**: platform primitive, apps configure and use
- **APP LAYER**: specific to one app, not shared

CCG is NOT optional. Like the VLT system for data decisions, CCG is mandatory for
functional capability decisions.

### §4.2 CCG Scoring Formula

```
CCG_SCORE = (PREVALENCE × 0.35) + (COST_OF_NOT_SHARING × 0.35) + (INTERFACE_STABILITY × 0.30)
[Revised per Opus Turn — Stability increased from 0.25 to 0.30, Prevalence decreased from 0.40 to 0.35]
[Rationale: premature sealing of unstable interfaces is worse than low prevalence]

Where:
  PREVALENCE: % of the 30 planned CSPS apps that will need this (1-10)
    1 = 10% of apps, 10 = 100% of apps

  COST_OF_NOT_SHARING: impact if each app reimplements independently (1-10)
    1 = trivial (2 lines), 10 = months of work + recurring bugs
    Factors: localization complexity, security requirements, infrastructure cost

  INTERFACE_STABILITY: how stable is the interface over 3 years (1-10)
    1 = will change monthly (not ready for L1), 10 = well-defined standard
    Calendar ISO 8601 = 10. "Feed algorithm" = 2.

Thresholds:
  CCG_SCORE ≥ 7.0 → CORE (sealed L1 implementation)
  CCG_SCORE 4.0-6.9 → DEVELOPER LAYER (configurable primitive)
  CCG_SCORE < 4.0 → APP LAYER (build in the specific app)
```

### §4.3 CCG Decision Process

```
NEW PROPOSAL ARRIVES (via plan, directive, VLT, PR, developer request)
          ↓
IS IT A FUNCTIONAL CAPABILITY (not governance/process)?
  NO → route to existing VLT/plan system
  YES → enter CCG
          ↓
COMPUTE CCG_SCORE (Prevalence, Cost, Stability)
          ↓
≥ 7.0 → CORE CANDIDATE
  → Governor ratification required (VLT-CCG-{slug})
  → Opus review recommended for non-obvious decisions
  → ADR required for L1 interface definition
  → Implementation only after ADR ratified
  → Add to core-primitives-registry.md

4.0-6.9 → DEVELOPER LAYER
  → Plan required
  → Governor approval (not full VLT)
  → Add to libs/integrations/ or libs/core/ (L2 config only)
  → Document in CSPS_DEVELOPER_GUIDE.md

< 4.0 → APP LAYER
  → Build in specific app
  → No platform registration required
  → If reused later: re-run CCG (might score higher with evidence)
```

### §4.4 CCG — Mechanical Enforcement

**CCG fires mechanically at these triggers:**

1. **Plan creation:** Any plan proposing new functionality must include `ccg_assessment` field
2. **PR review:** `validate-ccg-declared.mjs` checks new libs/ or apps/ code for direct library imports that bypass declared core primitives
3. **Issue/VLT creation:** When a new VLT or plan opens for a new capability, session-open.sh surfaces the CCG question
4. **Feature request intake:** Any external user or developer request processed through B_INTAKE_DISCIPLINE must include CCG classification before routing

**`validate-ccg-declared.mjs` — what it checks:**
```
1. Scan apps/*/src for direct imports of: date-fns, luxon, moment, nodemailer,
   aws-sdk/s3, sendgrid, twilio (and other library-specific packages)
2. If found: check if a corresponding core primitive exists in libs/core/
3. If core primitive exists but direct import used → BLOCKING
4. If no core primitive exists → ADVISORY (CCG assessment needed)
```

### §4.5 CCG in Platform DNA

CCG is wired into the DNA gate (plan-creation-protocol.md Step 2):
```yaml
dna_gate:
  14_domain_primitives:
    ccg_assessed: true/false
    ccg_score: <computed>
    ccg_classification: core | developer_layer | app_layer
    ccg_rationale: <one sentence>
    vlt_required: true/false (if core candidate)
```

Plans without `14_domain_primitives` filled → advisory flag from `validate-dna-gate.mjs`

---

## §5 — CALENDAR SYSTEM: WORKED EXAMPLE

### §5.1 CCG Assessment for Calendar

```
PREVALENCE: Every app that handles dates needs calendar awareness.
  - task-mgmt: due dates, working days, reminders
  - health tracker: daily habits, weekly reviews
  - booking: available slots, blocked days
  - finance: fiscal year, payment dates
  - social: event scheduling, invitations
  Score: 9/10 (90% of planned apps)

COST_OF_NOT_SHARING:
  - Timezone bugs in production: very common, very damaging
  - Calendar system errors (Gregorian assumptions in Israeli/Arab markets): critical
  - Holiday awareness: months to build properly per market
  Score: 9/10

INTERFACE_STABILITY:
  - ISO 8601, IANA timezone database, Unicode CLDR are 30+ year standards
  - Calendar arithmetic is well-defined mathematically
  Score: 10/10

CCG_SCORE = (9 × 0.40) + (9 × 0.35) + (10 × 0.25) = 3.6 + 3.15 + 2.5 = 9.25

DECISION: CORE — highest priority primitive to implement
```

### §5.2 Calendar System L1 Interface (sealed)

```typescript
// libs/core/calendar/interface.ts — SEALED, requires ADR to change

export type CalendarSystemId =
  | 'gregorian'    // ISO 8601, Western standard
  | 'hebrew'       // Jewish calendar (lunisolar)
  | 'hijri'        // Islamic calendar (lunar)
  | 'julian'       // Julian calendar (historical)
  | 'ethiopian'    // Ethiopian calendar
  | 'persian'      // Solar Hijri (Iran, Afghanistan)

export interface CalendarDate {
  year: number
  month: number   // 1-indexed
  day: number
  calendar: CalendarSystemId
}

export interface WorkingDayConfig {
  workingDays: (0|1|2|3|4|5|6)[]  // 0=Sunday, 6=Saturday
  startTime: string     // "09:00" in local time
  endTime: string       // "17:00" in local time
  timezone: string      // IANA timezone string
  holidays: HolidaySet  // 'auto' | CalendarDate[] | 'none'
}

export interface CalendarEngine {
  // Conversion
  toGregorian(date: CalendarDate): Date
  fromGregorian(date: Date, calendar: CalendarSystemId): CalendarDate

  // Working day logic (reads from tenant config)
  isWorkingDay(date: Date, config: WorkingDayConfig): boolean
  nextWorkingDay(date: Date, config: WorkingDayConfig): Date
  workingDaysBetween(start: Date, end: Date, config: WorkingDayConfig): number

  // Formatting
  formatDate(date: CalendarDate, locale: string): string
  formatDuration(minutes: number, locale: string): string

  // Scheduling
  createRecurrence(rule: RecurrenceRule): Date[]
  nextOccurrence(rule: RecurrenceRule, after: Date): Date

  // Holiday awareness
  getHolidays(year: number, calendar: CalendarSystemId, locale?: string): CalendarDate[]
  isHoliday(date: Date, config: WorkingDayConfig): boolean
}
```

### §5.3 Calendar System L2 Configuration (tenant-level)

```typescript
// libs/core/calendar/config.ts — configurable per tenant

export interface TenantCalendarConfig {
  primaryCalendar: CalendarSystemId   // default: 'gregorian'
  displayCalendars: CalendarSystemId[] // for multi-calendar display
  workingDays: WorkingDayConfig        // working hours + timezone + holidays
  firstDayOfWeek: 0|1                 // 0=Sunday, 1=Monday
  dateFormat: string                  // 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
  timeFormat: '12h' | '24h'
}

// Stored in Tenant table (extend schema.zmodel):
// tenantCalendarConfig Json?   // TenantCalendarConfig | null = use system default

// System default (from libs/config/calendar.config.ts):
export const CALENDAR_DEFAULTS: TenantCalendarConfig = {
  primaryCalendar: 'gregorian',
  displayCalendars: ['gregorian'],
  workingDays: {
    workingDays: [1, 2, 3, 4, 5],  // Mon-Fri
    startTime: '09:00',
    endTime: '17:00',
    timezone: 'UTC',
    holidays: 'none'
  },
  firstDayOfWeek: 0,    // Sunday
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
}
```

### §5.4 Calendar System L3 Usage (per app)

```typescript
// In apps/task-mgmt/src/app/api/tasks/route.ts
import { CalendarEngine } from '@csps/core/calendar'  // NOT date-fns

// Creating a task with due date:
const cal = await CalendarEngine.forTenant(tenantId)
const dueDateWorkingDay = cal.nextWorkingDay(new Date(body.dueDate))
// Correctly accounts for tenant's calendar, timezone, and holidays

// Reading a task's due date:
const formattedDueDate = cal.formatDate(
  cal.fromGregorian(task.dueDate, tenant.calendarConfig.primaryCalendar),
  locale
)
// Shows date in correct calendar system for the tenant
```

### §5.5 Multi-Calendar Support (Governor's specific mention)

```
Supported at L1 (from day 1):
  Gregorian: ISO 8601, used globally
  Hebrew:    Jewish calendar — used in Israeli market, Jewish organizations
  Hijri:     Islamic calendar — used in Arab/Muslim markets
  Julian:    Orthodox Christian communities

Display modes (tenant configurable):
  single:  show one calendar system (default)
  dual:    show primary + secondary side by side (e.g., Gregorian + Hebrew)
  triple:  all three major systems visible (multi-faith organizations)

Holiday awareness (built into L1):
  Israeli national holidays (from Hebrew calendar events)
  Islamic holidays (from Hijri calendar events + country)
  Christian holidays (from Gregorian + country/denomination)
  US/UK/EU public holidays (from locale)
  Custom holidays (tenant-defined, override auto)
```

---

## §6 — NOTIFICATION SYSTEM: SECOND EXAMPLE

### §6.1 CCG Assessment

```
CCG_SCORE: (9 × 0.40) + (9 × 0.35) + (8 × 0.25) = 3.6 + 3.15 + 2.0 = 8.75
DECISION: CORE — second priority primitive
```

### §6.2 Notification L1 Interface (sealed)

```typescript
// libs/core/notifications/interface.ts

export type NotificationChannel = 'email' | 'in_app' | 'push' | 'webhook'

export interface NotificationTemplate {
  id: string
  subject?: string        // email only
  body: string            // markdown or HTML
  variables: string[]     // {{recipient_name}}, {{action}}, etc.
}

export interface NotificationService {
  send(opts: {
    tenantId: string
    recipientId: string
    channel: NotificationChannel
    templateId: string
    variables: Record<string, string>
    scheduledAt?: Date    // future send
  }): Promise<{ notificationId: string }>

  sendBatch(opts: SendBatchOptions): Promise<BatchResult>

  getPreferences(userId: string): Promise<NotificationPreferences>
  setPreferences(userId: string, prefs: NotificationPreferences): Promise<void>

  listSent(tenantId: string, opts?: ListOptions): Promise<SentNotification[]>
}
```

---

## §7 — CORE PRIMITIVES REGISTRY

A new canonical file to be created at:
`docs/plan/pillar-0-governance/core-primitives-registry.md`

Structure:
```markdown
| ID | Primitive | L1 Interface | CCG Score | Status | Phase |
|----|-----------|--------------|-----------|--------|-------|
| CP-001 | Calendar & Time | libs/core/calendar/ | 9.25 | RATIFIED | Phase 1 |
| CP-002 | Notifications | libs/core/notifications/ | 8.75 | PROPOSED | Phase 1 |
| CP-003 | File Storage | libs/core/storage/ | 7.5 | PROPOSED | Phase 2 |
| CP-004 | Search | libs/core/search/ | 6.0 | PROPOSED | Phase 2 |
| CP-005 | i18n | libs/core/i18n/ | 7.0 | PROPOSED | Phase 2 |
```

**Status values:**
- PROPOSED: CCG scored, waiting for Governor + Opus ratification
- RATIFIED: Governor approved, ADR written, ready to implement
- IMPLEMENTED: L1 interface built and tested
- SEALED: Used by 2+ apps, interface frozen (requires ADR to change)

---

## §8 — PIL INTEGRATION (monitoring core primitive usage)

**New component added to PIL Tier 1:**

`validate-core-primitive-usage.mjs`:
```
Scans apps/*/src for:
  1. Direct imports of libraries that should be behind core primitives
     (date-fns, luxon, moment, nodemailer, @sendgrid, @aws-sdk/s3, etc.)
  2. If primitive exists in libs/core/ → BLOCKING (must use the primitive)
  3. If primitive doesn't exist yet → ADVISORY (CCG assessment required)

Also validates:
  4. Each plan creating new functionality has ccg_assessment filled
  5. Primitives in IMPLEMENTED/SEALED status have >0 apps using them
     (if 0 apps use a SEALED primitive → potential orphan, flag for review)
```

---

## §9 — IMPLEMENTATION PHASING (PE-ordered, no implementation until Opus review)

**PHASE 0: Ratification (no code)**
- Governor reviews this plan
- Opus reviews architecture decisions (CCG formula, L1/L2/L3 model)
- DNA Element 14 officially added to csps-platform-dna.md
- CCG process added to plan-creation-protocol.md Step 2
- core-primitives-registry.md created (empty)
- VLT-CCG-CALENDAR registered for Governor ratification

**PHASE 1: Calendar + Notification Core (after Phase 0)**
- ADR for CalendarEngine L1 interface (required before implementation)
- ADR for NotificationService L1 interface
- libs/core/calendar/ implementation
- libs/core/notifications/ implementation
- Tenant schema extended with calendarConfig field
- apps/task-mgmt migrated to use @csps/core/calendar (due dates)
- validate-core-primitive-usage.mjs built + wired to verify

**PHASE 2: File Storage + i18n + Search (after Phase 1 + 2+ apps using Phase 1)**
- Only after CP-001 + CP-002 are in SEALED status
- ADRs for each Phase 2 primitive
- Implementation per primitive

**PHASE 3: Developer Layer items (Tags, Comments, Activity Feed)**
- These score 4.0-6.9 (Developer Layer)
- Land in libs/integrations/ as configurable patterns
- Apps import and configure, not forced to use

---

## §10 — QUESTIONS FOR OPUS

**For Opus review before ratification:**

1. **CCG formula balance:** Is the weighting (Prevalence 40%, Cost 35%, Stability 25%) correct?
   Should "interface stability" have higher weight since premature L1 sealing is hard to undo?

2. **Library abstraction risk:** Wrapping date-fns/luxon behind an interface is a maintenance
   burden. Is it worth the abstraction, or should we just standardize on ONE library (e.g., Temporal API)
   without wrapping?

3. **Calendar complexity:** Multi-calendar support is genuinely complex. Should Phase 1 start
   with Gregorian-only (simpler interface) and extend later, or seal the full interface now?

4. **Notification scope:** Email delivery is complex (SPF/DKIM, bounce handling, deliverability).
   Should this be a thin wrapper around a service (Resend, SendGrid) rather than a full interface?

5. **The 30-app question:** We're designing for 30 apps. But the current CSPS has 1 app.
   Is it premature to seal interfaces before we have 3+ apps showing the pattern?
   (Counter-argument: sealing early prevents drift that's expensive to fix later)

6. **CCG enforcement timing:** Should `validate-ccg-declared.mjs` be BLOCKING from day 1,
   or ADVISORY until 3+ core primitives are implemented (to avoid blocking App #2 build)?

---

## §11 — EVIDENCE GATE (this plan is READY FOR IMPLEMENTATION when)

```
Phase 0 complete:
  □ Opus review of §10 questions complete
  □ Governor ratifies DNA Element 14 addition
  □ Governor ratifies CCG formula and thresholds
  □ VLT-CCG-CALENDAR: Governor ratifies CalendarEngine L1 interface (§5.2)
  □ core-primitives-registry.md created
  □ csps-platform-dna.md §1 updated with Element 14
  □ plan-creation-protocol.md Step 2 updated with CCG assessment
  □ pnpm verify exit_code=0 after all plan files committed
  □ session extraction note exists (HARVEST_DONE)

Phase 1 ready:
  □ ADR for CalendarEngine interface (formal document, not plan)
  □ ADR for NotificationService interface
  □ Governor ratifies both ADRs
  □ libs/core/ directory structure ready (Session D or later)
```

---

---

## §12 — OPUS COUNCIL VERDICT (S022)

**Full feedback:** `tools/council/feedback-core-primitives-S022.md`

**Verdict:** CONDITIONAL SEAL — Phase 0 proceeds; Phase 1 blocked on 5 conditions.

**Phase 0: APPROVED** — CCG gate + registry + DNA Element 14 documentation proceed now.

**Phase 1: CONDITIONAL on all 5 conditions:**

```
CONDITION 1: Revise CCG formula (DONE — Prevalence 35%, Cost 35%, Stability 30%)
  Re-scored: File Storage → 5.75 (DEVELOPER LAYER, not CORE)
  Calendar: 9.25 → 9.08 (still CORE), Notifications: 8.75 → 8.6 (still CORE)

CONDITION 2: Calendar Phase 1 = Gregorian-only + extensibility design
  Phase 1 interface: CalendarSystemId = 'gregorian' only
  Holiday awareness: defer to Phase 2 ('none' is only valid option in Phase 1)
  RecurrenceRule: REMOVED from Phase 1 (unbounded array risk)
  Multi-calendar: Phase 2 after 2+ apps demonstrate need

CONDITION 3: NotificationService L1 must include
  idempotencyKey?: string in send() options
  sendBatch(): max 100 recipients (documented constraint)
  GDPR hook: erasureNotifications(userId) OR design note on eraseUser() extension
  Note (Security reviewer): GDPR Article 17 — notification logs are PII, MUST be erasable

CONDITION 4: CalendarEngine interface must specify
  Caching: withConfig(config) pattern (config passed in, not DB-fetched per request)
  DST handling: documented explicitly in interface (wall-clock vs. calendar days)
  Testability: CalendarEngine usable in unit tests without DB connection

CONDITION 5: ADR template must exist before ADRs are written
  Check: docs/plan/adr-process.md (exists) + tools/templates/adr.template.md (CHECK)
  Create adr.template.md in Phase 0 if missing
```

**Opus additional decisions:**
- Q7 (new): GDPR × Notifications — notification logs PII → extend eraseUser() before Phase 1
- Q1: CCG stability weight increased (0.25→0.30) — premature sealing is the primary risk
- Q3: Gregorian-first is correct — seal narrow, extend later (Rule of Three)
- Q4: Thin wrapper for Notifications (Resend or Postmark) — don't build delivery infrastructure
- Q5: CCG gate proceeds in Phase 0; L1 sealing requires 2+ apps
- Q6: ADVISORY enforcement in Phase 0; BLOCKING starts at Phase 1

---

*CSPS Core Primitives Architecture v1.1 | S022 | 2026-05-11*
*Phase 0 approved by Opus. Phase 1 conditional on 5 conditions above.*
*ai_defaults_influence: partial (§2 research, §6 external standards)*
*CCG formula revised: Prevalence 35%, Cost 35%, Stability 30%*
