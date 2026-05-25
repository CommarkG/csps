#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-zf-cycle-format
 * @csps-name validate-zf-cycle-format
 * @csps-description T2 for nominal ZF cycles (gap_ZF_NOMINAL_CYCLES K=6).
 * Scans tools/council/sonnet-turn.md and tools/council/opus-turn.md for ZF blocks.
 * BLOCKING: Cycle 2+ that claims "ZF ACHIEVED" but has no file-name reference (.md/.mjs/.sh/.ts/.yaml etc.)
 * ADVISORY: Cycle 2+ that contains vague words ("areas", "topics", "things") without a file name
 * PASSES: Cycle 2+ with at least one file-name pattern (.md, .mjs, .sh, .ts, .tsx, .yaml, .json)
 *
 * Accepts positional arguments to override default scan files (used by behavioral test cases).
 * Usage: node validate-zf-cycle-format.mjs [file1] [file2] ...
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_ZF_TERMINATION_DISCIPLINE B_STRUCTURAL_PREVENTION_DISCIPLINE
 * context_question: Does every ZF Cycle 2+ name specific files, or does it use vague words like 'areas'?
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const FILE_PATTERN = /\b\w[\w-]*\.(md|mjs|sh|ts|tsx|yaml|yml|json|sql|prisma|zmodel|txt|env|cjs|mts)\b/;
const VAGUE_WORDS = /\b(areas|topics|things|sections|content|files|stuff|items|aspects)\b/i;
const ZF_ACHIEVED = /ZF\s+ACHIEVED/i;
const CYCLE_PATTERN = /ZF\s+Cycle\s+(\d+)[:\s]/gi;

// Default files to scan (can be overridden by positional args)
const DEFAULT_SCAN_FILES = [
  resolve(ROOT, 'tools/council/sonnet-turn.md'),
  resolve(ROOT, 'tools/council/opus-turn.md'),
];

// Positional args override defaults
const scanFiles = process.argv.slice(2).length > 0
  ? process.argv.slice(2).map(f => resolve(f))
  : DEFAULT_SCAN_FILES.filter(existsSync);

let blocking = 0;
let advisory = 0;
let zfBlocksChecked = 0;

/**
 * Extract ZF blocks from content. A ZF block is text from "ZF Cycle 1" through "ZF ACHIEVED."
 */
function extractZFBlocks(content) {
  const blocks = [];
  // Find all positions of "ZF Cycle 1" (case-insensitive)
  const startRe = /ZF\s+Cycle\s+1[\s:]/gi;
  let match;
  while ((match = startRe.exec(content)) !== null) {
    const start = match.index;
    // Find end: look for ZF ACHIEVED or next ZF Cycle 1
    const afterStart = content.slice(start + match[0].length);
    const achievedMatch = afterStart.search(ZF_ACHIEVED);
    if (achievedMatch === -1) continue; // incomplete block, skip
    const blockEnd = start + match[0].length + achievedMatch + 'ZF ACHIEVED'.length;
    blocks.push(content.slice(start, blockEnd));
  }
  return blocks;
}

/**
 * Extract all cycle texts from a ZF block.
 * Matches both "ZF Cycle N:" and plain "Cycle N:" (Cycle 2+ often omits "ZF" prefix).
 * Returns an array of { cycleNum, text } where text runs from that cycle marker to the next.
 */
function parseCycles(block) {
  const cycles = [];
  // Match both "ZF Cycle N:" and plain "Cycle N:" patterns — but ONLY at line start.
  // Without the line anchor, mid-text mentions like "now cites Cycle 2 results" would
  // be parsed as new cycle markers, slicing the actual cycle text and producing false
  // BLOCKING errors (FINDING-OPUS10-4, S062 — Sonnet's amended Cycle 2 self-referenced
  // "Cycle 2" in its own text, parser captured the inner mention onward).
  const re = /(?:^|\n)\s*(?:ZF\s+)?Cycle\s+(\d+)[:\s]/gi;
  let m;
  let lastEnd = 0;
  let lastNum = null;
  while ((m = re.exec(block)) !== null) {
    if (lastNum !== null) {
      cycles.push({ cycleNum: lastNum, text: block.slice(lastEnd, m.index) });
    }
    lastNum = Number(m[1]);
    lastEnd = m.index + m[0].length;
  }
  // Last cycle runs to end of block
  if (lastNum !== null) {
    cycles.push({ cycleNum: lastNum, text: block.slice(lastEnd) });
  }
  return cycles;
}

for (const filePath of scanFiles) {
  if (!existsSync(filePath)) continue;
  const content = readFileSync(filePath, 'utf-8');
  const zfBlocks = extractZFBlocks(content);

  for (const block of zfBlocks) {
    zfBlocksChecked++;
    const hasAchieved = ZF_ACHIEVED.test(block);
    const cycles = parseCycles(block);

    // Check Cycle 2+
    const cycle2Plus = cycles.filter(c => c.cycleNum >= 2);

    for (const { cycleNum, text } of cycle2Plus) {
      const hasFileName = FILE_PATTERN.test(text);
      const hasVague = VAGUE_WORDS.test(text);

      if (hasAchieved && !hasFileName) {
        // BLOCKING: claims ZF ACHIEVED but Cycle 2+ has no file name
        console.error(`[validate-zf-cycle-format] BLOCKING: ZF ACHIEVED claimed but Cycle ${cycleNum} cites no file names.`);
        console.error(`  Cycle ${cycleNum} text: "${text.trim().slice(0, 120)}..."`);
        console.error(`  Fix: Cycle 2+ must name specific files (e.g. "re-examined validate-foo.mjs — 0 new findings")`);
        blocking++;
      } else if (hasVague && !hasFileName) {
        // ADVISORY: vague words without file names
        console.warn(`[validate-zf-cycle-format] ADVISORY: Cycle ${cycleNum} uses vague words without citing specific files: "${text.trim().slice(0, 80)}"`);
        advisory++;
      }
    }
  }
}

console.log(`[validate-zf-cycle-format] zf_blocks_checked=${zfBlocksChecked} blocking=${blocking} advisory=${advisory}`);
process.exit(blocking > 0 ? 1 : 0);
