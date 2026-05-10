#!/usr/bin/env node
// validate-plan-ai-defaults.mjs
// Scans topic-plan files for ai_defaults_influence: partial|dominant.
// When present + no ratification_status: RATIFIED → emits ADVISORY.
// This is the mechanical surface of the Governor S022 directive:
//   "when a plan is mainly influenced by AI deep instructions, surface a notification"
//
// Audit slug: plan-ai-defaults-alignment
// Severity: ADVISORY (human must review; not blocking pnpm verify)
// Promotion to BLOCKING: when any plan with ai_defaults_influence: dominant ships to production
//   without ratification_status: RATIFIED

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());
const TOPIC_PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');

function extractFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return null;
  const fm = content.slice(4, end);
  // Minimal YAML extraction for key fields
  const get = (key) => {
    const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
  };
  return {
    name: get('name'),
    ai_defaults_influence: get('ai_defaults_influence'),
    ratification_status: get('ratification_status'),
    lifecycle_state: get('lifecycle_state'),
  };
}

function main() {
  const findings = [];
  let scanned = 0;
  let flagged = 0;
  let ratified = 0;

  let entries;
  try { entries = readdirSync(TOPIC_PLANS_DIR); } catch {
    console.log('[validate-plan-ai-defaults] topic-plans dir not found — skip');
    process.exit(0);
  }

  for (const f of entries) {
    if (!f.endsWith('.md')) continue;
    const fp = join(TOPIC_PLANS_DIR, f);
    const content = readFileSync(fp, 'utf8');
    const fm = extractFrontmatter(content);
    if (!fm) continue;
    scanned++;

    const influence = fm.ai_defaults_influence;
    if (!influence || influence === 'none') continue;

    flagged++;
    const ratificationStatus = fm.ratification_status;
    const isRatified = ratificationStatus === 'RATIFIED';

    if (isRatified) {
      ratified++;
    } else if (influence === 'dominant') {
      findings.push({
        level: 'BLOCKING',
        file: f,
        name: fm.name,
        influence,
        ratification_status: ratificationStatus ?? 'NOT_SET',
        message: `ai_defaults_influence=dominant without ratification_status=RATIFIED — plan contains AI-invented values not approved by Governor`,
      });
    } else if (influence === 'partial') {
      findings.push({
        level: 'ADVISORY',
        file: f,
        name: fm.name,
        influence,
        ratification_status: ratificationStatus ?? 'NOT_SET',
        message: `ai_defaults_influence=partial — plan contains AI-default sections pending Governor + Opus ratification`,
      });
    }
  }

  const blocking = findings.filter(f => f.level === 'BLOCKING');
  const advisory = findings.filter(f => f.level === 'ADVISORY');

  if (findings.length > 0) {
    console.log(`${findings.length} AI-defaults finding(s):`);
    for (const f of findings) {
      const prefix = f.level === 'BLOCKING' ? '  ✗' : '  ⚠';
      console.log(`${prefix} [${f.level}] ${f.file}: ${f.message}`);
      console.log(`      ratification_status=${f.ratification_status}`);
    }
  }

  console.log(`\n[validate-plan-ai-defaults] scanned=${scanned} flagged=${flagged} ratified=${ratified} blocking=${blocking.length} advisory=${advisory.length}`);

  // Exit 1 only on BLOCKING (dominant influence + unratified)
  // Advisory = exit 0 (informational)
  if (blocking.length > 0) process.exit(1);
  process.exit(0);
}

main();
