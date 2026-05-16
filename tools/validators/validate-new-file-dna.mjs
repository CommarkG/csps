#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-new-file-dna
 * @csps-name validate-new-file-dna
 * @csps-description DNA Inheritance Gate: scans TypeScript/JS files added in the last git
 * commit for CSPS DNA signals. New code files must carry at minimum one DNA marker:
 * (1) @csps-id annotation, (2) @csps-enforces reference, (3) graceful passthrough pattern
 * (check env var before calling external service), OR (4) be covered by a PI item with
 * a wiring_checklist entry matching the file path. ADVISORY for files < 50 lines.
 * BLOCKING for new lib/integration files > 50 lines without any DNA signal.
 *
 * The gap this closes: new code is written with training-default patterns (plain Node.js,
 * no governance linkage) rather than CSPS-DNA-aligned patterns. Creation completeness checks
 * the PI YAML; this checks the ACTUAL CODE FILES that get committed.
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:developer
 * @csps-enforces P-ARCH-031 P-META-019
 *
 * Coverage Levels:
 *   ✓ Checks: TypeScript/JS files added in last git commit (not modified, only added)
 *   ✓ Detects: files > 50 lines with no CSPS DNA signal (libs/ = BLOCKING, others = ADVISORY)
 *   ✓ DNA signals: @csps-id, @csps-enforces, env var check, PI wiring_checklist mention
 *   ✗ Does not check: modified files (only new files)
 *   ✗ Does not check: test files, generated files, node_modules
 *
 * Exit: 1 if BLOCKING violations in libs/ files > 50 lines. 0 otherwise.
 * Output: files_checked=N dna_ok=N advisory=N blocking=N
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const PLAN_ITEMS_DIR = resolve(ROOT, 'docs/plan/_handoff/VAULT/plan-items');

// DNA signals — any ONE of these counts
const DNA_PATTERNS = [
  /@csps-id\s+\S+/,          // @csps-id annotation
  /@csps-enforces\s+\S+/,    // @csps-enforces annotation
  /@csps-description\s+/,    // @csps-description annotation
  /process\.env\.\w+[^;]*\s+(?:return|if)\b/,  // graceful passthrough (env check + return)
  /if\s*\(!?\s*process\.env\.\w+\)/,              // explicit env guard
  /linked_principle:/,        // explicit principle linkage
  /P-[A-Z]+-\d{3}/,          // principle reference anywhere
  /B_[A-Z_]+/,                // contract reference anywhere
];

// File patterns to skip
const SKIP_PATTERNS = [
  /node_modules/,
  /\.next\//,
  /dist\//,
  /build\//,
  /generated\//,
  /\.test\.[tj]s$/,
  /\.spec\.[tj]s$/,
  /\.d\.ts$/,
];

let filesChecked = 0;
let dnaOk = 0;
let advisory = 0;
let blocking = 0;

// Get newly added files from last commit
let addedFiles = [];
try {
  const result = execSync('git diff --name-only --diff-filter=A HEAD~1 HEAD 2>/dev/null || git diff --name-only --diff-filter=A --cached', {
    cwd: ROOT,
    encoding: 'utf-8',
  }).trim();
  addedFiles = result.split('\n').filter(f =>
    f && /\.(ts|tsx|mjs|js)$/.test(f) && !SKIP_PATTERNS.some(p => p.test(f))
  );
} catch {
  // No previous commit or git unavailable
  console.log(`[validate-new-file-dna] no git diff available files_checked=0 dna_ok=0 advisory=0 blocking=0`);
  process.exit(0);
}

// Load PI wiring checklists for coverage check
const piFileContents = [];
if (existsSync(PLAN_ITEMS_DIR)) {
  const { readdirSync } = await import('node:fs');
  const piFiles = readdirSync(PLAN_ITEMS_DIR).filter(f => /^PI-\d{3}-.+\.yaml$/.test(f));
  for (const f of piFiles) {
    piFileContents.push(readFileSync(resolve(PLAN_ITEMS_DIR, f), 'utf-8'));
  }
}

for (const file of addedFiles) {
  const fullPath = resolve(ROOT, file);
  if (!existsSync(fullPath)) continue;

  const content = readFileSync(fullPath, 'utf-8');
  const lines = content.split('\n').length;
  const relPath = relative(ROOT, fullPath).replace(/\\/g, '/');

  filesChecked++;

  // Skip very short files
  if (lines < 50) {
    dnaOk++;
    continue;
  }

  // Check DNA signals
  const hasDna = DNA_PATTERNS.some(p => p.test(content));

  // Check PI wiring_checklist coverage
  const coveredByPi = piFileContents.some(pi => pi.includes(relPath) || pi.includes(file));

  if (hasDna || coveredByPi) {
    dnaOk++;
    continue;
  }

  // Determine severity
  const isLibsOrIntegrations = /^libs\//.test(relPath);
  const isBlockable = isLibsOrIntegrations && lines >= 50;

  if (isBlockable) {
    blocking++;
    console.error(
      `[validate-new-file-dna] BLOCKING: ${relPath} (${lines} lines) has no CSPS DNA signal.\n` +
      `  Required: at least ONE of:\n` +
      `    • @csps-id annotation at top of file\n` +
      `    • @csps-enforces P-META-NNN or B_CONTRACT_NAME\n` +
      `    • Graceful passthrough (if (!process.env.VAR) return)\n` +
      `    • PI wiring_checklist entry referencing this file path\n` +
      `  Why: new libs/ files must carry CSPS DNA — they become part of the platform moat.\n` +
      `  Add: // @csps-enforces P-ARCH-031  at top, + ensure a PI item covers this file.`
    );
  } else {
    advisory++;
    console.warn(
      `[validate-new-file-dna] ADVISORY: ${relPath} (${lines} lines) has no CSPS DNA signal.\n` +
      `  Add @csps-enforces or a PI wiring_checklist entry covering this path.`
    );
  }
}

console.log(`[validate-new-file-dna] files_checked=${filesChecked} dna_ok=${dnaOk} advisory=${advisory} blocking=${blocking}`);
process.exit(blocking > 0 ? 1 : 0);
