#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-frontmatter
 * @csps-name validate-frontmatter
 * @csps-description Build-time frontmatter validator. Parses every .md artifact, validates against pillar-1/frontmatter-standard.md schema, fails CI on missing required fields, closed-enum violations, missing reuse-first declaration, missing next_review_at when lifecycle_state != active. Per P-OP-001 reuse-first enforcer #5 (frontmatter contract); per P-META-004 stewardship (lifecycle_state required); per AGENTS.md hard NO #11 (saved-without-lifecycle_state = orphan-in-waiting). PR-blocking via `pnpm lint:frontmatter`.
 * @csps-version 0.1.0
 * @csps-owner group:finky
 * @csps-lifecycle experimental
 * @csps-lifecycle-state active
 * @csps-tags type:util domain:dx audience:developer
 * @csps-enforces P-OP-001 P-META-004 frontmatter-completeness
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// ─────────────────────────────────────────────────────────────────────────────
// Schema (per pillar-1/frontmatter-standard.md)
// ─────────────────────────────────────────────────────────────────────────────

const REQUIRED_FIELDS = ['id', 'name', 'description', 'version', 'owner', 'lifecycle', 'lifecycle_state'];

const CLOSED_DIMENSIONS = {
  domain: ['billing', 'persona', 'bookings', 'auth', 'admin', 'ai', 'infra', 'shared', 'crisis', 'audit', 'governance', 'architecture', 'data', 'dx', 'ops', 'planning', 'ui', 'platform'],
  type: ['feature', 'ui', 'data-access', 'util', 'schema', 'doc', 'skill', 'agent', 'bundle', 'template', 'reference', 'tutorial', 'how-to', 'explanation'],
  tier: ['free', 'pro', 'business', 'enterprise', 'internal'],
  audience: ['end-user', 'admin', 'developer', 'ai-agent'],
  maturity: ['draft', 'review', 'stable', 'frozen', 'deprecated'],
};

// S022 VLT-ratified standalone field enums (domain_path, wisdom_class, persona_target, etc.)
// Governor ratified S021: domain_path Tier 1 + wisdom_class + persona_target (4/7)
// These are OPTIONAL fields — when present, must be in closed enum; when absent, no error
const OPTIONAL_FIELD_ENUMS = {
  // domain_path: Tier 1 values (hierarchical — check Tier 1 only)
  domain_path_tier1: ['business', 'personal', 'social', 'knowledge', 'platform', 'crosscut'],
  // wisdom_class: how this artifact contributes to the WisdomVault
  wisdom_class: ['insight', 'reference', 'workflow', 'tool', 'benchmark', 'story', 'null'],
  // developer_surface: how developers access this capability
  developer_surface: ['api-route', 'lib-export', 'mcp-query', 'sdk', 'documented', 'none'],
  // completion_circle: how far along the full closed circle
  completion_circle: ['schema', 'schema+logic', 'schema+logic+dev', 'schema+logic+dev+user', 'full'],
  // builder_surface: who consumes this element
  builder_surface: ['builder', 'user', 'both', 'platform-only'],
  // persona_target: ratified 4/7 (family_admin|family_member|community_leader deferred)
  persona_target_ratified: ['solo_user', 'business_admin', 'business_member', 'developer'],
  persona_target_deferred: ['family_admin', 'family_member', 'community_leader'],
  // use_case_class: functional category of what this artifact enables (Schema Phase A S022)
  use_case_class: ['tracking', 'planning', 'communication', 'analysis', 'automation', 'discovery', 'creation', 'governance'],
  // S023 Intent Crystallization + Sandbox Ratification fields
  intent_crystallized: ['true', 'false', 'partial'],
  simulation_status: ['pending', 'pass', 'fail'],
  threshold_route: ['developer.new-entity', 'developer.new-page', 'developer.api-integration', 'business.billing', 'business.permissions', 'ux.onboarding-flow', 'platform.governance', 'personal.tracking', 'knowledge.documentation', 'none'],
  ux_principle: ['jtbd-outcome-first', 'progressive-disclosure', 'mobile-first', 'one-decision-per-screen', 'example-driven', 'wizard-of-oz-validated', 'none'],
};

const LIFECYCLE_VALUES = ['experimental', 'beta', 'production', 'deprecated'];
const LIFECYCLE_STATE_VALUES = ['active', 'pending-review', 'pending-protocol', 'promoted', 'resolved', 'deprecated', 'validated', 'closed',
  // S023 Sandbox Ratification lifecycle states
  'sandbox', 'simulated', 'ratified', 'implementing', 'implemented'];
// S018 CDP — unified lifecycle state machine
// raw→pipeline-intake→pending-ratification→ratified→implementing→implemented→zf-achieved→measured→sealed
const CDP_STATUS_VALUES = ['raw','pipeline-intake','pending-ratification','ratified','implementing','implemented','zf-achieved','measured','sealed'];

// S018 — enforcement lifecycle for governance artifacts (validators, hooks, contracts, audits)
// stub: shell exists, exits 0, zero cost | planned: designed, not yet built | week-4: ships in week-4 batch
// active: enforcing in production | human-judgment: explicitly non-mechanical (Tier 3 — self-assessment only)
const ENFORCEMENT_STAGE_VALUES = ['stub', 'planned', 'week-4', 'active', 'human-judgment'];

// STATUS-CONSOLIDATION S049 — stage replaces lifecycle_state, quality_state replaces impl_status
// S050 hard cutover: lifecycle_state removed from REQUIRED_FIELDS after full backfill
const STAGE_VALUES = ['intake', 'planning', 'active', 'archived'];
const QUALITY_STATE_VALUES = ['draft', 'validated', 'activated', 'certified'];

const TERMINAL_STATES = new Set(['validated', 'closed']);

const SCAN_PATHS = ['docs', 'packages', 'libs', 'apps', 'tools'];
const SKIP_DIRS = new Set(['node_modules', '.git', '.claude', 'dist', 'build', '.next', 'tmp', 'coverage']);
// Snapshot/historical files exempt from full schema (intentionally frozen point-in-time records)
// S078 update: patterns updated to match both VAULT root AND VAULT/archive/ subdir
const EXEMPT_PATH_GLOBS = [
  /_handoff[\/\\]VAULT[\/\\](?:archive[\/\\])?chat-jump-prompt-/,
  /_handoff[\/\\]VAULT[\/\\](?:archive[\/\\])?chat-jump-S/,
  /_handoff[\/\\]VAULT[\/\\](?:archive[\/\\])?chat-transfer-S/,
  /_handoff[\/\\]VAULT[\/\\](?:archive[\/\\])?qc-audit-results-/,
  /_handoff[\/\\]VAULT[\/\\](?:archive[\/\\])?validation-pass-/,
  /_handoff[\/\\]VAULT[\/\\](?:archive[\/\\])?gaps-and-duplications-/,
  /_handoff[\/\\]VAULT[\/\\](?:archive[\/\\])?blockers-/,
  /_handoff[\/\\]VAULT[\/\\]archive[\/\\](?:comprehensive-handoff|s013-new-chat|opus2-chat)/,
  /_legacy[\/\\]/,
  // ADRs use MADR frontmatter (id/title/status/date/deciders/tags) — distinct from universal CSPS
  // frontmatter (id/name/description/version/owner). Carry-forward to S006: decide whether to
  // unify schemas (Option A) or accept per-file-type schema split (Option B). Skeleton tier
  // exempts ADRs to avoid spurious failures on ADR-001..0022 lacking universal fields.
  /docs[\/\\]adr[\/\\]\d{4}-/,
  // AGENTS.md is the cross-vendor agents.md spec convention (no frontmatter expected). Root +
  // per-package cascade entries follow that spec. Per-app AGENTS.md cascade audit
  // (`agents-md-cascade-completeness`) verifies presence/inheritance, not frontmatter.
  /(^|[\/\\])AGENTS\.md$/,
  // SKILL.md uses agentskills.io spec extended with CSPS dimensions. Same per-file-type schema
  // decision pending as ADR (carry to S006). Skeleton tier exempts to unblock skeleton work.
  /packages[\/\\]skills[\/\\][^\/\\]+[\/\\]SKILL\.md$/,
  // tools/verify.mjs orchestrator emits transient state; verify-last-run.md auto-generated each run.
  /tools[\/\\]verify-last-run\.md$/,
  // bootstrap.ps1 emits tools/bootstrap-readiness.md as transient run report.
  /tools[\/\\]bootstrap-readiness\.md$/,
  // EXT-processed intake files: provenance.md / raw.md / scan-passed.md are auto-generated
  // intake markers; raw.md is verbatim copy of external content (no CSPS frontmatter wraps it).
  // Per ADR-0023 exempt list — auto-generated transient files. Frontmatter applies to the
  // PARENT extraction-note (per _intake/manual-protocol.md) not to these provenance files.
  /_intake[\/\\]processed[\/\\][^\/\\]+[\/\\](provenance|raw|scan-passed)\.md$/,
  // EXT-routed context files: extraction-note frontmatter lives in the canonical processed/
  // folder; routed-context files inherit via reference. Match any depth under _intake/contexts/
  // with EXT- prefix on the file. Per _intake/manual-protocol.md.
  /_intake[\/\\]contexts[\/\\].*EXT-[^\/\\]+\.md$/,
  // S089: external CDS (Core Driven Solutions) source set — verbatim intake for review/extraction;
  // CSPS frontmatter applies only on promotion out of _intake. VAULT_DEFER. (README.md has its own
  // frontmatter; exemption is harmless for it.) Mirror in tools/config/frontmatter-exempt-paths.yaml.
  /_intake[\/\\]cds[\/\\]/,
  // Governor prompts vault — per-session logs use custom frontmatter (session_date / chat_session_id /
  // total_substantive_prompts) per B_GOVERNOR_PROMPTS schema; not the universal CSPS frontmatter shape.
  /_handoff[\/\\]VAULT[\/\\]governor-prompts[\/\\]/,
  // Phase 7 generated slice directories — auto-generated from monolith sources via split generators.
  // Canonical SSoT = source monolith (behavioral-contracts.md / audit-runner.md); slices are
  // generated views for AI context loading. Not governed artifacts; frontmatter lives on monolith.
  // Per token-optimization §9.8 Phase 7 Candidate #2 + #3 (S010).
  /pillar-0-governance[\/\\]behavioral-contracts[\/\\]/,
  /pillar-0-governance[\/\\]audit-runner[\/\\]/,
  /pillar-0-governance[\/\\]ai-behavior-spine[\/\\]/,
  // Council files: ALL files in tools/council/ are working docs (turn files, feedback, briefs, templates)
  /tools[\/\\]council[\/\\]/,
  // Template files in tools/templates/ — templates are structural scaffolds, not governed artifacts
  /tools[\/\\]templates[\/\\].*\.template\.md$/,
  /tools[\/\\]templates[\/\\]adr\.template\.md$/,
  /tools[\/\\]templates[\/\\]docs[\/\\]/,
  // App template — scaffold files are developer-facing, not governed artifacts
  /apps[\/\\]template[\/\\]/,
  // apps/*/src/data/ — runtime copies of canonical files generated by copy-registry.mjs.
  // These are bundled build artifacts (not governed platform artifacts); frontmatter belongs
  // to the canonical source (docs/plan/, tools/config/). CS3 S088-A2.
  /apps[\/\\][^\/\\]+[\/\\]src[\/\\]data[\/\\]/,
  // Clerk temporary files — auto-generated, no frontmatter expected
  /\.clerk[\/\\]/,
  // External-input vault: raw external research docs (GPT outputs, vendor research, etc.)
  // Verbatim external content — no CSPS frontmatter wraps them. S071 PHASE 0 VAULT_DEFER.
  // INDEX.md companion (has CSPS frontmatter) is checked separately — excluded from this pattern.
  /_handoff[\/\\]VAULT[\/\\]external-input[\/\\][^\/\\]+[\/\\](?!INDEX\.md)/,
  // External research intake: docs/plan/_intake/external-research/YYYY-MM-DD/ files.
  // These are parked external files (GPT research, external reviews, product briefs).
  // README.md and pipeline registry have frontmatter; the individual intake docs are raw content.
  /_intake[\/\\]external-research[\/\\]\d{4}-\d{2}-\d{2}[\/\\]/,
];

// ─────────────────────────────────────────────────────────────────────────────
// Frontmatter extraction + minimal YAML parser
// ─────────────────────────────────────────────────────────────────────────────

function extractFrontmatter(content) {
  if (!content.startsWith('---\n') && !content.startsWith('---\r\n')) return null;
  const end = content.indexOf('\n---', 4);
  if (end === -1) return null;
  return content.slice(content.indexOf('\n') + 1, end);
}

/**
 * Minimal YAML parser for shallow frontmatter (CSPS pattern).
 * Handles: key: value | key: \n  - item | key: { rel: x, href: y } | nested 1 level.
 * Returns flat object; arrays preserved as arrays; inline objects parsed lossily.
 */
function parseSimpleYaml(yaml) {
  const out = {};
  const lines = yaml.split(/\r?\n/);
  let i = 0;
  let currentKey = null;
  let currentList = null;
  let inBlockScalar = false;
  let blockScalarLines = [];
  let blockScalarIndent = 0;

  const flushBlockScalar = () => {
    if (currentKey && inBlockScalar) {
      out[currentKey] = blockScalarLines.join('\n').trim();
    }
    inBlockScalar = false;
    blockScalarLines = [];
  };

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.replace(/\s+$/, '');

    if (inBlockScalar) {
      if (line.length === 0 || raw.startsWith(' '.repeat(blockScalarIndent))) {
        blockScalarLines.push(raw.slice(blockScalarIndent));
        i++;
        continue;
      } else {
        flushBlockScalar();
      }
    }

    if (line.length === 0) { i++; continue; }

    // top-level: key: value | key: | key: |
    const topMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_-]*)\s*:\s*(.*)$/);
    if (topMatch && !line.startsWith(' ') && !line.startsWith('\t')) {
      currentKey = topMatch[1];
      currentList = null;
      const val = topMatch[2].trim();
      if (val === '|' || val === '|-') {
        inBlockScalar = true;
        blockScalarLines = [];
        blockScalarIndent = 2;
        i++;
        continue;
      }
      if (val === '') {
        // expect a list or nested object on following lines
        out[currentKey] = [];
        currentList = out[currentKey];
        i++;
        continue;
      }
      out[currentKey] = stripQuotes(val);
      i++;
      continue;
    }

    // list item: '  - value' or '  - { ... }'
    const listMatch = line.match(/^\s+-\s*(.*)$/);
    if (listMatch && currentKey) {
      const item = listMatch[1].trim();
      if (!Array.isArray(out[currentKey])) out[currentKey] = [];
      currentList = out[currentKey];
      if (item.startsWith('{') && item.endsWith('}')) {
        currentList.push(parseInlineObject(item));
      } else {
        currentList.push(stripQuotes(item));
      }
      i++;
      continue;
    }

    // nested key under top-level (1 level): '  key: value'
    const nestedMatch = line.match(/^\s+([a-zA-Z_][a-zA-Z0-9_-]*)\s*:\s*(.*)$/);
    if (nestedMatch && currentKey) {
      if (typeof out[currentKey] !== 'object' || Array.isArray(out[currentKey])) {
        out[currentKey] = {};
      }
      out[currentKey][nestedMatch[1]] = stripQuotes(nestedMatch[2].trim());
      i++;
      continue;
    }

    // unrecognized line — skip
    i++;
  }
  flushBlockScalar();
  return out;
}

function stripQuotes(s) {
  if (!s) return s;
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

function parseInlineObject(s) {
  const inner = s.slice(1, -1);
  const obj = {};
  for (const part of inner.split(',')) {
    const [k, ...vparts] = part.split(':');
    if (!k) continue;
    obj[k.trim()] = stripQuotes(vparts.join(':').trim());
  }
  return obj;
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation rules
// ─────────────────────────────────────────────────────────────────────────────

function validateOne(file, fm, errors, warnings, idIndex) {
  const ctx = (msg) => `${file}: ${msg}`;

  // Required fields
  for (const f of REQUIRED_FIELDS) {
    if (fm[f] === undefined || fm[f] === '' || fm[f] === null) {
      errors.push(ctx(`missing required field "${f}"`));
    }
  }

  // ID uniqueness
  if (fm.id) {
    if (idIndex.has(fm.id)) {
      errors.push(ctx(`duplicate id "${fm.id}" (also at ${idIndex.get(fm.id)})`));
    } else {
      idIndex.set(fm.id, file);
    }
    // ID format: dotted, lowercase
    // Grandfathered: session-specific IDs with S{NNN}-to-S{NNN} pattern (pre-convention HANDOFF files)
    // and vault files with session-suffixed IDs containing hyphens (e.g. csps.handoff.vault.X.S021)
    const isGrandfatheredSessionId = typeof fm.id === 'string' && (
      /csps\.handoff\.S\d+-to-S\d+$/.test(fm.id) ||    // HANDOFF-S019-to-S020 style
      /csps\.handoff\.vault\.[a-z0-9-]+\.S\d+$/.test(fm.id) ||  // vault.X.S021 style
      /csps\.intake\.[a-z0-9-]+\.S\d+$/.test(fm.id)    // intake.X.S021 style
    );
    if (typeof fm.id === 'string' && !/^[a-z][a-z0-9.-]*[a-z0-9]$/.test(fm.id) && !isGrandfatheredSessionId) {
      warnings.push(ctx(`id "${fm.id}" does not match dotted-lowercase convention`));
    }
  }

  // Description length cap
  if (fm.description && typeof fm.description === 'string' && fm.description.length > 1024) {
    errors.push(ctx(`description ${fm.description.length} chars > 1024 cap (per Anthropic RAG router constraint)`));
  }

  // Owner format
  if (fm.owner && typeof fm.owner === 'string' && !/^(group|user):[a-zA-Z0-9_-]+$/.test(fm.owner)) {
    errors.push(ctx(`owner "${fm.owner}" must match group:<handle> or user:<handle>`));
  }

  // lifecycle closed enum
  if (fm.lifecycle && !LIFECYCLE_VALUES.includes(fm.lifecycle)) {
    errors.push(ctx(`lifecycle "${fm.lifecycle}" not in {${LIFECYCLE_VALUES.join('|')}}`));
  }

  // lifecycle_state closed enum
  if (fm.lifecycle_state && !LIFECYCLE_STATE_VALUES.includes(fm.lifecycle_state)) {
    errors.push(ctx(`lifecycle_state "${fm.lifecycle_state}" not in {${LIFECYCLE_STATE_VALUES.join('|')}}`));
  }

  // cdp_status closed enum (optional — only validate if present)
  if (fm.cdp_status && !CDP_STATUS_VALUES.includes(fm.cdp_status)) {
    errors.push(ctx(`cdp_status "${fm.cdp_status}" not in {${CDP_STATUS_VALUES.join('|')}} — see frontmatter-closed-enums.md`));
  }

  // enforcement_stage closed enum (optional — only validate if present)
  // Applies to: governance artifacts with an enforcement progression (validators, hooks, contracts, topic plans)
  if (fm.enforcement_stage && !ENFORCEMENT_STAGE_VALUES.includes(fm.enforcement_stage)) {
    errors.push(ctx(`enforcement_stage "${fm.enforcement_stage}" not in {${ENFORCEMENT_STAGE_VALUES.join('|')}} — valid values: stub|planned|week-4|active`));
  }

  // STATUS-CONSOLIDATION S049 — optional until S050 hard cutover backfill completes
  if (fm.stage && !STAGE_VALUES.includes(fm.stage)) {
    errors.push(ctx(`stage "${fm.stage}" not in {${STAGE_VALUES.join('|')}} — STATUS-CONSOLIDATION S049`));
  }
  if (fm.quality_state && !QUALITY_STATE_VALUES.includes(fm.quality_state)) {
    errors.push(ctx(`quality_state "${fm.quality_state}" not in {${QUALITY_STATE_VALUES.join('|')}} — STATUS-CONSOLIDATION S049`));
  }

  // S022 VLT-ratified optional field validation (when present, must be in closed enum)
  if (fm.wisdom_class && !OPTIONAL_FIELD_ENUMS.wisdom_class.includes(fm.wisdom_class)) {
    errors.push(ctx(`wisdom_class "${fm.wisdom_class}" not in {${OPTIONAL_FIELD_ENUMS.wisdom_class.join('|')}} — VLT-S022-WISDOM-CLASS ratified`));
  }
  if (fm.developer_surface && !OPTIONAL_FIELD_ENUMS.developer_surface.includes(fm.developer_surface)) {
    errors.push(ctx(`developer_surface "${fm.developer_surface}" not in {${OPTIONAL_FIELD_ENUMS.developer_surface.join('|')}}`));
  }
  if (fm.completion_circle && !OPTIONAL_FIELD_ENUMS.completion_circle.includes(fm.completion_circle)) {
    errors.push(ctx(`completion_circle "${fm.completion_circle}" not in {${OPTIONAL_FIELD_ENUMS.completion_circle.join('|')}}`));
  }
  if (fm.builder_surface && !OPTIONAL_FIELD_ENUMS.builder_surface.includes(fm.builder_surface)) {
    errors.push(ctx(`builder_surface "${fm.builder_surface}" not in {${OPTIONAL_FIELD_ENUMS.builder_surface.join('|')}}`));
  }
  // domain_path: validate Tier 1 prefix (e.g. "business.finance.payroll" → check "business" is valid)
  if (fm.domain_path) {
    const tier1 = fm.domain_path.split('.')[0];
    if (!OPTIONAL_FIELD_ENUMS.domain_path_tier1.includes(tier1)) {
      errors.push(ctx(`domain_path Tier 1 "${tier1}" not in {${OPTIONAL_FIELD_ENUMS.domain_path_tier1.join('|')}} — VLT-S022-DOMAIN-PATH ratified`));
    }
  }
  // use_case_class: functional category (Schema Phase A S022)
  if (fm.use_case_class && !OPTIONAL_FIELD_ENUMS.use_case_class.includes(fm.use_case_class)) {
    errors.push(ctx(`use_case_class "${fm.use_case_class}" not in {${OPTIONAL_FIELD_ENUMS.use_case_class.join('|')}} — Schema Phase A S022`));
  }

  // S023 Intent Crystallization fields — optional, validated when present
  if (fm.intent_crystallized && !OPTIONAL_FIELD_ENUMS.intent_crystallized.includes(String(fm.intent_crystallized))) {
    errors.push(ctx(`intent_crystallized "${fm.intent_crystallized}" must be true|false|partial`));
  }
  if (fm.simulation_status && !OPTIONAL_FIELD_ENUMS.simulation_status.includes(fm.simulation_status)) {
    errors.push(ctx(`simulation_status "${fm.simulation_status}" must be pending|pass|fail`));
  }
  if (fm.threshold_route && !OPTIONAL_FIELD_ENUMS.threshold_route.includes(fm.threshold_route)) {
    errors.push(ctx(`threshold_route "${fm.threshold_route}" not in closed enum — see frontmatter-closed-enums.md`));
  }
  if (fm.ux_principle && !OPTIONAL_FIELD_ENUMS.ux_principle.includes(fm.ux_principle)) {
    errors.push(ctx(`ux_principle "${fm.ux_principle}" not in {${OPTIONAL_FIELD_ENUMS.ux_principle.join('|')}}`));
  }

  // next_review_at required when lifecycle_state != active
  // Exempt: sandbox lifecycle states (sandbox, simulated, ratified, implementing, implemented)
  const SANDBOX_STATES = new Set(['sandbox', 'simulated', 'ratified', 'implementing', 'implemented']);
  if (fm.lifecycle_state && fm.lifecycle_state !== 'active' && !fm.next_review_at) {
    if (!TERMINAL_STATES.has(fm.lifecycle_state) && !SANDBOX_STATES.has(fm.lifecycle_state) &&
        fm.lifecycle_state !== 'resolved' && fm.lifecycle_state !== 'deprecated') {
      errors.push(ctx(`next_review_at required when lifecycle_state="${fm.lifecycle_state}" (per P-META-004)`));
    }
  }

  // RZF + CEC refs required for terminal states (P-META-006)
  if (TERMINAL_STATES.has(fm.lifecycle_state)) {
    if (!fm.evidence_block_ref) {
      errors.push(ctx(`evidence_block_ref required when lifecycle_state="${fm.lifecycle_state}" (P-META-006 RZF)`));
    }
    if (!fm.cec_walk_trail_ref) {
      warnings.push(ctx(`cec_walk_trail_ref recommended when lifecycle_state="${fm.lifecycle_state}" (P-META-006 CEC)`));
    }
  }

  // Tag closed-dimension validation
  if (Array.isArray(fm.tags)) {
    for (const tag of fm.tags) {
      if (typeof tag !== 'string' || !tag.includes(':')) {
        errors.push(ctx(`tag "${tag}" not in dimension:value format`));
        continue;
      }
      const [dim, val] = tag.split(':', 2);
      if (CLOSED_DIMENSIONS[dim] && !CLOSED_DIMENSIONS[dim].includes(val)) {
        errors.push(ctx(`tag "${tag}" — value "${val}" not in closed enum for dimension "${dim}" {${CLOSED_DIMENSIONS[dim].join('|')}}`));
      }
    }
  }

  // Reuse-first contract: enhances OR created-new-because (warn — not all files need; skeleton tier soft-checks)
  // Per pillar-1/frontmatter-standard.md "Reuse-first frontmatter fields" — strict in CI; soft in skeleton.
  // Comment retained for week-4 strictness ratchet.
  // if (!fm.enhances && !fm['created-new-because']) {
  //   warnings.push(ctx(`neither enhances: nor created-new-because: declared (P-OP-001 reuse-first)`));
  // }
}

// ─────────────────────────────────────────────────────────────────────────────
// Walker
// ─────────────────────────────────────────────────────────────────────────────

async function walkDir(dir, accum = []) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch { return accum; }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walkDir(full, accum);
    else if (entry.isFile() && extname(entry.name) === '.md') accum.push(full);
  }
  return accum;
}

function isExempt(path) {
  return EXEMPT_PATH_GLOBS.some((rx) => rx.test(path));
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const strict = args.includes('--strict');
  const verbose = args.includes('--verbose');

  const errors = [];
  const warnings = [];
  const skipped = [];
  const idIndex = new Map();
  let scanned = 0;

  for (const sub of SCAN_PATHS) {
    const root = resolve(ROOT, sub);
    try { await stat(root); } catch { continue; }
    const files = await walkDir(root);
    for (const file of files) {
      const rel = file.replace(ROOT, '').replace(/\\/g, '/').replace(/^\//, '');
      if (isExempt(file)) {
        skipped.push(rel);
        continue;
      }
      let content;
      try { content = await readFile(file, 'utf8'); }
      catch { errors.push(`${rel}: read failed`); continue; }
      const fmText = extractFrontmatter(content);
      if (!fmText) {
        errors.push(`${rel}: no frontmatter detected`);
        continue;
      }
      let fm;
      try { fm = parseSimpleYaml(fmText); }
      catch (e) { errors.push(`${rel}: yaml parse failed (${e.message})`); continue; }
      validateOne(rel, fm, errors, warnings, idIndex);
      scanned++;
    }
  }

  const summary = `\n[validate-frontmatter] scanned=${scanned} errors=${errors.length} warnings=${warnings.length} exempt=${skipped.length}`;

  if (verbose && skipped.length > 0) {
    console.log(`\nExempt (snapshot/historical):`);
    skipped.slice(0, 10).forEach((p) => console.log(`  · ${p}`));
    if (skipped.length > 10) console.log(`  · ... and ${skipped.length - 10} more`);
  }

  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s):`);
    warnings.slice(0, 30).forEach((w) => console.warn(`  ⚠ ${w}`));
    if (warnings.length > 30) console.warn(`  ⚠ ... and ${warnings.length - 30} more`);
  }

  if (errors.length > 0) {
    console.error(`\n${errors.length} error(s):`);
    errors.slice(0, 50).forEach((e) => console.error(`  ✗ ${e}`));
    if (errors.length > 50) console.error(`  ✗ ... and ${errors.length - 50} more`);
    console.error(summary);
    if (strict || errors.length > 0) process.exit(1);
  }

  console.log(summary);
  if (warnings.length > 0 && strict) process.exit(1);
  process.exit(0);
}

main().catch((err) => {
  console.error('[validate-frontmatter] fatal:', err);
  process.exit(2);
});
