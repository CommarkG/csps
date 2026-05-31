#!/usr/bin/env node
// Scan docs/plan + docs/SIA for non-terminal status files missing closure obligation
import { readdirSync, readFileSync } from 'fs';
import { join, relative } from 'path';

const ROOT = process.cwd();
const NON_TERMINAL = new Set(['draft', 'proposed', 'pending-review']);
const AWAITING_RE = /^awaiting-/;

function scanDir(dir, results = []) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return results; }
  for (const e of entries) {
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === '_trials-vaulted') continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) { scanDir(full, results); continue; }
    if (!e.name.endsWith('.md') && !e.name.endsWith('.yaml')) continue;
    let content;
    try { content = readFileSync(full, 'utf-8'); } catch { continue; }
    const statusMatch = content.match(/^status:\s*(.+)$/m);
    if (!statusMatch) continue;
    const status = statusMatch[1].trim().replace(/['"]/g, '');
    if (!NON_TERMINAL.has(status) && !AWAITING_RE.test(status)) continue;
    const hasClosure = content.includes('closure_owner') && content.includes('closure_decision') && content.includes('closure_by');
    const session = (content.match(/^session:\s*(\S+)$/m) || [null, 'unknown'])[1];
    const rel = relative(ROOT, full).replace(/\\/g, '/');
    results.push({ file: rel, status, hasClosure, session });
  }
  return results;
}

const allFiles = [...scanDir(join(ROOT, 'docs/plan')), ...scanDir(join(ROOT, 'docs/SIA'))];
const floaters = allFiles.filter(f => !f.hasClosure);
const withObligation = allFiles.filter(f => f.hasClosure);

console.log('[scan-floaters] Total non-terminal files:', allFiles.length);
console.log('[scan-floaters] With closure obligation:', withObligation.length);
console.log('[scan-floaters] Missing closure obligation:', floaters.length);
console.log('');
floaters.forEach(f => console.log(`  ${f.status.padEnd(16)} ${f.session.padEnd(8)} ${f.file}`));
