#!/usr/bin/env node
/**
 * validate-universal-alignment.mjs — THE UNIVERSAL ALIGNMENT GATE
 *
 * ROOT CAUSE TARGETED: 43 CSPS-originated artifacts found without core_spine +
 * schema_anchor (validate-nothing-stands-alone.mjs). The insight: CSPS-originated
 * content also needs alignment checking. Pre-alignment beats post-audit.
 *
 * This IS the universal pipeline for ALL artifacts:
 *   STEP 1: Core Spine check (core_spine + schema_anchor declared)
 *   STEP 2: DNA check (version + owner + lifecycle + lifecycle_state)
 *   STEP 3: Connectivity check (links: or cross-refs present)
 *   STEP 4: Impl status declared (impl_status field)
 *
 * Differs from validate-nothing-stands-alone.mjs:
 *   - That: finds orphans in predefined dirs
 *   - This: checks full alignment of any artifact passed to it
 *   - Use case: pre-creation gate in The Threshold Step 0
 *
 * Can be used as:
 *   node tools/validators/validate-universal-alignment.mjs <file-path>
 *   node tools/validators/validate-universal-alignment.mjs --scan-new  (all untracked git files)
 *
 * EXIT-CODED: 0 = fully aligned / 1 = alignment gaps found
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

function checkAlignment(filePath) {
  if (!existsSync(filePath)) return { aligned: false, gaps: [`File not found: ${filePath}`] };
  const text = readFileSync(filePath, 'utf8');
  if (!text.startsWith('---')) return { aligned: false, gaps: ['No frontmatter — not a governed artifact'] };

  const gaps = [];

  // STEP 1: Core Spine
  if (!/^core_spine:\s*.+$/m.test(text)) gaps.push('Missing core_spine — run core-spine-expert to classify');
  if (!/^schema_anchor:\s*.+$/m.test(text)) gaps.push('Missing schema_anchor — add schema anchor per schema-index.md');

  // STEP 2: DNA
  if (!/^version:\s*.+$/m.test(text)) gaps.push('Missing version field');
  if (!/^owner:\s*.+$/m.test(text)) gaps.push('Missing owner field');
  if (!/^lifecycle:\s*.+$/m.test(text)) gaps.push('Missing lifecycle field');
  if (!/^lifecycle_state:\s*.+$/m.test(text)) gaps.push('Missing lifecycle_state field');

  // STEP 3: Connectivity (links or consolidation_cross_refs)
  const hasLinks = /^links:$/m.test(text) || /\{ rel:/.test(text);
  const hasCrossRefs = /^consolidation_cross_refs:/m.test(text);  // multiline flag
  const hasPrincipleCompliance = /^principle_compliance:/m.test(text);  // multiline flag
  if (!hasLinks && !hasCrossRefs && !hasPrincipleCompliance) {
    gaps.push('Missing connectivity — add links: array or consolidation_cross_refs (nothing-stands-alone)');
  }

  // STEP 4: Impl status (advisory for non-implementation artifacts)
  // Only required for files in docs/plan/pillar-* (implementation-bearing)
  const isImplArtifact = filePath.includes('pillar-') || filePath.includes('tools/');
  if (isImplArtifact && !/^impl_status:\s*.+$/m.test(text)) {
    gaps.push('Missing impl_status — add swift-implemented|audit-1-complete|sealed-zf per frontmatter-closed-enums.md');
  }

  return { aligned: gaps.length === 0, gaps };
}

function getNewFiles() {
  try {
    const output = execSync('git status --short', { cwd: ROOT, encoding: 'utf8' });
    return output.split('\n')
      .filter(l => l.trim().startsWith('?? ') || l.trim().startsWith('A  '))
      .map(l => l.trim().replace(/^[?MAD ]+/, '').replace(/^"(.+)"$/, '$1').trim())
      .filter(f => f.endsWith('.md'))
      // Skip generated slice files (no frontmatter by design)
      .filter(f => !f.match(/\/behavioral-contracts\/B_/) && !f.match(/\/audit-runner\/pipeline-/) && !f.match(/\/ai-behavior-spine\//) && !f.match(/\/principles\/P-/) && f !== 'SESSION-BRIEF.md')
      // Skip council working files (relay buffers, protocol docs, context briefs — not governed artifacts)
      .filter(f => !f.match(/tools\/council\/(opus-turn|sonnet-turn|PROTOCOL|opus-protocol|opus-1-context|sonnet-1-context|haiku-1-context)\.md/))
      // Skip governor-comments (auto-generated append-only raw logs)
      .filter(f => !f.match(/governor-comments\//));
  } catch { return []; }
}

async function main() {
  const args = process.argv.slice(2);
  const scanNew = args.includes('--scan-new');
  const targetFile = args.find(a => !a.startsWith('--'));

  let files = [];
  if (scanNew) {
    files = getNewFiles().map(f => join(ROOT, f));
    if (files.length === 0) {
      console.log('[validate-universal-alignment] No new .md files found in git status');
      process.exit(0);
    }
    console.log(`[validate-universal-alignment] Scanning ${files.length} new file(s)...`);
  } else if (targetFile) {
    files = [targetFile.startsWith('/') ? targetFile : join(ROOT, targetFile)];
  } else {
    console.log('[validate-universal-alignment] Usage: node validate-universal-alignment.mjs <file> OR --scan-new');
    console.log('  Pre-alignment gate for The Threshold: checks core_spine + DNA + connectivity + impl_status');
    process.exit(0);
  }

  const allGaps = [];
  for (const f of files) {
    const relPath = f.replace(ROOT, '').replace(/\\/g, '/').replace(/^\//, '');
    const { aligned, gaps } = checkAlignment(f);
    if (!aligned) {
      console.warn(`\n⚠ ${relPath} (${gaps.length} alignment gap(s)):`);
      for (const g of gaps) console.warn(`  → ${g}`);
      allGaps.push(...gaps.map(g => `${relPath}: ${g}`));
    } else {
      console.log(`  ✓ ${relPath} — fully aligned`);
    }
  }

  const summary = `[validate-universal-alignment] files=${files.length} aligned=${files.length - (allGaps.length > 0 ? 1 : 0)} gaps=${allGaps.length}`;
  console.log(`\n${summary}`);

  if (allGaps.length > 0) process.exit(1);
  process.exit(0);
}

main().catch(err => { console.error('[validate-universal-alignment] fatal:', err); process.exit(1); });
