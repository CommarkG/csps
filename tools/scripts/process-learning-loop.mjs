#!/usr/bin/env node
/**
 * process-learning-loop.mjs — Learning Loop JSONL Consumer
 *
 * @core-seed: LEARNING_LOOP_CONSUMER | plan: deprecated-S044 | grows-to: DEPRECATED — session learning now handled by post-stop-learning-loop.sh (active). Pattern registry = validate-quality-alignment.mjs. | target: S044 | closed: S044 OPEN-058
 *
 * ROOT CAUSE TARGETED (S021 Expert Review E7-1):
 *   post-stop-learning-loop.sh has been writing session metadata to
 *   ~/.claude/learning-loop-capture.jsonl since S011. NOTHING READS IT.
 *   This script is the first consumer — reads the JSONL and surfaces
 *   session quality signals.
 *
 * Phase 1 (this implementation):
 *   - Read JSONL file
 *   - Report: sessions with high blocking_found_total, sessions with 0 verify_runs
 *   - Output: session quality summary
 *
 * Phase 2 (S023):
 *   - Cross-reference with git log to connect sessions to commits
 *   - Feed into platform-metrics-history.yaml
 *
 * Phase 3 (S025+):
 *   - Identify recurring patterns → feed into pattern registry
 *   - Connect to self-improvement pipeline (L15)
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';

const CAPTURE_LOG = process.env.CSPS_LEARNING_LOOP_CAPTURE_LOG ||
  join(homedir(), '.claude', 'learning-loop-capture.jsonl');

async function main() {
  if (!existsSync(CAPTURE_LOG)) {
    console.log('[process-learning-loop] No capture log found at:', CAPTURE_LOG);
    console.log('  The post-stop-learning-loop.sh hook writes here after each session.');
    console.log('  Log will appear after the first session with the hook active.');
    process.exit(0);
  }

  const lines = readFileSync(CAPTURE_LOG, 'utf8').split('\n').filter(l => l.trim());
  const entries = [];

  for (const line of lines) {
    try {
      entries.push(JSON.parse(line));
    } catch { /* skip malformed lines */ }
  }

  if (entries.length === 0) {
    console.log('[process-learning-loop] Capture log exists but has no valid entries.');
    process.exit(0);
  }

  // Group by session
  const sessionMap = new Map();
  for (const e of entries) {
    const sid = e.session_id || 'unknown';
    if (!sessionMap.has(sid)) sessionMap.set(sid, []);
    sessionMap.get(sid).push(e);
  }

  console.log(`\nLearning Loop Analysis (${sessionMap.size} sessions, ${entries.length} events):\n`);

  // Surface quality signals
  const zeroVerifySessions = [];
  const highBlockingSessions = [];

  for (const [sessionId, events] of sessionMap) {
    const verifyRuns = events.reduce((sum, e) => sum + (e.verify_runs || 0), 0);
    const blockingFound = events.reduce((sum, e) => sum + (e.blocking_found || 0), 0);
    const timestamp = events[0]?.timestamp || 'unknown';

    if (verifyRuns === 0) {
      zeroVerifySessions.push({ sessionId, timestamp });
    }
    if (blockingFound > 5) {
      highBlockingSessions.push({ sessionId, blockingFound, timestamp });
    }

    console.log(`  Session ${sessionId}: verify_runs=${verifyRuns} blocking_found=${blockingFound} [${timestamp}]`);
  }

  if (zeroVerifySessions.length > 0) {
    console.log(`\n⚠ Sessions with 0 verify runs (ZF never ran — risky):`);
    for (const s of zeroVerifySessions) {
      console.log(`  ${s.sessionId} [${s.timestamp}]`);
    }
  }

  if (highBlockingSessions.length > 0) {
    console.log(`\n⚠ Sessions with high blocking findings (>5 — complex work):`);
    for (const s of highBlockingSessions) {
      console.log(`  ${s.sessionId}: ${s.blockingFound} blocking findings [${s.timestamp}]`);
    }
  }

  console.log(`\n[process-learning-loop] total_entries=${entries.length} sessions=${sessionMap.size} zero_verify=${zeroVerifySessions.length} high_blocking=${highBlockingSessions.length}`);
  console.log('Phase 1 complete. Phase 2 (cross-reference with git): S023. Phase 3 (pattern registry): S025+.');
}

main().catch(err => {
  console.error('[process-learning-loop] fatal:', err);
  process.exit(1);
});
