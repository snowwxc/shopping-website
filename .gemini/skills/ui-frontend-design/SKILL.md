---
name: ui-frontend-design
description: Design and implement modern, responsive, and artisanal UI for the Wood Carving Website using Angular Material and Vanilla CSS. Use when designing product galleries, admin dashboards, checkout flows, or applying the "wood carving" aesthetic.
---

# UI Frontend Design Skill

This skill provides guidance for creating a cohesive, high-quality UI for an artisanal wood carving website. It emphasizes a balance between natural, rustic aesthetics and modern, performant web design.

## Core Design Principles

- **Artisanal Quality:** Reflect the craftsmanship of wood carving. Use subtle textures (if appropriate), warm colors, and elegant typography.
- **Natural Palette:** Rely on wood-inspired tones (Oak, Walnut, Pine), sage greens, and off-whites. Avoid harsh blacks and pure whites.
- **Visual Hierarchy:** Use generous whitespace and elevation (Angular Material `mat-card`) to showcase high-quality product photography.
- **Responsive & Accessible:** Ensure all components are mobile-friendly and meet WCAG accessibility standards.

## Tech Stack Guidelines

- **Angular Material:** The foundation for all UI components. Use `MatToolbar`, `MatCard`, `MatButton`, `MatTable`, etc.
- **Vanilla CSS:** Use for custom styling that goes beyond Material defaults. Prefer CSS Variables for design tokens.
- **Material Icons:** Use for intuitive navigation and actions.
- **Responsive Layouts:** Use CSS Flexbox and Grid.

## Workflows

### 1. Designing a New Page
1.  **Define Layout:** Use `MatSidenav` or a standard toolbar/header structure.
2.  **Component Selection:** Identify the appropriate Material components (e.g., `MatTable` for orders, `MatCard` for products).
3.  **Apply Tokens:** Use the [design-tokens.md](references/design-tokens.md) to apply consistent colors and typography.
4.  **Custom Styling:** Add specific "wood carving" touches (e.g., subtle rounded corners, custom shadows) in the component's CSS file.

### 2. Styling a Material Component
To customize a Material component while maintaining its core functionality:
-   Use CSS variables defined in `src/styles.css` (or equivalent).
-   Avoid global overrides; target specific component classes.
-   Example: `mat-card { background-color: var(--color-surface); border: 1px solid var(--color-border-subtle); }`

## References

- [design-tokens.md](references/design-tokens.md): Colors, typography, and spacing.
- [component-patterns.md](references/component-patterns.md): Specific styling patterns for common components.
