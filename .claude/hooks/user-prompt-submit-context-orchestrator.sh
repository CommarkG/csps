#!/bin/bash
# user-prompt-submit-context-orchestrator.sh
# Detects task-class from user prompt; suggests context-loading template artifacts.
#
# Per token-optimization §9.10 Phase 9: makes context-loading templates mechanical.
# AMENDMENT-1 S086: reads user prompt via tools/lib/hook-read-prompt.sh (canonical reader).
# Emits loading suggestions to stderr (advisory; does not inject — Phase 10 activation).
#
# Architecture: ADVISORY → ACTIVE
#   Advisory (S011): detects + logs to stderr; AI reads log + loads suggested artifacts
#   Active (S012+): settings.json pattern-injection makes artifact loading automatic
#
# Root cause targeted: context-loading templates were advisory JSON specs with no trigger
# mechanism. This hook is the detection layer that makes them active.
#
# Registered audit slug: context-orchestrator-hook-presence (wired to B_TOKEN_BUDGET R1)

set -euo pipefail

# Context-loading templates directory
TEMPLATES_DIR="$(dirname "$0")/../../tools/templates/context-loading"
LOG_FILE="$(dirname "$0")/../../tools/context-orchestrator-last-run.json"

# Normalise prompt for matching
PROMPT="$("$REPO_ROOT/tools/lib/hook-read-prompt.sh")"
PROMPT_LOWER=$(echo "$PROMPT" | tr '[:upper:]' '[:lower:]')

# Task-class detection (ordered by specificity — most-specific patterns first)
detect_task_class() {
  local p="$1"

  # Session governance patterns
  if echo "$p" | grep -qiE "§17 receipt|session opens|you are s[0-9]+|handoff-s[0-9]+-to|open.*handoff|starting session|execute.*instruction|continue from last session|continue from s[0-9]+|s[0-9]+ of the csps"; then
    echo "session-open"
    return
  fi

  # Session close patterns
  if echo "$p" | grep -qiE "session close|closing summary|handoff.*before|hpfa|§10\.|§17 attest|carry.forward|close s[0-9]+"; then
    echo "session-close"
    return
  fi

  # Engraving patterns
  if echo "$p" | grep -qiE "engrave|5-surface|5/5 atomic|fse|new b_|new principle|ratify discipline|atomic registration|behavioral contract"; then
    echo "engraving"
    return
  fi

  # ZF/validation patterns
  if echo "$p" | grep -qiE "pnpm verify|zero findings|rzf|cec|pre-close|exit_code 0|validation|done claim|ratified|validated"; then
    echo "qc-validation"
    return
  fi

  # PCR decision patterns
  if echo "$p" | grep -qiE "should we|option a.*option b|which option|decide between|pros and cons|alternatives|options:|x vs y"; then
    echo "pcr"
    return
  fi

  # MCP / principle lookup patterns
  if echo "$p" | grep -qiE "what does p-[a-z]+-[0-9]+ mean|look up principle|get_principle|list principles|find_by_spine|check_reuse|which principle"; then
    echo "mcp-query"
    return
  fi

  # Agent spawn patterns
  if echo "$p" | grep -qiE "spawn agent|agent\(|subagent|delegate to|explore agent|plan agent|class b agent"; then
    echo "agent-spawn"
    return
  fi

  # Frontmatter authoring patterns
  if echo "$p" | grep -qiE "frontmatter|lifecycle_state|maturity:|domain:|new artifact|governed artifact|template_used|apply csps"; then
    echo "frontmatter-authoring"
    return
  fi

  echo "unknown"
}

TASK_CLASS=$(detect_task_class "$PROMPT_LOWER")
TEMPLATE_FILE="$TEMPLATES_DIR/${TASK_CLASS}.json"

# PLAN TYPE detection (C1 — Opus Turn 11 — S015-C1 resolved)
# Reads active plan execution_mode + depth_chosen → LIGHTWEIGHT or COMPREHENSIVE context loading
# Lightweight: velocity/balanced + depth 3 → minimal context (task-specific only)
# Comprehensive: deep_quality + depth 4-5 → full DNA + arc + session + PE state
get_plan_type() {
  local ss_file="$(dirname "$0")/../../tools/session-state.json"
  if [ ! -f "$ss_file" ]; then echo "LIGHTWEIGHT"; return; fi
  node -e "
    const d = JSON.parse(require('fs').readFileSync('$ss_file', 'utf8'));
    const em = (d.session_mandate || {}).execution_mode || '';
    const depth = (d.session_mandate || {}).depth_chosen || 3;
    if (em === 'deep_quality' || depth >= 4) {
      process.stdout.write('COMPREHENSIVE');
    } else {
      process.stdout.write('LIGHTWEIGHT');
    }
  " 2>/dev/null || echo "LIGHTWEIGHT"
}
PLAN_TYPE=$(get_plan_type)

# Build JSON output
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || echo "unknown")
PROMPT_LEN=${#PROMPT}

if [ "$TASK_CLASS" = "unknown" ] || [ ! -f "$TEMPLATE_FILE" ]; then
  OUTPUT=$(printf '{"timestamp":"%s","task_class":"unknown","detected":false,"prompt_len":%d,"note":"no template match — general task; load AGENTS.md + OVERVIEW.md L1"}' \
    "$TIMESTAMP" "$PROMPT_LEN")
  echo "$OUTPUT" > "$LOG_FILE" 2>/dev/null || true
  # @core-seed: GRACE_PHASE10 | plan: docs/plan/_handoff/VAULT/topic-plans/platform-core-alignment.md §5 | grows-to: automatic context bundle injection (not just suggestion logging) | target: S020
exit 0
fi

# Read template and extract required_artifacts
REQUIRED=$(node -e "
const fs = require('fs');
const t = JSON.parse(fs.readFileSync('$TEMPLATE_FILE', 'utf8'));
const arts = (t.required_artifacts || []).filter(a => !a.path.includes('<'));
const cost = arts.reduce((s,a) => s + (a.estimated_tokens || 0), t.estimated_token_cost_L1 || 0);
process.stdout.write(JSON.stringify({artifacts: arts.map(a=>a.path), model_tier: t.model_tier, cost_estimate: cost}));
" 2>/dev/null || echo '{"artifacts":[],"model_tier":"Sonnet","cost_estimate":0}')

OUTPUT=$(printf '{"timestamp":"%s","task_class":"%s","detected":true,"prompt_len":%d,"template":"%s","recommendation":%s}' \
  "$TIMESTAMP" "$TASK_CLASS" "$PROMPT_LEN" "${TASK_CLASS}.json" "$REQUIRED")

echo "$OUTPUT" > "$LOG_FILE" 2>/dev/null || true

# Emit suggestion to stderr (visible in Claude Code hook output)
MODEL=$(echo "$REQUIRED" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).model_tier||'Sonnet'))" 2>/dev/null || echo "Sonnet")
COST=$(echo "$REQUIRED" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).cost_estimate||0))" 2>/dev/null || echo "0")

>&2 echo "[context-orchestrator] task_class=${TASK_CLASS} plan_type=${PLAN_TYPE} model_tier=${MODEL} L1_cost~${COST}tok template=${TASK_CLASS}.json"
if [ "$PLAN_TYPE" = "COMPREHENSIVE" ]; then
  >&2 echo "[context-orchestrator] COMPREHENSIVE mode: load DNA + arc plan + full PE state + session history"
else
  >&2 echo "[context-orchestrator] LIGHTWEIGHT mode: load task-specific context only"
fi

exit 0

# ─── P2 S086: PARKS-AWARE GATE — fires on build/new-work intent ─────────────
# Extends "consult all signals" rule: before any new build, surface PE context
# bundle (park-register + improvement-register + open-plan-levels + consolidation).
# Non-blocking — advisory only. Pattern: detect build keyword → emit bundle.
{
  _BUILD_INTENT=false
  if echo "$PROMPT_LOWER" | grep -qiE "build|implement|create new|add.*hook|add.*validator|write.*file|new.*feature|new.*page|new.*api|scaffold|generate"; then
    _BUILD_INTENT=true
  fi

  if [ "$_BUILD_INTENT" = "true" ]; then
    REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
    if [ -f "${REPO_ROOT}/tools/pe-compute.mjs" ]; then
      >&2 echo "[pe-parks-gate] build intent detected — consulting all signals..."
      node "${REPO_ROOT}/tools/pe-compute.mjs" --parks-context 2>/dev/null || true
    fi
  fi
} 2>/dev/null || true
