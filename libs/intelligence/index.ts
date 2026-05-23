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

import { loadState, saveState } from './cie-state.js';
import { runD1 as peD1 } from './pe.js';
import { runD1 as learningLoopD1 } from './learning-loop.js';
import type { EngineStatus, CIEState } from './cie-state.js';

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
