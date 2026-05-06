---
id: csps.know-how.success-patterns.sg-002
name: slice-first-loading
description: Loading a principle or contract slice (P-XXX-NNN.yaml / B_NAME.md) instead of the full monolith produces the same governance quality at 1/50th the token cost
confidence: HIGH
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: know_how_success_patterns
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
first_seen: S010
confirmation_count: 2
source_sessions: [S010, S011]
applies_to: [implement, session-open]
do_checklist_item: "For any principle or contract reference: load packages/principles/principles/P-XXX-NNN.yaml (L1 ~2K) not principles.yaml (~85K); load behavioral-contracts/B_NAME.md (~3K) not behavioral-contracts.md (~48K)."
outcome_evidence: |
  S010: Phase 7 split generators created 130 slice files. First sessions using slices
  measured O(1) context cost per principle lookup vs O(N) monolith load.
  S011: principles-mcp Phase 8 build confirmed — get_principle(depth="L1") = ~200 tokens
  vs 85K monolith = 425× token reduction per principle query.
reuse_instruction: |
  When you need a principle: use `get_principle(id, depth="L1")` via MCP, OR
  read `packages/principles/principles/P-XXX-NNN.yaml` directly.
  When you need a contract: read `docs/plan/pillar-0-governance/behavioral-contracts/B_NAME.md`.
  NEVER: read principles.yaml or behavioral-contracts.md as full files for a single lookup.
---

# SG-002 — Slice-First Loading

**Pattern:** Always load the slice file for a specific principle or contract, never the monolith.

**The numbers:** principles.yaml = ~85K tokens. P-META-007.yaml = ~2K tokens. Reading a single principle the old way costs 85K. The new way costs 2K. 40× improvement per query. Over a session with 10 principle references: 850K → 20K = 830K tokens saved.

**Why it matters for compounding:** As the platform grows (more principles, more contracts), the monolith grows and the slice stays the same size. The efficiency gap increases over time, making slice-first loading more valuable session after session.
