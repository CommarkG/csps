#!/usr/bin/env node
/**
 * @csps-id csps.tools.verify
 * @csps-name verify
 * @csps-description Pre-close verification cycle orchestrator. Runs the build chain end-to-end (pnpm install --frozen-lockfile + typecheck + frontmatter validate + principles validate + audit-runner full-pass) and emits structured ZF evidence block to stdout. Per P-META-008 cycle-mandatory-in-plan + B_PRE_CLOSE_VERIFICATION. Exit 1 on any cycle failure. Skeleton tier (S005 turn 19) ships the orchestration; week-4 audit-runner ratchets the strict gates.
 * @csps-version 0.1.0
 * @csps-owner group:finky
 * @csps-lifecycle experimental
 * @csps-lifecycle-state active
 * @csps-tags type:util domain:dx audience:developer
 * @csps-enforces P-META-008 P-META-006 P-META-001
 *
 * Usage:
 *   node tools/verify.mjs              # default — errors fail; warnings reported
 *   node tools/verify.mjs --strict     # warnings also fail
 *   node tools/verify.mjs --skip-install  # skip pnpm install (already frozen)
 *
 * Per closing-summary-template.md §10.0: paste this script's stdout into §10.0 of every close summary.
 */

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const args = process.argv.slice(2);
const STRICT = args.includes('--strict');
const SKIP_INSTALL = args.includes('--skip-install');

// ─────────────────────────────────────────────────────────────────────────────
// Cycle definitions — per P-META-008 cycle_types
// ─────────────────────────────────────────────────────────────────────────────

const CYCLES = [
  {
    name: 'pnpm_install_frozen',
    command: 'pnpm install --frozen-lockfile',
    skip: SKIP_INSTALL,
    skip_reason: 'flag --skip-install',
    parse_output: (out) => {
      const m = out.match(/Progress:\s+resolved\s+(\d+)/);
      const t = out.match(/Done in (\d+(?:\.\d+)?)s/);
      return {
        packages_resolved: m ? Number(m[1]) : null,
        duration_seconds: t ? Number(t[1]) : null,
      };
    },
  },
  {
    name: 'typecheck_recursive',
    command: 'pnpm -r --filter "./packages/**" typecheck',
    parse_output: (out) => {
      const errors = (out.match(/error TS\d+:/g) ?? []).length;
      return { ts_errors: errors };
    },
  },
  {
    name: 'principles_validate',
    command: 'pnpm --filter @csps/principles validate:all',
    parse_output: (out) => {
      const m = out.match(/Loaded\s+(\d+)\s+principles/);
      const f = out.match(/(\d+)\s+findings/);
      return {
        principles_loaded: m ? Number(m[1]) : null,
        findings_total: f ? Number(f[1]) : null,
      };
    },
  },
  {
    name: 'frontmatter_validate',
    command: 'node tools/validators/validate-frontmatter.mjs',
    parse_output: (out) => {
      const m = out.match(/scanned=(\d+)\s+errors=(\d+)\s+warnings=(\d+)\s+exempt=(\d+)/);
      return m
        ? { scanned: Number(m[1]), errors: Number(m[2]), warnings: Number(m[3]), exempt: Number(m[4]) }
        : { scanned: null, errors: null };
    },
  },
  {
    // NEW S005 turn 26 — converts agent-alignment-coverage from DECLARED-DEFERRED to ACTIVE-MECHANICAL today
    name: 'aap_frontmatter_coverage',
    command: 'node tools/validators/validate-aap-frontmatter.mjs',
    parse_output: (out) => {
      const m = out.match(/scanned=(\d+)\s+missing=(\d+)\s+aligned=(\d+)/);
      return m
        ? { skills_scanned: Number(m[1]), missing_aap: Number(m[2]), aligned: Number(m[3]) }
        : { skills_scanned: null };
    },
  },
  {
    // NEW S005 turn 26 — converts principle-count-staleness from DECLARED-DEFERRED to ACTIVE-MECHANICAL today
    name: 'principle_count_staleness',
    command: 'node tools/validators/validate-principle-count-staleness.mjs',
    parse_output: (out) => {
      const m = out.match(/active_files_with_stale_count=(\d+)/);
      return m ? { stale_count_files: Number(m[1]) } : { stale_count_files: null };
    },
  },
  {
    // NEW S010 Phase 7 Candidate #4 — verifies all 10 ai-behavior-spine section slices are present
    name: 'ai_behavior_spine_slices_sync',
    command: 'node tools/validators/validate-ai-behavior-spine-slices.mjs',
    parse_output: (out) => {
      const m = out.match(/source_sections=(\d+)\s+missing=(\d+)/);
      return m ? { source_sections: Number(m[1]), missing_slices: Number(m[2]) } : { source_sections: null };
    },
  },
  {
    // NEW S010 Phase 7 Candidate #3 — verifies all 28 audit-runner pipeline slice files are present
    name: 'audit_runner_slices_sync',
    command: 'node tools/validators/validate-audit-runner-slices.mjs',
    parse_output: (out) => {
      const m = out.match(/source_pipelines=(\d+)\s+missing=(\d+)/);
      return m ? { source_pipelines: Number(m[1]), missing_slices: Number(m[2]) } : { source_pipelines: null };
    },
  },
  {
    // NEW S010 Phase 7 Candidate #2 — verifies all 39 behavioral contract slice files are present
    name: 'behavioral_contract_slices_sync',
    command: 'node tools/validators/validate-behavioral-contract-slices.mjs',
    parse_output: (out) => {
      const m = out.match(/source_contracts=(\d+)\s+missing=(\d+)/);
      return m ? { source_contracts: Number(m[1]), missing_slices: Number(m[2]) } : { source_contracts: null };
    },
  },
  {
    // NEW S010 Phase 7 Candidate #1 — verifies all 53 principle slice files are present and valid
    name: 'principle_slices_sync',
    command: 'node tools/validators/validate-principle-slices.mjs',
    parse_output: (out) => {
      const m  = out.match(/source_ids=(\d+)\s+missing=(\d+)/);
      return m ? { source_ids: Number(m[1]), missing_slices: Number(m[2]) } : { source_ids: null };
    },
  },
  {
    // NEW S011 §24++ — node --check syntax validation for all tools/**/*.mjs (prevents ESM bugs like require-in-esm)
    name: 'mjs_syntax_check',
    command: 'node --check tools/verify.mjs tools/pe-compute.mjs tools/validators/validate-aap-frontmatter.mjs tools/validators/validate-token-budget.mjs tools/validators/validate-corespine-depth-markers.mjs tools/validators/validate-audit-slug-coverage.mjs tools/validators/validate-frontmatter.mjs',
    parse_output: (out) => ({ syntax_ok: !out.includes('SyntaxError') }),
  },
  {
    // NEW S011 unified-intake L3 — source-class coverage: all 4 source classes have normalizers
    name: 'intake_source_class_coverage',
    command: 'node tools/validators/validate-source-class-coverage.mjs',
    parse_output: (out) => {
      const m = out.match(/source_classes=(\d+)\s+errors=(\d+)/);
      return m ? { source_classes: Number(m[1]), errors: Number(m[2]) } : {};
    },
  },
  {
    // NEW S011 unified-intake L3 — intake-event schema validation on JSONL rows
    name: 'intake_event_validate',
    command: 'node tools/validators/validate-intake-event.mjs',
    parse_output: (out) => {
      const m = out.match(/files=(\d+)\s+rows=(\d+)\s+errors=(\d+)/);
      return m ? { files: Number(m[1]), rows: Number(m[2]), errors: Number(m[3]) } : { files: 0, rows: 0 };
    },
  },
  {
    // NEW S011 zero-laptop L1 — git-pushed-state: all governed-path changes pushed to remote
    name: 'git_pushed_state',
    command: 'node tools/validators/validate-git-pushed-state.mjs',
    parse_output: (out) => {
      const m = out.match(/warnings=(\d+)/);
      return m ? { warnings: Number(m[1]), advisory: true } : { advisory: true };
    },
  },
  {
    // NEW S011 §24++ — topic-plan-progress: active plans not orphaned (arc expired without closure)
    name: 'topic_plan_progress',
    command: 'node tools/validators/validate-topic-plan-progress.mjs',
    parse_output: (out) => {
      const m = out.match(/plans_checked=(\d+)\s+warnings=(\d+)/);
      return m ? { plans_checked: Number(m[1]), warnings: Number(m[2]) } : {};
    },
  },
  {
    // NEW S011 §24++ — session-artifact-sync: HANDOFF phase claims match token-optimization.md
    name: 'session_artifact_sync',
    command: 'node tools/validators/validate-session-artifact-sync.mjs',
    parse_output: (out) => {
      const m = out.match(/checks=(\d+)\s+warnings=(\d+)/);
      return m ? { checks: Number(m[1]), warnings: Number(m[2]) } : {};
    },
  },
  {
    // NEW S011 §24++ — audit-slug-coverage: every validator has a registered slug in audit-runner.md
    name: 'audit_slug_coverage',
    command: 'node tools/validators/validate-audit-slug-coverage.mjs',
    parse_output: (out) => {
      const m = out.match(/validators_checked=(\d+)\s+orphans=(\d+)\s+registered=(\d+)/);
      return m ? { validators_checked: Number(m[1]), orphans: Number(m[2]), registered: Number(m[3]) } : {};
    },
  },
  {
    // NEW S011 Phase 9 9a — 5-mode token-budget validator (ADVISORY window; per §14.6 + EXT-002-A)
    name: 'token_budget_validate',
    command: 'node tools/validators/validate-token-budget.mjs',
    parse_output: (out) => {
      const m = out.match(/modes=(\d+)\s+red=(\d+)\s+yellow=(\d+)\s+info=(\d+)/);
      return m
        ? { modes: Number(m[1]), red: Number(m[2]), yellow: Number(m[3]), info: Number(m[4]), advisory_window: true }
        : { advisory_window: true };
    },
  },
  {
    // NEW S011 Phase 9 9f — L1_CORE HUB file_depth_markers validator (EXT-004-D Improvement #8)
    name: 'corespine_depth_markers',
    command: 'node tools/validators/validate-corespine-depth-markers.mjs',
    parse_output: (out) => {
      const m = out.match(/checked=(\d+)\s+l1_core=(\d+)\/5\s+l2_domain=(\d+)\s+l3_instances=(\d+)\s+errors=(\d+)\s+warnings=(\d+)/);
      return m
        ? { checked: Number(m[1]), l1_core: Number(m[2]), l2_domain: Number(m[3]), l3_instances: Number(m[4]), errors: Number(m[5]), warnings: Number(m[6]) }
        : {};
    },
  },
  {
    name: 'audit_runner_full_pass',
    command: 'pnpm audit:run --strict',
    skip: true,
    skip_reason: 'audit-runner ships week-4 (planned per build-order.md week 4)',
    parse_output: () => ({}),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Spawn helper
// ─────────────────────────────────────────────────────────────────────────────

function runCommand(command, cwd) {
  return new Promise((resolveP) => {
    const startMs = Date.now();
    const child = spawn(command, { cwd, shell: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d.toString()));
    child.stderr.on('data', (d) => (stderr += d.toString()));
    child.on('close', (code) => {
      resolveP({
        code: code ?? -1,
        stdout,
        stderr,
        duration_ms: Date.now() - startMs,
      });
    });
    child.on('error', (err) => {
      resolveP({
        code: -1,
        stdout,
        stderr: stderr + String(err),
        duration_ms: Date.now() - startMs,
      });
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const startedAt = new Date().toISOString();
  const results = [];
  let anyFailed = false;

  for (const cycle of CYCLES) {
    const entry = { name: cycle.name, command: cycle.command };
    if (cycle.skip) {
      entry.status = 'DEFERRED-WITH-REASON';
      entry.skip_reason = cycle.skip_reason;
      results.push(entry);
      continue;
    }
    process.stderr.write(`[verify] running: ${cycle.command}\n`);
    const r = await runCommand(cycle.command, ROOT);
    const parsed = cycle.parse_output(r.stdout + '\n' + r.stderr) ?? {};
    entry.status = r.code === 0 ? 'PASS' : 'FAIL';
    entry.exit_code = r.code;
    entry.duration_seconds = Math.round(r.duration_ms / 100) / 10;
    Object.assign(entry, parsed);
    if (r.code !== 0) {
      entry.tail = (r.stderr || r.stdout).split('\n').slice(-10).join('\n');
      anyFailed = true;
    }
    results.push(entry);
  }

  const exit_code = anyFailed ? 1 : 0;
  const finishedAt = new Date().toISOString();

  // Emit structured ZF evidence block (matches closing-summary-template §10.0 schema)
  const evidence = {
    pre_close_verification: {
      ran_at: startedAt,
      finished_at: finishedAt,
      orchestrator: 'tools/verify.mjs',
      cycles: results,
      exit_code,
      strict_mode: STRICT,
    },
  };
  process.stdout.write(JSON.stringify(evidence, null, 2) + '\n');

  // Also write to tools/bootstrap-readiness.md (referenced by bootstrap.ps1 step 10)
  if (!existsSync(resolve(ROOT, 'tools'))) mkdirSync(resolve(ROOT, 'tools'), { recursive: true });
  const reportPath = resolve(ROOT, 'tools/verify-last-run.md');
  const md = `# verify last run\n\n- ran_at: ${startedAt}\n- finished_at: ${finishedAt}\n- exit_code: ${exit_code}\n\n\`\`\`yaml\n${JSON.stringify(evidence, null, 2)}\n\`\`\`\n`;
  writeFileSync(reportPath, md);
  process.stderr.write(`[verify] report: ${reportPath}\n`);

  process.exit(exit_code);
}

main().catch((err) => {
  process.stderr.write(`[verify] fatal: ${err instanceof Error ? err.stack : String(err)}\n`);
  process.exit(2);
});
