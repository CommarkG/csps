#!/usr/bin/env node
// validate-file-naming.mjs — E3 session (S031)
// 5 ADVISORY naming convention rules per Turn 32 + Turn 36 spec.
// Reads tools/config/naming-exempt.yaml for grandfathered violations.
// All rules are ADVISORY — no blocking.
//
// R1: tools/validators/*.mjs → validate-[noun(s)]-[verb].mjs
// R2: docs/plan/_handoff/VAULT/opus-*.md → opus-[type]-[NNN]-[topic-kebab].md OR opus-[type]-S[NNN].md
// R3: docs/plan/_handoff/VAULT/topic-plans/*.md → [domain]-[topic-kebab]-plan.md
// R4: .claude/core-spines/*.md → [L0|L1|L2|L3]_[CORE|DOMAIN|INSTANCES]_[SPINE]*.md
// R5: packages/principles/principles/*.yaml → P-[ARCH|META|OP|OPER]-[NNN]-[topic-kebab].yaml

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, resolve, basename } from 'path';

const ROOT = resolve(process.cwd());

// Load exempt list (file-name keyed, not pattern-keyed)
function loadExemptions() {
  const path = join(ROOT, 'tools/config/naming-exempt.yaml');
  if (!existsSync(path)) return new Set();
  const text = readFileSync(path, 'utf8');
  const exempt = new Set();
  for (const line of text.split('\n')) {
    const m = line.match(/^  - (.+)$/);
    if (m) exempt.add(m[1].trim());
  }
  return exempt;
}

const EXEMPT = loadExemptions();
const advisories = [];

function check(rule, filePath, pattern, description) {
  const name = basename(filePath);
  if (EXEMPT.has(name)) return; // grandfathered
  if (!pattern.test(name)) {
    advisories.push({ rule, file: filePath, name, description });
  }
}

function listDir(relDir, ext) {
  const abs = join(ROOT, relDir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs, { withFileTypes: true })
    .filter(e => e.isFile() && e.name.endsWith(ext))
    .map(e => join(relDir, e.name));
}

// R1: tools/validators/*.mjs → validate-[noun(s)]-[verb].mjs
// Pattern: starts with validate-, ends with .mjs, at least 2 hyphens (noun + verb)
const R1_PATTERN = /^validate-[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*-[a-z][a-z0-9]*\.mjs$/;
for (const f of listDir('tools/validators', '.mjs')) {
  check('R1', f, R1_PATTERN, 'Validators must match validate-[noun(s)]-[verb].mjs');
}

// R2: VAULT/opus-*.md → opus-[type]-[NNN]-[topic].md OR opus-[type]-S[NNN].md
const R2_PATTERN = /^opus-[a-z][a-z0-9-]*(?:-[0-9]{3}-[a-z][a-z0-9-]*|-S[0-9]+)\.md$/;
for (const f of listDir('docs/plan/_handoff/VAULT', '.md')) {
  const name = basename(f);
  if (!name.startsWith('opus-')) continue;
  check('R2', f, R2_PATTERN, 'VAULT opus-*.md must match opus-[type]-[NNN]-[topic].md or opus-[type]-S[NNN].md');
}

// R3: topic-plans/*.md → [domain]-[topic-kebab]-plan.md
const R3_PATTERN = /^[a-z][a-z0-9-]+-plan\.md$/;
const topicPlanDir = 'docs/plan/_handoff/VAULT/topic-plans';
for (const f of listDir(topicPlanDir, '.md')) {
  const name = basename(f);
  if (name === 'README.md') continue; // README is always valid
  check('R3', f, R3_PATTERN, 'Topic plans must match [domain]-[topic-kebab]-plan.md');
}

// R4: .claude/core-spines/*.md → L[0-3]_[CORE|DOMAIN|INSTANCES]_[SPINE]*.md
const R4_PATTERN = /^L[0-3]_(?:CORE|DOMAIN|INSTANCES)_[A-Z][A-Z0-9_]*\.md$/;
for (const f of listDir('.claude/core-spines', '.md')) {
  check('R4', f, R4_PATTERN, 'Core spines must match [L0|L1|L2|L3]_[CORE|DOMAIN|INSTANCES]_[SPINE].md');
}

// R5: packages/principles/principles/*.yaml → P-[ARCH|META|OP|OPER]-[NNN]-[topic-kebab].yaml
const R5_PATTERN = /^P-(?:ARCH|META|OP|OPER)-[0-9]{3}-[a-z][a-z0-9-]*\.yaml$/;
for (const f of listDir('packages/principles/principles', '.yaml')) {
  check('R5', f, R5_PATTERN, 'Principle slices must match P-[ARCH|META|OP|OPER]-[NNN]-[topic-kebab].yaml');
}

// Output
const byRule = {};
for (const a of advisories) {
  if (!byRule[a.rule]) byRule[a.rule] = [];
  byRule[a.rule].push(a);
}

if (advisories.length === 0) {
  console.log('[validate-file-naming] ✓ All checked files match naming conventions');
} else {
  console.log(`[validate-file-naming] ${advisories.length} naming convention advisory(ies) (all exempt-able via tools/config/naming-exempt.yaml):`);
  for (const [rule, items] of Object.entries(byRule)) {
    console.log(`\n  ${rule} (${items.length}): ${items[0].description}`);
    for (const item of items.slice(0, 5)) {
      console.log(`    ⚠ ${item.name}`);
    }
    if (items.length > 5) console.log(`    ... and ${items.length - 5} more`);
  }
}
console.log(`\n[validate-file-naming] checked=${Object.values(byRule).reduce((s,a)=>s+a.length,0)+EXEMPT.size} advisory=${advisories.length} exempt=${EXEMPT.size}`);
process.exit(0); // ADVISORY only
