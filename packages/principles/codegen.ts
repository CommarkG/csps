/**
 * @csps-id csps.principles.codegen
 * @csps-name principles-codegen
 * @csps-description Codegen pipeline: reads principles.yaml and emits manifest.json + downstream artifacts (AGENTS.md sections, hooks, skills, MCP resources, audit checks, ESLint rules). Single source of truth → all downstream artifacts. Per P-META-003.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle experimental
 * @csps-lifecycle-state active
 * @csps-tags type:util domain:governance audience:developer
 * @csps-enforces P-META-001 P-META-003 P-OP-001
 *
 * Skeleton tier: validate() runs full; codegen functions emit manifest.json. Full AGENTS.md / Vale /
 * ESLint / hooks / skills / audit-checks regeneration deferred to week-2-4 per build-order.md.
 *
 * Run via `pnpm --filter @csps/principles codegen` (delegated from root `pnpm principles:codegen`).
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import yaml from 'js-yaml';

// ============================================================================
// TYPES
// ============================================================================

interface Enforcer {
  layer: string;
  location: string;
  description: string;
}

interface Principle {
  id: string;
  name: string;
  aliases?: string[];
  category: 'meta' | 'operating' | 'architecture';
  severity: 'critical' | 'error' | 'warn' | 'info';
  statement: string;
  counterweight?: string;
  industry_lineage?: string[];
  config?: Record<string, unknown>;
  enforcers?: Enforcer[];
  enforcer_count?: number;
  cross_references?: string[];
  anti_patterns?: string[];
  status?: 'active' | 'stub' | 'deprecated';
  migration_target?: string;
  scope_note?: string;
  format_spec?: string;
  escape_hatch?: string;
}

interface PrinciplesRegistry {
  apiVersion: string;
  kind: string;
  version: string;
  generated_at: string;
  owner: string;
  categories: Array<{ id: string; name: string; description: string }>;
  severity_enforcer_minimums: Record<string, number>;
  enforcer_layers: string[];
  principles: Principle[];
  audit_meta_check: { description: string; algorithm: string };
  change_protocol: string;
  open_questions: string[];
}

// ============================================================================
// PATHS (ESM-safe)
// ============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REGISTRY_PATH = join(__dirname, 'principles.yaml');
const REPO_ROOT = join(__dirname, '..', '..');
const DIST_DIR = join(__dirname, 'dist');

// ============================================================================
// LOAD
// ============================================================================

function loadRegistry(): PrinciplesRegistry {
  const raw = readFileSync(REGISTRY_PATH, 'utf-8');
  return yaml.load(raw) as PrinciplesRegistry;
}

// ============================================================================
// VALIDATE — runs before any codegen; fail fast
// ============================================================================

interface ValidationFinding {
  principle_id: string;
  severity_class: string;
  rule: string;
  message: string;
}

interface ValidationResult {
  total: number;
  findings: ValidationFinding[];
  by_rule: Record<string, number>;
}

/**
 * Validate the full registry. Returns ALL findings (does NOT throw on first).
 * Per S005 turn 20 user directive: enumerate all under-enforcement so platform-wide audit
 * surfaces complete picture, not just first-fail. Supports both --validate-only (legacy mode)
 * and the new enumerate-all behavior.
 */
function validateAll(reg: PrinciplesRegistry): ValidationResult {
  const findings: ValidationFinding[] = [];
  const min = reg.severity_enforcer_minimums ?? { critical: 4, error: 3, warn: 2, info: 1 };
  const aiLayers = new Set(['instruction-file', 'skill', 'ai-prompt-addendum']);
  const allIds = new Set(reg.principles.map((p) => p.id));

  for (const p of reg.principles) {
    if (p.status === 'stub') continue;

    const count = p.enforcers?.length ?? 0;
    const required = min[p.severity];

    // Rule 1: enforcer-minimum-per-severity
    if (required !== undefined && count < required) {
      findings.push({
        principle_id: p.id,
        severity_class: p.severity,
        rule: 'enforcer-minimum-per-severity',
        message: `${p.id} (${p.name}) has ${count} enforcers, requires ${required} for severity=${p.severity}`,
      });
    }

    // Rule 2: critical-needs-2-non-ai
    if (p.severity === 'critical' && p.enforcers) {
      const nonAi = p.enforcers.filter((e) => !aiLayers.has(e.layer)).length;
      if (nonAi < 2) {
        findings.push({
          principle_id: p.id,
          severity_class: p.severity,
          rule: 'critical-needs-2-non-ai',
          message: `${p.id} has ${nonAi} non-AI enforcers, requires >= 2 (critical)`,
        });
      }
    }

    // Rule 3: enforcer-layer-in-closed-enum
    if (reg.enforcer_layers && p.enforcers) {
      for (const e of p.enforcers) {
        if (!reg.enforcer_layers.includes(e.layer)) {
          findings.push({
            principle_id: p.id,
            severity_class: p.severity,
            rule: 'enforcer-layer-in-closed-enum',
            message: `${p.id} enforcer references unknown layer: ${e.layer}`,
          });
        }
      }
    }

    // Rule 4: cross-reference-resolves
    for (const ref of p.cross_references ?? []) {
      if (!allIds.has(ref)) {
        findings.push({
          principle_id: p.id,
          severity_class: p.severity,
          rule: 'cross-reference-resolves',
          message: `${p.id} cross-references unknown principle: ${ref}`,
        });
      }
    }
  }

  const by_rule: Record<string, number> = {};
  for (const f of findings) by_rule[f.rule] = (by_rule[f.rule] ?? 0) + 1;

  return { total: findings.length, findings, by_rule };
}

/**
 * Throw-on-first wrapper for backward compat (legacy callers use validate()).
 * For enumerate-all, use validateAll() directly.
 */
function validate(reg: PrinciplesRegistry): void {
  const result = validateAll(reg);
  if (result.total > 0) {
    throw new Error(result.findings[0].message);
  }
}

// ============================================================================
// CODEGEN — manifest.json (always-on; the load-bearing skeleton output)
// ============================================================================

function codegenManifest(reg: PrinciplesRegistry): { path: string; bytes: number } {
  if (!existsSync(DIST_DIR)) mkdirSync(DIST_DIR, { recursive: true });
  const counts = reg.principles.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
  const manifest = {
    apiVersion: reg.apiVersion ?? 'csps.principles/v1',
    kind: 'PrinciplesManifest',
    version: reg.version ?? '0.0.1',
    generated_at: new Date().toISOString(),
    counts: {
      total: reg.principles.length,
      operating: counts['operating'] ?? 0,
      architecture: counts['architecture'] ?? 0,
      meta: counts['meta'] ?? 0,
    },
    ids_by_category: {
      operating: reg.principles.filter((p) => p.category === 'operating').map((p) => p.id),
      architecture: reg.principles.filter((p) => p.category === 'architecture').map((p) => p.id),
      meta: reg.principles.filter((p) => p.category === 'meta').map((p) => p.id),
    },
    enforcer_count_by_principle: Object.fromEntries(
      reg.principles.map((p) => [p.id, p.enforcer_count ?? p.enforcers?.length ?? 0])
    ),
  };
  const out = join(DIST_DIR, 'manifest.json');
  writeFileSync(out, JSON.stringify(manifest, null, 2) + '\n');
  return { path: out, bytes: JSON.stringify(manifest).length };
}

// ============================================================================
// CODEGEN STUBS — week-2/4 implementations
// ============================================================================

function codegenAgentsMd(_reg: PrinciplesRegistry): string {
  return 'TODO week-2: emit AGENTS.md sections between <!-- PRINCIPLES:BEGIN --> markers';
}

function codegenValeStyles(_reg: PrinciplesRegistry): string {
  return 'TODO week-4: emit .vale/styles/CSPS/principles.txt';
}

function codegenEslintRules(_reg: PrinciplesRegistry): string {
  return 'TODO week-4: emit eslint-config-csps/principle-rules/*.ts stubs';
}

function codegenHooks(_reg: PrinciplesRegistry): string {
  return 'TODO week-4: emit .claude/hooks/*.sh stubs';
}

function codegenSkills(_reg: PrinciplesRegistry): string {
  return 'TODO week-3: refresh packages/skills/<name>/SKILL.md frontmatter from yaml';
}

function codegenMcpResources(_reg: PrinciplesRegistry): string {
  return 'TODO week-2: emit packages/principles-mcp/src/resources.generated.ts';
}

function codegenAuditChecks(_reg: PrinciplesRegistry): string {
  return 'TODO week-4: emit libs/audits/checks/registered-checks.generated.ts';
}

// ============================================================================
// MAIN
// ============================================================================

function parseArgs(argv: string[]): { validateOnly: boolean; check: boolean; enumerateAll: boolean } {
  return {
    validateOnly: argv.includes('--validate-only'),
    check: argv.includes('--check'),
    enumerateAll: argv.includes('--enumerate-all'),
  };
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const log = (msg: string) => process.stdout.write(`[principles:codegen] ${msg}\n`);

  log('Loading registry...');
  const reg = loadRegistry();
  log(`Loaded ${reg.principles.length} principles from ${REGISTRY_PATH}`);

  log('Validating...');
  const result = validateAll(reg);
  if (result.total === 0) {
    log(`✓ ${reg.principles.length} principles validated — 0 findings`);
  } else {
    log(`✗ ${reg.principles.length} principles validated — ${result.total} findings`);
    log(`  by_rule: ${JSON.stringify(result.by_rule)}`);
    for (const f of result.findings) {
      log(`  · [${f.rule}] ${f.message}`);
    }
    if (!args.enumerateAll) {
      // Legacy throw-on-first behavior unless --enumerate-all
      throw new Error(result.findings[0].message);
    }
    log(`(--enumerate-all: continuing despite findings; exit code reflects success of enumeration, not validation)`);
  }

  if (args.validateOnly) {
    log('Validate-only mode — exiting.');
    return;
  }

  log('Generating manifest...');
  const { path: manifestPath, bytes } = codegenManifest(reg);
  log(`✓ manifest.json (${bytes} bytes) → ${manifestPath}`);

  log('Downstream codegen stubs (week-2/4):');
  log(`  · AGENTS.md       — ${codegenAgentsMd(reg)}`);
  log(`  · Vale styles     — ${codegenValeStyles(reg)}`);
  log(`  · ESLint rules    — ${codegenEslintRules(reg)}`);
  log(`  · Claude hooks    — ${codegenHooks(reg)}`);
  log(`  · Skills          — ${codegenSkills(reg)}`);
  log(`  · MCP resources   — ${codegenMcpResources(reg)}`);
  log(`  · Audit checks    — ${codegenAuditChecks(reg)}`);

  if (args.check) {
    log('Check mode — would diff committed manifest against generated; exits 1 on drift (week-2 ratchet).');
  }

  log('✓ Done. Commit principles.yaml + dist/manifest.json together.');
}

// ESM entry-point detection (cross-platform; handles Windows drive letters via pathToFileURL)
const isMain = (() => {
  try {
    const argv1 = process.argv[1];
    if (!argv1) return false;
    return import.meta.url === pathToFileURL(argv1).href;
  } catch {
    return false;
  }
})();

if (isMain) {
  try {
    main();
  } catch (err) {
    process.stderr.write(`[principles:codegen] ✗ ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  }
}

export { loadRegistry, validate, validateAll, codegenManifest };
export type { Principle, PrinciplesRegistry, Enforcer, ValidationFinding, ValidationResult };
