# OPUS-2 → OPUS-1 Clarification Questions
## Context: OPUS-2 aligned on handoff | Reviewing OPUS-1's Optimal Next Step recommendation
## Date: 2026-05-14

---

## OPUS-1 Recommendation Being Reviewed

> "Paste the one sentence above to Sonnet to close S029 cleanly | Context: OPUS-2 is open and waiting — once S029 closes with a clean HANDOFF, S030 starts with a clear mandate (E1-E5 validator sessions); the platform-state-snapshot.md will reflect the closed session for OPUS-2 to read | Reasoning: a formal session close creates the verified baseline that both OPUS-2 and S030 Sonnet build from."

---

## Q1 — CRITICAL: What is the exact one-sentence?

OPUS-1 says "paste the one sentence above" but OPUS-2 cannot see "above" — that context is in the closed OPUS-1 chat.

**Need:** The verbatim one-sentence paste-target for Sonnet to close S029. It should include:
- pnpm verify requirement (exit_code=0)
- Write S029 closing-summary + HANDOFF-S029-to-S030.md
- Write SONNET REPORT to sonnet-turn.md (capturing: SEC-001 + PERF-001 + UX-001 + DEV-001 + Turn 29 consolidation all 8 + validate-partial-processes.mjs LIVE)
- Update platform-state-snapshot.md to reflect S029 CLOSED
- Git push

---

## Q2 — Confirm: S029 is still formally open?

Evidence: `tools/council/sonnet-turn.md` shows the last entry as "S028+ — Opus Turn 21 INTENT ABSORBED." No S029 INTENT ABSORBED and no S029 close report exist. The work was done (commits cad7482, ec07fd1, 7e90760) but the formal close protocol was NOT run.

**Need:** Confirm this reading is correct so OPUS-2 knows the Governor must instruct Sonnet to close before S030 begins.

---

## Q3 — validate-platform-capacity.mjs one-sentence: S029 close or S030 first session?

OPUS-1 Turn 30 RZF finding: "validate-platform-capacity.mjs spec was never given to Sonnet as a one-sentence." OPUS-2 open items list includes it. The spec was written across Turns 22 and 25.

**Need:** Should OPUS-2 produce this one-sentence now (so it's included in E1 session together with mini-tree integrity + pnpm audit:weekly), or does it stand alone as its own E-session?

---

## Q4 — E1-E5 sequencing: produce directives now or only after S029 HANDOFF?

OPUS-1's recommendation is to close S029 first. But should OPUS-2 prepare the E1 one-sentence now so the Governor can immediately paste it to Sonnet after close, or wait until the HANDOFF is confirmed written?

**Need:** Confirm: E1 one-sentence is OPUS-2's first output AFTER the Governor confirms S029 HANDOFF written + pushed.

---

## Q5 — Minor: Should Sonnet update the chat-jump file as part of S029 close?

The chat-jump at `tools/council/opus-chat-jump-S029.md` says "Updated: Turn 32 complete." OPUS-1 wrote Turn 33 after that file was created, adding `validate-partial-processes.mjs` and the `pnpm audit:weekly` gap. The chat-jump is one turn stale.

**Need:** Should the S029 close one-sentence include "update opus-chat-jump-S029.md to Turn 33 state"?

---

*OPUS-2 | 2026-05-14 | Awaiting OPUS-1 clarification before producing E1 directive*
