/**
 * @csps-id csps.libs.intelligence
 * @csps-name intelligence
 * @csps-description Central Intelligence Engine (CIE) — aggregates all sub-engine statuses.
 * D1 always active: lightweight scan returns EngineStatus[] for every sub-engine.
 * Phase 1: PE + Learning Loop built. Scope Router, Seeds Monitor, Docs Engine = stubs.
 * Design: docs/SIA/R2-01-PLATFORM-INTELLIGENCE-ENGINE.md
 * Plan item: COMBINATORIAL-ENGINE | S056 | Layer 2 R2
 * @csps-version 0.1.0
 * @csps-owner group:finky
 * @csps-lifecycle experimental
 * @csps-lifecycle-state active
 * @csps-tags type:library domain:intelligence audience:platform
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadState, saveState } from './cie-state.js';
import { runD1 as peD1, getTopItems } from './pe.js';
import { runD1 as learningLoopD1 } from './learning-loop.js';
import type { EngineStatus, CIEState } from './cie-state.js';

const __dirname_cie = dirname(fileURLToPath(import.meta.url));
const ROOT_CIE = resolve(__dirname_cie, '../..');

export { loadState, saveState } from './cie-state.js';
export { scanGapRegister, scanImprovementRegister, writeSessionSummary, appendToPendingItems, runD1 as runLearningLoop } from './learning-loop.js';
export { getTopItems, checkReadinessGate, runD1 as runPE } from './pe.js';
export type { EngineStatus, CIEState } from './cie-state.js';
export type { GapFinding, ImprovementFinding, LearningLoopOutput } from './learning-loop.js';
export type { PEItem } from './pe.js';

/** Phase 1 stubs for sub-engines not yet fully implemented */
function stubEngine(engine_id: string): EngineStatus {
  return { engine_id, d_level: 1, alert: false, last_run: new Date().toISOString() };
}

/**
 * Run all sub-engines at D1 and return aggregated status.
 * Saves state to .csps/intelligence/cie-state.yaml.
 */
export function getCIEStatus(session: string): EngineStatus[] {
  const statuses: EngineStatus[] = [
    peD1(session),
    learningLoopD1(session),
    stubEngine('scope-router'),    // Phase 2
    stubEngine('seeds-monitor'),   // Phase 2
    stubEngine('docs-engine'),     // Phase 2
  ];

  const state: CIEState = {
    session,
    updated_at: new Date().toISOString(),
    engines: statuses,
  };
  saveState(state);

  return statuses;
}

// ── TASK 1: getCompletionSnapshot() ────────────────────────────────────────────

export interface CompletionSnapshot {
  validators: number;
  openGaps: number;
  donePlanItems: number;
  coreLayersComplete: number;
  timestamp: string;
}

/**
 * Read local YAML/MD files and return a CompletionSnapshot.
 * Reads local files only — no GitHub API. Use the playground GitHub fetch as fallback
 * on Vercel where local monorepo files are unavailable.
 * Graceful fallback if any file is missing.
 */
export function getCompletionSnapshot(): CompletionSnapshot {
  let validators = 157;
  let openGaps = 0;
  let donePlanItems = 36;

  try {
    const verifyPath = join(ROOT_CIE, 'tools/verify-last-run.md');
    if (existsSync(verifyPath)) {
      const verifyRaw = readFileSync(verifyPath, 'utf-8');
      const m = verifyRaw.match(/"validators_checked":\s*(\d+)/);
      if (m) validators = parseInt(m[1]);
    }
  } catch { /* file unavailable — use fallback */ }

  try {
    const gapPath = join(ROOT_CIE, 'tools/data/gap-recurrence-register.yaml');
    if (existsSync(gapPath)) {
      const gapRaw = readFileSync(gapPath, 'utf-8');
      openGaps = (gapRaw.match(/status:\s*open/g) ?? []).length;
    }
  } catch { /* file unavailable — use fallback */ }

  try {
    const planPath = join(ROOT_CIE, 'tools/config/unified-plan.yaml');
    if (existsSync(planPath)) {
      const planRaw = readFileSync(planPath, 'utf-8');
      donePlanItems = (planRaw.match(/^\s{4}status:\s*done\s*$/gm) ?? []).length;
    }
  } catch { /* file unavailable — use fallback */ }

  return {
    validators,
    openGaps,
    donePlanItems,
    coreLayersComplete: 4, // stable — all 4 layers complete S058
    timestamp: new Date().toISOString(),
  };
}

// ── Threshold patterns — PROTO-THRESHOLD-2 (S060) ──────────────────────────────

export interface ThresholdPatterns {
  dominant_type: string;
  dominant_vault: string;
  swift_count: number;
  total_classified: number;
}

/**
 * Read .csps/threshold/intake-log.yaml and return aggregated patterns.
 * Filters to the current session if provided; falls back to last 20 entries.
 * Always returns a valid ThresholdPatterns (never throws).
 */
export function readThresholdPatterns(session?: string): ThresholdPatterns {
  const fallback: ThresholdPatterns = {
    dominant_type: 'unknown',
    dominant_vault: 'pending',
    swift_count: 0,
    total_classified: 0,
  };

  try {
    const logPath = join(ROOT_CIE, '.csps/threshold/intake-log.yaml');
    if (!existsSync(logPath)) return fallback;

    const raw = readFileSync(logPath, 'utf-8');

    // Extract entries matching session (or last 20 if no session given)
    const entryBlocks = raw.split(/\n- id:/).slice(1); // split on entry boundaries
    const relevant = session
      ? entryBlocks.filter(b => b.includes(`session: ${session}`) || b.includes(`session: "${session}"`))
      : entryBlocks.slice(-20);

    if (relevant.length === 0) return { ...fallback, total_classified: entryBlocks.length };

    // Count type frequencies
    const typeCounts: Record<string, number> = {};
    const vaultCounts: Record<string, number> = {};
    let swiftCount = 0;

    for (const block of relevant) {
      const typeMatch = block.match(/\n  type:\s*(\S+)/);
      const vaultMatch = block.match(/\n  vault_type:\s*(\S+)/);
      const swiftMatch = block.match(/\n  swift_eligible:\s*(true)/);

      if (typeMatch) {
        const t = typeMatch[1].replace(/['"]/g, '');
        typeCounts[t] = (typeCounts[t] ?? 0) + 1;
      }
      if (vaultMatch) {
        const v = vaultMatch[1].replace(/['"]/g, '');
        vaultCounts[v] = (vaultCounts[v] ?? 0) + 1;
      }
      if (swiftMatch) swiftCount++;
    }

    const dominant_type = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'governor_directive';
    const dominant_vault = Object.entries(vaultCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'pending';

    return {
      dominant_type,
      dominant_vault,
      swift_count: swiftCount,
      total_classified: relevant.length,
    };
  } catch {
    return fallback;
  }
}

// ── TASK 2: getSessionStatus() ─────────────────────────────────────────────────

export interface SessionStatus {
  currentSession: string;
  pendingItems: number;
  topPEItems: Array<{ id: string; pe: number; status: string }>;
  holdingFor: string | null; // what Sonnet is waiting for
  threshold_patterns?: ThresholdPatterns; // PROTO-THRESHOLD-2 (S060)
}

/**
 * Read session-state.json + unified-plan.yaml + sonnet-turn.md
 * to produce a structured SessionStatus for Opus's D1 briefing.
 * Graceful fallback for any missing file.
 */
export function getSessionStatus(): SessionStatus {
  let currentSession = 'S059';
  let pendingItems = 0;
  const topPEItems: Array<{ id: string; pe: number; status: string }> = [];
  let holdingFor: string | null = null;

  try {
    const statePath = join(ROOT_CIE, 'tools/session-state.json');
    if (existsSync(statePath)) {
      const d = JSON.parse(readFileSync(statePath, 'utf-8'));
      currentSession = d.current_session || currentSession;
    }
  } catch { /* use fallback */ }

  try {
    const pendingPath = join(ROOT_CIE, 'tools/data/pending-plan-items.yaml');
    if (existsSync(pendingPath)) {
      const raw = readFileSync(pendingPath, 'utf-8');
      pendingItems = (raw.match(/^- id:/gm) ?? []).length;
    }
  } catch { /* use fallback */ }

  try {
    // Get top PE items from PE sub-engine
    const peItems = getTopItems(5);
    for (const item of peItems) {
      topPEItems.push({ id: item.id, pe: item.pe_score, status: item.status });
    }
  } catch { /* PE unavailable */ }

  try {
    // Check sonnet-turn.md first line for HOLDING state
    const turnPath = join(ROOT_CIE, 'tools/council/sonnet-turn.md');
    if (existsSync(turnPath)) {
      const firstLines = readFileSync(turnPath, 'utf-8').split('\n').slice(0, 10).join('\n');
      const holdMatch = firstLines.match(/HOLDING.*?(?:AWAITING|HOLD).*?([^\n.]+)/i);
      if (holdMatch) holdingFor = holdMatch[1].trim().slice(0, 80);
    }
  } catch { /* use fallback */ }

  // Threshold patterns — PROTO-THRESHOLD-2
  let threshold_patterns: ThresholdPatterns | undefined;
  try {
    threshold_patterns = readThresholdPatterns(currentSession);
  } catch { /* unavailable */ }

  return { currentSession, pendingItems, topPEItems, holdingFor, threshold_patterns };
}
