#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-learning-loop
# @csps-name post-stop-learning-loop
# @csps-description PostStop hook — positive ZF pipeline: captures insights,
#   decisions, and gap-fixes from each AI response before they degrade to
#   invisible context. Enforces P-META-005 Learning Loop. Without this,
#   every insight that isn't explicitly extracted is lost at session boundary,
#   compounding into the same structural failures across sessions. Captures
#   to local JSONL until LearningLoopItem DB ships (weeks 2-6); then routes
#   to API. Per B_POSITIVE_VALUE_EXTRACTION: when positive events occur,
#   extract maximum value across all artifacts.
# @csps-version 1.1.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces P-META-005 B_POSITIVE_VALUE_EXTRACTION

set -euo pipefail

CAPTURE_LOG="${CSPS_LEARNING_LOOP_CAPTURE_LOG:-${HOME}/.claude/learning-loop-capture.jsonl}"
SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"
TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"

mkdir -p "$(dirname "$CAPTURE_LOG")" 2>/dev/null || true

# Append session-end record (becomes curl POST to /api/learning-loop/extract once DB ships)
printf '{"event":"learning-loop.post-stop","session_id":"%s","timestamp":"%s","transcript":"%s","status":"captured-pending-extraction"}\n' \
  "$SESSION_ID" "$TIMESTAMP" "$TRANSCRIPT_PATH" >> "$CAPTURE_LOG" 2>/dev/null || true

# ── EXCEPTIONAL-PATTERN SCAN (PROTO-S064 Item 1.1) ──────────────────────────
# Scans transcript for exceptional-output signals: structural insights, elegant solutions,
# rare cross-connections, self-corrections with governance value.
# Appends to tools/data/exceptional-moments-register.yaml as EM-S<NNN>-<NN> entries.
EXCEPTIONAL_REGISTER="${REPO_ROOT:-$(git rev-parse --show-toplevel 2>/dev/null || echo .)}/tools/data/exceptional-moments-register.yaml"
EXCEPTIONAL_PATTERNS=(
  "first time.*platform.*caught"
  "self-correction.*governance"
  "dog.food\|eat.*own.*dog"
  "structural insight"
  "compounding.*returns"
  "the platform.*mirror"
  "rare clarity"
  "unexpected.*connection"
  "first session.*mechanically"
)

if [ -f "$TRANSCRIPT_PATH" ] && [ -f "$EXCEPTIONAL_REGISTER" ]; then
  PATTERN_FOUND=false
  for pattern in "${EXCEPTIONAL_PATTERNS[@]}"; do
    if grep -qiE "$pattern" "$TRANSCRIPT_PATH" 2>/dev/null; then
      PATTERN_FOUND=true
      break
    fi
  done

  if [ "$PATTERN_FOUND" = "true" ]; then
    # Count existing entries to generate next ID
    EXISTING_COUNT=$(grep -c "^  - id: EM-" "$EXCEPTIONAL_REGISTER" 2>/dev/null || echo "0")
    NEXT_NUM=$(printf "%02d" $((EXISTING_COUNT + 1)))
    SESSION_SHORT="${SESSION_ID:-unknown}"

    # Append entry stub to register (AI fills in content during session close)
    node -e "
const fs = require('fs');
const path = '$EXCEPTIONAL_REGISTER';
const content = fs.readFileSync(path, 'utf-8');
const entry = '\n  - id: EM-${SESSION_SHORT}-${NEXT_NUM}\n    session: ${SESSION_SHORT}\n    timestamp: ${TIMESTAMP}\n    pattern_type: auto_detected\n    content: \"[To be extracted by AI during session-close CEC walk]\"\n    status: pending_extraction\n';
const updated = content.replace('entries: []', 'entries:').replace(/^entries:\s*$/, 'entries:') + entry;
fs.writeFileSync(path, updated, 'utf-8');
" 2>/dev/null || true
  fi
fi


# ─── PARK-040 AUTO-CAPTURE ARM (S085) ────────────────────────────────────────
# Captures patterns at post-stop into pending-auto-parks.yaml (CAPTURE ARM ONLY).
# Governor reviews + promotes. Non-blocking.
# ALIGN (Opus #24-A): each stub carries WHO+WARRANT+ACTION per comm-core trunk.
{
  _R="${CSPS_REPO_ROOT:-.}"
  _PF="${_R}/tools/data/pending-auto-parks.yaml"
  _T="${CLAUDE_TRANSCRIPT_PATH:-}"
  _S="${CLAUDE_SESSION_ID:-unknown}"
  _TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  _TRG=false; _PAT="general"; _PE=60; _URG="medium"; _ML=""
  if [ -f "$_T" ]; then
    if grep -qiE "(K=2|K=3|structural.fix|recurrence|always_rerun)" "$_T" 2>/dev/null; then
      _TRG=true; _PAT="structural_pattern"; _PE=75; _URG="high"
      _ML=$(grep -iE "(K=2|K=3|structural.fix|recurrence|always_rerun)" "$_T" 2>/dev/null | head -1 | tr -d '"' | cut -c1-80 || echo "")
    elif grep -qiE "(ghost.ref|context.independent|handoff.only)" "$_T" 2>/dev/null; then
      _TRG=true; _PAT="governance_gap"; _PE=65; _URG="medium"
      _ML=$(grep -iE "(ghost.ref|context.independent|handoff.only)" "$_T" 2>/dev/null | head -1 | tr -d '"' | cut -c1-80 || echo "")
    elif grep -qiE "(first real win|dogfood|dual.coverage)" "$_T" 2>/dev/null; then
      _TRG=true; _PAT="insight"; _PE=55; _URG="low"
      _ML=$(grep -iE "(first real win|dogfood|dual.coverage)" "$_T" 2>/dev/null | head -1 | tr -d '"' | cut -c1-80 || echo "")
    fi
  fi
  if [ "$_TRG" = "true" ]; then
    _EX=$(grep -c "PARK-.*-AUTO" "$_PF" 2>/dev/null || echo "0")
    _N=$(printf "%03d" $((_EX + 1)))
    [ -f "$_PF" ] || printf '# pending-auto-parks.yaml\n# PARK-040 auto-capture S085.\nentries:\n' > "$_PF" 2>/dev/null
    printf '  - id: "PARK-%s-AUTO-%s"\n    session: %s\n    timestamp: "%s"\n    pattern_type: %s\n    auto_pe_score: %s\n    urgency: %s\n    who: "post-stop-learning-loop.sh (tab-agnostic)"\n    warrant: "[MEASURED] pattern=%s | trigger: %s"\n    action: "Governor review + promote to PARK register"\n    content: "[Auto: %s]"\n    status: pending_review\n' \
      "$_S" "$_N" "$_S" "$_TS" "$_PAT" "$_PE" "$_URG" "$_PAT" "$_ML" "$_PAT" >> "$_PF" 2>/dev/null || true
  fi
} 2>/dev/null || true

# Inject positive ZF requirement into AI context
printf '{
  "systemMessage": "[positive-ZF] Learning Loop capture — session %s at %s\\n\\nPOSITIVE ZF OBLIGATION (P-META-005 + B_POSITIVE_VALUE_EXTRACTION):\\nEvery substantive session must extract ≥1 of these positive ZF outputs:\\n  A) New drift-log entry (continuous-drift-log.md) — new pattern observed\\n  B) Reasoning-patterns.md promotion — K=2 pattern reached\\n  C) Memory entry updated — insight worth carrying forward\\n  D) CEC propagation — new element enhanced existing surfaces\\n  E) VLT created — blocking decision surfaced for Governor\\n\\nIF this turn had none: add explicit declaration:\\n  \\"Positive ZF: no new patterns this turn — reason: [mechanical/routine/deferred]\\"\\n\\nWHY THIS MATTERS (not just a rule):\\nInsights that are not explicitly extracted are lost at session boundary.\\nThe plan-promise-abandonment pattern was invisible for 3 sessions because\\nno one extracted the pattern and named it. Naming it in the drift-log was\\nwhat made the structural fix (validate-open-plan-levels.mjs) possible.\\nEvery session that extracts ≥1 insight compounds the platform. Sessions\\nthat extract 0 miss the positive ZF cycle entirely."
}' "$SESSION_ID" "$TIMESTAMP"

exit 0
