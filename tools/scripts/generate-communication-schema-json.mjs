#!/usr/bin/env node
/**
 * generate-communication-schema-json.mjs
 * @csps-dna
 * core_spine: ARCH
 *
 * Converts communication-schema.yaml → apps/csps-playground/src/data/communication-schema.json
 *
 * GUARDRAIL: JSON is a DERIVED artifact. YAML is the SSoT.
 * - NEVER hand-edit the JSON output
 * - The JSON is marked GENERATED at the top
 * - Run this script after any YAML change, then commit the JSON alongside the YAML
 *
 * Usage: node tools/scripts/generate-communication-schema-json.mjs
 *
 * Why: Vercel builds from the submodule repo only; parent-repo files aren't
 * accessible in the serverless bundle. The JSON is committed into the submodule
 * so Vercel can read it at request time.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import yaml from 'js-yaml'

const ROOT = process.cwd()
const SOURCE = join(ROOT, 'docs/plan/pillar-0-governance/communication-spine/communication-schema.yaml')
const OUTPUT = join(ROOT, 'apps/csps-playground/src/data/communication-schema.json')

if (!existsSync(SOURCE)) {
  console.error(`[generate-communication-schema-json] ERROR: source not found: ${SOURCE}`)
  process.exit(1)
}

const raw = readFileSync(SOURCE, 'utf-8')

// Split frontmatter from body (schema has frontmatter between first two ---)
const parts = raw.split(/^---\s*$/m)
const body = parts.length >= 3 ? parts.slice(2).join('---') : raw

// Parse the YAML body
let schemaData
try {
  schemaData = yaml.load(body)
} catch (err) {
  console.error(`[generate-communication-schema-json] YAML parse error: ${err.message}`)
  process.exit(1)
}

if (!schemaData || !schemaData.situations) {
  console.error(`[generate-communication-schema-json] ERROR: no situations found in parsed YAML`)
  process.exit(1)
}

// Extract version + status from frontmatter
const versionMatch = raw.match(/^version:\s*["']?([^\n"']+)["']?/m)
const statusMatch = raw.match(/^status:\s*(\S+)/m)

const output = {
  _generated: true,
  _generated_at: new Date().toISOString(),
  _source: 'docs/plan/pillar-0-governance/communication-spine/communication-schema.yaml',
  _warning: 'DO NOT HAND-EDIT. Regenerate with: node tools/scripts/generate-communication-schema-json.mjs',
  version: versionMatch?.[1]?.trim() ?? '1.1',
  status: statusMatch?.[1]?.trim() ?? 'draft',
  rawYaml: raw,
  situations: schemaData.situations ?? [],
  audience_hierarchy: schemaData.audience_hierarchy ?? { tiers: [] },
  b_star_contracts_consolidated: schemaData.b_star_contracts_consolidated ?? { contracts: [] },
}

writeFileSync(OUTPUT, JSON.stringify(output, null, 2), 'utf-8')

const stats = {
  situations: output.situations.length,
  tiers: output.audience_hierarchy?.tiers?.length ?? 0,
  contracts: output.b_star_contracts_consolidated?.contracts?.length ?? 0,
}

console.log(`[generate-communication-schema-json] ✓ Generated ${OUTPUT}`)
console.log(`  situations=${stats.situations} tiers=${stats.tiers} contracts=${stats.contracts}`)
console.log(`  version=${output.version} status=${output.status}`)
