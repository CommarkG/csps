#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-cross-finding-cluster
 * @csps-name validate-cross-finding-cluster
 * @csps-description C6 FRAGMENT_FINDINGS prevention validator.
 *   Scans improvement-register.yaml + gap-recurrence-register.yaml for entries
 *   filed in the same session that share a root cause keyword cluster.
 *   ADVISORY: suggests entries that may share root cause and should be clustered.
 *
 *   WHAT THIS PREVENTS: Multiple findings filed separately when they share a
 *   structural root cause. Fragment findings mask the pattern and inflate K counts
 *   without fixing the root. e.g., "session-unknown" filed 3 ways: as a threshold
 *   finding, an intake-log finding, and a context-orchestrator finding — all with
 *   root cause = "hooks compute session locally" (C10 root).
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces C6_FRAGMENT_FINDINGS P-META-029 B_HUMBLE_CONSOLIDATION_DISCIPLINE
 * @csps-inherits-from validate-cross-finding-cluster (C6 PROTO-S067 APPENDIX A)
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const IMP_REGISTER = resolve(ROOT, 'tools/data/improvement-register.yaml');
const GAP_REGISTER = resolve(ROOT, 'tools/data/gap-recurrence-register.yaml');

// Simple keyword overlap detection — group by shared significant terms
const STOP_WORDS = new Set(['the', 'a', 'an', 'and', 'or', 'for', 'with', 'to', 'in', 'of', 'on', 'at', 'by', 'is', 'are', 'was', 'be', 'it', 'this', 'that', 'from', 'as', 'not', 'has', 'have', 'per', 'via']);

function extractKeywords(text) {
  if (!text) return new Set();
  return new Set(
    text.toLowerCase()
      .replace(/[^a-z0-9_-\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 4 && !STOP_WORDS.has(w))
  );
}

function parseYamlEntries(content) {
  // Simple YAML list parser — extract id, description, session fields
  const entries = [];
  const blocks = content.split(/^- /m).filter(b => b.trim());

  for (const block of blocks) {
    const id = (block.match(/\bid:\s*([^\n]+)/) || [])[1]?.trim();
    const desc = (block.match(/description:\s*["']?([^"'\n]+)["']?/) || [])[1]?.trim();
    const session = (block.match(/\bsession:\s*([^\n]+)/) || [])[1]?.trim();
    if (id && desc) entries.push({ id, desc, session, keywords: extractKeywords(desc) });
  }
  return entries;
}

function detectClusters(entries, minOverlap = 3) {
  const clusters = [];
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i];
      const b = entries[j];
      if (a.session && b.session && a.session !== b.session) continue; // different sessions OK
      const overlap = [...a.keywords].filter(k => b.keywords.has(k));
      if (overlap.length >= minOverlap) {
        clusters.push({ a: a.id, b: b.id, shared: overlap.slice(0, 5) });
      }
    }
  }
  return clusters;
}

let advisory = 0;
const clusters = [];

for (const [label, path] of [['improvement-register', IMP_REGISTER], ['gap-recurrence-register', GAP_REGISTER]]) {
  if (!existsSync(path)) continue;
  const content = readFileSync(path, 'utf8');
  const entries = parseYamlEntries(content);
  const found = detectClusters(entries);
  for (const c of found) {
    advisory++;
    clusters.push(`  ADVISORY [C6] ${label}: "${c.a}" + "${c.b}" share keywords [${c.shared.join(', ')}] — consider clustering`);
  }
}

for (const c of clusters) console.log(c);

if (clusters.length === 0) {
  console.log('[validate-cross-finding-cluster] ✓ No fragment-finding clusters detected');
}

console.log(`[validate-cross-finding-cluster] blocking=0 advisory=${advisory}`);
// Always exit 0 — advisory only (S067)
process.exit(0);
