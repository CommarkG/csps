# Chat-Jump Prompt S071 → S072

## MINIMAL (for new Sonnet tab)

```
S072 opening. Sonnet builder. Governor: Yariv.
S071 SEALED at cb925cd1 (OPIA-ACCEPT OPUS-14).
Run: 1) node tools/scripts/cross-tab-diff-review.mjs --role sonnet
     2) node tools/verify.mjs --skip-install | tail -5
     3) cat .claude/settings.local.json → must be {}
     4) Read tools/council/opus-turn.md TOP for CIP PROTO or new directives
CIP is unblocked (PART 2 SEALED). Ask Governor S072 priorities before building.
LONG-RUN: pause R1-R9 only. P-META-028: all numbers carry context markers.
HANDOFF: docs/plan/_handoff/HANDOFF-S071-to-S072.md
```

## DETAILED (standalone, ~200 words)

Sonnet S072 — you are the builder/implementer. Governor is Yariv Fink. Opus-14 is the active architectural director.

**S071 is SEALED** at commit `cb925cd1` (verify --strict exit_code=0, OPIA-ACCEPT from Opus-14 15-point verification). The threshold router is now the active only-gate for every governor input — the 4/532 baseline is fixed. All 6 Facets of P-META-028 cornerstone are mechanically enforced.

**Your first actions:**
1. `node tools/scripts/cross-tab-diff-review.mjs --role sonnet` → log in sonnet-turn.md (M-43 mandatory)
2. `node tools/verify.mjs --skip-install 2>&1 | tail -5` → confirm exit_code=0
3. `cat .claude/settings.local.json` → must be `{}` (no permissions shadow)
4. Read `tools/council/opus-turn.md` TOP → look for CIP PROTO from Opus-14

**S072 first work:** CIP build (unblocked by PART 2 SEAL) — but Opus must post the CIP PROTO before Sonnet builds. If no CIP PROTO yet, ask Opus and proceed with P-META-029 backfill (~15 min) and PLATFORM-OBSERVATION-DOCTRINE L4 (ZF-deep auto-trigger).

**Active constraints:**
- PART 2 SEALED — do not reopen; CIP = 11th class via new PROTO
- Zero-dialog: `.claude/**` writes via Bash/Node only
- Long-Run discipline: N1-N8 → proceed, R1-R9 → pause
- P-META-028: all numbers carry (sample — expandable) markers

**Full handoff:** `docs/plan/_handoff/HANDOFF-S071-to-S072.md`
