---
id: csps.handoff.opus-S088-one-tab-orchestration-design
name: OPUS-S088-ONE-TAB-ORCHESTRATION-DESIGN
description: >
  Major-shift design spec (S088): collapse the multi-tab manual relay (Opus tab ↔ Sonnet tab ↔ Haiku,
  Governor copy-pasting between them) into ONE Opus-director tab that orchestrates Sonnet/Haiku as
  spawned agents in recurring loops until a goal is reached — with harvesting, internal core council,
  threshold-routed evolve/park, context-inheritance, skills/agents arrangement, and the orchestrator
  wired directly to CIE + PE. Document-first; awaits Governor ratification + external-AI review before
  any implementation. Multi-topic, PCR per section, multi-persona, IZFC-swept.
version: "0.1-draft"
session: S088
owner: group:finky
authored_by: OPUS-25
core_spine: GVRN
diataxis_type: explanation
schema_anchor: handoff_files
lifecycle: production
lifecycle_state: active
status: draft-awaits-ratification-and-external-review
precedent_checked: true
links:
  - { rel: parks, href: ../../../tools/data/park-register.yaml }
  - { rel: circular-loop-park, href: ../../../tools/data/park-register.yaml }
  - { rel: dna-guardian, href: ../../../.claude/agents/dna-guardian.md }
  - { rel: shippable-green, href: ../pillar-0-governance/SHIPPABLE-GREEN-PROTOCOL.md }
  - { rel: master-plan, href: ./OPUS-S088-MULTI-TAB-MASTER-PLAN.md }
---

# One-Tab Orchestration — major-shift design (document-first)

> **Status: DRAFT.** Nothing here is implemented. This is the consultation artifact. Reads as: what
> exists → what's missing → the target architecture → edge cases → inheritance impact → external-review
> questions. PCR = **Premise · Concern · Recommendation** per section. Personas (§0) speak where they add signal.

## §0 — THE EXPERT COUNCIL (personas consulted throughout)
- **ARCH** — Distributed-Systems Architect (loops, idempotency, failure, convergence).
- **GOV** — Governance/Safety Officer (two-party seal, DNA-Guardian, independence, no-nominal).
- **ECON** — Cost/Efficiency Economist (token budget, model-tier routing, when NOT to spawn).
- **CCA** — Cognitive-Context Architect (context completion + inheritance bundles, compaction).
- **PROD** — SaaS/Product Strategist (apps creation, external users/developers, productization).

## §1 — THE SHIFT (premise of the whole document)
**P:** Today the loop is *human-driven*: Opus plans in tab 1, Governor copy-pastes a relay to Sonnet tab 2,
Sonnet builds, Governor pastes back, Opus seals. The Governor is the message bus + the clock. This is slow,
error-prone (relays get stale), and burns the Governor's time.
**C (GOV):** the manual relay is *also* where two-party independence currently lives — collapsing it must not
collapse the independent-verification that caught every false "green" this session.
**R:** one Opus-director tab runs an **orchestrated loop**: Opus decomposes → (Haiku scouts) → Sonnet builds
(spawned agent) → Opus independently reproduces + seals → repeat until ZF/goal. The Governor sets the goal
and ratifies; the tab runs the cycles. Independence is preserved because spawned agents have **isolated
context** (a genuinely separate reasoning instance) and Opus still reproduces every claim (CS9).

## §2 — THE THREE MODELS (analysis + optimization)
| Model | Comparative advantage | Loop role | Cost posture |
|---|---|---|---|
| **Opus** | judgment, decomposition, verification, synthesis, sealing | rung-4 director: own the goal, decompose, reproduce, seal | most expensive — spend on judgment, not breadth |
| **Sonnet** | full build-out, FSE, behavioral tests | rung-2/3 builder: spawned per work-unit with a self-contained spec | mid — spend on build |
| **Haiku** | cheap bulk breadth, pattern/presence scans, **pre-build checks** | rung-1 scout: inventories, "what matches X", pre-flight checks before Sonnet builds | cheapest — spend on breadth, NEVER on judgment |
- **PCR:** **P** each model has a distinct comparative advantage. **C (ECON)** the default failure is using an
  expensive model for cheap breadth (Opus grepping) or a cheap model for judgment (Haiku deciding — it returned
  false data S088). **R** the orchestrator routes by **PE rung**: breadth→Haiku, build→Sonnet, judgment/seal→Opus;
  Haiku output is always a *claim* reproduced before use (DNA-Guardian QUARANTINE rule).
- **Optimization (ECON):** Haiku **pre-build check** is new leverage — before Sonnet builds, a Haiku scout
  inventories the blast radius (files touched, existing patterns, naming) so Sonnet builds aligned the first time.
  Cheap insurance against expensive rework.

## §3 — THE ORCHESTRATOR CORE (the loop engine) — wire to CIE + PE
Extends `tools/zf-orchestrator.mjs` + `tools/scripts/threshold-*` + `tools/pe-compute.mjs` + `cie-pe-adapter.mjs`.
**Loop:** `goal → decompose(Opus) → [PE prioritizes units] → for each unit: (Haiku pre-check?) → Sonnet build →
Opus reproduce+seal → CIE captures cycle insight → threshold routes any new input(evolve/park) → next unit →
until ZF(goal met, no new findings)`.
- **PE wiring:** orchestrator asks `pe-compute` which unit is next (priority ordering), and which model-rung the
  unit warrants. PE score gates spawn-vs-inline (ECON: ≤3 checks = inline, never spawn).
- **CIE wiring:** every cycle writes an insight to `cie-state.yaml`/`cie-chain-insights.yaml`; recurring patterns
  promote to the findings-actuator + park-register (the self-learning loop, now act-forcing).
- **Convergence (ARCH):** every loop has a **max-cycles guard** + a **goal predicate** (ZF: a fresh sweep finds
  nothing). No goal predicate = no loop (prevents infinite spend).
- **PCR:** **P** the orchestrator is the single coordinator. **C (ARCH)** a loop without a convergence predicate
  and a budget ceiling is a runaway. **R** every loop declares {goal-predicate, max-cycles, budget-ceiling} up front;
  the orchestrator halts + reports at any ceiling and asks the Governor.

## §4 — CONTEXT COMPLETION + INHERITANCE (the crux the Governor flagged)
**P:** A spawned agent sees ONLY the prompt passed to it — not the tab's accumulated context. So one-tab
orchestration REQUIRES that the deep context be assembled once and *packaged* for inheritance.
**Design — the Context Bundle:** the Opus tab does an **initial comprehensive deep context completion** (governing
intent + relevant spine + relevant memory + active plan + DoD), then a **bundle builder** distills the
*minimal-but-complete* slice each agent needs and passes it as the spawn prompt. Each Sonnet/Haiku agent
**inherits the bundle**, not the whole tab.
- **CCA:** the bundle is the one-tab analog of the tab→tab HANDOFF. Same discipline (nothing-left-behind), new
  granularity (per-spawn, not per-tab). It must be *self-contained* (the agent can't ask follow-ups mid-run).
- **Two-level inheritance:** (1) Governor → Opus tab (deep completion, once). (2) Opus tab → each spawned agent
  (distilled bundle, per unit). Tab→tab inheritance (§9) is a third level when the tab itself ends.
- **PCR:** **P** isolated agent context. **C (CCA)** an under-specified bundle = the agent guesses (D-defaults) =
  alien output. **R** bundle builder is **prevent-by-construction**: a spawn without {governing_intent, DoD,
  block-test, relevant-context-refs} is un-authorable; the DNA-Guardian/CS9 treats any bundle-less output as QUARANTINE.

## §5 — INTERNAL CORE COUNCIL (Opus ↔ Sonnet ↔ Haiku in one tab)
**P:** Council today is cross-tab (opus-turn.md / sonnet-turn.md relays). In one tab it becomes an **in-process
council**: Opus poses, a Sonnet agent critiques/builds, a Haiku agent pre-checks, Opus synthesizes + seals.
- Council tiers T0–T4 (existing) map onto loop intensity: T0 solo Opus · T1 Opus+Sonnet (default build) ·
  T2 +expert-persona · T3 full · T4 full+external-AI. Threshold routes scope×criticality → tier.
- **GOV:** the council's *peer contract* (mutual challenge) must survive in-process — the Sonnet agent must be
  prompted to *challenge*, not just comply, and Opus must reproduce, not trust. Independence = isolated context +
  reproduction, not physical tab separation.
- **PCR:** **P** richer, faster council in one tab. **C (GOV)** in-process council risks groupthink (one tab, one
  trajectory). **R** preserve dissent structurally: spawn the builder with an explicit "challenge the spec" clause;
  keep T4 external-AI review for high-criticality (this very doc).

## §6 — EVOLVE + PARK THROUGH THE THRESHOLD (mid-loop inputs)
**P:** During a loop, new ideas/inputs arrive (Governor messages, agent-surfaced findings). They must not derail
the active goal (completion focus) nor be lost.
**R:** every mid-loop input passes the **threshold chain** (classify→decompose→PE-significance→route): SWIFT
(do now, in-loop) / park-completion (finish loop, then) / park-all (defer) / evolve (amend the goal — requires
Governor). Park writes to park-register; evolve amends the loop goal-predicate. This is B_SWIFT_OR_PARK made mechanical.
- **PCR:** **P** inputs are continuous. **C** silent auto-absorb = scope drift (the disease of prior sessions).
  **R** threshold is the *only* door; nothing enters the loop un-routed.

## §7 — SKILLS & AGENTS ARRANGEMENT (single dispatch point)
**P:** Skills (CSPS-built) + agents (Claude Code subagents) + external MCP are dispatched ad-hoc today.
**R:** the orchestrator is the **single dispatch point**. It selects skill vs agent vs inline by PE rung; every
EXTERNAL capability clears the **DNA-Guardian** (registry verdict) before it acts; every spawned agent inherits a
bundle (§4). The capability registry + DNA-Guardian + agent defs become the orchestrator's routing table.
- **PROD:** this makes the platform's capability surface *governed and composable* — a precondition for exposing
  it to external users/developers (§8).

## §8 — APPS / SaaS / EXTERNAL USERS + DEVELOPERS (same loop engine, outward)
**P:** The Governor wants this to serve not just internal builds but **app/SaaS creation** and **responding to
external users/developers**.
**R:** the SAME loop engine runs outward. An external request enters via the threshold (intent classify:
explore/configure/build/ask) → orchestrator decomposes → loop produces the answer/build → two-party seal → deliver.
- Internal build and external service share the engine; only the *intake* (Governor vs external user) and the
  *trust boundary* differ (external input is QUARANTINE until classified; never trusted as platform truth).
- **PROD:** this is the productization path — the orchestrator IS the SaaS backend reasoning loop; developer
  requests get the same governed treatment (DNA-Guardian on their submitted capabilities, threshold on their asks).
- **PCR:** **P** one engine, two audiences. **C (GOV)** external input must never inherit insider trust. **R**
  trust-tier on intake: Governor = author; external user/developer = QUARANTINE → classified → bounded.

## §9 — INHERITANCE BETWEEN TABS (does one-tab eliminate it? No.)
**P:** Tabs still end (context fills). One-tab orchestration changes WHAT inherits, not whether.
**R:** the inherited unit becomes **{loop-state + context-bundle + harvested-insights + open-parks}** — checkpoint
under B_CONTEXT_CHECKPOINT_GATE. A new tab resumes the *loop*, not just the conversation. Harvest-before-compact
per cycle means the loop is always resumable.
- **CCA:** three inheritance levels now exist: Governor→tab (deep completion), tab→agent (bundle), tab→tab
  (loop-state checkpoint). Each is a boundary with a UNDERSTANDING-BLOCK (mutual-understanding-validation).

## §10 — EDGE CASES (IZFC sweep — fresh angles)
1. **Agent returns false data** (happened S088, Haiku "0 vs 92") → CS9: every agent output reproduced; QUARANTINE default.
2. **Context-budget overflow** (build output floods the tab) → ECON: PE gates spawn; large builds spill to a
   dedicated tab (the two-tab path stays valid for heavy work). One-tab is default, not dogma.
3. **Depth cap (=1)** → orchestrator runs legs sequentially from the top tab; no self-nesting agents.
4. **Loop won't converge** → max-cycles guard halts + escalates to Governor (no silent spin).
5. **Parallel edit collision** (two agents same file) → orchestrator serializes writes per file; or single-builder per unit.
6. **External capability injects alien DNA mid-loop** → DNA-Guardian gate; QUARANTINE blocks platform-truth use.
7. **Stale bundle** (context changed after bundle built) → bundle carries the HEAD it was built at; reproduced against current.
8. **Seal independence erosion** → GOV: builder spawned with isolated context + challenge clause; Opus reproduces; CS5 director_seal mechanizes.
9. **Governor input mid-loop** → §6 threshold; SWIFT/park/evolve, never silent.
10. **Cost runaway** → budget-ceiling per loop; halt+report.

## §11 — WHAT EXISTS vs WHAT'S MISSING (reconnection map)
- **Exists:** zf-orchestrator, threshold chain, pe-compute, cie-pe-adapter, council architecture, model-tier
  validators, haiku-scout + dna-guardian agents, handoff inheritance, findings-actuator (act-forcing).
- **Missing (to build, post-ratification):** (a) loop engine wrapping decompose→spawn→reproduce→seal with
  goal-predicate + budget-ceiling; (b) context-bundle builder (§4); (c) orchestrator↔PE spawn-routing; (d)
  orchestrator↔CIE per-cycle capture; (e) in-process council prompts with challenge clause; (f) trust-tier on
  intake (§8); (g) CS5 director_seal for in-loop sealing. Each = FSE + behavioral block-test (no patches).

## §12 — EXTERNAL-AI REVIEW PACKAGE (questions to ask external systems)
1. Does the loop's convergence predicate + budget-ceiling adequately prevent runaway autonomous spend?
2. Is "isolated agent context + director reproduction" a sufficient substitute for physical tab separation to
   preserve independent verification, or does it introduce a correlated-failure blind spot?
3. Is the context-bundle the right inheritance primitive, or should agents pull from a shared store instead of push?
4. For external users/developers, is the QUARANTINE-on-intake trust model sufficient, or is a stronger sandbox needed?
5. Where does this architecture's cost/latency curve break vs the multi-tab baseline?

## §13 — PCR SUMMARY (the recommendation in one breath)
**P:** the Governor's time is the bottleneck; the manual relay is the cost. **C:** collapsing tabs must not
collapse independence, context-completeness, or completion-focus. **R:** build the loop engine + context-bundle +
threshold-gated evolve/park + orchestrator↔CIE/PE wiring, with isolated-context agents reproduced by Opus and
DNA-Guardian on every external capability — defaulting to one-tab, spilling to multi-tab only for heavy/parallel
work. **Pilot first** (one CS gate via spawned Sonnet) before committing the whole build flow. Park: PARK-S086-053.

## §14 — COMPACTING & CONTINUITY POLICY (consolidated; all three models)
Detailed protocol home = `AI-COUNCIL-EDGE-CASE-PROTOCOLS.md` §5.1–5.8 (Opus-reviewed S088, ratified).
This section consolidates the Governor's four asks + the **one-tab deltas** so nothing is model-specific drift.

**(a) WHEN the system should ask the human for exact context** — the AI cannot read its own true remaining
window, so asking is hardwired-legitimate (B_CONTEXT_CHECKPOINT_GATE). Trigger to ASK: context >80% used AND
the current unit is **borderline** (can't be certainly reached green+committed in the remaining window). Applies
to **all three**: Opus (director tab), Sonnet (builder tab/agent), Haiku (scout agent → its *caller* asks before
spawning if the caller is borderline). Never guess the window; ASK = the sanctioned action (edge §5.1 line 76).

**(b) HOW to prepare before compacting** — the pre-compact checklist (edge §5.2): all work committed (zero
uncommitted files), verify green, receipt fresh, SROF written (partial OK, marked pre-compact), active agents
resolved (edge §5.4 — never compact with an agent still running). NEVER compact on uncommitted/red/open-agent state.

**(c) WHERE to save before compacting** — durable, not chat: SROF → `tools/council/sonnet-turn.md` (or
`opus-turn.md`); state + resume-instruction → the HANDOFF file; loop-state (one-tab) → the checkpoint doc
(`{loop-state + context-bundle + harvest + open-parks}`, §9). Harvest-before-compact is the rule; chat-only = lost (G5).

**(d) COMMUNICATION PROTOCOL — the lifecycle of an agent/tab (one-tab + multi-tab):**
| Event | Protocol | Source |
|---|---|---|
| **New tab activation** | startup block (HEAD + open items + resume instruction) → new tab emits INTENT-ABSORBED, verifies HEAD matches git before any work | edge §5.3, §5.5 |
| **Activating an agent** | spawn with a **context-bundle** (governing_intent + DoD + block-test + context-refs + challenge clause); bundle-less spawn = un-authorable; output = QUARANTINE until reproduced | design §4, §7 |
| **Stopping an agent** | resolve before tab close: capture partial findings to AGENT-HARVEST block; never assume an agent continues across a tab boundary | edge §5.4 |
| **Continuing an agent's work across tabs** | the agent's bundle + partial-result harvest is inherited by the next tab, which re-spawns from the harvested state (agents don't persist; their *state* does) | edge §5.4 + design §9 |
| **Compacting a tab + preserving agent continuity** | run pre-compact checklist (b) → resolve/harvest all agents (edge §5.4) → write loop-state checkpoint → compact → post-compact INTENT-ABSORBED re-aligns before resuming the loop | edge §5.2–5.4 + design §9 |

**One-tab delta:** in one-tab orchestration the "tab→tab" boundary becomes rarer (the loop runs longer in-tab),
but the **agent boundary** (spawn/stop/continue) becomes per-cycle and frequent — so the bundle (§4) and the
agent-harvest (edge §5.4) are the load-bearing protocols, not the tab-handoff. The director tab still checkpoints
loop-state for the eventual tab→tab compaction.

**PCR:** **P** compaction + agent lifecycle is where continuity silently breaks. **C** chat-only state + guessed
windows + unharvested agents = lost work and phantom-state resumes. **R** ASK when borderline, harvest-before-compact
to durable homes, and treat every agent spawn/stop/continue as a bounded boundary with a bundle in and a harvest out.

> **Review note (Opus S088):** AI-COUNCIL-COMMUNICATION-SPINE.md + AI-COUNCIL-EDGE-CASE-PROTOCOLS.md reviewed +
> ratified; they are the detailed protocol home, this §14 is the consolidated index + one-tab deltas. External-AI
> review (§12) should assess §14(d) for one-tab agent-lifecycle completeness.

## §15 — INTERNAL CORE-COUNCIL FINDINGS (S088: 5 personas + a Sonnet design-critic agent)
Before external review, an internal council pass (the Sonnet critic dogfooded the one-tab loop) surfaced these —
each folds into §11's missing-to-build list with a concrete mechanism (no patches):
1. **Gate loop-start on PARK-039.** Loop-init reads `park-register.yaml`; if PARK-S084-039 (Haiku unblock) is
   open, halt with "Haiku not activatable — run inline or unblock first." Prevents wrong-tier cost assumptions.
2. **Typed context-bundle + validator (highest-frequency breakage).** `context-bundle.schema.json`
   {governing_intent, DoD, block-test, inline-critical-content, absolute-paths, HEAD, session-id} +
   `validate-context-bundle.mjs` BLOCKING pre-spawn. A schema-invalid bundle cannot spawn.
3. **Externalize the director_seal (C5).** Seal is a discrete phase where Opus reads ONLY the committed artifact
   at HEAD (not tab memory) and compares to DoD — this manufactures the independence one-tab otherwise erodes.
4. **Per-cycle SWIFT-absorption audit.** Orchestrator emits `[SWIFT-CYCLE-N: absorbed/parked/escalated]`; if
   SWIFT count > cap, pause and surface to Governor. Prevents silent goal mutation (§6 risk).
5. **`loop-contract.yaml` at loop-init.** {goal-predicate, sweep-definition, max-cycles, budget-ceiling,
   ZF-operator}, Governor-visible before the loop runs. ZF is true only when the sweep-definition is satisfied.
6. **C6 in the loop.** The loop must cross C6 (renders-in-production) before declaring ZF on deployable units —
   the loop owns the full chain, not just build+verify.

## §16 — AGENT-FILE-ACCESS RULE (Governor S088 — close the agent↔system-files gap)
Spawned agents have isolated context and cannot navigate. Therefore a context-bundle MUST carry **inline-pasted
critical content + absolute file paths for supplementary reads** — a "see §X" / "per the protocol" navigation
reference is **forbidden** and must FAIL bundle validation exactly like a missing governing_intent. Confirmed by
the S088 Sonnet critic: absolute paths + parallel reads worked; navigation refs would have violated contextual
locality. The bundle validator (§15.2) enforces inline-content-not-navigation.

## §17 — MULTI-TAB PRESERVED AS AN OPTION (Governor S088 — add, do not replace)
The multi-tab system and its communication protocols (AI-COUNCIL-COMMUNICATION-SPINE + EDGE-CASE-PROTOCOLS) are
**retained as a first-class selectable mode**, not deprecated. Two modes coexist:
- **Multi-tab mode** — separate Opus/Sonnet/Haiku tabs with human-relayed protocols; strongest independence +
  live human steering; available to the super-admin AND exposed to end users/developers who want manual control.
- **One-tab orchestration mode** — the loop engine of this doc; fastest, least human-switching; default for
  bounded well-specified goals.
The orchestrator exposes a **mode selector** (per goal); both modes honor the same SHIPPABLE-GREEN gates,
two-party seal, DNA-Guardian, and threshold. PCR: **P** one size does not fit all work or all users. **C**
replacing multi-tab would remove the strongest-independence path + a control surface users may need. **R** keep
both; choose per goal/criticality/user-tier; never let mode choice weaken the shared gates.

## §18 — COUNCIL ROUND-1 RATIFIED AMENDMENTS (Opus directives for ERC-003/004/007)
Boundary contract is built + sealed (context-bundle + seal-packet validators, 4/4 ×2). The remaining ratify-
candidates from the 4/4-unanimous council round 1 are amended HERE (this doc is the designated target), to be
implemented by Sonnet when the loop engine is built (no loose hand-patching of zf-orchestrator before then).

**ERC-003 — loop-contract is insufficient {goal-predicate, max-cycles, budget}.** RATIFIED. The loop engine
must consume a `loop-contract.yaml` (typed, validated at loop-init) with: `goal_predicate`, **immutable
`goal_version`**, **fixed `sweep_definition`** (ZF applies only to this sweep), `max_cycles`, `budget_ceiling`
(in real cost units, not tokens), **`max_duration` (timeout)**, **`stagnation_rule`** (no-progress / repeated
finding-fingerprint → halt), **`side_effects.require_human_approval_for[]`** (deploy/delete/publish/email/billing),
and a **`kill_switch`**. Target: `schemas/loop-contract.schema.json` + `validate-loop-contract.mjs`, built WITH
the loop engine (not before). Source: ERC-003 (4/4).

**ERC-004 — per-cycle durable checkpoint (not tab-close).** RATIFIED. The orchestrator writes a committed
loop-state checkpoint at the END OF EVERY CYCLE (`loop-state-S<NNN>-cycle-<N>.yaml`), before the next cycle
starts — chat is disposable. Post-compact/new-tab resumes from the last committed checkpoint (extends §9).
Target: same loop-engine build. Source: ERC-004 (4/4).

**ERC-007 — orchestrator = deterministic state machine; LLM OUT of orchestration logic.** RATIFIED as an
architecture principle for `tools/zf-orchestrator.mjs`: the orchestrator is a deterministic JS state machine that
dispatches agents via structured calls and enforces the loop-contract; the LLM is invoked AS a step, never AS the
control loop (prevents the meta-prompt-exhaustion vector where governance contracts decay as the session grows).
The orchestrator itself is governed (its own FSE + two-party seal on loop-engine changes — Grok add). Target:
zf-orchestrator design + this principle. Source: ERC-007 (4/4) + Gemini/Grok.

**Sequencing:** these three are the LOOP-ENGINE spec; they are built together when the one-tab loop is built
(after the boundary contract, which is done). Until then they are ratified-design, not code. ERC-006
(multi-tenancy) + ERC-008 (failed-to-ask cluster) remain parked (Phase 4 / design-gap fold-in).
