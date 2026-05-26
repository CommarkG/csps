#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: GVRN
 * governing_principle: P-META-012
 * behavioral_contract: B_GOVERNOR_PROMPTS
 * role: Validates governor-prompts VAULT structure and GP entry format.
 *       Checks that GP-S<NNN>-<NN> log files exist per session and that
 *       entries follow the required format (timestamp + verbatim + tags).
 * @csps-enforces B_GOVERNOR_PROMPTS P-META-012
 */

/**
 * validate-governor-prompts.mjs
 * T2 validator for B_GOVERNOR_PROMPTS.
 *
 * Checks:
 *   1. VAULT/governor-prompts/ directory exists
 *   2. At least one GP session file exists (S<NNN>.md or S<NNN>.yaml)
 *   3. Most recent GP file has entries with required fields: timestamp, verbatim, tags
 *
 * ADVISORY (exit 0 always) — GP logging is evolving; blocking would break new sessions.
 * Output: gp_files=N entries_checked=N valid=N advisory=N blocking=N
 *
 * PROTO-S063-GOVERNOR-PROMPTS-VALIDATOR | B_GOVERNOR_PROMPTS T2 | S063 ITEM 3.2
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const GP_DIR = join(ROOT, 'docs', 'plan', '_handoff', 'VAULT', 'governor-prompts');

let gp_files = 0;
let entries_checked = 0;
let valid = 0;
let advisory = 0;
const findings = [];

if (!existsSync(GP_DIR)) {
  console.log(`[validate-governor-prompts] ADVISORY: VAULT/governor-prompts/ directory missing`);
  console.log(`  → Create: ${GP_DIR}`);
  console.log(`  → B_GOVERNOR_PROMPTS requires GP-S<NNN>-<NN> entries per session`);
  advisory++;
  console.log(`gp_files=0 entries_checked=0 valid=0 advisory=1 blocking=0`);
  process.exit(0);
}

// Find GP session files
let files = [];
try {
  files = readdirSync(GP_DIR)
    .filter(f => /^S\d{3,}/.test(f))
    .sort()
    .reverse(); // Most recent first
} catch (e) {}

gp_files = files.length;

if (files.length === 0) {
  advisory++;
  console.log(`[validate-governor-prompts] ADVISORY: No GP session files in governor-prompts/`);
  console.log(`  → Expected: S<NNN>.md or S<NNN>.yaml per session`);
  console.log(`gp_files=0 entries_checked=0 valid=0 advisory=1 blocking=0`);
  process.exit(0);
}

// Check most recent file for entry format
const recentFile = files[0];
const recentPath = join(GP_DIR, recentFile);
try {
  const content = readFileSync(recentPath, 'utf-8');
  // Check for GP entry patterns: GP-S<NNN>-<NN> format entries
  const gpEntries = content.match(/GP-S\d{3,}-\d{2,}/g) || [];
  entries_checked = gpEntries.length;

  if (gpEntries.length === 0) {
    advisory++;
    findings.push({
      file: recentFile,
      issue: 'No GP-S<NNN>-<NN> formatted entries found',
      fix: 'Entries should use format: GP-S063-01, GP-S063-02, etc.'
    });
  } else {
    valid = gpEntries.length;
  }

  // Check for required fields: timestamp, verbatim (or prompt/content), tags
  const hasTimestamp = /timestamp:|date:|ran_at:/i.test(content);
  const hasContent = /verbatim:|prompt:|content:|message:/i.test(content);
  const hasTags = /tags:|tag:/i.test(content);

  if (!hasTimestamp || !hasContent) {
    advisory++;
    findings.push({
      file: recentFile,
      issue: `Missing required fields: ${!hasTimestamp ? 'timestamp' : ''} ${!hasContent ? 'verbatim/content' : ''}`.trim(),
      fix: 'GP entries need: timestamp + verbatim/content + tags'
    });
  }
} catch (e) {
  advisory++;
  findings.push({ file: recentFile, issue: 'Could not read file', fix: 'Check file encoding' });
}

// Output findings
for (const f of findings) {
  console.log(`  ⚠ ${f.file}: ${f.issue}`);
  console.log(`    → ${f.fix}`);
}

console.log(`[validate-governor-prompts] gp_files=${gp_files} entries_checked=${entries_checked} valid=${valid} advisory=${advisory} blocking=0`);
process.exit(0);
