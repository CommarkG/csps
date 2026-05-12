#!/usr/bin/env node
// validate-intent-crystallized.mjs — enforces the Initial Draft → Accurate Definition transformation
// Per Governor directive S023: accurate goal setting prevents multiple drifts
// ADVISORY: active topic-plans should declare intent_crystallized
// BLOCKING: plans with execution_mode: deep_quality AND intent_crystallized: false
// Audit slug: intent-crystallized

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());
const PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');

function main() {
  const blocking = [];
  const advisory = [];
  let checked = 0;

  let files;
  try { files = readdirSync(PLANS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md'); }
  catch { console.log('[validate-intent-crystallized] plans dir not found — skip'); process.exit(0); }

  for (const f of files) {
    const content = readFileSync(join(PLANS_DIR, f), 'utf8');
    if (!content.includes('lifecycle_state: active')) continue;
    checked++;

    const hasIntentField = content.includes('intent_crystallized:');
    const hasThresholdRoute = content.includes('threshold_route:');
    const isDeepQuality = content.includes('execution_mode: deep_quality');

    if (!hasIntentField) {
      if (isDeepQuality) {
        // Deep quality plans without intent crystallization = BLOCKING (high risk of drift)
        blocking.push({
          file: f,
          issue: 'deep_quality execution_mode but no intent_crystallized field — high drift risk',
          fix: 'Add intent_crystallized: true|false|partial to frontmatter',
        });
      } else {
        advisory.push({ file: f, issue: 'missing intent_crystallized — add when implementing' });
      }
    }

    if (!hasThresholdRoute && isDeepQuality) {
      advisory.push({ file: f, issue: 'missing threshold_route — declare which wizard template was matched' });
    }

    // S025 P-META-023: failure_signal advisory for deep_quality plans
    const hasFailureSignal = content.includes('failure_signal:');
    if (!hasFailureSignal && isDeepQuality) {
      advisory.push({ file: f, issue: 'missing failure_signal — what would tell us this initiative failed? (P-META-023 M3, human-authored)' });
    }
  }

  if (blocking.length > 0) {
    console.log(`${blocking.length} BLOCKING — deep_quality plans without intent crystallization:`);
    for (const b of blocking) console.log(`  ✗ ${b.file}: ${b.issue}`);
  }
  if (advisory.length > 0) {
    console.log(`${advisory.length} advisory — plans missing intent fields:`);
    for (const a of advisory) console.log(`  ⚠ ${a.file}: ${a.issue}`);
  }
  if (blocking.length === 0 && advisory.length === 0) {
    console.log('  All active plans have intent crystallization fields ✅');
  }

  console.log(`\n[validate-intent-crystallized] checked=${checked} blocking=${blocking.length} advisory=${advisory.length}`);
  process.exit(blocking.length > 0 ? 1 : 0);
}

main();
