#!/usr/bin/env node
/**
 * validate-executor-contract.mjs
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields in last-run JSON). All blocking decisions are structural/deterministic (field presence, count checks, schema conformance). Not in any blocking decision path.
 *
 * @csps-dna
 * core_spine: ARCH
 * @csps-enforces P-ARCH-030 (agent-decoupling) — Foundation dim 3 Executor Contract
 * Phase D S076: validates that each of the 4 Executor Contract clauses has
 * system-layer T1+T2 enforcement. Missing clause T1 → exit 1 (blocking).
 *
 * EXECUTOR CONTRACT (model-agnostic — any executor satisfies this):
 *   Clause 1 — CITE EVIDENCE:  every state-claim cites this-session tool result
 *   Clause 2 — VERIFY-BEFORE-SEAL: verify.mjs exit_code=0 cited before any SEAL
 *   Clause 3 — THRESHOLD-ROUTING: every new intent routed before implementation
 *   Clause 4 — SP-REGISTRY-COMPLIANCE: DONE checked against SP-registry mechanically
 *
 * Block-test D: comment out a clause's T1 hook → exit 1
 *
 * Audit slug: executor_contract
 */

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(process.cwd())
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-executor-contract-last-run.json')

// Each clause: {id, description, t1_hook, t2_validator, why_system_layer}
const CONTRACT_CLAUSES = [
  {
    id: 'C1',
    name: 'cite-evidence',
    description: 'Every state-claim (DONE/SEAL/VERIFIED/ACCEPTED/BLOCKED) includes a THIS-SESSION tool result',
    t1_hook: '.claude/hooks/pre-tool-use-rzf-evidence-gate.sh',
    t2_validator: 'tools/validators/validate-nominal-rzf-detector.mjs',
    why_system_layer: 'Gates the CLAIM itself, not the agent making it — executor-agnostic',
  },
  {
    id: 'C2',
    name: 'verify-before-seal',
    description: 'Before any SEAL/DONE/RATIFIED claim: verify.mjs exit_code=0 cited',
    t1_hook: '.claude/hooks/post-stop-pnpm-verify.sh',
    t2_validator: 'tools/validators/validate-push-status.mjs',
    why_system_layer: 'Runs verify.mjs after every session stop — model-agnostic gate',
  },
  {
    id: 'C3',
    name: 'threshold-routing',
    description: 'Every new intent: threshold routing before implementation begins',
    t1_hook: '.claude/hooks/pre-tool-use-plan-coverage-gate.sh',
    t2_validator: 'tools/validators/validate-completion-before-new.mjs',
    why_system_layer: 'Gates any new build before an existing plan item exists — executor-agnostic',
  },
  {
    id: 'C4',
    name: 'sp-registry-compliance',
    description: 'Every completion checked against satisfaction_point.verify_mechanically before marking done',
    t1_hook: '.claude/hooks/post-stop-exists-not-equals-active.sh',
    t2_validator: 'tools/validators/validate-satisfaction-point-coverage.mjs',
    why_system_layer: 'SP-registry defines DONE mechanically — any executor must satisfy the SP',
  },
]

let blocking = 0
let advisory = 0
const all_findings = []

function flag(level, msg) {
  if (level === 'blocking') blocking++
  else advisory++
  all_findings.push({ level, msg })
  console.log(`  ${level === 'blocking' ? '✖' : '⚠'} [${level}] ${msg}`)
}

console.log('\n[validate-executor-contract] Checking 4-clause Executor Contract enforcement...\n')

for (const clause of CONTRACT_CLAUSES) {
  console.log(`  Clause ${clause.id} — ${clause.name}: ${clause.description}`)

  // Check T1 hook exists
  const t1Path = join(ROOT, clause.t1_hook)
  if (!existsSync(t1Path)) {
    flag('blocking', `${clause.id} (${clause.name}): T1 hook missing: ${clause.t1_hook}`)
    console.log(`    Why system-layer: ${clause.why_system_layer}`)
    console.log()
    continue
  }

  // Check T1 hook is executable (has executable content)
  const t1Content = readFileSync(t1Path, 'utf-8')
  const hasExitGate = /exit [12]|exit\([12]\)/.test(t1Content)
  if (!hasExitGate) {
    flag('advisory', `${clause.id} (${clause.name}): T1 hook exists but has no exit-1/exit-2 gate — may not be blocking`)
  }

  // Check T2 validator exists
  const t2Path = join(ROOT, clause.t2_validator)
  if (!existsSync(t2Path)) {
    flag('blocking', `${clause.id} (${clause.name}): T2 validator missing: ${clause.t2_validator}`)
    console.log(`    Why system-layer: ${clause.why_system_layer}`)
    console.log()
    continue
  }

  // All good
  console.log(`    ✓ T1: ${clause.t1_hook.split('/').pop()}`)
  console.log(`    ✓ T2: ${clause.t2_validator.split('/').pop()}`)
  console.log(`    ✓ Layer: system — ${clause.why_system_layer}`)
  console.log()
}

const summary = `[validate-executor-contract] blocking=${blocking} advisory=${advisory} clauses_checked=${CONTRACT_CLAUSES.length}`
console.log(summary)
console.log(`  ${blocking === 0 ? '✓ All 4 Executor Contract clauses have system-layer T1+T2 enforcement' : `✖ ${blocking} clause(s) missing enforcement — Executor Contract incomplete`}`)

const result = {
  blocking,
  advisory,
  clauses_checked: CONTRACT_CLAUSES.length,
  all_findings: all_findings.slice(0, 20),
  ran_at: new Date().toISOString(),
}
writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2), 'utf-8')

process.exit(blocking > 0 ? 1 : 0)
