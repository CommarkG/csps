---
id: csps.plan.apps.APP-001.section-5-user-journey
name: APP-001 Section 5 — User Journey
description: "Section 5 of the 7-section planning wizard for APP-001. Onboarding questions, homepage variants, and first-value moment specification. Ratified OPUS-6 S050."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: apps_planning
batch: BATCH-H
session: S050
template_id: USER_JOURNEY_SPEC
template_depth: L3
parent_template: app-section-spec
impl_status: swift-implemented
links:
  - { rel: parent-plan, href: dual-focal-plan.yaml }
  - { rel: knowledge-card, href: knowledge-card.yaml }
consolidation_cross_refs:
  - docs/plan/apps/APP-001-voice-sorting/dual-focal-plan.yaml
---

# APP-001 — Section 5: User Journey
**Ratified by:** OPUS-6 | **Session:** S050 | **Status:** RATIFIED

---

## 5.1 Onboarding — 3 Questions

The app has ONE onboarding session before the main interface. Three questions. No skip allowed.
Each answer seeds the first voice capture and personalizes the empty-state UI.

---

### Question 1 — Role Selector

> **"What best describes how you work?"**

| Option | Label | Follow-up seed |
|---|---|---|
| A | Meetings + calls all day | "Tell me after your next meeting what you need to follow up on" |
| B | Work alone, deep focus | "Tell me at the end of your day what got done and what didn't" |
| C | Managing a team or project | "Tell me after your next decision moment what you told your team" |
| D | On the move (driving, walking) | "Tell me while you're driving what's on your mind right now" |

**UX rule:** Full-screen card. Large tap targets. No "other" — force a choice.
**Data stored:** `user.role_type` (used to seed homepage empty state and notification copy).

---

### Question 2 — Capture Preference

> **"How do you want to capture? Tap when you're ready, or always-on?"**

| Option | Label | Behavior |
|---|---|---|
| A | Tap to record | Hold the button while speaking (manual) |
| B | Tap to start, tap to stop | Toggle mode (hands-free) |
| C | Auto-detect voice | Voice activity detection (future — E2) |

**UX rule:** Demo each mode with a 3-second animated preview. Default: Option A.
**Data stored:** `user.capture_mode` (sets default recording behavior on homepage).

---

### Question 3 — First Capture Seed

> **"Record your first capture right now — tell me one thing you need to do today."**

This is not optional. It's the onboarding completion gate.
- Record button is large, centered, with animated pulse ring
- "Tap and hold" instruction with visual indicator
- After recording: show the transcript, ask "Does this look right?" (Yes / Needs work)
- If "Yes": save as first vault item, complete onboarding
- If "Needs work": show editable text field, save corrected version

**UX rule:** First capture happens IN onboarding. User arrives at homepage with at least 1 vault item.
**First value moment preview:** After saving, show a flash screen: "You just offloaded your first thought. That's the whole app."

---

## 5.2 Homepage Variants — 5 States

The homepage renders differently based on vault state. Same component, different content.

---

### Variant 1 — Empty (first launch, onboarding complete)

**Condition:** `vault_item_count = 0` AND `onboarding_complete = true`

This state should not normally appear — onboarding forces a first capture.
If it does appear (e.g., user deleted their onboarding capture):

> Center of screen:
> Large microphone icon (animated, breathing)
> "What's on your mind?"
> [Big record button]
>
> Bottom: "0 captures · 0 needs review"

---

### Variant 2 — First Capture (1-3 vault items, day 1)

**Condition:** `vault_item_count ≤ 3` AND `days_since_first_use ≤ 1`

> Greeting: "Good start, [name]."
> Your first capture (as a card) — transcript + timestamp
> [Record another] button
> Bottom nudge: "Capture 3 more to see your first weekly digest"

---

### Variant 3 — Active (daily use, items to review)

**Condition:** `needs_clarification_count > 0` OR `unreviewed_count > 0`

> Header: "You have [N] items waiting"
> Card list: items sorted by urgency (needs_clarification first, then recent)
> Each card: truncated transcript + reliability score + time since capture
> [Review] button on each card
> Floating [Record] button (bottom right)

**Notification badge:** red dot on app icon when `needs_clarification_count > 0`

---

### Variant 4 — Alert (reliability below threshold OR kill-condition approaching)

**Condition:** `average_reliability_score < 0.70` for last 5 captures

> Banner at top (amber): "Your recent captures had some trouble — tap to see details"
> Homepage continues normally below the banner
> Tapping banner → diagnostics screen (microphone quality, noise environment guide)

---

### Variant 5 — Weekly Digest (Monday morning, 7-9am)

**Condition:** `day_of_week = Monday` AND `time_between = 07:00-09:00` AND `week_capture_count > 0`

> Header: "Your week in voice"
> Summary: "You captured [N] thoughts last week. [M] were resolved. [K] are still open."
> Top 3 unresolved items (cards)
> [Review all] button
> [Start this week's first capture] button

---

## 5.3 First Value Moment — Push Notification

**Trigger:** Voice capture session ends (last clip detected = silence > 30s)
**Timing:** ≤ 2 minutes after last voice note
**Delivery:** Push notification (web push + in-app if app is open)

### Notification Copy

```
From: Voice Sorting
Subject: Captured while you were busy

"3 captured while you were in your meeting"

[Open + review] → opens homepage Variant 3
```

**Copy variants by role_type:**
- meetings_calls: "3 captured while you were in your meeting"
- deep_focus: "2 captured during your focus session"
- managing_team: "4 captured after your decision"
- on_the_move: "5 captured while you were driving"

**Fallback copy (unknown role):** "[N] captures waiting for review"

### Timing rule
- Minimum: 30 seconds after last clip (user might still be recording)
- Maximum: 2 minutes after last clip
- If user has app open: in-app toast only, no push
- If `notification_permission = denied`: in-app toast on next app open

---

## Section 5 Completion Evidence

```
onboarding_questions: 3 (role / capture_preference / first_capture)
homepage_variants: 5 (empty / first / active / alert / weekly)
first_value_trigger: ≤2min after last clip
notification_copy_variants: 4 (by role) + 1 fallback
gate_condition: onboarding_3_questions_defined = TRUE
```

**Section 5 gate: CLOSED.** Gate condition: onboarding questions defined + 5 homepage variants + first-value moment specification.

---

*Authored by: Sonnet S050 | Ratified by: OPUS-6 | PMI advances to 5/5*
