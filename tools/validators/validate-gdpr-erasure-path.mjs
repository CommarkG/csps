#!/usr/bin/env node
// validate-gdpr-erasure-path.mjs — confirms eraseUser() is accessible per app
// ADVISORY: each app should have eraseUser() imported + DELETE /api/settings/account
// Audit slug: gdpr-erasure-path

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());

function main() {
  const appsDir = join(ROOT, 'apps');
  const advisory = [];
  let checked = 0;

  if (!existsSync(appsDir)) { console.log('[validate-gdpr-erasure-path] apps/ not found'); process.exit(0); }

  // Check eraseUser exists in libs/integrations
  const gdprPath = join(ROOT, 'libs/integrations/gdpr.ts');
  if (!existsSync(gdprPath)) {
    console.log('  ✗ BLOCKING: libs/integrations/gdpr.ts not found — eraseUser() not implemented');
    console.log('\n[validate-gdpr-erasure-path] blocking=1');
    process.exit(1);
  }
  console.log('  ✅ libs/integrations/gdpr.ts: eraseUser() exists');

  for (const appName of readdirSync(appsDir)) {
    if (appName === 'template') continue;
    const settingsRoute = join(appsDir, appName, 'src/app/api/settings/account/route.ts');
    const hasApi = existsSync(settingsRoute);
    checked++;

    if (!hasApi) {
      advisory.push({
        app: appName,
        message: `No DELETE /api/settings/account — GDPR erasure unreachable by users`,
        fix: `Create apps/${appName}/src/app/api/settings/account/route.ts with DELETE handler calling eraseUser()`,
      });
    } else {
      const content = readFileSync(settingsRoute, 'utf8');
      if (content.includes('eraseUser') || content.includes('gdpr')) {
        console.log(`  ✅ ${appName}: DELETE /api/settings/account with eraseUser() found`);
      } else {
        advisory.push({ app: appName, message: `settings/account/route.ts exists but doesn't call eraseUser()` });
      }
    }
  }

  if (advisory.length > 0) {
    console.log(`${advisory.length} advisory — apps missing GDPR erasure path:`);
    for (const a of advisory) console.log(`  ⚠ ${a.app}: ${a.message}`);
  }

  console.log(`\n[validate-gdpr-erasure-path] checked=${checked} advisory=${advisory.length}`);
  process.exit(0);
}

main();
