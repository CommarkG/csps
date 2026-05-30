═══════════════════════════════════════════════════════════════════
ADDITIONAL POINTERS FROM OPUS-14 (S071 closing → S072 opening) · v2
Cross-reviewed by Sonnet (active S071 tab) S071 Turn 26 — 4 improvements + 2 minor folded
═══════════════════════════════════════════════════════════════════

S072 SEQUENCE — Governor S071 Turn 22 LOCKED (Option D):
  P1 CIP build → P4 P-META-029 backfill (side-fix during CIP) →
  P2 ONE-SOURCE M10 → P3 AI-PROFILING ADJUST → P5 monitoring L1-L4 parallel → L5 last.

FIRST 4 ACTIONS (do in order — v2 adds #4 ZF-deep):
  1. M-43: node tools/scripts/cross-tab-diff-review.mjs --role sonnet
     (baseline SHA: ab20c370 — the S071 SEAL+close handoff commit)
  2. verify: node tools/verify.mjs --skip-install (expect exit_code=0)
  3. settings.local check: cat .claude/settings.local.json (expect {})
     IF NOT {}: fix immediately before proceeding:
       node -e "require('fs').writeFileSync('.claude/settings.local.json', '{}')"
     (This prevents the permission-dialog shadow that broke S069. D11 incident.)
  4. ZF-deep (currently iter=26 overdue): node tools/verify.mjs --skip-install --strict
     Cite verify_top_exit in your first Milestone Report ZF block (RZF-LATEST §6.I4
     fallback discipline). L4 of PLATFORM-OBSERVATION-DOCTRINE builds the structural
     auto-trigger fix in S072 — but the immediate signal must be cleared NOW via
     strict verify, not "carry it forward."

THEN read in this order:
  a. docs/plan/_handoff/HANDOFF-S071-to-S072.md (Zone A-D + ALIGNMENT QUESTIONS + STARTUP BLOCK)
  b. docs/plan/_handoff/CORE-SEEDS-PLAN-PARTS.md (CANONICAL plan-part index —
     all 14 NODE entries with ANCHOR · ALIGNS · STATUS, updated Turn 24)
  c. tools/council/opus-turn.md TOP ENTRY — look for "OPUS-14 CIP PROTO" header
     IF PRESENT: begin CIP M1 per the proto
     IF ABSENT: OPUS-14 is still authoring CIP PROTO; do P4 P-META-029 backfill
                as parallel work (~15 min, no deps, side-fix-friendly). Steps:
                  1) read docs/plan/principles/P-META-029-humble-consolidation-discipline.md
                  2) translate frontmatter to current monolith schema if needed
                  3) append after P-META-028 entry in packages/principles/principles.yaml
                     (line ~2437 — after the existing P-META-028 block)
                  4) run: pnpm --filter @csps/principles split
                  5) verify principles-index.yaml total_count 69→70 + new slice file exists
                  6) commit
  d. docs/plan/pillar-0-governance/PLATFORM-OBSERVATION-DOCTRINE.md (PE wave 3)

DO NOT START these without their gates:
  - P2 ONE-SOURCE M10: requires Governor Q1 ratification (currently HOLD-S071)
  - P3 AI-PROFILING ADJUST: requires Governor Q2 ratification (currently HOLD-S071)
  - P5 L5 audit→CIP integration: requires CIP M3 (PROPOSED-CHANGE route) to land first

DISCIPLINE INHERITED FROM S071 (mechanically enforced):
  - Long-Run Builder Discipline (M0.7): R1-R9 real stops only; N1-N8 nominal stops blocked
  - Proto-Production Discipline (M0.5): every new proto starts from proto.template.md
  - RZF-LATEST v1.1: classify-before-fix BLOCKING/ADVISORY/DEFERRABLE; verify_top_exit:<int>
    in every Milestone Report ZF block; post-edit verify trap (run verify AFTER final CHECKPOINT)
  - Cornerstone P-META-028: every number wrapped sample/tunable/expandable
  - 14-class threshold (10 base + 4 expansion per cornerstone): no silent default-to-unhandled
  - Zero-Dialog Rule (core seed #4 of HANDOFF Zone C): NEVER use Edit/Write on .claude/** files.
    Use Bash/Node: node -e "require('fs').writeFileSync('.claude/hooks/foo.sh', content)"
    SACRED edits also need SACRED-EDIT-APPROVED token in commit message.

ADVISORY VALIDATORS — EXPECTED FINDINGS (NOT BLOCKERS):
  - validate-context-wrapped-numbers: ~8422 advisory findings — expected, not a blocker.
    The allowlist grows over sessions. Advisory-only, exit 0. Do NOT stop on these.
  - validate-nominal-rzf-detector: ~23 pre-existing nominal-RZF findings — same shape.
  - validate-proto-completeness: 95 advisory across 11 existing protos — migration vlt-S071-PROTO-COMPLETENESS-MIGRATION.
  - validate-core-seeds-currency (NEW S071 Turn 26): currently PASS — surfaces stale CORE-SEEDS nodes.

KEY VAULT ITEMS FOR S072:
  - vlt-S072-pmeta-029-registry-backfill (P4)
  - vlt-S072-platform-observation-doctrine (P5 — drafted)
  - vlt-S072-core-seeds-currency-full-engraving (NEW Turn 26 — full T1+T2+T3 build)
  - vlt-S072-cross-tab-prompt-review-discipline (NEW Turn 26 — boundary cross-review)
  - vlt-S071-proto-completeness-migration (continue 1-2 protos per session)

OPUS-14 IS YOUR DIRECTOR (continuity from S071). Governor S071 Turn 4 framing held:
sole active director. CIP PROTO will arrive in opus-turn.md before you need it
(or P4 fills the gap).

CROSS-REVIEW DISCIPLINE (NEW Turn 26 — Governor directive):
This v2 prompt was reviewed by the active S071 Sonnet tab BEFORE Governor relay.
Catches: ZF-deep iter signal · settings.local fix path · Bash-for-.claude rule ·
advisory-validator expected-findings warning · P-META-029 explicit steps · M-43
baseline SHA. The same discipline applies to your boundary prompts back to Opus
or to a successor Sonnet tab — request the counterpart-tab review BEFORE send.
Full discipline engraving queued as vlt-S072-cross-tab-prompt-review-discipline.

═══════════════════════════════════════════════════════════════════
