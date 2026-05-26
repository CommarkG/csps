#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-bstar-trio-gate
# @csps-name pre-tool-use-bstar-trio-gate
# @csps-description PreToolUse hook — META-T1 gate for B_*.md behavioral contracts.
#   Fires on Edit/Write to docs/plan/pillar-0-governance/behavioral-contracts/B_*.md.
#   Validates enforcement_trio frontmatter structure (4 blocking rules + 1 advisory).
#   Node-based for cross-platform (Win/Mac/Linux) compatibility.
#   PROTO-S062-A STEP 4 — "bleed stopped": future contracts cannot bypass enforcement_trio.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE PROTO-S062-A

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly GATE_SCRIPT="${REPO_ROOT}/tools/scripts/bstar-trio-gate.mjs"

# Pass stdin directly to the Node gate module
node "${GATE_SCRIPT}" "$@"
