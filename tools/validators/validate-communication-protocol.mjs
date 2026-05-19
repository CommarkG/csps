#!/usr/bin/env node
// validate-communication-protocol.mjs — S036 (communication-protocol-shared.md Rules 1+2)
// Rule 1: Sonnet→Opus messages start with "Opus, this is Sonnet." (sonnet-turn.md)
// Rule 2: Opus→Sonnet directives start with [PROTOCOL:] or "Sonnet, this is Opus." (opus-turn.md)
//         (see validate-directive-has-rzf.mjs for RZF ordering enforcement)
// ADVISORY only — enforces identity handshake rule for cross-session consistency.
//
// Wired: tools/verify.mjs cycle 'communication_protocol'
// Slug: 'communication-protocol' in audit-runner.md

import { readFileSync, existsSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(process.cwd())
const SONNET_TURN = join(ROOT, 'tools/council/sonnet-turn.md')

let advisory = 0
const issues = []

if (!existsSync(SONNET_TURN)) {
  console.log('[validate-communication-protocol] sonnet-turn.md not found — skipping')
  process.exit(0)
}

const content = readFileSync(SONNET_TURN, 'utf8')

// Rule 1 + Rule 13: Check ALL cross-boundary sections in sonnet-turn.md
// Sections are delimited by "# Sonnet" headers (Session, Report, etc.)
// Any section that contains "done at commit" OR "SROF-" OR "PROTO-" report content
// MUST contain "Opus, this is Sonnet." somewhere in the section.
const allSections = content.split(/(?=^# Sonnet)/m).filter(s => s.trim())

for (const section of allSections) {
  const lines = section.split('\n').filter(l => l.trim())
  const firstLine = lines[0] ?? 'unknown'
  const isCrossBoundary =
    section.includes('done at commit') ||
    section.includes('SROF-') ||
    (section.includes('PROTO-') && section.includes('commit'))
  const hasHandshake = section.includes('Opus, this is Sonnet')
  if (isCrossBoundary && !hasHandshake) {
    issues.push(`  ⚠ Section missing "Opus, this is Sonnet." handshake: "${firstLine.slice(0, 70)}"`)
    advisory++
  }
}

// Legacy check: "# Sonnet Report" sections (explicit report format from Rule 13)
const reportSections = content.match(/# Sonnet Report[^\n]*\n([\s\S]*?)(?=\n---|\n#|$)/g) || []
for (const section of reportSections) {
  const lines = section.split('\n').filter(l => l.trim())
  const hasHandshake = section.includes('Opus, this is Sonnet')
  const hasContent = section.includes('Done:') || section.includes('## Done') || section.includes('done at commit')
  if (hasContent && !hasHandshake) {
    const firstLine = lines[0] ?? 'unknown'
    issues.push(`  ⚠ Sonnet Report missing "Opus, this is Sonnet." handshake: "${firstLine.slice(0, 60)}"`)
    advisory++
  }
}

// Also check the SROF request log for Rule 1 compliance
const srofLog = join(ROOT, 'tools/council/sonnet-to-opus-request-log.md')
if (existsSync(srofLog)) {
  const srofContent = readFileSync(srofLog, 'utf8')
  const requests = srofContent.match(/THE REQUEST[^:]*:\n([\s\S]*?)(?=\n\nBRIEFING|$)/g) || []
  for (const req of requests) {
    if (!req.includes('Opus, this is Sonnet')) {
      advisory++
      issues.push('  ⚠ SROF request found without "Opus, this is Sonnet." opening')
      break // Report once
    }
  }
}

if (advisory === 0) {
  console.log('[validate-communication-protocol] ✓ Communication protocol rules followed')
} else {
  console.log(`[validate-communication-protocol] ${advisory} advisory(ies) — communication protocol gaps:`)
  issues.forEach(i => console.log(i))
  console.log('  Fix: Start all Sonnet→Opus messages with "Opus, this is Sonnet."')
  console.log('  Ref: tools/council/communication-protocol-shared.md RULE 1')
}
console.log(`[validate-communication-protocol] advisory=${advisory}`)
process.exit(0) // ADVISORY only
