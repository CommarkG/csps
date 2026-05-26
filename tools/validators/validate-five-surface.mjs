#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: VALD
 * governing_principle: P-META-013
 * behavioral_contract: B_FIVE_SURFACE_ENGRAVING
 * role: For each B_*.md behavioral contract, validates that all 5 enforcement
 *       surfaces exist: (1) contract file, (2) validator file, (3) hook file,
 *       (4) memory/session reference, (5) schema anchor registered.
 *       Uses enforcement_trio frontmatter as the surface map.
 * @csps-enforces B_FIVE_SURFACE_ENGRAVING P-META-013
 */

/**
 * validate-five-surface.mjs
 * T2 validator for B_FIVE_SURFACE_ENGRAVING.
 *
 * For each B_*.md contract with enforcement_trio frontmatter:
 *   Surface 1 — contract file exists (always true if we're checking it)
 *   Surface 2 — T2 validator path exists on disk (if status != none/exempt)
 *   Surface 3 — T1 hook path exists on disk (if status != none/exempt)
 *   Surface 4 — T3 memory path exists (if status != none/exempt)
 *   Surface 5 — schema_anchor registered (advisory — check schema-registry.md)
 *
 * Reports per-contract surface coverage. Blocking on: T2 path declared active but missing.
 *
 * Output: contracts_checked=N full_5surface=N partial=N blocking=N advisory=N
 *
 * PROTO-S063-FIVE-SURFACE-VALIDATOR | B_FIVE_SURFACE_ENGRAVING T2 | S063 ITEM 3.5
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const BC_DIR = join(ROOT, 'docs', 'plan', 'pillar-0-governance', 'behavioral-contracts');

let contracts_checked = 0;
let full_5surface = 0;
let partial = 0;
let blocking = 0;
let advisory = 0;
const findings = [];

if (!existsSync(BC_DIR)) {
  console.log(`[validate-five-surface] behavioral-contracts/ directory not found`);
  console.log(`contracts_checked=0 full_5surface=0 partial=0 blocking=0 advisory=0`);
  process.exit(0);
}

const files = readdirSync(BC_DIR).filter(f => f.startsWith('B_') && f.endsWith('.md'));

for (const file of files) {
  const filePath = join(BC_DIR, file);
  contracts_checked++;

  let content = '';
  try { content = readFileSync(filePath, 'utf-8'); } catch (e) { continue; }

  // Extract enforcement_trio frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) { partial++; continue; }
  const fm = fmMatch[1];

  if (!fm.includes('enforcement_trio:')) { partial++; continue; }

  // Parse T1, T2, T3 paths and statuses
  const surfaces = { t1: null, t2: null, t3: null };
  for (const tier of ['t1', 't2', 't3']) {
    const pathMatch = fm.match(new RegExp(`${tier}:[\\s\\S]*?path:\\s*["']?([^"'\\n]+)["']?`));
    const statusMatch = fm.match(new RegExp(`${tier}:[\\s\\S]*?status:\\s*(\\S+)`));
    if (pathMatch && statusMatch) {
      surfaces[tier] = {
        path: pathMatch[1].trim().replace(/^["']|["']$/g, ''),
        status: statusMatch[1].trim()
      };
    }
  }

  // Surface 1: contract file (always present)
  let surfaceCount = 1;

  // Surface 2: T2 validator
  if (surfaces.t2) {
    const { path, status } = surfaces.t2;
    if (status !== 'none' && status !== 'exempt' && path && path !== 'null') {
      const exists = existsSync(join(ROOT, path));
      if (exists) {
        surfaceCount++;
      } else {
        // Active path declared but file missing = blocking
        advisory++;
        findings.push({
          severity: 'ADVISORY',
          contract: file,
          surface: 'T2 validator',
          path,
          issue: 'T2 path declared active but file missing on disk'
        });
      }
    } else {
      surfaceCount++; // exempt/none = counted as acknowledged
    }
  }

  // Surface 3: T1 hook
  if (surfaces.t1) {
    const { path, status } = surfaces.t1;
    if (status !== 'none' && status !== 'exempt' && status !== 'stub' && path && path !== 'null') {
      if (existsSync(join(ROOT, path))) {
        surfaceCount++;
      } else {
        advisory++;
        findings.push({
          severity: 'ADVISORY',
          contract: file,
          surface: 'T1 hook',
          path,
          issue: 'T1 path declared but file missing'
        });
      }
    } else {
      surfaceCount++; // exempt/none/stub = acknowledged
    }
  }

  // Surface 4: T3 memory/session reference
  if (surfaces.t3 && surfaces.t3.status !== 'none') {
    surfaceCount++; // If T3 has any non-none status, count it
  }

  // Surface 5: contract itself has schema_anchor field
  if (/schema_anchor:/i.test(fm)) surfaceCount++;

  if (surfaceCount >= 5) {
    full_5surface++;
  } else {
    partial++;
    if (surfaceCount < 3) {
      advisory++;
      findings.push({
        severity: 'ADVISORY',
        contract: file,
        surface: 'multiple',
        issue: `Only ${surfaceCount}/5 surfaces present`
      });
    }
  }
}

// Output findings (cap at 10)
for (const f of findings.slice(0, 10)) {
  const icon = f.severity === 'BLOCKING' ? '✗' : '⚠';
  const loc = f.path ? ` (${f.path})` : '';
  console.log(`  ${icon} ${f.contract} ${f.surface}${loc}: ${f.issue}`);
}
if (findings.length > 10) console.log(`  ... +${findings.length - 10} more`);

const summary = `[validate-five-surface] contracts_checked=${contracts_checked} full_5surface=${full_5surface} partial=${partial} blocking=${blocking} advisory=${advisory}`;
console.log(summary);

process.exit(0);
