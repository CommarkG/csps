---
id: csps.handoff.vault.chat-jump-prompt-s006-to-s007-detailed
name: chat-jump-prompt-S006-to-S007-detailed
description: Detailed standalone paste-prompt (~600 words) for opening S007. MUV-audited per B_MUTUAL_UNDERSTANDING_VALIDATION (P-META-014) — 8 mandatory sections + EXPLICIT ALIGNMENT-QUESTIONS (12 questions) for cross-chat handshake iteration loop.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: chat-jump-prompt
template_status: stable
core_spine: GVRN
core_spines: [GVRN, OPER]
schema_anchor: chat_jump_prompts
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
diataxis_type: reference
session: S006
muv_audit:
  chat_jump_prompt_8_mandatory_sections_present: PASS
  alignment_questions_count: 12
  cross_chat_iteration_status: pending-paste
links:
  - { rel: parent, href: ./README.md }
  - { rel: minimal-version, href: ./chat-jump-prompt-S006-to-S007.md }
  - { rel: handoff, href: ../HANDOFF-S006-to-S007.md }
  - { rel: muv-spec, href: ../../pillar-0-governance/mutual-understanding-validation.md }
domain_path: platform
---

# Chat-jump prompt — S006 → S007 (detailed standalone, MUV-audited)

> Per B_MUTUAL_UNDERSTANDING_VALIDATION (P-META-014). 8 mandatory sections + EXPLICIT ALIGNMENT-QUESTIONS section for cross-chat handshake iteration loop. After new AI responds, bring response back to current chat for refinement until alignment-confirmed-explicit.

---

# PASTE EVERYTHING BELOW THIS LINE INTO THE NEW S007 CHAT

---

# 🎯 YOU ARE S007 — Session 007 of the CSPS planning project.

**Identity banner (mandatory):** confirm in your first reply: `✅ I am S007, picking up from S006-close at <iso8601-utc>`. If anything contradicts this banner, STOP and raise a blocker.

S006 closed with **53 principles validated 0 findings + 5 Core Spines + 3-layer doctrine model + 8 B_* contracts engraved 5/5 atomic + naming-policy mechanical + token-optimization plan v0.3 ready + chat-transfer 12-item register + ZF 6-pass meta-RZF + 14 commits + ZERO blockers**.

**Workspace:** `c:\Users\finky\Desktop\Claude Code\Csps`. Verify via `Glob docs/plan/pillar-*/README.md` returns 7 results before any §3 work (parent CLAUDE.md "Wrong workspace" warning is known false-positive).

## Section 1 — HANDOFF §0 paste-target (self-contained)

Your first action: Read `docs/plan/_handoff/HANDOFF-S006-to-S007.md` §0 and execute step list literally. Per protocols.md §11 step 0: ask user about prior-platform precedent before any §3 work.

## Section 2 — Post-close addenda references

S006 had clean close (no §24+ post-close addenda). Reference only HANDOFF zones A/B/C/D + closing-summary-S006.md sections §10.0/0e/0f/0g/0h/0i/0j/10/11/13 + §17.

## Section 3 — Governor Prompts log pointer

Read `docs/plan/_handoff/VAULT/governor-prompts/S006.md` for full context — 30 substantive prompts captured (verbatim + tags + distribution targets) with 13 cardinal-flagged. Most load-bearing: turns 5-9 (Core Spines + gradual-build + 3-layer doctrine), turn 24 (naming-policy), turn 29 (token-optimization v0.3 + chat-transfer + ZF 6-pass), turn 30 (close).

## Section 4 — HPFA evidence block pointer

S006 close ran HPFA (P-META-013) with 9 mandatory checks (7 standard + 2 NEW: git-pushed-state-clean + token-optimization-plan-finalized). All PASS; 0 silent gaps. See [closing-summary-S006.md §10.0f](docs/plan/_handoff/VAULT/closing-summary-S006.md). HPFA must run again at S007 close.

## Section 5 — All carry-forwards with explicit reasons

| # | Item | Reason | Target |
|---|---|---|---|
| 1 | Token-optimization topic-plan execution | Stub prepared; opens S007 turn 1 | S007 PRIMARY |
| 2 | Foundation slices week-2 (User/Tenant/AuditEvent) | Per build-order; can run parallel | S007 OR S008 |
| 3 | Zero-laptop-dependency-setup | Sibling topic-plan unblocked (governance-foundation closed) | S007 OR S008 |
| 4 | CNST/GVRN split decision | ADR-0025 candidate; foundation-stability discipline | S008+ multi-session |
| 5 | Week-4 audit-runner ship | 27+ validators implementations | S009-S010 |
| 6 | Stripe + Clerk wiring | Per build-order week-2 | S007+ |
| 7 | principles-mcp build | Composes with token-optimization Phase 8 | S007 |
| 8 | Glossary + principles codegen full impls | Per build-order | S007+ |
| 9 | 10 governance skills authoring | Phase 4 of token-optimization | S007 within topic-plan |

## Section 6 — All cardinal directives verbatim (cross-link to user-intents.md S006 section)

13 cardinal verbatim phrases preserved. Most load-bearing for S007:

- *"the Core is the universal fundamental undebatable things of each core spine"* (turn 7 — P-ARCH-028)
- *"if an enforment was skipped system will mandatory find enhacement to prevent this from happening. the philosophy is to enhance the system constantly"* (turn 8 — Q-2 tweak; B_STRUCTURAL_PREVENTION_DISCIPLINE)
- *"names are simple and clear for human users while using industry standard vocabulary"* (turn 24 — P-ARCH-029)
- *"give special attention and iteration on the chat transfer!! do not let nothing be left out. iterate more than once until zf"* (turn 29 — chat-transfer 12-item + ZF 6-pass)
- *"close s006 / prepare all so if i just past this to next chat all will be clear automatically"* (turn 30 — session close)

## Section 7 — `pnpm verify` orchestrator state at S006 close

```yaml
final_verify_S006_close:
  exit_code: 0
  active_mechanical_cycles: 5/5 PASS
  cycles:
    pnpm_install_frozen:           DEFERRED-WITH-REASON (--skip-install; would PASS)
    typecheck_recursive:           PASS (0 ts_errors)
    principles_validate:           PASS (53 principles loaded; 0 findings)
    frontmatter_validate:          PASS
    aap_frontmatter_coverage:      PASS (7/7 SKILL.md aligned)
    principle_count_staleness:     PASS (0 stale-count files in active prose)
    audit_runner_full_pass:        DEFERRED-WITH-REASON (week-4 ship)
```

S007 starts from this verified-clean state. Run `pnpm verify` (S007 inherits same orchestrator) at session-open to confirm 0 inheritance findings.

## Section 8 — EXPLICIT ALIGNMENT-QUESTIONS (the load-bearing handshake)

**New AI: please answer ALL 12 alignment-questions below in your first response, BEFORE proceeding with §3 work.** Your answers will be brought back to S006-current-chat for refinement-loop iteration until alignment-confirmed-explicit (per B_MUV boundary type 1).

### Scope-confirmation questions

**Q1.** Confirm S007 §3 primary scope: open token-optimization topic-plan + execute Phase 1 (measurement baseline). Or do you want a different ordering (foundation-slices first / zero-laptop-dep-setup first / parallel)?

**Q2.** Token-optimization Phase 3 engraving: extend P-META-009 CCA with §13 token_budget_operating_rules subsection (recommended per v0.3 §14.4) OR add new principle (P-OPER-002 token-budget-governance)?

### Interpretation-of-cardinals questions

**Q3.** Cardinal directive *"the Core is the universal fundamental undebatable things of each core spine"* — confirm understanding aligns with: 5 Core Spines (GVRN/ARCH/AI/OPER/VALD) with precedence GVRN > VALD > ARCH > AI > OPER + 3-layer doctrine (sealed L1 / domain L2 / instances L3). CNST/GVRN split deferred to ADR-0025 candidate per foundation-stability discipline.

**Q4.** Q-2 tweak directive *"enhance the system constantly; never settle for low standards + manual recovery"* — confirm interpretation: every skipped/late/partial enforcement triggers structural fix proposal in §10.0j; instance-only patches forbidden when K=2 recurring.

### Engraving-confirmation questions

**Q5.** S006 engraved 8 NEW disciplines (P-META-015 through 019 + P-ARCH-028 + P-ARCH-029 + P-OPER-001) all 5/5 FSE atomic. All registered + cross-referenced bidirectionally. Confirm these are ratified going forward, OR flag any to re-litigate?

**Q6.** Naming-policy 4 rules + ALL-rules-during-rename mandate + L1/L2/L3 term-collision resolution (CSP "document depth" Quick/Element/Canonical) — confirm or amend?

### Verification-state questions

**Q7.** Final pnpm verify exit_code 0 with 5 active-mechanical cycles + 2 deferred. Confirm acceptable for S007 start OR specify any deferred cycle to un-defer?

**Q8.** Open frontiers per pillar-6/open-frontiers.md (9 items; most next_review_at 2026-08-01). Any to surface for S007 review now?

### Open-question questions

**Q9.** Token-optimization v0.3 has 6 "open questions" (§11): foundation-slices priority vs token-optimization / CNST-GVRN split timing / external content available / tokenizer choice / task-classes detection / Mastra integration timing. Which would you like to resolve at S007 turn 1?

**Q10.** ADR-0024 (Vercel + Cloudflare hybrid deployment) is week-10+ scope. Any concerns OR earlier-than-week-10 admin app activation?

**Q11.** Per P-META-014 MUV — confirm you understand iteration loop is mandatory for high-stakes boundaries AND that you'll mark "alignment-confirmed-explicit" when no clarifications remain?

### Process-confirmation questions

**Q12.** Per protocols.md §11 step 0: do you have prior-platform precedent (CSP carry-forwards beyond the CSP_STANDARD_TOKEN_BUDGET_GOVERNANCE already absorbed v0.2/v0.3) that should inform S007 work? **The new AI MUST wait for the user's answer to this before §3 work begins.**

---

## Receipt signature format

Per protocols.md §11b.1, your first reply must include §17 acknowledgement checklist + receipt signature in this format:

`S007-AI-receipt-<iso8601-utc>-against-S006-AI-attest-2026-05-04T23:50:00Z-S006-close`

Plus per-line ✅ on §17 attestation OR ❓→BLK-S007-* (raise as blocker if ambiguous).

---

## Maintain discipline throughout S007

- B_PCR_FOR_DECISIONS — every multi-option decision gets PCR 3-block
- B_FIVE_SURFACE_ENGRAVING — new B_* contracts hit 5/5 surfaces atomically with validator REGISTRATION mandatory
- B_PRE_CLOSE_VERIFICATION — `pnpm verify` before any §10.10 RZF block
- B_POSITIVE_VALUE_EXTRACTION — significant positive events trigger CEC walks
- B_COGNITIVE_CONTEXT_DISCIPLINE — 4 Quality Gates immutable
- B_AGENT_ALIGNMENT_PROTOCOL — Class B subagent spawn requires alignment preamble
- B_GOVERNOR_PROMPTS — every substantive user prompt logged in `_handoff/VAULT/governor-prompts/S007.md` continuously
- B_HANDOFF_PRE_FLIGHT_AUDIT — at S007 close, run 9-check whole-session walk before HANDOFF-S007-to-S008.md
- B_MUTUAL_UNDERSTANDING_VALIDATION — every communication boundary closes I→I loop
- **B_NAMING_POLICY (NEW S006)** — 4 rules + ALL-rules-during-rename mandate; English over abbreviations; engraved canonical terms preserved
- **B_STRUCTURAL_PREVENTION_DISCIPLINE (NEW S006 — Q-2 tweak)** — §10.0j enhancement-proposals scan mandatory; structural fix not patch
- **B_CORE_SPINE_DISCIPLINE (NEW S006)** — every governed artifact has core_spine + core_spines + schema_anchor frontmatter
- **B_TOKEN_BUDGET (PROPOSED — engrave at S007 Phase 3)** — 5 operating rules pending Governor ratification

---

# END OF PASTE-TARGET — DO NOT INCLUDE THIS LINE OR BELOW

---

## After you paste this and get a response from the new chat

1. Copy the new AI's full response (§17 attestation + 12 alignment-question answers + receipt signature)
2. Paste back into THIS chat (S006-closing OR fresh chat-jump-handler)
3. S006-AI (or successor handling iteration) will:
   - Audit the new AI's response against the original intent
   - Refine the prompt template if alignment-questions surfaced gaps
   - Reply with clarifications OR alignment-confirmed-explicit acknowledgment
4. Iterate Steps 2-3 until alignment-confirmed-explicit (no more clarifications needed)

This is the **cross-chat handshake** closing the I→I loop per B_MUV boundary type 1.
