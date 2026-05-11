#!/usr/bin/env node
// add-consolidation-section.mjs
// Adds §0 CONSOLIDATION CHECK section to all active topic-plans missing it.
// Safe: only adds section, never modifies existing content.

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());
const PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');

const CONSOLIDATION_SECTION = `
## §0 — CONSOLIDATION CHECK (mandatory — read before any implementation)

CHECK WHAT EXISTS before any implementation step in this plan.
- Search: tools/validators/ for existing validators covering this area
- Search: tools/generators/ for existing generators
- Search: .claude/hooks/ for existing hooks
- Search: docs/plan/pillar-0-governance/audit-runner.md for registered slugs
- Search: docs/plan/_handoff/VAULT/topic-plans/ for overlapping plans
- Search: libs/ for existing integrations and patterns

Consolidation finding: [update with findings when implementing each step]

`;

let added = 0;
let skipped = 0;
let notActive = 0;

for (const file of readdirSync(PLANS_DIR)) {
  if (!file.endsWith('.md') || file === 'README.md') continue;
  const fp = join(PLANS_DIR, file);
  const content = readFileSync(fp, 'utf8');

  // Only process active plans
  if (!content.includes('lifecycle_state: active')) { notActive++; continue; }

  // Skip if already has consolidation section
  if (content.includes('§0 — CONSOLIDATION CHECK') || content.includes('CHECK WHAT EXISTS')) {
    skipped++;
    continue;
  }

  // Find end of frontmatter (second ---)
  const fmEnd = content.indexOf('\n---', 3);
  if (fmEnd === -1) { skipped++; continue; }

  // Insert after frontmatter
  const before = content.slice(0, fmEnd + 4); // include the closing ---
  const after = content.slice(fmEnd + 4);
  const newContent = before + CONSOLIDATION_SECTION + after;

  writeFileSync(fp, newContent, 'utf8');
  console.log(`  ✓ Added §0 to: ${file}`);
  added++;
}

console.log(`\nDone: added=${added} skipped=${skipped} notActive=${notActive}`);
