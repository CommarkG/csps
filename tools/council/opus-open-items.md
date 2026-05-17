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

Updated: 2026-05-16 S037-B | Every turn: check this before writing anything new.

| ID | Item | Announced | Status | Blocks | PI Ref |
|---|---|---|---|---|---|
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
