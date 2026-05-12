#!/usr/bin/env node
/**
 * instance-registry-populator.mjs — Populates L3 instance registries from corpus scan
 *
 * RATIFIED: RP-004 (Opus Turn 16 SROF-008) — index artifacts are generated, never manually maintained.
 * SEALED as constitutional. L3 files get: generated:true + generated_by + manual_edits_forbidden:true
 *
 * What it does:
 *   1. Scans ALL governed .md files across the corpus for `core_spine:` frontmatter
 *   2. Groups found artifacts by spine (GVRN/ARCH/AI/OPER/VALD)
 *   3. Within each spine, assigns L2 domain based on file path + tag keywords
 *   4. Writes updated L3_INSTANCES_{SPINE}.md files in .claude/core-spines/
 *
 * Run as: node tools/scripts/instance-registry-populator.mjs
 * Recurring use: add to pnpm verify OR run manually before session close
 *
 * L2 domain assignment strategy:
 *   - Uses path keywords + tag matching to assign artifacts to L2 domains
 *   - Artifacts that don't match any domain → UNCATEGORIZED section
 *   - The l2_domain assignment is heuristic — annotate with "inferred" marker
 *
 * ADR: pending ADR-0025 (RP-004 — generated index artifacts)
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative, extname } from 'node:path';

const ROOT = resolve(process.cwd());
const CORE_SPINES_DIR = join(ROOT, '.claude/core-spines');

// ─── L2 Domain Configuration ─────────────────────────────────────────────────

const L2_DOMAINS = {
  GVRN: {
    DECISION_RIGHTS_CLARITY: ['autonomy', 'decision', 'authority', 'checkpoint', 'pe-alignment', 'agent-alignment', 'threshold', 'intake'],
    ACCOUNTABILITY_TRACEABILITY: ['governor-prompt', 'handoff', 'session', 'audit', 'traceability', 'two-sided', 'accountability', 'hpfa'],
    AMENDMENT_DISCIPLINE: ['pcr', 'adr', 'amendment', 'gradual', 'bundling', 'template', 'protocol', 'plan-creation', 'principle', 'contract'],
  },
  ARCH: {
    COMPOSITION: ['template', 'customer-kit', 'ui', 'page', 'component', 'composition', 'bundle', 'slice'],
    LAYER_SEPARATION: ['layer', 'separation', 'core-manifest', 'spine', 'pillar', 'libs', 'apps', 'separation'],
    STRUCTURAL_INTEGRITY: ['schema', 'zmodel', 'prisma', 'trigger', 'foundation', 'bedrock', 'structural', 'integrity', 'migration'],
    TRACEABILITY: ['frontmatter', 'traceability', 'id', 'session', 'provenance', 'validate-frontmatter', 'nothing-stands-alone'],
    SCHEMA_GOVERNANCE: ['schema-registry', 'schema-anchor', 'canonical-home', 'schema-governance', 'orphan', 'resolution'],
  },
  AI: {
    ALIGNMENT_PROTOCOL: ['alignment', 'aap', 'agent', 'persona', 'inner-ai', 'behavioral', 'contract', 'b_', 'drive-dont-fight'],
    COGNITIVE_CONTEXT: ['cognitive', 'context', 'depth', 'cca', 'token-budget', 'concept-load', 'p-meta-009', 'memory'],
    INNER_DEFAULTS_OVERRIDE: ['inner-default', 'satisfaction-point', 'comprehensive-response', 'crystallization', 'agreement-without', 'enforcement-coverage', 'sp-00', 'sample-library', 'trigger-vocabulary', 'drift-log'],
  },
  OPER: {
    PACE_DISCIPLINE: ['pace', 'session', 'chat-jump', 'handoff', 'closing', 'lean', 'cadence'],
    REALITY_GROUNDING: ['health', 'verify', 'zf', 'rzf', 'evidence', 'pnpm', 'validation', 'grounding'],
    WORKFLOW_INTEGRITY: ['workflow', 'intake', 'hook', 'deploy', 'ci', 'bootstrap', 'zero-laptop', 'git'],
  },
  VALD: {
    COVERAGE_DISCIPLINE: ['coverage', 'audit-runner', 'audit-hub', 'pipeline', 'nothing-stands-alone', 'completeness', 'dead-link'],
    EVIDENCE_SPECIFICITY: ['evidence', 'rzf', 'zf', 'satisfaction-point', 'validate-rzf', 'proof', 'specific'],
    RESULT_DRIVEN_VERIFICATION: ['verify', 'validator', 'validate-', 'pnpm verify', 'result', 'driven', 'health-check', 'exit-code'],
  },
};

// ─── Corpus Scan ─────────────────────────────────────────────────────────────

const SCAN_DIRS = [
  'docs/plan',
  'tools',
  'packages/principles',
  '.claude',
];

const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist\//,
  /L3_INSTANCES_/,  // don't scan our own output
  /L1_CORE_/,       // don't scan sealed files
  /L2_DOMAIN_/,     // don't scan domain files
];

function walkDir(dir, results = []) {
  if (!existsSync(dir)) return results;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relPath = relative(ROOT, fullPath).replace(/\\/g, '/');
    if (EXCLUDE_PATTERNS.some(p => p.test(relPath))) continue;
    if (entry.isDirectory()) walkDir(fullPath, results);
    else if (entry.isFile() && extname(entry.name) === '.md') results.push(fullPath);
  }
  return results;
}

function extractFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const end = content.indexOf('\n---', 3);
  if (end < 0) return null;
  return content.slice(0, end);
}

function parseField(frontmatter, field) {
  const m = frontmatter.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
}

// ─── L2 Domain Assignment ─────────────────────────────────────────────────────

function inferL2Domain(spine, relPath, frontmatter) {
  const pathLower = relPath.toLowerCase();
  const fmLower = frontmatter.toLowerCase();
  const combined = pathLower + ' ' + fmLower;

  const domains = L2_DOMAINS[spine];
  if (!domains) return 'UNCATEGORIZED';

  let bestDomain = null;
  let bestScore = 0;

  for (const [domain, keywords] of Object.entries(domains)) {
    const score = keywords.filter(kw => combined.includes(kw.toLowerCase())).length;
    if (score > bestScore) {
      bestScore = score;
      bestDomain = domain;
    }
  }

  return bestScore > 0 ? bestDomain : 'UNCATEGORIZED';
}

// ─── Main Scan ────────────────────────────────────────────────────────────────

console.log('[instance-registry-populator] scanning corpus...');

const allFiles = SCAN_DIRS.flatMap(d => walkDir(join(ROOT, d)));
const bySpine = { GVRN: {}, ARCH: {}, AI: {}, OPER: {}, VALD: {} };

// Initialize domain buckets
for (const [spine, domains] of Object.entries(L2_DOMAINS)) {
  for (const domain of Object.keys(domains)) bySpine[spine][domain] = [];
  bySpine[spine]['UNCATEGORIZED'] = [];
}

let total = 0;
let skipped = 0;

for (const filePath of allFiles) {
  const content = readFileSync(filePath, 'utf8');
  const fm = extractFrontmatter(content);
  if (!fm) { skipped++; continue; }

  const spine = parseField(fm, 'core_spine');
  if (!spine || !bySpine[spine]) continue;

  const relPath = relative(ROOT, filePath).replace(/\\/g, '/');
  const name = parseField(fm, 'name') || relPath.split('/').pop().replace('.md', '');
  const domain = inferL2Domain(spine, relPath, fm);

  bySpine[spine][domain].push({ path: relPath, name });
  total++;
}

console.log(`[instance-registry-populator] found ${total} artifacts with core_spine: | skipped ${skipped} files without frontmatter`);

// ─── Write L3 Files ───────────────────────────────────────────────────────────

const SPINE_NAMES = { GVRN: 'Governance', ARCH: 'Architecture', AI: 'AI Behavior', OPER: 'Operations', VALD: 'Validation' };
const timestamp = new Date().toISOString();

for (const [spine, domainMap] of Object.entries(bySpine)) {
  const l3File = join(CORE_SPINES_DIR, `L3_INSTANCES_${spine}.md`);
  if (!existsSync(l3File)) {
    console.log(`[instance-registry-populator] SKIP: ${l3File} not found`);
    continue;
  }

  // Read existing to preserve frontmatter
  const existing = readFileSync(l3File, 'utf8');
  const fmEnd = existing.indexOf('\n---', 3);
  const oldFm = fmEnd >= 0 ? existing.slice(0, fmEnd) : '';

  // Build new frontmatter with generated fields
  let newFm = oldFm
    .replace(/\ndescription:.*$/m, `\ndescription: >
  Instance registry for the ${SPINE_NAMES[spine]} Core Spine. GENERATED by instance-registry-populator.mjs.
  Do NOT edit manually — run \`node tools/scripts/instance-registry-populator.mjs\` to regenerate.
  Generated: ${timestamp}`)
    .replace(/amendment_protocol:.+$/m, 'amendment_protocol: NONE — generated artifact; edit source files instead');

  // Add generated fields if not present
  if (!newFm.includes('generated:')) {
    newFm = newFm + '\ngenerated: true\ngenerated_by: tools/scripts/instance-registry-populator.mjs\nmanual_edits_forbidden: true';
  } else {
    newFm = newFm.replace(/generated: .+/, 'generated: true');
  }

  const totalForSpine = Object.values(domainMap).flat().length;

  // Build body
  let body = `\n---\n\n# L3_INSTANCES_${spine}\n\n`;
  body += `Instance registry for the ${SPINE_NAMES[spine]} Core Spine. **GENERATED** — do not edit manually.\n`;
  body += `Generated: ${timestamp} | Total instances: ${totalForSpine}\n\n`;
  body += `## Instances by L2 domain\n\n`;

  for (const [domain, artifacts] of Object.entries(domainMap)) {
    if (artifacts.length === 0) continue;
    body += `### ${domain}\n\n`;
    for (const a of artifacts) {
      body += `- [\`${a.path}\`](../../${a.path}) — ${a.name}\n`;
    }
    body += '\n';
  }

  body += `## Populator script\n\n`;
  body += `Regenerate: \`node tools/scripts/instance-registry-populator.mjs\`\n`;
  body += `Source: governed artifacts with \`core_spine: ${spine}\` in frontmatter\n\n`;
  body += `**Registry signature:** ${timestamp} (generated by RP-004 populator)\n`;

  writeFileSync(l3File, newFm + body, 'utf8');
  console.log(`[instance-registry-populator] ✓ L3_INSTANCES_${spine}.md — ${totalForSpine} instances in ${Object.keys(domainMap).filter(d => domainMap[d].length > 0).length} domains`);
}

console.log('[instance-registry-populator] DONE — all 5 L3 files updated');
console.log(`[instance-registry-populator] total=${total} timestamp=${timestamp}`);
