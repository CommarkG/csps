---
id: csps.handoff.vault.chat-jump-prompt-S004-to-S005-detailed
name: chat-jump-prompt-S004-to-S005-detailed
description: Detailed standalone paste-prompt for opening Session 005. ~250 words, self-contained — gives user full context of what they're triggering when they paste this into a new chat. Per protocols.md v1.8 §22 (closes user-surfaced gap S002 turn 13). Pair with chat-jump-prompt-S004-to-S005.md (minimal version).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:user
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S004
next_session: S005
domain_path: platform
scope_level: S1
---

# Detailed paste-prompt — S004 → S005

Use this version when opening a fresh chat and you want the AI to have FULL CONTEXT of what's being triggered. Paste the entire block below:

---

```
Chat title: S005 [continues] — Week-1 code scaffolding + S003 §3 carry-forward (audit-registry + ADR-0022)

You are Session 005 (S005) of the CSPS planning project. Session 004 (S004) is complete.

Workspace: c:\Users\finky\Desktop\Claude Code\Csps (CSPS lives here, renamed from VSAS on 2026-05-03; auto-memory at c--Users-finky-Desktop-Claude-Code-Csps/). If c:\Users\finky\CLAUDE.md fires "Wrong workspace" warning, that's a false-positive — verify via Glob docs/plan/pillar-*/README.md returning 7 results before refusing.

S004 was a provisioning + first-git-push + secrets-rotation session that:
- Provisioned all 4 services for week-1 (Clerk + Supabase eu-central-1 csps-prod + Stripe test-mode + Cloudflare-shared-with-CSP-via-csps-*-naming)
- First-ever git push: 158 files committed + pushed to https://github.com/CommarkG/csps (private)
- Bitwarden installed + CSPS Dev Keys secure note created
- Rotated 2 leaked dev keys (Clerk secret + Supabase DB password) post-leak-detection
- Added permanent "PowerShell" allow rule to global ~/.claude/settings.json
- Engraved 2 new memory entries (clipboard-clobber pattern + leaked-secrets-rotation discipline)

Zero blockers carry to S005. Suggested S005 §3 inherits 3 unaddressed S003 items + new week-1-code-scaffolding work.

Your first action MUST be:
Read docs/plan/_handoff/HANDOFF-S004-to-S005.md §0 and execute.

§0 step list will guide you through:
1. Step 0 (precedent question) — wait for user response
2-3. Read priority-zero files (now from GitHub URLs since post-git mode)
4-5. Verify zero blockers + run §1.1 verification command
6. Verify intent-to-impact (note: drift_severity is "moderate-but-user-ratified")
7. Emit §17 attestation as FIRST REPLY — receipt signature format:
   S005-AI-receipt-<iso8601-utc>-against-S004-AI-attest-2026-05-04T00:19:22Z-S004-close
8. Surface S005 §3 to user for ratification

K=2 mandate: ADR-0022 (stale-meta-principle-count permanent fix) is K=2-triggered and has priority for S005. If not addressed in S005, K=3 fires automatically per P-META-005.

Maintain discipline: top-expert-colleague voice, no confirmation-seeking, validate-before-assume, clipboard-secrets via scratch-file pattern, post-git URLs in all file refs.
```

---

## How to use

1. Open a fresh Claude Code chat in your CSPS workspace
2. Paste the entire block above (between the triple-fenced code blocks)
3. The AI will read HANDOFF-S004-to-S005.md §0 and execute the step list
4. Verify the AI emits §17 attestation as its FIRST REPLY before any substantive work

## Why both paste-targets

- **Minimal** ([`chat-jump-prompt-S004-to-S005.md`](./chat-jump-prompt-S004-to-S005.md)): 1-line, target audience = AI; useful when you trust the AI to autoload the handoff context correctly
- **Detailed** (this file): ~250 words, target audience = you (the user); useful when you want to know WHAT'S ABOUT TO HAPPEN before triggering it, OR when opening in a different IDE / Claude Code instance and want to ensure full context loads

Per protocols.md v1.8 §22 + `feedback_chat_jump_prompt_must_be_detailed.md`: closing AI auto-generates BOTH; user can paste either depending on situation.
