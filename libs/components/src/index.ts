// libs/components — CSPS shared UI component library
// S034-B+C: Platform shell components for all CSPS apps.

export { DashboardShell } from './dashboard/DashboardShell'
export { SettingsLayout } from './settings/SettingsLayout'
export { FeatureGateOverlay } from './feature-gate/FeatureGateOverlay'
export { OnboardingWizard, ARCHETYPES } from './onboarding/OnboardingWizard' // wiring_deferred_until: S039 (ARCHETYPES used by OnboardingWizard internally — no direct app import needed)
export { DataTable } from './data-table/DataTable'
