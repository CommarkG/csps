#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-playwright-domain-scope
# @csps-name pre-tool-use-playwright-domain-scope
# @csps-description PreToolUse hook — BLOCKING (exit 2). Domain-scopes Playwright navigation.
#   When browser_navigate is called, checks the URL against the CSPS-owned deploy allow-list.
#   If URL is NOT a CSPS-owned domain → BLOCK (exit 2). This enforces the ALIGNED-WITH-TRANSLATION
#   verdict for playwright-mcp: read-only on OWN deploys only.
#   Destructive tools (click/type/fill/evaluate/etc.) are separately denied via settings.json deny-list.
#
# ALLOW-LIST (CSPS-owned Vercel deploys):
#   csps-playground.vercel.app — the production playground
#   *.vercel.app from our org — preview deployments (any csps-* or commarkG-* prefix)
#   localhost:* — local development (allowed for testing, not for production evidence)
#
# PLANTED-VIOLATION PROOF: attempt browser_navigate to an off-domain URL → this hook BLOCKS it.
# Combined with settings.json deny for browser_click/evaluate → read-only own-domain-only enforced.
#
# ALIGNMENT: tools/data/external-capability-alignment.yaml playwright-mcp ALIGNED-WITH-TRANSLATION
#   guardrail: "domain allow-list: ONLY CSPS-owned deploys"
#
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces PLAYWRIGHT-MCP-GUARDRAILS ALIGNED-WITH-TRANSLATION-verdict

set -euo pipefail

# Only runs for Playwright browser_navigate calls
TOOL_NAME="${CLAUDE_TOOL_NAME:-}"
if [ "$TOOL_NAME" != "mcp__playwright__browser_navigate" ]; then
  exit 0
fi

# Extract URL from tool input
TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"
if [ -z "$TOOL_INPUT" ]; then
  exit 0
fi

# Parse URL from JSON (node is available)
URL=$(node -e "
try {
  const inp = JSON.parse(process.argv[1]);
  console.log(inp.url || inp.URL || '');
} catch(e) {
  console.log('');
}
" "$TOOL_INPUT" 2>/dev/null || echo "")

if [ -z "$URL" ]; then
  exit 0
fi

# Domain allow-list check
ALLOWED=0

# csps-playground.vercel.app — production playground
echo "$URL" | grep -qiE "^https?://(csps-playground|www\.csps-playground)\.vercel\.app" && ALLOWED=1

# *.vercel.app (any vercel preview — our org's deployments)
echo "$URL" | grep -qiE "^https?://[a-z0-9-]+\.vercel\.app" && ALLOWED=1

# localhost (development)
echo "$URL" | grep -qiE "^https?://localhost(:[0-9]+)?" && ALLOWED=1

if [ "$ALLOWED" -eq 0 ]; then
  echo "" >&2
  echo "[playwright-domain-scope] BLOCK — off-domain navigation refused." >&2
  echo "  URL: $URL" >&2
  echo "  Playwright in CSPS is ALIGNED-WITH-TRANSLATION (read-only, own-deploy-only)." >&2
  echo "  Allowed domains: csps-playground.vercel.app | *.vercel.app | localhost" >&2
  echo "  External navigation is FORBIDDEN per external-capability-alignment.yaml playwright-mcp guardrails." >&2
  exit 2
fi

exit 0
