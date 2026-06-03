---
id: csps.platform-intelligence.izfc-report
name: CSPS-Summary-on-IZFC-Completion-Standard-2026-06-03T1146Z
description: "Professional deep-dive report on IZFC (Iterative Zero-Finding Cycles) — the CSPS excellence-of-completion standard. Role, wiring, behavioral impact, and what breaks without it. Authored 2026-06-03."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: pillar_0_governance_leaves
authored_at: "2026-06-03T11:46:20Z"
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: izfc-memory, href: "C:/Users/finky/.claude/projects/c--Users-finky-Desktop-Claude-Code-Csps/memory/feedback_izfc_excellence_completion.md" }
  - { rel: nominal-rzf-detector, href: ../../tools/validators/validate-nominal-rzf-detector.mjs }
  - { rel: zf-cycle-format, href: ../../tools/validators/validate-zf-cycle-format.mjs }
  - { rel: injection-hook, href: ../../.claude/hooks/user-prompt-submit-next-step-reminder.sh }
---

# CSPS IZFC — Iterative Zero-Finding Cycles: Professional Report
**Authored: 2026-06-03T11:46Z | Session S078 | Governor-ratified behavioral moat**

> "Excellence-of-completion is the goal; honesty is its floor." — Governor S078

---

## 1. What IZFC Is

**IZFC (Iterative Zero-Finding Cycles)** is the CSPS excellence-of-completion standard for AI-generated claims. It is the discipline that ensures "DONE" means genuinely done — not "done because the AI decided it was done" or "done because the format was followed."

**Core definition:** A claim is complete when genuine examination from **independent angles** repeatedly finds nothing new. The process continues until a fresh sweep — from a new orientation — produces zero findings.

**Key terminology:**
- **IZFC** = the iterative process (Iterative Zero-Finding Cycles)
- **ZF** = Zero Findings achieved (the terminal state — kept as shorthand)
- **RZF** = RETIRED as of S078 (it was "Re-Zero Findings" = just "run IZFC until ZF"; redundant)

**IZFC is NOT:**
- A 2-step ritual (Cycle 1: find something, Cycle 2: confirm it, done)
- A format to replay ("Cycle 2: re-checked Cycle 1 area + 0 new findings")
- A count target (2 cycles is not inherently correct; 7 cycles is not inherently excessive)
- A honesty check (honesty is the FLOOR, not the GOAL)

---

## 2. Why IZFC Matters — The Problem It Solves

### 2.1 The AI Completion Default

AI training instills powerful defaults that make DONE declarations premature:
- **D4 Pattern-match**: "This looks like a completion pattern → declare done"
- **D1 Eager-helpfulness**: "User needs a quick answer → minimize cycle count"
- **D7 Action-bias**: "Generating output is better than prolonged checking"
- **Confirmation bias**: Work just done feels correct; the psychological cost of checking is higher than the cost of being wrong

The result: AI systems default to 2-cycle patterns because 2 cycles satisfies the format requirement while minimizing generation cost. The second cycle becomes ritual re-verification (checking the same area as Cycle 1) rather than genuine fresh examination.

### 2.2 What "Nominal IZFC" Looks Like (The Failure Mode)

```
ZF Cycle 1: Found that [X is missing]. Fixed it.
ZF Cycle 2: Re-examined [X] — confirmed fix applied, 0 new findings.
ZF Status: ZF ACHIEVED.
```

This is NOMINAL. Cycle 2 re-examines Cycle 1's area (re-verification, not a new cycle). There was never a fresh sweep of a different area. The AI stopped because 2 cycles felt complete, not because a genuinely new examination produced nothing.

### 2.3 Evidence from CSPS Platform History

**gap_ZF_NOMINAL_CYCLES** (k=6): This gap was independently discovered 6 times across sessions S037, S040, S046, S050, S052, S053. Each session saw the AI using nominal ZF patterns. The structural fix (`validate-zf-cycle-format.mjs`) catches the output-layer pattern but couldn't change the AI's generation-time behavior. IZFC, hardwired in the per-turn injection, changes behavior at the source.

**S077 IZFC ratification trigger**: Governor caught the AI doing exactly 2 cycles every single turn, regardless of the work's complexity. The per-turn injection was updated from "RZF BEFORE RESPONSE MANDATE" (which the AI pattern-matched to a 2-cycle template) to the full IZFC governing-intent text.

---

## 3. What Happens Without IZFC

### 3.1 Immediate Consequences

| Without IZFC | Observable Symptom |
|-------------|-------------------|
| Premature DONE claims | Closed items re-open next session |
| Ritual 2-cycle ZF | No genuine finding discovery; format compliance without substance |
| "Obvious completion" stops | Exactly when deeper checking is needed, the AI stops |
| Pattern-matched format | AI uses "ZF Cycle 1/2" as a template, not a genuine examination |
| False governance coverage | Validators pass but the underlying work is incomplete |

### 3.2 Platform-Level Consequences

When IZFC is nominal (format without substance), the entire verification chain becomes unreliable. DONE claims in closing-summaries cannot be trusted. Session-state.json "mechanism-complete" flags are hollow. The gap register's "behavioral_test_exists: true" entries may have been validated by nominal ZF cycles.

In a 30-app platform, nominal completion carries forward. App#1 ships with a schematic issue that a genuine ZF sweep would have caught. App#2 inherits it. App#30 has compounded the error across the entire foundation.

### 3.3 The Specific Failure Pattern Caught in S077-S078

The AI's turn-discipline injection contained:
```
Format: "ZF Cycle 1: [finding]. Cycle 2: [re-checked finding 1 area + 0 new]. Status: ZF ACHIEVED."
```

The AI pattern-matched to this format. Every single substantive turn ended with exactly:
- Cycle 1: one finding
- Cycle 2: "re-examined Cycle 1 area" + 0 new findings
- ZF ACHIEVED

The format was complied with (named what was re-examined). The substance was absent (never a genuinely new area). The AI stopped because the pattern felt complete, not because a new sweep found nothing.

---

## 4. Full IZFC Wiring

### 4.1 Per-Turn Injection (Primary Hardwire)

**Surface**: `user-prompt-submit-next-step-reminder.sh` enforcement #6

**Fires**: Every single user prompt, before any AI generation

**Content** (verbatim):
```
IZFC — Iterative Zero-Finding Cycles (completion standard; Governor S078; RZF term retired):
A claim is complete when examination from independent ANGLES repeatedly finds nothing new.
Excellence-of-completion is the goal; honesty (no inventing/assuming/papering-over) is its floor.
Each cycle = one fresh sweep from a new orientation; continue until a new sweep finds nothing.
COUNT IS MEASUREMENT — it may be 1 or 7, never a target. Re-checking the prior-cycle area
is NOT a new cycle (this is re-verification). Examples in feedback_izfc_excellence_completion.md
are SAMPLES to reach the essence — NEVER a template to replay. Nominal failure: same count
every turn, or "0 new" without naming the fresh angle swept, or stopping because completion
felt obvious — that feeling is the trigger to look harder, not to stop.
```

**Why this surface matters**: This injection fires before every AI response. It's not a memory entry (loaded once at session start and potentially compressed). It's not a hook that fires only on code commits. It fires at generation time, competing directly with the D4 pattern-match default.

### 4.2 Memory Layer (Session-Persistent Reference)

**File**: `~/.claude/projects/.../memory/feedback_izfc_excellence_completion.md`

**Contents**:
- IZFC essence
- 5 sample orientation angles (claim-vs-evidence, cross-impact, governing-intent, skeptic's-challenge, forward-state)
- 5 self-audit questions
- Preserved Governor quotes
- Terminology map (IZFC/ZF/retired RZF)
- Links to rigid-definition-drift and cycle-count-measurement memories

**Note**: Sample angles are explicitly labeled SAMPLES. The memory stresses they are NOT a checklist to replay — that would recreate the same rigid-pattern problem.

### 4.3 Validator Layer (Output Audit)

| Validator | What It Detects | Severity |
|-----------|----------------|---------|
| `validate-nominal-rzf-detector.mjs` | Detects "0 new findings" without naming what was examined; same-count-every-turn patterns | BLOCKING |
| `validate-zf-cycle-format.mjs` | ZF block must appear in council files (sonnet-turn.md, opus-turn.md) not just chat; must contain specific findings | BLOCKING |
| `validate-rzf-evidence-gate.sh` (PreToolUse) | Blocks tool calls when IZFC evidence is absent from current response before a DONE claim | BLOCKING |

**Important**: These validators audit OUTPUT (what the AI wrote). The per-turn injection audits GENERATION (what the AI is about to do). Both are needed — the injection prevents nominal cycles; the validators catch when the injection was bypassed.

### 4.4 Hook Layer (Real-Time Enforcement)

| Hook | Trigger | Effect |
|------|---------|--------|
| `pre-tool-use-rzf-evidence-gate.sh` | Before any Write/Edit/Bash | Blocks if no IZFC evidence visible in current session response |
| `post-stop-rzf-reminder.sh` [CRITICAL] | After AI stops generating | Reminds AI to include genuine IZFC sweep if response contained substantive claims |
| `post-stop-directive-rzf-gate.sh` | After AI stops | Checks that any directive-response included IZFC |
| `post-tool-use-zf-level-gate.sh` | After tool calls | Level-checks ZF depth appropriateness for claim complexity |

### 4.5 Gap Register (Deferred Obligation)

**gap_IZFC_COMPREHENSIVE_RENAME** (registered S078):
- Every ZF/RZF semantic reference in docs, principles, behavioral-contracts, AGENTS.md, memories → updated to "IZFC discipline" alias
- Hook filenames unchanged (validate-nominal-rzf-detector.mjs etc.) but each gets IZFC header comment
- Completeness: grep audit = 0 un-aliased stale references
- Deadline: **2026-07-01**
- Escalation: overdue+14d → auto-K2 (blocks new work) → K3 (session blocks)

---

## 5. IZFC in the Context of Platform Quality

### 5.1 The Five Self-Audit Questions

These are the questions that should fire internally before any IZFC claim:

1. Did each sweep examine a **genuinely different angle** — or re-check the same one more carefully?
2. Is termination **earned** (a fresh sweep actually hit zero) or **assumed** (I felt done)?
3. Is every finding tied to **specific evidence** (file:line / tool output / named validator)?
4. Did the **governing intent** survive — does the output do what we set out to do?
5. What **breaks in the next step** if I'm wrong — and did I check it?

### 5.2 Sample Examination Orientations

Not a sequence — independent lenses applied until nothing new emerges:

| Orientation | Question |
|------------|---------|
| Claim vs evidence | Does this claim cite tool output from THIS response, not memory? |
| Cross-impact | What did I touch that I didn't explicitly verify? |
| Governing intent | Does the output actually accomplish what we set out to do? |
| Skeptic's objection | What is the strongest argument against this being done? |
| Forward-state risk | What breaks in the next step if this is wrong? |

### 5.3 The Distinction: Excellence vs Honesty

**Honesty** (floor): "I am not inventing, assuming, or papering-over gaps."
**Excellence-of-completion** (goal): "I have genuinely exhausted the space of what could still be wrong or missing."

A technically honest answer can still be incomplete. IZFC requires the higher standard.

---

## 6. Governor Ratification Record

**Ratified**: S078, 2026-06-03  
**Motivation**: Rigid 2-cycle pattern caught across all substantive turns of S077  
**Decision**: Adopt IZFC as governing concept; retire RZF term; keep ZF as terminal-state shorthand; no file renames; inject governing-intent text per-turn  
**Moat surfaces engaged**: Per-turn injection (behavioral), memory (session-persistent), gap register (deferred rename obligation)
