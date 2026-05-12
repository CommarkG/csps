# Comprehensive Platform Alignment Brief — S027
## All surfaces aligned against S021-S027 new principles and protocols
## Governor directive: doing this now saves tons of effort fixing things further on
## Written by: OPUS-1 | 2026-05-13

---

> **This is the gate brief.** Sonnet proceeds with new work ONLY after these alignment items are done.
> Real zero findings is the target. Every surface consistent and complete.
> Verification tail is MANDATORY after every section.

---

## VERIFICATION TAIL (run after EVERY section, not just at the end)

```bash
pnpm --filter @csps/principles split    # if principles.yaml touched
pnpm audit-runner:split                  # if audit-runner.md touched
node tools/validators/validate-universal-alignment.mjs --scan-new   # for new .md files
node tools/verify.mjs                   # must show exit_code=0 before commit
```

---

## §P1 — BLOCKING (do these first, they gate platform correctness)

---

### P1-1: spine-graduation-principle.md — CREATE (Opus specified, Sonnet builds)

**File to create:** `docs/plan/pillar-0-governance/spine-graduation-principle.md`

This is the missing formal statement of the L1→L5 graduation model. The Governor articulated it; it must exist as a governed artifact.

Content required:
```markdown
The graduation principle (formal testable rule):
- L1 is UNIVERSAL to everything — no exception, no context
- L2 is universal within its domain — applies to all L3 instances in that domain
- L3 is specific instances — cannot contradict L1 or L2 above it
- Moving outward = increasing specificity, decreasing universality
- Moving inward = broader claim, heavier ratification requirement

Violation tests:
- L3 that contradicts L1: "this validator fires except when X" where X conflicts with CORE
- L2 that claims CORE-level universality without ADR
- L3 instance that applies to ALL contexts (would belong at L2)

Enforcement: validate-spine-hierarchy.mjs (TO BUILD Session B — already in master plan)
```

Frontmatter: core_spine: GVRN, schema_anchor: pillar_0_governance_leaves, template_grade: B, impl_status: swift-implemented, links to L1_CORE files + validate-corespine-depth-markers.mjs

---

### P1-2: ZF production chain validators — SPEC (Sonnet builds)

Per Opus Turn 18, two validators needed:

**`tools/validators/validate-opus-rzf-gap-tracking.mjs`:**
```javascript
// Reads tools/council/opus-turn.md
// For each ## RZF VERIFICATION — NEGATIVE section:
//   Finds "Tracked: [SROF-NNN or backlog-item-id]" field
//   If "Findings: N" where N > 0 AND Tracked field is empty/missing: ADVISORY
//   Checks that tracking IDs in "Tracked:" field exist in:
//     tools/council/sonnet-to-opus-request-log.md OR
//     tools/config/platform-update-backlog.yaml OR
//     tools/session-state.json blocking_decisions
// ADVISORY now. BLOCKING at K=2 untracked sessions.
```

Wire into `tools/verify.mjs` + register slug in `audit-runner.md`.

**`tools/validators/validate-opus-cec-artifacts.mjs`:**
```javascript
// Reads tools/council/opus-turn.md
// For each ## CEC — POSITIVE section:
//   Finds "Applied YES" claims
//   Checks for commit sha or file path cited in the claim
//   If "Applied YES" with no traceable artifact: ADVISORY
// Wire into verify.mjs + audit-runner.md
```

---

### P1-3: session-open.sh next-to-reach injection — BUILD (protected path, diff+confirm)

**What to inject** (the content that was never specified before):

When session opens with active situation APP_BUILD_MODE:
```bash
echo "▶ SESSION OPEN — APP_BUILD_MODE ACTIVE"
echo "  1. Check goal_statement in active plan frontmatter (P-META-022 ZF-1)"
echo "  2. Check done_criteria + failure_signal present (P-META-023 M1+M3)"
echo "  3. If first Governor prompt has >2 CONCEPT_LOAD spines: decompose first (P-META-024)"
echo "  4. Virtual Opus Audit questions available: docs/plan/pillar-0-governance/virtual-opus-audit.md"
```

When session opens with situation GOVERNANCE or Opus-advisory:
```bash
echo "▶ SESSION OPEN — GOVERNANCE/ADVISORY"
echo "  1. Read sonnet-turn.md latest report before writing"
echo "  2. RZF = production chain: gaps must go to tracking artifacts"
echo "  3. CEC = extract compound value from positive events"
```

**Protected path:** Present diff to Governor → receive explicit "yes" → implement.

---

## §P2 — IMPORTANT (do after P1, before new feature work)

---

### P2-1: behavioral-contracts.md — Add 3 cross-references

**Finding:** behavioral-contracts.md has no references to the "Drive Don't Fight" architecture, sample library, or trigger vocabulary. Three contracts need cross-references:

**In B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS**, add to Mechanical surfaces:
```
- sample-library: inner-ai-defaults/sample-library.yaml (SP-001..SP-007 — positive/negative pairs)
- trigger-vocabulary: inner-ai-defaults/trigger-vocabulary.md (words that activate training defaults)
- alternative-vocabulary: inner-ai-defaults/alternative-vocabulary.md (CSPS replacements)
```

**In B_THRESHOLD_INTAKE_PROTOCOL** (if it exists as a contract), add:
```
Cross-reference: P-META-024 (multi-topic decomposition — fires before P-META-023 when N topics detected)
```

**In B_INTENT_CRYSTALLIZATION**, add:
```
Cross-reference: P-META-024 (when a single expression contains N topics, apply P-META-024 first)
```

---

### P2-2: AGENTS.md — Add 2 cross-references (must stay under 200 lines)

AGENTS.md currently has only 1 reference to new principles (P-META-024 compressed line). Two more needed, but AGENTS.md is at line limit. Approach: compress an existing verbose section by 2 lines, add 2 new one-line cross-references:

**Add near the AI-behavior section (compressed to fit):**
```
- ✅ **P-META-022 + P-META-023 active** — crystallize intent before acting (L1→L3); every app session runs I→VI (threshold-intake-protocol.md). Full: human-intent-crystallization.md.
- ✅ **PACP active (DNA Element 17)** — 14 participant types govern trust/context/protocol. Every API endpoint + page declares target_participant. Full: participant-protocol.md.
```

Track lines carefully. If adding 2 lines requires removing 2 elsewhere: find 2 lines in the verbose sections (like the BEDROCK FIRST note that's now stale — bedrock IS 22/22) and remove them.

---

### P2-3: virtual-opus-audit.md — Add SP-001 through SP-007 patterns

The virtual Opus audit should incorporate the 7 behavioral sample pairs. Add a section:

```markdown
## Pattern 10 — Behavioral Default Detection (Drive Don't Fight)

Before any consequential action, run 5 self-checks from inner-ai-defaults/sample-library.yaml:

SP-001 self-check: "Am I reporting what I DID, or showing what EXISTS as a result?"
SP-002 self-check: "Am I agreeing because I have evidence, or because it's comfortable?"
SP-003 self-check: "Am I covering all listed items instead of focal-pointing the highest PE?"
SP-004 self-check: "Am I narrating what I did instead of showing the result?"
SP-005 self-check: "Is there a crystallization question I should ask before acting?"

If any answer is "I'm doing the default": escalate to Opus or pause and crystallize.
```

---

### P2-4: frontmatter-closed-enums.md — Add target_participant closed enum

Per PACP (DNA Element 17), `target_participant:` needs a closed enum. Add:

```markdown
### `target_participant:` — participant type this artifact serves (DNA Element 17 — PACP)
See: participant-protocol.md for full definitions.

target_participant:
  governor.primary | developer.platform | developer.app | developer.api |
  user.solo | user.team.member | user.team.admin | user.enterprise | user.trial |
  ai.sonnet | ai.opus | ai.haiku | ai.agent | ai.external |
  platform (for artifacts serving all participants equally)

Required for: new API endpoints, UI pages, validator scripts, skills, protocol docs
```

---

### P2-5: Core Seeds grows_to definitions — UPDATE (Opus defined, Sonnet implements)

The 3 core seeds planted in the platform need `grows_to:` declarations. Opus specifies; Sonnet adds to the seed files:

**Seed 1** (context orchestrator): grows_to `tools/config/context-orchestrator-mode-config.yaml` (LIGHTWEIGHT/COMPREHENSIVE selection logic)

**Seed 2** (schema registry): ALREADY GROWN (schema-registry.md created this session) → remove seed marker, mark as GROWN

**Seed 3** (enforcement coverage): grows_to `tools/validators/validate-opus-rzf-gap-tracking.mjs` (the ZF production chain validator)

Update `validate-core-seeds.mjs` and mark Seed 2 as resolved.

---

## §P3 — POLISH (do after P2, can be batched)

---

### P3-1: gradual-build-plan.template.md — Add §0 CONSOLIDATION CHECK

**Already has:** goal_statement, done_criteria, failure_signal, template_grade ✓

**Missing:** The mandatory §0 CONSOLIDATION CHECK section body (the plan-creation-protocol requires it; the template should scaffold it automatically):

```markdown
## §0 — CONSOLIDATION CHECK

CHECK WHAT EXISTS before any implementation step in this plan.
- Search: tools/validators/ for existing coverage
- Search: tools/generators/ for existing generators
- Search: .claude/hooks/ for existing hooks
- Search: audit-runner.md for registered slugs
- Search: docs/plan/_handoff/VAULT/topic-plans/ for overlapping plans
- Search: libs/ for existing integrations
Consolidation finding: [NONE FOUND | EXTENDING: {path}]
```

---

### P3-2: skill files — Add template_grade and P-META-022 links

Scan all .claude/skills/*/SKILL.md files. Add to any skill that involves user-facing communication or intake:
```yaml
template_grade: B
links:
  - { rel: p-meta-022, href: ../../../../docs/plan/pillar-0-governance/human-intent-crystallization.md }
```

Priority skills: threshold-intake skill (if exists), governance-session skill, slim-handoff skill.

---

### P3-3: opus-brief.template.md — Add CEC section

Per Turn 18, the OPUS MODE BRIEF template needs a CEC section:

After the `## RZF VERIFICATION` section block, add:

```markdown
## CEC — POSITIVE (extracting compound value)
Significant event: [what happened that has compound value]
Essence: [one sentence]
Walk:
  [Surface 1]: [applied YES/NO — if YES: cite artifact or commit sha]
  [Surface 2]: [applied YES/NO]
Walk-trail: [N] cycles | [N] new applications | [N] artifacts updated
```

---

### P3-4: schema-registry.md — Populate initial anchor entries

The schema-registry.md exists but entries may be sparse. Minimum required entries:

| anchor | type | resolves_to | spine | l2_domain |
|---|---|---|---|---|
| pillar_0_governance_leaves | governance-section | docs/plan/pillar-0-governance/ | GVRN | L2_DOMAIN_GVRN_DECISION_RIGHTS_CLARITY |
| platform_governance | governance-section | docs/plan/pillar-0-governance/csps-core-manifest.md | GVRN | L2_DOMAIN_GVRN_ACCOUNTABILITY |
| topic_plans | governance-section | docs/plan/_handoff/VAULT/topic-plans/ | GVRN | L2_DOMAIN_GVRN_DECISION_RIGHTS_CLARITY |
| inner_ai_defaults | governance-section | docs/plan/_handoff/VAULT/inner-ai-defaults/ | AI | L2_DOMAIN_AI_INNER_DEFAULTS_OVERRIDE |
| opus_consultations | governance-section | tools/council/ | AI | L2_DOMAIN_AI_ALIGNMENT_PROTOCOL |
| core_spines_l2_domain | governance-section | .claude/core-spines/ | ARCH | L2_DOMAIN_ARCH_SCHEMA_GOVERNANCE |
| schema_index | governance-section | docs/plan/pillar-0-governance/schema-registry.md | ARCH | L2_DOMAIN_ARCH_SCHEMA_GOVERNANCE |

---

## VERIFICATION SEQUENCE (run in order after all sections)

```bash
# 1. Slice sync
pnpm --filter @csps/principles split
pnpm audit-runner:split

# 2. New file alignment check
node tools/validators/validate-universal-alignment.mjs --scan-new

# 3. Full verify
node tools/verify.mjs
# Must show exit_code=0

# 4. Health check
pnpm health
# Target: maintain current score (11/17)

# 5. Commit message format
git commit -m "S028: Comprehensive platform alignment — all surfaces consistent with S021-S027 new principles"
git push origin main
```

---

## WHAT OPUS IS DOING IN PARALLEL

While Sonnet implements P1-P3 above, Opus is working on:
1. spine-graduation-principle.md (governance doc — Opus-appropriate)
2. L3 instance populator final spec
3. Core seeds grows_to definitions (Turn 18 scope)

These are in `tools/council/` and `docs/plan/pillar-0-governance/` — safe to run parallel per Option C domain separation.

---

*Comprehensive Alignment Brief S027 | OPUS-1 | 2026-05-13*
*End state: all files, protocols, wizards, instructions, personas, agents, skills consistent and complete*
*Real zero findings = every surface aligned against S021-S027 new principles*
