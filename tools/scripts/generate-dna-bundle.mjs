#!/usr/bin/env node
/**
 * generate-dna-bundle.mjs — PI-032 CSPS DNA Bundle Engine
 * Assembles a context-appropriate, pasteable CSPS DNA bundle by target audience.
 *
 * Usage:
 *   pnpm dna:bundle --target=new-ai-tab
 *   pnpm dna:bundle --target=developer --context=full
 *   pnpm dna:bundle --target=external-ai --output=file:bundle.md
 *
 * Targets: new-ai-tab | external-ai | developer | automation | research
 * Context: minimal | standard | full  (default: standard)
 * Output:  stdout | file:path          (default: stdout)
 * Domain:  all | governance | architecture | ai-behavior (default: all)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// ── CLI args ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function getArg(name) {
  const match = args.find(a => a.startsWith(`--${name}=`));
  return match ? match.split('=').slice(1).join('=') : null;
}

const TARGET  = getArg('target')  || 'new-ai-tab';
const CONTEXT = getArg('context') || 'standard';
const OUTPUT  = getArg('output')  || 'stdout';
const DOMAIN  = getArg('domain')  || 'all';

const VALID_TARGETS = ['new-ai-tab', 'external-ai', 'developer', 'automation', 'research'];
if (!VALID_TARGETS.includes(TARGET)) {
  console.error(`Unknown target: ${TARGET}. Valid: ${VALID_TARGETS.join(', ')}`);
  process.exit(1);
}

// ── Load DNA registry ─────────────────────────────────────────────────────────
const registryPath = join(ROOT, 'tools/config/dna-registry.yaml');
if (!existsSync(registryPath)) {
  console.error('DNA registry not found. Run: PI-031 first (tools/config/dna-registry.yaml).');
  process.exit(1);
}

// Simple YAML list parser — reads "- id:" blocks
function parseRegistry(yaml) {
  const components = [];
  // Split on "  - id:" (2-space indent before dash)
  const blocks = yaml.split(/\n  - id:\s*/);
  for (const block of blocks.slice(1)) {
    const lines = block.split('\n');
    // First line after split IS the id value (everything after "  - id: ")
    const component = {
      id: lines[0].trim(),
      path: '', scope: 'repo', category: '', audience: [], depth_level: 'L2', always_include: false, summary: ''
    };
    for (const line of lines.slice(1)) {
      const m = line.match(/^\s+([\w_-]+):\s*(.+)$/);
      if (!m) continue;
      const [, key, val] = m;
      if (key === 'path') component.path = val.trim();
      else if (key === 'scope') component.scope = val.trim();
      else if (key === 'category') component.category = val.trim();
      else if (key === 'depth_level') component.depth_level = val.trim();
      else if (key === 'always_include') component.always_include = val.trim() === 'true';
      else if (key === 'summary') component.summary = val.trim().replace(/^"|"$/g, '');
      else if (key === 'audience') {
        component.audience = val.replace(/[\[\]]/g, '').split(',').map(s => s.trim());
      }
    }
    if (component.id) components.push(component);
  }
  return components;
}

const registryContent = readFileSync(registryPath, 'utf8');
const allComponents = parseRegistry(registryContent);

// ── Filter by target + domain ─────────────────────────────────────────────────
function shouldInclude(component) {
  if (component.always_include) return true;
  if (!component.audience.includes(TARGET) && !component.audience.includes('all')) return false;
  if (DOMAIN !== 'all' && component.category !== DOMAIN && component.category !== 'language' && component.category !== 'protocol') return false;
  if (CONTEXT === 'minimal' && component.depth_level === 'L3') return false;
  return true;
}

const selected = allComponents.filter(shouldInclude);

// ── Load live state ───────────────────────────────────────────────────────────
let session = 'S040', mandate = 'DNA Bundle Engine + Habit Tracker deployment', blocking = 'none';
try {
  const state = JSON.parse(readFileSync(join(ROOT, 'tools/session-state.json'), 'utf8'));
  session = state.current_session || session;
  mandate = (state.session_mandate || {}).primary || mandate;
  const unresolved = (state.blocking_decisions || []).filter(x => x.status !== 'RESOLVED').map(x => x.id);
  blocking = unresolved.length ? unresolved.join(', ') : 'none';
} catch { /* use defaults */ }

// ── Role definition by target ─────────────────────────────────────────────────
const ROLE_MAP = {
  'new-ai-tab': {
    you: 'Sonnet, the builder in Claude Code VS Code tab',
    sender: 'Yariv Fink (Governor)',
    taskHint: 'Read the context below and confirm alignment before acting.',
  },
  'external-ai': {
    you: 'an external AI co-worker operating in CSPS read-only zone',
    sender: 'Yariv Fink (CSPS Governor)',
    taskHint: 'Read the cooperation plan and vocabulary exclusion list before proposing anything.',
  },
  'developer': {
    you: 'a developer building on the CSPS platform',
    sender: 'CSPS platform DNA bundle',
    taskHint: 'Read the schema and integration modules before writing any app code.',
  },
  'automation': {
    you: 'an automation system (n8n/Make/Zapier) triggering CSPS workflows',
    sender: 'CSPS platform',
    taskHint: 'Use the PI item schema and enforcement trio patterns for any workflow you build.',
  },
  'research': {
    you: 'a research agent analyzing CSPS patterns',
    sender: 'CSPS platform DNA bundle',
    taskHint: 'Use EXT-KNOW evidence levels (0=assumption through 5=payment signal) when classifying findings.',
  },
};

const role = ROLE_MAP[TARGET];

// ── Assemble bundle ───────────────────────────────────────────────────────────
const lines = [];

// Rule 10 context block (mandatory)
lines.push(`YOU ARE: ${role.you}`);
lines.push(`I AM: ${role.sender}`);
lines.push(`THIS IS THE SITUATION: CSPS (CoreSights Platform Services) — ${session}. Mandate: ${mandate}. Open blockers: ${blocking}.`);
lines.push(`YOUR TASK: ${role.taskHint}`);
lines.push('');
lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
lines.push(`CSPS DNA CONTEXT — target:${TARGET} context:${CONTEXT} domain:${DOMAIN}`);
lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
lines.push('');

// Group by category
const byCategory = {};
for (const c of selected) {
  if (!byCategory[c.category]) byCategory[c.category] = [];
  byCategory[c.category].push(c);
}

const categoryOrder = ['language', 'protocol', 'governance', 'architecture', 'ai-behavior', 'knowledge'];
for (const cat of categoryOrder) {
  const components = byCategory[cat];
  if (!components || components.length === 0) continue;

  lines.push(`── ${cat.toUpperCase()} ${'─'.repeat(Math.max(0, 38 - cat.length))}`);
  for (const c of components) {
    lines.push(`[${c.id}] ${c.summary}`);
    if (CONTEXT === 'full') {
      // In full context mode, include the actual file path for manual reference
      lines.push(`  → ${c.path}`);
    }
  }
  lines.push('');
}

// Key behavioral overrides (always injected for new-ai-tab)
if (TARGET === 'new-ai-tab' || CONTEXT !== 'minimal') {
  lines.push('── BEHAVIOR OVERRIDES (disposition: override) ──────────────────────────');
  lines.push('[boundary] Default: assume shared context → CSPS: WHO/WHAT/HOW/NOW at every boundary');
  lines.push('[core-first] Default: accept session-state → CSPS: validate phase exit criteria first');
  lines.push('[completion] Default: new items = high urgency → CSPS: active ≥50% work scores 1.5× PE');
  lines.push('[verbatim] Default: improve human text → CSPS: preserve verbatim; ask only if purpose fails');
  lines.push('[virtual-opus] Architectural decision detected → invoke /cruel-critic or /balance-expert first');
  lines.push('');
}

// FSE reminder for developer/new-ai-tab
if (TARGET === 'new-ai-tab' || TARGET === 'developer') {
  lines.push('── DONE CRITERIA ─────────────────────────────────────────────────────────');
  lines.push('Code: pnpm --filter @csps/[app] build (not tsc alone) + node tools/verify.mjs exit_code=0');
  lines.push('Rule: FSE 5/5 surfaces (T5 AGENTS.md + T4 contract + T3 memory + T2 validator + T1 hook)');
  lines.push('Gap: register as OPEN-NNN in SAME response — never passive observation');
  lines.push('');
}

lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
lines.push(`Generated: ${new Date().toISOString()} | pnpm dna:bundle --target=${TARGET} --context=${CONTEXT}`);

const bundle = lines.join('\n');

// ── Output ─────────────────────────────────────────────────────────────────
if (OUTPUT === 'stdout') {
  process.stdout.write(bundle + '\n');
} else if (OUTPUT.startsWith('file:')) {
  const outPath = OUTPUT.slice(5);
  writeFileSync(outPath, bundle, 'utf8');
  console.error(`Bundle written to: ${outPath}`);
} else {
  console.error(`Unknown output: ${OUTPUT}`);
  process.exit(1);
}
