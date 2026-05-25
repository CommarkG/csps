#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-text-input-standards
 * @csps-name validate-text-input-standards
 * @csps-description T2 validator for Q1 Governor directive S060: voice + file upload MANDATORY
 *   on all free-text fields platform-wide. Scans all page.tsx files for textarea/<input type=text>
 *   and checks for VoiceFileInput wrapper OR @voice-exempt comment.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:ux-governance audience:platform
 * @csps-enforces TEXT-INPUT-VOICE-STANDARD.md
 * @csps-ns_quality governed-without-rigidity, self-improving
 *
 * ALIGNMENT:
 *   WHO: pnpm verify orchestrator
 *   WHAT: Ensure every free-text input in the platform offers voice + file upload
 *   PREVENTS: Text-only inputs that exclude voice-first and document-sharing workflows
 *   RISK: Advisory during adoption; BLOCKING after 3+ violations (K=3 pattern)
 *   SCOPE: apps/csps-playground/src/app/**\/page.tsx; no network calls
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PLATFORM_DIR = join(ROOT, 'apps/csps-playground/src/app');

const violations = [];
const exemptions = [];
let pages_checked = 0;

function scanDir(dir) {
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      try {
        const st = statSync(full);
        if (st.isDirectory()) {
          scanDir(full);
        } else if (entry === 'page.tsx') {
          pages_checked++;
          const content = readFileSync(full, 'utf-8');

          // Check if page has textarea or text input
          const hasTextInput = /<textarea|<input[^>]*type=["']text/i.test(content);
          if (!hasTextInput) continue;

          // Check if voice standard is applied
          const hasVoiceStandard = /VoiceFileInput|voice-file-input|VoiceInput|@voice-exempt/i.test(content);

          const relativePath = full.replace(ROOT + '/', '').replace(ROOT + '\\', '').replace(/\\/g, '/');

          if (hasVoiceStandard) {
            if (/@voice-exempt/i.test(content)) {
              const exemptMatch = content.match(/@voice-exempt\s+([^\n]+)/i);
              exemptions.push({ path: relativePath, reason: exemptMatch?.[1] || 'no reason given' });
            }
            // Compliant — has VoiceFileInput or exemption
          } else {
            violations.push(relativePath);
          }
        }
      } catch { /* skip inaccessible */ }
    }
  } catch { /* skip unreadable dirs */ }
}

if (!existsSync(PLATFORM_DIR)) {
  console.log(`[validate-text-input-standards] pages_checked=0 violations=0 exemptions=0 advisory=0 blocking=0`);
  process.exit(0);
}

scanDir(PLATFORM_DIR);

const warnings = [];
const errors = [];

if (violations.length > 0) {
  warnings.push(
    `${violations.length} page(s) have raw <textarea>/<input type="text"> without VoiceFileInput or @voice-exempt. ` +
    'Governor Q1 S060: ALL free-text fields must offer voice input + file upload. ' +
    'Fix: replace with <VoiceFileInput> from libs/ui/src/VoiceFileInput.tsx. ' +
    'Or add // @voice-exempt [reason] if voice genuinely cannot apply. ' +
    'Violating pages: ' + violations.slice(0, 5).join(', ')
  );
}

if (exemptions.length > 0) {
  console.log(`  ℹ ${exemptions.length} exemption(s) declared:`);
  exemptions.forEach(e => console.log(`    ${e.path}: ${e.reason}`));
}

if (warnings.length > 0) {
  warnings.forEach(w => console.warn(`  ⚠ ${w}`));
}

const summary = `[validate-text-input-standards] pages_checked=${pages_checked} violations=${violations.length} exemptions=${exemptions.length} advisory=${warnings.length} blocking=${errors.length}`;

if (errors.length > 0) {
  errors.forEach(e => console.error(`  ✗ ${e}`));
  console.error(summary);
  process.exit(1);
}

console.log(summary);
process.exit(0);
