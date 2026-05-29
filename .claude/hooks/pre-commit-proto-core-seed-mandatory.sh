#!/usr/bin/env bash
# Hook: pre-commit-proto-core-seed-mandatory.sh
# Fires: pre-commit (git commit)
# Reads: git diff --cached --name-only --diff-filter=A (ADDED files only, S066 phase)
# Filters: new PROTO-*.md files in docs/plan/protos/
# Validates: required frontmatter fields + required body sections
# Exits: 1 BLOCKING if any new PROTO is missing required content; 0 otherwise
#
# BLOCKING from S066 (Q4 full mechanical enforcement — no advisory phase)
# Phased: S066 = added files only (--diff-filter=A); S067 = retroactive backfill of 4 existing PROTOs;
#         S068 = flip to --diff-filter=AM (full coverage including modified)
#
# Reference exemplar: THIS PROTO (docs/plan/protos/PROTO-S066-WAVE-1.md) must self-pass.
#
# @csps-id csps.claude.hooks.pre-commit-proto-core-seed-mandatory
# @csps-name pre-commit-proto-core-seed-mandatory
# @csps-description PreCommit git hook — BLOCKING gate for new PROTO-*.md files.
#   Requires: plan_item_id + core_seed_present: true + gate_tier in frontmatter,
#   AND ## Core Seed + ## DONE WHEN + ## ZF gate sections in body.
#   S066: new PROTOs only (--diff-filter=A). Closes Q4 (PROTO core-seed drift).
#   Reference: docs/plan/protos/PROTO-S066-WAVE-1.md as canonical exemplar.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE P-META-007
# inherits_from: PROTO-S066-WAVE-1 Core Seed pattern
# wave: WAVE-1-STEP-2

set -euo pipefail

readonly REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"
PATTERN='^docs/plan/protos/PROTO-.*\.md$'

# Gather newly-added PROTO-*.md files (S066 phase: added only)
files_to_check=$(git diff --cached --name-only --diff-filter=A 2>/dev/null | grep -E "$PATTERN" || true)

if [ -z "$files_to_check" ]; then
  exit 0  # No new PROTO files in this commit
fi

FOUND_VIOLATIONS=false

for file in $files_to_check; do
  filepath="${REPO_ROOT}/${file}"
  if [ ! -f "$filepath" ]; then
    continue
  fi

  violations=()

  # ── Check frontmatter fields ─────────────────────────────────────────────
  if ! grep -q '^plan_item_id:' "$filepath" 2>/dev/null; then
    violations+=("missing frontmatter: plan_item_id")
  fi
  if ! grep -q '^core_seed_present: true' "$filepath" 2>/dev/null; then
    violations+=("missing frontmatter: core_seed_present: true")
  fi
  if ! grep -E '^gate_tier: (auto-execute|check-in|full-advance)' "$filepath" > /dev/null 2>&1; then
    violations+=("missing frontmatter: gate_tier (must be auto-execute|check-in|full-advance)")
  fi

  # ── Check body sections (F-NEW-5: explicit grep syntax) ──────────────────
  if ! grep -Eqi '^## *core seed' "$filepath" 2>/dev/null; then
    violations+=("missing body section: ## Core Seed")
  fi
  if ! grep -Eqi '^## .*(done when)' "$filepath" 2>/dev/null; then
    violations+=("missing body section: ## DONE WHEN (or ## ... DONE WHEN header)")
  fi
  if ! grep -Eqi '^## *zf( gate)?' "$filepath" 2>/dev/null; then
    violations+=("missing body section: ## ZF gate (or ## ZF)")
  fi

  if [ ${#violations[@]} -gt 0 ]; then
    FOUND_VIOLATIONS=true
    echo "[proto-core-seed] BLOCKING: ${file} missing required content:" >&2
    for v in "${violations[@]}"; do
      echo "  - ${v}" >&2
    done
    echo "  Required frontmatter: plan_item_id + core_seed_present: true + gate_tier" >&2
    echo "  Required sections: ## Core Seed + ## DONE WHEN + ## ZF gate" >&2
    echo "  Fix: see docs/plan/protos/PROTO-S066-WAVE-1.md as canonical exemplar (self-dogfooded)." >&2
  fi
done

if [ "$FOUND_VIOLATIONS" = "true" ]; then
  exit 1
fi


# M0.5 S071 — Advisory proto completeness check (SACRED-EDIT-APPROVED: M0.5 hook extension)
# One hook, two checks (consolidation — no parallel hook per OPUS-14 directive).
# validate-proto-completeness.mjs is ADVISORY in S071 — always exits 0, never blocks.
if node tools/validators/validate-proto-completeness.mjs 2>/dev/null; then
  : # advisory only
fi

exit 0
