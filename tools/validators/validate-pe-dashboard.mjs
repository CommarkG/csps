#!/usr/bin/env node
/**
 * validate-pe-dashboard.mjs — Priority Engine auto-compute dashboard
 *
 * ROOT CAUSE TARGETED: PE was manual (scores in frontmatter, no unified view).
 * 132 open items across 19 plans with no priority ordering caused session drift
 * toward shiny objects instead of the highest-value work.
 *
 * What it does:
 *   1. Reads all active topic-plans
 *   2. Extracts: priority_score, priority_band, depth_chosen, open item count
 *   3. Computes adjusted PE = base + depth_bonus (depth-5 = +5, depth-4 = +3) + open_penalty
 *   4. Outputs: sorted priority queue (top-10 plans + their open item count)
 *   5. Surface: inner-AI-defaults enforcement rate + open plan level count
 *
 * Phase 1 (S025): base score + depth bonus — human still sets base PE
 * Phase 2 (S026): + gate status (Bn from open plan levels) + ZF gate per level
 *
 * FIRES:
 *   - In pnpm verify (advisory — never blocks, pure information)
 *   - Injected by session-open.sh for top-5 at session start
 *
 * Governor directive: "PE must be connected to everything. Complete holistic view."
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

function countOpenItems(text) {
  return (text.match(/^- \[ \]/gm) || []).length;
}

function computeAdjustedPE(base, depth, openItems) {
  const depthBonus = depth === 5 ? 5 : depth === 4 ? 3 : depth === 3 ? 1 : 0;
  // Open items reduce adjusted PE slightly (signals incomplete foundation)
  const openPenalty = Math.min(openItems * 0.1, 5);
  return Math.round((base + depthBonus - openPenalty) * 10) / 10;
}

if (!existsSync(PLANS_DIR)) {
  console.log('[validate-pe-dashboard] PLANS_DIR not found — skipping');
  process.exit(0);
}

const planFiles = readdirSync(PLANS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');

const plans = [];

for (const file of planFiles) {
  const content = readFileSync(join(PLANS_DIR, file), 'utf8');
  const lifecycleState = extractFrontmatterField(content, 'lifecycle_state');
  if (lifecycleState !== 'active') continue;

  const name = extractFrontmatterField(content, 'name') || file.replace('.md', '');
  const baseScore = parseFloat(extractFrontmatterField(content, 'priority_score') || '0');
  const band = parseInt(extractFrontmatterField(content, 'priority_band') || '4', 10);
  const depthChosen = parseInt(extractFrontmatterField(content, 'depth_chosen') || '3', 10);
  const openItems = countOpenItems(content);
  const session = extractFrontmatterField(content, 'session') || 'unknown';

  if (baseScore === 0) continue; // Skip unscored plans

  const adjustedPE = computeAdjustedPE(baseScore, depthChosen, openItems);

  plans.push({ name, file, baseScore, adjustedPE, band, depthChosen, openItems, session });
}

// Sort by adjusted PE descending
plans.sort((a, b) => b.adjustedPE - a.adjustedPE);

const totalOpen = plans.reduce((sum, p) => sum + p.openItems, 0);
const activePlans = plans.length;

console.log('\n════════════════════════════════════════════════════════════');
console.log('  PE DASHBOARD — Priority Engine Holistic View');
console.log('════════════════════════════════════════════════════════════');
console.log(`  Active plans: ${activePlans} | Total open items: ${totalOpen}`);
console.log('────────────────────────────────────────────────────────────');
console.log('  Rank │ Adj.PE │ Base │ D │ Open │ Plan');
console.log('────────────────────────────────────────────────────────────');

const top10 = plans.slice(0, 10);
top10.forEach((p, i) => {
  const rank = String(i + 1).padStart(4, ' ');
  const adj = String(p.adjustedPE).padEnd(6, ' ');
  const base = String(p.baseScore).padEnd(4, ' ');
  const depth = String(p.depthChosen).padEnd(1, ' ');
  const open = String(p.openItems).padEnd(4, ' ');
  const name = p.name.length > 35 ? p.name.slice(0, 32) + '...' : p.name;
  console.log(`  ${rank} │ ${adj} │ ${base} │ ${depth} │ ${open} │ ${name}`);
});

if (plans.length > 10) {
  console.log(`  ... and ${plans.length - 10} more active plans`);
}

console.log('════════════════════════════════════════════════════════════');
console.log('  ▶ TOP PRIORITY: ' + (top10[0]?.name || 'none'));
console.log('  Phase 2 (S026): + gate status Bn + ZF gate per level');
console.log('════════════════════════════════════════════════════════════\n');

const top5Names = top10.slice(0, 5).map(p => `${p.name} (PE=${p.adjustedPE})`).join('\n    ');
console.log(`[validate-pe-dashboard] plans=${activePlans} open_items=${totalOpen} top5:\n    ${top5Names}`);

process.exit(0);
