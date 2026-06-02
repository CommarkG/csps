#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-commit-layer-classification-gate
# @csps-name pre-commit-layer-classification-gate
# @csps-description PreCommit BLOCKING hook — guards default-correction-registry.yaml.
#   When a new D-default entry is staged, it MUST have a 'layer:' field.
#   This closes NP1 gap from CQS-02 deep-dive (S076): validate-layer-split.mjs is EXTENDED
#   (weekly cron) so a new D-default without layer: could go undetected for up to 1 week.
#   This pre-commit hook catches it IMMEDIATELY at commit time.
#   Fires when tools/data/default-correction-registry.yaml is staged (git diff).
# @csps-version 1.0.0 S076
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces CQS-02-NP1 (validate-layer-split.mjs gap — discovery delay fix)
#               SANDBOX-cqs-alignment-layer-S076.md §Simulation Result

set -euo pipefail

REGISTRY="tools/data/default-correction-registry.yaml"

# Only fire if default-correction-registry.yaml is staged
if ! git diff --cached --name-only 2>/dev/null | grep -q "$REGISTRY"; then
  exit 0
fi

command -v node >/dev/null 2>&1 || exit 0

# Check all D-default entries in the staged version have layer: field
RESULT=$(git diff --cached "$REGISTRY" 2>/dev/null | node -e "
let d = '';
process.stdin.on('data', c => d += c);
process.stdin.on('end', () => {
  // Extract added lines from the diff (lines starting with +)
  const added = d.split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++'));
  const addedContent = added.map(l => l.slice(1)).join('\n');

  // Find new D-default blocks: lines with '  - id: D' followed by content
  // Check if any new entry lacks layer:
  const newEntries = addedContent.match(/  - id: D\d+/g) || [];
  const missingLayer = [];

  for (const entry of newEntries) {
    const entryId = entry.match(/D\d+/)[0];
    // Check if this entry has a layer: line in the added content nearby
    const entryStart = addedContent.indexOf(entry);
    const entryBlock = addedContent.slice(entryStart, entryStart + 500);
    const hasLayer = /^\s+layer:\s+(system|scaffold)\s*$/m.test(entryBlock);
    if (!hasLayer) {
      missingLayer.push(entryId);
    }
  }

  if (missingLayer.length > 0) {
    console.log('BLOCK:' + missingLayer.join(','));
  } else {
    console.log('PASS');
  }
});
" 2>/dev/null || echo "PASS")

if echo "$RESULT" | grep -q "^BLOCK:"; then
  MISSING=$(echo "$RESULT" | sed 's/^BLOCK://')
  echo ""
  echo "[layer-classification-gate] BLOCKING: New D-default entry staged WITHOUT layer: field."
  echo "  Missing layer: in entry: $MISSING"
  echo ""
  echo "  Every D-default MUST have 'layer: system' or 'layer: scaffold' per PROTO-S076-DIM3-A."
  echo "  Add the layer: field before committing:"
  echo "    D1-D15, D18: layer: system"
  echo "    D16, D17, D19: layer: scaffold"
  echo ""
  echo "  Root: CQS-02-NP1 gap — validate-layer-split.mjs is EXTENDED (weekly); this hook"
  echo "  catches new D-defaults WITHOUT layer: at commit time (immediate)."
  echo "  Ref: SANDBOX-cqs-alignment-layer-S076.md §Simulation Result + pre-commit-layer-classification-gate.sh"
  echo ""
  exit 1
fi

exit 0
