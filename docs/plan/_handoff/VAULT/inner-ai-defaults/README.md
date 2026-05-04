---
id: csps.handoff.vault.inner-ai-defaults
name: inner-ai-defaults
description: The inner-AI-defaults registry — formalized capture + saving + continuous reference of training-baked defaults that AI brings into CSPS work. Per P-META-017 (CSPS-Alignment-Over-Inner-Defaults) — for each registered default, declare disposition (keep / override / adjust); validators catch leaks at session-close + cross-session drift over time. The registry is itself a living artifact updated as new defaults discovered + as AI evolves through model upgrades. Per user S006 turn 6 directive "you must formalize now the collection and saving of your inner coding and create a system of considering it all the time".
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: registry-canonical
template_status: novel-pending-pattern-evaluation
core_spines: [AI, GVRN, VALD]
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:experimental
diataxis_type: reference
links:
  - { rel: parent, href: ../README.md }
  - { rel: governs, href: ../../pillar-0-governance/csps-core-manifest.md }
  - { rel: composes-with, href: ../template-registry.md }
  - { rel: principle, href: ../../../../packages/principles/principles.yaml }
session: S006
---

# Inner-AI-Defaults Registry

> **Per P-META-017 (CSPS-Alignment-Over-Inner-Defaults):** every AI output is gated by alignment against this registry. Training-baked defaults that conflict with CSPS get overridden; defaults that compose well get kept; partials get adjusted. The registry IS the override map.

## Why this exists

AI training bakes in patterns: generic naming, reflexive try/catch, sycophantic prose, narrative comments, sequential tool calls, hedging, premature agreement, and dozens more. These patterns are MOSTLY good for general-purpose work. They drift CSPS work toward generic-AI-output rather than CSPS-DNA-aligned-output.

**The registry's job:** make the drift VISIBLE + MECHANICAL to catch.

For each registered default:
- **What it is** (the training pattern with concrete example)
- **What CSPS requires** (the aligned pattern)
- **Disposition:** `keep` (default is fine) / `override` (full replacement) / `adjust` (partial modification)
- **Reason** (why this disposition; cite memory entry / contract / principle)
- **Caught by validator** (which audit slug catches violations)
- **Examples** (default vs aligned, side-by-side)

## Per-entry schema

```yaml
---
id: <category>-<kebab-slug>
category: code | prose | reasoning | tooling | output
default_pattern: |
  <verbatim-or-near-verbatim what AI does by training default>
csps_aligned_pattern: |
  <what CSPS requires instead>
disposition: keep | override | adjust
adjust_specifics: |
  <if disposition=adjust: what to keep + what to change>
reason: |
  <why this disposition; cite source>
caught_by_validator: <audit-slug>
example_default: |
  <concrete code/prose/decision example showing the default>
example_aligned: |
  <concrete example showing aligned version>
discovered_in_session: S<NNN>
last_validated: <date>
status: active | superseded | obsolete
---
```

## Categories (one file per category)

| File | Category | Coverage |
|---|---|---|
| [code-patterns.md](./code-patterns.md) | `code` | Function shape / error handling / naming / tests / schemas / API endpoints / type strictness |
| [prose-patterns.md](./prose-patterns.md) | `prose` | Voice / narration / hedging / sycophancy / confirmation-seeking / over-narration |
| [reasoning-patterns.md](./reasoning-patterns.md) | `reasoning` | Decision framing / planning / batching / finishing-fast urge / N-part splits / single-instance vs multi-session |
| [tooling-patterns.md](./tooling-patterns.md) | `tooling` | Tool selection / parallelism / command shape / Read-vs-Glob-vs-Grep / sub-agent invocation |
| [output-distribution.md](./output-distribution.md) | `output` | Response shape / structure / link discipline / table usage / BLUF vs preamble |
| [continuous-drift-log.md](./continuous-drift-log.md) | append-only | New defaults discovered in-session — promotes to category file after K=2 |

## How the registry is consulted

### At AI output time (every substantial output)

1. AI's draft response considers — explicitly or implicitly — what training-defaults would produce
2. Pre-output check (B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS): for each known default in the registry, does my draft show the override pattern OR the default pattern?
3. If draft shows default: revise to aligned BEFORE emit
4. Substantial outputs cite alignment-check passed via `§10.0h alignment-citation summary` in closing-summary

### At session close

`inner-default-leak-detector` validator runs over chat transcript + edited files:
- Pattern-matches known defaults (regex + NLP heuristics)
- Reports any unaligned instance in §10.0g closing-summary header

### Continuously (cross-session)

| Cadence | Mechanism |
|---|---|
| Per-session | inner-default-leak-detector at session close |
| Per-week | alignment-drift-over-time — diffs current session output patterns vs 4-weeks-ago snapshot; surfaces evolved-default emergence |
| Per-quarter | inner-default-registry-coverage — full audit of registry entries vs current AI behavior; flags obsolete + missing |
| Per-major-model-update | Mandatory full re-registration sweep + each entry re-validated |

## How to add a new entry

When AI catches itself producing a training-default pattern that conflicts with CSPS:

1. **Inline:** add entry to `continuous-drift-log.md` with full schema
2. **At session close:** if K=2 (entry appeared 2+ times this session OR across 2+ recent sessions), promote to appropriate category file
3. **Always atomic:** validator slug registered in audit-runner.md/audit-hub.md per FSE amendment
4. **Cross-link:** if disposition=keep, no further action; if override/adjust, surface in closing summary §10.0g

## Authority

| Decision | Authority |
|---|---|
| Whether a pattern is registered | AI initiates; user-as-Governor confirms via session ratification |
| Disposition (keep/override/adjust) | User-as-Governor (AI proposes; user decides) |
| Promotion from continuous-drift-log to category file | AI proposes after K=2; user ratifies |
| Removal of entry (becomes obsolete) | User-as-Governor (with reason in entry) |

## Maintenance

- Entries set `lifecycle_state: active` while AI behavior matches the registered pattern
- `superseded` when a model upgrade or AI evolution changes the default (the entry stays for historical reference)
- `obsolete` when the default no longer triggers (CSPS may have absorbed enough that the pattern is no longer attempted)

**Registry signature:** `S006-AI-inner-ai-defaults-registry-2026-05-04T15:30:00Z`
