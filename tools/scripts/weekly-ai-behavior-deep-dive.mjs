#!/usr/bin/env node
/**
 * @csps-id csps.tools.scripts.weekly-ai-behavior-deep-dive
 * @csps-name weekly-ai-behavior-deep-dive
 * @csps-description Weekly non-urgent pipeline: reads ai-behavior-signals.jsonl,
 *   clusters D-default firings by class, finds compounding patterns (same class
 *   3+ weeks in a row = structural fix needed), generates enhancement proposals.
 *
 *   NOT URGENT — runs weekly, accumulates patiently, proposes structural fixes.
 *   Governor's vision: "a pipeline that is not in a rush. Compounding elements
 *   of the same kind. Run a weekly deep dive. See how the platform can be enhanced."
 *
 *   Called by: cron-weekly-tag-status-deep-audit.sh (weekly)
 *   Reads: tools/data/ai-behavior-signals.jsonl (append-only signal log)
 *   Writes: docs/plan/_handoff/VAULT/ai-enhancement-proposals/WEEK-YYYY-WW.md
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:script domain:governance audience:ai-agent
 * @csps-enforces D11-debugging-wrong-layer CSPS-PLANNING-DISCIPLINE-§2 PVA
 * @csps-inherits-from cron-weekly-tag-status-deep-audit + D1-D11-registry + vault-pending
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const SIGNALS_FILE = resolve(ROOT, 'tools/data/ai-behavior-signals.jsonl');
const OUTPUT_DIR = resolve(ROOT, 'docs/plan/_handoff/VAULT/ai-enhancement-proposals');
const VAULT_PENDING = resolve(ROOT, 'tools/data/vault-pending.yaml');

// ── Week calculation ───────────────────────────────────────────────────────────
function getISOWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return { year: d.getFullYear(), week: 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7) };
}

const NOW = new Date();
const { year, week } = getISOWeek(NOW);
const WEEK_KEY = `${year}-W${String(week).padStart(2, '0')}`;
const LOOKBACK_DAYS = 28; // 4 weeks lookback for compounding detection

// ── Read signals ───────────────────────────────────────────────────────────────
let signals = [];
if (existsSync(SIGNALS_FILE)) {
  const lines = readFileSync(SIGNALS_FILE, 'utf8').split('\n').filter(Boolean);
  for (const line of lines) {
    try { signals.push(JSON.parse(line)); } catch { /* skip malformed */ }
  }
}

const cutoff = new Date(NOW.getTime() - LOOKBACK_DAYS * 86400000);
const recentSignals = signals.filter(s => {
  if (!s.date) return true;
  return new Date(s.date) >= cutoff;
});

console.log(`[weekly-ai-behavior-deep-dive] Week ${WEEK_KEY} | signals_total=${signals.length} recent=${recentSignals.length}`);

if (recentSignals.length === 0) {
  console.log('[weekly-ai-behavior-deep-dive] No signals in lookback window — skipping report');
  process.exit(0);
}

// ── Cluster by signal class + D-class ─────────────────────────────────────────
const clusters = {};
for (const signal of recentSignals) {
  const key = signal.d_class || signal.signal_class || 'unknown';
  if (!clusters[key]) clusters[key] = [];
  clusters[key].push(signal);
}

// ── Find compounding patterns (same class across multiple sessions) ───────────
const compounding = [];
for (const [cls, clsSignals] of Object.entries(clusters)) {
  const sessions = [...new Set(clsSignals.map(s => s.session))];
  if (sessions.length >= 2) {
    compounding.push({
      class: cls,
      session_count: sessions.length,
      total_signals: clsSignals.length,
      sessions,
      enhancement_candidates: [...new Set(clsSignals.map(s => s.enhancement_candidate).filter(Boolean))],
      defaults_fired: [...new Set(clsSignals.flatMap(s => s.csps_defaults_fired || []))],
    });
  }
}

// ── Generate report ────────────────────────────────────────────────────────────
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

const outFile = join(OUTPUT_DIR, `WEEK-${WEEK_KEY}.md`);

const structural = compounding.filter(c => c.session_count >= 3);
const watching = compounding.filter(c => c.session_count === 2);
const oneOff = Object.entries(clusters).filter(([cls]) => !compounding.find(c => c.class === cls));

const report = `---
id: csps.vault.ai-enhancement-proposals.${WEEK_KEY.toLowerCase()}
name: ai-enhancement-proposal-${WEEK_KEY.toLowerCase()}
version: "1.0"
description: "Weekly AI behavior deep-dive. Clusters D-default firings by class, identifies structural fixes for compounding patterns. Not urgent — reviewed by Opus weekly."
type: enhancement-proposal
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
week: "${WEEK_KEY}"
generated_at: "${NOW.toISOString()}"
signals_analyzed: ${recentSignals.length}
compounding_classes: ${compounding.length}
structural_fix_needed: ${structural.length}
---

# AI Behavior Deep-Dive — ${WEEK_KEY}

> **Weekly non-urgent pipeline.** Not a fire alarm — a mirror for the platform to see its patterns and improve them systematically.
> Compounding = same D-default firing across 3+ sessions = structural fix needed, not instance fix.

## Summary

| Tier | Classes | Action |
|---|---|---|
| 🔴 Structural fix needed (3+ sessions) | ${structural.length} | Promote to improvement-register or PROTO |
| 🟡 Watching (2 sessions) | ${watching.length} | Monitor next 2 weeks; elevate if persists |
| ℹ️ One-off (1 session) | ${oneOff.length} | Log; no action unless recurring |

---

## 🔴 Structural Fix Needed

${structural.length === 0 ? '*None this week — healthy.*' : structural.map(c => `### ${c.class} (${c.session_count} sessions)

**Sessions:** ${c.sessions.join(', ')}
**Times fired:** ${c.total_signals}
**Defaults fired:** ${c.defaults_fired.join(', ')}

**Enhancement candidates:**
${c.enhancement_candidates.map(e => `- ${e}`).join('\n') || '- (see signals for context)'}

**Recommended action:** Create improvement-register entry or PROTO for structural fix.
`).join('\n---\n')}

## 🟡 Watching (may compound)

${watching.length === 0 ? '*None this week.*' : watching.map(c => `- **${c.class}**: ${c.session_count} sessions (${c.sessions.join(', ')}) — monitor`).join('\n')}

## ℹ️ One-off signals (logged, no action)

${oneOff.length === 0 ? '*None.*' : oneOff.map(([cls, sigs]) => `- **${cls}** (${sigs[0]?.session || '?'}): ${(sigs[0]?.pattern_observed || '').slice(0, 100)}...`).join('\n')}

---

## For Opus: Next Actions

${structural.length > 0 ? `1. Review the ${structural.length} structural class(es) above
2. For each: propose a D-override enforcement (T1 hook or validator) if none exists
3. Consider whether the D-default registry (D1-D11) needs extension
` : '1. No structural fixes needed this week — continue monitoring.'}

*Generated by tools/scripts/weekly-ai-behavior-deep-dive.mjs*
`;

writeFileSync(outFile, report, 'utf8');
console.log(`[weekly-ai-behavior-deep-dive] Report written: ${outFile}`);
console.log(`[weekly-ai-behavior-deep-dive] structural=${structural.length} watching=${watching.length} one_off=${oneOff.length}`);
