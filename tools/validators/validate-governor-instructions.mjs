#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: GVRN
 * governing_principle: P-UX-001
 * behavioral_contract: B_ZERO_NAVIGATION_FOR_GOVERNOR
 * role: Scans sonnet-turn.md and opus-turn.md for navigation directives directed at the Governor
 * @csps-enforces P-UX-001
 */

// validate-governor-instructions.mjs
// T2 validator for B_ZERO_NAVIGATION_FOR_GOVERNOR
// Scans AI communication files for phrases that send the Governor to find content.
// ADVISORY (exits 0 always) — week-4 promotes to BLOCKING on repeated violations.

import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = process.cwd();

// Banned navigation patterns — phrases that send Governor to find content elsewhere
const BANNED_PATTERNS = [
  { pattern: /paste the prompt from (earlier|prior|my|the previous)/gi, label: 'paste-from-earlier' },
  { pattern: /paste the block (I shared|from earlier|from prior|from above)/gi, label: 'paste-block-from-earlier' },
  { pattern: /see above for the full/gi, label: 'see-above' },
  { pattern: /from (my |the )?prior response/gi, label: 'from-prior-response' },
  { pattern: /from (my |the )?(earlier|previous) (response|turn|message)/gi, label: 'from-earlier-response' },
  { pattern: /as I shared (earlier|above|before|previously)/gi, label: 'as-i-shared-earlier' },
  { pattern: /as presented earlier/gi, label: 'as-presented-earlier' },
  { pattern: /refer to the (prompt|block|content|text) (I|from|above|earlier)/gi, label: 'refer-to' },
  { pattern: /the prompt I provided/gi, label: 'the-prompt-i-provided' },
  { pattern: /earlier in this conversation/gi, label: 'earlier-in-conversation' },
  { pattern: /\(from (my |the )?prior response\)/gi, label: 'parenthetical-prior-response' },
];

const FILES_TO_SCAN = [
  'tools/council/sonnet-turn.md',
  'tools/council/opus-turn.md',
];

let totalViolations = 0;
const findings = [];

for (const relPath of FILES_TO_SCAN) {
  const filePath = path.join(ROOT, relPath);
  if (!existsSync(filePath)) continue;

  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (const { pattern, label } of BANNED_PATTERNS) {
    lines.forEach((line, i) => {
      if (pattern.test(line)) {
        findings.push({ file: relPath, line: i + 1, label, text: line.trim().substring(0, 100) });
        totalViolations++;
      }
      pattern.lastIndex = 0; // reset global regex
    });
  }
}

if (findings.length > 0) {
  console.error(`\n⚠ [validate-governor-instructions] ${findings.length} navigation directive(s) found:`);
  findings.forEach(f => {
    console.error(`  ⚠ ${f.file}:${f.line} [${f.label}]: "${f.text}"`);
  });
  console.error(`\n  RULE (B_ZERO_NAVIGATION_FOR_GOVERNOR — S040 CONSTITUTIONAL):`);
  console.error(`  Never send the Governor to find content. Every instruction is complete in-place.`);
  console.error(`  Full content must be in the SAME message, ready to copy, no scrolling required.`);
  console.error(`\n  ADVISORY: exits 0. Week-4 promotes to BLOCKING on repeated violations.\n`);
} else {
  console.log(`[validate-governor-instructions] PASS — no navigation directives found in AI communication files`);
}

// ADVISORY: always exits 0
process.exit(0);
