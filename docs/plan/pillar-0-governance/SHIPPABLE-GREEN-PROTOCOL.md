---
id: csps.protocol.shippable-green
name: SHIPPABLE-GREEN-PROTOCOL
description: >
  The completion law (Governor S088 ratified). "Green" is the full chain
  source → committed-everywhere → builds → deploy-root-self-contained → deployed → renders,
  with each link enforced by an AUTOMATIC gate inside the implementation protocol
  (pre-commit / verify / CI), never by a manual sanity-check. Done = shippable + demonstrated.
version: "1.0"
session: S088
owner: group:finky
authored_by: OPUS-25
core_spine: VALD
diataxis_type: reference
schema_anchor: pillar_0_governance_leaves
lifecycle: production
lifecycle_state: active
status: active
precedent_checked: true
links:
  - { rel: deterministic-gate, href: ./zf-mandate-protocol.md }
  - { rel: audit-hub, href: ./audit-hub.md }
  - { rel: ratified-standards, href: ../../../tools/data/ratified-standards.yaml }
---

# Shippable-Green Protocol — completion is a chain, every link auto-gated

## L0 PRINCIPLE
**GREEN ≠ "compiles."** Green = the deliverable is *shippable and demonstrated*: it is
committed in its true location (including submodules), it BUILDS the way the deploy builds,
its deploy-root is self-contained, it is deployed, and it RENDERS in production. Every link is
proven by an **automatic gate in the implementation protocol** — at the moment of creation —
not by a human requesting an audit. A defect that surfaces only on manual sanity-check means
the prevention does not yet exist.

This is the prevention+completion MOAT: CSPS structurally cannot ship looks-done-isn't-done.

## THE CHAIN (each link = a failure class found S088 + its permanent gate)

| # | Link | S088 failure it prevents | Prevent-by-construction | AUTO-gate (where it fires) |
|---|------|--------------------------|--------------------------|----------------------------|
| C1 | **Builds-as-deployed** | app `route.ts` export error froze EVERY Vercel build → stale deploy; `verify` never built `apps/` | `verify` runs the real `next build` for any changed app (not just `tsc` of packages) | `verify.mjs` gate + CI `build` job — BLOCKING |
| C2 | **Committed-everywhere** | journey page left UNTRACKED in `csps-playground` submodule; parent pointed at pre-build SHA | gate blocks on untracked source under a tracked submodule, or parent pointer behind submodule source | `validate-submodule-deliverable.mjs` in pre-commit + `verify` — BLOCKING |
| C3 | **Deploy-root self-contained** | API read `../../docs/*` (parent) absent in submodule deploy → silent embedded fallback | prebuild GENERATES in-app copies from canonical (extend `copy-registry.mjs`); validator asserts copy == canonical | `prebuild` + `validate-deploy-root-selfcontained.mjs` in `verify` — BLOCKING |
| C4 | **Receipt-fresh** | green-receipt generated before the SROF content commit → stale receipt reported as current | tree_hash recompute; any tracked-content commit after the receipt invalidates it | `validate-green-receipt.mjs` (exists) + post-commit re-verify trigger — BLOCKING |
| C5 | **Two-party sealed** | builder self-certified SEAL on its own claim | `director_seal{by,head,tree_hash}` valid only when it reproduces receipt tree_hash at current HEAD | `validate-two-party-seal.mjs` for SEAL claims — BLOCKING |
| C6 | **Renders-in-production** | page returned HTTP 404 live; "renders" was never checked against the deploy | post-deploy smoke READS the live URL (HTTP status + DOM + data-provenance) | CI `http-smoke.yml` extended → render+provenance smoke; agent uses WebFetch/Playwright — BLOCKING on merge |

## THE META-RULE (the actual moat)
No link may be *asserted*; each must be *reproduced by a gate*. The builder may set
**BUILD-COMPLETE**; **green** is what the gates compute; **SEAL** is the independent
two-party reproduction. The implementation protocol therefore ends not at "commit" but at
"gates green across all six links" — automatically, every time.

## ENGRAVING (FSE — so it inherits to every agent, holds permanently)
Each link engraved 5 surfaces: T5 AGENTS.md (the persona + chain) · T4 this protocol +
B_SHIPPABLE_GREEN contract · T3 memory (`feedback_builder_persona_prevention_completion_moat`,
`feedback_submodule_deliverable_uncommitted_gate_blindspot`) · T2 the validators above ·
T1 pre-commit hooks + verify wiring + CI. Ratified-standards.yaml gets one entry per link so
Pipeline A makes each a platform standard + audit automatically.

## AUDIT POSTURE (Governor S088 directive)
The audit is NOT a separate manual step. It is woven into creation: pre-commit catches C2;
`verify` catches C1/C3/C4; the seal catches C5; CI catches C1/C6 on every push. "Run an audit"
becomes redundant for this class because the implementation protocol already refuses to call
anything green until the chain is proven.
