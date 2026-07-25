#!/usr/bin/env node
/**
 * @csps-id csps.tools.scripts.graphify-wrapper
 * @csps-name graphify-wrapper
 * CSPS-owned wrapper around the Graphify CLI. NEVER call `graphify` bare — always through here.
 *
 * Why this file exists (DNA-Guardian guardrail, tools/data/external-capability-alignment.yaml
 * id=graphify): --code-only must be STRUCTURAL, not operator discipline. A bare `graphify extract`
 * call can silently drop the flag and re-import Graphify's default network/LLM behavior. This
 * wrapper hardcodes --code-only and forbids every wall-breach subcommand (install/hook install/
 * --mcp/serve) so there is exactly one call site to audit.
 *
 * Resolution order for the graphify binary (first match wins):
 *   1. GRAPHIFY_BIN env var (explicit override)
 *   2. Isolated venv at ~/.tools/graphify-venv (created per S089 activation-proof session)
 *   3. `graphify` on PATH (uv tool install / pipx shim)
 * If none resolve, exits 0 with a warning (non-blocking) — the app-deploy-readiness validator
 * is what actually enforces presence of the resulting graph, not this wrapper.
 *
 * Usage: node tools/scripts/graphify-wrapper.mjs extract <path>
 *        node tools/scripts/graphify-wrapper.mjs query "<question>"
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir, platform } from 'node:os';
import { spawnSync } from 'node:child_process';

const FORBIDDEN_SUBCOMMANDS = new Set([
  'install', 'uninstall', 'hook', 'claude', 'codebuddy', 'codex', 'opencode', 'kilo',
  'aider', 'copilot', 'vscode', 'claw', 'droid', 'trae', 'trae-cn', 'antigravity',
  'hermes', 'kiro', 'pi', 'devin', 'gemini', 'cursor', 'watch', 'global',
]);

function resolveGraphifyBin() {
  if (process.env.GRAPHIFY_BIN && existsSync(process.env.GRAPHIFY_BIN)) {
    return process.env.GRAPHIFY_BIN;
  }
  const isWin = platform() === 'win32';
  const venvBin = join(homedir(), '.tools', 'graphify-venv', isWin ? 'Scripts' : 'bin', isWin ? 'graphify.exe' : 'graphify');
  if (existsSync(venvBin)) return venvBin;
  return 'graphify'; // fall back to PATH
}

const argv = process.argv.slice(2);
const subcommand = argv[0];

if (!subcommand) {
  console.error('[graphify-wrapper] Usage: node tools/scripts/graphify-wrapper.mjs <extract|query|explain|god-nodes|...> [args]');
  process.exit(1);
}

if (FORBIDDEN_SUBCOMMANDS.has(subcommand)) {
  console.error(`[graphify-wrapper] REFUSED: "${subcommand}" is a wall-breach subcommand (writes to CLAUDE.md/AGENTS.md, installs git hooks, or is a QUARANTINE-class integration). Never invoked through this wrapper.`);
  console.error('[graphify-wrapper] See: tools/data/external-capability-alignment.yaml id=graphify forbidden_use');
  process.exit(1);
}

const bin = resolveGraphifyBin();

const finalArgs = [...argv];
if (subcommand === 'extract' && !finalArgs.includes('--code-only')) {
  finalArgs.push('--code-only'); // structural — never operator-discretionary
}

const result = spawnSync(bin, finalArgs, { stdio: 'inherit' });

if (result.error) {
  console.warn(`[graphify-wrapper] graphify not runnable (${result.error.code || result.error.message}) — skipping, non-blocking.`);
  console.warn('[graphify-wrapper] Install: python -m venv ~/.tools/graphify-venv && ~/.tools/graphify-venv/Scripts/pip install graphifyy==0.9.26 (pin exact version)');
  process.exit(0);
}

process.exit(result.status ?? 0);
