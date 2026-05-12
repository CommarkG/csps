#!/usr/bin/env node
/**
 * validate-spine-hierarchy.mjs — L3 instances cannot contradict L1 sealed definitions
 *
 * ROOT CAUSE TARGETED: Opus Turn 16 B.6 Q3 — "What's the test for 'contradicts' vs
 * 'more specific'? A L3 instance contradicts L1 when it changes the outcome for shared scope.
 * More specific = restricts application scope without changing the outcome."
 *
 * What it checks (Phase 1 — structural violations):
 *   1. L3 instance files declare `parent_l1_doctrine:` → validates file exists
 *   2. L1 files have `sealed_text_only: true` and `classification: SEALED`
 *   3. L2 files have `parent_l1_doctrine:` + `domain:` fields
 *   4. No L1 file has example blocks (//Example:), cross-references (see also), or decomposition headers
 *   5. All core_spine: values are in the canonical set (GVRN/ARCH/AI/OPER/VALD)
 *
 * Phase 2 (S029): semantic contradiction detection (requires Opus L1 constitutional review)
 *
 * Audit slug: spine-hierarchy
 * PE=67 | S028 master plan + spine-graduation-principle.md
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';

const ROOT = resolve(process.cwd());
const CORE_SPINES = join(ROOT, '.claude/core-spines');
const CANONICAL_SPINES = new Set(['GVRN', 'ARCH', 'AI', 'OPER', 'VALD']);

const blocking = [];
const advisories = [];
let checked = 0;

if (!existsSync(CORE_SPINES)) {
  console.log('[validate-spine-hierarchy] .claude/core-spines/ not found — skipping');
  process.exit(0);
}

const files = readdirSync(CORE_SPINES).filter(f => f.endsWith('.md'));

for (const filename of files) {
  const fullPath = join(CORE_SPINES, filename);
  const content = readFileSync(fullPath, 'utf8');
  const relPath = filename;
  checked++;

  const fmEnd = content.indexOf('\n---', 3);
  const frontmatter = fmEnd >= 0 ? content.slice(0, fmEnd) : content;
  const body = fmEnd >= 0 ? content.slice(fmEnd) : '';

  // Check core_spine value is canonical
  const spineMatch = frontmatter.match(/^core_spine:\s*(.+)$/m);
  if (spineMatch && !CANONICAL_SPINES.has(spineMatch[1].trim())) {
    blocking.push({ file: relPath, issue: `core_spine: "${spineMatch[1].trim()}" not in canonical set (GVRN/ARCH/AI/OPER/VALD)` });
  }

  // L1 file checks
  if (filename.startsWith('L1_CORE_')) {
    if (!frontmatter.includes('classification: SEALED')) {
      blocking.push({ file: relPath, issue: 'L1 file missing classification: SEALED' });
    }
    if (!frontmatter.includes('sealed_text_only: true')) {
      blocking.push({ file: relPath, issue: 'L1 file missing sealed_text_only: true' });
    }
    // Check for do_not_expand violations in body
    const doNotExpand = ['cross-reference', 'see also', '## Example', 'For example', '### Example'];
    for (const forbidden of doNotExpand) {
      if (body.toLowerCase().includes(forbidden.toLowerCase())) {
        advisories.push({ file: relPath, issue: `L1 sealed file contains "${forbidden}" — do_not_expand violation` });
      }
    }
  }

  // L2 file checks
  if (filename.startsWith('L2_DOMAIN_')) {
    if (!frontmatter.includes('parent_l1_doctrine:')) {
      blocking.push({ file: relPath, issue: 'L2 domain file missing parent_l1_doctrine: field' });
    }
    if (!frontmatter.includes('domain:')) {
      blocking.push({ file: relPath, issue: 'L2 domain file missing domain: field' });
    }
    // Validate parent_l1_doctrine resolves
    const parentMatch = frontmatter.match(/^parent_l1_doctrine:\s*(.+)$/m);
    if (parentMatch) {
      const parentPath = join(CORE_SPINES, parentMatch[1].trim().replace('./', ''));
      if (!existsSync(parentPath)) {
        blocking.push({ file: relPath, issue: `parent_l1_doctrine: "${parentMatch[1].trim()}" does not exist` });
      }
    }
  }

  // L3 file checks
  if (filename.startsWith('L3_INSTANCES_')) {
    if (!frontmatter.includes('parent_l1_doctrine:')) {
      blocking.push({ file: relPath, issue: 'L3 instance file missing parent_l1_doctrine: field' });
    }
    // Validate parent_l1_doctrine resolves
    const parentMatch = frontmatter.match(/^parent_l1_doctrine:\s*(.+)$/m);
    if (parentMatch) {
      const parentPath = join(CORE_SPINES, parentMatch[1].trim().replace('./', ''));
      if (!existsSync(parentPath)) {
        blocking.push({ file: relPath, issue: `parent_l1_doctrine: "${parentMatch[1].trim()}" does not exist` });
      }
    }
  }
}

if (blocking.length > 0) {
  console.error(`⛔ [spine-hierarchy] ${blocking.length} structural violation(s):`);
  blocking.forEach(b => console.error(`  ⛔ ${b.file}: ${b.issue}`));
}
if (advisories.length > 0) {
  advisories.forEach(a => console.log(`  ⚠ [spine-hierarchy] ${a.file}: ${a.issue}`));
}
if (blocking.length === 0 && advisories.length === 0) {
  console.log('[validate-spine-hierarchy] all spine hierarchy rules satisfied ✓');
}

console.log(`[validate-spine-hierarchy] checked=${checked} blocking=${blocking.length} advisories=${advisories.length}`);
process.exit(blocking.length > 0 ? 1 : 0);
