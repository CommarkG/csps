
# CSPS External-Review Briefing — read this fully; assume you know nothing about CSPS

You are a senior platform architect asked to review and improve a specific architecture. You have **no prior
knowledge** of this system. This document gives you the background; the **attached files (§A)** give you the
full, un-summarized content. Read both. Then answer the questions in §F and do the research in §G.

## §A — THE PACKAGE (numbered reading order + plain-content name + canonical file)
> Naming standard (CSPS): a document GROUP is always presented numbered + simply named. Save each download
> with its number prefix so order + content are unambiguous. (The number+name is presentation; the canonical
> repo filename — last column — is the file itself.)

| # | Simple name (what it is) | Save-as | Canonical file |
|---|---|---|---|
| **01** | This briefing — read FIRST (vocabulary §C) | `01-csps-external-review-briefing.md` | EXTERNAL-REVIEW-BRIEFING.md |
| **02** | Platform core concept & pillars — deep background | `02-csps-platform-core-concept.md` | CSPS-PLATFORM-CORE-CONCEPT.md |
| **03** | The architecture under review | `03-one-tab-orchestration-design.md` | OPUS-S088-ONE-TAB-ORCHESTRATION-DESIGN.md |
| **04** | How the AI models communicate | `04-ai-council-communication-spine.md` | AI-COUNCIL-COMMUNICATION-SPINE.md |
| **05** | Compaction / new-tab / agent-lifecycle rules | `05-ai-council-edge-case-protocols.md` | AI-COUNCIL-EDGE-CASE-PROTOCOLS.md |
| **06** | The completion standard ("green") | `06-shippable-green-protocol.md` | SHIPPABLE-GREEN-PROTOCOL.md |

Read 01 → 06 in order; nothing here substitutes for the full files. **02 is the deep background — read it before the design (03).** *(If your tool can't take attachments, paste each file's content in numbered order; do not skip any.)*

## §B — WHAT CSPS IS (one paragraph, then the vocabulary)
CSPS (Core Sights Platform) is a **governance-first software platform** built and operated by a human ("the
Governor") together with three Claude models (Opus, Sonnet, Haiku). It is not a normal codebase: its core
product is a set of **enforced behavioral rules** that keep AI work honest, complete, and aligned. Almost
everything is wired so that mistakes become *structurally impossible to author* rather than caught after the
fact. The platform builds apps/SaaS and serves external users/developers under the same governance.

## §C — VOCABULARY & PILLARS YOU MUST KNOW (you will not understand the questions without these)
1. **The three models & fixed roles.** **Opus** = judgment, decomposition, verification, sealing (director).
   **Sonnet** = full build-out + tests. **Haiku** = cheap bulk breadth scans + pre-build checks. Cost rises
   Haiku→Sonnet→Opus. **Hard rule:** Haiku NEVER makes judgments — in a recent incident a Haiku scout returned
   a confident "0 results" when the true answer was 92, so cheap-model output is treated as an unverified *claim*.
2. **Spines.** Five governance "core spines": GVRN (decision rights), ARCH (data/schema), AI (model behavior),
   OPER (operations), VALD (validation/evidence). Every artifact declares which spine it belongs to.
3. **B_* behavioral contracts.** Named, *engraved* rules (not advice). "Engraved" = present on 5 surfaces
   (Five-Surface Engraving / FSE: an AGENTS.md note + a contract doc + a memory + a validator + a git hook).
   Relevant ones: **B_SWIFT_OR_PARK** (triage each input: do-now vs defer), **B_CONTEXT_CHECKPOINT_GATE** (when
   to compact vs new tab; the AI cannot read its own true remaining context so it must ASK the human when
   borderline), **B_SHIPPABLE_GREEN** (below), **B_DETERMINISTIC_GATE** (a gate's blocking decision must be a
   pure function of the committed tree — no wall-clock/mtime).
4. **Threshold.** The single intake door. Every input is **classified → decomposed → PE-scored → routed**
   (SWIFT / park-completion / park-all / evolve). Nothing enters active work un-routed.
5. **PE (Priority Engine).** Scores/ranks work units; decides what's next and which model-tier a unit warrants.
6. **CIE (Continuous Improvement / Insight Engine).** Captures insights every cycle; recurring patterns are
   promoted to a findings register that *blocks* work when findings recur unaddressed (k≥3) — a self-learning loop.
7. **Council.** The AI deliberation structure, tiers T0 (solo) → T4 (full + external AI, which is THIS review).
8. **Completion standard / "green."** "Done" ≠ "compiles." **SHIPPABLE-GREEN** defines green as a 6-link chain:
   C1 builds-as-deployed · C2 committed-everywhere (incl. git submodules) · C3 deploy-root self-contained ·
   C4 receipt bound to the exact tree · C5 **two-party seal** (the builder cannot certify its own work; an
   independent director reproduces it) · C6 renders-in-production (a live smoke read). Each is an automatic gate.
9. **Two-party seal (C5).** Builder sets BUILD-COMPLETE; a *different* reviewer independently reproduces at the
   same tree hash and counter-signs. This caught multiple false "green" claims; it is the safety spine.
10. **DNA-Guardian & QUARANTINE.** Every external capability (MCP tool, agent, library) is untrusted until it
    has an ALIGNED record — its vendor defaults (e.g. "answer in Hebrew", "auto-publish") are neutralized and its
    vocabulary translated to CSPS terms. Until aligned: QUARANTINE (output is a claim, never platform truth).
11. **Context inheritance.** A spawned sub-agent sees ONLY the prompt it is given (isolated context). So context
    must be packaged into a **context-bundle** (governing-intent + definition-of-done + a behavioral block-test +
    inline critical content + absolute file paths). A "see §X" navigation reference is forbidden (the agent can't
    navigate). Three inheritance levels: Governor→tab, tab→agent, tab→tab.
12. **ZF / IZFC (Zero-Findings / Iterative Zero-Finding Cycles).** "Complete" = repeated fresh-angle sweeps stop
    finding anything new. Count is a measurement, never a target. A loop needs an explicit ZF predicate or it runs forever.

## §D — THE ARCHITECTURE UNDER REVIEW (the actual proposal)
Today the human manually relays messages between separate Opus, Sonnet, and Haiku browser tabs (he is the
message bus and the clock — slow, error-prone). The proposal: **one Opus-director tab that orchestrates Sonnet
and Haiku as spawned agents in recurring loops** — `goal → decompose(Opus) → scout(Haiku) → build(Sonnet) →
reproduce+seal(Opus) → capture(CIE) → route new inputs(threshold) → repeat until ZF`. The orchestrator is wired
to PE (what's next, which tier) and CIE (per-cycle insight). Read the full design in attachment #1.
**Crucially, the multi-tab system is NOT removed** — it is preserved as a selectable mode (for the super-admin
and for end users); the one-tab loop is an added option, not a replacement.

## §E — KNOWN OPEN GAPS (our internal Core-Council already found these; pressure-test + extend them)
1. **Haiku precondition.** Haiku-as-subagent historically overflowed on tool-surface (PARK-039). If unresolved,
   the loop runs Sonnet-does-everything and the cost model collapses. No fallback path is specified.
2. **C5 seal independence in one tab.** If Opus both decomposes AND seals in the same context window, the
   independence that catches false greens may degrade into a correlated-failure blind spot. Proposed mitigation:
   a seal phase that reads ONLY the committed artifact at HEAD, not tab memory.
3. **Context-bundle builder is unspecified** (no schema, no validator, no completeness test) — yet it's the
   load-bearing primitive for every spawn. Under-specification → agents guess → alien output.
4. **C6 (renders-in-production) has no one-tab analog** — the loop can declare ZF while the deploy is broken.
5. **Mid-loop SWIFT can silently mutate the goal** — no per-cycle SWIFT-absorption audit / cap.

## §F — QUESTIONS WE NEED YOU TO ANSWER
1. Is "isolated agent context + director reproduction from committed HEAD" a sufficient substitute for physical
   tab separation to preserve independent verification, or does it create a correlated-failure blind spot? How
   would you mechanize true independence inside one tab?
2. Is the context-bundle (push) the right inheritance primitive, or should agents pull from a shared store? What
   must a bundle schema contain to make under-specification structurally impossible?
3. For running **several agents and several models inside ONE Opus tab**: what gets *left out of the loop*?
   Enumerate every continuity/coordination failure mode (agent lifecycle, partial results, parallel edits,
   context-budget, compaction mid-loop) and the minimal mechanism that closes each.
4. Is the loop's convergence triple {goal-predicate, max-cycles, budget-ceiling} enough to prevent runaway
   autonomous spend? What's missing?
5. For external users/developers calling the platform, is "QUARANTINE-on-intake" a sufficient trust model, or is
   a stronger sandbox needed?
6. Where does this architecture's cost/latency curve break versus the multi-tab baseline?
7. **Multi-tenancy & scale (primary platform goal):** the core architecture must be consistent, stable, and
   scalable to many tenants and many concurrent users. Does an orchestrated-loop core (one director coordinating
   model-workers) generalize to per-tenant isolated loops at scale? What breaks first — state isolation, the
   shared gates (SHIPPABLE-GREEN / two-party seal), the findings/CIE register, or cost? What is the right
   tenancy boundary (per-tenant orchestrator? shared orchestrator + per-tenant context-bundles + RLS data isolation?).

## §G — RESEARCH WE ASK YOU TO DO (cite sources)
1. **Multi-agent orchestration in one context/process** — current best practices and known failure modes for an
   orchestrator running heterogeneous models (a strong "director" + cheaper workers) in a single session;
   especially context-window management, sub-agent result verification, and avoiding correlated failure.
2. **Agent memory / context inheritance** — push-bundle vs shared-store vs retrieval; what production multi-agent
   systems do to give a fresh sub-agent exactly-enough context without navigation.
3. **Autonomous loop safety** — convergence predicates, budget ceilings, runaway prevention in self-directing agent loops.
4. **The overall concept** — is "one director-tab orchestrating cheaper model workers in verify-sealed loops" a
   sound direction? What would you change at the architecture level? What are we not even asking that we should?

## §H — THE PROMPT TO PASTE (copy this to the external AI, with the §A files attached)
> "You are a senior multi-agent-systems architect. Attached is a briefing (read §C vocabulary first) plus 4
> canonical design files. The system knows you have zero prior context — everything you need is in the brief +
> attachments; do not assume. Review the architecture in §D, pressure-test the known gaps in §E, answer the
> questions in §F, and do the research in §G with citations. Be a sharp critic, not a cheerleader. Where you
> recommend a change, give the concrete mechanism, not a principle. Tell us what we failed to ask."
