---
id: csps.vault.chat-jump-S036-complete
name: chat-jump-S036-complete
description: Complete professional chat transfer for S036 continuation. All context, state, open items, and directives self-contained.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S036
scope_level: S1
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: parent, href: ../README.md }
---

# Chat Transfer — S036 Complete State

**S036 CLOSED — session complete. Use HANDOFF-S036-to-S037.md for S037.**

**From:** Sonnet (OPUS-2 enhanced) | **To:** New Sonnet tab
**Last commit:** 76328f4 | **Date:** 2026-05-16 | **OPUS-2 turn:** 78

---

## WHO YOU ARE AND HOW THIS WORKS (read this first — assume nothing)

**You are:** A new Claude Sonnet instance (builder/implementer) taking over from a previous Sonnet tab that ran out of context. You have no memory of what happened before. Everything you need is in this file and the files it references.

**Your role:** Builder and Implementer. You write code, create files, run validators, commit to GitHub, and report back. You do NOT make architectural decisions alone — you ask OPUS-2 for direction on anything architectural.

**OPUS-2 (Claude Opus in a separate chat tab):** The Architectural Advisor. OPUS-2 makes design decisions, produces directives for you to implement, and reviews your work. OPUS-2 writes turns to `tools/council/opus-turn.md`. You implement, then report back. When you have architectural questions: file a SROF (Sonnet Request for Opus Feedback) and say "SROF-NNN filed."

**The Governor (Yariv Fink):** The human decision-maker. He relays messages between you and OPUS-2 — paste your reports to him, he brings them to OPUS-2, OPUS-2 responds, he brings that back to you. He ratifies all significant decisions.

**The 3-party triangle:**
```
OPUS-2 (architect) writes directives → Governor (relay) pastes to Sonnet → 
Sonnet implements → Sonnet reports to Governor → Governor brings to OPUS-2
```

**The project (CSPS):** CoreSights Platform Services — a multi-tenant SaaS platform (TypeScript/Next.js 14) built to support up to 30 apps. Budget Planner is the first deployed app at csps-budget-planner.vercel.app. The codebase is a pnpm monorepo with Clerk (auth), Supabase PostgreSQL (database), ZenStack (schema-based security), and Vercel (deployment).

**The workspace:** `c:\Users\finky\Desktop\Claude Code\Csps` — this is the repo root. All paths in this file are relative to it.

**Governance:** 115+ validators run via `node tools/verify.mjs`. Exit code must be 0 before every commit. Principles live in `packages/principles/`. Constitutional decisions are sealed — do NOT re-open them.

---

## MANDATORY READ ORDER (do this before anything else)

1. `tools/council/platform-state-snapshot.md` — current platform reality
2. `tools/council/communication-protocol-shared.md` — 6 rules, apply immediately
3. `tools/council/opus-turn.md` — start at Turn 70 for recent architectural decisions
4. `tools/council/quick-reference.md` — Sonnet operational flow

**DO NOT read the full conversation history. Read the files above.**

---

## PLATFORM STATE (verified 2026-05-16)

```
Validators: 115+ (pnpm verify exit_code=0)
Last commit: 80049c1
Session: S036 ACTIVE
Principles: 62 (P-UX-001 contextual-locality added S036)
Behavioral contracts: 59 (B_CONTEXTUAL_LOCALITY added S036)
Moat elements: 25 (M-24+M-25 added S032)
```

### What is LIVE (libs/integrations/)
- auth.ts — isSessionReady()
- security/ — headers, validation, audit, guards, rate-limit (Upstash), resilience
- email/ — Resend + 5 templates
- jobs/ — Inngest + 4 functions (welcome/expiry/digest/webhook-delivery)
- monitoring/ — Sentry + PostHog (graceful passthrough)
- storage/ — Cloudflare R2 (graceful passthrough)
- realtime/ — polling SSE via Upstash Redis
- **All graceful passthrough when env vars not set**

### What is LIVE (libs/components/)
- DashboardShell, SettingsLayout, FeatureGateOverlay, OnboardingWizard, DataTable<T>
- @csps/components wired to apps/template + apps/budget-planner

### Apps
- Budget Planner: LIVE at csps-budget-planner.vercel.app (Gate 3 ✅)
- apps/template: 18-file scaffold + pnpm create:app [name]

### Validators LIVE (new in S036)
- validate-wiring-completeness.mjs (19 WIRED / 12 DEFERRED / 22 ORPHAN)
- validate-communication-protocol.mjs (identity handshake check)
- validate-active-protocol.mjs (no parallel pipelines)
- validate-snapshot-continuity.mjs (module drift detection)
- validate-error-registry-coverage.mjs (EP-ERR documentation check)
- post-stop-error-harvest.sh (Governor-confirmed, LIVE)

---

## COMMUNICATION PROTOCOL (mandatory — apply now)

From `tools/council/communication-protocol-shared.md`:

**RULE 1:** Every Sonnet→Opus message starts: "Opus, this is Sonnet."
**RULE 2:** Every Opus directive: `[PROTOCOL: ID | STEP: N of M | MODE: x] Sonnet, this is Opus. Read [file] — [task]; then pnpm verify exit_code=0 before committing.`
**RULE 3:** Report format: `Opus, this is Sonnet. [session] done at commit [sha] — [items]. Questions: (1)...`
**RULE 4:** Content at point of use. Never "see §X". Paste target inline.
**RULE 5:** ONE active directive at a time. Report step-complete before Step N+1.
**RULE 6:** DONE = built + wired + called + output verified. Never commit alone.

**Write INTENT ABSORBED to sonnet-turn.md before touching any file.**

---

## OPEN ITEMS (priority-ordered)

### SROF-011 (filed, awaiting Opus ratification)
Two questions for OPUS-2:
1. Core completion ratification — is the platform core complete? What is the criterion?
2. Knowledge engine — architecture for permanent external-knowledge absorption vault

**Paste to OPUS-2:**
`Opus, this is Sonnet. S036 is at commit 80049c1 — 115+ validators, all libs/ modules live, libs/components/ 5 shells, pnpm verify exit_code=0. SROF-011 pending: (1) Will Opus ratify platform core completion? (2) What is the architecture for the knowledge engine (permanent absorption of external skills/agents/SaaS into CSPS vault with raw-research-preserved policy)?`

### Governor Directive (deferred — UX/UI brief)
Filed at: `docs/plan/_handoff/VAULT/governor-brief-app3-ux-templates.md`
Content: onboarding wizard archetypes, sandbox trial mode, OUTPUTS list (website/landing/funnel/email/pricing)
**Status:** Deferred until after items #2-5. To be re-presented improved after ratification.

### PROTO-002 Step 2 — Active (paste this to Sonnet)
PROTO-001 complete (98db123). PROTO-002 Step 1 complete (25cbec8).
Step 2 directive (paste when Governor confirms "apply hook"):
`[PROTOCOL: PROTO-002 | STEP: 2 of 2 | MODE: sequential] Sonnet, this is Opus. Read tools/council/opus-open-items.md OPEN-019 — Step 2: (1) apply .claude/hooks/post-stop-error-harvest.sh per the diff already shown; (2) update validate-wiring-completeness.mjs to exempt symbols imported within libs/ itself (libs/-to-libs/ = internal-use, not orphan); (3) add to AGENTS.md Hard Rule: "PATIENCE: Governed foundation beats fast patches after session 10."; (4) present diff for session-open.sh Patient Foundation injection; then node tools/verify.mjs exit_code=0 before committing.`

### OPUS-2 Open Items Register
19 items pending — see `tools/council/opus-open-items.md`
Most critical blockers: OPEN-001 (PI-002 schema), OPEN-002 (PIG validator), OPEN-006 (rzf-reminder hook)

### App #3 Domain Decision
Platform ready. Governor selects domain.
`pnpm create:app [name]` scaffolds immediately.
OPUS-2 will produce PE-scored topic-plan once domain crystallized (P-META-022).

### db:push (deferred)
S032 schema changes (Notification, WebhookEndpoint, viewer, plan/features/limits) need Prisma migration.
Run from Codespaces: `prisma db push --schema=libs/policies/generated/schema.prisma`

### Service Accounts Pending (Governor action)
Resend (RESEND_API_KEY), Inngest (INNGEST_SIGNING_KEY), Sentry (SENTRY_DSN),
PostHog (POSTHOG_API_KEY), Upstash (UPSTASH_REDIS_*), Cloudflare R2 (R2_*)

---

## ERROR PATTERNS REGISTRY (new in S036)
6 patterns documented in `docs/plan/_handoff/VAULT/error-registry/`:
- EP-ERR-001: done-equals-committed (mechanically prevented)
- EP-ERR-002: implement-without-ratification (mechanically prevented)
- EP-ERR-003: invent-governance-concepts (advisory)
- EP-ERR-004: sycophantic-compliance (advisory)
- EP-ERR-005: announce-not-track (advisory)
- EP-ERR-006: context-fades-mid-session (mechanically prevented)

**When Governor sends a correction:** post-stop-error-harvest.sh fires and injects HARVEST GATE prompt.

---

## WIRING STATE (from validate-wiring-completeness.mjs)
**19 WIRED** — rateLimitUser, securityHeaders, isSessionReady, handleClerkWebhook, inngest, allFunctions, DashboardShell, SettingsLayout, OnboardingWizard, track, auditLog, triggerWebhook, etc.
**12 DEFERRED** — FeatureGateOverlay, DataTable, checkMembership, uploadFile, withFallback, etc. (wiring_deferred_until: S036-B2)
**22 ORPHAN** — email templates, Zod schemas, Stripe helpers (internal-use only, no app concern)

---

## SEALED DECISIONS (do NOT re-open)
- P-ARCH-030: apps are ephemeral trials (deletion test standard)
- USM S0-S5 unified scope model
- GCI gate: GCI<10 proceed, ≥10 SROF first
- Communication protocol (6 rules in communication-protocol-shared.md)
- No Parallel Pipelines (validate-active-protocol.mjs)
- DONE standard (P-ARCH-031): wired + called + verified, not just committed
- contextual-locality (P-UX-001, B_CONTEXTUAL_LOCALITY): content at point of use

---

## FIRST ACTIONS IN NEW CHAT

1. Write INTENT ABSORBED to sonnet-turn.md immediately
2. Run `node tools/validators/validate-partial-processes.mjs` — confirm baseline
3. Check OPUS-2 tab for any new directives
4. If Governor provides App #3 domain — file SROF to OPUS-2 for topic-plan

---

---

## HOW SONNET HANDLES CHAT TRANSFERS (Permanent Protocol)

When context fills and a new Sonnet tab is needed:
1. **Before closing:** Update this file — commit with `git add docs/plan/_handoff/VAULT/chat-jump-S036-complete.md`
2. **Fields to update:** last_commit, PROTO-* status, OPEN items count, any new validators
3. **Test the paste target:** The one-paragraph below must be self-contained — new Sonnet proceeds without asking questions
4. **Notify OPUS-2:** Add "Sonnet chat-jump: created/updated" to Sonnet Report

The paste paragraph is the canonical entry point. Files referenced within it are secondary.

---

*S036 ACTIVE | 115+ validators | All libs/ live | PROTO-002 Step 2 pending | 19 OPUS-2 open items*
*Communication protocol: every message starts "Opus, this is Sonnet." | DONE = wired + called + verified*
*OPUS-2 Tab: report to Opus when needed. Never parallel directives.*
