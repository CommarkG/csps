---
id: csps.governance.prevention-framework
name: prevention-framework
description: "CSPS Prevention Framework — advanced draft. Core definitions, mindset, quotes, CAQs, user journeys, consultation design. The structural moat against recurring failure classes."
version: 0.1-draft
owner: group:finky
lifecycle: experimental
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
diataxis_type: reference
session: S043
impl_status: swift-implemented
links:
  - { rel: enforces, href: ./behavioral-contracts.md }
  - { rel: companion, href: ./core-scopes.md }
  - { rel: companion, href: ../../tools/config/unified-plan.yaml }
consolidation_cross_refs:
  - B_PRACE
  - B_STRUCTURAL_PREVENTION_DISCIPLINE
  - P-META-019
  - CAQ
  - PMI
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# CSPS Prevention Framework — Advanced Draft

> *This is a living document. It will be iterated in the playground.*

---

## Core Definition

**Prevention in CSPS means making a class of failure structurally impossible — not reminding the AI not to do it.**

Three levels:
1. **Creation prevention** — cannot create what already exists (T1 at Write tool call)
2. **Implementation prevention** — cannot implement without ratified plan (T2 in pnpm verify)
3. **Discovery prevention** — cannot observe a gap without registering it (T1 at PostStop)

The K=2 rule: any gap observed TWICE becomes a PREVENTION mandate. Not a reminder. A mechanical gate.

---

## The 5 Prevention Expert Quotes

*These appear in every relevant location — playground pages, session-open, handoffs.*

1. **"If it happened twice, it's a class. Classes need structural prevention, not personal vigilance."**
2. **"Advisory is visibility. Prevention is mechanical impossibility of the failure mode."**
3. **"Every gap discovered is a prevention that wasn't built. Build the prevention before closing the gap."**
4. **"The question is never 'why did it happen?' The question is 'what structure would make it impossible?'"**
5. **"Prevention at creation time beats prevention at commit time beats prevention at discovery time."**

---

## The 5 Prevention Expert CAQs

*Fire at every decision point where a new proposal is being made.*

1. *"Has this class of problem occurred before? If yes — where is the structural prevention?"*
2. *"Am I fixing an instance or installing prevention? If instance only: is technical debt accumulating?"*
3. *"What would have prevented this from being discovered rather than prevented?"*
4. *"If this gap recurs in 3 sessions, what does the T1 hook look like that catches it?"*
5. *"What's the training default that causes this failure? Have I named it explicitly?"*

---

## The Prevention Gap Map (from S043 ZF audit)

| Gap observed | Root cause | Prevention built | Prevention missing |
|---|---|---|---|
| Proposing "new" input types that existed | B_NO_INVENTION has T3-only enforcement | validate-consolidation-check.mjs | pre-tool-use-check-existing.sh (T1) |
| "Developer journey needs defining" when it exists | Same root cause | — | Same T1 |
| PE formula described incorrectly | No verify-before-claim on conceptual descriptions | B_VALIDATE_BEFORE_ASSUME | T1 for conceptual claims (not just tool calls) |
| session-open silent fallback | bash/JS quoting bug | session-open-context.mjs (S042) | validate-session-open-health.sh (OPEN-054) |
| Governance contracts T3-only | No T1/T2 required at creation | enforcement_tier backfill (S043) | Pre-commit check: new contract without T1+T2 = warning |

---

## Enforcement Architecture (5/5 FSE)

**T5 AGENTS.md:**
`❌ Never propose new tooling, validators, or contracts without first searching: git grep [concept] + ls tools/validators/ + grep behavioral-contracts.md`

**T4 B_PREVENTION_FIRST (to engrave):**
Every new plan item must have §PA Prevention Analysis. The analysis names: the training default causing the gap + the T1/T2 that prevents recurrence.

**T3 session-open:**
Prevention Expert CAQs injected at session start. Prevention quotes in the PRACE block.

**T2 validate-prevention-coverage.mjs (to build):**
Checks that new plan items in unified-plan.yaml have `pmi.intent_depth` and at least one `caq_question`. ADVISORY initially.

**T1 pre-tool-use-check-existing.sh (to build):**
Before any Write to `docs/` or `tools/`: "PREVENTION GATE: did you search for existing implementations?"

---

## User Journeys — 6 Types

### Governor
*Strategic direction, ratification, architectural decisions.*

Stage 1 → Read planning hub → Stage 2 → Assess PMI alerts → Stage 3 → Answer CAQs → Stage 4 → Ratify → Stage 5 → Monitor activation → Stage 6 → Override with declaration

CAQs: "Is original intent still current?" / "What changes if delayed?" / "3-session test needed?"

### Sonnet Builder
*Implementation, following ratified plans.*

Stage 1 → Read unified-plan.yaml (ratified only) → Stage 2 → Verify PMI≥4/5 → Stage 3 → Implement (one at a time) → Stage 4 → Verify (pnpm verify + findings-categorizer) → Stage 5 → Report (SROF) → Stage 6 → Tag activation start

CAQs: "Is this in ratified scope?" / "Am I implementing or planning?" / "Component B exists?"

### Opus Advisor
*Architectural review, plan design, ZF interrogation.*

Stage 1 → Read SROF → Stage 2 → ZF interrogate → Stage 3 → Fire CAQs → Stage 4 → Design plan items → Stage 5 → SROF response → Stage 6 → Never implement

CAQs: "Did I check what exists?" / "New pattern or refinement?" / "What prevents misimplementation?"

### Human Developer
*Building apps using the CSPS platform.*

Stage 1 → `pnpm dna:bundle --target=developer` → Stage 2 → Threshold (crystallize intent) → Stage 3 → Plan items → Stage 4 → `pnpm create:app` → Stage 5 → Build → Stage 6 → Validate → Stage 7 → Deploy → Stage 8 → Graduation

CAQs: "apps/ or libs/?" / "Component B?" / "Already in libs/integrations?"

### External AI Co-worker
*Research, analysis, read-only zone.*

Stage 1 → DNA bundle (`--target=external-ai`) → Stage 2 → Zone model check → Stage 3 → Work in read-only → Stage 4 → Output as EXT-KNOW → Stage 5 → Governor review → Stage 6 → Threshold intake

CAQs: "CSPS vocabulary used?" / "Proposing or implementing?" / "Which zone?"

### Enterprise Developer
*Higher permissions, custom governance needs.*

Stage 1 → `tier: enterprise` tenant → Stage 2 → Feature flags active → Stage 3 → API access → Stage 4 → Custom threshold rules → Stage 5 → Integration → Stage 6 → Audit trail

CAQs: "Tenant scope correct?" / "Tenant isolation (tenantId on every model)?" / "GDPR implications?"

---

## Consultation from Playground Pages

### Architecture

```
Playground page → /api/consult (Vercel Edge Function) → Claude API
```

**System prompt:** `pnpm dna:bundle --target=external-ai` + current page context
**Security:** API key in Vercel env vars (server-side only)
**UI:** Floating "💬 Ask CSPS" button on every page

### What's needed
1. Restructure playground → Next.js (enables API routes)
2. `/api/consult.js` Edge Function
3. Consultation widget in nav.js
4. `ANTHROPIC_API_KEY` in Vercel env vars

### Context injection per page
```javascript
const systemPrompt = [
  dnaBundleOutput,
  `Current page: ${page.label}`,
  `Page goal: ${page.goal}`,
  `Governing spine: ${page.alignment.spine.join(', ')}`,
  `User type: ${currentUserType}`
].join('\n\n')
```

---

## What Gets Built and By Whom

**Opus designs (this document):** Prevention framework, user journeys, consultation architecture.

**Sonnet builds (PROTO-030, sequential):**
1. `tools/config/unified-plan.yaml` — the ONE SOURCE
2. `pre-tool-use-check-existing.sh` — prevention gate T1
3. `csps-playground/platform/user-journeys/index.html` — 6 user types
4. Prevention quotes + CAQs in playground pages

**Governor ratifies:** B_PREVENTION_FIRST contract + consultation API infrastructure (requires Next.js restructure decision).

---

*Prevention Framework v0.1-draft | S043 | Will iterate in playground*
