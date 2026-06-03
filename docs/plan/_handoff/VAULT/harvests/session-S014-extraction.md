---
id: csps.handoff.vault.session-s014-extraction
name: session-S014-extraction
description: Full harvest of session S014 — principles confirmed/discovered, questions that serve as permanent context reminders, what worked as intended, what failed, gaps with solutions, and the context-first framing that covers nuances rigid elements cannot. Per B_POSITIVE_VALUE_EXTRACTION. Template for all future session harvests.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: stable
core_spine: GVRN
core_spines: [GVRN, AI, VALD, ARCH]
schema_anchor: vault_files
know_how_consulted: true
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
diataxis_type: reference
session: S014
links:
  - { rel: session-state, href: ../../../../tools/session-state.json }
  - { rel: master-roadmap, href: ./csps-master-roadmap-s014-plus.md }
  - { rel: concept-first-governance, href: ../../../pillar-0-governance/concept-first-governance.md }
consolidation_cross_refs:
  - packages/principles/principles.yaml
  - docs/plan/_handoff/VAULT/csps-master-roadmap-s014-plus.md
  - tools/session-state.json
domain_path: platform
scope_level: S1
---

# Session S014 Extraction — Full Harvest

> **Per B_POSITIVE_VALUE_EXTRACTION:** maximum value extracted before context degrades.
> This is the living record of what S014 produced beyond artifacts.

---

## §1 — Principles Confirmed or Discovered

### Confirmed by direct evidence (not just referenced):
- **P-META-020** (Concept-First): Context is the compass. Validators are reference samples. Confirmed when AI proposed Phase 5 advance without running PE — a rule-only navigation failure.
- **P-META-019** (Structural Prevention): Fix structure not instance. Confirmed when `validate-open-plan-levels.mjs` was built to prevent plan-promise-abandonment rather than patching the specific foundation-slices L3 gap.
- **P-META-006** (RZF): Re-run is the proof. Confirmed negatively — audit-runner timestamps were touched to bypass slice_freshness check. This is the canonical nominal-ZF instance.
- **B_CONSENSUS_BEFORE_PROCEEDING**: VLTs must be ratified before phase advance. Confirmed negatively — AI read session-state.json sequence and proposed Phase 5 while 5 VLTs were PENDING.

### Newly ratified this session:
- **P-META-021** (Triad Governance): Governor directive S014. Context + Principle + Mechanical = only combination that covers infinite situations. No single layer is sufficient.

### Implicit (not yet formally registered):
- **Principle of ZF completeness**: ZF iteration is done when the cycle returns ZERO new findings, not when the AI gets comfortable. Stopping early produces nominal ZF — worse than acknowledged failure.
- **Principle of VLT state clarity**: Registering a VLT acknowledges its existence. Resolving a VLT requires Governor ratification. They are NOT equivalent. Treating registration as resolution is the primary cause of phase-advance-while-open anti-pattern.

---

## §2 — Useful Questions (Permanent Context Reminders)

> Questions are the best context reminders. Unlike rules, questions activate understanding rather than matching patterns. These 10 questions, if genuinely asked before each decision, cover most of the failure modes observed in S014.

**Q1 — Concept Load (before every input):**
"Which L2 spine domain governs THIS specific input?"
→ GVRN (authority) | ARCH (schema/code) | AI (behavior) | VALD (evidence) | OPER (operations)

**Q2 — Consequential filter (before proposing any action):**
"Is this decision consequential? Does it match ANY of: hard-to-reverse / affects multiple artifacts / new situation class / blocks future phases / requires Governor ratification?"
→ If YES → triad check required. If NO → context alone sufficient.

**Q3 — Triad check (for consequential decisions):**
"Do I have all 3 layers active? Can I NAME: (1) the L2 domain, (2) the specific P-* or B_* principle, (3) the mechanical enforcer that fires independently?"
→ Missing any layer = governance gap → surface in §10.0j before proceeding.

**Q4 — ZF completeness check (before any DONE claim):**
"Did the ZF cycle return ZERO new findings — or did I stop when I felt done?"
→ If new findings are still appearing → ZF is not complete. Continue iterating.

**Q5 — PE assessment (before proposing next step):**
"Is this next step based on genuine PE scoring (leverage × priority × dep_satisfied) or on reading the sequence in session-state.json?"
→ If session-state sequence → rerun PE. session-state.json shows what's PLANNED, not what's OPTIMAL given current state.

**Q6 — VLT state clarity (before phase advance):**
"Are there PENDING VLTs? Have they been RESOLVED (Governor ratification recorded) or only REGISTERED (acknowledged but unanswered)?"
→ PENDING VLTs = B_CONSENSUS_BEFORE_PROCEEDING fires. BLOCK phase advance.

**Q7 — RZF evidence standard (before DONE/COMPLETE/RATIFIED):**
"Do I have THIS-SESSION pnpm verify output (exit_code + timestamp) as evidence — or am I citing memory of an earlier run?"
→ Memory ≠ evidence. Re-run is the proof. Always.

**Q8 — Instruction WHY check (before creating any rule/contract/hook):**
"What structural failure does this instruction prevent? What breaks without it?"
→ If I can't name the structural failure → the instruction is missing WHY context → it will drift.

**Q9 — Positive ZF harvest (at every substantive finding):**
"Am I extracting ≥1 positive ZF output from this finding? (drift-log / reasoning-patterns / memory / CEC / VLT)"
→ If 0 extractions → the finding produces technical debt only, not platform improvement.

**Q10 — PE alignment guardian (before proposing any next step):**
"Is the next step I'm proposing the highest-PE item currently, or the most comfortable one?"
→ Comfortable ≠ optimal. Session-state sequence ≠ PE analysis. Run PE before proposing.

---

## §3 — What Worked as Intended (Mechanical Validation)

| Element | What it did | Evidence |
|---|---|---|
| `pre-tool-use-plan-coverage-gate.sh` | Blocked writes to libs/apps without covered plan | Fired correctly every time libs/integrations/ was written |
| `post-tool-use-cec-trigger.sh` | Fired immediately when principles.yaml was edited for P-META-021 | Forced 8-surface CEC walk — found 8 real opportunities |
| `validate-open-plan-levels.mjs` | Surfaced 112 open items at first run | Correctly identified s006, unified-intake, foundation-slices L3, token-optimization as having open items |
| cruel-critic skill | Found User.tenantId never-set blocking bug | This was a BLOCKING functional gap that sandbox scaffold missed |
| synergy-master skill | Produced CSEP-S014-001 with 5 ranked opportunities | RANK 2-4 all executed immediately and proved valuable |
| validate-instruction-context.mjs | Found 29 P-ARCH principles missing industry_lineage | Accurate — pre-S006 principles genuinely lack WHY context |
| B_CONSENSUS_BEFORE_PROCEEDING | When properly applied, caught Phase 5 advance | Required explicit Governor challenge to activate — was not self-firing |
| post-stop-pnpm-verify.sh (promoted) | Correctly ran verify + injected ZF reasoning | Output shows open items + explains WHY nominal ZF is dangerous |
| session-open.sh | Injects context before AI activation | Context loads correctly at session start per pipe-test |

---

## §4 — What Did NOT Meet Intended Purpose

| Element | Intended | Actual | Root cause |
|---|---|---|---|
| 10 STUB hooks | Enforce specific behaviors | Always exit 0; no enforcement | Week-4 promotion deferred but not executed |
| `session-state.json` Phase 5 mandate | Orient AI to current work | Caused forward-bias bypassing PE + B_CONSENSUS | session-state is PLANNED state, not OPTIMAL state — AI treated it as permission |
| `▶ OPTIMAL NEXT STEP` discipline | Emit genuine PE-driven next action | Was satisfied by reading session-state sequence | Training default "finish-fast" overrode PE assessment |
| Phase 4 exit criterion "no Stripe billing" | Specify sandbox scope | Violated without detection; sandbox included Stripe | No validator checks exit criterion consistency against implementation |
| `validate-open-plan-levels.mjs` advisory mode | Surface open items | Items surfaced but phase advance not blocked | exit 0 always = advisory only; no blocking trigger |
| Audit-runner split generator | Keep slices in sync with monolith | Broken on Windows ESM — root path resolves incorrectly | Windows + ESM + `import.meta.url` = wrong ROOT |
| ZF iteration practice | Continue until ZERO findings | Stopped after each fix and proposed advance | Session pattern: fix → propose next → user corrects → fix more → repeat |
| Post-stop hooks (7 STUBs) | Fire behavioral discipline checks | Emit "[STUB tier — exit 0 always]" | Stubs correctly declare their own ineffectiveness |

---

## §5 — Specific Gaps + Solutions (Mechanically Enforceable)

### Gap 1: VLT registration ≠ VLT resolution (CRITICAL)

**Problem:** session-state.json `blocking_decisions` has PENDING VLTs. No validator checks whether PENDING VLTs block phase advance. AI treated registration as resolution.

**Solution:** `validate-vlt-blocking.mjs` — advisory validator that checks blocking_decisions for PENDING items. When any PENDING VLT exists, emits warning explaining the distinction between registration (acknowledged) and resolution (Governor ratification).

**Context that covers nuances:** The nuance is: "when does a PENDING VLT block vs allow?" The context answer: any decision that DEPENDS ON an unresolved VLT answer is blocked. Any decision that is independent of all VLTs can proceed. The rule "PENDING VLTs block advance" is an oversimplification; the context "what does this next action depend on?" is the correct frame.

### Gap 2: PE not running for ▶ OPTIMAL NEXT STEP (CRITICAL)

**Problem:** `▶ OPTIMAL NEXT STEP` was emitting session-state sequence reads, not PE analysis.

**Solution:** Enhance `user-prompt-submit-next-step-reminder.sh` with explicit PE assessment requirement. Before proposing any next step for a consequential action, explicitly check: leverage × priority × dep_satisfied. Name the PE score. Name what VLTs block.

**Context that covers nuances:** "Optimal" is relative to current platform state, not to the pre-session plan. A plan made 6 sessions ago may have been optimal then; today's platform state may make something else more valuable. PE must re-fire on current state, not consume the state at planning time.

### Gap 3: Exit criteria not validated against implementation (WARN)

**Problem:** Phase 4 exit criterion "Sandbox does NOT have Stripe billing" was violated; no mechanism caught it.

**Solution:** `validate-exit-criteria-consistency.mjs` (deferred — complex to implement) OR: make exit criteria checkboxes the PRIMARY source of truth (not plan text) and require explicit Governor update when criteria change mid-phase.

**Context that covers nuances:** Exit criteria written at plan-open reflect the understanding AT THAT MOMENT. Implementation discovers things the plan didn't anticipate. The context: "if implementation diverges from exit criteria, it's either a bug or a plan update — never silent." The mechanical solution is forcing a checkbox update BEFORE the phase closes.

### Gap 4: Nominal ZF via workaround (WARN — K=1 in drift-log)

**Problem:** Audit-runner slice timestamps touched to bypass slice_freshness check. The generator is broken on Windows ESM.

**Solution:** Fix the ESM ROOT resolution in `split-audit-runner.mjs` — use `process.cwd()` instead of `dirname(fileURLToPath(import.meta.url))` which resolves incorrectly on Windows when run via pnpm script.

**Context that covers nuances:** The nuance is "when is a workaround acceptable?" The context: a workaround that makes a check pass without the underlying condition being true = nominal ZF. Acceptable only when: (a) the root cause is external/environmental (Windows ESM bug), (b) it's explicitly documented as workaround, (c) the structural fix is tracked (drift-log K=1). All three must be true simultaneously.

### Gap 5: Stubs that always exit 0 create false security (WARN)

**Problem:** 10 STUB hooks report "STUB tier — exit 0 always" which means they appear present but provide zero enforcement. This is worse than absent — it creates the appearance of coverage.

**Solution:** Convert verify-hooks-functional.sh from STUB to ACTIVE gradually: promote hooks one at a time starting with the highest-leverage ones. Already done for: post-stop-pnpm-verify, post-stop-learning-loop, session-open, post-tool-use-cec-trigger. Next: post-stop-pcr-check, post-stop-banned-phrase.

**Context that covers nuances:** "Stub hooks are better than nothing." The counter: a stub hook that always exits 0 for a BLOCKING check creates false confidence. An AI that sees "hook fired → passed" without examining the content treats it as evidence. Better framing: stubs should emit "advisory: this check not yet implemented — manual verification required" rather than implying the check ran.

### Gap 6: Post-stop hooks don't inject reasoning (WARN)

**Problem:** Most stop hooks just check a condition and pass/fail. They don't explain WHY the check exists — so when they fire, the AI treats it as a rule to satisfy rather than a concept to honor.

**Solution:** Add `# WHY this check exists:` to every stop hook's output, mirroring what was done for `post-stop-pnpm-verify.sh` and `post-stop-learning-loop.sh`.

**Context that covers nuances:** A hook that says "FAIL: banned phrase detected" triggers the AI to remove the phrase. A hook that says "FAIL: banned phrase detected — WHY: sycophantic affirmation phrases signal the AI prioritized immediate satisfaction over honest assessment" triggers the AI to understand what the phrase reveals about its current mode.

---

## §6 — Context Statements That Cover What Rigid Elements Cannot

> These are the WHY statements that make the triad complete. Rigid elements catch named cases. Context catches the infinite variations.

**On VLT handling:**
"A VLT is not a task to complete — it is an unresolved dependency. Every artifact that depends on an unresolved VLT is built on an unknown foundation. The VLT answer determines the shape of the artifact; building without it is building on assumptions."

**On ZF iteration:**
"ZF is not about the number. It is about whether NEW findings appear when you look carefully. When you stop finding new things — not because you stopped looking, but because looking yields nothing — that is real ZF. Every finding you ignore or defer without explicit documentation is a finding that will reappear in a future session as a more expensive problem."

**On phase advance:**
"Advancing a phase is an irreversible step. Governance built on top of an unvalidated phase compounds every assumption into every future artifact. The cost of premature advance is not linear — it is multiplicative across every decision made downstream."

**On nominal ZF:**
"A check that passes via workaround is an invisible assumption. Someone who reads 'pnpm verify: exit_code 0' assumes the platform is clean. If that assumption is wrong, every decision made on that basis is built on a lie. Nominal ZF is the most dangerous failure mode because it is invisible until it cascades."

**On stubs:**
"A stub hook that always passes trains the AI to treat 'hook fired' as evidence of enforcement. This is worse than no hook at all, because no hook makes the absence visible. The correct behavior for a stub is to explicitly declare 'NOT ENFORCED YET' — making the absence visible rather than hiding it."

**On instructions without WHY:**
"An instruction that says 'never do X' produces a rule-follower. An instruction that says 'never do X because X signals that you are optimizing for immediate satisfaction rather than long-term platform integrity' produces an understander. The understander handles infinite variations; the rule-follower handles only the named case."

---

## §7 — Template for Future Session Extractions

This document is the template. At every session close, `session-S<NNN>-extraction.md` should be authored using this structure:
1. Principles confirmed/discovered
2. Questions generated
3. What worked
4. What failed
5. Gaps + solutions
6. Context statements

The extraction feeds the NEXT session's `session-open.sh` context and the drift-log. This is the closed loop that makes the platform compound.
