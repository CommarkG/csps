#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-directive-rzf-gate
# @csps-name post-stop-directive-rzf-gate
# @csps-description Stop hook — T1 for INV-003 (rzf-before-directive).
#   Reads tools/council/opus-turn.md after each Claude response.
#   Checks: if the most recent Turn block contains ## SONNET DIRECTIVE but NO
#   preceding ## RZF VERIFICATION → emits ADVISORY.
#   Training default: "Write directive when asked, skip ZF cycles."
#   Satisfaction point: "Directive looks complete, ready to send."
#   Override: RZF cycles with tool calls MUST appear BEFORE ## SONNET DIRECTIVE.
#   ADVISORY mode — exits 0 always. Promotes to BLOCKING after T2 validates pattern.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces P-META-008 B_RZF communication-protocol-shared.md Rule 9

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OPUS_TURN="${REPO_ROOT}/tools/council/opus-turn.md"

if [ ! -f "$OPUS_TURN" ]; then
  exit 0
fi

if ! command -v node >/dev/null 2>&1; then
  exit 0
fi

RESULT=$(node -e "
const fs = require('fs');
const content = fs.readFileSync('$OPUS_TURN', 'utf8');

// Split into Turn blocks
const blocks = content.split(/(?=^# Opus Turn \d+)/m).filter(b => /^# Opus Turn \d+/.test(b.trim()));
if (blocks.length === 0) { process.exit(0); }

// Find most recent turn number
let maxTurn = 0;
let latestBlock = '';
for (const b of blocks) {
  const m = b.match(/^# Opus Turn (\d+)/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n > maxTurn) { maxTurn = n; latestBlock = b; }
  }
}

if (!latestBlock) { process.exit(0); }

const hasDirective = /^##\s+SONNET DIRECTIVE/m.test(latestBlock);
if (!hasDirective) { process.exit(0); }

const hasRzf = /^##\s+RZF VERIFICATION/m.test(latestBlock);
if (hasRzf) {
  // Check ordering: RZF must appear BEFORE SONNET DIRECTIVE
  const rzfPos = latestBlock.search(/^##\s+RZF VERIFICATION/m);
  const dirPos = latestBlock.search(/^##\s+SONNET DIRECTIVE/m);
  if (rzfPos < dirPos) { process.exit(0); } // correct order — clean
  console.log('WRONG_ORDER:' + maxTurn);
} else {
  console.log('MISSING_RZF:' + maxTurn);
}
" 2>/dev/null || true)

if [ -z "$RESULT" ]; then
  exit 0
fi

ISSUE=$(echo "$RESULT" | cut -d: -f1)
TURN=$(echo "$RESULT" | cut -d: -f2)

if [ "$ISSUE" = "MISSING_RZF" ]; then
  echo ""
  echo "⚠ [directive-rzf-gate] ADVISORY: Opus Turn ${TURN} has ## SONNET DIRECTIVE but no ## RZF VERIFICATION."
  echo "  Rule 9: Run ≥1 ZF cycle with tool calls BEFORE writing any directive."
  echo "  Fix: Add ## RZF VERIFICATION → Cycle 1 findings → Cycle 2 re-check → Status: ZF ACHIEVED"
  echo "  Then place ## SONNET DIRECTIVE AFTER the verification block."
  echo "  Ref: tools/council/communication-protocol-shared.md RULE 9"
  echo "  T2: validate-directive-has-rzf.mjs | T1: this hook (INV-003 complete)"
  echo ""
elif [ "$ISSUE" = "WRONG_ORDER" ]; then
  echo ""
  echo "⚠ [directive-rzf-gate] ADVISORY: Opus Turn ${TURN} RZF VERIFICATION appears AFTER SONNET DIRECTIVE."
  echo "  Rule 9: RZF must precede the directive — run verification FIRST, then write the directive."
  echo "  Fix: Move ## RZF VERIFICATION block above ## SONNET DIRECTIVE in Turn ${TURN}."
  echo "  Ref: tools/council/communication-protocol-shared.md RULE 9"
  echo ""
fi

exit 0
