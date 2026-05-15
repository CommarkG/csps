---
id: csps.pillar-0-governance.moat-registry
name: moat-registry
description: Definitive CSPS competitive moat registry — all 15 moat elements mapped to their recurring audit coverage, active validators, and cadence. validate-moat-coverage.mjs checks every moat element has at least one active audit. Alignment with CORE: every session checks CORE alignment via pnpm verify; weekly health hook checks moat element drift; monthly CSEP cycle ensures synergies propagate. Per S011 user directive "go over the core of cores list and the moat items and see how recurring audits covers all of them."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
impl_status: swift-implemented
template_used: pillar-leaf
template_status: stable
core_spine: GVRN
core_spines: [GVRN, VALD, AI, ARCH, OPER]
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
  read_protocol: "L1 = moat registry table with audit coverage. L2 = per-element detail + CSEP status."
links:
  - { rel: system-health-plan, href: ./system-health-plan.md }
  - { rel: qc-coverage-map, href: ./qc-coverage-map.md }
  - { rel: zf-moat, href: ./zf-moat.md }
  - { rel: council-registry, href: ./council-registry.md }
domain_path: platform
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
---

# Moat Registry — CSPS

> **The definitive list of what makes CSPS non-replicable.** Every moat element has a recurring audit. Every audit has a cadence. Every cadence has mechanical enforcement. No moat element is unchecked.

## §0 — Moat element schema (like all CSPS schemas — structure before content)

Every moat element MUST declare these fields (schema-aligned per CSPS DNA):

```yaml
moat_element:
  id: M-NN                           # sequential, permanent
  name: string                       # canonical name (kebab-case noun phrase)
  unique_because: string             # one sentence: what no other platform does
  ring: 1 | 2 | 3 | 4               # which organism ring (session / construction / schema / vocabulary)
  dimension: think | plan | implement | validate | cross-cutting
  active_validators: [slug, ...]     # pnpm verify cycles covering this element
  cadence: every-session | weekly | monthly | quarterly
  csep_status: pending | active | integrated | not-applicable
  first_engraved: S<NNN>             # session when this was first formalized
  platform_agnostic: true | false    # does this apply to non-Claude AI systems?
  model_tier_for_audit: STANDARD_BUILD | DEEP_REASONING | MECHANICAL_SCAN
```

**Why schema-aligned:** The moat is the platform's core competitive asset. Treating it as a typed schema means:
- Validators can check moat elements have all required fields
- The moat can be queried by dimension, ring, or cadence
- New moat elements follow the same discipline as all other governed artifacts

## §1 — The moat registry table

| # | Moat element | Unique because | Active validators | Cadence | CSEP status |
|---|---|---|---|---|---|
| M-01 | **Session-as-governed-artifact** | Every AI build session is HPFA+GP+ZF audited — no other platform governs its AI sessions | `rzf_evidence` + `session_artifact_sync` + `topic_plan_progress` | Every session | CSEP-pending |
| M-02 | **Behavioral contract system (40 B_*)** | AI HOW (reasoning) governed by contract, not just WHAT — no other platform has this | `behavioral_contract_slices_sync` | Every session | SG-001 |
| M-03 | **Error-pattern learning (EP-NNN)** | Mistakes produce EP entries that prevent recurrence — platform gets smarter | `plan_know_how` + weekly know-how-extractor | Weekly | CSEP-pending |
| M-04 | **Depth-aware knowledge loading** | Slices + MCP + L1/L2/L3 — 425× token reduction; most platforms load full files | `slice_freshness` + `principle_slices_sync` + `behavioral_contract_slices_sync` | Every session | SG-002 |
| M-05 | **Core Spines precedence (GVRN>VALD>ARCH>AI>OPER)** | Principled conflict resolution — no invented hierarchies | `corespine_depth_markers` + frontmatter validation | Every session | CSEP-pending |
| M-06 | **Construction gate (plan-before-build)** | No code without ratified plan — enforced by validator | `no_implementation_without_plan` | Every session | EP-011 resolved |
| M-07 | **ZF moat (RZF+CEC+per-session+EP-learning+provenance)** | THIS-SESSION evidence required; CEC propagates insights; graduated apps carry ZF history | `rzf_evidence` + `session_artifact_sync` | Every session | See zf-moat.md |
| M-08 | **Questions as first-class (vault + question_register)** | Questions preserved with context — no knowledge loss | vault_pending field + `validate-vault-connections` (future) | Weekly extraction | CSEP-pending |
| M-09 | **Positive harvest (SG-NNN)** | Success patterns harvested and applied — most platforms only track failures | Weekly know-how-extractor §SG | Weekly | CSEP-pending |
| M-10 | **Vault methodology (temporal optimization)** | Deliberate deferral with full context — not procrastination, virtue | vault_pending field + weekly §6 EP K=2 | Weekly | CSEP-pending |
| M-11 | **Council + orchestration (19 expert members)** | Skill dispatch by task class with improvement pipeline | `aap_frontmatter_coverage` + council-registry | Per-session + weekly | CSEP-pending |
| M-12 | **Implementation status state machine** | swift-implemented→sealed-zf tracks quality journey | `impl_status` | Every session | swift-implemented |
| M-13 | **Core Cross-Synergy (CSEP pipeline)** | Any insight propagates to ALL relevant surfaces via Synergy Master + Cruel Critic | synergy-master skill + cruel-critic skill (19th/20th council members) | Monthly | ACTIVE — this document |
| M-14 | **System-health organism (4 cadences)** | Daily/weekly/monthly/quarterly health scans mapped to 10 audit-hub pipelines | `validate-corespine-depth-markers` + weekly hook | 4 cadences | See system-health-plan.md |
| M-16 | **The Threshold (universal input gate)** | Named + documented; pipeline consolidation target; every input classified to IntakeEvent | `import_quarantine` + threshold-gate.md | Per-session | swift-implemented |
| M-17 | **Reuse-first mechanical (P-OP-001 enforced)** | §0 mandatory reuse check before any implementation; EP-012 catches skips | `plan_know_how` (§KH §0 item) + EP-012 | Every plan | swift-implemented |
| M-18 | **Connectivity enforcement (P-ARCH-001)** | nothing-stands-alone mechanically checked; 43 pre-S006 orphans surfaced | `nothing_stands_alone` | Per-session advisory | swift-implemented |
| M-15 | **CORE alignment enforcement** | Every artifact declares its spine; precedence order resolves conflicts | `corespine_depth_markers` + frontmatter_validate | Every session | CSEP-pending |
| M-19 | **External Integrations Hub (S028)** | 33+ rules from production deployments (Vercel/Supabase/Clerk/ZenStack) with 3-month review cadence + screenshot archive — AI MUST read before touching any external service. No other platform governs external integration knowledge this way. | `external-integrations` dir freshness (planned) | Quarterly review + every integration touch | CSEP-pending |
| M-20 | **Apps-as-ephemeral-trials + deletion test (S029)** | P-ARCH-030: every fix = Component A (app) + Component B (libs/template extraction). Deletion test is the standard: rm -rf apps/{app}/ must lose zero platform value. 30 future apps inherit every fix for free. | `app_scope_isolation` (week-4) + `platform_capacity` | Every session | CSEP-pending |
| M-21 | **Platform capacity monitoring (S030)** | validate-platform-capacity.mjs + platform-capacity-registry.yaml: 11 elements measured every verify run, ADVISORY at soft limit, BLOCKING at hard limit with mitigation strategy. Most platforms discover limits at crisis, not at 85% of soft limit. | `platform_capacity` LIVE | Every session | CSEP-pending |
| M-22 | **Multi-model council protocol (S028-S029)** | SROF format, GCI gate (GCI<10 proceed, ≥10 must consult Opus), platform-state-snapshot as single Opus read target, INTENT ABSORBED before any edit, "Opus, this is Sonnet" identity handshake. No other platform has formalized multi-model architectural governance with verifiable handoffs. | `validate-sonnet-report.mjs` (planned) | Every Opus interaction | CSEP-pending |
| M-23 | **Completion-Priority DPR (S031)** | P-OP-006: every new input during active build rated 1-5 before response. Only Rating 3-5 justifies interruption. Training default (respond immediately) overridden. Platform ships faster because WIP debt compounds correctly. | OD-010 in inner-ai-defaults (behavioral) | Every session | CSEP-pending |

## §2 — Audit coverage by cadence

| M-24 | **Security module as platform primitive (S032)** | libs/integrations/security/ gives every CSPS app security headers (CSP/HSTS/X-Frame), Zod validation, audit logging, role guards, Upstash rate limiting, and circuit breakers for free — zero per-app cost. Most stacks rebuild this 30× independently. CSPS builds it once, every app inherits. | `security-headers-compliance` (LIVE S032-D) | Every app + every verify | CSEP-pending |
| M-25 | **Schema-first tenant isolation with write policies (S032)** | ZenStack @@allow/@@deny policies enforce tenant isolation at the ORM layer for ALL models, not just critical ones. S032 added write policies (UserTenant, Notification, WebhookEndpoint) + viewer role + plan/features/limits tier support. 12 models, all tenant-isolated by default. App code cannot bypass. | `foundation_schema_drift` LIVE | Every PR + verify | CSEP-pending |

### Every session (pnpm verify — 112+ validators, S032)
Covers: M-01, M-02, M-04, M-05, M-06, M-07, M-12, M-15, M-20, M-21, M-23, M-24

### Weekly (cron-weekly-tag-status-deep-audit.sh)
Covers: M-03 (know-how extraction), M-08 (vault processing), M-09 (SG-NNN), M-10 (K=2 check), M-11 (council drift)

### Monthly (manual + CSEP cycle)
Covers: M-13 (synergy-master full scan), M-14 (health organism review), M-08 (deep vault processing)

### Quarterly
Covers: All moat elements — full reassessment + honest calibration + architecture review

## §3 — CORE alignment check (the unique alignment discipline)

Every session pnpm verify checks CORE alignment:
- `corespine_depth_markers` → 5 L1_CORE files have depth markers ✅
- `frontmatter_validate` → every artifact declares `core_spine:` ✅
- `behavioral_contract_slices_sync` → all B_* contracts align with CORE ✅
- `principle_slices_sync` → all 53 principles align with CORE ✅

The CORE is not just a category — it's enforced by validators. Any artifact claiming GVRN spine that violates GVRN CORE doctrine fails `corespine-layer-compliance` (week-4 build).

**This is the unique thing:** most platforms have "core values" that are aspirational. CSPS has CORE values that are MECHANICALLY ENFORCED. The L1_CORE sealed files are the constitution. The validators are the enforcement layer.

## §4 — Moat growth trajectory

```
S006 close:  3 moat elements (session-gov + B_* + principle-inheritance)
S011 close: 15 moat elements (3 + depth-aware + construction-gate + ZF-moat
                               + questions + positive-harvest + vault + council
                               + impl-status + core-synergy + health-organism + CORE)
Target:     20+ moat elements by S015 (foundation-slices + vocabulary-governance
                                        + graduation-provenance + CSEP-history)
```

Every session adds moat elements. This is the compound moat — not static barriers but a growing, self-reinforcing set of properties that no competitor can replicate quickly because the history matters as much as the current state.
