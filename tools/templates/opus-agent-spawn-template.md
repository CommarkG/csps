---
id: csps.tools.templates.opus-agent-spawn-template
name: opus-agent-spawn-template
description: >
  Spawn template for Opus-tier Agent() dispatches performing BOUNDED BUILD work
  (Sonnet-tier subagents) from a persistent Opus director tab — the counterpart to
  tools/templates/haiku-spawn-template.md (SCAN/DETECT/RETURN work). Where Haiku scouts
  never decide, an Opus-agent dispatch delegates a BOUNDED IMPLEMENTATION unit (files
  created/edited, a proof produced) while the PERSISTENT tab retains the sealing write
  (stage+verify+commit) — the two Opus tabs share one physical git index, so only the
  persistent tab may write it. Created: S089. Composes with B_SPAWN_TRIGGER_GATE.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, AI]
schema_anchor: tools_templates_meta
template_id: opus-agent-spawn-template
template_version: 1.0
applicability_trigger: >
  Any Agent() call dispatched from a persistent Opus director tab for BOUNDED BUILD work
  (Sonnet-tier: new files, edits, wiring, a fixture proof), as opposed to Haiku scan work
  (grep/inventory/pattern-detection — use haiku-spawn-template.md for that).
tags:
  - domain:ai
  - domain:governance
  - type:template
  - audience:ai-agent
  - maturity:stable
session: S089
links:
  - { rel: parent, href: ./ }
  - { rel: haiku-counterpart, href: ./haiku-spawn-template.md }
  - { rel: dispatch-log, href: ../data/opus-dispatch-log.yaml }
  - { rel: behavioral-contract, href: ../../docs/plan/pillar-0-governance/behavioral-contracts/B_SPAWN_TRIGGER_GATE.md }
  - { rel: sibling-contract, href: ../../docs/plan/pillar-0-governance/behavioral-contracts/B_CONSENSUS_BEFORE_CODE.md }
scope_level: S1
---

# Opus-Agent Spawn Template
## The Sonnet-tier BOUNDED BUILD counterpart to haiku-spawn-template.md

> **Every Opus-tier Agent() dispatch for BUILD work MUST include this template.** Haiku scouts
> SCAN → DETECT → RETURN; an Opus-agent dispatch BUILDS a bounded unit and returns a verdict +
> seal-content for the persistent tab to write. The dispatched agent NEVER stages, commits, or
> pushes — that is the persistent tab's job, exactly because the two Opus tabs share one physical
> git index and a race there mis-attributes work. This template composes with (does not duplicate)
> haiku-spawn-template.md's §0/§0.5/§1.5 gates, which are actor-agnostic (fire for every `Agent()`
> call regardless of which template invokes them).

---

## §0 — BOUNDARY CROSSING UNDERSTANDING BLOCK (REQUIRED — BLOCKING)

**Every Opus-agent spawn prompt MUST start with this block**, same Type-B shape as
haiku-spawn-template.md §0.5. Without it, `pre-tool-use-agent-alignment.sh` BLOCKS the spawn
(exit 2) — this hook is actor-agnostic; it fires for every tab (Opus AND Sonnet) calling
`Agent()`, not just Haiku spawns.

```
BOUNDARY CROSSING — Type B (AI→subagent):
I understand the request as: [Layer 3 intent — what the build unit is for]
I will produce: [specific deliverables — files, a proof, a structured report]
This serves: [platform goal / CSPS mandate this build unit closes]
```

**Immediately followed by the CONTEXT-BUDGET attestation line (REQUIRED, BLOCKING gate — same
3-question pre-spawn gate as haiku-spawn-template.md §1.5: is a spawn warranted / is the tool
surface restricted / are pointers passed instead of payloads):**

```
CONTEXT-BUDGET: spawn-warranted | tools-restricted | pointers-only
```

**Note on §0.6 VERIFIER MODE:** if this dispatch is re-deriving/verifying another agent's DONE
claim rather than building fresh, also include haiku-spawn-template.md's §0.6 anti-agreeableness
line. Do not duplicate the full haiku template — reference it.

---

## §1 — Spawn template (copy + fill) — ROLE / CONTEXT / TASK / CONSTRAINTS / OUTPUT

```
[BOUNDARY CROSSING block from §0 goes here, followed by CONTEXT-BUDGET line]

**ROLE:** CSPS Sonnet BUILDER agent, spawned from the persistent Opus director tab.
Work in repo root: <REPO_ROOT>

**SCOPE TIER (declare one — drives B_SPAWN_TRIGGER_GATE):**
constitutional | corespine | cross-cutting | depth-ge-4 | trivial-reversible

**CONTEXT:** <1-3 sentences — what mandate/plan/gap this build unit closes, what has already
been decided (link the consensus-queue.yaml / decision-ledger entry if applicable — a BUILD
dispatch is not a substitute for B_CONSENSUS_BEFORE_CODE; the choice must already be confirmed>

**TASK:** <the bounded deliverable(s) — be as explicit as the haiku template's Scan Task section:
exact file paths, exact wiring surfaces, exact proof required>

**CONSTRAINTS (CRITICAL — the shared-index hazard):**
- DO NOT `git add`, DO NOT `git commit`, DO NOT `git push`. Create/edit files in the working
  tree ONLY. The persistent tab performs the sealing write after verify-gating the return.
- Do NOT run the full `pnpm verify` / `node tools/verify.mjs` to completion if it risks exceeding
  the spawn's time budget — run the specific validator(s) relevant to this task instead.
- <task-specific constraints — e.g. "mirror X exactly, do not invent a new shape">

**OUTPUT — explicit done-signal:** <name the exact artifact/proof that means this task is
COMPLETE, e.g. "a FAIL→PASS fixture showing exit 1 then exit 0" or "node -c passes + single
validator run shows blocking=0">
```

---

## §2 — Curated-package pointer checklist (pointers, not payloads)

Same discipline as haiku-spawn-template.md §1.5 rule 3 ("pass POINTERS, not payloads") — a
director MUST hand the dispatched agent a bounded reading list, never the corpus:

- [ ] **Pattern-to-mirror file(s):** repo-relative path(s) + (if large) a line range — the file
      whose shape the new work must copy (e.g. `tools/validators/validate-consensus-before-code.mjs`)
- [ ] **Registry/data files to read or extend:** repo-relative path(s), NOT their full contents
      pasted into the prompt
- [ ] **Wiring surfaces to touch:** exact file + the adjacent block/entry to mirror (e.g. "insert
      next to `consensus_before_code` in `tools/verify.mjs`")
- [ ] **Behavioral contract to read (if extending one):** repo-relative path — never paste the
      contract text; the agent reads it directly
- [ ] **Convention documents:** e.g. `BLOCK-TEST-CONVENTION.md` — cite it by path, let the agent
      load it, do not summarize it into the prompt (summaries drift from the source)

**Never include:** the full text of any file >~50 lines, the governance corpus, or prior chat
history reformatted into the prompt. If the task needs more than ~2KB of task text, it is
under-scoped — split it or hand over fewer, more precise pointers.

---

## §3 — Coverage manifest (what the agent must return so its work is verify-gated)

The dispatched agent's return MUST include, so the persistent tab can verify-gate from ground
truth rather than trust the summary:

1. **Files touched** — exact repo-relative paths, marked `[new]` / `[edit]`
2. **Commands run + their REAL output** — not paraphrased; paste the actual terminal output for
   every claim (`node -c <file>`, a validator run, a fixture script run, a generator run)
3. **FAIL→PASS proof** (if the task is a gate/validator) — planted-defect → exit 1, then
   clean/fixed → exit 0, per `BLOCK-TEST-CONVENTION.md` RULE 1
4. **Self-declared gaps** — anything not finished, any assumption made, any place the canonical
   pattern was unclear. A gap admitted honestly is not a failure; a gap papered over is.

**LOGGING STEP (mandatory — feeds B_SPAWN_TRIGGER_GATE):** the persistent tab, upon receiving
this return, MUST log the dispatch to `tools/data/opus-dispatch-log.yaml`:

```yaml
- session: "S0NN"
  dispatch_id: "<short slug for this dispatch>"
  scope_tier: constitutional | corespine | cross-cutting | depth-ge-4 | trivial-reversible
  task: "<one-line task description>"
  verdict_recorded: false   # flips true only once the persistent tab has reviewed + sealed
  opus_verdict_ref: ""      # filled with a pointer once verdict_recorded flips true
```

A HIGH-SCOPE dispatch (constitutional / corespine / cross-cutting / depth-ge-4) left with
`verdict_recorded: false` BLOCKS `pnpm verify` via `validate-spawn-trigger.mjs` until the
persistent tab records its verdict — this is the mechanism, not a bug: the seal is not supposed
to happen silently.

---

## §4 — Opus return format + sealing-write resolution

The dispatched agent returns a **verdict + seal-content** package; it does **not** write the
seal itself.

```
WHO:     Sonnet BUILDER agent → persistent Opus director tab
WARRANT: [MEASURED] <what was actually run/observed this dispatch>
ACTION:  see COVERAGE MANIFEST above | escalate ambiguity to Opus, do not guess
```

Followed by, structured per §3's 4 items, plus:

5. **T3 memory-stub content** (if the dispatch produced a durable lesson) — the agent provides
   the content; it does NOT write to the memory directory itself (same non-sealing-write
   discipline as the commit).
6. **SEAL-CONTENT** — a proposed one-paragraph commit-message body. The persistent tab writes the
   actual commit; the agent only proposes the language.

**Sealing-write resolution (why the persistent tab, never the agent):** the two Opus tabs in a
one-tab-operating-discipline session share one physical git index. If an ephemeral agent stages
or commits, it races whatever the persistent tab is doing concurrently and can mis-attribute or
silently drop work. The persistent tab is the single writer: it (a) reads the agent's return,
(b) re-derives the claims against ground truth (re-runs the cited commands — memory of a prior
run is not evidence, per B_VALIDATE_BEFORE_ASSUME), (c) logs the dispatch verdict in
`opus-dispatch-log.yaml`, then (d) performs the atomic stage+verify+commit. This IS the pattern
`B_SPAWN_TRIGGER_GATE` mechanically encodes — not merely documents.

---

## §5 — Enforcement

- **T1 (existing, not duplicated):** `pre-tool-use-agent-alignment.sh` already BLOCKS any
  `Agent()` spawn missing the BOUNDARY CROSSING block or the `CONTEXT-BUDGET:` line, for every
  actor (Opus and Sonnet alike). This template does not need its own copy of that hook.
- **T2:** `tools/validators/validate-spawn-trigger.mjs` — BLOCKING if a HIGH-SCOPE dispatch this
  session lacks a recorded verdict, or if HIGH-SCOPE governance commits exist this session with
  zero `opus-dispatch-log.yaml` activity. Registered in `tools/verify.mjs` as `spawn_trigger`.
- **T3:** `docs/plan/pillar-0-governance/audit-runner.md` slug `spawn-trigger`.
- **T4:** `docs/plan/pillar-0-governance/behavioral-contracts/B_SPAWN_TRIGGER_GATE.md`.

---

## §6 — Composition

- [haiku-spawn-template.md](./haiku-spawn-template.md) — the Haiku-tier counterpart (SCAN work);
  this template's §0/§0.5/§1.5-equivalent gates are the SAME actor-agnostic hook, referenced not
  duplicated
- [B_SPAWN_TRIGGER_GATE.md](../../docs/plan/pillar-0-governance/behavioral-contracts/B_SPAWN_TRIGGER_GATE.md) — the behavioral contract this template implements
- [B_CONSENSUS_BEFORE_CODE.md](../../docs/plan/pillar-0-governance/behavioral-contracts/B_CONSENSUS_BEFORE_CODE.md) — sibling gate: a BUILD dispatch presumes the CHOICE was already
  confirmed through this mechanism; a spawn is not how you reach consensus, it's what happens
  after
- [B_IMPLEMENTATION_WIRING_CYCLE](../../docs/plan/pillar-0-governance/behavioral-contracts.md) — sibling presence-check gate; a build dispatch's return should feed the same wiring-sweep-log

---

## §7 — Cross-Agent Contracts (parity with haiku-spawn-template.md §7 — validate-agent-inheritance-parity)

Applies to every Opus-agent dispatch, same as Haiku scouts:

- **B_VALIDATE_BEFORE_ASSUME** — the persistent tab re-derives every claim in the agent's return
  from ground truth (re-runs the cited commands) before sealing. Memory of a prior run, or the
  agent's own narrative, is not evidence.
- **B_DETERMINISTIC_GATE** — the dispatched agent's proof commands must be deterministic given
  the same HEAD; no wall-clock or mtime-based claims.
- **B_INSIST_ON_COMPLETION** — the agent's return must be honest about PARTIAL vs COMPLETE; a
  silent gap dressed as DONE is worse than a declared gap.
- **P-META-032 PROVENANCE LABELS** — every finding/claim in the return traces to a file path +
  line number or an actual command's actual output, never an unattributed assertion.
- **B_CONTEXT_CHECKPOINT_GATE** — if the dispatch runs long, the agent reports token/context
  usage in its return so the persistent tab can decide continue-vs-checkpoint rather than losing
  work to a silent context cutoff.

**Template signature:** `S089-GVRN-opus-agent-spawn-template-v1.0-2026-07-27`
