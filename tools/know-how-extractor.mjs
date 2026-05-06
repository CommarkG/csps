#!/usr/bin/env node
/**
 * know-how-extractor.mjs — extracts know-how patterns from closing-summaries
 *
 * The learning loop engine: reads §10.0j (enhancement-proposals) + §10.13b (catches)
 * from closing-summary files, classifies each into EP-NNN categories, and reports
 * what should be added to the know-how registry.
 *
 * Per B_KNOW_HOW_DISCIPLINE — the "learning loop" from know-how/README.md:
 *   Session close §10.0j + §10.13b → classify → EP-NNN update → checklist update
 *
 * Usage:
 *   node tools/know-how-extractor.mjs                    # latest closing-summary
 *   node tools/know-how-extractor.mjs --session S011     # specific session
 *   node tools/know-how-extractor.mjs --all              # all sessions
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const VAULT_DIR = join(ROOT, 'docs/plan/_handoff/VAULT');
const KNOW_HOW_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/know-how');

// EP classification rules — keyword matches → EP category
const EP_RULES = [
  { ep: 'EP-001', keywords: ['stale', 'handoff.*partial', 'handoff.*deferred', 'artifact.*not updated', 'says.*complete.*shows.*partial', 'session.artifact.sync'] },
  { ep: 'EP-002', keywords: ['orphan', 'missing.*deliverable', 'plan.*no.*artifact', 'lifecycle.*active.*missing', 'topic.*plan.*progress'] },
  { ep: 'EP-003', keywords: ['audit.*slug.*missing', 'validator.*unregistered', 'orphan.*validator', 'audit-slug-coverage', 'slug.*not.*registered'] },
  { ep: 'EP-004', keywords: ['post.close', '§24', 'addendum.*not.*logged', 'after.*close.*not.*tracked', 'gp.*missing.*post'] },
  { ep: 'EP-005', keywords: ['persistent.*warning', 'warning.*sessions', 'legacy.*id', 'same.*warn.*session', 'legacy.*debt'] },
  { ep: 'EP-006', keywords: ['require.*esm', 'esm.*bug', 'smoke.*test', 'code.*quality', 'node.*check', 'runtime.*error', 'cache.*never'] },
  { ep: 'EP-007', keywords: ['gp.*missing', 'governor.*prompt.*count', 'prompt.*not.*logged', 'gp.*entry.*missing'] },
];

function classifyText(text) {
  const lower = text.toLowerCase();
  const matches = [];
  for (const rule of EP_RULES) {
    if (rule.keywords.some(kw => new RegExp(kw).test(lower))) {
      matches.push(rule.ep);
    }
  }
  return matches.length > 0 ? matches : ['EP-UNCLASSIFIED'];
}

function extractSection(text, sectionHeader) {
  const idx = text.indexOf(sectionHeader);
  if (idx < 0) return '';
  const nextSection = text.indexOf('\n## ', idx + sectionHeader.length);
  return nextSection > 0 ? text.slice(idx, nextSection) : text.slice(idx);
}

function extractEnhancementProposals(text) {
  const section = extractSection(text, '§10.0j') || extractSection(text, 'Enhancement-proposals');
  const proposals = [];
  for (const line of section.split('\n')) {
    if (line.includes('| K') || (line.includes('|') && line.includes('S01'))) {
      proposals.push(line.trim());
    }
  }
  return proposals;
}

function extractCatches(text) {
  const section = extractSection(text, '§10.13b') || extractSection(text, 'Catches engraved');
  const catches = [];
  for (const line of section.split('\n')) {
    if (line.includes('|') && line.length > 20 && !line.includes('---') && !line.includes('Catch')) {
      catches.push(line.trim());
    }
  }
  return catches;
}

function processFile(filePath) {
  const session = filePath.match(/closing-summary-(S\d+)/)?.[1] ?? 'unknown';
  const text = readFileSync(filePath, 'utf8');
  const proposals = extractEnhancementProposals(text);
  const catches = extractCatches(text);

  const findings = [];
  for (const p of proposals) {
    const eps = classifyText(p);
    if (p.length > 10) findings.push({ session, type: 'enhancement-proposal', text: p.slice(0, 120), eps });
  }
  for (const c of catches) {
    const eps = classifyText(c);
    if (c.length > 10) findings.push({ session, type: 'catch', text: c.slice(0, 120), eps });
  }
  return findings;
}

async function main() {
  const args = process.argv.slice(2);
  const allFlag = args.includes('--all');
  const sessionArg = args[args.indexOf('--session') + 1];

  const summariesDir = VAULT_DIR;
  let files = readdirSync(summariesDir)
    .filter(f => f.startsWith('closing-summary-S') && f.endsWith('.md'));

  if (!allFlag && !sessionArg) {
    files = files.sort().slice(-1); // latest only
  } else if (sessionArg) {
    files = files.filter(f => f.includes(sessionArg));
  }

  const allFindings = [];
  for (const f of files) {
    allFindings.push(...processFile(join(summariesDir, f)));
  }

  if (allFindings.length === 0) {
    console.log('[know-how-extractor] No findings to extract');
    process.exit(0);
  }

  // Group by EP
  const byEp = {};
  for (const f of allFindings) {
    for (const ep of f.eps) {
      if (!byEp[ep]) byEp[ep] = [];
      byEp[ep].push(f);
    }
  }

  console.log('\n=== Know-How Extraction Report ===\n');
  for (const [ep, findings] of Object.entries(byEp).sort()) {
    const epFile = ep === 'EP-UNCLASSIFIED' ? null :
      join(KNOW_HOW_DIR, 'error-patterns', `${ep.toLowerCase()}-*.md`);
    console.log(`\n${ep} — ${findings.length} finding(s):`);
    for (const f of findings) {
      console.log(`  [${f.session}] (${f.type}) ${f.text}`);
    }
    if (ep !== 'EP-UNCLASSIFIED') {
      console.log(`  → Increment recurrence_count in know-how/error-patterns/${ep.toLowerCase()}*.md`);
    } else {
      console.log(`  → Consider creating a new EP-NNN entry in know-how/error-patterns/`);
    }
  }

  console.log(`\n[know-how-extractor] total=${allFindings.length} sessions=${files.length} ep_categories=${Object.keys(byEp).length}`);
}

main().catch(err => { console.error('[know-how-extractor] fatal:', err); process.exit(1); });
