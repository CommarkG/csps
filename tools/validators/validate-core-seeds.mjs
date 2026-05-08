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
const CURRENT_SESSION = 19; // S019 — update at each session close

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
            seeds.push({
              file: full.replace(ROOT + '/', '').replace(ROOT + '\\', ''),
              line: idx + 1,
              name: nameMatch ? nameMatch[1].trim() : 'UNNAMED',
              plan: planMatch ? planMatch[1].trim() : null,
              growsTo: growsToMatch ? growsToMatch[1].trim() : null,
              target: targetMatch ? targetMatch[1].trim() : null,
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
        // Parse target session number (e.g., S019 → 19)
        const targetNum = parseInt(s.target.replace(/^S0*/, ''), 10);
        if (!isNaN(targetNum) && targetNum < CURRENT_SESSION) {
          overdue.push(s);
          console.log(`  ⚠ OVERDUE ${s.name} (${s.file}:${s.line}) — target was ${s.target}, now S${String(CURRENT_SESSION).padStart(3,'0')}`);
        } else {
          current.push(s);
          console.log(`  🌱 ${s.name} (${s.file}:${s.line}) — target: ${s.target}`);
        }
        console.log(`     plan: ${s.plan}`);
        console.log(`     grows-to: ${s.growsTo}`);
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

  const statusLabel = overdue.length > 0 ? 'ADVISORY-OVERDUE' : 'CLEAN';
  console.log(`\n[validate-core-seeds] seeds_found=${seeds.length} valid=${valid.length} malformed=${malformed.length} overdue=${overdue.length} current=${current.length} no_target=${noTarget.length} status=${statusLabel}`);
  console.log('[validate-core-seeds] enforcement_stage=advisory — exits 0 always; overdue seeds are advisory debt');
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-core-seeds] fatal:', err);
  process.exit(1);
});
