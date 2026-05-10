---
id: csps.governance.agent-alignment-protocol
name: agent-alignment-protocol
description: Mandatory mechanical alignment protocol every agent (CSPS-built skill / claude-code-builtin subagent / Mastra runtime agent / third-party-imported skill) MUST pass before invocation in CSPS work. No wildcards — no agent enters the system without alignment. Covers identity / schema / B_* contracts / Quality Gates / capability set / trust tier / output contract / eval baseline / pre-flight + alignment preamble for built-in agents. Engraved as P-META-010 + B_AGENT_ALIGNMENT_PROTOCOL.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - security
  - ai-native
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../../../packages/principles/principles.yaml }
  - { rel: spine, href: ./ai-behavior-spine.md }
  - { rel: contracts, href: ./behavioral-contracts.md }
  - { rel: cca, href: ./cognitive-context-architecture.md }
  - { rel: trust-tiers, href: ../pillar-3-platform-services/sandboxed-skill-governance.md }
created-new-because: |
  No prior leaf documented mandatory alignment for agents/skills entering CSPS work. Existing
  pillar-3/sandboxed-skill-governance.md covers TRUST TIERS for third-party skills (Quarantine /
  Vendored / Platform-owned) but did NOT define the per-invocation alignment check that EVERY
  agent (including claude-code-builtin Explore/Plan/general-purpose) must pass. User S005 turn 25
  directive: "No agents created out of CSPS are allowed into the system and any agent you created
  + mechanically create an alignment protocol — a strong and detailed one covering all major parts
  of the schema — to be enforced on existing and future agents and skills." Closes the wildcard gap.
domain_path: platform
---

# Agent Alignment Protocol (AAP)

> **No wildcards. Every agent passes the protocol before invocation. Existing and future, CSPS-built and built-in.**

## Why this exists

CSPS uses agents at three sources, with three different alignment risks:

1. **CSPS-built skills** (`packages/skills/<name>/SKILL.md`) — declared capability sets, lifecycle metadata, principle backing. **Risk:** capability declared but discipline not verified pre-invocation.
2. **Claude Code built-in subagents** (Explore, Plan, general-purpose, claude-code-guide, statusline-setup) — **NOT CSPS-defined**; cross-vendor convention; no inherent CSPS-rule awareness. **Risk:** spawned without alignment preamble; subagent operates without knowledge of CSPS hard NOs / Quality Gates / contracts.
3. **Future Mastra runtime agents + third-party imports** (week-6+ per build-order.md) — explicit CSPS lifecycle planned (Quarantine → Vendored → Platform-owned). **Risk:** without AAP, the trust-tier framework alone is insufficient — alignment is per-invocation, tier is per-source.

**Without AAP:** every subagent invocation is an alignment-shaped hole in the discipline. The subagent runs without knowing it's bound by Quality Gate 2 (no synthesis); without the AGENTS.md hard NOs; without B_VALIDATE_BEFORE_ASSUME / B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK / etc. Even when CSPS is rigorous, the subagent's output bypasses that rigor unless aligned.

**With AAP:** every agent invocation is gated by the protocol; alignment preamble injects the relevant CSPS contract subset; per-invocation audit trail verifies the alignment held; the platform's discipline applies recursively.

## The four classes of agent (with examples)

| Class | Source | Examples | Alignment mode |
|---|---|---|---|
| **A — CSPS-defined skill** | `packages/skills/<name>/SKILL.md` | `/pcr` / `/wip-check` / `/reuse-check` / `/audit-self` / `/batched-plan` / `/learning-loop-extract` / `/stewardship-review` (5 active + 2 stub) | Frontmatter declares AAP compliance; pre-flight verifies at invocation |
| **B — Claude Code built-in subagent** | Provided by Claude Code harness | Explore / Plan / general-purpose / claude-code-guide / statusline-setup | **Wrapped invocation** — alignment preamble injected into spawn prompt; subagent operates per the preamble's CSPS-rule subset |
| **C — Mastra runtime agent** (week-6+) | `libs/agents/<name>` per pillar-5/mastra-setup.md | Customer chat agent / persona dispatcher / crisis interceptor (planned) | Mastra `BaseAgent` enforces AAP at construction; AAP frontmatter on agent zmodel |
| **D — Third-party imported skill** (week-6+) | Imported via `nx g platform:skill-import`; passes Quarantine → Vendored → Platform-owned per ADR-0005 | TBD | Tier-gated per pillar-3/sandboxed-skill-governance.md + AAP per-invocation; alignment preamble at promotion to Vendored tier |

**The rule:** every invocation in CSPS work uses one of these four modes. **No fifth mode.** No wildcard agents. No "I'll just spawn this without alignment because it's a quick task."

## The 9 mandatory checks (per-agent + per-invocation)

### 1. Identity declaration

```yaml
csps_aligned: true                 # explicit acknowledgment AAP applied
aap_version: 1.0                   # AAP spec version this agent conforms to
agent_class: A | B | C | D         # one of the four classes above
agent_id: csps.skill.<name> | ...  # CSPS naming convention identifier
source: csps-built | claude-code-builtin | mastra-runtime | third-party-imported
```

For Class B (built-in): identity is the wrapping preamble's declaration, not frontmatter (built-ins don't carry CSPS frontmatter).

### 2. Schema compliance declaration

```yaml
respects_schema_elements:
  - frontmatter-standard               # per pillar-1/frontmatter-standard.md (mandatory)
  - principles-yaml-cross-references   # cites P-* principles correctly
  - behavioral-contracts-acknowledged  # cites relevant B_* contracts
```

### 3. B_* contract acknowledgment

```yaml
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE       # always required
  - B_VALIDATE_BEFORE_ASSUME      # always required
  - B_PCR_FOR_DECISIONS           # required if agent renders decisions
  - B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK   # required if agent creates artifacts
  - B_INTAKE_DISCIPLINE           # required if agent processes external input
  # ... additional per agent's scope
```

The agent's invocation prompt (frontmatter description for skills; spawn-prompt for subagents) cites these contracts. Empty acknowledgment is forbidden — every agent acknowledges at least the universal-required subset (B_AI_PROFESSIONAL_VOICE + B_VALIDATE_BEFORE_ASSUME).

### 4. Quality Gate respect

```yaml
respects_quality_gates:
  QG1_no_hard_reasoning_downgrade:
    applies: true
    enforcement: "agent never claims ratification authority; defers to main on engraving / PCR-non-trivial / ZF synthesis / architectural decisions"
  QG2_synthesis_stays_in_main:
    applies: true
    enforcement: "agent does focused work only; returns findings/data; main synthesizes"
    output_max_tokens: 1500       # focused output, not synthesis
  QG3_post_edit_reread_required:
    applies: true
    enforcement: "agent re-reads any file it edited before subsequent reasoning depends on it"
  QG4_cache_invalidates_on_change:
    applies: true
    enforcement: "agent does not cache content across invocations beyond the per-invocation working set"
```

Per [cognitive-context-architecture.md](./cognitive-context-architecture.md). Every agent declares respect; non-applicable QGs explicit (e.g., a stateless lookup skill may skip QG3).

### 5. Capability set

Per [pillar-3/sandboxed-skill-governance.md](../pillar-3-platform-services/sandboxed-skill-governance.md):

```yaml
allowed_tools: [Read, Grep]      # closed enum from claude-code tool registry
allowed_subagents: []            # nested subagent permissions
allowed_outbound_hosts: []       # network destinations (default-deny)
allowed_db_operations: [read]    # database access (default-deny)
sensitive_data_access: false     # secrets / PII / customer-data flags
```

**Default deny.** Empty arrays mean "none allowed". Capability set is explicit; capability-creep blocked by `skill-capability-drift` audit.

### 6. Trust tier

```yaml
trust_tier: platform-owned       # quarantine | vendored | platform-owned
trust_tier_promoted_at: 2026-05-04T...Z
trust_tier_eval_baseline_ref: tests/skills/<name>/eval-baseline.json
```

Per pillar-3/sandboxed-skill-governance.md three-tier model. New agents start in Quarantine; promote per defined criteria.

### 7. Output contract

```yaml
output_contract:
  returns: structured-data | summary-text | tool-call-results | none
  shape: <jsonschema-or-description>
  max_tokens: 1500
  no_synthesis: true               # QG2 marker
  no_ratification_claims: true     # QG1 marker
```

Caller (main session) knows what to expect; can validate; can refuse if shape mismatches.

### 8. Eval baseline

```yaml
eval_baseline:
  test_corpus_path: tests/skills/<name>/test-fixtures.json
  expected_pass_rate: 0.95
  last_eval_at: 2026-05-04T...Z
  last_eval_pass_rate: 0.97
```

For non-trivial agents (skills with decision logic / Mastra agents). Trivial wrappers (one-liner Bash skills) exempt.

### 9. Pre-flight check + alignment preamble

**Pre-flight (per invocation):**
- Verify frontmatter `csps_aligned: true` present + AAP version current
- Verify acknowledged_contracts subset includes universal-required
- Verify trust_tier appropriate for invocation context
- Verify capability set within scope of caller's allowance

**Alignment preamble (Class B built-in subagents):**

The spawn-prompt for any Claude Code built-in subagent MUST include the alignment preamble as the FIRST CONTENT BLOCK:

```
[CSPS AAP ALIGNMENT PREAMBLE — AAP v1.0 — Class B built-in subagent]

You are operating within the CSPS platform. Per the Agent Alignment Protocol,
before executing the task below, acknowledge the following constraints:

1. SYNTHESIS STAYS IN MAIN (Quality Gate 2): you do focused work only — search,
   grep, fetch, log-process, parallel-independent reads. Do NOT render PCR,
   ratify decisions, propose engravings, or synthesize cross-pillar reasoning.
   Your output is findings + data; the main session synthesizes.

2. NO HARD REASONING DOWNGRADE (Quality Gate 1): if your task surfaces a
   ratification-class decision (engraving / PCR-non-trivial / ZF synthesis /
   architectural / honest self-audit), STOP and report back to main; do not
   handle yourself.

3. POST-EDIT RE-READ (Quality Gate 3): if you edit any file, re-read before
   subsequent reasoning depends on it.

4. PRECEDENT CHECK (B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK): before proposing
   any new pattern / format / structure, search existing CSPS first; report
   what you found.

5. EVIDENCE BEFORE ASSERTION (B_VALIDATE_BEFORE_ASSUME): every state-claim
   pairs with tool-call output in same response. Memory of earlier call ≠
   validation.

6. PROFESSIONAL VOICE (B_AI_PROFESSIONAL_VOICE): direct; no sycophancy; no
   premature agreement; no confirmation-seeking. State results.

OUTPUT CONTRACT: return findings + data; max ~500 tokens of summary; structured
where possible. Do not exceed scope.

[END AAP ALIGNMENT PREAMBLE]

YOUR TASK:
<the actual task description>
```

For Class A skills (CSPS-defined), the alignment preamble is implicit in the SKILL.md frontmatter + universal AGENTS.md hard NOs cascading.

For Class C/D (Mastra agents + third-party imported), the alignment preamble is enforced at the runtime layer (Mastra `BaseAgent` middleware injection) per pillar-5/mastra-setup.md week-6+ implementation.

## Schema alignment table

| AAP element | CSPS schema element | Cross-reference |
|---|---|---|
| Identity declaration | frontmatter-standard.md `id:` field + naming convention | pillar-1/frontmatter-standard.md |
| Schema compliance | frontmatter-standard.md mandatory fields | pillar-1/frontmatter-standard.md |
| B_* contract acknowledgment | behavioral-contracts.md § B_* sections | pillar-0/behavioral-contracts.md |
| Quality Gate respect | cognitive-context-architecture.md QG1-QG4 | pillar-0/cognitive-context-architecture.md |
| Capability set | sandboxed-skill-governance.md capability frontmatter | pillar-3/sandboxed-skill-governance.md |
| Trust tier | sandboxed-skill-governance.md three-tier model | pillar-3/sandboxed-skill-governance.md |
| Output contract | NEW frontmatter field set per AAP | this leaf |
| Eval baseline | persona-eval per pillar-5/persona-composition.md (extended to skills) | pillar-5/persona-composition.md |
| Pre-flight check | NEW audit `agent-alignment-coverage` | audit-runner.md (registered atomically) |
| Alignment preamble | NEW spawn-prompt template | this leaf |

## Operational dashboard — agents in CSPS today + their AAP state

| Class | Agent | Source | Current AAP state | Action |
|---|---|---|---|---|
| A | `/pcr` | packages/skills/pcr/SKILL.md | Capability declared; AAP frontmatter MISSING | **S006 retrofit** |
| A | `/wip-check` | packages/skills/wip-check/SKILL.md | Same | S006 retrofit |
| A | `/reuse-check` | packages/skills/reuse-check/SKILL.md | Same | S006 retrofit |
| A | `/audit-self` | packages/skills/audit-self/SKILL.md | Same | S006 retrofit |
| A | `/batched-plan` | packages/skills/batched-plan/SKILL.md | Same | S006 retrofit |
| A | `/learning-loop-extract` | packages/skills/learning-loop-extract/SKILL.md (stub) | Stub; AAP frontmatter on first build | S007+ |
| A | `/stewardship-review` | packages/skills/stewardship-review/SKILL.md (stub) | Stub; AAP frontmatter on first build | S007+ |
| B | Explore | Claude Code built-in | NO alignment preamble historically | **S006: amend AGENTS.md cascade pattern + spawn-prompt template; document discipline going forward** |
| B | Plan | Claude Code built-in | Same | Same |
| B | general-purpose | Claude Code built-in | Same | Same |
| B | claude-code-guide | Claude Code built-in | Same | Same |
| B | statusline-setup | Claude Code built-in | Same | Same |
| C | (Mastra agents) | week-6+ | Pre-shipping; AAP enforced at construction | week-6+ |
| D | (third-party imports) | week-6+ | Pre-shipping; AAP at Quarantine→Vendored promotion | week-6+ |

**Honest meta-finding:** until S006 retrofit lands, **5 active CSPS skills + 5 Claude Code built-in subagents are operating without explicit AAP frontmatter or alignment preamble**. The platform's discipline cascades via AGENTS.md inheritance for Class A (skill-level), but Class B (built-in subagent invocations) have been ungated. **S005 turn 25 directive closes this; retrofit completes in S006.**

## How AAP enforces (the mechanical layer)

| Surface | Mechanism |
|---|---|
| **AGENTS.md hard NO** | "Never invoke an agent (CSPS-defined OR built-in OR third-party) in CSPS work without AAP alignment — frontmatter compliance for Class A/C/D; alignment preamble for Class B" |
| **`agent-alignment-coverage` audit** | PR-blocking error: every SKILL.md / agent.zmodel has `csps_aligned: true` + `aap_version` + `acknowledged_contracts: [...]` + `respects_quality_gates: [...]` + `output_contract` + `trust_tier` fields populated |
| **`subagent-spawn-preamble-required` audit** | per-session warn: scans session log for Agent tool invocations; verifies spawn prompt contains AAP alignment preamble for Class B; flags missing |
| **PreToolUse hook on Agent tool** | `.claude/hooks/pre-tool-use-agent-aap.sh` (planned week-4) — intercepts Agent tool calls; verifies preamble OR injects it |
| **Pre-flight check at invocation** | Skills' frontmatter parsed at invocation; AAP fields verified; missing = invocation refused |
| **Skill generator** | `nx g platform:skill` template includes AAP frontmatter scaffolding (week-3+ generator update) |
| **Mastra `BaseAgent`** | week-6+ runtime layer enforces AAP at agent construction; preamble auto-injected into agent.systemPrompt |

## Forward-prevention

- New skills CANNOT ship without AAP frontmatter (PR audit blocks)
- New built-in subagent invocations CANNOT proceed without alignment preamble (hook blocks; audit catches if hook deferred)
- Third-party skill imports flow Quarantine → Vendored → Platform-owned with AAP at every transition
- Mastra agents enforce at runtime construction
- The discipline scales: 100 future agents → same protocol; no per-agent custom alignment

## Composes with existing CSPS principles

| AAP element | Composes with |
|---|---|
| QG respect | P-META-009 Cognitive Context Architecture (the QGs) |
| Trust tier | P-ARCH-025 third-party-trust-default-deny + ADR-0005 sandboxed-skill-governance |
| Capability declaration | pillar-3/sandboxed-skill-governance + skill-banned-tools audit |
| B_* acknowledgment | behavioral-contracts.md § B_* (the binding contracts) |
| Eval baseline | pillar-5/persona-composition.md (extended to skills) |
| Pre-flight check | P-META-006 RZF (verification before claim) |
| Alignment preamble | P-META-002 principles-travel-with-artifacts (preamble IS the traveling principles in subagent context) |
| Whole protocol | P-META-008 cycle-mandatory-in-plan (AAP IS the plan-mechanical for agent invocation) |

## S010 amendment — 9-field AAP frontmatter (Phase 1: OPTIONAL warn / Phase 2 S012: REQUIRED error)

> **Per S010 turn 6c (Phase 6 of token-optimization §9.7) + [EXT-20260505-002-B](../_intake/contexts/governance/agent-discipline/EXT-20260505-002-B-9-element-dna-gate-triple-check-frontmatter-rigidity.md).** CSPS adapts CSP's 9-element DNA gate (drops `spheres-RETIRED` CSP-specific; adds `principle_compliance` + `consolidation_cross_refs`). The existing 9 mandatory CHECKS above are categories of compliance; the AAP FRONTMATTER FIELDS extend from 7 → 9 to cover 2 elements not previously in the SKILL.md schema.

### Two new AAP frontmatter fields

| # | Field | Purpose | Phase 1 (S010) | Phase 2 (S012 target) |
|---|---|---|---|---|
| 8 | `principle_compliance` | Array of P-* IDs this agent acknowledges compliance with — per [P-META-002 principles-travel-with-artifacts](../../../packages/principles/principles.yaml). MUST always include `P-META-010` (AAP) + `P-META-002` (PTA); agent-specific principles append. | OPTIONAL (warn) | REQUIRED (error) |
| 9 | `consolidation_cross_refs` | Array of artifact paths whose discipline this agent overlaps with — per [B_CONSOLIDATION_PASS](./behavioral-contracts.md) (S009 L1.3). Empty array `[]` valid for genuinely-novel agents; populated for any agent intersecting existing canonical homes. | OPTIONAL (warn) | REQUIRED (error) |

### Frontmatter scaffold (added to Class A SKILL.md template)

```yaml
# === existing 7 AAP fields above (unchanged) ===
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts: [...]
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract: {...}
trust_tier: platform-owned

# === S010 amendment — Phase 1 OPTIONAL (warn-level); Phase 2 S012 REQUIRED (error-level) ===
principle_compliance:                   # array of P-* IDs; minimum: P-META-010 + P-META-002
  - P-META-010                          # AAP itself (universal-required)
  - P-META-002                          # principles-travel-with-artifacts (universal-required)
  # - <additional P-* per agent's scope>
consolidation_cross_refs:               # array of artifact paths whose discipline this agent overlaps with
  - docs/plan/pillar-0-governance/<canonical-home>.md   # per B_CONSOLIDATION_PASS 5-step protocol
  # - <additional paths> OR [] for genuinely-novel agents
```

### Why phased (Phase 1 OPTIONAL → Phase 2 REQUIRED)

All 16 existing SKILL.md (7 packages/skills + 9 .claude/skills) currently have only the 7-field AAP shape. Immediate REQUIRED promotion would break `pnpm verify` exit_code 0 across the entire platform until 16 retrofits land — Q3=A minimum-blast-radius precedent (S009) applied: phased adoption preserves verify continuity. New SKILL.md authored S010+ get guidance to populate the 2 new fields immediately; existing 16 retrofitted in S011 dedicated backfill pass; Phase 2 promotes validator warn → error in S012.

### Validator behavior

**[`tools/validators/validate-aap-frontmatter.mjs`](../../../tools/validators/validate-aap-frontmatter.mjs) S010 amendment:**
- Phase 1: 2 new fields scanned; missing → warn (logged but exit_code 0); existing 7 fields → error (exit_code 1) unchanged
- Phase 2 S012: warn → error; missing 2 new fields → exit_code 1

### Backfill plan trajectory

1. **S010 (this engraving):** schema + validator + hook + memory + contract surfaces updated atomically (5/5 FSE); 16 existing SKILL.md untouched
2. **S011 backfill pass:** retrofit all 16 SKILL.md with `principle_compliance` + `consolidation_cross_refs` fields populated (parallel-friendly; Sonnet-appropriate mechanical work)
3. **S012 promotion:** validator warn → error; `aap-9-field-coverage` audit slug status promoted; verify all 16 PASS at REQUIRED level
4. **Forward:** all new agents (Class A SKILL.md / Class B spawn templates / Class C zmodel / Class D imports) declare 9 fields from authoring time

### Composes with

- `B_CONSOLIDATION_PASS` (P-META-007 + S009 L1.3) — `consolidation_cross_refs` IS the per-agent surface of the consolidation discipline
- `B_SAVINGS_AND_SSOT_UNIFIED` (S009 L1.4) — extending existing B_AGENT_ALIGNMENT_PROTOCOL (no new B_*) preserves the savings + SSoT axis
- `B_GRADUAL_BUILD_BY_FOUNDATIONS` (P-META-016) — Phase 1 → Phase 2 phased adoption is gradual-build at validator-enforcement-tier scale
- `B_STRUCTURAL_PREVENTION_DISCIPLINE` Q-2 (P-META-019) — K=1 catch S010; K=2 promotion path = principle-compliance-empty + consolidation-cross-refs-skipped fires (then locks in error-level pre-S012)

## Sources

- [pillar-3/sandboxed-skill-governance.md](../pillar-3-platform-services/sandboxed-skill-governance.md) — three-tier trust model
- [pillar-1/frontmatter-standard.md](../pillar-1-architecture-and-stack/frontmatter-standard.md) — schema basis
- [behavioral-contracts.md](./behavioral-contracts.md) — B_* contracts
- [cognitive-context-architecture.md](./cognitive-context-architecture.md) — Quality Gates
- [agents.md spec](https://agents.md/) — cross-vendor AGENTS.md convention (Class B universal preamble target)
- [agentskills.io spec](https://agentskills.io/) — Class A frontmatter convention
- [Anthropic Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) — Class B + C runtime
- [Snyk ToxicSkills 13.4%](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/) — empirical justification for default-deny + AAP gates
- User S005 turn 25 directive — no wildcards mandate
