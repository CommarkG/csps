---
id: csps.handoff.s036-to-s037
name: HANDOFF-S036-to-S037
description: S036 → S037. ZCA ratified constitutional. 3 protocols complete. Error registry live. S037 = PI-002 schema — PI tracking infrastructure.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S036
impl_status: swift-implemented
scope_level: S1
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: parent, href: ../README.md }
---

# HANDOFF — S036 → S037

**S036 CLOSED** | 2026-05-16

---

## Zone A — Platform State at S036 Close

### §CORE-PILLARS (mandatory — incoming AI reads this first)

| Spine | Status | Notes |
|---|---|---|
| GVRN | ✅ HEALTHY | 63 principles, 60 contracts, all sealed decisions intact |
| ARCH | ✅ HEALTHY | libs/integrations/ + libs/components/ fully live, wired |
| AI | ✅ HEALTHY | 9 inner-default categories, ZCA added, boundary-assumptions.md live |
| OPER | ✅ HEALTHY | B_ZERO_LAPTOP_DEPENDENCY satisfied, all commits on remote |
| VALD | ✅ HEALTHY | 115+ validators, pnpm verify exit_code=0, 0 VLT blockers |

**FOUNDATION_EXIT_GATE:** CLEAN — no unchecked exit criteria in active topic plans.

### Platform Numbers

```yaml
session: S036
date_closed: 2026-05-16
last_commit: pending (S036 close commit)
validators: 115+
exit_code: 0
principles: 63
behavioral_contracts: 60
audit_slugs: 28
moat_elements: 25
```

### What is LIVE

**libs/integrations/**
- auth.ts — isSessionReady()
- security/ — headers, validation, audit, guards, rate-limit (Upstash), resilience
- email/ — Resend + 5 templates
- jobs/ — Inngest + 4 functions (welcome/expiry/digest/webhook-delivery)
- monitoring/ — Sentry + PostHog (graceful passthrough)
- storage/ — Cloudflare R2 (graceful passthrough)
- realtime/ — polling SSE via Upstash Redis
- All graceful passthrough when env vars not set

**libs/components/**
- DashboardShell, SettingsLayout, FeatureGateOverlay, OnboardingWizard, DataTable<T>
- @csps/components wired to apps/template + apps/budget-planner

**Apps**
- Budget Planner: LIVE at csps-budget-planner.vercel.app (Gate 3 ✅)
- apps/template: 18-file scaffold + `pnpm create:app [name]`

### S036 Deliverables (complete)

| Deliverable | Commit | Status |
|---|---|---|
| PROTO-001: 3-step wiring audit (19 WIRED / 12 DEFERRED / 22 ORPHAN) | c91a974 | ✅ |
| validate-wiring-completeness.mjs LIVE | c91a974 | ✅ |
| validate-communication-protocol.mjs LIVE | ddfa4db | ✅ |
| validate-active-protocol.mjs LIVE | ddfa4db | ✅ |
| validate-snapshot-continuity.mjs LIVE | ddfa4db | ✅ |
| validate-error-registry-coverage.mjs LIVE | 25cbec8 | ✅ |
| post-stop-error-harvest.sh LIVE | 80049c1 | ✅ |
| 6 EP-ERR patterns in error-registry/ | 25cbec8 | ✅ |
| P-UX-001 contextual-locality + B_CONTEXTUAL_LOCALITY | ddfa4db | ✅ |
| ZCA: 5 surfaces (Rule 7 + inner-default + template + AGENTS.md + P-UX-002) | 6ffb879 | ✅ |
| B_ZCA + audit slug + memory + L2 domain (CEC complete) | S036 close | ✅ |
| pnpm principles:split (63 principles) | S036 close | ✅ |
| pnpm contracts:split (60 contracts) | S036 close | ✅ |

### SEALED DECISIONS (do NOT re-open)

- P-ARCH-030: apps are ephemeral trials
- P-ARCH-031: DONE = wired + called + verified (not just committed)
- P-UX-001: contextual-locality (B_CONTEXTUAL_LOCALITY)
- P-UX-002: zero-context-assumption / ZCA (B_ZCA) — **NEW S036, CONSTITUTIONAL**
- USM S0-S5 unified scope model
- Communication protocol: 7 rules in communication-protocol-shared.md (Rule 7 = ZCA — new S036)
- No Parallel Pipelines (validate-active-protocol.mjs)
- GCI gate: GCI<10 proceed, ≥10 SROF first

### Governor Actions Still Pending

1. Resend, Inngest, Sentry, PostHog accounts → API keys in Vercel
2. Upstash Redis → UPSTASH_REDIS_REST_URL + TOKEN in Vercel
3. Cloudflare R2 → account + bucket + API keys in Vercel
4. **Codespaces db:push** — push S032 schema changes (Notification, WebhookEndpoint, viewer, plan/features/limits)

### OPUS-2 Open Items (still pending — see tools/council/opus-open-items.md)

Critical blockers for S037:
- **OPEN-001**: PI-002 PI schema YAML format + create-pi.mjs (S037 PRIMARY)
- **OPEN-002**: PI-003 validate-implementation-gate.mjs (PIG)
- **OPEN-006**: post-stop-rzf-reminder.sh hook
- **OPEN-013**: S036 formal close ← this HANDOFF satisfies it

---

## Zone B — S037 Mandate

### S037 PRIMARY: PI-002 Schema — PI Tracking Infrastructure (OPEN-001)

**What it is:** The Plan Item (PI) schema is the backbone of implementation governance. Every new file in libs/ or apps/ requires a PI item with `ratified_at:` set by Governor. Without PI-002, the implementation gate (PIG) has no schema to enforce against.

**What OPUS-2 specified (Turn 59):**
```yaml
# PI schema format (PI-002)
- id: PI-NNN
  title: <what is being built>
  ratified_at: <date Governor approved>
  ratified_by: yariv
  session: S<NNN>
  status: pending | in-progress | done
  wiring_required: true | false
  files: [list of files this PI covers]
```

**What Sonnet builds in S037:**
1. `tools/templates/pi.schema.yaml` — canonical PI schema (from OPEN-001)
2. `tools/scripts/create-pi.mjs` — creates a new PI file from schema
3. `tools/validators/validate-implementation-gate.mjs` (PIG) — blocks commits with new libs/ files not covered by a ratified PI
4. Wire PIG into `pnpm verify` as BLOCKING at PR level

**First action for S037:** Read `tools/council/opus-turn.md` Turn 59 §PI-002 for full spec, then file SROF to OPUS-2 confirming PI schema before building.

### S037 SECONDARY: OPEN-006 — post-stop-rzf-reminder.sh

Promote from STUB to ACTIVE: when post-stop fires and session has DONE/COMPLETE/RATIFIED claims, inject "RZF required — run pnpm verify and paste exit_code=0 before declaring done."

---

## Communication Protocol (mandatory — apply now)

From `tools/council/communication-protocol-shared.md` (7 rules):

**RULE 1:** Every Sonnet→Opus message: `Opus, this is Sonnet.`
**RULE 2:** Every Opus directive: `[PROTOCOL: ID | STEP: N of M | MODE: x] Sonnet, this is Opus.`
**RULE 3:** Report: `Opus, this is Sonnet. [session] done at commit [sha] — [items]. Questions: (1)...`
**RULE 4:** Content at point of use. Never "see §X".
**RULE 5:** ONE active directive at a time.
**RULE 6:** DONE = built + wired + called + output verified.
**RULE 7 (ZCA — NEW):** Every cross-boundary message starts with WHO/WHAT/HOW/NOW. Never assume receiver knows anything.

---

---

## ALIGNMENT QUESTIONS (P-META-014 MUV — mandatory for cross-boundary handoff)

> These questions fire AFTER the default protocol. The receiving AI answers them before touching any code. Questions generated from actual S036 state — not generic.

**Q1 — Completion verification:**
S037 items (A through D) were marked done. Before accepting any as complete: run `node tools/verify.mjs` and confirm `exit_code=0`. Which S037 items have verify evidence in THIS session vs inherited from previous?

**Q2 — OPEN items register currency:**
The open items register at `tools/council/opus-open-items.md` shows statuses. Which items are marked done but have no commit SHA? Which items were done but pnpm verify wasn't re-run after?

**Q3 — PE Agent status:**
OPEN-003 (PE Agent, PE=78) is the highest-PE remaining item. The AAP spec is in `docs/plan/pillar-0-governance/meta-platform/pe-agent.md`. What's the FIRST action for S037-E — reading Turn 83 directive or filing SROF to OPUS-2?

**Q4 — ZCA hook deployment:**
`post-stop-rzf-reminder.sh` was registered in settings.json (S037-B). Has it fired in practice in this session? Any false positives worth reporting to OPUS-2?

**Q5 — Universal governance sync:**
`pnpm sync:universal` was wired in S037-C. Has it been run since P-ARCH-031 was added to principles.yaml? If not, run it now to generate a PROP-NNN candidate for universal-governance.

---

*S036 CLOSED | ZCA constitutional | 63 principles | 60 contracts | 115+ validators | S037 = PI-002 schema*
