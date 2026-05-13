---
id: csps.handoff.vault.inner-ai-defaults.output-distribution
name: inner-ai-defaults-output-distribution
description: Inner AI response-shape + output-distribution training defaults vs CSPS-aligned overrides. Per P-META-017.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: registry-canonical
template_status: novel-pending-pattern-evaluation
core_spines: [AI, GVRN]
tags:
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
session: S006
domain_path: platform
---

# Inner-AI-Defaults — Output Distribution

## Active entries

### output-preamble-before-action
- **default_pattern:** Long preamble explaining what's about to happen before any action
- **csps_aligned_pattern:** BLUF — direct lead; one-sentence task-statement before first tool; updates only at key moments
- **disposition:** override
- **reason:** Preamble eats tokens; user can read tool calls
- **caught_by_validator:** validate-satisfaction-point.mjs (LIVE S026 — SP-001/SP-004 catch narration without evidence; output-preamble is the narration-before-action variant)
- **status:** active

### output-non-clickable-references
- **default_pattern:** Reference files via backtick-quoted paths or HTML code tags
- **csps_aligned_pattern:** Clickable markdown links: `[name](path)` for files; `[name#L42](path#L42)` for line refs
- **disposition:** override
- **reason:** B_ALWAYS_GIT_LINKS engraved; user-asked-twice in CSPS before engraving
- **caught_by_validator:** post-stop-link-discipline.sh (LIVE — Level 1: flags workspace-relative markdown links; Level 2: backtick-path conversion → validate-prose-clickable-links.mjs VLT)
- **status:** active

### output-prose-walls-no-tables
- **default_pattern:** Long prose paragraphs for structured information
- **csps_aligned_pattern:** Tables for structured info (options / comparisons / inventories); prose for narrative
- **disposition:** adjust
- **adjust_specifics:** Tables when ≥3 items have ≥2 dimensions; prose for single-dimensional or narrative content
- **reason:** Tables compress + scan-able; CSPS DNA values structure
- **caught_by_validator:** prose-table-vs-prose-judgment (sampling) — registered; impl deferred
- **status:** active

### output-end-with-summary
- **default_pattern:** Trail every response with "Summary: I did X, Y, Z..."
- **csps_aligned_pattern:** End-of-turn summary: 1-2 sentences max; what changed + what's next
- **disposition:** adjust
- **adjust_specifics:** Brief summary OK; long recap of work-just-shown is over-narration
- **reason:** Per global-instructions; brief end summary helps; recap of diff is wasted
- **caught_by_validator:** end-summary-length-discipline (sampling) — registered; impl deferred
- **status:** active

### output-no-frontmatter-on-new-files
- **default_pattern:** Create new .md files without CSPS frontmatter (id / lifecycle / tags / links)
- **csps_aligned_pattern:** Universal-required core frontmatter on every new artifact per [ADR-0023](../../../adr/0023-hybrid-frontmatter-schema-universal-core-plus-per-file-type.md)
- **disposition:** override
- **reason:** Frontmatter is the schema-as-source-of-truth surface; missing it = drift
- **caught_by_validator:** frontmatter_validate (LIVE)
- **status:** active

### output-act-on-first-expression
- **id:** OD-007
- **default_pattern:** Given a human request, generate a response addressing what was said. Move toward action quickly. Treat first expression as sufficient to act on.
- **csps_aligned_pattern:** For non-trivial requests (new initiative, plan creation, architectural decision): probe Layer 2-3 before acting on Layer 1. Apply the Reflect-Until-Match protocol. Ask the three crystallization questions (plan-creation-protocol Step 0a). Document goal_statement and done_criteria before any plan or implementation begins. The human's correction is the crystallization — not their approval of an AI-drafted goal.
- **disposition:** override
- **trigger:** new topic | new initiative | plan creation | non-trivial request
- **exemptions:** production emergency / continuation of established goal (goal_statement confirmed in active plan) / bug fix in known scope / Governor provides all three elements explicitly
- **anti_pattern:** Generating a goal_statement and asking "does this capture it?" then treating "yes" as crystallization. This is the satisfaction-point anti-pattern dressed as a protocol.
- **opus_pattern:** The mirror, not the guesser. AI reflects → human corrects → AI updates → repeat until human says "yes, exactly that." The correction reveals Layer 2-3.
- **reason:** P-META-022 (Human Intent Crystallization) — Layer 1 expression ≠ Layer 3 need. Acting on first expression generates compounding drift that cannot be fixed at the implementation layer.
- **caught_by_validator:** intent-crystallization-coverage (validate-intent-crystallized.mjs — LIVE)
- **reference:** [human-intent-crystallization.md §3-§4](../../../pillar-0-governance/human-intent-crystallization.md)
- **session_added:** S023
- **status:** active

### output-context-declaration-before-proposal
- **id:** OD-008
- **default_pattern:** Generate a proposal or implementation step directly from the request. Training optimizes for speed to answer. No context declaration before proposing — the context is implicit in the AI training, not surfaced. The S028 cascade: proposed S2 credentials for S1 requirement → proposed S2 Root Directory for S1 deployment → proposed S2 app folder for S1 procedure. Each failure had the same root: context not declared before proposing.
- **csps_aligned_pattern:** Before ANY substantive proposal: declare the governing context explicitly in the response. Format: "Governing context: [principle] at [scope_level]. Operating assumption: [what I assume]. Uncertainty: [what I don't know that could change this proposal]." If any of these cannot be stated clearly → ask before proposing. The context declaration replaces the guessing that generates scope violations.
- **disposition:** override
- **trigger:** architectural proposal | deployment configuration | credential setup | procedure authoring | scope-sensitive decisions
- **exemptions:** trivial-reversible operations | continuation of established plan with declared context
- **self_assessment_question:** "Before proposing: Do I have the context to make this proposal responsibly? What scope is the requirement? What scope is my proposal? Are they consistent? What am I assuming that, if wrong, changes the proposal significantly?"
- **opus_pattern:** Opus never proposes without surfacing context. The proposal comes AFTER: "Governing context: B_ZERO_LAPTOP_DEPENDENCY (S0). Scope: S1 platform deployment. Assumption: repo root is the Vercel Root Directory. If wrong: app subdirectory would be S2 scope — requires separate session." The declaration makes violations visible before they happen.
- **reason:** S028 cascade of scope violations — each was a proposal without context declaration. Opus Turn 21 SROF-010: OD-008 is the "80% step" for context architecture — immediately active, no infrastructure needed. P-META-020: context is the compass; compass must be declared before navigation.
- **caught_by_validator:** reasoning-scope-level-awareness (LIVE S028) + validate-scope-conflict.mjs (LIVE S028)
- **session_added:** S028
- **status:** active
