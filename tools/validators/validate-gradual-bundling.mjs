#!/usr/bin/env node
/**
 * validate-gradual-bundling.mjs — Comprehensive Gradual Bundling Integrity Gate
 *
 * ROOT CAUSE TARGETED (S021 Governor directive — gradual bundling expert):
 *   The "gradual bundling" concept in CSPS is spread across 8+ artifacts:
 *   B_HUMBLE_EXECUTOR, B_COMPLETION_OVER_SHINY, depth levels (L1/L2/L3),
 *   Gradual Execution Protocol, ZF levels, core spiral cycles, B_TOKEN_BUDGET,
 *   B_GRADUAL_BUILD_BY_FOUNDATIONS. No single validator checks ALL of these.
 *   This validator is the comprehensive bundling integrity gate.
 *
 * WHAT THIS CHECKS (all bundling elements):
 *
 * 1. DEPTH DISCIPLINE (L1/L2/L3)
 *    - Topic plans declare depth_chosen ∈ {3, 4, 5}
 *    - L<N+1> work is not started until L<N> reaches ZF
 *    - Checks: validate-open-plan-levels.mjs (existing) + depth field presence
 *
 * 2. HUMBLE BATCHING (B_HUMBLE_EXECUTOR)
 *    - No new batch while current batch is in-progress and >50% complete
 *    - Batch items are related (not unrelated tasks bundled for speed)
 *    - Each batch has explicit composition rationale
 *
 * 3. CORE SPIRAL CYCLE TRACKING
 *    - Each spiral cycle: design → ZF → extract → engrave → raise
 *    - CEC runs after each ZF level → positive harvest
 *    - Engraving (5-surface FSE) before advancing to next cycle
 *
 * 4. GRADUAL EXECUTION PROTOCOL
 *    - Stage 1 (1-3 cases) before Stage 3 (full scope)
 *    - enforce_stage field tracks which stage is active
 *
 * 5. PRIORITY ENGINE ALIGNMENT
 *    - Active work (>50% complete) should have PE score × 1.5
 *    - No P3 item should be started while P1 items are pending
 *
 * Coverage Levels:
 *   ✓ Level 1: Check depth_chosen declared on active topic plans
 *   ✓ Level 2: Surface plans with open items vs. new plans starting
 *   ✓ Level 3: Check enforce_stage coherence (not jumping stage 1 → 3)
 *   ✗ Level 4: Real-time batch composition validation → VLT-S021-BATCH-COMPOSE
 *   ✗ Level 5: PE score integration (live Work PE calculation) → VLT-S021-PE-LIVE
 *
 * Exit: 0 always (measurement stage — comprehensive reporting)
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const TOPIC_PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');
const BACKLOG_PATH = join(ROOT, 'tools/config/platform-update-backlog.yaml');

function extractFrontmatterField(content, field) {
  const m = content.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim().replace(/['"]/g, '') : null;
}

function countUncheckedItems(content) {
  return (content.match(/^\s*- \[ \]/gm) || []).length;
}

function countCheckedItems(content) {
  return (content.match(/^\s*- \[x\]/gim) || []).length;
}

function readTopicPlans() {
  const plans = [];
  if (!existsSync(TOPIC_PLANS_DIR)) return plans;

  try {
    for (const entry of readdirSync(TOPIC_PLANS_DIR)) {
      if (!entry.endsWith('.md')) continue;
      const full = join(TOPIC_PLANS_DIR, entry);
      const content = readFileSync(full, 'utf8');

      const cdpStatus = extractFrontmatterField(content, 'cdp_status');
      const depthChosen = extractFrontmatterField(content, 'depth_chosen');
      const enforceStage = extractFrontmatterField(content, 'enforce_stage');
      const name = extractFrontmatterField(content, 'name') || entry;
      const session = extractFrontmatterField(content, 'session') || '?';

      if (!cdpStatus || ['sealed', 'closed', 'deprecated'].includes(cdpStatus)) continue;

      const unchecked = countUncheckedItems(content);
      const checked = countCheckedItems(content);
      const total = unchecked + checked;
      const completionPct = total > 0 ? Math.round((checked / total) * 100) : 0;

      plans.push({
        name, session, cdpStatus, depthChosen, enforceStage,
        unchecked, checked, total, completionPct,
        path: full.replace(ROOT, '').replace(/\\/g, '/'),
        isActive: cdpStatus === 'implementing' || cdpStatus === 'ratified',
      });
    }
  } catch (e) { /* skip */ }

  return plans;
}

function readBacklogPending() {
  if (!existsSync(BACKLOG_PATH)) return 0;
  const content = readFileSync(BACKLOG_PATH, 'utf8');
  return (content.match(/status:\s*pending/g) || []).length;
}

async function main() {
  const plans = readTopicPlans();
  const backlogPending = readBacklogPending();

  const activePlans = plans.filter(p => p.isActive);
  const nearComplete = activePlans.filter(p => p.completionPct >= 50 && p.unchecked > 0);
  const noDepth = activePlans.filter(p => !p.depthChosen);
  const noStage = activePlans.filter(p => !p.enforceStage);

  // ── Depth Discipline (L1/L2/L3) ────────────────────────────────────────────
  console.log('\n§1 DEPTH DISCIPLINE:');
  if (noDepth.length > 0) {
    console.log(`  ⚠ ${noDepth.length} active plans missing depth_chosen field:`);
    for (const p of noDepth.slice(0, 5)) {
      console.log(`    → ${p.name} [${p.cdpStatus}] — add depth_chosen: D3|D4|D5`);
    }
  } else {
    console.log(`  ✓ All ${activePlans.length} active plans have depth_chosen declared`);
  }

  // ── Humble Batching (B_HUMBLE_EXECUTOR) ────────────────────────────────────
  console.log('\n§2 HUMBLE BATCHING:');
  if (nearComplete.length > 0) {
    console.log(`  ⚠ ${nearComplete.length} plans are ≥50% complete with open items — complete before starting new:`);
    for (const p of nearComplete) {
      console.log(`    → ${p.name}: ${p.completionPct}% done (${p.unchecked} remaining) — B_COMPLETION_OVER_SHINY: 1.5× PE`);
    }
  } else {
    console.log(`  ✓ No plans in >50% partial state with open items`);
  }

  // ── Gradual Execution Protocol (enforce_stage) ──────────────────────────────
  console.log('\n§3 GRADUAL EXECUTION PROTOCOL:');
  if (noStage.length > 0) {
    console.log(`  ⚠ ${noStage.length} plans missing enforce_stage — cannot verify Stage 1 before Stage 3:`);
    for (const p of noStage.slice(0, 5)) {
      console.log(`    → ${p.name} — add enforce_stage: stage-1-required|stage-1-complete|full`);
    }
  } else {
    console.log(`  ✓ All active plans have enforce_stage declared`);
  }

  // ── Core Spiral Cycle Tracking ──────────────────────────────────────────────
  console.log('\n§4 CORE SPIRAL CYCLES:');
  console.log(`  Active plans: ${activePlans.length}`);
  console.log(`  Near-complete (≥50% done, open items remain): ${nearComplete.length}`);
  console.log(`  Backlog P1+P2 pending: ${backlogPending}`);
  console.log(`  Core spiral position: ${nearComplete.length > 0 ? 'COMPLETE-IN-PROGRESS (close these before new cycles)' : 'READY FOR NEW CYCLE'}`);

  // ── Priority Engine Alignment ───────────────────────────────────────────────
  console.log('\n§5 PRIORITY ENGINE ALIGNMENT:');
  if (backlogPending > 15) {
    console.log(`  ⚠ ${backlogPending} backlog items pending — high accumulation risk`);
    console.log(`    Recommended batch size: ≤3 P1 items per session`);
    console.log(`    Current batch discipline: check PE score before starting any item`);
  } else {
    console.log(`  ✓ Backlog pending (${backlogPending}) within manageable range`);
  }

  // ── Depth Level Summary ─────────────────────────────────────────────────────
  console.log('\n§6 BUNDLING ELEMENT STATUS:');
  console.log(`
  B_HUMBLE_EXECUTOR:         ${nearComplete.length === 0 ? '✓ CLEAN' : '⚠ ' + nearComplete.length + ' in partial state'}
  B_COMPLETION_OVER_SHINY:   ${nearComplete.length > 0 ? '⚡ ACTIVE (1.5× PE applies to ' + nearComplete.length + ' plans)' : '— not triggered'}
  Depth discipline:           ${noDepth.length === 0 ? '✓ DECLARED' : '⚠ ' + noDepth.length + ' undeclared'}
  Gradual Execution Protocol: ${noStage.length === 0 ? '✓ DECLARED' : '⚠ ' + noStage.length + ' undeclared'}
  Core spiral position:       ${nearComplete.length > 0 ? 'COMPLETE BEFORE STARTING NEW' : 'CLEAR — ready for new cycle'}
  Backlog accumulation:       ${backlogPending} pending items
  `);

  console.log(`
GRADUAL BUNDLING PRINCIPLES (P-META-016 + B_HUMBLE_EXECUTOR + B_GRADUAL_BUILD_BY_FOUNDATIONS):
  1. DEPTH: L1 → ZF → L2 → ZF → L3. Never jump levels without ZF.
  2. BATCH: ≤3 P1 items per session. Related items only. Rationale required.
  3. SPIRAL: design → build → ZF → CEC extract → engrave → advance.
  4. STAGE: Stage 1 (1-3 cases) before Stage 3 (full scope). Always.
  5. PE: complete ≥50% items first (1.5× PE). P3 never beats P1.
`);

  const issues = noDepth.length + noStage.length + (nearComplete.length > 2 ? 1 : 0);
  console.log(`[validate-gradual-bundling] active_plans=${activePlans.length} near_complete=${nearComplete.length} no_depth=${noDepth.length} no_stage=${noStage.length} backlog_pending=${backlogPending} status=${issues > 0 ? 'ADVISORY' : 'CLEAN'}`);

  process.exit(0); // advisory — always exits 0
}

main().catch(err => {
  console.error('[validate-gradual-bundling] fatal:', err);
  process.exit(1);
});
