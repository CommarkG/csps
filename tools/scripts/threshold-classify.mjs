#!/usr/bin/env node
/**
 * tools/scripts/threshold-classify.mjs
 * PROTO-THRESHOLD-1 | S060
 *
 * Thin bridge: bash hook → Threshold TypeScript library → JSON output.
 * Usage: node tools/scripts/threshold-classify.mjs "[raw input]" "[session-id]"
 * Output: JSON to stdout — { id, type, spine_tag, scope_tag, urgency, pipelines, vault_type, swift_eligible }
 *
 * ALIGNMENT:
 *   WHO:     user-prompt-submit-intake.sh calling this for every Governor message
 *   WHAT:    Classify input with Threshold library, return structured JSON
 *   PREVENTS: Threshold library existing but never called for real Governor inputs
 *   RISK:    TypeScript compilation may fail in some environments — fallback always exits 0
 *   SCOPE:   Wrapper only — no new logic; wires bash → TypeScript library
 *
 * NON-NEGOTIABLE: Always exit 0. Never block a Governor message.
 */

const rawInput = process.argv[2] ?? '';
const sessionId = process.argv[3] ?? 'unknown';

// ─── VAULT TYPE INFERENCE ──────────────────────────────────────────────────
// Maps threshold type → vault type per VAULT-ARCHITECTURE.md
function inferVaultType(type) {
  switch (type) {
    case 'architectural_insight':
    case 'core_seed':
      return 'strategic';
    case 'governor_directive':
    case 'question':
      return 'operational';
    case 'error':
    case 'solution':
      return 'technical';
    case 'quote':
    case 'external_research':
      return 'insight';
    default:
      return 'pending';
  }
}

// SWIFT eligible: type=technical, scope=S1, urgency=high (or type=error)
function isSwiftEligible(type, scope, urgency) {
  if (type === 'error') return true;
  if (type === 'solution' && scope === 'S1') return true;
  if (urgency === 'high' && scope === 'S1') return true;
  return false;
}

// Vault type → routing
function inferRouting(vaultType, type) {
  if (type === 'architectural_insight' || vaultType === 'strategic') return 'opus';
  if (type === 'error' || vaultType === 'technical') return 'sonnet';
  if (type === 'quote' || vaultType === 'insight') return 'automated';
  return 'both';
}

// ─── FALLBACK CLASSIFIER ───────────────────────────────────────────────────
// Keyword-based rules — same schema as TypeScript library output.
// Used when tsx is not available or compilation fails.
function fallbackClassify(raw, session) {
  const lower = raw.toLowerCase();
  let type = 'governor_directive';
  let spine = 'GVRN';
  let scope = 'S2';
  let urgency = 'medium';

  // Type detection (first match wins)
  if (/upload|paste|ext-id|external.research/i.test(raw)) {
    type = 'external_research'; spine = 'AI'; urgency = 'low';
  } else if (/exit_code=1|blocking|build fail|verify fail|\berror\b.*\bfix\b|\bfix\b.*\berror\b/i.test(raw)) {
    type = 'error'; spine = 'VALD'; urgency = 'high';
  } else if (/fixed|resolved|exit_code=0|pass/i.test(raw)) {
    type = 'solution'; spine = 'VALD'; urgency = 'medium';
  } else if (/correction|wrong|should be|instead of|not like that/i.test(raw)) {
    type = 'correction'; spine = 'AI'; urgency = 'medium';
  } else if (/every session|pattern across|emerging|always|constitutional|structural/i.test(raw)) {
    type = 'core_seed'; spine = 'ARCH'; urgency = 'low';
  } else if (/handoff|session close|closing/i.test(raw)) {
    type = 'session_harvest'; spine = 'GVRN'; urgency = 'low';
  } else if (/principle|architecture|define|ratif/i.test(raw)) {
    type = 'architectural_insight'; spine = 'ARCH'; urgency = 'medium';
  } else if (raw.includes('>') && raw.length < 300) {
    type = 'quote'; spine = 'AI'; urgency = 'low';
  } else if (raw.includes('?')) {
    type = 'question'; spine = 'GVRN'; urgency = 'low';
  }

  // Scope detection (first match wins)
  if (/this specific|this instance|fix this|just this/i.test(raw)) {
    scope = 'S1';
  } else if (/structural|principle|always|constitutional|platform.wide/i.test(raw)) {
    scope = 'S3';
  }

  const vault_type = inferVaultType(type);
  const swift_eligible = isSwiftEligible(type, scope, urgency);
  const routing = inferRouting(vault_type, type);

  return {
    id: `thr-fallback-${Date.now()}`,
    type,
    spine_tag: spine,
    scope_tag: scope,
    urgency,
    pipelines: [],
    vault_type,
    swift_eligible,
    routing,
    source: 'fallback_classifier',
  };
}

// ─── MAIN: try tsx → fallback → always exit 0 ──────────────────────────────
async function main() {
  if (!rawInput || rawInput.length < 3) {
    process.stdout.write(JSON.stringify({ id: 'skip', type: 'question', vault_type: 'pending', swift_eligible: false }));
    process.exit(0);
  }

  // Attempt 1: use tsx to load real TypeScript library
  let classified = null;
  try {
    const { spawnSync } = await import('node:child_process');
    const { join, resolve, dirname } = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const root = resolve(__dirname, '../..');

    // Write a tiny runner script to temp
    const { writeFileSync, unlinkSync, existsSync } = await import('node:fs');
    const runnerPath = join(root, 'tools', 'scripts', '_threshold-run.ts');

    const runnerCode = `
import { processGovernorInput } from '../../libs/threshold/src/index.js';
const record = processGovernorInput(
  process.env.TH_RAW ?? '',
  process.env.TH_SESSION ?? 'unknown'
);
const out = {
  id: record.id,
  type: record.input.type,
  spine_tag: record.input.spine_tag,
  scope_tag: record.input.scope_tag,
  urgency: record.input.urgency,
  pipelines: record.routing.pipelines,
  vault_type: 'pending',
  swift_eligible: false,
  routing: 'both',
};
process.stdout.write(JSON.stringify(out));
`;

    writeFileSync(runnerPath, runnerCode, 'utf8');

    const result = spawnSync(
      'node',
      ['--import', 'tsx/esm', runnerPath],
      {
        env: { ...process.env, TH_RAW: rawInput.slice(0, 500), TH_SESSION: sessionId },
        timeout: 5000,
        encoding: 'utf8',
      }
    );

    try { unlinkSync(runnerPath); } catch { /* cleanup best effort */ }

    if (result.status === 0 && result.stdout) {
      classified = JSON.parse(result.stdout);
      // Enhance with vault routing (TypeScript library doesn't know vault types yet)
      classified.vault_type = inferVaultType(classified.type);
      classified.swift_eligible = isSwiftEligible(classified.type, classified.scope_tag, classified.urgency);
      classified.routing = inferRouting(classified.vault_type, classified.type);
    }
  } catch {
    classified = null;
  }

  // Attempt 2: fallback keyword classifier
  if (!classified) {
    classified = fallbackClassify(rawInput, sessionId);
  }

  process.stdout.write(JSON.stringify(classified));
  process.exit(0);
}

main().catch(() => {
  // Last-resort: output minimal valid JSON and always exit 0
  process.stdout.write(JSON.stringify({ id: 'err', type: 'governor_directive', vault_type: 'pending', swift_eligible: false }));
  process.exit(0);
});
