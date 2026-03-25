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

## Conventions

- **English only** for all code, comments, documentation, and commit messages
- **pnpm only** — enforced via `preinstall` script; never use npm or yarn
- **TypeScript** in all code files
- **Biome** for linting and formatting: tabs for indentation, double quotes. Biome relaxes `useConst`, `useImportType`, `noUnusedVariables`, and `noUnusedImports` for `.svelte` and `.astro` files (framework limitations)
- **Tailwind-only styling** — never use `<style>` tags or inline CSS
- **No arbitrary color values** (e.g., `text-[#c7cfe6]`) — use theme CSS variables or Tailwind's color scale
- **Internal links must end with trailing slash** — Astro generates directories per page (`/posts/my-slug/` not `/posts/my-slug`)

## Tech Stack

- **Astro 5** — static site generator, deployed to Cloudflare Workers via `@astrojs/cloudflare`
- **Svelte 5** — used for interactive components (search, theme toggle, archive panel, display settings)
- **Tailwind CSS 3** — utility-first styling with dark mode (class-based), using `@astrojs/tailwind` integration with nesting enabled
- **Biome** — linter and formatter (replaces ESLint + Prettier)
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

Astro components (`.astro`) are used for static content; Svelte components (`.svelte`) handle interactivity. There are no React/`.tsx` components — use Svelte for interactive islands.

Astro client directives for Svelte components:
- `client:visible` — preferred for most interactive components (lazy hydration)
- `client:idle` — for components needed soon after page load (e.g., search)
- `client:load` — only when immediately needed on page load

### Layouts

- `Layout.astro` — root layout; manages theme (localStorage), custom scrollbars (OverlayScrollbars), PhotoSwipe lightbox, Swup page transitions, and back-to-top button
- `MainGridLayout.astro` — blog/content pages with sidebar
- `PortfolioLayout.astro` — portfolio page layout

### Markdown Processing Pipeline

Remark plugins (pre-HTML): math parsing, GitHub admonitions → directives, custom directives, reading time calculation.
Rehype plugins (post-HTML): KaTeX rendering, heading slugs + autolinks, custom component injection.
Plugin config lives in `astro.config.mjs`. Custom plugins are in `src/plugins/`.

### Theming

Color theming uses CSS HSL variables. The hue value in `src/config.ts` controls the accent color. Dark mode is toggled via a CSS class and persisted in localStorage. The theme is fixed in this config (`fixed: true`, `lightDark: "dark"`).

### Path Aliases

TypeScript path aliases defined in `tsconfig.json`:
`@components/*`, `@assets/*`, `@constants/*`, `@utils/*`, `@layouts/*`, `@i18n/*`, `@/*`

### Deployment

The site deploys to Cloudflare Workers. The `@astrojs/cloudflare` adapter is configured in `astro.config.mjs`. CI (`.github/workflows/build.yml`) runs `pnpm astro check` and `pnpm astro build` on push/PR to main. A separate workflow (`.github/workflows/biome.yml`) runs Biome linting.
