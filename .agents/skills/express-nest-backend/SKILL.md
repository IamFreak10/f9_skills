---
name: express-nest-backend
description: "Use for Express or NestJS endpoints, middleware/guards, DTO validation, API contracts, service layers, error handling, and integration tests."
---

# Design robust Node.js HTTP APIs


## Purpose and scope
Implement maintainable Node.js APIs with explicit validation, authorization, error contracts, and testable business logic.

## Activation conditions
Use for REST endpoints, Express middleware, NestJS modules/controllers/providers, API refactors, request validation, and backend reliability.

## Required context
Inspect package versions, module layout, route/controller conventions, DI setup, validators, auth middleware/guards, error filters, logger/configuration, and API tests.

## Step-by-step workflow
1. Trace route/controller → validation → authorization → service/use case → data access.
2. Define request, response, status code, pagination and error contracts.
3. Reuse existing validators, services, middleware, guards, and logging.
4. Validate external input before business logic.
5. Enforce authorization and ownership before returning or mutating records.
6. Keep business logic testable and avoid mixing transport concerns with domain rules.
7. Add API/integration tests for success, invalid input, unauthenticated, forbidden, missing resource, and failure cases.
8. Run the project's typecheck, lint, tests, and build where available.

## Engineering standards
- **Express:** follow the existing router/controller/service organization; use centralized error middleware and ensure async errors reach it according to the installed Express version/pattern.
- **NestJS:** follow module boundaries, provider injection, DTO/pipe validation, guards for access policy, interceptors for cross-cutting transformations, and exception filters for error mapping.
- Do not assume Express middleware and Nest guards/interceptors are interchangeable.
- Use Zod or existing DTO validation consistently; parse environment variables at startup.
- Use consistent status codes and avoid leaking stack traces/internal SQL.
- Implement pagination limits, stable ordering, and safe filtering for collection endpoints.
- Use transactions for multi-step state changes when required.

## Common anti-patterns
- Business logic in giant route handlers/controllers.
- Trusting TypeScript types for request validation.
- Catching errors and returning success-shaped responses.
- Duplicating authorization logic inconsistently.
- Logging full request bodies, credentials, or tokens.
- Assuming framework APIs from a different major version.

## Security considerations
Validate input, rate-limit sensitive endpoints where appropriate, apply authentication and per-resource authorization, and avoid injection. CORS is not authorization. Keep secrets out of responses/logs.

## Verification requirements
Test request validation, status/error contracts, authn/authz, ownership, pagination, and transactional failure behavior. Verify API documentation/types remain aligned.

## Completion-report format
Report endpoints/modules affected, contract and authorization behavior, tests/checks run, and compatibility assumptions.

