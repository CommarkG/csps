#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-apps-are-trials
 * @csps-name validate-apps-are-trials
 * @csps-description T2 for B_APPS_ARE_TRIALS (constitutional backfitting, gap_T2_ORPHAN_CONTRACTS).
 * Enforces: apps/* are ephemeral trials. libs/* is permanent core.
 * Checks for patterns where platform-level code lives in apps/ instead of libs/.
 *
 * BLOCKING: libs/ package reimplemented inside apps/ (duplication of permanent core)
 * ADVISORY: platform-procedure files inside apps/ (e.g., gate-3-procedure.md in apps/*)
 * ADVISORY: schema migrations inside apps/ (should be in libs/policies/)
 *
 * Anti-patterns from B_APPS_ARE_TRIALS canonical definition:
 *   - platform-procedure-in-app-folder
 *   - universal-credentials-in-specific-app
 *   - reusable-query-pattern-in-app-only
 *   - schema-migration-in-app
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_APPS_ARE_TRIALS P-ARCH-030
 * context_question: "If apps/habit-tracker/ were deleted right now, would any platform value be lost — or does everything reusable already live in libs/?"
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const APPS_DIR = join(ROOT, 'apps');
const LIBS_DIR = join(ROOT, 'libs');

// Known libs/ package names — reimplementing these in apps/ is a violation
const LIBS_PACKAGES = existsSync(LIBS_DIR)
  ? readdirSync(LIBS_DIR, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name)
  : [];

// Anti-patterns that indicate platform code inside apps/
const PLATFORM_PROCEDURE_PATTERNS = [
  /gate-\d+-procedure/,
  /sync-vercel-env/,
  /prisma\/schema\.prisma$/,
  /bootstrap\.ps1$/,
  /setup-git-hooks/,
];

const CODE_EXTENSIONS = ['.ts', '.tsx', '.mjs', '.js', '.prisma', '.zmodel'];

let blocking = 0;
let advisory = 0;
let checked = 0;

if (!existsSync(APPS_DIR)) {
  console.log('[validate-apps-are-trials] apps/ dir not found — skipping');
  console.log('[validate-apps-are-trials] checked=0 blocking=0 advisory=0 status=ADVISORY');
  process.exit(0);
}

function scanDir(dir, callback) {
  if (!existsSync(dir)) return;
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '.next') {
        scanDir(fullPath, callback);
      } else if (entry.isFile()) {
        callback(fullPath, entry.name);
      }
    }
  } catch { /* skip unreadable dirs */ }
}

const appDirs = readdirSync(APPS_DIR, { withFileTypes: true })
  .filter(e => e.isDirectory() && !e.name.startsWith('.'))
  .map(e => e.name);

for (const app of appDirs) {
  const appPath = join(APPS_DIR, app);
  checked++;

  // Check for reimplemented libs/ packages inside the app
  // BLOCKING only when: app has a package.json with name matching a @csps/* libs package
  // (directory name match alone is too loose — apps have their own src/components/, src/lib/ etc.)
  scanDir(appPath, (filePath, fileName) => {
    if (fileName !== 'package.json') return;
    // Don't check the app's own root package.json
    const relPath = relative(appPath, filePath);
    if (relPath === 'package.json') return;
    try {
      const pkg = JSON.parse(readFileSync(filePath, 'utf-8'));
      const pkgName = pkg.name || '';
      // Check if this nested package.json names a @csps/* package that exists in libs/
      for (const libsPackage of LIBS_PACKAGES) {
        if (pkgName === `@csps/${libsPackage}` || pkgName === libsPackage) {
          console.error(`[validate-apps-are-trials] BLOCKING: apps/${app} contains nested package "${pkgName}" — reimplements libs/${libsPackage}`);
          console.error(`  B_APPS_ARE_TRIALS: import from @csps/${libsPackage} instead of reimplementing.`);
          blocking++;
        }
      }
    } catch { /* skip malformed package.json */ }
  });

  // Scan for platform-procedure anti-patterns
  scanDir(appPath, (filePath, fileName) => {
    const relPath = relative(ROOT, filePath);
    for (const pattern of PLATFORM_PROCEDURE_PATTERNS) {
      if (pattern.test(relPath)) {
        console.warn(`[validate-apps-are-trials] ADVISORY: ${relPath} — platform procedure/schema in apps/`);
        console.warn(`  B_APPS_ARE_TRIALS anti-pattern: move to libs/, tools/, or platform root.`);
        advisory++;
        break;
      }
    }
  });

  // Check for direct imports from libs/ that bypass the @csps/ package API
  scanDir(appPath, (filePath) => {
    if (!CODE_EXTENSIONS.some(ext => filePath.endsWith(ext))) return;
    try {
      const content = readFileSync(filePath, 'utf-8');
      const relPath = relative(ROOT, filePath);
      // Detect relative imports that traverse up into libs/ (bypassing package API)
      if (/from\s+['"]\.\.\/\.\.\/\.\.\/libs\//.test(content) || /require\(['"]\.\.\/\.\.\/\.\.\/libs\//.test(content)) {
        console.warn(`[validate-apps-are-trials] ADVISORY: ${relPath} — relative import from libs/ bypasses @csps/ package API`);
        console.warn(`  Use: import { ... } from '@csps/${filePath.includes('/') ? '...' : ''}' instead.`);
        advisory++;
      }
    } catch { /* skip unreadable files */ }
  });
}

console.log(`[validate-apps-are-trials] apps_checked=${checked} libs_packages=${LIBS_PACKAGES.length} blocking=${blocking} advisory=${advisory}`);
process.exit(blocking > 0 ? 1 : 0);
