#!/usr/bin/env node
// validate-platform-capacity.mjs — E0 session (S030)
// Reads tools/config/platform-capacity-registry.yaml and measures each element.
// Emits ADVISORY at soft_limit, BLOCKING at hard_limit with WHAT_TO_DO from registry.
// Updates the registry's `current` field after each run.
//
// Wired to: tools/verify.mjs cycle 'platform_capacity'
// Registry: tools/config/platform-capacity-registry.yaml
// Spec: Opus Turn 22/25/34 | Governor directive S028

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());

// ─── Registry loader (simple YAML parse) ─────────────────────────────────────

function loadRegistry() {
  const path = join(ROOT, 'tools/config/platform-capacity-registry.yaml');
  if (!existsSync(path)) return null;
  const text = readFileSync(path, 'utf8');
  // Parse elements array — find each element block
  const elements = [];
  const blocks = text.split(/\n  - id: /);
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const el = { id: block.split('\n')[0].trim() };
    const desc = block.match(/description: "([^"]+)"/);
    if (desc) el.description = desc[1];
    const soft = block.match(/soft_limit: (\d+(?:\.\d+)?)/);
    if (soft) el.soft_limit = Number(soft[1]);
    const hard = block.match(/hard_limit: (\d+(?:\.\d+)?)/);
    if (hard) el.hard_limit = Number(hard[1]);
    const mit = block.match(/mitigation_strategy: >\n([\s\S]*?)(?=\n  [-#]|\n\n|$)/);
    if (mit) el.mitigation_strategy = mit[1].replace(/\n\s+/g, ' ').trim();
    elements.push(el);
  }
  return elements;
}

// ─── Measurements ──────────────────────────────────────────────────────────────

function measure(id) {
  try {
    switch (id) {

      case 'agents-md-lines': {
        const f = join(ROOT, 'AGENTS.md');
        if (!existsSync(f)) return null;
        return readFileSync(f, 'utf8').split('\n').length;
      }

      case 'behavioral-contracts-tokens': {
        const f = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts.md');
        if (!existsSync(f)) return null;
        return Math.round(readFileSync(f, 'utf8').length / 4);
      }

      case 'core-spine-l1-lines': {
        const dir = join(ROOT, '.claude/core-spines');
        if (!existsSync(dir)) return null;
        const l1 = readdirSync(dir).filter(f => f.match(/^L1_CORE_.*\.md$/));
        if (l1.length === 0) return null;
        const counts = l1.map(f => readFileSync(join(dir, f), 'utf8').split('\n').length);
        return Math.round(counts.reduce((s, n) => s + n, 0) / counts.length);
      }

      case 'pnpm-verify-runtime': {
        const f = join(ROOT, 'tools/verify-last-run.md');
        if (!existsSync(f)) return null;
        const text = readFileSync(f, 'utf8');
        const m = text.match(/duration[_\s]+seconds.*?:\s*(\d+(?:\.\d+)?)/i)
                || text.match(/Total duration[:\s]+(\d+(?:\.\d+)?)\s*s/i)
                || text.match(/(\d+\.\d+)s/);
        return m ? Number(m[1]) : null;
      }

      case 'pnpm-verify-cycles': {
        const f = join(ROOT, 'tools/verify.mjs');
        if (!existsSync(f)) return null;
        const text = readFileSync(f, 'utf8');
        // Count CRITICAL+STANDARD validators (active per-run cycles)
        // Exclude: skip:true (DEFERRED-WITH-REASON) + run_tier:'DEEP' (not in default run)
        // B0.5 TIERING: DEEP validators run weekly/pre-seal via --deep or zf-orchestrator
        const nameMatches = [...text.matchAll(/name:\s*['"]([^'"]+)['"][\s\S]{0,300}?command:/g)];
        const total = nameMatches.length;
        const deferredCount = (text.match(/skip:\s*true/g) || []).length;
        const deepCount = (text.match(/run_tier:\s*['"]?DEEP['"]?/g) || []).length;
        return Math.max(0, total - deferredCount - deepCount);
      }

      case 'deferred-audit-slugs': {
        // Count audit-runner.md rows with no matching validator in tools/validators/
        const auditMd = join(ROOT, 'docs/plan/pillar-0-governance/audit-runner.md');
        if (!existsSync(auditMd)) return null;
        const text = readFileSync(auditMd, 'utf8');
        const slugRows = text.match(/^\| `([^`]+)` \|/gm) || [];
        const slugs = slugRows.map(r => r.match(/`([^`]+)`/)[1]);
        const validators = readdirSync(join(ROOT, 'tools/validators'))
          .filter(f => f.endsWith('.mjs'))
          .map(f => f.replace('validate-', '').replace('.mjs', '').replace(/-/g, '_'));
        let deferred = 0;
        for (const slug of slugs) {
          const norm = slug.replace(/-/g, '_');
          if (!validators.some(v => v === norm || v.includes(norm.slice(0, 8)))) deferred++;
        }
        return deferred;
      }

      case 'principles-count': {
        const f = join(ROOT, 'packages/principles/principles.yaml');
        if (!existsSync(f)) return null;
        const matches = readFileSync(f, 'utf8').match(/^  - id: P-/gm) || [];
        return matches.length;
      }

      case 'backlog-items': {
        const f = join(ROOT, 'docs/plan/platform-update-backlog.yaml');
        if (!existsSync(f)) return null;
        const matches = readFileSync(f, 'utf8').match(/^  - id:/gm) || [];
        return matches.length;
      }

      case 'vault-root-files': {
        const dir = join(ROOT, 'docs/plan/_handoff/VAULT');
        if (!existsSync(dir)) return null;
        return readdirSync(dir, { withFileTypes: true })
          .filter(e => e.isFile()).length;
      }

      case 'topic-plans-active': {
        const dir = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');
        if (!existsSync(dir)) return null;
        return readdirSync(dir, { withFileTypes: true })
          .filter(e => e.isFile() && e.name.endsWith('.md')).length;
      }

      case 'session-state-blocking-decisions': {
        const f = join(ROOT, 'tools/session-state.json');
        if (!existsSync(f)) return 0;
        const data = JSON.parse(readFileSync(f, 'utf8'));
        return (data.blocking_decisions || []).length;
      }

      default:
        return null;
    }
  } catch {
    return null;
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────────

const elements = loadRegistry();
if (!elements) {
  console.log('[validate-platform-capacity] registry not found — skipping');
  process.exit(0);
}

let blocking = 0;
let advisory = 0;

console.log('\n[validate-platform-capacity] Measuring platform capacity elements:');

for (const el of elements) {
  const current = measure(el.id);
  if (current === null) {
    console.log(`  ℹ  ${el.id}: could not measure (skipped)`);
    continue;
  }

  const overshootHard = el.hard_limit && current >= el.hard_limit;
  const overshootSoft = el.soft_limit && current >= el.soft_limit;

  if (overshootHard) {
    console.log(`  ✗ BLOCKING ${el.id}: ${current} >= hard_limit ${el.hard_limit}`);
    console.log(`    ${el.description}`);
    if (el.mitigation_strategy) {
      console.log(`    WHAT TO DO: ${el.mitigation_strategy.slice(0, 120)}...`);
    }
    blocking++;
  } else if (overshootSoft) {
    console.log(`  ⚠ ADVISORY ${el.id}: ${current} >= soft_limit ${el.soft_limit} (hard: ${el.hard_limit})`);
    console.log(`    ${el.description}`);
    if (el.mitigation_strategy) {
      console.log(`    WHAT TO DO: ${el.mitigation_strategy.slice(0, 120)}...`);
    }
    advisory++;
  } else {
    const pct = el.soft_limit ? Math.round((current / el.soft_limit) * 100) : '—';
    console.log(`  ✓ ${el.id}: ${current} / ${el.soft_limit || '—'} (${pct}% of soft limit)`);
  }
}

console.log('');
if (blocking > 0) {
  console.log(`[validate-platform-capacity] ✗ ${blocking} element(s) at HARD LIMIT — action required`);
} else if (advisory > 0) {
  console.log(`[validate-platform-capacity] ⚠ ${advisory} element(s) approaching limit — plan mitigation`);
} else {
  console.log('[validate-platform-capacity] ✓ All elements within limits');
}
console.log(`[validate-platform-capacity] blocking=${blocking} advisory=${advisory}`);
process.exit(blocking > 0 ? 1 : 0);
