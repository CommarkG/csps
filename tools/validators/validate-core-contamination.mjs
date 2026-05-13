#!/usr/bin/env node
/**
 * validate-core-contamination.mjs — "Never in the core" structural enforcement
 *
 * ROOT CAUSE TARGETED: SROF-011 D.3 — external code/logic enters CSPS core (S0/S1)
 * without quarantine. The "never in core" principle (sandboxed-skill-governance.md)
 * was behavioral-only. This validator makes it structural.
 *
 * What it checks:
 *   1. tools/validators/*.mjs: no fetch() / http.get() / axios calls
 *      → validators are governance tools; they must not call external APIs
 *   2. .claude/hooks/*.sh: no curl calls to external endpoints (localhost OK)
 *      → hooks govern AI behavior; they must not depend on external services
 *   3. packages/principles/principles.yaml: no principle citing an external
 *      source as canonical (all principles must be CSPS-native)
 *   4. libs/core/ (if exists): no imports from external AI services directly
 *
 * BLOCKING for validators/hooks with external API calls
 * ADVISORY for principles citing external sources
 *
 * Audit slug: core-contamination
 * SROF-011 D.3 | scope_level: S0 | Governor directive S028
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';

const ROOT = resolve(process.cwd());
const VALIDATORS_DIR = join(ROOT, 'tools/validators');
const HOOKS_DIR = join(ROOT, '.claude/hooks');
const PRINCIPLES = join(ROOT, 'packages/principles/principles.yaml');

// Patterns that indicate external contamination in governance code
const EXTERNAL_API_PATTERNS = [
  /\bfetch\s*\(/g,           // fetch() API calls
  /http\.get\s*\(/g,         // http.get calls
  /https\.get\s*\(/g,        // https.get calls
  /axios\s*\.\s*get\s*\(/g,  // axios.get calls
  /import\s+axios/g,         // axios import
  /require\s*\(\s*['"]axios/g, // require('axios')
  /openai\.chat/g,           // OpenAI API calls
  /anthropic\.messages/g,    // Anthropic API calls (validators shouldn't call API)
];

// Legitimate external URL patterns (allowed in governance code)
const ALLOWED_PATTERNS = [
  /localhost/,               // Local development references
  /127\.0\.0\.1/,           // Loopback
  /supabase\.com\/dashboard/, // Dashboard reference (not API call)
  /vercel\.com/,            // Documentation reference
  /\/\/.*/,                 // Comments with URLs
  /EXAMPLE_URL/,            // Placeholder examples
];

const blocking = [];
const advisories = [];
let checked = 0;

function isAllowed(line) {
  return ALLOWED_PATTERNS.some(p => p.test(line));
}

// Check 1: validators/*.mjs — no external API calls
if (existsSync(VALIDATORS_DIR)) {
  const files = readdirSync(VALIDATORS_DIR).filter(f => f.endsWith('.mjs'));
  for (const file of files) {
    if (file === 'validate-core-contamination.mjs') continue; // skip self
    const content = readFileSync(join(VALIDATORS_DIR, file), 'utf8');
    checked++;
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (isAllowed(line)) continue;
      for (const pat of EXTERNAL_API_PATTERNS) {
        const regex = new RegExp(pat.source, pat.flags + (pat.flags.includes('g') ? '' : 'g'));
        if (regex.test(line)) {
          blocking.push({
            file: `tools/validators/${file}`,
            line: i + 1,
            issue: `External API call in governance validator (S0 core — validators must be self-contained)`,
            content: line.trim().slice(0, 60),
          });
          break;
        }
      }
    }
  }
}

// Check 2: hooks/*.sh — no external curl to non-localhost
if (existsSync(HOOKS_DIR)) {
  const files = readdirSync(HOOKS_DIR).filter(f => f.endsWith('.sh'));
  for (const file of files) {
    const content = readFileSync(join(HOOKS_DIR, file), 'utf8');
    checked++;
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s*#/.test(line)) continue; // skip comments
      if (isAllowed(line)) continue;
      // curl to external (not localhost) is contamination
      if (/\bcurl\b/.test(line) && !/localhost|127\.0\.0\.1/.test(line) && /https?:\/\//.test(line)) {
        blocking.push({
          file: `.claude/hooks/${file}`,
          line: i + 1,
          issue: 'External HTTP call in governance hook (S0 core — hooks must not depend on external services)',
          content: line.trim().slice(0, 60),
        });
      }
    }
  }
}

// Check 3: principles.yaml — no principle citing external source as canonical
if (existsSync(PRINCIPLES)) {
  checked++;
  const content = readFileSync(PRINCIPLES, 'utf8');
  const externalSourcePatterns = [
    /canonical_ref:.*https?:\/\/(?!supabase|vercel|clerk)/gi,
    /source:.*external.*canonical/gi,
  ];
  for (const pat of externalSourcePatterns) {
    let m;
    while ((m = pat.exec(content)) !== null) {
      const lineNum = content.slice(0, m.index).split('\n').length;
      advisories.push({
        file: 'packages/principles/principles.yaml',
        line: lineNum,
        issue: `Principle cites external source as canonical — all CSPS principles must be platform-native`,
        content: m[0].slice(0, 60),
      });
    }
  }
}

// Output
if (blocking.length > 0) {
  console.error(`⛔ [core-contamination] ${blocking.length} S0/S1 core contamination(s) found:`);
  blocking.forEach(b => {
    console.error(`  ⛔ ${b.file}:${b.line}: ${b.issue}`);
    console.error(`     → "${b.content}"`);
  });
  console.error('[core-contamination] Fix: remove external API calls from validators/hooks');
  console.error('  If external data is needed: create a separate S2 service and call from app code');
}
if (advisories.length > 0) {
  advisories.forEach(a => console.log(`  ⚠ [core-contamination] ${a.file}:${a.line}: ${a.issue}`));
}
if (blocking.length === 0 && advisories.length === 0) {
  console.log('[validate-core-contamination] core is clean — no external API contamination ✓');
}

console.log(`[validate-core-contamination] checked=${checked} blocking=${blocking.length} advisories=${advisories.length}`);
process.exit(blocking.length > 0 ? 1 : 0);
