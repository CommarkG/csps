#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-handoff-completeness
 * @csps-name validate-handoff-completeness
 * @csps-description Handoff Completeness Gate: scans all HANDOFF-*.md files created or
 * modified in the last 90 days. Checks each for a ## ALIGNMENT QUESTIONS section with
 * at least 3 questions (lines starting with Q or **Q). ADVISORY if section missing.
 * Implements OPEN-020 / PI-019 — Governor directive S037-F (alignment questions mechanical).
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces P-META-014
 *
 * Coverage Levels:
 *   ✓ Checks: all HANDOFF-*.md files modified in last 90 days
 *   ✓ Detects: missing ## ALIGNMENT QUESTIONS section
 *   ✓ Detects: section present but fewer than 3 questions
 *   ✗ Does not check: question quality or context-specificity (advisory only)
 *   ✗ Does not check: HANDOFFs older than 90 days (grandfathered)
 *
 * Exit: 0 always (ADVISORY only)
 * Output: handoffs_checked=N missing_section=N insufficient_questions=N
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const HANDOFF_DIR = resolve(ROOT, 'docs/plan/_handoff');

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
const NOW = Date.now();

let handoffsChecked = 0;
let missingSection = 0;
let insufficientQuestions = 0;

if (!existsSync(HANDOFF_DIR)) {
  console.log(`[validate-handoff-completeness] handoff dir not found handoffs_checked=0 missing_section=0 insufficient_questions=0`);
  process.exit(0);
}

// Find all HANDOFF-*.md files (not in subdirectories)
const files = readdirSync(HANDOFF_DIR)
  .filter(f => /^HANDOFF-.*\.md$/.test(f))
  .map(f => ({ name: f, path: resolve(HANDOFF_DIR, f) }))
  .filter(({ path }) => {
    try {
      const mtime = statSync(path).mtimeMs;
      return (NOW - mtime) <= NINETY_DAYS_MS;
    } catch {
      return false;
    }
  });

handoffsChecked = files.length;

for (const { name, path } of files) {
  const content = readFileSync(path, 'utf-8');

  // Check for ## ALIGNMENT QUESTIONS section (case-insensitive)
  const hasSection = /^##\s+ALIGNMENT\s+QUESTIONS/mi.test(content);

  if (!hasSection) {
    missingSection++;
    console.warn(
      `[validate-handoff-completeness] ADVISORY: ${name} has no ## ALIGNMENT QUESTIONS section.\n` +
      `  File: docs/plan/_handoff/${name}\n` +
      `  Fix: add ## ALIGNMENT QUESTIONS section with 3-5 context-specific questions.\n` +
      `  Questions the receiving AI should answer before acting — not generic.\n` +
      `  Template:\n` +
      `    ## ALIGNMENT QUESTIONS (P-META-014 MUV)\n` +
      `    **Q1 — Completion verification:** [specific question about this session's state]\n` +
      `    **Q2 — Open items currency:** [specific question about what might be incomplete]\n` +
      `    **Q3 — First action:** [what should the receiving AI do first?]\n` +
      `  Rationale: P-META-014 MUV requires alignment check at every cross-boundary handoff.`
    );
    continue;
  }

  // Count questions in the ALIGNMENT QUESTIONS section
  // Find section start and end (next ## or end of file)
  const sectionMatch = content.match(/^##\s+ALIGNMENT\s+QUESTIONS.*?(?=\n##\s|\n---\s*$|$)/mis);
  if (!sectionMatch) continue;

  const sectionText = sectionMatch[0];
  // Count lines starting with **Q, Q1, Q2, etc. or - Q
  const questionLines = sectionText.split('\n').filter(line =>
    /^\s*(\*\*Q\d|Q\d|[-•]\s*Q\d|\d+\.)/.test(line.trim())
  );

  if (questionLines.length < 3) {
    insufficientQuestions++;
    console.warn(
      `[validate-handoff-completeness] ADVISORY: ${name} has ## ALIGNMENT QUESTIONS but only ${questionLines.length} question(s) (minimum 3).\n` +
      `  File: docs/plan/_handoff/${name}\n` +
      `  Fix: add at least 3 context-specific questions for the receiving AI.`
    );
  }
}

console.log(`[validate-handoff-completeness] handoffs_checked=${handoffsChecked} missing_section=${missingSection} insufficient_questions=${insufficientQuestions}`);
process.exit(0);
