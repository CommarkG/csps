---
id: csps.governance.meta-platform.threshold-gate
name: threshold-gate
description: "OnboardingWizard entry flow: tenantId confirmed → archetype check → wizard if unset → Clerk publicMetadata → dashboard. Wiring state: WIRED (PROTO-001)."
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
  - { rel: component, href: ../../../../libs/components/src/onboarding/OnboardingWizard.tsx }
  - { rel: pi, href: ../../../_handoff/VAULT/plan-items/PI-001-threshold-onboarding-wizard-wiring.yaml }
tags:
  - domain:architecture
  - domain:ui
  - type:reference
  - audience:developer
  - maturity:stable
scope_level: S1
---

# Threshold Gate — OnboardingWizard Entry Flow

The Threshold Gate is the user's first meaningful interaction with any CSPS app. It captures the user's archetype (their intent, context, use case) before they reach the dashboard — enabling personalized first-run experience.

## The Flow

```
User arrives at /account-setup
        │
        ▼
Is tenantId in JWT?  ──NO──→  Poll /api/auth/status (max 30s)
        │                            │
       YES                      Timeout? → Show "Setting up..." UI
        │
        ▼
Is auth().publicMetadata?.archetype set?  ──YES──→  Redirect to /dashboard
        │
       NO
        │
        ▼
Render <OnboardingWizard onComplete={handleArchetype} appName="[App]" />
        │
        ▼
User completes wizard (< 60 seconds, 3-5 questions)
        │
        ▼
handleArchetype() → Clerk updateUserMetadata({ public_metadata: { archetype } })
        │
        ▼
Clerk confirms → Redirect to /dashboard
```

## Current Wiring State

**WIRED** — per PROTO-001 audit (commit c91a974, 2026-05-16):
- `apps/template/src/app/account-setup/page.tsx` — imports + renders OnboardingWizard
- `apps/budget-planner/src/app/account-setup/page.tsx` — same pattern
- `validate-wiring-completeness.mjs` reports OnboardingWizard as WIRED

## Error Handling

| Scenario | Behavior |
|---|---|
| Browser closed mid-wizard | Progress NOT stored. User restarts from Q1 on next visit. |
| Clerk updateUserMetadata fails | Show error + retry button. Do NOT redirect until confirmed. |
| tenantId never arrives (>30s) | Show support message + manual refresh link. |

## Implementation Reference

See [PI-001](../../../_handoff/VAULT/plan-items/PI-001-threshold-onboarding-wizard-wiring.yaml) for full wiring checklist and DONE criteria.

*Source: PI-001 | PROTO-001 wiring audit | S037-D*
