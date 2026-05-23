---
id: csps.pillar-0-governance.vault-methodology
name: vault-methodology
description: The CSPS Vault Methodology — canonical discipline for saving items with full context for later processing. Vaulting is NOT a delay; it IS the optimal path when immediate processing would produce lower quality due to incomplete context, wrong timing, or cognitive overload. Every governed artifact must connect to vault(s) via vault_pending field. Per S011 user directive "allowing yourself to save things with full context for later processing is not a delay — IT IS A VIRTUE."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: stable
core_spine: GVRN
core_spines: [GVRN, AI, OPER, VALD, ARCH]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: explanation
session: S011
file_depth_markers:
  l1_lines: "1-80"
  l2_lines: "81-180"
  l3_lines: "181-end"
  read_protocol: "L1 = vault taxonomy + decision rule + mandatory artifact field. L2 = per-type vault protocols + retrieval triggers. L3 = connection to Core Spines + full schema."
question_register:
  - "When should vault items auto-process vs require human trigger?"
  - "How do we measure 'value realized' from a vaulted item?"
  - "Should vault items have a maximum age before they're archived as irrelevant?"
links:
  - { rel: parent, href: ./README.md }
  - { rel: vault-dir, href: ../_handoff/VAULT/ }
  - { rel: intake-normalizers, href: ./intake-normalizers.md }
  - { rel: know-how, href: ../_handoff/VAULT/know-how/README.md }
domain_path: platform
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# Vault Methodology — CSPS

> **The insight:** Forcing immediate processing of everything produces lower quality than vaulting with context and processing at the right time. "Allowing yourself to save things with full context for later processing is not a delay — IT IS A VIRTUE." — Governor S011
>
> **The corollary:** A question answered with incomplete context is worse than a question deferred until the right context is available.

## §1 — Why vaults exist (the cognitive architecture)

Most systems have two states for any input:
```
PROCESS NOW    → often with incomplete context → poor outcome
FORGET         → no recovery → lost value
```

CSPS adds the third state:
```
VAULT WITH CONTEXT → process at right time → durable outcome
```

The vault is not procrastination. It is **temporal optimization** — matching processing to the time when context, capacity, and readiness are all maximized.

**What makes a vault entry valuable:** the CONTEXT preserved alongside the item. A question without context is just another backlog item. A question with:
- the artifact it arose from
- the session state when it was noticed
- the attempted approaches that didn't resolve it
- the principle/pattern it relates to
- the conditions under which it should be retrieved

...is a compressed work item that can be fully reconstructed later.

## §2 — The vault taxonomy

| Type | What it holds | Route | Retrieval trigger |
|---|---|---|---|
| **QUESTION vault** | Unresolved questions with full reasoning chain | `route_to: VAULT_DEFER` | PE.read_budget identifies time; Governor approves |
| **SUCCESS vault** | Positive patterns with evidence chain (→ SG-NNN) | `route_to: VAULT_DEFER` | Pre-plan-creation §KH consultation |
| **DECISION vault** | Options considered, decision deferred | `route_to: VAULT_DEFER` | Prerequisite decision is made |
| **EXTERNAL vault** | External insights awaiting deep absorption | `route_to: VAULT_DEFER` | Dedicated absorption session |
| **OBSERVATION vault** | Patterns noticed, not yet classified | `route_to: VAULT_DEFER` | Weekly know-how-extractor.mjs |

## §3 — The mandatory artifact connection

Every governed artifact MUST have `vault_pending:` in frontmatter. This is the mechanical connection between the artifact and the vault system.

```yaml
# In every governed artifact frontmatter:
vault_pending:
  - id: VLT-S011-001
    type: question
    content: "Does Mastra's dynamic agent pattern handle multi-tenant session isolation?"
    context_ref: docs/plan/pillar-5-ai-systems/README.md#L51
    session_added: S011
    retrieve_when: "When Mastra runtime build (week-6+) is scheduled"
    principle_ref: P-ARCH-012   # persona-orthogonal-to-agent
  - id: VLT-S011-002
    type: decision
    content: "ADR-0025 CNST/GVRN split — deferred pending foundation stability"
    context_ref: docs/plan/pillar-0-governance/csps-core-manifest.md
    session_added: S006
    retrieve_when: "After 2+ sessions with Ring 3 (schema) built and stable"
```

Empty `vault_pending: []` is valid — the field MUST be present but can be empty.

## §4 — The question register (questions as first-class)

Questions are a special vault type. Every plan, session, and major architectural decision generates questions. These must be typed and tracked, not buried in prose.

```yaml
# In plan and session-close artifacts:
question_register:
  - type: research       # answer via external consultation or research session
    question: "..."
    routed_to: VAULT_DEFER
    session: S011
  - type: design         # Governor decision needed
    question: "..."
    routed_to: COUNCIL_REVIEW
    session: S011
  - type: implementation  # resolve in-session
    question: "..."
    routed_to: SWIFT_EXECUTE
    resolved: true
    answer_ref: commit/sha  # where it was resolved
```

**Question types:** `research` | `design` | `implementation` | `validation` | `external`

**The integration:** Questions ARE IntakeEvent entries with `classified_type: 'question'`. The intake-router routes them — SWIFT_EXECUTE for in-session questions, VAULT_DEFER for research/deferred questions.

## §5 — Per-spine vault protocols

Each Core Spine has its own vault domain:

| Spine | Vault domain | Typical contents |
|---|---|---|
| **GVRN** | Governance questions | Unresolved principle conflicts, uncertain B_* boundaries, ADR candidates |
| **ARCH** | Architecture decisions | Pattern candidates, ADR-deferred items, schema design alternatives |
| **AI** | AI behavior insights | Successful prompt patterns, context loading wins, model routing findings |
| **OPER** | Operational blockers | Codespaces issues, dependency conflicts, deployment decisions |
| **VALD** | Validation findings | Complex edge cases, validation results needing analysis, measurement obligations |

## §6 — Vault retrieval discipline

A vault entry without a retrieval mechanism becomes dead weight. Every vault entry MUST declare `retrieve_when:` — the trigger condition for processing.

**Retrieval triggers (choose one):**
- **Time-based:** "When session S<NNN> opens" — explicit scheduling
- **Dependency-based:** "When [artifact] is built" — conditional on another work item
- **PE-based:** "When PE band 1 work is complete" — priority-ordered
- **Weekly scan:** "Weekly know-how-extractor.mjs processes this" — automatic batch
- **Governor trigger:** "When Governor explicitly requests" — human-gated

## §7 — The vault as a moat element

The vault is a moat because it enables **compounding context**. Without vaults:
- Questions get dropped when sessions get long
- Positive patterns are forgotten after §10.11b
- Decisions get re-derived session after session

With vaults:
- Questions accumulate context across sessions → when answered, the answer is richer
- Positive patterns feed pre-plan checklists → next plan is better
- Decisions build on preserved reasoning → no re-derivation waste

**The compounding formula:**
```
Session N discovers insight X
  → vaulted with full context
  → Session N+1 retrieves X with context intact
  → X informs Session N+1's plan (via §KH or pre-plan checklist)
  → Session N+1 produces better outcome than if X had been forgotten
  → Session N+1 vaults additional insight Y built on X
  → ... (compounding continues)
```

This is why CSP took 330 sessions to evolve what CSPS built in 11 — the vault compounds every insight instead of starting from zero each session.

## §8 — validate-vault-connections integration

`validate-vault-connections.mjs` (to be built — see tools/validators/) checks:
- Every active topic-plan has `vault_pending:` field
- Every closing-summary has `question_register:` field
- Every vault entry has valid `retrieve_when:` condition
- Orphaned vault entries (no source artifact link) are surfaced

Weekly hook §7 processes vault entries that have passed their `retrieve_when:` trigger.
