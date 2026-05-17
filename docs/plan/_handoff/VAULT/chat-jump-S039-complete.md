---
id: csps.vault.chat-jump-S039-complete
name: chat-jump-S039-complete
description: "Complete professional chat transfer for S039 continuation. WHO/WHAT/HOW/NOW + full state + alignment questions. ZCA-compliant."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S039
scope_level: S1
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: parent, href: ../README.md }
---

# Chat Transfer — S039 Complete State

**Last commit:** c2fc7f7 | **Date:** 2026-05-17 | **OPUS-2 Turn:** 95+

---

## WHO YOU ARE AND HOW THIS WORKS (read this first — zero prior context assumed)

**You are:** A new Claude Sonnet instance (builder/implementer). You write code, create files, run validators, commit to GitHub, and report back. You do NOT make architectural decisions alone — ask OPUS-2 for direction.

**Your role:** Builder. Before touching any file: write INTENT ABSORBED to `tools/council/sonnet-turn.md`.

**OPUS-2 (Claude Opus in a separate chat tab):** The Architectural Advisor. Writes turns to `tools/council/opus-turn.md`. Read from Turn 80 onward for recent directives.

**The Governor (Yariv Fink):** The human decision-maker. Relays messages between you and OPUS-2. Ratifies all significant decisions. **Only the Governor can set `ratified_at` on PI items.**

**The 3-party triangle:**
```
OPUS-2 (architect) writes directives → Governor (relay) pastes to Sonnet →
Sonnet implements → Sonnet reports to Governor → Governor brings to OPUS-2
```

**The project (CSPS):** CoreSights Platform Services — a governed, AI-collaborative foundation for building multi-tenant SaaS products. Next.js 14 monorepo, pnpm, Clerk/Supabase/ZenStack/Vercel. Budget Planner is the first deployed app at csps-budget-planner.vercel.app.

**The workspace:** `c:\Users\finky\Desktop\Claude Code\Csps` — repo root. All paths relative to it.

**Governance:** 127+ validators run via `node tools/verify.mjs`. Exit code must be 0 before every commit. Principles in `packages/principles/`. Constitutional decisions are sealed.

---

## WHAT (the project and system)

**Stack:** Next.js 14 / Clerk (auth) / Supabase PostgreSQL / ZenStack (schema-based RLS) / Vercel

**Key platform numbers at S039 close:**
- Validators: 127+ (node tools/verify.mjs exit_code=0 confirmed)
- Principles: 65 (packages/principles/principles.yaml)
- Behavioral contracts: 61
- Skills: 27 (all AAP-aligned, including /pe-agent)
- Moat elements: 26 (M-26: DNA inheritance gate)

**Live apps:**
- Budget Planner: csps-budget-planner.vercel.app (Gate 3 ✓, FIXED at c2fc7f7 after build errors)

---

## HOW (the working pattern)

**Communication Rules (tools/council/communication-protocol-shared.md, Rules 1-10):**
- Rule 1: Every Sonnet→Opus message: `Opus, this is Sonnet.`
- Rule 2: Directives: `[PROTOCOL: ID | STEP: N of M | MODE: x] Sonnet, this is Opus.`
- Rule 6: DONE = built + wired + called + verified. Not just committed.
- Rule 7 (ZCA): Every cross-boundary message starts with WHO/WHAT/HOW/NOW.
- Rule 8: Register → Implement → Wire → Verify. Never implement without registering.
- Rule 9: Pre-directive RZF. Directive quality gate.
- Rule 10: YOU ARE / I AM / THIS IS THE SITUATION / YOUR TASK format for all directives.

**The NEW protocol (Governor ratified S039):** Nothing is coded without a ratified plan. `ratified_at` must be set by Governor explicitly. Pending plan → no code.

**Verification:** `node tools/verify.mjs exit_code=0` before every commit. `pnpm --filter @csps/[app] build` before declaring build-related fixes done (tsc alone is insufficient).

**ZF discipline:** ZF = Zero Findings. Cycle terminates only when findings reach zero. Cycle 2 must NAME what was re-examined — not just "0 new findings."

---

## NOW (current state and next action)

**Last commits:**
```
c2fc7f7 fix: PROTO-018 — Budget Planner build clean (next build passes)
b4eb88b S039: purge forbidden term + fix OPUS role description + register OPEN-029/030
6174a56 fix: Budget Planner build errors — 3 fixes → 0 TypeScript errors
41159ae Rule 10: mandatory context block
da592d9 S039: comprehensive OPUS-2 chat-jump + planning pipeline spec for S040
```

**Budget Planner status:**
- Build: FIXED (c2fc7f7). Deleted sentry.client.config.ts, stubbed inngest route and libs/integrations/jobs/inngest.ts, added deferred-packages.d.ts type stubs.
- Dashboard: LIVE at /dashboard (moved from root / in 17cc957)
- OnboardingWizard: WIRED in account-setup for both apps (fixed 1d45e78)
- tsc --noEmit: 0 errors confirmed

**Key pending items (tools/council/opus-open-items.md):**
- OPEN-026: P-META-026 ratification (planning-before-implementing as primary pillar) — AWAITING GOVERNOR
- OPEN-027: csps-master-plan.md auto-update mechanism — pending
- OPEN-029: Absorb remaining research files (04-11 series) as EXT-KNOW entries — pending
- OPEN-030: PROP-APP3-001: Governor decision on App #3 domain — AWAITING GOVERNOR
- OPEN-031: EP-ERR entry for premature-done-on-tsc-not-build — pending
- OPEN-032: Audit empty (dashboard) route group in budget-planner — pending review
- OPEN-033: Add `pnpm --filter @csps/[app] build` to standard verification tail — pending

**What S040 opens with (per OPUS-2 Turn 95 planning pipeline):**
1. Governor decision on OPEN-030 (App #3 domain) — unblocks all S040 app work
2. Register OPEN-031 EP-ERR in error-registry/ — quick governance fix
3. OPEN-026 P-META-026 ratification — constitutional principle for planning-before-implementing

---

## MANDATORY READ ORDER (do this before anything else)

1. `tools/council/platform-state-snapshot.md` — current platform reality (needs S039 update)
2. `tools/council/communication-protocol-shared.md` — 10 rules, apply immediately
3. `tools/council/opus-turn.md` — start at Turn 90 for recent architectural decisions
4. `tools/council/opus-open-items.md` — pending work register (OPEN-023 through OPEN-033)
5. `docs/plan/pillar-4-developer-experience/developer-journey/README.md` — the developer journey mini-tree (new in S039)

**DO NOT read the full conversation history. Read the files above.**

---

## IMPORTANT: NEWLY ESTABLISHED PROTOCOLS (ratified S039)

**1. Planning-before-implementing rule:** Nothing is coded without a ratified plan. Pending plan → no code. Governor must explicitly set `ratified_at` — "proceed" or "approved" is not ratification.

**2. User Journey Tests (UJT-NNN.yaml):** Every user-facing feature has a UJT file at `docs/plan/_handoff/VAULT/user-journey-tests/`. Record results with `pnpm record:ujt --test UJT-001 --result pass --observation "..."`. UJT-001 (Budget Planner threshold flow) is pending — needs manual browser test.

**3. DNA inheritance gate (M-26):** Every new libs/ TypeScript file > 50 lines needs `@csps-enforces` annotation. `validate-new-file-dna.mjs` BLOCKS if missing.

**4. Build verification:** For build-related fixes: `pnpm --filter @csps/[app] build` (not just tsc) is required before declaring done. (OPEN-033 — pending Rule update)

**5. RZF before response:** The UserPromptSubmit hook injects the RZF mandate on every turn. Cycle 2 must name what was re-examined from Cycle 1.

---

## GOVERNOR ACTIONS STILL PENDING

1. **OPEN-030**: What is App #3? State the domain for Sonnet to begin planning.
2. **OPEN-026**: Ratify P-META-026 as a constitutional principle: "planning-before-implementing is the primary pillar."
3. **Service accounts**: Resend / Inngest / Sentry / PostHog / Upstash / R2 → API keys in Vercel.
4. **db:push**: S032 schema changes (Notification, WebhookEndpoint) not yet in Supabase.
5. **UJT-001**: Visit csps-budget-planner.vercel.app, sign up with new email, record observation.

---

## FIRST ACTIONS IN NEW CHAT

1. Write INTENT ABSORBED to `tools/council/sonnet-turn.md`
2. Run `node tools/verify.mjs` — confirm exit_code=0 baseline
3. Update `tools/council/platform-state-snapshot.md` to S039 CLOSED
4. Check OPUS-2 tab for Turn 96+ directive, OR await Governor's App #3 domain decision

---

## ALIGNMENT QUESTIONS (P-META-014 MUV — answer before any implementation)

**Q1 — Budget Planner live verification:** Has anyone visited csps-budget-planner.vercel.app AFTER commit c2fc7f7 deployed? If yes, what was the result? If no, that should be the first action — the UJT-001 test is still pending.

**Q2 — App #3 domain:** Has the Governor made the OPEN-030 decision yet? If yes, that is the highest PE item for S040. If no, S040 starts with governance housekeeping (OPEN-031 EP-ERR registration + OPEN-033 Rule update).

**Q3 — Deferred packages status:** `libs/integrations/jobs/inngest.ts`, `libs/integrations/email/client.ts`, and others are stubbed until real packages are installed. Are any of these now ready to activate? (Would require: install package + set env var in Vercel + test)

**Q4 — Planning grid ratification:** The planning grid concept was explained to OPUS-2 in the S039 session. Is there a Turn 96+ directive from OPUS-2 that ratifies it as a formal CSPS concept? This unlocks S040 App #3 planning.

**Q5 — validate-wiring-completeness state:** The last known result was wired=19 deferred=34 orphan=0. After the Budget Planner fixes (stubbed inngest, email client stub), is this still clean? Run `node tools/validators/validate-wiring-completeness.mjs` to confirm.

---

*S039 ACTIVE → transitioning to S040 | Last confirmed commit: c2fc7f7 | verify exit_code=0*
*Budget Planner build FIXED | App #3 domain PENDING Governor | Planning protocol RATIFIED*
