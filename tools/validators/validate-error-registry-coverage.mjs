#!/usr/bin/env node
// validate-error-registry-coverage.mjs — S036 (Turn 76 §2)
// For each inner-ai-defaults entry with disposition: override,
// checks if a matching EP-ERR file exists in error-registry/.
// ADVISORY if prevention is undocumented.
//
// Slug: 'error-registry-coverage' in audit-runner.md

import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(process.cwd())
const DEFAULTS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/inner-ai-defaults')
const REGISTRY_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/error-registry')

// Collect all EP-ERR pattern names from registry
function getRegisteredPatterns() {
  if (!existsSync(REGISTRY_DIR)) return new Set()
  const patterns = new Set()
  for (const f of readdirSync(REGISTRY_DIR).filter(f => f.match(/^EP-ERR-/))) {
    const content = readFileSync(join(REGISTRY_DIR, f), 'utf8')
    const m = content.match(/^pattern_name:\s+(.+)$/m)
    if (m) patterns.add(m[1].trim())
  }
  return patterns
}

// Collect override entries from inner-ai-defaults files
function getOverrideEntries() {
  const entries = []
  if (!existsSync(DEFAULTS_DIR)) return entries

  for (const f of readdirSync(DEFAULTS_DIR).filter(f => f.endsWith('.md'))) {
    const content = readFileSync(join(DEFAULTS_DIR, f), 'utf8').replace(/\r/g, '')
    // Look for pattern: + disposition: override pairs
    const blocks = content.split(/^###?\s+/m)
    for (const block of blocks) {
      const patternMatch = block.match(/^pattern:\s+(.+)$/m)
      const dispositionMatch = block.match(/^disposition:\s+override/m)
      if (patternMatch && dispositionMatch) {
        entries.push({ pattern: patternMatch[1].trim(), file: f })
      }
    }
    // Also check YAML code blocks
    const yamlBlocks = content.match(/```ya?ml[\s\S]*?```/g) || []
    for (const yaml of yamlBlocks) {
      const patternMatch = yaml.match(/pattern:\s+(.+)/m)
      const dispositionMatch = yaml.match(/disposition:\s+override/m)
      if (patternMatch && dispositionMatch) {
        entries.push({ pattern: patternMatch[1].trim(), file: f })
      }
    }
  }
  return [...new Map(entries.map(e => [e.pattern, e])).values()]
}

const registered = getRegisteredPatterns()
const overrideEntries = getOverrideEntries()

let advisory = 0
const gaps = []

for (const entry of overrideEntries) {
  if (!registered.has(entry.pattern)) {
    gaps.push(`  ⚠ Pattern '${entry.pattern}' (${entry.file}) has no EP-ERR file`)
    advisory++
  }
}

const covered = overrideEntries.length - advisory

if (advisory === 0) {
  console.log(`[validate-error-registry-coverage] ✓ All ${overrideEntries.length} override patterns have EP-ERR coverage`)
} else {
  console.log(`[validate-error-registry-coverage] ${advisory} override pattern(s) missing EP-ERR documentation:`)
  gaps.slice(0, 10).forEach(g => console.log(g))
  if (gaps.length > 10) console.log(`  ... and ${gaps.length - 10} more`)
  console.log('  Fix: Create EP-ERR-NNN-[pattern-kebab].md in docs/plan/_handoff/VAULT/error-registry/')
}
console.log(`[validate-error-registry-coverage] overrides=${overrideEntries.length} covered=${covered} uncovered=${advisory}`)
process.exit(0) // ADVISORY only
