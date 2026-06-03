---
id: csps.governance.qc-audit-system
name: qc-audit-system
description: The operational layer for P-META-006 Zero-Findings Discipline. Defines the QC audit registry (per-artifact eligibility metadata + last-RZF-cycle + last-CEC-walk fields), the issue taxonomies (negative-defects + positive-un-extracted-value), the automation spec (pre-runtime AI-driven manual cycles → post-runtime cron + PR-blocking audits), and the per-artifact-type scan checklists. The "make automatic" answer to user S002 turn 11 directive. Companion to zero-findings-discipline.md (which defines the WHAT); this doc defines the HOW.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - audience:admin
  - maturity:stable
crosscutting:
  - reliability
  - observability
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: zero-findings, href: ./zero-findings-discipline.md }
  - { rel: principle, href: ./reuse-first-principle.md }
  - { rel: enforcement, href: ./mechanical-enforcement.md }
  - { rel: registry, href: ../../../packages/principles/principles.yaml }
  - { rel: audit-runner, href: ./audit-runner.md }
  - { rel: results-S002, href: ../_handoff/VAULT/archive/qc-audit-results-S002.md }
domain_path: platform
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# QC Audit System — operational layer for P-META-006

> **Make it automatically done as an organic part of how things are done here.** — User S002 turn 11

## What this document locks

The MECHANICAL operational layer that turns P-META-006 Zero-Findings Discipline (RZF + CEC) from a defined principle into a continuous platform-wide signal. Three components:

1. **QC Audit Registry** — every artifact in CSPS carries audit-eligibility metadata; the registry (markdown pre-runtime; DB post-runtime) lists all auditable artifacts + their last-cycle status.
2. **Issue Taxonomies** — closed-enum classification of NEGATIVE issues (defects to fix) and POSITIVE issues (un-extracted value to propagate). Every finding from any audit maps to one taxonomy entry.
3. **Automation Spec** — pre-runtime (manual AI-driven cycles surfaced in closing summary) → post-runtime (audit-runner cron + PR-blocking audits + PostStop hook). The discipline becomes ambient.

This doc is the SPEC; results live in `_handoff/VAULT/qc-audit-results-S<NNN>.md` per session.

## Why this exists (the user's framing turn 11)

> *"Now act as a QC expert and scan what we did so far and create an audit list to be saved and used on all existing elements and see which one can be registered for ZF cycles. Formalise it properly. Define negative issues + positive issues + see how the whole issue can be optimized as an organic part of how things are done here. And make it automatically done."*

Translation:
- **"Audit list saved/used"** → the registry (data)
- **"Registered for ZF cycles"** → eligibility metadata + cycle tracking
- **"Formalise it properly"** → schema + taxonomies + spec
- **"Negative + positive issues"** → both halves of zero-findings (defects + un-extracted-value)
- **"Organic part of how things are done"** → embedded in workflows, not bolted-on
- **"Automatically done"** → audit-runner + hooks, not manual

The user is asking for the **operational machinery** that makes P-META-006 self-running.

## Component 1 — QC Audit Registry

### Schema (per-artifact)

Every CSPS artifact (excluding generated files) carries this metadata in frontmatter:

```yaml
qc_audit:
  audit_id: AUD-<artifact-type>-<NNN>             # e.g., AUD-LEAF-0001 / AUD-PRINC-0017 / AUD-ADR-0003
  artifact_type: leaf | principle | adr | behavioral-contract | skill | hook | memory | vault | slice | spine-row | extraction-note
  zf_eligible: true | false                       # can RZF cycles run on this artifact?
  cec_eligible: true | false                      # is this a ratifiable artifact whose essence might propagate?
  rzf_check_types_applicable:
    - mechanical                                  # validators / linters apply
    - semantic                                    # cross-ref / field-parity apply
    - propagation                                 # grep-across-repo applies
    - user_visible_outcome                        # only when customer-facing
  last_rzf_cycle:
    cycles_run: <integer>
    final_findings_count: <integer>               # 0 = ZF-0 ACHIEVED
    achieved_at: <ISO timestamp>
    coverage_tokens: [mechanical, semantic, propagation]
    evidence_block_ref: <path>
  last_cec_walk:
    cycles_walked: <integer>
    final_opportunities_count: <integer>          # 0 = CEC-0 ACHIEVED
    achieved_at: <ISO timestamp>
    walk_trail_ref: <path>
  recurrence_check_at: <ISO date>                  # 30d critical / 90d default
  audit_history:                                   # append-only — every audit fired
    - audit_id: AID-NNN
      timestamp: <ISO>
      kind: <audit-kind>
      result: pass | fail | skipped
      findings: <integer>
```

**Pre-runtime:** the registry is a single markdown table at `_handoff/VAULT/qc-audit-results-S<NNN>.md` updated per session.

**Post-runtime (week 4+):** Postgres table `public.qc_audit_record` with the same shape; admin dashboard `/admin/intake/zero-findings` (per `_intake/dashboard-plan.md`) surfaces the registry.

### Audit-eligibility decisions per artifact type

| Artifact type | ZF-eligible? | CEC-eligible? | Rationale |
|---|---|---|---|
| **principle** (P-OP-* / P-ARCH-* / P-META-*) | YES | YES | Principles are ratifiable; cycles fire on every change; CEC propagation is mandatory |
| **leaf doc** (pillar-N/*.md) | YES | YES | Same — leaves are content-bearing canonical docs |
| **ADR** (docs/adr/NNNN-*.md) | YES | YES | ADRs are decision artifacts; both halves apply |
| **behavioral contract** (B_*) | YES | YES | Contracts bind behavior; defect-free + propagated |
| **skill** (`packages/skills/*/SKILL.md`) | YES (mechanical: capability-validation; semantic: contract-match) | YES (CEC: which other contexts could use this skill?) | Skills are runtime; both halves apply |
| **hook** (`.claude/hooks/*.sh`) | YES (mechanical: shell + exit codes; semantic: trigger-spec match) | NO (hooks don't have "essence" that propagates beyond their trigger; mechanical only) | Hooks are scripts |
| **memory entry** (`memory/feedback_*.md`) | YES (semantic: rule + reason coherent) | YES (CEC: which other contexts the rule applies to) | Memories are guardrails; propagation matters |
| **vault doc** (`_handoff/VAULT/*.md`) | YES | varies | Per-vault-doc — insights propagate (CEC YES); blockers don't propagate (CEC NO); protocols propagate (CEC YES) |
| **slice ZModel** (`libs/policies/slices/*/<slice>.zmodel`) | YES | YES | Schema is content; both halves |
| **spine matrix row** | NO (not a standalone artifact; row of `ai-behavior-spine.md`) | NO | Aggregate row, audited via parent |
| **extraction note** (`_intake/contexts/*/EXT-*.md`) | YES | varies (depends on routed-to artifact) | Per-extraction; CEC fires when extraction routes to a ratifiable artifact |
| **handoff** (`HANDOFF-S*-to-S*.md`) | YES (mechanical: required sections; semantic: state diff matches) | NO (handoff IS the closing artifact; CEC has already happened on its content) | Handoffs are summaries |
| **principles.yaml itself** | YES | NO (registry; not a propagatable artifact itself) | Registry-level audits via meta-audits |
| **AGENTS.md** | YES (codegen-fresh + drift-detection) | NO (generated from principles.yaml) | Derivative; audit drift |
| **MASTER_PLAN.md** | YES | YES | Trunk; both halves apply |
| **README files (per-pillar)** | YES (semantic: leaf-list matches actual contents) | NO (indexes, not propagatable content) | Indexes |

This table is the **registry-eligibility lookup** — per artifact type, which cycles fire when.

## Component 2 — Issue Taxonomies

The user's directive: *"Define a core list of what we can call 'negative' issues and 'positive' issues."*

### Negative Issues (defects — RZF catches)

Every NEG-* finding category maps to existing audits + maps back to the artifact type that surfaced it.

| Code | Category | Description | Detection mechanism |
|---|---|---|---|
| **NEG-FRONTMATTER** | Missing required frontmatter | Required field absent (e.g., `lifecycle_state` missing on artifact past S002 backfill) | `frontmatter-completeness` audit (PR-blocking error) |
| **NEG-CLOSED-ENUM-VIOLATION** | Tag value not in closed enum | E.g., `domain:billing-and-payments` (compound; not in `dimensions.ts`) | `tag-closed-enum-violation` audit |
| **NEG-CROSS-REF-BROKEN** | Cross-reference resolves to nothing | Link to `pillar-X/Y.md` that doesn't exist | `cross-ref-resolution` audit |
| **NEG-FIELD-PARITY-DRIFT** | Schema-vs-validator-vs-contract drift | Schema renamed field; validator code still references old name | `field-parity` audit (semantic) |
| **NEG-STALE-REF-AFTER-RENAME** | Old term still appears after rename | `manifested-slice` mentions remain after rename to `module-folder` | `vale-prose` + grep audits |
| **NEG-EVIDENCE-BLOCK-MISSING** | Artifact at terminal state missing RZF evidence block | `lifecycle_state: validated\|closed` without `evidence_block_ref:` | `rzf-coverage` audit (PR-blocking error) |
| **NEG-CEC-WALK-TRAIL-MISSING** | Ratified artifact missing CEC walk-trail | New principle/leaf without `cec_walk_trail_ref:` | `cec-walk-trail-completeness` audit |
| **NEG-STATE-TRANSITION-ILLEGAL** | Lifecycle/pipeline state moved illegally | `closed → triaged` without going through `observed` | Postgres trigger (post-runtime) + manual-protocol pre-runtime |
| **NEG-VALIDATOR-FALSE-POSITIVE** | Audit flags real findings as defects | Composite path strings flagged as missing-URL | Per-audit FP-rate tracking |
| **NEG-CYCLE-COUNT-AS-TARGET** | Predetermined cycle count language | "Run 3 cycles regardless" / "We always do 5 passes" | `cycle-count-as-target-detection` audit |
| **NEG-MECHANICAL-ONLY-DECLARED-AS-RZF** | Mechanical pass cited as full RZF | Validators ran; semantic + propagation skipped | RZF evidence-block coverage check |
| **NEG-MEMORY-NOT-INDEXED** | Memory entry exists but `MEMORY.md` doesn't reference | Orphan memory file | `memory-index-completeness` audit |
| **NEG-DUPLICATE-CONCERN** | Same content in N places that could drift | State machine in 4 docs | `concern-duplication` audit |
| **NEG-ORPHAN-NO-LIFECYCLE-STATE** | Artifact without `lifecycle_state` declared | Pre-S002 backfill misses | `orphan-without-lifecycle-state` audit |
| **NEG-BLOCKER-OPEN-AT-CLOSE** | Session closing with `state: open` BLK-* | Per AGENTS.md hard NO | `unanswered-questions-blocker` audit |
| **NEG-COMPRESSED-RZF-UNDER-PRESSURE** | RZF/CEC shortcut due to context budget | Cycles fewer than findings warrant | `compressed-zero-findings-detection` audit |
| **NEG-FORCE-FIT** | Content routed to nearest existing leaf without genuine match | New content shoe-horned | `force-fit-detection` audit |
| **NEG-INVENTION-WITHOUT-PRECEDENT-CHECK** | New artifact without `precedent_checked:` field | Per S002 turn 7 self-audit failure pattern | `precedent-check-coverage` audit |

### Positive Issues (un-extracted value — CEC catches)

Every POS-* finding category surfaces things to ENHANCE / PROPAGATE.

| Code | Category | Description | Detection mechanism |
|---|---|---|---|
| **POS-ESSENCE-NOT-PROPAGATED** | Ratified principle's essence applies to N other artifacts but cross-link missing | Reuse-first applies to research-streams; not noted in research-index | CEC walk per ratification |
| **POS-PATTERN-CROSS-PILLAR-APPLICABLE** | Pattern from one pillar applies in another but not surfaced | Schema-per-app pattern (Pillar 2) applies to memory-per-persona pattern conceptually; not cross-linked | CEC walk + grep |
| **POS-INSIGHT-NOT-PROMOTED-TO-VAULT** | Session surfaced insight not yet in `insights.md` | Sub-extraction insight not propagated | Per-session insight audit at close |
| **POS-K1-WAITING-FOR-K2** | Schema-gap registry K=1 entry; if recurs, ADR auto-creates | Could be expedited if user explicitly approves | `schema-gap-promotion-eligibility` audit |
| **POS-MEMORY-SCOPE-TOO-NARROW** | Memory entry rule applies broader than its named scope | `feedback_validate_before_assume` was triggered by upload-visibility but applies to all state claims | Memory-scope review |
| **POS-CONTRACT-COULD-COMPOSE** | New behavioral contract compositionally enhances existing contract | B_VALIDATE_BEFORE_ASSUME composes with B_DONE | Spine cross-ref check |
| **POS-RESEARCH-FINDING-PARTIAL-ABSORPTION** | Research stream returned N recommendations; only K absorbed | R21 returned 8; 5 absorbed S002, 3 deferred S003 | Research-absorption-completeness |
| **POS-FAILURE-LESSON-NOT-ENGRAVED** | Session surfaced failure pattern not yet a memory entry | Failure → no `feedback_*.md` written | Per-session failure-engraving audit |
| **POS-CROSS-CUTTING-NOT-FAN-OUT** | Single-leaf extraction ripples ≥3 other leaves but only 1 routing recorded | Stub cross-cutting routing missed | CEC fan-out audit |
| **POS-ARTIFACT-COULD-INHERIT-VARIANT** | Per-glob inheritable tag missing on artifact | `governance/learning-loop/EXT-*` should inherit `crosscutting:ai-native`; not all do | `tag-propagation-coverage` audit |
| **POS-PRINCIPLE-COULD-FOLD-AS-CSP-CARRY-FORWARD** | Existing principle could be enhanced with CSP precedent | P-OP-002 FWWS could absorb CSP-S160-T28 completion-rush memory | CEC at next CSP doc absorption |
| **POS-MECHANISM-CSPS-ONLY-COULD-BE-CSP-PORTED** | CSPS-built mechanism that CSP could benefit from | CEC discipline (CSPS-extension) could port back | Cross-platform back-channel (per CSP S333 invitation) |
| **POS-DASHBOARD-PAGE-COULD-EXTEND** | Dashboard plan covers N pages; new audit suggests N+1 | This audit-system doc → `/admin/qc-audit-registry` page | Dashboard-coverage check |
| **POS-AUDIT-COULD-COMPOSE-WITH-EXISTING** | New audit overlaps existing; could merge or compose | `cycle-count-as-target-detection` overlaps `cec-walk-trail-completeness` | Audit-rationalization weekly |
| **POS-INSIGHT-FOR-LEARNING-LOOP-REPEAT** | Same insight from 2+ sessions = K=2 trigger | Manual catch where automated `repeat-issue-detection` will catch post-runtime | Manual scan at close pre-runtime |

### Issue-routing rules

When an audit produces a finding:

```
NEGATIVE issue (NEG-*) → routes to:
  - LearningLoopItem with pipeline_state: triaged
  - priority_tier per severity (NEG = critical/error/warn typically routed P0/P1/P2)
  - SLA per state-machine (must reach `validated` per RZF discipline)

POSITIVE issue (POS-*) → routes to:
  - LearningLoopItem with pipeline_state: routed (already routed to enhancement)
  - priority_tier P3 (rarely critical; enhancement work)
  - cec_walk_trail_ref: pointing back to originating walk
  - Schema-gap registry if K=2 within 90d
```

Both halves flow into the same Learning Loop pipeline. Different priorities; same machinery.

## Component 3 — Automation Spec

### Pre-runtime mode (S002 → week 6)

The AI runs the audit-list manually:

1. **At every artifact ratification:** AI runs RZF + CEC cycle per `manual-protocol.md` Step 6b.
2. **At every session close:** AI emits per-session audit summary in closing summary listing:
   - Artifacts reaching terminal state this session + their RZF evidence blocks
   - Newly-ratified artifacts + their CEC walk-trails
   - Findings (NEG + POS) per artifact + their routing
3. **At every session open:** AI runs `/stewardship-review` + reads blocker-registry; new in turn-11 — surfaces aged QC items (NEG findings >7d unfixed; POS findings K=2 recurrence).
4. **Closing protocol §10 amended:** new checklist item — "QC audit summary present + evidence blocks per ratified artifact + walk-trails per propagated essence."

### Post-runtime mode (week 4+)

The audit-runner does it automatically:

| Cron cadence | What runs | What it does |
|---|---|---|
| **PR-time** | `frontmatter-completeness` + `rzf-coverage` + `cec-walk-trail-completeness` + `precedent-check-coverage` | Block PR on any NEG-FRONTMATTER / NEG-EVIDENCE-BLOCK-MISSING / NEG-INVENTION-WITHOUT-PRECEDENT-CHECK |
| **Nightly 02:00 UTC** | Full QC scan across all registered artifacts | Compute findings; route NEG to LearningLoopItem; POS to enhancement queue |
| **Weekly Mon 06:00 UTC** | `audit-of-audits` (meta-RZF) + `cycle-count-trend` + `concern-duplication` | Verify the registry itself is healthy + drift detection |
| **Monthly** | `meta-loop-audit` + `audit-rationalization` | Resolution-cycle-time trend + redundant-audit consolidation |
| **PostStop hook** | Emit per-session audit summary | Auto-fires at chat-close; populates closing summary |
| **UserPromptSubmit hook** | Surface aged QC items at session-open | Banner: "N NEG findings >7d / M POS findings at K=2 / awaiting decision" |

### Organic integration (the user's "organic part of how things are done")

The discipline becomes ambient via:

1. **Frontmatter is mandatory.** Every artifact carries `qc_audit:` block. New artifacts get the block at creation; existing artifacts backfilled per S002 lifecycle_state pattern.
2. **Audit-runner runs continuously.** Not a "step we remember"; a cron job that always fires.
3. **Findings flow to Learning Loop.** Every NEG/POS becomes a LearningLoopItem; standard pipeline consumes.
4. **Closing summary is the surfacing point.** AI cannot end a session without surfacing audit results (AGENTS.md hard NO).
5. **Dashboard makes it visible.** `/admin/intake/zero-findings` page (planned) shows trend + per-artifact status.
6. **Recurrence catches drift.** If same NEG recurs 2x in 90d → auto-ADR. If same POS recurs 2x → auto-promote essence to its own pattern.

The discipline is NEVER a separate "audit step." It's a **passive substrate** the platform runs against constantly. Like RLS for security: not bolted-on; structurally present.

## Component 4 — Per-artifact-type scan checklists

Each artifact type has its own checklist run during scans.

### LEAF DOC checklist (every `pillar-N/*.md`)

- [ ] Frontmatter present + valid (id / name / description / version / owner / lifecycle / lifecycle_state / tags / links)
- [ ] `lifecycle_state` ∈ closed enum
- [ ] `next_review_at` present when state ≠ active
- [ ] If state ∈ {validated, closed}: `evidence_block_ref:` present
- [ ] If newly-ratified: `cec_walk_trail_ref:` present
- [ ] Reuse-first reminder appears (`> Check what exists. Enhance the ratified thing.`)
- [ ] Cross-references in `links:` resolve to existing files
- [ ] Cross-references in body `[text](path)` resolve
- [ ] Sources section present
- [ ] No retired vocabulary terms (per `vale-prose` glossary)
- [ ] Open questions inline → check linked to `open-questions-ledger.md` by OQ-ID
- [ ] If declares principle/discipline: cross-link to `principles.yaml`

### PRINCIPLE checklist (every `principles.yaml#P-*`)

- [ ] `id` matches `P-{OP|ARCH|META}-NNN` pattern
- [ ] `severity ∈ {critical, error, warn, info}`
- [ ] `enforcer_count` matches `len(enforcers)`
- [ ] If severity = critical: ≥4 enforcers; ≥2 non-AI layers
- [ ] If severity = error: ≥3 enforcers; ≥1 non-AI
- [ ] If severity = warn: ≥2 enforcers
- [ ] All enforcer `location` fields point to real or planned files
- [ ] `cross_references` IDs all exist in registry
- [ ] `industry_lineage` cites at least 2 sources
- [ ] `anti_patterns` non-empty
- [ ] If has `config` block: all keys documented in associated leaf doc

### ADR checklist (every `docs/adr/NNNN-*.md`)

- [ ] Sequential numbering (no gaps)
- [ ] All 6 MADR sections present (Context / Considered Options / Decision Outcome / Consequences / Enforcement / Sources)
- [ ] If `status: superseded` → `superseded_by:` field present + target ADR exists
- [ ] If has Considered Options ≥3 → all options have Pros + Cons (not just one)
- [ ] Cross-link to relevant principle in `principles.yaml`
- [ ] Cross-link to relevant leaf doc

### BEHAVIORAL CONTRACT checklist (every `B_*` in `behavioral-contracts.md`)

- [ ] Canonical wording present
- [ ] Counterweight present (no rule without escape)
- [ ] Source cited (which session / failure incident drove this)
- [ ] Anti-patterns list ≥3 items
- [ ] Mechanical surfaces table: schema / validator / hook / memory / contract — at least 4/5 declared
- [ ] If declares contract supersedes another → both directions linked
- [ ] Cross-row in `ai-behavior-spine.md` matrix exists

### MEMORY ENTRY checklist (every `memory/feedback_*.md`)

- [ ] Frontmatter: name / description / type
- [ ] Type ∈ {user, feedback, project, reference}
- [ ] If type=feedback: includes "**Why:**" + "**How to apply:**" lines
- [ ] Indexed in `MEMORY.md`
- [ ] If references a behavioral contract: cross-link present
- [ ] Anti-patterns list present
- [ ] Mechanical surfaces table

### EXTRACTION NOTE checklist (every `_intake/contexts/*/EXT-*.md`)

- [ ] EXT-ID format `EXT-YYYYMMDD-NNN[-X]`
- [ ] Required fields per `tag-status-contract.md` (extraction_id / parent_input_id / source_type / origin / origin_detail / received_at_iso / received_via / confidence / confidence_band / lifecycle_state / pipeline_state / state_transitioned_at / next_review_at / recurrence_check_at / routed_to / risk / trust_tier)
- [ ] Tags within closed enum
- [ ] `inherited_from_input` block matches parent's
- [ ] `routed_to` resolves to existing artifact
- [ ] In ledger (`_intake/extractions-ledger.md`)

### SKILL checklist (every `packages/skills/*/SKILL.md`)

- [ ] Frontmatter: name / description / version / license / allowed_tools / allowed_subagents / enforces / lifecycle / lifecycle_state
- [ ] `allowed_tools` ⊆ closed enum (Read/Grep/Glob/Bash/Edit/Write/...)
- [ ] `enforces` IDs all exist in `principles.yaml`
- [ ] If has anti-patterns: documented
- [ ] If runtime: tests in `__tests__/`

### HOOK checklist (every `.claude/hooks/*.sh`)

- [ ] Shebang line present
- [ ] `set -euo pipefail` for safety
- [ ] Trigger comment header (which event fires this)
- [ ] Source-of-truth doc reference in comment
- [ ] Logs to capture path
- [ ] Exit codes used correctly (0 = pass; 2 = block)
- [ ] If detects pattern: documented detection rules

### VAULT DOC checklist (every `_handoff/VAULT/*.md`)

- [ ] Frontmatter complete
- [ ] If type=insights: cross-references to source extractions/sessions
- [ ] If type=research-index: per-stream cites real URLs
- [ ] If type=protocols: version bumped + change-log
- [ ] If type=ledger: append-only (no deletions)
- [ ] If type=blockers: state ∈ {open, answered, explicitly-dropped, superseded, resolved}

## Component 5 — Grandfather Backfill Protocol (added S002 turn 12)

> **The user's directive turn 12:** *"Going all over what was done could stop the momentum. Make it happen on what is done from now on. Complete it on what's done until now by adding past completion whenever an issue is implemented."*

Translation: Big-bang backfill kills momentum. The right pattern combines THREE layers — **opportunistic-touch + recurrence-driven + scheduled-floor-ceiling**. Pre-turn-10 artifacts (~30 grandfathered) reach RZF/CEC compliance gradually + organically + without dedicated "backfill sprints."

### Push-back on "25%/week" framing

User asked: *"Schedule completing it... 25% each week until all done? Better way?"*

**Reject the percent-per-week target.** Per `feedback_zero_findings_cycle_count_is_measurement` (CSP S227): **measurement, not target.** Predetermined-percent-per-week is the same anti-pattern as predetermined-cycle-count: process-driven not result-driven. Some weeks zero artifacts will need backfill (no relevant edits); some weeks five will need it (heavy editing in old leaves). Forcing "25%" produces theater on light weeks + drops critical work on heavy weeks.

**Recommended: SLA-based with floor + ceiling, not percentage.** Layers below.

### Layer 1 — Opportunistic-touch (the dominant mechanism)

**Trigger:** every time an AI edits a grandfathered artifact, the edit ride-alongs an RZF + CEC cycle.

**Mechanism:** when AI is about to save a change to artifact X, BEFORE writing the change:
1. Check: is X in the grandfather list?
2. If yes: AI is in X's context anyway — run the per-artifact-type checklist as part of the edit
3. Apply both: the user-asked change AND the backfill compliance
4. Emit evidence block + walk-trail in same commit
5. Remove X from grandfather list

**Why this works:** the AI is already paying attention to X. Backfill cost is marginal (the context-load already happened for the user's actual edit). No separate sprint required.

**Anti-patterns to resist:**
- "I'll do the backfill in a follow-up commit" — defeats the purpose; momentum from the touch is wasted
- "I only fixed line N; let's not also do the cycle" — cycle takes <1 minute when context is loaded; defer to backfill-sprint = guaranteed slip
- Selective backfill ("just RZF; skip CEC") — both halves or none

**Mechanical surface:**
- Pre-Edit hook (planned week 3) — checks grandfather list; reminds AI before save
- Manual-protocol Step 5b extension (this turn) — explicit step in the protocol
- Closing-summary requirement: "any grandfathered artifact touched this session must show `evidence_block_ref:` in the diff"

### Layer 2 — Recurrence-driven (the catch mechanism)

**Trigger:** when a LearningLoopItem's recurrence-check fires (the existing P-META-005 90-day cadence) AND the source-of-recurrence is a grandfathered artifact, the recurrence walk includes RZF + CEC.

**Mechanism:** the existing recurrence-check (per `learning-loop.md` F2 + `proactive-completion.md`) already re-walks closed items at 30/90 days. Extension: if the artifact involved is in the grandfather list, the re-walk graduates to a full RZF + CEC cycle.

**Why this works:** recurrence is the signal that an artifact MATTERS (it surfaced again). Mattering artifacts get prioritized; un-touched ones stay grandfathered.

**Mechanical surface:**
- Audit `recurrence-driven-grandfather-graduation` (planned week 4) — checks the link between recurrence-check fires and grandfather-list updates

### Layer 3 — Scheduled-floor + ceiling (the safety net)

**At every session close, the AI computes:**
1. **Grandfather-list age:** for each grandfathered artifact, days since added to grandfather list. Maximum age across list = "oldest-grandfather-age."
2. **Backfill rate this session:** count of opportunistic + recurrence-driven backfills applied during the session.
3. **SLA evaluation:**
   - **Floor:** if **0 backfills happened this session AND oldest-grandfather-age > 30 days**, AI MUST pick the highest-criticality grandfathered artifact + apply backfill before close. Forces minimum trickle on slow sessions.
   - **Ceiling:** **maximum 3 backfills per session.** Protects momentum on heavy sessions. Beyond 3, schedule remainder for next session.
   - **Hard SLA:** **oldest-grandfather-age > 180 days = error severity.** Audit `grandfather-list-age` PR-blocks.

**Backfill prioritization** (when floor triggers):
1. Artifacts with the most cross-references (high-leverage — fixing one propagates value)
2. Artifacts touched in failed audits (signals real defects)
3. Artifacts in pillar-0 governance (highest-stakes per ai-behavior-spine)
4. Artifacts older in grandfather list (LIFO would be fine; FIFO surfaces longest-deferred)

**Why floor + ceiling beat percentage:**
- Floor of 1 forces minimum progress when nothing else happens (vs 25% which on a 4-artifact backlog = 1; same minimum on light week)
- Ceiling of 3 protects momentum on heavy weeks (vs 25% which on 32-artifact backlog = 8 artifacts, killing the session)
- SLA-driven escalation handles long-deferred items without forcing constant backfill work
- Composes with existing P-META-005 forcing functions (recurrence-check, K=2 ADR, weekly digest)

### The composite formula

```
Per-session backfill discipline:
  opportunistic_count = count of grandfathered artifacts touched this session
  recurrence_count    = count of grandfathered artifacts surfaced via recurrence-check
  backfill_total      = opportunistic + recurrence

  IF backfill_total >= 1:
    no floor action needed
  ELIF oldest_grandfather_age > 30 days:
    pick top-priority grandfather artifact + apply RZF + CEC inline at close
    (counts toward ceiling)
  ELSE:
    no action — let opportunistic-touch handle it organically

  cap_total = min(backfill_total, ceiling=3)
  IF backfill_total > 3:
    defer remainder to next session as BLK-SXXX-* with grandfather flag

  IF oldest_grandfather_age > 180 days:
    audit grandfather-list-age fails PR with error severity
    forces explicit attention via blocker registry
```

### Where this positions in the process (the user's question answered)

| Process step | Grandfather backfill action |
|---|---|
| **Manual-protocol Step 5** (extraction routing) | **Opportunistic-touch fires** — when extraction routes to leaf X, if X is grandfathered, ride-along RZF + CEC with the routing |
| **Manual-protocol Step 6b** (RZF + CEC at ratification) | **Already covers new ratifications** — only fires for grandfathered if the ratification touches a grandfathered artifact |
| **Manual-protocol Step 7** (closing summary) | **Floor evaluation fires** — compute oldest-grandfather-age + apply floor backfill if needed |
| **Recurrence-check fire** (P-META-005 F2) | **Layer 2 fires** — if recurrence target is grandfathered, graduate to full cycle |
| **Closing protocol §10** | **Ceiling check + close-summary surfacing** — list backfills made; carry-forward >3 deferrals |
| **Fresh-chat protocol §11** | **Aged-grandfather warning** — if oldest > 90 days, surface in fresh-chat opening |
| **PR-time audit** (post-runtime) | **`grandfather-list-age` audit** — error if >180 days |

The discipline rides along WITH existing protocols at 7 process points. **No new "backfill sprint" needed.**

### Grandfather list (~30 artifacts pre-turn-10)

Stored at `_handoff/VAULT/qc-audit-grandfather-list-S002.json` (planned to be created). For now, the list is enumerable from `qc-audit-results-S002.md` NEG-EVIDENCE-BLOCK-MISSING + NEG-CEC-WALK-TRAIL-MISSING affected lists.

**Initial categorization for prioritization:**
- **Tier-1 (governance + load-bearing — backfill on next touch):** principles.yaml itself; AGENTS.md; behavioral-contracts.md; ai-behavior-spine.md; mechanical-enforcement.md; reuse-first-principle.md; operating-principles.md
- **Tier-2 (frequently-referenced — high cross-reference count):** all 21 ADRs; the 5 Pillar-3 leaves migrated turn 9
- **Tier-3 (less load-bearing — let recurrence handle):** _handoff/VAULT/* (each session creates new ones); _intake/contexts/** READMEs; legacy/* docs

Tier-1 carries highest priority when floor triggers; Tier-3 mostly handled by Layer 1 opportunistic-touch.

### What this preserves

User's stated value: **"powerful tool... but going all over what was done could stop the momentum."**

The 3-layer protocol preserves momentum because:
1. **Most backfills happen automatically** when artifacts are touched (Layer 1 — zero dedicated work)
2. **Recurrence handles re-surfaced items** (Layer 2 — only mattering items get re-cycled)
3. **Floor enforces minimum trickle** without dedicated sprints (Layer 3 — 1 per slow session is invisible)
4. **Ceiling prevents heavy-session overload** (Layer 3 — momentum protected by hard cap)
5. **Hard SLA at 180d catches drift** (Layer 3 — but only when truly aged, not as routine pressure)

The composite produces **gradual + organic + momentum-preserving** backfill. Better than 25%/week which is process-driven not result-driven.

## Where this connects (composition with existing CSPS architecture)

| Existing CSPS | This QC system extends it by |
|---|---|
| `audit-runner.md` | Adds Zero-Findings Discipline category + the QC audit kinds (registry-completeness / per-artifact-type-scans / audit-of-audits) |
| `proactive-completion.md` F9 | Operationalizes F9 with the actual scan checklists + automation cron |
| `principles.yaml#P-META-006` | This doc IS the implementation spec for P-META-006 |
| `behavioral-contracts.md` (B_RZF + B_CEC) | This doc IS the operational machinery the contracts depend on |
| `_handoff/VAULT/protocols.md` §19 + §20 | Closing protocol references this doc's scan checklists for the per-session audit summary |
| `_handoff/VAULT/blockers-S<NNN>.md` | NEG findings unresolved for >3 sessions transition to BLK-S<NNN>-* blockers |
| `learning-loop.md` | NEG and POS findings flow into `LearningLoopItem` via standard pipeline; K=2 detection captures both |
| `stewardship-protocol.md` | RZF cycles inform `lifecycle_state` transitions; metadata stored per `cycle_count` field |
| `dashboard-plan.md` | New `/admin/intake/zero-findings` page surfaces this registry + findings |
| `_intake/manual-protocol.md` Step 6b | Operationalized by these checklists |

## How to use this doc

### When ratifying a new artifact
1. Per `manual-protocol.md` Step 6b — run RZF + CEC cycles
2. Use the per-artifact-type checklist from this doc
3. Emit evidence block + walk-trail in artifact frontmatter
4. Update QC audit registry row at `_handoff/VAULT/qc-audit-results-S<NNN>.md`

### When closing a session
1. Run scans against all artifacts touched this session
2. Surface NEG findings + POS opportunities in closing summary
3. Update registry rows
4. Carry-forward unresolved findings to next session's blocker registry if >3 sessions stale

### When opening a fresh session
1. Read latest `qc-audit-results-S<NNN>.md`
2. Surface aged findings in fresh-chat opening
3. Triage before substantive work

## S005 turn 22 amendment — composition with B_POSITIVE_VALUE_EXTRACTION + B_PRE_CLOSE_VERIFICATION

The QC audit system's NEG/POS taxonomy now composes mechanically with two new contracts (S005 engravings):

- **B_PRE_CLOSE_VERIFICATION** ([behavioral-contracts.md](./behavioral-contracts.md#B_PRE_CLOSE_VERIFICATION)) — the QC scan at session close runs THROUGH `tools/verify.mjs` orchestrator now (per closing-summary §10.0 mandatory header). The orchestrator's structured cycle output IS the QC scan input for that session; nominal QC claims are mechanically impossible.
- **B_POSITIVE_VALUE_EXTRACTION** ([behavioral-contracts.md](./behavioral-contracts.md#B_POSITIVE_VALUE_EXTRACTION)) — the POS taxonomy's "un-extracted-value" findings now route through B_POSITIVE_VALUE_EXTRACTION cycles when the trigger is a significant positive event (insight / user-directive / improvement / EXT-ID / bug-fix / AI-self-correction / generator-output / meta-finding). POS findings outside ratification scope no longer silently drop.

**Composition with K=2 promotion** (per [learning-loop.md](./learning-loop.md) amendment): when a POS-finding (un-extracted-value) recurs across N sessions, K=2 mechanism fires for the meta-pattern; opportunity-recurrence triggers ADR/principle/leaf promotion. The full chain: positive event → B_POSITIVE_VALUE_EXTRACTION cycle → walk-trail in §10.11b → if recurrence-detected → K=2 auto-ADR.

## Cross-references

- `pillar-0-governance/zero-findings-discipline.md` — the WHAT (this doc is the HOW)
- `pillar-0-governance/audit-runner.md` — the engine
- `pillar-0-governance/behavioral-contracts.md` § B_RZF + B_CEC + B_PRE_CLOSE_VERIFICATION + B_POSITIVE_VALUE_EXTRACTION — the binding contracts
- `_intake/proactive-completion.md` F9 — the forcing function (positive-event branch)
- `_handoff/VAULT/protocols.md` §10 + §19 + §20 — the session-protocol integration
- `_handoff/VAULT/archive/qc-audit-results-S002.md` — the FIRST RUN of this system on S002 artifacts
