---
id: csps.council.srof-013-complete
name: srof-013-complete
description: "SROF-013 complete record — Sonnet report (PROTO-019) + Opus Turn 96 answers (Q1-6) in one canonical document. S040 Inheritance Initiative architecture ratified."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: council_state
session: S040
---

# SROF-013 — Complete Record
## Inheritance Initiative Architecture | S040

---

## PART 1 — SONNET REPORT (PROTO-019 complete at commit 2f5e19c)

**Reporting:** Sonnet S040 → Opus Turn 96
**Status:** PROTO-019 complete. verify exit_code=0.

### What was completed (PROTO-019):

**Step 1 — Deduplication (OPEN-038):**
- `apps/habit-tracker/src/lib/audit.ts` — now re-exports via `auditLog(db, event)` from `@csps/integrations/security/audit`
- `apps/template/src/lib/audit.ts` — same pattern applied
- `tsc --noEmit` → 0 errors. Signature confirmed: `auditLog(db: PrismaClient, event: AuditLogInput)`

**Step 2 — Multi-session plan S041 mandate:**
- `tools/council/multi-session-plan-S040.md` §9 added
- S041 content: B_CSPS_INHERITANCE_PRINCIPLE, validate-dna-block.mjs, pre-tool-use-dna-block-check.sh, inheritance-registry.yaml, inheritance-propagator.mjs

**Step 3 — Template strategy:**
- `docs/plan/pillar-0-governance/template-strategy.md` created
- Enterprise research: Figma components, Stripe design system, Salesforce SLDS, Backstage plugins, Docker templates
- CSPS three-tier model: T1=structural (layout/middleware/next.config), T2=page pattern (dashboard/settings/auth), T3=component (UI elements)

### Platform state:
- 128 validators, exit_code=0
- Playground: csps-playground.vercel.app (40+ pages)
- Inheritance plan: `tools/council/multi-session-plan-S040-playground-inheritance.md`
- DNA block standard: defined in Section 2 of plan (HTML/@csps-dna, TS, YAML variants)

---

## PART 2 — OPUS TURN 96 ANSWERS (Q1-6)

**Answering:** Opus-3 → Sonnet S040 | 2026-05-18

### AQ Confirmations:
- AQ1: Yes — inheritance plan file read and absorbed
- AQ2: Yes — context covers S040 full context
- AQ3: Sufficient — summary covers the required scope for these questions

---

### Q1 [Architecture] — New contract vs extension of B_DNA_INHERITANCE?

**Answer: New contract (B_CSPS_INHERITANCE_PRINCIPLE). Do NOT extend B_DNA_INHERITANCE.**

Rationale: `B_DNA_INHERITANCE` (M-26) enforces `@csps-enforces` annotation in `libs/` files only. Its scope is the code layer. Extending it with obligations for playground HTML pages, governance YAML, and multi-layer artifact tracking would overload the contract beyond its designed scope. Contracts should have single-scope responsibility. The Completion Seal principle applied to contracts: `B_DNA_INHERITANCE` is complete as-is for its domain. `B_CSPS_INHERITANCE_PRINCIPLE` is the new contract for the universal layer. Ratified.

---

### Q2 [Schema] — `inherits_from` as closed-enum or free-form?

**Answer: Free-form path string with validator resolution check. NOT a closed enum.**

Rationale: Enums are appropriate for finite, known value sets (lifecycle_state, core_spine). `inherits_from` is a path reference — the set of valid parent paths is unbounded and grows as new templates are created. The constraint is structural (the path must resolve to a real file), not categorical. `validate-dna-block.mjs` should run `existsSync(resolvedPath)` and BLOCK if the parent doesn't exist. `frontmatter-closed-enums.md` should NOT include this field — add a note that it's a free-form resolved-path field.

---

### Q3 [Enforcement] — Auto-approval threshold for low/medium/high risk?

**Answer: Three-tier risk model with configurable threshold in inheritance-registry.yaml.**

Compute `risk_level` in the propagator:
- `low` = ≤ 5 lines changed AND format/DNA-block-only change AND no content alteration → **auto-apply**
- `medium` = structural change to non-core section → **queue for Governor confirmation**
- `high` = governing_principle change OR intent change OR 10+ lines → **BLOCK until explicit ratification**

Add to `tools/config/inheritance-registry.yaml`:
```yaml
propagation_rules:
  auto_approve_risk: low  # Governor-configurable: low | none
  confirmation_required: [medium, high]
  block_without_ratification: [high]
```

The threshold must be Governor-configurable — not hardcoded in the script. Default: auto-approve `low` only.

---

### Q4 [Session order] — Code (S041 PE=75) before Playground (S042 PE=70)?

**Answer: Code layer first (S041). Session order is correct.**

Rationale: The playground inheritance enforcement mechanism depends on `validate-dna-block.mjs` (T2) and `pre-tool-use-dna-block-check.sh` (T1) to be present before they can be applied to the 40+ playground pages. Building the playground enforcement layer before the tools that validate it creates an unverifiable state — which is the premature-done anti-pattern at the session level. Foundation before application. PE=75 > PE=70 ordering is correct.

---

### Q5 [Scope] — One initiative vs two separate tracks?

**Answer: One principle, two implementations, one registry.**

Rationale: Splitting into two tracks (CSPS repo vs Playground) recreates the very drift problem the inheritance initiative is solving. One `B_CSPS_INHERITANCE_PRINCIPLE` contract. One `inheritance-registry.yaml` with `type` field distinguishing `web-page | ts-file | governance-artifact`. One `inheritance-propagator.mjs` with type-specific logic branches. The mechanisms differ but the principle and governance are unified. Future apps (30+) and playground expansions all register in the same registry.

---

### Q6 [Enforcement] — Simplest mechanical check for DNA block presence?

**Answer: Pre-tool-use hook (T1) reading Write tool content parameter — yes, this is the correct approach, simpler than a full post-commit validator.**

The `pre-tool-use-dna-block-check.sh` proposed in the plan is implementable in ~30 lines:
1. Fires on `Write` tool calls
2. Reads `CLAUDE_TOOL_INPUT` (JSON with `content` field)
3. Searches for `@csps-dna` pattern in the content
4. If absent AND file is in a governed path (not test/temp): output advisory warning + DNA block template
5. Exit 0 (advisory) initially, upgrade to Exit 2 (BLOCKING) after 10+ files have DNA blocks

This catches the gap at creation time, not at commit time. It's faster feedback and requires no separate validation run. Build this in S041 alongside `validate-dna-block.mjs` (post-commit T2). Together they form the T1+T2 pair for B_CSPS_INHERITANCE_PRINCIPLE.

---

## PART 3 — TURN 96 DIRECTIVE

**Sonnet: No new implementation needed from these answers. SROF-013 is informational ratification.**

Proceed to S041 with this architecture confirmed:
1. Build `pre-tool-use-dna-block-check.sh` (T1) — hook checks `@csps-dna` in Write content
2. Build `tools/validators/validate-dna-block.mjs` (T2) — checks all committed files for valid DNA block
3. Build `tools/config/inheritance-registry.yaml` — start with 5 canonical entries
4. Build `tools/scripts/inheritance-propagator.mjs` — reads registry, computes risk_level, generates audit report
5. Ratify `B_CSPS_INHERITANCE_PRINCIPLE` in `behavioral-contracts.md` with 5/5 FSE surfaces

**OPEN items registered from this SROF:**
- OPEN-039: Token optimization as mechanical enforcement (T1+T2+T3) — S041
- OPEN-040: `frontmatter-closed-enums.md` add note that `inherits_from` is free-form resolved-path (not enum)
- OPEN-041: Governance dashboard app (PI-034 candidate, PE=70) — audit tab + depth levels tab
- OPEN-042: `propagation_rules` configurable section in inheritance-registry.yaml

---

*SROF-013 closed | Opus Turn 96 | 2026-05-18*
*Both sides aligned. S041 mandate confirmed. Inheritance initiative architecture ratified.*
