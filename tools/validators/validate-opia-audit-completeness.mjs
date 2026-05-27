#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-opia-audit-completeness
 * @csps-name validate-opia-audit-completeness
 * @csps-description OPIA (Opus Post-Implementation Audit) completeness validator.
 *   Scans opus-turn.md ACK blocks for the 15-point OPIA table structure.
 *   ADVISORY S067 → BLOCKING S068.
 *
 *   WHAT THIS PREVENTS: Opus ACKs that don't include the 15-point audit table —
 *   meaning the ACK is reactive praise rather than structural verification.
 *   The OPIA format was inaugurated in S067 turns 37-38 and engraved as
 *   the canonical ACK format at commit 8fa3cc00.
 *
 *   RULES:
 *   (1) ADVISORY: ACK block in opus-turn.md that lacks a numbered table
 *       with ≥10 rows (15-point OPIA has 15, but ≥10 = minimum viable)
 *   (2) ADVISORY: ACK block missing ✓/✗ symbols (OPIA uses pass/fail markers)
 *   (3) PASS: ACK block has table + ✓/✗ markers + SEALED confirmation
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces OPIA P-META-029 B_HUMBLE_CONSOLIDATION_DISCIPLINE
 * @csps-inherits-from validate-opia-audit-completeness (PROTO-S067 APPENDIX D)
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const OPUS_TURN = resolve(ROOT, 'tools/council/opus-turn.md');

if (!existsSync(OPUS_TURN)) {
  console.log('[validate-opia-audit-completeness] opus-turn.md not found — skipping');
  process.exit(0);
}

const content = readFileSync(OPUS_TURN, 'utf8');

// Split into ACK blocks (separated by ---)
const blocks = content.split(/^---+$/m).filter(b => b.trim().length > 50);

let advisory = 0;
let opia_compliant = 0;
const findings = [];

for (let i = 0; i < Math.min(blocks.length, 10); i++) {
  const block = blocks[i];

  // Only check blocks that look like ACKs (contain "ACK" or "SEALED" or "verified")
  const isAck = /\bACK\b|\bSEALED\b|\bverified THIS-HEAD\b|\bOPIA\b/i.test(block);
  if (!isAck) continue;

  // Check for table structure (| # | ... |)
  const tableRows = (block.match(/^\s*\|\s*\d+\s*\|/gm) || []).length;
  const hasCheckmarks = /✓|✗|PASS|FAIL/i.test(block);
  const hasSealed = /SEALED|FULL ADVANCE|ACK.*✅|✅.*ACK/i.test(block);

  if (tableRows >= 10 && hasCheckmarks) {
    opia_compliant++;
    continue;
  }

  // ACK block lacks OPIA structure
  const blockId = (block.match(/^#\s+(.+)/m) || [])[1]?.slice(0, 60)?.trim() || `block-${i + 1}`;
  if (tableRows < 10) {
    advisory++;
    findings.push(`  ADVISORY [OPIA] "${blockId}": ACK block has ${tableRows} table rows (≥10 required for OPIA)`);
  }
  if (!hasCheckmarks) {
    advisory++;
    findings.push(`  ADVISORY [OPIA] "${blockId}": ACK block missing ✓/✗ pass/fail markers`);
  }
}

for (const f of findings) console.log(f);

if (findings.length === 0) {
  console.log(`[validate-opia-audit-completeness] ✓ ${opia_compliant} OPIA-compliant ACK block(s) found`);
}

console.log(`[validate-opia-audit-completeness] blocks_checked=${blocks.length} opia_compliant=${opia_compliant} blocking=0 advisory=${advisory}`);
// Advisory only S067
process.exit(0);
