---
extraction_id: EXT-20260502-001-C
parent_input_id: EXT-20260502-001
section_label: constitutional-mechanical-not-memory
source_type: HUMAN_CHAT
confidence: 0.92
confidence_band: auto-accept
lifecycle_state: promoted
pipeline_state: validated
state_transitioned_at: 2026-05-02T15:07:00Z
next_review_at: 2026-08-01
recurrence_check_at: 2026-08-01
routed_to: |
  - docs/plan/_handoff/VAULT/insights.md (S002 insights — to append)
  - docs/plan/pillar-0-governance/learning-loop.md (industry-parallels section reinforcement)
risk: low
trust_tier: tenant_authored
priority_tier: P1
tags:
  - domain:governance
  - type:explanation
  - audience:developer
  - audience:ai-agent
  - maturity:stable
inherited_from_input:
  tags: [audience:ai-agent]
  trust_tier: tenant_authored
  source_type: HUMAN_CHAT
sla_due:
  triaged_to_routed: 2026-05-04T15:07:00Z
  fixing_complete: 2026-05-02T15:07:00Z
scope_level: S1
---

# Constitutional principle: memory alone doesn't change behavior; only mechanical layer does

**Insight:** Cross-platform validation of the load-bearing P-META-001 + P-META-005 design
choice. The user cites a CSP-platform constitutional memory entry
(`feedback_corrections_must_be_mechanical CONSTITUTIONAL S192`) as the operating principle
for THIS work. Implication: build mechanical layer NOW, not "next session."

**Verbatim source:** "That's exactly the failure pattern: memory alone doesn't change
behavior; only mechanical layer does (per feedback_corrections_must_be_mechanical
CONSTITUTIONAL S192). Building the mechanical layer NOW, not 'next session.'"

**Why this is load-bearing:** independent platform evidence (CSP, separate from CSPS)
identified the SAME failure mode that S001 → S002 has been correcting:
- AGENTS.md compliance is necessary but insufficient
- Memory-only fixes regress within sessions
- Mechanical enforcement (hooks + audits + validators) survives session loss

This validates:
- S001's mechanical-enforcement architecture (P-META-001 defense in depth)
- S002's P-META-004 stewardship audits + P-META-005 forcing functions
- This-turn's UserPromptSubmit hook + blocker registry + two-sided handshake

**Recommended downstream action:**
1. Append to `_handoff/VAULT/insights.md` under "Insights from S002" — third independent
   platform validation of mechanical-not-memory (after the Stewardship Protocol gap +
   Learning Loop gap from S001 close).
2. Add to `pillar-0/learning-loop.md` "industry parallels" — CSP S192 constitutional
   memory pattern as a sibling-system reference.

**Status:** `pipeline_state: validated`. Recurrence-check at 2026-08-01: verify the
mechanical-layer-built-this-session (UserPromptSubmit hook + blocker registry + handshake
mechanics) is actually firing on subsequent uploads.
