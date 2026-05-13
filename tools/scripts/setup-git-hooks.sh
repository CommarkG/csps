#!/usr/bin/env bash
# CSPS Git Hooks Setup — run once per machine
# Installs version-controlled hooks from tools/scripts/git-hooks/ → .git/hooks/
#
# Usage: bash tools/scripts/setup-git-hooks.sh
# Or: From bootstrap.ps1 during machine setup

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HOOKS_SRC="${REPO_ROOT}/tools/scripts/git-hooks"
HOOKS_DST="${REPO_ROOT}/.git/hooks"

if [ ! -d "$HOOKS_DST" ]; then
  echo "⛔ .git/hooks/ not found — are you in a git repository?"
  exit 1
fi

installed=0

for hook in "$HOOKS_SRC"/*; do
  hook_name=$(basename "$hook")
  dst="${HOOKS_DST}/${hook_name}"

  # Create symlink (preferred) or copy
  if ln -sf "../../tools/scripts/git-hooks/${hook_name}" "$dst" 2>/dev/null; then
    echo "✓ Installed: .git/hooks/${hook_name} → tools/scripts/git-hooks/${hook_name}"
    chmod +x "$hook"
    installed=$((installed + 1))
  else
    # Fallback: copy for Windows environments
    cp "$hook" "$dst"
    chmod +x "$dst" 2>/dev/null || true
    echo "✓ Copied: .git/hooks/${hook_name}"
    installed=$((installed + 1))
  fi
done

echo ""
echo "Git hooks installed: ${installed}"
echo "Zero-laptop pre-commit gate: ACTIVE"
echo ""
echo "To test: create a procedure doc with 'pnpm dev' and try to commit it."
