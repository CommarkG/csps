/**
 * @csps-id csps.libs.intelligence.learning-loop
 * Learning Loop sub-engine — scans gap/improvement registers and writes session summaries.
 * D1 always active (runs lightweight scan on every session close).
 * Full activation: session close, K≥2 findings detected.
 * Design: docs/SIA/R2-01-PLATFORM-INTELLIGENCE-ENGINE.md § Learning Loop
 * Plan item: COMBINATORIAL-ENGINE | S056 | Layer 2 R2
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { EngineStatus } from './cie-state.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const GAP_REGISTER = join(ROOT, 'tools/data/gap-recurrence-register.yaml');
const IMPROVEMENT_REGISTER = join(ROOT, 'tools/data/improvement-register.yaml');
const PENDING_ITEMS = join(ROOT, 'tools/data/pending-plan-items.yaml');
const SUMMARIES_DIR = join(ROOT, '.csps', 'learning-loop');

export interface GapFinding {
  id: string;
  k_count: number;
  status: string;
  observation?: string;
  structural_fix_triggered: boolean;
}

export interface ImprovementFinding {
  id: string;
  k_count: number;
  status: string;
  finding?: string;
  not_yet_propagated: string[];
}

export interface LearningLoopOutput {
  session: string;
  gaps_k2_no_fix: GapFinding[];
  improvements_k2_open: ImprovementFinding[];
  items_queued_to_pending: number;
  ran_at: string;
}

function parseYamlEntries(text: string, idPrefix = ''): Record<string, string>[] {
  const entries: Record<string, string>[] = [];
  const lines = text.split('\n');
  let current: Record<string, string> | null = null;
  let inNotYet = false;
  const notYetList: string[] = [];

  for (const raw of lines) {
    const line = raw.replace(/\r$/, '');
    if (/^\s{2}-\s+id:\s+/.test(line)) {
      if (current) {
        if (notYetList.length > 0) current['_not_yet'] = notYetList.join('|||');
        entries.push(current);
      }
      current = { id: line.replace(/.*id:\s*/, '').trim() };
      notYetList.length = 0;
      inNotYet = false;
    } else if (current) {
      if (/^\s{4}k_count:\s+/.test(line)) current['k_count'] = line.replace(/.*k_count:\s*/, '').trim();
      else if (/^\s{4}status:\s+/.test(line)) current['status'] = line.replace(/.*status:\s*/, '').trim();
      else if (/^\s{4}structural_fix_triggered:\s+/.test(line)) current['structural_fix_triggered'] = line.replace(/.*structural_fix_triggered:\s*/, '').trim();
      else if (/^\s{4}observation:\s+/.test(line)) current['observation'] = line.replace(/.*observation:\s*"?([^"]*)"?\s*$/, '$1').trim();
      else if (/^\s{4}finding:\s+/.test(line)) current['finding'] = line.replace(/.*finding:\s*"?([^"]*)"?\s*$/, '$1').trim();
      else if (/^\s{4}not_yet_propagated:/.test(line)) inNotYet = true;
      else if (inNotYet && /^\s{6}-\s+/.test(line)) notYetList.push(line.replace(/^\s{6}-\s+/, '').trim());
      else if (inNotYet && !/^\s{6}/.test(line) && line.trim() !== '') inNotYet = false;
    }
  }
  if (current) {
    if (notYetList.length > 0) current['_not_yet'] = notYetList.join('|||');
    entries.push(current);
  }
  return entries;
}

/** Scan gap-recurrence-register.yaml — find K≥2 with no structural fix */
export function scanGapRegister(): GapFinding[] {
  if (!existsSync(GAP_REGISTER)) return [];
  const raw = readFileSync(GAP_REGISTER, 'utf-8');
  const entries = parseYamlEntries(raw);
  return entries
    .filter(e => {
      const k = Number(e['k_count'] ?? 0);
      const hasFix = e['structural_fix_triggered'] === 'true';
      const status = e['status'] ?? '';
      return k >= 2 && !hasFix && !['closed', 'resolved'].includes(status);
    })
    .map(e => ({
      id: e['id'] ?? '',
      k_count: Number(e['k_count'] ?? 0),
      status: e['status'] ?? '',
      observation: e['observation'],
      structural_fix_triggered: e['structural_fix_triggered'] === 'true',
    }));
}

/** Scan improvement-register.yaml — find K≥2 with not_yet_propagated items */
export function scanImprovementRegister(): ImprovementFinding[] {
  if (!existsSync(IMPROVEMENT_REGISTER)) return [];
  const raw = readFileSync(IMPROVEMENT_REGISTER, 'utf-8');
  const entries = parseYamlEntries(raw);
  return entries
    .filter(e => {
      const k = Number(e['k_count'] ?? 0);
      const status = e['status'] ?? '';
      const notYet = e['_not_yet'] ?? '';
      return k >= 2 && !['propagated', 'closed'].includes(status) && notYet.length > 0;
    })
    .map(e => ({
      id: e['id'] ?? '',
      k_count: Number(e['k_count'] ?? 0),
      status: e['status'] ?? '',
      finding: e['finding'],
      not_yet_propagated: (e['_not_yet'] ?? '').split('|||').filter(Boolean),
    }));
}

/** Write session summary to .csps/learning-loop/session-{S}.yaml */
export function writeSessionSummary(session: string, output: LearningLoopOutput): void {
  if (!existsSync(SUMMARIES_DIR)) mkdirSync(SUMMARIES_DIR, { recursive: true });
  const path = join(SUMMARIES_DIR, `session-${session}.yaml`);
  writeFileSync(path, JSON.stringify(output, null, 2), 'utf-8');
}

/** Append findings to tools/data/pending-plan-items.yaml */
export function appendToPendingItems(findings: ImprovementFinding[]): number {
  if (findings.length === 0 || !existsSync(PENDING_ITEMS)) return 0;
  const existing = readFileSync(PENDING_ITEMS, 'utf-8');
  let count = 0;
  const lines: string[] = [];
  for (const f of findings) {
    if (existing.includes(`source_id: ${f.id}`)) continue;
    const today = new Date().toISOString().slice(0, 10);
    lines.push(`\n  - source_id: ${f.id}\n    generated: ${today}\n    k_count: ${f.k_count}\n    status: draft\n    not_yet_propagated_count: ${f.not_yet_propagated.length}`);
    count++;
  }
  if (lines.length > 0) {
    const updated = existing.trimEnd() + '\n' + lines.join('\n') + '\n';
    writeFileSync(PENDING_ITEMS, updated, 'utf-8');
  }
  return count;
}

/** Run D1 Learning Loop scan and return status */
export function runD1(session: string): EngineStatus & { output?: LearningLoopOutput } {
  const gaps = scanGapRegister();
  const improvements = scanImprovementRegister();
  const alert = gaps.length > 0 || improvements.length > 0;
  const output: LearningLoopOutput = {
    session,
    gaps_k2_no_fix: gaps,
    improvements_k2_open: improvements,
    items_queued_to_pending: 0,
    ran_at: new Date().toISOString(),
  };
  return {
    engine_id: 'learning-loop',
    d_level: 1,
    alert,
    alert_reason: alert ? `${gaps.length} gap(s) K≥2 no fix, ${improvements.length} improvement(s) K≥2 open` : undefined,
    last_run: output.ran_at,
    output,
  };
}
