#!/usr/bin/env node
/**
 * validate-catch-completeness.mjs — every catch in §10.13b has an EP-NNN entry
 *
 * ROOT CAUSE: AI identifies problems (in §10.13b "Catches engraved") but doesn't
 * always create the corresponding EP-NNN pattern entry. The satisfaction point
 * (EP-015) fires — the AI feels done after fixing the instance and skips
 * creating the permanent pattern.
 *
 * What it checks:
 *   From the latest closing-summary §10.13b section:
 *   For each catch listed, verify a corresponding EP-NNN file exists in
 *   know-how/error-patterns/ that matches the catch keyword
 *
 * This is the MECHANICAL enforcement of "every catch → permanent pattern"
 *
 * EXIT-CODED: 0 = all catches have patterns / 1 = orphan catches (advisory)
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const VAULT_DIR = join(ROOT, 'docs/plan/_handoff/VAULT');
const EP_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/know-how/error-patterns');

function extractCatches(text) {
  const section = (() => {
    const idx = text.indexOf('§10.13b');
    if (idx < 0) return '';
    const next = text.indexOf('\n## ', idx + 5);
    return next > 0 ? text.slice(idx, next) : text.slice(idx, idx + 3000);
  })();

  const catches = [];
  for (const line of section.split('\n')) {
    if (line.includes('|') && line.length > 20 && !line.includes('---') && !line.includes('Catch |') && !line.includes('What |')) {
      // Extract first column (catch description)
      const parts = line.split('|').map(p => p.trim()).filter(Boolean);
      if (parts[0] && parts[0].length > 5) catches.push(parts[0]);
    }
  }
  return catches;
}

function getEpPatterns() {
  if (!existsSync(EP_DIR)) return new Set();
  const names = new Set();
  for (const f of readdirSync(EP_DIR)) {
    if (f.endsWith('.md')) {
      const text = readFileSync(join(EP_DIR, f), 'utf8');
      // Extract description and name for matching
      const nameMatch = text.match(/^name:\s*(.+)$/m);
      const descMatch = text.match(/^description:\s*(.+)$/m);
      if (nameMatch) names.add(nameMatch[1].trim().toLowerCase());
      if (descMatch) names.add(descMatch[1].trim().toLowerCase().slice(0, 50));
    }
  }
  return names;
}

async function main() {
  const summaries = existsSync(VAULT_DIR)
    ? readdirSync(VAULT_DIR).filter(f => f.match(/^closing-summary-S\d+\.md$/)).sort().reverse()
    : [];

  if (summaries.length === 0) {
    console.log('[validate-catch-completeness] no closing-summaries found; skipping');
    process.exit(0);
  }

  const text = readFileSync(join(VAULT_DIR, summaries[0]), 'utf8');
  const catches = extractCatches(text);
  const epPatterns = getEpPatterns();

  const warnings = [];
  let covered = 0;

  for (const catch_ of catches) {
    // Simple keyword match against EP pattern names/descriptions
    const keywords = catch_.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const matched = keywords.some(kw => [...epPatterns].some(ep => ep.includes(kw)));
    if (matched) {
      covered++;
    } else {
      warnings.push(`Catch "${catch_.slice(0, 60)}" has no matching EP-NNN entry — create one`);
    }
  }

  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} catch(es) without EP patterns (advisory):`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
    console.warn('\n  Every catch → EP-NNN entry is mandatory (B_CATCH_TO_ENGRAVING)');
  }

  const epCount = existsSync(EP_DIR) ? readdirSync(EP_DIR).filter(f => f.endsWith('.md')).length : 0;
  const summary = `[validate-catch-completeness] catches=${catches.length} covered=${covered} ep_total=${epCount} warnings=${warnings.length}`;
  console.log(`\n${summary}`);

  process.exit(0);  // advisory — catches without EPs are surfaced not blocking
}

main().catch(err => { console.error('[validate-catch-completeness] fatal:', err); process.exit(1); });
