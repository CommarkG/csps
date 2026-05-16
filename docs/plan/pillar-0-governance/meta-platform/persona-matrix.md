---
id: csps.governance.meta-platform.persona-matrix
name: persona-matrix
description: "Which cognitive skill governs which meta-platform element — consolidation for plan-items, cruel-critic for implementation-gate, etc. The 6-persona chain."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: vault_files
diataxis_type: reference
session: S037
depth_level: 2
impl_status: swift-implemented
links:
  - { rel: parent, href: ./README.md }
  - { rel: skills, href: ../../../../.claude/skills/ }
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:stable
scope_level: S1
---

# Persona Matrix — Which Skill Governs What

The 6-persona chain (consolidation → balance → domain → ux → critic → synergy) applies to every significant PI item before implementation. This matrix maps each persona to the meta-platform element it governs most directly.

## Persona → Meta-Platform Mapping

| Persona | Primary element | Key question it asks |
|---|---|---|
| **Consolidation** | Plan Items | "Does this PI duplicate an existing PI or pattern? Run B_CONSOLIDATION_PASS first." |
| **Balance Expert** | PE Agent / all | "Is the PE score inflated? Is this complexity debt dressed as platform value?" |
| **Domain Expert** | Knowledge Engine | "Is this research confronted with CSPS DNA? What's the absorption verdict?" |
| **UX Expert** | Threshold Gate / App Pipeline | "What does the user actually experience? Is the wizard flow intuitive?" |
| **Cruel Critic** | Implementation Gate | "What breaks at scale? What's the O(N²) hiding here? Is this advisory long enough?" |
| **Synergy Master** | All elements | "How does this change enhance the other 5 elements? CSEP filed?" |

## The Sequential Chain

The chain must run IN ORDER. Each persona builds on the previous:

```
Step 1: Consolidation  → verifies we're not duplicating
Step 2: Balance        → verifies PE score is honest
Step 3: Domain         → verifies architectural correctness
Step 4: UX             → verifies user experience correctness
Step 5: Cruel Critic   → full context from Steps 1-4, generates strongest critique
Step 6: Synergy        → propagates insights across platform
```

The value of Step 5 (Cruel Critic) compounds from Steps 1-4 — it is dramatically more valuable with full sequential context than as a standalone review. This is the moat: the accumulated context.

## Enforcement

- `tools/validators/validate-persona-chain-complete.mjs` — for PI files with `status: implementing`, checks `persona_chain_log:` for all 6 personas with `status: complete`
- Skills: each persona is a `.claude/skills/` SKILL.md loaded by the AI on trigger
- B_AGENT_ALIGNMENT_PROTOCOL governs all skill invocations

## Log Format (in PI YAML)

```yaml
persona_chain_log:
  - persona: consolidation
    status: complete
    session: S037
    finding: "No duplicates found — PI-NNN is novel"
  - persona: balance
    status: complete
    session: S037
    finding: "PE score 88 is justified — platform-wide impact verified"
  # ... (domain, ux, critic, synergy)
```

*Source: OPUS-2 Turn 62 §4 sequential chain | S037-D*
