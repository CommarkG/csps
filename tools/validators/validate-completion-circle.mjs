#!/usr/bin/env node
/**
 * validate-completion-circle.mjs — Platform Completion Circle Gate
 *
 * ROOT CAUSE TARGETED (S021 Governor directive):
 *   The platform defines "implemented" as code exists + tests pass.
 *   Real COMPLETION requires a full closed circle: the element must have
 *   extracted value at ALL relevant surfaces, not just be technically present.
 *
 * The CSPS Completion Circle (all 5 must be present for COMPLETE status):
 *   1. SCHEMA    — data model exists (ZModel or frontmatter schema_anchor)
 *   2. LOGIC     — business logic implemented (API route, lib function, or validator)
 *   3. DEVELOPER — developer-facing surface (API doc, lib export, or dev-accessible endpoint)
 *   4. USER      — external user value statement (how does this serve the end user?)
 *   5. HARVEST   — wisdom extracted (wisdom_class set, or insight vaulted)
 *
 * Current gap (S021 discovery):
 *   Most platform elements are at circles 1-2 only.
 *   Circle 3 (developer frontend) is 0% — no developer docs, no SDK.
 *   Circle 4 (external user value) is 0% — no assessments.
 *   Circle 5 (harvest) is partial — some insights vaulted, most not.
 *
 * Coverage Levels:
 *   ✓ Level 1: Scan governance artifacts for developer_surface and user_value fields
 *   ✓ Level 2: Flag elements with cdp_status=implemented but missing completion circle
 *   ✗ Level 3: Verify developer_surface actually resolves to working endpoint → VLT-S021-DEV-SURFACE
 *   ✗ Level 4: Measure actual user value from usage data → VLT-S021-USER-VALUE-MEASURE
 *
 * When this validator exits 0, it proves: completion circle fields are defined
 * When this validator exits 0, it does NOT prove: the surfaces actually work
 *
 * Exit codes:
 *   0 = advisory or measurement stage (never blocks)
 *   (future: 1 = BLOCKING when element claims cdp_status=sealed but circle incomplete)
 *
 * New frontmatter fields this validator promotes (add to frontmatter-closed-enums.md):
 *   developer_surface: "none" | "api-route" | "lib-export" | "mcp-query" | "sdk" | "documented"
 *   user_value: null | "[one-sentence description of external user benefit]"
 *   completion_circle: "schema" | "schema+logic" | "schema+logic+dev" | "schema+logic+dev+user" | "full"
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// Artifacts to scan for completion circle assessment
const SCAN_DIRS = [
  'docs/platform-audit',
  'docs/plan/pillar-0-governance',
];

// Exempt paths
const EXEMPT = [
  'node_modules', '.git', 'audit-runner', 'behavioral-contracts',
  'governor-prompts', 'VAULT', 'README',
];

function isExempt(path) {
  return EXEMPT.some(ex => path.includes(ex));
}

function extractFrontmatterField(content, field) {
  const m = content.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim().replace(/['"]/g, '') : null;
}

function hasFrontmatter(content) {
  return content.startsWith('---');
}

function walkDir(dir, results = []) {
  if (!existsSync(dir)) return results;
  try {
    for (const entry of readdirSync(dir)) {
      if (isExempt(entry)) continue;
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) walkDir(full, results);
      else if (entry.endsWith('.md')) results.push(full);
    }
  } catch {}
  return results;
}

async function main() {
  const files = [];
  for (const dir of SCAN_DIRS) {
    walkDir(join(ROOT, dir), files);
  }

  const incomplete = [];
  const noDevSurface = [];
  const noUserValue = [];
  const partial = [];
  const assessed = [];

  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf8');
      if (!hasFrontmatter(content)) continue;

      const cdpStatus = extractFrontmatterField(content, 'cdp_status');
      const implStatus = extractFrontmatterField(content, 'impl_status');
      const devSurface = extractFrontmatterField(content, 'developer_surface');
      const userValue = extractFrontmatterField(content, 'user_value');
      const completionCircle = extractFrontmatterField(content, 'completion_circle');
      const name = extractFrontmatterField(content, 'name') || file.split('/').pop();
      const relPath = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');

      // Only assess items that claim to be implemented
      const isImplemented = cdpStatus === 'implemented' || cdpStatus === 'zf-achieved' ||
                            cdpStatus === 'measured' || cdpStatus === 'sealed' ||
                            implStatus === 'swift-implemented' || implStatus === 'implemented';

      if (!isImplemented) continue;

      assessed.push(name);

      // Check completion circle
      const hasDevSurface = devSurface && devSurface !== 'none' && devSurface !== 'null';
      const hasUserValue = userValue && userValue !== 'null' && userValue.length > 5;

      if (!hasDevSurface) noDevSurface.push({ name, path: relPath, cdpStatus, devSurface });
      if (!hasUserValue) noUserValue.push({ name, path: relPath, cdpStatus, userValue });

      if (!hasDevSurface && !hasUserValue) {
        incomplete.push({ name, path: relPath, circle: 'schema+logic only' });
      } else if (!hasDevSurface || !hasUserValue) {
        partial.push({ name, path: relPath, circle: completionCircle || 'partial' });
      }

    } catch {}
  }

  // Report
  if (noDevSurface.length > 0) {
    console.log(`\n⚠ ELEMENTS WITHOUT DEVELOPER SURFACE (${noDevSurface.length}):`);
    console.log('  These are implemented but have no developer-facing API, lib export, or documentation.');
    for (const item of noDevSurface.slice(0, 10)) {
      console.log(`  → ${item.name} [${item.cdpStatus || 'unknown'}] — ${item.path}`);
      console.log(`     Add: developer_surface: "api-route|lib-export|mcp-query|sdk|documented"`);
    }
    if (noDevSurface.length > 10) console.log(`  ... and ${noDevSurface.length - 10} more`);
  }

  if (noUserValue.length > 0) {
    console.log(`\n⚠ ELEMENTS WITHOUT USER VALUE STATEMENT (${noUserValue.length}):`);
    console.log('  These are implemented but have no assessment of external user benefit.');
    for (const item of noUserValue.slice(0, 10)) {
      console.log(`  → ${item.name} — ${item.path}`);
      console.log(`     Add: user_value: "[one sentence: how does this serve the end user?]"`);
    }
    if (noUserValue.length > 10) console.log(`  ... and ${noUserValue.length - 10} more`);
  }

  if (incomplete.length > 0) {
    console.log(`\n⚠ PARTIALLY IMPLEMENTED (circle: schema+logic only, ${incomplete.length} items):`);
    for (const item of incomplete.slice(0, 5)) {
      console.log(`  → ${item.name} — ${item.path}`);
    }
    if (incomplete.length > 5) console.log(`  ... and ${incomplete.length - 5} more`);
  }

  console.log(`
COMPLETION CIRCLE DEFINITION (CSPS platform standard):
  COMPLETE = schema ✓ + logic ✓ + developer_surface ✓ + user_value ✓ + wisdom harvested ✓
  PARTIAL  = implemented but 1-4 circles missing
  SCAFFOLD = schema only (early stage)

Add to implemented artifacts:
  developer_surface: "api-route|lib-export|mcp-query|sdk|documented|none"
  user_value: "[How does this serve external users? null if platform-internal only]"
  completion_circle: "schema|schema+logic|schema+logic+dev|schema+logic+dev+user|full"
`);

  const totalAssessed = assessed.length;
  const totalIncomplete = noDevSurface.length + noUserValue.length;

  console.log(`[validate-completion-circle] assessed=${totalAssessed} no_dev_surface=${noDevSurface.length} no_user_value=${noUserValue.length} incomplete=${incomplete.length} partial=${partial.length} stage=measurement`);

  process.exit(0); // advisory — always 0
}

main().catch(err => {
  console.error('[validate-completion-circle] fatal:', err);
  process.exit(1);
});
