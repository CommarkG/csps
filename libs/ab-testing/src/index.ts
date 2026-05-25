/**
 * @csps-id csps.libs.ab-testing
 * @csps-name ab-testing
 * @csps-description CSPS A/B Testing Infrastructure — Phase 1 (basic variant display).
 * ABTestRegistry + ABTest component. Up to 4 variants per element.
 * Admin-settable active variant. CIE integration in Phase 4.
 * Moat candidate M-29. Governor S060 Q2 directive.
 * @csps-version 0.1.0
 * @csps-owner group:finky
 * @csps-lifecycle experimental
 * @csps-lifecycle-state active
 * @csps-tags type:library domain:ai audience:developer moat:ab-testing s060
 */

// Component
export { ABTest, ABTestDebugBar } from './ABTest'

// Registry
export {
  registerTest,
  getTest,
  getActiveVariant,
  setActiveVariant,
  listTests,
  listActiveTests,
  concludeTest,
  clearRegistry,
} from './registry'

// Types
export type { VariantId, ABVariant, ABTestDefinition } from './registry'
