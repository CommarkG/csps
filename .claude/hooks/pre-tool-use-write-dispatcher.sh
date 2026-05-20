#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-write-dispatcher
# @csps-name pre-tool-use-write-dispatcher
# @csps-description THE single Write hook registered in settings.json.
#   Reads .claude/hooks/dispatch-registry.yaml and calls every listed hook
#   in sequence with the same CLAUDE_TOOL_INPUT environment.
#   Exits 2 (BLOCKING) if any sub-hook exits 2.
#   Exits 1 (error) if any sub-hook exits 1.
#   Exits 0 (advisory output) if all sub-hooks exit 0.
#
#   PERMANENT SOLUTION to settings.json permission prompts:
#   settings.json has ONE entry pointing here.
#   New Write hooks → add to dispatch-registry.yaml ONLY.
#   settings.json is NEVER edited for Write hooks again.
#
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces AP-003 dispatch-registry

HOOKS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REGISTRY="${HOOKS_DIR}/dispatch-registry.yaml"
PROJECT_ROOT="$(cd "${HOOKS_DIR}/../.." && pwd)"

[ ! -f "$REGISTRY" ] && exit 0
command -v node >/dev/null 2>&1 || exit 0

# Export registry path so node can read it without inline interpolation issues
export CSPS_DISPATCH_REGISTRY="$REGISTRY"
export CSPS_PROJECT_ROOT="$PROJECT_ROOT"

# Parse hook paths — use env vars to avoid quoting issues with spaces in paths
HOOK_PATHS=$(node -e "
try {
  const yaml = require('js-yaml');
  const fs = require('fs');
  const registry = process.env.CSPS_DISPATCH_REGISTRY;
  const docs = yaml.loadAll(fs.readFileSync(registry, 'utf-8'));
  const reg = Array.isArray(docs) ? docs[docs.length - 1] : docs;
  const hooks = (reg.hooks || []).map(h => h.path).filter(Boolean);
  console.log(hooks.join('\n'));
} catch(e) { process.exit(0); }
" 2>/dev/null)

[ -z "$HOOK_PATHS" ] && exit 0

HIGHEST_EXIT=0
while IFS= read -r HOOK_PATH; do
  [ -z "$HOOK_PATH" ] && continue
  FULL_PATH="${PROJECT_ROOT}/${HOOK_PATH}"
  [ ! -f "$FULL_PATH" ] && continue

  set +e
  bash "$FULL_PATH"
  HOOK_EXIT=$?
  set -e

  if [ "$HOOK_EXIT" -eq 2 ]; then
    exit 2
  fi
  if [ "$HOOK_EXIT" -gt "$HIGHEST_EXIT" ]; then
    HIGHEST_EXIT=$HOOK_EXIT
  fi
done <<< "$HOOK_PATHS"

exit $HIGHEST_EXIT
