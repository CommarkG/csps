---
id: csps.principle.reuse-first
name: reuse-first-principle
description: The canonical reuse-first principle and its mechanical enforcers. Engraved across every pillar of CSPS. Solo-dev-scale enforcement of "check what exists, enhance the ratified thing, create new only with justification."
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
  - tier:internal
crosscutting:
  - reliability
  - observability
links:
  - { rel: parent, href: ./README.md }
  - { rel: rule-registry, href: ./rule-registry.md }
  - { rel: adr-template, href: ./adr-process.md }
domain_path: platform
---

# The Reuse-First Principle

## The canonical wording (use verbatim everywhere)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

**Counterweight clause** (per Sandi Metz / Kent C. Dodds AHA): *Enhance the ratified thing — unless the ratified thing is the wrong abstraction. Inline-and-redecide is always available.*

## Why this is load-bearing

A solo developer maintaining 30–75 SaaS apps cannot afford parallel implementations of the same concern. Drift between parallel implementations is the dominant cause of architectural decay. The reuse-first principle is what holds the kernel coherent.

This is the single most important behavior in CSPS. It applies to: skills, agents, plugins, slices, page templates, ZModel patterns, validators, generators, prose vocabulary, audit checks, ADRs, rules, planning documents.

## What "ratified" means

A "ratified" artifact is one that has:
1. Been merged to `main` (not a draft)
2. Has a `lifecycle: production` (or `beta`) frontmatter (not `experimental` or `deprecated`)
3. Has a slice contract score ≥90% (if it's a slice)
4. Has at least one usage (not orphaned per the audit's `orphan-file-detection` check)

Drafts, deprecated artifacts, and orphans are not ratified — but should be discovered before they're recreated. The catalog includes them; the enforcement weighs them appropriately.

## Mechanical enforcers

The principle survives only because each surface where it applies has a *mechanical assist* (a catalog query, a generator prompt, a CI check) that experiences the principle as *help*, not nagging. Listed in order of leverage:

### 1. Catalog-first generators (highest leverage)

Every `nx g platform:*` generator first runs a similarity search against `packages/catalog/catalog.json` and prints the top 5 matches before scaffolding:

```
$ nx g platform:slice Booking
Searching catalog for similar artifacts...

Top matches:
  1. csps.app-bookings.entity.reservation     (similarity: 0.87)
  2. csps.app-events.entity.appointment       (similarity: 0.71)
  3. csps.feature-pack.scheduling.session     (similarity: 0.62)

Enhance one of these? Or proceed with a new slice?
  [1-5] enhance match
  [n] new (requires --new flag)
  [q] quit and search more
```

Generators with `--new` flag override require the user to type a justification stored in the new artifact's `created-new-because:` frontmatter field.

### 2. AI prompt addendum

In workspace `CLAUDE.md` and every skill preamble:

> **Before proposing creation of any artifact (slice, skill, agent, page, ZModel pattern, validator, prose), query the catalog for existing matches and cite the closest. If you propose new, justify why enhancement of the closest match is wrong. The catalog is at `packages/catalog/catalog.json` and is exposed as MCP resources keyed by tag-tuple.**

This appears in every Claude Code session, every Cursor rule, every Mastra agent's system prompt.

### 3. Frontmatter contract

Every artifact's frontmatter includes one of:

```yaml
enhances: csps.app-bookings.entity.reservation   # preferred
# OR
created-new-because: |
  Searched catalog (query: "scheduling slot reservation"); closest match
  is csps.app-bookings.entity.reservation but its tier is Business and
  this needs to be Free-tier accessible. Refactor to make reservation
  tier-agnostic was scoped at 2 weeks; new slice is 3 days.
```

`validate-frontmatter.mjs` fails CI if neither field is present.

### 4. PR template field

```markdown
### Existing thing considered
- ID or path: <csps.X.Y.Z OR "searched, none found">
- Search query used: <terms>
- Reason for not enhancing: <if creating new>
```

Empty fields fail Danger.js check.

### 5. jscpd duplicate detection in CI

Runs in CI with `min-tokens: 50`, threshold 0.5%. Fails on regression (the file's duplicate count went up since main). This is a textual-similarity backstop for cases where catalog lookup missed a near-duplicate.

### 6. Reuse-rate audit metric

`tools/audit-runner` weekly check: % of new artifacts in last 30 days with `enhances:` set vs `created-new-because:`. **Displayed, not gated** (per Goodhart — gating on this metric incentivizes padding the `enhances:` field). Trend is what matters; absolute level can be tuned by judgment.

### 7. Intake queue (the "no slot exists" alert)

Every input — idea, bug, feature request, paste-from-Claude, screenshot — lands in one queue (`/admin/triage`) with required fields: `type`, `candidate-existing-thing-to-enhance`, `slice`, `owner`. If `candidate-existing-thing` is empty:
- First pass: system prompts "did you check the catalog? Here's a search link."
- Second pass: system flags "no slot exists for this input — protocol needed; opening intake-design ADR."

This is the user's literal request: *"every INPUT either has a place to be and a predefined process to follow OR the system alerts itself to solve one."*

## Defense-in-depth enforcer mapping (canonical: `principles.yaml#P-OP-001`)

The 7 enforcers above are the original mechanical assists. Per the [mechanical-enforcement architecture](./mechanical-enforcement.md), the principle now has **10 enforcers** in `packages/principles/principles.yaml#P-OP-001` (the 7 above plus 3 added by the mechanical-enforcement layer: MCP resource, MCP tool, audit-metric).

| # | Layer | Enforcer | Reliability |
|---|---|---|---|
| 1 | instruction-file | AGENTS.md (root) — cardinal principle #1 | Low (AI memory) |
| 2 | skill | `packages/skills/reuse-check/SKILL.md` | Medium |
| 3 | ai-prompt-addendum | AGENTS.md addendum: "query catalog before proposing creation" | Low |
| 4 | hook | `.claude/hooks/pre-tool-use-write.sh` (PreToolUse blocks if duplicate) | High (deterministic) |
| 5 | frontmatter-contract | `validate-frontmatter.mjs` (CI fails if neither `enhances:` nor `created-new-because:`) | Highest (CI) |
| 6 | pr-bot | Danger.js: existing-thing-considered field check | Medium-High |
| 7 | ci-check | jscpd duplicate-detection regression test | Highest (CI) |
| 8 | audit-metric | `libs/audits/checks/reuse-rate.ts` (displayed, not gated; trend signal) | Observable |
| 9 | mcp-resource | `principles://reuse-first` (queryable by any agent in any IDE / hosted app) | Cross-vendor |
| 10 | mcp-tool | `tools/check_reuse` (callable by any agent: returns existing-match candidates) | Cross-vendor |

This satisfies the **critical-severity minimum** per `P-META-001` (≥4 enforcers, ≥2 non-AI). The audit-the-audits meta-check verifies this on every PR — a principle without sufficient enforcers fails the build.

**Inheritance:** all 10 enforcers propagate to hosted apps (per the multi-level inheritance flow in [mechanical-enforcement.md](./mechanical-enforcement.md)) and travel with graduated apps via vendored copies of `principles.yaml`, `audit-runner`, and `principles-mcp`.

## Anti-patterns when over-applied

The principle has failure modes when taken to extremes:

- **God objects / God modules** — incremental "enhance existing" without splitting eventually produces an artifact that knows everything. Antidote: enhancement budget — once an artifact crosses N responsibilities or M LoC, the next "enhance" must be preceded by a `platform:split` (per [pillar 1 / module-folder-pattern.md](../pillar-1-architecture-and-stack/module-folder-pattern.md)).
- **Wrong-abstraction lock-in** (Sandi Metz, *The Wrong Abstraction*) — the more callers depend on the ratified thing, the more painful it is to discover it was wrong. Antidote: keep abstractions thin until rule-of-three.
- **Frankenstein artifacts** — flags-on-flags, options-on-options. Antidote: parameter-count lint (max 4 per function/component).
- **Coupling growth** — every "enhance existing" couples another caller to the abstraction. Antidote: track fan-in; flag when a single artifact has high fan-in across slice boundaries.
- **Conway-violating reuse** — forcing two services that should be independent to share a module so they can't evolve separately. Antidote: **slice boundaries override reuse**. Reuse *within* a slice is mandatory; reuse *across* slices requires promotion to `packages/*` with explicit ADR.
- **Premature graduation conflict** — CSPS apps are designed to be extractable. Forcing them to depend on platform internals defeats this. Antidote: only `packages/*` may be depended on by app code; `libs/*/internal/**` is forbidden.

## Where this principle is engraved

The principle appears in:

- The trunk index `MASTER_PLAN.md` (top-of-file, called out as load-bearing)
- This file (the canonical reference)
- Every pillar's `README.md` (preamble + reminder)
- The slice contract spec (check #N: `enhances` or `created-new-because` present)
- Every generator spec (catalog-first UX described)
- The skill ingestion contract (Stage 4 review questions: "is there a closer existing skill?")
- The ADR template (a section asks "what existing thing was considered?")
- The AI agent system prompt (workspace `CLAUDE.md`)
- The PR template (field above)
- The glossary (defined as a Term)
- The onboarding doc
- The audit runner spec (the 6 enforcers above are audit checks)
- The catalog browser UX (`/admin/catalog` opens to "search before create")
- The intake queue UX (`/admin/triage` requires the candidate-existing field)

**If you encounter a section that should reference this principle and doesn't, that's a bug — file an ADR via [adr-process.md](./adr-process.md).**

## How to avoid principle-fatigue

The validated antidote (per Backstage's documented "checks become wallpaper" failure mode):

1. **One canonical phrasing**, quoted verbatim. Not paraphrased. Different phrasings dilute.
2. **Section preambles**, not just one section. Every relevant section opens with a one-line reminder.
3. **Mechanical assists paired with every checklist item.** No nagging without help.
4. **Generator UX prompts** that interrupt with matches found.
5. **Reuse-rate metric displayed in the audit dashboard** as feedback, not punishment.

## Open questions / honest limits

- **Where does "always reuse" conflict with extraction-readiness?** CSPS apps must be extractable. Hard reuse of platform internals defeats this. Resolution: distinguish `packages/*` (public, extractable, may be depended on) from `libs/*/internal/**` (internal, must be inlined or copied at extraction).
- **Goodhart's Law on reuse rate.** If you measure %-enhanced, devs will pad the `enhances:` field to game it. Mitigation: don't gate on the metric; sample-audit `enhances:` justifications quarterly; track *trend*, not absolute level.
- **Solo-dev Conway risk.** One person *is* the org. Conway's Law still applies through *time* — the structures you build now constrain future-you. Slice boundaries should reflect bounded contexts you actually maintain in your head, not aspirational team boundaries.
- **The principle's own failure mode.** When "always enhance" turns into "never refactor wrong abstractions," CSPS will accrue Metz-style debt. The counterweight clause is the antidote — quote it as often as the main principle.

## Sources

- Sandi Metz — [The Wrong Abstraction](https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction)
- Kent C. Dodds — [AHA Programming](https://kentcdodds.com/blog/aha-programming)
- Andy Hunt + Dave Thomas — *The Pragmatic Programmer* (DRY)
- Linear — [Triage docs](https://linear.app/docs/triage) (the intake-queue pattern)
- Spotify — [Backstage 101](https://backstage.spotify.com/discover/backstage-101) + Soundcheck (catalog + scorecards)
- Netflix — [Paved Roads](https://netflixtechblog.com/how-we-build-code-at-netflix-c5d9bd727f15)
- Stripe — [Minions coding agents](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents) (catalog-first AI generation)
- jscpd — [duplicate detection tool](https://jscpd.dev/)
