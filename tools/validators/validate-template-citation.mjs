#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: GVRN
 * governing_principle: P-META-015
 * behavioral_contract: B_TEMPLATE_FIRST_CREATION
 * role: Validates that new governance artifacts cite their template source.
 *       Checks HANDOFF files and PROTO files for template_used or
 *       parent_template frontmatter fields. Advisory — promotes adoption.
 * @csps-enforces B_TEMPLATE_FIRST_CREATION P-META-015
 */

/**
 * validate-template-citation.mjs
 * T2 validator for B_TEMPLATE_FIRST_CREATION.
 *
 * Checks that key governance artifact types declare their template source:
 *   - HANDOFF files: should reference a handoff template
 *   - PROTO files: should reference a proto template
 *   - Skill files: should reference a skill template
 *
 * ADVISORY (exit 0 always) — template citation is aspirational; many existing
 * artifacts predate this requirement.
 *
 * Output: artifacts_checked=N with_citation=N missing_citation=N advisory=N blocking=N
 *
 * PROTO-S063-TEMPLATE-CITATION-VALIDATOR | B_TEMPLATE_FIRST_CREATION T2 | S063 ITEM 3.3
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();

// Artifact types to check and their locations
const CHECKS = [
  { dir: join(ROOT, 'docs', 'plan', 'protos'), pattern: /^PROTO-S\d+/, label: 'proto' },
  { dir: join(ROOT, 'docs', 'plan', '_handoff'), pattern: /^HANDOFF-S\d+/, label: 'handoff' },
];

let artifacts_checked = 0;
let with_citation = 0;
let missing_citation = 0;
let advisory = 0;
const findings = [];

// Template citation fields to look for in frontmatter
const CITATION_FIELDS = /parent_template:|template_used:|template_grade:|based_on_template:/i;

for (const check of CHECKS) {
  if (!existsSync(check.dir)) continue;

  let files = [];
  try {
    files = readdirSync(check.dir)
      .filter(f => check.pattern.test(f) && f.endsWith('.md'))
      .slice(0, 20); // Check most recent 20 per type
  } catch (e) { continue; }

  for (const file of files) {
    artifacts_checked++;
    try {
      const content = readFileSync(join(check.dir, file), 'utf-8');
      // Check for frontmatter
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!fmMatch) continue;

      if (CITATION_FIELDS.test(fmMatch[1])) {
        with_citation++;
      } else {
        missing_citation++;
        // Only flag recent files (those referencing S060+)
        if (/S06[2-9]|S07|S08|S09/.test(file)) {
          advisory++;
          findings.push({
            file,
            type: check.label,
            fix: `Add template_used: <template-name> to frontmatter per B_TEMPLATE_FIRST_CREATION`
          });
        }
      }
    } catch (e) { continue; }
  }
}

// Output findings (cap at 5 for readability)
for (const f of findings.slice(0, 5)) {
  console.log(`  ⚠ ${f.file} (${f.type}): no template citation`);
  console.log(`    → ${f.fix}`);
}
if (findings.length > 5) {
  console.log(`  ... and ${findings.length - 5} more`);
}

console.log(`[validate-template-citation] artifacts_checked=${artifacts_checked} with_citation=${with_citation} missing_citation=${missing_citation} advisory=${advisory} blocking=0`);
process.exit(0);
