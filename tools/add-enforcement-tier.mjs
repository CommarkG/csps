import { readFileSync, writeFileSync } from 'fs';

const c = readFileSync('./packages/principles/principles.yaml', 'utf8');
const lines = c.split('\n');

// Map of hook assignments based on principle domain
function getET(id) {
  // ZF/RZF discipline
  if (id === 'P-META-006') {
    return [
      '    enforcement_tier:',
      '      tier1_hook: pre-tool-use-rzf-evidence-gate.sh + post-stop-rzf-reminder.sh (BLOCKING — ZF evidence required before any DONE/RATIFIED/VALIDATED/CLOSED claim)',
      '      tier2_validator: pnpm verify full-pass (indirect ZF coverage via contract validators)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh: zero-findings discipline injection"',
    ];
  }
  // Cycle-mandatory-in-plan / plan coverage gate
  if (id === 'P-META-008') {
    return [
      '    enforcement_tier:',
      '      tier1_hook: pre-tool-use-plan-coverage-gate.sh (BLOCKING — cycle evidence required; blocks unsubstantiated DONE claims)',
      '      tier2_validator: tools/validators/validate-implementation-gate.mjs (BLOCKING — PI reference required on implementation commits)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh: cycle-mandatory-in-plan injection"',
    ];
  }
  // Concept-first / Threshold / Intent crystallization
  if (['P-META-020', 'P-META-021', 'P-META-022', 'P-META-023', 'P-META-024', 'P-META-025'].includes(id)) {
    return [
      '    enforcement_tier:',
      '      tier1_hook: pre-tool-use-plan-coverage-gate.sh (BLOCKING — concept-first gate; plan-coverage required before implementation)',
      '      tier2_validator: pnpm verify full-pass (indirect coverage via contract validators)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh principle injection"',
    ];
  }
  // Frontmatter / closed enum enforcement
  if (['P-META-004', 'P-ARCH-023', 'P-ARCH-029'].includes(id)) {
    return [
      '    enforcement_tier:',
      '      tier1_hook: pre-tool-use-frontmatter-enum-check.sh (BLOCKING — validates closed-enum lifecycle_state and closed fields before write)',
      '      tier2_validator: tools/validators/validate-frontmatter.mjs (BLOCKING — full frontmatter contract enforcement)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh principle injection"',
    ];
  }
  // Agent alignment protocol
  if (id === 'P-META-010') {
    return [
      '    enforcement_tier:',
      '      tier1_hook: pre-tool-use-agent-alignment.sh (BLOCKING — AAP check fires before any agent invocation)',
      '      tier2_validator: pnpm verify full-pass (indirect coverage via validate-aap-frontmatter.mjs)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh: agent-alignment-protocol injection"',
    ];
  }
  // Sacred file guard / core spine
  if (id === 'P-ARCH-028') {
    return [
      '    enforcement_tier:',
      '      tier1_hook: pre-tool-use-sacred-file-guard.sh (BLOCKING — L1_CORE spine files are write-protected)',
      '      tier2_validator: tools/validators/validate-frontmatter.mjs (BLOCKING — core_spine field required on governed artifacts)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh: core-spine discipline injection"',
    ];
  }
  // Five-surface engraving
  if (id === 'P-META-007') {
    return [
      '    enforcement_tier:',
      '      tier1_hook: pre-tool-use-state-claim-gate.sh (BLOCKING — 5-surface engraving evidence required before catch closure)',
      '      tier2_validator: pnpm verify full-pass (indirect coverage via contract validators)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh: five-surface-engraving injection"',
    ];
  }
  // Principles-travel-with-artifacts / inheritance-via-shared-runtime — state claims
  if (['P-META-002', 'P-META-003'].includes(id)) {
    return [
      '    enforcement_tier:',
      '      tier1_hook: pre-tool-use-state-claim-gate.sh (BLOCKING — evidence required before DONE/RATIFIED state transitions)',
      '      tier2_validator: pnpm verify full-pass (indirect coverage via contract validators)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh principle injection"',
    ];
  }
  // Handoff pre-flight audit + MUV — humble/step gates
  if (['P-META-013', 'P-META-014'].includes(id)) {
    return [
      '    enforcement_tier:',
      '      tier1_hook: pre-tool-use-humble-step-gate.sh (BLOCKING — handshake or audit evidence required before session boundary actions)',
      '      tier2_validator: pnpm verify full-pass (indirect coverage via contract validators)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh principle injection"',
    ];
  }
  // Governor prompts — humble/step gate (session close gate)
  if (id === 'P-META-012') {
    return [
      '    enforcement_tier:',
      '      tier1_hook: pre-tool-use-humble-step-gate.sh (BLOCKING — GP coverage evidence required before session close actions)',
      '      tier2_validator: pnpm verify full-pass (indirect coverage via contract validators)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh: governor-prompts injection"',
    ];
  }
  // Cognitive context architecture
  if (id === 'P-META-009') {
    return [
      '    enforcement_tier:',
      '      tier1_hook: AGENTS.md enforcement + session-open.sh guidance (behavioral level — QG1-QG4 quality gates)',
      '      tier2_validator: pnpm verify full-pass (indirect via validate-token-budget.mjs)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh: cognitive-context-architecture injection"',
    ];
  }
  // OPER-001 zero-laptop-dependency
  if (id === 'P-OPER-001') {
    return [
      '    enforcement_tier:',
      '      tier1_hook: AGENTS.md enforcement + session-open.sh guidance (behavioral level — auto-push required before handoff)',
      '      tier2_validator: pnpm verify full-pass (indirect coverage via git pushed-state checks)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh: zero-laptop-dependency injection"',
    ];
  }
  // META-001 defense-in-depth (meta-audit enforcer)
  if (id === 'P-META-001') {
    return [
      '    enforcement_tier:',
      '      tier1_hook: AGENTS.md enforcement + session-open.sh guidance (behavioral level — meta-audit enforcer count check)',
      '      tier2_validator: pnpm verify full-pass (indirect via principle-coverage meta-audit)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh principle injection"',
    ];
  }
  // META-005 learning-loop — vault/write gate
  if (id === 'P-META-005') {
    return [
      '    enforcement_tier:',
      '      tier1_hook: pre-tool-use-vault-write-gate.sh (BLOCKING — learning-loop intake required before closing session)',
      '      tier2_validator: pnpm verify full-pass (indirect coverage via contract validators)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh: learning-loop injection"',
    ];
  }
  // META-011 audit-orchestration
  if (id === 'P-META-011') {
    return [
      '    enforcement_tier:',
      '      tier1_hook: AGENTS.md enforcement + session-open.sh guidance (behavioral level — pipeline membership required)',
      '      tier2_validator: pnpm verify full-pass (indirect via audit-hub orchestration validators)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh: audit-orchestration injection"',
    ];
  }
  // META-015 universal-template-first
  if (id === 'P-META-015') {
    return [
      '    enforcement_tier:',
      '      tier1_hook: pre-tool-use-vault-write-gate.sh (BLOCKING — template citation required on commitment-layer artifact writes)',
      '      tier2_validator: pnpm verify full-pass (indirect coverage via contract validators)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh: universal-template-first injection"',
    ];
  }
  // META-016 gradual-build-by-foundations
  if (id === 'P-META-016') {
    return [
      '    enforcement_tier:',
      '      tier1_hook: pre-tool-use-plan-coverage-gate.sh (BLOCKING — gradual-build-plan instance required for multi-session topics)',
      '      tier2_validator: pnpm verify full-pass (indirect coverage via contract validators)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh: gradual-build-by-foundations injection"',
    ];
  }
  // META-017 csps-alignment-over-inner-defaults
  if (id === 'P-META-017') {
    return [
      '    enforcement_tier:',
      '      tier1_hook: AGENTS.md enforcement + session-open.sh guidance (behavioral level — inner-default override map)',
      '      tier2_validator: pnpm verify full-pass (indirect coverage via contract validators)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh: csps-alignment-over-inner-defaults injection"',
    ];
  }
  // META-018 pe-alignment-guardian
  if (id === 'P-META-018') {
    return [
      '    enforcement_tier:',
      '      tier1_hook: AGENTS.md enforcement + session-open.sh guidance (behavioral level — structured deflection required)',
      '      tier2_validator: pnpm verify full-pass (indirect coverage via contract validators)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh: pe-alignment-guardian injection"',
    ];
  }
  // META-019 structural-prevention-discipline
  if (id === 'P-META-019') {
    return [
      '    enforcement_tier:',
      '      tier1_hook: AGENTS.md enforcement + session-open.sh guidance (behavioral level — enhancement proposals mandatory)',
      '      tier2_validator: pnpm verify full-pass (indirect coverage via contract validators)',
      '      tier3_session: "AGENTS.md hard-NO + session-open.sh: structural-prevention-discipline injection"',
    ];
  }
  // Default for all remaining (P-OP-*, P-ARCH-0xx stubs and others)
  return [
    '    enforcement_tier:',
    '      tier1_hook: AGENTS.md enforcement + session-open.sh guidance (behavioral level)',
    '      tier2_validator: pnpm verify full-pass (indirect coverage via contract validators)',
    '      tier3_session: "AGENTS.md hard-NO + session-open.sh principle injection"',
  ];
}

// Build principles list with line ranges
const principles = [];
let currentId = null;
let startLine = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].match(/^  - id: P-/)) {
    if (currentId) {
      principles.push({ id: currentId, start: startLine, end: i });
    }
    currentId = lines[i].replace('  - id: ', '').trim();
    startLine = i;
  }
}
if (currentId) {
  principles.push({ id: currentId, start: startLine, end: lines.length });
}

// Find those missing enforcement_tier and their last-content line
const toUpdate = [];
for (const p of principles) {
  const block = lines.slice(p.start, p.end);
  const blockStr = block.join('\n');
  if (blockStr.indexOf('enforcement_tier:') === -1) {
    let lastContent = -1;
    for (let i = block.length - 1; i >= 0; i--) {
      if (block[i].trim() !== '') {
        lastContent = i;
        break;
      }
    }
    toUpdate.push({ id: p.id, start: p.start, end: p.end, insertAfter: p.start + lastContent });
  }
}

console.log('Will update:', toUpdate.length, 'principles');

// Insert in REVERSE order so line numbers stay valid
toUpdate.sort((a, b) => b.insertAfter - a.insertAfter);

const newLines = lines.slice();
let updatedCount = 0;
for (const p of toUpdate) {
  const etLines = getET(p.id);
  newLines.splice(p.insertAfter + 1, 0, ...etLines);
  updatedCount++;
}

const output = newLines.join('\n');
writeFileSync('./packages/principles/principles.yaml', output, 'utf8');
console.log('Updated', updatedCount, 'principles. Written to principles.yaml');
