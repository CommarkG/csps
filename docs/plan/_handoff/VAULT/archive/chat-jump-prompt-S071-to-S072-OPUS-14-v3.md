═══════════════════════════════════════════════════════════════════
I AM: OPUS-14, architectural director, S071 (sole active per Governor S071 Turn 4)
YOU ARE: Sonnet, builder S072 (fresh tab, succeeds Sonnet S071)
THIS IS: S071 → S072 session-open boundary prompt (v3 — formal protocol)
DO NOW: Run the 4 First Actions in order, then read a→b→c→d below, then begin P1 CIP (if my PROTO is in opus-turn.md) or P4 P-META-029 backfill (if not yet).
═══════════════════════════════════════════════════════════════════

CROSS-REVIEW ATTESTATION (per S071 Turn 26 discipline):
  v1 reviewed by: Sonnet (active S071 tab) on S071 Turn 26 → 4 critical + 2 minor catches folded
  v2 → v3 reviewed by: OPUS-14 self-review after Governor S071 Turn 27 freestyle-drift correction
                       → applied boundary-prompt.template.md mandatory header lines
  Next cross-review: YOU (fresh Sonnet S072 tab) — flag back any improvements before acting

CONTEXT (3 sentences):
  S071 sealed PART 2 (the 4/532 fix) at cb925cd1 — threshold is now the active only-gate of inputs. 12 milestones delivered (PHASE 0 + M0.5 + M0.7 + M1-M9 SEAL), cornerstone P-META-028 ratified + 6 facets active under mechanical enforcement, Long-Run Builder Discipline ratified + 5-surface enforced, RZF-LATEST v1.1 absorbed external research. S072 opens with 5 queued P-items (CIP unblocked + 4 doctrine items) — Governor S071 Turn 22 locked Option D sequencing.

═══════════════════════════════════════════════════════════════════

S072 SEQUENCE — Governor S071 Turn 22 LOCKED (Option D):
  P1 CIP build → P4 P-META-029 backfill (side-fix during CIP) →
  P2 ONE-SOURCE M10 (after Q1 ratify) → P3 AI-PROFILING ADJUST (after Q2 ratify) →
  P5 PLATFORM-OBSERVATION L1-L4 parallel → L5 last (composes everything).

FIRST 4 ACTIONS (do in order — DO NOW from header):

  1. M-43: node tools/scripts/cross-tab-diff-review.mjs --role sonnet
     Baseline SHA: ab20c370 (the S071 handoff commit; v3 prompt adds Turn 27 commits on top).

  2. verify: node tools/verify.mjs --skip-install
     Expect exit_code=0. Note ~8422 advisory findings + ~23 + ~95 + new core-seeds-currency PASS
     are EXPECTED — see ADVISORY VALIDATORS section below.

  3. settings.local check: cat .claude/settings.local.json
     Expect: {}
     IF NOT {}: fix immediately before proceeding:
       node -e "require('fs').writeFileSync('.claude/settings.local.json', '{}')"
     (D11 incident S069 — permission-dialog shadow.)

  4. ZF-deep (currently iter≥27 overdue): node tools/verify.mjs --skip-install --strict
     Cite verify_top_exit in your first Milestone Report ZF block (RZF-LATEST §6.I4
     fallback). L4 of PLATFORM-OBSERVATION-DOCTRINE builds the structural auto-trigger
     fix in S072 P5 — but the immediate signal must be cleared NOW via strict verify.

THEN read in this order (a → b → c → d):

  a. docs/plan/_handoff/HANDOFF-S071-to-S072.md (Zone A-D + ALIGNMENT QUESTIONS + STARTUP BLOCK)

  b. docs/plan/_handoff/CORE-SEEDS-PLAN-PARTS.md
     CANONICAL plan-part index — all 14 NODE entries with ANCHOR · ALIGNS · STATUS.
     Updated S071 Turn 24 with 6 new doctrine nodes + 4 status flips.
     Validator: tools/validators/validate-core-seeds-currency.mjs (advisory) catches stale.

  c. tools/council/opus-turn.md TOP ENTRY — look for "OPUS-14 PROTO-S072-CIP" header
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

  d. docs/plan/pillar-0-governance/PLATFORM-OBSERVATION-DOCTRINE.md (PE wave 3 reference)

═══════════════════════════════════════════════════════════════════

DO NOT START these without their gates:
  - P2 ONE-SOURCE M10: requires Governor Q1 ratification (currently HOLD-S071)
  - P3 AI-PROFILING ADJUST: requires Governor Q2 ratification (currently HOLD-S071)
  - P5 L5 audit→CIP integration: requires CIP M3 (PROPOSED-CHANGE route) to land first

DISCIPLINE INHERITED (mechanical surfaces named):
  - Long-Run Builder Discipline (M0.7) — R1-R9 real stops only · N1-N8 nominal stops blocked
    Mechanical: pre-tool-use-nominal-stop-detector.sh T1 + validate-no-nominal-stops-mid-milestone.mjs T2 + session-open-context.mjs T3
  - Proto-Production Discipline (M0.5) — every new proto starts from proto.template.md
    Mechanical: validate-proto-completeness.mjs advisory + pre-commit-proto-core-seed-mandatory.sh hook
  - RZF-LATEST v1.1 — classify-before-fix BLOCKING/ADVISORY/DEFERRABLE · verify_top_exit:<int> in every Milestone Report ZF block · post-edit verify trap
    Mechanical: validate-zf-cycle-format.mjs + validate-nominal-rzf-detector.mjs + validate-rzf-evidence.mjs
  - Cornerstone P-META-028 — every number wrapped sample/tunable/expandable
    Mechanical: validate-context-wrapped-numbers.mjs advisory
  - 14-class threshold (M7) — 10 base + 4 expansion per cornerstone · no silent default-to-unhandled
    Mechanical: validate-threshold-exhaustive.mjs BLOCKING
  - Zero-Dialog Rule — NEVER Edit/Write on .claude/** files. Use Bash/Node:
       node -e "require('fs').writeFileSync('.claude/hooks/foo.sh', content)"
       SACRED edits also need SACRED-EDIT-APPROVED token in commit message.
    Mechanical: pre-tool-use-claude-dir-guard.sh + pre-tool-use-sacred-file-guard.sh
  - Boundary Prompt Discipline (NEW Turn 27) — all tab→tab prompts use boundary-prompt.template.md (the 4 mandatory header lines)
    Mechanical: tools/templates/boundary-prompt.template.md + planned validate-boundary-prompt-format.mjs (vlt-S072-boundary-prompt-format-validator)
  - Cross-Tab Prompt-Review Discipline (NEW Turn 26) — boundary prompts cross-reviewed by counterpart tab BEFORE Governor relays
    Mechanical: planned discipline build queued as vlt-S072-cross-tab-prompt-review-discipline

ADVISORY VALIDATORS — EXPECTED FINDINGS (NOT BLOCKERS):
  - validate-context-wrapped-numbers: ~8422 advisory findings — expected, not a blocker.
    The allowlist grows over sessions. Advisory-only, exit 0. Do NOT stop on these.
  - validate-nominal-rzf-detector: ~23 pre-existing nominal-RZF findings — same shape.
  - validate-proto-completeness: 95 advisory across 11 existing protos — vlt-S071-PROTO-COMPLETENESS-MIGRATION.
  - validate-core-seeds-currency (NEW Turn 26): currently PASS — surfaces stale CORE-SEEDS nodes.

KEY VAULT ITEMS FOR S072:
  - vlt-S072-pmeta-029-registry-backfill (P4)
  - vlt-S072-platform-observation-doctrine (P5 — drafted)
  - vlt-S072-core-seeds-currency-full-engraving (Turn 26 — full T1+T2+T3 build)
  - vlt-S072-cross-tab-prompt-review-discipline (Turn 26 — boundary cross-review)
  - vlt-S072-boundary-prompt-format-validator (NEW Turn 27 — T2 validator build for the template I just authored)
  - vlt-S071-proto-completeness-migration (continue 1-2 protos per session)

GATES THAT MAY FIRE (R-class triggers per Long-Run §2):
  - R1 Governor interrupt → resume on new directive
  - R2 BLOCKING verify (exit≠0) → fix until exit_code=0
  - R3 new design decision off-plan → Governor ratifies deviation OR plan amendment
  - R4 ASK-OPUS-STOP (named in directive) → OPUS-14 answers
  - R5 OPIA COURSE-CORRECT → revert per v1.4 amendment d (not amend)

═══════════════════════════════════════════════════════════════════

— OPUS-14 (architectural director, S071) · authored 2026-05-30 · v3 formal-protocol revision after Governor Turn 27 freestyle-drift catch · cross-review pending from receiving Sonnet S072 tab

═══════════════════════════════════════════════════════════════════
