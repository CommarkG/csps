#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-learning-loop
# @csps-name post-stop-learning-loop
# @csps-description PostStop hook ג€” positive ZF pipeline: captures insights,
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

# ג”€ג”€ EXCEPTIONAL-PATTERN SCAN (PROTO-S064 Item 1.1) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
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


# ─── PARK-040 AUTO-CAPTURE ARM (S085 — Opus #23 ruling) ─────────────────────
# Captures issues/insights/corrections at post-stop into pending-auto-parks.yaml.
# CAPTURE ARM ONLY: model-uplift + coverage metric stay B5.
# Auto-PE: assigns urgency-based PE score on pattern detection.
# Non-blocking: runs silently; findings summarized in positive-ZF prompt.
{
  _REPO_ROOT="${CSPS_REPO_ROOT:-.}"
  _PENDING_PARKS="${_REPO_ROOT}/tools/data/pending-auto-parks.yaml"
  _TRANSCRIPT="${CLAUDE_TRANSCRIPT_PATH:-}"
  _CAP_SESSION="${CLAUDE_SESSION_ID:-unknown}"
  _CAP_TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  _AUTO_TRIGGERED=false
  _PARK_PATTERN="general"
  _PARK_PE=60
  _PARK_URGENCY="medium"

  if [ -f "#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-learning-loop
# @csps-name post-stop-learning-loop
# @csps-description PostStop hook ג€” positive ZF pipeline: captures insights,
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

# ג”€ג”€ EXCEPTIONAL-PATTERN SCAN (PROTO-S064 Item 1.1) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
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

# Inject positive ZF requirement into AI context
printf '{
  "systemMessage": "[positive-ZF] Learning Loop capture ג€” session %s at %s\\n\\nPOSITIVE ZF OBLIGATION (P-META-005 + B_POSITIVE_VALUE_EXTRACTION):\\nEvery substantive session must extract ג‰¥1 of these positive ZF outputs:\\n  A) New drift-log entry (continuous-drift-log.md) ג€” new pattern observed\\n  B) Reasoning-patterns.md promotion ג€” K=2 pattern reached\\n  C) Memory entry updated ג€” insight worth carrying forward\\n  D) CEC propagation ג€” new element enhanced existing surfaces\\n  E) VLT created ג€” blocking decision surfaced for Governor\\n\\nIF this turn had none: add explicit declaration:\\n  \\"Positive ZF: no new patterns this turn ג€” reason: [mechanical/routine/deferred]\\"\\n\\nWHY THIS MATTERS (not just a rule):\\nInsights that are not explicitly extracted are lost at session boundary.\\nThe plan-promise-abandonment pattern was invisible for 3 sessions because\\nno one extracted the pattern and named it. Naming it in the drift-log was\\nwhat made the structural fix (validate-open-plan-levels.mjs) possible.\\nEvery session that extracts ג‰¥1 insight compounds the platform. Sessions\\nthat extract 0 miss the positive ZF cycle entirely."
}' "$SESSION_ID" "$TIMESTAMP"

exit 0
TRANSCRIPT" ]; then
    if grep -qiE "(K=2|K=3|structural.fix|recurrence|gap_|always_rerun|creation.level)" "#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-learning-loop
# @csps-name post-stop-learning-loop
# @csps-description PostStop hook ג€” positive ZF pipeline: captures insights,
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

# ג”€ג”€ EXCEPTIONAL-PATTERN SCAN (PROTO-S064 Item 1.1) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
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

# Inject positive ZF requirement into AI context
printf '{
  "systemMessage": "[positive-ZF] Learning Loop capture ג€” session %s at %s\\n\\nPOSITIVE ZF OBLIGATION (P-META-005 + B_POSITIVE_VALUE_EXTRACTION):\\nEvery substantive session must extract ג‰¥1 of these positive ZF outputs:\\n  A) New drift-log entry (continuous-drift-log.md) ג€” new pattern observed\\n  B) Reasoning-patterns.md promotion ג€” K=2 pattern reached\\n  C) Memory entry updated ג€” insight worth carrying forward\\n  D) CEC propagation ג€” new element enhanced existing surfaces\\n  E) VLT created ג€” blocking decision surfaced for Governor\\n\\nIF this turn had none: add explicit declaration:\\n  \\"Positive ZF: no new patterns this turn ג€” reason: [mechanical/routine/deferred]\\"\\n\\nWHY THIS MATTERS (not just a rule):\\nInsights that are not explicitly extracted are lost at session boundary.\\nThe plan-promise-abandonment pattern was invisible for 3 sessions because\\nno one extracted the pattern and named it. Naming it in the drift-log was\\nwhat made the structural fix (validate-open-plan-levels.mjs) possible.\\nEvery session that extracts ג‰¥1 insight compounds the platform. Sessions\\nthat extract 0 miss the positive ZF cycle entirely."
}' "$SESSION_ID" "$TIMESTAMP"

exit 0
TRANSCRIPT" 2>/dev/null; then
      _AUTO_TRIGGERED=true; _PARK_PATTERN="structural_pattern"; _PARK_PE=75; _PARK_URGENCY="high"
    fi
    if grep -qiE "(ghost.ref|context.independent|handoff.only|advisory.forever|AP-001)" "#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-learning-loop
# @csps-name post-stop-learning-loop
# @csps-description PostStop hook ג€” positive ZF pipeline: captures insights,
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

# ג”€ג”€ EXCEPTIONAL-PATTERN SCAN (PROTO-S064 Item 1.1) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
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

# Inject positive ZF requirement into AI context
printf '{
  "systemMessage": "[positive-ZF] Learning Loop capture ג€” session %s at %s\\n\\nPOSITIVE ZF OBLIGATION (P-META-005 + B_POSITIVE_VALUE_EXTRACTION):\\nEvery substantive session must extract ג‰¥1 of these positive ZF outputs:\\n  A) New drift-log entry (continuous-drift-log.md) ג€” new pattern observed\\n  B) Reasoning-patterns.md promotion ג€” K=2 pattern reached\\n  C) Memory entry updated ג€” insight worth carrying forward\\n  D) CEC propagation ג€” new element enhanced existing surfaces\\n  E) VLT created ג€” blocking decision surfaced for Governor\\n\\nIF this turn had none: add explicit declaration:\\n  \\"Positive ZF: no new patterns this turn ג€” reason: [mechanical/routine/deferred]\\"\\n\\nWHY THIS MATTERS (not just a rule):\\nInsights that are not explicitly extracted are lost at session boundary.\\nThe plan-promise-abandonment pattern was invisible for 3 sessions because\\nno one extracted the pattern and named it. Naming it in the drift-log was\\nwhat made the structural fix (validate-open-plan-levels.mjs) possible.\\nEvery session that extracts ג‰¥1 insight compounds the platform. Sessions\\nthat extract 0 miss the positive ZF cycle entirely."
}' "$SESSION_ID" "$TIMESTAMP"

exit 0
TRANSCRIPT" 2>/dev/null; then
      _AUTO_TRIGGERED=true; _PARK_PATTERN="governance_gap"; _PARK_PE=65; _PARK_URGENCY="medium"
    fi
    if grep -qiE "(first real win|dogfood|permanent solution|dual.coverage)" "#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-learning-loop
# @csps-name post-stop-learning-loop
# @csps-description PostStop hook ג€” positive ZF pipeline: captures insights,
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

# ג”€ג”€ EXCEPTIONAL-PATTERN SCAN (PROTO-S064 Item 1.1) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
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

# Inject positive ZF requirement into AI context
printf '{
  "systemMessage": "[positive-ZF] Learning Loop capture ג€” session %s at %s\\n\\nPOSITIVE ZF OBLIGATION (P-META-005 + B_POSITIVE_VALUE_EXTRACTION):\\nEvery substantive session must extract ג‰¥1 of these positive ZF outputs:\\n  A) New drift-log entry (continuous-drift-log.md) ג€” new pattern observed\\n  B) Reasoning-patterns.md promotion ג€” K=2 pattern reached\\n  C) Memory entry updated ג€” insight worth carrying forward\\n  D) CEC propagation ג€” new element enhanced existing surfaces\\n  E) VLT created ג€” blocking decision surfaced for Governor\\n\\nIF this turn had none: add explicit declaration:\\n  \\"Positive ZF: no new patterns this turn ג€” reason: [mechanical/routine/deferred]\\"\\n\\nWHY THIS MATTERS (not just a rule):\\nInsights that are not explicitly extracted are lost at session boundary.\\nThe plan-promise-abandonment pattern was invisible for 3 sessions because\\nno one extracted the pattern and named it. Naming it in the drift-log was\\nwhat made the structural fix (validate-open-plan-levels.mjs) possible.\\nEvery session that extracts ג‰¥1 insight compounds the platform. Sessions\\nthat extract 0 miss the positive ZF cycle entirely."
}' "$SESSION_ID" "$TIMESTAMP"

exit 0
TRANSCRIPT" 2>/dev/null; then
      if [ "#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-learning-loop
# @csps-name post-stop-learning-loop
# @csps-description PostStop hook ג€” positive ZF pipeline: captures insights,
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

# ג”€ג”€ EXCEPTIONAL-PATTERN SCAN (PROTO-S064 Item 1.1) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
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

# Inject positive ZF requirement into AI context
printf '{
  "systemMessage": "[positive-ZF] Learning Loop capture ג€” session %s at %s\\n\\nPOSITIVE ZF OBLIGATION (P-META-005 + B_POSITIVE_VALUE_EXTRACTION):\\nEvery substantive session must extract ג‰¥1 of these positive ZF outputs:\\n  A) New drift-log entry (continuous-drift-log.md) ג€” new pattern observed\\n  B) Reasoning-patterns.md promotion ג€” K=2 pattern reached\\n  C) Memory entry updated ג€” insight worth carrying forward\\n  D) CEC propagation ג€” new element enhanced existing surfaces\\n  E) VLT created ג€” blocking decision surfaced for Governor\\n\\nIF this turn had none: add explicit declaration:\\n  \\"Positive ZF: no new patterns this turn ג€” reason: [mechanical/routine/deferred]\\"\\n\\nWHY THIS MATTERS (not just a rule):\\nInsights that are not explicitly extracted are lost at session boundary.\\nThe plan-promise-abandonment pattern was invisible for 3 sessions because\\nno one extracted the pattern and named it. Naming it in the drift-log was\\nwhat made the structural fix (validate-open-plan-levels.mjs) possible.\\nEvery session that extracts ג‰¥1 insight compounds the platform. Sessions\\nthat extract 0 miss the positive ZF cycle entirely."
}' "$SESSION_ID" "$TIMESTAMP"

exit 0
AUTO_TRIGGERED" != "true" ]; then
        _AUTO_TRIGGERED=true; _PARK_PATTERN="insight"; _PARK_PE=55; _PARK_URGENCY="low"
      fi
    fi
  fi

  if [ "#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-learning-loop
# @csps-name post-stop-learning-loop
# @csps-description PostStop hook ג€” positive ZF pipeline: captures insights,
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

# ג”€ג”€ EXCEPTIONAL-PATTERN SCAN (PROTO-S064 Item 1.1) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
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

# Inject positive ZF requirement into AI context
printf '{
  "systemMessage": "[positive-ZF] Learning Loop capture ג€” session %s at %s\\n\\nPOSITIVE ZF OBLIGATION (P-META-005 + B_POSITIVE_VALUE_EXTRACTION):\\nEvery substantive session must extract ג‰¥1 of these positive ZF outputs:\\n  A) New drift-log entry (continuous-drift-log.md) ג€” new pattern observed\\n  B) Reasoning-patterns.md promotion ג€” K=2 pattern reached\\n  C) Memory entry updated ג€” insight worth carrying forward\\n  D) CEC propagation ג€” new element enhanced existing surfaces\\n  E) VLT created ג€” blocking decision surfaced for Governor\\n\\nIF this turn had none: add explicit declaration:\\n  \\"Positive ZF: no new patterns this turn ג€” reason: [mechanical/routine/deferred]\\"\\n\\nWHY THIS MATTERS (not just a rule):\\nInsights that are not explicitly extracted are lost at session boundary.\\nThe plan-promise-abandonment pattern was invisible for 3 sessions because\\nno one extracted the pattern and named it. Naming it in the drift-log was\\nwhat made the structural fix (validate-open-plan-levels.mjs) possible.\\nEvery session that extracts ג‰¥1 insight compounds the platform. Sessions\\nthat extract 0 miss the positive ZF cycle entirely."
}' "$SESSION_ID" "$TIMESTAMP"

exit 0
AUTO_TRIGGERED" = "true" ]; then
    _EXISTING=$(grep -c "^  - id: PARK-.*-AUTO" "#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-learning-loop
# @csps-name post-stop-learning-loop
# @csps-description PostStop hook ג€” positive ZF pipeline: captures insights,
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

# ג”€ג”€ EXCEPTIONAL-PATTERN SCAN (PROTO-S064 Item 1.1) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
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

# Inject positive ZF requirement into AI context
printf '{
  "systemMessage": "[positive-ZF] Learning Loop capture ג€” session %s at %s\\n\\nPOSITIVE ZF OBLIGATION (P-META-005 + B_POSITIVE_VALUE_EXTRACTION):\\nEvery substantive session must extract ג‰¥1 of these positive ZF outputs:\\n  A) New drift-log entry (continuous-drift-log.md) ג€” new pattern observed\\n  B) Reasoning-patterns.md promotion ג€” K=2 pattern reached\\n  C) Memory entry updated ג€” insight worth carrying forward\\n  D) CEC propagation ג€” new element enhanced existing surfaces\\n  E) VLT created ג€” blocking decision surfaced for Governor\\n\\nIF this turn had none: add explicit declaration:\\n  \\"Positive ZF: no new patterns this turn ג€” reason: [mechanical/routine/deferred]\\"\\n\\nWHY THIS MATTERS (not just a rule):\\nInsights that are not explicitly extracted are lost at session boundary.\\nThe plan-promise-abandonment pattern was invisible for 3 sessions because\\nno one extracted the pattern and named it. Naming it in the drift-log was\\nwhat made the structural fix (validate-open-plan-levels.mjs) possible.\\nEvery session that extracts ג‰¥1 insight compounds the platform. Sessions\\nthat extract 0 miss the positive ZF cycle entirely."
}' "$SESSION_ID" "$TIMESTAMP"

exit 0
PENDING_PARKS" 2>/dev/null || echo "0")
    _NEXT_NUM=$(printf "%03d" $((_EXISTING + 1)))
    node -e "
const fs=require('fs'),p=require('path');
const f=process.env.PARK_FILE;
const id='PARK-'+process.env.PARK_SESSION+'-AUTO-'+process.env.PARK_NUM;
try{
  fs.mkdirSync(p.dirname(f),{recursive:true});
  if(!fs.existsSync(f)){
    fs.writeFileSync(f,'# pending-auto-parks.yaml\n# Auto-captured at post-stop (PARK-040 capture arm S085).\n# Governor reviews + promotes entries to park-register.yaml.\nentries:\n');
  }
  const entry=[
    '  - id: \"'+id+'\"',
    '    session: '+process.env.PARK_SESSION,
    '    timestamp: '+JSON.stringify(process.env.PARK_TS),
    '    lane: queue',
    '    pattern_type: '+process.env.PARK_PATTERN,
    '    auto_pe_score: '+process.env.PARK_PE,
    '    urgency: '+process.env.PARK_URGENCY,
    '    content: \"[Auto-detected: '+process.env.PARK_PATTERN+'. Governor review required.]\"',
    '    status: pending_review',
  ].join('\n')+'\n';
  fs.appendFileSync(f,entry);
}catch(e){}
" 2>/dev/null \
    PARK_FILE="#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-learning-loop
# @csps-name post-stop-learning-loop
# @csps-description PostStop hook ג€” positive ZF pipeline: captures insights,
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

# ג”€ג”€ EXCEPTIONAL-PATTERN SCAN (PROTO-S064 Item 1.1) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
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

# Inject positive ZF requirement into AI context
printf '{
  "systemMessage": "[positive-ZF] Learning Loop capture ג€” session %s at %s\\n\\nPOSITIVE ZF OBLIGATION (P-META-005 + B_POSITIVE_VALUE_EXTRACTION):\\nEvery substantive session must extract ג‰¥1 of these positive ZF outputs:\\n  A) New drift-log entry (continuous-drift-log.md) ג€” new pattern observed\\n  B) Reasoning-patterns.md promotion ג€” K=2 pattern reached\\n  C) Memory entry updated ג€” insight worth carrying forward\\n  D) CEC propagation ג€” new element enhanced existing surfaces\\n  E) VLT created ג€” blocking decision surfaced for Governor\\n\\nIF this turn had none: add explicit declaration:\\n  \\"Positive ZF: no new patterns this turn ג€” reason: [mechanical/routine/deferred]\\"\\n\\nWHY THIS MATTERS (not just a rule):\\nInsights that are not explicitly extracted are lost at session boundary.\\nThe plan-promise-abandonment pattern was invisible for 3 sessions because\\nno one extracted the pattern and named it. Naming it in the drift-log was\\nwhat made the structural fix (validate-open-plan-levels.mjs) possible.\\nEvery session that extracts ג‰¥1 insight compounds the platform. Sessions\\nthat extract 0 miss the positive ZF cycle entirely."
}' "$SESSION_ID" "$TIMESTAMP"

exit 0
PENDING_PARKS" PARK_SESSION="#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-learning-loop
# @csps-name post-stop-learning-loop
# @csps-description PostStop hook ג€” positive ZF pipeline: captures insights,
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

# ג”€ג”€ EXCEPTIONAL-PATTERN SCAN (PROTO-S064 Item 1.1) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
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

# Inject positive ZF requirement into AI context
printf '{
  "systemMessage": "[positive-ZF] Learning Loop capture ג€” session %s at %s\\n\\nPOSITIVE ZF OBLIGATION (P-META-005 + B_POSITIVE_VALUE_EXTRACTION):\\nEvery substantive session must extract ג‰¥1 of these positive ZF outputs:\\n  A) New drift-log entry (continuous-drift-log.md) ג€” new pattern observed\\n  B) Reasoning-patterns.md promotion ג€” K=2 pattern reached\\n  C) Memory entry updated ג€” insight worth carrying forward\\n  D) CEC propagation ג€” new element enhanced existing surfaces\\n  E) VLT created ג€” blocking decision surfaced for Governor\\n\\nIF this turn had none: add explicit declaration:\\n  \\"Positive ZF: no new patterns this turn ג€” reason: [mechanical/routine/deferred]\\"\\n\\nWHY THIS MATTERS (not just a rule):\\nInsights that are not explicitly extracted are lost at session boundary.\\nThe plan-promise-abandonment pattern was invisible for 3 sessions because\\nno one extracted the pattern and named it. Naming it in the drift-log was\\nwhat made the structural fix (validate-open-plan-levels.mjs) possible.\\nEvery session that extracts ג‰¥1 insight compounds the platform. Sessions\\nthat extract 0 miss the positive ZF cycle entirely."
}' "$SESSION_ID" "$TIMESTAMP"

exit 0
CAP_SESSION" PARK_TS="#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-learning-loop
# @csps-name post-stop-learning-loop
# @csps-description PostStop hook ג€” positive ZF pipeline: captures insights,
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

# ג”€ג”€ EXCEPTIONAL-PATTERN SCAN (PROTO-S064 Item 1.1) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
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

# Inject positive ZF requirement into AI context
printf '{
  "systemMessage": "[positive-ZF] Learning Loop capture ג€” session %s at %s\\n\\nPOSITIVE ZF OBLIGATION (P-META-005 + B_POSITIVE_VALUE_EXTRACTION):\\nEvery substantive session must extract ג‰¥1 of these positive ZF outputs:\\n  A) New drift-log entry (continuous-drift-log.md) ג€” new pattern observed\\n  B) Reasoning-patterns.md promotion ג€” K=2 pattern reached\\n  C) Memory entry updated ג€” insight worth carrying forward\\n  D) CEC propagation ג€” new element enhanced existing surfaces\\n  E) VLT created ג€” blocking decision surfaced for Governor\\n\\nIF this turn had none: add explicit declaration:\\n  \\"Positive ZF: no new patterns this turn ג€” reason: [mechanical/routine/deferred]\\"\\n\\nWHY THIS MATTERS (not just a rule):\\nInsights that are not explicitly extracted are lost at session boundary.\\nThe plan-promise-abandonment pattern was invisible for 3 sessions because\\nno one extracted the pattern and named it. Naming it in the drift-log was\\nwhat made the structural fix (validate-open-plan-levels.mjs) possible.\\nEvery session that extracts ג‰¥1 insight compounds the platform. Sessions\\nthat extract 0 miss the positive ZF cycle entirely."
}' "$SESSION_ID" "$TIMESTAMP"

exit 0
CAP_TS" \
    PARK_PATTERN="#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-learning-loop
# @csps-name post-stop-learning-loop
# @csps-description PostStop hook ג€” positive ZF pipeline: captures insights,
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

# ג”€ג”€ EXCEPTIONAL-PATTERN SCAN (PROTO-S064 Item 1.1) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
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

# Inject positive ZF requirement into AI context
printf '{
  "systemMessage": "[positive-ZF] Learning Loop capture ג€” session %s at %s\\n\\nPOSITIVE ZF OBLIGATION (P-META-005 + B_POSITIVE_VALUE_EXTRACTION):\\nEvery substantive session must extract ג‰¥1 of these positive ZF outputs:\\n  A) New drift-log entry (continuous-drift-log.md) ג€” new pattern observed\\n  B) Reasoning-patterns.md promotion ג€” K=2 pattern reached\\n  C) Memory entry updated ג€” insight worth carrying forward\\n  D) CEC propagation ג€” new element enhanced existing surfaces\\n  E) VLT created ג€” blocking decision surfaced for Governor\\n\\nIF this turn had none: add explicit declaration:\\n  \\"Positive ZF: no new patterns this turn ג€” reason: [mechanical/routine/deferred]\\"\\n\\nWHY THIS MATTERS (not just a rule):\\nInsights that are not explicitly extracted are lost at session boundary.\\nThe plan-promise-abandonment pattern was invisible for 3 sessions because\\nno one extracted the pattern and named it. Naming it in the drift-log was\\nwhat made the structural fix (validate-open-plan-levels.mjs) possible.\\nEvery session that extracts ג‰¥1 insight compounds the platform. Sessions\\nthat extract 0 miss the positive ZF cycle entirely."
}' "$SESSION_ID" "$TIMESTAMP"

exit 0
PARK_PATTERN" PARK_PE="#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-learning-loop
# @csps-name post-stop-learning-loop
# @csps-description PostStop hook ג€” positive ZF pipeline: captures insights,
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

# ג”€ג”€ EXCEPTIONAL-PATTERN SCAN (PROTO-S064 Item 1.1) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
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

# Inject positive ZF requirement into AI context
printf '{
  "systemMessage": "[positive-ZF] Learning Loop capture ג€” session %s at %s\\n\\nPOSITIVE ZF OBLIGATION (P-META-005 + B_POSITIVE_VALUE_EXTRACTION):\\nEvery substantive session must extract ג‰¥1 of these positive ZF outputs:\\n  A) New drift-log entry (continuous-drift-log.md) ג€” new pattern observed\\n  B) Reasoning-patterns.md promotion ג€” K=2 pattern reached\\n  C) Memory entry updated ג€” insight worth carrying forward\\n  D) CEC propagation ג€” new element enhanced existing surfaces\\n  E) VLT created ג€” blocking decision surfaced for Governor\\n\\nIF this turn had none: add explicit declaration:\\n  \\"Positive ZF: no new patterns this turn ג€” reason: [mechanical/routine/deferred]\\"\\n\\nWHY THIS MATTERS (not just a rule):\\nInsights that are not explicitly extracted are lost at session boundary.\\nThe plan-promise-abandonment pattern was invisible for 3 sessions because\\nno one extracted the pattern and named it. Naming it in the drift-log was\\nwhat made the structural fix (validate-open-plan-levels.mjs) possible.\\nEvery session that extracts ג‰¥1 insight compounds the platform. Sessions\\nthat extract 0 miss the positive ZF cycle entirely."
}' "$SESSION_ID" "$TIMESTAMP"

exit 0
PARK_PE" PARK_URGENCY="#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-learning-loop
# @csps-name post-stop-learning-loop
# @csps-description PostStop hook ג€” positive ZF pipeline: captures insights,
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

# ג”€ג”€ EXCEPTIONAL-PATTERN SCAN (PROTO-S064 Item 1.1) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
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

# Inject positive ZF requirement into AI context
printf '{
  "systemMessage": "[positive-ZF] Learning Loop capture ג€” session %s at %s\\n\\nPOSITIVE ZF OBLIGATION (P-META-005 + B_POSITIVE_VALUE_EXTRACTION):\\nEvery substantive session must extract ג‰¥1 of these positive ZF outputs:\\n  A) New drift-log entry (continuous-drift-log.md) ג€” new pattern observed\\n  B) Reasoning-patterns.md promotion ג€” K=2 pattern reached\\n  C) Memory entry updated ג€” insight worth carrying forward\\n  D) CEC propagation ג€” new element enhanced existing surfaces\\n  E) VLT created ג€” blocking decision surfaced for Governor\\n\\nIF this turn had none: add explicit declaration:\\n  \\"Positive ZF: no new patterns this turn ג€” reason: [mechanical/routine/deferred]\\"\\n\\nWHY THIS MATTERS (not just a rule):\\nInsights that are not explicitly extracted are lost at session boundary.\\nThe plan-promise-abandonment pattern was invisible for 3 sessions because\\nno one extracted the pattern and named it. Naming it in the drift-log was\\nwhat made the structural fix (validate-open-plan-levels.mjs) possible.\\nEvery session that extracts ג‰¥1 insight compounds the platform. Sessions\\nthat extract 0 miss the positive ZF cycle entirely."
}' "$SESSION_ID" "$TIMESTAMP"

exit 0
PARK_URGENCY" \
    PARK_NUM="#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-learning-loop
# @csps-name post-stop-learning-loop
# @csps-description PostStop hook ג€” positive ZF pipeline: captures insights,
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

# ג”€ג”€ EXCEPTIONAL-PATTERN SCAN (PROTO-S064 Item 1.1) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
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

# Inject positive ZF requirement into AI context
printf '{
  "systemMessage": "[positive-ZF] Learning Loop capture ג€” session %s at %s\\n\\nPOSITIVE ZF OBLIGATION (P-META-005 + B_POSITIVE_VALUE_EXTRACTION):\\nEvery substantive session must extract ג‰¥1 of these positive ZF outputs:\\n  A) New drift-log entry (continuous-drift-log.md) ג€” new pattern observed\\n  B) Reasoning-patterns.md promotion ג€” K=2 pattern reached\\n  C) Memory entry updated ג€” insight worth carrying forward\\n  D) CEC propagation ג€” new element enhanced existing surfaces\\n  E) VLT created ג€” blocking decision surfaced for Governor\\n\\nIF this turn had none: add explicit declaration:\\n  \\"Positive ZF: no new patterns this turn ג€” reason: [mechanical/routine/deferred]\\"\\n\\nWHY THIS MATTERS (not just a rule):\\nInsights that are not explicitly extracted are lost at session boundary.\\nThe plan-promise-abandonment pattern was invisible for 3 sessions because\\nno one extracted the pattern and named it. Naming it in the drift-log was\\nwhat made the structural fix (validate-open-plan-levels.mjs) possible.\\nEvery session that extracts ג‰¥1 insight compounds the platform. Sessions\\nthat extract 0 miss the positive ZF cycle entirely."
}' "$SESSION_ID" "$TIMESTAMP"

exit 0
NEXT_NUM" || true
  fi
} 2>/dev/null || true
# Inject positive ZF requirement into AI context
printf '{
  "systemMessage": "[positive-ZF] Learning Loop capture ג€” session %s at %s\\n\\nPOSITIVE ZF OBLIGATION (P-META-005 + B_POSITIVE_VALUE_EXTRACTION):\\nEvery substantive session must extract ג‰¥1 of these positive ZF outputs:\\n  A) New drift-log entry (continuous-drift-log.md) ג€” new pattern observed\\n  B) Reasoning-patterns.md promotion ג€” K=2 pattern reached\\n  C) Memory entry updated ג€” insight worth carrying forward\\n  D) CEC propagation ג€” new element enhanced existing surfaces\\n  E) VLT created ג€” blocking decision surfaced for Governor\\n\\nIF this turn had none: add explicit declaration:\\n  \\"Positive ZF: no new patterns this turn ג€” reason: [mechanical/routine/deferred]\\"\\n\\nWHY THIS MATTERS (not just a rule):\\nInsights that are not explicitly extracted are lost at session boundary.\\nThe plan-promise-abandonment pattern was invisible for 3 sessions because\\nno one extracted the pattern and named it. Naming it in the drift-log was\\nwhat made the structural fix (validate-open-plan-levels.mjs) possible.\\nEvery session that extracts ג‰¥1 insight compounds the platform. Sessions\\nthat extract 0 miss the positive ZF cycle entirely."
}' "$SESSION_ID" "$TIMESTAMP"

exit 0
