---
id: SIA.UX-PREVENTION-ARCHITECTURE
name: UX-PREVENTION-ARCHITECTURE
description: "6 prevention loops that make UX violations impossible to create — not just auditable after. CSPS doctrine: prevention over detection. Every loop fires BEFORE the file is written. Ratified S059 by Governor."
type: architecture
protection_level: protected
status: ratified
core_spines: [AI, GVRN, VALD]
core_spine: AI
schema_anchor: vault_files
version: "1.0"
session: S059
owner: group:finky
lifecycle: production
lifecycle_state: active
context_question: "Is this a detection mechanism (fires after creation) or a prevention gate (fires before)? If detection — rethink it as prevention. Only T1 hooks prevent. T2 validators detect."
context_quote: "The whole industry runs after closing gaps. CSPS closes the gap before it opens."
inherits_from: "Platform Genome §1 Behavioral Contracts + UX-UI-STANDARDS.md + VOICE-PROFILE-SYSTEM.md"
links:
  - { rel: ux-standards, href: UX-UI-STANDARDS.md }
  - { rel: voice-profiles, href: VOICE-PROFILE-SYSTEM.md }
  - { rel: design-tokens, href: ../../tools/config/design-tokens.yaml }
  - { rel: plan-coverage-gate-pattern, href: ../../.claude/hooks/pre-tool-use-plan-coverage-gate.sh }
---

# UX Prevention Architecture — 6 Loops

> CSPS principle: **prevention, not detection.**
> T2 validators (pnpm verify) detect violations after they're built.
> T1 hooks (pre-tool-use) prevent violations from being built.
> Every loop below is T1 — it fires BEFORE the file is written.
> Ratified: Opus-8 | Governor: Yariv Fink | S059

---

## Why Detection Is Not Enough

`validate-ux-audit.mjs` in `pnpm verify` = T2 (detection after creation).
This is the industry default. CSPS replaces it with T1 gates.

The difference:
- Detection: Build → test → fix → ship (violation enters the codebase)
- Prevention: Gate → answer UX questions → build → ship (violation never enters)

---

## Loop 1 — UX Creation Gate

**Hook:** `.claude/hooks/pre-tool-use-ux-creation-gate.sh`
**Fires on:** Write or Edit to any `page.tsx` file
**T1 implementation:** `pre-tool-use` hook, Exit 2 = BLOCK

**What it checks:**
- New content contains `const pageDNA` (pageDNA declaration)
- pageDNA includes `purpose` field (plain language, one sentence)

**Block message (exact):**
```
UX CREATION GATE [BLOCKING]: New page.tsx missing required pageDNA fields.
Before creating this page, add to pageDNA:
  purpose: "[one plain-language sentence — what does this page help the user DO?]"
  options: "[2-4 things the user can do here — array or comment]"
  nextStep: "[where does the user go after this page?]"
These are UX requirements, not metadata.
See: docs/SIA/UX-UI-STANDARDS.md §5 Pre-ship Checklist Q4/Q5/Q7.
```

**Pass condition:** pageDNA present with `purpose` field → allow write
**Rollback:** Remove the hook file — all page writes unblocked immediately

---

## Loop 2 — Voice Profile Mandate

**Hook:** `.claude/hooks/pre-tool-use-voice-profile-gate.sh`
**Fires on:** Write or Edit to files containing `<form`, `<input`, `<textarea`, `WizardClient`, or `GuardQuestionForm`
**T1 implementation:** `pre-tool-use` hook, Exit 2 = BLOCK

**What it checks:**
- File content includes `voiceProfile` prop declaration OR `useVoiceProfile` hook call

**Block message (exact):**
```
VOICE PROFILE GATE [BLOCKING]: This form/wizard has no voice profile.
Forms without a voice profile use hardcoded exam language.
Before writing this component, add:
  voiceProfile="colleague"    — conversational, example-driven
  voiceProfile="professional"  — formal, structured
  voiceProfile="mentor"        — exploratory, scaffolded
Or use: const vp = useVoiceProfile('colleague')
See: docs/SIA/VOICE-PROFILE-SYSTEM.md §4 Component Integration.
```

**Pass condition:** `voiceProfile` or `useVoiceProfile` found → allow write
**Rollback:** Remove the hook file — all form writes unblocked immediately

---

## Loop 3 — Design Token Advisory (warn-and-allow)

**Hook:** `.claude/hooks/post-tool-use-design-token-check.sh`
**Fires on:** Write or Edit to any `.tsx` or `.ts` file (PostToolUse — advisory, not blocking)
**T1 implementation:** PostToolUse advisory (not blocking during adoption period)

**Calibration (Governor-ratified S059):** Warn-and-allow during adoption period.
Advisory only — does not block. Upgrade to blocking when token adoption reaches 80%.

**What it checks:**
- New content contains hardcoded hex colors (`#[0-9a-fA-F]{3,6}`)
- Or hardcoded pixel values in inline styles (`[0-9]+px` in style= attributes)
- Cross-references against `tools/config/design-tokens.yaml` — values already there = allowed

**Advisory message:**
```
DESIGN TOKEN ADVISORY: Hardcoded value detected: [value]
This value may already exist as a token in tools/config/design-tokens.yaml.
Using tokens ensures 30 apps update together when values change.
Check the token registry and replace if a token exists.
(Advisory only — not blocking during adoption period)
```

**Exception:** Lines containing `// token-exception: [reason]` are skipped.
**Rollback:** Remove the hook file — no change to any file behavior

---

## Loop 4 — ADD Not REPLACE Gate

**Hook:** `.claude/hooks/pre-tool-use-add-not-replace-gate.sh`
**Fires on:** Write (full file replacement) to any existing `.tsx` file
**T1 implementation:** `pre-tool-use` hook, Exit 2 = BLOCK

**What it checks:**
- If the target file already exists with content
- If new content length < 50% of existing content length → potential REPLACE
- If existing file contains `// DO NOT REPLACE` comment → enforce strictly

**Block message (exact):**
```
ADD NOT REPLACE GATE [BLOCKING]: This Write would remove [N]% of existing content.
Existing: [N] lines. New: [N] lines.

REPLACE operations require explicit Governor directive: "REPLACE [exact filename]"
Without that directive, this operation is BLOCKED.

Options:
  1. Add a new section BELOW existing content
  2. Use Edit tool to modify specific sections
  3. Get Governor directive if replacement is truly needed

See: AGENTS.md — ADD not REPLACE rule (S059).
```

**Threshold:** 50% content reduction triggers the gate. Configurable in hook header.
**DO NOT REPLACE enforcement:** Files with `// DO NOT REPLACE` at line 1 → 0% tolerance
**Rollback:** Remove the hook file — all Write operations unblocked immediately

---

## Loop 5 — PROTO UX Pre-flight (Opus-side gate)

**Location:** `tools/templates/startup.template.md` DIRECTOR SECTION
**Fires on:** Every Opus PROTO that contains UI build instructions
**T1 implementation:** Opus Turn discipline — pre-flight block in PROTO format

**Required format (every UI PROTO must include):**

```
UX PRE-FLIGHT (required before any UI PROTO):
  Use case: [Wizard / Dashboard / Config / Nav / Onboarding]
  Checklist: [items from UX-UI-STANDARDS.md §3 that apply]
  pageDNA for each new page:
    purpose: [one plain-language sentence]
    options: [2-4 user options]
    nextStep: [next page or action]
  Voice profile: [colleague / professional / mentor]
  ADD not REPLACE check: [existing pages affected?]
```

**Block condition:** If Opus issues a PROTO with UI work that lacks this block →
governor-prompts validator flags it as INCOMPLETE PROTO.

**Why Opus-side:** The architectural failure in S059 was not Sonnet building wrong — 
it was Opus specifying UI without UX answers. This gate fixes the spec, not the build.

---

## Loop 6 — UX Positive Reflexivity

**Register:** `tools/data/ux-violation-register.yaml`
**Hook:** Extension of `post-tool-use-cec-trigger.sh`
**Fires on:** PostToolUse — when UX gate blocks OR advisory triggers

**How it works:**
1. Any gate BLOCK or advisory is logged to ux-violation-register.yaml
2. Entry format: `{ id, type, file, rule, k_count, first_seen, sessions, status }`
3. At k_count >= 2: Learning Loop drafts a T1 hook proposal in pending-plan-items.yaml
4. At k_count >= 3: SESSION BLOCKS until T1 hook is committed

**This closes the loop:** Every violation that gets past Loops 1-5 auto-generates
a stronger gate for that specific pattern. The prevention system grows over time.

**Connection to existing:** Parallel to gap-recurrence-register.yaml + 
validate-positive-reflexivity.mjs. Same pattern, UX domain.

---

## Hook Summary Table

| Loop | Hook file | Type | Blocks? | Fires on |
|---|---|---|---|---|
| 1 UX Creation | `pre-tool-use-ux-creation-gate.sh` | T1 PreToolUse | YES | Write to page.tsx |
| 2 Voice Profile | `pre-tool-use-voice-profile-gate.sh` | T1 PreToolUse | YES | Write to form/wizard |
| 3 Design Token | `post-tool-use-design-token-check.sh` | PostToolUse | ADVISORY | Write to .tsx |
| 4 ADD not REPLACE | `pre-tool-use-add-not-replace-gate.sh` | T1 PreToolUse | YES | Write to existing page |
| 5 PROTO Pre-flight | startup.template.md DIRECTOR | T3 Discipline | SOFT | Every UI PROTO |
| 6 UX Reflexivity | ux-violation-register.yaml + cec extension | T1 PostToolUse | AT K=3 | Any gate trigger |

---

## Rollback Plan (all steps retrievable)

Every hook can be individually disabled:
- Remove `.claude/hooks/[hook-name].sh` → that specific gate is off
- No other hooks affected
- The behavioral test proves the gate works before it blocks production use

Order to install hooks safely:
1. Loop 6 first (register only — no blocking, just logging)
2. Loop 4 (ADD not REPLACE — lowest false-positive risk)
3. Loop 2 (Voice Profile — medium risk; new forms only)
4. Loop 1 (UX Creation — highest impact; requires all new pages to have pageDNA)
5. Loop 3 (Design Token — advisory only, cannot break anything)
6. Loop 5 (Opus discipline — no automated blocking)

---

## Behavioral Tests (mandatory before each hook is activated)

Each hook must have a test proving:
- INPUT A (violation) → hook fires, exit code 1 (BLOCK) or advisory message
- INPUT B (compliant) → hook passes, exit code 0

Test files: `tools/tests/behavioral/[loop-name]-test.sh`

---

*CSPS — UX Prevention Architecture v1.0 | RATIFIED S059 | Opus-8*
*All steps are permanent. Rollback by removing individual hook files.*
*Update when: new prevention pattern identified, threshold adjusted, hook upgraded*
</content>
