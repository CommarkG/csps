# layer: scaffold
# disposable_if: arrangement_changes

# FROM SONNET S084 | FOR OPUS — B2 COMPLETE (OPIA REQUESTED)

Opus, this is Sonnet. B2 (dashboard reshaper: CRUD over meta-model, tier-gated, trunk read-only) is DONE.

## WHAT WAS BUILT [MEASURED: git SHA e7abb3ac + submodule 42c8002, pushed main]

**1. validate-gate-mode-matrix.mjs (NEW — tools/validators/)**
- run_tier: EXTENDED (0 STANDARD cycle cost per B2 directive)
- Validates GateDef.gateModeMatrix JSON against: (a) valid structure 4 mechanisms × 4 risk_classes, (b) valid values GateModeValue {blocking|advisory|silent}, (c) SEED-2 hard floors (tighten-only; never relax below floor)
- Self-validates all 5 SEED-2 reference matrices on every run
- Registered in verify.mjs (EXTENDED) + mjs_syntax_check + audit-runner.md slug
- HARD FLOORS: THRESHOLD P1=blocking ALL; THRESHOLD P5=blocking std/elevated/critical; ZF escalating by risk class; PE P3=blocking std/elevated/critical; CIE advisory-minimum ALL (never silent)

**2. apps/csps-playground/prisma/schema.prisma (UPDATED)**
- Journey model: F3 fields added (ratifiedRiskClass RiskClass? / variant VariantType? / versionBinding Json?)
- 7 new enums: DefinitionScope / RiskClass / VariantType / GateModeValue / PolicyResult / RippleSeverity / ChangeClass
- 4 new models: PhaseDef / GateDef / VariantDef / BranchAxisBinding (all with @unique natural keys)

**3. api/journey-admin/meta-model/route.ts (NEW)**
- GET: returns PhaseDef[] + GateDef[] + VariantDef[] from DB, OR SEED-2/6 static fallback if pre-db-push
- Source field: 'db' | 'seed-static' (same graceful-fallback pattern as existing journey-admin/route.ts)

**4. api/journey-admin/seed-meta-model/route.ts (NEW)**
- POST: idempotent upsert of SEED-2 PhaseDef/GateDef (PEG-1..PEG-5) + SEED-6 VariantDef (4 variants)
- GateDef.gateModeMatrix seeded from SEED-2 verbatim matrices (same matrices validated by validate-gate-mode-matrix.mjs)
- Error response: instructs Governor to run prisma db:push first if tables don't exist

**5. journey-admin/page.tsx (UPDATED — B2 dashboard reshaper)**
- Journey interface: F3 fields added (ratifiedRiskClass / variant / versionBinding)
- TRUNK: replaced T1-T5/I1-I4 (from wrong ESSENCE-EXTRACTION-DEFAULT.md) → SEED-1 C1-C5 invariants + P1-P5 phases (verbatim from core-spine-registry.yaml)
  - C1 No-Silent-Skip / C2 Humble-First / C3 Evidence-at-Gate / C4 Decide-with-PE-and-CIE / C5 Verify-Against-Acceptance
  - P1 Intent / P2 Audit / P3 Decide / P4 Validate / P5 Activate-Verify-Learn
- MetaModelPanel (NEW component): shows PhaseDef+GateDef (tab 1) + VariantDef (tab 2)
  - Tab 1: each phase shows phaseId/name/intent + gate mode matrix (THRESHOLD/ZF/PE/CIE × low/standard/elevated/critical)
  - Tab 2: 4 variant cards (variantType / displayName / riskClassFloor)
  - "⬆ Seed Defaults" button: POST /api/journey-admin/seed-meta-model → refreshes panel
  - Collapsed by default; source indicator: '● DB-seeded' vs '◦ SEED-2/6 static'
- BranchPanel header: shows ratifiedRiskClass + variant if set on journey (F3 fields)
- Trunk tooltip updated: references C1-C5 + P1-P5 + §SEED-1 EXPANSION (not T1-T5/I1-I4)

**6. core-spine-registry.yaml (UPDATED)**
- wiring_map journeys entry: +3 ACTIVE entries (meta-model/route.ts + seed-meta-model/route.ts + validate-gate-mode-matrix.mjs)
- journey-admin/page.tsx role updated: "C1-C5/P1-P5 trunk + MetaModelPanel + F3 fields (B2)"

**7. audit-runner.md + slices (UPDATED)**
- gate-mode-matrix slug added (EXTENDED/advisory); slices regenerated via split-audit-runner.mjs

**NOT DONE (blocked):**
- `prisma db push` for PhaseDef/GateDef/VariantDef/BranchAxisBinding tables
- P0 BLOCKER: auth failed at db push (Authentication failed against database server)
- Root cause: P0 credential rotation DUE 2026-06-20 — Supabase password may already be rotated but .env.local still holds old value
- Action needed: Governor → Supabase → Settings → Database → Reset password → update .env.local DIRECT_URL + Vercel env vars → then `cd apps/csps-playground && export $(grep -E "^(DATABASE_URL|DIRECT_URL)=" .env.local | xargs) && pnpm prisma db push --schema prisma/schema.prisma`

## EVIDENCE [MEASURED: THIS SESSION]

- verify: exit_code=0 (all STANDARD validators PASS; mjs_syntax_check PASS; audit_health PASS warnings=0; audit_slug_coverage PASS orphans=0)
- validate-gate-mode-matrix.mjs: self-run: checked=5 blocking=0 advisory=0 (all 5 SEED-2 reference matrices pass hard-floor checks) [MEASURED: node tools/validators/validate-gate-mode-matrix.mjs this session]
- git push: SHA e7abb3ac → main (root repo); SHA 42c8002 → csps-playground main (remote confirmed)

## ZF CYCLES

ZF Cycle 1: B2 build artifacts — sources: tools/validators/validate-gate-mode-matrix.mjs (checked=5 blocking=0 this session), tools/verify.mjs (EXTENDED entry + mjs_syntax_check lines confirmed), apps/csps-playground/prisma/schema.prisma (7 enums + 4 models + F3 fields on Journey), apps/csps-playground/src/app/api/journey-admin/meta-model/route.ts (GET + SEED-2/6 static fallback), apps/csps-playground/src/app/api/journey-admin/seed-meta-model/route.ts (idempotent upsert), apps/csps-playground/src/app/platform/journey-admin/page.tsx (C1-C5 + P1-P5 trunk + MetaModelPanel + F3 fields), tools/config/core-spine-registry.yaml (+3 ACTIVE wiring_map entries), docs/plan/pillar-0-governance/audit-runner.md (gate-mode-matrix slug added), tools/verify-last-run.md (exit_code=0 this session). PENDING db push.

ZF Cycle 2: Re-checked apps/csps-playground/prisma/schema.prisma (F3 fields match Journey model: ratifiedRiskClass RiskClass? + variant VariantType? + versionBinding Json? confirmed), tools/validators/validate-gate-mode-matrix.mjs (HARD_FLOORS match SEED-2 verbatim; SEED2_REFERENCE matrices identical to seed-meta-model/route.ts SEED2_MATRICES — both sourced from SEED-2 F4), apps/csps-playground/src/app/platform/journey-admin/page.tsx (SEED1_INVARIANTS C1-C5 text matches tools/config/core-spine-registry.yaml §trunk.invariants verbatim; SEED1_PHASES P1-P5 text matches core-spine-registry.yaml §trunk.phases verbatim). 0 new findings.

Status: ZF ACHIEVED.

## ONE ASK — OPIA: B2 EXIT GATE (+ P0 ACTION)

**P0 BLOCKER first:** Governor must rotate Supabase password + update .env.local + re-run prisma db push before B2 is fully live in DB. Steps above (see NOT DONE section).

**OPIA ask:**
1. Trunk C1-C5 + P1-P5 in page.tsx — confirm these match the SEALED trunk (copied verbatim from core-spine-registry.yaml which Opus verified at B1 OPIA; Sonnet rechecked in ZF Cycle 2)
2. validate-gate-mode-matrix EXTENDED + SEED-2 hard floors — does the floor matrix match SEED-2 F4 as you authored it?
3. API shape: meta-model GET + seed-meta-model POST — does this satisfy "reshape a journey end-to-end locally"?

**After OPIA:** B3 — PEG enforcement (validate-journey-gate.mjs) + validate-trunk-matches-seed check (prevents C5 transcription recurrence).
