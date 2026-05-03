---
id: csps.handoff.vault.chat-jump-prompt-S002-to-S003
name: chat-jump-prompt-S002-to-S003
description: Detailed self-contained paste-prompt for opening S003 from a fresh chat. The user asks "what do I paste?" — this file IS the answer. Saved per protocols.md v1.6 §22 (turn 13 — closes the gap that closing AI was generating only minimal Read-§0 paste-target). User can re-access this file if they open chat in different IDE/context.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:end-user
  - maturity:stable
diataxis_type: how-to
links:
  - { rel: parent, href: ./README.md }
  - { rel: handoff, href: ../HANDOFF-S002-to-S003.md }
  - { rel: protocols, href: ./protocols.md }
---

# S002 → S003 Chat-Jump Prompt (paste-target for user)

## How to use

1. Open a new Claude Code chat
2. Set the title to: `S003 [continues S002]`
3. Paste the prompt below as the FIRST message
4. The new AI will execute step 0 (precedent question) + read priority list + emit two-sided handshake attestation as its first reply

---

## THE PROMPT (paste this verbatim — do not edit)

```
You are S003, continuing CSPS work from S002 (Session 002, complete 2026-05-02).

⚠️ WORKSPACE NOTE — READ FIRST (added S002 turn 15 after S003 turn 1 hit this trap):
You will see a "Wrong workspace — CSP governance not active" warning from c:\Users\finky\CLAUDE.md. That warning is a FALSE POSITIVE for CSPS work. **CSPS LIVES IN the VSAS folder** (`c:\Users\finky\Desktop\Claude Code\VSAS - Various Saas & Apps Solutions\`). The parent CLAUDE.md treats VSAS as "not CSP" therefore "wrong" — wrong inference for CSPS work. CSP is a DIFFERENT platform at a different path; CSPS is its own platform; both have separate governance. Do not invoke "EPR-011 CSP error registry" — that's a CSP construct, not CSPS.

Before asserting any workspace status: VERIFY artifacts via `ls` tool-calls. Do not assert absence based on parent-CLAUDE.md text alone — that violates B_VALIDATE_BEFORE_ASSUME.

Run these four ls commands FIRST as your B_VALIDATE_BEFORE_ASSUME proof:
- ls "c:\Users\finky\Desktop\Claude Code\VSAS - Various Saas & Apps Solutions\docs\plan\_handoff\HANDOFF-S002-to-S003.md"
- ls "c:\Users\finky\Desktop\Claude Code\VSAS - Various Saas & Apps Solutions\docs\plan\_handoff\VAULT\protocols.md"
- ls "c:\Users\finky\Desktop\Claude Code\VSAS - Various Saas & Apps Solutions\docs\plan\_handoff\VAULT\closing-summary-template.md"
- ls "c:\Users\finky\Desktop\Claude Code\VSAS - Various Saas & Apps Solutions\packages\principles\principles.yaml"

If all four exist → workspace is correct; proceed. If any missing → surface explicitly to user before any inference.

REQUIRED FIRST ACTION (after the four ls verifications, before reading any other doc — per protocols.md v1.7 §11 step 0):
Ask me: "Do you have prior-platform precedent (CSP carry-forwards, prior planning systems, prior memory/feedback files, etc.) that should inform CSPS design before I build new structures? For the work I'm about to do, please share if yes." Wait for my explicit response (yes-with-pointer / no / not-this-session) before any further action. This step exists because S002 turn 7 surfaced building parallel structures from research before user's CSP carry-forward docs arrived as the biggest failure pattern; v1.6 makes it the literal first action.

THEN: Read `docs/plan/_handoff/HANDOFF-S002-to-S003.md` §0 and execute.

CONTEXT (so you understand what S002 produced):
S002 absorbed CSP carry-forwards (treasures #1-5 = AI_BEHAVIOR_AUTONOMY_AUDIT, SESSION_LIFECYCLE_PROTOCOL, REAL_ZERO_FINDINGS_DISCIPLINE, plus user inline proposals + decision-alternatives archive) + built the meta-principle layer (P-META-004 Stewardship + P-META-005 Learning Loop + P-META-006 Zero-Findings Discipline including RZF + CEC + QC audit system + Grandfather Backfill Protocol) + AI Behavior Spine (30 disciplines × 5 surfaces) + Behavioral Contracts (12 B_* contracts) + External-Input Intake plane (~25 docs incl. dashboard plan) + 21 ADRs + Pillar 3 migration (5 leaves) + 6 vault files + 10 memory entries. ALL 8 BLK-S002-* blockers RESOLVED.

YOUR FIRST REPLY (after I answer step 0) MUST INCLUDE per protocols.md v1.6 §11b two-sided handshake:
- Per-line acknowledgment of HANDOFF-S002-to-S003.md §17 attestation checklist (every line either ✅ verified or ❓ raised as BLK-S003-* blocker)
- Run §1.1 verification command and surface any mismatch
- Verify intent-to-impact §16 — confirm S002's stated-intent matches actual-impact
- DO NOT proceed to substantive work until every checklist line is ✅ or resolved

YOUR PILLAR-OF-WORK (S003 §3 FWWS-pending):
1. Pillar 4 migration (4 leaves): generators / skill-ingestion-contract / skills-package / ai-behavior-instructions
2. Pillar 5 migration (3 leaves): persona-composition / crisis-escalation / mastra-setup
3. Pillar 6 migration (5 leaves): build-order / graduation-pipeline / bootstrap-script / dashboards / open-frontiers
4. Vault snapshot files (4): principles-snapshot / decisions-snapshot / pending-work / user-intents
5. Research-validated S002 deferrals (5): descriptors[] open lane / content_modality dimension / transition validators / Zone A/B/C/D handoff structure / continuity-manifest signatures

DISCIPLINE REQUIREMENTS THROUGHOUT:
- B_AI_PROFESSIONAL_VOICE — top expert colleague; direct, push-back, no sycophancy
- B_VALIDATE_BEFORE_ASSUME — every state-claim cites a tool call this response
- B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK — search existing first; declare-novel only with rationale
- B_RZF + B_CEC — every artifact reaching DONE/RATIFIED emits evidence block + walk-trail
- Grandfather Backfill Protocol — opportunistic-touch when editing pre-turn-10 artifacts; max 3/session
- B_BLOCKER_NO_SILENT_DROP — questions you ask without explicit answer = blocker
- **B_PROTOCOL_LITERAL_EXECUTION (NEW S002 turn 14)** — at session-open, transcribe EVERY protocols.md §10/§11/§22 checklist item into TodoWrite tasks. Tasks become `completed` ONLY with paired tool-call evidence. At close, every task is `completed` or `deferred` (with explicit reason); NEVER `pending`. Closing summary uses required-header template at `_handoff/VAULT/closing-summary-template.md` — every section mandatory; empty section = AGENTS.md violation. Counters S002 turn 14 surfaced gap: ~5 of 14 §10 items skipped this session before this engraving.
- **B_CATCH_TO_ENGRAVING (NEW S002 turn 15)** — every observed gap / trap / anti-pattern / missing-execution noticed during the session MUST produce a persistent artifact (minimum: memory entry + AGENTS.md hard NO) BEFORE session close. Default-to-engrave when uncertain. Closing summary §10.13b "Catches engraved this session" is mandatory; empty = explicit `NO_CATCHES_THIS_SESSION`. Counters: S002 turn 1 caught parent-CLAUDE.md trap, did not engrave, S003 turn 1 re-hit it.
- **B_FIVE_SURFACE_ENGRAVING / P-META-007 (NEW S002 turn 17)** — when AI detects a catch (gap / trap / anti-pattern / failure-mode), the 5-Surface Engraving Cycle fires: Detect → Classify → Design-delta → Apply-atomically (all 5 surfaces same response/commit: **schema + validator + hook + memory + contract**) → Verify-completeness (meta-RZF) → Emit-evidence-block (FSE block in closing §10.13c) → Propagate. Below 2 surfaces = anti-pattern; 5/5 = full mechanical. Closing summary §10.13c FSE evidence block is mandatory for every new discipline engraved. The compounding-returns mechanism = the platform's structural moat. Canonical spec: `pillar-0-governance/five-surface-engraving.md`.

The handoff §0 contains the full hard-rules list (24+) + cardinal directives + read-order + first-actions checklist. Read it completely before substantive work.

REQUIRED FIRST ACTIONS IN ORDER (per B_PROTOCOL_LITERAL_EXECUTION):
1. Answer my "prior-platform precedent" step 0 question (per protocols.md v1.7 §11 step 0)
2. Run TodoWrite — transcribe every applicable protocols.md §10 + §11 item into pending tasks
3. Read priority order per HANDOFF-S002-to-S003.md §1 (12 governance leaves now)
4. Run §1.1 verification command — surface any mismatch
5. Verify intent-to-impact §16
6. Emit two-sided handshake §17 attestation as your first reply (every line ✅ or ❓)
7. ONLY THEN proceed to §3 work — never skip a numbered step above

Begin.
```

---

## Why this exists (per protocols.md v1.6 §22)

The user S002 turn 13 caught: closing AI was generating only minimal `Read §0 and execute` — too thin for the user to know what they were triggering. v1.6 mandates two paste-targets at every closing:

1. **Minimal** — for the new AI to navigate (terse)
2. **Detailed standalone** — for the user to understand what they're triggering (this file)

This file is re-accessible if user opens chat in different IDE/context where clipboard paste isn't available.
