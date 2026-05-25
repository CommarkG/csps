/**
 * @csps-id csps.libs.ab-testing.registry
 * @csps-name ab-testing-registry
 * @csps-description ABTestRegistry — maps testId to active variant + variant definitions.
 * Admin-settable: load from .csps/intelligence/ab-tests-config.yaml at session start.
 * Phase 1: in-memory registry (no persistence yet). Phase 2: event tracking added.
 * Moat candidate M-29. Governor S060 Q2 directive.
 * @csps-version 0.1.0
 * @csps-owner group:finky
 * @csps-lifecycle experimental
 * @csps-lifecycle-state active
 * @csps-tags type:library domain:ai audience:developer moat:ab-testing
 */

/** Variant identifier — up to 4 options per test */
export type VariantId = 'A' | 'B' | 'C' | 'D'

/** A single variant definition */
export interface ABVariant {
  /** Variant identifier */
  id: VariantId
  /** Human-readable label for the variant (used in dashboard) */
  label: string
  /** Variant-specific content payload — what differs between variants */
  content: unknown
}

/** A registered A/B test */
export interface ABTestDefinition {
  /** Canonical test ID, e.g. "cta-label-debt-collection" */
  testId: string
  /** Human description of what is being tested */
  description: string
  /** The semantic location or element being tested */
  element: string
  /** Variant definitions — minimum 2, maximum 4 */
  variants: ABVariant[]
  /** Which variant is currently active — admin-settable without code deploy */
  activeVariant: VariantId
  /** Current test status */
  status: 'active' | 'paused' | 'concluded'
  /** Optional: which avatar types this test applies to */
  avatarScope?: string[]
  /** Minimum impressions before statistical significance can be evaluated */
  sampleTarget: number
  /** Outcome dimensions being measured */
  metrics: string[]
  /** ISO date when test started */
  startedAt: string
  /** ISO date when test concluded (if applicable) */
  concludedAt?: string
  /** Winning variant ID (if concluded) */
  winner?: VariantId
  /** Whether the winner has been propagated to CIE */
  ciePropagated?: boolean
}

/** In-memory registry: testId → ABTestDefinition */
const _registry = new Map<string, ABTestDefinition>()

/**
 * Register a new A/B test.
 * Tests must have 2–4 variants. Throws if constraints are violated.
 */
export function registerTest(definition: ABTestDefinition): void {
  if (definition.variants.length < 2) {
    throw new Error(`[ABTestRegistry] Test "${definition.testId}" must have at least 2 variants.`)
  }
  if (definition.variants.length > 4) {
    throw new Error(`[ABTestRegistry] Test "${definition.testId}" cannot have more than 4 variants (CSPS moat constraint).`)
  }
  const variantIds = definition.variants.map((v) => v.id)
  if (!variantIds.includes(definition.activeVariant)) {
    throw new Error(
      `[ABTestRegistry] Active variant "${definition.activeVariant}" is not in the variant list for test "${definition.testId}".`
    )
  }
  _registry.set(definition.testId, definition)
}

/**
 * Retrieve a test definition by ID.
 * Returns undefined if the test is not registered.
 */
export function getTest(testId: string): ABTestDefinition | undefined {
  return _registry.get(testId)
}

/**
 * Get the currently active variant for a test.
 * Returns undefined if the test is not found or paused/concluded.
 */
export function getActiveVariant(testId: string): ABVariant | undefined {
  const test = _registry.get(testId)
  if (!test || test.status !== 'active') return undefined
  return test.variants.find((v) => v.id === test.activeVariant)
}

/**
 * Admin-settable: change the active variant for a test without a code deploy.
 * In Phase 1, this is called at session start after loading ab-tests-config.yaml.
 */
export function setActiveVariant(testId: string, variantId: VariantId): void {
  const test = _registry.get(testId)
  if (!test) {
    throw new Error(`[ABTestRegistry] Test "${testId}" not found.`)
  }
  const variantExists = test.variants.some((v) => v.id === variantId)
  if (!variantExists) {
    throw new Error(`[ABTestRegistry] Variant "${variantId}" not registered for test "${testId}".`)
  }
  _registry.set(testId, { ...test, activeVariant: variantId })
}

/**
 * List all registered test IDs.
 */
export function listTests(): string[] {
  return Array.from(_registry.keys())
}

/**
 * List all active tests (status === 'active').
 */
export function listActiveTests(): ABTestDefinition[] {
  return Array.from(_registry.values()).filter((t) => t.status === 'active')
}

/**
 * Mark a test as concluded and record the winner.
 * Winner must be one of the registered variant IDs.
 */
export function concludeTest(testId: string, winner: VariantId): void {
  const test = _registry.get(testId)
  if (!test) {
    throw new Error(`[ABTestRegistry] Test "${testId}" not found.`)
  }
  const variantExists = test.variants.some((v) => v.id === winner)
  if (!variantExists) {
    throw new Error(`[ABTestRegistry] Winner variant "${winner}" not registered for test "${testId}".`)
  }
  _registry.set(testId, {
    ...test,
    status: 'concluded',
    winner,
    concludedAt: new Date().toISOString(),
  })
}

/**
 * Clear all registered tests. Used in tests/session resets only.
 */
export function clearRegistry(): void {
  _registry.clear()
}
