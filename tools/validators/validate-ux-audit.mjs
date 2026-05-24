#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-ux-audit
 * @csps-name validate-ux-audit
 * @csps-description T2 UX audit validator — scans apps/csps-playground/src/app/platform/
 *   for pageDNA, purpose field, and PageContext/PageHeader import. Reports pages missing
 *   full context declaration (score < 3/3). Advisory; also feeds Audit Pipeline 6.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:util domain:ux-governance audience:platform
 * @csps-enforces UX-PREVENTION-ARCHITECTURE.md
 * @csps-ns_quality core-first, self-improving
 *
 * ALIGNMENT:
 *   WHO: pnpm verify orchestrator + pnpm audit:run (Pipeline 6)
 *   WHAT: Detect platform pages with incomplete UX context declaration
 *   PREVENTS: Pages without pageDNA, purpose, or PageContext being silently deployed
 *   RISK: T2 detection only — T1 (pre-tool-use-ux-creation-gate.sh) prevents at write time
 *   SCOPE: Reads apps/csps-playground/src/app/platform/**\/page.tsx; no network calls
 *
 * CHECKS:
 *   1. pageDNA declared (const pageDNA = ... or pageDNA = ...)
 *   2. purpose field in pageDNA
 *   3. PageContext or PageHeader import
 *   Score 0-3 per page; advisory if score < 3; BLOCKING if coverage < 50% AND > 10 pages
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PLATFORM_DIR = join(ROOT, 'apps/csps-playground/src/app/platform');

const errors = [];
const warnings = [];

/** @typedef {{ slug: string, hasDNA: boolean, hasPurpose: boolean, hasContext: boolean, score: number }} PageAudit */

/**
 * Recursively scan platform directory for page.tsx files and audit them.
 * @returns {PageAudit[]}
 */
function auditPlatformPages() {
  const results = [];

  function scanDir(dir, prefix = '') {
    try {
      const entries = readdirSync(dir);
      for (const entry of entries) {
        const full = join(dir, entry);
        try {
          const st = statSync(full);
          if (st.isDirectory()) {
            scanDir(full, prefix ? `${prefix}/${entry}` : entry);
          } else if (entry === 'page.tsx') {
            try {
              const content = readFileSync(full, 'utf-8');
              const hasDNA = /const\s+pageDNA\s*=|pageDNA\s*=\s*\{/.test(content);
              const hasPurpose = hasDNA && /purpose\s*:/.test(content);
              const hasContext = /PageContext|PageHeader/.test(content);
              const score = (hasDNA ? 1 : 0) + (hasPurpose ? 1 : 0) + (hasContext ? 1 : 0);
              const slug = prefix || 'index';
              results.push({ slug, hasDNA, hasPurpose, hasContext, score });
            } catch { /* skip unreadable */ }
          }
        } catch { /* skip inaccessible entries */ }
      }
    } catch { /* skip unreadable dirs */ }
  }

  scanDir(PLATFORM_DIR);
  return results.sort((a, b) => a.slug.localeCompare(b.slug));
}

// ── MAIN CHECK ────────────────────────────────────────────────────────────────
if (!existsSync(PLATFORM_DIR)) {
  warnings.push(`Platform pages directory not found: apps/csps-playground/src/app/platform — skipping scan`);
} else {
  const pages = auditPlatformPages();
  const total = pages.length;
  const fullContext = pages.filter(p => p.score === 3).length;
  const partial = pages.filter(p => p.score > 0 && p.score < 3).length;
  const noContext = pages.filter(p => p.score === 0).length;
  const coveragePct = total > 0 ? Math.round((fullContext / total) * 100) : 100;

  // Advisory for each page missing full context
  for (const page of pages) {
    if (page.score < 3) {
      const missing = [];
      if (!page.hasDNA) missing.push('pageDNA');
      if (!page.hasPurpose) missing.push('purpose field');
      if (!page.hasContext) missing.push('PageContext/PageHeader');
      warnings.push(`/platform/${page.slug} — missing: ${missing.join(', ')} (score ${page.score}/3)`);
    }
  }

  // Blocking if coverage < 50% and site has grown past 10 pages
  if (total > 10 && coveragePct < 50) {
    errors.push(
      `BLOCKING: UX context coverage ${coveragePct}% (${fullContext}/${total} pages) is below 50%. ` +
      `${noContext} pages have no pageDNA at all. ` +
      'Add pageDNA + purpose + PageContext to failing pages before shipping.'
    );
  }

  const summary = [
    `[validate-ux-audit]`,
    `  pages_scanned=${total} full_context=${fullContext} partial=${partial} no_context=${noContext}`,
    `  coverage=${coveragePct}% advisory=${warnings.length} blocking=${errors.length}`,
  ].join('\n');

  if (errors.length > 0) {
    errors.forEach(e => console.error(`  ✗ ${e}`));
    warnings.forEach(w => console.warn(`  ⚠ ${w}`));
    console.error(summary);
    process.exit(1);
  }

  if (warnings.length > 0) {
    warnings.forEach(w => console.warn(`  ⚠ ${w}`));
  }

  console.log(summary);
  console.log(`[validate-ux-audit] pages_scanned=${total} full_context=${fullContext} partial=${partial} no_context=${noContext} coverage=${coveragePct}% advisory=${warnings.length} blocking=${errors.length}`);
  process.exit(0);
}

// If platform dir missing, still exit 0 (advisory)
const fallback = `[validate-ux-audit] pages_scanned=0 full_context=0 partial=0 no_context=0 coverage=100% advisory=${warnings.length} blocking=0`;
if (warnings.length > 0) warnings.forEach(w => console.warn(`  ⚠ ${w}`));
console.log(fallback);
process.exit(0);
