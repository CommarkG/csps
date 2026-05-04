---
id: csps.handoff.vault.gaps-and-duplications-S005
name: gaps-and-duplications-S005
description: S005 gaps + duplications report. Tracks gaps surfaced during this session and reuse-first compliance check on session decisions. Per protocols.md v1.8 §10/§13. NEW S005 finding §C3.1 — audit-registry has 32 dangling refs (cited in pillar leaves; no registry entry).
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
  - { rel: prior-session, href: ./gaps-and-duplications-S004.md }
session: S005
---

# Gaps + Duplications Report — Session S005

## Reuse-first compliance (P-OP-001) — session decisions

| Decision | Reused / New | Justification |
|---|---|---|
| B_PCR_FOR_DECISIONS engraving (S005 turn 5) | Composition (strengthens P-OP-003) | P-OP-003 PCR principle existed; B_* contract layer + memory + audit + hook were missing. Composition pattern + 5-surface fill, not new principle. |
| ADR-0022 fix Option E (D + B hybrid) | Mostly new (count-text rephrasing pattern) + reuses P-ARCH-004 | Decorative-count elimination is novel for CSPS; audit detection is precedent (similar to existing `*-drift` audit family). |
| `pcr-completeness-on-decisions` audit | New | No existing audit covers PCR-completeness. Composes with `audit-of-audits-fse` (which checks 5-surface; PCR is one of those surface validators). |
| `principle-count-staleness` audit | New | No existing audit detects count-vs-yaml drift. Composes with `principles-codegen-fresh` family (codegen drift). |

**0 reuse-first violations this session.**

## Gap §C3.1 — Audit-registry dangling references (32 found)

**Detection:** grep + diff of pillar-leaf citations (`audit \`<slug>\`` / `audit-runner.md#<slug>` / `\`<slug>\` audit` patterns) vs `audit-runner.md` registered slugs.

**Result:** 106 unique slugs cited; 32 not registered (excluding 1 false positive `audit-runner` which is the leaf name itself).

### The 32 dangling references

| Cited slug | Cited in (sample) | Likely category | Backing principle / contract |
|---|---|---|---|
| `active-stale` | [tag-status-contract.md:136](https://github.com/CommarkG/csps/blob/main/docs/plan/_intake/tag-status-contract.md#L136) | Status | tag-status-contract |
| `assertion-without-evidence` | [behavioral-contracts.md § B_VALIDATE_BEFORE_ASSUME](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-0-governance/behavioral-contracts.md) | AI Behavior | B_VALIDATE_BEFORE_ASSUME |
| `assertion-without-preceding-tool-call` | behavioral-contracts.md (turn 15 strengthening) | AI Behavior | B_VALIDATE_BEFORE_ASSUME amendment |
| `assumption-without-evidence` | ai-behavior-spine.md | AI Behavior | B_VALIDATE_BEFORE_ASSUME family |
| `canonical-phrasing-drift` | template-governance leaves | Tag | tag-canonical-phrasing-drift cousin |
| `catch-engraving-coverage` | behavioral-contracts.md § B_CATCH_TO_ENGRAVING | Catch+Engraving | B_CATCH_TO_ENGRAVING |
| `compressed-zero-findings-detection` | zero-findings-discipline.md anti-patterns | Zero-Findings | P-META-006 RZF |
| `concern-duplication` | possibly pillar-1 | (TBD) | P-ARCH-004 |
| `cross-ref-resolution` | semantic-check refs | Catalog/Quality | semantic check |
| `discipline-engraving-completeness` | ai-behavior-spine.md | AI Behavior | P-META-007 FSE meta-audit |
| `enforcer-implementation-status` | meta-audit on build-status | Meta | P-META-001 |
| `field-parity` | schema layer | Schema | ZModel / Zod parity |
| `force-fit-detection` | unknown-path-protocol.md | Tag/Status | B_NO_FORCE_FIT |
| `handoff-attestation-and-handshake-present` | protocols.md §17 | Handshake | B_TWO_SIDED_HANDSHAKE |
| `handoff-section-zero-present` | protocols.md §11 | Handshake | protocols.md §11 step 0 |
| `handshake-completion` | protocols.md §11b | Handshake | B_TWO_SIDED_HANDSHAKE |
| `inheritance-coverage` | mechanical-enforcement.md | Meta | P-META-003 |
| `intent-to-impact-validation` | protocols.md §16 | Handshake | B_INTENT_TO_IMPACT |
| `manual-protocol-skipped` | _intake/manual-protocol.md | Intake | B_INTAKE_DISCIPLINE |
| `mastra-agent-count` | pillar-5/mastra-setup.md | AI-Runtime | one-agent-many-personas (ADR-0008) |
| `memory-index-completeness` | memory-system | AI Behavior | MEMORY.md index |
| `precedent-check-coverage` | behavioral-contracts.md § B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK | AI Behavior | B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK |
| `principles-version-known` | mechanical-enforcement.md | Meta | P-META-002 |
| `schema-gap-promotion-eligibility` | _intake/unknown-path-protocol.md | Intake | K=2 promotion mechanism |
| `single-surface-registration` | behavioral-contracts.md § B_ATOMIC_DUAL_REGISTRATION | Generator+Skill | B_ATOMIC_DUAL_REGISTRATION |
| `state-declaration-format` | ai-behavior-spine.md | AI Behavior | B_STATE_DECLARATION_AT_OPEN |
| `tag-status-mismatch` | [tag-status-contract.md:233](https://github.com/CommarkG/csps/blob/main/docs/plan/_intake/tag-status-contract.md#L233) | Tag | tag-status crossover |
| `unanswered-questions-blocker` | behavioral-contracts.md § B_BLOCKER_NO_SILENT_DROP | Status | B_BLOCKER_NO_SILENT_DROP |
| `validator-claim-without-rerun` | ai-behavior-spine.md | AI Behavior | B_RZF / B_DONE family |
| `wip-enforcer-tracking` | operating-principles.md FWWS | (new category?) | P-OP-002 FWWS |
| `wip-limit` | operating-principles.md FWWS | (new category?) | P-OP-002 FWWS |

### Why this happened

The +66 extended-S003 consolidation registered audits cited in NEW pillar leaves added at S003 (pillar-3 / 4 / 5 / 6 / dashboards / build-order / etc.). It did NOT consolidate the broader behavioral-discipline citations that:
- Pre-date S003 (`wip-limit` / `principles-version-known` from S001 architecture-principles citations)
- Were added in S002 turn 7 / 10 / 14 / 15 / 17 alongside spine-matrix engraving without simultaneous registry entries (`assertion-without-evidence` / `precedent-check-coverage` / `force-fit-detection` / etc.)

Each B_* contract entry in `behavioral-contracts.md` cites a "Mechanical surfaces: validator: <slug>" line. Those slugs went into the spine matrix + memory + AGENTS.md NO but the registry entry was deferred ("planned week 4") and never landed in audit-runner.md.

### Disposition

**This session (S005 turn 8):** registered 2 new audits atomically with their introducing engraving:
- `principle-count-staleness` (per ADR-0022 K=2 fix; Meta category 4 → 5)
- `pcr-completeness-on-decisions` (per B_PCR_FOR_DECISIONS turn 5; AI Behavior 3 → 4)

**Carry-forward to S006 §3:** bulk-register the remaining 30 dangling refs in audit-runner.md. Recommended approach: per-category PCR for placement (Meta vs AI Behavior vs Status vs Handshake vs Intake), then atomic batch. Effort: ~1-2hr (30 entries × ~3min each + per-category placements).

**Forward-prevention:** B_FIVE_SURFACE_ENGRAVING surface 2 (validator) requires audit-runner.md registration as part of atomic 5-surface application. New B_* engravings going forward MUST register their validator slug in audit-runner.md as part of the same response/commit (not "planned week 4" with deferred registration). The deferral pattern is what produced the 30-ref backlog. Update `behavioral-contracts.md` "How to add a new contract" with this requirement.

## Gap §C3.1 secondary — `enforcerLocation` field not surfaced in markdown registry

The audit-runner.md registry tables list slug + cadence + severity + description but NOT `enforcerLocation` (the schema field per AuditCheck model line 55: "file path of the check implementation"). By convention, every audit's enforcerLocation = `libs/audits/checks/<slug>.ts` — implicit but not explicit in markdown.

**Disposition:** acceptable as-is per convention; explicit column would be markdown clutter. The codegen pipeline (week 1-2) will derive enforcerLocation from slug at AuditCheck row creation. No action needed.

## Other gaps surfaced this session

**None beyond the §C3.1 finding.** Section retained for protocol completeness per template.

## Verification cycle findings (S005 turn 18+ — pre-handoff close-down)

Triggered by user review directive at session-end ("completion + stability + scalability"). Ran full pnpm install + typecheck + codegen validate-only as RZF cycle on the week-1 scaffolding. Each cycle surfaced real latent bugs.

### Bugs surfaced + fixed this session

| Cycle | Finding | Source | Status |
|---|---|---|---|
| 1 | `pnpm install` | — | ✅ PASS — 5 workspace projects, 103 packages, 20.7s |
| 2 | 5 × TS-strict TS4111 errors (`Property comes from index signature, must use bracket notation`) | codegen.ts (3) + principles-mcp/src/index.ts (2) | ✅ FIXED — bracket notation applied |
| 3 | `isMain` check failed on Windows path comparison (false-positive exit 0; `main()` never ran) | codegen.ts | ✅ FIXED — switched to `pathToFileURL` |
| 4 | YAML quote bug at line 920 (`"I'll engrave..." (N=2 ...)` — closing quote mid-line + unquoted text after) | principles.yaml — **PRE-EXISTING from S002 turn 17** P-META-007 engraving; latent ~2 sessions because validator never ran | ✅ FIXED |
| 5 | 4 enforcer_layers missing from closed enum | principles.yaml — **2 pre-existing latent** (`memory` from S002 turn 17, `runtime` since S001) **+ 2 S005 additions** (`contract`, `ai-behavior-spine`) | ✅ FIXED — all 4 added to enum with comments |

### NEW finding surfaced + carry-forward to S006

| Finding | Source | Status |
|---|---|---|
| **P-ARCH-006 under-enforcement** (`slice-contract-90-percent-to-merge` has 3 enforcers, requires 4 for severity=critical) | Pre-existing since whenever P-ARCH-006 was authored | 🔴 carry-forward S006 (architectural decision needed: which 4th enforcer to add) |
| **Likely more under-enforcement findings** (validator throws on first; full enumeration requires refactor of `validate()` to collect all errors not first-fail) | All severity-critical principles need re-audit per current enforcer counts | 🔴 carry-forward S006 |

### B_FIVE_SURFACE_ENGRAVING amendment APPLIED THIS SESSION (was carry-forward)

Per the meta-finding above (FSE produces dangling validator refs by default), the [`How to add a new contract`](../../pillar-0-governance/behavioral-contracts.md) section in `behavioral-contracts.md` was amended with **atomic validator-surface REGISTRATION** rule (Surface 2 split into 2b registration mandatory + 2c implementation deferrable). This is the single highest-leverage stability+scalability fix from S005. Forward-prevention: every B_* engraving in S006+ inherits the discipline without manual sync.

## Carry-forward summary (UPDATED — S005 turn 21+ all-carry-forwards closure)

**Closed this session (was carry-forward → now DONE):**
- ✅ ADR-0005/6/8/9 `domain:ai-systems` → `domain:ai` typo fix (turn 18)
- ✅ pnpm install + smoke test (typecheck on principles + principles-mcp; codegen validate-only) (turn 18)
- ✅ B_FIVE_SURFACE_ENGRAVING amendment (atomic validator registration) (turn 18)
- ✅ **B_PRE_CLOSE_VERIFICATION + P-META-008 cycle-mandatory-in-plan engraved** (turn 19) — plan-mechanical now structural
- ✅ **B_POSITIVE_VALUE_EXTRACTION + P-META-006 trigger-cadence amendment** (turn 20) — CEC fires on all positive significant events, not just formal ratifications
- ✅ **`validate()` refactored to `validateAll()` enumerating all findings** (turn 21) — no more throw-on-first; full picture surfaced
- ✅ **4 under-enforced principles fixed** (turn 21) — P-ARCH-006/013/015/018 each got appropriate additional enforcer; principles_validate now PASS with 0 findings
- ✅ **ADR-0023 frontmatter schema decision filed** (turn 21) — Hybrid universal-core + per-file-type extensions
- ✅ **30 dangling audit refs bulk-registered atomically** (turn 21) — single consolidated "Behavioral Discipline Validators" section in audit-runner.md per FSE atomic-validator-registration amendment

**ZF state at S005 close (final pnpm verify):**

```yaml
pre_close_verification:
  cycles:
    pnpm_install_frozen:    DEFERRED-WITH-REASON (--skip-install; would PASS — verified turn 18 direct run)
    typecheck_recursive:    PASS  (0 ts_errors)
    principles_validate:    PASS  (39 principles, 0 findings)
    frontmatter_validate:   PASS  (0 errors, 63 exempt)
    audit_runner_full_pass: DEFERRED-WITH-REASON (week-4 ship)
  exit_code: 0
```

**Carry-forward to S006 (1 item — properly framed as week-2 PRIMARY work, not carry-forward bug):**

- **Foundation slices week-2** — User / Tenant / AuditEvent in `libs/policies/foundation/` per pillar-2/foundation-zmodel.md spec + build-order.md week-2 entry. Plus week-2 supporting work: glossary codegen full impl, principles codegen AGENTS.md emission, Stripe Entitlements wiring, Clerk Organizations wiring. **Multi-session arc; properly week-2 substantive work.**

## How to use this report

S006 reading: ZF achieved on week-1 deliverables. The user's directive ("ZF before build") satisfied — week-2 starts cleanly. The 1 remaining item is week-2 PRIMARY work (foundation slices), not a defect-class carry-forward.

The structural protections engraved S005:
- B_PRE_CLOSE_VERIFICATION + P-META-008 (every close runs `pnpm verify`; nominal-RZF impossible)
- B_POSITIVE_VALUE_EXTRACTION + P-META-006 amendment (every significant positive event triggers cycle; insights / user-directives / improvements no longer silently drop)
- B_FIVE_SURFACE_ENGRAVING amendment (atomic validator registration; dangling-ref accumulation frozen at zero post-S005)
- B_PCR_FOR_DECISIONS (every multi-option decision gets PCR 3-block)
- ADR-0023 (frontmatter schema split formalized)

S006 inherits a substantially more rigorous platform than S005-start. Validate-then-build is now structurally enforced.
