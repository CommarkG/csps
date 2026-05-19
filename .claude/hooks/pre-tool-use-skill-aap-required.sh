#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-skill-aap-required
# @csps-name pre-tool-use-skill-aap-required
# @csps-description PreToolUse hook — ADVISORY. Fires before Write/Edit on **/SKILL.md files.
#   Checks for required AAP frontmatter fields: csps_aligned + aap_version + agent_class +
#   acknowledged_contracts + respects_quality_gates + output_contract + trust_tier.
#   ADVISORY mode (exits 0) — first step out of 36-session STUB stagnation.
#   Per S044 PROTO-034 Step 5. Promotes to BLOCKING after backfill pass on existing SKILL.md files.
# @csps-version 1.0.0-advisory
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:developer
# @csps-enforces P-META-010 B_AGENT_ALIGNMENT_PROTOCOL

set -euo pipefail

TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"

# Extract file path from Claude Code hook JSON input
FILE_PATH=$(echo "$TOOL_INPUT" | node -e "
try {
  let d = '';
  process.stdin.on('data', c => d += c);
  process.stdin.on('end', () => {
    try {
      const j = JSON.parse(d);
      console.log(j.file_path || j.path || '');
    } catch { console.log(''); }
  });
} catch { console.log(''); }
" 2>/dev/null || echo "")

# Only fire on SKILL.md files
if [[ -z "$FILE_PATH" ]]; then exit 0; fi
if [[ "$FILE_PATH" != *"SKILL.md" ]]; then exit 0; fi

# Only check if file exists (Write of existing) or if we have content to check
if [[ ! -f "$FILE_PATH" ]]; then
  echo "[skill-aap-required] ADVISORY: New SKILL.md at $FILE_PATH"
  echo "[skill-aap-required] Ensure these AAP fields are present: csps_aligned, aap_version, agent_class, acknowledged_contracts, respects_quality_gates, output_contract, trust_tier"
  exit 0
fi

# Check existing file for AAP required fields
MISSING=""
AAP_FIELDS=("csps_aligned" "aap_version" "agent_class" "acknowledged_contracts" "respects_quality_gates" "output_contract" "trust_tier")
for field in "${AAP_FIELDS[@]}"; do
  if ! grep -q "$field" "$FILE_PATH" 2>/dev/null; then
    MISSING="$MISSING $field"
  fi
done

if [[ -n "$MISSING" ]]; then
  echo ""
  echo "⚠ [skill-aap-required] ADVISORY: SKILL.md missing AAP frontmatter fields: $MISSING"
  echo "  File: $FILE_PATH"
  echo "  Required by B_AGENT_ALIGNMENT_PROTOCOL — skills without AAP are wildcards."
  echo "  Add to SKILL.md frontmatter: $MISSING"
  echo "  Reference: tools/templates/skill.template.md"
  echo "  (ADVISORY — proceeding. Week-4 promotes to BLOCKING after backfill.)"
  echo ""
fi

exit 0
