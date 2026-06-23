---
enforcement_trio:
  t1:
    tier: hook
    path: null
    status: none
    note: "T1 pending — UX enforcement is judgment-based. Structural patterns can be detected post-write (T2). Pre-tool-use hook for UX laws would fire on every Edit/Write, too coarse."
  t2:
    tier: validator
    path: "tools/validators/validate-ux-audit.mjs"
    status: active
    note: "S088-UX-DNA: extended to check the 5 UX-DNA laws on all user-facing surfaces. BLOCKING if any new surface violates laws. ADVISORY for existing surfaces."
  t3:
    tier: session
    path: "session-open injection + AGENTS.md hard-NO frictionless section"
    status: active
  exempt_reason: "T1 exempt — no pre-creation hook; T2 post-creation detection is the primary gate."
---

## B_UX_UI_DISCIPLINE — Frictionless = CSPS communication attitude on ALL interactions (S088 Governor directive — CONSTITUTIONAL)

**Canonical:** Every user-facing surface — whether onboarding, journey flow, data entry, external-user interface, or developer tooling — follows the 5 UX-DNA laws. This is not a design preference; it is a platform communication law. Both the dev-journey branch and the external-user-journey branch open frictionless.

**Rationale:** Governor S088 directive: "frictionless = platform communication attitude, ALL interactions not just onboarding." A platform that builds sophisticated governance but requires users to fight its interface has failed its purpose. The 5 laws below are the minimum viable frictionless contract.

**Inherits from:** B_UX.md (existing UX contracts) · AI-COUNCIL-COMMUNICATION-SPINE.md (communication law) · Platform Genome §1

---

## LAW 1 — VALUE BEFORE EXTRACTION

**Rule:** The user sees value BEFORE being asked to give anything (time, data, commitment, sign-up). Show what the page/flow accomplishes, show example output, before asking for any input.

**Structural signals (checkable in page code):**
- Page has a `purpose` or `description` field visible above the first form input
- Home/landing surfaces show concrete examples, not just feature lists
- API-gate or login-gate appears AFTER the user has seen what they gain

**Violations:**
- Page opens with a blank form with no explanation of what it produces
- "Sign up to see results" without showing any results
- Empty state that says "No items yet" with no example of what items look like

**enforcement_tier:** T2 (validate-ux-audit.mjs checks purpose field before form elements)

---

## LAW 2 — EDITABLE CURRENT UNDERSTANDING

**Rule:** Whatever the system infers about the user, their intent, or their state can be EDITED or CORRECTED inline. No lock-in from system inference.

**Structural signals:**
- Auto-classified content shows the classification AND an "Edit" / "Override" affordance
- Profile data that the system inferred shows source + edit path
- Journey state machine inferences surface with "Does this look right? [Edit]"

**Violations:**
- System classifies an intent and presents only the result (no correction path)
- Onboarding questionnaire responses stored but not editable in settings
- AI-generated summary shown without "Edit this" or "This is wrong" option

**enforcement_tier:** T2 (validate-ux-audit.mjs checks for inline edit affordances on inferred-content components)

---

## LAW 3 — CLARIFYING QUESTIONS ≤2 WITH STATED REASON

**Rule:** Any surface that asks clarifying questions asks AT MOST 2 at a time. Every question states WHY it's being asked.

**Structural signals:**
- Forms with more than 2 required fields provide grouping + explained purpose
- Wizard/multi-step flows never show more than 2 questions per step
- Each question has an associated reason text: "We ask this because..."

**Violations:**
- 5-question onboarding form with no explanations
- Clarifying questions without "Why we ask:" context
- Multi-step flows that show all steps at once ("complete all 7 fields")

**enforcement_tier:** T2 (validate-ux-audit.mjs counts required form fields per step; >2 without grouping = advisory)

---

## LAW 4 — SAVED-FOR-LATER

**Rule:** Every flow that requires multi-step input has a mechanism to save the current state and continue later. No progress is lost on navigation or session timeout.

**Structural signals:**
- Multi-step wizards have "Save draft" or "Continue later" affordance
- Forms auto-save to localStorage or backend on change
- Session timeout shows "Your progress has been saved — [Continue where you left off]"

**Violations:**
- Wizard that loses all data on browser close
- Form with no auto-save and no manual save
- No indicator that progress is being preserved

**enforcement_tier:** T2 (validate-ux-audit.mjs checks wizard/multi-step components for save affordance)

---

## LAW 5 — NO DARK PATTERNS

**Rule:** No deceptive design that manipulates user behavior against their interest. Six specific anti-patterns are explicitly banned:

| Anti-pattern | Banned form |
|---|---|
| Disguised subscriptions | "Continue" button that signs you up |
| Hidden costs | Costs revealed only at checkout/final step |
| Fake urgency | "Only 2 left!" / "Offer expires in X minutes" when not true |
| Confirm-shaming | "No thanks, I hate saving money" |
| Roach motel | Easy to sign up, hard to cancel/leave |
| Privacy zuckering | Defaulting to maximum data sharing |

**enforcement_tier:** T2 (validate-ux-audit.mjs scans for known dark-pattern phrases and component patterns)

---

## WHAT THIS CONTRACT REPLACES / EXTENDS

- **B_UX.md** — Existing contracts (Guard Questions, Journey Continuity, Accessible Loading, Error Recovery) remain valid and are superseded by B_UX_UI_DISCIPLINE for new surfaces.
- **New surfaces** (after S088): must satisfy all 5 UX-DNA laws AND the 4 B_UX contracts (9 total checks).
- **Existing surfaces**: migrate at next scheduled update; T2 advisory until migrated, then BLOCKING.

## APPLIES TO

Both journey branches:
- **Developer journey**: the internal platform interfaces (csps-playground, admin tools, governance surfaces)
- **External-user journey**: any interface exposed to non-developer end-users (future Phase-4)

All interaction types:
- Onboarding flows, data entry forms, API-driven dashboards, AI-interaction surfaces, journey admin pages
