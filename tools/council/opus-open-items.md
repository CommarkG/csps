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
| OPEN-003 | PI-004: PE Agent skill (.claude/skills/pe-agent.md) | Turn 59 | pending | automated bundling | none yet |
| OPEN-004 | PI-005: meta-platform mini-tree documents | Turn 59 | pending | meta-platform only in opus-turn.md | none yet |
| OPEN-005 | PI-013: EKEP wizard spec and PI file | Turn 72 | pending | cross-platform knowledge exchange | none yet |
| OPEN-006 | post-stop-rzf-reminder.sh hook | Turns 63/67 | ✅ BUILT S037-B (hook file + settings.json diff — Governor must apply) | — | — |
| OPEN-007 | validate-pi-questions-answered.mjs | Turn 62 | ✅ DONE S037-B — LIVE in verify.mjs + pi-questions-gate slug | — | — |
| OPEN-008 | validate-persona-chain-complete.mjs | Turn 62 | pending | sequential chain has no enforcement | none yet |
| OPEN-009 | sync-universal-governance.mjs script | Turn 72 | pending | auto-update universal governance | none yet |
| OPEN-010 | PROP-001 proposal template YAML | Turn 69 | pending | no formal Tier 1 proposal process | none yet |
| OPEN-011 | B_PLAN_MUST_EMBED_NOT_REFERENCE | Turn 67 | ✅ DONE — gradual-build-plan 3 mandatory wiring sections added (commit 25cbec8) | — | — |
| OPEN-012 | P-OPER-002 in principles.yaml | Turns 67/72 | ✅ DONE S037-B — P-OPER-002 + B_DONE_RIGHT_FROM_THE_START ratified | — | — |
| OPEN-013 | S036 formal close (closing-summary + HANDOFF) | — | ✅ DONE (76328f4 + 19891ad) | — | — |
| OPEN-014 | Sonnet E0/E1 retrospective in sonnet-turn.md | Turn 1 | pending | protocol gap documented, never resolved | none yet |
| OPEN-015 | 3-location wiring in gradual-build-plan.template.md | This turn | ✅ APPROVED — in PROTO-002 scope | — | — |
| OPEN-016 | GitHub repo creation for universal-governance | Turn 69 | pending | local files only, not accessible from Codespaces | none yet |
| OPEN-017 | L1 files ratification (core/L1-*.md) | This turn | ✅ RATIFIED 2026-05-16 | — | — |
| OPEN-018 | projects/csps.md pointer file for universal repo | Turn 69 | pending | ecosystem index incomplete | none yet |

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
