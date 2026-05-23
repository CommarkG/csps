---
id: vault.concepts.COMBINATORIAL-ENGINE-MULTI-AGENT
name: COMBINATORIAL-ENGINE-MULTI-AGENT
description: "The Combinatorial Engine as multi-agent orchestrator — why CE is the architectural prerequisite for any app with multiple participants. The 'three drivers' problem and its structural solution."
type: vault_concept
protection_level: active
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "1.0"
session: S053
impl_status: swift-implemented
core_spines: [ARCH, AI, GVRN]
core_spine: ARCH
schema_anchor: vault_files
links:
  - csps.governance.PLATFORM-GENOME
  - vault.concepts.SELF-VALIDATION-METHODOLOGIES
  - SIA.INFRA-FLOW-VALIDATION
context_question: "For any process involving more than one AI participant — which party currently holds authority to produce output, and what mechanism enforces that only that party speaks?"
context_quote: "Can these kinds of processes that involve potential participants more than two be orchestrated by an engine and not by random AI freestyling? I think it is important, not only for what we are doing here, because I'm deeply involved, but I'm thinking forward to complex apps that will be required to handle dialogues and multi sessions."
inherits_from: "Platform Genome §3 Priority Engine + §7 Phase Build Order"
---

# Combinatorial Engine — Multi-Agent Orchestration

## The Problem (S053 Evidence)

Three AI tabs simultaneously active: OPUS-7, old Sonnet (S053), new Sonnet (S055).
Each producing output. Each making false assumptions about what others know.
Governor becomes the arbiter of conflicting signals. "Three drivers."

This is a **concurrency problem without a mutual exclusion mechanism.**
It cannot be fixed by better instructions. It requires an orchestration layer.

## What We Have Now (Manual CE)

| CE Component | Current Manual Equivalent |
|---|---|
| Input Router | PROTO format → explicit recipient |
| State Store | session-state.json, session-role field |
| Priority Engine | MDPE formula + unified-plan.yaml |
| Turn Management | HANDOFF mechanism |
| Authority Registry | active_implementation_session field |

These work when followed correctly. The CE makes them automatic — and makes violation IMPOSSIBLE rather than unlikely.

## The Missing Piece: validate-session-authority.mjs

session-state.json has `active_implementation_session` — designed to prevent old sessions from participating after handoff. There is NO T2 validator that enforces this. An old session tab CAN produce output and the platform has no mechanical way to reject it.

Fix (S055+): `validate-session-authority.mjs` — reads active session from session-state.json, checks that outputs only come from the active session, flags expired-session outputs as ADVISORY (cannot block them mechanically in this architecture, but can surface them).

## The CE Turn-Management Protocol

```
current_authority: [OPUS | SONNET | GOVERNOR]
transfer_trigger: [session_complete | proto_complete | governor_directive]
rule: ONLY current_authority party produces output
expired_sessions: CANNOT participate after transfer
simultaneous_output: serialized by CE, not negotiated by humans
```

This is the formal protocol. HANDOFF implements it manually. CE implements it automatically.

## Why CE Matters for Future Apps

Any app with >1 active participant (user+AI, user+user+AI, external+internal) needs this:
- Without CE: 3 handlers respond simultaneously → user sees contradictions → exits in <2 min
- With CE: one handler responds per turn → conversation feels natural → retention holds

**The Gladiator Rule (from UX research):** Friction beyond ~2 seconds from any interaction = exit. Simultaneous conflicting responses = immediate exit. CE prevents this structurally.

## CE Architecture (Phase 5 — built on BEHAVIOR-HUB + THRESHOLD)

**Layer 1 (preprocessing):** Classify every input → route to correct handler
Built on: THRESHOLD (R1.4.1 classification, partially built)

**Layer 2 (dimensional routing):** Match input to participant + context
Built on: BEHAVIOR-HUB (per-user profiles + vocabulary)

**Layer 3 (forward reasoning):** Predict next-best-action across conversation
Built on: Layers 1+2 + conversation history

CE Layer 1 MDPE re-assessment (S053):
- Classic pe: ~60
- blast_radius: 0.85 (affects all multi-party apps + current AI coordination)
- future_enablement: 0.9 (enables complex dialogue apps)
- readiness: 0.5 (needs BEHAVIOR-HUB + THRESHOLD code first)
- MDPE: ~142

Note: still blocked on readiness=0.5 — cannot build before THRESHOLD code exists.

## S1/S2/S3 Application to "Three Drivers"

**S1 (instance fix):** Close expired session tabs. Only current authority speaks. One paste block at a time.

**S2 (pattern fix):** Multi-Tab Protocol — explicit authority transfer at every tab transition. No old session reviews new sessions. session-state.json consulted before output.

**S3 (structural fix):** validate-session-authority.mjs + CE Layer 1 (THRESHOLD-based routing). The structural solution makes the S1/S2 fixes unnecessary — the CE handles authority management automatically.

---

*CE Multi-Agent | S053 | From Governor question about process orchestration*
*The MAPE-K loop IS CE Layer 1: Monitor=session-state, Analyze=MDPE, Plan=PROTO, Execute=validators, Knowledge=Platform Genome*
