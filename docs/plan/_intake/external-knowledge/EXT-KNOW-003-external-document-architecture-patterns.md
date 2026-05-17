---
id: csps.intake.ext-know-003
name: EXT-KNOW-003-external-document-architecture-patterns
description: "Document architecture patterns observed in external project — numbered file system, validation checklists, scope definitions. DNA confrontation against CSPS mini-tree."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: ext_know_entry
diataxis_type: reference
session: S039
ext_know_id: EXT-KNOW-003
source: "[Temp name!!!] project — files 11 (Architecture guide), 00 (Master Index), 03-01 (template)"
date_captured: 2026-05-17
status: processed
evidence_level: 3
csps_outcome: PARTIAL_COMPLEMENT
artifacts_produced: [PROP-GOV-001, PROP-GOV-002]
---

# EXT-KNOW-003 — External Document Architecture Patterns

**DNA Confrontation result: PARTIAL_COMPLEMENT** — Some patterns complement CSPS; others conflict with existing design.

---

## Pattern 1: Numbered File System (NN__ProjectName__Title__Status__Date__Version.md)

**External approach:** Every file has a sequential code (00-11), project name, title, status, date, and version in the filename.

**DNA confrontation:**
- CSPS uses kebab-case naming (P-ARCH-029 + B_NAMING_POLICY) — CONFLICT with verbose filename
- CSPS uses frontmatter for metadata (version, status, date) — the external naming is redundant
- CSPS mini-tree uses `sub_files:` in frontmatter for parent-child relationships — MORE POWERFUL
- **Verdict:** Do NOT adopt filename numbering. CSPS frontmatter is superior.

---

## Pattern 2: "What This File Owns / Does Not Own" scope declaration

**External approach:** Each document explicitly states what it covers AND what it doesn't.

**DNA confrontation:**
- CSPS files have `description:` in frontmatter but no explicit scope exclusions
- Having explicit "this file does NOT own" statements prevents scope creep and confusion
- CSPS mini-tree README does this partially but not systematically
- **Verdict: COMPLEMENT — worth adding as PROP-GOV-001**

**PROP-GOV-001:** Add to CSPS document template:
```yaml
scope:
  owns: "[what this file's canonical home is]"
  does_not_own: "[what explicitly lives elsewhere]"
```

---

## Pattern 3: Per-document Validation Checklist

**External approach:** Each document ends with a checklist: "live links completed, source evidence attached, findings summarized to parent, decisions logged."

**DNA confrontation:**
- CSPS has per-PI-item wiring_checklist but not per-governance-document checklists
- For EXT-KNOW entries, having a processing checklist is valuable (has it been DNA-confronted? have artifacts been produced?)
- CSPS already has this for PI items — extending to other docs is consistent
- **Verdict: COMPLEMENT — worth adding to EXT-KNOW template as PROP-GOV-002**

**PROP-GOV-002:** Add processing checklist to EXT-KNOW template:
```yaml
processing_checklist:
  - [ ] DNA confrontation complete
  - [ ] Vocabulary exclusion list checked
  - [ ] csps_outcome declared (COMPLEMENT/NEW/CONFLICT)
  - [ ] artifacts_produced field filled
  - [ ] Evidence level assigned
  - [ ] Parent EXT-KNOW registry updated
```

---

## Pattern 4: Evidence Level System (0-5)

**External approach:** 0=assumption, 1=anecdote, 2=repeated, 3=multi-source, 4=interview-validated, 5=payment signal.

**DNA confrontation:**
- CSPS has RZF discipline (iterate to zero findings) but no explicit evidence level taxonomy
- Level 5 (payment/usage signal) maps to CSPS's UJT-PASS (user journey test pass)
- Level 0-1 maps to "pre-crystallization" in CSPS's P-META-022
- **Verdict: COMPLEMENT — add as PROP-GOV-003 for EXT-KNOW metadata**

**PROP-GOV-003:** Add `evidence_level: 0-5` as standard EXT-KNOW field (already done in EXT-KNOW-001 and 002 above — this is the first application).

---

## Pattern 5: Classification Categories for Incoming Information

**External approach:** Pain, Desire, Objection, Trigger, Competitor, Alternative solution, Current workaround, Buying signal, Channel signal, Wedge hypothesis, Open question, Decision candidate.

**DNA confrontation:**
- CSPS EXT-KNOW vault exists but has no classification schema beyond `type:` field
- These categories are market-research specific (not CSPS governance)
- For CSPS apps (including [Temp name!!!]), having this taxonomy for user research EXT-KNOW entries is valuable
- **Verdict: COMPLEMENT for user-research EXT-KNOW entries — add as sub-taxonomy**

CSPS translation:
```
Pain → friction_point
Desire → user_goal
Objection → adoption_barrier
Trigger → onboarding_moment
Buying signal → graduation_signal (level 5 evidence)
Open question → pre_implementation_question (in PI items)
Decision candidate → PI item candidate
```

---

*EXT-KNOW-003 | Status: processed | Evidence level: 3 | PROP-GOV-001, PROP-GOV-002, PROP-GOV-003 generated*
*Absorbed from [Temp name!!!] project architecture files | 2026-05-17*
