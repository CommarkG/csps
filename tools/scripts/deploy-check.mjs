#!/usr/bin/env node
/**
 * @csps-id csps.tools.scripts.deploy-check
 * @csps-name deploy-check
 * @csps-description FLAWLESS-DEPLOY M2 — pre-deploy gate. Verifies each app registered in
 *   tools/config/deploy-targets.yaml has everything needed for a successful Vercel build:
 *   (1) root_dir exists on disk
 *   (2) vercel.json exists with framework:nextjs (no nulls, no comments)
 *   (3) .env.example exists (deps documented)
 *   (4) .csps/deploy-checklist.md exists (Vercel UI sequence documented)
 *   Exit 0 = all targets ready. Exit 1 = at least one target has a BLOCKING issue.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces P-ARCH-030 B_APPS_ARE_TRIALS
 * closure_owner: group:finky
 * closure_decision: "Part of FLAWLESS-DEPLOY M2 — terminal when deploy:check passes in CI"
 * closure_by: "before App#2 (The Connector) first deploy"
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const DEPLOY_TARGETS = join(ROOT, 'tools/config/deploy-targets.yaml');

if (!existsSync(DEPLOY_TARGETS)) {
  console.log('[deploy-check] No deploy-targets.yaml found — nothing to check.');
  process.exit(0);
}

const content = readFileSync(DEPLOY_TARGETS, 'utf-8');
const lines = content.split('\n');

let currentApp = null;
const targets = [];

for (const line of lines) {
  const appMatch = line.match(/^\s+- app:\s+(\S+)/);
  if (appMatch) {
    currentApp = { app: appMatch[1].trim() };
    targets.push(currentApp);
  }
  if (!currentApp) continue;
  const rootDirMatch = line.match(/^\s+root_dir:\s+(\S+)/);
  if (rootDirMatch) currentApp.root_dir = rootDirMatch[1].trim();
  const statusMatch = line.match(/^\s+status:\s+(\S+)/);
  if (statusMatch) currentApp.status = statusMatch[1].trim();
}

// Only check active and deployed targets
const activeTargets = targets.filter(t => t.root_dir && t.status !== 'deprecated');

if (activeTargets.length === 0) {
  console.log('[deploy-check] No active targets to check.');
  process.exit(0);
}

let allPass = true;

for (const target of activeTargets) {
  const { app, root_dir } = target;
  const appPath = join(ROOT, root_dir);
  const issues = [];

  // 1. root_dir exists
  if (!existsSync(appPath)) {
    issues.push(`❌ root_dir=${root_dir} does not exist — Vercel would fail to find app`);
  } else {
    // 2. vercel.json exists and has framework:nextjs
    const vercelJson = join(appPath, 'vercel.json');
    if (!existsSync(vercelJson)) {
      issues.push(`❌ vercel.json missing — Vercel build config undocumented`);
    } else {
      try {
        const vj = JSON.parse(readFileSync(vercelJson, 'utf-8'));
        if (vj.framework !== 'nextjs') {
          issues.push(`❌ vercel.json: framework=${vj.framework || 'missing'} — must be "nextjs" (R2)`);
        }
        // Check for comments (R3 — Vercel rejects unknown properties)
        const hasComments = Object.keys(vj).some(k => k.startsWith('_'));
        if (hasComments) {
          issues.push(`❌ vercel.json has _comment properties — Vercel rejects these (R3)`);
        }
      } catch {
        issues.push(`❌ vercel.json is malformed JSON`);
      }
    }

    // 3. .env.example exists
    if (!existsSync(join(appPath, '.env.example'))) {
      issues.push(`⚠  .env.example missing — environment variables undocumented`);
    }

    // 4. deploy-checklist.md exists
    if (!existsSync(join(appPath, '.csps', 'deploy-checklist.md'))) {
      issues.push(`⚠  .csps/deploy-checklist.md missing — Vercel UI steps undocumented`);
    }
  }

  if (issues.length === 0) {
    console.log(`  ✓ ${app} (${root_dir}) — ready to deploy`);
  } else {
    console.log(`  ✗ ${app} (${root_dir}) — ${issues.length} issue(s):`);
    for (const issue of issues) {
      console.log(`      ${issue}`);
    }
    if (issues.some(i => i.startsWith('❌'))) allPass = false;
  }
}

console.log(`\n[deploy-check] ${activeTargets.length} target(s) checked | status: ${allPass ? 'PASS ✅' : 'FAIL ❌ — fix blocking issues before deploy'}`);
process.exit(allPass ? 0 : 1);
