#!/usr/bin/env bash
# @csps-id csps.claude.hooks.cron-weekly-tag-status-deep-audit
# @csps-name cron-weekly-tag-status-deep-audit
# @csps-description Weekly system health audit — fires every 7 days (CronCreate Monday 08:03).
#   PARTIAL-ACTIVE (S011 §24+++++): runs know-how extractor + slice freshness + hook staleness + tag status.
#   Originally STUB (S008 turn 8). Promoted to partial-active S011 §24+++++ after B_KNOW_HOW_DISCIPLINE engraving.
#   Full active (week-4): adds tag-status state-machine validation + SLA compliance.
# @csps-version 0.2.0-partial
# @csps-owner group:finky
# @csps-lifecycle experimental
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:developer
# @csps-enforces P-META-019 B_STRUCTURAL_PREVENTION_DISCIPLINE B_KNOW_HOW_DISCIPLINE B_INTAKE_DISCIPLINE

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
readonly WEEK_NUM="$(date -u +"%V" 2>/dev/null || echo "unknown")"
readonly REPORT_FILE="${REPO_ROOT}/docs/plan/_handoff/VAULT/tag-status-deep-audit-W${WEEK_NUM}.md"

echo "[weekly-health] ═══ CSPS Weekly System Health Audit ═══"
echo "[weekly-health] week=${WEEK_NUM} timestamp=${TIMESTAMP}"
echo ""

FINDINGS=0
WARNINGS=()

# ── 1. Know-how extraction (learning loop) ──────────────────────────────────
echo "[weekly-health] §1 Know-How Extraction (learning loop)"
if [ -f "${REPO_ROOT}/tools/know-how-extractor.mjs" ]; then
  node "${REPO_ROOT}/tools/know-how-extractor.mjs" 2>&1 | head -20 || true
else
  echo "  ⚠ know-how-extractor.mjs not found"
  FINDINGS=$((FINDINGS + 1))
fi
echo ""

# ── 2. Slice freshness check ────────────────────────────────────────────────
echo "[weekly-health] §2 Slice Freshness Check"
if node "${REPO_ROOT}/tools/validators/validate-slice-freshness.mjs" 2>&1; then
  echo "  ✓ All slices fresh"
else
  WARNINGS+=("Stale slices detected — run split generators")
  FINDINGS=$((FINDINGS + 1))
fi
echo ""

# ── 3. Hook staleness audit ─────────────────────────────────────────────────
echo "[weekly-health] §3 Hook Staleness Audit"
HOOKS_DIR="${REPO_ROOT}/.claude/hooks"
STUB_COUNT=0
ACTIVE_COUNT=0
for hook in "${HOOKS_DIR}"/*.sh; do
  hookname=$(basename "${hook}")
  if grep -q "STUB\|stub" "${hook}" 2>/dev/null; then
    STUB_COUNT=$((STUB_COUNT + 1))
  else
    ACTIVE_COUNT=$((ACTIVE_COUNT + 1))
  fi
done
echo "  hooks total=$((STUB_COUNT + ACTIVE_COUNT)) active=${ACTIVE_COUNT} stub=${STUB_COUNT}"
if [ "${STUB_COUNT}" -gt 10 ]; then
  WARNINGS+=("${STUB_COUNT} hooks still STUB — week-4 promotion overdue")
  FINDINGS=$((FINDINGS + 1))
fi
echo ""

# ── 4. Topic-plan orphan check ──────────────────────────────────────────────
echo "[weekly-health] §4 Topic-Plan Orphan Check"
if node "${REPO_ROOT}/tools/validators/validate-topic-plan-progress.mjs" 2>&1; then
  echo "  ✓ No orphaned plans"
else
  WARNINGS+=("Orphaned topic-plans detected")
  FINDINGS=$((FINDINGS + 1))
fi
echo ""

# ── 5. Session artifact sync ─────────────────────────────────────────────────
echo "[weekly-health] §5 Session Artifact Sync"
if node "${REPO_ROOT}/tools/validators/validate-session-artifact-sync.mjs" 2>&1; then
  echo "  ✓ Session artifacts in sync"
else
  WARNINGS+=("Session artifacts out of sync")
  FINDINGS=$((FINDINGS + 1))
fi
echo ""

# ── 6. EP recurrence check (K=2 promotions) ─────────────────────────────────
echo "[weekly-health] §6 EP Recurrence Check (K=2 promotion candidates)"
EP_DIR="${REPO_ROOT}/docs/plan/_handoff/VAULT/know-how/error-patterns"
if [ -d "${EP_DIR}" ]; then
  K2_CANDIDATES=0
  for ep in "${EP_DIR}"/*.md; do
    count=$(grep -oP "recurrence_count: \K\d+" "${ep}" 2>/dev/null || echo "0")
    if [ "${count}" -ge 2 ]; then
      K2_CANDIDATES=$((K2_CANDIDATES + 1))
      ep_name=$(basename "${ep}")
      echo "  ⚠ K=2 promotion candidate: ${ep_name} (recurrence_count: ${count})"
    fi
  done
  if [ "${K2_CANDIDATES}" -eq 0 ]; then
    echo "  ✓ No K=2 candidates (all patterns recurrence_count < 2)"
  else
    WARNINGS+=("${K2_CANDIDATES} EP patterns at K=2 — mandatory B_* contract or principle amendment")
    FINDINGS=$((FINDINGS + 1))
  fi
else
  echo "  ℹ know-how/error-patterns/ not found"
fi
echo ""

# ── Summary ──────────────────────────────────────────────────────────────────
echo "[weekly-health] ═══ SUMMARY ═══"
echo "[weekly-health] findings=${FINDINGS}"
if [ "${#WARNINGS[@]}" -gt 0 ]; then
  echo "[weekly-health] warnings:"
  for w in "${WARNINGS[@]}"; do
    echo "  ⚠ ${w}"
  done
fi
echo "[weekly-health] next_run=Monday_08:03_local"
echo "[weekly-health] PARTIAL-ACTIVE (S011 §24+++++); week-4 promotes to full tag/status state-machine validation"

# ── AI Behavior Deep-Dive (S069 — non-urgent enhancement pipeline) ─────────────
echo ""
echo "[weekly-health] §AI-BEHAVIOR — Weekly AI behavior deep-dive (D-default compounding analysis)"
if node "${REPO_ROOT}/tools/scripts/weekly-ai-behavior-deep-dive.mjs" 2>/dev/null; then
  echo "[weekly-health] AI behavior deep-dive: complete — check VAULT/ai-enhancement-proposals/"
else
  echo "[weekly-health] AI behavior deep-dive: skipped (no signals or error)"
fi

# Write report stub
cat > "${REPORT_FILE}" << REPORT
# Weekly Health Audit — W${WEEK_NUM}

timestamp: ${TIMESTAMP}
findings: ${FINDINGS}
status: $([ "${FINDINGS}" -eq 0 ] && echo "CLEAN" || echo "FINDINGS_PRESENT")
REPORT

exit 0
