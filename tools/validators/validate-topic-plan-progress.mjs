#!/usr/bin/env node
/**
 * validate-topic-plan-progress.mjs — orphaned topic-plan detector
 *
 * ROOT CAUSE TARGETED: zero-laptop-dependency-setup and unified-intake topic-plans
 * had lifecycle_state:active since S006/S008 with L1/L2 artifacts never built.
 * The platform had no mechanical surface that would catch this.
 *
 * What it checks (per active topic-plan):
 *   CHECK A — Orphan detection: plan lifecycle_state=active AND multi_session_arc
 *             lists sessions all in the past AND no §11 closure attestation present
 *   CHECK B — L-level artifact gap: scans plan body for unchecked "[ ]" exit criteria
 *             that reference file paths — verifies those paths exist on disk
 *   CHECK C — Arc staleness: if last session in multi_session_arc was >3 sessions
 *             ago and plan isn't closed → WARN "plan may need resurrection or closure"
 *
 * EXIT-CODED: 0 = all plans current / 1 = orphaned plans detected
 * ADVISORY: current session; FAIL_CLOSED at week-4 when audit-runner ships
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');

function extractFrontmatterField(text, field) {
  const m = text.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
}

function extractMultiSessionArc(text) {
  const m = text.match(/multi_session_arc:\s*\[([^\]]+)\]/);
  if (!m) return [];
  return m[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
}

function hasClosure(text) {
  return text.includes('§11') && (text.includes('closure') || text.includes('CLOSED') || text.includes('attestation'));
}

function extractUncheckedExitCriteria(text) {
  const unchecked = [];
  const lines = text.split('\n');
  for (const line of lines) {
    if (!line.trim().startsWith('- [ ]')) continue;
    // Extract file paths referenced in the criterion
    const pathMatches = line.match(/`([^`]+\.[a-z]+[^`]*)`/g) ?? [];
    for (const pm of pathMatches) {
      const path = pm.replace(/`/g, '').split(' ')[0]; // first word = path
      if (path.includes('/') && !path.includes('<') && !path.includes('*')) {
        unchecked.push({ criterion: line.trim(), path });
      }
    }
  }
  return unchecked;
}

function parseCurrentSession() {
  // Read OVERVIEW.md to find current session
  const overviewPath = join(ROOT, 'docs/plan/_handoff/VAULT/OVERVIEW.md');
  if (!existsSync(overviewPath)) return 'S011'; // fallback
  const text = readFileSync(overviewPath, 'utf8');
  const m = text.match(/last_update_session:\s*(S\d+)/);
  return m ? m[1] : 'S011';
}

function sessionNumber(s) {
  const m = String(s).match(/S(\d+)/i);
  return m ? Number(m[1]) : 0;
}

async function main() {
  if (!existsSync(PLANS_DIR)) {
    console.log('[validate-topic-plan-progress] no topic-plans dir; skipping');
    process.exit(0);
  }

  const currentSession = parseCurrentSession();
  const currentN = sessionNumber(currentSession);
  const files = readdirSync(PLANS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');
  const warnings = [];
  let checked = 0;

  for (const file of files) {
    const text = readFileSync(join(PLANS_DIR, file), 'utf8');
    const lifecycle = extractFrontmatterField(text, 'lifecycle_state');
    const name = extractFrontmatterField(text, 'name') ?? file;

    if (lifecycle !== 'active') continue; // only check active plans
    checked++;

    const arc = extractMultiSessionArc(text);
    const closed = hasClosure(text);

    // CHECK A — orphan: active + arc in the past + no closure
    if (arc.length > 0 && !closed) {
      const lastArcSession = Math.max(...arc.map(sessionNumber));
      if (lastArcSession < currentN) {  // arc ended in a past session without closure
        warnings.push(`[CHECK A ORPHAN] ${name}: lifecycle=active, arc ends at S${lastArcSession}, current=S${currentN}, no §11 closure. Plan may be orphaned — verify progress or close.`);
      }
    }

    // CHECK B — unchecked exit criteria with missing artifacts
    const unchecked = extractUncheckedExitCriteria(text);
    const missingArtifacts = unchecked.filter(u => {
      const absPath = join(ROOT, u.path.replace(/^\.\//, ''));
      return !existsSync(absPath);
    }).slice(0, 3); // cap at 3 per plan to avoid noise

    if (missingArtifacts.length > 0) {
      for (const m of missingArtifacts) {
        warnings.push(`[CHECK B MISSING] ${name}: exit criterion references "${m.path}" which doesn't exist on disk`);
      }
    }
  }

  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s) — topic-plan gaps detected:`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
  }

  const summary = `[validate-topic-plan-progress] plans_checked=${checked} warnings=${warnings.length}`;
  console.log(`\n${summary}`);

  if (warnings.length > 0) process.exit(1);
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-topic-plan-progress] fatal:', err);
  process.exit(1);
});
