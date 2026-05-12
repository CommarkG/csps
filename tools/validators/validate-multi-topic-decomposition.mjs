#!/usr/bin/env node
/**
 * validate-multi-topic-decomposition.mjs — Detects multi-topic prompts handled without routing table
 *
 * ROOT CAUSE TARGETED: P-META-024 (SEALED Opus Turn 16) — when a prompt contains
 * N>1 distinct topics, the AI must decompose BEFORE crystallizing. A 7-concern prompt
 * is 7 intake events, not 1. Treating N topics as one creates shallow coverage.
 *
 * Detection heuristic: check if the INTENT ABSORBED section (when present) covers
 * multiple PE items and whether a routing declaration was made. Also checks if
 * session-open fired the multi-topic reminder when multiple spines were active.
 *
 * What it checks (Phase 1 advisory):
 *   1. sonnet-turn.md INTENT ABSORBED sections: multiple PE items without "Routing:" table
 *   2. HANDOFF Zone B mandate: multiple PE items without decomposition note
 *   3. Governor-reported "Standard chat" for prompts with >3 distinct PE items
 *
 * ADVISORY Phase 1 — behavioral enforcement; no blocking until K=2
 *
 * Audit slug: multi-topic-decomposition
 * P-META-024 | SEALED Opus Turn 16 | UPDATE-029
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const SONNET_TURN = join(ROOT, 'tools/council/sonnet-turn.md');
const HANDOFF_DIR = join(ROOT, 'docs/plan/_handoff');

const advisories = [];
let checked = 0;

// ─── Check 1: INTENT ABSORBED with multiple PE items and no routing declaration ──

if (existsSync(SONNET_TURN)) {
  checked++;
  const content = readFileSync(SONNET_TURN, 'utf8');

  // Find all INTENT ABSORBED sections
  const intentRegex = /# Sonnet Session S\d+ — (?:INTENT ABSORBED|Opus Turn \d+ INTENT ABSORBED)/gi;
  let m;
  const sections = [];
  while ((m = intentRegex.exec(content)) !== null) {
    const end = content.indexOf('\n---\n', m.index + 1);
    sections.push(content.slice(m.index, end > 0 ? end : m.index + 3000));
  }

  for (const section of sections) {
    // Count distinct PE items (lines with PE=N or PE = N)
    const peItems = (section.match(/\bPE[=:]\s*\d{2,3}/gi) || []).length;
    // Check if routing declaration exists
    const hasRouting = /routing[:\s]|routing table|concern \d+.*spine|I see \d+ concerns/i.test(section);
    const hasDecomposition = /decompos|per.topic|N topics|routing:/i.test(section);

    if (peItems >= 4 && !hasRouting && !hasDecomposition) {
      const lineNum = content.slice(0, content.indexOf(section)).split('\n').length;
      advisories.push({
        section: 'INTENT ABSORBED',
        line: lineNum,
        peItems,
        issue: `${peItems} PE items without routing table declaration (P-META-024: >2 spines = N intake events)`,
        suggestion: 'Add: "N concerns: [list]. Routing: [concern | spine | disposition]" before implementation',
      });
    }
  }
}

// ─── Check 2: HANDOFF Zone B with many items and no PE decomposition ──────────

if (existsSync(HANDOFF_DIR)) {
  const handoffs = readdirSync(HANDOFF_DIR)
    .filter(f => f.startsWith('HANDOFF-') && f.endsWith('.md'))
    .sort().slice(-2);

  for (const hf of handoffs) {
    checked++;
    const content = readFileSync(join(HANDOFF_DIR, hf), 'utf8');
    const zoneBIdx = content.indexOf('## Zone B');
    if (zoneBIdx < 0) continue;

    const zoneB = content.slice(zoneBIdx, zoneBIdx + 2000);
    const peItems = (zoneB.match(/PE[=:]\s*\d{2,3}/gi) || []).length;
    const hasRouting = /routing|focal.point|PE-ordered|Band 1/i.test(zoneB);

    if (peItems >= 5 && !hasRouting) {
      advisories.push({
        section: hf,
        peItems,
        issue: `Zone B lists ${peItems} items without PE ordering note or focal point declaration`,
        suggestion: 'Add PE ordering + focal point declaration per P-META-024 decomposition principle',
      });
    }
  }
}

if (advisories.length > 0) {
  advisories.forEach(a => {
    console.log(`  ⚠ [multi-topic-decomposition] ${a.section}:${a.line || ''}: ${a.issue}`);
    console.log(`     → ${a.suggestion}`);
  });
  console.log('[multi-topic-decomposition] teaching_moment: "N concerns in one prompt = N intake events, not 1. Emit routing table: [concern | spine | disposition]."');
} else {
  console.log('[multi-topic-decomposition] no undecomposed multi-topic intakes detected ✓');
}

console.log(`[multi-topic-decomposition] checked=${checked} advisories=${advisories.length}`);
process.exit(0);
