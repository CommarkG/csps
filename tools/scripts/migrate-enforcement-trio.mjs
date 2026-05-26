#!/usr/bin/env node
/**
 * @csps-id csps.tools.scripts.migrate-enforcement-trio
 * @csps-name migrate-enforcement-trio
 * @csps-description Migration script: reads each B_*.md contract, parses existing body
 *   "enforcement_tier:" prose, and prepends structured YAML frontmatter with enforcement_trio
 *   block per PROTO-S062-A STEP 2 schema. Option C extension: pre-normalization of
 *   T<N> <tier>: prefix form + multi-line heading extractor + --supply-* manual overrides.
 *   DRY-RUN by default. --apply flag writes files. Idempotent.
 * @csps-version 2.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:script domain:governance session:S062
 * @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE PROTO-S062-A-STEP2
 *
 * USAGE:
 *   node tools/scripts/migrate-enforcement-trio.mjs              → dry-run all 66 files
 *   node tools/scripts/migrate-enforcement-trio.mjs --apply      → write all files
 *   node tools/scripts/migrate-enforcement-trio.mjs --file B_PRACE.md         → single file
 *   node tools/scripts/migrate-enforcement-trio.mjs --file B_PRACE.md --apply → apply single file
 *   node tools/scripts/migrate-enforcement-trio.mjs --apply --file B_X.md \
 *     --supply-t1 "tier=hook,path=.claude/hooks/X.sh,status=active" \
 *     --supply-t2 "tier=validator,path=tools/validators/X.mjs,status=active" \
 *     --supply-t3 "tier=memory,path=session-open.sh + AGENTS.md,status=active"
 *
 * EXTRACTION PRIORITY:
 *   1. Inline backtick format: **enforcement_tier:** `{ T1: ... }`
 *   2. Multi-line heading format: **enforcement_tier:**\n- T1: ...\n- T2: ...
 *   3. Manual override: --supply-t1/t2/t3 flags (used when auto-parse fails)
 *
 * PRE-NORMALIZATION (applied before parsing):
 *   - T<N> <word>: → T<N>:  (handles "T1 hook: X" → "T1: X")
 *   - **T<N>:** → T<N>:     (strips bold markers)
 *   - T<N> (<word>): → T<N>: (handles "T1 (hook): X" → "T1: X")
 *
 * FRONTMATTER SCHEMA (per PROTO-S062-A.md STEP 2):
 *   enforcement_trio:
 *     t1: { tier: hook,      path: .claude/hooks/X.sh, status: active|stub|none }
 *     t2: { tier: validator, path: tools/validators/X.mjs, status: active|stub|none }
 *     t3: { tier: memory|schema|feedback, path: description, status: active|none }
 *     exempt_reason: null  # or string if any status=none
 *
 * IDEMPOTENCY:
 *   Files already starting with `---\nenforcement_trio:` are skipped.
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const CONTRACT_DIR = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts');

// ── CLI args ───────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const APPLY   = args.includes('--apply');
const DRY_RUN = !APPLY;

const singleFileArg = (() => {
  const idx = args.indexOf('--file');
  return idx >= 0 ? args[idx + 1] : args.find(a => /^B_.*\.md$/.test(a));
})();

// Manual supply flags — used with --file for true outliers
function parseSupplyFlag(val) {
  if (!val) return null;
  const obj = {};
  val.split(',').forEach(pair => {
    const eq = pair.indexOf('=');
    if (eq >= 0) obj[pair.slice(0, eq).trim()] = pair.slice(eq + 1).trim();
  });
  return Object.keys(obj).length > 0 ? obj : null;
}

const supplyT1Raw = args.includes('--supply-t1') ? args[args.indexOf('--supply-t1') + 1] : null;
const supplyT2Raw = args.includes('--supply-t2') ? args[args.indexOf('--supply-t2') + 1] : null;
const supplyT3Raw = args.includes('--supply-t3') ? args[args.indexOf('--supply-t3') + 1] : null;
const supplyT1 = parseSupplyFlag(supplyT1Raw);
const supplyT2 = parseSupplyFlag(supplyT2Raw);
const supplyT3 = parseSupplyFlag(supplyT3Raw);

// ── Pre-normalization ──────────────────────────────────────────────────────────

/**
 * Normalize enforcement_tier raw content before parsing.
 * Handles the three variant forms that evolved organically:
 *   A) "T1 hook: X"    → "T1: X"   (T<N> <tier>: prefix — 32-contract miss in v1.0)
 *   B) "**T1:** X"     → "T1: X"   (bold markers)
 *   C) "T1 (hook): X"  → "T1: X"   (parenthetical tier qualifier)
 */
function normalizeTierRaw(raw) {
  return raw
    // Form C: T<N> (word): X  →  T<N>: X
    .replace(/T(\d)\s*\([^)]+\):/gi, 'T$1:')
    // Form A: T<N> word: X  →  T<N>: X  (word = hook|validator|schema|memory|session etc.)
    .replace(/T(\d)\s+[a-zA-Z]+:/gi, 'T$1:')
    // Form B: **T<N>:**  →  T<N>:
    .replace(/\*\*T(\d):\*\*/gi, 'T$1:')
    // Collapse extra spaces
    .replace(/\s{2,}/g, ' ');
}

// ── Extraction: inline backtick format ────────────────────────────────────────

/**
 * Extracts content from: **enforcement_tier:** `{ ... }`
 * Returns normalized raw string or null.
 */
function extractInlineBacktick(content) {
  const m = content.match(/\*\*enforcement_tier:\*\*\s*`\{([^`]+)\}`/i);
  return m ? normalizeTierRaw(m[1].trim()) : null;
}

// ── Extraction: multi-line heading format ─────────────────────────────────────

/**
 * Extracts content from heading-style enforcement_tier:
 *   **enforcement_tier:**
 *   - T1: .claude/hooks/X.sh
 *   - T2: validate-X.mjs
 *   - T3: session-open.sh
 *
 * Also handles **Enforcement Trio:** heading variants.
 * Returns normalized synthetic "T1: X, T2: X, T3: X" string or null.
 */
function extractMultilineHeading(content) {
  // Match **enforcement_tier:** or **Enforcement Trio:** NOT followed by backtick on same line
  const headingMatch = content.match(
    /\*\*(?:enforcement_tier|enforcement trio)[^*]*\*\*:?\s*\n((?:[ \t]*[-*]\s*[^\n]+\n?){1,15})/i
  );
  if (!headingMatch) return null;

  const block = headingMatch[1];

  // Try to extract T1, T2, T3 from list items (handles "T1 (hook):", "T1 hook:", "T1:")
  const t1m = block.match(/[-*]\s*T1\s*(?:\([^)]*\)|\w+)?:\s*([^\n]+)/i);
  const t2m = block.match(/[-*]\s*T2\s*(?:\([^)]*\)|\w+)?:\s*([^\n]+)/i);
  const t3m = block.match(/[-*]\s*T3\s*(?:\([^)]*\)|\w+)?:\s*([^\n]+)/i);

  const parts = [];
  if (t1m) parts.push(`T1: ${t1m[1].trim()}`);
  if (t2m) parts.push(`T2: ${t2m[1].trim()}`);
  if (t3m) parts.push(`T3: ${t3m[1].trim()}`);

  if (parts.length === 0) return null;
  return normalizeTierRaw(parts.join(', '));
}

// ── Parse normalized raw into trio object ─────────────────────────────────────

/**
 * Parses the normalized enforcement_tier content into a structured trio.
 * Handles Shape A (full T1+T2+T3) and Shape B (T3-only with no-hook/no-validator).
 */
function parseTierRaw(raw) {
  // ── Shape B: T3-only ──────────────────────────────────────────────────────
  if (/no-hook/i.test(raw) && /no-validator/i.test(raw)) {
    const t3m = raw.match(/T3[:\s]+([^,]+(?:,\s*(?!permanence|T1:|T2:)[^,]+)*)/i);
    const t3d = t3m ? t3m[1].trim().replace(/\s+/g, ' ') : 'session-open.sh + AGENTS.md hard-NO';
    return {
      shape: 'T3-only',
      t1: { tier: 'hook',      path: null,  status: 'none' },
      t2: { tier: 'validator', path: null,  status: 'none' },
      t3: { tier: 'memory',    path: t3d,   status: 'active' },
      exempt_reason: 'T3-only by design — no-hook and no-validator explicitly declared at contract creation.',
    };
  }

  // ── Shape A: standard T1/T2/T3 ───────────────────────────────────────────
  // After normalization, T<N>: prefix form is standardized
  const t1m = raw.match(/T1:\s*([^,]+?)(?=,\s*T2:|,\s*T3:|$)/i);
  const t2m = raw.match(/T2:\s*([^,]+?)(?=,\s*T3:|$)/i);
  const t3m = raw.match(/T3:\s*(.+?)$/i);

  const t1Raw = t1m ? t1m[1].trim() : null;
  const t2Raw = t2m ? t2m[1].trim() : null;
  const t3Raw = t3m ? t3m[1].trim() : null;

  // T1: resolve hook path
  let t1 = { tier: 'hook', path: null, status: 'none' };
  if (t1Raw) {
    const full = t1Raw.match(/(\.claude\/hooks\/[^\s)]+\.sh)/);
    const short = t1Raw.match(/([a-z][a-z-]+\.sh)/i);
    if (full)       t1 = { tier: 'hook', path: full[1],                      status: 'active' };
    else if (short) t1 = { tier: 'hook', path: `.claude/hooks/${short[1]}`,   status: 'stub'   };
  }

  // T2: resolve validator path
  let t2 = { tier: 'validator', path: null, status: 'none' };
  if (t2Raw) {
    const vm = t2Raw.match(/(validate-[a-z][a-z-]+\.mjs)/i);
    if (vm) t2 = { tier: 'validator', path: `tools/validators/${vm[1]}`, status: 'active' };
  }

  // T3: classify tier + capture description
  let t3 = { tier: 'memory', path: null, status: 'none' };
  if (t3Raw) {
    const tier3 = /\bschema\b/i.test(t3Raw) ? 'schema'
      : /\bfeedback\b/i.test(t3Raw) ? 'feedback'
      : 'memory';
    t3 = { tier: tier3, path: t3Raw.replace(/\s+/g, ' ').substring(0, 140).trim(), status: 'active' };
  }

  // Exempt reason
  const ep = [];
  if (t1.status === 'none') ep.push('T1 hook path not extractable from enforcement_tier prose');
  if (t2.status === 'none') ep.push('T2 validator name not extractable from enforcement_tier prose');
  const exempt_reason = ep.length > 0
    ? ep.join('; ') + '. Body-scan may still detect coverage via cross-reference text.'
    : null;

  return { shape: 'full-trio', t1, t2, t3, exempt_reason };
}

// ── Apply manual supply overrides ─────────────────────────────────────────────

function applySupplyOverrides(trio) {
  if (supplyT1) trio.t1 = { tier: 'hook',      ...supplyT1 };
  if (supplyT2) trio.t2 = { tier: 'validator', ...supplyT2 };
  if (supplyT3) trio.t3 = { tier: 'memory',    ...supplyT3 };
  // Recompute exempt_reason after overrides
  const ep = [];
  if (trio.t1.status === 'none') ep.push('T1: manually confirmed none');
  if (trio.t2.status === 'none') ep.push('T2: manually confirmed none');
  trio.exempt_reason = ep.length > 0 ? ep.join('; ') : null;
  return trio;
}

// ── Generate YAML frontmatter block ───────────────────────────────────────────

function ys(val) {
  if (val === null) return 'null';
  return `"${String(val).replace(/"/g, "'")}"`;
}

function generateFrontmatter(trio) {
  return [
    '---',
    'enforcement_trio:',
    '  t1:',
    `    tier: hook`,
    `    path: ${ys(trio.t1.path)}`,
    `    status: ${trio.t1.status}`,
    '  t2:',
    `    tier: validator`,
    `    path: ${ys(trio.t2.path)}`,
    `    status: ${trio.t2.status}`,
    '  t3:',
    `    tier: ${trio.t3.tier}`,
    `    path: ${ys(trio.t3.path)}`,
    `    status: ${trio.t3.status}`,
    `  exempt_reason: ${ys(trio.exempt_reason)}`,
    '---',
    '',
  ].join('\n');
}

// ── Idempotency check ─────────────────────────────────────────────────────────

function alreadyMigrated(content) {
  return content.startsWith('---') && /^enforcement_trio:/m.test(content.substring(0, 400));
}

// ── Main ───────────────────────────────────────────────────────────────────────

const allFiles = readdirSync(CONTRACT_DIR)
  .filter(f => /^B_.*\.md$/.test(f))
  .sort();

const targetFiles = singleFileArg ? [basename(singleFileArg)] : allFiles;

const stats = {
  scanned: 0,
  skipped_idempotent: 0,
  skipped_no_tier: 0,
  would_migrate: 0,
  applied: 0,
  clean: 0,          // full T1+T2+T3 parsed
  partial: 0,        // some status:none (edge case, still migrated)
  no_tier_list: [],
  partial_list: [],  // contracts with at least one status:none
};

const diffs = [];

for (const file of targetFiles) {
  const filePath = join(CONTRACT_DIR, file);
  let content;
  try { content = readFileSync(filePath, 'utf8'); }
  catch { console.error(`[WARN] Cannot read ${file}`); continue; }
  stats.scanned++;

  // Idempotency gate
  if (alreadyMigrated(content)) {
    stats.skipped_idempotent++;
    console.log(`[SKIP:idempotent] ${file}`);
    continue;
  }

  // Extract tier: inline backtick → multi-line heading → null
  const tierRaw = extractInlineBacktick(content) || extractMultilineHeading(content);

  if (!tierRaw && !supplyT1 && !supplyT2 && !supplyT3) {
    stats.skipped_no_tier++;
    stats.no_tier_list.push(basename(file, '.md'));
    console.log(`[SKIP:no-tier] ${file}`);
    continue;
  }

  // Parse (may be null if only supply flags provided)
  let trio = tierRaw
    ? parseTierRaw(tierRaw)
    : { shape: 'supply-only', t1: { tier: 'hook', path: null, status: 'none' },
        t2: { tier: 'validator', path: null, status: 'none' },
        t3: { tier: 'memory', path: null, status: 'none' }, exempt_reason: 'No tier line found; values supplied manually.' };

  if (supplyT1 || supplyT2 || supplyT3) trio = applySupplyOverrides(trio);

  const isClean = trio.t1.status !== 'none' && trio.t2.status !== 'none' && trio.t3.status !== 'none';
  if (isClean) stats.clean++;
  else { stats.partial++; stats.partial_list.push(basename(file, '.md')); }

  const frontmatter = generateFrontmatter(trio);
  stats.would_migrate++;

  if (DRY_RUN) {
    diffs.push({ file, frontmatter, shape: trio.shape, clean: isClean });
  } else {
    writeFileSync(filePath, frontmatter + content, 'utf8');
    stats.applied++;
    console.log(`[APPLIED] ${file}`);
  }
}

// Output diffs
if (DRY_RUN) {
  for (const { file, frontmatter, shape, clean } of diffs) {
    console.log('\n' + '═'.repeat(62));
    console.log(`DIFF: ${basename(file, '.md')}  [shape:${shape}  clean:${clean}]`);
    console.log('═'.repeat(62));
    frontmatter.split('\n').filter(Boolean).forEach(l => console.log(`+  ${l}`));
    console.log(`   [body unchanged]`);
  }
}

// Summary
console.log('\n' + '─'.repeat(62));
console.log('[migrate-enforcement-trio v2.0] SUMMARY');
console.log(`  mode:               ${APPLY ? 'APPLY' : 'DRY-RUN'}`);
console.log(`  files_scanned:      ${stats.scanned}`);
console.log(`  would_migrate:      ${stats.would_migrate} (clean:${stats.clean} partial:${stats.partial})`);
console.log(`  skipped_idempotent: ${stats.skipped_idempotent}`);
console.log(`  skipped_no_tier:    ${stats.skipped_no_tier} → [${stats.no_tier_list.join(', ')}]`);
if (stats.partial > 0) {
  console.log(`  partial_list:       [${stats.partial_list.join(', ')}]`);
}
if (APPLY) console.log(`  applied:            ${stats.applied}`);
console.log('  exit_code:          0');
