#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-claimed-mechanical-presence
 * @csps-name validate-claimed-mechanical-presence
 * @csps-description C1 EXISTS_NOT_ACTIVE prevention validator.
 *   Scans moat-registry.md + audit-runner.md for validator references.
 *   For each claimed validator path, verifies the file actually exists on disk.
 *   ADVISORY: found files are present / BLOCKING: claimed validator doesn't exist.
 *
 *   WHAT THIS PREVENTS: Moat entries that cite "validate-X.mjs" as their
 *   enforcement mechanism when validate-X.mjs doesn't exist on disk.
 *   The M-19 phantom hook pattern — EXISTS in text, NOT ACTIVE on disk.
 *
 *   RULES (1 = BLOCKING, 2 = ADVISORY):
 *   (1) Any validator explicitly referenced in moat-registry.md backtick format
 *       that does not exist at the declared path → BLOCKING
 *   (2) Any validator in audit-runner.md marked LIVE that doesn't exist → BLOCKING
 *   Advisory: warnings for CSEP-pending moat entries (planned, not yet built)
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces C1_EXISTS_NOT_ACTIVE P-META-029 B_HUMBLE_CONSOLIDATION_DISCIPLINE
 * @csps-inherits-from validate-claimed-mechanical-presence (C1 PROTO-S067 APPENDIX A)
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const MOAT_REGISTRY = resolve(ROOT, 'docs/plan/pillar-0-governance/moat-registry.md');
const AUDIT_RUNNER = resolve(ROOT, 'docs/plan/pillar-0-governance/audit-runner.md');
const VALIDATORS_DIR = resolve(ROOT, 'tools/validators');
const HOOKS_DIR = resolve(ROOT, '.claude/hooks');
const SCRIPTS_DIR = resolve(ROOT, 'tools/scripts');

// Extract backtick-referenced validator filenames from markdown text
function extractValidatorRefs(content) {
  const refs = [];
  // Match `validate-*.mjs` patterns in backticks
  const validatorPattern = /`(validate-[a-z0-9-]+\.mjs)`/g;
  const hookPattern = /`((?:pre-|post-)[a-z0-9-]+\.sh)`/g;
  let m;
  while ((m = validatorPattern.exec(content)) !== null) refs.push({ name: m[1], type: 'validator' });
  while ((m = hookPattern.exec(content)) !== null) refs.push({ name: m[1], type: 'hook' });
  return refs;
}

function fileExistsAnywhere(name, type) {
  if (type === 'validator') {
    return existsSync(resolve(VALIDATORS_DIR, name));
  } else {
    return existsSync(resolve(HOOKS_DIR, name)) || existsSync(resolve(SCRIPTS_DIR, name));
  }
}

let blocking = 0;
let advisory = 0;
const findings = [];

// --- Scan moat-registry.md ---
if (existsSync(MOAT_REGISTRY)) {
  const content = readFileSync(MOAT_REGISTRY, 'utf8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes('| M-')) continue; // only table rows
    const isPending = line.includes('CSEP-pending') || line.includes('planned');
    const refs = extractValidatorRefs(line);

    for (const ref of refs) {
      if (!fileExistsAnywhere(ref.name, ref.type)) {
        if (isPending) {
          advisory++;
          findings.push(`  ADVISORY [C1] moat-registry.md: ${ref.name} planned/CSEP-pending — not yet on disk`);
        } else {
          blocking++;
          findings.push(`  BLOCKING [C1] moat-registry.md: ${ref.name} claimed as enforcement but NOT FOUND on disk`);
        }
      }
    }
  }
}

// --- Scan audit-runner.md for LIVE validators ---
if (existsSync(AUDIT_RUNNER)) {
  const content = readFileSync(AUDIT_RUNNER, 'utf8');
  const lines = content.split('\n');

  for (const line of lines) {
    if (!line.includes('LIVE') && !line.includes('ACTIVE')) continue;
    const refs = extractValidatorRefs(line);
    for (const ref of refs) {
      if (!fileExistsAnywhere(ref.name, ref.type)) {
        blocking++;
        findings.push(`  BLOCKING [C1] audit-runner.md LIVE row: ${ref.name} marked LIVE but NOT FOUND on disk`);
      }
    }
  }
}

// Output findings
for (const f of findings) console.log(f);

if (blocking === 0 && advisory === 0) {
  console.log('[validate-claimed-mechanical-presence] ✓ All claimed validators exist on disk');
}

if (blocking > 0) {
  console.error(`[validate-claimed-mechanical-presence] ✗ ${blocking} phantom validator(s) — EXISTS_NOT_ACTIVE (C1)`);
  console.error(`[validate-claimed-mechanical-presence] blocking=${blocking} advisory=${advisory}`);
  process.exit(1);
} else {
  if (advisory > 0) console.warn(`[validate-claimed-mechanical-presence] advisory=${advisory}`);
  console.log(`[validate-claimed-mechanical-presence] blocking=${blocking} advisory=${advisory}`);
  process.exit(0);
}
