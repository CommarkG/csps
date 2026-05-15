---
id: csps.handoff.vault.inner-ai-defaults.enforcement-coverage
name: enforcement-coverage
description: >
  Map of which AI behavior defaults have live structural validators vs. which
  rely on AI cooperation only. Part of CHUNK 5 (Structural Enforcement) in the
  "Drive Don't Fight" architecture. Target: 5% enforcement rate increase per session.
  Current: 41% (15/37 entries). SP-004 file-narration + governance-debt + file-narration-default added S027+/S028. Governor ratified: S026 Opus Turn 12.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
session: S026
core_spine: AI
schema_anchor: vault_files
links:
  - { rel: parent, href: ./README.md }
  - { rel: enforcement-rate, href: ../../../../tools/validators/validate-inner-ai-defaults-enforcement-rate.mjs }
  - { rel: sample-library, href: ./sample-library.yaml }
scope_level: S1
---

# Enforcement Coverage Map

> **Current enforcement rate: 41% (15/37 entries).**
> 59% of behavioral overrides rely on AI cooperation only — no live validator.
> Target: 50% by S030 (5% per session).

---

## Coverage Summary (S027)

| Status | Count | What it means |
|---|---|---|
| ✅ Live validator | 12 | Structural enforcement — fires regardless of AI cooperation |
| ⚠️ Deferred (week-4) | 21 | Declared but not built |
| ❓ Unclear | 1 | Coverage status ambiguous |

---

## Priority Gap List (highest-drift defaults with NO live validator)

These are the defaults that cause most CSPS drift — yet have no structural enforcement:

| Default | Category | Drift frequency | Why no validator yet | PE for validator |
|---|---|---|---|---|
| **Satisfaction point (T1)** | satisfaction | Very high | Hard to detect in output text | 70 |
| **Agreement bias (T2)** | agreement | High | Requires response analysis | 68 |
| **File narration (T5)** | satisfaction | High | Hard to distinguish from valid summary | 65 |
| **Context pressure → default (T6)** | context | Medium | Requires session-context tracking | 60 |
| **Crystallization bypass (T6)** | crystallization | High | Need to detect missing Q1-Q3 | 75 |
| **Comprehensive response (T3)** | comprehensive | Medium | Would need scope-creep detection | 55 |

---

## The 11 Live Validators (what's working)

Per `validate-inner-ai-defaults-enforcement-rate.mjs` output:

1. **Satisfaction point declarations** — `post-stop-pnpm-verify.sh` (partial, at session close)
2. **Agreement bias** — `post-stop-banned-phrase.sh` (catches "great job", "well done" etc.)
3. **Context loading depth** — `validate-token-budget.mjs` (R1 depth check)
4. **File narration** — `post-stop-link-discipline.sh` (link-not-narration check)
5. **Session-artifact-triggers-chat-close** — registered in reasoning-patterns.md (advisory)
6. **Subagent spawn without preamble** — `pre-tool-use-skill-aap-required.sh` + AAP hook
7. **B_VALIDATE_BEFORE_ASSUME** — `post-tool-use-validate-before-assume.sh`
8. **Naming policy** — `pre-tool-use-frontmatter-enum-check.sh`
9. **Frontmatter compliance** — `validate-frontmatter.mjs`
10. **PE alignment** — PE dashboard shows deviation from PE ordering
11. **Comprehensive response (SP-003)** — `validate-comprehensive-response.mjs` (T3 triggers + Done-item heuristic + raw-thoughts-queue check)
12. **Bottleneck blindness** — `validate-bottleneck-patterns.mjs` (Class A N+1 queries + Class B O(N) validators + Class C missing tenant index)

---

## The 21 Deferred (what needs building)

Per enforcement rate validator — these have `caught_by_validator: ... (impl deferred)`:

- prose-over-narration-detector (output preamble)
- prose-table-vs-prose-judgment (tables vs prose)
- end-summary-length-discipline (trailing summaries)
- inner-default-leak-detector (per-session drift)
- alignment-citation-on-substantial-output
- pcr-completeness-on-decisions
- naming-policy-compliance
- enhancement-proposal-coverage
- structural-fix-vs-instance-fix-discipline
- frontmatter-closed-enum-drift-prevention
- ... and 11 more

**Highest value to build first (K=2 promotion candidates):**
1. `crystallization-bypass-detector` — catches when AI acts without Q1-Q3 (SP-005 negative pattern)
2. `agreement-without-evidence-detector` — catches "good point" + agreement without PCR (SP-002 negative)
3. `satisfaction-at-declaration-detector` — catches "I've run X" without showing output (SP-001 negative)

---

## Session-by-Session Enforcement Growth Target

| Session | Target rate | Actual | How to get there |
|---|---|---|---|
| S026 | 33% | 33% (10→10, crystallization-bypass + SP-001 + SP-002 wired) | ✅ |
| S027 | 36% | 35% (12/34, SP-003 + bottleneck-blindness + diataxis-type) | ✅ close |
| S028 | 40% | — | Build satisfaction-at-declaration-detector (advisory) |
| S030 | 50% | — | Promote advisory detectors to blocking; K=2 promotion |

*Part of CHUNK 5 | Opus Turn 12 | Governor ratified S026 | SP-003 added S027*
