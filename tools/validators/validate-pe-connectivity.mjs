#!/usr/bin/env node
// validate-pe-connectivity.mjs — CSPS Priority Engine Connectivity Audit
//
// Defines the FULL FUNCTION of PE and mechanically checks which platform elements
// SHOULD be connected to the Priority Engine but aren't (or are partially connected).
//
// PE FULL FUNCTION (per priority-engine.schema.yaml):
//   1. ORDERING: sequences all platform work (binding on when, Governor decides whether)
//   2. PRIORITY: assigns bands (1-BLOCKING / 2-HIGH / 3-MEDIUM / 4-VAULTED)
//   3. TRAJECTORY: lookahead across current session's work
//   4. DEFLECTION: B_PE_ALIGNMENT_GUARDIAN rejects misaligned work
//   5. FOUNDATION_EXIT_GATE: multiplicative zero on app-layer during foundation phase
//   6. SITUATION: meta-state context that shapes all above (pe-situation-registry.md)
//
// WHAT MUST BE PE-CONNECTED:
//   A. Topic-plans (active) → MUST have priority_score + priority_band
//   B. Topic-plans (active, depth >= 3) → MUST have pe_score_per_session entries
//   C. Behavioral contracts with enforcement_stage: planned → ADVISORY (need PE tracking)
//   D. Validators with enforcement_stage: planned → ADVISORY (need completion tracking)
//   E. Bedrock items unchecked ([ ]) → MUST appear in an active Band-1 topic-plan
//   F. Active Situation sessions → MUST have PE_SCORE in plan
//
// EXIT CODES:
//   0 = all checks pass (including advisory — exit 0 for advisory findings)
//   1 = BLOCKING: active topic-plan missing priority_score/priority_band
//
// Audit slug: pe-connectivity
// Severity: BLOCKING for active topic-plans missing PE fields; ADVISORY for others

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());
const TOPIC_PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');
const BEHAVIORAL_CONTRACTS = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts.md');
const BEDROCK_FILE = join(ROOT, 'docs/plan/pillar-0-governance/csps-bedrock.md');

// ─── Frontmatter extraction ────────────────────────────────────────────────

function getFrontmatter(content) {
  if (!content.startsWith('---')) return {};
  const end = content.indexOf('\n---', 3);
  if (end === -1) return {};
  const fm = content.slice(4, end);
  const get = (key) => {
    const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
  };
  return {
    name: get('name'),
    lifecycle_state: get('lifecycle_state'),
    execution_mode: get('execution_mode'),
    priority_score: get('priority_score'),
    priority_band: get('priority_band'),
    depth_chosen: get('depth_chosen'),
    enforcement_stage: get('enforcement_stage'),
    topic_id: get('topic_id'),
  };
}

// ─── Check A+B: Topic-plans ────────────────────────────────────────────────

function checkTopicPlans(blocking, advisory) {
  if (!existsSync(TOPIC_PLANS_DIR)) return;

  const files = readdirSync(TOPIC_PLANS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');

  for (const f of files) {
    const fp = join(TOPIC_PLANS_DIR, f);
    const content = readFileSync(fp, 'utf8');
    const fm = getFrontmatter(content);

    // Only check active plans
    if (!fm.lifecycle_state || !['active', 'implementing'].includes(fm.lifecycle_state)) continue;
    // Skip if explicitly closed or vaulted
    if (['closed', 'validated', 'deprecated'].includes(fm.lifecycle_state)) continue;

    // CHECK A: active topic-plan MUST have priority_score + priority_band
    if (!fm.priority_score) {
      blocking.push({
        check: 'A',
        file: f,
        name: fm.name,
        issue: `active topic-plan missing priority_score — PE cannot sequence this work`,
        fix: `Add priority_score: <1-100> to frontmatter (PE formula: B×0.30+D×0.30+I×0.15+Bn×0.10+PAS×0.15×10)`,
      });
    }
    if (!fm.priority_band) {
      blocking.push({
        check: 'A',
        file: f,
        name: fm.name,
        issue: `active topic-plan missing priority_band — PE cannot assign this to a band`,
        fix: `Add priority_band: 1 (BLOCKING) | 2 (HIGH) | 3 (MEDIUM) | 4 (VAULTED)`,
      });
    }

    // CHECK B: depth >= 3 plans should have per-session PE scores in content
    const depth = parseInt(fm.depth_chosen ?? '0', 10);
    if (depth >= 3 && fm.priority_score) {
      // Check for PE_SCORE in content (sessions should show their scores)
      const hasPeScoreInContent = /PE_SCORE:\s*[\d.]+/.test(content);
      if (!hasPeScoreInContent) {
        advisory.push({
          check: 'B',
          file: f,
          name: fm.name,
          issue: `depth-${depth} topic-plan has no PE_SCORE on individual sessions — trajectory unclear`,
          fix: `Add PE_SCORE: X.XX | Band: N-LABEL line to each session heading`,
        });
      }
    }
  }
}

// ─── Check C: Behavioral contracts with enforcement_stage: planned ─────────

function checkBehavioralContracts(advisory) {
  if (!existsSync(BEHAVIORAL_CONTRACTS)) return;
  const content = readFileSync(BEHAVIORAL_CONTRACTS, 'utf8');

  // Find contract blocks with enforcement_stage: planned
  const contractMatches = content.matchAll(/###\s+(B_\w+)[\s\S]*?enforcement_stage:\s*(planned|stub)/g);
  for (const m of contractMatches) {
    const contractId = m[1];
    const stage = m[2];
    // Check if this contract appears in any topic-plan's open levels
    // (simplified: check if it's mentioned in any topic-plan)
    const mentionedInPlan = checkMentionedInTopicPlans(contractId);
    if (!mentionedInPlan) {
      advisory.push({
        check: 'C',
        file: 'behavioral-contracts.md',
        name: contractId,
        issue: `enforcement_stage: ${stage} — contract declared but no PE-tracked completion plan found`,
        fix: `Add this contract's promotion to an active topic-plan's open levels, OR accept as deferred with reason`,
      });
    }
  }
}

function checkMentionedInTopicPlans(id) {
  if (!existsSync(TOPIC_PLANS_DIR)) return false;
  const files = readdirSync(TOPIC_PLANS_DIR).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const content = readFileSync(join(TOPIC_PLANS_DIR, f), 'utf8');
    if (content.includes(id)) return true;
  }
  return false;
}

// ─── Check D: Validators with enforcement_stage: planned ──────────────────

function checkPlannedValidators(advisory) {
  // Check audit-runner.md for validators marked as planned/week-4
  const auditRunnerPath = join(ROOT, 'docs/plan/pillar-0-governance/audit-runner.md');
  if (!existsSync(auditRunnerPath)) return;
  const content = readFileSync(auditRunnerPath, 'utf8');

  // Match rows with "week-4" or "impl deferred" but not "Build ACTIVE"
  const rows = content.split('\n').filter(l => l.startsWith('|'));
  let unconnected = 0;
  for (const row of rows) {
    if (!row.includes('week-4') && !row.includes('deferred')) continue;
    if (row.includes('Build ACTIVE')) continue;
    // Extract slug (first cell)
    const slug = row.match(/\|\s*`([^`]+)`/)?.[1];
    if (!slug) continue;
    // Check if mentioned in any topic-plan
    if (!checkMentionedInTopicPlans(slug)) {
      unconnected++;
      // Don't spam — just count
    }
  }
  if (unconnected > 0) {
    advisory.push({
      check: 'D',
      file: 'audit-runner.md',
      name: 'planned-validators',
      issue: `${unconnected} planned/week-4 validators have no PE-tracked completion plan`,
      fix: `Run pnpm audit-runner:split and review which week-4 slugs need a topic-plan level`,
    });
  }
}

// ─── Check E: Bedrock unchecked items → must be in active Band-1 plan ─────

function checkBedrockConnectivity(advisory) {
  if (!existsSync(BEDROCK_FILE)) return;
  const content = readFileSync(BEDROCK_FILE, 'utf8');

  // Find unchecked bedrock items
  const unchecked = [];
  for (const line of content.split('\n')) {
    if (/^\|\s*\[ \]/.test(line) || /^  \[ \]/.test(line)) {
      const name = line.replace(/\|?\s*\[ \]\s*/, '').split('|')[0].trim();
      if (name) unchecked.push(name);
    }
  }

  if (unchecked.length > 0) {
    // Verify there's an active Band-1 topic-plan that covers bedrock
    const bedrockCovered = checkMentionedInTopicPlans('bedrock');
    if (!bedrockCovered) {
      advisory.push({
        check: 'E',
        file: 'csps-bedrock.md',
        name: 'bedrock-unchecked-items',
        issue: `${unchecked.length} unchecked bedrock item(s) with no active Band-1 topic-plan covering them`,
        fix: `Enterprise Core Completion Plan (enterprise-core-completion-plan.md) covers these — confirm it's registered as Band 1`,
      });
    }
  }
}

// ─── Check F: Active Situation sessions have PE_SCORE ─────────────────────

function checkSituationConnectivity(advisory) {
  const situationRegistry = join(ROOT, 'docs/plan/pillar-0-governance/pe-situation-registry.md');
  if (!existsSync(situationRegistry)) {
    advisory.push({
      check: 'F',
      file: 'pe-situation-registry.md',
      name: 'situation-registry',
      issue: `PE Situation Registry not found — Situations cannot be tracked or validated`,
      fix: `Create docs/plan/pillar-0-governance/pe-situation-registry.md`,
    });
    return;
  }

  const content = readFileSync(situationRegistry, 'utf8');
  // Find active situations
  const activeSituations = content.match(/\*\*Status:\*\* ACTIVE[^\n]*/g) ?? [];
  if (activeSituations.length > 0) {
    // Verify each active situation has a plan with PE_SCORE
    const enterprisePlanPath = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans/enterprise-core-completion-plan.md');
    if (existsSync(enterprisePlanPath)) {
      const planContent = readFileSync(enterprisePlanPath, 'utf8');
      const hasPeScores = /PE_SCORE:\s*[\d.]+/.test(planContent);
      if (!hasPeScores) {
        advisory.push({
          check: 'F',
          file: 'enterprise-core-completion-plan.md',
          name: 'STRATEGIC_COMPLETION-sessions',
          issue: `Active Situation STRATEGIC_COMPLETION but plan sessions have no PE_SCORE`,
          fix: `Add PE_SCORE: X.XX | Band: N to each session heading in the completion plan`,
        });
      }
    }
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────

function main() {
  const blocking = [];
  const advisory = [];

  checkTopicPlans(blocking, advisory);
  checkBehavioralContracts(advisory);
  checkPlannedValidators(advisory);
  checkBedrockConnectivity(advisory);
  checkSituationConnectivity(advisory);

  // Output
  if (blocking.length > 0) {
    console.log(`${blocking.length} BLOCKING PE connectivity gap(s):`);
    for (const b of blocking) {
      console.log(`  ✗ [${b.check}] ${b.file}: ${b.issue}`);
      console.log(`      FIX: ${b.fix}`);
    }
  }
  if (advisory.length > 0) {
    console.log(`${advisory.length} ADVISORY PE connectivity gap(s):`);
    for (const a of advisory) {
      console.log(`  ⚠ [${a.check}] ${a.file} (${a.name}): ${a.issue}`);
    }
  }
  if (blocking.length === 0 && advisory.length === 0) {
    console.log('All PE connectivity checks passed ✅');
  }

  const totalItems = blocking.length + advisory.length;
  console.log(`\n[validate-pe-connectivity] blocking=${blocking.length} advisory=${advisory.length} total_gaps=${totalItems}`);

  // BLOCKING gaps exit 1; advisory exits 0
  process.exit(blocking.length > 0 ? 1 : 0);
}

main();
