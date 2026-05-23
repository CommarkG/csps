/**
 * @csps-id csps.libs.intelligence.pe
 * PE sub-engine — wraps pe-compute + Queen timing + readiness gate.
 * D1 always active: returns top-N PE items + readiness alert if any
 * implementing item has unmet layer prerequisites.
 * Design: docs/SIA/R2-01-PLATFORM-INTELLIGENCE-ENGINE.md § PE Sub-engine
 * Plan item: COMBINATORIAL-ENGINE | S056 | Layer 2 R2
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { EngineStatus } from './cie-state.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const UNIFIED_PLAN = join(ROOT, 'tools/config/unified-plan.yaml');
const CORE_CRITERIA = join(ROOT, 'docs/plan/pillar-0-governance/CORE-COMPLETE-EXIT-CRITERIA.md');

export interface PEItem {
  id: string;
  title: string;
  pe_score: number;
  status: string;
  owner: string;
}

function parsePlanItems(text: string): PEItem[] {
  const items: PEItem[] = [];
  const lines = text.split('\n');
  let current: Partial<PEItem> | null = null;

  for (const raw of lines) {
    const line = raw.replace(/\r$/, '');
    if (/^\s{2}-\s+id:/.test(line)) {
      if (current?.id) items.push(current as PEItem);
      current = { id: line.replace(/.*id:\s*/, '').trim() };
    } else if (current) {
      if (/^\s{4}title:/.test(line)) current.title = line.replace(/.*title:\s*"?([^"]*)"?$/, '$1').trim();
      else if (/^\s{4}pe_score:/.test(line)) current.pe_score = Number(line.replace(/.*pe_score:\s*/, '').trim());
      else if (/^\s{4}status:/.test(line)) current.status = line.replace(/.*status:\s*/, '').trim();
      else if (/^\s{4}owner:/.test(line)) current.owner = line.replace(/.*owner:\s*/, '').trim();
    }
  }
  if (current?.id) items.push(current as PEItem);
  return items;
}

/** Get top N items by pe_score */
export function getTopItems(n: number): PEItem[] {
  if (!existsSync(UNIFIED_PLAN)) return [];
  const raw = readFileSync(UNIFIED_PLAN, 'utf-8');
  const items = parsePlanItems(raw);
  return items
    .filter(i => i.pe_score > 0 && !['done', 'design_complete', 'intake'].includes(i.status))
    .sort((a, b) => (b.pe_score ?? 0) - (a.pe_score ?? 0))
    .slice(0, n);
}

/**
 * Check readiness gate for an item — does it have unmet layer prerequisites?
 * B_PIE_READINESS_GATE: R2 requires Layer 1 4/4, R3 requires Layer 2, etc.
 * Phase 1: advisory only (reads exit criteria markdown, reports status).
 */
export function checkReadinessGate(itemId: string): { clear: boolean; reason?: string } {
  if (!existsSync(CORE_CRITERIA)) return { clear: true, reason: 'CORE-COMPLETE-EXIT-CRITERIA.md not found' };
  const text = readFileSync(CORE_CRITERIA, 'utf-8');
  // Phase 1: simple heuristic — check if itemId contains R2/R3/R4/App keywords
  // Full validation planned for validate-pie-readiness-gate.mjs (S057)
  const isR2 = itemId.includes('COMBINATORIAL') || itemId.includes('PIE') || itemId.includes('LEARNING');
  const isR3 = itemId.includes('INFRA-FLOW') || itemId.includes('JOURNEY') || itemId.includes('PLAYGROUND');
  const layer1Complete = text.includes('4/4');
  const layer2Complete = text.includes('Layer 2') && text.includes('COMPLETE');

  if (isR2 && !layer1Complete) return { clear: false, reason: 'R2 item requires Layer 1 4/4 complete' };
  if (isR3 && !layer2Complete) return { clear: false, reason: 'R3 item requires Layer 2 complete' };
  return { clear: true };
}

/** Run D1 PE scan — check top items and readiness gate */
export function runD1(session: string): EngineStatus {
  const topItems = getTopItems(5);
  const implementingItems = topItems.filter(i => i.status === 'implementing');
  const gateViolations = implementingItems
    .map(i => ({ item: i, gate: checkReadinessGate(i.id) }))
    .filter(x => !x.gate.clear);

  const alert = gateViolations.length > 0;
  return {
    engine_id: 'pe',
    d_level: 1,
    alert,
    alert_reason: alert
      ? `${gateViolations.length} implementing item(s) have unmet layer prerequisites: ${gateViolations.map(v => v.item.id).join(', ')}`
      : undefined,
    last_run: new Date().toISOString(),
  };
}
