#!/usr/bin/env node
/**
 * validate-generated-artifact-freshness.mjs — Checks generated artifacts are fresh
 *
 * ROOT CAUSE TARGETED: RP-004 — index artifacts must be generated, never manually maintained.
 * When an artifact declares `generated: true` + `generated_by: script.mjs`, the script
 * should have been run more recently than a session boundary. Stale generated artifacts
 * mislead navigation (the original problem: L3 frozen at S006 for 21 sessions).
 *
 * What it checks:
 *   1. Scans .claude/core-spines/ for L3_INSTANCES_*.md files (generated: true)
 *   2. Checks modification time of the generator script vs. the generated file
 *   3. If generator is NEWER than generated file by more than 24h: ADVISORY
 *      (generator updated but generated file not regenerated)
 *   4. Checks the generated file's "Generated:" timestamp against current date
 *      If the generated file is older than 7 days: ADVISORY
 *
 * ADVISORY Phase 1 — informs; does not block
 *
 * Audit slug: generated-artifact-freshness
 * Session B | Spec: RP-004 + ADR-0025
 */

import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const CORE_SPINES = join(ROOT, '.claude/core-spines');
const POPULATOR = join(ROOT, 'tools/scripts/instance-registry-populator.mjs');

const advisories = [];
let checked = 0;

if (!existsSync(CORE_SPINES)) {
  console.log('[validate-generated-artifact-freshness] .claude/core-spines/ not found — skipping');
  console.log('[validate-generated-artifact-freshness] checked=0 advisories=0');
  process.exit(0);
}

const l3Files = readdirSync(CORE_SPINES)
  .filter(f => f.startsWith('L3_INSTANCES_') && f.endsWith('.md'))
  .map(f => join(CORE_SPINES, f));

const generatorMtime = existsSync(POPULATOR) ? statSync(POPULATOR).mtimeMs : 0;
const now = Date.now();
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

for (const l3File of l3Files) {
  checked++;
  const content = readFileSync(l3File, 'utf8');

  // Check if this is a generated file
  const isGenerated = content.includes('generated: true');
  if (!isGenerated) {
    advisories.push({
      file: l3File.replace(ROOT, '').replace(/\\/g, '/').replace(/^\//, ''),
      issue: 'L3 instance file missing `generated: true` frontmatter field (RP-004)',
      suggestion: 'Run instance-registry-populator.mjs to regenerate with proper generated: true field',
    });
    continue;
  }

  // Check file mtime
  const fileMtime = statSync(l3File).mtimeMs;

  // Advisory if generator is newer than generated file by >24h
  const generatorNewerBy = generatorMtime - fileMtime;
  if (generatorMtime > 0 && generatorNewerBy > 24 * 60 * 60 * 1000) {
    advisories.push({
      file: l3File.replace(ROOT, '').replace(/\\/g, '/').replace(/^\//, ''),
      issue: `Generator is ${Math.round(generatorNewerBy / 3600000)}h newer than generated file`,
      suggestion: 'Run: node tools/scripts/instance-registry-populator.mjs',
    });
    continue;
  }

  // Advisory if file is older than 7 days
  const fileAge = now - fileMtime;
  if (fileAge > SEVEN_DAYS_MS) {
    advisories.push({
      file: l3File.replace(ROOT, '').replace(/\\/g, '/').replace(/^\//, ''),
      issue: `L3 generated file is ${Math.round(fileAge / 86400000)} days old (>7 day threshold)`,
      suggestion: 'Run: node tools/scripts/instance-registry-populator.mjs to refresh',
    });
  }
}

if (advisories.length > 0) {
  advisories.forEach(a => {
    console.log(`  ⚠ [generated-artifact-freshness] ${a.file}: ${a.issue}`);
    console.log(`     → ${a.suggestion}`);
  });
} else {
  console.log('[validate-generated-artifact-freshness] all generated artifacts are fresh ✓');
}

console.log(`[validate-generated-artifact-freshness] checked=${checked} advisories=${advisories.length}`);
process.exit(0);
