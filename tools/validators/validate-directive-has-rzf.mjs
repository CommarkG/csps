#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-directive-has-rzf
 * @csps-name validate-directive-has-rzf
 * @csps-description Rule 9 enforcement: scans tools/council/opus-turn.md for
 * ## SONNET DIRECTIVE sections. For each, checks that ## RZF VERIFICATION appears
 * within the same Turn block (# Opus Turn N). ADVISORY if missing. Implements Rule 9
 * of communication-protocol-shared.md: "Pre-Directive RZF — present only amended final."
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces P-META-008
 *
 * Coverage Levels:
 *   ✓ Checks: all SONNET DIRECTIVE sections in opus-turn.md
 *   ✓ Detects: Turn blocks with SONNET DIRECTIVE but no RZF VERIFICATION
 *   ✗ Does not check: quality of RZF — only presence
 *
 * Exit: 0 always (ADVISORY)
 * Output: turns_checked=N directives=N missing_rzf=N
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const OPUS_TURN_FILE = resolve(ROOT, 'tools/council/opus-turn.md');

if (!existsSync(OPUS_TURN_FILE)) {
  console.log(`[validate-directive-has-rzf] opus-turn.md not found turns_checked=0 directives=0 missing_rzf=0`);
  process.exit(0);
}

const content = readFileSync(OPUS_TURN_FILE, 'utf-8');

// Split into Turn blocks by "# Opus Turn N" headers
const turnBlocks = content.split(/(?=^# Opus Turn \d+)/m).filter(b => /^# Opus Turn \d+/.test(b.trim()));

let turnsChecked = 0;
let directivesFound = 0;
let missingRzf = 0;

for (const block of turnBlocks) {
  const turnMatch = block.match(/^# Opus Turn (\d+)/);
  if (!turnMatch) continue;
  const turnNum = turnMatch[1];
  turnsChecked++;

  const hasDirective = /^##\s+SONNET DIRECTIVE/m.test(block);
  if (!hasDirective) continue;
  directivesFound++;

  const hasRzf = /^##\s+RZF VERIFICATION/m.test(block);
  if (!hasRzf) {
    missingRzf++;
    console.warn(
      `[validate-directive-has-rzf] ADVISORY: Turn ${turnNum} has ## SONNET DIRECTIVE but no ## RZF VERIFICATION.\n` +
      `  Rule 9 (communication-protocol-shared.md): Before presenting ANY directive, run ≥1 ZF cycle.\n` +
      `  Fix: Add ## RZF VERIFICATION + Cycle 1 + Status to Turn ${turnNum} before issuing the directive.\n` +
      `  Why: Recipients never see a directive with known gaps.`
    );
  }
}

console.log(`[validate-directive-has-rzf] turns_checked=${turnsChecked} directives=${directivesFound} missing_rzf=${missingRzf}`);
process.exit(0);
