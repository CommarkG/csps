#!/usr/bin/env node
/**
 * route-input-wrapper.mjs — M6+M8 S071 PART 2 thin wrapper
 * @csps-dna core_spine: ARCH
 *
 * Called by user-prompt-submit-intake.sh to route each input through routeInput()
 * + selectPersonas() using environment variables (avoids bash quoting issues).
 * M8: reads brownout-state.yaml and passes brownout param (stateless pattern —
 * file I/O happens once here, not inside routeInput, keeping the router pure).
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
import { readFileSync, existsSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(process.cwd())
const content = process.env.ROUTE_CONTENT || ''
const type = process.env.ROUTE_TYPE || 'governor_directive'
const spine = process.env.ROUTE_SPINE || 'GVRN'
const urgency = process.env.ROUTE_URGENCY || 'medium'
const scope = process.env.ROUTE_SCOPE || 'tactical'
const shapeTier = process.env.ROUTE_SHAPE === 'true'

// M8: Read brownout-state.yaml ONCE here (stateless pattern — not inside routeInput)
let brownout = false
try {
  const brownoutPath = join(ROOT, 'tools/data/brownout-state.yaml')
  if (existsSync(brownoutPath)) {
    const raw = readFileSync(brownoutPath, 'utf-8')
    brownout = /active:\s*true/i.test(raw)
  }
} catch { /* if unreadable, brownout stays false (safe default) */ }

try {
  const result = routeInput({ type, spine, urgency, scope, content, shapeTier, brownout })

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
