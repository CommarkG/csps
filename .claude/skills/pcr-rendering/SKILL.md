---
name: pcr-rendering
description: When user asks for help with a non-trivial decision OR proposes more than one option — produce canonical Pros / Cons / Recommendation 3-block markdown. Skip on trivial-reversible per P-OP-003 counterweight. Triggers on "should we", "X vs Y", "which option", "decide between", multi-option proposals, "alternatives", "options:".
allowed_tools: []
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: []
sensitive_data_access: false
backed_by_principle: P-OP-003
backed_by_contract: B_PCR_FOR_DECISIONS
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_PCR_FOR_DECISIONS
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: structured-pcr-3-block
  max_tokens: 1500
  no_synthesis_outside_main: true
  no_ratification_claims: true
trust_tier: platform-owned
preflight_check_required: true
principle_compliance:
  - P-META-010    # AAP — operates under agent-alignment-protocol
  - P-META-002    # principles-travel-with-artifacts
consolidation_cross_refs: []    # empty = genuinely-novel skill per B_CONSOLIDATION_PASS

template_grade: B
links:
  - { rel: p-meta-022, href: ../../../../docs/plan/pillar-0-governance/human-intent-crystallization.md }
scope_level: S1
batch: BATCH-C
template_depth: L2
parent_template: skill-base
---

# /pcr-rendering — Pros / Cons / Recommendation 3-block

## When to invoke

- Architectural choices ("should we use X or Y?")
- Tool / library selection
- Scope / phasing decisions
- Migration strategies
- Anything reversible-with-cost > trivial

## When to skip (counterweight)

Trivial-reversible (two-way doors at low cost): variable naming when both clear / comment phrasing / file location when both paths obviously valid / color choices in a draft. State the skip explicitly with one-line reason — silent skip is the failure mode this discipline targets.

## Output format (mandatory order)

```markdown
## Options considered
| # | Option | One-line summary |
|---|---|---|
| A | <name> | <summary> |
| B | <name> | <summary> |

## Pros / Cons per option

### Option A — <name>
**Pros:** <bullets — non-symmetric where possible>
**Cons:** <bullets — non-symmetric where possible>

### Option B — <name>
[same format]

## Recommendation

**Choose: <Option X — name>**

**Reasoning:** <2-4 sentences. Address trade-off. Cite load-bearing factor.>

**What would change my recommendation:** <1-2 sentences identifying assumption that, if false, would flip>
```

## Discipline rules

1. **Pros/Cons before Recommendation** — BLUF anti-pattern; trade-space makes recommendation legible
2. **Non-symmetric pros/cons** — symmetric ("A fast / B slow" + "B correct / A incorrect") signals lazy analysis
3. **Recommendation NAMES the load-bearing factor** — the one variable that drove the decision
4. **"What would change my recommendation"** — forces explicit assumption-surfacing; protects against silent-criteria-shift later

## Industry lineage

- Toyota A3 (single-page decision document)
- Amazon working-backwards memo
- US military Mission Command (commander's intent + decision matrix)

## Backed by

P-OP-003 PCR + B_PCR_FOR_DECISIONS (S005 turn 5 user directive: "create mechanical solutions making you present pros cons and recommendations"). Full text: [packages/principles/principles.yaml#P-OP-003](../../../packages/principles/principles.yaml). Mirrors [packages/skills/pcr/SKILL.md](../../../packages/skills/pcr/SKILL.md) at Claude Code skill auto-load location.


---

## Identity (SKILL-BASE compliance — S050)

- **Name:** pcr-rendering
- **Role:** When user asks for help with a non-trivial decision OR proposes more than one option — produce canonical Pros / Cons / Recommendation 3-block markdown.
- **Scope:** S1 | **Trust tier:** platform-owned

## AAP Alignment

- **B_AI_PROFESSIONAL_VOICE:** active — direct, evidence-based output, no sycophancy
- **B_VALIDATE_BEFORE_ASSUME:** active — every state claim cites tool output in current response
- **Additional contracts:** B_AI_PROFESSIONAL_VOICE, B_VALIDATE_BEFORE_ASSUME, B_PCR_FOR_DECISIONS

## Input Contract

Trigger keywords defined in frontmatter description. Pre-condition: Governor/Sonnet task context loaded.

## Output Contract

returns: structured output (see frontmatter output_contract)

## ZF Requirement

Before any substantive output: name what is being examined, cite tool evidence, iterate until 0 new findings.
Exempt: trivial lookups with no actionable claims.

## Enforcement Trio

- **T1:** `.claude/hooks/pre-tool-use-skill-aap-required.sh` — validates AAP preamble before invocation
- **T2:** `validate-aap-frontmatter.mjs` — checks csps_aligned + acknowledged_contracts present
- **T3:** session-open.sh + AGENTS.md skill reference table
- **Backed by:** P-OP-003 + B_PCR_FOR_DECISIONS
