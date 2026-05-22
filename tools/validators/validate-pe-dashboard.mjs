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

function computeAdjustedPE(base, depth, openItems, hasGoalStatement, hasFailureSignal) {
  // Depth bonus: depth-5 = constitutional (+5), depth-4 = multi-session (+3), depth-3 = focused (+1)
  const depthBonus = depth === 5 ? 5 : depth === 4 ? 3 : depth === 3 ? 1 : 0;
  // Open items reduce adjusted PE slightly (signals incomplete foundation)
  const openPenalty = Math.min(openItems * 0.1, 5);
  // Phase 2 (S026): + intent quality bonus (plans with goal_statement + failure_signal are better defined)
  // For now: informational only — goal_statement present = plan is crystallized
  const intentBonus = (hasGoalStatement && hasFailureSignal) ? 1 : hasGoalStatement ? 0.5 : 0;
  return Math.round((base + depthBonus - openPenalty + intentBonus) * 10) / 10;
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

  const hasGoalStatement = content.includes('goal_statement:');
  const hasFailureSignal = content.includes('failure_signal:');
  const adjustedPE = computeAdjustedPE(baseScore, depthChosen, openItems, hasGoalStatement, hasFailureSignal);

  plans.push({ name, file, baseScore, adjustedPE, band, depthChosen, openItems, session, mdpe: null });
}

// S052: also read top pe_score items from unified-plan.yaml that have mdpe_dimensions
const UNIFIED_PLAN = join(ROOT, 'tools/config/unified-plan.yaml');
let mdpeItems = 0;
try {
  const createRequire = (await import('module')).createRequire;
  const yaml = createRequire(import.meta.url)('js-yaml');
  const planData = yaml.load(readFileSync(UNIFIED_PLAN, 'utf8'));
  for (const item of (planData.items || [])) {
    if (!item.mdpe_dimensions) continue;
    const d = item.mdpe_dimensions;
    const br = d.blast_radius || 0;
    const fe = d.future_enablement || 0;
    const r = d.readiness || 0;
    const sb = d.simplicity_bonus || 0;
    const classic = item.pe_score || 0;
    const mdpe_score = Math.round(classic * (1 + br * 0.5) * (1 + fe * 0.5) * (1 + r * 0.3) * (1 + sb * 0.2));
    plans.push({
      name: item.id || item.title || 'unknown',
      file: 'unified-plan.yaml',
      baseScore: classic,
      adjustedPE: classic,
      band: 1,
      depthChosen: 3,
      openItems: 0,
      session: item.tags?.find(t => t.startsWith('s0')) || 'S052',
      mdpe: { blast_radius: br, future_enablement: fe, readiness: r, simplicity_bonus: sb, mdpe_score },
    });
    mdpeItems++;
  }
} catch { /* yaml not available or no mdpe_dimensions yet */ }

// Sort by adjustedPE (classic) descending, MDPE items sorted by mdpe_score
plans.sort((a, b) => {
  const scoreA = a.mdpe ? a.mdpe.mdpe_score : a.adjustedPE;
  const scoreB = b.mdpe ? b.mdpe.mdpe_score : b.adjustedPE;
  return scoreB - scoreA;
});

const totalOpen = plans.reduce((sum, p) => sum + p.openItems, 0);
const activePlans = plans.length;

console.log('\n════════════════════════════════════════════════════════════');
console.log('  PE DASHBOARD — Priority Engine Holistic View');
console.log('════════════════════════════════════════════════════════════');
console.log(`  Active plans: ${activePlans} | Total open items: ${totalOpen}`);
console.log('────────────────────────────────────────────────────────────');
console.log('  Rank │ Adj.PE │ MDPE   │ Base │ D │ Open │ Plan');
console.log('────────────────────────────────────────────────────────────────────');

const top10 = plans.slice(0, 10);
top10.forEach((p, i) => {
  const rank = String(i + 1).padStart(4, ' ');
  const adj = String(p.adjustedPE).padEnd(6, ' ');
  const mdpeCol = p.mdpe ? String(p.mdpe.mdpe_score).padEnd(6, ' ') : '—     ';
  const base = String(p.baseScore).padEnd(4, ' ');
  const depth = String(p.depthChosen).padEnd(1, ' ');
  const open = String(p.openItems).padEnd(4, ' ');
  const name = p.name.length > 30 ? p.name.slice(0, 27) + '...' : p.name;
  console.log(`  ${rank} │ ${adj} │ ${mdpeCol} │ ${base} │ ${depth} │ ${open} │ ${name}`);
});

if (plans.length > 10) {
  console.log(`  ... and ${plans.length - 10} more active plans`);
}

console.log('════════════════════════════════════════════════════════════');
console.log('  ▶ TOP PRIORITY: ' + (top10[0]?.name || 'none'));
console.log('  Phase 2 (S026): + gate status Bn + ZF gate per level');
console.log('════════════════════════════════════════════════════════════\n');

if (mdpeItems > 0) {
  console.log(`  MDPE: ${mdpeItems} items scored with multi-dimensional formula`);
}
console.log('════════════════════════════════════════════════════════════════════\n');
const top5Names = top10.slice(0, 5).map(p => {
  const score = p.mdpe ? `PE=${p.adjustedPE} MDPE=${p.mdpe.mdpe_score}` : `PE=${p.adjustedPE}`;
  return `${p.name} (${score})`;
}).join('\n    ');
console.log(`[validate-pe-dashboard] plans=${activePlans} open_items=${totalOpen} mdpe_items=${mdpeItems} top5:\n    ${top5Names}`);

process.exit(0);
