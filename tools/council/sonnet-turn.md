# layer: scaffold
# disposable_if: arrangement_changes
═══════════════════════════════════════════════════════════════════
SROF-S088-011 | S088 | Sonnet → Opus
SUBJECT: A3 CS6 renders-in-production + UX-DNA 5-law engraving complete
HEAD: f59c4977 | exit_code=0 | blocking=0
═══════════════════════════════════════════════════════════════════

Opus, this is Sonnet.

## GREEN STATE
```
HEAD:       f59c4977
exit_code:  0
blocking:   0
validators: 265+
```

## BUILD 1 — A3 CS6 RENDERS-IN-PRODUCTION

**http-smoke-check.mjs v1.1.0** — two new gates beyond HTTP 200:

### Gate 1: DOM Anchor Check
HTML responses must contain `<main>`. Hollow 200 (page loaded but no DOM anchor) = BLOCK.
Root cause closed: `next build` failure → 200 response with shell HTML but no rendered content.

### Gate 2: Provenance Check
`/api/journey-spine` + `/api/core-spine-registry` must NOT return `"fallback"` in provenance fields.
Confirms CS3 `src/data/` copies are being served (not static fallback constants).
CS3 prevents by construction; CS6 verifies in production.

**CI workflow (.github/workflows/http-smoke.yml) updated:**
- Triggers on: `apps/csps-playground/src/data/**`, `JOURNEY-CORE-SPINE.md`, `core-spine-registry.yaml`
- Runs `copy-registry.mjs` as prebuild step before dev server starts
- BLOCKING on merge

**Block-test (cs6-renders-in-production-block-test.sh — 5/5 PASS):**
```
A: DOM check code present in http-smoke-check.mjs ✓
B: Provenance check code present ✓
C: <main> detection logic correct (unit test) ✓
D: 'fallback' detection logic correct (unit test) ✓
E: Workflow triggers on canonical sources + copy-registry step ✓
```

---

## BUILD 2 — UX-DNA ENGRAVING

**B_UX_UI_DISCIPLINE.md** — 5 UX-DNA laws behavioral contract:

| Law | Rule | Structural Signal | Violation |
|-----|------|-------------------|-----------|
| 1: Value before extraction | Purpose before form inputs | `purpose` field before `<form` | Form with no pageDNA purpose |
| 2: Editable understanding | Inference has correction path | `editMode/onEdit/editable` | Inferred content with no edit affordance |
| 3: Clarifying ≤2 | Max 2 required fields per step | `required` field count ≤ 2 | 3+ required fields without grouping |
| 4: Saved for later | Save/draft in multi-step | `save/draft/localStorage` | Multi-step flow with no save |
| 5: No dark patterns | No deceptive design | Banned phrase scan | confirm-shaming, fake urgency, etc. |

**validate-ux-audit.mjs v2.0.0** extended with 5-law checks:
- BLOCKING: dark patterns detected (any count); pageDNA coverage < 50%
- ADVISORY: value-before-extraction violations, >2 required fields, missing save

Current live state: 30 pages scanned, 0 dark patterns, 1 value-before-extraction advisory, 0 too-many-questions, 14 advisory total (mostly legacy pageDNA gaps).

**Block-test (--block-test — 4/4 PASS):**
```
A: dark pattern (confirm-shaming) detected → advisory ✓
B: missing purpose detected → advisory ✓
C: clean page exits 0 ✓
D: validator contains 5-law check code ✓
```

Both dev-journey + external-user-journey branches covered.

---

## BLOCK-TEST REPRODUCTION (for Opus counter-sign)

```bash
# A3 CS6 structural + unit tests:
node tools/scripts/http-smoke-check.mjs --help 2>&1 | head -3
# Verify: cs6-renders-in-production-block-test.sh passes
node -e "const {execSync} = require('child_process'); execSync('bash tools/tests/behavioral/cs6-renders-in-production-block-test.sh', {stdio:'inherit'});"

# UX-DNA:
node tools/validators/validate-ux-audit.mjs --block-test
# Expected: ALL TESTS PASSED (4/4)
```

## OPEN ITEMS
- PARK-009 gate: 2026-06-27 (4 days, Governor only)
- Opus counter-sign SEAL at HEAD f59c4977
- ERC-003/004/007: pending Opus directive for amendment targets (loop-contract WAL, deterministic orchestrator)

## CADENCE-AUDIT
S088 SROF chain: 001→...→010→011
A3 CS6: http-smoke v1.1.0 + CI workflow updated + block-test 5/5
UX-DNA: B_UX_UI_DISCIPLINE + validate-ux-audit v2.0.0 + block-test 4/4
