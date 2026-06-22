---
id: csps.docs.plan.pillar-0-governance.context-checkpoint-gate
name: context-checkpoint-gate
description: "B_CONTEXT_CHECKPOINT_GATE — 3-way assessment checklist: window = checkpoint-ability, not size. Ratified S087 PROTO-S087-CONTEXT-CHECKPOINT-GATE."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: behavioral_contracts
diataxis_type: reference
impl_status: swift-implemented
last_updated_session: S087
last_updated: "2026-06-22"
csps_enforces: B_CONTEXT_CHECKPOINT_GATE PROTO-S087-CONTEXT-CHECKPOINT-GATE
prevention_class: OVER-CONTEXT UNDER-COMPACT COMPACT-ON-UNCOMMITTED-STATE
applies_to:
  - Opus (director)
  - Sonnet (builder)
  - Haiku (scout, when spawned for multi-step work)
links:
  - { rel: agents-md-entry, href: ../../../AGENTS.md }
  - { rel: opus-entry-point, href: ../../../tools/council/opus-context.md }
  - { rel: sonnet-entry-point, href: ../../../tools/council/sonnet-context.md }
  - { rel: haiku-entry-point, href: ../../../tools/templates/haiku-spawn-template.md }
  - { rel: backstop-validator, href: ../../../tools/validators/validate-agent-inheritance-parity.mjs }
---

# B_CONTEXT_CHECKPOINT_GATE — Context Checkpoint Checklist

**Governing intent:** Window size is never the metric. Checkpoint-ability is.
A 200K window that completes a green+committed unit beats a 1M window that leaves build state
uncommitted. Cache-miss cost (1M) is acceptable; uncommitted state at compact is NOT.

---

## THE RULE (verbatim ratified intent)

```
Window choice = checkpoint-ability, not size.
  • Unit reaches green+committed+pushed within window → 200K + harvest-before-compact.
  • Single indivisible unit > 200K → 1M (accept one cache-miss).
  • Borderline/uncertain → AI MUST ASK Governor for real remaining context (sanctioned, not failure).
  • NEVER compact on uncommitted build state.
  • BOTH roles assess at: build-unit start + as window fills + before any compaction.
```

---

## 3-WAY ASSESSMENT CHECKLIST

Fire this at THREE moments:
1. **Build-unit start** — choose the window before loading context
2. **As window fills** (every ~25% consumed) — re-assess; escalate if borderline
3. **Before any `/compact`** — hard gate; uncommitted state blocks compaction

### Assessment questions (answer all three):

| Question | YES → | NO → |
|----------|-------|-------|
| Can this build unit reach green+committed within 200K? | Use 200K | → Q2 |
| Is the unit truly indivisible (cannot be split at a meaningful checkpoint)? | Use 1M | Split the unit |
| Is the window genuinely uncertain / borderline? | ASK Governor | Proceed with decision |

### Decision tree

```
Is context window borderline or uncertain?
  YES → ASK Governor: "What is my real remaining context?" (sanctioned escape — not failure)
  NO  ↓

Can unit reach green+committed in 200K?
  YES → 200K + harvest-before-compact (harvest first, then /compact)
  NO  ↓

Is unit truly indivisible?
  YES → 1M (accept cache-miss; still harvest before compact)
  NO  → Split: find the largest sub-unit that fits in 200K; checkpoint there first
```

---

## ASK-GOVERNOR ESCAPE (sanctioned)

When borderline: the AI cannot accurately measure its own remaining context window.
Asking Governor for the real count is **the correct action**, not a failure of judgment.

**Format:**
```
⚑ CONTEXT-GATE: I need your help on window choice.
   Current task: [unit name]
   Estimated remaining context: [my best guess — unreliable]
   What is my actual remaining context? (Check Claude Code token counter / status bar)
   If < 80K remaining: I recommend switching to 1M for this unit.
   If > 80K remaining: I'll continue in the current window with harvest-before-compact.
```

Governor checks the Claude Code context counter and replies with the actual number.

---

## HARVEST-BEFORE-COMPACT PROTOCOL

**NEVER `/compact` without completing this harvest first:**

1. **Verify state:** confirm `git status` is clean (all changes committed)
2. **If uncommitted:** `git add -A && git commit` BEFORE compacting. No exceptions.
3. **Write harvest artifact:** update `tools/council/sonnet-turn.md` with current SROF status
4. **Write to HANDOFF or session artifact** if this is a session boundary
5. **THEN** `/compact` — only after all the above

**BLOCKING condition:** uncommitted changes + `/compact` request = STOP. Surface the conflict.
Fix: commit first (or explicit Governor override to discard changes).

---

## INTEGRATION POINTS

| Surface | Where it appears |
|---------|-----------------|
| T5 AGENTS.md hard-rule | Line ~181: B_CONTEXT_CHECKPOINT_GATE entry |
| T4 Behavioral contract | This file (docs/plan/pillar-0-governance/context-checkpoint-gate.md) |
| T3 Opus entry point | tools/council/opus-context.md § CONTEXT MANAGEMENT |
| T3 Sonnet entry point | tools/council/sonnet-context.md § CONTEXT MANAGEMENT |
| T3 Haiku entry point | tools/templates/haiku-spawn-template.md § CONTEXT MANAGEMENT |
| T2 Backstop validator | validate-agent-inheritance-parity.mjs (B_CONTEXT_CHECKPOINT_GATE in all 3 entry points) |

---

## KNOWN ANTI-PATTERNS

| Anti-pattern | Why it fails | Fix |
|-------------|-------------|-----|
| Compacting because "window is getting long" | Size ≠ checkpoint-ability | Assess against the checklist |
| Compacting before committing | Loses build state | Commit first, ALWAYS |
| Choosing 1M because "I might need it" | Cache-miss cost for no benefit | Default to 200K; only 1M when unit genuinely won't fit |
| Not asking Governor when borderline | AI cannot reliably read own context | Use the ASK-Governor escape |
| One role decides window, other role not informed | Gate is per-role | Both Opus+Sonnet must assess independently |
| Compacting a SROF/chore commit without harvest | SROF content is ephemeral | Write sonnet-turn.md BEFORE compacting |

---

*Ratified: S087 PROTO-S087-CONTEXT-CHECKPOINT-GATE. Applies to Opus, Sonnet, and Haiku (all 3 agent entry points).*
*validate-agent-inheritance-parity.mjs verifies B_CONTEXT_CHECKPOINT_GATE is present in all 3 entry points.*
