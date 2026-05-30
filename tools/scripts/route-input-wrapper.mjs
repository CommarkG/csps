#!/usr/bin/env node
/**
 * route-input-wrapper.mjs — M6 S071 PART 2 thin wrapper
 * @csps-dna core_spine: ARCH
 *
 * Called by user-prompt-submit-intake.sh to route each input through routeInput()
 * + selectPersonas() using environment variables (avoids bash quoting issues).
 *
 * Env vars read:
 *   ROUTE_CONTENT  — input content (first 200 chars sample)
 *   ROUTE_TYPE     — classification type (governor_directive | proposal | question | ...)
 *   ROUTE_SPINE    — GVRN | ARCH | AI | OPER | VALD
 *   ROUTE_URGENCY  — high | medium | low
 *   ROUTE_SCOPE    — constitutional | architectural | operational | tactical
 *   ROUTE_SHAPE    — "true" for fast-path conversational
 *
 * Outputs: JSON { route, rationale, axis_classification, personas_matched }
 *
 * Per PROTO-S068-PART-2-THRESHOLD-COMPLETE STEP 1 — the 4/532 fix.
 * Numbers are sample/tunable per P-META-028 cornerstone.
 */

import { routeInput, selectPersonas } from './threshold-router.mjs'

const content = process.env.ROUTE_CONTENT || ''
const type = process.env.ROUTE_TYPE || 'governor_directive'
const spine = process.env.ROUTE_SPINE || 'GVRN'
const urgency = process.env.ROUTE_URGENCY || 'medium'
const scope = process.env.ROUTE_SCOPE || 'tactical'
const shapeTier = process.env.ROUTE_SHAPE === 'true'

try {
  const result = routeInput({ type, spine, urgency, scope, content, shapeTier })

  // Compose with Facet E selectPersonas() — stateless, empty when no match
  const personas_matched = selectPersonas({
    classificationClass: type,
    scope,
    urgency,
    content,
  })

  const output = {
    ...result,
    personas_matched,
    input_type: type,
    routed: true,
  }

  process.stdout.write(JSON.stringify(output))
} catch (e) {
  process.stdout.write(JSON.stringify({ route: 'PROCESS-NOW', rationale: 'wrapper-error', routed: false }))
}
