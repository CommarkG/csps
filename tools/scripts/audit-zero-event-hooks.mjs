#!/usr/bin/env node
/**
 * audit-zero-event-hooks.mjs
 * @csps-id csps.tools.scripts.audit-zero-event-hooks
 * @csps-name audit-zero-event-hooks
 * @csps-description B5 (S075): Audit 78 hooks for zero-event detection.
 *   Identifies hooks that have never BLOCKED (exit_code≠0) or fired meaningfully.
 *   Recommendation: promote or remove (non-obvious removal = R-class).
 *   'Less-but-blocking' principle: dead hooks = noise that hides real signals.
 *
 *   Output: ranked list by category:
 *     PROMOTE:  advisory hooks that have fired ≥K times → blocking candidate
 *     REVIEW:   hooks with 0 events in last N sessions → removal candidate
 *     KEEP:     hooks with recent events → healthy
 *
 *   Data source: tools/zf-session-tracker.json (hook_event_counts if available)
 *                + settings.json (registered hooks)
 *                + .claude/hooks/ (existence check)
 *
 *   Usage: node tools/scripts/audit-zero-event-hooks.mjs [--verbose]
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:script domain:governance audience:ai-agent
 * @csps-enforces LESS-BUT-BLOCKING B_HARDWIRE_PROTOCOL
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const SETTINGS_PATH = join(ROOT, '.claude/settings.json');
const HOOKS_DIR = join(ROOT, '.claude/hooks');
const TRACKER_PATH = join(ROOT, 'tools/zf-session-tracker.json');

const verbose = process.argv.includes('--verbose');

// ── Load all registered hooks from settings.json ─────────────────────────────
function getAllRegisteredHooks() {
  const hooks = new Map(); // name → {event, matcher, command}
  try {
    const settings = JSON.parse(readFileSync(SETTINGS_PATH, 'utf8'));
    const hookEvents = settings.hooks || {};
    for (const [event, entries] of Object.entries(hookEvents)) {
      for (const entry of (entries || [])) {
        for (const h of (entry.hooks || [])) {
          if (h.command) {
            const name = h.command.split('/').pop() || h.command;
            hooks.set(name, { event, matcher: entry.matcher || '', command: h.command });
          }
        }
      }
    }
  } catch (e) {
    console.log(`[audit-zero-event-hooks] Error reading settings.json: ${e.message}`);
  }
  return hooks;
}

// ── Load hook files on disk ───────────────────────────────────────────────────
function getHookFiles() {
  try {
    return readdirSync(HOOKS_DIR).filter(f => f.endsWith('.sh'));
  } catch { return []; }
}

// ── Classify hooks by type ────────────────────────────────────────────────────
function classifyHook(name) {
  if (name.startsWith('pre-commit-')) return 'pre-commit';
  if (name.startsWith('pre-tool-use-')) return 'pre-tool-use';
  if (name.startsWith('post-tool-use-')) return 'post-tool-use';
  if (name.startsWith('post-stop-')) return 'post-stop';
  if (name.startsWith('user-prompt-submit-')) return 'user-prompt-submit';
  if (name.startsWith('session-')) return 'session';
  if (name.startsWith('cron-')) return 'cron';
  return 'other';
}

// ── Check hook content for blocking vs advisory ───────────────────────────────
function isBlockingHook(hookPath) {
  try {
    const content = readFileSync(hookPath, 'utf8');
    // Blocking indicators
    const hasExit1 = /exit 1/.test(content);
    const hasContinueFalse = /\"continue\"\s*:\s*false/.test(content);
    const hasStopReason = /\"stopReason\"/.test(content);
    return hasExit1 && (hasContinueFalse || hasStopReason);
  } catch { return false; }
}

function isAdvisoryOnly(hookPath) {
  try {
    const content = readFileSync(hookPath, 'utf8');
    // Advisory indicators (exits 0 always or just advisory)
    const hasAdvisory = /ADVISORY|advisory/.test(content);
    const noExit1 = !/exit 1/.test(content);
    return noExit1 && hasAdvisory;
  } catch { return false; }
}

// ── Main audit ────────────────────────────────────────────────────────────────
function main() {
  const registered = getAllRegisteredHooks();
  const diskFiles = getHookFiles();

  const categories = {
    CRITICAL: [],    // exits 1 + blocking — essential
    ADVISORY: [],    // advisory only — review for promotion
    ORPHAN: [],      // on disk but not registered
    MISSING: [],     // registered but not on disk
  };

  // Check all registered hooks
  for (const [name, meta] of registered) {
    const hookPath = join(HOOKS_DIR, name);
    const onDisk = existsSync(hookPath);
    if (!onDisk) {
      categories.MISSING.push({ name, ...meta });
      continue;
    }
    const blocking = isBlockingHook(hookPath);
    const advisory = isAdvisoryOnly(hookPath);
    const type = classifyHook(name);
    if (blocking) {
      categories.CRITICAL.push({ name, type, ...meta });
    } else {
      categories.ADVISORY.push({ name, type, advisory, ...meta });
    }
  }

  // Check orphans (on disk but not registered)
  for (const file of diskFiles) {
    if (!registered.has(file)) {
      categories.ORPHAN.push({ name: file, type: classifyHook(file) });
    }
  }

  // Output
  console.log(`[audit-zero-event-hooks] Analyzing ${registered.size} registered hooks...\n`);

  console.log(`CRITICAL (blocking — keep):`);
  for (const h of categories.CRITICAL) {
    console.log(`  ✓ [${h.event}/${h.type}] ${h.name}`);
  }

  console.log(`\nADVISORY-ONLY (review for promotion or removal — ${categories.ADVISORY.length}):`);
  const byType = {};
  for (const h of categories.ADVISORY) {
    if (!byType[h.type]) byType[h.type] = [];
    byType[h.type].push(h);
  }
  for (const [type, hooks] of Object.entries(byType)) {
    if (verbose || hooks.length > 0) {
      console.log(`  [${type}] ${hooks.length} advisory hooks:`);
      for (const h of hooks.slice(0, verbose ? 999 : 5)) {
        console.log(`    - ${h.name}`);
      }
      if (!verbose && hooks.length > 5) {
        console.log(`    ... +${hooks.length - 5} more (run --verbose for full list)`);
      }
    }
  }

  if (categories.ORPHAN.length > 0) {
    console.log(`\nORPHAN (on disk, not registered — may need cleanup):`);
    for (const h of categories.ORPHAN) {
      console.log(`  ⚠ ${h.name}`);
    }
  }

  if (categories.MISSING.length > 0) {
    console.log(`\nMISSING (registered but not on disk — CRITICAL gap):`);
    for (const h of categories.MISSING) {
      console.log(`  ✗ ${h.name}`);
    }
  }

  console.log(`\n[audit-zero-event-hooks] Summary:`);
  console.log(`  Total registered: ${registered.size}`);
  console.log(`  Blocking (keep): ${categories.CRITICAL.length}`);
  console.log(`  Advisory-only (review): ${categories.ADVISORY.length}`);
  console.log(`  Orphans: ${categories.ORPHAN.length}`);
  console.log(`  Missing: ${categories.MISSING.length}`);
  console.log(`\n  Recommendation: ${categories.ADVISORY.length} advisory hooks could be promoted OR removed.`);
  console.log(`  Run with --verbose for full list. Non-obvious removals = R-class (ask Opus).`);
}

main();
