---
name: typescript-engineering
description: "Use for TypeScript design, compiler errors, API contracts, async error handling, JavaScript-to-TypeScript migration, and type-safe refactors."
---

# Apply safe, expressive TypeScript


## Purpose and scope
Improve type safety without hiding runtime uncertainty or creating abstractions that exceed the problem.

## Activation conditions
Use when authoring/refactoring TypeScript, resolving type errors, defining API/DTO contracts, handling unknown data, or migrating JavaScript.

## Required context
Inspect `tsconfig`, package scripts, installed TypeScript/framework versions, lint rules, nearby types, runtime validators, and existing error conventions.

## Step-by-step workflow
1. Find the actual boundary where values enter the system.
2. Separate compile-time guarantees from runtime validation.
3. Infer types from existing contracts where possible; define explicit types for public boundaries.
4. Use narrowing, type guards, discriminated unions, and generics only when they improve correctness/readability.
5. Model failure paths explicitly and preserve useful error context.
6. Update callers and tests with the contract change.
7. Run the project typecheck, lint, and focused tests when available.

## Engineering standards
- Prefer inference for obvious local values and explicit types at public boundaries.
- Use `unknown` for untrusted values, narrow before use, and use `never` for exhaustiveness checks.
- Validate JSON, environment variables, request bodies, and external API responses at runtime (e.g. with existing Zod schemas).
- Treat serialization, dates, numeric precision, nullability, and error shapes as contract concerns.
- Use discriminated unions for mutually exclusive states.
- Handle rejected promises intentionally; avoid floating promises unless the project explicitly supports them.
- Catch `unknown` and narrow it; do not assume every thrown value is an `Error`.

## Common anti-patterns
- `any`, blanket `as` casts, `@ts-ignore`, non-null assertions, and disabling strict checks to silence errors.
- Duplicating schema and type definitions without a clear source of truth.
- Overengineering generic utilities for one call site.
- Assuming TypeScript types validate HTTP/database/runtime data.

## Security considerations
Validate and normalize untrusted input. Do not log credentials or sensitive payloads. Avoid unsafe HTML, dynamic code execution, and unchecked deserialization.

## Verification requirements
Run the configured typecheck and relevant tests; inspect changed call sites and serialized API shapes. If checks are unavailable, report that precisely.

## Completion-report format
Summarize contract/type changes, runtime validation boundaries, checks run and outcomes, and any remaining unsafe edges.

