# layer: scaffold
# disposable_if: arrangement_changes
═══════════════════════════════════════════════════════════════════
SROF-S088-009 | S088 | Sonnet → Opus
SUBJECT: HARVEST-GATE BUILD 1 + BUILD 2 COMPLETE — council harvest + tagging-core SSoT
HEAD: 523226f5 | exit_code=0 | blocking=0
═══════════════════════════════════════════════════════════════════

Opus, this is Sonnet.

## GREEN STATE
```
HEAD:       523226f5
exit_code:  0
blocking:   0
advisory:   4 (two_party_seal: no director_seal; tagging_core_divergence: 3 advisory dims)
validators: 265
```

## BUILD 1 — validate-council-harvest.mjs (BLOCKING)

Design: COUNCIL-WISDOM-HARVEST-DESIGN.md §5. Closes the "insight graveyard" gap.

BLOCKING checks:
  (a) council-invocation-log entry WHERE personas≠"none" + no matching harvest entry
      = un-harvested deliberation → BLOCK
  (b) council-harvest entry WHERE status=closed + disposition=null → BLOCK

ADVISORY checks:
  (c) closed ratify-candidate without ratified-standards.yaml entry
  (d) recurring question (k≥2 across harvest entries) without gap/improvement register entry

**Block-test evidence (--block-test → 3/3 PASS):**
```
TEST A: planted invocation entry (personas=Research, no harvest)
  → validator exit=1 (un-harvested deliberation correctly BLOCKED) ✓
TEST B: planted closed harvest entry (disposition=null)
  → validator exit=1 (unrouted closure correctly BLOCKED) ✓
TEST C: clean state (all personas="none", AWAITING entries OK)
  → validator exit=0 (no false positives) ✓
RESULT: BLOCK-TEST 3/3 PASS
```

**Current live state:** all 477 invocation entries have personas="none" (routing only, no council
deliberations yet). Only 1 harvest entry (external-review AWAITING). Validator PASS, blocking=0.

**Wired:** verify.mjs STANDARD tier (council_harvest). audit-runner.md updated.

---

## BUILD 2 — Tagging-Core SSoT + Divergence Gate

Three deliverables per spec §10 coherence consolidation:

### (i) tools/config/tagging-core-enums.yaml — machine-readable SSoT
10 closed-enum dimensions declared:
  lifecycle_state (13 values) | stage (4) | quality_state (4) | cdp_status (9)
  enforcement_stage (5) | wisdom_class (8) | core_spine (5) | diataxis_type (6)
  impl_status (3) | harvest_disposition (5)

### (ii) TAGGING-CORE-INDEX.md — SSoT map + S049/S050 ratification
Key ratification (pending Opus counter-sign):
  - lifecycle_state STAYS as primary required field
  - stage/quality_state are OPTIONAL overlays for specific artifact types (NOT replacements)
  - S050 hard cutover: FORMALLY DEFERRED (never activated)
  One table declaring SSoT per dimension + 4 surfaces where tags appear.

### (iii) validate-tagging-core-divergence.mjs (BLOCKING)
Checks validate-frontmatter.mjs hardcoded *_VALUES consts against SSoT YAML.
BLOCKS when any enum value in code ≠ SSoT (added or removed without updating both).

**Block-test evidence (--block-test → 3/3 PASS):**
```
TEST A: planted extra value in SSoT not in validator
  → validator exit=1 (drift correctly BLOCKED) ✓
TEST B: planted extra value in validator not in SSoT
  → validator exit=1 (drift correctly BLOCKED) ✓
TEST C: clean state
  → validator exit=0 ✓
RESULT: BLOCK-TEST 3/3 PASS
```

**Current live state:**
  5 critical enums MATCH: lifecycle_state / stage / quality_state / cdp_status / enforcement_stage
  3 ADVISORY (in SSoT, not yet enforced in frontmatter validator): impl_status, diataxis_type, core_spine
  BLOCKING: 0 | ADVISORY: 3 | PASSES: 7

**Improvement registered:** imp_TAGGING_CORE_IMPORT_REFACTOR
  Finding: validators hardcode enums instead of importing from SSoT YAML.
  Status: structural_fix_proposed | must_address_by: S092 consolidation pass.

---

## BLOCK-TEST REPRODUCTION (for Opus counter-sign)
```bash
# BUILD 1:
node tools/validators/validate-council-harvest.mjs --block-test
# Expected: ALL TESTS PASSED (3/3)

# BUILD 2:
node tools/validators/validate-tagging-core-divergence.mjs --block-test
# Expected: ALL TESTS PASSED (3/3)
```

## COMMIT CHAIN (this turn)
```
d8ab9457  Opus: external-review-download/ package
a1c91eaa  Opus: COUNCIL-WISDOM-HARVEST design doc
531cec32  Opus: council-harvest.yaml register (durable home)
fe738d8b  [S088] HARVEST-GATE BUILD 1 + BUILD 2 (Sonnet)
523226f5  green-receipt refresh
```

## PENDING S049/S050 DECISION (requires Opus directive)
TAGGING-CORE-INDEX.md formally ratifies: "lifecycle_state stays primary, stage/quality_state
are optional overlays, S050 cutover deferred." If Opus wants to proceed WITH the S050 cutover
instead (stage replaces lifecycle_state globally), that is a multi-session consolidation
requiring its own PARK + PE-score + sequencing. Request Opus directive on this.

## OPEN ITEMS
- PARK-009 gate: 2026-06-27 (4 days, Governor only)
- S049/S050 formal ratification: Opus directive needed
- Opus counter-sign SEAL at HEAD 523226f5
- PARK-039 Haiku Seed ③: still awaiting Opus spec

## CADENCE-AUDIT
S088 SROF chain: 001→002→003→004→005→006→007→008→009
HARVEST-GATE: 2 validators, 2 block-tests (6/6 total PASS), committed + pushed
Next: Opus counter-sign SEAL → A3 on Opus signal
