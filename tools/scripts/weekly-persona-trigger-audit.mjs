#!/usr/bin/env node
/**
 * weekly-persona-trigger-audit.mjs
 * @csps-dna
 * core_spine: VALD
 * @csps-enforces M4 Facet E S071 — Persona trigger audit
 *
 * Once-weekly: "did the persona trigger_criteria fire when they should?"
 * Reports:
 *   - false_negatives: routing entries where INVOKE:<skill> was used but
 *     selectPersonas() would NOT have matched (criteria too strict)
 *   - false_positives: routing entries where selectPersonas() WOULD match
 *     but the actual route did NOT use INVOKE (criteria too broad)
 *
 * Data source: tools/data/threshold-intake-log.yaml (routing history)
 * Persona criteria source: threshold-router.mjs PERSONA_CRITERIA registry
 *
 * Usage: node tools/scripts/weekly-persona-trigger-audit.mjs
 * Schedule: weekly cron (manual for now; automation in WIRING PASS)
 *
 * Numbers are sample/tunable per P-META-028 cornerstone.
 */

import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { selectPersonas } from './threshold-router.mjs'

const ROOT = resolve(process.cwd())
const INTAKE_LOG = join(ROOT, 'tools/data/threshold-intake-log.yaml')
const LAST_RUN = join(ROOT, 'tools/data/weekly-persona-trigger-audit-last-run.json')

// Parse threshold-intake-log.yaml (simple text extraction — no js-yaml dependency)
function parseIntakeLog() {
  if (!existsSync(INTAKE_LOG)) return []

  const raw = readFileSync(INTAKE_LOG, 'utf-8').replace(/\r\n/g, '\n')
  const entries = []

  // Each entry starts with "- " and contains route:, class:, content:
  const blocks = raw.split(/\n- /).slice(1)
  for (const block of blocks) {
    const entry = {}
    const routeM = block.match(/route:\s*["']?([^\n"']+)["']?/)
    const classM = block.match(/class(?:ification)?:\s*["']?([^\n"']+)["']?/)
    const contentM = block.match(/content(?:_preview)?:\s*["']?([^\n"']+)["']?/)
    const scopeM = block.match(/scope:\s*["']?([^\n"']+)["']?/)
    const urgencyM = block.match(/urgency:\s*["']?([^\n"']+)["']?/)

    if (routeM) entry.route = routeM[1].trim()
    if (classM) entry.classificationClass = classM[1].trim()
    if (contentM) entry.content = contentM[1].trim()
    if (scopeM) entry.scope = scopeM[1].trim()
    if (urgencyM) entry.urgency = urgencyM[1].trim()

    if (entry.route) entries.push(entry)
  }
  return entries
}

const entries = parseIntakeLog()
const false_negatives = []  // should have invoked persona but didn't
const false_positives = []  // selectPersonas matches but actual route didn't INVOKE

let checked = 0

for (const entry of entries) {
  checked++
  const { route = '', classificationClass = '', content = '', scope = '', urgency = '' } = entry

  // What personas does selectPersonas say should fire?
  const shouldFire = selectPersonas({ classificationClass, scope, urgency, content })

  // What skill did the actual route INVOKE (if any)?
  const actualInvokedSkill = route.startsWith('INVOKE:') ? route.slice(7).trim() : null

  // False negative: actual INVOKE used a skill NOT in shouldFire
  if (actualInvokedSkill && !shouldFire.includes(actualInvokedSkill)) {
    false_negatives.push({
      actual_route: route,
      expected_by_criteria: shouldFire,
      entry_preview: content.slice(0, 80),
      diagnostic: `Actual route invoked ${actualInvokedSkill} but selectPersonas returned [${shouldFire.join(', ')}] — criteria may be too strict for this pattern`,
    })
  }

  // False positive: shouldFire has skills but actual route didn't INVOKE any
  if (shouldFire.length > 0 && !actualInvokedSkill) {
    false_positives.push({
      actual_route: route,
      would_have_invoked: shouldFire,
      entry_preview: content.slice(0, 80),
      diagnostic: `selectPersonas matched [${shouldFire.join(', ')}] but actual route was ${route} — criteria may be too broad or INVOKE was intentionally skipped`,
    })
  }
}

// Report
const total_entries = entries.length
const persona_invocations = entries.filter(e => e.route?.startsWith('INVOKE:')).length

console.log(`\n[weekly-persona-trigger-audit] Weekly report — ${new Date().toISOString().split('T')[0]}`)
console.log(`  entries_checked=${checked} (sample from intake-log — expandable to longer window)`)
console.log(`  persona_invocations=${persona_invocations} false_negatives=${false_negatives.length} false_positives=${false_positives.length}`)

if (false_negatives.length > 0) {
  console.log(`\n  FALSE NEGATIVES (sample — ${false_negatives.length} criteria miss):`)
  false_negatives.slice(0, 5).forEach((fn, i) => {
    console.log(`    [${i + 1}] ${fn.actual_route}: ${fn.diagnostic}`)
  })
}

if (false_positives.length > 0) {
  console.log(`\n  FALSE POSITIVES (sample — ${false_positives.length} criteria over-match):`)
  false_positives.slice(0, 5).forEach((fp, i) => {
    console.log(`    [${i + 1}] ${fp.actual_route}: ${fp.diagnostic}`)
  })
}

if (false_negatives.length === 0 && false_positives.length === 0) {
  console.log('  ✓ No discrepancies found — criteria align with actual routing history')
}

const result = {
  ran_at: new Date().toISOString(),
  entries_checked: checked,
  persona_invocations,
  false_negatives: false_negatives.slice(0, 20),
  false_positives: false_positives.slice(0, 20),
  fn_count: false_negatives.length,
  fp_count: false_positives.length,
  action_needed: false_negatives.length > 3 || false_positives.length > 3,
}
writeFileSync(LAST_RUN, JSON.stringify(result, null, 2), 'utf-8')
console.log(`  → full report: ${LAST_RUN}`)
