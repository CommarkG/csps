---
id: csps.council.multi-session-plan-S040
name: multi-session-plan-S040
description: "Multi-session, multi-chat roadmap for S040+. PE-scored. Optimal order. Starting point for Governor alignment questions."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: council_state
session: S040
last_updated: 2026-05-17
---

# CSPS Multi-Session Plan — S040 Onwards

**Purpose:** Single reference for what to build, in what order, across sessions and chats.
**Rule:** Read this at every session open. Update at every session close.

---

## §1 — Platform Status (as of S040, 2026-05-17)

```
Validators: 128 (exit_code: 0)
Principles: 65 ratified
Live commits today: d3153ab (B_INHERITANCE_POLICY), 6314577 (Habit Tracker)
Apps: Budget Planner (broken — DROP), Habit Tracker (built, needs Vercel deploy)
New fixes this session: Turn counter hook + BLOCKING handoff validator
```

---

## §2 — STOP: What NOT to Do

These are banned from new work. Do not revisit.

1. **Budget Planner** — Governor dropped it. Any server error on csps-budget-planner.vercel.app = ignore.
2. **Foreign vocabulary** — vocabulary-exclusion-list.md contains 28 banned terms. Check before writing.
3. **T3-only enforcement** — B_INHERITANCE_POLICY requires T1+T2+T3. T3-only = drift = forbidden.
4. **Passive gap observation** — "should not be forgotten" = banned. Register OPEN-NNN immediately.

---

## §3 — Immediate Priorities (PE-scored)

### PRIORITY 1 — P-META-026 Ratification [PE: 90] ✅ DONE

**Status:** ✅ RATIFIED 2026-05-17 by Governor (S040 C1). "I approve all your recommendations."
**Principle:** Before implementing ANY feature, intent must be crystallized through the threshold intake protocol. No code without ratified plan.
**Unblocks:** S040 pipeline mandate (routing → intent crystallization → PI item flow). OPEN-023/024 can now progress.

---

### PRIORITY 2 — Habit Tracker Vercel Deployment [PE: 85]

**What:** Deploy Habit Tracker to Vercel. Connect to same Supabase DB as Budget Planner.
**Checklist:**
1. Create new Vercel project: csps-habit-tracker
2. Set Root Directory: `apps/habit-tracker`
3. Connect GitHub repo: CommarkG/csps
4. Copy env vars from Budget Planner project: DATABASE_URL, DIRECT_URL, CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_WEBHOOK_SECRET
5. Run `prisma migrate deploy` OR `prisma db push` on the shared DB to create Habit + HabitLog tables
6. Verify: https://csps-habit-tracker.vercel.app → should show sign-in
**Status:** App built and pushed. Awaiting Governor Vercel setup.

---

### PRIORITY 3 — Consolidation Pass [PE: 80]

Four confirmed duplicate/redundant files that must be resolved before building new governance:

| # | What | Action |
|---|---|---|
| C-1 | `communication-protocol-shared.md` + `quality-protocols/shared-rules.md` | Delete shared-rules.md. Add redirect comment pointing to communication-protocol-shared.md. |
| C-2 | Local `C:\Users\finky\.claude\core\L1-*.md` + `universal-governance.md` | L1 files = source. universal-governance.md = aggregator. Verify hierarchy is correct, not parallel. |
| C-3 | Local `coworker-cooperation-plan.md` + repo `docs/external/coworker-cooperation-plan.md` | Repo = canonical. Local = reference only. Remove local or make it a pointer. |
| C-4 | `packages/principles/principles.yaml` (65 principles) not surfaced in external DNA | See Priority 4 (DNA Bundle Engine) — principles.yaml becomes a DNA component. |

**Session:** 1 session. **Chat:** Single Sonnet chat. No relay needed.

---

### PRIORITY 4 — Platform DNA Bundle Engine [PE: 75]

**What:** PI-031/032/033 — a system that packages CSPS platform identity for external AI, automation, and new apps.

**Components:**
- `tools/config/dna-registry.yaml` — machine-readable registry of all DNA components (vocabulary, principles, schema, integrations, inner-ai-defaults)
- `tools/scripts/generate-dna-bundle.mjs` — CLI that assembles context-appropriate bundles by target audience
- `tools/scripts/dna-wizard.mjs` — 4-question wizard CLI for generating bundles

**Why now:** Every new chat starts cold. The bundle engine is the mechanical solution to the inheritance problem — not just for CSPS sessions but for any external AI that needs to understand CSPS.

**Session:** 2 sessions. **Chat:** Session 1 = design + PI YAML ratification. Session 2 = build.

**Audience targets:**
```
new-ai-tab     → Role + mandate + vocabulary + open items
external-ai    → Vocabulary exclusion + cooperation plan + zone model
developer      → Schema + integrations + principles
automation     → PI schema + enforcement trio + hook patterns
research       → Evidence levels + EXT-KNOW format + market hypothesis
```

---

### PRIORITY 5 — S040 Pipeline: Intent Crystallization [PE: 70]

**What:** Build the 3 missing pipeline steps:
1. **Routing** — archetype (from OnboardingWizard) → planning template selection
2. **Intent crystallization UI** — guided 3-question flow before any implementation
3. **Pipeline wiring** — connect OnboardingWizard → routing → crystallization → PI item → PE scoring

**What exists already (do not rebuild):**
- OnboardingWizard at account-setup — produces archetype ✅
- PI item system — create-pi.mjs, PI-001 through PI-025 ✅
- PE Agent — /pe-agent skill ✅
- UJT system — pnpm record:ujt ✅

**Requires:** P-META-026 ratified first (PRIORITY 1).

**Session:** 3 sessions. Design (1) → routing + crystallization UI (1) → wiring + UJT (1).

---

### PRIORITY 6 — EXT-KNOW Absorption [PE: 60]

**What:** Absorb remaining [Temp name!!!] research files (04-11 series) as EXT-KNOW entries.
**OPEN:** OPEN-029, OPEN-030
**Mandate:** Governor must upload the files. Absorption follows MANDATORY ORDER:
1. Check vocabulary exclusion list first
2. Replace ALL foreign terms with CSPS equivalents
3. DNA confrontation (COMPLEMENT / NEW / CONFLICT)
4. Assign evidence level (0=assumption → 5=payment signal)
5. Write EXT-KNOW-NNN to docs/plan/_intake/external-knowledge/
6. Update external-knowledge-registry.md

**Status:** Awaiting Governor to upload files.

---

## §4 — Session Sequence (Optimal Order)

```
S040  C1: [This chat] Stability fixes + Habit Tracker build
      C2: [New chat] P-META-026 ratification + Consolidation Pass (C-1 through C-4)
      C3: [New chat] DNA Bundle Engine PI YAML design (PI-031/032/033)

S041  C1: Habit Tracker Vercel deploy verification
      C2: DNA Bundle Engine implementation
      C3: S040 pipeline: Routing + Intent crystallization design

S042  C1: S040 pipeline: UI build (intent crystallization)
      C2: S040 pipeline: Wiring + UJT
      C3: EXT-KNOW 04-11 absorption (when Governor uploads files)

S043+  Continue PI items + second app build
```

---

## §5 — OPEN Items (active)

| OPEN | Item | PE | Status |
|---|---|---|---|
| OPEN-026 | P-META-026 ratification | 90 | **Awaiting Governor "ratified"** |
| OPEN-029 | EXT-KNOW 04-11 series absorption | 85 | Awaiting file upload |
| OPEN-030 | [Temp name!!!] as App #3 decision | 80 | Awaiting Governor |
| OPEN-023 | PI-026: Developer onboarding dogfood | 78 | S040 |
| OPEN-024 | PI-027: validate-intent-alignment.mjs | 75 | S040 |
| OPEN-031 | EP-ERR entry: premature-done-on-tsc-not-build | 50 | Pending |
| OPEN-032 | Audit (dashboard) parallel route group | 40 | Pending |
| OPEN-033 | Add `next build` to standard verification tail | 60 | Pending |
| OPEN-034 | OPUS persona in session-open.sh | 45 | Deferred |

Full register: `tools/council/opus-open-items.md`

---

## §6 — Inheritance Anchors (what every new chat must know)

Every new chat must read these BEFORE acting:

1. **This file** (`tools/council/multi-session-plan-S040.md`) — where we are and what's next
2. **Vocabulary exclusion list** (`docs/plan/_handoff/VAULT/vocabulary-exclusion-list.md`) — 28 banned terms
3. **OPEN items register** (`tools/council/opus-open-items.md`) — 30+ pending items
4. **Platform state snapshot** (`tools/council/platform-state-snapshot.md`) — verified current state
5. **B_INHERITANCE_POLICY** — all gaps → OPEN-NNN immediately; T1+T2+T3 required

Key behavioral constraints for every response:
- End with ▶ OPTIMAL NEXT STEP (B_OPTIMAL_NEXT_STEP)
- Register gaps as OPEN-NNN in SAME turn (not passive observation)
- DONE = `next build` passes + `verify.mjs exit_code=0` (both required, not just tsc)

---

## §7 — Governor Decisions Recorded (S040 C1)

All decisions made 2026-05-17. Ratified via "I approve all your recommendations."

**Q1 — P-META-026:** ✅ RATIFIED. Planning-before-implementing is primary governance pillar.

**Q2 — Next priority:** ✅ Consolidation + DNA Bundle Engine first. Habit Tracker deploy is async (Governor Vercel action, no blocking).

**Q3 — App #3:** ✅ Deferred. Decide after EXT-KNOW 04-11 absorbed.

**Q4 — EXT-KNOW upload:** ✅ Next available session. No urgency unless App #3 in S041.

**Q5 — Consolidation C-1:** ✅ Resolved — shared-rules.md is a valid contextual locality slice (NOT deleted). Synced with Rules 10+11.

---

## §8 — S040 C2 Mandate (next chat)

**Open:** Consolidation Pass items C-2 + C-3 + design PI-031/032/033 (DNA Bundle Engine).

Read `docs/plan/_handoff/VAULT/plan-items/PI-001-threshold-onboarding-wizard-wiring.yaml` as PI format template before designing PI-031/032/033.
