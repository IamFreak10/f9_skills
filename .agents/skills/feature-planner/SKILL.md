---
name: feature-planner
description: "Use when a request adds or changes behavior, spans multiple modules, changes contracts, or has unclear acceptance criteria."
---

# Plan implementation from repository evidence


## Purpose and scope
Turn a request into a bounded, repository-aware implementation plan. Planning should reduce risk, not become paperwork.

## Activation conditions
Use for new features, cross-cutting work, ambiguous requirements, schema/API contract changes, and risky refactors. Skip a formal plan for a typo or similarly trivial edit.

## Required context
Read project instructions, Git status, manifests, versions, related code/tests, API/data contracts, and the `templates/feature-plan.md` template when a written plan helps.

## Step-by-step workflow
1. Restate the user outcome and observable acceptance criteria.
2. Inspect the current implementation and trace relevant data/control flow.
3. Identify affected modules, dependencies, contracts, and existing patterns.
4. List edge cases, failure modes, security boundaries, migration/deployment concerns, and unknowns.
5. Separate must-have work from optional improvements and non-goals.
6. Propose the smallest incremental sequence, with verification after each meaningful step.
7. Ask one focused question only if missing information blocks a safe, correct implementation; otherwise state a reasonable, reversible assumption.
8. Update the plan when evidence changes.

## Engineering standards
- Describe affected files/modules based on inspection, not guesses.
- Prefer qualitative complexity (small/medium/large) and explain the driver; do not fabricate time estimates.
- Include loading/error/empty states, validation, observability, and rollback where relevant.
- Preserve architecture and uncommitted work.

## Common anti-patterns
- Planning before inspecting.
- Inventing files, contracts, or dependencies.
- Treating optional polish as required scope.
- Asking many questions whose answers can be safely inferred.
- Producing a plan but never implementing when implementation was requested.

## Security considerations
Map trust boundaries, authorization, sensitive data, and potentially destructive actions. Escalate production/data-loss risks.

## Verification requirements
Each acceptance criterion must map to a test, check, or explicit manual verification step. Verify assumptions against source before implementation.

## Completion-report format
State scope, inspected evidence, implementation sequence, acceptance criteria, risks/unknowns, and planned verification. If implementation was requested, continue beyond planning unless blocked.

