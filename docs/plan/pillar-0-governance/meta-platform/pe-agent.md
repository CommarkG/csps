---
id: csps.governance.meta-platform.pe-agent
name: pe-agent
description: "PE Agent spec: reads PI files, applies PE formula (urgency×impact/SPI), proposes bundles for Governor ratification. To be built in S037-E as CSPS skill."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S037
depth_level: 2
impl_status: swift-implemented
links:
  - { rel: parent, href: ./README.md }
  - { rel: aap-spec, href: ../../../../tools/council/opus-turn.md }
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
scope_level: S1
---

# PE Agent — Priority Engine + Bundling Specialist

The PE Agent is a CSPS skill (to be built S037-E) that reads all PI-NNN files, computes PE scores, identifies bundle opportunities, and proposes implementation bundles for Governor ratification.

## The PE Formula

```
PE_score = (urgency_weight × impact_weight) / spi_estimate

Urgency weights:  critical=4 | high=3 | normal=2 | low=1
Impact weights:   platform-wide=4 | multi-app=3 | single-app=2 | cosmetic=1

Bundle threshold: items with SPI_sum ≤ 0.35 AND tag_overlap ≥ 2 → bundle candidate
```

Source: OPUS-2 Turn 61 §7 (PE formula) + Turn 62 §4 (sequential persona chain).

## Roles

| Actor | Responsibility |
|---|---|
| **PE Agent** | Reads PI files → computes scores → proposes bundles |
| **OPUS-2** | Runs PE Agent → reviews bundle proposal → writes Turn directive |
| **Governor** | Ratifies proposed bundle (approves the session plan) |
| **Sonnet** | Implements the ratified bundle in order |

**Hard rule:** PE Agent CANNOT self-direct Sonnet. It proposes → Governor approves → OPUS-2 directs.

## Bundle Algorithm

```
1. Read all PI files with status: ratified or scheduled
2. Compute PE score per PI using formula above
3. Sort by PE score descending
4. Find bundle candidates:
   - SPI_sum ≤ 0.35 (fits in one session)
   - tag_overlap ≥ 2 between adjacent items
   - No item has depends_on: pointing to an unsatisfied dependency
5. Propose top bundle + individual top-PE item if no valid bundle
```

## Output Format

```yaml
# bundle-proposal-YYYY-MM-DD.yaml
bundle_id: BUNDLE-NNN
proposed_at: "YYYY-MM-DD"
proposed_by: pe-agent
items:
  - id: PI-NNN
    pe_score: 88
    spi_estimate: 0.15
  - id: PI-NNN
    pe_score: 75
    spi_estimate: 0.10
total_spi: 0.25
tag_overlap: [governance, pi-system]
implementation_session_estimate: S037-X
cannot_bundle_reason: null  # or string if no bundle found
```

## AAP Compliance (for S037-E implementation)

Per OPUS-2 Turn 82 AAP spec:
- Class: A (CSPS-built skill)
- Trust tier: Platform-internal
- B_* acks: B_VALIDATE_BEFORE_ASSUME + B_CONSOLIDATION_PASS + B_PE_ALIGNMENT_GUARDIAN
- Output contract: Always produces bundle proposal YAML + session estimate + cannot-bundle-reason if applicable

*Source: OPUS-2 Turn 61 §7 + Turn 62 §4 + Turn 82 AAP spec | S037-D*
