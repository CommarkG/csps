#!/usr/bin/env node
/**
 * validate-plan-know-how.mjs — every new plan has §KH know-how consultation section
 *
 * Per B_KNOW_HOW_DISCIPLINE. Checks that every active topic-plan either:
 *   (a) Has know_how_consulted: true in frontmatter, OR
 *   (b) Has a ## §KH section in the plan body
 *
 * Plans authored BEFORE this validator (pre-S011) are exempt if they have
 * lifecycle_state:active AND session < S011 (grandfathered).
 * New plans (session >= S011) MUST have the §KH consultation.
 *
 * EXIT-CODED: 0 = all plans have know-how consultation / 1 = missing
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');

const GRANDFATHER_SESSION = 11; // plans from before S011 are grandfathered

function sessionNumber(s) {
  const m = String(s ?? '').match(/S(\d+)/i);
  return m ? Number(m[1]) : 0;
}

function extractField(text, field) {
  const m = text.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
}

async function main() {
  if (!existsSync(PLANS_DIR)) {
    console.log('[validate-plan-know-how] no topic-plans dir; skipping');
    process.exit(0);
  }

  const files = readdirSync(PLANS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');
  const errors = [];
  const warnings = [];
  let checked = 0;
  let grandfathered = 0;

  for (const file of files) {
    const text = readFileSync(join(PLANS_DIR, file), 'utf8');
    const lifecycle = extractField(text, 'lifecycle_state');
    const sessionStr = extractField(text, 'session');
    const planSession = sessionNumber(sessionStr);
    const knowHowConsulted = extractField(text, 'know_how_consulted');

    if (lifecycle !== 'active') continue;

    // Grandfathering: plans from before S011 don't need §KH yet
    if (planSession < GRANDFATHER_SESSION && planSession > 0) {
      grandfathered++;
      continue;
    }

    checked++;

    const hasKhFrontmatter = knowHowConsulted === 'true';
    const hasKhSection = text.includes('## §KH') || text.includes('### §KH');

    if (!hasKhFrontmatter && !hasKhSection) {
      errors.push(`${file}: missing know-how consultation (add §KH section or know_how_consulted: true in frontmatter)`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n${errors.length} error(s) — plans missing §KH know-how consultation:`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    console.error('\n  Fix: add ## §KH Know-How Consultation section to plan body per know-how/checklists/pre-plan-creation.md');
  }

  if (warnings.length > 0) {
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
  }

  const summary = `[validate-plan-know-how] checked=${checked} grandfathered=${grandfathered} errors=${errors.length}`;
  console.log(`\n${summary}`);

  if (errors.length > 0) process.exit(1);
  process.exit(0);
}

main().catch(err => { console.error('[validate-plan-know-how] fatal:', err); process.exit(1); });
