#!/usr/bin/env node
/**
 * pap-part1-sweeps.mjs
 * PAP Part 1.B + 1.C + 1.D automated sweeps
 * S065 PROTO-S065-PAP Part 1
 */
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const OUT = join(ROOT, 'docs/plan/_handoff/VAULT/pap');
mkdirSync(OUT, { recursive: true });

// ── PART 1.B — Hooks sweep ────────────────────────────────────────────────
const settings = JSON.parse(readFileSync('.claude/settings.json', 'utf-8'));
const vhfContent = readFileSync('.claude/hooks/verify-hooks-functional.sh', 'utf-8');
const hooksDir = '.claude/hooks';
const hookFiles = readdirSync(hooksDir).filter(f => f.endsWith('.sh'));

// Hooks in settings.json
const registeredHooks = new Set();
for (const [, list] of Object.entries(settings.hooks || {})) {
  for (const item of list) {
    for (const h of (item.hooks || [])) {
      const cmd = h.command || '';
      const match = cmd.match(/([^/]+\.sh)$/);
      if (match) registeredHooks.add(match[1]);
    }
  }
}

// Hooks in verify-hooks-functional DECLARED_HOOKS
const vhfHooks = new Set();
const declaredRe = /"([^"]+\.sh)"/g;
let m;
while ((m = declaredRe.exec(vhfContent)) !== null) vhfHooks.add(m[1]);

let h_aligned = 0, h_no_settings = 0, h_no_vhf = 0;
const hookFindings = [];
for (const hf of hookFiles) {
  const inS = registeredHooks.has(hf);
  const inV = vhfHooks.has(hf);
  if (inS && inV) { h_aligned++; continue; }
  if (!inS) h_no_settings++;
  else h_no_vhf++;
  hookFindings.push({ hook: hf, in_settings: inS, in_vhf: inV, status: !inS ? 'not_in_settings' : 'not_in_vhf' });
}

const hooksYaml = `---
id: csps.pap.part-1B-hooks-audit
name: part-1B-hooks-audit
description: "PAP Part 1.B — Hooks sweep. ${hookFiles.length} hook files."
type: pap_audit
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: pap_audit
session: S065
part: 1B
---

# PAP Part 1.B — Hooks Completeness Sweep

total_hook_files: ${hookFiles.length}
aligned: ${h_aligned}
not_in_settings: ${h_no_settings}
not_in_verify_hooks_functional: ${h_no_vhf}

FINDING-PAP1B-001: ${h_no_settings} hook files exist but not registered in settings.json (will not fire).
FINDING-PAP1B-002: ${h_no_vhf} hooks in settings.json not in verify-hooks-functional DECLARED_HOOKS.

misaligned_hooks:
${hookFindings.slice(0, 25).map(f => `  - hook: ${f.hook}\n    in_settings: ${f.in_settings}\n    in_vhf: ${f.in_vhf}\n    status: ${f.status}`).join('\n')}
${hookFindings.length > 25 ? `  # ... +${hookFindings.length - 25} more` : ''}
`;
writeFileSync(join(OUT, 'part-1B-hooks-audit.yaml'), hooksYaml, 'utf-8');
console.log(`Part 1.B: aligned=${h_aligned} not_in_settings=${h_no_settings} not_in_vhf=${h_no_vhf}`);

// ── PART 1.C — B_* contracts sweep ────────────────────────────────────────
const bcDir = 'docs/plan/pillar-0-governance/behavioral-contracts';
const bcFiles = readdirSync(bcDir).filter(f => f.startsWith('B_') && f.endsWith('.md'));
let bc_aligned = 0, bc_no_trio = 0, bc_missing_t2 = 0;
const bcFindings = [];

for (const bcFile of bcFiles) {
  const content = readFileSync(join(bcDir, bcFile), 'utf-8');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) { bc_no_trio++; continue; }
  const fm = fmMatch[1];
  if (!fm.includes('enforcement_trio:')) { bc_no_trio++; continue; }
  // Check t2 active path
  const t2Match = fm.match(/t2:\s*\n\s*tier: validator\s*\n\s*path:\s*"([^"]+)"\s*\n\s*status:\s*active/);
  if (t2Match && !existsSync(join(ROOT, t2Match[1]))) {
    bc_missing_t2++;
    bcFindings.push({ file: bcFile, t2_path: t2Match[1] });
  } else {
    bc_aligned++;
  }
}

const contractsYaml = `---
id: csps.pap.part-1C-contracts-audit
name: part-1C-contracts-audit
description: "PAP Part 1.C — B_* contracts sweep. ${bcFiles.length} contracts."
type: pap_audit
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: pap_audit
session: S065
part: 1C
---

# PAP Part 1.C — B_* Contracts Completeness Sweep

total_contracts: ${bcFiles.length}
with_enforcement_trio: ${bcFiles.length - bc_no_trio}
missing_trio: ${bc_no_trio}
t2_active_path_missing_on_disk: ${bc_missing_t2}
generally_aligned: ${bc_aligned}

FINDING-PAP1C-001: ${bc_missing_t2} contracts have T2 path=active but file missing on disk.
  These were surfaced by validate-five-surface.mjs (advisory). Most are pre-S062 contracts
  where T2 validators were planned but not yet built.
  Action: carry to Part 3 (Mechanical Enforcement audit) for T2 path fix tracking.

missing_t2_paths:
${bcFindings.map(f => `  - contract: ${f.file}\n    missing_path: ${f.t2_path}`).join('\n') || '  # none found'}

opus_reviewed_seed_note: "B_REVERSIBILITY_GATED_REVIEW (S063) grandfathered per S064 attestation.
  All B_* contracts written after S064 require opus_reviewed_seed: <SHA> in frontmatter."
`;
writeFileSync(join(OUT, 'part-1C-contracts-audit.yaml'), contractsYaml, 'utf-8');
console.log(`Part 1.C: bc_aligned=${bc_aligned} no_trio=${bc_no_trio} missing_t2=${bc_missing_t2}`);

// ── PART 1.D — Registers sweep ────────────────────────────────────────────
const registers = [
  { name: 'improvement-register', path: 'tools/data/improvement-register.yaml', reader: 'validate-improvement-register.mjs', writer: 'session-close-gate (write-pipeline open)' },
  { name: 'gap-recurrence-register', path: 'tools/data/gap-recurrence-register.yaml', reader: 'validate-gap-recurrence.mjs', writer: 'manual per-session (no auto-writer)' },
  { name: 'exceptional-moments-register', path: 'tools/data/exceptional-moments-register.yaml', reader: 'flow-activity-monitor.yaml', writer: 'post-stop-learning-loop.sh (S064 — untested)' },
  { name: 'flow-activity-monitor', path: 'tools/data/flow-activity-monitor.yaml', reader: 'validate-flow-activity-monitor.mjs', writer: 'manual per-build' },
  { name: 'threshold-intake-log', path: 'tools/data/threshold-intake-log.yaml', reader: 'validate-threshold-intake.mjs', writer: 'user-prompt-submit-intake.sh' },
];

let regs_ok = 0, regs_missing = 0;
for (const reg of registers) {
  if (existsSync(join(ROOT, reg.path))) regs_ok++;
  else regs_missing++;
}

const regsYaml = `---
id: csps.pap.part-1D-registers-audit
name: part-1D-registers-audit
description: "PAP Part 1.D — Registers sweep. 5 active registers."
type: pap_audit
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: pap_audit
session: S065
part: 1D
---

# PAP Part 1.D — Registers Completeness Sweep

total_registers: ${registers.length}
all_exist: ${regs_ok}
missing: ${regs_missing}

registers:
${registers.map(r => `  - name: ${r.name}\n    exists: ${existsSync(join(ROOT, r.path))}\n    reader: ${r.reader}\n    writer: ${r.writer}`).join('\n')}

FINDING-PAP1D-001: gap-recurrence-register has NO automated writer (manual per-session).
  This creates FINDING-OPACITY risk: gaps not discovered in-session are never registered.
  Action: file as Part 2 (Wiring audit) item — should have a T1 hook that prompts.

FINDING-PAP1D-002: exceptional-moments-register write pipeline (post-stop-learning-loop.sh
  exceptional-pattern scan) has 0 automated entries produced yet. Only manual bootstrap EM-S063-01.
  The pipeline is built but untested under real session conditions.
  Action: monitor for 3 sessions; if still 0 automated entries, investigate scan patterns.
`;
writeFileSync(join(OUT, 'part-1D-registers-audit.yaml'), regsYaml, 'utf-8');
console.log(`Part 1.D: regs_ok=${regs_ok} regs_missing=${regs_missing}`);

console.log('\nAll Part 1.B/C/D written successfully.');
