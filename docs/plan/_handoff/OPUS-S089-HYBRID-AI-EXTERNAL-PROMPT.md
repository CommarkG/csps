---
id: csps.handoff.opus-S089-hybrid-ai-external-prompt
name: OPUS-S089-HYBRID-AI-EXTERNAL-PROMPT
description: >
  Self-contained external-AI council prompt: hybrid LOCAL + EXTERNAL AI orchestration for (1) best quality via
  merging models' strengths and (2) token/resource optimization — for CSPS and for its customers/tenants.
  Circulate to Claude.ai / GPT / Gemini / Grok; replies harvested → personas → consolidated plan (PARK-S089-HYBRID-AI-ORCHESTRATION).
version: "1.0"
session: S089
owner: group:finky
authored_by: OPUS-25
core_spine: AI
schema_anchor: handoff_files
diataxis_type: how-to
lifecycle: production
lifecycle_state: active
status: active
precedent_checked: true
links:
  - { rel: park, href: ../../../tools/data/park-register.yaml }
  - { rel: token-budget, href: ../pillar-0-governance/behavioral-contracts/B_TOKEN_BUDGET.md }
---

# External AI Council — Hybrid Local + External AI Orchestration (paste verbatim)

> Paste to each external AI. Bring replies back → internal personas (ARCH/ECON/AI/VALD/SEC) → consolidated plan.

---

You are a senior AI-systems architect giving candid, research-backed peer feedback. We build **CSPS**, a
governance-first meta-platform that builds and runs apps/SaaS. We already orchestrate **multiple external
models as a council** (Opus = director/judgment, Sonnet = builder, Haiku = cheap scan-only) with strict
model-tiering and a token budget. We now want to design the **next layer**: a **hybrid LOCAL + EXTERNAL AI
orchestration** that achieves two goals at once, **for CSPS itself AND for our customers/tenants**:

1. **Best quality** — merge the strengths of multiple models/engines (not just pick one).
2. **Optimized token + resource cost** — for us and for our customers.

The genuinely new dimension for us is adding **local / self-hosted / on-device models** alongside external
API engines (today everything is external Anthropic).

**Be humble, push back where warranted, cite prior art / sources, no code — reasoning + references.**

## Please answer specifically
1. **Quality-merging patterns:** which actually raise quality vs. are hype? (model ensembling, **mixture-of-
   agents**, multi-model debate, router + verifier, **cascades with a judge**, self-consistency). When is
   merging worth the extra cost, and when does a single strong model win?
2. **Cost/token optimization stack:** best-practice for **model cascades** (cheap-first → escalate on low
   confidence), **routing** (e.g. RouteLLM / FrugalGPT-style), prompt/result **caching**, context compression,
   speculative decoding. What's the optimal default stack and what are the traps?
3. **Local + external hybrid:** decision criteria for when to use **local/self-hosted** (privacy, cost,
   latency, offline) vs **external** (frontier quality). What reference architecture routes a task to the
   right tier? What local models/runtimes are production-credible now?
4. **For customers/tenants (multi-tenant):** how to give tenants both quality and **cost control** — BYO-key,
   tiered plans, usage caps, per-tenant routing policy, local-for-private-data. What governance is needed?
5. **Quality-vs-cost governance:** how to **measure** quality per task and decide the quality/cost trade-off
   deterministically + auditably (not vibes)? How does this interact with a council/judge pattern?
6. **What to avoid:** anti-patterns and failure modes (e.g. cascade quality cliffs, router miscalibration,
   local-model drift, hidden cost of merging, privacy leakage across tiers).

**Return:** a prioritized recommendation list (most valuable first), each with a one-line rationale + a source
where relevant, an explicit **"what I'd cut"** list, and a recommended **reference architecture** (tiers +
routing + merging + caching) we can adapt. Offer ideas humbly — we evaluate on merit and align to what exists
before adopting.
