---
name: ui-system
description: "Use for Tailwind CSS, shadcn/ui, design tokens, responsive layout, component reuse, keyboard interaction, and visual consistency."
---

# Maintain consistent, accessible UI systems


## Purpose and scope
Deliver UI that fits the project's design system, works across screen sizes, and remains accessible and maintainable.

## Activation conditions
Use for styling, reusable UI components, Tailwind configuration, shadcn/ui, responsive behavior, accessibility, and visual regressions.

## Required context
Inspect Tailwind version/configuration, CSS entry points, design tokens, shadcn component variants, icon library, typography, and existing visual patterns.

## Step-by-step workflow
1. Identify the current design tokens and reusable components.
2. Check whether Tailwind is v3 or v4 before changing configuration/import syntax.
3. Reuse existing shadcn/ui primitives and local wrappers rather than copying a different project's conventions.
4. Define responsive behavior and interaction states before polishing details.
5. Use semantic markup, accessible names, keyboard navigation, focus indicators, and contrast.
6. Verify mobile, desktop, long-content, loading, empty, error, and disabled states as applicable.
7. Run visual/component tests or inspect the app if the environment supports it.

## Engineering standards
- **Tailwind v3:** inspect `tailwind.config.*`, content globs, and CSS directives before edits.
- **Tailwind v4:** inspect CSS-first configuration and installed integration; do not paste v3 setup instructions by default.
- Keep spacing, typography, colors, radii, and shadows token-driven where the project supports tokens.
- Prefer semantic variants and composable primitives over repeated arbitrary class strings.
- Ensure forms have labels and errors are programmatically associated.
- Respect reduced motion and avoid relying on color alone to convey status.
- Avoid layout shifts; reserve media dimensions and represent loading intentionally.

## Common anti-patterns
- Mixing Tailwind v3 and v4 configuration styles.
- Replacing an established component system with a new one for one screen.
- Using clickable `div`s where buttons/links are appropriate.
- Removing focus outlines without a replacement.
- Hardcoding inconsistent values across many components.
- Treating visual appearance as proof of accessibility.

## Security considerations
Do not render untrusted HTML. Validate upload types and sizes on the server, not just in the UI. Hide sensitive information in client bundles and error messages.

## Verification requirements
Check responsive breakpoints, keyboard-only interaction, focus visibility, semantic/accessibility attributes, and relevant visual/component tests. Report when browser-level inspection was unavailable.

## Completion-report format
List changed UI primitives/tokens, responsive and accessibility decisions, visual states checked, and actual verification outcomes.

