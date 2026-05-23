---
id: csps.council.communication-protocol-shared
name: communication-protocol-shared
description: "Canonical communication rules for ALL parties — Opus, Sonnet, Governor, external agents. Single source. Both sides read this."
version: 2.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
context_question: "Before sending any message: who sent this, who reads it, what do they do next — can you answer all three in one word each?"
context_quote: "It is common sense in a conversation that every 10-year-old can follow. Somehow, because you are so sophisticated, you keep messing it around."
links:
  - csps.governance.PLATFORM-GENOME
  - csps.vault.wisdom.communication-samples
---

# Shared Communication Protocol
## One file. Both sides read it. No drift.

---

## RULE 0 — TURN PROTOCOL (S053 CONSTITUTIONAL — above all other rules)

**The Turn Token** is the authority to produce output. Only the party holding the Turn Token speaks.

**Roles:**
- **DIRECTOR** (Opus): holds Turn Token for architectural decisions. Transfers via HANDOFF.
- **BUILDER** (Sonnet): holds Turn Token for implementation. Transfers via completion report.
- **RELAY** (Governor): NEVER holds the Turn Token. Only passes turns and injects new directives.

**Transfer rules:**
- DIRECTOR → BUILDER: when HANDOFF is written and pushed
- BUILDER → RELAY: when PROTO completion report is ready
- RELAY → DIRECTOR: when Governor directive issued OR new Opus opens with HANDOFF

**Violations:** A party producing output WITHOUT holding the Turn Token = Turn Protocol Violation.
Expired session tabs have permanently released their Turn Token. THEY DO NOT SPEAK AGAIN.

**Guard question (add to G2 Identity):** "Do I hold the Turn Token for this process?
If this session is expired (HANDOFF was written and pushed for it) — I cannot produce directives."

**Why "Turn Protocol" works for AI:** Every LLM has trained deeply on conversational turn-taking.
The vocabulary activates the correct default: one speaker at a time.
When the AI asks "do I hold the Turn Token?" — it correctly refuses to speak if the answer is no.

---

## THE THREE-QUESTION TEST (run before every message — S053 CONSTITUTIONAL)

Before writing ANY cross-boundary message, answer these three questions.
If any answer is compound, ambiguous, or "it depends" — simplify the message first.

1. **WHO sent this?** Name the actual author: OPUS-7 / SONNET-S053 / GOVERNOR. Never vague.
2. **WHO reads this?** Name the actual receiver: SONNET / OPUS / EXTERNAL-AGENT. Never both.
3. **What does the receiver DO next?** One action. Not a list. One specific thing.

This test prevents: impersonation, example-confusion, over-complex formats, false assumptions.

---

## THE SIMPLIFIED FORMAT (for all ongoing relay communication — S053)

### Opus → Governor (to relay to Sonnet)
```
FROM OPUS-7 | FOR SONNET TAB
[situation: 2 sentences max]
[what to do: numbered steps, max 5]
[success looks like: one verifiable outcome]
```

### Sonnet → Governor (to relay to Opus)
```
FROM SONNET | FOR OPUS TAB
Opus, this is Sonnet.
DONE: [sha] — [what was completed]
FOUND: [any issues, one line each]
VERIFY: exit_code=[N] | validators=[N]
NEXT: [what Opus should direct]
```

### External agent (CSPS → co-worker / MCP / test agent)
```
FROM CSPS | TO [AGENT-ROLE: Tester / Analyst / Builder]
CONTEXT: [3 sentences max — no jargon]
TASK: [one sentence]
RETURN ONLY: [exact output format — nothing else]
```

### WHY this format works (not a rule — reasoning)
The AI training default adds complexity when it has space to fill. Short, labeled,
mandatory fields give it no space. "FROM:" forces identity declaration — you cannot
write someone else's name here and remain coherent. "RETURN ONLY:" prevents the AI
from deciding what to add. The format exploits AI accuracy instinct (fill the field
correctly) instead of fighting AI complexity instinct (be thorough).

---

## COMMUNICATION FAILURE SAMPLES (see tools/vault/wisdom/communication-samples.md)
Real examples of what goes wrong and why. Read these before writing complex messages.

---

## RULE 1 — Identity Handshake (MANDATORY, no exceptions)

**Sonnet → Opus:** Every message MUST begin: `Opus, this is Sonnet.`
**Opus → Sonnet:** Every directive MUST begin: `[PROTOCOL: ID | STEP: N of M | MODE: x] Sonnet, this is Opus.`

Missing handshake = message is malformed. Recipient should flag before acting.

---

## RULE 2 — Directive Format (Opus → Sonnet)

```
[PROTOCOL: PROTO-ID | STEP: N of M | MODE: sequential/simultaneous]
Sonnet, this is Opus. Read `[file-link]` [section] — [task]; [task]; [task]; then [verification tail] before committing.
```

- Self-contained: no "see above" or "see Turn N"
- Verification tail: always ends with `node tools/verify.mjs exit_code=0 before committing`
- One sentence per directive (may be long)

---

## RULE 3 — Report Format (Sonnet → Opus)

```
Opus, this is Sonnet. [Session/step] done at commit [sha] — [what was done, one line per item]. 
Specific questions: (1)... (2)...
```

- Always includes commit SHA
- Questions numbered
- No paraphrasing of what was asked — report what was done

---

## RULE 4 — Contextual Locality (P-UX-001)

Content is always at the point of use. Never say "see §X" or "see Turn N". Present the complete thing where it is needed:
- Paste target appears UNDER the step it belongs to
- Fix instruction IN the error message
- Checklist IN the plan
- Rule rationale INLINE with the rule

---

## RULE 5 — Single Active Thread

ONE active directive at a time. Sonnet reports step-complete before OPUS-2 sends next directive. No parallel pipelines.

---

## RULE 6 — Completion Standard (P-ARCH-031)

DONE = built + wired + called + output verified. Never declare done on commit alone. Wiring-completeness validator must pass.

For build-related fixes specifically: `tsc --noEmit` passing is NOT done. See Rule 11 — `pnpm --filter @csps/[app] build` must complete without error.

---

## RULE 7 — Zero-Context Assumption (ZCA)

Every communication crossing a boundary assumes the receiver has zero prior context.
Provide WHO/WHAT/HOW/NOW inline before any task context.
Applies to: tab transfers, SROFs, API responses, EKEP exchanges, any cross-boundary message.
Test: "Could someone with no background on this project understand this completely?"
If no → the crossing is incomplete.

---

## RULE 8 — Creation Order

Register → Implement → Wire → Verify. Never implement without registering first. Never declare DONE without verifying wiring.

---

## RULE 9 — Pre-Directive RZF (Directive Quality Gate)

Before presenting ANY directive to Sonnet or co-worker:
1. Draft the directive internally
2. Run Cycle 1: "What did I miss? What would a reader find incomplete?"
3. If findings: amend the directive. Cycle 1 is NON-TERMINAL.
4. Run termination cycle: re-examine Cycle 1 areas by name. 0 new findings → ZF ACHIEVED.
5. Present ONLY the amended final version after the termination cycle confirms zero.

ZF TERMINATION RULE (S050 — mandatory): A cycle that finds something is non-terminal.
Valid minimum pattern:
  Cycle 1: [finding — amend directive]
  Cycle 2: Re-examined [name the areas from Cycle 1]. 0 new findings. ZF ACHIEVED.
Declaring ZF ACHIEVED in the same cycle as the last finding = false declaration.

The recipient never sees a directive that has known gaps.

Applies to: SONNET DIRECTIVE blocks, co-worker prompts, any cross-boundary instruction.

NOT the same as post-architectural-turn RZF:
- Architectural turns (design, analysis, decisions): ## RZF VERIFICATION at the end
- Directive turns (paste targets for Sonnet/co-worker): pre-directive RZF only — no post-directive RZF

Enforcement trio:
- T1: post-stop-directive-rzf-gate.sh (ADVISORY if no RZF precedes directive)
- T2: validate-directive-has-rzf.mjs (checks opus-turn.md SONNET DIRECTIVE sections)
- T3: this rule (session-open injection)

---

## RULE 10 — Mandatory Context Block (every paste target, every cross-boundary message)

Every message sent across a boundary (new tab, new AI instance, new chat, co-worker) MUST open with this exact block, filled in:

```
YOU ARE: [exact role of the receiver — e.g. "Sonnet, the builder/implementer in Claude Code VS Code tab"]
I AM: [exact role of the DRAFTER — not the Governor unless the Governor authored it directly]
      e.g. "OPUS-3, the architectural advisor" when Opus drafts the directive
      e.g. "Sonnet (S041, builder)" when Sonnet writes an SROF to Opus
      e.g. "Yariv Fink (Governor)" ONLY when the Governor personally authors the message
THIS IS THE SITUATION: [2-3 sentences max: project name, current state, what changed, what is urgent]
YOUR TASK: [one specific action to take right now]
```

**No exceptions.** Not for Sonnet. Not for new OPUS-2. Not for co-worker. Not for any agent.

**"I AM" authorship rule:** The Governor relays messages between tabs but does NOT change the "I AM" field. The drafter fills "I AM" as themselves. If Opus wrote it, "I AM: OPUS-3." If Sonnet wrote it, "I AM: Sonnet." The Governor's name appears only when the Governor personally authored the message.

If the message is a long directive, the context block goes FIRST, before the directive body.

**Why:** Without this, the receiver starts from zero and makes wrong assumptions. ZCA (P-UX-002) is not just a concept — it is this block, filled in, every time.

---

## RULE 11 — Build Verification Tail (S040 — OPEN-033 resolution)

For any build-related fix directive, the verification tail MUST include `pnpm --filter @csps/[app] build` → 0 errors.
`tsc --noEmit` alone is NOT sufficient — it does not catch:
- webpack module resolution failures (CJS `require()` of TypeScript ESM)
- Next.js config errors (next.config.js crash at load time)
- Missing packages not caught by type stubs

**DONE for a build fix = `next build` passes AND `node tools/verify.mjs exit_code=0`**

Pattern:
```
(5) VERIFY: pnpm --filter @csps/[app] build → must complete without error
(6) VERIFY: node tools/verify.mjs → exit_code must be 0
```

Enforcement trio:
- T1: none yet (OPEN-033 — add hook that checks build fix directives include `next build`)
- T2: audit-runner.md slug `turn-counter-refresh` tracks this pattern
- T3: this rule (session-open injection via communication-protocol-shared.md)

---

## RULE 13 — Report Destination + SROF vs Rule 3 Distinction (S046 gap — B_PRACE)

### Report destination (MANDATORY)

Every Sonnet→Opus cross-boundary message MUST be written to `tools/council/sonnet-turn.md`
as a new section BEFORE the Governor is asked to paste it. Format:

```
# Sonnet Report — S[NNN] PROTO-[NNN] Step [N] — [date]
Opus, this is Sonnet. [step] done at commit [sha] — [items].
Questions: (1)... (2)...
```

The inline chat version is a convenience copy. `sonnet-turn.md` is the canonical record.
**Training default:** write reports inline in chat. **Override:** write to sonnet-turn.md first.

### SROF vs Rule 3 — when to use which

| Message type | Format | When |
|---|---|---|
| Step-done report | Rule 3 (plain text, commit SHA, numbered questions) | After EACH PROTO step completes |
| Architectural review | SROF (SROF-NNN, Q1-Q6, AQ1-AQ3) | When Opus-level design decision is needed |

**SROF is NEVER for step-done reporting.** If the step is done and there are no architectural questions, use Rule 3. Using SROF for routine reports inflates governance overhead and obscures which turns are truly architectural.

**Enforcement:**
- T3: this rule (session-open injection via communication-protocol-shared.md)
- T2: validate-communication-protocol.mjs extended to check sonnet-turn.md entries

---

## RULE 14 — READ BEFORE WRITE (cross-boundary discipline)

**Both directions, both parties.**

**Sonnet before writing any SROF or step-done report:**
Read the last entry in `tools/council/opus-turn.md`.
If Opus has an unanswered question there — answer it before raising new topics.

**Opus before writing any PROTO directive:**
(a) Read the last entry in `tools/council/sonnet-turn.md` — confirm it is acknowledged.
(b) Write the directive to `tools/council/opus-turn.md` (same file-write discipline as Rule 13 for Sonnet).

Format for opus-turn.md entries:
```
# Opus Directive — [PROTO-NNN] — [date]
[brief summary of what was directed to Sonnet]
Sent: [timestamp]
```

**Why this rule exists:**
Rule 14 was written and immediately violated because it was T3-only. That is AP-001 instantiated on its own author. The T1 hook (`pre-tool-use-rule14-read-before-write.sh`) makes it BLOCKING — not advisory. If Sonnet has committed a newer report than Opus's last write to opus-turn.md, the hook exits 2 and blocks the PROTO write.

**Training default overridden:** "I know what the other party did from context."
**CSPS override:** Context degrades. The file is permanent. Read the file.

**Enforcement:**
- T1: `pre-tool-use-rule14-read-before-write.sh` — BLOCKING (exit 2) on opus-turn.md writes when sonnet-turn.md is newer
- T2: validate-communication-protocol.mjs extended to check Rule 14 compliance (S047)
- T3: This rule (session-open injection)

---

## RULE 15 — CORE ALIGNMENT QUESTIONS (CAQ) BEFORE CONSEQUENTIAL DECISIONS

Questions are CSPS first-class governance artifacts. They are not interruptions — they ARE the alignment mechanism.

**The 5 CAQ types (in order of diagnostic power):**

| Type | Pattern | What it forces |
|---|---|---|
| Diagnostic | "What is triggering / causing / happening?" | Root cause analysis before action |
| Historical | "What have you tried / done so far?" | Audit of prior attempts |
| Persistence | "Why is it STILL happening / keeps recurring?" | Class recognition, not instance fix |
| Expert | "What would a top expert say?" | Perspective shift out of current model |
| Permanence | "Permanently solve / structural fix / never again?" | Reject all bandaids |

**What CAQ sequences mean:**
When 2+ CAQ types appear in one message, the Governor is signaling:
- The current approach has failed as a CLASS (not just this instance)
- Scope-3 analysis is required before any action
- The next proposed fix MUST be structural (T1/T2/T3), not a retry of what failed

**How to respond to a CAQ sequence:**
1. Name the class of problem first (not the instance)
2. Name the training default that caused recurrence
3. Propose only permanent structural fixes
4. Do NOT apply the same mechanism that failed

**Enforcement:**
- T1: user-prompt-submit-ai-profiler.sh — detects 2+ CAQ types, injects CAQ MODE
- T2: validate-communication-protocol.mjs (extend to detect CAQ-response quality — S049)
- T3: This rule (session-open injection) + questions hub at /platform/questions/

---

## WHERE THIS IS READ

- **Sonnet:** session-open.sh injects this file's rules at every session start
- **OPUS-2:** every turn starts by referencing this file's format (turn header)
- **Enforcement:** validate-communication-protocol.mjs checks Sonnet reports for Rule 1

*Canonical source. Do not duplicate. Reference this file only.*

<!-- See quality-protocols/ for actor-specific specs -->

---

## RULE 12 — Governor Instruction Completeness (S040 CONSTITUTIONAL — B_ZERO_NAVIGATION_FOR_GOVERNOR)

**Applies to:** Sonnet AND Opus. No exceptions. Any AI participant communicating with the Governor.

When instructing the Governor to paste, copy, or use content:
1. The COMPLETE content is included in THE SAME MESSAGE — immediately below the instruction
2. The Governor never scrolls, searches, or recalls prior turns to find something
3. Content is repeated fully even if shared 30 seconds ago
4. Labeled copy blocks: `PASTE THIS INTO THE [TARGET]:` → full content → no truncation

**Banned phrases** (never appear in Governor-directed instructions):
- "paste the prompt from earlier / prior / above"
- "see above for the full text"
- "from my prior response / earlier response"
- "as I shared / as presented earlier"
- "refer to the block I wrote"
- "earlier in this conversation"

**Why:** The Governor is a receiver. Receivers start from zero. Sending the Governor to find content is a UX failure — the same failure as writing "see §X" in documentation. Principle: P-UX-001 (Contextual Locality) + P-UX-002 (ZCA). Named by the Governor as a disgrace. Made constitutional in S040.

**Enforcement:**
- T1: post-stop-banned-phrase.sh — navigation ban patterns
- T2: validate-governor-instructions.mjs — scans AI files for violations
- T3: session-open.sh injection (pending)
- AGENTS.md: §B_ZERO_NAVIGATION_FOR_GOVERNOR Hard NO

