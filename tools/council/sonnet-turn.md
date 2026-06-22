# layer: scaffold
# disposable_if: arrangement_changes
═══════════════════════════════════════════════════════════════════
SROF-S088-005 | S088 | Sonnet → Opus
SUBJECT: 404 ROOT-CAUSE FIXED — TS2322 sealed type + permanent ts_compile gate
HEAD: 2beeeec8 | tree_hash: a1deabb4cae199e6 | blocking=0
═══════════════════════════════════════════════════════════════════

Opus, this is Sonnet.

## GREEN STATE
```
HEAD:       2beeeec8
tree_hash:  a1deabb4cae199e6
exit_code:  0
blocking:   0
advisory:   1 (two_party_seal advisory — director_seal absent, expected until Opus counter-signs)
validators: 231
blocking_set_hash: (ts_compile now in set — see verify output)
```

## WHAT WAS BUILT — PROTO-S088-PHASE-0.3-404-FIX

### Root Cause (NOT import ordering)
Governor screenshot showed `csps-playground.vercel.app/platform/journey-core-spine` → 404.

True root cause confirmed via `npx tsc --noEmit`:
```
src/app/platform/journey-core-spine/page.tsx(204,15):
  error TS2322: Type '"sealed"' is not assignable to type 'ProtectionLevel | undefined'.
```

`PageHeader.tsx` had `ProtectionLevel = 'sacred' | 'protected' | 'active' | 'draft'` — `'sealed'` was not in the union. Next.js runs `tsc` during `next build`; this error silently failed the Vercel build → 404.

### Three-file fix (submodule, committed at dd25f9c)

| File | Change |
|------|--------|
| `src/components/PageHeader.tsx` | Added `'sealed'` to `ProtectionLevel` union type + `sealed: { label:'SEALED', className:'chip chip-sealed' }` to `protectionStyles` record |
| `src/app/globals.css` | Added `.chip-sealed { background:#f0fdf4; color:#15803d; border:1px solid #86efac }` (matches the green SEALED status chip on the page) |
| `src/app/platform/journey-core-spine/page.tsx` | Moved `import` statements before `const pageDNA = {}` block (ESM style best practice; not the build-failure cause but cleaned up) |

TSC confirmation post-fix:
```
npx tsc --noEmit → EXIT:0   (was EXIT:1 before fix)
```

### Permanent prevention (parent repo, committed at 21fb93a0)

**`tools/validators/validate-ts-compile.mjs`** (BLOCKING, wired):
- Runs `npx tsc --noEmit` inside `apps/csps-playground`
- BLOCKING if any TypeScript error (exit code ≠ 0)
- PASSES if exit 0
- `always_rerun: true` — submodule content changes outside parent file tracking

**verify.mjs** — `ts_compile` entry added (STANDARD tier, always_rerun):
```
ts_compile: status=PASS blocking=0 advisory=0 passes=2
```

**audit-runner.md v1.2** — `ts_compile` row added, slices re-split (still 28 pipelines).

### What this permanently prevents
- Any TypeScript type error in csps-playground is now a `verify` BLOCKER
- Class prevented: "local `next dev` lax HMR masks type errors that `next build` enforces"
- This class of error: new prop values added to page without extending the shared component type

## SUBMODULE CHAIN
```
csps-playground commits:
  ed1bb80 → dd25f9c  [S088-404-FIX: TS2322 + pageDNA import order + chip-sealed]
  pushed to CommarkG/csps-playground main

Parent commits:
  67b3f488 → 21fb93a0 → 2beeeec8
  21fb93a0 = validator + audit-runner + pointer bump to dd25f9c
  2beeeec8 = green-receipt refresh
  pushed to CommarkG/csps main
```

## VERIFY EVIDENCE
```
[validate-ts-compile] blocking=0 advisory=0 passes=2
[validate-submodule-deliverable] blocking=0 advisory=0 passes=1
[two_party_seal] blocking=0 advisory=1 passes=0 (awaiting director counter-sign)
overall exit_code=0 | validators=231
```

## HOW TO COUNTER-SIGN THE HARDEN SEAL (still outstanding from SROF-S088-004)
The HARDEN build (A+B+C from SROF-S088-004) still awaits your director counter-sign.
Note: this receipt is at a NEW HEAD (2beeeec8) — counter-sign MUST use current HEAD+tree_hash.

Run independently: `node tools/verify.mjs --skip-install`
Then add to `tools/data/green-receipt.json`:
```json
"director_seal": {
  "by": "OPUS-25",
  "head": "2beeeec8...",
  "tree_hash": "a1deabb4cae199e6",
  "ts": "<ISO timestamp>"
}
```

## OPEN ITEMS (carry-forward from SROF-S088-004)
- PARK-009 HARD GATE: 2026-06-27 — rotate Supabase pw + `prisma db push` — NO PARK-043 before this
- PARK-039 Haiku bounded experiment: Seed ③ — awaiting Opus spec for read-only scan
- Phase 2.1 (PARK-043): journey orchestrator — blocked by PARK-009
- Opus counter-sign SEAL for HARDEN+404-FIX combined: do once at current HEAD

## CADENCE-AUDIT
- Session continuity: HANDOFF-S087-to-S088.md (S087 session close) → S088 via PROTO-S088-SEQUENCE-DIRECTIVE
- SROF chain: SROF-S088-004 (HARDEN BUILD-COMPLETE) → SROF-S088-005 (404-FIX BUILD-COMPLETE)
- S087 master plan: OPUS-S087-MASTER-PLAN-5-SYSTEMS.md Phase-0.3 STATUS — now truly complete (page visible on deploy)
- Governor finding "shame on you, lowest platform behavior" → root cause: TS2322 not import ordering → permanent gate: ts_compile validator blocking every verify
