#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-core-reminder
 * @csps-name validate-core-reminder
 * @csps-description AP-001 structural fix — checks csps_core_reminder fields in governed artifacts.
 *   For each governed artifact with csps_core_reminder field, verifies each listed ID
 *   exists in principles.yaml or behavioral-contracts/.
 *   Also reports: how many governed artifacts have the field vs. don't.
 *   ADVISORY (exit 0). Raising coverage is gradual.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces CORE-REMINDER-DNA AP-001
 *
 * Exit: 0 always (advisory). Reports: files_with_reminder=N, stale_refs=N
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// Load valid principle IDs for cross-ref check
const principlesYaml = join(ROOT, 'packages/principles/principles.yaml');
const contractsDir = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts');
let validIds = new Set();
if (existsSync(principlesYaml)) {
  const content = readFileSync(principlesYaml, 'utf8');
  const ids = content.match(/^  id:\s+(\S+)/mg) || [];
  ids.forEach(m => validIds.add(m.replace(/.*id:\s+/, '').trim()));
}
if (existsSync(contractsDir)) {
  readdirSync(contractsDir).filter(f => f.endsWith('.md')).forEach(f => validIds.add(f.replace('.md', '')));
}
// Also accept AP-NNN pattern
const AP_PATTERN = /^AP-\d+/;

function walkMd(dir, results = []) {
  try {
    for (const entry of readdirSync(dir)) {
      if (entry.startsWith('.') || entry === 'node_modules') continue;
      const full = join(dir, entry);
      const s = statSync(full);
      if (s.isDirectory()) walkMd(full, results);
      else if (entry.endsWith('.md')) results.push(full);
    }
  } catch {}
  return results;
}

// Scan docs/plan/ and tools/ for governed artifacts
const searchDirs = [join(ROOT, 'docs/plan/pillar-0-governance'), join(ROOT, 'tools/council')];
let filesWithReminder = 0;
let filesWithoutReminder = 0;
let staleRefs = 0;
let totalScanned = 0;

for (const dir of searchDirs) {
  if (!existsSync(dir)) continue;
  const files = walkMd(dir);
  for (const file of files) {
    totalScanned++;
    const content = readFileSync(file, 'utf8');
    if (!content.startsWith('---')) continue; // not a governed artifact
    // Extract csps_core_reminder field
    const reminderMatch = content.match(/^csps_core_reminder:\s*\[([^\]]*)\]/m);
    if (!reminderMatch) { filesWithoutReminder++; continue; }
    filesWithReminder++;
    const refs = reminderMatch[1].split(',').map(r => r.trim()).filter(Boolean);
    for (const ref of refs) {
      if (!validIds.has(ref) && !AP_PATTERN.test(ref)) {
        staleRefs++;
        const rel = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');
        console.log(`  ADVISORY [CORE-REMINDER] ${rel}: csps_core_reminder ref "${ref}" not found in principles.yaml or behavioral-contracts/`);
      }
    }
  }
}

console.log(`[validate-core-reminder] scanned=${totalScanned} with_reminder=${filesWithReminder} without_reminder=${filesWithoutReminder} stale_refs=${staleRefs}`);
if (filesWithoutReminder > 0) {
  console.log(`[validate-core-reminder] ADVISORY: ${filesWithoutReminder} governed artifacts in scanned dirs have no cscs_core_reminder field. Backfill gradually per CORE-REMINDER-DNA.`);
}
process.exit(0);
