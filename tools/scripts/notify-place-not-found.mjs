#!/usr/bin/env node
/**
 * notify-place-not-found.mjs
 * @csps-dna
 * core_spine: OPER
 * @csps-enforces PROTO-S068-PART-2-THRESHOLD-COMPLETE STEP 2 — place-not-found route
 * M7 S071 PART 2 STEP 2 — place-not-found visible terminal
 *
 * Called by threshold-router.mjs when PLACE-NOT-FOUND:pending-node is returned.
 * Appends a FLAGGED_TO_THRESHOLD entry to tools/data/pending-plan-items.yaml.
 * per B_TEMPLATE_OR_FLAG principle: "never silently vanish an unmatched input."
 *
 * Usage: node tools/scripts/notify-place-not-found.mjs --content="..." --session="S071"
 * OR: import { notifyPlaceNotFound } from './notify-place-not-found.mjs'
 */

import { readFileSync, existsSync, appendFileSync, mkdirSync } from 'fs'
import { join, resolve, dirname } from 'path'

const ROOT = resolve(process.cwd())
const PENDING_NODES = join(ROOT, 'tools/data/pending-plan-items.yaml')

/**
 * notifyPlaceNotFound — append FLAGGED_TO_THRESHOLD entry to pending-nodes register.
 * Visible terminal: Opus review queue + weekly cron escalation.
 * Never silently drops the input.
 *
 * @param {{ content: string, session: string, criticality: string, rationale: string }} opts
 * @returns {string} — the entry id
 */
export function notifyPlaceNotFound({ content = '', session = 'unknown', criticality = 'SHEDDABLE_PLUS', rationale = '' } = {}) {
  const ts = new Date().toISOString()
  const id = `pnf-${session}-${Date.now()}`
  const preview = content.slice(0, 80).replace(/["'\\]/g, '-')

  const entry = [
    `  - id: "${id}"`,
    `    pending_type: FLAGGED_TO_THRESHOLD`,
    `    timestamp: "${ts}"`,
    `    session: "${session}"`,
    `    criticality: "${criticality}"`,
    `    status: pending_review`,
    `    content_preview: "${preview}"`,
    `    rationale: "${rationale.slice(0, 120).replace(/["\\]/g, '-')}"`,
    `    next_action: Opus review at next session open`,
  ].join('\n') + '\n'

  try {
    mkdirSync(dirname(PENDING_NODES), { recursive: true })
    appendFileSync(PENDING_NODES, entry, 'utf-8')
    console.log(`[place-not-found] VISIBLE: ${id} → pending-nodes register (Opus review queue)`)
    console.log(`[place-not-found] criticality=${criticality} content="${preview}"`)
  } catch (e) {
    console.error(`[place-not-found] ERROR: could not write to pending-nodes: ${e.message}`)
  }

  return id
}

// CLI mode
if (process.argv[1]?.endsWith('notify-place-not-found.mjs')) {
  const args = Object.fromEntries(
    process.argv.slice(2)
      .filter(a => a.startsWith('--'))
      .map(a => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=')] })
  )
  const id = notifyPlaceNotFound({
    content: args.content || '',
    session: args.session || 'unknown',
    criticality: args.criticality || 'SHEDDABLE_PLUS',
    rationale: args.rationale || 'place-not-found: no class matched',
  })
  console.log(`[place-not-found] entry id: ${id}`)
}
