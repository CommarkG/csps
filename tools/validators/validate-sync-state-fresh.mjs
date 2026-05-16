#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-sync-state-fresh
 * @csps-name validate-sync-state-fresh
 * @csps-description DNA Sync Freshness Gate: checks tools/config/universal-sync-state.json
 * is within 24 hours. ADVISORY if stale — universal-governance may have missed new DNA.
 * Also checks: principle count, moat count, contract count match current files.
 * If counts diverge: ADVISORY "run pnpm sync:dna to propagate changes."
 * T2 component of 3-direction DNA sync enforcement.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance domain:ops audience:developer
 * @csps-enforces P-OPER-001 P-META-019
 *
 * Exit: 0 always (ADVISORY)
 * Output: hours_since_sync=N principle_drift=N moat_drift=N contract_drift=N status=OK|STALE|DRIFT
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const SYNC_STATE_FILE = resolve(ROOT, 'tools/config/universal-sync-state.json');
const PRINCIPLES_FILE = resolve(ROOT, 'packages/principles/principles.yaml');
const MOAT_FILE = resolve(ROOT, 'docs/plan/pillar-0-governance/moat-registry.md');
const CONTRACTS_FILE = resolve(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts.md');

const STALE_HOURS = 24;

if (!existsSync(SYNC_STATE_FILE)) {
  console.log(`[validate-sync-state-fresh] sync-state not found — run pnpm sync:dna hours_since_sync=999 principle_drift=0 moat_drift=0 contract_drift=0 status=MISSING`);
  process.exit(0);
}

const syncState = JSON.parse(readFileSync(SYNC_STATE_FILE, 'utf-8'));
const lastSync = new Date(syncState.last_sync);
const hoursSince = Math.round((Date.now() - lastSync.getTime()) / (1000 * 60 * 60));

let status = 'OK';
let principleDrift = 0;
let moatDrift = 0;
let contractDrift = 0;

// Check staleness
if (hoursSince > STALE_HOURS) {
  status = 'STALE';
  console.warn(
    `[validate-sync-state-fresh] ADVISORY: DNA sync is ${hoursSince}h old (limit: ${STALE_HOURS}h).\n` +
    `  Run: pnpm sync:dna [--universal-path /path/to/universal-governance]\n` +
    `  New principles/moats/contracts may not be in universal-governance yet.`
  );
}

// Check count drift
const currentPrinciples = existsSync(PRINCIPLES_FILE)
  ? (readFileSync(PRINCIPLES_FILE, 'utf-8').match(/  - id: P-/g) || []).length : 0;
const currentContracts = existsSync(CONTRACTS_FILE)
  ? (readFileSync(CONTRACTS_FILE, 'utf-8').match(/^## B_[A-Z_]+/gm) || []).length : 0;
const currentMoat = existsSync(MOAT_FILE)
  ? (readFileSync(MOAT_FILE, 'utf-8').match(/\| M-\d+ \|/g) || []).length : 0;

principleDrift = currentPrinciples - (syncState.last_sync_principle_count || 0);
contractDrift = currentContracts - (syncState.last_sync_contract_count || 0);
moatDrift = currentMoat - (syncState.last_sync_moat_count || 0);

if (principleDrift > 0 || contractDrift > 0 || moatDrift > 0) {
  if (status === 'OK') status = 'DRIFT';
  console.warn(
    `[validate-sync-state-fresh] ADVISORY: DNA drift detected since last sync.\n` +
    `  Principles: +${principleDrift} | Moat elements: +${moatDrift} | Contracts: +${contractDrift}\n` +
    `  These changes are NOT yet reflected in universal-governance.\n` +
    `  Run: pnpm sync:dna to propagate.`
  );
}

console.log(`[validate-sync-state-fresh] hours_since_sync=${hoursSince} principle_drift=${principleDrift} moat_drift=${moatDrift} contract_drift=${contractDrift} status=${status}`);
process.exit(0);
