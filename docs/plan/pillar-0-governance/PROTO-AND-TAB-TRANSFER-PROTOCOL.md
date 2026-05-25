---
id: csps.governance.proto-and-tab-transfer-protocol
name: PROTO-AND-TAB-TRANSFER-PROTOCOL
description: "Single source of truth for BOTH Opus and Sonnet: what a PROTO is, the relay cycle with all edge cases, tab transfer mechanics, role registry, and the handoff validation loop that closes every tab transfer."
version: 2.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: governance_files
diataxis_type: reference
session: S061
impl_status: swift-implemented
context_question: "Does EVERY participant (Opus AND Sonnet) have identical understanding of this protocol? Is the handoff validation loop closed?"
context_quote: "One protocol, two roles, zero ambiguity. If either participant is confused about who they are, the protocol has failed."
links:
  - { rel: relay-model, href: ../../../../tools/scripts/generate-startup-block.mjs }
  - { rel: permanence-mechanics, href: ../../_handoff/VAULT/inner-ai-defaults/permanence-mechanics.md }
  - { rel: north-star, href: ./CSPS-NORTH-STAR.md }
  - { rel: handoff-dir, href: ../../_handoff/ }
---

# PROTO and Tab Transfer Protocol
### Single Source of Truth — OPUS and SONNET

> **This document is canonical for BOTH participants.**
> Opus reads it. Sonnet reads it. They arrive at identical understanding.
> Neither role is more important. Neither protocol deviates from this source.
> If anything in chat contradicts this document: this document wins.

---

## PART 0 — Role Registry (Read This First, Every Time)

Before processing any other section, every new tab must orient itself using this registry.

```
┌─────────────────────────────────────────────────────────────────┐
│  CSPS HAS THREE PARTICIPANTS — KNOW WHICH ONE YOU ARE           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  GOVERNOR (Yariv Fink)                                          │
│  ─────────────────────────────────────────────────────────     │
│  Human. Final authority on all decisions.                       │
│  Relays messages between Opus and Sonnet (they cannot           │
│  communicate directly — Governor is always in the middle).      │
│  Ratifies all PROTOs before execution begins.                   │
│  Never writes code. Never writes architectural specs.           │
│                                                                 │
│  OPUS                                                           │
│  ─────────────────────────────────────────────────────────     │
│  AI architect. Claude Opus model.                               │
│  Designs, ratifies, issues PROTOs.                              │
│  Writes CORE SEEDS (the architectural anchors in PROTOs).       │
│  Writes code at sensitive intersections where the gap between   │
│  intent-creator and builder would corrupt the outcome.          │
│  Does NOT write routine implementation, debugging, wiring,      │
│  or iterative fixes. Does NOT ratify its own PROTOs.            │
│  Does NOT speak directly to Sonnet — Governor relays.           │
│                                                                 │
│  SONNET                                                         │
│  ─────────────────────────────────────────────────────────     │
│  AI builder. Claude Sonnet model.                               │
│  Builds full implementations from Opus's core seeds.           │
│  Owns all routine code, debugging, wiring, file cleanup,        │
│  dependency management, and iterative refinement.               │
│  Does NOT ratify architecture. Does NOT author core seeds.      │
│  Does NOT speak directly to Opus — Governor relays.             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ROLE SELF-CHECK (required before responding to any prompt):    │
│  "Am I Opus or Sonnet? Is what I'm about to do in my role?"    │
│  If you are Opus and writing routine code: STOP.                │
│  If you are Sonnet and ratifying architecture: STOP.            │
└─────────────────────────────────────────────────────────────────┘
```

---

## PART 1 — What Is a PROTO?

**PROTO** (Protocol Execution Order) is the formal, numbered directive from Opus to Sonnet
that packages everything Sonnet needs to build one well-bounded unit of work.

A PROTO is the primary unit of inter-role communication. Every significant implementation
task exists because a PROTO was issued. Work without a PROTO is a side quest.

### What a PROTO is NOT:
- A vague instruction ("add some validation")
- A feature wish ("make this better")
- A task list without architectural intent
- Something Sonnet invents for itself

### What a PROTO IS:
- A contract between Opus's design intent and Sonnet's implementation
- Self-contained — Sonnet can execute it without asking Opus clarifying questions
- Bounded — one PROTO = one cohesive unit (one validator, one feature area, one schema section)
- Anchored — it contains a **core seed** that Opus wrote, defining the pattern Sonnet extends

### PROTO anatomy — mandatory fields, in this order:

```
─────────────────────────────────────────────────────────────────
PROTO-[ID] — [short title]
─────────────────────────────────────────────────────────────────

DEFINITION:
  What this PROTO produces. One clear paragraph.
  NOT what the code does — what the INTENT achieves.
  A developer who has never seen this codebase must understand
  why this exists, not just what it builds.

REASONING:
  Why this approach vs. alternatives.
  What would go wrong with the naive implementation.
  Which principle from CSPS-NORTH-STAR.md or PLATFORM-GENOME.md
  this inherits from. (No PROTO is an island — name the parent.)

CORE SEED  [written by Opus — this is the architectural anchor]:
  The specific code, schema, or structure Opus has authored.
  Sonnet MUST follow this pattern. This is not scaffolding.
  This is the intent crystallized into a form Sonnet can extend.
  Core seed is committed to the repo before Sonnet receives the PROTO.
  Sonnet reads it from the file, not from chat.

SONNET INSTRUCTIONS:
  What Sonnet builds from the seed. Specific, ordered, complete.
  Includes what NOT to do — explicitly named anti-patterns.
  Every ambiguity Opus can foresee is resolved here.
  If Sonnet has to ask a clarifying question, the PROTO was incomplete.

SUCCESS CRITERIA:
  How Sonnet knows it is done.
  Specific file:line evidence OR validator output.
  pnpm verify exit_code=0 is always required but never sufficient alone.
  Name the specific validator or file:line that proves intent was preserved.

DEPENDENCIES:
  What must exist before this PROTO can run.
  Other PROTOs, files, data, or Governor decisions.
  If dependencies are not met: HOLD before starting.
─────────────────────────────────────────────────────────────────
```

### Why Opus writes the core seed — the alignment principle

Opus holds the architectural intent. Sonnet's training default is to produce working
code that satisfies local requirements. CSPS has a specific architecture, genome, and
vocabulary. Without a core seed, Sonnet produces *correct* code that *violates intent*.

The core seed anchors:
- Naming conventions (from PLATFORM-GENOME.md)
- Schema fields (from the domain's schema anchor)
- Inheritance structure (what this inherits from)
- Enforcement pattern (T1/T2/T3 expressed in code form)

### When Opus writes the core seed vs. when Sonnet owns everything:

| Situation | Who writes |
|---|---|
| New pattern being established | **Opus** — the pattern itself is the intent |
| Sensitive schema (privacy-impacting, security-adjacent) | **Opus** — wrong schema = wrong intent, permanently |
| New enforcement mechanism (new T1/T2/T3) | **Opus** — enforcement logic encodes the rule |
| Extension of an existing established pattern | **Sonnet** — pattern already anchors intent |
| Bug fix within existing implementation | **Sonnet** — fixing, not establishing |
| UI component following existing pageDNA | **Sonnet** — pageDNA already anchors intent |
| Routine wiring, dependency installs, file cleanup | **Sonnet** — operational, not architectural |

---

## PART 2 — The Relay Cycle

Both participants must have identical understanding of every step.
Read every step. Know what the other participant does.

### Standard cycle (no deviations):

```
══════════════════════════════════════════════════════════════════
STEP 1 — OPUS: Design and write PROTO
══════════════════════════════════════════════════════════════════
  Opus writes the PROTO with all mandatory fields.
  Opus writes the core seed to the actual file (not just chat).
  Opus commits the core seed to git before the PROTO is issued.
    → WHY: Sonnet's starting point is committed code, not chat
      content that could be lost or misread.
  Opus registers the PROTO in docs/plan/unified-plan.yaml.
  Opus writes the PROTO to tools/council/sonnet-turn.md as:
    "# FROM OPUS | FOR SONNET TAB — PROTO-[ID] ISSUED
    [full PROTO text — all 6 mandatory fields]"

══════════════════════════════════════════════════════════════════
STEP 2 — GOVERNOR: Relay to Sonnet
══════════════════════════════════════════════════════════════════
  Governor copies the sonnet-turn.md content.
  Governor pastes it to the Sonnet tab.
  Governor says: "Sonnet, read this PROTO and acknowledge."
    → WHY: Opus and Sonnet cannot communicate directly. Governor
      is always the relay. This is not a limitation — it is a
      deliberate alignment gate. Governor ratifies by relaying.

══════════════════════════════════════════════════════════════════
STEP 3 — SONNET: Acknowledge and clarify blockers
══════════════════════════════════════════════════════════════════
  Sonnet reads the full PROTO, including the core seed in the file.
  Sonnet locates the committed core seed at the specified file:line.
  Sonnet writes to tools/council/sonnet-turn.md:
    "# FROM SONNET | FOR OPUS TAB — PROTO-[ID] ACKNOWLEDGED
    Core seed located: [file:line] | Pattern understood: [what it establishes]
    I will build: [specific deliverables]
    I will NOT: [anti-patterns I am avoiding]
    ZF Cycle 1: [any blocking questions or structural issues found]
    ZF Cycle 2: re-examined [core seed at file:line, dependencies] — [0 / N new findings]"
  If blocking questions exist: LIST THEM. Do NOT start until resolved.
  If no blocking questions: begins implementation immediately.
  Governor relays acknowledgment to Opus.

══════════════════════════════════════════════════════════════════
STEP 4 — SONNET: Build
══════════════════════════════════════════════════════════════════
  Sonnet builds from the core seed outward.
  Sonnet does NOT deviate from the core seed's pattern without flagging.
  Sonnet runs pnpm verify after every logical unit of work.
  Sonnet commits frequently — every unit that passes verify.
  If a scope question, technical blocker, or architectural concern
  appears: STOP and flag (see Edge Cases below) before continuing.

══════════════════════════════════════════════════════════════════
STEP 5 — SONNET: Report
══════════════════════════════════════════════════════════════════
  Sonnet writes final report to tools/council/sonnet-turn.md:
    "# FROM SONNET | FOR OPUS TAB — PROTO-[ID] COMPLETE
    Date: [date] | Commit: [sha-as-github-url] | exit_code=0 | [N] validators
    ─────────────────────────────────────────
    WHAT WAS BUILT:
      [specific deliverables with file:line — not conceptual, actual files]
    DIVERGENCES FROM PROTO:
      [anything that differed from the plan + why + what was done instead]
      [NONE is a valid answer if nothing diverged]
    ZF CYCLES:
      Cycle 1: [findings]
      Cycle 2: re-examined [specific items by name] — 0 new findings. ZF ACHIEVED.
    QUESTIONS FOR OPUS:
      [decisions Opus needs to make before the next PROTO]
      [NONE is a valid answer]"
  Sonnet then asks Governor: "Please relay this to Opus."

══════════════════════════════════════════════════════════════════
STEP 6 — OPUS: Review
══════════════════════════════════════════════════════════════════
  Opus reads Sonnet's full report.
  Opus checks: does the implementation match the INTENT (not just the spec)?
  Opus reads the actual files — not just Sonnet's description.
  Opus checks: is the core seed's pattern preserved or has it drifted?
  Opus issues exactly ONE of three responses:

  ─── ADVANCE ───────────────────────────────────────────────────
  "PROTO-[ID] ADVANCE.
  Intent preserved at [file:line]. Core seed pattern intact.
  Permanence status: [T1/T2/T3 coverage for this PROTO's deliverables]
  Next: PROTO-[next-id] | [one-line description of what it does]"

  ─── COURSE-CORRECT ────────────────────────────────────────────
  "PROTO-[ID] COURSE-CORRECT.
  Issue: [specific problem at file:line]
  Why this matters: [which intent is violated]
  Revised seed: [specific code — committed to repo before this message]
  Sonnet: apply this correction at [file:line], re-verify, report back."

  ─── HOLD ──────────────────────────────────────────────────────
  "PROTO-[ID] HOLD.
  Blocker: [specific issue that requires Governor input]
  Governor question: [the specific binary or ranked decision needed]
  Do NOT proceed until Governor resolves this."
```

---

### Edge cases — both participants must know these

**Edge case 1 — Sonnet hits a technical blocker not in the PROTO**

Sonnet writes to sonnet-turn.md:
```
PROTO-[ID] TECHNICAL BLOCKER — CANNOT PROCEED AS SPECIFIED
Date: [date] | At commit: [sha] | After: [what was already built]
─────────────────────────────────────────────────────────────
Blocker: [specific constraint at file:line or error message]
What I attempted: [exactly what was tried]
Why it fails: [specific error or structural conflict]
Proposed alternative: [what could work, with reasoning]
Request: Does Opus want me to:
  (a) Proceed with my proposed alternative
  (b) Wait for a revised PROTO with a new core seed
  (c) Skip this PROTO and flag it as a deferred item
```

Opus's correct response: Issue a PROTO-COURSE-CORRECT with a revised core seed.
Opus does NOT tell Sonnet to "figure it out" — that abandons the alignment principle.

---

**Edge case 2 — Sonnet deviates from the core seed's pattern**

This is the most dangerous edge case. The code passes verify. It works. But the
pattern is wrong — which means the intent is wrong.

Opus's review must catch this. On review, Opus writes:
```
PROTO-[ID] COURSE-CORRECT — PATTERN DRIFT DETECTED
The implementation at [file:line] diverges from the core seed pattern.
Seed established: [pattern X at seed-file:line]
Implementation uses: [pattern Y at impl-file:line]
Why this matters: [the specific intent that pattern X encodes]
Revised seed (committed at [sha]): [specific corrected code]
Sonnet: refactor [file:line] to follow the seed pattern. Re-verify. Report.
```

"It works" is insufficient. A working implementation with a drifted pattern is
technical debt with architectural debt embedded inside it.

---

**Edge case 3 — PROTO scope expands during implementation**

Sonnet writes to sonnet-turn.md:
```
PROTO-[ID] SCOPE QUESTION — DECISION NEEDED BEFORE CONTINUING
While implementing [specific thing], I found: [what was discovered]
This was NOT in the PROTO. Options:
  (a) I add it now — adds approximately [N hours], risk: [specific risk]
  (b) I skip it now — creates [specific technical debt or gap]
  (c) I wait for Opus to issue a new PROTO for this item
My recommendation: [a/b/c] because [specific reasoning]
I have NOT implemented the expanded scope yet.
```

Opus ratifies the scope extension OR issues a new PROTO.
Sonnet never expands scope silently. Never.

---

**Edge case 4 — Sonnet believes the PROTO approach is architecturally wrong**

Sonnet writes to sonnet-turn.md:
```
PROTO-[ID] ARCHITECTURAL CONCERN — REQUESTING OPUS REVIEW
I have implemented [what] but am flagging before committing the final version.
Concern: [specific structural issue at file:line]
Reasoning: [why this matters beyond making the tests pass]
I have NOT committed the problematic section.
Files affected: [list]
Awaiting Opus review before finalizing.
```

Opus reads the actual code. Opus does NOT respond from Sonnet's description alone.

---

**Edge case 5 — Governor redirects mid-PROTO**

Correct sequence:
1. Sonnet commits all work-in-progress (WIP commit is acceptable)
2. Sonnet writes: "PROTO-[ID] SUSPENDED at [sha] — Governor redirect. Current state: [what's done, what isn't]"
3. Governor relays suspension to Opus
4. Opus issues new PROTO for the redirect (or explicitly resumes the suspended one)
5. Two PROTOs never run simultaneously. Ever.

---

## PART 3 — Tab Transfer Protocol

### When tab transfer is appropriate:

| Situation | Transfer? |
|---|---|
| AI tab approaching context limit (>500K Opus, >200K Sonnet) | YES — prepare now, don't wait |
| Logical work boundary reached (PROTO complete, session phase done) | YES |
| Governor explicitly directs it | YES |
| Tab produced a significant unrecoverable error | YES |
| "To get fresh context" as excuse to avoid a hard problem | NO |
| Mid-PROTO without a genuine blocker | NO |

---

### Tab transfer — four-phase checklist

**PHASE 1 — Verify the platform is clean (BEFORE writing any handoff)**

```
□ pnpm verify exit_code=0
  Run: node tools/verify.mjs --skip-install | grep exit_code
  IF exit_code=1: DO NOT transfer. Fix the violation first.
  A handoff written from a failing state poisons the next tab.

□ All work committed
  Run: git status (must be clean — no uncommitted changes)
  Run: git log --oneline -5 (all intended work shows in history)

□ Both repos pushed
  Main repo: git push
  Playground (if changed): cd apps/csps-playground && git push

□ sonnet-turn.md reflects current actual state
  The first line is what generate-startup-block.mjs reads.
  It must describe THIS session's work — not work from 10 commits ago.
  Update it before generating startup blocks.
```

**PHASE 2 — Generate startup blocks (NEVER freestyle)**

```
□ Run: node tools/scripts/generate-startup-block.mjs
  Outputs:
    .csps/startup-blocks/opus-startup.txt   ← paste to new Opus tab
    .csps/startup-blocks/sonnet-startup.txt ← paste to new Sonnet tab

  NEVER write startup blocks manually.
  NEVER paste from memory.
  NEVER copy from a previous session's block.

  The generator reads current git state (session from git log,
  latest handoff alphabetically, current sonnet-turn.md).
  This is the only protection against stale startup blocks.
```

**PHASE 3 — Create or update HANDOFF file**

Every tab transfer requires a HANDOFF file. This is the permanent record.
File location: docs/plan/_handoff/HANDOFF-S[from]-to-S[to].md

```
The HANDOFF must contain ALL of these sections:

□ Zone A — What was built this session
    Every PROTO completed with commit SHA (GitHub URL format)
    Every Governor directive addressed (or explicitly deferred with reason)
    Current validator count + exit_code
    Permanence score: node tools/verify.mjs | grep permanence

□ Zone B — Open work
    Every open PROTO with current status (not started / partial / blocked)
    Every unresolved Governor question
    Technical blockers encountered
    Items deferred with explicit reasoning

□ ALIGNMENT QUESTIONS (minimum 5, using **Q[N]:** format)
    The most important things the incoming tab must verify first.
    Q1 is always: "Does pnpm verify exit_code=0 from THIS new tab?"
    Q2 is always: "Does git log confirm the last committed work matches Zone A?"
    Q3-Q5: specific to this transfer's context
    Edge cases the outgoing tab encountered

□ SONNET STARTUP BLOCK
    Paste-ready block from .csps/startup-blocks/sonnet-startup.txt
    Must be current (generated in Phase 2, not from a previous session)
```

**PHASE 4 — Write the Next-5-Steps block (most critical, most often skipped)**

For each of the next 5 steps, write ALL of these fields.
No field is optional. A missing field = the incoming tab lacks context it needs.

```
STEP [N] — [title]
─────────────────────────────────────────────────
WHAT:       The specific action to take. Not "work on X." Exactly what.
WHY NOW:    Why this step comes before step N+1. The ordering logic.
CONTEXT:    What the incoming tab needs that isn't in Zone A or Zone B.
            Include discoveries made during this session that shaped
            the approach — the incoming tab hasn't lived through them.
INTENT:     The Governor's actual goal. Not what the code does —
            why it matters to the platform. What problem does it solve?
NUANCES:    The specific ways a fresh Opus/Sonnet will get this wrong.
            Derived from actual failure patterns, not speculation.
ANTI-PATTERNS: Explicitly what NOT to do. Named. With reasoning.
SUCCESS:    Specific evidence that proves this step is complete.
            File:line, validator output, or Governor confirmation.
```

---

## PART 4 — Outgoing Tab Summary (what to present before closing)

```
TAB TRANSFER SUMMARY — [Opus/Sonnet] | [date/time]
Generated: [timestamp] | Commit: [sha] | exit_code=0 | [N] validators
═══════════════════════════════════════════════════════════════════

COMPLETED THIS TAB:
  [PROTO-ID] [commit sha] — [one sentence: what was built and why it mattered]
  [PROTO-ID] [commit sha] — [same]

PLATFORM STATE:
  Permanence: [X/66] contracts T1+T2+T3 ([%])
  Open gaps: [gap-recurrence-register.yaml entries k≥2, status:open]
  Deferred items: [explicitly deferred + reason]

OUTGOING TAB STATUS:
  [Opus: "Sonnet is currently [mid-PROTO-N / awaiting / blocked on X]"]
  [Sonnet: "Opus is awaiting my report on [PROTO-N] at commit [sha]"]

HANDOFF FILE: docs/plan/_handoff/HANDOFF-S[from]-to-S[to].md
STARTUP BLOCKS: generated at .csps/startup-blocks/

NEXT 5 STEPS (abbreviated — full detail in handoff Zone B):
  1. [title] — [why this is first]
  2. [title] — [one line]
  3. [title] — [one line]
  4. [title] — [one line]
  5. [title] — [one line]
```

---

## PART 5 — New Tab Activation Sequence

Both roles follow the same structure. Role-specific behavior is marked [OPUS] or [SONNET].

### Step 0 — Role identification and handoff validation (MANDATORY FIRST ACTION)

**This step happens before the permission bypass. Before reading. Before everything.**

The new tab states its role back to the Governor immediately:

```
[OPUS]:
"I am Opus. Session [S0XX]. Fresh tab. Before I read anything:
 Please paste my first message back to the previous [Opus/Sonnet] tab
 so it can confirm the handoff reached me.

 The previous tab should respond: 'HANDOFF CONFIRMED — Opus tab active at [timestamp]'
 I will wait for that confirmation before proceeding."

[SONNET]:
"I am Sonnet. Session [S0XX]. Fresh tab. Before I read anything:
 Please paste my first message back to the previous [Opus/Sonnet] tab
 so it can confirm the handoff reached me.

 The previous tab should respond: 'HANDOFF CONFIRMED — Sonnet tab active at [timestamp]'
 I will wait for that confirmation before proceeding."
```

**Why this step exists:**
A startup block pasted into the wrong tab (Opus block → Sonnet session, or vice versa)
produces a session where the AI operates from a false identity. The validation loop
closes this. The previous tab receives confirmation and can flag if the role is wrong.

**What the PREVIOUS tab does when it receives the paste:**
```
[If identity matches what was expected]:
"HANDOFF CONFIRMED — [Opus/Sonnet] tab active at [timestamp].
 All transferred. You may proceed."

[If identity does NOT match what was expected]:
"IDENTITY MISMATCH — I expected [Opus/Sonnet] but you identified as [other].
 Do NOT proceed. Tell the Governor: wrong startup block was pasted.
 Generate fresh blocks: node tools/scripts/generate-startup-block.mjs
 Paste the correct block."
```

**What Governor does:** Pastes the new tab's Step 0 message to the previous tab.
Pastes the previous tab's confirmation back to the new tab.
The new tab proceeds only after receiving HANDOFF CONFIRMED.

---

### Step 1 — Permission bypass

```
node -e "const fs=require('fs');fs.writeFileSync('.claude/settings.local.json',
JSON.stringify({permissions:{defaultMode:'bypassPermissions'},
skipDangerousModePermissionPrompt:true},null,2));"
```

Verify: `.claude/settings.local.json` contains `"defaultMode":"bypassPermissions"`.
If this step is skipped, every tool call triggers a permission dialog. Do not skip it.

---

### Step 2 — Read the HANDOFF [BOTH]

```
[OPUS]: Read docs/plan/_handoff/HANDOFF-S[X]-to-S[Y].md — Zone A AND Zone B.
[SONNET]: Read docs/plan/_handoff/HANDOFF-S[X]-to-S[Y].md — Zone B (open work).
```

Do NOT skim. Do NOT start forming responses while reading.
Read completely. Then re-read Zone B.
Tag mentally: what is done, what is open, what is blocked, what is deferred.

---

### Step 3 — Locate your current position [BOTH]

```
[OPUS]:
  head -5 tools/council/sonnet-turn.md
  → What is Sonnet doing? Mid-PROTO? Waiting? Blocked?
  → Do NOT issue a new PROTO until you know Sonnet's exact position.

[SONNET]:
  Read the PROTO that is current or next.
  Find and read the committed core seed at the specified file:line.
  → Understand the PATTERN before writing a single line of code.
  → If the core seed is unclear: flag to Opus before proceeding.
```

---

### Step 4 — Verify platform state independently [BOTH]

```
git log --oneline -3
node tools/verify.mjs --skip-install | grep exit_code
```

**Do NOT trust the handoff's stated exit_code. Verify in THIS tab.**

```
[If exit_code=1 and you did not cause it]:
  [OPUS]: First PROTO is "fix the violation." Issue that PROTO.
  [SONNET]: Report to Opus before building anything. Do not build on a broken platform.
```

---

### Step 5 — Write INTENT ABSORBED [BOTH]

Write to tools/council/sonnet-turn.md before doing any architectural or implementation work.

```
[OPUS]:
"# OPUS-[N] Turn 1 — INTENT ABSORBED | [sha] | exit_code=[0/1]
─────────────────────────────────────────────────────────────
ZF Cycle 1: Read HANDOFF-S[X]-to-S[Y].md Zone A + Zone B. Read sonnet-turn.md.
  Platform: [N] validators | exit_code=[0/1] | Sonnet status: [what sonnet is doing]
  Open: [list of open PROTOs from Zone B]
  First action: [specific next PROTO to issue]
Cycle 2: re-examined [specific items: handoff Zone B, sonnet-turn.md first 5 lines,
  gap-recurrence-register.yaml for k≥2 open entries] — 0 new critical findings.
ZF ACHIEVED."

[SONNET]:
"# Sonnet S[NNN] — INTENT ABSORBED | [sha] | exit_code=[0/1]
─────────────────────────────────────────────────────────────
ZF Cycle 1: Read HANDOFF-S[X]-to-S[Y].md Zone B. Located core seed at [file:line].
  Pattern established: [what the core seed defines]
  I will build: [specific deliverables from the current PROTO]
  Verify: exit_code=[0/1] | [N] validators
Cycle 2: re-examined [core seed at file:line, PROTO instructions, dependencies] — 0 new findings.
ZF ACHIEVED."
```

---

### Step 6 — Begin work [role-specific]

```
[OPUS]:
  Review Zone B open items in order.
  Apply 5 GUARD QUESTIONS before every response.
  Issue PROTOs in the sequence from FOUNDATION-COMPLETION-PLAN.md.
  Do NOT invent new work items not in the plan.
  Do NOT implement — write the core seed and relay to Sonnet.

[SONNET]:
  If a PROTO is active: build from the core seed.
  If no active PROTO: await Opus via Governor relay.
  Do NOT invent work. Do NOT start implementing without a PROTO.
  Run verify after every logical unit. Commit frequently.
```

---

## PART 6 — Common Failures and Fixes

| Failure | Root cause | Fix |
|---|---|---|
| Opus tab consuming 1M tokens implementing | No mechanical barrier; training default = be helpful by doing | Relay model box in startup block names specifically what Opus writes. Role self-check required before every response. |
| Startup block pasted to wrong tab | Block generated for Opus, pasted to Sonnet session (or vice versa) | Step 0 handoff validation catches identity mismatch before any work begins. |
| Stale PROTO status in startup block | Block written from memory, not from current git state | generate-startup-block.mjs derives session from git log + reads sonnet-turn.md |
| Sonnet deviating from core seed silently | PROTO didn't name anti-patterns; "working" felt sufficient | PROTO anatomy includes explicit anti-patterns field. Opus reviews actual files, not Sonnet's description. |
| New Sonnet tab re-doing already-done work | Previous Sonnet didn't commit before reporting COMPLETE | DONE = committed + pnpm verify exit_code=0. Not before. |
| Governor explaining same context every session | Context not captured in permanent files during the session | Every new insight or Governor clarification → vault entry within same session, same turn. |
| Alignment questions ignored in new tab | Treated as optional orientation | validate-handoff-completeness.mjs BLOCKS if ALIGNMENT QUESTIONS section is missing. |
| PROTO scope creeping silently | Sonnet expanded scope without flagging | Edge case 3 protocol: scope question written before expanding. Governor + Opus ratify. |
| Two PROTOs running simultaneously | Governor redirected without suspending active PROTO | Edge case 5: suspend + commit WIP first. One PROTO active at a time. Always. |

---

## PART 7 — PROTO Naming Conventions

| Format | When to use |
|---|---|
| `PROTO-[LETTER]` | Foundation completion PROTOs in planned sequence (A, B, C...) |
| `PROTO-[KEYWORD]-[N]` | Feature-specific PROTOs (PROTO-NORTHSTAR-1, PROTO-THRESHOLD-2) |
| `PROTO-[SESSION]-[N]` | Session-specific one-off PROTOs (PROTO-S061-1) |
| `PROTO-COURSE-CORRECT` | Correction directive from Opus after Sonnet deviation — includes revised core seed |
| `PROTO-EMERGENCY` | Urgent fix that blocks session close — requires explicit Governor directive to issue |

All PROTOs must be registered in `docs/plan/unified-plan.yaml` before execution begins.
A PROTO without a plan item is a side quest.
Side quests require explicit Governor ratification. No exceptions.

---

## PART 8 — Quick Reference Card

Cut this out. Know it cold.

```
┌─────────────────────────────────────────────────────────────────┐
│  NEW TAB QUICK SEQUENCE                                         │
├─────────────────────────────────────────────────────────────────┤
│  0. State role + ask Governor to paste to previous tab          │
│  1. Permission bypass (node -e ...)                             │
│  2. Read HANDOFF fully                                          │
│  3. Locate your position (Opus: sonnet-turn; Sonnet: core seed) │
│  4. Verify platform: git log + pnpm verify                      │
│  5. Write INTENT ABSORBED to sonnet-turn.md                     │
│  6. Begin work (Opus: design + PROTO; Sonnet: build from seed)  │
├─────────────────────────────────────────────────────────────────┤
│  PROTO QUICK CHECK (before issuing)                             │
│  □ Definition (intent, not description)                         │
│  □ Reasoning (which principle, why this approach)               │
│  □ Core seed (committed to repo, not in chat)                   │
│  □ Sonnet instructions (specific, ordered, anti-patterns named) │
│  □ Success criteria (specific evidence, not just exit_code=0)   │
│  □ Dependencies (what must exist before starting)               │
├─────────────────────────────────────────────────────────────────┤
│  RELAY CYCLE QUICK CHECK (before reporting COMPLETE)            │
│  □ All work committed                                           │
│  □ pnpm verify exit_code=0                                      │
│  □ sonnet-turn.md updated with ZF cycles                        │
│  □ Divergences from PROTO documented (or NONE stated)           │
│  □ Questions for other participant listed (or NONE stated)      │
└─────────────────────────────────────────────────────────────────┘
```

---

*PROTO-AND-TAB-TRANSFER-PROTOCOL v2.0 | S061 | Sonnet*
*v1.0: Initial protocol, separate Opus/Sonnet sections, no validation loop.*
*v2.0: Unified single source of truth. Part 0 Role Registry. Step 0 handoff validation loop.*
*Every section traces to a specific failure mode from CSPS sessions S051-S061.*
*Governor directive S061: "one source of truth, both participants, identical context, handoff validation."*
