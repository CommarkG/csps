#!/usr/bin/env node
// validate-pe-situation-declared.mjs — confirms active_situation in session-state.json
// ADVISORY: session-state should declare which PE situation is active
// Audit slug: pe-situation-declared

import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());
const SITUATION_REGISTRY = join(ROOT, 'docs/plan/pillar-0-governance/pe-situation-registry.md');

function main() {
  const statePath = join(ROOT, 'tools/session-state.json');
  if (!existsSync(statePath)) {
    console.log('[validate-pe-situation-declared] session-state.json not found — skip');
    process.exit(0);
  }

  const state = JSON.parse(readFileSync(statePath, 'utf8'));
  const activeSituation = state.session_mandate?.situation || state.active_situation;
  const registryExists = existsSync(SITUATION_REGISTRY);

  if (!activeSituation) {
    console.log('  ⚠ No active_situation declared in session-state.json');
    console.log('  → Add: session_mandate.situation: "APP_BUILD_MODE" (or current situation)');
    console.log(`\n[validate-pe-situation-declared] situation=MISSING registry=${registryExists}`);
    process.exit(0); // Advisory
  }

  // Verify the situation is in the registry
  if (registryExists) {
    const registry = readFileSync(SITUATION_REGISTRY, 'utf8');
    const isInRegistry = registry.includes(activeSituation);
    if (isInRegistry) {
      console.log(`  ✅ Active situation "${activeSituation}" declared and found in registry`);
    } else {
      console.log(`  ⚠ Situation "${activeSituation}" not found in pe-situation-registry.md`);
    }
  } else {
    console.log(`  ✅ Active situation declared: "${activeSituation}" (registry not found — advisory)`);
  }

  console.log(`\n[validate-pe-situation-declared] situation=${activeSituation} registry=${registryExists}`);
  process.exit(0);
}

main();
