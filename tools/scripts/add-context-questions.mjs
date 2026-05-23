#!/usr/bin/env node
/**
 * Batch-add guard-quality context_question to governed files missing it.
 * Run: node tools/scripts/add-context-questions.mjs
 * S056 — DOCUMENTATION-IN-SCHEMA coverage target: ≥150 files
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

function findFiles(dir, exts = ['.md', '.yaml']) {
  try {
    return readdirSync(dir).filter(f => exts.some(e => f.endsWith(e))).map(f => join(dir, f));
  } catch { return []; }
}

function getField(content, field) {
  const m = content.match(new RegExp(`^${field}:\\s*["']?([^"'\n]+)["']?`, 'm'));
  return m ? m[1].trim() : '';
}

function inferContextQuestion(filePath, content) {
  const fp = filePath.replace(/\\/g, '/');
  const name = getField(content, 'name') || basename(fp, extname(fp));

  if (fp.includes('docs/adr/')) {
    return `"Before relying on this decision: has the constraint that drove it changed? If platform needs have shifted, this ADR may need reassessment."`;
  }
  if (fp.includes('vault/ai-conception/')) {
    return `"Is this AI conception contract tested against a known violation (behavioral test exists)? T3-only enforcement = will drift without T1+T2 wiring."`;
  }
  if (fp.includes('behavioral-contracts/')) {
    return `"Is ${name} enforced with T1 (hook) + T2 (validator) + T3 (session-open)? T3-only = will drift by session N+2."`;
  }
  if (fp.includes('audit-runner/')) {
    return `"Does this audit pipeline slug have a matching active validator in pnpm verify, or is it registered but never running?"`;
  }
  if (fp.includes('pillar-0-governance/')) {
    return `"Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"`;
  }
  if (fp.includes('pillar-1-architecture')) {
    return `"Is the architecture decision described here still the ratified approach, or has a newer ADR superseded it?"`;
  }
  if (fp.includes('pillar-6-operations')) {
    return `"Before starting this operation: has it been validated in the current deployment environment, or only in dev?"`;
  }
  if (fp.includes('inner-ai-defaults/')) {
    return `"Is this AI default still the active training default, or has CSPS overridden it? Check enforcement_stage before assuming it is active."`;
  }
  if (fp.includes('topic-plans/')) {
    return `"What is the current depth level of this topic plan, and have all prior depth gates been verified clean before proceeding to the next level?"`;
  }
  return `"Before using this: what assumption must be verified to ensure this artifact reflects the current platform state?"`;
}

const DIRS = [
  join(ROOT, 'docs/plan/pillar-0-governance'),
  join(ROOT, 'docs/plan/pillar-1-architecture-and-stack'),
  join(ROOT, 'docs/plan/pillar-6-operations-and-delivery'),
  join(ROOT, 'docs/plan/_handoff/VAULT/inner-ai-defaults'),
  join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans'),
];

const files = DIRS.flatMap(d => findFiles(d)).filter(f => {
  try {
    const content = readFileSync(f, 'utf8');
    return content.startsWith('---') && !content.includes('context_question');
  } catch { return false; }
});

console.log(`Found ${files.length} files to update`);

let updated = 0;
let skipped = 0;

for (const filePath of files) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const secondDash = content.indexOf('\n---', 3);
    if (secondDash === -1) { skipped++; continue; }

    const cq = inferContextQuestion(filePath, content);
    const insertion = `\ncontext_question: ${cq}`;
    const newContent = content.slice(0, secondDash) + insertion + content.slice(secondDash);
    writeFileSync(filePath, newContent, 'utf8');
    updated++;
  } catch (e) {
    console.error('ERROR', filePath, String(e));
    skipped++;
  }
}

console.log(`[add-context-questions] updated=${updated} skipped=${skipped}`);
