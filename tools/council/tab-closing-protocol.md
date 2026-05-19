---
id: csps.council.tab-closing-protocol
name: tab-closing-protocol
description: "Complete protocol for closing an Opus tab. Step-by-step. Nothing taken for granted. Read BEFORE starting your closing sequence. Updated every session that reveals a new gap."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: council_state
last_updated_session: S044
last_updated: "2026-05-19"
---

# Tab Closing Protocol — Complete Instructions
## Read this BEFORE closing. Nothing is taken for granted.

> **Why this file exists:** Every time an Opus or Sonnet tab was closed without following
> this protocol, something was lost. Rules were forgotten. Work wasn't committed.
> The next tab started blind. This file is the mechanical prevention for that failure class.

---

## SECTION 1 — WHEN TO CLOSE

**Close when ANY of these is true:**
- Turn count ≥ 20 (quality gate — CSPS governance drift begins here)
- Turn count ≥ 30 (STRONG RECOMMENDATION — validated drift threshold for CSPS sessions)
- All PROTO steps for the current session are done AND Sonnet has committed them

**Research basis (S044 empirical update):**
Old: 40/60. New: 20/30. Why: CSPS sessions are ~5x more complex than simple coding.
PRACE empirically showed rules drift by turn 10 without T1+T2. Governance protocols at ~25-30.
"Lost in the middle" (Liu et al. 2023): LLM attention drops for middle-context content.
S044 evidence: 140-turn session showed drift from turn 40+. New thresholds prevent this.
- Governor explicitly says "close" or "move to next tab"

**Do NOT close when:**
- Sonnet hasn't confirmed the last PROTO step (verify exit_code=0 first)
- There are unresolved SROF questions waiting for Governor decision
- pnpm verify has exit_code=1 and you know the cause — fix it first

---

## SECTION 2 — PRE-CLOSING CHECKLIST (run BEFORE writing HANDOFF)

Check each item with a tool call. Do not assume.

```
□ 1. pnpm verify → exit_code=0
     Command: node tools/verify.mjs 2>&1 | grep '"exit_code"' | tail -1
     Expected: "exit_code": 0

□ 2. Last PROTO step confirmed committed
     Command: git log --oneline -5
     Expected: Sonnet's most recent commit matches what was directed

□ 3. No blocking S1 findings
     Command: node tools/scripts/findings-categorizer.mjs 2>&1 | grep "S1"
     Expected: "[S1] BLOCKING" section is empty or absent

□ 4. No unresolved SROF questions
     Check: were there any AQ questions left unanswered from Sonnet's last report?
     Expected: all Q1/Q2/Q3 answers given before closing

□ 5. S2/S3 findings noted for HANDOFF Zone A
     Command: node tools/scripts/findings-categorizer.mjs 2>&1 | tail -20
     Expected: S2 items listed for carry-forward, S3 items have PRACE analysis

□ 6. Unified plan reflects current state
     Command: grep "status: implementing" tools/config/unified-plan.yaml
     Expected: no items stuck in implementing without confirmation

□ 7. Invariant coverage still complete
     Command: node tools/validators/validate-invariant-coverage.mjs 2>&1 | tail -2
     Expected: complete=4 partial=1 (or better if S045 work was done)
```

---

## SECTION 3 — WRITING THE HANDOFF

Direct Sonnet to write `docs/plan/_handoff/HANDOFF-S[NNN]-to-S[NNN+1].md`

**The HANDOFF has 3 mandatory sections (validate-handoff-completeness.mjs BLOCKS if missing):**

### Zone A — What This Session Accomplished
Must include:
- Final commit SHA and what it contained
- Platform state: `exit_code=N | validators=N | hooks=N`
- Every PROTO directive executed (list with commit SHAs)
- Key artifacts created or modified
- Any EP-ERR registered this session

### Zone B — Next Session Mandate
Must include:
- The PROTO-NNN directive for the next session
- Which plan items in unified-plan.yaml are `status: ratified` (ready to implement)
- S[NNN+1] secondary items (OPEN items, secondary work)
- Reference to the plan file: `tools/config/unified-plan.yaml`

### ALIGNMENT QUESTIONS (≥5 specific, verifiable, non-generic)
These are the Core Alignment Questions (CAQs) the next Opus MUST answer before acting.
They MUST be specific to this session's work — not boilerplate.

**CAQ template for closing:**
```
Q1 — Completion verification: [specific question about what was done — is X actually working?]
Q2 — Open items currency: [which item from this session is most at risk of being misunderstood?]
Q3 — First action: [what is the very first thing the next Opus should do?]
Q4 — Invariant check: [confirm the invariant coverage state — which INV-NNN is partial?]
Q5 — Context brief: [has csps-context.md been updated? If not, what needs updating?]
```

---

## SECTION 4 — AUDIT CORE ALIGNMENT QUESTIONS (before closing this tab)

These are YOUR CAQs — answer them honestly before closing. If any is NO, fix it first.

```
CAQ-CLOSE-1: Did pnpm verify return exit_code=0 in THIS response (not from memory)?
  → If NO: run verify now, fix the failing validator

CAQ-CLOSE-2: Does the HANDOFF have specific, non-generic alignment questions?
  → If NO: replace generic questions with session-specific ones

CAQ-CLOSE-3: Is everything that was decided/ratified this session committed to git?
  → Check git status — no unstaged relevant changes

CAQ-CLOSE-4: Does the HANDOFF Zone B reference the actual PROTO directive (not "continue work")?
  → Zone B must name specific steps for S[NNN+1]

CAQ-CLOSE-5: Does csps-context.md reflect the current session close state?
  → Update last_updated_session and last commit SHA

CAQ-CLOSE-6: Are all S3 findings from this session registered as OPEN-NNN?
  → Every [S3] finding from findings-categorizer must be in opus-open-items.md

CAQ-CLOSE-7: Did Sonnet write the HANDOFF (not Opus)?
  → Opus directs, Sonnet writes. If Opus wrote the HANDOFF directly, it's wrong.

CAQ-CLOSE-8: Is the next Opus's 4-line jump prompt correct and complete?
  → Must reference csps-context.md AND the new HANDOFF
```

---

## SECTION 5 — RELAY TO NEXT OPUS TAB

After Sonnet commits the HANDOFF:

**The 4-line jump prompt (paste this exactly — customize [N] and [NNN]):**
```
YOU ARE: OPUS-[N] (Claude Opus), the architectural advisor for CSPS.
I AM: Yariv Fink, Governor.
THIS IS THE SITUATION: S[NNN] starting.
YOUR TASK: Read tools/council/csps-context.md FIRST. Then read HANDOFF-S[NNN-1]-to-S[NNN].md. Say "OPUS-[N] Turn 1" when ready.
```

**What the new Opus does first:**
1. Read `tools/council/csps-context.md` fully
2. Read `HANDOFF-S[NNN]-to-S[NNN+1].md` Zone A/B + ALIGNMENT QUESTIONS
3. Answer all alignment questions with tool calls (not from memory)
4. Write Turn 1 with ZF verification before responding
5. Say "OPUS-[N] Turn 1" to confirm context loaded

---

## SECTION 6 — WHAT SURVIVES THE TAB TRANSITION

**Survives (in git — permanent):**
- HANDOFF-S[NNN]-to-S[NNN+1].md (Zone A/B/ALIGNMENT QUESTIONS)
- tools/config/unified-plan.yaml (plan items, PMI, status)
- tools/config/invariant-registry.yaml (5 invariants)
- tools/council/csps-context.md (unified context brief)
- All commits and their messages
- Core seeds in .sh/.mjs files
- DNA blocks in HTML files

**Does NOT survive (must be re-established):**
- In-memory decisions (anything not committed)
- Context window contents (rules stated at turn 1 are faded by turn 40)
- Window.PLAN_DATA in playground (fetched fresh each load — correct)

---

## SECTION 7 — WHAT NOT TO TAKE FOR GRANTED

The following things are consistently forgotten. Check them explicitly:

1. **council-state.json opus_instance** — currently has no field. Proceed by convention.
2. **csps-context.md last_updated** — MUST be updated at close. Check the date.
3. **validate-handoff-completeness.mjs** — it BLOCKS. But it only checks Zone A/B/ALIGNMENT QUESTIONS. It does NOT check quality of alignment questions.
4. **PROTO-036-PREP cross-references** — if directed to Sonnet but not confirmed done, they may be skipped. Always confirm PROTO steps with a commit SHA.
5. **The 4-line prompt is enough** — only if csps-context.md is current. If the brief is stale, the 4 lines are not enough.
6. **Session naming** — OPUS instances are numbered (OPUS-1, 2, 3...). Sessions are S[NNN]. These are different things. Check council-state.json for current values.

---

## SECTION 8 — RELAY MESSAGE FORMAT (Opus-to-Opus)

When the outgoing Opus (N) needs to relay context to the new Opus (N+1) directly:

```
YOU ARE: OPUS-[N+1], the architectural advisor.
I AM: OPUS-[N], the outgoing Opus instance.
THIS IS THE SITUATION: Opus-[N] is closing. S[NNN] continues.
YOUR TASK: Read these updates first, then proceed.

UPDATE 1 — [specific thing that happened in Opus-N that isn't in the HANDOFF]
UPDATE 2 — [new OPEN item registered this session]
[...]

YOUR DIRECTIVE: [the active PROTO step Opus-N+1 should relay to Sonnet immediately]

Opus-[N] signing off. exit_code=0 at [SHA]. [validator count] validators.
```

---

*Tab Closing Protocol v1.0 | S044 | Engraved by Opus-3*
*Add gaps discovered in future sessions to Section 7.*
