---
id: csps.research.S084-seed-design-external-review-prompt
name: S084-seed-design-external-review-prompt
description: "Self-contained (ZCA, no internal jargon) rung-4 external-consensus prompt for 3 top-tier external LLMs (Gemini/GPT/Claude) to stress-test the Journey-Orchestrator SEED-1..8 design BEFORE Opus commits the anchors. Reviews the seed decomposition + the 6-expert internal findings, not the journey method (covered by S084-journey-external-research-prompt). Governor relays out; brings consensus back to fold into the seeds."
version: "1.0"
session: S084
owner: group:finky
authored_by: OPUS-21
core_spine: AI
schema_anchor: vault_files
lifecycle: production
lifecycle_state: active
status: draft
links:
  - { rel: plan, href: ../../../pillar-0-governance/JOURNEY-ORCHESTRATOR-PLAN.md }
  - { rel: method-prompt, href: ./S084-journey-external-research-prompt.md }
---

# External SEED-Design Review Prompt — rung-4 consensus (relay to Gemini + GPT + Claude)

> **Why this exists (Independence Ladder, rung 4):** the PE scored these seeds #1 and they are C1-class —
> irreversible + "expensive to retrofit." Internal rungs 0–3 (a 6-expert panel) are done. Rung-4 external
> consensus is justified ONLY on this kind of decision. Send the box below to EACH of 3 independent models
> separately; convergence across independent training is the strongest signal we can get. Bring all 3 back.

```
You are a world-class multi-tenant SaaS platform architect. Critique the design below honestly and
specifically — assume we are smart but possibly wrong. No flattery. We want what is MISSING, what is
OVER-ENGINEERED, and what mature systems do differently. Answer the 6 numbered questions at the end.

CONTEXT (zero prior knowledge assumed)
We are building a multi-tenant SaaS platform. Its core operating method is a governed "Journey": an
ordered process from goal → verified completion that everything (platform work AND end-user work) runs
through. We are about to write 8 "core seeds" — the SEALED architectural anchors a builder AI will then
implement. We want these seeds stress-tested BEFORE we commit them, because they are expensive to change later.

THREE INDEPENDENT EXTERNAL MODELS already converged on these PRE-BUILD CORRECTIONS (we adopted them):
- Gates are NOT uniformly blocking — each gate carries gate_mode[risk_class][phase] = blocking|advisory|silent.
- Decouple the real-time workspace (drafts/saves) from heavy recursive graph checks (ripple/evidence),
  which run async on an explicit phase-transition, not as a synchronous master gatekeeper.
- Ripple/impact propagation = a typed + versioned + severity-tiered + concurrency-safe pipeline with cycle
  detection, NOT an unbounded recursive walk.
- Risk-class is system-SUGGESTED + human-ratifiable (not user-declared); auto-upgrades on schema/security/billing touch.
- 10 non-negotiables: every event has an id; every artifact versioned; gates record policy-version; ripple
  records graph-version; saves use optimistic concurrency; every blocker has one owner+severity+expiry; every
  override logged; async workers idempotent; "done" reproducible from an append-only event log.

THE 8 SEEDS WE ARE ABOUT TO WRITE (the design under review):
- SEED-1  journeys entry skeleton — the SEALED "constitution": invariants + the 5 phase names/intents + the
          meta-model shape (PhaseDef/GateDef/VariantDef/BranchAxis/Bindings) + how a journey INSTANCE binds to it.
- SEED-2  Phase-Exit-Gate schema — {minimum_exit_evidence[], gate_mode matrix, threshold/PE/CIE flags, blocked-message}.
- SEED-3  phase→binding map — which capabilities/loops fire at each of the 5 phases.
- SEED-4  ripple/impact contract — typed+versioned+severity pipeline over an EXISTING dependency graph (518 nodes,
          773 edges); bounded BFS walk + cycle-freeze; gate only on top-2 severities.
- SEED-5  evidence re-run contract — cheap checks = hash-bound; high-stakes transitions = live re-run.
- SEED-6  closed enums + the selector (risk-class primary, persona overlay).
- SEED-7  health/loops report — a READ-aggregator over existing registers (no new store).
- SEED-8  append-only event log + optimistic-concurrency contract (the substrate for the 10 non-negotiables).

OUR OWN 6-EXPERT INTERNAL REVIEW already flagged these (we plan to resolve them in the seeds):
- [platform-vs-tenant collision] the meta-models (PhaseDef etc.) are platform-level (same for all tenants),
  so forcing tenant_id on them is wrong — we plan a scope:'platform'|'tenant' discriminator; instance rows
  (Journey) keep tenant_id. RIGHT CALL?
- [reuse vs new event log] an append-only immutable AuditEvent table already exists; we plan to REUSE it
  (entity_type='journey_event') rather than build a second log for SEED-8. RIGHT CALL?
- [version column] we plan to add version INT @default(0) to the instance tables NOW (cheap) vs a migration later.
- [risk-class UX] when the system auto-upgrades a journey to "Governed," the human must SEE why; we plan a
  suggestion-display + downgrade-reason + auto-upgrade-trigger list.
- [Governor-facing] we plan one plain-language "owner story" per phase so a non-technical owner understands what
  they see/do at each step.
- [MVP-narrow] first build = state-machine + risk-selector + persona-overlay + evidence gate + policy-result +
  event-log + ripple for 2-3 typed classes. DEFER: full automation, dashboards, universal ripple, auto-remediation.

THE 6 QUESTIONS (answer each, briefly, with reasoning):
1. Does the SEED-1..8 decomposition hold? Is anything in the WRONG seed, or missing its own seed?
2. Which single seed is HIGHEST-RISK (most likely wrong AND most expensive to retrofit), and why?
3. platform-vs-tenant: is a scope discriminator on meta-models (not tenant_id) the correct multi-tenant pattern here?
4. event log: reuse the existing append-only AuditEvent vs build a dedicated SEED-8 store — which, and why?
5. What failure mode would a mature system worry about here that NONE of the above seems to address?
6. Is the MVP-narrow / defer split right, or is something in "defer" actually load-bearing for the MVP?

Format your answer as: Q1..Q6, each 2-5 sentences. End with the ONE change you'd make before we write a line of code.
```

> **After all 3 return:** fold convergent points into the seeds (the §0b 3-way pattern). Divergence = a flagged
> design risk for Opus to resolve. This file is the rung-4 input; the seeds are written AFTER it returns.
