#!/usr/bin/env node
/**
 * validate-model-tier-currency.mjs — model tier registry is current
 *
 * Checks that tools/model-tier-registry.yaml is present, has all required tiers,
 * and that last_updated is within 180 days.
 *
 * The model-agnostic tier vocabulary is CSPS's unique approach: decouple INTENT
 * (DEEP_REASONING / STANDARD_BUILD / MECHANICAL_SCAN) from IMPLEMENTATION
 * (specific model IDs). When Claude 4.7 ships, update current_mapping in ONE file.
 *
 * Per platform-maturation-plan.md WS-5 + model-tier-registry.yaml
 * EXIT-CODED: 0 = registry current / 1 = registry stale or missing
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
// Inline YAML tier extraction (avoid js-yaml dependency in tools/validators/)
function extractTopLevelKey(text, key) {
  const m = text.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
}
function extractTierNames(text) {
  const names = [];
  for (const m of text.matchAll(/^  ([A-Z_]+):\s*$/gm)) names.push(m[1]);
  return names;
}
function extractNestedField(text, tier, field) {
  const tierIdx = text.indexOf(`  ${tier}:\n`);
  if (tierIdx < 0) return null;
  // Find next tier (2-space indent + uppercase = new tier entry)
  const nextTierMatch = text.slice(tierIdx + tier.length + 4).search(/\n  [A-Z]/);
  const tierBlock = nextTierMatch >= 0
    ? text.slice(tierIdx, tierIdx + tier.length + 4 + nextTierMatch)
    : text.slice(tierIdx);
  // Look for standalone field (not inside alternatives list)
  const lines = tierBlock.split('\n').filter(l => !l.trim().startsWith('- '));
  for (const line of lines) {
    const m = line.match(new RegExp(`^\\s+${field}:\\s+(.+)$`));
    if (m) return m[1].trim();
  }
  return null;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const REGISTRY_PATH = join(ROOT, 'tools/model-tier-registry.yaml');
const MAX_STALENESS_DAYS = 180;
const REQUIRED_TIERS = ['DEEP_REASONING', 'STANDARD_BUILD', 'MECHANICAL_SCAN'];

async function main() {
  const warnings = [];
  const infos = [];

  if (!existsSync(REGISTRY_PATH)) {
    console.error('[validate-model-tier-currency] CRITICAL: tools/model-tier-registry.yaml not found');
    process.exit(1);
  }

  const text = readFileSync(REGISTRY_PATH, 'utf8');
  const tierNames = extractTierNames(text);

  // CHECK A — required tiers present
  const missingTiers = REQUIRED_TIERS.filter(t => !tierNames.includes(t));
  if (missingTiers.length > 0) {
    warnings.push(`Missing required tiers: ${missingTiers.join(', ')}`);
  } else {
    infos.push(`All ${REQUIRED_TIERS.length} required tiers present`);
  }

  // CHECK B — last_updated freshness
  const lastUpdated = extractTopLevelKey(text, 'last_updated');
  if (!lastUpdated) {
    warnings.push('Missing last_updated field in registry');
  } else {
    const daysSince = (Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince > MAX_STALENESS_DAYS) {
      warnings.push(`Tier registry last updated ${Math.floor(daysSince)} days ago — review needed`);
    } else {
      infos.push(`Registry updated ${Math.floor(daysSince)} days ago — within ${MAX_STALENESS_DAYS}-day window`);
    }
  }

  // CHECK C — DEEP/STANDARD/MECHANICAL have model_id
  for (const tier of REQUIRED_TIERS) {
    const modelId = extractNestedField(text, tier, 'model_id');
    if (!modelId || modelId === 'null') {
      warnings.push(`Required tier "${tier}" missing current_mapping.model_id`);
    }
  }

  // Emit tier summary
  const deepModel = extractNestedField(text, 'DEEP_REASONING', 'model_id') ?? '?';
  const standardModel = extractNestedField(text, 'STANDARD_BUILD', 'model_id') ?? '?';
  const haiku = extractNestedField(text, 'MECHANICAL_SCAN', 'model_id') ?? '?';
  infos.push(`Tiers: DEEP_REASONING→${deepModel} / STANDARD_BUILD→${standardModel} / MECHANICAL_SCAN→${haiku}`);;

  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s):`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
  }
  for (const i of infos) console.log(`  ℹ ${i}`);

  const summary = `[validate-model-tier-currency] tiers=${tierNames.length} warnings=${warnings.length}`;
  console.log(`\n${summary}`);

  if (warnings.length > 0) process.exit(1);
  process.exit(0);
}

main().catch(err => { console.error('[validate-model-tier-currency] fatal:', err); process.exit(1); });
