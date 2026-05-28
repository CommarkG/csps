#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-nodefile-compliance
 * @csps-name validate-nodefile-compliance
 * @csps-description ADVISORY validator — checks ~30 in-scope NodeFiles (CORE L1/L2 + pillar headers
 *   + docs/plan top-level) against NODEFILE-CONTRACT requirements. Derives pillar from directory
 *   path; flags path-vs-frontmatter mismatch. Reports missing-field-count ranking. Changed-file +
 *   hash cache for performance. ADVISORY S068 → BLOCKING after PVA confirms real drift.
 *
 *   SCOPE (Q4-ratified, ~30 files):
 *     .claude/core-spines/L1_CORE_*.md  (5 files — L1 sealed)
 *     .claude/core-spines/L2_*.md       (19 files — L2 domain)
 *     docs/plan/pillar-N/README.md (or first .md per pillar — 8 pillar headers)
 *     docs/plan/*.md                    (4 top-level plan files)
 *
 *   DOES NOT BACKFILL — reports only; backfill = separate BATCH 1B task.
 *   wiring_state: active (wired in verify.mjs STEP 4 S069).
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-wiring_state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces NODEFILE-CONTRACT SPINE-PILLAR-MAP P-ARCH-028 CSPS-PLANNING-DISCIPLINE-§14
 * @csps-inherits-from NODEFILE-CONTRACT (Opus-12 authored S068 critical section) + P-META-029
 */

import { readFileSync, existsSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, join, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// ── Cache ──────────────────────────────────────────────────────────────────────
const CACHE_FILE = resolve(ROOT, 'tools/data/validate-nodefile-compliance-cache.json');
let cache = {};
try {
  if (existsSync(CACHE_FILE)) cache = JSON.parse(readFileSync(CACHE_FILE, 'utf8'));
} catch { /* start fresh */ }

function fileHash(content) {
  return createHash('sha256').update(content).digest('hex').slice(0, 16);
}

// ── Pillar derivation ──────────────────────────────────────────────────────────
const PILLAR_PATH_MAP = {
  'pillar-0-governance': 0,
  'pillar-1-architecture-and-stack': 1,
  'pillar-2-data-and-schema': 2,
  'pillar-3-platform-services': 3,
  'pillar-4-developer-experience': 4,
  'pillar-5-ai-systems': 5,
  'pillar-6-operations-and-delivery': 6,
  'pillar-7-product': 7,
};

function derivePillar(filePath) {
  const rel = relative(ROOT, filePath).replace(/\\/g, '/');
  for (const [seg, num] of Object.entries(PILLAR_PATH_MAP)) {
    if (rel.includes(seg)) return num;
  }
  // core-spines → spine files, not pillar-assigned
  if (rel.includes('core-spines')) return 'spine';
  return null; // explicit-or-exempt
}

// ── Frontmatter parser ─────────────────────────────────────────────────────────
function extractFrontmatter(content) {
  if (!content.startsWith('---')) return {};
  const end = content.indexOf('\n---', 3);
  if (end === -1) return {};
  const fm = content.substring(4, end);
  const obj = {};
  for (const line of fm.split('\n')) {
    const m = line.match(/^(\w[\w_-]*):\s*(.+)/);
    if (m) obj[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  return obj;
}

// ── NODEFILE-CONTRACT required fields ─────────────────────────────────────────
// 6 existing fields (should already be present in most files):
const EXISTING_FIELDS = ['id', 'core_spine', 'type', 'inherits_from', 'links', 'context_question'];
// Delta fields (new per NODEFILE-CONTRACT — not yet backfilled, just tracked):
const DELTA_FIELDS = ['pillar', 'element_class', 'd_level', 'wiring_state', 'ripple_seeds', 'unique_addition'];
const ALL_TRACKED = [...EXISTING_FIELDS, ...DELTA_FIELDS];

// ── Scope discovery ────────────────────────────────────────────────────────────
function discoverScope() {
  const files = [];

  // L1 core-spines
  const coreSpines = resolve(ROOT, '.claude/core-spines');
  if (existsSync(coreSpines)) {
    for (const f of readdirSync(coreSpines)) {
      if (f.startsWith('L1_') && f.endsWith('.md')) files.push(join(coreSpines, f));
      if (f.startsWith('L2_') && f.endsWith('.md')) files.push(join(coreSpines, f));
    }
  }

  // Pillar headers (README.md or first .md in each pillar dir)
  const planDir = resolve(ROOT, 'docs/plan');
  if (existsSync(planDir)) {
    for (const entry of readdirSync(planDir, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name.startsWith('pillar-')) {
        const pillarDir = join(planDir, entry.name);
        // Prefer README.md; fall back to first .md alphabetically
        const readme = join(pillarDir, 'README.md');
        if (existsSync(readme)) {
          files.push(readme);
        } else {
          const mds = readdirSync(pillarDir).filter(f => f.endsWith('.md')).sort();
          if (mds.length > 0) files.push(join(pillarDir, mds[0]));
        }
      }
    }

    // docs/plan top-level .md files
    for (const entry of readdirSync(planDir, { withFileTypes: true })) {
      if (!entry.isDirectory() && entry.name.endsWith('.md')) {
        files.push(join(planDir, entry.name));
      }
    }
  }

  return files;
}

// ── Main scan ──────────────────────────────────────────────────────────────────
const scopeFiles = discoverScope();
const results = [];
const newCache = {};

for (const filePath of scopeFiles) {
  if (!existsSync(filePath)) continue;
  const content = readFileSync(filePath, 'utf8');
  const hash = fileHash(content);
  const relPath = relative(ROOT, filePath).replace(/\\/g, '/');
  newCache[relPath] = hash;

  // Cache hit — skip re-scan
  if (cache[relPath] === hash) {
    results.push({ file: relPath, cached: true, findings: [] });
    continue;
  }

  const fm = extractFrontmatter(content);
  const findings = [];

  // Check existing fields
  for (const field of EXISTING_FIELDS) {
    if (!fm[field]) findings.push({ field, severity: 'advisory', type: 'existing-missing' });
  }

  // Check delta fields (new per NODEFILE-CONTRACT)
  for (const field of DELTA_FIELDS) {
    if (!fm[field]) findings.push({ field, severity: 'advisory', type: 'delta-missing' });
  }

  // Derive pillar + flag mismatch
  const derivedPillar = derivePillar(filePath);
  if (derivedPillar !== null && derivedPillar !== 'spine' && fm.pillar !== undefined) {
    const declared = Number(fm.pillar);
    if (!isNaN(declared) && declared !== derivedPillar) {
      findings.push({
        field: 'pillar',
        severity: 'advisory',
        type: 'path-vs-frontmatter-mismatch',
        derived: derivedPillar,
        declared: declared,
      });
    }
  }

  results.push({ file: relPath, cached: false, findings, missingCount: findings.length });
}

// Save updated cache
try { writeFileSync(CACHE_FILE, JSON.stringify(newCache, null, 2)); } catch { /* non-fatal */ }

// ── Output ─────────────────────────────────────────────────────────────────────
const uncached = results.filter(r => !r.cached);
const withFindings = uncached.filter(r => r.findings && r.findings.length > 0);
// Sort by missing-field count descending (most debt first)
withFindings.sort((a, b) => (b.missingCount || 0) - (a.missingCount || 0));

let advisory = 0;
let mismatches = 0;

if (withFindings.length > 0) {
  console.log('[validate-nodefile-compliance] NodeFile compliance scan (ADVISORY):');
  for (const r of withFindings.slice(0, 20)) { // top 20 most-debt files
    const missing = r.findings.filter(f => f.type !== 'path-vs-frontmatter-mismatch');
    const mm = r.findings.filter(f => f.type === 'path-vs-frontmatter-mismatch');
    advisory += missing.length;
    mismatches += mm.length;
    const missingFields = missing.map(f => f.field).join(', ');
    console.log(`  ADVISORY ${r.file} — missing ${r.missingCount} field(s): [${missingFields}]`);
    for (const m of mm) {
      console.log(`  ADVISORY ${r.file} — pillar mismatch: path-derived=${m.derived} declared=${m.declared}`);
    }
  }
  if (withFindings.length > 20) {
    console.log(`  ... and ${withFindings.length - 20} more files with debt`);
  }
} else {
  console.log('[validate-nodefile-compliance] ✓ All in-scope NodeFiles meet compliance baseline');
}

const cached_count = results.filter(r => r.cached).length;
console.log(`[validate-nodefile-compliance] files_scanned=${scopeFiles.length} cached=${cached_count} scanned=${uncached.length} advisory=${advisory} mismatches=${mismatches} blocking=0 wiring_state=active`);

// ADVISORY — always exit 0 (BLOCKING promoted only after PVA per NODEFILE-CONTRACT §105)
process.exit(0);
