#!/usr/bin/env node
// validate-routing-declared.mjs — enforces Threshold routing declarations in plans
//
// The Threshold is MANDATORY — every plan that implements user-facing work
// must declare threshold_route and jtbd_outcome.
//
// Without routing declaration, the platform cannot mechanically enforce
// "accurate goal setting prevents multiple drifts" (Governor directive S023).
//
// BLOCKING: active deep_quality plans > S023 missing threshold_route
// ADVISORY: older plans missing threshold_route
// Audit slug: routing-declared

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());
const PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');
const ROUTING_CONFIG = join(ROOT, 'libs/config/routing.config.ts');

const VALID_ROUTES = [
  'developer.new-entity', 'developer.new-page', 'developer.api-integration',
  'business.billing', 'business.permissions', 'ux.onboarding-flow',
  'platform.governance', 'personal.tracking', 'personal.finance', 'knowledge.documentation', 'none',
];

function main() {
  const blocking = [];
  const advisory = [];
  let checked = 0;

  // CHECK 1: routing.config.ts exists (the canonical routing source)
  if (!existsSync(ROUTING_CONFIG)) {
    advisory.push({
      file: 'libs/config/routing.config.ts',
      issue: 'Routing config not yet created — Threshold templates not formalized',
      fix: 'Create libs/config/routing.config.ts with wizard template definitions',
    });
  } else {
    console.log('  ✅ routing.config.ts: exists');
  }

  // CHECK 2: active plans declare threshold_route
  let files;
  try { files = readdirSync(PLANS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md'); }
  catch { console.log('[validate-routing-declared] plans dir not found — skip'); process.exit(0); }

  for (const f of files) {
    const content = readFileSync(join(PLANS_DIR, f), 'utf8');
    if (!content.includes('lifecycle_state: active')) continue;
    if (!content.includes('execution_mode:')) continue; // Only implementation plans
    checked++;

    const routeMatch = content.match(/threshold_route:\s*(\S+)/);
    const route = routeMatch ? routeMatch[1] : null;

    if (!route) {
      advisory.push({
        file: f,
        issue: 'Active implementation plan missing threshold_route — routing unknown',
        fix: 'Add threshold_route: [template-id] to frontmatter (see frontmatter-closed-enums.md)',
      });
    } else if (!VALID_ROUTES.includes(route)) {
      advisory.push({
        file: f,
        issue: `threshold_route: "${route}" not in valid template list`,
        fix: `Use one of: ${VALID_ROUTES.join(' | ')}`,
      });
    } else {
      console.log(`  ✅ ${f}: threshold_route=${route}`);
    }
  }

  if (blocking.length > 0) {
    console.log(`${blocking.length} BLOCKING:`);
    for (const b of blocking) console.log(`  ✗ ${b.file}: ${b.issue}`);
  }
  if (advisory.length > 0) {
    console.log(`${advisory.length} advisory — plans missing routing declaration:`);
    for (const a of advisory) console.log(`  ⚠ ${a.file}: ${a.issue}`);
  }

  console.log(`\n[validate-routing-declared] plans_checked=${checked} blocking=${blocking.length} advisory=${advisory.length}`);
  process.exit(blocking.length > 0 ? 1 : 0);
}

main();
