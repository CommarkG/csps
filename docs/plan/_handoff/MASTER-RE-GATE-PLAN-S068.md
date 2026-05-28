---
id: csps.handoff.MASTER-RE-GATE-PLAN-S068
name: MASTER-RE-GATE-PLAN-S068
description: "Governor-ratified S068 re-gate master plan. 8 parts covering: (1) Substrate Reconciliation + NodeFile contract + Threshold place-not-found path; (2) Threshold Complete; (3) Product Schema + 3-Layer Profile-Product; (4) Governance Constitution absorption (10 doctrines); (5) Question Placement Schema; (6) Page-Type Templates (10 archetypes); (7) Frictionless Onboarding; (8) Developer's Journey re-completion. Each part: existing-vs-new analysis + consolidation map + ratified Q1-Q10 defaults applied + enterprise-Dewey naming + 5-persona pre-PROTO review. Apps blocked until 4 preconditions + page-templates land."
type: handoff_files
protection_level: protected
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S068
authored_by: Opus-12
date: 2026-05-28
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, VALD, OPER]
schema_anchor: handoff_files
inherits_from: "CORE-COMPLETE-EXIT-CRITERIA.md (S055 ratified, supersession block to be added) + Governor uploads [[00-INDEX]] (4 docs) + S067 wave [[PROTO-S067-MASTER-THRESHOLD-ROUTER]] + Q1-Q10 ratified S068"
links:
  - rel: governor-uploads
    href: VAULT/governor-uploads/S068/00-INDEX.md
  - rel: prior-gate
    href: ../pillar-0-governance/CORE-COMPLETE-EXIT-CRITERIA.md
  - rel: s067-wave
    href: ../protos/PROTO-S067-MASTER-THRESHOLD-ROUTER.md
  - rel: parked-app
    href: ../protos/PROTO-S068-CONNECTOR-WET-TRIAL.md
context_question: "Which of the 8 parts is currently active? Have all preceding parts passed their DONE-WHEN? Apps remain BLOCKED until PART 1-8 ratified + 4 preconditions verified."
---

# MASTER RE-GATE PLAN — S068

**Governor-ratified S068 — supersedes/raises the bar of [CORE-COMPLETE-EXIT-CRITERIA.md](../pillar-0-governance/CORE-COMPLETE-EXIT-CRITERIA.md) (S055).**

**Hard gate:** Apps remain BLOCKED until ALL 8 parts pass DONE-WHEN.

**Ratified inputs (S068):**
- 4 Preconditions: Threshold complete / Frictionless onboarding / Developer's Journey complete / Product Schema created (Governor turn re-gate)
- Q1: Pillar-1 duplicate fixed by renaming `pillar-1-product` → `pillar-7-product`
- Q2: Routing axis = Core Spines (5) + Pillars (8) as content groupings — Spines route, Pillars group
- Q3: "AI cannot autonomously modify schema" — Governor-ratified AI authoring permitted
- Q4: Retrofit scope = CORE + L1/L2 + pillar headers (~30 files) in S068; instances later
- Q5: Mini-tree numbering = Dewey-style `<SPINE>.<NN>.<ARTIFACT>.<PART>` (e.g. `GVRN.01.B_HUMBLE.001`)
- Q6: Vault-per-node = lazy-instantiate on first vault write
- Q7: Pending-node process = `tools/data/pending-nodes.yaml` + Opus-review-queue + weekly cron
- Q8: Sequencing = Threshold-first → NodeFile contract → 3-Layer Profile-Product (per Governor priority)
- Q9: 5 personas pre-PROTO = cruel-critic + balance-expert + bottleneck-expert + consolidation-expert + schema-expert
- Q10: Verify fixed at commit `0ac4a57b` (was my PROTO missing DONE WHEN + ZF gate)

---

# Overview — 8 Parts, Sequenced

```
PART 1 — SUBSTRATE RECONCILIATION + NodeFile Contract + Pending-Nodes
       ↓ (substrate ready)
PART 2 — THRESHOLD COMPLETE (Condition #1 — first priority)
       ↓ (router routes everything to a "place")
PART 3 — PRODUCT SCHEMA + 3-Layer Profile-Product (Condition #4)
       ↓ (data spine exists)
PART 5 — QUESTION PLACEMENT SCHEMA (questions as governed objects)
PART 6 — PAGE-TYPE TEMPLATES (10 archetypes — the missing productive layer)
       ↓ (productive surface exists)
PART 4 — GOVERNANCE CONSTITUTION (10 doctrines engraved)
       ↓ (governance complete)
PART 7 — FRICTIONLESS ONBOARDING (Condition #2)
PART 8 — DEVELOPER'S JOURNEY RE-COMPLETION (Condition #3)
       ↓
GATE PASSED → apps may begin development
```

**Note:** PART 5 + PART 6 + PART 4 are parallel-eligible after PART 3 lands. PART 7 + PART 8 are sequential after PART 4 lands.

---

# PART 1 — SUBSTRATE RECONCILIATION

**Purpose:** Fix the foundational inconsistencies that block everything else. Pillar numbering, spine-vs-pillar routing axis, NodeFile contract spec, pending-nodes register.

**Owner:** Opus-12 (design) + Sonnet-13 (mechanical migrations) | **Gate tier:** full-advance | **Estimated scope:** ~6 files + ~30 file-frontmatter migrations.

### Existing CSPS Artifacts (Reuse + Enhance)

| Asset | Path | Action |
|---|---|---|
| Core Spines doctrine | [.claude/core-spines/](.claude/core-spines/) — L1+L2+L3 (28 files) | KEEP; canonical 5-spine routing axis |
| Pillars structure | [docs/plan/pillar-*](docs/plan/) (8 dirs, pillar-1 duplicate) | RENAME `pillar-1-product` → `pillar-7-product`; update all inbound references |
| Frontmatter standard | applied across ~647 governance files (per validate-context-questions) | EXTEND with 8 new NodeFile fields |
| schema_anchor field | already routes to entity classes | KEEP; document as canonical pipeline field |
| inherits_from (M-40) | required on every new artifact | KEEP; already 100% on new files |
| PLATFORM-GENOME.md (M-29) | the permanent index | EXTEND to include NodeFile registry |
| pending-plan-items.yaml | K≥2 auto-drafts of plan items | GENERALIZE to pending-nodes (any unmatched artifact) |

### New (Created)

| Artifact | Why |
|---|---|
| `docs/plan/pillar-0-governance/NODEFILE-CONTRACT.md` | Canonical contract: 8 new required fields + 8 self-identification questions + mini-tree expansion + vault attachment + internal-parts taxonomy |
| `docs/plan/pillar-0-governance/SPINE-PILLAR-MAP.md` | Reconciliation: 5 Core Spines = routing axis; 8 Pillars = content groupings; explicit map |
| `tools/validators/validate-nodefile-compliance.mjs` | ADVISORY S068 → BLOCKING S069 |
| `tools/data/pending-nodes.yaml` | Generalized pending register (any unmatched artifact from threshold) |
| `.claude/hooks/pre-tool-use-nodefile-required.sh` | Hook enforcing NodeFile contract on new artifact creation |
| Behavioral test: `tools/tests/behavioral/nodefile-contract-test.sh` | 3 inputs: (A) compliant→pass / (B) missing fields→advisory / (C) S069 blocking → fail |

### Consolidation Opportunities

- The frontmatter standard ALREADY answers 6/8 self-identification questions. Only 2-3 new fields needed (services_offered_to / cie_connection / pe_connection / unique_addition / mini_tree_ref / vault_ref / internal_parts / depth). Don't rewrite frontmatter; ADD.
- `pending-plan-items.yaml` is a partial pending-nodes register; generalize the schema, don't replace.
- The 28 L1/L2/L3 core-spines files are ALREADY hierarchical Dewey-eligible. Apply numbering to existing structure, don't recreate.

### DONE WHEN

- [ ] Pillar-1 duplicate fixed (`pillar-1-product` → `pillar-7-product`); validate-nothing-stands-alone passes
- [ ] [NODEFILE-CONTRACT.md](docs/plan/pillar-0-governance/NODEFILE-CONTRACT.md) authored + ratified
- [ ] [SPINE-PILLAR-MAP.md](docs/plan/pillar-0-governance/SPINE-PILLAR-MAP.md) authored + ratified
- [ ] validate-nodefile-compliance.mjs scans 647 governance files; ADVISORY mode
- [ ] pending-nodes.yaml created + generalized from pending-plan-items.yaml
- [ ] Hook installed; verify-hooks-functional shows 68 hooks (was 67)
- [ ] Behavioral test 3/3 passes
- [ ] verify --strict exit_code=0 at SEAL commit

### ZF gate

ZF Cycles cite: each new file path + behavioral test exit codes + hooks-count check + frontmatter-migration count (target ~30 files retrofit at L1/L2/pillar-headers level).

---

# PART 2 — THRESHOLD COMPLETE (Condition #1)

**Purpose:** Every input the platform receives routes to a deterministic `{pipeline, corespine, place}`. No silent drops. No freestyling. Every council skill mechanically invoked with trigger rules. "Place not found" → instantiate pending-node via process.

**Owner:** Sonnet-13 (build) + Opus-12 (audit) | **Gate tier:** full-advance.

### Existing CSPS Artifacts (Reuse + Enhance)

| Asset | Path | Action |
|---|---|---|
| Threshold-router | [tools/scripts/threshold-router.mjs](tools/scripts/threshold-router.mjs) (M-42 built S067) | EXTEND — add place-not-found path |
| Threshold-classify | [tools/scripts/threshold-classify.mjs](tools/scripts/threshold-classify.mjs) | KEEP; verify 4-axis exhaustive |
| Council dispatcher | [tools/scripts/council-invocation-dispatcher.mjs](tools/scripts/council-invocation-dispatcher.mjs) | EXTEND — assert all 31 skills have trigger rules + ≥1 inaugural invocation |
| Threshold intake log | [tools/data/threshold-intake-log.yaml](tools/data/threshold-intake-log.yaml) | KEEP; assert ≥1 entry per input class within last 7 days |
| Council invocation log | [tools/data/council-invocation-log.jsonl](tools/data/council-invocation-log.jsonl) | KEEP |
| validate-threshold-routing-coverage | exists per S067 | RUN; gap-fill any uncovered input classes |

### New (Created)

| Artifact | Why |
|---|---|
| `libs/policies/slices/public/threshold-event.zmodel` | DB-side spine for threshold events (currently jsonl only — not in DB) |
| `libs/policies/slices/public/council-invocation.zmodel` | DB-side spine for council invocations |
| Place-not-found → pending-node workflow in threshold-router | Q7 ratified |
| `tools/validators/validate-threshold-exhaustive.mjs` | Asserts no input class has `default-fallback-to-unhandled` |
| Behavioral test: `threshold-exhaustive-routing-test.sh` | Feed 1 synthetic input per class; assert correct routing |
| Output-closure validator | Zero silent-drop events |

### Consolidation Opportunities

- threshold-event + council-invocation are currently jsonl files. **Migrate to DB without deleting jsonl** (parallel-write during transition; jsonl stays as fallback).
- Existing validate-threshold-routing-coverage covers ROUTING; new validate-threshold-exhaustive covers PLACE-FINDING. Two distinct concerns; don't conflate.
- council-invocation-dispatcher.mjs may already invoke skills correctly; verify before extending.

### DONE WHEN

- [ ] Threshold-router exits 0 with `{pipeline, corespine, place}` for ALL input classes (inventory all class names)
- [ ] Place-not-found path: writes to pending-nodes.yaml + Opus-review-queue
- [ ] threshold-event + council-invocation entities exist in libs/policies; ZenStack generate passes
- [ ] All 31 skills have trigger rules + audit-runner row + ≥1 inaugural log entry
- [ ] Behavioral test passes for every input class
- [ ] Output-closure validator: silent-drops=0
- [ ] verify --strict exit_code=0

### ZF gate

Cycles cite: each input class verified + each skill trigger verified + jsonl-to-DB parity check + pending-nodes write test.

---

# PART 3 — PRODUCT SCHEMA + 3-LAYER PROFILE-PRODUCT (Condition #4)

**Purpose:** The data spine for "anything that goes through the threshold lands in a Product." Plus the 3-layer Profile→Product governance per Governor Doc 02.

**Owner:** Sonnet-13 (build) + Opus-12 (architecture) + Governor (Layer-field ratification) | **Gate tier:** full-advance | **Scope:** ~7 files + playground page.

### Existing CSPS Artifacts (Reuse + Enhance)

| Asset | Path | Action |
|---|---|---|
| 11 schema entities | [libs/policies/slices/public/](libs/policies/slices/public/) | KEEP; Product joins them |
| Base mixin | [libs/policies/base.zmodel](libs/policies/base.zmodel) | Product extends Base |
| Tenant + User + UserTenant | exist | Product is tenant-scoped via existing pattern |
| AuditEvent (append-only) | exists | REUSE for Layer 3 contract change audits — don't duplicate |
| ExternalInput | exists | Likely overlaps with Layer 2 Intelligence; map carefully |
| LearningLoopItem | exists | Likely overlaps with shadow-profile correction history |
| B_PIE_READINESS_GATE | exists | GENERALIZE to B_PROMOTION_GATE_DISCIPLINE (Doc 02 §10) |
| pageDNA pattern | exists across all playground pages | Source-tracking precedent for feature flag source field |

### New (Created)

| Artifact | Why |
|---|---|
| `libs/policies/slices/public/product.zmodel` | The Product entity (the missing data spine) |
| `libs/policies/slices/public/profile-layer-1-identity.zmodel` | Deterministic identity & routing (Doc 02 §5) |
| `libs/policies/slices/public/profile-layer-2-intelligence.zmodel` | Probabilistic intelligence (Doc 02 §6) |
| `libs/policies/slices/public/profile-layer-3-config-contract.zmodel` | Versioned configuration contract (Doc 02 §7) |
| `apps/csps-playground/src/app/platform/architecture/schema/page.tsx` | Live schema page (under Architecture submenu per Governor decision) |
| `apps/csps-playground/src/app/platform/architecture/schema/[entity]/page.tsx` | Per-entity detail view |
| `docs/plan/pillar-0-governance/behavioral-contracts/B_PROMOTION_GATE_DISCIPLINE.md` | Generalized from B_PIE_READINESS_GATE |
| `tools/validators/validate-product-schema-coverage.mjs` | Every `apps/*/` has a Product row; every entity has a TopNav schema page entry |

### Consolidation Opportunities

- **ExternalInput entity** likely overlaps with Layer 2 inferred_attributes. Map: ExternalInput captures the RAW signal; profile-layer-2-intelligence captures the INFERRED attribute derived from N signals. Different entities; one feeds the other.
- **LearningLoopItem** likely overlaps with profile-layer-2 enrichment_history + contradiction_flags. Map: LearningLoop is the cross-platform learning; profile-layer-2 enrichment is per-tenant.
- **AuditEvent** is the canonical audit entity — Layer 3 audit/diff (Doc 02 §13) REUSES it; do NOT create a separate audit table.
- **B_PIE_READINESS_GATE** is the existing Promotion Gate pattern; generalize it; don't create a parallel B_*.

### Product Entity Field List (proposed — Governor ratifies)

```
model Product extends Base {
  tenantId            String   @db.Uuid
  name                String
  domain              String   @default("uncategorized")   // sales / debt-collection / voice-sorting / etc
  owner_user_id       String?  @db.Uuid
  lifecycle           String   @default("intake")           // intake/draft/ratified/active/deprecated
  threshold_pass_history  Json?      // array of ThresholdEvent ids
  onboarding_spec_ref     String?    // path to spec doc
  dev_journey_spec_ref    String?    // path to journey doc
  component_a_app_ref     String?    // apps/* path
  component_b_extraction_ref  String?  // libs/* path
  wet_trial_evidence_ref  String?
  alignment_questions     Json?
  prevention_class_history  Json?
  related_validators_count  Int   @default(0)
  related_hooks_count       Int   @default(0)
  status              String   @default("intake")
  
  tenant              Tenant   @relation(...)
  audit_events        AuditEvent[]  @relation(...)
  
  @@allow('all', auth() != null && auth().tenantId == tenantId)
}
```

### DONE WHEN

- [ ] Product entity exists; ZenStack generate passes
- [ ] 3 Layer profile entities exist; Layer 1 has @@deny on AI-update; Layer 2 is @@append-only; Layer 3 is semver-versioned
- [ ] `/platform/architecture/schema` page lives + linked from TopNav under Architecture
- [ ] `/platform/architecture/schema/[entity]` per-entity detail works for all 14 entities (11 existing + Product + ThresholdEvent + CouncilInvocation)
- [ ] 8 existing apps have retroactive Product rows
- [ ] validate-product-schema-coverage: blocking=0
- [ ] Orphan [arc/schema/index.html](apps/csps-playground/arc/schema/index.html) either wired or deleted (EXISTS≠ACTIVE — Governor decides)
- [ ] B_PROMOTION_GATE_DISCIPLINE engraved at FSE 5/5
- [ ] verify --strict exit_code=0

### ZF gate

Cycles cite: each entity migrated/created + schema page render check + 8 retroactive Product rows + Promotion Gate test.

---

# PART 4 — GOVERNANCE CONSTITUTION (10 Doctrines)

**Purpose:** Absorb Governor Doc 04 — 10 doctrines (A-J) — and ratify each as either a new B_* contract OR mapped onto existing CSPS artifact (preserve before create).

**Owner:** Opus-12 (mapping) + Governor (per-doctrine ratification) | **Gate tier:** full-advance | **Scope:** ~3-5 new B_* contracts + mapping doc.

### Mapping — 10 Doctrines vs Existing CSPS Artifacts

| Doctrine | What it says | Existing CSPS equivalent | Action |
|---|---|---|---|
| **A — Stable Macro / Adaptive Micro** | Core layouts stable; personalization in bounded areas | (no direct B_*; partial in UX/UI Discipline memory feedback) | NEW: `B_STABLE_MACRO_ADAPTIVE_MICRO.md` |
| **B — Deterministic vs Probabilistic Separation** | AI doesn't control billing/pricing/permissions/legal | Partial — distributed across P-ARCH-002 (schema-per-app), B_PIE_READINESS_GATE | NEW: `B_DETERMINISTIC_PROBABILISTIC_SEPARATION.md` (canonical) |
| **C — Confidence Governance** | High/Medium/Low/Contradiction → adaptive behavior tiers | Partial — confidence tiers in PIE | EXTEND existing PIE docs; add explicit threshold table |
| **D — Shadow State Before Product State** | AI inference enters shadow first; promotion to production gated | Partial — B_PIE_READINESS_GATE handles part | GENERALIZE via B_PROMOTION_GATE_DISCIPLINE (PART 3) — Doctrine D = the formal pattern |
| **E — Convergence Governance** | Adaptive branching always converges; common milestones; linear fallback | NEW concept | NEW: `B_CONVERGENCE_GOVERNANCE.md` |
| **F — Explicit User Control** | Transparency view, overrides, reset, audit | Partial — /platform/profiles + audit-event.zmodel; NO transparency screen | NEW: `B_EXPLICIT_USER_CONTROL.md` + future PART 7 transparency surface |
| **G — Cold Start Governance** | First 90 sec: 1 intent question + 1 useful output; no deep profiling | NEW concept (not in CSPS today) | NEW: `B_COLD_START_GOVERNANCE.md` |
| **H — Monetization Governance** | Earned commercial prompts; no dark patterns | NEW concept (not in CSPS today) | NEW: `B_MONETIZATION_GOVERNANCE.md` |
| **I — Schema and Contract Governance** | Versioned profile→product handoff | COVERED by PART 3 (3-Layer schema + B_PROMOTION_GATE) | MAP to PART 3; don't duplicate |
| **J — Foundation Before Delight** | 10-step foundation order: identity → shell → schema → confidence → audit → shadow → contract → adaptive → delight → monetization | OVERLAPS heavily with P-META-016 gradual-build-by-foundations | EXTEND P-META-016 with 10-step explicit foundation order |

### Existing CSPS Artifacts (Reuse Before Create)

| Asset | How it serves Constitution |
|---|---|
| 70 B_* contracts | Pattern + structure for new doctrines |
| 29 P-META/P-ARCH/P-OPER principles | P-META-016 extension target for Doctrine J |
| B_PIE_READINESS_GATE | Generalize for Doctrines C + D |
| audit-event.zmodel | Doctrine F audit log surface |
| /platform/profiles | Doctrine F partial; transparency screen extends |
| pageDNA + voice profiles | Doctrine A "adaptive micro" precedent |

### New (Created)

5 net-new B_* contracts: STABLE_MACRO_ADAPTIVE_MICRO / DETERMINISTIC_PROBABILISTIC_SEPARATION / CONVERGENCE_GOVERNANCE / EXPLICIT_USER_CONTROL / COLD_START_GOVERNANCE / MONETIZATION_GOVERNANCE.

(Doctrines C, D, I, J map onto existing artifacts; only 6 net-new contracts needed of the 10 doctrines.)

### DONE WHEN

- [ ] 6 new B_* contracts authored at FSE 5/5
- [ ] P-META-016 extended with 10-step foundation order
- [ ] B_PROMOTION_GATE_DISCIPLINE generalized from B_PIE_READINESS_GATE (also serves PART 3)
- [ ] Mapping doc `docs/plan/pillar-0-governance/GOVERNANCE-CONSTITUTION-MAP.md` cross-references all 10 doctrines to canonical CSPS artifact
- [ ] verify --strict exit_code=0

### ZF gate

Cycles cite: 10 doctrines × mapping status + 5-surface FSE check per new contract + P-META-016 extension diff.

---

# PART 5 — QUESTION PLACEMENT SCHEMA

**Purpose:** Absorb Governor Doc 03 — every question is a governed system object with placement schema BEFORE question bank. Connect to 6 vaults (Identity/Intelligence/Configuration/Interaction/Governance/Asset).

**Owner:** Sonnet-13 + Opus-12 | **Gate tier:** check-in (lower stakes than threshold/product schema) | **Scope:** 1 entity + 6 vault definitions + validator.

### Existing CSPS Artifacts (Reuse + Enhance)

| Asset | Path | Action |
|---|---|---|
| GuardQuestionForm component | [libs/ui/src/GuardQuestionForm.tsx](libs/ui/src/GuardQuestionForm.tsx) | KEEP; renders questions per schema |
| context_question frontmatter field | already on 647 governance files | Doctrine precursor — questions live in artifacts |
| VAULT directory | exists but session-scoped | EXTEND with 6 vault types (per Doc 03 §10) |
| ExternalInput entity | exists | Likely captures answer-storage for some questions |
| pre-tool-use-context-question-gate.sh | exists | Question-discipline precedent |

### New (Created)

| Artifact | Why |
|---|---|
| `libs/policies/slices/public/governed-question.zmodel` | Question as DB entity with all Doc 03 §3 fields |
| `docs/plan/pillar-0-governance/QUESTION-PLACEMENT-SCHEMA.md` | Canonical reference + 8-question core rule |
| `tools/validators/validate-question-placement.mjs` | Asserts every question in any artifact passes 8-question core rule |
| 6 vault definitions in NodeFile contract: identity_vault / intelligence_vault / configuration_vault / interaction_vault / governance_vault / asset_vault | Per Doc 03 §10 |
| `B_QUESTION_PLACEMENT_DISCIPLINE.md` | "No question without 8-question answers" rule |
| Question budget enforcement in onboarding flows (later — PART 7 wires it) | max 3 questions/session, max 1 soft confirm, no high-sensitivity in cold start |

### Consolidation Opportunities

- The `context_question` frontmatter field on 647 files IS already a question-as-governed-object pattern (one question per artifact). EXTEND to multi-question support; don't duplicate.
- ExternalInput likely already stores some answer types — map carefully; possibly the answer-storage substrate already exists.

### DONE WHEN

- [ ] governed-question.zmodel entity created
- [ ] 6 vault types defined in NodeFile contract (lazy-instantiated per Q6)
- [ ] B_QUESTION_PLACEMENT_DISCIPLINE engraved FSE 5/5
- [ ] validate-question-placement scans all existing questions; pass rate ≥80%
- [ ] verify --strict exit_code=0

### ZF gate

Cycles cite: question entity migration + 6 vault definitions + B_* engraving evidence + ≥80% pass rate on existing questions.

---

# PART 6 — PAGE-TYPE TEMPLATES (10 Archetypes)

**Purpose:** Fill the missing productive layer between atoms (8 UI components) and apps. Without page-type templates, every app re-invents page composition.

**Owner:** Sonnet-13 (build) + Opus-12 (architecture review) | **Gate tier:** check-in | **Scope:** 10 template files + index update + behavioral tests.

### Existing CSPS Artifacts (Reuse + Enhance)

| Asset | Path | Action |
|---|---|---|
| 8 UI components | [libs/ui/src/](libs/ui/src/) — CSPSPage / HealthBar / GapCard / MetricBadge / JourneyStep / GuardQuestionForm / CSPSDataTable / VoiceFileInput | KEEP; templates COMPOSE these |
| apps/template/ | [apps/template/src/app/](apps/template/src/app/) — 4 example pages | KEEP as concrete examples; templates make them generic |
| 6 SEALED bundles | [tools/bundles/](tools/bundles/) | KEEP; templates LAYER ON TOP of bundles |
| COMPONENT-LIBRARY bundle | docs the 8 components | UPDATE to mention 10 templates as Layer-N |

### New (Created — 10 page-type templates + supporting infra)

```
libs/ui/src/templates/
├── DashboardTemplate.tsx       (KPIs + recent activity)
├── ListTemplate.tsx            (collection / paginated table)
├── DetailTemplate.tsx          (single entity detail)
├── FormTemplate.tsx            (create/edit)
├── WizardTemplate.tsx          (multi-step guided flow)
├── SettingsTemplate.tsx        (config/preferences tabs)
├── AuthFlowTemplate.tsx        (sign-in / sign-up / org-invite)
├── EmptyStateTemplate.tsx      (no-data / first-run)
├── ErrorTemplate.tsx           (404 / 500 / permission-denied)
└── CatalogTemplate.tsx         (public-facing browse)
```

Plus: `libs/ui/src/templates/index.ts` exports + extend `libs/ui/src/index.ts` re-exports + `tools/validators/validate-page-template-usage.mjs` (every app page must wrap in a template by S069).

### Consolidation Opportunities

- DashboardTemplate composes existing HealthBar + MetricBadge + CSPSDataTable — pure composition.
- WizardTemplate composes existing JourneyStep — pure composition.
- FormTemplate composes existing GuardQuestionForm + VoiceFileInput — pure composition.
- DO NOT introduce new atoms; templates are 100% composition of existing 8.

### DONE WHEN

- [ ] 10 template files in libs/ui/src/templates/
- [ ] index.ts exports all 10 + types
- [ ] Behavioral test per template (10 tests)
- [ ] At least 1 existing app page rewrapped in a template as proof
- [ ] COMPONENT-LIBRARY.bundle.yaml updated to v1.1 with templates listed
- [ ] verify --strict exit_code=0

### ZF gate

Cycles cite: 10 template files + 10 test exits + 1 proof-of-use rewrap + bundle version bump.

---

# PART 7 — FRICTIONLESS ONBOARDING (Condition #2)

**Purpose:** Use the Governor-provided onboarding files (when uploaded) + Governance Doctrine G (Cold Start) + 3-Layer Profile-Product + Question Placement Schema to define onboarding for end-users.

**Owner:** Governor (provides spec files) + Opus-12 (integration) + Sonnet-13 (build) | **Gate tier:** full-advance | **Scope:** depends on Governor-provided files.

### Existing CSPS Artifacts (Reuse + Enhance)

| Asset | Path | Action |
|---|---|---|
| /platform/wizard | [csps-playground/wizard](apps/csps-playground/src/app/platform/wizard) | EXTEND — currently developer-facing; add end-user variant |
| /platform/user-journey | [csps-playground/user-journey](apps/csps-playground/src/app/platform/user-journey) | EXTEND — BehaviorHub already wired |
| /platform/zero-friction | [csps-playground/zero-friction](apps/csps-playground/src/app/platform/zero-friction) | EXTEND — likely the G4 ZF5Q precursor |
| BehaviorHub | libs/behavior-hub/ | KEEP |
| account-setup page | [apps/template/account-setup](apps/template/src/app/account-setup) | EXTEND |
| AuthFlowTemplate | (PART 6) | USE |
| WizardTemplate | (PART 6) | USE |

### New (Created — when Governor-provided files arrive)

| Artifact | Why |
|---|---|
| `docs/plan/_handoff/VAULT/governor-uploads/S068/05-frictionless-onboarding-spec-V1.md` | Governor's spec files (when provided) saved here |
| `libs/policies/slices/public/onboarding-flow.zmodel` | OnboardingFlow + OnboardingStep + OnboardingAttempt entities |
| `apps/template/src/app/onboarding/page.tsx` | New canonical onboarding page using AuthFlowTemplate + WizardTemplate |
| Friction metrics: ≤N clicks, ≤M decisions, ≤T seconds per stage | Per Governor spec |
| `tools/validators/validate-onboarding-friction.mjs` | Asserts friction metrics met |
| Behavioral test: synthetic new-user E2E pass | |

### Consolidation Opportunities

- Three existing playground pages (wizard / user-journey / zero-friction) are likely fragments of one onboarding system. Consolidate into ONE canonical onboarding flow before extending.

### DONE WHEN

- [ ] Governor-provided files saved to VAULT
- [ ] frictionless-onboarding-spec ratified
- [ ] OnboardingFlow + Step + Attempt entities exist
- [ ] AuthFlowTemplate + WizardTemplate used (proves PART 6)
- [ ] Friction metrics defined + met
- [ ] Behavioral test: new-user E2E synthetic pass
- [ ] verify --strict exit_code=0

### ZF gate

Cycles cite: spec ratification + entity migrations + friction metrics evidence + E2E test exit.

---

# PART 8 — DEVELOPER'S JOURNEY RE-COMPLETION (Condition #3)

**Purpose:** Raise the bar above S059 ratification. The 9 INFRA-FLOW steps must re-verify at THIS-HEAD with all post-S059 disciplines integrated (B_HUMBLE / B_META_QUESTION / D1-D10 / OPIA / tab-transfer / PRACE / NodeFile / Promotion Gate).

**Owner:** Opus-12 (re-walk) + Governor (sign-off) + Sonnet-13 (gap fixes) | **Gate tier:** full-advance.

### Existing CSPS Artifacts (Reuse + Enhance)

| Asset | Path | Action |
|---|---|---|
| /platform/developer-journey | [csps-playground/developer-journey](apps/csps-playground/src/app/platform/developer-journey) | RE-WALK; raise standard |
| Wizard at csps-playground | colleague voice ratified S059 | RE-TEST with new B_* layers active |
| 9 INFRA-FLOW steps | per [CORE-COMPLETE-EXIT-CRITERIA.md](docs/plan/pillar-0-governance/CORE-COMPLETE-EXIT-CRITERIA.md) | RE-VERIFY each at THIS-HEAD; original S057 composite test is now stale |
| Developer Journey page | exists | INTEGRATE new disciplines; wizard outputs land in Product Schema (per PART 3) |
| Voice profiles | live | EXTEND for friction measurement |

### New (Created)

| Artifact | Why |
|---|---|
| `docs/plan/_handoff/VAULT/dev-journey-re-walk-S068.md` | Re-walk audit document |
| Wizard output → Product Schema integration | Wizard creates Product row per PART 3 |
| Friction metrics for DJ (developer side) | Mirror PART 7 for developers |
| Re-ratification record in CORE-COMPLETE-EXIT-CRITERIA.md amendment | Per Q3 ratification: ADD §"Stricter Re-Gate S068" |

### DONE WHEN

- [ ] All 9 INFRA-FLOW steps re-verified at THIS-HEAD (composite test re-run)
- [ ] Wizard outputs land in Product Schema (PART 3 integration verified)
- [ ] New disciplines (B_HUMBLE / B_META_QUESTION / D1-D10 / OPIA / tab-transfer / PRACE / NodeFile / Promotion Gate) integrated visibly into journey
- [ ] Friction metrics for DJ defined + met
- [ ] Governor re-walks + signs "DJ still feels like colleague" with new layers
- [ ] CORE-COMPLETE-EXIT-CRITERIA.md amendment block added (per Q1 ratification)
- [ ] verify --strict exit_code=0

### ZF gate

Cycles cite: 9 INFRA-FLOW step re-verifications + integration evidence + friction metrics + Governor sign-off attestation.

---

# Persona Iteration — 5 Pre-PROTO Reviews (Q9 ratified)

Each PART runs through 5 personas BEFORE Sonnet handoff:

1. **cruel-critic** — assumptions, scale, edge cases, reversibility
2. **balance-expert** — over-engineering check, complexity score growth, "remove before adding"
3. **bottleneck-expert** — what breaks at 10×/100× scale, single-thread risks
4. **consolidation-expert** — duplications, can existing serve, prune candidates
5. **schema-expert** — RLS, tenant isolation, soft-delete, audit, multi-schema patterns

Each persona emits a one-paragraph judgment; Opus-12 synthesizes BEFORE writing the PROTO.

---

# Hard Gate — Apps Blocked Until

All 8 PARTs DONE-WHEN passed:

- [ ] PART 1 SEALED (substrate)
- [ ] PART 2 SEALED (threshold complete — Condition #1)
- [ ] PART 3 SEALED (Product Schema — Condition #4)
- [ ] PART 4 SEALED (Governance Constitution)
- [ ] PART 5 SEALED (Question Placement Schema)
- [ ] PART 6 SEALED (Page-Type Templates)
- [ ] PART 7 SEALED (Frictionless Onboarding — Condition #2)
- [ ] PART 8 SEALED (Developer's Journey — Condition #3)

ONLY THEN: App #2 [PROTO-S068-CONNECTOR-WET-TRIAL.md](docs/plan/protos/PROTO-S068-CONNECTOR-WET-TRIAL.md) unparks. Until then, all app-development work pauses.

---

# Things Temporarily Set Aside (Tracked Deferred — Get Back To Later)

Per Governor's directive ("things left aside temporarily saved and we will get back to them"):

| Item | Why deferred | Where parked | Re-engage when |
|---|---|---|---|
| App #2 The Connector wet-trial | Re-gated; 4 preconditions before apps | [PROTO-S068-CONNECTOR-WET-TRIAL.md](docs/plan/protos/PROTO-S068-CONNECTOR-WET-TRIAL.md) with RE-GATE NOTE | After PART 1-8 SEALED |
| G3 cred rotation status verify | Parallel-eligible; not blocking re-gate | [opus-turn.md NOW-A directive](tools/council/opus-turn.md) | Sonnet picks up next turn (parallel) |
| Governor #3 priorities | Awaiting Governor surface | (Governor's tab) | Whenever Governor surfaces |
| SIA playground PART C | Low-priority cleanup; fill-task | [HANDOFF-S067-to-S068.md Zone B P4](docs/plan/_handoff/HANDOFF-S067-to-S068.md) | Sonnet fill-task between PART work |
| G2 Vercel debt-collection deploy | Deferred; not in re-gate scope | HANDOFF Zone B Deferred | S069+ |
| G4 Zero Friction 5Q standalone | Likely absorbed into PART 7 (Frictionless Onboarding) | HANDOFF Zone B Deferred | PART 7 work absorbs |
| G5 DNA-Manifesto V-C | Deferred; Opus-drafts later | HANDOFF Zone B Deferred | S069+ |
| PAP-1A full sweep | Deferred; new behavioral tests need registry update | HANDOFF Zone B Deferred | S069+ |
| 134-validator retroactive behavioral test sweep | Long-tail; absorbed into PVA build | HANDOFF Zone B Deferred | After PVA built |
| PVA (Process-Value-Audit) build | Critical for yield-blindness; out of immediate re-gate scope | [opia-checklist.md §2](tools/council/opia-checklist.md) | After PART 4 (Governance Constitution) |

---

# Verify-Failed Note

Verify exit_code=0 at commit `0ac4a57b` (S068 fix for PROTO-S068-CONNECTOR-WET-TRIAL.md missing DONE WHEN + ZF gate). Iter-11 stop-hook flag may be stale cached state. Re-run on next file batch.

---

# Authoring Cadence (recommended)

Each PART = 1 PROTO (PROTO-S068-PART-N-<NAME>.md). Sequenced per Overview. Each PROTO starts with the 5-persona review then handoff to Sonnet.

**Approximate session count:** 4-6 sessions to seal all 8 PARTs (some parts parallel-eligible).

---

# AMENDMENT A — Package A + B Absorption (Opus-12, S068)

**Trigger:** Governor uploaded Phase 2 Package A (Dynamic Onboarding) + Package B (BI Layer) — vaulted [05](VAULT/governor-uploads/S068/05-package-A-dynamic-onboarding-V1.md) + [06](VAULT/governor-uploads/S068/06-package-B-business-intelligence-layer-V1.md). Governor directive: "optimization to all you build and planned so far is the issue — extract what is OPTIMAL, ensure previous things enhanced + intact." Ran 3-pass extraction + 6-persona iteration ×2.

## 3-Pass Extraction Result

- **Pass 1 (Understanding):** Package A = the UX/experience doctrine for onboarding (5-stage flow, value-first, continuous enrichment). Package B = the BI Layer = onboarding-as-product-configuration-intelligence (user-vs-tenant separation, 5 responsibilities, transparency).
- **Pass 2 (Compatibility):** ~70% of A+B RESTATE already-vaulted Doc 02/03/04 (3-layer model, confidence thresholds, promotion gate, depth levels, question types, vaults). Net-new delta ≈ 30%.
- **Pass 3 (Optimization):** Absorb only the 30% delta. Map onto EXISTING parts. NO new PART created.

## Net-New Delta (only 5 items — everything else already covered)

| Delta concept | Source | Absorbed into | Net-new artifact? |
|---|---|---|---|
| Continuous-enrichment triggers (good/bad moments) | Pkg A §8 | PART 2 (threshold receives interaction-signals) + PART 7 | NO new entity — enrichment IS threshold input; add debounce spec to PART 2 |
| 5-stage onboarding flow | Pkg A §5 | PART 7 (rendered by WizardTemplate + AuthFlowTemplate from PART 6) | NO new template — composes PART 6 |
| "Intelligence-must-serve-configuration" rule (every signal maps to ≥1 downstream use) | Pkg B §5A | PART 3 + PART 4 | NEW: validate-signal-has-downstream-use.mjs |
| User-vs-Tenant context split + Communication Context (per-User) | Pkg B §5C/5D | PART 3 (Layer 2 gains `scope` discriminator: tenant\|user) | NO new entity — scope field on ProfileIntelligence |
| Profile Transparency Screen | Pkg B §8 = Doc 02 §17 = Doctrine F (SAME thing, 3 names) | PART 7 (ONE screen, DetailTemplate instance) | NEW: 1 page; consolidated from 3 references |

**Everything else in A+B is already covered** by vaulted Doc 02/03/04 + existing CSPS (confidence thresholds, promotion gate, 4 depth levels, 7 question types, 6 vaults, anti-patterns).

## 6-Persona Iteration ×2

**Iteration 1:**
- *cruel-critic:* "Continuous onboarding could become a never-ending nag — cap with Question Budget (max 3/session, Doc 03). Enrichment is NOT a new system; it's the threshold receiving interaction-signals."
- *balance-expert:* "A+B introduce ~15 concepts but ~11 are restatements. Create 4 artifacts, not 15."
- *bottleneck-expert:* "Continuous enrichment = N signals/sec hitting threshold. Must debounce + batch. Event-filter, not every-keystroke. → PART 2 requirement."
- *consolidation-expert:* "Pkg A depth-levels = Doc 03 depth-levels (IDENTICAL). Pkg A question-types = Doc 03 (IDENTICAL). Pkg B 3-layer = Doc 02 (IDENTICAL). Absorb the 30% delta only."
- *schema-expert:* "Pkg B user-vs-tenant split → Layer 2 gains a `scope` discriminator. Communication Context = Layer-2 per-User sub-object. Data freshness = the deferred confidence_decay_policy field. NO new entity."
- *ux-expert:* "Pkg A 5-stage flow IS the WizardTemplate+AuthFlowTemplate composition (PART 6). Profile-summary = DetailTemplate instance. Pkg A needs templates, not schema."

**Iteration 2 (re-optimize + previous-intact check):**
- *cruel-critic:* "PART 7 scope grew from 'Frictionless Onboarding' to 'Continuous BI-driven Onboarding.' BOUND it: PART 7 ships the 5-stage flow + transparency screen; the continuous-enrichment-ENGINE is DEFERRED post-gate (needs threshold+CIE live)."
- *balance-expert:* "Post-absorption net-new count = 4 (validator + scope-field + transparency page + enrichment-trigger spec). Acceptable. The 15→4 consolidation held."
- *bottleneck-expert:* "Confirmed enrichment-signal path reuses threshold (PART 2) — no parallel pipeline. Debounce is a PART 2 requirement. Good."
- *consolidation-expert:* "Profile-summary-screen (Pkg B §8) = user-transparency-screen (Doc 02 §17) = Doctrine F. THREE names, ONE thing. Consolidated to 'Profile Transparency Screen' — single PART 7 deliverable."
- *schema-expert:* "Layer 2 gains `scope: tenant|user` discriminator. Previous PART 3 3-entity design INTACT + enhanced (not split into more entities). Confirmed not broken."
- *ux-expert:* "PART 6 page-templates EXERCISED by the 5-stage flow (good validation). 'First small value' stage needs an EmptyStateTemplate variant. Enhances PART 6, doesn't break it."

## Net Effect on Existing Parts (enhanced + intact)

| Part | Change from A+B absorption | Intact? |
|---|---|---|
| PART 2 (Threshold) | + debounce/batch spec for interaction-enrichment signals | ✓ enhanced |
| PART 3 (Product Schema) | + Layer 2 `scope: tenant\|user` discriminator + Communication Context sub-object + confidence_decay_policy field + validate-signal-has-downstream-use.mjs | ✓ enhanced (3-entity design intact) |
| PART 4 (Governance) | "intelligence-serves-configuration" maps to Doctrine B + I (no new doctrine) | ✓ intact |
| PART 5 (Question Placement) | A+B depth/types/vaults are IDENTICAL — no change | ✓ intact (zero delta) |
| PART 6 (Page Templates) | WizardTemplate + AuthFlowTemplate + EmptyStateTemplate exercised by 5-stage flow | ✓ enhanced (validated) |
| PART 7 (Onboarding) | absorbs 5-stage flow + ONE Profile Transparency Screen; continuous-enrichment-engine DEFERRED post-gate | ✓ enhanced + scope-bounded |
| PART 8 (Dev Journey) | no change | ✓ intact |

## Deferred (post-gate — bounded scope)

- Continuous-enrichment ENGINE (needs threshold + CIE live)
- Confidence decay job (field recorded now, engine later)
- Bundle/ProductKit resolver algorithm

**No new PART. No previous work broken. Net-new = 4 artifacts mapped onto existing parts. Scope bounded.**

---

# AMENDMENT B — Core-Maximal Doctrine + Gap-Harmonization-Gate (Opus-12, S068)

**Trigger:** Governor S068 North-Star-level directive. Ratified Core-maximal + added the Gap-Harmonization-Gate (the "DNA-forever" element), apps-80/20, unlimited-granularity, templates-everywhere, node-connectivity, nightly-audits, apps-to-vault. Canonical doctrine: [CORE-MAXIMAL-DOCTRINE.md](../pillar-0-governance/CORE-MAXIMAL-DOCTRINE.md). North Star sharpened with Core-maximal quality (sacred edit, ratified).

## B.1 — PART 1 STEP 5 UPGRADED (pending-nodes → Gap-Harmonization STOP gate)

The original PART 1 STEP 5 made `pending-nodes.yaml` a passive log. **Upgrade:** it is now an active **STOP gate** (P-ARCH-032). On any no-perfect-fit:
- bundling/build HALTS (not just logs)
- writes pending-gap row + notifies Opus-review-queue
- requires human ratification before the element can be created
- new hook `pre-tool-use-gap-harmonization-gate.sh` blocks app-bundled elements lacking ratified-core precedent
- consolidates B_ASK_WHEN_FILLING_GAPS + B_NO_FORCE_FIT + B_BLOCKER_NO_SILENT_DROP + B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK (no 5th contract)

## B.2 — NEW PART 0 (precedes PART 1): Constitutional Engraving (DONE this turn + PART 1 formalization)

- [x] North Star Core-maximal quality (sacred edit, S068) — DONE
- [x] [CORE-MAXIMAL-DOCTRINE.md](../pillar-0-governance/CORE-MAXIMAL-DOCTRINE.md) (P-ARCH-031 + P-ARCH-032 canonical text) — DONE
- [ ] Formal principles.yaml + slice registration for P-ARCH-031 + P-ARCH-032 (PART 1, validators in loop — avoids blind-registration verify break)
- [ ] B_APPS_ARE_TRIALS reconciliation: add trial→bundle lifecycle + 80/20 clause (PART 1)

## B.3 — SECONDARY PLAN: Nightly Alignment Audits ("calmly at night")

New recurring audit suite (cron, off-hours) covering whole-platform alignment with all prior content + context. Scope per night:
- **Gap-lineage scan** — every element has a ratified-core lineage; flag silently-filled gaps (P-ARCH-032 enforcement over time)
- **Core-maximal compliance** — no capability built in-app that should be in-core (parallel-path detection)
- **Node-connectivity completeness** — every node declares its connectivity fields
- **NS-orphan scan** — every artifact declares ns_quality
- **Cross-content drift** — new artifacts consistent with prior ratified doctrine
- **Output:** findings → Opus-review-queue; K≥2 recurring → structural fix demanded
- **Build:** folds into existing audit-runner.md weekly cron infra (extend, don't duplicate). Detailed PROTO: PART 4 (Governance) follow-up.

## B.4 — Templates Everywhere + One-Sensible-Default

Cross-cutting principle (CORE-MAXIMAL-DOCTRINE §Templates). Affects PART 6 (page-templates) + PART 7 (onboarding default + "Create new template") + bundling system. Every reusable element ships ONE sensible default + a create-new-template path. Folds into existing parts; no new part.

## B.5 — Existing Apps → Vault (PENDING GOVERNOR CONFIRM)

Governor proposed: vault the 6 trial apps (budget-planner / debt-collection / voice-sorting / task-mgmt / habit-tracker / sandbox), separate from system, build infra first, then dogfood through Developer's Journey as inputs. **csps-playground + template are NOT trial apps — they stay** (playground = the platform's own reference surface; template = the bundling base). This is a consequential move — awaiting explicit confirm before any `git mv`. Proposed destination: `_trials-vaulted/` (out of `apps/`, preserved in git, removed from active workspace).

## B.6 — 3× Pending-Plan Scan (first pass this turn; full = nightly audit)

Governor: scan pending plans 3× from different angles for CSPS-principle compliance.
- **Angle 1 (Core-maximal):** master plan PARTs 1-8 are all CORE work — compliant by construction. The ONE misalignment: parked PROTO-S068-CONNECTOR "clone budget-planner" framing → fix to "bundle from core" (carried, app is parked).
- **Angle 2 (Gap-Harmonization):** PART 3 schema work must route every undefined field through GHG, not guess defaults — added as PART 3 requirement.
- **Angle 3 (ripple core-seeds):** core seeds must sit on ripple effects, not just the implemented thing — added as a per-PART authoring requirement (every PROTO declares its ripple-set + seeds each).
- Full recurring 3× scan = the nightly audit suite (B.3).

## B.7 — Core Seeds on Ripple Effects

Discipline (Governor S068): when engraving anything, place core seeds not only on the specific artifact but on its **ripple set** (every element the change touches). Added to NodeFile contract (PART 1) as a `ripple_seeds` field + to each PROTO's DONE-WHEN.
