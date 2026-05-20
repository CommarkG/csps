#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-exists-not-equals-active
# @csps-name post-stop-exists-not-equals-active
# @csps-description Stop hook — STUB for B_EXISTS_NOT_EQUALS_ACTIVE (AP-001).
#   Future: scans last response for citations of governance artifacts (B_*, P-META-*)
#   and checks whether a named activation mechanism (T1/T2/session-open/DNA) was also cited.
#   If artifact cited without activation mechanism → emits ADVISORY: "governance theater detected."
#   STUB mode — exits 0, emits no output. Promotes to ADVISORY in S047.
#   Training default: "writing a rule makes it a rule."
#   CSPS override: writing a rule + activating it = enforcing it. Writing alone = documentation.
# @csps-version 0.1.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces B_EXISTS_NOT_EQUALS_ACTIVE AP-001

exit 0
