#!/usr/bin/env node
/**
 * pe-compute.mjs — CSPS Priority Engine read_budget computation tool
 *
 * CSPS analog of CSP pe_compute.ps1 (EXT-20260505-004-C §7 PE.read_budget extension).
// @core-seed: PE_CDP_STATUS_READER | plan: deprecated-S044 | grows-to: DEPRECATED — superseded by validate-plan-readiness.mjs + unified-plan.yaml PMI scoring | target: S044 | closed: S044 OPEN-058
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

// ─────────────────────────────────────────────────────────────────────────────
// §A  PE SCORE — 5-dim formula + context re-weight + boosts (PROTO-S084-PE-SWIFT)
// ─────────────────────────────────────────────────────────────────────────────

// Context weight tables (from priority-engine.schema.yaml §1b)
const PE_CTX_WEIGHTS = {
  PLATFORM: { B: 0.35, D: 0.30, I: 0.10, Bn: 0.10, PAS: 0.15 },
  CUSTOMER: { B: 0.25, D: 0.25, I: 0.20, Bn: 0.15, PAS: 0.15 },
  USER:     { B: 0.20, D: 0.20, I: 0.25, Bn: 0.15, PAS: 0.20 },
};

// Opus decision (B): depth-scopes MODULATE B+D — not a 6th dim
const DEPTH_MULT = { class: 1.2, pattern: 1.1, instance: 1.0 };

/**
 * Score one PE item per the 5-dim formula + Opus design decisions A/B/C.
 * @param {object} item  { id, B, D, I, Bn, PAS, pe_context?, depth_scope?,
 *                         moat_score?, completion_pct?, spine_findings_open?,
 *                         explicit_park?, retrieve_when?, note? }
 */
function scoreItem(item) {
  const w   = PE_CTX_WEIGHTS[item.pe_context ?? 'PLATFORM'];
  const dsm = DEPTH_MULT[item.depth_scope ?? 'instance'];

  // Opus decision B: depth-scope modulates B and D only
  const B = Math.min(item.B * dsm, 10);
  const D = Math.min(item.D * dsm, 10);
  const { I, Bn, PAS } = item;

  // Base PE = weighted sum (formula from schema §1)
  const base = B * w.B + D * w.D + I * w.I + Bn * w.Bn + PAS * w.PAS;

  // Moat bonus (schema §1c): moat_score × 0.5
  const moat_score  = item.moat_score ?? 0;
  const moat_bonus  = moat_score * 0.5;

  // Opus decision A: completion = graduated MULTIPLIER, GATED by base >= 5.0,
  //   DECAYED by I dimension (high idle = value decay — not boosting idle items).
  //   Idle decay: multiply boost by max(0, 1 - (I-1)/9) so I=10 → ×0 boost.
  const completion_pct = item.completion_pct ?? 0;
  const idle_decay     = Math.max(0, 1 - (I - 1) / 9);
  const completion_boost = (base >= 5.0 && completion_pct > 0)
    ? (completion_pct / 100) * 1.5 * idle_decay
    : 0;

  // Spine findings boost (schema §13): ≥3 open findings on attributed spine → +2.0
  const spine_findings_open = item.spine_findings_open ?? 0;
  const spine_boost = spine_findings_open >= 3 ? 2.0 : 0;

  const final_score = base + moat_bonus + completion_boost + spine_boost;

  // Priority bands (schema §3)
  let band;
  if      (final_score >= 8.0) band = 'BLOCKING';
  else if (final_score >= 7.0) band = 'HIGH';
  else if (final_score >= 4.0) band = 'MEDIUM';
  else                          band = 'VAULTED';

  // Opus decision C: emit {DO-NOW | PARK(retrieve_when) | DROP}
  //   VAULTED → PARK-candidate; explicit_park overrides band
  let decision;
  if (item.explicit_park) {
    decision = `PARK(retrieve_when: ${item.retrieve_when ?? 'next-topic-plan-transition'})`;
  } else if (band === 'BLOCKING' || band === 'HIGH') {
    decision = 'DO-NOW';
  } else if (band === 'MEDIUM') {
    // Medium: DO-NOW if unblocked, else recommend PARK
    decision = item.blocked_by ? `PARK(retrieve_when: ${item.blocked_by}-complete)` : 'DO-NOW';
  } else {
    decision = `PARK(retrieve_when: ${item.retrieve_when ?? 'activation-condition-met'})`;
  }

  return {
    id:               item.id,
    B_raw:            item.B,  D_raw:  item.D,
    B_mod:            +B.toFixed(2), D_mod: +D.toFixed(2),
    I, Bn, PAS,
    pe_context:       item.pe_context ?? 'PLATFORM',
    depth_scope:      item.depth_scope ?? 'instance',
    base:             +base.toFixed(2),
    moat_bonus:       +moat_bonus.toFixed(2),
    completion_boost: +completion_boost.toFixed(2),
    spine_boost,
    final:            +final_score.toFixed(2),
    band,
    decision,
    note:             item.note ?? '',
  };
}

// Validation set: the 6 open threads from PROTO-S084-PE-SWIFT
const VALIDATION_SET = [
  {
    id: 'journey-seed-1-8',
    B: 10, D: 10, I: 6, Bn: 10, PAS: 10,
    pe_context: 'PLATFORM', depth_scope: 'class',
    moat_score: 8, completion_pct: 15,
    note: 'Platform operating method; SEED-1..8 gate before MVP-narrow build starts',
  },
  {
    id: 'pe-improvement-loop',
    B: 7, D: 8, I: 4, Bn: 10, PAS: 9,
    pe_context: 'PLATFORM', depth_scope: 'class',
    moat_score: 6, completion_pct: 40,
    note: 'THIS session — making pe-compute a real 5-dim scorer; loops-report wiring',
  },
  {
    id: 'reasoning-collab-layer',
    B: 8, D: 5, I: 3, Bn: 8, PAS: 8,
    pe_context: 'PLATFORM', depth_scope: 'pattern',
    moat_score: 6, completion_pct: 30,
    note: 'MIRROR+CROSS-ACCEPT pilot; audit this session; build gated on journey-seed',
  },
  {
    id: 'igt-identity-ground-truth',
    B: 8, D: 4, I: 2, Bn: 7, PAS: 8,
    pe_context: 'PLATFORM', depth_scope: 'pattern',
    moat_score: 4, completion_pct: 20,
    note: 'Role=assignment-vs-assertion; audits this session; build gated on journey-seed',
  },
  {
    id: 'audit-ladder-PARK-022',
    B: 6, D: 3, I: 1, Bn: 5, PAS: 7,
    pe_context: 'PLATFORM', depth_scope: 'pattern',
    moat_score: 4, completion_pct: 10,
    note: 'Cost-adaptive audit ladder; next session after BLOCKING items',
  },
  {
    id: 'PE-interface-PARK-021',
    B: 5, D: 3, I: 1, Bn: 8, PAS: 6,
    pe_context: 'USER', depth_scope: 'instance',
    moat_score: 2, completion_pct: 0,
    explicit_park: true, retrieve_when: 'pe-improvement-loop-complete',
    note: 'UI deepdive; Opus explicit NO-UI this session',
  },
];

function runScore(items) {
  const scored = items.map(scoreItem).sort((a, b) => b.final - a.final);
  const SEP = '─'.repeat(120);

  console.log('\n' + SEP);
  console.log('  PE RANKING (PROTO-S084-PE-SWIFT)  —  5-dim formula + context re-weight + boosts');
  console.log(SEP);
  console.log(
    '  #  Item                         pe_ctx/scope      B_m  D_m  I   Bn  PAS  base  +moat +comp +spi =FINAL  Band      Decision'
  );
  console.log(SEP);

  for (const [i, s] of scored.entries()) {
    const rank   = String(i + 1).padStart(2);
    const id     = s.id.padEnd(28).slice(0, 28);
    const ctx    = `${s.pe_context}/${s.depth_scope}`.padEnd(17);
    const Bm     = String(s.B_mod).padStart(4);
    const Dm     = String(s.D_mod).padStart(4);
    const I_     = String(s.I).padStart(3);
    const Bn_    = String(s.Bn).padStart(3);
    const PAS_   = String(s.PAS).padStart(3);
    const base_  = String(s.base).padStart(5);
    const moat_  = `+${String(s.moat_bonus).padStart(4)}`;
    const comp_  = `+${String(s.completion_boost.toFixed(2)).padStart(4)}`;
    const spin_  = `+${s.spine_boost}`;
    const fin_   = String(s.final).padStart(6);
    const band_  = s.band.padEnd(9);
    const dec_   = s.decision;
    console.log(`  ${rank} ${id} ${ctx} ${Bm} ${Dm} ${I_} ${Bn_} ${PAS_} ${base_} ${moat_} ${comp_} ${spin_} =${fin_}  ${band_} ${dec_}`);
    if (s.note) console.log(`      note: ${s.note}`);
  }

  console.log(SEP);
  console.log('\n  LEGEND:');
  console.log('    B_m/D_m = B/D after depth-scope modulation (class×1.2, pattern×1.1, instance×1.0)');
  console.log('    +moat   = moat_score × 0.5 (compounding=8→+4, structural=6→+3, differentiation=4→+2)');
  console.log('    +comp   = (pct/100)×1.5×idle_decay, GATED: base<5.0→0 (Opus decision A)');
  console.log('    +spi    = +2.0 if attributed spine has ≥3 open findings');
  console.log('    MOAT-PRIORITY: final ≥ 10 (constitutional/compounding moat)');
  console.log('\n  BAND THRESHOLDS: BLOCKING ≥8.0 | HIGH 7.0-7.99 | MEDIUM 4.0-6.99 | VAULTED <4.0');
  console.log(SEP + '\n');

  // Save last-run JSON
  const outPath = join(ROOT, 'tools/data/pe-score-last-run.json');
  const output = {
    scored_at: new Date().toISOString(),
    session: 'S084',
    items: scored,
    top_3: scored.slice(0, 3).map(s => ({ id: s.id, final: s.final, band: s.band, decision: s.decision })),
  };
  try {
    writeFileSync(outPath, JSON.stringify(output, null, 2));
    console.log(`  [pe-compute] score saved → tools/data/pe-score-last-run.json\n`);
  } catch (e) { console.error('[pe-compute] could not save score output:', e.message); }

  return scored;
}

async function main() {
  const args = process.argv.slice(2);

  // ── SCORE MODE (PROTO-S084-PE-SWIFT) ──────────────────────────────────────
  if (args.includes('--score')) {
    const itemsIdx = args.indexOf('--items');
    let items = VALIDATION_SET;
    if (itemsIdx >= 0) {
      const itemsPath = args[itemsIdx + 1];
      if (!itemsPath || !existsSync(join(ROOT, itemsPath))) {
        console.error(`[pe-compute] --items file not found: ${itemsPath}`);
        process.exit(1);
      }
      items = JSON.parse(readFileSync(join(ROOT, itemsPath), 'utf8'));
    }
    runScore(items);
    process.exit(0);
  }

  if (args.includes('--help')) {
    console.log(`
pe-compute.mjs — PE read_budget + 5-dim scorer (PROTO-S084-PE-SWIFT)

Usage:
  node tools/pe-compute.mjs --score [--items <json-path>]    5-dim PE ranking
  node tools/pe-compute.mjs --context-template <path>         read_budget mode
  node tools/pe-compute.mjs --artifacts <path1,path2>  [--complexity low|med|high]
  node tools/pe-compute.mjs --task-class <class>

Score mode options:
  --items <path>    JSON array of PE items (default: built-in validation set)

Read-budget options:
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
