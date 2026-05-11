#!/usr/bin/env node
// validate-solo-user-flow.mjs — checks each app declares its solo user flow policy
// ADVISORY: each app with a Clerk webhook must declare solo_user_flow
// Audit slug: solo-user-flow

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());

function main() {
  const appsDir = join(ROOT, 'apps');
  const advisory = [];
  let checked = 0;

  if (!existsSync(appsDir)) { console.log('[validate-solo-user-flow] apps/ not found'); process.exit(0); }

  for (const appName of readdirSync(appsDir)) {
    if (appName === 'template') continue; // template doesn't need this yet
    const webhookPath = join(appsDir, appName, 'src/app/api/webhooks/clerk/route.ts');
    if (!existsSync(webhookPath)) continue;
    checked++;

    const content = readFileSync(webhookPath, 'utf8');
    // Check if solo user flow is declared (auto-create org OR explicit not_applicable comment)
    const hasSoloFlow = content.includes('auto_org') || content.includes('solo_user_flow') ||
                        content.includes('personal org') || content.includes('createOrganization');
    if (!hasSoloFlow) {
      advisory.push({
        app: appName,
        message: `No solo_user_flow declaration. Users without orgs get "No organization yet" dead-end.`,
        fix: `Add: createOrganization() call in user.created handler OR comment: // solo_user_flow: not_applicable`,
      });
    } else {
      console.log(`  ✅ ${appName}: solo user flow declared`);
    }
  }

  if (advisory.length > 0) {
    console.log(`${advisory.length} advisory — apps missing solo_user_flow declaration:`);
    for (const a of advisory) console.log(`  ⚠ ${a.app}: ${a.message}`);
  }
  if (checked === 0) console.log('  No apps with Clerk webhooks found — nothing to check');

  console.log(`\n[validate-solo-user-flow] checked=${checked} advisory=${advisory.length}`);
  process.exit(0);
}

main();
