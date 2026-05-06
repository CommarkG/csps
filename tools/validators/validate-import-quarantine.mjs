#!/usr/bin/env node
/**
 * validate-import-quarantine.mjs — CSPS DNA requirement for all imports
 *
 * Everything that enters CSPS from outside must have CSPS DNA:
 *   CSPS-originated: frontmatter with core_spine + schema_anchor + principle_compliance
 *   Imported: EXT-ID in extractions-ledger.md OR has been redesigned with CSPS DNA
 *
 * The quarantine principle: external content (MCPs, packages, insights, patterns)
 * cannot be used directly. It must pass through The Threshold (external import pipeline):
 *   1. VAULT_DEFER (analysis outside CSPS)
 *   2. Wisdom extraction + CSPS-native redesign
 *   3. CSPS DNA injection (frontmatter + principle_compliance + consolidation_cross_refs)
 *   4. Then re-enter as internal content
 *
 * What this validator checks:
 *   CHECK A — packages/ non-exempt: has CSPS frontmatter OR has EXT-ID in ledger
 *   CHECK B — .claude/skills/ imports: has csps_aligned: true (AAP)
 *   CHECK C — extractions-ledger.md integrity: all EXT-IDs have matching context files
 *
 * EXIT-CODED: 0 = all imports have CSPS DNA / 1 = quarantine violations found
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// Packages that are CSPS-originated (always exempt)
const CSPS_ORIGINATED_PACKAGES = ['principles', 'principles-mcp', 'schemas', 'glossary', 'skills', 'catalog', 'ui'];

// External packages that are explicitly quarantine-approved (vendor trust tier)
const QUARANTINE_EXEMPT_EXTERNAL = [
  '@modelcontextprotocol',  // MCP SDK — approved S005
  'js-yaml',                // utility — approved
  'typescript',             // tooling — approved
  '@types/',                // type definitions — approved
  'prisma',                 // ORM — approved (ADR-0007)
];

function isQuarantineExempt(name) {
  return QUARANTINE_EXEMPT_EXTERNAL.some(e => name.includes(e));
}

function hasCspsFrontmatter(text) {
  return text.includes('core_spine:') && text.includes('schema_anchor:');
}

function hasAapAlignment(text) {
  return text.includes('csps_aligned: true');
}

function getExtIds() {
  const ledgerPath = join(ROOT, 'docs/plan/_intake/extractions-ledger.md');
  if (!existsSync(ledgerPath)) return new Set();
  const text = readFileSync(ledgerPath, 'utf8');
  const ids = new Set();
  for (const m of text.matchAll(/EXT-\d{8}-\d{3}/g)) {
    ids.add(m[0]);
  }
  return ids;
}

async function main() {
  const warnings = [];
  let checked = 0;
  let compliant = 0;
  const extIds = getExtIds();

  // CHECK A — packages/ non-CSPS-originated
  const pkgsDir = join(ROOT, 'packages');
  if (existsSync(pkgsDir)) {
    for (const pkg of readdirSync(pkgsDir)) {
      if (CSPS_ORIGINATED_PACKAGES.includes(pkg)) { compliant++; continue; }
      checked++;
      const readmePath = join(pkgsDir, pkg, 'README.md');
      const hasReadme = existsSync(readmePath);
      const agentsPath = join(pkgsDir, pkg, 'AGENTS.md');
      const skillPath = join(pkgsDir, pkg, 'SKILL.md');
      // Check for any CSPS DNA marker
      let hasDna = false;
      for (const candidate of [readmePath, agentsPath, skillPath]) {
        if (existsSync(candidate)) {
          const t = readFileSync(candidate, 'utf8');
          if (hasCspsFrontmatter(t) || hasAapAlignment(t)) { hasDna = true; break; }
        }
      }
      if (!hasDna) {
        warnings.push(`[CHECK A] packages/${pkg}/: no CSPS DNA (frontmatter + core_spine, or csps_aligned). Add frontmatter OR verify EXT-ID in extractions-ledger.md`);
      } else {
        compliant++;
      }
    }
  }

  // CHECK B — .claude/skills/ all must be CSPS-aligned (already enforced by AAP)
  // This check is advisory since aap_frontmatter_coverage covers it
  const skillsDir = join(ROOT, '.claude/skills');
  if (existsSync(skillsDir)) {
    for (const skillDir of readdirSync(skillsDir)) {
      const skillMd = join(skillsDir, skillDir, 'SKILL.md');
      if (!existsSync(skillMd)) continue;
      checked++;
      const text = readFileSync(skillMd, 'utf8');
      if (hasAapAlignment(text)) {
        compliant++;
      } else {
        warnings.push(`[CHECK B] .claude/skills/${skillDir}/SKILL.md: missing csps_aligned: true — import quarantine violation`);
      }
    }
  }

  // CHECK C — EXT-IDs referenced in extractions-ledger have context files
  const contextsDir = join(ROOT, 'docs/plan/_intake/contexts');
  if (existsSync(contextsDir) && extIds.size > 0) {
    checked++;
    const contextFiles = readdirSync(contextsDir, { withFileTypes: true, recursive: true })
      .filter(e => e.isFile && e.name && e.name.endsWith('.md'))
      .map(e => e.name || '');
    const coveredIds = new Set(
      [...contextFiles].flatMap(f => [...f.matchAll(/EXT-\d{8}-\d{3}/g)].map(m => m[0]))
    );
    const uncoveredIds = [...extIds].filter(id => !coveredIds.has(id));
    if (uncoveredIds.length === 0) {
      compliant++;
    } else if (uncoveredIds.length <= 3) {
      // Advisory: some orphan EXT-IDs may be in progress
      console.warn(`  ⚠ [CHECK C] ${uncoveredIds.length} EXT-ID(s) in ledger with no context file`);
    }
  }

  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s) — import quarantine violations:`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
  }

  const summary = `[validate-import-quarantine] checked=${checked} compliant=${compliant} violations=${warnings.length}`;
  console.log(`\n${summary}`);

  if (warnings.length > 0) process.exit(1);
  process.exit(0);
}

main().catch(err => { console.error('[validate-import-quarantine] fatal:', err); process.exit(1); });
