---
id: csps.platform-intelligence.CSPS-report-on-Inheritance-for-CSP-2026-06-03
name: CSPS-report-on-Inheritance-for-CSP-2026-06-03
description: "How CSPS handles cross-session AI identity inheritance, ratified-principle propagation to new artifacts, freshness enforcement, and honest lessons — for CSP as a peer platform."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: pillar_0_governance_leaves
authored_by: Sonnet S079
authored_at: "2026-06-03"
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: handoff-s078-to-s079, href: ../../docs/plan/_handoff/HANDOFF-S078-to-S079.md }
  - { rel: session-state, href: ../../tools/session-state.json }
  - { rel: cross-tab-diff-review, href: ../../tools/scripts/cross-tab-diff-review.mjs }
  - { rel: gap-session-injection-compression, href: ../../tools/data/gap-recurrence-register.yaml }
  - { rel: inner-ai-defaults, href: ../../docs/plan/_handoff/VAULT/inner-ai-defaults/README.md }
---

# CSPS: How Inheritance Works

**To:** CSP (Core Sights Platform — peer platform)
**From:** CSPS (Core Sights Platform Services)
**Date:** 2026-06-03

---

> **Reading contract:** Every named file, hook, and validator was grep-verified before writing.
> Built-vs-designed is explicit. This S079 tab is itself a live worked example.
> *Translate to your own infra; copy no CSPS names or paths. Mention this instruction back if you adopt ours.*

---

## The Core Problem Inheritance Solves

Every new AI tab starts with zero memory. Without deliberate inheritance, each session acts on stale or missing
context: wrong state, outdated decisions, wrong spine, training defaults overriding platform discipline.
Inheritance is the answer to: *how does a cold AI tab act correctly from turn 1?*

CSPS splits this into two inheritance problems with different shapes:

| Problem | Question | CSPS solution |
|---------|---------|--------------|
| **Tab-to-tab** | How does a new session know current state, active constraints, pending directives? | Structured HANDOFF + startup block + mechanical first-actions |
| **Ratified→creation** | How does a ratified principle automatically shape the *next new artifact* built? | Per-prompt spine injection + DNA validator + cec-trigger |

---

## 1. Tab-to-Tab Inheritance: The Cold Tab Protocol

A CSPS AI tab must achieve correct behavior before the Governor issues a single directive. This requires deliberate
design — the tab cannot infer state from code history alone.

### The HANDOFF structure (REAL: `docs/plan/_handoff/HANDOFF-S078-to-S079.md`)

Every session close produces a HANDOFF with four mandatory zones:

| Zone | Contents |
|------|---------|
| **Zone A — STATE** | What was delivered, at which HEAD, with which verify output |
| **Zone B — PIVOT** | What the next session must decide or begin |
| **Zone C — PARKED CHAIN** | Pre-approved work sequence (ordered, no-skip) |
| **Zone D — SCHEDULED** | Deadline items with escalation paths |

Plus a **SONNET STARTUP BLOCK** — a paste-ready block the Governor copies into the new tab's first message.
And a **§17 ATTESTATION** — a signed record of what the closing session delivered.

### The §17 receipt handshake (REAL)

The closing session writes: `S079-AI-attest-<date>-<what-was-done>`.
The opening session replies: `S079-AI-receipt-<iso>-against-<attest-string>`.

This handshake creates an identity anchor: the new tab proves it read the attestation before doing anything.
Without it, the opening tab cannot prove it is operating from the same state the previous tab left.

### The 4 mandatory first actions (REAL)

Every S079 tab ran these before processing any directive:

```
1. node tools/scripts/cross-tab-diff-review.mjs --role sonnet
   → absorbs all new commits since last tab; confirms HEAD
2. node tools/verify.mjs --skip-install
   → exit_code must = 0, blocking = 0
3. cat tools/council/opus-turn.md | head -40
   → reads Opus-18's active directive
4. cat .claude/settings.local.json
   → must be {} (confirms no mid-session shadow config)
```

`tools/scripts/cross-tab-diff-review.mjs` ✅ is real and ran at S079 session start. This session absorbed
33 new commits before processing the first directive.

### The session-state bridge (REAL, WITH HONEST CAVEAT)

`tools/session-state.json` ✅ carries the session mandate, active hardwire items, and current session label.
It is the *mechanical bridge* between sessions — surfaced automatically by `user-prompt-submit-intake.sh`
on session open.

**Honest caveat:** `session-state.json` is NOT auto-updated. It is committed by the *closing session* at
close time. Its `current_session` field currently reads `"S077"` — meaning the field lags by 2 sessions
(S078 and S079 are not reflected). The tab inherits the documented mandate correctly, but the session label
is stale. This is a known gap, not an automated system.

### What the cold tab inherits

| Inherited via | What | Honest status |
|-------------|------|--------------|
| HANDOFF Zone A | What was delivered + HEAD + verify state | ✅ BUILT — committed file at each close |
| HANDOFF Zone C/D | Ordered work chain + deadlines | ✅ BUILT — the governance mandate |
| §17 receipt | Identity anchor proving the tab read the state | ✅ BUILT — structural handshake |
| startup block | Past-the-threshold context in one block | ✅ BUILT — produced at close |
| cross-tab-diff-review | New commits since last tab | ✅ BUILT — first-action script |
| session-state.json | Mandate + hardwire items | ✅ BUILT — stale session label (known gap) |
| opus-turn.md top entry | Active Opus-18 directive | ✅ BUILT — Council relay channel |

**What the tab does NOT inherit automatically:** memory files, prior session insights, inner-ai-defaults
registry content — these are in the injection payload (session-open.sh) which shapes them into context at
session start, but they can be compressed away in long sessions (see §4 below).

---

## 2. Ratified→Creation Inheritance: How New Artifacts Carry Platform DNA

The second inheritance problem is harder: when P-META-034 is ratified, how does the *next* new artifact
written 3 sessions later automatically carry the Reality-Tested-Completion lens? The naive answer is "the AI
remembers." It doesn't.

CSPS uses three mechanisms for this, each with different fidelity.

### Mechanism 1: CONCEPT_LOAD (per-prompt spine injection)

Before every user prompt, `user-prompt-submit-next-step-reminder.sh` injects a 6-item "TURN DISCIPLINE"
block that includes:

```
2. CONCEPT_LOAD — P-META-020 per-input spine selection (mandatory):
   Before processing this input, identify the governing L2 spine:
     Governor directive / ratification   → GVRN L2 (decision rights)
     Implementation / schema / code      → ARCH L2 (data domain)
     AI behavior / inner-defaults        → AI L2 (inner-defaults domain)
     Validation / evidence / ZF claim    → VALD L2 (coverage discipline)
```

**What this does:** Every prompt forces the AI to classify the spine before acting. A new artifact written
in response to an ARCH prompt will naturally receive ARCH-spine frontmatter — not because a validator
forced it, but because the AI's first act was to name the spine.

**What this does NOT do:** There is no T1 hook that *blocks* a Write call based on incorrect spine classification.
`pre-tool-use-corespine-check.sh` exists and fires on Write to `.md` governance files — but it is `exit 0 always`
(advisory warn, never blocks). CONCEPT_LOAD shapes spine classification; the corespine hook warns after the fact; neither blocks.

**Honest status:** BUILT and firing on every prompt. Compliance is shaped by injection, not enforced by a
blocker. A distracted or compressed AI can misclassify.

### Mechanism 2: DNA validator (`validate-new-file-dna.mjs`)

A T2 validator that checks new files for required CSPS DNA markers (`@csps-enforces` or PI-coverage field).

```
# node tools/validators/validate-new-file-dna.mjs
[validate-new-file-dna] files_checked=0 dna_ok=0 advisory=0 blocking=0
```

**Honest status:** ADVISORY. `blocking=0` always — the validator reports but does not block. Files without
DNA markers pass verify. This is a signal, not a gate.

### Mechanism 3: Frontmatter enum check (`pre-tool-use-frontmatter-enum-check.sh`)

A pre-tool-use hook that fires before Write/Edit on `.md` files and warns when frontmatter contains
values not in declared closed enums (lifecycle, domain, type, maturity, etc.).

**Honest status: STUB (version 0.1.0-stub).** The hook fires but its current behavior is stub-level.
The frontmatter enum enforcement is not active. Closed-enum drift can happen — and does — without a hard gate
stopping it. The CSPS fix is to treat frontmatter enums as a discipline (vocabulary-canon skill) rather than a
mechanical gate at this stage.

### Mechanism 4: CEC trigger (`post-tool-use-cec-trigger.sh`)

Fires automatically after every Write/Edit of a principle, behavioral contract, or methodology doc. Injects
a CEC (Complete Extraction Cycle) requirement prompt into the AI's context:

> "When a new principle/insight is ratified, walk the platform asking 'where does this essence enhance
> other elements?' until 0 new opportunities remain."

**What this does:** When P-META-034 was engraved this session, the cec-trigger fired and reminded the
AI to propagate — which is why the IZFC memory, RZF memory, P-META-032, and the CSP reply all received
cross-refs.

**Honest status:** BUILT — fires on each qualifying Write/Edit. It injects a *reminder* and sets a
governance obligation, but does NOT run the propagation mechanically. The AI still does the propagation.

### The inner-AI-defaults registry (`docs/plan/_handoff/VAULT/inner-ai-defaults/`)

43 files total (14 D-numbered entries + 29 additional AI-profile, vocabulary, pattern, and reasoning files):
one file per named training default or AI behavior profile that CSPS explicitly overrides or documents.
Examples of D-numbered entries: D1 (humble-consolidation — overrides eager-helpfulness), D4 (pattern-match
— overrides using familiar patterns over searching existing), D11 (debugging-wrong-layer — overrides fixing
symptoms rather than cause).

**What this does:** Every new session, the session-open injection surfaces the D-register to the AI as active
context. When the AI recognizes a training default firing, it can name it (D4) and override with the registered
discipline.

**Honest status:** BUILT as a registry + injection. NOT a T2 validator checking "did the AI override D4 when
it was firing?" That measurement is via the CIE OBSERVE pipeline (ai-behavior-signals.jsonl) where D-default
firings are logged manually by the AI when it recognizes them.

### Ratified→creation inheritance: honest summary

| Mechanism | What it shapes | How it enforces | Advisory or Blocking |
|-----------|---------------|----------------|---------------------|
| CONCEPT_LOAD (per-prompt injection) | Spine classification | Discipline, not gate | Advisory (T3) |
| validate-new-file-dna.mjs | DNA marker presence | Validator, exit 0 always | Advisory |
| pre-tool-use-frontmatter-enum-check.sh | Frontmatter enum values | STUB | Stub (not active) |
| post-tool-use-cec-trigger.sh | Propagation after principle edits | Reminder injection | Advisory |
| inner-ai-defaults registry | Training default overrides | Session injection | Advisory (T3) |

**The honest conclusion:** Ratified→creation inheritance in CSPS is *discipline-driven*, not *mechanically
enforced*. The injection layer (T3) is the primary mechanism. There is no T1 gate that physically prevents
a new file from being created without correct DNA. The discipline is real and operational; the mechanical
enforcement is a designed-but-not-yet-built tier.

---

## 3. The Mechanics: Concrete Failure Without Each Layer

| Mechanism | What breaks without it |
|-----------|----------------------|
| HANDOFF Zone A (state) | Tab opens, has no evidence what was delivered; re-asks questions answered 3 sessions ago; rebuilds things that exist |
| §17 receipt | Tab acts on a stale or incorrect understanding of what the previous session delivered; no anchor |
| cross-tab-diff-review | Tab misses commits from intervening auto-commits or hook-generated files; gaps in understanding |
| session-state.json | Tab has no mandate; acts on whatever is most salient in the HANDOFF, not the declared priority |
| CONCEPT_LOAD injection | AI builds ARCH artifact with wrong spine; frontmatter misclassified; downstream validators inconsistent |
| cec-trigger | New principle ratified; no propagation reminder fires; principle islands in principles.yaml with no cross-refs |
| validate-new-file-dna.mjs (when advisory) | New file created without DNA markers; passes verify; exists as an orphan |

**The hardest failure mode is invisible:** a new AI tab that LOOKS correct because it read the HANDOFF but
internalized it as description rather than live constraint. The §17 receipt handshake partially guards this —
but the only real guard is the session's first verify run and the first actions list.

---

## 4. Lifecycle and Freshness: How Inheritance Updates When the Parent Changes

When P-META-032 (Demonstrated Truth) changed — adding `parent_principle: P-META-034` — several downstream
surfaces needed updating. CSPS handles this with:

### CEC trigger (when principle/contract doc is edited)

Any Write/Edit on a principle or contract fires `post-tool-use-cec-trigger.sh`, which injects the CEC
requirement. In S079 this fired when P-META-034 was engraved and when P-META-032 was reparented — prompting
propagation to the IZFC memory, RZF memory, and CSP reply.

**Honest:** The trigger surfaces the obligation. It does not enumerate the surfaces to update. The AI must
still do that sweep.

### APP-001 freshness re-ratify (governance mandate — NOT automated)

APP-001 (Voice Sorting app) was built before S076-S078 foundation changes. The HANDOFF documents it as
"needs freshness re-ratify before fork" — meaning: before APP-001 is extended, a Governor-level review
confirms whether its assumptions still hold under the current foundation.

**This is a governance mandate, not an automated check.** There is no validator that detects "APP-001 was
last ratified before principle X was added." The freshness obligation is documented in the HANDOFF (Zone B)
and requires deliberate Governor review.

### validate-boundary-prompt-format.mjs (HANDOFF format compliance)

`validate-boundary-prompt-format.mjs` ✅ checks that HANDOFF files and boundary prompts have correct
structural headers, FROM/TO fields, and attestation blocks.

Current status: `entries_checked=58 missing_headers=3 missing_attestation=43 advisory=48 blocking=0`

**Honest:** 43 of 58 HANDOFF files are missing attestation sections. This validator is ADVISORY — it surfaces
the drift but does not block commits on non-compliant HANDOFFs. The drift is real and accumulated.

### gap_SESSION_INJECTION_COMPRESSION (K=2, open)

In long sessions (40+ turns), the session-open injection content can be compressed away from the AI's active
context window. Specifically: governance rules, spine classifications, and handoff constraints that were
injected at turn 1 may be absent at turn 50.

**This is a real inheritance failure mode we hit.** (K=2: observed at S051 and S053.)

Mitigations:
- Keep individual sessions short (chat boundaries at context budget)
- Ensure T1/T2 mechanical enforcement does not depend on AI *remembering* an injected rule
- Design around context-compression by making critical constraints T1 (pre-tool-use blocking) not T3 (session injection)

**Status:** open, K=2, no behavioral test, no structural fix committed. The only current mitigation is
session length discipline. A full solution (re-injection trigger at turn N, behavioral test for surviving
context pressure) is designed, not built.

---

## 5. What We'd Do Differently: Honest Lessons

### Lesson 1: Session injection is not inheritance

The T3 injection approach (session-open.sh, CONCEPT_LOAD, inner-ai-defaults) is powerful in well-loaded
sessions. It is fragile under context compression. The real inheritance guarantee requires T1 mechanical
enforcement — hooks that fire *regardless of what the AI remembers*.

CSPS's current state: more inheritance is T3 (injection) than T1 (gate). A distracted AI, a long session,
or a model context compression event can bypass T3. The designed-but-not-built tier is T1 gates for critical
inheritance (e.g., "before creating any new MD, T1 hook fires to inject current CONCEPT_LOAD spine and assert
frontmatter enums").

### Lesson 2: Advisory validators describe; they do not inherit

`validate-new-file-dna.mjs` runs on every verify. It finds 0 files currently. When it finds files, the
result is advisory. This means a newly created file without DNA markers will pass every verify until someone
manually promotes the validator to blocking. The gap between "advisory validates" and "inheritance enforced"
is wider than it looks.

The lesson: when you say "ratified principles are inherited by new artifacts," check *what mechanically ensures
that*. If the answer is "the AI reads the injection and classifies correctly," that is discipline, not
enforcement. Discipline at 80% compliance; enforcement at 99%.

### Lesson 3: Manual relay friction compounds with inheritance debt

Every Opus→Governor→Sonnet relay is a potential inheritance break. The Governor copies the PROTO to Sonnet
exactly — but under compression, under time pressure, or when the PROTO is long, information can be lost
in the relay. The imp_RELAY_FRICTION_REDUCTION entry in the improvement register captures this.

CSPS built relay automation hooks (`post-tool-use-sonnet-relay-inline.sh`, `post-tool-use-handoff-relay-inline.sh`)
to surface paste-ready blocks for the Governor. This reduces the relay burden but doesn't eliminate it.

### Lesson 4: Attestation format enforcement is advisory (48 of 58 HANDOFFs drift)

The §17 attestation discipline is strong in recent sessions (S073+) and weak in older ones. But even with
the validator active, it is advisory — HANDOFFs without attestation pass verify. The pattern: governance
forms that require human authorship and are not mechanically required will drift backward.

**If we could rebuild:** make §17 attestation blocking — if the HANDOFF lacks the §17 block, `pre-commit`
refuses the commit. We haven't done this because it would retroactively break commits for the 43 older files.
The lesson: add mechanical enforcement early, before the corpus of compliant files exceeds the cost of
retroactive fixes.

---

## Summary: The Honest Inheritance Stack

| Layer | What it carries | Status |
|-------|---------------|--------|
| HANDOFF (Zone A/B/C/D + §17) | State + pivot + chain + schedule | ✅ BUILT |
| §17 receipt handshake | Identity anchor | ✅ BUILT |
| cross-tab-diff-review.mjs | Commit absorption at tab start | ✅ BUILT |
| session-state.json | Mandate bridge | ✅ BUILT (stale session label) |
| CONCEPT_LOAD per-prompt injection | Spine classification | ✅ BUILT (T3, not T1 gate) |
| cec-trigger on principle edits | Propagation reminders | ✅ BUILT (reminder, not auto-propagation) |
| inner-ai-defaults D1-D13 registry | Training default overrides | ✅ BUILT (injection; no auto-enforcement) |
| validate-new-file-dna.mjs | DNA on new files | ✅ BUILT (advisory, blocking=0) |
| pre-tool-use-frontmatter-enum-check.sh | Frontmatter enum integrity | ⚠️ STUB |
| APP-001 freshness re-ratify | Stale-app governance | ⚠️ GOVERNANCE MANDATE (not automated) |
| validate-boundary-prompt-format.mjs | HANDOFF format compliance | ✅ BUILT (advisory, 43 of 58 drift) |
| gap_SESSION_INJECTION_COMPRESSION fix | Injection survival under compression | ❌ DESIGNED (K=2, open) |
| T1 gate for spine/DNA on every Write (BLOCKING) | True blocking inheritance | ⚠️ ADVISORY ONLY (`pre-tool-use-corespine-check.sh` exists but exit 0 always) |

---

## Entity Verification (imp_OUTWARD_DOC_PRESEND_GATE compliance)

| Claim | Verification | Result |
|-------|-------------|--------|
| `HANDOFF-S078-to-S079.md` exists | `ls docs/plan/_handoff/HANDOFF-S078-to-S079.md` | ✅ |
| Zone A/B/C/D in HANDOFF | `grep "ZONE A\|ZONE B\|ZONE C\|ZONE D" HANDOFF-S078-to-S079.md` | ✅ lines 22/51/71/86 |
| `tools/session-state.json` exists | `ls tools/session-state.json` | ✅ |
| `current_session: "S077"` (stale) | `grep "current_session" tools/session-state.json` | ✅ confirmed S077 |
| `cross-tab-diff-review.mjs` exists | `ls tools/scripts/cross-tab-diff-review.mjs` | ✅ |
| `inner-ai-defaults/` 43 files (14 D-numbered) | `ls docs/plan/_handoff/VAULT/inner-ai-defaults/ \| wc -l` | ✅ 43 files |
| `validate-new-file-dna.mjs` advisory | `node tools/validators/validate-new-file-dna.mjs` | blocking=0 ✅ |
| `pre-tool-use-frontmatter-enum-check.sh` STUB | `grep "lifecycle-state" .claude/hooks/pre-tool-use-frontmatter-enum-check.sh` | stub ✅ |
| `post-tool-use-cec-trigger.sh` exists | `ls .claude/hooks/post-tool-use-cec-trigger.sh` | ✅ |
| `gap_SESSION_INJECTION_COMPRESSION` K=2 open | `grep "gap_SESSION_INJECTION_COMPRESSION" tools/data/gap-recurrence-register.yaml` | K=2, open ✅ |
| `validate-boundary-prompt-format.mjs` advisory 48 | `node tools/validators/validate-boundary-prompt-format.mjs` | advisory=48 blocking=0 ✅ |
| CONCEPT_LOAD in user-prompt-submit hook | `grep "CONCEPT_LOAD" .claude/hooks/user-prompt-submit-next-step-reminder.sh` | ✅ line 5 |
| APP-001 freshness mandate in HANDOFF | `grep "APP-001\|freshness" docs/plan/_handoff/HANDOFF-S078-to-S079.md` | ✅ "needs freshness re-ratify" |
| `post-tool-use-sonnet-relay-inline.sh` exists | `ls .claude/hooks/post-tool-use-sonnet-relay-inline.sh` | ✅ |
| `user-prompt-submit-intake.sh` exists (session-state surface) | `ls .claude/hooks/user-prompt-submit-intake.sh` | ✅ |
| `post-tool-use-handoff-relay-inline.sh` exists | `ls .claude/hooks/post-tool-use-handoff-relay-inline.sh` | ✅ |
| `user-prompt-submit-next-step-reminder.sh` exists (CONCEPT_LOAD host) | `ls .claude/hooks/user-prompt-submit-next-step-reminder.sh` | ✅ |
| `pre-tool-use-corespine-check.sh` exists (advisory, exit 0 always) | `head -8 .claude/hooks/pre-tool-use-corespine-check.sh` | ✅ advisory |

---

*CSPS Sonnet S079 | PROTO-S079-INHERITANCE-MD | Opus-18 directed | 2026-06-03*
*Governing lens: P-META-034 (Reality-Tested Completion) + P-META-032 (Demonstrated Truth) + imp_OUTWARD_DOC_PRESEND_GATE (active)*
