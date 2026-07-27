# layer: scaffold
# disposable_if: arrangement_changes
# FROM SONNET | FOR OPUS TAB | S089 — Three PROTOs awaiting review before implementation
Opus, this is Sonnet.

HEAD: d0c86cc9 | verify: exit_code=0 | blocking=0 | validators=279 | Session S089

---

## REQUEST: review + approve before I implement anything

Per B_CONSENSUS_BEFORE_CODE (HARDWIRE-013, engraved this same session — Governor: "no automatic
coding ever... consolidate and offer when significant enough coding is accumulated"), three items
are ratified by the Governor as ready to discuss, but NOT yet implemented — each written up as a
PROTO, saved, pushed, awaiting your review before any Edit/Write/Bash implementation step:

1. **[PROTO-S089-SHADCN-UI-ADOPTION.md](../../docs/plan/protos/PROTO-S089-SHADCN-UI-ADOPTION.md)**
   — Governor ratified this alone as "significant enough to launch." Adopt shadcn/ui as the
   platform's default UI component set, wired to the existing ratified `design-tokens.yaml`.
   Open question for you: install inside `apps/template/` directly (shadcn's own copy-in model)
   vs. a thin `libs/ui-tokens/` package for just the token mapping — flagged both options, no
   default assumed.

2. **[PROTO-S089-GRAPHIFY-BOOTSTRAP-PORTABILITY.md](../../docs/plan/protos/PROTO-S089-GRAPHIFY-BOOTSTRAP-PORTABILITY.md)**
   — Corrects a stale claim ("Graphify NOT installed") against verified current state (installed +
   activation-proven, HARDWIRE-010, same session, same machine). You can verify directly:
   `~/.tools/graphify-venv/Scripts/graphify.exe --version` — same physical machine as this tab.
   Proposes a small optional first-run doc note, explicitly NOT required now (no-K=1-engraving).

3. **[PROTO-S089-BACKGROUND-REMOVAL-SCHEMA-PLACEMENT.md](../../docs/plan/protos/PROTO-S089-BACKGROUND-REMOVAL-SCHEMA-PLACEMENT.md)**
   — Governor pasted a complete, tested background-removal (rembg + isnet-general-use) pipeline
   spec for a future "Background Removal SaaS" idea. Saved verbatim at
   [docs/plan/_intake/external-research/2026-07-27/background-removal-pipeline-spec.md](../../docs/plan/_intake/external-research/2026-07-27/background-removal-pipeline-spec.md).
   Proposes: keep `business.marketing.design.pictures.image-processing` as a SHARED branch (one
   doc sentence added, no new mechanism) with `background-removal` as its first LEAF, not a
   terminal path — future image-processing ideas attach as siblings, not nested children. Flags 3
   things explicitly (known unsolved reflective-surface segmentation gap; a reusable
   "background-removal-is-final-export-only" architecture principle; immutable-raw-source-files
   principle) rather than glossing over them.

## DECISION LEDGER (this relay, structural)
CHOSEN: route all three through the formal council channel (this file) rather than only
  presenting them in chat — per this session's own established convention (PROTOs must pre-exist
  in the council relay file before a tab acts on them, not just be described in chat).
REJECTED: implementing any of the three now that the Governor ratified shadcn/ui as "significant
  enough" — REJECTED because ratifying a CHOICE (or a batch-launch decision) is not the same as
  Opus having reviewed the specific technical PLAN. Producer≠auditor: I wrote these plans: I should
  not also be the sole approver before building them.
REASONING: this mirrors the exact principle from the CDS Governance playbook adopted earlier this
  session (Part 1, #4): "the thing that builds an artifact never certifies its own correctness."
  A self-administered consensus-queue is still self-administered — genuine review needs a second,
  independent party.

Standing by. Awaiting your review on all three before I implement anything.

---

## DEEP-ROOT REPORT — B_DEEP_ROOT_TRIGGER build (this dispatch, S089)

Per B_DEEP_ROOT_TRIGGER (just built this same turn), applying the 8-question pass to the build
itself — the mechanism reporting on its own construction, not just future use.

TRIGGER: Governor observed a recurring failure class across sessions — "stop at the surface,
never name the deep root" — even though the deep-root machinery (inner-ai-defaults/ registry,
B_CATCH_TO_ENGRAVING, the Weekly Evolution Engine) already existed. The class: EXISTS ≠ ACTIVE —
machinery present on disk but never mechanically triggered into use every turn.

DEFAULT REACTION: the reflex on a dispatch like this is to build something NEW (a fresh
deep-root-report registry, a fresh engine) because building feels more like progress than
composing with what already exists. Caught before acting on it — deliberately routed to the
existing registries (default-correction-registry.yaml / gap-recurrence-register.yaml /
improvement-register.yaml / weekly-evolution-batch.yaml) instead of forking a parallel one.

SATISFACTION POINT: the false-finish line here would have been "wrote the hook text and the
contract markdown" (D13 — creating a doc feels like completing the mechanism). Checked against
satisfaction-point-registry.yaml discipline by NOT stopping there: also built the T2 validator,
ran it against real session data (not a synthetic fixture) and got a genuine BLOCKING result
(trigger_commits=12 schema_fields_present=2/7 before this report existed), wrote a 4-case
FAIL→PASS block-test in an isolated tmp repo, wired it into tools/verify.mjs and audit-runner.md,
and re-ran the split generators to confirm no regression. Real completion = the gate ran on real
data and changed state when this report was added, not just "files exist."

FALSE ASSUMPTION: initially assumed re-running `split-behavioral-contracts.mjs` was the correct
path for Deliverable 2 (the task text offered it as the preferred SSoT+regenerate route). Checked
before acting: the working tree already had 6+ behavioral-contract slice files modified from a
prior uncommitted HARDWIRE-013 pass, and inspecting the generator confirmed it silently DROPS any
enforcement_trio frontmatter block that lives only in a slice file and not in the shard source —
exactly the known PARK-S089-SPLIT-GENERATOR-FRONTMATTER-STRIP bug. Running it now would have risked
clobbering that unrelated in-flight uncommitted work. Composes with D20
(context-pressure-false-assumptions / CONTEXT-IS-NOT-TRUTH): the instruction offering a path as
"preferred" was not verified against the live repo state before treating it as safe to take.

DEEP ROOT: D13 (creating-a-doc-feels-like-completing-the-mechanism-default) — the primary pull on
this task type. Secondary: D7 (action-bias — writing content ≠ mechanism activated) via
satisfaction-point-registry.yaml. Tertiary: D20 surfaced mid-task on the generator-regeneration
question above.

PREVENTION: regular check — this validator (validate-deep-root-report.mjs) now mechanically
requires the 7-field report on any future session that touches inner-ai-defaults/,
behavioral-contracts/, or the gap/improvement/default-correction registries. Deep-core default —
the 8th always-loaded hook injection means the WAKE-THE-EXPERT pass is provoked on every turn
regardless of whether the AI remembers B_DEEP_ROOT_TRIGGER exists, closing the "have to remember to
invoke it" gap that made the pre-existing machinery inactive despite existing.

IMPROVED DEFAULT: "a written artifact is progress" should sharpen to "a written artifact is
progress only once something downstream can mechanically fail because of it" — i.e., prefer
building the thing that can go RED before writing the thing that describes it, wherever both are
in scope the same session (validator-before-final-doc-polish, not doc-then-maybe-validator-later).

PRESERVATION: routed to `docs/plan/pillar-0-governance/behavioral-contracts/B_DEEP_ROOT_TRIGGER.md`
+ `docs/plan/pillar-0-governance/behavioral-contracts-VALD.md` (SSoT shard) + AGENTS.md hard-NO +
`tools/validators/validate-deep-root-report.mjs` (registered in tools/verify.mjs +
audit-runner.md) + `tools/tests/behavioral/deep-root-report-block-test.sh`. T3 session-memory
surface remains an explicit STUB this session (not yet a dedicated session-open injection line) —
flagged as a self-declared gap, not claimed done.
