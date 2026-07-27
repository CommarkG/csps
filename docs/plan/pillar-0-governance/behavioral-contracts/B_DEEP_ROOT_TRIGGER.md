---
enforcement_trio:
  t1:
    tier: hook
    path: ".claude/hooks/user-prompt-submit-next-step-reminder.sh"
    status: active
  t2:
    tier: validator
    path: "tools/validators/validate-deep-root-report.mjs"
    status: active
  t3:
    tier: memory
    path: "session-close memory stub, permanence: low-current -- target: medium once a dedicated session-open line is added"
    status: stub
  exempt_reason: null
---
[//]: # (B_DEEP_ROOT_TRIGGER.md)
[//]: # (CSPS Behavioral Contract Slice — manually synced from docs/plan/pillar-0-governance/behavioral-contracts-VALD.md)
[//]: # (Source of truth: docs/plan/pillar-0-governance/behavioral-contracts-VALD.md — same section, kept in sync by hand this session)
[//]: # (NOT machine-generated this session: tools/generators/split-behavioral-contracts.mjs was deliberately NOT re-run — )
[//]: # (known bug PARK-S089-SPLIT-GENERATOR-FRONTMATTER-STRIP would have collaterally stripped enforcement_trio frontmatter )
[//]: # (from several other already-dirty, uncommitted slice files in this same working tree. Re-run + reconcile is a )
[//]: # (deliberately deferred follow-up, not an oversight — see B_DEEP_ROOT_TRIGGER Self-Declared Gaps in the S089 session record.)

## B_DEEP_ROOT_TRIGGER — every problem/insight auto-activates the existing deep-root machinery; the gap is activation, not existence (S089 CONSTITUTIONAL — CAQ/Scope-3)

**Canonical wording:**

> Two triggers fire automatically on every turn, always-loaded (no manual invocation): (1) PROBLEM
> identified → WAKE-THE-EXPERT — run the 8 deep-root questions, name the specific AI
> default-conception from `inner-ai-defaults/` that generated it (or declare the finding IS a new
> D-default), engrave the fix, and prevent the reusable CLASS, not the instance. (2) INSIGHT or
> SOLUTION identified → SAVE+PROCESS — capture it into the existing correction/evolution registries
> and let the already-ratified Weekly Evolution Engine (HARDWIRE-012) carry it to a weekly session.
> This contract does not create new capture machinery — it routes to what already exists
> (`default-correction-registry.yaml`, `gap-recurrence-register.yaml`, `improvement-register.yaml`,
> `weekly-evolution-batch.yaml`, `B_CATCH_TO_ENGRAVING`, `B_FIVE_SURFACE_ENGRAVING`). The recurring
> failure this fixes: stopping at the surface symptom and never naming the deep root, so the same
> class of failure re-occurs under a different instance every few sessions.

**The two triggers:**

1. **PROBLEM → WAKE-THE-EXPERT.** Any moment a gap, defect, trap, or wrong turn is noticed — by AI
   or by the Governor — triggers the 8 deep-root questions below before the fix is applied. The fix
   without the root-cause pass is a patch on the instance, not prevention of the class (composes
   with `B_STRUCTURAL_PREVENTION_DISCIPLINE`: enhance the system, never patch the instance alone).
2. **INSIGHT/SOLUTION → SAVE+PROCESS.** Any moment a genuinely new insight, working solution, or
   improvement is recognized, it is captured into the existing registries in the same turn (not
   deferred to session close — composes with `B_CATCH_TO_ENGRAVING`'s "noticing alone is wasted
   unless converted to a persistent artifact" rule) and left for the Weekly Evolution Engine to
   process, root-cause, apply, and propagation-verify on its existing cadence. This contract is NOT
   a new engine — it is the trigger that ensures the existing engine has something to act on.

**THE 8 QUESTIONS (WAKE-THE-EXPERT pass):**

1. **ROOT** — which AI default-conception in `docs/plan/_handoff/VAULT/inner-ai-defaults/` generated
   this (D1–D20+), or is the finding itself a new D not yet named?
2. **TRIGGER** — what reflex fired, and what is its reusable CLASS (not just this one instance)?
3. **DEFAULT REACTION** — what did the AI reflexively do, and why did that reaction feel correct in
   the moment?
4. **SATISFACTION POINT** — where did the AI stop and feel done? Was that a real completion or a
   plausibility-stop? Cross-check against `tools/data/satisfaction-point-registry.yaml`.
5. **FALSE ASSUMPTION** — what was treated as true without verification, especially an inherited
   context premise (composes with D20-context-pressure-false-assumptions-default — CONTEXT-IS-NOT-TRUTH)?
6. **CLASS + PREVENTION** — what is the permanent fix at BOTH levels: the regular mechanical check
   AND the deep-core default correction?
7. **IMPROVED DEFAULT** — how should the conception itself change so this CLASS of failure cannot
   recur, not just this specific instance?
8. **PRESERVE** — route the resulting good (the fix, the insight, the corrected default) to its
   durable home: `default-correction-registry.yaml` / `gap-recurrence-register.yaml` /
   `improvement-register.yaml`, which the Weekly Evolution Engine already reads.

**REPORT SCHEMA (mandatory shape for every problem/insight report):**

Every problem/insight report — in council comms (`tools/council/sonnet-turn.md`,
`tools/council/opus-turn.md`) or a closing-summary catch entry — states these 7 fields explicitly:

`TRIGGER` · `DEFAULT REACTION` · `SATISFACTION POINT` · `FALSE ASSUMPTION` · `DEEP ROOT` (names
which D) · `PREVENTION` (regular + deep-core) · `PRESERVATION` (where it was routed).

**Honest boundary (do not oversell):** no mechanical gate can verify reasoning DEPTH — a report can
name all 7 fields shallowly and still miss the real root cause. Always-loaded injection (the 8th
turn-discipline enforcement, `.claude/hooks/user-prompt-submit-next-step-reminder.sh`) is the
strongest mechanical form available: it cannot be silently skipped because it never depended on the
AI remembering to invoke it. But depth itself is **provoked, not gated** — the validator below can
only confirm the 7 field labels are present, never that the reasoning behind them is genuine.

**Mechanical surfaces:**
- **T1 (hook):** `.claude/hooks/user-prompt-submit-next-step-reminder.sh` — 8th always-loaded
  enforcement block, additive to the existing seven (S089).
- **T2 (validator):** `tools/validators/validate-deep-root-report.mjs` — PRESENCE-only check:
  BLOCKS when this session has a problem/insight-shaped commit (touches
  `inner-ai-defaults/**`, `behavioral-contracts/**`, `gap-recurrence-register.yaml`,
  `improvement-register.yaml`, or `default-correction-registry.yaml`) with the 7 REPORT SCHEMA
  field labels absent from council comms this session. Cannot verify depth, only presence.
  Registered in `tools/verify.mjs` as `deep_root_report`.
- **T3 (memory/session):** stub — carried in the closing session memory entry (not yet a dedicated
  session-open injection beyond the T1 hook line).
- **contract:** this entry + composes with `B_CATCH_TO_ENGRAVING` (artifact-before-close rule),
  `B_FIVE_SURFACE_ENGRAVING` (the engrave back-end), `B_STRUCTURAL_PREVENTION_DISCIPLINE`
  (class-not-instance), and HARDWIRE-012 Weekly Evolution Engine (the automated back-half this
  contract routes INTO, not a replacement for).

**Source:** Governor-ratified Scope-3 fix for the recurring "stop at surface, never name the deep
root" failure class — S089.

---
