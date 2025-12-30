# Getting Started

This workspace is pre-configured with **Cursor rules** and **Spec-Driven Development** workflow using [GitHub Spec-Kit](https://github.com/github/spec-kit).

## 🛠️ Tech Stack

| Technology       | Version/Notes                                    |
| ---------------- | ------------------------------------------------ |
| **Framework**    | Astro (SSG/SSR) or Vite + React (SPA)            |
| **Language**     | TypeScript (strict mode)                         |
| **Styling**      | Tailwind CSS v4                                  |
| **Components**   | shadcn/ui (installed on-demand)                  |
| **Icons**        | Lucide React                                     |
| **Linting**      | Biome                                            |
| **Testing**      | Vitest                                           |
| **Package Mgr**  | pnpm (required)                                  |

## 🚀 Quick Start

### Option A: Astro Project (Static Sites, Blogs, Content)

```bash
pnpm dlx create-astro@latest . --template with-tailwindcss --install --add react --git
pnpm dlx shadcn@latest init
```

### Option B: Vite + React Project (SPAs, Dashboards)

```bash
pnpm create vite@latest . --template react-ts
pnpm add tailwindcss @tailwindcss/vite -D
pnpm dlx shadcn@latest init
```

## 📁 Project Structure

```
src/
├── components/
│   └── ui/           # shadcn/ui components
├── pages/            # Routes/pages
├── layouts/          # Layout components
├── stores/           # Zustand stores
├── lib/              # Utilities
└── styles/
    └── globals.css   # Tailwind imports + theme
```

## 🎯 Spec-Kit Commands

Use these commands in Cursor to leverage Spec-Driven Development:

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `/init`              | Initialize a new feature spec            |
| `/speckit.specify`   | Generate specification from requirements |
| `/speckit.plan`      | Create implementation plan               |
| `/speckit.tasks`     | Break down plan into tasks               |
| `/speckit.implement` | Execute the implementation               |

## 📚 References

- [shadcn/ui Astro Docs](https://ui.shadcn.com/docs/installation/astro)
- [shadcn/ui Vite Docs](https://ui.shadcn.com/docs/installation/vite)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Spec-Kit](https://github.com/github/spec-kit)

---

**Note:** Cursor rules are located in `.cursor/rules/` and the project constitution is in `.specify/memory/constitution.md`.

