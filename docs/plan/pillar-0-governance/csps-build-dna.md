---
id: csps.governance.csps-build-dna
name: csps-build-dna
description: The CSPS Way of Building — synthesis of rigid governance spine (principles + contracts + Quality Gates + cycles) and flexible adaptation layer (PCR + model routing + context layering + judgment). The DNA that makes CSPS-style work uniquely effective. Not a new principle — the integrative narrative that connects all existing pillars + meta-principles + behavioral contracts into a coherent philosophy. Quality + holistic context + long-run > immediate savings.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:explanation
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - observability
  - ai-native
diataxis_type: explanation
links:
  - { rel: parent, href: ./README.md }
  - { rel: principles, href: ../../../packages/principles/principles.yaml }
  - { rel: contracts, href: ./behavioral-contracts.md }
  - { rel: spine, href: ./ai-behavior-spine.md }
  - { rel: cca, href: ./cognitive-context-architecture.md }
  - { rel: aap, href: ./agent-alignment-protocol.md }
  - { rel: zero-findings, href: ./zero-findings-discipline.md }
  - { rel: audit-hub, href: ./audit-hub.md }
created-new-because: |
  No prior leaf synthesized the rigid+flexible duality at the heart of CSPS-style work. The
  individual pillars + meta-principles + B_* contracts are each self-contained; this leaf
  shows how they COMPOSE into a coherent way of building. User S005 turn 25 directive:
  "connect it all to the balanced solutions we have regarding the tension between the
  rigid and context focused ai behavior — make our DNA in building things!"
domain_path: platform
---

# The CSPS Way of Building — DNA

> **Quality + holistic context + long-run > immediate savings.**
>
> **The rigid spine (cycles + Quality Gates + hard NOs + immutable contracts) protects against drift. The flexible adaptation layer (PCR + model routing + context loading + judgment) protects against rigidity. Both serve quality — different failure modes, same goal.**

## What this leaf holds

The integrative narrative connecting all CSPS pillars + meta-principles + behavioral contracts into a coherent philosophy of how we build. **Not a new principle** — every constituent rule already exists. This leaf is the **synthesis** that shows the duality at the heart of the platform: rigid where rigidity protects integrity; flexible where flexibility protects fit.

## The duality

CSPS is built on a tension that's deliberate, not accidental:

| Dimension | Rigid spine (immutable) | Flexible adaptation (judgment) |
|---|---|---|
| **What protects against drift** | hard NOs / immutable Quality Gates / cycles / atomic engraving | — |
| **What protects against rigidity** | — | PCR / model routing / context layering / counterweights / 4-condition autonomous-execution |
| **Failure mode if absent** | platform decays through nominal-RZF accumulation | platform calcifies; can't adapt to context |
| **CSPS instantiation** | All P-META-* meta-principles in principles.yaml; B_* contracts; AGENTS.md hard NOs; cycles in plans | P-OP-003 PCR; P-OP-004 batched-execution; P-META-009 CCA model routing; counterweight clauses on every principle |

**Both halves are load-bearing.** Removing either creates platform debt:

- Without rigid spine → AI's "satisfied with first identification" pattern wins; every catch decays before engraving; cycles get skipped; nominal-RZF accumulates; the platform collapses from invisible debt
- Without flexible adaptation → every decision becomes ceremonial; over-engineering on trivial choices; PCR for `var x = 1`; tokens spent on bureaucracy not reasoning; the platform calcifies

The CSPS DNA is the **calibrated middle**: explicit rules where rules protect (the immutable layer); explicit judgment-with-evidence where adaptation protects (the flexible layer); explicit boundaries between them.

## The rigid spine — what NEVER bends

These are immutable. No optimization. No "savings". No context-dependent skipping. They protect platform integrity at the cost of always-paying-the-price.

### Quality Gates (per [cognitive-context-architecture.md](./cognitive-context-architecture.md))

| QG | Rule | Protects against |
|---|---|---|
| **QG1** | Hard reasoning never downgrades from Opus 4.7 | Nominal-quality decisions on ratification compounding to platform debt |
| **QG2** | Synthesis stays in main context (subagents do focused work only) | Subagent-without-full-context producing incorrect synthesis |
| **QG3** | Mid-session edited files re-read mandatorily | Stale-content-after-edit producing nominal-RZF |
| **QG4** | Cache invalidates on content change | Nominal-cache snapshots drifting from disk |

### Cycle disciplines (per [zero-findings-discipline.md](./zero-findings-discipline.md))

| Cycle | When it fires | What it enforces |
|---|---|---|
| **RZF** (Real Zero Findings) | Every artifact reaching DONE/RATIFIED | Re-run validators until 0 findings; cycle count is MEASUREMENT not TARGET |
| **CEC** (Complete Extraction Cycle) | Every formal ratification + every significant positive event (P-META-006 amended) | Walk platform until 0 new application opportunities |
| **FSE** (Five-Surface Engraving) | Every catch | Atomic 5-surface application (schema + validator + hook + memory + contract); validator-registration mandatory atomic per amendment |
| **Pre-close verification** | Session close | `pnpm verify` orchestrator; §10.0 evidence; nominal-RZF impossible |
| **Positive-value-extraction** | Significant positive events | Walk-trail in §10.11b; opportunity-recurrence triggers K=2 |

### Agent alignment (per [agent-alignment-protocol.md](./agent-alignment-protocol.md))

**No wildcards.** Every agent (Class A CSPS-built / Class B claude-code-builtin / Class C Mastra runtime / Class D third-party) passes AAP before invocation. 9 mandatory checks. Universal-required B_* acknowledgments. No exceptions.

### Hard NOs (per [AGENTS.md](../../../AGENTS.md))

36+ hard NOs on AI behavior. These don't bend. Examples:
- Never invent without precedent check (B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK)
- Never assert without paired tool-call output (B_VALIDATE_BEFORE_ASSUME)
- Never present non-trivial decision without PCR (B_PCR_FOR_DECISIONS)
- Never invoke agent without alignment (B_AGENT_ALIGNMENT_PROTOCOL)
- Never emit RZF block without §10.0 cycle evidence (B_PRE_CLOSE_VERIFICATION)
- Never delegate synthesis to subagent (QG2)

## The flexible adaptation layer — judgment-with-evidence

These are decisions made per-context, with explicit reasoning. The judgment is bounded (within ratified scope per the 4-condition autonomous-execution gate) and traceable (PCR documents the choice).

### PCR — decisions with non-trivial trade-space (per P-OP-003 + B_PCR_FOR_DECISIONS)

When to use: architectural forks / scope choices / tool-selection / migration-strategy / phasing / multi-option proposals.

When to skip: trivial-reversibles (variable naming when both clear / comment phrasing / two-way doors at low cost).

The skip is explicit ("trivial-reversible — choosing X because <reason>"); silent skip is the failure mode.

### Model routing — right-tool-for-job (per P-META-009 CCA)

| Work-type | Model | Why |
|---|---|---|
| Hard reasoning (engraving / PCR-non-trivial / ZF-synthesis / architectural decisions / honest self-audit) | **Opus 4.7** | Cross-pillar synthesis; long-tail consequences |
| Mechanical edits (find-replace / lifecycle bumps / drafting from template) | Sonnet 4.6 | Pattern application; no novel reasoning |
| File existence / lookups / "did this change?" verifications | Haiku 4.5 | Single-fact retrieval |

QG1 enforces never-downgrade for hard reasoning; the rest is judgment-with-evidence per task complexity.

### Context layering — 5-layer CCA (per [cognitive-context-architecture.md](./cognitive-context-architecture.md))

Every session organizes context across 5 layers (Permanent Constitution / Session Contract / Active Work / MCP queries / Subagent-delegated). Per-layer:
- Layer 1 (cached 1h) — ambient governance shaping every decision
- Layer 2 (cached 1h) — this-session boundary commitments
- Layer 3 (5min/no-cache) — volatile working memory; mid-session edits force re-read
- Layer 4 (MCP queries; precise structural answers) — queries on demand
- Layer 5 (subagent-isolated) — context-purity protection

The judgment is which content goes in which layer; the rules are the per-layer caching + invalidation + Quality Gates.

### Counterweight clauses — every principle has its escape

Every CSPS principle has a counterweight that prevents over-application:

| Principle | Counterweight |
|---|---|
| P-OP-001 reuse-first | Inline-and-redecide when ratified thing is wrong abstraction (Sandi Metz) |
| P-OP-002 FWWS | Park threads explicitly with stated reason; cannot silently drop |
| P-OP-003 PCR | Trivial-reversible decisions skip PCR with explicit one-line note |
| P-OP-004 batched-execution | Disciplined-initiative escape (Mission Command) — pause if reality changes mid-execution |
| P-META-006 RZF/CEC | Defer-not-compress under context pressure |
| P-META-008 cycle-mandatory-in-plan | Trivial in-flight microsteps don't trigger full cycle |
| P-META-009 CCA QGs | Trivial verifications use Haiku; mechanical edits use Sonnet — only HARD reasoning is QG1-immutable |
| P-META-010 AAP | Trivial Class B one-shot lookups use abbreviated preamble |

**The counterweights are part of the rule, not exceptions.** They make the rules survivable under real-world variation.

## The composition — how they make CSPS uniquely effective

```
            ┌─────────────────────────────────────────────────┐
            │  RIGID SPINE (immutable)                        │
            │  · Quality Gates (QG1-QG4)                      │
            │  · Cycle disciplines (RZF / CEC / FSE / pre-close│
            │    / positive-value-extraction)                  │
            │  · Agent Alignment Protocol (no wildcards)       │
            │  · 36+ hard NOs                                  │
            │  · Atomic 5-surface engraving                    │
            └─────────────────┬───────────────────────────────┘
                              │ Protects against drift
                              │ (every catch becomes permanent;
                              │  no nominal-RZF; no wildcards)
                              ▼
            ┌─────────────────────────────────────────────────┐
            │  PLATFORM INTEGRITY                             │
            │  · 42 principles validated 0 findings           │
            │  · ~129 audits across 9 pipelines               │
            │  · 18+ B_* contracts at 5/5 surfaces            │
            │  · Bidirectional schema graph (audit↔principle) │
            │  · ZF-before-build discipline structurally enforced│
            └─────────────────┬───────────────────────────────┘
                              │ Enables flexible adaptation
                              │ (rigid floor → safe to be flexible above)
                              ▼
            ┌─────────────────────────────────────────────────┐
            │  FLEXIBLE ADAPTATION LAYER                      │
            │  · PCR for non-trivial decisions                │
            │  · Right-tool-for-job model routing             │
            │  · 5-layer CCA context loading                  │
            │  · Counterweight clauses on every principle     │
            │  · 4-condition autonomous-execution gate         │
            │  · Subagent delegation for context purity        │
            └─────────────────┬───────────────────────────────┘
                              │ Protects against rigidity
                              │ (over-engineering / ceremonial / bureaucratic)
                              ▼
            ┌─────────────────────────────────────────────────┐
            │  QUALITY DECISIONS                              │
            │  · Right depth for the actual task              │
            │  · Holistic context for hard reasoning          │
            │  · Long-run integrity over short-term savings   │
            │  · Compounding platform value over N sessions   │
            └─────────────────────────────────────────────────┘
```

**The DNA insight:** the rigid spine creates the conditions for safe flexibility. Without the spine, every flexible-judgment decision risks platform debt. With the spine, flexibility within the gates is well-bounded — judgment-with-evidence, traceable, reversible. CSPS-style work is **rigid where rigidity protects integrity; flexible where flexibility protects fit.**

## What this means for AI behavior

When the AI works on CSPS:

1. **Read the rigid spine first** (Layer 1 ambient governance — cached 1h)
2. **Identify the work-type** — is this hard reasoning (Opus mandatory) or mechanical (Sonnet OK) or verification (Haiku OK)?
3. **Apply the immutable rules** — QG1-QG4 + cycle disciplines + AAP + relevant hard NOs
4. **Render PCR** for non-trivial decisions; **skip PCR explicitly** for trivial-reversibles
5. **Use counterweights** when literal rule-application would harm fit (always with explicit one-line reason)
6. **Engrave catches atomically** at 5/5 surfaces (no temp-fix)
7. **Run cycles before claiming DONE** — `pnpm verify` is the mechanical gate
8. **Walk for positive value extraction** when significant events occur
9. **Document inline** as work proceeds — future-self / future-session continuity
10. **Honest self-audit** at session close — temp-fix vs mechanical analysis

This is not a checklist; it's the orientation. The mechanical layer enforces; the AI's discipline animates.

## Cross-references — every coupled artifact

This DNA leaf composes ALL existing CSPS governance:

- [principles.yaml](../../../packages/principles/principles.yaml) — operating + architecture + meta principles (counts dynamic per yaml row count; never cite hardcoded numbers — see ADR-0022 + audit `principle-count-staleness` per audit-runner.md)
- [behavioral-contracts.md](./behavioral-contracts.md) — 18+ B_* contracts
- [ai-behavior-spine.md](./ai-behavior-spine.md) — discipline matrix (5/5 surfaces × disciplines)
- [zero-findings-discipline.md](./zero-findings-discipline.md) — RZF + CEC + amendments
- [cognitive-context-architecture.md](./cognitive-context-architecture.md) — 5 layers + 4 Quality Gates
- [agent-alignment-protocol.md](./agent-alignment-protocol.md) — 9 mandatory checks + 4 agent classes
- [audit-hub.md](./audit-hub.md) — 9 pipelines + orchestration
- [stewardship-protocol.md](./stewardship-protocol.md) — saved-content lifecycle
- [learning-loop.md](./learning-loop.md) — observed → triaged → routed → fixing → validated → closed
- [mechanical-enforcement.md](./mechanical-enforcement.md) — defense-in-depth model
- [reuse-first-principle.md](./reuse-first-principle.md) — load-bearing principle
- [operating-principles.md](./operating-principles.md) — 4 P-OP narrative
- [pillar-1/complexity-contract.md](../pillar-1-architecture-and-stack/complexity-contract.md) — file/function size limits + ratchet
- [pillar-1/module-folder-pattern.md](../pillar-1-architecture-and-stack/module-folder-pattern.md) — mini-tree-splits when complexity exceeded
- [pillar-1/frontmatter-standard.md](../pillar-1-architecture-and-stack/frontmatter-standard.md) — schema basis
- [pillar-3/sandboxed-skill-governance.md](../pillar-3-platform-services/sandboxed-skill-governance.md) — three-tier trust + AAP composition
- [_handoff/VAULT/protocols.md](../_handoff/VAULT/protocols.md) — session lifecycle protocols
- [_handoff/VAULT/closing-summary-template.md](../_handoff/VAULT/closing-summary-template.md) — required headers
- [AGENTS.md](../../../AGENTS.md) — 36+ hard NOs

## Sources

- All 42 principles + 18+ contracts + 11+ pillar-0 leaves listed above (CSPS internal)
- User S005 turn 25 directive — "make our DNA in building things"
- The composition framing — emergent from the platform's design over S001-S005
