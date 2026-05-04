#!/usr/bin/env node
/**
 * @csps-id csps.tools.measure-token-cost
 * @csps-name measure-token-cost
 * @csps-description Phase 1 baseline measurement script for the token-optimization topic-plan. Reads scenario JSONs from tools/scenarios/ + tokenizes each declared artifact via gpt-tokenizer (cl100k_base — Claude approximation; documented caveat). Emits per-scenario + aggregate token totals to docs/plan/_handoff/VAULT/token-cost-baseline-S<NNN>.json. Per token-optimization.md v0.3 §9.2 + cruel-critic Critique 4 (real tokenizer required; not heuristic). Composes with P-META-006 RZF (re-run IS the proof — measure before claim) + P-META-009 CCA (Layer 1 cost telemetry).
 * @csps-version 0.1.0
 * @csps-owner group:finky
 * @csps-lifecycle experimental
 * @csps-lifecycle-state active
 * @csps-tags type:util domain:dx domain:governance audience:developer
 * @csps-enforces P-META-006 P-META-009 P-META-016
 *
 * Usage:
 *   node tools/measure-token-cost.mjs              # default — measure all 8 scenarios; write baseline-S<session>.json
 *   node tools/measure-token-cost.mjs --session=S008  # override session label (default = parsed from env or fallback)
 *   node tools/measure-token-cost.mjs --output=path  # override output path
 *
 * Tokenizer caveat: gpt-tokenizer uses cl100k_base (OpenAI GPT-4 / GPT-3.5-turbo).
 * Claude tokens differ by ~5-10% in practice. Phase 2 element-review may switch to
 * @anthropic-ai/tokenizer (currently 0.0.4 — experimental) once mature; the JSON
 * baseline is forward-compatible (tokenizer field is recorded).
 */

import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { encode } from 'gpt-tokenizer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SCENARIOS_DIR = join(__dirname, 'scenarios');

const args = process.argv.slice(2);
const sessionArg = args.find((a) => a.startsWith('--session='));
const outputArg = args.find((a) => a.startsWith('--output='));
const SESSION = sessionArg ? sessionArg.split('=')[1] : 'S007';
const DEFAULT_OUTPUT = join(ROOT, 'docs/plan/_handoff/VAULT', `token-cost-baseline-${SESSION}.json`);
const OUTPUT_PATH = outputArg ? resolve(ROOT, outputArg.split('=')[1]) : DEFAULT_OUTPUT;

const TOKENIZER_NAME = 'gpt-tokenizer cl100k_base';
const TOKENIZER_VERSION = '3.4.0';
const TOKENIZER_NOTE = 'Claude approximation via OpenAI cl100k_base; ±5-10% vs Anthropic native. v0.2 may upgrade to @anthropic-ai/tokenizer when matured.';

function measureFile(relPath) {
  const fullPath = resolve(ROOT, relPath);
  if (!existsSync(fullPath)) {
    return { exists: false, tokens: 0, chars: 0, lines: 0, bytes: 0 };
  }
  const stat = statSync(fullPath);
  if (stat.isDirectory()) {
    return { exists: true, is_directory: true, tokens: 0, chars: 0, lines: 0, bytes: stat.size };
  }
  const content = readFileSync(fullPath, 'utf8');
  const tokens = encode(content).length;
  return {
    exists: true,
    tokens,
    chars: content.length,
    lines: content.split('\n').length,
    bytes: stat.size,
  };
}

function loadScenarios() {
  if (!existsSync(SCENARIOS_DIR)) {
    console.error(`✗ Scenarios directory not found: ${SCENARIOS_DIR}`);
    process.exit(1);
  }
  const files = readdirSync(SCENARIOS_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort();
  if (files.length === 0) {
    console.error(`✗ No scenario JSONs in ${SCENARIOS_DIR}`);
    process.exit(1);
  }
  return files.map((f) => {
    const content = readFileSync(join(SCENARIOS_DIR, f), 'utf8');
    try {
      return { file: f, ...JSON.parse(content) };
    } catch (e) {
      console.error(`✗ Failed to parse ${f}: ${e.message}`);
      process.exit(1);
    }
  });
}

function main() {
  const scenarios = loadScenarios();
  const results = {
    measured_at: new Date().toISOString(),
    session: SESSION,
    tokenizer: TOKENIZER_NAME,
    tokenizer_version: TOKENIZER_VERSION,
    tokenizer_note: TOKENIZER_NOTE,
    workspace_root: ROOT,
    scenarios: {},
    summary: {
      total_scenarios: 0,
      total_tokens_aggregate: 0,
      max_scenario_tokens: 0,
      max_scenario_id: null,
      total_artifacts_scanned: 0,
      total_missing_artifacts: 0,
    },
  };

  for (const scenario of scenarios) {
    const artifactResults = [];
    let scenarioTotal = 0;
    let missingCount = 0;

    for (const artifact of scenario.loaded_artifacts) {
      const m = measureFile(artifact.path);
      artifactResults.push({
        path: artifact.path,
        depth: artifact.depth || 'full',
        rationale: artifact.rationale || null,
        ...m,
      });
      if (!m.exists) missingCount++;
      scenarioTotal += m.tokens;
    }

    results.scenarios[scenario.scenario_id] = {
      scenario_id: scenario.scenario_id,
      description: scenario.description,
      task_class: scenario.task_class || scenario.scenario_id,
      total_tokens: scenarioTotal,
      artifact_count: artifactResults.length,
      missing_count: missingCount,
      artifacts: artifactResults,
    };

    results.summary.total_scenarios++;
    results.summary.total_tokens_aggregate += scenarioTotal;
    results.summary.total_artifacts_scanned += artifactResults.length;
    results.summary.total_missing_artifacts += missingCount;
    if (scenarioTotal > results.summary.max_scenario_tokens) {
      results.summary.max_scenario_tokens = scenarioTotal;
      results.summary.max_scenario_id = scenario.scenario_id;
    }
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2) + '\n', 'utf8');

  // Pretty-print summary
  console.log(`\n[measure-token-cost] Baseline — ${results.summary.total_scenarios} scenarios`);
  console.log(`Tokenizer: ${results.tokenizer} v${results.tokenizer_version}`);
  console.log(`Note: ${results.tokenizer_note}`);
  console.log('');
  const SCEN_W = 28;
  const NUM_W = 10;
  console.log(
    `${'Scenario'.padEnd(SCEN_W)} ${'Tokens'.padStart(NUM_W)} ${'Artifacts'.padStart(11)} ${'Missing'.padStart(8)}`
  );
  console.log('-'.repeat(SCEN_W + NUM_W + 11 + 8 + 3));
  for (const [id, sc] of Object.entries(results.scenarios)) {
    console.log(
      `${id.padEnd(SCEN_W)} ${String(sc.total_tokens).padStart(NUM_W)} ${String(sc.artifact_count).padStart(11)} ${String(sc.missing_count).padStart(8)}`
    );
  }
  console.log('-'.repeat(SCEN_W + NUM_W + 11 + 8 + 3));
  console.log(`${'AGGREGATE'.padEnd(SCEN_W)} ${String(results.summary.total_tokens_aggregate).padStart(NUM_W)} ${String(results.summary.total_artifacts_scanned).padStart(11)} ${String(results.summary.total_missing_artifacts).padStart(8)}`);
  console.log('');
  console.log(
    `Max scenario: ${results.summary.max_scenario_id} (${results.summary.max_scenario_tokens} tokens)`
  );
  console.log(`Output: ${OUTPUT_PATH.replace(ROOT + '\\', '').replace(ROOT + '/', '')}`);

  if (results.summary.total_missing_artifacts > 0) {
    console.log(
      `\n⚠ ${results.summary.total_missing_artifacts} declared artifact(s) missing — Phase 2 element-review should investigate.`
    );
  }
}

main();
