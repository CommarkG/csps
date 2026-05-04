#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-principle-count-staleness
 * @csps-name validate-principle-count-staleness
 * @csps-description Per ADR-0022 + B_PRE_CLOSE_VERIFICATION cycle. Greps active prose for hardcoded principle-count text (e.g., "N meta-principles" / "P-META-001 through P-META-NNN" / "N operating principles") and compares against current row counts in principles.yaml. Flags any active file with stale count. Snapshot/historical files (HANDOFF-S* / qc-audit-results-S* / validation-pass-S* / chat-jump-prompt-* / blockers-S* / gaps-and-duplications-S* / VAULT/insights.md / _legacy/) excluded — these are intentionally frozen at point-in-time. Active S005 turn 26 (was DECLARED-DEFERRED week-4 audit-runner; now ACTIVE-MECHANICAL via verify.mjs).
 * @csps-version 0.1.0
 * @csps-owner group:finky
 * @csps-lifecycle experimental
 * @csps-lifecycle-state active
 * @csps-tags type:util domain:governance audience:developer
 * @csps-enforces P-META-001 ADR-0022 B_PRE_CLOSE_VERIFICATION
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const SCAN_PATHS = ['docs', 'packages', 'libs', 'apps', 'tools', 'AGENTS.md', 'MASTER_PLAN.md'];
const SKIP_DIRS = new Set(['node_modules', '.git', '.claude', 'dist', 'build', '.next', 'tmp', 'coverage']);

// Snapshot/historical files exempt (intentionally frozen at point-in-time)
const EXEMPT_GLOBS = [
  /HANDOFF-S\d+-to-S\d+\.md$/,
  /qc-audit-results-S\d+\.md$/,
  /validation-pass-S\d+\.md$/,
  /chat-jump-prompt-/,
  /blockers-S\d+\.md$/,
  /gaps-and-duplications-S\d+\.md$/,
  /VAULT[\/\\]insights\.md$/,
  /VAULT[\/\\]principles-snapshot\.md$/,
  /VAULT[\/\\]decisions-snapshot\.md$/,
  /VAULT[\/\\]governor-prompts[\/\\]/,    // S005 turn 27 — governor-prompts logs contain user verbatim with historically-accurate count quotes; intentionally frozen
  /_legacy[\/\\]/,
  // ADRs documenting the fix itself
  /docs[\/\\]adr[\/\\]0021-/,
  /docs[\/\\]adr[\/\\]0022-/,
  // The yaml itself (source of truth — count text in description-narrative form is OK)
  /packages[\/\\]principles[\/\\]principles\.yaml$/,
  // Auto-generated transient
  /tools[\/\\]verify-last-run\.md$/,
  /tools[\/\\]bootstrap-readiness\.md$/,
];

// Patterns for stale count text
const STALE_PATTERNS = [
  // "N meta-principles" / "N meta principles"
  /\b(\d+)\s+meta[\-\s]principles?\b/g,
  // "N operating principles"
  /\b(\d+)\s+operating\s+principles?\b/g,
  // "P-META-001 through P-META-NNN" / "P-META-001 through NNN"
  /P-META-001\s+through\s+(?:P-META-)?(\d+)/gi,
  // "P-OP-001 through P-OP-NNN"
  /P-OP-001\s+through\s+(?:P-OP-)?(\d+)/gi,
];

function isExempt(path) {
  return EXEMPT_GLOBS.some((rx) => rx.test(path));
}

async function getCurrentCounts() {
  const yamlPath = resolve(ROOT, 'packages/principles/principles.yaml');
  const content = await readFile(yamlPath, 'utf8');
  const meta = (content.match(/^  - id: P-META-/gm) ?? []).length;
  const op = (content.match(/^  - id: P-OP-/gm) ?? []).length;
  return { meta, op };
}

async function walkDir(dir, accum = []) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch { return accum; }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walkDir(full, accum);
    else if (entry.isFile() && (extname(entry.name) === '.md' || entry.name === 'AGENTS.md')) accum.push(full);
  }
  return accum;
}

async function main() {
  const counts = await getCurrentCounts();

  const files = [];
  for (const p of SCAN_PATHS) {
    const full = resolve(ROOT, p);
    try {
      const s = await stat(full);
      if (s.isDirectory()) {
        files.push(...(await walkDir(full)));
      } else if (s.isFile() && (extname(p) === '.md' || p.endsWith('AGENTS.md') || p.endsWith('MASTER_PLAN.md'))) {
        files.push(full);
      }
    } catch { /* path doesn't exist */ }
  }

  const findings = [];
  let scanned = 0;

  for (const file of files) {
    const rel = file.replace(ROOT, '').replace(/\\/g, '/').replace(/^\//, '');
    if (isExempt(file)) continue;
    scanned++;

    let content;
    try { content = await readFile(file, 'utf8'); }
    catch { continue; }

    for (const rx of STALE_PATTERNS) {
      // Reset regex lastIndex (g flag)
      rx.lastIndex = 0;
      let m;
      while ((m = rx.exec(content)) !== null) {
        const claimedNum = Number(m[1]);
        const isMetaPattern = m[0].includes('META') || m[0].toLowerCase().includes('meta');
        const isOpPattern = m[0].includes('OP') || m[0].toLowerCase().includes('operating');
        const expected = isMetaPattern ? counts.meta : (isOpPattern ? counts.op : null);
        if (expected !== null && claimedNum !== expected) {
          findings.push({
            file: rel,
            claimed: claimedNum,
            expected,
            text: m[0],
            kind: isMetaPattern ? 'meta-principle' : 'operating-principle',
          });
        }
      }
    }
  }

  const summary = `[validate-principle-count-staleness] scanned=${scanned} active_files_with_stale_count=${findings.length} (current counts: meta=${counts.meta} op=${counts.op})`;

  if (findings.length > 0) {
    console.error(`\n${findings.length} stale count finding(s):`);
    for (const f of findings.slice(0, 30)) {
      console.error(`  ✗ ${f.file}: claims "${f.text}" — current ${f.kind} count is ${f.expected}`);
    }
    if (findings.length > 30) console.error(`  ... and ${findings.length - 30} more`);
    console.error(`\n${summary}`);
    process.exit(1);
  }

  console.log(`✓ no stale principle-count text in active prose`);
  console.log(summary);
  process.exit(0);
}

main().catch((err) => {
  console.error('[validate-principle-count-staleness] fatal:', err);
  process.exit(2);
});
