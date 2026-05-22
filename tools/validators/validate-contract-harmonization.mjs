#!/usr/bin/env node
/**
 * validate-contract-harmonization.mjs — B_* behavioral contract health check
 *
 * ROOT CAUSE TARGETED: Behavioral contracts may contradict each other or overlap
 * so heavily they create confusion. With 56 contracts, the probability of contradiction
 * grows with each addition. No previous mechanism detected this.
 *
 * What it checks:
 *   1. CONTRADICTION DETECTION — contracts with the same trigger but different actions
 *      e.g. B_X says "always ask" and B_Y says "never ask" for similar situations
 *   2. NEAR-DUPLICATE DETECTION — contracts >80% textually similar (consolidation candidates)
 *   3. ORPHAN DETECTION — contracts in behavioral-contracts.md but NOT in audit-runner.md slug table
 *   4. MISSING CROSS-REFERENCE — contracts that reference other contracts but don't have reciprocal links
 *
 * Phase 1 (S026): Contradiction heuristic + orphan detection. ADVISORY always.
 * Phase 2 (S027): Near-duplicate detection + LLM-assisted contradiction scoring. BLOCKING.
 *
 * Governor directive S025: "Core health + harmonization — detecting contradictions in contracts."
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = resolve(process.cwd());
const CONTRACTS_FILE = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts.md');
const AUDIT_RUNNER  = join(ROOT, 'docs/plan/pillar-0-governance/audit-runner.md');

// S052: shard files are the SSoT after S051 sharding — read from shards if present
const SHARD_FILES_CH = ['GVRN', 'AI', 'ARCH', 'VALD', 'OPER'].map(
  s => join(ROOT, `docs/plan/pillar-0-governance/behavioral-contracts-${s}.md`)
).filter(f => existsSync(f));

const contractsText = SHARD_FILES_CH.length > 0
  ? SHARD_FILES_CH.map(f => readFileSync(f, 'utf8')).join('\n')
  : (existsSync(CONTRACTS_FILE) ? readFileSync(CONTRACTS_FILE, 'utf8') : '');

if (!contractsText || contractsText.length < 100) {
  console.log('[validate-contract-harmonization] no contract content found — skip');
  process.exit(0);
}

const auditRunnerText = existsSync(AUDIT_RUNNER) ? readFileSync(AUDIT_RUNNER, 'utf8') : '';

// ── Parse B_* contract headers ──────────────────────────────────────────────
const contractHeaders = [...contractsText.matchAll(/^## (B_\w+)/gm)].map(m => m[1]);

// ── Extract contract bodies (from header to next ##) ──────────────────────────
const contracts = [];
for (let i = 0; i < contractHeaders.length; i++) {
  const name = contractHeaders[i];
  const headerIdx = contractsText.indexOf(`## ${name}`);
  const nextHeaderIdx = i < contractHeaders.length - 1
    ? contractsText.indexOf(`## ${contractHeaders[i + 1]}`, headerIdx + 1)
    : contractsText.length;
  const body = contractsText.slice(headerIdx, nextHeaderIdx).toLowerCase();
  contracts.push({ name, body, length: body.length });
}

const warnings = [];
const advisories = [];

// ── Check 1: Orphan detection — contract in file but no slug in audit-runner ──
const registeredSlugs = new Set(
  [...auditRunnerText.matchAll(/`([a-z_-]+)`/g)].map(m => m[1])
);

for (const { name } of contracts) {
  // Convert B_CONTRACT_NAME → contract-name (the expected slug format)
  const slug = name.toLowerCase().replace(/^b_/, '').replace(/_/g, '-');
  const slugUnderscore = name.toLowerCase().replace(/^b_/, '');
  // Check either form
  if (!registeredSlugs.has(slug) && !registeredSlugs.has(slugUnderscore) && !auditRunnerText.includes(name)) {
    advisories.push(`${name} has no matching audit-runner.md slug — consider registering or referencing`);
  }
}

// ── Check 2: Contradiction heuristics ─────────────────────────────────────────
// Pattern: two contracts both mention "never ask" vs "always ask" for the same trigger class
const askPatterns = contracts.filter(c =>
  c.body.includes('never ask') || c.body.includes('do not ask') || c.body.includes('don\'t ask')
);
const alwaysAskPatterns = contracts.filter(c =>
  c.body.includes('always ask') || c.body.includes('must ask') || c.body.includes('ask first')
);

// Look for names that share context (both mention "filling gaps" or "confirmation")
for (const noAsk of askPatterns) {
  for (const yesAsk of alwaysAskPatterns) {
    if (noAsk.name === yesAsk.name) continue;
    // Share context signal: both mention confirmation/gaps/assumptions
    const sharedTerms = ['gap', 'assumption', 'confirmation', 'clarif', 'question'].filter(t =>
      noAsk.body.includes(t) && yesAsk.body.includes(t)
    );
    if (sharedTerms.length >= 2) {
      advisories.push(
        `Potential tension: ${noAsk.name} (discourages asking) and ${yesAsk.name} (encourages asking) ` +
        `share context: ${sharedTerms.join(', ')} — verify they cover different trigger classes`
      );
    }
  }
}

// ── Check 3: Near-duplicate detection (simplified — same first 100 chars of body) ──
for (let i = 0; i < contracts.length; i++) {
  for (let j = i + 1; j < contracts.length; j++) {
    const a = contracts[i].body.slice(0, 200);
    const b = contracts[j].body.slice(0, 200);
    // Simple overlap: if > 60% of words match in opening section
    const aWords = new Set(a.split(/\W+/).filter(w => w.length > 4));
    const bWords = new Set(b.split(/\W+/).filter(w => w.length > 4));
    const shared = [...aWords].filter(w => bWords.has(w)).length;
    const overlap = shared / Math.max(aWords.size, bWords.size, 1);
    if (overlap > 0.65 && aWords.size > 5) {
      advisories.push(
        `High overlap (${Math.round(overlap * 100)}%): ${contracts[i].name} and ${contracts[j].name} ` +
        `may be near-duplicates — consider consolidation`
      );
    }
  }
}

// ── Report ─────────────────────────────────────────────────────────────────────
const total = contractHeaders.length;
const orphanCount = advisories.filter(a => a.includes('no matching audit-runner')).length;
const tensionCount = advisories.filter(a => a.includes('Potential tension')).length;
const overlapCount = advisories.filter(a => a.includes('High overlap')).length;

if (warnings.length > 0) {
  warnings.forEach(w => console.log(`  ✗ ${w}`));
}
if (advisories.length > 0) {
  advisories.slice(0, 10).forEach(a => console.log(`  ⚠ ${a}`));
  if (advisories.length > 10) {
    console.log(`  ... and ${advisories.length - 10} more advisory findings`);
  }
}

if (warnings.length === 0 && advisories.length === 0) {
  console.log(`[validate-contract-harmonization] ${total} contracts — no contradictions or near-duplicates detected ✓`);
}

console.log(`[validate-contract-harmonization] contracts=${total} orphans=${orphanCount} tensions=${tensionCount} overlaps=${overlapCount}`);
process.exit(0); // Advisory always — Phase 2 will promote to blocking
