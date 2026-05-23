---
id: SIA.VOICE-PROFILE-SYSTEM
name: VOICE-PROFILE-SYSTEM
description: "Platform Voice Profile System — defines communication tone/attitude as configurable profiles. Each profile is a named set of characteristics applied to any UI component. Full CRUD via /platform/voice-profiles dashboard. Profiles are versioned, bundleable, and tier-aware."
type: architecture
protection_level: protected
status: ratified
core_spines: [AI, ARCH, OPER]
core_spine: AI
schema_anchor: vault_files
version: "1.0"
session: S058
owner: group:finky
lifecycle: production
lifecycle_state: active
context_question: "Which voice profile is this component using? Is it the platform default or a custom profile? Has the profile been ratified or is it still draft?"
context_quote: "The difference between an exam and a colleague is not what is asked — it is how."
inherits_from: "Platform Genome §1 Behavioral Contracts + R1-08 Template Bundle System + B_UX.md"
links:
  - { rel: platform-genome, href: ../PLATFORM-GENOME.md }
  - { rel: template-bundle-system, href: R1-08-TEMPLATE-BUNDLE-SYSTEM.md }
  - { rel: voice-profiles-data, href: ../../tools/config/voice-profiles.yaml }
  - { rel: wizard-client, href: ../../apps/csps-playground/src/app/platform/wizard/WizardClient.tsx }
---

# Voice Profile System

> Defines the WHAT (profiles) and the HOW (CRUD dashboard + component wiring).
> All product UI components (wizard, onboarding, help tooltips) declare a voice profile.
> The profile controls: labels, placeholder text, tip language, error messages.
> Ratified: Opus-8 | Governor: Yariv Fink | S058

---

## 1. Why This Exists

The CSPS Planning Wizard was launched and immediately felt like an exam. The guard questions
were interrogations, not conversations. The labels were instructions, not invitations.

This is not a bug — it's an architectural gap. CSPS had tone governance for AI-to-AI
communication (B_AI_PROFESSIONAL_VOICE, prose-patterns.md) but nothing for product UI
tone. This system closes that gap.

**Principle:** The voice profile separates WHAT is asked from HOW it is asked.
The structure of a wizard step (7 sections, required fields, guard questions) stays constant.
The language wrapping that structure adapts per profile.

---

## 2. Foundation Profiles (ratified S058)

Three foundation profiles — locked at Tier 1, inherited by all apps:

### colleague
> "Like talking to a smart friend who has done this before."

- Labels: Short, first-person friendly, action-oriented
- Placeholders: Invitations, not instructions
- Tips: Real people, real scenarios, concrete examples
- Errors: "That's short — add one real person and their friction"
- Applies when: Developer is building a new app, brainstorming stage

### professional
> "Like a structured business proposal process."

- Labels: Complete sentences, formal, specific
- Placeholders: Criteria-based, measurable outcomes
- Tips: Frameworks and quantifiable targets
- Errors: "Please provide more specific detail including user type and frequency"
- Applies when: Enterprise context, investor-facing, formal documentation

### mentor
> "Like a patient guide who helps you discover the answer yourself."

- Labels: Open-ended, exploratory, reflective
- Placeholders: Prompts that trigger thinking, not just filling
- Tips: Questions that scaffold the user's own reasoning
- Errors: "Take another look — think about a customer you spoke to recently"
- Applies when: First-time users, educational context, onboarding flows

---

## 3. Profile Schema (voice-profiles.yaml)

Location: `tools/config/voice-profiles.yaml`

```yaml
profiles:
  colleague:
    id: colleague
    display_name: "Colleague"
    description: "Like a smart friend who has done this before"
    status: ratified  # draft | ratified | deprecated
    locked: true  # foundation profiles cannot be deleted
    tier: T1  # T1=platform, T2=app, T3=session
    fields:
      problem_statement:
        label: "What's the problem?"
        placeholder: "One line — like you'd say it to a friend"
        tip: "Best answers name one real person and their specific friction. e.g. 'Yariv who chases invoices and hates confrontation'"
        guard: "Can you name 3 real people who have this problem today?"
        error_short: "Add a real person and their friction"
      user_persona:
        label: "Who is your main user?"
        placeholder: "Their role and biggest daily frustration"
        tip: "Start with one person you know personally — not a demographic"
        guard: "Would this person pay for this if it existed today?"
        error_short: "Get more specific — name a job and a frustration"
      # ... remaining 5 sections follow same pattern

  professional:
    id: professional
    display_name: "Professional"
    description: "Structured and formal — business proposal style"
    status: ratified
    locked: true
    tier: T1
    fields:
      problem_statement:
        label: "Describe the business problem this application addresses"
        placeholder: "Include user type, frequency, and current workaround"
        tip: "Quantify where possible: e.g. 'SMB owners spending 3hrs/week on manual invoice follow-up'"
        guard: "Can you name 3 organizations that experience this problem?"
        error_short: "Include user type, frequency, and current alternative"
      # ...

  mentor:
    id: mentor
    display_name: "Mentor"
    description: "Patient and exploratory — helps you discover the answer"
    status: ratified
    locked: true
    tier: T1
    fields:
      problem_statement:
        label: "What problem are you trying to solve?"
        placeholder: "Think about a customer who contacted you last week..."
        tip: "What were they frustrated about? What did they wish existed?"
        guard: "Imagine explaining this to someone at dinner. What would you say?"
        error_short: "Tell us more — think about one specific customer moment"
      # ...
```

---

## 4. Component Integration

Any React component declares its profile via a prop or context:

```typescript
// Option A: explicit prop
<WizardClient voiceProfile="colleague" />

// Option B: app-level context (preferred for apps)
<VoiceProfileProvider profile="colleague">
  <WizardClient />
</VoiceProfileProvider>

// Option C: user preference from BehaviorProfile (Phase 2)
const { voiceProfile } = useBehaviorProfile()
<WizardClient voiceProfile={voiceProfile} />
```

The `useVoiceProfile(fieldName)` hook returns the correct label/placeholder/tip/guard for
the active profile and any given field name.

---

## 5. CRUD Dashboard — /platform/voice-profiles

### Page structure

```
/platform/voice-profiles
  ├── Profile list (left sidebar)
  │   ├── [colleague] ● ratified — locked
  │   ├── [professional] ● ratified — locked
  │   ├── [mentor] ● ratified — locked
  │   └── [+ New profile] button
  │
  ├── Profile editor (main area)
  │   ├── Header: profile name + status chip + lock indicator
  │   ├── Description field
  │   ├── Field editor: for each wizard section:
  │   │   ├── label input
  │   │   ├── placeholder input
  │   │   ├── tip input
  │   │   ├── guard input
  │   │   └── error_short input
  │   ├── [Save as Draft] | [Ratify] | [Deprecate] | [Delete] buttons
  │   └── Preview pane: live preview of one wizard step in this profile
  │
  └── Assignment panel (bottom)
      Shows: which components/apps use which profile
```

### CRUD operations

**Create:** Click "+ New profile" → blank form with status=draft → fill fields → Save as Draft

**Read:** Click any profile → view all fields + assignment info + status history

**Update:** Edit any field → autosave to draft → Ratify when ready (locked profiles show fields as read-only with "fork to edit" button)

**Delete:** Only allowed for status=draft or status=deprecated profiles. Locked (T1) profiles cannot be deleted. If a profile is in use by a component, "Delete" is disabled with tooltip showing which components use it.

**Fork:** Locked profiles can be forked (creates a copy with status=draft, new name, T2 tier). The fork can be edited freely.

---

## 6. Tier System

| Tier | Profiles | Who controls | Can delete? |
|---|---|---|---|
| T1 — Platform | colleague, professional, mentor | Governor only | No (foundation) |
| T2 — App | Custom profiles per app | App owner | Yes (if not in use) |
| T3 — Session | User preference override | End user | Session only |

T3 profiles are not persisted in the registry — they are stored in BehaviorProfile (Phase 2).

---

## 7. Bundle Integration

Voice profiles can be bundled for distribution:

```yaml
# tools/bundles/voice-profiles/COLLEAGUE-BUNDLE.bundle.yaml
id: COLLEAGUE-BUNDLE
name: "Colleague Voice Bundle"
status: SEALED
profiles: [colleague]
applies_to: [wizard, onboarding, help-tooltips]
```

When an app forks from template, it inherits the platform's ratified profiles automatically.

---

## 8. What Gets Built (in order)

**S059 PROTO-A (immediate):**
1. `tools/config/voice-profiles.yaml` — 3 foundation profiles with all wizard fields
2. `src/hooks/useVoiceProfile.ts` in playground — reads profiles, returns field data
3. WizardClient rewritten to use colleague profile labels/tips (NOT exam language)
4. Save API fixed: use `/tmp` for Vercel, local `tools/data/` for dev

**S059 PROTO-B:**
5. `/platform/voice-profiles` dashboard — list + editor + preview pane
6. CRUD: create draft, edit, ratify, deprecate, delete (with guard)
7. Assignment panel: shows component→profile mapping

**S060:**
8. Extend to other components: onboarding, help tooltips
9. BehaviorProfile voice preference (Phase 2, requires Supabase)
10. Bundle sealing

---

*CSPS — Voice Profile System v1.0 | RATIFIED S058 | Opus-8*
