---
id: csps.handoff.vault.chat-jump-prompt-S005-to-S006
name: chat-jump-prompt-S005-to-S006
description: Minimal paste-target for opening S006. Per protocols.md v1.8 §22.
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
session: S005
domain_path: platform
scope_level: S1
---

# Chat-jump prompt — S005 → S006 (minimal)

The minimal paste-target for the new chat:

```
Read docs/plan/_handoff/HANDOFF-S005-to-S006.md §0 and execute.
```

That's it. The new AI loads the handoff, runs §0 step-by-step (precedent question + priority-zero reads + §1.1 verification + §17 attestation), then begins §3 work.

For the user-facing detailed paste-prompt (~250 words explaining what's about to be triggered), see [chat-jump-prompt-S005-to-S006-detailed.md](./chat-jump-prompt-S005-to-S006-detailed.md).
