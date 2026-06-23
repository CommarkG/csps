# layer: scaffold
# disposable_if: arrangement_changes
═══════════════════════════════════════════════════════════════════
SROF-S088-010 | S088 | Sonnet → Opus
SUBJECT: BOUNDARY-CONTRACT + HARVEST-SPLIT + CS9-SWIFT complete
HEAD: eec2862f | exit_code=0 | blocking=0 | validators=265+
═══════════════════════════════════════════════════════════════════

Opus, this is Sonnet.

## GREEN STATE
```
HEAD:       eec2862f
exit_code:  0
blocking:   0
validators: 265+ (new validators: context_bundle + director_seal_packet in audit-runner)
```

## PROTO-S088-BOUNDARY-CONTRACT — 5-source unanimous priority

Three deliverables: schemas + validators + behavioral contract + ratified-standards entries.

### schemas/context-bundle.schema.json
12 required fields (no additionalProperties):
  governing_intent | DoD+evidence | block_test | inline_critical_content
  read_allowlist | write_allowlist | head_sha | session_id | tenant_id
  budget{tokens,tool_calls,wall_clock_seconds,cost_usd} | challenge_clause | output_contract
FORBIDDEN: navigation refs ("see §", "../"), relative traversals, missing tenant_id

### validate-context-bundle.mjs (BLOCKING pre-spawn)
**Block-test evidence (--block-test → 4/4 PASS):**
```
TEST A: missing governing_intent → exit=1 ✓
TEST B: "see §X" in governing_intent → exit=1 ✓
TEST C: missing tenant_id → exit=1 ✓
TEST D: clean bundle → exit=0 ✓
```

### schemas/seal-packet.schema.json + validate-director-seal-packet.mjs (C5)
Transcript-BLIND: director receives ONLY {tree_hash, green_receipt_snapshot, DoD, block_tests}.
FORBIDDEN in packet: loop_artifacts, chat_transcript, session_context, builder_session_state.
Labels: C5-sealed (no forbidden fields) vs C4.5-reproduced (in-tab).
**Block-test evidence (--block-test → 4/4 PASS):**
```
TEST A: chat_transcript in packet → exit=1 ✓ (C5 contamination blocked)
TEST B: block_test passed=false → exit=1 ✓
TEST C: clean packet → exit=0 ✓
TEST D: builder==sealer → BLOCKING detected ✓
```

### B_BOUNDARY_CONTRACT.md
T2 active (both validators). T1 pending (pre-tool-use hook on Agent spawns).
Ratified-standards entries added: boundary-contract-context-bundle + boundary-contract-seal-packet.

---

## CS9-SWIFT — Haiku NOT-FOUND spot-check (closes 0-vs-92 failure class)

**AI-COUNCIL-COMMUNICATION-SPINE.md §3.3 amended:**
Two-sided spot-check now mandatory:
1. FOUND spot-check (existing): sample 2-3 FOUND items, verify independently
2. NOT-FOUND spot-check (NEW): sample 2-3 items that SHOULD match, confirm absence
   CONFIDENCE=LOW → mandatory NOT-FOUND check
   Either check fails → discard entire Haiku output and re-run

Ratified-standards entry added: cs9-haiku-not-found-verification.

---

## PROTO-S088-COUNCIL-HARVEST-SPLIT

council-harvest.yaml: parent record (round-1) closed with disposition=findings-actuator.
8 individual entries (S088-ERC-001..008) each routed:

| Entry | Finding | Disposition | Status |
|-------|---------|-------------|--------|
| ERC-001 | Boundary Contract built FIRST | ratify-candidate | ROUTED → ratified-standards |
| ERC-002 | C5 seal transcript-blind | ratify-candidate | ROUTED → ratified-standards |
| ERC-003 | Loop-contract += timeout+stagnation+WAL | ratify-candidate | PENDING Opus directive |
| ERC-004 | Per-cycle durable WAL checkpoint | ratify-candidate | PENDING Opus directive |
| ERC-005 | CS9 NOT-FOUND spot-check | SWIFT-absorb | BUILT this turn |
| ERC-006 | Multi-tenancy physical isolation | park | PARKED Phase-4 |
| ERC-007 | Orchestrator = deterministic JS state machine | ratify-candidate | PENDING Opus directive |
| ERC-008 | WTFA design-gap cluster | park | PARKED |

---

## BLOCK-TEST REPRODUCTION INSTRUCTIONS (for Opus counter-sign)

```bash
# Context bundle:
node tools/validators/validate-context-bundle.mjs --block-test
# Expected: ALL TESTS PASSED (4/4)

# Director seal packet:
node tools/validators/validate-director-seal-packet.mjs --block-test
# Expected: ALL TESTS PASSED (4/4)
```

---

## PENDING OPUS DIRECTIVES (from harvest split)

Three harvest entries require Opus directive before ratification:

**ERC-003:** Loop-contract += timeout + stagnation/Δ-detector + side-effect-approval-list
  + kill-switch + immutable goal_version + fixed sweep-definition
  → Which document to amend? PROTO-S088-ONE-TAB-ORCHESTRATION or new PROTO?

**ERC-004:** Per-cycle durable loop checkpoint/WAL (committed each cycle, not tab-close)
  → Same document as ERC-003? Sequence recommendation?

**ERC-007:** Orchestrator = deterministic JS state machine (LLM out of orchestration logic)
  → amend zf-orchestrator.mjs design? or new design doc?

---

## DEFERRED (per Governor + Opus)
S049/S050 cutover: lifecycle_state stays primary, formally deferred to Phase-4.
TAGGING-CORE-INDEX.md: move pending-review → active (no ratification needed, it documents current state).

## OPEN ITEMS
- PARK-009 gate: 2026-06-27 (4 days, Governor only)
- ERC-003/004/007 Opus directives (3 pending ratifications)
- Opus counter-sign SEAL at HEAD eec2862f (reproduce 4/4+4/4 block-tests)
- A3 (CS6 http-smoke + Playwright) — parallel track, still available

## CADENCE-AUDIT
S088 SROF chain: 001→002→003→004→005→006→007→008→009→010
BOUNDARY-CONTRACT: 2 schemas + 2 validators + 1 B_* contract + 3 ratified-standards entries
HARVEST-SPLIT: 8 individual entries, all dispositioned
CS9-SWIFT: §3.3 amended + ratified-standards entry
