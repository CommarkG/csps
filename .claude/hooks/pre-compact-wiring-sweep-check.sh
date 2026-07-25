#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-compact-wiring-sweep-check
# @csps-name pre-compact-wiring-sweep-check
# @csps-description PreCompact hook -- B_IMPLEMENTATION_WIRING_CYCLE (S089 CONSTITUTIONAL) T1 surface.
#   Advisory reminder ONLY (never blocks compact -- that risks losing work; the real gate is
#   validate-wiring-sweep-coverage.mjs at commit time via pnpm verify).
#   Surfaces whether this session's implementation-shaped commits have a matching
#   tools/data/wiring-sweep-log.yaml entry BEFORE context is compacted away.
# @csps-version 1.0.1
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_IMPLEMENTATION_WIRING_CYCLE

set -uo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

RESULT="$(node "${REPO_ROOT}/tools/validators/validate-wiring-sweep-coverage.mjs" 2>/dev/null)"
BLOCKING="$(echo "$RESULT" | grep -oP 'blocking=\K\d+' 2>/dev/null || echo 0)"
IC="$(echo "$RESULT" | grep -oP 'implementation_commits=\K\d+' 2>/dev/null || echo 0)"
SE="$(echo "$RESULT" | grep -oP 'sweep_entries=\K\d+' 2>/dev/null || echo 0)"

if [ "${BLOCKING:-0}" -gt 0 ]; then
  printf '\n[PRE-COMPACT-WIRING-SWEEP] WARNING: %s implementation-shaped commit(s) this session, %s wiring-sweep-log entries.\n' "$IC" "$SE" >&2
  printf '[PRE-COMPACT-WIRING-SWEEP] Add an entry to tools/data/wiring-sweep-log.yaml BEFORE compacting -- angles_swept + elements_updated + elements_deferred (B_IMPLEMENTATION_WIRING_CYCLE).\n' >&2
  printf '[PRE-COMPACT-WIRING-SWEEP] Context needed to name the swept angles is about to be compacted away.\n' >&2
fi

exit 0
