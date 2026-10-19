---
name: ui-system
description: "Use when designing or refining frontend interfaces, responsive layouts, component systems, accessibility, or implementing visual references in any web stack."
---

# Maintain consistent, accessible UI systems


## Purpose and scope
Deliver polished, accessible interfaces that fit the project's framework and design conventions. The principles apply across web technologies; Tailwind and shadcn guidance below is conditional on their presence.

## Activation conditions
Use for frontend UI design/implementation, component systems, styling, responsive behavior, accessibility, visual references, and regressions across web stacks. Apply Tailwind/shadcn-specific guidance only when those tools are present.

## Required context
Inspect the framework, styling and component libraries, CSS entry points, design tokens, icons, typography, and existing visual patterns. Check Tailwind/shadcn versions only when the project uses them. For screenshots, mockups, design exports, or documentation-backed components, also use `reference-driven-build`.

## Step-by-step workflow
1. Identify the current design tokens and reusable components.
2. Identify the active styling and component-system versions before changing their configuration or APIs.
3. Reuse existing primitives and local wrappers rather than copying another project's conventions.
4. Define responsive behavior and interaction states before polishing details.
5. Use semantic markup, accessible names, keyboard navigation, focus indicators, and contrast.
6. Verify mobile, desktop, long-content, loading, empty, error, and disabled states as applicable.
7. Run visual/component tests or inspect the app if the environment supports it.
8. When a screenshot is supplied, record its viewport and compare the rendered result at a similar size. Fix page structure, hierarchy, proportions, and responsive behavior before tuning small decorative details.

## Engineering standards
- **When using Tailwind v3:** inspect `tailwind.config.*`, content globs, and CSS directives before edits.
- **When using Tailwind v4:** inspect CSS-first configuration and installed integration; do not paste v3 setup instructions by default.
- Keep spacing, typography, colors, radii, and shadows token-driven where the project supports tokens.
- Prefer semantic variants and composable primitives over repeated arbitrary class strings.
- Ensure forms have labels and errors are programmatically associated.
- Respect reduced motion and avoid relying on color alone to convey status.
- Avoid layout shifts; reserve media dimensions and represent loading intentionally.
- Derive reusable tokens from repeated visual patterns; avoid isolated pixel coordinates and absolute positioning unless the reference clearly requires it.
- Treat the reference as evidence for visible appearance only. Define sensible responsive, keyboard, focus, hover, and error behavior where the image cannot show it.

## Common anti-patterns
- Mixing Tailwind v3 and v4 configuration styles.
- Replacing an established component system with a new one for one screen.
- Using clickable `div`s where buttons/links are appropriate.
- Removing focus outlines without a replacement.
- Hardcoding inconsistent values across many components.
- Treating visual appearance as proof of accessibility.
- Calling a design “pixel-perfect” without rendering and comparing it at the reference viewport.

## Security considerations
Do not render untrusted HTML. Validate upload types and sizes on the server, not just in the UI. Hide sensitive information in client bundles and error messages.

## Verification requirements
Check responsive breakpoints, keyboard-only interaction, focus visibility, semantic/accessibility attributes, and relevant visual/component tests. Report when browser-level inspection was unavailable.

## Completion-report format
List changed UI primitives/tokens, responsive and accessibility decisions, visual states checked, and actual verification outcomes.

