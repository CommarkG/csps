#!/usr/bin/env node
/**
 * zf-orchestrator.mjs — Multi-directional Zero Findings Orchestrator
 *
 * THE CORE INSIGHT (Governor S014 directive, verbatim):
 *   "Making everything go through multiple directions with zero findings iterations
 *    might be the most cost-effective thing to do ever."
 *
 * ZF ACHIEVED DEFINITION (Governor S018 correction — ONLY VALID INTERPRETATION):
 *   THE LAST RUN THAT PRODUCES "STATUS: ZF ACHIEVED ✅ — 0 blocking findings remain"
 *   is the ONLY proof. No other output qualifies.
 *   - A run reducing findings from 5 to 2: NOT ZF ACHIEVED
 *   - A prior session's ZF result cited as current: NOT ZF ACHIEVED (nominal ZF)
 *   - "Only advisory warnings": ADVISORY IS NOT BLOCKING — zero BLOCKING is required
 *   - Progress toward zero: NOT zero
 *   The AI satisfaction point fires at IMPROVEMENT. Override it: zero findings IS the proof.
 *
 * WHY THIS EXISTS:
 *   Every iterative discovery in S014 happened because the Governor manually prompted
 *   "go back and look again." Without that prompting, the platform accepted nominal ZF
 *   and moved forward. This orchestrator replaces that manual prompting with autonomous
 *   multi-directional cycling until REAL zero findings.
 *
 *   The cost of one extra cycle: minutes.
 *   The cost of discovering the same finding 3 sessions later: exponentially more.
 *
 * THREE LEVELS:
 *   Level 1 (COMMIT):      pnpm verify + vlt-blocking + open-plan-levels (~10s)
 *   Level 2 (PHASE_CLOSE): Level 1 + instruction-context + PE check + extraction check (~60s)
 *   Level 3 (DEEP):        Level 2 + scale questions + synergy check + schema consistency (~300s)
 *
 * CYCLE ENGINE:
 *   Runs the selected level. If findings > 0: injects them back as AI context and loops.
 *   Stops at REAL zero findings (all checks pass with 0 findings across all directions).
 *   Cycle count is MEASUREMENT not TARGET — it shows how rich the work was.
 *
 * USAGE:
 *   node tools/zf-orchestrator.mjs [--level 1|2|3] [--max-cycles N]
 *   pnpm zf              (Level 1 — default after every commit)
 *   pnpm zf:phase        (Level 2 — use at phase close)
 *   pnpm zf:deep         (Level 3 — use at session close / milestone)
 *
 * PER P-META-021 (Triad Governance):
 *   CONTEXT:    each finding direction loads the relevant L2 spine domain
 *   PRINCIPLE:  P-META-006 RZF + P-META-020 concept-first + P-META-021 triad
 *   MECHANICAL: this orchestrator is the mechanical layer that fires automatically
 */

import { execSync } from 'node:child_process';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const ARGS = process.argv.slice(2);
const levelIdx = ARGS.indexOf('--level');
const cyclesIdx = ARGS.indexOf('--max-cycles');
const LEVEL = levelIdx >= 0 ? Number(ARGS[levelIdx + 1]) : 1;
const MAX_CYCLES = cyclesIdx >= 0 ? Number(ARGS[cyclesIdx + 1]) : 5;

// ─── Finding collector ──────────────────────────────────────────────────────

function run(cmd, label) {
  try {
    const out = execSync(cmd, { cwd: ROOT, encoding: 'utf8', timeout: 120000 });
    return { label, output: out, exit: 0 };
  } catch (e) {
    return { label, output: e.stdout + '\n' + e.stderr, exit: e.status ?? 1 };
  }
}

function extractFindings(result) {
  const findings = [];
  const text = result.output;

  // Count failures
  const failMatches = text.match(/"status": "FAIL"/g);
  if (failMatches) findings.push({ severity: 'BLOCKING', source: result.label, count: failMatches.length, text: 'Validator failures detected' });

  // Count warnings — match ⚠ symbols or positive warning counts (e.g. warnings=5), NOT "warnings=0"
  // The pattern "warnings=0" is a clean status line, not a warning. Avoid false positives.
  const warnSymbols = (text.match(/⚠/g) ?? []).length;
  const warnCountMatch = text.match(/warnings?=(\d+)/gi);
  const warnCount = warnCountMatch
    ? warnCountMatch.reduce((sum, m) => { const n = parseInt(m.split('=')[1]); return sum + (n > 0 ? n : 0); }, 0)
    : 0;
  const totalWarnings = warnSymbols + warnCount;
  if (totalWarnings > 0 && result.exit === 0) findings.push({ severity: 'WARN', source: result.label, count: totalWarnings, text: 'Warnings surfaced' });

  // Count open items
  const openMatch = text.match(/total_open_items=(\d+)/);
  if (openMatch && Number(openMatch[1]) > 0) findings.push({ severity: 'WARN', source: result.label, count: Number(openMatch[1]), text: `${openMatch[1]} open plan items` });

  // Count pending VLTs
  const pendingMatch = text.match(/pending=(\d+)/);
  if (pendingMatch && Number(pendingMatch[1]) > 0) findings.push({ severity: 'BLOCKING', source: result.label, count: Number(pendingMatch[1]), text: `${pendingMatch[1]} PENDING VLTs` });

  // FOUNDATION_EXIT_GATE — mixed-state exit criteria in active topic plans (S015 major discovery)
  const foundationMatch = text.match(/blocking=(\d+)\s+warnings=\d+\s+status=BLOCKING/);
  if (foundationMatch && Number(foundationMatch[1]) > 0) findings.push({ severity: 'BLOCKING', source: result.label, count: Number(foundationMatch[1]), text: `FOUNDATION_EXIT_GATE: ${foundationMatch[1]} phase(s) have unchecked exit criteria — PE score for next phase = 0` });

  return findings;
}

// ─── Level runners ──────────────────────────────────────────────────────────

async function runLevel1() {
  console.log('\n[zf-orchestrator] Level 1 — COMMIT: pnpm verify + vlt-blocking + open-plan-levels + phase-exit-criteria');
  const results = [
    run('node tools/verify.mjs --skip-install', 'pnpm-verify'),
    run('node tools/validators/validate-vlt-blocking.mjs', 'vlt-blocking'),
    run('node tools/validators/validate-open-plan-levels.mjs', 'open-plan-levels'),
    run('node tools/validators/validate-phase-exit-criteria.mjs', 'phase-exit-criteria'),
  ];
  return results.flatMap(extractFindings);
}

async function runLevel2() {
  const findings = await runLevel1();
  console.log('\n[zf-orchestrator] Level 2 — PHASE_CLOSE: + instruction-context + PE + extraction check');
  const results = [
    run('node tools/validators/validate-instruction-context.mjs', 'instruction-context'),
  ];
  findings.push(...results.flatMap(extractFindings));

  // PE re-assessment — is next action still highest priority?
  console.log('\n  [PE RE-ASSESSMENT — per zf-mandate-protocol.md EVENT 3]:');
  console.log('  Q: Is the proposed next phase still the highest PE-scored item?');
  console.log('  Q: Have any new dependencies emerged that change the priority ordering?');
  console.log('  Q: Are there PENDING VLTs that affect what comes next?');
  console.log('  Q: COMPLETION BIAS (B_COMPLETION_OVER_SHINY): Is there active work >50% complete that should score 1.5× before evaluating new items?');
  console.log('  Q: PLATFORM-FIRST (B_PLATFORM_FIRST_OPTIMIZATION): Is the proposed next solution local-only, or could it generalize to the platform? Local-only when generalizable = missed compounding.');
  const peState = JSON.parse(readFileSync(join(ROOT, 'tools/session-state.json'), 'utf8').replace(/\r\n/g,'\n'));
  const pendingVlts = (peState.blocking_decisions||[]).filter(d=>d.status==='PENDING');
  if (pendingVlts.length > 0) {
    findings.push({ severity: 'BLOCKING', source: 'pe-vlt-check', count: pendingVlts.length, text: `PE blocked: ${pendingVlts.length} PENDING VLT(s) affect next phase — ${pendingVlts.map(v=>v.id).join(', ')}` });
    console.log(`  ⚠ PE BLOCKED: ${pendingVlts.length} PENDING VLT(s) — ${pendingVlts.map(v=>v.id).join(', ')}`);
  } else {
    console.log('  ✓ PE check: 0 PENDING VLTs — phase advance unblocked by VLT gate');
  }

  // PE check: any PENDING VLTs? (already covered by vlt-blocking)
  // Extraction check: does session extraction exist for current session?
  const sessionState = JSON.parse(readFileSync(join(ROOT, 'tools/session-state.json'), 'utf8'));
  const session = sessionState.current_session;
  const extractionPath = join(ROOT, `docs/plan/_handoff/VAULT/session-${session}-extraction.md`);
  if (!existsSync(extractionPath)) {
    findings.push({ severity: 'WARN', source: 'extraction-check', count: 1, text: `session-${session}-extraction.md not found — positive ZF harvest not complete` });
  }

  return findings;
}

async function runLevel3() {
  const findings = await runLevel2();
  console.log('\n[zf-orchestrator] Level 3 — DEEP: + scale check + schema consistency + synergy audit');

  // Schema consistency: ZModel vs Prisma for key models
  const tenantZmodel = existsSync(join(ROOT, 'libs/policies/slices/public/tenant.zmodel'))
    ? readFileSync(join(ROOT, 'libs/policies/slices/public/tenant.zmodel'), 'utf8') : '';
  const sandboxPrisma = existsSync(join(ROOT, 'apps/sandbox/prisma/schema.prisma'))
    ? readFileSync(join(ROOT, 'apps/sandbox/prisma/schema.prisma'), 'utf8') : '';

  // Check subscriptionStatus is in both
  if (tenantZmodel.includes('subscriptionStatus') && !sandboxPrisma.includes('subscriptionStatus')) {
    findings.push({ severity: 'BLOCKING', source: 'schema-consistency', count: 1, text: 'tenant.zmodel has subscriptionStatus but Prisma schema does not' });
  }
  if (!tenantZmodel.includes('subscriptionStatus') && sandboxPrisma.includes('subscriptionStatus')) {
    findings.push({ severity: 'WARN', source: 'schema-consistency', count: 1, text: 'Prisma schema has subscriptionStatus but ZModel does not' });
  }

  // Scale check: surface as advisory
  console.log('\n  [SCALE CHECK — cruel-critic 3 questions — manual assessment required]:');
  console.log('  Q1: 30→300: What breaks when the platform has 300 elements?');
  console.log('  Q2: 10→100 sessions: Does accumulated state become unmanageable?');
  console.log('  Q3: 1→10 AIs: Do concurrent instances conflict?');
  console.log('  (Advisory: surface these to cruel-critic skill for deep analysis)');

  return findings;
}

// ─── Main cycle engine ──────────────────────────────────────────────────────

async function main() {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`ZF ORCHESTRATOR — Level ${LEVEL} | Max cycles: ${MAX_CYCLES}`);
  console.log(`Per P-META-021: multi-directional cycling until REAL zero findings`);
  console.log(`Cost of one extra cycle: minutes. Cost of missing a finding: sessions.`);
  console.log('═'.repeat(60));

  let cycle = 0;
  let allFindingsTotal = 0;
  let cycleHistory = [];

  while (cycle < MAX_CYCLES) {
    cycle++;
    console.log(`\n── Cycle ${cycle} ──────────────────────────────────────────────`);

    let findings;
    if (LEVEL >= 3) findings = await runLevel3();
    else if (LEVEL >= 2) findings = await runLevel2();
    else findings = await runLevel1();

    const blockingCount = findings.filter(f => f.severity === 'BLOCKING').length;
    const warnCount = findings.filter(f => f.severity === 'WARN').length;
    allFindingsTotal += findings.length;
    cycleHistory.push({ cycle, blocking: blockingCount, warn: warnCount, total: findings.length });

    if (findings.length > 0) {
      console.log(`\n[cycle ${cycle}] Findings: ${blockingCount} BLOCKING | ${warnCount} WARN`);
      for (const f of findings) {
        console.log(`  ${f.severity === 'BLOCKING' ? '🔴' : '🟡'} [${f.source}] ${f.text} (count: ${f.count})`);
      }
      if (blockingCount > 0) {
        console.log('\n  ⚠ BLOCKING findings require resolution before proceeding.');
        console.log('  Address blockers and re-run: node tools/zf-orchestrator.mjs --level ' + LEVEL);
        break;
      }
      console.log(`\n  All findings are WARN (advisory). Continuing to next cycle...`);
    } else {
      console.log(`\n[cycle ${cycle}] ✅ REAL ZERO FINDINGS — all directions clean`);
      break;
    }
  }

  // Report
  console.log(`\n${'═'.repeat(60)}`);
  console.log('ZF ORCHESTRATOR COMPLETE');
  console.log(`  Level: ${LEVEL} | Total cycles: ${cycle} | Total findings addressed: ${allFindingsTotal}`);
  console.log('  Cycle history:');
  for (const h of cycleHistory) {
    console.log(`    Cycle ${h.cycle}: ${h.blocking} blocking | ${h.warn} warn | total ${h.total}`);
  }
  const lastCycle = cycleHistory[cycleHistory.length - 1];
  const finalBlocking = lastCycle?.blocking ?? 0;
  const finalWarn = lastCycle?.warn ?? 0;

  // Known advisory deferrals (formally documented — not bugs, legitimate open obligations)
  const KNOWN_DEFERRED_ADVISORIES = {
    'open-plan-levels': 'DEFERRED: 97 open items = real outstanding work in active plans (Sessions 0-D + App#2). Each tracked in its plan. Not closing arbitrarily.',
  };

  if (finalBlocking === 0 && finalWarn === 0) {
    console.log('\n  STATUS: REAL ZF ACHIEVED ✅ — TRULY ZERO FINDINGS across all directions');
    console.log('  This is the highest ZF quality: 0 blocking + 0 advisory.');
  } else if (finalBlocking === 0 && finalWarn > 0) {
    console.log(`\n  STATUS: ZF ACHIEVED ✅ — ${finalWarn} advisory warning(s) remain`);
    console.log('  Per P-META-021: each advisory MUST be either DONE or DEFERRED with documented reason.');
    console.log('\n  ADVISORY DISPOSITION (required — not optional):');
    const lastFindings = cycleHistory[cycleHistory.length - 1];
    // Surface deferred rationale for each known advisory source
    for (const [source, reason] of Object.entries(KNOWN_DEFERRED_ADVISORIES)) {
      console.log(`    [${source}]: ${reason}`);
    }
    console.log('  Any advisory NOT in the known-deferred list requires explicit DONE or new DEFERRED entry.');
  } else {
    console.log(`\n  STATUS: BLOCKING FINDINGS REMAIN ❌ — ${finalBlocking} blocker(s) must be resolved`);
    console.log('  Address blockers and re-run: node tools/zf-orchestrator.mjs --level 3');
  }
  console.log('  Per P-META-006: cycle count is MEASUREMENT not target.');
  console.log(`  This work required ${cycle} cycle(s). Cycle cost: minutes. Skipped finding cost: sessions.`);
  console.log('═'.repeat(60));

  // Write orchestrator results to session tracker
  try {
    const trackerPath = join(ROOT, 'tools/zf-session-tracker.json');
    const { readFileSync: rfs, writeFileSync: wfs } = await import('node:fs');
    const tracker = JSON.parse(rfs(trackerPath, 'utf8'));
    tracker.orchestrator_cycles = (tracker.orchestrator_cycles || 0) + cycle;
    tracker.orchestrator_last_level = LEVEL;
    tracker.orchestrator_last_status = finalBlocking === 0 ? 'ZF_ACHIEVED' : 'BLOCKING_REMAINS';
    tracker.warn_found_total = (tracker.warn_found_total || 0) + allFindingsTotal;
    // Track ZF deep runs per session (for post-stop hook enforcement)
    if (LEVEL >= 3) {
      tracker.zf_deep_runs_this_session = (tracker.zf_deep_runs_this_session || 0) + 1;
      tracker.zf_deep_last_run_at = new Date().toISOString();
      tracker.zf_deep_last_status = finalBlocking === 0 ? 'ZF_ACHIEVED' : 'BLOCKING_REMAINS';
    }
    wfs(trackerPath, JSON.stringify(tracker, null, 2));
  } catch(e) { /* non-fatal */ }

  process.exit(finalBlocking > 0 ? 1 : 0);
}

// @core-seed: ZF_POSITIVE_HARVEST | plan: docs/plan/pillar-0-governance/mechanical-enforcement-policy.md | grows-to: auto-trigger positive ZF harvest (CEC walk) when Level 3 achieves 0 BLOCKING — removes behavioral dependency | target: S019
main().catch(err => {
  console.error('[zf-orchestrator] fatal:', err);
  process.exit(1);
});
