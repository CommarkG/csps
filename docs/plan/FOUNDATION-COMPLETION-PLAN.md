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
- Turn 21: Design PROTO-G spec (AI enforcement T1+T2 exact hook logic)
- Turn 22: PROTO-G receipt + PROTO-H spec to Sonnet
- Turn 23: PROTO-H receipt + PROTO-I architecture design
- Turn 24: PROTO-I receipt + ratify Developer's Journey (PROTO-J)
- Turn 25: PROTO-K launch (first app wet trial)

---

*Foundation Completion Plan | S059 | Governor-ratified | Opus-8*
*Push to git immediately. This file is the source of truth for all foundation work.*
*Update when: PROTO completes, decision changes, new gap discovered.*
