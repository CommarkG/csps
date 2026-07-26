---
id: csps.protos.proto-s089-shadcn-ui-adoption
name: PROTO-S089-SHADCN-UI-ADOPTION
description: >
  Adopt shadcn/ui (Radix + Tailwind, unstyled-by-default) as the platform's default UI component
  set for all app pages/interfaces, consuming the existing ratified design-tokens.yaml rather than
  replacing it. Governor-confirmed via B_CONSENSUS_BEFORE_CODE queue (tools/data/consensus-queue.yaml
  id=cq_SHADCN_UI_ADOPTION); Governor ratified this item alone as "significant enough to launch"
  (S089). AWAITING OPUS REVIEW before any implementation — plan only, no code written yet.
diataxis_type: reference
version: "1.0"
session: S089
authored_by: SONNET-S089
owner: group:finky
core_spine: ARCH
core_spines: [ARCH, GVRN]
schema_anchor: proto_files
lifecycle: production
lifecycle_state: active
impl_status: plan-only
ratified_by: "Governor S089 (batch-launch decision only — implementation still gated on Opus approval)"
ratified_at: "2026-07-27"
plan_item_id: cq_SHADCN_UI_ADOPTION
core_seed_present: true
gate_tier: check-in
links:
  - { rel: consensus-queue, href: ../../../tools/data/consensus-queue.yaml }
  - { rel: batch-launch-state, href: ../../../tools/data/batch-launch-state.json }
  - { rel: b-consensus-before-code, href: ../pillar-0-governance/behavioral-contracts/B_CONSENSUS_BEFORE_CODE.md }
  - { rel: design-tokens, href: ../../../tools/config/design-tokens.yaml }
---

# PROTO-S089-SHADCN-UI-ADOPTION

## Status
**PLAN ONLY. No code written.** Per B_CONSENSUS_BEFORE_CODE (HARDWIRE-013), Governor ratification
of "significant enough to launch" authorizes *this plan* to be reviewed — not automatic
implementation. Requesting Opus review + approval before any Edit/Write/Bash implementation step.

## Decision Ledger (already reached, recorded here for Opus visibility)
- **Chosen:** shadcn/ui (Radix primitives + Tailwind CSS, ships unstyled — you own the CSS).
- **Rejected — Material UI / Chakra:** opinionated pre-styled look, fights minimalism, harder to
  strip down to plain/functional-first (Governor's explicit ask: "simple... minimalistic and
  elegant... validate function with... not mess around with fancy uncalled for elements").
- **Rejected — bare hand-rolled Tailwind-only (no component library):** no consistency guardrails
  across the platform's planned 30 SaaS apps — every app reinvents buttons/cards/forms
  independently, and a "minimal" per-app look would drift app-to-app with no shared source.
- **Governor confirmation:** "I confirm confirm shadcn/ui" (S089), recorded in
  `tools/data/consensus-queue.yaml` id=`cq_SHADCN_UI_ADOPTION`.

## What already exists (checked before proposing — P-META-029)
- `tools/config/design-tokens.yaml` — ratified (S059) color/spacing/typography token registry,
  already inherited by every app at fork. shadcn/ui must CONSUME these, not replace them.
- `tools/templates/page-scaffold-default.tsx` — current default page pattern (Server + Client
  component split, useData hook, B_PAGE_COMPLETE checklist). shadcn components slot into the
  Client Component half; this scaffold's structure is unaffected.
- `apps/template/` — the fork source for every new app (`tools/scripts/fork-app.mjs`). This is
  where shadcn should be installed ONCE, so every future forked app inherits it automatically —
  not installed per-app after the fact.
- No existing shadcn/Radix/Tailwind-component-library dependency anywhere in the repo (checked:
  no `components.json`, no `@radix-ui/*` in any `package.json`).

## Proposed implementation (NOT YET DONE — this is the plan Opus is asked to approve)

1. **Where it lives:** initialize shadcn/ui inside `apps/template/` (the fork source), not as a
   separate `libs/ui` package. Reasoning: shadcn's own model is "copy components into your repo,"
   not "import from an npm package" — components become part of each app's own source after fork,
   which matches how `apps/template/` already works as the thing that gets copied wholesale by
   `fork-app.mjs`. A shared `libs/ui` package would fight shadcn's copy-in philosophy and add an
   extra layer future app-forks would need to keep in sync.
   - **Alternative considered and available if Opus prefers it:** a thin `libs/ui-tokens/` package
     exporting ONLY the Tailwind config/CSS-variable mapping from `design-tokens.yaml` (not
     components), imported by `apps/template/tailwind.config.ts`. This keeps the token SSoT
     genuinely single-sourced at the config layer while still letting shadcn components live
     per-app per its own model. Flagging this as the more "consolidation-correct" option per
     B_CONSOLIDATION_PASS, worth Opus's view on which to choose.

2. **Token wiring:** map `design-tokens.yaml`'s color/spacing/radius values into
   `apps/template/tailwind.config.ts` CSS variables (shadcn's `components.json` `cssVariables: true`
   mode reads from `:root` CSS custom properties) — so shadcn components render using CSPS's own
   ratified palette, not shadcn's stock defaults, from the first component installed.

3. **Starter component set (deliberately minimal, per "validate function, not fancy"):**
   `Button`, `Card`, `Input`, `Label`, `Badge` — five components covering the majority of
   `page-scaffold-default.tsx`'s existing needs (forms, status badges, content cards). NOT the
   full shadcn catalog — more components added only when a real page needs one, per
   B_SANDBOX_BEFORE_IMPLEMENTATION (don't pre-build unused surface).

4. **Verification before calling this done:** `pnpm build` on `apps/template` succeeds, and one
   real page in `apps/csps-playground` (the platform's own live app) is migrated to use at least
   one shadcn component, screenshotted, and visually confirmed to use the correct design-tokens
   palette (not shadcn's stock gray/black defaults) — per B_DONE_RIGHT_FROM_THE_START, a visual
   check is the actual evidence here, not just a clean `tsc`.

## What this does NOT do (scope discipline)
- Does not touch any app's actual page content/features — this is purely the UI foundation layer.
- Does not retrofit `apps/csps-playground`'s existing pages beyond the one verification page in
  step 4 — a full-platform re-skin is explicitly out of scope for this batch.
- Does not install shadcn's theming CLI wizard defaults (dark-mode toggle infra, etc.) unless a
  real page needs it.

## Request to Opus
Please review: (a) the `libs/ui-tokens` vs. `apps/template`-only placement question in step 1,
(b) whether the 5-component starter set is right-sized, (c) whether this belongs in `apps/template`
at all vs. a different foundation-slice location. Reply in `tools/council/opus-turn.md` per the
formal council channel. On approval, this moves from `impl_status: plan-only` to implementation.

## Core Seed

Adopt shadcn/ui (Radix + Tailwind, unstyled-by-default) as CSPS's default UI component set,
consuming the existing ratified `design-tokens.yaml` rather than replacing it. Installed once in
`apps/template/` (the fork source) so every future forked app inherits it automatically. Starter
set deliberately minimal (Button/Card/Input/Label/Badge) — grow on real page need, not in advance.

## DONE WHEN

1. Opus has reviewed and approved this PROTO in `tools/council/opus-turn.md` (gate_tier: check-in
   — implementation does not start before this).
2. `components.json` + the 5 starter components exist in `apps/template/`, wired to
   `design-tokens.yaml` via CSS variables (not shadcn's stock palette).
3. `pnpm build` succeeds on `apps/template`.
4. One real page in `apps/csps-playground` uses at least one shadcn component, screenshotted, and
   visually confirmed to render CSPS's own palette (not shadcn defaults).
5. `tools/data/consensus-queue.yaml` id=`cq_SHADCN_UI_ADOPTION` status flips to `launched` with a
   real `launch_commit_sha`.

## ZF Gate

- Cycle 1 (existing-infra check, already done): `design-tokens.yaml` confirmed ratified S059,
  real content; `page-scaffold-default.tsx` confirmed as the current default pattern; no existing
  shadcn/Radix/Tailwind-component dependency anywhere in the repo (checked, zero hits).
- Cycle 2 (Opus review, pending): placement question (apps/template vs. libs/ui-tokens) and
  starter-set sizing answered before any Edit/Write proceeds.
- Cycle 3 (post-implementation, pending): visual confirmation (DONE WHEN #4) is the actual
  evidence — a clean `tsc`/build alone does not close this, per B_DONE_RIGHT_FROM_THE_START.
