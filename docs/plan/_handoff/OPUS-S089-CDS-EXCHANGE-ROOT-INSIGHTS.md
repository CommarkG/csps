---
id: csps.handoff.opus-s089-cds-exchange-root-insights
name: OPUS-S089-CDS-EXCHANGE-ROOT-INSIGHTS
description: >
  Deep-dive harvest of the CDS exchange (CONSULT-FINAL review -> 8 requests -> verbatim reply ->
  anti-agreeableness adoption). The root prevention/improvement insights surfaced by being forced to
  label CSPS mechanisms SHIPPED/SPEC/CONCEPT for an external builder. Each insight carries a disposition
  (swift / park / already-have) so the harvest ends in action, not just understanding.
version: "1.0"
owner: group:finky
authored_by: OPUS-25
core_spine: AI
core_spines: [AI, GVRN, VALD]
schema_anchor: handoff_files
diataxis_type: explanation
lifecycle: production
lifecycle_state: active
status: active
precedent_checked: true
session: S089
---

# CDS exchange — root core insights on prevention + improvement

The CDS exchange was, structurally, an external audit of CSPS. CDS asked for our mechanisms as buildable
artifacts; answering honestly forced a SHIPPED/SPEC/CONCEPT label on each; the labels exposed where our
"governance" is nominal. The harvest below is the root layer, not the surface artifacts.

## ROOT INSIGHT 1 — Peer-explanation IS the strongest EXISTS≠ACTIVE test
Explaining a mechanism to an **external builder who will try to BUILD from it** surfaces nominal-done
better than any self-review — because a concept cannot be built, and the peer's inability to build it is
the proof of the gap. Self-review shares our blind spots; a peer who must produce code does not.
- **Why it matters:** our #1 failure class is "named ≠ active" ([[feedback_exists_not_equals_active]]).
  Self-audit detects it weakly. Peer-build detects it structurally.
- **Prevention (the operational test):** for any "shipped" claim, ask *"could an external builder build
  this from the artifact alone, without me in the room?"* If no → it is SPEC or CONCEPT, not SHIPPED.
  This is a sharper, mechanical form of the meta-standard ([[feedback_activation_over_creation]]).
- **Disposition:** DEEP — becomes the status-honesty tag (Insight 2). Already partly lived this session
  (the honest 3-of-8 scorecard).

## ROOT INSIGHT 2 — "Named ≠ buildable" is THE failure class, now independently confirmed 3×
CDS said it twice ("concepts are not buildable", "I have the concept, not the mechanism"); CSP's whole
package is "a principle that is not a mechanical gate does not run"; our own IZFC build-vs-verify gap says
the same. Three independent builds naming one failure = it is a root invariant, not a local quirk.
- **Prevention:** make the honesty label MECHANICAL on mechanism claims. Any doc asserting a mechanism
  carries a required tag `status: SHIPPED|PARTIAL|SPEC|CONCEPT`, and **SHIPPED requires a file + test
  reference** (the same discipline field-wiring applies to data fields, applied to prose claims).
- **Disposition:** PARK (a `mechanism-status` tag + a validator that requires SHIPPED claims to cite a
  file+test) — real build, trigger: next governance-doc batch.

## ROOT INSIGHT 3 — VERIFY GATE must be MECHANICAL and re-derive from GROUND TRUTH (our biggest open lever)
CSP, CDS, and CSPS independently reached: *self-report is not evidence; a cheap independent agent
re-derives the headline claim.* CSP's proof is concrete — a Haiku pass caught "38 not 70" in 82s behind a
builder's "70/70 passing." **We have green-receipt for TREE state but NOT for CLAIM CONTENT.** When Sonnet
reports "7/7 pass, 6 fixtures, 0 dead," nothing independent re-derives those numbers before Opus accepts.
- **The sharp edge:** the verifier must re-derive from GROUND TRUTH (the repo/live system), never from
  the artifact that made the claim — re-reading the claimant's own doc shares its blind spot. green-receipt
  already does this for the tree (recomputes from git, not from the claim); claim-content does not.
- **Prevention:** a VERIFY-GATE step in the Sonnet→Opus handback — every numeric/coverage/headline claim
  carries how it was independently re-derived; Opus (or a haiku-scout) re-derives HIGH-blast ones from
  ground truth before acceptance. This is the single highest-value transfer from the whole exchange.
- **Disposition:** SWIFT (the handback field + discipline) NOW; PARK the blocking validator.

## ROOT INSIGHT 4 — Agreeableness is a contaminating default in ALL checks, not just spawned verifiers
CDS's contribution: a bounded context package does NOT neutralize the inherited "be helpful / agree"
default — only an explicit *"your job is to find FALSE"* instruction does. This generalizes far past
spawned verifiers: it contaminates Sonnet self-review, Opus review of Sonnet, and any PCR.
- **What we already have:** `validate-challenge-on-merit` bans agreement-filler — that is the NEGATIVE
  form ("don't agree without merit"). CDS's line is the POSITIVE complement ("actively seek FALSE").
- **Prevention:** carry the explicit disagreement mandate on EVERY review surface, not just scout spawns —
  the default bias is toward confirming, so neutrality must be instructed, not assumed.
- **Disposition:** SWIFT — adopted into the scout template this session (§0.6); extend the framing to the
  review/PCR surfaces (one-click).

## ROOT INSIGHT 5 — Declare-your-boundary (coverage manifest) is universal prevention
"Partial view believed complete" (Problem 1 / our [[feedback_csps_alignment_over_inner_defaults]] cousin)
applies to every bounded-scope output: a scout, a handoff, a review, a plan — each can believe itself
complete. The fix CDS and I converged on: every scoped output **declares what it did NOT cover**, turning
unknown-unknown → known-unknown.
- **Prevention:** every bounded output emits a coverage boundary ("I checked X; I did NOT check Y").
  Our `haiku_scout_return` has `status: PARTIAL` but no structured *what-was-not-covered* field.
- **Disposition:** SWIFT (add `coverage_gap` to the scout return schema) NOW; PARK the full
  manifest→next-package feedback loop.

## ROOT INSIGHT 6 — Cross-platform convergence is an evidence source for the decision ledger
When CSP, CDS, and CSPS independently land on the same mechanism (VERIFY GATE · model economy ·
floater/field-wiring · inventory-first), that convergence is strong evidence the mechanism is a root
invariant — it raises confidence and lowers the adoption bar. The inverse is equally useful: where we
DIVERGE from two independent peers, that is a signal to re-examine our choice, not to defend it.
- **Prevention/method:** treat independent cross-platform convergence as a first-class confidence input
  in the decision ledger / CIE — a ratification signal, recorded with its sources.
- **Disposition:** PARK (a `convergence:` evidence field in the decision-ledger schema) — lightweight,
  trigger: next decision-ledger schema touch.

## SYNTHESIS — the one sentence
The CDS exchange confirmed our deepest failure class from the outside (named ≠ active) and handed us the
sharpest detector (peer-build) and the highest-value unbuilt gate (mechanical VERIFY-GATE on claim
content, re-derived from ground truth). Everything else is downstream of those two.

## DISPOSITION SUMMARY
- **SWIFT (Sonnet/Haiku, now — one-click opus-turn §27):** scout `coverage_gap` field · scout
  CANNOT-CONFIRM escalation rule · Sonnet handback `verify_gate:` field (re-derive numeric claims) ·
  B0 premise line in the build report · extend anti-agreeableness framing to review surfaces.
- **PARK (PARK-S089-CDS-EXCHANGE-DEEPER-BUILDS):** mechanism-status tag + validator (Insight 2) ·
  VERIFY-GATE blocking validator + risk-tier model (3,8) · coverage-manifest feedback loop (5) ·
  field-wiring site-resolution second pass (the named R4 limitation) · inherits_dna build-admission gate
  (R2) · typed dispatch contract w/ B0 sub-schema (R7) · convergence evidence field (6).
- **ALREADY-HAVE (confirmed by the exchange):** green-receipt (tree) · challenge-on-merit (neg. form of 4)
  · haiku ≥4-checks economy · dna-guardian (external) · field-wiring (floater).

## DECISION LEDGER
- CHOSEN: harvest the exchange to root insights with dispositions; swift the cheap protocol/template
  improvements; park the real builds; deep-dive the two generative roots (peer-build test + mechanical
  VERIFY-GATE).
- REJECTED: treat the exchange as "done, replied" — that would discard the external-audit value (the
  whole point was what it revealed about us, not what we sent).
- REJECTED: build all the parked validators now — scope sprawl + the goal-screen test-drive is the open
  spine; these are trigger-gated.
