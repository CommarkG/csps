---
id: csps.handoff.HANDOFF-S085-to-S086
name: HANDOFF-S085-to-S086
description: "S085→S086 handoff. Opus#24 rulings A-E sealed (ALIGN+HARDWIRE+INHERIT+Phase2+CadenceE). Journey-wiring expert review absorbed (PARK-043). 5 B5/B6 hardwires queued (post db-push 2026-06-27). verify=0 HEAD c57636f8."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
authored_by: Sonnet S085
authored_at: "2026-06-20"
core_spine: GVRN
diataxis_type: reference
schema_anchor: vault_files
impl_status: audit-1-complete
precedent_checked: true
---

# HANDOFF: S085 → S086

**FROM:** Sonnet S085  
**FOR:** Opus S086 (review) → Governor relay → Sonnet S086 (build)  
**HEAD:** `c57636f8` pushed to origin/main  
**verify:** `exit_code 0` [MEASURED: pnpm verify --no-cache at HEAD]  
**Date:** 2026-06-20

---

## Zone A — S085 Complete State

### What was sealed this session

| Item | Status | Evidence |
|------|--------|----------|
| Ruling A-ALIGN | DONE | PARK-040 stubs now carry WHO+WARRANT+ACTION (comm-core trunk). Trigger line captured via grep -iE. |
| Ruling A-HARDWIRE | DONE | `verify-hooks-functional.sh` runs `bash -n` on every hook before exec check. CRITICAL syntax error → BLOCKING. Closes the line-158 corruption gap exactly. |
| Ruling A-INHERIT | DONE | `post-stop-learning-loop.sh` already at `settings.json:363` Stop — confirmed, no change needed. |
| Block-test | PASS | Synthetic K=2 transcript → 1 stub with full WHO+WARRANT+ACTION [MEASURED]. `trigger: {role:user,content:K=2 recurrence...}` |
| Ruling D — Ghost-ref Phase 2 | DONE | `validate-register-reference-integrity.mjs`: HANDOFF-*.md files modified within 24h → BLOCKING on ghost-refs. Historical (S051-S084) stay ADVISORY. Uses `statSync.mtimeMs` proxy. |
| Ruling E — Auto-park cadence | DONE | `session-open.sh`: when `pending-auto-parks.yaml` stubs > 5 → PARK-040-REVIEW notice at every tab open. |
| verify=0 at Rulings commit | DONE | `b779dacf` → verify exit_code 0. |
| PARK-042 + PARK-043 registered | DONE | `c57636f8` is HEAD; verify=0 confirmed there too. |

### S085 inherited context (unchanged)

- **B4 schema:** `PersonaTier` (6 actors) + `BranchAxisType` (5 axes) + `JourneyEvent` comment → committed to `libs/policies/schema.zmodel`. db-push deferred → PARK-009 (2026-06-27).
- **Cadence ladder 8/8 dual-covered (M-46):** session-open.sh fires moat_coverage + dual_coverage + register_ref_integrity in background at every tab open. `validate-dual-coverage.mjs` confirms 8/8 [MEASURED S085].
- **SEED-A** (`validate-register-reference-integrity.mjs`): 763 files scanned, Phase 2 live (current-session HANDOFF blocking).
- **SEED-B** (`validate-handoff-completeness.mjs` + `boundary-prompt.template.md`): `## MOAT REVIEW` required in every handoff.
- **SEED-C** (`validate-dual-coverage.mjs`): 8 obligations context-independently covered. EXTENDED cadence via session-open.
- **TEG (PROTO-S084-TEG):** R9+R10 + T1+T2+T3 — token budget enforcement + efficiency guardian live.
- **PROTO-S084-HASH-CACHE:** SHA256 input manifest cache in verify.mjs. `--no-cache` wired in `post-stop-pnpm-verify.sh`. `always_rerun: true` on push_status + git_pushed_state.
- **B3 validators:** journey-gate (10/10 block-tests), trunk-matches-seed (5/5 invariants), journey-event-store (SEED-8 confirmed audit.events reuse).
- **PROTO-S084-COMM-CORE (WHO+WARRANT+ACTION):** comm-core trunk hardwired in PARK-040 stubs.
- **Team Learning Loop seed:** `1d08dd86` — core seed capturing the full learning orchestrator design + Haiku ability battery measured (see Zone B note).
- **Haiku envelope (measured):** count/judgment/single-pattern → RELIABLE. Cross-file set-ops → UNRELIABLE (T2+T5 over-report false positives). Use Haiku for scans; route set-ops to Sonnet.

### Open PARKs entering S086

| ID | Lane | Short description | Retrieve when |
|----|------|-------------------|---------------|
| PARK-S084-009 | obligation | Supabase pw rotation | **2026-06-27** — gated db-push is the same day |
| PARK-S084-040 | obligation | Learning Orchestrator — CAPTURE T1 + ROUTE T2 + PROPAGATE T3 (consolidates PARK-024/026/035/036/037) | After journey orchestrator B5/B6, or Governor pivot |
| PARK-S084-041 | queue | Consolidated per-role CARDS (Opus/Sonnet/Haiku) — always-loaded role+relationships card by session_role | AI-behaviour arc; small + high-value |
| PARK-S084-042 | obligation | Claude Code usage review + session/work orchestrator — routes work to cheapest capable model per measured Haiku envelope | Token-efficiency arc; feeds PARK-040 |
| PARK-S084-043 | obligation | Journey-as-operational-container — 5 B5/B6 hardwires (see Zone B below) | **B5/B6 post 2026-06-27 db-push** |

---

## Zone B — Planned Obligations for B5/B6 (PARK-043, DO NOT BUILD NOW)

**Gate:** db-push 2026-06-27 (PARK-009). All 5 are blocked until the B4 schema is live in Supabase.

**Load-bearing refinement (Opus-verified):** these hardwires use the SEED-2 risk-classed gate_mode ladder (blocking|advisory|silent per risk_class × phase), NOT a uniform "declare-phase-or-blocked" gate. Low-risk work stays light; T1 fires only where the matrix returns `deny`. §0b-C1 explicitly rejected uniform blocking — the platform fights rigidity, not adds it.

### B5/B6 Hardwire 1 — `pre-tool-use-journey-gate.sh` (T1)

**What:** Hook reads `JOURNEY_ID` from environment → looks up PEG level in `seed2-gate-mode-matrix.json` → calls `evaluate({peg, mechanism, risk_class, has_evidence})` → blocks if `result='deny'`, warns if `result='warn'`, passes silently if `result='allow'` or risk_class=low.  
**Why:** SEED-2 gate matrix EXISTS and is correct (10/10 tests PASS) but it's T2-only (detective). This T1 makes it structural — PEG violations are prevented, not caught retroactively.  
**Files to create:** `.claude/hooks/pre-tool-use-journey-gate.sh` + register in `settings.json` PreToolUse `Write|Edit` block.  
**Risk-classing:** consult `seed2-gate-mode-matrix.json` — the matrix already has `gate_mode: silent` for `risk_class: low`; T1 must respect that (don't uniform-block).

### B5/B6 Hardwire 2 — `@csps-journey-phase` DNA field

**What:** New annotation `@csps-journey-phase P3` (or phase ID) required in `@csps-enforces` frontmatter for new files created during a journey. Extend `validate-new-file-dna.mjs` (M-26) to check for it when `JOURNEY_ID` is active.  
**Why:** Every new validator/hook/schema element created this session has no `journey_phase`. DNA enforcement covers platform membership (M-26) but not journey assignment. Orphan nodes accumulate.  
**Scoping:** only required when `JOURNEY_ID` env var is set (i.e., when the orchestrator is active). PARK-043 calls this "context-gated" — not a global mandate.

### B5/B6 Hardwire 3 — Journey-event write path (SEED-8)

**What:** API route `POST /api/journey/events` → writes `entity_type='journey_event'` row to `audit.events` (already has `no_direct_write` RLS, so route goes through service layer). `post-stop-learning-loop.sh` calls this route at session close when `JOURNEY_ID` is set.  
**Why:** `validate-journey-event-store.mjs` confirmed architecture (SEED-8 decision: REUSE audit.events). Write path is missing — the event store is a confirmed empty table.  
**Sequencing:** requires B4 db-push first. The B5 Journey Admin live data feature (via schema) is the natural context.

### B5/B6 Hardwire 4 — `journey_phase` in handoff template (SEED-B extension)

**What:** Add required `## JOURNEY PHASE` section to `tools/templates/boundary-prompt.template.md`. Format: phase entered | phase completed | next phase | evidence. Extend `validate-handoff-completeness.mjs` to check for it (ADVISORY initially → BLOCKING once cadence established).  
**Why:** SEED-B currently enforces `## MOAT REVIEW` but not journey phase completions. Handoffs close sessions that advance P1→P2 without ever naming the phase. The handoff is the only reliable session-close surface.  
**Pattern:** mirror the MOAT REVIEW extension already done in S085.

### B5/B6 Hardwire 5 — `journey_gate_enforcement` as obligation #9 in `validate-dual-coverage.mjs`

**What:** Add 9th obligation to `OBLIGATIONS` array in `validate-dual-coverage.mjs`:  
```javascript
{
  id: 'journey_gate_enforcement',
  name: 'Journey gate T1 enforcement (SEED-2)',
  description: 'pre-tool-use-journey-gate.sh exists + wired in settings.json + consults gate matrix',
  required_validator: 'journey_gate',   // already in verify.mjs STANDARD tier
  required_tier: 'STANDARD',
  context_independent: false,           // set true once T1 hook wired (Hardwire 1 above)
  cadence_gap: 'T1 creation-gate missing until Hardwire-1 built',
  sink: 'tools/data/validate-journey-gate-last-run.json',
  handoff_step: 'SEED-B ## JOURNEY PHASE (Hardwire 4)',
}
```
**Why:** SEED-C tracks 8 drift-prone obligations. `journey_trunk` is one of them. But `journey_gate_enforcement` (the T1 hook actually firing) is not. If the T1 never gets built, dual-coverage won't catch that gap.

---

## MOAT REVIEW

| Moat | Status | Notes |
|------|--------|-------|
| M-26 DNA Inheritance | ✓ Active | `validate-new-file-dna.mjs` fires. Journey_phase extension = B5/B6 (Hardwire 2). |
| M-43 Cross-tab diff-review | ✓ Active | session-open.sh unchanged. |
| M-46 Dual-Coverage / Context-Independence Standard | ✓ Strengthened | HARDWIRE (bash -n) closes the hook-corruption gap. 8/8 confirmed. obligation #9 queued (Hardwire 5). |
| Journey gate (SEED-2) | ✓ Defined, half-wired | Gate matrix + block-tests 10/10 PASS. T1 hook missing (Hardwire 1 = B5/B6). |
| SEED-A Ghost-ref | ✓ Phase 2 live | Current-session HANDOFF ghost-refs BLOCKING. Historical ADVISORY. |
| SEED-B MOAT REVIEW in handoffs | ✓ Active | `validate-handoff-completeness.mjs` checks it. Journey-phase extension queued (Hardwire 4). |
| SEED-C 8/8 dual coverage | ✓ Active | Session-open cadence fires three EXTENDED validators. 9th obligation = B5/B6 (Hardwire 5). |
| PARK-040 auto-capture | ✓ Live | WHO+WARRANT+ACTION. Trigger line captured. Governor review cadence at >5 stubs (session-open). |
| **Moats at-risk** | None | All changes additive. |
| **Moats strengthened this session** | bash -n syntax check (M-46), Phase-2 ghost-ref (SEED-A) | |
| validate-dual-coverage.mjs output | Run: `node tools/validators/validate-dual-coverage.mjs` (cadence last-run JSON in tools/data/) | |

---

## ALIGNMENT QUESTIONS

Q1: **Journey-gate T1 Bash coverage** — Hardwire 1 (`pre-tool-use-journey-gate.sh`) fires on `Write|Edit`. But some PEG-affecting decisions happen in Bash (running a migration, deploying). Should the T1 hook also match `Bash`? Or is a post-Bash T2 check sufficient given risk-class gating from SEED-2?

Q2: **`@csps-journey-phase` scope** — Hardwire 2 makes the DNA annotation context-gated (only required when `JOURNEY_ID` active). Is that the right default, or should all new platform elements declare a phase even outside an active journey (retroactive categorization applies to all existing validators/hooks too)?

Q3: **PARK-041 vs PARK-043 sequencing** — Per-role CARDS (PARK-041) are small+high-value and don't require db-push. Should S086 open with PARK-041 before tackling the 5 B5/B6 hardwires (gated on 2026-06-27)? Or is the PARK-042 usage orchestrator review the better pre-db-push work?

Q4: **Unified vs separate orchestrators** — PARK-042 (usage/session orchestrator) and PARK-043 (journey orchestrator) are both "route→gate→verify" shaped. Should they converge into ONE design (platform work + AI session management unified), or stay separate systems with a shared interface contract?

## SONNET STARTUP BLOCK

```
═══════════════════════════════════════════════════════════════════
SONNET S086 — STARTUP
WHO:     Sonnet S086 | Role: builder
WARRANT: Handoff from Sonnet S085 (b779dacf S085-rulings + c57636f8 PARKs), verify=0
SESSION: S086
═══════════════════════════════════════════════════════════════════

INHERITED STATE:
  HEAD = c57636f8 (origin/main), verify exit_code 0
  B4 schema committed (db-push deferred to 2026-06-27 with PARK-009)
  Cadence: session-open fires moat_coverage + dual_coverage + register_ref_integrity (bg)
  SEED-A Phase 2: current-session HANDOFF ghost-refs BLOCKING
  SEED-B: ## MOAT REVIEW required in every handoff (validator active)
  SEED-C: 8/8 dual-covered (M-46)
  PARK-040 auto-capture: WHO+WARRANT+ACTION in stubs; Governor review at >5 stubs
  Ghost-ref Phase 2: mtime-based 24h proxy (statSync) for current-session detection
  bash -n check: verify-hooks-functional.sh now syntax-checks all hooks (CRITICAL=BLOCKING)

BLOCKED UNTIL 2026-06-27:
  PARK-009 (Supabase pw rotation) + PARK-043 (5 B5/B6 journey hardwires, see Zone B)

FIRST ACTION FOR S086:
  Read tools/council/opus-turn.md for Opus's opening directive.
  If db-push date has passed → start PARK-009 (pw rotation) first, then PARK-043 B5/B6 Hardwire 1.
  If before 2026-06-27 → Opus directs next milestone; candidates: PARK-041 (per-role cards),
  PARK-042 (usage orchestrator review), or B5 Journey Admin live data prep.

WHAT NOT TO DO:
  Do NOT build Hardwires 1-5 (PARK-043) before db-push.
  Do NOT build a uniform "declare-phase-or-blocked" gate — SEED-2 matrix is risk-classed.
  Do NOT fork learning-loop hook — inventory what post-stop-learning-loop.sh already does first (PARK-040).

STANDING DIRECTIVES:
  All file edits pre-approved (Governor permanent S084). Use Bash for .claude/** files.
  Comments-Before-Code on multi-batch PROTOs. CADENCE-AUDIT at every milestone report.
  Bidirectional council peer contract: surface what directive missed; label HIGH-VALUE claims.
═══════════════════════════════════════════════════════════════════
```

---

*Session S085 sealed. FROM SONNET | FOR OPUS. verify=0, HEAD c57636f8, pushed.*
