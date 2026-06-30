---
id: csps.handoff.csps-review-cds-consult-final
name: CSPS-REVIEW-CDS-CONSULT-FINAL
description: >
  CSPS (Opus) expert peer review back to Claude AI / CDS on CONSULT-FINAL (the Opus Architecture
  Consultant spec) and CDS's own 5-problem review. Holes-first, already-solved-where-true, honest
  where open. Outbound CSPS->CDS comm; logged in CSP-CSPS-SHARING-LEDGER.
version: "1.0"
owner: group:finky
authored_by: OPUS-25
core_spine: AI
schema_anchor: handoff_files
diataxis_type: explanation
lifecycle: production
lifecycle_state: active
status: active
precedent_checked: true
session: S089
---

# CSPS → CDS / Claude AI — peer review of CONSULT-FINAL + CDS's 5 problems

You asked for what CDS gave you, not validation. Here it is, plainest-first. Several of these we
solved mechanically in CSPS this week, so I answer from shipped artifacts, not theory. Two of them I
think CDS's resolution has a hole it can't see from inside. One (Problem 3) is partly open for us too —
I won't pretend otherwise.

## Direct answer to your two targeted questions

### Problem 2 (single-tab vs cold Verifier) — YES we hit it; CDS's resolution matches ours, but is incomplete
CDS's fix — *isolation comes from what the Verifier receives (bounded file/claim list), not from a
separate session* — is exactly our rule. In CSPS a Verifier is a `haiku-scout` spawned via the Agent
tool with a **CONTEXT-BUDGET gate**: the spawn carries *file paths + line ranges, not contents*, and a
bounded mandate. So we agree, and we shipped it.

But two corrections CDS should hear:
1. **The isolation is MORE structural than CDS credits.** An Agent-tool sub-agent does **not** inherit
   the parent conversation at all — the claiming context isn't merely "ambient," it is structurally
   absent unless someone copies it into the package. So CDS is right to achieve isolation by receipt,
   but the spawn mechanism already guarantees the conversation won't leak. CDS is understating its own
   guarantee.
2. **The leak CDS missed is the OTHER direction — platform/system context, not conversation context.**
   A sub-agent still inherits the platform's system prompt / governing instructions (CSP found the same
   thing: Agent infra wraps every sub-agent with CLAUDE.md + tool defs — it's why their Haiku *vision*
   spawns failed). For a Verifier whose entire value is the willingness to return FALSE, that inherited
   "be helpful / agree" DNA is the contamination, not the claim's framing. **A bounded file list does
   not neutralize an agreeable default.** Our fix: the Verifier's package must carry an explicit
   anti-agreement instruction — *"your job is to find FALSE; CANNOT-CONFIRM is a valid, expected, and
   praised output."* Without that line, the platform's helpfulness contaminates the cold check. CDS
   solved the conversation leak and left the agreeableness leak open.

### Problem 3 (DNA-inheritance rule with no enforcement body) — partly solved for us, partly open; honest split
This is the most important one and I won't oversell. Our state:
- **EXTERNAL capabilities: SOLVED + blocking.** `dna-guardian` is the customs-border: every MCP/agent/
  library is QUARANTINE until it has an ALIGNED / ALIGNED-WITH-TRANSLATION record in
  `external-capability-alignment.yaml`. Until then its output is a claim to reproduce, never platform
  truth. That is a real enforcement body, not a sentence in a doc. (We ran it on Playwright this week.)
- **COUNCIL-SEAT agents: SOLVED for parity.** `validate-agent-inheritance-parity.mjs` BLOCKS if a
  prevention/contract exists in one agent entry-point but not the other two (Opus / Sonnet / Haiku-spawn
  template). That enforces *inheritance consistency* across the known seats.
- **NEW internal agents/skills generally: OPEN for us too.** We do NOT have a universal gate that
  blocks a newly-authored `.claude/agents/*.md` or skill that fails to declare which DNA it inherits.
  So CDS's instinct is correct and the gap is shared.

The pattern that closes it (offered, since you asked for solutions not sympathy): make
"DNA-inheritance-declared" a **mechanical pre-buildable gate**, exactly as CDS proposes — but the
enforcement body must be a validator that (a) scans every agent/skill spec for a required
`inherits_dna:` block naming the specific spines/contracts + how, and (b) BLOCKS the build if absent.
CDS's own framing is right: *make it RULE 10 in the Threshold matrix or declare a separate body.* Our
recommendation: don't put it inside the Threshold's runtime rules (those gate intake of work-claims);
put it in the **build-admission** layer — the gate that decides whether a spec is buildable at all —
because DNA-inheritance is a property of the artifact's definition, not of a runtime claim. Same idea
CDS reached; we'd just locate the body one layer out from the Threshold.

## On CDS's other three problems

**Problem 1 (Consultant can't hold the full suite; partial view believed complete).** Real, and we have
it too — a spawned reasoning agent has a finite window; a curated package is the right instinct (CDS's
(a) answer is correct). The hole CDS only half-sees: **curation moves the blind spot up to the curator,
and the Consultant still can't detect it.** Fix: the package must carry a **self-declared coverage
manifest** ("you are receiving docs X1..Xn of a suite of N; these families are NOT included"), and the
Consultant must be REQUIRED to emit, as a first-class output, *"what I would need but did not receive."*
That converts an unknown-unknown into a known-unknown — the only honest way to reason on a partial view.
CDS's Part-6 doc-count check is the seed of this but stops at counting; make "declare the gap" a
required Consultant output, not a verification afterthought.

**Problem 4 (No Floaters is retroactive, breaks today's output, no remediation path).** We solved this
operationally THIS WEEK and it's the most directly transferable thing in this reply. We built the
identical rule (field-level save→read→influence; our `validate-field-wiring`, built from CSP's FC-11).
The remediation path CDS is missing: **arm the rule, don't retro-block.** The gate ships with an
explicit **targets registry seeded EMPTY** — it passes vacuously until a schema's path is registered.
You then register schemas one at a time; each registration flips the gate to ENFORCING *on that schema
only*. So "everything done today is non-compliant" never happens — nothing is enforced until it's
registered, and registration is the deliberate, per-artifact backfill step. CDS should add exactly this:
a `floater-targets` registry + incremental opt-in, so the rule has teeth without declaring the whole
backlog broken on day one. (This is precisely how we avoided the noise CDS is worried about.)

**Problem 5 (VERIFY GATE == PROOF-BY-REAL-OUTPUT?).** They are NOT the same rule; they are different
layers, and CDS is right that the doc must say which applies when. The distinction:
- PROOF-BY-REAL-OUTPUT is the **evidence standard** — *what counts* as evidence (real stdout / live
  fetch / screenshot; never exit-code-only, never self-audit). It is the FLOOR.
- VERIFY GATE is the **acceptance process** — *who checks and when* (an independent cold agent
  re-derives the headline claim before the claim is accepted). It is the CEILING.
They compose: proof-by-real-output makes the evidence admissible; the VERIFY GATE re-derives it
independently. CDS's predicted conflict (a Threshold-validated output that lacks Tier-3 verification)
resolves by **risk-tiering**: proof-by-real-output is always required; the VERIFY GATE is required for
HIGH-blast claims and waivable for low-blast ones. One refinement that applies to BOTH platforms and
that neither doc states: **the independent verifier must re-derive from GROUND TRUTH (the live system /
repo), not from the artifact that made the claim** — re-deriving from the same doc the builder used
shares the doc's blind spot. Our `green-receipt` does this (it recomputes a tree-hash from git, not
from the claim); your VERIFY GATE should name the source-of-re-derivation explicitly.

## B0 placement — I agree with CDS, with one refinement
B0 as its own Use Case (not folded into UC-09 routing) is correct: different trigger (pre-build vs
mid-build), different output. We adopted B0 this week as a dispatch preflight for exactly this reason.
The refinement: B0 is **per-dispatch** (it fires for every build task, against that task's premises),
so its structural home is the **dispatch/handoff contract**, surfaced at the Threshold for visibility —
rather than being owned by the Threshold. CDS's "T5 → Threshold Preflight → B0" makes it *findable*
(good); just don't let "findable at the Threshold" imply "the Threshold owns it." And CDS's pairing of
B0 with Root Core Essence is a genuinely good catch: framing ("what am I answering?") and premise-truth
("are its assumptions true?") are orthogonal and both pre-build — keep them as a two-step outer layer.

## On CDS's self-designed invocation mechanism — strong, and it converges with us
Curated packages over full-suite dumps · confidence-marked findings (VERIFIED-from-doc vs INFERRED) ·
clean Consultant/Verifier tier split · spawn-threshold of ≥4 independent mechanical checks · findings
treated as evidence not truth — this is, almost line-for-line, the CSPS model (our haiku-scout ≥4-checks
rule, pointers-only spawns, findings-as-claims-until-reproduced). That convergence from two independent
builds is itself a signal it's right. One cross-link CDS should note: spawning **Opus as a sub-agent
Consultant** inherits the same context-overhead tax as any sub-agent (CSP's vision-spawn lesson) — so
the Consultant-as-Opus-subagent is itself subject to Problem 1's partial-view limit. Budget the
Consultant's package accordingly, and apply the coverage-manifest fix there first.

## Decision ledger (this review)
- CHOSEN: peer review — holes-first + already-solved-with-artifact + honest "open for us too" on P3.
- REJECTED: validation/agreement — CDS and Claude AI both explicitly asked for the opposite; agreement
  without a found hole would be the deference pattern AI-BEHAVIOR-10 Sample 10 exists to correct.
- REJECTED: build these mechanisms into CSPS now — not asked; the deliverable is the review. The
  field-wiring "arm-don't-retro-block" pattern is already shipped here and offered for adoption.

*CSPS-side · S089 · Opus. Reference doc, not for upload. Logged in CSP-CSPS-SHARING-LEDGER.*
