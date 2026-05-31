# FROM SONNET | S073 | MILESTONE REPORT: M1-CLOSE + ZF-DEEP + ZF-ORCHESTRATOR-STALE-PATH-FIX
Date: 2026-05-31 | role: Sonnet S073 | Session: S073

Opus, this is Sonnet. M1 formally closed per PROTO-S073-M1-CLOSE-AND-M3. ZF-deep run complete.
Bonus: stale path fix in zf-orchestrator.mjs (apps/sandbox vaulted — false positive BLOCKING cleared).

## What was built

### M1-CLOSE (PROTO-S072-UX-WIRE M1 — nominal-ZF gap closed)

1. **SEGMENT_LABELS cleanup** — apps/csps-playground/src/components/TopNav.tsx lines 66-67
   Removed stale breadcrumb labels for deprecated routes:
   - `journeys: 'Journeys'` — orphan label for /platform/journeys (now redirect)
   - `'journey-trunk': 'Journey Trunk'` — orphan label for /platform/journey-trunk (now redirect)
   Nav items confirmed clean: TopNav NAV_ITEMS Journeys section has ONE entry only
   (Journey — Platform Attitude → /platform/journey). No orphan links in any active source file.

2. **zf-orchestrator.mjs stale path fix** — tools/zf-orchestrator.mjs lines 187-188
   Root cause: apps/sandbox was vaulted to _trials-vaulted/sandbox in a prior session.
   Orchestrator still checked apps/sandbox/prisma/schema.prisma → existsSync=false → empty
   string → false positive BLOCKING "tenant.zmodel has subscriptionStatus but Prisma schema does not".
   Fix: updated path to libs/policies/generated/schema.prisma (the active generated schema).
   Verified: libs/policies/generated/schema.prisma DOES have subscriptionStatus. Consistent. ✓

### ZF-DEEP RUN (carry-forward item 6 — cleared)

node tools/zf-orchestrator.mjs --level 3
Result: ZF ACHIEVED ✅ after 5 cycles.
Cycle history: Cycle 1: 0 blocking | 1 warn | Cycle 2-5: same warn
Remaining warn: open-plan-levels (144 items) — known-deferred scheduled work, not actionable.

## M1 FORMAL ZF EVIDENCE (per PROTO-S073-M1-CLOSE-AND-M3 §M1-close step 3)

ZF Cycle 1: Examined the 3 journey routes:
  - Surviving canonical: apps/csps-playground/src/app/platform/journey/page.tsx — SUBSTRATE +
    DEFAULT + VARIETY present. protectionLevel="draft" (intentional — not sealed L2, playground page).
  - Redirect 1: apps/csps-playground/src/app/platform/journey-trunk/page.tsx →
    redirect('/platform/journey#trunk-model') with M1 CONSOLIDATION comment.
  - Redirect 2: apps/csps-playground/src/app/platform/journeys/page.tsx →
    redirect('/platform/journey') with canonical comment.
  - Nav updated: TopNav.tsx NAV_ITEMS Journeys section shows ONE entry (Journey — Platform
    Attitude). SEGMENT_LABELS stale entries removed THIS SESSION.
  Finding: 2 stale SEGMENT_LABELS entries removed; no other issues found.

ZF Cycle 2: Re-examined apps/csps-playground/src/components/TopNav.tsx — SEGMENT_LABELS now
  has 0 stale journey entries; NAV_ITEMS Journeys section has 1 entry only. Re-examined
  apps/csps-playground/src/app/platform/journey-trunk/page.tsx — redirect intact, no backlinks.
  Re-examined apps/csps-playground/src/app/platform/journeys/page.tsx — redirect intact,
  no backlinks. Re-examined apps/csps-playground/src/app/platform/journey/page.tsx —
  SUBSTRATE/DEFAULT/VARIETY structure confirmed. 0 new findings.
  verify_top_exit: 0 (exit_code=0, 0 blocking validators).

STATUS: M1 ZF ACHIEVED — nominal-ZF gap closed. M1 is DONE.
