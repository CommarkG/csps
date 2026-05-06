#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-pnpm-verify
# @csps-name post-stop-pnpm-verify
# @csps-description Stop hook — runs pnpm verify after every AI response. Tracks
#   cumulative iteration count in tools/zf-session-tracker.json. EVERY ZF report
#   includes iteration number — mechanically enforced. If verify fails: blocks.
#   If open items > 0: injects iteration count + ZF reasoning.
#   Per P-META-006 (RZF) + P-META-008 + P-META-020 + P-META-021 (Triad — the iteration
#   count is MEASUREMENT of work richness; hiding it = nominal ZF).
# @csps-version 1.1.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces P-META-006 P-META-008 P-META-020 P-META-021 B_PRE_CLOSE_VERIFICATION B_RZF

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
readonly TRACKER="${REPO_ROOT}/tools/zf-session-tracker.json"

# ─── Update iteration tracker ──────────────────────────────────────────────
ITER_COUNT=0
ITER_COUNT=$(node -e "
const path=require('path'),fs=require('fs');
const f=path.join(process.cwd(),'tools/zf-session-tracker.json');
try {
  const d=JSON.parse(fs.readFileSync(f,'utf8'));
  const n=(d.verify_runs||0)+1;
  d.verify_runs=n;
  d.last_run_at=new Date().toISOString();
  fs.writeFileSync(f,JSON.stringify(d,null,2));
  process.stdout.write(String(n));
} catch(e){process.stdout.write('?');}
" 2>/dev/null || echo "?")

# ─── Run pnpm verify ───────────────────────────────────────────────────────
VERIFY_EXIT=0
VERIFY_OUTPUT=$(node "${REPO_ROOT}/tools/verify.mjs" --skip-install 2>&1) || VERIFY_EXIT=$?

PASS_COUNT=$(echo "$VERIFY_OUTPUT" | grep -c '"status": "PASS"' || echo "0")
FAIL_COUNT=$(echo "$VERIFY_OUTPUT" | grep -c '"status": "FAIL"' || echo "0")

# Update tracker with exit code
node -e "
const path=require('path'),fs=require('fs');
const f=path.join(process.cwd(),'tools/zf-session-tracker.json');
try{
  const d=JSON.parse(fs.readFileSync(f,'utf8'));
  d.last_exit_code=${VERIFY_EXIT};
  if(${FAIL_COUNT}>0) d.blocking_found_total=(d.blocking_found_total||0)+${FAIL_COUNT};
  fs.writeFileSync(f,JSON.stringify(d,null,2));
}catch(e){}
" 2>/dev/null || true

# ─── Output with MANDATORY iteration count ─────────────────────────────────

if [ "$VERIFY_EXIT" -ne 0 ] || [ "$FAIL_COUNT" -gt 0 ]; then
  FAILURES=$(echo "$VERIFY_OUTPUT" | grep -A2 '"status": "FAIL"' | grep '"name"' | sed 's/.*"name": "\([^"]*\)".*/\1/' | tr '\n' ', ' || echo "unknown")

  printf '{
    "systemMessage": "[ZF-iter-%s] VERIFY FAILED — exit_code=%s | failing: %s\\n\\nIteration %s this session. Per P-META-006 RZF: no DONE claim valid without exit_code 0.\\nFix before proceeding. Iteration count is MEASUREMENT — this run found blockers.",
    "continue": false,
    "stopReason": "pnpm verify failed (iter %s). Fix: %s"
  }' "$ITER_COUNT" "$VERIFY_EXIT" "$FAILURES" "$ITER_COUNT" "$ITER_COUNT" "$FAILURES"
  exit 1
fi

# Check open-plan-levels
OPEN_ITEMS=0
OPEN_OUTPUT=$(node "${REPO_ROOT}/tools/validators/validate-open-plan-levels.mjs" 2>&1) || true
OPEN_ITEMS=$(echo "$OPEN_OUTPUT" | grep -o "total_open_items=[0-9]*" | cut -d= -f2 || echo "0")

# Check PENDING VLTs
VLT_PENDING=0
VLT_OUTPUT=$(node "${REPO_ROOT}/tools/validators/validate-vlt-blocking.mjs" 2>&1) || true
VLT_PENDING=$(echo "$VLT_OUTPUT" | grep -o "pending=[0-9]*" | cut -d= -f2 || echo "0")

if [ "$OPEN_ITEMS" -gt 0 ] || [ "$VLT_PENDING" -gt 0 ]; then
  printf '{
    "systemMessage": "[ZF-iter-%s] PASS (exit_code 0, %s validators) | %s open items | %s PENDING VLTs\\n\\nIteration %s this session. Advisory items tracked.\\nNominal ZF = passing via workaround/bypass = false confidence at build time.\\nReal ZF = all items either resolved or explicitly deferred with documented reason.\\nCycle cost: minutes. Skipped finding cost: sessions. (P-META-021)"
  }' "$ITER_COUNT" "$PASS_COUNT" "$OPEN_ITEMS" "$VLT_PENDING" "$ITER_COUNT"
else
  printf '{
    "systemMessage": "[ZF-iter-%s] PASS ✅ (exit_code 0, %s validators) | 0 open items | 0 PENDING VLTs\\nReal ZF at iteration %s. Cycle count is MEASUREMENT of work richness."
  }' "$ITER_COUNT" "$PASS_COUNT" "$ITER_COUNT"
fi

exit 0
