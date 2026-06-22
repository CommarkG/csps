#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-fetch-resilience
 * @csps-name validate-fetch-resilience
 * @csps-description B_PAGE_COMPLETE Item 2 — All fetch-call invocations in platform pages must
 *   use the canonical useData() hook OR demonstrate the complete resilience pattern:
 *   (a) AbortController or timeout, (b) error state or try/catch, (c) no infinite spinner
 *   (setLoading(false) or finally block when setLoading(true) is used).
 *
 *   Prevent-by-construction: useData() bakes all three in automatically.
 *   This validator is the backstop for pages that hand-roll their own fetch.
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_PAGE_COMPLETE PROTO-S087-PAGE-COMPLETE
 * @csps-prevention-class FETCH-WITHOUT-RESILIENCE INFINITE-SPINNER MISSING-ERROR-STATE
 *
 * run_tier: STANDARD
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at field in last-run JSON).
 *   All blocking decisions are structural/deterministic (pattern presence in source text).
 *   Not in any blocking decision path.
 *
 * Resilience patterns accepted (ANY of these pass):
 *   A. File imports useData from '@/hooks/useData' (canonical hook — fully resilient by construction)
 *   B. File has AbortController + controller.abort() (explicit timeout/cancel)
 *   C. File has catch( block AND (setLoading(false) OR finally {) — manual resilience
 *
 * BLOCKING: fetch-call found in file with NO resilience pattern
 * ADVISORY: fetch-call in a file that has loading state but no timeout/abort (spinner-risk)
 */

// @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields in last-run JSON). All blocking decisions are structural/deterministic (field presence, count checks, schema conformance). Not in any blocking decision path.

import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PLATFORM_BASE = join(ROOT, 'apps/csps-playground/src/app/platform');
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-fetch-resilience-last-run.json');

// ── File walker (platform pages + client components only) ──────────────────────

function walkPlatform(dir, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', 'generated'].includes(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) walkPlatform(fullPath, results);
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) results.push(fullPath);
  }
  return results;
}

// ── Resilience checks ──────────────────────────────────────────────────────────

function hasUseDataHook(text) {
  return /import\s+.*useData.*from\s+['"]@\/hooks\/useData['"]/.test(text)
      || /from\s+['"]\.\.\/.*hooks\/useData['"]/.test(text)
      || /useData\s*</.test(text) && /from\s+['"][^'"]*useData/.test(text);
}

function hasAbortController(text) {
  return /new AbortController\s*\(/.test(text) && /controller\.abort\s*\(/.test(text);
}

function hasManualResilience(text) {
  // Must have catch + loading resolution
  // Match both catch(e) and catch { (param-less — valid in modern JS/TS)
  const hasCatch = /catch\s*[\(\{]/.test(text);
  const hasLoadingFalse = /setLoading\s*\(\s*false\s*\)/.test(text);
  const hasFinally = /finally\s*\{/.test(text);
  return hasCatch && (hasLoadingFalse || hasFinally);
}

function hasTimeout(text) {
  return /setTimeout\s*\(.*abort|AbortController/.test(text)
      || /signal:\s*controller\.signal/.test(text);
}

function hasFetchCalls(text) {
  // Count fetch-call occurrences that are NOT in comments
  const noComments = text.split('\n').map(l => /^\s*\/\//.test(l) ? '' : l).join('\n');
  return /fetch\s*\(/.test(noComments);
}

// ── Classify resilience level ─────────────────────────────────────────────────
// Returns: 'canonical' | 'resilient' | 'partial' | 'bare' | 'no-fetch' | 'server-component'

function isServerComponent(text) {
  // Server components: no 'use client' directive at top of file.
  // fetch-call in server components is async/await with try/catch at server level — different resilience model.
  // This validator focuses on client-side state management (loading/error/empty states for UX).
  const firstLines = text.slice(0, 400);
  return !firstLines.includes("'use client'") && !firstLines.includes('"use client"');
}

function hasSetLoadingTrue(text) {
  return /setLoading\s*\(\s*true\s*\)/.test(text);
}

function classifyResilience(text) {
  if (!hasFetchCalls(text)) return 'no-fetch';
  // Server components use server-side async/await resilience — out of scope for this validator
  if (isServerComponent(text)) return 'server-component';
  if (hasUseDataHook(text)) return 'canonical'; // uses the hook — fully resilient
  if (hasAbortController(text) && hasManualResilience(text)) return 'resilient'; // good manual pattern
  if (hasManualResilience(text)) return 'partial'; // has catch + loading but no abort = spinner-risk advisory
  // Distinguish: BLOCKING = setLoading(true) with NO error handling (true infinite-spinner risk)
  //              ADVISORY-background = fetch with no setLoading (background/fire-and-forget fetch)
  if (hasSetLoadingTrue(text)) return 'bare'; // BLOCKING: loading started but never safely resolved
  return 'background'; // ADVISORY: background/enhancement fetch with no loading state
}

// ── Main ───────────────────────────────────────────────────────────────────────

const files = walkPlatform(PLATFORM_BASE);
let blocking = 0;
let advisory = 0;
const results = [];

for (const filePath of files) {
  let text;
  try {
    text = readFileSync(filePath, 'utf-8');
  } catch { continue; }

  const relPath = relative(ROOT, filePath).replace(/\\/g, '/');
  const level = classifyResilience(text);

  if (level === 'no-fetch') continue; // no fetch calls — skip
  if (level === 'server-component') continue; // server-side resilience — out of scope

  const r = { file: relPath, level };
  results.push(r);

  if (level === 'bare') {
    blocking++;
    r.verdict = 'BLOCKING';
    r.reason = 'setLoading(true) called but fetch-call has no catch/finally — INFINITE SPINNER if server hangs. Use useData() hook or add try/catch + finally + setLoading(false).';
  } else if (level === 'partial') {
    advisory++;
    r.verdict = 'ADVISORY';
    r.reason = 'fetch-call has error handling but no AbortController — spinner-risk if server hangs. Add AbortController with timeout or migrate to useData() hook.';
  } else if (level === 'background') {
    advisory++;
    r.verdict = 'ADVISORY';
    r.reason = 'background/enhancement fetch-call with no loading state — user sees no feedback if slow/failed. Consider useData() for primary data or add empty/error UI feedback.';
  } else {
    r.verdict = 'PASS';
    r.reason = level === 'canonical' ? 'uses useData() hook (fully resilient by construction)' : 'manual AbortController + error + loading resolution pattern (fully resilient)';
  }
}

// ── Output ─────────────────────────────────────────────────────────────────────

const status = blocking > 0 ? 'FAIL' : 'PASS';
const fetchFiles = results.length;
const canonical = results.filter(r => r.level === 'canonical').length;
const resilient = results.filter(r => r.level === 'resilient').length;
const partial = results.filter(r => r.level === 'partial').length;
const background = results.filter(r => r.level === 'background').length;
const bare = results.filter(r => r.level === 'bare').length;

console.log(`[validate-fetch-resilience] ${status}`);
console.log(`  files_with_fetch=${fetchFiles} blocking=${blocking} advisory=${advisory}`);
console.log(`  canonical(useData)=${canonical} resilient(manual)=${resilient} partial=${partial} background=${background} bare=${bare}`);

const blockingItems = results.filter(r => r.verdict === 'BLOCKING');
if (blockingItems.length > 0) {
  console.error('\n[validate-fetch-resilience] BLOCKING — BARE FETCH (no resilience pattern):');
  for (const r of blockingItems) {
    console.error(`  ✗ ${r.file}`);
    console.error(`      Reason: ${r.reason}`);
  }
  console.error('\n  Fix: import useData from "@/hooks/useData" OR add try/catch + finally + setLoading(false) + AbortController');
}

const advisoryItems = results.filter(r => r.verdict === 'ADVISORY');
if (advisoryItems.length > 0) {
  console.warn('\n[validate-fetch-resilience] ADVISORY — PARTIAL RESILIENCE (no timeout/abort):');
  for (const r of advisoryItems) {
    console.warn(`  ⚠ ${r.file}`);
    console.warn(`      ${r.reason}`);
  }
}

if (status === 'PASS') {
  console.log(`[validate-fetch-resilience] ✓ All ${fetchFiles} fetch file(s): resilient`);
}

// Write last-run JSON
try {
  const data = {
    ran_at: new Date().toISOString(),
    status,
    files_with_fetch: fetchFiles,
    blocking,
    advisory,
    canonical,
    resilient,
    partial,
    bare,
    results,
  };
  mkdirSync(dirname(LAST_RUN_PATH), { recursive: true });
  writeFileSync(LAST_RUN_PATH, JSON.stringify(data, null, 2));
} catch {
  // non-fatal
}

process.exit(blocking > 0 ? 1 : 0);
