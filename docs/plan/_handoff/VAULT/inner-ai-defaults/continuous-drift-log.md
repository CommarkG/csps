---
id: csps.handoff.vault.inner-ai-defaults.continuous-drift-log
name: inner-ai-defaults-continuous-drift-log
description: Append-only log of new inner-AI-default patterns discovered in-session. Per P-META-017 + P-META-019 (Structural-Prevention-Discipline). Promoted to category files after K=2 occurrences. Captures both AI-self-discovery AND user-surfaced patterns. Continuous validation of evolving AI behavior across model upgrades.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: registry-canonical-append-only
template_status: novel-pending-pattern-evaluation
core_spines: [AI, GVRN, VALD]
tags:
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
session: S006
append_only: true
---

# Inner-AI-Defaults — Continuous Drift Log

> **Append-only.** Newest entries at top. Promoted to category file (code/prose/reasoning/tooling/output) after K=2 occurrences across sessions.

## Format per entry

```yaml
- id: <category>-<slug>
  observed_at: <ISO-8601-UTC>
  observed_by: ai-self-detection | user-surfaced | validator-caught
  category: code | prose | reasoning | tooling | output
  default_pattern: <brief description>
  csps_aligned_pattern: <brief description>
  k_count: 1 | 2 | 3+
  promotion_status: pending | promoted-to-<file> | superseded
  session: S<NNN>
```

## Entries

(Newest first)

```yaml
# S006 turn 8 — log seeded with K=1 baseline from S006 turn 3 user-surfaced inner-default table
# Promoted entries already moved to category files; baseline-pending entries listed below

# Future entries appended here

# (Append below this line; do NOT amend existing entries)
```

## Promotion discipline

When an entry reaches K=2:
1. Move to appropriate category file (code/prose/reasoning/tooling/output)
2. Update K=2 entry with `promotion_status: promoted-to-<file>` (keep here for provenance)
3. Author full per-entry schema in category file
4. Atomic validator slug registration in audit-runner.md per FSE amendment
5. Surface in next closing-summary §10.0g (inner-default leak report)

## Composition with B_STRUCTURAL_PREVENTION_DISCIPLINE (P-META-019)

When an entry is observed via `validator-caught` BUT the validator was tagged as covering this pattern:
- Mandatory **enhancement proposal** authored — the validator missed something it claimed to catch
- Logged in [enhancement-registry.md](../enhancement-registry.md) (created when first proposal lands)
- Surfaced in §10.0i closing-summary header (mandatory)

This is the meta-meta layer: the log itself triggers structural enhancement when validators fail to catch what they should.
