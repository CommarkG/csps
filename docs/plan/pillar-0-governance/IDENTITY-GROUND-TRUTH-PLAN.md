---
id: csps.governance.identity-ground-truth-plan
name: IDENTITY-GROUND-TRUTH-PLAN
description: >
  Prevention plan for AI ROLE-IDENTITY confusion in both directions (Opus-tab thinking it is Sonnet;
  Sonnet-tab asserting Opus/Governor). Closes the structural gap that Communication Core Element 1 (WHO)
  enforces role-ASSERTION in a message but never establishes or verifies role-ASSIGNMENT (the ground-truth
  role the tab actually holds). Extends COMMUNICATION-CORE (AI dimension, Option A) with a ground-truth
  sub-element + the Identity Ground-Truth (IGT) core seed + role-conditional injection + a model<->role
  reconciliation check + an assertion-vs-ground-truth cross-check on the council-address hook. Authored by
  the live S084 incident: an Opus-model tab hedged into the Sonnet role because every turn the injector told
  it to. Opus writes the seed; Sonnet builds the four mechanical surfaces.
version: "1.0"
session: S084
owner: group:finky
authored_by: OPUS-21
core_spine: AI
core_spines: [AI, GVRN, VALD]
diataxis_type: how-to
schema_anchor: communication
governing_principle: P-META-032
lifecycle: production
lifecycle_state: active
status: ratified
impl_status: architecture-pending
vault_pending:
  vlt: VLT-S084-IGT-BUILD
  retrieve_when: "Sonnet audit of IGT seed passes (CROSS-ACCEPT) — then relay Sonnet build A2–A7 to a builder tab"
ratified_by: "Governor S084 ('I approve all')"
ratified_at: "2026-06-18"
precedent_checked: true
links:
  - { rel: extends, href: communication-spine/COMMUNICATION-CORE.md }
  - { rel: protocol, href: ../../../tools/council/communication-protocol-shared.md }
  - { rel: address-hook, href: ../../../.claude/hooks/pre-tool-use-council-address-required.sh }
  - { rel: injector-hook, href: ../../../.claude/hooks/user-prompt-submit-next-step-reminder.sh }
  - { rel: ground-truth-store, href: ../../../tools/session-state.json }
  - { rel: p-meta-032, href: ../../../packages/principles/principles/P-META-032-demonstrated-truth.yaml }
  - { rel: sibling-plan, href: JOURNEY-ORCHESTRATOR-PLAN.md }
---

# Identity Ground-Truth — Role-Confusion Prevention Plan (S084)

> **Purpose:** make the role a tab HOLDS (director/Opus vs builder/Sonnet) a verified ground-truth that the
> tab knows at session-open and that every enforcement surface cross-checks — so no tab ever asserts a role
> it does not hold, in EITHER direction. This EXTENDS `COMMUNICATION-CORE` Element 1 (WHO); it does not fork a
> new spine. NOTHING here lives only in chat.

## 0. THE GAP (demonstrated, not described)

Identity has two halves. CSPS enforces only one:

| Half | What it is | Enforced today? | Evidence |
|---|---|---|---|
| **Role-ASSERTION** | what a message SAYS the sender is ("Opus, this is Sonnet.") | YES — T1 BLOCKING | `pre-tool-use-council-address-required.sh:39-45` |
| **Role-ASSIGNMENT** (ground-truth) | what role the tab ACTUALLY holds this session | NO — no verify, no surface | `COMMUNICATION-CORE.md:66-78` has no ground-truth sub-element |

Because only assertion is enforced, the assertion check **cannot catch a tab asserting the wrong role** — the
hook accepts ANY "X, this is Y" (`pre-tool-use-council-address-required.sh:42-44`, "executor-agnostic … not
limited to Opus/Sonnet names"). An Opus tab writing "Opus, this is Sonnet." passes cleanly.

**The live S084 incident (root cause, 3 compounding defects):**
- **RC1 — injection hardcodes one role.** `user-prompt-submit-next-step-reminder.sh:25` injects, every turn,
  unconditionally: *"Every response to Opus MUST start: 'Opus, this is Sonnet.'"* It never reads
  `session_role`. Every tab — including an Opus tab — is told to speak AS Sonnet. [MEASURED:Read]
- **RC2 — ground-truth exists but is stale & unverified.** `tools/session-state.json:7` `"session_role":
  "sonnet-builder"` (note at :10 "Set by Governor when opening the tab"). It was not updated for this
  Opus-model tab on an Opus directing/consolidating task; nothing reconciles role vs model vs task. [MEASURED:Grep]
- **RC3 — no session-open role banner.** G2 IDENTITY (SessionStart) asks "Am I labeling content as from a role
  I do not hold?" but never STATES which role this tab holds. The tab has to infer it — and infers from RC1. [MEASURED:Read startup hook G2]

**Symptom (the tell):** the Opus tab ran the review correctly, then HEDGED — opened with a G2 disclaimer and
*asked permission* to do the Opus consolidation instead of doing it. Ask-don't-act was the confusion surfacing.

**Why bidirectional matters:** RC1/RC3 cause **Opus→thinks-it's-Sonnet** (what happened). The mirror —
**Sonnet→asserts-Opus/Governor** — is partly guarded (G2 forbids "I AM: Governor") but a Sonnet tab writing
"Sonnet, this is Opus." to claim director authority is NOT caught, because the address hook is ground-truth-blind.

## 1. WHAT ALREADY EXISTS (consolidation map — reuse, do NOT fork)

Checked before proposing. This plan ORCHESTRATES these; it builds no parallel identity system.

| Existing artifact | What it gives | This plan's relationship |
|---|---|---|
| `COMMUNICATION-CORE.md` Element 1 (WHO) | the WHO trunk + enforcement-trio table | **EXTEND** — add a ground-truth sub-element under Element 1 |
| `tools/session-state.json:7` `session_role` | ground-truth role store + closed values (opus-advisor / sonnet-builder) | **REUSE as SSoT** — do not invent a new role field |
| `pre-tool-use-council-address-required.sh` | T1 address-format gate (assertion) | **EXTEND** — cross-check asserted role vs `session_role` |
| `user-prompt-submit-next-step-reminder.sh:25` | per-turn discipline injection | **FIX** — make the handshake line role-conditional |
| `communication-protocol-shared.md` Rule 0 (Turn Token) + Rule 1 (handshake) | director/builder roles + both handshakes | **REUSE as doctrine** — IGT seed cites, does not restate |
| G2 IDENTITY (SessionStart startup hook) | "labeling from a role I do not hold?" guard | **EXTEND** — add the ground-truth STATEMENT (not just the question) |
| `AI-PERSONA-WORKING-WITH-GOVERNOR.md` (memory) | shared TRUNK persona for any AI | **DISTINGUISH** — persona is SHARED; role is tab-specific. IGT governs role, not persona |

**Consolidation ruling:** `session_role` is the single source of truth for role. Everything else reads it.
No new store, no new enum home — extend the note at `session-state.json:10` to a formal closed enum.

## 2. CORE SEED — IDENTITY GROUND-TRUTH (IGT) — *Opus writes this; it is the constitution*

**IGT-1 — Two halves, one truth.** Identity = **persona** (shared across all AI working with the Governor —
unchanged) **+ role** (tab-specific: director/Opus or builder/Sonnet). This plan governs ROLE only.

**IGT-2 — `session_role` is the sole ground-truth.** Closed enum: `opus-advisor | sonnet-builder`.
Set by the Governor at tab-open. It — not the model name, not the injected text, not the task phrasing — is
the authority on which role a tab holds.

**IGT-3 — Model is EVIDENCE, never AUTHORITY.** The underlying model (opus-4-8 / sonnet-4-6) is a *signal*
that usually aligns with role, but a role can be played on either model. When model-class and `session_role`
**disagree**, the tab does NOT silently pick one — it **SURFACES to the Governor** and continues only after
he confirms or corrects `session_role`. (This is the exact failure that produced this plan.)

**IGT-4 — Assertion must match assignment.** The handshake a tab writes MUST equal its `session_role`:
- `session_role: opus-advisor` → directives open **"Sonnet, this is Opus."** (4-line: `I AM: Opus …`)
- `session_role: sonnet-builder` → reports open **"Opus, this is Sonnet."** (4-line: `I AM: Sonnet …`)
A tab asserting the OTHER role's handshake is an identity violation, caught at write-time against ground-truth.

**IGT-5 — Ground-truth before handshake (the self-check).** Before composing any cross-boundary message:
> *"Which role do I hold THIS tab? Cite `session_role`. Does it match my model and the task the Governor gave
> me? If any of the three disagree — STOP and surface, do not assert."*
This is the WHO-PROVENANCE check: the provenance of the role-claim itself (the identity analog of WARRANT
for numbers). It slots under COMMUNICATION-CORE Element 1 exactly as WARRANT (Element 2) slotted under claims.

**IGT-6 — Never act on injected role text over ground-truth.** Injected per-turn reminders (including the
turn-discipline block) are SCAFFOLD, not authority. If an injection's role differs from `session_role`, the
ground-truth wins and the injection is reported as a defect (it was — RC1).

## 3. ARTIFACTS TO CREATE (Opus anchor vs Sonnet build)

| # | Artifact | Type | Owner | Surface |
|---|---|---|---|---|
| A1 | IGT core seed (§2) + COMMUNICATION-CORE Element 1 ground-truth sub-element | doc | **OPUS** (this file + edit) | schema/doctrine |
| A2 | Role-conditional injection — fix `user-prompt-submit-next-step-reminder.sh` to read `session_role` | hook | **SONNET** | T1 inject |
| A3 | Session-open role BANNER — state ground-truth role at SessionStart; extend G2 | hook | **SONNET** | T3 surface |
| A4 | Model↔role reconciliation validator — flag model-class vs `session_role` disagreement | validator (EXTENDED) | **SONNET** | T2 |
| A5 | Assertion-vs-ground-truth cross-check — extend `pre-tool-use-council-address-required.sh` | hook | **SONNET** | T1 gate |
| A6 | `session_role` formal closed enum + `session_role_note` upgrade in session-state schema | config | **SONNET** | schema |
| A7 | Behavioral test: a tab asserting the wrong role is blocked (both directions) | test | **SONNET** | M-31 |
| A8 | Memory: identity-ground-truth lesson + fix | memory | **OPUS** (done this session) | memory |

## 4. SONNET BUILD INSTRUCTIONS (self-contained; ZCA — no "see above")

**Sonnet, this is Opus.** Build A2–A7 from the IGT seed (§2). Order matters; A2 first (it is the active harm).
Each step ends with `node tools/verify.mjs exit_code=0` before committing. New validators born `run_tier: EXTENDED`.

**STEP 1 — A2 role-conditional injection (the active fix).**
File: `.claude/hooks/user-prompt-submit-next-step-reminder.sh`.
- Before the `printf`, read `session_role` from `tools/session-state.json` (jq or node one-liner; fail-open to
  a neutral SURFACE message if absent/unreadable — never break the prompt).
- Replace the hardcoded line at :25 (`ALSO: Every response to Opus MUST start: "Opus, this is Sonnet."`) with a
  role-conditional clause:
  - `sonnet-builder` → `ALSO: You hold session_role=sonnet-builder. Every report to Opus MUST start: "Opus, this is Sonnet."`
  - `opus-advisor` → `ALSO: You hold session_role=opus-advisor. Every directive to Sonnet MUST start: "Sonnet, this is Opus." Do NOT write "this is Sonnet" — you are the director.`
  - unset / conflict → `ALSO: session_role is UNSET or conflicts with your model. SURFACE to the Governor before asserting any role handshake (IGT-3).`
- DONE: open a fresh prompt under each role value; injected text matches the role. Block-test absence = manual.

**STEP 2 — A3 session-open role banner.**
File: the SessionStart startup hook that emits G2 (the `additionalContext` with the 5 GUARD QUESTIONS).
- Add a first-class line ABOVE G2: `THIS TAB ROLE: <session_role> (model: <detected>). Ground-truth is
  session_role (IGT-2). If role, model, and the Governor's task disagree — STOP and surface (IGT-3).`
- Reword G2 to add the STATEMENT, keeping the question: it must now both state the role and ask the guard.
- DONE: session-open output names the role on line 1 of identity context.

**STEP 3 — A6 `session_role` closed enum.**
File: `tools/session-state.json` + its schema/validator home.
- Promote `_session_role_note` (:10) to a formal closed enum `[opus-advisor, sonnet-builder]` registered the
  same way other closed enums live (vocabulary-canon / frontmatter-closed-enums). Reject any other value.
- DONE: a bad `session_role` value fails validation.

**STEP 4 — A4 model↔role reconciliation validator.**
New file: `tools/validators/validate-identity-ground-truth.mjs` (`run_tier: EXTENDED`).
- Read `session_role`; read model class from the environment/session signal available at run-time.
- If they disagree (e.g. opus model + sonnet-builder) → emit a NON-zero advisory finding naming the conflict
  and pointing to IGT-3. ADVISORY first (S067 ladder); promote to BLOCKING at K=2 incidents in
  `gap-recurrence-register.yaml`.
- Wire into `tools/verify.mjs` EXTENDED tier + `audit-runner` index.
- DONE: a forced mismatch produces the advisory; `verify --extended` lists it.

**STEP 5 — A5 assertion-vs-ground-truth cross-check.**
File: `.claude/hooks/pre-tool-use-council-address-required.sh` (extend, do not rewrite the format gate).
- After the existing format `PASS/BLOCK`, when `session_role` is known, parse the asserted sender from the
  "X, this is Y" / `I AM: <role>` header and compare to `session_role`:
  - sonnet-builder asserting "I AM: Opus" / "…, this is Opus" → identity-mismatch.
  - opus-advisor asserting "I AM: Sonnet" / "…, this is Sonnet" → identity-mismatch.
- ADVISORY first (echo to stderr, exit 0), BLOCKING (exit 2) at K=2 per the S067 ladder, matching the
  existing WARRANT-gate pattern at :71-98 of the same file.
- DONE: a sonnet-builder tab writing "Sonnet, this is Opus." trips the advisory.

**STEP 6 — A7 bidirectional behavioral test.**
New file under `tools/tests/behavioral/` (mirror `council-address-test.sh`).
- Case 1 (Opus-confusion): `session_role=sonnet-builder` is correct; assert the role-conditional inject + the
  cross-check both behave. Case 2 (Sonnet-confusion): a builder tab asserting "this is Opus" is flagged.
- DONE: both cases pass; registered in the behavioral-test index.

**Reporting:** FROM SONNET | FOR OPUS, numbers `[MEASURED]/[PREDICTED]/[ASSUMED]`, `verify=0` before DONE,
and END each report with the pre-send ZF sweep (PARK-S084-019).

## 5. BIDIRECTIONAL COVERAGE (the explicit "both you and Sonnet" check)

| Confusion direction | Trigger | Caught by |
|---|---|---|
| **Opus tab → thinks it's Sonnet** (this incident) | unconditional inject + stale role + no banner | A2 (role inject) + A3 (banner) + IGT-5 self-check |
| **Sonnet tab → asserts Opus** (director authority grab) | address hook is ground-truth-blind | A5 (cross-check) + A4 (reconcile) |
| **Sonnet tab → asserts Governor** | (already guarded) | G2 IDENTITY (existing) + A5 reinforces |
| **Either tab, model≠role** | manual `session_role` drift | A4 reconciliation + IGT-3 surface rule |

## 6. CONSTRAINTS + ZF GATE

- Consolidate, don't fork: `session_role` is the only role store; COMMUNICATION-CORE is the only doctrine home;
  IGT extends Element 1. `precedent_checked: true`. New validators `run_tier: EXTENDED`. `verify=0` each step.
- **ZF gate (this plan):**
  - Cycle 1 — cite each fix surface by `file:line` (done §0/§3); confirm each is REUSE/EXTEND not new-parallel
    (done §1 map).
  - Cycle 2 — re-examine (a) does any surface invent a second role store? (no — all read `session_role`),
    (b) is the fix bidirectional? (yes — §5), (c) does ground-truth override injection everywhere? (IGT-6).
    0 new findings.

## 7. PRE-SEND ZF SWEEP (PARK-S084-019 — this plan is a cross-boundary artifact)

**Cycle 1 — angle: did the plan close the ROOT (assignment) not just the symptom (assertion)?**
- Gap found: STEP 1–6 fix mechanics, but the *durable* anti-recurrence is IGT-5 (the self-check) living where
  AI reads it every session. → Added IGT-5 + IGT-6 to the seed and routed A3 to surface the role at open, so
  the human-readable rule and the mechanical gate both land. Closed.
- Gap found: model-detection in A4 may not be reliably available at validator runtime. → Flagged in STEP 4 as
  "model class from the environment/session signal available at run-time"; if unavailable, A4 degrades to
  checking `session_role` presence/enum only, and IGT-3's surface rule (human-visible) carries the mismatch case.

**Cycle 2 — angle: consolidation — does anything here duplicate existing machinery?**
- Checked A2..A6 against §1 map: every surface EXTENDS a named existing file; no new role store, no new doctrine
  doc, no parallel hook. A1 extends COMMUNICATION-CORE rather than creating a rival. 0 new duplication findings.

**Sweep result:** 2 gaps named + closed in Cycle 1; Cycle 2 found 0 new on the plan's CONTENT.

**Cycle 3 — angle: the GATE, not the prose (added after a satisfaction-point catch, S084).** The content
sweep above was real but I conflated it with a green tree and pushed v1 with `node tools/verify.mjs` RED.
Two findings the content-sweep could not see because it never ran the full gate:
- **(mine)** `impl_status: architecture-pending` requires a coupled `vault_pending` field
  (`validate-impl-status.mjs:96-100`) — missing in v1. Closed: vault_pending added (VLT-S084-IGT-BUILD).
  Root cause of the miss: I ran ONLY `validate-universal-alignment` (the validator that had complained),
  saw exit=0, and declared green — verifying the yelling validator, not the whole gate.
- **(pre-existing, NOT mine — HEAD-isolated)** `pnpm_install_frozen` fails: `pnpm-lock.yaml` is stale vs
  `apps/csps-playground/package.json` (added `prisma`/`@prisma/client ^6.19.3` via the submodule advance).
  My commit added only this `.md`. Tracked as a separate obligation; lockfile regen belongs to the
  playground/submodule work, not an identity-plan commit.

**Honest gate status:** verify is NOT 0 on this tree — it carries the pre-existing lockfile drift above.
My own finding is closed. The lesson (verify=0 is the push gate, not "the prose reads complete") is the real
output of this sweep.

---
*Authored S084 · Core seed (IGT): Opus-21 · Build A2–A7: Sonnet · Extends COMMUNICATION-CORE (AI dimension, Option A).*
*Born from the S084 live identity-confusion incident — an Opus tab told every turn to speak as Sonnet.*
