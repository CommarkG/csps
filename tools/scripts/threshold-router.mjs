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

// ─── M7 S071 PART 2 STEP 2: 10-class exhaustive routing ────────────────────
// Verbatim from PROTO-S068-PART-2-THRESHOLD-COMPLETE.md §CLASSIFICATION DESIGN
// Current enumeration (expandable — new classes route to PLACE_NOT_FOUND, never silently dropped)
// Numbers are sample/tunable per P-META-028 cornerstone.

const ROUTES = {
  PROCESS_NOW: 'PROCESS-NOW',
  VAULT: 'VAULT',
  ESCALATE: 'ESCALATE',
  INVOKE_CONSOLIDATION: 'INVOKE:consolidation-expert',
  INVOKE_CRUEL_CRITIC: 'INVOKE:cruel-critic',
  INVOKE_VOCAB: 'INVOKE:vocabulary-canon',
  // M7 NEW: explicit routes for all 10 classes
  FOREIGN_ELEMENT: 'FOREIGN-ELEMENT:quarantine',  // class 9 — MCP/skill/agent
  PLACE_NOT_FOUND: 'PLACE-NOT-FOUND:pending-node', // class 10 — explicit catch-all (never silent)
  VAULT_DEFER: 'VAULT:defer',  // class 6 — external content/research
  CIP_STAGING: 'CIP:staging',  // class 5 — proposal/consequential
  QUEUE_OR_PIVOT: 'QUEUE-OR-PIVOT', // class 1-advisory — new concept during active mandate (S089 §20 THRESHOLD-FIRST gate)
};

// Criticality tiers per PROTO-S068-PART-2 + SRE-class severity model
// Values are samples/tunable per P-META-028; not hard caps.
const CRITICALITY = {
  CRITICAL_PLUS: 'CRITICAL_PLUS',   // Governor directive/ratification — highest
  CRITICAL: 'CRITICAL',              // Implementation, AI-behavior, validation, proposal
  SHEDDABLE_PLUS: 'SHEDDABLE_PLUS', // Conversational, external research
  SHEDDABLE: 'SHEDDABLE',           // Maintenance, tactical
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
 * @param {boolean} [input.brownout] - true if d_level brownout active (shed SHEDDABLE inputs)
 * @returns {{ route: string, axis_classification: Object, criticality: string, input_class: string, rationale: string }}
 *
 * M8 S071 PART 2 STEP 3 — Scalability architecture:
 * STATELESS: pure function, no shared mutable state, no file I/O. Read brownout-state.yaml
 *   at HOOK invocation (not here) and pass result as `brownout` param → tenant-shardable.
 * FAST PATH (D1): SHAPE-TIER + brownout SHEDDABLE → in-memory classify, no deep routing.
 * SLOW PATH: constitutional/architectural/high-urgency → full 10-class classification.
 * CRITICALITY at ingress: CRITICAL_PLUS → CRITICAL → SHEDDABLE_PLUS → SHEDDABLE
 *   drives PE ordering + load-shedding (brownout sheds below CRITICAL).
 */
export function routeInput({ type, spine, urgency, scope, content = '', shapeTier = false, brownout = false, mandate_active = false, mandate_relation = null }) {
  // ─── FAST PATH — D1 (in-memory, no deep routing) ──────────────────────────
  // Case 1: SHAPE-TIER fast-path: conversational inputs bypass full classification (Class 8)
  if (shapeTier) {
    return {
      route: ROUTES.PROCESS_NOW,
      axis_classification: { spine, scope: 'tactical', intent: 'conversational', mandate_relation: 'adjacent' },
      criticality: CRITICALITY.SHEDDABLE_PLUS,
      input_class: 'conversational',
      rationale: 'SHAPE-TIER fast-path: conversational input → chat, no full routing. SHEDDABLE_PLUS.',
    };
  }

  // Case 2: BROWNOUT D1-mode fast-path — under load, shed SHEDDABLE inputs (graceful degradation)
  // brownout param is READ from brownout-state.yaml by the hook (not here — stateless).
  if (brownout) {
    // CRITICAL_PLUS and CRITICAL still route normally (never shed essential work)
    // SHEDDABLE_PLUS and SHEDDABLE → VAULT:defer (graceful degradation, not drop)
    if (urgency !== 'high' && type !== 'governor_directive' && type !== 'implementation' &&
        type !== 'validation' && type !== 'ai_behavior') {
      return {
        route: ROUTES.VAULT_DEFER,
        axis_classification: { spine, scope: scope || 'tactical', intent: 'brownout_shed', mandate_relation: 'adjacent' },
        criticality: CRITICALITY.SHEDDABLE,
        input_class: 'brownout_shed',
        rationale: `BROWNOUT D1: load-shedding active. Input shed to VAULT:defer (SHEDDABLE). ` +
          `CRITICAL+ work continues unaffected. Resume: brownout-state.yaml active=false.`,
      }
    }
    // CRITICAL inputs still route normally through slow path (fall through)
  }

  // ─── SLOW PATH — full 10-class classification ──────────────────────────────
  // Axis 2: scope detection (if not provided, infer)
  // S086 FIX (golden-set finding gs-001..gs-004): governor_directive type defaults to operational,
  // not tactical. Tactical = explicitly conversational/low-urgency. Training data confirms:
  // "Execute PHASE 1...", "BUILD the classifier...", "Fix verify is RED..." all = operational.
  let detectedScope = scope || 'operational';
  if (!scope) {
    if (/constitutional|platform-wide|PROTO.*gate|B_\w+|P-META/i.test(content)) detectedScope = 'constitutional';
    else if (/schema|migrate|architecture|cross-pillar/i.test(content)) detectedScope = 'architectural';
    else if (type === 'governor_directive' || type === 'governor' || type === 'correction' || type === 'implementation') {
      // Governor directives without explicit scope markers are operational by default
      // Exception: low-urgency + conversational patterns → tactical
      if (urgency === 'low' && /^(yes|no|ok|continue|thanks|good|fine)\b/i.test(content.trim())) {
        detectedScope = 'tactical';
      } else {
        detectedScope = 'operational';
      }
    }
    else if (/fix|patch|update|clean/i.test(content)) detectedScope = 'operational';
    else detectedScope = 'tactical';
  }

  // Axis 3: intent from type (M7: extended to cover all 10 classes)
  const intentMap = {
    'governor_directive': 'directive',
    'proposal': 'proposal',
    'capability_proposal': 'proposal', // S088: capability proposals → CIP staging
    'question': 'question',
    'maintenance': 'maintenance',
    'governor': 'directive',
    'core_seed': 'directive',
    'session_harvest': 'maintenance',
    // M7 new type mappings
    'implementation': 'implementation',
    'ai_behavior': 'ai_behavior',
    'validation': 'validation',
    'external_research': 'external_research',
    'foreign_element': 'foreign_element',
    'conversational': 'conversational',
    'error': 'validation',
    'solution': 'validation',
    'correction': 'directive',
  };
  const intent = intentMap[type] || 'unknown'; // 'unknown' → place-not-found (not 'directive')

  // Axis 4: mandate-relation
  // mandate_relation param overrides heuristic — used when Haiku pre-classifies (S089 §20)
  // or when fixture tests need to test the routing logic directly.
  // Heuristic is a fallback; Haiku classification is the production path.
  let mandateRelation = mandate_relation ?? 'in-mandate';
  if (!mandate_relation) {
    if (/governor.*#3|ux.*journey|threshold.*core|app.*#2/i.test(content)) mandateRelation = 'orthogonal';
    else if (/adjacent|carry-forward|optional/i.test(content)) mandateRelation = 'adjacent';
  }

  // ─── ROUTING DECISIONS — 10-class exhaustive (M7 S071, expandable) ─────────
  // Order matters: more specific checks first.
  // NO silent default-to-unhandled: every path terminates in an explicit route.
  // Audience tier stamped per communication-schema.yaml hierarchy.
  let route = ROUTES.PLACE_NOT_FOUND; // explicit catch-all — not a silent default
  let rationale = '';
  let criticality = CRITICALITY.CRITICAL; // default; overridden per class
  let input_class = 'unclassified'; // for logging

  // CLASS 9: Foreign element (MCP/skill/agent not tiered in the platform)
  // Must check BEFORE other classes — untiered foreign elements = CRITICAL stop
  if (type === 'foreign_element' || /\bMCP\b|\bskill-agent\b|\bforeign.*element\b/i.test(content)) {
    route = ROUTES.FOREIGN_ELEMENT;
    criticality = CRITICALITY.CRITICAL;
    input_class = 'foreign_element';
    rationale = 'Foreign element (MCP/skill/agent) → quarantine route. Untiered foreign → STOP per FOREIGN-ELEMENT-LOCALIZATION.';
  }
  // CLASS 8: Conversational / SHAPE-TIER (fast-path; already handled above but kept for completeness)
  else if (shapeTier || type === 'conversational' || (intent === 'question' && urgency === 'low' && detectedScope === 'tactical')) {
    route = ROUTES.PROCESS_NOW;
    criticality = CRITICALITY.SHEDDABLE_PLUS;
    input_class = 'conversational';
    rationale = 'SHAPE-TIER fast-path: conversational input → chat, no full routing.';
  }
  // CLASS 1: Governor directive / ratification (constitutional)
  else if (type === 'governor_directive' && detectedScope === 'constitutional') {
    route = ROUTES.ESCALATE;
    criticality = CRITICALITY.CRITICAL_PLUS;
    input_class = 'governor_directive';
    rationale = 'Governor directive + constitutional scope → opus-turn/council (C12/C13 gate). CRITICAL_PLUS.';
  }
  // CLASS 1: Governor directive (non-constitutional)
  // THRESHOLD-FIRST GATE (S089 §20 / round-5 PCR / PARK-S089-THRESHOLD-INLINE-GATE):
  // mandateRelation is computed above (L191-193) but was previously IGNORED here — that was the bug.
  // Now: if mandate is active AND directive appears orthogonal → ADVISORY QUEUE-OR-PIVOT.
  // Escape hatch: "PIVOT" or "PIVOT:<tag>" in content → user explicitly overrides → PROCESS-NOW.
  // Haiku classifies the semantic "is this new?" — the deterministic rule below handles the gate.
  else if (type === 'governor_directive' || intent === 'directive') {
    const hasPivotEscape = /\bPIVOT\b/i.test(content);
    const isOrthogonal = (mandateRelation === 'orthogonal' || mandateRelation === 'new-request');
    // Deterministic rule: new-concept + active-mandate → QUEUE-OR-PIVOT (advisory, not blocking)
    if (mandate_active && isOrthogonal && !hasPivotEscape) {
      route = ROUTES.QUEUE_OR_PIVOT;
      criticality = CRITICALITY.CRITICAL;
      input_class = 'governor_directive';
      rationale = 'THRESHOLD-FIRST GATE: directive appears orthogonal to active mandate → advisory QUEUE-OR-PIVOT. ' +
        'AI should flag: is this in-mandate, or should we queue/pivot? Escape: include "PIVOT" to proceed immediately.';
    } else {
      route = ROUTES.PROCESS_NOW;
      criticality = CRITICALITY.CRITICAL_PLUS;
      input_class = 'governor_directive';
      rationale = hasPivotEscape
        ? 'Governor directive with PIVOT escape hatch → PROCESS-NOW (mandate gate bypassed intentionally). CRITICAL_PLUS.'
        : 'Governor directive → PROCESS-NOW (in-mandate or no active mandate). CRITICAL_PLUS.';
    }
  }
  // CLASS 6: External content / research (VAULT_DEFER)
  else if (type === 'external_research' || /EXT-ID|uploaded|external.research|paste below/i.test(content)) {
    route = ROUTES.VAULT_DEFER;
    criticality = CRITICALITY.SHEDDABLE_PLUS;
    input_class = 'external_research';
    rationale = 'External content/research → AI alignment + VAULT_DEFER. SHEDDABLE_PLUS.';
  }
  // CLASS 5: Proposal / consequential — with consolidation persona
  else if (intent === 'proposal' && /reuse|existing|duplicate|already.*have|check.*exist/i.test(content)) {
    route = ROUTES.INVOKE_CONSOLIDATION;
    criticality = CRITICALITY.CRITICAL;
    input_class = 'proposal_consolidation';
    rationale = 'Proposal with reusable surface → CIP staging + consolidation-expert (D7 override). CRITICAL.';
  }
  // CLASS 5: Proposal / consequential — high-stakes architectural
  else if (intent === 'proposal' && detectedScope === 'architectural' && urgency === 'high') {
    route = ROUTES.INVOKE_CRUEL_CRITIC;
    criticality = CRITICALITY.CRITICAL;
    input_class = 'proposal_consequential';
    rationale = 'High-stakes architectural proposal → CIP staging + cruel-critic. CRITICAL.';
  }
  // CLASS 5: Proposal / consequential — general
  else if (intent === 'proposal') {
    route = ROUTES.CIP_STAGING;
    criticality = CRITICALITY.CRITICAL;
    input_class = 'proposal';
    rationale = 'Proposal/consequential → CIP staging + INVOKE council. CRITICAL.';
  }
  // CLASS 2: Implementation / schema / code (ARCH spine or implementation type)
  else if (type === 'implementation' || spine === 'ARCH') {
    route = ROUTES.PROCESS_NOW;
    criticality = CRITICALITY.CRITICAL;
    input_class = 'implementation';
    rationale = 'Implementation/schema/code → proto→Sonnet build path. CRITICAL.';
  }
  // CLASS 3: AI-behavior / inner-default (AI spine or ai_behavior type)
  else if (type === 'ai_behavior' || (spine === 'AI' && intent !== 'external_research')) {
    route = ROUTES.PROCESS_NOW;
    criticality = CRITICALITY.CRITICAL;
    input_class = 'ai_behavior';
    rationale = 'AI-behavior/inner-default → alignment pipeline + inner-defaults registry. CRITICAL.';
  }
  // CLASS 4: Validation / ZF / evidence (VALD spine or validation type)
  else if (type === 'validation' || type === 'error' || type === 'solution' || spine === 'VALD') {
    route = ROUTES.PROCESS_NOW;
    criticality = CRITICALITY.CRITICAL;
    input_class = 'validation';
    rationale = 'Validation/ZF/evidence → coverage pipeline + verify/last-run. CRITICAL.';
  }
  // VOCAB invoke: naming/frontmatter/enum questions (cross-class pattern)
  else if (/\bname\b|\bfrontmatter\b|\benum\b|\bvocabular/i.test(content)) {
    route = ROUTES.INVOKE_VOCAB;
    criticality = CRITICALITY.SHEDDABLE_PLUS;
    input_class = 'vocabulary';
    rationale = 'Naming/vocabulary question → vocabulary-canon (D4/D8 override). SHEDDABLE_PLUS.';
  }
  // CLASS 7: Maintenance / tactical / adjacent (VAULT)
  else if (detectedScope === 'tactical' || intent === 'maintenance' || mandateRelation === 'adjacent') {
    route = ROUTES.VAULT;
    criticality = CRITICALITY.SHEDDABLE;
    input_class = 'maintenance';
    rationale = 'Maintenance/tactical → VAULT (vault-pending; not in active mandate). SHEDDABLE.';
  }
  // CLASS 10: place-not-found — explicit, notified, NEVER silent
  // This is the exhaustive catch-all: every unmatched input lands here with visibility.
  else {
    route = ROUTES.PLACE_NOT_FOUND;
    criticality = urgency === 'high' ? CRITICALITY.CRITICAL : CRITICALITY.SHEDDABLE_PLUS;
    input_class = 'place_not_found';
    rationale = `No class matched → PLACE-NOT-FOUND (pending-node + notify). criticality=${criticality}. Inherits urgency-based criticality.`;
  }

  return {
    route,
    axis_classification: {
      spine,
      scope: detectedScope,
      intent,
      mandate_relation: mandateRelation,
    },
    criticality,
    input_class,
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
