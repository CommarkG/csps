#!/usr/bin/env node
/**
 * @csps-id csps.tools.helpers.cec-improvement-check
 * @csps-name cec-improvement-check
 * @csps-description CEC improvement pipeline helper (v2 — explicit path mapping).
 * Called by post-tool-use-cec-trigger.sh when a file is written.
 * v1 (S055): keyword extraction from not_yet_propagated descriptions → too many false positives.
 * v2 (S056): reads explicit path→improvement mapping from tools/config/cec-path-map.yaml.
 * Only fires when the written file path matches an improvement's explicit trigger_on list.
 * Outputs JSON: { matches: [...], open_count: N }
 * Plan item: CEC-TRIGGER-IMPROVEMENT + imp_CEC_SPECIFICITY fix | S056
 * @csps-version 2.0.0
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
const PATH_MAP_FILE = resolve(ROOT, 'tools/config/cec-path-map.yaml');

const SKIP_STATUSES = new Set(['propagated', 'closed']);
const filePath = (process.argv[2] ?? '').replace(/\\/g, '/');

if (!existsSync(IMPROVEMENT_FILE)) {
  console.log(JSON.stringify({ matches: [], open_count: 0 }));
  process.exit(0);
}

function parseImprovementEntries(text) {
  const entries = [];
  const lines = text.split('\n');
  let current = null;
  for (const line of lines) {
    if (/^\s{2}-\s+id:\s+/.test(line)) {
      if (current) entries.push(current);
      current = { id: line.replace(/.*id:\s*/, '').trim() };
    } else if (current && /^\s{4}k_count:\s+/.test(line)) {
      current.k_count = Number(line.replace(/.*k_count:\s*/, '').trim());
    } else if (current && /^\s{4}status:\s+/.test(line)) {
      current.status = line.replace(/.*status:\s*/, '').trim();
    } else if (current && /^\s{4}finding:\s+/.test(line)) {
      current.finding = line.replace(/.*finding:\s*"?/, '').replace(/"?\s*$/, '').trim();
    }
  }
  if (current) entries.push(current);
  return entries;
}

/** Parse cec-path-map.yaml — minimal YAML parser for the mappings array */
function parsePathMap(text) {
  const map = new Map(); // improvement_id → string[]
  const lines = text.split('\n');
  let currentId = null;
  let inTriggerOn = false;

  for (const line of lines) {
    const raw = line.replace(/\r$/, '');
    if (/^\s{2}-\s+improvement_id:\s+/.test(raw)) {
      currentId = raw.replace(/.*improvement_id:\s*/, '').trim();
      inTriggerOn = false;
      if (!map.has(currentId)) map.set(currentId, []);
    } else if (currentId && /^\s{4}trigger_on:/.test(raw)) {
      inTriggerOn = true;
    } else if (inTriggerOn && /^\s{6}-\s+".+"/.test(raw)) {
      const path = raw.replace(/^\s{6}-\s+"/, '').replace(/".*$/, '').trim();
      map.get(currentId)?.push(path);
    } else if (inTriggerOn && !/^\s{6}/.test(raw) && raw.trim() !== '') {
      inTriggerOn = false;
    }
  }
  return map;
}

const improvRaw = readFileSync(IMPROVEMENT_FILE, 'utf-8');
const entries = parseImprovementEntries(improvRaw);
const openEntries = entries.filter(e => !SKIP_STATUSES.has(e.status));

// Load path map (fallback to empty map if file missing)
let pathMap = new Map();
if (existsSync(PATH_MAP_FILE)) {
  pathMap = parsePathMap(readFileSync(PATH_MAP_FILE, 'utf-8'));
}

// Match: file path must contain one of the improvement's explicit trigger_on paths
const matches = openEntries.filter(e => {
  const triggerPaths = pathMap.get(e.id) ?? [];
  return triggerPaths.some(p => filePath.includes(p));
});

console.log(JSON.stringify({
  matches: matches.map(e => ({
    id: e.id,
    finding: e.finding,
    k_count: e.k_count,
  })),
  open_count: openEntries.length,
}));
