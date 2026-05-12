---
id: csps.tools.templates.chat-state-snapshot
name: chat-state-snapshot-template
description: Lightweight intra-session boundary artifact. Captures essential state when context < 25% OR at a phase gate within a session. Lighter than a full HANDOFF. Preserves: active plan + phase + vault collected + open pre-flight Qs + assumption validation status + next step. Ensures the incoming chat or continued context has the minimum viable state to continue coherently.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: meta-template
template_status: provisional
core_spine: OPER
core_spines: [OPER, GVRN, AI]
schema_anchor: templates
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:draft
session: S016
consolidation_cross_refs:
  - docs/plan/_handoff/HANDOFF-S015-to-S016.md
  - docs/plan/pillar-0-governance/behavioral-contracts.md
  - tools/templates/gradual-build-plan.template.md
links:
  - { rel: parent, href: ./ }
  - { rel: governs, href: ../../docs/plan/pillar-0-governance/csps-platform-dna.md }
  - { rel: registry, href: ../../docs/plan/_handoff/VAULT/template-registry.md }
applicability_trigger: |
  Fire when ANY of these conditions is true:
  (a) Context < 25% free (measured by context indicator or estimate)
  (b) Phase gate reached within a session (phase done + verify + commit)
  (c) Intra-session chat boundary (physical conversation reset within same logical session)
  (d) After a STOP-FOR-CONSENSUS decision from Humble Executor
when_NOT_to_use: |
  - Do NOT use instead of a full HANDOFF at session close
  - Do NOT use for session-to-session boundaries (use HANDOFF-S<NNN>-to-S<NNN+1>.md)
  - Do NOT use if the session is closing (use session close protocol instead)
---

# Chat State Snapshot Template

> **Use this when context is running low or at an intra-session phase gate.**
> This is NOT a session close. It preserves mid-session state for continuation.

---

## CHAT STATE SNAPSHOT — S[NNN]-C[N] → S[NNN]-C[N+1]

```
══════════════════════════════════════════════════════
CHAT STATE SNAPSHOT
Session: S[NNN] | Chat: C[N] → C[N+1]
Created: [ISO timestamp]
Context remaining: ~[N]% | Trigger: [context-low | phase-gate | consensus-stop]
══════════════════════════════════════════════════════

ACTIVE PLAN:
  Plan: [plan name] (docs/plan/_handoff/VAULT/topic-plans/[plan-id].md)
  Phase: [current phase, e.g., "L2 — Goals + Formal Design"]
  Execution mode: velocity | balanced | deep_quality

COMPLETED THIS CHAT:
  - [artifact 1] (commit [hash])
  - [artifact 2] (commit [hash])
  - [N items from phase checklist marked [x]]

VAULT COLLECTED (raw-thoughts-queue pending items):
  - [idea/insight 1] → STATUS: PENDING
  - [idea/insight 2] → STATUS: PENDING

OPEN PRE-FLIGHT QUESTIONS (from last batch):
  [0 — all answered | Q1: [text] | Q2: [text]]

ASSUMPTION VALIDATION STATUS:
  → [assumption from plan]: STILL VALID ✓ | NEEDS RECHECK | VIOLATED
  → [assumption from plan]: STILL VALID ✓

NEXT STEP (in-progress at hand-off):
  [Specific next action — exactly what the incoming chat should start with]
  File: [path] | Purpose: [one sentence]

BLOCKERS (if any):
  [NONE | description of what's blocking + what's needed to unblock]

BEDROCK STATUS:
  Foundation gate: CLEAN | BLOCKING
  Stale plans: N unverified
  Bedrock completion: [N]% ([N]/21 items)

CONTEXT CONTINUATION INSTRUCTION:
  "I am [model]. Continuing S[NNN]-C[N+1] from the snapshot above.
  Previous chat completed [N] items. Next: [specific next step].
  Resuming execution_mode: [velocity|balanced|deep_quality]."
══════════════════════════════════════════════════════
```

---

## When to emit this snapshot

| Trigger | Condition | Action |
|---|---|---|
| Context low | Estimated < 25% remaining | Emit before starting next work item |
| Phase gate | Phase complete + verify + commit | Emit as part of Humble Executor milestone protocol |
| Consensus stop | B_HUMBLE_EXECUTOR decided STOP | Emit before user review |
| Chat reset | Physical conversation boundary mid-session | Emit for pasting into new chat |

## What it captures (minimum viable state)

1. **Active plan + phase** — which plan and where in it
2. **Completed this chat** — what was done (commit references)
3. **Vault collected** — ideas/discoveries that need processing
4. **Open pre-flight Qs** — decisions still pending from last batch
5. **Assumption status** — which plan assumptions are still valid
6. **Next step** — exactly where to resume
7. **Bedrock status** — foundation gate + completion %

## What it does NOT capture (handled by full HANDOFF at session close)

- Full governance evidence block (ZF iterations, verify evidence)
- §17 attestation
- HPFA (Handoff Pre-Flight Audit)
- Governor-prompts log coverage
- Session extraction doc

---

**Template signature:** S016-AI-chat-state-snapshot-template-2026-05-07T00:00:00Z
