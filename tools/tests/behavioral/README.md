---
id: csps.tools.tests.behavioral
name: behavioral-tests
description: "CSPS behavioral test suite. Each test proves a validator catches real violations — not just descriptions. Every governance rule that can fail silently must have a behavioral test."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: audit_scheduling
diataxis_type: reference
context_question: "Before claiming a validator is fixed, has the behavioral test been run and confirmed exit=1 on a known violation?"
context_quote: "A solution that hasn't been tested against a known violation is a description, not a solution."
---

# Behavioral Tests

## Purpose

Behavioral tests verify that validators catch **actual behavioral violations**.

The gap_CONCEPTUAL_CLOSURE_NO_TEST entry in the Gap Recurrence Register identified the root cause behind most recurring governance failures: solutions are designed and described (cognitive match) without being tested against known violations. The model of the solution is treated as the solution.

This directory is the structural fix for that gap.

## Structure

Each test provides:
- A synthetic violating input (the validator MUST reject this)
- A synthetic compliant input (the validator MUST pass this)

The test passes when:
- Violating input → validator exit=1
- Compliant input → validator exit=0

## Running All Tests

```bash
for f in tools/tests/behavioral/*.sh; do bash "$f"; done
```

## Test Index

| File | Validator | What it proves |
|---|---|---|
| [zf-cycle-format-test.sh](zf-cycle-format-test.sh) | validate-zf-cycle-format.mjs | Nominal ZF cycles ("re-examined areas") are BLOCKING. File-citing cycles pass clean. |

## Adding a New Test

1. Create a `.sh` file named `{validator-slug}-test.sh`
2. Define INPUT A (violating) and INPUT B (compliant)
3. Call the validator with the test file as argument
4. Assert exit codes match expectations
5. Exit 0 if all assertions pass, exit 1 on any failure
6. Register the test in this README table

## Gap Recurrence Tracking

When a test is added for an entry in [gap-recurrence-register.yaml](../../data/gap-recurrence-register.yaml):
- Update `behavioral_test_exists: true` in the register
- The validate-gap-recurrence.mjs validator will stop flagging that entry as ADVISORY
