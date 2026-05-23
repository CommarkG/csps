/**
 * @csps-id csps.libs.threshold
 * @csps-name threshold
 * @csps-description Universal intake and routing system. All CSPS inputs are classified
 * and routed through Threshold before touching any platform element.
 * Design: docs/SIA/R1-04-THRESHOLD.md
 * Plan item: THRESHOLD-CODE | S056 | Layer 1 R1 Schema
 * @csps-version 0.1.0
 * @csps-owner group:finky
 * @csps-lifecycle experimental
 * @csps-lifecycle-state active
 * @csps-tags type:library domain:architecture audience:platform
 */

export { classify } from './classifier.js';
export { route } from './router.js';
export type {
  ThresholdInput,
  ThresholdInputType,
  SpineTag,
  ScopeTag,
  Urgency,
  ThresholdStatus,
  InputSource,
  PipelineName,
  Pipeline,
  RoutingRule,
  RoutingResult,
} from './types.js';
