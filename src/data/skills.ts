export interface SkillCategory {
  id: string;
  label: string;
  blurb: string;
  image: string;
  items: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "ai-agents",
    label: "AI & Agent Engineering",
    blurb: "Designing and orchestrating agent workflows for real product work.",
    image: "/images/categories/ai-agents.png",
    items: [
      "Claude Code",
      "Cursor",
      "MCP (Model Context Protocol)",
      "Agent Orchestration",
      "Prompt Engineering",
      "Skill Authoring",
      "Automation Tooling",
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    blurb: "Shipping polished, accessible UIs with a modern stack.",
    image: "/images/categories/frontend.png",
    items: [
      "React",
      "Next.js",
      "Astro",
      "Svelte",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "TanStack Query",
      "Framer Motion",
    ],
  },
  {
    id: "platform",
    label: "Platform & Infra",
    blurb: "Edge-first delivery, typed APIs, fast builds.",
    image: "/images/categories/platform.png",
    items: [
      "Cloudflare Workers",
      "Vercel",
      "Node.js",
      "GraphQL",
      "Vite",
      "Git",
    ],
  },
  {
    id: "design-dx",
    label: "Design & DX",
    blurb:
      "System design, developer experience, and the research behind the pixels.",
    image: "/images/categories/design-dx.png",
    items: [
      "UX Design",
      "System Design",
      "Developer Experience",
      "Design Systems",
      "Figma",
    ],
  },
];

// Signature stack shown prominently at the top — the tools I reach for every day.
export const signatureStack = [
  "Claude Code",
  "Cursor",
  "Astro",
  "TypeScript",
  "React",
  "Cloudflare Workers",
] as const;

// Flat list consumed by the Hero code block preview.
export const skillsData = [
  "React",
  "Next.js",
  "Astro",
  "TypeScript",
  "Tailwind",
  "Svelte",
  "Claude Code",
  "Cursor",
] as const;

export type Skill = (typeof skillsData)[number];

export const softSkillsData = [
  "Systems Thinking",
  "Technical Leadership",
  "Creative Problem Solving",
  "Critical Thinking",
  "Async Collaboration",
  "Clear Written Communication",
] as const;

export type SoftSkill = (typeof softSkillsData)[number];

// Local SVG icons for skills that have one. Skills without an icon render a
// letter tile fallback in the UI.
export const skillIcons: Record<string, string> = {
  React: "/svg/skills/react.svg",
  "Next.js": "/svg/skills/nextJS.svg",
  Astro: "/svg/skills/astro.svg",
  Svelte: "/svg/skills/svelte.svg",
  TypeScript: "/svg/skills/typescript.svg",
  JavaScript: "/svg/skills/javascript.svg",
  "Tailwind CSS": "/svg/skills/tailwind.svg",
  Tailwind: "/svg/skills/tailwind.svg",
  "shadcn/ui": "/svg/skills/shadcnui.svg",
  "Claude Code": "/svg/skills/claude-ai.svg",
  Cursor: "/svg/skills/cursor.svg",
  "MCP (Model Context Protocol)": "/svg/skills/anthropic.svg",
  "Cloudflare Workers": "/svg/skills/cloudflare.svg",
  Vercel: "/svg/skills/vercel.svg",
  "Node.js": "/svg/skills/nodejs.svg",
  Vite: "/svg/skills/vitejs.svg",
  Git: "/svg/skills/git.svg",
  Figma: "/svg/skills/figma.svg",
  GraphQL: "/svg/skills/graphql.svg",
};

export interface FeaturedSkill {
  name: string;
  proficiency: number;
}

export const featuredSkills: FeaturedSkill[] = [
  { name: "TypeScript", proficiency: 95 },
  { name: "React", proficiency: 95 },
  { name: "Next.js", proficiency: 90 },
  { name: "Astro", proficiency: 85 },
  { name: "AI Agent Tooling", proficiency: 85 },
  { name: "System Design & UX", proficiency: 80 },
];
