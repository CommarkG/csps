# CSPS Platform State Snapshot
# Sonnet updates this file at every session close and before every Opus communication.
# Opus reads THIS FILE FIRST — it is the single source of platform reality.
# Do NOT scan the system. Read this, then read only the specific documents referenced below.

---

## §1 — Current Platform Identity

```yaml
session: S040
date: 2026-05-17
platform_version: CSPS v0.40
governor: Yariv Fink (group:finky)
repo: github.com/CommarkG/csps
last_commit: c2435cd (enforce: B_RZF_BEFORE_PROMPT — full 5-surface permanent enforcement)
sonnet_model: claude-sonnet-4-6[1m]
```

---

## §2 — Platform Health (last pnpm verify run)

```yaml
validators: 127+
exit_code: 0
vlt_blockers: 0
grl_open: 0
principles: 65
behavioral_contracts: 61
skills: 27
audit_slugs: 28
moat_elements: 25
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

## §5 — What Changed This Session (S039→S040 — OPUS-2 Turn 95+)

**S039 delivered (now CLOSED):**

| Item | Status | Commit |
|---|---|---|
| PROTO-018: Budget Planner build fixed (0 TS errors) | DONE ✅ | c2fc7f7 |
| B_RZF_BEFORE_PROMPT 5-surface permanent enforcement | DONE ✅ | c2435cd |
| post-stop-rzf-reminder.sh v2.0 BLOCKING | DONE ✅ | c2435cd |
| validate-directive-has-rzf.mjs BLOCKING | DONE ✅ | c2435cd |
| session-open.sh CAP: RZF mandate injected | DONE ✅ | c2435cd |
| developer-journey/ 10-doc mini-tree (pillar-4) | DONE ✅ | S039 |
| meta-platform/ 8-doc mini-tree (pillar-0) | DONE ✅ | S039 |
| quality-protocols/ (tools/council/) 3 spec files | DONE ✅ | S039 |
| COMPLETION-GAP-ANALYSIS-S039.md + UJT infrastructure | DONE ✅ | S039 |
| chat-jump-S039-complete.md (ZCA-compliant v2) | DONE ✅ | 8644dc3 |

**S040 opening:**

| Item | Status | Action |
|---|---|---|
| OPEN-030: App #3 domain decision | PENDING | Governor decision required |
| OPEN-031: EP-ERR for premature-done-on-tsc | PENDING | S040 housekeeping |
| OPEN-032: Audit (dashboard) route group | PENDING | S040 housekeeping |
| OPEN-033: Rule 6 pnpm build requirement | PENDING | S040 housekeeping |
| UJT-001: Budget Planner live visit | PENDING | Governor browser test |

---

## §6 — Open Items Requiring OPUS-2 Input (S037 priority)

### PRIMARY (S037 mandate)
**OPEN-001: PI-002 PI schema YAML + create-pi.mjs**
PI tracking infrastructure — every new libs/apps file needs a ratified PI item. Without this, implementation gate (PIG = validate-implementation-gate.mjs) has no schema. OPUS-2 specified in Turn 59.

**OPEN-002: PI-003 validate-implementation-gate.mjs (PIG)**
Blocks commits with new libs/ files not covered by a ratified PI.

### SECONDARY
**OPEN-006: post-stop-rzf-reminder.sh** — promote from STUB to ACTIVE
**OPEN-012: P-OPER-002 in principles.yaml** — currently only in universal-governance.md

Full register: `tools/council/opus-open-items.md` (18 pending items)

---

## §7 — Documents OPUS-2 Should Read (in order)

1. **This file** — `tools/council/platform-state-snapshot.md`
2. **Open items register** — `tools/council/opus-open-items.md`
3. **Turn 78 (last Opus turn)** — `tools/council/opus-turn.md`
4. **S036 HANDOFF** — `docs/plan/_handoff/HANDOFF-S036-to-S037.md`
5. **ZCA ratification record** — `tools/council/opus-turn.md` Turn 78 §ZCA Ratification

---

## §8 — Communication Protocol (7 rules — UPDATED S036)

Rule 7 (ZCA) added. Full protocol: `tools/council/communication-protocol-shared.md`

1. Identity handshake: `Opus, this is Sonnet.` / `[PROTOCOL: ID | STEP: N of M] Sonnet, this is Opus.`
2. Directive: self-contained, verification tail `node tools/verify.mjs exit_code=0 before committing`
3. Report: `Opus, this is Sonnet. [session] done at commit [sha] — [items]. Questions: (1)...`
4. Contextual locality: content at point of use, never "see §X"
5. Single active thread: one directive at a time
6. DONE standard: built + wired + called + output verified
7. **ZCA (NEW S036):** every cross-boundary message starts with WHO/WHAT/HOW/NOW

---

## §9 — Sealed Decisions (do NOT re-open)

- P-ARCH-030: apps are ephemeral trials
- P-ARCH-031: DONE = wired + called + verified
- P-UX-001: contextual-locality
- **P-UX-002: zero-context-assumption / ZCA — NEW S036, CONSTITUTIONAL**
- USM S0-S5 unified scope model
- GCI gate: GCI<10 proceed, ≥10 SROF first
- No Parallel Pipelines

---

## §10 — Session History (last 5)

**S040 STATUS: ACTIVE** | 127+ validators | B_RZF_BEFORE_PROMPT live | App #3 domain PENDING Governor
**S039 STATUS: CLOSED** | 127+ validators | Budget Planner build fixed | RZF enforcement 5/5 surfaces
**S038 STATUS: CLOSED** | 127 validators | STT module + quality-protocols mini-tree | DNA gate M-26 | communication protocol v2
**S037 STATUS: CLOSED** | 125 validators | PE Agent live | 65 principles | 61 contracts | creation completeness + enforcement trio + EP-ERR loop
**S036 STATUS: CLOSED** | 115+ validators | ZCA constitutional | 63 principles | 60 contracts | error registry + wiring audit live
**S035 STATUS: CLOSED** | 113 validators | storage+realtime+webhooks live | full async infra done
**S034 STATUS: CLOSED** | 113 validators | libs/components/ 5 UI shells | scope backfill done
**S033 STATUS: CLOSED** | 113 validators | email+jobs+monitoring live | libs/integrations/ complete
**S032 STATUS: CLOSED** | 113 validators | exit_code=0 | Security Phase 1 complete | 25 moat elements
**S031 STATUS: CLOSED** | 110 validators | exit_code=0 | E3+E4 LIVE | AGENTS.md 179 lines | 23 moat elements
**S030 STATUS: CLOSED** | 108 validators | exit_code=0 | CAP in session-open.sh
**Critical:** agents-md-lines at 199/200 hard limit — Governor decision required before adding AGENTS.md content

*Last updated: 2026-05-14 | Session: S030 CLOSED | Last commit: 425f20b*
