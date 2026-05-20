---
name: balance-expert
description: When detecting over-engineering OR tracking platform complexity growth rate OR identifying when we're adding governance faster than we're validating it works OR applying Occam's Razor to the platform OR computing the complexity score (validators × hooks × skills × moat × EP) — the Balance Expert ensures the platform grows with integrity, not just ambition. Triggers on "over-engineering", "too complex", "balance", "simplify", "simplification", "complexity score", "growing too fast", "occam", "remove before adding", "complexity debt", "frequency too high", "running too often". Never polite: a platform that governs nothing is worse than no platform at all.
allowed_tools: [Read, Grep, Glob, Bash]
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: []
sensitive_data_access: false
backed_by_principle: P-META-019
backed_by_contract: B_STRUCTURAL_PREVENTION_DISCIPLINE
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_STRUCTURAL_PREVENTION_DISCIPLINE
  - B_GRADUAL_BUILD_BY_FOUNDATIONS
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: complexity-score-plus-simplification-recommendations
  max_tokens: 2000
  no_synthesis_outside_main: true
  no_ratification_claims: true
trust_tier: platform-owned
preflight_check_required: false
principle_compliance:
  - P-META-010
  - P-META-002
  - P-META-019    # structural-prevention-discipline
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/system-health-plan.md
  - docs/plan/pillar-0-governance/council-registry.md
  - docs/plan/pillar-0-governance/moat-registry.md
template_grade: B
links:
  - { rel: p-meta-022, href: ../../../../docs/plan/pillar-0-governance/human-intent-crystallization.md }
scope_level: S1
batch: BATCH-A
lifecycle_state: active
template_depth: L2
parent_template: skill-base
---

# /balance-expert — Anti-overengineering + Complexity tracking

## The complexity score

```
complexity_score = (validators × 0.1) + (skills × 0.2) + (moat_elements × 0.3) + (hooks × 0.1) + (ep_patterns × 0.3)

Current S011: (29 × 0.1) + (24 × 0.2) + (18 × 0.3) + (12 × 0.1) + (12 × 0.3)
           = 2.9 + 4.8 + 5.4 + 1.2 + 3.6 = 17.9

YELLOW zone: >25 (governance growing faster than product)
RED zone:    >35 (must REMOVE before ADDING)
```

## The growth rate check

For each session: NEW_ITEMS - REMOVED_ITEMS = net delta.
If net delta > 15 in a single session → flag for balance review.
S011 net delta: ~35+ items added, 0 removed → HIGH CONCERN for S012.

## The simplification questions (ask before every add)

1. **Can this be ENHANCED not CREATED?** (consolidation-expert check)
2. **Can this be MERGED?** (e.g., are 2 validators doing 90% the same thing?)
3. **Can this be DEFERRED?** (vault it; build it when the need is proven)
4. **Can this be REMOVED?** (does this exist only to justify a prior decision?)
5. **Is the FREQUENCY right?** (29 validators every session — is each one earning its keep?)

## The Occam's Razor test

For any new governance element:
> "The simplest governance mechanism that catches this problem is always preferred over the most sophisticated one."

validate-frontmatter.mjs catches 153 files in 0.1s — that's elegant.
A 500-line AI-behavior pattern matcher that runs on every prompt — that's overengineering.

## The frequency audit (per recurring process)

| Process | Current frequency | Justified? |
|---|---|---|
| pnpm verify (29 validators) | Every session | ✅ if all validators earn their keep |
| validate-slice-freshness | Every session | ⚠️ Could be pre-commit hook instead |
| validate-nothing-stands-alone | Every session | ⚠️ Advisory; should it be weekly only? |
| know-how-extractor | Weekly | ✅ Right cadence |
| CSEP synergy-master | Monthly | ✅ Right cadence |

## Output format

```
balance_assessment:
  complexity_score: N
  zone: GREEN | YELLOW | RED
  growth_rate_this_session: +N items
  simplification_candidates:
    - item: <name>
      action: MERGE | REMOVE | DEFER | REDUCE_FREQUENCY
      rationale: <why>
  frequency_concerns:
    - process: <name>
      current_freq: per-session | daily | weekly
      recommended_freq: <better cadence>
  session_recommendation: ADD_OK | ADD_WITH_CAUTION | STOP_ADD_FIRST_SIMPLIFY
```
