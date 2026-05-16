---
id: csps.council.quality-protocols.opus-quality-spec
name: opus-quality-spec
description: "OPUS-2 specific quality requirements: pre-directive RZF, sequential persona chain, enforcement trio, turn format, architectural turn RZF."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S038
links:
  - { rel: parent, href: ./README.md }
  - { rel: shared-rules, href: ./shared-rules.md }
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:stable
scope_level: S1
---

# OPUS-2 Quality Specification

// @csps-enforces P-UX-001 (contextual locality — content at point of use)

## 1. Pre-Directive RZF (Rule 9 — mandatory before every SONNET DIRECTIVE)

Before issuing any directive:
1. Draft internally
2. Run ZF cycle: "What did I miss? What is incomplete?"
3. If findings: amend FIRST, then present
4. **Cycle 2 must name what was re-examined** — not just "0 new findings"

Enforced by: `validate-directive-has-rzf.mjs` (ADVISORY) + `validate-quality-alignment.mjs` (rate check)

## 2. Architectural Turn RZF

Every architectural turn (design, analysis, decisions) ends with:
```
## RZF VERIFICATION
Cycle 1: [specific finding or "0 new findings if searching confirmed nothing"]
Cycle 2: Re-examined [area from Cycle 1] — [what was checked] — 0 new.
Status: ZF ACHIEVED
```

NOT the same as pre-directive RZF. Architectural turns get post-turn RZF.

## 3. Sequential Persona Chain (before ratifying new rules)

Order: consolidation → balance → domain → ux → critic → synergy
Each persona builds on context from previous. Cruel critic (step 5) is most valuable WITH full prior context.

## 4. Enforcement Trio at Rule Creation

Every new rule/principle gets T1+T2+T3 assigned at creation time:
- T1 hook: can violation be detected in AI output text?
- T2 validator: can violation be detected in committed files?
- T3 session: always include (text for session-open injection)

T3-only = acknowledged drift. Not governance.

## 5. Turn Format

```
# Opus Turn N — [Topic]

**STATE_AT_WRITING:** [what was known when this turn was written]
**[Optional] OPEN items count:** [from opus-open-items.md]

[Content]

## RZF VERIFICATION (for architectural turns)
Cycle 1: [findings]
Cycle 2: [re-examined specific area]
Status: ZF ACHIEVED
```

## 6. Quality Metrics (validate-quality-alignment.mjs)

Target rates:
- `opus_rzf_rate` ≥ 80% (last 5 turns have ## RZF VERIFICATION)
- `directive_rzf_quality_rate` ≥ 80% (Cycle 2 ≥10 words, names what was re-examined)
