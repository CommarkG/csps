---
name: engraving-discipline
description: When engraving a new B_* contract OR new principle (P-META / P-ARCH / P-OPER) OR a discipline at 5/5 atomic surfaces per FSE — load the 5-Surface Engraving Cycle (Detect → Classify → Design-delta → Apply-atomically → Verify-completeness → Emit-evidence-block → Propagate) + atomic validator-surface registration discipline + b-star-contract template structure. Triggers on "engrave", "5-surface", "5/5 atomic", "FSE", "new B_", "new principle", "ratify discipline", "atomic registration".
allowed_tools: [Read, Write, Edit, Bash, Grep, Glob]
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: []
sensitive_data_access: false
backed_by_principle: P-META-007
backed_by_contract: B_FIVE_SURFACE_ENGRAVING
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_FIVE_SURFACE_ENGRAVING
  - B_TEMPLATE_FIRST_CREATION
  - B_CATCH_TO_ENGRAVING
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: structured-engraving-checklist-or-5-surface-spec
  max_tokens: 2500
  no_synthesis_outside_main: true
  no_ratification_claims: true
trust_tier: platform-owned
preflight_check_required: true
principle_compliance:
  - P-META-010    # AAP — operates under agent-alignment-protocol
  - P-META-002    # principles-travel-with-artifacts
consolidation_cross_refs: []    # empty = genuinely-novel skill per B_CONSOLIDATION_PASS

template_grade: B
links:
  - { rel: p-meta-022, href: ../../../../docs/plan/pillar-0-governance/human-intent-crystallization.md }
scope_level: S1
---

# /engraving-discipline — 5-Surface Engraving Reference

## When to invoke

- Authoring a new B_* contract or amending an existing one
- Engraving a new principle (P-META / P-ARCH / P-OPER) at 5/5 atomic
- Catch-to-engraving cycle fired (per B_CATCH_TO_ENGRAVING)
- K=2 promotion of structural prevention pattern

## When to skip (counterweight)

Trivial composition-only catches (new application of existing discipline) short-circuit to spine-matrix-row + ledger-entry per b-star-contract template escape hatch — no new B_* needed.

## The 7-stage cycle (per P-META-007)

1. **Detect** — observed gap / trap / anti-pattern / failure-mode
2. **Classify** — class-level (new discipline) vs. composition-only (existing applied to new surface)
3. **Design-delta** — per-surface plan (schema / validator / hook / memory / contract)
4. **Apply-atomically** — all 5 surfaces in same response/commit
5. **Verify-completeness** — meta-RZF on the engraving itself
6. **Emit-evidence-block** — closing-summary §10.13c FSE evidence
7. **Propagate** — cross-references bidirectional + spine-matrix-row + dashboard-leaf

## The 5 surfaces (mandatory atomic)

| # | Surface | Pattern |
|---|---|---|
| 1 | **Schema** | principles.yaml row OR config subsection / closed-enum amendment / frontmatter field |
| 2 | **Validator** | audit-runner.md row REGISTRATION mandatory atomic same-commit (per S005 turn 18 amendment); IMPLEMENTATION may defer to week-4 with `(impl week-4)` marker |
| 3 | **Hook** | `.Codex/hooks/<name>.sh` script path; week-4 ship typical; stub OK at engraving |
| 4 | **Memory** | `~/.Codex/.../memory/feedback_<slug>.md` + MEMORY.md index entry |
| 5 | **Contract** | behavioral-contracts.md § B_<NAME> + AGENTS.md hard NO + ai-behavior-spine.md row + principles.yaml#P-<XXX> |

## Atomic validator-surface registration (S005 turn 18 amendment)

**MANDATORY:** when designing surface 2 (validator), the slug MUST be registered in `audit-runner.md` in the same response/commit — even if implementation defers to week-4. Without atomic registration, every engraving structurally produces a dangling reference. Across N sessions, that's monotonically-growing audit-registry debt requiring its own bulk-fix sessions.

## b-star-contract template structure (6 blocks)

Per [tools/templates/b-star-contract.template.md](../../../tools/templates/b-star-contract.template.md):

```markdown
## B_<NAME> — <one-line> (<S<NNN> turn <N> OR CSP carry-forward>)

**Canonical:** <2-4 sentences; primary action; precise language>
**Counterweight:** <1-3 sentences; boundary case>
**Source:** <user directive verbatim OR CSP precedent path>
**Anti-patterns:** <3-5 entries; kebab-case-pattern (parenthetical)>
**Mechanical surfaces (5/5 declared <S<NNN> L<N>>):**
- schema / validator (atomic) / hook / memory / contract
**Cross-references:** <minimum 3; ideal 5; bidirectional>
```

## Below 2 surfaces = anti-pattern

CSP S333 evidence: single-surface engravings demonstrably fail. Target: 5/5. Composition-only catches short-circuit to spine-matrix-row + ledger-entry.

## Examples — recent engravings (S006-S007)

8 disciplines engraved 5/5 atomic in S006 (P-META-015/016/017/018/019 + P-ARCH-028 + P-ARCH-029 + P-OPER-001). B_TOKEN_BUDGET engraved S007 turn 4 (extends P-META-009; no new principle). K=2 closed-enum drift engraved S007 turn 5 (composition-only via B_STRUCTURAL_PREVENTION amendment).

## Backed by

P-META-007 Five-Surface Engraving + B_FIVE_SURFACE_ENGRAVING (S002 turn 17 user directive: "formalize the 5 surfaces to be included and used in all relevant places"). Full canonical: [five-surface-engraving.md](../../../docs/plan/pillar-0-governance/five-surface-engraving.md).
