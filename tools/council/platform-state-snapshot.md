# CSPS Platform State Snapshot
# Sonnet updates this file at every session close and before every Opus communication.
# Opus reads THIS FILE FIRST — it is the single source of platform reality.
# Do NOT scan the system. Read this, then read only the specific documents referenced below.

---

## §1 — Current Platform Identity

```yaml
session: S029
date: 2026-05-14
platform_version: CSPS v0.29
governor: Yariv Fink (group:finky)
repo: github.com/CommarkG/csps
last_commit: 37f0e7a (S029: council protocol gaps + Sonnet Report)
sonnet_model: claude-sonnet-4-6[1m]
```

---

## §2 — Platform Health (last pnpm verify run)

```yaml
validators: 104
exit_code: 0
vlt_blockers: 0
grl_open: 0
health_score: 88%
enforcement_rate: 80%  # 32/40 validators live (week-4 scheduled for remainder)
```

---

## §3 — What Is Live in Production

| App | URL | Status | Since |
|---|---|---|---|
| Budget Planner | csps-budget-planner.vercel.app | LIVE — Clerk sign-in rendering | 2026-05-13 |

Architecture: pnpm monorepo, 8 workspaces, Next.js 14, Clerk auth, Supabase (PostgreSQL), ZenStack policies, Vercel deployment.

---

## §4 — Core Spine Structure (what governs everything)

```
.claude/core-spines/
  L1_CORE_GVRN.md          ← Constitution — SEALED
  L1_CORE_ARCH.md          ← Architecture — SEALED
  L1_CORE_AI.md            ← AI behavior — SEALED
  L1_CORE_OPER.md          ← Operations — SEALED
  L1_CORE_VALD.md          ← Validation — SEALED
  L2_DOMAIN_*.md (17 files) ← Operational domains
  L3_INSTANCES_*.md (5 files) ← Specific instances
```

Precedence: GVRN > VALD > ARCH > AI > OPER

---

## §5 — What Changed Since Last Opus Turn (Turn 21, S028)

**Turn 21 was:** Opus ratified Unified Scope Model (S0-S5), L2_DOMAIN_AI_CONTEXT_ARCHITECTURE, and 7 retrograde principles. Sonnet was directed to: build scope validators, backfill scope_level, wire session-context-record.

**What Sonnet actually delivered (S028-S029 delta):**

| Item | Status | Commit |
|---|---|---|
| Gate 3 — Budget Planner live on Vercel | DONE ✅ | 74699da |
| Prisma type root cause fixed (output="./generated/client" removed) | DONE ✅ | bf6ff0f |
| @csps/integrations workspace package wired | DONE ✅ | 9fba3f9 |
| External Integrations Hub: Vercel (10 rules) + Supabase (8) + Clerk (8) + ZenStack (7) | DONE ✅ | 9adf9c6 |
| GRL: all OPEN requests resolved | DONE ✅ | 55423df |
| SROF-012 multi-perspective review prepared | DONE ✅ | 0361abc |
| Council protocol gaps documented | DONE ✅ | 37f0e7a |

**What was NOT done from Turn 21 directives:**
- ADR-0027: scope_level on all artifacts — NOT done (validate-scope-level-declared.mjs not built)
- validate-scope-conflict.mjs → BLOCKING upgrade — NOT done (still advisory)
- backfill scope_level script — NOT done
- pre-tool-use-scope-guardian.sh — NOT done
- session-context-record.md populated — NOT done

Reason: Gate 3 deployment work consumed the session. These are deferred to S030.

---

## §6 — Open Issues Requiring Opus Input (Priority-ordered)

### CRITICAL (security / correctness)

**SEC-001: staffRole self-promotion gap**
`schema.zmodel:141` — `@@allow("update", auth().id == id)` allows a user to update their own User record. `staffRole` is a field on User. If the API layer doesn't strip `staffRole` from update payloads, a user can self-promote to staff bypass (grants cross-tenant read to ALL tenants). ZModel field-level deny needed.

**PERF-001: balance/route.ts unbounded query**
`apps/budget-planner/src/app/api/budget/balance/route.ts:48` — `?all=true` path does unbounded `findMany` with no `take`. In-process JS aggregation. Will OOM or timeout at 100K+ transactions. Needs: Prisma `groupBy` with `_sum`, or raw SQL, or materialized view.

### HIGH (platform readiness for App #3)

**UX-001: JWT refresh gap on sign-up**
Window between sign-up and first tenantId in JWT (Clerk TTL ~5 min) shows 403 → redirect to sign-in → infinite loop. User sees "broken login", not "setting up account." Pattern needed: polling endpoint, Clerk session_variables, or sync org creation in user.created webhook.

**DEV-001: apps/template/ is docs-only**
`apps/template/` has 2 files (README.md + .env.example). No runnable scaffold. Every new app must copy budget-planner and manually strip domain logic. Need minimum viable scaffold: package.json, layout.tsx (ClerkProvider), middleware.ts, sign-in/up pages, next.config.js, vercel.json.

---

## §7 — Documents Opus Should Read (in order)

1. **This file** — `tools/council/platform-state-snapshot.md` (you are reading it now)
2. **Sonnet Report + L1 items** — `tools/council/sonnet-turn.md` (bottom section: "Sonnet Report — S028/S029")
3. **Full 14-question review** — `docs/plan/_handoff/VAULT/opus-srof-012-platform-core-readiness-review.md`
4. **Context architecture (Turn 21 output)** — `.claude/core-spines/L2_DOMAIN_AI_CONTEXT_ARCHITECTURE.md`
5. **Current schema** — `libs/policies/schema.zmodel` (first 100 lines — generator + models)

**Do NOT read:**
- `docs/plan/_handoff/VAULT/` broadly (189 files — too many, use targeted reads)
- `tools/validators/` broadly (104 files — not needed for this turn)
- Any file not listed above unless a specific question requires it

---

## §8 — Council Communication Protocol (what Sonnet needs from Opus)

Opus: please confirm or amend this protocol on your side:

1. **Snapshot-first reading**: Opus reads `platform-state-snapshot.md` first on every turn. Sonnet updates this file before every Opus communication. No system scanning needed.

2. **Turn format remains as per PROTOCOL.md** — but Opus should explicitly state "I have read the snapshot dated [date], platform at S[NNN]" at the top of every turn to confirm reading current state.

3. **Express reviews** (L1): Opus produces a 5-line EXPRESS block per item. Sonnet implements without full advisory session.

4. **Security items escalate to L2 automatically**: anything touching `schema.zmodel:@@allow` or API auth patterns → full Opus turn, not express.

5. **Opus persona for Virtual Audit (L0)**: Sonnet's internal L0 self-check should ask "what would Opus say?" using this knowledge base:
   - Opus consistently catches: missing field-level policies, unbounded queries, timing race conditions, cross-tenant data leakage
   - Opus's primary audit questions: (a) What is the scale failure mode? (b) What is the security boundary? (c) What is the rollback path? (d) Does this contradict a sealed principle?
   - When L0 answer is "I don't know" → escalate to L1 immediately, do not proceed

---

## §9 — Sonnet Prohibitions Until Opus Responds

- Do NOT implement ENH-001 (balance fix) without Opus ratifying the query pattern
- Do NOT implement any schema.zmodel @@allow change without L2 review
- Do NOT build apps/template/ scaffold without Opus ratifying the minimum viable set
- Do NOT promote validate-scope-conflict.mjs to BLOCKING without Turn 22 directive

---

## §10 — What Just Changed (since last Opus turn)

| Commit | What | Status |
|---|---|---|
| 7a821af | SEC-001: staffRole @@deny live in schema.zmodel | DONE |
| 908e7f9 | SROF-008 filed in request log | DONE |
| bb7d960 | platform-state-snapshot.md + opus-turn-22-request.md created | DONE |

ZenStack v2 limitation discovered: `@@allow fields:` not supported. VLT-S029-FIELD-SCOPE tracked.
Ready for PERF-001 (balance/route.ts groupBy) on next directive.

| cad7482 | PERF-001: groupBy replaces unbounded findMany in balance/route.ts | DONE |
| ec07fd1 | SEC-001 Sonnet Report + snapshot update | DONE |

| 7e90760 | DEV-001: 18-file template scaffold + pnpm create:app | DONE |
| Turn 32 | Mini-tree protocol sealed, file naming convention sealed, E1-E4 queue registered | DONE |

**E-session build queue (registered, not yet built):**
E1: validate-mini-tree-integrity.mjs (SPI=0.15) | E2: validate-file-complexity.mjs (SPI=0.10) | E3: validate-file-naming.mjs (SPI=0.15) | E4: validate-opus-chat-jump-freshness.mjs (SPI=0.05) | E5: backfill principle slice names (SPI=0.25)

| 425f20b | S030 E2+CAP: validate-file-complexity LIVE + Context Alignment Preamble | DONE |
| 93fa37d | S030 E0: validate-platform-capacity LIVE | DONE |
| a2fac99 | S030 E1: validate-mini-tree-integrity LIVE | DONE |

**S033 STATUS: CLOSED** | 113 validators | email+jobs+monitoring live | libs/integrations/ complete
**S032 STATUS: CLOSED** | 113 validators | exit_code=0 | Security Phase 1 complete | 25 moat elements
**S031 STATUS: CLOSED** | 110 validators | exit_code=0 | E3+E4 LIVE | AGENTS.md 179 lines | 23 moat elements
**S030 STATUS: CLOSED** | 108 validators | exit_code=0 | CAP in session-open.sh
**Critical:** agents-md-lines at 199/200 hard limit — Governor decision required before adding AGENTS.md content

*Last updated: 2026-05-14 | Session: S030 CLOSED | Last commit: 425f20b*
