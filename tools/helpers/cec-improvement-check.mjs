#!/usr/bin/env node
/**
 * @csps-id csps.tools.helpers.cec-improvement-check
 * @csps-name cec-improvement-check
 * @csps-description CEC improvement pipeline helper. Called by post-tool-use-cec-trigger.sh
 * when a file is written. Reads improvement-register.yaml and returns improvements whose
 * not_yet_propagated descriptions keyword-match the written file path.
 * Outputs JSON: { matches: [...], open_count: N }
 * Used by: .claude/hooks/post-tool-use-cec-trigger.sh (CEC-TRIGGER-IMPROVEMENT)
 * Plan item: CEC-TRIGGER-IMPROVEMENT | S055
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:helper domain:governance audience:ai-agent
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const IMPROVEMENT_FILE = resolve(ROOT, 'tools/data/improvement-register.yaml');

const SKIP_STATUSES = new Set(['propagated', 'closed']);

const filePath = process.argv[2] ?? '';

if (!existsSync(IMPROVEMENT_FILE)) {
  console.log(JSON.stringify({ matches: [], open_count: 0 }));
  process.exit(0);
}

const raw = readFileSync(IMPROVEMENT_FILE, 'utf-8');

function parseEntries(text) {
  const entries = [];
  const lines = text.split('\n');
  let current = null;
  let inNotYet = false;
  let notYetList = [];

  for (const line of lines) {
    if (/^\s{2}-\s+id:\s+/.test(line)) {
      if (current) { current.not_yet_propagated = notYetList; entries.push(current); }
      current = { id: line.replace(/.*id:\s*/, '').trim() };
      notYetList = []; inNotYet = false;
    } else if (current && /^\s{4}k_count:\s+/.test(line)) {
      current.k_count = Number(line.replace(/.*k_count:\s*/, '').trim());
    } else if (current && /^\s{4}status:\s+/.test(line)) {
      current.status = line.replace(/.*status:\s*/, '').trim();
    } else if (current && /^\s{4}finding:\s+/.test(line)) {
      current.finding = line.replace(/.*finding:\s*"?/, '').replace(/"?\s*$/, '').trim();
    } else if (current && /^\s{4}not_yet_propagated:/.test(line)) {
      inNotYet = true;
    } else if (inNotYet && /^\s{6}-\s+/.test(line)) {
      notYetList.push(line.replace(/^\s{6}-\s+/, '').trim());
    } else if (inNotYet && !/^\s{6}/.test(line) && line.trim() !== '') {
      inNotYet = false;
    }
  }
  if (current) { current.not_yet_propagated = notYetList; entries.push(current); }
  return entries;
}

// Keyword map: words that appear in not_yet_propagated descriptions → match against file path
function extractKeywords(description) {
  return description.toLowerCase()
    .replace(/[()]/g, ' ')
    .split(/[\s,/]+/)
    .filter(w => w.length > 4)
    .filter(w => !['should', 'would', 'needs', 'must', 'also', 'with', 'from', 'that', 'have', 'been', 'this', 'when'].includes(w));
}

function pathMatchesDescription(fp, desc) {
  const fpLower = fp.toLowerCase().replace(/\\/g, '/');
  const descLower = desc.toLowerCase();
  const keywords = extractKeywords(descLower);
  return keywords.some(kw => fpLower.includes(kw));
}

const entries = parseEntries(raw);
const openEntries = entries.filter(e => !SKIP_STATUSES.has(e.status));

const matches = openEntries.filter(e =>
  (e.not_yet_propagated ?? []).some(desc => pathMatchesDescription(filePath, desc))
);

console.log(JSON.stringify({
  matches: matches.map(e => ({
    id: e.id,
    finding: e.finding,
    k_count: e.k_count,
    not_yet_propagated: e.not_yet_propagated,
  })),
  open_count: openEntries.length,
}));
