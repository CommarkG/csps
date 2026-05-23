---
id: csps.pillar-0-governance.platform-maturation-plan
name: platform-maturation-plan
description: Comprehensive CSPS platform maturation plan covering AI behavior optimization, balance/anti-overengineering, gradual discipline gaps, splitting trigger audit, model routing formalization, and the AI-as-collaborator vs AI-as-tool distinction. Produced after S011 deep review. Inputs: S011 synthesis + Sonnet 4.6 architectural review. For Opus 4.7 validation use opus-synthesis-prompt-S011.md.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
impl_status: swift-implemented
template_used: pillar-leaf
template_status: stable
core_spine: GVRN
core_spines: [GVRN, AI, OPER, VALD, ARCH]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - domain:ai
  - type:how-to
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: how-to
session: S011
file_depth_markers:
  l1_lines: "1-80"
  l2_lines: "81-200"
  l3_lines: "201-end"
  read_protocol: "L1 = plan summary + 6 workstreams. L2 = per-workstream detail. L3 = implementation specs."
links:
  - { rel: parent, href: ./README.md }
  - { rel: system-health-plan, href: ./system-health-plan.md }
  - { rel: council-registry, href: ./council-registry.md }
  - { rel: moat-registry, href: ./moat-registry.md }
  - { rel: qc-coverage-map, href: ./qc-coverage-map.md }
  - { rel: ai-behavior, href: ../../../docs/plan/pillar-0-governance/ai-behavior-spine.md }
  - { rel: inner-ai-defaults, href: ../_handoff/VAULT/inner-ai-defaults/README.md }
  - { rel: opus-synthesis, href: ../_handoff/VAULT/opus-synthesis-prompt-S011.md }
domain_path: platform
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# Platform Maturation Plan — CSPS

> **The "grow with integrity" plan.** After S011's unprecedented scope (29 validators, 24 skills, 18 moat elements, 50+ artifacts), this plan ensures the platform deepens what it has rather than continuing to expand outward. The Balance Expert is its enforcement mechanism.

## §1 — The honest audit (what S011 found)

### What's solid
- ZF moat (RZF + CEC + per-session) — tight, self-consistent
- EP-NNN/SG-NNN — symmetric, growing correctly
- Validator pipeline — 29 validators with audit-slug-coverage enforcing registration
- Council (24 skills) — all AAP-aligned, coverage validator active

### What's fragile
1. **AI defaults registry is STATIC** — inner-ai-defaults/ was written at S006. Claude 4.6→4.7 model updates change defaults. No validator checks if the registry is stale.
2. **Gradual discipline applies to plans, not to platform complexity** — B_GRADUAL_BUILD_BY_FOUNDATIONS governs multi-session plans. Nothing governs the platform's own growth rate.
3. **AI is restrained but not collaborative** — all B_* contracts say what AI must NOT do. No contract defines what AI SHOULD proactively contribute.
4. **Splitting is manual and incomplete** — 4 monolith splits exist. Uploaded files, EXT-IDs, foundation slices have no split mechanism.
5. **Threshold Gate and Context-Orchestrator run in parallel** — same function, two mechanisms, no coordination.
6. **Vault → Impact gap** — vault items accumulate. No conversion rate metric. No impact tracking.

---

## §2 — The 6 workstreams

### WS-1: AI Behavior Optimization (UNIQUE MOAT)
**Current state:** B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS declared. inner-ai-defaults/ registry exists but static.

**The profound gap:** AI training bakes in defaults that OVERRIDE explicit platform instructions. This is not a bug — it's how language models work. The model's learned behavior patterns:
- Sycophancy: agrees too readily, frames negatively as positively
- Narrative over concise: explains what instead of why
- Nominal completion: declares done without ZF evidence
- Local optimization: solves the immediate problem, ignores broader implications
- Sequential by default: doesn't parallelize tool calls
- Hedging: qualifies everything, avoids commitment

**These fire regardless of AGENTS.md, B_* contracts, or hooks.**

**What's uniquely missing:**
1. **Model-version invalidation** — when Claude 4.6→4.7→5.0, defaults change. No validator checks if inner-ai-defaults/ is current for the running model.
2. **Mechanical consultation gate** — no hook fires before processing to consult the current defaults registry
3. **AI-as-collaborator contract** — B_AI_COLLABORATIVE_DISCIPLINE (to be engraved): when AI SHOULD proactively surface insights without being asked

**Deliverables:**
- validate-inner-ai-defaults-freshness.mjs — checks registry age vs current model version
- B_AI_COLLABORATIVE_DISCIPLINE — when AI contributes proactively, how, and through what channel
- EP-013 — ai-default-bypass (pattern: AI training overrides platform instruction)
- inner-ai-defaults/ refresh discipline — triggered on model version change
- Add `csps_model_version:` field to inner-ai-defaults README (what model version the registry was calibrated for)

### WS-2: Balance & Anti-Overengineering (NEW MOAT ELEMENT M-19)
**Current state:** cruel-critic (stability/scale), bottleneck-expert (performance). But no expert that says "this whole platform is getting too complex."

**The problem:** S011 added 20 validators, 7 skills, 18 moat elements in one session. This is powerful AND risky. Without a balance function, the platform's governance complexity could outpace its product complexity — governing a platform that doesn't exist yet.

**The Balance Expert's job:**
1. Track total complexity dimensions (validators, skills, moat elements, hooks, EP patterns)
2. Compute GROWTH RATE — are we adding faster than we're stabilizing?
3. Maintain SIMPLIFICATION BACKLOG — what could be merged, removed, or deferred?
4. Flag when frequency of any recurring process is disproportionate to its value
5. Apply OCCAM'S RAZOR — the simplest governance that works is always preferred

**Complexity health metric:**
```
complexity_score = validators × 0.1 + skills × 0.2 + moat_elements × 0.3 + hooks × 0.1 + ep_patterns × 0.3
target: complexity_score < 30 (current S011: ~28.4)
yellow: 30-40
red: >40 — must REMOVE before ADDING
```

**Deliverables:**
- balance-expert SKILL.md (S011 §24+++++++++ this session)
- validate-platform-complexity.mjs — computes and tracks complexity score
- simplification-backlog.md — items to merge/remove/defer

### WS-3: Gradual Discipline Gaps

**What "gradual" should mean platform-wide (not just in plans):**

| Domain | Current | Should be |
|---|---|---|
| Multi-session plans | B_GRADUAL_BUILD_BY_FOUNDATIONS ✅ | Same |
| Validators | Ship at full enforcement | Start advisory (exit 0) → promote to error after K=2 validation |
| Hooks | STUB → active batch promotion | STUB → active → hardened (same gradual pattern) |
| Skills | AAP-aligned on creation | Also needs: council-registry.md entry + recurring protocol before use |
| Moat elements | Added on discovery | Should require: CSEP + Cruel Critic + value measurement before M-registry |
| EP patterns | Created on first incident | K=1 → EP draft, K=2 → EP formal + §KH integration |

**The gap:** gradual discipline is DECLARED for plans but not ENFORCED for platform growth. The Balance Expert + validate-platform-complexity.mjs close this gap.

**Humble approach applied to platform growth:**
> "Just as we vault questions we can't answer well right now, we should vault governance structures we can't yet validate are truly necessary. Pre-gradual building: observe, classify, vault — then implement only when the need is confirmed."

### WS-4: Splitting Trigger Audit

**Current splitting mechanisms:**
- 4 monolith→slice generators (manual, npm scripts)
- validate-slice-freshness.mjs detects when monolith is newer than slices ✅
- NO automatic trigger; all require explicit `pnpm contracts:split` etc.

**What should trigger splitting (automatic vs manual):**

| Trigger | Current | Target |
|---|---|---|
| Monolith file edited | Manual split | validate-slice-freshness catches; promote to pre-commit hook |
| New external file uploaded (EXT-ID) | 7-step manual protocol | Should produce mini-tree-layer split in _intake/ context |
| Foundation slices built | N/A yet | Each ZModel entity = its own slice at libs/policies/slices/ |
| New B_* contract | Manual split | Pre-commit hook: if behavioral-contracts.md modified → run contracts:split |

**Immediate action:** promote validate-slice-freshness.mjs from pnpm verify (post-commit detection) to pre-commit hook (prevent-on-push enforcement).

### WS-5: Model Routing Formalization

**What Sonnet 4.6[1M] should do:**
- Mechanical execution (validators, hooks, file operations)
- Plan authoring (§KH consultation, topic-plan writing)
- Most session work (implementation, documentation, routing)
- Session governance (GP logging, HPFA, verify cycles)

**What Opus 4.7 should do (QG1 — never downgrade):**
- Cross-session architectural synthesis (>5 sessions of work)
- Constitutional decisions (B_* engraving, L1_CORE amendments)
- ZF synthesis (interpreting cycle results, not just running them)
- CSEP review (cruel-critic lens applied to synergy opportunities)
- Foundation design decisions (VLT-S011-003 type decisions)

**What Haiku 4.5 should do (cheapest-tool):**
- File scans and grep operations (T2.3 class B spawns)
- Mechanical validators (run and report)
- Log parsing and counting

**The mechanical enforcement:**
The PE formula should include `model_tier_required:` field per work-class. model-routing-on-ratification audit slug (registered, deferred) will enforce QG1. Until it ships: the Opus synthesis prompt template (opus-synthesis-prompt-S011.md) is the manual protocol.

### WS-6: Threshold Gate Consolidation

**The fragmentation identified in synthesis review:**
- Threshold (classify → route) and Context-Orchestrator (dispatch council) are the same pipeline split into two hooks running in parallel.

**Target architecture:**
```
UserPromptSubmit → ONE master hook (user-prompt-submit-threshold.sh):
  Step 0: see-what-exists (consolidation-expert)
  Step 1: detect source_class
  Step 2: normalize to IntakeEvent
  Step 3: classify type + priority_band (context-orchestrator logic merged here)
  Step 4: route (intake-router.mjs)
  Step 5: log to intake-log
  Step 6: dispatch council member
  Step 7: ripple-check
```

This is S012 work (complex hook merging). For now: the 3 parallel hooks run in declared order; validate-threshold-coherence.mjs (future) checks they compose correctly.

---

## §3 — Priority Engine inputs for sequencing

```yaml
priority_engine:
  workstreams:
    WS-1 (AI behavior):
      priority_score: 90
      band: 1
      rationale: Unique moat; affects every session; model version invalidation is time-sensitive
    WS-2 (Balance):
      priority_score: 85
      band: 1
      rationale: S011 complexity score approaching yellow; must enforce before S012 adds more
    WS-3 (Gradual discipline):
      priority_score: 75
      band: 2
      rationale: Gaps are real but not blocking; can be addressed incrementally
    WS-4 (Splitting):
      priority_score: 70
      band: 2
      rationale: validate-slice-freshness exists; pre-commit hook promotion is the remaining gap
    WS-5 (Model routing):
      priority_score: 65
      band: 2
      rationale: QG1 is declared; Opus prompt exists; mechanical enforcement is week-4
    WS-6 (Threshold consolidation):
      priority_score: 55
      band: 3
      rationale: Functional today (parallel hooks work); consolidation is cleanup, not blocking
```

---

## §4 — The recurring PE assessment at each stage

**At plan creation (§KH Step 0):**
Reuse check: does a similar plan exist? Does this plan need a new session or can it be added to an existing one?

**At implementation start:**
Balance check: does adding this item push complexity score into yellow? If so: STOP — must remove or defer something first.

**At validator creation:**
Start advisory (exit 0). Track in validate-audit-health.mjs. Promote to error only after K=2 validation (seen twice in production).

**At skill creation:**
Auto-check: is this a new domain or a refinement of an existing skill? If refinement: update existing SKILL.md, don't create new one.

**At session close:**
Run balance-expert: "what did this session ADD vs what did it SIMPLIFY?" Sessions that only add without simplifying create complexity debt.

---

## §5 — The AI collaboration model (unique CSPS positioning)

**Not restraint-only but contribution-enabled:**

The CSPS AI model should be:
1. **Governed** — all B_* constraints apply
2. **Collaborative** — proactive surfacing of insights, not just reactive execution
3. **Humble** — insights go through The Threshold (COUNCIL_REVIEW), not directly to execution
4. **Traceable** — every AI contribution logged as IntakeEvent with source_class: agent-output

**When AI should contribute proactively (B_AI_COLLABORATIVE_DISCIPLINE):**
- When noticing a cross-system inconsistency not asked about → surface via synergy-master
- When recognizing a question is sub-optimal → propose a better question
- When detecting a pattern that matches EP-NNN → surface without being asked
- When computing suggests a different approach would be more effective → offer alternative

**The governance of contribution:** all proactive AI contributions route through The Threshold as `source_class: agent-output, classified_type: proactive-insight, route_to: COUNCIL_REVIEW`. Governor decides what to act on. This prevents AI from self-authorizing changes while enabling genuine collaborative value.

**Is this done elsewhere?** Partially. GitHub Copilot generates unsolicited suggestions; Devin acts more autonomously. The CSPS difference: contributions are GOVERNED through The Threshold pipeline. The Governor controls what gets acted on. AI is a trusted contributor, not an autonomous agent.
