/**
 * @csps-id csps.libs.threshold.router
 * Threshold pipeline router — reads routing rules from YAML config, dispatches to handler.
 * Routing rules are DATA (YAML), not code. Adding a new pipeline = YAML entry only.
 * Design: docs/SIA/R1-04-THRESHOLD.md § 5
 * Plan item: THRESHOLD-CODE | S056 | Layer 1 R1 Schema
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ThresholdInput, PipelineName, RoutingResult } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CONFIG = resolve(__dirname, '../config/pipelines.yaml');

interface RawRoutingRule {
  input_types: string[];
  scope_tags?: string[];
  spine_tags?: string[];
  escalation?: boolean;
}

interface RawPipeline {
  name: string;
  routing_rules: RawRoutingRule[];
}

interface PipelinesConfig {
  pipelines: RawPipeline[];
}

/** Simple YAML parser for the pipelines config — avoids adding yaml dependency */
function parsePipelinesYaml(text: string): PipelinesConfig {
  const pipelines: RawPipeline[] = [];
  let current: RawPipeline | null = null;
  let currentRule: RawRoutingRule | null = null;
  let inRoutingRules = false;

  for (const raw of text.split('\n')) {
    const line = raw.replace(/\r$/, '');
    if (/^  - name:/.test(line)) {
      // Flush pending rule and pipeline before starting a new pipeline
      if (currentRule && current) current.routing_rules.push(currentRule);
      currentRule = null;
      if (current) pipelines.push(current);
      current = { name: line.replace(/.*name:\s*/, '').trim(), routing_rules: [] };
      inRoutingRules = false;
    } else if (current && /^\s+routing_rules:/.test(line)) {
      inRoutingRules = true;
    } else if (inRoutingRules && /^\s{4,}-\s+input_types:/.test(line)) {
      // Flush previous rule before starting a new one
      if (currentRule && current) current.routing_rules.push(currentRule);
      const raw_types = line.replace(/.*input_types:\s*\[/, '').replace(/\].*/, '').split(',').map(s => s.trim().replace(/'/g, '').replace(/"/g, '').trim()).filter(Boolean);
      currentRule = { input_types: raw_types };
    } else if (currentRule && /scope_tags:/.test(line)) {
      currentRule.scope_tags = line.replace(/.*scope_tags:\s*\[/, '').replace(/\].*/, '').split(',').map(s => s.trim().replace(/'/g, '').replace(/"/g, '').trim()).filter(Boolean);
    } else if (currentRule && /spine_tags:/.test(line)) {
      currentRule.spine_tags = line.replace(/.*spine_tags:\s*\[/, '').replace(/\].*/, '').split(',').map(s => s.trim().replace(/'/g, '').replace(/"/g, '').trim()).filter(Boolean);
    } else if (currentRule && /escalation:\s*true/.test(line)) {
      currentRule.escalation = true;
    }
  }
  // Flush the last rule and pipeline
  if (currentRule && current) current.routing_rules.push(currentRule);
  if (current) pipelines.push(current);
  return { pipelines };
}

function loadConfig(configPath?: string): PipelinesConfig {
  const path = configPath ?? DEFAULT_CONFIG;
  if (!existsSync(path)) throw new Error(`Threshold pipelines config not found: ${path}`);
  return parsePipelinesYaml(readFileSync(path, 'utf-8'));
}

/** Route a classified ThresholdInput to one or more pipelines */
export function route(input: ThresholdInput, configPath?: string): RoutingResult {
  const config = loadConfig(configPath);
  const matched = new Set<PipelineName>();
  let escalated = false;
  const reasons: string[] = [];

  for (const pipeline of config.pipelines) {
    for (const rule of pipeline.routing_rules) {
      const typeMatch = rule.input_types.includes(input.type);
      if (!typeMatch) continue;

      const scopeMatch = !rule.scope_tags || rule.scope_tags.includes(input.scope_tag);
      const spineMatch = !rule.spine_tags || rule.spine_tags.includes(input.spine_tag);

      if (scopeMatch && spineMatch) {
        matched.add(pipeline.name as PipelineName);
        if (rule.escalation && input.urgency === 'high') {
          escalated = true;
        }
        reasons.push(`${pipeline.name}: matched type=${input.type}`);
      }
    }
  }

  // Escalation overrides: high-urgency errors always hit AUDIT_QUEUE
  if (input.type === 'error' && input.urgency === 'high') {
    matched.add('AUDIT_QUEUE');
    escalated = true;
    reasons.push('AUDIT_QUEUE: escalated (error + urgency=high)');
  }

  // Dual routing: S3 corrections → AI_PROFILE + CONCEPTION_VAULT
  if (input.type === 'correction' && input.scope_tag === 'S3') {
    matched.add('AI_PROFILE');
    matched.add('CONCEPTION_VAULT');
    reasons.push('AI_PROFILE + CONCEPTION_VAULT: dual routing (correction + scope=S3)');
  }

  if (matched.size === 0) {
    reasons.push('no pipeline matched — input may need manual review');
  }

  return {
    input_id: input.id,
    pipelines: Array.from(matched),
    escalated,
    reason: reasons.join('; '),
  };
}
