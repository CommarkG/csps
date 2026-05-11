#!/usr/bin/env node
// validate-subscription-error-handling.mjs — checks write routes return structured 402
// ADVISORY: routes using requireWriteSubscription should return { error, message } on 402
// Audit slug: subscription-error-handling

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());

function walkDir(dir) {
  if (!existsSync(dir)) return [];
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fp = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(fp));
    else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) results.push(fp);
  }
  return results;
}

function main() {
  const appsDir = join(ROOT, 'apps');
  const advisory = [];
  let routesChecked = 0;
  let routesWithGate = 0;

  for (const appName of readdirSync(appsDir)) {
    if (appName === 'template') continue;
    const apiDir = join(appsDir, appName, 'src/app/api');
    if (!existsSync(apiDir)) continue;

    for (const file of walkDir(apiDir)) {
      const content = readFileSync(file, 'utf8');
      if (!content.includes('requireWriteSubscription')) continue;
      routesChecked++;
      routesWithGate++;

      // Check that the subscription gate returns a structured error
      const hasStructuredError = content.includes('subscription_inactive') ||
                                  content.includes('subscriptionWriteResponse') ||
                                  content.includes('SUBSCRIPTION_CONFIG.cancelledBehavior.errorCode');
      if (!hasStructuredError) {
        advisory.push({
          file: file.replace(ROOT, '').replace(/\\/g, '/'),
          message: 'Uses requireWriteSubscription but may not return structured error { error, message }',
        });
      }
    }
  }

  if (advisory.length > 0) {
    console.log(`${advisory.length} advisory — routes with possible unstructured subscription errors:`);
    for (const a of advisory) console.log(`  ⚠ ${a.file}: ${a.message}`);
  } else {
    console.log(`  ✅ All ${routesWithGate} subscription-gated routes appear to return structured errors`);
  }

  console.log(`\n[validate-subscription-error-handling] routes_checked=${routesChecked} with_gate=${routesWithGate} advisory=${advisory.length}`);
  process.exit(0);
}

main();
