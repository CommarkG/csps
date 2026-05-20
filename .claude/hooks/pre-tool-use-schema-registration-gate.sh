#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-schema-registration-gate
# @csps-name pre-tool-use-schema-registration-gate
# @csps-description PreToolUse creation gate — AP-003 T1.
#   When creating a new file, detects the artifact type from its path pattern.
#   Reads tools/config/artifact-schema-registry.yaml for that type's required schemas.
#   Emits the full registration checklist so ALL schemas get registered at creation time.
#   BLOCKING (exit 2) for platform_page (K=2 failures documented).
#   ADVISORY (exit 0) for all other artifact types.
#   Training default: "create the file, register in schemas later (or forget)."
#   CSPS override: registering in ALL schemas at creation time IS the completion.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces AP-003 artifact-schema-registry

set -euo pipefail

TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"
FILE_PATH=$(echo "$TOOL_INPUT" | node -e "
try {
  let d = '';
  process.stdin.on('data', c => d += c);
  process.stdin.on('end', () => {
    try { console.log(JSON.parse(d).file_path || ''); } catch { console.log(''); }
  });
} catch { console.log(''); }
" 2>/dev/null || echo "")

if [ -z "$FILE_PATH" ]; then exit 0; fi

NORMALIZED=$(echo "$FILE_PATH" | tr '\\' '/')
FILE_EXISTS=$(test -f "$FILE_PATH" && echo "true" || echo "false")
if [ "$FILE_EXISTS" = "true" ]; then exit 0; fi  # only fires for NEW files

# Detect artifact type from path pattern
ARTIFACT_TYPE=""
if echo "$NORMALIZED" | grep -qE "apps/csps-playground/platform/[^/]+/index\.html$"; then
  ARTIFACT_TYPE="platform_page"
elif echo "$NORMALIZED" | grep -qE "tools/validators/validate-.*\.mjs$"; then
  ARTIFACT_TYPE="validator"
elif echo "$NORMALIZED" | grep -qE "\.claude/hooks/.*\.sh$"; then
  ARTIFACT_TYPE="hook"
elif echo "$NORMALIZED" | grep -qE "\.claude/skills/.*/SKILL\.md$"; then
  ARTIFACT_TYPE="skill"
elif echo "$NORMALIZED" | grep -qE "docs/plan/pillar-0-governance/behavioral-contracts/B_.*\.md$"; then
  ARTIFACT_TYPE="behavioral_contract"
fi

if [ -z "$ARTIFACT_TYPE" ]; then exit 0; fi

# Read registration requirements from artifact-schema-registry.yaml
REGISTRY="tools/config/artifact-schema-registry.yaml"
if [ ! -f "$REGISTRY" ]; then exit 0; fi

if ! command -v node >/dev/null 2>&1; then exit 0; fi

IS_BLOCKING=$(node -e "
try {
  const yaml = require('js-yaml');
  const fs = require('fs');
  const docs = yaml.loadAll(fs.readFileSync('$REGISTRY', 'utf-8'));
  const reg = docs[docs.length - 1] || {};
  const type = reg.artifact_types?.['$ARTIFACT_TYPE'];
  if (!type) { process.stdout.write('SKIP'); process.exit(0); }
  process.stdout.write(type.t1_enforcement === 'BLOCKING' ? 'BLOCKING' : 'ADVISORY');
} catch(e) { process.stdout.write('SKIP'); }
" 2>/dev/null || echo "SKIP")

SCHEMAS_TEXT=$(node -e "
try {
  const yaml = require('js-yaml');
  const fs = require('fs');
  const docs = yaml.loadAll(fs.readFileSync('$REGISTRY', 'utf-8'));
  const reg = docs[docs.length - 1] || {};
  const type = reg.artifact_types?.['$ARTIFACT_TYPE'];
  if (!type) { process.exit(0); }
  (type.schemas || []).forEach(s => {
    const req = s.blocking ? '[REQUIRED]' : '[recommended]';
    console.log('  - ' + s.action);
    console.log('    File: ' + s.file + ' ' + req);
  });
} catch(e) { /* skip */ }
" 2>/dev/null || true)

if [ "$IS_BLOCKING" = "SKIP" ]; then exit 0; fi

echo ""
echo "[schema-registration-gate] Creating artifact type: $ARTIFACT_TYPE"
echo "[schema-registration-gate] SCHEMA REGISTRATION CHECKLIST (AP-003):"
echo "$SCHEMAS_TEXT"
echo "[schema-registration-gate] Register in ALL schemas above before this artifact is considered complete."
echo "[schema-registration-gate] Ref: tools/config/artifact-schema-registry.yaml | AP-003"
echo ""

if [ "$IS_BLOCKING" = "BLOCKING" ]; then
  echo "⛔ [schema-registration-gate] BLOCKING: $ARTIFACT_TYPE requires all schemas registered before creating."
  echo "  Reason: K=2 failures documented for this type. Complete checklist, then create the file."
  exit 2
fi

exit 0
