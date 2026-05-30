#!/usr/bin/env node
/**
 * threshold-router.mjs — M-42 UNIFIED THRESHOLD-ROUTER (PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 3)
 *
 * Classifies input on 4 axes (spine × scope × intent × mandate-relation)
 * and routes to one of: PROCESS-NOW | VAULT | ESCALATE | INVOKE:<skill>
 *
 * Per Item 1 ratification: TIERED routing.
 *   SHAPE-TIER: conversational fast-path (PROCESS-NOW immediately)
 *   FULL-ROUTE: substantive (run all 4 axes)
 *
 * Usage:
 *   import { routeInput } from './threshold-router.mjs'
 *   const result = routeInput({ type, spine, urgency, content, shapeTier })
 *
 * Or from bash:
 *   node tools/scripts/threshold-router.mjs --type=governor_directive --spine=GVRN --urgency=high
 *
 * inherits_from: PROTO-S067-MASTER-THRESHOLD-ROUTER M-42 + M-16 Threshold + M-17 reuse-first
 */

/**
 * AXIS 1 — SPINE
 * GVRN: governance decisions, ratification, session management
 * ARCH: schema, code, infrastructure
 * AI: behavioral contracts, skills, inner-defaults
 * OPER: deployment, hooks, operational
 * VALD: validation, ZF, evidence
 */

/**
 * AXIS 2 — SCOPE
 * constitutional: platform-wide, permanent changes (M-42 class C12-C13)
 * architectural: cross-pillar structural impact
 * operational: within-session, reversible, mechanical
 * tactical: conversational, trivial, no platform impact
 */

/**
 * AXIS 3 — INTENT
 * directive: "do X", "build Y", "fix Z" — action required
 * proposal: "should we?", "what if?", "option A vs B"
 * question: "what is?", "how does?", "why?"
 * maintenance: "update this", "clean that", "patch small thing"
 */

/**
 * AXIS 4 — MANDATE-RELATION
 * in-mandate: directly in current session mandate
 * adjacent: same PROTO/domain but not primary mandate
 * orthogonal: different domain; governor #3 priorities
 * new-request: never-before-seen, needs PE evaluation
 */

/**
 * ROUTING TABLE (M-42 ratified)
 * PROCESS-NOW: governor directive + in-mandate OR urgent fix
 * VAULT: internal-low-weight (maintenance/tactical/adjacent)
 * ESCALATE: constitutional scope OR cross-spine impact
 * INVOKE consolidation-expert: proposal-class with reusable surface (D7+C7)
 * INVOKE cruel-critic: high-stakes architectural decision (D2+D10)
 * INVOKE vocabulary-canon: naming/frontmatter/enum questions (D4+D8)
 */

const ROUTES = {
  PROCESS_NOW: 'PROCESS-NOW',
  VAULT: 'VAULT',
  ESCALATE: 'ESCALATE',
  INVOKE_CONSOLIDATION: 'INVOKE:consolidation-expert',
  INVOKE_CRUEL_CRITIC: 'INVOKE:cruel-critic',
  INVOKE_VOCAB: 'INVOKE:vocabulary-canon',
};

/**
 * routeInput — classify and route one intake event
 * @param {Object} input
 * @param {string} input.type - governor_directive | proposal | question | maintenance
 * @param {string} input.spine - GVRN | ARCH | AI | OPER | VALD
 * @param {string} input.urgency - high | medium | low
 * @param {string} [input.scope] - constitutional | architectural | operational | tactical
 * @param {string} [input.content] - preview of input content for pattern detection
 * @param {boolean} [input.shapeTier] - true if SHAPE-TIER: conversational (fast-path)
 * @returns {{ route: string, axis_classification: Object, rationale: string }}
 */
export function routeInput({ type, spine, urgency, scope, content = '', shapeTier = false }) {
  // SHAPE-TIER fast-path: conversational inputs bypass full classification
  if (shapeTier) {
    return {
      route: ROUTES.PROCESS_NOW,
      axis_classification: { spine, scope: 'tactical', intent: 'conversational', mandate_relation: 'adjacent' },
      rationale: 'SHAPE-TIER fast-path: conversational input, no full routing required',
    };
  }

  // Axis 2: scope detection (if not provided, infer)
  let detectedScope = scope || 'operational';
  if (!scope) {
    if (/constitutional|platform-wide|PROTO.*gate|B_\w+|P-META/i.test(content)) detectedScope = 'constitutional';
    else if (/schema|migrate|architecture|cross-pillar/i.test(content)) detectedScope = 'architectural';
    else if (/fix|patch|update|clean/i.test(content)) detectedScope = 'operational';
    else detectedScope = 'tactical';
  }

  // Axis 3: intent from type
  const intentMap = {
    'governor_directive': 'directive',
    'proposal': 'proposal',
    'question': 'question',
    'maintenance': 'maintenance',
    'governor': 'directive',
    'core_seed': 'directive',
    'session_harvest': 'maintenance',
  };
  const intent = intentMap[type] || 'directive';

  // Axis 4: mandate-relation (simplified heuristic)
  let mandateRelation = 'in-mandate';
  if (/governor.*#3|ux.*journey|threshold.*core|app.*#2/i.test(content)) mandateRelation = 'orthogonal';
  else if (/adjacent|carry-forward|optional/i.test(content)) mandateRelation = 'adjacent';

  // ROUTING DECISIONS
  let route = ROUTES.PROCESS_NOW;
  let rationale = '';

  // ESCALATE: constitutional scope changes (C12/C13 classes)
  if (detectedScope === 'constitutional' && intent === 'directive') {
    route = ROUTES.ESCALATE;
    rationale = 'Constitutional scope + directive intent → requires Opus full-advance gate (C12/C13)';
  }
  // INVOKE consolidation-expert: proposals involving reusable surfaces (D7+C7)
  else if (intent === 'proposal' && /reuse|existing|duplicate|already.*have|check.*exist/i.test(content)) {
    route = ROUTES.INVOKE_CONSOLIDATION;
    rationale = 'Proposal-class with reusable surface pattern → invoke consolidation-expert (D7 action-bias override)';
  }
  // INVOKE cruel-critic: high-stakes architectural decisions (D2+D10)
  else if (detectedScope === 'architectural' && intent === 'proposal' && urgency === 'high') {
    route = ROUTES.INVOKE_CRUEL_CRITIC;
    rationale = 'High-stakes architectural proposal → invoke cruel-critic (D2 authority-pleasing override)';
  }
  // INVOKE vocabulary-canon: naming/frontmatter questions (D4+D8)
  else if (/\bname\b|\bfrontmatter\b|\benum\b|\bvocabular/i.test(content)) {
    route = ROUTES.INVOKE_VOCAB;
    rationale = 'Naming/vocabulary question → invoke vocabulary-canon (D4/D8 naming-novelty override)';
  }
  // VAULT: low-weight internal (tactical/maintenance/adjacent)
  else if (detectedScope === 'tactical' || intent === 'maintenance' || mandateRelation === 'adjacent') {
    route = ROUTES.VAULT;
    rationale = 'Low-weight internal input → VAULT (defer; not in active mandate)';
  }
  // PROCESS-NOW: default for in-mandate directives
  else {
    route = ROUTES.PROCESS_NOW;
    rationale = `In-mandate ${intent} (${spine} spine, ${detectedScope} scope) → PROCESS-NOW`;
  }

  return {
    route,
    axis_classification: {
      spine,
      scope: detectedScope,
      intent,
      mandate_relation: mandateRelation,
    },
    rationale,
  };
}

// ─── M4 S071 Facet E: selectPersonas — stateless persona selector ───────────
/**
 * PERSONA CRITERIA REGISTRY (M4 S071 — stateless inline copy of SKILL.md trigger_criteria)
 * Mirrors .claude/skills/{skill}/SKILL.md trigger_criteria blocks.
 * Returns empty when no match — no silent default-to-all (bottleneck-expert finding).
 * All criteria are TIGHT per PERSONA-BROAD-CRITERIA-COST-EXPLOSION prevention class.
 * Numbers are sample/tunable per P-META-028 cornerstone.
 */
const PERSONA_CRITERIA = [
  {
    skill: 'cruel-critic',
    invoke_on: ['consequential_architectural_proposal', 'CSEP_review', 'high_stakes_design'],
    match: ({ classificationClass, scope, urgency, content }) =>
      (classificationClass === 'proposal' || classificationClass === 'architectural_decision') &&
      (scope === 'architectural' || scope === 'constitutional') &&
      urgency === 'high' &&
      /CSEP|stability|scalabilit|challenge|what could go wrong|devil|scale this to/i.test(content),
  },
  {
    skill: 'consolidation-expert',
    invoke_on: ['reusable_surface_detected', 'duplicate_risk'],
    match: ({ classificationClass, content }) =>
      classificationClass === 'proposal' &&
      /reuse|existing|duplicate|already.*have|check.*exist|what.*exist/i.test(content),
  },
  {
    skill: 'vocabulary-canon',
    invoke_on: ['naming_decision', 'frontmatter_enum_question'],
    match: ({ content }) =>
      /\bname\b|\bnaming\b|\bfrontmatter\b|\benum\b|\bvocabular|\brename\b|\bglossary\b/i.test(content),
  },
  {
    skill: 'balance-expert',
    invoke_on: ['governance_complexity_spike', 'over_engineering_signal'],
    match: ({ classificationClass, content }) =>
      classificationClass === 'proposal' &&
      /over-engineer|complexity|too many|balance.*expert|simplif|occam/i.test(content),
  },
  {
    skill: 'bottleneck-expert',
    invoke_on: ['scale_or_performance_decision', 'throughput_concern'],
    match: ({ classificationClass, scope, content }) =>
      classificationClass === 'architectural_decision' &&
      (scope === 'architectural' || scope === 'constitutional') &&
      /\bscale\b|\bperformance\b|\bbottleneck\b|\blatency\b|\bthroughput\b|\b10[xX]\b|\b100[xX]\b|\bload\b/i.test(content),
  },
  {
    skill: 'schema-expert',
    invoke_on: ['schema_design_decision', 'rls_or_tenant_isolation_question'],
    match: ({ classificationClass, content }) =>
      classificationClass === 'architectural_decision' &&
      /\bZModel\b|\bschema\b.*\b(design|decision)\b|\bPrisma\b|\bRLS\b|\btenant_id\b|\bdatabase schema\b|\brow-level\b/i.test(content),
  },
  {
    skill: 'ux-expert',
    invoke_on: ['ux_flow_decision', 'user_journey_design'],
    match: ({ classificationClass, content }) =>
      (classificationClass === 'proposal' || classificationClass === 'question') &&
      /\bUX\b|\buser flow\b|\bjourney\b|\bfriction\b|\binterface\b|\busabilit|\bDX\b|\bonboarding\b/i.test(content),
  },
  {
    skill: 'synergy-master',
    invoke_on: ['cross_synergy_analysis', 'ratification_propagation'],
    match: ({ classificationClass, content }) =>
      (classificationClass === 'ratification' || classificationClass === 'proposal') &&
      /\bsynergy\b|\bCSEP\b|\bpropagate\b|\bcross-synergy\b|\bcross-enhancement\b/i.test(content),
  },
];

/**
 * selectPersonas — returns the matched persona set for a classification.
 * Stateless: no shared mutable state. Returns [] when no criteria match (no silent default-to-all).
 * @param {{ classificationClass: string, scope: string, urgency: string, content: string }} classification
 * @returns {string[]} — list of skill names to invoke (sample — expandable as criteria evolve)
 */
export function selectPersonas({ classificationClass = '', scope = '', urgency = '', content = '' }) {
  const matched = [];
  for (const { skill, match } of PERSONA_CRITERIA) {
    try {
      if (match({ classificationClass, scope, urgency, content })) {
        matched.push(skill);
      }
    } catch { /* skip criteria that error */ }
  }
  return matched; // empty = no persona invocation (not default-to-all)
}

// CLI mode
if (process.argv[1]?.endsWith('threshold-router.mjs')) {
  const args = Object.fromEntries(
    process.argv.slice(2)
      .filter(a => a.startsWith('--'))
      .map(a => a.slice(2).split('='))
  );
  const result = routeInput({
    type: args.type || 'governor_directive',
    spine: args.spine || 'GVRN',
    urgency: args.urgency || 'medium',
    scope: args.scope,
    content: args.content || '',
    shapeTier: args.shapeTier === 'true',
  });
  console.log(JSON.stringify(result, null, 2));
}
