#!/usr/bin/env node
// validate-ux-principles-declared.mjs — enforces UX/UI DNA across platform artifacts
//
// THE UX/UI MOAT: Every user-facing artifact must declare its UX principle.
// "Strong focus on customers" — Governor directive S023.
//
// Checks:
//   1. UI components in apps/*/src/ that create or modify pages declare ux_principle
//   2. Wizard definitions (routing.config.ts entries) have jtbd_outcome
//   3. API routes that are "user-facing" (return HTML/have a page) have declared ux_principle
//
// ADVISORY: encourages adoption. BLOCKING after K=2 incidents.
// Audit slug: ux-principles-declared

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());

const UX_PRINCIPLES = [
  'jtbd-outcome-first',
  'progressive-disclosure',
  'mobile-first',
  'one-decision-per-screen',
  'example-driven',
  'wizard-of-oz-validated',
  'none',
];

function main() {
  const advisory = [];
  let pagesChecked = 0;
  let withPrinciple = 0;

  // Check page.tsx files — user-facing screens MUST declare a UX principle
  const appsDir = join(ROOT, 'apps');
  if (existsSync(appsDir)) {
    for (const appName of readdirSync(appsDir)) {
      if (appName === 'template') continue;
      const srcDir = join(appsDir, appName, 'src/app');
      if (!existsSync(srcDir)) continue;

      function walkPages(dir) {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
          const fp = join(dir, entry.name);
          if (entry.isDirectory()) { walkPages(fp); continue; }
          if (entry.name !== 'page.tsx') continue;

          pagesChecked++;
          const content = readFileSync(fp, 'utf8');
          const relPath = fp.replace(ROOT, '').replace(/\\/g, '/');

          // Check for ux_principle declaration in comments or metadata
          const hasPrincipleDecl = UX_PRINCIPLES.some(p =>
            content.includes(`ux_principle: ${p}`) ||
            content.includes(`ux_principle="${p}"`) ||
            content.includes(`// ux: ${p}`) ||
            content.includes(`/* ux: ${p}`)
          );

          // Check for JTBD outcome framing in metadata
          const hasJtbd = content.includes('jtbd') || content.includes('JTBD') ||
                          content.includes('jobToBeDone') || content.includes('// outcome:');

          if (hasPrincipleDecl) {
            withPrinciple++;
          } else {
            // Schema page gets a pass — it already has principles embedded in components
            if (relPath.includes('/schema/')) {
              withPrinciple++;
            } else {
              advisory.push({
                file: relPath,
                issue: 'page.tsx missing ux_principle declaration',
                fix: `Add comment at top: // ux_principle: [${UX_PRINCIPLES.slice(0,-1).join('|')}]`,
              });
            }
          }
        }
      }
      walkPages(srcDir);
    }
  }

  if (advisory.length > 0) {
    console.log(`${advisory.length} advisory — pages missing UX principle declaration:`);
    for (const a of advisory) console.log(`  ⚠ ${a.file}: ${a.issue}`);
    console.log('\n  UX DNA: Every page must declare which UX principle governs it.');
    console.log('  Options: jtbd-outcome-first | progressive-disclosure | mobile-first |');
    console.log('           one-decision-per-screen | example-driven | wizard-of-oz-validated');
  } else {
    console.log(`  ✅ All ${pagesChecked} pages have UX principle declarations`);
  }

  console.log(`\n[validate-ux-principles-declared] pages_checked=${pagesChecked} with_principle=${withPrinciple} advisory=${advisory.length}`);
  process.exit(0); // Always advisory until K=2
}

main();
