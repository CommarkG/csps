/**
 * @csps-id csps.packages.schemas.intake-event
 * @csps-name intake-event
 * @csps-description Typed IntakeEvent envelope — normalizes all CSPS input sources (chat-channel /
 *   external-content / agent-output / inner-default-leak) into one canonical form before routing.
 *   Per unified-intake topic-plan L2 (S011) + Option C ratification (S008 GP-S008-05 cardinal).
 *   Industry pattern: typed-event-envelope (LangGraph / Letta / Mem0 / API-gateway-as-facade).
 *   Runtime: TypeScript only (pre-Mastra); ZModel version deferred to week-6 Mastra runtime.
 * @csps-version 1.0
 * @csps-owner group:finky
 * @csps-lifecycle experimental
 * @csps-lifecycle-state active
 * @csps-tags type:schema domain:governance domain:ops audience:developer
 * @csps-enforces P-OPER-001 B_INTAKE_DISCIPLINE B_GOVERNOR_PROMPTS
 */

// ── Source classes — all CSPS inputs normalize through one of these ────────
export type IntakeSourceClass =
  | 'chat-channel'         // user prompt in Claude Code chat (B_GOVERNOR_PROMPTS)
  | 'external-content'     // uploaded file / URL / paste / EXT-ID (B_INTAKE_DISCIPLINE)
  | 'agent-output'         // subagent result / tool output (B_AGENT_ALIGNMENT_PROTOCOL)
  | 'inner-default-leak';  // AI training-default surfaced (B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS)

// ── Route targets — where normalized input goes after classification ────────
export type IntakeRouteTarget =
  | 'SWIFT_EXECUTE'   // 4-condition gate passes → execute autonomously
  | 'COUNCIL_REVIEW'  // surface to user for direction
  | 'VAULT_DEFER'     // park in _handoff/VAULT/ for future session
  | 'DROP';           // explicit out-of-scope; document drop reason

// ── State machine positions ────────────────────────────────────────────────
export type IntakeStateMachinePos =
  | 'received'
  | 'classified'
  | 'prioritized'
  | 'routed'
  | 'executed'
  | 'deferred'
  | 'dropped';

// ── Priority bands (from PE formula) ──────────────────────────────────────
export type PriorityBand = 1 | 2 | 3 | 4;

// ── The canonical IntakeEvent envelope ────────────────────────────────────
export interface IntakeEvent {
  // Identity
  id: string;                           // format: EXT-YYYYMMDD-NNN-X or GP-S<N>-<N> or AGENT-<uuid>
  source_class: IntakeSourceClass;
  received_at: string;                  // ISO 8601 UTC

  // Content
  raw: string;                          // verbatim original input (never mutated)
  classified_type: string;              // e.g. 'user-directive', 'ratification', 'question', 'tool-result'
  content_hash: string;                 // sha256 of raw (for dedup detection)
  mini_tree_layer?: string;             // L1 / L1+L2 / L1+L2+L3 per depth-discipline.md

  // Tagging
  tags: string[];                       // domain: / type: / audience: tags
  priority_band?: PriorityBand;         // PE formula output

  // Routing
  route_to: IntakeRouteTarget;
  state_machine_pos: IntakeStateMachinePos;

  // Relations
  parent_id?: string;                   // parent IntakeEvent (thread continuity)
  sub_ids?: string[];                   // child IntakeEvents (batch items)
  evidence_refs?: string[];             // artifact paths this event produced/cites
  dialog_thread_id?: string;            // chat session ID (for chat-channel events)

  // Deep-dive scheduling
  deep_dive_schedule?: string;          // session target for full processing

  // Consolidation
  consolidation_cross_refs?: string[];  // SSoT canonical home paths per B_CONSOLIDATION_PASS
}

// ── Normalizer result (output of source-class normalizers) ─────────────────
export interface NormalizeResult {
  event: IntakeEvent;
  warnings: string[];
  validation_pass: boolean;
}
