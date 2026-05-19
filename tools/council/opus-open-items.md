---
id: csps.council.opus-open-items
name: opus-open-items
description: "Running register of items announced by OPUS-2 but not yet implemented. OPUS-2 maintains this. Checked at every turn start."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
---

# OPUS-2 Open Items Register

Updated: 2026-05-18 S041 | Every turn: check this before writing anything new.
Scope tags: [S1]=fix now (same session) | [S2]=ripple check needed | [S3]=PRACE analysis + threshold routing required

| ID | Item | Announced | Status | Scope | Blocks | PI Ref |
|---|---|---|---|---|---|---|
| OPEN-001 | PI-002: PI schema YAML format + create-pi.mjs | Turn 59 | ✅ DONE (40f931f) | — | PI-002 |
| OPEN-002 | PI-003: validate-implementation-gate.mjs (PIG) | Turn 62 | ✅ DONE (40f931f) | — | PI-003 |
| OPEN-003 | PI-004: PE Agent skill (.claude/skills/pe-agent.md) | Turn 59 | ✅ DONE S037-I (3075da3 — AAP Class A, 27/27 aligned) | — | PI-004 |
| OPEN-004 | PI-005: meta-platform mini-tree documents | Turn 59 | ✅ DONE S037-D — 8-file mini-tree live, blocking=0 | PI-005 | — |
| OPEN-005 | PI-013: EKEP wizard spec and PI file | Turn 72 | pending | cross-platform knowledge exchange | none yet |
| OPEN-006 | post-stop-rzf-reminder.sh hook | Turns 63/67 | ✅ DONE S037-B (d0b32f4 — hook ACTIVE + settings.json registered) | — | — |
| OPEN-007 | validate-pi-questions-answered.mjs | Turn 62 | ✅ DONE S037-B — LIVE in verify.mjs + pi-questions-gate slug | — | — |
| OPEN-008 | validate-persona-chain-complete.mjs | Turn 62 | ✅ DONE S037-C — LIVE in verify.mjs + persona-chain-complete slug | — | — |
| OPEN-009 | sync-universal-governance.mjs script | Turn 72 | ✅ DONE S037-C — LIVE + pnpm sync:universal + proposals/ dir | — | — |
| OPEN-010 | PROP-001 proposal template YAML | Turn 69 | ✅ DONE S037-C — pi-proposal-tier1.yaml + proposals/README.md | — | — |
| OPEN-011 | B_PLAN_MUST_EMBED_NOT_REFERENCE | Turn 67 | ✅ DONE — gradual-build-plan 3 mandatory wiring sections added (commit 25cbec8) | — | — |
| OPEN-012 | P-OPER-002 in principles.yaml | Turns 67/72 | ✅ DONE S037-B — P-OPER-002 + B_DONE_RIGHT_FROM_THE_START ratified | — | — |
| OPEN-013 | S036 formal close (closing-summary + HANDOFF) | — | ✅ DONE (76328f4 + 19891ad) | — | — |
| OPEN-014 | Sonnet E0/E1 retrospective in sonnet-turn.md | Turn 1 | pending | protocol gap documented, never resolved | none yet |
| OPEN-015 | 3-location wiring in gradual-build-plan.template.md | This turn | ✅ APPROVED — in PROTO-002 scope | — | — |
| OPEN-016 | GitHub repo creation for universal-governance | Turn 69 | ✅ DONE S037 — github.com/CommarkG/universal-governance (private, 5 files pushed) | — | — |
| OPEN-017 | L1 files ratification (core/L1-*.md) | This turn | ✅ RATIFIED 2026-05-16 | — | — |
| OPEN-018 | projects/csps.md pointer file for universal repo | Turn 69 | ✅ DONE S037-D — pushed to CommarkG/universal-governance + local .claude/projects/csps.md | PI-018 | — |

---

| OPEN-019 | validate-wiring-completeness.mjs: exempt internal-use symbols (libs/-to-libs/ imports) | This turn | ✅ DONE (commit in PROTO-002 Step 2 scope) | — | — |

## COMPLETED THIS SESSION

| ID | Item | Completed | Commit |
|---|---|---|---|
| — | PROTO-001 COMPLETE (all 3 steps) | 2026-05-16 | ddfa4db + c91a974 |
| — | PROTO-001 Step 0 (S036-PROTO infra) | 2026-05-16 | 98db123 |
| — | PROTO-001 Step 1 (wiring audit) | 2026-05-16 | audit complete |
| — | PI-001 created (OnboardingWizard wiring) | 2026-05-16 | file created |
| — | universal-governance.md v2 | 2026-05-16 | local file |
| — | ecosystem-index.md | 2026-05-16 | local file |
| — | core/L1-*.md (3 files, pending ratification) | 2026-05-16 | local files |
| — | communication-protocol-shared.md | 2026-05-16 | CSPS repo |

---

*Maintained by OPUS-2. Checked at start of every turn.*
| OPEN-020 | PI-019: validate-handoff-completeness.mjs | Turn 86 | ✅ DONE S037-G (4eabb23) | — | — |
| OPEN-021 | EP-ERR→Planning Loop: ep_err_pre_check field + validate-creation-completeness.mjs | Turn 88 | ✅ DONE S037-H — validate-creation-completeness.mjs LIVE, ep_err_pre_check on PI-001 | — | — |
| OPEN-022 | validate-quality-alignment.mjs (OPUS-2 RZF + Sonnet INTENT ABSORBED ≥80%) | Turn 88 | ✅ DONE S037-H — validate-quality-alignment.mjs LIVE in verify.mjs | — | — |
| OPEN-003 | PI-004: PE Agent skill (.claude/skills/pe-agent/SKILL.md) | Turn 59 | ✅ DONE S037-I — AAP Class A, 27/27 aligned, PI-004 ratified | PI-004 | — |
| OPEN-023 | PI-026: Developer onboarding via threshold wizard (dogfood) | Turn 93 | pending | developer UX not dogfooded | none yet |
| OPEN-024 | PI-027: validate-intent-alignment.mjs (PI done_criterion vs code) | Turn 93 | pending | planning-to-code gap unclosed | none yet |
| OPEN-025 | PI-028: Abstract interpretation for ZenStack tenant isolation | Turn 93 | pending | behavioral validation gap | none yet |
| OPEN-026 | P-META-026 ratification (planning-before-implementing as primary pillar) | Turn 92 | ✅ RATIFIED 2026-05-17 by Governor in S040 C1 | constitutional principle | none yet |
| OPEN-027 | csps-master-plan.md auto-update mechanism (keep master plan current without manual updates) | Turn 93 | pending | navigation staleness | none yet |
| OPEN-029 | Absorb remaining [Temp name!!!] research files (04-11 series + sub-files) as EXT-KNOW entries | Turn 95 | pending | external knowledge gap | none yet |
| OPEN-030 | PROP-APP3-001: Governor decision on [Temp name!!!] as App #3 | Turn 95 | awaiting Governor | App #3 direction | PROP-APP3-001 |
| OPEN-031 | EP-ERR entry: premature-done-on-tsc-not-build (commit 6174a56 declared build fixed, only ran tsc --noEmit, not next build) | Turn 2 | ✅ RESOLVED S040 — EP-ERR-009 registered at VAULT/error-registry/ | EP-ERR-003 pattern | none yet |
| OPEN-032 | Audit empty (dashboard) parallel route group in budget-planner — orphaned intent or intentional structure? | Turn 2 | ✅ RESOLVED S040 — confirmed empty orphan, deleted | orphaned directory | none yet |
| OPEN-033 | Add `pnpm --filter @csps/[app] build` to standard verification tail for any build-related fix directive — tsc alone is insufficient | Turn 3 | ✅ RESOLVED S040 — Rule 11 added + Rule 6 updated with cross-ref | EP-ERR-003 prevention | none yet |
| OPEN-034 | OPUS persona quality commitment into session-open.sh OPUS section (T3 for B_INHERITANCE_POLICY OPUS-specific enforcement) | Turn 6 | deferred — low-risk after turn counter at 25 re-injects | OPUS quality | none yet |
| OPEN-035 | packages/principles/principles.yaml (65 ratified principles) not surfaced in any external DNA bundle — becomes DNA component ID in PI-031 dna-registry.yaml | OPUS-2 S8 | pending PI-031 design | DNA coverage gap | PI-031 |
| OPEN-036 | T2 validator for FSE compliance on new behavioral contracts — check that new B_* entries in behavioral-contracts.md declare all 5 surfaces (T1+T2+T3+contract+AGENTS.md) | Turn 7 S040 | pending | FSE enforcement gap | none yet |
| OPEN-037 | Sacred parts protection — pre-commit hook blocks edits to layout.tsx + middleware.ts + next.config.js without explicit Governor ratification. PCR approved. ADVISORY mode live at f8778df. | S040 | ✅ DONE advisory (f8778df) — upgrade to BLOCKING = separate PI item | external UX stability | none yet |
| OPEN-038 | Deduplication audit — apps/*/src/lib/audit.ts duplicated. | S040 | ✅ DONE (2f5e19c) — habit-tracker + template audit.ts now re-export from @csps/integrations | consolidation discipline | none yet |
| OPEN-039 | Token optimization as mechanical enforcement — T1 hook detects Sonnet doing Opus-tier work and flags; T2 validator checks sonnet-turn.md for architectural decisions without Opus PROTO ratification. Governor direct order S040. | S040 | pending S041 | drift prevention | none yet |
| OPEN-040 | frontmatter-closed-enums.md — add note that `inherits_from` is free-form resolved-path (NOT a closed enum). Triggered by SROF-013 Q2 answer. | S040 | pending | frontmatter correctness | none yet |
| OPEN-041 | Governance dashboard app — PI-034 candidate. Audit tab (read verify-last-run.md) + depth levels tab (read dna-registry.yaml depth_level). PE=70. | S040 | pending PI ratification | developer visibility | PI-034 |
| OPEN-042 | inheritance-registry.yaml propagation_rules section — add configurable risk threshold (auto_approve_risk: low | none). Triggered by SROF-013 Q3 answer. | S041 | pending S041 build | inheritance safety | none yet |
| OPEN-043 | nav.js extraction: extract PAGES data object to page-data.js (C5 gap — nav.js at 529+ lines). Separates rendering logic from page data for maintainability. | S040 | ✅ DONE S041 — nav.js 541→252 lines, page-data.js 300 lines, 45 HTML files updated, deployed | nav.js clarity | none yet |
| OPEN-044 | 2 missing vault templates: registry-clean.html + dashboard-clean.html. Templates page links to them; files don't exist (broken references from Completion Framework Group 2). | S040 | pending S041 playground | template completeness | none yet |
| OPEN-045 | post-tool-use-validate-before-assume.sh: upgrade STUB to ADVISORY. Should scan transcript for state claims without paired tool-call evidence. Pattern: same as post-stop-rzf-reminder.sh transcript reading. | S040 | pending S041 | B_VALIDATE_BEFORE_ASSUME enforcement | none yet |
| OPEN-046 | P-META-027: PRACE as constitutional principle in principles.yaml — PERMANENT RECURRING AI CONTEXTUAL ENFORCEMENT. Cross-refs: P-META-006 RZF, P-META-009 CCA, P-META-019 structural prevention, P-META-021 triad. Governor S040. | S040 | pending ratification in principles.yaml | constitutional principle | none yet |
| OPEN-047 | audit-runner.md prace-coverage slug — validator that checks every B_* contract answers 3 PRACE questions: training default overridden + satisfaction point named + T1+T2 named. | S040 | pending | PRACE enforcement completeness | none yet |
| OPEN-048 | closing-summary-template.md §10.0 PRACE check — add mandatory question: "Does every rule enacted this session have T1+T2+T3 named?" | S040 | pending | session close discipline | none yet |
| OPEN-046 | validate-enforcement-trio-assigned.mjs only checks PI items (11 checked). Needs to scan ALL 62 behavioral contracts for enforcement_tier: field presence. 52 contracts currently T3-only or untracked — they will drift. | S040 | pending S041 | contract enforcement coverage | none yet |
| OPEN-047 | user-prompt-submit-governor-prompts.sh: upgrade STUB to ADVISORY. Should create GP-S<NNN>-<NN> entry stub for every substantive user prompt. B_GOVERNOR_PROMPTS / P-META-012. | S040 | pending S041 | prompt governance coverage | none yet |
| OPEN-048 | verify-hooks-functional.sh: upgrade STUB to ACTIVE. Currently always exits 0 — should exit 1 if any declared critical hook is missing or not executable. Critical hooks: post-stop-rzf-reminder, pre-tool-use-plan-coverage-gate, session-open. | S040 | pending S041 | hook reliability gate | none yet |
| OPEN-049 | 52 of 62 behavioral contracts have no enforcement_tier field — they are T3-only (session injection) or entirely unenforced. Add enforcement_tier field scan to validate-enforcement-trio-assigned.mjs. | S040 | pending S041 | behavioral contract coverage | none yet |
| OPEN-050 | Add T1+T2 enforcement to top 5 contracts: B_VALIDATE_BEFORE_ASSUME + B_RZF + B_CATCH_TO_ENGRAVING + B_FIVE_SURFACE_ENGRAVING + B_STRUCTURAL_PREVENTION_DISCIPLINE. Each needs T1 hook + T2 blocking validator. PE=85. | S041 | pending — Band A | enforcement rate: 1/62 → 6/62 | none yet |
| OPEN-051 | findings-categorizer.mjs — reads verify.mjs output, tags each finding as [S1] BLOCKING / [S2] ADVISORY-ripple / [S3] PRACE-analysis-required. Routes S3 to threshold-intake-protocol.md. Makes three-scope processing MECHANICAL default not optional. S41-H in alignment plan. | S041 | pending Sprint 2 | three-scope default enforcement | none yet |
| OPEN-052 | validate-dna-registry-complete.mjs — checks that significant new artifacts (new apps, new B_* contracts, new constitutional principles) are registered in dna-registry.yaml. ADVISORY initially. Defines "significant" as: files in apps/, B_* contracts, P-META principles, major tools. | S041 | pending Sprint 2 | DNA registry completeness | none yet |
| OPEN-053 | [S3] B_CATCH_TO_ENGRAVING T1+T2. T1: post-stop hook detects discovery language without EP-ERR creation. T2: validator scans session artifacts for unregistered discoveries. Start ADVISORY for 3 sessions, promote to BLOCKING if <20% false positive. | S042 | pending — ADVISORY first | catch-to-engraving enforcement | EP-ERR-011 |
| OPEN-054 | EP-ERR-012 registered: session-open silent fallback — node -e "..." with JS double quotes closes bash string. Context injection silently failed across all prior sessions. EP-ERR-012 created at VAULT/error-registry/. T1 to build: validate-session-open-health.sh | S042 | pending T1 build | session-open reliability | EP-ERR-012 |
| OPEN-055 | Unified Planning Initiative (Governor directive S042): ONE source of planning in tools/config/unified-plan.yaml. All inputs (Opus/Sonnet/Governor) route through threshold → register as PI items with status: intake/planning/ratified/implementing/done. Collapses Opus/Sonnet awareness gap. PE=90. S043 primary mandate. | S042 | pending S043 design | architectural consolidation | PI-037 |
| OPEN-056 | opus-turn.md canonical template — equivalent to sonnet-report.template.md. Every Opus turn follows the SROF response format: AQ confirmations + Q answers + Turn directive. Wires to validate-opus-turn-rzf.mjs. | S042 | pending | opus output quality | none yet |
| OPEN-057 | Fix core seeds overdue detection — validator says overdue=0 for seeds targeting S019-S023 while we're in S043. Replace session-number comparison with unified-plan.yaml status check. Seeds grow when plan item reaches "ratified" not when session number passes. | S043 | pending | core seeds reliability | none yet |
| OPEN-058 | Acknowledge/close the 4 overdue seeds: THRESHOLD_COMPLETENESS (targeted week-4), GRACE_PHASE10 (targeted S020), ZF_POSITIVE_HARVEST (targeted S019), LEARNING_LOOP_CONSUMER (targeted S023). Either build their grows-to artifact or explicitly deprecate with reason. | S043 | pending | core seeds debt | none yet |
| OPEN-059 | Enhance core seed format: add planted-by: opus|sonnet|governor field. Enables Opus-plants/Sonnet-grows model. Opus plants seeds as part of plan design. Sonnet sees them as "planned but not ready" markers. Game-changer for planner/executor gap. | S043 | pending | core seeds enhancement | none yet |
| OPEN-060 | Add pmi-gate: field to core seeds. Seed can only grow when referenced unified-plan.yaml item reaches minimum PMI score (not session number). Also add caq: field — one question that must be answered before growing. Connects seeds to Planning Hub. | S043 | pending | core seeds + planning hub integration | none yet |
| OPEN-051 | Initialize csps-playground as git repository → push to GitHub. No git = no recovery, no history, no hooks. The S041 PowerShell wipe wiped 45 files silently; recovery only possible because Vercel had a cached deployment. PE=85. | S041 | pending S041 | playground resilience | EP-ERR-010 |
| OPEN-052 | Staging environment: add `staging` branch to CSPS repo → Vercel auto-deploys to staging-csps-budget-planner.vercel.app. Pipeline becomes: local → staging (UJT runs) → ratify → main (production). Lowest-effort highest-impact blast-radius reduction. PE=72. | S041 | pending S042 | testing architecture | none yet |
| OPEN-053 | B_CATCH_TO_ENGRAVING T1+T2 build. T1: post-stop hook detects "discovery language" in last response (gap/ripple/issue/missed/oversight) without accompanying EP-ERR creation or open-item registration — emits ADVISORY. T2: validator scans recent session artifacts for unregistered discoveries. EP-ERR-011 was the trigger incident (S042 validator ripple fixed inline but not registered until user challenged). Pre-commit Check 2 covers the specific ripple; this covers ALL discovery classes. [S3] PE=75. | S042 | pending | B_CATCH_TO_ENGRAVING enforcement gap | EP-ERR-011 |

---

## Core Scopes Classification (Sprint 1 item 5 — S041)

> Reference: docs/plan/pillar-0-governance/core-scopes.md
> [S1] = immediate fix, can close quickly
> [S2] = needs ripple check before closing (connected elements must update too)
> [S3] = requires PRACE analysis + new T1/T2/T3 enforcement mechanism

| OPEN | Scope | Rationale |
|---|---|---|
| OPEN-039 | [S3] | Token optimization needs new T1 hook (detect Sonnet doing Opus-tier architectural work) + T2 validator + T3 injection. New enforcement mechanism. |
| OPEN-040 | [S1] | Frontmatter closed-enums.md note about `inherits_from` being free-form. Quick additive change. |
| OPEN-042 | [S2] | inheritance-registry.yaml propagation_rules — needs ripple check: does the propagator logic respect the threshold? Connected to inheritance-propagator.mjs. |
| OPEN-044 | [S1] | 2 missing vault templates (registry-clean.html, dashboard-clean.html). Create files and verify links resolve. |
| OPEN-045 | [S2] | post-tool-use-validate-before-assume.sh upgrade — ripple: update enforcement-coverage.md + behavioral-contracts.md enforcement_tier after upgrade. |
| OPEN-047 | [S2] | user-prompt-submit-governor-prompts.sh upgrade — ripple: GP log files must be created in correct path, HANDOFF process must include GP count. |
| OPEN-049 | [S3] | 60/63 contracts T3-only — requires adding enforcement_tier to each contract. New enforcement declarations = PRACE analysis per contract. Batch work. |
| OPEN-050 | [S3] | T1+T2 for 5 contracts — each contract needs a new T1 hook and T2 blocking validator. Scope-3 prevention per contract. |
| OPEN-052 | [S2] | Staging environment — ripple: Vercel config change + new branch + UJT pipeline + HANDOFF process update to include staging-verified step. |
