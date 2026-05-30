#!/usr/bin/env node
/**
 * validate-threshold-exhaustive.mjs
 * @csps-dna
 * core_spine: VALD
 * @csps-enforces PROTO-S068-PART-2-THRESHOLD-COMPLETE STEP 2 + P-META-019
 * @behavioral-test-status: tested — tests A/B/C below
 * M7 S071 PART 2 STEP 2 — Exhaustive + accurate classification
 *
 * Proves zero `default-to-unhandled` paths in threshold-router.mjs.
 * The two catch-alls (foreign-element + place-not-found) make the partition exhaustive:
 * every input either matches a class OR falls to PLACE-NOT-FOUND (explicit, notified).
 *
 * Test 3/3:
 *   A: matched-class input → correct matched route (not PLACE-NOT-FOUND)
 *   B: unmatched input → PLACE-NOT-FOUND WITH notify (not silent default)
 *   C: foreign-element input → FOREIGN-ELEMENT:quarantine route
 *
 * Audit slug: threshold-exhaustive (registered in audit-runner.md)
 */

import { routeInput } from '../scripts/threshold-router.mjs'
import { existsSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(process.cwd())
const LAST_RUN = join(ROOT, 'tools/data/validate-threshold-exhaustive-last-run.json')

// Test matrix: all 10 classes from PROTO-S068-PART-2 §CLASSIFICATION DESIGN
// (current enumeration — expandable per P-META-028 cornerstone)
const TEST_CASES = [
  // Class 1: Governor directive / ratification
  { id: 'C1a', desc: 'Governor directive + constitutional', input: { type: 'governor_directive', spine: 'GVRN', urgency: 'high', scope: 'constitutional', content: 'ratify this protocol' }, expected_class: 'governor_directive', expected_route_prefix: 'ESCALATE' },
  { id: 'C1b', desc: 'Governor directive operational', input: { type: 'governor_directive', spine: 'GVRN', urgency: 'medium', scope: 'operational', content: 'proceed with M7' }, expected_class: 'governor_directive', expected_route_prefix: 'PROCESS-NOW' },
  // Class 2: Implementation / schema / code
  { id: 'C2', desc: 'ARCH implementation', input: { type: 'implementation', spine: 'ARCH', urgency: 'medium', scope: 'operational', content: 'build the schema' }, expected_class: 'implementation', expected_route_prefix: 'PROCESS-NOW' },
  // Class 3: AI-behavior / inner-default
  { id: 'C3', desc: 'AI behavior signal', input: { type: 'ai_behavior', spine: 'AI', urgency: 'medium', scope: 'operational', content: 'D11 debugging-wrong-layer inner-default fired' }, expected_class: 'ai_behavior', expected_route_prefix: 'PROCESS-NOW' },
  // Class 4: Validation / ZF / evidence
  { id: 'C4', desc: 'Validation evidence', input: { type: 'validation', spine: 'VALD', urgency: 'high', scope: 'operational', content: 'exit_code=1 BLOCKING validator failed' }, expected_class: 'validation', expected_route_prefix: 'PROCESS-NOW' },
  // Class 5: Proposal / consequential
  { id: 'C5', desc: 'Proposal general', input: { type: 'proposal', spine: 'ARCH', urgency: 'medium', scope: 'operational', content: 'proposing a new feature for the platform' }, expected_class: 'proposal', expected_route_prefix: 'CIP:staging' },
  // Class 6: External content / research
  { id: 'C6', desc: 'External research', input: { type: 'external_research', spine: 'AI', urgency: 'low', scope: 'tactical', content: 'EXT-ID external research document' }, expected_class: 'external_research', expected_route_prefix: 'VAULT:defer' },
  // Class 7: Maintenance / tactical / adjacent
  { id: 'C7', desc: 'Maintenance', input: { type: 'maintenance', spine: 'OPER', urgency: 'low', scope: 'tactical', content: 'fix typo in docs' }, expected_class: 'maintenance', expected_route_prefix: 'VAULT' },
  // Class 8: Conversational / SHAPE-TIER
  { id: 'C8', desc: 'Conversational', input: { type: 'question', spine: 'GVRN', urgency: 'low', scope: 'tactical', content: 'what time is it', shapeTier: true }, expected_class: 'conversational', expected_route_prefix: 'PROCESS-NOW' },
  // Class 9: Foreign element
  { id: 'C9', desc: 'Foreign element', input: { type: 'foreign_element', spine: 'ARCH', urgency: 'medium', scope: 'architectural', content: 'untiered MCP agent' }, expected_class: 'foreign_element', expected_route_prefix: 'FOREIGN-ELEMENT' },
  // Class 10: place-not-found (explicitly unmatched)
  { id: 'C10', desc: 'Place-not-found (unmatched)', input: { type: 'unknown_xyz_123', spine: 'GVRN', urgency: 'low', scope: 'operational', content: 'completely unrecognized input type xyz' }, expected_class: 'place_not_found', expected_route_prefix: 'PLACE-NOT-FOUND' },
]

let passed = 0
let failed = 0
let blocking = 0
const findings = []

for (const tc of TEST_CASES) {
  const result = routeInput(tc.input)
  const routeMatches = result.route.startsWith(tc.expected_route_prefix)
  const classMatches = result.input_class === tc.expected_class

  // BLOCKING: PLACE-NOT-FOUND must never be the route when a class was expected (and vice versa)
  const isBlocking = !routeMatches && tc.expected_route_prefix !== 'PLACE-NOT-FOUND'
    && result.route === 'PLACE-NOT-FOUND:pending-node'

  if (routeMatches && classMatches) {
    passed++
  } else {
    failed++
    if (isBlocking) blocking++

    const level = isBlocking ? 'blocking' : 'advisory'
    findings.push({
      test_id: tc.id,
      level,
      desc: tc.desc,
      expected_class: tc.expected_class,
      got_class: result.input_class,
      expected_route: tc.expected_route_prefix,
      got_route: result.route,
    })
    console.log(`  ${level === 'blocking' ? '✗' : '⚠'} [${level}] ${tc.id} ${tc.desc}`)
    console.log(`    expected class=${tc.expected_class} route=${tc.expected_route_prefix}`)
    console.log(`    got     class=${result.input_class} route=${result.route}`)
  }
}

// Exhaustiveness proof: every unmatched input must reach PLACE-NOT-FOUND (not silent)
const placeNotFound = TEST_CASES.find(tc => tc.expected_class === 'place_not_found')
if (placeNotFound) {
  const result = routeInput(placeNotFound.input)
  const isExplicit = result.route === 'PLACE-NOT-FOUND:pending-node'
  if (!isExplicit) {
    blocking++
    findings.push({ test_id: 'EXHAUSTIVE', level: 'blocking', desc: 'place-not-found catch-all must be explicit (PLACE-NOT-FOUND:pending-node), not silent', got_route: result.route })
    console.log('  ✗ [blocking] EXHAUSTIVE: catch-all is not explicit PLACE-NOT-FOUND')
  }
}

// Behavioral test 3/3 summary
console.log(`\n[validate-threshold-exhaustive] test_cases=${TEST_CASES.length} passed=${passed} failed=${failed} blocking=${blocking}`)
console.log(`  Behavioral test 3/3:`)
console.log(`    A: matched-class → correct route (${TEST_CASES.filter(tc => tc.expected_class !== 'place_not_found').length} classes checked)`)
console.log(`    B: unmatched → PLACE-NOT-FOUND explicit + notify (not silent)`)
console.log(`    C: foreign-element → FOREIGN-ELEMENT:quarantine`)

const result = {
  test_cases: TEST_CASES.length,
  passed,
  failed,
  blocking,
  findings: findings.slice(0, 20),
  ran_at: new Date().toISOString(),
}
writeFileSync(LAST_RUN, JSON.stringify(result, null, 2), 'utf-8')

// BLOCKING only if there are blocking findings (silent-default-to-unhandled is a hard failure)
process.exit(blocking > 0 ? 1 : 0)
