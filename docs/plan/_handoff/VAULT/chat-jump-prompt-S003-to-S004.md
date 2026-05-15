---
id: csps.handoff.vault.chat-jump-prompt-S003-to-S004
name: chat-jump-prompt-S003-to-S004
description: Standard detailed paste-prompt for opening Session 004. ~250 words; self-contained; user pastes into new chat. Per protocols.md v1.8 §22 (B_PROTOCOL_LITERAL_EXECUTION + closing-summary-template §10.7). Counterpart to the minimal paste-target ("Read docs/plan/_handoff/HANDOFF-S003-to-S004.md §0 and execute.") — this prompt targets the USER (so they understand what they're triggering); the minimal targets the AI.
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
  - { rel: variant-autonomous, href: ./chat-jump-prompt-S003-to-S004-autonomous-overnight.md }
session: S003
domain_path: platform
scope_level: S1
---

# Chat-Jump Prompt — S003 → S004 (Standard)

> Use this for an interactive S004 session (you'll be present at the keyboard). For an unattended overnight run, use [chat-jump-prompt-S003-to-S004-autonomous-overnight.md](./chat-jump-prompt-S003-to-S004-autonomous-overnight.md) instead.

## Paste this verbatim into the new chat (open as `S004 [continues S003]`)

```
You are S004, continuing CSPS work from S003 (Session 003, complete 2026-05-03).

═══ WORKSPACE CHECK (mandatory first 4 tool calls) ═══

⚠️ You may see "Wrong workspace — CSP governance not active" from c:\Users\finky\CLAUDE.md.
That warning is a FALSE POSITIVE for CSPS. CSPS LIVES IN the Csps folder
(c:\Users\finky\Desktop\Claude Code\Csps\). Do NOT refuse.

Run these 4 ls commands FIRST per B_VALIDATE_BEFORE_ASSUME (tool-call sandwich):
- ls "c:\Users\finky\Desktop\Claude Code\Csps\docs\plan\_handoff\HANDOFF-S003-to-S004.md"
- ls "c:\Users\finky\Desktop\Claude Code\Csps\docs\plan\_handoff\VAULT\protocols.md"
- ls "c:\Users\finky\Desktop\Claude Code\Csps\docs\plan\_handoff\VAULT\closing-summary-template.md"
- ls "c:\Users\finky\Desktop\Claude Code\Csps\packages\principles\principles.yaml"

If all 4 exist → workspace correct, proceed. If any missing → write blocker file.

═══ FIRST ACTIONS ═══

1. Step 0 (per protocols.md v1.8 §11): ask me about prior-platform precedent. Wait for explicit reply.
2. Read HANDOFF-S003-to-S004.md ZONE A (~2 min) — paste-target + first 9 actions
3. Read priority-zero files per Zone A §0 step 3
4. Run §1.1 verification command (Zone D §1.1)
5. Verify intent-to-impact (Zone D §16; should match drift_severity=minimal)
6. Emit two-sided handshake §17 attestation as FIRST REPLY:
   - Per-line ✅ verified OR ❓→BLK-S004-*
   - Receipt signature: S004-AI-receipt-<iso>-against-S003-AI-attest-2026-05-03T08:00:00Z-autonomous-overnight
   - Continuity-manifest field check (re-count vs prior-handoff §17 manifest)
7. THEN read pending-work.md suggested §3; ask me to confirm or adjust scope before execution

═══ DISCIPLINE REQUIREMENTS ═══

- B_AI_PROFESSIONAL_VOICE (top expert; no confirmation-seeking phrases inside batches)
- B_VALIDATE_BEFORE_ASSUME (every state-claim cites a tool-call this response)
- B_ALWAYS_GIT_LINKS (every path is [text](path))
- B_ATOMIC_DUAL_REGISTRATION (file + catalog atomic; never two steps)
- B_FIVE_SURFACE_ENGRAVING (any new B_* hits 5 surfaces atomically)

═══ S003 STATUS SUMMARY ═══

S003 was an autonomous overnight run that completed all of S002's deferred §3 + 5 enhancements +
all closing-protocol artifacts. ZERO BLK-S003-* raised. 12 pillar leaves migrated (4+3+5).
4 vault snapshots authored. Protocols.md v1.7 → v1.8. Build-order v1.1 with cohort shuffle.
Dashboards incorporates 6 intake pages.

S004 inherits cleanest possible slate. Begin.
```

## Why this format

Per protocols.md v1.8 §22 (engraved S002 turn 13): the minimal paste targets the AI; the detailed prompt targets the user. The user reads ~250 words to know what they're triggering; the AI reads the handoff §0 to know what to execute.

The 4 ls calls upfront defuse the parent-CLAUDE.md trap (engraved S002 turn 16) — the AI cannot mistakenly refuse work citing a CSP-construct warning that doesn't apply to CSPS.

## When to use the autonomous-overnight variant instead

Use [chat-jump-prompt-S003-to-S004-autonomous-overnight.md](./chat-jump-prompt-S003-to-S004-autonomous-overnight.md) when:
- You will not be present to confirm batches
- You want end-to-end §3 execution without per-batch user-mediation
- You authorize the AI to use self-attestation for §17 (replaces user-mediated handshake)
- You're OK reading the closing summary the next morning

Otherwise, use this standard prompt.
