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

# P4 CONTEXTUAL BLOCKING (S075 B3-lean): ADVISORY→BLOCKING for registry writes
# BLOCKING: writing to external-integration-registry.yaml or deploy-targets.yaml
# without including a verified_at or deprecation_reason update
# This catches "I updated the config but forgot to mark it verified" pattern.
# ADVISORY: all other integration file edits (still ADVISORY per S067 spec)

REGISTRY_PATTERN="external-integration-registry.yaml|deploy-targets.yaml"
if echo "$FILE_PATH_NORM" | grep -qiE "external-integration-registry.yaml|deploy-targets.yaml"; then
  # Check if content contains verified_at or deprecation update (P4 gate)
  CONTENT=$(echo "$TOOL_INPUT" | node -e "
  let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
    try{const j=JSON.parse(d);const i=j.tool_input||{};process.stdout.write(i.content||i.new_string||'');}
    catch{process.stdout.write('');}
  });" 2>/dev/null || echo "")
  
  if echo "$CONTENT" | grep -qiE "verified_at|deprecation_reason|deprecated"; then
    # Has attestation — pass through
    echo "[P4-BLOCKING] Integration registry write: verified_at or deprecation_reason present — OK." >&2
    exit 0
  else
    # Missing attestation on registry write
    printf '{
      "systemMessage": "[P4-BLOCKING] Integration registry write without verified_at or deprecation_reason.

When updating external-integration-registry.yaml or deploy-targets.yaml:
- For config changes: include verified_at: <session> (re-verify the integration works)
- For deprecations: include deprecation_reason: <why removed>

Registration-staleness-without-verification is the EXTERNAL-INTEGRATION-REGISTRATION-STALENESS prevention class.",
      "continue": false,
      "stopReason": "integration-registry write without attestation"
    }'
    exit 1
  fi
fi

# Non-integration files: nothing to do.
# (BUGFIX S089: prior version had an unconditional `exit 0` here that made the
#  IS_INTEGRATION advisory below dead code — it never fired. Now reachable.)
[ "$IS_INTEGRATION" = false ] && exit 0

# Integration files — surface the canonical doc + CONCLUSIONS to present BEFORE
# re-running a known process (S089 Governor directive: "present the conclusions
# each time we're about to do the same process").
CANONICAL_DOCS="docs/plan/pillar-0-governance/external-integrations/"
echo "[C5-external-integration-gate] ADVISORY: integration file: $(basename "$FILE_PATH")" >&2
echo "[C5-external-integration-gate] Read canonical doc FIRST: ${CANONICAL_DOCS} (vercel.md / supabase.md / clerk.md)" >&2
echo "[C5-external-integration-gate] Prevents C5 RE_DERIVATION_KNOWN — re-deriving known integration decisions." >&2

# Credential / DB-URL context → PRESENT the Credential Rotation Runbook conclusions
# (supabase.md → Credential Rotation Runbook; source PARK-S084-009, S089).
if echo "$FILE_PATH_NORM" | grep -qiE "\.env|supabase|database_url|direct_url"; then
  echo "[C5] >>> CREDENTIAL ROTATION — CONCLUSIONS (supabase.md → Credential Rotation Runbook):" >&2
  echo "[C5]   1. Vercel value is BARE — no quotes, no KEY= prefix (else Prisma: 'must start with postgresql://')." >&2
  echo "[C5]   2. Real password between : and @ — never the literal word PASSWORD; use an AUTO-GENERATED (URL-safe) one." >&2
  echo "[C5]   3. Env change needs a REDEPLOY; verify /api/db-health = {status:ok}, NOT the 'Ready' badge alone." >&2
  echo "[C5]   4. One live Vercel project (delete dead duplicates). NEVER paste a live secret into chat/transcript." >&2
  echo "[C5]   5. db-health 503: read the BODY — '~20ms+postgresql://'=format, '~1.5s+credentials'=password, 'P2021'=schema." >&2
fi

exit 0

