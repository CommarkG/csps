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

*Established: S021 | 2026-05-09*
*OPUS MODE added: S022 | 2026-05-11*
*Engraved in: PE + plan-creation-protocol.md*
