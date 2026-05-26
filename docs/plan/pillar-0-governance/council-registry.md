---
id: csps.pillar-0-governance.council-registry
name: council-registry
description: The CSPS Internal Council Registry — all 17 expert skill members mapped to domain, PE band, audit pipeline, recurring protocol, and improvement feedback loop. The orchestrator (context-orchestrator.sh) dispatches to the right member. The improvement pipeline (know-how-extractor.mjs) feeds insights back. Per S011 user directive "formalize the internal council of expert members that will be refined and used wisely with an orchestrator."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: stable
core_spine: AI
core_spines: [AI, GVRN, OPER]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:ai
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S011
file_depth_markers:
  l1_lines: "1-80"
  l2_lines: "81-end"
  read_protocol: "L1 = council map table + orchestration model. L2 = per-member detail + improvement pipeline."
links:
  - { rel: audit-hub, href: ./audit-hub.md }
  - { rel: orchestrator, href: ../../../.claude/hooks/user-prompt-submit-context-orchestrator.sh }
  - { rel: know-how-extractor, href: ../../../tools/know-how-extractor.mjs }
  - { rel: pe-schema, href: ../../../tools/templates/priority-engine.schema.yaml }
domain_path: platform
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# Council Registry — CSPS

> **One skill = one council member = one audit pipeline = one recurring protocol.** Modify the skill → domain/audit/protocol all update. The orchestrator dispatches; the improvement pipeline refines. Per B_KNOW_HOW_DISCIPLINE + P-META-010 (AAP).

## §1 — The orchestration model

```
USER PROMPT
    ↓
context-orchestrator.sh (UserPromptSubmit hook)
    ↓ detects task-class
COUNCIL DISPATCH TABLE (this file §2)
    ↓ loads appropriate skill(s)
COUNCIL MEMBER (SKILL.md)
    ↓ operates within constraints
IMPROVEMENT PIPELINE
    ↓ know-how-extractor.mjs extracts insights
COUNCIL REGISTRY UPDATE
    (SG-NNN or EP-NNN feeds back into §KH checklists)
```

**Key property:** skills are loaded into context (zero spawn overhead). The orchestrator is lightweight (keyword detection). The improvement pipeline runs weekly. The whole system improves after every session.

## §2 — Council member registry

| Member | Domain | PE band | Audit pipeline | Trigger patterns | Recurring protocol |
|---|---|---|---|---|---|
| **engraving-discipline** | FSE 5-surface atomic engraving | Band 1 (constitutional) | P5 engraving-completeness | engrave / 5/5 atomic / new B_* | Weekly: K=2 patterns → new engraving |
| **governance-session** | Session lifecycle (open/close/HPFA) | Any (gate role) | P1 pre-close-verification | starting session / session open / close session / handoff | Per-session |
| **zf-validation** | ZF/RZF/CEC cycles + DONE claims | Any (gate role) | P4 zero-findings-cycle | ZF / RZF / CEC / verify / DONE / RATIFIED | Per-DONE-claim |
| **verify-quick** | Condensed verify gate — exit_code + first FAIL | Any (gate role) | P1 pre-close-verification | verify-quick / quick verify / run verify / pnpm verify | Per-commit / Per-claim |
| **zf-cycle** | ZF Cycle 1+2 block with file citations | Any (gate role) | P4 zero-findings-cycle | zf-cycle / write ZF / generate ZF cycles / ZF evidence block | Per-DONE-claim |
| **proto-relay** | PROTO relay block generator | Band 2-3 | P3 operations | proto-relay / write relay / generate relay / relay block | Per-STEP |
| **step-accept** | Step completion evaluator (ACCEPTED/COURSE-CORRECT) | Any (gate role) | P1 pre-close-verification | step-accept / accept this step / verify step / is STEP done | Per-STEP |
| **behavioral-contracts-skill** | B_* lookup + application + hard NOs | Band 1-2 | P10 csps-alignment | B_* / behavioral contract / hard NO / AGENTS.md | Weekly: drift detection |
| **slim-handoff** | HANDOFF + HPFA + closing-summary | Band 3 (session-close) | P1 pre-close | handoff / HANDOFF / session close / closing summary | Per-close |
| **pcr-rendering** | Pros/Cons/Recommendation decisions | Any (triggered) | P4 (decision quality) | should we / X vs Y / decide between / options: | Per-decision |
| **vocabulary-canon** | Naming + frontmatter + closed enums | Band 2-3 | P6 schema-integrity | name / naming / frontmatter / lifecycle / maturity | Weekly: enum drift |
| **principles-skill** | Principle lookup via MCP + slices | Any (lookup) | P4 zero-findings | P-META- / P-ARCH- / what does P- | Per-principle-query |
| **swift-build** | Gradual-build-plan + PE + depth | Band 1-2 | P5 engraving | topic-plan / element-review / depth-3/4/5 / gradual build | Per-plan-open |
| **cc-absorption-csps** | Governor prompts + cardinal cross-links | Band 1 | P1 + governor-prompts | governor prompts / GP-S / cardinal / user-intents | Per-GP |
| **behavioral-contracts-skill** *(ARCH variant)* | Core Spine discipline + L1/L2/L3 | Band 1 | P6 schema-integrity | core_spine / GVRN / ARCH / spine | Per-artifact-creation |
| **audit-self** (packages) | Audit health + orphan detection | Band 2 | P5 engraving-completeness | audit health / orphans / covered? | Weekly |
| **batched-plan** (packages) | Batched execution planning | Band 2-3 | P8 complexity | N similar operations / batch | Per-batch |
| **learning-loop-extract** (packages) | Learning loop extraction | Band 2 | P7 intake-and-learning | learning loop / extract / insights | Weekly |
| **pcr** (packages) | PCR canonical | Band 2 | P4 | pros/cons/recommendation | Per-decision |
| **reuse-check** (packages) | P-OP-001 reuse-first check | Band 1 | P10 csps-alignment | reuse / check_reuse / existing / enhance | Pre-implementation |
| **stewardship-review** (packages) | Lifecycle stewardship | Band 3 | P5 | stewardship / lifecycle / deprecate | Monthly |
| **internal-deep-review** | Structured Sonnet critical review — honest capability declaration + proactive concern registration | Band 1 | P14 EP-014 | deep review / structured review / critical audit / architectural review / self-audit / internal review | Per-session (mandatory before session close) |
| **pe-agent** | PE-scores PI items + detects bundle opportunities + proposes implementation bundles to Governor | Band 1 | PI-004 | PE score / bundle / priority / which PI / score the items / priority engine / what to build next / bundle proposal | On-demand (Governor-triggered) |
| **balance-expert** | Platform complexity tracking + anti-overengineering + Occam Razor + simplification backlog | Band 1 | P19 M-19 WS-2 | over-engineering / balance / simplify / complexity score / too complex / remove before adding | Per-session + Monthly |
| **wip-check** (packages) | Work-in-progress check | Band 3 | P1 | wip / in progress / outstanding | Per-session |
| **synergy-master** | Core Cross-Synergy analysis + CSEP production | Band 2 | P13 M-13 | synergy / cross-synergy / CSEP / how does X enhance Y | Monthly |
| **cruel-critic** | Stability + scalability review of CSEPs | Band 1 | P13 M-13 | cruel critic / stability review / scale this to 300 / CSEP review | Per-CSEP |
| **consolidation-expert** | See-what-exists + consolidation debt | Band 1 | P10 csps-alignment | consolidation / what exists / redundant / merge / see what exists | Pre-implementation |
| **bottleneck-expert** | Scale projections + O(N²) detection | Band 2 | P8 complexity | bottleneck / overload / scale / 30 to 300 / at scale | Per-design-decision |
| **ux-expert** | App UX + governance UX + AI interaction UX | Band 2-3 | P3 cognitive-context | UX / user experience / user flow / friction / DX | Per-feature |
| **schema-expert** | ZModel + RLS + tenant isolation + foundation slices | Band 1 | P6 schema-integrity | ZModel / schema / RLS / tenant isolation / foundation slices | Per-schema-design |
| **core-spine-expert** | Spine classification + doctrine + conflict resolution | Band 1 | P15 M-15 CORE alignment | core_spine / which spine / spine conflict / L1 sealed / spine precedence | Per-artifact-creation |

## §3 — The PE connection

Each council member operates in a PE band. The orchestrator selects the right member; the PE determines priority:

```yaml
# PE band → council behavior
Band 1 (CRITICAL):   governance-session, engraving-discipline, zf-validation, behavioral-contracts
Band 2 (HIGH):       swift-build, vocabulary-canon, principles-skill, audit-self, reuse-check
Band 3 (MEDIUM):     pcr-rendering, slim-handoff, stewardship-review, batched-plan
Band 4 (LOW):        any maintenance or polish skill
```

**Orchestration rule:** Band 1 council members are ALWAYS consulted for their domain — they are gate roles, not optional. Band 2-4 are consulted when the task class matches their trigger.

## §4 — The recurring protocol per member

| Cadence | Council members that run | What they produce |
|---|---|---|
| **Per-prompt** | context-orchestrator.sh selects appropriate member | Context loaded, discipline applied |
| **Per-session** | governance-session (open + close), zf-validation (per DONE claim) | Session artifacts, ZF evidence |
| **Weekly (Monday 08:03)** | audit-self, behavioral-contracts (drift), learning-loop-extract, vocabulary-canon | EP-NNN + SG-NNN candidates, drift reports |
| **Monthly** | stewardship-review, principles-skill (full scan) | Lifecycle updates, principle freshness |
| **Quarterly** | All Band 1 members | Full platform governance review |

## §5 — The improvement pipeline (how the council gets better)

```
Session close §10.0j + §10.13b + §10.11b
    ↓
know-how-extractor.mjs
    ↓ classifies
EP-NNN (DON'T patterns) → pre-plan-creation.md §KH DON'T items
SG-NNN (DO patterns)    → pre-plan-creation.md §KH DO items
    ↓
Updated §KH used in next session's plan creation
    ↓
Plan with better §KH → session produces fewer EP findings
    ↓
Compounding: each session improves the council's effectiveness
```

**The mechanical close of the loop:** validate-plan-know-how.mjs checks §KH quality. If §KH items don't reference recent EP/SG entries, the plan fails. This forces council improvement propagation.

## §6 — validate-council-coverage (future validator)

`validate-council-coverage.mjs` (to be built, audit slug: `council-coverage`):
- Every active SKILL.md must be in this registry
- Every registry entry must reference an active audit pipeline slug
- Every registry entry must have a recurring_protocol field
- Any skill added to .claude/skills/ or packages/skills/ without a registry entry = FAIL

This closes the "skill added but not connected to council" gap.
