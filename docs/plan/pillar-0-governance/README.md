---
id: csps.plan.pillar.governance
name: pillar-0-governance
description: Meta-pillar — principles, conventions, fitness functions, audit runner, ADRs, rule registry. Sits above the operational pillars.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:doc
  - audience:developer
  - maturity:stable
crosscutting:
  - security
  - observability
  - reliability
links:
  - { rel: parent, href: ../README.md }
domain_path: platform
---

# Pillar 0 — Governance (meta-pillar)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this pillar covers

Governance is the **meta-pillar** that sits above the six operational pillars. It contains the rules-of-the-rules: what principles guide every decision, what conventions every artifact follows, what fitness functions verify every commit, what ADRs record every irreversible choice, what registry binds every rule to an enforcer.

Aligns with the **NIST Cybersecurity Framework 2.0 "Govern" function** (added Feb 2024 as a meta-function elevated above the operational functions Identify/Protect/Detect/Respond/Recover). Same structural insight applies here: governance is not one operational concern among many; it sits above and binds them all.

## Why this pillar exists

Without explicit governance, every architectural rule decays into goodwill within a quarter. The pillar contains:
- The principles that constrain decisions (so the platform doesn't drift)
- The reuse-first principle (so artifacts proliferate slowly, deliberately)
- The rule registry (so principles map to mechanical enforcers)
- The ADR archive (so decisions are auditable)
- The audit runner (so fitness functions verify the rules continuously)
- The planning playground itself (so the planning process is structured, refinable, AI-consumable)

## Leaf documents in this pillar

| Document | Status | What it covers |
|---|---|---|
| [architecture-principles.md](architecture-principles.md) | 🟢 v1.7 | The 27 architecture principles + per-layer enforcer mapping |
| [reuse-first-principle.md](reuse-first-principle.md) | 🟢 v1.4 | The canonical "check what exists" principle + enforcement |
| [rule-registry.md](rule-registry.md) | 🟢 v1.4 | The chat → rule → enforcer pipeline |
| [adr-process.md](adr-process.md) | 🟢 v1.4 | MADR template + initial ADRs |
| [planning-playground.md](planning-playground.md) | 🟢 v1.4 | This planning system, documented |
| [audit-runner.md](audit-runner.md) | 🟢 v1.7 | The recurring audit system: ~37 checks across 10 categories, severity routing, dashboards |
| [mechanical-enforcement.md](mechanical-enforcement.md) | 🟢 v1.5 | Defense-in-depth enforcement architecture; `principles.yaml` as single source of truth; multi-level inheritance |
| [operating-principles.md](operating-principles.md) | 🟢 v1.5 | The 4 operating principles — Reuse-first, FWWS, PCR, Batched execution — with industry lineage and per-layer enforcer mapping |
| [stewardship-protocol.md](stewardship-protocol.md) | 🟢 v1.0 | P-META-004 Stored Content Lifecycle — every saved artifact declares `lifecycle_state` with a recurring trigger that advances it. 6-state machine + per-state SLAs + 4 enforcing audits. The cure for orphan-in-waiting saves. |
| [learning-loop.md](learning-loop.md) | 🟢 v1.0 | P-META-005 Learning Loop — every input stream (chat, errors, audits, feedback, AI insights) routed through observed → triaged → routed → fixing → validated → closed. 6 enforcing audits + LearningLoopItem slice + extraction skill. The cure for write-only knowledge graveyards. |
| [ai-behavior-spine.md](ai-behavior-spine.md) | 🟢 v1.0 | The single audit-point for every AI behavioral discipline. 29 disciplines × 5 surfaces (schema/validator/hook/memory/contract). Adopts CSP's 5-element pattern. Companion to behavioral-contracts.md. |
| [behavioral-contracts.md](behavioral-contracts.md) | 🟢 v1.0 | Full canonical text of every B_* behavioral contract bound to AI behavior. Includes 4 CSP carry-forwards (B_AUTONOMY_4_CONDITIONS / B_CHECKPOINT_8_CATEGORIES / B_ATOMIC_DUAL_REGISTRATION / B_ALWAYS_GIT_LINKS) + 5 from S002 self-audit + B_RZF + B_CEC (turn 10). |
| [zero-findings-discipline.md](zero-findings-discipline.md) | 🟢 v1.0 | P-META-006 — RZF (defect verification, CSP S333 carry-forward) + CEC (Complete Extraction Cycle, CSPS turn 10 extension). Re-run-is-proof + cycle-count-is-measurement + walk-platform-after-ratification. The cure for "ratify and move on" + "negative-only validation" failure patterns. |

## Cross-cutting concerns this pillar addresses

- **Security** — principles include default-deny, defense-in-depth
- **Observability** — audit runner is the platform's continuous health signal
- **Reliability** — fitness functions catch regressions before merge

## Reuse-first reminder

When proposing a new principle / rule / ADR / audit check: search the existing tree first. If a near-match exists, **enhance the ratified thing**. If creation is justified, the ADR must explain why enhancement was wrong. The system enforces this via the rule registry's `enhances:` field on every entry.

## Where this pillar sits in the bigger picture

Governance binds the operational pillars (1–6) but doesn't substitute for them. Architecture decisions live here as ADRs; their implementations live in the operational pillars. Audit checks live here as definitions; their executions touch every pillar.
