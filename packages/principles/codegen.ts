/**
 * @csps-id csps.principles.codegen
 * @csps-name principles-codegen
 * @csps-description Codegen pipeline: reads principles.yaml and emits AGENTS.md, hooks, skills, MCP resources, audit checks, ESLint rules. Single source of truth → all downstream artifacts.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-tags type:util domain:governance audience:developer
 * @csps-enforces P-META-001 P-META-003 P-OP-001
 *
 * SKELETON — full implementation lands in week 1 of the build order.
 * Run via `pnpm principles:codegen` (added to root package.json).
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import yaml from "js-yaml";

// ============================================================================
// TYPES
// ============================================================================

interface Enforcer {
  layer: string;
  location: string;
  description: string;
}

interface Principle {
  id: string;                       // P-OP-001, P-ARCH-NNN, P-META-NNN
  name: string;                     // kebab-case
  aliases?: string[];
  category: "meta" | "operating" | "architecture";
  severity: "critical" | "error" | "warn" | "info";
  statement: string;
  counterweight?: string;
  industry_lineage?: string[];
  config?: Record<string, unknown>;
  enforcers?: Enforcer[];
  enforcer_count?: number;
  cross_references?: string[];
  anti_patterns?: string[];
  status?: "active" | "stub" | "deprecated";
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
  categories: { id: string; name: string; description: string }[];
  severity_enforcer_minimums: Record<string, number>;
  enforcer_layers: string[];
  principles: Principle[];
  audit_meta_check: { description: string; algorithm: string };
  change_protocol: string;
  open_questions: string[];
}

// ============================================================================
// LOAD
// ============================================================================

const REGISTRY_PATH = join(__dirname, "principles.yaml");
const REPO_ROOT = join(__dirname, "..", "..");

function loadRegistry(): PrinciplesRegistry {
  const raw = readFileSync(REGISTRY_PATH, "utf-8");
  return yaml.load(raw) as PrinciplesRegistry;
}

// ============================================================================
// VALIDATE (runs before any codegen — fail fast)
// ============================================================================

function validate(reg: PrinciplesRegistry): void {
  // 1. Every principle has the minimum enforcers for its severity
  const min = reg.severity_enforcer_minimums;
  const aiLayers = new Set(["instruction-file", "skill", "ai-prompt-addendum"]);

  for (const p of reg.principles) {
    if (p.status === "stub") continue; // stubs allowed during migration

    const count = p.enforcers?.length ?? 0;
    const required = min[p.severity];
    if (count < required) {
      throw new Error(
        `Principle ${p.id} (${p.name}) has ${count} enforcers, requires ${required} for severity=${p.severity}`,
      );
    }

    // Critical principles need at least 2 non-AI enforcers
    if (p.severity === "critical") {
      const nonAi = p.enforcers!.filter((e) => !aiLayers.has(e.layer)).length;
      if (nonAi < 2) {
        throw new Error(
          `Critical principle ${p.id} has ${nonAi} non-AI enforcers, requires >= 2`,
        );
      }
    }

    // 2. Every enforcer's layer is in the closed enum
    for (const e of p.enforcers ?? []) {
      if (!reg.enforcer_layers.includes(e.layer)) {
        throw new Error(
          `Principle ${p.id} enforcer references unknown layer: ${e.layer}`,
        );
      }
    }
  }

  // 3. Cross-references all resolve
  const allIds = new Set(reg.principles.map((p) => p.id));
  for (const p of reg.principles) {
    for (const ref of p.cross_references ?? []) {
      if (!allIds.has(ref)) {
        throw new Error(`Principle ${p.id} cross-references unknown principle: ${ref}`);
      }
    }
  }
}

// ============================================================================
// CODEGEN — AGENTS.md (root)
// ============================================================================
// Renders the human-friendly AGENTS.md file from the operating principles + nav map.
// AGENTS.md is hand-edited for prose but the principle list section is auto-replaced
// between markers <!-- PRINCIPLES:BEGIN --> and <!-- PRINCIPLES:END -->.

function codegenAgentsMd(reg: PrinciplesRegistry): void {
  // TODO: read existing AGENTS.md, replace section between markers
  // const operating = reg.principles.filter((p) => p.category === "operating");
  // const block = operating.map((p) => `${p.id} — **${p.name}** — ${firstLine(p.statement)}`).join("\n");
  // ...
  console.log("[codegen] AGENTS.md — TODO");
}

// ============================================================================
// CODEGEN — Vale style additions
// ============================================================================

function codegenValeStyles(reg: PrinciplesRegistry): void {
  // For every principle alias, add a Vale rule: "prefer canonical form, flag aliases as substitution"
  // Output: .vale/styles/CSPS/principles.txt
  console.log("[codegen] Vale styles — TODO");
}

// ============================================================================
// CODEGEN — ESLint rules (custom @csps/principles plugin)
// ============================================================================

function codegenEslintRules(reg: PrinciplesRegistry): void {
  // For each principle with eslint-rule layer enforcer, scaffold a stub rule
  // Output: eslint-config-csps/principle-rules/<principle-name>.ts
  console.log("[codegen] ESLint rules — TODO");
}

// ============================================================================
// CODEGEN — Claude Code hooks
// ============================================================================

function codegenHooks(reg: PrinciplesRegistry): void {
  // For each principle with hook layer enforcer, scaffold a stub hook
  // Output: .claude/hooks/<hook-name>.sh
  console.log("[codegen] Hooks — TODO");
}

// ============================================================================
// CODEGEN — Skills (the invokable AI behaviors)
// ============================================================================

function codegenSkills(reg: PrinciplesRegistry): void {
  // For each principle with skill layer enforcer, scaffold/update SKILL.md
  // The SKILL.md frontmatter description references the principle id
  // Output: packages/skills/<name>/SKILL.md
  console.log("[codegen] Skills — TODO");
}

// ============================================================================
// CODEGEN — MCP resources
// ============================================================================

function codegenMcpResources(reg: PrinciplesRegistry): void {
  // Every principle is exposed as an MCP resource at principles://<name>
  // Plus tools: check_artifact, check_reuse
  // Output: packages/principles-mcp/src/resources.generated.ts
  console.log("[codegen] MCP resources — TODO");
}

// ============================================================================
// CODEGEN — Audit check definitions
// ============================================================================

function codegenAuditChecks(reg: PrinciplesRegistry): void {
  // For each principle, write an AuditCheck row (id, slug, category, severity, weight, sla)
  // Output: libs/audits/checks/registered-checks.generated.ts
  console.log("[codegen] Audit checks — TODO");
}

// ============================================================================
// CODEGEN — Human reference (docs/plan/pillar-0-governance/principles.md)
// ============================================================================

function codegenHumanRef(reg: PrinciplesRegistry): void {
  // Render the registry as a navigable markdown document for humans
  // Cross-links to ADRs and rule registry entries
  // Output: docs/plan/pillar-0-governance/principles.generated.md
  console.log("[codegen] Human reference — TODO");
}

// ============================================================================
// MAIN
// ============================================================================

function main(): void {
  console.log("[principles:codegen] Loading registry...");
  const reg = loadRegistry();

  console.log("[principles:codegen] Validating...");
  validate(reg);
  console.log(`[principles:codegen] ✓ ${reg.principles.length} principles validated`);

  console.log("[principles:codegen] Generating downstream artifacts...");
  codegenAgentsMd(reg);
  codegenValeStyles(reg);
  codegenEslintRules(reg);
  codegenHooks(reg);
  codegenSkills(reg);
  codegenMcpResources(reg);
  codegenAuditChecks(reg);
  codegenHumanRef(reg);

  console.log("[principles:codegen] ✓ Done. Commit principles.yaml + all generated files together.");
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error("[principles:codegen] ✗ Failed:", err);
    process.exit(1);
  }
}

export { loadRegistry, validate };
export type { Principle, PrinciplesRegistry };
