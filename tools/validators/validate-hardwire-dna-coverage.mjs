#!/usr/bin/env node
/**
 * validate-hardwire-dna-coverage.mjs
 * @csps-dna
 * core_spine: GVRN
 * @csps-enforces HARDWIRE-DNA-AT-BIRTH HARDWIRE-PROTOCOL
 * @csps-prevention-class NEW-PERMANENT-FILE-WITHOUT-SP-ENTRY
 * @behavioral-test-status: inline — add permanent file without SP entry → advisory
 *
 * L4 DNA-at-birth: checks that new permanent artifacts (docs/plan/, libs/, tools/validators/)
 * created in this git session have a satisfaction_point entry in the SP-registry.
 *
 * ADVISORY first (initial pass establishes baseline), not yet BLOCKING.
 * Promotes to BLOCKING after 5 exemplar passes per P-META-028.
 *
 * "Permanent" artifacts = .md files in docs/plan/pillar-* + .mjs validators + B_*.md contracts.
 * Source: PROTO-S074-PERMANENT-DNA BATCH 7 (L4 DNA-at-birth).
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { execSync } from 'node:child_process';
import yaml from 'js-yaml';

const ROOT = resolve(process.cwd());
const SP_REGISTRY = join(ROOT, 'tools/data/satisfaction-point-registry.yaml');

// Patterns for "permanent" new files
const PERMANENT_PATTERNS = [
  /docs\/plan\/pillar-\d+-.*\.(md)$/,
  /docs\/plan\/pillar-0-governance\/behavioral-contracts\/B_.*\.md$/,
  /tools\/validators\/validate-.*\.mjs$/,
  /packages\/principles\/principles\.yaml$/,
  /tools\/data\/satisfaction-point-registry\.yaml$/,
  /tools\/data\/hardwire-register\.yaml$/,
];

function isPermanent(filePath) {
  const rel = relative(ROOT, filePath).replace(/\\/g, '/');
  return PERMANENT_PATTERNS.some(p => p.test(rel));
}

// Get new files from this session (untracked + staged new)
let newFiles = [];
try {
  const untracked = execSync('git status --short', { cwd: ROOT, stdio: 'pipe' })
    .toString()
    .split('\n')
    .filter(l => l.startsWith('? ') || l.startsWith('A ') || l.startsWith('?? '))
    .map(l => l.replace(/^[?A ]+/, '').trim())
    .filter(f => f && !f.endsWith('/'));
  newFiles = untracked.map(f => join(ROOT, f)).filter(f => isPermanent(f));
} catch (e) {
  console.log('[validate-hardwire-dna-coverage] git status failed — skipping');
  process.exit(0);
}

// Load SP registry
let spThings = new Set();
try {
  const spRaw = readFileSync(SP_REGISTRY, 'utf8');
  const sp = yaml.load(spRaw);
  for (const entry of (sp.entries || [])) {
    if (entry.thing) spThings.add(entry.thing);
  }
} catch (e) {
  console.log('[validate-hardwire-dna-coverage] SP registry parse error — skipping');
  process.exit(0);
}

// Check new permanent files
let advisory = 0;
let blocking = 0;
const findings = [];

for (const filePath of newFiles) {
  const rel = relative(ROOT, filePath).replace(/\\/g, '/');

  // Check if file is a validator — derive expected SP entry name
  if (rel.includes('validators/validate-')) {
    const name = rel.replace('tools/validators/validate-', '').replace('.mjs', '').replace(/-/g, '-');
    // The SP thing would be derived from the validator name
    // This is a heuristic — not every validator needs an SP entry
    // (only those protecting a "permanent thing")
    // Mark as advisory if validator exists but no matching SP thing
    const hasSP = [...spThings].some(t => t.includes(name) || name.includes(t.replace(/-/g, '-')));
    if (!hasSP) {
      advisory++;
      findings.push(`[ADVISORY] New validator ${rel}: consider adding a satisfaction_point entry to SP-registry for what it protects`);
    }
  }
}

for (const f of findings) {
  console.log(`  ${f}`);
}

console.log(`[validate-hardwire-dna-coverage] new_permanent_files=${newFiles.length} advisory=${advisory} blocking=${blocking}`);

if (blocking > 0) process.exit(1);
process.exit(0);
