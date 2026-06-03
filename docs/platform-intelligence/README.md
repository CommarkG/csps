---
id: csps.platform-intelligence.index
name: platform-intelligence-index
description: "Index of CSPS platform intelligence professional reports — PE engine, CIE, IZFC, and AI Profiling. Deep-dives on role, wiring, and impact."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:admin
  - maturity:stable
links:
  - { rel: pe-engine-report, href: ./CSPS-Summary-on-Priority-Engine-2026-06-03T1146Z.md }
  - { rel: cie-report, href: ./CSPS-Summary-on-CIE-Continuous-Intelligence-Engine-2026-06-03T1146Z.md }
  - { rel: izfc-report, href: ./CSPS-Summary-on-IZFC-Completion-Standard-2026-06-03T1146Z.md }
  - { rel: ai-profiling-report, href: ./CSPS-Summary-on-AI-Profiling-System-2026-06-03T1146Z.md }
---

# CSPS Platform Intelligence — Professional Reports

> These reports explain the platform's intelligence systems: how they work, why they exist, what breaks without them, and how they're mechanically wired.

---

## Report Index

| Report | Topic | Date | Core Spine |
|--------|-------|------|------------|
| [PE Engine](./CSPS-Summary-on-Priority-Engine-2026-06-03T1146Z.md) | Priority Engine — sequencing, deflection, Foundation Exit Gate, full wiring | 2026-06-03 | GVRN |
| [CIE](./CSPS-Summary-on-CIE-Continuous-Intelligence-Engine-2026-06-03T1146Z.md) | Continuous Intelligence Engine — 5-stage learn loop, CIE connectivity, OBSERVE/AGGREGATE active | 2026-06-03 | GVRN |
| [IZFC](./CSPS-Summary-on-IZFC-Completion-Standard-2026-06-03T1146Z.md) | Iterative Zero-Finding Cycles — excellence-of-completion standard, per-turn moat, D4/D10 fix | 2026-06-03 | VALD |
| [AI Profiling](./CSPS-Summary-on-AI-Profiling-System-2026-06-03T1146Z.md) | AI Profiling System — D1-D13 defaults, CAQ mode, mode classification, feedback loop | 2026-06-03 | AI |

---

## How These Systems Relate

```
Governor Prompt
       ↓
AI PROFILING — classifies mode, detects defaults, fires CAQ if needed
       ↓
PE ENGINE — checks whether request aligns with priority ordering; deflects if not
       ↓
AI generates response using mode-injected disciplines
       ↓
IZFC — verifies claims are genuinely complete before stopping
       ↓
CIE — observes signals, aggregates patterns, feeds back into ADJUST stage
       ↓
(loop: adjusted AI behavior on next prompt)
```

Each system addresses a distinct failure mode:
- **PE**: prevents priority drift (building wrong thing)
- **AI Profiling**: prevents default distortion (building the right thing the wrong way)
- **IZFC**: prevents premature completion (claiming done before genuinely done)
- **CIE**: prevents repeated failures (learning from each session)

Together they form the platform's **quality guarantee layer** — the mechanism that makes AI-assisted governance reliable at scale.
