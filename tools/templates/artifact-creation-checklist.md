---
id: csps.tools.templates.artifact-creation-checklist
name: artifact-creation-checklist
description: "Creation checklist for any new CSPS governance artifact — validator, hook, template, contract, principle, plan item. Closes 3 improvement-register not_yet_propagated items: imp_PLATFORM_GENOME_AS_PERMANENT_NODE + imp_BEHAVIORAL_TEST_BEFORE_RATIFICATION + imp_REFLEXIVE_TOOL_APPLICATION."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
template_id: artifact-creation-checklist
template_version: 1.0
template_status: stable
template_grade: A
applicability_trigger: "Any PROTO that creates a new governance artifact: B_* contract, validator (.mjs), hook (.sh), template, plan item, or principle. Ask these questions BEFORE writing the artifact, not after."
session: S061
core_spine: GVRN
schema_anchor: vault_files
context_question: "Before building this artifact — can you answer all 5 checklist questions with specific file:line evidence? If not, you are about to build an orphan node."
context_quote: "The best governance artifacts are born knowing their lineage, their test, and their reflexive use case."
links:
  - csps.templates.sonnet-report
  - csps.templates.startup
---

# Artifact Creation Checklist

> Run this before writing any new governance artifact. Answer every question with a specific file path or claim — no "TBD" allowed.
> Source: 3 improvement register entries (S053-S060) collapsed into one tool.

---

## 5 Questions (answer before writing)

### Q1 — Platform Genome Inheritance
**Which Platform Genome section does this artifact inherit from?**

Platform Genome sections (docs/plan/pillar-0-governance/PLATFORM-GENOME.md):
- §1 Behavioral Contracts — B_* behavioral rules
- §2 Communication Protocol — FROM/TO, boundaries, relay model  
- §3 Validation Architecture — validators, hooks, verify pipeline
- §4 Intake & Learning — Threshold, ZF cycles, improvement register
- §5 Platform Architecture — SIA, ARCH spine, app structure
- §6 Session Operating Model — handoffs, sessions, startup blocks

**Fill in frontmatter:** `inherits_from: "Platform Genome §[N] [Section Name]"`

If none fit → this is an orphan node. Find the parent before proceeding. An orphan is not DONE.

---

### Q2 — Behavioral Test
**What is the behavioral test for this artifact?**

Write a concrete test case BEFORE implementing:
- Input A (violation): [specific text or file state that SHOULD trigger violation]
- Expected output A: [blocking count > 0 or advisory > 0]
- Input B (clean): [specific text or file state that should PASS]
- Expected output B: [exit_code 0, blocking=0]

If you cannot write this test → the definition is imprecise (B_DEFINITION_BEFORE_ENFORCEMENT). Sharpen the definition first.

**Write test to:** `tools/tests/behavioral/[artifact-name]-test.sh`

---

### Q3 — Reflexive Application
**Which existing artifacts should this run against immediately after creation?**

After building a validator:
- Run it against ALL current files it claims to scan
- Expect some advisories (proves it's finding things)
- Fix any blocking violations immediately

After building a hook:
- Run trigger scenario manually in this session
- Confirm it fires (or explicitly note "hook cannot self-test in isolation")

**Never declare DONE without reflexive run output in sonnet-turn.md.**

---

### Q4 — T1+T2+T3 Completeness
**Does this artifact have all three enforcement tiers declared?**

| Tier | What it is | Status |
|---|---|---|
| T1 | Pre-tool-use hook (prevents violation) | [hook name or "planned: [session]"] |
| T2 | pnpm verify validator (detects violation) | [validator name or "this IS the T2"] |
| T3 | Session-open injection (context) | [AGENTS.md + session-open injection] |

**Fill in frontmatter:** `enforcement_tier: { T1: ..., T2: ..., T3: ... }`

T3-only = ADVISORY at best. T1+T2+T3 = DONE.

---

### Q5 — 5-Surface Engraving
**Which of the 5 surfaces does this artifact touch?**

| Surface | Example | Done? |
|---|---|---|
| Schema | frontmatter field, closed enum | ☐ |
| Validator (.mjs) | tools/validators/validate-*.mjs | ☐ |
| Hook (.sh) | .claude/hooks/pre-tool-use-*.sh | ☐ |
| Memory (.md) | memory/feedback_*.md + MEMORY.md | ☐ |
| Contract (.md) | docs/plan/pillar-0-governance/behavioral-contracts/B_*.md | ☐ |

Any new governance rule that touches fewer than 3 surfaces = B_FIVE_SURFACE_ENGRAVING advisory.

---

## Fill-in template for new artifact frontmatter

```yaml
---
id: csps.[domain].[artifact-name]
name: [artifact-name]
description: "[one line — specific behavior this enforces]"
type: [validator | hook | template | contract | principle]
protection_level: [active | advisory | sacred]
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: [GVRN | VALD | ARCH | AI | OPER]
schema_anchor: [relevant anchor from schema]
version: "1.0"
session: S[NNN]
inherits_from: "Platform Genome §[N] [Section Name]"
enforcement_tier:
  T1: "[hook name or 'planned: S[NNN]']"
  T2: "[validator name or 'this IS the T2']"
  T3: "session-open.sh + AGENTS.md hard-NO"
behavioral_test: "tools/tests/behavioral/[name]-test.sh"
context_question: "[guard question — forces verification, not just description]"
---
```

---

## How to use this checklist

**For Opus (Director):**
When drafting a PROTO that creates new governance artifacts, include a "CREATION CHECKLIST ANSWERS" block in the PROTO, answering Q1-Q5 before Sonnet builds anything.

**For Sonnet (Builder):**
When receiving a PROTO that creates new governance artifacts, if the PROTO doesn't include answers to Q1-Q5, ask for them before proceeding. Missing = incomplete PROTO.

**For verify.mjs:**
After building — run `pnpm verify` and paste structured output in sonnet-turn.md before declaring DONE.

---

## Source improvements

This checklist closes these not_yet_propagated surfaces:
- `imp_BEHAVIORAL_TEST_BEFORE_RATIFICATION` — Q2 answers "what is the behavioral test for this artifact?"
- `imp_REFLEXIVE_TOOL_APPLICATION` — Q3 answers "after building validator: run it on current artifacts"  
- `imp_PLATFORM_GENOME_AS_PERMANENT_NODE` — Q1 answers "which Platform Genome section does this inherit from?"

All three were independently flagged in S053-S060. This template is their unified structural fix.

---

*Artifact Creation Checklist | tools/templates/ | S061 | Closes: 3 improvement-register not_yet_propagated items*
