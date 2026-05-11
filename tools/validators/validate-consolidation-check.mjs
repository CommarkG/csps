#!/usr/bin/env node
// validate-consolidation-check.mjs — checks all topic-plans have §0 CONSOLIDATION CHECK section
// Per Session A Opus brief: BLOCKING for S023+ plans, ADVISORY for S022 and earlier.
// Audit slug: consolidation-check-coverage

import { readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());
const PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');

const GRACE_SESSION = 'S022'; // Plans from this session or earlier are advisory only

function sessionNum(session) {
  const m = String(session).match(/S(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function main() {
  const blocking = [];
  const advisory = [];
  let checked = 0;

  let files;
  try { files = readdirSync(PLANS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md'); }
  catch { console.log('[validate-consolidation-check] plans dir not found — skip'); process.exit(0); }

  for (const f of files) {
    const content = readFileSync(join(PLANS_DIR, f), 'utf8');
    if (!content.includes('lifecycle_state: active')) continue;
    checked++;

    const hasSection = content.includes('§0 — CONSOLIDATION CHECK') ||
                       content.includes('CHECK WHAT EXISTS');

    if (hasSection) continue;

    // Determine if this is a grace-period plan
    const sessionMatch = content.match(/^session:\s*(.+)$/m);
    const planSession = sessionMatch ? sessionMatch[1].trim() : 'S001';
    const isGrace = sessionNum(planSession) <= sessionNum(GRACE_SESSION);

    if (isGrace) {
      advisory.push({ file: f, session: planSession });
    } else {
      blocking.push({ file: f, session: planSession });
    }
  }

  if (blocking.length > 0) {
    console.log(`${blocking.length} BLOCKING: S023+ plans missing §0 CONSOLIDATION CHECK:`);
    for (const b of blocking) console.log(`  ✗ ${b.file} (session: ${b.session})`);
  }
  if (advisory.length > 0) {
    console.log(`${advisory.length} advisory: S022 and earlier plans missing §0 (grace period):`);
    for (const a of advisory) console.log(`  ⚠ ${a.file} (session: ${a.session})`);
  }
  if (blocking.length === 0 && advisory.length === 0) {
    console.log('All active plans have §0 CONSOLIDATION CHECK ✅');
  }

  console.log(`\n[validate-consolidation-check] checked=${checked} blocking=${blocking.length} advisory=${advisory.length}`);
  process.exit(blocking.length > 0 ? 1 : 0);
}

main();
