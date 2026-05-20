---
name: principles-skill
description: When looking up a principle by ID OR asking what a principle means OR checking principle compliance OR searching for principles by category/spine/enforcer-layer — use principles-mcp MCP tools (get_principle / list_principles / find_by_spine / find_by_enforcer_layer) at depth L1 by default. Triggers on "P-META-", "P-ARCH-", "P-OP-", "P-OPER-", "what does P-", "which principle", "look up principle", "principle compliance", "find principles", "principles by category", "principles by spine". Never load principles.yaml monolith — use MCP or slice file.
allowed_tools: []
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: []
sensitive_data_access: false
backed_by_principle: P-META-002
backed_by_contract: B_SAVINGS_AND_SSOT_UNIFIED
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_SAVINGS_AND_SSOT_UNIFIED
  - B_CONSOLIDATION_PASS
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: principle-detail-at-requested-depth
  max_tokens: 1000
  no_synthesis_outside_main: true
  no_ratification_claims: true
trust_tier: platform-owned
preflight_check_required: false
principle_compliance:
  - P-META-010    # AAP — operates under agent-alignment-protocol
  - P-META-002    # principles-travel-with-artifacts
  - P-META-003    # inheritance-via-shared-runtime
consolidation_cross_refs:
  - packages/principles/principles-index.yaml    # manifest SSoT for principle discovery
  - packages/principles/principles/              # slice SSoT — load P-XXX-NNN.yaml not monolith
template_grade: B
links:
  - { rel: p-meta-022, href: ../../../../docs/plan/pillar-0-governance/human-intent-crystallization.md }
scope_level: S1
batch: BATCH-C
lifecycle_state: active
template_depth: L2
parent_template: skill-base
---

# /principles-skill — Principle lookup via MCP

## When to invoke

- "What does P-META-018 mean?"
- "Look up P-OP-001"
- "Which principles cover reuse?"
- "Find principles for GVRN spine"
- "What principle enforces the ZF cycle?"
- "Check principle compliance for this work"
- Any P-XXX-NNN ID reference in a prompt

## How to use (priority order)

1. **MCP first** (when principles-mcp is registered as active MCP server):
   ```
   get_principle(id="P-META-018", depth="L1")    # ~200 tokens
   get_principle(id="P-META-018", depth="L2")    # + counterweight + enforcers
   find_by_spine(core_spine="GVRN", depth="L1")  # all GVRN principles
   ```

2. **Slice file fallback** (when MCP unavailable):
   - Load `packages/principles/principles/P-META-018.yaml` directly (~2K tokens)
   - Never load `packages/principles/principles.yaml` monolith (~85K tokens)

3. **Index for discovery**:
   - Load `packages/principles/principles-index.yaml` to find IDs without loading all slices

## Never

- Never answer from training memory alone when a specific P-XXX-NNN is asked about
- Never load the full principles.yaml monolith for a single principle lookup
- Never claim a principle "doesn't exist" without checking principles-index.yaml first

## Depth guide

| Depth | Returns | Use when |
|---|---|---|
| L1 | id + name + category + severity + statement_summary | Quick definition; default |
| L2 | L1 + counterweight + industry_lineage + enforcers | Need full context |
| L3 | Full principle including anti_patterns + config | Deep implementation work |
