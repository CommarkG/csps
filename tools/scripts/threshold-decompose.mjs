#!/usr/bin/env node
/**
 * threshold-decompose.mjs — Modular decomposition step (Phase-0.2 chain)
 *
 * PROTO-S088-PHASE-0.2 | S088
 * Takes a classified ThresholdInput (4-axis: type, spine_tag, scope_tag, urgency) and
 * decomposes into uniform-DNA structure:
 *   core:                  primary capability + action required
 *   layers:                which depth layers are activated (governance/architecture/operations/validation)
 *   cross_domain_branches: adjacent spines this input structurally touches
 *
 * Per uniform-DNA: capabilities decomposed at intake into core+layers+cross-domain branches.
 * NEW logic — sits between classify (4-axis) and PE-significance + route steps.
 * Stateless pure function. No file I/O. No platform side effects.
 *
 * Usage (CLI):
 *   node tools/scripts/threshold-decompose.mjs --type governor_directive --spine GVRN --scope S2 --urgency high
 * Or (import):
 *   import { decompose } from './threshold-decompose.mjs'
 *   const result = decompose({ type, spine_tag, scope_tag, urgency })
 *
 * @csps-dna core_spine: ARCH
 * @csps-id csps.scripts.threshold-decompose
 */

// ─── ACTION MAP ─────────────────────────────────────────────────────────────
// type → primary action required (governs what the chain does with this input)
const ACTION_MAP = {
  governor_directive:    'implement',
  capability_proposal:   'assess-then-build-or-park',
  architectural_insight: 'engrave-and-propagate',
  error:                 'fix',
  solution:              'verify-and-close',
  external_research:     'assess-then-vault-or-integrate',
  session_harvest:       'consolidate',
  correction:            'align-and-engrave',
  core_seed:             'ratify-and-propagate',
  question:              'answer-and-resolve',
  quote:                 'capture-and-cite',
};

// ─── LAYER ACTIVATION ────────────────────────────────────────────────────────
// Which depth layers are activated per spine + scope + type.
// Layers: governance | architecture | operations | validation
function activateLayers(type, spine_tag, scope_tag) {
  const LAYER_NAMES = ['governance', 'architecture', 'operations', 'validation'];
  const layers = LAYER_NAMES.map(layer => ({ layer, active: false, reason: '' }));

  const activate = (idx, reason) => {
    if (!layers[idx].active) { layers[idx].active = true; layers[idx].reason = reason; }
  };

  // Spine → primary layer (always active for the primary spine)
  if (spine_tag === 'GVRN')  activate(0, 'GVRN spine: governance layer primary');
  if (spine_tag === 'ARCH')  activate(1, 'ARCH spine: architecture layer primary');
  if (spine_tag === 'OPER')  activate(2, 'OPER spine: operations layer primary');
  if (spine_tag === 'VALD')  activate(3, 'VALD spine: validation layer primary');
  if (spine_tag === 'AI') {
    activate(0, 'AI spine: inner-defaults = governance decisions');
    activate(3, 'AI spine: behavior changes require audit');
  }

  // Scope → layer expansion (S3 platform-wide activates ALL layers)
  if (scope_tag === 'S3') {
    LAYER_NAMES.forEach((_, idx) => activate(idx, 'S3 scope: platform-wide impact activates all layers'));
  }

  // Type-specific overrides (add secondary layers per type semantics)
  if (type === 'error') {
    activate(1, 'error type: architecture layer (code-level fix required)');
    activate(3, 'error type: validation layer (fix must be verified)');
  }
  if (type === 'core_seed') {
    LAYER_NAMES.forEach((_, idx) => activate(idx, 'core_seed: S3 ratification activates all layers'));
  }
  if (type === 'correction') {
    activate(0, 'correction: governance layer (inner-default update)');
    activate(3, 'correction: validation layer (audit the correction)');
  }
  if (type === 'capability_proposal') {
    activate(1, 'capability_proposal: architecture layer (design decision required)');
    activate(0, 'capability_proposal: governance layer (assess-or-park gate)');
  }
  if (type === 'architectural_insight') {
    activate(1, 'architectural_insight: architecture layer primary');
    activate(3, 'architectural_insight: validation layer (engrave + verify)');
  }

  return layers;
}

// ─── CROSS-DOMAIN BRANCHES ───────────────────────────────────────────────────
// Which adjacent spines this input structurally touches.
// Returns branches where spine != spine_tag (no self-references).
function detectBranches(type, spine_tag, scope_tag) {
  const branches = [];
  const ALL_SPINES = ['GVRN', 'ARCH', 'AI', 'OPER', 'VALD'];

  const add = (spine, relationship, reason) => {
    if (spine !== spine_tag && !branches.find(b => b.spine === spine)) {
      branches.push({ spine, relationship, reason });
    }
  };

  // GVRN: ratification decisions → VALD (audit-runner entry required)
  if (spine_tag === 'GVRN') {
    add('VALD', 'dependency', 'GVRN decisions require validation (audit-runner + validator)');
    if (type === 'governor_directive') add('ARCH', 'adjacent', 'governor_directive often produces ARCH artifacts');
  }

  // ARCH: code changes → VALD (green receipt); may touch OPER (deploy/hook)
  if (spine_tag === 'ARCH') {
    add('VALD', 'dependency', 'ARCH changes require validator / verify-green gate');
    add('OPER', 'adjacent', 'ARCH changes may trigger hook or deployment updates');
  }

  // AI: inner-default changes → GVRN ratification + VALD audit
  if (spine_tag === 'AI') {
    add('GVRN', 'dependency', 'AI inner-default changes require governance ratification');
    add('VALD', 'dependency', 'AI inner-default changes require audit trail');
  }

  // VALD: validation events → ARCH (the code causing the finding)
  if (spine_tag === 'VALD') {
    add('ARCH', 'dependency', 'VALD events point to ARCH code requiring fix');
  }

  // OPER: operational changes → VALD (verify operational health)
  if (spine_tag === 'OPER') {
    add('VALD', 'adjacent', 'OPER changes: validate operational impact');
  }

  // Type-specific cross-domain additions
  if (type === 'core_seed') {
    // core_seed propagation crosses ALL spines
    ALL_SPINES.forEach(s => add(s, 'adjacent', 'core_seed propagation crosses all spines'));
  }
  if (type === 'architectural_insight') {
    add('GVRN', 'adjacent', 'architectural_insight: may need governance ratification');
  }
  if (type === 'capability_proposal') {
    add('GVRN', 'dependency', 'capability_proposal: must pass governance assess-or-park gate');
    add('VALD', 'adjacent', 'capability_proposal: validation surface required if built');
  }

  // S3 scope: cross all spines (platform-wide touches everything)
  if (scope_tag === 'S3') {
    ALL_SPINES.forEach(s => add(s, 'adjacent', 'S3 platform-wide scope may cross into ' + s));
  }

  return branches;
}

// ─── decompose ───────────────────────────────────────────────────────────────
/**
 * Modular decomposition of a classified ThresholdInput.
 * @param {{ type?: string, spine_tag?: string, scope_tag?: string, urgency?: string }} classified
 * @returns {{ core: object, layers: object[], cross_domain_branches: object[], decomposed_at: string }}
 */
export function decompose({
  type     = 'governor_directive',
  spine_tag = 'GVRN',
  scope_tag = 'S2',
  urgency  = 'medium',
} = {}) {
  const core = {
    type,
    spine:       spine_tag,
    urgency,
    action:      ACTION_MAP[type] ?? 'process',
    scope_class: scope_tag === 'S3' ? 'platform-wide'
                : scope_tag === 'S2' ? 'session-structural'
                :                      'instance',
  };

  return {
    core,
    layers:               activateLayers(type, spine_tag, scope_tag),
    cross_domain_branches: detectBranches(type, spine_tag, scope_tag),
    decomposed_at:        new Date().toISOString(),
  };
}

// ─── CLI ─────────────────────────────────────────────────────────────────────
if (process.argv[1]?.endsWith('threshold-decompose.mjs')) {
  const args = Object.fromEntries(
    process.argv.slice(2)
      .filter(a => a.startsWith('--'))
      .map(a => a.slice(2).split('='))
  );
  const result = decompose({
    type:      args.type     || 'governor_directive',
    spine_tag: args.spine    || 'GVRN',
    scope_tag: args.scope    || 'S2',
    urgency:   args.urgency  || 'medium',
  });
  console.log(JSON.stringify(result, null, 2));
}
