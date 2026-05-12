#!/usr/bin/env node
/**
 * validate-crystallization-bypass.mjs — Catches SP-005: "Just figure it out" pattern
 *
 * ROOT CAUSE TARGETED: AI acts on first expression (Layer 1) without crystallization.
 * This is the "crystallization bypass" — the AI fills gaps with inference instead
 * of asking the three questions (Q1c problem / Q2c goal / Q3c done criteria).
 *
 * Training default: "just figure it out" = authority delegation → AI decides directly.
 * CSPS override: "just figure it out" = missing crystallization → run Step 0a first.
 *
 * What it checks (Phase 1 advisory):
 *   1. Active deep_quality plans with intent_crystallized: false — crystallization incomplete
 *   2. Plans with goal_statement starting with AI-typical fillers (indicates AI-drafted not human)
 *   3. Plans from S025+ with no intent_crystallized field at all
 *
 * Teaching moment (SP-005): "Do I know specifically what success looks like, who will
 * judge it, and how they'll know it worked? If no — run Step 0a before acting."
 *
 * Phase 2 (S027): BLOCKING for any new plan in IMPLEMENTING state without crystallization.
 *
 * Audit slug: crystallization-bypass
 * Governor ratified: S026 Opus Turn 12 "Drive Don't Fight" CHUNK 5 enforcement roadmap
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');

// AI-typical goal_statement fillers that suggest AI-drafted (not human-authored)
const AI_FILLER_PATTERNS = [
  /^To (build|create|implement|develop|establish)/i,
  /^The goal is to/i,
  /^Implement a/i,
  /^Build a (robust|comprehensive|complete|full)/i,
  /^Create a (robust|comprehensive|complete|full)/i,
];

const advisories = [];
const blockings = [];
let checked = 0;

if (!existsSync(PLANS_DIR)) {
  console.log('[validate-crystallization-bypass] plans dir not found — skip');
  process.exit(0);
}

const files = readdirSync(PLANS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');

for (const f of files) {
  const content = readFileSync(join(PLANS_DIR, f), 'utf8');
  if (!content.includes('lifecycle_state: active')) continue;
  if (!content.includes('execution_mode: deep_quality')) continue;

  checked++;

  // Check 1: intent_crystallized: false (explicitly not crystallized)
  if (content.includes('intent_crystallized: false')) {
    advisories.push({
      file: f,
      pattern: 'SP-005',
      issue: 'intent_crystallized: false — plan is in drift risk. Run Step 0a (plan-creation-protocol.md) before any implementation.',
    });
  }

  // Check 2: goal_statement starts with AI filler (suggests AI-drafted, not human-authored)
  const goalMatch = content.match(/^goal_statement:\s*[">]?\s*(.{20,})/m);
  if (goalMatch) {
    const goalText = goalMatch[1].replace(/^["']/, '').trim();
    const isAIFiller = AI_FILLER_PATTERNS.some(p => p.test(goalText));
    if (isAIFiller) {
      advisories.push({
        file: f,
        pattern: 'SP-005',
        issue: `goal_statement may be AI-drafted (starts with AI filler pattern). Per P-META-022: goal_statement must be human-authored (I1 in 26-item checklist — NEVER AI-drafted). Current: "${goalText.slice(0, 60)}..."`,
      });
    }
  }

  // Check 3: S025+ plan without intent_crystallized field
  const sessionMatch = content.match(/^session:\s*S(\d+)/m);
  const sessionNum = sessionMatch ? parseInt(sessionMatch[1], 10) : 0;
  if (sessionNum >= 25 && !content.includes('intent_crystallized:')) {
    advisories.push({
      file: f,
      pattern: 'SP-005-MISSING',
      issue: `S025+ deep_quality plan missing intent_crystallized field entirely. Add intent_crystallized: true|false|partial.`,
    });
  }
}

// Report
if (blockings.length > 0) {
  console.log(`${blockings.length} BLOCKING — crystallization bypass detected:`);
  blockings.forEach(b => console.log(`  ✗ [${b.pattern}] ${b.file}: ${b.issue}`));
}
if (advisories.length > 0) {
  advisories.slice(0, 8).forEach(a => console.log(`  ⚠ [${a.pattern}] ${a.file}: ${a.issue}`));
  if (advisories.length > 8) console.log(`  ... and ${advisories.length - 8} more`);
  console.log('[validate-crystallization-bypass] stage=advisory. Teaching moment: "Do I know what success looks like? Who judges it? How will they know it worked? If no → Step 0a first."');
}
if (blockings.length === 0 && advisories.length === 0) {
  console.log('[validate-crystallization-bypass] no crystallization bypass patterns detected ✓');
}

console.log(`[validate-crystallization-bypass] plans=${checked} blocking=${blockings.length} advisory=${advisories.length}`);
process.exit(blockings.length > 0 ? 1 : 0);
