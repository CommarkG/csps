#!/usr/bin/env node
/**
 * validate-template-compliance.mjs — Domain Card Template Compliance Gate
 *
 * ROOT CAUSE TARGETED (S018 Governor directive — template propagation seed):
 *   The domain-card.template.md is the single source of truth for all §1-§11 artifacts.
 *   When the template evolves (schema_version bump), all artifacts at an older
 *   template_version become stale. Without this validator, template evolution silently
 *   creates inconsistency across all domain card instances.
 *
 * What it checks:
 *   1. All artifacts with template_used: domain-card have template_version populated
 *   2. artifact template_version matches current template schema_version
 *   3. All 11 required sections (§1-§11) are present in each artifact
 *
 * Exit codes:
 *   0 = all compliant (all artifacts at current template version with all sections)
 *   1 = stale artifacts detected (template_version mismatch or missing sections)
 *
 * Resolution:
 *   For stale artifacts: review template diff (schema_version history table),
 *   update artifact to match new template requirements, bump template_version.
 *   For missing sections: add the section (N/A is acceptable for sub-fields).
 *
 * enforcement_stage: planned (week-4)
 * registered: S018 — template propagation seed
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const TEMPLATE_PATH = join(ROOT, 'tools/templates/domain-card.template.md');
const DOCS_PATH = join(ROOT, 'docs');

// STUB TIER — exits 0 always during initial deployment
// Week-4 promotion: remove the stub block below and enable full validation
const STUB_MODE = true;

const REQUIRED_SECTIONS = ['§1', '§2', '§3', '§4', '§5', '§6', '§7', '§8', '§9', '§10', '§11'];

function extractFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w[\w_-]*):\s*(.+)/);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return fm;
}

function getCurrentTemplateVersion() {
  if (!existsSync(TEMPLATE_PATH)) return null;
  const text = readFileSync(TEMPLATE_PATH, 'utf8');
  const fm = extractFrontmatter(text);
  return fm.schema_version || null;
}

function findDomainCardArtifacts() {
  // Find all .md files in docs/platform-audit with template_used: domain-card
  const artifacts = [];
  const pattern = join(DOCS_PATH, 'platform-audit', '**', '*.md');

  // Manual glob using recursive directory search
  function walkDir(dir) {
    try {
      const { readdirSync, statSync } = require('node:fs');
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const stat = statSync(full);
        if (stat.isDirectory()) walkDir(full);
        else if (entry.endsWith('.md')) {
          const text = readFileSync(full, 'utf8');
          const fm = extractFrontmatter(text);
          if (fm.template_used === 'domain-card') {
            artifacts.push({ path: full, fm, text });
          }
        }
      }
    } catch {}
  }
  walkDir(join(DOCS_PATH, 'platform-audit'));
  return artifacts;
}

async function main() {
  if (STUB_MODE) {
    // STUB: log findings but always exit 0
    const currentVersion = getCurrentTemplateVersion();
    const artifacts = findDomainCardArtifacts();

    const stale = artifacts.filter(a => a.fm.template_version !== currentVersion);
    const missingSections = artifacts.filter(a =>
      REQUIRED_SECTIONS.some(s => !a.text.includes(s))
    );

    if (stale.length > 0) {
      console.log(`\nAdvisory — stale domain card artifacts (template_version mismatch):`);
      for (const a of stale) {
        const rel = a.path.replace(ROOT + '/', '');
        console.log(`  ⚠ ${rel}: template_version=${a.fm.template_version || 'missing'} (current: ${currentVersion})`);
      }
    }

    if (missingSections.length > 0) {
      console.log(`\nAdvisory — domain cards missing required sections:`);
      for (const a of missingSections) {
        const missing = REQUIRED_SECTIONS.filter(s => !a.text.includes(s));
        const rel = a.path.replace(ROOT + '/', '');
        console.log(`  ⚠ ${rel}: missing ${missing.join(', ')}`);
      }
    }

    console.log(`\n[validate-template-compliance] STUB — artifacts=${artifacts.length} stale=${stale.length} missing_sections=${missingSections.length} current_template_version=${currentVersion}`);
    console.log(`[validate-template-compliance] enforcement_stage=planned — week-4 promotes to blocking`);
    process.exit(0);
  }

  // ACTIVE MODE (week-4) — uncomment when promoting
  // ...full blocking validation here...
}

main().catch(err => {
  console.error('[validate-template-compliance] fatal:', err);
  process.exit(1);
});
