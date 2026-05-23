---
id: csps.pillar-0-governance.threshold-gate-v2
name: threshold-gate-v2
description: The Threshold v2 — extended with complete non-trivial input taxonomy (13 input types), mandatory see-what-exists gate at step 0, ripple-check audit between intent and impact, developer dashboard schema, and platform comparison framework integration. Every input type is treated identically as source_class + classified_type + route_to. The uniqueness: governance enforcement happens at the INPUT STREAM level, not just at merge time.
version: 2.0
owner: group:finky
lifecycle: production
lifecycle_state: active
impl_status: swift-implemented
template_used: pillar-leaf
template_status: stable
core_spine: GVRN
core_spines: [GVRN, OPER, AI, VALD, ARCH]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - domain:ops
  - type:reference
  - audience:ai-agent
  - maturity:stable
diataxis_type: explanation
session: S011
file_depth_markers:
  l1_lines: "1-100"
  l2_lines: "101-end"
  read_protocol: "L1 = full input taxonomy + pipeline v2. L2 = per-type normalizers + ripple-check + developer dashboard."
links:
  - { rel: threshold-v1, href: ./threshold-gate.md }
  - { rel: vault-methodology, href: ./vault-methodology.md }
  - { rel: council-registry, href: ./council-registry.md }
  - { rel: daily-update-plan, href: ./daily-update-plan.md }
domain_path: platform
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# The Threshold v2 — Universal Input Pipeline

> **Every input type — trivial or non-trivial, internal or external — crosses The Threshold identically.** The type determines the source_class and classified_type; the content determines the route_to. Nothing is processed before crossing.

## §1 — The 13 input types (complete taxonomy)

| # | Input type | source_class | classified_type | Default route_to | Example |
|---|---|---|---|---|---|
| 1 | User prompt (governance directive) | chat-channel | user-directive | SWIFT_EXECUTE (if 4-condition) | "Engrave B_KNOW_HOW_DISCIPLINE" |
| 2 | User prompt (question) | chat-channel | question | COUNCIL_REVIEW | "What does P-META-018 mean?" |
| 3 | User prompt (ratification) | chat-channel | ratification | SWIFT_EXECUTE | "I approve / proceed" |
| 4 | External file/URL/paste | external-content | document | VAULT_DEFER (always review) | Lovable app export |
| 5 | Agent/subagent output | agent-output | tool-result | SWIFT_EXECUTE (mechanical) | Explore agent search results |
| 6 | Inner-default leak | inner-default-leak | sycophancy | COUNCIL_REVIEW | AI over-agreeing |
| 7 | **Competitor platform update** | external-content | competitor-intel | VAULT_DEFER | Backstage release notes |
| 8 | **Existing app extraction** | external-content | app-extraction | VAULT_DEFER | Lovable/Base44 app analysis |
| 9 | **Error log / validator finding** | agent-output | error | SWIFT_EXECUTE or COUNCIL_REVIEW | pnpm verify FAIL output |
| 10 | **PR comment / code review** | external-content | code-review | VAULT_DEFER | GitHub PR comment |
| 11 | **Monitoring alert** | agent-output | performance-alert | COUNCIL_REVIEW | Slow query detected |
| 12 | **External AI consultation** | external-content | ai-research | VAULT_DEFER | GPT/Gemini research on Mastra |
| 13 | **News / trend signal** | external-content | trend-intel | VAULT_DEFER | "X just shipped Y feature" |

**The insight:** types 7-13 are non-trivial inputs that existing platforms don't treat as governed inputs. CSPS treats them identically to user prompts — they all get classified, routed, and logged. A competitor release note and a user directive follow the SAME pipeline.

## §1b — Model Tier Routing Schema (added S049 — AP-004 prevention)

Every input that crosses the Threshold also carries an implicit `model_tier` requirement.
This determines which tab executes the response — not which tab the Governor is currently in.

```
model_tier routing:

  DECISION_ARCHITECTURE (strategic, multi-session consequences)
    → model_tier: OPUS
    → examples: kill condition ratification, EPOCH design, invariant selection,
                new principle/contract ratification, PROTO design
    → execution: Governor opens Opus tab, pastes input with ZCA block

  IMPLEMENTATION (build + wire + verify)
    → model_tier: SONNET (workspace default — no tab change needed)
    → examples: validator builds, hook writes, plan item execution,
                file edits per ratified spec, HANDOFF authoring
    → execution: current Sonnet tab executes directly

  QUICK_CHECK (fast lookup, simple question, status check)
    → model_tier: SONNET or HAIKU
    → examples: "what's the current PE score?", "does X file exist?", 
                single-file reads, git status checks
    → execution: current tab, no switch needed

  COUNCIL_REVIEW (ambiguous, multi-actor, binary-collapse risk detected)
    → model_tier: OPUS required
    → trigger: CAQ MODE fires (2+ diagnostic types in one prompt)
    → trigger: AP-004 pattern detected (AI collapses spectrum to binary)
    → execution: PAUSE, route to Opus tab before any SWIFT_EXECUTE

WORKSPACE DEFAULTS (never change without explicit Governor ratification):
  New CSPS tab default:  claude-sonnet-4-6[1m]  (settings.json — cost-efficient builder)
  Opus advisory tab:     Governor manually selects Opus in picker per session
  Rule: workspace lock = DEFAULT, not prohibition. Per-tab picker always overrides.
  Anti-pattern: AP-004 — do not toggle between "lock all" or "unlock all"
```

## §2 — The Threshold v2 pipeline (8 steps)

```
ANY INPUT
    ↓
PREAMBLE: CONCEPT_LOAD (P-META-020 — mandatory before any step)
    Load the L1/L2 spine domain most relevant to this input type.
    This conceptual frame governs all downstream processing.
    Validators and contracts fire as reference samples within this frame.

    Input type → Spine domain:
      user-directive / ratification  → GVRN (authority + decision rights)
      implementation (code/schema)   → ARCH L2 data/structure domain
      AI behavior / defaults         → AI L2 inner-defaults domain
      validation / evidence request  → VALD L2 coverage domain
      external-content / research    → AI L2 alignment domain (VAULT_DEFER)
      operations / cadence           → OPER L2 reality-grounding domain

    Scope: CCA Layer 1 (session-wide constitution) fires at session-open.
           Threshold PREAMBLE selects the per-input domain. Sequential, not competing.

    If CONCEPT_LOAD cannot identify a clear domain → default to GVRN → COUNCIL_REVIEW.
    ↓
STEP 0: SEE WHAT EXISTS (MANDATORY — consolidation-expert)
    Run check_reuse for the concept being introduced.
    If match found → ENHANCE, not CREATE → route to SWIFT_EXECUTE
    If no match → continue to step 1

STEP 1: DETECT source_class
    (user-prompt-submit-intake.sh pattern detection)

STEP 2: NORMALIZE to IntakeEvent
    (intake-normalizers.md 4 specs)

STEP 3: CLASSIFY type + priority_band
    (context-orchestrator.sh task-class detection)
    → Load appropriate council member (consolidation-expert if duplication risk)

STEP 4: ROUTE
    (intake-router.mjs SWIFT/VAULT/COUNCIL/DROP)

STEP 5: LOG
    (_intake/intake-log/S<NNN>.jsonl append-only)

STEP 6: RIPPLE CHECK (between intent and impact)
    For SWIFT_EXECUTE: verify intent → plan → implementation → validation chain
    For VAULT_DEFER: add retrieve_when trigger + context preservation
    For COUNCIL_REVIEW: surface to Governor with context intact

STEP 7: TRIGGER council member
    (governance-session / consolidation-expert / synergy-master / etc.)

STEP 8: IMPACT → log result back to intake event
    Update IntakeEvent.state_machine_pos to 'executed' | 'deferred'
```

## §3 — The Ripple Check (step 6 detail)

Between INTENT (what the user said) and IMPACT (what the platform does), 6 checkpoints must be coherent:

```
Intent (user prompt)
    ↓ [THRESHOLD GATE] — is this classified correctly?
Classification (source_class + classified_type)
    ↓ [PE ALIGNMENT] — is this the right priority band?
PE Routing (PE band → council member)
    ↓ [COUNCIL DISPATCH] — right skill loaded for right task?
Skill/Plan (§KH consultation + reuse check)
    ↓ [CONSTRUCTION GATE] — plan exists before implementation?
Implementation (code/artifact)
    ↓ [ZF GATE] — pnpm verify exit_code 0?
Impact (sealed-zf artifact)
```

Any break in this chain = intent-impact gap. The **ripple-check expert** (see council-registry §2) verifies chain coherence on every non-trivial SWIFT_EXECUTE item.

## §4 — Platform comparison as an input type

Competitor intelligence (#7 competitor-intel) flows through The Threshold like any other input:

```yaml
# Example IntakeEvent for competitor input
id: "EXT-20260506-001-A"
source_class: external-content
classified_type: competitor-intel
content: "Backstage v1.5 released automated component discovery via repo scanning"
route_to: VAULT_DEFER
vault_pending:
  - id: VLT-S012-001
    type: observation
    content: "Backstage automated discovery = what our validate-nothing-stands-alone does manually"
    retrieve_when: "When nothing-stands-alone backfill is being planned (S012)"
    ep_category: SG-CANDIDATE    # they confirm our approach is valid
```

The **comparison framework** lives at `docs/plan/_handoff/VAULT/platform-comparisons/`. Each competitor gets a structured comparison file with scoring across CSPS's 18 moat dimensions.

## §5 — Developer dashboard schema (week-10 implementation)

The developer dashboard (admin-configurable) surfaces:

```yaml
# dashboard_schema.yaml
sections:
  - id: council-status
    title: "Active Council Members (22)"
    data_source: council-registry.md
    refresh: per-session
    admin_configurable: true   # admin can add/remove/reorder members
    
  - id: moat-health
    title: "Moat Elements (18)"
    data_source: moat-registry.md + validate-moat-coverage output
    refresh: daily
    
  - id: threshold-activity  
    title: "Threshold Pipeline Activity"
    data_source: _intake/intake-log/S<NNN>.jsonl
    refresh: per-session
    
  - id: ep-sg-registry
    title: "Error Patterns (12) / Success Patterns (2)"
    data_source: know-how/error-patterns/ + know-how/success-patterns/
    refresh: weekly
    
  - id: impl-status-board
    title: "Implementation Quality Board"
    data_source: validate-impl-status output
    refresh: per-session
    
  - id: csep-backlog
    title: "CSEP Pipeline (synergy-master → cruel-critic → integration)"
    data_source: _handoff/VAULT/cseps/
    refresh: monthly
    
  - id: daily-update
    title: "Daily Update Health"
    data_source: daily-update-plan.md output
    refresh: daily
```

**Admin controls:** each section is configurable — show/hide, column order, filter by council member, filter by PE band. The council itself is configurable — admin can add a new SKILL.md → it appears in the council-status section automatically.
