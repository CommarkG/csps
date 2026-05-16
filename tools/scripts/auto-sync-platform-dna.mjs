#!/usr/bin/env node
/**
 * @csps-id csps.tools.scripts.auto-sync-platform-dna
 * @csps-name auto-sync-platform-dna
 * @csps-description Automatically syncs CSPS platform DNA to universal-governance repo.
 * Reads: principles.yaml (new ratified_at since last sync), moat-registry.md (new M-XX),
 * behavioral-contracts.md (new B_* contracts). Pushes diffs to universal-governance repo.
 * Updates tools/config/universal-sync-state.json on every run.
 * Triggered by: daily cron + post-principles-change detect + session-open check.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:script domain:governance domain:ops audience:developer
 * @csps-enforces P-OPER-001 P-META-019
 *
 * Usage:
 *   node tools/scripts/auto-sync-platform-dna.mjs
 *   node tools/scripts/auto-sync-platform-dna.mjs --dry-run
 *   node tools/scripts/auto-sync-platform-dna.mjs --universal-path /path/to/repo
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const UNIVERSAL_PATH = (() => {
  const i = args.indexOf('--universal-path');
  return i >= 0 ? args[i + 1] : process.env.UNIVERSAL_GOVERNANCE_PATH ?? null;
})();

const SYNC_STATE_FILE = resolve(ROOT, 'tools/config/universal-sync-state.json');
const PRINCIPLES_FILE = resolve(ROOT, 'packages/principles/principles.yaml');
const MOAT_FILE = resolve(ROOT, 'docs/plan/pillar-0-governance/moat-registry.md');
const CONTRACTS_FILE = resolve(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts.md');

// ─── Load sync state ────────────────────────────────────────────────────────

const syncState = JSON.parse(readFileSync(SYNC_STATE_FILE, 'utf-8'));
const lastSync = new Date(syncState.last_sync);
const previousCount = syncState.last_sync_principle_count || 0;

console.log(`[auto-sync-platform-dna] last_sync=${syncState.last_sync} dry_run=${DRY_RUN}`);

// ─── Detect changes since last sync ─────────────────────────────────────────

const changes = { principles: [], moat: [], contracts: [] };

// 1. New ratified principles
if (existsSync(PRINCIPLES_FILE)) {
  const content = readFileSync(PRINCIPLES_FILE, 'utf-8');
  const blocks = content.split(/(?=  - id: P-)/);
  for (const block of blocks) {
    const idM = block.match(/id:\s*(P-[\w-]+)/);
    const ratifiedM = block.match(/ratified_at:\s*"?(\d{4}-\d{2}-\d{2})"?/);
    const nameM = block.match(/name:\s*(\S+)/);
    if (!idM || !ratifiedM) continue;
    if (new Date(ratifiedM[1]) > lastSync) {
      changes.principles.push({ id: idM[1], name: nameM?.[1] ?? idM[1], ratified_at: ratifiedM[1] });
    }
  }
}

// 2. New moat elements (M-NN lines added since last sync)
if (existsSync(MOAT_FILE)) {
  const content = readFileSync(MOAT_FILE, 'utf-8');
  const moatLines = content.match(/\| M-\d+ \|[^|]+\|/g) || [];
  const currentCount = moatLines.length;
  if (currentCount > (syncState.last_sync_moat_count || 0)) {
    const newCount = currentCount - (syncState.last_sync_moat_count || 0);
    changes.moat.push(`${newCount} new moat element(s) detected`);
  }
}

// 3. New behavioral contracts (B_* headings)
if (existsSync(CONTRACTS_FILE)) {
  const content = readFileSync(CONTRACTS_FILE, 'utf-8');
  const contracts = (content.match(/^## B_[A-Z_]+/gm) || []).length;
  if (contracts > (syncState.last_sync_contract_count || 0)) {
    const newCount = contracts - (syncState.last_sync_contract_count || 0);
    changes.contracts.push(`${newCount} new B_* contract(s) detected`);
  }
}

const hasChanges = changes.principles.length > 0 || changes.moat.length > 0 || changes.contracts.length > 0;

if (!hasChanges) {
  console.log(`[auto-sync-platform-dna] no changes detected — universal-governance is current`);
} else {
  console.log(`[auto-sync-platform-dna] changes detected:`);
  if (changes.principles.length) console.log(`  + ${changes.principles.length} new principle(s): ${changes.principles.map(p => p.id).join(', ')}`);
  if (changes.moat.length) console.log(`  + ${changes.moat.join(', ')}`);
  if (changes.contracts.length) console.log(`  + ${changes.contracts.join(', ')}`);
}

// ─── Push to universal-governance repo (if path provided) ───────────────────

if (hasChanges && UNIVERSAL_PATH && existsSync(UNIVERSAL_PATH)) {
  if (DRY_RUN) {
    console.log(`[auto-sync-platform-dna] DRY RUN — would push to ${UNIVERSAL_PATH}`);
  } else {
    try {
      // Generate a DNA update entry for universal-governance.md
      const updateEntry = [
        `\n## CSPS DNA Update — ${new Date().toISOString().split('T')[0]}`,
        '',
        changes.principles.length ? `### New principles: ${changes.principles.map(p => `${p.id} (${p.name})`).join(', ')}` : '',
        changes.moat.length ? `### Moat: ${changes.moat.join(', ')}` : '',
        changes.contracts.length ? `### Contracts: ${changes.contracts.join(', ')}` : '',
        '',
        `*Auto-synced by pnpm sync:dna from github.com/CommarkG/csps*`,
      ].filter(Boolean).join('\n');

      const ugFile = resolve(UNIVERSAL_PATH, 'universal-governance.md');
      if (existsSync(ugFile)) {
        const current = readFileSync(ugFile, 'utf-8');
        writeFileSync(ugFile, current + updateEntry, 'utf-8');
      }

      execSync('git add universal-governance.md && git commit -m "auto: CSPS DNA sync" && git push origin main', {
        cwd: UNIVERSAL_PATH,
        encoding: 'utf-8',
      });
      console.log(`[auto-sync-platform-dna] pushed to universal-governance`);
    } catch (err) {
      console.error(`[auto-sync-platform-dna] push failed: ${err.message}`);
    }
  }
} else if (hasChanges && !UNIVERSAL_PATH) {
  console.log(`[auto-sync-platform-dna] ADVISORY: changes detected but no --universal-path provided`);
  console.log(`  Run: node tools/scripts/auto-sync-platform-dna.mjs --universal-path /path/to/universal-governance`);
  console.log(`  Or:  UNIVERSAL_GOVERNANCE_PATH=/path pnpm sync:dna`);
}

// ─── Update sync state ────────────────────────────────────────────────────────

const principlesContent = existsSync(PRINCIPLES_FILE) ? readFileSync(PRINCIPLES_FILE, 'utf-8') : '';
const contractsContent = existsSync(CONTRACTS_FILE) ? readFileSync(CONTRACTS_FILE, 'utf-8') : '';
const moatContent = existsSync(MOAT_FILE) ? readFileSync(MOAT_FILE, 'utf-8') : '';

syncState.last_sync = new Date().toISOString();
syncState.last_sync_principle_count = (principlesContent.match(/  - id: P-/g) || []).length;
syncState.last_sync_contract_count = (contractsContent.match(/^## B_[A-Z_]+/gm) || []).length;
syncState.last_sync_moat_count = (moatContent.match(/\| M-\d+ \|/g) || []).length;

writeFileSync(SYNC_STATE_FILE, JSON.stringify(syncState, null, 2) + '\n', 'utf-8');
console.log(`[auto-sync-platform-dna] sync_state_updated principles=${syncState.last_sync_principle_count} contracts=${syncState.last_sync_contract_count} moat=${syncState.last_sync_moat_count}`);
