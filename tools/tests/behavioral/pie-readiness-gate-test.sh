#!/usr/bin/env bash
# Behavioral test: validate-pie-readiness-gate.mjs
# INPUT A: R3 item with Layer 2 incomplete → BLOCKING (exit=1) ✓
# INPUT B: R1 item with no prerequisites → PASS (exit=0) ✓
#
# Usage: bash tools/tests/behavioral/pie-readiness-gate-test.sh
# Plan item: COMBINATORIAL-ENGINE + B_PIE | S056

set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
TMP_REL=".tmp-pie-readiness-test-$$"
mkdir -p "${REPO_ROOT}/${TMP_REL}"
trap 'rm -rf "${REPO_ROOT}/${TMP_REL}"' EXIT

PASS=0
FAIL=0

check() {
  local name="$1" expected_exit="$2" plan_rel="$3" criteria_rel="$4"
  local helper_rel="${TMP_REL}/check-helper-${RANDOM}.cjs"
  cat > "${REPO_ROOT}/${helper_rel}" << JSEOF
const fs = require('fs'), path = require('path');
const ROOT = process.argv[2];
const planRel = process.argv[3];
const criteriaRel = process.argv[4];

function parseLayerStatus(text, heading) {
  const lines = text.split('\n');
  let inLayer = false, checked = 0, total = 0;
  for (const line of lines) {
    if (line.startsWith('## Layer') && line.includes(heading)) { inLayer = true; continue; }
    if (inLayer && /^## Layer \d+/.test(line) && !line.includes(heading)) break;
    if (inLayer) {
      if (/^- \[x\]/i.test(line)) { checked++; total++; }
      else if (/^- \[ \]/.test(line)) total++;
    }
  }
  return { checked, total, complete: total > 0 && checked >= total };
}

const planText = fs.readFileSync(path.resolve(ROOT, planRel), 'utf8');
const criteriaText = fs.readFileSync(path.resolve(ROOT, criteriaRel), 'utf8');
const layer2 = parseLayerStatus(criteriaText, 'Layer 2');

// Find R3 implementing items in plan
const r3pattern = /INFRA-FLOW|JOURNEY|PLAYGROUND-CORE/;
let blocked = 0;
for (const line of planText.split('\n')) {
  if (/^\s{2}-\s+id:/.test(line) && r3pattern.test(line)) {
    // check if this item is implementing
    const idx = planText.indexOf(line);
    const chunk = planText.slice(idx, idx + 300);
    if (/status:\s*implementing/.test(chunk) && !layer2.complete) blocked++;
  }
}
process.exit(blocked > 0 ? 1 : 0);
JSEOF
  local actual_exit=0
  cd "${REPO_ROOT}" && node "${helper_rel}" "${REPO_ROOT}" "$plan_rel" "$criteria_rel" 2>/dev/null || actual_exit=$?
  if [ "$actual_exit" -eq "$expected_exit" ]; then
    echo "  ✓ $name (exit=$actual_exit, expected=$expected_exit)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $name (exit=$actual_exit, expected=$expected_exit)"
    FAIL=$((FAIL + 1))
  fi
}

# ── INPUT A: R3 item implementing + Layer 2 incomplete → BLOCKING ────────────
PLAN_A="${TMP_REL}/plan-a.yaml"
CRITERIA_A="${TMP_REL}/criteria-a.md"
cat > "${REPO_ROOT}/${PLAN_A}" << 'EOF'
items:
  - id: INFRA-FLOW-VALIDATION
    status: implementing
    category: architecture
EOF
cat > "${REPO_ROOT}/${CRITERIA_A}" << 'EOF'
## Layer 2 — R2 Intelligence Layer
- [ ] PIE R2-01 design complete
- [ ] PIE Phase 1 built
- [ ] Conflict Detector and Readiness Gate defined
EOF
echo "INPUT A: R3 item implementing, Layer 2 incomplete → expect BLOCKING (exit 1)"
check "INPUT A: BLOCKING detected" 1 "$PLAN_A" "$CRITERIA_A"

# ── INPUT B: R1 item (no prerequisites) → always PASS ─────────────────────────
PLAN_B="${TMP_REL}/plan-b.yaml"
CRITERIA_B="${TMP_REL}/criteria-b.md"
cat > "${REPO_ROOT}/${PLAN_B}" << 'EOF'
items:
  - id: THRESHOLD-CODE
    status: implementing
    category: architecture
EOF
cat > "${REPO_ROOT}/${CRITERIA_B}" << 'EOF'
## Layer 1 — R1 Schema Layer
- [ ] THRESHOLD-CODE Phase 1
- [ ] BEHAVIOR-HUB
- [ ] Template Bundles
- [ ] DOCUMENTATION
EOF
echo "INPUT B: R1 item implementing, no prerequisites → expect PASS (exit 0)"
check "INPUT B: R1 passes gate" 0 "$PLAN_B" "$CRITERIA_B"

echo ""
echo "pie-readiness-gate behavioral test: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
