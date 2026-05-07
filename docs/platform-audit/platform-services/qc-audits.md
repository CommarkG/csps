---
id: csps.platform-audit.service.qc-audits
name: service-qc-audits
description: >
  Domain card for the QC & Audits platform service. Governs the 41 active validators
  (+ 18 proposed), 13 audit pipelines, 4 escalation ladders, and the evidence
  discipline. Cross-cutting — every spine's quality is measured by this service.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: platform_audit
enforcement_stage: active
tags:
  - domain:audit
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S018
links:
  - { rel: parent, href: ../README.md }
  - { rel: audit-runner, href: ../../../../plan/pillar-0-governance/audit-runner.md }
  - { rel: audit-hub, href: ../../../../plan/pillar-0-governance/audit-hub.md }
  - { rel: validators, href: ../../../../../tools/validators/ }
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/audit-runner.md
  - docs/plan/pillar-0-governance/audit-hub.md
  - tools/verify.mjs
---

# QC & Audits — Platform Service

## §1 Identity

**What I am:** The measurement layer of CSPS. I define what "quality" looks like in each domain and provide the mechanical checks that make quality claims verifiable.

**Service type:** Cross-cutting — every spine's quality is measured by me. VALD spine owns me; every spine benefits from my coverage.

**My sub-parts:**
- 41 Active Validators (pnpm verify)
- 18 Proposed Validators (ratified S018, enforcement_stage: planned/week-4)
- 13 Audit Pipelines (P1-P13 in audit-hub.md)
- 4 Escalation Ladders (adaptive resource management)
- enforcement_stage lifecycle (stub → planned → week-4 → active)

---

## §2 The 13 Audit Pipelines

| Pipeline | Name | Coverage |
|---|---|---|
| P1 | pre-close-verification | Session close gate — §10.0 mandatory |
| P2 | agent-alignment | AAP frontmatter for all skills/agents |
| P3 | cognitive-context-discipline | B_TOKEN_BUDGET 8 rules enforcement |
| P4 | zero-findings-cycle | ZF Level 1/2/3 compliance |
| P5 | engraving-completeness | Catch-to-engraving + positive extraction |
| P6 | schema-integrity | ZModel/Prisma drift + foundational slices |
| P7 | intake-and-learning | Learning loop + external input processing |
| P8 | complexity-and-hotspots | File size/complexity thresholds |
| P9 | runtime-health | Session-open completeness, git state |
| P10 | B_TOKEN_BUDGET | 5 token-budget validators (week-4) |
| P11 | vocabulary-canon | Term registration + schema validity (week-4) |
| P12 | behavioral-alignment | Contract body + CEC completeness (week-4) |
| P13 | threshold-gate | Session-open sequence verification (week-4) |

---

## §3 The 4 Escalation Ladders

Each ladder monitors a specific signal, defines rungs (thresholds → actions), and connects to PE composition selection.

**Ladder 1 — Context Pressure**
- Rung 0 (0-40%): Normal. All tiers available.
- Rung 2 (60-80%): Proactive compact prep. Shift Tier 4 → Tier 3.
- Rung 3 (80-95%): Force compact. No new Tier 4 work.
- PE effect: Rung 3 → closing_bonus × 3.0; governance-mode PE

**Ladder 2 — Blocking Event**
- Rung 2: 1 PENDING VLT → 2× PE weight on blocker
- Rung 3: Multiple VLTs → emergency-mode PE; all non-blocker work suspended
- PE effect: Rung 3 → blocker PE score = ∞ (overrides all)

**Ladder 3 — Task Complexity**
- Rung 0: Tier 0/1 sufficient. Execute at planned tier.
- Rung 2: MCP insufficient → escalate to skill injection
- Rung 4: Subagent insufficient → main context synthesis
- PE effect: higher rung → higher execution PE cost

**Ladder 4 — Blast Radius**
- Rung 1 (BR1): Single element. Validator recommended.
- Rung 3 (BR3): Platform-wide. ZF Level 3 required. Governor review.
- Rung 4 (Constitutional): L1_CORE sealed file. Multi-session arc required.
- PE effect: Rung 3 → governance-mode PE mandatory

---

## §4 Vocabulary

**Terms I own:**
- `BLOCKING` — a finding that prevents phase advance or session close
- `Advisory` — a warning tracked but not blocking; promotes to blocking on K=2 pattern
- `enforcement_stage` — stub | planned | week-4 | active lifecycle for validators
- `Escalation Ladder` — defined rungs: monitor signal → threshold → action → PE effect → de-escalation

---

## §5 MCP Surface

```
get_pipeline("P1-P13")              → slugs + cadence + severity for that pipeline
get_validator_status("slug")        → current enforcement_stage + last-run result
get_escalation_ladder("1-4")        → full ladder spec with rungs + PE effects
get_active_blockers()               → current BLOCKING findings
```

---

## §6 Current State & Evolution

**Active:** 41 validators in pnpm verify + 13 pipeline structure + 4 escalation ladders defined

**Planned (enforcement_stage: planned/week-4):**
- 18 new audit slugs registered (ratified S018) across P11-P13
- `extraction-check` promoted to BLOCKING (currently advisory)
- `validate-file-complexity.mjs` (P8 — dual-gate threshold)
- `validate-enforcement-stage-progression.mjs` (tracks stub → active promotions)

---

## §7 Connection Map

| Connected to | How |
|---|---|
| VALD | QC/Audits IS the VALD service's implementation |
| GVRN | Every ZF claim is validated by QC/Audits; escalation ladders feed PE compositions |
| ARCH | Schema drift validator (P6) monitors ARCH integrity |
| AI | B_TOKEN_BUDGET validators (P10) monitor AI context efficiency |
| Priority Engine | Escalation ladders signal PE composition changes |
