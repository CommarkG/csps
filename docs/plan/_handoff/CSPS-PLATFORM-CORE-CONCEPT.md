---
id: csps.handoff.platform-core-concept
name: CSPS-PLATFORM-CORE-CONCEPT
description: >
  Stand-alone platform core-concept brief for an EXTERNAL platform-expert AI with ZERO prior knowledge of CSPS.
  Harvested from the full S088 working session. Gives the deep background — what CSPS is, the governance model,
  the five spines, the three engines (Threshold/PE/CIE), the completion moat (SHIPPABLE-GREEN + two-party seal),
  the DNA-Guardian, the three-model council, context inheritance, the one-tab/multi-tab modes, and the
  multi-tenant goal — with the concrete S088 incidents that justify each mechanism. Companion to
  EXTERNAL-REVIEW-BRIEFING.md (the cover + questions). Do NOT summarize; this IS the content.
version: "1.0"
session: S088
owner: group:finky
authored_by: OPUS-25
core_spine: GVRN
diataxis_type: explanation
schema_anchor: handoff_files
lifecycle: production
lifecycle_state: active
status: ready-for-external-review
precedent_checked: true
links:
  - { rel: cover, href: ./EXTERNAL-REVIEW-BRIEFING.md }
  - { rel: design, href: ./OPUS-S088-ONE-TAB-ORCHESTRATION-DESIGN.md }
  - { rel: shippable-green, href: ../pillar-0-governance/SHIPPABLE-GREEN-PROTOCOL.md }
---

# CSPS — Platform Core Concept (for an external expert who knows nothing about it)

You are reviewing a governance-first AI-operated software platform. This document is the deep background.
Every mechanism below exists because a concrete failure forced it — the failures are included so you can judge
whether the mechanism is the right fix.

## 1. WHAT CSPS IS
CSPS (Core Sights Platform) is built and run by one human ("the Governor") and three Claude models (Opus,
Sonnet, Haiku). Its distinguishing bet: **the product is enforced governance** — a lattice of rules that make AI
work honest, complete, and aligned, wired so that mistakes become *structurally impossible to author* rather
than caught afterward. It builds apps/SaaS and serves external users/developers under that same governance.
The platform's stated goal: a **consistent, stable, scalable, multi-tenant** core that many users build on.

## 2. THE GOVERNANCE MODEL
- **Five spines** (every artifact belongs to one): **GVRN** (decision rights), **ARCH** (data/schema),
  **AI** (model behavior), **OPER** (operations), **VALD** (validation/evidence). Precedence GVRN > others.
- **B_* behavioral contracts** — named, *engraved* rules (not advice). "Engraved" = **Five-Surface Engraving
  (FSE):** present on 5 surfaces — an AGENTS.md note (T5), a contract doc (T4), a memory (T3), a validator (T2),
  a git hook (T1). A rule that lives on only some surfaces drifts; T3-only fades within ~10 turns.
- **Tier meaning:** T1 hook (fires on the action), T2 validator (blocks commits, wired to `verify`), T3 memory/
  session-injection (necessary, not sufficient), T4 contract (the canonical statement), T5 always-loaded note.
- **Enforcement honesty:** the platform distinguishes "written" from "enforced." Advisory ≠ enforced. A claim of
  done requires re-running the gate as proof ("re-run is the proof"); memory of a past green is not evidence.

## 3. THE THREE ENGINES
- **Threshold (intake):** the single door. Every input is **classified → decomposed → PE-scored → routed**
  (SWIFT do-now / park-completion / park-all / evolve). Nothing enters active work un-routed. This prevents
  silent scope drift (new ideas mid-work don't derail the goal but aren't lost).
- **PE (Priority Engine):** scores and ranks work units; decides what's next and which model-tier a unit warrants.
- **CIE (Continuous Insight Engine) + self-learning loop:** captures insights each cycle; recurring gaps are
  written to a findings register. The register is **act-forcing**: a finding seen ≥3 times (k≥3) or past its
  deadline **blocks** new work — so saved findings cannot rot as an ignored backlog. (S088 fixed this: the
  register had been surfacing advisories nothing acted on; it now blocks per-finding, not just in aggregate.)

## 4. THE COMPLETION MOAT (the platform's headline differentiator)
"Done" ≠ "compiles." **SHIPPABLE-GREEN** defines "green" as a 6-link chain, each an automatic gate:
- **C1 builds-as-deployed** — runs the real production build, not just a typecheck.
- **C2 committed-everywhere** — incl. git submodules (a deliverable left untracked in a submodule is not done).
- **C3 deploy-root self-contained** — the deployed app contains all files it reads at runtime.
- **C4 receipt bound to the exact tree** — a green-receipt's tree-hash must reproduce at the current commit.
- **C5 two-party seal** — the builder may set BUILD-COMPLETE but cannot certify itself; an independent reviewer
  reproduces at the same tree-hash and counter-signs. Builder self-certification is forbidden.
- **C6 renders-in-production** — a live smoke read of the deployed URL (HTTP + DOM + data-provenance).
**Why it exists (S088 evidence):** in one session a "done, pushed, green" claim hid four real defects — the page
was untracked in a submodule (invisible on deploy), the green-receipt was stale, the app build had been *failing
every deploy* (a route exported non-handler values → Vercel build froze on a stale deploy → 404), and the live
page returned 404. Each was caught only by manual re-checking. SHIPPABLE-GREEN turns each manual catch into an
automatic gate. **Companion disciplines:** prevent-by-construction (make the error un-authorable, not just
detectable), and a builder *persona* that treats every defect as a class to make impossible, not an instance to patch.

## 5. THE DNA-GUARDIAN (external-capability immune system)
Every external capability — MCP server, sub-agent, third-party skill, library — is **untrusted until aligned**.
The Guardian scans its native vocabulary/defaults/priorities and produces a verdict {ALIGNED |
ALIGNED-WITH-TRANSLATION | QUARANTINE}, neutralizing alien defaults (e.g. a connected MCP that forces "answer in
Hebrew", or auto-publishes) and translating its vocabulary to CSPS terms. Until ALIGNED: QUARANTINE — its output
is a *claim to be independently reproduced*, never platform truth. (S088 evidence: a Haiku scout returned a
confident "0 results" when the truth was 92; an external WordPress MCP injects its own language + menu into context.)

## 6. THE THREE MODELS & THE COUNCIL
- **Opus** = judgment, decomposition, verification, sealing (director). **Sonnet** = full build-out + behavioral
  tests. **Haiku** = cheap bulk breadth scans + pre-build checks. Cost rises Haiku→Sonnet→Opus. **Hard rule:**
  Haiku never makes judgments (its output is a claim). Expensive models must not be spent on cheap breadth, nor
  cheap models on judgment.
- **Council tiers** T0 (solo) → T1 (Opus+Sonnet) → T2 (+expert persona) → T3 (full) → T4 (full + external AI —
  this review). The peer contract requires the builder to *challenge* the spec, not merely comply.

## 7. CONTEXT INHERITANCE (and the load-bearing open gap)
A spawned sub-agent has **isolated context** — it sees only the prompt passed to it, never the conversation or
live state. So context must be packaged into a **context-bundle** (governing-intent + definition-of-done + a
behavioral block-test + **inline critical content + absolute file paths** — never a "see §X" navigation
reference, which an agent can't follow). Three inheritance levels: Governor→tab, tab→agent, tab→tab.
**OPEN GAP (highest priority):** there is not yet a typed bundle schema + a completeness validator, so today's
spawns use hand-rolled bundles whose completeness cannot be proven. Until that validator exists, *every*
sub-agent result — including feedback gathered for this very review — must be treated as a scoped claim, not
ground truth. (This gap was exposed when the Governor asked "how did you ensure the agent had full context?" —
the honest answer was: it had a partial 6-file bundle, not full context, and completeness was unprovable.)

## 8. THE ARCHITECTURE UNDER REVIEW: ONE-TAB vs MULTI-TAB (both preserved)
Historically the Governor manually relays messages between separate Opus/Sonnet/Haiku browser tabs (he is the
message bus + the clock — slow, error-prone). The proposed addition: **one Opus-director tab orchestrating
Sonnet/Haiku as spawned agents in recurring loops** (`goal → decompose → scout → build → reproduce+seal →
capture insight → route new inputs → repeat until zero-findings`), wired to PE (what's next, which tier) and CIE
(per-cycle insight). **Multi-tab is NOT removed** — it is kept as a first-class selectable mode (strongest
independence + live human steering) for the super-admin and for end users; one-tab is an added option, chosen
per goal/criticality. Both modes honor the same SHIPPABLE-GREEN gates, two-party seal, DNA-Guardian, and threshold.
**Known open gaps** (pressure-test these): Haiku-as-subagent activation cost; preserving seal independence when
one model both builds-context and seals; the missing bundle validator (§7); no one-tab analog yet for C6; mid-loop
SWIFT possibly mutating the goal without a per-cycle audit.

## 9. MULTI-TENANCY & SCALE (the platform goal — open architecture question)
The core must scale to many tenants and concurrent users. Open question for you: does an orchestrated-loop core
generalize to per-tenant isolated loops? What's the right tenancy boundary — per-tenant orchestrator, or a shared
orchestrator + per-tenant context-bundles + row-level-security data isolation? What breaks first at scale —
state isolation, the shared gates, the findings/CIE register, or cost?

## 10. HOW TO READ THE REST OF THE PACKAGE
This file is the background. The design file is the proposal. The two AI-COUNCIL files are the detailed
communication + edge-case (compaction/tab/agent-lifecycle) protocols. SHIPPABLE-GREEN is the completion standard.
Read them in the numbered order given in the cover (EXTERNAL-REVIEW-BRIEFING.md §A), then answer its questions.
