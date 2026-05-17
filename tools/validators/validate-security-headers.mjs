#!/usr/bin/env node
// validate-security-headers.mjs — S032-D (BLOCKING)
// Scans all apps/*/next.config.js files. For each app, checks:
//   (a) imports securityHeaders from @csps/integrations/security/headers
//   (b) has headers() export (async function or arrow function)
//   (c) spreads ...securityHeaders() in the headers array
//
// Any app failing all 3 checks → BLOCKING "App [name]: missing security headers"
// New apps created via pnpm create:app inherit this automatically from apps/template/next.config.js

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());
const APPS_DIR = join(ROOT, 'apps');

// Skip template (source, not deployment)
const SKIP_APPS = new Set(['template']);

let blocking = 0;
let passing = 0;
let skipped = 0;
const errors = [];

if (!existsSync(APPS_DIR)) {
  console.log('[validate-security-headers] apps/ directory not found — skipping');
  process.exit(0);
}

for (const appName of readdirSync(APPS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name)) {

  if (SKIP_APPS.has(appName)) { skipped++; continue; }

  const configPath = join(APPS_DIR, appName, 'next.config.js');
  if (!existsSync(configPath)) { skipped++; continue; }

  const content = readFileSync(configPath, 'utf8');

  const hasImport = content.includes("'@csps/integrations/security/headers'") ||
                    content.includes('"@csps/integrations/security/headers"') ||
                    content.includes('security/headers');

  const hasHeadersFn = content.includes('async headers()') ||
                       content.includes('headers()') ||
                       content.includes('headers: ');

  const hasSpread = content.includes('...securityHeaders()') ||
                    content.includes('securityHeaders()');

  // Also accept inline headers (when CJS import of .ts file is not possible)
  const hasInlineHeaders = content.includes('X-Frame-Options') &&
                           content.includes('Content-Security-Policy');

  const passesFunctionPattern = hasImport && hasHeadersFn && hasSpread;
  const passesInlinePattern = hasInlineHeaders && hasHeadersFn;

  if (passesFunctionPattern || passesInlinePattern) {
    passing++;
  } else {
    const missing = [];
    if (!hasImport && !hasInlineHeaders) missing.push('missing securityHeaders import or inline headers');
    if (!hasHeadersFn) missing.push('missing headers() export');
    if (!hasSpread && !hasInlineHeaders) missing.push('not using securityHeaders() or inline headers');
    errors.push(`  ✗ apps/${appName}/next.config.js: ${missing.join('; ')}`);
    blocking++;
  }
}

if (blocking === 0) {
  console.log(`[validate-security-headers] ✓ All ${passing} apps have security headers configured`);
  if (skipped > 0) console.log(`[validate-security-headers]   (${skipped} apps skipped: template or no next.config.js)`);
} else {
  console.log(`[validate-security-headers] ✗ ${blocking} app(s) missing security headers (BLOCKING):`);
  errors.forEach(e => console.log(e));
  console.log(`  Fix: import { securityHeaders } from '@csps/integrations/security/headers'`);
  console.log(`       add async headers() { return [{ source: '/(.*)', headers: securityHeaders() }] }`);
}
console.log(`[validate-security-headers] apps=${passing + blocking} passing=${passing} blocking=${blocking} skipped=${skipped}`);
process.exit(blocking > 0 ? 1 : 0);
