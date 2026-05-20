---
id: csps.templates.skill-base
name: skill-base-template
description: "Parent behavioral template for ALL CSPS skills. Every skill SKILL.md inherits these 6 sections. Sections may be abbreviated but must not be omitted."
template_id: SKILL-BASE
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: skill_template
batch: BATCH-C
session: S049
template_depth: L1
parent_template: governed-artifact-frontmatter
---

# [Skill Name] — CSPS Skill

> **Template:** SKILL-BASE v1.0 | **Inherits from:** governed-artifact-frontmatter
> **All 6 sections required. Abbreviated content OK. Omission is not.**

---

## Identity

- **Name:** [skill-name]
- **Role:** [one sentence — what this skill does, not how]
- **When to invoke:** [trigger conditions — specific keywords or patterns that fire this skill]
- **Never use for:** [anti-trigger — what it does NOT handle, to prevent misuse]
- **Scope:** [BLOCKING | ADVISORY | DIRECTIVE | REPORT — what kind of output this produces]

---

## AAP Alignment

> Every skill must acknowledge the two universal-required behavioral contracts before processing.

**B_AI_PROFESSIONAL_VOICE:** This skill operates with the CSPS professional voice standard.
Output is direct, evidence-based, and does not include sycophantic framing.

**B_VALIDATE_BEFORE_ASSUME:** This skill does not assume state. Every claim cites a tool call
or cited source in the current response. Memory of prior state is NOT evidence.

**Additional B_* contracts active for this skill:**
- [list any additional B_* contracts this skill must respect, or "none beyond universal-required"]

---

## Input Contract

What this skill accepts as input:

| Input | Type | Required | Description |
|---|---|---|---|
| [param] | [type] | yes/no | [what it is] |

**Pre-conditions:** [what must be true before this skill fires — context loaded, files present, etc.]

---

## Output Contract

What this skill produces:

| Output | Format | Guaranteed |
|---|---|---|
| [output] | [format] | [always / when-condition] |

**Post-conditions:** [what is true after this skill completes — files written, state changed, etc.]
**Failure mode:** [what the skill does if it cannot complete — exits with error, falls back, etc.]

---

## ZF Requirement

Before producing any substantive output, this skill runs ZF cycles:

```
ZF Cycle 1: [what it checks — name the finding area, not just "checking"]
ZF Cycle 2: [re-examine Cycle 1 area by name + any new finding area]
Status: ZF ACHIEVED when tool output confirms 0 new findings.
```

**Exempt cases:** [list specific cases where ZF is not required, or "none"]

---

## Enforcement Trio

Per B_PRACE: every skill declares its T1+T2+T3 enforcement surfaces.

- **T1 (hook):** [`.claude/hooks/pre-tool-use-skill-aap-required.sh` fires before any skill invocation — validates AAP preamble present]
- **T2 (validator):** [specific validator that checks this skill's compliance, or "validate-aap-frontmatter.mjs (universal)"]
- **T3 (session):** [session-open injection or AGENTS.md reference that makes this skill visible at session start]

**Governing intent:** [one sentence — what failure mode this skill's enforcement prevents]
