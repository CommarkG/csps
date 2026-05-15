---
id: csps.handoff.vault.bottleneck-gradual-structures.S019
name: bottleneck-and-gradual-structures-S019
description: >
  Analysis and improvement specifications for: (1) Bottleneck/overload detection
  and prevention — mechanical improvements to Sonnet's bottleneck awareness.
  (2) Gradual structures — depth levels, CDP lifecycle, Core Seeds, Gradual Execution
  Protocol — reviewed for whether they achieve their purpose and how to improve
  mechanical enforcement. (3) Context orchestrator improvements.
version: 1.0
lifecycle: production
lifecycle_state: pending-review
next_review_at: S020
owner: group:finky
core_spine: ARCH
schema_anchor: opus_consultations
session: S019
created_by: Claude Sonnet 4.6[1M] — Opus-designated architectural review
tags:
  - domain:architecture
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:draft
links:
  - { rel: parent, href: ./sonnet-capability-injection-S019.md }
  - { rel: bottleneck-skill, href: ../../../.claude/skills/bottleneck-expert/ }
domain_path: platform
scope_level: S1
---

# Bottleneck Detection, Gradual Structures, and Orchestrator Improvements
## Sonnet Specification for S020 Implementation

---

## Section 1: Bottleneck Detection — Enhancing Sonnet's Awareness

### The Gap

Sonnet identifies bottlenecks when asked (the `/bottleneck-expert` skill exists). It does not proactively detect them during normal building. The S019 review found the N+1 bootstrap query (every API request makes 2 DB queries when 1 would suffice), but this wasn't caught by any validator — it was identified by reading the code with the time-projection mental model.

### The 5 Classes of CSPS Bottlenecks

**Class A — Query Bottlenecks (per-request cost)**
Pattern: N+1 queries, missing indexes, relation traversal without correct index
Detection: scan API routes for `findUnique({ where: { clerkId` preceding `edb.`
Current example: bootstrap lookup in every API route (L8 opus-lessons)
Mechanical fix: `validate-query-patterns.mjs` — advisory on N+1 patterns

**Class B — Validator Runtime Bottlenecks (per-commit cost)**
Pattern: Validators that iterate all files (O(N) in file count)
Current state: At 1 app, pnpm verify runs in ~30s. At 30 apps, file-walking validators
will scale super-linearly. Already identified: `validate-core-seeds.mjs` walks ALL .mjs/.sh files.
Mechanical fix:
1. Profile the 5 slowest validators: `time node tools/validators/validate-[X].mjs`
2. For each O(N) validator: add a file manifest approach (pre-computed file list)
3. Target: pnpm verify < 30s at 5 apps (current) and < 60s at 30 apps (target)

**Class C — Governance Cognitive Bottlenecks**
Pattern: Too many artifacts requiring attention per session → Governor attention is the scarce resource
Current: 265+ audit slugs (most deferred), 52 contracts, 41 validators → cognitive load is high
Mechanical fix: Priority Engine already handles work sequencing. Enhancement:
Add a "cognitive load score" to session-state.json — how many active (non-deferred) governance items are requiring Governor attention? High score → simplification signal.

**Class D — Context Size Bottlenecks (per-response cost)**
Pattern: AGENTS.md at 200-line limit. Domain cards mixing human + AI content. Bulk-loaded context.
Current: R2-R4 constraints in AGENTS.md inflate it unnecessarily.
Mechanical fix: AGENTS.md R1-only refactor (from Part 3, sonnet-capability-injection). Monitor using validate-token-budget.mjs.

**Class E — Schema Scale Bottlenecks (per-app cost)**
Pattern: Flat ZModel file, single-file bottleneck at ~30 models
Current: VLT-S017-FLATSCHEMA tracked; no session target set
Mechanical fix: Set session target S022 for multi-file ZModel import-ordering protocol.

### Bottleneck Detection Sonnet Specification

**Validator to create: `validate-query-patterns.mjs`**
```
Purpose: Detect N+1 query patterns in API routes
Scan: apps/*/src/app/api/**/*.ts
Pattern: findUnique({ where: { clerkId }) followed within 10 lines by getEnhancedDb or edb.
Exit: ADVISORY (0) — report pattern; suggest session-claim replacement
Coverage Level 1: detect N+1 in API routes
Coverage Level 2: detect missing @@index for policy traversal fields (deferred → VLT)
```

**Validator to create: `validate-validator-runtime.mjs`**
```
Purpose: Profile slowest validators; flag O(N) file-walkers
Approach: Read each validator, detect readdirSync/walkForSeeds/glob patterns
Flag: validators that walk more than 1 directory recursively without a cache
Exit: ADVISORY (0) — report estimated scale impact
Coverage Level 1: detect recursive file walkers
Coverage Level 2: measure actual runtime and compare to budget (deferred → VLT)
```

**Inner-AI-defaults addition for bottleneck-awareness:**
```yaml
entry: reasoning-bottleneck-blindness
default_pattern: >
  AI implements what's needed for current scale without projecting to 30×.
  N+1 queries are "fine for now." O(N) validators are "fast enough today."
  Scale problems are invisible until they become crises.
csps_aligned_pattern: >
  Before implementing any query pattern or file-walking logic, ask:
  "At 30 apps × 1,000 tenants × 100 concurrent users — what is the cost of
  this operation? Is it O(1)? O(N)? O(N²)?" If O(N²): propose an alternative.
disposition: override
opus_pattern: >
  Opus runs the bottleneck-expert mental model on every implementation:
  'What is the O() complexity? What breaks at 10× current load?'
  Sonnet waits to be asked. The injection: fire the scale projection automatically.
moat_relevance: compound
caught_by_validator: validate-query-patterns.mjs (planned) + bottleneck-expert skill
status: active
```

---

## Section 2: Gradual Structures — Are They Doing What They Were Built For?

### Audit of Each Gradual Structure

**Structure 1: Depth Levels (L1/L2/L3)**

*What they were built for:* Load only what's needed. L1 for executive decisions, L2 for operational context, L3 for implementation detail. The context orchestrator selects the right depth.

*Current reality:* Domain cards have L1/L2/L3 depth_levels fields (correct). BUT: the context orchestrator loads the FULL document, not the depth-selected slice. The L1/L2/L3 fields exist but are decorative — no mechanism reads them and loads a subset.

*The gap confirmed:* The depth levels were designed for selective loading. The selective loading was not implemented. Every domain card loads at full depth every time.

*Improvement specification (Sonnet implementation):*
```
Create: tools/generators/extract-depth-slice.mjs
Purpose: Given a domain card path + depth level (1|2|3), extracts only the relevant section
Output: 100-token L1 summary | 1500-token L2 operational | full L3
Integration: Context orchestrator calls this generator instead of loading full file
When: After Phase 10 (automatic context injection) is implemented
Interim: Sonnet manually calls at right depth in CONCEPT_LOAD
```

**Structure 2: CDP Lifecycle States**

*What they were built for:* Every platform element has a unified lifecycle: raw → ratified → implementing → implemented → measured → sealed. This replaces 5 scattered lifecycle fields with one governed state machine.

*Current reality:* `cdp_status` field exists in frontmatter across many artifacts. BUT: the `validate-impl-status.mjs` validator checks `impl_status` (a different field). There's potential confusion between `cdp_status` and `impl_status`.

*The gap:* CDP lifecycle transitions should be mechanically validated — you cannot move from `ratified` to `sealed` by skipping `implementing`. Currently nothing enforces forward-only transitions.

*Improvement specification:*
```
Create: validate-cdp-transitions.mjs
Purpose: For every artifact with cdp_status, validate:
  (a) cdp_status is in the closed enum (raw|pipeline-intake|...|sealed)
  (b) Transition from previous cdp_status is forward-only (no backward transitions without ADR)
  (c) cdp_status: implementing must have a corresponding VLT or session reference
Exit: ADVISORY (0) — report violations; BLOCKING when backward transition detected
Note: Needs git blame to detect transition direction — complex. Simplify to:
  Just validate cdp_status is in enum and sealed artifacts have zf-achieved evidence.
```

**Structure 3: Core Seeds**

*What they were built for:* Structured placeholders in code that make invisible gaps visible. A planted seed is a tracked obligation — it must grow into a real implementation.

*Current reality:* `validate-core-seeds.mjs` is STUB_MODE = true — exits 0 always. 6 seeds are planted (GRACE_PHASE10, ZF_POSITIVE_HARVEST, etc.). The staleness detection (seeds past their target session) is not running.

*The gap confirmed:* Every planted seed has a target session. The stub mode means seeds can pass their target session with no escalation. The seeds are invisible governance debt.

*Improvement specification (IMPLEMENT NOW — stub promotion):*
```
Change in validate-core-seeds.mjs: STUB_MODE = false
Effect: The validator will now:
  - Report seeds where target session has passed (overdue)
  - Report seeds where grows-to artifact now exists (grown — should be removed)
Exit behavior: ADVISORY (0) — overdue seeds are advisory, not blocking
  Rationale: stub promotion to advisory doesn't block development, but makes debt visible
```

**Structure 4: Gradual Execution Protocol (GEP)**

*What it was built for:* Ratification ≠ proven. Every ratified plan requires Stage 1 (1-3 real cases) before Stage 3 (full scope). This prevents intellectual analysis from being mistaken for validated implementation.

*Current reality:* The protocol exists as a document and a reasoning-patterns inner-defaults entry. BUT: Stage 1 completion is verified by AI self-report. Nothing mechanically verifies that Stage 1 evidence was produced before Stage 3 deployment.

*The gap:* An AI can move from `enforce_stage: ratified` to `enforce_stage: full` without producing Stage 1 evidence. The protocol is a contract; the enforcement is behavioral.

*Improvement specification:*
```
Add to frontmatter schema: enforce_stage_history: []
  - When stage transitions: append {from: X, to: Y, session: SXXX, evidence: "tool output path"}
  - validate-impl-status.mjs extension: check enforce_stage_history is populated for active elements
  - Flag ADVISORY when full-scope element has no stage-1 evidence in history
```

---

## Section 3: Context Orchestrator — Improvements

### Current State

`user-prompt-submit-context-orchestrator.sh` detects task class by regex on the user prompt → writes recommendation to `tools/context-orchestrator-last-run.json`. It is advisory only (Phase 10 will make it active injection).

### Issues Identified

**Issue 1 — No feedback loop for mis-classifications**
The orchestrator recommends a task class. The main AI may agree or disagree. Neither outcome is logged. After 100 sessions, the orchestrator has the same accuracy it had at session 1 — no learning.

**Improvement:** After every session close, log: "Orchestrator recommended X. CONCEPT_LOAD declared Y. Match: YES/NO." Store in `tools/context-orchestrator-accuracy.json`. After 20 sessions, review the accuracy and update the regex patterns for mis-classified task classes.

**Issue 2 — Static task classes don't handle hybrid prompts**
A prompt like "close the session" is task-class: session-close. A prompt like "close the session but first fix the validator" is hybrid. The orchestrator picks one class and loads one bundle, missing the other.

**Improvement:** Allow multiple task classes: `task_classes: ["session-close", "schema-work"]`. Load the UNION of both bundles. Sonnet resolves conflicts.

**Issue 3 — No depth selection**
The orchestrator loads artifacts but doesn't select the depth level (L1/L2/L3). For a quick decision, L1 (100 tokens) suffices. For implementation, L3 is needed.

**Improvement:** Bundle templates gain a `depth` field per artifact:
```json
{
  "artifact": "docs/platform-audit/spines/ARCH.md",
  "depth": "L1",
  "load_at": "task-class-detection"
}
```
The orchestrator's output includes the depth-selected content, not the full document.

**Issue 4 — No escalation signal to Opus**
When the orchestrator detects a task class that triggers Opus (Big Plan Gate, Phase Exit Gate), it has no mechanism to escalate. It just logs to last-run.json.

**Improvement:** Add to `tools/context-orchestrator-last-run.json`:
```json
{
  "opus_escalation_recommended": false,
  "opus_escalation_reason": ""
}
```
When task class = governance-decision AND any plan frontmatter shows `spines_affected >= 3` → set `opus_escalation_recommended: true`. The validate-opus-audit-due.mjs reads this and adds it to the session check.

### Orchestrator Improvement Sonnet Specification

**Step 1 (implement next session):** Add accuracy tracking to context-orchestrator-last-run.json
**Step 2 (S021):** Multi-class detection for hybrid prompts
**Step 3 (S022):** Depth selection per artifact in bundle templates
**Step 4 (S023):** Opus escalation signal from orchestrator to validate-opus-audit-due.mjs

---

## Section 4: Haiku Role — Mechanical Enforcement

### What Persona 3 (Haiku Scout) Was Built For

Haiku handles mechanical work in isolation: file scanning, validator runs, grep operations. It returns a structured summary. It never makes governance decisions. It never reads AGENTS.md or behavioral contracts.

### Current Enforcement State

**Defined:** `docs/platform-audit/ai-personas.md` §3 Persona 3
**Enforced by:** The `pre-tool-use-skill-aap-required.sh` hook checks AAP for skills.
**NOT enforced:** 
- Nothing verifies that Haiku subagent tasks include the return format in their spawn prompt
- Nothing verifies that the returned output matches the haiku_scout_return schema
- Nothing prevents Haiku from making architectural recommendations in its return

### Mechanical Enforcement Specification

**Mechanism 1 — Spawn template enforcement:**
```
Create: tools/templates/haiku-spawn-template.md
Purpose: Every Haiku subagent spawn must include this template in the task description
Contents: 
  - Return format: haiku_scout_return (required fields)
  - pattern_flags: list of patterns to detect
  - NEVER sections: governance decisions, recommendations, AGENTS.md reading
Pre-tool-use hook: scan Agent tool calls for task descriptions < 200 words
  AND not containing "haiku_scout_return" → ADVISORY: missing return format
```

**Mechanism 2 — Return validation:**
```
Create: validate-haiku-return-format.mjs
Purpose: Read subagent return artifacts; verify haiku_scout_return fields are present
Scan: Any file in tools/ or _handoff/ matching haiku-return-*.json
Fields required: task, status, findings (array), next_action
Exit: ADVISORY — logs missing fields as governance gap
```

**Mechanism 3 — Pattern library (create now):**
See `tools/config/haiku-pattern-library.yaml` — listed in sonnet-capability-injection-S019.md Part F.
This library IS the enhancement to Haiku's intelligence — by pre-defining what patterns to detect,
Haiku tasks become higher-quality without requiring more model capability.

### Haiku Pattern Library Specification

```yaml
# Create as: tools/config/haiku-pattern-library.yaml
# Sonnet includes relevant patterns in every Haiku spawn prompt

patterns:
  satisfaction_point_risk:
    grep_pattern: '\b(DONE|COMPLETE|RATIFIED|ZF ACHIEVED)\b'
    file_scope: "*.md response artifacts"
    escalate_to: sonnet
    severity: ADVISORY
    
  n_plus_one_query:
    grep_pattern: 'findUnique.*clerkId.*\n.*getEnhancedDb'
    file_scope: "apps/*/src/app/api/**/*.ts"
    escalate_to: sonnet
    severity: ADVISORY
    
  layer_boundary_violation:
    grep_pattern: "import.*from.*'apps/"
    file_scope: "libs/**/*.ts"
    escalate_to: sonnet
    severity: BLOCKING
    
  raw_prisma_in_business_route:
    grep_pattern: "import \\{ PrismaClient \\}|new PrismaClient"
    file_scope: "apps/*/src/app/api/**"
    escalate_to: sonnet
    severity: BLOCKING
    
  billing_logic_in_wrong_layer:
    grep_pattern: "memberCount|getStripe\\(\\)|subscriptions\\.create"
    file_scope: "apps/*/src/app/api/webhooks"
    escalate_to: sonnet
    severity: ADVISORY
    
  coverage_header_missing:
    grep_pattern: "Coverage Levels:"
    file_scope: "tools/validators/*.mjs"
    invert: true  # flag files WITHOUT this pattern
    escalate_to: sonnet
    severity: ADVISORY
```

---

## Implementation Priority (for next Sonnet session)

| Priority | Task | File | Complexity | Benefit |
|---|---|---|---|---|
| S1 | Promote core-seeds from stub to advisory | validate-core-seeds.mjs | Trivial (1 line) | Makes seed debt visible |
| S2 | Create haiku-pattern-library.yaml | tools/config/ | Low | Haiku intelligence layer |
| S3 | Create haiku-spawn-template.md | tools/templates/ | Low | Haiku enforcement Level 1 |
| S4 | Create validate-query-patterns.mjs | tools/validators/ | Medium | N+1 detection |
| S5 | Context orchestrator accuracy tracking | last-run.json schema | Low | Feedback loop |
| S6 | CDP transition validator | tools/validators/ | Medium | Lifecycle enforcement |
| S7 | Depth extraction generator | tools/generators/ | Medium | Depth levels working |
| S8 | Orchestrator multi-class detection | context-orchestrator.sh | Medium | Hybrid prompt support |

*This document is the specification. Sonnet implements from here.*
*Governor ratification required before S6 (CDP) and S7 (depth extraction) — they affect platform infrastructure.*
