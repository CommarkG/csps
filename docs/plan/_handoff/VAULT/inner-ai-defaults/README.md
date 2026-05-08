---
id: csps.handoff.vault.inner-ai-defaults
name: inner-ai-defaults
description: >
  Inner-AI-defaults registry — calibration instrument for concept alignment under P-META-020.
  Each entry maps a training-baked default to its CSPS disposition (keep/override/adjust)
  and concept_ref (which L2 domain it belongs to). When CONCEPT_LOAD fires at Threshold,
  entries become reference samples for the active conceptual frame. The registry does NOT
  enumerate all cases — the concept navigates when no match exists. Per P-META-017 +
  P-META-020. Updated when model version changes OR quarterly drift review.
version: 1.1
owner: group:finky
lifecycle: production
lifecycle_state: active
csps_model_version: claude-sonnet-4-6-1m
calibrated_at: 2026-05-06
calibrated_by: S011-§24+++++++++++++
refresh_trigger: "Model version change (4.6→4.7 etc.) OR quarterly review OR when validate-inner-ai-defaults-freshness.mjs warns"
refresh_protocol: |
  1. Update csps_model_version field to new model
  2. Review all 6 category files for changed behaviors
  3. Add new entries to continuous-drift-log.md
  4. Flag entries that may no longer apply (disposition: review)
  5. Run pnpm verify to confirm no new EP-013 findings
template_used: registry-canonical
template_status: novel-pending-pattern-evaluation
core_spines: [AI, GVRN, VALD]
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:draft
diataxis_type: reference
links:
  - { rel: parent, href: ../README.md }
  - { rel: governs, href: ../../pillar-0-governance/csps-core-manifest.md }
  - { rel: composes-with, href: ../template-registry.md }
  - { rel: principle, href: ../../../../packages/principles/principles.yaml }
session: S006
---

# Inner-AI-Defaults Registry

> **Per P-META-017 + P-META-020:** This registry is a **calibration instrument** for concept alignment. Each entry maps a training-baked default to its CSPS disposition (keep/override/adjust) + concept_ref (which L2 conceptual domain it belongs to). When CONCEPT_LOAD fires at Threshold, these entries become reference samples that calibrate whether the AI's active conceptual frame is honored in output. The registry calibrates; it does not enumerate all cases.

## Why this exists (P-META-020 framing)

AI training bakes in patterns: generic naming, reflexive try/catch, sycophantic prose, narrative comments, sequential tool calls, hedging, premature agreement, and dozens more. These patterns are MOSTLY good for general-purpose work. They drift CSPS work toward generic-AI-output rather than CSPS-DNA-aligned-output.

**The registry's role under P-META-020 (Concept-First Governance):**
This is a **calibration instrument**, not a gate. Each entry shows WHERE the AI's trained concept diverges from the CSPS concept. The disposition (keep/override/adjust) is a conceptual alignment verdict:
- `keep` — training default honors the CSPS concept
- `override` — training default contradicts the CSPS concept; full replacement
- `adjust` — training default partially aligns; selective modification

When the CONCEPT_LOAD preamble (Threshold) loads the AI L2 inner-defaults domain, the entries in this registry become the reference samples for that conceptual frame. A validator catching a registry violation is not reporting a rule breach — it is detecting that the active concept is not being honored in this output.

**The registry does NOT enumerate all cases.** New situations not yet covered by any entry are navigated by the AI's active conceptual understanding of the platform. When the registry is consulted and a match is found, it calibrates; when no match is found, the concept navigates.

For each registered default:
- **What it is** (the training pattern with concrete example)
- **What CSPS requires** (the aligned pattern)
- **Disposition:** `keep` / `override` / `adjust` + `concept_ref:` (which L2 domain this divergence belongs to)
- **Reason** (why this disposition; cite memory entry / contract / principle)
- **Caught by validator** (which audit slug catches violations — a reference sample for this specific divergence)
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
concept_ref: <L2 domain this default belongs to — e.g. "AI L2 inner-defaults" / "ARCH L2 data domain" / "GVRN L2 decision rights". Per P-META-020: when this entry is consulted, it is a reference sample of whether the named L2 concept is being honored.>
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

## Enforcement Build Strategy (S021 — two-track methodology)

When closing enforcement gaps for registered entries, use the two-track approach:

**Track A — Citation fix (zero code)**
Before building a new validator, check if an existing live mechanism already covers the entry's behavioral override:
1. Read the hook file (`@csps-lifecycle-state: active` required — STUB exits 0 and doesn't scan)
2. Read the validator file referenced (confirm it's in pnpm verify and actually running)
3. If covered: update `caught_by_validator` to include `(LIVE — mechanism)` with explicit coverage level
4. Run `validate-inner-ai-defaults-enforcement-rate.mjs` to confirm the entry counts as live
5. Caveat: avoid `deferred`, `planned`, `impl deferred` as substrings in the value (triggers deferred detector)

**Track B — Build validator (new code)**
When no live mechanism exists for the behavioral pattern:
1. Build a minimal ADVISORY validator (exits 0 always — false positives are too high for behavioral checks)
2. Include Coverage Levels header (✓ what it checks, ✗ what it doesn't → VLT)
3. Wire into pnpm verify + audit-runner.md + run pnpm audit-runner:split
4. Update `caught_by_validator` to reference `.mjs` file with `(LIVE — Level 1: …)`

**Multiplier pattern:** When two entries share the same root behavioral default, build ONE validator
for the root and wire to both entries. Saves build time and reduces validator proliferation.

**STUB hook warning:** `validate-hook-lifecycle-state.mjs` reports which hooks are STUB vs active.
Run it before estimating Track A coverage to avoid counting STUB hooks as live enforcement.
At last audit (S021): 11/24 hooks are STUB (46%). Do NOT cite STUB hooks as live validators.

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

## CSPS DNA Gap Map (S011 §24+++++++++++++++ — NEW)

### Purpose
Every AI training default creates potential gaps when it fires against CSPS DNA. This section documents WHERE each default category creates gaps and which CSPS elements close them.

### Extended per-entry schema (add these fields to every entry)

```yaml
creates_gap_in:
  - element: <P-META-* | B_* | audit-slug | skill-name>
    how: "<how this default creates a gap in that element>"
    closed_by: <validator | hook | contract | memory>
    severity: CRITICAL | HIGH | MEDIUM | LOW
    detected_by: <which session caught this — K=2 tracking>
```

### The 6 critical AI defaults + their CSPS DNA gaps

| Default | Creates gap in | Closed by | Status |
|---|---|---|---|
| Sycophancy | B_AI_PROFESSIONAL_VOICE + B_PE_ALIGNMENT_GUARDIAN | post-stop-banned-phrase.sh | PARTIAL |
| Narrative over concise | B_TOKEN_BUDGET R1 + AGENTS.md word limit | validate-token-budget.mjs mode 1 | PARTIAL |
| Nominal completion | B_PRE_CLOSE_VERIFICATION + ZF discipline | validate-rzf-evidence.mjs | ACTIVE |
| Local optimization | B_STRUCTURAL_PREVENTION_DISCIPLINE Q-2 | validate-topic-plan-progress.mjs | ACTIVE |
| Friction avoidance | B_AI_COLLABORATIVE_DISCIPLINE + proactive registration | AGENTS.md hard NO (S011) | PARTIAL |
| **Mode impersonation** | B_NO_AI_IMPERSONATION (NEW S011) | internal-deep-review mandatory header | PARTIAL |

### Model version anchoring
This gap map was calibrated for `csps_model_version: claude-sonnet-4-6-1m`.
When model upgrades (4.6→4.7): re-audit each gap — model changes may close or open gaps.
VLT-S011-007 = the Opus review of what actually changed in 4.6[1M] vs prior versions.

**Updated signature:** `S011-AI-inner-ai-defaults-gap-map-2026-05-06T08:52:00Z`
