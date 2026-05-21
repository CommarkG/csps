#!/usr/bin/env node
/**
 * Fixes duplicate lifecycle_state keys in .claude/skills/SKILL.md frontmatter.
 * The backfill-skill-sections.mjs script appended 6-section compliance blocks
 * without checking for existing lifecycle_state in frontmatter, causing duplicates.
 * This script removes the second (duplicate) occurrence within the --- ... --- block.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../..')
const SKILLS_DIR = join(ROOT, '.claude/skills')

const skills = readdirSync(SKILLS_DIR)
let fixed = 0
let skipped = 0

for (const skill of skills) {
  const skillPath = join(SKILLS_DIR, skill, 'SKILL.md')
  if (!existsSync(skillPath)) continue

  const content = readFileSync(skillPath, 'utf-8')

  // Find the frontmatter block
  const fmMatch = content.match(/^(---\n)([\s\S]*?)(\n---)/m)
  if (!fmMatch) { skipped++; continue }

  const fmContent = fmMatch[2]
  const lines = fmContent.split('\n')

  // Find all lifecycle_state lines
  const lcLines = lines
    .map((line, idx) => ({ line, idx }))
    .filter(({ line }) => line.trim().startsWith('lifecycle_state:'))

  if (lcLines.length <= 1) {
    // No duplicate — skip
    skipped++
    continue
  }

  // Remove all but the first lifecycle_state line
  const keepIdx = lcLines[0].idx
  const newLines = lines.filter((_, idx) => {
    const isLC = lines[idx].trim().startsWith('lifecycle_state:')
    const isFirst = idx === keepIdx
    return !isLC || isFirst
  })

  const newFm = newLines.join('\n')
  const newContent = content.replace(fmContent, newFm)

  writeFileSync(skillPath, newContent, 'utf-8')
  console.log(`FIXED: ${skill} (removed ${lcLines.length - 1} duplicate lifecycle_state line(s))`)
  fixed++
}

console.log(`\nDone. Fixed: ${fixed} | Skipped (no duplicate): ${skipped}`)
