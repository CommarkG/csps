---
id: csps.pillar-0-governance.daily-update-plan
name: daily-update-plan
description: What CSPS must auto-update daily — the list of platform elements that become stale within 24 hours if not refreshed. Encoded as a pre-session protocol and CronCreate job. Per S011 user directive "think what else must have a daily midnight updating automatically and enforce it now into a plan or code."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
impl_status: swift-implemented
template_used: pillar-leaf
template_status: stable
core_spine: OPER
core_spines: [OPER, GVRN, VALD]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:ops
  - domain:governance
  - type:how-to
  - audience:ai-agent
  - maturity:stable
diataxis_type: how-to
session: S011
domain_path: platform
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
---

# Daily Update Plan — CSPS

> What goes stale in 24 hours if not refreshed. Every session that opens without running the daily update protocol is working with stale state.

## §1 — The daily update checklist (run at session-open OR midnight cron)

| Item | Why daily | Mechanism | Stale risk |
|---|---|---|---|
| **Moat registry coverage** | New validators added → moat element coverage may change | `node tools/validators/validate-moat-coverage.mjs` | Moat gap invisible |
| **EP/SG recurrence counts** | Any error pattern that fired again today gets +1 | `node tools/know-how-extractor.mjs` | K=2 promotions missed |
| **impl_status stale-swift** | Any artifact in swift-implemented >2 sessions | `node tools/validators/validate-impl-status.mjs` | Quality debt invisible |
| **Vault items past retrieve_when** | Items with time-based retrieve_when conditions | Weekly hook §6 (check K=2) | Insights lost |
| **CSEP backlog** | Any cruel-critic approved CSEPs ready for integration | Manual scan of `_handoff/VAULT/cseps/` | Enhancement delay |
| **Platform comparison** | Any competitor announcements relevant to CSPS | Vault external-content source class when discovered | Competitive blind spots |
| **The Threshold taxonomy** | Any new input type discovered → add to taxonomy | Check threshold-gate.md §3 | Unclassified inputs |
| **validate-nothing-stands-alone orphans** | New files added without connectivity | `node tools/validators/validate-nothing-stands-alone.mjs` | Connectivity debt grows |

## §2 — Daily update CronCreate job (session-scoped)

Fires every day at 07:23 local time (not :00 or :30 — avoids API surge):

```
DAILY UPDATE PROTOCOL — run: node tools/validators/validate-moat-coverage.mjs && node tools/know-how-extractor.mjs && node tools/validators/validate-impl-status.mjs && node tools/validators/validate-nothing-stands-alone.mjs --summary. Report: (1) any new moat gaps, (2) any EP/SG with recurrence_count increase, (3) any swift-implemented artifacts older than 2 sessions, (4) new orphans discovered. If findings: surface to Governor. If clean: emit "Daily update CLEAN — [date]".
```

## §3 — What does NOT need daily updating

- principles.yaml → session-bounded (only changes when principles are engraved)
- behavioral-contracts.md → session-bounded
- HANDOFF artifacts → session-bounded
- pnpm verify → runs every session (not daily)
- Weekly hook → weekly cadence is right (not daily)

## §4 — The "daily" discipline principle

Not everything should be daily. The discipline:
- **Real-time** (pnpm verify): structural ZF checks
- **Daily**: soft-state indicators (impl_status, moat coverage, EP recurrence)
- **Weekly**: learning loop (EP/SG extraction, vault processing, council drift)
- **Monthly**: deep analysis (CSEP cycle, PE calibration, 10-scenario test)
- **Quarterly**: honest calibration (token savings, ADR compliance, architecture drift)

Daily is the MINIMUM viable governance cadence for soft-state indicators.
