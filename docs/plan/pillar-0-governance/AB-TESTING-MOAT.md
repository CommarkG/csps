---
id: csps.plan.ab-testing-moat
name: AB-TESTING-MOAT
description: "A/B Testing Infrastructure — admin-settable test variants up to 4 options per element, CIE feedback loop, heat maps, multi-parameter cross comparison. Governor S060 Q2 moat directive. Core seed: Phase 1 variant display → Phase 4 CIE integration. Deep dive scheduled."
version: 0.1.0
type: explanation
owner: group:finky
lifecycle: experimental
lifecycle_state: active
impl_status: swift-implemented
diataxis_type: explanation
core_spine: AI
schema_anchor: pillar_0_governance_leaves
ns_quality:
  - self-improving
  - synergetic
status: core-seed
session: S060
tags:
  - domain:ai
  - type:explanation
  - audience:developer
  - maturity:draft
links:
  - { rel: moat-registry, href: ./moat-registry.md }
  - { rel: csps-dna-manifesto, href: ./CSPS-DNA-MANIFESTO.md }
  - { rel: learning-loop, href: ./learning-loop.md }
  - { rel: cie-state, href: ../../../.csps/intelligence/cie-state.yaml }
consolidation_cross_refs:
  - libs/ab-testing/src/index.ts
  - tools/config/unified-plan.yaml
---

# A/B Testing Infrastructure — MOAT

> **Governor S060 Q2 Directive:** "build an A/B testing enabling up to 4 options and connect it to
> the CIE. THIS IS A MOAT - build the basic infrastructure and conduct research on how to build it
> optimally including heat maps and multi parameters cross comparison. core seed it and schedule for
> later deep dive."

---

## §1 — What It Is

CSPS A/B Testing Infrastructure allows any platform element — UI components, question phrasing,
onboarding flow steps, voice profile text, CTA labels, email subjects — to run up to **4 simultaneous
variants** in a governed, measurable way.

**Core capabilities:**

| Capability | Description |
|---|---|
| Multi-variant display | Up to 4 variants per element (A/B/C/D), not just A/B |
| Admin-settable | Governor sets active variant per test via dashboard — no code deploy required |
| CIE integration | Test results feed back into `.csps/intelligence/cie-state.yaml` as learning signals |
| Heat maps | Click/interaction density per variant element — where users actually engage |
| Multi-parameter comparison | Cross-compare variants across multiple outcome dimensions simultaneously |
| Statistical significance | No "winner" declared without minimum sample size + p-value threshold |

---

## §2 — Why It Is a Moat

Most platforms guess. CSPS measures.

**The moat argument:**

> "Every other SaaS builder iterates on hunches — 'this button color feels better,' 'I think the
> headline should say X.' CSPS is the only platform where every improvement hypothesis is tested
> against measured user behavior and the CIE learns the winner. The compound effect: after 12 months
> of A/B testing, CSPS apps have a measured understanding of what works for their specific avatar
> cohort that no new competitor can replicate by forking a template."

**What makes it defensible:**

1. **CIE feedback loop** — winners auto-propagate back into voice profiles, templates, and question
   phrasing. It is not just analytics; it self-improves the platform.
2. **Multi-parameter cross-comparison** — not "which headline won" but "which headline × CTA combination
   × user segment produced retention at 30 days." This depth of analysis requires infrastructure,
   not a third-party plugin.
3. **Avatar-aware segmentation** — variants can be tested per avatar type. The same UI may work
   differently for "overwhelmed business owner" vs "systematic operator."
4. **Test history as institutional knowledge** — every past test is versioned and replayable.
   No other CSPS-built app starts from zero; it inherits the library of what already worked.

**Moat classification:** This is M-class (platform moat) per [moat-registry.md](./moat-registry.md).
Candidate ID: M-29 (to be ratified by Governor in deep-dive session).

---

## §3 — Architecture Sketch

### 3.1 — Core Components

```
ABTestRegistry                          CIE Feedback Loop
    │                                         ↑
    ├── test definitions                 cie-state.yaml
    │   (testId, variants[], activeVariant,   │
    │    metrics[], avatarScope, sampleTarget) │
    │                                         │
    ▼                                         │
ABTest component                         learning-loop engine
    │                                         │
    ├── renders active variant            winner detection
    │   (A | B | C | D)                   propagation
    │                                         │
    ▼                                         │
Event tracking                           voice-profiles.yaml
    │                                    template updates
    ├── impressions                            │
    ├── clicks                                 ▼
    ├── conversions                       Next session context
    └── heat map coordinates
```

### 3.2 — ABTestRegistry Schema (draft)

```typescript
interface ABTestDefinition {
  testId: string                    // canonical ID, e.g. "cta-label-debt-collection"
  description: string
  element: string                   // what is being tested (UI location or semantic name)
  variants: ABVariant[]             // max 4
  activeVariant: string             // which variant is live (admin-settable)
  status: 'active' | 'paused' | 'concluded'
  avatarScope?: string[]            // which avatar types this test applies to
  sampleTarget: number              // minimum impressions before significance check
  metrics: string[]                 // e.g. ['click-rate', 'form-completion', 'retention-7d']
  startedAt: string                 // ISO date
  concludedAt?: string
  winner?: string                   // variant ID of winner
  ciePropagated?: boolean           // has this result been fed into CIE?
}

interface ABVariant {
  id: 'A' | 'B' | 'C' | 'D'
  label: string
  content: unknown                  // variant-specific payload (text, config, component props)
  impressions: number
  conversions: number
  heatMapData?: HeatMapPoint[]
}
```

### 3.3 — CIE Integration Points

The CIE (`.csps/intelligence/cie-state.yaml`) currently tracks engine states. A/B testing
integrates via a new `ab-testing` engine entry:

```yaml
engine_id: ab-testing
d_level: 1
alert: false
concluded_tests_this_session: 0
winners_propagated: []
active_tests: 3
```

When a test reaches `sampleTarget` and a winner is detected at `p < 0.05`:
1. `cie-state.yaml` `ab-testing` engine logs the winner
2. The `learning-loop` engine is notified
3. The winning variant content is offered for propagation to canonical sources
   (voice profile text, template content, question phrasing)

---

## §4 — Research Questions (Pre-Build Deep-Dive Agenda)

These must be answered before Phase 3 (analysis dashboard) and Phase 4 (CIE integration) build starts.

**Heat map technology:**
- [ ] Which heat map library fits the CSPS zero-heavy-deps philosophy? Options: `react-heat-map`,
  custom canvas overlay, or server-side coordinate aggregation?
- [ ] Are heat maps per-test-variant (comparing where users click in variant A vs B) or global?
- [ ] What coordinate system — absolute pixel, CSS grid cell, or semantic element ID?
- [ ] Heat map data storage: in-memory per session vs persisted in `.csps/intelligence/`?

**Statistical significance:**
- [ ] What p-value threshold is appropriate for CSPS-scale tests? (typical SaaS: p<0.05)
- [ ] Minimum viable sample sizes per variant: what is practical for a platform with
  20–500 users per app?
- [ ] Multi-armed bandit vs fixed-horizon A/B: should CSPS dynamically shift traffic toward
  better-performing variants before a winner is declared?
- [ ] How to handle multiple simultaneous tests on the same page without interaction effects
  (Simpson's paradox risk)?

**Multi-parameter cross-comparison:**
- [ ] What outcome dimensions are most valuable? (conversion, retention, time-to-complete, NPS proxy)
- [ ] How do we cross-compare variant × avatar cohort × time-period without a full analytics
  database? Can `.csps/intelligence/` YAML files scale to this?
- [ ] Should multi-parameter results produce a Pareto frontier (best variant on combined dimensions)
  or require Governor judgment?

**CIE propagation mechanics:**
- [ ] When a winner is detected, which elements are auto-propagated vs Governor-ratified?
  (Auto: trivial text variants. Ratified: structural/flow changes.)
- [ ] How does the CIE prevent over-fitting to a single test window?
  (Seasonal effects, small sample N, one-time events)
- [ ] What is the CIE propagation format? YAML patch? Structured diff? Migration record?

---

## §5 — Build Sequence

### Phase 1 — Basic Variant Display (READY TO BUILD)

**Scope:** `libs/ab-testing/` package. No analytics yet.

- `ABTestRegistry` — in-memory registry: `testId → { variants[], activeVariant }`
- `ABTest` React component — renders the active variant's content, accepts all 4 slots
- Admin-settable via `.csps/intelligence/ab-tests-config.yaml`
- No tracking, no dashboard, no CIE — just correct rendering per active variant

**Gate:** Governor confirms Phase 1 works in playground before Phase 2 starts.

### Phase 2 — Event Tracking

**Scope:** Client-side impression + click + conversion tracking.

- `trackImpression(testId, variantId)` — called on mount
- `trackEvent(testId, variantId, eventType, payload)` — called on interaction
- Heat map coordinate capture: `onMouseUp(x, y, elementId)` → stored per variant
- Storage: `.csps/intelligence/ab-events/[testId].jsonl` (append-only log)

**Gate:** 48 hours of tracking data collected on at least 1 live test.

### Phase 3 — Analysis Dashboard

**Scope:** Platform page at `/platform/ab-testing`.

- Active tests view with live impression/conversion rates per variant
- Statistical significance indicator (green = significant, yellow = approaching, red = insufficient data)
- Heat map overlay per variant (click density visualization)
- Multi-parameter comparison table: variant × metric matrix
- Winner recommendation with confidence level

**Research gate:** Heat map tech + significance thresholds resolved from §4 before Phase 3 starts.

### Phase 4 — CIE Integration

**Scope:** Close the learning loop.

- Winner detection pipeline → `cie-state.yaml` `ab-testing` engine update
- Propagation proposals → Governor review queue (for structural winners)
- Auto-propagation → voice profiles + template content (for text-only winners at >95% confidence)
- Test history archive: concluded tests are versioned, not deleted

**Gate:** At least 1 test has run end-to-end: started → winner detected → CIE propagated →
verified in next session that canonical source updated.

---

## §6 — Platform Integration Points

| Integration | Description |
|---|---|
| `voice-profiles.yaml` | Test alternative voice profile phrasings — winner replaces current |
| Threshold intake | Test different question framings in Level 0–4 intake |
| Template content | Test onboarding copy, CTA labels, hero text across app forks |
| Wizard steps | Test question ordering and depth triggering in the intake orchestrator |
| Email subject lines | For CRM-connected apps: test subject variants |

---

## §7 — Core Seed Register Entry

This document IS the core seed. Registered in `tools/config/unified-plan.yaml` as:

```yaml
id: AB-TESTING-MOAT
status: planning
epoch: E2
batch: BATCH-E
pe_score: 88
```

**Deep dive scheduled with Governor before Phase 2 begins.**

The Phase 1 basic infrastructure (`libs/ab-testing/`) is planted now and is functional.
Phases 2–4 require Governor ratification of the research answers in §4.

---

## §8 — Cross-References

- [moat-registry.md](./moat-registry.md) — Candidate M-29
- [CSPS-DNA-MANIFESTO.md](./CSPS-DNA-MANIFESTO.md) — Synergetic + Self-improving dimensions
- [learning-loop.md](./learning-loop.md) — CIE feedback loop parent
- `.csps/intelligence/cie-state.yaml` — Runtime CIE state
- `libs/ab-testing/` — Phase 1 implementation (planted S060)
- `tools/config/unified-plan.yaml` — Plan item: AB-TESTING-MOAT
