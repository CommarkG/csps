---
id: csps.pillar-0-governance.csps-opus-tab-operating-discipline
name: CSPS-OPUS-TAB-OPERATING-DISCIPLINE
description: >
  CSPS operating discipline for running the platform from ONE persistent Opus tab by spawning
  Sonnet-agents (build) and Haiku-agents (mechanical scan/verify). Adopts CDS's ratified
  "One Opus Tab + Haiku/Sonnet Agents" methodology, made CSPS's own: CSPS vocabulary only
  (no CDS-internal identifiers), composes with the existing haiku-spawn-template.md and
  class-b-agent-spawn-preamble.template.md rather than duplicating them, and reconciles CDS's
  "paste the section" rule with CSPS's CONTEXT-BUDGET "pointers not payloads" rule. Formalizes
  Part A of OPUS-S089-OPERATING-MODEL-AND-MODEL-ECONOMY-SEED.md.
version: "1.0"
owner: group:finky
authored_by: SONNET-S089
core_spine: GVRN
core_spines: [GVRN, AI, OPER]
schema_anchor: pillar_0_governance_leaves
impl_status: swift-implemented
diataxis_type: how-to
lifecycle: production
lifecycle_state: active
status: active
ns_quality: AI-optimized
precedent_checked: true
session: S089
tags:
  - domain:governance
  - domain:ai
  - type:how-to
  - audience:ai-agent
links:
  - { rel: composes, href: ../../../tools/templates/haiku-spawn-template.md }
  - { rel: composes, href: ../../../tools/templates/class-b-agent-spawn-preamble.template.md }
  - { rel: seed, href: ../_handoff/OPUS-S089-OPERATING-MODEL-AND-MODEL-ECONOMY-SEED.md }
  - { rel: enforced-by, href: ../../../.claude/hooks/pre-tool-use-agent-alignment.sh }
  - { rel: enforcer-contract, href: ./behavioral-contracts/B_AGENT_ALIGNMENT_PROTOCOL.md }
---

# CSPS Opus-Tab Operating Discipline

> **One Opus tab. Everything else is a spawn.** Governor talks to Opus. Opus judges, ratifies, and
> writes prompts. Sonnet builds. Haiku scouts. This document is the working guide for that split —
> it composes with [haiku-spawn-template.md](../../../tools/templates/haiku-spawn-template.md) and
> [class-b-agent-spawn-preamble.template.md](../../../tools/templates/class-b-agent-spawn-preamble.template.md);
> it does not replace either. Formalizes Part A of
> [OPUS-S089-OPERATING-MODEL-AND-MODEL-ECONOMY-SEED.md](../_handoff/OPUS-S089-OPERATING-MODEL-AND-MODEL-ECONOMY-SEED.md).

---

## §1 — Core principle

| Model | Role | Owns | Never does |
|---|---|---|---|
| **Opus** | Brain — judgment, WHY, ratification | Architecture calls, Governor conversation, semantic Zero-Findings, ratifying Sonnet's work, writing spawn prompts, reviewing returns | Build/write code or docs directly (that is builder-sprawl — the exact failure the seed names) |
| **Sonnet** | Builder — implement, write | Files, validators, hooks, docs, PROTO execution, SROF (Sonnet→Opus report) | Self-approve architecture/corespine/constitutional changes |
| **Haiku** | Scout — mechanical, verify | Grep/inventory sweeps, presence checks, ≥4-independent-check scans, `haiku_scout_return` findings | Decide, synthesize, recommend, edit files |

Opus is expensive; spend it on judgment only. Every turn an Opus tab burns Opus tokens even on
builder-relay overhead — the seed's Part A finding. Moving to spawned Sonnet/Haiku agents makes
the token economy structural, not just disciplined.

---

## §2 — Spawn decision rule (the <30s-inline threshold, reconciled with CONTEXT-BUDGET)

Two heuristics point at the same answer; use **either firing → spawn**, **both clear → inline**:

1. **CSPS count rule** (existing, `tools/templates/haiku-spawn-template.md` §0/§1.5): ≥4 independent
   mechanical checks → spawn Haiku. ≤3 checks → inline (Read/Grep/Bash directly in the Opus tab).
2. **CDS time rule (adopted, CSPS terms):** if Opus could do the whole task by hand in **under 30
   seconds** (one Read, one Grep, one quick lookup), do it inline. If it would take longer — file
   volume, multi-step reasoning, actual writing — spawn.

```
                 ≥4 independent checks   OR   would take >30s inline?
                              │
                    YES ──────┴────── NO (both clear)
                     │                  │
                  SPAWN               INLINE
           (Sonnet build / Haiku scan)  (Read/Grep/Bash in Opus tab)
```

**Is this Opus-tier judgment** (architecture / ratification / "is this the right structure?" / WHY)?
That question is checked FIRST and is orthogonal to the count/time rule — judgment never spawns
downward; it stays in the Opus tab regardless of how fast it would run (§6).

Reference: `pre-tool-use-agent-alignment.sh` BLOCKS any `Agent()` call missing the `CONTEXT-BUDGET:`
attestation — the count/time gate above is what you ran to be able to write that line honestly.

---

## §3 — THE RECONCILIATION (paste vs. pointer)

CDS's guide says *"paste the section, don't reference."* CSPS's CONTEXT-BUDGET rule says *"pointers
not payloads, prompt < 2KB"* (born from the S084 Haiku prompt-overflow: a spawn inherited the full
MCP tool-definition surface and died at ~209,550 tokens before the task even loaded). Both are
correct in their own regime. The reconciliation:

> **Fits under budget → PASTE. Doesn't fit → POINTER. NEVER paste the corpus.**

- **PASTE** a small, bounded extract (a function, a 10-line YAML block, one finding, one file's
  frontmatter) directly into the prompt when it is short enough that the agent needs NO read-tools
  to act on it, and the whole prompt stays well under the ~2KB text budget.
- **POINTER** (file path + line range, e.g. `docs/plan/pillar-0-governance/foo.md:120-180`) for
  anything large — a full file, a directory, a governance corpus, multi-file context. The spawned
  agent reads the bounded slice itself; you never paste the source material that produced the
  pointer.
- **NEVER** paste the governance corpus, an entire behavioral-contracts file, or any multi-file
  context into a spawn prompt — that is the S084 failure mode restated, and it is what
  `tools-restricted | pointers-only` in the CONTEXT-BUDGET line attests you did NOT do.

This is a size test, not a style preference: measure the extract, don't guess.

---

## §4 — The 5-element spawn-prompt template

Every Opus-tab spawn (Sonnet-agent or Haiku-agent) uses this 5-element shape. The two CSPS
attestation lines are **mandatory** — `pre-tool-use-agent-alignment.sh` BLOCKS the spawn (exit 2)
without them.

```
BOUNDARY CROSSING — Type B (AI→subagent):                              ← MANDATORY, line 1
I understand the request as: [Layer 3 intent — why this spawn exists]
I will produce: [specific output — file written / findings table / verdict]
This serves: [platform goal this spawn advances]

CONTEXT-BUDGET: spawn-warranted | tools-restricted | pointers-only     ← MANDATORY, line 2
VERIFIER MODE (only if re-deriving a "done" claim): Your job is to find FALSE.
CANNOT-CONFIRM is expected and MORE valuable than uncertain agreement.  ← §0.6 anti-agreeableness

ROLE:        [Opus / Sonnet / Haiku — which persona the agent is acting as, and its boundary]
CONTEXT:     [what's already known/decided — PASTE if small (§3) or POINTER if large]
TASK:        [the specific unit of work — one sentence, imperative]
CONSTRAINTS: [hard NOs — B_* contracts to honor, files not to touch, scope not to expand]
OUTPUT:      [exact return shape] + DONE SIGNAL: [the one fact that proves completion]
```

- **Haiku-agent spawns:** use this shape for the two attestation lines + ROLE/CONTEXT framing, then
  switch to the full `haiku_scout_return` schema in
  [haiku-spawn-template.md §2/§4](../../../tools/templates/haiku-spawn-template.md) for TASK/OUTPUT —
  do not invent a competing findings format.
- **Sonnet-agent spawns (build tasks):** use this shape directly; compose the acknowledgement /
  output-contract portions with the T2.0 scaffold in
  [class-b-agent-spawn-preamble.template.md §2](../../../tools/templates/class-b-agent-spawn-preamble.template.md)
  where a Class B subagent type (`Explore`, `general-purpose`) is used. OUTPUT for a Sonnet build
  spawn is the SROF shape (`tools/templates/sonnet-report.template.md`): DONE/FOUND/VERIFY line +
  file paths touched.

---

## §5 — The canonical sequence

```
1. Opus SPEC     → writes the 5-element prompt (§4), decides Sonnet vs Haiku vs inline (§2)
2. Sonnet BUILD  → implements; writes SROF to sonnet-turn.md; runs its own validators
3. Haiku VERIFY  → (if spawned) scans/re-derives specific claims; returns haiku_scout_return
4. Opus REVIEW   → reads SROF + Haiku return; re-derives HIGH-VALUE/MOST-UNCERTAIN claims per
                    the Council Peer Contract — does not accept self-cited "done" at face value
5. Opus RATIFY   → seals the outcome (writes the SEAL; a read-only spawned agent cannot write it —
                    it returns the verdict + exact seal-content, the Opus tab applies it)
```

A step is skippable only when trivially reversible (§2's judgment check says "no"); skipping step 4
(Opus re-derivation) is the anti-pattern this sequence exists to prevent — a claim without
independent re-derivation is not yet a ratified fact.

---

## §6 — What stays in the Opus tab (never spawned downward)

- Governor conversation and advisory (all of it — the Governor talks to Opus, not to an agent)
- Ratification review and sealing (§5 step 5 — write access to seals stays with the persistent tab)
- Semantic Zero-Findings (judgment calls about whether a claim is actually true, not just formatted correctly)
- Propagation decisions (does this insight/fix apply elsewhere — a synergy judgment call)
- Conflict escalation (Sonnet/Haiku returns disagree, or a spawn hits a boundary it cannot resolve)
- Writing spawn prompts (§4) — Opus authors every ROLE/CONTEXT/TASK/CONSTRAINTS/OUTPUT block
- Output review (reading SROF + haiku_scout_return and deciding ACCEPT / COURSE-CORRECT / RE-SPAWN)

Two escalation cases keep a full on-demand Opus **tab session** (not agent) per the seed: Governor↔
Opus strategy sessions, and full-system deep audits (5-mental-models) that exceed a bounded package.
Default is Sonnet/Haiku-agent; escalate to a fresh Opus tab only for those two.

---

## §7 — Cost levers

| Lever | Rule |
|---|---|
| **Haiku-first** | Any ≥4-check mechanical sweep goes to Haiku, never Sonnet or Opus (routing waste otherwise) |
| **Precise prompts** | A vague TASK line produces a vague return that Opus must re-spawn to fix — precision in §4 is itself a cost lever, not just a style preference |
| **Batch** | Independent Haiku scans fan out in ONE message with multiple Agent() calls, not sequential spawns — each spawn pays fixed context-inheritance cost |
| **Review-not-redo** | Opus reviews and course-corrects a Sonnet/Haiku return (§5 step 4); it does not silently redo the work itself — redoing defeats the entire economy this document exists to protect |

---

## §8 — Pre-spawn checklist

Before calling `Agent()`, confirm all of:

- [ ] **Judgment check** — is this actually Opus-tier (architecture/ratification/WHY)? If yes, STOP — stays in tab (§6).
- [ ] **Spawn-vs-inline** — ≥4 checks OR >30s inline? If both clear, run inline instead (§2).
- [ ] **Persona choice** — Sonnet (build) or Haiku (scan/verify)? Pick per §1.
- [ ] **Paste-or-pointer sized** — every CONTEXT item measured against the fits-under-budget test (§3); no corpus pasted.
- [ ] **Both attestation lines present** — BOUNDARY CROSSING block + `CONTEXT-BUDGET:` line (§4) — the hook blocks without them.
- [ ] **VERIFIER MODE line added** if this spawn re-derives someone's "done" claim (§4, §0.6).
- [ ] **DONE SIGNAL named** — the one fact that proves the spawn's output is complete, stated in OUTPUT.
- [ ] **Composed, not duplicated** — Haiku spawns route to `haiku_scout_return`; Sonnet build spawns route to SROF. No new return format invented.

---

## §9 — Parallel research lane (Governor directive, S089)

The one-persistent-Opus-tab model does NOT mean work serializes on Opus. A **second tab (Sonnet-
tier) may run a parallel RESEARCH + DRAFT-PLAN lane** so the Governor can promote research and
suggestions without waiting on Opus's review cycle.

**Allowed in the parallel lane (no gate wait):** research, investigation, drafting PROTOs / plans /
option-analyses, harvesting external inputs, writing draft decision-ledgers. All of it is
*proposal-grade* — routed to Opus via `tools/council/sonnet-turn.md` → reviewed in
`tools/council/opus-turn.md`.

**NOT allowed in the parallel lane:** implementation. No `apps/`, `libs/`, validators, hooks, or
skills land from the research lane. This is not a courtesy — it is **mechanically enforced** by
three existing gates, so the lane cannot silently cross into building:
- `validate-consensus-before-code.mjs` (B_CONSENSUS_BEFORE_CODE) — implementation commits with zero
  consensus-queue activity BLOCK.
- `validate-spawn-trigger.mjs` (B_SPAWN_TRIGGER_GATE) — HIGH-SCOPE governance changes without a
  recorded Opus verdict BLOCK.
- `validate-no-implementation-without-plan.mjs` — implementation without a ratified plan (advisory
  now; flips BLOCKING under PLAN-PIPELINE-SPINE).

**The Governor's lever:** promote/prioritize any draft in parallel at any time. Implementation still
waits for the **two-party seal** (Opus review + Governor go) — the seal is what the gates above
protect, and it is unchanged. What changed: drafting no longer blocks on Opus; only *building* does.

**Producer≠auditor:** the tab that drafts a plan is not the sole party that approves it before
build. This is why the research lane's output is proposal-grade until Opus (a second party) reviews
it — the exact discipline the 3 S089 PROTOs (shadcn-ui, graphify-portability, background-removal-
schema) already followed.

---

## Decision ledger

**CHOSEN:** One persistent Opus tab + spawned Sonnet-agents (build) + spawned Haiku-agents (scan/
verify), governed by the §2 spawn-decision rule and the §3 paste-vs-pointer reconciliation, with
CSPS's existing attestation hooks (`pre-tool-use-agent-alignment.sh`) as the mechanical enforcement
layer — composing with, not duplicating, `haiku-spawn-template.md` and
`class-b-agent-spawn-preamble.template.md`.

**REJECTED — keep two persistent tabs (Opus + Sonnet), Governor relays between them.** Reasoning:
burns Opus tokens on every turn including builder-relay overhead; role-sprawl (Opus doing Sonnet's
build work) is only disciplined against, not structurally prevented — the exact failure the seed
was written to fix. Per `OPUS-S089-OPERATING-MODEL-AND-MODEL-ECONOMY-SEED.md` Part A.

**REJECTED — adopt CDS's "paste the section" rule verbatim, drop CSPS's pointer rule.** Reasoning:
CSPS's CONTEXT-BUDGET rule exists because of a measured incident (S084: a Haiku spawn inherited the
full MCP tool-definition surface and died at ~209,550 tokens before its task loaded). Dropping the
pointer discipline reintroduces that failure mode for any large-context spawn. §3's size-test
reconciliation keeps CDS's speed benefit for genuinely small extracts without reopening S084.

**REJECTED — pure Sonnet-drives-all with Opus fully on-demand and no mechanical spawn-trigger.**
Reasoning (from the seed's Sonnet 4-persona review): without a mechanical gate, Sonnet under-spawns
Opus to move faster — the token saving would be bought by skipping architecture review, not by
genuine efficiency. This document keeps the judgment-check as the FIRST checklist item (§8).
The mechanical Opus-spawn-trigger gate (named in the seed's REVIEW OUTCOMES as the TOP FIX) is now
BUILT and sealed: `validate-spawn-trigger.mjs` + `B_SPAWN_TRIGGER_GATE` + `opus-agent-spawn-
template.md`, wired into verify.mjs + audit-runner (S089). Discipline no longer stands alone.

---

**CHOSEN (§9 — S089 Governor directive): a parallel Sonnet-tier RESEARCH + DRAFT-PLAN lane**, so
the Governor can promote research/suggestions without serializing on Opus's review — proposal-grade
output only, routed via the council relay, with implementation held behind the two-party seal that
the consensus/spawn-trigger/no-impl-without-plan gates already enforce.

**REJECTED — let the parallel tab also implement once the Governor ratifies a batch.** Reasoning:
producer≠auditor — a tab that drafts a plan should not be the sole approver before building it;
Governor ratification of a batch is a go-signal for the *seal*, not a substitute for the independent
(Opus) technical review the seal exists to capture. Sonnet itself argued this exact point when it
declined to build shadcn/ui despite ratification. Keeping build behind the seal costs a review
round-trip but preserves the second set of eyes on every consequential diff.

**REJECTED — keep everything serial (no parallel lane), Opus reviews before any research proceeds.**
Reasoning: research and drafting are reversible, proposal-grade, and mechanically fenced from
implementation — gating them on Opus wastes the Governor's parallel bandwidth for no safety gain.
The gates protect *building*, not *thinking*.
