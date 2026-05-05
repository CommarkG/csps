---
name: audit-self
description: Run the meta-audit (audit-the-audits) on demand. Reports under-enforced principles + dangling enforcer references + audit-coverage gaps. Per P-META-001 (defense-in-depth — every principle has multiple independent enforcers; critical principles need ≥2 non-AI enforcers). Triggers on "audit health", "are we covered?", "any orphans?", before major refactors or releases.
allowed_tools: [Read, Grep, Glob]
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: [read]
sensitive_data_access: false
backed_by_principle: P-META-001
generated_by: principles-codegen
generated_from: packages/principles/principles.yaml#P-META-001
last_generated_at: 2026-05-03T08:30:00Z
references_future_artifact: true
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
# ─── AAP frontmatter (S005 turn 26 retrofit per P-META-010 + B_AGENT_ALIGNMENT_PROTOCOL) ───
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_RZF                         # this skill runs the audit cycle
  - B_CEC                         # walks platform for completeness
  - B_CATCH_TO_ENGRAVING         # surfaces gaps for engraving
  - B_FIVE_SURFACE_ENGRAVING      # verifies 5-surface coverage on B_* contracts
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: structured-audit-report
  max_tokens: 1500
  no_synthesis_outside_main: true
  no_ratification_claims: true
trust_tier: platform-owned
eval_baseline:
  test_corpus_path: tests/skills/audit-self/test-fixtures.json
  expected_pass_rate: 0.95
preflight_check_required: true
principle_compliance:
  - P-META-010    # AAP — operates under agent-alignment-protocol
  - P-META-002    # principles-travel-with-artifacts
consolidation_cross_refs: []    # empty = genuinely-novel skill per B_CONSOLIDATION_PASS

---

# /audit-self — The audit-the-audits meta-check

## When to invoke

- Before merging principles.yaml changes
- Before major refactors
- At session-close as a sanity check
- When "are we still covered?" question arises
- Quarterly health check (per stewardship cadence)

## When to skip

- Inside an approved batch (don't audit mid-batch)
- After a single trivial fix (overhead exceeds value)

## Procedure

1. **Read principles.yaml** — get all principle IDs + their declared severity
2. **For each principle, count enforcers:**
   - Cited in `pillar-N/*.md` Enforcement sections
   - Defined in `audit-runner.md` (audit checks)
   - Referenced by `// @enforces:` annotations in source code (post-runtime)
   - Hooks in `.claude/hooks/`
   - Hard NOs in `AGENTS.md`
3. **Apply per-severity minimums (P-META-001):**
   - critical → ≥4 enforcers, ≥2 non-AI
   - error → ≥3 enforcers, ≥1 non-AI
   - warn → ≥2 enforcers
   - info → ≥1 enforcer
4. **Report under-enforced + dangling refs**

## Output format

```markdown
## Audit-self report

**Principles checked:** <count>
**Critical:** <count> — all should have ≥4 enforcers
**Error:** <count> — all should have ≥3 enforcers
**Warn:** <count> — all should have ≥2 enforcers
**Info:** <count> — all should have ≥1 enforcer

### Under-enforced (action required)
| ID | Severity | Enforcers found | Required | Gap |
|---|---|---|---|---|
| <id> | critical | 2 | 4 | -2 |

### Dangling references (cited but undefined)
| Reference | Cited in | Action |
|---|---|---|
| `audit-runner.md#<slug>` | pillar-N/leaf.md | Add definition to audit-runner.md OR remove ref |
| `principles.yaml#<id>` | pillar-N/leaf.md | Add row to yaml OR fix citation |

### Surplus enforcement (informational)
| ID | Severity | Enforcers found | Required | Surplus |
|---|---|---|---|---|
| <id> | warn | 7 | 2 | +5 |
(Surplus is OK — defense-in-depth — but flagged for awareness)

### AI-only enforcers (warn for critical principles)
Critical principles must have ≥2 NON-AI enforcers. AI-only enforcement is fragile per P-META-001.
| ID | Severity | AI enforcers | Non-AI enforcers | Status |
|---|---|---|---|---|
| <id> | critical | 3 | 1 | ⚠️ AI-heavy |
```

## Discipline rules

1. **Audit-self is itself audited** — `audit-of-audits` cadence-check ensures this skill runs per its declared cadence
2. **AI-only enforcement is a code smell on critical principles** — flag prominently
3. **Surplus enforcement is OK** — don't trim defense-in-depth even if it exceeds minimum
4. **Dangling references are higher-priority than under-enforcement** — dangling = broken; under-enforced = degraded

## Industry lineage

- Tooling-the-tools (Spotify Soundcheck pattern — the audit system audits itself)
- Software Bill of Materials (SBOM) verification patterns
- Backstage Tech Insights meta-checks

## Backed by

P-META-001 (Defense in depth — every principle has multiple independent enforcers). Full text in [packages/principles/principles.yaml#P-META-001](../../principles/principles.yaml).
