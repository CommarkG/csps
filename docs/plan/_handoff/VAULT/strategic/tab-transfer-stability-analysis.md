---
id: csps.vault.strategic.tab-transfer-stability-analysis
name: tab-transfer-stability-analysis
description: "Full background, problem decomposition, and solution architecture for tab transfer stability. Governor-surfaced question S061: are skills/agents more stable than native AI behavioral enforcement for tab transfer?"
type: vault
vault_type: strategic
status: ratified
session: S061
owner: group:finky
related_finding: FINDING-OPUS10-1
related_proto: PROTO-STEP0-FIX
links:
  - { rel: protocol, href: ../../../../pillar-0-governance/PROTO-AND-TAB-TRANSFER-PROTOCOL.md }
  - { rel: permanence, href: ../../../../pillar-0-governance/PERMANENCE-PROTOCOL.md }
  - { rel: sonnet-turn, href: ../../../../../tools/council/sonnet-turn.md }
---

# Tab Transfer Stability — Background, Problems, and Solution Architecture

> **Governor question (S061):** "Do you think that using skills of agents for actions like moving
> to a new tab will be more stable than trying to create stability in the code and the native AI you are?"

---

## 1. Background — What Tab Transfer Does Now

The CSPS multi-tab protocol (PROTO-AND-TAB-TRANSFER-PROTOCOL.md v2.1) works as follows:

### Current flow (behavioral)
1. **Sending tab** (Sonnet): writes `tools/council/sonnet-turn.md` with findings, questions, directives
2. **Governor**: copies the "startup block" from `generate-startup-block.mjs` output
3. **Receiving tab** (Opus): Governor opens new tab, pastes startup block
4. **Receiving tab (Step 0)**: AI reads the startup block, emits role confirmation box
5. **Relay confirmation**: (protocol says) the receiving AI asks previous tab to confirm handoff

### What makes this behavioral (not structural)

Every step between 2 and 5 requires:
- The Governor to recognize which block to copy
- The AI to read the startup block in the right order
- The AI to execute Step 0 before processing anything else
- The AI to not override training defaults (absorb-and-wait, confirmation-seeking)

**None of these are structural.** They are instructions the AI is asked to follow. Training defaults can override them silently.

---

## 2. Problem Decomposition

### P1 — The Boundary Itself (structural limit, unsolvable)
A new tab = a new conversation = zero state. Skills and agents run **inside** a conversation.
No skill, agent, or hook can cross a tab boundary and inject context into a new conversation.
This is a hard platform constraint. The human paste IS the handoff mechanism.

### P2 — Behavioral Layer Accumulation (solvable)
Every protocol correction adds behavioral instructions on top of existing behavioral instructions.
- S052: added SONNET STARTUP BLOCK
- S057: added Step 0 bordered box
- S060: added relay model correction
- S061: added relay confirmation loop

Each layer assumes the AI correctly executed all prior layers. Failures compound silently.
**Root cause of FINDING-OPUS10-1**: Step 0 added without accounting for direct-open scenario.

### P3 — The Satisfaction Point Trap (AI default, enforceable)
Claude's training default: large instruction blocks with CAPS headers → absorb as system context,
wait for "real prompt." This means an AI can "succeed" (no error) while completely skipping Step 0.
The AI's satisfaction point ("I absorbed the context") ≠ the protocol's satisfaction point ("Step 0 emitted").

**Measured impact (S061):** Every new tab opened before ac040bc fix skipped Step 0 entirely.
Governor needed to repeat corrections each time.

### P4 — Handshake-Without-Counterparty (defect, FINDING-OPUS10-1)
Step 0 assumes a previous tab exists to confirm "HANDOFF CONFIRMED."
Three tab-open scenarios exist; only one has a counterparty:

| Scenario | Previous tab? | Step 0 relay makes sense? |
|---|---|---|
| Sonnet → Opus relay | Yes | Yes |
| Governor opens Opus fresh | **No** | **No** — loops to nothing |
| Compaction continuation | Self | **No** — would loop to itself |

Current protocol: single Step 0 shape for all three. Defect discovered when Governor opened
OPUS-10 directly (S062) and the bordered box asked Governor to relay to a tab that didn't exist.

### P5 — Generation vs. Execution Gap
`generate-startup-block.mjs` produces perfect startup text. But:
- The AI that generates it (Sonnet) is not the AI that receives it (Opus or new Sonnet)
- The receiving AI must parse, interpret, and execute instructions from a document it has no prior contract with
- The document's authority is entirely behavioral — "follow these instructions"

No T1 hook enforces that the receiving AI ran Step 0. No T2 validator checks that Step 0 was emitted. The entire chain is T3-only (session injection) which is the lowest permanence tier.

---

## 3. Why Skills/Agents Help (and Where They Don't)

### What skills/agents cannot solve
- **The boundary**: a new tab conversation starts cold regardless of skills
- **Context injection into another AI**: impossible — skills run in the current conversation
- **Making the AI "execute" vs "absorb"**: this is an inner-default, not an execution context problem

### What skills/agents DO solve

| Problem | Current | With Skill |
|---|---|---|
| Sonnet writes sonnet-turn.md inconsistently | AI improvises format each turn | `/session-close` skill — guaranteed schema, same fields every time |
| Governor selects wrong block to paste | Human judges which block is current | Skill outputs single unambiguous paste target |
| Receiving AI skips Step 0 | Hope + behavioral instruction | generate-startup-block.mjs with enforced structure (branched Step 0 per P4 fix) |
| Verification that Step 0 was emitted | None | Post-stop hook checks first response for Step 0 pattern |

**The key insight:** Skills standardize the **output** of behavioral actions. They move the boundary between "structural" and "behavioral" further right — but cannot eliminate the behavioral layer entirely at a tab boundary.

---

## 4. Stability Hierarchy (most → least stable)

| Mechanism | Stability tier | Why |
|---|---|---|
| `session-open.sh` + `always_include` | **T1 (structural)** | Fires before any AI reasoning. Cannot be skipped. |
| CLAUDE.md / startup injection | **T2 (structural)** | Loads unconditionally at session start |
| `/session-close` skill with schema | **T3 (high-behavioral)** | Structured output, repeatable, no AI freestyle |
| Branched Step 0 in startup block | **T4 (medium-behavioral)** | Reduces wrong-path selection, still requires reading |
| Native AI following protocol | **T5 (low-behavioral)** | Subject to training defaults, context limits, compaction |
| AI "remembering" protocol across turns | **T6 (none)** | Compaction / new tab wipes it |

**The PROTO-AND-TAB-TRANSFER-PROTOCOL is currently T5 + T6 for most of its steps.**
FINDING-OPUS10-1 fix + skills work moves it toward T3 + T4.

---

## 5. Solution Architecture

### Layer 1 — Immediate (FINDING-OPUS10-1, Opus-directed)
**Branched Step 0** in generate-startup-block.mjs:
- Scenario A (direct-open): no relay needed, await Governor directive
- Scenario B (relay from previous tab): relay confirmation required
- Default to A if ambiguous (direct-open is safer assumption)

This collapses P4 (handshake-without-counterparty) and partially P3 (satisfaction point).

### Layer 2 — Short term (PROTO proposal for Opus)
**`/session-close` skill** — structured handoff generator:
```
Input: none (reads session-state, sonnet-turn, verify output automatically)
Output: 
  1. Formatted sonnet-turn.md update (guaranteed schema)
  2. Single paste-ready startup block (no Governor selection needed)
  3. ZF validation output appended inline
```
Collapses P2 (behavioral layer accumulation) and P5 (generation vs. execution gap).

### Layer 3 — Medium term
**Post-stop hook: validate Step 0 was emitted**
- Every AI response in a relay session: hook checks first N lines for Step 0 pattern
- If not found: warning emitted, Governor prompted to re-trigger
- T2 enforcement for the T5 behavioral action

### Layer 4 — Structural ceiling (what we can actually achieve)
The maximum stability for a tab transfer is: **T3 (high-behavioral)** — because the human paste IS the mechanism. We cannot inject context into a new conversation without a human bridge. The goal is not to eliminate behavioral layers but to:
1. Make each layer's output deterministic (skills)
2. Make each layer's execution verifiable (post-stop hooks)
3. Make failure visible immediately (not silently absorbed)

---

## 6. Summary Decision

> **Are skills/agents more stable than native AI behavioral enforcement for tab transfer?**

**Partially yes, with an important bound:**
- Skills make the *sending* side structural (T3 instead of T5)
- Skills cannot cross the tab boundary — the receiving side remains behavioral
- The combination of: branched Step 0 + `/session-close` skill + post-stop hook raises the floor from T5→T3
- Full structural (T1/T2) for tab transfer is architecturally impossible within Claude's current conversation model

**Recommended position:** Build the skills, fix Step 0, add the post-stop hook. Accept that tab transfer has a behavioral ceiling. Design protocols to be **failure-visible** (wrong Step 0 → immediate visible error) rather than **failure-silent** (current state).

---

*Written: S061 | Vault type: strategic | For: Opus OPUS-10 review*
*Companion finding: FINDING-OPUS10-1 in tools/council/sonnet-turn.md*
