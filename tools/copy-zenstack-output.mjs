#!/usr/bin/env node
// copy-zenstack-output.mjs — Option A ZenStack fix (VLT-S022-ZENSTACK-GENERATE-PATH)
// Copies .zenstack/ generated files to where @zenstackhq/runtime/enhance.js looks for them.
// Run after: pnpm exec zenstack generate --schema libs/policies/schema.zmodel

import { readdirSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());
const PNPM_STORE = join(ROOT, 'node_modules/.pnpm');

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  let count = 0;
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    if (entry.isFile()) {
      copyFileSync(join(src, entry.name), join(dest, entry.name));
      count++;
    } else if (entry.isDirectory()) {
      count += copyDir(join(src, entry.name), join(dest, entry.name));
    }
  }
  return count;
}

if (!existsSync(PNPM_STORE)) {
  console.log('[copy-zenstack] pnpm store not found — skipping');
  process.exit(0);
}

const runtimeEntries = readdirSync(PNPM_STORE).filter(e => e.startsWith('@zenstackhq+runtime@'));
if (runtimeEntries.length === 0) {
  console.log('[copy-zenstack] No ZenStack runtime entries in pnpm store — skipping');
  process.exit(0);
}

let totalCopied = 0;
for (const entry of runtimeEntries) {
  const nodesDir = join(PNPM_STORE, entry, 'node_modules');
  const src = join(nodesDir, '.zenstack');
  const dest = join(nodesDir, '@zenstackhq', 'runtime', '.zenstack');

  if (!existsSync(src)) {
    console.log(`[copy-zenstack] No .zenstack source in ${entry} — run zenstack generate first`);
    continue;
  }

  const count = copyDir(src, dest);
  totalCopied += count;
  console.log(`[copy-zenstack] Copied ${count} files → ${entry.slice(0, 60)}.../@zenstackhq/runtime/.zenstack/`);
}

if (totalCopied > 0) {
  console.log(`[copy-zenstack] Total: ${totalCopied} files. ZenStack enhance path fixed ✅`);
} else {
  console.log('[copy-zenstack] Nothing copied — check that zenstack generate ran first');
}
