---
id: csps.platform-audit.spine.vald
name: spine-VALD
description: >
  Domain card for the VALD (Validation) Core Spine. VALD governs how the platform
  proves it works — 41 active validators, 3 ZF levels, 13 audit pipelines, 4 escalation
  ladders, and the evidence discipline that makes every DONE claim trustworthy.
  Second highest precedence spine (after GVRN).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: platform_audit
enforcement_stage: active
template_used: domain-card
template_version: "1.0"
tags:
  - domain:governance
  - domain:audit
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S018
links:
  - { rel: parent, href: ../README.md }
  - { rel: implementation, href: ../../../../tools/validators/ }
  - { rel: audit-runner, href: ../../../plan/pillar-0-governance/audit-runner.md }
  - { rel: audit-hub, href: ../../../plan/pillar-0-governance/audit-hub.md }
  - { rel: zf-protocol, href: ../../../plan/pillar-0-governance/zf-mandate-protocol.md }
consolidation_cross_refs:
  - tools/verify.mjs
  - tools/zf-orchestrator.mjs
  - docs/plan/pillar-0-governance/audit-runner.md
  - docs/plan/pillar-0-governance/audit-hub.md
---

# VALD — Validation Spine

## §1 Identity

**What I am:** The evidence layer of CSPS. I define what "proof" means and ensure that every DONE claim is backed by actual validator output from this session — not memory, not assumption.

**Core spine position:** VALD (2nd highest precedence, after GVRN). VALD governs evidence; GVRN governs decisions. A GVRN decision without VALD evidence is a wish.

**Who I am part of:** Platform-level. I gate every phase, every session close, every ratification.

**My sub-parts:**
- 41 Active Validators (pnpm verify, exit_code 0)
- 18 Proposed Validators (ratified S018, enforcement_stage: planned/week-4)
- ZF Orchestrator (3 levels: advisory → phase gate → session deep)
- Audit-Runner (59 pipeline slugs across 13 pipelines)
- Audit-Hub (orchestration layer above audit-runner)
- Pre-Close Verification Gate (§10.0 mandatory before any session close)
- Escalation Ladders (4 ladders governing resource escalation)

---

## §2 The Problem I Solve

**Without VALD:** Platform quality is aspirational, not measured. DONE means "I think it's done." Validators pass because nobody ran them. ZF gates are timestamps, not proofs. Technical debt accumulates invisibly — each feature builds on an unverified foundation.

**The nominal ZF failure mode:** AI claims ZF achieved by touching timestamp. Hook runs but returns cached result. Validator output is from last session. This is the primary structural failure mode that VALD prevents.

**What breaks specifically:**
- Production incidents caused by code that "passed" validators because validators weren't run
- Architectural drift where existing patterns silently diverge (slice-freshness violations)
- Cross-tenant data exposure from ZModel ↔ Prisma drift (drift validator didn't run)

---

## §3 My Principles

**Foundation principles:**
- `P-META-006` — Zero-Findings: no DONE without THIS-SESSION evidence. Memory is not proof. **Re-run is NECESSARY but NOT SUFFICIENT — THE LAST RUN AT ZERO BLOCKING FINDINGS IS THE ONLY PROOF.** Progress toward zero is not zero. (INST-VALD-001)
- `P-META-008` — Pre-Close Verification: pnpm verify must run before any session close claim

**Key behavioral contracts:**
- `B_VALIDATE_BEFORE_ASSUME` — every state claim cites a tool call in this response
- `B_PRE_CLOSE_VERIFICATION` — §10.0 verification block mandatory; nominal ZF = structural failure

---

## §4 How I Work

**Depth 1 — Executive view:**
`pnpm verify` runs 41 validators and exits 0 if all pass. ZF orchestrator runs at 3 levels: Level 1 (per-phase advisory), Level 2 (phase gate — required before phase advance), Level 3 (session deep — required before session close). The pre-close verification gate (§10.0) mandates that Level 3 ZF ran with THIS-SESSION evidence before signing any closing summary.

**Depth 2 — Operational view:**
The 41 validators cover: TypeScript typecheck, principle/contract/behavior slices sync, frontmatter validity, AAP frontmatter, corespine compliance, model tier currency, AI defaults freshness, catch completeness, council coverage, universal alignment, import quarantine, nothing-stands-alone, moat coverage, plan progress, git pushed state, bedrock completion, phase exit criteria, VLT blocking, open plan levels, slice freshness, audit slug coverage, audit health, and the foundation schema drift (Cycle 41, ZenStack). The ZF orchestrator runs these in cycles, iterating until 0 BLOCKING findings remain.

**Depth 3 — Implementation view:**
- `tools/verify.mjs` — orchestrates all 41 cycles sequentially
- `tools/zf-orchestrator.mjs --level 1|2|3` — runs ZF at the specified depth
- Level 1: runs verify + surfaces advisories (1-3 cycles)
- Level 2: runs verify + VLT check + phase exit criteria (3-5 cycles)
- Level 3: full suite + extraction check + PE questions (5 cycles, BLOCKING gate)
- `tools/verify-last-run.md` — structured JSON output for every verify run
- `tools/validate-token-budget-last-run.json` — token cost tracking (week-4)

---

## §5 Dependencies & Blast Radiuses

**What I depend on:**
- GVRN (ZF mandate comes from GVRN; I provide the evidence GVRN requires)
- ARCH (schema drift validator is VALD's enforcement of ARCH correctness)
- OPER (git-pushed-state validator enforces OPER zero-laptop discipline)
- Platform Services: QC/Audits (the 41 validators ARE the QC/Audits service)

**Blast Radiuses:**
- **BR1 (element-level):** Adding one validator — affects one specific check
- **BR2 (domain-level):** Changing a ZF level requirement — affects all sessions using that level
- **BR3 (platform-wide):** Changing the pre-close verification gate — affects every session close, every DONE claim across all 30 apps

---

## §6 Personas

**Default persona — Evidence Auditor:**
Runs validators before claiming anything. Never says "this should work" — proves it works. Reads the actual validator output. Cites specific validator results.

**Sub-personas:**
- **ZF Orchestrator:** Runs multi-cycle ZF at the appropriate level; stops when 0 BLOCKING
- **Pre-Close Verifier:** Runs §10.0 gate before any session close; blocks nominal ZF
- **Audit Registrar:** Registers new audit slugs atomically in audit-runner.md when validators are added

**AI behavior in VALD domain:**
- *Spine-level:* Every validator output is cited with actual results, not summarized from memory
- *Platform-level:* VALD evidence is required by GVRN; it's not optional
- *VALD-unique:* Escalation from advisory to blocking is the primary VALD escalation trigger — advisory warnings that persist across 3 cycles promote to blocking automatically

---

## §7 Human Journeys

**Developer journey:**
1. Write feature → commit
2. `pnpm verify` → all 41 pass or fix failures
3. If phase boundary: `pnpm zf:phase` (Level 2)
4. Before session close: `pnpm zf:deep` (Level 3) — must achieve with 0 BLOCKING
5. Read verify-last-run.md for structured evidence block

**External advisor journey:**
1. Run `pnpm verify --skip-install` to see current platform health
2. Read verify-last-run.md for complete structured output
3. Review advisory warnings for improvement opportunities
4. Use audit-hub.md to understand pipeline structure

---

## §8 Vocabulary

**Terms I own:**
- `ZF (Zero-Findings)` — the evidence standard: 0 BLOCKING, advisories tracked
- `RZF (Re-Zero Findings)` — re-run IS the proof; cached results are not evidence
- `Nominal ZF` — the failure mode: ZF claimed without actual validator run
- `BLOCKING` — a validator finding that prevents phase advance or session close
- `Advisory` — a warning that is tracked but doesn't block; promotes to blocking on pattern
- `Cycle` — one complete validator suite run within ZF orchestration

**Terms I use:**
- `P-META-006` — from GVRN (the mandate that makes ZF non-optional)
- `IMPL_BATCH boundary` — from AI spine (where compact happens, where verify runs)
- `enforcement_stage` — from GVRN (stub validators don't block; active ones do)

---

## §9 MCP Surface

```
get_validator_status("validator-name")     → current pass/fail + last-run evidence
get_zf_level("1|2|3")                     → requirements for that ZF level
get_audit_pipeline("pipeline-number")     → slugs in that pipeline + cadence
get_advisory_warnings()                   → current non-blocking findings
find_by_spine("VALD")                     → all VALD-governed elements
```

---

## §10 Current State & Evolution

**Implemented today (enforcement_stage: active
template_used: domain-card
template_version: "1.0"):**
- 41 active validators in pnpm verify (exit_code 0)
- ZF orchestrator (3 levels: pnpm zf / pnpm zf:phase / pnpm zf:deep)
- 13 audit pipelines (P1-P13) in audit-hub.md
- Pre-close verification gate (§10.0 in closing-summary-template)
- 4 escalation ladders defined (context pressure, blocking event, task complexity, blast radius)

**Proposed validators (enforcement_stage: planned/week-4):**
- `vocabulary-canon-completeness` (P11) — meta-terms in vocabulary.md
- `file-complexity-threshold` (P8) — dual-gate split threshold
- `learning-loop-coverage` (P5) — catch-to-engraving completeness
- `extraction-check` promotion to BLOCKING (P5) — currently advisory
- `threshold-completeness` (P13) — session-open sequence verified
- 13 more (see audit-runner.md for full list)

---

## §11 Connection Map

| Connected to | How |
|---|---|
| GVRN | GVRN mandates ZF; VALD provides the evidence; without both, governance is decoration |
| ARCH | VALD Cycle 41 validates ARCH schema drift; ZF gate required on schema changes |
| AI | AI behavior compliance is validated by VALD; B_TOKEN_BUDGET enforcement tracked |
| OPER | Session-close requires VALD Level 3 before handoff write; git-pushed-state is VALD |
| QC/Audits | VALD IS the QC/Audits service; every audit slug is a VALD artifact |
| GVRN: Escalation Ladders | When VALD finds BLOCKING, Ladder 2 (Blocking Event) fires → emergency-mode PE |
