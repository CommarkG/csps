---
id: csps.tools.templates.b-star-contract
name: b-star-contract-template
description: Canonical template for new B_* behavioral contract sections in behavioral-contracts.md per B_FIVE_SURFACE_ENGRAVING (P-META-007) + atomic validator-surface registration amendment (S005 turn 18). Every new contract section follows the same 6-block structure (Canonical / Counterweight / Source / Anti-patterns / Mechanical surfaces / Cross-references) with required cross-spine + cross-principle references. Validator atomically registered same-commit per FSE amendment.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: meta-template
template_status: standard
template_grade: B  # Opus Turn 15 S026
core_spine: GVRN
schema_anchor: tools_templates_meta
template_id: b-star-contract
template_version: 1.0
applicability_trigger: |
  New behavioral contract identified — gap surfaced via catch-to-engraving
  (B_CATCH_TO_ENGRAVING) or user directive ratifying a discipline. Existing
  contracts amended via inline edit (not via this template).
validators_atomic:
  - b-star-contract-format
  - b-star-contract-cross-references-bidirectional
  - b-star-contract-mechanical-surfaces-5-of-5
escape_hatch: |
  Trivial composition-only catches (new application of existing discipline)
  short-circuit to spine-matrix-row + ledger-entry per spine documentation —
  no new B_* section needed.
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S006
links:
  - { rel: parent, href: ./ }
  - { rel: target, href: ../../docs/plan/pillar-0-governance/behavioral-contracts.md }
  - { rel: discipline, href: ../../docs/plan/pillar-0-governance/five-surface-engraving.md }
scope_level: S1
---

# B_* Contract Template

> Use this template when adding a new B_* section to [behavioral-contracts.md](../../docs/plan/pillar-0-governance/behavioral-contracts.md). Every section follows the same 6-block structure. Atomic validator-surface registration mandatory same-commit per FSE amendment.

## Required structure

```markdown
## B_<NAME> — <one-line description> (<origin: S<NNN> turn <N> OR CSP carry-forward>)

**Canonical:** <The rule itself; what AI must do. 2-4 sentences. Lead with the
primary action; conditions follow. Use precise language — every word load-bearing.>

**Counterweight:** <When this discipline does NOT apply. The boundary case that
prevents the rule from becoming over-broad. Trivial-reversibles / single-instance
exceptions / scope limits.>

**Source:** <S<NNN> turn <N> user directive verbatim — quoted phrase OR
"per CSP <reference>" for carry-forwards. Always cite origin precisely.>

**Anti-patterns:**
- <antipattern-1> (<explanation phrase>)
- <antipattern-2> (<explanation phrase>)
- <antipattern-3> (<explanation phrase>)
- <antipattern-4 — optional>

**Mechanical surfaces (5/5 declared <S<NNN> L<N>>):**
- schema: <path or pattern> <description>
- validator (atomic registration): `<slug-1>` + `<slug-2>` + ... (impl <week-N>)
- hook: `.claude/hooks/<hook-script>.sh` (<week-N> OR active)
- memory: <C:\path\to\feedback_<slug>.md>
- contract: this entry + AGENTS.md hard NO + spine matrix row + `principles.yaml#<P-XXX-NNN>`

**Cross-references:** <P-XXX-NNN> / <P-OTHER> (<composition rationale>) /
<P-OTHER> (<composition rationale>) / <up to 5 cross-refs minimum 3>.

**conceptual_sample_of:** <L2 domain this contract samples — e.g. "GVRN L2 decision rights" or "AI L2 inner-defaults domain". Per P-META-020: contracts are reference samples of conceptual alignment. When this contract fires, it is confirming whether behavior honors this specific concept.>

**governing_intent:** <The Layer 3 intent this contract exists to serve. NOT "this prevents X" but "this ensures Y remains true, which matters because Z." One sentence. An AI reading this contract should understand WHY the rule exists, not just WHAT the rule says. Per P-META-025 (C&I): rules are Layer 1 proxies; this field is the Layer 3 explanation.>
```

## Required mandatory components

### 1. Canonical block
- 2-4 sentences
- Lead with primary action
- Use mechanical language (`MUST` / `forbidden` / `required`)
- Avoid hedging ("usually" / "may" / "should consider")
- Reference `template_used:` field for templated artifacts

### 2. Counterweight block
- 1-3 sentences
- Names the trivial-reversibles OR single-instance exceptions
- States the boundary precisely (so the rule isn't over-broad)
- Critical: without counterweight, rule becomes unenforceable due to absurd-edge-case rejection

### 3. Source block
- Cite the user directive verbatim where possible
- For CSP carry-forwards: cite the CSP precedent file path
- For S006-onwards: cite S<NNN> turn <N> + verbatim quoted phrase
- Provenance is load-bearing (per B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK)

### 4. Anti-patterns block
- 3-5 entries minimum
- Each entry: `kebab-case-pattern (parenthetical explanation)`
- Patterns are NEGATIVE examples — what the rule prevents
- Validators target these patterns directly

### 5. Mechanical surfaces block (5/5 declared per FSE)
Required surfaces (ALL 5):
- **schema** — frontmatter / ZModel / closed-enum / structured config
- **validator** — REGISTRATION mandatory atomic per FSE amendment (S005 turn 18); IMPLEMENTATION may defer to week-4 with "(impl week-4)" marker
- **hook** — `.claude/hooks/*.sh` script path; week-4 ship typical
- **memory** — `~/.claude/.../memory/feedback_<slug>.md` path
- **contract** — this entry + AGENTS.md hard NO + spine matrix row + principle

### 6. Cross-references block
- Minimum 3 cross-references; ideal 5
- Each cross-ref names the principle/contract + parenthetical composition rationale
- Bidirectional graph: every cross-ref principle/contract should reciprocally cross-reference back (validator: `b-star-contract-cross-references-bidirectional`)

## Atomic validator registration discipline (per FSE amendment)

When step 5 (Mechanical surfaces) declares a `validator (atomic registration): <slug>`:

1. SAME COMMIT must include row in [audit-runner.md](../../docs/plan/pillar-0-governance/audit-runner.md) with:
   - Slug
   - Cadence (PR / per-session / nightly / weekly / quarterly)
   - Severity (info / warn / error / critical)
   - 1-line description
   - Cross-reference back to `principles.yaml#<P-*>` or this contract

2. Implementation file `libs/audits/checks/<slug>.ts` MAY defer with explicit "(impl week-4)" or "(impl S<NNN>+)" marker — but only IMPLEMENTATION defers; REGISTRATION cannot defer.

3. The registration is the proof that the surface is "engraved"; the implementation is the operational enforcement.

## Authoring sequence (engraving cycle per FSE)

Per FSE amendment S005 turn 18 — Steps 3a-3f:

```
3a. Surface 1 — Schema:    add closed-enum / frontmatter / state-machine
3b. Surface 2 — Validator REGISTRATION (atomic; cannot defer)
3c. Surface 2' — Validator IMPLEMENTATION (deferral allowed; mark with note)
3d. Surface 3 — Hook:      .claude/hooks/*.sh (deferral allowed)
3e. Surface 4 — Memory:    feedback_<slug>.md + MEMORY.md index entry
3f. Surface 5 — Contract:  this section + AGENTS.md hard NO + spine matrix row
```

## Validators (atomic per FSE; impl week-4)

- `b-star-contract-format` — section structure has all 6 blocks (Canonical + Counterweight + Source + Anti-patterns + Mechanical surfaces + Cross-references)
- `b-star-contract-cross-references-bidirectional` — every cited cross-ref principle reciprocally cross-references back
- `b-star-contract-mechanical-surfaces-5-of-5` — every section declares all 5 surfaces (schema + validator + hook + memory + contract)

## Composition

Composes with B_FIVE_SURFACE_ENGRAVING (P-META-007) + B_CATCH_TO_ENGRAVING (S002 turn 15) + B_TEMPLATE_FIRST_CREATION (P-META-015 — this IS the template).

**Template signature:** S006-AI-b-star-contract-template-2026-05-04T19:35:00Z
