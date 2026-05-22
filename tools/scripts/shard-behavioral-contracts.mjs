#!/usr/bin/env node
/**
 * PROTO-S051-1 Step 1: behavioral-contracts shard execution
 * Splits behavioral-contracts.md into 5 spine-based shard files.
 * Converts monolith to an index file.
 * Does NOT modify the slice generator (split-behavioral-contracts.mjs) —
 * that update is handled separately.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const BC = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts.md');

// ── Spine assignment ──────────────────────────────────────────────────────────
const SPINE_MAP = {
  // AI spine
  'B_AI_PROFESSIONAL_VOICE': 'AI',
  'B_VALIDATE_BEFORE_ASSUME': 'AI',
  'B_NO_AI_IMPERSONATION': 'AI',
  'B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS': 'AI',
  'B_COGNITIVE_CONTEXT_DISCIPLINE': 'AI',
  'B_CONCEPT_LOAD': 'AI',
  'B_DEVELOPMENT_VS_PRODUCTION': 'AI',
  'B_TOKEN_BUDGET': 'AI',
  'B_AI_COLLABORATIVE_DISCIPLINE': 'AI',
  'B_CDAB': 'AI',
  'B_VERBATIM_HUMAN_TEXT': 'AI',

  // GVRN spine
  'B_GOVERNOR_PROMPTS': 'GVRN',
  'B_CONSENSUS_BEFORE_PROCEEDING': 'GVRN',
  'B_BOUNDARY_ALIGNMENT_PROTOCOL': 'GVRN',
  'B_MUTUAL_UNDERSTANDING_VALIDATION': 'GVRN',
  'B_TRIAD_GOVERNANCE': 'GVRN',
  'B_PRACE': 'GVRN',
  'B_INHERITANCE_POLICY': 'GVRN',
  'B_PE_ALIGNMENT_GUARDIAN': 'GVRN',
  'B_PCR_FOR_DECISIONS': 'GVRN',
  'B_COMPLETION_OVER_SHINY': 'GVRN',
  'B_PLATFORM_FIRST_OPTIMIZATION': 'GVRN',
  'B_KNOW_HOW_DISCIPLINE': 'GVRN',

  // ARCH spine
  'B_NO_IMPLEMENTATION_WITHOUT_PLAN': 'ARCH',
  'B_INTENT_CRYSTALLIZATION': 'ARCH',
  'B_SANDBOX_BEFORE_IMPLEMENTATION': 'ARCH',
  'B_APPS_ARE_TRIALS': 'ARCH',
  'B_CORE_SPINE_DISCIPLINE': 'ARCH',
  'B_TEMPLATE_FIRST_CREATION': 'ARCH',
  'B_GRADUAL_BUILD_BY_FOUNDATIONS': 'ARCH',
  'B_NAMING_POLICY': 'ARCH',
  'B_CONSOLIDATION_PASS': 'ARCH',
  'B_SAVINGS_AND_SSOT_UNIFIED': 'ARCH',
  'B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK': 'ARCH',
  'B_CHECK_EXISTING_DECISIONS_FIRST': 'ARCH',

  // VALD spine
  'B_RZF': 'VALD',
  'B_CEC': 'VALD',
  'B_PRE_CLOSE_VERIFICATION': 'VALD',
  'B_POSITIVE_VALUE_EXTRACTION': 'VALD',
  'B_CATCH_TO_ENGRAVING': 'VALD',
  'B_FIVE_SURFACE_ENGRAVING': 'VALD',
  'B_STRUCTURAL_PREVENTION_DISCIPLINE': 'VALD',
  'B_DONE_RIGHT_FROM_THE_START': 'VALD',
  'B_DEFINITION_BEFORE_ENFORCEMENT': 'VALD',
  'B_QC_AUDIT': 'VALD',

  // OPER spine (all remaining)
  'B_INTAKE_DISCIPLINE': 'OPER',
  'B_PROTOCOL_LITERAL_EXECUTION': 'OPER',
  'B_HANDOFF_PRE_FLIGHT_AUDIT': 'OPER',
  'B_AUTONOMOUS_BATCH_WITH_PREFLIGHT': 'OPER',
  'B_HUMBLE_EXECUTOR': 'OPER',
  'B_HUMBLE_EXECUTION_PIPELINE': 'OPER',
  'B_CONTEXTUAL_LOCALITY': 'OPER',
  'B_ZCA': 'OPER',
  'B_ZERO_LAPTOP_DEPENDENCY': 'OPER',
  'B_AGENT_ALIGNMENT_PROTOCOL': 'OPER',
  'B_AUTONOMY_4_CONDITIONS': 'OPER',
  'B_CHECKPOINT_8_CATEGORIES': 'OPER',
  'B_BLOCKER_NO_SILENT_DROP': 'OPER',
  'B_TWO_SIDED_HANDSHAKE': 'OPER',
  'B_INTENT_TO_IMPACT': 'OPER',
  'B_NO_FORCE_FIT': 'OPER',
  'B_ALWAYS_GIT_LINKS': 'OPER',
  'B_ASK_WHEN_FILLING_GAPS': 'OPER',
};

// ── Parse monolith ────────────────────────────────────────────────────────────
const content = readFileSync(BC, 'utf8');
const lines = content.split('\n');

// Find the end of frontmatter
let fmEnd = 0;
let inFm = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === '---') {
    if (!inFm) { inFm = true; }
    else { fmEnd = i; break; }
  }
}

// Parse into sections
const sections = [];
let currentName = null;
let currentLines = [];

for (let i = fmEnd + 1; i < lines.length; i++) {
  const m = lines[i].match(/^## (B_[A-Z0-9_]+)/);
  if (m) {
    if (currentName) sections.push({ name: currentName, lines: currentLines });
    currentName = m[1];
    currentLines = [lines[i]];
  } else if (currentName) {
    currentLines.push(lines[i]);
  }
}
if (currentName) sections.push({ name: currentName, lines: currentLines });

// Strip trailing blank lines from each section
for (const s of sections) {
  while (s.lines.length > 0 && s.lines[s.lines.length - 1].trim() === '') s.lines.pop();
}

console.log(`[shard] Parsed ${sections.length} B_* sections`);

// ── Assign to spines ──────────────────────────────────────────────────────────
const shards = { AI: [], GVRN: [], ARCH: [], VALD: [], OPER: [] };
const unmapped = [];

for (const s of sections) {
  const spine = SPINE_MAP[s.name];
  if (spine) {
    shards[spine].push(s);
  } else {
    shards.OPER.push(s); // default to OPER
    unmapped.push(s.name);
    console.warn(`[shard] WARNING: ${s.name} not in SPINE_MAP → assigned to OPER`);
  }
}

console.log(`[shard] Spine counts: AI=${shards.AI.length} GVRN=${shards.GVRN.length} ARCH=${shards.ARCH.length} VALD=${shards.VALD.length} OPER=${shards.OPER.length}`);
const total = Object.values(shards).reduce((n, a) => n + a.length, 0);
console.log(`[shard] Total: ${total} contracts`);

// ── Write shard files ─────────────────────────────────────────────────────────
const SPINE_META = {
  AI:   { title: 'Behavioral Contracts — AI Spine', desc: 'B_* contracts governing AI behavior defaults, cognitive context, and model alignment', anchor: 'behavioral_contracts_ai' },
  GVRN: { title: 'Behavioral Contracts — GVRN Spine', desc: 'B_* contracts governing decision rights, governance process, and accountability', anchor: 'behavioral_contracts_gvrn' },
  ARCH: { title: 'Behavioral Contracts — ARCH Spine', desc: 'B_* contracts governing architecture, implementation gates, and structural decisions', anchor: 'behavioral_contracts_arch' },
  VALD: { title: 'Behavioral Contracts — VALD Spine', desc: 'B_* contracts governing verification, validation, and zero-findings discipline', anchor: 'behavioral_contracts_vald' },
  OPER: { title: 'Behavioral Contracts — OPER Spine', desc: 'B_* contracts governing operational discipline, handoffs, and execution patterns', anchor: 'behavioral_contracts_oper' },
};

const shardPaths = {};

for (const [spine, contracts] of Object.entries(shards)) {
  const meta = SPINE_META[spine];
  const path = join(ROOT, `docs/plan/pillar-0-governance/behavioral-contracts-${spine}.md`);
  shardPaths[spine] = path;

  const header = `---
id: csps.pillar-0-governance.behavioral-contracts-${spine.toLowerCase()}
name: behavioral-contracts-${spine}
description: "${meta.desc}"
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ${spine}
schema_anchor: ${meta.anchor}
batch: BATCH-A
session: S051
diataxis_type: reference
links:
  - { rel: index, href: behavioral-contracts.md }
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/behavioral-contracts.md
---

# ${meta.title}

> **Shard of behavioral-contracts.md.** ${contracts.length} contracts — ${spine} spine.
> Index: [behavioral-contracts.md](behavioral-contracts.md) | Split: \`pnpm contracts:split\`

---

`;

  const body = contracts.map(s => s.lines.join('\n')).join('\n\n---\n\n') + '\n';
  writeFileSync(path, header + body, 'utf8');
  console.log(`[shard] Wrote ${path} (${contracts.length} contracts)`);
}

// ── Update behavioral-contracts.md to lightweight index ───────────────────────
// Extract the original frontmatter
const fmLines = lines.slice(0, fmEnd + 1).join('\n');

// Build the index table
const indexRows = sections.map(s => {
  const spine = SPINE_MAP[s.name] || 'OPER';
  const shardFile = `behavioral-contracts-${spine}.md`;
  return `| [${s.name}](behavioral-contracts/${s.name}.md) | ${spine} | [shard](${shardFile}) |`;
}).join('\n');

const indexContent = `${fmLines}

# Behavioral Contracts (B_*) — Index

> **This file is now an index.** All B_* contract content has been moved to 5 spine-based shard files.
> Monolith token count was approaching the hard limit (57K/60K).
>
> **To load a specific spine's contracts:** read the shard file.
> **To load a specific contract:** read the slice at \`behavioral-contracts/B_NAME.md\`.
> **Split command:** \`pnpm contracts:split\` (reads from shard files, generates 64 slices).

---

## Shard Files

| Shard | Spine | Contracts | Approx tokens |
|---|---|---|---|
| [behavioral-contracts-GVRN.md](behavioral-contracts-GVRN.md) | GVRN | ${shards.GVRN.length} | ~14K |
| [behavioral-contracts-AI.md](behavioral-contracts-AI.md) | AI | ${shards.AI.length} | ~12K |
| [behavioral-contracts-ARCH.md](behavioral-contracts-ARCH.md) | ARCH | ${shards.ARCH.length} | ~12K |
| [behavioral-contracts-VALD.md](behavioral-contracts-VALD.md) | VALD | ${shards.VALD.length} | ~10K |
| [behavioral-contracts-OPER.md](behavioral-contracts-OPER.md) | OPER | ${shards.OPER.length} | ~9K |

**Total: ${total} contracts distributed across 5 files.**

---

## Contract Index

| Contract | Spine | Shard |
|---|---|---|
${indexRows}

---

*Sharded S051 PROTO-S051-1 Step 1. Monolith preserved in git history.*
`;

writeFileSync(BC, indexContent, 'utf8');
console.log(`[shard] Converted behavioral-contracts.md to index (${total} contracts referenced)`);
console.log(`[shard] Done. Run pnpm contracts:split to regenerate slices from shards.`);
