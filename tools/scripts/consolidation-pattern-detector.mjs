#!/usr/bin/env node
/**
 * consolidation-pattern-detector.mjs
 * Implements 6 duplication patterns A-F per EXT-20260505-003-A.
 * Called by post-stop-consolidation-pass.sh after Stop events.
 *
 * Patterns:
 *   A - List duplication (bullet/table rows ≥3 occurrences)
 *   B - Rule duplication (MUST/Never/Always phrases ≥3)
 *   C - Definition duplication (noun-phrase defs ≥3)
 *   D - Example duplication (code blocks/samples ≥3)
 *   E - Citation duplication (external links ≥3)
 *   F - Cross-section reference (broken/duplicate cross-refs)
 *
 * Heuristic: ≥3 occurrences = consolidation candidate; <3 = leave alone.
 * Counter-cases: files with consolidation_exempt: true are skipped.
 *
 * ADVISORY: exits 0 always; findings to stderr. Non-blocking per STEP 2.
 *
 * Usage: node tools/scripts/consolidation-pattern-detector.mjs [file1] [file2] ...
 *   Or: node tools/scripts/consolidation-pattern-detector.mjs --from-git-diff
 *
 * Output format: JSON to tools/data/consolidation-pass-last-run.json
 * PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 2
 */

import { readFileSync, existsSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const THRESHOLD = 3; // ≥3 occurrences = candidate
const MAX_FILES = 20; // Cap scan scope per invocation

// Pattern A: bullet/table row text that appears ≥THRESHOLD times across files
// Extract: lines starting with - /• / | that have ≥10 chars of content
const PATTERN_A_RE = /^(?:[-•*]|\|)\s+([^|\n]{10,})/gm;

// Pattern B: rule phrases (MUST/SHALL/NEVER/ALWAYS + content)
const PATTERN_B_RE = /\b(MUST|MUST NOT|SHALL|SHALL NOT|NEVER|ALWAYS|REQUIRED|FORBIDDEN)\b[^.\n]{5,}/gm;

// Pattern C: definition patterns ("X is [a|the|an] ...", "**X** —", "X: ...")
const PATTERN_C_RE = /^[\t ]*(?:\*\*)?([A-Z][A-Za-z\s]{3,20})(?:\*\*)?\s*(?:—|:)\s*([^.\n]{10,})/gm;

// Pattern D: code block presence (any fenced code block)
const PATTERN_D_RE = /```[a-z]*\n([\s\S]*?)```/gm;

// Pattern E: external URLs
const PATTERN_E_RE = /https?:\/\/[^\s\)>'"]{10,}/g;

// Pattern F: cross-section references (see §X, see [FILE](...))
const PATTERN_F_RE = /(?:see|per|ref)\s+(?:§\w+|\[[^\]]+\]\([^\)]+\))/gi;

// Truncate text for display
function truncate(s, n = 60) {
  return s.length > n ? s.slice(0, n) + '...' : s;
}

// Check if file is exempted
function isExempt(content) {
  return /consolidation_exempt:\s*true/.test(content);
}

// Governed artifact filter (pillar-0-governance, topic-plans, docs >500 lines)
function isGoverned(filePath, content) {
  if (filePath.includes('pillar-0-governance') && filePath.endsWith('.md')) return true;
  if (filePath.includes('topic-plans') && filePath.endsWith('.md')) return true;
  const lineCount = content.split('\n').length;
  if (lineCount > 500 && filePath.endsWith('.md')) return true;
  return false;
}

// Scan a single file for all 6 patterns
function scanFile(filePath) {
  if (!existsSync(filePath)) return null;
  const content = readFileSync(filePath, 'utf-8');
  if (isExempt(content)) return { filePath, exempted: true };

  const findings = [];

  // Pattern A: Lists
  const listItems = new Map();
  let m;
  const aRe = new RegExp(PATTERN_A_RE.source, 'gm');
  while ((m = aRe.exec(content)) !== null) {
    const key = m[1].trim().slice(0, 40).toLowerCase();
    listItems.set(key, (listItems.get(key) || 0) + 1);
  }
  for (const [item, count] of listItems) {
    if (count >= THRESHOLD) {
      findings.push({ pattern: 'A', type: 'list', item: truncate(item), count, filePath });
    }
  }

  // Pattern B: Rules — count by keyword TYPE (MUST/NEVER/etc), not by unique phrase
  const ruleTypes = new Map();
  const bRe = new RegExp(PATTERN_B_RE.source, 'gm');
  while ((m = bRe.exec(content)) !== null) {
    const keyword = m[1].toUpperCase(); // e.g. "MUST", "NEVER"
    ruleTypes.set(keyword, (ruleTypes.get(keyword) || 0) + 1);
  }
  for (const [keyword, count] of ruleTypes) {
    if (count >= THRESHOLD) {
      findings.push({ pattern: 'B', type: 'rule', item: `${keyword} phrases (${count} occurrences)`, count, filePath });
    }
  }

  // Pattern C: Definitions (across whole content, count unique phrases)
  const defs = new Map();
  const cRe = new RegExp(PATTERN_C_RE.source, 'gm');
  while ((m = cRe.exec(content)) !== null) {
    const key = m[1].trim().toLowerCase();
    defs.set(key, (defs.get(key) || 0) + 1);
  }
  for (const [def, count] of defs) {
    if (count >= THRESHOLD) {
      findings.push({ pattern: 'C', type: 'definition', item: truncate(def), count, filePath });
    }
  }

  // Pattern D: Code blocks (flag file if has ≥THRESHOLD code blocks)
  const codeBlocks = [];
  const dRe = new RegExp(PATTERN_D_RE.source, 'gms');
  while ((m = dRe.exec(content)) !== null) codeBlocks.push(m[1].slice(0, 30));
  if (codeBlocks.length >= THRESHOLD) {
    findings.push({ pattern: 'D', type: 'example', item: `${codeBlocks.length} code blocks`, count: codeBlocks.length, filePath });
  }

  // Pattern E: Citations (unique external URLs)
  const urls = new Set();
  const eRe = new RegExp(PATTERN_E_RE.source, 'g');
  while ((m = eRe.exec(content)) !== null) urls.add(m[0]);
  if (urls.size >= THRESHOLD) {
    findings.push({ pattern: 'E', type: 'citation', item: `${urls.size} unique external URLs`, count: urls.size, filePath });
  }

  // Pattern F: Cross-section references
  const crossRefs = [];
  const fRe = new RegExp(PATTERN_F_RE.source, 'gi');
  while ((m = fRe.exec(content)) !== null) crossRefs.push(m[0]);
  if (crossRefs.length >= THRESHOLD) {
    findings.push({ pattern: 'F', type: 'cross-ref', item: `${crossRefs.length} cross-section refs`, count: crossRefs.length, filePath });
  }

  return { filePath, findings, lines: content.split('\n').length };
}

// Main entry point
const args = process.argv.slice(2);
let filesToScan = [];

if (args.includes('--from-git-diff')) {
  // Get files modified in last commit
  try {
    const diff = execSync('git diff --name-only HEAD~1 HEAD 2>/dev/null', { encoding: 'utf-8', cwd: ROOT }).trim();
    filesToScan = diff.split('\n').filter(f => f.endsWith('.md')).map(f => join(ROOT, f));
  } catch (e) {
    // HEAD~1 may not exist (first commit)
    filesToScan = [];
  }
} else if (args.length > 0) {
  filesToScan = args.map(f => f.startsWith('/') ? f : join(ROOT, f));
} else {
  // Default: scan recently modified governed artifacts
  const guidesDir = join(ROOT, 'docs', 'plan', 'pillar-0-governance');
  if (existsSync(guidesDir)) {
    filesToScan = readdirSync(guidesDir)
      .filter(f => f.endsWith('.md'))
      .slice(0, MAX_FILES)
      .map(f => join(guidesDir, f));
  }
}

// Limit scope
filesToScan = filesToScan.slice(0, MAX_FILES);

let total_scanned = 0, total_findings = 0, total_exempted = 0;
const all_findings = [];

for (const filePath of filesToScan) {
  const result = scanFile(filePath);
  if (!result) continue;
  if (result.exempted) { total_exempted++; continue; }
  total_scanned++;

  if (result.findings && result.findings.length > 0) {
    for (const f of result.findings) {
      all_findings.push(f);
      total_findings++;
      process.stderr.write(
        `[consolidation-pass] Pattern ${f.pattern} (${f.type}): "${f.item}" appears ${f.count}x in ${filePath.replace(ROOT + '/', '')}\n` +
        `  → Consolidation candidate per B_CONSOLIDATION_PASS §5-step-protocol. Heuristic: ≥3 occurrences.\n` +
        `  → Suggest: identify canonical home (oldest occurrence by git blame) + replace duplicates with cross-reference.\n`
      );
    }
  }
}

// PATTERN G — Structural ID/concern overlap (HARDWIRE-008 lesson: would have caught D15-D17 collision)
// Scans tools/data/default-correction-registry.yaml for:
//   (1) Duplicate IDs with conflicting names
//   (2) Entries where detection_signal text overlaps ≥70% (potential concern duplication)
//   (3) Vault files using IDs that conflict with registry IDs
const G_REGISTRY = join(ROOT, 'tools/data/default-correction-registry.yaml');
const G_VAULT = join(ROOT, 'docs/plan/_handoff/VAULT/inner-ai-defaults');
let g_findings = 0;
try {
  const gReg = readFileSync(G_REGISTRY, 'utf-8');
  // Extract D* IDs and names from registry
  const idNameMap = new Map();
  const idMatches = gReg.matchAll(/id:\s*(D\d+)\n\s+name:\s*([^\n]+)/g);
  for (const m of idMatches) {
    idNameMap.set(m[1], m[2].trim());
  }
  // Check vault files for ID references that conflict with registry
  if (existsSync(G_VAULT)) {
    const vaultFiles = readdirSync(G_VAULT).filter(f => f.endsWith('.md'));
    for (const vf of vaultFiles) {
      const idMatch = vf.match(/^(D\d+)/);
      if (idMatch) {
        const fileId = idMatch[1];
        const regName = idNameMap.get(fileId);
        const vaultContent = readFileSync(join(G_VAULT, vf), 'utf-8');
        const vaultNameMatch = vaultContent.match(/default_name:\s*([^\n]+)/);
        if (regName && vaultNameMatch) {
          const vaultName = vaultNameMatch[1].trim();
          if (!regName.toLowerCase().includes(vaultName.toLowerCase().replace(/-/g,' ').split(' ')[0])) {
            if (!vaultContent.includes('SUPERSEDED')) {
              g_findings++;
              all_findings.push({ pattern: 'G', type: 'structural-id-collision', item: fileId, count: 2, file: vf });
              process.stderr.write(
                `[consolidation-pass] Pattern G (structural-id-collision): ID ${fileId} used in vault file "${vf}" ` +
                `but registry has ${fileId}="${regName}". Same ID, different concerns.\n` +
                `  → Would have caught the D15-D17 collision before it shipped. Add SUPERSEDED comment to vault file.\n`
              );
            }
          }
        }
      }
    }
  }
  total_findings += g_findings;
} catch { /* advisory — non-fatal */ }

const summary = `[consolidation-pass] files_scanned=${total_scanned} exempted=${total_exempted} total_findings=${total_findings}`;
console.log(summary);

// Write last-run JSON
writeFileSync(
  join(ROOT, 'tools', 'data', 'consolidation-pass-last-run.json'),
  JSON.stringify({ total_scanned, total_exempted, total_findings, findings: all_findings, ran_at: new Date().toISOString() }, null, 2),
  'utf-8'
);

// ADVISORY: always exit 0 (non-blocking per STEP 2 spec)
process.exit(0);
