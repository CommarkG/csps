---
id: csps.handoff.vault.opus-synthesis-prompt-s011
name: opus-synthesis-prompt-S011
description: Improved Opus 4.7 synthesis prompt for S011 session review. Use after switching to Opus 4.7 via `/model default`. This is a cross-session architectural coherence review — the kind that requires full reasoning capacity (QG1 immutable).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
domain_path: platform
---

# Opus 4.7 Synthesis Prompt — S011 Session Review

> ⚠️ **CRITICAL — FOR REAL OPUS 4.7 ONLY.** Do NOT run this with Sonnet simulating Opus. Do NOT ask Sonnet to "play along" as Opus. This prompt is designed for a NEW CHAT opened with `/model default` (or explicit model selection) confirming Opus 4.7 is the running model. If you are Sonnet: use `internal-deep-review` skill instead and label output clearly as `[INTERNAL_DEEP_REVIEW — Sonnet]`. AI impersonating Opus = EP-014 violation = B_NO_AI_IMPERSONATION violation. Per S011 critical incident.
>
> **Verification:** Before pasting this prompt, confirm you see "Opus 4.7" in the model indicator. If you see Sonnet: stop, close, open new chat.
>
> Copy this entire block into a new Opus 4.7 session after running `/model default`.

---

```
You are performing a deep architectural synthesis review of CSPS (CoreSights Platform Solutions) after a major session (S011). You are Opus 4.7 — this is exactly the work-class (cross-session synthesis + architectural coherence + honest critique) that requires your full reasoning capacity per QG1.

## What was built in S011 (one extended chat)

SCALE: ~30 commits, 50+ artifacts, this is the single most productive session in the platform's history.

FOUNDATION:
- Phase 8 COMPLETE: principles-mcp slice-reading (L1 ~200 tokens vs 85K monolith, 425× reduction)
- Phase 9 COMPLETE: validate-token-budget.mjs + pe-compute.mjs + schema-index.md + validate-corespine-depth-markers
- Phase 10 deferred to S012

GOVERNANCE LAYER (major additions):
- B_KNOW_HOW_DISCIPLINE 5/5 FSE: 7 error patterns (EP-001→EP-012) + 3 checklists + know-how-extractor.mjs
- 2 topic-plans resurrected: zero-laptop-dependency (L1 ✅) + unified-intake (L2+L3 ✅)
- Construction gate: validate-no-implementation-without-plan.mjs
- Foundation slices topic-plan: foundation-slices.md ratified

COUNCIL (24 expert skills):
- New: synergy-master + cruel-critic + consolidation-expert + bottleneck-expert + ux-expert + schema-expert + core-spine-expert
- All 24 AAP-aligned + council-registry.md updated
- validate-council-coverage.mjs: catches new skills without registration

VALIDATORS (29 active in pnpm verify, was 9 at S010 close):
Key new ones: validate-rzf-evidence + validate-slice-freshness + validate-topic-plan-progress + validate-impl-status + validate-moat-coverage + validate-audit-health + validate-universal-alignment + validate-import-quarantine + validate-nothing-stands-alone + validate-council-coverage + more

MOAT REGISTRY (18 elements, was 3 at S006 close):
M-01 through M-18 including: ZF moat + Core Cross-Synergy + Threshold Gate + Reuse-First mechanical + Connectivity enforcement

VAULT SYSTEM: vault-methodology.md + vault_pending field + question_register + SG-NNN (2 success patterns)

## Your synthesis tasks

### 1. Architectural coherence (15 minutes of honest thinking)
Does the 18-element moat form a coherent organism or are there contradictions?
Specifically: does the Council (24 skills) + Threshold Gate + Validators + Moat all compose cleanly, or are there competing/overlapping responsibilities?

### 2. Over-engineering detection (cruel-critic lens)
Apply the 5 cruel-critic amendments:
- Which claims are ESTIMATED not verified? (e.g., 425× token reduction — has this been measured in CSPS or just inherited from CSP estimates?)
- What happens when verify.mjs has 100 validators instead of 29? Does the O(N) scan still work?
- The council has 24 members. At 50 members, does context-orchestrator.sh keyword matching remain accurate?

### 3. The single most important gap
After reviewing everything, what is the ONE thing that, if left unaddressed, would most limit S012's ability to build foundation slices and deliver real product value?

### 4. Foundation slices readiness
Given the governance platform state, is CSPS ready to build User/Tenant/AuditEvent in libs/policies/? What prerequisite decisions are still open? (Hint: VLT-S011-003 and VLT-S011-004 in foundation-slices.md)

### 5. What should NOT be in S012
Given the scope of S011, what governance work should S012 EXPLICITLY EXCLUDE to stay focused on foundation slices? What would P-OP-002 (FWWS) say?

### 6. The Vault → Impact problem
7 types of vault items were created. What is the risk that they accumulate as governance debt without producing real platform improvements? What single mechanical change would most improve vault conversion rate?

### 7. Incremental auditing recommendation
29 validators currently scan similar content on every verify run. Industry practice: delta-based auditing (only re-run what changed). How should CSPS implement this? What's the right fingerprinting strategy for the CSPS governance artifact types?

## Expected output format
1. Coherence verdict: COHERENT | PARTIAL | FRAGMENTED (with specific evidence)
2. Top 3 over-engineering risks (with cruel-critic scores 1-5)
3. Single most important gap (one sentence, specific)
4. Foundation slices readiness: READY | CONDITIONAL (with blockers)
5. S012 explicit exclusion list (5-7 items)
6. Vault conversion fix (one mechanical change)
7. Incremental auditing recommendation (specific design, not general principles)
```
