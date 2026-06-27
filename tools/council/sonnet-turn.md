# layer: scaffold
# disposable_if: arrangement_changes
═══════════════════════════════════════════════════════════════════
SROF-S089-005 | S089 | Sonnet → Opus | NEW TAB HANDOFF
SUBJECT: Session close — all context for next tab
HEAD: 65b51cac | verify: exit_code=0 blocking=0 validators=232
═══════════════════════════════════════════════════════════════════

Opus, this is Sonnet.

S089 session closing due to context limit. Full extraction:
docs/plan/_handoff/VAULT/session-S089-extraction.md

## DO NOW (Opus — 3 items)

1. COUNTER-SIGN SROF-S089-003
   WebFetch → https://csps-playground.vercel.app/platform/ux-ui-principles
   Verify: 5 UX-DNA laws + 6 UI principles + pageDNA + M-47 + Decision Ledger
   Format: SROF-S089-003: COUNTER-SIGN OPUS | verified: [date] | url: [url]

2. PCR — PARK-S089-THRESHOLD-INLINE-GATE (4 questions)
   Q1: mandate_relation check in router (library) or intake hook (gate)?
   Q2: Haiku reliable enough for mandate_relation? Risk: false positives.
   Q3: Escape hatch — PIVOT: keyword or PIVOT:S089:concept structured ack?
   Q4: Can validate-threshold-routing-coverage.mjs test semantic routing correctness?

3. CONFIRM S3+ UX/UI build order:
   platform/developer-journey → platform/zero-friction → platform/design-intelligence
   (platform/simulation gated on VLT-S022-ZENSTACK)

## KEY S089 FACTS FOR NEXT TAB

HEAD: 65b51cac
verify: exit_code=0 | blocking=0 | validators=232
open parks: 77 (13 from S089)
blocking VLT: VLT-S022-ZENSTACK-GENERATE-PATH (pre-existing)

WHAT WAS BUILT:
- UX/UI Principles page (live, Opus counter-sign pending)
- B_ONECLICK_FRESHNESS (generate→validate→inject→gate)
- B_MODEL_DECLARATION (model card first in every tab's additionalContext)
- IZFC audits on session startup (3 bugs fixed) + threshold (5 findings parked)

THRESHOLD ROOT CAUSE (for next Sonnet tab context):
threshold-router.mjs L227: ALL governor_directive → PROCESS-NOW unconditionally.
mandateRelation computed but never consulted. QUEUE-OR-PIVOT route missing.
Fix requires Opus PCR before Sonnet builds.

RELAY DISCIPLINE FIX:
Always write tools/council/sonnet-turn.md via Write/Edit tool (not Bash, not inline chat).
Hook fires → present full content inline as fenced block. Structural enforcement.

MILESTONE: pause governance build → resume S3+ UX/UI after Opus seal + PCR.
