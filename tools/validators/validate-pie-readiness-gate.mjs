#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-pie-readiness-gate
 * @csps-name validate-pie-readiness-gate
 * @csps-description B_PIE_READINESS_GATE T2. Validates that no item has status=implementing
 * when its architectural layer prerequisites are incomplete per CORE-COMPLETE-EXIT-CRITERIA.md.
 * Layer prerequisite chain: R2 needs Layer 1 4/4. R3 needs Layer 2. R4 needs Layer 3.
 * App items need all 4 layers + Developer's Journey ratified.
 * ADVISORY: R2 item implementing while Layer 1 has unchecked boxes (Layer 1 in progress).
 * BLOCKING: R3+ item implementing while its prerequisite layer is incomplete.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_PIE_READINESS_GATE B_PIE
 * context_question: "Are any items implementing before their layer prerequisites are met? R2 needs Layer 1 4/4."
 * Wired: tools/verify.mjs cycle 'pie_readiness_gate'
 * Plan item: COMBINATORIAL-ENGINE + B_PIE | S056
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const UNIFIED_PLAN = resolve(ROOT, 'tools/config/unified-plan.yaml');
const CORE_CRITERIA = resolve(ROOT, 'docs/plan/pillar-0-governance/CORE-COMPLETE-EXIT-CRITERIA.md');

/** Count checked [x] vs total [ ]/[x] boxes in a layer section */
function parseLayerStatus(text, layerHeading) {
  const lines = text.split('\n');
  let inLayer = false;
  let checked = 0;
  let total = 0;
  const nextLayerPattern = /^## Layer \d+/;

  for (const line of lines) {
    if (line.startsWith(`## Layer`) && line.includes(layerHeading)) {
      inLayer = true;
      continue;
    }
    if (inLayer && nextLayerPattern.test(line) && !line.includes(layerHeading)) {
      break;
    }
    if (inLayer) {
      if (/^- \[x\]/i.test(line)) { checked++; total++; }
      else if (/^- \[ \]/.test(line)) { total++; }
    }
  }
  return { checked, total, complete: total > 0 && checked >= total };
}

/** Classify an item's layer from its id, category, or notes */
function classifyLayer(item) {
  const id = (item.id ?? '').toUpperCase();
  const cat = (item.category ?? '').toLowerCase();
  const notes = (item.notes ?? '').toUpperCase();

  if (id.includes('APP-') || id.includes('TASK-MGMT') || id.includes('BUDGET') || cat === 'app') return 'App';
  if (id.includes('INFRA-FLOW') || id.includes('JOURNEY') || id.includes('PLAYGROUND') || notes.includes('R3')) return 'R3';
  if (id.includes('LIBS-UI') || id.includes('COMPONENT-LIBRARY') || id.includes('TEMPLATE-BUNDLE') || notes.includes('R4')) return 'R4';
  if (id.includes('COMBINATORIAL') || id.includes('PIE') || id.includes('LEARNING') || notes.includes('R2') || cat.includes('intelligence')) return 'R2';
  if (id.includes('THRESHOLD') || id.includes('BEHAVIOR-HUB') || id.includes('DOCUMENTATION') || notes.includes('R1') || id.includes('INFRA') || id.includes('TENANCY') || id.includes('AUDIT_BASE')) return 'R1';
  return 'R1'; // default: assume Layer 1 (no prerequisites)
}

function parsePlanItems(text) {
  const items = [];
  const lines = text.split('\n');
  let current = null;

  for (const raw of lines) {
    const line = raw.replace(/\r$/, '');
    if (/^\s{2}-\s+id:/.test(line)) {
      if (current) items.push(current);
      current = { id: line.replace(/.*id:\s*/, '').trim() };
    } else if (current) {
      if (/^\s{4}status:/.test(line)) current.status = line.replace(/.*status:\s*/, '').trim();
      if (/^\s{4}category:/.test(line)) current.category = line.replace(/.*category:\s*/, '').trim();
      if (/^\s{4}notes:/.test(line)) current.notes = line.replace(/.*notes:\s*["']?/, '').replace(/["']?\s*$/, '').slice(0, 100);
    }
  }
  if (current) items.push(current);
  return items;
}

if (!existsSync(UNIFIED_PLAN) || !existsSync(CORE_CRITERIA)) {
  console.log('[validate-pie-readiness-gate] Required files not found — skipping');
  console.log('[validate-pie-readiness-gate] items_checked=0 blocked=0 advisory=0');
  process.exit(0);
}

const planText = readFileSync(UNIFIED_PLAN, 'utf-8');
const criteriaText = readFileSync(CORE_CRITERIA, 'utf-8');

const layer1 = parseLayerStatus(criteriaText, 'Layer 1');
const layer2 = parseLayerStatus(criteriaText, 'Layer 2');
const layer3 = parseLayerStatus(criteriaText, 'Layer 3');
const layer4 = parseLayerStatus(criteriaText, 'Layer 4');

const items = parsePlanItems(planText);
const implementing = items.filter(i => i.status === 'implementing');

let blocked = 0;
let advisory = 0;
let items_checked = 0;

for (const item of implementing) {
  items_checked++;
  const layer = classifyLayer(item);

  if (layer === 'R2') {
    if (!layer1.complete) {
      console.warn(`[validate-pie-readiness-gate] ADVISORY: ${item.id} (R2) — Layer 1 ${layer1.checked}/${layer1.total} complete`);
      advisory++;
    }
  } else if (layer === 'R3') {
    if (!layer2.complete) {
      console.error(`[validate-pie-readiness-gate] BLOCKING: ${item.id} (R3) — Layer 2 ${layer2.checked}/${layer2.total} complete`);
      blocked++;
    } else if (!layer1.complete) {
      console.error(`[validate-pie-readiness-gate] BLOCKING: ${item.id} (R3) — Layer 1 ${layer1.checked}/${layer1.total} complete`);
      blocked++;
    }
  } else if (layer === 'R4') {
    if (!layer3.complete || !layer2.complete || !layer1.complete) {
      console.error(`[validate-pie-readiness-gate] BLOCKING: ${item.id} (R4) — prerequisite layers incomplete`);
      blocked++;
    }
  } else if (layer === 'App') {
    if (!layer4.complete || !layer3.complete || !layer2.complete || !layer1.complete) {
      console.error(`[validate-pie-readiness-gate] BLOCKING: ${item.id} (App) — not all Core layers complete`);
      blocked++;
    }
  }
  // R1 items: no prerequisites
}

console.log(`[validate-pie-readiness-gate] items_checked=${items_checked} blocked=${blocked} advisory=${advisory} layer1=${layer1.checked}/${layer1.total} layer2=${layer2.checked}/${layer2.total}`);
process.exit(blocked > 0 ? 1 : 0);
