#!/usr/bin/env node
/**
 * validate-question-coverage.mjs — Question Protocol enforcement (Phase 1 Advisory)
 *
 * ROOT CAUSE TARGETED: Drift happens when AI acts without verified understanding.
 * Questions are the strongest context preservation mechanism — a chain of answered
 * questions is a verified audit trail that cannot be drifted past.
 *
 * What it checks (Phase 1 — S025):
 *   1. Active deep_quality topic-plans have a question_register: field
 *   2. WizardTemplate steps in routing.config.ts have clarifying_questions defined
 *   3. Plans have at least one Z-type question (completion/ZF evidence question)
 *      indicated by done_criteria field presence
 *
 * Phase 2 (S026): + per-step question_type declared in WizardTemplate
 * Phase 3 (S027): + validate-handoff-alignment (X-type questions in HANDOFF)
 *
 * Audit slug: question-coverage
 * Governor directive S025: "Questions must be mandatory and mechanically enforced
 * in each and every step of the protocols, wizards, and AI communicating with humans."
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT      = resolve(process.cwd());
const PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');
const ROUTING   = join(ROOT, 'libs/config/routing.config.ts');

const advisories = [];
let plansChecked = 0;
let wizardStepsChecked = 0;

// ── Check 1: topic-plans have question_register OR done_criteria (Z-type minimum) ──
if (existsSync(PLANS_DIR)) {
  const files = readdirSync(PLANS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');
  for (const f of files) {
    const content = readFileSync(join(PLANS_DIR, f), 'utf8');
    if (!content.includes('lifecycle_state: active')) continue;
    if (!content.includes('execution_mode: deep_quality')) continue;
    plansChecked++;

    const hasQuestionRegister = content.includes('question_register:');
    const hasDoneCriteria = content.includes('done_criteria:');
    const hasFailureSignal = content.includes('failure_signal:');

    if (!hasQuestionRegister) {
      // Z-type minimum: done_criteria is a completion question
      if (!hasDoneCriteria) {
        advisories.push({
          file: f,
          type: 'Z',
          issue: 'missing done_criteria (Z-type completion question) — what proves this is done?',
        });
      }
      // X-type minimum check: goal_statement present (crystallization output)
      if (!content.includes('goal_statement:')) {
        advisories.push({
          file: f,
          type: 'C',
          issue: 'missing goal_statement (C-type crystallization output) — what is the intent?',
        });
      }
      // No question_register yet (advisory)
      if (hasDoneCriteria && content.includes('goal_statement:')) {
        advisories.push({
          file: f,
          type: 'REGISTER',
          issue: 'no question_register: field — consider adding to track questions asked during intake',
        });
      }
    }
  }
}

// ── Check 2: WizardTemplate steps have clarifying_questions ──
if (existsSync(ROUTING)) {
  const routingText = readFileSync(ROUTING, 'utf8');
  // Find template IDs and check for clarifying_questions
  const templateIds = [...routingText.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]).filter(id => id !== 'none');
  for (const id of templateIds) {
    wizardStepsChecked++;
    // Check if this template has clarifying_questions
    const templateSection = routingText.slice(
      routingText.indexOf(`'${id}':`),
      routingText.indexOf(`'${id}':`) + 2000
    );
    if (!templateSection.includes('clarifying_questions:') && !templateSection.includes('clarifying_questions: []')) {
      advisories.push({
        file: 'routing.config.ts',
        type: 'G',
        issue: `WizardTemplate '${id}' missing clarifying_questions — add G-type gap-surfacing questions`,
      });
    }
  }
}

// ── Report ────────────────────────────────────────────────────────────────────
const registerMissing = advisories.filter(a => a.type === 'REGISTER').length;
const zTypeMissing    = advisories.filter(a => a.type === 'Z').length;
const cTypeMissing    = advisories.filter(a => a.type === 'C').length;
const gTypeMissing    = advisories.filter(a => a.type === 'G').length;

if (advisories.length > 0) {
  advisories.slice(0, 8).forEach(a => {
    console.log(`  ⚠ [${a.type}] ${a.file}: ${a.issue}`);
  });
  if (advisories.length > 8) {
    console.log(`  ... and ${advisories.length - 8} more advisory findings`);
  }
  console.log('[validate-question-coverage] stage=advisory (S026: Phase 2 enforcement)');
} else {
  console.log('[validate-question-coverage] all active plans have minimum question coverage ✓');
}

console.log(`[validate-question-coverage] plans=${plansChecked} wizard_templates=${wizardStepsChecked} issues: Z=${zTypeMissing} C=${cTypeMissing} G=${gTypeMissing} register=${registerMissing}`);
process.exit(0); // Advisory — Phase 2 promotes to blocking
