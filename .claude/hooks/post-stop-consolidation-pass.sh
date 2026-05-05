#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-consolidation-pass
# @csps-name post-stop-consolidation-pass
# @csps-description PostStop hook stub — fires after Stop/end-of-batch on commits touching comprehensive guides >500 lines OR pillar-0-governance leaves OR canonical SSoT files; runs grep-based duplicate-detection scan per [`B_CONSOLIDATION_PASS`](../../docs/plan/pillar-0-governance/behavioral-contracts.md#b_consolidation_pass) (S009 L1.3). Detects ≥3-occurrence multi-line facts/lists/definitions across governed artifacts; flags consolidation candidates with proposed canonical home + cross-reference paths. 6 duplication patterns A-F (List > Rule > Definition > Example > Cross-section > Citation) per EXT-20260505-003-A. STUB tier (S009 L1.3); week-4 promotes to active enforcement.
# @csps-version 0.1.0-stub
# @csps-owner group:finky
# @csps-lifecycle experimental
# @csps-lifecycle-state stub
# @csps-tags type:hook domain:governance audience:developer
# @csps-enforces P-OP-001 P-META-019 B_CONSOLIDATION_PASS B_STRUCTURAL_PREVENTION_DISCIPLINE
# @csps-source-extract EXT-20260505-003-A EXT-20260505-003-B EXT-20260505-003-C EXT-20260505-003-D
#
# Engraved S009 L1.3 as Surface 3 (hook) of B_CONSOLIDATION_PASS 5/5 atomic FSE.
# Authoring deferred to L1.6 governor-permission ASK batch per popup-discipline
# memory entry 44 (CSP file #6 §3 Pattern A); Option B approved.
#
# STUB BEHAVIOR (current):
#   Reports check would have run. Always exits 0.
#
# WEEK-4 PROMOTION CRITERIA:
#   - Trigger: PostStop on commits matching:
#     * docs/plan/pillar-0-governance/*.md modified (canonical SSoT layer)
#     * docs/plan/_handoff/VAULT/topic-plans/*.md modified (multi-session arc artifacts)
#     * Any governed artifact >500 lines added OR modified in this commit
#   - Logic:
#     1. Identify modified governed artifacts in HEAD commit (git diff --name-only HEAD~1 HEAD)
#     2. For each, run grep-based duplicate detection:
#        * Pattern A (List): table rows + bullet lists ≥3 occurrences across files
#        * Pattern B (Rule): imperative phrases ("MUST" / "Never" / "Always") ≥3 occurrences
#        * Pattern C (Definition): noun-phrase definitions ≥3 occurrences
#        * Pattern D (Example): code blocks + sample data ≥3 occurrences
#        * Pattern F (Cross-section reference): resolve-and-compare cross-refs
#        * Pattern E (Citation): external links + ADR references
#     3. For each ≥3-occurrence finding:
#        - Emit warning to stderr citing B_CONSOLIDATION_PASS §X 5-step protocol
#        - Suggest proposed canonical home (oldest occurrence by git blame)
#        - Suggest cross-reference path-link replacement for other occurrences
#     4. Counter-cases honored: artifacts with `consolidation_exempt: true` + paired `consolidation_exempt_reason:` skipped per EXT-20260505-003-D
#     5. Heuristic threshold ≥3 occurrences (per CSP file #3 §3); <3 leaves alone
#   - Composition with `consolidation-pass-coverage` audit slug (PR-time scan; this hook is post-commit scan)
#   - Composition with `tag-status-deep-audit` weekly cron — pass also fires at every cron tick
#   - Settings.json registration: hooks.Stop[].matcher = "after-commit" + path filter
#
# Manual invocation: bash .claude/hooks/post-stop-consolidation-pass.sh

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

echo "[consolidation-pass] STUB — timestamp=${TIMESTAMP}"
echo "[consolidation-pass] week-4 promotes to active enforcement: PostStop scan on comprehensive-guide commits"
echo "[consolidation-pass] enforces B_CONSOLIDATION_PASS 5-step protocol (S009 L1.3) + 6 duplication patterns A-F"
echo "[consolidation-pass] heuristic threshold: ≥3 occurrences of multi-line fact = candidate; <3 leave alone"
echo "[consolidation-pass] counter-cases honored: consolidation_exempt: true + reason per EXT-20260505-003-D"
echo "[consolidation-pass] STUB tier — exit 0 always"

exit 0
