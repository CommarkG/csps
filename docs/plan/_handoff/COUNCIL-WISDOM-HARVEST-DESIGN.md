---
id: csps.governance.council-wisdom-harvest-design
name: COUNCIL-WISDOM-HARVEST-DESIGN
description: >
  Design (S088) to turn council + research OUTPUT into recurring internal wisdom, with MANDATORY harvesting,
  and to route both council convening (in) and harvested insight (out) through the Threshold so nothing is a
  loose cannon. Consolidates the fragmented tools/council/ surface and wires the missing output-harvest leg.
  Concrete specification of PARK-S088-001 (Pipeline B). Document-first; build = Sonnet (FSE + block-tests).
version: "0.1-draft"
session: S088
owner: group:finky
authored_by: OPUS-25
core_spine: GVRN
diataxis_type: explanation
schema_anchor: handoff_files
lifecycle: production
lifecycle_state: active
status: draft-awaits-ratification
precedent_checked: true
links:
  - { rel: park, href: ../../../tools/data/park-register.yaml }
  - { rel: research-registry, href: ../../../tools/config/research-registry.yaml }
  - { rel: ratified-standards, href: ../../../tools/data/ratified-standards.yaml }
  - { rel: comm-spine, href: ../pillar-0-governance/AI-COUNCIL-COMMUNICATION-SPINE.md }
---

# Council + Research Wisdom Harvest — make saved output recurring wisdom, threshold-gated

## 1. WHAT EXISTS (grounded inventory)
- **Invocation IS threshold-wired:** `tools/scripts/route-input-wrapper.mjs` + `selectPersonas` in
  `threshold-router.mjs` log every convening to `tools/data/council-invocation-log.yaml` (target ≥95% routed).
- **Stores that exist but aren't fed by council output:** `tools/config/research-registry.yaml`,
  `wisdom_class` frontmatter dimension, CIE (`.csps/intelligence/cie-state.yaml`,`cie-chain-insights.yaml`),
  findings-actuator (act-forcing), `ratified-standards.yaml` (Pipeline A: ratified ⇒ standard + audit).
- **Protocols (recent, canonical):** AI-COUNCIL-COMMUNICATION-SPINE.md + AI-COUNCIL-EDGE-CASE-PROTOCOLS.md.

## 2. THE GAP (the loose cannon)
1. **Council/research OUTPUT is not harvested.** The log records THAT a council ran + which personas — never
   the VALUE produced. Insights die in chat or in stale buffers. (grep council→CIE/findings = empty.)
2. **`council-state.json` is a stale relay buffer** (S021/S022), not a living wisdom store.
3. **`tools/council/` is fragmented** — ~30 files: stale session docs (S023/S040/S041), overlapping protocols
   (PROTOCOL.md / opus-protocol.md / communication-protocol-shared.md / tab-closing-protocol.md), relay buffers.
4. **Output has no threshold exit.** Input routes IN; harvested insight has no routing OUT → un-governed.

## 3. CONSOLIDATION MAP (tools/council/)
- **KEEP as active:** opus-turn.md + sonnet-turn.md (live relay buffers), council-architecture.md, COUNCIL-INDEX.md.
- **SUPERSEDED → archive** (replaced by the two AI-COUNCIL-* docs): PROTOCOL.md, opus-protocol.md,
  communication-protocol-shared.md, tab-closing-protocol.md (fold any unique content into the spine first).
- **HISTORICAL → tools/council/archive/**: S023/S040/S041 session docs, srof-013, p-meta-022 plans,
  feedback-*-S022, *-context.md briefs (point-in-time; not living).
- **RETIRE/replace:** council-state.json (stale) → replaced by the council-harvest register (§4).
- Rule: one canonical protocol home (the spine), one live relay pair (turn files), everything else archived.

## 4. THE WIRING — output → recurring wisdom (Pipeline B, concrete)
New register: `tools/data/council-harvest.yaml` (or extend research-registry). Every council deliberation,
research effort (internal or external-AI), and persona-consult MUST emit a harvest entry:
```
- id: harvest-<ts>
  trigger: <council|research|external-review|persona-consult>
  invocation_ref: <council-invocation-log id>     # ties output back to the logged convening
  question: <what was deliberated/researched>
  conclusion: <the insight/decision — the VALUE>
  provenance: <who/which models/sources; external = QUARANTINE until reproduced>
  disposition: <SWIFT-absorb | park | ratify-candidate | discard-with-reason>
  wisdom_class: <insight|reference|workflow|tool|benchmark|story>
```
**Flow:** convening (threshold-routed, logged) → deliberate → **HARVEST entry (mandatory)** → CIE captures →
recurring patterns promote to findings-actuator → ratify-candidates flow to **Pipeline A** (ratified-standards
⇒ standard + audit). Result: a one-off council insight becomes a reusable, audited platform standard.

## 5. MANDATORY HARVEST (the gate — no loose cannon)
- **Rule:** a council/research/external-review effort cannot be marked complete without a harvest entry whose
  `disposition` is set. Builder/Opus may not close the unit otherwise.
- **Enforcement (FSE, Sonnet build):** `validate-council-harvest.mjs` BLOCKS when `council-invocation-log`
  has an entry with no matching `council-harvest` entry (invocation without harvest = un-harvested deliberation)
  + a Stop-gate reminder. T1 hook + T2 validator + T3 + ratified-standards entry. Each with a behavioral block-test.

## 6. THRESHOLD CONNECTION (both directions — closes the loose cannon)
- **IN (exists):** convening routes through `route-input-wrapper` → classify → selectPersonas → tier (T0–T4).
- **OUT (new):** every harvest entry's `disposition` is itself a **threshold decision** — SWIFT-absorb (act now),
  park (park-register), ratify-candidate (→ Pipeline A), or discard-with-reason. The threshold is the single
  door both for what the council CONSUMES and for what it PRODUCES. Nothing the council emits bypasses routing.

## 7. PCR
**P:** council/research generate the platform's highest-value thinking. **C:** today that value is logged-as-
occurred but not harvested, so it doesn't compound into wisdom and its output isn't governed (loose cannon).
**R:** add a mandatory harvest register wired CIE→findings→Pipeline A, route every harvest disposition through
the threshold, and consolidate the fragmented council surface to one protocol + one relay pair + an archive.
This makes PARK-S088-001 (Pipeline B) concrete; it is the capstone that feeds Pipeline A from raw deliberation.

## 8. SCOPE NOTE
Build sequencing: this depends on the threshold chain (live) + Pipeline A (live) + findings-actuator (live) —
all present. Blocker shared with PARK-S086-053: if council legs use Haiku scouts, the scout-output-verification
(CS9) applies (external/cheap output = claim until reproduced). Build after the SHIPPABLE-GREEN A-track gates.

## 9. TAGGING-CORE ALIGNMENT — every input + every output carries the core tags (Governor S088)
**Requirement:** all inputs (threshold intake), all council/research harvest entries (§4), and all NEW
creations are tagged with alignment to the **tagging core system** — `docs/plan/_intake/tag-status-contract.md`
(12 closed-enum dimensions + 2 state machines), synced with `frontmatter-closed-enums.md` (enums),
`canonical-concepts-registry.yaml` (vocab), and `naming-policy` (names). This is how inheritance + platform DNA
are enforced on *every change*: an untagged input/creation has no inheritance parent and is a loose cannon.
- **Harvest schema (§4) extends** with the core tag dimensions: `spine`, `domain`, `lifecycle_state` (the ONE
  canonical status — see §10), `wisdom_class`, `tier`, `audience` — drawn from the closed enums, never free-text.
- **Threshold both directions:** intake tags the input on the way in; the harvest disposition tags the output on
  the way out. The tag vocabulary is the SAME closed enum for both → coherence by construction.
- **Enforcement:** a creation/harvest with a tag value outside the closed enum, or missing a required tag, is
  un-authorable (extends the existing frontmatter closed-enum gate to harvest + intake records).

## 10. COHERENCE CONSOLIDATION REQUIRED (the improvement to make now → register + sequence)
Found this session — must be consolidated for a stable/scalable platform:
1. **Status SSoT is split (drift).** `validate-frontmatter.mjs` defines FOUR status enums —
   `lifecycle_state`, `stage` (STAGE_VALUES), `quality_state` (QUALITY_STATE_VALUES), `cdp_status`
   (CDP_STATUS_VALUES) — and the S049/S050 "stage replaces lifecycle_state" cutover was never completed
   (`lifecycle_state` is still in REQUIRED_FIELDS). **Fix:** finish the consolidation OR formally ratify the
   split with a single documented mapping; one canonical status state-machine in ONE SSoT, referenced (not
   re-defined) everywhere. Until done, "status synced" is false.
2. **Tagging core has no single index.** tag-status-contract / frontmatter-closed-enums / canonical-concepts /
   naming-policy are four files that SHOULD be one coherent cross-referenced system. **Fix:** a TAGGING-CORE
   index that declares the SSoT for each dimension (tags/status/vocab/names) and asserts the validators read
   from it (no re-defined enums in validator code — they import the SSoT).
3. **Enums re-defined in validator code.** Closed enums live both in `frontmatter-closed-enums.md` AND hardcoded
   in `validate-frontmatter.mjs`. **Fix:** validators import the enum SSoT; a divergence check blocks drift.
**Sequencing:** these are FSE consolidations (Sonnet build, behavioral block-tests). Register each as a finding
so the act-forcing loop tracks them; do NOT hand-patch the status enums mid-flight (multi-file, high-blast —
needs its own ratified consolidation pass). This is the coherence layer beneath inheritance + DNA-on-every-change.
