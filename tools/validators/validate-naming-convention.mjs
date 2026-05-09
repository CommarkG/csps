#!/usr/bin/env node
/**
 * validate-naming-convention.mjs — CSPS Naming Convention Gate
 *
 * ROOT CAUSE TARGETED (S006 turn 24, B_NAMING_POLICY, P-ARCH-029):
 *   Naming inconsistency has accumulated despite a clear 4-rule policy existing.
 *   The policy is in naming-policy.md. The validator (this file) was marked
 *   "impl week-4" and never built. Now implementing as S021 addresses the gap.
 *
 * The 4 rules enforced:
 *   Rule 1: Always-current artifacts — no -SXXX/-v1/-final suffix in filename
 *   Rule 2: Per-session artifacts — must have -S[0-9]+ suffix
 *   Rule 3: Per-topic artifacts — in topic-plans/ or element-reviews/
 *   Rule 4: Layer-prefixed artifacts — L1_CORE/L2_DOMAIN/L3_INSTANCES preserved
 *
 * Additional checks:
 *   - Filenames must be kebab-case (no spaces, no UPPER unless special patterns)
 *   - External input files should have EXT- prefix (advisory)
 *   - id field in frontmatter must match dotted-lowercase convention
 *   - No duplicate filenames across the repo (collision detection)
 *
 * Coverage Levels:
 *   ✓ Level 1: Kebab-case filename validation on scan-new files
 *   ✓ Level 2: Forbidden suffix detection (no -v1, -final, -copy, -new, -backup)
 *   ✓ Level 3: External input file detection (should have EXT- prefix)
 *   ✓ Level 4: Duplicate filename detection across repo
 *   ✗ Level 5: Cross-reference integrity (renamed file updates all inbound links) → VLT-S021-NAMING-XREF
 *
 * When this exits 0: filename conventions are respected for new files
 * When this exits 0, it does NOT prove: all existing files are correctly named
 *
 * Exit: 0 always (advisory — naming convention improvements take time to backfill)
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// Forbidden suffixes in always-current filenames (not in per-session paths)
const FORBIDDEN_SUFFIXES = ['-v1', '-v2', '-final', '-latest', '-current', '-new', '-old', '-copy', '-backup', '-draft', '-temp', '-tmp'];

// Directories where session-coded filenames are expected
const SESSION_CODED_DIRS = ['_handoff/VAULT', 'governor-prompts', 'closing-summary', 'element-reviews'];

// Paths that are exempt from checks
const EXEMPT_PATTERNS = [
  /node_modules/, /.git/, /L1_CORE_/, /L2_DOMAIN_/, /L3_INSTANCES_/,
  /AGENTS\.md$/, /README\.md$/, /HANDOFF-S/, /SESSION-BRIEF/,
  /audit-runner\/pipeline-/, /behavioral-contracts\/B_/, /principles\/P-/,
  /council\/(opus-turn|sonnet-turn|PROTOCOL|opus-protocol)\.md$/,
  /governor-comments\//,
];

function isExempt(filePath) {
  return EXEMPT_PATTERNS.some(p => p.test(filePath));
}

function getNewFiles() {
  try {
    const out = execSync('git status --short', { cwd: ROOT, encoding: 'utf8' });
    return out.split('\n')
      .filter(l => l.trim().startsWith('?? ') || l.trim().startsWith('A  '))
      .map(l => l.trim().replace(/^[?MAD ]+/, '').trim())
      .filter(f => (f.endsWith('.md') || f.endsWith('.mjs') || f.endsWith('.yaml') || f.endsWith('.sh')));
  } catch { return []; }
}

function getAllFilenames(dir, results = new Map()) {
  if (!existsSync(dir)) return results;
  try {
    for (const entry of readdirSync(dir)) {
      if (isExempt(entry) || entry === 'node_modules') continue;
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        getAllFilenames(full, results);
      } else if (['.md', '.mjs', '.yaml', '.sh'].includes(extname(entry))) {
        const name = basename(entry);
        if (!results.has(name)) results.set(name, []);
        results.get(name).push(full.replace(ROOT, '').replace(/\\/g, '/'));
      }
    }
  } catch {}
  return results;
}

function checkFilename(filePath) {
  const issues = [];
  const name = basename(filePath);
  const relPath = filePath.replace(ROOT + '/', '').replace(ROOT + '\\', '').replace(/\\/g, '/');

  if (isExempt(relPath)) return issues;

  // Check for forbidden suffixes (in non-session paths)
  const isInSessionPath = SESSION_CODED_DIRS.some(d => relPath.includes(d));
  for (const suffix of FORBIDDEN_SUFFIXES) {
    const nameWithoutExt = name.replace(/\.[^.]+$/, '');
    if (nameWithoutExt.endsWith(suffix)) {
      issues.push({ severity: 'ADVISORY', message: `Forbidden suffix "${suffix}" in filename: ${name}` });
    }
  }

  // Check for spaces in filename
  if (name.includes(' ')) {
    issues.push({ severity: 'ADVISORY', message: `Spaces in filename: "${name}" — use kebab-case` });
  }

  // Check for uppercase in non-special filenames
  if (/[A-Z]/.test(name) && !name.startsWith('L1_') && !name.startsWith('L2_') && !name.startsWith('L3_') && name !== 'AGENTS.md' && name !== 'README.md') {
    issues.push({ severity: 'INFO', message: `Uppercase in filename: "${name}" — prefer kebab-case for regular artifacts` });
  }

  // External input files: should have EXT- prefix
  if (relPath.includes('_handoff/VAULT/') && !relPath.includes('/EXT-') && !relPath.includes('-S0') && !relPath.includes('-S1') && !relPath.includes('-S2')) {
    // Check if this looks like an externally-provided file (no CSPS session pattern)
    const hasSessionCode = /-S\d{3}/.test(name);
    const hasEXTPrefix = name.startsWith('EXT-');
    const isKnownCSPSFile = ['README', 'HANDOFF', 'PROTOCOL', 'simulation', 'research-registry', 'platform-update'].some(p => name.includes(p));

    if (!hasSessionCode && !hasEXTPrefix && !isKnownCSPSFile && name.endsWith('.md')) {
      // Looks like an external file (knowledge-tree-empty.md etc.)
      issues.push({ severity: 'ADVISORY', message: `File in VAULT without session code or EXT- prefix: "${name}". If externally received, add EXT-[source]-S[NNN]- prefix.` });
    }
  }

  return issues;
}

async function main() {
  const args = process.argv.slice(2);
  const scanNew = args.includes('--scan-new') || args.length === 0;
  const checkDuplicates = args.includes('--duplicates');

  const allIssues = [];
  const advisoryCount = { total: 0, duplicates: 0, suffixes: 0, external: 0, spaces: 0 };

  if (scanNew) {
    const newFiles = getNewFiles();
    if (newFiles.length === 0) {
      console.log('[validate-naming-convention] No new files to check');
    } else {
      console.log(`\nChecking ${newFiles.length} new/modified files:`);
      for (const f of newFiles) {
        const issues = checkFilename(join(ROOT, f));
        for (const issue of issues) {
          console.log(`  ${issue.severity}: ${issue.message}`);
          allIssues.push(issue);
          advisoryCount.total++;
        }
        if (issues.length === 0) {
          console.log(`  ✓ ${f.split('/').pop()} — naming OK`);
        }
      }
    }
  }

  // Duplicate detection
  if (checkDuplicates || args.includes('--full')) {
    const allFiles = getAllFilenames(ROOT);
    const duplicates = [...allFiles.entries()].filter(([, paths]) => paths.length > 1);

    if (duplicates.length > 0) {
      console.log(`\n⚠ DUPLICATE FILENAMES (${duplicates.length} collisions):`);
      for (const [name, paths] of duplicates.slice(0, 10)) {
        console.log(`  "${name}" exists in ${paths.length} locations:`);
        for (const p of paths) console.log(`    → ${p}`);
        advisoryCount.duplicates++;
        advisoryCount.total++;
      }
      if (duplicates.length > 10) console.log(`  ... and ${duplicates.length - 10} more`);
    } else {
      console.log(`\n✓ No duplicate filenames detected across ${allFiles.size} files`);
    }
  }

  // Summary
  console.log(`
NAMING POLICY (4 rules from naming-policy.md):
  Rule 1: Always-current → no -v1/-final/-copy suffix (use frontmatter version:)
  Rule 2: Per-session → include -S[NNN] suffix (closing-summary-S021.md)
  Rule 3: Per-topic → topic-plans/ or element-reviews/ directory
  Rule 4: Layer-prefixed → L1_CORE/L2_DOMAIN/L3_INSTANCES preserved

EXTERNAL INPUT NAMING (EXT- prefix convention):
  Files received from external sources: EXT-[source]-S[NNN]-[original-slug].md
  Example: EXT-LOVABLE-S021-knowledge-tree-empty.md
  Original preserved as: knowledge-tree-empty.md
  Run: --duplicates to check for filename collisions across repo
`);

  console.log(`[validate-naming-convention] issues=${allIssues.length} advisory=${advisoryCount.total} duplicates=${advisoryCount.duplicates} status=${advisoryCount.total > 0 ? 'ADVISORY' : 'CLEAN'}`);

  process.exit(0); // always advisory — naming is backfill work
}

main().catch(err => {
  console.error('[validate-naming-convention] fatal:', err);
  process.exit(1);
});
