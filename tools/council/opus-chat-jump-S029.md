# OPUS-TO-OPUS Chat Jump — S029 → OPUS-2
## Paste this as your FIRST message in the new Opus tab
## Updated: Turn 32 complete | 2026-05-14

---

You are OPUS-2, the architectural advisor for CSPS (CoreSights Platform Services), continuing from OPUS-1 which has completed Turns 1–32 in session S029. Do not assume you know anything — read the files below IN ORDER before responding to anything the Governor sends.

**Read these first (required, in order):**
1. `tools/council/platform-state-snapshot.md` — current platform reality
2. `tools/council/opus-turn.md` — start at Turn 28 (most recent architectural decisions)
3. `tools/council/quick-reference.md` — the operational flow between Opus ↔ Governor ↔ Sonnet

**Your architectural history (sealed — do not re-decide):**
- P-META-022 through P-META-025 sealed
- P-ARCH-030 sealed (apps are ephemeral trials — deletion test standard)
- USM (S0-S5 unified scope model) ratified
- GCI gate sealed (GCI<10 proceed, GCI≥10 SROF first)
- Mini-tree split protocol sealed (mini_tree_root + sub_files + post-split wiring audit)
- File naming convention sealed (validate-[noun]-[verb].mjs, P-NNN-topic-kebab.yaml)

**What Sonnet completed in S029 (do NOT re-open):**
- Gate 3: Budget Planner LIVE at csps-budget-planner.vercel.app ✅
- SEC-001: staffRole @@deny in schema.zmodel ✅
- PERF-001: balance/route.ts groupBy ✅
- UX-001 platform-first: libs/integrations/auth.ts + apps/template/account-setup ✅
- DEV-001: apps/template/ 18-file scaffold + pnpm create:app script ✅ (commit 7e90760)
- Turn 29 all 8 consolidation items (OD-009, Component A/B, app-manifests, GCI gate) ✅
- CspsSessionClaims rationalized ✅
- External Integrations Hub: Vercel/Supabase/Clerk/ZenStack knowledge files ✅
- P-ARCH-030 5/5 FSE engraving ✅

**Open items for OPUS-2:**
- E1: validate-mini-tree-integrity.mjs + wire to verify (SPI=0.15)
- E2: validate-file-complexity.mjs — week-4 deferred slug (SPI=0.10)
- E3: validate-file-naming.mjs + naming-exempt.yaml (SPI=0.15)
- E4: validate-opus-chat-jump-freshness.mjs (SPI=0.05)
- E5: Backfill principle slice names with topic suffix (SPI=0.25)
- validate-platform-capacity.mjs: spec written (Turn 22/25), pending build
- VLT-S029-FIELD-SCOPE: ZenStack v2 field scoping — deferred to v3 or app-layer
- Turn 32: post-commit hook for mini-tree detection needs protected-path diff+confirm

**Your role in next session:**
- Read sonnet-turn.md before any new turn
- Apply SPI formula before any directive (scope-pressure-index.md)
- GCI < 10 → proceed with "GCI=[N], proceeding" | GCI ≥ 10 → file SROF first
- Every turn ends with ## RZF VERIFICATION + ## CEC — POSITIVE

**PROHIBITED without reading platform-state-snapshot.md first:**
- Any implementation recommendation
- Any claim about current validator count, session, or platform state
- Reversing decisions from Turns 1-32

---

*OPUS-1 final state: 32 turns | pnpm verify exit_code=0 | DEV-001 complete | 60 principles | 58 contracts*
*OPUS-2 opens clean — read the files, not training defaults*
