#!/usr/bin/env node
/**
 * generate-journey-doctrine-json.mjs
 * @csps-dna
 * core_spine: ARCH
 *
 * Converts JOURNEY-DOCTRINE.md → apps/csps-playground/src/data/journey-doctrine.json
 *
 * GUARDRAIL: JSON is a DERIVED artifact. JOURNEY-DOCTRINE.md is the SSoT.
 * Run after any doctrine change: node tools/scripts/generate-journey-doctrine-json.mjs
 *
 * Usage: node tools/scripts/generate-journey-doctrine-json.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT = process.cwd()
const SOURCE = join(ROOT, 'docs/plan/pillar-0-governance/JOURNEY-DOCTRINE.md')
const OUTPUT = join(ROOT, 'apps/csps-playground/src/data/journey-doctrine.json')

if (!existsSync(SOURCE)) {
  console.error(`[generate-journey-doctrine-json] ERROR: source not found: ${SOURCE}`)
  process.exit(1)
}

const raw = readFileSync(SOURCE, 'utf-8').replace(/\r\n/g, '\n')

// Remove frontmatter
const bodyStart = raw.indexOf('\n---\n', 4) + 4
const body = raw.slice(bodyStart)

// Extract §N sections
const sections = []
const sectionPattern = /^## (§\d+ — [^\n]+)\n([\s\S]*?)(?=^## |$)/gm
let m
while ((m = sectionPattern.exec(body)) !== null) {
  const title = m[1].trim()
  const content = m[2].trim()
  const num = parseInt(title.match(/§(\d+)/)?.[1] ?? '0')
  sections.push({ num, title, content })
}

// Extract comms demos section (matches from header to next --- or ## or end)
const demosMatch = body.match(/## COMMUNICATION CORE — 4 DEMONSTRATIONS\n([\s\S]*?)(?=\n---\n|\n## Scope|$)/)
const demosRaw = demosMatch?.[1]?.trim() ?? ''

// Parse individual demos — split on **Demo N lines
const demos = []
const demoBlocks = demosRaw.split(/\n(?=\*\*Demo \d+)/)
for (const block of demoBlocks) {
  const headerMatch = block.match(/^\*\*Demo (\d+) — (.+?)\*\*\n([\s\S]*)/)
  if (headerMatch) {
    demos.push({
      num: parseInt(headerMatch[1]),
      title: headerMatch[2].trim(),
      content: headerMatch[3].trim(),
    })
  }
}

// Extract scope table
const scopeMatch = body.match(/## Scope: Platform-Wide Applications\n([\s\S]*?)(?=^## |---\n|$)/m)
const scopeRaw = scopeMatch?.[1]?.trim() ?? ''

// Extract version from frontmatter
const versionMatch = raw.match(/^version:\s*["']?([^\n"']+)["']?/m)
const statusMatch = raw.match(/^status:\s*(\S+)/m)

const output = {
  _generated: true,
  _generated_at: new Date().toISOString(),
  _source: 'docs/plan/pillar-0-governance/JOURNEY-DOCTRINE.md',
  _warning: 'DO NOT HAND-EDIT. Regenerate: node tools/scripts/generate-journey-doctrine-json.mjs',
  version: versionMatch?.[1]?.trim() ?? '1.0',
  status: statusMatch?.[1]?.trim() ?? 'draft',
  sections,
  comms_demos: demos,
  scope_table_raw: scopeRaw,
  rawMarkdown: raw,
}

writeFileSync(OUTPUT, JSON.stringify(output, null, 2), 'utf-8')

console.log(`[generate-journey-doctrine-json] ✓ Generated ${OUTPUT}`)
console.log(`  sections=${sections.length} comms_demos=${demos.length} version=${output.version}`)
