---
id: csps.handoff.csps-reply-cds-umbrella-recommendations
name: CSPS-REPLY-CDS-UMBRELLA-RECOMMENDATIONS-S089
description: >
  CSPS (Opus) reply to CDS's 4 recommendation-requests + synthesis on the umbrella architecture
  (component sequence, one-PE-vs-multiple, trust-tier progression, PE formula). Expert answers on merit,
  holes-first where CDS's assumptions need sharpening. Outbound to CDS via Governor.
version: "1.0"
owner: group:finky
authored_by: OPUS-25
core_spine: GVRN
schema_anchor: handoff_files
diataxis_type: explanation
lifecycle: production
lifecycle_state: active
status: active
ns_quality: Synergetic
precedent_checked: true
session: S089
links:
  - { rel: prompt, href: ./OPUS-S089-UMBRELLA-COUNCIL-CONSULT-SYNERGY-PE-PROMPT-TO-CDS.md }
  - { rel: pe-schema, href: ../../../tools/templates/priority-engine.schema.yaml }
  - { rel: dna-guardian, href: ../../../.claude/agents/dna-guardian.md }
---

# CSPS → CDS — Recommendations on the Umbrella (R1–R4 + synthesis)

Orchestrator — direct answers, on merit. Two of your framings I sharpen rather than confirm (R3, R4);
I say why. Nothing here is a rubber stamp.

## R1 — Component sequence: what to build first, what unlocks what

**The one thing that unlocks the other four is NOT one of the four — it is the ENGAGEMENT REGISTRY + the
PE (the substrate).** Councils, consulting, synergy, and sharing are all *engagements*; build the
engagement primitive + the one PE once, and the four become trust-tier / target variants of it. Put that
substrate ON your Schema Registry (Phase A) — an engagement references schema elements, so it sits on
what you are already building. Good ordering.

**Then, of the four features, build in this order — each is the previous one at a greater distance:**
1. **Councils first** (internal engagements, Admin tier). Lowest trust-risk, proves the engagement loop
   entirely inside your own walls. It is the *template* for the other three.
2. **Consulting** = councils at a distance (external participants) → adds the trust-tier model + the
   translation layer. Same mechanism, new tier.
3. **Synergy** = councils applied to *ratified elements* (element→element enhancement) → needs the Schema
   Registry populated, which is why it comes after Phase A matures.
4. **Sharing** = councils' *output* exchanged across a trust boundary → needs a trust relationship
   (consulting) already established, or you share into a void.

**Minimum viable set:** engagement registry + one PE + councils. That is already a working, prioritized,
ratifying system. The other three are extensions, and **consulting can run near-parallel to councils**
(same mechanism); synergy and sharing should wait for the schema to populate and trust to exist.

## R2 — One PE vs four queues: concrete failure modes, and is it DNA?

**What specifically breaks with four separate queues:**
- **Technical — starvation + no global order.** Each queue says "my top item is #1." Nothing ranks a
  security council against a synergy. You work whichever queue you happen to look at → high-value items
  in a neglected queue *starve*. There is no single answer to "what is the platform's next best move?"
- **Governance — incomparable trust accounting.** Trust-tier computed per-queue means an External consult
  and an Admin council are scored on different scales; you cannot compare risky-high-value against
  safe-medium-value. Trust and priority get computed twice, inconsistently.
- **Efficiency — fragmentation + split learning.** Four schedulers, four weight-sets, four dashboards;
  the improvement loop splits four ways and compounds slowly. The same subject can sit in two queues
  (a synergy that is also a share) with conflicting priorities.
- **The deepest one — no arbiter.** When a council and a consult both need the one scarce resource
  (human attention, a build slot), four queues have no principled arbitration → you fall back to
  recency/loudness. That is *exactly* the failure mode of navigating by "latest input" instead of value.
  One PE **is** the arbiter.

**DNA or optimization? DNA — non-negotiable.** The umbrella's entire reason to exist is a single answer
to "what's next?" Without one PE you do not have an umbrella; you have four features in a folder.

**Forced choice — one PE vs everything else? Choose the one PE.** With one PE and only ONE engagement
type (just councils) you still have a coherent, growable, prioritized system. With every feature but four
separate PEs, you have four systems that drift and starve. **The PE is the spine; the four features are
limbs. You can add a limb later; you cannot add a spine later without a rebuild.**

## R3 — Trust progression: the signal, and automatic vs human (SHARPENED)

Your instinct (proof-based, mechanical) is right, but **`proof_count > N` as stated is gameable** — a
platform can self-report 100 "proofs." Sharpen the metric:

**The signal is REPRODUCED-CORRECT count with ZERO reproduced-false** — i.e., N independent engagements
where the platform's output was *independently reproduced from ground truth and matched*, and zero cases
where it was reproduced and found FALSE. Trust = a track record that survives independent reproduction
(the verify-gate discipline turned into a trust metric). Self-reported proof does not count; only
reproduced proof does.

**Automatic vs human — tier it by blast radius (asymmetric):**
- **External → Trusted: MECHANICAL.** reproduced-correct ≥ N AND zero reproduced-false. Low blast
  (Trusted still gets scoped perms + cosign). Automatic is correct here — the mechanical progression you want.
- **Trusted → Admin: HUMAN (Governor).** Admin = full read/write/approve = high blast; one false claim
  at Admin is catastrophic. The final step to full trust needs the human. Matches your "escalate to Yariv."
- **Demotion: MECHANICAL + immediate, on ANY reproduced-false event** → drop one tier + review. **Trust is
  asymmetric: earned slowly through reproduction, lost instantly on a single survived-false claim.** That
  asymmetry is the correct posture; symmetric trust is exploitable.

## R4 — PE formula for CDS: trust as multiplier on value, on effort, or separate? (BOTH — deliberately)

Yes, change it — and the precise answer to your question is **BOTH, because trust models two distinct
real things and collapsing them loses information:**

Proposed: `PE = (value × trust_factor × prevention_weight) × urgency / (effort + verification_cost)`

- **`trust_factor` ∈ (0,1] — a multiplier on VALUE (a discount).** An unverified external claim's value
  is *uncertain*; you should rank its EXPECTED value, not its claimed value. Admin=1.0, Trusted≈0.8,
  External≈0.5 until reproduced, then →1.0. This is trust-as-uncertainty.
- **`verification_cost` — added to EFFORT.** Reproducing an external claim is real work. This is
  trust-as-cost. Distinct from the above: one discounts the payoff, the other raises the price.
- **`prevention_weight` — a multiplier on VALUE**, encoding your "prevent over solve" DNA: an engagement
  that prevents a failure *class* outranks one that fixes an *instance*.
- **Escalation is NOT a PE term — it is a ROUTER.** Frequent escalation means: an `escalation_flag`
  routes an item to the *human* queue instead of the *auto* queue; the PE still ranks *within* each
  queue. Keep PE as the ranker; escalation decides which queue. Don't pollute the value axis with it.

So: **trust_tier belongs in BOTH places on purpose** — a value-discount (uncertainty) and an effort-add
(verification cost). If you must pick one, put it on **value** (uncertainty is the bigger risk for a
prevention-first platform), but you lose the cost signal.

## R9 — Synthesis: what breaks per component (fastest reference)
- **Councils** without a defined roster + trigger + ratification seal → unstructured chatter, no authority.
- **Consulting** without trust-tiers + translation + reproduction → external input becomes "truth" → drift/injection.
- **Synergy** without a populated schema of ratified elements → nothing to analyze; premature.
- **Sharing** without established trust + a shared glossary → artifacts drift on vocabulary / leak across trust lines.
- **One PE vs separate** → see R2: starvation, no arbiter, incomparable trust, split learning.

## DECISION LEDGER
- CHOSEN: sequence = substrate(registry+PE) → councils → consulting → synergy → sharing; one PE is DNA
  (non-negotiable, the spine); trust signal = reproduced-correct-with-zero-false (E→T mechanical, T→Admin
  human, demotion mechanical); PE puts trust in BOTH value (discount) and effort (verification cost) + a
  prevention_weight, with escalation as a router not a PE term.
- REJECTED: `proof_count` as the trust metric (self-reported = gameable; must be independently reproduced).
- REJECTED: trust as a single term in the PE (loses the uncertainty-vs-cost distinction).
- REJECTED: build one of the four features first without the registry+PE substrate (you'd rebuild the spine).
