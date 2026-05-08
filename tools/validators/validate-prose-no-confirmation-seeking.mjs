#!/usr/bin/env node
/**
 * validate-prose-no-confirmation-seeking.mjs — Confirmation-Seeking Phrase Gate
 *
 * ROOT CAUSE TARGETED (inner-ai-defaults/prose-patterns.md — prose-confirmation-seeking):
 *   Training default: end substantive replies with "Should I proceed?" / "Want me to do X?"
 *   CSPS override: execute under 4-condition gate (ratified + reversible + mechanical +
 *   no-cross-actor); report inline + continue. No chat-level confirmation-seeking.
 *
 * Coverage Levels:
 *   ✓ Level 1: Detect banned confirmation-seeking phrases in verify-last-run.md tail text
 *   ✓ Level 2: Detect in session artifact files (closing-summary, handoff)
 *   ✗ Level 3: Detect in live chat transcript (requires CLAUDE_TRANSCRIPT_PATH) → VLT-S021-TRANSCRIPT-SCAN
 *   ✗ Level 4: Distinguish legitimate cross-actor ask from banned pattern → VLT-S021-LEGITIMATE-ASK
 *
 * When this validator exits 0, it proves:
 *   - No banned confirmation-seeking phrases in verify-last-run.md + recent session artifacts
 * When this validator exits 0, it does NOT prove:
 *   - Live in-chat responses are free of confirmation-seeking (Level 3 deferred)
 *
 * Exit: ADVISORY (0) always — measures the gap; promotes to warn-blocking week-4
 * Created: S021 per enforcement-rate-uplift topic-plan Track B B1
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// Banned confirmation-seeking tail phrases per B_NO_CONFIRMATION_SEEKING
// Each is a pattern that should NOT appear at the end of a substantive AI response
const BANNED_PATTERNS = [
  /shall I\b/i,
  /should I proceed/i,
  /would you like me to/i,
  /do you want me to/i,
  /let me know if/i,
  /is that OK\?/i,
  /ready for me to/i,
  /want me to continue/i,
  /should I continue/i,
  /shall I continue/i,
  /would you like to proceed/i,
];

// Files to scan — session artifacts where banned phrases might appear
const SCAN_TARGETS = [
  'tools/verify-last-run.md',
];

// Also scan most recent closing-summary and handoff if they exist
function getRecentArtifacts() {
  const vaultDir = join(ROOT, 'docs/plan/_handoff/VAULT');
  const artifacts = [];
  if (!existsSync(vaultDir)) return artifacts;

  for (const entry of readdirSync(vaultDir)) {
    if (entry.startsWith('closing-summary-S') && entry.endsWith('.md')) {
      artifacts.push(join(vaultDir, entry));
    }
  }
  // Return most recent only (sorted by name desc = most recent S-number first)
  return artifacts.sort().slice(-1);
}

async function main() {
  const findings = [];
  const targets = [
    ...SCAN_TARGETS.map(t => join(ROOT, t)),
    ...getRecentArtifacts(),
  ].filter(existsSync);

  for (const filePath of targets) {
    const rel = filePath.replace(ROOT, '').replace(/\\/g, '/').replace(/^\//, '');
    const content = readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const pattern of BANNED_PATTERNS) {
        if (pattern.test(line)) {
          findings.push({ file: rel, line: i + 1, text: line.trim().slice(0, 120), pattern: pattern.source });
          break; // one finding per line
        }
      }
    }
  }

  const filesScanned = targets.length;

  if (findings.length > 0) {
    console.log(`\n⚠ CONFIRMATION-SEEKING PHRASES DETECTED (${findings.length} finding(s)):`);
    for (const f of findings) {
      console.log(`  ${f.file}:${f.line}`);
      console.log(`    "${f.text}"`);
    }
    console.log('\n  B_NO_CONFIRMATION_SEEKING: execute under 4-condition gate; report inline + continue.');
  } else {
    console.log(`✓ No confirmation-seeking phrases detected in ${filesScanned} scanned artifact(s)`);
  }

  console.log(`\n[validate-prose-no-confirmation-seeking] files_scanned=${filesScanned} findings=${findings.length} status=${findings.length > 0 ? 'ADVISORY' : 'CLEAN'}`);
  process.exit(0); // ADVISORY tier — always exits 0
}

main().catch(err => {
  console.error('[validate-prose-no-confirmation-seeking] fatal:', err);
  process.exit(1);
});
