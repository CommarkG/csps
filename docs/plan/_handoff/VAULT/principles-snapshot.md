---
id: csps.handoff.vault.principles-snapshot
name: principles-snapshot
description: Point-in-time snapshot of every principle in packages/principles/principles.yaml at S003 close (2026-05-03). 4 operating + 27 architecture + 7 meta = 38 principles. Each entry shows ID + name + 1-line essence + counterweight clause + canonical-leaf path + S<NNN> introduced. The single artifact a future session reads to understand "what rules exist" without diff-spelunking the yaml.
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
  - { rel: source, href: ../../../packages/principles/principles.yaml }
  - { rel: protocols, href: ./protocols.md }
session: S003
---

# Principles Snapshot — S003 close (2026-05-03)

> Source of truth: `packages/principles/principles.yaml`. This file is a human-readable point-in-time mirror.

## Operating principles (4) — always-on; cognitive-load-aware human-AI collaboration

| ID | Name | Essence | Counterweight | Canonical leaf | Introduced |
|---|---|---|---|---|---|
| **P-OP-001** | Reuse-first | Check what exists. Enhance the ratified thing. Create new only with a justification. | Inline-and-redecide when the ratified thing is the wrong abstraction (Sandi Metz) | [pillar-0/reuse-first-principle.md](../../pillar-0-governance/reuse-first-principle.md) | S001 |
| **P-OP-002** | FWWS (Finish What We Started) | Resist drift to new work while in-flight work is incomplete. | Explicit-park clause — work can be parked with reason; cannot be silently dropped. | [pillar-0/operating-principles.md](../../pillar-0-governance/operating-principles.md) | S001 |
| **P-OP-003** | PCR (Pros / Cons / Recommendation) | When presenting decisions, use Pros / Cons / Recommendation 3-block format. | Trivial-reversible-decision skip — don't apply to "should this string be uppercase?" | [pillar-0/operating-principles.md](../../pillar-0-governance/operating-principles.md) | S001 |
| **P-OP-004** | Batched execution | For N similar operations: agree acceptance criteria upfront, batch execute, single completion summary. No mechanical micro-stops. | Disciplined-initiative escape (Mission Command) — batch can pause if reality changes mid-execution. | [pillar-0/operating-principles.md](../../pillar-0-governance/operating-principles.md) | S001 |

## Meta-principles (7) — principle-about-principles; the operating-system layer

| ID | Name | Essence | Canonical leaf | Introduced |
|---|---|---|---|---|
| **P-META-001** | Audit-the-audits | Every principle must have ≥N enforcers per severity (critical=4, error=3, warn=2, info=1). The meta-audit verifies. | [pillar-0/audit-runner.md](../../pillar-0-governance/audit-runner.md) | S001 |
| **P-META-002** | Defense-in-depth enforcement | No single enforcement layer carries the burden alone. Layers = AGENTS.md cascade + skills + hooks + Nx/ESLint + MCP. | [pillar-0/mechanical-enforcement.md](../../pillar-0-governance/mechanical-enforcement.md) | S001 |
| **P-META-003** | Codegen-source-of-truth | `principles.yaml` is the single source. AGENTS.md + skills + hooks are generated. CI fails on drift. | [pillar-0/mechanical-enforcement.md](../../pillar-0-governance/mechanical-enforcement.md) | S001 |
| **P-META-004** | Stewardship Protocol | Every saved artifact declares `lifecycle_state` + recurring trigger; saved-without-trigger = orphan-in-waiting. | [pillar-0/stewardship-protocol.md](../../pillar-0-governance/stewardship-protocol.md) | S002 |
| **P-META-005** | Learning Loop | Every input stream routed `observed → triaged → routed → fixing → validated → closed`. K=2-within-90d auto-creates ADR. | [pillar-0/learning-loop.md](../../pillar-0-governance/learning-loop.md) | S002 |
| **P-META-006** | Zero-Findings Discipline | RZF (Real Zero Findings — defect verification) + CEC (Complete Extraction Cycle — value verification). Re-run IS the proof. Cycle count is MEASUREMENT not TARGET. | [pillar-0/zero-findings-discipline.md](../../pillar-0-governance/zero-findings-discipline.md) | S002 turn 10 |
| **P-META-007** | Five-Surface Engraving | Every new behavioral discipline hits 5 surfaces atomically: schema + validator + hook + memory + contract. <2 surfaces = anti-pattern. 7-stage cycle: Detect → Classify → Design-delta → Apply-atomically → Verify-completeness → Emit-evidence-block → Propagate. | [pillar-0/five-surface-engraving.md](../../pillar-0-governance/five-surface-engraving.md) | S002 turn 17 |

## Architecture principles (27) — the rules that shape the platform

P-ARCH-001 through P-ARCH-027 in `principles.yaml`. Full text at [pillar-0/architecture-principles.md](../../pillar-0-governance/architecture-principles.md). Headlines:

| ID | Name | Essence |
|---|---|---|
| P-ARCH-001 | Nothing stands alone | Every artifact has a place + a pre-defined process. |
| P-ARCH-002 | Schema-per-app | Each app gets its own DB schema (per ADR-0002). |
| P-ARCH-003 | Files are truth, DB is index | Source-controlled artifacts are canonical. |
| P-ARCH-004 | One source of truth per concern | ZModel = schema. Glossary = vocabulary. Stripe = entitlements. principles.yaml = principles. |
| P-ARCH-005 | Generators carry the load | Solo developer cannot scaffold by hand. |
| P-ARCH-006 | Platform-is-the-dogfood | Audit system is itself an audited slice. Bootstrap is self-runnable. |
| P-ARCH-007 | Extraction-readiness from day one | Every choice evaluated against "would this make graduation easy?" |
| P-ARCH-008 | AI-readable architecture | Frontmatter on every file; catalog as MCP resources. |
| P-ARCH-009 | Default deny, opt in | Capabilities, tier features, skill permissions start at zero. |
| P-ARCH-010 | Mechanical over procedural | Every rule that matters is enforced by a linter/CI/generator/runtime check. |
| P-ARCH-011 | Vocabulary closed-but-extensible | Closed dimensions (kind:, tier:, etc.); extensible values via PR. |
| P-ARCH-012 | 6-pillar topical-primary structure | arc42 model; cross-cutting concerns as frontmatter tags (WAF model). |
| P-ARCH-013 | One admin app, many views | `/admin/*` gated by staffRole. Not separate admin apps per concern. |
| P-ARCH-014 | Locked-tier vocabulary | free / pro / business / enterprise / internal (per ADR-0003). |
| P-ARCH-015 | Template-only page creation | Pages use registered templates only (per ADR-0004). |
| P-ARCH-016 | Vocabulary audit | Industry-standard names over CSPS-invented (per ADR-0013). |
| P-ARCH-017 | Slice scoring percentage-based | ≥90% to merge; 100% = gold. |
| P-ARCH-018 | Module-folder pattern | Renamed from "manifested slice" (per migration v1.6). |
| P-ARCH-019 | Crisis-escalation load-bearing | Every persona inherits the slice (per ADR-0006). |
| P-ARCH-020 | One Mastra agent, many personas | Dynamic Agents pattern; runtimeContext-parameterized (per ADR-0008). |
| P-ARCH-021 | Hybrid persona memory | User.preferences (shared) + PersonaMemory (per-persona) (per ADR-0009). |
| P-ARCH-022 | Composition function single authority | Every persona dispatch goes through composition. |
| P-ARCH-023 | MADR ADR format | Adopted (per ADR-0014). |
| P-ARCH-024 | Defense-in-depth pre-and-post | Crisis interceptor BEFORE LLM + post-LLM validator AFTER. |
| P-ARCH-025 | Third-party-trust default-deny | Snyk ToxicSkills 13.4% — default-deny mandatory. |
| P-ARCH-026 | Verbatim-vendor-preserved-rewritten-platform-owned | Vendoring discipline (per pillar-3 sandboxed-skill-governance). |
| P-ARCH-027 | Capability-declaration dispatcher-enforcement | Two-point capability check (PreToolUse hook + dispatcher middleware). |

## Behavioral contracts (B_*) — counterpart to principles

13+ B_* contracts in `pillar-0/behavioral-contracts.md` enforce AI behavior:

- B_AUTONOMY_4_CONDITIONS / B_CHECKPOINT_8_CATEGORIES (CSP carry-forwards)
- B_ATOMIC_DUAL_REGISTRATION (file + catalog atomic write)
- B_ALWAYS_GIT_LINKS (S002 turn 19 — every path is `[text](path)`)
- B_VALIDATE_BEFORE_ASSUME (S002 turn 7 + strengthened turn 15 — tool-call sandwich)
- B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK / B_CHECK_EXISTING_DECISIONS_FIRST / B_ASK_WHEN_FILLING_GAPS
- B_AI_PROFESSIONAL_VOICE (top expert colleague; banned-phrase confirmation-seeking list)
- B_BLOCKER_NO_SILENT_DROP / B_TWO_SIDED_HANDSHAKE
- B_RZF / B_CEC / B_QC_AUDIT (P-META-006 family)
- B_PROTOCOL_LITERAL_EXECUTION (S002 turn 14 — TodoWrite-transcribe + closing-template)
- B_CATCH_TO_ENGRAVING (S002 turn 15 — every catch hits 5 surfaces)
- B_FIVE_SURFACE_ENGRAVING (S002 turn 17 — P-META-007 enforcer)

## Counts at S003 close

| Surface | Count |
|---|---|
| Operating principles (P-OP-*) | 4 |
| Meta-principles (P-META-*) | 7 |
| Architecture principles (P-ARCH-*) | 27 |
| **Total principles** | **38** |
| Behavioral contracts (B_*) | 14+ |
| Spine matrix rows | 34 |
| AGENTS.md hard NOs | 30+ |
| ADRs (0001-0021) | 21 |

## How to use this snapshot

Future session opening: read this file to understand "what principles exist" before reading the canonical leaves. Each row's canonical leaf has the full text + enforcers + cross-links. This snapshot is **frozen at S003 close**; if a future session adds principles, that session writes its own principles-snapshot (per protocols.md §10.5 vault appends).
