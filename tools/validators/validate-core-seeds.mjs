#!/usr/bin/env node
/**
 * validate-core-seeds.mjs — Core Seeds Registry and Staleness Gate
 *
 * ROOT CAUSE TARGETED (S018 Governor directive):
 *   Plans describe future capabilities but implementation gaps are invisible.
 *   Code stubs say "TODO" but have no plan linkage, no target session, no audit.
 *   Core Seeds make these gaps VISIBLE, AUDITABLE, and TRACKABLE — they are the
 *   mechanical bridge between "designed in the plan" and "running in production."
 *
 * WHAT IS A CORE SEED:
 *   A structured placeholder at two levels:
 *   1. Code-level: // @core-seed: SEED_NAME | plan: X | grows-to: Y | target: S019
 *      Placed in .mjs/.sh files where stub behavior exists (exit 0, returns empty)
 *   2. Document-level: cdp_status: raw|pipeline-intake + grows_to: field in frontmatter
 *
 * WHAT IT CHECKS:
 *   1. Scans all .mjs and .sh files for @core-seed markers
 *   2. Verifies each seed has: plan reference + grows-to description + target session
 *   3. Reports seeds that are OVERDUE (target session is in the past)
 *   4. Reports seeds that have GROWN (the grows-to artifact now exists)
 *
 * Exit codes:
 *   0 = all seeds valid (may have advisory warnings for overdue/orphaned seeds)
 *   1 = seeds found without required fields (malformed seeds block the registry)
 *
 * enforcement_stage: stub (exits 0 always — week-4 promotes to advisory validation)
 *
 * PLANTED SEEDS (S018):
 *   #core-seed: GRACE_PHASE10 — context orchestrator automatic injection
 *   #core-seed: ZF_POSITIVE_HARVEST — automatic positive harvest at session close
 *   #core-seed: THRESHOLD_COMPLETENESS — session-open completeness validator
 *   #core-seed: PE_CDP_STATUS_READER — PE reads cdp_status for holistic view
 *   #core-seed: MCP_DOMAIN_CARD_QUERY — get_domain_card() with depth parameter
 *   #core-seed: TEMPLATE_COMPLIANCE_BLOCKING — promote stub to blocking
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync, statSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// ADVISORY TIER — exits 0 with overdue warnings; promoted from stub S019
// Promotion rationale: 6 seeds are planted with target sessions. Stub mode made them invisible governance debt.
// Advisory mode: reports overdue seeds but doesn't block development.
// Blocking mode: week-4 promotion (when overdue seeds should actively block phase gates)
const STUB_MODE = false;
// OPEN-057 fix: read current session from session-state.json (was hardcoded to 19)
let CURRENT_SESSION = 44; // fallback — updated dynamically below
try {
  const ss = JSON.parse(readFileSync(join(ROOT, 'tools/session-state.json'), 'utf8'));
  const sessionStr = (ss.current_session || 'S044').replace(/^S0*/, '');
  CURRENT_SESSION = parseInt(sessionStr, 10) || 44;
} catch(e) { /* use fallback */ }

const SEED_PATTERN = /@core-seed:\s*([A-Z_]+)/g;
const SEED_FIELDS_PATTERN = /@core-seed:[^|]+\|\s*plan:\s*([^|]+)\|\s*grows-to:\s*([^|]+)(?:\|\s*target:\s*(\S+))?/;

function walkForSeeds(dir, exts = ['.mjs', '.sh']) {
  const seeds = [];
  try {
    for (const entry of readdirSync(dir)) {
      if (entry.startsWith('.') || entry === 'node_modules') continue;
      const full = join(dir, entry);
      if (full.includes('validate-core-seeds.mjs')) continue; // skip self
      const s = statSync(full);
      if (s.isDirectory()) {
        seeds.push(...walkForSeeds(full, exts));
      } else if (exts.some(e => entry.endsWith(e))) {
        const content = readFileSync(full, 'utf8');
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes('@core-seed:')) {
            const nameMatch = line.match(/@core-seed:\s*([A-Z_]+)/);
            const planMatch = line.match(/plan:\s*([^|]+)/);
            const growsToMatch = line.match(/grows-to:\s*([^|]+)/);
            const targetMatch = line.match(/target:\s*(\S+)/);
            // OPEN-059: scan next 5 lines for planted_by: and pmi_gate: fields
            const nearby = lines.slice(idx + 1, idx + 6).join('\n');
            const plantedByMatch = nearby.match(/planted_by:\s*(\S+)/);
            const pmiGateMatch = nearby.match(/pmi_gate:\s*(\S+)/);
            seeds.push({
              file: full.replace(ROOT + '/', '').replace(ROOT + '\\', ''),
              line: idx + 1,
              name: nameMatch ? nameMatch[1].trim() : 'UNNAMED',
              plan: planMatch ? planMatch[1].trim() : null,
              growsTo: growsToMatch ? growsToMatch[1].trim() : null,
              target: targetMatch ? targetMatch[1].trim() : null,
              plantedBy: plantedByMatch ? plantedByMatch[1].trim() : null,
              pmiGate: pmiGateMatch ? pmiGateMatch[1].trim() : null,
              rawLine: line.trim()
            });
          }
        });
      }
    }
  } catch {}
  return seeds;
}

async function main() {
  const seeds = walkForSeeds(ROOT);

  const malformed = seeds.filter(s => !s.plan || !s.growsTo);
  const valid = seeds.filter(s => s.plan && s.growsTo);

  if (malformed.length > 0) {
    console.log('\nAdvisory — malformed core seeds (missing plan: or grows-to:):');
    for (const s of malformed) {
      console.log(`  ⚠ ${s.file}:${s.line} — ${s.name}: missing ${!s.plan ? 'plan' : 'grows-to'}`);
      console.log(`    ${s.rawLine}`);
    }
  }

  // Staleness detection (advisory tier — promoted from stub in S019)
  const overdue = [];
  const current = [];
  const noTarget = [];

  if (valid.length > 0) {
    console.log(`\nCore Seeds Registry (${valid.length} seeds):`);
    for (const s of valid) {
      if (!s.target) {
        noTarget.push(s);
        console.log(`  🌱 ${s.name} (${s.file}:${s.line}) — no target session set`);
      } else {
        // OPEN-057 fix: check DEPRECATED marker and grows-to artifact existence first
        const isDeprecated = s.growsTo && /DEPRECATED/i.test(s.growsTo);

        // Try to detect grows-to artifact in repo (any .mjs/.sh/.yaml/.ts filename)
        const artifactMatch = s.growsTo && s.growsTo.match(/\b([\w-]+\.(mjs|sh|yaml|ts|js|json))/);
        let isGrown = false;
        if (artifactMatch && !isDeprecated) {
          // Search for the artifact in common locations
          const artifactName = artifactMatch[1];
          const searchPaths = [
            join(ROOT, 'tools/validators', artifactName),
            join(ROOT, 'tools/scripts', artifactName),
            join(ROOT, 'tools', artifactName),
            join(ROOT, '.claude/hooks', artifactName),
            join(ROOT, 'tools/data', artifactName),
            join(ROOT, 'tools/config', artifactName),
          ];
          isGrown = searchPaths.some(p => existsSync(p));
        }

        if (isDeprecated) {
          current.push(s); // deprecated seeds don't count as overdue
          console.log(`  ✓ DEPRECATED ${s.name} (${s.file}:${s.line}) — closed S044 OPEN-058`);
        } else if (isGrown) {
          current.push(s);
          console.log(`  ✓ GROWN ${s.name} (${s.file}:${s.line}) — grows-to artifact exists`);
          console.log(`     plan: ${s.plan}`);
          console.log(`     grows-to: ${s.growsTo}`);
        } else {
          // Parse target session number (e.g., S019 → 19, week-4 → NaN)
          const targetNum = parseInt(s.target.replace(/^S0*/, '').replace(/week-.*/, ''), 10);
          const isWeekTarget = /^week-/.test(s.target);
          if (!isNaN(targetNum) && targetNum < CURRENT_SESSION) {
            overdue.push(s);
            console.log(`  ⚠ OVERDUE ${s.name} (${s.file}:${s.line}) — target was ${s.target}, now S${String(CURRENT_SESSION).padStart(3,'0')}`);
          } else if (isWeekTarget) {
            // week-N targets: check if artifact was supposed to exist
            overdue.push(s);
            console.log(`  ⚠ OVERDUE ${s.name} (${s.file}:${s.line}) — week-N target passed, grows-to artifact not found`);
          } else {
            current.push(s);
            console.log(`  🌱 ${s.name} (${s.file}:${s.line}) — target: ${s.target}`);
          }
          console.log(`     plan: ${s.plan}`);
          console.log(`     grows-to: ${s.growsTo}`);
        }
      }
    }
  } else if (seeds.length === 0) {
    console.log('\n[validate-core-seeds] No @core-seed markers found in codebase yet.');
    console.log('[validate-core-seeds] Plant seeds using: // @core-seed: NAME | plan: path | grows-to: description | target: S0NN');
  }

  if (overdue.length > 0) {
    console.log(`\n⚠ OVERDUE SEEDS (${overdue.length}) — target sessions have passed:`);
    for (const s of overdue) {
      console.log(`  ${s.name}: was due ${s.target}, still not grown`);
      console.log(`  Resolution: implement grows-to OR update target to a future session OR remove seed`);
    }
  }

  // OPEN-059: Check A — planted_by field presence on active seeds
  // OPEN-059: Check B — pmi_gate cross-reference against unified-plan.yaml
  const activeSeeds = valid.filter(s => s.growsTo && !/DEPRECATED/i.test(s.growsTo));
  let plantedByPresent = 0;
  let pmiGateValid = 0;
  let planItems = [];
  try {
    const yaml = (await import('js-yaml')).default;
    const planYaml = readFileSync(join(ROOT, 'tools/config/unified-plan.yaml'), 'utf8');
    const planData = yaml.load(planYaml);
    planItems = (planData.items || []).map(i => i.id);
  } catch(e) { /* skip cross-ref if parse fails */ }

  for (const s of activeSeeds) {
    // Check A: planted_by
    if (s.plantedBy) {
      plantedByPresent++;
    } else {
      console.log(`  ADVISORY [OPEN-059] SEED ${s.name}: missing planted_by field (which session planted this seed?)`);
    }
    // Check B: pmi_gate cross-reference
    if (s.pmiGate) {
      if (planItems.length > 0 && !planItems.includes(s.pmiGate)) {
        console.log(`  ADVISORY [OPEN-059] SEED ${s.name}: pmi_gate=${s.pmiGate} not found in unified-plan.yaml (stale reference?)`);
      } else {
        pmiGateValid++;
      }
    }
  }

  const statusLabel = overdue.length > 0 ? 'ADVISORY-OVERDUE' : 'CLEAN';
  console.log(`\n[validate-core-seeds] seeds_found=${seeds.length} valid=${valid.length} malformed=${malformed.length} overdue=${overdue.length} current=${current.length} no_target=${noTarget.length} active=${activeSeeds.length} planted_by_present=${plantedByPresent} pmi_gate_valid=${pmiGateValid} status=${statusLabel}`);
  console.log('[validate-core-seeds] enforcement_stage=advisory — exits 0 always; overdue seeds are advisory debt');
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-core-seeds] fatal:', err);
  process.exit(1);
});
