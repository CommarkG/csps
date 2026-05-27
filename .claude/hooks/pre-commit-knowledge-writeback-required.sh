#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-commit-knowledge-writeback-required
# @csps-name pre-commit-knowledge-writeback-required
# @csps-description C9 PATCH_WITHOUT_KNOWLEDGE_UPDATE prevention.
#   Pre-commit hook: when staging changes to integration fix files (vercel.md R9 style),
#   verifies that the canonical knowledge doc was also updated in the same commit.
#   ADVISORY S067: warns if integration fix staged without knowledge doc.
#   BLOCKING S068: BLOCKS commit if integration fix has no corresponding knowledge update.
#
#   WHAT THIS PREVENTS: Integration fixes that live in git but don't update the canonical
#   knowledge file. The fix is discovered in the next session because the knowledge doc
#   still says the old (wrong) approach. C9 = PATCH_WITHOUT_KNOWLEDGE_UPDATE.
#
#   Example: Vercel budget-planner transpilePackages fix landed in commit da23887 BUT
#   vercel.md R9 was only amended in STEP 7 (commit 80777fbc). The gap between patch
#   (da23887) and knowledge update (80777fbc) = C9 window.
#
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces C9_PATCH_WITHOUT_KNOWLEDGE_UPDATE P-META-029 B_HUMBLE_CONSOLIDATION_DISCIPLINE

set -euo pipefail

# Get staged files
STAGED_FILES=$(git diff --cached --name-only 2>/dev/null || echo "")

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

# Define integration fix patterns (code/config changes that might fix an integration issue)
INTEGRATION_FIX_PATTERNS=(
  "apps/"
  "packages/"
  "libs/"
  "next.config"
  "vercel.json"
  ".env.example"
  "wrangler.toml"
  "prisma/"
  "supabase/"
)

# Define knowledge doc paths (canonical documentation that should be updated alongside fixes)
KNOWLEDGE_DOC_PATTERNS=(
  "docs/plan/pillar-0-governance/external-integrations/"
  "docs/plan/pillar-0-governance/external-integrations/"
  "memory/"
  "docs/plan/"
)

HAS_INTEGRATION_FIX=false
HAS_KNOWLEDGE_UPDATE=false

while IFS= read -r file; do
  for pattern in "${INTEGRATION_FIX_PATTERNS[@]}"; do
    if echo "$file" | grep -q "^${pattern}"; then
      HAS_INTEGRATION_FIX=true
      break
    fi
  done

  for pattern in "${KNOWLEDGE_DOC_PATTERNS[@]}"; do
    if echo "$file" | grep -q "^${pattern}"; then
      HAS_KNOWLEDGE_UPDATE=true
      break
    fi
  done
done <<< "$STAGED_FILES"

# If integration fix but no knowledge update — ADVISORY S067
if [ "$HAS_INTEGRATION_FIX" = true ] && [ "$HAS_KNOWLEDGE_UPDATE" = false ]; then
  echo "[C9-knowledge-writeback] ADVISORY: Staging integration fix without knowledge doc update" >&2
  echo "[C9-knowledge-writeback] Staged files include: $(echo "$STAGED_FILES" | head -3 | tr '\n' ' ')" >&2
  echo "[C9-knowledge-writeback] Consider: update docs/plan/pillar-0-governance/external-integrations/" >&2
  echo "[C9-knowledge-writeback] or add a memory entry to capture the fix pattern." >&2
  echo "[C9-knowledge-writeback] C9 PATCH_WITHOUT_KNOWLEDGE_UPDATE — ADVISORY S067 / BLOCKING S068" >&2
  # ADVISORY: exit 0 in S067
  exit 0
fi

exit 0
