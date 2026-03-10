# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```sh
pnpm dev              # Start local dev server at localhost:4321
pnpm build            # Build production site + run Pagefind search indexing
pnpm preview          # Preview built site locally
pnpm check            # Run Astro type checking
pnpm type-check       # TypeScript strict mode check with isolated declarations
pnpm lint             # Lint and auto-fix with Biome
pnpm format           # Format code with Biome
pnpm new-post <name>  # Scaffold new blog post in src/content/posts/
pnpm cloudflare:preview  # Preview with Wrangler
pnpm cloudflare:deploy   # Deploy to Cloudflare Workers
```

There are no unit tests — CI validates with `pnpm astro check` and `pnpm astro build`.

## Tech Stack

- **Astro 5** — static site generator, deployed to Cloudflare Workers via `@astrojs/cloudflare`
- **Svelte 5** — used for interactive components (search, theme toggle, archive panel, display settings)
- **Tailwind CSS 3** — utility-first styling with dark mode (class-based)
- **Biome** — linter and formatter (replaces ESLint + Prettier); uses tabs, double quotes
- **Expressive Code** — enhanced code blocks with custom plugins in `src/plugins/expressive-code/`
- **Pagefind** — client-side full-text search, indexed at build time

## Architecture

### Site Configuration

All site-level settings live in **`src/config.ts`**: site title, theme color (HSL hue), banner, navbar links, profile, and license. This is the primary file to edit for site customization.

### Content

Blog posts are Markdown files in `src/content/posts/` with this frontmatter schema:

```yaml
title: string           # required
published: date         # required
description: string     # optional
image: ./cover.jpg      # optional, relative to post or /public
tags: [Tag1, Tag2]      # optional
category: string        # optional
draft: boolean          # default false
lang: en                # only set if different from site lang in config.ts
```

### Data Files

Portfolio data (not blog content) lives in `src/data/`:
- `personal-projects.ts` — project cards with title, description, github, website, screenshot, status, tools
- `experience.ts` — work experience entries
- `skills.ts` — tech skills grouped by category
- `personal-data.ts` — general profile data

### Component Structure

```
src/components/
├── control/      # Interactive UI controls
├── misc/         # ImageWrapper, License, Markdown wrappers
├── portfolio/    # Hero, About, Skills, Experience, Projects, Contact sections
└── widget/       # Sidebar: Profile, Categories, Tags, TOC, Search, DisplaySettings
```

Astro components are used for static content; Svelte components handle interactivity.

### Layouts

- `Layout.astro` — root layout; manages theme (localStorage), custom scrollbars (OverlayScrollbars), PhotoSwipe lightbox, Swup page transitions, and back-to-top button
- `MainGridLayout.astro` — blog/content pages with sidebar
- `PortfolioLayout.astro` — portfolio page layout

### Markdown Processing Pipeline

Remark plugins (pre-HTML): math parsing, GitHub admonitions → directives, custom directives, reading time calculation.
Rehype plugins (post-HTML): KaTeX rendering, heading slugs + autolinks, custom component injection.
Plugin config lives in `astro.config.mjs`. Custom Expressive Code plugins are in `src/plugins/expressive-code/`.

### Theming

Color theming uses CSS HSL variables. The hue value in `src/config.ts` controls the accent color. Dark mode is toggled via a CSS class and persisted in localStorage. The theme is fixed in this config (`fixed: true`, `lightDark: "dark"`).

### Path Aliases

TypeScript path aliases defined in `tsconfig.json`:
`@components/*`, `@assets/*`, `@utils/*`, `@layouts/*`, `@data/*`, `@icons/*`, `@i18n/*`

### Deployment

The site deploys to Cloudflare Workers. The `@astrojs/cloudflare` adapter is configured in `astro.config.mjs`. CI (`.github/workflows/build.yml`) runs `pnpm astro check` and `pnpm astro build` on push/PR to main.
