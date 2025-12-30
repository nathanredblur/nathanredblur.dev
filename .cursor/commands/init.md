---
description: Initialize a new project by determining the framework (Astro or Vite+React) and providing installation commands.
---

The user input to you can be provided directly by the agent or as a command argument - you **MUST** consider it before proceeding with the prompt (if not empty).

User input:

$ARGUMENTS

You are initializing a new project. This command helps the user set up a new Astro or Vite+React project with the standard tooling (Tailwind v4, Biome, Vitest, shadcn/ui).

**IMPORTANT**: This command does NOT create `.cursor/` or `.specify/` directories - those are part of the template and should be copied manually from the template repository.

**Reference Documentation**:

- Astro: https://ui.shadcn.com/docs/installation/astro
- Vite: https://ui.shadcn.com/docs/installation/vite

Follow this execution flow:

## Step 1: Gather Project Information

Ask the user these questions (if not provided in $ARGUMENTS):

### Question 1: Project Name

```
What is the name of your project?

Format: lowercase-with-dashes (e.g., my-awesome-app)
```

### Question 2: Framework Choice

```
Which framework would you like to use?

| Option | Framework        | Best For                                          |
|--------|------------------|---------------------------------------------------|
| A      | **Astro**        | Static sites, blogs, content-heavy, marketing     |
| B      | **Vite + React** | SPAs, interactive apps, dashboards, web apps      |

Choose A or B:
```

Wait for user responses before proceeding.

## Step 2: Provide Installation Commands

Once you have the project name and framework choice, provide the appropriate commands:

### For Astro (Option A):

Based on [shadcn/ui Astro installation guide](https://ui.shadcn.com/docs/installation/astro):

```bash
# 1. Create Astro project with Tailwind template (includes React)
pnpm dlx create-astro@latest [PROJECT_NAME] --template with-tailwindcss --install --add react --git

# 2. Navigate to project
cd [PROJECT_NAME]

# 3. Install dev dependencies
pnpm add -D biome vitest @testing-library/react jsdom @types/node

# 4. Initialize Biome
pnpm biome init

# 5. Initialize shadcn/ui
pnpm dlx shadcn@latest init

# 6. Add common shadcn components
pnpm dlx shadcn@latest add button card

# 7. Install Lucide icons (if not already installed)
pnpm add lucide-react

# 8. Install Zustand for state management
pnpm add zustand
```

### For Vite + React (Option B):

Based on [shadcn/ui Vite installation guide](https://ui.shadcn.com/docs/installation/vite):

```bash
# 1. Create Vite project (select React + TypeScript when prompted)
pnpm create vite@latest [PROJECT_NAME] --template react-ts

# 2. Navigate to project
cd [PROJECT_NAME]

# 3. Install dependencies
pnpm install

# 4. Install Tailwind CSS v4
pnpm add tailwindcss @tailwindcss/vite

# 5. Install dev dependencies
pnpm add -D biome vitest @testing-library/react jsdom @types/node

# 6. Install routing (for SPAs)
pnpm add react-router-dom

# 7. Install state management
pnpm add zustand

# 8. Initialize Biome
pnpm biome init

# 9. Initialize shadcn/ui
pnpm dlx shadcn@latest init

# 10. Add common shadcn components
pnpm dlx shadcn@latest add button card

# 11. Install Lucide icons (if not already installed)
pnpm add lucide-react
```

## Step 3: Configuration Files

After the user runs the installation commands, provide these configuration files:

### For Astro - tsconfig.json

Add path aliases to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### For Vite - tsconfig.json

Add path aliases to `tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### For Vite - tsconfig.app.json

Also add to `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### For Vite - vite.config.ts

Update `vite.config.ts`:

```typescript
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### For Vite - src/index.css

Replace everything in `src/index.css` with:

```css
@import "tailwindcss";
```

### biome.json

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedImports": "error",
        "noUnusedVariables": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always"
    }
  }
}
```

### vitest.config.ts

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
```

### tests/setup.ts

Create `tests/setup.ts`:

```typescript
import "@testing-library/jest-dom/vitest";
```

### package.json scripts (add these)

```json
{
  "scripts": {
    "check": "biome check .",
    "check:fix": "biome check --write .",
    "format": "biome format --write .",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage"
  }
}
```

## Step 4: Example Component Usage

### For Astro - src/pages/index.astro

```astro
---
import { Button } from "@/components/ui/button"
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>My Astro App</title>
  </head>
  <body>
    <div class="grid place-items-center h-screen content-center">
      <Button client:load>Click me</Button>
    </div>
  </body>
</html>
```

### For Vite - src/App.tsx

```tsx
import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button>Click me</Button>
    </div>
  );
}

export default App;
```

## Step 5: Final Checklist

Provide this checklist to the user:

```
✅ Project initialized with [FRAMEWORK]
✅ Tailwind CSS v4 configured
✅ Path aliases configured (@/*)
✅ Biome configured for linting/formatting
✅ Vitest configured for testing
✅ shadcn/ui initialized
✅ Lucide icons installed
✅ Zustand installed for state management

📋 Next steps:
1. Copy .cursor/ and .specify/ directories from template (if using workflow)
2. Run `pnpm check` to verify Biome setup
3. Run `pnpm test` to verify Vitest setup
4. Start development with `pnpm dev`

🎉 Happy coding!
```

## Behavior Rules

- If project name contains spaces or uppercase, normalize it to lowercase-with-dashes
- Always use PNPM - never suggest npm or yarn
- Do not create any files directly - only provide commands and file contents for the user to create
- Do not create `.cursor/` or `.specify/` directories
- Ask questions one at a time if user hasn't provided all info
- Provide copy-pasteable commands
- Reference the official shadcn/ui documentation when applicable
