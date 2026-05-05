---
id: csps.handoff.s011-to-s012
name: handoff-S011-to-S012
description: Handoff from Session 011 to Session 012. S011 = implementation session — Phase 8 COMPLETE (principles-mcp slice-reading + 4 query tools) + OVERVIEW.md v3.0 + deep sanity QC + CEC walk (7 surfaces) + Phase 9 PARTIAL (8 context-loading templates). S012 PRIMARY = Phase 9 completion (9a-9f: validate-token-budget.mjs + pe-compute.mjs + bundling orchestrator + 10-scenario test + schema-index.md).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: handoff
template_status: stable
core_spine: GVRN
core_spines: [GVRN, OPER, AI, VALD]
schema_anchor: handoffs
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
diataxis_type: how-to
session: S011
next_session: S012
file_depth_markers:
  l1_lines: "1-90"
  l2_lines: "91-190"
  l3_lines: "191-end"
  read_protocol: "L1 = §0 paste-target + immediate priority. L2 = state delta + carry-forwards. L3 = full evidence."
links:
  - { rel: closing-summary, href: ./VAULT/closing-summary-S011.md }
  - { rel: prior-handoff, href: ./HANDOFF-S010-to-S011.md }
---

# HANDOFF — Session 011 → Session 012

> Zone A/B/C structured. Zone A = read first (~3 min). Zone B = context (~5 min). Zone C = scope (~8 min).

---

## ═══ ZONE A — IMMEDIATE ═══

## §0 PASTE-TARGET BLOCK

# YOU ARE S012 — Session 012 of the CSPS planning project.

**S011 CLOSED. S011 was the Phase 8 + QC + Phase 9 partial session.**

**Phase 8 COMPLETE:**
- [packages/principles-mcp/src/index.ts](packages/principles-mcp/src/index.ts) — slice-reading implementation; loads `principles-index.yaml` at boot; lazy-loads individual `P-XXX-NNN.yaml` slices on demand
- 6 tools: `get_principle` / `list_principles` / `find_by_enforcer_layer` / `find_by_spine` + legacy `check_reuse` + `list_principles_by_category`
- Depth-aware: L1 default (~200 tokens/principle) / L2 (+counterweight+enforcers) / L3 (full)
- Build PASS; smoke test: 53 principles indexed; slice-reading mode active

**Phase 9 PARTIAL — 9g COMPLETE; 9a-9f DEFERRED:**
- 8 context-loading task-class templates at [tools/templates/context-loading/](tools/templates/context-loading/) ✅
- [template-registry.md §6](docs/plan/_handoff/VAULT/template-registry.md) added ✅
- Remaining: validate-token-budget.mjs + pe-compute.mjs + bundling orchestrator + 10-scenario test + schema-index.md

**OVERVIEW.md v3.0, QC sweep, CEC walk all COMPLETE. ZERO BLOCKERS. pnpm verify exit_code 0.**

### What S012 must do, in order

1. **Emit §17 receipt** as FIRST REPLY: `S012-AI-receipt-<iso>-against-S011-AI-attest-2026-05-05T16:50:00Z-S011-close`
2. **Verify state**: `pnpm verify --skip-install` exit_code 0; 53 principles / 17 templates / 130 slices / 9 active validators
3. **Phase 9 PRIMARY** (9a-9f): complete the 6 deferred items:
   - 9a. `tools/validators/validate-token-budget.mjs` — 5-mode validator per §14.6 + EXT-002-A 6-commitment structure
   - 9b. Un-defer Phase 4d 10-scenario test (carry-forward from S007)
   - 9c. `tools/pe-compute.mjs` — CSPS analog of CSP `pe_compute.ps1`; includes read_budget computation; consumes `file_depth_markers`
   - 9d. `tools/pe-context-cache.json` — cross-session L1 cache for stable artifacts
   - 9e. `schema-index.md` — EXT-005-C Improvement #8 CSPS analog
   - 9f. `corespine_layer_compliance` extension for HUB depth markers (EXT-004-D Improvement #8)
4. **16 SKILL.md AAP 9-field backfill** — `principle_compliance` + `consolidation_cross_refs` (K1_S011-1; OPTIONAL warns = 32)
5. **CronCreate** for `cron-weekly-tag-status-deep-audit.sh` (pending since S008 turn 8)
6. **user-prompt-submit-context-orchestrator.sh** hook — task-class detection using context-loading templates
7. **Phase 10 if context permits** (S013): continuous validation activation

### Model recommendation S012

- Open on **Sonnet** (Lever 1 default)
- Switch to **Opus** for: Phase 9 architecture decisions (pe-compute.mjs design) + validate-token-budget.mjs 5-mode design
- Back to **Sonnet** for: SKILL.md backfill (mechanical) + hook authoring

### Hard rules (S012 inherits all S001-S011 hard NOs)

**NEW S011 additions:**
- ❌ Never read `principles.yaml` monolith when only 1 principle needed — use MCP `get_principle(id, depth="L1")` OR slice `packages/principles/principles/P-XXX-NNN.yaml`
- ❌ Never read `behavioral-contracts.md` monolith when only 1 B_* needed — use `behavioral-contracts/B_NAME.md` slice
- ❌ Context-loading JSON files are advisory specs — they are NOT executed automatically; Phase 9 `user-prompt-submit-context-orchestrator.sh` will make them mechanical

---

## ═══ ZONE B — CONTEXT ═══

## §B1 State delta S010 close → S011 close

| Surface | S010 close | S011 close | Δ |
|---|---|---|---|
| Principles validated | 53 | 53 | 0 |
| B_* contracts | 29 | 29 | 0 (implementation session; no new engraving) |
| LIVE templates | 9 | **17** | +8 (8 context-loading JSON templates) |
| Template-registry sections | 5 | **6** | +1 (§6 context-loading S011) |
| principles-mcp version | 0.0.1 skeleton | **0.1.0 Phase 8** | slice-reading + 6 tools + depth L1/L2/L3 |
| OVERVIEW.md version | 2.4 (S007) | **3.0 (S011)** | S008-S010 delta tables + current state |
| Commits S011 | — | **3** | Phase 8 + CEC walk + Phase 9 partial |
| pnpm verify | exit 0 | exit 0 | stable |

## §B2 Key decisions locked (S011)

- **Phase 8 scope = principles-mcp only** (not bundling orchestrator — that's Phase 9)
- **PE.read_budget (EXT-004-C) = Phase 9** (tools/pe-compute.mjs + pe-context-cache.json)
- **validate-token-budget.mjs = S012** (deferred; context limit reached)
- **8 context-loading templates = advisory spec** (orchestrator hook = Phase 9 S012)

## §B4 What S011 did NOT do (carry-forward register)

| # | Item | Reason | SLA |
|---|---|---|---|
| 1 | validate-token-budget.mjs 5-mode | Context limit; Phase 9 9a | S012 PRIMARY |
| 2 | pe-compute.mjs + pe-context-cache.json | Context limit; Phase 9 9c+9d | S012 PRIMARY |
| 3 | schema-index.md | Context limit; Phase 9 9e | S012 |
| 4 | corespine_layer_compliance extension | Context limit; Phase 9 9f | S012 |
| 5 | 10-scenario test (Phase 4d) | Context limit; Phase 9 9b | S012 |
| 6 | 16 SKILL.md AAP 9-field backfill | Phase 1 OPTIONAL; K1_S011-1 | S012 |
| 7 | CronCreate weekly-tag-status-deep-audit | Pending since S008; K3_S011-3 | S012 |
| 8 | user-prompt-submit-context-orchestrator.sh | Depends on context-loading templates (done) | S012 |
| 9 | Phase 10 continuous validation | Depends on Phase 9 | S013 |
| 10 | Legacy HANDOFF ID casing (5 warnings) | Low priority; K5_S011-5 | S012+ |

---

## ═══ ZONE C — SCOPE ═══

## §C1 S012 PRIMARY — Phase 9 completion

See §9.10 in [token-optimization.md](docs/plan/pillar-0-governance/token-optimization.md#910-phase-9--context-loading-templates--orchestrator-cca-layer-4-activation) for full Phase 9 spec.

**Critical dependency:** Phase 9 9c (pe-compute.mjs) requires reading EXT-20260505-004-C for the bundling orchestrator design before authoring.

**Exit criteria (Phase 9 complete):**
- `validate-token-budget.mjs` runs 5 modes PASS
- `tools/pe-compute.mjs` exists + computes `read_budget` from `file_depth_markers`
- `tools/pe-context-cache.json` exists + has L1 cache structure
- `pnpm --filter @csps/principles-mcp build` still PASS (no regression)
- `pnpm verify --skip-install` exit_code 0

## §C2 S012 SECONDARY — SKILL.md backfill + CronCreate + hook

- 16 SKILL.md × 2 optional fields = 32 warn fixes → brings warns from 32 to 0
- CronCreate: see `cron-weekly-tag-status-deep-audit.sh` at `.claude/hooks/`
- `user-prompt-submit-context-orchestrator.sh` — read task-class from prompt → inject appropriate context-loading template paths

---

## §17 Handoff signature

**Handoff signature:** `S011-AI-attest-2026-05-05T16:50:00Z-S011-close`

S012 receipt: `S012-AI-receipt-<iso>-against-S011-AI-attest-2026-05-05T16:50:00Z-S011-close`
