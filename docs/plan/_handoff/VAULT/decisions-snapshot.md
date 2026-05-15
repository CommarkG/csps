---
id: csps.handoff.vault.decisions-snapshot
name: decisions-snapshot
description: Point-in-time snapshot of every locked architectural + protocol + behavioral decision in CSPS at S003 close (2026-05-03). One row per decision; cites ADR / BLK-resolution / handoff section / commit. Distinct from principles-snapshot (rules) — this captures the ratified DECISIONS those rules emerged from. The single artifact a future session reads to understand "what's already decided" without re-litigating.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: protocols, href: ./protocols.md }
  - { rel: principles-snapshot, href: ./principles-snapshot.md }
  - { rel: adr-index, href: ../../../docs/adr/ }
session: S003
domain_path: platform
scope_level: S1
---

# Decisions Snapshot — S003 close (2026-05-03)

> Every row = a locked decision. Source = ADR (most), BLK-S<NNN>-* resolution, or handoff section. If a future session wants to revisit a decision: file an ADR amending it. Decisions are not silently overturned.

## Architectural decisions (21 ADRs — all status: accepted)

| ADR | Decision | Source |
|---|---|---|
| 0001 | Pick the CSPS stack (Nx + Next.js + Supabase + Prisma+ZenStack + Payload + Mastra + Cloudflare Workers + Clerk + Stripe) | S001 |
| 0002 | Adopt schema-per-app (each app's own Postgres schema; isolation + extraction-readiness) | S001 |
| 0003 | Locked tier vocabulary (free / pro / business / enterprise / internal) | S001 |
| 0004 | Template-only page creation (pages use registered templates from `packages/templates/`) | S001 |
| 0005 | Sandboxed skill governance (3 trust tiers + Cloudflare Worker sandbox + capability model) | S001 |
| 0006 | Crisis escalation load-bearing for v1 (every persona inherits the slice) | S001 |
| 0007 | Postgres trigger-based audit (DB-layer triggers, not application-layer) | S001 |
| 0008 | One Mastra agent, many personas (Dynamic Agents pattern via runtimeContext) | S001 |
| 0009 | Hybrid persona memory (User.preferences shared + PersonaMemory per-persona) | S001 |
| 0010 | Reuse-first principle is load-bearing (P-OP-001; 10 enforcers) | S001 |
| 0011 | Pillar architecture: 6 + meta (Pillar 0 governance + Pillars 1-6 topical) | S001 |
| 0012 | CSPS name + CoreSights umbrella | S001 |
| 0013 | Rename "cool names" to industry-standard (Cambium → CSPS; Bone-Block → Module-Folder) | S001 |
| 0014 | Adopt MADR for ADR format | S001 |
| 0015 | Rule registry as fitness-function binder | S001 |
| 0016 | Mechanical-enforcement architecture (4-layer cascade + MCP + audit + codegen) | S001 |
| 0017 | Four operating principles (FWWS / PCR / Reuse-first / Batched) | S001 |
| 0018 | Planning playground as staircase | S001 |
| 0019 | Validation-pass includes limits-line | S002 (turn 9) |
| 0020 | Handoff includes verification command | S002 (turn 9) |
| 0021 | Validation-pass per-principle-category coverage | S002 (turn 9) |

## Protocol decisions (S002 — protocols.md v1.3 → v1.7)

| Decision | Resolution | Source |
|---|---|---|
| Step 0 (precedent question) at fresh-chat open | Add to protocols.md §11 step 0 | BLK-S002-008 → option A |
| Intent-to-impact validation in handoff | New protocols.md §16 + §11c | User S002 turn 6 |
| Two-sided handshake attestation | New protocols.md §17 + §11b | User S002 turn 6 |
| `protocols.md` versioned + canonical | Single canonical file; per-handoff references it | S002 turn 6 |
| Detailed paste-prompt for new chat (alongside minimal) | New protocols.md §22 | User S002 turn 13 (closing-AI auto-generates BOTH) |
| Required-header closing-summary template | NEW `_handoff/VAULT/closing-summary-template.md` (turn 14) | B_PROTOCOL_LITERAL_EXECUTION engraving |
| RZF + CEC mandatory at every DONE/RATIFIED | protocols.md §19 + §20 | P-META-006 (S002 turn 10) |
| Grandfather Backfill Protocol | protocols.md §21 + §11 step 10b | P-META-006 Component 5 (S002 turn 12) |
| TodoWrite-transcribe-at-open per §10/§11 | B_PROTOCOL_LITERAL_EXECUTION (S002 turn 14) | Counters protocol-compression-is-skipping |
| Workspace-warning + 4 ls verifications in paste-prompt | S002 turn 16 | Mechanical defusal of parent-CLAUDE.md trap |
| FSE evidence block §10.13c (mandatory per new B_*) | B_FIVE_SURFACE_ENGRAVING / P-META-007 (S002 turn 17) | Closes single-surface-engraving anti-pattern |
| `B_ALWAYS_GIT_LINKS` canonical contract text | S002 turn 19 | Memory + AGENTS.md NO + contract amendment |
| Banned confirmation-seeking phrases inside batches | S002 turn 19 | B_AI_PROFESSIONAL_VOICE strengthening |

## Behavioral decisions (the B_* contracts — full text in `pillar-0/behavioral-contracts.md`)

CSP carry-forwards absorbed S002:
- B_AUTONOMY_4_CONDITIONS — autonomous execution requires all 4 (ratified + reversible + mechanical + no-cross-actor)
- B_CHECKPOINT_8_CATEGORIES — irreversible / cross-tier / external-dispatched / etc. trigger checkpoint
- B_ATOMIC_DUAL_REGISTRATION — file + catalog manifest in same write; never two steps
- B_ALWAYS_GIT_LINKS — every path is `[text](path)`

Engraved S002 from self-audit:
- B_VALIDATE_BEFORE_ASSUME (turn 7 + turn 15 strengthening — tool-call sandwich)
- B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK
- B_CHECK_EXISTING_DECISIONS_FIRST
- B_ASK_WHEN_FILLING_GAPS
- B_AI_PROFESSIONAL_VOICE (turn 7 + turn 19 banned-phrases strengthening)
- B_BLOCKER_NO_SILENT_DROP — "drop it" is also a reply but no comment is a blocker
- B_TWO_SIDED_HANDSHAKE — attestation contract
- B_PROTOCOL_LITERAL_EXECUTION (turn 14)
- B_CATCH_TO_ENGRAVING (turn 15)
- B_FIVE_SURFACE_ENGRAVING (turn 17)

P-META-006 family:
- B_RZF — Real Zero Findings; re-run IS the proof
- B_CEC — Complete Extraction Cycle; walk platform after every ratification
- B_QC_AUDIT — registry + automation per qc-audit-system.md

## BLK-S002-* resolutions (8 blockers, all answered/resolved at S002 turn 9)

| BLK | Decision | Option chosen |
|---|---|---|
| BLK-S002-001 | Hybrid 3-layer intake architecture | C |
| BLK-S002-002 | Defer AIBehavior schema slice to week 6+ | C |
| BLK-S002-003 | Connector cohort priority shuffled (AI-app exports wk5 / PDF wk6 / Google wk7 / multimedia wk8) | B |
| BLK-S002-004 | Treasure documents found in turn 7 message body — engraved as B_VALIDATE_BEFORE_ASSUME | resolved |
| BLK-S002-005 | Approve protocols.md v1.2 (now v1.7 at S002 close) | A |
| BLK-S002-006 | Input-assessment-questions split (13 mandatory + 18 conditional + 12 emergent) | B |
| BLK-S002-007 | Keep `ai-behavior-spine.md` as canonical leaf | A |
| BLK-S002-008 | Add precedent step 0 to fresh-chat protocol §11 | A |

## Pillar architecture decisions

- 6 pillars + meta-pillar (Pillar 0 = Governance) — per ADR-0011
- Topical-primary structure (arc42 model); cross-cutting concerns as frontmatter tags (WAF model)
- Pillar count is in the industry-validated 4-6 sweet spot (NIST CSF 2.0 / AWS WAF / Azure WAF / Google Cloud Framework converge)

## External-Input Intake plane decisions (S002)

- Intake plane root: `docs/plan/_intake/`
- 4 mandatory stamping fields per accepted input (received_at_iso / origin / origin_detail / received_via)
- Manual-protocol bridges pre-runtime (no DB yet)
- Schema-mirrored contexts tree (`_intake/contexts/`) — 11 sub-folders
- Dashboard-plan post-runtime → 6 admin pages incorporated into pillar-6/dashboards.md (S003)
- 5 EXT-IDs processed live (S002 treasures #1-5 + decision-alternatives archive)

## Pillar migration decisions (S002 + S003)

- S002 §3.4: Pillar 3 migrated (5 leaves)
- S003 §3.1: Pillar 4 migrated (4 leaves: 2 migrated + 2 NEW)
- S003 §3.2: Pillar 5 migrated (3 leaves)
- S003 §3.3: Pillar 6 migrated (5 leaves; build-order updated per BLK-S002-003 cohort shuffle)

## Session lifecycle decisions

- Session numbering: S001, S002, S003, ... sequential, no gaps, never reused
- HANDOFF-S<NNN>-to-S<NNN+1>.md per session (mandatory)
- Prior handoff `lifecycle_state` transitions `active → resolved` at session-close
- Closing protocol = protocols.md §10 (TodoWrite-transcribe at open; required-header template at close)
- Fresh-chat protocol = protocols.md §11 (step 0 precedent + reading order + §17 attestation)

## How to use this snapshot

Future session opening: read this file to know "what's locked" before proposing changes. Any decision being revisited requires an ADR amendment + user explicit acceptance. No silent overturning per AGENTS.md hard NO.
