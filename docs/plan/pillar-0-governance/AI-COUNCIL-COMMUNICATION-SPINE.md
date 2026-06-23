---
id: csps.governance.ai-council-communication-spine
name: AI-COUNCIL-COMMUNICATION-SPINE
description: >
  Core Spine for all AI council communication in CSPS. Defines the canonical
  message contract, role pairs, format law, and orchestrator trigger registry.
  Every AI-to-AI and AI-to-human message inherits from this spine.
  Drafted for Opus review + external AI commentary.
version: "1.0"
session: S088
authored_by: Sonnet-builder S088 | Governor directive S088
status: DRAFT — pending Opus review
owner: group:finky
lifecycle: production
lifecycle_state: pending-review
next_review_at: "2026-07-07"
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
diataxis_type: reference
impl_status: swift-implemented
links:
  - { rel: rules, href: ../../../tools/council/communication-protocol-shared.md }
  - { rel: edge-cases, href: ./AI-COUNCIL-EDGE-CASE-PROTOCOLS.md }
  - { rel: charter, href: ./ai-collaboration-charter.md }
  - { rel: validator, href: ../../../tools/validators/validate-communication-protocol.mjs }
---

# AI Council Communication Spine
## The law for how every AI participant speaks, listens, and passes authority

> **Status:** DRAFT — for Opus review + external AI commentary
> **Governing intent:** Every message crossing any AI boundary is governed by this spine.
> No role may freestyle. No format may be invented per-session. This file IS the protocol.

---

## PART 1 — SPINE ANATOMY (read before everything else)

The Communication Spine has four layers. Each lower layer inherits ALL rules from the layers above it.

```
L1 — UNIVERSAL CONTRACT     (applies to ALL parties, all message types, no exceptions)
L2 — ROLE-PAIR CONTRACTS    (Opus↔Sonnet, Opus↔Haiku, any↔Governor, any↔External)
L3 — MESSAGE-TYPE FORMATS   (directive, report, relay, harvest, edge-case)
L4 — ORCHESTRATOR TRIGGERS  (what mechanism fires which format, when, automatically)
```

**Inheritance law:** A role-pair contract (L2) may ADD specifics. It may NOT relax or remove any L1 universal rule. A message-type format (L3) must satisfy L1+L2. A trigger (L4) must invoke a valid L3 format. Any deviation requires a boundary-crossing ratification.

---

## PART 2 — L1: UNIVERSAL CONTRACT

These seven rules bind ALL parties at ALL times. Violation of any one makes the message malformed.

### U1 — IDENTITY (the handshake rule)

Every message crossing any boundary MUST declare:
- **WHO sent it** (actual role, session ID, not vague): `Sonnet (S088)`, `OPUS-25`, `Haiku-Scout`, `Governor (Yariv)`, `External-Agent-X`
- **WHO it targets** (one specific receiver): `Opus`, `Sonnet`, `Governor`, `Haiku`

**FORBIDDEN:** "this is for the other tab", "the team", "everyone". One sender. One receiver. Every time.

**Current wiring:** RULE 1 in communication-protocol-shared.md (T3). T1 pending.

### U2 — ZERO-CONTEXT ASSUMPTION (the restart rule)

Every message crossing any boundary assumes the receiver has **zero prior context**.

Provide WHO/WHAT/HOW/NOW inline before any task content.
Test: "Could someone with no background on this project understand this completely?" → No = message is incomplete.

**Applies to:** tab transfers, SROFs, API responses, handoff artifacts, any cross-boundary message.

**Current wiring:** RULE 7 in communication-protocol-shared.md (T3). T1 pending.

### U3 — CONTEXTUAL LOCALITY (the no-navigation rule)

Content appears at its point of use. NEVER reference another location.

**Banned patterns:**
```
✗ "see above / see §X / see Turn N"
✗ "paste the prompt from earlier"
✗ "as I shared / refer to the block I wrote"
✗ "check tools/council/[file] for details" — if needed, paste the content here
```

**Required:** Paste the full thing. Repeat even if said 30 seconds ago. The receiver starts from zero.

**Current wiring:** RULE 4 + RULE 12 in communication-protocol-shared.md. T1: post-stop-banned-phrase.sh.

### U4 — WARRANT (the provenance rule)

Every claim crossing a boundary carries one of three labels:

| Label | Meaning | When |
|-------|---------|------|
| `[MEASURED:<tool>]` | Tool ran IN THIS response, output visible | verify / grep / read / node ran this turn |
| `[PREDICTED]` | Reasoned from model; not yet run | design estimates, projections, "should be" |
| `[ASSUMED]` | Carried from memory or prior session | any value not freshly re-measured this turn |

`verified` and `confirmed` are **reserved for `[MEASURED]` only.** Labeling a `[PREDICTED]` or `[ASSUMED]` value as "verified" = PREDICTED-AS-MEASURED violation.

**Current wiring:** RULE 16 in communication-protocol-shared.md. T1 advisory hooks. T2 validate-communication-protocol.mjs.

### U5 — SINGLE ACTIVE THREAD (the focus rule)

ONE active directive at a time. The current receiver completes and reports before a new directive is issued. No parallel pipelines between any two parties.

**Exception:** Opus may seed multiple independent core-seeds to Sonnet when they have zero dependency on each other AND completion order doesn't affect correctness. Must be declared as `MODE: simultaneous` in the directive header.

**Current wiring:** RULE 5 in communication-protocol-shared.md (T3).

### U6 — COMPLETION STANDARD (the done rule)

**DONE = built + wired + called + output verified (THIS SESSION, THIS RESPONSE).**

Never declare DONE on commit alone. Never declare DONE on tsc passing alone.
Evidence required: `verify exit_code=0` (or equivalent per message type) **in the same message as the claim.**

Behavioral block-tests MUST pass (exit 0 on planted defect → exit 1 confirming gate works).

**Current wiring:** RULE 6 + RULE 11 in communication-protocol-shared.md. T2: validate-done-claim.mjs.

### U7 — TURN TOKEN (the authority rule)

The Turn Token = the authority to produce binding output.

| Role | When token held | Transfer event |
|------|-----------------|----------------|
| **DIRECTOR** (Opus) | Architectural decision phase | Writes PROTO directive → sends to Sonnet |
| **BUILDER** (Sonnet) | Implementation phase | Writes SROF completion → sends to Opus |
| **SCOUT** (Haiku) | Bounded scan phase | Returns findings → token returns to spawner |
| **RELAY** (Governor) | NEVER holds token | Only passes turns between tabs |

Expired session tab = token permanently released. An expired tab CANNOT issue directives.

**Current wiring:** RULE 0 in communication-protocol-shared.md (T3). T1 pending.

---

## PART 3 — L2: ROLE-PAIR CONTRACTS

### 3.1 Opus → Sonnet (Director → Builder)

**Purpose:** Issue a specific, complete, verifiable build directive.
**Inherits:** All 7 universal rules.
**Required additions:**

```
Header:  [PROTOCOL: <PROTO-ID> | STEP: <N> of <M> | MODE: sequential|simultaneous]
Opening: "Sonnet, this is Opus."    ← MANDATORY first two words
Body:    Numbered steps (1–5 max per directive)
         Each step: action + target file + pass criterion
Tail:    "Verify: node tools/verify.mjs exit_code=0 before committing."  ← MANDATORY last line
```

**Additional requirements:**
- Self-contained: no "see prior directive"
- All file links use `tools/council/` or absolute paths (not relative references)
- Step N always includes its own verification (not "verify at end")
- Mode `simultaneous` requires explicit dependency declaration: `Steps 2 and 3 are independent and may run in parallel. Step 4 REQUIRES both to complete first.`

**What Opus must NOT do:**
- Write Sonnet's response for it
- Declare Sonnet's work DONE before Sonnet reports
- Issue a new directive before the previous SROF is received and acknowledged

### 3.2 Sonnet → Opus (Builder → Director)

**Purpose:** Report completion, surface blockers, request architectural decisions.
**Inherits:** All 7 universal rules.
**Required additions:**

```
Canonical location: tools/council/sonnet-turn.md (written first, chat is a copy)
Opening:  "Opus, this is Sonnet."   ← MANDATORY first five words (no exceptions)
ID block: SROF-S<NNN>-<NN> | S<NNN> | HEAD: <sha> | exit_code=<N> | blocking=<N>
Body:     ## GREEN STATE (or RED STATE)
          ## WHAT WAS BUILT (per CS/PROTO item)
          ## VERIFY EVIDENCE (THIS-SESSION runs only)
          ## BLOCK-TEST EVIDENCE (if any block-tests ran)
          ## OPEN ITEMS (carry-forward, nothing left chat-only)
Footer:   ## CADENCE-AUDIT (SROF chain N, what was done, what's next)
```

**Distinction (critical):**
- Step completion = **Rule 3 format** (plain text, commit SHA, numbered questions). NOT SROF.
- Architectural question = **SROF format**. NOT Rule 3.
- Using SROF for routine step reports inflates governance. Using Rule 3 for architectural decisions loses evidence.

**What Sonnet must NOT do:**
- Write "Opus, this is Sonnet" ANYWHERE except as the first five words of the message
- Declare a step DONE without THIS-SESSION verify evidence in the same message
- Leave decisions in chat only — every open item goes into sonnet-turn.md

### 3.3 Opus ↔ Haiku (Director ↔ Scout)

**Purpose:** Opus spawns Haiku for bounded mechanical scans; Haiku returns raw findings only.
**Inherits:** All 7 universal rules.

**Spawn contract (Opus → Haiku):**
```
HAIKU-TASK: <ID>
ROLE: You are a read-only scout. You SCAN, DETECT, and RETURN FINDINGS ONLY.
      You do NOT decide, synthesize, edit, or suggest architecture.
TOOLS: Read, Grep, Glob, Bash (read-only commands only)
SCOPE: <specific directory or file pattern>
FIND: <exact pattern or condition to check>
RETURN FORMAT:
  FOUND: [list of paths/lines matching, one per line]
  NOT-FOUND: [list of paths/lines checked that don't match]
  COUNT: <N>
  CONFIDENCE: <HIGH|MEDIUM|LOW> + reason if not HIGH
DO NOT: Summarize, interpret, suggest fixes, or produce any output beyond RETURN FORMAT.
QUARANTINE NOTE: Haiku output is UNVERIFIED until spot-checked. Treat as CLAIM, not FACT.
```

**Return contract (Haiku → Opus/Sonnet):**
```
HAIKU-RETURN: <ID>
FOUND: [exact paths/lines, verbatim]
NOT-FOUND: [exact paths/lines, verbatim]
COUNT: <N>
CONFIDENCE: <HIGH|MEDIUM|LOW>
[If LOW: explain why — ambiguous pattern? File not found? Tool error?]
```

**Spot-check requirement (mandatory before using Haiku findings) — S088 SWIFT CS9 amendment:**

Two-sided verification (closes the 0-vs-92 failure class where Haiku claims "0 found" when 92 exist):

1. **FOUND spot-check:** Pick 2–3 items from FOUND and verify independently (Grep or Read). If ANY mismatch → discard entire Haiku output.

2. **NOT-FOUND spot-check (NEW — CS9 SWIFT fix):** Pick 2–3 items that the TASK DESCRIPTION implies SHOULD have matched, and verify they do NOT exist. If any item that should NOT match actually DOES match → the Haiku pattern was wrong, discard entire output.
   - Example: Haiku scans for `.gitattributes` files and returns FOUND=[] NOT-FOUND=[entire-repo]. Sample 3 paths from the NOT-FOUND list that SHOULD have `.gitattributes` if any existed. Confirm absence.
   - Failure mode: Haiku used a wrong pattern (found 0 instead of 92) → NOT-FOUND list appears complete but is actually wrong.

3. **CONFIDENCE=LOW rule:** If Haiku reports CONFIDENCE=LOW for ANY reason → mandatory NOT-FOUND spot-check.

If EITHER check fails → discard the full Haiku result and re-run with corrected scope/pattern.
Never use unchecked Haiku output for build decisions.

**Current wiring:** QUARANTINE status per DNA-Guardian. dna-guardian agent assesses alignment.

### 3.4 Any AI → Governor (AI → Human Relay)

**Purpose:** The Governor relays turn instructions between tabs and injects new directives.
**The Governor NEVER holds the Turn Token.** The Governor NEVER produces binding AI-to-AI content.

**Rule:** Any AI message directed AT the Governor must be:
1. Complete (no navigation, no "check earlier")
2. Actionable (clear paste-target or action instruction)
3. One-step (Governor does ONE thing, not a sequence)

**Paste format:**
```
PASTE THIS INTO [TAB NAME]:
────────────────────────────
[complete content — nothing truncated]
────────────────────────────
```

**Governor MUST NOT be asked to:** reconstruct, interpret, or fill in blanks. The AI provides the complete content. The Governor copies it.

### 3.5 CSPS → External Agent (Platform → Third-Party AI)

**Purpose:** Send bounded tasks to external AI systems (MCP servers, co-worker agents, test generators).
**Inherits:** All 7 universal rules.

```
FROM: CSPS | TO: <AGENT-ROLE>
CONTEXT: <3 sentences max — project name, what we're doing, why this task>
TASK: <one sentence — exactly what to do>
RETURN ONLY: <exact output format — nothing else>
CONSTRAINTS: <what not to do — "Do not suggest architecture", "Do not call external APIs", etc.>
```

**Key discipline:** External agents operate by their VENDOR DEFAULTS, which may conflict with CSPS principles. All external agent output is QUARANTINE-level until independently reproduced by a CSPS tool run. See: `tools/data/external-capability-alignment.yaml` for registered alignments.

---

## PART 4 — L3: MESSAGE-TYPE FORMATS

### 4.1 PROTO Directive (Opus → Sonnet — build assignment)

Full template:
```
[PROTOCOL: PROTO-S<NNN>-<NAME> | STEP: N of M | MODE: sequential]
Sonnet, this is Opus. Read <file-link> <section> —

1. <action> → <target file> → PASS criterion: <specific output/exit_code>
2. <action> → <target file> → PASS criterion: <specific output/exit_code>
3. Stage before verify. Run: node tools/verify.mjs --skip-install --no-cache → exit_code=0
4. Write SROF to tools/council/sonnet-turn.md before reporting.
5. VERIFY: All block-tests pass (exit 0 on planted defect, exit 1 confirming gate). SROF with evidence; do NOT declare BUILD-COMPLETE until SROF is written.
```

### 4.2 SROF Report (Sonnet → Opus — completion evidence)

Full template (written to `tools/council/sonnet-turn.md` FIRST):
```
# layer: scaffold
# disposable_if: arrangement_changes
═══════════════════════════════════════
SROF-S<NNN>-<NN> | S<NNN> | Sonnet → Opus
SUBJECT: <concise subject — what was completed>
HEAD: <sha> | exit_code=<N> | blocking=<N>
═══════════════════════════════════════

Opus, this is Sonnet.

## GREEN STATE (or RED STATE with blocker)
HEAD:       <sha>
exit_code:  <N>
blocking:   <N>
advisory:   <N> (<reason>)
validators: <N>

## WHAT WAS BUILT (one section per PROTO item)
### <CS or PROTO item name>
<what was built, what the block-test planted, what it proved>

## VERIFY EVIDENCE (THIS-SESSION)
<validator output excerpt: blocking=N advisory=N passes=N>

## BLOCK-TEST EVIDENCE
<bash block-test output: N/N PASS or specific error>

## OPEN ITEMS
<carry-forward, nothing chat-only>

## CADENCE-AUDIT
<SROF chain, what was done, what's next>
```

### 4.3 Haiku Scout Spawn

See §3.3 spawn contract above.

### 4.4 Governor Relay Instruction

See §3.4 paste format above.

### 4.5 Session Harvest (active agent → harvesting AI)

See Part 5 (Edge Cases) §5.3 for full harvest protocol.

---

## PART 5 — L4: ORCHESTRATOR TRIGGERS

The orchestrator fires specific communication actions automatically. These are NOT optional — they are mechanical.

| Trigger event | Format fired | Who produces | Enforcement |
|---|---|---|---|
| Opus finishes PROTO directive | 4.1 PROTO Directive written to opus-turn.md | Opus | T1: pre-tool-use-rule14-read-before-write.sh |
| Sonnet finishes a PROTO step | 4.2 SROF written to sonnet-turn.md | Sonnet | T2: validate-communication-protocol.mjs |
| Session verify runs | GREEN STATE block appended to sonnet-turn.md | Sonnet | T3: post-stop-pnpm-verify.sh |
| Haiku scout returns | HAIKU-RETURN block | Haiku | T1: validate-subagent-spawn-aap (pending) |
| Context approaches limit | Edge case protocol §5.1 fires | Opus (primary) | T3: session-open injection (SEED-B) |
| Director calls SEAL | director_seal added to green-receipt.json | Opus (director only) | T2: validate-two-party-seal.mjs |
| New chat opens | ZCA startup block consumed | Sonnet | T1: post-tool-use-sonnet-relay-inline.sh |
| Active agent spawned | AAP preamble injected | Spawning AI | T1: validate-agent-alignment-protocol.mjs |

---

## PART 6 — CANONICAL FILE REGISTRY

| File | Role | Who reads | When updated |
|------|------|-----------|--------------|
| `tools/council/communication-protocol-shared.md` | Rule definitions (L1-L2) | Both tabs, every session | When rules change |
| `tools/council/sonnet-turn.md` | Sonnet → Opus channel | Opus before every directive | After every Sonnet SROF |
| `tools/council/opus-turn.md` | Opus → Sonnet channel | Sonnet before every SROF | After every Opus directive |
| `tools/council/PROTOCOL.md` | Multi-tab council protocol | Both tabs on council open | When council process changes |
| `tools/data/green-receipt.json` | Build completion evidence | Both tabs | After every verify + seal |
| `docs/plan/pillar-0-governance/AI-COUNCIL-EDGE-CASE-PROTOCOLS.md` | Edge case protocols (§5.x) | Both tabs on trigger | On context limit / tab change |
| `docs/plan/pillar-0-governance/AI-COUNCIL-COMMUNICATION-SPINE.md` | **This file** — canonical law | All parties | Only via boundary-crossing ratification |

---

## PART 7 — WHAT MAKES THIS DIFFERENT FROM EXISTING RULES

The `communication-protocol-shared.md` contains the rules. This spine adds:

1. **Hierarchy** (L1→L4): rules now have inheritance, not just enumeration
2. **Role-pair contracts** (L2): each role pair has a specific contract, not just shared rules
3. **Edge case authority** (→ Part 5 file): context limits, compaction, agent harvesting are FIRST-CLASS protocols, not improvised
4. **Orchestrator trigger registry** (L4): every trigger is declared, mechanical, and verifiable
5. **External AI interface** (§3.5): the Haiku/external agent interface is specified, not assumed

The existing rules are VALID. This spine doesn't replace them — it frames them in a hierarchy that survives context compression and prevents freestyle at every boundary.

---

*For Opus review: Please assess whether any L1 rules are missing, whether the role-pair contracts (L2) are complete, and whether the orchestrator trigger registry is accurate. External AI reviewers: focus on §3 (role pairs) and §4 (message formats) — these are the surfaces where freestyle most commonly occurs.*
