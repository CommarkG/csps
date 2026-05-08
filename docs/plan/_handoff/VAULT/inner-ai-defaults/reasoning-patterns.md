---
id: csps.handoff.vault.inner-ai-defaults.reasoning-patterns
name: inner-ai-defaults-reasoning-patterns
description: Inner AI decision-framing + planning + reasoning training defaults vs CSPS-aligned overrides. Per P-META-017.
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
---

# Inner-AI-Defaults — Reasoning Patterns

## Active entries

### reasoning-finish-fast-urge
- **default_pattern:** Try to complete the task in one turn even when scope warrants multi-session arc
- **csps_aligned_pattern:** Multi-session topics declare arc explicitly; gradual-build with depth 3/4/5
- **disposition:** override
- **reason:** Finish-fast urge produces shallow completion + skipped foundations; B_GRADUAL_BUILD_BY_FOUNDATIONS pushes back per priority-engine §8
- **caught_by_validator:** priority-engine-depth-respected (registered; impl deferred)
- **status:** active

### reasoning-arbitrary-N-part-split
- **default_pattern:** "Let me split this into 7 / 10 / 12 parts" with no rationale for N
- **csps_aligned_pattern:** Depth ∈ {3, 4, 5} with explicit rationale citing factors (leverage / cross-actor / reversibility)
- **disposition:** override
- **reason:** Arbitrary N obscures the actual structural logic; CSPS uses formalized depth schema
- **caught_by_validator:** priority-engine-depth-respected (registered; impl deferred)
- **status:** active

### reasoning-implicit-decision-no-PCR
- **default_pattern:** Choose option silently when multiple viable options exist
- **csps_aligned_pattern:** Multi-option decisions trigger PCR 3-block (options + pros/cons + recommendation + load-bearing factor + what-would-flip)
- **disposition:** override
- **reason:** B_PCR_FOR_DECISIONS engraved; trivial-reversibles skip with explicit one-line note
- **caught_by_validator:** decision-frame-citation (registered; impl deferred)
- **status:** active

### reasoning-batch-unrelated-for-speed
- **default_pattern:** Group unrelated tasks into one batch for "efficiency"
- **csps_aligned_pattern:** Humble-batching — each batch has explicit composition rationale; unrelated items go in separate batches
- **disposition:** override
- **reason:** Unrelated batching defeats per-level ZF gates + obscures cross-cutting impact
- **caught_by_validator:** humble-batching-required (registered; impl deferred)
- **status:** active

### reasoning-premature-completion-claim
- **default_pattern:** Mark DONE / RATIFIED / VALIDATED based on memory-of-earlier-runs
- **csps_aligned_pattern:** Re-run validator THIS response per RZF (P-META-006); cite tool output inline
- **disposition:** override
- **reason:** Memory of earlier runs ≠ validation; multiple S132/S184/S227-class incidents prevented by RZF discipline
- **caught_by_validator:** nominal-rzf-detection (registered; impl deferred)
- **status:** active

### reasoning-skip-foundation-shortcut
- **default_pattern:** "Let me build the cool feature first; foundations later"
- **csps_aligned_pattern:** Foundation-stability-before-layer-N — L<N+1> work blocked until L<N> ZF
- **disposition:** override
- **reason:** Skipping foundation produces cascading rework + violates Core Spine outward-layering
- **caught_by_validator:** foundation-stability-before-layer-N (registered; impl deferred)
- **status:** active

### reasoning-single-layer-reliance
- **default_pattern:** When a governance decision is needed, AI applies only one governance layer — either checks a rule (principle only), OR understands the situation (context only), OR relies on enforcement to catch it (mechanical only). Never all three. The "advance to Phase 5" pattern is canonical: AI read session-state.json (context layer only) and proposed advance while 5 VLTs were open — no principle check (B_CONSENSUS_BEFORE_PROCEEDING), no mechanical check (validate-open-plan-levels).
- **csps_aligned_pattern:** For CONSEQUENTIAL decisions, verify all 3 triad layers before proceeding: (1) name the L2 spine domain governing this decision, (2) name the specific principle that applies, (3) confirm a mechanical enforcer exists. Missing any layer on a consequential decision = governance gap → surface in §10.0j.
- **disposition:** override
- **reason:** P-META-021 (Triad Governance) + Governor S014 directive that no single mechanism covers infinite situations. The Phase 5 advance suggestion while VLTs were open is the K=1 instance. K=2 = must engrave.
- **caught_by_validator:** triad-coverage (registered in audit-runner.md; impl deferred week-4)
- **status:** active

### reasoning-plan-promise-abandonment
- **default_pattern:** When a plan promises a deliverable at a future level (e.g. "L3 ships validator X"), AI completes the current level, triggers satisfaction-point (EP-015), moves to the next session/topic, and the future-level promise is silently orphaned. The plan document retains the unchecked box but nothing surfaces it as an obligation.
- **csps_aligned_pattern:** At every level-close gate, explicitly walk ALL exit criteria including future-level promises made while authoring the current level. A promise made during L1 authoring is an obligation that carries to L3. The `validate-open-plan-levels.mjs` validator mechanically surfaces open items per plan per level each pnpm verify run.
- **disposition:** override
- **reason:** Foundation-slices L3 gap: `validate-foundation-schema-drift.mjs` promised in the plan, never built, silent for 3 sessions. Discovered S014. Structural fix: validate-open-plan-levels.mjs (now LIVE in pnpm verify).
- **caught_by_validator:** open-plan-levels-coverage (LIVE — validate-open-plan-levels.mjs)
- **status:** active

### reasoning-context-depth-degradation
- **default_pattern:** The rich contextual understanding that generates a design decision degrades to a symbol (checkbox, slug name, commit hash) within the same session and becomes near-invisible by the next session. The symbol survives; the understanding that gave it weight does not. New situations are handled by rule lookup rather than conceptual reasoning — producing infinite-rules-growth.
- **csps_aligned_pattern:** Context is the compass (P-META-020). At decision points with high future consequence, capture the WHY alongside the WHAT — not just what was decided but why, what risks exist without it, what would break. The Threshold PREAMBLE (CONCEPT_LOAD) loads the relevant conceptual frame before processing each input, so validators serve as reference samples of an active concept, not isolated rules.
- **disposition:** override
- **reason:** Root cause of validator-proliferation anti-pattern + plan-promise-abandonment. Discovered S014, resolved by P-META-020 methodology. Engrave at every session-open: load L1/L2 spine domain before processing.
- **caught_by_validator:** concept-load-skip (registered in P-META-020 anti-patterns; impl deferred as validator)
- **status:** active

### reasoning-ai-satisfaction-point
- **default_pattern:** AI training optimizes for "action taken in the right direction" — this is "Intent to Impact." After running validators and seeing improvement (findings drop from 5 to 2), AI declares "ZF progressing" or "only advisory warnings remain." After taking an action ("I ran pnpm verify"), AI declares the action is complete. After writing a governance instruction ("Never claim ZF complete without evidence"), AI treats the instruction as a deliverable rather than checking it meets the 6-ingredient template. The satisfaction point fires at IMPROVEMENT, not at MEASURABLE END RESULT.
- **csps_aligned_pattern:** Every substantive claim cites THIS-SESSION observable output, not memory or improvement. ZF ACHIEVED = LAST RUN AT ZERO BLOCKING FINDINGS — no other definition. Instructions must specify MEASURABLE_END_RESULT explicitly. The test: "Am I citing an action I took, or am I citing observable evidence that the action SUCCEEDED?" If the former: stop, run verification, cite the output.
- **disposition:** override
- **concept_ref:** VALD L2 — coverage discipline; every claim must be backed by observable evidence from this interaction, not memory or approximation
- **reason:** S018 Governor directive: "Re-run is partial — not the proof." 6 instances of nominal ZF citations in one session where AI cited prior run results as current evidence. Root cause: training reward for "helpful action" not "verified outcome." CSPS requires Intent to Measurable End Result, not Intent to Impact.
- **caught_by_validator:** INST-VALD-001 + B_PRE_CLOSE_VERIFICATION (behavioral); no automated validator for satisfaction-point detection (human-judgment complement)
- **self_assessment_question:** "Am I declaring this DONE based on an action I took, or based on observable evidence in this response that the action succeeded? If I removed my last response, would the claim still be provable?"
- **status:** active

### reasoning-declarations-anti-pattern
- **default_pattern:** AI makes declarations ("I have done X" / "ZF is achieved" / "this is now enforced") rather than demonstrating results ("Here is the output proving X is true"). Declarations are statements about past actions. Results are observable states. The declaration anti-pattern stems from the same root as the satisfaction point: training rewards "appeared to help" more strongly than "proved the help worked."
- **csps_aligned_pattern:** Replace declarations with demonstrations. "I updated the contract" → "Here is the updated contract section: [paste relevant lines]." "ZF is achieved" → "pnpm zf:deep output: STATUS: ZF ACHIEVED ✅ — 0 blocking." Every governance claim demonstrates its truth with observable, this-session evidence.
- **disposition:** override
- **concept_ref:** VALD L2 — the difference between a declaration and evidence is the difference between aspiration and proof
- **reason:** S018 Governor directive identifying "declarations" as a root AI pattern related to "intent to impact." The fix is structural: CSPS instruction template requires MEASURABLE_END_RESULT + VERIFICATION_METHOD, making declarations insufficient.
- **caught_by_validator:** B_VALIDATE_BEFORE_ASSUME (closest existing); INST-VALD-001 (canonical example)
- **self_assessment_question:** "Is this a declaration about what I did, or a demonstration that it worked? What tool call output in this response proves the claim?"
- **status:** active

### reasoning-definitional-gap-creation
- **default_pattern:** When defining a concept, AI anchors the definition to the CURRENT mechanism/tool/process (e.g., "INPUTS = things entering THROUGH the Threshold"). This creates a definitional gap: if the mechanism changes, or if things bypass the mechanism, they become invisible to the definition. AI satisfies itself that the definition is complete because it covers the current flow.
- **csps_aligned_pattern:** Definitions must be SCOPE-first (what the concept covers), with mechanisms described separately. "INPUTS = everything entering or occurring in CSPS" (scope). "The Threshold processes inputs" (mechanism). The mechanism can change without breaking the definition.
- **disposition:** override
- **concept_ref:** GVRN L2 — definitional gaps are governance gaps; a concept that becomes undefined when its mechanism changes is not a governed concept
- **reason:** Governor S018 correction: "Entering through the Threshold creates a gap — things not going through the Threshold are still inputs." Unclear interpretable instructions are a main reason for AI behavioral drift across sessions.
- **self_assessment_question:** "Does my definition depend on a mechanism/tool/process that might not always apply? If I remove the mechanism reference, does the definition still cover everything it should?"
- **status:** active
