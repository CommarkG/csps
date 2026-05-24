---
id: csps.governance.permanence-protocol
name: PERMANENCE-PROTOCOL
description: "Creation-time protocol for making every new rule permanent. Enforces the permanence-by-default mandate: every new governance artifact gets T1+T2+T3 at creation, not as an afterthought. This is the actionable checklist; permanence-mechanics.md is the explanation."
type: governance
diataxis_type: how-to
protection_level: constitutional
impl_status: swift-implemented
status: ratified
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
version: "1.0"
session: S060
owner: group:finky
lifecycle: production
lifecycle_state: active
ns_quality: [governed-without-rigidity, self-improving]
context_question: "Are you about to create a new rule/contract/principle? Have you named the T1 hook, T2 validator, and T3 injection? If not: this document tells you exactly what to do."
context_quote: "Writing a rule is 0% complete. T1+T2+T3 is 100% complete."
links:
  - { rel: mechanics, href: ../../_handoff/VAULT/inner-ai-defaults/permanence-mechanics.md }
  - { rel: north-star, href: CSPS-NORTH-STAR.md }
  - { rel: validator, href: ../../../tools/validators/validate-permanence-coverage.mjs }
  - { rel: template, href: ../../../tools/templates/b-star-contract.template.md }
enforcement_trio:
  T1: ".claude/hooks/pre-tool-use-permanence-gate.sh"
  T2: "tools/validators/validate-permanence-coverage.mjs"
  T3: "tools/scripts/session-open-context.mjs (D1 permanence score)"
  coverage: "T1+T2+T3"
  status: "active"
---

# Permanence Protocol — Creation-Time Checklist

> **Use this every time you create a new rule, contract, principle, or hook.**
> Skip nothing. The point of this protocol is that permanence happens at creation, not later.
>
> — S060 Governor directive: "the default in each creation will be to be permanent and to be inherited"

---

## The 5-Step Creation Gate (mandatory before shipping ANY governance artifact)

### Step 1: T2 first — name the validator

Before writing the rule: name the `tools/validators/validate-*.mjs` file that will catch violations.

```
Q: What validator will catch violations of this rule at pnpm verify time?
A: tools/validators/validate-[NAME].mjs
Status: ACTIVE (exists) | PLANNED-S[NNN] (deferred)
```

**Why T2 first:** The validator defines what "compliant" means precisely. If you can't name it, the rule isn't defined precisely enough.

**If validator doesn't exist yet:** Write the slug + register in audit-runner.md in the SAME COMMIT. Implementation can defer; registration cannot.

---

### Step 2: T1 next — name the pre-creation hook

Name the `.claude/hooks/pre-tool-use-*.sh` that fires BEFORE violations can be written.

```
Q: What hook fires before someone can violate this rule?
A: .claude/hooks/pre-tool-use-[NAME].sh
Status: ACTIVE (exists) | PLANNED-S[NNN] (deferred)
```

**Why T1 matters:** Without T1, violations enter the codebase and must be caught after the fact. T2 catches them; T1 prevents them. Prevention > detection.

**If no T1 exists:** Explicitly note `T1: planned-SNNN` in enforcement_trio. Don't omit it silently.

---

### Step 3: T3 — name the session injection point

Name WHERE in `tools/scripts/session-open-context.mjs` or `tools/templates/startup.template.md` this rule will appear.

```
Q: Where does the AI learn about this rule at session start?
A: tools/scripts/session-open-context.mjs line [N] | startup.template.md §[N]
```

**Why T3 matters:** AI reverts to training defaults between sessions. T3 is how rules survive context resets. Without T3, Sonnet and Opus will unknowingly violate the rule.

---

### Step 4: Write enforcement_trio in the artifact

Every new behavioral contract, principle, and governance document must declare:

```yaml
enforcement_trio:
  T1: ".claude/hooks/pre-tool-use-NAME.sh"
  T2: "tools/validators/validate-NAME.mjs"
  T3: "tools/scripts/session-open-context.mjs"
  coverage: "T1+T2+T3"        # or "T2+T3" or "T3-only" + rationale
  status: "active"             # or "planned-SNNN"
```

**This field is parsed by `validate-permanence-coverage.mjs`.** If it's absent, the artifact counts as no-enforcement in the platform permanence score.

---

### Step 5: Verify the inheritance chain

Ask: "What parent artifact does this inherit from?"

```
Q: Which Platform Genome section does this inherit from?
Q: Does the parent have T1+T2+T3? Does this artifact inherit or extend those?
Q: If this artifact is deleted tomorrow, does enforcement survive in the parent?
```

**Inheritance principle:** Child artifacts don't need to duplicate parent enforcement. They declare `inherits_enforcement_from: [parent-id]` and extend as needed.

---

## The Permanence Quick-Check (4 questions before claiming DONE)

1. **T1**: Can you name the `.claude/hooks/pre-tool-use-*.sh` file? (YES = T1 covered)
2. **T2**: Can you name the `tools/validators/validate-*.mjs` file? (YES = T2 covered)
3. **T3**: Can you cite `session-open-context.mjs` line or template section? (YES = T3 covered)
4. **Evidence**: Does `node tools/verify.mjs` show exit_code=0 with this validator's name in the output? (YES = verified permanent)

**If any answer is NO**: it is not permanent. Note what's missing in enforcement_trio. Create a gap register entry if it's recurring.

---

## Permanence Tiers

| Tier | Definition | Drift risk |
|------|-----------|-----------|
| **Ephemeral** | Chat only | Evaporates at session end |
| **Documented** | markdown file, no enforcement | Drifts in 2-3 sessions |
| **T3-aware** | In session-open injection | AI-dependent, drifts with training |
| **T2-enforced** | Validator in pnpm verify | Violations caught after the fact |
| **T1-prevented** | Pre-creation hook active | Violations prevented before writing |
| **PERMANENT** | T1+T2+T3 all active | Mechanically enforced; survives tab switches, context limits, model updates |

---

## Inheritance Protocol (for child artifacts)

When creating an artifact that derives from an existing governed artifact:

```yaml
# In the child artifact's frontmatter:
inherits_enforcement_from: "csps.governance.parent-id"
enforcement_extension:
  T1: ".claude/hooks/pre-tool-use-NAME-extended.sh"  # or "inherits"
  T2: "tools/validators/validate-NAME-extended.mjs"   # or "inherits"
  T3: "inherits"                                       # or new injection point
```

**"inherits" means:** The parent's T1/T2/T3 covers this child. No new enforcement needed unless the child adds behavior the parent doesn't cover.

**Inheritance chain audit:** `validate-permanence-coverage.mjs` will eventually check orphan artifacts (no parent, no enforcement). For now, it reports missing mechanical surfaces.

---

## What "Permanent" Is NOT

Governance theater — writing that something is "permanently enforced" without T1+T2+T3 is worse than not writing it at all. It creates false confidence.

The test is not:
- ❌ "I wrote it in the contract"
- ❌ "I added it to the startup block"
- ❌ "I created a memory entry"
- ❌ "I mentioned it in the HANDOFF"
- ❌ "It's in AGENTS.md"

The test is:
- ✅ `pnpm verify` passes and shows the validator's name in output
- ✅ Pre-tool-use hook fires on new artifact creation
- ✅ Session-open injection confirmed in `session-open-context.mjs`
- ✅ `validate-permanence-coverage.mjs` counts this contract as full_trio

---

## Platform Permanence Score

Current baseline (S060): **53% T1+T2+T3 coverage** (35/66 contracts).

Target progression:
- S060: 53% (current baseline — first time measured)
- S065: 65% (10% improvement — add enforcement_trio to existing partial contracts)
- S070: 80% (add T1 hooks for the 21 partial contracts)
- S075: 90% (only legacy/deferred contracts below threshold)

`validate-permanence-coverage.mjs` tracks this score. It appears in session-open D1 context.

---

*PERMANENCE-PROTOCOL v1.0 | S060 | RATIFIED*
*Enforced by: pre-tool-use-permanence-gate.sh (T1) + validate-permanence-coverage.mjs (T2) + session-open D1 injection (T3)*
