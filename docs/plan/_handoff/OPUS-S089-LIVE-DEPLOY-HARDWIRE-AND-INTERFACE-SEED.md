---
id: csps.handoff.opus-s089-live-deploy-hardwire-and-interface-seed
name: OPUS-S089-LIVE-DEPLOY-HARDWIRE-AND-INTERFACE-SEED
description: >
  Opus director SEED (Sonnet builds). Part 1: the canonical environment-specific Vercel deploy RECIPE
  for live pages (cert fix + auth + commands + throwaway/permanent separation) — the blessed path both
  Opus and Sonnet route through so it is never re-derived. Part 2: spec for a permanent upload->deploy
  admin interface (upload HTML/code -> backend -> Vercel -> live URL), with the security guardrails.
version: "1.0"
owner: group:finky
authored_by: OPUS-25
core_spine: ARCH
core_spines: [ARCH, GVRN, OPER]
schema_anchor: handoff_files
diataxis_type: how-to
lifecycle: production
lifecycle_state: active
status: proposed-awaiting-ratification
precedent_checked: true
session: S089
---

# Live-page deploy — hardwire (recipe) + permanent upload interface (Opus SEED, Sonnet builds)

Born from a real friction (S089): a throwaway live page was blocked because the Vercel CLI token was
stale and login is interactive, plus a Windows corporate-cert SSL failure. Both are now KNOWN — engrave
the method so it is never re-derived, then build a self-serve interface so the Governor never needs the
CLI at all.

## PART 1 — THE DEPLOY RECIPE (the blessed path; hardwire for Opus + Sonnet)

**Environment facts (learned S089, do not re-derive):**
- **Cert fix (Windows corporate CA):** the CLI fails with "unable to verify the first certificate".
  Prefix every vercel/node network call with `NODE_OPTIONS=--use-system-ca` (or set
  `NODE_EXTRA_CA_CERTS`). Same class as the truststore issue CSP flagged for the Anthropic SDK.
- **Auth:** `vercel login` is INTERACTIVE (browser) — an AI in a non-interactive shell CANNOT run it.
  The scriptable path is a token: `vercel deploy --token=$VERCEL_TOKEN`. Store the token in an env var /
  secret, never in the repo.
- **Deploy a static page:** a folder with `index.html` →
  `NODE_OPTIONS=--use-system-ca vercel deploy --prod --yes --token=$VERCEL_TOKEN` (run from the folder).
  Prints the live `https://<name>-*.vercel.app` URL.
- **Encoding:** pasted HTML with Hebrew/RTL often arrives mojibake (UTF-8 read as Latin-1). Always emit
  a proper document: `<!DOCTYPE html><html dir="rtl" lang="he"><head><meta charset="utf-8">…`. If the
  source is corrupted, repair before deploy (latin1→utf8) — a garbled live page is not "done".
- **Throwaway vs permanent:** throwaway pages deploy to a SEPARATE, isolated Vercel project (NOT the
  platform's csps-playground project/domain) so arbitrary content never rides the platform's origin.

**The hardwire (honest about the mechanism):** a deploy is an external action — there is no T1/T2 gate
that can BLOCK an ad-hoc `vercel` call. So the enforcement is a SINGLE BLESSED PATH + engraving:
- **`deploy-live-page` skill** (Sonnet builds, Part 2 backend reuses it): the only sanctioned way to
  deploy a live page. It bakes in the cert fix, the token from secret, the folder→deploy flow, and the
  throwaway-project target. Nobody re-derives the recipe; everybody calls the skill.
- **Engraved pointers:** this recipe is referenced from opus-context.md + sonnet-context.md + AGENTS.md
  (both agents load it) + a `reference` memory. RULE: live-page deploys route through `deploy-live-page`,
  not raw `vercel` calls. (T3 engraving — the strongest available; not a blocking gate, and said so.)

## PART 2 — PERMANENT UPLOAD → DEPLOY INTERFACE (spec for Sonnet)

**Goal (Governor):** a permanent front end where the Governor uploads an HTML file (or pastes code) and
gets a live URL — "Vercel + the AI in the back", no CLI.

**Route:** `/platform/deploy` (admin-gated). **Flow:**
1. Upload a file OR paste HTML/code into an editor. Optional: name the deployment.
2. (optional AI assist) an action that lets the AI fix/wrap the code (charset, RTL, encoding repair)
   before deploy — "you in the back".
3. Click **Deploy** → server action writes the content to a temp folder → invokes `deploy-live-page`
   (Vercel deploy to the ISOLATED throwaway project via the server-side token) → returns the live URL.
4. A **list of past deploys** (name · URL · created · delete) — one-click delete removes the Vercel
   deployment. This is the "manual front-end deployment" surface.

**Backend:** a Next.js server action / route handler in the platform app that shells out to
`deploy-live-page` (or calls the Vercel REST API directly with the token). The Vercel token lives in a
server-side env/secret — NEVER shipped to the client.

**SECURITY GUARDRAILS (Opus gates these — non-negotiable):**
- **Isolated target project + domain.** Uploaded arbitrary HTML/JS deploys to a DEDICATED throwaway
  Vercel project on its OWN domain, never the platform origin — arbitrary uploaded JS on the platform
  domain = stored-XSS against tenants. This is the CSE isolation-host principle applied.
- **Admin-only.** The route requires the top auth tier; a tenant/user must never reach it.
- **Token server-side only.** The Vercel token is a server secret; the client never sees it; the deploy
  runs in a server action, not the browser.
- **No secrets in uploads.** Scan uploaded content for obvious secret patterns before deploy (advisory).
- **Ephemeral + deletable.** Every deploy is throwaway by default with a visible delete; optionally a
  TTL auto-delete. Aligns with "apps are ephemeral trials".

## DECISION LEDGER
- CHOSEN: engrave the deploy recipe as a blessed `deploy-live-page` skill + cross-agent pointers (the
  honest mechanical hardwire) AND spec a permanent admin upload->deploy interface that reuses the skill,
  deploying to an ISOLATED Vercel project. Sonnet builds; Opus gates the security pieces.
- REJECTED: a T1/T2 validator that "blocks non-blessed deploys" — a deploy is an external shell/API
  action; a repo gate cannot intercept it. Claiming otherwise would be a gate that does not fire
  (named!=active). Blessed-path + engraving is the real, honest enforcement.
- REJECTED: deploy uploaded content to the platform's own csps-playground project/domain — arbitrary
  uploaded JS on the platform origin is stored-XSS against tenants. Isolated project is mandatory.
- REJECTED: Opus builds this — Sonnet is the builder (operating-model correction, S089). Opus seeds+gates.

## BUILD ORDER (Sonnet, after ratification)
1. `deploy-live-page` skill (the blessed path: cert fix + token-from-secret + folder->deploy + isolated
   project target) + prove it FAIL->PASS on a tiny fixture page.
2. Engrave: reference this recipe from opus-context + sonnet-context + AGENTS + a reference memory.
3. `/platform/deploy` admin interface (upload/paste -> optional AI-fix -> Deploy -> URL + past-deploys
   list + delete), backend reuses the skill, token server-side, isolated project. Opus gates security.
