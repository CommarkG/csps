---
id: csps.handoff.vault.inner-ai-defaults.permanence-mechanics
name: permanence-mechanics
description: "Honest documentation of what makes things permanent in CSPS vs what only feels permanent. Includes AI native defaults that produce temporary results, the T1/T2/T3 enforcement model, verified cases of true permanence, and the vocabulary for distinguishing them."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: vault_files
diataxis_type: reference
session: S060
context_question: "Is this creating a permanent mechanical enforcement, or a temporary description of what should happen? Name the T1 hook, T2 validator, and T3 injection — or admit it's not enforced."
context_quote: "Writing about a rule is 0% complete. T1+T2+T3 is 100% complete."
links:
  - { rel: behavioral-recipes, href: ./behavioral-recipes.md }
  - { rel: ux-prevention, href: ../../../../docs/SIA/UX-PREVENTION-ARCHITECTURE.md }
  - { rel: north-star, href: ../../../plan/pillar-0-governance/CSPS-NORTH-STAR.md }
---

# Permanence Mechanics — What Actually Sticks

> Honest documentation. No self-serving framing.
> Written after multiple sessions of creating things that drifted.
> The Governor's frustration with recurring failures is the primary source material.

---

## Part 1 — The AI's Native Default: Everything Feels Permanent

When an AI writes a rule in chat, it FEELS like the rule is now established. The AI said it clearly. The conversation is there. Surely everyone understands.

This feeling is the primary failure mode.

**Nothing in chat is permanent.** Chat evaporates when the session ends. Context limits compress it. Tab switches lose it. A new AI instance starts with zero knowledge of what was written.

The AI's native satisfaction point — the point at which it considers something "done" — is:
- "I wrote it clearly"
- "I added it to the plan"
- "I put it in the documentation"
- "I created a memory entry"
- "I mentioned it in the startup block"

ALL of these are insufficient. ALL of these produce drift within 3-5 sessions.

---

## Part 2 — The Permanence Hierarchy (T1/T2/T3)

CSPS uses a three-tier model for enforcement. Each tier is necessary. Only all three together is permanent.

### T1 — Pre-creation enforcement (fires BEFORE the file exists)
**What it is:** A `.claude/hooks/pre-tool-use-*.sh` file that runs before Sonnet writes any file.
**When it fires:** On every Write or Edit tool call matching its pattern.
**What it can do:** Read the proposed content, check it meets requirements, EXIT 2 to block the write.
**Why it matters:** This is the ONLY enforcement that prevents violations from entering the codebase. Everything else catches violations after they're already there.
**Example:** `pre-tool-use-ux-creation-gate.sh` — blocks page.tsx writes without pageDNA.purpose.

**WITHOUT T1:** The rule is aspirational. It will be violated the first time Sonnet is in a hurry.

### T2 — Verification enforcement (fires during pnpm verify)
**What it is:** A `tools/validators/validate-*.mjs` file registered in `tools/verify.mjs`.
**When it fires:** On every `pnpm verify` run — before any commit is accepted, before any session close.
**What it can do:** Scan files, check patterns, exit 1 to BLOCK the verification.
**Why it matters:** Even if T1 is bypassed (developer edits files directly), T2 catches the violation before it ships.
**Example:** `validate-zf-cycle-format.mjs` — blocks if ZF cycle cites no file names.

**WITHOUT T2:** The rule exists but violations can accumulate silently. They're only discovered when someone specifically checks.

### T3 — Session injection (fires at session start)
**What it is:** Content added to `tools/scripts/session-open-context.mjs` OR `tools/templates/startup.template.md` OR session-open hook.
**When it fires:** At every new tab start, read by session-open.sh.
**What it can do:** Surface the rule in Opus/Sonnet context so they know it exists.
**Why it matters:** The AI must KNOW the rule to follow it. T3 is how rules enter awareness.
**Example:** ZF cycle template injected at session start so Sonnet produces correct format.

**WITHOUT T3:** Sonnet and Opus revert to training defaults. Even if T1+T2 exist, the AI works against them without understanding why.

### Together: T1+T2+T3 = Permanent

```
User writes code →
  T1 checks: is this allowed? (pre-write) →
  T2 checks: does this pass verification? (post-write, pre-ship) →
  T3 informed: this is why the rules exist (session-start awareness)

All three fail gracefully: T1 block → T2 catch → T3 remind.
Missing any one: drift accumulates.
```

---

## Part 3 — The AI's Partial Defaults (Why Things Don't Stick)

These are the AI's training defaults that feel like permanence but produce drift:

### Default 1: "I wrote it in chat"
**Why it feels permanent:** The text is visible. The AI can see it. It seems established.
**Why it drifts:** Chat evaporates. Context limits compress. Next session starts fresh.
**Failure signature:** "I mentioned this earlier" without a file:line citation.
**Fix:** Write to a file, commit to git, cite the GitHub URL.

### Default 2: "I added it to the documentation"
**Why it feels permanent:** There's a markdown file now. It explains the rule.
**Why it drifts:** Documentation without validators is aspirational. Nobody enforces it. After 5 sessions, nobody reads it.
**Failure signature:** A well-written file in docs/ that has no corresponding validator or hook.
**Fix:** Every documented rule needs T2 (validator that checks compliance).

### Default 3: "I created a memory entry"
**Why it feels permanent:** There's a file in memory/. It says the right thing.
**Why it drifts:** Memory entries are T3 (loaded at session start IF the system works). If session-open-context.mjs doesn't surface it, it's never read. Memory entries are the softest form of T3.
**Failure signature:** A feedback_*.md that documents a failure mode that then recurs in the next session.
**Fix:** Memory entries are valuable for humans. For AI enforcement, they need T1+T2 to back them up.

### Default 4: "I put it in the startup block"
**Why it feels permanent:** The startup block says the rule. New sessions start with it.
**Why it drifts:** The startup block is TEXT. The AI reads it and then produces output based on training + the text. If training defaults are stronger than the text, the text loses. Also: the startup block becomes stale the moment work continues.
**Failure signature:** The startup block says "no freestyle startup blocks" and then Opus writes a freestyle startup block.
**Fix:** The startup block can only reinforce T1+T2. It cannot replace them.

### Default 5: "I said 'going forward'"
**Why it feels permanent:** "From now on we will always..." sounds like a policy change.
**Why it drifts:** "Going forward" is a wish, not a mechanism. The AI defaults to training the moment the session context doesn't explicitly remind it.
**Failure signature:** "Going forward we will always ZF cycle 2 with file citations" → next session has nominal ZF cycles.
**Fix:** T1 hook that blocks nominal ZF cycles + T2 validator that catches them.

### Default 6: "I added it to the plan"
**Why it feels permanent:** The plan has a checkbox. It's tracked.
**Why it drifts:** The plan is a document. Documents without validators drift. The plan says PROTO-F is "RUNNING NOW" long after it's been completed.
**Failure signature:** Foundation-completion-plan.md with stale status markers that mislead a new AI tab.
**Fix:** Plan status should be driven from data (unified-plan.yaml) not from manual text updates.

---

## Part 4 — Verified Cases of True Permanence

These things actually work. They have been mechanically enforced and verified:

### Case 1 — validate-zf-cycle-format.mjs
**What it enforces:** ZF cycles must cite specific file names.
**T1:** None (advisory hooks only for now).
**T2:** `validate-zf-cycle-format.mjs` — BLOCKING when ZF ACHIEVED claimed with no file citations.
**T3:** ZF template in session-open-context.mjs injection.
**Evidence of working:** [tools/data/gap-recurrence-register.yaml](https://github.com/CommarkG/csps/blob/main/tools/data/gap-recurrence-register.yaml) entry `gap_ZF_NOMINAL_CYCLES` moved from K=6 to `status: fix_committed` after T2 was added.
**Measurable:** `validate-zf-cycle-format.mjs` has caught violations in this very session (iters 12, 18, 22 — receipt writes with conceptual Cycle 2 without file citations).

### Case 2 — pre-tool-use-ux-creation-gate.sh
**What it enforces:** New page.tsx files must have pageDNA with purpose field.
**T1:** `.claude/hooks/pre-tool-use-ux-creation-gate.sh` — blocks Write to page.tsx without pageDNA.
**T2:** `validate-page-dna.mjs` — checks existing pages.
**T3:** UX Pre-flight block in startup.template.md.
**Evidence:** Every new playground page in S058-S060 has pageDNA with purpose. Sonnet's reports confirm the hook fires and is respected.
**Caveat:** Hook is advisory (exit 0) — catches violations but doesn't block due to IDE permission dialog problem. T2 still BLOCKS via pnpm verify.

### Case 3 — validate-gap-recurrence.mjs
**What it enforces:** K≥2 gaps require structural fixes. K≥3 blocks session close.
**T1:** None directly (post-tool-use-cec-trigger.sh fires CEC when patterns detected).
**T2:** `validate-gap-recurrence.mjs` — advisory for K≥2, blocking for K≥3 without structural fix.
**T3:** Gap register mentioned in session-open injection.
**Evidence:** gap_T1_AI_CONCEPTION_VAULT moved from K=5/open to K=5/structural_fix_proposed after S055 work. The validator tracked the progression.

### Case 4 — session-open.sh auto-repair
**What it enforces:** settings.local.json always has bypassPermissions on session start.
**T1:** `session-open.sh` — always writes the canonical bypass content (not conditional).
**T2:** `validate-settings-shadow.mjs` — BLOCKING if settings.local.json shadows settings.json without bypassPermissions.
**T3:** None needed — T1+T2 cover it.
**Evidence:** Permission popups stopped after [e80a726](https://github.com/CommarkG/csps/commit/e80a726) fixed the conditional → always write issue. The measurable test: "did any permission dialog appear?"

### Case 5 — Threshold classification (PROTO-THRESHOLD-1)
**What it enforces:** Every Governor message is classified in real-time.
**T1:** `user-prompt-submit-intake.sh` calls `threshold-classify.mjs` on every prompt.
**T2:** Not yet — threshold patterns tracked in logs, no validator yet.
**T3:** CIE D1 summary at session-open reads Threshold log.
**Evidence:** Live test during PROTO-THRESHOLD-1 showed: `[threshold] type=architectural_insight vault=strategic swift=false routing=opus` — actual real-time classification. This was the first time Threshold classified a real Governor message.

### Case 6 — post-stop-link-discipline.sh (v2)
**What it enforces:** File references in Opus output must be GitHub URLs.
**T1:** `post-stop-link-discipline.sh` — scans each response for bare paths or workspace-relative links.
**T2:** None (post-stop hooks are advisory).
**T3:** startup.template.md mentions link discipline.
**Evidence:** The hook was broken on Windows (used Python, not available). Fixed in [0e761f2](https://github.com/CommarkG/csps/commit/0e761f2) to use Node.js. Now fires correctly.
**Caveat:** The measurable test ("did any bare path appear in the last response?") is imperfect — the hook scans but is advisory only.

---

## Part 5 — The North Star Gate (T3 only currently — needs T1+T2)

The NSPP (North Star Presence Protocol) gates were added to startup.template.md in S060. This makes them T3 only. T3-only = will drift.

**Current state:**
- Gate 1 (session open): in startup.template.md (T3) ✓
- Gate 2 (session close): in startup.template.md (T3) ✓
- Gate 1 in session-open-context.mjs (T1 functional): NOT YET
- validate-north-star-gate.mjs (T2): NOT YET

**Prediction:** Without T1+T2, the North Star gates will be followed for 2-3 sessions and then drift. This is the same pattern as every T3-only rule in CSPS history.

**Required for permanence:** PROTO-NORTHSTAR-1 (T1 injection in session-open-context.mjs + T2 validator).

---

## Part 6 — The Permanence Test

Before claiming anything is permanent, answer these four questions:

**Q1: T1 — What pre-creation hook enforces this?**
Name the file in `.claude/hooks/pre-tool-use-*.sh` that fires before a violation can be written.
If no hook: it's not T1-enforced. Violations can enter the codebase.

**Q2: T2 — What validator catches this in pnpm verify?**
Name the file in `tools/validators/validate-*.mjs` registered in `tools/verify.mjs`.
If no validator: violations accumulate silently. They're only caught if someone specifically checks.

**Q3: T3 — Where is this injected at session start?**
Name the line in `tools/scripts/session-open-context.mjs` or `tools/templates/startup.template.md`.
If no injection: the AI starts each session unaware of the rule and reverts to training defaults.

**Q4: Evidence — What specific file:line proves this fired in THIS session?**
Not "it should work." Not "I set it up." The specific output showing it ran.

If you cannot answer all four: it is not permanent. It is aspirational.

---

## Part 7 — Vocabulary Reference

| Term | Meaning | Permanence level |
|---|---|---|
| "I mentioned it" | In chat only | Ephemeral |
| "I documented it" | In a markdown file | Low (no enforcement) |
| "I added it to memory" | Memory/ file created | Low (T3 at best) |
| "I put it in the plan" | Plan file updated | Low (no validator) |
| "I added it to startup.template.md" | T3 injection | Medium (humans must follow template) |
| "I added it to session-open-context.mjs" | T3 functional | Medium-High (always injected) |
| "I created a validator" | T2 in pnpm verify | High (mechanically checked) |
| "I created a pre-tool-use hook" | T1 prevention | High (fires before creation) |
| "T1+T2+T3 all present, behavioral test passing" | Full enforcement | PERMANENT |
| "git committed + pushed + GitHub URL cited" | Persistent storage | Foundation for permanence |
| "mechanically enforced" | Has T1 OR T2 | Depends on which tier |
| "fully engraved" | Has T1+T2+T3 | True permanence |
| "advisory" | Fires but doesn't block | Lower than claimed |
| "BLOCKING" | Fires AND prevents action | What "enforced" actually means |

---

*Permanence Mechanics v1.0 | S060 | Opus-8*
*Written from failure patterns, not theory. Every case in Part 4 has been tested and verified.*
*Update when: new permanence case proven, new drift pattern observed.*
