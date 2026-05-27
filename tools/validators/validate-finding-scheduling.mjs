#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/ + PROTO-S066-WAVE-2 Core Seed pattern
 * core_spine: VALD
 * governing_principle: P-META-019
 * behavioral_contract: B_STRUCTURAL_PREVENTION_DISCIPLINE
 * role: Auto-scheduling validator for improvement-register + gap-recurrence-register.
 *       Surfaces overdue findings (past must_address_by_session).
 *       K=1 overdue → ADVISORY (exit 0 + stderr). K=2 overdue → BLOCKING (exit 1).
 *       K=1 past must_address + 3 sessions → auto-promote to K=2 in register.
 * @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE P-META-019 M-30
 * @behavioral-test-status: tested — finding-scheduling-test.sh A/B/C/D
 */

/**
 * validate-finding-scheduling.mjs
 * PROTO-S066-WAVE-2 STEP 2 companion validator.
 *
 * Logic per Core Seed:
 *   For each open entry with must_address_by_session:
 *     If current_session > must_address_by_session AND no fix_commit_sha AND no explicit_defer_reason:
 *       K=1 → ADVISORY (exit 0 + stderr)
 *       K>=2 → BLOCKING (exit 1)
 *     If current_session > must_address_by_session + 3 AND k_count == 1:
 *       Auto-promote to K=2 (write back to register)
 *
 * Output: findings_checked=N on_time=N overdue_advisory=N overdue_blocking=N auto_promoted=N
 * Writes: tools/data/validate-finding-scheduling-last-run.json
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const REGISTERS = [
  { path: join(ROOT, 'tools', 'data', 'improvement-register.yaml'), name: 'improvement-register' },
  { path: join(ROOT, 'tools', 'data', 'gap-recurrence-register.yaml'), name: 'gap-recurrence-register' },
];
const SESSION_STATE = join(ROOT, 'tools', 'session-state.json');

// Get current session number
function getCurrentSessionNum() {
  try {
    const s = JSON.parse(readFileSync(SESSION_STATE, 'utf-8'));
    const m = String(s.current_session || 'S066').match(/S(\d+)/);
    return m ? parseInt(m[1], 10) : 66;
  } catch (e) { return 66; }
}

function sessionNum(sessionStr) {
  const m = String(sessionStr).match(/S(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function sessionFmt(num) {
  return `S${String(num).padStart(3, '0')}`;
}

const currentSession = getCurrentSessionNum();
let findings_checked = 0, on_time = 0, overdue_advisory = 0, overdue_blocking = 0, auto_promoted = 0;
const findings_report = [];

// Process each register
for (const reg of REGISTERS) {
  if (!existsSync(reg.path)) continue;
  let content = readFileSync(reg.path, 'utf-8');
  let modified = false;

  // Simple YAML entry extraction
  const entryRe = /(\s{2}- id:\s+\S+[\s\S]*?)(?=\s{2}- id:|\n---|\n\n---|\Z)/gm;
  let m;
  const matches = [];
  while ((m = entryRe.exec(content)) !== null) {
    matches.push({ start: m.index, text: m[1] });
  }

  for (const entry of matches) {
    const block = entry.text;

    // Skip closed entries
    const statusM = block.match(/status:\s*(\S+)/);
    if (!statusM) continue;
    const status = statusM[1];
    if (['closed', 'resolved', 'propagated', 'implemented', 'implemented-S066'].includes(status)) continue;

    // Get scheduling fields
    const mustByM = block.match(/must_address_by_session:\s*["']?(S\d+)["']?/);
    if (!mustByM) continue; // No scheduling field — skip (may be pre-migration)

    findings_checked++;
    const mustByNum = sessionNum(mustByM[1]);
    const idM = block.match(/- id:\s+(\S+)/);
    const id = idM ? idM[1] : '(unknown)';
    const kM = block.match(/k_count:\s*(\d+)/);
    const kCount = kM ? parseInt(kM[1], 10) : 1;
    const hasFixSha = /fix_commit_sha:\s*(?!null)\S/.test(block);
    const hasDeferReason = /explicit_defer_reason:\s*(?!null)\S/.test(block);

    if (mustByNum && currentSession > mustByNum && !hasFixSha && !hasDeferReason) {
      // Overdue!
      const sessionsOverdue = currentSession - mustByNum;

      // Auto-promote K=1 → K=2 if 3+ sessions overdue
      if (kCount === 1 && sessionsOverdue >= 3) {
        // Update k_count in content
        content = content.replace(
          `- id: ${id}\n`,
          `- id: ${id}\n`
        );
        // Simple replacement in the entry
        const oldKLine = block.match(/k_count:\s*\d+/)?.[0];
        if (oldKLine) {
          content = content.replace(
            new RegExp(`(- id: ${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?)${oldKLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`),
            (match, prefix) => `${prefix}k_count: 2`
          );
          auto_promoted++;
          modified = true;
          process.stderr.write(
            `[finding-scheduling] AUTO-PROMOTE: ${id} K=1→K=2 (${sessionsOverdue} sessions overdue)\n`
          );
        }
        overdue_blocking++;
        findings_report.push({ id, register: reg.name, severity: 'BLOCKING', sessions_overdue: sessionsOverdue, reason: 'K promoted to 2' });
        process.stderr.write(
          `[finding-scheduling] BLOCKING: ${id} overdue by ${sessionsOverdue} sessions. K promoted to 2.\n` +
          `  Fix: add fix_commit_sha: <sha> OR explicit_defer_reason: <reason> to entry.\n`
        );
      } else if (kCount >= 2) {
        overdue_blocking++;
        findings_report.push({ id, register: reg.name, severity: 'BLOCKING', sessions_overdue: sessionsOverdue });
        process.stderr.write(
          `[finding-scheduling] BLOCKING: ${id} K=${kCount} overdue by ${sessionsOverdue} sessions.\n` +
          `  must_address_by_session was ${mustByM[1]}, now ${sessionFmt(currentSession)}.\n` +
          `  Fix: add fix_commit_sha: <sha> OR explicit_defer_reason: <reason> to entry.\n`
        );
      } else {
        overdue_advisory++;
        findings_report.push({ id, register: reg.name, severity: 'ADVISORY', sessions_overdue: sessionsOverdue });
        process.stderr.write(
          `[finding-scheduling][ADVISORY] ${id} K=${kCount} overdue by ${sessionsOverdue} sessions.\n` +
          `  Will BLOCK if K reaches 2 or if ${sessionsOverdue + (3 - sessionsOverdue)} more sessions pass without fix.\n`
        );
      }
    } else {
      on_time++;
    }
  }

  if (modified) {
    writeFileSync(reg.path, content, 'utf-8');
  }
}

const summary = `[validate-finding-scheduling] findings_checked=${findings_checked} on_time=${on_time} overdue_advisory=${overdue_advisory} overdue_blocking=${overdue_blocking} auto_promoted=${auto_promoted}`;
console.log(summary);

// Write last-run JSON
writeFileSync(
  join(ROOT, 'tools', 'data', 'validate-finding-scheduling-last-run.json'),
  JSON.stringify({
    findings_checked, on_time, overdue_advisory, overdue_blocking, auto_promoted,
    current_session: sessionFmt(currentSession), ran_at: new Date().toISOString(),
    findings_report
  }, null, 2),
  'utf-8'
);

if (overdue_blocking > 0) process.exit(1);
process.exit(0);
