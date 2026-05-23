/**
 * @csps-id csps.libs.threshold.types
 * Threshold input classification types.
 * Design: docs/SIA/R1-04-THRESHOLD.md § 3 + § 5
 * Plan item: THRESHOLD-CODE | S056 | Layer 1 R1 Schema
 */

/** 10-item closed enum — all input types CSPS processes */
export type ThresholdInputType =
  | 'governor_directive'
  | 'architectural_insight'
  | 'error'
  | 'solution'
  | 'external_research'
  | 'session_harvest'
  | 'correction'
  | 'core_seed'
  | 'question'
  | 'quote';

/** Core Spine classification */
export type SpineTag = 'GVRN' | 'ARCH' | 'AI' | 'OPER' | 'VALD';

/** Scope tag — structural hierarchy */
export type ScopeTag = 'S1' | 'S2' | 'S3';

export type Urgency = 'high' | 'medium' | 'low';

export type ThresholdStatus = 'new' | 'processing' | 'routed' | 'sealed' | 'deprecated';

export type InputSource =
  | 'governor_directive'
  | 'sonnet_report'
  | 'opus_design'
  | 'external'
  | 'session_harvest';

/** Classified Threshold input object — design R1-04-THRESHOLD.md § 3 */
export interface ThresholdInput {
  id: string;
  type: ThresholdInputType;
  session: string;
  spine_tag: SpineTag;
  scope_tag: ScopeTag;
  urgency: Urgency;
  status: ThresholdStatus;
  source: InputSource;
  raw?: string;
  created_at: string;
}

/** 7 pipeline names (closed enum) */
export type PipelineName =
  | 'PE_INTAKE'
  | 'LEARNING_LOOP'
  | 'DOC_UPDATE'
  | 'AI_PROFILE'
  | 'CONCEPTION_VAULT'
  | 'AUDIT_QUEUE'
  | 'CORE_SEED_REGISTRY';

/** Routing rule — from pipelines.yaml */
export interface RoutingRule {
  pipeline: PipelineName;
  input_types: ThresholdInputType[];
  scope_tags?: ScopeTag[];
  spine_tags?: SpineTag[];
  urgency_override?: Urgency;
  escalation?: boolean;
  processor: string;
}

/** Pipeline definition — from pipelines.yaml */
export interface Pipeline {
  name: PipelineName;
  description: string;
  routing_rules: RoutingRule[];
  processor: string;
}

/** Result of routing a ThresholdInput */
export interface RoutingResult {
  input_id: string;
  pipelines: PipelineName[];
  escalated: boolean;
  reason: string;
}
