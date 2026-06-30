# Provenance + Triage — EXT-20260630-001 (CSP → CSPS share, S344+S346)

## Source
- **From:** CSP (Core Sights Platform / CsMSE), sessions S344 + S346 collaboration package.
- **Received:** 2026-06-30, chat-paste (8 documents), relayed by Governor.
- **Governor's words (verbatim):** "go over several file - you might have some already - but go over
  them, save raw files and extract and part or swift and pay attention so we go back to what we did
  once finished. enhance what we have."
- **Raw:** [raw.md](./raw.md) (8 docs, verbatim, unicode-normalized).

## Step 4 — Injection scan (manual, pattern-based)
- risk_profile: **low** (sibling-project technical docs; trusted channel; no executable payload run).
- Scanned for: "ignore previous instructions", "system prompt:", "you are now", invisible unicode,
  base64 blobs, hidden HTML. **NONE found.** Code blocks are illustrative Python/JSON, not executed.
- **scan-passed** 2026-06-30. External content treated as a CLAIM to reproduce, never platform truth
  (dna-guardian discipline) — nothing here informs a privileged action without independent rebuild.

## Step 5 — TRIAGE (park-or-swift), per pattern, on merit vs what CSPS already has
Disposition ∈ { ALREADY-HAVE · SWIFT-NOW · PARK+trigger · NOTE-ONLY }. CSPS is strong at designing
these; the bar is mechanical + measurable (our meta-standard). Most of this package CONVERGES with
existing CSPS mechanisms — flagged honestly so we ENHANCE, not fork.

| # | CSP pattern | CSPS existing | Disposition |
|---|---|---|---|
| 1 | **Floater FC-11** — every field declares save→read→influence | `validate-field-wiring.mjs` (built S089 from the SAME CSP rule) — now ENFORCING on goal-record (7/7) | **ALREADY-HAVE + BUILT** (convergence proof) |
| 2 | **VERIFY GATE** — cheap independent agent re-derives a handback's headline claims before "done" is accepted | green-receipt + re-run-is-proof + haiku-scout + CS9 spot-check exist, but NOT a *required handback step* | **SWIFT-NOW** (fold into collab doc §4 as a handback rule) |
| 3 | **B0 VERIFY-PREMISES** — dispatch preflight: builder lists+verifies assumptions before building; fail→STOP | pre-flight audit + IZFC build-vs-verify 5-Q exist, scattered; not a dispatch element | **SWIFT-NOW** (add B0 to collab doc dispatch shape) |
| 4 | **Proof-by-real-output** — done = stdout/curl/screenshots, never self-audit/exit-code-only | DONE=activation-proven + planted-violation proofs + Governor screenshot | **SWIFT-light** (name it in collab doc §4) |
| 5 | **Scope declaration in handback** — declare any extra work beyond dispatch | completion-before-new + no-wild-implementation | **SWIFT-light** (add to collab doc handback) |
| 6 | **Inventory-first 3-way verdict** (ENHANCE / CLARIFY+RENAME / CREATE-NEW) | check-existing-first + no-invention-without-precedent + dna-guardian 3-verdict + naming policy | **ALREADY-HAVE** |
| 7 | **3-tier model economy** (cheapest capable model; judgment never cheap) | haiku-scout ≥4-checks routing + CSP-CSPS collab doc §1/§3 | **ALREADY-HAVE** |
| 8 | **Preserved-state gate** — UI lock + HTTP 409 on mutating a ratified record + unlock-with-reason + audit log + visual golden baseline | council seal invariants (doc-only) + goal-record `ratification_state` | **PARK** → trigger: CSE/app mutation endpoints OR goal-record closure build |
| 9 | **arch/ model-routing registry** — SSoT JSON: task→model + cost + 5 collaboration modes + routing rules | model economy is doctrine, not a single routing SSoT | **PARK** → trigger: CSE multi-app model assignment (high value there) |
| 10 | **Haiku vision via Agent tool fails silently** ("prompt too long", 0 tokens) — use Anthropic SDK direct + truststore (Windows SSL) | haiku-scout uses Agent tool (text only) | **NOTE-ONLY → memory** (concrete landmine; save as reference) |
| 11 | **4-layer prevention** (PLAN/IMPLEMENT/CHECK/SIMULATE per failure class) | create=prevent mirror + FSE 5-surface + simulation | **ALREADY-HAVE** |
| 12 | **Measurement discipline** — freeze-before-enrich, quarantined holdout, temp=0≠deterministic (noise band N≥3), median-of-N, self-audit≠truth | UNIFY-BEFORE-ENRICH (P-A) | **PARK** → trigger: any CSPS AI-accuracy measurement (classifier/eval) |
| 13 | **Label-map completeness guard** — every enum value has a curated UI label or commit fails | frontmatter closed-enum drift awareness; no enum→UI-label guard | **PARK** → trigger: first CSPS enum-driven UI surface |
| 14 | **Flow-completeness checklist** (Affordance→Action→Feedback→Result→Inverse→Empty-state) + consolidate-vs-drill + "lying UI" (close only after server confirms) | page-completeness M-47 + state-completeness UX law | **PARK** → trigger: canonical-process UX checklist (T7); "lying UI" relevant to goal-screen SIGN |
| 15 | **Severity as visual hierarchy** (soft/strong mismatch; color+border; colorblind) | UI principles (6) | **PARK** → trigger: UI canvas (T8) |
| 16 | **CSPS-side sharing/absorption ledger** (CSP keeps SHARING_LOG with absorption status + ABSORPTION RESPONSE blocks for comms 001/002) | CSPS has _intake pipeline but no CSP-collaboration comm ledger | **SWIFT-NOW** (the collaboration infrastructure + the "go back" tracker) |
| 17 | **5 questions CSP wants answered** (measurement-vs-learning, derived-constant SSoT, server-confirm gating, two-stage completion, post-compact recovery) | we have answers to several (post-compact = oneclick+green-receipt; SSoT discipline) | **PARK** → obligation: answer in a CSPS→CSP reply package |

## Decision ledger
- **CHOSEN:** follow the intake protocol's mechanical SPINE (ack · EXT-ID · save raw · scan · ledger ·
  surface) + a consolidated park-or-swift triage; SWIFT the 4 cheap high-value collaboration deltas
  (VERIFY-GATE, B0, proof-real, scope-decl) by ENHANCING the existing CSP-CSPS collab doc; SWIFT the
  CSPS-side absorption ledger; PARK the product-layer items with triggers.
- **REJECTED:** full Step-5 per-leaf fan-out (dozens of context files) — most insights are ALREADY-HAVE
  so per-leaf notes would be redundant; Governor asked for "part or swift" triage, not full fan-out.
  Deferred-by-design; this triage table IS the routing record. State = `triaged`.
- **REJECTED:** adopt the package wholesale — 6 of 17 items already exist in CSPS, more mature
  (ENHANCE-NOT-FORK); blind adoption = treating external content as truth + new-over-active.
- **REJECTED:** build new validators for the PARK items now — they are product/CSE-layer, gated on
  triggers that have not fired; building ahead = ratified-but-unbuilt limbo + scope sprawl (CSP doc-03's
  own lesson). Parked with triggers instead.

## Thread anchor (Governor: "pay attention so we go back to what we did once finished")
ACTIVE MANDATE on return = the **goal-screen TEST-DRIVE** (https://csps-playground.vercel.app,
hard-refresh). Field-wiring C1-C3 DONE + green; Sonnet's screen is frozen awaiting the Governor's
felt verdict. This absorption is a side-quest; the goal-screen gate is the spine to return to.
