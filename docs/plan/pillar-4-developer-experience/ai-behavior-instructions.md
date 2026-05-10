---
id: csps.pillar-4.ai-behavior-instructions
name: ai-behavior-instructions
description: The AGENTS.md content spec + AI prompt addendum. Cross-references the AI Behavior Spine (pillar-0/ai-behavior-spine.md), Behavioral Contracts (pillar-0/behavioral-contracts.md), and Five-Surface Engraving discipline (pillar-0/five-surface-engraving.md). The DX-side reading-order leaf — what an AI agent should load and in what order to operate inside CSPS correctly. Counterpart to the GOVERNANCE-side spine + contracts in pillar-0. NEW v1.5.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
next_review_at: 2026-08-01
tags:
  - domain:dx
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - observability
  - ai-native
diataxis_type: how-to
links:
  - { rel: parent, href: ./README.md }
  - { rel: spine, href: ../pillar-0-governance/ai-behavior-spine.md }
  - { rel: contracts, href: ../pillar-0-governance/behavioral-contracts.md }
  - { rel: five-surface, href: ../pillar-0-governance/five-surface-engraving.md }
  - { rel: zero-findings, href: ../pillar-0-governance/zero-findings-discipline.md }
  - { rel: agents-md, href: ../../../AGENTS.md }
created-new-because: |
  pillar-0/ai-behavior-spine.md and pillar-0/behavioral-contracts.md are the GOVERNANCE-side
  source-of-truth (the matrix + the contracts). This leaf is the DX-side READING-ORDER spec for
  AI agents loading the platform — what to load, in what order, with what priority. Distinct
  concern: governance vs developer-experience surfacing of the same disciplines.
domain_path: platform
---

# AI Behavior Instructions (DX Surface)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The reading-order spec for AI agents (Claude Code / Codex / Cursor) entering the CSPS workspace. Defines the AGENTS.md content shape, the AI prompt addendum loaded into `CLAUDE.md`, the discoverability of the spine + contracts + FSE discipline, and the per-session warm-up sequence.

This is the **DX surface** of AI behavior — the developer's-eye-view of what the AI should load and execute. The **governance source-of-truth** lives in pillar-0:

| Concern | Governance leaf | DX leaf |
|---|---|---|
| 34-discipline matrix (the WHAT) | [pillar-0/ai-behavior-spine.md](../pillar-0-governance/ai-behavior-spine.md) | this leaf points to it |
| Per-discipline contract text (the BINDING) | [pillar-0/behavioral-contracts.md](../pillar-0-governance/behavioral-contracts.md) | this leaf indexes which to load |
| 7-stage cycle for engraving new disciplines (the META) | [pillar-0/five-surface-engraving.md](../pillar-0-governance/five-surface-engraving.md) | this leaf describes when AI invokes it |
| Zero-findings + complete-extraction (the AUDITING) | [pillar-0/zero-findings-discipline.md](../pillar-0-governance/zero-findings-discipline.md) | this leaf describes invocation triggers |

## Why this exists

The governance leaves define WHAT the disciplines are. They are dense and reference-shaped. An AI agent entering a fresh chat needs a different artifact: a HOW-TO that says "read these files in this order; check these things first; emit these blocks at these moments."

Without this leaf, every fresh chat re-derives the right loading order from scratch. This leaf makes the loading order mechanical.

Per CSP carry-forward: *"Memory alone doesn't change behavior; only mechanical layer does."* AGENTS.md cascade IS the mechanical layer for AI loading; this leaf is what AGENTS.md points to for the full spec.

## The reading order (mandatory; AI must follow on every session-open)

```
1.  AGENTS.md (root)                                    — the contract + 30+ hard NOs
2.  packages/principles/principles.yaml                  — single source of truth for principles
3.  pillar-0/operating-principles.md                     — P-OP-001..004 (FWWS / PCR / reuse-first / batched)
4.  pillar-0/mechanical-enforcement.md                   — the 4-layer enforcement spine
5.  pillar-0/ai-behavior-spine.md                        — 34 disciplines × 5 surfaces matrix
6.  pillar-0/behavioral-contracts.md                     — 14+ B_* contracts (full text)
7.  pillar-0/five-surface-engraving.md                   — P-META-007 — the engraving meta-discipline
8.  pillar-0/zero-findings-discipline.md                 — P-META-006 — RZF + CEC
9.  pillar-0/qc-audit-system.md                          — operational audit layer + Grandfather Backfill
10. pillar-0/stewardship-protocol.md                     — P-META-004 — lifecycle_state state machine
11. pillar-0/learning-loop.md                            — P-META-005 — observed→triaged→routed→fixing→validated→closed
12. _intake/manual-protocol.md + tag-status-contract.md + unknown-path-protocol.md  — runtime intake bridge
13. THIS LEAF                                            — DX surface index (you are here)
14. The session's pillar/leaf relevant to current work — read on demand
```

Per session-open: at minimum, AGENTS.md (item 1) loads automatically. Items 2-13 load via the agent's first explicit `Read` call (one parallel call per file is the recommended pattern). Item 14 loads as work proceeds.

## The AGENTS.md content spec

`AGENTS.md` (root) follows the [AGENTS.md cross-vendor convention](https://agents.md/) and contains:

1. **Reading-order pointer** — first line: "Load the files in this order: [link to this leaf]"
2. **30+ hard NOs** — the AGENTS.md hard NOs that mechanically encode every B_* contract's prohibitive surface; updated turn-by-turn as new disciplines engrave
3. **Per-directory cascade** — `apps/<app>/AGENTS.md` extends the root with app-specific NOs (e.g., `apps/admin/AGENTS.md` adds "Never expose impersonation outside staffRole gate")
4. **AI prompt addendum** — the prompt fragment loaded into `CLAUDE.md` instructing the AI to query the catalog before scaffolding (per pillar-4/generators.md catalog-first UX)
5. **Workspace warning block** — the parent-CLAUDE.md trap-defusal text (engraved S002 turn 16; folder renamed VSAS → Csps on 2026-05-03) — distinguishes "wrong workspace" from "CSPS is in the Csps workspace"
6. **Reference links** — pointers to pillar-0 leaves + `principles.yaml` + this leaf

### The cascade pattern

Per [agents.md spec](https://agents.md/):

```
AGENTS.md (root)                          ← platform contract + 30+ hard NOs
├── apps/admin/AGENTS.md                  ← extends root + admin-specific (impersonation gate, staffRole)
├── apps/api/AGENTS.md                    ← extends root + API-specific (rate limits, auth)
└── apps/customer-shell/AGENTS.md         ← extends root + customer-app-specific (RLS, tier)
```

Child AGENTS.md ALWAYS extends parent (never replaces). Audit `agents-md-cascade-completeness` (planned week 4) verifies every app directory has an AGENTS.md.

## The AI prompt addendum (engraved in workspace `CLAUDE.md`)

> **Before proposing creation of any artifact (slice, skill, agent, page, ZModel pattern, validator, prose), query the catalog (`packages/catalog/catalog.json`, exposed as MCP resources) for existing matches and cite the closest. If you propose new, justify why enhancement of the closest match is wrong. Generators (`nx g platform:*`) are the only sanctioned scaffolding path.**

> **Every state-claim cites a tool-call IN THIS RESPONSE. Memory of an earlier call is NOT validation. Re-run IS the proof.** (B_VALIDATE_BEFORE_ASSUME — engraved S002 turn 7 + strengthened turn 15)

> **Every DONE / COMPLETE / RATIFIED / VALIDATED / CLOSED claim emits an RZF evidence block + (if newly-ratified) CEC walk-trail.** (P-META-006 — engraved S002 turn 10)

> **When you catch a gap / trap / anti-pattern / failure-mode, do NOT just note it. Engrave it: 5 surfaces (schema + validator + hook + memory + contract) atomically. Default-to-engrave; explicit-to-skip with rationale.** (B_FIVE_SURFACE_ENGRAVING / P-META-007 — engraved S002 turn 17)

> **Every file/folder/path mention is `[display-text](workspace-relative-path)` — never bare.** (B_ALWAYS_GIT_LINKS — engraved S002 turn 19)

> **Banned phrases inside an approved batch: "shall I continue?" / "should I proceed?" / "would you like me to..." / "do you want me to..." / "let me know if..." / "is that OK?" / "ready for me to...". Execute + report inline + continue.** (B_AI_PROFESSIONAL_VOICE confirmation-seeking strengthening — engraved S002 turn 19)

## Per-session warm-up sequence

For every fresh chat:

1. AI loads AGENTS.md (auto via Claude Code)
2. AI runs reading-order items 2-12 in parallel (one Read per file, single tool message)
3. AI runs `_handoff/VAULT/blockers-S<latest>.md` to verify all blockers `state: open` are surfaced
4. AI executes step 0 (per protocols.md v1.7 §11): asks user about prior-platform precedent
5. AI executes §17 two-sided handshake attestation (per the prior session's handoff §17)
6. AI verifies `intent_to_impact` (§16 of prior handoff)
7. AI begins §3 FWWS-pending work

Per AGENTS.md hard NO: "Never start a fresh chat without producing the two-sided handshake attestation as FIRST REPLY."

## Discoverability for AI agents

The 34-discipline matrix (ai-behavior-spine.md) is the AI's index. Each row in the matrix declares:
- The discipline name (B_* contract OR P-META-NNN principle)
- Which of the 5 surfaces it lives on (schema / validator / hook / memory / contract) and their state (active / declared / deferred / n/a)
- Which AGENTS.md hard NO encodes the prohibitive surface
- Cross-references to the canonical leaf

When the AI catches a new gap, it runs the FSE 7-stage cycle (per pillar-0/five-surface-engraving.md): Detect → Classify → Design-delta → Apply-atomically → Verify-completeness → Emit-evidence-block → Propagate.

## Anti-patterns

1. **Loading principles without behavioral contracts** — half-load; AI knows the rules but not their bindings
2. **Loading contracts without spine** — AI knows the bindings but not the matrix; can't audit completeness
3. **AGENTS.md cascade with replace semantics** — refused; child AGENTS.md must extend, not replace
4. **AI bypassing reading-order on resume** — refused; per-session warm-up is mandatory; audit `session-open-reading-order` (planned week 4) catches via session-log scan
5. **Adding a new B_* contract without 5-surface engraving** — refused; B_FIVE_SURFACE_ENGRAVING is the meta-contract that gates all new disciplines
6. **Memory-triggered behavior without mechanical surface** — refused; memory + AGENTS.md NO + contract is the minimum 3-surface pattern; <2 surfaces is a B_FIVE_SURFACE_ENGRAVING anti-pattern

## Enforcement

- `principles.yaml#P-META-007` (Five-Surface Engraving — the meta-rule)
- `principles.yaml#P-META-006` (Zero-Findings Discipline — RZF + CEC)
- `AGENTS.md` (the actual hard-NO catalog this leaf references)
- `audit-runner.md#agents-md-cascade-completeness` (every app dir has AGENTS.md)
- `audit-runner.md#session-open-reading-order` (planned week 4)
- `audit-runner.md#audit-of-audits` (planned week 4 — meta-RZF on the discipline-engraving system itself)
- `pillar-0/ai-behavior-spine.md` (the matrix — read alongside this leaf)
- `pillar-0/behavioral-contracts.md` (the binding texts — load when AI encounters a B_* reference)

## Sources

- [agents.md spec](https://agents.md/) — the cross-vendor AI contract convention
- [agentskills.io spec](https://agentskills.io/) — the skill-package convention
- [Anthropic Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [pillar-0/ai-behavior-spine.md](../pillar-0-governance/ai-behavior-spine.md) — the discipline matrix
- [pillar-0/behavioral-contracts.md](../pillar-0-governance/behavioral-contracts.md) — the contract bindings
- [pillar-0/five-surface-engraving.md](../pillar-0-governance/five-surface-engraving.md) — the engraving meta-discipline (P-META-007)
- [pillar-0/zero-findings-discipline.md](../pillar-0-governance/zero-findings-discipline.md) — the audit meta-discipline (P-META-006)
