#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-handoff-completeness
 * @csps-name validate-handoff-completeness
 * @csps-description Handoff Completeness Gate: scans HANDOFF-*.md files in last 90 days.
 * Checks for 3 MANDATORY sections (BLOCKING) + 1 advisory section.
 *
 * MANDATORY (exit 1 if missing in any recent handoff):
 *   (A) Zone A or Session State — what was done
 *   (B) Zone B or Mandate — what next session must do
 *   (C) ## ALIGNMENT QUESTIONS — per P-META-014 MUV (3+ questions required)
 *
 * ADVISORY (exit 0, warn only):
 *   (D) ZF Evidence or Verification block
 *
 * Implements OPEN-020 / PI-019 — upgraded S040-PROTO-018 from ADVISORY to BLOCKING.
 * Governor directive S040 Turn 6: "inheritance policy — BLOCKING if mandatory sections missing."
 * @csps-version 2.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces P-META-014 B_INHERITANCE_POLICY B_HANDOFF_PRE_FLIGHT_AUDIT
 *
 * Exit: 1 if any recent handoff is missing a MANDATORY section
 * Exit: 0 if all mandatory sections present (advisory warnings still emitted)
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
let blocking = 0;
let advisory = 0;

const MANDATORY = [
  {
    id: 'zone-a',
    label: 'Zone A / Session State',
    patterns: [/^##\s+Zone\s+A/mi, /^##\s+(SESSION\s+STATE|WHAT\s+WAS\s+DONE|PLATFORM\s+STATE)/mi],
    message: 'Missing Zone A (session state — what was accomplished). Add "## Zone A — Platform State at S[NNN] Close" section.'
  },
  {
    id: 'zone-b',
    label: 'Zone B / Next Mandate',
    patterns: [/^##\s+Zone\s+B/mi, /^##\s+(MANDATE|NEXT\s+SESSION|S0\d\d\s+MANDATE)/mi],
    message: 'Missing Zone B (next session mandate). Add "## Zone B — S[NNN] Mandate" section.'
  },
  {
    id: 'alignment-questions',
    label: 'ALIGNMENT QUESTIONS (3+)',
    patterns: [/^##\s+ALIGNMENT\s+QUESTIONS/mi],
    message: 'Missing ## ALIGNMENT QUESTIONS section with 3+ questions. Required by P-META-014 MUV.'
  }
];

const ADVISORY_CHECKS = [
  {
    id: 'zf-evidence',
    label: 'ZF Evidence',
    patterns: [/ZF\s+(ACHIEVED|EVIDENCE|evidence|Cycle)/m, /pnpm verify.*exit_code/m, /exit_code.*0/m],
    message: 'No ZF/verification evidence found. Add "## ZF EVIDENCE" section with pnpm verify output.'
  }
];

if (!existsSync(HANDOFF_DIR)) {
  console.log(`[validate-handoff-completeness] handoff dir not found — skipping`);
  process.exit(0);
}

const files = readdirSync(HANDOFF_DIR)
  .filter(f => /^HANDOFF-.*\.md$/.test(f))
  .map(f => ({ name: f, path: resolve(HANDOFF_DIR, f) }))
  .filter(({ path }) => {
    try { return (NOW - statSync(path).mtimeMs) <= NINETY_DAYS_MS; }
    catch { return false; }
  });

handoffsChecked = files.length;

for (const { name, path } of files) {
  const content = readFileSync(path, 'utf-8');
  const fileBlocking = [];
  const fileAdvisory = [];

  // Grandfather pre-S037 HANDOFFs — Zone A/B and ALIGNMENT QUESTIONS not mandatory before S037
  const sessionMatch = name.match(/^HANDOFF-S(\d+)-to-/);
  const sessionNum = sessionMatch ? Number(sessionMatch[1]) : 999;
  const isLegacy = sessionNum < 37; // S001-S036 grandfathered (predated these requirements)

  // Check mandatory sections
  for (const check of MANDATORY) {
    const found = check.patterns.some(p => p.test(content));

    if (!found) {
      if (isLegacy) {
        advisory++;
      } else {
        fileBlocking.push(check.message);
        blocking++;
      }
    } else if (check.id === 'alignment-questions') {
      // Verify 3+ questions when section exists
      // Extract from ## ALIGNMENT QUESTIONS to end of section (next ## or end of file)
      const lines = content.split('\n');
      let inSection = false;
      let questionCount = 0;
      for (const line of lines) {
        if (/^##\s+ALIGNMENT\s+QUESTIONS/i.test(line)) { inSection = true; continue; }
        if (inSection && /^##\s/.test(line)) break; // next heading ends section
        if (inSection && /^\*\*Q\d|^Q\d[\s—:]|^[-•]\s*Q\d|\^\d+\./.test(line.trim())) {
          questionCount++;
        }
      }
      if (questionCount < 3) {
        const msg = `ALIGNMENT QUESTIONS has ${questionCount} question(s) — minimum 3 required.`;
        if (isLegacy) { advisory++; }
        else { fileBlocking.push(msg); blocking++; }
      }
    }
  }

  // Check advisory sections
  for (const check of ADVISORY_CHECKS) {
    if (!check.patterns.some(p => p.test(content))) {
      fileAdvisory.push(check.message);
      advisory++;
    }
  }

  if (fileBlocking.length > 0) {
    console.error(`[validate-handoff-completeness] BLOCKING: ${name} missing mandatory sections:`);
    fileBlocking.forEach(m => console.error(`  ✗ ${m}`));
  }
  if (fileAdvisory.length > 0) {
    fileAdvisory.forEach(m => console.warn(`[validate-handoff-completeness] ADVISORY: ${name}: ${m}`));
  }
  if (fileBlocking.length === 0 && fileAdvisory.length === 0) {
    console.log(`[validate-handoff-completeness] ✓ ${name} — all mandatory sections present`);
  }
}

console.log(`[validate-handoff-completeness] handoffs_checked=${handoffsChecked} blocking=${blocking} advisory=${advisory}`);
process.exit(blocking > 0 ? 1 : 0);
