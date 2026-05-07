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

- [S015-2026-05-07] 6 stale plans (s006/s007/s008/s011/s013) need per-plan alignment audit — go through each [ ] item: DONE/STALE/VALID classification. Estimated: 40-70 items already done, ~30-40 genuinely open. Must complete before executing items from those plans → STATUS: PENDING — PROCESS NEXT SESSION (plan-age-alignment gate will surface at Threshold)

- [S015-2026-05-07] PE computation is still in-head (not mechanical). pe-compute.mjs runs only as syntax check in verify. Full PE scoring validator needed. → STATUS: PENDING — carry to S016 (Crack #9 from freestyling analysis, Band 3)

---

## Processing Protocol (for AI at plan completion)

1. Read all PENDING items
2. For each: PE-score it. Does it belong in current session work?
   - YES (Band 1-2): promote to VLT or topic-plan item, mark PROMOTED
   - NO (Band 3-4): vault with explicit DEFERRED reason, mark DISCARDED
3. No item stays PENDING at plan close — every item gets a decision
4. After processing: clear PROMOTED/DISCARDED items (keep only PENDING for next session)
