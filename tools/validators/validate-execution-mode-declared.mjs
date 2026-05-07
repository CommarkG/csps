#!/usr/bin/env node
/**
 * validate-execution-mode-declared.mjs — execution_mode frontmatter gate
 *
 * ROOT CAUSE TARGETED (plan-methodology-v2 L3):
 *   Plans without execution_mode run in whatever mode the AI defaults to.
 *   After S015, every gradual-build-plan declares: velocity | balanced | deep_quality.
 *   Absence = implicit mode = the AI chooses without accountability.
 *   Declaration = explicit = the Governor ratified the build approach.
 *
 * What it checks:
 *   For every active topic plan using template_used: gradual-build-plan:
 *   CHECK A — execution_mode field present in frontmatter
 *   CHECK B — value is one of: velocity | balanced | deep_quality
 *
 *   GRANDFATHERED: Plans written before S015 without alignment_verified_session
 *   are WARN-only. Plans reviewed (alignment_verified_session: S016+) and still
 *   missing execution_mode = more urgent WARN.
 *
 * EXIT-CODED: 0 (advisory) — same pattern as plan-harvest-coverage
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');
const VALID_MODES = new Set(['velocity', 'balanced', 'deep_quality']);

function extractFrontmatterField(text, field) {
  const m = text.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
}

async function main() {
  if (!existsSync(PLANS_DIR)) {
    console.log('[validate-execution-mode-declared] no topic-plans dir; skipping');
    process.exit(0);
  }

  const files = readdirSync(PLANS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');
  const warnings = [];
  let plansChecked = 0;
  let plansMissingMode = 0;

  for (const file of files) {
    const text = readFileSync(join(PLANS_DIR, file), 'utf8');
    const lifecycle = extractFrontmatterField(text, 'lifecycle_state');
    if (lifecycle !== 'active') continue;

    const templateUsed = extractFrontmatterField(text, 'template_used');
    if (templateUsed !== 'gradual-build-plan') continue;

    plansChecked++;
    const name = extractFrontmatterField(text, 'name') ?? file;
    const execMode = extractFrontmatterField(text, 'execution_mode');
    const alignmentVerified = extractFrontmatterField(text, 'alignment_verified_session');
    const writtenSession = extractFrontmatterField(text, 'session') ?? 'S000';

    if (!execMode) {
      plansMissingMode++;
      const urgency = alignmentVerified ? 'URGENT' : 'WARN';
      warnings.push(
        `[${urgency}] ${name}: missing execution_mode. ` +
        `Session: ${writtenSession}, alignment: ${alignmentVerified ?? 'never reviewed'}. ` +
        `Add: execution_mode: velocity | balanced | deep_quality`
      );
    } else if (!VALID_MODES.has(execMode)) {
      warnings.push(`[WARN] ${name}: execution_mode="${execMode}" — not a valid value. Expected: velocity | balanced | deep_quality`);
    }
  }

  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} plan(s) missing or invalid execution_mode:`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
    console.warn('\nAdd execution_mode: velocity | balanced | deep_quality to frontmatter.\n');
  }

  console.log(`[validate-execution-mode-declared] plans_checked=${plansChecked} missing_mode=${plansMissingMode} warnings=${warnings.length}`);
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-execution-mode-declared] fatal:', err);
  process.exit(1);
});
