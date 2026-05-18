---
id: csps.council.multi-session-plan-S040-playground-inheritance
name: multi-session-plan-S040-playground-inheritance
description: "Multi-session plan for CSPS Inheritance Principle — making DNA inheritance mechanical across governance, code, pages, and user tiers. Covers CSPS platform + CSPS Playground. Ratified by Governor in S040."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: council_state
diataxis_type: reference
session: S040
scope_level: S0
links:
  - { rel: parent, href: ../opus-open-items.md }
  - { rel: related, href: ../sonnet-turn.md }
  - { rel: context, href: platform-state-snapshot.md }
---

# Multi-Session Plan — CSPS Inheritance Principle
## S040 origin · Opus Turn 96 candidate

---

## 0. WHY THIS PLAN EXISTS

During S040, the Governor built the CSPS Playground (csps-playground.vercel.app) — a living
reference platform covering UX UI, Architecture, DNA, Platform governance, and user journeys.
In doing so, a critical platform gap was exposed:

**Inheritance is aspirational, not mechanical.**

We have B_DNA_INHERITANCE (M-26), Five-Surface Engraving, and the DNA ribbon — all pointing at
inheritance. But when a new artifact is created, it carries NO automatic link to its parents.
When a parent is updated, NO children are notified. When a principle is ratified, its propagation
to all relevant surfaces requires conscious effort per surface.

The Governor's directive: make inheritance the structural default — not a catch-up action.

---

## 1. WHAT EXISTS (inventory — do not duplicate these)

| Tool | Layer | What it does | Gap |
|---|---|---|---|
| B_DNA_INHERITANCE (M-26) | Code | libs/ files must carry @csps-enforces annotation | Only libs/; doesn't cover pages, docs, or governance files |
| validate-new-file-dna.mjs | Code | BLOCKS libs/ files without DNA annotation | Checks presence, not content |
| Five-Surface Engraving | Governance | 5/5 propagation when principle ratified | Triggered manually on catch, not on creation |
| B_INHERITANCE_POLICY | Governance | T1+T2+T3 at every chat boundary | Session-boundary only |
| session-open.sh (T3) | Governance | Injects mandatory rules at session open | Session-only; doesn't persist to artifacts |
| DNA ribbon (nav.js) | Playground pages | Always-visible governing principle per page | Pipeline-level only; no artifact-specific parent link |
| Living Reference template | Playground pages | Mother→child template chain with version check | Manual version comparison; no auto-propagation |
| apps/template/ + create-app.sh | Apps | Fork → inherit wiring → deploy | No notification when template improves |
| PAGES data structure (nav.js) | Playground pages | goal + pipeline + intro + alignment per page | No `inherits_from` field |

---

## 2. THE DNA BLOCK STANDARD (new — to be ratified by Opus)

Every CSPS artifact gets a DNA block at creation. This is NOT a comment — it is machine-readable.

### 2a. HTML pages (playground):
```html
<!--
  @csps-dna
  inherits_from: platform/templates/vault/[type]-clean.html
  core_spine: [GVRN|ARCH|AI|OPER|VALD]
  governing_principle: [P-XXX-NNN]
  behavioral_contract: [B_XXX]
  pipeline: [Governance|Architecture|Design|Operations|Validation|Learning]
  artifact_type: [web-page|protocol|wizard|journey|file]
  completion_status: [stub|draft|complete]
  template_version: [X.Y]
  created: [ISO date]
  last_aligned: [ISO date]
-->
```

### 2b. TypeScript/JavaScript files (CSPS repo):
```ts
/**
 * @csps-dna
 * inherits_from: libs/[parent-module]/
 * core_spine: ARCH
 * governing_principle: P-ARCH-031
 * behavioral_contract: B_DNA_INHERITANCE
 * role: [specific role of this file — one sentence]
 * created: [ISO date]
 * @csps-enforces [P-XXX-NNN]
 */
```

### 2c. Governance artifacts (YAML/MD):
```yaml
# @csps-dna
# inherits_from: [parent principle or contract]
# core_spine: GVRN
# governing_principle: P-META-NNN
# role: [specific role]
```

**Key rule:** The DNA block is the FIRST thing in every file. Not a section. Not optional.
validate-dna-block.mjs (to be built) will BLOCK files without a valid DNA block.

---

## 3. THE INHERITANCE PRINCIPLE CONTRACT (draft — Opus to ratify)

### B_CSPS_INHERITANCE_PRINCIPLE

**Governing intent:** Every artifact carries its lineage. No artifact is created without declaring
what it inherits from. When a parent changes, children are notified and human confirmation
is required before alignment. Inheritance is the structural moat — it prevents genetic drift.

**Enforcement:**
- T1: pre-tool-use-dna-block-check.sh — checks that new files include DNA block before write
- T2: validate-dna-block.mjs — BLOCKS files without valid DNA block at commit
- T3: session-open.sh injection — reminds AI that DNA block is required on every new file

**Hard rules:**
1. Every new file MUST have a DNA block as its first content
2. `inherits_from` must resolve to a real parent file or template
3. `completion_status` must NOT be 'complete' without Governor verification
4. When parent version changes, run inheritance-propagator.mjs → generate audit report → human confirms before applying
5. `last_aligned` must be updated whenever the parent changes

---

## 4. THE INHERITANCE REGISTRY (new — to be built in S041)

File: `tools/config/inheritance-registry.yaml`

```yaml
# CSPS Inheritance Registry — every artifact and its lineage
# Auto-updated by inheritance-propagator.mjs

artifacts:
  - id: playground/platform/ai-personas
    type: web-page
    template: living-reference
    template_version: '1.1'
    core_spine: AI
    governing_principle: P-META-010
    inherits_from: platform/templates/vault/living-reference-clean.html
    completion_status: complete
    last_aligned: '2026-05-18'

  - id: playground/ux-ui/color-themes
    type: web-page
    template: tabbed
    template_version: '1.0'
    core_spine: AI
    governing_principle: P-UX-001
    inherits_from: platform/templates/vault/tabbed-clean.html
    completion_status: complete
    last_aligned: '2026-05-18'

  # ... all 40+ playground pages registered here
```

---

## 5. THE INHERITANCE PROPAGATOR (new — to be built in S041)

File: `tools/scripts/inheritance-propagator.mjs`

**What it does:**
1. Reads `inheritance-registry.yaml`
2. For each artifact, checks if its parent's version > artifact's `template_version`
3. If yes: generates an audit report per artifact:
   ```
   ARTIFACT: playground/platform/security/
   PARENT: platform/templates/vault/content-clean.html
   PARENT VERSION: 1.1 (was 1.0 on this artifact)
   CHANGES IN 1.1: added versioning block, updated DNA block standard
   IMPACT ON THIS ARTIFACT: low — additive features
   RECOMMENDED ACTION: update DNA block comment + add template_version="1.1"
   RISK OF NOT UPDATING: DNA block will be out of sync with standard
   HUMAN CONFIRMATION REQUIRED: YES
   ```
4. Presents report → waits for human confirmation per artifact
5. Only applies changes to confirmed artifacts

**Human confirmation gate:**
- Auto-reject if: feature removal, content changes, intent-carrying field changes
- Require confirmation if: additive features, DNA block updates, version bumps
- Auto-approve never: the human always decides

---

## 6. MULTI-SESSION BREAKDOWN

### S040 (current — this document)
**Sonnet delivers:**
- This plan document (in repo)
- DNA block standard defined
- B_CSPS_INHERITANCE_PRINCIPLE drafted
- Opus SROF prompt composed and presented
- Playground state documented for Opus review

**Opus reviews:**
- Ratifies B_CSPS_INHERITANCE_PRINCIPLE
- Reviews DNA block standard for consistency with existing frontmatter schema
- Validates multi-session breakdown
- Adds constitutional seal to Inheritance as a core pillar

---

### S041 — Code Layer Inheritance (Sonnet builds · Opus directs)
PE estimate: 75 | SPI: 0.4 | Priority: Band A

**Sonnet:**
1. Create `tools/validators/validate-dna-block.mjs` — BLOCKING for all new files
2. Create `tools/scripts/inheritance-propagator.mjs` — generates audit report
3. Create `tools/config/inheritance-registry.yaml` — initial population for libs/
4. Create `pre-tool-use-dna-block-check.sh` hook
5. Update `tools/verify.mjs` to wire validate-dna-block
6. Backfill DNA blocks to all libs/ files (pnpm add:dna-block --all)

**Opus input needed:**
- DNA block field schema (should it extend or replace existing frontmatter?)
- Which libs/ files are highest priority for DNA block backfill?
- Confirm: should validate-dna-block replace validate-new-file-dna or extend it?

---

### S042 — Playground Layer Inheritance (Sonnet builds · Opus directs)
PE estimate: 70 | SPI: 0.45 | Priority: Band A

**Sonnet:**
1. Extract `page-data.js` from nav.js (C5 critical gap — nav.js now 900+ lines)
2. Add `inherits_from` field to ALL PAGES entries in page-data.js
3. Add DNA block comments to all 40+ playground HTML files
4. Populate `inheritance-registry.yaml` for playground pages
5. Build `platform/templates/index-template.html` — mother template with all features
6. Build children variants that inherit from mother
7. Build `platform/templates/orchestrator.js` — selects variant based on page metadata
8. Build `platform/templates/audit-gate.html` — human confirmation UI for template updates

**Opus input needed:**
- Is the mother→children→instances template architecture sound?
- What's the right inheritance trigger: URL? PAGES metadata? data-template attribute?
- Should orchestrator.js run at build time or at runtime?

---

### S043 — User Tier Inheritance (Sonnet builds · Opus directs)
PE estimate: 65 | SPI: 0.5 | Priority: Band B

**Sonnet:**
1. Implement content filtering by user tier (localStorage user type → show/hide sections)
2. Differentiated home pages per tier (Core Dev / Co Dev / External Dev / Enterprise)
3. Essential DNA tab for External Developers (5 core rules, not 65 principles)
4. Getting Started with literal commands for External Developers
5. "Zero to running app in 30 min" guided flow (cross-links Getting Started → Journeys)
6. Components page with CSS-only visual previews

**Opus input needed:**
- How granular should tier-based content filtering be? Page-level? Section-level? Item-level?
- Should the user type switcher in nav affect any CSPS repo behavior, or only playground display?

---

### S044 — Validation + Alignment Audit (Sonnet builds · Opus directs)
PE estimate: 60 | SPI: 0.3 | Priority: Band B

**Sonnet:**
1. Run `node tools/validators/validate-dna-block.mjs --report-all` → find all files without DNA blocks
2. Run `node tools/scripts/inheritance-propagator.mjs` → identify all inheritance gaps
3. Complete all missing vault template files (registry-clean, dashboard-clean, annotated versions)
4. Fix C1-C6 critical gaps from the 6-RZF plan:
   - C1: completionStatus default to 'stub', Governor-only promotion
   - C2: Platform nav grouping (reduce 19 items with separators)
   - C3: Create remaining 2 vault files
   - C4: Rename "mandatory" questions to "Reference Questions" until T2 enforces them
   - C5: Extract page-data.js (done in S042)
   - C6: Getting Started literal commands (done in S043)
5. Final inheritance audit — every artifact has DNA block, inherits_from, last_aligned
6. Produce: inheritance-manifest.md documenting the complete chain

**Opus input needed:**
- After S044, what is the success criterion for "inheritance is complete"?
- Should the inheritance manifest be machine-readable (for future validators) or human-readable?

---

## 7. PLAYGROUND STATE SUMMARY (for Opus context)

### What was built in S039-S040 (playground at csps-playground.vercel.app):

**Navigation structure (4 top-level):**
- UX UI (Color Themes, Mandatory, Responsiveness, Components)
- Threshold (Overview, Decision Gates, Patterns, Guidelines, Examples)
- DNA (tabs: Philosophies, Principles, Vocabulary, Behavioral Contracts, Core Spines, Build Standards, Sessions, AI Guidelines, + AI Personas child page)
- Platform (19 sub-pages including: Journeys, Templates, Completion, Internal Core, Validation, etc.)

**Template vault (4 of 6 files created):**
- hero-clean.html ✓
- content-clean.html ✓
- tabbed-clean.html ✓
- living-reference-clean.html ✓
- registry-clean.html — MISSING
- dashboard-clean.html — MISSING

**Living Reference template (new pattern):**
- Introduced as new template type
- Inline editing, versioning (5 saves), download (HTML/JSON), upload (CSPS-validated), comments per item, sort, metadata timestamps, template version check
- AI Personas page is the first (and only) instance

**DNA infrastructure:**
- DNA ribbon: injected on every page by nav.js, shows governing principle per pipeline
- Completion status: visible badge (stub/draft/complete) — currently self-reported
- Mandatory questions: 12 per artifact type (web-page, protocol, wizard, journey, file) — currently advisory
- CSPS Alignment block: spine + pipeline + serves — injected by nav.js when page has `alignment` data

**Completion Framework (/platform/completion/):**
- 6 groups × 3 failure modes = 18 named failures with problem + solution + 3 real platform examples
- Group 1: Content completion (done-equals-created, structural confusion, self-reporting)
- Group 2: Structural completion (missing elements, broken references, partial enforcement trio)
- Group 3: Functional completion (wired not called, called not verified, no UJT)
- Group 4: Governance completion (no ratification, nominal ZF, session closed without evidence)
- Group 5: Systemic completion (gap without fix, template not used, DNA absent)
- Group 6: The moat (3 questions: Can a stranger use it? Does it survive deletion? Does it enforce itself?)

**Questions registry (/platform/questions/):**
- 5 tabs × 12 questions each: web-page, protocol, wizard, journey, internal file
- Gate system: BLOCK (cannot complete without answer), WARN (document even if deferred), INFO (context)
- Injected on pages via nav.js using `artifactType` field in PAGES

**Key gaps identified (to carry forward):**
- completionStatus: self-reported — no T2 validator
- nav.js: 900+ lines — needs page-data.js extraction
- Platform dropdown: 19 items — needs grouping
- Inheritance: no `inherits_from` field anywhere — this plan addresses it
- 2 missing vault template files

---

## 8. OPEN QUESTIONS FOR OPUS (SROF-FORMAT)

**STATUS: Answered by Opus Turn 96 — read tools/council/srof-013-complete.md PART 2**
**Architecture ratified. S041 mandate confirmed. Session order S041→S042→S043→S044 confirmed.**

Key answers summary:
- Q1: New contract B_CSPS_INHERITANCE_PRINCIPLE (NOT extension of B_DNA_INHERITANCE)
- Q2: `inherits_from` = free-form path string, NOT closed enum. validate-dna-block.mjs uses existsSync()
- Q3: Three-tier risk model: low→auto-approve, medium→queue, high→BLOCK. Threshold in registry YAML.
- Q4: S041 (code layer) FIRST — tools must exist before they can enforce playground pages
- Q5: One principle, two implementations, one registry. Unified initiative.
- Q6: pre-tool-use-dna-block-check.sh T1 (reads Write tool content) + validate-dna-block.mjs T2 together

---

**Q1 (Architecture):** Should B_CSPS_INHERITANCE_PRINCIPLE be a NEW contract or an extension of B_DNA_INHERITANCE? The key difference: DNA_INHERITANCE covers libs/ file annotation; INHERITANCE_PRINCIPLE would cover all artifact types across all layers.

**Q2 (Schema):** The DNA block standard I propose adds HTML comments + new YAML/TS fields. Does this conflict with or extend the existing frontmatter-closed-enums.md schema? Specifically: should `inherits_from` be a formal closed-enum field or a free-form reference?

**Q3 (Enforcement):** The inheritance-propagator proposes HUMAN CONFIRMATION for every child update. At 40+ playground pages, this could create significant confirmation fatigue. Is there a principled way to auto-approve LOW-RISK changes (additive features, DNA block updates) while requiring human confirmation for HIGH-RISK changes (structural, content, intent)?

**Q4 (Sessions):** Given the PE scores in section 6 (S041: PE=75, S042: PE=70, S043: PE=65, S044: PE=60) — is the session order optimal? Or should the playground layer (S042) come before the code layer (S041) since the playground is actively used and the code layer is background infrastructure?

**Q5 (Scope):** The plan covers CSPS platform (libs/, validators, principles) AND CSPS Playground (HTML pages, templates, nav.js). Should these be separate initiatives with separate governance tracks, or is the unified approach correct?

**Q6 (The moat question):** The 6-persona RZF analysis shows that inheritance drift is the primary failure mode — we create artifacts that don't carry their lineage. The Completion Framework names this in Group 5 (DNA Not Present in Artifact). Is there a simpler mechanical check that prevents artifact creation without inheritance declaration — simpler than a full validate-dna-block.mjs validator?

---

## 9. IMMEDIATE NEXT ACTIONS (S040 close)

Before S040 closes:
1. ✅ This plan document saved to tools/council/
2. ✅ Opus SROF prompt composed (see section 10)
3. ⏳ Git push (pending this commit)
4. ⏳ Governor presents prompt to Opus in Opus tab
5. ⏳ Opus Turn 96 received → S041 begins

---

*Created: 2026-05-18 | Session: S040 | Author: Sonnet 4.6[1M] + Governor Yariv Fink*
*Inheritance is not a feature. It is how organisms remain coherent across generations.*
