/**
 * @csps-id csps.libs.ui
 * @csps-name ui
 * @csps-description CSPS Foundation UI Components — 8 design-system primitives.
 * CSPSPage / HealthBar / GapCard / MetricBadge / JourneyStep / GuardQuestionForm / CSPSDataTable / VoiceFileInput.
 * React 18+, TypeScript, inline styles (no heavy deps, no Tailwind dependency).
 * VoiceFileInput: mandatory on ALL free-text fields (Governor Q1 S060).
 * Plan item: S058 PROTO-A STEP 2
 * @csps-version 0.1.0
 * @csps-owner group:finky
 * @csps-lifecycle experimental
 * @csps-lifecycle-state active
 * @csps-tags type:library domain:ui audience:developer
 */

export { CSPSPage } from './CSPSPage'
export { HealthBar } from './HealthBar'
export { GapCard } from './GapCard'
export { MetricBadge } from './MetricBadge'
export { JourneyStep } from './JourneyStep'
export { GuardQuestionForm } from './GuardQuestionForm'
export { CSPSDataTable } from './CSPSDataTable'
export type { TableColumn } from './CSPSDataTable'
export { VoiceFileInput } from './VoiceFileInput'
export type { VoiceFileInputProps } from './VoiceFileInput'
