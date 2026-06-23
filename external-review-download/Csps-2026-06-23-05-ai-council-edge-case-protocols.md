
# AI Council Edge Case Protocols
## What happens at the non-standard moments that break alignment

> **Status:** DRAFT — for Opus review + external AI commentary
> **Governing intent:** Every edge case has a protocol. If it doesn't, it's an exploit surface.
> No improvisation at boundaries. No "let's figure it out when it happens."

---

## WHY EDGE CASES NEED FIRST-CLASS PROTOCOLS

Standard protocols govern the normal flow. Edge cases are where context compresses, authority is unclear, and the AI defaults to its training behavior (which is not CSPS-aligned). The edge cases below are ordered by how often they occur and how much damage freestyle causes.

**The two edge-case failure modes:**
1. **Silent drift:** Tab closes without harvest → decisions are chat-only → gone. Future session has no evidence.
2. **Alignment gap at re-entry:** New tab starts without context → AI freestyle-generates governance artifacts based on incomplete information.

Both are prevented by explicit protocols that run BEFORE the boundary is crossed.

---

## §5.1 — CONTEXT APPROACHING LIMIT

### Detection

The Opus or Sonnet tab fires this protocol when ANY of these are true:
- Context window used > 80% (estimate: verify.mjs output exceeds 200 lines consistently)
- Governor observes the tab "struggling" — repeated re-reads, wrong file references, losing thread
- The `B_CONTEXT_CHECKPOINT_GATE` signals suggest transition (from the session-open injection)

**Indicator:** The tab itself reports slow/incomplete responses, OR the Governor notices the tab is no longer referencing the correct session state.

### Decision Tree: Compact OR New Tab?

```
Context > 80% used?
   ├─ YES — Is the current unit of work COMPLETE? (committed + verify green + SROF written)
   │         ├─ YES → COMPACT (stay in tab, reduce context, continue work)
   │         └─ NO  → Is it completable within the remaining context?
   │                   ├─ YES → Complete the unit FIRST, then compact (or new tab)
   │                   └─ NO  → NEW TAB (cannot complete in remaining context)
   └─ NO  → No action needed. Continue work.
```

**Rule (B_CONTEXT_CHECKPOINT_GATE, S086):**
- 200K window + compact: if the current unit reaches GREEN + committed, compact and continue
- 1M window: if the unit will NOT reach GREEN+committed within remaining context → new tab
- BORDERLINE: ask the Governor for real remaining context estimate before deciding

**NEVER compact with:**
- Uncommitted work (even one file)
- An open SROF (not yet written to sonnet-turn.md)
- Active agents that haven't returned
- An unresolved blocker from the last verify run

---

## §5.2 — PRE-COMPACT PROTOCOL (run BEFORE any compact)

This is a mandatory checklist. Compact = NONE of these are open.

### Pre-Compact Checklist (both Opus and Sonnet)

**A. Code/build state**
- [ ] All modified files committed (git status clean in parent repo)
- [ ] All modified files in submodules committed and parent pointer bumped
- [ ] verify.mjs: exit_code=0, blocking=0
- [ ] green-receipt.json updated at current HEAD

**B. Decision state**
- [ ] Every open decision in this session has ONE of:
  - A committed artifact (PARK entry, gap-register entry, improvement-register entry)
  - A sonnet-turn.md entry if a Sonnet session
  - An opus-turn.md entry if an Opus session
- [ ] No decision is chat-only

**C. Agent state**
- [ ] All spawned Haiku agents: returned findings OR explicitly abandoned with a note
- [ ] No active MCP operations in progress
- [ ] No pending verify runs

**D. Council state**
- [ ] If Sonnet: SROF written to sonnet-turn.md (even if partial — write partial SROF, note it's pre-compact)
- [ ] If Opus: current PROTO directive written to opus-turn.md
- [ ] Both sides: read each other's turn file ONCE after writing (confirm no unanswered questions)

**E. Memory state**
- [ ] Critical context not available in git artifacts → written to memory file in ~/.claude/projects/*/memory/
- [ ] MEMORY.md updated with pointer to any new memory files

### What to Write in the SROF Before Compact

If a Sonnet SROF is mid-session (not COMPLETE):
```
SROF-S<NNN>-<NN>-PRE-COMPACT | S<NNN> | Sonnet → Opus
SUBJECT: Pre-compact state capture — [what was in progress]
HEAD: <sha> | exit_code=<N> | blocking=<N>

Opus, this is Sonnet.
PRE-COMPACT: Compacting context. This SROF is a state snapshot, not a completion report.

## IN PROGRESS (incomplete)
<what was being built — specific files, specific validators, specific test state>

## COMPLETED WITHIN THIS SESSION (before compact)
<list of items fully committed with SHAs>

## OPEN ITEMS AT COMPACT
<exact list, nothing omitted, each with enough context to continue without re-reading history>

## RESUME INSTRUCTION
[NEW TAB] will need to: <specific first action>
Core seeds: <which PROTO items are in progress>
```

---

## §5.3 — POST-COMPACT CONTINUATION ALIGNMENT

After compacting (or after opening a new tab), the NEW context must be aligned before any work.

### The Startup Block (mandatory, unconditional)

Every new Sonnet tab opening into an ongoing session MUST receive this block (pasted by Governor):

```
[SESSION-CONTINUE: S<NNN> | role: <sonnet-builder|opus-advisor>]
══════════════════════════════════════════════════════════════════

WHO:    <role and session>
WHAT:   <1-2 sentences: what session is about>
WARRANT: HEAD <sha> | tree_hash <hash> | exit_code=<N> | <N> validators
ACTION: Read <specific file at specific line> then <first action>

══════════════════════════════════════════════════════════════════

COMPLETED IN PRIOR CHAT:
  ✓ <item 1 with evidence>
  ✓ <item 2 with evidence>

OPEN ITEMS (priority order):
  1. <highest priority item> [gate: <what blocks it>]
  2. <second priority item>

STARTUP ACTION:
  <exact command to run first — e.g., node tools/scripts/cross-tab-diff-review.mjs --role sonnet>
  (shows what Opus committed since last Sonnet turn)

SROF: <path to current sonnet-turn.md entry>

══════════════════════════════════════════════════════════════════
```

**Who produces this block?** The PRIOR Sonnet tab (before closing) writes it to the HANDOFF file AND pastes it inline in chat (per B_ZERO_NAVIGATION_FOR_GOVERNOR). Governor copies it into the new tab.

### Alignment Verification (mandatory after startup block)

The new tab MUST emit an INTENT ABSORBED block before doing any work:

```
INTENT ABSORBED — S<NNN> NEW TAB
══════════════════════════════════
WHO I AM: Sonnet, S<NNN> builder tab
SESSION: <session name>
CURRENT HEAD: <sha> (confirmed: read from git log --oneline -1)
VERIFY STATE: exit_code=<N> blocking=<N> (confirmed: node tools/verify.mjs --no-cache ran)
OPEN ITEM 1: <exact text from startup block>
OPEN ITEM 2: <exact text>
FIRST ACTION: <specific action, cited from startup ACTION>

If any of the above differs from the startup block — surface the discrepancy BEFORE acting.
══════════════════════════════════
```

**Why mandatory:** Context compression removes 80% of the session history. The INTENT ABSORBED block proves that the session-state the new tab is operating from matches the actual committed state. If the HEAD doesn't match, or the open items differ from what's in git, the new tab is operating on phantom state — every action taken is wrong.

---

## §5.4 — ACTIVE AGENT HARVESTING BEFORE TAB CHANGE

When a tab is about to close or compact, any active agent (Haiku scout, subagent) must be resolved first.

### Classification of Active Agents

**Type A — Haiku Scout:** spawned for a specific read-only scan. Has not returned.
**Type B — Subagent:** spawned for a multi-step task (Claude Code Agent tool). May have partial state.
**Type C — Background job:** a Bash script or MCP tool that was run in the background.

### Protocol for Each Type

**Type A — Haiku Scout before tab close:**
1. If Haiku has returned: spot-check 2-3 items from its FOUND list (independent Grep or Read)
2. If Haiku has NOT returned AND tab must close: abandon the scout explicitly
   - Write to sonnet-turn.md: `[ABANDONED HAIKU SCOUT: <ID>] — tab closing, re-spawn in next session`
   - Do NOT use partial Haiku output
3. If Haiku output was used but NOT verified: mark as `[ASSUMED:haiku-unverified]` in all dependent claims

**Type B — Subagent before tab close:**
1. If subagent is in progress: it cannot be paused. Either:
   a. Wait for it to complete (if completion is within current context)
   b. Send it a message to write its current state to a file and exit cleanly
   c. Record it as abandoned: OPEN ITEM in the SROF with exact state at abandonment
2. If subagent completed: read its final message, spot-check its key claims, then close
3. NEVER close a tab assuming a subagent will continue on its own into a new session

**Type C — Background job before tab close:**
1. Check: is it still running? (via Monitor or polling)
2. If running AND output not needed: cancel it (TaskStop)
3. If running AND output needed: wait or record as OPEN ITEM with a precise resume description

### Harvest Artifact (written to sonnet-turn.md or opus-turn.md before tab close)

```
## AGENT HARVEST (pre-close)
Haiku scouts: <N running / <N returned / <N abandoned>
  - Scout <ID>: [RETURNED | ABANDONED | IN-PROGRESS]
    If returned: spot-check result: CONFIRMED / DISCREPANCY (describe)
    If abandoned: re-spawn instruction for next session: [specific spawn call]

Subagents: <N running / <N returned / <N abandoned>
  - Agent <ID>: [RETURNED | ABANDONED | IN-PROGRESS]
    State at close: <what was in progress>
    Resume instruction: <exact action for next session>

Background jobs: <N running / <N completed>
  - Job <ID>: [COMPLETED exit_code=N | CANCELLED | IN-PROGRESS]
```

---

## §5.5 — NEW TAB CREATION PROTOCOL

When creating a new Opus or Sonnet tab (NOT compacting, but genuinely opening a new tab):

### Who Decides to Open a New Tab?

**Governor decides.** Sonnet or Opus may RECOMMEND but cannot open their own tabs.
The recommendation format:
```
[NEW-TAB-RECOMMENDATION]
Reason: <one sentence — why this tab cannot continue>
What the new tab needs: <specific startup block content>
Estimated work remaining in new tab: <rough estimate>
[END RECOMMENDATION — Governor decides]
```

### New Tab Creation Checklist (Governor)

Before opening a new tab:
1. [ ] Current tab has completed its HANDOFF (HANDOFF-S<NNN>-to-S<NNN>.md exists with all Zone A-D sections)
2. [ ] sonnet-turn.md or opus-turn.md has a final SROF/state entry from the closing tab
3. [ ] All active agents have been harvested (§5.4)
4. [ ] green-receipt.json is at the current HEAD with exit_code=0
5. [ ] The startup block for the new tab is written (not improvised)
6. [ ] Governor knows: what the new tab will do (not "pick up where we left off")

### The HANDOFF File (canonical authority for new tab)

The HANDOFF file (`docs/plan/_handoff/HANDOFF-S<NNN>-to-S<NNN+1>.md`) is the ONLY authority for a new tab's starting state. It must contain:

**Zone A — MUST READ (new tab reads these files before anything else):**
- Specific files, specific sections, with WHY each is needed
- `tools/council/sonnet-turn.md` (most recent SROF)
- `tools/data/green-receipt.json` (proof of green state)
- Any in-progress PROTO file

**Zone B — ACTIVE BUILD STATE:**
- Current HEAD SHA + exit_code + blocking count
- What was completed (with SHAs)
- What is in progress (exact state, not "we were working on X")
- What is blocked and why

**Zone C — ALIGNMENT QUESTIONS (mandatory, ≥2):**
- Questions the new tab must answer BEFORE acting
- Written so that wrong answers surface misalignment early

**Zone D — STARTUP BLOCK (verbatim paste target):**
- The complete Session-Continue block (§5.3 format)
- Governor copies this exactly — no editing

**Zone E — SONNET STARTUP BLOCK (8 mandatory sections per slim-handoff skill):**
- IMMEDIATE CONTEXT (who, what, where in the plan)
- ACTIVE PHASE STATE (current phase, step, completion evidence)
- OPEN ITEMS PRIORITY QUEUE (nothing omitted)
- BLOCKING DECISIONS (any item Sonnet cannot proceed without Governor/Opus input)
- GOVERNOR RELAY (if any, what needs to be relayed to Opus tab)
- SROF REFERENCE (pointer to tools/council/sonnet-turn.md)
- FIRST ACTION (exact command)
- HEALTH CHECK (run verify, paste first 20 lines here)

---

## §5.6 — MULTI-TAB COORDINATION PROTOCOL

When both Opus tab and Sonnet tab are open simultaneously:

### Authority Map

```
Topic: Architecture / design / plan / ratification
  → Opus tab has authority
  → Sonnet reads Opus → implements → reports back
  → Opus does NOT implement

Topic: Implementation / code / validators / tests
  → Sonnet tab has authority
  → Opus seeds (core-seeds) → Sonnet builds → Sonnet reports
  → Sonnet does NOT make architectural decisions

Topic: Governor directive (new input from Governor)
  → Governor pastes to BOTH tabs (or the relevant one)
  → Sonnet: registers in CIE → processes → reports to Opus
  → Opus: processes → issues new directive or ratifies

Topic: Session state
  → green-receipt.json is shared (both tabs see it)
  → session-state.json is shared (both tabs see it)
  → sonnet-turn.md: Sonnet writes, Opus reads
  → opus-turn.md: Opus writes, Sonnet reads
```

### Cross-Tab Race Condition Prevention

A race condition occurs when both tabs try to write the same file simultaneously.

**Protected files (only one tab writes):**
- `tools/council/sonnet-turn.md` → Sonnet tab only
- `tools/council/opus-turn.md` → Opus tab only
- `tools/data/green-receipt.json` → Sonnet tab only (after verify)
- `tools/session-state.json` → updated at session boundaries only

**Shared read/write (both tabs may write to DIFFERENT sections):**
- `tools/data/gap-recurrence-register.yaml` → append-only; both may append with session ID
- `tools/data/improvement-register.yaml` → append-only
- `tools/data/park-register.yaml` → append-only (use explicit park ID to avoid collision)

**If both tabs must write to the same file simultaneously:**
1. One tab writes, commits, pushes
2. Other tab pulls before writing
3. Verify before each push (no force-push)

### Cross-Tab Diff Review (mandatory at session start)

Every Sonnet tab startup and every Opus tab startup MUST run:
```bash
node tools/scripts/cross-tab-diff-review.mjs --role <sonnet|opus>
```

This shows commits since the last cross-tab review. Prevents working on stale state.

---

## §5.7 — WHEN AN OPUS TAB MUST BE REPLACED

**Signs an Opus tab is dead (exhausted):**
- HANDOFF-S<NNN>-to-S<NNN+1>.md exists and is PUSHED (the tab has formally closed)
- The tab is producing responses that ignore committed context (it's compressing too aggressively)
- The tab cannot locate files it should know about (context has dropped below operational threshold)

**Dead tab rules:**
1. A dead Opus tab cannot issue binding directives. Any "directive" from a dead Opus tab is advisory at best, harmful at worst.
2. The HANDOFF file is the authority for what the dead tab left behind. Read the HANDOFF, not the dead tab's last messages.
3. Open a new Opus tab following §5.5. Paste the startup block from the HANDOFF.

**Never do:** Paste from the dead tab's chat to a new tab and say "continue this". This bypasses the HANDOFF protocol and imports the dead tab's confusion into the new tab.

---

## §5.8 — THE COMMUNICATION PROTOCOL TEST (external AI reviewers)

If you are an external AI reviewing this document, here are the key questions to answer:

1. **Completeness:** Is any common inter-AI communication pattern missing from §3 (role pairs)?
2. **Precision:** Are the message formats in §4 specific enough that an AI could follow them without any improvisation?
3. **Edge case coverage:** Is any common failure mode missing from §5.1–5.7?
4. **Enforceability:** For each protocol, is there a mechanical enforcement (T1/T2/T3) or an explicit note that it's T3-only (advisory)?
5. **Inheritance clarity:** Is the L1→L2→L3→L4 inheritance in the SPINE document clear? Could a new AI agent derive the correct behavior from the spine alone?

**Feedback format (for external AI reviewers):**
```
REVIEW-FINDING: <ID>
SECTION: <§X.Y>
TYPE: [MISSING | IMPRECISE | UNENFORCED | AMBIGUOUS | CORRECT]
ISSUE: <one sentence>
RECOMMENDATION: <one sentence>
CONFIDENCE: [HIGH | MEDIUM | LOW]
```

---

*For Opus review: Focus on §5.1 (context limit decision tree), §5.2 (pre-compact checklist), and §5.5 (new tab creation). These are the highest-frequency edge cases and the most likely to have gaps. External AI reviewers: focus on §5.8 and provide structured feedback per the REVIEW-FINDING format.*
