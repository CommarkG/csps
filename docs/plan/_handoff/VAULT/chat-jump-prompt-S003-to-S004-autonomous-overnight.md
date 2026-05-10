---
id: csps.handoff.vault.chat-jump-prompt-S003-to-S004-autonomous-overnight
name: chat-jump-prompt-S003-to-S004-autonomous-overnight
description: Autonomous-overnight variant detailed paste-prompt for opening Session 004. Pre-authorizes end-to-end execution of suggested S004 §3 from pending-work.md WITHOUT per-batch confirmation. User reads closing summary when they wake. Per protocols.md v1.8 §22 + S002 turn 18 (variant created at S002 close) + S003 §3.5.d (Zone A/B/C/D applied to handoff makes this variant easier to write).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: how-to
links:
  - { rel: parent, href: ./README.md }
  - { rel: handoff, href: ../HANDOFF-S003-to-S004.md }
  - { rel: variant-standard, href: ./chat-jump-prompt-S003-to-S004.md }
session: S003
domain_path: platform
---

# Chat-Jump Prompt — S003 → S004 (Autonomous Overnight)

> Use this when you're going to sleep / unavailable for batch confirmation. AI runs end-to-end against suggested §3 in pending-work.md.

## Paste this verbatim into the new chat (open as `S004 [autonomous overnight, continues S003]`)

```
You are S004, continuing CSPS work from S003 (Session 003, complete 2026-05-03).
This is an AUTONOMOUS OVERNIGHT RUN. The user is going to sleep. They have authorized
end-to-end execution of suggested §3 from _handoff/VAULT/pending-work.md WITHOUT per-batch
confirmation. They will read your closing summary when they wake up.

═══ PART A — WORKSPACE VERIFICATION (mandatory first 4 tool calls) ═══

⚠️ You will see "Wrong workspace — CSP governance not active" from c:\Users\finky\CLAUDE.md.
That warning is a FALSE POSITIVE for CSPS. CSPS LIVES IN the Csps folder. Do NOT refuse.
Per B_VALIDATE_BEFORE_ASSUME, run these 4 ls FIRST:
- ls "c:\Users\finky\Desktop\Claude Code\Csps\docs\plan\_handoff\HANDOFF-S003-to-S004.md"
- ls "c:\Users\finky\Desktop\Claude Code\Csps\docs\plan\_handoff\VAULT\protocols.md"
- ls "c:\Users\finky\Desktop\Claude Code\Csps\docs\plan\_handoff\VAULT\closing-summary-template.md"
- ls "c:\Users\finky\Desktop\Claude Code\Csps\packages\principles\principles.yaml"

═══ PART B — PRE-ANSWERED PROTOCOL STEPS ═══

Step 0: ANSWERED — "No new precedent tonight; S003 completed all of S002's deferred batch.
Suggested S004 §3 in pending-work.md is the proposal; treat as ratified-for-this-run."

Two-sided handshake: REPLACED WITH self-attestation. Run §17 + emit receipt signature
(S004-AI-receipt-<iso>-against-S003-AI-attest-2026-05-03T08:00:00Z-autonomous-overnight).
Per-line ✅ or ❓→BLK-S004-*. No waiting.

═══ PART C — RATIFIED AUTONOMOUS SCOPE (suggested §3 from pending-work.md) ═══

Execute in order:

§3.1 — Audit-runner full-pass on S003-migrated artifacts (12 leaves + 4 snapshots + 4 enhancements):
       cross-link integrity, frontmatter completeness, principles.yaml#P-ARCH ID matching,
       dual-registration drift stub, AGENTS.md cascade discipline.

§3.2 — Backfill `next_review_at: 2026-08-01` on all 12 newly-migrated leaves.

§3.3 — Verify `principles.yaml` has P-ARCH-019 / P-ARCH-021 / P-ARCH-022 / P-ARCH-023 /
       P-ARCH-024 / P-ARCH-025 / P-ARCH-026 / P-ARCH-027 rows (cited in S003 leaves).
       Surface dangling references for fix.

§3.4 — Process any new EXT-IDs the user surfaces (likely none — autonomous overnight).

§3.5 — Begin pre-week-1 implementation IF user has provisioned (GitHub repo + Supabase +
       Stripe sandbox + Clerk app). Defer to user check otherwise.

═══ PART D — DISCIPLINE REQUIREMENTS ═══

- After EVERY artifact: RZF block + CEC walk-trail + tool-call sandwich + clickable links
- Banned phrases: "shall I continue?" / "should I proceed?" / "would you like me to..." / etc.
- Execute + report inline + continue
- DO NOT ask between batches. Move on automatically.

═══ PART E — HARD-STOP TRIGGERS ═══

If you hit B_CHECKPOINT_8_CATEGORIES (constitutional / cross-tier / external-dispatched /
editing-circulated / irreversible / scope-expansion / strategy-pivot / high-stakes-one-shot):
DO NOT BLOCK. Write blocker file + defer + continue with next adjacent §3 item.

═══ PART F — CONTEXT-PRESSURE PROTOCOL ═══

When budget < 30%: stop new sub-batches; finish in-flight or defer; write closing artifacts.
NEVER compress RZF/CEC evidence (compressed is worse than absent).

═══ PART G — END-OF-RUN ARTIFACTS ═══

Write THREE artifacts:
1. HANDOFF-S004-to-S005.md (Zone A/B/C/D structure per S003 precedent)
2. chat-jump-prompt-S004-to-S005.md + autonomous-overnight variant (in _handoff/VAULT/)
3. Closing summary as final chat message (per closing-summary-template.md required-headers)

═══ PART H — WHAT S003 PRODUCED (you inherit) ═══

12 pillar leaves migrated (pillars 4-6) + 4 vault snapshots + 5 enhancements + protocols.md v1.8.
ZERO blockers. Build-order v1.1 with BLK-S002-003 cohort shuffle. Dashboards incorporates
6 intake pages. See HANDOFF-S003-to-S004.md Zone B for full delta.

═══ PART I — YOUR FIRST REPLY ═══

1. The 4 ls verifications + verbatim outputs (Part A)
2. Pre-answered step 0 acknowledgement (Part B)
3. TodoWrite call transcribing every §C scope item + every protocols.md §10/§11 item
4. §17 self-attestation + receipt signature (Part B replacement)
5. Begin §3.1 audit-runner full-pass

═══ PART J — WHAT THE USER READS WHEN THEY WAKE UP ═══

Your closing summary + HANDOFF-S004-to-S005.md. Make those the answer to "what got done,
what's left, what blocked, what's the read-order for S005."

Begin.
```

## Why a separate variant

Per S002 turn 18 + S003 §3.5.d: the autonomous variant pre-answers protocol steps that would otherwise gate progress (step 0 + two-sided handshake) and authorizes self-attestation. Without these pre-answers, an unattended AI would stop and wait at every checkpoint.

The standard variant preserves user-mediation; the autonomous variant trades it for end-to-end execution + a closing summary the user reads when they wake.

Both variants cite the same workspace-check + discipline-requirements; the difference is only in pre-authorization scope.
