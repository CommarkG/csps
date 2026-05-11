# OPUS MODE BRIEF — [arc name] — S[NNN]
## Written by: OPUS-[N] ([model] in Opus-designated advisor mode)
## For: Sonnet Builder tab
## Authority: Governor ratification [date]
## Council type: mini | core | external (if applicable)

---

> **How to use:** Read top to bottom. Follow section order. Paste all evidence blocks.
> Do not skip §IMMEDIATE. Do not skip evidence gates.

---

## PART A — Ratified Decision Register

All decisions ratified by Governor. Zero open questions before implementation begins.

| Q# | Decision | Ratified Value | Notes |
|---|---|---|---|
| Q-01 | | | |

**Governor's binding qualifiers:**
[Any runtime constraints that apply to every step]

---

## PART B — Flexibility Architecture

Every Part A value is encoded in config here.
**Rule:** changing a value = one line in one file. Zero hardcoded business rules.

```typescript
// File: libs/config/[name].config.ts
// [content]
```

---

## PART C — Session [N] Spec

### Pre-flight
```
PRE-FLIGHT — Session [N]: [name]
══════════════════════════════════════════════════════
Scope:    ~[N] files | [what it delivers] | ~[time]
Context:  ~[N]K tokens — safe | /compact before starting

Q-GATE:      pnpm verify exit_code=0 → CONFIRMED (run it)
Q-SCOPE:     Completion-mode — no additions outside this spec
Q-GLOBAL:    [platform-level / app-level — cite which]
Q-INITIATED: Governor-directed ✓

QUESTIONS: [N] — [list] | 0 — all decisions ratified
══════════════════════════════════════════════════════
```

### Steps

**STEP [N]a: [name]**
```typescript
// [exact code or bash commands]
```

Why: [one sentence — the non-obvious reason]

**STEP [N]b: [name]**
[continue...]

### Verification
```bash
pnpm verify
```
PASTE output. Must be exit_code=0.

### Evidence Gates (mandatory — paste all before declaring session complete)
```
[S[N]-E1] [what to paste and where to get it]
[S[N]-E2] [what to paste]
```

---

## PART [N+1] — Immediate Mechanical Actions

Do these BEFORE writing any code.

**IMM-1: [action]**
File: [path]
Change: [exact change]

---

## PART [N+2] — Flexibility Map

| When feedback arrives | Edit this file | Change this |
|---|---|---|
| "[feedback type]" | `[file path]` | `[field]: [old] → [new]` |

---

## RZF VERIFICATION (if this is a Core Council brief)

Before this brief is considered complete, Opus must run RZF:
```
Cycle 1: What did this brief miss?
Cycle 2: [findings from cycle 1 resolved]
...
Cycle N: 0 new findings → RZF ACHIEVED
```

Cycle count: [N] | Final status: ZF ACHIEVED | Gaps surfaced: [N]

---

*OPUS MODE BRIEF complete.*
*Sonnet: follow §IMMEDIATE first, then §FLEX, then §SESSION in order.*
*Paste all evidence. Don't skip gates.*
*[model] in Opus-designated advisor mode | [date]*
