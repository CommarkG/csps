---
id: csps.intake.input-assessment-questions
name: external-input-assessment-questions
description: The canonical question list the AI MUST run through when assessing every external input. Created S002 turn 7 per user directive ("create a list of questions to be used when assessing inputs, i want to review them"). For user review BEFORE locking. Every assessed input gets the answers logged in metadata.yaml; questions with no answer surface in closing summary.
version: 1.0                          # LOCKED — user approved option B (split structure) S002 turn 9
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:draft
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: protocol, href: ./manual-protocol.md }
  - { rel: spine, href: ../pillar-0-governance/ai-behavior-spine.md }
domain_path: platform
---

# Input-Assessment Questions (LOCKED v1.0)

> **Locked at S002 turn 9 — user approved option B (split structure: 13 mandatory + 18 conditional + 12 emergent).** This is now the binding checklist the AI runs on every input.

## Three tiers of question-firing

The 43 questions are NOT all asked per-input. They're tiered by trigger:

| Tier | Count | When | Cost per input |
|---|---|---|---|
| **Mandatory always (Sections 1+2)** | 13 | Every input | <1 sec — auto-derivable from input + scan results |
| **Conditional on content (Sections 3+4+5)** | 18 | Triggered by specific content patterns (see triggers below) | 5-20 sec when triggered |
| **Emergent at session close (Sections 6+7)** | 12 | Per-session audit at closing-summary via spine audit | Negligible per-input; aggregated at session-end |

**Total:** 13 always + 18 conditional + 12 emergent = 43 questions tracked. Most inputs answer 13-25 (not all 43).

## Conditional firing rules

- **Section 3 (Schema mapping, Q14-20)** fires when extraction happens (i.e., almost always, but Q15 only fires on `unknown-path-protocol` invocation; Q17-19 only fire when AI proposes invention).
- **Section 4 (Multi-section, Q21-25)** fires only when input has ≥2 distinct sections.
- **Section 5 (Decisions required, Q26-31)** fires only when input requests a decision OR triggers a checkpoint (per B_CHECKPOINT_8_CATEGORIES).

## Emergent layer

- **Section 6 (Completion-pushing, Q32-38)** is audited per-session via spine audit at closing-summary (per `proactive-completion.md` F4 + F8). Not per-input.
- **Section 7 (Behavioral compliance, Q39-43)** is audited per-session via spine audit. Not per-input.

## How this list is used

Every input that triggers the manual-protocol (per `manual-protocol.md` Step 1-7) gets these questions answered explicitly in its `metadata.yaml`. Questions with no good answer surface in the closing summary as "needs-user-clarification" — never silent-fill.

The list has 6 sections — origin/identity, content/risk, schema-mapping, multi-section, decisions-required, completion-pushing.

## Section 1 — Origin + identity (every input answers ALL)

1. **Who originated this content?** (closed enum: `human-user` / `online-sourced` / `other-app` / `internal-csps` / `near-miss-reported`)
2. **What is the specific origin detail?** (free string — for `other-app`: which app — Claude Code/Lovable/Cursor/ChatGPT/Antigravity/CSP-platform/etc.; for `online-sourced`: URL or description)
3. **What is the received_at_iso timestamp?** (ISO 8601 second-precision; mechanical via timestamp-stamping audit)
4. **What is the received_via channel?** (closed enum: `chat-paste` / `chat-paste-document-block` / `file-upload` / `inbox-drop` / `url-fetch` / `user-mention`)
5. **Who submitted it?** (user identity; for self-extracted: AI session-id)
6. **What is the trust tier?** (closed enum: `tenant_authored` / `tenant_invited_party` / `tenant_url_paste` / `public_web_fetch` / `external_ai_export`)
7. **Is this a duplicate?** (compare `content_hash` SHA-256 against ledger; if match, route to dedupe path with reference to original EXT-ID)

## Section 2 — Content + risk (every input answers ALL)

8. **What is the content modality?** (closed enum extension per S002 turn 6 research stream R21: `text-prose` / `text-structured-doc` / `text-spreadsheet` / `text-code-source` / `text-code-config` / `text-log` / `text-chat-export` / `structured-json` / `structured-parquet` / `audio-call-recording` / `audio-meeting-recording` / `audio-voicemail` / `audio-podcast` / `video-screen-recording` / `video-meeting-video` / `video-presentation` / `image-photo` / `image-screenshot` / `image-diagram` / `image-chart` / `mixed-pdf-text` / `mixed-pdf-with-images` / `mixed-pdf-scanned` / `ai-export-claude-code` / `ai-export-chatgpt` / `ai-export-cursor` / `ai-export-lovable` / `ai-export-other` / `binary-archive` / `binary-unknown`)
9. **What is the source_type?** (closed enum from `source-types.md`)
10. **What is the risk_profile?** (low / medium / high — derived deterministically from source_type per `source-types.md` rules)
11. **Did the prompt-injection scan pass?** (clean / quarantined / skipped — with reason for skip)
12. **What is the byte size?** (mechanical metric)
13. **Are there embedded sub-files?** (PDF with images, PowerPoint with embedded Excel, archive with multiple files — recursive expansion needed?)

## Section 3 — Schema mapping (every input answers ALL)

14. **Which leaf(s) does this content map to?** (one or more from `contexts/` tree — 45 destinations)
15. **If no leaf matches: did the AI explicitly check all 45 destinations + fail to find?** (yes / no — required for unknown-path-protocol invocation)
16. **Is this content cross-cutting?** (≥3 leaves OR ≥2 pillars; if yes, route canonical to `cross-cutting/` + stubs in each leaf)
17. **Did the AI consult existing CSPS docs that touch this content's topic?** (B_CHECK_EXISTING_DECISIONS_FIRST — closed enum: explicit-yes-with-doc-list / explicit-no-with-reason / not-applicable)
18. **Did the AI check user-platform precedent (CSP carry-forwards)?** (closed enum: explicit-yes-with-evidence / explicit-no-with-reason / not-applicable)
19. **Is the AI inventing a new structure / format / pattern as part of this extraction?** (yes/no — if yes: B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK requires `precedent_checked:` field with closed enum value)
20. **What downstream artifact will absorb this?** (specific path — leaf doc / ADR / new principle / ledger entry)

## Section 4 — Multi-section (only for inputs with multiple distinct sections)

21. **Does this input contain multiple distinct sections targeting different leaves?** (yes/no)
22. **If yes: how many sub-IDs?** (count + sub-ID list)
23. **Per sub-ID: what is the section_label, the routed_to leaf, the confidence, the priority_tier?** (matrix — one row per sub-ID)
24. **What rolls up to the parent EXT-ID's state?** (least-advanced child's state per spec)
25. **Is any sub-section cross-cutting separately from the parent?** (a sub-section can ripple ≥3 leaves while siblings don't)

## Section 5 — Decisions required (closing summary surface)

26. **Does this input request a decision from the user?** (yes / no — distinguishes informational input from action-required)
27. **If yes: is the decision in PCR format ready to present?** (per P-OP-003)
28. **Does this input trigger a checkpoint?** (per B_CHECKPOINT_8_CATEGORIES — constitutional / cross-tier / external / circulated / irreversible / scope-expansion / strategy-pivot / high-stakes-one-shot)
29. **If checkpoint triggered: AI MUST stop + ask via PCR before any execution.**
30. **Does this input expand scope beyond ratified §3 work?** (B_AUTONOMY_4_CONDITIONS condition #1 — within ratified scope)
31. **If scope expansion: was it explicitly authorized?** (or is the AI inferring authorization — anti-pattern per S002-turn-7 self-audit)

## Section 6 — Completion-pushing (the proactive layer)

32. **What is the SLA for this input's pipeline_state transition?** (per `proactive-completion.md` F1 — derived from priority_tier + state)
33. **What is the recurrence_check_at?** (30d critical / 90d default per F2)
34. **Is this a recurrence of a prior closed item?** (if yes: `recurrence_count` increments; if K=2 within 90d → auto-ADR per F3)
35. **Will this be surfaced in the closing summary?** (per F4 — yes, every EXT-ID in this session)
36. **Will any deferred-this-session item resurface at next fresh-chat?** (per F5)
37. **Does this input fall under the weekly Discovery-queue review?** (per F8 if `discovery_origin: true`)
38. **Should this input contribute to the meta-loop trend?** (per F7 — every closed item contributes to cycle-time trend over 90-day rolling window)

## Section 7 — Behavioral compliance (per ai-behavior-spine.md)

39. **Did the AI use the top-expert-colleague voice?** (B_AI_PROFESSIONAL_VOICE — direct, push-back when warranted, no sycophancy)
40. **Did the AI validate before assuming any state about this input?** (B_VALIDATE_BEFORE_ASSUME — every assertion paired with tool-call evidence)
41. **If gaps exist in user's directive on this input: did the AI ask before filling?** (B_ASK_WHEN_FILLING_GAPS)
42. **Did the AI atomic-dual-register the work?** (B_ATOMIC_DUAL_REGISTRATION — work + ledger entry land in same commit)
43. **Did file mentions in the closing summary include git URLs?** (B_ALWAYS_GIT_LINKS — defer until git ships week 1)

## Recommendation summary (what this list IS)

- **38 questions across 7 sections** — every external input answers every applicable question
- **Origin + identity = mandatory always (questions 1-7)**
- **Content + risk = mandatory always (questions 8-13)**
- **Schema mapping = mandatory always (questions 14-20)** — this is where B_NO_INVENTION + B_CHECK_EXISTING_DECISIONS bite
- **Multi-section = conditional (only for multi-section inputs)**
- **Decisions = mandatory always (questions 26-31)** — surfaces checkpoints + scope-creep
- **Completion-pushing = mandatory always (questions 32-38)** — the 7 forcing functions are wired in
- **Behavioral compliance = mandatory always (questions 39-43)** — the ai-behavior-spine surfaces

## Open issues for user to lock-in

1. **Is 43 questions too many or too few?** (concern: tagging-tax — per Stream R21 research, >10 seconds per item drops adoption)
2. **Should some questions be auto-derived rather than asked?** (e.g., `risk_profile` is deterministic from `source_type` — should not be in question list?)
3. **Should some questions only fire conditionally?** (e.g., questions 17-19 only when AI proposes invention — could collapse "is AI inventing" + "did AI check" into one workflow rather than 3 questions)
4. **What format for the AI's answers?** (structured YAML in metadata.yaml? prose narrative? closed-enum-where-possible?)
5. **What's the failure-mode if a question is unanswered?** (block extraction? warn-only? auto-default?)

User: please review + mark each question as `keep` / `drop` / `merge-with-N` / `defer-conditional` / `auto-derive`. Once locked, this becomes binding.
