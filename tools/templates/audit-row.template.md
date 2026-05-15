---
id: csps.tools.templates.audit-row
name: audit-row-template
description: Canonical template for new audit registry rows in audit-runner.md per FSE atomic validator-surface registration amendment (S005 turn 18). Every new audit slug registered atomically same-commit as discipline engraving — registration mandatory; implementation deferrable. Standard 5-column row format with cross-reference back to backing principle/contract.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: meta-template
template_status: standard
template_grade: B  # Opus Turn 15 S026
core_spine: VALD
schema_anchor: tools_templates_meta
template_id: audit-row
template_version: 1.0
applicability_trigger: |
  New audit slug needs registration in audit-runner.md. Triggered by FSE
  atomic registration amendment (S005 turn 18) — every new validator-surface
  declared in a discipline's enforcers list MUST have paired audit-runner row
  in same commit. Existing audit rows amended via inline edit (not via this
  template).
validators_atomic:
  - audit-row-format
  - audit-row-backing-principle-cross-reference-required
  - audit-row-cadence-severity-closed-enum
escape_hatch: |
  Implementation may defer ("impl week-4" marker); registration cannot defer.
  The row IS the engraving evidence per FSE amendment.
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
  - { rel: target, href: ../../docs/plan/pillar-0-governance/audit-runner.md }
  - { rel: discipline, href: ../../docs/plan/pillar-0-governance/five-surface-engraving.md }
scope_level: S1
---

# Audit Row Template

> Use this template when registering a new audit slug in [audit-runner.md](../../docs/plan/pillar-0-governance/audit-runner.md). Per FSE atomic-registration amendment (S005 turn 18) — registration mandatory same-commit as discipline engraving; implementation may defer.

## Required structure

```markdown
| `<slug>` | <cadence> | <severity> | <description ≤200 chars + impl-status marker> | <backing-principle-OR-contract-cross-reference> |
```

## 5-column row format

### Column 1 — Slug (kebab-case)
- Lowercase + kebab-case
- Descriptive: catches what failure pattern
- Examples: `template-citation-on-creation` / `pe-alignment-guardian-coverage` / `git-pushed-state-clean`
- Forbidden: spaces / underscores / camelCase / SCREAMING-CASE

### Column 2 — Cadence (closed enum)
Closed enum:
- `PR` — runs on every pull request open/update
- `pre-commit` — runs at git commit boundary
- `per-session` — runs at session-close (closing-summary §10.0)
- `nightly` — cron 1×/day
- `weekly` — cron 1×/week
- `monthly` — cron 1×/month
- `quarterly` — cron 1×/quarter
- `real-time` — runs on event (PostToolUse hook / state change)
- `on-demand` — manual `pnpm audit:run --check=<slug>`

### Column 3 — Severity (closed enum)
Closed enum (maps to severity-routing table):
- `info` — log only; visible in dashboard but no alert
- `warn` — dashboard fact + scorecard impact + weekly digest
- `error` — Linear ticket + blocks PR if PR-cadence
- `critical` — pages on Slack/email + blocks PR + opens incident if real-time

### Column 4 — Description (≤200 chars + impl-status marker)
Format:
```
<verb-phrase describing what audit catches>; impl <week-N OR S<NNN>+>
```

Examples:
- `Every commitment-layer artifact has template_used: frontmatter field; impl week-4`
- `Multi-session topic mentioned in handoff/governor-prompts without paired plan file; impl week-4`
- `git log origin/main..HEAD empty before session-close; impl week-4`

Implementation-status markers (closed enum):
- `impl week-4` — ships when audit-runner ships per build-order.md
- `impl S<NNN>+` — specific session implementation
- `LIVE` — implementation already running
- `impl deferred` — explicit deferral with reason in description

### Column 5 — Backing principle OR contract (cross-reference)
Format options:
- Principle: `P-XXX-NNN` (e.g., `P-META-015`)
- Contract: `B_<NAME>` (e.g., `B_TEMPLATE_FIRST_CREATION`)
- Both: `B_<NAME> + P-XXX-NNN` (typical)
- Other reference: `<spec-doc-name>` (e.g., `tag-status-contract`)

Validator `audit-row-backing-principle-cross-reference-required` flags rows missing this column.

## Atomic registration discipline (per FSE amendment S005 turn 18)

**The load-bearing rule:** when a discipline's enforcers list (in `principles.yaml#<P>.enforcers` OR `behavioral-contracts.md#B_<NAME>` Mechanical surfaces block) declares a `ci-check` layer with slug `X`, the SAME COMMIT must register `X` in audit-runner.md.

**Atomicity targets the registration; not the implementation:**
- REGISTRATION (mandatory atomic) — row in audit-runner.md
- IMPLEMENTATION (deferral allowed) — `libs/audits/checks/<slug>.ts` + scanner logic + tests

**Why this matters:** without atomic registration, every B_* engraving structurally produces a dangling reference. CSPS S005 §C3.1 audit found 30 such dangling refs accumulated across S001-S005; bulk-fix consumed dedicated work. Atomic registration prevents accumulation.

## Authoring sequence

1. Discipline engraving authored (new B_* contract OR new P-XXX-NNN principle)
2. Discipline declares `ci-check` enforcer with slug `<X>`
3. SAME COMMIT: append audit-row to audit-runner.md "Behavioral Discipline Validators" section using this template
4. (Optional same-commit OR deferral) — author `libs/audits/checks/<slug>.ts` implementation file
5. Verify both files committed together; `discipline-engraving-completeness` validator (Pipeline 5) catches dangling refs

## Cross-pipeline placement

Audit-runner.md has multiple sections:
- `Behavioral Discipline Validators (consolidated S005 turn 21)` — default for new audits
- Category-specific sections — promote rows to semantic category as build-out evolves
- Pipeline-specific sections in audit-hub.md cross-reference these rows

For S006-onwards new audits, default placement is "Behavioral Discipline Validators" section unless category is obvious.

## Validators (atomic per FSE; impl week-4)

- `audit-row-format` — row has all 5 columns + closed-enum cadence + closed-enum severity
- `audit-row-backing-principle-cross-reference-required` — column 5 cites principle/contract/spec
- `audit-row-cadence-severity-closed-enum` — cadence + severity values in closed enum
- `audit-row-implementation-status-marker-present` — column 4 has impl-status marker

## Composition

Composes with P-META-007 FSE (validator surface IS atomic-registered audit row) + S005 turn 18 amendment (registration cannot defer; implementation may) + B_TEMPLATE_FIRST_CREATION (P-META-015 — this IS the template).

**Template signature:** S006-AI-audit-row-template-2026-05-04T19:45:00Z
