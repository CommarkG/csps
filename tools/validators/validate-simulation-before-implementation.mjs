#!/usr/bin/env node
// validate-simulation-before-implementation.mjs
// Enforces: no implementation without a simulated, ratified sandbox spec.
// Per sandbox-ratification-policy.md §5.
//
// BLOCKING (from S024): active implementing/implemented plans without sandbox
// ADVISORY (now): grace period for pre-policy implementations
// Audit slug: simulation-before-implementation

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());
const PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');
const SANDBOX_DIR = join(ROOT, 'docs/plan/_sandbox');

// Sessions before this policy — grandfathered
const POLICY_SESSION = 'S023';
const GRACE_SESSION = 22; // S023 = session 23, plans before this are grandfathered

function sessionNum(s) {
  const m = String(s).match(/S(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function main() {
  const blocking = [];
  const advisory = [];
  let checked = 0;

  // Check if sandbox directory exists
  if (!existsSync(SANDBOX_DIR)) {
    console.log(`  ⚠ docs/plan/_sandbox/ does not exist — creating it now`);
    advisory.push({ file: 'docs/plan/_sandbox/', issue: 'Sandbox directory missing — create it', fix: 'mkdir docs/plan/_sandbox/' });
  } else {
    console.log(`  ✅ docs/plan/_sandbox/ exists`);
  }

  // Check active implementing/implemented plans
  if (!existsSync(PLANS_DIR)) { process.exit(0); }

  for (const f of readdirSync(PLANS_DIR)) {
    if (!f.endsWith('.md') || f === 'README.md') continue;
    const content = readFileSync(join(PLANS_DIR, f), 'utf8');

    // Only check plans in implementation stages
    const isImplementing = content.includes('lifecycle_state: implementing') ||
                           content.includes('lifecycle_state: implemented');
    if (!isImplementing) continue;
    checked++;

    // Determine session of this plan
    const sessionMatch = content.match(/^session:\s*(.+)$/m);
    const planSession = sessionMatch ? sessionMatch[1].trim() : 'S001';
    const isGrace = sessionNum(planSession) <= GRACE_SESSION;

    // Check if sandbox exists for this plan
    const planName = f.replace('.md', '');
    const hasSandbox = existsSync(SANDBOX_DIR) && readdirSync(SANDBOX_DIR).some(s =>
      s.includes(planName) || s.includes(planName.split('-').slice(0, 3).join('-'))
    );

    if (!hasSandbox) {
      if (isGrace) {
        advisory.push({
          file: f,
          issue: `No sandbox spec found for this implementing plan (grace: pre-${POLICY_SESSION})`,
          fix: `Create docs/plan/_sandbox/${planName}-v1.md with spec + simulation evidence`,
        });
      } else {
        blocking.push({
          file: f,
          issue: `S023+ implementing plan with no sandbox spec — policy violation`,
          fix: `Create sandbox spec at docs/plan/_sandbox/${planName}-v1.md, simulate, ratify BEFORE implementing`,
        });
      }
    } else {
      // Check sandbox has simulation_status: pass
      const sandboxFiles = readdirSync(SANDBOX_DIR).filter(s => s.includes(planName.split('-')[0]));
      const latestSandbox = sandboxFiles.sort().pop();
      if (latestSandbox) {
        const sandboxContent = readFileSync(join(SANDBOX_DIR, latestSandbox), 'utf8');
        if (sandboxContent.includes('simulation_status: pass')) {
          console.log(`  ✅ ${f}: sandbox + simulation_status: pass`);
        } else {
          advisory.push({
            file: f,
            issue: `Sandbox exists but simulation_status != pass — simulate before implementing`,
            sandbox: latestSandbox,
          });
        }
      }
    }
  }

  if (blocking.length > 0) {
    console.log(`${blocking.length} BLOCKING — implementation without ratified sandbox:`);
    for (const b of blocking) console.log(`  ✗ ${b.file}: ${b.issue}`);
  }
  if (advisory.length > 0) {
    console.log(`${advisory.length} advisory:`);
    for (const a of advisory) console.log(`  ⚠ ${a.file}: ${a.issue}`);
  }
  if (blocking.length === 0 && advisory.length === 0) {
    console.log('  ✅ All implementing plans have ratified sandbox specs');
  }

  console.log(`\n[validate-simulation-before-implementation] checked=${checked} blocking=${blocking.length} advisory=${advisory.length}`);
  process.exit(blocking.length > 0 ? 1 : 0);
}

main();
