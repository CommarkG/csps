#!/usr/bin/env node
/**
 * PROTO-050 Step 3 — 20-skill backfill
 * Appends SKILL-BASE 6-section compliance block to all .claude/skills/SKILL.md files.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const SKILLS_DIR = join(ROOT, '.claude/skills');

let yaml;
try { yaml = require('js-yaml'); } catch(e) { console.error('js-yaml not available'); process.exit(1); }

const skills = readdirSync(SKILLS_DIR);
let updated = 0;

for (const skill of skills) {
  const skillPath = join(SKILLS_DIR, skill, 'SKILL.md');
  if (!existsSync(skillPath)) continue;

  const content = readFileSync(skillPath, 'utf-8');

  if (content.includes('## Identity (SKILL-BASE') || content.includes('## AAP Alignment') || content.includes('## Enforcement Trio')) {
    console.log('SKIP (already has sections):', skill);
    continue;
  }

  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) { console.log('SKIP (no frontmatter):', skill); continue; }

  // Regex extraction — avoids js-yaml failure on duplicate keys in SKILL.md frontmatter
  const fm = fmMatch[1];
  const get = (key) => { const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm')); return m ? m[1].trim() : ''; };
  const getList = (key) => {
    const block = fm.match(new RegExp(`${key}:[\\s\\S]*?(?=\\n\\S|$)`));
    if (!block) return [];
    return (block[0].match(/- (.+)/g) || []).map(l => l.replace('- ', '').trim());
  };

  const name = get('name') || skill;
  const description = get('description').replace(/^["']|["']$/g, '');
  const contracts = getList('acknowledged_contracts').join(', ') || 'B_AI_PROFESSIONAL_VOICE, B_VALIDATE_BEFORE_ASSUME';
  const scope = get('scope_level') || 'S1';
  const tier = get('trust_tier') || 'platform-owned';
  const backedBy = [get('backed_by_principle'), get('backed_by_contract')].filter(Boolean).join(' + ') || 'see frontmatter';
  const outputReturns = get('returns') || 'structured output';
  const roleDesc = description.split('.')[0] + '.';

  const outputLine = `returns: ${outputReturns} (see frontmatter output_contract)`;

  const sections = `

---

## Identity (SKILL-BASE compliance — S050)

- **Name:** ${name}
- **Role:** ${roleDesc}
- **Scope:** ${scope} | **Trust tier:** ${tier}

## AAP Alignment

- **B_AI_PROFESSIONAL_VOICE:** active — direct, evidence-based output, no sycophancy
- **B_VALIDATE_BEFORE_ASSUME:** active — every state claim cites tool output in current response
- **Additional contracts:** ${contracts}

## Input Contract

Trigger keywords defined in frontmatter description. Pre-condition: Governor/Sonnet task context loaded.

## Output Contract

${outputLine}

## ZF Requirement

Before any substantive output: name what is being examined, cite tool evidence, iterate until 0 new findings.
Exempt: trivial lookups with no actionable claims.

## Enforcement Trio

- **T1:** \`.claude/hooks/pre-tool-use-skill-aap-required.sh\` — validates AAP preamble before invocation
- **T2:** \`validate-aap-frontmatter.mjs\` — checks csps_aligned + acknowledged_contracts present
- **T3:** session-open.sh + AGENTS.md skill reference table
- **Backed by:** ${backedBy}
`;

  writeFileSync(skillPath, content + sections, 'utf-8');
  console.log('UPDATED:', skill);
  updated++;
}

console.log(`Done. Updated: ${updated} / ${skills.length} skills`);
