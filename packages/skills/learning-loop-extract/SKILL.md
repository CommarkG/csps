---
name: learning-loop-extract
description: Scans a session log (chat transcript, audit run output, error log) for insights, errors, gaps, decisions, near-misses. Routes each candidate through the three-band confidence gate (auto-accept ≥0.90, human review 0.75–0.90, discard <0.75) into the LearningLoopItem inbox. Attaches OTel gen_ai.evaluation.result event for provenance. Use at every session close (PostStop hook auto-fires it; closing summary references the count). Triggered by /learning-loop-extract or by .claude/hooks/post-stop-learning-loop.sh.
version: 1.0.0
license: internal-only
allowed_tools: [Read, Grep, Glob]
allowed_subagents: []
enforces: [P-META-005]
lifecycle: production
lifecycle_state: active
# ─── AAP frontmatter (S005 turn 26 retrofit per P-META-010 + B_AGENT_ALIGNMENT_PROTOCOL) ───
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_INTAKE_DISCIPLINE
  - B_POSITIVE_VALUE_EXTRACTION       # this skill IS positive-value extraction
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: structured-extraction-summary
  max_tokens: 1500
  no_synthesis_outside_main: true
  no_ratification_claims: true
trust_tier: platform-owned
eval_baseline:
  test_corpus_path: tests/skills/learning-loop-extract/test-fixtures.json
  expected_pass_rate: 0.95
preflight_check_required: true
principle_compliance:
  - P-META-010    # AAP — operates under agent-alignment-protocol
  - P-META-002    # principles-travel-with-artifacts
consolidation_cross_refs: []    # empty = genuinely-novel skill per B_CONSOLIDATION_PASS

scope_level: S1
---

# /learning-loop-extract — Closed-loop insight capture

> **Saving is not the goal; permanent system improvement is.** — P-META-005

## When to invoke

This skill runs at every session close. Two activation paths:

1. **Automatic (preferred):** PostStop hook `.claude/hooks/post-stop-learning-loop.sh` fires this skill on session end. The AI cannot route around it.
2. **Manual:** invoke `/learning-loop-extract` with optional `--source` (chat | audit | error-log | feedback | near-miss) and `--scope` (session-id or file path).

The `learning-loop-coverage` audit asserts ≥1 item produced per session OR explicit "no insights, reason: <X>" recorded in the closing summary. The skill IS the mechanical guarantor of P-META-005.

## What this skill does

For each session log:

1. **Identify candidates** — call extraction LLM with prompt: *"Identify insights, errors, gaps, decisions, near-misses in this session. For each, return: source_type, summary (≤512 chars), evidence (structured), suggested priority_tier (P0/P1/P2/P3), confidence (0..1), evaluator_name."*

2. **Confidence-band routing** (three bands, per `principles.yaml#P-META-005.config.ai_confidence_thresholds`):

   | Band | Threshold | Action |
   |---|---|---|
   | Auto-accept | confidence ≥ 0.90 | INSERT `LearningLoopItem` with `pipeline_state: triaged`, owner null (assigned at routing) |
   | Human review | 0.75 ≤ confidence < 0.90 | INSERT with `pipeline_state: observed` + flagged for review queue |
   | Discard | confidence < 0.75 | Log to extraction-precision metrics; do NOT insert into pipeline |

3. **OTel provenance attachment** — for AI-extracted items (source = `AI_EXTRACTION`), attach evidence with the canonical OTel GenAI evaluation event:

   ```json
   {
     "evaluation_event": {
       "name": "gen_ai.evaluation.result",
       "gen_ai.evaluation.name": "extraction_confidence",
       "gen_ai.evaluation.score.value": 0.87,
       "gen_ai.evaluation.score.label": "human_review_band",
       "gen_ai.evaluation.explanation": "<extractor chain-of-thought>",
       "gen_ai.request.model": "claude-opus-4-7",
       "gen_ai.response.id": "msg_<id>",
       "gen_ai.system": "anthropic"
     }
   }
   ```

4. **Surface prior context (pull-based discovery)** — for each candidate, query the `LearningLoopItem` ledger for similar prior items (same source + summary similarity ≥0.7). If matches found, attach as `evidence.prior_items[]` and surface in the closing summary so the AI doesn't propose a fix that's already been made.

5. **Detect K=2 recurrence** — if any candidate matches a `closed` item within the recurrence window (90d default, 30d critical), increment its `recurrence_count`. If `recurrence_count` reaches the K=2-within-90d threshold, auto-create a `routed` LearningLoopItem with `routed_to: ADR-<next>` and emit a notification: *"K=2 recurrence detected. Auto-creating ADR-XXXX for permanent fix per P-META-005."*

6. **Output completion summary** — list of items created (one line each: `<id> | <source> | <state> | <summary>`), discard count, prior-item-link count, K=2 trigger count, confidence-band distribution. This is what the AI references in its closing summary.

## How invocation works

### Inputs

- `--source` (optional, default: `chat`) — one of `chat | audit | error-log | feedback | near-miss`
- `--scope` (optional) — session-id, audit-run-id, file path, or `latest` (default)
- `--no-insights-reason` (optional) — explicit reason to record "no insights" for this session; bypasses the LLM call. Use when the session is purely informational.

### Outputs (stdout)

```
EXTRACTED <count> items (auto-accept: <n>, review: <m>, discarded: <p>)
PRIOR_LINKS <q> existing items linked
RECURRENCE_TRIGGERED <r> items reached K=2 within 90d (auto-ADR routed)
```

Or:

```
NO_INSIGHTS reason="<X>"
```

### Side effects

- INSERTs into `public.learning_loop_item` (one per item above review threshold)
- INSERTs into `public.audit_results` (extraction-precision metric for the discard band)
- May INSERT a `routed` item with `routed_to: ADR-<next>` on K=2 trigger
- Writes OTel spans to the configured exporter

## Confidence threshold tuning

Thresholds are per-evaluator (extraction-confidence ≠ hallucination-check ≠ sentiment). Live in `packages/principles/principles.yaml#P-META-005.config.ai_confidence_thresholds` for the registry-wide defaults; per-evaluator overrides in `tools/learning-loop/evaluator-thresholds.json` (single source of truth for evaluator-specific calibration).

The operating-point target: **1–5% of AI-extracted items in the human-review band**. Outside this range, recalibrate. The `meta-loop-audit` monthly check tracks this.

## Anti-patterns (what this skill must NOT do)

1. **Auto-accept without OTel provenance** — every AI-extracted item must carry the evaluation event for downstream auditing of which model / which threshold / which evaluator gated the decision.
2. **Surface no prior context** — pull-based discovery is the anti-graveyard pattern. Always link related prior items at observation time.
3. **Silent K=2 trigger** — recurrence reaching K=2 must emit a visible notification; the user must see "ADR auto-created" in the closing summary.
4. **Discard without metrics** — discarded items still count for extraction-precision tracking. Without the metric, the threshold is uncalibrated.
5. **Run with insufficient session context** — if `--scope=latest` but no recent session is available, fail loudly. Do not silently produce zero items.

## Testing

The skill itself is an audited slice (per P-ARCH-015). Tests live at `packages/skills/learning-loop-extract/__tests__/`:

- Confidence-band routing — synthetic confidences at 0.74 / 0.75 / 0.89 / 0.90 / 0.91 land in expected bands
- OTel event attachment — verify required fields present
- K=2 recurrence — synthetic prior `closed` item + new matching observation triggers ADR routing
- No-insights path — `--no-insights-reason` records the reason without LLM call
- Pull-based prior linking — ANN similarity search returns expected matches above 0.7

## Sources

- [OTel GenAI evaluation events](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/)
- [Cleanlab — TLM structured outputs benchmark](https://cleanlab.ai/blog/tlm-structured-outputs-benchmark/) — confidence threshold operating points
- [IntuitionLabs — Active Learning + HITL for LLMs](https://intuitionlabs.ai/articles/active-learning-hitl-llms) — three-band gate pattern
- [Linear Triage Intelligence](https://linear.app/docs/triage-intelligence) — auto-routing accuracy benchmarks
