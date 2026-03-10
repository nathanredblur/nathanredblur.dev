# nathanredblur.dev

Personal blog and portfolio — **[nathanredblur.dev](https://nathanredblur.dev/)**

Built with [Astro](https://astro.build), [Svelte](https://svelte.dev), and [Tailwind CSS](https://tailwindcss.com). Deployed on Cloudflare Workers.

## Development

```sh
pnpm install       # Install dependencies
pnpm dev           # Start dev server at localhost:4321
pnpm build         # Build for production
pnpm preview       # Preview production build locally
```

## Writing Posts

```sh
pnpm new-post <filename>   # Scaffold a new post in src/content/posts/
```

Post frontmatter:

```yaml
---
title: Post Title
published: 2024-01-01
description: A short description.
image: ./cover.jpg
tags: [Tag1, Tag2]
category: Category
draft: false
---
```

## Deploy

```sh
pnpm cloudflare:preview   # Preview on Cloudflare
pnpm cloudflare:deploy    # Deploy to Cloudflare Workers
```
