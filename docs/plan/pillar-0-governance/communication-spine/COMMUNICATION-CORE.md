---
id: csps.communication.communication-core
name: COMMUNICATION-CORE
description: >
  The CSPS Communication Core — canonical home for the 3-element trunk (WHO / WARRANT / ACTION)
  that governs every cross-boundary message in the platform. Spine entry under AI dimension
  (Option A ratified Governor S084 — communication is a method, not a domain; simulation precedent).
  WARRANT (provenance labels) is the missing element that lifts P-META-032 from the artifact layer
  into the communication layer. Opus↔Sonnet council channel is the first application.
type: governance
diataxis_type: explanation
protection_level: protected
status: ratified
ratified_by: "Governor S084 (PROTO-S084-COMM-CORE ratified)"
ratified_at: "2026-06-14"
core_spine: AI
core_spines: [AI, GVRN, OPER, VALD]
schema_anchor: communication
governing_principle: P-META-032
version: "1.0"
session: S084
authored_by: "Opus-21 (core seed) + Sonnet S084 (implementation)"
impl_status: swift-implemented
owner: group:finky
lifecycle: production
lifecycle_state: active
links:
  - rel: schema
    href: ./communication-schema.yaml
  - rel: protocol
    href: "../../../../tools/council/communication-protocol-shared.md"
  - rel: ai-spine-l1
    href: "../../../.claude/core-spines/L1_CORE_AI.md"
  - rel: registry
    href: "../../../../tools/config/core-spine-registry.yaml"
  - rel: p-meta-032
    href: "../../../../packages/principles/principles/P-META-032-demonstrated-truth.yaml"
  - rel: b-council-peer
    href: "../behavioral-contracts/B_COUNCIL_PEER.md"
context_question: >
  Before composing any cross-boundary message: (1) WHO is sending? (2) What WARRANT does
  every number/claim carry? (3) What is the ONE ACTION the receiver must do next?
  If any answer is compound or missing — simplify the message first.
---

# CSPS Communication Core
## The 3-Element Trunk: WHO / WARRANT / ACTION

---

## CORE SEED

Communication in CSPS is the discipline of **crossing a boundary without losing intent or
importing a false assumption.** It drifts because enforcement checks format (who-speaks)
but not substance (the warrant of the content). The 82-vs-78 mislabel (S083 OPIA) shipped
inside a correctly-formatted council message. The cure: three mandatory per-message elements
whose absence is act-time detectable — not just session-open injectable.

---

## THE 3-ELEMENT TRUNK

Every cross-boundary message in CSPS must satisfy all three elements. No element is optional.
The ordering matters: **WARRANT is checked at act-time (T1 gate)**; WHO and ACTION flow from it.

### ELEMENT 1 — WHO (Identity & Authority)

> "Who is writing this? Who reads it? What role do they hold?"

**Mechanical expression:** `pre-tool-use-council-address-required.sh` (T1 BLOCKING) — every
council-channel write carries the sender address in canonical form:
- 4-line: `I AM: <role> / YOU ARE: <role> / THIS IS: / DO NOW:` (PROTO format)
- Opener: `"<Role>, this is <Role>."` (report format)

**Status:** ENFORCED — T1 BLOCKING for council files, T2 advisory for broader comms.

**Failure mode:** Identity ambiguity → wrong role acts on directive → D2 (authority-pleasing)
fires when receiver doesn't know they can push back.

---

### ELEMENT 2 — WARRANT (Provenance Labels) ← THE MISSING ELEMENT (S084)

> "Is this [MEASURED:tool] / [PREDICTED] / [ASSUMED]?"

**Why this element is new:** WHO was enforced. WARRANT was not. The 82-vs-78 mislabel
in S083 lived inside a correctly-formatted Opus advisory. The format check passed (WHO ✓).
The substance check was absent (WARRANT ✗). A predicted number — principles_count=82 —
was reported as "verified." It was [ASSUMED], not [MEASURED]. Cost: one Opus correction cycle.

**The three labels (P-META-032 PROVENANCE LABELS clause — S084 amendment):**

| Label | Meaning | When to use |
|-------|---------|-------------|
| `[MEASURED:<tool>]` | Tool run cited IN THIS response; output shown | Any value produced by verify / grep / read / node this turn |
| `[PREDICTED]` | Reasoned or estimated; tool not yet run | Design assertions, projected values, pre-build estimates |
| `[ASSUMED]` | Carried from memory or prior session; not re-verified | Any value not freshly measured this turn |

**Rule:** `verified` and `confirmed` are **reserved** for `[MEASURED]` values ONLY.
Labeling a `[PREDICTED]` or `[ASSUMED]` value as "verified" = **PREDICTED-AS-MEASURED**
prevention class — the primary WARRANT failure mode.

**Mechanical expression (S084):**
- `pre-tool-use-false-assumption-gate.sh` — ADVISORY: fires when tab-transfer artifact contains
  number adjacent to 'verified'/'confirmed' without `[MEASURED:...]` tag
- `pre-tool-use-council-address-required.sh` extension — ADVISORY: same check scoped to
  council files (opus-turn.md / sonnet-turn.md) substance — number + 'verified'/'confirmed'
  without `[MEASURED:]`
- `validate-communication-protocol.mjs --extended` — checks WARRANT clause in council messages

**Escape hatch (legitimate use):** When all inputs to a claim are [MEASURED] this turn,
write: `[MEASURED:validate-platform-capacity]` (cite the specific tool). This IS the escape
hatch — not "None — I checked" (which is D5 single-pass).

---

### ELEMENT 3 — ACTION (Single Next Step)

> "What does the receiver DO next? One action. Not a list."

**Mechanical expression:** `communication-protocol-shared.md` Rule 0 THREE-QUESTION TEST +
`B_OPTIMAL_NEXT_STEP` per-turn contract.

**Status:** T3 (session-open injection). Drifts under D20 (context-pressure). Structural
promotion to T1 deferred pending cycle budget headroom.

**Failure mode:** Receiver gets a message with 5 "next actions" → D5 fires → single-pass
selects one arbitrarily → intent imported incompletely. The one-click relay block discipline
(S7) is the act-time partial solution for the Opus→Sonnet channel.

---

## APPLICATION REGISTRY (5 Communication Types)

Each application inherits all 3 elements. First application (Opus↔Sonnet) is the highest
priority because failures there cost Opus correction cycles (governor-time multiplier).

| Application | WHO | WARRANT | ACTION | Status |
|---|---|---|---|---|
| **1. Opus→Sonnet** (PROTO directive) | Enforced (council-address T1) | Extending S084 | One-click relay block (S7) | Active + extending |
| **2. Sonnet→Opus** (report) | Enforced (council-address T1) | Extending S084 (false-assumption-gate) | `▶ OPTIMAL NEXT STEP` | Active + extending |
| **3. Governor→AI** (directive) | Threshold classifies + CAQ | Not yet wired | Intent crystallization | Partial (T3 only) |
| **4. AI→Subagent** (Agent()) | B_BOUNDARY_ALIGNMENT_PROTOCOL Type B | Not yet wired | UNDERSTANDING BLOCK | T1 BLOCKING (S044) |
| **5. AI→External** (MCP/API) | B_ZCA foundational | Not yet wired | RETURN ONLY contract | T3 only |

---

## WHY COMMUNICATION IS AI-DIMENSION (NOT A 6TH L1 SPINE)

Spine fork resolved by Governor S084 as **Option A: registry entry under AI dimension.**

Load-bearing reason: the problem is **ownership + enforcement**, not taxonomy. A 6th L1 would
pay the boundary-002 crossing tax (5-step protocol, Governor ratification, balance-expert review)
to get a new label. The existing AI L1 doctrine already covers AI behavior — communication IS
how AI behavior manifests at boundary crossings. The same reasoning resolved simulation → VALD
entry (S076 Governor Option A precedent).

A communication L2 domain under AI owns the governance; the 5-spine model is preserved.

---

## RELATIONSHIP TO EXISTING INFRASTRUCTURE

| Artifact | Role | Relationship |
|---|---|---|
| `communication-schema.yaml` | 8 situations × handling specs + 6-tier audience | EXTENDS this core: each situation maps to WHO+WARRANT+ACTION |
| `communication-protocol-shared.md` | 16 rules (canonical) | SOURCE: Rules 0/1/2/16 express the 3-element trunk |
| `pre-tool-use-council-address-required.sh` | T1 BLOCKING (WHO) | EXPRESSION of Element 1 + extending for Element 2 (S084) |
| `validate-communication-protocol.mjs` | T2 WHO check (STANDARD) + WARRANT check (EXTENDED) | EXPRESSION: standard = WHO, extended = WARRANT+ACTION |
| `P-META-032` provenance_labels_clause | Principle anchor for ELEMENT 2 | SOURCE: `[MEASURED]/[PREDICTED]/[ASSUMED]` labels |
| `B_COUNCIL_PEER` | Council-scale expression | APPLICATION: Element 2 verify-before-concur = WARRANT at ratification |
| `ai-collaboration-charter.md §2.5` | Charter home for Opus↔Sonnet | APPLICATION 1 canonical home |

---

## ENFORCEMENT TRIO (3-Element Trunk)

| Element | T1 (act-time) | T2 (per-session) | T3 (session-open) |
|---|---|---|---|
| WHO | `pre-tool-use-council-address-required.sh` BLOCKING | `validate-boundary-prompt-format.mjs` | session-open.sh + AGENTS.md |
| WARRANT | `pre-tool-use-council-address-required.sh` extension ADVISORY + `false-assumption-gate.sh` ADVISORY | `validate-communication-protocol.mjs --extended` EXTENDED | this doc + `communication-protocol-shared.md` Rule 16 |
| ACTION | `post-tool-use-sonnet-relay-inline.sh` (one-click relay) | `validate-communication-protocol.mjs` (ACTION completeness) | `▶ OPTIMAL NEXT STEP` injection |

**Activation-Maturity Ladder:** WHO = L4 (hardwired for council files) · WARRANT = L2 (triggered, S084) · ACTION = L2 (triggered, T3 injection)

---

## SELF-APPLY TEST

Every Sonnet response to Opus must pass the 3-element self-check before sending:

1. **WHO:** Does the message start with "Opus, this is Sonnet." or the 4-line format? ✓/✗
2. **WARRANT:** Does every number/state/completion claim carry `[MEASURED:tool]` / `[PREDICTED]` / `[ASSUMED]`? ✓/✗
3. **ACTION:** Is there exactly ONE thing Opus must do next? ✓/✗

If any answer is ✗ — do not send. Fix the element. Then send.

---

*Authored S084 · Core seed: Opus-21 · Implementation: Sonnet S084 · Ratified: Governor S084*
*Simulation precedent (VALD entry, S076) — method not domain.*
