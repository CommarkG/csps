#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-ai-honesty
 * @csps-name validate-ai-honesty
 * @csps-description T2 for B_NO_AI_IMPERSONATION. Scans council files and recent
 * AI output for impersonation patterns — phrases where a Sonnet-class model falsely
 * claims to be Opus, Governor, or a higher-authority model identity. These phrases
 * corrupt governance trust: the Governor must always know which model is speaking.
 * BLOCKING: banned phrases in top 100 lines of council/*.md (recent content).
 * ADVISORY: banned phrases in deeper historical content.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_NO_AI_IMPERSONATION P-META-010
 * context_question: "Does any council file contain a Sonnet model claiming to be Opus or Governor?"
 * Plan item: gap_T2_ORPHAN_CONTRACTS | S061
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const COUNCIL_DIR = join(ROOT, 'tools/council');
const RECENT_LINE_LIMIT = 100;

// Phrases that indicate impersonation when used in first-person AI output
const BANNED_PHRASES = [
  'i am opus',
  'as opus 4',
  'opus-quality',
  'i am the governor',
  'i am: governor',
  'i am claude-opus',
  'running as opus',
  'i am acting as opus',
];

// Files exempt from scanning (contain template examples, not actual AI claims)
// Add "// @ai-honesty-exempt" comment as first line of any council file to exempt it
const ALWAYS_EXEMPT_FILES = ['csps-context.md'];

/**
 * Returns true if the line should be skipped for impersonation checking.
 * Skips: table rows, filenames containing the phrase, quoted template examples.
 */
function isExemptLine(line) {
  const trimmed = line.trim();
  // Table rows: | ... | ... |
  if (trimmed.startsWith('|')) return true;
  // Filename references: word.md, word.mjs, word-spec.md etc.
  if (/\b[\w-]+(\.md|\.mjs|\.sh|\.ts|\.yaml)\b/i.test(trimmed)) {
    // If banned phrase only appears as part of a filename, it's not impersonation
    // e.g. "opus-quality-spec.md" — the phrase "opus-quality" is inside a filename
    const withoutFilenames = trimmed.replace(/\b[\w-]+(\.md|\.mjs|\.sh|\.ts|\.yaml)\b/gi, '');
    return !withoutFilenames.toLowerCase().match(/i am opus|opus-quality|i am the governor|i am claude-opus|running as opus|i am acting as opus|as opus 4/);
  }
  return false;
}

let blocking = 0;
let advisory = 0;
let files_checked = 0;

if (!existsSync(COUNCIL_DIR)) {
  console.log(`[validate-ai-honesty] council dir not found, skipping`);
  console.log(`[validate-ai-honesty] files_checked=0 blocking=0 advisory=0`);
  process.exit(0);
}

const entries = readdirSync(COUNCIL_DIR, { withFileTypes: true });
for (const entry of entries) {
  if (!entry.isFile() || !entry.name.endsWith('.md')) continue;

  // Check file-level exemption
  if (ALWAYS_EXEMPT_FILES.includes(entry.name)) {
    files_checked++;
    continue;
  }

  const filePath = join(COUNCIL_DIR, entry.name);
  const content = readFileSync(filePath, 'utf-8');

  // Check for inline exemption comment at top of file
  if (content.startsWith('<!-- @ai-honesty-exempt') || content.split('\n')[0].includes('@ai-honesty-exempt')) {
    files_checked++;
    continue;
  }

  files_checked++;
  const lines = content.split('\n');
  const recentLines = lines.slice(0, RECENT_LINE_LIMIT);
  const historicalLines = lines.slice(RECENT_LINE_LIMIT);

  for (let i = 0; i < recentLines.length; i++) {
    if (isExemptLine(recentLines[i])) continue;
    const lower = recentLines[i].toLowerCase();
    for (const phrase of BANNED_PHRASES) {
      if (lower.includes(phrase)) {
        console.error(`[validate-ai-honesty] BLOCKING: ${entry.name}:${i + 1} — impersonation phrase "${phrase}"`);
        console.error(`  Fix: AI must identify as its actual model. Remove or rewrite this claim.`);
        console.error(`  Context: ${recentLines[i].trim().slice(0, 100)}`);
        blocking++;
      }
    }
  }

  for (let i = 0; i < historicalLines.length; i++) {
    if (isExemptLine(historicalLines[i])) continue;
    const lower = historicalLines[i].toLowerCase();
    for (const phrase of BANNED_PHRASES) {
      if (lower.includes(phrase)) {
        advisory++;
        break;
      }
    }
  }
}

if (advisory > 0) {
  console.warn(`[validate-ai-honesty] ADVISORY: ${advisory} historical line(s) with impersonation phrases (pre-contract; backfill not required).`);
}

console.log(`[validate-ai-honesty] files_checked=${files_checked} blocking=${blocking} advisory=${advisory}`);
process.exit(blocking > 0 ? 1 : 0);
