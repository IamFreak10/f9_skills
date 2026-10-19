---
name: debugging
description: "Use for runtime errors, failing tests/builds, regressions, production incidents, flaky behavior, and unclear symptoms."
---

# Find root causes using evidence


## Purpose and scope
Use a repeatable evidence-based method: **Reproduce → Gather Evidence → Form Hypotheses → Isolate Root Cause → Apply Minimal Fix → Add Regression Test → Verify**.

## Activation conditions
Use when behavior is broken, output differs from expectations, tests fail, deployment errors occur, or the root cause is uncertain.

## Required context
Capture exact error, reproduction steps, expected/actual behavior, environment and versions, relevant logs, recent changes, related code/tests, and Git status.

## Step-by-step workflow
1. Reproduce the issue or clearly document why reproduction is unavailable.
2. Gather the smallest useful evidence: full relevant stack trace, failing assertion, request/response, logs, configuration shape without secrets, dependency versions.
3. List plausible hypotheses and rank them by evidence and test cost.
4. Run a discriminating check for the leading hypothesis before editing.
5. Trace the failure to the responsible boundary; distinguish root cause from downstream symptom.
6. Apply the smallest fix and avoid unrelated refactoring.
7. Add a regression test that would fail before the fix where feasible.
8. Re-run the reproduction and relevant checks; inspect the final diff.

## Engineering standards
- Change one causal factor at a time when practical.
- Compare working vs failing environment/configuration while redacting secrets.
- Check async timing, stale cache, network, schema drift, permissions, and version mismatch when relevant.
- Mark hypotheses as hypotheses until confirmed.
- If blocked, provide next diagnostic commands and the missing evidence.

## Common anti-patterns
- Random edits without reproducing.
- Suppressing errors, widening types, or disabling tests to obtain a green result.
- Treating a stack-trace frame as proof of root cause without tracing data/control flow.
- Making several speculative changes at once.
- Claiming a fix works without rerunning the failure.

## Security considerations
Redact secrets and personal data from logs. Avoid destructive debugging against production. Use read-only diagnostics first and safe test fixtures for reproduction.

## Verification requirements
Observe the original failure before and after when possible, run regression tests and relevant quality checks, and report any check that could not run.

## Completion-report format
State reproduction status, evidence, confirmed root cause or remaining hypotheses, minimal fix, regression coverage, exact checks/results, and unresolved uncertainty.

