#!/usr/bin/env node
/**
 * close-gate-top3-pe-check.mjs — WAVE-2-STEP-3 close-gate extension.
 * inherits_from: PROTO-S066-WAVE-2 Core Seed pattern
 */
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const REG_PATHS = [
  join(ROOT, 'tools', 'data', 'improvement-register.yaml'),
  join(ROOT, 'tools', 'data', 'gap-recurrence-register.yaml'),
];
const CS_DIR = join(ROOT, 'docs', 'plan', '_handoff', 'VAULT', 'closing-summaries');
const CLOSED = new Set(['closed', 'resolved', 'propagated', 'fix_committed', 'cec_run', 'structural_fix_proposed_and_wired']);

function computePE(k) { return Math.round(k * 15 / 2); }

function hasBypass(findingId) {
  if (!existsSync(CS_DIR)) return false;
  try {
    const files = readdirSync(CS_DIR).filter(f => f.endsWith('.md')).sort().reverse();
    for (const f of files.slice(0, 1)) {
      const c = readFileSync(join(CS_DIR, f), 'utf-8');
      if (c.includes('10.0k') && c.includes(findingId)) return true;
    }
  } catch (e) {}
  return false;
}

const openFindings = [];

for (const rp of REG_PATHS) {
  if (!existsSync(rp)) continue;
  const raw = readFileSync(rp, 'utf-8');
  const lines = raw.split(/\r?\n/);
  let cur = null;
  
  for (const line of lines) {
    if (/^  - id:\s+(\S+)/.test(line)) {
      if (cur && !CLOSED.has(cur.status || '')) {
        openFindings.push({
          id: cur.id,
          k_count: cur.k || 1,
          pe_internal: computePE(cur.k || 1),
          has_fix: cur.fix,
          has_defer: cur.defer
        });
      }
      cur = { id: line.replace(/^  - id:\s+/, '').trim(), k: 1, status: '', fix: false, defer: false };
    } else if (cur) {
      if (/^\s+status:\s+(\S+)/.test(line)) cur.status = line.match(/status:\s+(\S+)/)[1];
      if (/^\s+k_count:\s+(\d+)/.test(line)) cur.k = parseInt(line.match(/k_count:\s+(\d+)/)[1]);
      if (/^\s+fix_commit_sha:\s+(?!null)\S/.test(line)) cur.fix = true;
      if (/^\s+explicit_defer_reason:\s+(?!null)[^$]/.test(line)) cur.defer = true;
    }
  }
  if (cur && !CLOSED.has(cur.status || '')) {
    openFindings.push({ id: cur.id, k_count: cur.k || 1, pe_internal: computePE(cur.k || 1), has_fix: cur.fix, has_defer: cur.defer });
  }
}

openFindings.sort((a, b) => b.pe_internal - a.pe_internal);
const top3 = openFindings.slice(0, 3);
const violations = top3.filter(f => !f.has_fix && !f.has_defer && !hasBypass(f.id));

if (violations.length > 0) {
  process.stderr.write(`[close-gate-top3-pe] BLOCKING: ${violations.length} top-3 findings missing fix+defer.\n  Top-3:\n`);
  for (const f of top3) {
    const s = (!f.has_fix && !f.has_defer) ? 'MISSING' : 'OK';
    process.stderr.write(`    ${s}: ${f.id} (K=${f.k_count}, pe=${f.pe_internal})\n`);
  }
  process.stderr.write(`  Fix: add fix_commit_sha or explicit_defer_reason. Bypass: §10.0k in closing-summary.\n`);
  process.exit(1);
}

process.stdout.write(`[close-gate-top3-pe] PASS: ${openFindings.length} findings checked, top-${top3.length} all have fix or defer.\n`);
process.exit(0);
