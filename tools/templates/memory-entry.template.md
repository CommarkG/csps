---
id: csps.tools.templates.memory-entry
name: memory-entry-template
description: Canonical template for new memory file entries in `~/.claude/projects/c--Users-finky-Desktop-Claude-Code-Csps/memory/feedback_<slug>.md` files per CSPS auto-memory architecture. Every entry follows 3-block structure (rule + Why + How to apply) per CSPS DNA (S005 close memory). Frontmatter required (name + description + type). MEMORY.md index entry MANDATORY same-commit per FSE memory-surface discipline.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: meta-template
template_status: standard
template_grade: B  # Opus Turn 15 S026
core_spine: AI
schema_anchor: tools_templates_meta
template_id: memory-entry
template_version: 1.0
applicability_trigger: |
  New behavioral pattern surfaced (corrections in chat / gap audit / research
  finding / principle addition / user directive ratified) requiring cognitive
  layer engraving per FSE. Existing memory entries amended via inline edit
  (not via this template).
validators_atomic:
  - memory-entry-frontmatter-required
  - memory-entry-3-block-structure
  - memory-index-completeness
escape_hatch: |
  Continuous-drift-log entries follow append-only single-line format (NOT this
  template) until K=2 promotion to category file at which point full template
  applies.
tags:
  - domain:ai
  - domain:governance
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
diataxis_type: reference
session: S006
links:
  - { rel: parent, href: ./ }
  - { rel: memory-index, href: "C:\\Users\\finky\\.claude\\projects\\c--Users-finky-Desktop-Claude-Code-Csps\\memory\\MEMORY.md" }
  - { rel: discipline, href: ../../docs/plan/pillar-0-governance/five-surface-engraving.md }
scope_level: S1
---

# Memory Entry Template

> Use this template when authoring new memory files at `~/.claude/projects/c--Users-finky-Desktop-Claude-Code-Csps/memory/feedback_<slug>.md`. Every entry has 3-block structure following CSPS DNA pattern. MEMORY.md index entry mandatory same-commit per FSE memory-surface discipline.

## Required structure

```markdown
---
name: <Brief title (5-10 words; sentence case)>
description: <One-line summary (≤200 chars) — what the memory captures + when AI should consult>
type: <feedback | user | project | reference>
---

<Block 1 — Rule statement: 1-3 sentences. Lead with the rule itself.
Use precise language — every word load-bearing. State the discipline as
"AI <does X>" or "AI <doesn't do Y>" or "When <trigger>, AI <action>".>

**Why:** <2-4 sentences. Cite origin (S<NNN> turn <N> verbatim user directive
OR CSP precedent OR specific incident). State the load-bearing reason
("past incident where X failed" / "user directive ratified S<NNN>" /
"compounding-returns moat" / "AI training default conflicts with CSPS DNA").>

**How to apply:** <2-5 sentences. Concrete actionable guidance —
when does this fire / what does AI do / what evidence is required.
Cite cross-references to principles + contracts + audit slugs.>

<Optional closing line: principle/contract pointer + session origin>
P-XXX-NNN + B_<NAME> engraved S<NNN> turn <N> per <user directive verbatim
phrase> OR per <CSP carry-forward source>.
```

## Required mandatory components

### 1. Frontmatter
**Required fields:**
- `name:` — 5-10 word title; sentence case (e.g., "Validate before assume")
- `description:` — ≤200 chars; one-line summary capturing essence + when-to-consult
- `type:` — closed enum {feedback / user / project / reference}

**Forbidden fields in memory frontmatter (CSPS auto-memory architecture):**
- No `id:` (memory files use filename as ID)
- No `version:` (memory is mutable; no versioning)
- No `lifecycle_state:` (memory always-active until removed)
- No `core_spine:` / `schema_anchor:` (memory is meta-governance, not governed artifact)

### 2. Block 1 — Rule statement
- 1-3 sentences
- LEAD with the rule itself (BLUF)
- Mechanical language preferred ("MUST" / "forbidden" / "always")
- No introduction / preamble / "let me explain..."

### 3. Block 2 — Why (load-bearing reason)
- 2-4 sentences
- Cite ORIGIN precisely:
  - User directive: `S<NNN> turn <N> verbatim — "<exact quote>"`
  - CSP carry-forward: `per CSP <session/leaf reference>`
  - Specific incident: `past incident where <X failed>`
- State the FAILURE MODE this memory prevents
- State the COMPOUNDING-RETURNS angle if applicable

### 4. Block 3 — How to apply
- 2-5 sentences
- Concrete actionable guidance — what AI does WHEN this triggers
- Cite cross-references: principles (P-XXX-NNN) + contracts (B_<NAME>) + validator slugs
- Mention the counterweight if rule has one (avoid over-broad application)
- End with one-line origin pointer + session

### 5. MEMORY.md index entry MANDATORY same-commit

Per FSE memory-surface discipline + `memory-index-completeness` validator:

```markdown
- [<Brief title>](feedback_<slug>.md) — <one-line summary; ≤300 chars; captures essence + cite principle/contract/turn-N>
```

**Validator** `memory-index-completeness` (per-session warn) flags any feedback_*.md file in memory dir without paired MEMORY.md row.

## Authoring sequence

1. Identify the rule (corrected behavior / discovered pattern / ratified directive)
2. Author memory file using this template structure at `~/.claude/projects/c--Users-finky-Desktop-Claude-Code-Csps/memory/feedback_<slug>.md`
3. Add MEMORY.md index row in same commit
4. If memory entry corresponds to a P-XXX-NNN principle: principle's enforcer should reference this memory file path in `principles.yaml`
5. If memory entry has a paired AGENTS.md hard NO: cross-reference visible in NO body

## File path convention

```
~/.claude/projects/c--Users-finky-Desktop-Claude-Code-Csps/memory/feedback_<slug>.md
```

`<slug>` is kebab-case + matches the rule's primary noun phrase. Examples:
- `feedback_validate_before_assume.md` (validation rule)
- `feedback_pcr_for_decisions.md` (decision-frame rule)
- `feedback_pe_alignment_guardian.md` (anti-sycophancy rule)

The `feedback_` prefix is convention; not enforced by validator (any `*.md` in memory dir loads).

## Composition

Composes with P-META-007 (FSE — memory is the cognitive surface) + B_CATCH_TO_ENGRAVING (S002 turn 15 — every catch produces persistent artifact) + P-META-005 (Learning Loop — memory entries are LearningLoopItem instances at "validated" state) + B_TEMPLATE_FIRST_CREATION (P-META-015 — this IS the template).

## Validators (atomic per FSE; impl week-4)

- `memory-entry-frontmatter-required` — name + description + type fields present
- `memory-entry-3-block-structure` — Rule + Why + How-to-apply blocks present
- `memory-index-completeness` — every feedback_*.md has paired MEMORY.md row

**Template signature:** S006-AI-memory-entry-template-2026-05-04T19:40:00Z
