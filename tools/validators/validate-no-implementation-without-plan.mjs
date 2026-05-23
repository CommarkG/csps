#!/usr/bin/env node
/**
 * validate-no-implementation-without-plan.mjs — construction gate
 *
 * ROOT CAUSE TARGETED: The platform has no mechanical gate between "thinking about X"
 * and "building X". Code can accumulate in libs/ packages/ apps/ src/ without a
 * ratified multi-session plan. This contradicts the platform's core claim that
 * AI-native governance is structural.
 *
 * Per AGENTS.md hard NO: "Never start multi-session topic without templated
 * gradual-build-plan instance (depth ∈ {3,4,5})"
 * Per EP-011 (build-without-plan) + P-OP-002 (FWWS) + B_GRADUAL_BUILD_BY_FOUNDATIONS
 *
 * What it checks:
 *   SCAN implementation directories: libs/ apps/ src/ packages/
 *   For each directory with .ts/.mjs/.zmodel files:
 *     Check if a corresponding active topic-plan exists in topic-plans/
 *     OR the code is in a KNOWN-EXEMPT package (principles, principles-mcp, schemas,
 *     glossary — these are platform governance infrastructure)
 *   Warn if code directory has files but no matching topic-plan
 *
 * EXIT-CODED: 0 = all implementations have backing plans / 1 = unplanned code found
 */

import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// Directories to scan for implementation code
const IMPL_DIRS = ['libs', 'apps', 'src'];

// Governance files to check: new validators and hooks should have backing plan items
// Extended S053-B Step 8 to cover tools/validators/ and .claude/hooks/
const GOVERNANCE_DIRS = [
  { dir: 'tools/validators', pattern: /^validate-.*\.mjs$/, type: 'validator' },
  { dir: '.claude/hooks', pattern: /\.sh$/, type: 'hook' },
];

// Packages that are EXEMPT (platform governance infrastructure)
const EXEMPT_PACKAGES = [
  'principles',        // governance registry
  'principles-mcp',   // governance MCP server
  'schemas',          // IntakeEvent + core type definitions
  'glossary',         // vocabulary — infrastructure
  'ui',              // shared UI if it exists
];

// File extensions that indicate implementation code
const CODE_EXTENSIONS = ['.ts', '.tsx', '.mjs', '.cjs', '.zmodel', '.sql', '.prisma'];

function hasCodeFiles(dirPath) {
  if (!existsSync(dirPath)) return false;
  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && CODE_EXTENSIONS.some(ext => entry.name.endsWith(ext))) return true;
      if (entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.startsWith('node_modules')) {
        if (hasCodeFiles(join(dirPath, entry.name))) return true;
      }
    }
    return false;
  } catch { return false; }
}

function getActivePlans() {
  const plansDir = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');
  if (!existsSync(plansDir)) return { topics: new Set(), coveredPaths: new Set() };
  const activeTopics = new Set();
  const coveredPaths = new Set();
  const files = readdirSync(plansDir).filter(f => f.endsWith('.md') && f !== 'README.md');
  for (const f of files) {
    const text = readFileSync(join(plansDir, f), 'utf8');
    const lifecycleMatch = text.match(/^lifecycle_state:\s*(.+)$/m);
    if (lifecycleMatch && lifecycleMatch[1].trim() === 'active') {
      const topicMatch = text.match(/^topic_id:\s*(.+)$/m);
      const nameMatch = text.match(/^name:\s*(.+)$/m);
      if (topicMatch) activeTopics.add(topicMatch[1].trim());
      if (nameMatch) activeTopics.add(nameMatch[1].trim());
      activeTopics.add(basename(f, '.md'));
      // Check covered_paths field: covered_paths: [libs/policies/]
      const pathsMatch = text.match(/^covered_paths:\s*\[(.+)\]/m);
      if (pathsMatch) {
        for (const p of pathsMatch[1].split(',')) {
          coveredPaths.add(p.trim().replace(/['"]/g, '').replace(/\/$/, ''));
        }
      }
    }
  }
  return { topics: activeTopics, coveredPaths };
}

function isPlatformInfra(pkgName) {
  return EXEMPT_PACKAGES.some(e => pkgName.startsWith(e) || pkgName === e);
}

async function main() {
  const warnings = [];
  const { topics: activePlans, coveredPaths } = getActivePlans();
  let checked = 0;
  let exempt = 0;

  // Check implementation directories
  for (const implDir of IMPL_DIRS) {
    const absDir = join(ROOT, implDir);
    if (!existsSync(absDir)) continue;

    const subDirs = readdirSync(absDir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name);

    for (const sub of subDirs) {
      const subPath = join(absDir, sub);
      if (!hasCodeFiles(subPath)) continue;
      checked++;

      if (isPlatformInfra(sub)) {
        exempt++;
        continue;
      }

      // Check covered_paths from topic-plans (explicit directory coverage)
      const fullRelPath = `${implDir}/${sub}`;
      if ([...coveredPaths].some(cp => fullRelPath.startsWith(cp) || cp.startsWith(fullRelPath))) {
        continue; // covered by a plan via covered_paths field
      }

      // Check if any active plan name matches this directory
      const hasPlan = [...activePlans].some(plan =>
        plan.toLowerCase().includes(sub.toLowerCase()) ||
        sub.toLowerCase().includes(plan.toLowerCase())
      );

      if (!hasPlan) {
        warnings.push(
          `UNPLANNED CODE: ${implDir}/${sub}/ has implementation files but no matching active topic-plan.\n` +
          `  Fix: create a depth-3/4/5 gradual-build-plan for this work area before continuing.\n` +
          `  Per AGENTS.md hard NO + B_GRADUAL_BUILD_BY_FOUNDATIONS + P-OP-002 FWWS`
        );
      }
    }
  }

  // Also check packages/ for non-exempt packages with code
  const pkgsDir = join(ROOT, 'packages');
  if (existsSync(pkgsDir)) {
    const pkgs = readdirSync(pkgsDir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name);

    for (const pkg of pkgs) {
      const pkgSrcPath = join(pkgsDir, pkg, 'src');
      if (!hasCodeFiles(pkgSrcPath) && !hasCodeFiles(join(pkgsDir, pkg))) continue;
      checked++;

      if (isPlatformInfra(pkg)) { exempt++; continue; }

      const pkgRelPath = `packages/${pkg}`;
      if ([...coveredPaths].some(cp => pkgRelPath.startsWith(cp) || cp.startsWith(pkgRelPath))) continue;

      const hasPlan = [...activePlans].some(plan =>
        plan.toLowerCase().includes(pkg.toLowerCase()) ||
        pkg.toLowerCase().includes(plan.toLowerCase())
      );

      if (!hasPlan) {
        warnings.push(
          `UNPLANNED CODE: packages/${pkg}/ has code but no matching active topic-plan.`
        );
      }
    }
  }

  // --- GOVERNANCE FILES CHECK (S053-B Step 8) ---
  // New validators and hooks should have backing plan items or be exempt (grandfathered pre-S053).
  // Advisory only — gradual adoption.
  const govWarnings = [];
  for (const { dir, pattern, type } of GOVERNANCE_DIRS) {
    const absDir = join(ROOT, dir);
    if (!existsSync(absDir)) continue;
    const files = readdirSync(absDir).filter(f => pattern.test(f));
    for (const file of files) {
      const slug = file.replace(/\.(mjs|sh)$/, '').replace(/^validate-/, '');
      const hasPlan = [...activePlans].some(plan =>
        plan.toLowerCase().includes(slug.toLowerCase()) ||
        slug.toLowerCase().includes(plan.toLowerCase().slice(0, 8))
      );
      if (!hasPlan) {
        govWarnings.push(`UNPLANNED ${type.toUpperCase()}: ${dir}/${file} — no matching plan item. Per EXPLORE-RATIFY-EXECUTE protocol.`);
      }
    }
  }

  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s) — unplanned implementation detected:`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
  }

  if (govWarnings.length > 0) {
    // Report count only — individual listing would flood output (most predate plan item system)
    // See EXPLORE-RATIFY-EXECUTE.md for the protocol: new governance files SHOULD have plan items
    console.warn(`\n[validate-no-implementation-without-plan] ADVISORY: ${govWarnings.length} governance files (validators/hooks) without matching plan items.`);
    console.warn(`  Advisory only — most predate the EXPLORE-RATIFY-EXECUTE protocol. New additions (S053+) should cite plan item ID.`);
    console.warn(`  See: docs/plan/pillar-0-governance/EXPLORE-RATIFY-EXECUTE.md`);
  }

  const summary = `[validate-no-implementation-without-plan] checked=${checked} exempt=${exempt} unplanned=${warnings.length} gov_advisory=${govWarnings.length}`;
  console.log(`\n${summary}`);

  // Advisory: exit 0 always (foundational; would exit 1 when Ring 3 construction begins)
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-no-implementation-without-plan] fatal:', err);
  process.exit(1);
});
