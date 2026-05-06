#!/usr/bin/env node
/**
 * validate-instruction-context.mjs — instruction context quality gate
 *
 * ROOT CAUSE TARGETED: Instructions without WHY reasoning produce rule-followers
 * that patch instances instead of understanding concepts. When an AI sees
 * "B_FOO: never do X" without understanding WHY, it finds workarounds. When it
 * understands "B_FOO prevents the plan-promise-abandonment pattern that orphaned
 * 3 sessions" — it treats it as a compass, not a constraint.
 *
 * What it checks (3 surfaces):
 *
 * SURFACE A — Behavioral contracts (.md slices in behavioral-contracts/):
 *   Checks for WHY indicators: "prevents", "root cause", "pattern", structural
 *   failure vocabulary. Flags contracts with only WHAT but no WHY.
 *
 * SURFACE B — principles.yaml entries:
 *   Checks industry_lineage is populated + cross_references present.
 *   These ARE the WHY for principles. Missing = principle without context.
 *
 * SURFACE C — Hook scripts (.claude/hooks/*.sh):
 *   Checks @csps-description is substantive (>80 chars) and contains
 *   WHY vocabulary ("prevents", "per P-META", "root cause", "enforces").
 *   Short descriptions = missing context.
 *
 * EXIT-CODED: 0 always (advisory). Findings surfaced as warnings.
 * Promotes to error at week-4 when enforcement matures.
 *
 * Registered: instruction-context-quality (audit-runner.md)
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const WHY_INDICATORS = [
  'prevents', 'root cause', 'root-cause', 'pattern', 'incident',
  'failure mode', 'failure-mode', 'structural', 'anti-pattern',
  'per p-meta', 'per b_', 'why', 'because', 'drift', 'orphan',
  'compounding', 'cascading', 'source:', 'why this',
  'enforces', 'ensures', 'without this', 'root_cause', 'gap',
  'mitigates', 'missing', 'accumulates', 'insight', 'learning'
];

function hasWhyContext(text) {
  const lower = text.toLowerCase();
  return WHY_INDICATORS.some(indicator => lower.includes(indicator));
}

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

const warnings = [];
let checked = 0;

// ─── SURFACE A: Behavioral contracts ──────────────────────────────────────

const contractsDir = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts');
if (existsSync(contractsDir)) {
  const contractFiles = readdirSync(contractsDir)
    .filter(f => f.endsWith('.md') && f.startsWith('B_'));

  for (const file of contractFiles) {
    const text = readFileSync(join(contractsDir, file), 'utf8');
    checked++;

    // Skip generated slice headers (first 5 lines are metadata comments)
    const body = text.split('\n').slice(5).join('\n');

    if (!hasWhyContext(body)) {
      warnings.push(
        `[SURFACE A] ${file}: No WHY reasoning detected. ` +
        `Add structural failure context to Canonical, Source, or Cross-references blocks. ` +
        `(looked for: prevents/root-cause/pattern/incident/because/structural)`
      );
    }
  }
}

// ─── SURFACE B: principles.yaml ───────────────────────────────────────────

const principlesPath = join(ROOT, 'packages/principles/principles.yaml');
if (existsSync(principlesPath)) {
  const text = readFileSync(principlesPath, 'utf8');
  const principleBlocks = text.split(/^  - id: /m).slice(1);

  for (const block of principleBlocks) {
    const idMatch = block.match(/^([^\n]+)/);
    const id = idMatch ? idMatch[1].trim() : 'unknown';
    // Skip category headers (meta, operating, architecture, operations) — not P-NNN principles
    if (!id.match(/^P-[A-Z]+-\d+/)) continue;
    checked++;

    // Check industry_lineage is present and non-trivial
    const hasLineage = block.includes('industry_lineage:') &&
      !block.match(/industry_lineage:\s*\[\s*\]/);

    // Check cross_references present
    const hasRefs = block.includes('cross_references:') &&
      !block.match(/cross_references:\s*\[\s*\]/);

    if (!hasLineage && !hasRefs) {
      warnings.push(
        `[SURFACE B] Principle ${id}: missing both industry_lineage AND cross_references. ` +
        `These ARE the WHY for principles. Add at least one source of context.`
      );
    } else if (!hasLineage) {
      warnings.push(
        `[SURFACE B] Principle ${id}: industry_lineage empty. ` +
        `Industry precedent explains WHY this pattern works at scale.`
      );
    }
  }
}

// ─── SURFACE C: Hook scripts ──────────────────────────────────────────────

const hooksDir = join(ROOT, '.claude/hooks');
if (existsSync(hooksDir)) {
  const hookFiles = readdirSync(hooksDir).filter(f => f.endsWith('.sh'));

  for (const file of hookFiles) {
    const text = readFileSync(join(hooksDir, file), 'utf8');

    // Skip known stubs — week-4 promotion targets, not WHY backfill today
    if (text.includes('@csps-lifecycle-state stub') ||
        text.includes('STUB tier') || text.includes('STUB BEHAVIOR') ||
        text.includes('0.1.0-stub')) continue;

    checked++;

    // Extract @csps-description (multi-line) OR fall back to full header comment block
    const descMatch = text.match(/@csps-description\s+(.*?)(?=\n@csps-[a-z])/s);
    const description = descMatch
      ? descMatch[1].replace(/\n#\s*/g, ' ').trim()
      : text.split('\n').slice(0, 30).filter(l => l.startsWith('#')).join(' ').replace(/#+\s*/g, ' ').trim();

    if (!description || countWords(description) < 10) {
      warnings.push(
        `[SURFACE C] ${file}: @csps-description too short (${countWords(description)} words). ` +
        `Describe WHAT the hook does AND WHY it exists (structural failure it prevents).`
      );
    } else if (!hasWhyContext(description)) {
      warnings.push(
        `[SURFACE C] ${file}: @csps-description describes WHAT but not WHY. ` +
        `Add: what structural failure does this hook prevent? What breaks without it?`
      );
    }
  }
}

// ─── Output ──────────────────────────────────────────────────────────────

if (warnings.length > 0) {
  console.warn(`\n${warnings.length} instruction(s) missing WHY context:\n`);
  for (const w of warnings) {
    console.warn(`  ⚠ ${w}\n`);
  }
  console.warn('Per P-META-020: context is the compass. Rules without WHY produce');
  console.warn('instance-patching, not concept navigation. Add WHY to each flagged item.');
}

const summary = `[validate-instruction-context] checked=${checked} missing_why=${warnings.length}`;
console.log(`\n${summary}`);

process.exit(0); // advisory
