#!/usr/bin/env node
/**
 * validate-laptop-patterns.mjs — Detects laptop-dependency patterns in governance docs
 *
 * ROOT CAUSE: S028 Gate 3 incident — AI defaulted to "Next.js dev = .env.local + pnpm dev
 * on localhost" training pattern. B_ZERO_LAPTOP_DEPENDENCY existed as a contract but had
 * NO mechanical enforcement scanning for laptop-dependency language in docs/procedures.
 * The governance declaration existed; the structural prevention didn't.
 *
 * What it checks:
 *   Governance docs (docs/plan/apps/, docs/plan/pillar-* .md procedure files) for:
 *   TIER 1 (BLOCKING for new docs):
 *     - "pnpm dev" in a procedure/how-to context → should be "vercel --prod" or Codespace
 *     - "localhost:PORT" as a test URL → should be Vercel preview URL
 *     - ".env.local" as credential storage → should be Vercel env vars
 *   TIER 2 (ADVISORY — flag for review):
 *     - "npm install -g" for runtime deps (OK for CLI tools, warn otherwise)
 *     - "local machine" / "your laptop" / "on your computer" in procedures
 *     - "open http://localhost" as a test instruction
 *
 * BLOCKING for new artifacts (not yet committed) | ADVISORY for pre-existing
 *
 * Audit slug: laptop-patterns
 * B_ZERO_LAPTOP_DEPENDENCY | P-OPER-001 | S028 FSE — 5-surface engraving
 * Governor directive: "mechanically enforce it now — a global context lead mandatory
 *   element defining between different levels — engraved deeply into all relevant things"
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = resolve(process.cwd());

// ─── Laptop dependency trigger vocabulary ─────────────────────────────────────

const TIER1_BLOCKING = [
  // Local dev server patterns
  { pattern: /\bpnpm\s+dev\b/gi, issue: '"pnpm dev" = local server. Use: `vercel --prod` (deploy) or Codespace', category: 'local-server' },
  { pattern: /\bnpm\s+run\s+dev\b/gi, issue: '"npm run dev" = local server. Use: `vercel --prod` or Codespace', category: 'local-server' },
  { pattern: /\bnext\s+dev\b/gi, issue: '"next dev" = local server. Use: `vercel --prod` or Codespace', category: 'local-server' },
  // Localhost URLs in procedures
  { pattern: /http:\/\/localhost:\d{4}/gi, issue: 'localhost URL in procedure. Use Vercel preview URL (https://project.vercel.app)', category: 'localhost-url' },
  { pattern: /open\s+http:\/\/localhost/gi, issue: 'Testing on localhost. Test against Vercel deployment instead', category: 'localhost-url' },
  // Local credential files
  { pattern: /\.env\.local\b/gi, issue: '.env.local = laptop dependency. Use: Vercel environment variables (`vercel env add`)', category: 'local-secrets' },
  { pattern: /cp\s+\.env\.example\s+\.env\.local/gi, issue: 'Copying to .env.local creates laptop dependency. Use: `vercel env add` instead', category: 'local-secrets' },
  { pattern: /copy\s+\.env\.example\s+\.env\.local/gi, issue: 'Copying to .env.local creates laptop dependency. Use: Vercel env vars', category: 'local-secrets' },
];

const TIER2_ADVISORY = [
  { pattern: /\bon\s+(your\s+)?laptop\b/gi, issue: 'Procedure instructs "on your laptop" — violates zero-laptop dependency', category: 'laptop-reference' },
  { pattern: /\blocal\s+machine\b/gi, issue: '"local machine" in procedure — redirect to cloud deployment', category: 'laptop-reference' },
  { pattern: /\bon\s+your\s+computer\b/gi, issue: '"on your computer" in procedure — redirect to cloud deployment', category: 'laptop-reference' },
  { pattern: /\bpnpm\s+prisma\s+db\s+push\b/gi, issue: 'Running migrations locally. Use Vercel build hook or Supabase Migrations instead', category: 'local-db' },
  { pattern: /Wait\s+for.*"ready started server"/gi, issue: 'Waiting for local dev server — use Vercel deploy instead', category: 'local-server' },
];

// ─── Files to scan (procedure docs, app docs, how-to docs) ──────────────────

const SCAN_PATHS = [
  'docs/plan/apps',
  'docs/plan/pillar-6-operations-and-delivery',
  'docs/plan/_handoff/VAULT/topic-plans',
];

// Exempt paths (allowed to mention these patterns contextually)
const EXEMPT_PATTERNS = [
  /validate-laptop-patterns\.mjs/,  // this file itself
  /B_ZERO_LAPTOP_DEPENDENCY/,       // the contract definition
  /feedback_zero_laptop/,           // memory files discussing the principle
  /retrograde-principles/,          // analysis docs
  /gate-3-validation/,              // Gate 3 doc (already corrected)
];

// Known pre-existing violations — old topic plans from S022-S023 era that predate
// B_ZERO_LAPTOP_DEPENDENCY enforcement. Scope backfill S034-A added scope_level
// to frontmatter only — content violations are pre-existing, not new.
// These are ADVISORY (historical docs), not BLOCKING.
const KNOWN_PRE_EXISTING = new Set([
  'docs/plan/pillar-6-operations-and-delivery/bootstrap-script.md',
  'docs/plan/_handoff/VAULT/topic-plans/budget-planner-app2.md',
  'docs/plan/_handoff/VAULT/topic-plans/enterprise-core-completion-plan.md',
  'docs/plan/_handoff/VAULT/topic-plans/platform-excellence-completion-S023.md',
]);

function walkDocs(dir) {
  if (!existsSync(dir)) return [];
  const results = [];
  try {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (/node_modules|\.git/.test(full)) continue;
      if (e.isDirectory()) results.push(...walkDocs(full));
      else if (e.isFile() && extname(e.name) === '.md') results.push(full);
    }
  } catch {}
  return results;
}

// Get untracked + modified files for NEW artifact detection
function getNewFiles() {
  try {
    const output = execSync('git status --porcelain', { encoding: 'utf8', cwd: ROOT });
    return output.split('\n')
      .filter(l =>
        l.startsWith('?? ') ||    // untracked
        l.startsWith(' M ') ||    // unstaged modified
        l.startsWith('M  ') ||    // staged modified
        l.startsWith('A  ') ||    // staged new file
        l.startsWith('AM ') ||    // staged new + unstaged modified
        l.startsWith('MM ')       // staged + unstaged modified
      )
      .map(l => l.slice(3).trim())
      .filter(f => f.endsWith('.md'));
  } catch { return []; }
}

const blocking = [];
const advisories = [];
let checked = 0;
const newFiles = new Set(getNewFiles());

const allFiles = SCAN_PATHS.flatMap(p => walkDocs(join(ROOT, p)));

for (const filePath of allFiles) {
  const content = readFileSync(filePath, 'utf8');
  const relPath = filePath.replace(ROOT, '').replace(/\\/g, '/').replace(/^\//, '');
  // Known pre-existing: treat as advisory even if touched by scope backfill
  const isNew = newFiles.has(relPath) && !KNOWN_PRE_EXISTING.has(relPath);

  // Skip exempt files
  if (EXEMPT_PATTERNS.some(p => p.test(relPath) || p.test(content.slice(0, 200)))) continue;

  checked++;

  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Tier 1 — blocking for new files, advisory for existing
    for (const { pattern, issue, category } of TIER1_BLOCKING) {
      const regex = new RegExp(pattern.source, pattern.flags + (pattern.flags.includes('g') ? '' : 'g'));
      if (regex.test(line)) {
        const finding = {
          file: relPath,
          line: i + 1,
          content: line.trim().slice(0, 80),
          issue,
          category,
          isNew,
        };
        if (isNew) blocking.push(finding);
        else advisories.push(finding);
        break;
      }
    }

    // Tier 2 — advisory always
    for (const { pattern, issue, category } of TIER2_ADVISORY) {
      const regex = new RegExp(pattern.source, pattern.flags + (pattern.flags.includes('g') ? '' : 'g'));
      if (regex.test(line)) {
        advisories.push({
          file: relPath,
          line: i + 1,
          content: line.trim().slice(0, 80),
          issue,
          category,
          isNew,
        });
        break;
      }
    }
  }
}

// ─── Output ─────────────────────────────────────────────────────────────────

if (blocking.length > 0) {
  console.error(`⛔ [laptop-patterns] ${blocking.length} NEW artifact(s) with laptop-dependency patterns:`);
  blocking.forEach(b => {
    console.error(`  ⛔ ${b.file}:${b.line}: ${b.issue}`);
    console.error(`     → "${b.content}"`);
  });
}

if (advisories.length > 0) {
  const byCategory = {};
  advisories.forEach(a => {
    if (!byCategory[a.category]) byCategory[a.category] = [];
    byCategory[a.category].push(a);
  });
  console.log(`\n  [laptop-patterns] ${advisories.length} pre-existing laptop-dependency patterns to migrate:`);
  Object.entries(byCategory).forEach(([cat, items]) => {
    console.log(`  ⚠ ${cat} (${items.length}): e.g. ${items[0].file}:${items[0].line}`);
  });
  console.log('\n[laptop-patterns] B_ZERO_LAPTOP_DEPENDENCY: cloud deployment is MANDATORY.');
  console.log('  Platform credentials → Vercel env vars | Testing → Vercel preview URL | Dev → Codespaces');
}

if (blocking.length === 0 && advisories.length === 0) {
  console.log('[validate-laptop-patterns] no laptop-dependency patterns detected ✓');
}

console.log(`[validate-laptop-patterns] checked=${checked} blocking=${blocking.length} advisories=${advisories.length}`);
process.exit(blocking.length > 0 ? 1 : 0);
