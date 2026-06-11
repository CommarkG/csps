---
id: csps.pillar-0-governance.consolidation-audit-s082
name: CONSOLIDATION-AUDIT-S082
description: >
  Wall-to-wall consolidation audit — S082. Maps every scattered family
  across docs/plan/** + tools/** + packages/** + .claude/** + apps/**
  with debt severity, canonical-home recommendation, and consolidation
  plan. MAP ONLY — do NOT merge/delete without per-family Governor
  ratification. Also specs the recurring EQA (Elements Quality Audit).
version: "1.0"
status: draft
lifecycle: production
lifecycle_state: active
owner: group:finky
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
diataxis_type: reference
impl_status: swift-implemented
session: S082
authored_by: Sonnet S082 (Opus-19 directed)
links:
  - { rel: behavioral-contracts, href: ./behavioral-contracts.md }
  - { rel: b-consolidation-pass, href: ./behavioral-contracts/B_CONSOLIDATION_PASS.md }
  - { rel: platform-intelligence, href: ../../platform-intelligence/README.md }
  - { rel: cross-platform-spec, href: ../../platform-intelligence/CROSS-PLATFORM-EXCHANGE-SPEC.md }
---

# CONSOLIDATION AUDIT — S082

**Scope:** wall-to-wall: `docs/plan/**` + `tools/**` + `packages/**` + `.claude/**` + `apps/**`
**Method:** direct sweep — Glob, Bash find, Grep across all areas; consolidation-expert discipline
**Date:** 2026-06-09 | **PROTO:** PROTO-S082-WALL-TO-WALL-CONSOLIDATION-AUDIT
**Instruction:** MAP ONLY. Every family below requires **per-family Governor ratification** before any merge/delete. Unsupervised platform-wide merge = data loss risk.

---

## Priority Table — Scattered Families

| # | Family | Debt | Members | Canonical Home (recommendation) | Notes |
|---|--------|------|---------|----------------------------------|-------|
| 1 | Threshold | **HIGH** | 9 | `threshold-gate.md` (root) | 2 literal duplicates + 5 near-dups |
| 2 | DNA Narrative Docs | **HIGH** | 5 docs | `CSPS-DNA-MANIFESTO.md` + `dna-registry.yaml` | Overlapping; 4 should cross-ref only |
| 3 | Persona Homes | **HIGH** | 12+ | New: `pillar-5-ai-systems/PERSONAS.md` | No canonical index; SCHEDULED cluster |
| 4 | Journey Docs | **HIGH** | 15+ | `JOURNEY-DOCTRINE.md` (doctrine) + `pillar-4/developer-journey/` (reference) | CONSOLIDATION-DRAFT-S072 unratified since S072 |
| 5 | Pillar-0 Root Bloat | **HIGH** | 122 MD files | Needs sub-organization into named subdirs | Too flat; discoverability broken |
| 6 | Cross-Platform Sharing | **HIGH** | 7 outgoing only | New: `docs/platform-intelligence/` (expanded) | Zero reciprocal infrastructure |
| 7 | Index/Registry Proliferation | **MED** | ~25 registers | New: `registry-navigator.md` | No navigator for the navigators |
| 8 | Skills Split | **MED** | 24+6 skills | Keep split; add cross-nav index | .claude/skills/ ≠ packages/skills/ |
| 9 | AI Behavior Spine Fragments | **MED** | 12 files | `ai-behavior-spine.md` (root doc) | ai-behavior-spine/ dir needs README |
| 10 | Schema Overlap | **MED** | 2 files | Both kept, clearer cross-ref needed | schema-index ≠ schema-registry |
| 11 | Sandbox Drift | **MED** | 2+ | `docs/plan/_sandbox/` | threshold-wizard-v1 belongs there; related docs scattered |
| 12 | Planning Spine | **LOW** | 11 | `planning-spine/PLANNING-SPINE.md` | Well-structured already ✅ |
| 13 | Behavioral Contracts | **LOW** | shard pattern | `behavioral-contracts-GVRN/AI/ARCH/VALD/OPER.md` | Shard pattern works; minor tail-section issue |
| 14 | Audit-Runner / Hub | **LOW** | audit-runner.md + audit-hub.md | Distinct roles; naming could be clearer | Not duplicates |
| 15 | Session Artifacts | **LOW** (by design) | 79 HANDOFFs, 30 summaries | Accumulate by design | Healthy; no action |

---

## Family 1 — THRESHOLD (HIGH)

**Members (9 files in 6+ locations):**

| File | Location | Role | Duplicates? |
|------|----------|------|-------------|
| `threshold-gate.md` | `pillar-0-governance/` | Primary gate spec | Canonical candidate |
| `threshold-gate-v2.md` | `pillar-0-governance/` | v2 update | Near-dup of above |
| `threshold-deep-dive.md` | `pillar-0-governance/` | Deep-dive analysis | Extends gate spec |
| `threshold-intake-protocol.md` | `pillar-0-governance/` | Intake-side spec | Sub-concern of gate |
| `meta-platform/threshold-gate.md` | `pillar-0-governance/meta-platform/` | ⚠️ **LITERAL DUPLICATE** | Same name, different location |
| `threshold-wizard-v1.md` | `docs/plan/_sandbox/` | Wizard sandbox | Ephemeral (sandbox ✅) |
| `01-developer-threshold.md` | `pillar-4/developer-journey/` | Developer-facing step | Appropriate at this location |
| `S068-threshold-scalability-and-depth-levels.md` | `VAULT/research/` | Research doc | Appropriate at VAULT |
| `threshold-and-p-meta-023-s025.md` | `VAULT/topic-plans/` | Topic plan | Appropriate at VAULT |
| `APP-001-voice-sorting/threshold-topic-plan.md` | `docs/plan/apps/` | App-specific | App-scoped ✅ |

**Debt:** `meta-platform/threshold-gate.md` is a literal duplicate of the root one. Plus root has v2 that supersedes v1 without clear retirement. Plus threshold-intake-protocol is a sub-concern split into a separate file without cross-ref to the root gate doc.

**Canonical-home recommendation:** `pillar-0-governance/threshold-gate.md` → single canonical. Absorb v2 into it (ADD, not replace). Retire `meta-platform/threshold-gate.md` (cross-ref only). Merge threshold-intake-protocol as a section within the canonical gate doc.

**No-Orphans parent:** GVRN spine, pillar-0-governance L2.

---

## Family 2 — DNA NARRATIVE DOCS (HIGH)

**Members (5 overlapping narrative docs + 1 registry SSoT):**

| File | Location | Content |
|------|----------|---------|
| `CSPS-DNA-MANIFESTO.md` | `pillar-0-governance/` | Foundational declaration (P-META-001 class) |
| `csps-platform-dna.md` | `pillar-0-governance/` | Platform-level DNA rules |
| `csps-build-dna.md` | `pillar-0-governance/` | Build-time DNA rules |
| `dna-protocol-making-sure-that.md` | `pillar-0-governance/` | Protocol for DNA adherence |
| `ux-ui-dna.md` | `pillar-4-developer-experience/` | UX/UI-specific DNA |
| `tools/config/dna-registry.yaml` | `tools/config/` | **SSoT for DNA items (machine-readable)** |

Plus: 3 PI items (PI-031/032/033), hooks (post-stop-dna-sync-check.sh), 5 validators, 2 scripts.

**Debt:** 5 narrative docs with overlapping DNA content and no clear cross-referencing between them. A developer reading `csps-platform-dna.md` doesn't know `CSPS-DNA-MANIFESTO.md` exists as the foundational document. None of the 5 narrative docs systematically reference `dna-registry.yaml` as the machine-readable SSoT.

**Canonical-home recommendation:**
- `CSPS-DNA-MANIFESTO.md` → retains philosophical/foundational content
- `dna-registry.yaml` → machine-readable SSoT (unchanged)
- `csps-platform-dna.md` + `csps-build-dna.md` + `dna-protocol-making-sure-that.md` → consolidate into one `CSPS-DNA-REFERENCE.md` (or absorb into MANIFESTO sections) with cross-refs to registry
- `ux-ui-dna.md` → keep at pillar-4; add back-link to MANIFESTO

**No-Orphans parent:** GVRN spine, pillar-0-governance L2.

---

## Family 3 — PERSONA HOMES (HIGH)

**Members (12+ locations — SCHEDULED CLUSTER, inherits Item 5 core-spine model):**

| File | Location | Content |
|------|----------|---------|
| `NAIVE-PERSONAS-DOCTRINE.md` | `pillar-0-governance/` | Doctrine: naive persona anti-pattern |
| `meta-platform/persona-matrix.md` | `pillar-0-governance/meta-platform/` | Persona role matrix |
| `pillar-5-ai-systems/persona-composition.md` | `pillar-5-ai-systems/` | Implementation composition |
| `docs/platform-audit/ai-personas.md` | `docs/platform-audit/` | Audit-level persona profile |
| `ADR-0008` | `docs/adr/` | Arch decision: one-mastra-agent-many-personas |
| `ADR-0009` | `docs/adr/` | Arch decision: hybrid-persona-memory |
| `VAULT/research/S072-naive-personas-research.md` | `VAULT/research/` | Research input |
| `VAULT/topic-plans/s014-l2-goals-personas.md` | `VAULT/topic-plans/` | Topic plan |
| `B_NO_AI_IMPERSONATION.md` | behavioral-contracts | Contract |
| `P-ARCH-012-persona-orthogonal-to-agent.yaml` | packages/principles | Principle |
| `apps/csps-playground/platform/ai-personas/` | apps | UI page |
| `VAULT/know-how/EP-014-ai-mode-impersonation.md` | VAULT/know-how | Error pattern |

**Note:** Persona family is already registered as SCHEDULED cluster (post-concept-bar, inherits Item 5 core-spine model). Do NOT consolidate independently — follow cluster sequencing.

**Debt:** All 12+ homes exist without a canonical navigator. No single file says "persona docs live in these N places for these N reasons."

**Canonical-home recommendation (for future cluster):** Create `pillar-5-ai-systems/PERSONAS-INDEX.md` as the navigator. All other homes keep their content; index adds cross-refs. Defer to scheduled cluster.

---

## Family 4 — JOURNEY DOCS (HIGH)

**Members (15+ files, CONSOLIDATION-DRAFT unratified since S072):**

| Home | Type | Count |
|------|------|-------|
| `pillar-4/developer-journey/` (8 steps) | Developer reference | 8 files |
| `pillar-0-governance/JOURNEY-DOCTRINE.md` | Doctrine | 1 |
| `pillar-0-governance/JOURNEY-CONSOLIDATION-DRAFT-S072.md` | ⚠️ Unratified draft (9 months) | 1 |
| `apps/csps-playground/src/app/platform/journey/` | App implementation | 1 dir |
| `apps/csps-playground/src/app/platform/journey-trunk/` | App variant | 1 dir |
| `apps/csps-playground/src/app/platform/developer-journey/` | App variant | 1 dir |
| `apps/csps-playground/src/app/platform/journeys/` | App listing | 1 dir |
| `apps/csps-playground/src/app/platform/user-journey/` | User-facing app | 1 dir |
| `apps/csps-playground/src/data/journey-doctrine.json` | Generated data | 1 |
| `drafts/developer-journey.html` + `drafts/user-journey.html` | Draft HTML | 2 |
| `VAULT/user-journey-tests/UJT-001-threshold-signup-wizard.yaml` | Test | 1 |

**Critical finding:** `JOURNEY-CONSOLIDATION-DRAFT-S072.md` was authored in S072 per PROTO-S072-JOURNEY-CONSOLIDATION-DRAFT. It contains a trunk-and-branches model. It has been DRAFT status for ~9 months (9 sessions) without Governor ratification. This is not consolidation debt — it's a PENDING RATIFICATION item (a governance gap, not a duplication problem).

**Canonical-home recommendation:**
- `JOURNEY-DOCTRINE.md` → doctrine (keep)
- `developer-journey/` → developer reference sequence (keep)
- `JOURNEY-CONSOLIDATION-DRAFT-S072.md` → ratify or vault (Governor decision needed)
- App implementations → ephemeral (B_APPS_ARE_TRIALS)

**No-Orphans parent:** GVRN spine (doctrine) + OPER spine (implementation).

---

## Family 5 — PILLAR-0-GOVERNANCE ROOT BLOAT (HIGH)

**Members:** 122 `.md` files at `docs/plan/pillar-0-governance/` root

This is the most acute discoverability problem in the platform. With 122 files at the same directory level, no clear organization signals which files are:
- Canonical L1 governance (sealed)
- Reference docs
- Process docs
- Historical/superseded

**Already organized sub-directories (good patterns):**
- `planning-spine/` (11 files) ✅
- `behavioral-contracts/` (64 slices) ✅
- `audit-runner/` (26 pipelines) ✅
- `ai-behavior-spine/` (10 files) ✅
- `communication-spine/` (2 files) ✅
- `meta-platform/` (8 files) ✅

**Still flat (needs sub-organizing):**
- Threshold family (4 files)
- DNA narrative docs (4 files)
- Behavioral contracts shards (5 files: GVRN/AI/ARCH/VALD/OPER.md)
- 40+ standalone governance docs without sub-group

**Canonical-home recommendation:**
- Create `principles-governance/` for P-META-* supporting docs
- Create `dna/` for DNA narrative docs
- Create `thresholds/` for threshold family
- Move behavioral-contracts shards into `behavioral-contracts-shards/`
- Triage remaining files: classify as ACTIVE/ARCHIVED/SUPERSEDED

---

## Family 6 — CROSS-PLATFORM SHARING (HIGH)

**Members (outgoing only — zero reciprocal infrastructure):**

| File | Direction | Date | Status |
|------|-----------|------|--------|
| `CSPS-report-on-Priority-Engine-for-CSP-2026-06-03.md` | CSPS→CSP | 2026-06-03 | Sent |
| `CSPS-report-on-CIE-for-CSP-2026-06-03.md` | CSPS→CSP | 2026-06-03 | Sent |
| `CSPS-report-on-IZFC-for-CSP-2026-06-03.md` | CSPS→CSP | 2026-06-03 | Sent |
| `CSPS-report-on-AI-Profiling-for-CSP-2026-06-03.md` | CSPS→CSP | 2026-06-03 | Sent |
| `CSPS-report-on-Prevention-over-Correction-for-CSP-2026-06-03.md` | CSPS→CSP | 2026-06-03 | Sent |
| `CSPS-reply-to-CSP-PROVE-REAL-2026-06-03.md` | CSPS→CSP | 2026-06-03 | Sent |
| `CSPS-report-on-Inheritance-for-CSP-2026-06-03.md` | CSPS→CSP | 2026-06-03 | Sent |
| *Incoming from CSP* | CSP→CSPS | — | **NONE** |
| *Absorption validation* | Internal | — | **NONE** |
| *Communication template* | — | — | **NONE** |

**Debt:** This is a one-way broadcast, not a bidirectional exchange. No infrastructure for:
1. Receiving and tracking what CSP sent to CSPS
2. Validating that both platforms absorbed shared elements
3. Automatic session-summary generation of shareable artifacts
4. Template defining the communication format

**See:** [CROSS-PLATFORM-EXCHANGE-SPEC.md](../../platform-intelligence/CROSS-PLATFORM-EXCHANGE-SPEC.md) for the full design.

**Spine:** GVRN spine (platform-to-platform governance). No-Orphans parent: GVRN L1.

---

## Family 7 — INDEX/REGISTRY PROLIFERATION (MED)

**Members (~25 index/register/registry files — no navigator):**

**In `tools/data/`:**
- `gap-recurrence-register.yaml`
- `improvement-register.yaml`
- `hardwire-register.yaml`
- `satisfaction-point-registry.yaml`
- `catch-register.yaml` (planned PHASEB)
- `impact-obligation-register.yaml` (new S082)
- `ai-behavior-signals.jsonl`
- `default-correction-registry.yaml`

**In `tools/config/`:**
- `dna-registry.yaml`
- `unified-plan.yaml`
- `activation-coverage-exempt.yaml`

**In `pillar-0-governance/`:**
- `schema-index.md` (which schema canonicalizes which concern)
- `schema-registry.md` (valid schema_anchor values)
- `rule-registry.md`
- `council-registry.md`
- `moat-registry.md`
- `pe-situation-registry.md`
- `core-primitives-registry.md`
- `external-knowledge-registry.md`
- `scope-pressure-index.md`
- `session-question-register.md`
- `behavioral-contracts-index.yaml` (generated)
- `audit-runner-index.yaml` (generated)
- `ai-behavior-spine-index.yaml`

**In `VAULT/`:**
- `template-registry.md`
- `research-index.md`
- `profile-registry.yaml`

**Debt:** No navigator-of-navigators. A developer looking for "where is the register for X" has no single entry point. The ~25 registers serve genuinely distinct purposes (not consolidation targets), but they need a navigational index.

**Canonical-home recommendation:** Create `docs/plan/pillar-0-governance/registry-navigator.md` — a flat index of all registers/registries/indexes with one-line purpose statements. No content duplication — navigation only.

---

## Family 8 — SKILLS SPLIT (MED)

**Members (two homes, distinct purposes):**

| Home | Count | Purpose |
|------|-------|---------|
| `.claude/skills/` | 24 skills | Claude Code CLI skills (governance, council, build-cycle) |
| `packages/skills/` | 6 skills | Mastra application-layer skills (audit, review, wip-check) |

**Debt:** These serve DIFFERENT purposes (platform governance skills vs app-layer Mastra skills). They are NOT consolidation targets. But there's no single navigator explaining the split or how to find the right skill for a given need.

**Canonical-home recommendation:** Add `SKILLS-NAVIGATOR.md` at repo root or in `docs/` pointing to both homes with purpose differentiation. The `validate-skill-dna-alignment.mjs` validator already knows both homes.

---

## Family 9 — AI BEHAVIOR SPINE FRAGMENTS (MED)

**Members:**

| File | Home | Role |
|------|------|------|
| `ai-behavior-spine.md` | pillar-0-governance/ | Root discipline matrix |
| `ai-behavior-spine-index.yaml` | pillar-0-governance/ | Generated index |
| `ai-behavior-spine/` (10 files) | pillar-0-governance/ai-behavior-spine/ | Context subdocs |
| `behavioral-contracts-AI.md` | pillar-0-governance/ | AI-spine behavioral contracts shard |
| `ai-collaboration-charter.md` | pillar-0-governance/ | Collaboration philosophy |
| `CSPS-DNA-MANIFESTO.md` → AI behavior sections | pillar-0-governance/ | Overlapping |
| `VAULT/inner-ai-defaults/` (40+ files) | VAULT | D1-D13 defaults + profiles |

**Debt:** The ai-behavior-spine.md is the matrix/table; the ai-behavior-spine/ directory holds context docs; the VAULT/inner-ai-defaults/ holds D1-D13 defaults. All three belong to "AI behavior governance" but don't have a clear hierarchy. The ai-behavior-spine/README.md should be the navigator for all three.

**Canonical-home recommendation:** `ai-behavior-spine.md` → root; `ai-behavior-spine/README.md` → add explicit links to VAULT/inner-ai-defaults/ and to ai-collaboration-charter.md.

---

## Family 10 — SCHEMA OVERLAP (MED)

**Two files that sound like duplicates but are distinct:**

| File | What it does |
|------|-------------|
| `schema-index.md` | Answers "which schema canonicalizes which concern" — a lookup for WHAT IS THE SSoT for concept X |
| `schema-registry.md` | Catalog of valid `schema_anchor:` frontmatter enum values |

**Debt:** These sound like duplicates but are genuinely distinct — one is conceptual (what owns X?), one is mechanical (what are the valid frontmatter values?). Debt = neither file clearly explains the distinction; developers may not know which to consult.

**Fix:** Add a header note to each cross-referencing the other + explaining the distinction. LOW intervention.

---

## Family 11 — SANDBOX DRIFT (MED)

**Members:**

| File | Location | Status |
|------|----------|--------|
| `threshold-wizard-v1.md` | `docs/plan/_sandbox/` | Appropriate here |
| Threshold research + topic plans | VAULT | Appropriate here |
| `APP-001-voice-sorting/threshold-topic-plan.md` | apps/ plan | App-scoped ✅ |

**Debt:** The `_sandbox/` directory has only 1 file. This suggests either sandboxes are being created directly as ratified docs (bypassing sandbox), or completed sandboxes aren't being vaulted. `B_SANDBOX_BEFORE_IMPLEMENTATION` requires a ratified sandbox spec before code.

**Canonical-home recommendation:** `docs/plan/_sandbox/` stays. Check that all threshold/spec work in pillar-0 root went through `_sandbox/` before ratification.

---

## Families 12–15 — LOW DEBT (well-structured or by design)

| Family | Status | Notes |
|--------|--------|-------|
| Planning Spine | ✅ Well-structured | `planning-spine/` directory pattern excellent |
| Behavioral Contracts | ✅ Shard pattern | Minor: STATUS-CONSOLIDATION tail-section in GVRN shard (found S082) |
| Audit-Runner / Hub | ✅ Distinct roles | `audit-hub.md` = orchestration; `audit-runner.md` = registry. Not duplicates. |
| Session Artifacts | ✅ By design | 79 HANDOFFs + 30 closing summaries accumulate per session discipline |

---

## Consolidation Debt Score

```
consolidation_families = 15
HIGH_debt_families = 6  (threshold, DNA, persona, journey, root-bloat, cross-platform)
MED_debt_families  = 5  (indexes, skills, ai-spine, schema, sandbox)
LOW_debt_families  = 4  (planning-spine, b-contracts, audit, sessions)

consolidation_debt = 6×HIGH + 5×MED = HIGH overall
primary_risk = discoverability_failure + duplication_confusion
```

---

## EQA — Elements Quality Audit (SPEC)

> **Governor to confirm EQA meaning.** Opus proposed: **E**lements **Q**uality **A**udit = a recurring, institutionalized audit scoring consolidation-debt and scattering platform-wide on a cadence, so scattering is caught continuously (not one-off).

### What the EQA Measures

| Metric | Definition | Target |
|--------|-----------|--------|
| `scattering_index` | Count of concepts appearing in 3+ places without cross-reference | ≤ 5 (LOW debt) |
| `orphan_rate` | Artifacts without spine + canonical-home declaration (P-META-036) | 0% |
| `index_debt` | Registers/indexes without a navigator entry | ≤ 3 |
| `duplicate_count` | Literal content duplicates (same file in 2+ paths) | 0 |
| `consolidation_draft_age` | Unratified consolidation drafts in sessions | ≤ 2 (alert at 3+) |

### EQA Cadence (proposed)

| Trigger | Frequency | Scope |
|---------|-----------|-------|
| Session close | Every session | New files created this session — check for orphans + scatter seeds |
| Weekly audit | Weekly | Full cross-reference scan across pillar-0-governance/ root |
| Milestone | Every 5 sessions | Full wall-to-wall (like this S082 audit) |

### EQA Pipeline Spec (audit-runner integration — SPEC ONLY, not built)

```yaml
pipeline: consolidation-eqa
slug: consolidation-eqa
description: "Recurring Elements Quality Audit scoring consolidation-debt and scattering"
type: quality
cadence: weekly
triggers:
  - session-close (new-file check only)
  - weekly-cron
  - every-5-sessions (full sweep)
checks:
  - slug: orphan-detection
    validator: validate-no-orphans.mjs (via P-META-036)
    severity: blocking
  - slug: literal-duplicate-scan
    validator: validate-literal-duplicates.mjs (PLANNED — not built)
    severity: blocking
  - slug: consolidation-draft-age
    validator: validate-consolidation-draft-age.mjs (PLANNED — not built)
    severity: advisory (warning at 3+ sessions)
  - slug: scattering-index
    validator: validate-scattering-index.mjs (PLANNED — not built)
    severity: advisory
  - slug: index-debt
    validator: validate-registry-navigator.mjs (PLANNED — not built)
    severity: advisory
routing:
  blocking: session-close gate (post-stop-session-close-gate.sh)
  advisory: weekly digest + governor-insights
dependencies:
  - B_CONSOLIDATION_PASS
  - P-META-036 (No-Orphans Law)
  - consolidation-expert skill
```

**Note:** The EQA pipeline requires 4 new validators (literal-duplicate-scan, consolidation-draft-age, scattering-index, registry-navigator). These should be built in a dedicated PHASEB session. The consolidation-expert skill provides the manual equivalent until then.

---

## Top-Priority Consolidation Sequence (Governor ratification gates)

This is the recommended order for per-family consolidation:

1. **THRESHOLD** — highest active-debt; blocks Item 4 (threshold weave) concept work. Governor ratifies threshold-gate canonical + retires meta-platform/threshold-gate.md duplicate.
2. **CROSS-PLATFORM SHARING** — infrastructure gap; Governor confirms CSP/CSPS exchange spec.
3. **DNA NARRATIVE DOCS** — before persona + journey (DNA is foundation).
4. **JOURNEY CONSOLIDATION-DRAFT** — ratify or vault JOURNEY-CONSOLIDATION-DRAFT-S072.md (9 sessions unratified).
5. **INDEX/REGISTRY NAVIGATOR** — low intervention; creates discoverability.
6. **PILLAR-0 ROOT RE-ORGANIZATION** — major effort; schedule as a dedicated session.
7. **PERSONA FAMILY** — deferred to scheduled cluster (inherits Item 5 core-spine model).

---

*DRAFT — MAP ONLY. No merges/deletes authorized until per-family Governor ratification.*
*Authored by Sonnet S082, directed by Opus-19.*
