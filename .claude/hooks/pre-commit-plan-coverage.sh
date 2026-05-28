#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-commit-plan-coverage
# @csps-name pre-commit-plan-coverage
# @csps-description T2 PRE-COMMIT enforcement of plan-coverage rule.
#   Governor S024 Q2: new files in libs/ require a plan with covered_paths.
#   This is the T2 commit-time enforcement that was MISSING — its absence caused
#   plan-coverage-gate T1→advisory to drop the rule to T3-only (governance theater).
#   With this T2 in place, T1 (pre-tool-use-plan-coverage-gate.sh) can be advisory.
#
#   RULES:
#   - New files (git diff --cached -A) under libs/** → checked against active plans
#   - Active plan WITH covered_paths matching the file → PASS
#   - No active plan covers the file → BLOCK commit (exit 2)
#   - Edits to existing files → IGNORED (not new)
#   - New files outside libs/ → IGNORED (only libs/ requires plan coverage)
#
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_NO_IMPLEMENTATION_WITHOUT_PLAN P-META-019 P-OP-001

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Get newly added files in libs/**
NEW_LIBS_FILES=$(git diff --cached --name-status --diff-filter=A 2>/dev/null | awk '{print $2}' | grep '^libs/' || true)

[[ -z "$NEW_LIBS_FILES" ]] && exit 0

# Check each new libs/ file against active plans
node -e "
const fs = require('fs');
const {join, resolve} = require('path');
const ROOT = process.argv[1];
const newFiles = process.argv[2].split('\n').filter(Boolean);

if (newFiles.length === 0) process.exit(0);

// Load all plans from topic-plans/ and unified-plan.yaml
const PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');
const planContents = [];

try {
  const files = fs.readdirSync(PLANS_DIR).filter(f => f.endsWith('.yaml') || f.endsWith('.md'));
  for (const f of files) {
    try { planContents.push(fs.readFileSync(join(PLANS_DIR, f), 'utf8')); } catch(e) {}
  }
} catch(e) { /* dir may not exist */ }

try {
  planContents.push(fs.readFileSync(join(ROOT, 'tools/config/unified-plan.yaml'), 'utf8'));
} catch(e) {}

// Extract active plans with covered_paths
const activePlanPaths = [];
for (const content of planContents) {
  // Must have lifecycle_state: active (or status: active)
  const isActive = /lifecycle_state:\s*(active|ratified)/i.test(content) ||
    /status:\s*(active|ratified)/i.test(content);
  if (!isActive) continue;

  // Extract covered_paths
  const m = content.match(/covered_paths:\s*\[([^\]]*)\]/);
  if (m) {
    const paths = m[1].split(',')
      .map(p => p.trim().replace(/[\"'\s]/g, ''))
      .filter(Boolean);
    activePlanPaths.push(...paths);
  }
  // Multi-line covered_paths: - path format
  const lines = content.split('\n');
  let inCoveredPaths = false;
  for (const line of lines) {
    if (/^\s*covered_paths:/.test(line)) { inCoveredPaths = true; continue; }
    if (inCoveredPaths) {
      const pathMatch = line.match(/^\s*-\s+(.+)/);
      if (pathMatch) activePlanPaths.push(pathMatch[1].trim().replace(/[\"']/g, ''));
      else if (/^\S/.test(line)) inCoveredPaths = false;
    }
  }
}

// Check each new file
const uncovered = [];
for (const newFile of newFiles) {
  const covered = activePlanPaths.some(covPath => {
    const normalized = covPath.endsWith('/') ? covPath : covPath + '/';
    return newFile.startsWith(normalized) || newFile.startsWith(covPath);
  });
  if (!covered) uncovered.push(newFile);
}

if (uncovered.length > 0) {
  process.stderr.write('[pre-commit-plan-coverage] BLOCKING: New libs/ file(s) without plan coverage:\n');
  for (const f of uncovered) {
    process.stderr.write('  ' + f + '\n');
  }
  process.stderr.write('\nFix: add covered_paths for this file to an active plan in docs/plan/_handoff/VAULT/topic-plans/\n');
  process.stderr.write('Or update a plan with lifecycle_state: active to include this path.\n');
  process.stderr.write('Active plan paths found: ' + (activePlanPaths.length > 0 ? activePlanPaths.join(', ') : 'none') + '\n');
  process.exit(2);
} else {
  process.exit(0);
}
" "$REPO_ROOT" "$NEW_LIBS_FILES"
