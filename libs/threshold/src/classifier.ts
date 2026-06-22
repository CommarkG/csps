/**
 * @csps-id csps.libs.threshold.classifier
 * Threshold input classifier — takes raw input metadata and returns a classified ThresholdInput.
 * Design: docs/SIA/R1-04-THRESHOLD.md § 3
 * Plan item: THRESHOLD-CODE | S056 | Layer 1 R1 Schema
 */

import type {
  ThresholdInput,
  ThresholdInputType,
  SpineTag,
  ScopeTag,
  Urgency,
  InputSource,
} from './types.js';

let _counter = 0;
function generateId(session: string): string {
  return `thr-${session}-${Date.now()}-${++_counter}`;
}

export interface ClassifyOptions {
  type: ThresholdInputType;
  session: string;
  source: InputSource;
  spine_tag?: SpineTag;
  scope_tag?: ScopeTag;
  urgency?: Urgency;
  raw?: string;
}

/** Infer spine_tag from input type if not provided */
function inferSpineTag(type: ThresholdInputType): SpineTag {
  switch (type) {
    case 'governor_directive': return 'GVRN';
    case 'architectural_insight': return 'ARCH';
    case 'capability_proposal': return 'ARCH'; // S088: proposing new capability = ARCH decision
    case 'error': return 'VALD';
    case 'solution': return 'VALD';
    case 'external_research': return 'AI';
    case 'session_harvest': return 'OPER';
    case 'correction': return 'AI';
    case 'core_seed': return 'GVRN';
    case 'question': return 'GVRN';
    case 'quote': return 'GVRN';
  }
}

/** Infer scope_tag from input type if not provided */
function inferScopeTag(type: ThresholdInputType): ScopeTag {
  switch (type) {
    case 'governor_directive': return 'S1';
    case 'architectural_insight': return 'S3';
    case 'capability_proposal': return 'S2'; // S088: session-structural until assessed
    case 'error': return 'S1';
    case 'solution': return 'S1';
    case 'external_research': return 'S2';
    case 'session_harvest': return 'S2';
    case 'correction': return 'S2';
    case 'core_seed': return 'S3';
    case 'question': return 'S1';
    case 'quote': return 'S1';
  }
}

/** Infer urgency from input type if not provided */
function inferUrgency(type: ThresholdInputType): Urgency {
  switch (type) {
    case 'governor_directive': return 'high';
    case 'error': return 'high';
    case 'correction': return 'medium';
    case 'architectural_insight': return 'medium';
    case 'capability_proposal': return 'medium'; // S088: assess before committing
    case 'core_seed': return 'medium';
    case 'solution': return 'medium';
    case 'session_harvest': return 'low';
    case 'external_research': return 'low';
    case 'question': return 'low';
    case 'quote': return 'low';
  }
}

/** Classify raw input into a ThresholdInput object */
export function classify(opts: ClassifyOptions): ThresholdInput {
  return {
    id: generateId(opts.session),
    type: opts.type,
    session: opts.session,
    spine_tag: opts.spine_tag ?? inferSpineTag(opts.type),
    scope_tag: opts.scope_tag ?? inferScopeTag(opts.type),
    urgency: opts.urgency ?? inferUrgency(opts.type),
    status: 'new',
    source: opts.source,
    raw: opts.raw,
    created_at: new Date().toISOString(),
  };
}
