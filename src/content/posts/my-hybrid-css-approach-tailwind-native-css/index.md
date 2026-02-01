---
title: "My Hybrid CSS Approach: Tailwind + Native CSS"
published: 2026-01-29
description: "I used to hate Tailwind. Now I use it for 80% of my styling—but native CSS handles the rest. Here's why this hybrid approach works."
image: "./cover.png"
tags: [CSS, Tailwind, Web Development]
category: Development
draft: false
---

I used to hate Tailwind.

Every time I needed to style something, I found myself checking the documentation for class names—for things I already knew how to do in CSS. The HTML became a mess of utility classes, and I couldn't shake the feeling that I was learning a framework's syntax instead of using the language I already mastered.

![Tailwind utility class issues](./i-can-finally-see-my-tailwind-classes-without-scrolling.webp)

Then something shifted.

## How I Changed My Mind

After 15+ years of writing CSS, I've tried everything: vanilla CSS, Sass, Less, Stylus, CSS-in-JS solutions, and yes—Tailwind. Each tool promised to solve the "CSS problem," but the problem kept evolving.

What finally clicked for me was realizing that **the best approach isn't dogmatic—it's pragmatic.**

I started appreciating the convenience of styling while creating markup. Instead of context-switching between files, I could see exactly what styles applied to each element. The cognitive load decreased.

But here's the key insight: **Tailwind doesn't replace CSS knowledge—it leverages it.**

## Why Tailwind Works Well with AI Tools

One unexpected benefit I discovered: Tailwind works incredibly well with AI coding assistants like Claude and Cursor. When I describe what I want, the AI can generate Tailwind classes directly in the markup without needing to create separate CSS files or worry about naming conventions.

This is a productivity multiplier. I can say "add a hover effect with a subtle shadow" and get:

```html
<div class="transition-shadow hover:shadow-lg">
```

No file switching. No naming debates. Just results.

## When I Still Reach for Native CSS

Tailwind handles about 80% of my styling needs. But for the remaining 20%, native CSS is not just better—it's the only option.

### 1. Keyframe Animations

Some things are just cleaner in CSS. Here's a blinking cursor effect I use:

```css
.blink::after {
  content: "|";
  animation: blink 1s step-end infinite;
  color: #ec4899;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

Could I use Tailwind's animation utilities? Sure. But defining custom keyframes in `tailwind.config.js` for a one-off effect feels like overkill. Native CSS is simpler here.

### 2. Complex Selectors with Nesting

Modern CSS nesting is powerful. Here's a spoiler component that hides its content until hover:

```css
.custom-md spoiler {
  @apply bg-[var(--codeblock-bg)] hover:bg-transparent px-1 py-0.5 
         overflow-hidden rounded-md transition-all duration-150;

  &:not(:hover) {
    color: var(--codeblock-bg);
    * {
      color: var(--codeblock-bg);
    }
  }
}
```

Notice how I mix `@apply` with native nesting. The `&:not(:hover) *` selector would be awkward (or impossible) to express purely in Tailwind classes. Native CSS handles it elegantly.

### 3. Cutting-Edge Features with @supports

Some CSS features are so new that Tailwind doesn't have utilities for them yet. The `interpolate-size` property enables smooth height transitions for `<details>` elements:

```css
@supports (interpolate-size: allow-keywords) {
  :root {
    interpolate-size: allow-keywords;
  }

  details::details-content {
    transition: height 0.3s ease, content-visibility 0.3s ease allow-discrete;
    height: 0;
    overflow: clip;
  }

  details[open]::details-content {
    height: auto;
  }
}
```

This is CSS at its most powerful—feature detection, pseudo-elements, and properties that don't exist in any framework yet. You can't do this with Tailwind alone.

### 4. When Creating a Component Would Be Overkill

Sometimes you need a one-off style that doesn't warrant a full component. A dashed line between elements:

```css
.dash-line::before {
  content: "";
  position: absolute;
  width: 10%;
  height: 100%;
  left: calc(50% - 1px);
  border-left: 2px dashed var(--line-color);
  pointer-events: none;
  transition: all 0.3s;
  transform: translateY(-50%);
}
```

Creating a React component for this would be over-engineering. A CSS class is the right level of abstraction.

## The Best of Both Worlds

Here's my mental model:

| Use Case | Tool | Why |
|----------|------|-----|
| Spacing, colors, typography | Tailwind | Fast, consistent, AI-friendly |
| Responsive layouts | Tailwind | Breakpoint prefixes are convenient |
| Hover/focus states | Tailwind | `hover:`, `focus:` are intuitive |
| Complex selectors | Native CSS | `&:not(:hover) *` isn't possible in Tailwind |
| Keyframe animations | Native CSS | Cleaner than config file modifications |
| New CSS features | Native CSS | `@supports`, `::details-content`, etc. |
| One-off pseudo-elements | Native CSS | Right level of abstraction |

## My Workflow in Practice

1. **Start with Tailwind** for the basic structure and common patterns
2. **Reach for CSS** when I need selectors Tailwind can't express
3. **Use `@apply`** to bridge the gap when mixing both approaches
4. **Never fight the tool**—if something feels awkward, switch approaches

The goal isn't Tailwind purity or CSS purity. The goal is **shipping good work efficiently.**

## What This Means for You

If you're a CSS purist resisting Tailwind: I get it. I was there. But try it for a week on a real project. The productivity gains are real, especially with AI tools.

If you're all-in on Tailwind: don't forget that native CSS has evolved massively. Features like `@scope`, container queries, and native nesting might surprise you. Sometimes vanilla CSS is the simpler solution.

The future isn't Tailwind vs CSS. It's Tailwind **and** CSS, each handling what it does best.

---

**Next in this series**: [Modern CSS Features You Should Be Using in 2026](/posts/modern-css-features-2026/) — A deep dive into the native CSS capabilities that make this hybrid approach possible.
