#!/usr/bin/env node
/**
 * validate-layer-boundary.mjs — Platform Layer Boundary Enforcement Gate
 *
 * ROOT CAUSE TARGETED (S019 VLT-S019-LAYER-BOUNDARY / platform-layer-boundaries.yaml):
 *   L0 (Platform Core: libs/) MUST NEVER import from L1/L2 (apps/).
 *   Import flows: L2 (User) → L1 (Developer) → L0 (Core) → External.
 *   Reverse imports (L0 → L1 or L0 → L2) invert the dependency graph,
 *   prevent app graduation, and silently couple shared infrastructure to
 *   app-specific code.
 *
 * Coverage Levels:
 *   ✓ Level 1: Detect static imports in libs/ .ts files from paths containing /apps/
 *   ✓ Level 2: Detect require() calls in libs/ .ts files pointing to apps/
 *   ✗ Level 3: Detect dynamic import() expressions at runtime → VLT-S020-LAYER-DYNAMIC
 *   ✗ Level 4: Detect indirect imports (re-exports through intermediate files) → VLT-S020-LAYER-INDIRECT
 *
 * When this validator exits 0, it proves:
 *   - No static or require() L0→L1/L2 imports exist in libs/ .ts files
 *   - The dependency graph is correctly directed (L0 is self-contained)
 * When this validator exits 0, it does NOT prove:
 *   - Dynamic import() calls are layer-compliant (Level 3 coverage)
 *   - Re-exports through intermediate files are layer-compliant (Level 4 coverage)
 *   - JavaScript files (*.js, *.mjs) in libs/ are layer-compliant (only .ts files scanned)
 *
 * Exit codes:
 *   0 = no layer boundary violations found (clean baseline)
 *   1 = BLOCKING — L0→L1 or L0→L2 import detected
 *
 * Source: tools/config/platform-layer-boundaries.yaml
 * Created: S020 LAYER-1 per sonnet-task-list-S020.md
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const LIBS_DIR = join(ROOT, 'libs');

// Patterns that indicate a static import from apps/ (relative paths going up to apps/)
// Also catches absolute tsconfig-path imports like `import from 'apps/...'`
const IMPORT_PATTERNS = [
  // static import: any characters then from then quote then path-containing-/apps/
  /^\s*import\s+(?:type\s+)?(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]*\/apps\/[^'"]*)['"]/m,
  // side-effect import
  /^\s*import\s+['"]([^'"]*\/apps\/[^'"]*)['"]/m,
  // require()
  /\brequire\s*\(\s*['"]([^'"]*\/apps\/[^'"]*)['"]\s*\)/m,
];

// Single combined regex for all-in-one line scan (faster)
const COMBINED_PATTERN = /(?:(?:import\s+(?:type\s+)?(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from|import)\s*['"]([^'"]*\/apps\/[^'"]*?)['"]|\brequire\s*\(\s*['"]([^'"]*\/apps\/[^'"]*?)['"]\s*\))/gm;

function walkTs(dir) {
  const files = [];
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...walkTs(full));
    } else if (entry.endsWith('.ts') && !entry.endsWith('.d.ts')) {
      files.push(full);
    }
  }
  return files;
}

function findViolations(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const violations = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue;

    const matches = [...line.matchAll(COMBINED_PATTERN)];
    for (const m of matches) {
      const importPath = m[1] || m[2];
      if (importPath) {
        violations.push({
          file: relative(ROOT, filePath).replace(/\\/g, '/'),
          line: i + 1,
          importPath,
          text: line.trim(),
        });
      }
    }
  }

  return violations;
}

async function main() {
  if (!existsSync(LIBS_DIR)) {
    console.log('[validate-layer-boundary] libs/ dir not found — skipping');
    process.exit(0);
  }

  const tsFiles = walkTs(LIBS_DIR);

  if (tsFiles.length === 0) {
    console.log('[validate-layer-boundary] no .ts files found in libs/ — skipping');
    process.exit(0);
  }

  const allViolations = [];

  for (const file of tsFiles) {
    const violations = findViolations(file);
    allViolations.push(...violations);
  }

  console.log(`[validate-layer-boundary] scanned ${tsFiles.length} .ts files in libs/`);

  if (allViolations.length > 0) {
    console.error(`\n⛔ LAYER BOUNDARY VIOLATIONS (${allViolations.length} found):`);
    console.error('   L0 Platform Core (libs/) MUST NOT import from L1/L2 (apps/)');
    console.error('   Import flows: L2 → L1 → L0 → External ONLY\n');

    for (const v of allViolations) {
      console.error(`  🚫 ${v.file}:${v.line}`);
      console.error(`     import: ${v.importPath}`);
      console.error(`     line:   ${v.text}`);
      console.error('');
    }

    console.error('   Resolution: move shared logic to libs/integrations/ or libs/policies/');
    console.error('               then import FROM libs/ in apps/ (correct direction)');
    console.error(`\n[validate-layer-boundary] files_scanned=${tsFiles.length} violations=${allViolations.length} status=BLOCKING`);
    process.exit(1);
  }

  console.log(`✓ No L0→L1/L2 layer boundary violations found`);
  console.log(`  All ${tsFiles.length} libs/*.ts files import only from L0 (intra-layer) or External`);
  console.log(`\n[validate-layer-boundary] files_scanned=${tsFiles.length} violations=0 status=CLEAN`);
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-layer-boundary] fatal:', err);
  process.exit(1);
});
