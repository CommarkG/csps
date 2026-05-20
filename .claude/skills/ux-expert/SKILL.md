---
name: ux-expert
description: When reviewing UX flows OR auditing user journeys through apps OR identifying friction points in interfaces OR reviewing the developer experience of the CSPS governance system itself — apply UX principles to both the product apps and the governance tooling. Triggers on "UX", "user experience", "user flow", "friction", "journey", "developer experience", "DX", "onboarding", "interface", "usability". Applies to: app UX (the 30 SaaS products), governance UX (the developer experience of using CSPS), and AI interaction UX (how the council/skills are experienced by the user).
allowed_tools: [Read, Glob]
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: []
sensitive_data_access: false
backed_by_principle: P-ARCH-016
backed_by_contract: B_AI_PROFESSIONAL_VOICE
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: ux-audit-with-friction-points-and-improvements
  max_tokens: 2000
  no_synthesis_outside_main: true
  no_ratification_claims: true
trust_tier: platform-owned
preflight_check_required: false
principle_compliance:
  - P-META-010
  - P-META-002
  - P-ARCH-016    # universal-terms-first (vocabulary affects UX)
consolidation_cross_refs:
  - docs/plan/pillar-5-ai-systems/README.md    # persona + agent UX
  - packages/glossary/glossary.yaml            # vocabulary for UX consistency
template_grade: B
links:
  - { rel: p-meta-022, href: ../../../../docs/plan/pillar-0-governance/human-intent-crystallization.md }
scope_level: S1
batch: BATCH-C
lifecycle_state: active
template_depth: L2
parent_template: skill-base
---

# /ux-expert — UX flows, friction, and developer experience

## Three UX domains in CSPS

### 1. App UX (the 30 SaaS products)
- User flows through the product
- Onboarding friction
- Task completion paths
- Error recovery

### 2. Governance UX (developer experience of CSPS itself)
- How hard is it to create a properly governed artifact?
- How many steps to ratify a new principle?
- Is the §KH checklist a friction creator or a quality enabler?
- Is pnpm verify fast enough to not break flow?

### 3. AI interaction UX (council/skills experience)
- Does the right skill load for the right prompt? (10-scenario test)
- Is the context-loading template producing useful suggestions?
- Does The Threshold classify correctly or create friction?

## UX audit output
```
ux_audit:
  domain: app | governance | ai-interaction
  friction_points:
    - location: <where>
      severity: HIGH | MED | LOW
      pattern: <what UX pattern is violated>
      improvement: <specific change>
  flow_map: <intent → steps → outcome>
  friction_score: 1-10 (1 = frictionless, 10 = unusable)
```

## The Governance UX criterion (unique to CSPS)
Governance tooling should feel like GPS, not like a checklist. It should:
- Tell you WHERE you are (current state)
- Tell you WHERE to go (next step)
- Warn about WRONG TURNS (violations)
Without making the journey feel like bureaucracy.
