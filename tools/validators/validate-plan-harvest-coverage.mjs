#!/usr/bin/env node
/**
 * validate-plan-harvest-coverage.mjs — §HARVEST section coverage gate
 *
 * ROOT CAUSE TARGETED (plan-methodology-v2 L3):
 *   Plans without §HARVEST sections treat insight extraction as optional ceremony.
 *   After S015, every gradual-build-plan must declare what it's designed to teach
 *   (harvest_triggers + harvest_questions). Plans that lack this are knowledge-dead
 *   — they produce artifacts but not compounding value.
 *
 * What it checks:
 *   For every active topic plan using template_used: gradual-build-plan:
 *   CHECK A — §HARVEST section present (## §HARVEST heading exists)
 *   CHECK B — harvest_triggers defined (minimum viable harvest declared)
 *   CHECK C — harvest_questions defined (what the plan is designed to learn)
 *
 *   GRANDFATHERED: Plans written before S015 without alignment_verified_session
 *   are WARN-only (stale-plan-alignment catches them). Plans reviewed (alignment_verified_session
 *   present) and still missing §HARVEST = more urgent WARN.
 *
 * EXIT-CODED: 0 (advisory) — promotes to error at plan-create gate when plan-creation-protocol
 *   Step 1 §HARVEST check fails (validator referenced from plan-creation-protocol.md §3 Step 3)
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

function sessionNumber(s) {
  const m = String(s ?? '').match(/S(\d+)/i);
  return m ? Number(m[1]) : 0;
}

async function main() {
  if (!existsSync(PLANS_DIR)) {
    console.log('[validate-plan-harvest-coverage] no topic-plans dir; skipping');
    process.exit(0);
  }

  const files = readdirSync(PLANS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');
  const warnings = [];
  let plansChecked = 0;
  let plansMissingHarvest = 0;

  for (const file of files) {
    const text = readFileSync(join(PLANS_DIR, file), 'utf8');
    const lifecycle = extractFrontmatterField(text, 'lifecycle_state');
    if (lifecycle !== 'active') continue;

    const templateUsed = extractFrontmatterField(text, 'template_used');
    if (templateUsed !== 'gradual-build-plan') continue;

    plansChecked++;
    const name = extractFrontmatterField(text, 'name') ?? file;
    const writtenSession = extractFrontmatterField(text, 'session') ?? 'S000';
    const alignmentVerified = extractFrontmatterField(text, 'alignment_verified_session');

    // CHECK A — §HARVEST section present
    const hasHarvestSection = text.includes('## §HARVEST');
    const hasHarvestTriggers = text.includes('harvest_triggers:');
    const hasHarvestQuestions = text.includes('harvest_questions:');

    if (!hasHarvestSection) {
      plansMissingHarvest++;
      const urgency = alignmentVerified ? 'URGENT' : 'WARN';
      warnings.push(
        `[${urgency}] ${name}: missing §HARVEST section. ` +
        `Session: ${writtenSession}, alignment: ${alignmentVerified ?? 'never reviewed'}. ` +
        `Add: ## §HARVEST with harvest_triggers + harvest_questions per gradual-build-plan.template.md §HARVEST.`
      );
    } else {
      if (!hasHarvestTriggers) {
        warnings.push(`[WARN] ${name}: §HARVEST section exists but missing harvest_triggers: definition`);
      }
      if (!hasHarvestQuestions) {
        warnings.push(`[WARN] ${name}: §HARVEST section exists but missing harvest_questions: definition`);
      }
    }
  }

  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} plan(s) need §HARVEST attention:`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
    console.warn('\nAdd §HARVEST section to each plan per gradual-build-plan.template.md §HARVEST.\n');
  }

  console.log(`[validate-plan-harvest-coverage] plans_checked=${plansChecked} missing_harvest=${plansMissingHarvest} warnings=${warnings.length}`);
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-plan-harvest-coverage] fatal:', err);
  process.exit(1);
});
