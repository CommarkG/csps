---
id: csps.governance.proto-and-tab-transfer-protocol
name: PROTO-AND-TAB-TRANSFER-PROTOCOL
description: "Canonical definition of what a PROTO is, the Opus-Sonnet back-and-forth cycle with all edge cases, and the complete tab transfer protocol — what to prepare, verify, present, and send when switching AI tabs."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: governance_files
diataxis_type: reference
session: S061
impl_status: swift-implemented
context_question: "Is this PROTO well-formed — does it have a definition, reasoning, core seed, success criteria, and Sonnet instructions?"
context_quote: "A PROTO without a core seed is a wish. A PROTO with a core seed is a contract."
links:
  - { rel: relay-model, href: ../../../../tools/scripts/generate-startup-block.mjs }
  - { rel: permanence-mechanics, href: ../../_handoff/VAULT/inner-ai-defaults/permanence-mechanics.md }
  - { rel: north-star, href: ./CSPS-NORTH-STAR.md }
---

# PROTO and Tab Transfer Protocol

> Governor directive S061: Define what a PROTO is, the full Opus-Sonnet relay cycle
> with edge cases, and tab transfer in complete mechanical detail.
> This file IS the canonical reference. No other source supersedes it.

---

## Part 1 — What Is a PROTO?

**PROTO** (Protocol Execution Order) is a formal, numbered directive from Opus to Sonnet
that packages everything Sonnet needs to build one well-bounded unit of work.

A PROTO is NOT:
- A vague instruction ("add some validation")
- A feature wish ("make this better")
- A list of tasks without architectural intent

A PROTO IS:
- A contract between Opus's design intent and Sonnet's implementation
- Self-contained — Sonnet can execute it without asking Opus clarifying questions
- Bounded — one PROTO = one cohesive unit of work (one validator, one feature area, one schema extension)
- Anchored — it contains a **core seed** that Opus wrote, which Sonnet extends

### PROTO anatomy — mandatory fields

```
PROTO-[ID] — [short title]

DEFINITION:
  [What this PROTO produces. One paragraph. Not what the code does —
   what the INTENT achieves. A developer who has never seen this
   codebase must understand why this exists.]

REASONING:
  [Why this approach vs alternatives. What would go wrong with the
   naive implementation. Which principle from CSPS-NORTH-STAR.md or
   PLATFORM-GENOME.md this inherits from.]

CORE SEED (written by Opus):
  [The architectural anchor — code, schema, or structure that Opus
   has written which defines the pattern Sonnet MUST follow. This
   is not scaffolding. This is the intent crystallized into form.]

SONNET INSTRUCTIONS:
  [What Sonnet builds from the seed. Specific, complete, in order.
   Includes what to NOT do (edge cases, anti-patterns to avoid).]

SUCCESS CRITERIA:
  [How Sonnet knows it is done. Specific file:line evidence or
   validator output. "pnpm verify exit_code=0" is always included
   but is not sufficient alone.]

DEPENDENCIES:
  [What must exist before this PROTO can run. Other PROTOs,
   files, data, or Governor decisions.]
```

### Why Opus writes the core seed — not Sonnet

The core seed is written by Opus because Opus holds the architectural intent.
Sonnet's training default is to produce working code that satisfies local requirements.
But CSPS has a specific architecture, a specific genome, a specific vocabulary.

When Opus writes the seed, it anchors:
- The naming conventions (from PLATFORM-GENOME.md)
- The schema fields (from the domain's schema anchor)
- The inheritance structure (what this inherits from)
- The enforcement pattern (T1/T2/T3 expressed in code form)

Sonnet then builds from a pattern that already embodies the intent,
rather than trying to infer intent from a description.

**When Opus writes the seed vs when Sonnet writes everything:**

| Situation | Who writes the seed |
|---|---|
| New pattern being established | Opus — the pattern itself is the intent |
| Sensitive schema field (sensitive data, privacy-impacting) | Opus — wrong schema = wrong intent |
| New enforcement mechanism (T1/T2/T3) | Opus — enforcement logic encodes the rule |
| Extension of existing pattern | Sonnet — pattern already established, Sonnet follows it |
| Bug fix within existing pattern | Sonnet — fixing, not establishing |
| UI component following existing pageDNA | Sonnet — pageDNA already anchors intent |

---

## Part 2 — The Opus-Sonnet Back-and-Forth Cycle

### Standard cycle (no deviations)

```
STEP 1 — OPUS ISSUES PROTO
  Opus writes PROTO with all mandatory fields + core seed.
  Opus writes core seed to the actual file (not just chat).
  Opus commits the core seed before handing to Sonnet.
    → Why commit first: Sonnet's starting point is committed code,
      not chat content that could be lost.
  Opus posts PROTO to tools/council/sonnet-turn.md as
  "# FROM OPUS | FOR SONNET TAB — PROTO-[ID] ISSUED"

STEP 2 — GOVERNOR RELAYS TO SONNET
  Governor copies sonnet-turn.md content and pastes to Sonnet tab.
  (Governor is the relay — Opus and Sonnet cannot communicate directly)
  Governor asks: "Sonnet, read this and acknowledge."

STEP 3 — SONNET ACKNOWLEDGES
  Sonnet reads the full PROTO including core seed.
  Sonnet writes to tools/council/sonnet-turn.md:
    "# FROM SONNET | FOR OPUS TAB — PROTO-[ID] ACKNOWLEDGED
    I have read the PROTO. The core seed at [file:line] anchors [pattern].
    I will build [specific things] and NOT [specific anti-patterns].
    ZF Cycle 1: [any questions or blockers found]
    ZF Cycle 2: re-examined [specific items] — 0 new issues."
  If Sonnet has blocking questions: lists them here before starting.
  If no blocking questions: begins implementation immediately.

STEP 4 — SONNET BUILDS
  Sonnet builds from the core seed outward.
  Sonnet runs pnpm verify after each logical unit of work.
  Sonnet commits frequently (every unit that passes verify).
  Sonnet does NOT deviate from the core seed's pattern without flagging.

STEP 5 — SONNET REPORTS
  Sonnet writes final report to tools/council/sonnet-turn.md:
    "# FROM SONNET | FOR OPUS TAB — PROTO-[ID] COMPLETE
    Date: [date] | Commit: [sha-as-github-url] | exit_code=0 | [N] validators
    WHAT WAS BUILT:
      [specific deliverables with file:line]
    DIVERGENCES FROM PROTO:
      [anything that differed from the plan + why + what was done instead]
    ZF CYCLES:
      Cycle 1: [findings]
      Cycle 2: re-examined [specific items] — 0 new findings. ZF ACHIEVED.
    QUESTIONS FOR OPUS:
      [anything Opus needs to decide before next PROTO]"
  Governor relays this to Opus tab.

STEP 6 — OPUS REVIEWS
  Opus reads Sonnet's report.
  Opus verifies: does what was built match the intent (not just the instructions)?
  Opus checks: is the core seed's pattern preserved or drifted?
  Opus issues one of three responses:

  ADVANCE:
    "PROTO-[ID] ADVANCE. Intent preserved. Core seed pattern intact.
    Next: PROTO-[next-id]."

  COURSE-CORRECT:
    "PROTO-[ID] COURSE-CORRECT. [specific issue at file:line].
    Revised seed: [new code segment].
    Sonnet: apply this correction, re-verify, report back."

  HOLD:
    "PROTO-[ID] HOLD. [specific blocker that requires Governor input].
    Governor question: [the specific decision needed]."
```

### Edge cases and how to handle them

**Edge case 1 — Sonnet hits a technical blocker not anticipated by the PROTO**

Situation: Sonnet discovers that the PROTO's approach is technically impossible
due to a framework constraint, existing code conflict, or dependency issue.

Sonnet's correct response:
```
PROTO-[ID] TECHNICAL BLOCKER — CANNOT PROCEED AS SPECIFIED
Blocker: [specific technical constraint at file:line]
I attempted: [what was tried]
Why it fails: [specific error or conflict]
My proposed alternative: [what could work instead, with reasoning]
Does Opus want me to: (a) proceed with alternative, (b) await revised PROTO, (c) skip this PROTO?
```

Opus's correct response: Issue a PROTO-COURSE-CORRECT with a revised core seed
that accommodates the technical constraint. Do NOT tell Sonnet to "figure it out."

---

**Edge case 2 — Sonnet deviates from the core seed's pattern**

Situation: Sonnet built something that works but used a different pattern than the
core seed established.

Opus's correct response on review:
```
PROTO-[ID] COURSE-CORRECT — PATTERN DRIFT
The implementation at [file:line] diverges from the core seed pattern.
The seed established [X pattern]. The implementation uses [Y pattern].
This matters because [why the pattern choice encodes intent].
Revised seed showing correct pattern: [code]
Sonnet: refactor [specific file:line] to follow the seed pattern.
```

Do NOT accept "it works" as sufficient. Intent drift is not visible in passing tests.

---

**Edge case 3 — PROTO scope expands during implementation**

Situation: Sonnet realizes that completing the PROTO properly requires doing
something not specified in the original PROTO.

Sonnet's correct response:
```
PROTO-[ID] SCOPE QUESTION
While implementing [specific thing], I found that [additional thing] is needed.
Specifically: [what and why]
This was NOT in the PROTO. Options:
(a) I add it (adds ~[time] and [risk])
(b) I skip it now and flag as a follow-up PROTO
(c) I ask Opus for a new core seed before proceeding
My recommendation: [a/b/c] because [reasoning]
```

Opus's correct response: Ratify the scope extension OR issue a new PROTO for the
additional work. Never let Sonnet expand scope silently.

---

**Edge case 4 — Sonnet believes the PROTO's approach is architecturally wrong**

Situation: Sonnet (while implementing) sees that the approach will create structural
problems Opus may not have seen from the architectural level.

Sonnet's correct response:
```
PROTO-[ID] ARCHITECTURAL CONCERN — REQUESTING OPUS REVIEW
I have implemented [what] but have an architectural concern before finalizing.
Concern: [specific issue with file:line]
My reasoning: [why this matters]
I have NOT committed the problematic part. Awaiting Opus review.
```

Opus reviews the actual code (not just the description) before deciding.

---

**Edge case 5 — Governor redirects mid-PROTO**

Situation: Governor gives Sonnet a new directive while a PROTO is in progress.

The correct model:
1. Sonnet commits all work-in-progress to a WIP state
2. Sonnet writes PROTO-[ID] SUSPENDED to sonnet-turn.md with current state
3. Governor relays suspension to Opus
4. Opus either: (a) issues a new PROTO for the redirect, or (b) confirms Sonnet
   should resume the suspended PROTO
5. Never two PROTOs running simultaneously

---

## Part 3 — Tab Transfer Protocol

### When does tab transfer happen?

Tab transfer happens when:
- An AI tab has consumed significant context (>500K tokens for Opus)
- A logical work boundary has been reached (PROTO complete, session phase complete)
- The Governor explicitly directs it
- A tab produced a significant error and a fresh tab is needed

Tab transfer does NOT happen:
- Mid-PROTO unless there is a genuine blocker
- "To get fresh context" as an excuse to avoid dealing with a problem

---

### The complete tab transfer checklist — what to prepare

**Phase 1 — Verify the platform is in a clean state (BEFORE writing any handoff)**

```
□ pnpm verify exit_code=0
  Command: node tools/verify.mjs --skip-install | grep exit_code
  If exit_code=1: DO NOT transfer. Fix the violation first.

□ git log shows all intended work is committed
  Command: git log --oneline -5
  No uncommitted changes: git status (should be clean)

□ Both repos pushed (main repo + playground if applicable)
  Command: git push (main) + in apps/csps-playground: git push

□ sonnet-turn.md reflects current actual state
  The first line of sonnet-turn.md is what generate-startup-block.mjs displays.
  It must be accurate — not describing work from 10 commits ago.
```

**Phase 2 — Generate startup blocks (NEVER freestyle)**

```
□ Run: node tools/scripts/generate-startup-block.mjs
  Output: .csps/startup-blocks/opus-startup.txt (for Opus tab)
          .csps/startup-blocks/sonnet-startup.txt (for Sonnet tab)
  Never write these manually. Never paste "from memory."
  The generator reads current git state — this is what prevents stale blocks.
```

**Phase 3 — Create or update HANDOFF file**

The HANDOFF file is the permanent record of this transfer. It must contain:

```
□ Zone A — What was built this session
  - Every PROTO completed with commit SHA
  - Every governor directive addressed (or explicitly deferred)
  - Current validator count + exit_code
  - Permanence score (from validate-permanence-coverage.mjs)

□ Zone B — Open work
  - Every open PROTO with status
  - Every unresolved Governor question
  - Any technical blockers found
  - Items deferred to next session with explicit reasoning

□ ALIGNMENT QUESTIONS (minimum 5, using **Q1:** format)
  - The 3-5 most important things the incoming Opus/Sonnet must verify
    before doing anything else
  - At least one must be: "Does pnpm verify exit_code=0 from THIS tab?"
  - Include edge cases the outgoing tab encountered

□ SONNET STARTUP BLOCK (paste-ready, from .csps/startup-blocks/sonnet-startup.txt)
  - This is what Governor pastes to the new Sonnet tab
  - Never write this manually
```

**Phase 4 — Write the next-5-steps block (the most critical preparation)**

This is the element most often skipped or done nominally. It must NOT be nominal.

Format: for each of the next 5 steps, provide:

```
STEP [N] — [title]
  WHAT: [the specific action]
  WHY NOW: [why this step comes before step N+1]
  CONTEXT: [what the incoming tab needs to know that isn't in the handoff]
  INTENT: [the Governor's actual goal — not what the code does, but why it matters]
  NUANCES: [the specific ways a fresh Opus/Sonnet might get this wrong]
  ANTI-PATTERNS: [what NOT to do, with specific reasoning]
  SUCCESS SIGNAL: [how you know this step is done — specific evidence]
```

Example:
```
STEP 1 — Close gap_T2_ORPHAN_CONTRACTS (gap-recurrence-register.yaml)
  WHAT: Add a T2 validator that checks all B_* contracts have an
        `enforces:` field pointing to an existing principle ID.
  WHY NOW: This gap is at K=3 and blocks session close per validate-gap-recurrence.mjs.
           Nothing else can be ratified until this is resolved.
  CONTEXT: The gap was opened in S058 when validate-permanence-coverage.mjs found
           contracts that reference principles by ID that don't exist in principles.yaml.
           The orphan pattern is in 8 contracts (see gap entry for list).
  INTENT: Governor's intent is not just "fix 8 contracts" — it is to establish that
          every governance artifact has a traceable provenance chain. Orphan contracts
          are the symptom; the intent is full traceability.
  NUANCES: Do NOT just add fake principle IDs to satisfy the validator.
           The correct fix is either: (a) create the missing principles, or
           (b) point the contract at the correct existing principle.
           Option (b) requires understanding what principle the contract SHOULD enforce.
  ANTI-PATTERNS: "I'll add enforces: [placeholder]" — this is governance theater.
                 "I'll skip the validator check for these 8" — this is a T2 bypass.
  SUCCESS SIGNAL: pnpm verify | grep orphan-contracts → 0 violations.
                  All 8 contracts have enforces: pointing to real principle IDs.
```

---

### What to present as a summary to the outgoing-tab Governor

At the moment of transfer, the outgoing tab (Opus or Sonnet) presents:

```
TAB TRANSFER SUMMARY
Generated: [date/time] | Commit: [sha] | exit_code=0 | [N] validators

COMPLETED THIS TAB:
  [bulleted list — PROTO ID + one-sentence description + commit SHA]

PLATFORM STATE:
  Permanence: [X/66] contracts T1+T2+T3 ([%])
  Open gaps: [any gap-recurrence-register.yaml entries with k≥2 and status:open]
  Deferred items: [anything explicitly deferred with reason]

HANDOFF FILE: docs/plan/_handoff/HANDOFF-[from]-to-[to].md
STARTUP BLOCKS: .csps/startup-blocks/[opus|sonnet]-startup.txt

NEXT 5 STEPS:
  [abbreviated version — full detail is in the handoff file Zone B]
  1. [step title] — [one line of why this is first]
  2. [step title] — [one line]
  3-5: [same]
```

---

### What to prepare as alignment update to the incoming colleague

**When Opus is transferring to a new Opus tab:**
The new Opus must get:
1. The opus-startup.txt (generated — not freestyle)
2. The HANDOFF Zone A (what was built) + Zone B (what's open)
3. Sonnet's current state (sonnet-turn.md first line)
4. The 5-question ALIGNMENT QUESTIONS from the HANDOFF
5. Explicit statement of which PROTO Sonnet is mid-execution (if any)

**When Sonnet is transferring to a new Sonnet tab:**
The new Sonnet must get:
1. The sonnet-startup.txt (generated — not freestyle)
2. The HANDOFF Zone B (what's open — Sonnet doesn't need Zone A)
3. The PROTO that Sonnet was executing (if mid-PROTO, include the full PROTO text)
4. Any blockers encountered so far (so new Sonnet doesn't repeat them)
5. The core seed commit SHA (so new Sonnet can find exactly where Opus anchored intent)

---

### What happens in a new tab after the startup block is pasted?

**For Opus (new tab):**

```
STEP 1 — EXECUTE PERMISSION BYPASS (before anything else)
  node -e "const fs=require('fs');fs.writeFileSync(...)
  Verify: settings.local.json now has bypassPermissions: true

STEP 2 — READ THE HANDOFF FULLY (both zones)
  Do NOT skim. Read every line of Zone A and Zone B.
  While reading, mentally tag: what is done, what is open, what is blocked.
  Do NOT start forming PROTOs yet.

STEP 3 — READ SONNET'S CURRENT STATE
  head -5 tools/council/sonnet-turn.md
  This tells you: is Sonnet mid-PROTO? Waiting? Blocked?
  Do NOT issue a new PROTO until you know Sonnet's current position.

STEP 4 — VERIFY THE PLATFORM STATE YOURSELF
  git log --oneline -3
  node tools/verify.mjs --skip-install | grep exit_code
  Do NOT trust the handoff's stated exit_code — verify it in THIS tab.
  If exit_code=1: the first PROTO is "fix the violation."

STEP 5 — WRITE INTENT ABSORBED TO sonnet-turn.md
  Format: "# OPUS-[N] Turn 1 — INTENT ABSORBED | [sha] | exit_code=[0/1]"
  Include ZF block: what you read, what you found, what is clear.
  This signals to Sonnet (and to yourself) that you have absorbed context.

STEP 6 — ONLY NOW: begin architectural work
  Review Zone B open items.
  Apply the 5 GUARD QUESTIONS before every response.
  Issue PROTOs in the sequence specified by FOUNDATION-COMPLETION-PLAN.md.
  Do NOT invent new work items that aren't in the plan.
```

**For Sonnet (new tab):**

```
STEP 1 — EXECUTE PERMISSION BYPASS (before anything else)
  Same as Opus. Verify settings.local.json is correct.

STEP 2 — READ THE HANDOFF ZONE B
  Zone B is where Sonnet's work lives.
  Find the PROTO that is current (or next to execute).
  Do NOT begin until you have read the PROTO's core seed.

STEP 3 — LOCATE THE CORE SEED
  The core seed is committed to the repo.
  Read the file at the commit SHA Opus specified.
  Understand the PATTERN before writing any code.
  If the core seed is unclear: flag to Opus before proceeding.

STEP 4 — VERIFY THE PLATFORM STATE
  git log --oneline -3
  node tools/verify.mjs --skip-install | grep exit_code
  If exit_code=1 and you didn't cause it: report to Opus before building.

STEP 5 — WRITE INTENT ABSORBED TO sonnet-turn.md
  Format: "# Sonnet [SESSION] — INTENT ABSORBED | [sha] | exit_code=[N]"
  Include ZF block: what PROTO you are executing, what the core seed establishes.

STEP 6 — AWAIT OPUS PROTO (if mid-session start)
  If no current PROTO: wait for Opus to issue one via Governor relay.
  Do NOT invent work. Do NOT start implementing things not in a PROTO.

STEP 7 — BEGIN IMPLEMENTATION (when PROTO is clear)
  Build from the core seed outward.
  Run verify after every logical unit.
  Commit frequently.
  Report immediately if you hit any of the edge cases in Part 2.
```

---

## Part 4 — Common Tab Transfer Failures and Fixes

| Failure | Root cause | Fix |
|---|---|---|
| Opus-9 consuming 1M tokens implementing | Startup block said "DO NOT write code" but not WHY, and Opus's training default is to be helpful by doing | The relay model box now explicitly names which code Opus writes and which Sonnet writes |
| Stale PROTO status in startup block | Block written from memory, not from current git state | generate-startup-block.mjs derives session and state from git log + sonnet-turn.md |
| New Sonnet tab re-doing work already done | Previous Sonnet didn't commit; new tab starts from wrong baseline | Require commit BEFORE writing to sonnet-turn.md. If not committed, it didn't happen. |
| Sonnet deviating from core seed silently | PROTO didn't specify what NOT to do | Add ANTI-PATTERNS field to every PROTO |
| Governor re-explains the same context every session | Context not captured in permanent files | Every Governor explanation → vault entry within same session |
| Alignment questions ignored | Treated as optional | validate-handoff-completeness.mjs BLOCKS if ALIGNMENT QUESTIONS missing. Incoming tab must write answers to sonnet-turn.md before any other work. |

---

## Part 5 — PROTO Naming Conventions

| Format | Use case |
|---|---|
| PROTO-[LETTER] | Foundation completion PROTOs (planned sequence: A, B, C...) |
| PROTO-[KEYWORD]-[N] | Feature-specific PROTOs (PROTO-NORTHSTAR-1, PROTO-THRESHOLD-2) |
| PROTO-[SESSION]-[N] | Session-specific one-off PROTOs (PROTO-S061-1) |
| PROTO-COURSE-CORRECT | Correction directive from Opus after Sonnet deviation |
| PROTO-EMERGENCY | Urgent fix that blocks session close (rare — requires explicit Governor directive) |

All PROTOs must be registered in `docs/plan/unified-plan.yaml` before execution.
A PROTO without a plan item is a side quest. Side quests require explicit Governor ratification.

---

*PROTO-AND-TAB-TRANSFER-PROTOCOL v1.0 | S061 | Opus-8*
*Written from the S061 incident: Opus-9 consuming 1M tokens because the relay model was T3-only text.*
*Every section here is traceable to a specific failure mode observed in CSPS sessions S051-S061.*
