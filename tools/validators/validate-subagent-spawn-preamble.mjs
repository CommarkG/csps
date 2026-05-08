#!/usr/bin/env node
/**
 * validate-subagent-spawn-preamble.mjs — Subagent Spawn Preamble Gate
 *
 * ROOT CAUSE TARGETED (inner-ai-defaults/tooling-patterns.md — tooling-subagent-no-preamble):
 *   Training default: spawn Explore/Plan/general-purpose subagents without alignment preamble.
 *   CSPS override (B_AGENT_ALIGNMENT_PROTOCOL P-META-010): every Class B subagent spawn
 *   MUST include AAP preamble with B_AI_PROFESSIONAL_VOICE + B_VALIDATE_BEFORE_ASSUME acks
 *   + QG2 no-synthesis instruction + output contract.
 *
 * Coverage Levels:
 *   ✓ Level 1: Verify haiku-spawn-template.md and class-b-agent-spawn-preamble.template.md exist
 *   ✓ Level 2: Check that .claude/settings.json has pre-tool-use-skill-aap-required.sh registered
 *   ✗ Level 3: Verify live Agent() calls include preamble (requires transcript) → VLT-S021-SPAWN-TRANSCRIPT
 *   ✗ Level 4: Validate preamble quality (all 9 AAP checks present) → VLT-S021-SPAWN-QUALITY
 *
 * When this validator exits 0, it proves:
 *   - Spawn templates exist (haiku + class-B) — the infrastructure for enforcement is in place
 *   - AAP pre-tool-use hook is registered in settings.json
 * When this validator exits 0, it does NOT prove:
 *   - Live Agent() calls include the preamble (Level 3 — requires transcript)
 *
 * Exit: ADVISORY (0) always
 * Created: S021 per enforcement-rate-uplift topic-plan Track B B5
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const REQUIRED_TEMPLATES = [
  {
    path: 'tools/templates/haiku-spawn-template.md',
    required_field: 'haiku_scout_return',
    description: 'Haiku scout spawn template',
  },
  {
    path: 'tools/templates/class-b-agent-spawn-preamble.template.md',
    required_field: 'B_AI_PROFESSIONAL_VOICE',
    description: 'Class B agent spawn preamble template',
  },
];

const SETTINGS_PATH = join(ROOT, '.claude/settings.json');
const REQUIRED_HOOK = 'pre-tool-use-skill-aap-required';

async function main() {
  const findings = [];
  const passing = [];

  // CHECK A — spawn templates exist and contain required fields
  for (const tmpl of REQUIRED_TEMPLATES) {
    const fullPath = join(ROOT, tmpl.path);
    if (!existsSync(fullPath)) {
      findings.push(`Template MISSING: ${tmpl.path}`);
      continue;
    }
    const content = readFileSync(fullPath, 'utf8');
    if (!content.includes(tmpl.required_field)) {
      findings.push(`Template incomplete: ${tmpl.path} — missing required field '${tmpl.required_field}'`);
    } else {
      passing.push(`${tmpl.description}: present + field '${tmpl.required_field}' confirmed`);
    }
  }

  // CHECK B — AAP hook registered in settings.json
  if (existsSync(SETTINGS_PATH)) {
    const settings = readFileSync(SETTINGS_PATH, 'utf8');
    if (settings.includes(REQUIRED_HOOK)) {
      passing.push(`AAP pre-tool-use hook registered: ${REQUIRED_HOOK}.sh found in settings.json`);
    } else {
      findings.push(`AAP hook NOT registered in .claude/settings.json: ${REQUIRED_HOOK}.sh`);
    }
  } else {
    findings.push(`.claude/settings.json not found — cannot verify AAP hook registration`);
  }

  if (passing.length > 0) {
    console.log(`\nSubagent spawn infrastructure checks passing (${passing.length}):`);
    for (const p of passing) console.log(`  ✓ ${p}`);
  }

  if (findings.length > 0) {
    console.log(`\n⚠ SUBAGENT SPAWN PREAMBLE ADVISORY (${findings.length} gap(s)):`);
    for (const f of findings) console.log(`  ${f}`);
    console.log('\n  B_AGENT_ALIGNMENT_PROTOCOL: every Class B spawn must include AAP preamble.');
  }

  console.log(`\n[validate-subagent-spawn-preamble] checks=${REQUIRED_TEMPLATES.length + 1} passing=${passing.length} advisory_gaps=${findings.length} status=${findings.length > 0 ? 'ADVISORY' : 'CLEAN'}`);
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-subagent-spawn-preamble] fatal:', err);
  process.exit(1);
});
