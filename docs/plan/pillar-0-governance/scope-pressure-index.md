---
id: csps.pillar-0.scope-pressure-index
name: scope-pressure-index
description: >
  The Scope Pressure Index (SPI) — the quantitative formula for computing implementation
  complexity before any planning begins. Prevents over-bundled sessions, freelance AI
  scope expansion, and constitutional drift. SPI < 0.5 = proceed; SPI > 4.0 = blocked.
  Extends the mini-tree architecture from documentation files to plans and features.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, ARCH, VALD]
schema_anchor: pillar_0_governance_leaves
domain_path: platform
template_grade: A
diataxis_type: reference
session: S029
impl_status: swift-implemented
links:
  - { rel: mini-tree-template, href: ../../../tools/templates/mini-tree-intro.template.md }
  - { rel: capacity-registry, href: ../../../tools/config/platform-capacity-registry.yaml }
  - { rel: plan-protocol, href: ./plan-creation-protocol.md }
  - { rel: validator, href: ../../../tools/validators/validate-plan-complexity.mjs }
scope_level: S1
---

# Scope Pressure Index (SPI)

> **The formula that prevents AI from over-bundling sessions, freelancing scope, and breaking
> the platform with unchecked complexity.** Every plan computes SPI before implementation.
> No implementation begins until SPI is within session budget.

---

## §1 — The Formula

```
SPI = (L × C × I) / session_budget

Where session_budget = 100 (normalized, one Sonnet session)
```

### L — Length Score (trivial to measure)

```
L = files_changed 
  + (validators_added × 3)
  + (schema_changes × 5)
  + (API_routes_changed × 2)

Line weight adjustment (prevents gaming):
  L_adjusted = max(L, actual_lines_changed / 50)
  Cap: L_adjusted ≤ L × 3
```

### C — Complexity Multiplier (requires judgment, not just counting)

```
C = base × scope_weight

base — what TYPE of work:
  1.0  documentation / config / renaming / ADRs
  1.5  UI components / frontend pages / CSS
  2.5  API routes / database schema / auth patterns
  4.0  constitutional (S0) / billing lifecycle / GDPR / security policies

scope_weight — how many SCOPE LEVELS are crossed:
  S0 touched → weight 4
  S1 touched → weight 3
  S2 touched → weight 2
  S3+ touched → weight 1
  Use MAX scope level touched (not sum)
  
Example: a billing cancellation flow touches S0 (GDPR) + S1 (platform billing) + S3 (tenant data):
  base = 4.0 (constitutional), scope_weight = 4 (max = S0)
  C = 4.0 × 4 = 16.0
```

### I — Interdependency Score

```
I = 1.0 
  + (items_this_blocks × 0.5)
  + (new_patterns_introduced × 0.5)

A change that blocks 3 downstream items AND introduces 2 new patterns:
  I = 1.0 + (3 × 0.5) + (2 × 0.5) = 3.5
```

---

## §2 — Thresholds and Actions

| SPI | Status | Action required |
|---|---|---|
| < 0.5 | ✅ PROCEED | Single session, no splitting needed |
| 0.5 – 1.0 | ⚠ MILESTONE | Single session with explicit midpoint gate |
| 1.0 – 2.0 | ✂ SPLIT | Split into 2 sessions (each must be SPI < 0.5) |
| 2.0 – 4.0 | 🔍 OPUS REVIEW | Split into 3+ sessions + Opus review before Session 1 |
| > 4.0 | 🚫 BLOCKED | Redesign scope before any implementation |

---

## §3 — The Triggered Protocol (Non-Negotiable)

When SPI threshold is exceeded, the AI MUST:

```
1. DECLARE: "COMPLEXITY GATE TRIGGERED. SPI=[computed]. Threshold=[threshold]."

2. PRESENT mini-tree split (never freestyle):
   "Proposed session split:
     Session 1: [specific scope] | SPI=[N1] | estimate: [time]
     Session 2: [specific scope] | SPI=[N2] | estimate: [time]
     Total SPI reduced: [original] → max([N1, N2])"

3. WAIT for Governor to ratify or modify the split
   (no implementation begins before ratification)

4. UPDATE plan frontmatter with:
   spi_score: [N]
   split_sessions: [count]
   requires_opus_review: [true/false]

5. BEGIN Session 1 ONLY after ratification
```

**PROHIBITED:**
- Proceeding with original over-budget scope
- "I'll try to fit it"
- Reducing scope silently without declaration
- Any implementation before Governor ratifies

---

## §4 — Reference Table: Common Planning Situations

### Developer Frontend (building on CSPS)

| Situation | SPI est. | Gate |
|---|---|---|
| Add new data entity to app | 0.13 | None |
| Add AI persona / skill | 0.30 | None |
| Integrate third-party API | 0.60 | Milestone |
| Build onboarding flow | 0.75 | Milestone |
| **Multi-tenant billing** | **4.8** | **BLOCKED** |

### External User Frontend (end-user experience)

| Situation | SPI est. | Gate |
|---|---|---|
| Sign up + onboarding | 0.25 | None |
| Configure settings | 0.16 | None |
| **Export all data (GDPR)** | **3.2** | **BLOCKED** |
| **Cancel subscription + delete data** | **4.8** | **BLOCKED** |
| Team admin: permissions + billing | 0.75 | Milestone |

> **Pattern:** Any feature touching S0 (GDPR, security, billing lifecycle) is BLOCKED by default.
> These require constitutional workflow: Opus review → split into 3+ sessions.

---

## §5 — Mini-Tree Extension (Three Levels)

```
Level 1 — FILE mini-tree (existing):
  Trigger: file > 300 lines AND 3+ H2 sections
  Split: N sub-files with intro+index
  Validator: file-complexity-threshold

Level 2 — SESSION mini-tree (new, S029):
  Trigger: SPI > 1.0 for implementation task
  Split: N sessions, each SPI < 0.5
  Validator: validate-plan-complexity.mjs

Level 3 — FEATURE mini-tree (new, S029):
  Trigger: feature crosses 3+ scope levels
  Split: constitutional → platform → app (sequential sessions)
  Gate: SPI > 2.0 → Opus review before splitting
```

Same template (`mini-tree-intro.template.md`) at every level.
Same governance. Fractal decomposition.

---

## §6 — Plan Frontmatter Fields (Required for Implementation Plans)

```yaml
# Add to gradual-build-plan.template.md:
spi_score: 0.0          # computed at plan creation — AI fills this
spi_session_budget: 0.5 # max SPI per session within this plan
split_sessions: 1       # how many sessions this plan uses
requires_opus_review: false  # true when spi_score > 2.0
milestone_gates:
  - after_step: 2       # where midpoint gate fires (for SPI 0.5-1.0)
```

---

## §7 — Validator Spec: validate-plan-complexity.mjs

```javascript
// Reads all active topic-plans
// Extracts: spi_score, split_sessions, requires_opus_review from frontmatter
// If spi_score missing: compute from scale_sensitivity fields
// Checks:
//   spi_score > 1.0 AND split_sessions == 1: ADVISORY
//   spi_score > 2.0 AND requires_opus_review == false: ADVISORY
//   spi_score > 4.0: BLOCKING
// Output: session plan SPI summary
```

Wire into: `pnpm verify` + `pnpm health` weekly report + audit-runner.md slug `plan-complexity-gate`

---

*Scope Pressure Index — SPI | P-META-025 (C&I) applies: the intent is preventing over-complexity, not enforcing the number. SPI is evidence of complexity, not a compliance target.*
*S029 | Governor directive: never freestyle — all must be mechanically enforced*
