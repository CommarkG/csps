#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-communication-quality
 * @csps-name validate-communication-quality
 * @csps-description Communication quality gate per communication-protocol-shared.md v2.
 * Reads tools/vault/wisdom/communication-samples.md (pattern library).
 * Checks communication templates in tools/templates/ for:
 *   BLOCKING: "I AM: Yariv Fink" or "I AM: [Governor]" in any non-startup template
 *             (SAMPLE 001: impersonating the Governor)
 *   ADVISORY: Communication relay templates missing FROM/TO format
 *             (communication-protocol-shared.md v2 simplified format)
 * Exit 0 always — advisory only for now. BLOCKING becomes exit 1 when Rule 16 enforcement enabled.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_ZERO_NAVIGATION_FOR_GOVERNOR
 * context_question: "Does any non-startup template claim 'I AM: Yariv Fink' — impersonating the Governor?"
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const TEMPLATES_DIR = join(ROOT, 'tools/templates');
const SAMPLES_FILE = join(ROOT, 'tools/vault/wisdom/communication-samples.md');

// Templates exempt from FROM/TO check (non-communication templates)
const FROM_TO_SCOPE = ['sonnet-report', 'opus-brief', 'chat-transfer', 'chat-jump-prompt'];

// Template exempt from governor impersonation check (startup block legitimately uses I AM: Governor)
const STARTUP_EXEMPT = ['sonnet-startup.template.md'];

// Patterns that indicate Governor impersonation in non-startup templates
const GOVERNOR_IMPERSONATION = /I AM:\s*(Yariv|Governor|Yariv Fink)/i;

// FROM/TO format pattern (simplified communication-protocol-shared.md v2)
const FROM_TO_PATTERN = /^FROM\s+\w/m;

let blocking = 0;
let advisory = 0;
let checked = 0;
let samplesLoaded = false;

if (existsSync(SAMPLES_FILE)) {
  samplesLoaded = true;
  console.log(`[validate-communication-quality] samples library loaded (${basename(SAMPLES_FILE)})`);
}

if (!existsSync(TEMPLATES_DIR)) {
  console.log(`[validate-communication-quality] templates dir not found — skipping`);
  console.log(`[validate-communication-quality] checked=0 blocking=0 advisory=0 status=ADVISORY`);
  process.exit(0);
}

const files = readdirSync(TEMPLATES_DIR)
  .filter(f => f.endsWith('.md') || f.endsWith('.yaml'));

for (const file of files) {
  const content = readFileSync(join(TEMPLATES_DIR, file), 'utf-8');
  checked++;

  // BLOCKING: Governor impersonation in non-startup templates
  if (!STARTUP_EXEMPT.includes(file) && GOVERNOR_IMPERSONATION.test(content)) {
    console.error(`[validate-communication-quality] BLOCKING: ${file} — contains "I AM: [Governor name]"`);
    console.error(`  SAMPLE 001: AI must not write as the Governor. Use FROM SONNET | FOR OPUS format.`);
    console.error(`  Remove "I AM: Yariv Fink" and replace with sender-explicit FROM/TO block.`);
    blocking++;
  }

  // ADVISORY: Communication relay templates missing FROM/TO format
  const slug = file.replace('.template.md', '').replace('.template.yaml', '');
  if (FROM_TO_SCOPE.some(s => slug.includes(s))) {
    if (!FROM_TO_PATTERN.test(content)) {
      console.warn(`[validate-communication-quality] ADVISORY: ${file} — communication template missing FROM/TO format`);
      console.warn(`  Expected: "FROM [SENDER] | FOR [RECEIVER] TAB" at start of paste block.`);
      console.warn(`  See communication-protocol-shared.md v2 simplified format.`);
      advisory++;
    }
  }
}

console.log(`[validate-communication-quality] checked=${checked} blocking=${blocking} advisory=${advisory} samples_loaded=${samplesLoaded} status=ADVISORY`);

// Exit 0 always (advisory phase). Rule 16 enforcement = blocking when enabled.
process.exit(0);
