---
id: csps.handoff.vault.chat-jump-prompt-S005-to-S006-detailed
name: chat-jump-prompt-S005-to-S006-detailed
description: Detailed standalone paste-prompt (~600 words) for opening S006. MECHANICALLY AUDITED per B_MUTUAL_UNDERSTANDING_VALIDATION (P-META-014) — 8 mandatory sections present + EXPLICIT ALIGNMENT-QUESTIONS section for cross-chat handshake iteration loop. User pastes to new chat; new AI responds with §17 attestation + alignment-question answers; user brings response back to current chat for refinement-loop until alignment-confirmed-explicit. Per protocols.md v1.8 §22 + S005 turn 28 mechanical audit upgrade.
version: 2.1
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S005
muv_audit:
  chat_jump_prompt_8_mandatory_sections_present: PASS
  alignment_questions_count: 12
  cross_chat_iteration_status: pending-paste
links:
  - { rel: parent, href: ./README.md }
  - { rel: minimal-version, href: ./chat-jump-prompt-S005-to-S006.md }
  - { rel: muv-spec, href: ../../pillar-0-governance/mutual-understanding-validation.md }
domain_path: platform
scope_level: S1
---

# Chat-jump prompt — S005 → S006 (detailed standalone, MUV-audited)

> **Per B_MUTUAL_UNDERSTANDING_VALIDATION (S005 turn 28):** this prompt has been mechanically audited at generation. Contains all 8 MUV-mandatory sections + EXPLICIT ALIGNMENT-QUESTIONS section. After you paste it and the new AI responds, **bring the new AI's response back to current chat** so I can audit + refine the prompt template if gaps surfaced + reply with clarifications. **Iterate until alignment-confirmed-explicit.** This is the cross-chat handshake closing the I→I loop.

---

# PASTE EVERYTHING BELOW THIS LINE INTO THE NEW S006 CHAT

---

# 🎯 YOU ARE S006 — Session 006 of the CSPS planning project.

> **Identity banner (mandatory per B_MUTUAL_UNDERSTANDING_VALIDATION):** the very first thing any chat-jump prompt asserts is **WHO YOU ARE**. You are S006. Confirm in your first reply ("✅ I am S006, picking up from S005-close at <iso8601-utc>"). If anything in the system state / workspace / loaded files contradicts this banner, **STOP and raise a blocker** — do not proceed under unclear identity.

S005 closed with **45 principles validated 0 findings** + **5 ACTIVE-MECHANICAL `pnpm verify` cycles** + **0 defect-class carry-forwards**. You inherit a verified-clean baseline.

**Workspace:** `c:\Users\finky\Desktop\Claude Code\Csps` (CSPS lives here). If `c:\Users\finky\CLAUDE.md` fires "Wrong workspace" warning that's a false-positive — verify via `Glob docs/plan/pillar-*/README.md` returning 7 results before refusing.

## Section 1 — HANDOFF §0 paste-target (self-contained)

**Your first action MUST be:** Read `docs/plan/_handoff/HANDOFF-S005-to-S006.md` §0 and execute the §0 step list. The handoff has §24-§32 post-close addenda capturing all work after the original S005 close — read those too.

Per protocols.md §11 step 0: ask user about prior-platform precedent before any §3 work begins.

## Section 2 — Post-close addenda references (§24-§32)

S005 had multiple post-close iterations adding substantial engravings AFTER the original close. Read these addenda IN ORDER:

- **§24** — CCA dashboard (P-META-009 + B_COGNITIVE_CONTEXT_DISCIPLINE; 5-layer architecture + 4 immutable Quality Gates)
- **§25** — Plan-mechanical engraving (P-META-008 + B_PRE_CLOSE_VERIFICATION; pnpm verify orchestrator LIVE)
- **§26** — Audit Hub (P-META-011 + B_AUDIT_ORCHESTRATION; 9 pipelines) + AAP retrofit (7 SKILL.md AAP-aligned) + verify.mjs extended
- **§27** — ZF-before-build closure
- **§28-§31** — Governor Prompts (P-META-012 + B_GOVERNOR_PROMPTS) + HPFA (P-META-013 + B_HANDOFF_PRE_FLIGHT_AUDIT) + DNA leaf + ADR-0024 Vercel
- **§32 (this section in chat-jump itself)** — MUV (P-META-014 + B_MUTUAL_UNDERSTANDING_VALIDATION) + this audited chat-jump prompt

## Section 3 — Governor Prompts log pointer

Read `docs/plan/_handoff/VAULT/governor-prompts/S005.md` for full S005 prompt context (23 substantive prompts captured with verbatim + tags + distribution + status). The log shows what the user requested, decided, dropped — beyond what user-intents.md preserves.

## Section 4 — HPFA evidence block pointer

S005 close ran HPFA (Handoff Pre-Flight Audit) with 7 mandatory checks; all PASS; 0 silent gaps; handoff write authorized. See HANDOFF §31 §10.0f block.

S006 close MUST also run HPFA per B_HANDOFF_PRE_FLIGHT_AUDIT (P-META-013) — this is mandatory going forward.

## Section 5 — All carry-forwards with explicit reasons

| # | Item | Reason carried |
|---|---|---|
| 1 | **AAP Class B preamble template** + AGENTS.md cascade amendment (mandate spawn-prompt preamble for Explore/Plan/general-purpose/claude-code-guide/statusline-setup) | S005 turn 25 user identified gap; retrofit on existing 7 SKILL.md done; Class B subagent invocations need template ready for S006+ |
| 2 | **Documentation Discipline strengthening** (extend B_PROTOCOL_LITERAL_EXECUTION with inline real-time pattern) | User S005 turn 22 explicit appreciation: "I LIKED VERY MUCH YOU DOCUMENTING WHAT YOU DO CONTINUOUSLY — see how to formalize it" |
| 3 | **Schema dynamic connections audit (Phase C)** — bidirectional graph audit per S005 turn 26 directive | Surfaced as deferred this turn due to context budget; substantive audit work |
| 4 | **Foundation slices week-2** (User / Tenant / AuditEvent in libs/policies/foundation/) | Per build-order.md week-2; multi-session arc |
| 5 | **principles-mcp build + smoke test** | Per build-order.md week-2; package skeleton shipped S005 |
| 6 | **glossary + principles codegen full impls** | Per build-order.md week-2; codegen.ts has TODO stubs currently |
| 7 | **Stripe Entitlements + Clerk Organizations wiring** | Per build-order.md week-2 |

## Section 6 — All cardinal directives verbatim (cross-link to user-intents.md S005 section)

10 cardinal verbatim phrases preserved in [user-intents.md](docs/plan/_handoff/VAULT/user-intents.md). Most load-bearing for S006:

- *"What is not mechanically enforced is just a temp fix"* (turn 23) — orienting principle
- *"I prioritize quality and holistic context and solutions serving me for the long run over immediate saving"* (turn 21) — quality-first framing
- *"Make our DNA in building things"* (turn 22) — captured in csps-build-dna.md
- *"No agents created out of CSPS are allowed into the system"* (turn 22) — AAP enforcement
- *"AI between chats / AI to external AI elements / AI to internal personas / AI-human communication must include validation that what was provided as output was received and understood"* (turn 28) — MUV universalization

## Section 7 — `pnpm verify` orchestrator state

```yaml
final_verify_S005_close:
  exit_code: 0
  cycles:
    pnpm_install_frozen:           DEFERRED-WITH-REASON (--skip-install flag; would PASS)
    typecheck_recursive:           PASS (0 ts_errors)
    principles_validate:           PASS (45 principles loaded; 0 findings)
    frontmatter_validate:          PASS (governor-prompts vault exempted)
    aap_frontmatter_coverage:      PASS (7/7 SKILL.md aligned)
    principle_count_staleness:     PASS (0 stale-count files in active prose)
    audit_runner_full_pass:        DEFERRED-WITH-REASON (week-4 ship)
  zf_state: ACHIEVED on all non-deferred cycles
  active_mechanical_cycles: 5/5 PASS
```

S006 starts from this verified-clean state. Run `pnpm verify` (S006 will inherit same orchestrator) before any §3 substantive work.

## Section 8 — EXPLICIT ALIGNMENT-QUESTIONS (the load-bearing handshake)

**New AI: please answer ALL 12 alignment-questions below in your first response, BEFORE proceeding with §3 work.** Your answers will be brought back to S005-current-chat for refinement-loop iteration until alignment-confirmed-explicit (per B_MUTUAL_UNDERSTANDING_VALIDATION boundary type 1). Without this, the I→I loop doesn't close and gaps propagate silently.

### Scope-confirmation questions

**Q1.** Confirm S006 §3 scope: 7 carry-forwards listed in Section 5 above. Is this still your intent OR do you want any item deprioritized / added / removed?

**Q2.** Foundation slices (carry #4) is week-2 PRIMARY work per build-order.md. Confirm S006 should start week-2 substantive work, OR finish remaining S005 carry-forwards first (carries 1-3 are governance gaps).

### Interpretation-of-cardinals questions

**Q3.** Cardinal directive *"what is not mechanically enforced is just a temp fix"* — confirm your understanding aligns with: declarations alone are temp-fix; ACTIVE-MECHANICAL means a validator runs that catches violations; declared-deferred-week-4 is documented-debt-not-temp-fix?

**Q4.** Cardinal directive *"AI-human communication must include validation that what was provided as output was received and understood"* — engraved as B_MUTUAL_UNDERSTANDING_VALIDATION boundary type 3 (AI-to-human substantive output emits "did this land?" check). Confirm interpretation OR specify additional surfaces.

**Q5.** Cardinal directive *"make our DNA in building things"* — engraved as csps-build-dna.md leaf synthesizing rigid spine + flexible adaptation. Confirm framing OR refine.

### Engraving-confirmation questions

**Q6.** S005 engraved 7 NEW principles (P-META-008 through P-META-014) + 9 NEW B_* contracts. All registered atomically per FSE amendment. Confirm these are ratified going forward, OR flag any to re-litigate?

**Q7.** AAP retrofit applied to 7 SKILL.md files (5 active + 2 stub) all PASS aap_frontmatter_coverage. Class B subagent preamble template is S006 carry-forward #1. Confirm prioritization (high-priority for S006 turn 1, OR lower)?

### Verification-state questions

**Q8.** Final `pnpm verify` exit_code 0 with 5 ACTIVE-MECHANICAL cycles + 2 DEFERRED-WITH-REASON. Confirm acceptable for S006 start OR specify any deferred cycle you want un-deferred (note: pnpm_install_frozen would PASS if not skipped via flag; audit_runner_full_pass ships week-4)?

**Q9.** Open frontiers per pillar-6/open-frontiers.md (9 items; most next_review_at 2026-08-01). Any to surface for S006 review now?

### Open-question questions

**Q10.** ADR-0024 (Vercel + Cloudflare hybrid deployment) is week-10+ scope. Any concerns with the hybrid pattern OR earlier-than-week-10 admin app activation?

**Q11.** P-META-014 MUV mandates iteration loop until alignment-confirmed-explicit. After your answers to Q1-Q12, current AI (in S005-chat) will refine prompt template + reply with clarifications. **Confirm you understand this iteration is mandatory for high-stakes boundaries** AND that you'll mark "alignment-confirmed-explicit" when no clarifications remain?

### Process-confirmation questions

**Q12.** Per protocols.md §11 step 0: do you (the user, not the new AI) have prior-platform precedent (CSP carry-forwards or other) that should inform S006 work, specifically before week-2 foundation-slice scaffolding patterns get laid down? **The new AI MUST wait for the user's answer to this before §3 work begins.**

---

## Receipt signature format

Per protocols.md §11b.1, your first reply must include the §17 acknowledgement checklist + a receipt signature in this format:

`S006-AI-receipt-<iso8601-utc>-against-S005-AI-attest-2026-05-04T12:45:00Z-S005-close`

Plus per-line ✅ on §17 attestation OR ❓→BLK-S006-* (raise as blocker if ambiguous).

---

## Maintain discipline throughout S006

- B_PCR_FOR_DECISIONS — every multi-option decision gets PCR 3-block (no silent skip)
- B_FIVE_SURFACE_ENGRAVING — new B_* contracts hit 5/5 surfaces atomically with validator REGISTRATION mandatory
- B_PRE_CLOSE_VERIFICATION — `pnpm verify` before any §10.10 RZF block
- B_POSITIVE_VALUE_EXTRACTION — significant positive events trigger CEC walks; entries in §10.11b
- B_COGNITIVE_CONTEXT_DISCIPLINE — 4 Quality Gates immutable (QG1 no Opus downgrade for hard reasoning; QG2 synthesis stays in main; QG3 mid-session edited files re-read; QG4 cache invalidates on content change)
- B_AGENT_ALIGNMENT_PROTOCOL — Class B subagent spawn requires alignment preamble (template arrives in S006 turn 1 work)
- B_GOVERNOR_PROMPTS — every substantive user prompt logged in `_handoff/VAULT/governor-prompts/S006.md` continuously
- B_HANDOFF_PRE_FLIGHT_AUDIT — at S006 close, run 7-check whole-session walk before writing HANDOFF-S006-to-S007
- **B_MUTUAL_UNDERSTANDING_VALIDATION** — every communication boundary closes I→I loop; chat-jump prompts go through 8-section + alignment-questions iteration

---

# END OF PASTE-TARGET — DO NOT INCLUDE THIS LINE OR BELOW

---

## After you paste this and get a response from the new chat

1. Copy the new AI's full response
2. Paste it back into THIS chat (S005)
3. I (S005-current-AI) will:
   - Audit the new AI's response against the original intent
   - Refine the prompt template MECHANICALLY if alignment-questions surfaced gaps
   - Reply with clarifications OR alignment-confirmed acknowledgment
4. Iterate Steps 2-3 until alignment-confirmed-explicit (no more clarifications needed)

This is the **cross-chat handshake** closing the Intent-to-Impact loop per B_MUTUAL_UNDERSTANDING_VALIDATION boundary type 1 (S005 turn 28 user directive).
