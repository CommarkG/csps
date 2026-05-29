#!/usr/bin/env bash
# proto-completeness-test.sh
# Behavioral test for validate-proto-completeness.mjs
# M0.5 (S071) — Proto-Production Discipline
#
# INPUT A: passing-proto (all required sections present, persona count matches) → advisory=0 for this proto
# INPUT B: persona-count-mismatch (## 5-PERSONA REVIEW but 3 blocks) → advisory flagged
# INPUT C: missing-required-section (## CORE SEED absent) → advisory flagged
#
# Tests use temp .test.md files in docs/plan/protos/ (validator scans all *.md there)
# Cleanup on exit.

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

PROTOS_DIR="docs/plan/protos"
PASS=0; FAIL=0; ERRORS=()
TMPFILES=()

cleanup() {
  for f in "${TMPFILES[@]:-}"; do
    [ -f "$f" ] && rm -f "$f"
  done
}
trap cleanup EXIT

echo "[proto-completeness-test] Running 3/3 behavioral tests..."

# ─── INPUT A: passing proto (all required sections, persona count matches) ───
TMPFILE_A="$PROTOS_DIR/PROTO-TEST-A-passing.test.md"
TMPFILES+=("$TMPFILE_A")

cat > "$TMPFILE_A" << 'TMPEOF'
---
id: csps.protos.PROTO-TEST-A-passing
name: PROTO-TEST-A-passing
type: proto
status: draft
authored_by: OPUS-14
session: S071
core_spine: GVRN
schema_anchor: protos
core_seed_present: true
gate_tier: standard
ratified_by: ""
ratified_at: ""
governing_principle: P-META-028
inherits_from: "test-only"
---
# PROTO-TEST-A-passing (BEHAVIORAL TEST — DELETE)

## CORE SEED
Test core seed text.

## INHERITS / ALIGNS-WITH
- Inherits: test-plan

## ASK-OPUS-STOP TRIGGERS
- None for test proto.

## 2-PERSONA REVIEW
- **cruel-critic:** Test persona 1.
- **bottleneck-expert:** Test persona 2.

## STEP 0
**DONE WHEN:** [ ] Governor ratifies design → Sonnet builds.

## ZF GATE
Cite files + top-level $?.

## PREVENTION CLASSES
TEST-PREVENTION-CLASS

## §15 3-SCOPE FEEDBACK requirement
Sonnet/Platform/Governor.

## AUTHOR SIGNATURE
— OPUS-14 (architectural director, S071)
TMPEOF

# Run validator and check advisory count for test file A
echo "  Testing INPUT A (passing proto → advisory=0 for this proto)..."
RESULT_A=$(node tools/validators/validate-proto-completeness.mjs 2>&1 || true)
# Test file A should have 0 findings (all sections present, persona count matches)
A_FINDINGS=0
while IFS= read -r line; do [[ "$line" == *"PROTO-TEST-A-passing"* ]] && A_FINDINGS=$((A_FINDINGS+1)); done <<< "$RESULT_A"
if [ "$A_FINDINGS" -eq "0" ]; then
  echo "  ✓ INPUT A: PROTO-TEST-A-passing has 0 findings (advisory=0)"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT A: PROTO-TEST-A-passing has $A_FINDINGS finding(s) — expected 0"
  FAIL=$((FAIL+1)); ERRORS+=("INPUT A: $A_FINDINGS unexpected findings")
fi

# ─── INPUT B: persona count mismatch ─────────────────────────────────────────
TMPFILE_B="$PROTOS_DIR/PROTO-TEST-B-persona-mismatch.test.md"
TMPFILES+=("$TMPFILE_B")

cat > "$TMPFILE_B" << 'TMPEOF'
---
id: csps.protos.PROTO-TEST-B-persona-mismatch
name: PROTO-TEST-B-persona-mismatch
type: proto
status: draft
authored_by: OPUS-14
session: S071
core_spine: GVRN
schema_anchor: protos
core_seed_present: true
gate_tier: standard
ratified_by: ""
ratified_at: ""
governing_principle: P-META-028
inherits_from: "test-only"
---
# PROTO-TEST-B (BEHAVIORAL TEST — persona count mismatch)

## CORE SEED
Test.

## INHERITS / ALIGNS-WITH
- Inherits: test-plan.

## ASK-OPUS-STOP TRIGGERS
- None.

## 5-PERSONA REVIEW
- **cruel-critic:** Persona 1.
- **bottleneck-expert:** Persona 2.
- **schema-expert:** Persona 3.

## STEP 0
**DONE WHEN:** [ ] Governor ratifies design → Sonnet builds.

## ZF GATE
Cite files.

## PREVENTION CLASSES
TEST.

## §15 3-SCOPE FEEDBACK requirement
Done.

## AUTHOR SIGNATURE
— OPUS-14 (architectural director, S071)
TMPEOF

echo "  Testing INPUT B (5-PERSONA REVIEW with only 3 blocks → advisory flagged)..."
RESULT_B=$(node tools/validators/validate-proto-completeness.mjs 2>&1 || true)
B_FINDINGS=0
while IFS= read -r line; do [[ "$line" == *"PROTO-TEST-B-persona-mismatch"* ]] && [[ "${line,,}" == *"persona"* || "${line,,}" == *"count"* ]] && B_FINDINGS=$((B_FINDINGS+1)); done <<< "$RESULT_B"
if [ "$B_FINDINGS" -gt "0" ]; then
  echo "  ✓ INPUT B: persona count mismatch flagged ($B_FINDINGS advisory finding(s))"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT B: persona mismatch NOT flagged — expected advisory finding"
  FAIL=$((FAIL+1)); ERRORS+=("INPUT B: persona mismatch not detected")
fi

# ─── INPUT C: missing required section ───────────────────────────────────────
TMPFILE_C="$PROTOS_DIR/PROTO-TEST-C-missing-section.test.md"
TMPFILES+=("$TMPFILE_C")

cat > "$TMPFILE_C" << 'TMPEOF'
---
id: csps.protos.PROTO-TEST-C-missing-section
name: PROTO-TEST-C-missing-section
type: proto
status: draft
authored_by: OPUS-14
session: S071
core_spine: GVRN
schema_anchor: protos
core_seed_present: true
gate_tier: standard
ratified_by: ""
ratified_at: ""
governing_principle: P-META-028
inherits_from: "test-only"
---
# PROTO-TEST-C (BEHAVIORAL TEST — missing CORE SEED section)

## INHERITS / ALIGNS-WITH
- Inherits: test-plan.

## ASK-OPUS-STOP TRIGGERS
- None.

## 2-PERSONA REVIEW
- **cruel-critic:** Persona 1.
- **bottleneck-expert:** Persona 2.

## STEP 0
**DONE WHEN:** [ ] Governor ratifies design → Sonnet builds.

## ZF GATE
Cite files.

## PREVENTION CLASSES
TEST.

## §15 3-SCOPE FEEDBACK requirement
Done.

## AUTHOR SIGNATURE
— OPUS-14 (architectural director, S071)
TMPEOF

echo "  Testing INPUT C (missing CORE SEED section → advisory flagged)..."
RESULT_C=$(node tools/validators/validate-proto-completeness.mjs 2>&1 || true)
C_FINDINGS=0
while IFS= read -r line; do [[ "$line" == *"PROTO-TEST-C-missing-section"* ]] && [[ "${line,,}" == *"missing required"* || "${line,,}" == *"core seed"* ]] && C_FINDINGS=$((C_FINDINGS+1)); done <<< "$RESULT_C"
if [ "$C_FINDINGS" -gt "0" ]; then
  echo "  ✓ INPUT C: missing section flagged ($C_FINDINGS advisory finding(s))"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT C: missing section NOT flagged — expected advisory finding"
  FAIL=$((FAIL+1)); ERRORS+=("INPUT C: missing section not detected")
fi

# ─── Summary ─────────────────────────────────────────────────────────────────
echo ""
echo "[proto-completeness-test] Results: PASS=$PASS FAIL=$FAIL"
if [ ${#ERRORS[@]} -gt 0 ]; then
  for e in "${ERRORS[@]}"; do echo "  FAILURE: $e"; done
  exit 1
fi
echo "[proto-completeness-test] 3/3 behavioral tests PASSED"
exit 0
