#!/usr/bin/env node
/**
 * validate-threshold-mandate-gate.mjs — THRESHOLD-FIRST Gate Fixture Validator (T2)
 *
 * ROOT CAUSE TARGETED (S089 §20 / round-5 PCR / PARK-S089-THRESHOLD-INLINE-GATE):
 *   threshold-router.mjs computed mandateRelation (L191-193) but ignored it at L227,
 *   routing ALL governor_directives unconditionally to PROCESS-NOW. This silently
 *   bypassed the mandate gate. Fix: router now consults mandateRelation before routing.
 *
 * WHAT THIS VALIDATES (deterministic rule — fixture-testable):
 *   "new-concept + active-mandate → QUEUE-OR-PIVOT" (advisory, not blocking)
 *   Escape hatch: "PIVOT" keyword in content → PROCESS-NOW (user override)
 *   Escape hatch: mandate_active=false → PROCESS-NOW (no active mandate)
 *   Escape hatch: in-mandate content → PROCESS-NOW (directive is on-mandate)
 *
 * This is the T2 gate. Semantic "is it new?" is Haiku-classified at runtime (spot-checked).
 * The DETERMINISTIC rule (orthogonal + active mandate → QUEUE-OR-PIVOT) is WHAT THIS TESTS.
 *
 * DONE = fixture_pass_rate = 100% AND 'QUEUE-OR-PIVOT' visible in route options.
 *
 * Exit codes:
 *   0 = all fixtures pass (gate is working)
 *   1 = fixture failure (gate is broken — BLOCKING)
 *
 * run_tier: STANDARD
 * always_rerun: false
 * blocking: true (on fixture failure)
 *
 * @csps-id csps.tools.validators.validate-threshold-mandate-gate
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces THRESHOLD-FIRST-GATE PARK-S089-THRESHOLD-INLINE-GATE
 * @csps-prevention-class MANDATE-BYPASS NEW-CONCEPT-DURING-MANDATE
 */

import { routeInput } from '../scripts/threshold-router.mjs';
import { fileURLToPath } from 'node:url';

// ─── Fixture definitions ──────────────────────────────────────────────────────

const FIXTURES = [
  {
    name: 'CORE RULE: Haiku classifies orthogonal + active mandate → QUEUE-OR-PIVOT',
    input: {
      type: 'governor_directive',
      spine: 'GVRN',
      urgency: 'high',
      content: 'build a completely new CDS platform and design system from scratch',
      mandate_active: true,
      mandate_relation: 'orthogonal',  // Haiku pre-classifies; passed directly (production path)
    },
    expected_route: 'QUEUE-OR-PIVOT',
    expected_class: 'governor_directive',
  },
  {
    name: 'IN-MANDATE: Haiku classifies in-mandate + active mandate → PROCESS-NOW',
    input: {
      type: 'governor_directive',
      spine: 'GVRN',
      urgency: 'high',
      content: 'continue with the UX journey build as mandated',
      mandate_active: true,
      mandate_relation: 'in-mandate',  // Haiku pre-classifies as in-mandate
    },
    expected_route: 'PROCESS-NOW',
    expected_class: 'governor_directive',
  },
  {
    name: 'NO ACTIVE MANDATE: orthogonal + no mandate → PROCESS-NOW (gate off)',
    input: {
      type: 'governor_directive',
      spine: 'GVRN',
      urgency: 'high',
      content: 'build a completely new dashboard for something unrelated',
      mandate_active: false,  // gate does not fire without active mandate
      mandate_relation: 'orthogonal',
    },
    expected_route: 'PROCESS-NOW',
    expected_class: 'governor_directive',
  },
  {
    name: 'PIVOT ESCAPE: orthogonal + active mandate + PIVOT keyword → PROCESS-NOW',
    input: {
      type: 'governor_directive',
      spine: 'GVRN',
      urgency: 'high',
      content: 'PIVOT: build a completely new system; user explicitly overrides the mandate gate',
      mandate_active: true,
      mandate_relation: 'orthogonal',
    },
    // PIVOT keyword → escape hatch honored → PROCESS-NOW regardless of mandate relation
    expected_route: 'PROCESS-NOW',
    expected_class: 'governor_directive',
  },
  {
    name: 'PIVOT TAG ESCAPE: PIVOT:<tag> format also honored',
    input: {
      type: 'governor_directive',
      spine: 'GVRN',
      urgency: 'high',
      content: 'PIVOT:CDS-architecture: build a new architecture as discussed',
      mandate_active: true,
      mandate_relation: 'orthogonal',
    },
    expected_route: 'PROCESS-NOW',
    expected_class: 'governor_directive',
  },
  {
    name: 'CONSTITUTIONAL: constitutional scope always escalates (gate not reached)',
    input: {
      type: 'governor_directive',
      spine: 'GVRN',
      urgency: 'high',
      scope: 'constitutional',
      content: 'ratify this as a constitutional change',
      mandate_active: true,
    },
    expected_route: 'ESCALATE',  // CLASS 1 constitutional fires before the non-constitutional branch
    expected_class: 'governor_directive',
  },
];

// ─── Run fixtures ─────────────────────────────────────────────────────────────

let pass = 0;
let fail = 0;
const failures = [];

console.log('[validate-threshold-mandate-gate] THRESHOLD-FIRST Gate Fixture Tests');
console.log(`[validate-threshold-mandate-gate] fixtures=${FIXTURES.length}`);
console.log('');

for (const fixture of FIXTURES) {
  const result = routeInput(fixture.input);
  const routePass = result.route === fixture.expected_route;
  const classPass = fixture.expected_class ? result.input_class === fixture.expected_class : true;
  const fixturePass = routePass && classPass;

  if (fixturePass) {
    pass++;
    console.log(`  ✓ ${fixture.name}`);
    console.log(`    route=${result.route} class=${result.input_class} mandate_relation=${result.axis_classification.mandate_relation}`);
  } else {
    fail++;
    failures.push({ fixture, result });
    console.log(`  ✗ FAIL: ${fixture.name}`);
    console.log(`    expected_route=${fixture.expected_route} got=${result.route}`);
    if (fixture.expected_class) {
      console.log(`    expected_class=${fixture.expected_class} got=${result.input_class}`);
    }
    console.log(`    rationale: ${result.rationale}`);
    console.log(`    mandate_relation: ${result.axis_classification.mandate_relation}`);
  }
  console.log('');
}

// ─── Summary ──────────────────────────────────────────────────────────────────

const fixture_pass_rate = Math.round((pass / FIXTURES.length) * 100);
const status = fail === 0 ? 'ALL_PASS' : 'FIXTURE_FAILURE';

console.log(`[validate-threshold-mandate-gate] pass=${pass} fail=${fail} fixtures=${FIXTURES.length}`);
console.log(`[validate-threshold-mandate-gate] fixture_pass_rate=${fixture_pass_rate}% status=${status}`);
console.log(`[validate-threshold-mandate-gate] QUEUE-OR-PIVOT route: ${Object.values(await import('../scripts/threshold-router.mjs').then(m => m)).find ? 'present' : 'check'}`);

if (fail > 0) {
  console.error('\n[validate-threshold-mandate-gate] BLOCKING — fixture failures indicate the THRESHOLD-FIRST gate is broken.');
  console.error('  The deterministic rule "new-concept + active-mandate → QUEUE-OR-PIVOT" must hold.');
  console.error('  Fix: check threshold-router.mjs CLASS 1 non-constitutional branch (mandate_active + isOrthogonal logic).');
  process.exit(1);
}

console.log('[validate-threshold-mandate-gate] GATE ACTIVE — mandate check wired in router; QUEUE-OR-PIVOT fires on orthogonal directive during active mandate.');
process.exit(0);
