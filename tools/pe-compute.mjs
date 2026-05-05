#!/usr/bin/env node
/**
 * pe-compute.mjs — CSPS Priority Engine read_budget computation tool
 *
 * CSPS analog of CSP pe_compute.ps1 (EXT-20260505-004-C §7 PE.read_budget extension).
 * Reads file_depth_markers from artifacts, computes per-task read_budget with
 * L1/L2/L3 strategy recommendations based on task complexity level.
 *
 * Usage:
 *   node tools/pe-compute.mjs [--task-class <class>] [--artifacts <path1,path2,...>]
 *   node tools/pe-compute.mjs --context-template <template-json-path>
 *   node tools/pe-compute.mjs --help
 *
 * Per EXT-20260505-004-C: "L1-first; escalate to L2 only if validator fails"
 * Strategy by BLAST equivalent (CSPS uses complexity: low/medium/high):
 *   LOW  → L1-only  (CSPS: mechanical/single-artifact tasks)
 *   MED  → L1+L2    (CSPS: synthesis or cross-spine tasks)
 *   HIGH → L1+L2+L3 (CSPS: constitutional/engraving/ADR work)
 */

import { readFileSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CACHE_PATH = join(ROOT, 'tools/pe-context-cache.json');

// ─────────────────────────────────────────────────────────────────────────────
// Parse file_depth_markers from a markdown frontmatter block
// ─────────────────────────────────────────────────────────────────────────────

function parseDepthMarkers(text) {
  const markers = {};
  const fmMatch = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;
  const fm = fmMatch[1];
  // Extract l1_lines, l2_lines, l3_lines
  const l1 = fm.match(/l1_lines:\s*["']?([^"'\n]+)["']?/);
  const l2 = fm.match(/l2_lines:\s*["']?([^"'\n]+)["']?/);
  const l3 = fm.match(/l3_lines:\s*["']?([^"'\n]+)["']?/);
  if (l1) markers.l1_lines = l1[1].trim();
  if (l2) markers.l2_lines = l2[1].trim();
  if (l3) markers.l3_lines = l3[1].trim();
  return Object.keys(markers).length > 0 ? markers : null;
}

// Estimate token count for a line range (approximate: ~50 chars/line avg, ~3 chars/token)
function estimateTokens(text, lineRange) {
  if (!lineRange || lineRange === 'N/A') return 0;
  const lines = text.split('\n');
  const m = String(lineRange).match(/(\d+)-(\d+)|^(\d+)$/);
  if (!m) return 0;
  const start = parseInt(m[1] ?? m[3], 10) - 1;
  const end   = m[2] ? parseInt(m[2], 10) : start + 1;
  const sectionLines = lines.slice(start, end);
  const chars = sectionLines.reduce((s, l) => s + l.length, 0);
  return Math.ceil(chars / 3); // ~3 chars per token
}

// ─────────────────────────────────────────────────────────────────────────────
// Load pe-context-cache.json (L1 reads cached across sessions)
// ─────────────────────────────────────────────────────────────────────────────

function loadCache() {
  if (!existsSync(CACHE_PATH)) return { version: '1.0', entries: {} };
  try {
    return JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
  } catch {
    return { version: '1.0', entries: {} };
  }
}

function saveCache(cache) {
  try {
    writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
  } catch { /* non-fatal */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// Compute read_budget for a single artifact path
// ─────────────────────────────────────────────────────────────────────────────

function computeArtifactBudget(artifactPath, requestedDepth = 'L1', cache) {
  const absPath = artifactPath.startsWith('/') || artifactPath.match(/^[A-Z]:/) ?
    artifactPath : join(ROOT, artifactPath);

  if (!existsSync(absPath)) {
    return { path: artifactPath, status: 'NOT_FOUND', depth: requestedDepth, estimated_tokens: 0 };
  }

  // Check cache for L1 stable artifacts; invalidate on mtime change
  const cacheKey = artifactPath;
  let mtimeMs = 0;
  try { mtimeMs = statSync(absPath).mtimeMs; } catch { /* non-fatal */ }

  // Cache hit — return stored L1 estimate if mtime unchanged
  const cached = cache.entries[cacheKey];
  if (requestedDepth === 'L1' && cached && cached.mtime_ms === mtimeMs && cached.estimated_tokens_l1 > 0) {
    return {
      path: artifactPath, status: 'FOUND', depth: requestedDepth,
      has_depth_markers: cached.has_depth_markers, estimated_tokens: cached.estimated_tokens_l1, cache_hit: true,
    };
  }

  const text = readFileSync(absPath, 'utf8');
  const markers = parseDepthMarkers(text);

  let estimatedTokens;
  let depth = requestedDepth;

  if (markers) {
    const lineRange = markers[`${depth.toLowerCase()}_lines`];
    estimatedTokens = estimateTokens(text, lineRange);
  } else {
    // No depth markers — estimate by depth fraction of full file
    const totalTokens = Math.ceil(text.length / 3);
    estimatedTokens = depth === 'L1' ? Math.min(totalTokens, 2000) :
                      depth === 'L2' ? Math.min(totalTokens, 8000) :
                      totalTokens;
  }

  // Cache L1 reads of stable artifacts (path doesn't contain session-specific patterns)
  const isStable = !artifactPath.includes('S0') || artifactPath.includes('OVERVIEW');
  if (depth === 'L1' && isStable) {
    cache.entries[cacheKey] = {
      estimated_tokens_l1: estimatedTokens,
      has_depth_markers: markers !== null,
      mtime_ms: mtimeMs,
      cached_at: new Date().toISOString(),
    };
  }

  return {
    path: artifactPath,
    status: 'FOUND',
    depth,
    has_depth_markers: markers !== null,
    depth_markers: markers,
    estimated_tokens: estimatedTokens,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Complexity → strategy mapping (CSPS-calibrated from EXT-004-C §7)
// ─────────────────────────────────────────────────────────────────────────────

const STRATEGY = {
  low:  { depth: 'L1', rationale: 'Mechanical single-artifact task; L1 summary sufficient' },
  med:  { depth: 'L2', rationale: 'Cross-spine or synthesis task; L1+L2 needed' },
  high: { depth: 'L3', rationale: 'Constitutional/engraving/ADR work; full context required' },
};

function detectComplexity(taskClass) {
  const HIGH = ['engraving', 'adr', 'constitutional', 'session-close'];
  const MED  = ['qc-validation', 'session-open', 'frontmatter-authoring', 'agent-spawn'];
  const LOW  = ['pcr', 'mcp-query'];
  if (HIGH.some(h => taskClass?.includes(h))) return 'high';
  if (MED.some(m  => taskClass?.includes(m)))  return 'med';
  if (LOW.some(l  => taskClass?.includes(l)))  return 'low';
  return 'med'; // default
}

// ─────────────────────────────────────────────────────────────────────────────
// Main: compute read_budget from context-loading template OR artifact list
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    console.log(`
pe-compute.mjs — PE read_budget computation (EXT-20260505-004-C)

Usage:
  node tools/pe-compute.mjs --context-template <path>
  node tools/pe-compute.mjs --artifacts <path1,path2>  [--complexity low|med|high]
  node tools/pe-compute.mjs --task-class <class>

Options:
  --context-template <path>   Load artifact list from context-loading JSON template
  --artifacts <paths>         Comma-separated artifact paths
  --complexity low|med|high   Override complexity (default: auto-detected from task-class)
  --task-class <class>        Task class for complexity auto-detection
  --no-cache                  Skip cache read/write
`);
    process.exit(0);
  }

  const cache = args.includes('--no-cache') ? { version: '1.0', entries: {} } : loadCache();
  const taskClassIdx = args.indexOf('--task-class');
  const taskClass = taskClassIdx >= 0 ? (args[taskClassIdx + 1] ?? 'unknown') : 'unknown';
  const complexityIdx = args.indexOf('--complexity');
  const complexity = complexityIdx >= 0 ? (args[complexityIdx + 1] ?? detectComplexity(taskClass)) : detectComplexity(taskClass);
  const strategy = STRATEGY[complexity] ?? STRATEGY.med;

  let artifactPaths = [];

  if (args.includes('--context-template')) {
    const tplPath = args[args.indexOf('--context-template') + 1];
    if (!tplPath || !existsSync(join(ROOT, tplPath))) {
      console.error(`[pe-compute] context-template not found: ${tplPath}`);
      process.exit(1);
    }
    const tpl = JSON.parse(readFileSync(join(ROOT, tplPath), 'utf8'));
    artifactPaths = (tpl.required_artifacts ?? [])
      .filter(a => !a.path.includes('<') && !a.path.includes('>'))
      .map(a => a.path);
    if (tpl.task_class) {
      const detectedComplexity = detectComplexity(tpl.task_class);
      strategy.depth = STRATEGY[detectedComplexity].depth;
      strategy.rationale = STRATEGY[detectedComplexity].rationale;
    }
  } else if (args.includes('--artifacts')) {
    artifactPaths = args[args.indexOf('--artifacts') + 1]?.split(',') ?? [];
  } else {
    console.log('[pe-compute] No artifacts specified. Use --context-template or --artifacts. Run --help for usage.');
    process.exit(0);
  }

  const artifactBudgets = artifactPaths.map(p =>
    computeArtifactBudget(p, strategy.depth, cache)
  );

  const totalTokens = artifactBudgets.reduce((s, a) => s + a.estimated_tokens, 0);

  // Bundle opportunities: adjacent paths in same directory = bundle-eligible
  const bundleOpps = [];
  const dirs = new Map();
  for (const a of artifactBudgets) {
    const dir = dirname(a.path);
    if (!dirs.has(dir)) dirs.set(dir, []);
    dirs.get(dir).push(a.path);
  }
  for (const [dir, paths] of dirs) {
    if (paths.length > 1) {
      bundleOpps.push(`${paths.join(' + ')} (same dir: ${dir})`);
    }
  }

  const readBudget = {
    task_class: taskClass,
    complexity,
    recommended_strategy: `${strategy.depth}-first; ${strategy.rationale}`,
    required_artifacts: artifactBudgets,
    total_estimated_tokens: totalTokens,
    bundle_opportunities: bundleOpps,
    cache_eligible: artifactBudgets.filter(a => a.depth === 'L1').map(a => a.path),
    honest_caveat: 'ESTIMATED — per EXT-002-E/EXT-004-C: 60-75% savings claim is CSP-specific; CSPS requires empirical measurement at Phase 10 close',
  };

  console.log(JSON.stringify(readBudget, null, 2));

  // Save updated cache
  if (!args.includes('--no-cache')) saveCache(cache);
}

main().catch(err => {
  console.error('[pe-compute] fatal:', err);
  process.exit(1);
});
