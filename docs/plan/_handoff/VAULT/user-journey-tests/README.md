---
id: csps.handoff.vault.user-journey-tests
name: user-journey-tests-readme
description: "Vault for user journey test records. UJT-NNN.yaml files track manual test results against PI item done criteria. Evidence-based done declaration."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: vault_files
diataxis_type: reference
session: S039
tags:
  - domain:governance
  - domain:ui
  - type:reference
  - audience:developer
  - maturity:draft
links:
  - { rel: parent, href: ../README.md }
  - { rel: script, href: ../../../../tools/scripts/record-user-journey-test.mjs }
---

# User Journey Tests (UJT-NNN)

Evidence-based done declaration for user-facing features. Every PI item that creates functionality a user interacts with must have a corresponding UJT file.

## The principle

`pnpm verify exit_code=0` proves the code is structurally correct.
A passing UJT proves a user can accomplish their stated goal.

These are different things. Both are required for DONE.

## How to record a test result

```bash
pnpm record:ujt --test UJT-001 --result pass --observation "User saw wizard at step 1, completed 3 questions, reached dashboard with balance cards"
pnpm record:ujt --test UJT-001 --result fail --observation "Wizard appeared but completion redirected to /account-setup loop"
```

Results: `pass | fail | partial | blocked`

## Test files

| File | PI Ref | Description | Status |
|---|---|---|---|
| [UJT-001](./UJT-001-threshold-signup-wizard.yaml) | PI-001 | Sign up → wizard → dashboard | pending |
