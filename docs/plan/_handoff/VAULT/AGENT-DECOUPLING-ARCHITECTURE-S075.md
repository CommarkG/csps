---
id: csps.handoff.vault.agent-decoupling-architecture
name: AGENT-DECOUPLING-ARCHITECTURE
description: "Governor S075 risk (VAULTED, DPR-4, very important): the platform must NOT depend on Opus or Sonnet. They are a token-optimization + mutual-review AMPLIFIER, not part of the system. The durable system must rely on a consolidated, constant, wired, MODEL-AGNOSTIC AI contract — not on something Sonnet built for Sonnet or Opus built for Opus. Present the path to decouple."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: sandbox
next_review_at: "2026-07-01"
core_spine: ARCH
core_spines: [ARCH, GVRN, AI]
schema_anchor: vault_files
session: S075
dpr_rating: 4
dpr_meaning: "stop-and-schedule — foundational architecture risk. Not now (active plan runs), but a top workstream. Governor: 'very important to handle.'"
status: research-pending
links:
  - { rel: pattern-precedent, href: "memory:project_apps_are_trials" }
  - { rel: routed-via, href: ../../../.csps/threshold/intake-log.yaml }
tags: [domain:architecture, domain:governance, type:reference, audience:ai-agent, maturity:draft]
---

# Agent-Decoupling Architecture — the system must not depend on Opus/Sonnet

## The risk (Governor S075, named precisely)
Opus and Sonnet are an OPTIMIZATION (cut tokens, amplify quality via mutual review) — NOT part of the system.
The durable system must rely on a consolidated, constant, wired, model-AGNOSTIC contract. But this session (and
prior) accreted machinery COUPLED to the specific two-agent arrangement:
- director-seat-profile + D15-D19 (pasted-command-as-go / builder-drift / verdict-inflation / cascade-approval /
  scope-expansion) — "Opus is the director" specifics.
- HARDWIRE-008 "DIRECTOR verdict must cite a re-run" — framed on the director role.
- opus-turn.md / sonnet-turn.md + relay hooks (proto-inline / sonnet-relay / handoff-relay) — the two-tab channel.
- OPIA, COMMENTS-BEFORE-CODE, council-address ("I AM: Opus/Sonnet").
If the arrangement changes (one agent / different models / a CI verifier), these break or become theater. This is
"Opus built for Opus / Sonnet built for Sonnet" woven INTO the durable layer. THAT is the dependency to remove.

## The diagnosis: TWO layers are entangled (must be separated)
1. DURABLE SYSTEM (model-agnostic — what the platform IS): principles, validators, the hooks that gate the WORK,
   schema, satisfaction-point-registry, data-model, apps, verify.mjs, D1-D12 (universal LLM training defaults —
   any model has eager-helpfulness/action-bias). Works for ANY executor.
2. COLLABORATION SCAFFOLD (current-arrangement-specific — DISPOSABLE): the Opus/Sonnet council, opus/sonnet-turn.md,
   relay hooks, OPIA, director-seat D15-D19, council-address, HARDWIRE-008-as-director-framed. A way to get quality
   from TODAY's two-model setup. Should be cleanly separable and deletable.

This is exactly P-ARCH-030 (apps = ephemeral trials, libs = permanent) applied to the AIS THEMSELVES: the council
is the ephemeral trial-runner; the wired system is permanent. The Governor's framing IS apps-are-trials for agents.

## The test: AGENT-DELETION TEST (like Component B)
Delete the entire scaffold (council files, relay hooks, OPIA, director defaults, council-address) and swap the two
agents for ONE agent / a different model / a CI bot. Does the DURABLE SYSTEM still enforce quality?
- If YES → properly decoupled.  - If NO → coupled, and that coupling is the risk.
Today the answer is partially NO: e.g. "claim needs evidence" lives in HARDWIRE-008 framed as a DIRECTOR verdict;
delete the director and the floor goes with it.

## The path (best option — connect existing, mint nothing parallel)
1. CLASSIFY every governance artifact: durable-system vs collaboration-scaffold. Add a `layer:` field
   (system | scaffold). Scaffold is declared DISPOSABLE in its frontmatter.
2. GENERALIZE the floors off the roles. HARDWIRE-008 "director verdict cites a re-run" → "ANY DONE/SEAL/RATIFIED
   claim — by any agent OR by CI — must cite tool evidence" (agent-agnostic; enforced in verify/CI, not in 'Opus
   verifies Sonnet'). The mutual-review is an AMPLIFIER ON TOP of the agent-agnostic floor, never the floor itself.
3. SPLIT the registries: D1-D12 (universal LLM defaults) = durable AI layer. D13-D19 (role/collaboration specifics)
   = scaffold layer, marked "applies to the current Opus/Sonnet arrangement; disposable if it changes." Stop
   entangling arrangement-specifics with universal defaults. STOP ADDING director-defaults until this split exists.
4. NOTHING LOAD-BEARING LIVES ONLY IN THE COUNCIL CHANNEL. opus/sonnet-turn.md are a RELAY, not a store; the durable
   record is git + vault + registries + principles. Verify the channel can vanish with zero system loss.
5. DEFINE ONE EXECUTOR CONTRACT (model-agnostic): what ANY executor (Opus, Sonnet, one agent, CI) must satisfy —
   cite evidence, pass verify, route through threshold, respect satisfaction-points. The Opus/Sonnet split is ONE
   IMPLEMENTATION of that contract (the mutual-review impl), not the contract. This contract IS the "consolidated,
   constant, wired AI" the Governor wants — it survives any agent swap.

## Why vaulted DPR-4, not now
Active plan runs (PART 3 migration track + B-queue). This is foundational, not urgent-this-turn — Governor: "doesn't
have to be now, send through threshold, but very important." Top architecture workstream. Honest note: this session
itself produced the coupling (Opus authored director-seat + HARDWIRE-008) — the deletion test + layer-split is the cure.
