#!/usr/bin/env node
/**
 * @csps-id csps.scripts.cie-pe-adapter
 * @csps-name cie-pe-adapter
 * @csps-description Thin server-callable adapter for CIE/PE signals.
 *   B1 R3.3 fix: pe-compute.mjs + cie-pe-trigger-audit.mjs have no exports;
 *   this adapter provides server-callable functions for the core-spine engine API routes.
 *   Captures spine creation events for CIE (improvement pipeline) and assigns initial
 *   PE scores. Non-destructive: writes advisory entries to data files only.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces PROTO-S073-B1-ENGINE-WIRING
 * closure_owner: group:finky
 * closure_decision: "Promoted to full CIE/PE integration when B2/B3 ships the OBSERVE pipeline"
 * closure_by: "B2 realtime-save + ANTI-FLOAT integration"
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();

/**
 * captureSpineCreation — CIE surface: record spine creation event for improvement pipeline.
 * Appends to tools/data/cie-pe-last-run.json as an advisory observation.
 * @param {{ spineId: string, classification: object, intent: string }} params
 * @returns {{ captured: boolean, timestamp: string }}
 */
export function captureSpineCreation({ spineId, classification, intent }) {
  const timestamp = new Date().toISOString();
  const entry = {
    event: 'spine_created',
    spineId,
    classification,
    intent,
    timestamp,
    source: 'core-spine-engine-B1',
    note: 'CIE advisory — escalate to OBSERVE pipeline in B2/B3',
  };

  try {
    const path = join(ROOT, 'tools/data/cie-pe-last-run.json');
    let data = {};
    if (existsSync(path)) {
      try { data = JSON.parse(readFileSync(path, 'utf-8')); } catch { /* corrupt — reset */ }
    }
    if (!Array.isArray(data.spine_creation_events)) data.spine_creation_events = [];
    data.spine_creation_events.push(entry);
    data.last_spine_created = timestamp;
    writeFileSync(path, JSON.stringify(data, null, 2));
    return { captured: true, timestamp };
  } catch {
    return { captured: false, timestamp };
  }
}

/**
 * computeInitialPE — PE surface: assign initial priority score to a new spine entry.
 * Returns a PE score + rationale for the new spine based on urgency + impact.
 * @param {{ urgency: string, impact: string, spineId: string }} params
 * @returns {{ pe_score: number, rationale: string }}
 */
export function computeInitialPE({ urgency = 'medium', impact = 'platform-wide', spineId }) {
  // Simplified PE formula (tunable per P-META-028) — full PE computation in B3
  const urgencyScore = urgency === 'high' ? 3 : urgency === 'medium' ? 2 : 1;
  const impactScore = impact === 'platform-wide' ? 3 : impact === 'multi-app' ? 2 : 1;
  const spiEstimate = 2; // sample: B1 stub entries require ~2 sessions to complete
  const pe_score = Math.round((urgencyScore * impactScore) / spiEstimate * 10) / 10;

  return {
    pe_score,
    rationale: `urgency:${urgency}(${urgencyScore}) × impact:${impact}(${impactScore}) / spi:${spiEstimate} = ${pe_score} (initial stub — refine in B3)`,
    note: 'Promote to full PE agent scoring when ACCOUNTABILITY-HUB-PLAN is ratified',
  };
}
