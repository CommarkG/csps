#!/usr/bin/env node
/**
 * validate-register-connectivity.mjs
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields in last-run JSON). All blocking decisions are structural/deterministic (field presence, count checks, schema conformance). Not in any blocking decision path.
 *
 * @csps-dna
 * core_spine: VALD
 * @csps-enforces NODEFILE-CONTRACT.md (cie_connection + pe_connection required fields)
 *               PROTO-S076-ACCOUNTABILITY-PE-CIA-WIRING
 * @behavioral-test-status: tested — register-connectivity-test.sh A/B
 *
 * What it checks:
 *   All 6 accountability registers MUST declare cie_connection + pe_connection
 *   in their frontmatter header per NODEFILE-CONTRACT §Delta Fields.
 *
 *   Valid cie_connection values: always_active | shadow | requires_promotion | not_applicable
 *   Valid pe_connection values:  scored | input | output | not_applicable
 *
 * Blocking: any register missing cie_connection OR pe_connection OR invalid value
 * Advisory: value is FLAGGED-TO-THRESHOLD (legitimate pending state per NODEFILE-CONTRACT)
 *
 * Block-test: register missing cie_connection → exit 1
 *
 * Audit slug: register_connectivity
 */

import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(process.cwd())
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-register-connectivity-last-run.json')

const ACCOUNTABILITY_REGISTERS = [
  { path: join(ROOT, 'tools/data/gap-recurrence-register.yaml'),      name: 'gap-recurrence-register' },
  { path: join(ROOT, 'tools/data/improvement-register.yaml'),         name: 'improvement-register' },
  { path: join(ROOT, 'tools/data/ux-violation-register.yaml'),        name: 'ux-violation-register' },
  { path: join(ROOT, 'tools/data/floating-artifacts-register.yaml'),  name: 'floating-artifacts-register' },
  { path: join(ROOT, 'tools/data/exceptional-moments-register.yaml'), name: 'exceptional-moments-register' },
  { path: join(ROOT, 'tools/data/hardwire-register.yaml'),            name: 'hardwire-register' },
]

const VALID_CIE = new Set(['always_active', 'shadow', 'requires_promotion', 'not_applicable'])
const VALID_PE  = new Set(['scored', 'input', 'output', 'not_applicable'])

let blocking = 0
let advisory = 0
const all_findings = []

function flag(level, msg) {
  if (level === 'blocking') blocking++
  else advisory++
  all_findings.push({ level, msg })
  console.log(`  ${level === 'blocking' ? '✖' : '⚠'} [${level}] ${msg}`)
}

console.log('\n[validate-register-connectivity] Checking accountability registers for CIE+PE wiring...\n')

for (const reg of ACCOUNTABILITY_REGISTERS) {
  if (!existsSync(reg.path)) {
    flag('blocking', `${reg.name}: file not found — register may have been moved or deleted`)
    continue
  }

  // Read only the frontmatter (before first '---\n' close or first non-yaml content)
  const content = readFileSync(reg.path, 'utf-8')

  // Extract frontmatter (between --- markers at top)
  const fmEnd = content.indexOf('\n---', 3) // end of frontmatter block
  const frontmatter = fmEnd > -1 ? content.slice(0, fmEnd) : content.slice(0, 2000)

  // Check cie_connection
  const cieMatch = frontmatter.match(/^cie_connection:\s*["']?([^\n"']+)["']?\s*$/m)
  if (!cieMatch) {
    flag('blocking', `${reg.name}: missing cie_connection in frontmatter (per NODEFILE-CONTRACT §Delta Fields)`)
  } else {
    const cieVal = cieMatch[1].trim()
    if (cieVal === 'FLAGGED-TO-THRESHOLD') {
      flag('advisory', `${reg.name}: cie_connection=FLAGGED-TO-THRESHOLD — pending ratification (legitimate per contract)`)
    } else if (!VALID_CIE.has(cieVal)) {
      flag('blocking', `${reg.name}: cie_connection="${cieVal}" is not a valid value. Allowed: ${[...VALID_CIE].join(' | ')}`)
    } else {
      console.log(`  ✓ ${reg.name}: cie_connection=${cieVal}`)
    }
  }

  // Check pe_connection
  const peMatch = frontmatter.match(/^pe_connection:\s*["']?([^\n"']+)["']?\s*$/m)
  if (!peMatch) {
    flag('blocking', `${reg.name}: missing pe_connection in frontmatter (per NODEFILE-CONTRACT §Delta Fields)`)
  } else {
    const peVal = peMatch[1].trim()
    if (peVal === 'FLAGGED-TO-THRESHOLD') {
      flag('advisory', `${reg.name}: pe_connection=FLAGGED-TO-THRESHOLD — pending ratification (legitimate per contract)`)
    } else if (!VALID_PE.has(peVal)) {
      flag('blocking', `${reg.name}: pe_connection="${peVal}" is not a valid value. Allowed: ${[...VALID_PE].join(' | ')}`)
    } else {
      console.log(`  ✓ ${reg.name}: pe_connection=${peVal}`)
    }
  }
}

const summary = `[validate-register-connectivity] registers_checked=${ACCOUNTABILITY_REGISTERS.length} blocking=${blocking} advisory=${advisory}`
console.log('\n' + summary)
if (blocking === 0) {
  console.log('  ✓ All accountability registers have CIE+PE wiring declared')
}

const result = {
  registers_checked: ACCOUNTABILITY_REGISTERS.length,
  blocking,
  advisory,
  all_findings: all_findings.slice(0, 20),
  ran_at: new Date().toISOString(),
}
writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2), 'utf-8')

process.exit(blocking > 0 ? 1 : 0)
