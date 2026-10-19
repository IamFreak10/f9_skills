---
name: state-management
description: "Use when choosing or debugging React state, Zustand, Redux Toolkit, Context, TanStack Query, persistence, SSR hydration, or duplicated API data."
---

# Choose and implement the right state boundary


## Purpose and scope
Choose the least complex state mechanism that fits the data lifecycle and the project's existing architecture.

## Activation conditions
Use for state architecture decisions, stale/duplicated data, store bugs, persistence, hydration, or introducing/migrating a state library.

## Required context
Inspect dependencies, current stores/hooks, API cache layer, SSR/rendering model, persistence requirements, and tests before proposing a library.

## Decision matrix
| State | Preferred fit | Notes |
|---|---|---|
| Component-only toggle/input/temporary state | `useState` / `useReducer` | Keep close to its owner |
| Small subtree coordination | React Context | Avoid high-frequency broad context updates |
| Shared lightweight client state/UI preferences | Zustand | Use selectors; persist only deliberately |
| Complex centralized transitions, middleware, normalized client domain state, team Redux conventions | Redux Toolkit | Prefer slices/selectors and established async patterns |
| Remote API data, caching, retries, invalidation, request lifecycle | TanStack Query or existing server-state tool | Avoid copying cache data into a client store |
| Form state and validation | Existing form library or local state | Follow installed React Hook Form/Zod patterns |

## Step-by-step workflow
1. Classify each value as local UI, shared client, URL, form, or remote server state.
2. Inspect existing tools and use the current approach unless there is a concrete reason to change.
3. Define ownership, update events, derived values, and invalidation rules.
4. Implement narrow selectors and avoid storing values that can be derived.
5. Consider persistence, SSR, hydration, race conditions, and test isolation.
6. Test state transitions, async failures, and initial render behavior.

## Engineering standards
- **Zustand:** use small stores with explicit actions and selectors; avoid selecting the entire store unnecessarily; keep store creation isolated where request/user-specific state must not leak across SSR requests.
- **Redux Toolkit:** use `createSlice`, typed selectors, normalized entities when useful, and `createAsyncThunk` or established RTK Query patterns when already adopted. Do not hand-roll Redux boilerplate without reason.
- **React Context:** keep provider values stable where needed; split unrelated high-churn contexts.
- **TanStack Query:** use query keys that include relevant identity/parameters, explicit invalidation, and the project's freshness/retry conventions.
- Do not add Zustand and Redux together unless separate, justified bounded responsibilities are documented.
- Avoid storing access tokens, session secrets, or sensitive personal data in persistent browser storage.
- Persist only durable preferences or explicitly required state; version and validate persisted shapes.
- Avoid browser APIs at module initialization or during server render; handle hydration deliberately.

## Common anti-patterns
- Putting all state in a global store.
- Mirroring query-cache data into Redux/Zustand without a clear requirement.
- Adding a new library before inspecting dependencies.
- Creating singleton mutable user state on the server.
- Persisting secrets or assuming localStorage is secure.
- Overusing effects to synchronize duplicate copies of state.

## Security considerations
Treat persisted state as user-controlled and potentially stale. Never use client state as an authorization source. Clear user-scoped state on sign-out/account switch as appropriate.

## Verification requirements
Test selectors, transitions, persistence migration/reset, async loading/error paths, cache invalidation, and SSR/hydration where applicable. Run existing type and lint checks.

## Completion-report format
Explain why the chosen state boundary/tool fits, what data remains server-owned, how hydration/persistence are handled, and which checks ran.

