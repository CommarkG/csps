---
id: csps.platform-audit.service.pe-dashboard
name: pe-dashboard
description: >
  Priority Engine live dashboard. Shows Internal PE (platform development sequencing)
  vs External PE (user value sequencing for apps). The PE is the MAIN REFERENCE POINT
  for all platform development decisions. Updated per session by Sonnet; reviewed by
  Opus at each council session. Connected to: all gradual bundling elements, depth
  levels, core spiral cycles, humble batching, simulation scenarios.
version: 1.0
lifecycle: production
lifecycle_state: active
owner: group:finky
core_spine: GVRN
schema_anchor: platform_audit
session: S021
domain_path: platform
impl_status: swift-implemented
tags:
  - domain:governance
  - domain:platform
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
links:
  - { rel: parent, href: ../README.md }
  - { rel: pe-service, href: ./priority-engine.md }
  - { rel: pe-compute, href: ../../../../tools/pe-compute.mjs }
  - { rel: gradual-bundling-validator, href: ../../../../tools/validators/validate-gradual-bundling.mjs }
  - { rel: backlog, href: ../../../../tools/config/platform-update-backlog.yaml }
---

# Priority Engine Dashboard
## The MAIN Reference Point for ALL Development Decisions

---

> **This dashboard is the entry point for every session.**
> Before executing any work: check which PE mode is active, what the top items are,
> and which bundling constraints apply. The PE governs everything.

---

## §1 — The Two PE Systems (Critical Distinction)

CSPS serves two distinct populations simultaneously. The PE must serve both —
with different formulas because they have different value functions.

### Internal PE (Platform Development Sequencing)

**WHO:** The Governor and AI models building the platform
**WHAT:** Governance, schema, validators, behavioral contracts, infrastructure
**GOAL:** Platform completeness — every capability that apps inherit automatically

```
Internal_PE = (Work_PE × composition_weight) × Execution_PE × Model_PE × escalation

Work_PE = breadth × depth × impact ÷ dep_satisfied ÷ multi_session_cost
        × 1.5 if active_work_completion > 50%   [B_COMPLETION_OVER_SHINY]
        × 0   if BLOCKING_VLT_open              [emergency-mode override]
```

**Internal PE Compositions (when to use each):**
- `governance-mode`: GVRN × 2.0 — ratifications, VLT resolutions, council sessions
- `build-mode`: ARCH × 2.0 — schema, validators, code, hooks
- `growth-mode`: OPER × 2.0 — new app builds, graduation, deployment
- `emergency-mode`: BLOCKING × ∞ — anything with a pending BLOCKING VLT

---

### External PE (User Value Sequencing for Apps)

**WHO:** End users of apps built on CSPS
**WHAT:** Features, domains, UX, integrations — what users actually experience
**GOAL:** User value delivery — the closest path from current state to "user feels value"

```
External_PE = (User_Value × Domain_Criticality)
            × (Urgency_Score × Dependency_Unlock)
            × Persona_Breadth

User_Value:       ccat_why score (1-5) from simulation + real user feedback
Domain_Criticality: T1=3.0 (HIPAA/COPPA) | T2=2.0 (business-critical) | T3=1.0
Urgency_Score:    Legal=5 (GDPR/COPPA) | User-requested=3 | Nice-to-have=1
Dependency_Unlock: number of simulation scenarios unblocked by this feature
Persona_Breadth:  number of persona_target types served (1-7)
```

**External PE Compositions:**
- `user-value-mode`: User_Value × 2.0 — features directly creating user moments
- `compliance-mode`: Urgency × ∞ — GDPR, HIPAA, COPPA blockers
- `onboarding-mode`: Persona_Breadth × 2.0 — features that unlock more user types
- `cross-domain-mode`: Dependency_Unlock × 2.0 — features enabling WisdomVault insights

---

### How Internal and External PE Connect

```
External_PE identifies → what features users need most
     ↓ informs ↓
Internal_PE sequences → what platform capabilities to build first
     ↓ enables ↓
External_PE delivers → user value at higher rate
```

**The bridge:** Simulation scenarios are the translation layer.
Each simulation scenario defines: what platform capabilities (Internal PE items)
are on the critical path to a specific user value (External PE item).

---

## §2 — Gradual Bundling Integration (All 7 Elements)

The PE is not just a ranking — it governs HOW work is done, not just WHAT.

### Element 1: Depth Levels (L1/L2/L3)
**PE rule:** L<N+1> work CANNOT score PE > 0 until L<N> reaches ZF.
Foundation items (L1) always outrank feature items (L3) unless L1 is ZF-complete.

```
depth_pe_multiplier:
  L1 items: × 2.0 when L0 is ZF
  L2 items: × 1.5 when L1 is ZF
  L3 items: × 1.0 when L2 is ZF
  L(N+1) items when L(N) is incomplete: × 0 (blocked)
```

### Element 2: Humble Batching (B_HUMBLE_EXECUTOR)
**PE rule:** A session batch is limited to ≤3 P1 items unless composition rationale is explicit.
- Same session = related items only (serve each other's outputs)
- Cross-session = any combination, but CCAT WHEN must be satisfied
- Unrelated P1 items from different spines = separate sessions

### Element 3: Core Spiral Cycles
**PE rule:** Each spiral cycle must complete (ZF + CEC extract + engrave) before the next cycle begins.
The spiral position IS the PE context:
```
SPIRAL POSITION → PE IMPLICATION
  "designing L1" → L1 design tasks get highest PE
  "L1 ZF in progress" → ZF tasks get emergency-mode PE
  "L1 ZF complete, extracting" → CEC extraction tasks get governance-mode PE
  "engraving" → FSE tasks get build-mode PE
  "advancing to L2" → L2 design tasks get new cycle PE
```

### Element 4: Gradual Execution Protocol
**PE rule:** No enforce_stage: full can begin until enforce_stage: stage-1-complete.
- Stage 1 completion evidence = specific THIS-SESSION tool output
- Stage 1 in progress = item gets governance-mode PE (urgent to close)
- Stage 1 not started = item gets lower PE despite high importance score

### Element 5: ZF Levels (L1/L2/L3)
**PE rule:** ZF level determines session close eligibility.
- ZF Level 1 (pnpm verify): required for every commit
- ZF Level 2 (per-phase): required at phase boundaries
- ZF Level 3 (per-session deep): required at session close — no exception

### Element 6: B_COMPLETION_OVER_SHINY
**PE rule:** Work >50% complete scores 1.5× PE multiplier.
Near-complete items ALWAYS outrank new items unless the new item is BLOCKING.
This prevents the platform from accumulating 12 half-done features.

### Element 7: Simulation-ZF Gate
**PE rule (new):** No domain schema can reach `implementing` status until its simulation scenario achieves Simulation-ZF (0 gaps found).
```
simulation_zf_pe_multiplier:
  Simulation not run → item cannot advance past ratified
  Simulation gaps found → item PE = 0 until gaps remediated
  Simulation-ZF achieved → item PE calculated normally
```

---

## §3 — Current PE State (Updated per Session)

*This section is updated by Sonnet at each session close. Governor reviews at council sessions.*

### Session S021 PE State

**Internal PE — Top Items:**

| Rank | Item | PE Score | Composition | Blocked By |
|------|------|----------|-------------|------------|
| 1 | Live DB connection (Session 1) | ∞ | emergency | Supabase credentials (Governor) |
| 2 | GDPR erasure service | HIGH | build | None |
| 3 | Domain taxonomy VLT ratification | HIGH | governance | Governor decision |
| 4 | AppendOnlyBase + schema | HIGH | build | Must precede live DB |
| 5 | Security classification doc | MEDIUM | build | None |

**External PE — Top Items (User Value):**

| Rank | Feature | External PE | Urgency | Unblocks |
|------|---------|-------------|---------|----------|
| 1 | GDPR erasure path | ∞ (Legal) | Legal=5 | EU market |
| 2 | Post-signup redirect (minimal UX) | HIGH | User=4 | First user retention |
| 3 | Personal health domain | HIGH | User_Value=5 | WisdomVault critical path |
| 4 | Family domain (couple/children) | MEDIUM | User_Value=4 | 20-year retention |
| 5 | Cross-domain insight (sleep+work) | HIGH | User_Value=5 | WisdomVault differentiation |

**Active Composition Mode:** emergency-mode (Session 1 = live DB = highest priority)

**Core Spiral Position:** Design phase complete (S019-S021). L1 design ZF achieved.
Advancing to L2 operational (Session 1 = first L2 real-world test).

**Bundle Composition (this session):**
- Item 1: AppendOnlyBase (Step 1a in Session 1)
- Item 2: pnpm db:push (Session 1 Step 2)
- Rationale: Items 1+2 share a dependency chain; Item 1 must complete before Item 2 starts.
- Max batch: 2 items (both must ZF before session closes)

---

## §4 — How Opus Elements Reach Sonnet Automatically

The Governor asked that Opus-designed elements be used by Sonnet automatically, without reminders.

**Mechanical routing (currently wired):**
```
session-open.sh → surfaces:
  ✓ Session mandate (from session-state.json)
  ✓ Opus audit countdown (sessions_since_opus_review)
  ✓ Enforcement rate (validate-inner-ai-defaults-enforcement-rate.mjs)
  ✓ S020 task list path
  ✓ Mental models path (sonnet-inheritance-model-S019.md)
  ✓ Council status (council-state.json)
  ✓ Research registry (validate-research-reuse.mjs output)
  ✓ Backlog summary (validate-update-backlog.mjs output)

pnpm verify → surfaces:
  ✓ Enforcement rate (every run)
  ✓ Drift coverage (every run)
  ✓ Opus audit due (every run)
  ✓ Update backlog (every run)
  ✓ Gradual bundling check (NEW — validate-gradual-bundling.mjs)
  ✓ Research reuse (every run)
  ✓ Naming convention (every run)
  ✓ Completion circle (every run)
```

**Mechanical routing (to be wired — auto-applied without reminders):**
```
pre-tool-use-plan-coverage-gate.sh → ENHANCE to include:
  ☐ CCAT check (5-W before any plan is authored)
  ☐ Research registry keyword query (check before research is commissioned)
  ☐ Depth level declaration (what L-level is this plan working at?)
  ☐ Bundle composition check (is this batch >3 P1 items?)

session-open.sh → ADD:
  ☐ Simulation scenario recommendation (most relevant for this session)
  ☐ PE composition mode suggestion (based on current backlog state)
  ☐ Depth level for this session
```

---

## §5 — PE Dashboard Update Protocol

**Who updates:** Sonnet updates §3 at each session close.
**Who reviews:** Opus reviews at each council session (level-2 council or above).
**Trigger for update:** At session close, before handoff is written.

**Update checklist:**
```
□ Update "Top Internal PE items" table (top 5 from backlog P1 items)
□ Update "Top External PE items" table (top 5 from simulation scenarios)
□ Update "Active Composition Mode" (based on highest-priority item)
□ Update "Core Spiral Position" (which phase of the spiral?)
□ Update "Bundle Composition" (what's in scope for next session?)
□ Increment sessions_since_opus_review in session-state.json
□ Record new simulation scenarios run and their Simulation-ZF status
```

---

*This dashboard is the PE's operational interface. It is always current.*
*S021 | 2026-05-09 | Updated per session by Sonnet, reviewed by Opus.*
