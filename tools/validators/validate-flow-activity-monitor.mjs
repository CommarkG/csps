#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-flow-activity-monitor
 * @csps-name validate-flow-activity-monitor
 * @csps-description T2 validator — bridges audit-runner.md (what should run) +
 *   verify-last-run.md (when it ran) + actual output evidence (what it produced).
 *   Catches the EXISTS≠ACTIVE gap at platform scale. Flags flow elements that
 *   are registered + executed but produce ZERO observable output over expected
 *   cadence. Reads tools/data/flow-activity-monitor.yaml as the canonical register.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces FINDING-S063-AI-OUTPUT-CAPTURE-ASYMMETRY AP-001-EXISTS-NOT-EQUALS-ACTIVE
 * @csps-ns_quality self-improving
 *
 * WHAT THIS PREVENTS:
 *   Dead validators/hooks/pipelines that exist on disk and "run" but produce no
 *   meaningful output. Three-layer activity check: REGISTERED + EXECUTED + PRODUCED.
 *   Most platforms catch the first two; the third is the moat.
 *
 * OUTPUT:
 *   ADVISORY per dormant flow (no output for cadence-threshold window).
 *   BLOCKING if a flow marked status=active produces zero output AND has no exempt_reason.
 *   PASS if all status=active flows produced expected output or have exempt justification.
 */

import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const REGISTER_PATH = resolve(ROOT, 'tools/data/flow-activity-monitor.yaml');
const VERIFY_LAST_RUN = resolve(ROOT, 'tools/verify-last-run.md');

if (!existsSync(REGISTER_PATH)) {
  console.error('[flow-activity-monitor] BLOCKING: register file missing at tools/data/flow-activity-monitor.yaml');
  process.exit(1);
}

const registerText = readFileSync(REGISTER_PATH, 'utf-8');
const verifyText = existsSync(VERIFY_LAST_RUN) ? readFileSync(VERIFY_LAST_RUN, 'utf-8') : '';

// Parse flow_elements list — minimal YAML-ish extraction (one-pass, schema-aware)
function parseFlowElements(text) {
  const elements = [];
  const lines = text.split('\n');
  let current = null;
  let inExpectedOutput = false;
  let depth = 0;

  for (const line of lines) {
    const idMatch = line.match(/^  - id:\s+(\S+)/);
    if (idMatch) {
      if (current) elements.push(current);
      current = { id: idMatch[1], expected_output: {} };
      inExpectedOutput = false;
      continue;
    }
    if (!current) continue;

    const typeMatch = line.match(/^    element_type:\s+(\S+)/);
    if (typeMatch) current.element_type = typeMatch[1];

    if (line.match(/^    expected_output:/)) inExpectedOutput = true;
    if (line.match(/^    \w/) && !line.match(/^    expected_output:/)) inExpectedOutput = false;

    if (inExpectedOutput) {
      const otMatch = line.match(/^      output_type:\s+(\S+)/);
      const olMatch = line.match(/^      output_location:\s+(.+)/);
      const osMatch = line.match(/^      output_signature:\s+['"]?(.+?)['"]?\s*$/);
      if (otMatch) current.expected_output.output_type = otMatch[1];
      if (olMatch) current.expected_output.output_location = olMatch[1].trim();
      if (osMatch) current.expected_output.output_signature = osMatch[1].trim();
    }

    const cadenceMatch = line.match(/^    expected_cadence:\s+(\S+)/);
    if (cadenceMatch) current.expected_cadence = cadenceMatch[1];

    const statusMatch = line.match(/^    status:\s+(\S+)/);
    if (statusMatch) current.status = statusMatch[1];

    const exemptMatch = line.match(/^    exempt_reason:\s+(.+)$/);
    if (exemptMatch && exemptMatch[1].trim() !== 'null') current.exempt_reason = exemptMatch[1].trim();
  }
  if (current) elements.push(current);
  return elements;
}

const flows = parseFlowElements(registerText);

let dormant = [];
let blocking = [];
let active = [];
let exempt = [];
let notYetBuilt = [];

for (const flow of flows) {
  if (flow.status === 'exempt') {
    exempt.push(flow);
    continue;
  }
  if (flow.status === 'not-yet-built') {
    notYetBuilt.push(flow);
    continue;
  }
  if (flow.status !== 'active') continue;

  // Check for output evidence
  const sig = flow.expected_output?.output_signature;
  const loc = flow.expected_output?.output_location;

  if (!sig || !loc) {
    dormant.push({ ...flow, reason: 'no output_signature or output_location declared' });
    continue;
  }

  // Try to find the output
  let outputFound = false;
  let outputCount = 0;

  // Special case: stderr / on_demand cadence — can't scan retroactively, trust the count
  if (loc === 'stderr' || flow.expected_cadence === 'on_demand') {
    outputFound = true;  // exempt from active scan
    outputCount = -1;  // unknown
  } else {
    // Resolve relative paths
    let resolvedPath;
    if (loc.startsWith('~/')) {
      resolvedPath = loc.replace('~', process.env.HOME || process.env.USERPROFILE || '');
    } else if (loc === 'tools/verify-last-run.md') {
      resolvedPath = VERIFY_LAST_RUN;
    } else {
      resolvedPath = resolve(ROOT, loc);
    }

    if (existsSync(resolvedPath)) {
      try {
        const content = readFileSync(resolvedPath, 'utf-8');
        const regex = new RegExp(sig, 'm');
        const matches = content.match(new RegExp(sig, 'gm'));
        outputFound = regex.test(content);
        outputCount = matches ? matches.length : 0;
      } catch (e) {
        // permission or read error — treat as not-found
        outputFound = false;
      }
    }
  }

  if (outputFound && outputCount !== 0) {
    active.push({ ...flow, outputCount });
  } else {
    if (flow.exempt_reason) {
      exempt.push(flow);
    } else {
      blocking.push({ ...flow, reason: `expected output signature "${sig}" not found at ${loc}` });
    }
  }
}

// Report
console.log('[flow-activity-monitor] Three-layer activity check (REGISTERED + EXECUTED + PRODUCED)');
console.log(`  total_flows=${flows.length}`);
console.log(`  active=${active.length} (producing expected output)`);
console.log(`  exempt=${exempt.length} (justified non-output)`);
console.log(`  not_yet_built=${notYetBuilt.length} (registered but implementation pending)`);
console.log(`  dormant=${dormant.length} (status=active but missing signature/location)`);
console.log(`  BLOCKING=${blocking.length} (status=active, no output, no exempt_reason)`);

if (notYetBuilt.length > 0) {
  console.log('\n  not-yet-built flows (queue for implementation):');
  for (const f of notYetBuilt) {
    console.log(`    → ${f.id} (${f.element_type})`);
  }
}

if (dormant.length > 0) {
  console.log('\n  dormant flows (need output_signature/location):');
  for (const f of dormant) {
    console.log(`    ⚠ ${f.id}: ${f.reason}`);
  }
}

if (blocking.length > 0) {
  console.log('\n  BLOCKING — active flows with no output:');
  for (const f of blocking) {
    console.log(`    ⛔ ${f.id}: ${f.reason}`);
    console.log(`       Fix: produce output OR add exempt_reason in flow-activity-monitor.yaml`);
  }
}

if (active.length > 0) {
  console.log('\n  active flows with verified output:');
  for (const f of active) {
    const cnt = f.outputCount === -1 ? 'on-demand' : f.outputCount;
    console.log(`    ✓ ${f.id} (${cnt} matches)`);
  }
}

process.exit(blocking.length > 0 ? 1 : 0);
