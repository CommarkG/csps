---
id: csps.components.index
name: components-index
description: Mini-tree intro for libs/components/. Platform UI shell components shared by all CSPS apps.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: external_integrations
diataxis_type: reference
session: S034
impl_status: swift-implemented
scope_level: S1
mini_tree_root: true
sub_files:
  - ./src/index.ts
  - ./src/dashboard/DashboardShell.tsx
  - ./src/settings/SettingsLayout.tsx
  - ./src/feature-gate/FeatureGateOverlay.tsx
  - ./src/onboarding/OnboardingWizard.tsx
  - ./src/data-table/DataTable.tsx
links:
  - { rel: parent, href: ../../AGENTS.md }
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - maturity:stable
---

# UI Components — libs/components/

Platform shell components. Every CSPS app imports these — no per-app reimplementation.

| Component | Purpose |
|---|---|
| `DashboardShell` | Sidebar nav + main content + 4 states (empty/loading/loaded/error) |
| `SettingsLayout` | Vertical tab sidebar + content pane |
| `FeatureGateOverlay` | Plan gate overlay + upgrade prompt |
| `OnboardingWizard` | 3-step wizard → 5 archetypes (EFFICIENCY_SEEKER/BUILDER/ANALYST/TEAM_LEAD/EXPLORER) |
| `DataTable<T>` | Typed table with sort/filter/bulk actions/pagination/CSV export |

**Package:** `@csps/components` (peerDeps: react ≥18, react-dom ≥18, typescript ≥5)
