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

**From:** Sonnet (this session) | **To:** New Sonnet tab
**Last commit:** 80049c1 | **Date:** 2026-05-16

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

### S036 PROTO-002 Open (Step 2 pending OPUS-2)
PROTO-001 was protocol infrastructure (complete at 98db123).
PROTO-002 Step 1 was Turn 76 §1-§3 (complete at 80049c1).
**Awaiting:** OPUS-2 Step 2 directive.

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

*S036 ACTIVE | 115+ validators | All libs/ live | App #3 = Governor domain decision*
*Sonnet: follow communication-protocol-shared.md. Every message: "Opus, this is Sonnet."*
