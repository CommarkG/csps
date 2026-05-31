#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: OPER
 * governing_principle: P-ARCH-030
 * behavioral_contract: B_APPS_ARE_TRIALS
 * role: Validates each app in apps/ has the minimum deploy-readiness assets.
 *       Component B check: .env.example (template-level), deploy-checklist.md (instance-level advisory)
 * @csps-enforces P-ARCH-030 B_APPS_ARE_TRIALS
 */

/**
 * validate-app-deploy-readiness.mjs
 *
 * Checks each app directory in apps/ for deploy-readiness:
 *   CHECK 1 — .env.example exists (developers know what vars to set before deploy)
 *   CHECK 2 — .csps/deploy-checklist.md exists (Vercel UI steps documented)
 *   CHECK 3 — package.json has a "build" script (required for Vercel build)
 *   CHECK 4 — no .env.local committed (secret hygiene — MUST NOT be in git)
 *
 * ADVISORY (exit 0 always) — week-4 may promote CHECK 1 to BLOCKING for apps
 * that have been deployed. csps-playground is expected to be missing some assets.
 *
 * Output format: apps_checked=N missing_env_example=N missing_checklist=N
 *   committed_env_local=N advisory=N blocking=N
 *
 * Per PROTO-S062-DEPLOY STEP 1 — S062-C5.
 */

import { readdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const APPS_DIR = join(ROOT, 'apps');

// Apps to skip (infrastructure, not deployable SaaS apps, or vaulted trial directories)
const SKIP_APPS = new Set(['csps-playground', '_trials-vaulted']);

let apps_checked = 0;
let missing_env_example = 0;
let missing_checklist = 0;
let committed_env_local = 0;
let advisory = 0;
let blocking = 0;

const findings = [];

// Discover apps
let appDirs = [];
try {
  appDirs = readdirSync(APPS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !SKIP_APPS.has(d.name))
    .map(d => d.name);
} catch (e) {
  console.log(`[validate-app-deploy-readiness] apps/ directory not found — skipping`);
  console.log(`apps_checked=0 missing_env_example=0 missing_checklist=0 committed_env_local=0 advisory=0 blocking=0`);
  process.exit(0);
}

for (const app of appDirs) {
  const appPath = join(APPS_DIR, app);
  apps_checked++;

  // CHECK 1: .env.example
  const envExamplePath = join(appPath, '.env.example');
  if (!existsSync(envExamplePath)) {
    missing_env_example++;
    advisory++;
    findings.push({
      severity: 'ADVISORY',
      app,
      check: 'env_example',
      message: `${app}/.env.example missing — developers cannot know required env vars`,
      remediation: `Copy apps/template/.env.example → apps/${app}/.env.example and customize`
    });
  }

  // CHECK 2: .csps/deploy-checklist.md
  const checklistPath = join(appPath, '.csps', 'deploy-checklist.md');
  if (!existsSync(checklistPath)) {
    missing_checklist++;
    advisory++;
    findings.push({
      severity: 'ADVISORY',
      app,
      check: 'deploy_checklist',
      message: `${app}/.csps/deploy-checklist.md missing — Vercel UI steps undocumented`,
      remediation: `Write deploy-checklist.md with 7-step Vercel UI sequence (Root Dir, framework, env vars, etc.)`
    });
  }

  // CHECK 3: package.json build script
  const pkgPath = join(appPath, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      if (!pkg.scripts || !pkg.scripts.build) {
        advisory++;
        findings.push({
          severity: 'ADVISORY',
          app,
          check: 'build_script',
          message: `${app}/package.json missing "build" script — Vercel cannot build`,
          remediation: `Add "build": "next build" (or equivalent) to package.json scripts`
        });
      }
    } catch (e) {
      // Malformed package.json — advisory
      advisory++;
      findings.push({
        severity: 'ADVISORY',
        app,
        check: 'package_json',
        message: `${app}/package.json malformed or unreadable`,
        remediation: `Fix package.json syntax`
      });
    }
  }

  // CHECK 4: .env.local NOT committed (secret hygiene)
  const envLocalPath = join(appPath, '.env.local');
  if (existsSync(envLocalPath)) {
    // Check if it's tracked by git
    try {
      const tracked = execSync(`git ls-files --error-unmatch "${envLocalPath}" 2>/dev/null`, { cwd: ROOT }).toString().trim();
      if (tracked) {
        committed_env_local++;
        blocking++;
        findings.push({
          severity: 'BLOCKING',
          app,
          check: 'no_env_local_committed',
          message: `BLOCKING: ${app}/.env.local is committed to git — secrets exposed`,
          remediation: `git rm --cached apps/${app}/.env.local && add to .gitignore`
        });
      }
    } catch (e) {
      // Not tracked — good
    }
  }
}

// CHECK 5: root_dir-exists (BLOCKING) — kills the budget-planner failure class
// Loads tools/config/deploy-targets.yaml; for each registered target, verifies root_dir
// directory exists on disk. Missing = Vercel would build from wrong dir → silent 404s.
// Prevention class: budget-planner failure class (FLAWLESS-DEPLOY P1 — PROTO-S073-PARALLEL).
const deployTargetsPath = join(ROOT, 'tools/config/deploy-targets.yaml');
if (existsSync(deployTargetsPath)) {
  const dtContent = readFileSync(deployTargetsPath, 'utf-8');
  const lines = dtContent.split('\n');
  let currentApp = null;
  for (const line of lines) {
    const appMatch = line.match(/^\s+- app:\s+(\S+)/);
    if (appMatch) currentApp = appMatch[1].trim();
    const rootDirMatch = line.match(/^\s+root_dir:\s+(\S+)/);
    if (rootDirMatch && currentApp) {
      const rootDir = rootDirMatch[1].trim();
      const absolutePath = join(ROOT, rootDir);
      if (!existsSync(absolutePath)) {
        blocking++;
        findings.push({
          severity: 'BLOCKING',
          app: currentApp,
          check: 'root_dir_exists',
          message: `BLOCKING: deploy-targets.yaml registers ${currentApp} with root_dir=${rootDir} but that directory does not exist`,
          remediation: `Create apps/${currentApp}/ with full app scaffold OR remove entry from tools/config/deploy-targets.yaml`
        });
      }
    }
  }
}

// Output findings
if (findings.length > 0) {
  for (const f of findings) {
    const icon = f.severity === 'BLOCKING' ? '✗' : '⚠';
    console.log(`  ${icon} ${f.message}`);
    console.log(`    → ${f.remediation}`);
  }
}

const summary = `[validate-app-deploy-readiness] apps_checked=${apps_checked} missing_env_example=${missing_env_example} missing_checklist=${missing_checklist} committed_env_local=${committed_env_local} advisory=${advisory} blocking=${blocking}`;
console.log(summary);

// Exit 1 only if there are BLOCKING issues (committed secrets)
if (blocking > 0) {
  process.exit(1);
}
process.exit(0);
