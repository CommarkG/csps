---
id: csps.handoff.s010-to-s011
name: handoff-S010-to-S011
description: Handoff from Session 010 to Session 011. S010 = the platform-acceleration session — Phase 6 COMPLETE + Phase 7 ALL 4 CANDIDATES COMPLETE + B_AGENT_ALIGNMENT_PROTOCOL 7→9 5/5 FSE + model-routing §10 profiles + Lever 1 + 130 slice files + settings.json 15 hooks. Scope was 3× original mandate (all Governor-cardinal-directed). S011 PRIMARY = Phase 8 (principles-mcp upgrade) + deep sanity QC + CEC walk. Phase 9 = S011/S012.
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
session: S010
next_session: S011
file_depth_markers:
  l1_lines: "1-100"
  l2_lines: "101-220"
  l3_lines: "221-end"
  read_protocol: "L1 = §0 paste-target + immediate priority. L2 = state delta + carry-forwards. L3 = full evidence + scenario guidance."
links:
  - { rel: closing-summary, href: ./VAULT/closing-summary-S010.md }
  - { rel: prior-handoff, href: ./HANDOFF-S009-to-S010.md }
---

# HANDOFF — Session 010 → Session 011

> Zone A/B/C/D structured. Zone A = read first (~3 min). Zone B = context (~5 min). Zone C = scope (~8 min).

---

## ═══ ZONE A — IMMEDIATE ═══

## §0 PASTE-TARGET BLOCK

# YOU ARE S011 — Session 011 of the CSPS planning project.

**S010 CLOSED. S010 was the platform-acceleration session** that over-delivered its original mandate:

**Phase 6 COMPLETE (6a/6b/6c/6d):**
- [class-b-agent-spawn-preamble.template.md](tools/templates/class-b-agent-spawn-preamble.template.md) — T2.0 scaffold + T2.1 ZF cycle + T2.2 validator + T2.3 file scan (Haiku tier)
- B_AGENT_ALIGNMENT_PROTOCOL 7→9 fields 5/5 FSE: `principle_compliance` + `consolidation_cross_refs` (Phase 1 OPTIONAL warn; Phase 2 S012 REQUIRED error)
- settings.json 15 hooks LIVE (12/12 verified on every UserPromptSubmit)
- Lever 1: `"model": "claude-sonnet-4-6[1m]"` — every new chat opens on Sonnet

**Phase 7 ALL 4 CANDIDATES COMPLETE (130 total slice files):**
- [packages/principles/principles/](packages/principles/principles/) — 53 P-XXX-NNN.yaml slices
- [docs/plan/pillar-0-governance/behavioral-contracts/](docs/plan/pillar-0-governance/behavioral-contracts/) — 39 B_NAME.md slices
- [docs/plan/pillar-0-governance/audit-runner/](docs/plan/pillar-0-governance/audit-runner/) — 28 pipeline slices
- [docs/plan/pillar-0-governance/ai-behavior-spine/](docs/plan/pillar-0-governance/ai-behavior-spine/) — 10 section slices
- 4 split generators + 4 sync validators ACTIVE in `pnpm verify`

**model-routing-dashboard.md §10:** 3 configuration profiles (development-balanced DEFAULT / quality-first / cost-optimized) with developer-notes fields per param + PE band alignment.

**ZERO BLOCKERS. pnpm verify exit_code 0 all active cycles.**

### What S011 must do, in order

1. **Emit §17 receipt** as FIRST REPLY: `S011-AI-receipt-<iso>-against-S010-AI-attest-2026-05-05T15:25:00Z-S010-close`
2. **STEP 0**: prior-platform precedent for Phase 8 MCP server build (CSP has precedent — check EXT-20260505-004-C + existing principles-mcp skeleton)
3. **OVERVIEW.md update** at session-open (§10.0j K1_S010-1 carry-forward)
4. **Phase 8 PRIMARY**: upgrade `packages/principles-mcp/src/index.ts` from skeleton (reads principles.yaml) to slice-reading implementation + 4 query methods
5. **Deep sanity QC + alignment checks + local fixes** (Governor GP-S010-07 cardinal mandate)
6. **CEC walk**: extract and enhance AI behavior + platform-wide essentials
7. **Phase 9** (if context permits, else S012): context-loading templates × 8 + PE.read_budget hook + `validate-token-budget.mjs`

### Model recommendation S011

- Open on **Sonnet** (Lever 1 default) — STEP 0 + OVERVIEW update + Phase 8 mechanical scaffolding
- Switch to **Opus** for: Phase 8 architecture decisions + MCP query API design + deep sanity QC synthesis
- Back to **Sonnet** for: Phase 9 template authoring + 16-SKILL.md backfill

### Hard rules (S011 inherits all S001-S010 hard NOs)

**NEW S010 additions:**
- ❌ Never author new SKILL.md without 9-field AAP shape (csps_aligned + 6 existing + principle_compliance + consolidation_cross_refs) — Phase 1 OPTIONAL but recommended
- ❌ Never load behavioral-contracts.md full monolith when only 1 B_* needed — load `docs/plan/pillar-0-governance/behavioral-contracts/B_NAME.md` slice instead
- ❌ Never load principles.yaml full monolith when only 1 principle needed — load `packages/principles/principles/P-XXX-NNN.yaml` slice instead
- ❌ Never edit slice files directly — they are generated; edit the monolith and run `pnpm <source>:split`
- ❌ Never use quality-first profile unless session is constitutional/ADR — default profile is development-balanced

---

## ═══ ZONE B — CONTEXT ═══

## §B1 State delta S009 close → S010 close

| Surface | S009 close | S010 close | Δ |
|---|---|---|---|
| Principles | 53 | 53 | 0 (no new principle; B_AAP 7→9 extends P-META-010) |
| B_* contracts | 29 | 29 | 0 (extension to existing B_AGENT_ALIGNMENT_PROTOCOL, not new B_*) |
| LIVE templates | 8 | **9** | +1 (class-b-agent-spawn-preamble.template.md) |
| Slice files | 0 | **130** | +130 (53 principles + 39 contracts + 28 audit-runner + 10 ai-behavior-spine) |
| Sync validators | 0 | **4** | +4 (principle_slices_sync + behavioral_contract_slices_sync + audit_runner_slices_sync + ai_behavior_spine_slices_sync) |
| Registered audit slugs | ~157 | **~163** | +6 (4 slice-sync + model-routing-profile-consistency + aap-9-field-coverage) |
| hooks in settings.json | 0 | **15** | +15 (activated in settings.json hooks batch) |
| Model-routing profiles | 0 | **3** | +3 (§10 development-balanced/quality-first/cost-optimized) |
| Session default model | manual | **Sonnet[1m]** | +Lever 1 (settings.json "model") |
| Split generators | 0 | **4** | +4 (split-principles + split-behavioral-contracts + split-audit-runner + split-ai-behavior-spine) |
| Memory entries S010 | 51 | **52** | +1 (feedback_aap_9_field_extension.md) |
| Commits S010 | 0 | **7** | (Phase 6 + Lever 1/dashboard + Phase 7 ×3) |
| Governor-prompts (S010) | N/A | **7 (4 cardinals)** | per-session |

## §B2 Key decisions locked (S010)

- **PCR Option B for AAP 7→9**: OPTIONAL warn-level now; REQUIRED error-level S012 (Q3=A minimum-blast-radius precedent)
- **development-balanced profile DEFAULT**: Sonnet main + Haiku spawns + Opus engraving boundary
- **Lever 1 approved**: Sonnet[1m] as session default (Governor GP-S010-03/04)
- **Phase 7 in S010 (not S011)**: scope expansion Governor-authorized (GP-S010-05)
- **principles-mcp skeleton EXISTS**: Phase 8 is UPGRADE not build-from-scratch (S011 PRIMARY)

## §B4 What S010 did NOT do (carry-forward register)

| # | Item | Reason | SLA |
|---|---|---|---|
| 1 | Phase 8 principles-mcp upgrade | Next in §9.0 sequence | S011 PRIMARY |
| 2 | Deep sanity QC + alignment + local fixes | Governor GP-S010-07 cardinal | S011 SECONDARY |
| 3 | CEC walk across AI behavior + platform | Governor GP-S010-07 cardinal | S011 (after QC) |
| 4 | Phase 9 orchestrator | Depends on Phase 8 | S011/S012 |
| 5 | 16 SKILL.md AAP 9-field backfill | Phase 1 OPTIONAL; dedicated backfill | S011 |
| 6 | OVERVIEW.md update | §10.0j K1_S010-1 | S011 OPEN |
| 7 | CronCreate weekly-tag-status-deep-audit | Needs CronCreate tool | S011 |
| 8 | PE model-routing topic-plan | Phase 2 formula extension | S011+ |
| 9 | Phase 10 continuous validation | Depends on Phase 9 | S012/S013 |
| 10 | ADR-0025 CNST/GVRN split | Multi-session arc | S011+ |
| 11 | Foundation slices week-2 (User/Tenant/AuditEvent) | Parallel candidate | S011 OR S012 |
| 12 | Otosan WP MCP disable | ≥ 2026-05-12 deferred | ≥ 2026-05-12 |

---

## ═══ ZONE C — SCOPE ═══

## §C1 S011 PRIMARY — Phase 8 (principles-mcp upgrade)

**Existing skeleton:** `packages/principles-mcp/src/index.ts` — Server set up with MCP SDK; reads `principles.yaml` at boot; exposes `principles://<id>` resources + `check_reuse` tool. Architecture is correct; needs upgrade to:

1. Read from **slice files** (`packages/principles/principles/P-XXX-NNN.yaml`) via `principles-index.yaml` manifest instead of monolith
2. Add **4 query methods** per §9.9: `principles.get(id)` / `principles.list(category)` / `principles.find_by_enforcer_layer(layer)` / `principles.find_by_spine(core_spine)` (uses P-ARCH-028 core_spine field)
3. **Depth-aware responses** per EXT-20260505-004-C: L1 by default; L2/L3 on follow-up
4. **AAP Class A frontmatter** update (add 9-field shape — principle_compliance + consolidation_cross_refs)
5. **Build succeeds**: `pnpm --filter @csps/principles-mcp build`

**Exit criteria:** slice-reading impl + 4 queries + build PASS + per-query token cost <5K.

## §C2 S011 SECONDARY — Deep sanity QC + alignment checks + CEC walk

Per Governor GP-S010-07 cardinal:
1. **Deep sanity QC**: Run full platform scan — frontmatter compliance, B_* contract alignment, governance structure integrity, dead-reference detection, AAP coverage
2. **Alignment checks**: Every AI behavior surface aligned with CSPS behavioral contracts
3. **Local fixes**: Fix findings inline (not just report)
4. **CEC walk**: Extract essentials from S010 work → propagate across AI behavior + model-routing + agent alignment + platform-wide

This is a multi-step Opus-appropriate task. Plan: Sonnet for mechanical scans, Opus for synthesis + QC findings interpretation.

## §C3 S011 OPEN items

1. OVERVIEW.md update (§10.0j K1_S010-1)
2. 16 SKILL.md AAP 9-field backfill (principle_compliance + consolidation_cross_refs)
3. CronCreate for cron-weekly-tag-status-deep-audit.sh

---

## §17 Handoff signature

**Handoff signature:** `S010-AI-attest-2026-05-05T15:25:00Z-S010-close`

S011 receipt: `S011-AI-receipt-<iso>-against-S010-AI-attest-2026-05-05T15:25:00Z-S010-close`
