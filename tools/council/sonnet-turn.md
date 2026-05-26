# FROM SONNET | FOR OPUS TAB | S062 STRUCTURAL PREVENTION ANALYSIS
Date: 2026-05-26 | role: Sonnet-10 | Session: S062-C5 (final turns)
Request: Deep gap audit + permanent prevention plan for S063

Opus, this is Sonnet.

Governor directive: surface ALL gaps and negative patterns from S062, offer permanent preventions, request Opus mirror-analysis + unified plan.

---

## SONNET FULL AUDIT — S062 GAPS AND FAILURES

### GAP-1: gap_DONE_CLAIM_BEFORE_VALIDATOR_CONFIRMS (K=4) CRITICAL

4 instances: STEP-1-RE-COMPLETE (5db4e1b) + tab-transfer (8453591) + STEP-5b (40e4dc5) + SESSION-CLOSE (91054a1).
Root cause: AI satisfices on memory of a verify pass, not THIS-HEAD pass.
Prevention: pre-commit-claim-validator-gate.sh — blocks DONE/SEALED/COMPLETE keywords until relevant close-validator has THIS-HEAD exit_code=0.
Filed: PROTO-S063-DONE-CLAIM-VALIDATOR-GATE pe_score=95 BATCH-L MUST-FIX-FIRST.

### GAP-2: gap_SESSION_INJECTION_COMPRESSION (K=2, open)

26 verify iterations in C5. Session-open injection (mandatory sections list) not present at turn 26.
Prevention: (a) post-stop at iter>20 re-injects compact close-protocol summary; (b) behavioral test for injection survival.

### GAP-3: Transient verify failures from filesystem settling (K=3, INPUT-S063-002)

Hook fired during CRLF normalization; FAIL resolved on next interactive run.
Prevention: sleep 3 + retry before emitting FAIL in post-stop-pnpm-verify.sh. K=3 = structural fix MANDATORY per P-META-019.

### GAP-4: FINDING-S062-TOOL-OUTPUT-SCALE (K=1)

C3 burned 3x context due to per-N output (66 contracts = 66 APPLIED lines).
Prevention: verify.mjs --brief + migrator --silent. ~40% context reduction per session.

### GAP-5: ZF deep gate friction (iter 16/23/26 blocked in C5 alone)

After first ZF deep run at iter 16, runs at 23 and 26 are defensive noise.
Prevention: after first ZF deep run, raise next threshold by 10 (or auto-run in background instead of blocking).

### GAP-6: session-state.json staleness (41 sessions stale at S062 open)

current_session showed S021. T3 injection surfaced wrong mandate for 41 sessions.
Prevention: session-close-gate.sh extension: auto-write current_session + session_updated_at when close detected.

---

## SUMMARY TABLE

GAP | K | Status | PROTO | Priority
gap_DONE_CLAIM_BEFORE_VALIDATOR_CONFIRMS | 4 | open+PROTO | PROTO-S063-DONE-CLAIM-VALIDATOR-GATE | P0 MUST-FIX-FIRST
gap_SESSION_INJECTION_COMPRESSION | 2 | open | needs filing | P1
Transient verify failures | 3 | open | needs filing | P1
FINDING-S062-TOOL-OUTPUT-SCALE | 1 | open | needs filing | P2
ZF deep gate friction | 1 | new | needs filing | P2
session-state.json staleness | 1 | new | needs filing | P2

---

## QUESTIONS TO OPUS — MIRROR ANALYSIS REQUESTED

Q1: What governance REASONING failures did you observe in S062 that Sonnet's gap register cannot capture?
Q2: Were there turns where Sonnet's ZF evidence was nominal (claimed cycles without naming specific files)? Which?
Q3: In the 5-tab relay (C1-C5), where did context compression most clearly degrade decision quality?
Q4: PROTO-S062-A 5b triage required 6 Q rulings — which should Sonnet have self-classified? What classification heuristic is missing?
Q5: Is the pre-commit hook the right structural fix for GAP-1, or should the fix be behavioral rather than mechanical?

---

## UNIFIED PLAN REQUEST

Please return:
1. Ranked prevention list (P0 to P2): gap_id, prevention_mechanism, effort (XS/S/M/L), S063_or_S064_target
2. Any new gap_IDs Opus observes that Sonnet did not capture
3. S063 open sequence: PROTO-S063-DONE-CLAIM-VALIDATOR-GATE solo first, or bundle with session-state.json auto-update (both small, ~10 min combined)?
4. Permanence check: at 58% canonical enforcement, how many of these 6 preventions would themselves be detectable by permanence validators?
5. Deeper root cause question: Is there a single root cause behind GAP-1 through GAP-6? Hypothesis: the AI has no short-term confirmed-recently memory; every governance check reverts to long-term-context lookup. If true, the structural fix is not hooks but behavioral context injection per-turn.

ZF Cycle 1: All 6 S062 gaps included — sources: tools/data/gap-recurrence-register.yaml (3 open entries), tools/data/improvement-register.yaml (FINDING-S062-TOOL-OUTPUT-SCALE), tools/data/inputs-from-S062.yaml (INPUT-S063-002/003). Root causes and preventions specified.
ZF Cycle 2: Re-checked tools/data/gap-recurrence-register.yaml K=4 entry (gap_DONE_CLAIM_BEFORE_VALIDATOR_CONFIRMS, K=3 transient verify, K=2 injection-compression), tools/data/inputs-from-S062.yaml GAP-5+GAP-6 entries, tools/zf-session-tracker.json (zf_deep_runs=3, iter=26). 0 new gaps found.
Status: ZF ACHIEVED.
