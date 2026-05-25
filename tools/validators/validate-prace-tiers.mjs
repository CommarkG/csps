#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-prace-tiers
 * @csps-name validate-prace-tiers
 * @csps-description T2 for B_PRACE. Scans B_* contract shard files for contracts
 * that are declared as T3-only (no real T1 hook name, no real T2 validator name).
 * T3-only contracts are governance theater — session-open.sh + AGENTS.md alone cannot
 * mechanically enforce. Advisory flags surface contracts that need mechanical upgrade.
 * ADVISORY-only: exits 0 always. Surfaces T3-only count for next-session planning.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_PRACE P-META-019
 * context_question: "Does any B_* contract rely solely on T3 (session-open/AGENTS.md) with no mechanical T1/T2?"
 * Plan item: gap_T2_ORPHAN_CONTRACTS | S061
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const CONTRACTS_DIR = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts');

let blocking = 0;
let advisory = 0;
let files_checked = 0;
let t3_only_count = 0;

function isT3Only(content) {
  const lower = content.toLowerCase();
  // Explicit T3-only declarations
  if (lower.includes('t3-only') || lower.includes('t3 only') || lower.includes('session-only')) return true;
  // enforcement_tier block that shows no-hook or no-validator
  if (lower.includes('no-hook') || lower.includes('no-validator')) return true;
  return false;
}

function hasPendingMechanical(content) {
  const lower = content.toLowerCase();
  return lower.includes('t1: pending') || lower.includes('t2: pending') ||
         lower.includes('t1: tbd') || lower.includes('t2: tbd') ||
         lower.includes('t1: none') || lower.includes('t2: none');
}

function isSessionOpenOnly(content) {
  // T1/T2 both point only to session-open.sh or AGENTS.md with no real hook/validator name
  const t1Match = content.match(/t1[:\s]+([^\n]+)/i);
  const t2Match = content.match(/t2[:\s]+([^\n]+)/i);
  if (!t1Match && !t2Match) return false;
  const t1Val = t1Match ? t1Match[1].toLowerCase().trim() : '';
  const t2Val = t2Match ? t2Match[1].toLowerCase().trim() : '';
  const sessionOnlyTerms = ['session-open.sh', 'agents.md', 'session open', 'manual'];
  const t1IsSessionOnly = t1Val && sessionOnlyTerms.some(t => t1Val.includes(t)) && !t1Val.includes('validate-') && !t1Val.includes('hook-');
  const t2IsSessionOnly = t2Val && sessionOnlyTerms.some(t => t2Val.includes(t)) && !t2Val.includes('validate-') && !t2Val.includes('hook-');
  return (t1IsSessionOnly || !t1Val) && (t2IsSessionOnly || !t2Val);
}

if (!existsSync(CONTRACTS_DIR)) {
  console.log(`[validate-prace-tiers] contracts_dir_not_found=${CONTRACTS_DIR} files_checked=0 t3_only_count=0 advisory=0`);
  process.exit(0);
}

const entries = readdirSync(CONTRACTS_DIR, { withFileTypes: true });
for (const entry of entries) {
  if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
  if (!entry.name.startsWith('B_') && !entry.name.startsWith('b_')) continue;
  files_checked++;
  const filePath = join(CONTRACTS_DIR, entry.name);
  const content = readFileSync(filePath, 'utf-8');

  const hasEnforcementTier = /enforcement_tier/i.test(content);
  if (!hasEnforcementTier) continue; // no tier declared at all — different validator's concern

  let flagged = false;
  if (isT3Only(content)) {
    flagged = true;
    console.warn(`[validate-prace-tiers] ADVISORY: ${entry.name} — explicit T3-only declaration. Needs mechanical T1/T2 upgrade.`);
  } else if (hasPendingMechanical(content)) {
    flagged = true;
    console.warn(`[validate-prace-tiers] ADVISORY: ${entry.name} — T1 or T2 is "pending"/"TBD"/"none". Schedule mechanical enforcement.`);
  } else if (isSessionOpenOnly(content)) {
    flagged = true;
    console.warn(`[validate-prace-tiers] ADVISORY: ${entry.name} — T1/T2 point only to session-open.sh/AGENTS.md. No real hook or validator found.`);
  }

  if (flagged) {
    t3_only_count++;
    advisory++;
  }
}

if (advisory > 0) {
  console.warn(`[validate-prace-tiers] ${advisory} contract(s) rely on T3-only enforcement. Upgrade to mechanical T1/T2 in next session.`);
}

console.log(`[validate-prace-tiers] files_checked=${files_checked} t3_only_count=${t3_only_count} advisory=${advisory}`);
process.exit(0); // ADVISORY-only: never blocks
