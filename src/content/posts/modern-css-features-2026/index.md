---
title: "Modern CSS Features You Should Be Using in 2026"
published: 2026-01-29
description: "Native nesting, @scope, container queries, @property—CSS has evolved dramatically. Here's what you need to know."
image: "./cover.png"
tags: [CSS, Web Development, Tutorial]
category: Development
draft: false
---

CSS in 2026 is not the CSS you learned five years ago.

The specification has evolved dramatically, and many features that once required preprocessors like Sass or Less are now native to the language. If you're still writing CSS like it's 2020, you're working harder than you need to.

This article covers the modern CSS features that have changed how I write styles—and might change how you write yours.

## Native CSS Nesting

This was the killer feature of Sass. Now it's just... CSS.

```css
.card {
  padding: 1rem;
  background: white;

  &:hover {
    background: #f5f5f5;
  }

  .header {
    font-size: 1.25rem;
    font-weight: 600;
  }

  @media (min-width: 768px) {
    padding: 2rem;
  }
}
```

The `&` selector works exactly like you'd expect from Sass. Media queries can be nested inside selectors. No build step required.

**Browser support**: 95%+ (all modern browsers)

:::tip
If you're using a preprocessor solely for nesting, you might not need it anymore. Native nesting has excellent support and reduces your build complexity.
:::

## The @scope Rule

This is the feature CSS developers have wanted for decades: **real scoping** without CSS Modules, CSS-in-JS, or BEM naming conventions.

```css
@scope (.card) {
  h2 {
    font-size: 1.5rem;
    color: var(--heading-color);
  }

  button {
    background: var(--primary);
    border: none;
    padding: 0.5rem 1rem;
  }
}
```

Selectors inside `@scope` can only match elements within the scoping root. The `h2` styles won't leak to other parts of your page. It's component-scoped CSS without any tooling.

You can even define scope boundaries:

```css
@scope (.card) to (.card-footer) {
  /* Styles apply to .card but stop at .card-footer */
  p {
    margin-bottom: 1rem;
  }
}
```

**Browser support**: ~80% and improving rapidly

## Container Queries

Media queries ask: "How wide is the viewport?"
Container queries ask: "How wide is this component's container?"

```css
.card {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@container (min-width: 600px) {
  .card-content {
    grid-template-columns: 1fr 2fr;
  }
}
```

This enables truly responsive components. Your card component adapts to its container whether it's in a sidebar, a modal, or a full-width section—no JavaScript required.

**Browser support**: 92%+

:::important
Container queries are a game-changer for component-based architectures. Components become portable and responsive to their context, not just the viewport.
:::

## CSS Custom Properties with @property

CSS variables (`--my-var`) have been around for a while. But `@property` makes them **typed and animatable**:

```css
@property --primary-color {
  syntax: '<color>';
  initial-value: #3366cc;
  inherits: false;
}

@property --rotation {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.button {
  background: var(--primary-color);
  transition: --primary-color 0.3s ease;
}

.button:hover {
  --primary-color: #0044aa;
}

.spinner {
  transform: rotate(var(--rotation));
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { --rotation: 360deg; }
}
```

Before `@property`, you couldn't animate CSS variables—they'd just snap between values. Now they interpolate smoothly.

**Browser support**: 85%+

## Cascade Layers (@layer)

Specificity wars are over. Cascade layers give you explicit control:

```css
@layer reset, base, components, utilities;

@layer reset {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}

@layer base {
  body {
    font-family: system-ui, sans-serif;
    line-height: 1.6;
  }
}

@layer components {
  .button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
  }
}

@layer utilities {
  .text-center { text-align: center; }
  .hidden { display: none; }
}
```

Layers declared later always win over earlier layers, regardless of selector specificity. No more `!important` battles.

**Browser support**: 95%+

## Feature Detection with @supports

Test for feature support before using it:

```css
/* Only apply if the browser supports the feature */
@supports (interpolate-size: allow-keywords) {
  :root {
    interpolate-size: allow-keywords;
  }

  details::details-content {
    transition: height 0.3s ease;
    height: 0;
    overflow: clip;
  }

  details[open]::details-content {
    height: auto;
  }
}

/* Fallback for browsers without support */
@supports not (container-type: inline-size) {
  .card-content {
    /* Use media queries as fallback */
    @media (min-width: 400px) {
      display: grid;
    }
  }
}
```

This is progressive enhancement done right. Use cutting-edge features where supported, provide fallbacks where not.

**Browser support**: 98%+

## The if() Function

CSS now has conditionals:

```css
.element {
  color: if(prefers-color-scheme(dark), white, black);
  padding: if(supports(gap), 0, 0.5rem);
}
```

This eliminates many media queries and simplifies conditional styling.

**Browser support**: Still emerging (check [caniuse.com](https://caniuse.com))

## Native Masonry Layouts

No more JavaScript libraries for masonry:

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  masonry-auto-flow: column;
}
```

**Browser support**: ~70% (check [caniuse.com](https://caniuse.com) for current status)

## Modern Selectors

CSS selectors have gotten much more powerful:

### :has() — The Parent Selector

Select elements based on their children:

```css
/* Cards that contain images */
.card:has(img) {
  padding: 0;
}

/* Form groups with invalid inputs */
.form-group:has(:invalid) {
  border-color: red;
}

/* Navigation with dropdown open */
nav:has(.dropdown.open) {
  z-index: 100;
}
```

### :is() and :where()

Simplify complex selectors:

```css
/* Instead of this */
.card h1, .card h2, .card h3,
.panel h1, .panel h2, .panel h3 {
  margin-bottom: 1rem;
}

/* Write this */
:is(.card, .panel) :is(h1, h2, h3) {
  margin-bottom: 1rem;
}

/* :where() has zero specificity */
:where(.card, .panel) h1 {
  /* Easily overridable */
}
```

**Browser support**: 95%+

## Practical Example: Details Element Animation

Here's a real-world example combining several modern features to create smooth accordion animations:

```css
@supports (interpolate-size: allow-keywords) {
  :root {
    interpolate-size: allow-keywords;
  }

  details {
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;

    &::details-content {
      transition: 
        height 0.3s ease,
        content-visibility 0.3s ease allow-discrete;
      height: 0;
      overflow: clip;
    }

    &[open]::details-content {
      height: auto;
    }

    & summary {
      padding: 1rem;
      cursor: pointer;

      &:hover {
        background: var(--hover-bg);
      }
    }
  }
}
```

This creates a smooth height transition for accordion content using pure CSS—no JavaScript required.

## What This Means for Preprocessors

Many features that justified using Sass, Less, or Stylus are now native:

| Feature | Before | Now |
|---------|--------|-----|
| Variables | `$color` (Sass) | `var(--color)` |
| Nesting | Sass/Less/Stylus | Native CSS |
| Math | `$width * 2` | `calc()` |
| Color functions | `darken()`, `lighten()` | `color-mix()`, `oklch()` |
| Scoping | BEM, CSS Modules | `@scope` |
| Conditionals | Sass `@if` | `@supports`, `if()` |

This doesn't mean preprocessors are dead. They still offer:
- Mixins for complex reusable patterns
- Loops for generating repetitive code
- Build-time compilation for zero-runtime overhead

But for many projects, **native CSS is now sufficient**.

---

**Previous in this series**: [My Hybrid CSS Approach: Tailwind + Native CSS](/posts/my-hybrid-css-approach-tailwind-native-css/) — Why I use both Tailwind and native CSS.

**Next in this series**: [Why I Hate Using StyleX at Work](/posts/why-i-hate-using-stylex-at-work/) — A critical look at CSS-in-JS constraints and what to look for in CSS tools.

---

## Resources

- [MDN: CSS Nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting)
- [MDN: @scope](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope)
- [MDN: Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [MDN: @property](https://developer.mozilla.org/en-US/docs/Web/CSS/@property)
- [W3C: CSS Cascade Layers](https://www.w3.org/TR/css-cascade-5/)
- [CSS Author: Best CSS Preprocessor Tools](https://cssauthor.com/best-css-preprocessor-tools/)
