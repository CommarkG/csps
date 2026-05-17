#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-ui-completeness
 * @csps-name validate-ui-completeness
 * @csps-description UI Completeness Gate: scans new TypeScript/TSX app page files from
 * the last commit for incomplete interactive elements. Catches: empty onClick handlers,
 * unresolved href="#", form elements without onSubmit, TODO/placeholder comments in UI,
 * and fetch-calls to non-existent API routes.
 * Permanently enforces: every page created is immediately complete — no dead buttons,
 * no placeholder links, no disconnected forms.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:architecture domain:ux audience:developer
 * @csps-enforces P-ARCH-031 P-UX-001
 *
 * Coverage:
 *   OK: Empty/stub onClick: onClick={() => {}} | onClick={undefined} | onClick={noop}
 *   OK: Dead links: href="#" | href="" | href="javascript:void"
 *   OK: Forms without onSubmit
 *   OK: TODO/FIXME/placeholder comments inside return() blocks
 *   OK: fetch-calls to /api/ routes that don't exist in apps/<app>/src/app/api/
 *   SKIP: Does not check: server components (no client interactivity expected)
 *   SKIP: Does not check: files that are not new (only last commit)
 *
 * Exit: 0 always (ADVISORY — promote to BLOCKING after K=2 violations of same pattern)
 * Output: files_checked=N buttons_ok=N forms_ok=N links_ok=N advisories=N
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

let filesChecked = 0;
let advisories = 0;
const issues = [];

// Get newly added .tsx/.ts files from last commit
let addedFiles = [];
try {
  const result = execSync('git diff --name-only --diff-filter=AM HEAD~1 HEAD 2>/dev/null || git diff --name-only --diff-filter=AM --cached', {
    cwd: ROOT, encoding: 'utf-8',
  }).trim();
  addedFiles = result.split('\n').filter(f =>
    f && /apps\/.*\.(tsx|ts)$/.test(f) &&
    !/node_modules|\.next|api\//.test(f) // skip API routes
  );
} catch { /* no git */ }

// Collect existing API routes for fetch-call validation
function getApiRoutes() {
  const routes = new Set();
  const appsDir = join(ROOT, 'apps');
  if (!existsSync(appsDir)) return routes;
  for (const app of readdirSync(appsDir)) {
    const apiDir = join(appsDir, app, 'src/app/api');
    if (!existsSync(apiDir)) continue;
    function walk(dir, prefix = '/api') {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) walk(join(dir, entry.name), `${prefix}/${entry.name}`);
        else if (entry.name === 'route.ts' || entry.name === 'route.tsx') routes.add(prefix);
      }
    }
    walk(apiDir);
  }
  return routes;
}
const apiRoutes = getApiRoutes();

for (const file of addedFiles) {
  const fullPath = join(ROOT, file);
  if (!existsSync(fullPath)) continue;
  const content = readFileSync(fullPath, 'utf-8');

  // Only check files that have JSX (are UI components)
  if (!content.includes('return (') && !content.includes('return(')) continue;
  filesChecked++;

  const fileIssues = [];

  // 1. Empty onClick handlers
  const emptyClicks = [
    /onClick=\{(?:\(\)\s*=>\s*\{\s*\}|undefined|null|noop)\}/g,
    /onClick=""/g,
  ];
  for (const re of emptyClicks) {
    const matches = content.match(re) || [];
    if (matches.length > 0) {
      fileIssues.push(`${matches.length} empty onClick handler(s) — connect to a real action or API call`);
    }
  }

  // 2. Dead links
  const deadLinks = (content.match(/href=["'](?:#|javascript:void|about:blank|)["']/g) || []).length;
  if (deadLinks > 0) {
    fileIssues.push(`${deadLinks} dead link(s) (href="#" or empty) — use real route or remove`);
  }

  // 3. TODO/FIXME/placeholder in JSX return blocks
  const returnMatch = content.match(/return\s*\(([\s\S]+)\)/);
  if (returnMatch) {
    const jsxBody = returnMatch[1];
    const todos = (jsxBody.match(/\/\/\s*(TODO|FIXME|placeholder|coming soon)/gi) || []).length;
    if (todos > 0) {
      fileIssues.push(`${todos} TODO/placeholder comment(s) inside JSX — implement before shipping`);
    }
  }

  // 4. Forms without onSubmit
  const formTags = (content.match(/<form\b/gi) || []).length;
  const onSubmits = (content.match(/onSubmit=/g) || []).length;
  if (formTags > 0 && onSubmits === 0) {
    fileIssues.push(`${formTags} <form> element(s) without onSubmit — forms need submission handlers`);
  }

  // 5. fetch-call to non-existent API routes
  const fetchCalls = [...content.matchAll(/fetch\(['"`](\/api\/[^'"`\s?]+)/g)];
  for (const [, route] of fetchCalls) {
    // Normalize: strip trailing slash and dynamic segments
    const normalized = route.replace(/\/\[[^\]]+\]/g, '').replace(/\/$/, '');
    if (!apiRoutes.has(normalized) && !apiRoutes.has(route)) {
      fileIssues.push(`fetch-call to ${route} — no matching API route found in apps/*/src/app/api/`);
    }
  }

  if (fileIssues.length > 0) {
    advisories++;
    const summary = fileIssues.map(i => `    • ${i}`).join('\n');
    console.warn(`[validate-ui-completeness] ADVISORY: ${file}\n${summary}`);
    issues.push({ file, issues: fileIssues });
  }
}

const buttonsOk = issues.filter(i => !i.issues.some(x => x.includes('onClick'))).length;
const formsOk = issues.filter(i => !i.issues.some(x => x.includes('form'))).length;
const linksOk = issues.filter(i => !i.issues.some(x => x.includes('link'))).length;

console.log(`[validate-ui-completeness] files_checked=${filesChecked} buttons_ok=${filesChecked - issues.filter(i=>i.issues.some(x=>x.includes('onClick'))).length} forms_ok=${filesChecked - issues.filter(i=>i.issues.some(x=>x.includes('form'))).length} links_ok=${filesChecked - issues.filter(i=>i.issues.some(x=>x.includes('link'))).length} advisories=${advisories}`);
process.exit(0);
