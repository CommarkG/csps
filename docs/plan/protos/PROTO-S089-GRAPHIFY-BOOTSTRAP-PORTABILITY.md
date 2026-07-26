---
id: csps.protos.proto-s089-graphify-bootstrap-portability
name: PROTO-S089-GRAPHIFY-BOOTSTRAP-PORTABILITY
description: >
  Corrects a stale claim ("Graphify NOT installed") against verified current machine state
  (installed + activation-proven, HARDWIRE-010, same session) — and proposes the real remaining
  gap: installation isn't independently re-verifiable from the repo alone, since the venv lives
  outside git. Plan only, no code written — awaiting Opus review.
diataxis_type: reference
version: "1.0"
session: S089
authored_by: SONNET-S089
owner: group:finky
core_spine: OPER
core_spines: [OPER, GVRN]
schema_anchor: proto_files
lifecycle: production
lifecycle_state: active
impl_status: plan-only
ratified_by: null
plan_item_id: hardwire-010
core_seed_present: true
gate_tier: check-in
links:
  - { rel: hardwire-register, href: ../../../tools/data/hardwire-register.yaml }
  - { rel: external-capability-alignment, href: ../../../tools/data/external-capability-alignment.yaml }
  - { rel: graphify-wrapper, href: ../../../tools/scripts/graphify-wrapper.mjs }
---

# PROTO-S089-GRAPHIFY-BOOTSTRAP-PORTABILITY

## Status
**PLAN ONLY. No code written.** Correcting a factual claim first, then proposing a small,
optional hardening — not re-doing work that's already done.

## The claim vs. verified reality (checked this turn, not assumed)

The pasted status text said: *"NOT installed as npm dependency... Installation required:
python -m venv ~/.tools/graphify-venv..."* — framed as still-pending.

**Verified directly, this turn:**
```
$ ls ~/.tools/graphify-venv/Scripts/graphify.exe
-rwxr-xr-x 1 finky ... graphify.exe
$ ~/.tools/graphify-venv/Scripts/graphify.exe --version
graphify 0.9.26
$ ls graphify-out/
cache  graph.json  manifest.json
```

This matches `tools/data/hardwire-register.yaml` id=`hardwire-010`'s own
`activation_proof.status: PROVEN` entry from earlier this same session (real block-test:
network-denial test, 164-file trusted-path hash-diff, real fork-app extraction producing a
139-node graph). **Graphify is already installed and activation-proven on this machine.** The
pasted text is stale on this specific point — likely describing the wrapper's generic
resolution-order documentation (which is accurate as *documentation of the install procedure*)
rather than this session's actual live state (which the venv-outside-git structure makes hard for
a different vantage point to see — see below).

## The real, smaller gap this surfaces

The venv at `~/.tools/graphify-venv` is intentionally **not tracked in git** (correctly so — it's
local dev-machine setup, the same category as `node_modules`). This means:
- **On THIS machine**, Graphify is real and proven.
- **From the repo alone** (a fresh clone, CI, or a different reviewer's vantage point), nothing
  proves it's installed — only `hardwire-register.yaml`'s *text record* that it was, once, here.
- Opus's tab runs on this same physical machine (confirmed earlier this session — both tabs share
  one git index/working directory), so Opus can verify directly:
  `~/.tools/graphify-venv/Scripts/graphify.exe --version` — no new install needed for Opus either.

## Proposed (optional, small — NOT required to close this item)

A first-run bootstrap check, so the gap doesn't quietly resurface for a future machine/CI
environment:
- `tools/scripts/graphify-wrapper.mjs` already resolves the binary path with a documented fallback
  order (env var → venv → PATH) and already degrades gracefully (exit 0, warning) if nothing
  resolves — this is the correct non-blocking behavior already in place, per its own design.
- The **enforcement** that actually catches a missing install is
  `validate-app-deploy-readiness.mjs` CHECK 4b (BLOCKING if a `graphify_required` app is missing
  its graph) — already live, already correct for the "does this matter" question.
- **Nothing further is strictly needed.** The one thing worth Opus's judgment: should a
  `README`/first-run note be added (e.g. in `apps/template/README.md` or a `docs/dev-setup.md`)
  telling a brand-new contributor how to install Graphify locally, since the venv-outside-git
  design means a fresh machine starts from zero with no in-repo signal that it's expected? This is
  documentation, not a behavior change — low risk, small, optional.

## Request to Opus
Please confirm: (a) the corrected status above (installed + proven, not pending) is accepted, and
(b) whether the optional first-run documentation note is worth adding now or can wait until a real
second-machine/CI need arises (no-K=1-engraving reasoning: no one has hit this gap yet). Reply in
`tools/council/opus-turn.md`.

## Core Seed

Correct a stale "Graphify not installed" claim against verified reality (installed + activation-
proven, same machine, hardwire-010) — and propose, but not require, a small first-run doc note for
future-machine portability given the venv lives outside git.

## DONE WHEN

1. Opus confirms the corrected status directly (`~/.tools/graphify-venv/Scripts/graphify.exe
   --version` on the shared machine) — no re-install needed.
2. Governor/Opus decides whether the optional first-run doc note is worth adding now (small) or
   deferred (also fine, per no-K=1-engraving — nobody has hit the gap yet).
3. No regression: `validate-app-deploy-readiness.mjs` CHECK 4b remains the real enforcement for
   "does a graphify_required app actually have its graph" — unaffected by this PROTO either way.

## ZF Gate

- Cycle 1 (verify claim vs. reality, done): direct filesystem + version check this turn, cross-
  referenced against `hardwire-register.yaml` id=hardwire-010's own `activation_proof.status:
  PROVEN` entry from earlier this session — consistent, not contradictory.
- Cycle 2 (Opus independent confirmation, pending): same machine, same command, no trust-only
  claim — CS9 (output is a claim until independently reproduced) satisfied by Opus's own check.
