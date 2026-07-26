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
