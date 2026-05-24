---
id: SIA.VAULT-ARCHITECTURE
name: VAULT-ARCHITECTURE
description: "Complete vault system design — 5 vault types, vault-first protocol, Opus/Sonnet routing, daily/weekly/monthly processing cadence, SWIFT implementation criteria, dynamic tagging, mini-tree intake-log structure. The system's default is: vault first, process deliberately."
type: architecture
diataxis_type: reference
protection_level: protected
status: ratified
core_spines: [GVRN, AI, OPER]
core_spine: GVRN
schema_anchor: vault_files
version: "1.0"
session: S060
owner: group:finky
lifecycle: production
lifecycle_state: active
context_question: "Where should this input go? Which vault type matches it? Is this SWIFT-eligible or must it be vaulted for deliberate processing?"
context_quote: "We are not in a rush. We'd rather save, complete what we started, and then address respectfully what came up."
inherits_from: "Platform Genome §6 Core Seeds + R1-04-THRESHOLD.md + R2-01-PLATFORM-INTELLIGENCE-ENGINE.md"
links:
  - { rel: threshold, href: R1-04-THRESHOLD.md }
  - { rel: cie, href: R2-01-PLATFORM-INTELLIGENCE-ENGINE.md }
  - { rel: zero-friction, href: ZERO-FRICTION-INTAKE.md }
  - { rel: improvement-register, href: ../../tools/data/improvement-register.yaml }
  - { rel: gap-register, href: ../../tools/data/gap-recurrence-register.yaml }
---

# Vault Architecture

> The CSPS default: vault first, process deliberately.
> Real-time processing is the exception, not the rule.
> Every input finds a home — nothing is discarded, nothing is lost to context limits.

---

## Core Principle: The Vault-First Protocol

**Default behavior:** Every input that arrives → classify (Threshold) → determine routing → vault with context.

**Real-time processing only when:**
1. High urgency + S3 scope (structural principle change)
2. Blocking issue (validator fails, verify breaks, Governor explicitly stuck)
3. Governor directive marked as immediate ("fix now", "blocking")

**Everything else goes to the vault** — with full context preserved — for deliberate processing in the appropriate cadence session.

**Why this is efficient, not lazy:**
- Context limits make real-time processing of every insight lossy
- Deliberate processing with full context produces better decisions
- The vault creates a prioritized queue, not a graveyard
- Nothing is lost — it's waiting for its optimal moment

---

## The 5 Vault Types

### VAULT-STRATEGIC
**Purpose:** Architectural decisions, principle changes, ratification requests
**Urgency:** Monthly processing (deep-dive session per topic)
**Routing:** Opus (ratification required)
**Examples:** New architectural pattern discovered, principle that contradicts existing, Governor directive that changes platform direction
**Location:** `docs/plan/_handoff/VAULT/strategic/`
**Status flow:** `pending → ratified | rejected | deferred`

### VAULT-OPERATIONAL
**Purpose:** Process improvements, workflow changes, K≥2 pattern fixes
**Urgency:** Weekly processing
**Routing:** Both (Opus designs, Sonnet implements)
**Examples:** Recurring gap with K≥2, improvement in how PROMTs are structured, workflow friction discovered in a session
**Location:** `docs/plan/_handoff/VAULT/operational/` (includes improvement-register.yaml)
**Status flow:** `pending → triaged → processing | swift-implemented → done`

### VAULT-TECHNICAL
**Purpose:** Bugs, fixes, implementation tasks with clear specs
**Urgency:** Daily or per-sprint processing
**Routing:** Sonnet (execution, Opus ratification for anything >S1)
**Examples:** Validator fails, build error, wet trial bug, missing package
**Location:** `tools/data/gap-recurrence-register.yaml` + `apps/*/wet-trial-log.yaml`
**Status flow:** `new → triaged → implementing → done | archived`

### VAULT-INSIGHT
**Purpose:** Patterns, quotes, learnings, core seeds from sessions
**Urgency:** Session-close processing (Learning Loop)
**Routing:** Automated (CIE Learning Loop)
**Examples:** Governor says something quotable, Opus identifies a hidden principle, a pattern appears K≥1
**Location:** `docs/plan/pillar-0-governance/CSPS-QUOTES.md` + `tools/data/pending-plan-items.yaml`
**Status flow:** `captured → extracted → integrated | pending-ratification`

### VAULT-PENDING
**Purpose:** Inputs that arrived but have no current home or routing
**Urgency:** Weekly triage (Relay Engine surfaces these)
**Routing:** Opus triage (decides where it belongs)
**Examples:** An idea with no plan item, an observation that doesn't fit existing categories, an external input awaiting absorption
**Location:** `.csps/vault/pending/` (new directory — to be created)
**Status flow:** `arrived → triaged → routed-to-correct-vault | dropped-with-reason`

---

## Routing: Opus vs Sonnet vs Both vs Automated

| Input type | Scope | → Where |
|---|---|---|
| governor_directive | S3 (structural) | → Opus ratification → VAULT-STRATEGIC |
| governor_directive | S2 (process) | → Opus design → Sonnet execution |
| governor_directive | S1 (local) | → Sonnet SWIFT if eligible → else VAULT-TECHNICAL |
| architectural_insight | any | → Opus → VAULT-STRATEGIC |
| core_seed | K≥2 | → CIE Learning Loop → pending-plan-items.yaml |
| core_seed | K=1 | → VAULT-INSIGHT |
| correction | S3 | → Opus → gap-recurrence-register.yaml |
| correction | S1/S2 | → Sonnet SWIFT or VAULT-TECHNICAL |
| external_research | any | → VAULT-PENDING (triage before acting) |
| customer_feedback | any | → VAULT-INSIGHT → Avatar update → VAULT-PENDING if actionable |
| error | any | → Sonnet SWIFT if clear fix → else VAULT-TECHNICAL |
| quote | any | → VAULT-INSIGHT → CSPS-QUOTES.md automatically |

**Automation rules:**
- `type: quote` → automatic → CSPS-QUOTES.md (no human decision needed)
- `type: error` + `scope: S1` + `risk: low` → automatic → Sonnet SWIFT
- `type: core_seed` + K≥2 → automatic → pending-plan-items.yaml draft

---

## SWIFT Implementation Criteria

SWIFT = implement immediately without full vault processing.

**ALL 4 must be true:**
1. **Scope:** S1 (local) or S2 (process) — not S3
2. **Risk:** Low — reversible, no cross-actor impact, no structural change
3. **Size:** <2 hours of Sonnet work
4. **Precedent:** Pattern exists — not innovating, not inventing

**SWIFT is NOT appropriate when:**
- Scope is S3 (principle or structural change)
- Risk is medium/high
- Governor ratification is required
- No precedent exists

**After SWIFT:** Create a vault entry anyway (type=swift-implemented) — documents what was done and why it was safe to do immediately. This is the evidence trail.

---

## Dynamic Tagging and Status System

Every vault entry carries:

```yaml
tags:
  type: strategic | operational | technical | insight | pending
  scope: S1 | S2 | S3
  urgency: immediate | daily | weekly | monthly | someday
  routing: opus | sonnet | both | automated
  risk: low | medium | high
  swift_eligible: true | false
  session_target: S0NN  # which session to process in
  status: new | triaged | processing | swift-implemented | pending-session | done | archived
  k_count: N  # how many times this pattern appeared
  spine: GVRN | ARCH | AI | OPER | VALD
```

**Status is DYNAMIC** — updated as processing happens:
- CIE Relay Engine: updates `session_target` as sessions advance
- Learning Loop: updates `k_count` when pattern recurs
- Governance Engine: updates `status` when action is taken
- Governor: updates `urgency` and `routing` during triage

---

## Processing Cadence

### Daily (automated, no human input)
**What:** VAULT-TECHNICAL processing
**How:** pnpm audit:run (Audit Pipeline dispatcher) scans technical vault entries
**Output:** Status updates to technical items, SWIFT-eligible bugs auto-assigned to Sonnet
**Duration:** ~5 minutes, fully automated
**Trigger:** Session-close hook (or morning session-open)

### Weekly (semi-automated, Opus triage)
**What:** VAULT-OPERATIONAL + VAULT-PENDING triage
**How:** CIE Governance Engine surfaces K≥2 patterns, Relay Engine surfaces pending items
**Output:** Triaged items with routing decisions, draft plan items for K≥2 patterns
**Duration:** 30-45 minutes, one dedicated session
**Trigger:** Relay Engine flags when >5 pending items accumulate

### Monthly (deliberate, Governor-directed deep-dive)
**What:** VAULT-STRATEGIC — one TOPIC at a time
**How:**
1. Governor selects topic (from strategic vault)
2. New dedicated tab opens with ALL context for that topic
3. Process: topic → subtopics → ripple effects → 3 scopes → optimal actions
4. Output: Ratified decisions, new plan items, updated priorities
**Structure per deep-dive:**
```
Topic: [selected strategic vault item]
  └── Subtopics: [all items tagged with this topic]
      └── Ripple analysis: S1 (local) → S2 (related) → S3 (structural)
          └── 3 Scope extraction:
                S1: What specific things can be fixed/implemented?
                S2: What processes need updating?
                S3: What principles are hidden here that should be permanent?
          └── Actions:
                SWIFT: [implement immediately in this session]
                SESSION: [plan item for next sprint session]
                VAULT: [store for later — not urgent enough for current sprint]
```

---

## Mini-Tree Intake Log (scale solution)

The intake-log.yaml will grow. The mini-tree solves this without losing any data.

**Structure:**
```
.csps/threshold/
  intake-current.yaml     ← current session only (~50 entries max)
  
  L1-summaries/           ← pillar-level rollups (updated each session-close)
    GVRN-summary.yaml     ← all governance inputs, compressed to patterns
    ARCH-summary.yaml     ← all architecture inputs, compressed
    AI-summary.yaml       ← all AI behavior inputs, compressed
    OPER-summary.yaml     ← all operations inputs, compressed
    VALD-summary.yaml     ← all validation inputs, compressed
  
  L2-monthly/             ← monthly archives (one file per month)
    2026-05/
      threshold-summary.yaml    ← all May sessions, compressed by pillar
      session-index.yaml        ← which sessions contributed what
  
  L3-sessions/            ← full session logs (permanent, gzipped after 90 days)
    S059.yaml
    S060.yaml
    S061.yaml
```

**How it works:**
- Each session: entries go into `intake-current.yaml` (flat, full detail)
- Session-close: CIE aggregates current into L1 pillar summaries (pattern-level, not entry-level)
- Monthly: L1 summaries aggregate into L2 monthly summary
- After 90 days: L3 session logs compressed (gzip) — still recoverable, just archival

**The token efficiency:**
- Opus at session-open sees: `L1-summaries/` (compact patterns, ~100 lines)
- Opus does NOT see: `L3-sessions/` (full detail, potentially thousands of lines)
- If deep context needed: explicitly load the relevant L3 file

**Resonance with CSPS principles:**
- Mini-tree depth model: L1 (pillar) → L2 (monthly) → L3 (session) — same as schema depth
- Progressive disclosure: start with summaries, go deeper on demand
- Vault-first: never delete, only archive
- Gradual orchestration: CIE decides when to surface deeper context

**Is it doable?** Yes. The spine_tag from Threshold classifier maps directly to L1 pillar filenames (GVRN, ARCH, AI, OPER, VALD). The aggregation logic is a session-close CIE job. Low implementation risk.

**Push-back on one part:** Monthly archives (L2) might be premature until we have 6 months of data. Recommendation: implement L1 summaries now (immediate value, simple), add L2 monthly when the L3 sessions reach 10+. Sequential, not all at once.

---

## Vault Connection to Schema Elements

Every major schema element should have a vault entry slot:

| Schema element | Primary vault | Secondary vault |
|---|---|---|
| Behavioral contracts | VAULT-STRATEGIC (ratification) | VAULT-INSIGHT (pattern discovery) |
| Plan items | pending-plan-items.yaml | VAULT-OPERATIONAL |
| Gap register entries | VAULT-TECHNICAL | VAULT-OPERATIONAL (K≥2) |
| Improvement register | VAULT-INSIGHT | VAULT-OPERATIONAL |
| Avatar profiles | VAULT-INSIGHT (behavior signals) | VAULT-STRATEGIC (persona discovery) |
| Voice profiles | VAULT-STRATEGIC (new profile) | VAULT-OPERATIONAL (tone adjustment) |
| Bundle definitions | VAULT-STRATEGIC (new bundle) | VAULT-PENDING (bundle ideas) |
| CSPS Quotes | VAULT-INSIGHT (auto-captured) | VAULT-STRATEGIC (if quotable principle) |
| Context questions | VAULT-STRATEGIC (must be ratified) | VAULT-INSIGHT (draft candidates) |
| Wet trial findings | VAULT-TECHNICAL (bugs) | VAULT-INSIGHT (patterns) |

---

## Implementation Sequence (what Sonnet builds)

**Phase 1 (next PROTO — now):**
1. Extend `libs/threshold/src/types.ts` — add extended source taxonomy
2. Create `tools/scripts/threshold-classify.mjs` — Node.js wrapper for bash hook
3. Update `.claude/hooks/user-prompt-submit-intake.sh` — call real library
4. Create `.csps/threshold/L1-summaries/` directory structure
5. Add session-close aggregation to CIE Learning Loop

**Phase 2 (PROTO after that):**
6. Create `tools/data/vault-pending.yaml` — VAULT-PENDING register
7. Add SWIFT eligibility check to gap register entries
8. Create L2 monthly aggregation script

**Phase 3 (monthly deep-dive tooling):**
9. `/platform/vault` page — shows all vault entries by type + status
10. Monthly deep-dive tab generator (uses startup block + topic context)

---

*Vault Architecture v1.0 | RATIFIED S060 | Governor-directed | Opus-8*
*The vault is not a graveyard — it is the deliberate queue of everything the platform has learned and is waiting to process at its optimal moment.*
