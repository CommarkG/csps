---
id: csps.handoff.vault.session-s075-extraction
name: session-S075-extraction
description: >
  High-value harvest of session S075 — HARDWIRE B1-B5 complete + PART 3 ZModel + External Integration Health.
  Foundation Scorecard: governance SEALED, schema pending migration, agent-decoupling vaulted, scale-readiness research-pending.
  Per B_POSITIVE_VALUE_EXTRACTION + P-META-006 CEC. HARVEST_READY gate satisfied.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, AI, ARCH, VALD]
schema_anchor: vault_files
session: S075
links:
  - { rel: session-state, href: ../../../../tools/session-state.json }
  - { rel: hardwire-register, href: ../../../../tools/data/hardwire-register.yaml }
  - { rel: default-registry, href: ../../../../tools/data/default-correction-registry.yaml }
  - { rel: ext-integration-registry, href: ../../../../tools/config/external-integration-registry.yaml }
consolidation_cross_refs:
  - tools/data/hardwire-register.yaml
  - tools/data/default-correction-registry.yaml
  - tools/config/external-integration-registry.yaml
  - tools/scripts/weekly-hardwire-audit.mjs
  - tools/validators/validate-external-integration-health.mjs
---

# Session S075 Extraction

> Per B_POSITIVE_VALUE_EXTRACTION: maximum value extracted across all relevant surfaces.

---

## FOUNDATION SCORECARD (4 dimensions — "B-queue done ≠ foundation done")

| Dim | Name | Status | Next |
|---|---|---|---|
| 1 | Governance (HARDWIRE B1-B5) | **SEALED** ✓ | Carry-forward: Pattern A-F death_date S078 |
| 2 | PART 3 schema migration | **PENDING** — Governor local run | 5 commands, commit 88f296a5 |
| 3 | Agent-decoupling (DPR-4) | **VAULTED** — no D20+ until layer-split designed | AGENT-DECOUPLING-ARCHITECTURE-S075.md |
| 4 | Multi-tenant scale-readiness (DPR-3) | **RESEARCH-PENDING** | MULTI-TENANT-SCALE-READINESS-S075.md |

**Next session = foundation dims 2-4, NOT apps. A crooked core multiplies across 30 apps.**

---

## 1. HARDWIRE B1-B5 (governance sealed)

### B1 — P-META-031 Reasoned-Adoption + D14/D18/D19
- P-META-031: "Enforce the floor (SP-citation), reason the ceiling (overrides cite SP)"
- D14 (unverified-agreement): `adopted_value=independent-corroboration`
- D15-D17 reconciled to registry SSoT (D15=pasted-command-as-go, D16=builder-drift-acceptance, D17=verdict-inflation)
- D18 (cascade-approval): `adopted_value=batch-independent-verification`
- D19 (scope-expansion-under-LGTM): `adopted_value=scope-boundary-enforcement`
- validate-default-shape.mjs: BLOCKING for new D* without reasoning+reframe+adopted_value
- **Key lesson**: registry = SSoT for D* IDs; do not redefine IDs in profile docs (D12 applied to Sonnet's own governance work)

### B2 — HARDWIRE-007 governing_intent (root fix for D11)
- governing_intent field MANDATORY on all new principles (post-S075)
- validate-governing-intent-coverage.mjs: BLOCKING for new principles without governing_intent
- ZF SP floor: ZF ACHIEVED without tool output → advisory (validate-nominal-rzf-detector extended)
- validate-nominal-rzf-detector extended with: SP floor + HARDWIRE-008 verdict scan

### B3 — HARDWIRE-008 verify-before-concur floor (director verdicts)
- ACCEPT/SEAL/GO/OPIA on opus-turn.md without this-turn tool re-run → D14/D15 advisory
- Extends validate-nominal-rzf-detector (not a new validator)
- D15-D17 caught a collision live: D15 caught the migration block-test running on raw client

### B4 — consolidation-pattern-detector + concurrency guard
- Pattern G (structural ID/concern overlap): would auto-catch D15-D17 collision
- Concurrency guard: known transients surface LOUD, never silent-retry
- D13 registered in default-correction-registry (was vault-only since S068)
- D11 double-file: both pre-S074 D11 vault files got SUPERSEDED headers

### B5 — Cut list (less-but-blocking)
- MEMORY.md compressed to 23,378 bytes (under 24.4KB limit)
- consolidation_pass_active: Pattern G → blocking-eligible; A-F → death_date=S078
- audit-zero-event-hooks.mjs: 6 blocking, 53 advisory, 20 orphans (R-class for removal)

---

## 2. PART 3 Product Schema (open Track-A)

### ZModel authored (commits 70887cc7 + 88f296a5):
- Plan + Capability + PlanCapability in flat schema.zmodel
- Tenant.planId FK added (schema + migration)
- zenstack generate: all plugins successful
- capabilities.ts: 10 slugs, TS const SSoT

### Migration materials (Governor applies locally):
```bash
# 1. npx zenstack generate --schema libs/policies/schema.zmodel
# 2. npx prisma migrate dev --schema libs/policies/generated/schema.prisma --name part3_product_schema
# 3. npx tsx libs/policies/seed/seed-capabilities.ts
# 4. npx zenstack enhance
# 5. npx tsx libs/policies/seed/test-tier-enforcement.ts → paste BOTH DENIED outputs
```
**Guardrail**: DIRECT_URL (port 5432) — automatic. Enhanced client in test (not raw PrismaClient).

### Q1-Q4 decisions (from Opus-16):
- Q1: Plan = shared canonical (no per-tenant copy)
- Q2: Capability server-resolved per-request, NOT in JWT
- Q3: planId + subscriptionStatus orthogonal (keep both)
- Q4: TS const SSoT → DB seeded from it → drift-validator

---

## 3. External Integration Health (B3-lean)

### What was built:
- tools/config/external-integration-registry.yaml — 5 ACTIVE integrations (Vercel, Supabase, Clerk, GitHub submodule, ZenStack)
- validate-external-integration-health.mjs (DEEP tier): BLOCKING if active entry missing health_check_command
- pre-tool-use-external-integration-gate.sh: ADVISORY→BLOCKING for registry writes without verified_at

### Pattern generalized: EXTERNAL-INTEGRATION-REGISTRATION-STALENESS
A registered configuration correct at T0 becomes stale at T+N without live verification.
Every active integration MUST have health_check_command + verify_mechanically + verified_at.

---

## 4. 20-Orphan Hooks (from B5 audit)

**audit-zero-event-hooks.mjs output** (05403de3):
- Total registered: 59
- Blocking (keep): 6
- Advisory-only (review): 53
- **Orphans (on disk, not registered): 20** ← R-class removal candidates
- Missing: 0

**Next action**: Opus reviews orphan list with --verbose and rules on which to remove vs promote. Non-obvious = R-class per spec.

---

## 5. Open Items for S076

| Item | Status | Next |
|---|---|---|
| PART 3 migration (Track-A) | Governor local run pending | 5-step sequence (commit 88f296a5) |
| Foundation dim 4 (scale-readiness) | Research-pending | Opus issues research directive |
| Foundation dim 3 (agent-decoupling) | Vaulted DPR-4 | Layer-split design before D20+ |
| Orphan hooks audit | 20 orphans identified | Opus R-class review per verbose output |
| PART 3 SEAL (DENIED outputs) | Migration gate | After Governor runs migration locally |
| Floaters (26 overdue) | 3/session triage | Governor: .csps/floater-decision-queue.txt |
| consolidation-pass A-F | death_date=S078 | Governor confirms blast-radius OK by S077 |
| Significance Engine (SANDBOX) | Council ratification pending | Q1-Q4 in SIGNIFICANCE-ENGINE-SANDBOX-S075.md |
| D11/governing_intent recurring audit | validate-governing-intent-coverage.mjs DEEP | 15% coverage baseline |
| AI profiling live page | csps-playground.vercel.app/platform/ai-behavior | D1-D19 tab active |

---

*Extraction authored by Sonnet S075 · OPIA ACCEPT (all B-queue) from OPUS-16 · verify=0 · 2026-06-01*
