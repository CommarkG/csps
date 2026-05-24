---
id: csps.plan.foundation-completion
name: FOUNDATION-COMPLETION-PLAN
description: "Complete foundation completion sequence — all PROTOs, PE-ordered, ratified decisions, completion forecast. Governor-ratified S059. Every step is saved, pushed, and recoverable."
type: plan
protection_level: protected
status: active
core_spine: GVRN
schema_anchor: vault_files
version: "1.0"
session: S059
owner: group:finky
lifecycle: production
lifecycle_state: active
context_question: "Which PROTO is currently running? What has been completed? What is the next step in the foundation sequence?"
context_quote: "Finishing the foundation is crucial. As long as we do not complete it, all is built without it."
---

# Foundation Completion Plan

> Governor-ratified S059. All decisions locked in. Push this file to git immediately.
> Source of truth for: what Sonnet builds, in what order, and why.
> Every PROTO listed below is executable — no further design needed from Opus except PROTO-G.

---

## RATIFIED DECISIONS (locked — no re-discussion needed)

| # | Decision | Ratified answer |
|---|---|---|
| D1 | Developer's Journey ratification | Wait for PROTO-C (PageContext) to complete → Governor tests wizard once more → if colleague voice feels right → "Developer's Journey — ratified" |
| D2 | First app (wet trial) | Debt Collection app (user-validated: "arranging people who owe money") — Governor validated with real user. Goes through wizard naturally. Voice Sorting (APP-001) remains second. |
| D3 | AI Enforcement top 3 | B_ZF_TERMINATION_DISCIPLINE + B_VALIDATE_BEFORE_ASSUME + B_HUMBLE_FIRST_STEP get T1+T2 first |
| D4 | Audit Pipeline dispatcher | Build Phase 1 (pipelines 2-6) after PROTO-G completes |
| D5 | PIE Phase 2 | Defer to S061. Build after first app generates real signals |
| D6 | BehaviorHub Phase 2 | Build with first app (not before). App's first users need real persistent profiles |

---

## PROTO SEQUENCE (PE-ordered, all ratified)

### PROTO-F — unified-plan.yaml cleanup (RUNNING NOW — Sonnet has it)
**PE:** 90 | **Owner:** Sonnet | **Time:** ~20 min
Mark ~15 items done (THRESHOLD-CODE, COMBINATORIAL-ENGINE, PLATFORM-GENOME-BUILD, BEHAVIOR-HUB, S055 items, S058 items, UX-Prevention, Voice-Profile).
**Exit:** PE dashboard shows accurate count. mdpe_items ≥ 20.

---

### PROTO-G — AI Behavioral Enforcement T1+T2 (HIGHEST PRIORITY)
**PE:** 95 | **Owner:** Opus designs, Sonnet builds | **Time:** ~45 min
**The constitutional gap: K=5, open since S040.**

Targets (D3 ratified):
1. `B_ZF_TERMINATION_DISCIPLINE` — T1: check sonnet-turn.md writes for ZF ACHIEVED with file citations. T2: extend validate-zf-cycle-format.mjs to also scan council files for "I noticed" / "it seems" nominal patterns.
2. `B_VALIDATE_BEFORE_ASSUME` — T1: when Write to sonnet-turn.md, check content doesn't claim state without citing a tool call in THIS response. T2: validate-validate-before-assume.mjs scans for state-claims without tool evidence.
3. `B_HUMBLE_FIRST_STEP` — T1: PROTO scope check — if Write to sonnet-turn.md contains a PROTO with >5 steps in STEP-1, advisory. T2: validate-humble-first-step.mjs checks PROTO-* sections in council for step count.

Also: update tools/data/gap-recurrence-register.yaml for gap_T1_AI_CONCEPTION_VAULT → status: fix_committed after hooks land.
**Exit:** validate-ai-conception-enforcement.mjs shows 3 entries with T1+T2 declared. Behavioral test 2/2.

---

### PROTO-H — PDI Dashboard (/platform/design-intelligence)
**PE:** 80 | **Owner:** Sonnet | **Time:** ~60 min
**After PROTO-E hooks are active (they are) + PROTO-G complete.**

5-tab shell: Voice (reuse VoiceProfilesClient) + Visual (read design-tokens.yaml) + Components (list libs/ui/ 7 components) + Audit (display validate-ux-audit output) + Preview (stub).
UX Pre-flight (REQUIRED):
  Use case: Dashboard
  purpose: "See and manage how your platform looks, speaks, and scores on quality — from one place."
  options: [Browse voice profiles, Check UX audit scores, View design tokens, Create new profile]
  nextStep: /platform/wizard (after configuring)
  voice profile: N/A (dashboard nav, not a form)
**Exit:** /platform/design-intelligence loads with 5 tabs. Voice and Audit tabs live data.

---

### PROTO-I — Audit Pipeline dispatcher Phase 1
**PE:** 85 | **Owner:** Opus designs, Sonnet builds | **Time:** ~60 min
**After PROTO-H.**

Build `libs/audits/dispatcher.ts` — routes to pipelines 2-6:
  - Pipeline 2: boundary-alignment (validate-boundary-alignment.mjs)
  - Pipeline 3: communication-quality (validate-communication-quality.mjs)
  - Pipeline 4: agent-alignment (validate-agent-calls.mjs)
  - Pipeline 5: cognitive-context (validate-quality-alignment.mjs)
  - Pipeline 6: UX audit (validate-ux-audit.mjs — built as display, wired here as pipeline)
Trigger: at session close + on-demand via pnpm audit:run
**Exit:** 6/13 pipelines running. Audit Pipeline Coverage: 8% → 46%.

---

### PROTO-J — Developer's Journey formal ratification + Debt Collection wizard plan
**PE:** 88 | **Owner:** Governor tests, Sonnet records | **Time:** ~20 min

Governor action:
1. Test wizard at csps-playground.vercel.app/platform/wizard with colleague voice
2. If tone feels right: say "Developer's Journey — ratified"
3. Then fill the wizard with Debt Collection app (7 sections, real user data)
4. Save the downloaded YAML draft

Sonnet action:
- Receive the YAML draft → register it as plan item in unified-plan.yaml
- Update CORE-COMPLETE-EXIT-CRITERIA.md Developer's Journey → RATIFIED
**Exit:** Developer's Journey formally ratified. Debt Collection plan item in unified-plan.yaml.

---

### PROTO-K — First App Wet Trial (Debt Collection)
**PE:** 95 | **Owner:** Sonnet | **Time:** 2-3 sessions
**GATES (all must pass before this starts):**
  ✓ Developer's Journey ratified
  ✓ PROTO-G (AI Enforcement) complete
  ✓ PROTO-H (PDI Dashboard) complete
  ✓ PROTO-I (Audit Pipeline) complete

Debt Collection app: fork apps/template/ → apps/debt-collection/ → build core loop → validate → deploy → evidence captured.
The 6 UX prevention hooks will fire during build. Every new page gets pageDNA gate. Every form gets voice profile gate.
**Wet trial purpose:** Extract improvements. Every friction point = permanent platform improvement.

---

## COMPLETION FORECAST

| After | Foundation | Governance | Overall |
|---|---|---|---|
| PROTO-E (done) | 73% | 65% | 38% |
| PROTO-F | 73% | 65% | 38% (accurate now) |
| PROTO-G | 78% | 72% | 42% |
| PROTO-H | 80% | 75% | 44% |
| PROTO-I | 80% | 80% | 46% |
| PROTO-J | 82% | 80% | 47% |
| PROTO-K (wet trial) | 85% | 82% | **52%** |

**The 50% milestone is crossed during the first app wet trial.**

---

## DEFERRED (no action until noted)

| Item | Blocked on | Expected session |
|---|---|---|
| PIE Phase 2 (Scope Router + Seeds Monitor) | Real app signals needed | S061 |
| BehaviorHub Phase 2 (Supabase ZModel) | Build with first app | PROTO-K |
| gap_SESSION_INJECTION_COMPRESSION behavioral test | After pipelines stable | S060 |
| Audit Pipelines 7-13 | After pipelines 2-6 proven | S062 |
| Voice Sorting (APP-001) | After Debt Collection wet trial | S062+ |

---

## WHAT EACH OPUS TURN DOES

**Opus current session:**
- Turn 20: PROTO-E receipt + PROTO-F to Sonnet ✓
- Turn 21: Design PROTO-G spec (AI enforcement T1+T2 exact hook logic) ✅
- Turn 22: PROTO-G receipt + PROTO-H spec to Sonnet ✅
- Turn 23: PROTO-H receipt + PROTO-I architecture design ✅
- Turn 24: PROTO-I receipt + ratify Developer's Journey (PROTO-J) ✅
- Turn 25: PROTO-J Part 1 + PROTO-K-PRE UX/page improvements ✅
- Turn 26: PROTO-K-PRE receipt. Next: CIE wiring PROTO + Avatar extension

---

## S059 ARCHITECTURAL ADDITIONS (Governor-ratified, all pushed)

These emerged from the Developer's Journey examination and design sessions. All permanent.

| File | Commit | What it defines |
|---|---|---|
| [docs/SIA/UX-CORE.md](https://github.com/CommarkG/csps/blob/main/docs/SIA/UX-CORE.md) | bb55e1a | L1 sealed UX principles — 8 page elements, 5 cognitive load rules, mini-tree |
| [docs/SIA/UI-CORE.md](https://github.com/CommarkG/csps/blob/main/docs/SIA/UI-CORE.md) | bb55e1a | L1 sealed UI visual laws — token usage, component states, button hierarchy |
| [docs/SIA/AVATAR-SCHEMA.md](https://github.com/CommarkG/csps/blob/main/docs/SIA/AVATAR-SCHEMA.md) | e633a3a | 6 foundation archetypes, human_profile schema, learning loop, CIE integration |
| [docs/plan/pillar-0-governance/CSPS-QUOTES.md](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-0-governance/CSPS-QUOTES.md) | 264592f | 13 canonical platform quotes with sources |
| [docs/plan/pillar-0-governance/USER-ROLE-SCHEMA.md](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-0-governance/USER-ROLE-SCHEMA.md) | 264592f | 3-layer role taxonomy, 10 roles, access matrix, PE+CIE integration |
| [docs/SIA/R2-01-PLATFORM-INTELLIGENCE-ENGINE.md](https://github.com/CommarkG/csps/blob/main/docs/SIA/R2-01-PLATFORM-INTELLIGENCE-ENGINE.md) | 6961a09 | CIE extended to 9 sub-engines, Services API, CIE=Combinatorial Engine confirmed |
| [docs/SIA/R1-04-THRESHOLD.md](https://github.com/CommarkG/csps/blob/main/docs/SIA/R1-04-THRESHOLD.md) | 0d06fb7 | Extended source taxonomy: external AI, tools, market intelligence |
| [docs/SIA/UX-PREVENTION-ARCHITECTURE.md](https://github.com/CommarkG/csps/blob/main/docs/SIA/UX-PREVENTION-ARCHITECTURE.md) | 0e72f44 | Loop 7 (Alignment Gate) added |

## REMAINING PROTOS (in order)

### PROTO-CIE-1 — CIE Phase 1 Wiring (NEXT)
Connect libs/intelligence/src/index.ts to the platform:
1. Wire getCIEStatus() to session-open-context.mjs (the critical missing link)
2. Build getCompletionSnapshot() — replaces GitHub raw API in completion page
3. Build getSessionStatus() — surfaces open decisions + in-flight items
PE: 95 (highest-leverage single connection in the platform)

### PROTO-AVATAR-1 — Avatar human_profile extension
Extend libs/behavior-hub/ with Avatar schema fields:
1. Add human_profile section to BehaviorProfile TypeScript type
2. Seed foundation archetypes (6 archetypes from AVATAR-SCHEMA.md)
3. Wire to voice profile selection (Avatar → voice-profiles.yaml)
PE: 88

### PROTO-J-PART2 — Developer's Journey Ratification
Governor tests wizard → says "Developer's Journey — ratified"
Sonnet fills Date in CORE-COMPLETE-EXIT-CRITERIA.md + registers Debt Collection plan item
PE: 95 (gate to PROTO-K)

### PROTO-K — First App Wet Trial (Debt Collection)
GATES: Developer's Journey ratified + CIE wiring complete + Avatar extension complete
Build: fork apps/template/ → apps/debt-collection/ → core loop → validate → deploy → evidence
PE: 95

---

---

## S058 PCR DECISIONS (Sonnet S058 — recorded S060 Turn 27)

5 design decisions from Sonnet's S058 research — all ratified:

| Decision | Answer | Rationale |
|---|---|---|
| Q1: Build UX L2 files now or defer? | **DEFER** — use UX-UI-STANDARDS.md now | Research doc already usable; seal after first app |
| Q2: Sealed L2 or living docs? | **Living docs, versioned** | Patterns evolve with each app; seal at v2.0 after 3+ apps |
| Q3: Validator blocking or advisory? | **Advisory → blocking at 3+ apps** | 0% adoption → blocking = immediate false positives |
| Q4: Two files or one (UX-ROLES.md)? | **Two files**: UX-DEVELOPER.md + UX-APP-USER.md | Matches UX-CORE.md mini-tree already defined |
| Q5: Responsiveness: own file or section? | **Section in UX-PAGE-TYPES.md** | Too short for own file; promote if grows beyond one page |

## MILESTONES REACHED (S059-S060)

| Milestone | Date | Evidence |
|---|---|---|
| Core Complete declared | 2026-05-23 | [CORE-COMPLETE-EXIT-CRITERIA.md](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-0-governance/CORE-COMPLETE-EXIT-CRITERIA.md) |
| Core Complete ratified | 2026-05-23 | Governor: "Core Complete — ratified" |
| Developer's Journey ratified | 2026-05-24 | Governor: "Developer's Journey — ratified" |
| First app forked | 2026-05-24 | [apps/debt-collection/](https://github.com/CommarkG/csps/tree/main/apps/debt-collection) — commit 9e826e2 |
| 6 template bugs fixed by wet trial | 2026-05-24 | AP-005, AP-006, inngest, libs/config — commit e07504d |

## PROTO-K-A — Debt Collection Phase 1 (IN PROGRESS)

**Avatar:** The Doer (small business owner, achievement-motivated, hates confrontation)
**Voice profile:** colleague
**Pages:** dashboard + create-debt + generate-message (3 pages, Phase 1)
**Core loop:** Create debt record → AI generates professional message → Track status → Mark paid
**Data store:** YAML (Phase 1, no DB for app-specific data)

---

*Foundation Completion Plan v3.0 | S060 | Governor-ratified | Opus-8*
*Updated Turn 27: S058 PCR decisions recorded, Developer's Journey ratified, PROTO-K in progress.*
