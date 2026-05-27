#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-external-integration-gate
# @csps-name pre-tool-use-external-integration-gate
# @csps-description C5 RE_DERIVATION_KNOWN prevention — the M-19 phantom hook MADE REAL.
#   Fires on Edit/Write to external-integration-related files (Vercel, Supabase, Clerk,
#   Stripe, PlanetScale, Neon, Upstash, Resend, API key files).
#   ADVISORY S067: emits warning if canonical external-integrations doc has not been
#   read this session before modifying integration config/docs.
#
#   WHAT THIS PREVENTS: Re-deriving integration decisions (Vercel root dir, Supabase
#   pgbouncer flag, Clerk JWT template) that were already discovered and documented,
#   wasting tokens and potentially drifting from the ratified approach.
#
#   The M-19 phantom hook: pre-tool-use-external-integration-gate was listed as a
#   planned moat mechanism for 57+ sessions without being built. S067 STEP 6.3b
#   MAKES IT REAL. C5 = RE_DERIVATION_KNOWN permanent swap.
#
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces C5_RE_DERIVATION_KNOWN P-META-029 B_HUMBLE_CONSOLIDATION_DISCIPLINE

set -euo pipefail

# Parse tool input from stdin
TOOL_INPUT=$(cat)
TOOL_NAME=$(echo "$TOOL_INPUT" | node -e "
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  try {
    const d = JSON.parse(chunks.join(''));
    process.stdout.write(d.tool_name || d.name || '');
  } catch { process.stdout.write(''); }
});" 2>/dev/null <<< "$TOOL_INPUT" || echo "")

FILE_PATH=$(echo "$TOOL_INPUT" | node -e "
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  try {
    const d = JSON.parse(chunks.join(''));
    const p = d.tool_input?.file_path || d.file_path || '';
    process.stdout.write(p);
  } catch { process.stdout.write(''); }
});" 2>/dev/null <<< "$TOOL_INPUT" || echo "")

# Only fire on Edit or Write tools
if [ "$TOOL_NAME" != "Edit" ] && [ "$TOOL_NAME" != "Write" ]; then
  exit 0
fi

# Normalize path to forward slashes
FILE_PATH_NORM="${FILE_PATH//\\//}"

# Check if file touches external integration territory
INTEGRATION_PATTERNS=(
  "external-integrations"
  "vercel"
  "supabase"
  "clerk"
  "stripe"
  "planetscale"
  "upstash"
  "resend"
  "neon"
  ".env"
  "wrangler"
  "fly.toml"
  "railway"
)

IS_INTEGRATION=false
for pattern in "${INTEGRATION_PATTERNS[@]}"; do
  if echo "$FILE_PATH_NORM" | grep -qi "$pattern"; then
    IS_INTEGRATION=true
    break
  fi
done

[ "$IS_INTEGRATION" = false ] && exit 0

# ADVISORY: emit warning
CANONICAL_DOCS="docs/plan/pillar-0-governance/external-integrations/"
echo "[C5-external-integration-gate] ADVISORY: Editing integration file: $(basename "$FILE_PATH")" >&2
echo "[C5-external-integration-gate] Before modifying integration config, read canonical doc at: ${CANONICAL_DOCS}" >&2
echo "[C5-external-integration-gate] Key docs: vercel.md (10 rules) / supabase.md / clerk.md / resend.md" >&2
echo "[C5-external-integration-gate] Prevents C5 RE_DERIVATION_KNOWN — re-deriving known integration decisions." >&2
echo "[C5-external-integration-gate] ADVISORY S067 — proceeding (BLOCKING from S068 after behavioral validation)" >&2

# ADVISORY: always exit 0 in S067
exit 0
