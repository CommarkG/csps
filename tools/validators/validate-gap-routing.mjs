#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-gap-routing
 * @csps-name validate-gap-routing
 * @csps-description Reads validate-declared-never-finished output, routes each finding through
 *   scope-questions.yaml classification, and appends to tools/data/gap-vault.yaml.
 *   Advisory exit 0 — surfaces gaps without blocking builds.
 *   Uses P-OP-007 routing: no hysterical overloads; classify → route → vault → schedule.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces AP-001 P-OP-007
 * @csps-tags type:validator domain:governance audience:developer
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../..')
const GAP_VAULT = join(ROOT, 'tools/data/gap-vault.yaml')

// ── Run the declared-never-finished scanner ───────────────────────────────────
let scanOutput = ''
try {
  scanOutput = execSync(`node "${join(__dirname, 'validate-declared-never-finished.mjs')}"`, {
    encoding: 'utf8', cwd: ROOT
  })
} catch (e) {
  // Advisory validator — ignore errors
  scanOutput = e.stdout || ''
}

// ── Parse findings ────────────────────────────────────────────────────────────
const SIGNIFICANT_PATTERN = /⚠ \[SIGNIFICANT\].*?:\n(.*?)(?=⚠|\[validate)/gs
const WEEK4_PATTERN = /• ([a-z][a-z0-9-]+): (week-4 target passed.*?)$/gm
const ACTIVE_PATTERN = /• ([a-z][a-z0-9-]+): claimed (.*?) — file not found/gm

const findings = []
const now = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
const session = 'S051'

// Parse week-4 stubs
let m
while ((m = WEEK4_PATTERN.exec(scanOutput)) !== null) {
  findings.push({
    id: `gap_${now}_${m[1]}`,
    source: 'validate-declared-never-finished',
    finding: `week-4 stub never shipped: ${m[1]}`,
    slug: m[1],
    classification: 'ADVISORY',
    scope_routing: 'S1-next-gate S2-weekly S3-within-3-sessions',
    session_discovered: session,
    status: 'open',
    session_target: 'S053',
  })
}

// Parse Build ACTIVE with no file
while ((m = ACTIVE_PATTERN.exec(scanOutput)) !== null) {
  findings.push({
    id: `gap_${now}_${m[1]}_active`,
    source: 'validate-declared-never-finished',
    finding: `Build ACTIVE claimed but file missing: ${m[1]} (claimed ${m[2]})`,
    slug: m[1],
    classification: 'SIGNIFICANT',
    scope_routing: 'S1-this-session S2-this-session S3-next-session',
    session_discovered: session,
    status: 'open',
    session_target: 'S052',
  })
}

// ── Initialize vault if missing ───────────────────────────────────────────────
if (!existsSync(GAP_VAULT)) {
  const header = `---
id: csps.data.gap-vault
name: gap-vault
description: "Append-only vault of identified gaps. Each entry routed per scope-questions.yaml classification. Never delete entries — mark status: resolved when fixed."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: audit_scheduling
---

# Gap Vault

> Append-only. Every gap found by validate-declared-never-finished (or manually) is logged here.
> Routing: CRITICAL=fix now | SIGNIFICANT=fix this/next session | ADVISORY=weekly | COSMETIC=daily

entries:
`
  writeFileSync(GAP_VAULT, header, 'utf8')
}

// ── Append new findings ───────────────────────────────────────────────────────
let appended = 0
if (findings.length > 0) {
  const vaultContent = readFileSync(GAP_VAULT, 'utf8')
  const newEntries = findings
    .filter(f => !vaultContent.includes(f.slug)) // don't duplicate
    .map(f => `  - id: ${f.id}
    source: ${f.source}
    finding: "${f.finding}"
    classification: ${f.classification}
    scope_routing: "${f.scope_routing}"
    session_discovered: ${f.session_discovered}
    status: ${f.status}
    session_target: ${f.session_target || 'null'}
`)
    .join('\n')

  if (newEntries.length > 0) {
    appendFileSync(GAP_VAULT, newEntries, 'utf8')
    appended = findings.filter(f => !vaultContent.includes(f.slug)).length
  }
}

// ── Output ─────────────────────────────────────────────────────────────────────
const totalFound = findings.length
const significant = findings.filter(f => f.classification === 'SIGNIFICANT').length
const advisory = findings.filter(f => f.classification === 'ADVISORY').length

console.log(`[validate-gap-routing] scan=complete findings=${totalFound} significant=${significant} advisory=${advisory} vaulted=${appended}`)
if (totalFound > 0) {
  console.log(`[validate-gap-routing] ADVISORY — ${totalFound} gap(s) classified and routed. See tools/data/gap-vault.yaml`)
}
process.exit(0) // Advisory always
