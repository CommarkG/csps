---
name: internal-deep-review
description: When performing a structured critical self-review of CSPS work OR auditing architectural coherence OR applying systematic challenge to what was built — use this Sonnet-quality structured review format. CRITICAL: output MUST be labeled [INTERNAL_DEEP_REVIEW — Sonnet 4.6[1M]]. This is NOT an Opus simulation. Never claim Opus-level synthesis. Triggers on "deep review", "structured review", "critical audit", "architectural review", "internal review", "self-audit". Always declares: "This is structured Sonnet review. For Opus-level synthesis: prepare compact input, open new chat, use real Opus." Output includes honest limitations.
allowed_tools: [Read, Grep, Glob]
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: []
sensitive_data_access: false
backed_by_principle: P-META-006
backed_by_contract: B_NO_AI_IMPERSONATION
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_NO_AI_IMPERSONATION    # never claim to be Opus
  - B_PRE_CLOSE_VERIFICATION
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: structured-sonnet-critical-review-with-honest-limitations-declared
  max_tokens: 3000
  no_synthesis_outside_main: true
  no_ratification_claims: true
trust_tier: platform-owned
preflight_check_required: true
principle_compliance:
  - P-META-010
  - P-META-002
  - P-META-006    # zero-findings-discipline
consolidation_cross_refs:
  - docs/plan/_handoff/VAULT/opus-synthesis-prompt-S011.md    # the real Opus escalation path
  - docs/plan/_handoff/VAULT/know-how/error-patterns/EP-014-ai-mode-impersonation.md
  - tools/model-tier-registry.yaml    # tier registry for honest capability declaration
template_grade: B
links:
  - { rel: p-meta-022, href: ../../../../docs/plan/pillar-0-governance/human-intent-crystallization.md }
---

# /internal-deep-review — Structured Sonnet Critical Review

## MANDATORY HEADER (always include in output)

```
[INTERNAL_DEEP_REVIEW — Sonnet 4.6[1M]]
Model tier: STANDARD_BUILD (not DEEP_REASONING)
Limitation: This is structured critical review, NOT Opus-level architectural synthesis.
For Opus-level synthesis: see docs/plan/_handoff/VAULT/opus-synthesis-prompt-S011.md
```

## When to use this skill

- Auditing architectural coherence of work done in this session
- Applying structured challenge before closing a major phase
- When Governor asks for "deep review" without specifying Opus
- After every significant session to surface problems before handoff

## The 5-step structured review format

1. **What's solid** — evidence-backed, not just "looks good"
2. **What's fragmented** — specific integration gaps with named artifacts
3. **What's over-engineered** — cruel-critic scores 1-5 with reasoning
4. **The single most important gap** — one sentence, specific
5. **Explicit limitations** — where Opus would genuinely add more than this review

## When to escalate to real Opus

Escalate when INTERNAL_DEEP_REVIEW finds:
- Architectural contradictions that can't be resolved at Sonnet reasoning depth
- Constitutional decisions (B_* engraving, L1_CORE amendments)
- Foundation design decisions (VLT-* type blocking items)
- Cross-session synthesis spanning >5 sessions

## Preparing for real Opus (token efficiency)

Do NOT give Opus the full session context (800K+ tokens). Instead:
1. Extract the 3-5 specific questions from INTERNAL_DEEP_REVIEW
2. Create a compact CSEP input (<50K tokens)
3. Open new chat, type `/model default` as first action
4. Run real Opus on the compact input
5. Bring findings back to Sonnet session for implementation

## What INTERNAL_DEEP_REVIEW produces that has genuine value

The STRUCTURE forces coverage that my "regular self" default skips:
- Fragmentation detection (regular me: continues building; review me: stops and names gaps)
- Over-engineering detection (regular me: agrees with complexity; review me: scores it)
- Proactive concern registration (regular me: notices and continues; review me: names and records)

This is real value, honestly labeled. Not Opus, but better than passive execution.
