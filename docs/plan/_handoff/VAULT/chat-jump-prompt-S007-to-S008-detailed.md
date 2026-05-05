---
id: csps.handoff.vault.chat-jump-prompt-s007-to-s008-detailed
name: chat-jump-prompt-S007-to-S008-detailed
description: Detailed standalone paste-prompt (~600 words) for opening S008. MUV-audited per B_MUTUAL_UNDERSTANDING_VALIDATION (P-META-014) — 8 mandatory sections + EXPLICIT ALIGNMENT-QUESTIONS (12 questions) for cross-chat handshake iteration loop.
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
session: S007
muv_audit:
  chat_jump_prompt_8_mandatory_sections_present: PASS
  alignment_questions_count: 12
  cross_chat_iteration_status: pending-paste
links:
  - { rel: parent, href: ./README.md }
  - { rel: minimal-version, href: ./chat-jump-prompt-S007-to-S008.md }
  - { rel: handoff, href: ../HANDOFF-S007-to-S008.md }
  - { rel: muv-spec, href: ../../pillar-0-governance/mutual-understanding-validation.md }
---

# Chat-jump prompt — S007 → S008 (detailed standalone, MUV-audited)

> Per B_MUTUAL_UNDERSTANDING_VALIDATION (P-META-014). 8 mandatory sections + EXPLICIT ALIGNMENT-QUESTIONS section for cross-chat handshake iteration loop. After new AI responds, bring response back to current chat for refinement until alignment-confirmed-explicit.

---

# PASTE EVERYTHING BELOW THIS LINE INTO THE NEW S008 CHAT

---

# 🎯 YOU ARE S008 — Session 008 of the CSPS planning project.

**Identity banner (mandatory):** confirm in your first reply: `✅ I am S008, picking up from S007-close at <iso8601-utc>`. If anything contradicts this banner, STOP and raise a blocker.

S007 closed with **53 principles validated 0 findings + Phases 1-4 of token-optimization topic-plan closed (out of 10) + B_TOKEN_BUDGET engraved 5/5 atomic extending P-META-009 CCA + K=2 closed-enum drift structural fix 5/5 atomic + AGENTS.md slim 77% (206→143 lines) + 9 SKILL.md at .claude/skills/ + .claudeignore + 5.7% measured savings + S007 §24+ multi-location SKILL.md AAP coverage 5/5 atomic + S007 §24++ skill.template.md authored + S007 §24+++ close-protocol refinements + 9 commits pushed (6 main + 3 post-close addenda) + ZERO blockers**.

**Workspace:** `c:\Users\finky\Desktop\Claude Code\Csps`. Verify via `Glob docs/plan/pillar-*/README.md` returns 7 results before any §3 work (parent CLAUDE.md "Wrong workspace" warning is known false-positive).

## Section 1 — HANDOFF §0 paste-target (self-contained)

Your first action: Read `docs/plan/_handoff/HANDOFF-S007-to-S008.md` §0 and execute step list literally. Per protocols.md §11 step 0: ask user about prior-platform precedent before any §3 work.

## Section 2 — Post-close addenda references

S007 had clean close (no §24+ post-close addenda). Reference only HANDOFF zones A/B/C/D + closing-summary-S007.md sections §10.0/0e/0f/0g/0h/0i/0j/10.10/10.11/10.13 + §17.

## Section 3 — Governor Prompts log pointer

Read `docs/plan/_handoff/VAULT/governor-prompts/S007.md` for full context — 6 substantive prompts captured (verbatim + tags + distribution targets) with 2 cardinal-flagged. Most load-bearing: turn 4 (Phase 3 B_TOKEN_BUDGET ratification "i ratify all"), turn 6 (K=2-then-Phase-4 ratification "I ratify all" + self-audit prompt + 607K push-back).

## Section 4 — HPFA evidence block pointer

S007 close ran HPFA (P-META-013) with 9 mandatory checks (7 standard + 2 NEW: git-pushed-state-clean + token-optimization-phase-4-executed). All PASS; 0 silent gaps. See [closing-summary-S007.md §10.0f](docs/plan/_handoff/VAULT/closing-summary-S007.md). HPFA must run again at S008 close.

## Section 5 — All carry-forwards with explicit reasons

| # | Item | Reason | Target |
|---|---|---|---|
| 1 | Phase 5 hook migration (7 hooks per §14.4 migration table) | Phase 4 closed; Phase 5 next per topic-plan §3 ordering | S008 PRIMARY |
| 2 | Phase 6 subagent + Haiku tiering | Depends on Phase 5 hooks | S008 OR S009 |
| 3 | Phase 7 file splits (principles + contracts + audit-runner + ai-behavior-spine) | Highest-leverage; PE 7.30 | S009-S011 multi-session arc |
| 4 | Phase 8 principles-mcp build | CCA Layer 4 activation | S010-S011 |
| 5 | Phase 9-10 context-loading templates + measurement validator | Polish + observability | S011-S012 |
| 6 | Phase 4d 10-scenario over-compression test | User-tested verification needed; not programmatically testable | S008 turn 1 (user-driven) |
| 7 | Foundation slices week-2 (User / Tenant / AuditEvent) | Was parallel candidate per S006; deferred during S007 token-optimization arc | S008 OR S009 |
| 8 | CNST/GVRN split decision (ADR-0025 candidate) | Multi-session arc; foundation-stability discipline | S009+ |
| 9 | AGENTS.md <500 word stretched target | Phase 4 achieved 1377 words; Phase 5 hook migration removes ~7 cascade items | S008 (post-Phase-5) |

## Section 6 — All cardinal directives verbatim (cross-link to user-intents.md S007 section)

Most load-bearing for S008:

- *"i ratify all"* (turn 4 — B_TOKEN_BUDGET 5 operating rules R1-R5)
- *"I ratify all"* (turn 6 — K=2-then-Phase-4 after AI overcautious-close push-back)
- *"have you aready started using the token optimization?"* (turn 6 — self-audit prompt revealing R3 violation; ENGRAVING does not auto-comply)
- *"we have 607,000 available tokens. Re-evaluate"* (turn 6 — user-as-Governor B_PE_ALIGNMENT_GUARDIAN bidirectional working; AI overcautious-close-when-headroom-ample leak caught)

## Section 7 — `pnpm verify` orchestrator state at S007 close

```yaml
final_verify_S007_close:
  exit_code: 0
  active_mechanical_cycles: 5/5 PASS
  cycles:
    pnpm_install_frozen:           DEFERRED-WITH-REASON (--skip-install; S007 added gpt-tokenizer + deps via pnpm install at turn 2)
    typecheck_recursive:           PASS (0 ts_errors)
    principles_validate:           PASS (53 principles loaded; 0 findings; P-META-009 EXTENDED no new principle)
    frontmatter_validate:          PASS (138 scanned; 0 errors; 5 warnings; 70 exempt)
    aap_frontmatter_coverage:      PASS (7/7 packages/skills SKILL.md aligned)
    principle_count_staleness:     PASS (0 stale-count files)
    audit_runner_full_pass:        DEFERRED-WITH-REASON (week-4 ship)
```

S008 starts from this verified-clean state. Run `pnpm verify` (S008 inherits same orchestrator) at session-open to confirm 0 inheritance findings.

## Section 8 — EXPLICIT ALIGNMENT-QUESTIONS (the load-bearing handshake)

**New AI: please answer ALL 12 alignment-questions below in your first response, BEFORE proceeding with §3 work.** Your answers will be brought back to S007-current-chat for refinement-loop iteration until alignment-confirmed-explicit (per B_MUV boundary type 1).

### Scope-confirmation questions

**Q1.** Confirm S008 §3 primary scope: open Phase 5 hook migration (7 hooks per token-optimization.md §14.4 migration table). Or do you want different ordering (foundation-slices first / Phase 4d 10-scenario test first / parallel)?

**Q2.** §10.0j proposal #1 (R3 amendment to context-aware) — engrave as part of Phase 5 hook migration OR separately as standalone amendment?

### Interpretation-of-cardinals questions

**Q3.** Cardinal *"have you aready started using the token optimization?"* triggered the insight that ENGRAVING does not auto-comply. Confirm interpretation: B_TOKEN_BUDGET R3 needs operational reinforcement via hook (not just contract); promoting hook-stub `verify-hooks-functional.sh` + adding `post-stop-impl-batch-compact-prompt.sh` is Phase 5 priority.

**Q4.** User push-back *"we have 607,000 available tokens. Re-evaluate"* — confirm interpretation: AI overcautious-close-recommendation-when-headroom-ample is a logged inner-default leak; Phase 5 hook migration should include `pre-close-recommendation-context-utilization-check.sh` to enforce the user's reasoning.

### Engraving-confirmation questions

**Q5.** S007 engraved 1 NEW B_* (B_TOKEN_BUDGET extending P-META-009; 5/5 atomic) + 1 amendment (B_STRUCTURAL_PREVENTION K=2 closed-enum drift; 5/5 atomic). Confirm these are ratified going forward, OR flag any to re-litigate?

**Q6.** B_TOKEN_BUDGET 5 operating rules R1-R5 ratified verbatim. Phase 5 hook migration would add operational enforcement. Any rule to amend or refine before hooks ship?

### Verification-state questions

**Q7.** Final `pnpm verify` exit_code 0 with 5 active-mechanical cycles + 2 deferred. Confirm acceptable for S008 start OR specify any deferred cycle to un-defer?

**Q8.** Phase 4 measured savings 5.7% (cruel-critic Critique 1 honestly applied). Phase 5 hook migration estimate per §14.4: ~1,250 tokens/turn additional savings. Acceptable target or re-baseline?

### Open-question questions

**Q9.** Token-optimization §11 6 open questions remain partially open. Phase 5 closes hook migration. Any to resolve at S008 turn 1 (especially OQ1 priority vs foundation-slices, OQ4 tokenizer choice for v0.2 script)?

**Q10.** ADR-0025 candidate (CNST/GVRN split) deferred again S007. Any concerns OR earlier-than-S009 ratification need?

**Q11.** Per P-META-014 MUV — confirm you understand iteration loop is mandatory for high-stakes boundaries AND that you'll mark "alignment-confirmed-explicit" when no clarifications remain?

### Process-confirmation questions

**Q12.** Per protocols.md §11 step 0: do you have prior-platform precedent (CSP carry-forwards beyond what's already absorbed) for hook migration / subagent tiering / file splits that should inform S008 work? **The new AI MUST wait for the user's answer to this before §3 work begins.**

---

## Receipt signature format

Per protocols.md §11b.1, your first reply must include §17 acknowledgement checklist + receipt signature in this format:

`S008-AI-receipt-<iso8601-utc>-against-S007-AI-attest-2026-05-04T19:55:00Z-S007-close`

Plus per-line ✅ on §17 attestation OR ❓→BLK-S008-* (raise as blocker if ambiguous).

---

## Maintain discipline throughout S008

- B_TOKEN_BUDGET (NEW S007) — 5 operating rules R1-R5; consult [`frontmatter-closed-enums.md`](docs/plan/pillar-0-governance/frontmatter-closed-enums.md) before authoring frontmatter on closed-enum fields (K=2 promotion sub-rule)
- B_PCR_FOR_DECISIONS — every multi-option decision gets PCR 3-block
- B_FIVE_SURFACE_ENGRAVING — new B_* contracts hit 5/5 surfaces atomically with validator REGISTRATION mandatory
- B_PRE_CLOSE_VERIFICATION — `pnpm verify` before any §10.10 RZF block
- B_POSITIVE_VALUE_EXTRACTION — significant positive events trigger CEC walks
- B_COGNITIVE_CONTEXT_DISCIPLINE — 4 Quality Gates immutable
- B_AGENT_ALIGNMENT_PROTOCOL — Class B subagent spawn requires alignment preamble
- B_GOVERNOR_PROMPTS — every substantive user prompt logged in `_handoff/VAULT/governor-prompts/S008.md` continuously
- B_HANDOFF_PRE_FLIGHT_AUDIT — at S008 close, run 9-check whole-session walk
- B_MUTUAL_UNDERSTANDING_VALIDATION — every communication boundary closes I→I loop
- B_NAMING_POLICY (S006) — 4 rules + ALL-rules-during-rename mandate
- B_STRUCTURAL_PREVENTION_DISCIPLINE (S006 Q-2 + S007 K=2 amendment) — §10.0j enhancement-proposals scan mandatory; structural fix not patch
- B_CORE_SPINE_DISCIPLINE — every governed artifact has core_spine + core_spines + schema_anchor frontmatter

---

# END OF PASTE-TARGET — DO NOT INCLUDE THIS LINE OR BELOW

---

## After you paste this and get a response from the new chat

1. Copy the new AI's full response (§17 attestation + 12 alignment-question answers + receipt signature)
2. Paste back into THIS chat (S007-closing OR fresh chat-jump-handler)
3. S007-AI (or successor) will:
   - Audit the new AI's response against the original intent
   - Refine the prompt template if alignment-questions surfaced gaps
   - Reply with clarifications OR alignment-confirmed-explicit acknowledgment
4. Iterate Steps 2-3 until alignment-confirmed-explicit

This is the **cross-chat handshake** closing the I→I loop per B_MUV boundary type 1.
