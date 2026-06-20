---
id: csps.pillar-0-governance.moat-registry
name: moat-registry
description: Definitive CSPS competitive moat registry — all 15 moat elements mapped to their recurring audit coverage, active validators, and cadence. validate-moat-coverage.mjs checks every moat element has at least one active audit. Alignment with CORE: every session checks CORE alignment via pnpm verify; weekly health hook checks moat element drift; monthly CSEP cycle ensures synergies propagate. Per S011 user directive "go over the core of cores list and the moat items and see how recurring audits covers all of them."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
impl_status: swift-implemented
template_used: pillar-leaf
template_status: stable
core_spine: GVRN
core_spines: [GVRN, VALD, AI, ARCH, OPER]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S011
file_depth_markers:
  l1_lines: "1-80"
  l2_lines: "81-end"
  read_protocol: "L1 = moat registry table with audit coverage. L2 = per-element detail + CSEP status."
links:
  - { rel: system-health-plan, href: ./system-health-plan.md }
  - { rel: qc-coverage-map, href: ./qc-coverage-map.md }
  - { rel: zf-moat, href: ./zf-moat.md }
  - { rel: council-registry, href: ./council-registry.md }
domain_path: platform
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# Moat Registry — CSPS

> **The definitive list of what makes CSPS non-replicable.** Every moat element has a recurring audit. Every audit has a cadence. Every cadence has mechanical enforcement. No moat element is unchecked.

## §0 — Moat element schema (like all CSPS schemas — structure before content)

Every moat element MUST declare these fields (schema-aligned per CSPS DNA):

```yaml
moat_element:
  id: M-NN                           # sequential, permanent
  name: string                       # canonical name (kebab-case noun phrase)
  unique_because: string             # one sentence: what no other platform does
  ring: 1 | 2 | 3 | 4               # which organism ring (session / construction / schema / vocabulary)
  dimension: think | plan | implement | validate | cross-cutting
  active_validators: [slug, ...]     # pnpm verify cycles covering this element
  cadence: every-session | weekly | monthly | quarterly
  csep_status: pending | active | integrated | not-applicable
  first_engraved: S<NNN>             # session when this was first formalized
  platform_agnostic: true | false    # does this apply to non-Claude AI systems?
  model_tier_for_audit: STANDARD_BUILD | DEEP_REASONING | MECHANICAL_SCAN
```

**Why schema-aligned:** The moat is the platform's core competitive asset. Treating it as a typed schema means:
- Validators can check moat elements have all required fields
- The moat can be queried by dimension, ring, or cadence
- New moat elements follow the same discipline as all other governed artifacts

## §1 — The moat registry table

| # | Moat element | Unique because | Active validators | Cadence | CSEP status |
|---|---|---|---|---|---|
| M-01 | **Session-as-governed-artifact** | Every AI build session is HPFA+GP+ZF audited — no other platform governs its AI sessions | `rzf_evidence` + `session_artifact_sync` + `topic_plan_progress` | Every session | CSEP-pending |
| M-02 | **Behavioral contract system (40 B_*)** | AI HOW (reasoning) governed by contract, not just WHAT — no other platform has this | `behavioral_contract_slices_sync` | Every session | SG-001 |
| M-03 | **Error-pattern learning (EP-NNN)** | Mistakes produce EP entries that prevent recurrence — platform gets smarter | `plan_know_how` + weekly know-how-extractor | Weekly | CSEP-pending |
| M-04 | **Depth-aware knowledge loading** | Slices + MCP + L1/L2/L3 — 425× token reduction; most platforms load full files | `slice_freshness` + `principle_slices_sync` + `behavioral_contract_slices_sync` | Every session | SG-002 |
| M-05 | **Core Spines precedence (GVRN>VALD>ARCH>AI>OPER)** | Principled conflict resolution — no invented hierarchies | `corespine_depth_markers` + frontmatter validation | Every session | CSEP-pending |
| M-06 | **Construction gate (plan-before-build)** | No code without ratified plan — enforced by validator | `no_implementation_without_plan` | Every session | EP-011 resolved |
| M-07 | **ZF moat (RZF+CEC+per-session+EP-learning+provenance)** | THIS-SESSION evidence required; CEC propagates insights; graduated apps carry ZF history | `rzf_evidence` + `session_artifact_sync` | Every session | See zf-moat.md |
| M-08 | **Questions as first-class (vault + question_register)** | Questions preserved with context — no knowledge loss | vault_pending field + `validate-vault-connections` (future) | Weekly extraction | CSEP-pending |
| M-09 | **Positive harvest (SG-NNN)** | Success patterns harvested and applied — most platforms only track failures | Weekly know-how-extractor §SG | Weekly | CSEP-pending |
| M-10 | **Vault methodology (temporal optimization)** | Deliberate deferral with full context — not procrastination, virtue | vault_pending field + weekly §6 EP K=2 | Weekly | CSEP-pending |
| M-11 | **Council + orchestration (19 expert members)** | Skill dispatch by task class with improvement pipeline | `aap_frontmatter_coverage` + council-registry | Per-session + weekly | CSEP-pending |
| M-12 | **Implementation status state machine** | swift-implemented→sealed-zf tracks quality journey | `impl_status` | Every session | swift-implemented |
| M-13 | **Core Cross-Synergy (CSEP pipeline)** | Any insight propagates to ALL relevant surfaces via Synergy Master + Cruel Critic | synergy-master skill + cruel-critic skill (19th/20th council members) | Monthly | ACTIVE — this document |
| M-14 | **System-health organism (4 cadences)** | Daily/weekly/monthly/quarterly health scans mapped to 10 audit-hub pipelines | `validate-corespine-depth-markers` + weekly hook | 4 cadences | See system-health-plan.md |
| M-16 | **The Threshold (universal input gate)** | Named + documented; pipeline consolidation target; every input classified to IntakeEvent | `import_quarantine` + threshold-gate.md | Per-session | swift-implemented |
| M-17 | **Reuse-first mechanical (P-OP-001 enforced)** | §0 mandatory reuse check before any implementation; EP-012 catches skips | `plan_know_how` (§KH §0 item) + EP-012 | Every plan | swift-implemented |
| M-18 | **Connectivity enforcement (P-ARCH-001)** | nothing-stands-alone mechanically checked; 43 pre-S006 orphans surfaced | `nothing_stands_alone` | Per-session advisory | swift-implemented |
| M-15 | **CORE alignment enforcement** | Every artifact declares its spine; precedence order resolves conflicts | `corespine_depth_markers` + frontmatter_validate | Every session | CSEP-pending |
| M-19 | **External Integrations Hub (S028)** | 33+ rules from production deployments (Vercel/Supabase/Clerk/ZenStack) with 3-month review cadence + screenshot archive — AI MUST read before touching any external service. No other platform governs external integration knowledge this way. | `external-integrations` dir freshness (planned) | Quarterly review + every integration touch | CSEP-pending |
| M-20 | **Apps-as-ephemeral-trials + deletion test (S029)** | P-ARCH-030: every fix = Component A (app) + Component B (libs/template extraction). Deletion test is the standard: rm -rf apps/{app}/ must lose zero platform value. 30 future apps inherit every fix for free. | `app_scope_isolation` (week-4) + `platform_capacity` | Every session | CSEP-pending |
| M-21 | **Platform capacity monitoring (S030)** | validate-platform-capacity.mjs + platform-capacity-registry.yaml: 11 elements measured every verify run, ADVISORY at soft limit, BLOCKING at hard limit with mitigation strategy. Most platforms discover limits at crisis, not at 85% of soft limit. | `platform_capacity` LIVE | Every session | CSEP-pending |
| M-22 | **Multi-model council protocol (S028-S029)** | SROF format, GCI gate (GCI<10 proceed, ≥10 must consult Opus), platform-state-snapshot as single Opus read target, INTENT ABSORBED before any edit, "Opus, this is Sonnet" identity handshake. No other platform has formalized multi-model architectural governance with verifiable handoffs. | `validate-sonnet-report.mjs` (planned) | Every Opus interaction | CSEP-pending |
| M-23 | **Completion-Priority DPR (S031)** | P-OP-006: every new input during active build rated 1-5 before response. Only Rating 3-5 justifies interruption. Training default (respond immediately) overridden. Platform ships faster because WIP debt compounds correctly. | OD-010 in inner-ai-defaults (behavioral) | Every session | CSEP-pending |

| M-29 | **Platform Genome — distributed grid architecture (S053)** | Every CSPS tab (Opus or Sonnet, session N or N+50) inherits behavioral invariants from permanent nodes — NOT from the HANDOFF. HANDOFF is a delta. Platform Genome is the permanent index. Grid Consciousness: each node carries its own context. No other AI platform has formally separated "what changed this session" (delta) from "what is always true" (permanent nodes). Eliminates the bottleneck architecture where all knowledge flows through one document that must be re-gathered each session. | `validate-platform-genome.mjs` (S053-B) + `session-open.sh` T3 injection | Every session | CSEP-pending |
| M-30 | **Gap Recurrence Register + K Count enforcement (S053)** | Every governance gap observed in any session gets a K count entry. K=2 triggers mandatory structural fix (not another description). K=3 blocks session close. No other AI platform tracks HOW MANY TIMES the same governance gap has been re-discovered without resolution. The "mirror of gaps" (re-discovering the same things every session) is made visible and structurally blocked. | `validate-gap-recurrence.mjs` (S053-B) + `tools/data/gap-recurrence-register.yaml` | Every session | CSEP-pending |
| M-31 | **Behavioral Test Suite — first class citizen (S053)** | Every behavioral rule must have a test case showing it catches a known violation BEFORE ratification. "A solution that hasn't been tested against a known violation is a description, not a solution." No other AI governance platform distinguishes "behavioral tests" (did the AI behavior actually change?) from "code tests" (does the code compile?). The Tester Tier (adversarial agent) breaks solutions before ratification, not after deployment. | `tools/tests/behavioral/` test suite (S053-B) + Three-Tier Closed Circle protocol | Per behavioral rule ratification | CSEP-pending |
| M-32 | **Explore → Ratify → Execute Pipeline (S053)** | Every platform feature — including CSPS's own governance artifacts — must be ratified as a plan item before execution. Exploration (Opus analysis) produces a plan item. Execution (Sonnet build) works against that plan item. Wild implementations are blocked at the structural level. No other AI platform prevents its OWN GOVERNANCE INFRASTRUCTURE from being built without governance. CSPS governs how CSPS is built. | `validate-no-implementation-without-plan.mjs` (extended) + Ratification Gateway protocol | Every implementation | CSEP-pending |

| M-33 | **Reflexive Tool Application — immediate self-testing (S053)** | Every new governance tool is immediately run against the work that produced it. No other AI platform tests its own governance tools against its own governance artifacts within minutes of creation. Proven this session: Sonnet built validate-zf-cycle-format.mjs, ran it on sonnet-turn.md, found ZF is written to chat not the council file — a real structural gap caught immediately. The reflexive protocol: build → run on your own output → gaps surface before the session closes. | PROTO convention requiring self-run (no validator — protocol enforcement) | Every new validator/tool PROTO | CSEP-pending |
| M-34 | **App Health Scanner with combinatorial intelligence (S053)** | Dynamic evaluation tool that reads from Platform Genome at RUNTIME, assesses any app against current CSPS criteria, MDPE-scores every gap found, and outputs (1) a prioritized fix list and (2) a "build from scratch" blueprint per The Ideal Build. The dynamic connection is the moat: when Platform Genome updates, the scanner automatically gains new evaluation criteria — no manual maintenance. No other AI governance platform has a self-updating evaluation tool connected to its own evolving standards. | `validate-app-health.mjs` + `/platform/app-health/` playground (S053-C) | Per app analysis | CSEP-pending |
| M-35 | **Challenge Round — context_question + context_quote quality flywheel (S053)** | After every implementation, Opus and Sonnet independently produce the best possible context_question and context_quote for each new artifact. The stronger version is consolidated into the artifact AND into the Question Library and Quote Library. Over sessions, the libraries grow — new artifacts benefit from accumulated question-pattern wisdom. This creates a compounding quality flywheel: each implementation improves the activation quality of future implementations. No other AI governance platform has formalized continuous improvement of artifact activation keys. | Question Library + Quote Library (tools/vault/wisdom/) — behavioral quality scan (weekly) | Post-implementation + every ratification | CSEP-pending |

| M-36 | **CSPS Frontend Methodology — Tier 2 Reference Implementation (S053)** | The playground is not a demo — it is the canonical proof-of-methodology for CSPS frontend. Every UI page has DNA (spine, audience, contextQuestion, inheritsFrom). Every app inherits from libs/ui/. The developer journey IS the INFRA-FLOW-VALIDATION test in visual form. No other AI governance platform has a reference frontend implementation that is a first-class governance artifact carrying the same DNA as the backend contracts. | `validate-page-dna.mjs` (advisory → blocking for new pages, S054) + `validate-frontend-methodology.mjs` (S055) | Every session + per new page | CSEP-pending |
| M-37 | **Core Seeds technique — Opus writes architectural anchors, Sonnet builds (S062)** | When the gap between intent-creator (Opus) and builder (Sonnet) is high enough that a wrong implementation corrupts the entire intent, Opus does NOT delegate the full spec — Opus writes a **core seed**: the minimum architectural anchor (function signature, schema shape, exact text, pattern example) that locks the intent. Sonnet builds the full implementation from that seed. Opus does NOT write routine code, debugging, iterative fixes, or "while I'm here" improvements — those are Sonnet's lane. The seed is committed to the repo BEFORE Sonnet begins, so the architectural intent lives in a file (not chat) and survives compaction. Result: Opus tokens are spent on architectural decisions (rare, high-leverage), Sonnet tokens are spent on implementation (frequent, mechanical). No other AI governance platform formalizes the architectural-anchor pattern between model tiers — most use either "Opus writes everything" (token exhaustion, S061 Opus-9 burned 1M tokens this way) or "Opus suggests, Sonnet figures out" (intent drift). Core seeds are the precision boundary. | PROTO files at `docs/plan/protos/PROTO-*.md` (each PROTO IS a core seed for Sonnet) + `validate-proto-receipt.mjs` (planned — confirms Sonnet cited the PROTO file before implementing) | Every cross-model PROTO | CSEP-pending |
| M-38 | **Tab Transfer Stability Hierarchy T1-T6 (S062, Sonnet-10 surfaced)** | Every cross-tab governance mechanism classified into 6 tiers: T1 session-open.sh + always_include (fires before AI reasoning, cannot skip — structural); T2 CLAUDE.md / startup injection (unconditional session start — structural); T3 skill with fixed schema (structured output, no AI freestyle — high-behavioral); T4 branched Step 0 in startup block (reduces wrong-path, still requires reading — medium-behavioral); T5 native AI following protocol (training defaults can override silently — low-behavioral); T6 AI "remembering" across turns (compaction or new tab = zero — none). The ceiling for tab transfer specifically is T3 — the human paste IS the boundary-crossing mechanism, no skill or hook can inject context into a new conversation. Design for **failure-visible** (wrong Step 0 → immediate observable error) rather than **failure-silent** (current state where AI absorbs and waits). No other AI governance platform classifies its cross-boundary mechanisms by enforcement stability tier — the explicit T1-T6 ladder makes "is this protocol actually durable?" answerable from a file, not from intuition. | `validate-protocol-stability-tier.mjs` (planned S063 — every protocol declares stability_tier field, validator flags T5/T6 patterns where T3 is achievable) | Per protocol change | CSEP-pending |
| M-42 | **UNIFIED THRESHOLD-ROUTER (S067)** | Every input (6 classes: user prompt / AI-internal finding / Sonnet-Opus checkpoint / hook output / external event / cadence trigger) routed through ONE 4-axis classifier (spine × scope × intent × mandate-relation) with mechanical council-skill invocation, pull-on-context vault retrieval, and output closure enforcement. No other AI governance platform unifies input classes through a single deterministic router invoking 24 specialized skills based on multi-axis classification + pull semantics. Closes the EXISTS≠INVOKED pattern at the council layer (24 dormant skills now mechanically triggered per content match). Collapses 5 prior deferred PROTOs into one master moat. | `validate-threshold-routing-coverage.mjs` + `validate-skill-invocation-rate.mjs` + `tools/scripts/threshold-router.mjs` + `tools/scripts/council-invocation-dispatcher.mjs` | Per session + per Edit/Write (proposal-class) | swift-implemented-S067 |
| M-43 | **CROSS-TAB DIFF-REVIEW (S068, Governor-conceived)** | Mutual change-awareness made mechanical. Each role (Opus, Sonnet) keeps a `last-reviewed SHA` marker; on receiving any cross-tab handoff, the receiver runs `git log <last-reviewed>..HEAD`, reviews the ACTUAL diffs (not the sender's prompt claims), then advances its marker. Decouples cross-agent awareness from prompt-comprehensiveness — neither AI reads everything by default, so a missed prompt line no longer becomes a false assumption. Inherited via session-open injection (same vector as B_META_QUESTION T3 + C8 REACTIVE_OPUS) — fires every tab, every session, forever. Composes with B_VALIDATE_BEFORE_ASSUME + OPIA (audit actual work) + P-META-014 Mutual-Understanding-Validation. | `tools/scripts/cross-tab-diff-review.mjs` (PART 1 STEP 0) + `tools/data/last-review-markers.json` + `session-open.sh` injection | Per cross-tab handoff + per session open | implemented-S068 (DEFECT-1 fixed) |
| M-44 | **REFINEMENT-BEFORE-RATIFICATION (S068, Governor-conceived)** | For any consequential/foundational decision, the first draft is never ratified — it passes a refinement loop (draft → research → 6-persona review → connectivity + essence + scope checks → refine → ratify). Refinement is the highest-ROI activity for foundational work: each cheap pass removes an expensive post-ratification gap that would otherwise compound into the foundation. Inaugural evidence (S068, one day): the loop caught unproven depth-levels, a 14-config apps-vault ripple, a floating deferral (D11), a rigid-wrong-number capability test, and a threshold bottleneck-risk — all of which first-draft ratification would have engraved. No competing platform formalizes refinement-before-ratification as a mechanical gate on foundational decisions. | `validate-refinement-before-ratification.mjs` (flags foundational ratification lacking research+persona+connectivity/essence/scope trail) + CSPS-PLANNING-DISCIPLINE §12 + session-open injection | Per consequential/foundational decision | planned-PART-1 |
| M-45 | **WIRING-COMPLETENESS (S068, Governor-conceived)** | Platform DNA: nothing is "done" until WIRED + active + measurable. Extends the existing active Permanence-by-Default hook (S060) which verifies an artifact *declares* T1/T2/T3 — M-45 closes the gap by verifying the declared enforcement actually EXISTS on disk + is wired (hook registered / validator in verify pipeline). A declared-but-absent enforcement, an advisory-forever rule, a stub, a described-only doc = debt, not done. Every mechanism carries wiring_state: active|described-only|scheduled-wired. Inaugural evidence (S068 scan): 283 files with partial markers, 141 advisory validators, 4 of 5 same-day validators described-only — quantified the "described≠active" slide. No competing platform mechanically distinguishes declared-enforcement from wired-enforcement. | extend `pre-tool-use-permanence-gate.sh` (S060) + `validate-wiring-completeness.mjs` (Wiring Backlog) + CSPS-PLANNING-DISCIPLINE §14 + Daily Alignment Pass (§13) + session-open injection | Per artifact creation + daily | planned-WIRING-PASS (validator itself described-only — honest) |

| M-46 | **DUAL-COVERAGE / CONTEXT-INDEPENDENT AUDIT STANDARD (S085, Opus #23)** | Every drift-prone governance obligation is covered by TWO layers: (1) a handoff step (SOFT: context-dependent, in-the-moment reminder) AND (2) a context-independent recurring audit (HARD: reads only persistent artifacts, fires on a schedule without human memory, writes findings to a persistent register). The hard layer is the guarantee; the soft layer is a convenience. Context-independence test: SOURCE (persistent files/registers/git/db only) + CADENCE (session-open/verify-gate/cron) + SINK (persistent register surfaced at session-close). An "audit" failing any of the three is still SOFT and does NOT count as coverage. Inaugural evidence (S085 validate-dual-coverage.mjs first run): 8 drift-prone obligations checked; 5/8 dual-covered; 3 ADVISORY (EXTENDED validators without cadence). After cadence ladder: 8/8 dual-covered. Generalizes PARK-S084-037. No competing governance platform formalizes the distinction between "handoff reminder" (soft, shaky) and "recurring-audit twin" (hard, durable) as a checkable property of every obligation. Makes "we hardwired it" a testable claim, not a hope. | `validate-dual-coverage.mjs` (EXTENDED, session-open cadence) + `session-open.sh` cadence triggers (moat_coverage + register_ref_integrity + dual_coverage run every tab) | Per session-open + EXTENDED verify | active-S085 |

## §2 — Audit coverage by cadence

| M-24 | **Security module as platform primitive (S032)** | libs/integrations/security/ gives every CSPS app security headers (CSP/HSTS/X-Frame), Zod validation, audit logging, role guards, Upstash rate limiting, and circuit breakers for free — zero per-app cost. Most stacks rebuild this 30× independently. CSPS builds it once, every app inherits. | `security-headers-compliance` (LIVE S032-D) | Every app + every verify | CSEP-pending |
| M-25 | **Schema-first tenant isolation with write policies (S032)** | ZenStack @@allow/@@deny policies enforce tenant isolation at the ORM layer for ALL models, not just critical ones. S032 added write policies (UserTenant, Notification, WebhookEndpoint) + viewer role + plan/features/limits tier support. 12 models, all tenant-isolated by default. App code cannot bypass. | `foundation_schema_drift` LIVE | Every PR + verify | CSEP-pending |
| M-26 | **CSPS DNA inheritance gate — new code carries governance DNA (S037)** | Every new TypeScript/JS file added to libs/ must carry at least one DNA signal (@csps-id, @csps-enforces, graceful passthrough pattern, or PI wiring_checklist coverage). Training-default code patterns (plain Node.js, no governance linkage) are BLOCKED at commit for platform-critical files. DNA propagation is the compounding mechanism — each new module inherits the entire platform governance layer. | `new-file-dna` LIVE S037 | Every commit | M-26 |
| M-28 | **Plan Maturity Index + Context Alignment Questions (S042/S043)** | Governance by maturity, not by urgency. Plans don't implement when someone wants them to — they implement when five indicators confirm they're ready: intent is human-authored, cross-reference density is high, multiple viewpoints have engaged, the change is reversible, dependencies are resolved. CAQs (Context Alignment Questions) fire automatically at decision points — not from memory but from context signals. No other AI platform distinguishes "plan exists" from "plan is mature enough to implement" with quantified indicators, or has permanent automated alignment questions that trigger from context rather than habit. The Plan Hub unifies all planning input into one source visible to any model in any chat. | `validate-plan-readiness.mjs` (S043) + PMI alerts in `unified-plan.yaml` + `dna-registry.yaml` always_include | Per planning session + every implementation gate | M-28 |
| M-27 | **PRACE — Permanent Recurring AI Contextual Enforcement philosophy (S040)** | CSPS enforces governance by designing WITH how AI natively works, not against it. Every rule includes: the training default it overrides, why the default fails in CSPS context, the full reasoning (not just the instruction), and three enforcement tiers (T1=hook fires automatically, T2=validator blocks commits, T3=session injection). Rules are given full context so AI reasons toward them rather than merely following them. No other AI platform has formalized this distinction: rule text ≠ enforcement. The context-first, reasoning-backed, recurring-injection model means governance survives context pressure without human reminders. | `session-open.sh` T3 + 22 hooks firing per-session + `validate-handoff-completeness.mjs` T2 | Every session, every 25 turns, every commit | M-27 |

### Every session (pnpm verify — 125+ validators, S037)
Covers: M-01, M-02, M-04, M-05, M-06, M-07, M-12, M-15, M-20, M-21, M-23, M-24, M-26

### Weekly (cron-weekly-tag-status-deep-audit.sh)
Covers: M-03 (know-how extraction), M-08 (vault processing), M-09 (SG-NNN), M-10 (K=2 check), M-11 (council drift)

### Monthly (manual + CSEP cycle)
Covers: M-13 (synergy-master full scan), M-14 (health organism review), M-08 (deep vault processing)

### Quarterly
Covers: All moat elements — full reassessment + honest calibration + architecture review

## §3 — CORE alignment check (the unique alignment discipline)

Every session pnpm verify checks CORE alignment:
- `corespine_depth_markers` → 5 L1_CORE files have depth markers ✅
- `frontmatter_validate` → every artifact declares `core_spine:` ✅
- `behavioral_contract_slices_sync` → all B_* contracts align with CORE ✅
- `principle_slices_sync` → all 53 principles align with CORE ✅

The CORE is not just a category — it's enforced by validators. Any artifact claiming GVRN spine that violates GVRN CORE doctrine fails `corespine-layer-compliance` (week-4 build).

**This is the unique thing:** most platforms have "core values" that are aspirational. CSPS has CORE values that are MECHANICALLY ENFORCED. The L1_CORE sealed files are the constitution. The validators are the enforcement layer.

## §4 — Moat growth trajectory

```
S006 close:  3 moat elements (session-gov + B_* + principle-inheritance)
S011 close: 15 moat elements (3 + depth-aware + construction-gate + ZF-moat
                               + questions + positive-harvest + vault + council
                               + impl-status + core-synergy + health-organism + CORE)
Target:     20+ moat elements by S015 (foundation-slices + vocabulary-governance
                                        + graduation-provenance + CSEP-history)
```

Every session adds moat elements. This is the compound moat — not static barriers but a growing, self-reinforcing set of properties that no competitor can replicate quickly because the history matters as much as the current state.
