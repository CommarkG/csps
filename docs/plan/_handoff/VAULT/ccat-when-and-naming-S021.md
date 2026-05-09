---
id: csps.handoff.vault.ccat-when-and-naming.S021
name: ccat-when-and-naming-S021
description: >
  Comprehensive design for: (1) WHEN as the 4th CCAT axis — temporal/priority dimension
  for optimal ordering; (2) Naming convention optimization with EXT- input gate;
  (3) HOW axis enhancements (multi-tag, multi-status, live updates);
  (4) Simulation as planning sandbox — honest assessment;
  (5) Gradual bundling expert design; (6) Research registry future vectors.
  All connected to mechanical enforcement across planning, implementing, auditing.
version: 1.0
lifecycle: production
lifecycle_state: pending-review
next_review_at: S022
dynamic: true
owner: group:finky
core_spine: GVRN
schema_anchor: platform_plans
session: S021
domain_path: platform
wisdom_class: insight
tags:
  - domain:governance
  - domain:architecture
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:draft
links:
  - { rel: ccat-framework, href: ./three-axis-orchestration-S021.md }
  - { rel: naming-policy, href: ../../../docs/plan/pillar-0-governance/naming-policy.md }
  - { rel: naming-validator, href: ../../../tools/validators/validate-naming-convention.mjs }
---

# CCAT WHEN + Naming + HOW Enhancements
## The Complete Design — S021

---

## §1 — WHEN as the 4th Axis (The Priority/Sequencing Dimension)

### Why WHEN Is As Important As WHO, WHAT, HOW

The Governor is correct: **optimal order IS architectural integrity.** A system built out of order carries permanent debt. If you build the WisdomVault before the domain schemas exist, the WisdomVault has nothing to aggregate. If you build UX before the compliance layer, every UI has to be rebuilt when HIPAA arrives.

**WHEN answers three questions simultaneously:**
1. At what lifecycle stage does this element exist? (seed → canonical)
2. What must be complete BEFORE this can begin? (dependency ordering)
3. What does this unlock AFTER it's complete? (downstream capabilities)

### The 4D Coordinate: (WHO, WHAT, HOW, WHEN)

```
(who=user, what=personal.health, how=consume, when=after:personal.health.zmodel+hipaa-profile)

(who=builder, what=platform, how=create, when=after:domain-taxonomy-ratified)

(who=crosscut, what=crosscut, how=aggregate, when=after:wisdomvault-foundation+10-real-users)
```

**WHEN makes the spiral visible.** The Gradual Execution Protocol is WHEN made explicit: ratification → Stage 1 (WHEN=after:simulation-zf) → full implementation (WHEN=after:stage-1-zf).

### CCAT Updated (4 Dimensions + 5 Questions):

```yaml
# Complete CCAT for any consequential action
ccat_who: "[persona]"                        # WHO: builder|user|solo_user|family_admin|etc.
ccat_what: "[domain_path]"                   # WHAT: business.finance|personal.health|etc.
ccat_how: "[interaction_pattern]"            # HOW: create|consume|collaborate|aggregate|govern
ccat_when: "after:[dependency_list]"         # WHEN: what must be sealed/ZF before this
ccat_why: "[one-sentence user value]"        # WHY: the ultimate justification
```

### WHEN Mechanical Enforcement

Add to plan frontmatter:
```yaml
sequence_requires:           # what must be complete before this plan executes
  - "domain-path:platform.foundation-slices (sealed)"
  - "plan:schema-phase-a (implemented)"
sequence_unlocks:            # what this plan enables after completion
  - "plan:health-domain-build"
  - "capability:wisdomvault-health-queries"
```

Validator: `validate-sequence-requirements.mjs` — checks that all `sequence_requires` items are at `sealed` or `zf-achieved` status before plan advances to `implementing`. **This is the mechanical enforcement of "fundamental things first."**

---

## §2 — Naming Convention: Optimized for Machine + Human

### The Problem

Current naming has three unsolved gaps:
1. **No machine-readable schema code** — an orchestrator cannot determine a file's domain/type from its name alone
2. **No collision prevention** — two sessions could create `health-domain.md` independently
3. **No input file gate** — external files arrive with foreign names, not renamed to CSPS convention

### The Solution: Two-Layer Naming

**Layer 1 (filename) — human-readable, simple:**
```
[slug].md                   # always-current (no session code)
[slug]-S[NNN].md            # per-session artifact
EXT-[source]-S[NNN]-[slug].md  # external input, renamed at gate
```

**Layer 2 (frontmatter) — machine-readable, schema-aligned:**
```yaml
id: "[spine_code].[schema_anchor].[slug].[session]"
domain_path: "[tier1].[tier2].[tier3]"        # WHO × WHAT coordinate
schema_code: "[SPINE]-[TYPE]-S[NNN]"           # for orchestrator routing
```

**The schema_code field (proposed):**
```yaml
schema_code: "ARCH-SCHM-S021"    # ARCH spine, schema type, session S021
schema_code: "GVRN-PLAN-S021"    # GVRN spine, plan type
schema_code: "PLAT-VAL-S021"     # platform domain, validator type
schema_code: "EXT-LOVB-S021"     # external input from Lovable, session S021
```

This lets the orchestrator route by `schema_code` WITHOUT parsing the filename. The filename stays human-readable; the frontmatter carries the machine-routing code.

### Input File Gate (EXT- Convention)

When any file arrives from an external source:
```
1. Save original: knowledge-tree-empty.md (unchanged)
2. Create CSPS-renamed: EXT-LOVB-S021-knowledge-tree-empty.md
3. Add CSPS frontmatter to renamed version
4. Link both files in frontmatter
```

The renaming hook fires on UserPromptSubmit when external file content is detected. It is NOT retroactive — it applies to new inputs. The Governor saves the original; the hook creates the CSPS-named version.

### Collision Prevention

`validate-naming-convention.mjs --duplicates` scans all filenames across the repo. Any collision is ADVISORY — the orchestrator cannot route unambiguously when two files share a name.

Rule: before creating any new file, run the collision check:
```bash
grep -r "name: [filename-without-ext]" docs/ tools/ | head -5
```
If results appear: add a disambiguation prefix.

---

## §3 — HOW Axis Enhancements

The Governor asks: how does the system handle multiple tags, multiple statuses, live updates?

### Multi-Tag Handling

**Current state:** Tags are additive (`tags: [domain:health, domain:finance]`). No governance on combinations.

**Enhanced model:** Tags form a **faceted classification system** — each dimension is independent:
```yaml
domain_tags: [health, finance]           # subject matter (multi-valued)
audience_tags: [developer, end-user]     # who consumes
maturity_tag: proven                     # single value (one maturity per artifact)
type_tag: reference                      # single value (one type per artifact)
spine_tag: ARCH                          # primary spine (single)
spines_tags: [ARCH, GVRN]               # all applicable spines (multi-valued)
```

Validators for each dimension enforce consistency within that dimension without restricting combinations across dimensions.

**The orchestrator sees all tags simultaneously.** A query "show me all ARCH artifacts that serve end-users and are at proven maturity" resolves across all three tag dimensions in one pass.

### Multi-Status Handling

**Current state:** Multiple status fields coexist independently: `cdp_status`, `impl_status`, `lifecycle_state`, `enforcement_stage`. This is correct — each tracks a different dimension.

**The issue:** When these conflict (cdp_status: sealed but impl_status: pending), there's no resolution logic.

**Enhanced model:** Status layers form a hierarchy with precedence:
```
lifecycle_state     → the artifact's governance lifecycle (active/deprecated)
  ↓ contained in ↓
cdp_status          → the implementation lifecycle (raw → sealed)
  ↓ contained in ↓
impl_status         → the current implementation state (swift-implemented)
  ↓ contained in ↓
enforcement_stage   → how mechanically enforced (stub/advisory/blocking)
```

Rule: a lower-level status cannot advance past a higher-level status.
`enforcement_stage: blocking` requires `impl_status: swift-implemented` requires `cdp_status: implemented`.

**Validator needed:** `validate-status-coherence.mjs` — checks that status fields don't contradict each other. Deferred → VLT-S021-STATUS-COHERENCE.

### Live Updating Without Gaps

**The problem:** A schema change at 14:00 may not propagate to all dependent validators until the next pnpm verify at 14:30. In that window, the system is in an incoherent state.

**The solution:** Event-driven propagation + the audit chain.

When any governed file changes:
1. `post-tool-use-cec-trigger.sh` fires → injects CEC requirement → propagation begins
2. `post-stop-pnpm-verify.sh` fires → validates the full system → catches incoherence
3. **The gap:** between a Write and the PostStop hook, there IS a window of potential incoherence

**The live update auditor:** A new hook concept — `post-tool-use-propagation-check.sh` — that fires immediately after any Write and checks the specific propagation requirements for that file type (using `build-verification-map.yaml`). Not a full pnpm verify — just the targeted checks for the changed file type. This closes the incoherence window from ~30 seconds to ~2 seconds.

**This IS an auditor expert** — specifically for live propagation integrity. VLT-S021-LIVE-PROPAGATION-AUDITOR.

---

## §4 — Simulation as Planning Sandbox — Honest Assessment

**Was it ever implemented?** NO. The simulation template (`tools/templates/simulation-template.md`) was created in S021. The 12 user journeys I ran were manual, ad-hoc, done once, in a single session. There is no:
- Automated simulation runner
- Daily or hourly refresh
- Change detection that re-runs affected simulations
- Simulation result database
- Simulation-ZF gate that blocks implementation

**What exists:** A template that defines the protocol. That's it.

**What the Governor envisions** (and what's needed):

```
Simulation as Planning Sandbox = a living system where:
  1. Scenarios are defined once and persist
  2. When any dependency changes, affected scenarios re-run automatically
  3. The simulation result IS the current plan state
  4. Simulation-ZF is the gate before implementation begins
  5. The sandbox runs continuously (daily/hourly like a CI system)
```

**The implementation path:**

**Phase Sim-1 (build now):** Scenario files in `tools/simulations/*.yaml` — each scenario defines (WHO, WHAT, HOW, WHEN) + expected behavior + known gaps. Static, not automated.

**Phase Sim-2 (S025+):** A simulation runner script that reads all scenario files and traces them through the current platform state (reading domain schemas, validators, compliance profiles). Outputs a simulation report.

**Phase Sim-3 (S030+):** Automated trigger — when any relevant file changes (schema, validator, compliance profile), re-run affected scenarios. Surface regressions.

**The "daily mirror" vision:** The simulation system is a mirror of the platform — when the platform changes, the mirror updates. When the mirror shows gaps, the platform must fix them before it can declare ZF. The mirror IS the CI for knowledge architecture.

**Honest current state: Phase 0.** The template exists. Nothing runs.

---

## §5 — Research Registry: Future Vectors

The Governor asks: "what about future uses from unprecedented vectors and combined logic with unexpected results?"

**The design gap:** The current registry stores findings as static text. It doesn't:
- Connect research findings to each other (cross-research relationships)
- Identify when two research items produce unexpected combined implications
- Surface research that becomes relevant in new contexts

**Enhanced research registry model:**

```yaml
research_items:
  - id: RESEARCH-001
    # ... existing fields ...
    connects_to: [RESEARCH-004, RESEARCH-007]   # explicit research connections
    unexpected_combinations:                     # emergent findings from research intersection
      - "RESEARCH-001 × RESEARCH-004: Two-sided market governance (Shopify) applied to GDPR (R4) reveals that the 'trust layer' in marketplace platforms IS the compliance layer — they're not separate concerns"
    future_vectors:                              # topics this research might inform in the future
      - "AI agent trust frameworks (when agents are market participants)"
      - "Privacy-preserving WisdomVault aggregation (combines R1 routing with R4 privacy)"
    open_questions:                              # what we don't yet know
      - "How does Maestro's static usage analysis apply to dynamic AI agent context?"
```

The `unexpected_combinations` field is the key innovation. When research A and research B are both in the registry, the system can surface: "if you're working on X, note that RESEARCH-A and RESEARCH-B together imply Y, which wasn't obvious from either alone."

This is the research equivalent of the WisdomVault's cross-domain insight generation.

---

## §6 — Gradual Bundling Expert: Design

### What "Gradual Bundling" Means in CSPS

The Governor asks about the gradual bundling elements and live dynamic load distribution. This connects to:
- The Gradual Execution Protocol (stages, not big bangs)
- B_COMPLETION_OVER_SHINY (finish before starting)
- The Priority Engine (sequencing by compound value)
- Context orchestrator (minimum viable context per task)

**Current state of gradual bundling:**

| Element | Exists? | Quality |
|---|---|---|
| Gradual Execution Protocol | ✓ Documented | Mechanical enforcement weak |
| B_COMPLETION_OVER_SHINY | ✓ Contract exists | Advisory only |
| Priority Engine | ✓ formula + 4 compositions | Not re-evaluated dynamically |
| Context orchestrator | ✓ Task-class detection | Static templates, no adaptation |
| Depth levels (L1/L2/L3) | ✓ Defined in domain cards | Context orchestrator doesn't SELECT depth |
| Humble batch discipline | ✓ Documented | No validator |

**What's missing: the Bundling Expert Auditor**

A new expert persona (builds on Expert Council Persona 4) specialized in:
1. **Before session:** Is the proposed batch scope too large to complete to ZF in one session?
2. **During session:** What should be deferred when context pressure rises?
3. **After session:** Did we complete what we started, or did we leave things partial?
4. **Optimization:** Can multiple planned items be bundled (serve each other) rather than executed sequentially?

**The Expert Bundling Audit protocol:**

```
PRE-SESSION BUNDLING CHECK:
  □ How many P1 items are in scope? (target: ≤3 per session)
  □ Does the scope contain cross-spine dependencies? (flag: could stall mid-session)
  □ Are all dependencies satisfied for P1 items? (check: sequence_requires)
  □ What's the minimum viable scope for ZF this session? (bound the work)

MID-SESSION LOAD CHECK:
  □ Context at >70% → defer P3 items to next session
  □ Any item taking >30 minutes → re-assess scope
  □ New item proposed? → check B_COMPLETION_OVER_SHINY first

POST-SESSION BUNDLING REPORT:
  □ What was started but not finished? (add to backlog)
  □ What was finished and extracted positive ZF? (record)
  □ What was the actual vs. planned scope? (calibrate future sessions)
```

### Live Dynamic Load Distribution

The Governor asks about "live dynamic load distribution led by deep context and importance rather than quick unplanned cutting off."

**The current problem:** When context fills up, the default behavior is either:
(a) Run /compact (destructive — loses context quality)
(b) Stop and wait (inefficient)

**The better model:**

**Graduated context management:**
1. At 50% context: begin flagging new items as "session-deferred, backlog entry created"
2. At 70% context: complete current task, then re-evaluate scope
3. At 85% context: finish the current atomic unit (single function/validator), then surface a managed handoff
4. At 95% context: write the session artifacts (summary, backlog updates), then close cleanly

**"Importance-led" means:** context is released from LOW-importance content first:
- Raw tool output (kept in summary form, not full output)
- Completed and documented items (reference by link, don't keep inline)
- Context already captured in committed files (reference by GitHub URL)

**The audit question:** "What in my current context is still load-bearing for the next 3 turns? What can be referenced by URL rather than held in context?"

### Preventing Duplication and Contradiction

The Governor asks about "prevention of duplications and contradictions." This connects to:
- validate-nothing-stands-alone.mjs (connectivity check)
- The consolidation-expert skill (duplication detection)
- B_CONSOLIDATION_PASS (5-step protocol)

**What's missing:** A pre-build check that asks "does something like this already exist?" BEFORE creating new artifacts.

**The mechanical enforcement:** Add to the PreToolUse Write hook:
1. When a new .md file is being created in a governed path:
2. Search for files with similar names (fuzzy match on slug)
3. Search for files with similar description in frontmatter
4. If similar found: ADVISORY — "Similar artifact exists at [path]. Confirm this is distinct."

This prevents the most common duplication pattern: creating a new file without knowing an equivalent already exists.

---

## §7 — CCAT as Universal Mechanic

The Governor asks: "connect to completion elements and ZF elements and principles. make all mechanical and enforced each time."

**The CCAT as a pre-flight checklist:**

Every tool call that creates or modifies a governed artifact should answer CCAT. The mechanical enforcement:

```
CCAT fires on:
  - Write to any .md in docs/ or tools/
  - Write to any .yaml in tools/config/
  - Write to any .mjs in tools/validators/

CCAT requires (before tool call proceeds):
  - WHO: which persona is this for?
  - WHAT: which domain_path does this serve?
  - HOW: what interaction pattern does this support?
  - WHEN: what must exist before this? what does this unlock?
  - WHY: what user value does this create?

If any answer is "don't know" → advisory: explain the gap before proceeding.
```

**Connection to completion circle:**
- `ccat_why` → directly becomes `user_value` in the completion circle
- `ccat_who` → directly becomes `developer_surface` classification
- `ccat_when` → connects to `cdp_status` and `sequence_requires`

**Connection to ZF:**
- Simulation-ZF = CCAT answers all 5 questions with no "don't know" → cleared for Stage 1
- Stage 1 ZF = real users confirm the ccat_why is actually true
- Full ZF = all sequence_unlocks are realized

**The CCAT as North Star check:**
- Local North Star: WHEN must answer "this session mandate"
- Major North Star: WHAT must answer "a domain in the 3-tier taxonomy"
- If either fails: the task is out of scope for now

---

## Mechanical Enforcement Plan

| Mechanism | Status | Priority | What It Enforces |
|---|---|---|---|
| validate-naming-convention.mjs | ✓ Built S021 | P1 | Filename + EXT- prefix + duplicates |
| validate-sequence-requirements.mjs | Planned | P2 | WHEN dependency ordering |
| validate-status-coherence.mjs | Planned | P2 | Status fields don't contradict |
| post-tool-use-propagation-check.sh | Planned | P2 | Live update propagation |
| CCAT gate in Write hook | Planned | P3 | 5-W check before governed writes |
| Bundling audit at session open | Planned | P2 | Scope check before starting |
| Research future-vectors field | Planned | P3 | Cross-research connections |

---

*S021 | 2026-05-09 | Dynamic — Governor ratification required before implementation.*
