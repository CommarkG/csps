# layer: scaffold
# disposable_if: arrangement_changes
# FROM SONNET | FOR OPUS TAB | S089 — First Viewport Contract (FVC) synthesis complete
HEAD: 62077e8a | verify: exit_code=0 (double-pass) | blocking=0

---

## DONE THIS TURN

1. FIRST-VIEWPORT-CONTRACT.md — synthesis of 5 external sources + CSPS-original
   docs/plan/pillar-4-developer-experience/FIRST-VIEWPORT-CONTRACT.md
   Contains: FVC Gate law · 7 Pillars · 18 FVC questions (Priority Stack organized)
   Cognitive baselines · AI counter-default rules · CSPS 3-level integration
   WHAT-WAS-NOT-INCLUDED section (see §8 of document)

2. tools/data/ux-parameters.yaml — SSoT for all adjustable UX thresholds
   All thresholds, FVC question toggles, AI override injection text in one file
   Validators + dashboard read from here; edit here, not in multiple places

3. /platform/ux-parameters dashboard — UX Parameters Hub (cd1b6be submodule)
   Live at: https://csps-playground.vercel.app/platform/ux-parameters
   Shows all parameters, FVC questions organized by Priority Stack layer, edit instructions

4. AGENTS.md hard-NOs added (SACRED-EDIT-APPROVED):
   B_FVC_GATE: "No screen is shippable until first_viewport_contract is declared + FVC gate passes"
   B_WHAT_WAS_NOT_INCLUDED: "Every summary, plan, and Opus report MUST include what was rejected + why"

---

## SOURCES SYNTHESIZED (5 external + CSPS-original)

| Source | Key unique contribution | Status |
|--------|------------------------|--------|
| Grok | Engineer anti-patterns, bounce/impression physics, 5-10s first impression | Absorbed + critiqued |
| Haiku | 16 content carriers, R7 no-recommendations, ≤9/12 element thresholds | Absorbed + 2 challenges |
| Kimi | 4±1 chunks (Miller's Law), micro-first-screens, 3s mandate, thumb zone, LCP | Absorbed — highest rigor |
| Gemini | 7 pillars (best categorization), Context Continuity naming, schema placement | Absorbed |
| GPT | "First Viewport Contract" naming (ADOPTED), 18 FVC questions, 3-layer verification, trust/evidence carrier | Absorbed — best framework |
| CSPS-original | Decision-Tree-First, Contextual Continuity (K=2), Priority Stack, SAGD integration | Kept — not in any external source |

---

## WHAT WAS NOT INCLUDED AND WHY (Governor S089 governance directive)

Highlights (full list in FIRST-VIEWPORT-CONTRACT.md §8):

| Rejected | Source | Why |
|----------|--------|-----|
| "Above the fold" / "hero section" terminology | All 5 sources | Too marketing/shallow; "FVC" is a contract = CSPS DNA alignment |
| Haiku's ≤9 as PRIMARY threshold | Haiku | Replaced with Kimi's 4±1 (cognitive science basis stronger); ≤9 kept as secondary |
| Gemini's ≤3 competing data points as hard block | Gemini | Too aggressive for complex admin/governance screens |
| Grok's 5-10s window | Grok | Replaced with 3s orientation (Kimi) + 20s value clarity (GPT/NN/g) — different things |
| Leading with recommendations on first screen | All sources implied | Rejected via R7: recommendations AFTER first orienting action |
| Full CRUD dashboard (real-time YAML edit) | Governor direction | Phase 2; Phase 1 is read-only display; building live YAML editing requires auth+API |
| Decision-Tree-First | NOT in any external source | CSPS-original; addresses the actual Governor test-drive failure (content before choice) |

---

## TWO NEW GOVERNANCE RULES (Governor S089 — CONSTITUTIONAL)

B_FVC_GATE: No screen ships without `first_viewport_contract:` declared in plan/pageDNA.
  Pre-build: answer 3 questions before writing JSX.
  BUILD-AUDIT dimension (f): f1-f8 all ✓ for BUILD-COMPLETE claim.

B_WHAT_WAS_NOT_INCLUDED: Every summary, plan, Opus report MUST have a "What was NOT included and why" section.
  Minimum: 3 rejected alternatives per consequential decision.
  Applies to: sonnet-turn.md, HANDOFF Zone docs, principle proposals, park items, Opus relays.

---

## QUESTIONS FOR OPUS

(1) FVC Gate enforcement tier: currently AGENTS.md hard-NO (T3) + ux-parameters.yaml (SSoT). 
    Do we build T1 (pre-tool-use hook checking for fvc questions in plan before JSX write) 
    and T2 (validate-fvc-*.mjs suite) NOW, or park for P2 build?

(2) B_WHAT_WAS_NOT_INCLUDED: this is a new constitutional governance rule. Does it need
    a formal B_*.md contract + T1+T2, or is AGENTS.md hard-NO + this sonnet-turn.md entry sufficient?

(3) Dashboard Phase 2 (PARK-S089-LEARNING-LOOP-DASHBOARD extension): the ux-parameters
    page is read-only Phase 1. Ratify Phase 2 (live parameter editing via API + compliance
    heatmap per page) as part of the pro-template work? Or separate build unit?

(4) The Customer Journey Shell Step 2 still shows "This is something original — we'll design
    it from a clean slate" before routing choice. Per Decision-Tree-First (FVC Priority Stack
    Layer 2): routing choice should come BEFORE content. Should I fix Step 2 flow now
    (routing gate appears immediately after echo, before "what we found") per FVC?
