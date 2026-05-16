#!/usr/bin/env node
// validate-active-protocol.mjs — S036-PROTO (Turn 67)
// Reads tools/session-state.json, checks active_directive field.
// ADVISORY if no protocol registered (Sonnet working without tracking).
// BLOCKING if two protocol_ids are simultaneously active.
//
// Protocol format in session-state.json:
//   "active_directive": { "owner": "sonnet", "protocol_id": "PROTO-001",
//                         "step": 1, "started_at": "...", "status": "in-progress" }
//
// Wired: tools/verify.mjs cycle 'active_protocol_compliance'
// Slug: 'active-protocol-compliance' in audit-runner.md

import { readFileSync, existsSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(process.cwd())
const STATE_FILE = join(ROOT, 'tools/session-state.json')

if (!existsSync(STATE_FILE)) {
  console.log('[validate-active-protocol] session-state.json not found — skipping')
  process.exit(0)
}

let state
try {
  state = JSON.parse(readFileSync(STATE_FILE, 'utf8'))
} catch (e) {
  console.log('[validate-active-protocol] Cannot parse session-state.json:', e.message)
  process.exit(0)
}

const directive = state.active_directive

// Check 1: No active directive registered (advisory — work may be happening without tracking)
if (!directive || !directive.protocol_id) {
  console.log('[validate-active-protocol] ⚠ ADVISORY: No active_directive registered in session-state.json')
  console.log('  Add active_directive: { protocol_id, owner, step, status: "in-progress" }')
  console.log('[validate-active-protocol] advisory=1 blocking=0')
  process.exit(0)
}

// Check 2: Status check
if (directive.status === 'complete') {
  console.log(`[validate-active-protocol] ✓ Protocol ${directive.protocol_id} step ${directive.step} is complete`)
  console.log('[validate-active-protocol] advisory=0 blocking=0')
  process.exit(0)
}

if (directive.status === 'in-progress') {
  // Check if there's a second active directive (blocking)
  const secondDirective = state.secondary_directive
  if (secondDirective && secondDirective.status === 'in-progress') {
    console.log(`[validate-active-protocol] ✗ BLOCKING: Two protocols simultaneously active:`)
    console.log(`  Primary:   ${directive.protocol_id} step ${directive.step} (${directive.owner})`)
    console.log(`  Secondary: ${secondDirective.protocol_id} step ${secondDirective.step} (${secondDirective.owner})`)
    console.log('  Fix: Complete primary before starting secondary. No parallel pipelines.')
    console.log('[validate-active-protocol] advisory=0 blocking=1')
    process.exit(1)
  }

  console.log(`[validate-active-protocol] ✓ Protocol ${directive.protocol_id} step ${directive.step} in-progress (${directive.owner})`)
  console.log('[validate-active-protocol] advisory=0 blocking=0')
  process.exit(0)
}

// Unknown status
console.log(`[validate-active-protocol] ⚠ ADVISORY: active_directive.status="${directive.status}" — expected in-progress|complete`)
console.log('[validate-active-protocol] advisory=1 blocking=0')
process.exit(0)
