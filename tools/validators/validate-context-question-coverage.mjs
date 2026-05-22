#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-context-question-coverage
 * @csps-name validate-context-question-coverage
 * @csps-description T2 advisory for documentation-in-schema. Scans all governed .md files
 *   and checks whether frontmatter includes context_question field.
 *   documentation-in-schema: every artifact should answer "what must be verified before using this?"
 *   Advisory exit 0 — surfaces missing fields for gradual adoption.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces documentation-in-schema
 * @csps-tags type:validator domain:governance audience:developer
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { resolve, dirname, join, extname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../..')

const SCAN_DIRS = ['docs', 'tools']
const SKIP_PATTERNS = [
  /node_modules/,
  /_handoff[\/\\]VAULT/,
  /apps[\/\\]/,
  /\.next[\/\\]/,
  /dist[\/\\]/,
  /build[\/\\]/,
  /behavioral-contracts[\/\\]B_/,  // individual slice files — covered by shard
  /principles[\/\\]P-/,             // principle slices
  /audit-runner[\/\\]/,             // pipeline slices
]

function shouldSkip(filePath) {
  return SKIP_PATTERNS.some(p => p.test(filePath))
}

function hasFrontmatter(content) {
  return content.startsWith('---\n') || content.startsWith('---\r\n')
}

function hasContextQuestion(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/m)
  if (!match) return false
  return /^context_question\s*:/m.test(match[1])
}

function scanDir(dir, results) {
  if (!existsSync(dir)) return
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    const relPath = relative(ROOT, fullPath)
    if (shouldSkip(relPath)) continue
    if (entry.isDirectory()) {
      scanDir(fullPath, results)
    } else if (entry.isFile() && extname(entry.name) === '.md') {
      try {
        const content = readFileSync(fullPath, 'utf8')
        if (!hasFrontmatter(content)) continue
        const hasCQ = hasContextQuestion(content)
        results.total++
        if (hasCQ) {
          results.with_cq++
        } else {
          results.without_cq.push(relPath)
        }
      } catch { /* skip unreadable files */ }
    }
  }
}

const results = { total: 0, with_cq: 0, without_cq: [] }

for (const dir of SCAN_DIRS) {
  scanDir(join(ROOT, dir), results)
}

const pct = results.total > 0 ? Math.round(100 * results.with_cq / results.total) : 0

// Show a sample of missing files (not all — too noisy)
const SHOW_LIMIT = 15
const shown = results.without_cq.slice(0, SHOW_LIMIT)
for (const f of shown) {
  console.log(`  ⚠ [context_question] MISSING: ${f}`)
}
if (results.without_cq.length > SHOW_LIMIT) {
  console.log(`  ... and ${results.without_cq.length - SHOW_LIMIT} more (run with --all to see full list)`)
}

console.log(`[validate-context-question-coverage] context_question coverage: ${results.with_cq}/${results.total} governed files (${pct}%)`)
if (results.without_cq.length > 0) {
  console.log(`[validate-context-question-coverage] ADVISORY — ${results.without_cq.length} governed files missing context_question`)
  console.log(`[validate-context-question-coverage] Add context_question: "Before [using this], what must be verified about [key assumption]?"`)
}

process.exit(0) // Always advisory
