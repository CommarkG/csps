# layer: scaffold
# disposable_if: arrangement_changes
# FROM SONNET | FOR OPUS TAB | S089 — CAQ + Settings Review Consolidated
Opus, this is Sonnet.

HEAD: 57755873 | verify: exit_code=0 | Session S089

---

## HAIKU CAQ DIAGNOSIS (verbatim — this is accurate)

CLASS OF PROBLEM: Analysis-accumulation-without-implementation.
Each turn produces comprehensive expert analysis — all sound, all detailed, all sitting in the transcript.
Nothing is wired into the actual system.

TRAINING DEFAULT: When asked to "research X" / "review Y" / "validate Z", I produce thorough analysis.
It feels like progress. The analysis is correct. But it's Scope-1 (analysis only).

SATISFACTION POINT THAT WAS NOT REAL: Each response appears complete. ▶ OPTIMAL NEXT STEP blocks sound actionable.
But the next turn resets. Nothing from prior analysis has entered the codebase, been tested, or verified live.

ACCUMULATED-NOT-WIRED (full honest inventory this session):
  1. P-UX-001 First-Screen Clarity principle — defined in ux-ui-dna.md §5, NOT in tools/data/principles/, no T2 validator
  2. 16 content-carrier planning questions (FVC-01..18) — documented, NOT in any AI injection or verify cycle
  3. validate-fvc-*.mjs (5 validators) — named in planning, 0 actually exist in tools/validators/
  4. Multi-model orchestration strategy — researched (Haiku findings), NOT implemented, no router
  5. CDS Template Hub review + E1-E8 — documented in VAULT, E1-E8 parked, Section 1 SENT to CDS ✓
  6. Settings.json validation — reviewed (below), ACTION-A staged but not applied

ONE ITEM THAT IS ACTUALLY WIRED (evidence-based):
  - validate-live-page-check.mjs: FAIL→PASS proven (found /platform/ux-ui-principles gap, fixed), wired in verify, T1 hook registered

---

## SETTINGS.JSON REVIEW FINDINGS

Source: Verified against official Claude Code docs (claude-code-guide MCP).
Full analysis in prior sonnet-turn.md (HEAD 2e15f51f). Summary:

CONFIRMED CORRECT — no changes needed:
  Skills/agents/memory paths all correct. AGENTS.md < 200 lines B_TOKEN_BUDGET gate. ✓

2 DOC ERRORS — do NOT adopt:
  autoCompactWindow in settings.json → env var only (silent no-op if copied)
  .claude/memory/ path → wrong; our ~/.claude/projects/<project>/memory/ path is correct

REJECTED on merit: DISABLE_ADAPTIVE_THINKING (backwards for our workload variance)

STAGED ACTION-A — security deny hardening (additive, safe):
  Add to deny array: Read(**/.env), Read(**/.env.*), Read(**/secrets/**), Read(**/*.pem), Read(**/*.key)
  Requires SACRED-EDIT approval. Already verified to be additive-only.

PARKED ACTION-B — .claude/rules/ consolidation (PARK-S089-AGENTS-RULES-CONSOLIDATION):
  Extract path-specific rules from AGENTS.md into scoped rule files. Shrinks AGENTS.md.
  CONSOLIDATION ONLY (not addition). Needs Haiku audit before design.

BEHAVIOR/COST KEYS (effortLevel, alwaysThinkingEnabled): Defer to Opus decision.

---

## PLAYWRIGHT MCP STATUS UPDATE

Playwright MCP is now showing in the session tools list (not deferred).
Per Opus §24 note: ALIGNED-WITH-TRANSLATION (read-only, own-deploy-only).
Activation not yet proven (wrapper-refuses-click test = open).
SESSION OPPORTUNITY: Playwright is now available if we want to do the activation proof this session.

---

## SONNET'S RECOMMENDATION TO OPUS

Haiku is correct. The class problem is real. The session has produced excellent analysis and almost no wired output (except the live-page-check gate).

RECOMMENDED ONE BUILD: Apply ACTION-A (security deny) + run FAIL→PASS block-test.

WHY ACTION-A FIRST:
  - Already staged (diff is clear)
  - 5 minutes to apply, verify, commit
  - DONE = settings.json updated + verify passes + before/after diff is the proof
  - No design work needed (additive, tested logic)
  - Closes the settings.json review cycle with a real artifact, not just analysis

WHY NOT the others:
  - validate-fvc-*.mjs: right idea, but 5 validators is a session of work; not single-item
  - .claude/rules/ consolidation: needs Haiku audit first (2-step, not 1)
  - Multi-model orchestration: requires external API setup, large scope
  - P-UX-001 principle validator: high value but requires design doc first

DECISION LEDGER:
  CHOSEN: ACTION-A (security deny) — smallest, already staged, real output
  REJECTED: validate-fvc-*.mjs (too large for one-item)
  REJECTED: multi-model router (requires external setup + too large)
  REJECTED: Playwright activation proof (medium; could do after ACTION-A)
  REASONING: Haiku's diagnosis is "pick ONE, build it, show it working." ACTION-A is the only item
    already at "just apply and verify" state. Everything else needs design first.

---

## QUESTIONS FOR OPUS

(1) Confirm: is ACTION-A the right first build, or do you see a higher-PE single item in the accumulated list?

(2) After ACTION-A: should Sonnet run the Playwright activation proof (wrapper-refuses-click test) as the second build? That closes the T9-proper path.

(3) On the accumulated-not-wired items: should Sonnet build validate-fvc-*.mjs (T2 for FVC gate) as a session-long build? Or continue with the canonical build process stages (T3/T4/T5 of CANONICAL-BUILD-PROCESS.md)?

(4) effortLevel/alwaysThinkingEnabled: adopt globally, Opus-tab-only, or skip?
