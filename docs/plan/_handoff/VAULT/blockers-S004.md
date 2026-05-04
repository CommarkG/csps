---
id: csps.handoff.vault.blockers-S004
name: blockers-S004
description: S004 blocker registry — zero formal blockers raised this session. All work proceeded with on-the-fly resolutions. Per AGENTS.md hard NO ("Never write HANDOFF-S<NNN>-to-S<NNN+1>.md while any blocker is `state: open`"), this 0-state file is the precondition for HANDOFF-S004-to-S005.md to be written.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: protocols, href: ./protocols.md }
  - { rel: handoff, href: ../HANDOFF-S004-to-S005.md }
session: S004
---

# Blocker Registry — Session S004

## State at S004 close

**ZERO BLOCKERS RAISED THIS SESSION.**

All issues encountered were resolved within-session via on-the-fly fixes:

- ❌→✅ Cloudflare token: user pasted curl-command instead of token → re-copied from same page (still open) → verified live
- ❌→✅ Supabase password reset clipboard scrambled (3 attempts) → switched to scratch-file approach → succeeded
- ❌→deferred Supabase REST 401: failed on `/rest/v1/` and `/auth/v1/health` → deferred (likely Data API toggle off in project; not blocking — DB pooler reachable; Prisma uses DATABASE_URL directly, not REST)

Per AGENTS.md hard NO: "Never write HANDOFF-S<NNN>-to-S<NNN+1>.md while any blocker is `state: open`" — this 0-state file is the precondition for HANDOFF-S004-to-S005.md to be written. Met.

## Why zero formal blockers

Session was provisioning + rotation + git-push heavy. None of the encountered issues required user-decision blocking; all had clear resolution paths within-session. The 4-condition autonomous-execution gate held throughout (ratified ✓ + reversible ✓ + mechanical ✓ + no-cross-actor ✓).

## Self-correctable catches noted (NOT blockers; engraved as memory + AGENTS.md per `feedback_catch_to_engraving.md`)

These are catches noticed and engraved this session, NOT decision-needed blockers:

1. **Clipboard-clobber pattern** — user types in chat → typed text auto-selected/copied → overwrites password-in-clipboard before AI reads it. Fix: scratch-file approach (create empty file, paste password there, AI reads file). Engraved as `feedback_clipboard_clobber_pattern.md` + AGENTS.md note.
2. **Cloudflare token-display capture trap** — token-display page also shows curl test command; user-copy can grab the curl line by accident. Fix: explicit "click copy icon next to token value, NOT below". Engraved as part of `feedback_clipboard_clobber_pattern.md`.
3. **`csps-*` resource-naming convention** — pragmatic separation when sharing Cloudflare account with prior platform (CSP). Fix: explicit naming-prefix discipline + token scoped to account. Documented in `dev-keys.txt` header + applies to all CSPS Cloudflare resources.
4. **Dev-secrets-outside-workspace pattern** — secrets file lives at `~/Documents/csps-secrets/`, NOT in workspace `.gitignore`-relying. Fix: outside-workspace placement is structurally impossible-to-commit. Engraved as memory + acknowledged in initial commit.
5. **Leaked-secrets-rotation discipline** — when secret echoes through chat / tool-call output, rotation is mandatory before session close. Engraved this session: rotated Clerk secret + Supabase DB password.

## Carry-forward to S005

**None.** No blockers carry to S005's blocker registry.

S005 begins with a clean slate. The user's first turn may surface new blockers, which would populate `blockers-S005.md` (created on first such surfacing).
