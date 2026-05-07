#!/usr/bin/env node
/**
 * validate-bedrock.mjs — CSPS Platform Bedrock Completion Gate
 *
 * ROOT CAUSE TARGETED (S016 Governor directive):
 *   The platform's bedrock must be complete before building app #2. Without a
 *   mechanical gate, incomplete bedrock silently propagates into every app.
 *   73% bedrock = 27% debt forward into every feature of all 30 apps.
 *
 * What it checks:
 *   Reads docs/plan/pillar-0-governance/csps-bedrock.md §3 completion checklist.
 *   Counts unchecked [ ] mandatory items in each bedrock layer.
 *   BLOCKING items: items NOT marked with [x] or explicit DEFERRED notation.
 *
 * Exit codes:
 *   0 = bedrock complete (all mandatory items [x] or explicitly deferred)
 *   1 = bedrock incomplete (unchecked mandatory items remain)
 *
 * Resolution:
 *   For each [ ] item: complete it OR mark with explicit DEFERRED → VLT-S0NN-XXXX
 *   "PENDING" without a VLT = not a valid deferral. Must have tracking artifact.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const BEDROCK_PATH = join(ROOT, 'docs/plan/pillar-0-governance/csps-bedrock.md');

function parseBedrock(text) {
  const lines = text.split('\n');
  const checklist = [];
  let inChecklist = false;
  let currentLayer = '';

  for (const line of lines) {
    // Detect the checklist section
    if (line.includes('## §3 Bedrock Completion Checklist')) {
      inChecklist = true;
      continue;
    }
    if (inChecklist && line.startsWith('## §')) {
      inChecklist = false;
      continue;
    }
    if (!inChecklist) continue;

    // Detect layer headers
    if (line.startsWith('Layer ')) {
      currentLayer = line.trim().replace(':', '');
      continue;
    }

    // Parse checkbox items
    const doneMatch = line.match(/^\s+\[x\]\s+(.+)/);
    const openMatch = line.match(/^\s+\[\s\]\s+(.+)/);

    if (doneMatch) {
      checklist.push({ layer: currentLayer, done: true, text: doneMatch[1].trim() });
    } else if (openMatch) {
      const text = openMatch[1].trim();
      // Explicitly deferred items (have → VLT- or → S0NN notation) = not BLOCKING
      const isExplicitlyDeferred = text.includes('→ VLT-') || text.includes('→ S0') || text.includes('user action');
      checklist.push({ layer: currentLayer, done: false, text, deferred: isExplicitlyDeferred });
    }
  }

  return checklist;
}

async function main() {
  if (!existsSync(BEDROCK_PATH)) {
    console.log('[validate-bedrock] csps-bedrock.md not found — skipping (bedrock definition not yet authored)');
    process.exit(0);
  }

  const text = readFileSync(BEDROCK_PATH, 'utf8');
  const checklist = parseBedrock(text);

  if (checklist.length === 0) {
    console.log('[validate-bedrock] No checklist items found in §3');
    process.exit(0);
  }

  const total = checklist.length;
  const done = checklist.filter(i => i.done).length;
  const deferred = checklist.filter(i => !i.done && i.deferred).length;
  const blocking = checklist.filter(i => !i.done && !i.deferred);
  const pct = Math.round(((done + deferred) / total) * 100);

  if (blocking.length > 0) {
    console.error(`\n⛔ BEDROCK INCOMPLETE — platform foundation not ready for next app:`);
    for (const item of blocking) {
      console.error(`  [${item.layer}] ✗ ${item.text}`);
    }
    console.error('\nBedrock must be complete before building app #2.');
    console.error('Resolution: complete the item OR add explicit deferral with → VLT-S0NN-XXXX tracking.\n');
  }

  const deferredItems = checklist.filter(i => !i.done && i.deferred);
  if (deferredItems.length > 0) {
    console.log(`\nExplicitly deferred (tracked — not blocking):`);
    for (const item of deferredItems) {
      console.log(`  [${item.layer}] ⏳ ${item.text.slice(0, 80)}`);
    }
  }

  console.log(`\n[validate-bedrock] total=${total} done=${done} deferred=${deferred} blocking=${blocking.length} completion=${pct}% status=${blocking.length > 0 ? 'INCOMPLETE' : 'COMPLETE'}`);

  process.exit(blocking.length > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('[validate-bedrock] fatal:', err);
  process.exit(1);
});
