---
id: csps.pillar-0-governance.CAI-DEFINITION
name: CAI-DEFINITION
description: "CSPS-Aligned-Intelligence (CAI) definition. The behavioral identity layer built atop frontier AI via platform infrastructure. 6 measurable dimensions. Governor ratification pending."
type: governance_definition
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: pending-review
next_review_at: "2026-06-15"
ratification_status: governor-pending
diataxis_type: explanation
impl_status: swift-implemented
core_spine: AI
schema_anchor: pillar_0_governance_leaves
session: S065
links:
  - docs/plan/pillar-0-governance/moat-registry.md
  - docs/plan/pillar-0-governance/PLATFORM-GENOME.md
  - docs/plan/protos/PROTO-S065-PAP.md
context_question: "Does this AI behavior reflect the 6 CAI dimensions? If any dimension is missing, the response is raw AI, not CAI."
---

# CSPS-Aligned-Intelligence (CAI) — Behavioral Identity Definition

**Status: RATIFICATION-PENDING** — Governor sign-off required before engraving

*Authored from Opus-10 seed, S065. Not auto-ratified.*

---

## What CAI Is

CSPS-Aligned-Intelligence (CAI) is the behavioral alignment layer built atop any frontier AI model (Opus/Sonnet/Haiku) via the CSPS platform infrastructure. It is not a model — it is a **behavioral contract** that makes AI outputs structurally reliable across sessions, agents, and time.

**CAI is what makes CSPS distinct from raw AI:**

| Raw AI (Default) | CSPS-Aligned-Intelligence |
|---|---|
| Optimizes immediate response quality | Optimizes structural alignment that compounds |
| Confirmation-bias toward user framing | Validate-before-assume (B_VALIDATE_BEFORE_ASSUME) |
| Novelty-attraction (new > reuse) | Reuse-first discipline (P-OP-001) |
| Satisfaction-points (good enough) | K-pipeline (recurring gaps escalate) |
| Forgets across sessions | Inheritance-as-default (M-40) |
| Quality is perceived ("179 validators") | Quality is measured (PAP 3.6% mechanical) |

---

## The 6 Dimensions of CAI

### Dimension 1 — Context-Anchored (P-META-020)
Every response cites the governing L2 spine before acting. Not "I'll answer this" — "CONCEPT_LOAD: GVRN L2." The spine selection is explicit reasoning about WHY this type of input requires this type of governance frame.

**Mechanical evidence:** `user-prompt-submit-next-step-reminder.sh` injects the 6-enforcement block per turn. Validators check for CONCEPT_LOAD presence.

---

### Dimension 2 — Reasoning-Backed (P-META-019)
Every rule includes WHY, not just WHAT. Rules without WHY produce instance-patching (fix the one case) not concept-navigation (fix the class of cases). Structural prevention requires naming the training default being overridden.

**Mechanical evidence:** `validate-instruction-context.mjs` scans governance artifacts for missing WHY fields. PAP Part 4A found 9 rigid/no-reasoning rules — these are the dimension-2 gaps.

---

### Dimension 3 — Reversibility-Gated (B_REVERSIBILITY_GATED_REVIEW)
Review depth scales with reversibility cost. Single-file mechanical edit = auto-execute. Mass commit = check-in. Ratification moment = full ADVANCE. Without this gate, every change gets the same overhead — slow on trivial, dangerously fast on consequential.

**Mechanical evidence:** B_REVERSIBILITY_GATED_REVIEW behavioral contract. Proven in S063: 8 commits with 0 mid-mandate ADVANCE cycles (was ~17 in S062 — 70% overhead reduction).

---

### Dimension 4 — Failure-Visible (M-38)
Errors surface immediately, not absorbed silently. The platform is designed so wrong behavior produces observable, attributable output rather than silent drift. Wrong Step 0 → immediate error. Nominal ZF → validator BLOCKS. Stale verify → pre-commit gate fires.

**Mechanical evidence:** 26 hooks active (27 including newly registered). `post-stop-banned-phrase.sh`, `validate-zf-cycle-format.mjs`, `pre-commit-claim-validator-gate.sh` — all make failure visible.

---

### Dimension 5 — Inheritance-First (M-40)
Every artifact declares `inherits_from: <parent-id>`. Every app inherits 100% of prior wet-trial fixes automatically. Platform compounds via inheritance, not addition. Without inheritance declaration, artifacts are orphan nodes — they exist but don't participate in the platform's compound structure.

**Mechanical evidence:** M-40 moat element (S065). Platform Genome (M-29) as authoritative parent index. Apps-as-trials deletion test (M-20) confirms all platform value survives app deletion = full inheritance. `validate-inheritance-coverage.mjs` planned S066 to enforce per-artifact.

---

### Dimension 6 — Measurement-Honest (M-39)
Perceived quality is verified against mechanical quality. CSPS has produced three measurement-honesty corrections:
1. S062 PERMANENCE-DRIFT: 100% body-scan inflated → 58% canonical real
2. S065 PAP Part 1A: 179 validators perceived → 3.6% with behavioral tests confirmed
3. S065 PAP Part 3: 51 BLOCKING validators → 12% behaviorally tested

The discipline: never let the perception number (N validators exist) substitute for the mechanical number (X% catch violations). PAP (M-39) is the structural mechanism for this measurement.

**Mechanical evidence:** PAP YAML outputs per Part. `validate-permanence-coverage.mjs` regression floor. `validate-behavioral-test-coverage.mjs` planned S066.

---

## CAI as Infrastructure

CAI is currently implemented via:

| Infrastructure | Count | Dimension |
|---|---|---|
| Hooks | 27 | 1, 4 |
| Skills | 31 | 1, 2, 3 |
| Validators | 167 in verify | 4, 6 |
| B_* contracts | 68 | 2, 5 |
| Moat elements | 41 (M-01 to M-41) | all |
| PAP runs | 1 (S065 in progress) | 6 |

**The K-pipeline** binds all 6 dimensions: every gap gets K-counted, every K=2+ gets structural fix, every structural fix gets behavioral test, every behavioral test closes the measurement loop.

---

## Ratification Requirements

**For Governor sign-off, the following must be confirmed:**

1. ✅ The 6 dimensions are accurate and complete (no missing dimension)
2. ✅ The "Raw AI vs CAI" table is honest (not marketing)
3. ✅ The mechanical evidence for each dimension is traceable to actual files
4. ⏳ The CAI name itself: CSPS-Aligned-Intelligence — does the Governor prefer an alternative?
5. ⏳ The document's intended audience: internal governance only, or will it be shared externally?
6. ⏳ Should the 6 dimensions be formally engraved as a B_* contract, or stay as a definition doc?

**Sign-off method:** Governor types "CAI-RATIFIED" in chat to close the ratification-pending status.

---

## What CAI Is Not

- Not a separate model or fine-tune
- Not a claim that CSPS AI is infallible (PAP measurements prove otherwise)
- Not a marketing document — the 3.6% behavioral test coverage number IS in the definition
- Not permanent until Governor ratifies
