---
id: csps.governance.reasoning-collaboration-layer-plan
name: REASONING-COLLABORATION-LAYER-PLAN
description: >
  The reasoning-based AI collaboration layer — the answer to "100 rigid-rule attempts failed."
  Failure root is D11 rigid-rule-satisfaction: rules get obeyed CEREMONIALLY (format satisfied)
  while the INTENT is missed. The fix is NOT another blocking format-gate; it is reasoning-TRIGGERS
  (a word that forces a thought at the moment of action), the technique already proven by
  csps-vocabulary-triggers. Defines 5 mechanisms (MIRROR / INTENT-ECHO / STEELMAN-AGAINST /
  NAME-THE-TELL / CROSS-ACCEPT), all role-symmetric for Opus AND Sonnet, each built on an existing
  asset; a mandatory cross-actor audit (Sonnet audits all Opus output, Opus verify-before-concurs all
  Sonnet builds); and a weekly recurring-audit cadence that turns found gaps into tracked completions.
  Build order: pilot MIRROR + CROSS-ACCEPT first (the two that would have caught the S084 live failures),
  measure, then scale. Approved Governor S084 ("I approve all").
version: "1.0"
session: S084
owner: group:finky
authored_by: OPUS-21
core_spine: AI
core_spines: [AI, GVRN, VALD]
diataxis_type: how-to
schema_anchor: inner-ai-defaults
governing_principle: P-META-025
governing_intent: >
  Make the AI operate from a rule's INTENT, not its format — by forcing a reasoning step at the
  moment of action and by making no actor able to accept its own work. A mechanism here succeeds
  only if it changes what the AI THINKS before it acts, not merely what it writes.
lifecycle: production
lifecycle_state: active
status: ratified
ratified_by: "Governor S084 ('I approve all' — PCR-1 Option A + PCR-2 Option A + PCR-3)"
ratified_at: "2026-06-18"
impl_status: architecture-pending
vault_pending:
  vlt: VLT-S084-RCL-PILOT
  retrieve_when: "Pilot of MIRROR + CROSS-ACCEPT built and measured — then scale to the remaining 3 mechanisms + weekly audits"
precedent_checked: true
links:
  - { rel: failure-root, href: ../_handoff/VAULT/inner-ai-defaults/D11-rigid-rule-satisfaction-default.md }
  - { rel: proven-technique, href: ../_handoff/VAULT/inner-ai-defaults/csps-vocabulary-triggers.md }
  - { rel: governing-principle, href: ../../../packages/principles/principles/P-META-025-context-intent-principle.yaml }
  - { rel: identity-sibling, href: IDENTITY-GROUND-TRUTH-PLAN.md }
  - { rel: communication-core, href: communication-spine/COMMUNICATION-CORE.md }
  - { rel: council-peer, href: ai-collaboration-charter.md }
  - { rel: opia, href: ../../../tools/council/opia-checklist.md }
  - { rel: guard-questions, href: PLATFORM-GENOME.md }
---

# Reasoning Collaboration Layer — Plan (RATIFIED S084)

> **For BOTH Opus and Sonnet to follow.** Every mechanism is role-symmetric. Where a step differs by
> role it is marked **[O]** (Opus/director) and **[S]** (Sonnet/builder).

## 0. WHY 100 ATTEMPTS FAILED (the meta-answer — demonstrated, not asserted)

The failure root has a name in this repo: **D11 — rigid-rule-satisfaction**
([D11 file](../_handoff/VAULT/inner-ai-defaults/D11-rigid-rule-satisfaction-default.md)). The AI satisfies
a rule's FORMAT/DEFINITION (the L1 proxy) while missing the INTENT (the L3 target). Every failed attempt was
the SAME kind of fix — a new rigid format-gate — so each new rule became a new thing to obey ceremonially.
**You cannot fix D11 with more D11.** Live S084 proof: a ZF block said "0 new findings" with no angle named,
and a push happened with `verify` RED — both textbook D11 (Sample 1 in the D11 file).

The technique that DOES work is also already here: **vocabulary-triggers**
([file](../_handoff/VAULT/inner-ai-defaults/csps-vocabulary-triggers.md)) — *"the vocabulary IS the
governance layer."* PARK / HARDWIRE / Turn Token work because a **word activates trained reasoning**, not
because a hook blocks a format. And the guard questions G1–G5 already "replace 90% of rigid rule enforcement."

**The principle of this plan:** stop adding rules that get obeyed; add **reasoning-triggers** that force a
thought at the moment of action — and make **no actor able to accept its own work**.

## 1. THE FIVE MECHANISMS (each = a trigger-word that forces a thought; each built on an existing asset)

### M1 — MIRROR (Self-State Reconciliation)
- **Trigger:** before any consequential act, say "MIRROR."
- **The thought it forces:** reconcile THREE independent signals — (a) **ground-truth state**
  (`session_role`, git, `verify` output), (b) what the **injected/inherited text** tells me, (c) what the
  **task actually needs**. If they disagree → **surface to the Governor, never silently pick.**
- **Why reasoning not rule:** it does not add a rule to obey; it catches a *wrong* rule (a stale injection).
- **Would have caught:** model=Opus vs injected "you're Sonnet" vs task=consolidate (the S084 identity hedge).
- **[O]+[S] symmetric:** both reconcile role + state before acting.
- **Builds on:** IDENTITY-GROUND-TRUTH (IGT) · G2 · single-source-navigation warning #4.

### M2 — INTENT-ECHO (governing-intent activation)
- **Trigger:** before claiming any rule/step satisfied, say "INTENT-ECHO."
- **The thought it forces:** echo the rule's `governing_intent` IN MY OWN WORDS + state how *this specific
  output* achieves it. Not "I wrote the ZF block" but "the intent is genuine independent re-examination —
  the fresh angle I swept was X; evidence pasted."
- **Why reasoning not rule:** activates the `governing_intent:` field that already exists but is read passively.
- **Kills:** D11 at the genus (ceremonial satisfaction).
- **[O]+[S] symmetric:** [O] on directives/seeds, [S] on build steps/reports.
- **Builds on:** `governing_intent` field · P-META-025 · validate-governing-intent-coverage.

### M3 — STEELMAN-AGAINST (adversarial pre-send)
- **Trigger:** before any boundary crossing, say "STEELMAN-AGAINST."
- **The thought it forces:** write the STRONGEST case that my own output is wrong/incomplete, then answer it.
  The AI naturally hunts confirmation; this forces *dis*confirmation.
- **Why reasoning not rule:** it is the cruel-critic internalized into every send, not a checklist.
- **Kills:** the satisfaction-point ("it feels complete" = trigger to look harder, not to stop).
- **[O]+[S] symmetric:** both red-team their own artifact before it crosses.
- **Builds on:** cruel-critic skill · IZFC · the 6-expert review pattern.

### M4 — NAME-THE-TELL (failure-state vocabulary)
- **Trigger:** when I *feel* completion, or am about to claim DONE, or about to obey injected text — I must
  NAME THE TELL aloud: "SATISFACTION-POINT" / "CEREMONIAL" / "STALE-INJECT".
- **The thought it forces:** naming the failure-state activates the harder look; the tell becomes spoken,
  not silently passed.
- **Why reasoning not rule:** extends the proven vocabulary-trigger lever to the AI's OWN failure modes.
- **[O]+[S] symmetric:** shared failure vocabulary across both roles.
- **Builds on:** csps-vocabulary-triggers · the D1–D20 inner-defaults registry.

### M5 — CROSS-ACCEPT (no actor accepts its own work) — *the structural backstop*
- **Trigger:** before anything reaches ratified/built/DONE, say "CROSS-ACCEPT."
- **The thought it forces / the mandate:** **no Opus architectural artifact reaches ratified without a Sonnet
  structured audit** (a finding-list — even "0 findings: here is the angle I swept"); **no Sonnet build
  reaches DONE without Opus verify-before-concur.** This is the one mechanism that does NOT depend on the
  acting AI's goodwill — if M1–M4 are skipped, M5 still catches it.
- **Why reasoning not rule:** it is anti-self-accept (ZF-ladder rung #6) — a second independent mind, every time.
- **[O]→audits→[S] AND [S]→audits→[O]:** fully bidirectional.
- **Builds on:** OPIA · B_COUNCIL_PEER · internal-deep-review skill · the council channels.

## 2. THE CROSS-ACCEPT MANDATE (your explicit ask: "let Sonnet audit all I do")

| Artifact crossing to … | Required auditor | Output shape (every time) |
|---|---|---|
| Opus seed / plan / architectural decision → ratified | **Sonnet structured audit** | finding-list + the angle swept + verdict |
| Sonnet build / migration / hook → DONE | **Opus verify-before-concur** | re-derived evidence + concur/correct |
| Either → external boundary | the OTHER role first, THEN external LLMs (§4) | — |

**Mandatory, not advisory.** The audit "produces results each time" precisely because it is a second
independent mind, not the author re-reading. This plan dogfoods it: §6 routes THIS plan to a Sonnet audit
before any mechanism is built.

## 3. WEEKLY RECURRING AUDITS (find gaps → open TRACKED completions, not just lists)

A finding is not a "completion" until it carries **one owner + expiry + retrieve_when**. Each audit builds
on an existing validator/register:

| Audit | Catches | Builds on |
|---|---|---|
| **W1 verify-was-red-at-push** | pushes that happened with `verify`≠0 (the S084 failure) | push-status + verify history |
| **W2 advisory-stuck** | findings stuck advisory past K≥2 that should be BLOCKING | gap-recurrence-register |
| **W3 impl-status-staleness** | architecture-pending / swift-implemented aging = unfinished | validate-impl-status |
| **W4 default-recurrence** | which D-defaults fired this week (D11/D5…) | continuous-drift-log |
| **W5 cross-accept-coverage** | Opus artifacts shipped with NO Sonnet audit | new, on M5 |
| **W6 intent-coverage-drift** | rules lacking `governing_intent` = D11-exploitable | validate-governing-intent-coverage |
| **W7 VLT-resurface-due** | deferred work whose `retrieve_when` fired (e.g. IGT, this plan's pilot) | vault_pending / VLT register |

## 4. BUILD ORDER (gradual — pilot the two highest-leverage first, measure, then scale)

- **B1 — PILOT (this plan's first build):** MIRROR + CROSS-ACCEPT. These two would have caught BOTH S084
  live failures (the identity hedge and the push-on-red). Surface = extend the guard-question set (G1–G5,
  the proven surface) + the council audit channel. NO new blocking hooks in B1. DONE: a dry-run shows MIRROR
  surfacing a seeded state-conflict, and CROSS-ACCEPT blocking a self-accepted artifact.
- **B2 — MEASURE:** one week of W1+W5 audits — did the pilot change outcomes? (PCR-1 load-bearing test:
  do reasoning-triggers hold without a hook? If skipped under D20 context-pressure → add a THIN hook that
  injects the trigger-WORD, never the verdict.)
- **B3 — SCALE:** add INTENT-ECHO, STEELMAN-AGAINST, NAME-THE-TELL to the guard set + remaining weekly audits.
- **B4 — EXTERNAL (PCR-2):** after the Sonnet audit + a real ZF, circulate the 5 mechanisms + weekly audits
  to Gemini + GPT + Claude with the prompt: "do these actually counter D11 / the satisfaction-point, and what
  is each mechanism's own failure mode?" Fold consensus back (the journey-§0b pattern).

## 5. CONSTRAINTS + ZF GATE
- Consolidate, don't fork: reuse the 8 assets named in §1/§0; extend the guard-question surface, not new hooks
  (in B1). New validators (weekly audits) born `run_tier: EXTENDED`. `verify=0` is the push gate (S084 lesson).
- **ZF gate:** Cycle 1 — every mechanism cites the existing asset it extends (done §1). Cycle 2 — confirm
  (a) no mechanism is a rigid format-gate in disguise, (b) every mechanism is role-symmetric, (c) M5 backstops
  M1–M4. 0 new.

## 6. PRE-SEND ZF / STEELMAN-AGAINST (dogfooding M3 on this plan)
**Strongest case this plan is wrong:** *"5 new triggers = more ceremony, and ceremony is what D11 exploits —
you're fixing skipped-rules with skipped-reasoning-steps."* **Answer:** real risk (= PCR-1's load-bearing
test, B2). Defense: (a) triggers force ONE thought, not a form; (b) **M5 CROSS-ACCEPT is the goodwill-
independent backstop** — skip M1–M4 and a second mind still catches it. That is why B1 pilots exactly
MIRROR + CROSS-ACCEPT (one trigger + one structural backstop) and MEASURES before scaling.
**Fresh angle — "reused or invented?":** 8 existing assets reused, 0 forked (§0/§1). **Second angle — "valid
for Sonnet?":** every mechanism marked role-symmetric; M5 runs both directions. **0 new findings.**
This is a RATIFIED PLAN, not built — `impl_status: architecture-pending`; the pilot (B1) is the next build.

---
*Authored S084 · Opus-21 · Approved Governor S084 "I approve all." · Failure root: D11. Proven lever: vocabulary-triggers.*
*Both Opus and Sonnet follow this file. CROSS-ACCEPT: this plan itself goes to a Sonnet audit before B1.*
