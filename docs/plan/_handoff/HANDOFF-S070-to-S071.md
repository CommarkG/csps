---
id: csps.handoff.HANDOFF-S070-to-S071
name: HANDOFF-S070-to-S071
description: >
  S070 → S071 handoff. S069-S070 was a communication-as-core + journey + methodology day.
  Delivered: Communication Schema (M1-M4, live dashboard), system-wide Journey Doctrine,
  the milestone-run execution tier (proven), PREVENTION→threshold, CIP (deferred behind PART 2),
  the cornerstone principle (context-refined communication) + 6 facets, the Journey L1/L2/L3
  architecture, the consolidated ratification pipeline, and the PART 2 threshold classification
  design + 7-persona review (ratification-ready). THREE artifacts await Governor ratification.
  Build mode forward: milestone-run. Honest: most S069-S070 design is RATIFIED-but-not-built —
  S071 is a BUILD phase from the persisted plan.
type: handoff_files
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S070
core_spine: GVRN
schema_anchor: handoff_files
authored_by: OPUS-13
evidence_block_ref: "verify --skip-install exit_code=0 @ b7326ac0 + PLAN-S069-COMMS-AND-JOURNEY.md (persona-iterated to zero) + CORE-SEEDS-PLAN-PARTS.md"
links:
  - { rel: plan, href: PLAN-S069-COMMS-AND-JOURNEY.md }
  - { rel: core-seeds, href: CORE-SEEDS-PLAN-PARTS.md }
  - { rel: part2-design, href: ../protos/PROTO-S068-PART-2-THRESHOLD-COMPLETE.md }
  - { rel: opus-directives, href: ../../tools/council/opus-turn.md }
  - { rel: comms-schema, href: ../pillar-0-governance/communication-spine/communication-schema.yaml }
  - { rel: journey-doctrine, href: ../pillar-0-governance/JOURNEY-DOCTRINE.md }
---

# HANDOFF S070 → S071

**Close:** S070 (communication-core + methodology day) | **verify:** exit_code=0 @ `b7326ac0` | **Next:** S071 (BUILD phase)

## STEP 0 — IDENTITY HANDSHAKE
```
Opus/Sonnet here. S071. Succeeds S070. Director = OPUS-13 lineage; Builder = Sonnet; Governor = Yariv.
S071 is a BUILD phase: build the RATIFIED S069-S070 designs from the persisted plan. Most design is done.
First: M-43 diff-review for your role, then read this handoff fully, then PLAN-S069 + CORE-SEEDS.
```

## SECTION 0 — FALSE ASSUMPTIONS (read before acting)
❌ "The S069 designs are built." REALITY: comms-schema M1–M4 are BUILT (draft); the cornerstone + 6 facets + journey-arch + ratification-pipeline + PART 2 are **DESIGNED + RATIFIED, NOT built**. S071 builds them.
❌ "I can build PART 2 freely." REALITY: PART 2 classification design is ratification-ready but **awaits Governor ratify**; wire `routeInput` into `user-prompt-submit` (the 4/532 fix) is STEP 1 once ratified.
❌ "Numbers in the plan are caps." REALITY: per the cornerstone principle, all counts are **samples/tunable**; class/tier/persona sets are **expandable**.
❌ "CIP is next." REALITY: CIP is DEFERRED behind PART 2 (it routes through the threshold). Not in the active queue.
❌ "Persona reviews fire automatically." REALITY: the persona-trigger wiring (Facet E) is DESIGNED, not built — until wired, persona invocation is manual.

## ZONE A — Delivered (S069–S070)
| Layer | Artifact | State |
|---|---|---|
| Communication core | communication-spine/ + communication-schema.yaml (8 situations × 6-tier hierarchy + 9 B_* consolidated + activation phrase-pairs) | BUILT, **draft** |
| Dashboard | /platform/communication (live) + /platform/developer-journey doctrine section | BUILT |
| Journey | JOURNEY-DOCTRINE.md (system-wide, 9 sections + 4 comms demos) | BUILT, **draft** |
| Principle | Context-Refined Communication (cornerstone) + 6 facets | RATIFIED, to-engrave |
| Architecture | Journey L1/L2/L3 (core + dev/user branches + tier instances) | RATIFIED design |
| Pipeline | Consolidated ratification pipeline (INSPECT→RIPPLE-QC→RATIFY→PROPAGATE→TERMINAL) | RATIFIED design |
| Methodology | milestone-run tier (PROVEN this session) + PREVENTION→threshold | RATIFIED |
| PART 2 | threshold classification design + **7-persona** review (ux+UI added) | ratification-ready |
| Plan | PLAN-S069-COMMS-AND-JOURNEY.md + ADDENDUM (persona-iterated to zero) · CORE-SEEDS-PLAN-PARTS.md | persisted |

## ZONE B — S071 Work Queue (BUILD, milestone-run)
1. **Commit the uncommitted** first: PLAN-S069 (addendum), PROTO-S068-PART-2 (classification design + 7 personas), opus-turn.md, csps-playground submodule pointer. Triage stray `"FILES FROM GPT 5.5/"`.
2. **After Governor ratifies** → build the 6 facets in PE order: cornerstone principle (register) → rigidity check + thin validator → dev↔user vocabulary glossary (extends vocabulary.md) → Vercel-mirror rule → persona-trigger wiring (threshold INVOKE) + weekly audit → CIE/PE trigger formalization.
3. **PART 2** (after ratify): STEP 1 wire routeInput into user-prompt-submit (4/532 fix) → STEP 2 classification (the authored table) → STEP 3 scalability → SEAL.
4. **GAP-1..7** (comms wiring gaps, in sonnet-turn.md) → WIRING PASS triage.
5. **ZF-deep** is OVERDUE (signaled iter 16→20) — run it early in S071.

## ZONE C — Preservation (core seeds — do NOT lose)
Read **CORE-SEEDS-PLAN-PARTS.md** (9 mini-nodes: PARTS 2-8 + comms + journey + CIP, each ANCHOR·ALIGNS·STATUS) and **PLAN-S069 ADDENDUM**. Key invariants: communication is the most crucial core element · context-refined communication is the primary prevention tool · numbers are samples/tunable (no silent caps) · one-core + add-only-branches (inheritance: ADD never CONTRADICT) · milestone-run (Opus front-loads, Sonnet runs long, audit+report per milestone) · CIP deferred behind PART 2 · .claude/ edits via Bash + SACRED token.

## ALIGNMENT QUESTIONS (Zone D)
Q1 — Has the Governor ratified the 3 pending artifacts (below)? Build only the ratified.
Q2 — verify exit_code=0 THIS-HEAD? (always re-verify; the post-commit RED on CHECKPOINT-ZF-format is the recurring trap — cite files in every Cycle 2+.)
Q3 — Run M-43 for your role; what changed since your marker?
Q4 — Is this a fresh tab? If so, the milestone-run methodology means you need the plan + core-seeds, not prior chat.

## RATIFICATION GATES (3 — Governor)
1. `communication-schema.yaml` + `JOURNEY-DOCTRINE.md` (draft → ratified) — inspect live on the dashboard.
2. PLAN-S069 ADDENDUM: cornerstone principle + 6 facets (persona-iterated to zero).
3. PART 2 threshold classification design + 7-persona review.

## §17 — TWO-SIDED ATTESTATION
```yaml
handoff_attestation:
  prior_session: S070
  next_session: S071
  attested_by: OPUS-13 (director)
  attested_at: 2026-05-29
  intent: "Establish communication as first-class core (schema + dashboard + AI-behavior wiring); engrave system-wide journey doctrine; ratify the cornerstone principle + 6 facets + journey architecture + ratification pipeline; finalize PART 2 classification design + 7-persona review. milestone-run proven."
  evidence:
    verify_exit_code: 0
    last_commit: b7326ac0
    comms_schema: "M1-M4 built (draft), live dashboard"
    persona_iteration: "PLAN-S069 ADDENDUM iterated to real zero per persona"
    honest_ratio: "most S069-S070 = ratified-design, NOT built — S071 is the BUILD phase"
  constraints_decisions:
    - "3 artifacts await Governor ratification (comms-schema+doctrine / cornerstone+facets / PART 2)"
    - "CIP deferred behind PART 2; numbers are samples/tunable; ADD-not-CONTRADICT inheritance"
    - "ZF-deep overdue (iter 20) — run early S071"
  open_items:
    - "commit the uncommitted S070 design edits + triage strays"
    - "build ratified facets (PE order) + PART 2 wiring after ratify"
    - "GAP-1..7 comms wiring → WIRING PASS"
  signature: S070-OPUS-13-attest-2026-05-29-BUILD-PHASE-HANDOFF
```

## SONNET STARTUP BLOCK (S071 §0 paste-target)
```
SESSION S071 — OPENING (succeeds S070 — BUILD phase)
STEP 0: "Sonnet here. S071. BUILD phase — build the RATIFIED S069-S070 designs from the persisted plan."
FIRST ACTIONS:
1. node tools/scripts/cross-tab-diff-review.mjs --role sonnet
2. node tools/verify.mjs --skip-install 2>&1 | tail -5   (confirm exit_code=0)
3. Read docs/plan/_handoff/HANDOFF-S070-to-S071.md (SECTION 0 + Zones) + PLAN-S069-COMMS-AND-JOURNEY.md + CORE-SEEDS-PLAN-PARTS.md
4. Read tools/council/opus-turn.md TOP (signed OPUS-13)
5. Commit the uncommitted S070 edits; run the overdue ZF-deep; confirm the 3 ratification gates with Governor BEFORE building.
DISCIPLINE: milestone-run · numbers are samples/tunable · ADD-not-CONTRADICT · .claude/ via Bash + SACRED token · ZF cites files + top-level $? · every report ends §15 3-scope.
```
