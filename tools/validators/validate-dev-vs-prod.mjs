#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-dev-vs-prod
 * @csps-name validate-dev-vs-prod
 * @csps-description T2 for B_DEVELOPMENT_VS_PRODUCTION. Checks that production API
 * routes do not hardcode Opus model strings. Opus is the architectural-reasoning model;
 * production endpoints must use Sonnet or Haiku. Hardcoded Opus in a prod route is a
 * cost and latency landmine, and signals dev/prod boundary confusion.
 * BLOCKING: hardcoded opus model string in any production API route (not in a comment).
 * ADVISORY: opus usage in csps-playground (playground is dev-tier, not prod).
 * Skips: apps/sandbox/ (explicitly dev-only).
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_DEVELOPMENT_VS_PRODUCTION P-ARCH-030
 * context_question: "Does any production API route hardcode the Opus model string?"
 * Plan item: gap_T2_ORPHAN_CONTRACTS | S061
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const APPS_DIR = join(ROOT, 'apps');
const SKIP_APPS = ['sandbox'];
const ADVISORY_APPS = ['csps-playground'];
const TARGET_EXTS = ['.ts', '.tsx', '.js', '.jsx'];

// Matches claude-opus anywhere, or standalone "opus" as a quoted string value
const OPUS_PATTERNS = [
  /claude-opus/i,
  /"opus"/i,
  /'opus'/i,
  /`opus`/i,
];

let blocking = 0;
let advisory = 0;
let files_checked = 0;

function walkDir(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else if (entry.isFile() && TARGET_EXTS.includes(extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results;
}

function isApiPath(filePath) {
  // Must contain /api/ or \api\ in the path
  return filePath.includes('/api/') || filePath.includes('\\api\\');
}

function getAppName(filePath) {
  // Extract app name from path: apps/<appname>/...
  const rel = filePath.replace(APPS_DIR, '').replace(/^[\\/]/, '');
  return rel.split(/[/\\]/)[0];
}

function lineHasOpus(line) {
  // Skip pure comment lines (// ... or * ...)
  const trimmed = line.trim();
  if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('#')) return false;
  // Inline comment: strip everything after //
  const codepart = line.replace(/\/\/.*$/, '');
  return OPUS_PATTERNS.some(re => re.test(codepart));
}

if (!existsSync(APPS_DIR)) {
  console.log(`[validate-dev-vs-prod] apps dir not found, skipping`);
  console.log(`[validate-dev-vs-prod] files_checked=0 blocking=0 advisory=0`);
  process.exit(0);
}

// Walk all apps, collect API files
const allFiles = walkDir(APPS_DIR);
const apiFiles = allFiles.filter(isApiPath);

for (const filePath of apiFiles) {
  const appName = getAppName(filePath);
  if (SKIP_APPS.includes(appName)) continue; // explicitly skip sandbox

  files_checked++;
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const isAdvisoryApp = ADVISORY_APPS.includes(appName);

  for (let i = 0; i < lines.length; i++) {
    if (lineHasOpus(lines[i])) {
      const relPath = filePath.replace(ROOT, '').replace(/^[\\/]/, '');
      if (isAdvisoryApp) {
        console.warn(`[validate-dev-vs-prod] ADVISORY: ${relPath}:${i + 1} — opus model in playground app (dev-tier, not prod)`);
        console.warn(`  Context: ${lines[i].trim().slice(0, 100)}`);
        advisory++;
      } else {
        console.error(`[validate-dev-vs-prod] BLOCKING: ${relPath}:${i + 1} — hardcoded opus model in production API route`);
        console.error(`  Fix: Replace with claude-sonnet-* or claude-haiku-* for production endpoints.`);
        console.error(`  Context: ${lines[i].trim().slice(0, 100)}`);
        blocking++;
      }
    }
  }
}

console.log(`[validate-dev-vs-prod] files_checked=${files_checked} blocking=${blocking} advisory=${advisory}`);
process.exit(blocking > 0 ? 1 : 0);
