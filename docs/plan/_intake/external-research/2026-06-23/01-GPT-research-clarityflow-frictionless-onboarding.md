# [EXT-2026-06-23-01] ClarityFlow — Frictionless Onboarding for Lovable

**Source:** GPT research  
**Date:** 2026-06-23  
**Pipeline entry:** `tools/data/external-research-pipeline.yaml → ext-2026-06-23-01`  
**Status:** P4-parked | PARK-S088-CLARITYFLOW  
**SWIFT connection:** B_UX_UI_DISCIPLINE already implements the 5 core UX-DNA laws from this doc  

---

# Frictionless Onboarding for Lovable — 06.2026 Demo Brief

**File:** `2026-06-23__GPT-Research__Frictionless_Onboarding_for_Lovable_06-2026__V1.md`  
**Purpose:** Give Lovable a clear, build-ready brief for a small demo that proves frictionless onboarding as the entry point into a larger communication-intelligence and planning system.  
**Scope:** Small MVP / semi-demo. Do not build the full platform. Build the first useful slice.  
**Primary audience:** SMB owners, consultants, agencies, service businesses, and teams that need better discovery, alignment, and planning before execution.

---

## 1. Core Positioning

This demo is not just an onboarding form.

It is a **frictionless communication and context-capture flow** that helps a business owner explain what they need, receive value quickly, and progressively refine their context without feeling interrogated.

The system should demonstrate that better first communication creates better downstream planning, recommendations, and service quality.

The demo should prove three ideas:

1. **Value before extraction** — the user receives something useful before being asked for many details.
2. **Progressive refinement** — the first answer is treated as a starting signal, not final truth.
3. **Save and continue** — useful but non-urgent findings are preserved and can be refined later instead of derailing the active flow.

---

## 2. Operating Mindset

The build should follow a systems-first approach.

Before adding screens, features, or logic, each element should have a clear place:

- What user problem does it solve?
- What data does it collect or infer?
- Where is that data stored?
- What does it improve later?
- Is it needed now, or should it be saved for later?
- Does it create value or only friction?

Avoid decorative complexity. The demo should feel simple, but the internal structure should be clean and expandable.

---

## 3. Main User Promise

The app should communicate this promise:

> "Tell us what you are trying to improve. We will help you clarify the real need, give you a useful first output quickly, and gradually ask only for the details that make the result better."

The user should feel:

- understood,
- not interrogated,
- helped quickly,
- able to correct the system,
- able to pause and return,
- progressively guided toward clarity.

---

## 4. Demo MVP Goal

Build a small Lovable demo that allows a business owner to:

1. Enter a goal or challenge in free text.
2. Optionally choose a business domain.
3. Receive a quick useful output.
4. See what the system understood.
5. Correct or refine the understanding.
6. Answer only a few contextual questions.
7. Save non-urgent ideas for later.
8. End with a simple "next best step" plan.

---

## 5. Suggested Demo Name

Working name: **ClarityFlow**

---

## 6. Core User Flow (8 steps)

### Step 1 — Start With Intent
First screen: "What are you trying to improve or solve right now?" — large free-text field, no mandatory profile.

### Step 2 — Quick Domain Selection
Optional domain chips: Marketing / Sales / Operations / HR / Finance / Customer Service / Technology / Strategy / Not sure.

### Step 3 — Instant First Value
After submit: what we understood + possible real issue + one recommendation + one clarifying question.

### Step 4 — Soft Understanding Panel
"Current Understanding" panel: main goal, likely domain, possible root issue, confidence level, user corrections.
Copy: "This is only our current working understanding. You can correct it anytime."

### Step 5 — Ask Only One or Two Useful Questions
Max 2 questions, each with stated reason: "To make the plan more useful, I need to know..."

### Step 6 — Generate a Mini Plan
After intent + domain + 1-2 answers: current understanding / bottleneck / first action / avoid-too-early / next refinement.

### Step 7 — Save and Schedule Non-Urgent Findings
"Saved for Later" area — does not derail the active flow.

### Step 8 — End With Clear Next Step
Primary CTA: "Refine this plan" | Secondary: "Save and continue later" | Optional: "Create deeper profile"

---

## 7. Required Screens
1. Welcome / Intent Capture
2. First Value Result
3. Current Understanding
4. Mini Plan
5. Saved for Later

---

## 8. Data Model

```
UserSession: id, created_at, user_goal_text, selected_domain, current_step, status
WorkingUnderstanding: session_id, main_goal, likely_domain, possible_root_issue, confidence_level, user_corrections
ClarifyingAnswer: session_id, question_text, answer_value, reason_for_question, domain
MiniPlan: session_id, current_understanding, likely_bottleneck, recommended_first_action, avoid_too_early, next_refinement_question
SavedFinding: session_id, title, context, why_saved, related_domain, status, revisit_trigger
```

---

## 9. AI Behavior Rules
1. Do not over-ask. 2. Do not assume certainty. 3. Show working understanding as editable.
4. Use simple business language. 5. Give value before requesting more details.
6. Treat first input as partial. 7. Ask only questions that improve the output.
8. Save side ideas instead of derailing. 9. Avoid dark patterns. 10. Say what's missing and why.

---

## 10. Tone: direct, professional, calm, helpful, non-salesy, not gamified

---

## 11. What NOT to Build in the Demo
Full CRM / full user accounts / payment / complex permissions / advanced analytics / industry database / complete AI memory / full communication intelligence engine / large multi-step questionnaire.

---

## 12. Demo Success Criteria
1. "This did not feel like a form." 2. "It helped me clarify what I actually need."
3. "It gave me value quickly." 4. "It did not ask too many questions."
5. "I could see and correct what it understood." 6. "It saved side ideas without losing them."
7. "I would continue refining this."
