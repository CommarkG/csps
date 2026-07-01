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
