#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-commit-delete-guard
# @csps-name pre-commit-delete-guard
# @csps-description Pre-commit hook — checks staged file deletions against TWO registries:
#   1. invariant-registry.yaml: delete_guard items (checks by name/id)
#   2. inheritance-registry.yaml: delete_guard artifacts (checks by path, lists children)
#   If a deletion matches either registry, emits ADVISORY warning showing cascade impact.
#   ADVISORY mode — exits 0 always (never blocks deletion).
#   Promotes to BLOCKING after T2 validator validates the pattern.
#   Extended PROTO-036 Step 3b (S045) — previously only checked invariant-registry.yaml.
# @csps-version 1.1.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces B_FIVE_SURFACE_ENGRAVING
# @core-seed: DELETE_GUARD_T1 | plan: PROTO-034 Step 2 (invariant-registry.yaml) | grows-to: BLOCKING delete guard after T2 validator validates | target: S045

set -euo pipefail

INV_REGISTRY="tools/config/invariant-registry.yaml"
INH_REGISTRY="tools/config/inheritance-registry.yaml"

# Only run if there are staged deletions
DELETED=$(git diff --cached --name-only --diff-filter=D 2>/dev/null || true)
if [ -z "$DELETED" ]; then
  exit 0
fi

# Check if node is available
if ! command -v node >/dev/null 2>&1; then
  exit 0
fi

# ── PASS 1: invariant-registry.yaml ──────────────────────────────────────────
FOUND_INVARIANT=""
if [ -f "$INV_REGISTRY" ]; then
  while IFS= read -r file; do
    RESULT=$(node -e "
try {
  const yaml = require('js-yaml');
  const reg = yaml.load(require('fs').readFileSync('$INV_REGISTRY', 'utf-8'));
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
      FOUND_INVARIANT="${FOUND_INVARIANT}  → $file (invariant: $RESULT)\n"
    fi
  done <<< "$DELETED"
fi

if [ -n "$FOUND_INVARIANT" ]; then
  echo ""
  echo "⚠ [delete-guard] ADVISORY: Staged deletion(s) match invariant-registry.yaml delete_guard items:"
  echo -e "$FOUND_INVARIANT"
  echo "  These files are guarded because the invariant depends on them existing."
  echo "  Check: does this deletion break a downstream dependency?"
  echo "  Registry: $INV_REGISTRY"
  echo "  (ADVISORY — commit not blocked. Verify intentional before proceeding.)"
  echo ""
fi

# ── PASS 2: inheritance-registry.yaml ────────────────────────────────────────
FOUND_INHERITANCE=""
if [ -f "$INH_REGISTRY" ]; then
  while IFS= read -r file; do
    RESULT=$(node -e "
try {
  const yaml = require('js-yaml');
  // inheritance-registry.yaml has YAML frontmatter — use loadAll and take the last doc
  const docs = yaml.loadAll(require('fs').readFileSync('$INH_REGISTRY', 'utf-8'));
  const reg = docs[docs.length - 1] || {};
  const guarded = (reg.artifacts || []).filter(a => a.delete_guard === true);
  const match = guarded.find(a => {
    const p = (a.path || '').replace(/\\\\/g, '/');
    const f = '$file'.replace(/\\\\/g, '/');
    return f === p || f.endsWith('/' + p) || p.endsWith('/' + f);
  });
  if (match) {
    const children = (match.children || []).join('|');
    const prop = match.propagation || 'auto';
    process.stdout.write(match.id + '::' + prop + '::' + children);
  }
} catch(e) { /* yaml parse error — skip */ }
" 2>/dev/null || true)
    if [ -n "$RESULT" ]; then
      ARTIFACT_ID=$(echo "$RESULT" | cut -d: -f1)
      PROPAGATION=$(echo "$RESULT" | cut -d: -f3)
      CHILDREN=$(echo "$RESULT" | cut -d: -f4- | tr '|' '\n' | sed 's/^/      • /')
      FOUND_INHERITANCE="${FOUND_INHERITANCE}  → $file (artifact: $ARTIFACT_ID | propagation: $PROPAGATION)\n"
      FOUND_INHERITANCE="${FOUND_INHERITANCE}    Children that depend on this:\n$CHILDREN\n"
    fi
  done <<< "$DELETED"
fi

if [ -n "$FOUND_INHERITANCE" ]; then
  echo ""
  echo "⚠ [delete-guard] ADVISORY: Staged deletion(s) match inheritance-registry.yaml delete_guard artifacts:"
  echo -e "$FOUND_INHERITANCE"
  echo "  propagation=auto means children become invalid if parent is deleted."
  echo "  propagation=manual means deletion is allowed but children need manual update."
  echo "  Registry: $INH_REGISTRY"
  echo "  (ADVISORY — commit not blocked. Verify cascade impact before proceeding.)"
  echo ""
fi

exit 0
