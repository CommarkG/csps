#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-agent-calls
 * @csps-name validate-agent-calls
 * @csps-description T2 for INV-004 (agent-understanding-block invariant).
 *   Scans tools/council/sonnet-turn.md for Agent() invocations and checks for
 *   UNDERSTANDING BLOCK compliance near each invocation.
 *   ADVISORY (exits 0 always). Complements T1=pre-tool-use-agent-alignment.sh (BLOCKING).
 *   Closes INV-004 T2 gap — promotes invariant from partial → complete.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces B_AGENT_ALIGNMENT_PROTOCOL P-META-010
 *
 * Exit: 0 always (ADVISORY)
 * Output: agent_calls_checked=N compliant=N advisory=N
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const SONNET_TURN = resolve(ROOT, 'tools/council/sonnet-turn.md');

if (!existsSync(SONNET_TURN)) {
  console.log('[validate-agent-calls] agent_calls_checked=0 compliant=0 advisory=0');
  console.log('[validate-agent-calls] sonnet-turn.md not found — skipping');
  process.exit(0);
}

const UNDERSTANDING_BLOCK_PATTERNS = [
  /BOUNDARY CROSSING/i,
  /I understand the request as/i,
  /UNDERSTANDING BLOCK/i,
  /INTENT ABSORBED/i,
  /alignment preamble/i,
  /CSPS alignment/i,
];

const content = readFileSync(SONNET_TURN, 'utf-8');
const lines = content.split('\n');

let agentCallsChecked = 0;
let compliant = 0;
let advisoryCount = 0;

// Scan for Agent( invocations
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line.includes('Agent(')) continue;
  agentCallsChecked++;

  // Check surrounding context (5 lines before and after) for understanding block
  const contextStart = Math.max(0, i - 5);
  const contextEnd = Math.min(lines.length - 1, i + 5);
  const context = lines.slice(contextStart, contextEnd + 1).join('\n');

  const hasUnderstandingBlock = UNDERSTANDING_BLOCK_PATTERNS.some(p => p.test(context));

  if (hasUnderstandingBlock) {
    compliant++;
  } else {
    advisoryCount++;
    console.warn(
      `[validate-agent-calls] ADVISORY: Agent() invocation at line ${i + 1} missing UNDERSTANDING BLOCK nearby.\n` +
      `  Context: "${line.trim().slice(0, 80)}"\n` +
      `  Expected near: "BOUNDARY CROSSING — Type B" OR "I understand the request as"\n` +
      `  T1 (BLOCKING): pre-tool-use-agent-alignment.sh enforces this at call time.\n` +
      `  This T2 audit checks historical compliance in sonnet-turn.md.`
    );
  }
}

console.log(`[validate-agent-calls] agent_calls_checked=${agentCallsChecked} compliant=${compliant} advisory=${advisoryCount}`);

if (advisoryCount > 0) {
  console.warn(`[validate-agent-calls] ADVISORY: ${advisoryCount} Agent() invocation(s) without nearby UNDERSTANDING BLOCK.`);
  console.warn(`[validate-agent-calls] Reference: INV-004 (invariant-registry.yaml) | B_AGENT_ALIGNMENT_PROTOCOL`);
}

process.exit(0);
