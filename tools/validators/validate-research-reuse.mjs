#!/usr/bin/env node
/**
 * validate-research-reuse.mjs — Research Registry Reuse Gate
 *
 * ROOT CAUSE TARGETED (S021 Governor directive):
 *   Research is being rediscovered session after session.
 *   The Lovable tree analysis, Shopify Maestro finding, GDPR requirements —
 *   all researched, forgotten, and re-researched. This is waste AND drift risk
 *   (research findings are not always identical when rediscovered).
 *
 * What it does:
 *   1. Reads tools/config/research-registry.yaml
 *   2. Reports total research entries, confidence levels, staleness
 *   3. Surfaces entries approaching staleness (should be refreshed)
 *   4. Confirms research registry was checked before new planning begins
 *
 * Coverage Levels:
 *   ✓ Level 1: Count registry entries + surface stale ones
 *   ✓ Level 2: Report entries by confidence (high/medium/low)
 *   ✗ Level 3: Cross-reference plans against registry (check if plan topic was researched)
 *              → VLT-S021-RESEARCH-PLAN-XREF (requires parsing all plan files)
 *   ✗ Level 4: Auto-suggest related research when new plan is created
 *              → VLT-S021-RESEARCH-SUGGEST
 *
 * When this validator exits 0, it proves: research registry is present + non-empty
 * When this validator exits 0, it does NOT prove: research was actually consulted before planning
 *
 * The Research Mandate (mechanical enforcement):
 *   Every consequential plan must have:
 *     research_consulted: true | false  (frontmatter field)
 *     research_ids: [RESEARCH-001, ...]  (which entries were checked)
 *   Plans with research_consulted: false are ADVISORY (stage: measurement)
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const REGISTRY_PATH = join(ROOT, 'tools/config/research-registry.yaml');

const STALENESS_WARNING_DAYS = 0.8; // warn when 80% of staleness_days have passed

function parseDays(content, field) {
  const m = content.match(new RegExp(`${field}:\\s*(\\d+)`));
  return m ? parseInt(m[1], 10) : null;
}

function parseEntries(content) {
  const entries = [];
  const sections = content.split(/(?=\n  - id: RESEARCH-)/).filter(s => s.includes('  - id: RESEARCH-'));

  for (const section of sections) {
    const idMatch      = section.match(/- id:\s*(RESEARCH-\d+)/);
    const topicMatch   = section.match(/topic:\s*"([^"]+)"/);
    const sessionMatch = section.match(/session:\s*(\S+)/);
    const dateMatch    = section.match(/date:\s*"([^"]+)"/);
    const confidenceM  = section.match(/confidence:\s*(\w+)/);
    const stalenessM   = section.match(/staleness_days:\s*(\d+)/);
    const statusM      = section.match(/status:\s*(\w+)/);
    const keywordsM    = section.match(/keywords:\s*\[([^\]]+)\]/);

    if (!idMatch) continue;

    entries.push({
      id:           idMatch[1].trim(),
      topic:        topicMatch ? topicMatch[1].trim() : 'unknown',
      session:      sessionMatch ? sessionMatch[1].trim() : 'unknown',
      date:         dateMatch ? dateMatch[1].trim() : null,
      confidence:   confidenceM ? confidenceM[1].trim() : 'unknown',
      staleness_days: stalenessM ? parseInt(stalenessM[1], 10) : 180,
      status:       statusM ? statusM[1].trim() : 'active',
      keywords:     keywordsM ? keywordsM[1].split(',').map(k => k.trim().replace(/['"]/g, '')) : [],
    });
  }

  return entries;
}

function daysSinceDate(dateStr) {
  if (!dateStr) return 0;
  const then = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

async function main() {
  if (!existsSync(REGISTRY_PATH)) {
    console.error('[validate-research-reuse] ADVISORY: tools/config/research-registry.yaml not found');
    console.error('  Create the research registry before any research is commissioned.');
    process.exit(0); // advisory — don't block if registry doesn't exist yet
  }

  const content = readFileSync(REGISTRY_PATH, 'utf8');
  const entries = parseEntries(content);

  if (entries.length === 0) {
    console.log('[validate-research-reuse] Research registry is empty — no entries to validate');
    process.exit(0);
  }

  const active    = entries.filter(e => e.status === 'active');
  const stale     = entries.filter(e => e.status === 'stale');
  const superseded = entries.filter(e => e.status === 'superseded');

  // Check for approaching staleness
  const approachingStale = active.filter(e => {
    if (!e.date) return false;
    const age = daysSinceDate(e.date);
    return age > (e.staleness_days * STALENESS_WARNING_DAYS);
  });

  const highConfidence   = active.filter(e => e.confidence === 'high');
  const mediumConfidence = active.filter(e => e.confidence === 'medium');
  const lowConfidence    = active.filter(e => e.confidence === 'low');

  // Report all entries
  console.log(`\nResearch Registry (${active.length} active entries):`);
  for (const e of active) {
    const age = e.date ? `${daysSinceDate(e.date)}d old` : 'no date';
    const stalenessStatus = approachingStale.includes(e) ? ' ⚠ APPROACHING STALE' : '';
    console.log(`  ${e.id}: ${e.topic.substring(0, 60)}`);
    console.log(`     session: ${e.session} | confidence: ${e.confidence} | ${age}${stalenessStatus}`);
    if (e.keywords.length > 0) {
      console.log(`     keywords: ${e.keywords.slice(0, 5).join(', ')}`);
    }
  }

  if (approachingStale.length > 0) {
    console.log(`\n⚠ RESEARCH APPROACHING STALENESS (${approachingStale.length} entries — refresh recommended):`);
    for (const e of approachingStale) {
      console.log(`  ${e.id}: ${e.topic.substring(0, 60)} (${daysSinceDate(e.date)}d / ${e.staleness_days}d)`);
    }
  }

  if (stale.length > 0) {
    console.log(`\n⚠ STALE RESEARCH (${stale.length} entries — refresh before using):`);
    for (const e of stale) {
      console.log(`  ${e.id}: ${e.topic.substring(0, 60)}`);
    }
  }

  // The mandate
  console.log(`
RESEARCH REUSE MANDATE:
  Before any new research on a topic — check this registry first.
  Query by keyword: grep -i "[keyword]" tools/config/research-registry.yaml
  If found: use existing findings (update if stale).
  If not found: commission research, add entry here.

ADD NEW ENTRY COMMAND:
  Add to tools/config/research-registry.yaml following the schema:
  id: RESEARCH-$(( ${entries.length} + 1 ))  # next sequential ID
  topic, keywords, session, date, findings (key points only), source_document, confidence, staleness_days, status
`);

  console.log(`[validate-research-reuse] total=${entries.length} active=${active.length} stale=${stale.length} superseded=${superseded.length} high_confidence=${highConfidence.length} approaching_stale=${approachingStale.length} status=ACTIVE`);

  process.exit(0); // always advisory — never blocks
}

main().catch(err => {
  console.error('[validate-research-reuse] fatal:', err);
  process.exit(1);
});
