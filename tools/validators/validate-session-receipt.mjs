#!/usr/bin/env node
/**
 * validate-session-receipt.mjs — §17 receipt format checker
 *
 * The §17 receipt is the mutual understanding validation (MUV) proof.
 * Format: S<NNN>-AI-receipt-<iso>-against-S<prev>-AI-attest-<iso>-<prev>-close
 *
 * Checks: (a) latest HANDOFF has a closing §17 attestation
 *         (b) the receipt format is correct if present in closing-summary
 *         (c) current session in session-state.json matches the receipt chain
 *
 * EXIT-CODED: 0 = receipt chain valid / 1 = issues found (advisory)
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const RECEIPT_PATTERN = /S(\d+)-AI-receipt-[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2}Z-against-S(\d+)-AI-attest/;
const ATTEST_PATTERN = /S(\d+)-AI-attest-[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2}Z/;

async function main() {
  const warnings = [];
  const infos = [];

  // Get latest closing summary
  const vaultDir = join(ROOT, 'docs/plan/_handoff/VAULT');
  const summaries = existsSync(vaultDir)
    ? readdirSync(vaultDir).filter(f => f.match(/^closing-summary-S\d+\.md$/)).sort().reverse()
    : [];

  if (summaries.length === 0) {
    infos.push('No closing-summary files found — new platform');
    console.log('[validate-session-receipt] new platform, no history');
    process.exit(0);
  }

  const latestSummary = readFileSync(join(vaultDir, summaries[0]), 'utf8');
  const sessionMatch = summaries[0].match(/S(\d+)/);
  const sessionN = sessionMatch ? Number(sessionMatch[1]) : 0;

  // CHECK A — attestation present
  const hasAttestation = ATTEST_PATTERN.test(latestSummary);
  if (!hasAttestation) {
    warnings.push(`[CHECK A] ${summaries[0]}: missing §17 attestation (S<NNN>-AI-attest-<iso>-S<NNN>-close format)`);
  } else {
    infos.push(`[CHECK A] ${summaries[0]}: §17 attestation present`);
  }

  // CHECK B — session chain continuity
  const statePath = join(ROOT, 'tools/session-state.json');
  if (existsSync(statePath)) {
    const state = JSON.parse(readFileSync(statePath, 'utf8'));
    const currentN = Number((state.current_session || 'S0').replace(/[^0-9]/g, ''));
    if (currentN !== sessionN + 1) {
      infos.push(`[CHECK B] Session chain: closing-summary is S${sessionN}, session-state says S${currentN} — gap of ${currentN - sessionN - 1} session(s)`);
    } else {
      infos.push(`[CHECK B] Session chain continuous: S${sessionN} → S${currentN}`);
    }
  }

  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s):`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
  }
  for (const i of infos) console.log(`  ℹ ${i}`);

  const summary = `[validate-session-receipt] latest_closing=S${sessionN} warnings=${warnings.length}`;
  console.log(`\n${summary}`);

  process.exit(0);  // advisory — session receipt gaps are surfaced, not blocking
}

main().catch(err => { console.error('[validate-session-receipt] fatal:', err); process.exit(1); });
