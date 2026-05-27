#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-sonnet-checkpoint-relay
 * @csps-name validate-sonnet-checkpoint-relay
 * @csps-description C7 ASYMMETRIC_RELAY prevention validator.
 *   Scans tools/council/sonnet-turn.md for CHECKPOINT sections.
 *   Verifies each CHECKPOINT has: commit_sha, behavioral_tests pass count, ZF cycles
 *   with file citations (not nominal). ADVISORY if CHECKPOINT lacks these fields.
 *
 *   WHAT THIS PREVENTS: Sonnet writing CHECKPOINT to sonnet-turn.md file-only,
 *   without the full relay block visible to Governor/Opus. Symmetric relay requires:
 *   commit SHA + test results + ZF cycles with file citations per cycle.
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces C7_ASYMMETRIC_RELAY P-META-029 B_HUMBLE_CONSOLIDATION_DISCIPLINE
 * @csps-inherits-from validate-sonnet-checkpoint-relay (C7 PROTO-S067 APPENDIX A)
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const SONNET_TURN = resolve(ROOT, 'tools/council/sonnet-turn.md');

if (!existsSync(SONNET_TURN)) {
  console.log('[validate-sonnet-checkpoint-relay] sonnet-turn.md not found — skipping');
  process.exit(0);
}

const content = readFileSync(SONNET_TURN, 'utf8');

// Find CHECKPOINT sections
const checkpointSections = [];
const lines = content.split('\n');
let inCheckpoint = false;
let currentBlock = [];
let currentHeader = '';

for (const line of lines) {
  if (/^## .*CHECKPOINT/i.test(line)) {
    if (inCheckpoint && currentBlock.length > 0) {
      checkpointSections.push({ header: currentHeader, content: currentBlock.join('\n') });
    }
    inCheckpoint = true;
    currentHeader = line;
    currentBlock = [line];
  } else if (inCheckpoint) {
    if (/^---/.test(line) || /^## /.test(line)) {
      if (currentBlock.length > 1) {
        checkpointSections.push({ header: currentHeader, content: currentBlock.join('\n') });
      }
      inCheckpoint = /^## .*CHECKPOINT/i.test(line);
      currentBlock = inCheckpoint ? [line] : [];
      currentHeader = inCheckpoint ? line : '';
    } else {
      currentBlock.push(line);
    }
  }
}
if (inCheckpoint && currentBlock.length > 1) {
  checkpointSections.push({ header: currentHeader, content: currentBlock.join('\n') });
}

let advisory = 0;
const findings = [];

for (const cp of checkpointSections) {
  const c = cp.content;
  const header = cp.header.trim();

  // Check for commit_sha
  const hasCommitSha = /commit_sha:|commit:/.test(c);
  // Check for behavioral tests
  const hasTests = /behavioral.test|PASS|\/[0-9]/.test(c);
  // Check for ZF cycles with file citations (C4 format — must name files)
  const zfMatches = c.match(/ZF Cycle \d+/g) || [];
  const hasFileCitations = /tools\/|docs\/|\.claude\/|\.mjs|\.sh/.test(c);

  if (!hasCommitSha) {
    advisory++;
    findings.push(`  ADVISORY [C7] ${header}: missing commit_sha — CHECKPOINT may be asymmetric relay`);
  }
  if (!hasTests && zfMatches.length === 0) {
    advisory++;
    findings.push(`  ADVISORY [C7] ${header}: no behavioral test results or ZF cycles found`);
  }
  if (zfMatches.length > 0 && !hasFileCitations) {
    advisory++;
    findings.push(`  ADVISORY [C7] ${header}: ZF cycles present but no file citations found (C4 violation risk)`);
  }
}

for (const f of findings) console.log(f);

if (findings.length === 0) {
  console.log(`[validate-sonnet-checkpoint-relay] ✓ ${checkpointSections.length} CHECKPOINT(s) have symmetric relay fields`);
}

console.log(`[validate-sonnet-checkpoint-relay] checkpoints_checked=${checkpointSections.length} blocking=0 advisory=${advisory}`);
process.exit(0); // Advisory only S067
