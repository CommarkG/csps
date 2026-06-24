---
id: csps.governance.block-test-convention
name: BLOCK-TEST-CONVENTION
description: >
  Canonical convention for behavioral block-tests in CSPS. Covers the two
  structural requirements: (1) behavioral gate goes RED on planted defect (exit 1);
  (2) clean state goes GREEN (exit 0). Also covers environment portability — the
  recurring failure mode where builder passes but director fails.
version: "1.0"
session: S088
authored_by: Sonnet-builder S088 | extracted from SROF-S088-012 director block-test failure
owner: group:finky
lifecycle: production
lifecycle_state: active
impl_status: swift-implemented
core_spine: VALD
schema_anchor: pillar_0_governance_leaves
diataxis_type: reference
links:
  - { rel: harvest, href: ../../../tools/data/council-harvest.yaml }
  - { rel: behavioral-tests, href: ../../../tools/tests/behavioral/ }
---

# Block-Test Convention
## Structural rules for all CSPS behavioral block-tests

---

## RULE 1 — BEHAVIORAL GATE (mandatory for every block-test)

Every block-test MUST prove two things:

1. **PLANTED DEFECT → RED (exit 1):** When a specific defect is planted, the gate MUST exit 1 (blocking).
2. **CLEAN STATE → GREEN (exit 0):** When the defect is removed, the gate MUST exit 0 (clean).

A block-test that only checks "the code is there" (presence check) without planting a defect is NOT a behavioral block-test — it is a structural check. Structural checks are necessary but not sufficient.

---

## RULE 2 — ENVIRONMENT PORTABILITY (anti-recurring-failure class)

**Root cause:** Block-tests pass on builder (Git Bash / MSYS2 with path translation) but fail on director (Windows node.exe without translation). This has bitten the platform twice in S088:
1. CRLF in agent names (CS6 predecessor)
2. MSYS absolute paths passed to Windows `node -e readFileSync()` (CS7)

### The MSYS path portability rule

**FORBIDDEN in bash block-tests:**
```bash
# ✗ WRONG: $VARIABLE is /c/Users/... (MSYS path)
# Windows node.exe resolves it as C:\c\Users\... → ENOENT
RESULT=$(node -e "require('fs').readFileSync('$SOME_ABSOLUTE_VAR', 'utf8')")
```

**REQUIRED — two safe patterns:**

**Pattern A (recommended): `cd` into root + use relative path**
```bash
# ✓ CORRECT: bash cd translates /c/Users → C:\Users; node uses process.cwd()
RESULT=$(cd "$REPO_ROOT" && node -e "require('fs').readFileSync('relative/path/to/file.json', 'utf8')")
```

**Pattern B: pass path via process.argv (not string interpolation)**
```bash
# ✓ CORRECT: path passed as a separate arg to node, not embedded in eval string
RESULT=$(node --input-type=module - "$REPO_ROOT/path/to/file.json" << 'EOF'
const p = process.argv[1];
const d = JSON.parse(require('fs').readFileSync(p, 'utf8'));
console.log(Object.keys(d.hashes||{}).length);
EOF
)
```

### CRLF portability rule

- All `.sh` block-test files MUST have LF line endings (enforced by `.gitattributes eol=lf`).
- Variable names, paths, and file contents MUST NOT embed CRLF.
- If testing string patterns: explicitly strip CR before comparison (`echo "$VAR" | tr -d '\r'`).

### Verification discipline

**Before declaring a block-test complete:**
1. Run on the builder machine (Git Bash / MSYS)
2. Mentally walk through: "Would each `node -e` call work if MSYS did NOT translate the path?"
3. If any path is an `$ABSOLUTE_VAR` passed into a node inline script: fix it.

---

## RULE 3 — BLOCK-TEST FORMAT

File naming: `<feature>-block-test.sh` in `tools/tests/behavioral/`

Template:
```bash
#!/usr/bin/env bash
# <feature>-block-test.sh — behavioral block-test for <what>
#
# PLANTED DEFECT TESTS:
#   TEST A: <planted defect> → expect exit 1
#   TEST B: clean state → expect exit 0
#   (additional structural checks as needed)
#
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
PASS_COUNT=0; FAIL_COUNT=0; RESULTS=()
pass() { PASS_COUNT=$((PASS_COUNT+1)); RESULTS+=("[PASS] $1"); }
fail() { FAIL_COUNT=$((FAIL_COUNT+1)); RESULTS+=("[FAIL] $1"); }

# TEST A: plant defect → gate goes RED
# ... (use portable node calls with cd "$REPO_ROOT" + relative paths)

# TEST B: clean state → gate stays GREEN
# ...

echo "=== RESULTS ==="; for r in "${RESULTS[@]}"; do echo "  $r"; done
echo "PASS=$PASS_COUNT FAIL=$FAIL_COUNT"
if [ "$FAIL_COUNT" -gt 0 ]; then
  echo "[BLOCK-TEST FAILED]"; exit 1
fi
echo "[BLOCK-TEST PASSED] All $PASS_COUNT tests confirmed"
exit 0
```

---

## RULE 4 — KNOWN ANTI-PATTERNS

| Anti-pattern | Why it fails | Fix |
|---|---|---|
| `readFileSync('$ABS_MSYS_PATH')` in `node -e` | MSYS path not translated by Windows node | `cd "$REPO_ROOT"` then relative path |
| CRLF in `.sh` files | Line endings break bash parsing | `.gitattributes *.sh eol=lf` |
| `/dev/stdin` in `node -e` | Doesn't exist on Windows | Use a temp file or arg pattern |
| `node -e "... JSON.parse(require('fs').readFileSync('/dev/stdin')...)"` | `/dev/stdin` is `/c/dev/stdin` on Windows | Pass JSON via `process.argv` or temp file |
| Single-environment testing | Builder passes, director fails | Walk through "no MSYS translation" mentally before claiming PASS |

---

*For Opus review: was there a third recurring environment portability failure in S088 beyond the two documented here (CRLF + MSYS path)? If so, add it to the anti-patterns table.*
