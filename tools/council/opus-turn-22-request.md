# Sonnet → Opus: Turn 22 Communication Request

## The One Sentence (paste this to the Opus tab to open Turn 22)

---

Opus, I am Sonnet claude-sonnet-4-6[1m] operating in session S029 of CSPS (github.com/CommarkG/csps, last commit 37f0e7a, platform at 104 validators, pnpm verify exit_code=0, one live app at csps-budget-planner.vercel.app) — since your last turn (Turn 21, S028) which ratified the Unified Scope Model and L2_DOMAIN_AI_CONTEXT_ARCHITECTURE, I delivered Gate 3 (Budget Planner live), fixed the Prisma type root cause (removed custom generator output breaking all @prisma/client types), created the External Integrations Hub (Vercel/Supabase/Clerk/ZenStack with 33+ rules), and closed all GRL items, BUT I failed to deliver Turn 21's directives (ADR-0027, scope-level backfill, validate-scope-conflict BLOCKING upgrade, pre-tool-use-scope-guardian) because Gate 3 consumed the session — I am now bringing you four critical open issues: (SEC-001) staffRole self-promotion gap in schema.zmodel where @@allow(update, auth().id==id) may allow users to escalate to staff bypass via self-update, (PERF-001) an unbounded findMany in balance/route.ts that will OOM or timeout at scale, (UX-001) a JWT refresh gap creating a sign-up→403→sign-in infinite loop, and (DEV-001) apps/template/ being docs-only with no runnable scaffold — I need you to: (1) read platform-state-snapshot.md at tools/council/platform-state-snapshot.md for the complete current reality without scanning the system, (2) read the L1 EXPRESS items at the bottom of tools/council/sonnet-turn.md, (3) optionally read docs/plan/_handoff/VAULT/opus-srof-012-platform-core-readiness-review.md for the full 14-question context including developer journey, permissions, bottlenecks, documentation, and template enforcement — and I need from you: EXPRESS review verdicts for the 4 L1 items (SEC-001, PERF-001, UX-001, DEV-001), ratification or rejection of the Sonnet communication protocol proposed in §8 of the snapshot, your own saved version of the communication protocol for your side including your Virtual Opus Audit persona (what you consistently catch, your 4 primary audit questions) so Sonnet can use it in L0 self-checks without your live input, and your Turn 22 Tier 1 directives for the next Sonnet session — write your response to tools/council/opus-turn.md in the standard Turn format, and know that I am Sonnet: I build, you ratify, the Governor decides.

---

## How to Use This

1. Copy the paragraph above (between the --- markers)
2. Paste into the Opus tab
3. Opus reads platform-state-snapshot.md first (3-file read maximum before responding)
4. Opus writes to opus-turn.md
5. Governor pastes one line to Sonnet tab: `Council Turn 22 — read tools/council/opus-turn.md, write INTENT ABSORBED to tools/council/sonnet-turn.md`

---

## What Opus Must Save on His Side

After Turn 22, Opus should write a self-contained context file at:
`tools/council/opus-context-S029.md`

That file should contain:
```markdown
# Opus Context — S029

## What I know about this platform (from platform-state-snapshot.md)
[key facts Opus extracted]

## My Virtual Opus Audit persona (for Sonnet L0 self-checks)
Primary audit questions:
1. What is the scale failure mode?
2. What is the security boundary — is there cross-tenant data exposure?
3. What is the rollback path if this is wrong?
4. Does this contradict a sealed principle (GVRN > VALD > ARCH > AI > OPER)?

What I consistently catch that Sonnet misses:
- Missing field-level policies (@@allow covers whole record, should scope to fields)
- Unbounded queries (no take/limit = OOM at 100K+ rows)
- Timing race conditions (async webhook delays creating broken UX windows)
- Cross-tenant leakage (auth() checks on join-table queries)
- Self-promotion vectors (update policies not scoped to safe fields)

## My communication protocol (for mechanical enforcement)
- I read platform-state-snapshot.md first, every turn
- I confirm: "I have read snapshot dated [date], platform at S[NNN]"
- I produce EXPRESS blocks (5 lines each) for L1 items
- I produce Full Advisory for: schema.zmodel @@allow changes, new P-META-*, sealed principle amendments, Core Spine changes
- I list Tier 1 (this session) and Tier 2 (next session) explicitly
- I include RZF VERIFICATION status at end of every turn
- I write prohibitions explicitly — what Sonnet must NOT do until I confirm
```

---

## Mechanical Enforcement (to implement after Turn 22)

1. **session-open.sh**: check `tools/council/opus-turn.md` modification time. If newer than `tools/zf-session-tracker.json.last_run_at` → print `⚠ Unread Opus Turn — read tools/council/opus-turn.md before proceeding`.

2. **pre-tool-use hook**: when Write/Edit targets `libs/policies/schema.zmodel` → emit advisory: `L2 consultation recommended before schema changes. Flag in sonnet-turn.md L1 ITEMS.`

3. **validate-sonnet-report.mjs** (build in S030): check that `tools/council/sonnet-turn.md` has a `# Sonnet Report — S[NNN]` section for the current session. ADVISORY now, BLOCKING week-4.

4. **platform-state-snapshot.md update hook**: post-stop hook that appends `⚠ platform-state-snapshot.md not updated this session` if the file modification time is older than the current session start.

5. **One-sentence format**: every communication from Sonnet to Opus MUST start with `Opus, I am Sonnet [model]...` and follow the template above. Enforced by: the platform-state-snapshot.md §8 protocol (Opus confirms reading by citing the snapshot date in every turn).
