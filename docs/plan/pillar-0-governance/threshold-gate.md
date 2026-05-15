---
id: csps.pillar-0-governance.threshold-gate
name: threshold-gate
description: THE THRESHOLD — the single canonical entry point for ALL inputs into CSPS. Every input crosses it before processing. Chat prompts, external files, agent outputs, inner-default leaks — all become typed IntakeEvents before routing. No input bypasses The Threshold. The current state is scattered across 10+ artifacts; this document is the canonical consolidation + gap analysis + target architecture.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
impl_status: swift-implemented
template_used: pillar-leaf
template_status: stable
core_spine: GVRN
core_spines: [GVRN, OPER, AI, VALD]
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
  l1_lines: "1-70"
  l2_lines: "71-end"
  read_protocol: "L1 = The Threshold definition + pipeline + current state. L2 = per-source-class detail + gap analysis."
links:
  - { rel: intake-normalizers, href: ./intake-normalizers.md }
  - { rel: vault-methodology, href: ./vault-methodology.md }
  - { rel: council-registry, href: ./council-registry.md }
  - { rel: schema, href: ../../../packages/schemas/intake-event.ts }
  - { rel: router, href: ../../../tools/intake-router.mjs }
domain_path: platform
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# The Threshold — CSPS Universal Input Gate

> **"All inputs cross The Threshold or they don't enter CSPS."**  
> Raw inputs become typed `IntakeEvent` envelopes before any processing occurs.
> No bypasses. No exceptions. This is not a filter — it's a TRANSFORMER.

## §1 — What The Threshold does

```
ANY INPUT
    ↓ The Threshold (classify + normalize + route)
IntakeEvent { source_class, classified_type, route_to, context, priority_band }
    ↓ intake-router.mjs
SWIFT_EXECUTE → process immediately
COUNCIL_REVIEW → surface to Governor
VAULT_DEFER → vault with full context
DROP → log + discard with reason
```

**The 4 source classes that cross The Threshold:**
1. `chat-channel` — user prompts in this chat (UserPromptSubmit)
2. `external-content` — uploaded files, URLs, EXT-ID content (manual-protocol)
3. `agent-output` — subagent results, tool outputs (Agent() returns)
4. `inner-default-leak` — AI training-default surfacing (D1-D10 catalog)

## §2 — What currently exists (scattered state)

| Component | What it does | State |
|---|---|---|
| `user-prompt-submit-intake.sh` | Detects upload/paste/treasure patterns | ACTIVE (production) |
| `user-prompt-submit-governor-prompts.sh` | Logs GP entries | STUB |
| `user-prompt-submit-context-orchestrator.sh` | Task-class detection for context loading | ACTIVE |
| `packages/schemas/intake-event.ts` | IntakeEvent typed schema | ACTIVE (S011) |
| `tools/intake-router.mjs` | Routes IntakeEvent to SWIFT/VAULT/COUNCIL | ACTIVE (S011) |
| `docs/plan/pillar-0-governance/intake-normalizers.md` | 4 source-class normalizer specs | SPEC ONLY |
| `docs/plan/_intake/manual-protocol.md` | 7-step protocol for external inputs | ACTIVE (manual) |
| `docs/plan/_intake/tag-status-contract.md` | State machine for external items | ACTIVE |
| `docs/plan/_intake/extractions-ledger.md` | Tracking of processed external items | ACTIVE (manual) |

**The gap:** These 9 components run in PARALLEL with no coordination. `user-prompt-submit-intake.sh` doesn't call `intake-router.mjs`. `governor-prompts.sh` doesn't produce IntakeEvent entries. The components exist but don't form a pipeline.

## §3 — The target pipeline (consolidated)

```
┌─────────────────────────────────────────────────────────────┐
│                    THE THRESHOLD                             │
│                                                             │
│  1. DETECT source_class                                     │
│     (user-prompt-submit-intake.sh pattern detection)        │
│                                                             │
│  2. NORMALIZE to IntakeEvent                                │
│     (intake-normalizers.md 4 specs → typed event)          │
│                                                             │
│  3. CLASSIFY type + priority_band                           │
│     (user-prompt-submit-context-orchestrator.sh task class) │
│                                                             │
│  4. ROUTE                                                   │
│     (intake-router.mjs SWIFT/VAULT/COUNCIL/DROP)            │
│                                                             │
│  5. LOG as IntakeEvent                                      │
│     (_intake/intake-log/S<NNN>.jsonl append-only)           │
│                                                             │
│  6. TRIGGER council member                                  │
│     (governance-session / zf-validation / etc.)             │
└─────────────────────────────────────────────────────────────┘
```

**Currently:** steps 1, 3, 4, 6 exist as separate STUB hooks. Steps 2, 5 exist as specs but aren't wired into the hook chain.

**Target (S012):** One `user-prompt-submit-threshold.sh` master hook that orchestrates all 6 steps in sequence, replacing the 3 parallel hooks.

## §4 — Import quarantine (external CSPS-DNA requirement)

Everything IMPORTED from outside CSPS must cross The Threshold via the **External Import Pipeline:**

```
External input (MCP / Agent / Skill / Package / insight)
    ↓ The Threshold detects source_class: external-content
    ↓ route_to: VAULT_DEFER (always for external)
    ↓ Analysis phase (outside CSPS processing)
       - Extract wisdom + patterns
       - Identify what maps to existing CSPS elements
       - Design CSPS-native equivalent
    ↓ CSPS DNA injection:
       - frontmatter (id + core_spine + schema_anchor)
       - principle_compliance
       - consolidation_cross_refs
       - impl_status: swift-implemented
    ↓ The Threshold again (now source_class: internal)
    ↓ SWIFT_EXECUTE or COUNCIL_REVIEW
```

No imported element enters active use without this pipeline.

## §5 — The behavioral contract

`B_INTAKE_GATE` (to be engraved): *"Every input to CSPS must cross The Threshold — be classified into source_class, normalized to IntakeEvent, assigned route_to, and logged to intake-log. No input bypasses The Threshold. External imports additionally require CSPS DNA injection before active use."*

## §6 — What makes The Threshold a moat element

Most platforms have some form of input processing, but they process for CONTENT, not for GOVERNANCE. The Threshold processes for:
- **Classification** — what type of input is this? (research/directive/ratification/question/external)
- **Routing** — when is the right time to process this? (now/vault/Governor)
- **Context preservation** — what context does future processing need? (session state, EP/SG patterns)
- **CSPS DNA injection** — does this input have the governance markers it needs?

No other platform governs its INPUT STREAM for governance compliance. They govern their output (code quality, API contracts). CSPS governs the construction process from the first moment of input.
