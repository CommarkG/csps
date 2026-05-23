#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-platform-genome
 * @csps-name validate-platform-genome
 * @csps-description Platform Genome guardian validator. Checks that PLATFORM-GENOME.md
 * exists, has all 10 required sections, and each section has at least one link.
 * Advisory on missing sections or empty sections. BLOCKING if file missing entirely.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE
 * context_question: "Does PLATFORM-GENOME.md have all 10 sections with at least one link each — or is a section empty and therefore not a useful navigation node?"
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const GENOME_FILE = join(ROOT, 'docs/plan/pillar-0-governance/PLATFORM-GENOME.md');

const REQUIRED_SECTIONS = [
  '## 1.',
  '## 2.',
  '## 3.',
  '## 4.',
  '## 5.',
  '## 6.',
  '## 7.',
  '## 8.',
  '## 9.',
  '## 10.',
];

if (!existsSync(GENOME_FILE)) {
  console.error('[validate-platform-genome] BLOCKING: PLATFORM-GENOME.md not found');
  console.error('  docs/plan/pillar-0-governance/PLATFORM-GENOME.md is the authoritative index.');
  console.error('  Every tab needs this file to locate permanent platform knowledge.');
  process.exit(1);
}

const content = readFileSync(GENOME_FILE, 'utf-8');
const lines = content.split('\n');

let sectionsFound = 0;
let sectionsWithLinks = 0;
let advisory = 0;
const missing = [];

for (const sectionPrefix of REQUIRED_SECTIONS) {
  const sectionIdx = lines.findIndex(l => l.startsWith(sectionPrefix));
  if (sectionIdx === -1) {
    missing.push(sectionPrefix.trim());
    advisory++;
    continue;
  }
  sectionsFound++;

  // Check if section has at least one link (→ [...] or [link text])
  const nextSectionIdx = lines.findIndex((l, i) => i > sectionIdx && /^##\s+\d+\./.test(l));
  const sectionEnd = nextSectionIdx === -1 ? lines.length : nextSectionIdx;
  const sectionContent = lines.slice(sectionIdx, sectionEnd).join('\n');
  const hasLink = /→|\[.+\]\(.+\)|→\s+\[/.test(sectionContent);

  if (hasLink) {
    sectionsWithLinks++;
  } else {
    console.warn(`[validate-platform-genome] ADVISORY: section "${sectionPrefix.trim()}" has no links — add at least one →[file] link`);
    advisory++;
  }
}

if (missing.length > 0) {
  console.warn(`[validate-platform-genome] ADVISORY: missing sections: ${missing.join(', ')}`);
}

console.log(`[validate-platform-genome] sections_found=${sectionsFound}/10 sections_with_links=${sectionsWithLinks} advisory=${advisory} status=${advisory === 0 ? 'CLEAN' : 'ADVISORY'}`);
process.exit(0);
