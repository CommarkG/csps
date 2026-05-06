#!/usr/bin/env node
/**
 * validate-impl-status.mjs — implementation quality state machine validator
 *
 * Checks that active topic-plans and canonical leaves have impl_status declared
 * and that state transitions are valid per frontmatter-closed-enums.md §impl_status.
 *
 * VALID STATES: swift-implemented | audit-1-complete | sealed-zf |
 *               recurring-audit-pending | architecture-pending | deprecated
 *
 * Also surfaces: items in swift-implemented state that are older than 2 sessions
 *   (should have been audited by now → warn as stale-impl pattern)
 * And:           items in architecture-pending that should be in the vault
 *   (architecture-pending → check vault_pending has a VLT entry)
 *
 * EXIT-CODED: 0 = all implementation statuses valid / 1 = issues found
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const VALID_IMPL_STATUSES = [
  'swift-implemented',
  'audit-1-complete',
  'sealed-zf',
  'recurring-audit-pending',
  'architecture-pending',
  'deprecated',
];

// Directories to scan for implementation artifacts
const SCAN_DIRS = [
  'docs/plan/pillar-0-governance',
  'docs/plan/pillar-1-architecture-and-stack',
  'docs/plan/pillar-2-data-and-schema',
  'docs/plan/pillar-5-ai-systems',
];

function extractField(text, field) {
  const m = text.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
}

function scanDir(dirPath) {
  const results = [];
  if (!existsSync(dirPath)) return results;
  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
        results.push(join(dirPath, entry.name));
      }
    }
  } catch { /* skip */ }
  return results;
}

async function main() {
  const warnings = [];
  const infos = [];
  let checked = 0;
  let hasStatus = 0;

  for (const dir of SCAN_DIRS) {
    const files = scanDir(join(ROOT, dir));
    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      const lifecycle = extractField(text, 'lifecycle_state');
      if (!lifecycle || lifecycle === 'deprecated') continue;

      const implStatus = extractField(text, 'impl_status');
      const session = extractField(text, 'session');
      const relPath = file.replace(ROOT, '').replace(/\\/g, '/').replace(/^\//, '');

      checked++;

      if (!implStatus) {
        // Advisory: not required yet, but surfaces for awareness
        infos.push(`${relPath}: no impl_status declared (advisory — add when artifact becomes implementation-bearing)`);
        continue;
      }

      hasStatus++;

      // Check valid state
      if (!VALID_IMPL_STATUSES.includes(implStatus)) {
        warnings.push(`${relPath}: invalid impl_status "${implStatus}" — must be one of: ${VALID_IMPL_STATUSES.join(' | ')}`);
        continue;
      }

      // Check architecture-pending has vault_pending entry
      if (implStatus === 'architecture-pending') {
        if (!text.includes('vault_pending:')) {
          warnings.push(`${relPath}: impl_status=architecture-pending but no vault_pending field — add VLT entry with retrieve_when condition`);
        }
      }

      // Check swift-implemented staleness (session field check)
      if (implStatus === 'swift-implemented' && session) {
        const sessionN = Number(session.replace(/[^0-9]/g, ''));
        // Current session estimate from OVERVIEW.md or hardcode S011
        const currentN = 11;
        if (sessionN > 0 && currentN - sessionN >= 2) {
          warnings.push(`${relPath}: impl_status=swift-implemented since ${session} (${currentN - sessionN} sessions ago) — should have progressed to audit-1-complete`);
        }
      }
    }
  }

  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s) — implementation status issues:`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
  }

  if (infos.length > 0 && process.argv.includes('--verbose')) {
    console.log(`\n${infos.length} info(s) — artifacts without impl_status:`);
    for (const i of infos.slice(0, 10)) console.log(`  ℹ ${i}`);
    if (infos.length > 10) console.log(`  ... and ${infos.length - 10} more`);
  }

  const summary = `[validate-impl-status] checked=${checked} with_status=${hasStatus} warnings=${warnings.length}`;
  console.log(`\n${summary}`);

  if (warnings.length > 0) process.exit(1);
  process.exit(0);
}

main().catch(err => { console.error('[validate-impl-status] fatal:', err); process.exit(1); });
