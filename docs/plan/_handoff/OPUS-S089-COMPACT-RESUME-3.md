---
id: csps.handoff.opus-s089-compact-resume-3
name: OPUS-S089-COMPACT-RESUME-3
description: Compaction-safe resume for the Opus tab (3rd harvest). Read FIRST after compact. Assume ZERO prior context.
version: "1.0"
owner: group:finky
authored_by: OPUS-25
core_spine: GVRN
schema_anchor: handoff_files
diataxis_type: how-to
lifecycle: production
lifecycle_state: active
status: active
ns_quality: Self-improving
precedent_checked: true
session: S089
links:
  - { rel: navigator, href: ./OPUS-S089-MASTER-COMPLETION-PLAN.md }
  - { rel: operating-discipline, href: ../pillar-0-governance/CSPS-OPUS-TAB-OPERATING-DISCIPLINE.md }
  - { rel: north-star, href: ../pillar-0-governance/CSPS-NORTH-STAR.md }
  - { rel: pipeline-seed, href: ../../../tools/data/park-register.yaml }
---

# OPUS S089 — Compaction Resume 3 (READ FIRST; assume no prior context)

## 0. WHO/STATE
You are **Opus (director)** in the CSPS repo. Governor = Yariv. Verify green at read-time is the proof — RE-RUN `node tools/verify.mjs --skip-install` (memory: gate commits, never fake-green; validate-* && commit).
Operating model NOW ADOPTED + LIVED: **one Opus tab, spawn Sonnet/Haiku AGENTS** (no paste-blocks to a separate Sonnet tab for bounded work). Discipline doc: CSPS-OPUS-TAB-OPERATING-DISCIPLINE.md. Every Agent() spawn MUST open with BOUNDARY CROSSING block + `CONTEXT-BUDGET:` line (hook blocks otherwise); paste small extracts, pointer large.

## 1. THE ACTIVE MANDATE (do this)
**BUILD the mechanical SPAWN-TRIGGER GATE + opus-agent-spawn-template** — the last gap between one-tab *practiced* and *enforced* (seed's TOP FIX). Spawn a Sonnet agent from THIS tab to build it (dogfood):
- `tools/templates/opus-agent-spawn-template.md` — the 5-element spawn shape (parallel to haiku-spawn-template): BOUNDARY+CONTEXT-BUDGET lines · ROLE/CONTEXT/TASK/CONSTRAINTS/OUTPUT+done-signal · curated-package REQUIRED-pointer checklist · coverage-manifest · Opus return format · the sealing-write resolution (agent returns verdict+seal-content, persistent tab writes the SEAL).
- `tools/validators/validate-spawn-trigger.mjs` (T2, BLOCKING) — a dispatch/SROF touching constitutional/corespine/cross-cutting/depth≥4 must cite a recorded Opus-agent verdict, else BLOCK. Scope-tiered (trivial-reversible exempt). Prove FAIL→PASS on a planted fixture. Register in verify.mjs + audit-runner.md (slug=filename stem) + `pnpm audit-runner:split`.
- FSE 5-surface (T1 hook + T2 validator + T3 memory + T4 contract + T5 AGENTS.md), committed atomically.

## 2. RATIFIED THIS SESSION (do not re-litigate)
- **North Star → Version D** (sacred, 359d5505): added outward outcome (solutions for developers+end users) + human-AI collaboration onto precision/balance core. Six Qualities + context_question UNCHANGED.
- **PLAN-PIPELINE-SPINE** (PARK-S089-PLAN-PIPELINE-SPINE, TOP): the park becomes a stateful spine (intake→triaged→planned→simulated→ratified→authorized→done) SITTING ON existing schema (goal_id, ns_quality, core_spine, lifecycle); flip the EXISTING `validate-no-implementation-without-plan.mjs` from ADVISORY→BLOCKING, scope-tiered. Goal-always-involved via ns_quality + context_question ("no answer=no mandate"). RATIFIED, awaiting build (build AFTER the spawn-trigger, or fold together).
- **One-tab operating discipline** adopted (CSPS-OPUS-TAB-OPERATING-DISCIPLINE.md). Reconciliation: fits-under-budget→PASTE, else POINTER, never the corpus.

## 3. OPEN / PARKED (un-droppable in park-register.yaml)
CANONICAL-BUILD-PROCESS (goal-screen test-drive = the ONE human gate on the Governor: csps-playground.vercel.app; releases Stage 2) · CDS-EXCHANGE-DEEPER-BUILDS (B-A verify-gate validator = biggest lever, B-C field-wiring site-resolution, B-E inherits_dna, etc.) · CDS-TEMPLATE-HUB-EXTRACTIONS (E1-E8) · CSP-SHARE-PRODUCT-PATTERNS + answer CSP 5 Q · CDS-CSE-DIRECTION (57-doc set _intake/cds/) · AGENTS-RULES-CONSOLIDATION (shrink AGENTS.md<200) · CONSEQUENCE-ESCALATION-LINE (fold into pipeline "consequential") · NORTHSTAR-7TH-QUALITY (Outcome-Serving, deferred) · operating-model Part B/C/D (model-routing.yaml, local-LLM parked, /platform/deploy) · deploy-live-page skill.

## 4. CROSS-PLATFORM (live consulting loop)
CDS (Core Driven Solutions, Gen-2) + CISEM (self-governing platform) + CSP (sibling). Convergence PROVEN: they adopted our axioms (nothing-stands-alone, no-impl-without-ratified-plan, minimum-freestyling, harvest, AI-behavior-mapping); we adopted CISEM's outward goal (North Star D) + CDS's one-tab guide. Filed outbound: CSPS-REVIEW-CDS-CONSULT-FINAL · CSPS-REPLY-CDS-8-REQUESTS · CSPS-REPLY-CDS-UMBRELLA-RECOMMENDATIONS · OPUS25-CSPS_to_CISEM_Corespiral-Approach-Critique · umbrella-council-consult-synergy-PE prompt · Founding-Node-axioms. Sharing tracked: CSP-CSPS-SHARING-LEDGER.md. Corespiral def (link-safe): docs/plan/_intake/cds/corespiral-0070-definition.md.

## 5. HARD-WON NUANCES (do not relearn the hard way)
- **Freestyling caught + cured:** navigate by ratified plan, not latest input. Nothing consequential without a ratified plan (the pipeline). Goal always involved.
- **VERIFY-GATE:** never accept a sub-agent/Sonnet "done" on self-report — re-derive from GROUND TRUTH (grep/verify), especially numeric/headline claims. I caught a missing impl_status + wrong-commit provenance this way.
- **Green-receipt circular deadlock:** after a commit, receipt goes stale → verify exit 1. Bootstrap ONLY when it's the sole failure (patch tree_hash to current index, exit_code:0, re-verify); NEVER fake-green over a real red.
- **park-register YAML:** ONE `rejected:` key per decision_ledger (I broke it 2× with duplicates). `validate-park-register && commit`.
- **Links:** copy files whose folder has spaces/em-dashes to a clean ASCII path BEFORE giving a clickable link.
- **Haiku vision:** Agent(haiku)+image fails silently — SDK direct, not Agent tool.
- **classification-golden-set.yaml churns every verify** → `git checkout --` it before commit.

## 6. DECISION LEDGER
- CHOSEN: one dense resume file covering state+mandate+parks+nuances; push for durability.
- REJECTED: rely on post-compact context (assume none) OR scatter across chat (lost on compact).
