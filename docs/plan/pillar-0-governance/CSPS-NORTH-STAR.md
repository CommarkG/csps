---
id: csps.governance.north-star
name: CSPS-NORTH-STAR
description: "The CSPS North Star — the single ratified statement against which every decision, session, and artifact is measured. Adopted from CSP predecessor platform (PLTF-NS-01, Version C, PROVISIONAL via CC-013 R1/Q001). The governing principle: turn intention into reality — not approximately, but precisely."
type: governance
diataxis_type: reference
protection_level: sacred
status: ratified
core_spine: GVRN
schema_anchor: vault_files
version: "1.0"
session: S060
owner: group:finky
lifecycle: production
lifecycle_state: active
context_question: "Does this decision move toward or away from the North Star? Can you name specifically which aspect of 'not approximately, but precisely' this serves? No answer = no mandate."
context_quote: "CSPS exists to turn intention into reality — not approximately, but precisely."
inherits_from: "CSP PLTF-NS-01 (predecessor platform, inter-session 2026-05-14)"
---

# CSPS North Star

> **Sacred. Do not edit without Governor ratification.**
> This is the topmost governance element. Every CSPS spine, artifact, and decision traces back here.
> Adopted from CSP predecessor platform, PLTF-NS-01, Version C, 2026-05-14.
> Formal CSPS ratification: S060 Governor directive.

---

## Version C — The Ratified Statement

> *"CSPS exists to turn intention into reality — not approximately, but precisely.*
> *It sees the core of what matters, holds it as the governing reference,*
> *and builds outward from it through AI-optimized architecture*
> *that is governed without rigidity, stable without slowness,*
> *and detailed without losing the whole."*

**Foundation Sentence (companion):**
"Context is the palace. Alignment is the King. Timing is the Queen."

**The three pairs embedded in Version C:**
- Governed without rigidity — rules hold AND creative judgment remains possible within them
- Stable without slowness — does not drift AND moves fast enough to be useful
- Detailed without losing the whole — depth is available AND the orienting view remains intact

---

## The Six North Star Qualities

Every CSPS artifact must declare which qualities it serves (`ns_quality` field in frontmatter):

| Quality | What it means | Verification |
|---|---|---|
| **Core-first** | Starts from constitutional layer; adds outward, never bypasses | "This element is governed by Sphere 0 principles before any other constraint" |
| **I2I** | Idea-to-Impact — every input has a governed output path | "Every input entering this element routes to a ratified output" |
| **Synergetic** | Elements compound rather than compete | "This element is strengthened when X and Y operate alongside it" |
| **AI-optimized** | Designed for efficient AI execution within governed boundaries | "An AI agent executing this element can do so within session budget" |
| **Governed without rigidity** | Rules hold AND exception protocol exists within governance | "FAIL-CLOSED by default; Governor override path exists and is documented" |
| **Self-improving** | Gets better through use — data, feedback, iteration | "Every session adds evidence; the element is more accurate over time" |
| **Core-maximal** | The core holds everything reusable; apps are the thinnest bundling layer over a maximal core. Any capability an app needs is added to the CORE first (at its pillar/sub-pillar), then bundled in — apps build nothing net-new. The stack is unlimited in granularity (sub-branches + leaves without limit); CIE + Priority Engine activate only what each need requires. When no perfect-fit core element exists, the system STOPS and ratifies a harmonized addition with the human — never guesses-and-fills silently (Gap-Harmonization-Gate). | "Does this app contain only bundling + app-specific config, with every reusable capability in the core? On a gap, did the system stop-notify-ratify rather than guess?" |

> **Core-maximal doctrine (ratified S068):** Full architecture, the L0→L1→L2/L3→Apps layering, and the Gap-Harmonization-Gate live in [CORE-MAXIMAL-DOCTRINE.md](CORE-MAXIMAL-DOCTRINE.md).
> AUTHORIZED: Governor Yariv ratified the Core-maximal quality + amendments, S068.

---

## The Three NSPP Gates (North Star Presence Protocol)

These gates enforce the North Star across every session. They are NOT optional.

### Gate 1 — Session Open (mandatory before any work begins)
**Question:** "What part of the North Star does today's work serve?"
**Answer format:** One sentence citing a specific Version C element (e.g., "Today's work serves 'governed without rigidity' by adding exception protocol to the new hook")
**If no answer:** The session has no mandate. Surface to Governor.
**Where enforced:** session-open-context.mjs injection + startup.template.md

### Gate 2 — Session Close (mandatory before tab closes)
**Classification:** ADVANCE / HOLD / DRIFT
- **ADVANCE:** Session moved the platform toward the North Star
- **HOLD:** Session produced work that didn't change North Star alignment
- **DRIFT:** Session moved away from the North Star (drift is not failure — UNRECOGNIZED drift is)

**If 3 consecutive HOLDs without ADVANCE:** Governor decision required.
**Where enforced:** post-stop-session-close-gate.sh check (to be implemented) + startup.template.md

### Gate 3 — Interval Revalidation (every 10 sessions OR after major ratification)
**Question:** "Does the current seal still hold? Does Version C still apply as written?"
**Note:** This does NOT reopen the North Star — it confirms it still applies.
**If Version C reads differently due to accumulated changes:** dispatch a refinement session

---

## North Star Traceability (ns_quality field)

Every CSPS governance artifact must declare `ns_quality` in its YAML frontmatter.
New artifacts without `ns_quality` are flagged as **NS orphans** by validate-universal-alignment.mjs (after upgrade).

```yaml
# Example frontmatter:
ns_quality: [core-first, governed-without-rigidity]
ns_path: "this artifact → behavioral contracts → GVRN spine → North Star Version C §3"
```

---

## Ratification History

| Date | Event | Status |
|---|---|---|
| 2026-03-27 | CC-013 R1/Q001: 3A·1B majority (Gemini: CANONICAL; ChatGPT/Claude/Lovable: PROVISIONAL) | PROVISIONAL (CSP) |
| 2026-05-25 | Governor Yariv Fink: formal CSPS adoption of Version C | RATIFIED (CSPS) |

---

## What the North Star Is NOT

- It is not a mission statement (aspirational language about what we want to do)
- It is not a feature description (what the platform has)
- It is not a process definition (how we work)
- It IS a governing reference — the single orienting point against which every decision is measured

---

*CSPS North Star v1.0 | RATIFIED S060 | Sacred — requires Governor ratification to modify*
*Adopted from CSP PLTF-NS-01 Version C, 2026-05-14*
