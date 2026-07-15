#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-oneclick-regenerate
# @csps-name post-stop-oneclick-regenerate
# @csps-description PostStop hook — ADVISORY (exit 0 always). Auto-regenerates .csps/oneclick.md
#   at every session close so the one-click paste block is always current with HEAD.
#   Previously: oneclick.md only regenerated after clean verify passes (manual or post-verify).
#   Root cause of staleness: session closes without verify → oneclick stays at old HEAD.
#   Fix: regenerate unconditionally at Stop — fail-open (never blocks session close).
#   HARDWIRED by Governor directive S089 — "hardwire the one-click handoff".
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_ZERO_NAVIGATION_FOR_GOVERNOR one-click-relay COMMUNICATION-CORE-element-3

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Fail-open: if node or script missing, skip silently
command -v node >/dev/null 2>&1 || exit 0
[ -f "$REPO_ROOT/tools/generate-oneclick.mjs" ] || exit 0

node "$REPO_ROOT/tools/generate-oneclick.mjs" 2>/dev/null && \
  echo "[oneclick-regenerate] .csps/oneclick.md refreshed (HEAD=$(git -C "$REPO_ROOT" rev-parse --short HEAD 2>/dev/null || echo unknown))" || \
  echo "[oneclick-regenerate] WARNING: generate-oneclick.mjs failed — oneclick.md may be stale"

exit 0
