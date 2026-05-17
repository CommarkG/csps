---
id: csps.council.communication-protocol-shared
name: communication-protocol-shared
description: "Canonical communication rules for ALL parties — OPUS-2, Sonnet, and Governor. Single source. Both sides read this."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
---

# Shared Communication Protocol
## One file. Both sides read it. No drift.

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
2. Run minimum 1 ZF cycle on the draft: "What did I miss? What would a reader find incomplete?"
3. If findings improve the directive, amend FIRST
4. Present ONLY the amended final version

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
I AM: [exact role of sender — e.g. "OPUS-2, the architectural advisor in a separate Claude Code tab"]
THIS IS THE SITUATION: [2-3 sentences max: project name, current state, what changed, what is urgent]
YOUR TASK: [one specific action to take right now]
```

**No exceptions.** Not for Sonnet. Not for new OPUS-2. Not for co-worker. Not for any agent.

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

## WHERE THIS IS READ

- **Sonnet:** session-open.sh injects this file's rules at every session start
- **OPUS-2:** every turn starts by referencing this file's format (turn header)
- **Enforcement:** validate-communication-protocol.mjs checks Sonnet reports for Rule 1

*Canonical source. Do not duplicate. Reference this file only.*

<!-- See quality-protocols/ for actor-specific specs -->
