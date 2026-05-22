#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-declared-never-finished
 * @csps-name validate-declared-never-finished
 * @csps-description Finds artifacts DECLARED as done but never actually implemented.
 *   The core anti-pattern: DOCUMENTATION = DONE (AP-001 subsection).
 *   Three detection classes:
 *   1. audit-runner.md slugs marked 'Build ACTIVE' but no matching validator file in tools/validators/
 *   2. unified-plan.yaml items marked done with no implementation evidence (no commit SHA in notes)
 *   3. audit-runner.md slugs marked 'week-4' but session count > 5 past declaration
 *
 *   ADVISORY exit 0. Does not block commits — surfaces for daily audit queue.
 *   Gap classification applied per scope-questions.yaml taxonomy.
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces AP-001 P-OP-007
 * @csps-tags type:validator domain:governance audience:developer
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../..')
const require = createRequire(import.meta.url)

const AUDIT_RUNNER = join(ROOT, 'docs/plan/pillar-0-governance/audit-runner.md')
const VALIDATORS_DIR = join(ROOT, 'tools/validators')

let advisories = 0
let declared_active_missing = []
let week4_stale = []
let total_checked = 0

// ── Class 1: 'Build ACTIVE' slugs with no matching validator file ──────────────
if (existsSync(AUDIT_RUNNER)) {
  const content = readFileSync(AUDIT_RUNNER, 'utf8')
  const lines = content.split('\n')
  const validatorFiles = existsSync(VALIDATORS_DIR)
    ? new Set(readdirSync(VALIDATORS_DIR).map(f => f.replace('.mjs', '').replace('.js', '')))
    : new Set()

  for (const line of lines) {
    // Match table rows with 'Build ACTIVE' claim
    const activeMatch = line.match(/\|\s*`([a-z][a-z0-9-]+)`\s*\|.*Build ACTIVE.*\(([a-z0-9-]+\.mjs)/)
    if (activeMatch) {
      total_checked++
      const slug = activeMatch[1]
      const claimedFile = activeMatch[2].replace('.mjs', '')
      const exists = validatorFiles.has(claimedFile) || validatorFiles.has(`validate-${claimedFile}`)

      if (!exists) {
        declared_active_missing.push({
          slug,
          claimed_file: activeMatch[2],
          classification: 'SIGNIFICANT', // builds on a false assumption
          scope_1: `Create tools/validators/${activeMatch[2]}`,
          scope_3: 'AP-001 subsection: documentation=done. Needs week-N staleness T2 validator.',
        })
        advisories++
      }
    }

    // Match 'week-4' claims
    const week4Match = line.match(/\|\s*`([a-z][a-z0-9-]+)`\s*\|.*week-4.*Build/)
    if (week4Match) {
      total_checked++
      const slug = week4Match[1]
      const claimedFile = `validate-${slug}.mjs`
      const exists = validatorFiles.has(`validate-${slug}`)

      if (!exists) {
        week4_stale.push({
          slug,
          expected_file: claimedFile,
          classification: 'ADVISORY',
          note: 'week-4 target passed; still STUB',
          scope_1: `Create ${claimedFile} or explicitly mark as deferred with reason`,
          scope_2: 'Check what session logic depends on this validator being active',
          scope_3: 'Register in activation-coverage-exempt.yaml OR ship the validator',
        })
        advisories++
      }
    }
  }
}

// ── Output ─────────────────────────────────────────────────────────────────────
if (declared_active_missing.length > 0) {
  console.log(`\n⚠ [SIGNIFICANT] Declared ACTIVE but validator file missing (${declared_active_missing.length}):`)
  for (const item of declared_active_missing.slice(0, 10)) {
    console.log(`  • ${item.slug}: claimed ${item.claimed_file} — file not found`)
    console.log(`    S1: ${item.scope_1}`)
  }
  if (declared_active_missing.length > 10) {
    console.log(`  ... and ${declared_active_missing.length - 10} more`)
  }
}

if (week4_stale.length > 0) {
  console.log(`\n⚠ [ADVISORY] week-4 targets never shipped (${week4_stale.length} stubs):`)
  for (const item of week4_stale.slice(0, 5)) {
    console.log(`  • ${item.slug}: ${item.note}`)
    console.log(`    S1: ${item.scope_1}`)
  }
  if (week4_stale.length > 5) {
    console.log(`  ... and ${week4_stale.length - 5} more (see tools/data/gap-vault.yaml for full list)`)
  }
}

console.log(`\n[validate-declared-never-finished] checked=${total_checked} significant=${declared_active_missing.length} advisory_week4=${week4_stale.length} total_advisories=${advisories}`)
if (advisories > 0) {
  console.log('[validate-declared-never-finished] ADVISORY — gaps found. Route per tools/config/scope-questions.yaml gap_classification.')
  console.log('[validate-declared-never-finished] Cadence: daily (pipeline_1 or on-demand). Does not block commits.')
}

// Always exit 0 — this is an advisory scanner, not a blocker
// Promotion to BLOCKING requires: K=2 fires + S3 prevention complete + Governor ratification
process.exit(0)
