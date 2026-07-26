---
id: csps.protos.proto-s089-background-removal-schema-placement
name: PROTO-S089-BACKGROUND-REMOVAL-SCHEMA-PLACEMENT
description: >
  Proposes a modular domain_path structure separating the WIDE, reusable branch
  (business.marketing.design.pictures.image-processing — usable by any future image-processing
  SaaS idea) from the SPECIFIC leaf app (background-removal — the first, but not only, tool under
  that branch). Also proposes where the full technical spec (rembg/isnet-general-use pipeline,
  preserved verbatim in docs/plan/_intake/external-research/2026-07-27/) should actually live once
  this idea enters app-pipeline.md's formal INTAKE step. Plan only — no code, no app scaffold,
  no domain_path ratification beyond what's already marked placeholder.
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
ratified_by: null
plan_item_id: domain-taxonomy-tier3-background-removal-placeholder
core_seed_present: true
gate_tier: check-in
links:
  - { rel: domain-taxonomy, href: ../pillar-0-governance/domain-taxonomy.md }
  - { rel: source-spec, href: ../_intake/external-research/2026-07-27/background-removal-pipeline-spec.md }
  - { rel: app-pipeline, href: ../pillar-0-governance/meta-platform/app-pipeline.md }
  - { rel: frontmatter-closed-enums, href: ../pillar-0-governance/frontmatter-closed-enums.md }
---

# PROTO-S089-BACKGROUND-REMOVAL-SCHEMA-PLACEMENT

## Status
**PLAN ONLY.** No `apps/` directory created, no app-pipeline INTAKE opened, no domain_path value
promoted beyond `placeholder` status. This proposes HOW to place the idea in the schema, cleanly
separated from the wider category it sits under — not the app build itself.

## What already exists (from an earlier turn this session — reviewed here, not redone)
`docs/plan/pillar-0-governance/domain-taxonomy.md` already has, as explicitly-marked placeholders
pending ratification:

```
business                                                          (Tier 1, ratified)
business.marketing                                                (Tier 2, ratified — "Campaigns, content, growth")
business.marketing.design                                         (placeholder)
business.marketing.design.pictures                                (placeholder)
business.marketing.design.pictures.image-processing               (placeholder)
business.marketing.design.pictures.image-processing.background-removal   (placeholder, no app yet)
```

## The modularity problem worth Opus's review

As structured, each level is documented as its own table row — which IS already reasonably
modular. But the framing doesn't yet make explicit that
`business.marketing.design.pictures.image-processing` is meant to be a **shared branch with
multiple possible leaves**, not a path that terminates at `background-removal` specifically.
Concretely: if a second image-processing idea comes up later (batch watermarking, image
upscaling, format conversion), it should attach as a SIBLING leaf under the same branch —
`business.marketing.design.pictures.image-processing.image-upscaling`, for example — without
touching or reasoning about `background-removal`'s own entry at all.

**Proposed change (documentation only, not a new mechanism):** add one sentence to the domain-
taxonomy.md section making this explicit — "this branch is shared; register additional sibling
leaves here as new image-processing tool ideas arise, following the same placeholder-then-ratify
pattern" — so a future contributor doesn't either (a) awkwardly nest a new idea under
`background-removal` (wrong — implies a parent/child product relationship that doesn't exist) or
(b) invent a whole new parallel branch out of uncertainty about whether reuse was intended.

**Deliberately NOT proposing:** pre-registering speculative sibling leaves (image-upscaling, etc.)
now, since none exist yet — that would be inventing placeholders for ideas nobody has asked for,
which B_SANDBOX_BEFORE_IMPLEMENTATION and P-META-029 both argue against. The branch stays open for
real future ideas, not populated in advance.

## Where the full technical spec belongs (it does NOT belong in domain-taxonomy.md)

The pasted rembg/isnet-general-use pipeline document is a **mature, largely-crystallized app
spec** — it already contains what `app-pipeline.md` Step 1 (INTAKE: "domain/problem/user in 1-3
sentences") and Step 2 (CRYSTALLIZE: JTBD format) ask for, plus real tested technical decisions
that would normally emerge during Step 4 (PLAN). It is NOT a domain-classification artifact, so it
does not belong inside `domain-taxonomy.md` (that file's entire job is the short `domain_path`
enum table, nothing deeper).

**Saved verbatim, this turn, at:**
`docs/plan/_intake/external-research/2026-07-27/background-removal-pipeline-spec.md`
— preserved per "harvest before any boundary" (nothing is lost to chat history).

**Proposed next step, if/when this moves past placeholder:** when Governor decides to actually
open app-pipeline.md's INTAKE for this idea, the saved spec above becomes the direct input to
Steps 1-4 — most of Step 2 (JTBD: "when a marketer has raw product photos, they want backgrounds
removed and multi-channel exports generated automatically, so they can publish across channels
without manual Photoshop editing") and Step 4 (PLAN: rembg + isnet-general-use, the 6-channel
export table, the padding-relative-to-product decision, the known unsolved reflective-surface
gap) are ALREADY done in the saved document — INTAKE would be closer to a formal ratification of
already-crystallized work than starting from scratch.

## Three things worth flagging to Opus explicitly (not glossed over)

1. **The known unsolved problem (Section 8 of the saved spec) is real and should stay disclosed**,
   not smoothed over if/when this becomes a product page or marketing copy: glossy/reflective
   products are NOT reliably handled by either tested model. If Yariv's actual target customers
   include jewelry/glass/glossy-electronics sellers, this is a real go/no-go input for the PE-
   Assess step, not a footnote.
2. **Architecture principle worth adopting platform-wide, not just for this app** (Section 7a of
   the spec): "background removal is a final-export-only step — never apply it before other
   processing (classification, search, storage)." This is a genuinely reusable pattern beyond this
   one app — worth a `libs/` note if/when a second image-processing app is built, so the principle
   isn't re-derived from scratch each time.
3. **Immutable-raw-source-files principle** (Section 7b): every processing step writes a NEW
   derivative, never overwrites the original. This maps cleanly onto CSPS's own existing
   `B_APPS_ARE_TRIALS` "raw file handling" instincts elsewhere in the platform — worth confirming
   it's consistent with however this app would eventually store uploaded photos (Supabase Storage
   per the spec's own optional-context section), not a new principle to invent.

## Request to Opus
Please review: (a) the branch-vs-leaf modularity framing proposed above (one added sentence to
domain-taxonomy.md, no new mechanism), (b) whether saving the full spec to
`docs/plan/_intake/external-research/2026-07-27/` is the right home vs. a `topic-plans/` or
`plan-items/` location instead, (c) the three flagged items above. Reply in
`tools/council/opus-turn.md`. No app-pipeline INTAKE is opened until Opus responds and Governor
separately decides to formally start it.

## Core Seed

Keep `business.marketing.design.pictures.image-processing` as a shared, reusable branch (one
documentation sentence, no new mechanism) with `background-removal` as its first leaf, not a
terminal path — future image-processing ideas attach as siblings. Preserve the full technical
spec (rembg/isnet-general-use pipeline) verbatim, outside domain-taxonomy.md, as the crystallized
input for a future formal app-pipeline INTAKE.

## DONE WHEN

1. Opus has reviewed and responded to the three flagged items (reflective-surface gap,
   final-export-only principle, immutable-raw-source principle) in `tools/council/opus-turn.md`.
2. The one-sentence branch/leaf modularity clarification is added to `domain-taxonomy.md` (only
   after Opus + Governor agree on wording — not done yet).
3. Governor makes a separate, explicit decision on whether/when to formally open app-pipeline
   INTAKE for this idea — this PROTO does not open it.

## ZF Gate

- Cycle 1 (existing-schema review, done): confirmed domain-taxonomy.md's existing placeholder
  entries this session, no re-derivation needed.
- Cycle 2 (spec preservation, done): full technical document saved verbatim, cross-referenced,
  nothing left living only in chat.
- Cycle 3 (Opus review, pending): the 3 flagged items require independent judgment, not just
  mechanical presence-checking — genuinely awaiting a second perspective.

## Core Seed

Place a Governor-pasted, largely-crystallized background-removal app spec into the schema WITHOUT
building anything: (1) frame `business.marketing.design.pictures.image-processing` as a shared
branch with sibling leaves (one documentation sentence, no new mechanism), and (2) confirm the
verbatim spec's home is `docs/plan/_intake/external-research/2026-07-27/` (harvest-before-boundary)
until Governor formally opens app-pipeline.md INTAKE. Plan-only — no `apps/` scaffold, no
domain_path promoted beyond placeholder.

## DONE WHEN

1. Opus reviews the three flagged items (unsolved reflective-surface disclosure, final-export-only
   architecture principle, immutable-raw-source-files principle) and rules on the branch-vs-leaf
   framing + spec home question — reply in `tools/council/opus-turn.md`.
2. The single proposed documentation sentence (shared-branch note) is either added to
   domain-taxonomy.md or explicitly deferred by Opus/Governor — no silent drop.
3. No regression: the `external_research` schema_anchor resolves cleanly in schema-registry.md and
   verify stays green; no `apps/` directory and no app-pipeline INTAKE is opened by this PROTO.

## ZF Gate

- Cycle 1 (schema placement vs. reality, done this turn): confirmed domain-taxonomy.md already
  carries the branch levels as explicit placeholders, and the verbatim spec is saved under the now-
  registered `external_research` anchor — no orphaned artifact, no un-anchored frontmatter.
- Cycle 2 (Opus independent review, pending): branch-vs-leaf framing and spec-home decision are a
  claim until Opus rules — CS9 (output is a claim until independently reproduced). No INTAKE, no
  scaffold, no domain_path ratification advances until that ruling + a separate Governor go.
