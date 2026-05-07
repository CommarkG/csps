#!/usr/bin/env node
/**
 * validate-plan-age-alignment.mjs — STALE PLAN ALIGNMENT GATE
 *
 * ROOT CAUSE TARGETED (S015 major discovery):
 *   Plans written in S006-S011 contain unchecked items that were:
 *   (a) Already completed by subsequent sessions but never marked done, OR
 *   (b) Written against a platform state that has since evolved (new validators,
 *       schema changes, new behavioral contracts) — making the planned approach stale.
 *
 *   A plan item written 9 sessions ago that references "add validate-open-plan-levels.mjs
 *   to pnpm verify" is already DONE — but no mechanism existed to surface this.
 *   Result: 111 reported open items, ~40-70 of which may already be complete.
 *
 * RULE (S015 ratification): Any active topic plan written more than 1 session ago
 * (current_session - written_session > 1) is STALE and requires alignment verification
 * before its items are executed in a new session.
 *
 * What it checks:
 *   CHECK A — Plan age: session gap between written_session and current_session.
 *             > 1 session = STALE. Output: stale plan count + age_in_sessions.
 *
 *   CHECK B — Already-done items: unchecked [ ] items that reference files which
 *             now EXIST on disk (suggesting the work was done but not marked).
 *             These are WARN (manual verification needed before checking off).
 *
 *   CHECK C — Alignment citation: stale plans that have NO alignment_verified_session
 *             field in frontmatter = have never been formally re-aligned.
 *             These require an explicit alignment pass before execution.
 *
 * RESOLUTION:
 *   Before executing items from a stale plan:
 *   1. Run this validator and review its output
 *   2. For each unchecked item: is it DONE (mark [x]), STALE (update approach), or VALID?
 *   3. Add `alignment_verified_session: S<NNN>` to the plan frontmatter
 *   4. This validator then treats the plan as alignment-current until next gap
 *
 * EXIT-CODED: 0 = all plans current or alignment-verified / 1 = stale plans need alignment
 * THRESHOLD: surfaced at session-open (session-open.sh v1.2+)
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

function sessionNumber(s) {
  const m = String(s ?? '').match(/S(\d+)/i);
  return m ? Number(m[1]) : 0;
}

function getCurrentSession() {
  try {
    const d = JSON.parse(readFileSync(join(ROOT, 'tools/session-state.json'), 'utf8'));
    return d.current_session || 'S015';
  } catch { return 'S015'; }
}

/** Extract file paths referenced in unchecked items */
function extractReferencedPaths(line) {
  const paths = [];
  // Match backtick paths: `path/to/file.ext`
  const ticks = line.match(/`([^`]+\.[a-z]{2,5}[^`]*)`/g) ?? [];
  for (const t of ticks) {
    const p = t.replace(/`/g, '').split(' ')[0];
    if (p.includes('/') && !p.includes('<') && !p.includes('*')) paths.push(p);
  }
  return paths;
}

async function main() {
  if (!existsSync(PLANS_DIR)) {
    console.log('[validate-plan-age-alignment] no topic-plans dir; skipping');
    process.exit(0);
  }

  const currentSession = getCurrentSession();
  const currentN = sessionNumber(currentSession);
  const files = readdirSync(PLANS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');

  const staleUnverified = [];  // plans that are stale and have no alignment_verified_session
  const staleVerified = [];    // plans that are stale but have been alignment-verified this session
  const alreadyDoneItems = []; // items likely already done (file exists)
  const warnings = [];
  let plansChecked = 0;

  for (const file of files) {
    const text = readFileSync(join(PLANS_DIR, file), 'utf8');
    const lifecycle = extractFrontmatterField(text, 'lifecycle_state');
    if (lifecycle !== 'active') continue;
    plansChecked++;

    const name = extractFrontmatterField(text, 'name') ?? file;
    const writtenSession = extractFrontmatterField(text, 'session') ?? 'S000';
    const alignmentVerifiedSession = extractFrontmatterField(text, 'alignment_verified_session');
    const writtenN = sessionNumber(writtenSession);
    const ageInSessions = currentN - writtenN;

    // CHECK A — Plan age
    if (ageInSessions <= 1) continue; // fresh plan, no alignment needed

    const alignedN = alignmentVerifiedSession ? sessionNumber(alignmentVerifiedSession) : 0;
    const isAlignmentCurrent = alignedN >= currentN - 1; // verified this session or last

    // CHECK B — already-done items (file references that now exist)
    const lines = text.split('\n');
    const uncheckedLines = lines.filter(l => l.trim().startsWith('- [ ]'));
    let likelyDoneCount = 0;

    for (const line of uncheckedLines) {
      const paths = extractReferencedPaths(line);
      for (const p of paths) {
        const absPath = join(ROOT, p.replace(/^\.\//, ''));
        if (existsSync(absPath)) {
          likelyDoneCount++;
          alreadyDoneItems.push({ plan: name, item: line.trim().slice(0, 100), path: p });
          break;
        }
      }
    }

    const entry = {
      name,
      file,
      writtenSession,
      ageInSessions,
      uncheckedCount: uncheckedLines.length,
      likelyDoneCount,
      alignmentVerifiedSession: alignmentVerifiedSession ?? 'NEVER',
      isAlignmentCurrent,
    };

    if (isAlignmentCurrent) {
      staleVerified.push(entry);
    } else {
      staleUnverified.push(entry);
    }
  }

  // Report
  if (staleUnverified.length > 0) {
    console.warn('\n⚠ STALE PLANS REQUIRING ALIGNMENT — review before executing items:');
    for (const p of staleUnverified) {
      console.warn(`  [STALE-${p.ageInSessions}S] ${p.name}`);
      console.warn(`     written: ${p.writtenSession} | unchecked: ${p.uncheckedCount} | likely-done: ${p.likelyDoneCount} | alignment: ${p.alignmentVerifiedSession}`);
    }
    console.warn('\nTo clear: add `alignment_verified_session: ' + currentSession + '` to plan frontmatter after review.');
    console.warn('Protocol: for each [ ] item — DONE (mark [x]) | STALE (update approach) | VALID (keep as-is).\n');
  }

  if (alreadyDoneItems.length > 0) {
    console.warn(`\n${alreadyDoneItems.length} item(s) likely already done (referenced files exist on disk):`);
    for (const i of alreadyDoneItems.slice(0, 8)) {
      console.warn(`  ⚠ [${i.plan}] ${i.item.slice(0, 90)} → "${i.path}" EXISTS`);
    }
    if (alreadyDoneItems.length > 8) console.warn(`  ... and ${alreadyDoneItems.length - 8} more`);
  }

  const staleTotal = staleUnverified.length + staleVerified.length;
  const summary = `[validate-plan-age-alignment] plans_checked=${plansChecked} stale_total=${staleTotal} unverified=${staleUnverified.length} verified=${staleVerified.length} likely_done_items=${alreadyDoneItems.length}`;
  console.log(`\n${summary}`);

  // Advisory exit 0 — stale plans are surfaced via Threshold + orchestrator WARN, not hard block.
  // Hard blocking is via plan-coverage-gate when executing items from stale plans (future Phase 2).
  // Phase 1 (current): WARN discipline — AI sees count at session-open + verify, acts accordingly.
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-plan-age-alignment] fatal:', err);
  process.exit(1);
});
