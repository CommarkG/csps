#!/usr/bin/env node
/**
 * obligations-ledger.mjs — C1 S086 INHERITANCE-LOOP: Single Obligations Ledger
 * One enumerable view over all obligation registers (no new data; consolidates existing).
 *
 * Sources consumed (read-only, no mutation):
 *   - tools/data/gap-recurrence-register.yaml (gap_* entries, status: open)
 *   - tools/data/improvement-register.yaml (imp_* entries, not_yet_propagated)
 *   - tools/data/park-register.yaml (PARK-* entries, closed_session: null + not absorbed/closed)
 *   - tools/session-state.json (blocking_decisions, ratified_vtls with status !== RESOLVED)
 *
 * Usage:
 *   node tools/lib/obligations-ledger.mjs          → print summary
 *   node tools/lib/obligations-ledger.mjs --json   → JSON array of all open obligations
 *   import { getOpenObligations } from './obligations-ledger.mjs'
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// ── Parsers ───────────────────────────────────────────────────────────────────

function parseYamlEntries(text, idPattern) {
  // Simple line-by-line extraction for known register formats
  const entries = [];
  let current = null;
  for (const line of text.split('\n')) {
    const idMatch = line.match(/^\s*-\s*id:\s*["']?([^"'\n]+?)["']?\s*$/);
    if (idMatch) {
      if (current) entries.push(current);
      current = { id: idMatch[1].trim() };
    } else if (current) {
      const m = line.match(/^\s+(\w+):\s*(.+?)\s*$/);
      if (m) current[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
    }
  }
  if (current) entries.push(current);
  return entries.filter(e => idPattern.test(e.id));
}

// ── Load obligation sources ───────────────────────────────────────────────────

export function getOpenObligations() {
  const obligations = [];

  // 1. Gap-recurrence register — open entries with k_count >= 2 and no structural_fix_committed
  const gapPath = join(ROOT, 'tools/data/gap-recurrence-register.yaml');
  if (existsSync(gapPath)) {
    const entries = parseYamlEntries(readFileSync(gapPath, 'utf-8'), /^gap_/);
    for (const e of entries) {
      const isOpen = e.status !== 'closed' && e.status !== 'resolved' && e.structural_fix_committed !== 'true';
      const kCount = parseInt(e.k_count || '0', 10);
      if (isOpen && kCount >= 2) {
        obligations.push({ source: 'gap-recurrence', id: e.id, description: e.description || e.id, k_count: kCount, status: e.status || 'open' });
      }
    }
  }

  // 2. Improvement register — not_yet_propagated entries
  const impPath = join(ROOT, 'tools/data/improvement-register.yaml');
  if (existsSync(impPath)) {
    const entries = parseYamlEntries(readFileSync(impPath, 'utf-8'), /^imp_/);
    for (const e of entries) {
      if (e.status === 'not_yet_propagated' || e.propagation_status === 'not_yet_propagated') {
        obligations.push({ source: 'improvement-register', id: e.id, description: e.description || e.id, status: 'not_yet_propagated' });
      }
    }
  }

  // 3. Park register — open entries (no closed_session AND not absorbed/closed)
  const parkPath = join(ROOT, 'tools/data/park-register.yaml');
  if (existsSync(parkPath)) {
    const entries = parseYamlEntries(readFileSync(parkPath, 'utf-8'), /^PARK-S\d+-\d+$|^PHASEB-BUNDLE$/);
    for (const e of entries) {
      const isClosed = e.closed_session && e.closed_session !== 'null';
      const isAbsorbed = e.status === 'absorbed' || e.status === 'closed';
      if (!isClosed && !isAbsorbed && e.lane) {
        obligations.push({ source: 'park-register', id: e.id, description: (e.content || '').slice(0, 100), lane: e.lane, status: e.status || 'open' });
      }
    }
  }

  // 4. Session-state blocking decisions
  const ssPath = join(ROOT, 'tools/session-state.json');
  if (existsSync(ssPath)) {
    try {
      const ss = JSON.parse(readFileSync(ssPath, 'utf-8'));
      for (const d of (ss.blocking_decisions || [])) {
        if (d.status !== 'RESOLVED') {
          obligations.push({ source: 'blocking-decisions', id: d.id || d.vlt || 'unknown', description: d.decision || d.id, status: d.status || 'open' });
        }
      }
      for (const [id, v] of Object.entries(ss.ratified_vtls || {})) {
        if (v.status !== 'RESOLVED') {
          obligations.push({ source: 'ratified-vtls', id, description: v.decision || id, status: v.status || 'open' });
        }
      }
    } catch { /* parse error — skip */ }
  }

  return obligations;
}

// ── CLI ────────────────────────────────────────────────────────────────────────

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('obligations-ledger.mjs')) {
  const obligations = getOpenObligations();
  const isJson = process.argv.includes('--json');

  if (isJson) {
    process.stdout.write(JSON.stringify(obligations, null, 2) + '\n');
  } else {
    const bySource = {};
    for (const o of obligations) {
      bySource[o.source] = bySource[o.source] || [];
      bySource[o.source].push(o);
    }
    console.log(`[obligations-ledger] total_open=${obligations.length}`);
    for (const [src, items] of Object.entries(bySource)) {
      console.log(`  ${src}: ${items.length} items`);
      items.slice(0, 3).forEach(o => console.log(`    ${o.id}: ${(o.description || '').slice(0, 80)}`));
      if (items.length > 3) console.log(`    ... and ${items.length - 3} more`);
    }
  }
}
