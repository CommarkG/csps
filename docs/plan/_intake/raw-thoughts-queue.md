---
id: csps.intake.queue.raw-thoughts
name: raw-thoughts-queue
description: Lightweight append-only capture for raw AI/Governor thoughts mid-session. Processed at plan completion via PE-FULL. Each item becomes a VLT, EXT-ID, topic-plan item, or is discarded with reason.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: intake
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
session: S015
consolidation_cross_refs:
  - docs/plan/_intake/contexts/INDEX.md
  - tools/templates/priority-engine.schema.yaml
  - tools/validators/validate-phase-exit-criteria.mjs
domain_path: platform
---

# Raw Thoughts Queue

**Purpose:** Mid-session ideas that don't belong in current focus. Append freely. Process at plan completion.

**Processing trigger (planned — VLT-S015-RAW-THOUGHTS):**
When `validate-phase-exit-criteria.mjs` transitions a plan from BLOCKING → CLEAN (plan completion event),
PE-FULL fires and includes this queue. Each item is promoted or discarded before the next plan opens.

**Format per item:**
```
- [S<NNN>-<date>] <raw thought> → STATUS: PENDING|PROMOTED→<artifact>|DISCARDED:<reason>
```

---

## Queue

- [S015-2026-05-07] Should the PE engine mechanically enforce processing raw thoughts once a plan is done? → STATUS: PROMOTED → VLT-S015-RAW-THOUGHTS (mechanical PE trigger on plan completion — design next session)

- [S015-2026-05-07] slim-handoff skill Zone A template needs §CORE-PILLARS section — currently only in AGENTS.md hard NO, not in the template itself → STATUS: PENDING — carry to S016 (deferred per diff-before-write rule, needs .claude/skills/ update)

- [S015-2026-05-07] Stale plan alignment gate Phase 2: integrate validate-plan-age-alignment.mjs with plan-coverage-gate.sh so writes to paths covered by STALE plans require alignment_verified_session before proceeding → STATUS: PENDING — carry to S016 (Phase 1 WARN shipped S015; Phase 2 = hard gate integration)

- [S015-2026-05-07] 6 stale plans (s006/s007/s008/s011/s013) need per-plan alignment audit — go through each [ ] item: DONE/STALE/VALID classification. Estimated: 40-70 items already done, ~30-40 genuinely open. Must complete before executing items from those plans → STATUS: PROMOTED→DONE (alignment audit completed S015 — 46 items closed, open count 111→54)

- [S015-2026-05-07] PE computation is still in-head (not mechanical). pe-compute.mjs runs only as syntax check in verify. Full PE scoring validator needed. → STATUS: PENDING — carry to S016 (Crack #9 from freestyling analysis, Band 3)

- [S015-2026-05-07] VAULT: B_HUMBLE_EXECUTOR full behavioral contract — closed-circle milestone fires Extract→Vault | Validate assumptions | PE re-assess | Decide continue/stop. Fires at every phase gate in 1M window, not just session close. → STATUS: PENDING — S016 L2 primary (plan-methodology-v2.md §2)

- [S015-2026-05-07] VAULT: B_AUTONOMOUS_BATCH_WITH_PREFLIGHT — pre-flight format: scope + questions (0=run now) + defaults applied. Batch ≥4 files triggers pre-flight. Modes: velocity/balanced/deep_quality. → STATUS: PENDING — S016 L2

- [S015-2026-05-07] VAULT: Chat State Snapshot template — intra-session boundary (lighter than HANDOFF). Captures: active plan + phase + vault collected + open pre-flight Qs + assumption status + next step. Fires when context < 25% OR phase gate. → STATUS: PENDING — S016 L2 (tools/templates/chat-state-snapshot.template.md)

- [S015-2026-05-07] VAULT: Assumption block template in gradual-build-plan — each L<N> section gets ASSUMPTION blocks for consequential decisions: Context | Chosen | Reasoning | Alternatives | Falsified by | If falsified | Consensus. → STATUS: PENDING — S016 L2-L3

- [S015-2026-05-07] VAULT: slim-handoff Zone A §CORE-PILLARS table — 5 spine statuses + FOUNDATION_EXIT_GATE result. Currently only in AGENTS.md hard NO. Needs .claude/skills/ update (diff-before-write discipline required). → STATUS: PENDING — S016

- [S015-2026-05-07] VAULT: validate-plan-harvest-coverage.mjs + validate-execution-mode-declared.mjs — implement the 2 L3 validators registered in audit-runner.md S015 (deferred week-4). → STATUS: PENDING — S016 L3

- [S015-2026-05-07] VAULT: Orchestrator mode-selection automation — reads plan type + phase + complexity → auto-selects mode + routes model. Foundational work: B_HUMBLE_EXECUTOR + B_AUTONOMOUS_BATCH must be engraved first. → STATUS: PENDING — S016-S017 (do not start without foundation)

- [S016-2026-05-07] VAULT: CDAB — Context Driven AI Behavior formalization. Name canonicalized in csps-core-manifest.md. Three investments to make CDAB real: (1) MCP extension: get_context(decision_type) — decision-relevant context on-demand, verifiable via tool history (S018); (2) inner-ai-defaults discipline: add disposition: field to all 7 files missing it (S016 L3); (3) context-sensitive-rule-coverage validator implementation (already registered, deferred week-4). Cruel assessment: 30% real today, 80% real when MCP wired. The 70% advisory surfaces are overhead without quality unless MCP closes the gap. → STATUS: PENDING — S017 MCP extension planning

- [S016-2026-05-07] VAULT: VLT-S016-ZENSTACK RESOLVED (Option A). S017 mandate = ZenStack install + RLS + foundation-slices L3 closure. This is the bedrock Layer 2 completion session. → STATUS: PROMOTED — S017 mandate (see session-state.json)


---

## Processing Protocol (for AI at plan completion)

1. Read all PENDING items
2. For each: PE-score it. Does it belong in current session work?
   - YES (Band 1-2): promote to VLT or topic-plan item, mark PROMOTED
   - NO (Band 3-4): vault with explicit DEFERRED reason, mark DISCARDED
3. No item stays PENDING at plan close — every item gets a decision
4. After processing: clear PROMOTED/DISCARDED items (keep only PENDING for next session)

---

## S025 AUDIT — Opus Turn 10 Protocol (A/B/C/D Classification)

Classification date: 2026-05-12 | Protocol: Opus Turn 10 — classify, do not close unilaterally
A=superseded | B=active+arc plan | C=active+needs Opus | D=ambiguous

| ID | Item | Class | Evidence/PE/Trigger |
|---|---|---|---|
| S015-01 | slim-handoff §CORE-PILLARS in SKILL.md | **D** | Unclear if .claude/skills/slim-handoff/SKILL.md updated; needs verification before closing | pe: 35, trigger: S026 audit |
| S015-02 | Stale plan alignment Phase 2 gate | **B** | Phase 1 shipped; Phase 2 integration not done | pe: 55, S027 |
| S015-03 | PE computation mechanical | **A** | validate-pe-dashboard.mjs (S025, commit b8dbc92) makes PE mechanical | closed_by: b8dbc92 |
| S015-04 | B_HUMBLE_EXECUTOR full contract | **A** | behavioral-contracts.md §B_HUMBLE_EXECUTOR complete (ASSUMPTION CHECK + INTENT DRIFT CHECK S024 + Q-CRYSTALLIZED S025) | closed_by: behavioral-contracts.md |
| S015-05 | B_AUTONOMOUS_BATCH_WITH_PREFLIGHT | **A** | behavioral-contracts.md §B_AUTONOMOUS_BATCH_WITH_PREFLIGHT complete with Q-GATE+Q-COMPLETE+Q-GLOBAL+Q-INITIATED+Q-CRYSTALLIZED | closed_by: behavioral-contracts.md |
| S015-06 | Chat State Snapshot template | **A** | tools/templates/chat-state-snapshot.template.md exists | closed_by: template exists |
| S015-07 | Assumption block in gradual-build-plan | **B** | §0a INTENT CRYSTALLIZATION done (S025) but specific ASSUMPTION BLOCK per L<N> not yet added | pe: 45, S026 |
| S015-08 | slim-handoff Zone A §CORE-PILLARS table (duplicate) | **D** | Duplicate of S015-01; same uncertainty | pe: 35, S026 combined |
| S015-09 | validate-plan-harvest-coverage + execution-mode validators | **B** | Registered in audit-runner.md but not built | pe: 40, S027 |
| S015-10 | Orchestrator mode-selection automation | **C** | Foundation ready (S025). Mode-selection design needed. Needs Opus express review before design | pe: 65, S026 Opus L1 |
| S015-11 | CDAB formalization | **C** | P-META-017 + registry exist. MCP get_context NOT built. Enforcement rate 31%. Needs Opus review | pe: 60, S026 Opus L1 |

**Summary:** A=4 (closed) | B=3 (in arc plan, assign S026-S027) | C=2 (Opus express needed) | D=2 (verify before action)

**Opus reviews C+D items in Turn 11 (express format — 5 lines per item).**
