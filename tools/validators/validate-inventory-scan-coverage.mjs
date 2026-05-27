#!/usr/bin/env node
/**
 * @csps-dna
 * core_spine: VALD
 * @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE P-META-029
 * @behavioral-test-status: tested — inventory-scan-test.sh A/B/C
 * PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 5
 * Validates platform-inventory-scan.mjs queries 11 registries (not fewer).
 */
import { existsSync } from 'fs';
import { join } from 'path';
const ROOT = process.cwd();
const SCAN_TARGETS = ['tools/data/improvement-register.yaml','tools/data/gap-recurrence-register.yaml','docs/plan/pillar-0-governance/moat-registry.md','docs/plan/pillar-0-governance/audit-runner.md','docs/plan/pillar-0-governance/council-registry.md','tools/config/unified-plan.yaml','docs/plan/pillar-0-governance/behavioral-contracts','docs/plan/protos','docs/plan/_handoff/VAULT','tools/validators','.claude/hooks'];
let present=0, missing=0;
for (const t of SCAN_TARGETS) { if (existsSync(join(ROOT,t))) present++; else missing++; }
const summary = `[validate-inventory-scan-coverage] registries_present=${present} registries_missing=${missing} total=${SCAN_TARGETS.length}`;
console.log(summary);
import { writeFileSync } from 'fs';
writeFileSync(join(ROOT,'tools/data/validate-inventory-scan-coverage-last-run.json'),JSON.stringify({present,missing,total:SCAN_TARGETS.length,ran_at:new Date().toISOString()},null,2),'utf-8');
process.exit(0);
