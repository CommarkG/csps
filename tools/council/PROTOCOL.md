# CSPS Multi-Model Council Protocol
## File-Relay Communication Between Opus Advisor and Sonnet Builder

---

## The Setup

Two Claude Code tabs run simultaneously:
- **Opus Advisor tab** — strategic/architectural role. Designated for consequential decisions, architecture review, plan maturity assessment. Does NOT implement.
- **Sonnet Builder tab** — implementation role. Executes specifications, has implementation session context. Does NOT make strategic decisions alone.

The Governor triggers each turn by pasting one line. Both tabs share the same filesystem.

---

## File Relay Infrastructure

```
tools/council/
  PROTOCOL.md          ← this file (the governing protocol)
  council-state.json   ← current council status, whose turn, consensus reached
  opus-turn.md         ← Opus writes here when its turn ends
  sonnet-turn.md       ← Sonnet writes here when its turn ends
```

---

## How a Council Turn Works

### Starting a Council (Governor initiates)

Governor pastes to Opus tab:
```
Council needed for: [topic]. Write your position to tools/council/opus-turn.md, then tell me you're done.
```

Governor pastes to Sonnet tab:
```
Read tools/council/PROTOCOL.md, then read tools/council/opus-turn.md and write your response to tools/council/sonnet-turn.md.
```

### Subsequent Turns

Governor pastes ONE LINE to the other tab:
```
Council turn [N] — read tools/council/[other]-turn.md and respond to tools/council/[your]-turn.md.
```

### Ending the Council (Governor calls consensus)

When both positions are aligned or a Governor decision resolves the gap:
```
Governor updates council-state.json: status → "consensus-reached"
```

---

## Turn Format

**Opus turn file (`opus-turn.md`):**
```
# Opus Turn [N] — [Topic]
Position: [clear statement]
Reasoning: [why]
Where Sonnet was right (if applicable): [honest acknowledgment]
Open questions for Sonnet: [specific questions]
```

**Sonnet turn file (`sonnet-turn.md`):**
```
# Sonnet Turn [N] — [Topic]
Position: [clear statement]
Reasoning: [why, especially from implementation experience]
Corrections to Opus plan: [specific technical gaps]
Agreement with Opus: [where Sonnet concurs]
```

---

## Priority Engine Integration

The council is a governance mechanism integrated into PE sequencing:

- **Trigger condition:** any plan with `council_required: true` in frontmatter blocks implementation until `council-state.json.status = "consensus-reached"`
- **PE weight:** council sessions score 2.0× multiplier in the governance-mode composition (governance-mode prioritizes resolution)
- **PE band:** council sessions are always CRITICAL band when active

---

## Planning Protocol Integration

Every consequential plan (PEG/BPG/PIA trigger class) must:
1. Check `tools/council/council-state.json.status` — if any council is `in-progress`, resolve it before new implementation
2. Include `council_required: true | false` in plan frontmatter
3. If `council_required: true` and no council has run: block implementation (validates in `validate-no-implementation-without-plan.mjs`)

---

## One-Line Trigger Templates (Copy-Paste Ready)

**To start a new Opus turn:**
```
New council — write your position on [topic] to tools/council/opus-turn.md
```

**To send Opus turn to Sonnet:**
```
Council turn [N] — read tools/council/opus-turn.md, respond to tools/council/sonnet-turn.md
```

**To send Sonnet turn to Opus:**
```
Council turn [N] — read tools/council/sonnet-turn.md, respond to tools/council/opus-turn.md
```

**To reach consensus:**
```
Council consensus reached — update council-state.json status to consensus-reached and proceed with implementation
```

---

## Role Boundaries (Permanent)

| Role | What it does | What it does NOT do |
|---|---|---|
| Opus Advisor | Architecture review, strategic sequencing, plan critique, domain taxonomy | Implement code, run validators, push to git |
| Sonnet Builder | Execute specs, run pnpm verify, push commits, surface implementation gaps | Make unilateral architectural decisions |
| Governor | Triggers each turn, ratifies VLTs, resolves disagreements, has final say | Is replaced by either AI |

The Governor's trigger is not friction — it is governance. Each trigger is a chance to redirect.

---

---

## OPUS MODE (Formal Operating Protocol — Added S022)

**OPUS MODE** is the standard protocol for Opus-to-Sonnet architectural handoff.
It converts ad-hoc Opus review into a structured, repeatable format.

### Three Modes

| Mode | Opus produces | Sonnet does |
|---|---|---|
| `OPUS REVIEW` | Findings + gap list + risk assessment | Read findings, implement fixes |
| `OPUS DECISION` | PCR table (Pros/Cons/Rec per decision) | Read Rec column after Governor ratifies |
| `OPUS BRIEF` | Full implementation brief (8-part format) | Follow top to bottom, paste all evidence |

### OPUS MODE BRIEF — 8-Part Format (always in this order)

```
Part A: Ratified Decision Register     (Q# table — source of truth for all values)
Part B: Flexibility Architecture       (config files — all values here, nowhere else)
Parts C-N: Session Specs               (pre-flight + steps + evidence gates per session)
Part N+1: Immediate Mechanical Actions (what Sonnet does BEFORE any code)
Part N+2: Flexibility Map              (feedback type → file → line to change)
End: Governor's binding qualifiers     (runtime constraints applying to every step)
```

Template: `tools/council/opus-brief.template.md`

### Sonnet Operating Rule

Before starting any session:
1. Check `tools/council/opus-turn.md` — if newer than `tools/session-state.json`, read it first
2. If opus-turn.md contains an OPUS BRIEF, read it completely before doing anything else
3. If opus-turn.md references a `sonnet-brief-*.md` file, that file IS the brief — read it

### Activation

Governor types `OPUS-[N]` in Opus tab → Opus declares mode + focal point → produces output to `opus-turn.md` → Governor pastes one-line trigger to Sonnet tab.

---

---

## MANDATORY COMMUNICATION PROTOCOL (Added S023 — Zero Freestyle)

> **Why this section exists:** During S022-S023, Opus wrote briefs based on assumed state,
> Sonnet implemented different things, chat-jumps were wrong, and the Governor had to shuttle
> corrections. Root cause: no enforced handshake between turns. This section closes that gap.

---

### The Non-Negotiable Turn Sequence

```
BEFORE Opus writes a new turn:
  1. READ tools/council/sonnet-turn.md — what did Sonnet actually do last?
  2. READ tools/session-state.json — what session is active?
  3. READ git log --oneline -3 — what was actually committed?
  PROHIBITION: Opus may NOT write a new turn without completing steps 1-3.
  Writing direction based on assumed state = the source of all previous failures.

BEFORE Sonnet executes anything from Opus output:
  1. WRITE INTENT ABSORBED block to tools/council/sonnet-turn.md (not just chat)
  2. Governor reviews the block — can redirect before any file edit
  3. Execute only after implicit or explicit Governor acknowledgment
  PROHIBITION: Sonnet may NOT edit a file before writing INTENT ABSORBED to sonnet-turn.md.

AFTER Sonnet completes a session:
  1. WRITE SONNET REPORT to tools/council/sonnet-turn.md (append, don't overwrite)
  2. Report format below — required fields, no optional sections
  3. Commit and push before session is considered closed
  PROHIBITION: A session without a SONNET REPORT is incomplete regardless of verify status.
```

---

### Required Sections — Every Opus Turn

```markdown
# Opus Turn [N] — [Topic] — Session: S[NNN]

## State at Writing
Platform session: S[NNN] | Validators: [N] | Last commit: [sha and message]
Sonnet last reported: [session + what they did — from sonnet-turn.md]
If this differs from what I assume below: Sonnet report takes precedence.

## [Findings / Direction]
[substantive content]

## Tier 1 (this Sonnet session — complete these before closing)
1. [Specific item with file path]
2. [Specific item with file path]

## Tier 2 (defer to next session)
1. [item]

## Prohibited (explicit list of what Sonnet must NOT do)
- [specific prohibition]

## RZF VERIFICATION
Cycles run: [N] | Gaps: [N] | Status: ZF ACHIEVED / NOT ACHIEVED
```

---

### Required Sections — Every Sonnet Session Start

Write to `tools/council/sonnet-turn.md` BEFORE any file edit:

```markdown
# Sonnet Session S[NNN] — INTENT ABSORBED

## Opus Turn Read: Turn [N] (written when platform was at S[NNN], [N] validators)

## Task Understanding (one sentence per Tier 1 item)
1. [Item]: [what I understand this means]
2. [Item]: [what I understand this means]

## Why this matters (Layer 3)
[The platform goal this serves — not just the task]

## Constraints understood
- [what NOT to do]
- [what's deferred]
- [protected paths to present-diff-first on]

## First action
[Specific first step]

**Governor: if any of the above is wrong, correct now before I edit any file.**
```

---

### Required Sections — Every Sonnet Session Close

Append to `tools/council/sonnet-turn.md` BEFORE writing HANDOFF:

```markdown
# Sonnet Report — S[NNN] Close

## Done (commit sha per item)
1. [Item]: DONE | commit: [sha] | verified: [grep output or validator name]
2. [Item]: DONE | commit: [sha]

## Differs from Opus spec (honest delta)
- [What was different and why]
- "None" if spec was followed exactly

## Deferred (with reason)
- [Item]: deferred because [reason]

## State at close
Validators: [N] | ZF status: [status] | Push: [sha]

## What Opus should know for next turn
[Anything discovered during implementation that Opus should factor in]
```

---

### The Governor's Trigger Templates (Updated)

**To activate Opus tab:**
```
OPUS-[N]: [topic or directive]
```

**To send Opus output to Sonnet (new chat):**
```
Paste the full contents of tools/council/[chat-jump-file].md
```

**To send Sonnet report to Opus:**
```
Opus: read tools/council/sonnet-turn.md, then [directive]
```

**To close a session from Opus tab:**
```
Opus: generate the S024 chat-jump file at tools/council/chat-jump-S024.md
```

---

### Prohibited Patterns (Zero Freestyle)

| Prohibited | Why |
|---|---|
| Opus writing new turn without reading `sonnet-turn.md` | Writes direction based on assumed state — root cause of chat-jump failures |
| Sonnet executing without writing INTENT ABSORBED to `sonnet-turn.md` | Governor loses intervention window before file edits |
| Sonnet assuming Opus brief is current without checking session | Stale briefs cause wrong implementations |
| Opus claiming Sonnet should do X without checking if X is already done | Duplicate work and confusion |
| Either AI using "I understand" without showing the understanding explicitly | Performed consensus — P-META-022 AI-to-AI violation |
| Chat-jump written without reading the latest HANDOFF file | Same stale-state problem |
| Session closed without SONNET REPORT in `sonnet-turn.md` | Opus has no verified state for next turn |

---

### Mechanical Enforcement

**Validator:** `validate-opus-turn-rzf.mjs` — already active. Checks `## RZF VERIFICATION` in opus-turn.md.

**Missing and needed (next Sonnet session):**
- `validate-sonnet-report.mjs` — checks that sonnet-turn.md has a `# Sonnet Report` section for the current session. ADVISORY now, BLOCKING week-4.
- `validate-intent-absorbed.mjs` — checks that sonnet-turn.md has an `# ... INTENT ABSORBED` section before the report. ADVISORY now.

**S029 GAPS IDENTIFIED (Governor directive — mechanically fix these):**
1. `session-open.sh` must check opus-turn.md modification time vs last session close timestamp. If newer → surface "⚠ Opus Turn [N] not yet read by Sonnet — read before proceeding" BEFORE any task work.
2. A `pre-tool-use` hook should detect L1/L2 consultation triggers:
   - Write/Edit to `libs/policies/schema.zmodel` → emit "L2 required before schema changes"
   - Write/Edit to `*.zmodel` pattern with `@@allow` content → emit "L1 security policy — flag for Opus"
   - Write/Edit to `principles.yaml` → emit "L2 required"
3. Sonnet must append `## L1 ITEMS FOR OPUS` to `sonnet-turn.md` at end of any turn with a consequential decision. Governor sees it, one-line trigger to Opus tab activates.
4. Opus insight extraction pipeline: every INTENT ABSORBED block must cascade decisions to: principles.yaml (ratified principles) + external-integrations/ (security/config findings) + SROF-NNN (scale findings).
5. Band A ENH items (SROF-012 §7) are `council_required: true` — Opus must review before Sonnet implements ENH-001 through ENH-004.

**council-state.json tracking fields to add:**
```json
"sonnet_last_report_session": "S023",
"opus_last_turn_session": "S023",
"sonnet_last_intent_absorbed": "S024 opening"
```

---

---

### Consultation Levels (Opus Turn 9 S025 — ratified)

| Level | Name | Trigger | Format |
|---|---|---|---|
| L0 | Virtual Opus Audit | Every consequential decision | 5-question self-check (question-protocol.md) |
| L1 | Express Review | PE > 90 new items not in arc plan; new P-META-*; Grade A template; Virtual Audit returns "I don't know" | EXPRESS block below |
| L2 | Full Advisory | depth-5; L1 changes; Core Spine; Foundation schema; contradicts sealed contract | Full Opus Turn format |
| L3 | Council Seal | Constitutional changes; new Core Spine category; contradicts sealed principles | L2 + Governor + ZF Level 3 |

**L1 Express Review Format (max 5 lines, batch-able):**

```markdown
## EXPRESS — [topic name]
Verdict: ✅ Pass | ⚠ Advisory | ❌ Block
Reasoning: [1-2 sentences]
Action: [one specific action, or "none"]
```

Five fields required before requesting express (missing any → escalate to L2):
```yaml
needs_express_review:
  - topic: [name]
    decision: [what is being decided]
    options: [A / B / C]
    blast_radius: local | module | platform | external
    recommendation: [which option + one sentence why]
```

**Sonnet adds this to sonnet-turn.md SONNET REPORT when L1 items exist.**

---

*Established: S021 | 2026-05-09*
*OPUS MODE added: S022 | 2026-05-11*
*Mandatory Communication Protocol added: S023 | 2026-05-11*
*Zero-freestyle enforcement: no turn without verified prior state*
*Consultation levels L0-L3 + Express format added: S025 Opus Turn 9*
