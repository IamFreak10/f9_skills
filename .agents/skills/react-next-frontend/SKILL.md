---
name: react-next-frontend
description: "Use for React component changes, Next.js routing/rendering, Server/Client Component boundaries, data fetching, forms, and frontend bugs."
---

# Build reliable React and Next.js interfaces


## Purpose and scope
Implement accessible, resilient React interfaces while respecting the actual React and Next.js version and router architecture.

## Activation conditions
Use for components, routing, forms, API integration, rendering/hydration issues, frontend performance, and interaction tests.

## Required context
Inspect `package.json`/lockfile, App Router versus Pages Router, React/Next versions, existing component patterns, styling system, fetch/cache conventions, and test setup.

## Step-by-step workflow
1. Trace route → component → data source → mutation flow.
2. Decide whether logic belongs on the server or client using existing conventions.
3. Reuse components, schemas, hooks, and API clients.
4. Implement pending, error, empty, success, and disabled states as applicable.
5. Validate form input at runtime and preserve accessible labels and feedback.
6. Test the user-visible behavior and failure paths.
7. Run relevant lint, typecheck, tests, and build where feasible.

## Engineering standards
- Prefer composition and focused components; keep business logic testable outside presentation when practical.
- In App Router, default to Server Components; add `'use client'` only where browser APIs, state, effects, or event handlers require it.
- In Pages Router, follow its data-fetching and routing conventions; do not transplant App Router APIs blindly.
- Respect framework-version caching defaults and APIs; inspect installed docs and existing usage before assuming behavior.
- Avoid effects for values that can be derived during render; use effects for synchronization with external systems.
- Abort or ignore stale async work where appropriate; avoid waterfalls and unnecessary client bundles.
- Treat URL state, forms, and API response types as explicit contracts.
- Use semantic HTML, keyboard support, visible focus, and reduced-motion considerations.

## Common anti-patterns
- Making an entire route client-rendered without need.
- Accessing `window`/`localStorage` during server rendering.
- Using effects to mirror props or derive simple state.
- Assuming `fetch` caching/invalidation behavior is identical across Next versions.
- Swallowing request errors or rendering blank screens for failure states.
- Adding dependencies before checking existing utilities.

## Security considerations
Never trust client-side authorization. Keep secrets and privileged operations server-side. Sanitize untrusted content and avoid unsafe HTML injection. Protect authenticated mutations with the application's established CSRF/session model.

## Verification requirements
Test rendering and user interactions, error/loading states, keyboard behavior, hydration-sensitive paths, and relevant type/lint/build checks.

## Completion-report format
Report route/components changed, server/client boundary decisions, user-visible behavior, accessibility considerations, and actual checks/results.

