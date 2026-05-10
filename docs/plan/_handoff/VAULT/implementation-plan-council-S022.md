---
id: csps.handoff.vault.implementation-plan-council.S022
name: implementation-plan-council-S022
description: >
  Detailed implementation plan for S022+, prepared by Opus-designated reviewer
  for Governor-Sonnet mini council. COUNCIL CONSENSUS REACHED S021-05-09.
  Three Sonnet modifications accepted. Eight Sonnet corrections integrated.
  This is now the ratified execution plan — pending Governor VLT ratification.
version: 1.1
lifecycle: production
lifecycle_state: active
council_consensus: reached
council_session: S021
sonnet_modifications_accepted: 3
sonnet_corrections_integrated: 8
owner: group:finky
core_spine: GVRN
schema_anchor: platform_plans
session: S021
created_by: Claude Sonnet 4.6[1M] — Opus-designated planning session
tags:
  - domain:governance
  - domain:planning
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
links:
  - { rel: consolidated-plan, href: ./platform-excellence-consolidated-S021.md }
  - { rel: platform-excellence-sonnet, href: ../../platform-excellence-readiness.md }
  - { rel: session-state, href: ../../../../tools/session-state.json }
domain_path: platform
---

# Implementation Plan — S022+ Council Brief
## Opus Recommendation + Split Decision + Council Questions for Sonnet

---

> **Purpose:** The Governor will present this to Sonnet for a mini council discussion.
> Sonnet should respond to the Council Questions in §5 before consensus is declared.
> This document is the Opus position. Sonnet's counter-position or agreement
> constitutes the council output.

---

## §0 — Current State (Evidence, Not Memory)

Verified this session (`pnpm verify: exit_code=0`):
- `enforcement_rate=29%` — target was 25% — **ALREADY HIT** ✓
- `drift_coverage=71%` — target was 71% (5/7) — **ALREADY HIT** ✓
- `sessions_since_opus_review=2` — 8 sessions until next Opus due (S029)
- S022 mandate: Options A (governance) or B (live DB) — Governor decides

**The S022 governance targets are done.** There is no governance work that urgently needs
to be completed before moving forward. The question is not "what governance is missing" —
the question is "what creates the most compound value per session invested NOW."

---

## §1 — The Recommendation (Direct)

**My recommendation: B first, then VLT ratification, then schema Phase A, then A.**

The specific sequence I am recommending:

```
STEP 1 — Governor decision (10 minutes, not a Sonnet session):
  Ratify 3 P1 VLTs verbally. No code. Just the three decisions.
  These ratifications cost 10 minutes and unblock 10 sessions of downstream work.

STEP 2 — Session 1 (Sonnet executes):
  Live DB connection — pnpm db:push to Supabase.
  This is the single highest-value action available.

STEP 3 — Session 2 (Sonnet executes):
  Schema Phase A — frontmatter extension (domain_path, persona_target, wisdom_class).
  This is the architecture foundation that makes everything downstream coherent.

STEP 4 — Session 3 (Sonnet executes):
  Infrastructure completion — AppendOnlyBase + GDPR erasure service.
  These unblock health and EU-market apps.

STEP 5 — Session 4+ (Sonnet executes):
  Governance options A (post-stop-banned-phrase.sh + validate-comment-truth.mjs).
  Good work — but not urgent relative to Steps 2-4.
```

**Split decision:** YES — split into distinct sessions. Reasoning below.

---

## §2 — The Reasoning (Why This Sequence)

### Why Live DB First (Step 2)

The platform has been built for 21+ sessions with zero real users. Every architectural
decision has been made in the abstract. Real users reveal issues that no amount of
planning prevents:
- ZenStack policies that look correct but fail under real Clerk JWT claims
- Schema drift between what we think is deployed and what Supabase actually has
- UI issues that don't appear in validation because there is no UI validation
- Performance issues that only appear with real network latency

**First real user is the most important milestone in the platform's history.**
It is more important than any governance improvement.

The live DB connection is also Governor-gated — it requires the `.env.local` file with
real Supabase credentials. Only the Governor can initiate this. Delaying it delays the
first user feedback loop.

**Compound value: HIGH** — every subsequent session builds on real-world validation.

### Why Schema Phase A Second (Step 3)

Once the platform has a real user, domain taxonomy matters immediately:
- The dev server will have one app (task-mgmt)
- The next app built should know its `domain_path: "business.operations"` automatically
- Every governance artifact needs to be stamped before the second app is built
- This is cheapest to do now (282 artifacts) vs. later (500+ artifacts)

The schema extension also unlocks the WisdomVault architecture — without `domain_path`,
the WisdomEntry model has no ontological anchor.

**Compound value: VERY HIGH** — every future artifact inherits domain identity automatically.

### Why Governance (A) Fourth

**The enforcement_rate target (25%) is already hit at 29%.** The governance options in
S022 are:
- promote post-stop-banned-phrase.sh: good, but the hook currently catches some cases
  already; this is incremental improvement, not a gap
- validate-comment-truth.mjs: good, but documentation drift is low-urgency vs. having
  a live platform

Neither is urgent. Neither is blocked by anything. Both can wait one session.

**Compound value: MEDIUM** — useful but not unlocking.

### Why VLT Ratification Before Code (Step 1, ~10 minutes)

Three closed-enum decisions that cost nothing to make NOW and cost rework if made later:
1. `domain_path` Tier 1: `business | personal | social | knowledge | platform`
2. `persona_target`: `solo_user | business_admin | business_member | family_admin | family_member | community_leader | developer`
3. `wisdom_class`: `insight | reference | workflow | tool | benchmark | story | null`

If Schema Phase A runs without these ratified, the frontmatter validator will be built
for a set of values that might change. Ratifying them before code eliminates rework.

**Cost: 10 minutes of Governor decision time.**
**Value: eliminates one session of rework.**

---

## §3 — Full Implementation Specs (Session-by-Session)

### GOVERNOR ACTION — VLT Ratification (Not a session, no code)

**Required before any schema work begins.**

Governor states: "I ratify the following:"

```
VLT-S022-DOMAIN-PATH RESOLVED:
  domain_path Tier 1 closed enum: business | personal | social | knowledge | platform

VLT-S022-PERSONA-TARGET RESOLVED:
  persona_target closed enum: solo_user | business_admin | business_member |
  family_admin | family_member | community_leader | developer

VLT-S022-WISDOM-CLASS RESOLVED:
  wisdom_class closed enum: insight | reference | workflow | tool | benchmark | story | null
```

**Sonnet then records these in `docs/plan/pillar-0-governance/frontmatter-closed-enums.md`.**
That single edit is the only code. No validators yet. No batch stamping yet. Just the
enum definitions in the canonical source.

---

### SESSION 1 — Live DB Connection

**Scope:** Connect task-mgmt to live Supabase. Validate the real app works.

**Governor prerequisite:** `.env.local` file with real `DATABASE_URL` and `DIRECT_URL`
from Supabase project credentials.

**Sonnet executes:**

```
STEP 1a — Environment validation
  Read apps/task-mgmt/.env.example
  Confirm .env.local exists with real credentials (Governor provides)
  Verify DATABASE_URL format: postgresql://...@...supabase.com:6543/postgres
  Verify DIRECT_URL format: postgresql://...@...supabase.com:5432/postgres

STEP 1b — Schema push
  cd apps/task-mgmt
  pnpm exec prisma db push
  PASTE EXACT OUTPUT — confirm "Your database is now in sync with your Prisma schema"

STEP 1c — Dev server launch
  pnpm dev (apps/task-mgmt)
  Navigate to localhost:3000
  PASTE SCREENSHOT OR SERVER LOG showing successful startup

STEP 1d — Auth flow validation
  Create a test account via Clerk
  Verify JWT tenantId claim is present
  PASTE auth session claims showing tenantId

STEP 1e — CRUD validation
  Create a test project via API: POST /api/projects
  Create a test task via API: POST /api/tasks
  Read tasks: GET /api/tasks
  PASTE API responses confirming tenant isolation (tenantId in every response)

STEP 1f — AuditEvent verification
  Query Supabase directly: SELECT * FROM "AuditEvent" LIMIT 5
  Confirm audit events were written for the CRUD operations
  PASTE Supabase result
```

**Verification gate:** pnpm verify: exit_code=0 AND at least one AuditEvent in live DB.

**What Sonnet declares when done:**
```
SESSION 1 DEMONSTRATION:
  pnpm verify: [paste exit_code=0 output]
  pnpm db:push: [paste "in sync" confirmation]
  First AuditEvent: [paste record from Supabase]
  Live URL: [dev server URL]
```

**Not proven by this session:**
- ZenStack RLS policies work at scale
- Performance under concurrent load
- Billing webhook integration in production
- Any personal domain functionality

---

### SESSION 2 — Schema Phase A (Domain Taxonomy Extension)

**Scope:** Extend frontmatter schema with 4 new fields. Batch-stamp existing artifacts.

**Prerequisites:**
- SESSION 1 complete (live DB working)
- VLT ratifications recorded in frontmatter-closed-enums.md

**Sonnet executes:**

```
STEP 2a — Extend frontmatter-closed-enums.md
  Add 4 new field definitions with closed enums:
  - domain_path (Tier 1 values ratified in VLT-S022-DOMAIN-PATH)
  - persona_target (values ratified in VLT-S022-PERSONA-TARGET)
  - wisdom_class (values ratified in VLT-S022-WISDOM-CLASS)
  - use_case_class (tracking | planning | communication | analysis |
    automation | discovery | creation | governance)

STEP 2b — Extend validate-frontmatter.mjs
  Add field validators for the 4 new fields
  Fields are OPTIONAL (not required on all artifacts — only when set)
  When set: must be in closed enum
  When not set: no error (adoption is gradual)
  PASTE: node tools/validators/validate-frontmatter.mjs output showing
  no new errors introduced

STEP 2c — Create domain-taxonomy.md
  File: docs/plan/pillar-0-governance/domain-taxonomy.md
  Content: The 3-tier taxonomy from the consolidated plan (§2)
  This is the canonical reference — frontmatter-closed-enums.md points here
  PASTE: pnpm verify exit_code=0 after creating

STEP 2d — Batch-stamp platform artifacts
  All artifacts in docs/plan/_handoff/ get: domain_path: "platform"
  All governance artifacts (behavioral-contracts.md, etc.) get: domain_path: "platform"
  All validators get: domain_path: "platform"
  Exclude: user-facing domain artifacts (none exist yet)
  Use a script to batch-update (don't do 282 files manually)

STEP 2e — Create libs/policies/slices/ directory structure
  mkdir libs/policies/slices/
  mkdir libs/policies/slices/personal/
  mkdir libs/policies/slices/business/
  mkdir libs/policies/slices/social/
  Create README.md in each: "Domain schema slices for [domain] apps.
  Each .zmodel file here is a domain extension activated per tenant."

STEP 2f — Verify
  pnpm verify: exit_code=0
  PASTE the full output showing frontmatter scanned=XXX errors=0
```

**Verification gate:** pnpm verify: exit_code=0 AND all platform artifacts have domain_path: "platform" stamped.

**What's not done in this session:**
- WisdomEntry model (Phase C — later)
- Domain-specific schema slices (Phase F/G — later)
- Persona-based UI filtering (Phase H — later)

---

### SESSION 3 — Infrastructure Completion

**Scope:** AppendOnlyBase model + GDPR erasure service. Both block future domain builds.

**Sonnet executes:**

```
STEP 3a — AppendOnlyBase in schema.zmodel
  Add to libs/policies/schema.zmodel:
  
  abstract model AppendOnlyBase {
    id        String   @id @default(uuid()) @db.Uuid
    createdAt DateTime @default(now())
    @@schema("public")
    // No deletedAt (immutable) | No updatedAt (append-only)
  }
  
  Update AuditEvent to extend AppendOnlyBase instead of Base:
  model AuditEvent extends AppendOnlyBase { ... }

STEP 3b — Schema migration
  pnpm exec zenstack generate --schema libs/policies/schema.zmodel
  cd apps/task-mgmt
  pnpm exec prisma db push
  PASTE: "Your database is now in sync with your Prisma schema"
  PASTE: validate-foundation-schema-drift.mjs exit_code=0

STEP 3c — GDPR erasure service
  File: libs/integrations/gdpr.ts
  Function: async function eraseUser(userId: string, db: PrismaClient): Promise<ErasureReceipt>
  Steps:
    1. Find user by userId
    2. Replace email → "[deleted-{hash}]", displayName → null
    3. Find all TaskComment.authorId = userId → set body to "[deleted]"
    4. Write AuditEvent: action="user.gdpr_erasure_completed"
    5. Return receipt: { erasure_id, timestamp, fields_cleared, rows_affected }
  Export from libs/integrations/index.ts

STEP 3d — Test the erasure service (in isolation, no live user data)
  Write a simple test that:
  - Creates a test user
  - Calls eraseUser()
  - Verifies PII fields are replaced
  - Verifies AuditEvent was written
  PASTE: test output

STEP 3e — Add to bedrock checklist
  docs/plan/pillar-0-governance/csps-bedrock.md
  Add: [x] GDPR erasure path in libs/integrations/gdpr.ts (S022)

STEP 3f — Verify
  pnpm verify: exit_code=0
  PASTE output
```

**Verification gate:** AppendOnlyBase in schema, AuditEvent extends it, GDPR function exported, verify exit_code=0.

---

### SESSION 4 — Governance Completion (Option A from S022 mandate)

**Scope:** Promote post-stop-banned-phrase.sh + build validate-comment-truth.mjs.

**Sonnet executes:**

```
STEP 4a — Promote post-stop-banned-phrase.sh from STUB to advisory
  Read current hook content
  Change enforcement_stage from STUB to advisory
  Define specific banned phrases to detect in response artifacts:
    - "I ran [verb]" without tool output in same response
    - "ZF achieved" without STATUS output
    - "task is done" / "implementation complete" without verification
  PASTE: hook test showing it fires on a test response

STEP 4b — Create validate-comment-truth.mjs
  Coverage Levels:
    ✓ Level 1: Scan .ts files for P-ARCH-*/P-META-* citations
    ✗ Level 2: Semantic verification of claims → VLT-S022-COMMENT-TRUTH-SEMANTIC
  
  Behavior:
    Grep all apps/**/*.ts and libs/**/*.ts for P-ARCH-\d+ and P-META-\d+
    For each match: extract the surrounding comment (2 lines above + 2 lines below)
    Output as ADVISORY list for human review
    Exit 0 always (Level 1 is advisory — semantic verification is human-judgment)
  
  Wire into pnpm verify + audit-runner.md entry + pnpm audit-runner:split

STEP 4c — Verify
  node tools/validators/validate-comment-truth.mjs
  PASTE output showing P-ARCH-*/P-META-* citations found
  (Expected: AuditEvent comment re: Postgres triggers will be surfaced)
  pnpm verify: exit_code=0
  PASTE output
```

---

## §4 — Split Decision — Detailed

**Why split into 4 sessions (not bundle):**

| Session | Why Separate |
|---|---|
| VLT Ratification | Governor-only decision, no code, blocks schema work |
| Session 1 (Live DB) | Governor-gated (credentials); schema is ready-to-go; mixing with schema work risks credential confusion |
| Session 2 (Schema) | Batch update of 282 files is high-blast-radius; needs its own ZF cycle; should not share session with infrastructure changes |
| Session 3 (Infrastructure) | Schema migration + new lib; AppendOnlyBase migration and GDPR service affect different layers; if one fails, should not block the other |
| Session 4 (Governance) | Lowest urgency; optional but valuable; can be done in any order after Session 1 |

**What CAN be bundled (if Governor wants to move faster):**

- VLT ratification + beginning of Session 2 (same session — ratify then immediately start schema stamping)
- Session 3 Steps 3a+3b (AppendOnlyBase) can be done in Session 2 if schema work goes fast
- Session 4 can be concurrent with Session 3 (different files, no dependency)

**Minimum viable split (if Governor wants to compress):**
- Bundle VLT ratification + Session 2 (schema) → one session
- Bundle Session 1 (live DB) as standalone (Governor-gated anyway)
- Bundle Session 3 + 4 → one session

---

## §5 — Council Questions for Sonnet

**Present these to Sonnet and ask for a position on each before consensus.**

**Q1 — Sequencing challenge:**
I recommend Live DB (Session 1) before Schema Phase A (Session 2). The reasoning: real users before taxonomy. Sonnet may argue Schema Phase A first because building the second app requires domain taxonomy, and the second app is more important than the first user validating task-mgmt.

**Sonnet: which order — live DB first or schema taxonomy first? State your reasoning.**

---

**Q2 — AppendOnlyBase scope:**
Session 3 proposes AppendOnlyBase as a schema change + migration. This is a potentially disruptive change to the live DB (once Session 1 is done, AuditEvent migration might affect real data). Should AppendOnlyBase happen BEFORE live DB (safe to run in empty DB) or AFTER (requires a live migration)?

**Sonnet: when should AppendOnlyBase happen — before or after pnpm db:push?**

---

**Q3 — GDPR scope in Session 3:**
The GDPR erasure service is a `libs/integrations/gdpr.ts` function. It requires a test but does NOT require a UI. The question: should we implement it now with zero EU users (proactive), or defer until the first EU user is onboarded (reactive)?

**Sonnet: implement GDPR now or defer? Consider that EU users could sign up the moment the platform goes live.**

---

**Q4 — Governance Option A timing:**
Session 4 (post-stop-banned-phrase.sh + validate-comment-truth.mjs) is de-coupled from Sessions 1-3. Could Session 4 run in parallel with Session 3, or is there a dependency I'm not seeing?

**Sonnet: is Session 4 blocking anything? Or can it run any time?**

---

**Q5 — The VLT ratification question:**
I say ratify the 3 VLTs now (10 minutes, no code). The alternative: defer ratification until the Governor has seen how domain_path is actually used in a real app, making a more informed decision. Which produces better decisions?

**Sonnet: ratify VLTs now (speculatively) or wait for real-world evidence?**

---

**Q6 — What am I missing?**
This plan was written by an Opus-designated reviewer who has full context on the S019-S021 arc. The reviewer may have missed:
- A dependency that Sonnet knows about from the S020-S022 implementation sessions
- A technical constraint in the Supabase/Prisma setup
- A VLT that's already partially resolved

**Sonnet: what does this plan not account for that you learned in S020-S022?**

---

## §6 — Success Criteria

**How we know the plan succeeded:**

After Session 1 (Live DB):
```
✓ pnpm verify: exit_code=0
✓ pnpm db:push: "database in sync with Prisma schema"
✓ AuditEvent in live Supabase for at least one action
✓ Clerk auth working with real JWT
```

After Session 2 (Schema):
```
✓ pnpm verify: exit_code=0
✓ validate-frontmatter.mjs: errors=0 (no new errors from new fields)
✓ domain-taxonomy.md exists
✓ libs/policies/slices/ directory structure exists
✓ All platform artifacts have domain_path: "platform"
✓ domain_path validated in frontmatter validator
```

After Session 3 (Infrastructure):
```
✓ pnpm verify: exit_code=0
✓ AppendOnlyBase in schema.zmodel
✓ AuditEvent extends AppendOnlyBase (not Base)
✓ validate-foundation-schema-drift.mjs: field_advisory=0
✓ libs/integrations/gdpr.ts exported
✓ GDPR test passes: PII fields replaced + AuditEvent written
```

After Session 4 (Governance):
```
✓ pnpm verify: exit_code=0
✓ post-stop-banned-phrase.sh: enforcement_stage=advisory (not STUB)
✓ validate-comment-truth.mjs: exit_code=0, P-ARCH-008 citation surfaced
✓ enforcement_rate: still ≥29% (should tick up with comment-truth)
✓ drift_coverage: 6/7 types active (documentation drift now monitored)
```

---

## §7 — What I Am Not Recommending (and Why)

**Not recommending: WisdomVault full build now.**
The WisdomVault requires AppendOnlyBase (Session 3) and domain_path stamping (Session 2) as prerequisites. Building WisdomEntry and WisdomHub before those foundations exist creates a floating abstraction. Sequence matters.

**Not recommending: Domain schema slices now (health.zmodel, finance.zmodel).**
Domain slices without: (a) a live database to test against, (b) domain taxonomy stamped, (c) compliance profiles per domain — are premature. Build the infrastructure first.

**Not recommending: UI/UX work now.**
The consolidated plan correctly identifies UX/frontend as Phase H. It cannot be built correctly until: domain selection wizard depends on domain taxonomy (Session 2), onboarding flow depends on persona_target (Session 2), cross-domain dashboard depends on WisdomHub (Phase C).

**Not recommending: Developer API documentation.**
Cannot document an API before it's fully working with real users. Session 1 reveals what works; documentation follows from working reality.

---

## §8 — The Governor's "Plan Maturity Doctrine" Applied Here

Per §10 of the consolidated plan, this implementation plan itself is subject to the doctrine.

**Context absorbed:** Session state (S021 mandate with Options A/B), consolidated plan (S021), platform readiness assessment (28%), both expert panel plans reviewed.

**Schema aligned:** Every new artifact proposed has a `domain_path` proposal (platform for governance artifacts, libs-level for infrastructure).

**Timing respected:** This is a recommendation for Governor-Sonnet council. It does NOT begin implementation in the session it was written. The council discussion is the maturation step.

**North Stars:**
- Local (S022): Ratify VLTs + decide A vs B
- Mid-range (S025): First real user + schema taxonomy + infrastructure complete
- Major: 30 governed apps, WisdomVault, domain coverage

**This plan aligns to all three North Stars.**

---

*Prepared by Claude Sonnet 4.6[1M] in Opus-designated review mode.*
*For Governor-Sonnet mini council. Sonnet addresses Q1-Q6 before consensus.*
*S021 | 2026-05-09*
