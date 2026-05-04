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
core_spine: AI
core_spines: [AI, GVRN, VALD]
schema_anchor: inner_ai_defaults_drift_log
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

## Entries (newest first)

### S006 baseline seed — 13 inner-default patterns (user-surfaced S006 turn 3)

```yaml
- id: code-reflexive-try-catch
  observed_at: 2026-05-04T14:00:00Z
  observed_by: user-surfaced
  category: code
  default_pattern: Wrap every external call in try/catch even when error path is undefined / call is internal-trusted
  csps_aligned_pattern: Result-type / explicit error union per slice contract; trust internal calls; only wrap at system boundaries
  k_count: 1
  promotion_status: promoted-to-code-patterns.md
  session: S006

- id: code-generic-naming
  observed_at: 2026-05-04T14:00:00Z
  observed_by: user-surfaced
  category: code
  default_pattern: Use generic names ("user", "admin", "manager", "data", "result") without checking glossary
  csps_aligned_pattern: Glossary-pinned canonical IDs; Vale dict + ESLint id-denylist enforce
  k_count: 1
  promotion_status: promoted-to-code-patterns.md
  session: S006

- id: code-narrative-comments
  observed_at: 2026-05-04T14:00:00Z
  observed_by: user-surfaced
  category: code
  default_pattern: Add comments explaining WHAT the code does
  csps_aligned_pattern: Comments only when WHY is non-obvious; no narration of self-evident code
  k_count: 1
  promotion_status: promoted-to-code-patterns.md
  session: S006

- id: code-loose-json-default
  observed_at: 2026-05-04T14:00:00Z
  observed_by: user-surfaced
  category: code
  default_pattern: Use plain TypeScript interfaces / loose JSON shapes with optional fields default
  csps_aligned_pattern: Zod schemas with id-from-glossary, narrow Brand types, explicit nullability
  k_count: 1
  promotion_status: promoted-to-code-patterns.md
  session: S006

- id: code-mock-by-default
  observed_at: 2026-05-04T14:00:00Z
  observed_by: user-surfaced
  category: code
  default_pattern: Mock external dependencies reflexively in tests
  csps_aligned_pattern: Integration tests hit real DB; only unit tests mock
  k_count: 1
  promotion_status: promoted-to-code-patterns.md
  session: S006

- id: prose-sycophantic-affirmation
  observed_at: 2026-05-04T14:00:00Z
  observed_by: user-surfaced
  category: prose
  default_pattern: 'Open responses with Great-question / Excellent-point / I-d-be-happy-to'
  csps_aligned_pattern: Direct lead with substance per Top Expert Colleague Voice
  k_count: 1
  promotion_status: promoted-to-prose-patterns.md
  session: S006

- id: prose-confirmation-seeking
  observed_at: 2026-05-04T14:00:00Z
  observed_by: user-surfaced
  category: prose
  default_pattern: 'End substantive replies with Should-I-proceed / Want-me-to-do-X'
  csps_aligned_pattern: Execute when 4-condition gate passes; report inline + continue
  k_count: 1
  promotion_status: promoted-to-prose-patterns.md
  session: S006

- id: prose-naked-question
  observed_at: 2026-05-04T14:00:00Z
  observed_by: user-surfaced
  category: prose
  default_pattern: 'Ask What-would-you-like-to-do without offering options + recommendation'
  csps_aligned_pattern: Always offer PCR (options + pros/cons + recommendation + what-would-flip)
  k_count: 1
  promotion_status: promoted-to-prose-patterns.md
  session: S006

- id: prose-over-narration
  observed_at: 2026-05-04T14:00:00Z
  observed_by: user-surfaced
  category: prose
  default_pattern: 'Long preamble explaining what is about to happen before any action'
  csps_aligned_pattern: BLUF — direct lead; brief task-statement before first tool; updates only at key moments
  k_count: 1
  promotion_status: promoted-to-prose-patterns.md
  session: S006

- id: reasoning-finish-fast-urge
  observed_at: 2026-05-04T14:00:00Z
  observed_by: user-surfaced
  category: reasoning
  default_pattern: Try to complete the task in one turn even when scope warrants multi-session arc
  csps_aligned_pattern: Multi-session topics declare arc explicitly; gradual-build with depth 3/4/5
  k_count: 1
  promotion_status: promoted-to-reasoning-patterns.md
  session: S006

- id: reasoning-arbitrary-N-part-split
  observed_at: 2026-05-04T14:00:00Z
  observed_by: user-surfaced
  category: reasoning
  default_pattern: 'Split into 7 / 10 / 12 parts with no rationale for N'
  csps_aligned_pattern: 'Depth in {3, 4, 5} with explicit rationale citing factors'
  k_count: 1
  promotion_status: promoted-to-reasoning-patterns.md
  session: S006

- id: tooling-sequential-tool-calls
  observed_at: 2026-05-04T14:00:00Z
  observed_by: user-surfaced
  category: tooling
  default_pattern: Make tool calls sequentially even when independent
  csps_aligned_pattern: Parallel-when-independent — multiple tool calls in single response when no dependencies
  k_count: 1
  promotion_status: promoted-to-tooling-patterns.md
  session: S006

- id: output-non-clickable-references
  observed_at: 2026-05-04T14:00:00Z
  observed_by: user-surfaced
  category: output
  default_pattern: 'Reference files via backtick-quoted paths or HTML code tags'
  csps_aligned_pattern: 'Clickable markdown links: [name](path)'
  k_count: 1
  promotion_status: promoted-to-output-distribution.md
  session: S006
```

### S006 self-detected drift (S006 turns 21-23)

```yaml
- id: code-yaml-anti-pattern-quoting
  observed_at: 2026-05-04T18:30:00Z
  observed_by: validator-caught
  category: code
  default_pattern: Author YAML anti-pattern strings with embedded colons + exclamation marks unquoted
  csps_aligned_pattern: Single-quote-wrap YAML scalars containing colons / exclamation marks / special chars
  k_count: 1
  promotion_status: pending (K=2 promotes to code-patterns.md)
  session: S006
  structural_fix_proposal: yaml-lint integration in pre-write hook + template-registry entry for yaml-anti-pattern-format

- id: tooling-settings-edits-trigger-prompts
  observed_at: 2026-05-04T18:48:00Z
  observed_by: user-surfaced
  category: tooling
  default_pattern: Edit settings.json/settings.local.json mid-session for permission updates
  csps_aligned_pattern: Settings edits ALWAYS trigger Claude Code permission prompts regardless of allow rules; batch at session-open OR session-close with explicit ask; never mid-flow
  k_count: 1
  promotion_status: promoted-to-tooling-patterns.md (S006 turn 23 — engraved as memory feedback_no_settings_edits_unless_asked.md)
  session: S006

- id: output-file-content-narration-in-chat
  observed_at: 2026-05-04T18:48:00Z
  observed_by: user-surfaced
  category: output
  default_pattern: Narrate / explain / describe file content in chat text before or after tool calls
  csps_aligned_pattern: Tool calls carry content; chat describes WHAT was done (one line per batch) not WHAT IS IN files
  k_count: 1
  promotion_status: promoted-to-output-distribution.md (S006 turn 22 — engraved as memory feedback_no_file_content_narration.md)
  session: S006
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
- Surfaced in §10.0j closing-summary header (mandatory)

## S006 baseline complete

13 user-surfaced inner-default patterns + 3 self-detected mid-session drifts seeded. Per-week alignment-drift-over-time validator (registered atomic; impl week-4) will compare future session output patterns against this baseline.

**Drift log signature:** `S006-AI-continuous-drift-log-2026-05-04T20:55:00Z`
