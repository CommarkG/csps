#!/usr/bin/env node
/**
 * validate-default-shape.mjs
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields in last-run JSON). All blocking decisions are structural/deterministic (field presence, count checks, schema conformance). Not in any blocking decision path.
 *
 * @csps-dna
 * core_spine: AI
 * @csps-enforces P-META-031 D14-unverified-agreement HARDWIRE-B1
 * @csps-prevention-class NEW-DEFAULT-WITHOUT-REASONING-REFRAME-ADOPTED-VALUE
 * @behavioral-test-status: inline — add entry lacking fields → exit 1
 *
 * Validates that every entry in default-correction-registry.yaml has the
 * P-META-031 Reasoned-Adoption shape:
 *   - counter_instruction (existing field — what fires at K≥gate)
 *   - reasoning (WHY the training default is wrong in this context)
 *   - reframe (FROM the prohibition TO the alternative identity-value)
 *   - adopted_value (the positive behavior the AI adopts, not just avoids)
 *
 * BLOCKING (exit 1) for entries added AFTER S075 (id > D14) missing the shape.
 * ADVISORY for legacy entries D1-D14 (grandfathered unless retrofitted).
 *
 * Rationale (P-META-031): enforcement without reasoning produces D11 (rigid-rule-
 * satisfaction). Every override needs: REASONING why the default fires wrongly +
 * REFRAME from prohibition to positive identity + ADOPTED_VALUE for the AI to
 * internalize. Counter-instruction alone = T3-only (will drift).
 *
 * Source: PROTO-S075-MASTER B1 — P-META-031 Reasoned-Adoption.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import yaml from 'js-yaml';

const ROOT = resolve(process.cwd());
const REGISTRY = join(ROOT, 'tools/data/default-correction-registry.yaml');
const LAST_RUN = join(ROOT, 'tools/data/validate-default-shape-last-run.json');

// Defaults registered before S075 — advisory only (grandfathered)
const LEGACY_IDS = new Set(['D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12','D14']);

const REQUIRED_SHAPE_FIELDS = ['counter_instruction', 'reasoning', 'reframe', 'adopted_value'];

function main() {
  if (!existsSync(REGISTRY)) {
    console.log('[validate-default-shape] registry not found — skipping');
    process.exit(0);
  }

  let reg;
  try {
    reg = yaml.load(readFileSync(REGISTRY, 'utf8'));
  } catch (e) {
    console.log(`[validate-default-shape] parse error: ${e.message}`);
    process.exit(1);
  }

  const defaults = reg.defaults || [];
  let blocking = 0;
  let advisory = 0;
  const findings = [];

  for (const entry of defaults) {
    const id = entry.id || '(unnamed)';
    const isLegacy = LEGACY_IDS.has(id);
    const missingFields = REQUIRED_SHAPE_FIELDS.filter(f => !entry[f] || String(entry[f]).trim() === '');

    if (missingFields.length > 0) {
      if (isLegacy) {
        // Advisory for legacy — retroactively fixing is good but not blocking
        // D7/D11/D12 are now retrofitted; D1-D6/D8-D10 still advisory
        const retrofitted = ['D7','D11','D12','D14'].includes(id);
        if (!retrofitted) {
          advisory++;
          findings.push(`[ADVISORY] ${id} (legacy): missing P-META-031 shape fields: ${missingFields.join(', ')} — retrofit when significant`);
        }
      } else {
        // NEW defaults (D15+) MUST have the full shape
        blocking++;
        findings.push(
          `BLOCKING: ${id} (new): missing required P-META-031 shape fields: ${missingFields.join(', ')}. ` +
          `Every new D* entry requires reasoning + reframe + adopted_value (P-META-031 Reasoned-Adoption). ` +
          `Enforcement alone (counter_instruction only) = T3-only = will drift.`
        );
      }
    }
  }

  for (const f of findings) {
    if (f.startsWith('BLOCKING')) console.log(`  ✗ ${f}`);
    else console.log(`  ${f}`);
  }

  try {
    writeFileSync(LAST_RUN, JSON.stringify({
      run_at: new Date().toISOString(),
      entries_checked: defaults.length,
      blocking,
      advisory,
    }, null, 2) + '\n');
  } catch { /* non-fatal */ }

  console.log(`[validate-default-shape] entries=${defaults.length} blocking=${blocking} advisory=${advisory}`);

  if (blocking > 0) process.exit(1);
  process.exit(0);
}

main();
