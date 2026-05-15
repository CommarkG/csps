---
id: csps.pillar-6-operations-and-delivery.android-workflow
name: android-workflow
description: Android workflow for CSPS Zero-Laptop-Dependency (P-OPER-001 Hybrid Q-1=C). Read-only and light-edit workflows via GitHub mobile + Chromium browser + GitHub Codespaces. Per zero-laptop-dependency-setup topic-plan L1.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: novel-pending-pattern-evaluation
core_spine: OPER
schema_anchor: pillar_6_ops_leaves
tags:
  - domain:ops
  - type:how-to
  - audience:developer
  - maturity:stable
diataxis_type: how-to
session: S011
file_depth_markers:
  l1_lines: "1-60"
  l2_lines: "61-end"
  read_protocol: "L1 = app list + quick-start. L2 = detailed workflows."
domain_path: platform
scope_level: S1
---

# Android Workflow — CSPS

> Per P-OPER-001 Zero-Laptop-Dependency: Android = **read-mostly + light-edit**. Full engraving/commit sessions use Codespaces via Chromium.

## Apps to install

| App | Use | Link |
|---|---|---|
| **GitHub mobile** | Browse repo / view commits / read HANDOFFs / review PRs | Play Store: "GitHub" |
| **Chromium** (or Chrome) | Full Codespaces sessions for typing | Play Store: "Chromium" |
| **Claude.ai** (web) | AI sessions from Android | claude.ai in browser |

## Quick-start bookmarks (pin to home screen)

```
https://github.com/CommarkG/csps                                          — repo root
https://github.com/CommarkG/csps/tree/main/docs/plan/_handoff           — handoffs
https://github.com/CommarkG/csps/blob/main/docs/plan/_handoff/VAULT/OVERVIEW.md — platform state
https://github.dev/CommarkG/csps                                          — lightweight editor
github.dev opens files in VS Code for Web (no terminal; read+light edit only)
```

## Workflow A — Read-only (GitHub mobile)

1. Open GitHub mobile → CommarkG/csps
2. Navigate to `docs/plan/_handoff/VAULT/OVERVIEW.md` for current state
3. Browse commits: tap "Commits" on main branch
4. View open PRs / issues for context
5. Read HANDOFF before a new session

## Workflow B — Codespaces (full session, Chromium)

1. Open Chromium → github.com/CommarkG/csps
2. Press `.` on keyboard OR change URL to `github.dev/CommarkG/csps` → VS Code for Web opens
3. For terminal access: go to github.com/CommarkG/csps → Code button → Codespaces → New codespace
4. Wait ~2 min for postCreate.sh to run (pnpm install + verify)
5. Open Claude Code in terminal: `npx @anthropic-ai/claude-code`
6. Session proceeds normally; all commits pushed automatically

## Workflow C — Read + light commit (github.dev)

1. `github.dev/CommarkG/csps` — opens file editor, no terminal
2. Navigate to file → edit → Ctrl+Enter to commit directly
3. Use for: updating HANDOFF carry-forwards, fixing typos, markdown edits
4. NOT for: TypeScript changes, pnpm installs, running validators

## Limitations

- Codespaces costs ~$0.18/hr (4-core); acceptable for CSPS sessions
- Android screen = limited — prefer landscape + external keyboard if available
- Session state NOT preserved between Codespaces instances — always push before closing
- `pnpm verify` takes ~10s in Codespace; same as local
