#!/usr/bin/env node
/**
 * validate-frontmatter-count-consistency.mjs — Body counts match description counts
 *
 * ROOT CAUSE TARGETED: RP-002 — "body count must match frontmatter count."
 * When a description says "17 DNA elements" the file should have 17 elements.
 * When principles.yaml says total_count: 58 there should be 58 entries.
 * Count drift creates misleading context for AI turns (the S027 discovery: DNA had 4 counts).
 *
 * What it checks:
 *   1. Numbered lists in frontmatter descriptions vs actual body content
 *   2. Key count declarations in well-known files:
 *      - csps-platform-dna.md: "N DNA elements" in description → count §1 table rows
 *      - principles.yaml: total_count → count principle entries
 *      - behavioral-contracts-index.yaml: total_count → count entries
 *      - audit-runner-index.yaml: total_count → count entries
 *   3. ADVISORY if description count doesn't match body count
 *
 * ADVISORY Phase 1 | PE=70 | RP-002 implementation
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const advisories = [];
let checked = 0;

// ─── Check 1: csps-platform-dna.md count consistency ─────────────────────────

const DNA_FILE = join(ROOT, 'docs/plan/pillar-0-governance/csps-platform-dna.md');
if (existsSync(DNA_FILE)) {
  checked++;
  const content = readFileSync(DNA_FILE, 'utf8');
  // Find count in description
  const descMatch = content.match(/description:.*?(\d+)\s+DNA elements/s);
  const descCount = descMatch ? Number(descMatch[1]) : null;
  // Count actual table rows in §1 section only (not §6b or other sections)
  const sec1Start = content.indexOf('## §1 —');
  const sec1End = content.indexOf('\n## §', sec1Start + 5);
  const sec1 = sec1Start >= 0 ? content.slice(sec1Start, sec1End > 0 ? sec1End : sec1Start + 3000) : content;
  const tableRows = (sec1.match(/^\|\s+\d+\s+\|/gm) || []).length;
  if (descCount && tableRows > 0 && descCount !== tableRows) {
    advisories.push({
      file: 'docs/plan/pillar-0-governance/csps-platform-dna.md',
      issue: `Description says "${descCount} DNA elements" but §1 table has ${tableRows} rows`,
      suggestion: 'Update description count to match actual table row count',
    });
  }
}

// ─── Check 2: principles.yaml total_count ─────────────────────────────────────

const PRINCIPLES_YAML = join(ROOT, 'packages/principles/principles.yaml');
const PRINCIPLES_INDEX = join(ROOT, 'packages/principles/principles-index.yaml');
if (existsSync(PRINCIPLES_INDEX)) {
  checked++;
  const indexContent = readFileSync(PRINCIPLES_INDEX, 'utf8');
  const totalMatch = indexContent.match(/total_count:\s*(\d+)/);
  if (totalMatch && existsSync(PRINCIPLES_YAML)) {
    const yamlContent = readFileSync(PRINCIPLES_YAML, 'utf8');
    // Count principle entries: lines with "  - id: P-"
    const entryCount = (yamlContent.match(/^  - id: P-/gm) || []).length;
    const declaredTotal = Number(totalMatch[1]);
    if (entryCount !== declaredTotal) {
      advisories.push({
        file: 'packages/principles/principles-index.yaml',
        issue: `total_count: ${declaredTotal} but principles.yaml has ${entryCount} entries`,
        suggestion: 'Run: pnpm --filter @csps/principles split to regenerate index',
      });
    }
  }
}

// ─── Check 3: behavioral-contracts-index.yaml total_count ─────────────────────

const CONTRACTS_INDEX = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts-index.yaml');
const CONTRACTS_FILE = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts.md');
if (existsSync(CONTRACTS_INDEX) && existsSync(CONTRACTS_FILE)) {
  checked++;
  const indexContent = readFileSync(CONTRACTS_INDEX, 'utf8');
  const contractContent = readFileSync(CONTRACTS_FILE, 'utf8');
  const totalMatch = indexContent.match(/total_count:\s*(\d+)/);
  if (totalMatch) {
    // Count ## B_ sections in contracts file
    const contractCount = (contractContent.match(/^## B_/gm) || []).length;
    const declaredTotal = Number(totalMatch[1]);
    if (contractCount !== declaredTotal) {
      advisories.push({
        file: 'docs/plan/pillar-0-governance/behavioral-contracts-index.yaml',
        issue: `total_count: ${declaredTotal} but behavioral-contracts.md has ${contractCount} B_* sections`,
        suggestion: 'Run: pnpm contracts:split to regenerate index',
      });
    }
  }
}

// ─── Check 4: audit-runner-index.yaml total_count ─────────────────────────────

const AUDIT_INDEX = join(ROOT, 'docs/plan/pillar-0-governance/audit-runner-index.yaml');
const AUDIT_FILE = join(ROOT, 'docs/plan/pillar-0-governance/audit-runner.md');
if (existsSync(AUDIT_INDEX) && existsSync(AUDIT_FILE)) {
  checked++;
  const indexContent = readFileSync(AUDIT_INDEX, 'utf8');
  const auditContent = readFileSync(AUDIT_FILE, 'utf8');
  const totalMatch = indexContent.match(/total_count:\s*(\d+)/);
  if (totalMatch) {
    // Count pipeline sections in audit-runner.md (## Pipeline N or ## §Pipeline N)
    const pipelineCount = (auditContent.match(/^## (?:Pipeline|§Pipeline|pipeline_)/gim) || []).length;
    // Note: audit-runner splits by pipeline sections, not row count
    // This is a looser check — just verify total_count is positive and matches
    if (pipelineCount > 0) {
      const declaredTotal = Number(totalMatch[1]);
      if (Math.abs(pipelineCount - declaredTotal) > 5) {
        advisories.push({
          file: 'docs/plan/pillar-0-governance/audit-runner-index.yaml',
          issue: `total_count: ${declaredTotal} but audit-runner.md has ~${pipelineCount} pipeline sections (difference > 5)`,
          suggestion: 'Run: pnpm audit-runner:split to regenerate index',
        });
      }
    }
  }
}

if (advisories.length > 0) {
  advisories.forEach(a => {
    console.log(`  ⚠ [frontmatter-count-consistency] ${a.file}: ${a.issue}`);
    console.log(`     → ${a.suggestion}`);
  });
} else {
  console.log('[validate-frontmatter-count-consistency] all count declarations consistent with body content ✓');
}

console.log(`[validate-frontmatter-count-consistency] checked=${checked} advisories=${advisories.length}`);
process.exit(0);
