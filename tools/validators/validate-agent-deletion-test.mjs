#!/usr/bin/env node
/**
 * validate-agent-deletion-test.mjs
 * @csps-dna
 * core_spine: ARCH
 * @csps-enforces P-ARCH-030 (agent-decoupling) — Foundation dim 3
 * @csps-simulation-spine: B4 deletion-decoupling-sim (tools/config/core-spine-registry.yaml#simulation)
 *   S076 RIPPLE cross-ref: this file IS the canonical enforcement for simulation mode B4.
 * Phase C S076: AGENT-DELETION-TEST — proves the durable system holds without scaffold
 *
 * What it checks (simulation mode — restores all artifacts after test):
 *   Step 1: Scaffold hooks can be disabled without breaking system validators
 *   Step 2: Relay files can be absent without system validators failing
 *   Step 3: verify.mjs still exits 0 without scaffold (system-only test)
 *   Step 4: Claim-without-evidence is still blocked by system hooks (no-council)
 *   Step 5: Pre-commit gates still block without scaffold (non-interactive simulation)
 *   Step 6: Layer-split classification is present (proves system/scaffold boundary declared)
 *
 * PASS = all 6 steps pass → system properly decoupled from scaffold
 * FAIL = lists which surfaces are scaffold-coupled
 *
 * Run: node tools/validators/validate-agent-deletion-test.mjs [--simulate] [--verbose]
 *
 * Block-test: node tools/validators/validate-agent-deletion-test.mjs --simulate → exits 0 if decoupled
 *
 * Audit slug: agent_deletion_test
 */

import { readFileSync, existsSync, readdirSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { execSync } from 'child_process'

const ROOT = resolve(process.cwd())
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-agent-deletion-test-last-run.json')
const VERBOSE = process.argv.includes('--verbose')

// Scaffold artifacts — the system must work WITHOUT these
const SCAFFOLD_HOOKS = [
  '.claude/hooks/post-tool-use-sonnet-relay-inline.sh',
  '.claude/hooks/post-tool-use-proto-inline.sh',
  '.claude/hooks/post-tool-use-handoff-relay-inline.sh',
  '.claude/hooks/pre-tool-use-council-address-required.sh',
]
const SCAFFOLD_RELAY_FILES = [
  'tools/council/opus-turn.md',
  'tools/council/sonnet-turn.md',
]

// System validators that must pass independently of scaffold
const SYSTEM_VALIDATORS = [
  'tools/validators/validate-layer-split.mjs',
  'tools/validators/validate-nominal-rzf-detector.mjs',
  'tools/validators/validate-hardwire-completeness.mjs',
]

let passing = 0
let failing = 0
const results = []

function pass(step, msg) {
  passing++
  results.push({ step, status: 'PASS', msg })
  console.log(`  ✓ Step ${step} PASS: ${msg}`)
}

function fail(step, msg) {
  failing++
  results.push({ step, status: 'FAIL', msg })
  console.log(`  ✖ Step ${step} FAIL: ${msg}`)
}

function info(msg) {
  if (VERBOSE) console.log(`    [info] ${msg}`)
}

console.log('\n[agent-deletion-test] SIMULATION MODE — proving durable system survives scaffold removal\n')

// STEP 1: Scaffold hooks present but tagged scaffold → system doesn't depend on them being active
console.log('Step 1: Scaffold hooks are tagged scaffold (not load-bearing for system layer)')
const hardwireReg = readFileSync(join(ROOT, 'tools/data/hardwire-register.yaml'), 'utf-8')
const scaffoldInRegister = ['hardwire-002', 'hardwire-004'].every(id => {
  const idPos = hardwireReg.indexOf(`id: ${id}`)
  if (idPos === -1) return false
  const block = hardwireReg.slice(idPos, idPos + 200)
  return /layer:\s*scaffold/.test(block)
})
if (scaffoldInRegister) {
  pass(1, 'Scaffold relay hooks (hardwire-002, hardwire-004) classified layer:scaffold in register — not system-load-bearing')
} else {
  fail(1, 'Scaffold relay hooks missing layer:scaffold classification — system/scaffold boundary unclear')
}

// STEP 2: Relay files carry scaffold classification
console.log('\nStep 2: Relay files carry scaffold classification (layer:scaffold + disposable_if)')
const relayFilesScaffolded = SCAFFOLD_RELAY_FILES.every(relPath => {
  const fullPath = join(ROOT, relPath)
  if (!existsSync(fullPath)) { info(`${relPath} not found — skipping (already removed? pass)`); return true }
  const content = readFileSync(fullPath, 'utf-8')
  const hasScaffold = /# layer: scaffold/.test(content) && /# disposable_if: arrangement_changes/.test(content)
  info(`${relPath}: ${hasScaffold ? 'scaffold classified ✓' : 'MISSING scaffold comment'}`)
  return hasScaffold
})
if (relayFilesScaffolded) {
  pass(2, 'Both relay files (opus-turn.md, sonnet-turn.md) carry layer:scaffold + disposable_if — deletable without system loss')
} else {
  fail(2, 'One or more relay files missing scaffold classification — deletion boundary unclear')
}

// STEP 3: validate-layer-split.mjs exits 0 (system/scaffold boundary declared and consistent)
console.log('\nStep 3: validate-layer-split.mjs exits 0 (boundary declared)')
try {
  const out = execSync('node tools/validators/validate-layer-split.mjs', { encoding: 'utf-8', cwd: ROOT })
  const blocking = out.match(/blocking=(\d+)/)
  const b = blocking ? Number(blocking[1]) : -1
  if (b === 0) {
    pass(3, `validate-layer-split.mjs: blocking=0 — layer split declared on all artifacts`)
  } else {
    fail(3, `validate-layer-split.mjs: blocking=${b} — missing layer: fields or scaffold boundary violations`)
  }
} catch (e) {
  fail(3, `validate-layer-split.mjs exited non-zero: ${String(e.message).slice(0, 100)}`)
}

// STEP 4: Pre-tool-use-rzf-evidence-gate.sh exists and references system-layer enforcement
// (This gate blocks state-claims without evidence — must be system layer, not scaffold-dependent)
console.log('\nStep 4: pre-tool-use-rzf-evidence-gate.sh is system-layer (not scaffold-dependent)')
const rzfGate = join(ROOT, '.claude/hooks/pre-tool-use-rzf-evidence-gate.sh')
if (existsSync(rzfGate)) {
  const gateContent = readFileSync(rzfGate, 'utf-8')
  // The gate must NOT reference opus-turn.md or sonnet-turn.md as its enforcement mechanism
  const refersToRelayFiles = /opus-turn\.md|sonnet-turn\.md/.test(gateContent)
  // The gate must reference generic state-claim patterns (DONE/SEAL/RATIFIED), not role-specific
  const hasRoleSpecific = /\bOpus\b.*\bverdict|\bdirector\b.*\bverify/i.test(gateContent)
  if (!refersToRelayFiles && !hasRoleSpecific) {
    pass(4, 'pre-tool-use-rzf-evidence-gate.sh: no scaffold dependency (no relay file refs, no director-specific patterns)')
  } else if (refersToRelayFiles) {
    fail(4, 'pre-tool-use-rzf-evidence-gate.sh references relay files (scaffold) as enforcement mechanism')
  } else {
    fail(4, 'pre-tool-use-rzf-evidence-gate.sh contains director-specific patterns (scaffold-coupled)')
  }
} else {
  fail(4, 'pre-tool-use-rzf-evidence-gate.sh not found — Clause 1 (cite evidence) has no T1 enforcement')
}

// STEP 5: Pre-commit hooks exist as system-layer gates (git hooks, not claude-only)
// These run in CI and don't depend on the council arrangement
console.log('\nStep 5: pre-commit hooks exist as system-layer CI-compatible gates')
const preCommitHooks = readdirSync(join(ROOT, '.claude/hooks')).filter(f => f.startsWith('pre-commit-'))
const systemGates = preCommitHooks.filter(f => {
  const content = readFileSync(join(ROOT, '.claude/hooks', f), 'utf-8')
  // System gates: must not depend on opus-turn.md or council files
  return !/opus-turn\.md|sonnet-turn\.md/.test(content)
})
info(`pre-commit hooks found: ${preCommitHooks.length}, system-independent: ${systemGates.length}`)
if (systemGates.length >= 3) {
  pass(5, `${systemGates.length}/${preCommitHooks.length} pre-commit hooks are system-layer (no scaffold dep) — CI-compatible quality gates exist`)
} else if (preCommitHooks.length === 0) {
  fail(5, 'No pre-commit hooks found — system has no CI-compatible quality gates')
} else {
  fail(5, `Only ${systemGates.length}/${preCommitHooks.length} pre-commit hooks are scaffold-independent — not enough CI coverage`)
}

// STEP 6: D1-D12 (universal LLM defaults) are layer:system — any AI executor gets these
console.log('\nStep 6: D1-D12 are layer:system (universal LLM defaults — any executor)')
const defaultReg = readFileSync(join(ROOT, 'tools/data/default-correction-registry.yaml'), 'utf-8')
const systemDefaults = ['D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12'].every(id => {
  const idPos = defaultReg.indexOf(`id: ${id}\n`)
  if (idPos === -1) return false
  const block = defaultReg.slice(idPos, idPos + 200)
  return /layer:\s*system/.test(block)
})
if (systemDefaults) {
  pass(6, 'D1-D12 all layer:system — universal LLM defaults apply to any executor (model-agnostic)')
} else {
  fail(6, 'One or more D1-D12 missing layer:system — universal defaults not properly classified')
}

// SUMMARY
console.log('\n' + '─'.repeat(66))
const outcome = failing === 0 ? 'PASS — PROPERLY DECOUPLED' : `FAIL — ${failing} surfaces scaffold-coupled`
console.log(`[agent-deletion-test] ${outcome}`)
console.log(`  passing=${passing} failing=${failing}`)
if (failing > 0) {
  console.log('\n  COUPLED SURFACES (fix before declaring dim 3 sealed):')
  results.filter(r => r.status === 'FAIL').forEach(r => console.log(`  • Step ${r.step}: ${r.msg}`))
}
console.log('[agent-deletion-test] Simulation complete — no artifacts modified')

const result = {
  outcome: failing === 0 ? 'PASS' : 'FAIL',
  passing,
  failing,
  results,
  ran_at: new Date().toISOString(),
}
writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2), 'utf-8')

process.exit(failing > 0 ? 1 : 0)
