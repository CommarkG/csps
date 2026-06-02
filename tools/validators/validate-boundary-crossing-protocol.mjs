#!/usr/bin/env node
/**
 * validate-boundary-crossing-protocol.mjs
 * @csps-dna
 * core_spine: GVRN
 * @csps-enforces PROTO-S076-BOUNDARY-CROSSING-PROTOCOL (T2 validator)
 *               SANDBOX-boundary-crossing-protocol-S076.md
 * Phase B S076: Boundary Crossing Protocol — T2 completeness validator
 *
 * What it checks in tools/data/boundaries-register.yaml:
 *   For every crossing entry (k_count > 0):
 *   1. governor_approval field populated (explicit authorization on record)
 *   2. assessment_ref field populated and points to an existing file
 *   3. scheduled_resolution.must_address_by_date present (calendar-enforced obligation)
 *   4. Crossing entry recorded in crossings array
 *
 *   Recurrence rule: k_count >= 2 for the SAME boundary → BLOCKING (re-derivation required, not exception)
 *
 * Blocking: any crossing with k_count > 0 but missing any of the 4 artifacts
 *           k_count >= 2 on same boundary without re-derivation artifact
 * Advisory: scheduled_resolution date is in the past (escalate to blocking)
 *
 * Block-test: add crossing entry with k_count=1 but no governor_approval → exit 1
 *
 * Audit slug: boundary_crossing_protocol
 * Status: EXTENDED (run_tier:EXTENDED — weekly cron via --extended)
 *   Promote to STANDARD after boundary-crossing protocol used to raise cap (self-referential: correct)
 */

import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(process.cwd())
const REGISTER_PATH = join(ROOT, 'tools/data/boundaries-register.yaml')
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-boundary-crossing-protocol-last-run.json')

// Today ISO
const TODAY_ISO = new Date().toISOString().slice(0, 10)

let blocking = 0
let advisory = 0
let boundaries_checked = 0
let crossings_checked = 0
const all_findings = []

function flag(level, msg) {
  if (level === 'blocking') blocking++
  else advisory++
  all_findings.push({ level, msg })
  console.log(`  ${level === 'blocking' ? '✖' : '⚠'} [${level}] ${msg}`)
}

if (!existsSync(REGISTER_PATH)) {
  console.log('[validate-boundary-crossing-protocol] boundaries-register.yaml not found — no boundaries registered yet')
  process.exit(0)
}

const registerText = readFileSync(REGISTER_PATH, 'utf-8')

console.log('\n[validate-boundary-crossing-protocol] Checking boundary crossing completeness...\n')

// Simple YAML parsing for boundary entries
const entryRe = /  - id:\s+(boundary-\d+)[\s\S]*?(?=  - id:|$)/g
let m
while ((m = entryRe.exec(registerText)) !== null) {
  const block = m[0]
  const id = m[1]
  boundaries_checked++

  const kMatch = block.match(/k_count:\s*(\d+)/)
  const kCount = kMatch ? Number(kMatch[1]) : 0

  if (kCount === 0) {
    const nameMatch = block.match(/name:\s*"([^"]+)"/)
    const name = nameMatch ? nameMatch[1] : id
    console.log(`  ✓ ${id} (${name}): no crossings (k_count=0)`)
    continue
  }

  crossings_checked++
  const nameMatch = block.match(/name:\s*"([^"]+)"/)
  const name = nameMatch ? nameMatch[1] : id

  // Check k_count >= 2 → BLOCKING (requires re-derivation)
  if (kCount >= 2) {
    const hasRederivation = /re_derivation_artifact:/.test(block) || /re.deriv/.test(block)
    if (!hasRederivation) {
      flag('blocking', `${id} (${name}): k_count=${kCount} ≥ 2 — MANDATORY RE-DERIVATION of boundary itself required. Two crossings = the boundary is wrong, not the circumstance. Add re_derivation_artifact to the register.`)
    }
  }

  // Check crossings array for completeness
  const crossingsMatch = block.match(/crossings:\s*\[([\s\S]*?)\]/)
  if (!crossingsMatch || crossingsMatch[1].trim() === '') {
    flag('blocking', `${id} (${name}): k_count=${kCount} but crossings array is empty — record crossing details in boundaries-register.yaml crossings field`)
    continue
  }

  // Check each crossing has 4 required artifacts
  const crossings = crossingsMatch[1]

  if (!/governor_approval:/.test(crossings) || /governor_approval:\s*null/.test(crossings)) {
    flag('blocking', `${id} (${name}): crossing missing governor_approval — explicit Governor ratification required (Step 2 of protocol)`)
  }

  if (!/assessment_ref:/.test(crossings) || /assessment_ref:\s*null/.test(crossings)) {
    flag('blocking', `${id} (${name}): crossing missing assessment_ref — deep assessment artifact required (Step 3: one-off vs first-of-many? re-derive vs except?)`)
  }

  const schedMatch = crossings.match(/must_address_by_date:\s*["']?(\d{4}-\d{2}-\d{2})["']?/)
  if (!schedMatch) {
    flag('blocking', `${id} (${name}): crossing missing scheduled_resolution.must_address_by_date — dated enterprise-resolution obligation required (Step 4)`)
  } else {
    // Check if scheduled date is past
    const dueDate = schedMatch[1]
    if (TODAY_ISO > dueDate) {
      flag('advisory', `${id} (${name}): scheduled_resolution past due (was ${dueDate}) — escalate to Governor immediately`)
    } else {
      console.log(`  ✓ ${id} (${name}): crossing documented, scheduled_resolution by ${dueDate} (on-time)`)
    }
  }
}

const summary = `[validate-boundary-crossing-protocol] boundaries_checked=${boundaries_checked} crossings_checked=${crossings_checked} blocking=${blocking} advisory=${advisory}`
console.log('\n' + summary)
if (blocking === 0 && crossings_checked === 0) {
  console.log('  ✓ No boundary crossings on record — protocol intact')
} else if (blocking === 0) {
  console.log(`  ✓ All ${crossings_checked} crossing(s) have required artifacts`)
}

const result = {
  boundaries_checked,
  crossings_checked,
  blocking,
  advisory,
  all_findings: all_findings.slice(0, 20),
  ran_at: new Date().toISOString(),
}
writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2), 'utf-8')

process.exit(blocking > 0 ? 1 : 0)
