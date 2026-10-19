---
name: testing-quality-gates
description: "Use for test design, flaky/failing suites, CI quality gates, lint/type/build checks, regression coverage, and release readiness."
---

# Select meaningful tests and report gates honestly


## Purpose and scope
Build confidence through deterministic, risk-focused verification rather than maximizing test count.

## Activation conditions
Use when adding behavior, fixing bugs, changing contracts, evaluating release readiness, or diagnosing CI failures.

## Required context
Inspect existing test framework/scripts, fixtures, CI workflow, lint/format/typecheck/build commands, coverage conventions, and runtime dependencies.

## Step-by-step workflow
1. Map changed behavior to acceptance criteria and failure modes.
2. Choose unit tests for isolated logic, integration tests for real boundaries, API tests for contracts/auth, and E2E tests for critical user flows.
3. Reuse project fixtures and isolate external services/time/randomness.
4. Add negative and boundary cases, including security cases where applicable.
5. Run the narrowest relevant tests first, then type/lint/build and broader suites as appropriate.
6. Inspect failures rather than editing expectations blindly.
7. Record exact commands, exit status, skipped checks, and environmental limitations.

## Engineering standards
- Tests should be deterministic, isolated, readable, and assert behavior rather than implementation details.
- Mock only boundaries that are expensive/unavailable; use real integration paths where they add meaningful confidence.
- Cover loading/error/empty states, invalid input, auth failures, ownership mismatch, and transactional failures when relevant.
- CI should fail on meaningful quality gate failures and avoid leaking secrets.
- Do not equate coverage percentage with correctness.

## Common anti-patterns
- Claiming a suite passed without running it.
- Flaky sleep-based tests, shared mutable fixtures, and order-dependent tests.
- Mocking the function under test or asserting private implementation unnecessarily.
- Skipping failing tests without documenting why.
- Running every expensive suite for a one-line typo when a focused check is sufficient.

## Security considerations
Use synthetic test credentials and data. Do not print secrets in CI logs. Ensure security tests fail closed and do not weaken assertions to get green builds.

## Verification requirements
Observe each command result. Distinguish passed, failed, skipped, and not run. Verify changed behavior and relevant regression risk.

## Completion-report format
List tests/checks with exact command and result, coverage gaps, environmental blockers, and release-gate status.

