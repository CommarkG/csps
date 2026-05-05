# Provenance — EXT-20260505-006 (Edge Case Handling Note)

## Source platform
**CSP** (Yariv's other platform). NOT in CSP DNA export series — operational reference document.

## Drafter
**Claude Opus 4.7 (1M context)** — CSP S337-prep H11 chat.

## Authority
**Governor Yariv (CSP)** — verbatim per CSP report metadata: *"present a short file on how did you manage to cover all of these not usefull popup to stop and how did you solve edge cases to apear.. and handle edge cases that will apear"*.

## Why CSP authored this
CSP S336+/S337-prep encountered same edge cases CSPS encounters: permission popups / hook blocks / encoding errors / compound-command failures / validator regressions caught at close. CSP documented the catalog as forward-going operational reference.

## CSPS-IMMEDIATE application
**Pattern A (permission popups for new file paths):** engraved THIS BATCH as `feedback_diff_before_protected_path_writes.md` per user explicit verbatim directive: *"I keep asking you to stop these from disturbing us — enforce it."*

CSPS will adopt §3 Pattern A solution forward-going: BEFORE any Write/Edit on `.claude/hooks/*` + `.claude/settings.json` + `.claude/commands/*` + `.claude/skills/*`, present diff inline + ASK explicitly + WAIT for "yes" before executing.

## User's words (S008 turn 11)
Same multi-part directive as EXT-005 provenance — see that file for full verbatim.

## Caveats
- Operational note; smaller scope than series reports
- 5 specific edge cases (CSP-historical) + 7 forward patterns (universal)
- 2 sub-IDs sufficient (cluster cases + patterns)
- Pattern G (settings.json) ALREADY in CSPS via feedback_no_settings_edits_unless_asked.md
- Pattern A NOW in CSPS via feedback_diff_before_protected_path_writes.md (S008 turn 11)
