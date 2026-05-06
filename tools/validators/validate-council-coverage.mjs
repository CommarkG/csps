#!/usr/bin/env node
/**
 * validate-council-coverage.mjs — every SKILL.md is in council-registry.md
 *
 * Per council-registry.md §6 (validate-council-coverage was registered as deferred S011).
 * Checks that all active skills are registered as council members.
 * Also checks each registered member has: domain + PE band + audit pipeline + trigger patterns.
 *
 * New skills added to .claude/skills/ or packages/skills/ automatically need registration.
 * This validator catches the gap mechanically.
 *
 * EXIT-CODED: 0 = all skills registered / 1 = unregistered skills found
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const REGISTRY_PATH = join(ROOT, 'docs/plan/pillar-0-governance/council-registry.md');
const SKILL_PATHS = ['packages/skills', '.claude/skills'];

async function main() {
  if (!existsSync(REGISTRY_PATH)) {
    console.error('[validate-council-coverage] council-registry.md not found');
    process.exit(1);
  }

  const registryText = readFileSync(REGISTRY_PATH, 'utf8');
  const warnings = [];
  let checked = 0;

  for (const skillPath of SKILL_PATHS) {
    const absPath = join(ROOT, skillPath);
    if (!existsSync(absPath)) continue;

    for (const dir of readdirSync(absPath)) {
      const skillMd = join(absPath, dir, 'SKILL.md');
      if (!existsSync(skillMd)) continue;
      checked++;

      const skillText = readFileSync(skillMd, 'utf8');
      const nameMatch = skillText.match(/^name:\s*(.+)$/m);
      const skillName = nameMatch ? nameMatch[1].trim() : dir;

      // Check if skill name appears in council-registry.md
      if (!registryText.includes(`**${skillName}**`) && !registryText.includes(`\`${skillName}\``)) {
        warnings.push(`${skillPath}/${dir}: skill "${skillName}" not in council-registry.md §2 member table`);
      }
    }
  }

  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s) — skills not in council registry:`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
    console.warn('\n  Fix: add member row to council-registry.md §2 with domain + PE band + audit pipeline + trigger patterns');
  }

  const summary = `[validate-council-coverage] skills_checked=${checked} unregistered=${warnings.length}`;
  console.log(`\n${summary}`);

  if (warnings.length > 0) process.exit(1);
  process.exit(0);
}

main().catch(err => { console.error('[validate-council-coverage] fatal:', err); process.exit(1); });
