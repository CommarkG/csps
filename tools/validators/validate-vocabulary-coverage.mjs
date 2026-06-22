#!/usr/bin/env node
/**
 * validate-vocabulary-coverage.mjs
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields in last-run JSON). All blocking decisions are structural/deterministic (field presence, count checks, schema conformance). Not in any blocking decision path.
 *
 * @csps-dna
 * core_spine: VALD
 * @csps-enforces P-META-028 + vocabulary.md §Dev↔User Glossary (M2 Facet C S071)
 * @behavioral-test-status: tested — tests A/B/C below
 * M2 Facet C (S071) — Dev↔User vocabulary coverage advisory validator
 *
 * STATUS: ADVISORY in S071.
 *
 * What it checks in docs/plan/pillar-0-governance/ (md + yaml files):
 *   - Detects when a CSPS file targeting a user-facing tier (end-user, account-owner-admin,
 *     team-leader) uses a registered dev_term from the glossary WITHOUT a paired user_term
 *     context marker in the same document.
 *   - The glossary source: docs/plan/pillar-0-governance/vocabulary.md §Dev↔User Glossary
 *
 * Test 3/3:
 *   A: file targeting end-user tier uses "tenant" (dev_term) without "workspace" → flag (advisory)
 *   B: file targeting end-user tier uses "workspace" (user_term) → pass
 *   C: file targeting core-developer tier uses "tenant" → pass (core-dev can use dev terms)
 *
 * Audit slug: vocabulary-coverage (registered in audit-runner.md)
 */

import { readFileSync, existsSync, readdirSync, writeFileSync } from 'fs'
import { join, resolve, relative } from 'path'

const ROOT = resolve(process.cwd())
const VOCAB_PATH = join(ROOT, 'docs/plan/pillar-0-governance/vocabulary.md')
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-vocabulary-coverage-last-run.json')
const SCAN_DIRS = ['docs/plan/pillar-0-governance']

// User-facing audience tiers that require user_term translation
const USER_FACING_TIERS = ['end-user', 'account-owner-admin', 'team-leader']

// Parse glossary from vocabulary.md §Dev↔User Glossary table
function parseGlossary() {
  if (!existsSync(VOCAB_PATH)) return []

  const raw = readFileSync(VOCAB_PATH, 'utf-8').replace(/\r\n/g, '\n')
  const glossarySection = raw.match(/## Dev.*?User Glossary\n[\s\S]*?(?=\n## |\n---\n\n##|$)/)?.[0]
  if (!glossarySection) return []

  const entries = []
  // Parse table rows: | canonical | dev_term | user_term | tier_refs |
  const tablePattern = /^\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|$/gm
  let m
  while ((m = tablePattern.exec(glossarySection)) !== null) {
    const canonical = m[1].trim()
    const devTerm = m[2].trim()
    const userTerm = m[3].trim()
    const tierRefs = m[4].trim()

    // Skip header row
    if (canonical === 'canonical_meaning' || canonical.startsWith('-')) continue

    // Extract dev terms (may include backticks and slashes)
    const devTerms = devTerm.split(/[\/·,]/).map(t => t.trim().replace(/`/g, ''))
      .filter(t => t.length > 2 && !t.includes('sample'))

    // Extract user terms
    const userTerms = userTerm.split(/[·,]/).map(t => t.trim().replace(/`/g, ''))
      .filter(t => t.length > 2 && !t.includes('hidden') && !t.includes('internal'))

    if (devTerms.length > 0 && userTerms.length > 0) {
      entries.push({ canonical, devTerms, userTerms, tierRefs })
    }
  }
  return entries
}

function walkDir(dir) {
  if (!existsSync(dir)) return []
  const results = []
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (/node_modules|\.git/.test(entry.name)) continue
      if (entry.isDirectory()) results.push(...walkDir(full))
      else if (entry.isFile() && /\.(md|yaml)$/.test(entry.name)) results.push(full)
    }
  } catch { /* skip unreadable */ }
  return results
}

function isUserFacingFile(content, filePath) {
  // Check if file mentions user-facing tiers prominently
  return USER_FACING_TIERS.some(tier =>
    content.includes(tier) || content.includes(tier.replace('-', '_'))
  )
}

const glossary = parseGlossary()

let files_checked = 0
let findings = 0
let advisory = 0
const all_findings = []

for (const dir of SCAN_DIRS) {
  const files = walkDir(join(ROOT, dir))
  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8').replace(/\r\n/g, '\n')
      files_checked++

      // Only flag files that target user-facing tiers
      if (!isUserFacingFile(content, file)) continue

      for (const entry of glossary) {
        for (const devTerm of entry.devTerms) {
          if (devTerm.length < 3) continue

          // Check if dev term appears in the content
          const devTermRegex = new RegExp(`\\b${devTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
          if (!devTermRegex.test(content)) continue

          // Check if at least one user term is also present (translation exists)
          const hasUserTerm = entry.userTerms.some(ut => {
            const utRegex = new RegExp(`\\b${ut.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
            return utRegex.test(content)
          })

          if (!hasUserTerm) {
            findings++
            advisory++
            const rel = relative(ROOT, file).replace(/\\/g, '/')
            if (all_findings.length < 15) {
              all_findings.push({ file: rel, dev_term: devTerm, canonical: entry.canonical, level: 'advisory' })
              console.log(`  ⚠ [advisory] ${rel}: dev_term "${devTerm}" (${entry.canonical}) in user-facing context without user_term translation`)
              console.log(`    Fix: add user_term "${entry.userTerms[0]}" where the audience is user-facing, or scope the content to developer tiers`)
            }
            break // One finding per entry per file
          }
        }
      }
    } catch { /* skip unreadable files */ }
  }
}

const summary = `[validate-vocabulary-coverage] files_checked=${files_checked} glossary_entries=${glossary.length} findings=${findings} advisory=${advisory} blocking=0 (advisory S071)`
console.log(summary)

const result = {
  files_checked,
  glossary_entries: glossary.length,
  findings,
  advisory,
  blocking: 0,
  all_findings: all_findings.slice(0, 20),
  ran_at: new Date().toISOString(),
}
writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2), 'utf-8')

// ADVISORY — exit 0
process.exit(0)
