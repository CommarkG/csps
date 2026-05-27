#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-per-step-gate-tier
 * @csps-name validate-per-step-gate-tier
 * @csps-description C13 AUTO_EXECUTE_SCOPE_INHERITANCE prevention validator.
 *   Scans PROTO-*.md files that declare per_step_gate_tier or gate_tier fields.
 *   Verifies that PROTOs with gate_tier: check-in have at least one STEP section
 *   with an explicit per-step gate declaration (not just PROTO-level declaration).
 *
 *   WHAT THIS PREVENTS: PROTOs that declare full-advance at PROTO level but
 *   don't explicitly declare per-STEP gate tiers. F-NEW-16 lesson: auto-execute
 *   chaining across STEP boundaries was the primary execution discipline failure
 *   in S067 (Sonnet wanted to chain STEPs 3+4+5+7 without explicit per-STEP gates).
 *
 *   RULES:
 *   (1) ADVISORY: PROTO with gate_tier: full-advance but no per_step_gate_tier declared
 *       AND has multiple STEP sections → suggest adding per_step_gate_tier: check-in
 *   (2) ADVISORY: PROTO with per_step_gate_tier: check-in and STEP sections that
 *       lack explicit "per-STEP gate tier: check-in" declaration in their body
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces C13_AUTO_EXECUTE_SCOPE_INHERITANCE P-META-029 B_HUMBLE_CONSOLIDATION_DISCIPLINE
 * @csps-inherits-from validate-per-step-gate-tier (C13 PROTO-S067 APPENDIX A)
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PROTOS_DIR = resolve(ROOT, 'docs/plan/protos');

if (!existsSync(PROTOS_DIR)) {
  console.log('[validate-per-step-gate-tier] protos/ dir not found — skipping');
  process.exit(0);
}

const protoFiles = readdirSync(PROTOS_DIR).filter(f => f.startsWith('PROTO-') && f.endsWith('.md'));

let advisory = 0;
const findings = [];

for (const file of protoFiles) {
  const content = readFileSync(join(PROTOS_DIR, file), 'utf8');

  // Check frontmatter for gate_tier
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) continue;
  const fm = fmMatch[1];

  const gateField = (fm.match(/gate_tier:\s*(.+)/) || [])[1]?.trim();
  const perStepField = (fm.match(/per_step_gate_tier:\s*(.+)/) || [])[1]?.trim() ||
                       content.match(/Per-STEP gate tier:\s*([^\n]+)/)?.[1]?.trim();

  // Count STEP sections
  const stepSections = (content.match(/^## STEP \d+/gm) || []).length;

  if (stepSections >= 2 && gateField && !perStepField) {
    advisory++;
    findings.push(`  ADVISORY [C13] ${file}: gate_tier=${gateField} + ${stepSections} STEPs but no per_step_gate_tier declared`);
    findings.push(`    → Add: per_step_gate_tier: check-in to frontmatter (F-NEW-16 / C13 prevention)`);
  }

  if (perStepField && perStepField.includes('check-in')) {
    // Verify STEP bodies have explicit gate declarations
    const stepBodies = content.split(/^## STEP \d+/m).slice(1);
    for (let i = 0; i < Math.min(stepBodies.length, 8); i++) {
      const body = stepBodies[i];
      const hasExplicitGate = /gate.tier|check.in|full.advance|auto.execute|F-NEW-16/i.test(body);
      if (!hasExplicitGate && body.length > 100) {
        advisory++;
        findings.push(`  ADVISORY [C13] ${file} STEP ${i + 1}: per_step_gate_tier=check-in declared but STEP body lacks explicit gate reference`);
      }
    }
  }
}

for (const f of findings) console.log(f);

if (findings.length === 0) {
  console.log('[validate-per-step-gate-tier] ✓ All PROTOs with multiple STEPs have per-STEP gate declarations');
}

console.log(`[validate-per-step-gate-tier] protos_checked=${protoFiles.length} blocking=0 advisory=${advisory}`);
process.exit(0); // Advisory only S067
