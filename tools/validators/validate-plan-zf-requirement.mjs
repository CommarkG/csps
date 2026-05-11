#!/usr/bin/env node
// validate-plan-zf-requirement.mjs — checks active topic-plans have zf_required_level field
// ADVISORY — encourages adoption. Not blocking yet.
// Audit slug: plan-zf-requirement-coverage

import { readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());
const PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');

function main() {
  const missing = [];
  const present = [];
  let checked = 0;

  let files;
  try { files = readdirSync(PLANS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md'); }
  catch { console.log('[validate-plan-zf-requirement] plans dir not found — skip'); process.exit(0); }

  for (const f of files) {
    const content = readFileSync(join(PLANS_DIR, f), 'utf8');
    if (!content.includes('lifecycle_state: active')) continue;
    checked++;

    if (content.includes('zf_required_level:')) {
      const m = content.match(/zf_required_level:\s*(\d)/);
      present.push({ file: f, level: m ? m[1] : '?' });
    } else {
      missing.push(f);
    }
  }

  if (present.length > 0) {
    console.log(`${present.length} plans with zf_required_level:`);
    for (const p of present) console.log(`  ✓ ${p.file} (level: ${p.level})`);
  }
  if (missing.length > 0) {
    console.log(`${missing.length} advisory — active plans missing zf_required_level:`);
    for (const m of missing) console.log(`  ⚠ ${m}`);
    console.log('  → Add to frontmatter: zf_required_level: 1|2|3');
    console.log('    1=per-commit, 2=phase-close, 3=session-close');
  }

  console.log(`\n[validate-plan-zf-requirement] checked=${checked} with_field=${present.length} missing=${missing.length}`);
  process.exit(0); // Always advisory — exits 0
}

main();
