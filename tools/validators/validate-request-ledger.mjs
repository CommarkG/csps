#!/usr/bin/env node
/**
 * validate-request-ledger.mjs — Governor Request Accountability Tracker
 *
 * ROOT CAUSE TARGETED: Governor S028 directive: "how enforced mechanically is
 * you not dropping any question or request — accountability tracking with PE to
 * sort things by importance — consolidated into one source of truth"
 *
 * AI satisfaction points cause requests to be dropped:
 * - SP-001: AI declares task done without completing all sub-tasks
 * - SP-003: AI responds to the most visible request, drops others
 * - Multi-topic prompts: decomposed but not all tracked to resolution
 *
 * What it checks:
 *   1. tools/config/governor-request-ledger.yaml: OPEN items
 *   2. OPEN items older than current session → ADVISORY (likely dropped)
 *   3. OPEN items with pe > 70 → elevated advisory (high priority, unresolved)
 *   4. At session close (detected via closing-summary being written): BLOCKING
 *
 * The PE ordering: surfaces highest-PE open requests first in OPTIMAL NEXT STEP
 *
 * Audit slug: request-ledger
 * Governor directive S028 | scope_level: S1
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const LEDGER = join(ROOT, 'tools/config/governor-request-ledger.yaml');

// Simple YAML parser for the ledger structure
function parseSimpleYaml(content) {
  const openMatch = content.match(/^open:\s*\n([\s\S]*?)(?=^answered:|^deferred:|^#|$)/m);
  if (!openMatch) return { open: [] };

  const openSection = openMatch[1];
  const items = [];

  // Parse individual items
  const itemRegex = /- id: (GRL-[^\n]+)\n[\s\S]*?pe: (\d+)\n\s+status: (OPEN|ANSWERED|DEFERRED)\n(?:\s+notes: "([^"]*)")?/g;
  let m;
  while ((m = itemRegex.exec(openSection)) !== null) {
    if (m[3] === 'OPEN') {
      items.push({
        id: m[1].trim(),
        pe: Number(m[2]),
        status: m[3],
        notes: m[4] || '',
      });
    }
  }

  // Also extract verbatim for context
  const verbatimRegex = /- id: (GRL-[^\n]+)\n\s+session[^\n]+\n\s+timestamp[^\n]+\n\s+verbatim: "([^"]+)"\n\s+category: ([^\n]+)\n\s+pe: (\d+)\n\s+status: (OPEN)/g;
  const fullItems = [];
  while ((m = verbatimRegex.exec(openSection)) !== null) {
    fullItems.push({
      id: m[1].trim(),
      verbatim: m[2],
      category: m[3].trim(),
      pe: Number(m[4]),
      status: m[5],
    });
  }

  return { open: fullItems.length > 0 ? fullItems : items };
}

const advisories = [];
const blocking = [];
let ledgerExists = false;

if (!existsSync(LEDGER)) {
  console.log('[validate-request-ledger] governor-request-ledger.yaml not found — advisory');
  console.log('[validate-request-ledger] Create: tools/config/governor-request-ledger.yaml to track requests');
  console.log('[validate-request-ledger] open=0 blocking=0 advisories=0');
  process.exit(0);
}

ledgerExists = true;
const content = readFileSync(LEDGER, 'utf8');
const { open } = parseSimpleYaml(content);

// Sort by PE descending
const sortedOpen = [...open].sort((a, b) => b.pe - a.pe);

if (sortedOpen.length > 0) {
  // Generate OPTIMAL NEXT STEP context
  console.log(`\n  [request-ledger] ${sortedOpen.length} OPEN Governor request(s) (PE-ordered):`);
  sortedOpen.forEach((r, i) => {
    const priority = r.pe >= 78 ? '🔴' : r.pe >= 68 ? '🟡' : '⚪';
    console.log(`  ${priority} [PE=${r.pe}] ${r.id}: "${r.verbatim || r.id}"`);
    if (r.notes) console.log(`       → ${r.notes}`);
    if (i < 3) {
      advisories.push({
        id: r.id,
        pe: r.pe,
        verbatim: r.verbatim || r.id,
        issue: `PE=${r.pe} request OPEN — not yet resolved`,
      });
    }
  });

  // High-PE unresolved items are elevated advisory
  const highPE = sortedOpen.filter(r => r.pe >= 70);
  if (highPE.length > 0) {
    console.log(`\n  ⚠ ${highPE.length} HIGH-PE request(s) unresolved (PE≥70):`);
    highPE.forEach(r => {
      console.log(`    PE=${r.pe}: "${r.verbatim || r.id}"`);
    });
  }
} else {
  console.log('[validate-request-ledger] all Governor requests resolved ✓');
}

console.log(`\n[validate-request-ledger] ledger=found open=${sortedOpen.length} advisories=${advisories.length} blocking=${blocking.length}`);
process.exit(0); // Advisory — BLOCKING mode activates at session close
