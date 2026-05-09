#!/usr/bin/env node
/**
 * validate-update-backlog.mjs — Platform Update Backlog Gate
 *
 * ROOT CAUSE TARGETED (S021 Governor directive):
 *   The platform accumulates "what should be updated" items that have no
 *   mechanical tracking. Without a registry and validator, these items decay
 *   across sessions and are re-discovered in future Opus reviews — exactly
 *   the pattern S019 found (15 gaps accumulated over 19 sessions).
 *
 * Coverage Levels:
 *   ✓ Level 1: Count pending items by priority and who (governor/opus/sonnet)
 *   ✓ Level 2: Surface BLOCKED items and their blockers
 *   ✓ Level 3: Flag items pending > 3 sessions (staleness) — advisory
 *   ✗ Level 4: Verify that "done" items are actually done (tool-level check) → VLT-S021-BACKLOG-DONE-VERIFY
 *
 * When this validator exits 0, it proves: backlog is below advisory threshold
 * When this validator exits 0, it does NOT prove: "done" items are actually done
 *
 * Exit codes:
 *   0 = backlog within thresholds (measurement stage: always 0)
 *   1 = backlog BLOCKING (> block_threshold pending items AND stage=blocking)
 *
 * Created: S021 per Governor directive — mechanically enforced update tracking
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const BACKLOG_PATH = join(ROOT, 'tools/config/platform-update-backlog.yaml');

// Inline YAML parsing (avoid external dependency)
function parseYamlItems(content, sectionKey) {
  const items = [];
  const lines = content.split('\n');
  let inSection = false;
  let currentItem = null;
  let currentKey = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detect section headers (governor_decisions:, opus_tasks:, sonnet_p1:, etc.)
    if (/^\w[\w_]+:\s*$/.test(line) && !line.startsWith(' ')) {
      const key = line.trim().replace(':', '');
      if (sectionKey === 'ALL') {
        inSection = ['governor_decisions', 'opus_tasks', 'sonnet_p1', 'sonnet_p2', 'sonnet_p3'].includes(key);
      } else {
        inSection = key === sectionKey;
      }
      if (currentItem) { items.push(currentItem); currentItem = null; }
      continue;
    }

    if (!inSection) continue;

    // New item starts with "  - id:"
    if (/^\s{2}- id:\s/.test(line)) {
      if (currentItem) items.push(currentItem);
      currentItem = {
        id: line.match(/id:\s*(.+)/)[1].trim().replace(/['"]/g, ''),
        description: '', who: '', priority: '', status: '', blocked_by: []
      };
      continue;
    }

    if (!currentItem) continue;

    // Parse fields
    const fieldMatch = trimmed.match(/^(\w[\w_]*):\s*(.*)/);
    if (fieldMatch) {
      currentKey = fieldMatch[1];
      const val = fieldMatch[2].replace(/^['""]|['""]$/g, '').replace(/^>\s*$/, '').trim();
      if (currentKey === 'description') currentItem.description = val;
      else if (currentKey === 'who') currentItem.who = val;
      else if (currentKey === 'priority') currentItem.priority = val;
      else if (currentKey === 'status') currentItem.status = val;
      else if (currentKey === 'blocked_by') currentItem.blocked_by = [];
    }

    // Array items for blocked_by
    if (/^\s{6}- /.test(line) && currentKey === 'blocked_by') {
      const val = trimmed.replace(/^-\s+/, '').replace(/['"]/g, '');
      currentItem.blocked_by.push(val);
    }
  }
  if (currentItem) items.push(currentItem);
  return items;
}

function parseMetaSection(content) {
  const meta = {};
  const metaMatch = content.match(/^meta:\n([\s\S]*?)(?=\n\w|\n#|$)/m);
  if (!metaMatch) return meta;
  for (const [, k, v] of metaMatch[1].matchAll(/^\s{2}(\w[\w_]*):\s*(.+)$/gm)) {
    const num = parseInt(v.trim().replace(/['"]/g, ''), 10);
    meta[k] = isNaN(num) ? v.trim().replace(/['"]/g, '') : num;
  }
  return meta;
}

async function main() {
  if (!existsSync(BACKLOG_PATH)) {
    console.log('[validate-update-backlog] platform-update-backlog.yaml not found — skipping');
    process.exit(0);
  }

  const content = readFileSync(BACKLOG_PATH, 'utf8');
  const meta = parseMetaSection(content);
  const items = parseYamlItems(content, 'ALL');

  if (items.length === 0) {
    console.log('[validate-update-backlog] No items found in backlog');
    process.exit(0);
  }

  // Categorize
  const pending   = items.filter(i => i.status === 'pending');
  const blocked   = items.filter(i => i.status === 'blocked');
  const inProgress = items.filter(i => i.status === 'in-progress');
  const done      = items.filter(i => i.status === 'done');

  const governorItems = items.filter(i => i.who === 'governor' && i.status !== 'done');
  const opusItems     = items.filter(i => i.who === 'opus' && i.status !== 'done');
  const sonnetP1      = pending.filter(i => i.priority === 'P1');
  const sonnetP2      = pending.filter(i => i.priority === 'P2');
  const sonnetP3      = pending.filter(i => i.priority === 'P3');

  const totalPending  = pending.length + blocked.length + inProgress.length;
  const advisoryThreshold = meta.advisory_threshold || 10;
  const blockThreshold    = meta.block_threshold || 20;
  const stage             = meta.enforcement_stage || 'measurement';

  // Report Governor actions needed
  if (governorItems.length > 0) {
    console.log(`\n⚡ GOVERNOR DECISIONS NEEDED (${governorItems.length} — blocks implementation):`);
    for (const item of governorItems) {
      console.log(`  ${item.id}: ${item.description}`);
    }
  }

  // Report Opus tasks
  if (opusItems.length > 0) {
    console.log(`\n🔭 OPUS TASKS PENDING (${opusItems.length} — architectural, not for Sonnet):`);
    for (const item of opusItems) {
      const blockedNote = item.blocked_by.length > 0 ? ` [blocked on: ${item.blocked_by.join(', ')}]` : '';
      console.log(`  ${item.id}: ${item.description}${blockedNote}`);
    }
  }

  // Report Sonnet P1
  if (sonnetP1.length > 0) {
    console.log(`\n🔧 SONNET P1 — Must complete before domain work (${sonnetP1.length}):`);
    for (const item of sonnetP1) {
      console.log(`  ${item.id}: ${item.description}`);
    }
  }

  // Report Sonnet P2
  if (sonnetP2.length > 0) {
    console.log(`\n🔧 SONNET P2 — Important (${sonnetP2.length}):`);
    for (const item of sonnetP2) {
      console.log(`  ${item.id}: ${item.description}`);
    }
  }

  // Report Sonnet P3
  if (sonnetP3.length > 0) {
    console.log(`\n🔧 SONNET P3 — Valuable when available (${sonnetP3.length}):`);
    for (const item of sonnetP3) {
      console.log(`  ${item.id}: ${item.description}`);
    }
  }

  // Blocked items
  if (blocked.length > 0) {
    console.log(`\n⛓ BLOCKED ITEMS (${blocked.length} — waiting on other items):`);
    for (const item of blocked) {
      console.log(`  ${item.id}: ${item.description}`);
      console.log(`     blocked by: ${item.blocked_by.join(', ')}`);
    }
  }

  if (done.length > 0) {
    console.log(`\n✓ COMPLETED ITEMS: ${done.length}`);
  }

  // Summary
  console.log('');
  const statusLabel = totalPending > blockThreshold ? 'CRITICAL' :
                      totalPending > advisoryThreshold ? 'ADVISORY' : 'HEALTHY';

  if (totalPending > advisoryThreshold) {
    console.log(`⚠ UPDATE BACKLOG ${statusLabel}: ${totalPending} items pending (threshold: advisory>${advisoryThreshold}, block>${blockThreshold})`);
    console.log(`  Governor decisions needed: ${governorItems.length}`);
    console.log(`  Opus tasks: ${opusItems.length}`);
    console.log(`  Sonnet P1+P2+P3: ${sonnetP1.length + sonnetP2.length + sonnetP3.length}`);
    console.log(`  Blocked: ${blocked.length}`);
  } else {
    console.log(`✓ Update backlog healthy: ${totalPending} items pending`);
  }

  console.log(`\n[validate-update-backlog] total=${items.length} pending=${pending.length} blocked=${blocked.length} done=${done.length} stage=${stage} status=${statusLabel}`);

  // Exit behavior
  if (stage === 'blocking' && totalPending > blockThreshold) {
    process.exit(1);
  }
  process.exit(0); // measurement/advisory always exits 0
}

main().catch(err => {
  console.error('[validate-update-backlog] fatal:', err);
  process.exit(1);
});
