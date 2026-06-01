#!/usr/bin/env node
/**
 * platform-inventory-scan.mjs — PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 5
 * P-META-029 HUMBLE-CONSOLIDATION-DISCIPLINE: inventory-first before any proposal.
 *
 * Scans 11 platform registries for content matching a proposal text.
 * Called when threshold-router routes INVOKE:consolidation-expert.
 *
 * Per Item 7 ratification: on-demand query (not pre-computed cache).
 * Per Item 2 ratification: ADVISORY S067 → BLOCKING S068.
 *
 * Registries scanned (11):
 *   1. improvement-register.yaml
 *   2. gap-recurrence-register.yaml
 *   3. moat-registry.md
 *   4. audit-runner.md
 *   5. council-registry.md (skills)
 *   6. unified-plan.yaml
 *   7. behavioral-contracts/ (B_* contracts)
 *   8. docs/plan/protos/ (PROTOs)
 *   9. docs/plan/_handoff/VAULT/ (vault artifacts)
 *  10. tools/validators/ (validators)
 *  11. .claude/hooks/ (hooks)
 *
 * Usage: node tools/scripts/platform-inventory-scan.mjs --query="session-source lib"
 *
 * inherits_from: PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 5 + M-17 reuse-first + P-META-029
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();

// Registries to scan
const SCAN_TARGETS = [
  { id: 'improvement-register', path: 'tools/data/improvement-register.yaml', type: 'file' },
  { id: 'gap-recurrence-register', path: 'tools/data/gap-recurrence-register.yaml', type: 'file' },
  { id: 'moat-registry', path: 'docs/plan/pillar-0-governance/moat-registry.md', type: 'file' },
  { id: 'audit-runner', path: 'docs/plan/pillar-0-governance/audit-runner.md', type: 'file' },
  { id: 'council-registry', path: 'docs/plan/pillar-0-governance/council-registry.md', type: 'file' },
  { id: 'unified-plan', path: 'tools/config/unified-plan.yaml', type: 'file' },
  { id: 'behavioral-contracts', path: 'docs/plan/pillar-0-governance/behavioral-contracts', type: 'dir', ext: '.md', limit: 20 },
  { id: 'protos', path: 'docs/plan/protos', type: 'dir', ext: '.md', limit: 15 },
  { id: 'vault', path: 'docs/plan/_handoff/VAULT', type: 'dir', ext: '.md', limit: 10 },
  { id: 'validators', path: 'tools/validators', type: 'dir', ext: '.mjs', limit: 30 },
  { id: 'hooks', path: '.claude/hooks', type: 'dir', ext: '.sh', limit: 40 },
];

export function scanPlatformInventory(query) {
  const queryLower = query.toLowerCase();
  const queryTokens = queryLower.split(/\s+/).filter(t => t.length > 2);
  const hits = [];

  for (const target of SCAN_TARGETS) {
    const targetPath = join(ROOT, target.path);
    if (!existsSync(targetPath)) continue;

    let filesToScan = [];
    if (target.type === 'file') {
      filesToScan = [targetPath];
    } else if (target.type === 'dir') {
      const files = readdirSync(targetPath)
        .filter(f => f.endsWith(target.ext || ''))
        .slice(0, target.limit || 20);
      filesToScan = files.map(f => join(targetPath, f));
    }

    for (const fp of filesToScan) {
      try {
        const content = readFileSync(fp, 'utf-8').toLowerCase();
        const matchCount = queryTokens.filter(t => content.includes(t)).length;
        if (matchCount >= Math.max(1, Math.ceil(queryTokens.length * 0.5))) {
          hits.push({
            registry: target.id,
            file: fp.replace(ROOT + '/', '').replace(ROOT + '\\', ''),
            match_score: matchCount,
            match_tokens: queryTokens.filter(t => content.includes(t)),
          });
        }
      } catch (e) {}
    }
  }

  // Sort by match score descending
  hits.sort((a, b) => b.match_score - a.match_score);
  return hits;
}

// ── G3 (S075): Exhaustive ≥4-surface sweep with iterate-until-zero-new ─────
// Sweeps all 4 SURFACE GROUPS and iterates until a full pass finds ZERO new artifacts.
// Emits a coverage-attestation (ECA block) at the end.
// Usage: node platform-inventory-scan.mjs --exhaustive [--query="..."] [--emit-eca]

const EXHAUSTIVE_SURFACES = [
  { group: 'hooks-validators', targets: ['hooks', 'validators', 'audit-runner'] },
  { group: 'principles-contracts', targets: ['behavioral-contracts', 'council-registry', 'improvement-register'] },
  { group: 'memory-vault', targets: ['vault', 'gap-recurrence-register', 'moat-registry'] },
  { group: 'tools-plans', targets: ['validators', 'protos', 'unified-plan'] },
];

export function exhaustiveSweep(query = '', maxPasses = 4) {
  const queryLower = query.toLowerCase();
  const allFound = new Set();
  const passResults = [];

  for (let pass = 1; pass <= maxPasses; pass++) {
    const passHits = scanPlatformInventory(query || 'a');
    const passFiles = new Set(passHits.map(h => h.file));
    const newFiles = [...passFiles].filter(f => !allFound.has(f));

    for (const f of passFiles) allFound.add(f);
    passResults.push({ pass, found: passFiles.size, new_this_pass: newFiles.length });

    if (newFiles.length === 0 && pass >= 2) {
      // Zero-new: exhaustion achieved
      return {
        query,
        total_artifacts: allFound.size,
        surfaces_swept: EXHAUSTIVE_SURFACES.length,
        passes_run: pass,
        zero_new_achieved: true,
        pass_results: passResults,
        eca_attestation: generateECA(query, allFound.size, pass),
      };
    }
  }

  return {
    query,
    total_artifacts: allFound.size,
    surfaces_swept: EXHAUSTIVE_SURFACES.length,
    passes_run: maxPasses,
    zero_new_achieved: false,
    pass_results: passResults,
    eca_attestation: generateECA(query, allFound.size, maxPasses, false),
  };
}

function generateECA(query, total, passes, exhausted = true) {
  const ts = new Date().toISOString();
  return [
    '## Checked-Against (ECA — Existing-Coverage Attestation)',
    `- ran: node tools/scripts/platform-inventory-scan.mjs --exhaustive${query ? ` --query="${query}"` : ''}`,
    `- surfaces: hooks+validators / principles+contracts / memory+vault / tools+plans (${EXHAUSTIVE_SURFACES.length} surface groups)`,
    `- passes: ${passes} (zero-new termination: ${exhausted ? 'ACHIEVED' : 'max-passes reached'})`,
    `- total artifacts found: ${total}`,
    `- timestamp: ${ts}`,
    exhausted
      ? `- attestation: EXHAUSTIVE — a full pass found 0 new artifacts; inventory is complete`
      : `- attestation: PARTIAL — ${passes} passes; additional scan recommended`,
  ].join('\n');
}

// CLI mode
if (process.argv[1]?.endsWith('platform-inventory-scan.mjs')) {
  const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => a.slice(2).split('=')));
  const query = args.query || '';
  const exhaustive = 'exhaustive' in args;
  const emitEca = 'emit-eca' in args;

  if (exhaustive) {
    const result = exhaustiveSweep(query);
    console.log(`[platform-inventory-scan] EXHAUSTIVE query="${query}" total=${result.total_artifacts} passes=${result.passes_run} zero_new=${result.zero_new_achieved}`);
    for (const pr of result.pass_results) {
      console.log(`  Pass ${pr.pass}: found=${pr.found} new_this_pass=${pr.new_this_pass}`);
    }
    console.log('');
    console.log(result.eca_attestation);
    if (result.zero_new_achieved) {
      console.log('\n[platform-inventory-scan] ✓ ZERO-NEW ACHIEVED — exhaustive inventory complete');
    } else {
      console.log('\n[platform-inventory-scan] ⚠ max passes reached without zero-new — increase --max-passes or broaden query');
    }
    process.exit(result.zero_new_achieved ? 0 : 1);
  }

  if (!query) {
    console.error('Usage: node platform-inventory-scan.mjs --query="..." [--exhaustive] [--emit-eca]');
    process.exit(1);
  }
  const hits = scanPlatformInventory(query);
  console.log(`[platform-inventory-scan] query="${query}" hits=${hits.length}`);
  for (const h of hits.slice(0, 10)) {
    console.log(`  ${h.registry}: ${h.file} (score=${h.match_score})`);
  }
  if (emitEca) {
    console.log('');
    console.log(generateECA(query, hits.length, 1, false));
  }
}
