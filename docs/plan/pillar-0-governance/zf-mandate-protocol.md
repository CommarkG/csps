---
id: csps.pillar-0-governance.zf-mandate-protocol
name: zf-mandate-protocol
description: Canonical definition of WHEN ZF runs are mandatory, at which level, with which experts, and what "completed" means when ZF-validated. Per P-META-021 (Triad): every ZF mandate includes context (WHY this level), principle (which P-* governs), and mechanical enforcement (which hook/validator fires). Governor directive S014.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
impl_status: swift-implemented
template_used: pillar-leaf
template_status: stable
core_spine: VALD
core_spines: [VALD, GVRN, AI]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - domain:planning
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
diataxis_type: reference
know_how_consulted: true
session: S014
links:
  - { rel: orchestrator, href: ../../../tools/zf-orchestrator.mjs }
  - { rel: tracker, href: ../../../tools/zf-session-tracker.json }
  - { rel: p-meta-021, href: ../../../../packages/principles/principles.yaml }
  - { rel: chat-transfer, href: ../../../plan/_handoff/VAULT/templates/chat-transfer-protocol.template.md }
domain_path: platform
---

# ZF Mandate Protocol

> **The mandate answer to: "When do I run ZF, at which level, and with what?"**
> Every entry has: trigger (WHEN) + level (WHAT) + experts (WHO) + context (WHY) + mechanical (HOW).

---

## §0 — Core Principle

ZF is not a checkbox at session close. It is a **continuous cycle that runs at every meaningful decision boundary**. The boundary determines the depth.

> **ZF ACHIEVED — THE ONLY VALID DEFINITION (Governor S018 correction — INST-VALD-001):**
> **THE LAST RUN PRODUCING "STATUS: ZF ACHIEVED ✅ — 0 blocking findings remain" IS THE ONLY PROOF.**
> - A run reducing findings from 5 to 2: NOT ZF ACHIEVED
> - A prior session's ZF result cited as current evidence: NOT ZF ACHIEVED (nominal ZF)
> - "Only advisory warnings remain": NOT ZF ACHIEVED (zero BLOCKING is required, not zero advisories)
> - Progress toward zero is not zero. The AI satisfaction point fires at improvement. It is not the proof.
> Re-run is NECESSARY but NOT SUFFICIENT. Zero findings on the last run IS the proof.

Per P-META-021 (Triad): each ZF mandate requires all three layers:
- **Context** (WHY this level at this boundary)
- **Principle** (which P-* governs this boundary)
- **Mechanical** (which tool/hook fires)

**"Completed" means ZF-validated** — not "code is written" or "tests pass." A work unit is COMPLETED when:
1. Its exit criteria are ALL checked (validate-open-plan-levels shows 0 open for this unit)
2. The appropriate ZF level passed (cycle count > 0, exit_code 0)
3. PE engine confirms the next action aligns with current priorities
4. All affecting VLTs are RESOLVED (not just registered)
5. ≥1 positive ZF extract recorded (drift-log / reasoning-patterns / memory / CEC)

---

## §1 — ZF Mandate by Event

### EVENT 1: After each individual commit
```
Level:      1 (COMMIT)
Command:    pnpm zf  [or post-stop-pnpm-verify.sh fires automatically]
Experts:    none (speed is the priority)
Trigger:    post-stop-pnpm-verify.sh (Stop hook — fires after every AI response)
Context:    "This is the first-pass check. Exit code 0 is the minimum. The iteration
            count [ZF-iter-N] shows how many times this session has been validated."
Principle:  P-META-006 (RZF — re-run is the proof)
Mechanical: post-stop-pnpm-verify.sh (ACTIVE)
Blocks:     Nothing proceeds if exit_code ≠ 0
```

### EVENT 2: After each logical step completion
```
Level:      1 (COMMIT)
Same as Event 1 — steps are resolved by commit-level ZF.
```

### EVENT 3: After each PHASE boundary (L1→L2, L2→L3, L3→L4)
```
Level:      2 (PHASE_CLOSE)
Command:    pnpm zf:phase
Experts:    consolidation-expert (what exists that should be reused?)
            PE engine (is next phase still highest priority?)
Trigger:    Required by gradual-build-plan.template.md §0 exit criteria
            post-tool-use-zf-level-gate.sh detects phase-boundary signals
Context:    "Phase advance is a CONSEQUENTIAL decision (hard-to-reverse, affects
            multiple artifacts). Level 2 ZF required. The consolidation-expert
            prevents building what already exists. PE re-assessment prevents
            advancing to L3 when something higher-priority has emerged."
Principle:  B_CONSENSUS_BEFORE_PROCEEDING + P-META-021 (triad for consequential)
Mechanical: gradual-build-plan.template.md §0 exit criteria (template gate)
            post-tool-use-zf-level-gate.sh (PostToolUse hook — detects signals)
Blocks:     Level advance blocked until Level 2 ZF achieved
```

### EVENT 4: After each batch of work
```
Level:      2 (PHASE_CLOSE)
Command:    pnpm zf:phase
A "batch" = a set of related commits that together constitute a coherent deliverable.
Trigger:    When commit message contains phase/batch completion signals
            (e.g., "Phase N complete", "L2 COMPLETE", "DONE")
Context:    "A batch is a mini-phase. Advancing past a batch without Level 2 ZF
            = moving forward on assumed completeness. The instruction-context check
            (part of Level 2) verifies WHY reasoning is present in all new artifacts."
Principle:  P-META-019 (structural prevention) + P-META-021
Mechanical: post-tool-use-zf-level-gate.sh (detects batch signals in file writes)
```

### EVENT 5: When moving to a new chat (cross-chat handoff)
```
Level:      2 (PHASE_CLOSE) + chat-transfer-protocol
Command:    pnpm zf:phase + fill chat-transfer-protocol.template.md
Experts:    none (speed matters for handoffs)
Trigger:    chat-transfer-protocol.template.md Step 0 (mandatory before DECLARE FIRST)
Context:    "Context degrades at chat boundaries faster than anywhere else. Level 2 ZF
            confirms: (1) no blocking findings, (2) extraction check passed (insights
            captured), (3) PE confirms the next chat's mandate. The ZF iter count MUST
            appear in the handoff — it proves the previous chat did real ZF, not nominal."
Principle:  B_MUTUAL_UNDERSTANDING_VALIDATION + P-META-014 + P-META-021
Mechanical: chat-transfer-protocol.template.md (template gate — ZF iter required)
            ZF iter count visible in tracker / systemMessage
```

### EVENT 6: When a PLAN is completed
```
Level:      3 (DEEP)
Command:    pnpm zf:deep
Experts:    cruel-critic (stability + 3 scale questions)
            synergy-master (CSEP — what does this plan's output enhance elsewhere?)
            schema-expert (if plan involved schema changes)
Trigger:    §11 closure attestation cannot be authored until Level 3 ZF passes
            validate-open-plan-levels shows 0 open for ALL levels of this plan
Context:    "A plan closing is the highest-consequence boundary. The cruel-critic
            stress-tests the work before it becomes the foundation for future phases.
            The synergy-master finds opportunities to enhance the platform that would
            be lost if not captured now. Schema expert verifies ZModel/Prisma consistency.
            This is the moment of maximum value extraction — context is fresh, depth is
            highest."
Principle:  P-META-006 (CEC — walk until 0 opportunities) + P-META-021
Mechanical: §11 closure attestation (blocked until Level 3 ZF passes)
            closing-summary-template §10.0m (session extraction mandatory)
            closing-summary-template §10.0 (ZF tracker evidence required)
```

### EVENT 7: At session close
```
Level:      3 (DEEP)
Command:    pnpm zf:deep
Experts:    Same as Event 6
Trigger:    closing-summary-template.md §10.0 (MANDATORY GATE)
Context:    "Session close is the point of maximum context degradation. Whatever
            is not extracted here degrades to a checkbox. The ZF orchestrator
            Level 3 with cruel-critic + synergy-master is the structured extraction
            that the Governor manually led in S014. Now it fires automatically."
Principle:  B_POSITIVE_VALUE_EXTRACTION + P-META-006 + P-META-021
Mechanical: closing-summary §10.0 requires ZF tracker evidence + iter count
```

---

## §2 — Expert Activation Map

| ZF Level | Auto-invoked | Context |
|---|---|---|
| Level 1 (COMMIT) | None | Speed is priority; 35 validators provide breadth |
| Level 2 (PHASE_CLOSE) | PE engine (priority re-assessment) | Phase advance is consequential; PE confirms ordering |
| Level 2 (PHASE_CLOSE) | consolidation-expert (what exists?) | Prevents building what already exists |
| Level 3 (DEEP) | cruel-critic (stability + scale) | 3 scale questions: 30→300 / 10→100 / 1→10 |
| Level 3 (DEEP) | synergy-master (CSEP) | Cross-platform synergy opportunities |
| Level 3 (DEEP) | schema-expert (if schema change) | ZModel vs Prisma vs docs consistency |
| Level 3 (DEEP) | balance-expert (if complexity milestone) | Complexity score at current platform state |

Expert activation is advisory at Level 2 (context injected, AI navigates) and REQUIRED at Level 3 (blocking if skipped on a plan completion).

---

## §3 — "COMPLETED" Definition (ZF-Validated)

A work unit at ANY level is COMPLETED when ALL of the following are true:

```yaml
completion_criteria:
  exit_criteria_all_checked: true          # validate-open-plan-levels shows 0 for this unit
  zf_level_passed:                          # appropriate level ran + passed
    commit: level_1_exit_0
    phase_boundary: level_2_exit_0
    plan_close: level_3_exit_0
  pe_reconfirmed: true                      # PE engine ran after last major change
  vlt_state: all_affecting_vlts_resolved    # PENDING VLTs that affect next phase = blocker
  positive_zf_extracted: true              # ≥1 of: drift-log / reasoning-patterns / memory / CEC / VLT
  iteration_count_gt_0: true               # ZF-iter-N count must be > 0 (at least one real run)
```

NOT completed if:
- Any exit criteria unchecked (even with working code)
- ZF iteration count = 0 (verify was never run)
- PE hasn't re-fired since last major change (consequential decision)
- Any PENDING VLT affects downstream artifacts

---

## §4 — ZF Level Reference

| Level | Command | Duration | When mandatory | Experts |
|---|---|---|---|---|
| 1 COMMIT | `pnpm zf` | ~10s | After every commit, every step | None |
| 2 PHASE_CLOSE | `pnpm zf:phase` | ~60s | Phase boundary, batch, chat transfer | PE engine, consolidation-expert |
| 3 DEEP | `pnpm zf:deep` | ~5min | Plan complete, session close | cruel-critic, synergy-master, schema-expert |

---

## §5 — Mechanical Enforcement Map

| Event | Hook/Tool | Status | Blocks |
|---|---|---|---|
| After commit | post-stop-pnpm-verify.sh | ✅ ACTIVE | Blocks on failure |
| Phase boundary | post-tool-use-zf-level-gate.sh | ✅ ACTIVE | Injects Level 2 requirement |
| Chat transfer | chat-transfer-protocol.template.md Step 0 | ✅ ACTIVE | Template gate |
| Plan complete | gradual-build-plan.template.md §11 | ✅ ACTIVE | §11 blocked until Level 3 |
| Session close | closing-summary-template §10.0 | ✅ ACTIVE | Evidence required |
| Level 2 PE | zf-orchestrator.mjs Level 2 | ✅ ACTIVE | PE check in cycle |
| Level 3 skills | zf-orchestrator.mjs Level 3 | 🔶 ADVISORY | Surface findings (skill invocation is manual) |

---

## §6 — Tracker Integration

`tools/zf-session-tracker.json` persists within session:
- `verify_runs`: total Level 1 iterations
- `orchestrator_cycles`: total orchestrator cycles
- `blocking_found_total`: total blocking findings addressed
- `orchestrator_last_status`: ZF_ACHIEVED | ZF_ACHIEVED_WITH_ADVISORIES | BLOCKING_REMAINS

The tracker is displayed at session activation (session-open.sh) and included in every ZF report (post-stop-pnpm-verify.sh `[ZF-iter-N]` prefix).
