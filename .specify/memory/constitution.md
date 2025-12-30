# Project Constitution

## Core Principles

### I. TypeScript-First (NON-NEGOTIABLE)

**TypeScript is mandatory in all code files.**

- Use strict types throughout the codebase
- Avoid `any`, prefer `unknown` when type is truly unknown
- Define interfaces for all props and data structures
- Leverage `as const` for static readonly data
- Enable strict mode in `tsconfig.json`

### II. English-Only Codebase

**All technical content MUST be in English.**

- Code comments in English only
- Documentation in English only
- Variable/function names in English only
- Commit messages in English only
- NO exceptions for any language other than English

### III. Tailwind CSS v4 Styling (NON-NEGOTIABLE)

**Tailwind is the sole styling solution.**

- NEVER use `<style>` tags or inline CSS
- NEVER use arbitrary color values like `text-[#c7cfe6]`
- ALWAYS use theme variables or Tailwind's color scale
- Use responsive variants (`sm:`, `md:`, `lg:`) and state classes (`hover:`, `focus:`)
- Configuration via `@import "tailwindcss"` (v4 syntax)
- For Vite projects: Use `@tailwindcss/vite` plugin and `pnpm add tailwindcss @tailwindcss/vite`
- For Astro projects: Use `--template with-tailwindcss` which includes Tailwind pre-configured

### IV. Component Architecture

**Functional components with proper optimization patterns.**

- Static data MUST be defined outside components as constants
- Pure functions MUST be defined outside components
- Use `useCallback`/`useMemo` ONLY when depending on props/state
- Use `React.memo()` for expensive components with stable props
- Components from shadcn/ui when available; Lucide for icons

### V. DRY & Simplicity (YAGNI)

**Reusable components over repeated patterns.**

- Extract common class combinations appearing 3+ times into components
- Avoid prop drilling beyond 3 levels (use Zustand for global state)
- Start simple, YAGNI principles apply
- Focus on code implementation, NOT documentation unless explicitly requested
- No premature optimization - profile first

### VI. Clarification Before Action

**Ask questions before complex tasks.**

- ALWAYS ask clarifying questions before:
  - Creating new files or features
  - Fixing complex bugs
  - Tasks with 4+ steps
  - When there's ambiguity or multiple valid approaches
- Questions should be concise and actionable
- Provide options when applicable (A, B, C format)

## Technology Stack

### Framework Options (Choose ONE per project)

| Option           | Use Case                                    | Command                                                                                       |
| ---------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Astro**        | Static sites, blogs, content-heavy, SSG/SSR | `pnpm dlx create-astro@latest my-app --template with-tailwindcss --install --add react --git` |
| **Vite + React** | SPAs, interactive apps, dashboards          | `pnpm create vite@latest my-app --template react-ts`                                          |

**Reference Documentation**:

- [shadcn/ui Astro Installation](https://ui.shadcn.com/docs/installation/astro)
- [shadcn/ui Vite Installation](https://ui.shadcn.com/docs/installation/vite)

### Required Technologies (All Projects)

- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm (ALWAYS, never npm or yarn)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (install on-demand)
- **Icons**: Lucide React (`lucide-react`)
- **Linting/Formatting**: Biome
- **Testing**: Vitest
- **State**: useState for local, Zustand for global

### Project Structure (NOT Monorepo)

```
project-root/
├── src/
│   ├── components/
│   │   └── ui/           # shadcn/ui components
│   ├── pages/            # Astro pages OR React routes
│   ├── layouts/          # Layout components
│   ├── stores/           # Zustand stores
│   ├── lib/              # Utilities (cn, etc.)
│   └── styles/
│       └── globals.css   # Tailwind imports + theme
├── public/               # Static assets
├── tests/                # Vitest tests
├── biome.json            # Biome config
├── package.json
└── tsconfig.json
```

### Forbidden Patterns

- ❌ Inline styles or `<style>` tags
- ❌ Arbitrary color values in Tailwind classes
- ❌ `any` type without justification
- ❌ Spanish or other non-English in code/comments/docs
- ❌ `useMemo`/`useCallback` for static data or pure functions
- ❌ Creating documentation without explicit request
- ❌ Using npm or yarn (PNPM only)
- ❌ Monorepo structures (single project per repo)
- ❌ ESLint/Prettier (use Biome instead)

## Development Workflow

### Before Each Change

1. Read `package.json` to understand project dependencies
2. Identify if project uses Astro or Vite+React
3. Check for existing reusable components in `src/components/ui/`
4. Verify if shadcn component exists before creating custom UI
5. Identify repetitive patterns and consider creating reusable components
6. Respect existing code conventions

### Before Complex Tasks (4+ steps)

1. **STOP** and ask clarifying questions
2. Understand the full scope before starting
3. Break down into smaller, manageable tasks
4. Confirm approach with user before proceeding

### Code Quality Gates

- No `<style>` tags in any component
- No arbitrary color values - use theme variables
- All props typed with interfaces
- Static data outside components
- Pure functions outside components
- All tests passing (`pnpm test`)
- Biome checks passing (`pnpm check`)

## Framework-Specific Rules

### Astro Projects

- Use `.astro` files for pages and layouts
- Use React components (`.tsx`) for interactive islands
- Leverage `client:*` directives for hydration control
- Prefer `client:visible` or `client:idle` over `client:load`
- Use content collections for blogs/docs
- Static by default, use SSR only when necessary

### Vite + React Projects

- Use React Router for navigation
- Lazy load routes with `React.lazy()`
- Use Suspense boundaries for loading states
- Keep bundle size in mind - code split aggressively

## Testing with Vitest

- Write tests for critical business logic
- Use `describe` and `it` blocks for organization
- Mock external dependencies
- Aim for meaningful coverage, not 100%
- Run tests before commits: `pnpm test`

## Governance

- Constitution supersedes all other practices
- Amendments require documentation and justification
- All code must comply with these principles
- Complexity must be justified against the Simplicity principle

**Version**: 2.0.0 | **Ratified**: 2025-12-30 | **Last Amended**: 2025-12-30
