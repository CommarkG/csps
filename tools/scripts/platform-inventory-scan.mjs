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

// CLI mode
if (process.argv[1]?.endsWith('platform-inventory-scan.mjs')) {
  const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => a.slice(2).split('=')));
  const query = args.query || '';
  if (!query) {
    console.error('Usage: node platform-inventory-scan.mjs --query="..."');
    process.exit(1);
  }
  const hits = scanPlatformInventory(query);
  console.log(`[platform-inventory-scan] query="${query}" hits=${hits.length}`);
  for (const h of hits.slice(0, 10)) {
    console.log(`  ${h.registry}: ${h.file} (score=${h.match_score})`);
  }
}
