---
id: csps.handoff.opus-s089-operating-model-and-model-economy-seed
name: OPUS-S089-OPERATING-MODEL-AND-MODEL-ECONOMY-SEED
description: >
  Opus director SEED (plan, not implementation) for three converging Governor asks: (1) move the
  council operating model from two persistent tabs to a Sonnet-tab + Opus/Haiku AGENTS; (2) hardwire
  the token/model economy (model-routing SSoT + Opus-spawn-trigger gate + admin dashboard); (3) a
  local-LLM + external-LLM tiered architecture with usage scenarios. Sonnet builds from this seed.
version: "1.0"
owner: group:finky
authored_by: OPUS-25
core_spine: GVRN
core_spines: [GVRN, AI, ARCH]
schema_anchor: handoff_files
diataxis_type: explanation
lifecycle: production
lifecycle_state: active
status: proposed-awaiting-ratification
precedent_checked: true
session: S089
---

# Operating model + model economy — Opus SEED (Sonnet builds; Governor ratifies)

Three Governor asks converge on one thing: **spend the expensive model (Opus) only when its judgment
is actually needed, make that mechanical, and make it admin-visible.** This is the token optimization
that was doctrine but not hardwired.

## PART A — OPERATING MODEL: tabs → Sonnet-tab + Opus/Haiku agents (PCR + recommendation)

**Current:** Opus-tab (persistent) + Sonnet-tab (persistent) + Haiku-agent; Governor relays between tabs.
**Proposed (Governor):** ONE persistent **Sonnet tab** (builder/driver) + **Opus-agent** (spawned for
architecture/review) + **Haiku-agent** (spawned for scans). Governor talks to the Sonnet tab.

**RECOMMENDATION: YES — move to Sonnet-tab + agents, with 3 conditions.** On merit:
- **Why it wins (token economy — the point):** an Opus persistent tab burns Opus tokens every turn,
  including builder-relay overhead. Opus-as-agent is spawned only for judgment → large Opus cost cut.
  Converges with CDS's model and CSP's 3-tier economy.
- **Why it fixes today's failure:** an Opus-agent gets a bounded package, returns a verdict, and
  STRUCTURALLY cannot sprawl into builds — the exact "Opus did Sonnet's work" anti-pattern the Governor
  flagged this session. The architecture enforces the role split that discipline alone did not.
- **Simpler for the Governor:** one tab to talk to (zero-navigation); no per-tab model-declaration dance.

**The 3 conditions (without these it fails):**
1. **HARDWIRE the Opus-spawn triggers** — Sonnet must NOT self-approve architecture. A mechanical rule:
   constitutional change · new corespine · cross-cutting schema · depth≥4 · any "is this the right
   structure?" question → Sonnet MUST spawn Opus-agent. Else the token saving is bought by skipping
   review (builder-skips-the-gate). This trigger rule IS the token optimization.
2. **Opus-agent spawns carry a CURATED package + coverage-manifest** — a spawned Opus cannot hold the
   full governance suite (Problem 1 / CSP context-overhead tax). It receives the relevant slice + a
   declared "what you are NOT seeing", so its verdict is scope-honest. Persistent director-state lives
   on disk (opus-turn.md, north-star, handoffs, green-receipt); Sonnet passes the relevant slice.
3. **Keep an on-demand Opus-TAB for two cases only:** Governor↔Opus strategy sessions, and full-system
   deep audits (5-mental-models) that need more than a bounded package. Default = Sonnet-tab + agents;
   escalate to Opus-tab for those two.

**Decision ledger:** CHOSEN = Sonnet-tab + Opus/Haiku agents + hardwired spawn-triggers + on-demand
Opus-tab for strategy/deep-audit. REJECTED = keep two persistent tabs (Opus tokens burned every turn;
role-sprawl only disciplined, not structural). REJECTED = pure Sonnet-drives-all, Opus fully on-demand
with no trigger gate (Sonnet under-spawns Opus to move faster = skipped architecture review).

## PART B — MODEL-ECONOMY HARDWIRE (un-park CSP arch/model_routing; make it mechanical)

Today the economy is doctrine (haiku ≥4-checks, CONTEXT-BUDGET gate). MISSING: a routing SSoT + the
spawn-trigger gate. Build:
- **`tools/config/model-routing.yaml` (SSoT):** `model_ids` · `cost_per_million_tokens` per tier ·
  `tasks` (task-type → tier + rationale + est. cost) · `spawn_triggers` (the Part-A rule, mechanical) ·
  `routing_rules` ("never Opus for tasks that run >1×/session"; "≥4 mechanical checks → Haiku/local";
  "constitutional/corespine → Opus-agent"). Adapted from CSP's arch/model_routing.json.
- **`validate-model-routing.mjs` (gate):** ADVISORY→BLOCKING — an Agent() spawn or a dispatch that
  escalates tiers must cite the routing rule that authorized it (extends the CONTEXT-BUDGET attestation).
- **The token-budget thresholds move here too** — externalize AGENTS.md target etc. from hardcoded
  into `tools/config/token-budget.yaml`, so the admin dashboard edits config, not code.

## PART C — LOCAL-LLM + EXTERNAL-LLM tiered architecture

Add a **Tier 0 (LOCAL)** below Haiku — a locally-installed LLM (e.g. Ollama running a small code model)
for ZERO-API-COST, private, unlimited mechanical work.

| Tier | Model | Runs | Owns | Cost |
|---|---|---|---|---|
| **0 LOCAL** | local LLM (Ollama) | Governor's machine | token/line counting · grep-classification · presence/format checks · first-pass secret/PII scan · dedup similarity | $0 |
| **1 HAIKU** | claude-haiku (API) | agent | mechanical scans needing reliability + the haiku_scout_return contract; ≥4-check fan-out | low |
| **2 SONNET** | claude-sonnet (API) | the persistent tab | build with judgment, nuanced edits, real proofs | mid |
| **3 OPUS** | claude-opus (API) | agent (or on-demand tab) | architecture, gating, deep audit | high |

- **Routing:** pure-mechanical → try LOCAL first; escalate to Haiku if reliability needed; Sonnet builds;
  Opus gates. Push maximal mechanical VOLUME to local (free); reserve paid tiers for what local can't
  do reliably.
- **Trust:** LOCAL is the CHEAPEST so it gets the STRONGEST independent verification — its outputs are
  claims re-derived from ground truth (VERIFY-GATE). The local LLM is an EXTERNAL capability → it needs a
  `dna-guardian` ALIGNED record before it may act (like Playwright).
- **Adapter:** a thin `libs/ai/local-llm.ts` (Ollama HTTP) + the routing layer reads model-routing.yaml.

## PART D — ADMIN DASHBOARD (route + what it does)

Route: **`/platform/model-economy`** (admin-gated). What it shows + lets an admin change:
- **Live config editor** for `token-budget.yaml` + `model-routing.yaml` (the thresholds + routing rules
  become admin-tunable, not hardcoded) — this is the "where an admin changes the gate" you asked for.
- **Per-tier cost + current usage** (from the routing log): what ran where, $ spent per tier.
- **"What-if" scenarios** (see Part E): move task X from Haiku→local → projected saving.
- **The gate status:** AGENTS.md lines vs budget (advisory), spawn-trigger compliance, ratchet state.
- **Build status honesty:** each surface tagged SHIPPED/SPEC/CONCEPT (the peer-explanation-audit rule).

## PART E — USAGE SCENARIOS (different profiles against the economy)

- **S-A all-mechanical sweep:** 200-file presence scan → LOCAL (free) → Haiku spot-checks 5% → ~$0.
- **S-B normal build:** Sonnet-tab builds; spawns Haiku for the ≥4-check sweep; spawns Opus-agent for the
  one "is this schema position right?" gate. Opus touched once, briefly.
- **S-C deep audit:** on-demand Opus-tab runs the 5-mental-models cross-system audit (the case that
  justifies a full Opus context) — rare, deliberate.
- **S-D cost-spike guard:** dashboard shows Opus usage climbing → routing rule "never Opus for repeated
  tasks" flags the repeated task → re-route to Sonnet/local. Cost governance made visible.

## DISPOSITION
- **RATIFY FIRST (Governor):** Part A operating-model shift (it changes how we work) — the 3 conditions
  are the safety. Nothing flips until ratified.
- **THEN Sonnet builds (one-click):** model-routing.yaml + token-budget.yaml externalization +
  validate-model-routing + the local-llm adapter + dna-guardian on the local LLM + the /platform/
  model-economy dashboard. Opus SEEDS (this doc); Sonnet BUILDS; Opus GATES the corespine/schema pieces.
- **Opus does NOT build these** (the correction this session): director plans + seeds + gates only.

## REVIEW OUTCOMES — Sonnet 4-persona review (Balance · Reliability · Security · Platform-Dev), ACCEPTED
A spawned Sonnet reviewer holed this seed on merit. Accepted findings + revised plan:

- **TOP FIX (self-caught): the Opus-spawn trigger is doctrine, not a gate.** Part-A Condition 1 says
  "Sonnet MUST spawn Opus-agent" but names no hook/validator that fires when Sonnet skips it — the same
  named≠active failure the seed claims to fix. REVISION: the spawn-trigger must be a MECHANICAL gate
  (pre-tool-use or a validator that BLOCKS a dispatch touching constitutional/corespine/cross-cutting/
  depth≥4 without a recorded Opus-agent verdict). Direction ratifiable; not buildable until this exists.
- **FIRST BUILD (highest-value): `opus-agent-spawn-template.md`** (parallel to haiku-spawn-template) —
  BEFORE any Part B/C/D work. Defines: boundary-crossing block · curated-package REQUIRED-pointer list
  (Reliability: a minimum-coverage checklist, not just the exclusion manifest) · coverage-manifest schema
  · Opus return format. Everything else depends on Opus-agent spawns being defined.
- **Sealing-write conflict RESOLVED (my addition):** a read-only spawned Opus-agent cannot write the
  SEAL to plan frontmatter (council-architecture §5). Resolution: the Opus-agent RETURNS the verdict +
  exact seal-content; the persistent Sonnet tab (write access) applies it after Governor ratifies. Agent
  proposes, driver writes — preserves the read-only boundary AND the two-party seal.
- **Part C (local LLM) → NO-GO now, PARK.** K=1, CONCEPT (not labeled as such = the failure class),
  and its VERIFY-GATE is doctrine: the local LLM would be its OWN re-deriver = not independent. Trust≠cost.
  PARK trigger: ≥3 tasks/session exceed ~$0.50 Haiku cost AND a stable Ollama env is confirmed. The
  3-tier economy (Haiku/Sonnet/Opus) already captures ~80% of the value.
- **Part D (dashboard) → Phase-1 only.** Phase 1 = config viewer/editor for model-routing.yaml +
  token-budget.yaml (buildable now). Phase 2 (per-tier cost, what-if) is BLOCKED on a routing-log that
  does not exist — deferred until the routing layer logs dispatches.
- **Security locks (Part B):** model-routing.yaml MUST split GOVERNANCE-LOCKED fields (spawn-triggers,
  tier assignments for constitutional/ratification/destructive tasks — changeable only by council
  amendment) from ADMIN-EDITABLE fields (advisory budgets, cost display). Plus a non-editable
  NEVER-ROUTE-LOCAL/HAIKU list: ratification verdicts, sealed-gate checks, destructive-action auth,
  final secret/PII pass. An admin dashboard must not be able to remove the Opus gate via a YAML edit.
- **Part B validator:** `validate-model-routing` must re-derive routing from ground truth, not accept a
  self-cited "authorized by rule X" (citation-compliance passes a wrong route). Schema-first: write the
  model-routing.yaml schema + one worked example BEFORE the validator.

REVISED VERDICTS: A GO-WITH-CHANGES · B GO-WITH-CHANGES (schema-first + locks) · C NO-GO/PARK ·
D Phase-1-only. BUILD ORDER: opus-agent-spawn-template + spawn-trigger gate → model-routing.yaml schema
→ validate-model-routing → token-budget.yaml externalize → dashboard Phase-1. Local LLM parked.
