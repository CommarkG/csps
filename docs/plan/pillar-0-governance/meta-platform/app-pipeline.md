---
id: csps.governance.meta-platform.app-pipeline
name: app-pipeline
description: "8-step pipeline from app concept to deployed product: Intake→Crystallize→PE Assess→Plan→Ratify→Build in Sandbox→Validate→Graduate."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: vault_files
diataxis_type: reference
session: S037
depth_level: 2
impl_status: swift-implemented
links:
  - { rel: parent, href: ./README.md }
  - { rel: template, href: ../../apps-architecture.md }
tags:
  - domain:governance
  - domain:architecture
  - type:reference
  - audience:developer
  - maturity:stable
scope_level: S1
---

# App Pipeline — Concept to Deployed Product

Every app in CSPS follows the same 8-step pipeline. No app skips steps. The pipeline enforces P-ARCH-030 (apps are ephemeral trials) and P-META-022 (intent crystallization before implementation).

## The 8 Steps

```
Step 1: INTAKE
  └─ Governor states domain/problem/user in 1-3 sentences
  └─ AI routes to crystallization (P-META-022 gate)

Step 2: CRYSTALLIZE
  └─ JTBD template: "When [situation], I want to [action], so I can [outcome]"
  └─ 3 clarifying questions resolved → intent confirmed
  └─ Gate: validate-intent-crystallized.mjs PASS

Step 3: PE ASSESS
  └─ PE Agent (or manual) scores: urgency × impact / SPI_estimate
  └─ Priority band assigned (BAND-A/B/C/D)
  └─ PE score ≥ 60 required to proceed to Plan

Step 4: PLAN
  └─ Gradual-build-plan created (depth ∈ {3,4,5})
  └─ Phase 1 = foundation only, no app code
  └─ Gate: validate-phase-exit-criteria.mjs

Step 5: RATIFY
  └─ OPUS-2 reviews plan → Governor ratifies
  └─ PI-NNN item created (status: ratified)
  └─ Cooling period (1 session) for constitutional changes

Step 6: BUILD IN SANDBOX
  └─ pnpm create:app [name] → 18-file scaffold
  └─ Implementation matches plan — no wildcards
  └─ Verify exit_code=0 per commit

Step 7: VALIDATE
  └─ Gate 3: deploy to Vercel (root dir = apps/[name])
  └─ validate-wiring-completeness.mjs shows all libs WIRED
  └─ PI-NNN status → implementing → done

Step 8: GRADUATE
  └─ App reaches PMF → spun out as standalone product
  └─ libs/ patterns promoted to platform template
  └─ Deletion test: if deleted, would platform miss it?
     YES → pattern promoted | NO → app was the value
```

## Key Principles

- **P-ARCH-030:** Apps are ephemeral trials — deletion is expected
- **P-META-022:** Intent crystallized before Plan step
- **P-ARCH-031:** DONE = wired + called + verified (not just committed)

*Source: OPUS-2 Turn 82 app-pipeline spec | S037-D*
