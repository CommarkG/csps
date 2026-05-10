---
id: csps.handoff.s011-to-s012
name: handoff-S011-to-S012
description: "Handoff from Session 011 to Session 012. S011 = Phase 8 COMPLETE + Phase 9 COMPLETE (§24++ post-close addendum) + OVERVIEW.md v3.0 + deep sanity QC + CEC. S011 delivered: validate-token-budget.mjs (5-mode) + pe-compute.mjs + pe-context-cache.json + schema-index.md + validate-corespine-depth-markers.mjs + 8 context-loading templates + 5 Phase 9 audit slugs registered. pnpm verify: 18 validators PASS; 0 frontmatter warnings; 0 AAP warnings. S012 PRIMARY = Phase 10 activation + 10-scenario user-verification + context-orchestrator hook."
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
domain_path: platform
---

# HANDOFF — Session 011 → Session 012

> Zone A/B/C structured. Zone A = read first (~3 min). Zone B = context (~5 min). Zone C = scope (~8 min).

---

## ═══ ZONE A — IMMEDIATE ═══

## §0 PASTE-TARGET BLOCK

# YOU ARE S012 — Session 012 of the CSPS planning project.

**S011 CLOSED + PHASE 9 COMPLETE (§24++ post-close addendum in same chat).**

**Phase 8 COMPLETE:**
- [packages/principles-mcp/src/index.ts](packages/principles-mcp/src/index.ts) — slice-reading; 6 query tools; depth L1/L2/L3; ~200 tokens/principle vs 85K monolith ✅

**Phase 9 COMPLETE (§24++ post-close addendum):**
- [tools/validators/validate-token-budget.mjs](tools/validators/validate-token-budget.mjs) — 5-mode 6-commitment validator ✅
- [tools/test-scenarios/token-optimization-10-scenario.json](tools/test-scenarios/token-optimization-10-scenario.json) — 10-scenario spec (AWAITING_USER_VERIFICATION) ✅
- [tools/pe-compute.mjs](tools/pe-compute.mjs) — PE.read_budget computation; mtime cache ✅
- [tools/pe-context-cache.json](tools/pe-context-cache.json) — L1 cross-session cache ✅
- [docs/plan/pillar-0-governance/schema-index.md](docs/plan/pillar-0-governance/schema-index.md) — 24-row schema-of-schemas ✅
- [tools/validators/validate-corespine-depth-markers.mjs](tools/validators/validate-corespine-depth-markers.mjs) + 5 L1_CORE backfilled ✅
- 8 context-loading templates + template-registry §6 + 5 audit slugs registered ✅
- pnpm verify: **35 active validators PASS** (was 9 at S006; updated S014 ZF audit: +1 instruction-context-quality)

**OVERVIEW.md v3.0, QC sweep, CEC walk, audit-runner registration all COMPLETE. ZERO BLOCKERS. pnpm verify exit_code 0.**

### What S012 must do, in order

1. **Emit §17 receipt** as FIRST REPLY: `S012-AI-receipt-<iso>-against-S011-AI-attest-2026-05-05T16:50:00Z-S011-close`
2. **Verify state**: `pnpm verify --skip-install` exit_code 0; 54 principles / 17 templates / 130 slices / **35** active validators; 0 frontmatter warnings; 0 AAP warnings
3. **10-scenario user-verification** — run [tools/test-scenarios/token-optimization-10-scenario.json](tools/test-scenarios/token-optimization-10-scenario.json) manually; record PASS/FAIL; Phase 4d complete when ≥9/10 PASS
4. **Phase 10 PRIMARY** — per token-optimization.md §9.11: activate weekly-tag-status-deep-audit hook + HONEST CALIBRATION + topic-plan §11 closure
5. **user-prompt-submit-context-orchestrator.sh** hook — task-class detection making context-loading templates mechanical
6. **16 SKILL.md AAP 9-field backfill** — `principle_compliance` + `consolidation_cross_refs` (32 OPTIONAL warns)
7. **CronCreate** for `cron-weekly-tag-status-deep-audit.sh` (pending since S008 turn 8)

### Model recommendation S012

- Open on **Sonnet** (Lever 1 default)
- Switch to **Opus** for: Phase 10 honest-calibration measurement + topic-plan closure attestation
- Back to **Sonnet** for: hook authoring + SKILL.md backfill (mechanical)

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

> ⚠️ **§24++ POST-CLOSE AMENDMENT:** Rows 1-5 below were completed as post-close addendum to S011. Updated status shown.

| # | Item | Status | SLA |
|---|---|---|---|
| 1 | validate-token-budget.mjs 5-mode | ✅ COMPLETE (§24++ S011 — tools/validators/validate-token-budget.mjs) | DONE |
| 2 | pe-compute.mjs + pe-context-cache.json | ✅ COMPLETE (§24++ S011 — tools/pe-compute.mjs + tools/pe-context-cache.json) | DONE |
| 3 | schema-index.md | ✅ COMPLETE (§24++ S011 — docs/plan/pillar-0-governance/schema-index.md) | DONE |
| 4 | corespine_layer_compliance extension | ✅ COMPLETE (§24++ S011 — tools/validators/validate-corespine-depth-markers.mjs + L1_CORE backfill) | DONE |
| 5 | 10-scenario test (Phase 4d) | ⚠️ SPEC COMPLETE; AWAITING_USER_VERIFICATION (tools/test-scenarios/token-optimization-10-scenario.json) | S012 |
| 6 | 16 SKILL.md AAP 9-field backfill | ✅ DONE (§24+++ — validate-aap-frontmatter: 0 warns confirmed 2026-05-05T18:28:55Z) | DONE |
| 7 | CronCreate weekly-tag-status-deep-audit | Pending since S008; K3_S011-3 | S012 |
| 8 | user-prompt-submit-context-orchestrator.sh | Depends on context-loading templates (done) | S012 |
| 9 | Phase 10 continuous validation | Depends on Phase 9 | S012 PRIMARY |
| 10 | Legacy HANDOFF ID casing (5 warnings) | ✅ DONE (§24+++ — frontmatter_validate: 0 warnings confirmed 2026-05-05T18:28:55Z) | DONE |

---

## ═══ ZONE C — SCOPE ═══

## §C1 S012 PRIMARY — Phase 10 activation

Phase 9 is COMPLETE (§24++ S011 addendum). S012 PRIMARY = Phase 10.

See §9.11 in [token-optimization.md](docs/plan/pillar-0-governance/token-optimization.md) for full Phase 10 spec.

**Phase 10 exit criteria:**
- Weekly tag-status-deep-audit hook ACTIVE (settings.json edit per Pattern G)
- HONEST CALIBRATION: measure CSP 60-75% savings claim CSPS-empirically (cruel-critic obligation)
- Topic-plan §11 closure attestation signed
- user-prompt-submit-context-orchestrator.sh hook ACTIVE (makes Phase 9 templates mechanical)
- `pnpm verify --skip-install` exit_code 0

**SECONDARY:** 10-scenario user-verification (tools/test-scenarios/token-optimization-10-scenario.json) — run manually ≥9/10 PASS.

## §C2 S012 SECONDARY — SKILL.md backfill + CronCreate + hook

- 16 SKILL.md × 2 optional fields = 32 warn fixes → brings warns from 32 to 0
- CronCreate: see `cron-weekly-tag-status-deep-audit.sh` at `.claude/hooks/`
- `user-prompt-submit-context-orchestrator.sh` — read task-class from prompt → inject appropriate context-loading template paths

---

## §17 Handoff signature

**Handoff signature:** `S011-AI-attest-2026-05-05T16:50:00Z-S011-close`

S012 receipt: `S012-AI-receipt-<iso>-against-S011-AI-attest-2026-05-05T16:50:00Z-S011-close`
