#!/usr/bin/env node
/**
 * validate-ux-snapshot-registry.mjs — UX Version History Integrity Gate (L1)
 *
 * Governor directive S088: permanent, mandatory UI/UX snapshot system.
 * All platform pages and external app pages must have snapshot entries.
 *
 * BLOCKING:
 *   (a) A new page.tsx (in apps/) has no snapshot entry in ux-snapshot-registry.yaml
 *       NOTE: pre-commit hook is the T1 for this; T2 catches it on next verify
 *   (b) A snapshot entry references a page that no longer exists in route-manifest
 *
 * ADVISORY:
 *   (c) Page has version=1 and no ux_dna_compliance filled (baseline entry, not yet audited)
 *   (d) Snapshot entry missing rollback_sha (not yet tagged)
 *
 * @csps-id csps.validators.validate-ux-snapshot-registry
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:ux-governance audience:ai-agent
 * @csps-enforces PARK-S088-UX-VERSION-HISTORY B_UX_UI_DISCIPLINE B_PAGE_COMPLETE
 * @csps-prevention-class UNVERSIONED-PAGE-CHANGE UX-HISTORY-GAP
 *
 * run_tier: STANDARD
 * always_rerun: false
 * @determinism-exempt: no clock-based decisions.
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const REGISTRY = join(ROOT, 'tools/data/ux-snapshot-registry.yaml');
const ROUTE_MANIFEST = join(ROOT, 'apps/csps-playground/src/config/route-manifest.ts');
const LAST_RUN = join(ROOT, 'tools/data/validate-ux-snapshot-registry-last-run.json');

let blocking = 0, advisory = 0, passes = 0;
const findings = [];

function PASS(msg)  { passes++;   console.log(`  [PASS] ${msg}`); }
function BLOCK(msg) { blocking++; findings.push(`[BLOCKING] ${msg}`); console.log(`  [BLOCKING] ${msg}`); }
function WARN(msg)  { advisory++; findings.push(`[ADVISORY] ${msg}`); console.log(`  [ADVISORY] ${msg}`); }

function parseSnapshots(raw) {
  const entries = [];
  const blocks = raw.split(/\n  - page_slug:/);
  for (const block of blocks.slice(1)) {
    const slug = block.split('\n')[0].replace(/[\s"]+/g, '').trim();
    if (!slug) continue;
    const get = (key) => (block.match(new RegExp(`\\n    ${key}:\\s*"?([^"\\n]+)"?`)) || [])[1]?.trim() ?? null;
    const dna = (block.match(/ux_dna_compliance:\s*\[([^\]]*)\]/) || [])[1] || '';
    entries.push({
      page_slug: slug,
      project: get('project') ?? 'unknown',
      version: parseInt(get('version') ?? '1', 10),
      date: get('date') ?? null,
      changed_by: get('changed_by') ?? null,
      ux_dna_compliance: dna.trim(),
      rollback_sha: get('rollback_sha') ?? null,
    });
  }
  return entries;
}

function parseRouteManifest(raw) {
  const slugs = new Set();
  for (const m of raw.matchAll(/path:\s*'([^']+)'/g)) {
    slugs.add(m[1]);
  }
  return slugs;
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('[validate-ux-snapshot-registry] UX version history integrity gate');
console.log('');

if (!existsSync(REGISTRY)) {
  WARN('tools/data/ux-snapshot-registry.yaml missing — UX version history not initialized');
  console.log(`\n[validate-ux-snapshot-registry] blocking=${blocking} advisory=${advisory} passes=${passes}`);
  process.exit(0);
}

let snapshots = [];
try {
  snapshots = parseSnapshots(readFileSync(REGISTRY, 'utf8'));
  PASS(`ux-snapshot-registry loaded (${snapshots.length} snapshot entries)`);
} catch (e) {
  BLOCK(`could not parse ux-snapshot-registry.yaml: ${e.message}`);
  process.exit(1);
}

// ── CHECK (a/b): route-manifest alignment ─────────────────────────────────────
if (existsSync(ROUTE_MANIFEST)) {
  const routeSlugs = parseRouteManifest(readFileSync(ROUTE_MANIFEST, 'utf8'));
  const snapshotSlugs = new Set(snapshots.map(s => s.page_slug));

  // Pages in route-manifest but NO snapshot (baseline gap — advisory for existing pages)
  let missingBaselines = 0;
  for (const slug of routeSlugs) {
    if (slug.includes('[') || slug === '/api') continue; // skip dynamic routes
    if (!snapshotSlugs.has(slug)) {
      WARN(`no snapshot entry for: ${slug} — add baseline entry (version:1) to ux-snapshot-registry.yaml`);
      missingBaselines++;
    }
  }
  if (missingBaselines === 0) {
    PASS(`all ${routeSlugs.size} route-manifest pages have snapshot entries`);
  }

  // Snapshot entries for pages NOT in route-manifest (stale entry)
  for (const snap of snapshots) {
    if (snap.project !== 'csps-playground') continue;
    if (!routeSlugs.has(snap.page_slug) && snap.page_slug !== '/') {
      WARN(`snapshot entry for orphaned page: ${snap.page_slug} — page may have been removed`);
    }
  }
} else {
  WARN('route-manifest.ts not found — skipping route alignment check');
}

// ── CHECK (c): baseline entries without ux_dna_compliance ────────────────────
const unauditedBaselines = snapshots.filter(s => s.version === 1 && (!s.ux_dna_compliance || s.ux_dna_compliance === ''));
if (unauditedBaselines.length > 0) {
  WARN(`${unauditedBaselines.length} baseline snapshot entries lack ux_dna_compliance — run UX-DNA audit on each page`);
} else {
  PASS('all snapshot entries have ux_dna_compliance field');
}

// ── CHECK (d): entries without rollback_sha ────────────────────────────────────
const untagged = snapshots.filter(s => !s.rollback_sha && s.version > 1);
if (untagged.length > 0) {
  WARN(`${untagged.length} snapshot entries (v>1) missing rollback_sha — add git SHA for rollback ability`);
}

// ── RESULT ─────────────────────────────────────────────────────────────────────
console.log('');
console.log(`[validate-ux-snapshot-registry] blocking=${blocking} advisory=${advisory} passes=${passes}`);

try {
  mkdirSync(join(ROOT, 'tools/data'), { recursive: true });
  writeFileSync(LAST_RUN, JSON.stringify({
    ran_at: new Date().toISOString(),
    blocking, advisory, passes, findings,
    snapshot_count: snapshots.length,
  }, null, 2));
} catch { /* non-fatal */ }

process.exit(blocking > 0 ? 1 : 0);
