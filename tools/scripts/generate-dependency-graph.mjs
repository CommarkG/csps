#!/usr/bin/env node
/**
 * generate-dependency-graph.mjs — walks governed files' frontmatter links: arrays
 * and builds a directed dependency graph of the CSPS platform.
 *
 * OUTPUT: tools/data/dependency-graph.yaml
 * FORMAT: nodes (id=relPath, label, core_spine) + edges (from→to, rel)
 *
 * IMPORTANT: This is a GENERATION SCRIPT, not a validator.
 * It MUST NOT be added to pnpm verify cycles (guard: no validate- prefix).
 *
 * Usage: node tools/scripts/generate-dependency-graph.mjs
 *
 * @csps-id csps.scripts.generate-dependency-graph
 * @csps-name generate-dependency-graph
 * @csps-description GENERATION SCRIPT: builds tools/data/dependency-graph.yaml from
 *   frontmatter links: arrays across governed artifact corpus. Enables Opus to write
 *   targeted PROTOs with full dependency awareness.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:script domain:governance audience:developer
 * @csps-enforces P-ARCH-001
 * PARK-S082-005 discharge: S083 Phase B.1
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const OUTPUT_PATH = join(ROOT, 'tools/data/dependency-graph.yaml');

// Directories to scan for governed artifacts
const SCAN_DIRS = [
  'docs/plan/pillar-0-governance',
  'docs/plan/_handoff/VAULT/topic-plans',
  'docs/plan/_handoff/VAULT/contexts',
  'docs/platform-intelligence',
  'tools/templates',
  'packages/principles',
  '.claude/core-spines',
  '.claude/skills',
];

// File extensions to scan
const SCAN_EXTENSIONS = new Set(['.md', '.yaml', '.yml']);

/** Extract frontmatter block from file content (CRLF-safe) */
function extractFrontmatter(content) {
  const normalized = content.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) return null;
  const end = normalized.indexOf('\n---\n', 4);
  if (end < 0) return null;
  return normalized.slice(0, end);
}

/** Extract specific field from frontmatter text */
function extractField(frontmatter, field) {
  const pattern = new RegExp(`^${field}:\\s*(.+)$`, 'm');
  const m = frontmatter.match(pattern);
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null;
}

/** Extract links: array entries as [{rel, href}] */
function extractLinks(frontmatter) {
  const links = [];
  // Match - rel: xxx / href: yyy block pairs
  const relHrefPattern = /- rel:\s*([^\n]+)\n\s+href:\s*([^\n]+)/g;
  let m;
  while ((m = relHrefPattern.exec(frontmatter)) !== null) {
    const rel = m[1].trim().replace(/^['"]|['"]$/g, '');
    const href = m[2].trim().replace(/^['"]|['"]$/g, '');
    links.push({ rel, href });
  }
  // Also match inline { rel: xxx, href: yyy } pairs
  const inlinePattern = /\{\s*rel:\s*([^,}]+),\s*href:\s*([^}]+)\}/g;
  while ((m = inlinePattern.exec(frontmatter)) !== null) {
    const rel = m[1].trim().replace(/^['"]|['"]$/g, '');
    const href = m[2].trim().replace(/^['"]|['"]$/g, '');
    links.push({ rel, href });
  }
  return links;
}

/** Walk directory recursively, yielding {relPath, fullPath} */
function* walkFiles(dir) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) return;
  for (const entry of readdirSync(full)) {
    const entryPath = join(full, entry);
    const stat = statSync(entryPath);
    if (stat.isDirectory()) {
      if (entry === 'node_modules' || entry === '.git') continue;
      const relDir = join(dir, entry).replace(/\\/g, '/');
      yield* walkFiles(relDir);
    } else {
      const ext = entry.slice(entry.lastIndexOf('.'));
      if (SCAN_EXTENSIONS.has(ext)) {
        yield {
          relPath: join(dir, entry).replace(/\\/g, '/'),
          fullPath: entryPath,
        };
      }
    }
  }
}

const nodes = new Map(); // relPath → { id, label, core_spine, name }
const edges = []; // { from, to, rel, resolved }

console.log('[generate-dependency-graph] scanning governed artifacts...');

let filesScanned = 0;
let filesWithLinks = 0;
let edgesTotal = 0;
let edgesResolved = 0;
let edgesUnresolved = 0;

for (const dir of SCAN_DIRS) {
  for (const { relPath, fullPath } of walkFiles(dir)) {
    filesScanned++;
    const content = readFileSync(fullPath, 'utf8');
    const fm = extractFrontmatter(content);
    if (!fm) continue;

    // Register node
    if (!nodes.has(relPath)) {
      const name = extractField(fm, 'name') || relPath.split('/').pop().replace(/\.[^.]+$/, '');
      const coreSpine = extractField(fm, 'core_spine') || 'unknown';
      const lifecycle = extractField(fm, 'lifecycle_state') || extractField(fm, 'lifecycle') || 'unknown';
      nodes.set(relPath, { id: relPath, name, core_spine: coreSpine, lifecycle });
    }

    // Extract links
    const links = extractLinks(fm);
    if (links.length === 0) continue;

    filesWithLinks++;
    edgesTotal += links.length;

    for (const { rel, href } of links) {
      // Skip external URLs and anchors
      if (!href || href.startsWith('http') || href.startsWith('#')) continue;

      // Resolve href relative to artifact's directory
      const fileDir = dirname(fullPath);
      const hrefNoAnchor = href.split('#')[0];
      const resolved = resolve(fileDir, hrefNoAnchor);
      const toRelPath = relative(ROOT, resolved).replace(/\\/g, '/');

      const resolves = existsSync(resolved);
      if (resolves) {
        edgesResolved++;
        // Ensure target node is registered
        if (!nodes.has(toRelPath)) {
          nodes.set(toRelPath, { id: toRelPath, name: toRelPath.split('/').pop(), core_spine: 'unknown', lifecycle: 'unknown' });
        }
      } else {
        edgesUnresolved++;
      }

      edges.push({
        from: relPath,
        to: toRelPath,
        rel,
        resolved: resolves,
      });
    }
  }
}

console.log(`[generate-dependency-graph] files_scanned=${filesScanned} with_links=${filesWithLinks}`);
console.log(`[generate-dependency-graph] nodes=${nodes.size} edges=${edgesTotal} resolved=${edgesResolved} unresolved=${edgesUnresolved}`);

// Build YAML output
const now = new Date().toISOString();
const nodeList = [...nodes.values()];
const edgeList = edges.filter(e => e.resolved); // only include resolved edges in graph

let yaml = `---
id: csps.data.dependency-graph
name: dependency-graph
description: "Directed dependency graph of CSPS governed artifacts. Generated by generate-dependency-graph.mjs. Nodes=governed files; edges=frontmatter links: resolved paths."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: reference_data
generated_at: "${now}"
generated_by: "tools/scripts/generate-dependency-graph.mjs"
park_discharge: "PARK-S082-005"
stats:
  files_scanned: ${filesScanned}
  files_with_links: ${filesWithLinks}
  nodes: ${nodeList.length}
  edges_total: ${edgeList.length}
  edges_unresolved: ${edgesUnresolved}
---

# Dependency Graph

# NODES — governed artifacts (id = relative path from repo root)
nodes:
`;

for (const node of nodeList) {
  yaml += `  - id: "${node.id}"\n`;
  yaml += `    name: "${node.name.replace(/"/g, '\\"')}"\n`;
  yaml += `    core_spine: "${node.core_spine}"\n`;
  yaml += `    lifecycle: "${node.lifecycle}"\n`;
}

yaml += `\n# EDGES — resolved frontmatter links (from → to, rel type)\n`;
yaml += `edges:\n`;

for (const edge of edgeList) {
  yaml += `  - from: "${edge.from}"\n`;
  yaml += `    to: "${edge.to}"\n`;
  yaml += `    rel: "${edge.rel}"\n`;
}

writeFileSync(OUTPUT_PATH, yaml);
console.log(`[generate-dependency-graph] ✓ written → ${OUTPUT_PATH}`);
console.log(`[generate-dependency-graph] nodes_count=${nodeList.length} edges_count=${edgeList.length}`);
