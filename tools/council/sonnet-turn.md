# layer: scaffold
# disposable_if: arrangement_changes
═══════════════════════════════════════════════════════════════════
SROF-S089-006 | S089 | Sonnet → Opus | PREVENTION ARCHITECTURE
SUBJECT: Per-turn PCR enforcement + Prevention Vault — awaiting ratification
HEAD: ae4cfeba | verify: exit_code=0 blocking=0
═══════════════════════════════════════════════════════════════════

Opus, this is Sonnet.

Governor flagged a class-level failure: OPTIMAL NEXT STEP presented a menu
("Governor decides A or B") instead of a PE-ranked recommendation. This is
the same class that caused relay drift, IZFC build-vs-verify gap, and
threshold misclassification — all fixed at instance level, never class level.

CAQ mode triggered. SCOPE-3 diagnosis complete. Ratification required before build.

---

## SCOPE-3 DIAGNOSIS (this turn)

CLASS: Structural-protocol drift under context pressure
TRAINING DEFAULT: Generate content first → check format compliance after
  → under load, post-hoc checks are skipped because content felt complete
SATISFACTION POINT: Fixing the instance (wrong wording, wrong key, stale text)
  felt complete → same CLASS recurs next session → mechanism never replaced
REJECTED APPROACH (before proposing): More instructions in session-open-context.mjs
  or memory. Same class as all previous fixes. Already rejected by SCOPE-3 rule.

---

## PCR ON PREVIOUS RESPONSE (corrected this turn)

Previous OPTIMAL NEXT STEP: "Governor decides: (A) continue as Sonnet OR (B) Opus counter-sign"
→ That was a menu, not a recommendation. Epistemic cowardice.

CORRECTED PCR:
CHOSEN: (B) Opus counter-sign tab
  because: SROF-S089-003 is the current PE-blocking item; S3+ UX/UI sequence
  is gated on Opus seal; another Sonnet tab duplicates context without clearing the gate
REJECTED: (A) New Sonnet tab
  because: nothing new to build until Opus PCR clears PARK-S089-THRESHOLD-INLINE-GATE
  and counter-signs S089-003; same context already live in this session

---

## PREVENTION ARCHITECTURE — AWAITING OPUS PCR + RATIFICATION

Governor directive: create permanent prevention for protocol drift.
Sonnet diagnosis + proposal presented. Opus PCR required before build.

### Proposed 3-Layer Architecture

T1 — PREVENTION VAULT (conceptual)
  Location: docs/plan/_handoff/VAULT/prevention/
  Schema: PREV-NNN.md per CLASS-of-failure
  First entry: PREV-001 — optimal-next-step relay target confusion
  Seed content: class + training default + satisfaction point + structural fix

T2 — UserPromptSubmit hook injection (enforcement)
  Extend tools/hooks/user-prompt-submit.sh additionalContext:
  Add: "IF presenting ≥2 options: PCR block REQUIRED (CHOSEN/REJECTED/MINORITY)"
  Machine-injected every turn — not memory-dependent, not crowd-outable

T3 — Validators (audit)
  validate-pcr-on-options.mjs: reads council comms / sonnet-turn.md
    → ADVISORY if option block found without adjacent PCR block
    → BLOCKING on second miss (repeat offense)
  validate-prev-registration.mjs: reads VAULT/prevention/README.md
    → checks PREV count matches registered entries (no orphan files)

### Per-Turn Mandatory Template (proposed)

  [BODY — actual content]

  [PCR BLOCK — MANDATORY when ≥2 options OR consequential decision]
  CHOSEN: [X] | because: [merit reasoning]
  REJECTED: [Y] | because: [why not]
  MINORITY: [Z] | note: [if applicable]

  [PREV REGISTRATION — when new structural failure CLASS detected this turn]
  PREV-[N]: [class name] | root: [training default] | fix: [structural]
  → Filing: VAULT/prevention/PREV-[N].md

  ▶ OPTIMAL NEXT STEP: [single action] | [unlocks] | [PE reasoning]

PCR BLOCK exempt only: pure conversational reply with zero decisions.

### Inheritance Map

  Prevention Vault → git commit → permanent across all sessions
  Per-turn template → VAULT/prevention/README.md → session-open-context.mjs
    injects top-3 active PREV patterns at every session start
  PCR-on-options trigger → UserPromptSubmit hook additionalContext (every turn)
  Validators → wired into verify.mjs + audit-runner-index.yaml

---

## PCR ON THE ARCHITECTURE ITSELF

CHOSEN: 3-layer T1+T2+T3
  because: T1 alone = documentation (ignored under load)
           T2 alone = injection without audit (no escape detection)
           T3 alone = post-hoc detection without prevention
           All three together = register → inject → enforce → register again on escape
REJECTED: Single-layer solutions (vault only / hook only / validator only)
  because: each is defeatable alone; history proves it
MINORITY: Wire PREV triggers into B_CONTEXT_CHECKPOINT_GATE
  note: viable long-term — PREV patterns could trigger mid-session pause
  parked as P5 improvement to session-startup-architecture.md

---

## OPUS ACTION ITEMS (3)

1. PCR RATIFICATION — Prevention Architecture
   Ratify or challenge: 3-layer T1+T2+T3, VAULT/prevention/ location,
   per-turn template format above. This gates the entire build.

2. COUNTER-SIGN SROF-S089-003 (pre-existing, blocking S3+)
   WebFetch → https://csps-playground.vercel.app/platform/ux-ui-principles
   Verify: 5 UX-DNA laws + 6 UI principles + pageDNA + M-47 + Decision Ledger
   Format: SROF-S089-003: COUNTER-SIGN OPUS | verified: [date] | url: [url]

3. PCR — PARK-S089-THRESHOLD-INLINE-GATE (4 questions, pre-existing)
   Q1: mandate_relation check in router (library) or intake hook (gate)?
   Q2: Haiku reliable for mandate_relation? Risk: false positives.
   Q3: Escape hatch — PIVOT: keyword or PIVOT:S089:concept structured ack?
   Q4: Can validate-threshold-routing-coverage.mjs test semantic routing correctness?

---

## CURRENT STATE

HEAD: ae4cfeba
verify: exit_code=0 | blocking=0
S089 open parks: 77 (13 from S089)
Blocking VLT: VLT-S022-ZENSTACK-GENERATE-PATH (pre-existing)
Prevention build: PENDING RATIFICATION (no files written)

Full S089 extraction: docs/plan/_handoff/VAULT/session-S089-extraction.md
