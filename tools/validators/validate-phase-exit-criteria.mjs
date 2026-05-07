#!/usr/bin/env node
/**
 * validate-phase-exit-criteria.mjs — FOUNDATION EXIT GATE
 *
 * ROOT CAUSE TARGETED (S015 major discovery):
 *   Phase 4 was marked COMPLETE in session-state + closing-summary, but Phase 3B
 *   had 2 unchecked exit criteria and Phase 4's master-roadmap exit criteria were
 *   ALL unchecked. The PE had no mechanical rule enforcing "core before application."
 *   Result: Phase 5 (app layer) opened on unvalidated infrastructure.
 *
 * RULE ENGRAVED (FOUNDATION_EXIT_GATE):
 *   Any "Exit Criteria" section in an active topic plan that contains BOTH
 *   checked [x] items AND unchecked [ ] items = mixed-state phase.
 *   Mixed-state = foundation gap. Phase advance from a mixed-state phase is blocked.
 *
 * What it checks:
 *   CHECK A — Mixed-state exit criteria: any "Exit Criteria" section in an active
 *             plan has [ ] items alongside [x] items. BLOCKING.
 *   CHECK B — Fully-unchecked exit criteria in plans that have been partially worked
 *             (plan has [x] items elsewhere but exit-criteria section is empty/all unchecked).
 *             WARN — may be an in-progress phase (expected).
 *
 * EXIT-CODED:
 *   0 = all active plans have clean exit criteria (no mixed-state)
 *   1 = mixed-state exit criteria found (BLOCKING — foundation not complete)
 *
 * ADVISORY → BLOCKING: immediately blocking per S015 FOUNDATION_EXIT_GATE ratification.
 * PE override: if FOUNDATION_EXIT_GATE blocks, PE score for the next phase = 0.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');

function extractFrontmatterField(text, field) {
  const m = text.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
}

/**
 * Parse the plan text into sections keyed by heading.
 * Returns array of { heading, lines } objects.
 */
function parseSections(text) {
  const lines = text.split('\n');
  const sections = [];
  let current = null;

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (headingMatch) {
      if (current) sections.push(current);
      current = { heading: headingMatch[2], level: headingMatch[1].length, lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

function isExitCriteriaSection(heading) {
  const lower = heading.toLowerCase();
  return (
    lower.includes('exit criteria') ||
    lower.includes('exit criterion') ||
    lower.includes('l4 gate') ||
    lower.includes('l3 gate') ||
    lower.includes('l2 gate') ||
    lower.includes('completion criteria') ||
    lower.includes('done criteria')
  );
}

async function main() {
  if (!existsSync(PLANS_DIR)) {
    console.log('[validate-phase-exit-criteria] no topic-plans dir; skipping');
    process.exit(0);
  }

  const files = readdirSync(PLANS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');
  const blocking = [];
  const warnings = [];
  let plansChecked = 0;
  let sectionsChecked = 0;
  let blockingSections = 0;

  for (const file of files) {
    const text = readFileSync(join(PLANS_DIR, file), 'utf8');
    const lifecycle = extractFrontmatterField(text, 'lifecycle_state');
    const name = extractFrontmatterField(text, 'name') ?? file;

    if (lifecycle !== 'active') continue;
    plansChecked++;

    const sections = parseSections(text);

    for (const section of sections) {
      if (!isExitCriteriaSection(section.heading)) continue;
      sectionsChecked++;

      const checked = section.lines.filter(l => l.trim().match(/^-\s+\[x\]/i)).length;
      const unchecked = section.lines.filter(l => l.trim().match(/^-\s+\[\s\]/)).length;

      if (checked > 0 && unchecked > 0) {
        // CHECK A — mixed state: phase was partially done but exit criteria not complete
        blockingSections++;
        blocking.push(
          `[CHECK A MIXED-STATE] ${name} § "${section.heading}": ` +
          `${checked} checked / ${unchecked} unchecked — FOUNDATION_EXIT_GATE triggered. ` +
          `Phase advance blocked until all exit criteria are checked OR explicitly deferred with reason.`
        );
        // List specific unchecked items (up to 5)
        const uncheckedItems = section.lines
          .filter(l => l.trim().match(/^-\s+\[\s\]/))
          .slice(0, 5)
          .map(l => `    → ${l.trim()}`);
        blocking.push(...uncheckedItems);
      } else if (checked === 0 && unchecked > 0) {
        // CHECK B — all unchecked: may be a future phase (warn only)
        warnings.push(
          `[CHECK B FUTURE-PHASE] ${name} § "${section.heading}": ` +
          `${unchecked} unchecked, 0 checked — likely a future phase (advisory).`
        );
      }
    }
  }

  if (blocking.length > 0) {
    console.error('\n⛔ FOUNDATION_EXIT_GATE VIOLATION — core infrastructure not complete:');
    for (const b of blocking) console.error(`  ${b}`);
    console.error('\nPer S015 FOUNDATION_EXIT_GATE: PE score for next phase = 0 until resolved.');
    console.error('Options: (a) complete the exit criterion, (b) explicitly defer with documented WHY.\n');
  }

  if (warnings.length > 0) {
    console.warn('\nAdvisory (future phases — expected):');
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
  }

  const status = blockingSections > 0 ? 'BLOCKING' : 'CLEAN';
  console.log(
    `\n[validate-phase-exit-criteria] plans_checked=${plansChecked} sections_checked=${sectionsChecked} ` +
    `blocking=${blockingSections} warnings=${warnings.length} status=${status}`
  );

  process.exit(blockingSections > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('[validate-phase-exit-criteria] fatal:', err);
  process.exit(1);
});
