---
id: csps.pillar-0.mini-tree-split-protocol
name: mini-tree-split-protocol
description: >
  The airtight "what we do when" protocol for splitting a file into a mini-tree.
  Covers: who detects, who decides, what changes, who gets notified, what wires break,
  and how mini-trees tell their consumers they have sub-files. Mechanically enforced.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
core_spines: [ARCH, GVRN, VALD]
schema_anchor: pillar_0_governance_leaves
domain_path: platform
template_grade: A
diataxis_type: reference
session: S029
impl_status: swift-implemented
links:
  - { rel: template, href: ../../../tools/templates/mini-tree-intro.template.md }
  - { rel: naming-policy, href: ./naming-policy.md }
  - { rel: validator, href: ../../../tools/validators/validate-mini-tree-integrity.mjs }
  - { rel: complexity-validator, href: ../../../tools/validators/validate-file-complexity.mjs }
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# Mini-Tree Split Protocol

> **The core question the Governor identified:** When a file splits into a mini-tree,
> things that REFERENCE that file may not know it transformed. The mini-tree must
> TELL its consumers it has sub-files — and this must be mechanically enforced.

---

## §1 — What Already Exists

| Artifact | Status | What it does |
|---|---|---|
| `mini-tree-intro.template.md` | ✅ Exists | Template for the intro+index file of any split |
| `file-complexity-threshold` slug | ✅ Registered | Detects: lines > 300 AND H2 sections ≥ 3 |
| `mini-tree-intro-required` slug | ✅ Registered | Detects: directories with 2+ files without intro |
| `validate-file-complexity.mjs` | ❌ NOT BUILT | The actual enforcement — week-4 deferred |
| `validate-mini-tree-integrity.mjs` | ❌ NOT BUILT | The wiring check — spec in this file |

**The gap:** Detection is registered but enforcement is not built. The split can happen but nothing verifies the wiring is correct afterwards.

---

## §2 — The Wiring Problem (Deep Analysis)

When a file splits, three categories of wiring can break:

**Category A: Direct references (links in other .md files)**
```
docs/plan/pillar-0-governance/audit-runner.md → [behavioral-contracts.md](...)
```
If behavioral-contracts.md splits → the link should resolve to the INTRO file at the same path. **Solution:** The intro file IS at the original path. The original file becomes the intro file (renamed in-place). All existing links continue to work.

**Category B: Validator references (validators that scan specific files)**
```
validate-behavioral-contract-slices.mjs → scans behavioral-contracts.md
```
If behavioral-contracts.md splits → the validator must scan the intro file which lists sub-files. **Solution:** Validators read `sub_files:` array from the intro file's frontmatter to find what to scan.

**Category C: Command references (pnpm scripts that target specific files)**
```
pnpm contracts:split → splits behavioral-contracts.md into slices
```
If the monolith is replaced by a mini-tree → the split command needs to scan sub-files. **Solution:** The split command reads `mini_tree_root: true` frontmatter and processes sub-files.

**Category D: Slice sync validators (checking that generated slices are fresh)**
```
validate-slice-freshness.mjs → checks if behavioral-contracts.md was modified recently
```
After split → must check if ANY sub-file was modified. **Solution:** The freshness validator reads the intro file's `sub_files:` array and uses max(modification times).

---

## §3 — The "Mini-Tree Tells" Mechanism

Every mini-tree intro file MUST have:

```yaml
---
mini_tree_root: true
sub_files:
  - ./sub-file-1.md
  - ./sub-file-2.md
  - ./sub-file-3.md
---
```

This frontmatter makes the structure machine-readable. Every consumer that references the original file can:
1. Check for `mini_tree_root: true` — if present, this is an index
2. Read `sub_files:` array — get all the content files
3. Process sub-files instead of (or in addition to) the intro

**`validate-mini-tree-integrity.mjs`** enforces this bidirectionally:

```javascript
// For every file with mini_tree_root: true:
//   Verify all sub_files: entries exist
//   Verify all sub-files have a parent reference back to the intro

// For every file in a sub-file array:
//   Verify it exists
//   Verify it has a parent_intro: link or is referenced by exactly one intro file

// For every file that was recently split (detected via git):
//   Verify the intro file has mini_tree_root: true
//   Verify all existing references to the original path still resolve
```

Severity: ADVISORY for orphaned sub-files; BLOCKING for missing mini_tree_root on known split files.

---

## §4 — The "What We Do When" Protocol (Airtight)

### TRIGGER

```
validate-file-complexity.mjs detects:
  file.lines > 300 AND file.h2_sections ≥ 3
```

OR: Governor / Sonnet observes the file is approaching threshold.

### STEP 1: Detection → Scope Classification

```
Is the file at S0 scope? (constitutional, core-spines, sealed principles)
  YES → Requires Opus review before splitting (file SROF)
  NO → Sonnet can propose and execute split

Is the file at S1 scope? (platform-wide, governance artifacts)
  YES → Sonnet proposes split plan + Governor confirms
  NO → Sonnet autonomous for S2+ scope files
```

### STEP 2: Split Plan Declaration

Before any file editing:

```
SPLIT PLAN — [filename]:
  Proposed intro: [path/README.md or path/[filename].md]
  Sub-files:
    - [sub-file-1]: covers [what]
    - [sub-file-2]: covers [what]
  Wiring changes needed:
    - [validator X]: update to read sub_files: from intro
    - [pnpm script Y]: update to scan intro + sub_files
    - [reference in doc Z]: verify link still resolves (no change needed if intro at same path)
  Who must confirm: [Opus for S0/S1 | Governor | Sonnet autonomous]
```

### STEP 3: Execute the Split

1. Create the intro file at the ORIGINAL path (or rename original → intro)
2. Add to intro frontmatter: `mini_tree_root: true`, `sub_files: [...]`
3. Create sub-files with content extracted from original
4. Run `validate-mini-tree-integrity.mjs` → must pass before commit
5. Update any validator/script that specifically referenced the original file
6. Run `pnpm verify` → must be exit_code=0

### STEP 4: Post-Split Wiring Audit

Run after split:
```bash
# Check that all existing references still resolve
grep -r "[original-filename]" docs/ tools/ AGENTS.md | grep -v ".git"
# For each result: verify the reference resolves to the intro file
# If any reference is broken: fix before closing the split session
```

### STEP 5: Update These Artifacts (Mandatory Checklist)

| Artifact | What to update |
|---|---|
| `audit-runner.md` | If a validator slug references the original file — update description to reference intro + sub_files |
| `validate-slice-freshness.mjs` | Add the new intro file to the pairs_checked list |
| Any `pnpm X:split` command | Update to read sub_files: from intro frontmatter |
| Memory files (feedback_*.md) | If they reference the original file — update path |
| `schema-registry.md` | If the file had a schema_anchor — add the same anchor to the intro file |

---

## §5 — File Naming for Mini-Trees

**Convention (mechanically enforced):**

```
BEFORE split:
  docs/plan/pillar-0-governance/behavioral-contracts.md

AFTER split:
  docs/plan/pillar-0-governance/behavioral-contracts/
    README.md              ← The intro file (at /behavioral-contracts/README.md)
    B_COGNITIVE_*.md       ← Sub-files named by their content
    B_TOKEN_BUDGET.md
    ...
```

OR for files that stay at top level:
```
BEFORE:
  docs/plan/pillar-0-governance/behavioral-contracts.md

AFTER (same-directory mini-tree):
  docs/plan/pillar-0-governance/behavioral-contracts.md  ← BECOMES the intro
  docs/plan/pillar-0-governance/behavioral-contracts/
    B_COGNITIVE_*.md       ← Sub-files in a sub-directory named after the monolith
```

The second pattern (monolith → intro at same path + sub-directory) preserves all existing references.

---

## §6 — What validate-mini-tree-integrity.mjs Must Check

```javascript
// 1. Every file with mini_tree_root: true must have sub_files: array (non-empty)
// 2. Every file in sub_files: must exist at the declared path
// 3. Every sub-file must be smaller than the parent (sub-files should be smaller)
// 4. No file can be both mini_tree_root AND listed as a sub_file of another
// 5. For recently split files (git changes): verify the intro file has mini_tree_root: true
// 6. For every external reference to a file that has mini_tree_root: true:
//    verify the reference is to the intro path (correct) not to a sub-file directly
//    (sub-files should be referenced only from within the mini-tree)

// Severity:
// BLOCKING: sub_files entry doesn't exist, or mini_tree_root missing after known split
// ADVISORY: sub-file referenced externally (should reference intro instead)
```

---

*Mini-Tree Split Protocol | The "what we do when" airtight | S029 | 2026-05-14*
