---
id: csps.pillar-0-governance.qc-coverage-map
name: qc-coverage-map
description: CSPS QC Coverage Map — shows which validators/hooks/contracts cover each dimension (think/plan/implement/validate) across all 4 organism rings (session-governance / construction-governance / schema / vocabulary). The "single organism" view. Shows what is mechanically enforced vs behavioral vs not started. Authored S011 §24+++++ per user directive "consolidate all QC+sanity+audit+validation+ai-behavior covering all bases".
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: stable
core_spine: GVRN
core_spines: [GVRN, VALD, ARCH, AI, OPER]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S011
file_depth_markers:
  l1_lines: "1-80"
  l2_lines: "81-end"
  read_protocol: "L1 = the organism map table. L2 = per-cell detail + gap analysis."
links:
  - { rel: audit-hub, href: ./audit-hub.md }
  - { rel: system-health-plan, href: ./system-health-plan.md }
  - { rel: know-how, href: ../_handoff/VAULT/know-how/README.md }
domain_path: platform
---

# QC Coverage Map — CSPS

> **The single-organism view.** Every QC mechanism mapped to its dimension and ring. Green = mechanically enforced. Yellow = partially mechanical / partially behavioral. Red = behavioral only. Grey = not started.

## Legend
- ✅ **GREEN** — mechanical enforcement, runs automatically
- ⚠️ **YELLOW** — partially mechanical; some behavioral complement needed
- 🔴 **RED** — behavioral only (declared in contract/AGENTS.md; no validator)
- ❌ **GREY** — not started; future build
- 🔑 **UNIQUE** — CSPS-specific (not found on other platforms)

---

## The QC organism map

| | THINK | PLAN | IMPLEMENT | VALIDATE |
|---|---|---|---|---|
| **Ring 1: Session Governance** 🔑 | ⚠️ D1-D10 self-monitoring (memory; no hook) | ✅ validate-plan-know-how.mjs | 🔴 "Never build without plan" (AGENTS.md only) | ✅ rzf-evidence.mjs |
| **Ring 2: Construction Governance** 🔑 | ⚠️ context-orchestrator advisory | ✅ validate-topic-plan-progress | ✅ validate-no-impl-without-plan.mjs | ✅ validate-session-artifact-sync |
| **Ring 3: Schema** | 🔴 Schema alignment behavioral | ❌ PE inputs validator missing | ❌ foundation slices not built | ❌ schema-zmodel-prisma-drift not built |
| **Ring 4: Vocabulary** | 🔴 AI uses wrong terms freely | 🔴 Naming policy behavioral | ❌ glossary-codegen-fresh not built | ❌ vale-prose not built |

---

## Per-dimension deep view

### THINK dimension — what enforcement exists when reasoning

| Mechanism | Ring | Status | Gap |
|---|---|---|---|
| D1-D10 self-monitoring catalog | R1 | ⚠️ Memory only | No PostStop hook prompts D1-D10 scan before DONE claim |
| context-orchestrator → MCP before monolith | R1 | ⚠️ Advisory | Hook fires but doesn't inject; MCP not registered in settings.json |
| model-routing-on-ratification (QG1) | R1 | 🔴 Behavioral | audit slug registered; validator not built |
| B_PE_ALIGNMENT_GUARDIAN deflects off-priority | R2 | 🔴 Behavioral | No hook; only AGENTS.md hard NO |
| Vocabulary drift from inner defaults | R4 | ❌ Not started | inner-defaults registry exists; no drift-to-vocabulary enforcement |

### PLAN dimension — what enforcement exists for planning quality

| Mechanism | Ring | Status | Gap |
|---|---|---|---|
| validate-topic-plan-progress.mjs | R2 | ✅ ACTIVE | Catches orphans; not arc velocity |
| validate-plan-know-how.mjs | R2 | ✅ ACTIVE | Checks §KH presence; not quality |
| validate-pe-inputs.mjs | R3 | ❌ Not built | PE §6 inputs can be guesses; no range validation |
| B_GRADUAL_BUILD_BY_FOUNDATIONS L<N+1> gate | R2 | 🔴 Behavioral | Foundation stability declared; no validator |
| Naming policy (4 rules) | R4 | ⚠️ Memory only | B_NAMING_POLICY engraved; naming-policy-compliance validator STUB |

### IMPLEMENT dimension — what enforcement exists when building

| Mechanism | Ring | Status | Gap |
|---|---|---|---|
| validate-no-implementation-without-plan.mjs 🔑 | R2 | ✅ ACTIVE (advisory) | Caught libs/policies/ without plan; promote to error at Ring 3 build start |
| validate-slice-freshness.mjs | R2 | ✅ ACTIVE | Catches monolith/slice drift |
| validate-audit-slug-coverage.mjs | R2 | ✅ ACTIVE | Catches validators without slugs |
| mjs_syntax_check | R2 | ✅ ACTIVE | Catches ESM bugs |
| Smoke test gate (EP-006) | R2 | 🔴 Behavioral | No pre-commit hook; only checklist item |
| Foundation slices (User/Tenant/AuditEvent) | R3 | ❌ NOT BUILT | libs/policies/base.zmodel exists; full schema not built |
| glossary-codegen-fresh | R4 | ❌ Not built | glossary.yaml exists; no codegen to Vale/ESLint/ZModel |
| validate-mjs-smoke-tests.mjs | R2 | ❌ Not built | validators have no negative tests |

### VALIDATE dimension — what enforcement exists for validation quality

| Mechanism | Ring | Status | Gap |
|---|---|---|---|
| validate-rzf-evidence.mjs 🔑 | R1 | ✅ ACTIVE | Checks THIS-SESSION verify output |
| pnpm verify (21 validators) | R1+R2 | ✅ ACTIVE | Covers R1+R2 well |
| validate-session-artifact-sync.mjs 🔑 | R1 | ✅ ACTIVE | Catches stale handoffs |
| validate-source-class-coverage.mjs | R2 | ✅ ACTIVE | 4-source-class coverage |
| validate-intake-event.mjs | R2 | ✅ ACTIVE | JSONL schema validation |
| schema-zmodel-prisma-drift | R3 | ❌ Not built | Foundation slices don't exist yet |
| CEC structured template | R1 | 🔴 Self-assessed | No 8-artifact-type walk template |
| vale-prose (vocabulary lint) | R4 | ❌ Not built | glossary.yaml not wired to Vale |

---

## Coverage percentage by dimension

| Dimension | Active mechanical | Behavioral/partial | Not started | Coverage % |
|---|---|---|---|---|
| THINK | 2 | 4 | 2 | 25% |
| PLAN | 3 | 3 | 3 | 35% |
| IMPLEMENT | 5 | 2 | 4 | 45% |
| VALIDATE | 5 | 2 | 3 | 55% |
| **Total** | **15** | **11** | **12** | **40% overall** |

**Target:** 80% mechanical coverage (all green + yellow) by week-4 build.

---

## The organism's unique claim (what competitors can't replicate)

CSPS Ring 1 (Session Governance) is **the most deeply built ring** — the one no commercial platform has. Every AI session has:
- Governor Prompts (GP-S<NNN>-<NN>) — verbatim user intent tracked
- HPFA 9-check — session audit before close
- ZF evidence — machine-verified zero-findings
- EP-NNN learning loop — mistakes improve future sessions
- B_* behavioral contracts — 40 contracts governing AI reasoning

This is Ring 1's competitive moat. **It took 11 sessions to build.** Any competitor starting today would need 11+ sessions to replicate it.

Ring 3 (Schema) and Ring 4 (Vocabulary) are the PRODUCT moat — once foundation slices are built and vocabulary is wired, the platform can generate governed code faster than any manual developer.

---

## Priority build order (for the whole organism)

1. **Foundation slices** (Ring 3 — User/Tenant/AuditEvent) → BLOCKS: every real app; the platform's metabolism
2. **Vocabulary wiring** (Ring 4 — glossary → Vale + ESLint) → BLOCKS: vocabulary drift prevention  
3. **PE inputs validator** (Ring 2 — validate-pe-inputs.mjs) → Plan quality gate
4. **Smoke test gate** (Ring 2 — pre-commit hook) → Code quality gate
5. **CEC structured template** (Ring 1 — 8-artifact walk) → Validation quality gate
6. **model-routing-on-ratification** (Ring 1 — QG1 enforcer) → Thinking quality gate
