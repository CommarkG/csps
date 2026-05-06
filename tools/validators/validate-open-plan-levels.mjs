#!/usr/bin/env node
/**
 * validate-open-plan-levels.mjs — open exit criteria detector
 *
 * ROOT CAUSE TARGETED: P-META-020 context-depth-degradation pattern.
 * When AI completes a plan level and moves to the next topic, promises
 * made for future levels silently orphan. No existing validator surfaces
 * ALL unchecked exit criteria — only file-path-specific ones.
 *
 * What it checks:
 *   For each active topic plan:
 *     Count ALL unchecked exit criteria (lines starting with "- [ ]")
 *     Report per plan with count + which level the items appear in
 *
 * EXIT-CODED: 0 always (advisory) — promotes to warn when token-optimization
 *   Phase 5 ships; becomes error at Ring 3 construction complete.
 *
 * Registered in audit-runner.md as: open-plan-levels-coverage (Pipeline 10)
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');

function extractFrontmatterField(text, field) {
  const m = text.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
}

function findOpenItems(text) {
  const lines = text.split('\n');
  const openByLevel = {};
  let currentLevel = 'preamble';

  for (const line of lines) {
    // Detect level headers (## §1, ## Level 1, ### Phase N, etc.)
    const levelMatch = line.match(/^#{1,3}\s+(§\d+|Level \d+|Phase \d+|L\d+\s)/);
    if (levelMatch) {
      currentLevel = levelMatch[1].trim();
    }

    if (line.trim().startsWith('- [ ]')) {
      if (!openByLevel[currentLevel]) openByLevel[currentLevel] = [];
      openByLevel[currentLevel].push(line.trim().slice(6, 80)); // first 80 chars
    }
  }

  return openByLevel;
}

async function main() {
  if (!existsSync(PLANS_DIR)) {
    console.log('[validate-open-plan-levels] no topic-plans dir; skipping');
    process.exit(0);
  }

  const files = readdirSync(PLANS_DIR)
    .filter(f => f.endsWith('.md') && f !== 'README.md')
    .sort();

  const warnings = [];
  let plans_checked = 0;
  let total_open = 0;

  for (const file of files) {
    const text = readFileSync(join(PLANS_DIR, file), 'utf8');
    const lifecycle = extractFrontmatterField(text, 'lifecycle_state');
    if (lifecycle !== 'active') continue;

    plans_checked++;
    const name = extractFrontmatterField(text, 'name') ?? file;
    const openByLevel = findOpenItems(text);

    const totalForPlan = Object.values(openByLevel).reduce((s, a) => s + a.length, 0);
    if (totalForPlan === 0) continue;

    total_open += totalForPlan;
    const levelSummary = Object.entries(openByLevel)
      .filter(([, items]) => items.length > 0)
      .map(([level, items]) => `${level}(${items.length})`)
      .join(', ');

    warnings.push(`  ⚠ ${name}: ${totalForPlan} open exit criteria — ${levelSummary}`);
  }

  if (warnings.length > 0) {
    console.warn('[validate-open-plan-levels] open exit criteria detected:');
    for (const w of warnings) console.warn(w);
    console.warn('');
    console.warn('  WHY THESE MATTER (P-META-021 Triad Governance):');
    console.warn('  Open items are not just unchecked boxes — they are consequential decisions');
    console.warn('  without all 3 governance layers confirmed. Each open item represents:');
    console.warn('    (1) A context that was loaded when the item was written');
    console.warn('    (2) A principle that said this must be done');
    console.warn('    (3) A mechanical expectation that the item would be completed');
    console.warn('  Leaving it open degrades layer (1) — the context that explained WHY.');
    console.warn('  Per P-META-021: rules are finite; situations are infinite; only the');
    console.warn('  combination covers all cases. Nominal completion (checkbox only, no actual');
    console.warn('  work) = single-layer reliance = structural failure waiting to compound.');
    console.warn('');
    console.warn('  → For each item: is it DONE (update checkbox) or DEFERRED (document why)?');
    console.warn('  → Neither answer is wrong. Silent neither = structural debt.');
  }

  const summary = `[validate-open-plan-levels] plans_checked=${plans_checked} plans_with_open=${warnings.length} total_open_items=${total_open}`;
  console.log(`\n${summary}`);

  process.exit(0); // advisory — exit 0 always
}

main().catch(err => {
  console.error('[validate-open-plan-levels] fatal:', err);
  process.exit(1);
});
