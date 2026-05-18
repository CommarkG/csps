# @core-seed: THRESHOLD_COMPLETENESS | plan: docs/plan/_handoff/VAULT/topic-plans/platform-core-alignment.md L5 | grows-to: validate-session-open-completeness.mjs — mechanical check that Q1-Q15 ran, session-state loaded, VLTs confirmed | target: week-4
#!/usr/bin/env bash
# @csps-id csps.claude.hooks.session-open
# @csps-name session-open
# @csps-description SessionStart hook — mandatory context + reasoning load BEFORE AI activation.
#   Delegates to tools/scripts/session-open-context.mjs (extracted S042 to fix bash/JS quoting).
#   Reads session-state.json, open-plan-levels, PE priorities, communication protocol rules,
#   opus-open-items pending count, and injects the conceptual frame required by P-META-020.
#   Per P-META-020: context is the compass; validators are samples.
#   Per B_COGNITIVE_CONTEXT_DISCIPLINE: Layer 1 (Permanent Constitution) loads at session-open.
# @csps-version 2.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces P-META-020 B_COGNITIVE_CONTEXT_DISCIPLINE P-META-006

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

CSPS_REPO_ROOT="$REPO_ROOT" node "$REPO_ROOT/tools/scripts/session-open-context.mjs" 2>/dev/null \
  || printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"[session-open] context load failed — read tools/session-state.json + tools/council/opus-open-items.md manually"}}'

exit 0
