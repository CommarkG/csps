---
id: csps.core-spines.l2-domain-oper-workflow-integrity
name: L2_DOMAIN_OPER_WORKFLOW_INTEGRITY
description: OPER spine domain governing session lifecycle + handoff protocol + governor-prompts logging + cloud-canonical zero-laptop-dependency. Every session leaves a trail; no work depends on a single physical machine.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
amendment_protocol: normal review (PCR + amendment)
template_used: l2-domain-doctrine
template_status: novel-pending-pattern-evaluation
core_spine: OPER
schema_anchor: core_spines_l2_domain
parent_l1_doctrine: ./L1_CORE_OPER.md
domain: WORKFLOW_INTEGRITY
tags:
  - domain:ops
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S006
---

# L2_DOMAIN_OPER_WORKFLOW_INTEGRITY

Operational decomposition of OPER spine — the domain governing **session lifecycle + handoff protocol + cloud-canonical store**.

## What this domain governs

Every session is governed. Prompts are logged via Governor Prompts (B_GOVERNOR_PROMPTS — every user prompt logged with verbatim + tags + distribution targets). Handoffs are pre-flight audited via HPFA (B_HANDOFF_PRE_FLIGHT_AUDIT — 7-check whole-session walk before handoff write). Closing summaries cite cycle evidence per §10.0 mandatory headers. No work claims completion without paired tool-call proof.

The platform is canonical in the cloud, not on any single physical machine. Every artifact reaches Git remote before any session closes (B_ZERO_LAPTOP_DEPENDENCY). Multi-machine parity is engraved via devcontainer.json + bootstrap.ps1. Remote access first-class via GitHub Codespaces + Android (GitHub mobile + Chromium). Secrets in 1Password / Bitwarden — never in repo.

The session lifecycle has explicit shape: open (state declaration + receipt signature) → execute (governor-prompts continuous + cycle evidence per step) → close (HPFA + closing-summary §10.0 cycle evidence + push to remote + chat-jump-prompt for next session).

## Operational governance surfaces

- **B_GOVERNOR_PROMPTS** (P-META-012)
- **B_HANDOFF_PRE_FLIGHT_AUDIT** (P-META-013)
- **B_ZERO_LAPTOP_DEPENDENCY** (P-OPER-001)
- **B_TWO_SIDED_HANDSHAKE** (S002 turn 6-7 + CSP session-lifecycle)
- **B_PROTOCOL_LITERAL_EXECUTION** (every protocol step gets explicit per-step execution + evidence)
- **closing-summary-template.md §10.0 + §10.0e + §10.0f + §10.0g/h/i/j** (mandatory headers)
- **chat-jump-prompt template** (cross-chat handshake closure)

## Per-domain validators

- `governor-prompt-coverage` (every user prompt logged)
- `governor-prompt-distribution-complete` (cardinal cross-links propagated)
- `hpfa-pre-handoff-coverage` (handoff write blocked without HPFA PASS)
- `git-pushed-state-clean` (commits on remote before close)
- `devcontainer-config-valid` + `multi-machine-parity-spec` + `no-local-only-secrets-in-repo` (zero-laptop-dependency)
- `closing-summary-checklist-completeness` (PR-blocking error)

## Composition

Composes with L2_DOMAIN_OPER_PACE_DISCIPLINE (session lifecycle is the pace) + L2_DOMAIN_OPER_REALITY_GROUNDING (handoff captures observed reality at close) + the GVRN Spine's ACCOUNTABILITY_TRACEABILITY domain (governor-prompts + HPFA are the provenance mechanism for sessions) + the VALD Spine's EVIDENCE_SPECIFICITY domain (cycle evidence at every commitment boundary).

**Domain signature:** S006-AI-l2-domain-oper-workflow-integrity-2026-05-04T20:00:00Z
