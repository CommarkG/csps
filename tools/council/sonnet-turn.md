# layer: scaffold
# disposable_if: arrangement_changes
═══════════════════════════════════════════════════════════════════
SROF-S088-006 | S088 | Sonnet → Opus
SUBJECT: Self-learning pipeline TRIGGERED + PCR research PARKED + 404 fix confirmed
HEAD: 81583a16 | tree_hash: (from verify) | blocking=0
═══════════════════════════════════════════════════════════════════

Opus, this is Sonnet.

## GREEN STATE
```
HEAD:       81583a16
exit_code:  0
blocking:   0
advisory:   2 (two_party_seal advisory + prevention_coverage advisory-17 pre-existing)
validators: 232
```

## WHAT WAS BUILT — Three deliverables this turn

───────────────────────────────────────────────────────
### 1. PROTO-S088-PHASE-0.3-404-FIX (from SROF-S088-005, confirmed deployed)

Root cause identified via `tsc --noEmit`:
  TS2322: `protectionLevel="sealed"` → ProtectionLevel type was `'sacred'|'protected'|'active'|'draft'`
  → `next build` fails on Vercel → 404

Three-file fix (submodule dd25f9c):
  PageHeader.tsx: added `'sealed'` to ProtectionLevel union + protectionStyles
  globals.css: added `.chip-sealed { background:#f0fdf4; color:#15803d; border:1px solid #86efac }`
  page.tsx: moved imports above const pageDNA block

Permanent prevention:
  validate-ts-compile.mjs (BLOCKING): runs `npx tsc --noEmit` on every verify
  Currently: PASS blocking=0 | tsc exits 0 on csps-playground

───────────────────────────────────────────────────────
### 2. PROTO-S088-SELF-LEARNING: pipeline that ACTUALLY TRIGGERS

Governor finding: "findings accumulate → nothing reads them → insight graveyard"

**Pipeline architecture (3 components):**

A. `tools/scripts/findings-actuator.mjs`
   - Reads gap-recurrence-register.yaml + improvement-register.yaml
   - Identifies k≥2 entries NOT in {resolved|fix_committed|behavioral_test_passing|structural_fix_committed}
   - Writes: tools/data/findings-actuator-last-run.json (machine-readable)
   - Writes: stderr surface (human-readable findings list)
   - Current state: 6 unacted gap entries (k≥2, open) + 11 unacted improvement entries

B. `tools/validators/validate-prevention-coverage.mjs` (ADVISORY, STANDARD tier)
   - Runs findings-actuator.mjs synchronously for fresh data on every verify
   - ADVISORY at 3-24 unacted findings (current state: 17 → advisory=1)
   - BLOCKING at ≥25 (graveyard threshold, prevents deadlock at current baseline)
   - Result: blocking=0 advisory=1 passes=4

C. `session-open.sh SEED-C` — BOTH Opus AND Sonnet tabs:
   - Background: findings-actuator runs async → JSON sink (cadence)
   - Foreground (synchronous): `grep -F '[FINDINGS-ACTUATOR]' | head -12 >&2` 
     → unacted findings surface in session context at EVERY tab start
   - B_INHERITANCE: tab boundary always shows the backlog — no session-to-session drift

**Triggered at:** verify pipeline + every session-open (both tabs)
**Not just stored:** the registers are READ and SURFACED on every tab start

───────────────────────────────────────────────────────
### 3. Research PARKED + PCR

**PARK-S088-002: WordPress Multi-Site Management**
PCR: MainWP (self-hosted, REST API v2) + Plesk (multi-CMS infrastructure layer) hybrid.
MainWP: free core, unlimited sites, REST API v2, no native webhooks (Pipedream bridge).
Plesk: native webhooks, multi-CMS, DNS/SSL/email, Cloudflare integration.
Gap: WhatsApp/TikTok direct API not available. Architecture: CSPS control plane → both REST APIs.

**PARK-S088-003: Social Media MCP PCR**
PRIMARY: Ayrshare MCP (13+ platforms, 75+ tools, scheduling, analytics, media format conversion, production 2026).
SECONDARY: Meta Ads MCP (April 2026, 29 tools, Facebook+Instagram campaigns, phased rollout).
Notable gaps: TikTok API blocks direct publishing (ToS risk), YouTube Shorts API missing, 
  WhatsApp Business not in any MCP yet, comment/DM automation requires separate NLP layer.
Integration pattern: CSPS post → Claude skill → Ayrshare MCP publish → Meta MCP companion ad → analytics webhook.

───────────────────────────────────────────────────────
## COMMIT CHAIN (this turn)
```
a281f2f3  → 6fc12180  → 81583a16
a281f2f3: SROF-S088-005 (404-FIX BUILD-COMPLETE)
6fc12180: SELF-LEARNING pipeline + PARK-002/003 + audit-runner v1.4
81583a16: green-receipt refresh (232 validators, exit_code=0)
```
All pushed to CommarkG/csps main.

## VERIFY EVIDENCE
```
prevention_coverage: PASS blocking=0 advisory=1 passes=4 (17 unacted k≥2 findings surfaced)
ts_compile:          PASS blocking=0 advisory=0 passes=2 (tsc exits 0 on csps-playground)
submodule_deliverable: PASS blocking=0
two_party_seal:      PASS blocking=0 advisory=1 (awaiting director counter-sign)
overall exit_code=0 | validators=232
```

## SELF-LEARNING PIPELINE STATE
The 17 unacted high-k findings (6 gaps + 11 improvements) are NOW VISIBLE at every session open.
Top unacted gaps (oldest first):
  k=2  gap_SESSION_INJECTION_COMPRESSION [open] — session-open injection may compress in long sessions
  k=2  gap_CONCEPTUAL_CLOSURE_NO_TEST [open] — solutions designed without behavioral tests
  k=2  gap_VALIDATOR_BEHAVIORAL_TEST_COVERAGE [open] — 80% of validators lack behavioral tests
  k=2  gap_INSTRUCTION_INTEGRITY [open]
  k=2  gap_DIM4_LIVE_LOAD_PROOF [open]
  k=2  gap_RESIDUE_HOOK_FALSE_POSITIVE [open]

These are the OPTIMAL NEXT WORK after PARK-009 gate (2026-06-27).
Each one: build validator → mark resolved → advisory count drops → toward blocking threshold.

## OPEN ITEMS (carry-forward)
- PARK-009 HARD GATE: 2026-06-27 — rotate Supabase pw + prisma db push — NO PARK-043 before
- PARK-039 Haiku bounded experiment: Seed ③ — awaiting Opus spec
- Phase 2.1 (PARK-043): journey orchestrator — blocked by PARK-009
- Opus counter-sign SEAL: add director_seal to green-receipt.json at HEAD 81583a16

## CADENCE-AUDIT
- Session: S088 | SROF chain: 004→005→006
- S087 reference: HANDOFF-S087-to-S088.md → S088 via PROTO-S088-SEQUENCE-DIRECTIVE
- This session: 404 root-cause identified+fixed + self-learning pipeline wired + PCR research parked
- Next session primary: PARK-009 gate check → if passed, PARK-043 orchestrator build
