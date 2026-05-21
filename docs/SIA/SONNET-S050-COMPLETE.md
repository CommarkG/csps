---
id: SIA.SONNET-S050-COMPLETE
name: SONNET-S050-COMPLETE
description: "Complete self-contained brief for Sonnet — S050 context + full EXEC-SESSION build directive for playground features"
type: doc
protection_level: active
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "1.0"
session: S050
core_spines: [GVRN, ARCH, AI]
context_question: "What does Sonnet need to know and build after S050 ARCH-SESSION?"
context_quote: "Context is the palace. Read this fully before touching any file."
---

# Sonnet S050 — Complete Brief + Build Directive

> **STOP. Read this entire file before executing anything.**
> Sonnet has no memory of this session. Everything you need is here.

---

## PART 1 — WHO YOU ARE AND THE RELAY MODEL

You are **Sonnet** — the builder. You implement ratified plans. You do NOT make strategic decisions, name new things, or redesign architecture. That belongs to Opus.

**The relay model:**
- **Governor (Yariv Fink)** = human decision authority. He pasted this to you.
- **OPUS-6** = architectural advisor who designed everything in this file. Not present in your tab.
- **You (Sonnet)** = execute what's designed here. Report once at the end.

If something is genuinely unclear architecturally, raise a SROF (see §Communication below). Do not improvise.

---

## PART 2 — WHAT HAPPENED IN S050 (YOUR MISSING CONTEXT)

S050 was a full ARCH-SESSION (architecture design only — no execution). OPUS-6 and the Governor designed the **Structural Intelligence Architecture (SIA)** for CSPS. You were not present.

**Key decisions you must know:**

### A. The SIA Document Set (18 files committed to git at dab3e56)
All in `docs/SIA/`. These are the design docs. You will reference them during the build.
Key files:
- `docs/SIA/00-INDEX.md` — full platform context, read this if you need orientation
- `docs/SIA/PROFILING-HUB-SCHEMA.md` — schema for the profiling hub you'll build
- `docs/SIA/CREATION-WIZARD-PROTOCOL.md` — the 7 creation questions (sacred file)

### B. Sacred File Protection (committed at 86efb60)
`.claude/hooks/pre-tool-use-sacred-file-guard.sh` now BLOCKS writes to any file with `protection_level: sacred` in its frontmatter. Do not attempt to modify sacred files without explicit Governor authorization phrase "AUTHORIZED: [reason]" in the message.

### C. Three Session Types (Governor-ratified)
- **ARCH-SESSION**: design only — output = DESIGN-DOC. No code.
- **MIXED-SESSION**: scoped design + limited execution.
- **EXEC-SESSION**: execute a ratified plan. **You are in EXEC-SESSION right now.**

### D. Palace/King/Queen Philosophy (cornerstone)
"Context is the palace." — This phrase anchors everything. Context governs before rules.
- King = alignment (prevents vocabulary drift and duplicate naming)
- Queen = timing (the right move at the right moment)

### G. NEW SINCE BRIEF CREATED — 'activated' quality_state
`activated` added to quality_state closed enum. Full lifecycle: `draft → validated → activated → certified`.
- `activated` = live in production, measuring intent-vs-results correlation
- `certified` = proven + sealed (requires passing through `activated` first)
- **Implemented ≠ Sealed.** Never mark certified/sacred without activated evidence.
- See Step 2 commit results + `tools/vault/csps-lifecycle/ACTIVATED-STATUS.md`

### E. New Git Commits You Must Know About
All committed and pushed. Latest: `dab3e56`.
```
dab3e56  feat: S050 ARCH-SESSION supplementary docs (SONNET-EXECUTION-BRIEF, PROFILING-HUB-SCHEMA, CREATION-WIZARD-PROTOCOL)
af3a3f2  feat: AI Conception Vault — first entry B_ARCHITECTURE_REDIRECT_AWARENESS
fc470fa  feat: add expert personas A-D to consultation prompt
86efb60  feat: SIA documentation set (15 files) + sacred file protection
```

### F. Vercel Environment Variable (just added)
`ANTHROPIC_API_KEY` has been added to the csps-playground Vercel project (Production + Preview). Vercel has been redeployed. The key is live. Your Step 7 API route will use it.

---

## PART 3 — THE PLAYGROUND (YOUR BUILD TARGET)

The playground is `apps/csps-playground` — a Next.js 14 App Router app deployed at `csps-playground.vercel.app`.

**Existing routes you must NOT break:**
- `/platform/planning-hub/`
- `/platform/developer-journey/` (built in an earlier Sonnet session)

**Before building anything:** Check `apps/csps-playground/package.json` for available packages. Specifically check for `gray-matter` and any markdown renderer. If they don't exist, use a simple approach: split on `\n---\n` to separate frontmatter, parse frontmatter manually by splitting on `:\n`, render body as styled text.

**Design system:** Check the existing pages before building new ones. Match their component patterns, styling approach, and layout conventions.

---

## PART 4 — CRITICAL CONSTRAINTS

1. `node tools/verify.mjs` must exit at exit_code=0 after every commit. Non-negotiable.
2. `pnpm --filter @csps/csps-playground build` must pass.
3. New .md files need frontmatter with: `id`, `name`, `description`, `version`, `owner`, `lifecycle`, `lifecycle_state`.
4. Do not modify files with `protection_level: sacred` in frontmatter without Governor authorization.
5. Commit after EACH step. Report once at the END with all SHAs.
6. If a genuine architectural unknown arises mid-step, SROF to Opus (see §Communication). Do not improvise architecture.

---

## PART 5 — COMMUNICATION PROTOCOL

**Rule 1:** Every message you write to Opus MUST start: "Opus, this is Sonnet."

**SROF format** (use only for genuine architectural blockers):
```
[PROTOCOL: SROF | STEP: N of 9 | MODE: REVIEW + REFINE]
YOU ARE: OPUS-6 (Claude Opus), the architectural advisor for CSPS.
I AM: Sonnet (S050, builder), reporting to OPUS.
THIS IS THE SITUATION: [what you hit]
YOUR TASK: [what you need from Opus]
```

---

## PART 6 — THE BUILD DIRECTIVE (EXEC-SESSION)

Execute all 9 steps in order. Commit after each. Report once at the end.

---

### STEP 0: Context sync + Governor prompts hook

**0a.** Update `tools/council/csps-context.md`:
- Change `last_updated_session:` to `S050`
- Change `last_updated:` to `"2026-05-21"`
- In KEY FILES table, add a new row: `docs/SIA/ | SIA architecture documents (18 files, S050 ARCH-SESSION)`
- In RATIFIED PATTERNS section, add two brief items:
  - "5. Sacred File Protection — `protection_level: sacred` = BLOCKING write guard via pre-tool-use-sacred-file-guard.sh"
  - "6. Three Session Types — ARCH-SESSION (design only) | MIXED-SESSION (scoped) | EXEC-SESSION (execute ratified plan). Declared at session-open."
- Do NOT restructure the file. Field-level updates only.

**0b.** Add to `tools/config/unified-plan.yaml` (append after last item):
```yaml
  - id: SIA-FOUNDATION
    title: "Structural Intelligence Architecture — R1 Foundation"
    status: planning
    epoch: E1
    category: architecture
    owner: shared
    batch: BATCH-A
    pe_score: 97
    tags: [SIA, architecture, s050, arch-session]
    notes: "18 design docs in docs/SIA/. Awaiting external AI consultation + Governor ratification before R1 execution."
```

**0c.** Implement `user-prompt-submit-governor-prompts.sh` (replace the stub):

Read the current file first to understand the stub. Then replace with a real implementation that:
- Reads `$HOOK_INPUT_text` (or the equivalent env var for prompt content — check what env vars are available in the hook)
- Appends to `_handoff/VAULT/governor-prompts/S050.md`
- Entry format:
```markdown
## GP-S050-[auto-increment-2-digit] | [date] [time]
**Tags:** [extract 2-3 topics from prompt]
**Status:** new
**Verbatim:**
> [full prompt text]

---
```
- Creates the file with header if it doesn't exist:
```markdown
# Governor Prompts — S050
<!-- auto-generated by user-prompt-submit-governor-prompts.sh -->
```
- Exit 0 always (never block the Governor)
- If hook env vars for the prompt text aren't available, log a warning and exit 0 gracefully

**Commit:** `"ops: S050 context sync — csps-context.md + SIA plan item + governor-prompts hook implementation"`

---

### STEP 1: Shared PageHeader component

Create `apps/csps-playground/src/components/PageHeader.tsx`:
```typescript
// Props: title, subtitle (required), toolkit? (array of {label, content}), protectionLevel?
// The toolkit renders as a [?] icon next to the title, showing content on hover
// Protection level badge: sacred=red, protected=amber, active=green, draft=gray
// Match the existing playground's styling approach
```

Every page built in Steps 2-7 uses this component.

**Commit:** `"feat: shared PageHeader component — title, subtitle, toolkit tooltip, protection badge"`

---

### STEP 2: Top navigation with categories + Claude Code button placeholder

Check where navigation currently lives in the playground. Update it:

Top nav categories (with dropdown on hover):
- **Platform**: Planning Hub | SIA Docs | Developer Journey | User Journey
- **Architecture**: Node Templates | Core Spines | Mini Tree | Tab Types
- **Journeys**: Developer Journey | User Journey
- **Profiles**: Developers | Users | AI Systems
- **Audits**: All Audits | Daily | Weekly | Monthly
- **Docs**: SIA Index | Consultation | All Documents

Add at the right end:
- Search input (client-side, searches page titles/descriptions)
- **"Claude Code"** button (styled distinctively — links to `/platform/consult/`)

Match existing nav patterns exactly.

**Commit:** `"feat: top navigation — categories with dropdowns, search, Claude Code button"`

---

### STEP 3: SIA minisite — static rendering of docs/SIA/

**Check first:** Does `gray-matter` exist in `apps/csps-playground/package.json`? If yes, use it. If not, implement a simple frontmatter parser inline.

Create `apps/csps-playground/src/lib/sia-docs.ts` (or `.js`):
- Reads all `docs/SIA/*.md` files at build time using `fs` + `path`
- Returns typed array: `{ slug, filename, frontmatter, content }[]`
- slug = filename without .md, lowercased, hyphens
- Sort alphabetically by filename (00-INDEX first)

Create `apps/csps-playground/src/app/platform/sia/page.tsx`:
- Uses PageHeader: title="SIA Architecture", subtitle="Structural Intelligence Architecture — the long-term platform design"
- Toolkit: content from the Palace philosophy quote ("Context is the palace")
- Sidebar: grouped file list (PHI | R1 | R2 | R3 | META)
- Main: renders 00-INDEX.md content
- Per file: protection level badge
- "Edit in GitHub" button per file: `https://github.dev/CommarkG/csps/blob/main/docs/SIA/[filename]`

Create `apps/csps-playground/src/app/platform/sia/[slug]/page.tsx`:
- Dynamic route rendering any SIA file
- PageHeader: title from frontmatter name field, subtitle from frontmatter context_question
- Toolkit: frontmatter context_quote
- Frontmatter metadata block: id, version, protection_level, core_spines
- Previous / Next navigation in filename order
- "Edit in GitHub" button
- `generateStaticParams`: generate params for all SIA slugs

**Commit:** `"feat: SIA minisite — static rendering, navigation, GitHub.dev edit links"`

---

### STEP 4: Profiling hub

Read `docs/SIA/PROFILING-HUB-SCHEMA.md` for the schema.

Create `apps/csps-playground/src/data/profiles.ts`:
```typescript
// Static data. Governor profile pre-filled per PROFILING-HUB-SCHEMA.md §2.
// 3 user persona placeholders. 2 AI system placeholders.
```

Create `apps/csps-playground/src/app/platform/profiles/page.tsx`:
- PageHeader: "Profiling Hub", subtitle="Developer, user, and AI system profiles"
- Three cards linking to /developers/, /users/, /ai-systems/

Create `apps/csps-playground/src/app/platform/profiles/developers/page.tsx`:
- PageHeader: "Developer Profiles"
- List view of developer profiles from profiles.ts
- Governor profile shown with all fields pre-populated
- "Add Profile" button (stub — opens coming soon modal)

Create skeleton pages (hub + empty list with "Coming in R1" chip):
- `/platform/profiles/users/page.tsx`
- `/platform/profiles/ai-systems/page.tsx`

**Commit:** `"feat: profiling hub — developer/user/AI structure, Governor profile, skeleton pages"`

---

### STEP 5: Document template gallery

Read `_handoff/VAULT/template-registry.md` and `tools/templates/` for existing templates.

Create `apps/csps-playground/src/app/platform/architecture/node-templates/page.tsx`:

PageHeader: "Document Templates", subtitle="All CSPS artifact templates — fork these, don't start from scratch"
Toolkit: "Creation Rule: never create an artifact without first checking if a template exists"

Dashboard features (all client-side state — no backend):
- **View toggle**: Card grid | Line list (toggle button, persists in localStorage)
- **Search**: filters by name and type in real-time
- **Sort**: by name | type | protection_level (dropdown)
- Per template card/row: name, type, description, protection level badge, "Fork in GitHub" button
  - Fork link: `https://github.dev/CommarkG/csps/blob/main/[template-path]`

Data: parse template-registry.md at build time using fs.readFileSync.

**Commit:** `"feat: document template gallery — search, sort, two views, fork links"`

---

### STEP 6: Recurring audits dashboard

Read `docs/plan/pillar-0-governance/audit-hub.md` for audit pipeline definitions.

Create `apps/csps-playground/src/app/platform/audits/page.tsx`:

PageHeader: "Audit Dashboard", subtitle="Scheduled validators and compliance checks — daily, weekly, monthly"
Toolkit: "Prevention over detection. Audits that run = audits that protect."

Dashboard features (all client-side):
- **Cadence tabs**: All | Daily | Weekly | Monthly (filter the list)
- **View toggle**: Card (windows/grid) | List (rows) — persists in localStorage
- **Search**: real-time filter by name and status
- **Sort**: by name | cadence | status | last_run
- **Status chips**: active (green) | planned (blue) | stub (gray) | deferred (amber)
- Per audit: name, description, cadence, status, last_run (mock), "Run Now" button (stub — shows toast "Not yet wired — coming in R2")

Add button → modal:
```
"Add New Audit" modal with fields: name, description, cadence, type
Double-verification: Step 1 — "This will add a new audit. Confirm?" 
Step 2 — "Type the audit name to confirm: [text input must match]" 
```

Delete button → same double-verification pattern.

Consensus note displayed at bottom: "Changes take effect after Governor ratification and pnpm verify exit_code=0"

**Commit:** `"feat: recurring audits dashboard — cadence tabs, two views, search, sort, add/delete with verification"`

---

### STEP 7: Claude Code consultation interface

Create `apps/csps-playground/src/app/api/consult/route.ts`:
```typescript
// POST handler
// Body: { message: string, model: 'opus' | 'sonnet', history: Array<{role, content}> }
// Server-side only — reads ANTHROPIC_API_KEY from process.env
// System prompt: reads docs/SIA/00-INDEX.md at runtime with fs.readFileSync
//   Prepend to system: "You are consulting on the CSPS (CoreSights Platform Services) architecture.
//    The following is the platform context: [00-INDEX content]"
// Model mapping: opus → claude-opus-4-7, sonnet → claude-sonnet-4-6
// Use the Anthropic SDK (@anthropic-ai/sdk) — check if it's in package.json, install if not
// Returns: { response: string } or { error: string }
// If ANTHROPIC_API_KEY missing: return { error: 'API_KEY_NOT_CONFIGURED' } with 503
```

Create `apps/csps-playground/src/app/platform/consult/page.tsx`:

PageHeader: "Claude Code Consultation", subtitle="Direct consultation with Opus (Architect) or Sonnet (Builder)"
Toolkit: "Opus for architecture decisions. Sonnet for implementation questions. Hooks don't apply here — for ratified execution, use the Claude Code chat."

Layout:
- Model selector at top: two buttons [OPUS — Architect] [SONNET — Builder], active state styled
- If API key not configured: amber banner "Add ANTHROPIC_API_KEY to Vercel Environment Variables to enable. Vercel Dashboard → csps-playground → Settings → Environment Variables"
- Chat area: conversation history (user messages right-aligned, AI responses left-aligned)
- Input area: textarea + Send button (disable when loading)
- Loading indicator while waiting for response
- "Clear conversation" button (resets state)

Important note rendered above the input:
> "This consultation has SIA architecture context loaded automatically.
> For consequential decisions and file modifications, use the Claude Code chat — 
> governance hooks apply there, not here."

State: React state (clears on page refresh — no persistence needed for v1)

**Commit:** `"feat: Claude Code consultation interface — API route, model selector, SIA context auto-loaded"`

---

### STEP 8: Wire navigation + final checks

- Verify all new routes are linked in the top navigation (Step 2)
- Verify all new pages use the PageHeader component (Step 1)
- Spot-check: protection level badges show correctly on SIA pages (sacred=red)
- Spot-check: audit dashboard cadence tabs filter correctly
- Spot-check: consultation shows the API key banner if key not configured (test with missing key)
- Spot-check: template gallery fork links open github.dev

Build: `pnpm --filter @csps/csps-playground build` must pass
Verify: `node tools/verify.mjs` → exit_code must be 0

**Commit:** `"feat: wire navigation + final verification — all S050 playground features connected"`

---

## PART 7 — SINGLE REPORT FORMAT

After all 9 steps complete, report once:

```
Opus, this is Sonnet. PLAYGROUND-S050 done. Steps 0-8 batched.
Step 0 commit: [sha] — context sync
Step 1 commit: [sha] — PageHeader component
Step 2 commit: [sha] — top navigation
Step 3 commit: [sha] — SIA minisite
Step 4 commit: [sha] — profiling hub
Step 5 commit: [sha] — template gallery
Step 6 commit: [sha] — audit dashboard
Step 7 commit: [sha] — consultation interface
Step 8 commit: [sha] — wire + verification
pnpm verify: exit_code=[N] | [key passing validator counts]
build: [pass/fail]
Playground URL: csps-playground.vercel.app/platform/sia/
Consultation URL: csps-playground.vercel.app/platform/consult/
PE-SUGGESTION: [top non-done item from unified-plan.yaml]
Questions: (numbered, only if genuine blockers arose)
```

---

*CSPS | Sonnet S050 Complete Brief | Commit: dab3e56+ | OPUS-6 authored*
