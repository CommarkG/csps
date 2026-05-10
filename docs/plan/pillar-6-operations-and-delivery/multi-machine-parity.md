---
id: csps.pillar-6-operations-and-delivery.multi-machine-parity
name: multi-machine-parity
description: Multi-machine parity discipline for CSPS Zero-Laptop-Dependency. Ensures any machine (laptop / Codespace / Android Chromium) produces identical pnpm verify results. Per P-OPER-001 Hybrid Q-1=C + zero-laptop-dependency-setup topic-plan L1.
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
  read_protocol: "L1 = version pin table + invariants. L2 = troubleshooting."
domain_path: platform
---

# Multi-Machine Parity — CSPS

> The invariant: `pnpm verify` exits 0 on ANY machine where the repo is checked out. Achieved via version pinning, frozen lockfile, and devcontainer parity.

## Version pin table

| Tool | Pinned version | Where pinned |
|---|---|---|
| Node.js | 20 LTS | `.devcontainer/devcontainer.json` image |
| pnpm | 9.15.1 | `postCreate.sh` + `tools/bootstrap.ps1` |
| TypeScript | ^5.7.0 | `packages/*/package.json` devDependencies |

## Parity invariants

1. **Frozen lockfile**: `pnpm install --frozen-lockfile` — any package.json drift fails install
2. **devcontainer = bootstrap**: `.devcontainer/postCreate.sh` and `tools/bootstrap.ps1` pin identical Node+pnpm versions
3. **No local-only dependencies**: nothing in .gitignore that's required for verify to pass
4. **pnpm verify is the parity proof**: if it exits 0 on all machines, parity holds

## Parity check workflow

```bash
# On any machine after clone/pull:
pnpm install --frozen-lockfile
pnpm verify
# Exit 0 = parity confirmed
```

## Troubleshooting

| Symptom | Root cause | Fix |
|---|---|---|
| `pnpm install` frozen lockfile error | Package.json changed without updating lockfile | Run `pnpm install` locally → commit lockfile |
| TypeScript errors in Codespace but not local | Node version mismatch | Check `.devcontainer/devcontainer.json` image version |
| `validate-git-pushed-state` fails | Uncommitted/unpushed changes | `git push origin main` before session close |
| Codespace postCreate fails | pnpm version mismatch | Update `PNPM_VERSION` in postCreate.sh to match bootstrap.ps1 |

## Bootstrap parity check (local → devcontainer)

```powershell
# On local Windows:
node --version   # should be v20.x
pnpm --version   # should match PNPM_VERSION in postCreate.sh

# In Codespace:
node --version   # same
pnpm --version   # same
diff <(pnpm --version) <(grep PNPM_VERSION .devcontainer/postCreate.sh | grep -oP '[0-9.]+') # empty = parity
```
