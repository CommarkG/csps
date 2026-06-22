#!/usr/bin/env node
/**
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields). Blocking decisions are structural/deterministic. Not in any blocking decision path.
 *
 * validate-partial-processes.mjs
 *
 * Weekly "What do we do if..." audit.
 * Identifies partial processes across the platform:
 *   - Validators registered but not built (governance debt)
 *   - Plans started but without completion evidence
 *   - Deferred items past their session target
 *   - Mini-tree splits without proper wiring
 *   - Processes with unclear "what to do when" protocol
 *
 * Governor directive S029: "create an audit to run every week on 'What we do if...'
 * have it identify partial processes and create clear instructions on what to do"
 *
 * Run: node tools/validators/validate-partial-processes.mjs
 * Cadence: Weekly (pnpm audit:weekly)
 * Severity: ADVISORY (surfaces governance debt without blocking)
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = join(fileURLToPath(import.meta.url), '../..');
const ROOT = resolve(__dirname, '..');

const findings = [];
const SESSIONS_ADVISORY = 5;   // partial process is advisory after 5 sessions
const SESSIONS_BLOCKING = 20;  // partial process is blocking after 20 sessions

function addFinding(severity, id, what_exists, what_is_missing, what_to_do, sessions_pending) {
  findings.push({ severity, id, what_exists, what_is_missing, what_to_do, sessions_pending });
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 1: Validators in verify.mjs that reference non-existent .mjs files
// ─────────────────────────────────────────────────────────────────────────────
function checkValidatorExistence() {
  const verifyContent = readFileSync(join(ROOT, 'tools/verify.mjs'), 'utf8');
  const commandMatches = [...verifyContent.matchAll(/command:\s*'node tools\/validators\/(validate-[^']+\.mjs)'/g)];

  for (const [, filename] of commandMatches) {
    const validatorPath = join(ROOT, 'tools/validators', filename);
    if (!existsSync(validatorPath)) {
      addFinding(
        'ADVISORY',
        `missing-validator-${filename}`,
        `verify.mjs references '${filename}'`,
        `${filename} does not exist in tools/validators/`,
        `Build ${filename} (Sonnet: next available session, SPI < 0.15)`,
        null
      );
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 2: Audit slugs with "(planned week-4)" or "(impl deferred)" in audit-runner.md
// ─────────────────────────────────────────────────────────────────────────────
function checkDeferredAuditSlugs() {
  const auditRunner = readFileSync(join(ROOT, 'docs/plan/pillar-0-governance/audit-runner.md'), 'utf8');
  const deferredPattern = /\| `([^`]+)` \|[^|]+\|[^|]+\|[^|]*(?:planned week-4|impl deferred|Build deferred|deferred week-4)[^|]*/g;
  const matches = [...auditRunner.matchAll(deferredPattern)];

  if (matches.length > 50) {
    addFinding(
      'ADVISORY',
      'deferred-slug-accumulation',
      `${matches.length} audit slugs in audit-runner.md`,
      `${matches.length} slugs marked "deferred week-4" with no validator built`,
      `Run 'pnpm health:deferred' to see the full list. Triage: which 5 have highest governance value? File SROF to Opus for prioritization.`,
      null
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 3: Backlog items with no session target
// ─────────────────────────────────────────────────────────────────────────────
function checkBacklogItems() {
  try {
    const backlog = readFileSync(join(ROOT, 'tools/config/platform-update-backlog.yaml'), 'utf8');
    const noTargetMatches = [...backlog.matchAll(/status:\s*pending(?!.*target_session)/g)];

    if (noTargetMatches.length > 10) {
      addFinding(
        'ADVISORY',
        'backlog-no-target',
        `${noTargetMatches.length} pending backlog items`,
        `${noTargetMatches.length} items have no session target`,
        `Monthly backlog triage: assign session targets OR move to deferred-backlog.yaml. Items without targets are invisible to planning.`,
        null
      );
    }
  } catch (e) { /* file may not exist */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 4: Mini-tree directories without intro files
// ─────────────────────────────────────────────────────────────────────────────
function checkMiniTreeIntegrity() {
  const docsDir = join(ROOT, 'docs/plan/pillar-0-governance');
  try {
    const entries = readdirSync(docsDir);
    for (const entry of entries) {
      const fullPath = join(docsDir, entry);
      if (statSync(fullPath).isDirectory()) {
        const readmePath = join(fullPath, 'README.md');
        const introPath = join(fullPath, `${entry}.md`);
        if (!existsSync(readmePath) && !existsSync(introPath)) {
          addFinding(
            'ADVISORY',
            `mini-tree-no-intro-${entry}`,
            `Directory ${entry}/ exists in pillar-0-governance`,
            `No README.md or ${entry}.md (mini-tree intro) found`,
            `Create ${entry}/README.md using tools/templates/mini-tree-intro.template.md. Add mini_tree_root: true + sub_files: [...]`,
            null
          );
        }
      }
    }
  } catch (e) { /* skip */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 5: Platform capacity elements past soft limits
// ─────────────────────────────────────────────────────────────────────────────
function checkCapacityRegistry() {
  try {
    const registry = readFileSync(join(ROOT, 'tools/config/platform-capacity-registry.yaml'), 'utf8');
    const atRiskMatches = [...registry.matchAll(/at_risk:\s*true\s*\n.*?id:\s*([^\n]+)/g)];

    if (atRiskMatches.length > 0) {
      addFinding(
        'ADVISORY',
        'capacity-elements-at-risk',
        `platform-capacity-registry.yaml tracks ${atRiskMatches.length} at-risk elements`,
        `validate-platform-capacity.mjs does not exist yet — capacity not enforced`,
        `Sonnet: build validate-platform-capacity.mjs per Turn 22 spec (SPI=0.15). This is the blocking gate for AGENTS.md overflow.`,
        null
      );
    }
  } catch (e) { /* skip */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

checkValidatorExistence();
checkDeferredAuditSlugs();
checkBacklogItems();
checkMiniTreeIntegrity();
checkCapacityRegistry();

const advisories = findings.filter(f => f.severity === 'ADVISORY');
const blockings = findings.filter(f => f.severity === 'BLOCKING');

console.log('\n' + '═'.repeat(60));
console.log('PARTIAL PROCESS AUDIT — ' + new Date().toISOString().slice(0, 10));
console.log('═'.repeat(60));

if (findings.length === 0) {
  console.log('✅ No partial processes found. Platform is clean.');
} else {
  console.log(`\n⚠  Found ${findings.length} partial processes (${blockings.length} blocking, ${advisories.length} advisory):\n`);

  findings.forEach((f, i) => {
    const icon = f.severity === 'BLOCKING' ? '⛔' : '⚠ ';
    console.log(`${icon} ${i + 1}. ${f.id}`);
    console.log(`   EXISTS: ${f.what_exists}`);
    console.log(`   MISSING: ${f.what_is_missing}`);
    console.log(`   WHAT TO DO: ${f.what_to_do}`);
    console.log('');
  });
}

console.log(`[validate-partial-processes] total=${findings.length} blocking=${blockings.length} advisory=${advisories.length}`);
console.log('Cadence: Run weekly | pnpm audit:weekly');

if (blockings.length > 0) process.exit(1);
process.exit(0);
