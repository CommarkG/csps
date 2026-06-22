#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-blocking-determinism
 * @csps-name validate-blocking-determinism
 * @csps-description B_DETERMINISTIC_GATE item 4 (BACKSTOP, construct-determinism):
 *   scans every validator in tools/validators/ for uses of Date.now(), new Date(),
 *   fs.stat/statSync/.mtimeMs in code paths that could influence a BLOCKING decision
 *   (i.e., where the result flows into a `blocking++` increment or `process.exit(1)`).
 *
 *   Root cause prevented: validate-register-reference-integrity.mjs used `statSync().mtimeMs`
 *   in its blocking path (isCurrentSession() mtime<24h gate) — this caused temporal instability
 *   where the same file was BLOCKING on Monday and ADVISORY on Tuesday, with no code change.
 *   This validator makes such time-dependent blocking paths impossible to author undetected.
 *
 *   Pattern detection (conservative, high-signal):
 *     BLOCKING if a validator file contains BOTH:
 *       (a) a time-acquisition call: Date.now() / new Date() / statSync(..).mtimeMs / .mtime
 *       (b) a blocking-decision call: blocking++ / process.exit(1) / 'BLOCKING'
 *     AND the time call is NOT inside a clearly advisory-only block
 *       (i.e., not in a block that only emits advisory++ or console.log).
 *
 *   Exempt: validate-blocking-determinism.mjs itself (self-referential).
 *   Exempt: validators with `// @determinism-exempt:` annotation (justify in comment).
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_DETERMINISTIC_GATE PROTO-S086-CLOSE
 * @csps-prevention-class TEMPORAL-BLOCKING-PATH
 *
 * Coverage Levels:
 *   Phase 1 (S086 build): ADVISORY-only — 43 pre-existing validators measured.
 *   Phase 2 (S086-COMPLETION, current): BLOCKING enforced. All 43 annotated @determinism-exempt: with justification.
 *     New validators that add time-in-blocking-path without @determinism-exempt: → FAIL (exit 1).
 *   The @determinism-exempt: annotation allows individual files to declare their time-use is intentional.
 *
 * run_tier: STANDARD (light scan — reads validator source files, no subprocess)
 * load_mode: on-demand
 * justification: STANDARD — structural correctness gate; low cost (only reads .mjs files)
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const VALIDATORS_DIR = join(ROOT, 'tools/validators');

const SELF = basename(fileURLToPath(import.meta.url));

// ── Patterns ──────────────────────────────────────────────────────────────────

// Time-acquisition patterns (indicate temporal dependency)
const TIME_PATTERNS = [
  /\bDate\.now\(\)/,
  /\bnew Date\(\)/,
  /\.mtimeMs\b/,
  /\.mtime\b/,
  /statSync\s*\([^)]+\)\s*\.\s*(mtimeMs|mtime|ctime|atime)/,
  /stat\s*\([^)]+\)\s*\.\s*(mtimeMs|mtime)/,
];

// Blocking-decision patterns (indicate the result flows to a blocking exit)
const BLOCKING_PATTERNS = [
  /\bblocking\+\+/,
  /\bblocking\s*=\s*blocking\s*\+\s*1/,
  /blocking:\s*\d+/,   // conservative: if it emits `blocking:` in output
  /process\.exit\s*\(\s*1\s*\)/,
  /'BLOCKING'|"BLOCKING"/,
];

// Exemptions
const EXEMPT_ANNOTATION = /@determinism-exempt:/;
const ADVISORY_ONLY_CONTEXT = /advisory\s*\+\+|ADVISORY/;  // heuristic: lines around time call

let blocking = 0;
let advisory = 0;
const findings = [];

const validatorFiles = readdirSync(VALIDATORS_DIR)
  .filter(f => f.endsWith('.mjs') && f !== SELF)
  .sort();

for (const fileName of validatorFiles) {
  const filePath = join(VALIDATORS_DIR, fileName);
  const relPath = relative(ROOT, filePath);

  let content;
  try { content = readFileSync(filePath, 'utf-8'); } catch { continue; }

  // Check for exemption annotation
  if (EXEMPT_ANNOTATION.test(content)) continue;

  const hasTimePattern = TIME_PATTERNS.some(p => p.test(content));
  if (!hasTimePattern) continue;

  const hasBlockingPattern = BLOCKING_PATTERNS.some(p => p.test(content));

  if (hasBlockingPattern) {
    // Check if the time usage is clearly isolated to advisory paths only
    // Heuristic: look at lines containing time patterns; check if they're near ADVISORY-only code
    const lines = content.split('\n');
    let timeInBlockingPath = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (TIME_PATTERNS.some(p => p.test(line))) {
        // Look at surrounding 5 lines for context
        const context = lines.slice(Math.max(0, i - 3), Math.min(lines.length, i + 5)).join('\n');
        const isAdvisoryOnly = ADVISORY_ONLY_CONTEXT.test(context) &&
                               !BLOCKING_PATTERNS.some(p => p.test(context));
        if (!isAdvisoryOnly) {
          timeInBlockingPath = true;
          break;
        }
      }
    }

    if (timeInBlockingPath) {
      findings.push({
        status: 'BLOCKING',
        file: relPath,
        reason: 'Time-acquisition (Date.now/mtime) found in path that CAN influence blocking decision. Add @determinism-exempt: annotation with justification, or replace with explicit session marker.',
      });
      blocking++;
    } else {
      findings.push({
        status: 'ADVISORY',
        file: relPath,
        reason: 'Time-acquisition present but appears advisory-only. Verify it cannot flow to blocking exit.',
      });
      advisory++;
    }
  } else if (hasTimePattern) {
    // Time pattern but no blocking pattern — informational only
    findings.push({
      status: 'ADVISORY',
      file: relPath,
      reason: 'Time-acquisition present but no blocking decision detected. Monitor if blocking logic is added.',
    });
    advisory++;
  }
}

// ── Output ────────────────────────────────────────────────────────────────────

const status = blocking > 0 ? 'FAIL' : 'PASS';
console.log(`[validate-blocking-determinism] ${status}`);
console.log(`  validators_scanned=${validatorFiles.length} blocking=${blocking} advisory=${advisory}`);

if (findings.length > 0) {
  const blockingFindings = findings.filter(f => f.status === 'BLOCKING');
  const advisoryFindings = findings.filter(f => f.status === 'ADVISORY');

  if (blockingFindings.length > 0) {
    console.error('\n[validate-blocking-determinism] BLOCKING findings:');
    for (const f of blockingFindings) {
      console.error(`  ✗ ${f.file}`);
      console.error(`    → ${f.reason}`);
    }
  }

  if (advisoryFindings.length > 0 && advisoryFindings.length <= 5) {
    console.log('\n[validate-blocking-determinism] ADVISORY findings:');
    for (const f of advisoryFindings) {
      console.log(`  ℹ ${f.file}: ${f.reason}`);
    }
  } else if (advisoryFindings.length > 5) {
    console.log(`\n[validate-blocking-determinism] ${advisoryFindings.length} ADVISORY findings (run with --verbose to see all)`);
  }
}

if (blocking === 0 && advisory === 0) {
  console.log('[validate-blocking-determinism] ✓ No time-dependent blocking paths detected');
}

// Phase 2 (S086 completion): BLOCKING enforced.
// All 43 pre-existing validators annotated with @determinism-exempt: and justification (S086-COMPLETION).
// New validators without @determinism-exempt: that have time-in-blocking-path → FAIL (exit 1).
// @csps-version 2.0.0
process.exit(blocking > 0 ? 1 : 0);
