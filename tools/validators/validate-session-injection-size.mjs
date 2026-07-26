#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: VALD
 * governing_principle: gap_SESSION_INJECTION_COMPRESSION
 * role: Measures the actual byte-size of session-open.sh's combined output (the context
 *       injected into every fresh Claude Code tab). Converts "no measurement exists" into a
 *       real, trend-tracked number — an honest PARTIAL structural fix, not a full closure.
 * @csps-enforces gap_SESSION_INJECTION_COMPRESSION (tools/data/gap-recurrence-register.yaml)
 *
 * @csps-id csps.tools.validators.validate-session-injection-size
 * @csps-name validate-session-injection-size
 * @csps-version 1.0.0 (S089 — Weekly Evolution Engine batch #1)
 *
 * HONEST LIMITATION (do not oversell): this measures INJECTION SIZE, a proxy correlated with
 * compression risk, NOT actual multi-turn context-survival (which needs live LLM behavior
 * observation across real long sessions — genuinely hard to test mechanically, per the gap's
 * own explicit_defer_reason across 3 prior sessions). Large injection = more at risk; small
 * injection = less at risk. It does not prove survival either way.
 *
 * ADVISORY only (never blocks session start over a size number — that would be its own
 * failure mode). Tracks history in tools/data/session-injection-size-history.json so GROWTH
 * is visible over time, not just a single snapshot.
 *
 * Output: bytes=N threshold=N status=OK|GROWING|LARGE blocking=0 advisory=N
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const HISTORY_FILE = resolve(ROOT, 'tools/data/session-injection-size-history.json');

// Reasoned threshold, not arbitrary: ~40KB is roughly 10k tokens at typical 4 chars/token —
// a meaningful fraction of a long session's working context if repeated every tab. Flag for
// human attention past that, not a hard block.
const LARGE_THRESHOLD_BYTES = 40000;
const GROWTH_ALERT_RATIO = 1.15; // 15% growth vs last recorded measurement

let bytes = 0;
try {
  const out = execSync('bash .claude/hooks/session-open.sh 2>&1', { cwd: ROOT, encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
  bytes = Buffer.byteLength(out, 'utf-8');
} catch (e) {
  // session-open.sh exits 0 always by design; a throw here means something else broke.
  console.log(`[validate-session-injection-size] session-open.sh execution failed: ${e.message}`);
  console.log('bytes=0 threshold=' + LARGE_THRESHOLD_BYTES + ' status=ERROR blocking=0 advisory=1');
  process.exit(0);
}

let history = { measurements: [] };
if (existsSync(HISTORY_FILE)) {
  try { history = JSON.parse(readFileSync(HISTORY_FILE, 'utf-8')); } catch (e) { /* start fresh */ }
}

const lastMeasurement = history.measurements.length > 0 ? history.measurements[history.measurements.length - 1] : null;
const growthRatio = lastMeasurement && lastMeasurement.bytes > 0 ? bytes / lastMeasurement.bytes : 1;

let status = 'OK';
let advisory = 0;
const findings = [];

if (bytes > LARGE_THRESHOLD_BYTES) {
  status = 'LARGE';
  advisory++;
  findings.push(`session-open.sh injects ${bytes} bytes (>${LARGE_THRESHOLD_BYTES} threshold) — compression-risk proxy elevated. Consider trimming or moving low-value T3 reminders to on-demand.`);
}
if (growthRatio >= GROWTH_ALERT_RATIO) {
  status = status === 'LARGE' ? 'LARGE_AND_GROWING' : 'GROWING';
  advisory++;
  findings.push(`injection grew ${Math.round((growthRatio - 1) * 100)}% since last measurement (${lastMeasurement.bytes} -> ${bytes} bytes, ${lastMeasurement.date}).`);
}

for (const f of findings) console.log(`  ⚠ ${f}`);

// Append to history (cap at 50 entries — trend, not infinite log)
history.measurements.push({ date: new Date().toISOString().slice(0, 10), bytes, status });
if (history.measurements.length > 50) history.measurements = history.measurements.slice(-50);
writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');

console.log(`[validate-session-injection-size] bytes=${bytes} threshold=${LARGE_THRESHOLD_BYTES} status=${status} blocking=0 advisory=${advisory}`);
process.exit(0); // ADVISORY only — a size number never blocks session start
