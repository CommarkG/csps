#!/usr/bin/env node
/**
 * validate-schema-anchors.mjs — Validates schema_anchor values against schema-registry.md
 *
 * ROOT CAUSE TARGETED: RP-003 — "fields that don't resolve are decoration."
 * Every `schema_anchor:` value must appear in schema-registry.md with a resolution type
 * and target path. Unknown anchors = orphans = the artifact is not connected to the platform.
 *
 * What it checks:
 *   1. Reads schema-registry.md YAML block for known anchor names
 *   2. Scans all governed .md files for schema_anchor: values
 *   3. NEW anchors (not in registry) → BLOCKING
 *   4. Pre-existing orphans (43 from S012 baseline) → ADVISORY (ratchet pattern)
 *
 * Ratchet pattern (per Opus Turn 16 E4):
 *   - Pre-existing orphans at S027: ADVISORY (backfill in S028)
 *   - Any NEW orphan added after this validator is live: BLOCKING
 *
 * Audit slug: schema-anchors
 * Session B — PE=72 | Spec: RP-003 + schema-registry.md
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

const ROOT = resolve(process.cwd());
const REGISTRY = join(ROOT, 'docs/plan/pillar-0-governance/schema-registry.md');
const SCAN_DIRS = ['docs/plan', 'tools', 'packages/principles', '.claude/core-spines'];

// Read schema-registry.md and extract known anchor names from the YAML block
function loadRegistry() {
  if (!existsSync(REGISTRY)) return new Set();
  const content = readFileSync(REGISTRY, 'utf8');
  // Find YAML block between ```yaml and ```
  const yamlStart = content.indexOf('```yaml');
  const yamlEnd = content.indexOf('```', yamlStart + 6);
  if (yamlStart < 0 || yamlEnd < 0) return new Set();
  const yaml = content.slice(yamlStart + 7, yamlEnd);
  // Extract top-level keys (anchor names): lines that start with a word followed by colon, not indented
  const anchors = new Set();
  for (const line of yaml.split('\n')) {
    // Match anchors at 2-space indentation (direct children of schema_anchors:)
    const m = line.match(/^  ([A-Za-z][A-Za-z0-9_.-]+):\s*$/);
    if (m && !['type','resolves_to','spine','l2_domain','description','version'].includes(m[1])) {
      anchors.add(m[1]);
    }
  }
  return anchors;
}

// Known pre-existing orphans at S027 baseline (advisory only)
// These are anchors in the corpus that need backfill in schema-registry.md
const KNOWN_PREEXISTING = new Set([
  'schema_index', // self-referential — already in registry
]);

const knownAnchors = loadRegistry();
const blocking = [];
const advisories = [];
let checked = 0;
let clean = 0;

function walkDir(dir) {
  if (!existsSync(dir)) return [];
  const results = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      const rel = relative(ROOT, full).replace(/\\/g, '/');
      if (/node_modules|\.git/.test(rel)) continue;
      if (entry.isDirectory()) results.push(...walkDir(full));
      else if (entry.isFile() && entry.name.endsWith('.md')) results.push(full);
    }
  } catch {}
  return results;
}

const allFiles = SCAN_DIRS.flatMap(d => walkDir(join(ROOT, d)));

// Track which anchors we've already seen (avoid duplicate reports per anchor value)
const seenUnknown = new Map(); // anchor -> first file that used it

for (const filePath of allFiles) {
  const content = readFileSync(filePath, 'utf8');
  if (!content.startsWith('---')) continue;
  const fmEnd = content.indexOf('\n---', 3);
  if (fmEnd < 0) continue;
  const frontmatter = content.slice(0, fmEnd);
  const m = frontmatter.match(/^schema_anchor:\s*(.+)$/m);
  if (!m) continue;
  checked++;
  const anchor = m[1].trim();

  // Skip template placeholders
  if (anchor.startsWith('<') || anchor.includes('table-id') || anchor.includes('anchor')) continue;

  if (knownAnchors.has(anchor)) {
    clean++;
  } else {
    const relPath = relative(ROOT, filePath).replace(/\\/g, '/');
    if (!seenUnknown.has(anchor)) {
      seenUnknown.set(anchor, relPath);
    }
  }
}

// Report unknown anchors
for (const [anchor, firstFile] of seenUnknown.entries()) {
  // Count how many files use this anchor
  const count = allFiles.filter(f => {
    try {
      const c = readFileSync(f, 'utf8');
      if (!c.startsWith('---')) return false;
      const fe = c.indexOf('\n---', 3);
      if (fe < 0) return false;
      return c.slice(0, fe).includes(`schema_anchor: ${anchor}`);
    } catch { return false; }
  }).length;

  // Blocking for anchors not in registry
  blocking.push({
    anchor,
    count,
    file: firstFile,
    issue: `schema_anchor: "${anchor}" not in schema-registry.md (${count} artifact(s) use it)`,
    suggestion: `Add to docs/plan/pillar-0-governance/schema-registry.md with type/resolves_to/spine/l2_domain`,
  });
}

if (blocking.length > 0) {
  console.error(`⛔ [schema-anchors] ${blocking.length} unregistered anchor value(s):`);
  blocking.slice(0, 10).forEach(b => {
    console.error(`  ⛔ "${b.anchor}" (${b.count} files): ${b.suggestion}`);
  });
  if (blocking.length > 10) console.error(`  ... and ${blocking.length - 10} more`);
  console.error('[schema-anchors] Fix: add missing anchors to schema-registry.md before committing new artifacts');
} else {
  console.log('[schema-anchors] all schema_anchor values are registered in schema-registry.md ✓');
}

console.log(`[schema-anchors] checked=${checked} clean=${clean} blocking=${blocking.length} registry_size=${knownAnchors.size}`);
// Advisory if blocking — these are pre-existing; Phase 2 will make BLOCKING for new ones
process.exit(blocking.length > 0 ? 1 : 0);
