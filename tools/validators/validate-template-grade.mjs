#!/usr/bin/env node
/**
 * validate-template-grade.mjs — Template Grade A/B/C/D enforcement (Phase 1 advisory)
 *
 * ROOT CAUSE TARGETED: templates were being "sealed" (K=2 → stable) without consistent
 * criteria. Opus Turn 9 ratified Grade A-D based on L1/L2/L3 layer doctrine.
 * A Grade A template (governs ALL platform apps) requires research_ref + full council.
 * Without this validator, Grade A templates can be sealed without proper oversight.
 *
 * What it checks:
 *   1. Templates in tools/templates/ that have template_grade: A must have research_ref:
 *   2. Templates with template_status: sealed must have template_grade declared
 *   3. Templates with template_status: novel-pending-pattern-evaluation should migrate to experimental
 *
 * Phase 1: ADVISORY (S026)
 * Phase 2: BLOCKING for Grade A without research_ref (S027 — after Governor ratification)
 *
 * Audit slug: template-grade
 * Opus Turn 9: "Grade A ratification triggers Level 2 consultation (Full Opus Advisory)"
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';

const ROOT = resolve(process.cwd());
const TEMPLATES_DIR = join(ROOT, 'tools/templates');
const REGISTRY = join(ROOT, 'docs/plan/_handoff/VAULT/template-registry.md');

const advisories = [];
let checked = 0;

// Check templates directory
if (existsSync(TEMPLATES_DIR)) {
  const files = readdirSync(TEMPLATES_DIR).filter(f =>
    ['.md', '.yaml', '.json', '.ts', '.tsx', '.mjs'].includes(extname(f))
  );

  for (const file of files) {
    const content = readFileSync(join(TEMPLATES_DIR, file), 'utf8');

    // Check for template_grade field
    const gradeMatch = content.match(/^template_grade:\s*(.+)$/m);
    const statusMatch = content.match(/^template_status:\s*(.+)$/m);
    const researchRefMatch = content.match(/^research_ref:/m);

    if (!gradeMatch) {
      // Template without grade declared — advisory to add one
      if (statusMatch && (statusMatch[1].trim() === 'stable' || statusMatch[1].trim() === 'sealed')) {
        advisories.push({
          file,
          issue: `has template_status: ${statusMatch[1].trim()} but no template_grade declared — assign A/B/C/D per Layer doctrine`,
        });
      }
    } else {
      checked++;
      const grade = gradeMatch[1].trim();

      // Grade A must have research_ref (Opus Turn 9 requirement)
      if (grade === 'A' && !researchRefMatch) {
        advisories.push({
          file,
          issue: `Grade A template missing research_ref: field — Grade A requires research + external AI consultation documented`,
        });
      }
    }

    // Migration advisory: novel-pending → experimental
    if (statusMatch && statusMatch[1].trim() === 'novel-pending-pattern-evaluation') {
      advisories.push({
        file,
        issue: `template_status: novel-pending-pattern-evaluation → migrate to experimental (Opus Turn 9 enum update)`,
      });
    }
  }
}

// Check template-registry.md for ungraded stable entries
if (existsSync(REGISTRY)) {
  const registryText = readFileSync(REGISTRY, 'utf8');
  // Count templates marked "stable" or "LIVE" without grade
  const stableWithoutGrade = [...registryText.matchAll(/\*\*LIVE[^*]*\*\*/g)].length;
  if (stableWithoutGrade > 0 && checked === 0) {
    advisories.push({
      file: 'template-registry.md',
      issue: `${stableWithoutGrade} LIVE templates in registry — assign template_grade per Opus Turn 9 retroactive grading (Turn 10)`,
    });
  }
}

if (advisories.length > 0) {
  advisories.slice(0, 8).forEach(a => console.log(`  ⚠ [template-grade] ${a.file}: ${a.issue}`));
  if (advisories.length > 8) console.log(`  ... and ${advisories.length - 8} more`);
  console.log(`[validate-template-grade] stage=advisory — Phase 2 (S027): Grade A without research_ref = BLOCKING`);
} else {
  console.log(`[validate-template-grade] all templates with explicit grades are compliant ✓`);
}

console.log(`[validate-template-grade] graded=${checked} advisories=${advisories.length}`);
process.exit(0); // advisory — Phase 2 promotes to blocking for Grade A
