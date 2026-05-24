// WHO: Platform developers + CI checking which non-pnpm-verify audit pipelines are failing
// WHAT: Dispatcher that runs pipelines 2-6 sequentially and collects results into a JSON report
// PREVENTS: 12 designed pipelines silently doing nothing (Audit Pipeline Coverage stuck at 8%)
// RISK: Circular dependency — pipelines import validators that import each other → keep dispatcher thin
// SCOPE: Pipelines 2-6 active (Pipeline 6 validate-ux-audit.mjs LIVE S060 PROTO-I); pipeline 1 = pnpm verify
//
// @csps-id csps.libs.audits.dispatcher
// @csps-name audit-dispatcher
// @csps-description Audit pipeline dispatcher Phase 1 — runs pipelines 2-6, records results.
//   Pipeline 1 (pnpm verify) runs separately. Pipelines 2-6 add governance + quality checks.
//   Output: tools/data/audit-pipeline-last-run.json
// @csps-version 0.1.0
// @csps-owner group:finky
// @csps-lifecycle production
// @csps-lifecycle-state active
// @csps-tags type:library domain:audits audience:developer
// @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE audit-runner

import { execSync } from 'node:child_process';
import { writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../../..');
const VALIDATORS_DIR = join(ROOT, 'tools/validators');
const OUTPUT_FILE = join(ROOT, 'tools/data/audit-pipeline-last-run.json');

export interface PipelineResult {
  id: number;
  name: string;
  validator: string;
  status: 'pass' | 'advisory' | 'fail' | 'skip';
  exit_code: number;
  blocking: number;
  advisory: number;
  output_tail: string;
  duration_ms: number;
}

function runPipeline(id: number, name: string, validator: string): PipelineResult {
  const validatorPath = join(VALIDATORS_DIR, validator);

  if (!existsSync(validatorPath)) {
    return {
      id, name, validator, status: 'skip', exit_code: 0,
      blocking: 0, advisory: 0,
      output_tail: `[skip] ${validator} not found — pipeline not yet built`,
      duration_ms: 0,
    };
  }

  const start = Date.now();
  let output = '';
  let exitCode = 0;

  try {
    output = execSync(`node "${validatorPath}"`, {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: 30000,
    });
  } catch (e: unknown) {
    const err = e as { stdout?: string; status?: number; message?: string };
    output = err.stdout || err.message || '';
    exitCode = err.status ?? 1;
  }

  const duration_ms = Date.now() - start;
  const blockingMatch = output.match(/blocking=(\d+)/);
  const advisoryMatch = output.match(/advisory=(\d+)/);
  const blocking = blockingMatch ? parseInt(blockingMatch[1]) : 0;
  const advisory = advisoryMatch ? parseInt(advisoryMatch[1]) : 0;
  const status: PipelineResult['status'] =
    exitCode > 0 ? 'fail' :
    blocking > 0 ? 'fail' :
    advisory > 0 ? 'advisory' : 'pass';

  const lines = output.trim().split('\n');
  const output_tail = lines.slice(-3).join('\n');

  return { id, name, validator, status, exit_code: exitCode, blocking, advisory, output_tail, duration_ms };
}

// Pipeline definitions (Phase 1 — pipelines 2-6)
// Pipeline 1 = pnpm verify (runs separately, always active)
// Pipeline 6 (validate-ux-audit.mjs) — LIVE S060 PROTO-I
const PIPELINE_DEFINITIONS = [
  { id: 2, name: 'Boundary Alignment',      validator: 'validate-boundary-alignment.mjs' },
  { id: 3, name: 'Communication Quality',   validator: 'validate-communication-quality.mjs' },
  { id: 4, name: 'Agent Calls',             validator: 'validate-agent-calls.mjs' },
  { id: 5, name: 'Quality Alignment',       validator: 'validate-quality-alignment.mjs' },
  { id: 6, name: 'UX Audit',               validator: 'validate-ux-audit.mjs' }, // skip if not found
];

/**
 * Run all pipelines 2-6 sequentially (not parallel — avoid resource conflicts).
 * Returns array of PipelineResult objects.
 */
export async function runAllPipelines(): Promise<PipelineResult[]> {
  const results: PipelineResult[] = [];
  for (const p of PIPELINE_DEFINITIONS) {
    const result = runPipeline(p.id, p.name, p.validator);
    results.push(result);
    const icon = result.status === 'pass' ? '✓' : result.status === 'advisory' ? '⚠' : result.status === 'skip' ? '○' : '✗';
    console.log(`  ${icon} Pipeline ${result.id} ${result.name}: ${result.status} (${result.duration_ms}ms, blocking=${result.blocking}, advisory=${result.advisory})`);
  }
  return results;
}

// ── CLI mode (called via pnpm audit:run) ────────────────────────────────────────
const runCount = PIPELINE_DEFINITIONS.filter(p =>
  existsSync(join(VALIDATORS_DIR, p.validator))
).length;

runAllPipelines().then(results => {
  const pass = results.filter(r => r.status === 'pass').length;
  const advisory = results.filter(r => r.status === 'advisory').length;
  const fail = results.filter(r => r.status === 'fail').length;
  const skip = results.filter(r => r.status === 'skip').length;

  const output = {
    ran_at: new Date().toISOString(),
    pipelines_run: runCount,
    total_running: runCount + 1, // +1 for pipeline 1 (pnpm verify)
    total_designed: 13,
    coverage_pct: Math.round(((runCount + 1) / 13) * 100),
    summary: { pass, advisory, fail, skip },
    results,
  };

  console.log('\n[audit-dispatcher] Summary:');
  console.log(`  Pipelines run: ${runCount + 1}/13 (including pipeline 1 pnpm verify)`);
  console.log(`  Pass: ${pass} | Advisory: ${advisory} | Fail: ${fail} | Skip: ${skip}`);

  // Write results to file
  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`  Results saved → tools/data/audit-pipeline-last-run.json`);
  console.log(`[audit-dispatcher] exit_code=0`);
});
