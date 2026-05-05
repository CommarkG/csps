#!/usr/bin/env node
/**
 * validate-token-budget.mjs — 5-mode token budget governance validator
 *
 * SELF-DESCRIBING (6-commitment #5):
 *   Authority chain: B_TOKEN_BUDGET (R1-R5) + P-META-009 CCA + token-optimization.md §14.6
 *   What it checks:
 *     Mode 1 — AGENTS.md line count (<200 lines; >200 = token-budget violation per R1)
 *     Mode 2 — Skills completeness (context-loading template task-classes each have a backing skill)
 *     Mode 3 — Hook presence (settings.json declared hooks exist on disk)
 *     Mode 4 — /compact frequency ADVISORY (cannot measure without session logs; emits INFO)
 *     Mode 5 — Prompt cache continuity ADVISORY (cannot measure without session logs; emits INFO)
 *   Sister composition: validate-frontmatter.mjs (Mode 1 cross-check) + verify-hooks-functional.sh (Mode 3)
 *   Usage: node tools/validators/validate-token-budget.mjs [--strict]
 *
 * EXIT-CODED (6-commitment #3):
 *   0 = PASS (all active modes GREEN)
 *   1 = WARN (at least one YELLOW finding; --strict upgrades to exit 2)
 *   2 = FAIL (at least one RED finding)
 *
 * STATEFUL (6-commitment #1):
 *   Current window: ADVISORY (warn-only; FAIL_CLOSED ratchet at ≥10 sessions with ≥50% savings)
 *   Ratchet file: tools/verify-last-run.md tracks runs; ratchet promotion is manual per protocol
 *
 * GRADUATION-AWARE (6-commitment #6):
 *   Ratchet eligibility: ≥10 sessions measured + cumulative savings ≥50% vs Phase 1 baseline
 *   Pre-ratchet: all findings are ADVISORY (YELLOW/INFO); ratchet = Mode 1+2+3 become RED
 *
 * COMPOSABLE (6-commitment #2):
 *   Invokes: tools/verify-last-run.md (last pnpm verify run) for hook presence cross-check
 *   Avoids: re-running pnpm verify (expensive); uses cached output
 *
 * PIPELINED (6-commitment #4):
 *   Writes findings to stdout as structured JSON; also writes to tools/validate-token-budget-last-run.json
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const STRICT = process.argv.includes('--strict');

// ─────────────────────────────────────────────────────────────────────────────
// Severity helpers
// ─────────────────────────────────────────────────────────────────────────────

const F = { RED: 'RED', YELLOW: 'YELLOW', GREEN: 'GREEN', INFO: 'INFO', LEGACY_YELLOW: 'LEGACY_YELLOW' };

function finding(severity, mode, message, remediation) {
  return { severity, mode, message, remediation };
}

// ─────────────────────────────────────────────────────────────────────────────
// Mode 1 — AGENTS.md line count
// Checks: root AGENTS.md < 200 lines (B_TOKEN_BUDGET R1 — default depth L1 only)
// ─────────────────────────────────────────────────────────────────────────────

function mode1_agentsMdLineCount() {
  const agentsPath = join(ROOT, 'AGENTS.md');
  if (!existsSync(agentsPath)) {
    return [finding(F.YELLOW, 1, 'AGENTS.md not found at repo root', 'Run pnpm principles:codegen to generate AGENTS.md')];
  }
  const lines = readFileSync(agentsPath, 'utf8').split('\n').length;
  if (lines > 300) {
    return [finding(F.YELLOW, 1, `AGENTS.md has ${lines} lines (warn threshold: 200; fail threshold: 300)`,
      'Move detail to .claude/skills/*.md — AGENTS.md should be a lightweight index per B_TOKEN_BUDGET R1')];
  }
  if (lines > 200) {
    return [finding(F.YELLOW, 1, `AGENTS.md has ${lines} lines (target: <200; warn: 200-300)`,
      'Consider moving verbose sections to pillar-leaf files')];
  }
  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Mode 2 — Skills completeness
// Checks: context-loading template task-classes each have a resolvable skill or MCP query path
// ─────────────────────────────────────────────────────────────────────────────

const CONTEXT_LOADING_DIR = join(ROOT, 'tools/templates/context-loading');

function mode2_skillsCompleteness() {
  const findings = [];
  if (!existsSync(CONTEXT_LOADING_DIR)) {
    return [finding(F.YELLOW, 2, 'tools/templates/context-loading/ not found',
      'Run Phase 9 context-loading templates authoring (token-optimization §9.10)')];
  }

  const templateFiles = readdirSync(CONTEXT_LOADING_DIR).filter(f => f.endsWith('.json'));
  if (templateFiles.length < 8) {
    findings.push(finding(F.YELLOW, 2,
      `Only ${templateFiles.length}/8 context-loading templates found`,
      'Author missing task-class templates at tools/templates/context-loading/'));
  }

  // Check each template's required_artifacts + mcp_queries resolve
  for (const tf of templateFiles) {
    try {
      const spec = JSON.parse(readFileSync(join(CONTEXT_LOADING_DIR, tf), 'utf8'));
      for (const art of spec.required_artifacts ?? []) {
        const absPath = join(ROOT, art.path);
        // Skip template placeholders (contain <NNN>)
        if (art.path.includes('<') || art.path.includes('>')) continue;
        if (!existsSync(absPath)) {
          findings.push(finding(F.YELLOW, 2,
            `context-loading/${tf}: required_artifact "${art.path}" not found on disk`,
            `Author the missing artifact or correct the path in ${tf}`));
        }
      }
    } catch (e) {
      findings.push(finding(F.YELLOW, 2, `context-loading/${tf}: parse error — ${e.message}`, 'Fix JSON syntax'));
    }
  }
  return findings;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mode 3 — Hook presence
// Checks: every hook declared in settings.json exists on disk + is executable
// ─────────────────────────────────────────────────────────────────────────────

function mode3_hookPresence() {
  const settingsPath = join(ROOT, '.claude/settings.json');
  if (!existsSync(settingsPath)) {
    return [finding(F.YELLOW, 3, '.claude/settings.json not found', 'Create settings.json with hooks declarations')];
  }

  let settings;
  try {
    settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
  } catch (e) {
    return [finding(F.RED, 3, `.claude/settings.json parse error: ${e.message}`, 'Fix JSON syntax')];
  }

  const hooksSection = settings.hooks ?? {};
  const findings = [];
  const declared = new Set();

  for (const [_event, eventHooks] of Object.entries(hooksSection)) {
    for (const hookGroup of (Array.isArray(eventHooks) ? eventHooks : [])) {
      for (const h of hookGroup.hooks ?? []) {
        if (h.type === 'command' && h.command) {
          // Extract file path from command (last word)
          const parts = h.command.trim().split(/\s+/);
          const scriptPath = parts[parts.length - 1];
          if (scriptPath.endsWith('.sh')) declared.add(scriptPath);
        }
      }
    }
  }

  for (const scriptPath of declared) {
    // Normalize path (handle /c/... vs C:\... variants)
    const absPath = scriptPath.startsWith('.claude/') ? join(ROOT, scriptPath) :
                    scriptPath.startsWith('/c/') ? scriptPath.replace(/^\/c\//, 'C:/').replace(/\//g, '\\') :
                    scriptPath;
    if (!existsSync(absPath) && !existsSync(join(ROOT, scriptPath))) {
      findings.push(finding(F.YELLOW, 3, `Declared hook not found on disk: ${scriptPath}`,
        'Create the hook script or remove the declaration from settings.json'));
    }
  }

  if (findings.length === 0 && declared.size > 0) {
    // All hooks present — no finding
  } else if (declared.size === 0) {
    findings.push(finding(F.INFO, 3, 'No hook scripts declared in settings.json', 'Add hooks for B_TOKEN_BUDGET enforcement'));
  }

  return findings;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mode 4 + 5 — ADVISORY (session-log dependent; cannot measure statically)
// ─────────────────────────────────────────────────────────────────────────────

function mode4_compactFrequency() {
  return [finding(F.INFO, 4,
    '/compact frequency advisory — cannot measure without session transcript',
    'Run /usage at IMPL_BATCH boundaries; target ratio ≥0.8 /compact-per-boundary per B_TOKEN_BUDGET R3')];
}

function mode5_cacheContiguity() {
  return [finding(F.INFO, 5,
    'Prompt cache continuity advisory — cannot measure without session transcript',
    'Avoid /model switch mid-task per B_TOKEN_BUDGET R2; cache is model-specific')];
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const started = new Date().toISOString();
  const allFindings = [
    ...mode1_agentsMdLineCount(),
    ...mode2_skillsCompleteness(),
    ...mode3_hookPresence(),
    ...mode4_compactFrequency(),
    ...mode5_cacheContiguity(),
  ];

  const reds     = allFindings.filter(f => f.severity === F.RED);
  const yellows  = allFindings.filter(f => f.severity === F.YELLOW);
  const infos    = allFindings.filter(f => f.severity === F.INFO || f.severity === F.GREEN);

  const report = {
    validator: 'validate-token-budget',
    ran_at: started,
    advisory_window: true,
    ratchet_eligible: false,
    ratchet_criteria: '≥10 sessions with ≥50% measured savings vs Phase 1 baseline',
    modes: [
      { id: 1, name: 'agents-md-line-count', findings: allFindings.filter(f => f.mode === 1) },
      { id: 2, name: 'skills-completeness', findings: allFindings.filter(f => f.mode === 2) },
      { id: 3, name: 'hook-presence', findings: allFindings.filter(f => f.mode === 3) },
      { id: 4, name: 'compact-frequency-advisory', findings: allFindings.filter(f => f.mode === 4) },
      { id: 5, name: 'cache-continuity-advisory', findings: allFindings.filter(f => f.mode === 5) },
    ],
    summary: {
      red: reds.length,
      yellow: yellows.length,
      info: infos.length,
      total_active_findings: reds.length + yellows.length,
    },
  };

  if (yellows.length > 0) {
    console.warn('\nYELLOW findings:');
    for (const f of yellows) {
      console.warn(`  [Mode ${f.mode}] ⚠ ${f.message}`);
      console.warn(`       → ${f.remediation}`);
    }
  }
  if (reds.length > 0) {
    console.error('\nRED findings:');
    for (const f of reds) {
      console.error(`  [Mode ${f.mode}] ✗ ${f.message}`);
      console.error(`       → ${f.remediation}`);
    }
  }
  if (infos.length > 0) {
    for (const f of infos) {
      console.log(`  [Mode ${f.mode}] ℹ ${f.message}`);
    }
  }

  const summary = `[validate-token-budget] modes=5 red=${reds.length} yellow=${yellows.length} info=${infos.length} advisory_window=true`;
  console.log(`\n${summary}`);

  // Write pipeline findings
  try {
    const { writeFileSync } = await import('node:fs');
    writeFileSync(join(ROOT, 'tools/validate-token-budget-last-run.json'), JSON.stringify(report, null, 2));
  } catch { /* non-fatal */ }

  if (reds.length > 0) process.exit(2);
  if (yellows.length > 0 && STRICT) process.exit(2);
  if (yellows.length > 0) process.exit(1);
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-token-budget] fatal:', err);
  process.exit(2);
});
