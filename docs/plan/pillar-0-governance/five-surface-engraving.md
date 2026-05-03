---
id: csps.governance.five-surface-engraving
name: five-surface-engraving
description: The canonical CSPS pattern for converting catches (gaps / traps / anti-patterns / failures) into permanent durable discipline. The 5 surfaces (schema + validator + hook + memory + contract) are formalized here as a reusable engraving spec. Every catch produces a 5-surface delta atomically; below 2 surfaces = single-surface-engraving anti-pattern; 5/5 = full mechanical engraving. The compounding-returns mechanism that gives CSPS its moat over time. Every session inherits prior sessions' engravings without manual sync. Adopted from CSP S333 5-element pattern; extended with mechanical trigger + atomic-application + meta-RZF verification.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - observability
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: zero-findings, href: ./zero-findings-discipline.md }
  - { rel: spine, href: ./ai-behavior-spine.md }
  - { rel: contracts, href: ./behavioral-contracts.md }
  - { rel: registry, href: ../../../packages/principles/principles.yaml }
---

# Five-Surface Engraving — the canonical discipline-propagation pattern

> **The engraving discipline IS the moat. Every session inherits prior sessions' learnings without manual sync.** — User S002 turn 16

> **CSP took 330+ sessions to evolve to RZF discipline. CSPS is at session 2 + already has 33+ disciplines engraved. The engraving mechanism itself is the multiplier.**

## What this document locks

The canonical pattern (P-META-007) for converting every observed catch — gap / trap / anti-pattern / failure-mode — into permanent durable discipline through 5 mechanical surfaces. The pattern is:

- **REUSABLE** — every catch passes through the same 5-surface check
- **MECHANICAL** — pre-runtime via AGENTS.md hard NO + closing-summary-template; post-runtime via PostStop hook + audits
- **ATOMIC** — all 5 surfaces engraved in same response/commit (CSP B_ATOMIC_DUAL_REGISTRATION extended to 5)
- **AUDITABLE** — meta-RZF verifies completeness; absence at any surface flags
- **COMPOUNDING** — each session inherits prior engravings; re-discovery cost approaches zero

This is the operational layer that makes B_CATCH_TO_ENGRAVING (turn 15) actually mechanical instead of memory-only.

## The 5 surfaces (formalized)

Adopted verbatim from CSP S333 `AI_BEHAVIOR_AUTONOMY_AUDIT` (treasure #1 EXT-20260502-002). CSPS extends with explicit roles + atomic-application + completeness-audit.

### Surface 1 — Schema

**What:** structural encoding in frontmatter / ZModel / closed-enum / state-machine.

**Where it lives:** `tools/catalog/dimensions.ts` (closed enums) / `pillar-1/frontmatter-standard.md` (mandatory fields) / `libs/policies/slices/*/<slice>.zmodel` (entity schemas) / `_handoff/VAULT/closing-summary-template.md` (required headers).

**Role:** makes the discipline structurally invisible-to-skip. If `lifecycle_state` is mandatory frontmatter and a file lacks it → file fails validation. The structure forces the discipline.

**Reliability:** highest. Schema is checked at parse-time; cannot be bypassed by AI choice.

**Examples in CSPS:**
- P-META-004 → `lifecycle_state` field in every artifact's frontmatter
- P-META-005 → `LearningLoopItem` ZModel with state-machine
- P-META-006 → `evidence_block_ref` + `cec_walk_trail_ref` conditional fields
- B_CATCH_TO_ENGRAVING → closing-summary-template §10.13b mandatory header

### Surface 2 — Validator

**What:** automated check (linter / audit-runner / type-checker / static analyzer) that catches violations at PR-time or scheduled cadence.

**Where it lives:** `libs/audits/checks/<slug>.ts` / `tools/validators/*.mjs` / ESLint custom rules / Postgres triggers.

**Role:** runs continuously; flags violations; PR-blocks at error severity. The mechanical-enforcement-without-AI-cooperation layer.

**Reliability:** highest. Cron + PR + nightly runs are independent of AI session.

**Examples in CSPS:**
- P-META-001 → `principle-coverage` audit + `enforcer-orphans` audit
- P-META-006 → `rzf-coverage` + `cec-walk-trail-completeness` + `cycle-count-as-target-detection`
- B_CATCH_TO_ENGRAVING → `catch-engraving-coverage` audit (planned week 4)
- B_VALIDATE_BEFORE_ASSUME (turn 15 strengthened) → `assertion-without-preceding-tool-call` audit

### Surface 3 — Hook

**What:** Claude Code hook (PreToolUse / PostToolUse / Stop / PostStop / UserPromptSubmit) that fires at point-of-action.

**Where it lives:** `.claude/hooks/*.sh`.

**Role:** surfaces the discipline AT the moment the AI is about to act. Prevention before mistake; not detection after.

**Reliability:** high. Hooks fire deterministically; AI cannot route around them.

**Examples in CSPS:**
- P-META-005 → `.claude/hooks/post-stop-learning-loop.sh` (PostStop fires extractor)
- P-OP-001 → `.claude/hooks/pre-tool-use-write.sh` (PreToolUse: Write triggers catalog grep)
- ChatGate → `.claude/hooks/user-prompt-submit-intake.sh` (UserPromptSubmit: detects upload patterns)
- B_CATCH_TO_ENGRAVING → PostStop scans session log for catch-language patterns + flags un-engraved (planned week 4)

### Surface 4 — Memory

**What:** `~/.claude/projects/.../memory/feedback_*.md` entries the AI internalizes at session-open.

**Where it lives:** user-memory directory (per-project).

**Role:** cognitive layer. AI loads at session-start; each entry shapes default behavior. Where catches become "internalized rules" the AI follows by default.

**Reliability:** medium. Memory affects AI cooperation with mechanical layer; cannot enforce alone.

**Examples in CSPS:**
- P-META-006 RZF → `feedback_re_run_is_proof.md`
- P-META-006 CEC → `feedback_complete_extraction_required.md`
- B_CATCH_TO_ENGRAVING → `feedback_catch_to_engraving.md`
- Parent-CLAUDE.md trap → `feedback_parent_claude_md_wrong_workspace_trap.md`

### Surface 5 — Contract

**What:** behavioral-contract section in `behavioral-contracts.md` + AGENTS.md hard NO + canonical leaf doc.

**Where it lives:** `pillar-0-governance/behavioral-contracts.md` § B_*; `AGENTS.md`; per-discipline canonical doc (e.g., `zero-findings-discipline.md`).

**Role:** binding rule. Every contract has canonical wording + counterweight + source + anti-patterns + mechanical-surfaces table. AGENTS.md hard NO surfaces it at every session-load.

**Reliability:** medium. Contract is the rule-of-record; effectiveness depends on AI compliance + composition with other 4 surfaces.

**Examples in CSPS:** all 33 entries in `ai-behavior-spine.md` discipline matrix.

## Engraving completeness levels

| Level | Surfaces engraved | Reliability | When acceptable |
|---|---|---|---|
| **Single-surface** (anti-pattern) | 1/5 | Brittle — fails at first vendor switch / session loss / human bypass | NEVER acceptable per CSP autonomy-audit |
| **Minimal** | 2/5 (memory + AGENTS.md NO) | AI-cooperation-dependent; survives session boundaries | Only when other 3 surfaces are "planned week 4" |
| **Partial** | 3-4/5 | Mostly mechanical; one missing surface = drift risk | Acceptable for non-critical disciplines (severity warn) |
| **Full** | 5/5 (mechanically running) | Survives any single layer's failure (defense-in-depth per P-META-001) | Required for severity critical |
| **Augmented** | 5/5 + audit-of-audits | Catches drift in the engraving infrastructure itself | Required for foundational disciplines |

## The Engraving Cycle (mechanical pipeline)

When AI detects a catch:

```
1. DETECT — catch identified (AI notice / audit failure / user correction / recurrence trigger)
   ↓
2. CLASSIFY — pattern? one-off-typo? composition-of-existing? new-discipline?
   ↓
3. DESIGN-DELTA — for each of 5 surfaces, what is the new artifact / amendment?
   ↓
4. APPLY-ATOMICALLY — all 5 surfaces engraved in same response/commit
   - Schema delta (frontmatter / template / state-machine)
   - Validator delta (audit registration in audit-runner.md)
   - Hook delta (.claude/hooks/* file or extension)
   - Memory delta (feedback_<slug>.md + MEMORY.md index update)
   - Contract delta (behavioral-contracts.md + AGENTS.md hard NO + spine row)
   ↓
5. VERIFY-COMPLETENESS — meta-RZF cycle on the engraving itself
   - Did all 5 surfaces actually get the delta?
   - Cross-references resolve?
   - AGENTS.md count incremented?
   - Spine matrix updated?
   ↓
6. EMIT-EVIDENCE-BLOCK — FSE evidence block in closing summary
   ↓
7. PROPAGATE — paste-prompt template + closing-summary-template inherit reference
```

## FSE evidence block format (every catch emits)

Per closing-summary-template §10.13b "Catches engraved this session":

```yaml
FSE VALIDATION:
  catch_id: CATCH-S<NNN>-<NN>
  catch_description: |
    <one-paragraph: what was observed; what trap/gap/anti-pattern>
  classification: pattern | composition | one-off-typo | new-discipline
  surfaces_engraved:
    schema:
      delta: <description>
      path: <file path + line/section>
    validator:
      delta: <audit slug + severity + cadence>
      path: <audit-runner.md section reference>
    hook:
      delta: <hook name + trigger event>
      path: <.claude/hooks/* path or "planned week 4">
    memory:
      delta: <memory entry slug>
      path: <feedback_*.md path + MEMORY.md index entry>
    contract:
      delta: <B_* contract name>
      path: <behavioral-contracts.md section + AGENTS.md hard NO line + spine matrix row>
  surfaces_count: <integer 0-5>
  level: single-surface | minimal | partial | full | augmented
  signature: <session-id + turn + timestamp>
```

Below 2 surfaces = anti-pattern. Below 5 surfaces requires explicit reason ("hook deferred to week 4 because Claude Code hooks are runtime; memory + AGENTS.md NO + contract + schema engraved now").

## Mechanical triggering (the user's "automatic" requirement)

The user S002 turn 16: *"once a gap or an error is identified, permanent prevention and execution will be mechanically triggered."*

Pre-runtime (S002 → week 6) — AI-driven mechanical triggers:
1. **AGENTS.md hard NO** at every session start: "Every catch language pattern ('I notice', 'gap surfaced', 'this is a trap') triggers immediate 5-surface engraving cycle in same response."
2. **Closing-summary-template §10.13b mandatory header**: section cannot be empty; must enumerate every catch + 5-surface delta.
3. **B_CATCH_TO_ENGRAVING contract**: requires minimum 2/5; recommends 5/5.

Post-runtime (week 4+) — fully mechanical:
1. **PostStop hook** scans session log for catch-language patterns; for each catch detected, verifies paired 5-surface artifacts created in same session.
2. **Audit `catch-engraving-completeness`** (PR-blocking warn): scans closing summary for FSE evidence blocks; flags surfaces_count < 2.
3. **Audit `single-surface-engraving-anti-pattern`** (PR-blocking error): flags any new discipline with surfaces_count = 1.
4. **Audit-of-audits**: meta-RZF on the engraving infrastructure itself; verifies the 5-surface registry is current.

## Why this is the moat (strategic value)

The user S002 turn 16 framing: *"how much value a system that does that gains? to stability? to scalability? cutting time and energy towards uniqueness vs other platforms."*

Empirically validated:

### Stability
Re-discovery cost prevented. Each catch is engraved once; never re-discovered. CSP demonstrated this across 330+ sessions: their `feedback_*` directory grows; AI's default-behavior shifts; what took correction in S132 doesn't re-occur in S320.

### Scalability
Each session inherits prior sessions' learnings WITHOUT manual sync. Memory directory + AGENTS.md + contracts auto-load at session-start. New session immediately has access to all prior engravings. Linear-effort engraving; compounding-returns operation.

### Uniqueness vs other AI platforms
Most AI platforms (per S002 turn-7 research stream R21):
- Don't formalize catches as persistent artifacts
- Rely on conversation-only memory
- Re-discover same patterns continuously
- Cannot accumulate disciplinary depth

CSPS with 5-Surface Engraving:
- Every catch becomes 5-surface artifact
- Catches compound across sessions
- Prior-session disciplines auto-load
- Disciplinary depth increases monotonically
- Time-and-energy spend shifts from "re-correction" to "new architecture"

The mechanism IS the platform's structural advantage. Every session that runs this discipline adds another layer of permanent muscle memory the platform never has to learn again.

### The math of compounding

If a session catches N novel patterns + engraves at 5 surfaces:
- Without discipline: next session re-discovers up to N patterns (cost = N × correction-time)
- With FSE discipline: next session inherits N patterns; cost = 0

Across 100 sessions:
- Without discipline: 100 × N × correction-time = bounded by re-correction
- With FSE discipline: cost(0) + cost(0) + ... + cost(0) = ZERO re-correction; all energy into NEW architecture

This is the literal moat. Other platforms re-correct; CSPS extends.

## Application TO THIS DOC (eating the dog food)

This very document is itself an engraving of the 5-Surface Engraving pattern. Per the discipline:

```yaml
FSE VALIDATION:
  catch_id: CATCH-S002-16
  catch_description: |
    User S002 turn 16 surfaced: B_CATCH_TO_ENGRAVING was engraved turn 15 but the 5-element
    pattern itself wasn't formalized as canonical reusable spec. Catches were being engraved
    inconsistently — some at 2 surfaces, some at 4, some at 5. The pattern needed its own
    canonical doc + meta-principle + completeness-audit.
  classification: new-discipline (operational layer for B_CATCH_TO_ENGRAVING)
  surfaces_engraved:
    schema:
      delta: closing-summary-template §10.13b mandatory header (already exists turn 15)
      path: _handoff/VAULT/closing-summary-template.md §10.13b
    validator:
      delta: catch-engraving-completeness audit (PR-blocking warn) + single-surface-engraving-anti-pattern audit (PR-blocking error)
      path: pillar-0/audit-runner.md (Zero-Findings Discipline category) + post-runtime week 4
    hook:
      delta: PostStop scans session log for catch-language; verifies 5-surface artifacts
      path: .claude/hooks/post-stop-five-surface-engraving.sh (planned week 4)
    memory:
      delta: feedback_five_surface_engraving.md (this turn)
      path: ~/.claude/projects/.../memory/feedback_five_surface_engraving.md + MEMORY.md index
    contract:
      delta: B_FIVE_SURFACE_ENGRAVING + AGENTS.md hard NO + spine row + canonical doc (this file)
      path: behavioral-contracts.md § B_FIVE_SURFACE_ENGRAVING + AGENTS.md + ai-behavior-spine.md + this file
  surfaces_count: 5
  level: full (4 surfaces immediately mechanical pre-runtime; hook deferred week 4 = 4.5/5 effectively)
  signature: S002-turn-16-AI-2026-05-03T<timestamp>
```

## Cross-references

- `pillar-0-governance/zero-findings-discipline.md` — RZF + CEC use 5-surface pattern at meta-level
- `pillar-0-governance/behavioral-contracts.md` § B_CATCH_TO_ENGRAVING — turn 15 contract; this doc operationalizes
- `pillar-0-governance/ai-behavior-spine.md` — discipline matrix; every row IS a 5-surface engraving record
- `pillar-0-governance/qc-audit-system.md` — operational layer for P-META-006; uses 5-surface pattern for audit-eligibility
- `_handoff/VAULT/closing-summary-template.md` §10.13b — mandatory enumeration header
- `principles.yaml#P-META-007` — registry entry
- `~/.claude/.../memory/feedback_five_surface_engraving.md` — cognitive layer
- AGENTS.md hard NO (turn 16) — AI-runtime enforcement
