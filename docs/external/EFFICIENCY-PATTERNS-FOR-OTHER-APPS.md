---
id: csps.docs.external.efficiency-patterns-for-other-apps
name: EFFICIENCY-PATTERNS-FOR-OTHER-APPS
description: "Portable efficiency patterns extracted from CSPS — usable in any AI-paired or governed project. Each pattern includes problem, solution, implementation snippet, and adaptation notes for non-CSPS contexts."
type: reference
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
session: S062
authored_by: Opus-10
date: 2026-05-26
core_spine: GVRN
schema_anchor: external_references
audience: external-developer
---

# CSPS Efficiency Patterns — for Other Apps

> Portable patterns extracted from the Core Sights Platform Services governance system.
> Each pattern is presented for use in **any project**, not just CSPS-governed work.
> Adaptation notes show how to apply without the full CSPS infrastructure.

---

## How to Read This File

Every pattern has 4 parts:

1. **Problem** — what failure mode this prevents (one sentence)
2. **Pattern** — the technique (2-4 sentences)
3. **Implementation** — concrete code, config, or process snippet
4. **Adapt to your app** — how to use without CSPS-specific tooling

**Portability tags:**
- 🌐 **Universal** — applies to any project
- 🤖 **AI-paired** — for projects using AI assistants (Claude, Cursor, Copilot, etc.)
- 📁 **Monorepo** — best when you have multiple apps + shared libs
- 📋 **Governance** — for projects with formal quality or compliance discipline

---

# Section 1 — AI-Paired Development Workflow

## 1.1 Token Budget Awareness 🤖

**Problem:** AI assistants silently exhaust their context window, leaving you mid-task with no warning until they start dropping critical information.

**Pattern:** Track context consumption against the model's limit. Show escalating warnings at 70%, 80%, 90% so you (and the AI) can compact/handoff before crisis. The AI itself adapts behavior — terser outputs, summary-first responses — once aware of pressure.

**Implementation:**
```bash
# .claude/hooks/post-stop-token-tracker.sh — runs after AI stops
TRANSCRIPT_SIZE=$(stat -c%s "$CLAUDE_TRANSCRIPT_PATH" 2>/dev/null || echo 0)
ESTIMATED_TOKENS=$((TRANSCRIPT_SIZE / 4))  # ~4 chars per token rough estimate
PERCENT=$((ESTIMATED_TOKENS * 100 / 1000000))  # 1M context window
echo "{\"percent\":$PERCENT,\"updated_at\":\"$(date -Iseconds)\"}" > tools/data/token-usage-state.json

# .claude/hooks/user-prompt-submit-token-budget-warning.sh — runs before AI processes next prompt
PERCENT=$(jq -r .percent tools/data/token-usage-state.json 2>/dev/null || echo 0)
if [ "$PERCENT" -ge 90 ]; then
  echo "⚠️ CRITICAL: ~$PERCENT% context — JUMP TO NEW TAB NOW"
elif [ "$PERCENT" -ge 80 ]; then
  echo "⚠️ WARNING: ~$PERCENT% context — wrap up current task"
elif [ "$PERCENT" -ge 70 ]; then
  echo "ℹ️ CAUTION: ~$PERCENT% context — 3-4 tasks before limit"
fi
```

**Adapt to your app:** Any project using Claude Code, Cursor, or similar can drop these hooks into the project's hook directory. Estimation is rough (transcript size ≈ tokens × 4) but works as an early-warning signal. For other AI tools without hooks, ask the AI itself to track percentage estimates in a state file each turn.

---

## 1.2 Tool-Output Scaling Discipline 🤖

**Problem:** Tool outputs that scale with N (validators, files, contracts) silently consume 3-10× the expected context when N gets large. A 200-line per-file echo across 66 files burns ~13,000 lines you never asked for.

**Pattern:** Every tool that emits per-item output needs a `--brief` / `--silent` / `--summary` mode. AI workflows that don't control the tools should always pipe through `| tail -N`, prefer directory-level operations over per-file, and cap repeated tool runs per session.

**Implementation:**
```bash
# BAD: per-file output multiplies
git add file1.md file2.md file3.md ... file66.md  # CRLF warning per file

# GOOD: directory-level emits one summary
git add docs/plan/pillar-0-governance/behavioral-contracts/

# BAD: full validator JSON every run
node tools/verify.mjs

# GOOD: trimmed output, capped runs
node tools/verify.mjs 2>&1 | tail -30
# Max 2 verify runs per session — first to confirm starting state, last to confirm exit
```

**Adapt to your app:** When pairing with AI for work that touches many files (migrations, batch refactors, mass-test runs), instruct the AI explicitly: "trim every tool output to last 30 lines unless I ask for full." This single instruction saves more context than any other tweak.

---

## 1.3 Branched Step-0 Startup 🤖

**Problem:** When an AI tab opens with a long startup instruction block, the AI's training default is to absorb it as system context and **wait** for a "real prompt" — never executing the startup actions even though they're explicit. Buried instructions get skipped.

**Pattern:** Put the FIRST required action in a visually prominent box at the very top of the startup block — before role declaration, before context, before anything. Pre-write the exact text the AI should emit. Branch by scenario so the AI knows which response to send (direct-open vs relay vs continuation).

**Implementation:**
```
═══════════════════════════════════════════════════
NEW <ROLE> TAB — SESSION <ID>
This is your first prompt. Respond immediately.
═══════════════════════════════════════════════════

STEP 0 — REQUIRED IMMEDIATE RESPONSE:
Send ONE of these depending on how you got here.

(A) Direct-open (no previous tab):
┌─────────────────────────────────────────────────────────┐
│ {ROLE} here. Session {SESSION}. Direct-open tab.        │
│ Awaiting directive. No handshake needed.                │
└─────────────────────────────────────────────────────────┘

(B) Relay (pasted from previous tab):
┌─────────────────────────────────────────────────────────┐
│ {ROLE} here. Session {SESSION}. Relay tab.              │
│ Please paste this to the previous tab for HANDOFF       │
│ CONFIRMED before I proceed.                             │
└─────────────────────────────────────────────────────────┘

════════════════════════════════════════════════════
Read everything below ONLY after the box is sent:
════════════════════════════════════════════════════
[full context here]
```

**Adapt to your app:** For any AI workflow that needs the AI to ACT immediately on opening (not just absorb), front-load the required action in a visually distinct box with explicit "send this verbatim" instruction. Separator line establishes "rest is context, not action."

---

## 1.4 Right-Tool-for-Job Model Routing 🤖

**Problem:** Using the most expensive AI model for every task burns budget and time. Using the cheapest model for hard reasoning produces shallow architecture.

**Pattern:** Route by work-type, not preference. Use the strongest model (Opus-class) for: architectural decisions, deep reasoning, cross-system synthesis, ratification. Use a faster model (Sonnet-class) for: routine implementation, debugging, file wiring, batch operations. Use the smallest model (Haiku-class) for: mechanical text transformation, lookup, simple validation.

**Implementation:**
```
RULE OF THUMB:
  Architectural decision OR cross-spine synthesis OR ratification → Opus
  Routine implementation OR iterative debugging OR file wiring → Sonnet
  Single-pass mechanical text work OR lookup → Haiku

NEVER downgrade hard-reasoning work to a faster model just to save tokens.
NEVER upgrade routine implementation to the top model just because it's available.
```

**Adapt to your app:** Even with a single AI tool, name what KIND of work you're asking for before asking. "This is architectural — think deeply" vs "this is mechanical — just batch the change." The AI adjusts depth accordingly even without explicit model switching.

---

## 1.5 Core Seeds Technique 🤖

**Problem:** When AI #1 designs and AI #2 implements (or designer-to-builder handoff), the implementation often drifts from the intent because the design wasn't anchored in something durable.

**Pattern:** The designer writes a **core seed** — the minimum architectural anchor that locks the intent. Not the full implementation. The exact function signature, schema shape, sample text, pattern example — whatever the implementer cannot get wrong without corrupting the design. The seed is committed to the repo BEFORE the implementer begins. The seed survives compaction, tab transfer, and memory loss.

**Implementation:**
```markdown
# PROTO-XXX-N

## STEP N: <name>

**Files to modify:** <explicit list>

**Core seed (the exact text the implementer must produce):**

```yaml
new_schema:
  field_a: <type>
  field_b: <type>
  status: active | stub | none
```

**DONE WHEN:** <list of verifiable conditions>
**Commit message:** <exact string>
```

**Adapt to your app:** For any designer-to-builder handoff (architect to junior dev, lead to contractor, AI #1 to AI #2), write the core seed in a file before the work starts. The file is the contract. The implementer is free to figure out HOW; the seed locks WHAT.

---

## 1.6 Validate Before Assume 🤖 🌐

**Problem:** AI claims state ("the validator passes," "the file exists") based on memory of an earlier check, not current evidence. Memory drifts, files change, tools update.

**Pattern:** Every claim about current state must cite a tool call made in the CURRENT response. Memory of an earlier tool call ≠ validation. Re-run IS the proof. The discipline applies to humans too — recheck before relying on yesterday's grep.

**Implementation:**
```
BANNED PHRASES:
  "the validator should pass" (without running it THIS turn)
  "the file exists" (without ls/stat THIS turn)
  "exit_code is 0" (without verify run THIS turn)

REPLACE WITH:
  "validator output THIS turn: blocking=0"
  "ls confirmed file present at <path>"
  "verify outer exit_code=0 confirmed (re-run this response)"
```

**Adapt to your app:** Add a "validate before assume" rule to your team's PR checklist. Reviewers must re-run tests on the PR branch, not trust the author's "tests passed on my machine."

---

# Section 2 — Governance & Quality

## 2.1 ZF (Zero Findings) Cycles 📋 🌐

**Problem:** "I'm done" is declared while obvious issues remain unchecked. Quality work terminates by clock, not by completeness.

**Pattern:** Iterate inspection cycles until a full cycle produces ZERO new findings. Each cycle re-examines the work from a different angle. Cycle 2 must name SPECIFIC areas (file:line, function names, scenarios) that were re-checked — not vague "I checked everything."

**Implementation:**
```
ZF Cycle 1: [list findings — bugs, gaps, missing edge cases]
ZF Cycle 2: re-examined [SPECIFIC-FILE.md:line] and [SPECIFIC-FUNCTION] —
            0 new findings beyond Cycle 1.
Status: ZF ACHIEVED.

If Cycle 2 finds something new: log it, do Cycle 3.
Termination condition is FINDINGS=0, not cycle count.
```

**Adapt to your app:** For PRs, code review, design review — formalize a "find nothing new" termination condition. Reviewer must name what they re-examined; "LGTM" without specifics doesn't end the review.

---

## 2.2 T1+T2+T3 Layered Enforcement 📋

**Problem:** Rules written in docs ("we always do X") get ignored because there's no mechanical enforcement. Adding ONE enforcement layer (just a validator, just a hook) creates a single point of failure.

**Pattern:** Every rule worth enforcing gets THREE layers:
- **T1 (Hook):** fires before the action happens — prevents the bad outcome
- **T2 (Validator):** scans after the action — catches what slipped past T1
- **T3 (Schema/Memory):** structural definition — makes the rule discoverable

Below 2 layers = the rule WILL drift. All 3 = structural durability.

**Implementation:**
```yaml
# In a rule's frontmatter or contract file:
enforcement_trio:
  t1:
    tier: hook
    path: .git/hooks/pre-commit OR .claude/hooks/pre-tool-use-X.sh
    status: active | stub | none
  t2:
    tier: validator
    path: tools/validate-X.sh OR scripts/check-X.js
    status: active
  t3:
    tier: schema | memory | documentation
    path: docs/rules/X.md
    status: active
  exempt_reason: null  # required if any status=none
```

**Adapt to your app:** For any quality discipline (linting, testing, naming), check that all 3 surfaces exist. Missing T1? Add a pre-commit hook. Missing T2? Add a CI check. Missing T3? Document the rule and link both T1 and T2.

---

## 2.3 K-Count Gap Recurrence Register 📋 🌐

**Problem:** The same governance gap re-surfaces every few sessions. Each time it's described, never structurally fixed. Energy compounds at the description layer instead of the structural layer.

**Pattern:** Track every observed gap in a register with a K-count (re-discovery counter). When K=2 (same gap seen twice), mandatory structural fix — not another description. When K=3, block session close until structural fix exists.

**Implementation:**
```yaml
# tools/data/gap-recurrence-register.yaml
- id: gap_TOOL_OUTPUT_SCALES_WITH_N
  k_count: 2
  first_observed: 2026-05-25 (session S062-C2)
  second_observed: 2026-05-26 (session S062-C3)
  description: "Tool outputs grow linearly with file count, burning context"
  status: open  # open | structural_fix_committed | resolved
  structural_fix: <commit SHA when applied>
```

**Adapt to your app:** For any recurring bug, support ticket pattern, or process failure — track recurrence count. K=2 is the "fix the system, not the instance" trigger.

---

## 2.4 Honest Framing Discipline 📋 🌐

**Problem:** Measurements that look good are kept. Measurements that look bad are hidden, deferred, or reframed. The result: metrics that tell you what you want to hear instead of what is true.

**Pattern:** When a measurement EXPOSES a previously-hidden issue (e.g., your test coverage was inflated by a counting bug), the honest move is to surface the correction PROMINENTLY and document the prior over-count as a finding. Don't quietly fix the bug and let the lower number look like a regression.

**Implementation:**
```markdown
## Permanence Coverage — Honest Framing

**Old measurement:** 100% (body-scan, lenient — counted cross-references as enforcement)
**Corrected measurement:** 48% (frontmatter-canonical, strict — true coverage)
**The 52pp delta is NOT a regression.** It is the platform's first measurement-honesty
correction. The 100% was inflated by counting "this rule is mentioned" as "this rule is enforced."

The honest score is now the baseline for ratchet (cannot drop below 48%).
```

**Adapt to your app:** When you find a measurement bug, document the bug AND the corrected number with equal prominence. Hiding the correction trains the team to distrust metrics entirely.

---

## 2.5 Failure-Visible > Failure-Silent 📋 🌐

**Problem:** Errors get absorbed by error-handling layers, default fallbacks, or "graceful degradation" — and nobody notices the system is operating in a degraded mode until something downstream catastrophically breaks.

**Pattern:** Design errors to surface IMMEDIATELY at the source, not be absorbed silently. Prefer a loud crash that exposes the problem over a quiet fallback that hides it. Fallbacks are valid when explicit; silent absorption is not.

**Implementation:**
```javascript
// BAD: silent absorption
function getConfig(key) {
  try {
    return JSON.parse(fs.readFileSync('config.json'))[key];
  } catch (e) {
    return null;  // caller never knows config is broken
  }
}

// GOOD: failure-visible
function getConfig(key) {
  const raw = fs.readFileSync('config.json', 'utf8');  // throws ENOENT visibly
  const parsed = JSON.parse(raw);  // throws SyntaxError visibly
  if (!(key in parsed)) {
    throw new Error(`Config missing key: ${key}`);  // explicit, named failure
  }
  return parsed[key];
}
```

**Adapt to your app:** Audit your error handling. Every `catch { return null }` or `try { ... } catch {}` is a silent-failure candidate. Either propagate the error OR explicitly name why suppression is the right call.

---

## 2.6 Plan-Before-Build (No Implementation Without Ratified Plan Item) 📋

**Problem:** Implementation happens because someone said "let's build X" without an explicit decision point. Later, nobody can answer "why did we build X?" or "what was X supposed to do?"

**Pattern:** Every implementation traces back to a plan item with an ID. No plan item = exploration only (no code commits). The plan item records: what, why, who decided, when. Without the audit trail, the work is invisible to future sessions.

**Implementation:**
```yaml
# tools/config/unified-plan.yaml (or similar)
- id: PLAN-2026-04-A
  name: Add voice profile validation
  why: "S058 wet trial surfaced inconsistent voice across pages"
  decided_by: Yariv (Governor)
  decided_at: 2026-04-15
  status: queued | in-progress | done | deferred
  blocking_validator: validate-voice-profile.mjs
```

**Adapt to your app:** GitHub Issues with a "ratified" label achieve the same thing. Code review rule: a PR without an issue reference cannot merge.

---

## 2.7 PCR for Decisions (Pros/Cons/Recommendation) 📋 🌐

**Problem:** Decisions get made in chat with one-sentence justifications. Six months later nobody remembers WHY option A was picked. The reasoning evaporates.

**Pattern:** Every non-trivial decision (anything not reversible in 5 minutes) produces a 3-block artifact: **Pros** of each option, **Cons** of each option, **Recommendation** with the load-bearing reason. Trivial-reversibles skip this with an explicit note ("trivial — chose X without PCR because Y").

**Implementation:**
```markdown
## Decision: Migrate enforcement_trio to frontmatter (Q4)

### Pros
- Frontmatter is machine-readable canonical (validators parse YAML, not prose)
- 66-contract migration is mechanical (regex-driven)
- Eliminates "is T1 mentioned but not actually wired" ambiguity

### Cons
- ~2 hours of migrator work
- Body prose still exists; documentation has two sources of truth during transition

### Recommendation
Migrate. Body prose stays as descriptive narrative; frontmatter is the canonical fact.
**Load-bearing reason:** without canonical frontmatter, every validator re-parses prose
differently. Single source of truth wins.
**What would flip:** if migration surfaces >40 contracts with ambiguous mappings,
reconsider — the prose may be richer than schema allows.
```

**Adapt to your app:** For any team decision, require the 3-block format in writing before action. The "what would flip" clause is the secret weapon — it forces the decider to name conditions under which they'd reverse course.

---

## 2.8 No Invention Without Precedent Check 📋 🌐

**Problem:** Engineers reach for novel solutions (new format, new naming convention, new architecture) when prior work already solved it. The new thing creates a parallel structure that drifts from the original.

**Pattern:** Before introducing any new format, name, or structure, search three places **in order**: (a) current codebase, (b) prior work or platforms the team has used, (c) industry conventions/standards. Only when none has the answer is invention justified.

**Implementation:**
```
PRE-INVENTION CHECKLIST:
  [ ] Searched current codebase for existing patterns matching this need
  [ ] Asked teammates / checked past project docs for prior solutions
  [ ] Verified the industry-standard approach (Google search, RFC, OSS examples)
  [ ] None of the above produced a fit
  → Only NOW is invention justified
  → Document WHY existing solutions didn't fit
```

**Adapt to your app:** This is universal design hygiene. Add it to your tech-design template as a section: "Why isn't [existing-thing] sufficient?"

---

# Section 3 — Architecture Patterns

## 3.1 Component A/B Discipline (Apps Ephemeral, Libs Permanent) 📁

**Problem:** Bugs found in production apps get fixed in-place. The same bug appears in the next app, gets fixed again. The platform never compounds.

**Pattern:** Every fix has TWO components:
- **Component A** — the app-specific patch (ephemeral; the app will be deleted someday)
- **Component B** — the platform extraction (permanent; lives in `libs/` or template/)

Component A alone is firefighting. A + B is platform building. Deletion test: `rm -rf apps/{app}/` must lose ZERO platform value because everything has been extracted to B.

**Implementation:**
```
Repo structure:
  apps/<app>/        ← ephemeral specimens (deletion-safe)
  libs/<feature>/    ← permanent extractions
  libs/template/     ← the template all new apps fork from

When you fix a bug in apps/<app>/:
  1. Patch the app (Component A)
  2. Identify: is this bug specific to this app, or could it appear in others?
  3. If others: extract to libs/<feature>/ OR libs/template/ (Component B)
  4. Future apps inherit the fix automatically
```

**Adapt to your app:** Even in a single-app project, separate "feature-specific" from "platform" code in your directory structure. Every bug-fix asks: "would another feature hit this?"

---

## 3.2 Wet Trial as Validation Method 📁

**Problem:** Platform features get built without ever being USED by a real product. They look correct in tests but fail in real conditions.

**Pattern:** Before declaring a platform feature complete, fork the template into a real app and BUILD something real with it. Every friction surfaced during the build becomes a permanent fix. The first app's bugs are the most valuable bugs the platform will ever find.

**Implementation:**
```
WET TRIAL PROCESS:
  1. Pick a real problem (e.g., "track money owed by clients")
  2. Fork apps/template/ into apps/<real-app>/
  3. Build Phase 1: ONE complete end-to-end flow
  4. Log every friction in a wet-trial-log
  5. Each friction → classify: app-only OR extract to libs/
  6. After Phase 1 works: ratify the platform via the friction-fix list
  7. The platform is "proven" when the wet-trial app's friction list IS the platform improvements list
```

**Adapt to your app:** For libraries, frameworks, internal platforms — "dogfood" early. Build something real with your platform before you ship it to others. The friction you find IS the value.

---

## 3.3 Schema-First Frontmatter 📋 🌐

**Problem:** Knowledge artifacts (docs, runbooks, plans) lack machine-readable metadata. You can't query "show me all active plans for the auth domain" because the docs only have prose.

**Pattern:** Every persistent artifact starts with YAML frontmatter declaring its identity, lifecycle, ownership, and spine. The frontmatter is the machine-readable single source of truth. Body prose is human narrative.

**Implementation:**
```yaml
---
id: org.docs.runbook.auth-failure
name: auth-failure-runbook
description: "Steps to diagnose and recover from authentication outages"
version: "1.2"
owner: team:platform-security
lifecycle: production
lifecycle_state: active
domain: authentication
severity_level: P1
audience: oncall
last_validated: 2026-04-12
links:
  - { rel: alert, href: https://grafana.internal/auth-latency }
  - { rel: parent, href: ./README.md }
---

# Auth Failure Runbook

[human-readable narrative follows]
```

**Adapt to your app:** For any directory of markdown files (docs, ADRs, runbooks), enforce a minimal frontmatter via a simple validator. Required fields: id, name, version, lifecycle, owner. Everything else is optional.

---

## 3.4 Single Source of Truth (File Wins Over Memory) 📋 🌐

**Problem:** Architectural decisions live in chat history, email threads, or someone's head. When that someone leaves (or the chat is compacted), the decision is lost.

**Pattern:** Every consequential decision lives in a committed file BEFORE implementation begins. The file is the contract; chat is the discussion. If a decision isn't in a file, it isn't a decision yet — it's a conversation.

**Implementation:**
```
RULE: implementation can begin only when the design lives in a committed file.

WRONG:
  Slack: "let's use Postgres not MySQL"
  → engineer starts building with Postgres
  → 3 months later nobody remembers why; some files still use MySQL

RIGHT:
  Slack: "let's use Postgres not MySQL"
  → write docs/adr/0042-postgres-over-mysql.md
  → commit it
  → engineer starts building with Postgres, referencing ADR-0042
  → future engineer finds the decision + the reasoning
```

**Adapt to your app:** Adopt ADRs (Architecture Decision Records) — single-file documents per decision with context, options, consequences. Even one ADR is better than zero.

---

## 3.5 Tab Transfer Stability Hierarchy (T1-T6) 🤖

**Problem:** When AI tabs transfer context (one conversation ending, another starting), the receiving AI gets only what fits in the handoff message. Critical state is lost. Re-discovery wastes hours.

**Pattern:** Classify every cross-boundary mechanism by stability tier:
- **T1** — fires BEFORE AI reasoning, cannot be skipped (structural)
- **T2** — loads unconditionally at session start (structural)
- **T3** — skill/tool with fixed schema (high-behavioral)
- **T4** — text in startup block requiring AI to read (medium-behavioral)
- **T5** — native AI following protocol (low-behavioral; training defaults can override)
- **T6** — AI "remembering" across turns (none; compaction = zero)

The ceiling for tab transfer is T3 because the human paste IS the boundary-crossing mechanism. Design for **failure-visible**, not failure-silent.

**Implementation:**
```
Audit your AI workflow's handoff mechanisms. For each, identify the tier:
  - Settings.json hooks?              → T1/T2 (structural)
  - "Always include" files?           → T2
  - Skill with structured output?     → T3
  - Startup-block instructions?       → T4 (AI must READ, can skip)
  - "Remember our convention"?        → T5/T6 (will fail)

Move T5/T6 patterns down to T3/T4 where possible.
Where T5 is the only option, design to fail-VISIBLY (loud error if skipped).
```

**Adapt to your app:** For any system with cross-boundary state (microservices, chat handoffs, async pipelines), name the tier of each transfer. Most "weird bugs" turn out to be a T5/T6 mechanism that drifted.

---

# Section 4 — Measurement & Honesty

## 4.1 Pre-Close Verification Gate 📋 🌐

**Problem:** "Done" is declared before the verification gate runs. Two commits later someone discovers tests were broken the whole time.

**Pattern:** Every claim of DONE / COMPLETE / RATIFIED / VALIDATED requires THIS-SESSION verify evidence. Memory of an earlier `pnpm test` passing ≠ proof. Re-run IS the proof. The verification must produce output cited in the closing-summary.

**Implementation:**
```
SESSION CLOSE CHECKLIST:
  [ ] Run `pnpm verify` (or equivalent) — capture exit_code in THIS session
  [ ] Paste structured output into closing-summary §10.0
  [ ] If exit_code != 0: do NOT declare done; surface the failure
  [ ] Only after structured output is captured can subsequent §s be written
```

**Adapt to your app:** Every PR's "ready for review" toggle should require fresh CI run results. PR description must include the latest run link, not just "CI was green earlier."

---

## 4.2 Re-Run IS the Proof 📋 🌐

**Problem:** "I ran the tests already" is the most common form of unverified claim. The interval between the run and the claim is when state diverges.

**Pattern:** When making a state claim, the tool call must be in the SAME response as the claim. Not a prior turn. Not a memory. Not "earlier in the session." The same response. This applies to validators, file existence, service health, anything that could have changed.

**Implementation:**
```markdown
WRONG:
  "Verify passed earlier this session — moving on to next step."

RIGHT:
  "Verify re-run THIS turn: exit_code=0 (output above)."
  (with actual tool output visible in the same response)
```

**Adapt to your app:** For incident response, deploy procedures, security checks — bake re-run-is-proof into the runbook. Step 7 of the runbook isn't "test passed" but "test passed in the current incident timestamp."

---

## 4.3 Behavioral Test Before Ratification 📋

**Problem:** Rules ("we always X") get ratified without testing whether the enforcement actually catches the bad behavior. Months later you discover the rule was unenforced — the validator had a bug, the hook never fired.

**Pattern:** Every behavioral rule has a test case showing it CATCHES a known violation BEFORE the rule is declared active. "A solution that hasn't been tested against a known violation is a description, not a solution."

**Implementation:**
```bash
# tools/tests/behavioral/no-secrets-in-commits-test.sh
# INPUT A (should trigger): commit with API_KEY=sk_live_...
echo "API_KEY=sk_live_abc123" > test-fixture.txt
pre-commit-hook test-fixture.txt && echo "FAIL: hook should have blocked" || echo "PASS: hook blocked"

# INPUT B (should pass): commit without secrets
echo "API_KEY=$ENV_VAR" > test-fixture.txt
pre-commit-hook test-fixture.txt && echo "PASS: hook allowed" || echo "FAIL: false positive"
```

**Adapt to your app:** For every guardrail (lint rule, security check, validation), write the violation-case test alongside the rule. If the test can't trigger the rule, the rule doesn't work.

---

## 4.4 Ratchet Baselines (Lock Improvements) 📋 🌐

**Problem:** Quality improves over a sprint and then quietly regresses over the next two sprints. Without a lock, the gain is reversible.

**Pattern:** When a quality metric improves, lock the new value as a BASELINE. Future runs must equal or exceed the baseline. Regressions become BLOCKING (CI fails), not just advisories. Baselines update only on improvement (the "ratchet" — never goes down).

**Implementation:**
```javascript
// tools/validate-coverage-ratchet.js
const baseline = JSON.parse(fs.readFileSync('coverage-baseline.json'));
const current = runTests().coverage;

if (current < baseline.coverage) {
  console.error(`BLOCKING: coverage regressed from ${baseline.coverage}% to ${current}%`);
  process.exit(1);
}

if (current > baseline.coverage) {
  baseline.coverage = current;
  baseline.updated_at = new Date().toISOString();
  fs.writeFileSync('coverage-baseline.json', JSON.stringify(baseline, null, 2));
  console.log(`Baseline ratcheted to ${current}%`);
}
```

**Adapt to your app:** Test coverage, build time, bundle size, accessibility score — pick the metrics that matter and ratchet them. Quarterly ratchet reviews catch the metrics that drift in the wrong direction.

---

# Section 5 — Process & Communication

## 5.1 5-Guard-Questions (Reasoning Over Rigid Rules) 🤖 🌐

**Problem:** Rule lists grow without bound. By rule #47 nobody remembers them all; enforcement degrades to pattern-matching.

**Pattern:** Replace 90% of rigid rules with 5 reasoning checkpoints answered internally before every consequential response. The questions force the same outcomes as the rules but require thinking, not memorizing.

**Implementation:**
```
BEFORE EVERY CONSEQUENTIAL RESPONSE, ANSWER INTERNALLY:

G1 EVIDENCE:    What specific [file:line] or tool output in THIS response
                proves my most important claim? Cannot name one = described, not demonstrated.

G2 IDENTITY:    Am I labeling content as from a role I do not hold?

G3 SCOPE:       Does what I am about to build have a plan item ID? No plan item = exploration only.

G4 INHERITANCE: Before creating anything new — which existing pattern does this
                inherit from? No pattern = orphan node. Find the parent first.

G5 PERMANENCE:  If this session ended now, would my key decisions be in a permanent file?
                Chat-only = ephemeral. Before closing: write the durable record.
```

**Adapt to your app:** Customize the 5 questions for your team's domain. Display them on every PR template, every incident channel description, every team meeting agenda. Reasoning at the boundary > rules in a doc.

---

## 5.2 Optimal Next Step Discipline 🌐

**Problem:** Long responses end with implicit "what now?" The reader knows roughly what to do but loses 30 seconds figuring out the next specific action.

**Pattern:** End every substantive response with an explicit ▶ OPTIMAL NEXT STEP: specific action + what it unlocks + why now. Reader copy-pastes the action and proceeds.

**Implementation:**
```markdown
[main response body]

▶ OPTIMAL NEXT STEP
Action: <specific, copy-pasteable command or step>
Context: <what this unlocks>
Reasoning: <why this and not the obvious alternative>
```

**Adapt to your app:** Adopt this for: code review comments, incident updates, sales emails, support tickets. The pattern works anywhere a response would otherwise end with "let me know what you think."

---

## 5.3 Mutual Understanding Validation (Boundary Alignment) 🌐

**Problem:** Cross-boundary communication (team-to-team, person-to-person, AI-to-AI) drifts because each side assumes the other understands. Drift compounds.

**Pattern:** Every consequential boundary closes the loop EXPLICITLY:
- Sender emits an UNDERSTANDING BLOCK ("here is what I understand the situation to be")
- Receiver responds with an ALIGNMENT CONFIRMATION ("yes, that matches" OR "no, X is different")
- Iterate until alignment is explicit

**Implementation:**
```markdown
SENDER → RECEIVER:
  "Before I act, my understanding:
   - Goal: <restate>
   - Constraints: <list>
   - Success criterion: <one sentence>
   Confirm or correct."

RECEIVER → SENDER:
  "Aligned EXCEPT: <list deltas>"
  OR
  "Aligned — proceed."
```

**Adapt to your app:** For high-stakes work (incident response, contract negotiation, AI handoffs), make alignment confirmation explicit. The 30 seconds spent confirming saves hours of mis-execution.

---

## 5.4 Zero-Context Assumption (ZCA) 🌐

**Problem:** Every handoff assumes the receiver shares context. Sometimes they don't — new hire, new tab, new team. The receiver starts confused, asks redundant questions, slows the whole pipeline.

**Pattern:** Every cross-boundary communication starts with WHO/WHAT/HOW/NOW before the task content:
- **WHO** the receiver is supposed to be (role)
- **WHAT** the work is
- **HOW** it relates to prior work
- **NOW** what the receiver should do first

Treats the receiver as if they started from zero. If they had more context, they ignore the preamble (cheap). If they didn't, they're not stuck (expensive savings).

**Implementation:**
```markdown
[ANY CROSS-BOUNDARY MESSAGE]

WHO: You are the on-call SRE.
WHAT: Investigating a P1 incident — auth service 503s.
HOW: Continues the runbook in docs/auth-failure-runbook.md.
NOW: Run `kubectl get pods -n auth-prod` and report status.

[then the actual content]
```

**Adapt to your app:** Use ZCA for: oncall handoffs, support ticket transfers, AI tab handoffs, new-hire onboarding documents. Every "what's the context?" question in chat is a ZCA failure.

---

# Section 6 — Putting It Together: The Quality Loop

These patterns interact. Adopting one without the others produces partial benefit. Adopt them as a stack:

```
WRITE:   Schema-first frontmatter (3.3) + Single source of truth (3.4)
         → every decision lives in a file with machine-readable metadata

DECIDE:  PCR for decisions (2.7) + No invention without precedent check (2.8)
         → every decision is justified and reuses existing patterns

BUILD:   Plan-before-build (2.6) + Component A/B discipline (3.1)
         → every implementation traces to a plan and contributes to platform

VERIFY:  ZF cycles (2.1) + Validate before assume (1.6) + Re-run IS proof (4.2)
         → completeness is iteration-driven, not clock-driven

ENFORCE: T1+T2+T3 layers (2.2) + Behavioral test before ratification (4.3)
         → every rule has 3 surfaces and a violation test

LOCK:    Ratchet baselines (4.4) + K-count gap register (2.3)
         → improvements stick, recurrences trigger structural fix

COMMUNICATE: ZCA (5.4) + Mutual understanding validation (5.3) + Optimal next step (5.2)
         → boundaries don't drift; receivers act not ask

AI-PAIR: Token budget awareness (1.1) + Tool-output discipline (1.2) +
         Branched Step-0 (1.3) + Right-tool routing (1.4) + Core seeds (1.5)
         → AI context is treated as a scarce, manageable resource

HONESTY: Honest framing (2.4) + Failure-visible (2.5) + 5-Guard-Questions (5.1)
         → measurements tell the truth, errors surface immediately,
           reasoning replaces rule memorization
```

---

# Adaptation Notes for Non-CSPS Contexts

CSPS uses a specific tooling stack (`pnpm verify`, hook directory, validator scripts in `tools/`). The PATTERNS are portable; the SPECIFIC FILE PATHS are not. When adopting in your project:

- **Replace `pnpm verify`** with your project's test command (`npm test`, `cargo test`, `pytest`, etc.)
- **Replace `.claude/hooks/`** with your AI tool's hook directory (or use git hooks if no AI tool)
- **Replace `tools/validators/`** with your script directory (`scripts/`, `bin/`, `make/`)
- **Replace `B_*` contracts** with whatever rule-document format your team uses
- **Replace `Sonnet/Opus/Governor`** with your role names (junior dev / senior architect / product owner)

The patterns describe SHAPES of solutions, not specific implementations. The shape is what's transferable.

---

# Why This File Exists

This file was extracted at the request of the platform Governor for use in OTHER apps and projects. CSPS's value is not the apps it builds (those are ephemeral specimens per pattern 3.1) — it's the patterns its build process surfaced. Every pattern here originated as a friction point in some real session, was structurally fixed, and now compounds.

Adopting even 3-4 of these patterns in another project yields disproportionate gains because they reinforce each other. The full stack is the goal.

---

*Authored: 2026-05-26 by Opus-10 | Session S062 | Knowledge synthesis from CSPS S001-S062*
*Companion files: docs/SIA/UX-PREVENTION-ARCHITECTURE.md, docs/plan/pillar-0-governance/moat-registry.md*
