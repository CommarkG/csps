---
id: csps.governance.operating-principles
name: operating-principles
description: The four operating principles for cognitive-load-aware human-AI collaboration in CSPS — Reuse-first, FWWS (Finish What We Started), PCR (Pros/Cons/Recommendation), Batched Execution. Each independently defined with industry lineage and per-layer mechanical enforcer mapping.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:doc
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - observability
links:
  - { rel: parent, href: ./README.md }
  - { rel: enforcement-architecture, href: ./mechanical-enforcement.md }
  - { rel: registry, href: ../../../packages/principles/principles.yaml }
  - { rel: reuse-first-detail, href: ./reuse-first-principle.md }
domain_path: platform
diataxis_type: reference
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# Operating Principles

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The four operating principles that govern how humans and AI assistants collaborate to build CSPS. Each principle is independently defined (no forced bundling) but they share a philosophical premise: **respect the cognitive load and time of the human in an AI-assisted loop.**

This document is the human-readable companion to `packages/principles/principles.yaml` (7 operating principles: P-OP-001 to P-OP-004 + P-OP-006). The yaml is the source of truth for enforcer maps; this document is where the *why* and the *industry lineage* lives in narrative form.

## The shared philosophical premise (acknowledged, not bundled)

The four operating principles all map to John Sweller's Cognitive Load Theory (1988), which identifies three load types:

| Load type | Principle that addresses it |
|---|---|
| **Germane load** (productive cognitive effort on the task) | **FWWS** protects it (don't fragment across half-finished threads) |
| **Intrinsic load** (irreducible task complexity) | **PCR** chunks it (decision package format) |
| **Extraneous load** (cognitive overhead unrelated to the task) | **Batched execution** eliminates it (no mechanical micro-stops) |

**Reuse-first** sits across all three — it reduces germane load (no re-deriving solved problems), intrinsic load (existing things are already understood), and extraneous load (less duplicate maintenance).

The principles are NOT bundled into a single umbrella concept ("Cognitive-Load-Aware Collaboration") because the user is correct that bundling creates a future problem: someone looking up "how should AI present decisions" shouldn't wade through completion discipline to find it. Each principle has its own self-contained section.

---

## P-OP-001 — Reuse-First

### Canonical wording

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

**Counterweight:** *Enhance the ratified thing — UNLESS the ratified thing is the wrong abstraction. Inline-and-redecide is always available.*

### Why this is load-bearing

A solo developer maintaining 30–75 SaaS apps cannot afford parallel implementations of the same concern. Drift between parallel implementations is the dominant cause of architectural decay. Reuse-first is what holds the kernel coherent.

### Industry lineage

- **Andy Hunt + Dave Thomas** — *Pragmatic Programmer* (1999), DRY principle: "Every piece of knowledge must have a single, unambiguous, authoritative representation"
- **Sandi Metz** — [The Wrong Abstraction](https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction) (2016): "duplication is far cheaper than the wrong abstraction" (the counterweight clause)
- **Kent C. Dodds** — AHA Programming: "Avoid Hasty Abstractions"
- **Don Roberts** (via Martin Fowler, *Refactoring* 1999) — Rule of Three

### Mechanical enforcers (10 layers)

See `packages/principles/principles.yaml#P-OP-001` for the complete list. Summary:

1. **AGENTS.md** — stated as cardinal principle #1
2. **Skill `/reuse-check`** — slash command queries catalog
3. **AI prompt addendum** — AI MUST query catalog before proposing creation
4. **PreToolUse hook** — Write/Edit triggers catalog grep
5. **Frontmatter contract** — `enhances:` or `created-new-because:` required
6. **PR bot (Danger)** — "Existing thing considered" PR field validated
7. **CI check (jscpd)** — duplicate detection regression test
8. **Audit metric** — reuse-rate displayed (not gated, per Goodhart)
9. **MCP resource** — `principles://reuse-first` queryable by any agent
10. **MCP tool** — `tools/check_reuse` callable by any agent

Defense in depth: the principle survives any single layer's failure.

### See also

Full details + the 7 anti-patterns + the engraving locations in [reuse-first-principle.md](./reuse-first-principle.md).

---

## P-OP-002 — FWWS (Finish What We Started)

### Canonical wording

> **Finish What We Started. Resist drift to new work while in-flight work is incomplete.**

**Counterweight:** *Unless completing creates more debt than abandoning. Park threads explicitly with stated reason — do not leave them silently in-flight.*

### Why this is load-bearing

Without WIP discipline, parallel branches accumulate, half-shipped features pile up, and "we'll come back to it" debt compounds. Goldratt's *The Goal* opens with this exact pathology — a plant where everything is started, nothing finishes, and throughput collapses despite high local utilization. The clinical signature: high commit volume, low merged-PR completion rate, declining lead time.

For a solo developer, FWWS is the discipline that prevents the perpetual-pivot startup pathology.

### Industry lineage

- **David J. Anderson** — Kanban Method (2010): "Stop Starting, Start Finishing" + WIP limits as enabling constraint. The canonical Kanban mantra.
- **Eliyahu Goldratt** — *The Goal* (1984): Theory of Constraints; finish bottleneck before adding more
- **Scrum** — Definition of Done as completion contract
- **Lean / Toyota Production System** — single-piece flow
- **Cal Newport** — *Deep Work*; completion under sustained attention; "shiny object" as the enemy

### Configuration (in `principles.yaml#P-OP-002.config`)

```yaml
max_in_flight_slices: 3
max_in_flight_apps: 2
stale_threshold_days: 14
park_requires_reason: true
```

### Mechanical enforcers (8 layers)

1. **AGENTS.md** — cardinal principle #2; references `/wip-check` skill
2. **Skill `/wip-check`** — queries in-flight ledger; reports threshold status
3. **PreToolUse hook** — blocks new slice creation if WIP exceeded; offers `/wip-check` or explicit park
4. **Pre-commit (lefthook)** — blocks commits adding new slices/apps when WIP exceeded
5. **PR bot (Danger)** — comments on PR if violation slipped through
6. **CI check** — hard-fails build if WIP exceeded
7. **Scorecard** — WIP count per app, trend over time, displayed in admin dashboard
8. **MCP resource** — `principles://fwws` + in-flight ledger as `principles://wip-ledger`

### Anti-patterns FWWS resists

- **Perpetual pivot** — start everything, finish nothing (Goldratt's bottleneck collapse)
- **Silent park** — threads abandoned without explicit park + reason
- **Shiny object syndrome** — new work always preferred to in-flight closure

### Operational note

FWWS applies to **the human + AI together**. The AI assistant should:
1. Run `/wip-check` at session start
2. Before proposing new slice/app/pillar work, verify WIP isn't exceeded
3. If user requests new work and WIP is full: PCR-format the trade-off (finish X first vs park X for explicit reason vs accept WIP-cap-bypass)

---

## P-OP-003 — PCR (Pros, Cons & Recommendation)

### Canonical wording

> **When presenting decisions, use Pros, Cons, & Recommendation format.**
> Present the option set + trade-offs + recommended path as a chunked decision package.

### Why this is load-bearing

Humans cannot hold many details and complexities in working memory simultaneously, but CAN make optimal decisions if information is structured correctly. Sweller's Cognitive Load Theory: working memory holds ~4 chunks. PCR is chunking-for-decisions.

The format prevents two failure modes simultaneously:
- **Recommendation without options** — no trade-space exposed; reader can't evaluate quality of choice
- **Options without recommendation** — analysis paralysis; decision punted back to the human

### Scope note

PCR applies to decisions with **non-trivial trade-space**. For trivial reversible choices (two-way doors at low cost — Bezos terminology), just decide. PCR overhead on tiny decisions is friction without benefit.

### Industry lineage

- **MADR (Markdown Architectural Decision Records)** — the structural ancestor: Considered Options + Pros and Cons + Decision Outcome
- **BLUF (Bottom Line Up Front)** — US Army Regulation 25-50 (2001): recommendation-first communication discipline
- **John Sweller** — Cognitive Load Theory (1988): chunking for decisions
- **Amazon 6-pager / PR-FAQ** — Bezos (2004): narrative trade-space document
- **McKinsey Rule of Three** — structuring recommendations as exactly three MECE alternatives

### Format specification

A PCR has three blocks in this order:

1. **Options** — table or bulleted list of N alternatives (typically 2–4)
2. **Pros / Cons** — per-option trade-offs (table format preferred)
3. **Recommendation** — chosen option + one-paragraph reasoning + open questions (if any)

### Mechanical enforcers (4 layers)

PCR is primarily an AI behavior instruction; lower-stakes than FWWS or reuse-first, so fewer enforcers.

1. **AGENTS.md** — cardinal principle #3; default format for decision-shaped questions
2. **Skill `/pcr`** — slash command produces canonical 3-block output
3. **AI prompt addendum** — decision-shaped questions trigger PCR by default
4. **MCP resource** — `principles://pcr` with format spec for any agent

### Anti-patterns PCR resists

- **Recommendation-without-options** — no trade-space exposed; reader can't evaluate
- **Options-without-recommendation** — analysis paralysis; decision punted
- **False balance** — pros/cons rigged to support a predetermined recommendation (the discipline is *honest* trade-off exposure)

### Note on origin

PCR was originally an AI behavior instruction the user developed in a previous platform. Adopting it in CSPS as a mechanical principle (skill + AGENTS.md instruction + MCP resource) makes it survive across sessions, vendors, and agents — not dependent on any single AI assistant remembering to use it.

---

## P-OP-004 — Batched Execution (with upfront acceptance)

### Canonical wording

> **For N similar units of work: agree acceptance criteria upfront, batch the execution, deliver a single comprehensive completion summary. No mechanical micro-stops.**

### Why this is load-bearing

When an AI assistant is doing N files of similar work (migrating 25 leaf documents, refactoring 12 components, applying a vocabulary rename across 50 files), per-file approval requests destroy human productivity:
- 23 minutes 15 seconds to fully regain focus after one interruption (Gloria Mark, UC Irvine)
- 20–40% velocity loss to inefficient code review when synchronous and per-item (Code Climate research)
- HBR 2022: knowledge workers toggle apps ~1,200×/day, losing ~9% of annual hours

The cure is Mission Command doctrine: agree on intent + acceptance criteria upfront, decentralize execution, deliver the comprehensive result.

### Industry lineage

- **Mission Command (Auftragstaktik)** — Prussian/German military doctrine; NATO keystone — commander's intent + decentralized execution + trust + mutual understanding
- **Scrum** — Definition of Done + acceptance criteria; agreement before execution starts
- **Bezos (Amazon)** — two-way doors: reversible decisions don't need escalation
- **Lean / Kanban** — pull-based work (executor pulls when ready)
- **GitLab handbook** — async-first, batched-review pattern

### Configuration (in `principles.yaml#P-OP-004.config`)

```yaml
threshold_n: 3                # 3+ similar operations triggers batched mode
max_batch_size: 25            # cap before mid-checkpoint suggested
escape_hatch_required: true
```

### Escape hatch

When the executor mid-batch discovers acceptance criteria were wrong: **pause, re-confirm with user**. Do NOT silently adjust scope. Mission Command "disciplined initiative" applies — the executor adjusts toward intent, but in collaboration mode adjustment requires re-confirmation.

### The workflow (engraved in AGENTS.md)

1. AI detects N≥3 similar pending operations
2. AI proposes acceptance criteria upfront in **one** message (PCR format if non-trivial)
3. User approves once (or vetoes specific items)
4. AI executes the full batch without per-item approval requests
5. AI presents a **single completion summary** with deviations flagged
6. If mid-batch discovers a problem, AI pauses + re-confirms (does not silently adjust)

### Mechanical enforcers (4 layers)

1. **AGENTS.md** — cardinal principle #4; explicit workflow for N≥3 similar operations
2. **Skill `/batched-plan`** — structures the upfront-acceptance proposal
3. **PreToolUse hook** — detects N similar pending operations; prompts to consolidate into batched-acceptance flow
4. **AI prompt addendum** — explicit instruction: detect N>1 → propose criteria once → batch → single summary

### Anti-patterns batched execution resists

- **Micro-approval drag** — per-item approval requests; ~20–40% velocity loss
- **Silent scope creep** — mid-batch adjustments without re-confirmation
- **Batch-too-large** — N > max_batch_size without intermediate checkpoint

---

## How these four principles get inherited

Per [mechanical-enforcement.md](./mechanical-enforcement.md), all four operating principles propagate through the same four channels:

1. **AGENTS.md cascade** — per-app `AGENTS.md` files extend the platform's
2. **Shared MCP server** — `packages/principles-mcp/` exposes them; every agent connects
3. **Mastra `BaseAgent`** — pulls platform principles from MCP at construction; subclasses inherit
4. **Audit-runner package** — same checks run at every level (platform, app, on-demand via MCP)

When an app graduates as standalone via `nx g extract-app`, all four principles travel with it (vendored copies of `principles.yaml`, audit-runner, and MCP server).

## Open questions / things to revisit

- **PCR scope boundary** — when is a decision "trivial enough" to skip PCR? Currently judgment-call; may need a heuristic (e.g., "if reversal cost < 5 minutes, skip PCR").
- **FWWS WIP threshold** — defaults are 3 slices / 2 apps. May need tuning based on actual flow rate. Add audit metric: "average completion time per WIP-cap-bypass."
- **Batched-execution failure mode** — what if user wants a per-item review for a SPECIFIC batch (e.g., security-sensitive migrations)? The escape: user can pre-emptively request "per-item mode" before batch starts; AI honors and offers per-item approvals.
- **Acronym memorability** — FWWS, PCR are user's coinages from previous platform; "batched execution" is descriptive (no acronym). Watching whether users want a 3-letter shorthand for the fourth (BAE was rejected per trademark; ACBE was rejected per memorability; descriptive name accepted for now).
