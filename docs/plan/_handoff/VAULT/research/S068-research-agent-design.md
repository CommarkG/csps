---
id: csps.vault.research.S068-research-agent-design
name: S068-research-agent-design
description: "S068 research feeding D12 (research-behavior default) + the governed Research Pipeline (vlt-S068-00013) + reusable research-agent templates. Key finding: Anthropic's orchestrator-worker model (lead Opus plans, parallel Sonnet subagents, separate citation pass) beats single-agent 90.2% — this IS the CSPS Opus/Sonnet model, externally validated. STORM = the multi-persona convergence pattern. Persisted per §10."
type: vault_files
protection_level: protected
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S068
authored_by: Opus-13 (synthesizing research agent)
date: 2026-05-28
core_spine: AI
core_spines: [AI, OPER, VALD]
schema_anchor: vault_files
ns_quality: [core-first, self-improving, synergetic]
ns_path: "this research → AI spine → North Star (self-improving)"
context_question: "Before building any research agent or research pipeline: am I using the validated orchestrator-templated pattern (objective + output-shape + effort-tier + non-overlap boundary), or improvising?"
inherits_from: "vault-pending vlt-S068-00013 (Research Pipeline) + vlt-S068-00016 (AI research-behavior mapping) + agent-alignment-protocol"
links:
  - { rel: research-pipeline, href: ../../../../tools/data/vault-pending.yaml }
  - { rel: agent-alignment, href: ../../pillar-0-governance/agent-alignment-protocol.md }
pipeline_wiring: "Consumed by D12 (research-behavior default) authoring + Research-Pipeline design (after PART 2) + research-agent-template Capability. Wired to CIE (research = an input class) + PE (findings ranked)."
---

# S068 Research — Research-Agent Design Patterns

> Background research agent, S068. Persisted per §10 so D12 + the Research Pipeline use validated patterns.

## The standout validation

**Anthropic's multi-agent research = orchestrator-worker:** a lead agent (Opus) plans, spawns 3-5 parallel subagents (Sonnet), separate citation pass. **Beats single-Opus by 90.2%.** This IS the CSPS Opus-orchestrator + Sonnet-builder model — externally validated. CSPS is already aligned with the best-practice architecture; we just need to template it.

## Named systems
- **Anthropic Research** — orchestrator-worker + boundary-partitioned subagents + citation pass.
- **OpenAI Deep Research (o3)** — single-agent Plan-Act-Observe, RL-trained backtracking, inline citations.
- **GPT-Researcher** — explicit **Planner → Executor → Publisher** template; parallel crawlers; synth LLM over 20+ sources.
- **Stanford STORM** — cleanest multi-persona pattern.
- **CrewAI** (role-templating: researcher/writer/reviewer) + **LangGraph** (state-graph control) — the de-facto templating substrates.

## Multi-persona convergence + dedup (answers Governor's "3rd-scope multi-persona extraction")
**STORM pattern:** (a) mine diverse perspectives, (b) personify the LLM per perspective to ask guided questions, (c) simulated expert↔writer conversations grounded in sources, (d) **curate into one outline = the convergence + dedup step.**
**Anthropic alternative:** give subagents **explicit non-overlapping boundaries** ("don't research X — another subagent owns it") → dedup at delegation, not after. Synthesizer ranks.
→ CSPS: use boundary-partitioning to prevent overlap; STORM-curation to converge multi-persona findings.

## Standard research pipeline (answers Governor's "research pipeline")
`question → plan/decompose → parallel search+scrape → local draft/findings → critique/synthesis → citation pass → final`.
**Load-bearing persistence detail:** the lead agent **writes its plan to durable memory BEFORE context truncates**; intermediate findings live in per-subagent fresh contexts then aggregate; per-source tracking through to publish. Traceability = inline per-claim citations.
→ CSPS Research Pipeline: results land as a **local result** → processed in the **3 scopes** → **3rd scope re-run by multiple personas** (STORM) → **each finding written to the wired register** (§10, never float) → PE ranks, CIE aware.

## 5 elements of a strong research-agent prompt template
1. Explicit **objective** (the question, not the topic).
2. **Output format/shape** the synthesizer expects.
3. **Tool + source guidance** (which tools, how many calls).
4. **Effort-scaling tier** (Anthropic: simple=1 agent/3-10 calls; comparison=2-4/10-15; complex=10+) — prevents over/under-investment.
5. **Explicit non-overlap boundary** ("do NOT cover X") — the dedup lever.
6. (Persona/lens slot when running STORM multi-perspective.)

## Single best practice for CSPS
Every research agent = an **orchestrator-templated subagent with explicit objective + output-shape + effort-tier + non-overlap boundary**; the lead persists its plan to durable storage before synthesis. Boundary-partitioning at delegation = dedup-free, traceable, reusable.

Sources: Anthropic multi-agent research · Stanford STORM (+ arXiv 2402.14207) · GPT-Researcher · OpenAI Deep Research · CrewAI/LangGraph · Claude prompting best practices.
