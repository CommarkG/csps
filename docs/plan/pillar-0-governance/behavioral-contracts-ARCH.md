---
id: csps.pillar-0-governance.behavioral-contracts-arch
name: behavioral-contracts-ARCH
description: "B_* contracts governing architecture, implementation gates, and structural decisions"
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: behavioral_contracts_arch
batch: BATCH-A
session: S051
impl_status: swift-implemented
diataxis_type: reference
links:
  - { rel: index, href: behavioral-contracts.md }
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/behavioral-contracts.md
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# Behavioral Contracts — ARCH Spine

> **Shard of behavioral-contracts.md.** 12 contracts — ARCH spine.
> Index: [behavioral-contracts.md](behavioral-contracts.md) | Split: `pnpm contracts:split`

---

## B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK

**Canonical wording:**

> Before introducing a new artifact, structure, name, format, or pattern: explicitly check whether a precedent exists in (a) the existing CSPS schema/principles/protocols, (b) the user's prior platform decisions (CSP carry-forwards), (c) industry research. If precedent exists: enhance it (per P-OP-001 reuse-first). If no precedent exists: declare the absence + propose-with-PCR. Never silently invent.

**Counterweight:**

> Genuine novelty requires invention; not all problems have precedent. When invention is justified: cite the search performed + the absence found + the design rationale. The invention itself is the proposal, not the fait accompli.

**Source:** S002 turn 7 self-audit — multiple instances of inventing EXT-ID format, schema-gap registry shape, dashboard route list, etc., without precedent check.

**Anti-patterns:**
- Inventing format / shape / structure without checking existing artifacts first
- Naming a pattern without checking if the user has prior naming convention
- Designing a registry / table / schema without checking comparable structures elsewhere in the codebase
- Citing "research validates this" when the design preceded the research

**Mechanical surfaces:**
- schema: frontmatter `precedent_checked:` field on new artifacts (closed enum: existing-csps / csp-carry-forward / industry-research / declared-novel)
- validator: `precedent-check-coverage` audit (PR-blocking, error severity)
- hook: UserPromptSubmit reminder
- memory: `feedback_no_invention_without_precedent.md` (S002 turn 7)
- contract: this entry
- **enforcement_tier:** `{ tier: session-only, no-hook, no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low (T3-only) }`

---

## B_CHECK_EXISTING_DECISIONS_FIRST

**Canonical wording:**

> Before building any new structure / protocol / pattern in CSPS: read the existing CSPS docs that touch the same area AND ask the user whether prior-platform precedent (CSP, etc.) exists that should be inherited. New work starts from "what do we have" not "what would I build". The reuse-first principle (P-OP-001) applied recursively to architectural design.

**Counterweight:**

> When the existing decisions are wrong (Sandi Metz "wrong abstraction"): inline-and-redecide is always available. The check is to make the choice between enhance / inline-and-redecide / declared-novel deliberate rather than default-to-invent.

**Source:** S002 turn 7 self-audit — biggest failure: built manual-protocol + tag-status + dashboard-plan without first asking whether CSP had patterns that should inform the design. The treasure docs proved CSP DID have these patterns.

**Anti-patterns:**
- Building parallel structures from research without checking user-platform precedent
- Designing a workflow that could have been a CSP carry-forward
- Naming patterns / coining terms without checking user's existing vocabulary
- Citing research as the validation source when the user's own platform was the right validation source

**Mechanical surfaces:**
- schema: extension to frontmatter — `precedent_check_summary:` block (what was checked + what was found)
- validator: `precedent-check-coverage` audit
- hook: UserPromptSubmit reminder ("before building NEW: check EXISTING")
- memory: `feedback_check_existing_decisions_first.md` (S002 turn 7)
- contract: this entry
- **enforcement_tier:** `{ tier: session-only, no-hook, no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low (T3-only) }`

---

## B_TEMPLATE_FIRST_CREATION — every commitment-layer output passes templated discovery gate (S006 turn 5-7)

**Canonical:** Every commitment-layer output AI produces — persisted artifacts, code, prose patterns, decision frames, reasoning structures, tooling discipline — passes through a templated discovery gate before authoring. Template registry at [_handoff/VAULT/template-registry.md](../_handoff/VAULT/template-registry.md) is the single source of truth. Entries register validator slugs atomically per FSE; implementation may defer. Escape hatch: `template_status: novel-pending-pattern-evaluation` with K=2 promotion to stable.

**Counterweight:** Native AI thinking-layer (mid-conversation reasoning, exploratory analysis, debugging walks, creative synthesis) is NOT gated. Templates apply at commitment-layer (persisted, structurally recurring) — not at thinking-layer.

**Source:** S006 turn 5-7 user directives — "have a template structure aligned to the schema" + "we have the SCHEMA as the one source of truth of what exists".

**Anti-patterns:**
- free-write-on-recurring-artifact-type (template exists but not cited)
- silent-skip-of-discovery-gate (artifact bypasses registry consultation)
- novel-pending-pattern-evaluation-staleness (entry sits novel-pending >5 sessions)
- thinking-layer-templates-imposed (templates applied to native reasoning — kills creativity)

**Mechanical surfaces (5/5 declared S006 L2):**
- schema: [template-registry.md](../_handoff/VAULT/template-registry.md) + per-artifact `template_used:` frontmatter field
- validator (atomic registration): `template-citation-on-creation` + `template-registry-coverage` + `novel-pending-pattern-evaluation-staleness` (impl week-4)
- hook: `.claude/hooks/pre-tool-use-template-citation.sh` (week-4)
- memory: [feedback_universal_template_first.md](C:\Users\finky\.claude\projects\c--Users-finky-Desktop-Claude-Code-Csps\memory\feedback_universal_template_first.md)
- contract: this entry + AGENTS.md hard NO + spine matrix row + `principles.yaml#P-META-015`

**Cross-references:** P-META-015 / P-META-007 (FSE — 5 surfaces are themselves templates) / P-OP-001 (reuse-first applied recursively to template selection) / P-META-016 (gradual-build-plan IS a template) / P-ARCH-028 (Core Spine attribution requires schema_anchor + core_spine fields per template).

---
- **enforcement_tier:** `{ tier: T1+T3, T1 hook: pre-tool-use-frontmatter-enum-check.sh (partial — enum drift only), no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low-partial }`

---

## B_GRADUAL_BUILD_BY_FOUNDATIONS — every multi-session topic enters via templated gradual-build-plan (S006 turn 5-7)

**Canonical:** Every multi-session topic entering CSPS goes through a templated gradual-build-plan instance at `_handoff/VAULT/topic-plans/<topic-id>.md`. Depth chosen ∈ {3, 4, 5} with rationale (free-form N rejected by validator). Levels enumerated; ZF gate per level; foundation-stability-before-layer-N enforced. Priority engine sequences via 5-dimension formula + 4 bands + PE TRAJECTORY lookahead.

**Counterweight:** Single-turn reversible work (typo fix, single-line edit, mechanical refactor confined to one file) doesn't require gradual-build-plan instance. Discipline targets work that (a) requires >1 session arc, OR (b) depends on >2 foundation-stable elements, OR (c) crosses >1 Core Spine, OR (d) is cross-actor.

**Source:** S006 turn 5-7 user directive — "develop a gradual build methodology to be engraved into the multi session plan way of creation and updating. Mechanically enforce this attitude of gradual phases on any given topic".

**Anti-patterns:**
- finish-fast-urge (multi-session topic completed in one turn; foundations skipped)
- arbitrary-N-part-split (split into 7 parts without rationale; depth not 3/4/5)
- skip-foundation-shortcut (jump to feature-build without ZF on foundation)
- tunnel-vision-single-next-item (no PE TRAJECTORY emitted; only next item)
- unrelated-batching (multiple disciplines batched without composition rationale)

**Mechanical surfaces (5/5 declared S006 L2):**
- schema: [gradual-build-plan.template.md](../../../tools/templates/gradual-build-plan.template.md) + [priority-engine.schema.yaml](../../../tools/templates/priority-engine.schema.yaml)
- validator (atomic registration): `gradual-build-plan-coverage` + `priority-engine-depth-respected` + `foundation-stability-before-layer-N` + `humble-batching-required` + `priority-engine-inputs-complete` + `backtrack-trigger-coverage` (impl week-4)
- hook: `.claude/hooks/user-prompt-submit-multi-session-detector.sh` (week-4)
- memory: [feedback_gradual_build_by_foundations.md](C:\Users\finky\.claude\projects\c--Users-finky-Desktop-Claude-Code-Csps\memory\feedback_gradual_build_by_foundations.md)
- contract: this entry + AGENTS.md hard NO + spine matrix row + `principles.yaml#P-META-016`

**Cross-references:** P-META-016 / P-META-008 (cycle-mandatory-in-plan — gradual-build IS the cycle structure) / P-META-015 (gradual-build-plan is itself templated) / P-META-018 (PE_ALIGNMENT_GUARDIAN respects gradual-build sequencing) / P-ARCH-028 (each level maps to Core Spine layers).

---
- **enforcement_tier:** `{ tier: T1+T3, T1 hook: pre-tool-use-plan-coverage-gate.sh (partial — new libs/apps files), no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low-partial }`

---

## B_CORE_SPINE_DISCIPLINE — every artifact maps to ≥1 spine; outward layering enforced (S006 turn 7-9)

**Canonical:** CSPS architecture organized around 5 Core Spines (GVRN/ARCH/AI/OPER/VALD) with precedence ordering GVRN > VALD > ARCH > AI > OPER (lower-defers-to-higher). Every governed artifact declares primary spine via `core_spine:` (singular; REQUIRED) + optional cross-cutting list via `core_spines:` (plural) + `schema_anchor:` (REQUIRED). 3-layer doctrine model: L0 csps-core-manifest (root) / L1 sealed core (5 files; CC-equivalent amendment; do_not_expand list) / L2 domain decomposition (~16 files; normal review) / L3 instance registries (5 files; per-session populated).

**Counterweight:** Cross-cutting concerns may declare multiple spines via `core_spines:` plural; primary spine via `core_spine:` singular owns adjudication. Pillars (7 domain-organized) compose orthogonally to spines (5 responsibility-organized) — pillar leaves declare both.

**Source:** S006 turn 7-9 user directive — "the Core is the universal fundamental undebatable things of each core spine" + CSP PLTF_CORE_SPINE_COMPREHENSIVE_GUIDE_S335 absorption (CSP CC-015 + CC-048-A + S331 Bundle 1 Scope A precedent).

**Anti-patterns:**
- missing-core-spine-frontmatter (governed artifact without core_spine field — ORPHAN)
- missing-schema-anchor (governed artifact without schema_anchor — ORPHAN)
- L1-do-not-expand-violation (sealed L1 file gains examples or cross-references)
- spine-precedence-violated (lower-precedence spine overrides higher without ADR)
- cross-spine-collision (artifact citing 2+ spines with conflicting CORE rules)

**Mechanical surfaces (5/5 declared S006 L2):**
- schema: [csps-core-manifest.md](./csps-core-manifest.md) (L0 root) + 5 L1_CORE_<SPINE>.md sealed files (L2c authored) + `core_spine:` / `core_spines:` / `schema_anchor:` frontmatter convention
- validator (atomic registration): `corespine-layer-compliance` + `nothing-stands-alone-audit` + `L1-do-not-expand-violation` + `spine-precedence-conflict-detector` (impl week-4)
- hook: `.claude/hooks/pre-tool-use-spine-citation.sh` (week-4 — refuses Edit/Write to governed artifact without core_spine field)
- memory: [feedback_csp_core_spine_absorptions.md](C:\Users\finky\.claude\projects\c--Users-finky-Desktop-Claude-Code-Csps\memory\feedback_csp_core_spine_absorptions.md)
- contract: this entry + AGENTS.md hard NO + spine matrix row + `principles.yaml#P-ARCH-028`

**Cross-references:** P-ARCH-028 / P-ARCH-013 (universal-traits-trunk-domain-overlays — generalized from persona prompts to all topics) / P-META-007 (FSE — 5 surfaces map to L0/L1/L2 layers) / P-META-015 (template-first applies recursively — every artifact cites template_used) / P-META-016 (gradual-build levels map to spine outward layers).

---
- **enforcement_tier:** `{ tier: session-only, no-hook, no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low (T3-only) }`

---

## B_NAMING_POLICY — names are simple + clear + industry-standard (S006 turn 24)

**Canonical:** CSPS artifacts MUST be named per the 4-rule naming policy at [naming-policy.md](./naming-policy.md): (1) always-current artifacts have no session/version/level suffix in filename — version goes in frontmatter; (2) per-session artifacts include `S<NNN>` suffix; (3) per-topic artifacts use topic-id only; (4) layer-prefixed governance artifacts (L1_CORE / L2_DOMAIN / L3_INSTANCES) preserve load-bearing layer identity. English words preferred over abbreviations except engraved canonical terms (P-META / B_ / FSE / RZF / CEC / HPFA / MUV / AAP / CCA / ZModel / BaseAgent / RLS / PCR preserved). Industry-standard vocabulary preferred (slice / template / audit / validator / registry / manifest / schema / pillar). Renaming requires `git mv` + frontmatter update + grep-and-update inbound references in same commit.

**Counterweight:** Engraved canonical terms (the closed enum above) MUST be preserved — renaming them = constitutional change requiring ADR. Legacy artifacts authored before this engraving (S006 turn 24) are grandfathered until next opportunistic-touch backfill per P-META-006 Layer 1 grandfather protocol; corpus-wide compliance walk queued S007 element-review.

**Source:** S006 turn 24 user directive verbatim — "we must do something with the naming policy. you must make it mechanically enforced that names are simple and clear for human users while using industry standard vocabulary". Triggered by recurring filename suffix drift (e.g., `quick-context-S006-L1.md` mixed always-current-state + session + level — should be `quick-context.md`).

**Anti-patterns:**
- always-current-with-session-suffix (file represents latest state but filename includes -S<NNN>)
- layer-number-in-non-layer-artifact (-L1 / -L2 in filename when artifact is not part of 3-layer doctrine model)
- abbreviation-when-english-word-clearer (tmpl-reg.md instead of template-registry.md)
- synonym-drift (introducing module / feature / component for slice concept)
- canonical-term-renamed-without-adr (renaming P-META-* / B_* / FSE / etc. without ratified ADR)
- forbidden-suffixes (-final / -latest / -current / -new / -old in filename)

**Mechanical surfaces (5/5 declared S006 turn 24):**
- schema: [naming-policy.md](./naming-policy.md) (canonical 4-rule spec) + frontmatter `name:` field on every artifact
- validator (atomic registration): `naming-policy-compliance` (impl week-4)
- hook: `.claude/hooks/pre-tool-use-naming-policy.sh` (PreToolUse — refuses Write/Edit on filenames violating policy; week-4)
- memory: [feedback_naming_policy.md](C:\Users\finky\.claude\projects\c--Users-finky-Desktop-Claude-Code-Csps\memory\feedback_naming_policy.md)
- contract: this entry + AGENTS.md hard NO + spine matrix row + `principles.yaml#P-ARCH-029`

**Cross-references:** P-ARCH-029 / P-META-007 (FSE — naming-policy itself uses 5/5 atomic engraving) / P-META-015 (template-first — naming-policy IS a template for filenames) / P-META-019 (structural-prevention — naming inconsistency caught → fix the policy not the instance) / P-ARCH-013 (universal-traits-trunk-domain-overlays — naming convention IS a universal trait) / P-ARCH-028 (Core Spine — naming-policy ARCH spine primary).

### S007 turn 5 amendment — K=2 closed-enum drift structural fix (Q-2 K=2 promotion)

**K-promotion fired:** B_STRUCTURAL_PREVENTION_DISCIPLINE Q-2 mandate triggered by closed-enum drift recurrence: K=1 was S006 §10.0j #1 (`lifecycle_state: draft` drift on a topic-plan); K=2 was S007 turn 2 (`maturity: active` drift on token-optimization topic-plan). Same anti-pattern (AI guessing closed-enum value from "common pattern" instead of consulting source); different fields. Per Q-2 verbatim — "if an enforment was skipped system will mandatory find enhacement to prevent this from happening" — K=2 mandates **structural engraving, not patch-the-instance**.

**Structural fix engraved S007 turn 5 (5/5 atomic per FSE):**
- **Schema:** new canonical reference [`frontmatter-closed-enums.md`](./frontmatter-closed-enums.md) — mirrors `validate-frontmatter.mjs` constants for pre-write AI consultation
- **Validator (atomic registration):** `frontmatter-closed-enum-drift-prevention` registered in [`audit-runner.md`](./audit-runner.md) Meta section (PR + per-session); composes with existing `frontmatter_validate` post-write detection; impl week-4
- **Hook:** stub [`.claude/hooks/pre-tool-use-frontmatter-enum-check.sh`](../../../.claude/hooks/pre-tool-use-frontmatter-enum-check.sh); week-4 active enforcement
- **Memory:** [`feedback_frontmatter_closed_enum_drift.md`](C:\Users\finky\.claude\projects\c--Users-finky-Desktop-Claude-Code-Csps\memory\feedback_frontmatter_closed_enum_drift.md) + MEMORY.md index entry
- **Contract:** this amendment + AGENTS.md hard NO sub-bullet under B_STRUCTURAL_PREVENTION_DISCIPLINE + ai-behavior-spine.md row update

**Going forward:** AI authoring frontmatter MUST consult [`frontmatter-closed-enums.md`](./frontmatter-closed-enums.md) OR `validate-frontmatter.mjs` constants BEFORE Write/Edit on closed-enum fields. The 7 closed-enum surfaces are: `lifecycle:` / `lifecycle_state:` (top-level) + `domain:` / `type:` / `tier:` / `audience:` / `maturity:` (tag dimensions). Composition-only catch (existing discipline + new mechanical surface) — no new B_* contract needed per b-star-contract template escape hatch.

### S008 turn 8 amendment — Weekly tag-and-status deep audit (recurring-detection mechanism)

**K-promotion fired:** B_STRUCTURAL_PREVENTION_DISCIPLINE Q-2 mandate extended to **scheduled-cadence recurring detection**. Point-in-time validators (`frontmatter_validate` + `aap_frontmatter_coverage`) catch drift at AUTHORING-time but miss POST-authoring evolution drift (closed enums evolve; states linger past SLA; required fields decay). Per CSP file #3 §5 Trigger 2 (P-GOV-24 reassessment) + CSP file #2 §6 smoke test discipline (recurring application closes drift class over months) + EXT-20260505-001-D (5 CSPS reassessment triggers). User S008 GP-S008-07 verbatim directive: *"register a tag and status deep audit each week. place it corrrectly in or along with existing elements"*.

**Structural fix engraved S008 turn 8 (5/5 atomic per FSE):**
- **Schema:** existing [`tag-status-contract.md`](../../_intake/tag-status-contract.md) — 12 closed-enum dimensions + 2 state machines (lifecycle_state per P-META-004 + pipeline_state per P-META-005) + transition rules + SLAs per state. **No schema change needed.** Audit verifies compliance with existing schema.
- **Validator (atomic registration):** `tag-status-deep-audit` registered in [`audit-runner.md`](./audit-runner.md) Meta + [`audit-hub.md`](./audit-hub.md) Pipeline 7 (intake-and-learning) item 11. Weekly cron + on-demand cadence; warn severity. Composes with point-in-time validators (recurring failsafe). Build deferred week-4.
- **Hook:** stub [`.claude/hooks/cron-weekly-tag-status-deep-audit.sh`](../../../.claude/hooks/cron-weekly-tag-status-deep-audit.sh) — week-4 active enforcement (cron mechanism via SessionStart hook adaptation OR external scheduler).
- **Memory:** [`feedback_weekly_tag_status_deep_audit.md`](C:\Users\finky\.claude\projects\c--Users-finky-Desktop-Claude-Code-Csps\memory\feedback_weekly_tag_status_deep_audit.md) + MEMORY.md index entry.
- **Contract:** this amendment (subsection of B_STRUCTURAL_PREVENTION_DISCIPLINE; composition-only — no new B_* contract per template escape hatch matching K=2 closed-enum precedent).

**Going forward:** every 7 days (or on-demand via `bash .claude/hooks/cron-weekly-tag-status-deep-audit.sh`), AI runs the audit; output structured report at `docs/plan/_handoff/VAULT/tag-status-deep-audit-W<NN>.md`; findings route per severity (RED → next-batch fix; YELLOW → accumulate to monthly review; INFO → log only). Composes with EXT-20260505-001-D 5 CSPS reassessment triggers (weekly-cadence trigger added as 6th CSPS reassessment trigger). Composes with CSP file #3 §5 Trigger 2 (Consolidation Pass at reassessment). Honest disclosure: STUB tier S008; week-4 active enforcement.
- **enforcement_tier:** `{ tier: T1+T3, T1 hook: pre-tool-use-frontmatter-enum-check.sh (partial — enum enforcement), no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low-partial }`

---

## B_CONSOLIDATION_PASS — single canonical home + cross-reference protocol

**Canonical wording:**

> Each fact / list / definition / rule / example / procedure lives in ONE canonical home; every other mention cross-references via path-link rather than restates content. Duplication ≥3 occurrences of multi-line fact = consolidation candidate (Detect → Identify canonical home → Replace duplicates with cross-references → Verify content preserved → Smoke test). The 6 duplication patterns ranked by drift-cost: List (A) > Rule (B) > Definition (C) > Example (D) > Cross-section reference (F) > Citation (E). Cross-reference cost > duplication cost ONLY when occurrences <3; below that threshold, leave alone.

**The 5-step Consolidation Pass protocol:**

1. **Detect** — grep + structural review for duplicate facts/lists/definitions across governed artifacts
2. **Identify canonical home** — pick the natural single source-of-truth section (existing leaf preferred; new leaf only if no natural home)
3. **Replace duplicates with cross-references** — `see [FILE.md](path) §X` markdown link format
4. **Verify content preserved** — re-read; no information loss; cross-references resolve
5. **Smoke test** — confirm L1/L2/L3 read protocols still work; no broken pointers (per [depth-discipline.md](./depth-discipline.md) S009 L1.1)

**The 6 duplication patterns (severity ranked):**

| Pattern | Type | Drift severity | Detection |
|---|---|---|---|
| **A** | List duplication | HIGH (drift on update; visible only after fact) | grep multi-line tabular content |
| **B** | Rule duplication | MEDIUM (drift on policy change; high-cost late) | grep imperative phrases ("MUST" / "Never" / "Always") |
| **C** | Definition duplication | MEDIUM (drift on refactor; subtle accumulates) | grep noun-phrase definitions |
| **D** | Example duplication | LOW freq + high-cost per drift | grep code blocks + sample data |
| **F** | Cross-section reference duplication | LOW (silent drift; only validator-caught) | resolve-and-compare cross-refs |
| **E** | Citation duplication | LOWEST (least drift-prone) | grep external links + ADR references |

**Trigger points (when to fire 5-step pass):**

- After every comprehensive guide >500 lines authored (same-batch)
- At every reassessment trigger (per [EXT-20260505-001-D](../_handoff/VAULT/contexts/governance/priority-engine/EXT-20260505-001-D-7-reassessment-triggers.md) — 5 CSPS-adapted triggers)
- At every weekly `tag-status-deep-audit` cron firing (S008 turn 8 5/5 atomic — composes per recurring-detection mechanism)
- When K=2 duplication-pattern fires (per [B_STRUCTURAL_PREVENTION_DISCIPLINE](#b_structural_prevention_discipline) Q-2 promotion)

**Counterweight:**

> When duplication is intentional (rigid-vs-flex per [EXT-20260505-002-F](../_handoff/VAULT/contexts/governance/operational-discipline/EXT-20260505-002-F-4-batch-close-file-depth-rigid-flex-5-prevention-10-scenario.md)) — e.g., glossary terms restated for accessibility / governing principles re-cited at batch boundaries / safety-critical instructions repeated for redundancy — declare `consolidation_exempt: true` in frontmatter with reason. Counter-cases per [EXT-20260505-003-D](../_handoff/VAULT/contexts/governance/anti-duplication/EXT-20260505-003-D-when-NOT-to-consolidate-counter-cases.md) override the single-canonical-home rule.

**Source:** EXT-20260505-003-A (CSP file #3 §2 single rule + §3 6 patterns + §4 5-step protocol). Q2=B confirmed S009 — CSPS-native shape (cross-references EXT source rather than copies CSP phrasing verbatim). Engraved S009 L1.3 atomic per FSE.

**Anti-patterns:**

- Authoring new comprehensive guide that restates content from existing leaves (Pattern A/C drift seed)
- Adding "see also" reference instead of cross-reference link (silent drift; Pattern F)
- Restating depth-discipline rules across multiple docs (Pattern B; per [depth-discipline.md §5](./depth-discipline.md) anti-patterns)
- Mass-backfill consolidation pass triggering bulk edits during active development (per counter-case 6: apply going-forward; backfill at next-touch-anyway)
- Cross-reference cost exceeds duplication cost (occurrences <3) — leave alone; over-consolidation = anti-pattern
- Engraving a parallel canonical home when existing leaf could be extended (per [P-OP-001 reuse-first](../../../packages/principles/principles.yaml) recursive)

**Mechanical surfaces (5/5 atomic per FSE — S009 L1.3):**

- **schema:** `consolidation_exempt: bool` + `consolidation_cross_refs: [<path>...]` frontmatter fields (extension week-4)
- **validator:** [`consolidation-pass-coverage` audit slug](./audit-runner.md) — registered S009 L1.3 atomic; impl week-4 — grep-based duplicate detection ≥3 occurrences flags consolidation candidates
- **hook:** [`.claude/hooks/post-stop-consolidation-pass.sh`](../../../.claude/hooks/post-stop-consolidation-pass.sh) — STUB; PostStop scan after comprehensive-guide commits (DEFERRED to L1.6 governor-permission ASK batch per popup discipline memory entry 44)
- **memory:** [`feedback_consolidation_pass.md`](../../../C:/Users/finky/.claude/projects/c--Users-finky-Desktop-Claude-Code-Csps/memory/feedback_consolidation_pass.md) + MEMORY.md index entry — engraved S009 L1.3
- **contract:** this entry + AGENTS.md "Engraving + ratification" hard-NO row (S009 L1.3 amendment) + cross-reference at [depth-discipline.md §5](./depth-discipline.md) anti-patterns table

**Cross-references:** P-OP-001 reuse-first (composes; B_CONSOLIDATION_PASS is operational application of reuse-first to fact-content not just artifacts) / B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK (sister discipline; precedent-check-before-create + consolidation-pass-after-discover-duplicate) / B_STRUCTURAL_PREVENTION_DISCIPLINE Q-2 (K=2 duplication promotion mechanism) / B_TEMPLATE_FIRST_CREATION (templates pre-include cross-ref fields) / EXT-20260505-003-A through 003-D (4 source extracts).
- **enforcement_tier:** `{ tier: session-only, no-hook, no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low (T3-only) }`

---

## B_SAVINGS_AND_SSOT_UNIFIED — savings and SSoT are the same discipline

**Canonical wording:**

> Savings (avoid redundant token spend) and SSoT (avoid redundant content) share ONE root: no duplication of effort or data. If a fact lives in N places, both savings AND integrity suffer (N reads cost N× tokens; N updates risk drift). The unified rule: *each fact lives in ONE canonical home; cross-reference everywhere else; canonical home is a SCHEMA field where possible; bundling orchestrator consumes; validator enforces.* Treating savings and SSoT as ONE discipline yields ONE mechanical layer addressing both axes simultaneously — one validator pass measures both; one recurring discipline at Phase 10; one umbrella under existing P-META-009 Cognitive Context Architecture.

**Counterweight:**

> When intentional duplication serves quality (per [B_CONSOLIDATION_PASS counterweight](#b_consolidation_pass) + [EXT-20260505-003-D counter-cases](../_handoff/VAULT/contexts/governance/anti-duplication/EXT-20260505-003-D-when-NOT-to-consolidate-counter-cases.md)) — glossary terms restated for accessibility / safety-critical instructions repeated for redundancy / cardinal directives re-cited at batch boundaries — declare `consolidation_exempt: true` + reason. The unification doesn't override quality counter-cases; it surfaces them more visibly because EVERY duplication now has a single reason-to-justify rather than separate token-budget vs SSoT justifications.

**The unification map:**

| Axis | Existing CSPS discipline | Composition under B_SAVINGS_AND_SSOT_UNIFIED |
|---|---|---|
| **Savings** (token-budget reduction) | [B_TOKEN_BUDGET](#b_token_budget) (P-META-009 extension; S007 turn 4) — 5 operating rules R1-R5 | R1 (default L1 depth) + R2 (model tiering) + R5 (tool-output-summary-first) ARE savings expressions of the unified rule |
| **SSoT** (single canonical home) | [B_CONSOLIDATION_PASS](#b_consolidation_pass) (S009 L1.3) — 5-step pass + 6 patterns | The 5-step protocol IS SSoT-axis enforcement of the unified rule |
| **Schema** (canonical home as data) | [frontmatter-closed-enums.md](./frontmatter-closed-enums.md) (S007 turn 5) — closed-enum constants in validate-frontmatter.mjs | Canonical-home-as-SCHEMA-field IS the highest-leverage unification mechanism per EXT-005-A §2 |
| **Bundling orchestrator** (consumer) | [PE.read_budget extension](../_handoff/VAULT/contexts/governance/depth-discipline/EXT-20260505-004-C-bundling-orchestrator-pe-read-budget-extension.md) (Phase 9 / S012 build) | Consumes per-artifact depth declarations + cross-refs to bundle reads |
| **Validator** (enforcer) | [`consolidation-pass-coverage` audit](./audit-runner.md) + [`token-budget-*` 5 audits](./audit-runner.md) (S007 + S009 atomic) | One Phase 9 measurement validator measures BOTH axes per pass |

**Source:** EXT-20260505-005-A (CSP file #5 §2 unified principle + §5 single rule). Q3=A confirmed S009 — new B_* contract anchored to existing P-META-009 (NO principle amendment; minimum-blast-radius). Engraved S009 L1.4 atomic per FSE.

**Anti-patterns:**

- Treating savings and SSoT as separate disciplines (the pre-S009 CSPS state — token-optimization topic-plan + Anti-Duplication EXT independent)
- Building separate Phase 9 validators for token-budget vs duplication detection (one pass should measure both)
- Justifying duplication on token-budget grounds without SSoT counter-case (or vice versa) — both axes must clear together
- Engraving new B_* under different principle (this contract anchors to P-META-009; other principle = drift)
- Mass-backfill SSoT cleanup mid-development (per [B_CONSOLIDATION_PASS](#b_consolidation_pass) counter-case 6: apply going-forward; backfill at next-touch)

**Mechanical surfaces (5/5 atomic per FSE — S009 L1.4):**

- **schema:** `consolidation_exempt: bool` + `consolidation_exempt_reason:` frontmatter (shared with B_CONSOLIDATION_PASS) + `canonical_home_field: <path>` declaration field for unified-rule SCHEMA-as-canonical-home semantic (extension week-4)
- **validator:** [`savings-ssot-coverage` audit slug](./audit-runner.md) — registered S009 L1.4 atomic; impl Phase 9 (S013) — single-pass measurement of both axes per pre-comprehensive-guide commit + weekly cron
- **hook:** [`.claude/hooks/post-stop-savings-ssot-coverage.sh`](../../../.claude/hooks/post-stop-savings-ssot-coverage.sh) — STUB; PostStop measurement bridge (DEFERRED to L1.6 governor-permission ASK batch per popup discipline)
- **memory:** [`feedback_savings_ssot_unified.md`](../../../C:/Users/finky/.claude/projects/c--Users-finky-Desktop-Claude-Code-Csps/memory/feedback_savings_ssot_unified.md) + MEMORY.md index entry — engraved S009 L1.4
- **contract:** this entry + AGENTS.md "Engraving + ratification" hard-NO row addition (S009 L1.4 amendment) + cross-references at [B_TOKEN_BUDGET](#b_token_budget) + [B_CONSOLIDATION_PASS](#b_consolidation_pass) (composition declarations same-batch)

**Cross-references:** P-META-009 Cognitive Context Architecture (parent principle; B_SAVINGS_AND_SSOT_UNIFIED extends; NO new principle per Q3=A) / B_TOKEN_BUDGET (savings axis; sister contract) / B_CONSOLIDATION_PASS (SSoT axis; sister contract; S009 L1.3) / B_COGNITIVE_CONTEXT_DISCIPLINE (parent at P-META-009; both children compose) / B_STRUCTURAL_PREVENTION_DISCIPLINE Q-2 (drives recurring detection) / EXT-20260505-005-A (source) + EXT-20260505-005-B (7 disciplines + 4 architectural elements catalog) + EXT-20260505-005-C (schema-of-schemas index — Phase 8/9 extension).

## How to add a new contract

1. Append a new section here with the same shape (canonical wording + counterweight + source + anti-patterns + mechanical-surfaces).
2. Add a row to the `ai-behavior-spine.md` discipline matrix.
3. Schedule any missing surface (memory entry / hook / validator / schema field).
4. Cross-reference in AGENTS.md if the contract introduces a hard NO.
5. The audit `discipline-engraving-completeness` (planned week 4) will pick up the new row at next PR.

### S005 amendment — atomic validator-surface registration (B_FIVE_SURFACE_ENGRAVING strengthening)

**Surfaced by S005 §C3.1 audit-registry validation pass:** the 5-surface engraving cycle was producing **dangling validator references by default**. When a B_* contract was engraved with "validator surface deferred week-4", the validator slug landed in `principles.yaml#<P-*>.enforcers` + `ai-behavior-spine.md` matrix row + memory + AGENTS.md NO + this contracts file — but NEVER in `audit-runner.md` registry. S005's cross-check found 30 such dangling refs accumulated across sessions; the count was monotonically growing because every new B_* engraving added another.

**Amendment (mandatory for new B_* contracts going forward):**

When the validator-surface delta is designed in step 3 of "How to add a new contract" above, the slug **MUST** be registered in `audit-runner.md` in the **same response/commit** as the rest of the engraving — even if the actual implementation file (`libs/audits/checks/<slug>.ts`) is deferred. The split:

- **REGISTRATION (mandatory atomic):** `audit-runner.md` table row in the appropriate category (Meta / AI Behavior / Catch+Engraving / Status / etc.) with slug + cadence + severity + 1-line description + cross-reference back to the principle/contract.
- **IMPLEMENTATION (deferral allowed):** `libs/audits/checks/<slug>.ts` + actual scanner logic + test fixtures. Marker `(planned week-4)` or specific session deferral in the description.

**Why this matters (compounding-vs-incremental):**

Without atomic registration, every B_* engraving structurally produces a dangling ref. Across 100 sessions × N new contracts each, that's a monotonically-growing audit-registry debt that requires its own bulk-fix sessions to drain. Atomic registration means the debt never accumulates. **This is the single highest-leverage stability fix from S005 — every future engraving inherits the discipline without manual sync.**

**Procedure (engraving cycle update):**

The old step 3 ("Schedule any missing surface") is replaced with:

3a. **Surface 1 — Schema:** add closed-enum value / frontmatter field / state-machine transition.
3b. **Surface 2 — Validator REGISTRATION** (atomic; required this commit): add row to `audit-runner.md` registry table.
3c. **Surface 2' — Validator IMPLEMENTATION** (deferral allowed; mark with deferral note): add file at `libs/audits/checks/<slug>.ts` OR mark "deferred week-4" in description.
3d. **Surface 3 — Hook:** add `.claude/hooks/*.sh` (or mark deferred).
3e. **Surface 4 — Memory:** add `feedback_<slug>.md` + MEMORY.md index entry.
3f. **Surface 5 — Contract:** add section here + cross-reference in AGENTS.md hard NO + spine matrix row.

The 5-surface cycle remains; what changes is that **3b cannot be deferred** — the registry entry is the proof that the surface is "engraved" rather than only "intended". Registration is cheap (10-line table row); implementation is expensive (audit logic + tests). Decoupling them protects the registry as the always-current source of truth.

**Source:** S005 §C3.1 finding documented in [gaps-and-duplications-S005.md](../../_handoff/VAULT/gaps-and-duplications-S005.md). Engraved S005 turn 18 per the user's "completion + stability + scalability" review-and-close directive.

**Forward-prevention:**

- New B_* contracts in S006+ that violate 3b are caught by `audit-of-audits-fse` (planned week-4 — when audit-runner ships, will scan for `principles.yaml#<P>.enforcers` ci-check entries pointing to slugs absent from `audit-runner.md` tables).
- The 30 dangling refs from gaps-and-duplications-S005.md are the BACKFILL bulk-fix; addressing them in S006 §C3.1 + this amendment together close the structural compounding.
- **enforcement_tier:** `{ tier: session-only, no-hook, no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low (T3-only) }`

---

## B_NO_IMPLEMENTATION_WITHOUT_PLAN — no code changes to libs/ or apps/src/ outside a ratified plan (Session A S022)

**Canonical wording:**

> No code changes to `libs/` or `apps/*/src/` outside of an active ratified plan (lifecycle_state: active in docs/plan/_handoff/VAULT/topic-plans/). Exception: emergency security fixes documented immediately after in a post-hoc plan entry. Developer agility is preserved: for obvious in-scope changes that clearly fall within an existing plan's mandate, proceed and document. The gate is ADVISORY — it warns, does not block. Promotion to BLOCKING at Session B after plan scope audit confirms all active plans have covered_paths.

**What counts as a ratified plan:**
- lifecycle_state: active in topic-plans/
- ratification_status: RATIFIED or Governor directive documented
- NOT sufficient: draft plans, informal chat decisions, "it's obvious"

**Counterweight (engineer judgment):**
When the change is clearly within scope of an existing active plan AND the plan mandate covers it → proceed with a brief note in the commit message citing the plan. Example: "Per platform-excellence-completion-S023.md Session A."

**Mechanical surfaces (5/5 S022 Session A):**
- schema: `zf_required_level` + `ccg_assessment` fields in plan frontmatter
- validator: `validate-consolidation-check.mjs` (§0 section required in plans)
- hook: `.claude/hooks/pre-tool-use-plan-coverage-gate.sh` (ADVISORY → BLOCKING Session B)
- memory: `feedback_no_wild_implementation.md` + MEMORY.md
- contract: this entry + over-the-system-audit-S022.md §4 Resolution Protocol

**Source:** Session A of platform-excellence-completion-S023.md. Governor ratified 2026-05-11.
- **enforcement_tier:** `{ tier: session-only, no-hook, no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low (T3-only) }`

---

## B_INTENT_CRYSTALLIZATION — no implementation without validated intent (S023 — CONSTITUTIONAL)

**Canonical wording:**

> No implementation work begins — for any wizard, protocol, audit, or UX/UI artifact — without first crystallizing the true intent behind the initial request. The initial user expression is ALWAYS a draft. The platform transforms draft → accurate definition through: open question → AI interpretation → 1-3 targeted clarifying questions → verified wizard template match → declaration. "Accurate goal setting prevents multiple drifts."

**The 4 domains this applies to:**

1. **WIZARDS:** Open question ("What's on your plate?") → AI interprets → 1-3 questions → WIZARD_TEMPLATES match → threshold_route: declared → intent_crystallized: true
2. **PROTOCOLS:** WHY documented before WHAT → each protocol step has an explicit acceptance_criterion → cannot declare DONE without evidence
3. **AUDITS:** Exit criteria (ZF level, counts, assertions) defined BEFORE building the audit → Wizard-of-Oz simulation if user-facing → measurable definition of "clean"
4. **UX/UI:** jtbd_outcome: stated before any screen design → ux_principle: declared in every page.tsx → mobile-first constraint before desktop → one decision per screen

**What triggers this contract:**
- Any new plan creation (requires threshold_route + intent_crystallized)
- Any new page.tsx (requires ux_principle declaration)
- Any new protocol (requires WHY + acceptance criteria)
- Any new audit (requires measurable exit criteria + ZF level)

**Counterweight:**
Trivial bug fixes and mechanical updates (updating a count, fixing a typo, archiving a plan) are exempt. Only work with implementation scope > 1 file requires crystallization.

**Mechanical surfaces (5/5 S023):**
- schema: `threshold_route:` + `intent_crystallized:` + `jtbd_outcome:` + `ux_principle:` fields in frontmatter-closed-enums.md
- validator: `validate-intent-crystallized.mjs` (BLOCKING for deep_quality plans without field) + `validate-routing-declared.mjs` (ADVISORY) + `validate-ux-principles-declared.mjs` (ADVISORY)
- hook: `pre-tool-use-intent-gate.sh` (ADVISORY — fires on plan creation without threshold_route)
- memory: `feedback_intent_crystallization_first.md` + MEMORY.md entry
- contract: this entry + AGENTS.md hard NO sub-bullet

**governing_intent:** Ensures the platform closes the gap between what humans say and what they need — acting on first expressions without crystallization produces the wrong thing at high quality, which is worse than producing nothing.

**The UX/UI moat:**
Every screen is customer-hired-for-a-job. Mobile-first is the constraint that forces simplicity. Progressive disclosure is the delivery mechanism. Example-driven classification is the anti-label technique. Wizard-of-Oz validation is the proof standard before automation. These are not suggestions — they are the platform's customer-facing DNA.

**Source:** Governor directive S023 — "this is another moat — strong focus on customers." Platform DNA: all construction transforms initial draft → accurate definition.

**P-META-022 constitutional upgrade (S023):**
B_INTENT_CRYSTALLIZATION is the operational CONTRACT. P-META-022 is the governing PRINCIPLE.
The principle establishes WHY this matters (Layer 1-3 gap, compounding drift equation).
The contract defines HOW it operates (wizard match, threshold_route, intent_crystallized field).
See: [human-intent-crystallization.md](./human-intent-crystallization.md) for the constitutional framing.
The 26-item checklist (B/C/I/R/M) in [threshold-intake-protocol.md](./threshold-intake-protocol.md) is the operational HOW at deeper resolution.

**P-META-024 compose (S027 — SEALED Opus Turn 16):**
When a single expression contains N>1 topics, P-META-024 decomposes BEFORE B_INTENT_CRYSTALLIZATION fires.
Sequence: P-META-024 (decompose N topics) → per-topic → B_INTENT_CRYSTALLIZATION (crystallize each).
This contract is the per-topic gate; P-META-024 is the multi-topic pre-step.
- **enforcement_tier:** `{ tier: session-only, no-hook, no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low (T3-only) }`

---

## B_SANDBOX_BEFORE_IMPLEMENTATION — no code without a ratified, simulated sandbox spec (S023 — CONSTITUTIONAL)

**Canonical wording:**

> No implementation work begins without a sandbox spec that has been (1) fully written, (2) verified through real simulation, and (3) explicitly ratified by the Governor. The sequence DRAFT → SANDBOX → SIMULATED → RATIFIED → IMPLEMENTING is mandatory. Skipping any stage is prohibited. Code is written from the ratified spec, not from verbal descriptions or chat discussions.

**The three gates:**

1. **SANDBOX GATE:** Full spec written at `docs/plan/_sandbox/[name]-v[N].md` before implementation begins.
   The spec must cover: every screen/step, every word, every condition, all failure cases.

2. **SIMULATION GATE:** Spec verified against 3+ real scenarios. `simulation_status: pass` required.
   Different simulation methods by type: Wizard-of-Oz (UX), test run (validators), narrative walkthrough (protocols).
   If simulation fails → fix spec → re-simulate. Never implement from a failed simulation.

3. **RATIFICATION GATE:** Governor explicitly approves: "implement this" or equivalent.
   Only the Governor can ratify. AI cannot self-ratify.

**What "real simulation" means:**
Simulation is EXECUTION, not reading. Execute the spec against a scenario. Document what happened. If the spec produced the right outcome for all 3+ scenarios → simulation_status: pass.

**If implementation needs to deviate from the spec:**
STOP. Create a new sandbox version (v2, v3...). Re-simulate if scope changed. Re-ratify. Then continue.

**Counterweight:**
Trivial fixes (typo, count update, linting) are exempt. Only work that could produce unexpected outcomes requires sandbox.

**Mechanical surfaces (5/5 S023):**
- schema: `lifecycle_state: sandbox|simulated|ratified|implementing|implemented` in frontmatter + `simulation_status: pending|pass|fail` in LIFECYCLE_STATE_VALUES
- validator: `validate-simulation-before-implementation.mjs` (ADVISORY now, BLOCKING S024+) + `validate-sandbox-lifecycle.mjs` (ADVISORY)
- hook: `pre-tool-use-sandbox-gate.sh` (TO BUILD — advisory when implementation detected without sandbox)
- memory: `feedback_sandbox_before_implementation.md` + MEMORY.md
- contract: this entry + sandbox-ratification-policy.md §4 Non-Negotiable Rules

**Source:** Governor directive S023 — "implement only from a ratified plan after verifying all in a real simulation status." Platform policy: sandbox-ratification-policy.md.
- env-local-as-credentials (.env.local with real values = laptop dependency; use Vercel env vars)
- pnpm-dev-in-procedure ("pnpm dev" in a deployment procedure = laptop dependency; use vercel --prod)
- localhost-test-url ("localhost:PORT" as test URL = laptop dependency; use Vercel preview URL)
- local-only-migrations (prisma db push from laptop = laptop dependency; use Vercel build hook or Supabase CLI)
- **enforcement_tier:** `{ tier: session-only, no-hook, no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low (T3-only) }`

---

## B_APPS_ARE_TRIALS — apps/* are ephemeral trials, libs/* is permanent core (S029)

**Canonical:** `apps/*` directories are EPHEMERAL TRIAL ARTIFACTS — proofs-of-concept that the platform works. They can be deleted and recreated from `apps/template/` + platform core at any time without losing platform value. The permanent platform core is: `libs/*`, `tools/*`, `.claude/core-spines/*`, `docs/plan/pillar-0-governance/*`, `packages/*`. Every reusable pattern discovered while building an app MUST be extracted to `libs/` before the session closes. The extraction cycle: (1) discover pattern in app, (2) extract to libs/, (3) app imports from libs/, (4) pattern survives even if app is deleted.

**Governing intent:** The platform is the moat. Apps prove the moat works. Every session the moat grows and apps stay thin. An app deleted tomorrow costs nothing. A lib deleted tomorrow costs everything.

**Component A / Component B (every fix has both):**
- **Component A (S2 — ephemeral):** Fix in the app. Fast, proves it works.
- **Component B (S1 — permanent):** Extract the pattern to `libs/` or `apps/template/`. Mandatory. Without B, the fix dies when the app is rebuilt. Every future app (App #3–#30) gets the fix for free.

**Deletion test = Component B completion signal:** `rm -rf apps/{app}/` must lose zero platform value. If value would be lost, Component B was skipped.

**Counterweight:** App-specific UI, domain logic (budget categories, task labels), and per-app config (vercel.json per app) BELONG in `apps/*` — not extraction candidates. Only patterns duplicated in App #3, #4, etc. require extraction to `libs/`.

**Source:** Governor S029 directive — "Budget Planner must be treated as an external trial not affecting CSPS core. Apps we have now are elements to be deleted and recreated. All pointing inwards to enhance universal platform core."

**Anti-patterns:**
- platform-procedure-in-app-folder (gate-3-procedure.md inside apps/budget-planner/ — caught S028)
- universal-credentials-in-specific-app (sync-vercel-env.mjs conceived as app-specific — caught S028)
- reusable-query-pattern-in-app-only (balance groupBy pattern kept in route.ts instead of libs/)
- schema-migration-in-app (prisma/schema.prisma inside apps/* instead of libs/policies/)

**Mechanical surfaces (4/5 declared S029):**
- memory: `~/.claude/projects/.../memory/project_apps_are_trials.md` (survives chat moves)
- instruction-file: `AGENTS.md` hard NO — B_APPS_ARE_TRIALS
- contract: `docs/plan/pillar-0-governance/behavioral-contracts/B_APPS_ARE_TRIALS.md` (canonical)
- validator (atomic registration): `app-scope-isolation` (impl week-4)
- principle: P-ARCH-030 in principles.yaml
- **enforcement_tier:** `{ tier: session-only, no-hook, no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low (T3-only) }`
