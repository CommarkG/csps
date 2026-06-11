---
id: csps.handoff.vault.closing-summary-template
name: closing-summary-template
description: Required-header closing-summary template per protocols.md v1.7 §10. Every chat-close emits a closing summary using THIS template — every section is mandatory; empty section = audit fail post-runtime + AGENTS.md hard NO violation pre-runtime. Closes the protocol-compression-is-skipping gap surfaced S002 turn 14 (5 of 14 §10 items skipped).
version: 1.0
template_grade: A  # Opus Turn 15 S026
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
diataxis_type: how-to
links:
  - { rel: parent, href: ./README.md }
  - { rel: protocols, href: ./protocols.md }
  - { rel: feedback, href: ../../../../.claude/projects/c--Users-finky-Desktop-Claude-Code-Csps/memory/feedback_protocol_compression_is_skipping.md }
domain_path: platform
scope_level: S1
---

# Closing Summary — required-header template

> **The handoff describes what SHOULD happen. The AI does what it REMEMBERS. The gap between them IS the failure mode.** — S002 turn 14 essence

## How to use this template

1. At session-open: AI runs TodoWrite, transcribing each section header below into a `pending` task referencing the protocol step.
2. During session: tasks become `completed` only with paired tool-call evidence.
3. At session-close: AI emits the closing summary using EVERY header below. Each section is mandatory. Empty section is forbidden. If item not applicable: state `NOT_APPLICABLE_WITH_REASON` explicitly.
4. Audit `closing-summary-checklist-completeness` (planned week 4) scans the emitted summary against this template + fails PR on missing or empty sections.

## The required headers

```markdown
## Closing summary — Session S<NNN>

### §10.0 Pre-close verification cycle results (P-META-008 — MANDATORY GATE)

> **NEXT-TO-REACH REMINDER (SP-001 + SP-004 — "Drive Don't Fight" Chunk 4):**
> Before filling this section, ask: "Am I REPORTING what I ran, or SHOWING what exists?"
> The correct format is: paste actual tool output, not "I've run pnpm verify and it passes."
> Teaching moment: "Am I reporting what I DID, or showing what EXISTS as a result?"

> **This section MUST come first. RZF/CEC/FSE evidence blocks elsewhere in the close summary
> are NOMINAL until validated by the cycles in this section. Empty section = AGENTS.md violation
> + closing summary INCOMPLETE.**

Run `pnpm zf:deep` (ZF Orchestrator Level 3 at `tools/zf-orchestrator.mjs`). Per P-META-021: EVERY ZF report MUST include iteration count — it is the measurement of work richness, not overhead. Paste cycle count + final status + tools/zf-session-tracker.json summary here:

```yaml
zf_orchestrator_evidence:
  ran_at: <iso8601-utc>
  level: 3 (DEEP — required at session close)
  total_verify_iterations_this_session: <from tools/zf-session-tracker.json verify_runs>
  orchestrator_cycles: <number of orchestrator cycles>
  final_status: ZF_ACHIEVED | ZF_ACHIEVED_WITH_ADVISORIES | BLOCKING_REMAINS
  blocking_count: 0  # must be 0 to close session
  advisory_count: <N>  # advisory items are tracked obligations
  WHY_ITERATION_COUNT_MANDATORY: |
    The iteration count proves real ZF vs nominal ZF. Zero iterations = the AI ran verify
    once and moved on. N iterations = the platform was checked from multiple directions
    until genuinely clean. Hiding the count = hiding the quality of the ZF work.
```

Also run `pnpm verify` standalone and paste below:

```yaml
pre_close_verification:
  ran_at: <iso8601-utc>
  orchestrator: tools/verify.mjs
  cycles:
    pnpm_install_frozen:
      command: pnpm install --frozen-lockfile
      status: PASS | FAIL | SKIP-with-reason
      duration_seconds: N
      packages_resolved: N
    typecheck_recursive:
      command: pnpm -r typecheck
      status: PASS | FAIL | SKIP-with-reason
      packages_checked: [@csps/principles, @csps/principles-mcp, ...]
      errors_per_package: { @csps/principles: 0, @csps/principles-mcp: 0 }
    principles_validate:
      command: pnpm --filter @csps/principles validate
      status: PASS | FAIL | SKIP-with-reason
      principles_loaded: N
      under_enforced_principles: [<list>]
    frontmatter_validate:
      command: pnpm lint:frontmatter
      status: PASS | FAIL | SKIP-with-reason
      scanned: N
      errors: N
      exempt: N
    audit_runner_full_pass:
      command: pnpm audit:run --strict (planned week-4)
      status: PASS | FAIL | SKIP-with-reason | DEFERRED-WITH-REASON
  exit_code: 0 | non-zero
  evidence_path: tools/bootstrap-readiness.md OR similar
```

If ANY cycle has `status: FAIL`: closing summary cannot proceed; surface as BLK-S<NNN>-* + fix OR explicit defer-with-reason carried to next-session blocker file.

If a cycle is `SKIP-with-reason`: state the reason explicitly (e.g., `audit_runner_full_pass: DEFERRED-WITH-REASON: audit-runner ships week-4`).

**No silent skip allowed.** Every cycle either PASS, FAIL, or DEFERRED-WITH-REASON.

### §10.0e Governor Prompts session log (B_GOVERNOR_PROMPTS — S005 turn 27 — MANDATORY)

> **Every substantive user prompt this session has a GP-S<NNN>-<NN> entry in [`_handoff/VAULT/governor-prompts/S<NNN>.md`](../_handoff/VAULT/governor-prompts/). Cross-references the per-session log; aggregates metrics here.**

```yaml
governor_prompts_summary:
  session: S<NNN>
  log_path: docs/plan/_handoff/VAULT/governor-prompts/S<NNN>.md
  total_substantive_prompts: <N>
  cardinal_flagged: <N>
  cardinal_cross_links_propagated_to_user_intents: <N>   # MUST equal cardinal_flagged
  by_status:
    completed: <N>
    in-progress: <N>
    carry-forward: <N>
    dropped: <N>
  by_distribution_target:
    principle_engravings: <N>
    contract_engravings: <N>
    leaf_amendments: <N>
    audit_registrations: <N>
    adr_filings: <N>
    decisions_via_PCR: <N>
    explicit_drops: <N>
  null_distribution_targets_outside_drops: 0   # MUST be 0 (else governor-prompt-distribution-complete fails)
```

If 0 substantive prompts (rare; e.g., autonomous-overnight session): state `NO_SUBSTANTIVE_PROMPTS_THIS_SESSION` explicitly with reason. Empty section forbidden.

### §10.0f Handoff Pre-Flight Audit results (B_HANDOFF_PRE_FLIGHT_AUDIT — S005 turn 27 — MANDATORY)

> **Whole-session walk before handoff write. 7 mandatory checks. Findings either addressed in-session OR carried-forward explicit. No silent gaps.**

```yaml
hpfa_results:
  ran_at: <iso8601-utc>
  ran_after_pre_close_verification: true   # depends on §10.0 verify exit_code 0
  session_classification: SUBSTANTIVE | NO-NEW-WORK   # NO-NEW-WORK uses reduced scope
  checks:
    1_governor_prompts_coverage:
      status: PASS | FAIL
      total_prompts_scanned: <N>
      missing_gp_entries: <N>   # must be 0 for PASS
    2_engraving_completeness:
      status: PASS | FAIL
      catches_detected: <N>
      catches_engraved_5_surfaces: <N>   # must equal catches_detected for PASS
      below_2_surfaces_anti_pattern_flags: <N>   # must be 0
    3_audit_registration_completeness:
      status: PASS | FAIL
      new_b_star_contracts: <N>
      new_p_meta_principles: <N>
      validators_registered_atomically: <N>   # must equal new contracts × required validators
    4_cycle_evidence_presence:
      status: PASS | FAIL
      done_ratified_claims: <N>
      paired_evidence_blocks: <N>   # must equal done_ratified_claims
    5_schema_dynamic_connections:
      status: PASS | FAIL
      cross_refs_checked: <N>
      bidirectional_integrity: <N>   # cross-refs that resolve both directions
      gaps: <list>
    6_distribution_targets_populated:
      status: PASS | FAIL
      gp_entries_with_null_targets_outside_drops: <N>   # must be 0
    7_carry_forward_explicit:
      status: PASS | FAIL
      carry_forwards: <N>
      with_explicit_reason: <N>   # must equal carry_forwards
  overall_status: PASS | FAIL
  silent_gaps: 0   # MUST be 0 to write handoff
  findings_addressed_in_session: <list>
  findings_carried_forward_with_reason: <list>
```

If overall_status: FAIL, handoff write is BLOCKED. Address in-session OR carry-forward with explicit reason; re-run HPFA. NO-NEW-WORK sessions use reduced scope (only checks 1 + 5).

**NO_GAPS_THIS_SESSION** declaration acceptable when all 7 checks PASS with zero findings.

### §10.0g Mutual Understanding Validation results (B_MUTUAL_UNDERSTANDING_VALIDATION — S005 turn 28 — MANDATORY)

> **Every AI communication boundary in this session closed the I→I loop. Five boundary types tracked. Chat-jump-prompt audited mechanically before paste.**

```yaml
muv_results:
  ran_at: <iso8601-utc>
  boundary_1_chat_to_chat:
    chat_jump_prompt_8_mandatory_sections_present: PASS | FAIL
    sections_audited:
      handoff_§0_paste_target: present | missing
      post_close_addenda_references: present | missing
      governor_prompts_log_pointer: present | missing
      hpfa_evidence_block_pointer: present | missing
      carry_forwards_with_reasons: present | missing
      cardinals_verbatim_cross_link: present | missing
      verify_orchestrator_state: present | missing
      explicit_alignment_questions: present | missing
    alignment_questions_count: <N>
    cross_chat_iteration_status: pending-paste | pending-response | iterating | alignment-confirmed-explicit
  boundary_2_ai_to_ai_subagent:
    subagent_invocations_this_session: <N>
    output_contract_verifications_paired: <N>   # MUST equal invocations for PASS
    contract_mismatches_detected: <N>
    re_spawns_for_clarification: <N>
  boundary_3_ai_to_human:
    substantive_outputs_emitted: <N>
    validation_hooks_present_or_implicit: <N>
    high_stakes_outputs_with_explicit_alignment_question: <N>
  boundary_4_ai_to_persona:
    status: NOT-APPLICABLE-WITH-REASON (persona-composition ships week-7+)
  boundary_5_context_batches:
    batches_executed_this_session: <N>
    batch_close_intent_to_impact_drift_validated: <N>   # MUST equal batches for PASS
    drift_threshold_pause_re_confirms: <N>
  overall_status: PASS | FAIL
  asymmetric_one_shot_violations: 0   # MUST be 0
```

If overall_status: FAIL on any boundary, surface findings in HANDOFF §C carry-forward + address before close.

### §10.0h Inner-default leak report (B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS — S006 turn 6 — MANDATORY)

> **Every substantive output this session was gated by alignment against the inner-AI-defaults registry. Leaks (training-default patterns that slipped through) reported here. Per P-META-017.**

```yaml
inner_default_leak_report:
  ran_at: <iso8601-utc>
  registry_consulted: docs/plan/_handoff/VAULT/inner-ai-defaults/
  sessions_substantive_outputs: <N>
  category_scan_results:
    code_patterns:
      registered_entries_checked: <N>
      leaks_detected: <N>
      leaks: [<{id, instance_path, line, evidence}>]
    prose_patterns:
      registered_entries_checked: <N>
      leaks_detected: <N>
      leaks: [<{id, instance_path, line, evidence}>]
    reasoning_patterns:
      registered_entries_checked: <N>
      leaks_detected: <N>
      leaks: [<{id, instance_path, line, evidence}>]
    tooling_patterns:
      registered_entries_checked: <N>
      leaks_detected: <N>
      leaks: [<{id, instance_path, line, evidence}>]
    output_distribution:
      registered_entries_checked: <N>
      leaks_detected: <N>
      leaks: [<{id, instance_path, line, evidence}>]
  novel_patterns_for_continuous_drift_log: <N>   # appended to inner-ai-defaults/continuous-drift-log.md
  overall_status: CLEAN | LEAKS_DETECTED
```

If overall_status: LEAKS_DETECTED — surface in §10.0j enhancement proposals (per Q-2 tweak): each leak that should have been caught by an existing validator becomes a structural-fix proposal.

### §10.0i Alignment-citation summary (B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS — MANDATORY)

> **Every substantive output cites which alignment-checks it passed. Mandatory header captures the citations + verifies coverage.**

```yaml
alignment_citation_summary:
  ran_at: <iso8601-utc>
  substantive_outputs_emitted: <N>
  outputs_with_alignment_citation: <N>   # MUST equal substantive_outputs_emitted for PASS
  alignment_checks_cited:
    - top-expert-colleague-voice: <count>
    - pcr-decision-frame: <count>
    - pe-alignment-deflection: <count>
    - frontmatter-required: <count>
    - clickable-links: <count>
    - rzf-validate-before-claim: <count>
    - other: [<list>]
  uncited_outputs: <N>   # MUST be 0
  status: PASS | FAIL
```

### §10.0j Enhancement proposals from skipped/late/partial enforcements (B_STRUCTURAL_PREVENTION_DISCIPLINE — S006 turn 8 — MANDATORY)

> **Per P-META-019 (Q-2 tweak ratified S006 turn 8):** when an enforcement is skipped, late, or partial — fix the STRUCTURE that allowed the skip, not the instance. Each gap surfaces here as a structural enhancement proposal. Philosophy: enhance the system constantly; never settle for low standards + manual recovery.
>
> **If empty:** explicit `zero_proposals_declaration` with reason. Silent empty = anti-pattern.

```yaml
enhancement_proposals:
  ran_at: <iso8601-utc>
  scan_scope: all_enforcements_that_fired_this_session + all_enforcements_that_should_have_fired_but_didnt

  proposals:
    - skipped_enforcement: <discipline-id (B_* or P-META or audit-slug)>
      what_was_skipped: <concrete instance>
      why_existing_mechanism_failed: <root cause analysis — declared-but-no-validator / validator-too-narrow / hook-not-wired / pattern-not-registered>
      structural_fix_proposal:
        type: new-validator | new-hook | schema-field | contract-amendment | template-addition | registry-entry
        description: <what to build>
        surfaces_to_engrave_atomically: [memory, contract, AGENTS, spine, audit]
        estimated_leverage: 0-10
        estimated_session_cost: <0.X-N>
      K_promotion_status: K=1 | K=2 (recurring → must engrave NOW) | K=3+
      priority_score: <0-100 from priority engine>
      promoted_to_topic_plan: <topic-plan-id> | pending | not-required-K=1

  zero_proposals_declaration: |
    (if proposals empty)
    All enforcements that fired this session ran clean.
    No skips/late/partial catches detected.
    No structural fixes warranted.

  overall_status: PROPOSALS_REGISTERED | ZERO_PROPOSALS_DECLARED | SKIPS_NOT_AUDITED (anti-pattern)
```

If overall_status: SKIPS_NOT_AUDITED — handoff write BLOCKED. Per B_STRUCTURAL_PREVENTION_DISCIPLINE, silent skipping of the enhancement-proposal scan is forbidden — the philosophy mandates that EVERY session improves the system.

### §10.0l Triad coverage check (P-META-021 — added S014 CEC)

> **Per P-META-021 (Triad Governance):** for each CONSEQUENTIAL decision made this session (phase advance / DONE claim / VLT resolution / new principle / architectural choice), verify all 3 governance layers were present.

```yaml
triad_coverage_check:
  ran_at: <iso8601-utc>
  consequential_decisions_this_session:
    - decision: <what was decided>
      context_layer: <which L2 spine domain was loaded — GVRN|ARCH|AI|VALD|OPER>
      principle_layer: <which P-* or B_* principle governed this>
      mechanical_layer: <which hook/validator/gate enforces this>
      all_three_present: yes | no
      if_no_gap_declared: <which layer was missing and why — cannot be silent>
  
  single_layer_violations: <count — any consequential decision with <3 layers>
  
  overall: TRIAD_COMPLETE | VIOLATIONS_DECLARED | NOT_CHECKED (anti-pattern)
```

If overall: NOT_CHECKED — note explicitly. Any consequential decision made in single-layer mode must be logged as §10.0j enhancement proposal.

### §10.0k Conceptual alignment check (P-META-020 — added S014 Phase 3A CEC)

> **Per P-META-020 (Concept-First Governance):** any L3 validator failure this session is a signal of conceptual drift, not just a rule violation. Walk each failure: which L2 domain was it sampling? Did my understanding of that domain drift? Is the L1 anchor still intact?

```yaml
conceptual_alignment_check:
  ran_at: <iso8601-utc>
  l3_failures_this_session:
    - validator: <slug>
      l2_domain_sampled: <GVRN|ARCH|AI|VALD|OPER L2 domain>
      failure_indicates: <concept drift description OR "rule violation only — concept intact">
      diagnostic_depth_reached: L3_only | L2_examined | L1_confirmed
  
  context_depth_check:
    session_open_concept_loaded: <yes — which spine | no — skipped>
    per_input_concept_loaded: <consistent | sporadic | not_observed>
    degradation_instances: <count + descriptions if any>
  
  overall: CONCEPT_HONORS | DRIFT_DETECTED | NOT_CHECKED (anti-pattern)
```

If overall: NOT_CHECKED — note explicitly. Silent skip = anti-pattern (concept-load-skip in P-META-020 anti-patterns).

### §10.0m Session extraction (B_POSITIVE_VALUE_EXTRACTION — added S014)

> **Per B_POSITIVE_VALUE_EXTRACTION + session-S014-extraction.md template:** every substantive session extracts maximum value before context degrades. The extraction MUST be authored at session close using the 7-section template.

```yaml
session_extraction:
  artifact: docs/plan/_handoff/VAULT/session-S<NNN>-extraction.md
  status: authored | not-authored-explicit-reason
  if_not_authored_reason: <required if not authored>
  sections_completed:
    - principles_confirmed: yes | no
    - questions_generated: yes | no
    - what_worked: yes | no
    - what_failed: yes | no
    - gaps_solutions: yes | no
    - context_statements: yes | no
  new_principles_this_session: <count + IDs>
  new_questions_this_session: <count>
  drift_log_entries_added: <count>
  reasoning_patterns_promoted: <count>
```

WHY: insights not explicitly extracted are lost at session boundary. Every unextracted pattern will reappear in a future session as a more expensive problem. The session-S014-extraction.md template exists precisely because the plan-promise-abandonment pattern was invisible for 3 sessions before being named. Naming it made the structural fix (validate-open-plan-levels.mjs) possible.

### §10.0n Positive ZF evidence (mechanical-enforcement-policy — added S018)

> **Per mechanical-enforcement-policy.md:** positive ZF (CEC harvest) has a 50% execution rate vs negative ZF's 90%. This section closes the gap by making positive harvest explicitly evidence-driven. Every significant positive event this session must show: did CEC run? How many surfaces? Where was it vaulted?

```yaml
positive_zf_evidence:
  session: S<NNN>
  # List each significant positive discovery (ratification, insight, principle, new pattern)
  # CEC is required for each. Missing CEC = advisory (S018). Week-4: promotes to blocking.
  discoveries:
    - event: "<what was positive — ratification / insight / new principle / breakthrough>"
      cec_ran: yes | no | human-judgment
      cec_surfaces_covered: <1-8 number, or "N/A — human judgment, no validator possible">
      vault_path: "<extraction note / raw-thoughts / behavioral-contract / memory file>"
    # Add one entry per significant positive event
  positive_zf_completeness: COMPLETE | PARTIAL | MISSING
  # COMPLETE: CEC ran for all discoveries (or human-judgment explicitly declared)
  # PARTIAL: CEC ran for some; missing ones have explicit vault note
  # MISSING: positive ZF not done — extraction-check-blocking will flag this in ZF
  gap_notes: "<if PARTIAL: which discoveries are missing CEC and why>"
```

**Validation (advisory S018 → blocking week-4):**
`extraction-check-blocking` checks that §10.0n exists. Content quality is advisory for now.
In week-4: `validate-positive-zf-evidence.mjs` checks that every discovery has `cec_ran` populated.

WHY: Positive ZF is the compounding mechanism. Without mechanical enforcement of CEC, platform improvements stay local (one session's insight) rather than systemic (engraved across all surfaces). The difference between a platform that learns vs one that repeats the same discoveries every session.

### §10.0p Moat harvest (validate-moat-coverage — added S019)

> **Per moat-registry.md + Governor directive S019:** Moat elements = platform capabilities that compound over time and are hard for competitors to replicate. Every significant session should surface new moat candidates. The moat is LIVING — it grows with the platform.

```yaml
moat_harvest:
  session: S<NNN>
  existing_moat_covered: <count>/18  # from validate-moat-coverage.mjs output
  new_candidates:
    - name: "<new capability that compounds>"
      why_moat: "<what makes this hard to replicate>"
      coverage_needed: "<which validator would enforce this>"
  promoted_to_moat_this_session: <count>
  moat_total_after: <count>
```

Run: `node tools/validators/validate-moat-coverage.mjs` — paste output above.

### §10.0o Session Question Register clearance (SQR — added S018)

> **Per session-question-register.md:** Every CHECKPOINT item produced during the session must be acknowledged before close. OPEN items that were not acknowledged must be explicitly deferred with a reason.

```yaml
session_question_register:
  session: S<NNN>
  total_checkpoint_items: <count>
  acknowledged: <count>
  deferred_with_reason: <count>
  open_unaddressed: <count>  # must be 0 to close cleanly
  
  # List any deferred items with reasons:
  deferred_items:
    - id: SQR-S<NNN>-NNN
      content: "<what was asked/defined>"
      defer_reason: "<why deferred>"
      carry_forward_to: S<NNN+1>
```

**Mid-session harvest check (per Governor directive S018):**
At every IMPL_BATCH boundary (ZF Level 2), check:
1. Positive discoveries since last harvest ≥3? → Run CEC now
2. SQR OPEN items older than 5 turns? → Re-surface top 1 at start of next response
3. Negative findings without engraving? → Catch-to-engraving

If overall_status: OPEN_CHECKPOINTS — session close is advisory-blocked. Surface items and defer explicitly.

### §10.0q SAP Abbreviated — Sweeps 2 + 5 (sonnet-audit-protocol.md — added S020)

> **Runs at every session close.** Full 6-sweep SAP runs at complex/architectural sessions and before every Opus consultation. Spec: [sonnet-audit-protocol.md](../../../pillar-0-governance/sonnet-audit-protocol.md).

```yaml
sap_abbreviated:
  session: S<NNN>

  sweep_2_drift:
    validate_drift_registry: "<paste last line of validate-drift-registry.mjs output>"
    drift_coverage_pct: <N>
    drift_coverage_previous: <N>
    coverage_delta: "advanced / unchanged / regressed"
    enforcement_rate_pct: <N>
    enforcement_rate_previous: <N>
    rate_delta: "advanced / unchanged / regressed"

  sweep_5_contract_enforcement:
    validate_enforcement_rate: "<paste last line of validate-inner-ai-defaults-enforcement-rate.mjs output>"
    live_validators: <N>
    total_entries: <N>
    k2_candidates: []  # entries deferred ≥2 sessions
    vtls_created_this_session: []

  session_close_invariants:
    enforcement_rate_maintained: true  # this session >= previous session
    drift_coverage_maintained: true    # this session >= previous session
    regression_vlt_if_decreased: "N/A or VLT-SXXX-SLUG"
```

Run: `node tools/validators/validate-drift-registry.mjs` + `node tools/validators/validate-inner-ai-defaults-enforcement-rate.mjs` — paste last lines above.

WHY: SAP Sweeps 2+5 are the minimum session-close audit. Without them, enforcement_rate and drift_coverage can silently regress across sessions without a VLT tracking the debt. The session-close invariants force the AI to declare whether coverage advanced or regressed — not assume it was unchanged.

### §10.0r Intent Drift Check (P-META-022 ZF-3 — added S023)

Before declaring this session DONE, verify intent did not drift from the original goal:

  goal_statement (from plan frontmatter — paste verbatim):
  what was actually produced (one sentence):
  drift: YES / NO / PARTIAL
  if YES or PARTIAL:
    delta: [what drifted]
    approved drift (VLT): yes / no
    if unapproved: VLT-S{NNN}-INTENT-DRIFT-{slug} raised
  if NO: ✅ Intent preserved — goal_statement matched delivery

### §10.0s C&I Adherence Check (P-META-025 — added S027)

Did this session act from intent (L3) or rule-following (L1)?

  Cases where rule and intent aligned (normal): [count or "all"]
  Cases where rule and intent diverged: [list any]
    → for each: what was the intent? what did the rule say? which won? documented?
  Novel situations where no rule existed: [list]
    → for each: what intent guided the action?
  governing_intent gaps surfaced: [any B_* contracts used this session without a governing_intent field?]
    → these are SROF candidates for Session B

If all_aligned and no_novel_situations: state "C&I: Rule-intent alignment confirmed this session"

### §10.1 Stewardship review (P-META-004)

**Run `/stewardship-review`:**
- [evidence: tool-call output OR "skill not yet implemented; manual scan walked X artifacts"]
- Pending-protocol items surfaced: <count + IDs>
- Pending-review items surfaced: <count + IDs>
- Active-stale items surfaced: <count + IDs>
- Items advanced this session: <list>
- Items extended (next_review_at): <list with reasons>

### §10.2 Learning Loop extract (P-META-005)

**Run `/learning-loop-extract`:**
- [evidence: tool-call output OR "skill stub fired; manual extraction walked session log"]
- Items extracted this session: <count + EXT-IDs>
- Confidence-band distribution: auto-accept N / human-review M / discard P
- K=2 recurrence-check fires: <count + topics>
- Auto-ADRs proposed: <count + IDs>
- "No insights, reason: <X>" — required when 0 items extracted

### §10.3 Handoff §0-§22 sections completion

For each handoff section in the new handoff being written:
- §0 paste-target: ✓ [path]
- §1 priority-zero: ✓
- §2 user-intent verbatim quotes: ✓
- §3 FWWS-pending: ✓
- §4 state-snapshot: ✓
- §5 approved-deferred-batch: ✓
- §6 insights synthesized: ✓
- §7 research index: ✓
- §8 vault-tree paths: ✓
- §9 tagging guidance: ✓
- §10 closing-protocol link: ✓
- §11 fresh-chat protocol link: ✓
- §12 naming protocol link: ✓
- §13 validation passes (3 perspectives + limits-line): ✓
- §14 LearningLoopItem extracts: ✓
- §15 Stewardship Protocol report: ✓
- §16 Intent-to-Impact validation: ✓
- §17 Two-sided handshake attestation (4-section payload): ✓
- §18 Blocker registry: ✓
- §19 RZF evidence block: ✓
- §20 CEC walk-trails: ✓
- §21 Grandfather backfill report: ✓
- §22 Detailed paste-prompt: ✓

Each ✓ requires evidence path. Each missing = explicit `DEFERRED: <reason>`.

### §10.4 MASTER_PLAN.md update

- Session-significant changes that warrant trunk update: <list OR "none">
- Migration tracker rows updated: <list>
- New artifact entries added: <list>

### §10.5 VAULT file appends

- `insights.md` — new insights appended: <count + summary>
- `research-index.md` — new research streams: <count>
- `open-questions-ledger.md` — new OQ-* items: <count>
- `blockers-S<NNN>.md` — new blockers: <count + IDs>
- `validation-pass-S<NNN>.md` — emitted: ✓ [path]
- `gaps-and-duplications-S<NNN>.md` — emitted: ✓ [path]

### §10.6 Prior session lifecycle_state

- HANDOFF-S<NNN-1>-to-S<NNN>.md: state transitioned `active → resolved` ✓ + `superseded_by:` field set

### §10.7 Final user message

- [verbatim text of the final user message — must include both paste-targets per v1.6 §22]
- Minimal paste: `Read docs/plan/_handoff/HANDOFF-S<NNN>-to-S<NNN+1>.md §0 and execute.`
- Detailed paste-prompt saved at: `_handoff/VAULT/chat-jump-prompt-S<NNN>-to-S<NNN+1>.md`

### §10.8 EXT-IDs surfaced (P-META-005)

For each EXT-ID processed this session:
- EXT-<ID>: source-type / state / contexts-routed-to / recommended-action

### §10.9 Blocker registry final state

- Open blockers: <count + IDs>  (must be 0 to write next-session handoff)
- Answered this session: <list with answers>
- Carry-forward to next session: <list>

### §10.10 RZF evidence block (P-META-006)

[per zero-findings-discipline.md format — cycles_run + findings_per_cycle + final_status + coverage + signature]

### §10.11 CEC walk-trail (P-META-006)

[per zero-findings-discipline.md format — extracted_essence + cycles_walked + walk_scope + applications_made + signature]

### §10.12 Grandfather backfill report (P-META-006 Component 5)

- Opportunistic-touch backfills (Layer 1): <count + artifact list>
- Recurrence-driven backfills (Layer 2): <count + artifact list>
- Floor evaluation (Layer 3): triggered? Y/N + reason
- Ceiling-deferrals: <count carried to next session>
- Oldest-grandfather-age: <days> + alert level (none / warn at >30d / error at >180d)

### §10.11b Positive value extracted this session (B_POSITIVE_VALUE_EXTRACTION — S005 turn 20)

For each significant positive event triggered this session (insight / user-directive / improvement / EXT-ID / bug-fix / AI-self-correction / generator-output / meta-finding), emit one walk-trail entry:

```yaml
positive_value_walks:
  - event_id: PVE-S<NNN>-<NN>
    event_type: insight | user-directive | improvement | ext-id | bug-fix | ai-self-correction | generator-output | meta-finding
    event_description: <1-2 sentence: what happened>
    extracted_essence: <1 sentence: the core insight / mechanism / lesson>
    cycles_walked: <integer>
    opportunities_per_cycle:
      - cycle_1: <integer>
      - ...
      - cycle_N: 0
    walk_scope: <list of categories scanned>
    applications_made: <list of paths-modified + diff summary>
    not_applicable: <list of paths-scanned-but-no-application + reason>
    needs_human_judgment: <list of paths flagged>
    final_status: CEC-0 ACHIEVED Cycle N | open-opportunities:<list>
    signature: <ai-id>@<iso-timestamp>
```

If 0 positive events: state `NO_POSITIVE_EVENTS_THIS_SESSION` explicitly (with brief reason — e.g., "session was pure verification cycle; no new insights emerged"). Empty section forbidden.

Trivial events (single-line typo / casual edit) excluded with explicit one-line skip note. Significance is judgment-based but biased toward over-trigger.

### §10.11c Cross-Platform Exchange (CSPS ↔ CSP — S082 addition)

For sessions that produce or receive cross-platform exchange items:

```yaml
cross_platform_exchange:
  outgoing_this_session:
    - id: "EX-[date]-[seq]"
      topic: ""
      file: "docs/platform-intelligence/outgoing/[filename]"
  incoming_this_session:
    - (none | list items)
  pending_confirmations_count: N   # from exchange-log.yaml absorption_status: pending
  pending_alert: false              # true if any item pending > 3 sessions
  exchange_log_updated: true|false  # was exchange-log.yaml updated this session?
```

If no cross-platform activity: state `NO_CROSS_PLATFORM_EXCHANGE_THIS_SESSION` explicitly.
Source of truth: `docs/platform-intelligence/exchange-log.yaml`
Spec: `docs/platform-intelligence/CROSS-PLATFORM-EXCHANGE-SPEC.md`

---

### §10.13 Self-audit (B_AI_PROFESSIONAL_VOICE check)

- Did AI assume without validating? <list with examples + remedies>
- Did AI guess without proof? <list>
- Did AI invent without precedent check? <list>
- Did AI fill gaps without asking? <list>
- Did AI create without checking existing decisions? <list>
- Engraved as memory entries / blockers / ADR drafts: <list>

### §10.13b Catches engraved this session (B_CATCH_TO_ENGRAVING — turn 15)

For each catch (gap / trap / anti-pattern / missing-execution / failure-mode) noticed this session:

| Catch (1-line) | Detected at | Classification | Engraved-to (artifact paths) | Surfaces hit (X/5) |
|---|---|---|---|---|
| <description> | turn N | pattern / composition / one-off / new-discipline | memory:... + contract:... + agents-md:... + schema:... + hook:... + validator:... | N/5 |

If 0 catches: state `NO_CATCHES_THIS_SESSION` explicitly. Empty section is forbidden. Every row's surfaces_count < 2 is a B_FIVE_SURFACE_ENGRAVING violation surfaced in §10.13c.

### §10.13c FSE evidence block (B_FIVE_SURFACE_ENGRAVING — turn 17)

For each new behavioral discipline engraved this session, emit one block:

```yaml
fse_evidence:
  discipline: <B_NAME or P-META-NNN>
  surfaces_targeted: [schema, validator, hook, memory, contract]
  surfaces_status:
    schema: { active | declared | deferred-week-N | n/a-with-reason, ref: <path> }
    validator: { active | declared | deferred-week-N | n/a-with-reason, ref: <path> }
    hook: { active | declared | deferred-week-N | n/a-with-reason, ref: <path> }
    memory: { active | declared | deferred-week-N | n/a-with-reason, ref: <path> }
    contract: { active | declared | deferred-week-N | n/a-with-reason, ref: <path> }
  surfaces_count_active: <N>
  surfaces_count_declared: <N>
  classify_decision: pattern | composition | one-off | new-discipline
  atomic_flag: <true | false-with-reason>
  meta_rzf_cycles: <N>
  meta_rzf_final: ZF-0-ACHIEVED-CYCLE-N | open-findings:<list>
  signature: <ai-id>@<iso-timestamp>
```

If 0 new disciplines engraved: state `NO_NEW_DISCIPLINES_THIS_SESSION` explicitly. Surfaces_count_active < 2 surfaces a B_FIVE_SURFACE_ENGRAVING anti-pattern; cannot close session without either reaching 2/5 minimum OR explicit deferral with rationale carried to next-session blocker registry.

### §10.13d Decisions presented this session (B_PCR_FOR_DECISIONS — S005 turn 5)

For each non-trivial decision the AI presented to the user this session in chat output:

| Decision (1-line) | Turn N | Options enumerated (count) | Pros/Cons table emitted | Recommendation present | Load-bearing factor named | What-would-flip clause | Surfaces hit |
|---|---|---|---|---|---|---|---|
| <description> | turn N | Y/N (count) | Y/N | Y/N | Y/N | Y/N | <surfaces e.g. "all 5 PCR blocks present"> |

If 0 decisions: state `NO_DECISIONS_PRESENTED_THIS_SESSION` explicitly. Empty section forbidden.

Trivial-reversibles (per P-OP-003 counterweight: variable-naming / comment-phrasing / file-location-when-both-valid / color-in-draft / two-way-doors-at-low-cost) excluded from the table. List excluded items inline with brief skip-reason — silent skip is the anti-pattern this section catches.

Audit `pcr-completeness-on-decisions` (PR-blocking warn; planned week 4) parses this section + cross-checks against session log; flags decision-presenting language outside this table without a corresponding row.

### §10.14 TodoWrite final state

[paste full TodoWrite list — every task with state + evidence reference]
```

## Why every section is mandatory

Per `feedback_protocol_compression_is_skipping`: when ANY section is omitted, the omission is invisible to user without manual audit. The required-header template makes omissions impossible-to-hide:
- Empty section = AI explicitly states "NOT_APPLICABLE: <reason>"
- Missing section = closing summary is INCOMPLETE = AGENTS.md hard NO violation
- Audit `closing-summary-checklist-completeness` (planned week 4) catches both

## Pre-runtime enforcement

The closing AI walks this template literally as the closing summary skeleton. Tasks correspond 1:1 with sections. No shortcuts.

## Post-runtime enforcement (week 4+)

Audit `closing-summary-checklist-completeness` parses the closing summary; matches sections against this template; fails PR if any required header missing.

## Cross-references

- `_handoff/VAULT/protocols.md` v1.7 §10 — references this template as the canonical shape
- `pillar-0-governance/behavioral-contracts.md` § B_PROTOCOL_LITERAL_EXECUTION — the binding contract
- `~/.claude/.../memory/feedback_protocol_compression_is_skipping.md` — the cognitive layer
