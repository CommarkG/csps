---
# skill-base.template.md — Master template for ALL CSPS skills.
# P-ARCH-COMPLETE-DEFAULT: all options declared. Sub-skills activate specific sections.
# STALE options are available but not active by default.
# Template ID: SKILL-BASE | registry: docs/plan/_handoff/VAULT/template-registry.md §5
id: skill-[name]
name: [name]
type: skill
template_depth: L2
parent_template: governed-artifact-frontmatter
batch: BATCH-C
lifecycle_state: active
council_state: none
# === ALL OPTIONS — activate as needed, leave others stale ===
# skill_domain: governance | architecture | ai-behavior | quality | planning | product
# triggers_on: [keywords list]
# requires_aap: true              # stale by default — set true if this skill invokes external agents
# requires_context: []            # files the skill needs loaded
# enforcement_tier: T3            # stale — set if this skill enforces a rule
# output_format: BLOCKING | ADVISORY | PCR | REPORT | DIRECTIVE
# stale_options:
#   - persona_simulation: false   # set true if skill simulates a persona
#   - external_invocation: false  # set true if skill calls external systems
#   - governor_ratification: false # set true if output requires Governor ratification
#   - auto_trigger: false         # set true if skill should trigger automatically
#   - csps_core_reminder: []      # AP-001 fix: 1-3 principle IDs most relevant to this skill
---

# [Skill Name]

> **When to use:** [trigger description]
> **Never use for:** [anti-trigger description]

[Skill content here]
