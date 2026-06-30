---
id: csps.handoff.csp-csps-collaboration-ai-council-model
name: CSP-CSPS-COLLABORATION-AI-COUNCIL-MODEL
description: >
  CSP <-> CSPS shared collaboration artifact. Documents how the three Claude models — Opus
  (director), Sonnet (builder), Haiku (scout) — collaborate BOTH as separate UI tabs AND as
  Agent-tool sub-agents, under the Governor relay. Consolidation of scattered CSPS sources into
  one shareable file; cites the canonical SSoT files rather than duplicating them.
version: "1.0"
owner: group:finky
authored_by: OPUS-25
core_spine: GVRN
core_spines: [GVRN, AI, VALD]
schema_anchor: handoff_files
diataxis_type: reference
lifecycle: production
lifecycle_state: active
status: active
precedent_checked: true
session: S089
---

# CSP ↔ CSPS — AI Council Collaboration Model (Opus · Sonnet · Haiku)

**Audience:** the CSP team and the CSPS team (sibling platforms collaborating since the Multi-Core
share / CSP S346). **Purpose:** one file that explains how the three Claude models work together —
as **separate tabs** and as **agents** — so either team can adopt or align to the same model.

> Framing (shared with CSP): *a role that is not a mechanical seat does not run.* Each model has a
> defined seat, a defined channel, and a verification rule. Self-report is never truth.

---

## §1 — The three seats (roster)

| Model | Seat | Role | Runs as | Model ID |
|---|---|---|---|---|
| **Opus 4.8** | DIRECTOR | Plans, seeds, rules on merit, audits, seals. Final architectural say. | UI **tab** | `claude-opus-4-8` |
| **Sonnet 4.6** | BUILDER | Full build-out, codes, runs verify, reports back with evidence. | UI **tab** | `claude-sonnet-4-6` |
| **Haiku 4.5** | SCOUT | Bounded, mechanical, verifiable breadth scans. Returns raw findings only. | **agent** only (never a tab) | `claude-haiku-4-5` |

**Division of labor (canonical):** *Opus plans + seeds; Sonnet builds out; Haiku scouts breadth.*
Opus does not mass-produce code; Sonnet does not self-ratify architecture; Haiku does not decide,
synthesize, or edit. The Governor (human) relays between the tabs and triggers the agents.

---

## §2 — As separate TABS (Opus tab ↔ Sonnet tab)

Opus and Sonnet each run in their **own Claude Code tab**, with no shared memory. The **Governor is
the relay** between them. Continuity is mechanical, not conversational:

- **Tab open → model declaration gate (B_MODEL_DECLARATION).** Every new tab self-declares on its
  first response: `ACTIVE MODEL: … / ROLE: … / Awaiting Governor confirmation.` The configured model
  is injected from `.claude/settings.json`; Claude reports what it *actually* is; a mismatch is
  flagged. Governor replies `confirmed` / `use opus` / `use haiku`.
  → SSoT: [.csps/session-startup-architecture.md](../../../.csps/session-startup-architecture.md) (5-layer startup).
- **Relay channel = two append-only logs:**
  - [tools/council/opus-turn.md](../../../tools/council/opus-turn.md) — **Opus → Sonnet** rulings (the SSoT for directives).
  - [tools/council/sonnet-turn.md](../../../tools/council/sonnet-turn.md) — **Sonnet → Opus** build reports.
  - Every Sonnet reply to Opus opens with the literal line **"Opus, this is Sonnet."** (provenance guard).
- **The one-click relay format.** A directive is presented to the Governor as a **compact fenced
  block** (a ```` ```relay-content ```` fence, ~12–20 lines) that the Governor pastes into the other
  tab. The full ruling lives in `opus-turn.md`; the paste block is a pointer. (Never the old `═══`
  banner form — a hook blocks `═══` without a relay-content fence.)
- **Session resume across compaction.** After every clean `verify`, `generate-oneclick.mjs` writes a
  committed `.csps/oneclick.md` resume block — so a compacted/closed tab can be reconstituted exactly.

```
        ┌──────────── Governor (human relay) ────────────┐
        │                                                │
   [ OPUS tab ] ── opus-turn.md ──▶ paste ──▶ [ SONNET tab ]
   director                                       builder
        ▲                                            │
        └────────── sonnet-turn.md ◀── paste ◀───────┘
        "Opus, this is Sonnet."   (build report + verify evidence)
```

---

## §3 — As AGENTS (sub-agents via the Agent tool)

The same intelligence is also used **without a tab**, as bounded sub-agents — this is the **model
economy**: push each task to the **cheapest model that can do it reliably**, and never trust its
output until it is independently reproduced.

- **Haiku is an agent, never a tab.** It is spawned via the Agent tool (`subagent_type: "haiku-scout"`,
  `model: "haiku"`). The `SessionStart` hook does NOT fire for sub-agents; all context is passed in the
  spawn prompt. → SSoT: [.claude/agents/haiku-scout.md](../../../.claude/agents/haiku-scout.md) +
  [tools/templates/haiku-spawn-template.md](../../../tools/templates/haiku-spawn-template.md).
- **The ≥4-checks trigger.** A scan is offloaded to parallel Haiku scouts only when there are **≥4
  independent, mechanical, verifiable checks** (grep/inventory/classification/presence). For ≤3 checks
  the caller runs them **inline** — a spawn that overflows its context budget produces zero work
  (CONTEXT-BUDGET gate). Spawns must restrict tools and pass **file paths + line ranges, not contents**.
- **Other sub-agents in the roster:** `dna-guardian` (clears every EXTERNAL capability — MCP/agent/
  library — into an ALIGNED / ALIGNED-WITH-TRANSLATION / QUARANTINE verdict before it may act),
  `Explore` / `Plan` / `general-purpose`. Opus/Sonnet delegate breadth to these to protect their own
  context budget; the agent's final message is the only thing returned.

---

## §4 — The verification rule (the spine of the whole model)

**Independent verification beats self-report — always.** This is the single rule that makes a
multi-model system trustworthy:

- A sub-agent's findings (especially Haiku's) are a **CLAIM to be reproduced**, never platform truth.
  Observed failure mode: a scout reported "0 matches" where the real count was 92. → spot-check before use.
- Any **external capability** is QUARANTINE until `dna-guardian` records an ALIGNED verdict in
  [tools/data/external-capability-alignment.yaml](../../../tools/data/external-capability-alignment.yaml).
- A **"done"** claim requires THIS-SESSION evidence: re-run `verify` (exit 0 + green-receipt) — memory
  of an earlier green run is not evidence. **Re-run IS the proof.**
- Opus **seals**; Sonnet **builds**; the **Governor ratifies**. No seat ratifies its own work.

(This is the CSPS-native equivalent of the CSP S346 "VERIFY GATE": re-derive any done-claim from
source. Same principle, already mechanical here via the green-receipt + dna-guardian + scout-spot-check.)

---

## §5 — SSoT registry (this file consolidates; it does not own)

| Concern | Canonical file |
|---|---|
| Tab startup, model declaration, oneclick resume | `.csps/session-startup-architecture.md` |
| Opus→Sonnet rulings | `tools/council/opus-turn.md` |
| Sonnet→Opus reports | `tools/council/sonnet-turn.md` |
| Haiku scout contract | `.claude/agents/haiku-scout.md` + `tools/templates/haiku-spawn-template.md` |
| External-capability alignment (dna-guardian) | `tools/data/external-capability-alignment.yaml` |
| Council review system (members + Opus seal) | `tools/council/council-architecture.md` |
| Communication spine + edge cases | `docs/plan/pillar-0-governance/AI-COUNCIL-COMMUNICATION-SPINE.md` + `AI-COUNCIL-EDGE-CASE-PROTOCOLS.md` |
| Agent-inheritance parity (3 seats stay in sync) | `tools/validators/validate-agent-inheritance-parity.mjs` |

---

## §6 — Decision ledger

| Decision | Chosen | Rejected | Reasoning |
|---|---|---|---|
| Haiku surface | Agent/sub-agent only | UI tab | Bounded-scan role needs no full session context; Agent spawn is right-sized + cheap. |
| Cross-tab continuity | Append-only relay logs + committed oneclick | Shared conversational memory | Tabs have no shared memory; chat is ephemeral and compacts away. Files survive. |
| Trust model | Independent reproduction (verify / spot-check / dna-guardian) | Trust self-report | A multi-model system where any seat ratifies itself drifts into nominal-done. |
| This file | Consolidate + cite SSoT | Duplicate the content | ENHANCE-NOT-FORK; one shareable entry point that points at the live sources. |

---

*CSP ↔ CSPS shared artifact · S089 · authored by Opus (director) for cross-team alignment.*
*Reproduced in CSPS idiom; CSP may align to or adapt it. Verification rule (§4) is non-negotiable.*
