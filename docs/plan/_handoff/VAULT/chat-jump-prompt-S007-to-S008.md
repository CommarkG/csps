---
id: csps.handoff.vault.chat-jump-prompt-s007-to-s008
name: chat-jump-prompt-S007-to-S008
description: Minimal paste-target for opening S008. Per protocols.md §22 minimal variant. Detailed standalone with 12 alignment-questions at chat-jump-prompt-S007-to-S008-detailed.md.
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
links:
  - { rel: parent, href: ./README.md }
  - { rel: detailed-version, href: ./chat-jump-prompt-S007-to-S008-detailed.md }
  - { rel: handoff, href: ../HANDOFF-S007-to-S008.md }
domain_path: platform
---

# PASTE EVERYTHING BELOW THIS LINE INTO THE NEW S008 CHAT

---

YOU ARE S008 — Session 008 of the CSPS planning project.

**Identity banner (mandatory):** confirm in your first reply: `✅ I am S008, picking up from S007-close at <iso8601-utc>`. If anything contradicts this banner, STOP and raise a blocker.

**Workspace:** `c:\Users\finky\Desktop\Claude Code\Csps`

**Verify before any §3 work:** `Glob docs/plan/pillar-*/README.md` returns 7 results (parent CLAUDE.md "Wrong workspace" warning is a known false-positive — verify via Glob first).

**First action MANDATORY:**
Read `docs/plan/_handoff/HANDOFF-S007-to-S008.md` §0 and execute the §0 step list literally per B_PROTOCOL_LITERAL_EXECUTION.

**For comprehensive context + 12 alignment-questions:**
Read `docs/plan/_handoff/VAULT/chat-jump-prompt-S007-to-S008-detailed.md` — contains the 8 mandatory MUV sections + 12 explicit alignment-questions you MUST answer in first reply.

**Receipt signature MANDATORY (your first reply):**
`S008-AI-receipt-<iso8601-utc>-against-S007-AI-attest-2026-05-04T19:55:00Z-S007-close`

**§17 attestation acknowledgement MANDATORY:**
Per closing-summary-S007.md §17: per-line ✅ on prior session's attestation OR ❓→BLK-S008-* (raise as blocker if ambiguous).

**S007 close state:**
53 principles validated 0 findings · token-optimization topic-plan Phases 1-4 of 10 closed · B_TOKEN_BUDGET engraved 5/5 atomic (extends P-META-009 CCA; 5 operating rules R1-R5) · K=2 closed-enum drift structural fix engraved 5/5 atomic · AGENTS.md slim 77% (206→143 lines / 6001→1377 words) · 9 SKILL.md at .claude/skills/ · .claudeignore authored · 5.7% measured savings · 5 commits pushed · ZERO blockers.

**Recommended S008 §3 (await user ratification turn 1):**

Primary: Open Phase 5 (hook migration) — 7 hook scripts at .claude/hooks/ per [token-optimization.md §14.4](docs/plan/pillar-0-governance/token-optimization.md) migration table. Estimated 1 session. Or: foundation-slices week-2 (User / Tenant / AuditEvent) — parallel candidate.

**Per protocols.md §11 step 0 — ASK USER FIRST:** "Do you have prior-platform precedent for hook migration / subagent tiering / file splits beyond what's already absorbed?" Wait for answer before §3 work begins.

---

**Chat-jump-prompt minimal signature:** `S007-AI-chat-jump-minimal-2026-05-04T19:56:00Z`
