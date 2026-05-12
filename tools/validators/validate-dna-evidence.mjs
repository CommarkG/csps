#!/usr/bin/env node
/**
 * validate-dna-evidence.mjs — Verifies DNA application evidence exists per element
 *
 * ROOT CAUSE TARGETED: DNA gate confirms elements were "considered or N/A" — not that
 * they were applied. This is the gap between acknowledgment and evidence. A platform
 * whose DNA gates only check acknowledgment will drift without knowing it.
 *
 * What it checks:
 *   1. csps-platform-dna.md §6b section is present (application evidence table)
 *   2. Table has at least 15 rows (DNA elements with evidence)
 *   3. Each row has a non-empty evidence column (third |...|...|...|)
 *   4. Evidence references a specific validator, hook, or observable artifact
 *      (not just "manual" or "N/A")
 *
 * ADVISORY Phase 1 (S027) — reports gaps without blocking
 * BLOCKING Phase 2 (S028+) — after K=2 promotion
 *
 * Spec: csps-platform-dna.md §6b + dna-protocol-making-sure-that.md §5a
 * Audit slug: dna-evidence
 * PE=67 | S027 mandate
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const DNA_FILE = join(ROOT, 'docs/plan/pillar-0-governance/csps-platform-dna.md');

// Minimum number of DNA elements expected in §6b table
const MIN_ELEMENTS = 15;

// Evidence quality indicators — proof of SPECIFIC mechanical enforcement
const EVIDENCE_QUALITY_INDICATORS = [
  /validate-.*\.mjs/,           // specific validator
  /pnpm verify/,                 // verify run
  /exit[_\s]+0/i,               // exit code evidence
  /PASS/,                        // pass indicator
  /\.sh/,                        // hook
  /pre-tool-use|post-stop|post-tool-use/, // specific hook
];

// Weak evidence that doesn't prove application
const WEAK_EVIDENCE = [
  /^(N\/A|manual|none|TBD|todo|pending|not yet)$/i,
  /^-+$/,
  /\(PR review\)/i,
];

const advisories = [];
let tableFound = false;
let elementsChecked = 0;

if (!existsSync(DNA_FILE)) {
  console.log('[validate-dna-evidence] csps-platform-dna.md not found — skipping');
  console.log('[validate-dna-evidence] elements_checked=0 advisories=0');
  process.exit(0);
}

const content = readFileSync(DNA_FILE, 'utf8');

// Find §6b section
const sectionStart = content.indexOf('## §6b — Application evidence');
if (sectionStart < 0) {
  advisories.push({
    issue: '§6b Application evidence section MISSING from csps-platform-dna.md',
    suggestion: 'Add ## §6b — Application evidence per element section with evidence table for all 17 DNA elements.',
  });
} else {
  tableFound = true;

  // Extract the table from §6b to next ## section
  const sectionEnd = content.indexOf('\n## ', sectionStart + 1);
  const section = content.slice(sectionStart, sectionEnd > 0 ? sectionEnd : undefined);

  // Parse table rows: | # | DNA Element | Observable application evidence |
  const tableRows = section.split('\n')
    .filter(line => /^\|\s*\d+/.test(line)); // rows starting with | number

  elementsChecked = tableRows.length;

  if (tableRows.length < MIN_ELEMENTS) {
    advisories.push({
      issue: `§6b table has ${tableRows.length} rows but expected ≥ ${MIN_ELEMENTS} (one per DNA element).`,
      suggestion: `Add missing DNA element rows. Current count: ${tableRows.length}.`,
    });
  }

  // Check each row's evidence column
  for (const row of tableRows) {
    const cols = row.split('|').map(c => c.trim()).filter(c => c.length > 0);
    if (cols.length < 3) continue;

    const elementName = cols[1]; // DNA Element column
    const evidence = cols[2];    // Observable application evidence column

    // Skip separator rows
    if (/^[-:]+$/.test(evidence)) continue;

    // Check for empty or weak evidence
    if (!evidence || evidence === '') {
      advisories.push({
        element: elementName,
        issue: `DNA element "${elementName}": empty application_evidence`,
        suggestion: 'Add specific validator, hook, or observable artifact as evidence.',
      });
      continue;
    }

    const isWeak = WEAK_EVIDENCE.some(p => p.test(evidence.trim()));
    if (isWeak) {
      advisories.push({
        element: elementName,
        issue: `DNA element "${elementName}": weak evidence "${evidence.slice(0, 40)}"`,
        suggestion: 'Replace with specific validator (validate-X.mjs), hook (.sh), or pnpm verify output reference.',
      });
    }

    // Quality check — does it reference something specific?
    const hasQualityIndicator = EVIDENCE_QUALITY_INDICATORS.some(p => p.test(evidence));
    if (!hasQualityIndicator && !isWeak && evidence.length < 20) {
      advisories.push({
        element: elementName,
        issue: `DNA element "${elementName}": evidence "${evidence}" may be too vague — no validator/hook/command referenced`,
        suggestion: 'Reference a specific `validate-X.mjs` or hook that proves this element is applied.',
      });
    }
  }
}

// Output
if (advisories.length > 0) {
  advisories.forEach(a => {
    const label = a.element ? `[${a.element}]` : '';
    console.log(`  ⚠ [dna-evidence] ${label} ${a.issue}`);
  });
  console.log('[validate-dna-evidence] teaching_moment: "DNA gate that only checks acknowledgment will drift. Evidence = specific observable artifact proving the principle was applied this session."');
} else {
  console.log(`[validate-dna-evidence] §6b application evidence table present + ${elementsChecked} elements with non-trivial evidence ✓`);
}

console.log(`[validate-dna-evidence] section_found=${tableFound} elements_checked=${elementsChecked} advisories=${advisories.length}`);
process.exit(0); // advisory Phase 1
