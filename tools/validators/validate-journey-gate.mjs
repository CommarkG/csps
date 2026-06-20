#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-journey-gate
 * @csps-name validate-journey-gate
 * @csps-description B3 PEG enforcement validator (SEED-2 PROTO-S084-B3).
 *   Reads tools/data/seed2-gate-mode-matrix.json (SEED-2 ANCHOR, authored OPUS-22).
 *   Implements evaluate() — the single admission controller at every PEG transition.
 *   Runs 10 block-tests across gates x risk_class x mechanism to prove enforcement.
 *   BLOCKING: any block-test failure (blocking gate returned allow).
 *   ADVISORY: matrix file missing.
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces SEED-2 PROTO-S084-B3
 * @csps-prevention-class MISSING-EVIDENCE-ADVANCE-NOT-BLOCKED
 *
 * load_mode: on-demand
 * justification: runs at verify time only, not per-turn
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const MATRIX_PATH = resolve(ROOT, 'tools/data/seed2-gate-mode-matrix.json');

let blocking = 0;
let advisory = 0;
const failures = [];
const passes = [];

if (!existsSync(MATRIX_PATH)) {
  console.log('[validate-journey-gate] ADVISORY: seed2-gate-mode-matrix.json not found');
  console.log('  checked=0 blocking=0 advisory=1 tests_run=0');
  process.exit(0);
}

const MATRIX = JSON.parse(readFileSync(MATRIX_PATH, 'utf8'));

// evaluate() -- single admission controller (SEED-2 R4)
function evaluate({ peg, mechanism, risk_class, has_evidence }) {
  const pegMatrix = MATRIX[peg];
  if (!pegMatrix) return { result: 'allow', mode: 'silent', error: `unknown PEG: ${peg}` };
  const mechMatrix = pegMatrix[mechanism];
  if (!mechMatrix) return { result: 'allow', mode: 'silent', error: `unknown mechanism: ${mechanism}` };
  const mode = mechMatrix[risk_class];
  if (!mode) return { result: 'allow', mode: 'silent', error: `unknown risk_class: ${risk_class}` };

  if (mode === 'blocking' && !has_evidence) return { result: 'deny', mode };
  if (mode === 'advisory' && !has_evidence) return { result: 'warn', mode };
  return { result: 'allow', mode };
}

// 10 block-tests across gates x mechanism x risk_class
const BLOCK_TESTS = [
  { id: 'BT-01', peg: 'PEG-1', mechanism: 'THRESHOLD', risk_class: 'standard', has_evidence: false, expected_result: 'deny',
    rationale: 'SEED-2: THRESHOLD P1 = blocking for standard (hard floor)' },
  { id: 'BT-02', peg: 'PEG-1', mechanism: 'THRESHOLD', risk_class: 'low', has_evidence: false, expected_result: 'deny',
    rationale: 'SEED-2: THRESHOLD P1 = blocking for low (hard floor -- ALL risk classes)' },
  { id: 'BT-03', peg: 'PEG-1', mechanism: 'THRESHOLD', risk_class: 'critical', has_evidence: false, expected_result: 'deny',
    rationale: 'SEED-2: THRESHOLD P1 = blocking for critical (hard floor)' },
  { id: 'BT-04', peg: 'PEG-3', mechanism: 'ZF', risk_class: 'standard', has_evidence: false, expected_result: 'deny',
    rationale: 'SEED-2: ZF P3 = blocking for standard (evidence-at-gate C3)' },
  { id: 'BT-05', peg: 'PEG-4', mechanism: 'ZF', risk_class: 'elevated', has_evidence: false, expected_result: 'deny',
    rationale: 'SEED-2: ZF P4 = blocking for elevated' },
  { id: 'BT-06', peg: 'PEG-3', mechanism: 'PE', risk_class: 'standard', has_evidence: false, expected_result: 'deny',
    rationale: 'SEED-2: PE P3 = blocking for standard (C4 mandate)' },
  { id: 'BT-07', peg: 'PEG-1', mechanism: 'ZF', risk_class: 'low', has_evidence: false, expected_result: 'allow',
    rationale: 'SEED-2: ZF P1 = silent for low -> allow (no evidence required)' },
  { id: 'BT-08', peg: 'PEG-3', mechanism: 'CIE', risk_class: 'critical', has_evidence: false, expected_result: 'warn',
    rationale: 'SEED-2: CIE never blocks by default -- advisory minimum (§0b C1)' },
  { id: 'BT-09', peg: 'PEG-3', mechanism: 'ZF', risk_class: 'standard', has_evidence: true, expected_result: 'allow',
    rationale: 'Blocking gate WITH evidence -> allow (gate is satisfied)' },
  { id: 'BT-10', peg: 'PEG-5', mechanism: 'THRESHOLD', risk_class: 'standard', has_evidence: false, expected_result: 'deny',
    rationale: 'SEED-2: THRESHOLD P5 = blocking for standard (hard floor)' },
];

for (const test of BLOCK_TESTS) {
  const { result, mode, error } = evaluate(test);
  if (error) {
    failures.push(`${test.id}: evaluate() error -- ${error}`);
    blocking = blocking + 1;
    continue;
  }
  if (result === test.expected_result) {
    passes.push(`${test.id} PASS: ${test.peg}x${test.mechanism}x${test.risk_class} has_evidence=${test.has_evidence} -> ${result} (${mode})`);
  } else {
    failures.push(`${test.id} FAIL: ${test.peg}x${test.mechanism}x${test.risk_class} has_evidence=${test.has_evidence}`);
    failures.push(`  expected=${test.expected_result} got=${result} mode=${mode}`);
    failures.push(`  rationale: ${test.rationale}`);
    blocking = blocking + 1;
  }
}

const status = blocking > 0 ? 'FAIL' : 'PASS';
console.log(`[validate-journey-gate] ${status}`);
console.log(`  checked=${BLOCK_TESTS.length} tests_pass=${passes.length} tests_fail=${blocking} blocking=${blocking} advisory=${advisory}`);
console.log(`  matrix_source=tools/data/seed2-gate-mode-matrix.json`);

if (blocking === 0) {
  console.log('\n[validate-journey-gate] All block-tests PASS:');
  for (const p of passes) console.log(`  ok ${p}`);
} else {
  console.log('\n[validate-journey-gate] FAILURES:');
  for (const f of failures) console.log(`  FAIL ${f}`);
}

console.log('\n[validate-journey-gate] evaluate() contract (SEED-2 R4):');
console.log('  evaluate({peg, mechanism, risk_class, has_evidence}) -> {result: allow|deny|warn, mode: blocking|advisory|silent}');
console.log('  A blocking gate without evidence -> deny. With evidence -> allow.');

process.exit(blocking > 0 ? 1 : 0);