---
name: cc-absorption-csps
description: When processing user prompts OR composing governor-prompts log entries OR cross-linking cardinal directives to user-intents.md — load Governor Prompts schema + cardinal cross-link discipline + GP entry pattern + distribution-targets taxonomy. Triggers on "governor prompts", "GP-S", "cardinal", "user-intents", "user directive", "verbatim", "prompt log".
allowed_tools: [Read, Write, Edit, Grep]
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: []
sensitive_data_access: false
backed_by_principle: P-META-012
backed_by_contract: B_GOVERNOR_PROMPTS
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_GOVERNOR_PROMPTS
  - B_INTAKE_DISCIPLINE
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: structured-gp-entry-or-cardinal-cross-link
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

# /cc-absorption-csps — Governor Prompts + Cardinal Cross-Link Discipline

## When to invoke

- After every substantive user prompt (logging GP entry continuously during session)
- When detecting a CARDINAL directive (verbatim quote worth preserving in user-intents.md)
- At session-close (review GP log + cardinal cross-link audit)

## When to skip (counterweight)

Trivial conversational prompts ("proceed" / "ok" / "thanks") use abbreviated entry: timestamp + verbatim + status:confirmation; targets may be null. Per B_GOVERNOR_PROMPTS counterweight.

## GP entry schema (per B_GOVERNOR_PROMPTS + P-META-012)

```yaml
### GP-S<NNN>-<NN> — <short-title>
- timestamp: <ISO-8601-UTC>
- verbatim: "<exact user words>"
- tags:
    - domain:<closed-enum>
    - type:<closed-enum: directive | question | confirmation | ratification | drop>
    - audience:<closed-enum: ai-agent | developer | end-user>
    - cardinal:<YES | no>
    - engraving:<no | candidate | multi>
    - decision:<no | authority-grant | authorization | ratification | drop>
- distribution: → <principle / contract / leaf / audit / ADR / decision / drop>
- cardinal_cross_link: user-intents.md S<NNN> section (if cardinal:YES)
- attached_document: <path or null>
- status: <completed | in-progress | carry-forward | dropped> turn <N>
```

## Closed-enum tag values

- `type:`: directive / question / confirmation / ratification / drop / handshake / authorization / analysis-only / resource-grant
- `cardinal:`: YES / no
- `engraving:`: no / candidate / potential / multi / absorption / memory+permissions / document / enhancement
- `decision:`: no / authority-grant / authorization / ratification / drop

## Distribution targets (closed enum)

- principle_engravings (P-META / P-ARCH / P-OPER additions)
- contract_engravings (new B_*)
- leaf_amendments (pillar-* leaves)
- audit_registrations (audit-runner.md slugs)
- adr_filings (docs/adr/*)
- decisions_via_PCR (recorded in element-reviews or GP entry)
- explicit_drops (with reason)
- template_authoring (new templates)
- sibling_topic_plans_opened
- topic_plans_closed
- element_reviews
- session_close (handoff + closing-summary)

## Cardinal cross-link to user-intents.md

When a GP is `cardinal:YES`, append verbatim quote to [user-intents.md S<NNN> section](../../../docs/plan/_handoff/VAULT/user-intents.md) with reciprocal cross-link to GP-S<NNN>-<NN>. Bidirectional integrity required (validator: `cardinal-cross-link-propagated`; week-4 impl).

## Storage path

`docs/plan/_handoff/VAULT/governor-prompts/S<NNN>.md` — per-session log; immutable point-in-time record per naming-policy Rule 2.

## Anti-patterns

- cardinal-without-user-intents-cross-link
- prompt-without-gp-entry (substantive prompt missed)
- distribution-null-without-explicit-drop
- batch-at-close-only (close is review-not-creation; track continuously)
- paraphrased-not-verbatim
- arbitrary-not-schema-aligned-tags

## Backed by

P-META-012 + B_GOVERNOR_PROMPTS (S005 turn 27 user directive: "all I write each time reviewed each time session closing and saved in specific place... distributed according to the SCHEMA structure"). Full canonical: [governor-prompts/README.md](../../../docs/plan/_handoff/VAULT/governor-prompts/README.md).


---

## Identity (SKILL-BASE compliance — S050)

- **Name:** cc-absorption-csps
- **Role:** When processing user prompts OR composing governor-prompts log entries OR cross-linking cardinal directives to user-intents.
- **Scope:** S1 | **Trust tier:** platform-owned

## AAP Alignment

- **B_AI_PROFESSIONAL_VOICE:** active — direct, evidence-based output, no sycophancy
- **B_VALIDATE_BEFORE_ASSUME:** active — every state claim cites tool output in current response
- **Additional contracts:** B_AI_PROFESSIONAL_VOICE, B_VALIDATE_BEFORE_ASSUME, B_GOVERNOR_PROMPTS, B_INTAKE_DISCIPLINE

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
- **Backed by:** P-META-012 + B_GOVERNOR_PROMPTS
