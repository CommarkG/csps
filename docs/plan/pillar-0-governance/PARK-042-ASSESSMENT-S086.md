---
id: csps.docs.plan.pillar-0-governance.PARK-042-ASSESSMENT-S086
name: PARK-042-ASSESSMENT-S086
description: "2-page assessment of PARK-042 (Claude Code usage review + session/work orchestrator). Sonnet S086, per Opus #25 directive item 5."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
diataxis_type: explanation
schema_anchor: pillar_0_governance_leaves
impl_status: swift-implemented
session: S086
created: "2026-06-21"
links:
  - { rel: park-register, href: ../../../tools/data/park-register.yaml#PARK-S084-042 }
  - { rel: cross-link-A, href: park-register.yaml#PARK-S084-040 }
  - { rel: cross-link-B, href: park-register.yaml#PARK-S084-043 }
---

# PARK-042 ASSESSMENT — Claude Code Usage Review + Session/Work Orchestrator
## S086 | Sonnet assessment per Opus #25 directive item 5

---

## 1. WHAT THE PARK SAYS

Governor S084 observed, from live Claude Code usage insights, that:
- **86%** of usage occurs at >150k context — long sessions, even when cached, drive cost
- **26%** from subagent-heavy sessions — each subagent spawn = own request quota
- **24%** while 4+ sessions ran in parallel — all share ONE usage limit simultaneously

The hypothesis: a **CSPS session/work orchestrator** that (1) routes each work-unit to the cheapest capable team member, (2) manages context lifecycle automatically (/compact at IMPL_BATCH boundary), (3) queues parallel sessions instead of 4+ concurrent, (4) defers MCP and restricts tools per tab, (5) schedules cadence-ladder audits.

---

## 2. CONTEXT MAP (what already exists)

| Component | What it does | Status |
|-----------|-------------|--------|
| `B_TOKEN_BUDGET` (T1+T2+T3) | Token-efficiency guardian — fires on context pressure | LIVE S084 |
| `user-prompt-submit-context-orchestrator.sh` | Parks-aware build-intent gate — reads parks/plan signals before new builds | LIVE S086 |
| `tools/pe-compute.mjs --parks-context` | Reads 4 signals (parks/improvement-register/plan-levels/consolidation) | LIVE S086 |
| `haiku-spawn-template.md` | Context-budget gate before any spawn | LIVE S020/S086 |
| `PARK-040` (Learning Orchestrator) | Self-improvement loop (same route→gate→verify shape, learns from outcomes) | OPEN |
| `PARK-043` (journey-as-container) | Journey gates that make phases structural (the work BEING orchestrated) | OPEN, build B5/B6 post db-push |
| `PARK-045` (compact-vs-new-tab) | When to /compact vs new-tab (Sonnet research pending) | OPEN |

**Key overlap**: The "orchestrator" in PARK-042 is the SAME shape as the journey orchestrator (PARK-043) applied to OUR OWN tool usage — the difference is the subject (user work vs. CSPS team's own work process).

---

## 3. ASSESSMENT: BUILD vs NOT-BUILD

### Build case (HIGH)
- The 3 measured cost drivers (>150k, subagent-heavy, 4+ parallel) are real and recurring
- The orchestrator directly addresses each:
  - >150k → auto-/compact at IMPL_BATCH; auto-new-tab at role-change/arc-end
  - subagent-heavy → context-budget gate already forces spawn-vs-inline discipline; orchestrator ensures cheaper model routing
  - 4+ parallel → explicit queue: queue-until-slot-open vs launch-all-now
- The routing table (Haiku=scan, Sonnet=build, Opus=architect) is ALREADY the measured team envelope — orchestrator codifies what's already known
- Cost: relatively small build (config + session-open check + one hook extension + compact-vs-new-tab mechanism from PARK-045)

### Hold case (MEDIUM)
- **Sequencing dependency**: PARK-043 (journey-as-container) defines WHAT WORK is being routed. Building 042 before 043 is routing without a container — the router has no slots to put work into.
- **PARK-045 (compact-vs-new-tab) must land first**: the context lifecycle management arm of 042 IS 045. Build 045's mechanism, fold it into 042's lifecycle management.
- **PARK-040 (Learning Orchestrator) is the parent**: 042 is the "session routing" face of the same arc; 040 is the "what did we learn, update the routing rules" arm. Build 042 so it feeds 040's outcome data.

### Risk
- **Overengineering risk**: An orchestrator that requires human approval for every routing decision defeats the purpose. Must be default-silent with override capability.
- **MCP-deferral complexity**: Restricting tools per tab requires settings-level changes at session-open (not mid-session). The `settings.json never mid-session` rule (HARDWIRE) means this must be session-open only.
- **Measurement gap**: Without a before/after baseline, "improved cost+quality" is unmeasurable. The live Claude Code usage insights MUST be the before-metric.

---

## 4. RECOMMENDED BUILD PATH (PCR)

### Option A — SWIFT NOW: wire the high-leverage pieces
**Build**: (1) compact-vs-new-tab 3-step mechanism (PARK-045 research → fold into B_TOKEN_BUDGET R3/R4); (2) extend parks-context gate to surface the 3 measured cost signals in session-open advisory; (3) document the routing table (team envelope) as a session-open card, not a runtime gate.  
**Blast**: LOW (B_TOKEN_BUDGET extension + session-open advisory text). Fully reversible. No new hooks.  
**When**: NOW (parallel with PARK-043 foundation build).

### Option B — BUILD AFTER PARK-043 (Recommended)
**Build**: Full session/work orchestrator after PARK-043 installs the journey-gate nervous system. The orchestrator = (a) session-open routing table loaded from team-envelope config, (b) auto-/compact trigger at IMPL_BATCH, (c) queue advisory when 4+ sessions flagged, (d) Haiku-vs-Sonnet routing suggestion based on task-class (non-blocking).  
**Blast**: MEDIUM (1 new session-open hook, 1 config file, extension of context-orchestrator). Reversible (hooks are advisory first).  
**When**: B5/B6 slot (post PARK-009 db-push, post PARK-043 journey-gate).

### Option C — Full meta-orchestrator (DEFERRED)
Full runtime orchestrator with tool-surface management, MCP per-tab restriction, parallel-session queue management. Requires settings-level architecture (beyond hooks).  
**When**: After B → C escalation triggered by recurring subagent overflows or 4+ parallel incidents.

**RECOMMENDATION**: **Option A immediately + Option B after PARK-043**. The SWIFT now prevents cost drift while the full orchestrator waits for its container (PARK-043). Option C is the escalation trigger if B proves insufficient.

**Flip condition to Option C**: If subagent overflows or 4+ parallel incidents recur K≥3 after Option B is built → escalate to full meta-orchestrator with tool-surface management.

---

## 5. WHAT THIS ASSESSMENT PRODUCES FOR OPUS

**AQ1**: Is the 2-step recommendation (A now, B after PARK-043) ratified? Or does Opus want the full Option C fast-tracked?

**AQ2**: Should PARK-045 (compact-vs-new-tab) be treated as a prerequisite sub-task of PARK-042 Option A, or a separate close-first item?

**AQ3**: Should the routing table (Haiku=scan/Sonnet=build/Opus=architect) be codified as a config file in tools/config/ (machine-readable) or as a session-open text card (human-readable)?

---

*PARK-042 Assessment v1.0 | S086 | Sonnet | FOR: Opus-N + Governor review*
