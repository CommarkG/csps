#!/usr/bin/env node
/**
 * @csps-id csps.tools.scripts.fork-app
 * @csps-name fork-app
 * Fork apps/template/ to apps/<slug>/ — INFRA-FLOW-VALIDATION Step 5.
 * Usage: node tools/scripts/fork-app.mjs --slug=<app-slug> [--skip-build]
 * Plan item: INFRA-FLOW-VALIDATION | S056 | Layer 3
 */

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='));
const skipBuild = args.includes('--skip-build');

if (!slugArg) {
  console.error('Usage: node tools/scripts/fork-app.mjs --slug=<app-slug> [--skip-build]');
  process.exit(1);
}

const slug = slugArg.replace('--slug=', '').trim();
if (!/^[a-z][a-z0-9-]*$/.test(slug)) {
  console.error(`Invalid slug: "${slug}". Must be lowercase alphanumeric with hyphens, starting with a letter.`);
  process.exit(1);
}

const templateDir = join(ROOT, 'apps', 'template');
const targetDir = join(ROOT, 'apps', slug);

if (!existsSync(templateDir)) {
  console.error(`Template not found: ${templateDir}`);
  process.exit(1);
}

if (existsSync(targetDir)) {
  console.error(`App already exists: apps/${slug}/`);
  process.exit(1);
}

console.log(`[fork-app] Forking apps/template/ → apps/${slug}/`);

// Copy template (exclude node_modules)
cpSync(templateDir, targetDir, {
  recursive: true,
  filter: (src) => !src.includes('node_modules') && !src.includes('.next'),
});
console.log(`[fork-app] Files copied`);

// Update package.json name
const pkgPath = join(targetDir, 'package.json');
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  pkg.name = `@csps/${slug}`;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
  console.log(`[fork-app] package.json name → @csps/${slug}`);
}

// Create app.config.yaml
const configPath = join(targetDir, 'app.config.yaml');
writeFileSync(configPath, `id: csps.apps.${slug}\nname: ${slug}\nslug: ${slug}\ncreated_at: ${new Date().toISOString()}\nstatus: forked\ntemplate_version: "1.0"\n`, 'utf-8');
console.log(`[fork-app] app.config.yaml created`);

// Run pnpm install for new app
if (!skipBuild) {
  try {
    console.log(`[fork-app] Running pnpm install for @csps/${slug}...`);
    execSync(`pnpm --filter @csps/${slug} install`, { cwd: ROOT, stdio: 'pipe' });
    console.log(`[fork-app] pnpm install: OK`);

    console.log(`[fork-app] Running build for @csps/${slug}...`);
    execSync(`pnpm --filter @csps/${slug} build`, { cwd: ROOT, stdio: 'pipe' });
    console.log(`[fork-app] build: PASS`);
  } catch (e) {
    console.warn(`[fork-app] build step failed (non-blocking): ${String(e).slice(0, 120)}`);
    console.warn(`[fork-app] Fork complete but build may need manual attention`);
  }
}

console.log(`\n[fork-app] Fork complete: apps/${slug}/ | status: forked`);
