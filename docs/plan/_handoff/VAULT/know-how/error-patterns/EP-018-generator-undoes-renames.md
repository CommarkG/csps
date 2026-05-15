---
id: csps.ep.018
name: EP-018-generator-undoes-renames
description: Running a file generator after git mv recreates the old filenames, undoing the rename.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: vault_files
impl_status: swift-implemented
diataxis_type: reference
session: S032
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: fix, href: ../../../../packages/principles/split.mjs }
---

# EP-018 — Generator Undoes Renames

**Symptom:** After renaming generated files with `git mv`, running the generator (`pnpm principles:split`) recreates the old filenames alongside the new ones. Both old and new files coexist on disk.

**Root cause:** The generator script has hardcoded logic to produce `${id}.yaml` as the output filename. It doesn't know about the new naming convention. Running it recreates the old files.

**Fix pattern:** When renaming generated artifacts:
1. Update the generator script FIRST to produce the new filename format
2. THEN run the generator (it produces new names)
3. Delete old files separately if they still exist

OR:
1. git rm old files
2. Update generator
3. Run generator (produces new files)
4. git add new files

**DO NOT:** Run the generator between the git mv and the generator update. This creates a "both coexist" state that's confusing.

**Applied to:** `packages/principles/split.mjs` — updated to generate `P-ARCH-001-topic-kebab.yaml` format in S032 E5.
**Also fixed:** `tools/validators/validate-principle-slices.mjs` — updated to prefix-match (P-ARCH-001-*.yaml) instead of exact match.
