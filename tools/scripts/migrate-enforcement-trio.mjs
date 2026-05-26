#!/usr/bin/env node
/**
 * @csps-id csps.tools.scripts.migrate-enforcement-trio
 * @csps-name migrate-enforcement-trio
 * @csps-description Migration script: reads each B_*.md contract, parses existing body
 *   "enforcement_tier:" prose, and prepends structured YAML frontmatter with enforcement_trio
 *   block per PROTO-S062-A STEP 2 schema.
 *   DRY-RUN by default. --apply flag writes files. Idempotent.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:script domain:governance session:S062
 * @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE PROTO-S062-A-STEP2
 *
 * USAGE:
 *   node tools/scripts/migrate-enforcement-trio.mjs              → dry-run all 66 files
 *   node tools/scripts/migrate-enforcement-trio.mjs --apply      → write all files
 *   node tools/scripts/migrate-enforcement-trio.mjs --sample 3   → dry-run first N files only
 *   node tools/scripts/migrate-enforcement-trio.mjs --file B_PRACE.md         → single file
 *   node tools/scripts/migrate-enforcement-trio.mjs --file B_PRACE.md --apply → apply single file
 *
 * FRONTMATTER SCHEMA (per PROTO-S062-A.md STEP 2):
 *   enforcement_trio:
 *     t1: { tier: hook,      path: .claude/hooks/X.sh, status: active|stub|none }
 *     t2: { tier: validator, path: tools/validators/X.mjs, status: active|stub|none }
 *     t3: { tier: memory|schema|feedback, path: description, status: active|none }
 *     exempt_reason: null  # or string if any status=none
 *
 * BODY-LINE FORMAT (what this script parses):
 *   Shape A — full trio:
 *     **enforcement_tier:** `{ T1: .claude/hooks/X.sh, T2: validate-X.mjs (advisory), T3: desc }`
 *   Shape B — T3-only:
 *     **enforcement_tier:** `{ tier: session-only, no-hook, no-validator, T3 desc, permanence: low (T3-only) }`
 *
 * IDEMPOTENCY:
 *   Files already starting with `---\nenforcement_trio:` are skipped.
 *   Re-running produces 0 new diffs on previously-migrated files.
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const CONTRACT_DIR = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts');

// ── CLI args ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const APPLY    = args.includes('--apply');
const DRY_RUN  = !APPLY;
const sampleN  = args.includes('--sample') ? parseInt(args[args.indexOf('--sample') + 1], 10) : null;
const singleFileArg = args.find(a => a.match(/^B_.*\.md$/));

// ── Parse enforcement_tier body line ──────────────────────────────────────────

/**
 * Extracts the content inside backticks on the enforcement_tier line.
 * Returns null if no match.
 */
function extractTierRaw(content) {
  const m = content.match(/\*\*enforcement_tier:\*\*\s*`\{([^`]+)\}`/i);
  return m ? m[1].trim() : null;
}

/**
 * Parses the raw enforcement_tier content (between braces) into a trio object.
 * Handles Shape A (full T1+T2+T3) and Shape B (T3-only).
 */
function parseTierRaw(raw) {
  // ── Shape B: T3-only ──────────────────────────────────────────────────────
  if (/no-hook/i.test(raw) && /no-validator/i.test(raw)) {
    // Extract the T3 description: "T3 <desc>" (no colon — positional)
    const t3Match = raw.match(/T3\s+([^,]+(?:,\s*(?!permanence|T1|T2)[^,]+)*)/i);
    const t3Desc  = t3Match ? t3Match[1].trim().replace(/\s+/g, ' ') : 'session-open.sh + AGENTS.md hard-NO';
    return {
      shape: 'T3-only',
      t1: { tier: 'hook',      path: null,      status: 'none' },
      t2: { tier: 'validator', path: null,       status: 'none' },
      t3: { tier: 'memory',    path: t3Desc,     status: 'active' },
      exempt_reason: 'T3-only by design — no-hook and no-validator explicitly declared at contract creation. Permanence: low.',
    };
  }

  // ── Shape A: full T1+T2+T3 ───────────────────────────────────────────────
  // T1: extract hook path (stops at ", T2:" or end)
  const t1Match = raw.match(/T1:\s*([^,]+?)(?=,\s*T2:|$)/i);
  // T2: extract validator name (stops at ", T3:" or end)
  const t2Match = raw.match(/T2:\s*([^,]+?)(?=,\s*T3:|$)/i);
  // T3: extract rest (stops at end of raw — braces already stripped)
  const t3Match = raw.match(/T3:\s*(.+?)$/i);

  const t1Raw = t1Match ? t1Match[1].trim() : null;
  const t2Raw = t2Match ? t2Match[1].trim() : null;
  const t3Raw = t3Match ? t3Match[1].trim() : null;

  // ── T1: resolve hook path ─────────────────────────────────────────────────
  let t1 = { tier: 'hook', path: null, status: 'none' };
  if (t1Raw) {
    // Full path: .claude/hooks/X.sh
    const fullHookMatch = t1Raw.match(/(\.claude\/hooks\/[^\s)]+\.sh)/);
    // Short form: X.sh (without leading path)
    const shortHookMatch = t1Raw.match(/([a-z][a-z-]+\.sh)/);
    if (fullHookMatch) {
      t1 = { tier: 'hook', path: fullHookMatch[1], status: 'active' };
    } else if (shortHookMatch) {
      t1 = { tier: 'hook', path: `.claude/hooks/${shortHookMatch[1]}`, status: 'stub' };
    }
  }

  // ── T2: resolve validator path ────────────────────────────────────────────
  let t2 = { tier: 'validator', path: null, status: 'none' };
  if (t2Raw) {
    // Strip " (advisory)", " (planned)", " (week-4)" suffixes
    const validatorMatch = t2Raw.match(/(validate-[a-z][a-z-]+\.mjs)/i);
    if (validatorMatch) {
      t2 = {
        tier: 'validator',
        path: `tools/validators/${validatorMatch[1]}`,
        status: 'active',
      };
    }
  }

  // ── T3: determine tier + path ─────────────────────────────────────────────
  let t3 = { tier: 'memory', path: null, status: 'none' };
  if (t3Raw) {
    // Classify tier by content keywords
    const tier3 = /\bschema\b/i.test(t3Raw) ? 'schema'
      : /\bfeedback\b/i.test(t3Raw) ? 'feedback'
      : 'memory';
    // Trim to reasonable length for YAML value
    const desc = t3Raw.replace(/\s+/g, ' ').substring(0, 140).trim();
    t3 = { tier: tier3, path: desc, status: 'active' };
  }

  // ── Exempt reason ─────────────────────────────────────────────────────────
  const exemptParts = [];
  if (t1.status === 'none') exemptParts.push('T1 hook not declared in enforcement_tier body line');
  if (t2.status === 'none') exemptParts.push('T2 validator not declared in enforcement_tier body line');
  const exempt_reason = exemptParts.length > 0
    ? exemptParts.join('; ') + '. Body-scan detection may still provide coverage via cross-reference text.'
    : null;

  return { shape: 'full-trio', t1, t2, t3, exempt_reason };
}

// ── Generate YAML frontmatter block ──────────────────────────────────────────

function yamlStr(val) {
  if (val === null) return 'null';
  // Escape for inline YAML string value
  const s = String(val).replace(/"/g, "'");
  return `"${s}"`;
}

function generateFrontmatter(trio) {
  const lines = [
    '---',
    'enforcement_trio:',
    '  t1:',
    `    tier: hook`,
    `    path: ${yamlStr(trio.t1.path)}`,
    `    status: ${trio.t1.status}`,
    '  t2:',
    `    tier: validator`,
    `    path: ${yamlStr(trio.t2.path)}`,
    `    status: ${trio.t2.status}`,
    '  t3:',
    `    tier: ${trio.t3.tier}`,
    `    path: ${yamlStr(trio.t3.path)}`,
    `    status: ${trio.t3.status}`,
    `  exempt_reason: ${yamlStr(trio.exempt_reason)}`,
    '---',
    '',
  ];
  return lines.join('\n');
}

// ── Idempotency check ─────────────────────────────────────────────────────────

function alreadyMigrated(content) {
  // File must start with `---` AND have `enforcement_trio:` within first 400 chars
  return content.startsWith('---') && /^enforcement_trio:/m.test(content.substring(0, 400));
}

// ── Main ──────────────────────────────────────────────────────────────────────

const allFiles = readdirSync(CONTRACT_DIR)
  .filter(f => /^B_.*\.md$/.test(f))
  .sort();

const targetFiles = singleFileArg
  ? [singleFileArg]
  : sampleN
    ? allFiles.slice(0, sampleN)
    : allFiles;

let stats = {
  scanned: 0,
  skipped_idempotent: 0,
  skipped_no_tier: 0,
  would_migrate: 0,
  applied: 0,
  edge_cases: [],          // t1.status=none or t2.status=none despite having tier line
  no_tier_list: [],
};

const diffs = [];  // { file, frontmatter, shape }

for (const file of targetFiles) {
  const filePath = join(CONTRACT_DIR, file);
  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch {
    console.error(`[WARN] Cannot read ${file} — skipping`);
    continue;
  }
  stats.scanned++;

  // Idempotency gate
  if (alreadyMigrated(content)) {
    stats.skipped_idempotent++;
    console.log(`[SKIP:idempotent] ${file}`);
    continue;
  }

  // Find enforcement_tier line
  const tierRaw = extractTierRaw(content);
  if (!tierRaw) {
    stats.skipped_no_tier++;
    stats.no_tier_list.push(basename(file, '.md'));
    console.log(`[SKIP:no-tier-line] ${file}`);
    continue;
  }

  const trio = parseTierRaw(tierRaw);

  // Track edge cases (none-status T1 or T2 despite having an enforcement_tier line)
  if (trio.t1.status === 'none' || trio.t2.status === 'none') {
    stats.edge_cases.push({ file, shape: trio.shape, t1: trio.t1.status, t2: trio.t2.status });
  }

  const frontmatter = generateFrontmatter(trio);
  stats.would_migrate++;

  if (!APPLY) {
    // DRY-RUN: collect diff
    diffs.push({ file, frontmatter, shape: trio.shape, trio });
  } else {
    // APPLY: write file
    writeFileSync(filePath, frontmatter + content, 'utf8');
    stats.applied++;
    console.log(`[APPLIED] ${file}`);
  }
}

// ── Output ────────────────────────────────────────────────────────────────────

if (!APPLY && diffs.length > 0) {
  for (const { file, frontmatter, shape } of diffs) {
    console.log('\n' + '═'.repeat(62));
    console.log(`DIFF: ${basename(file, '.md')}  [shape: ${shape}]`);
    console.log('═'.repeat(62));
    frontmatter.split('\n').forEach(line => {
      if (line !== '') console.log(`+  ${line}`);
    });
    console.log(`   [file body unchanged]`);
  }
}

console.log('\n' + '─'.repeat(62));
console.log('[migrate-enforcement-trio] SUMMARY');
console.log(`  mode:                ${APPLY ? 'APPLY' : 'DRY-RUN'}`);
console.log(`  files_scanned:       ${stats.scanned}`);
console.log(`  would_migrate:       ${stats.would_migrate}`);
console.log(`  skipped_idempotent:  ${stats.skipped_idempotent}`);
console.log(`  skipped_no_tier:     ${stats.skipped_no_tier} → [${stats.no_tier_list.join(', ')}]`);
console.log(`  edge_cases:          ${stats.edge_cases.length}`);
if (stats.edge_cases.length > 0) {
  stats.edge_cases.forEach(e => console.log(`    - ${e.file} (shape:${e.shape} t1:${e.t1} t2:${e.t2})`));
}
if (APPLY) console.log(`  applied:             ${stats.applied}`);
console.log('  exit_code:           0');
