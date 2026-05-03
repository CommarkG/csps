---
name: pcr
description: When the user asks for help with a non-trivial decision OR proposes more than one option, produce canonical Pros / Cons / Recommendation 3-block markdown. Skip on trivial-reversible per P-OP-003 counterweight. Triggers on "should we...", "X vs Y", "which option", "decide between", multi-option proposals.
allowed_tools: []
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: []
sensitive_data_access: false
backed_by_principle: P-OP-003
generated_by: principles-codegen
generated_from: packages/principles/principles.yaml#P-OP-003
last_generated_at: 2026-05-03T08:30:00Z
references_future_artifact: true
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
---

# /pcr — Pros / Cons / Recommendation

## When to invoke

When the user asks for help with a non-trivial decision OR proposes more than one option:
- Architectural choices ("should we use X or Y?")
- Tool / library selection
- Scope / phasing decisions
- Migration strategies
- Anything reversible-with-cost > trivial

## When to skip

Per P-OP-003 counterweight: trivial-reversible decisions (two-way doors at low cost). Examples:
- Variable naming when both names are clear
- Comment phrasing
- File location when both paths are obviously valid
- Color choices in a draft

When skipping, just decide. Don't waste cycles on PCR for things that don't deserve it.

## Output format

3 blocks, in this order:

```markdown
## Options considered
| # | Option | One-line summary |
|---|---|---|
| A | <name> | <summary> |
| B | <name> | <summary> |

## Pros / Cons per option

### Option A — <name>
**Pros:**
- <pro 1>
- <pro 2>
**Cons:**
- <con 1>
- <con 2>

### Option B — <name>
[same format]

## Recommendation

**Choose: <Option X — name>**

**Reasoning:** <2-4 sentences. Address the trade-off explicitly. Cite the load-bearing factor.>

**What would change my recommendation:** <1-2 sentences identifying the assumption that, if false, would flip the recommendation>
```

## Discipline rules

1. **Pros/Cons before Recommendation** (BLUF: bottom line up front, but the trade-space is what makes the recommendation legible — per AGENTS.md hard NO)
2. Pros and cons must be NON-symmetric where possible — symmetric lists ("A is fast / B is slow" + "B is correct / A is incorrect") signal lazy analysis
3. Recommendation must NAME the load-bearing factor (the one variable that drove the decision)
4. "What would change my recommendation" forces explicit assumption-surfacing — protects against silent-criteria-shift later

## Industry lineage

- Toyota A3 (single-page decision document)
- Amazon working-backwards memo
- US military Mission Command (commander's intent + decision matrix)

## Backed by

P-OP-003 (PCR) — the decision-presentation operating principle. Full text in [packages/principles/principles.yaml#P-OP-003](../../principles/principles.yaml).
