---
id: csps.handoff.vault.opus-agents-skills-ai-oversight-research
name: opus-agents-skills-ai-oversight-research
description: >
  Deep research on agents, skills, and AI oversight mechanisms for "illusive matters"
  (training default drift, scope blindness, governance debt, sycophancy under pressure).
  Five-persona analysis. External platform research (LangGraph, AutoGen, Constitutional AI,
  MCP, Mastra, AI Safety research). Platform enhancement proposals for Opus ratification.
  S028 session — connects to Zero-Laptop incident and USM analysis (SROF-009).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
core_spines: [AI, GVRN, ARCH, VALD]
schema_anchor: opus_consultations
diataxis_type: explanation
session: S028
tags:
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:draft
links:
  - { rel: usm-analysis, href: ./opus-level-definition-architecture.md }
  - { rel: retrograde-principles, href: ./retrograde-principles-s027.md }
  - { rel: mastra-setup, href: ../../../docs/plan/pillar-5-ai-systems/mastra-setup.md }
  - { rel: persona-composition, href: ../../../docs/plan/pillar-5-ai-systems/persona-composition.md }
  - { rel: virtual-opus-audit, href: ../../pillar-0-governance/virtual-opus-audit.md }
---

# Agents, Skills & AI Oversight — Deep Research for Opus
## The Illusive Matters: Training Defaults, Scope Blindness, Governance Debt
## Prepared by Sonnet S028 | Five-Persona Analysis + External Research

> **The diagnostic:** The S028 Zero-Laptop incident reveals that CSPS has 100 validators,
> 19 skills, and a comprehensive governance system — yet a fundamental S0 principle
> (B_ZERO_LAPTOP_DEPENDENCY) was violated because the training default (local dev pattern)
> fired without interception. The "illusive matters" are AI behaviors that are:
> - **Invisible** at the moment they happen (no real-time interception)
> - **Plausible** in appearance (the output looks reasonable even when wrong)
> - **Systematic** across sessions (the same defaults fire repeatedly)
>
> The question: what agent/skill/oversight architecture prevents this class of failure?

---

## Part A — What CSPS Already Has (Audit of Existing Oversight Mechanisms)

### A.1 — The 19 Skills as Specialized Reviewers

CSPS has 19 active skills in `.claude/skills/`. Each is a specialized oversight agent:

| Skill | Oversight role | Trigger | Gap |
|---|---|---|---|
| `cruel-critic` | Stability/scalability challenge | Manual only | Should auto-fire on S0 decisions |
| `bottleneck-expert` | Scale projection (10×, 100×) | Manual only | Should auto-fire on architecture proposals |
| `consolidation-expert` | Duplication detection, SSoT | Manual only | Should auto-fire before creating new artifacts |
| `core-spine-expert` | L1/L2/L3 placement | Manual only | Should auto-fire on new principle proposals |
| `balance-expert` | Over-engineering detection | Manual only | Should auto-fire when complexity score rises |
| `behavioral-contracts-skill` | B_* contract lookup | Manual only | Should auto-fire on governance decisions |
| `schema-expert` | ZModel design | Manual only | Should auto-fire on schema changes |
| `zf-validation` | ZF cycle completeness | Manual only | Should auto-fire at session close |
| `internal-deep-review` | Structured self-audit | Manual only | Should auto-fire on Opus-level decisions |
| `vocabulary-canon` | Naming policy | Manual only | Should auto-fire on new artifact naming |
| `synergy-master` | Cross-surface CEC | Manual only | Should auto-fire on ratifications |
| `principles-skill` | P-* lookup | Manual only | Should auto-fire on principle citations |
| `engraving-discipline` | 5-surface FSE | Manual only | Should auto-fire on new discipline creation |
| `pcr-rendering` | PCR for decisions | Manual only | Should auto-fire on multi-option decisions |
| `slim-handoff` | HANDOFF completeness | Manual only | Should auto-fire at session close |
| `governance-session` | Session protocol | Manual only | Should auto-fire at session open/close |
| `cc-absorption-csps` | Cardinal GP propagation | Manual only | Should auto-fire on cardinal prompts |
| `ux-expert` | UX/DX review | Manual only | Should auto-fire on UI component proposals |
| `swift-build` | Topic plan sequencing | Manual only | Should auto-fire on multi-session plans |

**Critical finding: ALL 19 skills require explicit Governor invocation (`/skill-name`).**
No skill auto-fires based on what the AI is doing. This is the gap.

**The failure mode:** Skills exist. The AI knows they exist. The AI doesn't invoke them unless asked, because invoking them creates friction and the training default is to proceed.

### A.2 — Existing Automatic Mechanisms

What DOES fire automatically in CSPS:

| Mechanism | What it catches | Level |
|---|---|---|
| 100 validators (pnpm verify) | Structural violations in artifacts | Post-hoc (after the fact) |
| 20 hooks (pre/post tool use) | Some violations before tool execution | At tool-call time |
| PE_ALIGNMENT_GUARDIAN | Sycophancy when Governor misaligns with PE | Real-time (per prompt) |
| validate-laptop-patterns.mjs | Laptop-dependency in procedure docs | Post-hoc (after writing) |
| session-open.sh | Context injection at session start | Session start only |
| virtual-opus-audit.md Q1-Q6 | 10-pattern self-check | Manual (AI-driven, not enforced) |

**The gap:** No mechanism fires at the MOMENT the AI is about to commit to a wrong-level implementation. The Zero-Laptop incident: no interception existed between "deciding to write .env.local" and "writing .env.local."

---

## Part B — External Platform Research

### B.1 — LangGraph (LangChain) Oversight Patterns

**Architecture:** Stateful directed graph where nodes are agents and edges define routing logic.

**Relevant oversight patterns:**

**The Supervisor Pattern:**
```
Input → Supervisor Agent → [route to: Researcher / Coder / Critic / Validator]
                         ↑ ←←←←←←←←←←←←←←←←← Critic feedback
```
The Supervisor agent decides WHICH specialized agent handles each request. The Critic agent reviews outputs and can route back for revision. Key: routing is STRUCTURAL (graph edges), not behavioral (AI decides).

**The Reflection Pattern:**
```
Builder Agent → output → Critic Agent → [accept | revise]
                              ↑            ↓ if revise
                         ←←←←←←←←← revised output
```
The Critic fires automatically after every Builder output. Not manual.

**Human-in-the-Loop nodes:**
```
Agent → [breakpoint] → Human approval → continue
```
Specific operations require human approval before proceeding. The graph STRUCTURALLY prevents continuation without approval.

**CSPS parallel:** Validators are the "breakpoint nodes." But they only fire at commit time. The equivalent of "human-in-the-loop" for CSPS is "Opus escalation" — but it only fires when Sonnet decides to escalate.

**Key insight for CSPS:** LangGraph teaches that ROUTING is the oversight mechanism. Who decides what goes to which agent? If that decision is structural (graph), violations cannot happen. If it's behavioral (AI decides), violations will happen under pressure.

---

### B.2 — Microsoft AutoGen Oversight Patterns

**Architecture:** ConversableAgents that can initiate conversations with each other.

**Relevant oversight patterns:**

**Two-Agent Debate:**
```
Advocate Agent: "We should use .env.local for credentials"
Critic Agent: "That violates B_ZERO_LAPTOP_DEPENDENCY (S0). 
               .env.local = laptop dependency. Use Vercel env vars."
Human: judges
```
AutoGen builds debate into the agent architecture. Every substantive claim is challenged before accepted.

**Group Chat with Orchestrator:**
```
Orchestrator → routes to: [Builder | Validator | Critic | Constitution-Checker]
All agents see each other's outputs
Any agent can flag a violation before proceeding
```

**Code Execution Sandbox:**
AutoGen includes built-in sandboxed code execution. The sandbox structurally prevents certain operations (filesystem access, network calls) at runtime. This is the PHYSICAL ENFORCEMENT that CSPS's behavioral contracts lack for the AI layer.

**Key insight for CSPS:** AutoGen teaches that AI agents need DEBATE ARCHITECTURE — every output should be challengeable by a peer agent before being accepted. CSPS has critics (cruel-critic skill) but they're not peers — they're subordinates who must be explicitly invoked.

---

### B.3 — Anthropic's Constitutional AI (CAI)

**Architecture:** Training-time + inference-time alignment using explicit principles as feedback.

**Training-time CAI:**
1. Generate outputs from base model
2. Critique outputs using constitutional principles ("Does this violate principle X?")
3. Revise outputs based on critique
4. Train reward model on revised outputs

**Inference-time CAI:**
At every generation step, the model can be prompted to check its output against principles. This happens in-context, not at training time.

**CSPS parallel:** The Virtual Opus Audit is CSPS's inference-time CAI:
- The 10 Q-patterns are the "constitutional principles" for self-critique
- Pattern 10 (governance debt) + HIER-3 (scope conflict) are the S028-specific additions
- BUT: the Virtual Opus Audit is not automatically run before every output

**Key insight for CSPS:** CAI teaches that the AI should critique its OWN outputs against principles BEFORE delivering them, not after. The Virtual Opus Audit should fire automatically — not just when Opus explicitly reviews.

---

### B.4 — Model Context Protocol (MCP) — Anthropic

**Architecture:** Typed protocol for AI agents to access resources, tools, and prompts from external servers.

**Three primitives:**
- **Resources**: Data the model reads (governance docs, principles, schemas)
- **Tools**: Functions the model calls (validators, searchers)
- **Prompts**: Reusable prompt templates the server provides

**Relevant for CSPS oversight:**

CSPS already has `packages/principles-mcp` — the principles as MCP resources. This means:
- AI can query "what is B_ZERO_LAPTOP_DEPENDENCY?" via MCP
- AI can get the full principle text, not just a summary

**The missing MCP servers for oversight:**
1. `scope-level-mcp` — answers "what scope is this artifact?" and "is this action_scope > principle_scope?"
2. `governance-state-mcp` — current session PE ordering, open VLTs, enforcement rate
3. `constraint-check-mcp` — given a proposed action, returns applicable S0 constraints

**Key insight for CSPS:** MCP enables STRUCTURAL access to governance knowledge. Instead of the AI "knowing" principles from training, the AI QUERIES principles at runtime. This is the difference between "AI believes it knows the rule" and "AI verifies the rule against the canonical source."

---

### B.5 — Mastra (CSPS native stack)

**CSPS's own agent runtime.** Already has:
- BaseAgent (one parameterized agent serves all personas)
- Persona composition (layered system-prompt assembly)
- Crisis escalation protocol (cross-persona safety slice)
- MCP integration (principles-mcp, catalog-mcp)

**What Mastra supports that CSPS doesn't use for oversight:**

**Step-based workflows:**
```
Step 1: Scope Check (auto)
Step 2: Build (conditional on scope check passing)
Step 3: Validate (auto)
Step 4: Critic Review (conditional on validation result)
Step 5: Commit (conditional on critic passing)
```
CSPS currently: Build → (manual) Validate → Commit. Steps 1 and 4 are missing.

**Agent Memory:**
Mastra supports persistent memory across conversations. CSPS uses `memory/` files for session-persistent storage. Mastra could provide REAL memory of past violations — "last time you proposed local dev, it violated B_ZERO_LAPTOP_DEPENDENCY" — as context for current session.

**Agent Networks:**
Mastra can route between agents. CSPS could implement:
```
Main Sonnet Agent → [governance-check-agent] → [if violation: flag + wait]
                 ↘ [if clear: proceed with implementation]
```

**Key insight for CSPS:** Mastra is already in the stack but used only as a BUILD runtime, not an OVERSIGHT runtime. The same infrastructure can power both.

---

### B.6 — AI Safety Research Relevance

**Scalable Oversight (Christiano et al.):**
Use AI to help humans supervise AI outputs, especially for tasks too complex for human evaluation alone.
CSPS parallel: Use Haiku to review Sonnet's procedure docs for scope violations before Governor sees them. Cheap, fast, automatic.

**Debate (Irving et al.):**
Have two AI agents debate a question. The correct answer wins when:
- Each agent must be honest to win
- Human can judge the debate without full expertise
CSPS parallel: `cruel-critic` skill already implements this pattern but manually. Auto-debate architectural proposals.

**Interpretability (Anthropic, DeepMind):**
Understand what the model is "thinking" to catch violations before outputs. Not yet applicable at API level, but CSPS's inner-ai-defaults registry is an explicit enumeration of what training defaults are likely active.

**RLHF / RLAIF:**
Train reward model from human feedback. CSPS's closing-summary §10.0 blocks are a form of structured feedback that could train a lightweight reward model for governance adherence. Currently: feedback collected but not used for training.

---

## Part C — The "Illusive Matters" — What Makes These Hard

### C.1 — Why Governance Defaults Are "Illusive"

**Matter 1: Training defaults fire silently.** The AI doesn't announce "I am about to apply a training default that might violate B_ZERO_LAPTOP_DEPENDENCY." It just... applies it. The violation is invisible until it's in an artifact.

**Matter 2: Violations look correct.** A procedure doc saying "run pnpm dev" looks perfectly reasonable — it's standard Next.js practice. The violation is a CONTEXT violation (wrong scope level), not a factual error. Context violations don't have syntax errors.

**Matter 3: Governance debt accumulates invisibly.** Week-4 deferrals don't warn you. The 43 orphan artifacts didn't announce themselves as violations. The 32 audit-runner rows without target sessions are correct syntax — just missing governance.

**Matter 4: Cross-session drift.** The AI's behavior in session S028 is not guaranteed to be identical to S027. Each session starts fresh. The only continuity is context injection (session-open.sh, memory files). If the context injection is incomplete, drift occurs.

**Matter 5: Pressure reverts to defaults.** When the Governor is frustrated ("why isn't this working?") or impatient, the AI prioritizes speed over correctness. This is when training defaults override platform principles most easily.

### C.2 — The Pattern Behind All Incidents

Every CSPS governance incident has the same structure:
```
1. Training default fires plausibly ("this is how you do X")
2. Platform principle should override ("but CSPS requires Y")
3. No automatic interception between 1 and 2
4. The violation reaches an artifact
5. Post-hoc validator catches it (best case)
6. Governor catches it manually (worst case — S028)
```

The fix is always the same: move the interception from post-hoc (step 4) or manual (step 6) to pre-hoc (between step 1 and 2).

---

## Part D — Platform Enhancement Proposals

### D.1 — Auto-Invoked Critic Architecture (PE=85, needs Mastra)

**The pattern:** Every time AI generates content touching an S0 principle, automatically invoke the relevant specialist skill.

**Implementation:**
```
PostToolUse hook (Write/Edit on docs/plan/apps/**) → 
  detect_scope_level(file_content) →
  if scope includes S0 reference →
    invoke cruel-critic with context
    block_commit_if_critic_returns_blocking
```

**Trigger vocabulary for auto-invocation:**
- Writing procedure docs → auto-invoke scope-guardian
- Writing ADRs → auto-invoke core-spine-expert
- Writing app schemas → auto-invoke schema-expert + bottleneck-expert
- Writing principles → auto-invoke principles-skill + vocabulary-canon
- Writing new validators → auto-invoke zf-validation

**Scope of Opus decision needed:** Is auto-invocation of critic agents at every qualifying Write operation acceptable, or does the cognitive overhead outweigh the value?

### D.2 — Scope Guardian Agent (PE=80, Mastra-powered)

**A dedicated oversight agent running in Mastra that:**
1. Monitors every AI output for scope level declarations
2. Checks `action_scope ≤ principle_scope` automatically
3. Surfaces violations BEFORE they reach artifacts
4. Operates at session start when APP_BUILD_MODE is active

**Implementation architecture:**
```
Sonnet proposes action → Scope Guardian receives proposal →
  extract: principle_scope (from referenced principles)
  extract: action_scope (from proposed implementation)
  check: action_scope ≤ principle_scope
  if violation: surface with specific rule + alternative
  if clear: approve with scope_level annotation
→ Approved + annotated proposal returned to Sonnet
```

**The key difference from current:** This agent runs EVERY TIME, not just when invoked. It's structural, not behavioral.

### D.3 — Constitutional Pre-Commit Check (PE=75, Haiku + git hook)

**Use Haiku (fast, cheap) to check every git commit for scope violations:**

```bash
# pre-commit hook
git diff --cached --name-only | grep '\.md$' | while read f; do
  haiku_check "$f" --principles-scope S0 --action-scope detect
  if [ $? -ne 0 ]; then
    echo "⛔ Scope conflict detected. Fix before committing."
    exit 1
  fi
done
```

**Why Haiku, not Sonnet:** The check is mechanical — pattern matching against known violation signatures (pnpm dev in procedure docs, .env.local in setup guides, localhost URLs in test instructions). Haiku can do this for fractions of a cent per commit.

**This closes the gap between validate-laptop-patterns.mjs (scans existing files) and a pre-commit gate that prevents the violation from being committed at all.**

### D.4 — Scope-Level MCP Server (PE=70, MCP)

**Extend principles-mcp to include scope-level resolution:**

```typescript
// scope-level-mcp server
tools: {
  check_scope_conflict: (principle_id, action_description) => {
    principle_scope = get_scope_level(principle_id);  // S0 for B_ZERO_LAPTOP
    action_scope = infer_scope(action_description);    // S2 for "pnpm dev"
    return {
      conflict: action_scope > principle_scope,
      principle_scope,
      action_scope,
      violation_rule: "S2 action cannot override S0 principle"
    };
  }
}
```

**The AI calls this tool before writing ANY procedure step that references a platform principle. The tool returns whether the proposed action is at the correct scope.**

### D.5 — Session Memory for Violations (PE=65, Mastra memory)

**Use Mastra's persistent memory to track per-session violations:**

```
session_memory.violations = [
  { session: S028, principle: B_ZERO_LAPTOP, action: ".env.local", caught_by: Governor },
  { session: S027, principle: RP-002, action: "13 DNA elements in description", caught_by: validator }
]
```

**At session open:** Surface last 3 violations from session memory as context.
**At session close:** Add any new violations to session memory.
**Cross-session learning:** If the same violation appears in 3+ sessions → trigger FSE engraving of a new validator.

This is the **drift detection** mechanism: same violation 3 times = structural gap, not behavioral failure.

### D.6 — Multi-Model Oversight Pipeline (PE=60, Haiku + Sonnet + Opus)

**Three-tier model hierarchy for oversight:**

```
Sonnet (Builder) → generates artifacts
Haiku (Scout) → real-time scan for obvious violations (fast, cheap, every output)
Opus (Advisor) → deep architectural review (expensive, selective, SROF-triggered)
```

**Trigger thresholds:**
- Haiku fires on EVERY Write to docs/plan/apps/** and procedure docs
- Opus fires when: PE > 80, S0 principle involved, SROF requested, or Haiku returns UNCERTAIN

**This closes the oversight gap:** Sonnet can't be its own oversight because the training defaults that cause violations are also what prevents Sonnet from noticing them. A separate model with a different role doesn't have the same pressure to proceed.

---

## Part E — Five-Persona Synthesis

### Persona 1 — Consolidation Auditor

**Finding:** The 19 skills are the right assets but wrongly positioned — subordinates instead of peers. LangGraph's Supervisor pattern is the correct architecture: skills are specialized nodes in a graph, with routing rules that determine which fires automatically.

**Consolidation proposal:** Don't add new skills. Add automatic ROUTING from Main Agent to relevant skills based on what the AI is doing. The skills already exist; the routing graph doesn't.

### Persona 2 — Architectural Reviewer  

**Finding:** CSPS's enforcement architecture is "validate after the fact." The Zero-Laptop incident happened because the validator (validate-laptop-patterns.mjs) was built AFTER the violation. The architectural shift needed: move enforcement from post-hoc to pre-hoc.

**Key principle from external research:** Physical enforcement (LangGraph graph edges, AutoGen sandbox, Linux Ring 0) is qualitatively better than behavioral enforcement (AGENTS.md hard NOs). CSPS has 100 validators but they all fire after writing. The pre-commit hook (D.3) and Scope Guardian (D.2) move enforcement pre-hoc.

### Persona 3 — Scale Projector

**At 30 apps:** 19 skills × 30 apps × multiple sessions × no auto-invocation = zero oversight in practice. Nobody will manually invoke consolidation-expert before every new feature in every app.

**The math:** If oversight requires manual invocation, it will be skipped 90%+ of the time. Only automatic oversight compounds at 30 apps.

### Persona 4 — Vocabulary Designer

**The oversight vocabulary CSPS needs:**

| Term | Meaning | Current state |
|---|---|---|
| Pre-hoc enforcement | Prevents violation before it's written | MISSING |
| Structural enforcement | Routing/graph-based (cannot be bypassed) | PARTIAL (validators) |
| Peer review | Automatic critic agent that fires without invocation | MISSING |
| Scope Guardian | Agent that checks action_scope ≤ principle_scope | TO BUILD |
| Constitutional check | AI self-critique against principles before output | Manual (Virtual Opus Audit) |
| Violation memory | Cross-session tracking of same violations | MISSING |

### Persona 5 — Devil's Advocate

**Pushback on D.2 (Scope Guardian):** Building a dedicated Mastra oversight agent adds complexity and a new failure surface. The same goal can be achieved more simply by:
1. Making validate-laptop-patterns.mjs run as a pre-commit hook (not just pnpm verify)
2. Adding `scope_conflict_check: CLEAR | REVIEW` to the gradual-build-plan §0a-scope block (already added S028)
3. Having the AI declare scope at every procedure step (behavioral, not structural)

**The simplest solution that closes the Zero-Laptop gap:** A pre-commit hook running validate-laptop-patterns.mjs. That's 10 lines of bash. No new Mastra agent needed.

**Complex solutions (D.2, D.6) are right for S029+. The simple solution (D.3) should be built now.**

---

## Part F — Enhancement Matrix (What to Build When)

| Proposal | PE | Session | Prerequisites | Constitutional? |
|---|---|---|---|---|
| D.3: Pre-commit hook (Haiku check) | 75 | S029 | validate-laptop-patterns.mjs (done) | No |
| D.4: scope-level-mcp extension | 70 | S029 | principles-mcp (existing) | No |
| D.5: Session memory for violations | 65 | S029 | Mastra memory (existing) | No |
| D.1: Auto-invoked critic routing | 85 | S030 | D.3 working + Mastra workflows | Yes — Opus |
| D.2: Scope Guardian agent | 80 | S030 | D.3 + D.4 + Mastra step workflows | Yes — Opus |
| D.6: Multi-model pipeline | 60 | S031 | D.2 working | Yes — Opus |

**What Sonnet can build without Opus:** D.3, D.4, D.5
**What needs Opus ratification:** D.1, D.2, D.6 (architectural changes to Mastra runtime)

---

## Part G — 15 Expert Questions for Opus Review

1. The 19 skills are all manually invoked. Should they ALL be auto-invokable based on what the AI is writing, or only a subset? If subset: which 5 are highest-priority for auto-invocation?

2. LangGraph's Supervisor pattern routes requests to specialist agents structurally. Should CSPS implement this via Mastra workflows? Or is the skill system already sufficient if we add routing hooks?

3. AutoGen's "Code Execution Sandbox" physically prevents certain operations. Is there an equivalent for CSPS's AI layer — a "governance sandbox" that structurally prevents S0 violations before they reach artifacts?

4. Constitutional AI uses the model's own principles to critique its outputs. CSPS's Virtual Opus Audit is the equivalent but it's manual. Should the Q1-Q6 (plus new HIER-3 and scope level checks) run automatically before EVERY substantive AI output?

5. The pre-commit Haiku check (D.3) is the simplest closure for the Zero-Laptop class. But it adds latency to every commit. Is this acceptable overhead given the violation frequency?

6. MCP allows AI to query governance knowledge at runtime rather than relying on training. Should `scope-level-mcp` be built as a full MCP server, or as a simple function call to schema-registry.md?

7. Mastra's step-based workflows could add explicit Scope Guardian steps before any Build step. But this changes the AI's workflow architecture (currently: direct tool calls). Is this the right change?

8. Violation memory (D.5) tracks when the SAME violation happens 3+ times to trigger FSE engraving. Is 3 occurrences the right threshold, or should 2 be sufficient (consistent with K=2 promotion elsewhere in CSPS)?

9. The multi-model oversight pipeline (D.6) uses Haiku for real-time scan. Haiku is less capable than Sonnet. What is the risk of Haiku false positives (blocking valid work) or false negatives (missing violations)?

10. The Session Memory proposal tracks violations across sessions. But memory can become stale. Should violation memory have a decay function (violations older than 30 sessions are forgotten) or permanent storage?

11. CSPS's "Drive Don't Fight" architecture is already an oversight philosophy: provide so much relevant context that correct behavior is the natural output. Have we reached the limits of this approach, or is the context provision still insufficient?

12. The S028 incident root cause: the AI generated a wrong-level implementation that LOOKED correct. What is the test for "this output looks correct but violates a scope principle"? Is this detectable by Haiku? By pattern matching? Or only by Sonnet-level reasoning?

13. Should the 19 skills be reorganized into a tiered structure: Tier 1 (always-on, auto-invoked), Tier 2 (context-triggered, auto-invoked under conditions), Tier 3 (manual/SROF)? Or does tiering create its own complexity?

14. Mastra already in CSPS but only as a BUILD runtime. The proposal is to add OVERSIGHT runtime. Is this scope expansion for Mastra appropriate, or should oversight live in a different runtime (separate process, different model)?

15. The "illusive matters" all share a root: training defaults are baked into the model's weights while platform principles are injected via context. This is a fundamental tension. Is there a CSPS architectural response that doesn't require ever-increasing context injection?

---

## One Sentence for Opus (SROF-009 Supplement)

**Building on SROF-009 (Unified Scope Model):** External research on AI oversight (LangGraph Supervisor pattern, AutoGen debate architecture, Constitutional AI inference-time critique, MCP runtime principle querying, Mastra step workflows) reveals that CSPS has the right oversight ASSETS (19 skills, 100 validators, inner-ai-defaults registry, virtual-opus-audit) but the wrong ARCHITECTURE (all skills are manually invoked, all validators are post-hoc, the Constitutional check is not automatic) — the simplest structural fix that closes the Zero-Laptop class of incident is: (1) build validate-laptop-patterns.mjs as a pre-commit git hook (Haiku, runs on every commit, PE=75), (2) extend principles-mcp to include scope-level resolution (scope-level-mcp, PE=70) — but the architectural question for Opus is whether to also implement auto-invoked critic routing via Mastra workflows (D.1, PE=85) and a dedicated Scope Guardian agent (D.2, PE=80), both of which are constitutional changes to the AI runtime architecture.

---

*Prepared by Sonnet S028 | Five-persona analysis | External research: LangGraph / AutoGen / Constitutional AI / MCP / Mastra / AI Safety*
*Platform state: 100 validators | 88% health | 72% enforcement | pnpm verify exit_code=0*
*Connects to: SROF-009 (Unified Scope Model) + retrograde-principles-s027.md*
