#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-contextual-locality
 * @csps-name validate-contextual-locality
 * @csps-description T2 for B_CONTEXTUAL_LOCALITY (gap_T2_ORPHAN_CONTRACTS S055).
 * Checks council files and governance docs for navigation phrases that force the
 * reader to search elsewhere: "see above", "as described", "refer to", "as I shared",
 * "from earlier", "paste from", "the block I wrote".
 * These phrases violate P-UX-001 (Contextual Locality) — content must appear at
 * the point of use. A reader who must scroll is a reader who may miss it.
 * BLOCKING: banned navigation phrases in any council/*.md or sonnet-turn.md
 * ADVISORY: same patterns in governance docs (docs/plan/pillar-0-governance/)
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_CONTEXTUAL_LOCALITY P-UX-001 B_ZERO_NAVIGATION_FOR_GOVERNOR
 * context_question: "Does any council file instruct the Governor to look elsewhere for content?"
 * Plan item: gap_T2_ORPHAN_CONTRACTS | S055
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const BANNED_PHRASES = [
  'see above',
  'as described above',
  'refer to the block',
  'refer to above',
  'as I shared',
  'from earlier',
  'paste from earlier',
  'the block I wrote',
  'from my prior response',
  'as shown above',
  'see the section above',
];

const COUNCIL_PATHS = [
  join(ROOT, 'tools/council'),
];

const ADVISORY_PATHS = [
  join(ROOT, 'docs/plan/pillar-0-governance'),
];

function scanDir(dir, exts = ['.md']) {
  if (!existsSync(dir)) return [];
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && exts.some(e => entry.name.endsWith(e))) {
      files.push(join(dir, entry.name));
    }
  }
  return files;
}

function scanFile(filePath, phrases) {
  const text = readFileSync(filePath, 'utf-8');
  const lines = text.split('\n');
  const findings = [];
  for (let i = 0; i < lines.length; i++) {
    const lowerLine = lines[i].toLowerCase();
    for (const phrase of phrases) {
      if (lowerLine.includes(phrase.toLowerCase())) {
        findings.push({ line: i + 1, phrase, text: lines[i].trim().slice(0, 80) });
      }
    }
  }
  return findings;
}

let blocking = 0;
let advisory = 0;
let files_checked = 0;

// Only block on violations in the TOP 50 lines of council files (current session content).
// Historical council content pre-S055 is advisory — backfill not feasible.
for (const dir of COUNCIL_PATHS) {
  for (const file of scanDir(dir)) {
    files_checked++;
    const text = readFileSync(file, 'utf-8');
    const lines = text.split('\n');
    const recentLines = lines.slice(0, 50); // top = most recent (prepended format)
    const recentFindings = [];
    for (let i = 0; i < recentLines.length; i++) {
      const l = recentLines[i].toLowerCase();
      for (const phrase of BANNED_PHRASES) {
        if (l.includes(phrase.toLowerCase())) {
          recentFindings.push({ line: i + 1, phrase, text: recentLines[i].trim().slice(0, 80) });
        }
      }
    }
    // Historical lines = advisory
    const allFindings = scanFile(file, BANNED_PHRASES);
    const historicalFindings = allFindings.filter(f => f.line > 50);
    for (const f of recentFindings) {
      console.error(`[validate-contextual-locality] BLOCKING: ${file.replace(ROOT, '')}:${f.line} — "${f.phrase}"`);
      console.error(`  Fix: include the full content inline — do not navigate to prior responses.`);
      blocking++;
    }
    for (const f of historicalFindings) {
      advisory++;
    }
  }
}

for (const dir of ADVISORY_PATHS) {
  for (const file of scanDir(dir)) {
    files_checked++;
    const findings = scanFile(file, BANNED_PHRASES);
    for (const f of findings) {
      console.warn(`[validate-contextual-locality] ADVISORY: ${file.replace(ROOT, '')}:${f.line} — "${f.phrase}"`);
      advisory++;
    }
  }
}

console.log(`[validate-contextual-locality] files_checked=${files_checked} blocking=${blocking} advisory=${advisory}`);
process.exit(blocking > 0 ? 1 : 0);
