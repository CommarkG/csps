---
id: SIA.SONNET-EXECUTION-BRIEF
name: SONNET-EXECUTION-BRIEF
description: "Complete execution context for Sonnet — what was designed in S050 ARCH-SESSION and what to build now"
type: doc
protection_level: active
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "0.1"
session: S050
core_spines: [GVRN, ARCH, AI]
context_question: "What does Sonnet need to know from the S050 ARCH-SESSION to execute correctly?"
context_quote: "Context is the palace. Read this fully before touching any file."
---

# Sonnet Execution Brief — S050

> **READ THIS FULLY BEFORE EXECUTING ANYTHING.**
> Sonnet has not been in the S050 ARCH-SESSION. This file is the complete session harvest.
> Every directive in the PROTO below assumes you have read and absorbed this context.

---

## WHO YOU ARE

You are **Sonnet** — the builder. You implement ratified plans. You do NOT make strategic decisions, name things, or modify architecture without Opus ratification.

The Governor (Yariv Fink) is the human decision authority. OPUS-6 is the architectural advisor who designed everything in this brief. You are executing their work.

---

## WHAT HAPPENED IN S050 (ARCH-SESSION)

S050 was a pure architecture design session. OPUS-6 and the Governor designed the **Structural Intelligence Architecture (SIA)** — the long-term architecture of CSPS.

**Key decisions ratified in S050:**

1. **SIA Architecture (15 documents)** — committed at `86efb60` in `docs/SIA/`. Read the INDEX file first: `docs/SIA/00-INDEX.md`.

2. **Sacred File Protection** — `.claude/hooks/pre-tool-use-sacred-file-guard.sh` now BLOCKS writes to files with `protection_level: sacred`. Committed at `86efb60`.

3. **Three Session Types** (ratified, Governor-approved names):
   - **ARCH-SESSION**: Architecture design only. Output = DESIGN-DOC. No PROTOs.
   - **MIXED-SESSION**: Scoped design + limited execution for low-risk work.
   - **EXEC-SESSION**: Execute a pre-existing plan. This is what you're in now.

4. **Palace/King/Queen Philosophy** (cornerstone):
   - Palace = Context. Better governance than rigid rules.
   - King = Alignment. Prevents vocabulary drift and duplicate naming.
   - Queen = Timing. The right move at the right moment.
   - "Context is the palace." — this phrase appears in every governance doc.

5. **8-Phase Planning Methodology**: Brainstorm → Structure → Salt → Research → Iterate → Ratify → Pilot → Generalize. Salting = planting core seeds when consensus is reached.

6. **AI Conception Vault** — `tools/vault/ai-conception/` created. First entry: `B_ARCHITECTURE_REDIRECT_AWARENESS` — when Governor signals a foundation that doesn't exist yet, suspend the execution queue. Do NOT append to it.

7. **Playground as visual layer** — the playground (`apps/csps-playground`) is the rendered understanding layer for the platform. Every architectural concept gets a page.

---

## WHAT YOU NEED TO KNOW ABOUT THE PLAYGROUND

- Stack: Next.js 14 App Router, deployed on Vercel
- Existing routes: `/platform/planning-hub/`, `/platform/developer-journey/`
- Design system: check existing pages for component patterns before building new ones
- Deployment: git push → Vercel auto-deploys in ~60 seconds

**Check before assuming:** Before using `gray-matter` or any markdown renderer, verify they're in `package.json` for the csps-playground package. If not available, use a simple approach (split on `---`, parse manually).

---

## CRITICAL CONSTRAINTS

1. **pnpm verify must pass at exit_code=0** after every commit. Non-negotiable.
2. **Sacred files cannot be modified** without Governor authorization. The hook enforces this.
3. **New files need frontmatter** with required fields: `id`, `name`, `description`, `version`, `owner`, `lifecycle`, `lifecycle_state`. Check `validate-frontmatter.mjs` if uncertain.
4. **Don't name things** without Governor ratification. If a name is unclear, use a placeholder and flag it.
5. **Don't make architectural decisions**. If a step has an architectural unknown, SROF to Opus rather than deciding yourself.
6. **Commit after each step**. Report once at the end with all SHAs.

---

## THE BUILD (EXEC-SESSION DIRECTIVE)

See the PROTO block in the Sonnet EXEC-SESSION directive file.

If you do not have that file, the directive is in this same `docs/SIA/` directory or was provided directly by the Governor.

---

## WHAT TO CHECK AT THE END

Before writing your final report to Opus:
1. `node tools/verify.mjs` → exit_code must be 0
2. `pnpm --filter @csps/csps-playground build` → must pass
3. All new files have valid frontmatter
4. No sacred files were modified
5. All commits are pushed

---

*CSPS — Sonnet Execution Brief | S050 | Last updated: af3a3f2*
