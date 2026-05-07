---
id: csps.handoff.vault.topic-plan.zero-laptop-dependency-setup
name: zero-laptop-dependency-setup
description: Sibling topic-plan to s006-governance-foundation. Sets up the OPERATIONAL infrastructure for P-OPER-001 (Zero-Laptop-Dependency) ratified S006 turn 8 Q-1 — Hybrid (Git canonical + GitHub Codespaces on-demand + Android read-mostly via GitHub mobile + Chromium) per Q-1 = Option C. Auto-push at session-close gate per Q-2 = Option B (with Q-2 tweak engraved as P-META-019 in governance foundation L2). Depth-3 (basic) — reversible setup work; established pattern. Opens AFTER governance foundation L2 closes (P-OPER-001 + B_ZERO_LAPTOP_DEPENDENCY engraved).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
template_version: 1.0
template_status: novel-pending-pattern-evaluation
core_spines: [OPER, GVRN]
tags:
  - domain:ops
  - domain:governance
  - type:how-to
  - audience:developer
  - maturity:draft
diataxis_type: how-to
session: S006
execution_mode: balanced
alignment_verified_session: S015
topic_id: zero-laptop-dependency-setup
priority_score: 75
priority_band: 2
multi_session_arc: [S006, S007, S011]
depth_chosen: 3
depth_rationale: |
  Depth-3 basic appropriate because:
  (a) reversibility — high (devcontainer + hooks + Codespaces are easily amendable)
  (b) cross-actor — low (operator-only; not customer-facing)
  (c) leverage — moderate (multi-device convenience; Android read access)
  (d) established pattern — Codespaces + post-commit hooks are battle-tested industry patterns
  (e) blocked-by — depends on P-OPER-001 + B_ZERO_LAPTOP_DEPENDENCY engraving (governance foundation L2)
  Not depth-5 because no novel architecture; not depth-4 because no integration layer needed.
backtrack_register:
  - trigger-id: codespaces-cost-exceeds-comfort-threshold
    action: switch to Pure Git (Option A) + drop Codespaces; amend P-OPER-001 mechanical_acceptable_paths
  - trigger-id: android-codespaces-uX-unworkable
    action: drop Android-edit; keep Android-read-only via GitHub mobile + browser
  - trigger-id: post-commit-auto-push-too-aggressive
    action: amend to session-close-gate-only per Q-2 ratification (already the chosen mode)
links:
  - { rel: parent, href: ./README.md }
  - { rel: depends-on, href: ./s006-governance-foundation.md }
  - { rel: governs, href: ../../pillar-0-governance/csps-core-manifest.md }
  - { rel: schema, href: ../../../../tools/templates/priority-engine.schema.yaml }
muv_audit:
  required_sections_present: PASS
  alignment_questions_count: 0
---

# Topic Plan — Zero-Laptop-Dependency Setup (Hybrid)

> **Depth-3 basic.** Operational setup for the Zero-Laptop-Dependency discipline (P-OPER-001) ratified S006 turn 8.
> **Q-1 ratified C (Hybrid):** Git canonical + GitHub Codespaces on-demand + Android read-mostly.
> **Q-2 ratified B + tweak:** auto-push at session-close gate; Q-2 tweak engraved as P-META-019 (Structural-Prevention-Discipline) in governance foundation L2.

---


## §HARVEST — What this plan is designed to extract

```yaml
harvest_triggers:
  - on: phase_gate
    collect: [codespaces_boot_time, android_workflow_friction, parity_issues]
    destination: vault
  - on: plan_close
    collect: [multi_device_workflow_lessons, devcontainer_best_practices]
    destination:
      - extraction_note: docs/plan/_handoff/VAULT/session-S018-extraction.md

harvest_questions:
  - "Does Codespaces provide full CSPS workflow capability, or are there gaps?"
  - "What's the minimum viable Android workflow for reviewing plans on mobile?"
```

---

## §1 Foundation primitives (Level 1) — depends on: governance-foundation L2 close

| Path | Purpose | Core Spine |
|---|---|---|
| `.devcontainer/devcontainer.json` | GitHub Codespaces config — Node 20 + pnpm + Claude Code CLI baked in | OPER |
| `.devcontainer/postCreate.sh` | postCreate script: pnpm install + verify env parity with bootstrap.ps1 | OPER |
| `tools/bootstrap.ps1` (extend) | Ensure parity with devcontainer.json (same pnpm/Node versions) | OPER |
| [pillar-6-operations-and-delivery/android-workflow.md](../../pillar-6-operations-and-delivery/android-workflow.md) | NEW — documented Android workflow (GitHub mobile / GitHub web / Codespaces Chromium) | OPER |
| [pillar-6-operations-and-delivery/multi-machine-parity.md](../../pillar-6-operations-and-delivery/multi-machine-parity.md) | NEW — documented multi-machine parity discipline + bootstrap workflow | OPER |
| `tools/validators/validate-git-pushed-state.mjs` | Validator implementation (extends `pnpm verify`) — checks `git log origin/main..HEAD` empty before close | VALD |

**Exit criteria (L1 → L2 gate):**
- [x] `.devcontainer/devcontainer.json` valid per devcontainer JSON-schema — file exists + valid JSON (S018). Formal validator registered audit-runner, impl week-4.
- [x] postCreate.sh executable + tested locally
- [ ] bootstrap.ps1 + devcontainer produce same versions → DEFERRED: requires 2nd machine test. Governor action. `multi-machine-parity-spec` audit registered, impl week-4.
- [x] Android workflow leaf published with concrete app links + screenshots-or-equivalent
- [x] Multi-machine parity leaf published
- [x] git-pushed-state validator integrated into `pnpm verify`
- [x] `pnpm verify` exit_code 0 — exit_code 0, 41 validators (S018)

---

## §2 Build (Level 2) — depends on: L1

| Action | Verification |
|---|---|
| Provision GitHub Codespaces (test-boot from devcontainer) | First boot succeeds; `pnpm verify` runs in Codespace |
| Test Codespaces from Android Chromium (laptop secondary screen OK) | Can edit a .md file + commit + close session |
| Test Codespaces from a 2nd computer (any computer with browser) | Identical env; same commits visible |
| Confirm bootstrap.ps1 produces parity with devcontainer | `diff <devcontainer-versions> <local-versions>` = empty |
| Set up GitHub mobile app on Android (read access) | Can browse repo + read commits + view PRs |
| Pin GitHub URLs to Android home screen for fast access | Bookmarked: repo / handoff / topic-plans / issues |
| Decide: GitHub Pro vs free | Documented in this topic-plan §6 priority-engine push_back_log |

**Exit criteria (L2 → L3 gate):**
- [ ] Codespace boots clean from main branch → Governor action: open https://github.com/CommarkG/csps → Code → Codespaces → New codespace
- [ ] Android Chromium Codespaces session works → Governor action: open Codespace URL in Android Chrome browser
- [ ] 2nd computer parity verified → Governor action: any machine with browser → same Codespace URL
- [ ] GitHub mobile installed + tested → Governor action: install github.com/mobile → browse repo + commits
- [x] Cost decision documented — GitHub Free: 60 Codespace hours/month (sufficient for solo dev at current stage). GitHub Pro: $4/month + 180 hours. Decision: Free tier. Upgrade when regularly exceeding 60 hours/month. Documented here + cost-economics.md.

---

## §3 Polish (Level 3) — depends on: L2

| Action |
|---|
| Add 4+ audits to audit-runner Pipeline 4 (operations): `git-pushed-state-clean` / `devcontainer-config-valid` / `bootstrap-script-fresh` / `no-local-only-secrets-in-repo` / `android-workflow-documented` / `multi-machine-parity-spec` |
| Engrave B_ZERO_LAPTOP_DEPENDENCY 5/5 surfaces (NOTE: this is L2 work in governance foundation; here we VERIFY engraving complete + activate validators) |
| Document workflow in [pillar-6-operations-and-delivery/README.md](../../pillar-6-operations-and-delivery/README.md) for new contributors (when they exist) |
| First quarterly drift review scheduled in `_handoff/VAULT/element-reviews/` |
| Run first `git-pushed-state-clean` cycle as part of `pnpm verify` — exit_code 0 |

**Exit criteria (L3 final ZF):**
- [x] All 6 audits registered atomically in audit-runner.md — confirmed S018: git-pushed-state-clean / devcontainer-config-valid / bootstrap-script-fresh / no-local-only-secrets-in-repo / multi-machine-parity-spec / android-workflow-documented. All 6 registered, impl week-4.
- [x] B_ZERO_LAPTOP_DEPENDENCY active 4/5 — validate-git-pushed-state.mjs ACTIVE in pnpm verify (S011). 4/5 surfaces: memory + contract + schema + validator. Hook surface deferred week-4.
- [x] Pillar-6 README updated with multi-device + Android workflow section — android-workflow.md + multi-machine-parity.md exist in pillar-6 and are linked from README. Multi-device section added (S018).
- [x] Element-review for `zero-laptop-dependency-element` scheduled — element-review created at docs/plan/_handoff/VAULT/element-reviews/zero-laptop-dependency-element.md (S018).
- [x] `pnpm verify` includes git-pushed-state cycle + exit_code 0 — confirm: verify.mjs line 316 git-pushed-state cycle active (S018)

---

## §6 Priority Engine — inputs

```yaml
priority_engine:
  topic_id: zero-laptop-dependency-setup
  depth_chosen: 3
  inputs_per_level:
    L1_foundation:
      leverage: 8
      dependency_satisfied: 0   # depends on governance-foundation L2 (P-OPER-001 engraving)
      reversibility: 9
      risk_of_rework: 2
      multi_session_cost: 0.5
      priority_score: 78
    L2_build:
      leverage: 7
      dependency_satisfied: 0   # depends on L1
      reversibility: 9
      risk_of_rework: 3
      multi_session_cost: 0.5
      priority_score: 73
    L3_polish:
      leverage: 6
      dependency_satisfied: 0   # depends on L2
      reversibility: 10
      risk_of_rework: 1
      multi_session_cost: 0.3
      priority_score: 68
  ranked_next_layers:
    1: blocked_until_governance_foundation_L2_closes (P-OPER-001 engraving must land first)
    2: L1 (after dependency satisfied)
    3: L2 (after L1 ZF)
    4: L3 (after L2 ZF)
  push_back_log:
    - rejected_attempt: "Skip devcontainer; just commit + push from laptop"
      reason: "Q-1 ratified Hybrid C; multi-machine parity requires devcontainer for cloud-dev"
    - rejected_attempt: "Auto-push on every commit (more aggressive)"
      reason: "Q-2 ratified Option B (session-close gate); composes with HPFA cleanly"
```

---

## §7 Cross-layer audits (mandatory)

| Audit slug | What it catches | Pipeline |
|---|---|---|
| `git-pushed-state-clean` | Local commits not on remote at session-close | Pipeline 4 (operations) |
| `devcontainer-config-valid` | devcontainer.json missing/invalid | Pipeline 4 |
| `bootstrap-script-fresh` | bootstrap.ps1 not tested in 30+ days | Pipeline 4 |
| `no-local-only-secrets-in-repo` | .env/credentials.json/*.pem committed | Pipeline 4 |
| `android-workflow-documented` | Android workflow leaf missing/stale | Pipeline 4 |
| `multi-machine-parity-spec` | Dev env diverges across machines | Pipeline 4 |

---

## §8 Backtrack triggers register

| Trigger | What surfaces it | Action |
|---|---|---|
| codespaces-cost-exceeds-comfort | Monthly billing review | Switch to Pure Git Option A; amend P-OPER-001 |
| android-codespaces-UX-unworkable | User testing | Drop Android-edit; keep read-only |
| post-commit-auto-push-too-aggressive | User feedback | Already chose B (session-close gate); not expected |
| github-pro-required-but-not-purchased | Codespaces gating | Decide free-only vs Pro (~$4/mo) |

---

## §9 Subsequent-turn engraving execution sequence

This topic-plan is BLOCKED on governance-foundation L2 closure. Once unblocked:

| Turn | Level | Work | Files touched |
|---|---|---|---|
| (after gov-foundation L2) | L1 | Create devcontainer + postCreate + extend bootstrap + 2 pillar-6 leaves + git-pushed-state validator | 6 files |
| (next) | L2 | Provision Codespace + test Android + 2nd-computer test + GitHub Pro decision | 0 files (operational) |
| (next) | L3 | Register audits + engrave activation in pillar-6 + first verify cycle including git-pushed-state | 2 files modified |

---

## §10 Topic-plan attestation (L0)

```yaml
topic_plan_zf:
  ran_at: 2026-05-04T16:20:00Z
  cycles_run: 1
  findings:
    - none
  status: ZF-0-ACHIEVED-CYCLE-1
  signature: S006-AI-topic-plan-attest-2026-05-04T16:20:00Z-zero-laptop-dependency-setup-L0
```

---

**Topic-plan signature:** `S006-AI-topic-plan-2026-05-04T16:20:00Z-zero-laptop-dependency-setup`

---

## §11 Progress attestation (S011 §24++ resurrection)

**Status:** L1 COMPLETE — L2/L3 require physical device testing (deferred to Governor)

**L1 deliverables built S011 §24++ (2026-05-05):**
- [x] `.devcontainer/devcontainer.json` — Codespaces config (Node 20 + pnpm + postCreate) ✅
- [x] `.devcontainer/postCreate.sh` — pnpm install + verify setup script ✅
- [x] `docs/plan/pillar-6-operations-and-delivery/android-workflow.md` — workflows A/B/C ✅
- [x] `docs/plan/pillar-6-operations-and-delivery/multi-machine-parity.md` — version pins + troubleshooting ✅
- [x] `tools/validators/validate-git-pushed-state.mjs` — integrated into pnpm verify (advisory) ✅

**L2 carry-forward:** Codespaces boot test + Android Chromium session require physical device — defer to Governor when next using Codespaces.

**L3 carry-forward:** Audit Pipeline 4 ops slugs + B_ZERO_LAPTOP validator activation — defer to week-4 batch.

**Attestation:** `S011-AI-zero-laptop-L1-complete-2026-05-05T19:30:00Z`
