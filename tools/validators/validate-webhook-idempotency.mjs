#!/usr/bin/env node
// validate-webhook-idempotency.mjs — checks Clerk webhook handlers have idempotency
// ADVISORY: each handler should start with existence check before creating DB rows
// Audit slug: webhook-idempotency

import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());
const HANDLER_PATH = join(ROOT, 'libs/integrations/clerk/webhook-handler.ts');

// Patterns that indicate idempotency check
const IDEMPOTENCY_PATTERNS = ['findUnique', 'findFirst', 'isProcessed'];

function main() {
  if (!existsSync(HANDLER_PATH)) {
    console.log('[validate-webhook-idempotency] webhook-handler.ts not found — skip');
    process.exit(0);
  }

  const content = readFileSync(HANDLER_PATH, 'utf8');
  const cases = content.match(/case\s+'([^']+)':/g) ?? [];
  const advisory = [];

  for (const c of cases) {
    const eventType = c.replace(/case\s+'|':/g, '');
    // Find the case block
    const caseStart = content.indexOf(c);
    const nextCase = content.indexOf('case ', caseStart + c.length);
    const block = nextCase > 0 ? content.slice(caseStart, nextCase) : content.slice(caseStart);

    const hasIdempotencyCheck = IDEMPOTENCY_PATTERNS.some(p => block.includes(p));
    if (!hasIdempotencyCheck && !eventType.includes('deleted')) {
      advisory.push({ event: eventType, message: `No existence check before create — duplicate webhook could error` });
    } else {
      console.log(`  ✅ ${eventType}: idempotency pattern found`);
    }
  }

  if (advisory.length > 0) {
    console.log(`${advisory.length} advisory — handlers without idempotency checks:`);
    for (const a of advisory) console.log(`  ⚠ ${a.event}: ${a.message}`);
  }

  console.log(`\n[validate-webhook-idempotency] cases=${cases.length} advisory=${advisory.length}`);
  process.exit(0); // Always advisory
}

main();
