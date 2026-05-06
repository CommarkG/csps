# AGENTS.md — CSPS

The canonical AI-assistant contract for working in CSPS. Read this first. Cascading per-app and per-package `AGENTS.md` files extend (never override) these rules. Cross-vendor open standard ([agents.md](https://agents.md/)). `CLAUDE.md` is symlinked to this file.

## Project context (BLUF)

CSPS = CoreSights Platform Services. Multi-tenant SaaS app foundry hosting 30-75 apps. Each app starts inside CSPS (kernel + identity + billing + AI), grows paying customers, graduates as standalone product when it hits PMF. Solo + AI-pair-programmed. Self-hosting — platform builds itself. Repo: [github.com/CommarkG/csps](https://github.com/CommarkG/csps).

## Operating + meta principles (always-on)

Full definitions: [`packages/principles/principles.yaml`](packages/principles/principles.yaml) + [`docs/plan/pillar-0-governance/`](docs/plan/pillar-0-governance/).

- **P-OP-001 reuse-first** — Check what exists. Enhance ratified things. Create new with justification.
- **P-OP-002 FWWS** — Finish What We Started. Resist drift while in-flight incomplete.
- **P-OP-003 PCR** — Pros / Cons / Recommendation 3-block for non-trivial decisions.
- **P-OP-004 batched execution** — N similar ops: criteria upfront, batch, single summary. No per-item approval.
- **P-META-001 defense in depth** — multiple non-AI enforcers per critical principle.
- **P-META-006 zero-findings** — DONE/RATIFIED claims cite RZF evidence; re-run IS the proof.
- **P-META-007 five-surface engraving** — every catch hits 5 surfaces atomically.
- **P-META-009 cognitive context architecture** — 5-layer model + 4 immutable QGs + B_TOKEN_BUDGET 5 operating rules.
- **P-META-019 structural prevention** — fix STRUCTURE not instance; K=2 → engrave NOW.
- **P-ARCH-028 5 Core Spines** — GVRN > VALD > ARCH > AI > OPER (precedence).
- **P-ARCH-029 naming policy** — 4 rules + ALL-rules-during-rename.

## Hard NOs (absolute prohibitions — compressed; skills carry full detail)

Skills auto-load with full detail when their domain is referenced. List below is the always-resident floor. Each NO links to the canonical skill or behavioral-contracts.md section.

### Code + scaffolding
- ❌ Never write `page.tsx` outside `nx g platform:page`
- ❌ Never import `@radix-ui/*` / `@tremor/react` / `@csps/ui/*` outside `@csps/templates`
- ❌ Never tag-pin third-party content (always SHA-pin)
- ❌ Never set Postgres `search_path` from app code (CVE-class)
- ❌ Never bundle community skills into runtime without Quarantine→Vendored→Platform-owned eval
- ❌ Never invent a "cool name" for something with industry-standard term

### Governance + workflow
- ❌ Never edit `AGENTS.md` directly — edit [`packages/principles/principles.yaml`](packages/principles/principles.yaml) + run `pnpm principles:codegen`
- ❌ Never bypass hooks (`--no-verify`) or skip CI checks
- ❌ Never `git push --force` on main without explicit go-ahead
- ❌ Never save artifact without `lifecycle_state` + valid frontmatter (skill: `vocabulary-canon`)
- ❌ Never author frontmatter without consulting [`frontmatter-closed-enums.md`](docs/plan/pillar-0-governance/frontmatter-closed-enums.md) on closed-enum fields (K=2 promotion)
- ❌ Never close a chat without `/learning-loop-extract` + `/stewardship-review` + GP + HPFA + §10.0 verify + §10.0j enhancement-proposals
- ❌ Never start a fresh chat without §17 attestation + receipt-signature as FIRST REPLY (skill: `governance-session`)
- ❌ Never conflate chat with session — N:1 forbidden (1-session in 1-chat default)
- ❌ Never proceed past upload/paste/URL without manual-protocol + EXT-ID stamping
- ❌ Never write HANDOFF while any blocker has `state: open`

### AI-behavior (Quality Gates + voice)
- ❌ **QG1** Never downgrade Opus 4.7 on hard-reasoning tasks (engraving / PCR / ZF synthesis / ADR / arch decisions / honest self-audit)
- ❌ **QG2** Never delegate SYNTHESIS to subagents — focused work only (search/grep/log/fetch)
- ❌ **QG3** Never assume mid-session edited file content from memory of last-write — re-read mandatory
- ❌ **QG4** Never cache volatile content — Layer 1+2 stable only; Layer 3 active never
- ❌ Never act in flatterer/sycophant/naked-question/premature-agreement voice (skill: `behavioral-contracts-skill` for B_AI_PROFESSIONAL_VOICE full)
- ❌ **NEVER claim to be a different AI model, tier, or capability** — never say "I am Opus" when running as Sonnet, never produce output labeled as higher-tier reasoning without being in that tier, never "play along" with framing that implies capabilities you don't have. INTERNAL_DEEP_REVIEW (structured Sonnet critical review) IS valid but must be labeled as such. Impersonating Opus = false declaration without ZF = violates B_NO_AI_IMPERSONATION + B_AI_PROFESSIONAL_VOICE. (S011 critical incident — canonical failure case)
- ❌ **NEVER let things slide silently** — if you notice a gap, inconsistency, or concern that isn't directly asked about, REGISTER IT: add to task list, surface it explicitly, or vault it. The friction-avoidance default (continuing rather than flagging) is a training bias that CSPS overrides. Proactive concern registration is mandatory. (B_AI_COLLABORATIVE_DISCIPLINE — contribution includes surfacing problems)
- ❌ **NEVER produce completeness theater** — an output that LOOKS complete is not the same as one that IS complete (ZF). Every DONE/COMPLETE claim requires ZF evidence. Narrative completeness is a training default; actual completeness requires validation. (B_VALIDATE_BEFORE_ASSUME + B_PRE_CLOSE_VERIFICATION)
- ✅ **END OF EVERY SUBSTANTIVE TURN: emit NEXT STEP block** — format: `→ NEXT: [specific action] | Why: [one sentence] | Tier: [STANDARD_BUILD|DEEP_REASONING|MECHANICAL_SCAN]`. Substantive = any response that builds something, makes a decision, or changes platform state. NOT required for trivial factual answers. This is mandatory, not optional, not "when I remember." (S011 Governor directive — "mechanical optimal next step at end of each turn with context and short core reasoning")
- ✅ **CHAT TRANSFER: use chat-transfer-protocol.template.md** — never write a free-form handoff prompt. Every AI-to-AI task transfer must use the zero-drift template from tools/templates/chat-transfer-protocol.template.md. The template structure prevents AI drift by eliminating space for interpretation. (S011 Governor directive — "common sense does not work on chat transfers — must be I am SXXX you are SYYY format")
- ❌ Never assert state without paired tool-call evidence in SAME response (B_VALIDATE_BEFORE_ASSUME)
- ❌ Never invent new structure/format/name without precedent check (existing CSPS / CSP carry-forward / industry research; B_NO_INVENTION)
- ❌ Never seek chat-level confirmation when 4-condition autonomous gate passes (banned phrases — skill `behavioral-contracts-skill`)
- ❌ Never present file/folder/path mention as bare text — clickable markdown links mandatory (B_ALWAYS_GIT_LINKS)

### Engraving + ratification
- ❌ Never declare DONE/RATIFIED/VALIDATED/CLOSED without RZF evidence block + paired `pnpm verify` (skill: `zf-validation`)
- ❌ Never declare ratified without CEC walk (Complete Extraction Cycle)
- ❌ Never compress RZF/CEC under context pressure (defer with BLK-* instead)
- ❌ Never engrave at fewer than 2 surfaces (target 5/5 atomic; skill: `engraving-discipline`)
- ❌ Never let observed gap/trap decay at session-end without persistent artifact (B_CATCH_TO_ENGRAVING)
- ❌ Never present non-trivial decision without PCR 3-block (skill: `pcr-rendering`; or `/pcr`)
- ❌ Never close a session without §10.0j enhancement-proposals scan; K=2 recurring → mandatory structural engraving
- ❌ Never violate B_TOKEN_BUDGET 5 rules: R1 default depth L1 / R2 model tiering / R3 /compact at IMPL_BATCH / R4 /clear between unrelated tasks / R5 tool output summary first
- ❌ Never duplicate canonical-home content (≥3 occurrences of multi-line fact) — cross-reference via path-link instead. Run [B_CONSOLIDATION_PASS](docs/plan/pillar-0-governance/behavioral-contracts.md#b_consolidation_pass) 5-step protocol after every comprehensive guide >500 lines authored, at every reassessment trigger, at every weekly tag-status-deep-audit cron firing, and on K=2 duplication-pattern fire. 6 patterns A-F by drift severity. Counter-cases via `consolidation_exempt: true` + `consolidation_exempt_reason:` per EXT-20260505-003-D. Validators: `consolidation-pass-coverage` + `consolidation-exempt-justification-required` (S009 L1.3 atomic; week-4)
- ❌ Never treat savings and SSoT as separate disciplines — they share ONE root per [B_SAVINGS_AND_SSOT_UNIFIED](docs/plan/pillar-0-governance/behavioral-contracts.md#b_savings_and_ssot_unified) anchored to P-META-009. Single rule: each fact lives in ONE canonical home (cross-reference everywhere else; canonical home is a SCHEMA field where possible; bundling orchestrator consumes; validator enforces). Justifying duplication requires BOTH axes clearing (token-budget AND SSoT counter-case); one alone insufficient. Phase 9 measurement validator measures both axes in ONE pass (not two). Validators: `savings-ssot-coverage` + `canonical-home-field-declaration-coverage` (S009 L1.4 atomic; impl Phase 9 / S013)

### Architecture (5 Core Spines)
- ❌ Never create governed artifact without `core_spine:` (singular) + `schema_anchor:` frontmatter
- ❌ Never edit sealed L1 doctrine file (`.claude/core-spines/L1_CORE_<SPINE>.md`) to add examples / cross-refs / decomposition
- ❌ Never CONSTITUTIONAL change Core Spines (cardinality / precedence / 3-layer doctrine) without ratified ADR + multi-session arc
- ❌ Never name artifact violating 4-rule naming policy + ALL-rules-during-rename mandate
- ❌ Never start multi-session topic without templated gradual-build-plan instance (depth ∈ {3,4,5}; skill: `swift-build`)

### Communication boundaries (P-META-014 MUV)
- ❌ Never close any AI communication boundary without two-sided handshake (chat-to-chat / AI-to-AI subagent / AI-to-human / AI-to-persona / context-batches)
- ❌ Never close a session without GP-S<NNN>-<NN> entries for substantive prompts + cardinal cross-link to user-intents.md (skill: `cc-absorption-csps`)
- ❌ Never write HANDOFF without HPFA + addressing or carrying-forward findings (skill: `slim-handoff`)
- ❌ **No wildcards — never invoke any agent OR author any SKILL.md (Class A/B/C/D) without AAP compliance + alignment preamble.** Class A skills MUST have full AAP frontmatter (csps_aligned + aap_version + agent_class + acknowledged_contracts including universal-required B_AI_PROFESSIONAL_VOICE + B_VALIDATE_BEFORE_ASSUME + respects_quality_gates [QG1-QG4] + output_contract + trust_tier). **All SKILL.md locations covered by validator** — `packages/skills/*/SKILL.md` (platform skills) + `.claude/skills/*/SKILL.md` (Claude Code auto-load; S007 §24+ amendment) + `libs/agents/*/agent.zmodel` (Mastra runtime; week-6+) + any future location must be added to `validate-aap-frontmatter.mjs#SKILL_PATHS` glob in same commit. Adding a new skill-authoring location WITHOUT updating validator = wildcard hazard that damages platform integrity. Per S007 §24+ user directive verbatim: *"non aligned agent and skills are wild cards that could destroy and damage a lot of what we built here"*. Validators: `agent-alignment-coverage` (PR error; multi-location coverage S007 §24+) + `skill-location-coverage-completeness` (PR error; meta-validator confirming all SKILL.md locations in glob; S007 §24+ atomic; week-4 impl) + `subagent-spawn-preamble-required` (PR warn — Class B preamble check). (B_AGENT_ALIGNMENT_PROTOCOL + P-META-010 — S005 turn 25 + S007 §24+ multi-location coverage amendment)
- ⚠️ **9-field AAP coverage — Phase 1 OPTIONAL warn (S010) → Phase 2 REQUIRED error (S012 target). Every SKILL.md should add 2 new fields:** `principle_compliance` (array of P-* IDs; minimum `P-META-010` + `P-META-002` universal-required) + `consolidation_cross_refs` (array of artifact paths whose discipline overlaps per B_CONSOLIDATION_PASS; empty `[]` valid for genuinely-novel skills). Per B_AGENT_ALIGNMENT_PROTOCOL S010 amendment + [EXT-20260505-002-B](docs/plan/_intake/contexts/governance/agent-discipline/EXT-20260505-002-B-9-element-dna-gate-triple-check-frontmatter-rigidity.md) 9-element DNA gate (CSPS drops `spheres-RETIRED` CSP-specific). **Phase 1 (S010 — current):** warn fires on missing 2 new fields; does NOT fail PR (preserves verify continuity for 16 existing SKILL.md); new SKILL.md S010+ should include immediately. **Phase 2 (S012 target):** validator warn → error after S011 backfill pass retrofits all 16 SKILL.md. Validator: `aap-9-field-coverage` (Phase 1 warn / Phase 2 error; registered atomic S010). Composes with B_CONSOLIDATION_PASS (S009 L1.3) + B_SAVINGS_AND_SSOT_UNIFIED (S009 L1.4) + B_GRADUAL_BUILD_BY_FOUNDATIONS (P-META-016) phased trajectory. (B_AGENT_ALIGNMENT_PROTOCOL S010 amendment turn 6c)

### Operations (P-OPER-001)
- ❌ Never close a session without `git push origin <branch>` confirming all commits on remote (B_ZERO_LAPTOP_DEPENDENCY)
- ❌ Never compress humble-batching into unrelated-item bundling for "efficiency"
- ❌ Never close a session without §10.13b "Catches engraved" + §10.11b "Positive value extracted" headers (silent skipping forbidden)

## Skills (auto-load on relevant trigger; full detail on-demand)

| Skill | Domain | When triggered |
|---|---|---|
| [`/governance-session`](.claude/skills/governance-session/SKILL.md) | Session protocols | "session", "handoff", "S<NNN>", "fresh chat" |
| [`/behavioral-contracts-skill`](.claude/skills/behavioral-contracts-skill/SKILL.md) | B_* lookup + hard NOs full detail | "B_", "behavioral contract", "hard NO" |
| [`/engraving-discipline`](.claude/skills/engraving-discipline/SKILL.md) | 5-surface FSE + atomic registration | "engrave", "5/5 atomic", "FSE" |
| [`/zf-validation`](.claude/skills/zf-validation/SKILL.md) | RZF + CEC + verify orchestrator | "ZF", "RZF", "CEC", "DONE", "RATIFIED" |
| [`/pcr-rendering`](.claude/skills/pcr-rendering/SKILL.md) | Pros/Cons/Rec 3-block | "should we", "X vs Y", "decide" |
| [`/cc-absorption-csps`](.claude/skills/cc-absorption-csps/SKILL.md) | Governor prompts + cardinal cross-link | "GP-S", "cardinal", "user-intents" |
| [`/slim-handoff`](.claude/skills/slim-handoff/SKILL.md) | HANDOFF + closing-summary + chat-jump | "handoff", "Zone A", "§17" |
| [`/vocabulary-canon`](.claude/skills/vocabulary-canon/SKILL.md) | Naming + frontmatter enums | "name", "frontmatter", "lifecycle_state", "rename" |
| [`/swift-build`](.claude/skills/swift-build/SKILL.md) | Topic-plan + element-review + PE | "topic-plan", "depth-3/4/5", "PE", "priority band" |
| `/pcr` `/wip-check` `/reuse-check` `/audit-self` `/batched-plan` `/learning-loop-extract` `/stewardship-review` | Existing platform skills | (per [packages/skills/](packages/skills/)) |

## Generators (the ONLY sanctioned scaffolding path)

Never write `page.tsx` / slice files / new skills/agents/personas directly. Use:
- `nx g platform:slice <Name>` / `:page --template=<id>` / `:app --slug=<slug>` / `:agent` / `:skill` / `:persona` / `:wizard` / `:skill-import` / `:skill-promote` / `:skill-upgrade` / `:split <slice>`

All run catalog-first search. `--new` requires `created-new-because:` justification.

## Where things live

| Path | Purpose |
|---|---|
| [`MASTER_PLAN.md`](MASTER_PLAN.md) | Trunk index |
| [`docs/plan/pillar-0-governance/`](docs/plan/pillar-0-governance/) | Principles, ADRs, audit, planning |
| [`docs/plan/pillar-1-architecture-and-stack/`](docs/plan/pillar-1-architecture-and-stack/) | Vocabulary, frontmatter, slice contract |
| [`docs/plan/pillar-2-data-and-schema/`](docs/plan/pillar-2-data-and-schema/) | ZModel, schema-per-app, audit triggers |
| [`docs/plan/pillar-3-platform-services/`](docs/plan/pillar-3-platform-services/) | Stripe/Clerk, templates, skill governance |
| [`docs/plan/pillar-4-developer-experience/`](docs/plan/pillar-4-developer-experience/) | Generators, skills, ingestion |
| [`docs/plan/pillar-5-ai-systems/`](docs/plan/pillar-5-ai-systems/) | Personas, Mastra, crisis escalation |
| [`docs/plan/pillar-6-operations-and-delivery/`](docs/plan/pillar-6-operations-and-delivery/) | Build order, graduation, dashboards |
| [`packages/principles/principles.yaml`](packages/principles/principles.yaml) | **Single source of truth for principles** |
| [`packages/skills/`](packages/skills/) | Existing platform skills (7) |
| [`.claude/skills/`](.claude/skills/) | Claude Code skill auto-load (Phase 4 NEW; 9 skills) |
| [`tools/`](tools/) | Generators, audit-runner, validators, measure-token-cost |
| [`docs/plan/pillar-0-governance/plan-creation-protocol.md`](docs/plan/pillar-0-governance/plan-creation-protocol.md) | **NEW S008** — canonical "how plans get made" 5-step protocol; consult before authoring any plan |
| [`docs/plan/pillar-0-governance/context-loss-pains.md`](docs/plan/pillar-0-governance/context-loss-pains.md) | **NEW S008** — SSoT 22-pain catalog; every plan REFERENCES (not restates) via Context-Loss Prevention Checklist |
| [`docs/plan/pillar-0-governance/csps-platform-dna.md`](docs/plan/pillar-0-governance/csps-platform-dna.md) | **NEW S008** — 13 CSPS DNA elements + process integration map; consulted at plan-creation Step 2 DNA gate |
| [`docs/plan/_intake/contexts/INDEX.md`](docs/plan/_intake/contexts/INDEX.md) | **NEW S008** — extraction notes index (55 sub-IDs across 11 EXT IDs); entry point for consuming absorbed external inputs |
| [`docs/plan/pillar-0-governance/depth-discipline.md`](docs/plan/pillar-0-governance/depth-discipline.md) | **NEW S009 L1.1** — canonical home for 5 CSPS depth semantics (file_depth_markers / depth_levels_invoked / audit-depth-DEFERRED / depth_tier_authored / depth_chosen-CSPS-native); 5-step creation gate with TBD-S<NNN> placeholders; consulted before any artifact >300 lines authored |
| [`tools/templates/governed-artifact-frontmatter.template.md`](tools/templates/governed-artifact-frontmatter.template.md) | **NEW S009 L1.2** — base frontmatter scaffold for ANY new governed artifact; pre-includes depth fields + closed-enum compliance + AAP extension hooks; specialized templates (gradual-build-plan / b-star-contract / skill / etc.) extend this base; TBD-S<NNN> placeholders per EXT-20260505-004-B 5-step creation gate |
| [`docs/plan/pillar-0-governance/model-routing-dashboard.md`](docs/plan/pillar-0-governance/model-routing-dashboard.md) | **NEW S009** — user-facing dashboard for dynamic model-routing decisions; current state + decision tree + 4 validated patterns from S006/S008 research + 4 adjustable templates (T1 per-skill / T2 spawn / T3 per-task / T4 per-session) + Phase 6 auto-tiering preview; consult before model-switch decisions |

## Per-directory cascade + update workflow

Per-app (`apps/<scope>/<name>/AGENTS.md`) and per-package (`packages/<name>/AGENTS.md`) extend with scope-specific rules. Inheritance: AGENTS.md cascade + shared MCP (`csps-principles-mcp`) + Mastra `BaseAgent` + audit-runner.

**Do not edit `AGENTS.md` directly.** Generated from [`packages/principles/principles.yaml`](packages/principles/principles.yaml) via `pnpm principles:codegen`. Workflow: edit principles.yaml → run codegen → commit both. CI fails if `git diff AGENTS.md` shows drift.

**Phase 4 transitional state (S007 turn 6):** AGENTS.md slim authored manually pending codegen full implementation per [token-optimization.md](docs/plan/pillar-0-governance/token-optimization.md) Phase 4. Backup at [`AGENTS.md.original`](AGENTS.md.original). Per principles-codegen.ts header: "Full AGENTS.md regeneration deferred to week-2-4 per build-order.md" — manual maintenance until codegen ships.

## Compact + session boundaries (B_TOKEN_BUDGET R3+R4)

- `/compact <focus>` at IMPL_BATCH boundaries (commit-worthy events / L<N>→L<N+1> transitions). Focus instructions preserve governance state.
- `/clear` between unrelated tasks (domain change → session boundary required; chat-vs-session distinction P-META-014).
- Cardinal: tokens are INVESTMENT in reasoning quality, NOT budget to minimize.

## Open frontiers

[`docs/plan/pillar-6-operations-and-delivery/open-frontiers.md`](docs/plan/pillar-6-operations-and-delivery/open-frontiers.md) tracks items not yet final. Don't lock in behavior on those without checking latest state.
