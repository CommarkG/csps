#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-dna-sync-check
# @csps-name post-stop-dna-sync-check
# @csps-description PostStop hook (T1) — fires after every response and checks if
# CSPS platform DNA has drifted from universal-sync-state.json since last sync.
# If principles.yaml OR moat-registry.md has been modified since last_sync timestamp,
# injects ADVISORY to remind Governor to run pnpm sync:dna.
# T1 component of 3-direction DNA sync enforcement.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance domain:ops audience:developer
# @csps-enforces P-OPER-001 P-META-019

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly SYNC_STATE="${REPO_ROOT}/tools/config/universal-sync-state.json"
readonly PRINCIPLES="${REPO_ROOT}/packages/principles/principles.yaml"
readonly MOAT="${REPO_ROOT}/docs/plan/pillar-0-governance/moat-registry.md"

# Only check if sync state exists
if [ ! -f "$SYNC_STATE" ]; then
  exit 0
fi

# Get last sync timestamp
LAST_SYNC=$(node -e "
  const d = JSON.parse(require('fs').readFileSync('$SYNC_STATE','utf8'));
  process.stdout.write(d.last_sync || '1970-01-01T00:00:00Z');
" 2>/dev/null || echo "1970-01-01T00:00:00Z")

# Check if principles.yaml or moat-registry.md was modified after last_sync
DRIFT_FOUND=0

if [ -f "$PRINCIPLES" ]; then
  PRINCIPLES_MTIME=$(node -e "process.stdout.write(new Date(require('fs').statSync('$PRINCIPLES').mtimeMs).toISOString())" 2>/dev/null || echo "")
  if [ -n "$PRINCIPLES_MTIME" ] && [[ "$PRINCIPLES_MTIME" > "$LAST_SYNC" ]]; then
    DRIFT_FOUND=1
  fi
fi

if [ -f "$MOAT" ]; then
  MOAT_MTIME=$(node -e "process.stdout.write(new Date(require('fs').statSync('$MOAT').mtimeMs).toISOString())" 2>/dev/null || echo "")
  if [ -n "$MOAT_MTIME" ] && [[ "$MOAT_MTIME" > "$LAST_SYNC" ]]; then
    DRIFT_FOUND=1
  fi
fi

if [ "$DRIFT_FOUND" -eq 1 ]; then
  echo "[dna-sync-check] ADVISORY: principles.yaml or moat-registry.md modified since last DNA sync (${LAST_SYNC})."
  echo "[dna-sync-check] Run: pnpm sync:dna [--universal-path /path/to/universal-governance]"
  echo "[dna-sync-check] New DNA elements may not be in universal-governance yet."
fi

exit 0
