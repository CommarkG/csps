#!/usr/bin/env node
/**
 * significance-view.mjs
 * @csps-id csps.tools.scripts.significance-view
 * @csps-name significance-view
 * @csps-description READ-ONLY significance view over existing registers.
 *   Computes significance scores from gap-recurrence-register + improvement-register
 *   and surfaces top-N items. The MINIMUM VIABLE first move of the significance engine.
 *   Per sandbox-before-implementation: READ ONLY. No writes. No crystallization logic.
 *   Earn expansion by proving value (Scenario A/B/C confirmed in sandbox spec).
 *
 *   Scoring: Score = (k_count × 2) + (recency_weight × 1.5) - (sessions_since_touch × 0.5)
 *   Items must EARN visibility via recurrence, not assignment.
 *
 *   Source: SIGNIFICANCE-ENGINE-SANDBOX-S075.md + PROTO-S075-GO-OVER-WHAT-EXISTS WS2.
 * @csps-version 0.1.0  (sandbox — earn expansion before expanding)
 * @csps-owner group:finky
 * @csps-lifecycle sandbox
 * @csps-lifecycle-state draft
 * @csps-tags type:script domain:governance audience:ai-agent
 * @csps-enforces P-META-029 D12-assumed-coverage
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import yaml from 'js-yaml';

const ROOT = resolve(process.cwd());

const GAP_REGISTER = join(ROOT, 'tools/data/gap-recurrence-register.yaml');
const IMPROVE_REGISTER = join(ROOT, 'tools/data/improvement-register.yaml');
const SESSION_STATE = join(ROOT, 'tools/session-state.json');

// ── Get current session number ────────────────────────────────────────────────
function getCurrentSession() {
  try {
    const s = JSON.parse(readFileSync(SESSION_STATE, 'utf8'));
    return parseInt((s.current_session || 'S074').replace('S', ''), 10);
  } catch { return 74; }
}

// ── Parse session number from string ─────────────────────────────────────────
function parseSession(s) {
  if (!s) return 0;
  const m = String(s).match(/S?(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

// ── Compute significance score ────────────────────────────────────────────────
function computeScore(kCount, sessions, currentSession) {
  const sessionNums = Array.isArray(sessions)
    ? sessions.map(s => parseSession(s)).filter(n => n > 0)
    : [];
  const lastSession = sessionNums.length > 0 ? Math.max(...sessionNums) : 0;
  const sessionsSinceLast = lastSession > 0 ? currentSession - lastSession : 20;

  // recency weight: higher if recently touched
  const recencyWeight = Math.max(0, 10 - sessionsSinceLast) * 0.15;
  // neglect decay
  const neglectDecay = Math.min(5, sessionsSinceLast * 0.3);

  return (kCount * 2) + (recencyWeight * 1.5) - neglectDecay;
}

// ── Load gap-recurrence items ─────────────────────────────────────────────────
function loadGapItems(currentSession) {
  if (!existsSync(GAP_REGISTER)) return [];
  try {
    const raw = readFileSync(GAP_REGISTER, 'utf8');
    // Strip markdown header (> lines) before YAML entries
    const entries = raw.split('\n').filter(l => !l.startsWith('>') && !l.startsWith('#')).join('\n');
    // Find entries section
    const entriesMatch = entries.match(/^entries:\s*\n([\s\S]+)$/m);
    if (!entriesMatch) return [];
    const entriesYaml = 'entries:\n' + entriesMatch[1];
    const parsed = yaml.load(entriesYaml);
    return (parsed.entries || []).map(e => ({
      id: e.id,
      thing: e.observation || e.id,
      k_count: e.k_count || 1,
      sessions: e.sessions || [],
      status: e.status || 'open',
      source: 'gap-recurrence',
      score: computeScore(e.k_count || 1, e.sessions || [], currentSession),
    })).filter(e => e.status !== 'resolved');
  } catch { return []; }
}

// ── Load improvement-register items ─────────────────────────────────────────
function loadImprovementItems(currentSession) {
  if (!existsSync(IMPROVE_REGISTER)) return [];
  try {
    const raw = readFileSync(IMPROVE_REGISTER, 'utf8');
    const parsed = yaml.load(raw.split('\n').filter(l => !l.startsWith('>')).join('\n'));
    return ((parsed && parsed.entries) || []).slice(0, 50).map(e => ({
      id: e.id || '?',
      thing: e.title || e.id,
      k_count: e.k_count || 1,
      sessions: e.sessions || [e.first_found].filter(Boolean),
      status: e.status || 'open',
      source: 'improvement-register',
      score: computeScore(e.k_count || 1, e.sessions || [], currentSession),
    })).filter(e => !['done', 'resolved', 'archived'].includes(e.status));
  } catch { return []; }
}

// ── Main view ─────────────────────────────────────────────────────────────────
export function computeSignificanceView({ topN = 10, minScore = 2.0 } = {}) {
  const currentSession = getCurrentSession();

  const gapItems = loadGapItems(currentSession);
  const improveItems = loadImprovementItems(currentSession);

  const allItems = [...gapItems, ...improveItems]
    .filter(i => i.score >= minScore)
    .sort((a, b) => b.score - a.score);

  return {
    current_session: `S${currentSession}`,
    total_tracked: allItems.length,
    top_items: allItems.slice(0, topN),
    timestamp: new Date().toISOString(),
  };
}

// CLI mode
if (process.argv[1]?.endsWith('significance-view.mjs')) {
  const topN = parseInt(process.argv.find(a => a.startsWith('--top='))?.split('=')[1] || '10', 10);
  const view = computeSignificanceView({ topN });
  console.log(`[significance-view] session=${view.current_session} tracked=${view.total_tracked} top=${topN}`);
  console.log('');
  view.top_items.forEach((item, i) => {
    const star = item.score >= 7 ? '🔴' : item.score >= 5 ? '🟡' : '🟢';
    console.log(`${i + 1}. ${star} [${item.source}] ${item.thing.substring(0, 70)}`);
    console.log(`   score=${item.score.toFixed(1)} k=${item.k_count} status=${item.status}`);
  });
}
