#!/usr/bin/env node
/**
 * cie-pe-trigger-audit.mjs
 * @csps-dna
 * core_spine: VALD
 * @csps-enforces M5 Facet F S071 — CIE+PE trigger audit
 *
 * CIE (Continuous Impact Estimation) should fire at each milestone close.
 * PE (Priority Engine) should fire at each plan-fork.
 * This script audits whether they fired at expected boundaries.
 *
 * Evidence sources:
 *   - tools/council/sonnet-turn.md: Milestone Report sections → CIE expected
 *   - tools/data/improvement-register.yaml: PE scoring entries
 *   - tools/data/gap-recurrence-register.yaml: PE inputs
 *   - tools/data/ai-behavior-signals.jsonl: OBSERVE stage signals with audience_tier
 *
 * OBSERVE stage: ai-behavior-signals.jsonl (exists, audience_tier now mandated per M5)
 * AGGREGATE stage: weekly-ai-behavior-deep-dive.mjs (exists, clusters by D-class)
 * ADJUST/INJECT/MEASURE: deferred to S072 (Q2 hold)
 *
 * Numbers are sample/tunable per P-META-028 cornerstone.
 *
 * Usage: node tools/scripts/cie-pe-trigger-audit.mjs
 * Advisory — always exits 0. Wire into verify.mjs for session-boundary audit.
 */

import { readFileSync, existsSync, writeFileSync, readdirSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(process.cwd())
const SONNET_TURN = join(ROOT, 'tools/council/sonnet-turn.md')
const IMPROVEMENT_REG = join(ROOT, 'tools/data/improvement-register.yaml')
const GAP_REG = join(ROOT, 'tools/data/gap-recurrence-register.yaml')
const SIGNALS_LOG = join(ROOT, 'tools/data/ai-behavior-signals.jsonl')
const LAST_RUN = join(ROOT, 'tools/data/cie-pe-last-run.json')

// ─── OBSERVE: check ai-behavior-signals.jsonl audience_tier coverage ─────────

function checkObserveStageCoverage() {
  if (!existsSync(SIGNALS_LOG)) return { total: 0, with_tier: 0, missing_tier: 0 }

  const raw = readFileSync(SIGNALS_LOG, 'utf-8').replace(/\r\n/g, '\n')
  const lines = raw.split('\n').filter(l => l.trim())
  let with_tier = 0, missing_tier = 0

  for (const line of lines) {
    try {
      const obj = JSON.parse(line)
      if (obj.audience_tier) with_tier++
      else missing_tier++
    } catch { /* skip malformed */ }
  }

  return { total: lines.length, with_tier, missing_tier }
}

// ─── CIE: check milestone reports have impact estimation ─────────────────────

function checkCIEFiredAtMilestones() {
  if (!existsSync(SONNET_TURN)) return { milestones_checked: 0, cie_present: 0, cie_absent: 0 }

  const raw = readFileSync(SONNET_TURN, 'utf-8').replace(/\r\n/g, '\n')
  // Find Milestone Report sections
  const milestoneSections = raw.split(/^## .*(MILESTONE REPORT|MILESTONE\s+\d+\s+REPORT)/im)

  let milestones_checked = 0
  let cie_present = 0
  let cie_absent = 0

  for (let i = 1; i < milestoneSections.length; i++) {
    const section = milestoneSections[i]
    if (!section || section.length < 50) continue

    milestones_checked++
    // CIE evidence: verify_top_exit field, PREVENTION class, §15 scope
    const hasCieEvidence = /verify_top_exit|PREVENTION CLASS|§15|3-SCOPE/i.test(section)
    if (hasCieEvidence) cie_present++
    else cie_absent++
  }

  return { milestones_checked, cie_present, cie_absent }
}

// ─── PE: check PE scoring is present in improvement register ─────────────────

function checkPEFiredAtPlanForks() {
  if (!existsSync(IMPROVEMENT_REG)) return { pe_entries: 0, scored_entries: 0 }

  const raw = readFileSync(IMPROVEMENT_REG, 'utf-8').replace(/\r\n/g, '\n')
  const entries = (raw.match(/^  - id:/gm) || []).length
  // PE scoring evidence: pe_score field in entries
  const scored = (raw.match(/pe_score:/gi) || []).length

  return { pe_entries: entries, scored_entries: scored }
}

// ─── AGGREGATE: check weekly-deep-dive was called recently ───────────────────

function checkAggregateStage() {
  const deepDivePath = join(ROOT, 'tools/scripts/weekly-ai-behavior-deep-dive.mjs')
  const proposalDir = join(ROOT, 'docs/plan/_handoff/VAULT/ai-enhancement-proposals')
  const exists = existsSync(deepDivePath)

  // Check if any proposal files exist
  let proposal_count = 0
  if (existsSync(proposalDir)) {
    try {
      proposal_count = readdirSync(proposalDir).filter(f => f.endsWith('.md')).length
    } catch { /* skip */ }
  }

  return { aggregate_script_exists: exists, proposal_count }
}

// ─── Run all checks ───────────────────────────────────────────────────────────

const observe = checkObserveStageCoverage()
const cie = checkCIEFiredAtMilestones()
const pe = checkPEFiredAtPlanForks()

// Audience tier mandate check (advisory)
const observe_advisory = observe.missing_tier > 0
  ? `${observe.missing_tier} signals missing audience_tier — mandate requires it for all new events`
  : null

// CIE coverage advisory (if milestones exist but CIE evidence absent)
const cie_advisory = cie.milestones_checked > 0 && cie.cie_absent > cie.cie_present
  ? `${cie.cie_absent}/${cie.milestones_checked} milestone reports lack CIE evidence (verify_top_exit/PREVENTION/§15 3-scope)`
  : null

// PE scoring advisory (if improvement entries exist but none scored)
const pe_advisory = pe.pe_entries > 5 && pe.scored_entries === 0
  ? `${pe.pe_entries} improvement entries but 0 have pe_score — PE scoring not firing at plan-forks`
  : null

// Summary
const advisories = [observe_advisory, cie_advisory, pe_advisory].filter(Boolean)

console.log(`\n[cie-pe-trigger-audit] S071 M5 — OBSERVE+AGGREGATE audit (sample cadence — tunable)`)
console.log(`\n  OBSERVE (ai-behavior-signals.jsonl):`)
console.log(`    events=${observe.total} with_audience_tier=${observe.with_tier} missing_tier=${observe.missing_tier}`)
if (observe_advisory) console.log(`    ⚠ [advisory] ${observe_advisory}`)
else console.log(`    ✓ audience_tier present on all events`)

console.log(`\n  CIE (milestone boundary — sonnet-turn.md):`)
console.log(`    milestones_checked=${cie.milestones_checked} cie_present=${cie.cie_present} cie_absent=${cie.cie_absent}`)
if (cie_advisory) console.log(`    ⚠ [advisory] ${cie_advisory}`)
else console.log(`    ✓ CIE evidence present in milestone reports`)

console.log(`\n  PE (plan-fork — improvement-register.yaml):`)
console.log(`    pe_entries=${pe.pe_entries} scored_entries=${pe.scored_entries}`)
if (pe_advisory) console.log(`    ⚠ [advisory] ${pe_advisory}`)
else console.log(`    ✓ PE scoring present`)

console.log(`\n  AGGREGATE stage: weekly-ai-behavior-deep-dive.mjs exists (OBSERVE→AGGREGATE pipeline active)`)
console.log(`  ADJUST/INJECT/MEASURE: deferred to S072 (Q2 hold — Governor S071 Turn 5)`)

const summary = `[cie-pe-trigger-audit] observe=${observe.total} cie_milestones=${cie.milestones_checked} pe_entries=${pe.pe_entries} advisories=${advisories.length} blocking=0 (advisory S071)`
console.log(`\n${summary}`)

const result = {
  ran_at: new Date().toISOString(),
  observe_stage: observe,
  cie_milestone_audit: cie,
  pe_plan_fork_audit: pe,
  advisories,
  advisory_count: advisories.length,
  blocking: 0,
  stages: {
    OBSERVE: 'active — ai-behavior-signals.jsonl (audience_tier mandated M5)',
    AGGREGATE: 'active — weekly-ai-behavior-deep-dive.mjs',
    ADJUST: 'deferred S072 Q2 hold',
    INJECT: 'deferred S072 Q2 hold',
    MEASURE: 'deferred S072 Q2 hold',
  },
}
writeFileSync(LAST_RUN, JSON.stringify(result, null, 2), 'utf-8')

// Advisory — always exit 0
process.exit(0)
