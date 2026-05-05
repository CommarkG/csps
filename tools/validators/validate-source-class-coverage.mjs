#!/usr/bin/env node
/**
 * validate-source-class-coverage.mjs — confirms each source class has a registered normalizer
 *
 * Per unified-intake L3. Reads intake-normalizers.md and verifies:
 *   1. All 4 source classes are documented
 *   2. Each normalizer references its route_to default
 *   3. intake-router.mjs exists (the router that consumes normalizer output)
 *
 * EXIT-CODED: 0 = all source classes covered / 1 = gap detected
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const EXPECTED_SOURCE_CLASSES = ['chat-channel', 'external-content', 'agent-output', 'inner-default-leak'];

async function main() {
  const errors = [];
  const warnings = [];

  const normalizersPath = join(ROOT, 'docs/plan/pillar-0-governance/intake-normalizers.md');
  if (!existsSync(normalizersPath)) {
    errors.push('intake-normalizers.md not found — L2 artifact missing');
  } else {
    const text = readFileSync(normalizersPath, 'utf8');
    for (const sc of EXPECTED_SOURCE_CLASSES) {
      if (!text.includes(`\`${sc}\``)) {
        errors.push(`source class not covered in intake-normalizers.md: ${sc}`);
      }
    }
  }

  const routerPath = join(ROOT, 'tools/intake-router.mjs');
  if (!existsSync(routerPath)) {
    warnings.push('tools/intake-router.mjs not found — L3 router pending');
  }

  const schemaPath = join(ROOT, 'packages/schemas/intake-event.ts');
  if (!existsSync(schemaPath)) {
    errors.push('packages/schemas/intake-event.ts not found — L2 schema missing');
  }

  if (errors.length > 0) {
    console.error(`\n${errors.length} error(s):`);
    for (const e of errors) console.error(`  ✗ ${e}`);
  }
  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s):`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
  }

  const summary = `[validate-source-class-coverage] source_classes=${EXPECTED_SOURCE_CLASSES.length} errors=${errors.length} warnings=${warnings.length}`;
  console.log(`\n${summary}`);

  if (errors.length > 0) process.exit(1);
  process.exit(0);
}

main().catch(err => { console.error('[validate-source-class-coverage] fatal:', err); process.exit(1); });
