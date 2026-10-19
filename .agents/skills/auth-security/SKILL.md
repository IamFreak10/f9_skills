---
name: auth-security
description: "Use for Better Auth, sessions/cookies, OAuth, RBAC, resource ownership, IDOR, CORS/CSRF, rate limiting, and security-sensitive API changes."
---

# Enforce authentication and authorization safely


## Purpose and scope
Protect identity, sessions, resources, and trust boundaries across browser, server, database, and external providers.

## Activation conditions
Use for sign-in/out, OAuth callbacks, session handling, role/permission changes, protected APIs, ownership checks, CORS/CSRF, abuse controls, and vulnerability fixes.

## Required context
Inspect installed Better Auth version and configuration, provider callback URLs, cookie/session settings, middleware/guards, database adapter, deployment origins, and existing security tests/docs.

## Step-by-step workflow
1. Draw the trust boundary and identify the actor, resource, and requested action.
2. Verify current library/version and repository examples; do not invent Better Auth APIs or configuration.
3. Separate authentication (who) from authorization (what they may do).
4. Enforce policy on the server for every protected read/write; scope queries to the authorized user where possible.
5. Validate inputs and state-changing request origins according to the actual session/cookie model.
6. Review OAuth redirect/callback allowlists, cookie flags, CORS, CSRF, session rotation/expiry, and logout semantics.
7. Add negative tests for anonymous, wrong-role, wrong-owner, expired session, invalid input, and replay/CSRF cases where applicable.
8. Review logs and responses for secret/session leakage.

## Engineering standards
- Treat browser state as a convenience, never an authorization source.
- Check ownership on every object-level operation to prevent IDOR.
- Use secure cookie attributes appropriate to HTTPS/deployment; account for localhost development separately.
- Keep OAuth client secrets server-side; use exact registered redirect URIs.
- CORS does not replace authentication or authorization. CSRF mitigations depend on cookie and request architecture.
- Rate-limit sign-in, password recovery, verification, and other abuse-prone endpoints as appropriate.
- Return consistent errors without revealing whether sensitive accounts exist when policy requires generic responses.
- Apply least privilege and validate environment configuration at startup.

## Common anti-patterns
- Trusting a client-supplied user ID or role.
- Protecting UI routes but leaving API endpoints unguarded.
- Guessing auth-library APIs from a different version.
- Storing tokens/session secrets in localStorage without a carefully justified design.
- Broad CORS allowlists with credentials.
- Logging cookies, bearer tokens, OAuth codes, or full auth headers.

## Security considerations
This skill is security-focused: preserve defense in depth, minimize sensitive data, and prefer established library mechanisms. Never disable checks to make a flow work without explaining the risk and obtaining appropriate approval.

## Verification requirements
Run targeted security tests, dependency/config checks where available, and tests for unauthorized access and ownership mismatch. Do not claim a security audit from a small test suite.

## Completion-report format
Report threat boundary, enforcement points, negative tests, configuration assumptions, observed results, and residual risks.

