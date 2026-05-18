#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-directive-has-rzf
 * @csps-name validate-directive-has-rzf
 * @csps-description Rule 9 enforcement: scans tools/council/opus-turn.md for
 * ## SONNET DIRECTIVE sections. Checks: (1) RZF VERIFICATION exists in same Turn block,
 * (2) RZF appears BEFORE the directive (ordering — Rule 9 requires RZF first),
 * (3) Directive follows Rule 2 format ([PROTOCOL:] header OR "Sonnet, this is Opus." opening),
 * (4) Directive ends with verification tail (exit_code=0 before committing).
 * BLOCKING for most recent Turn with directive. ADVISORY for historical turns.
 * @csps-version 2.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces P-META-008
 *
 * Coverage Levels:
 *   ✓ Checks: all SONNET DIRECTIVE sections in opus-turn.md
 *   ✓ Detects: Turn blocks with SONNET DIRECTIVE but no RZF VERIFICATION
 *   ✓ Detects: RZF AFTER directive (wrong order — Rule 9 requires RZF BEFORE)
 *   ✓ Detects: missing Rule 2 format header ([PROTOCOL:] or "Sonnet, this is Opus.")
 *   ✓ Detects: missing verification tail (exit_code=0 before committing)
 *   ✗ Does not check: quality of RZF — use validate-quality-alignment.mjs
 *
 * Exit: 1 if most recent directive Turn fails any check (BLOCKING). 0 otherwise.
 * Output: turns_checked=N directives=N missing_rzf=N wrong_order=N format_issues=N blocking=N
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const OPUS_TURN_FILE = resolve(ROOT, 'tools/council/opus-turn.md');

if (!existsSync(OPUS_TURN_FILE)) {
  console.log(`[validate-directive-has-rzf] opus-turn.md not found turns_checked=0 directives=0 missing_rzf=0 wrong_order=0 format_issues=0 blocking=0`);
  process.exit(0);
}

const content = readFileSync(OPUS_TURN_FILE, 'utf-8');
const turnBlocks = content.split(/(?=^# Opus Turn \d+)/m).filter(b => /^# Opus Turn \d+/.test(b.trim()));

let turnsChecked = 0;
let directivesFound = 0;
let missingRzf = 0;
let wrongOrder = 0;
let formatIssues = 0;
let blockingViolations = 0;
const BLOCKING_FROM_TURN = 96; // S040+ — governor directive: RZF mandatory before directives

// Find the highest Turn number (most recent)
const turnNumbers = turnBlocks.map(b => {
  const m = b.match(/^# Opus Turn (\d+)/);
  return m ? Number(m[1]) : 0;
});
const maxTurn = Math.max(...turnNumbers, 0);

for (const block of turnBlocks) {
  const turnMatch = block.match(/^# Opus Turn (\d+)/);
  if (!turnMatch) continue;
  const turnNum = Number(turnMatch[1]);
  const turnLabel = turnMatch[1];
  turnsChecked++;

  const hasDirective = /^##\s+SONNET DIRECTIVE/m.test(block);
  if (!hasDirective) continue;
  directivesFound++;

  const isMostRecent = (turnNum === maxTurn);
  const severity = (isMostRecent || turnNum >= BLOCKING_FROM_TURN) ? 'BLOCKING' : 'ADVISORY';
  const blockPrefix = isMostRecent ? '[validate-directive-has-rzf] BLOCKING' : '[validate-directive-has-rzf] ADVISORY';

  let turnHasProblem = false;

  // 1. Check RZF exists in same Turn
  const hasRzf = /^##\s+RZF VERIFICATION/m.test(block);
  if (!hasRzf) {
    missingRzf++;
    turnHasProblem = true;
    console.warn(
      `${blockPrefix}: Turn ${turnLabel} has ## SONNET DIRECTIVE but no ## RZF VERIFICATION.\n` +
      `  Rule 9: Before presenting ANY directive, run ≥1 ZF cycle.\n` +
      `  Fix: Add ## RZF VERIFICATION + Cycle 1 + Cycle 2 + Status BEFORE the directive.\n` +
      `  Format: ## RZF VERIFICATION\\nCycle 1: [findings]\\nCycle 2: [re-examined, 0 new]\\nStatus: ZF ACHIEVED`
    );
  } else {
    // 2. Check ordering: RZF must appear BEFORE SONNET DIRECTIVE in the block
    const rzfPos = block.search(/^##\s+RZF VERIFICATION/m);
    const directivePos = block.search(/^##\s+SONNET DIRECTIVE/m);
    if (rzfPos > directivePos) {
      wrongOrder++;
      turnHasProblem = true;
      console.warn(
        `${blockPrefix}: Turn ${turnLabel} RZF VERIFICATION appears AFTER SONNET DIRECTIVE (wrong order).\n` +
        `  Rule 9: RZF runs FIRST, then directive is presented.\n` +
        `  Fix: Move ## RZF VERIFICATION section ABOVE ## SONNET DIRECTIVE in Turn ${turnLabel}.`
      );
    }
  }

  // 3. Check Rule 2 format: directive must start with [PROTOCOL:] or "Sonnet, this is Opus."
  // Extract body from SONNET DIRECTIVE heading to next ## section
  const directiveHeadingPos = block.search(/^##\s+SONNET DIRECTIVE/m);
  const afterHeading = directiveHeadingPos >= 0 ? block.slice(directiveHeadingPos) : '';
  const nextSectionMatch = afterHeading.slice(afterHeading.indexOf('\n') + 1);
  const directiveBody = nextSectionMatch.split(/\n(?=##\s)/)[0].trim();
  if (directiveBody.length > 0) {
    const hasProtocolHeader = /^\[PROTOCOL:/m.test(directiveBody);
    const hasIdentityHandshake = /^Sonnet,\s*this\s*is\s*Opus\./m.test(directiveBody);
    const hasVerificationTail = /exit_code=0\s+before\s+committing/i.test(directiveBody);

    if (!hasProtocolHeader && !hasIdentityHandshake) {
      formatIssues++;
      turnHasProblem = true;
      console.warn(
        `${blockPrefix}: Turn ${turnLabel} directive missing Rule 2 format header.\n` +
        `  Required: "[PROTOCOL: PROTO-ID | STEP: N of M | MODE: x]" OR "Sonnet, this is Opus."\n` +
        `  Current directive body starts: "${directiveBody.slice(0, 80).replace(/\n/g, ' ')}"\n` +
        `  Ref: communication-protocol-shared.md RULE 2`
      );
    }

    if (!hasVerificationTail) {
      formatIssues++;
      turnHasProblem = true;
      console.warn(
        `${blockPrefix}: Turn ${turnLabel} directive missing verification tail.\n` +
        `  Required: "node tools/verify.mjs exit_code=0 before committing"\n` +
        `  Rule 2: Every directive ends with the verification tail.\n` +
        `  Ref: communication-protocol-shared.md RULE 2`
      );
    }
  }

  if (turnHasProblem && (isMostRecent || turnNum >= BLOCKING_FROM_TURN)) {
    blockingViolations++;
  }
}

console.log(`[validate-directive-has-rzf] turns_checked=${turnsChecked} directives=${directivesFound} missing_rzf=${missingRzf} wrong_order=${wrongOrder} format_issues=${formatIssues} blocking=${blockingViolations}`);

// BLOCKING for turns >= BLOCKING_FROM_TURN (96) or most recent turn — S042 promotion.
// Enforcement: new Opus directives (Turn 96+) must have RZF BEFORE directive text.
// Historical turns (< 96) remain ADVISORY; only forward-looking turns are blocked.
process.exit(blockingViolations > 0 ? 1 : 0);
