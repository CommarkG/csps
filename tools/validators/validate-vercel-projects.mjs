#!/usr/bin/env node
/**
 * validate-vercel-projects.mjs
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields in last-run JSON). All blocking decisions are structural/deterministic (field presence, count checks, schema conformance). Not in any blocking decision path.
 *
 * @csps-dna
 * core_spine: ARCH
 * @csps-enforces FLAWLESS-DEPLOY HARDWIRE-006
 * @csps-prevention-class VERCEL-DEPLOY-FAILURE-SILENT-UNTIL-EMAIL
 * @behavioral-test-status: inline — add entry with non-existent root_dir → exit 1
 *
 * T2 validator (pre-push) for Vercel project registry integrity.
 * Checks that every NON-DEPRECATED entry in deploy-targets.yaml:
 *   1. Has a root_dir that EXISTS on disk (active/deployed apps only)
 *   2. Has vercel_project field set
 *   3. Has a non-null deploy_url if status=deployed
 *
 * BLOCKING: root_dir missing → exit 1 (prevents push that would cause Vercel failure)
 * ADVISORY: deploy_url missing for deployed status
 *
 * Root cause: apps moved to _trials-vaulted/ without removing/updating Vercel project
 * → every push triggers a Vercel build → root_dir doesn't exist → BUILD FAILED email.
 *
 * Source: HARDWIRE-006 S075.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import yaml from 'js-yaml';

const ROOT = resolve(process.cwd());
const DEPLOY_TARGETS = join(ROOT, 'tools/config/deploy-targets.yaml');
const LAST_RUN = join(ROOT, 'tools/data/validate-vercel-projects-last-run.json');

function main() {
  if (!existsSync(DEPLOY_TARGETS)) {
    console.log('[validate-vercel-projects] deploy-targets.yaml not found — skipping');
    process.exit(0);
  }

  let parsed;
  try {
    parsed = yaml.load(readFileSync(DEPLOY_TARGETS, 'utf8'));
  } catch (e) {
    console.log(`[validate-vercel-projects] parse error: ${e.message}`);
    process.exit(1);
  }

  const targets = parsed.targets || [];
  let blocking = 0;
  let advisory = 0;
  const findings = [];

  for (const target of targets) {
    const appId = target.app || '(unnamed)';
    const status = target.status || 'active';

    // Skip deprecated entries — no Vercel project, no expectations
    if (status === 'deprecated') continue;

    // Check root_dir exists
    if (target.root_dir) {
      const dir = join(ROOT, target.root_dir);
      if (!existsSync(dir)) {
        blocking++;
        findings.push(
          `BLOCKING: "${appId}" (${target.vercel_project || 'no project'}): ` +
          `root_dir "${target.root_dir}" does not exist on disk. ` +
          `Every push to main will cause Vercel build failure. ` +
          `Fix: either (a) restore the app directory, (b) mark status:deprecated + remove Vercel project, ` +
          `or (c) update root_dir to correct path.`
        );
      }
    } else if (status !== 'deprecated') {
      advisory++;
      findings.push(`[ADVISORY] "${appId}": root_dir not set — cannot validate`);
    }

    // Check deployed entries have deploy_url
    if (status === 'deployed' && !target.deploy_url) {
      advisory++;
      findings.push(`[ADVISORY] "${appId}": status=deployed but deploy_url is null`);
    }

    // Check vercel_project set
    if (!target.vercel_project && status !== 'deprecated') {
      advisory++;
      findings.push(`[ADVISORY] "${appId}": vercel_project not set`);
    }
  }

  for (const f of findings) {
    if (f.startsWith('BLOCKING')) console.log(`  ✗ ${f}`);
    else console.log(`  ${f}`);
  }

  const lastRun = {
    run_at: new Date().toISOString(),
    targets_checked: targets.filter(t => t.status !== 'deprecated').length,
    blocking,
    advisory,
  };

  try {
    writeFileSync(LAST_RUN, JSON.stringify(lastRun, null, 2) + '\n');
  } catch { /* non-fatal */ }

  console.log(`[validate-vercel-projects] targets=${lastRun.targets_checked} blocking=${blocking} advisory=${advisory}`);

  if (blocking > 0) process.exit(1);
  process.exit(0);
}

main();
