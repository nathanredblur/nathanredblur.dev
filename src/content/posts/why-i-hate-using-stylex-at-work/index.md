---
title: "Why I Hate Using StyleX at Work"
published: 2026-01-29
description: "I use StyleX daily at my job. Here's why I think it's over-engineered for 99% of projects—and what I look for in CSS tools instead."
image: "./cover.png"
tags: [CSS, StyleX, Web Development, Opinion]
category: Development
draft: true
---

I use StyleX every day at work. And I hate it.

Don't get me wrong—StyleX solves real problems at Meta scale. It powers Facebook, Instagram, WhatsApp, and Threads. The engineering behind it is impressive. But after months of daily use, I've concluded that **StyleX is over-engineered for 99% of projects.**

This article is my honest critique, along with what I actually look for in CSS tools.

## What StyleX Promises

StyleX is Meta's CSS-in-JS solution that compiles to atomic CSS. The pitch is compelling:

- **No specificity wars**: Everything becomes atomic classes
- **Type safety**: Styles defined in TypeScript objects
- **Zero runtime**: Compiles away at build time
- **Deterministic**: No cascade surprises

```tsx
const styles = stylex.create({
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#0066cc',
    color: 'white',
    ':hover': {
      backgroundColor: '#0044aa',
    },
  },
});

export function Button({ children }) {
  return <button {...stylex.props(styles.button)}>{children}</button>;
}
```

Sounds great, right? Here's where it falls apart.

## The Deal-Breakers

### No Arbitrary Selectors

StyleX explicitly forbids styling child elements. You cannot write:

```tsx
// THIS IS NOT ALLOWED IN STYLEX
const styles = stylex.create({
  container: {
    '> p': {
      color: 'blue', // ❌ Forbidden
    },
  },
});
```

This is a philosophical decision: styling "at a distance" is considered problematic. But in practice, **it's crippling.**

Real-world example: A form where the last row has no margin-bottom.

In normal CSS:

```css
form > div:last-child {
  margin-bottom: 0;
}
```

In StyleX, you must create a wrapper component or pass a prop to each element. This adds boilerplate and breaks component abstraction.

StyleX doesn't support:
- `:first-child`, `:last-child`, `:nth-child()`
- Sibling combinators (`+`, `~`)
- Attribute selectors (`[data-*]`)
- Many pseudo-elements

These are **fundamental CSS features**, removed in the name of "static resolvability."

### Parent-Child Hover Is a Nightmare

Something as simple as "when the parent is hovered, style the child" becomes a multi-file ordeal:

In CSS:

```css
.parent:hover .child {
  opacity: 1;
  transform: translateY(0);
}
```

In StyleX, you need to:
1. Track hover state in React
2. Pass it as a prop to child components
3. Apply conditional styles based on that prop

What was one line of CSS becomes 20+ lines of JavaScript boilerplate.

### Debugging Hell

StyleX creates atomic classes for every declaration. A simple button generates:

```html
<button class="x1abc x2def x3ghi x4jkl x5mno x6pqr x7stu ...">
```

In DevTools, finding which class does what is detective work. But it gets worse.

StyleX sometimes generates `:not(#\#)` selectors as a polyfill for CSS cascade layers. While these gzip well, **they make debugging in browser DevTools nearly impossible.**

### Static-Only Limitations

`stylex.create()` cannot be used at runtime. All styles must be statically analyzable and compiled away. This means:

- No truly dynamic styles based on runtime props
- CSS variables are the only escape hatch
- You're constantly working around the system

### Ecosystem Immaturity

StyleX was open-sourced in December 2023. Compared to mature tools:
- Smaller community
- Less documentation for edge cases
- Fewer IDE plugins and tooling
- Limited third-party examples

## What I Actually Look for in CSS Tools

After years of using Sass, Less, Stylus, PostCSS, and now StyleX, here's my criteria for evaluating CSS tools:

### 1. Doesn't Limit Native CSS Features

A good tool should enhance CSS, not restrict it. I want access to:
- Container queries
- `@scope`
- Native nesting
- `@property`
- All selectors (`:has()`, `:nth-child()`, sibling combinators)

Any tool that says "you can't use fundamental CSS features" is a red flag.

### 2. Allows Component Organization

I want to colocate styles with components. Whether that's:
- CSS Modules
- CSS-in-JS that compiles to static CSS
- Scoped CSS files

The key is **organization, not runtime overhead**.

### 3. Static CSS at Build Time

Runtime CSS generation (like older styled-components) adds JavaScript overhead. I prefer tools that compile to static CSS:
- Zero runtime performance impact
- Better caching
- Smaller JavaScript bundles

### 4. Smart Optimization

A great tool should:
- Remove unused CSS (tree-shaking)
- Deduplicate styles (atomic CSS is fine for this)
- Integrate with IDE (autocomplete, type checking)
- Generate source maps for debugging

### 5. Doesn't Require Learning a New Language

This is lower priority, but matters. Features like Sass variables (`$color`) or loops (`@for`) were useful when CSS lacked them. Now CSS has:
- Native variables (`var(--color)`)
- Native nesting
- `calc()` for math

Preprocessor-specific syntax adds cognitive overhead without proportional benefit.

## Alternatives That Actually Work

Here are tools I've personally used that meet my criteria:

### Linaria: The Better StyleX

If you want the benefits of StyleX (zero-runtime, type-safe, component colocation) without its crippling limitations, **Linaria is the answer**.

```tsx
import { css } from '@linaria/core';
import { styled } from '@linaria/react';

// CSS tag for class names
const button = css`
  padding: 0.5rem 1rem;
  background: #0066cc;
  
  &:hover {
    background: #0044aa;
  }
  
  /* Child selectors work! */
  & > .icon {
    margin-right: 0.5rem;
  }
  
  /* :last-child works! */
  &:last-child {
    margin-bottom: 0;
  }
`;

// Styled components syntax
const Container = styled.div`
  display: flex;
  
  /* Parent-child hover - ONE LINE, not 20 */
  &:hover .child {
    opacity: 1;
    transform: translateY(0);
  }
`;
```

**What Linaria gets right:**

| Feature | StyleX | Linaria |
|---------|--------|---------|
| Zero runtime | ✅ | ✅ |
| Type-safe (TypeScript) | ✅ | ✅ |
| Static CSS at build time | ✅ | ✅ |
| Child selectors (`:first-child`, etc.) | ❌ | ✅ |
| Sibling combinators (`+`, `~`) | ❌ | ✅ |
| Parent-child hover patterns | ❌ | ✅ |
| Standard CSS syntax | ❌ | ✅ |
| Easy debugging in DevTools | ❌ | ✅ |

Linaria compiles to regular CSS files. No atomic class explosion. No `:not(#\#)` nightmare. Just... CSS.

The trade-off? Linaria doesn't have StyleX's strict architectural constraints. But for 99% of projects, **those constraints are the problem, not the solution**.

### PostCSS

The plugin-based approach. You add only what you need:
- [Autoprefixer](https://github.com/postcss/autoprefixer) for vendor prefixes
- [cssnano](https://cssnano.co/) for minification
- [postcss-preset-env](https://preset-env.cssdb.org/) for future CSS features

PostCSS doesn't limit what CSS you can write—it enhances it.

### Lightning CSS

Written in Rust, [100x faster](https://lightningcss.dev/docs.html) than JavaScript alternatives. It handles:
- Vendor prefixing
- CSS minification
- Modern CSS transpilation
- CSS Modules

Built by the Parcel team, it integrates seamlessly with Vite, webpack, and other bundlers. I haven't used it extensively yet, but the performance benchmarks are impressive and it's worth exploring for build-time optimization.

### The Classics: Sass, Less, Stylus

I've used all three professionally:

- **Sass**: The most powerful. Excellent for large design systems with complex mixins and functions. The ecosystem is massive.
- **Less**: Bootstrap's choice. Gentler learning curve, closer to vanilla CSS syntax.
- **Stylus**: Most flexible syntax. Great for Node.js projects.

These days, I find myself reaching for them less often because native CSS has caught up. But they're still solid choices if your team is already invested.

## The Verdict

StyleX makes sense at Meta scale:
- Thousands of engineers
- Strict style consistency requirements
- Need for guaranteed zero specificity conflicts

For everyone else? The constraints outweigh the benefits.

**Use StyleX if:**
- You're at mega-scale (thousands of developers)
- You need guaranteed zero specificity issues
- Your team specifically wants strict component styling constraints

**Skip StyleX if:**
- You want to use modern CSS features freely
- You need arbitrary selectors (`:first-child`, sibling combinators)
- You value debugging ease over architectural purity
- You're a team of fewer than 50 developers

My recommendation for most teams:

1. **Tailwind** for rapid styling and consistency
2. **Native CSS** for complex selectors and new features
3. **PostCSS** for optimization and future CSS support
4. **Linaria** if you specifically need CSS-in-JS with zero runtime

The future of CSS isn't about finding the one perfect tool. It's about choosing tools that **enhance your workflow without limiting what CSS can do.**

---

**Previous in this series**: [Modern CSS Features You Should Be Using in 2026](/posts/modern-css-features-2026/) — The native CSS capabilities that make many tools unnecessary.

**First in this series**: [My Hybrid CSS Approach: Tailwind + Native CSS](/posts/my-hybrid-css-approach-tailwind-native-css/) — Why I use both Tailwind and native CSS.

---

## Resources

- [StyleX Documentation](https://stylexjs.com/)
- [Linaria: Zero-runtime CSS in JS](https://github.com/callstack/linaria)
- [Linaria Website](https://linaria.dev/)
- [Lightning CSS Documentation](https://lightningcss.dev/docs.html)
- [PostCSS](https://postcss.org/)
- [CSS Author: 20 Best CSS Preprocessor Tools](https://cssauthor.com/best-css-preprocessor-tools/)
