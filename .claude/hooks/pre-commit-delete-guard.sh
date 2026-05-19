#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-commit-delete-guard
# @csps-name pre-commit-delete-guard
# @csps-description Pre-commit hook — checks staged file deletions against invariant-registry.yaml.
#   If a deletion matches an invariant with delete_guard: true, emits ADVISORY warning.
#   Scope: invariant-registry.yaml delete_guard items ONLY (NOT inheritance-registry.yaml,
#   which is OPEN-059 S044+). Per A3 alignment answer from S043 HANDOFF.
#   ADVISORY mode — exits 0 always (never blocks deletion).
#   Promotes to BLOCKING after T2 validator validates the pattern.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces B_FIVE_SURFACE_ENGRAVING
# @core-seed: DELETE_GUARD_T1 | plan: PROTO-034 Step 2 (invariant-registry.yaml) | grows-to: BLOCKING delete guard after T2 validator validates | target: S045

set -euo pipefail

REGISTRY="tools/config/invariant-registry.yaml"

# Only run if there are staged deletions
DELETED=$(git diff --cached --name-only --diff-filter=D 2>/dev/null || true)
if [ -z "$DELETED" ]; then
  exit 0
fi

# Only run if registry exists
if [ ! -f "$REGISTRY" ]; then
  exit 0
fi

# Check if node is available
if ! command -v node >/dev/null 2>&1; then
  exit 0
fi

# Check each deleted file against guarded invariants
FOUND_GUARDED=""
while IFS= read -r file; do
  RESULT=$(node -e "
try {
  const yaml = require('js-yaml');
  const reg = yaml.load(require('fs').readFileSync('$REGISTRY', 'utf-8'));
  const guarded = (reg.invariants || []).filter(i => i.delete_guard === true);
  const match = guarded.find(i =>
    '$file'.includes(i.name) ||
    '$file'.includes(i.id) ||
    ('$file'.includes('HANDOFF') && i.id === 'INV-002')
  );
  if (match) {
    process.stdout.write(match.id + ':' + match.name);
  }
} catch(e) { /* yaml parse error — skip */ }
" 2>/dev/null || true)
  if [ -n "$RESULT" ]; then
    FOUND_GUARDED="${FOUND_GUARDED}  → $file (matches $RESULT)\n"
  fi
done <<< "$DELETED"

if [ -n "$FOUND_GUARDED" ]; then
  echo ""
  echo "⚠ [delete-guard] ADVISORY: Staged deletion(s) match invariant-registry.yaml delete_guard items:"
  echo -e "$FOUND_GUARDED"
  echo "  These files are guarded because the invariant depends on them existing."
  echo "  Check: does this deletion break a downstream dependency?"
  echo "  Registry: tools/config/invariant-registry.yaml"
  echo "  Invariant with delete_guard: true — INV-002 (HANDOFF files)"
  echo "  (ADVISORY — commit not blocked. Verify intentional before proceeding.)"
  echo ""
fi

exit 0
